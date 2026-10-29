# Grouplet gallery revision — 2026-10-28

Owner requested useful legacy-derived cases after finding the initial examples
too sparse. This receipt supersedes the earlier examples presentation, while
preserving its historical verification records.

## Legacy evidence consulted

Snapshot: genropy a135c9d949d0b014a22f57c418e83b315f85e7bf,
`../evidence/legacy-sources.tar.gz`.

- `projects/gnrcore/packages/test/webpages/gnrwdg/test_grouplets/01_grouplet_basics.py`:
  complete address/contact fields, explicit value paths, multiple instances.
- Same directory, `08_grouplet_edge_cases.py`: independent handlers and nested
  grouplets. Method dispatch isolation and recursive lazy tabs are not ported here.
- `projects/gnrcore/packages/test/resources/grouplets/examples/address_fields.py`
  and `recursive_grouplet.py`: reusable address and relative nested Data contexts.
- Legacy remote reentry/card/grid teardown test names were also reviewed; their
  distinct queue, form/card and row-lifecycle contracts are not claimed by this slice.

## Revised cases

| Case | User task | Verified behavior |
| --- | --- | --- |
| g01 | Capture private/company customer details | Type-specific Source; drafts and shared contact survive switching |
| g02 | Prepare invoice and delivery addresses | Same editor reused twice; shipping changes do not alter billing |
| g03 | Prepare a maintenance site visit | Nested contact/address and briefing retain edits after outer reload |

Each uses Python @source methods, equivalent JavaScript methods, existing
Source/Data bindings, normal remote calls, sample Data and scoped page CSS.
No persistence, resource catalogue or new core behavior is introduced.

## Verification receipts

- [Seven targeted tests](rich-cases.log): Source parity, workflow behavior and naming/theme.
- [Six protocol/navigation tests](rich-protocol.log): endpoint matrix and gallery navigation.
- [Chromium real Python gallery](rich-browser.log): all three workflows, actual remote
  arguments, complete Code-tab definitions and narrow-view overflow checks pass;
  zero page/HTTP errors.
- Visual captures: [customer](rich-customer.png), [order addresses](rich-order-addresses.png),
  [service visit](rich-service-visit.png).

The real gallery uses unchanged adapter develop
b75f33a10db84328deff56e75499928458846a87 from a temporary committed snapshot.
Examples worktree: `/Users/gporcari/Sviluppo/gramlot/worktrees/grouplets-gallery`.
Preview: http://127.0.0.1:8795/ while the local process runs.
Implemented and locally verified; owner acceptance pending. No publication.
