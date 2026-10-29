# Base grouplet qualification — 2026-10-28

Scope: optional grouplets collection and existing remote/Source integration.
Node 22.14.0; isolated Python environment, PYTHONPATH=src.

- `npm --prefix js run build`: passed; normal component export and preparation.
- `node --test js/tests/grouplets.test.js js/tests/binding-remote.test.js js/tests/binding-dataremote.test.js js/tests/named-logic.test.js js/tests/binding-cleanup.test.js js/tests/collection-bootstrap.test.js js/tests/collection-artifact.test.js`: 100 passed.
- `.venv/bin/python -m pytest -q tests/test_grouplets.py tests/test_prepared_collections.py tests/test_source_server.py tests/test_page_resources.py tests/test_page_collection_discovery.py`: 64 passed, 95 subtests passed.
- Verified generated descriptor fingerprint and every artifact byte against js/dist/components/grouplets.
- Existing research evidence verifier: 28 checksums, 226 upstream/135 local source files, two historical blobs and 74 discussion records verified.
- Paired plan anchors/local links, new status anchor and whitespace checks passed.

Seven JS tests and two Python tests are new. JSDOM covers rendering, including
actual Python Page/fragment responses with the prepared browser collection.
No full browser or Kajenn host qualification, owner acceptance or publication.
Remote replacement may rebuild DOM while preserving Source identity; the tests
assert semantic identity and isolated Data rather than inventing a DOM guarantee.
