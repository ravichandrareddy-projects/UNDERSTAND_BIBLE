"""Small, rate-limited client for OC-02's named public sources."""
import hashlib
import json
import os
import tempfile
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError
from urllib.parse import urlsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener
from urllib.robotparser import RobotFileParser

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "data/sources"
AGENT = "UnderstandBible-SourceAudit/1.0"


def now():
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


def digest(data):
    return hashlib.sha256(data).hexdigest()


def save(path, data):
    """Publish complete bytes atomically; keep immutable raw/evidence paths."""
    path.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(dir=path.parent, delete=False) as out:
        tmp = Path(out.name)
        try:
            out.write(data)
        except BaseException:
            out.close()
            tmp.unlink(missing_ok=True)
            raise
    try:
        os.link(tmp, path)
    except FileExistsError:
        if path.read_bytes() != data:
            raise ValueError(f"immutable path has different content: {path}")
    finally:
        tmp.unlink(missing_ok=True)


def write_json(path, value):
    save(path, (json.dumps(value, ensure_ascii=False, indent=2) + "\n").encode())


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


class Client:
    def __init__(self, hosts):
        self.hosts = set(hosts)
        self.rules = {}
        self.next_request = 0
        self.opener = build_opener(NoRedirect())

    def _read(self, url, limit):
        time.sleep(max(0, self.next_request - time.monotonic()))
        self.next_request = time.monotonic() + 1.05
        with self.opener.open(Request(url, headers={"User-Agent": AGENT}), timeout=45) as response:
            data = response.read(limit + 1)
            if len(data) > limit:
                raise ValueError("response exceeds size limit")
            return data

    def get(self, url, limit=64 * 1024 * 1024):
        parts = urlsplit(url)
        if parts.scheme != "https" or parts.netloc.lower() not in self.hosts or parts.fragment:
            raise ValueError(f"unexpected source URL: {url}")
        base = "https://" + parts.netloc.lower()
        if base not in self.rules:
            rules = RobotFileParser()
            try:
                body = self._read(base + "/robots.txt", 1024 * 1024)
            except HTTPError as error:
                if error.code != 404:
                    raise
                body = b""
            rules.parse(body.decode("utf-8-sig").splitlines())
            self.rules[base] = rules
        rules = self.rules[base]
        if not rules.can_fetch(AGENT, url):
            raise PermissionError(f"robots disallows {url}")
        result = self._read(url, limit)
        self.next_request = max(self.next_request, time.monotonic() + (rules.crawl_delay(AGENT) or 0))
        return result


def evidence(client, url):
    data = client.get(url, limit=4 * 1024 * 1024)
    sha = digest(data)
    path = RAW / "evidence" / sha
    save(path, data)
    return {"url": url, "checked_at": now(), "sha256": sha,
            "snapshot": path.relative_to(ROOT).as_posix()}, data
