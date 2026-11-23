"""Read back every staged verse and book, producing a metadata-only review receipt."""

import gzip
import json
import re
import zipfile
from stage import APPROVED, ROOT, RAW, db, digest, manifest, q
from usfm import project


def assess(id):
    m = manifest(id)
    sha = m["sha256"]
    cond = f"edition={q(id)} AND checksum={q(sha)}"
    summary_text = db(
        f"SELECT json_build_object('ledger',ledger_sha256,'evidence_at',evidence_at,'result',result) FROM staging.import WHERE {cond}"
    )
    receipt = json.loads(summary_text)
    ledger = RAW / "bible-texts/staging" / id / sha / (receipt["ledger"] + ".jsonl.gz")
    blob = ledger.read_bytes()
    if digest(blob) != receipt["ledger"]:
        raise ValueError(f"{id}: ledger checksum differs")
    rows = db(f"""SELECT book,chapter,ordinal,label,plain_sha256,
      encode(sha256(convert_to(text_plain,'UTF8')),'hex'),text_nfc=normalize(text_plain,NFC)
      FROM staging.verse WHERE {cond}""")
    actual = {}
    for line in rows.splitlines():
        book, ch, ordinal, label, recorded, computed, nfc = line.split("|")
        if recorded != computed or nfc != "t":
            raise ValueError(
                f"{id} {book} {ch}:{label} database text checksum or normalization differs"
            )
        actual[book, ch, int(ordinal), label] = computed
    projected_hashes = {}
    with zipfile.ZipFile(ROOT / m["raw_path"]) as z:
        books = {}
        for member in m["inventory"]["files"]:
            if not member["path"].lower().endswith((".usfm", ".sfm")):
                continue
            data = z.read(member["path"])
            book = re.search(rb"\\id ([A-Z0-9]{3})", data)[1].decode()
            books[book] = data
            row = db(f"""SELECT json_build_array(encode(usj_gzip,'hex'),
                (SELECT coalesce(json_agg(json_build_array(chapter,preceding_label,kind,node)
                   ORDER BY seq),'[]') FROM staging.annotation WHERE {cond} AND book={q(book)}))
                FROM staging.book WHERE {cond} AND book={q(book)}""")
            usj, stored_annotations = json.loads(row)
            tree = json.loads(gzip.decompress(bytes.fromhex(usj)))
            projected, verses, annotations = project(tree)
            if (
                projected != book
                or [list(a) for a in annotations] != stored_annotations
            ):
                raise ValueError(f"{id} {book}: staged book or annotation mismatch")
            for ch, label, value, _ in verses:
                # Read-back projected USJ must match the exact original independent rendering in the ledger.
                projected_hashes[book, ch, label] = digest(value.encode())
        for line in gzip.decompress(blob).splitlines():
            book, ch, n, label, start, end, source_sha, text_sha = json.loads(line)
            if (
                digest(books[book][start:end]) != source_sha
                or actual.pop((book, ch, n, label)) != text_sha
                or projected_hashes.pop((book, ch, label)) != text_sha
            ):
                raise ValueError(
                    f"{id} {book} {ch}:{label} source/ledger/staging mismatch"
                )
    if actual or projected_hashes:
        raise ValueError(f"{id}: unexpected rows")
    gaps = []
    if id == "eng-bsb":
        for book, ch, next_label, issue in receipt["result"]["label_findings"]:
            first, last = map(int, issue.split()[-1].split("-"))
            for missing in range(first, last + 1):
                number_pattern = rf"\m{missing}\M"
                sql = f"""SELECT DISTINCT preceding_label FROM staging.annotation
                  WHERE {cond} AND kind='footnote' AND book={q(book)} AND chapter={q(ch)}
                  AND preceding_label IN ({q(first - 1)},{q(next_label)})
                  AND jsonb_path_query_array(node,'$.content[*] ? (@.marker == "ft").content')::text
                      ~ {q(number_pattern)} ORDER BY 1"""
                gaps.append(
                    {
                        "book": book,
                        "chapter": ch,
                        "absent_label": str(missing),
                        "adjacent_note_labels_mentioning_number": db(sql).splitlines(),
                    }
                )
    dates = db(
        f"SELECT notice_date,embedded_date,notice_checksum FROM content.version WHERE {cond}"
    ).split("|")
    return {
        **receipt,
        "ledger_path": ledger.relative_to(ROOT).as_posix(),
        "source_notice_date": dates[0],
        "embedded_source_date": dates[1],
        "embedded_notice_sha256": dates[2],
        "bsb_gap_notes": gaps,
        "checked": "archive span, independent plain text, database UTF-8 hash and NFC, stored USJ and ordered annotation projections",
    }


if __name__ == "__main__":
    summary = {id: assess(id) for id in APPROVED}
    if db("SET ROLE ub_reader; SELECT count(*) FROM reader.verses") != "0":
        raise ValueError("staging content visible to reader")
    out = ROOT / "data/manifests/validation/oc04.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n",
        encoding="utf8",
        newline="\n",
    )
    print(
        "All five database readbacks, exact verse ledgers and reader isolation passed."
    )
