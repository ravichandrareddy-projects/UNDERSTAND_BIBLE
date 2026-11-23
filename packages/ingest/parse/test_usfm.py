import unittest
from usfm import parse, project, independent


class UsfmTests(unittest.TestCase):
    def test_edition_labels_text_and_annotations(self):
        src = (
            "\\id TST\n\\mt1 Title\n\\ip Intro\n\\c 1\n\\p\n"
            '\\v 3-4 \\w token|strong="fixture"\\w* and \\wj styled\\wj*.'
            "\\f + \\fr 1:3 \\ft note\\f*\n\\s1 Next\n\\p\n\\v 7 end"
        )
        book, rows, annotations = project(parse(src))
        self.assertEqual(book, "TST")
        self.assertEqual([r[:3] for r in rows], independent(src))
        self.assertEqual(rows[0][:3], ("1", "3-4", "token and styled."))
        self.assertEqual(
            [a[2] for a in annotations],
            ["heading", "introduction", "footnote", "heading"],
        )

    def test_superscription_starts_verse(self):
        src = "\\id TST\n\\c 1\n\\d Title\n\\v 1 A\n\\p B"
        _, rows, ann = project(parse(src))
        self.assertEqual(rows[0][2], "A B")
        self.assertEqual(rows[0][:3], independent(src)[0])
        self.assertEqual(ann[0][3]["content"], ["Title\n"])

    def test_script_codepoints_and_empty_labels(self):
        sample = "తె\u200cలుగు العربية 中文 മ\u200dല e\u0301"
        src = "\\id TST\n\\c 1\n\\p\n\\v 1 " + sample + "\n\\v 2 \\f + \\ft n\\f*"
        _, rows, _ = project(parse(src))
        self.assertEqual(rows[0][2], sample)
        self.assertTrue(rows[0][3].endswith("é"))
        self.assertEqual(rows[1][2], "")
        self.assertEqual([r[:3] for r in rows], independent(src))

    def test_reject_unknown_and_unclosed(self):
        for s in ["\\unknown a", "\\it a", "\\f + \\ft note", "\\w a|unparsed\\w*"]:
            with self.subTest(s=s), self.assertRaises(ValueError):
                parse("\\id TST\n\\c 1\n\\p\n\\v 1 " + s)


if __name__ == "__main__":
    unittest.main()
