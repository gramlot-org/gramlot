# Guides for agents

**Self-contained examples:** each example page contains its application-specific
Page, PageStore, endpoints and helper code. Extract a shared module only when it
is actually reused by other pages. The Code tab must show the complete example;
do not inject application classes or imports from launchers. Framework and
third-party dependencies remain imports and are explained in the lesson.

**Relative-path authoring rule:** give each reusable block a container `datapath`.
Inside that block use fixed relative paths (`.samples`, `^.step`, `^.options`),
including controller GET/SET/FIRE paths. Pass the contextualized Source node to
helper methods; do not pass a base path and concatenate names for each binding.
Creating distinct instance datapaths in a loop is legitimate; generating field
names from a schema is also different from rebuilding a block's context. Absolute
paths require an intentional shared or server-owned contract, explained in the
lesson. Fundamentals that explicitly introduce root Data paths remain introductory
examples, not a pattern for reusable blocks.

**Page-authoring rule:** GramlotServer automatically provides every packaged
standard collection to every site's Page base, in Python and JavaScript. Do not
import `gramlot.collections.*` or repeat `gramlots = [...]` for these collections.
Write component declarations directly. Explicit imports and collection declarations
are for custom additions. A missing standard component is a server/package defect,
not a reason for a one-off page import. The packaged inventory drives grammar and
bootstrap resources; it does not scan installed packages. External engines load on
first use in hosted pages. File exports embed the required resource bytes.

Use one collection guide for the task, then follow its shared-contract links.
The downloadable Markdown is the compact counterpart of the human reference,
not a separate API. It preserves types, defaults, binding directions, nullability,
constraints and child grammars. Parameters share a row only when their contracts
are identical; a missing default is different from `None`.

## Read only what you need

- [inputs](../../../docs_llm/public/410-inputs.md): Fields, choices and validation.
- [buttons](../../../docs_llm/public/415-buttons.md): Buttons, menus and toolbars.
- [layout](../../../docs_llm/public/420-layout.md): Forms, tabs, windows and tray.
- [tree](../../../docs_llm/public/425-tree.md): Hierarchical Bags.
- [editors](../../../docs_llm/public/430-editors.md): Code, HTML and Markdown.
- [typst](../../../docs_llm/public/435-typst.md): Typst preview.
- [uploads](../../../docs_llm/public/440-uploads.md): Uploads and attachments.
- [grid](../../../docs_llm/public/445-grid.md): Rows, columns and grid search.
- [chat](../../../docs_llm/public/450-chat.md): Conversation composition.
- [grouplets](../../../docs_llm/public/455-grouplets.md): Reusable remote fragments.
- [charts](../../../docs_llm/public/480-charts.md): Shared charts, lazy engines and temporal snapshots.
- [audio](../../../docs_llm/public/490-audio.md): Microphone waveform and spectrum in Data.
- [drawing](../../../docs_llm/public/495-drawing.md): Image annotations stored in a Bag.

## Authoring essentials

Pages inherit all standard collections from GramlotServer. Use
`Page.gramlots` only for custom collections. Source owns the interface
structure and widget lifecycle; Data Bags hold current values. Logic is behavior,
not a state registry. Use relative datapaths to make blocks reusable. External editor
engines load when needed. Database authorization and persistence belong to the server.

For shared authoring rules, read [Writing pages](../095-writing-pages.md),
[Data and bindings](../097-data-binding.md), [Calling the server](../098-server-calls.md)
and [Remote Source](../099-remote-content.md). Use the
[complete component reference](../345-widget-reference.md) to locate a component.
Database query features marked Asqueel-only require that integration; a grid alone
does not provide database access. A static/file-only export cannot execute Python endpoints.

## Formats and scope

The manual provides these collection guides as direct Markdown downloads alongside
its human pages. The site root's `llms.txt` is the compact discovery index.
Resolve relative links against the downloaded document URL. Public content follows
`main`; choose the manual matching the installed packages. Internal work records,
constitutional history and future proposals are not part of this agent pack.
