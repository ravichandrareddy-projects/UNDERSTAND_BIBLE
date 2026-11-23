"""Evaluate the supported TVTMS predicates against one immutable edition inventory."""

import hashlib
import json
import re
from collections import Counter, defaultdict
from dataclasses import dataclass

REFERENCE = re.compile(r"([1-4A-Za-z][A-Za-z0-9]{2})\.(\d+):(\d+)(?:\.(\d+))?")
FORMAT = "oc05-1"


def encoded(value):
    return json.dumps(value, ensure_ascii=False, sort_keys=True, separators=(",", ":"))


def fingerprint(value):
    return hashlib.sha256(encoded(value).encode()).hexdigest()


@dataclass(frozen=True)
class Verse:
    ordinal: int
    sha: str
    has_text: bool


def reference(raw, books):
    match = REFERENCE.fullmatch(raw)
    if not match or match[1].upper() not in books:
        return None
    return (match[1].upper(), match[2], match[3], match[4])


def evaluate(expression, verses, chapters, books):
    facts = []
    for term in expression.strip().split(" & "):
        address, sep, test = term.partition("=")
        ref = reference(address, books)
        if not sep or not ref or ref[3] or test not in ("Exist", "Last", "NotExist"):
            return None
        book, chapter, label = ref[:3]
        row = verses.get(ref[:3])
        if test == "NotExist":
            prior = verses.get((book, chapter, str(int(label) - 1)))
            labels = chapters.get((book, chapter), [])
            if (
                not prior
                or not prior.has_text
                or not labels
                or not all(item.isdecimal() for item in labels)
                or (row and row.has_text)
            ):
                return None
            fact = {
                "test": term,
                "preceding_body_sha256": prior.sha,
                "chapter_labels_sha256": fingerprint(labels),
            }
        elif test == "Exist":
            if row is None or not row.has_text:
                return None
            fact = {"test": term, "body_sha256": row.sha}
        else:
            labels = chapters[book, chapter]
            # Conservative implementation of "exactly N verses": require a complete numeric chapter.
            if (
                not labels
                or labels[-1] != label
                or labels != [str(i) for i in range(1, len(labels) + 1)]
            ):
                return None
            fact = {"test": term, "chapter_labels_sha256": fingerprint(labels)}
        facts.append(fact)
    return facts


def authority_rows(lines):
    """Read only the expanded table, excluding the later appendices."""
    start = next(
        i
        for i, line in enumerate(lines)
        if line.startswith("SourceType\tSourceRef\tStandardRef\tAction\t")
    )
    for i in range(start + 1, len(lines)):
        cells = lines[i].split("\t")
        if cells[0] == "#DataEnd(Expanded)":
            break
        if len(cells) >= 9 and cells[0] and cells[1] and cells[2] and cells[3]:
            yield i + 1, cells


def make_claim(
    source,
    version,
    local,
    members,
    kind,
    evidence,
    origin="scheme",
    confidence="structural",
):
    claim = {
        "format": FORMAT,
        "scheme": source["sha256"],
        "edition": version["edition"],
        "checksum": version["checksum"],
        "ledger": version["ledger"],
        "local": list(local),
        "members": members,
        "kind": kind,
        "origin": origin,
        "confidence": confidence,
        "evidence": evidence,
    }
    claim["id"] = fingerprint(claim)
    return claim


def standard_inventory(lines):
    start = next(
        i
        for i, line in enumerate(lines)
        if line.startswith("SIL abbrev (used in this data)")
    )
    end = next(i for i in range(start + 2, len(lines)) if lines[i].startswith("'===="))
    by_book = defaultdict(set)
    for line in lines[start + 2 : end]:
        cells = line.split("\t")
        if (
            cells[0] == "#DataEnd"
            or len(cells) < 3
            or not re.fullmatch(r"[1-4A-Za-z][A-Za-z0-9]{2}", cells[0])
        ):
            continue
        if not re.fullmatch(r"\d+:\d+(?:;\s*\d+:\d+)*", cells[2].strip()):
            continue
        book = cells[0].upper()
        for entry in cells[2].split(";"):
            chapter, last = map(int, entry.strip().split(":"))
            by_book[book].update(f"{book}.{chapter}.{v}" for v in range(1, last + 1))
    # Include explicit standard subverses and extra coordinates named in the expanded authority table.
    for _, cells in authority_rows(lines):
        ref = reference(cells[2], by_book)
        if ref:
            by_book[ref[0]].add(".".join(x for x in ref if x is not None))
    return by_book


def propose(source, lines, version, verses, books):
    hub_inventory = standard_inventory(lines)
    chapters = defaultdict(list)
    for (book, ch, label), v in sorted(
        verses.items(), key=lambda item: item[1].ordinal
    ):
        chapters[book, ch].append(label)
    stats = Counter()
    matched = defaultdict(list)
    # A single applicability condition may describe several actions on one row.
    # Never offer half of such a rule as a complete one-to-one claim.
    actions = defaultdict(set)
    for _, cells in authority_rows(lines):
        actions[cells[0], cells[1], cells[8]].add((cells[2], cells[3]))
    for number, cells in authority_rows(lines):
        stats["authority_rows"] += 1
        tradition, native, standard, action = cells[:4]
        local = reference(native, books)
        hub = reference(standard, hub_inventory)
        if (
            action not in ("Keep verse", "Renumber verse")
            or not local
            or local[3]
            or not hub
            or len(actions[tradition, native, cells[8]]) != 1
            or "includes the text of" in cells[5].lower()
        ):
            stats["unsupported_action_or_reference"] += 1
            continue
        local = local[:3]
        row = verses.get(local)
        facts = (
            evaluate(cells[8], verses, chapters, books)
            if row and row.has_text
            else None
        )
        if not facts:
            stats["unmet_or_unsupported_predicate"] += 1
            continue
        target = ".".join(v for v in hub if v is not None)
        # Group corroborating lines, retaining conflicting targets as separate candidates.
        matched[local, target].append(
            {
                "line": number,
                "tradition": tradition,
                "action": action,
                "native_ref": native,
                "standard_ref": standard,
                "facts": facts,
            }
        )
        stats["matched_rows"] += 1
    claims = []
    for (local, target), evidence in sorted(matched.items()):
        kind = "identity" if target == ".".join(local) else "renumber"
        claims.append(
            make_claim(
                source,
                version,
                local,
                [target],
                kind,
                {"rules": evidence, "source_verse_sha256": verses[local].sha},
            )
        )
    return claims, dict(stats)


def absence_claims(source, lines, version, verses, books, notes):
    conditional = defaultdict(list)
    for number, cells in authority_rows(lines):
        local = reference(cells[1], books)
        if (
            cells[0] == "AllBibles"
            and cells[3] == "IfEmpty verse"
            and local
            and not local[3]
            and cells[1] == cells[2]
        ):
            conditional[local[:3]].append(number)
    for note in notes:
        local = (note["book"], note["chapter"], note["absent_label"])
        anchors = [
            (local[0], local[1], label)
            for label in note["adjacent_note_labels_mentioning_number"]
        ]
        if local in verses or not anchors or not conditional[local]:
            continue
        evidence = {
            "authority_lines": conditional[local],
            "observation": note,
            "anchors": [{"local": ref, "sha256": verses[ref].sha} for ref in anchors],
            "rationale": "OC-04 found no printed marker and a neighbouring note mentions the number. TVTMS has a conditional missing-text instruction. Editorial confirmation is pending.",
        }
        yield make_claim(
            source,
            version,
            local,
            [".".join(local)],
            "absence",
            evidence,
            "override",
            "corroborated",
        )


def override_claim(source, lines, version, verses, books, record):
    """Edition-specific editorial proposal. Licensed TVTMS and exact private archive evidence only."""
    if (record["edition"], record["checksum"], record["ledger"], record["scheme"]) != (
        version["edition"],
        version["checksum"],
        version["ledger"],
        source["sha256"],
    ):
        raise ValueError("override version or authority differs")
    local = tuple(record["local"])
    members = record["members"]
    kind = record["kind"]
    if len(local) != 3 or not all(isinstance(x, str) and x for x in local):
        raise ValueError("invalid edition-local address")
    hub_inventory = standard_inventory(lines)
    if (
        not members
        or len(set(members)) != len(members)
        or not all(m in hub_inventory.get(m.split(".")[0], ()) for m in members)
    ):
        raise ValueError("invalid ordered standard members")
    row = verses.get(local)
    if kind == "absence":
        labels = [r[2] for r in verses if r[:2] == local[:2]]
        if (
            row
            or not labels
            or not local[2].isdecimal()
            or any(
                (m := re.fullmatch(r"(\d+)-(\d+)", label))
                and int(m[1]) <= int(local[2]) <= int(m[2])
                for label in labels
            )
        ):
            raise ValueError(
                "absence overlaps a native label or lacks an attested chapter"
            )
    elif not row or not row.has_text:
        raise ValueError("override requires an attested source body")
    anchors = record["anchors"]
    if not anchors or not all(
        (v := verses.get(tuple(a["local"]))) and v.sha == a["sha256"] for a in anchors
    ):
        raise ValueError("unverified edition evidence anchors")
    anchor_refs = {tuple(a["local"]) for a in anchors}
    if (kind == "absence" and not all(r[:2] == local[:2] for r in anchor_refs)) or (
        kind != "absence" and local not in anchor_refs
    ):
        raise ValueError("override lacks edition evidence at the proposed location")
    refs = record["authority_lines"]
    authority_refs = {n: cells for n, cells in authority_rows(lines)}
    if (
        not refs
        or not all(i in authority_refs for i in refs)
        or not record["rationale"].strip()
    ):
        raise ValueError("override lacks authority evidence")
    source_chapters = {r[:2] for r in anchor_refs} | {local[:2]}
    standard_chapters = {tuple(m.split(".")[:2]) for m in members}
    if not any(
        (native := reference(authority_refs[i][1], books))
        and native[:2] in source_chapters
        and (standard := reference(authority_refs[i][2], hub_inventory))
        and standard[:2] in standard_chapters
        for i in refs
    ):
        raise ValueError("cited authority does not cover the proposed chapters")
    if kind not in (
        "identity",
        "renumber",
        "bridge",
        "split",
        "merge",
        "complex",
        "absence",
    ):
        raise ValueError("invalid override relation")
    group = [tuple(ref) for ref in record.get("local_group", [local])]
    if (
        not group
        or local not in group
        or len(set(group)) != len(group)
        or (len(group) > 1 and kind not in ("merge", "split", "complex"))
        or (kind != "absence" and not set(group) <= anchor_refs)
    ):
        raise ValueError("incomplete local group evidence")
    return make_claim(
        source,
        version,
        local,
        members,
        kind,
        {
            "anchors": anchors,
            "authority_lines": refs,
            "local_group": group,
            "rationale": record["rationale"],
        },
        "override",
        "editorial",
    )
