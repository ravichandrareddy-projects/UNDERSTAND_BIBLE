"""Compose reviewed edition-to-standard claims. Returns references only."""

from collections import defaultdict
from rules import fingerprint


class Edition:
    def __init__(self, version, verses, claims, order):
        self.version = version
        self.verses = verses
        self.books = set(order)
        self.order = {book: i for i, book in enumerate(order)}
        self.claims = defaultdict(list)
        for claim in claims:
            self.claims[tuple(claim["local"])].append(claim)
        self.approved = {}
        self.reason = {}
        self.by_member = defaultdict(set)
        self.blocked_members = set()
        for local, candidates in self.claims.items():
            selected = [c for c in candidates if c["override"]] or candidates
            states = {c["status"] for c in selected}
            shapes = {
                (
                    c["kind"],
                    tuple(c["members"]),
                    tuple(tuple(r) for r in (c.get("group") or [local])),
                )
                for c in selected
            }
            if "DISPUTED" in states or len(shapes) != 1:
                reason = "DISPUTED"
            elif "REVOKED" in states:
                reason = "REVOKED"
            elif states != {"APPROVED"}:
                reason = "PENDING_REVIEW"
            elif (selected[0]["kind"] == "absence") == (local in verses):
                reason = "STALE_SOURCE"
            else:
                self.approved[local] = selected[0]
                for key in selected[0]["members"]:
                    self.by_member[key].add(local)
                continue
            self.reason[local] = reason
            for c in candidates:
                self.blocked_members.update(c["members"])
        self.revision = fingerprint(
            sorted((c["id"], c["status"], c["receipt"]) for c in claims)
        )

    def ordered(self, refs):
        def position(ref):
            b, ch, label = ref
            row = self.verses.get(ref)
            chapter = (0, int(ch)) if ch.isdecimal() else (1, ch)
            return (
                self.order.get(b, len(self.books)),
                chapter,
                row.ordinal if row else 0,
                label,
            )

        return sorted(refs, key=position)


def result(source, target, local):
    def unavailable(reason):
        return {"state": "UNALIGNED", "reason": reason, "source": [local], "target": []}

    if local not in source.verses:
        return unavailable("UNKNOWN_SOURCE_LABEL")
    if local not in source.approved:
        if local[0] not in target.books:
            return unavailable("BOOK_OUTSIDE_TARGET_CANON")
        return unavailable(
            source.reason.get(
                local, "NOTE_ONLY" if not source.verses[local].has_text else "NO_RULE"
            )
        )
    members = set(source.approved[local]["members"])
    left = set()
    right = set()
    todo = list(members)
    while todo:
        member = todo.pop()
        if member in source.blocked_members or member in target.blocked_members:
            return unavailable("OVERLAPPING_UNREVIEWED_CLAIM")
        for edition, side in ((source, left), (target, right)):
            refs = edition.by_member.get(member, ())
            if not refs:
                return unavailable("INCOMPLETE_REVIEWED_GROUP")
            if len(refs) > 1 and any(
                edition.approved[r]["kind"] not in ("split", "merge", "complex")
                for r in refs
            ):
                return unavailable("AMBIGUOUS_MEMBER")
            for ref in refs:
                group = {
                    tuple(item)
                    for item in (edition.approved[ref].get("group") or [ref])
                }
                if not set(refs) <= group or any(
                    item not in edition.approved
                    or {
                        tuple(g)
                        for g in (edition.approved[item].get("group") or [item])
                    }
                    != group
                    for item in group
                ):
                    return unavailable("INCOMPLETE_REVIEWED_GROUP")
                for item in group:
                    for key in edition.approved[item]["members"]:
                        if key not in members:
                            members.add(key)
                            todo.append(key)
                if ref not in side:
                    side.add(ref)
                    for extra in edition.approved[ref]["members"]:
                        if extra not in members:
                            members.add(extra)
                            todo.append(extra)
    missing = [r for r in right if target.approved[r]["kind"] == "absence"]
    if any(source.approved[r]["kind"] == "absence" for r in left) or (
        missing and len(missing) != len(right)
    ):
        return unavailable("PARTIAL_ABSENCE")
    src = source.ordered(left)
    dst = target.ordered(right)
    return {
        "state": "UNALIGNED" if missing else "ALIGNED",
        "reason": "CONFIRMED_ABSENT" if missing else "VERIFIED",
        "source": src,
        "target": [] if missing else dst,
        "absent_references": dst if missing else [],
        "source_members": [
            {
                "local": r,
                "standard": source.approved[r]["members"],
                "kind": source.approved[r]["kind"],
                "claim": source.approved[r]["id"],
            }
            for r in src
        ],
        "target_members": [
            {
                "local": r,
                "standard": target.approved[r]["members"],
                "kind": target.approved[r]["kind"],
                "claim": target.approved[r]["id"],
            }
            for r in dst
        ],
    }
