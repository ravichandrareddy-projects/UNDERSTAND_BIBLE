"""Strict local USFM-to-USJ reader for the marker vocabulary of the approved pilot."""

import re
import unicodedata

TOKEN = re.compile(r"\\(\+?[a-z][a-z0-9-]*)(\*)?")
BODY = set("b li1 li2 m mi nb p pc pi1 pmo q1 q2 q3".split())
HEAD = set("cl d mr ms1 mt1 mt2 mt3 qa qr r s1 s2 sp".split())
INTRO = set("ili io1 iot ip is1".split())
META = set("h ide toc1 toc2 toc3".split())
NOTE = {"f", "x"}
FIELD = set("fp fq fqa fr ft xo xt".split())
CHAR = set("bd bdit bk it k qs tl w wh wj".split())
BLOCK = BODY | HEAD | INTRO | META
ATTR = re.compile(r'([\w-]+)="([^"]*)"')
SPACE = re.compile(r"[ \t\r\n]+")
NOTE_SPAN = re.compile(r"\\(f|x) .*?\\\1\*", re.S)
INLINE = re.compile(r"\\\+?[a-z][a-z0-9]*(?:\*|[ \t]?)")
WORD_ATTR = re.compile(r"\|[^\\\r\n]*(?=\\\+?w[h]?\*)")


def plain(s):
    return SPACE.sub(" ", s).strip(" ")


def part(s):
    m = re.match(r"([^ \t\r\n]+)(?:[ \t])?(.*)\Z", s, re.S)
    if not m:
        raise ValueError("missing marker argument")
    return m.groups()


def parse(source):
    root = {"type": "USJ", "version": "3.1", "content": []}
    matches = list(TOKEN.finditer(source))
    if not matches or source[: matches[0].start()].strip():
        raise ValueError("unmarked material before book")
    book = chapter = None
    para = root
    stack = []
    for i, m in enumerate(matches):
        tag = m[1].lstrip("+")
        s = source[
            m.end() : matches[i + 1].start() if i + 1 < len(matches) else len(source)
        ]
        if not m[2]:
            s = s.removeprefix(" ")
        if m[2]:
            if tag in NOTE and stack and stack[-1].get("marker") in FIELD:
                stack.pop()
            if not stack or stack[-1]["marker"] != tag:
                raise ValueError(f"unmatched closing {tag} in {book} {chapter}")
            stack.pop()
        elif tag in BLOCK or tag in ("id", "c"):
            if stack:
                raise ValueError(
                    f"open {stack[-1]['marker']} before {tag} in {book} {chapter}"
                )
            if tag == "id":
                book, s = part(s)
                para = {"type": "book", "marker": tag, "code": book, "content": []}
            elif tag == "c":
                chapter, s = part(s)
                para = {
                    "type": "chapter",
                    "marker": tag,
                    "number": chapter,
                    "sid": f"{book} {chapter}",
                }
            else:
                para = {"type": "para", "marker": tag, "content": []}
            root["content"].append(para)
        elif tag == "v":
            label, s = part(s)
            (stack[-1] if stack else para)["content"].append(
                {
                    "type": "verse",
                    "marker": "v",
                    "number": label,
                    "sid": f"{book} {chapter}:{label}",
                }
            )
        elif tag in NOTE | FIELD | CHAR:
            node = {
                "type": "note" if tag in NOTE else "char",
                "marker": tag,
                "content": [],
            }
            if tag in NOTE:
                node["caller"], s = part(s)
            if tag in FIELD:
                if stack and stack[-1]["marker"] in FIELD:
                    stack.pop()
                if not stack or stack[-1]["marker"] not in NOTE:
                    raise ValueError(f"orphan note field {tag} in {book} {chapter}")
            (stack[-1] if stack else para)["content"].append(node)
            stack.append(node)
        else:
            raise ValueError(f"unsupported marker {tag}")
        target = stack[-1] if stack else para
        if target.get("marker") in ("w", "wh") and "|" in s:
            s, attrs = s.split("|", 1)
            if ATTR.sub("", attrs).strip():
                raise ValueError(f"unrecognised word attributes in {book} {chapter}")
            target.update(ATTR.findall(attrs))
        if "content" in target and s:
            target["content"].append(s)
        elif s.strip():
            raise ValueError(f"unexpected chapter payload in {book} {chapter}")
    if stack:
        raise ValueError("unclosed inline marker at end of book")
    return root


def project(tree):
    book = chapter = label = None
    verses, annotations, buf = [], [], []

    def finish():
        if label is not None:
            value = plain("".join(buf))
            verses.append((chapter, label, value, unicodedata.normalize("NFC", value)))
        buf.clear()

    def walk(node):
        nonlocal book, chapter, label
        if isinstance(node, str):
            if label is not None:
                buf.append(node)
            return
        kind = node["type"]
        tag = node.get("marker")
        if kind == "book":
            book = node["code"]
            return
        if kind == "chapter":
            finish()
            chapter, label = node["number"], None
            return
        if kind == "verse":
            finish()
            label = node["number"]
            return
        if kind == "note" or tag in HEAD | INTRO | META:
            # Some BSB superscriptions contain a verse start (ZEC 12:1). Only
            # the material before that milestone belongs exclusively to the heading.
            children = node.get("content", [])
            split = next(
                (
                    i
                    for i, c in enumerate(children)
                    if isinstance(c, dict) and c["type"] == "verse"
                ),
                len(children),
            )
            continuation = children[split:]
            if continuation:
                node = {**node, "content": children[:split]}
            category = (
                "cross_reference"
                if tag == "x"
                else "footnote"
                if kind == "note"
                else "heading"
                if tag in HEAD
                else "introduction"
                if tag in INTRO
                else "metadata"
            )
            annotations.append((chapter, label, category, node))
            if kind != "note":

                def nested(n):
                    for child in n.get("content", []):
                        if isinstance(child, dict):
                            if child["type"] == "note":
                                walk(child)
                            else:
                                nested(child)

                nested(node)
            for child in continuation:
                walk(child)
            return
        if kind == "para":
            buf.append(" ")
        for child in node.get("content", []):
            walk(child)

    walk(tree)
    finish()
    return book, verses, annotations


def independent(source):
    """Second rendering from raw source lines, independent of the USJ traversal."""
    cleaned = NOTE_SPAN.sub("", source)
    chapter = label = None
    rows = []
    fragments = []

    def flush():
        if label is not None:
            rows.append((chapter, label, plain(" ".join(fragments))))
        fragments.clear()

    for line in cleaned.split("\n"):
        line = line.rstrip("\r")
        m = re.match(r"^\\([a-z][a-z0-9]*)\b[ \t]?(.*)$", line)
        if m:
            tag, line = m.groups()
            if tag == "c":
                flush()
                chapter, label = part(line)[0], None
                continue
            if tag == "v":
                flush()
                label, line = part(line)
            elif tag not in BODY:
                continue
        if label is not None:
            fragments.append(INLINE.sub("", WORD_ATTR.sub("", line)))
    flush()
    return rows
