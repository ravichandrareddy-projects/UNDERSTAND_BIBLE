"""Inventory USFM structural markers without normalising verse text or mapping editions."""
import io
import re
import stat
import zipfile
from pathlib import PurePosixPath

from source_io import digest, save

MARKER = re.compile(r"(?:^|(?<=\s))\\(id|c|v)[ \t]+([^ \t\r\n\\]+)", re.MULTILINE)
LABEL = re.compile(r"(\d+)([a-z]?)(?:[-–](\d+)([a-z]?))?", re.ASCII)


def inventory(archive, expected_books, extract_to=None):
    books, files, findings, seen_names = {}, [], [], set()
    with zipfile.ZipFile(io.BytesIO(archive)) as bundle:
        members = bundle.infolist()
        if len(members) > 1000 or sum(m.file_size for m in members) > 256 * 1024**2:
            raise ValueError("unexpected expanded archive size")
        for m in members:
            path = PurePosixPath(m.filename)
            if (path.is_absolute() or ".." in path.parts or "\\" in m.filename
                    or ":" in m.filename or stat.S_ISLNK(m.external_attr >> 16)
                    or m.filename.casefold() in seen_names or m.flag_bits & 1):
                raise ValueError("unsafe, encrypted or repeated ZIP member")
            seen_names.add(m.filename.casefold())
            if m.is_dir():
                continue
            data = bundle.read(m)  # zipfile verifies each member's CRC.
            files.append({"path": m.filename, "bytes": len(data), "sha256": digest(data)})
            if path.suffix.lower() not in (".usfm", ".sfm"):
                continue
            # Materialise selected members under content hashes, never archive-controlled paths.
            if extract_to is not None:
                save(extract_to / (digest(data) + ".usfm"), data)
            book = chapter = None
            chapters = {}
            for marker, token in MARKER.findall(data.decode("utf-8-sig")):
                if marker == "id":
                    if book is not None or token in books:
                        raise ValueError(f"duplicate USFM book ID {token}")
                    book = token
                elif marker == "c":
                    if book is None or token in chapters:
                        raise ValueError(f"invalid chapter {book} {token}")
                    chapter = token
                    chapters[chapter] = []
                else:
                    if chapter is None:
                        raise ValueError(f"verse outside chapter in {m.filename}")
                    chapters[chapter].append(token)
            if book is None:
                raise ValueError(f"missing book identifier in {m.filename}")
            books[book] = chapters

    missing = sorted(set(expected_books) - books.keys())
    unexpected = sorted(books.keys() - set(expected_books) - {"FRT", "INT", "BAK", "GLO", "XXA", "XXB"})
    if missing or unexpected:
        raise ValueError(f"book set mismatch: missing={missing}, unexpected={unexpected}")
    book_counts = {}
    for book in expected_books:
        chapters = books[book]
        if not chapters or list(chapters) != [str(n) for n in range(1, len(chapters) + 1)]:
            raise ValueError(f"missing or unordered chapter markers in {book}")
        for chapter, labels in chapters.items():
            if not labels:
                raise ValueError(f"no verse markers in {book} {chapter}")
            last = 0
            for label in labels:
                match = LABEL.fullmatch(label)
                if not match:
                    findings.append([book, chapter, label, "nonstandard label"])
                    continue
                first, end = int(match[1]), int(match[3] or match[1])
                if first > last + 1:
                    findings.append([book, chapter, label, f"unlabelled interval {last + 1}-{first - 1}"])
                if end < first or first <= last:
                    findings.append([book, chapter, label, "overlap, suffix or reset"])
                if match[3] or match[2]:
                    findings.append([book, chapter, label, "bridge or suffix"])
                last = end
        book_counts[book] = [len(labels) for labels in chapters.values()]
    return {"files": files, "books_in_source_index_order": expected_books,
            "noncanonical_files_by_id": sorted(books.keys() - set(expected_books)),
            "chapter_verse_marker_counts": book_counts, "label_findings": findings,
            "counts": {"books": len(expected_books), "chapters": sum(map(len, book_counts.values())),
                       "verse_markers": sum(sum(counts) for counts in book_counts.values())}}
