-- While D-001 is open, public eligibility requires rights compatible with either model.
CREATE OR REPLACE VIEW reader.translations WITH (security_barrier=true) AS
SELECT e.id,e.language,e.title,e.canon,v.checksum,a.notice,l.terms,l.conditions,e.source_url,
       ARRAY(SELECT x.url FROM content.evidence x WHERE x.edition=e.id ORDER BY x.url) AS evidence_urls
FROM content.edition e JOIN content.version v ON v.edition=e.id
JOIN content.licence l ON l.edition=e.id JOIN content.attribution a ON a.edition=e.id
WHERE v.published AND content.allowed(e.id,'host') AND content.allowed(e.id,'display')
  AND content.allowed(e.id,'commercial');
