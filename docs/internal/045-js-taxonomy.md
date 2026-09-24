# JavaScript taxonomy, inheritance and composition

Document ID: **GC-045**. Status: **source inventory and design proposal; no new hierarchy approved**.

[Concise counterpart](../../docs_llm/internal/045-js-taxonomy.md).
[Complete inventory](050-js-taxonomy-census.md). [Full syntactic class tree](diagrams/045-all-classes.mmd). [Machine-readable evidence](inventory/045-js-taxonomy.json).

<a id="gc-045-005"></a>

## 005 · Scope and reading key

Snapshot: `gramlot-org/gramlot-poc@10478b57ce3f22e6445eb6b72eba343520cbebac`.
Tree-sitter parsed **113 JavaScript/ES-module files**, finding **112 class
constructs and 2 functional mixins**, plus **138 module-level function declarations**.
The built-in catalogue has **38 descriptions in 10 collections**. Some classes are
local factories, anonymous custom elements, tools or stubs; these counts do not
represent 112 public component APIs. Exported arrow helpers are not included in
the function-declaration count; every scanned file is listed in the full inventory.

Legacy evidence comprises **390 cards** plus **6 curated current-contract cards**.
The legacy card categories are 341 components, 20 controllers, 17 internal/reference
helpers, 11 component/helpers and 1 recipe/registration contract. The original
coverage manifest reports 437 direct declarations and 310 registrations merged
into those cards. Its 40 name-level matches do not prove behavioral compatibility.
Legacy census coverage is of the two selected Python discovery trees, not every
GenroPy JS implementation. No dependencies, dynamically generated classes or other
Gramlot repositories are included in the JS source count.

Green: present in PoC source, not necessarily accepted core. Purple/dashed:
proposed contract or organization. Amber: legacy discovery evidence. In class
diagrams, `<|--` is inheritance, `..>` applies a mixin, and `-->` uses a collaborator.
Overview/legacy flowcharts group responsibilities; their arrows are not inheritance.
Do not turn every capability into a mixin or every Source tag into a JS class.

<a id="gc-045-010"></a>

## 010 · Whole-system taxonomy

Collections, class inheritance and capabilities are separate axes. Public descriptive contracts should span appropriate exported element families, rather than force all runtime objects into one superclass.

```mermaid
flowchart TB
    ROOT["Gramlot JavaScript · responsibility map"]
    ROOT --> C["Visual components"]
    ROOT --> L["Controllers and declarative logic"]
    ROOT --> R["Recipes and authoring"]
    ROOT --> S["Services and collaborators"]
    ROOT --> D["Data and runtime infrastructure"]
    ROOT --> U["Library utilities"]
    ROOT --> T["Developer tools"]
    C --> CB["GramlotElement / ControlElement"]
    C --> CW["Controls · layouts · grids · trees · editors"]
    L --> LC["LogicRuntime · FormController"]
    L --> LD["dataFormula / dataController / dataRpc<br/>Source declarations, not separate JS classes"]
    R --> RB["BuilderBase → HtmlBuilder / SvgBuilder"]
    R --> RR["RecipeRuntime · Source expansions"]
    S --> SF["FormService · FormField · Validator"]
    S --> SN["TopicService · ServerCallService · ResolverService"]
    D --> DS["SourceBag / SourceBagNode · BuilderHandler"]
    D --> DB["Stores · database contracts · fake adapter"]
    U --> UF["Pointers · formatting · parsing · expression helpers"]
    T --> TI["Inspector · LabSession · DeveloperTools"]
    COL["Collections<br/>distribution and registration axis"] -. groups .-> CW
    MIX["Decorated / FieldState<br/>existing functional mixins"] -. applied to .-> CB
    CAP["Candidate capabilities<br/>lock state · actions · popup ownership"] -. proposed .-> C
    META["Proposed description contract<br/>JS metadata → generated JSON → Python"] -. describes public elements .-> C
    META -. describes public elements .-> L
    classDef root fill:#15324f,color:#fff,stroke:#15324f;
    classDef existing fill:#e3f3ed,color:#143d2e,stroke:#39866b;
    classDef proposal fill:#f0e8fa,color:#4f2e70,stroke:#9670b3,stroke-dasharray:5 4;
    class ROOT root;
    class C,L,R,S,D,U,T,CB,CW,LC,LD,RB,RR,SF,SN,DS,DB,UF,TI,COL,MIX existing;
    class CAP,META proposal;
```

<a id="gc-045-015"></a>

## 015 · Existing component inheritance and actual mixins

`getComponentBases(Element)` creates realm-specific bases. In inputs.js, `GnrInput` is an alias for `ControlElement`. The exact control expression is `FieldState(Decorated(GramlotElement))`; the diagram compresses these wrappers but preserves their order in the labels. GroupBox separately applies Decorated.

```mermaid
classDiagram
    direction TB
    HTMLElement <|-- GramlotElement : Element parameter
    GramlotElement <|-- ControlElement : through mixins
    Decorated ..> ControlElement : inner mixin
    FieldState ..> ControlElement : outer mixin
    GramlotElement <|-- GroupBox : through Decorated
    Decorated ..> GroupBox : applied
    GramlotElement <|-- DateCalendar
    ControlElement <|-- GnrTextBox
    ControlElement <|-- GnrTextBoxArea
    ControlElement <|-- GnrPasswordbox
    ControlElement <|-- GnrNumberTextBox
    ControlElement <|-- GnrDateTextBox
    ControlElement <|-- GnrTimeTextBox
    ControlElement <|-- GnrCheckbox
    ControlElement <|-- GnrColorpicker
    ControlElement <|-- GnrHorizontalSlider
    GnrHorizontalSlider <|-- GnrVerticalSlider
    ControlElement <|-- GnrComboBox
    GnrComboBox <|-- GnrFilteringSelect
    ControlElement --> WidgetLabel : decoration collaborator
    ControlElement --> InputNullState : value state
    ControlElement --> ControlTools : optional tools
    GnrNumberTextBox --> NumberEditor
    GnrDateTextBox --> SymbolicDateEditor
    class Decorated {
        <<mixin>>
    }
    class FieldState {
        <<mixin>>
    }
```

Factory-produced `GnrDbSelect` and `GnrCheckBoxText` extend an argument named
`Base`; the census retains that expression rather than guessing a global parent.
Their concrete call sites must determine the parent and variants during porting.
Similarly, `dbSelect`, `remoteSelect` and `callbackSelect` are catalogue identities,
not proof of three independently declared implementation classes.

<a id="gc-045-020"></a>

## 020 · Components not yet on the common lifecycle base

These source classes directly extend HTMLElement. Grouping them into future common bases would be a refactoring proposal, not a description of current inheritance. ProseEditorAnonymous and MarkdownEditorAnonymous label anonymous registered classes. Grid collaborators are composed objects, not mixins.

```mermaid
classDiagram
    direction TB
    HTMLElement <|-- GnrPanel
    HTMLElement <|-- GnrBox
    HTMLElement <|-- GnrBorderContainer
    HTMLElement <|-- GnrTab
    GnrTab <|-- GnrContentPane
    HTMLElement <|-- GnrTabContainer
    GnrTabContainer <|-- GnrStackContainer
    HTMLElement <|-- GnrStackButtons
    HTMLElement <|-- GnrFormlet
    HTMLElement <|-- GnrLabledBox
    HTMLElement <|-- GnrForm
    HTMLElement <|-- Palette
    HTMLElement <|-- CopyButton
    HTMLElement <|-- FrameChannel
    HTMLElement <|-- GnrStoreTree
    GnrStoreTree <|-- GnrRelationTree
    GnrStoreTree <|-- FileSystemTree
    HTMLElement <|-- GnrGrid
    HTMLElement <|-- Chart
    HTMLElement <|-- CodeMirrorElement
    HTMLElement <|-- GramlotIde
    HTMLElement <|-- GramlotInspector
    HTMLElement <|-- ProseEditorAnonymous
    HTMLElement <|-- MarkdownEditorAnonymous
    GnrGrid --> GridInteractions
    GnrGrid --> GridBands
    GnrGrid --> GridEditor
    GnrGrid --> GridStatus
    GnrGrid --> GridChangeManager
```

<a id="gc-045-025"></a>

## 025 · Runtime, controllers and services

Arrows here mean assembly or use, not inheritance or a claim of exclusive ownership. Logic declarations are executed by LogicRuntime and collaborating services; the source does not contain a generic GramlotController base with one subclass for every declaration. FormController and InspectorController are existing specialized controllers.

```mermaid
flowchart TB
    APP["Application"] --> HAND["BuilderHandler"]
    APP --> FORMS["FormService"]
    APP --> TOPICS["TopicService"]
    APP --> RPC["ServerCallService"]
    APP --> RES["ResolverService"]
    APP --> STORES["CollectionStores"]
    APP --> DB["DatabaseService"]
    APP --> OPEN["OpenApiClientService"]
    APP --> RECIPE["RecipeRuntime"]
    APP --> FEED["InteractionFeedback"]
    APP --> TARGET["DomTarget"]
    FORMS --> FC["FormController"]
    FORMS --> FIELD["FormField"]
    APP --> VAL["Validator"]
    FC --> SNAP["ValueSnapshot / persistence stores"]
    HAND --> BUILDER["BuilderBase / HtmlBuilder"]
    BUILDER --> LOGIC["LogicRuntime"]
    BUILDER --> POL["RecipePolicies / RecipeDefaults"]
    BUILDER --> SOURCE["SourceBag / SourceBagNode"]
    LOGIC -. executes .-> DECL["dataSetter · dataFormula · dataController<br/>dataRpc · remoteSource and other PoC declarations"]
    RPC --> RRPC["RpcResolver binding"]
    RES --> HTTP["UrlResolver / OpenApiResolver"]
    classDef runtime fill:#e3f3ed,color:#143d2e,stroke:#39866b;
    class APP,HAND,FORMS,TOPICS,RPC,RES,STORES,DB,OPEN,RECIPE,FEED,TARGET,FC,FIELD,VAL,SNAP,BUILDER,LOGIC,POL,SOURCE,DECL,RRPC,HTTP runtime;
```

<a id="gc-045-030"></a>

## 030 · Data, builders, renderers and resolvers

These are the observed inheritance relationships. Bag, BagNode and BagResolver belong to external dependencies; Error and HTMLElement are platform types. Database classes are PoC evidence, not acceptance of dataRecord, dataSelection or the general capability protocol. MemoryStore, form stores, CollectionStores and database BaseStore have distinct responsibilities and must not be merged merely because they contain “store”.

```mermaid
classDiagram
    direction TB
    Bag <|-- SourceBag
    BagNode <|-- SourceBagNode
    BagResolver <|-- UrlResolver
    UrlResolver <|-- OpenApiResolver
    BagResolver <|-- RpcResolver
    BuilderBase <|-- HtmlBuilder
    BuilderBase <|-- SvgBuilder
    HtmlBuilder <|-- GramlotBuilder
    GramlotBuilder <|-- PlaygroundBuilder
    GramlotBuilder <|-- PythonPageBuilder
    GramlotBuilder <|-- EmptyPage
    RendererBase <|-- HtmlRenderer
    RendererBase <|-- SvgRenderer
    TargetWrapper <|-- DomTarget
    ModelProvider <|-- ReadAdapter
    ReadAdapter <|-- BagDbReadAdapter
    BaseStore <|-- CollectionStore
    CollectionStore <|-- SelectorStore
    BaseStore <|-- RecordStore
    BagRows <|-- ValuesBagRows
    BagRows <|-- AttributesBagRows
    Error <|-- DataError
    Error <|-- ServerCallError
```

<a id="gc-045-035"></a>

## 035 · Candidate consolidation tree

Based on the earlier browser architecture review and current evidence. All new family/base names and mixins remain proposals. A shared descriptive interface does not imply a single root superclass above both DOM components and nonvisual controllers. The proposed AST/CI exporter is not yet verified; GC-040 tested a JS-executed metadata exporter, not AST extraction of descriptions.

```mermaid
flowchart TB
    DESC["Description contract<br/>static metadata; inheritance rules to define"]
    E["Lifecycle-aware component base<br/>evidence: GramlotElement"]
    E --> FIELD["Field adapter base · proposed"]
    FIELD --> SINGLE["Single-control base<br/>evidence: ControlElement"]
    FIELD --> COMPOSITE["Composite-field base · proposed"]
    SINGLE --> TEXT["Text family"]
    SINGLE --> TYPED["Number / date / time family"]
    SINGLE --> CHOICE["Choice family"]
    SINGLE --> OTHER["Checkbox / range / color families"]
    COMPOSITE --> DT["Date + time / multi-value fields · candidates"]
    E --> POPUP["Popup-trigger base · proposed"]
    E --> MENU["Menu / menu-item bases · proposed"]
    CT["Controller base · proposed<br/>no DOM requirement"] --> REACTIVE["Reactive local controller"]
    CT --> ASYNC["Async provider controller"]
    M1["Decorated / FieldState · existing mixins"] -. capabilities .-> FIELD
    M2["Lockable / Actionable · candidate mixins"] -. capabilities .-> SINGLE
    M2 -. capabilities .-> MENU
    S1["WidgetLabel / InputNullState<br/>existing collaborators"] -. used by .-> SINGLE
    S2["Shared Validator / FormField<br/>one validation engine"] -. used by .-> FIELD
    S3["Owned subscriptions / cancellation<br/>composition contract to define"] -. used by .-> CT
    DESC -. shared descriptive interface .-> E
    DESC -. shared descriptive interface .-> CT
    classDef existing fill:#e3f3ed,color:#143d2e,stroke:#39866b;
    classDef proposed fill:#f0e8fa,color:#4f2e70,stroke:#9670b3,stroke-dasharray:5 4;
    class E,SINGLE,M1,S1,S2 existing;
    class DESC,FIELD,COMPOSITE,TEXT,TYPED,CHOICE,OTHER,DT,POPUP,MENU,CT,REACTIVE,ASYNC,M2,S3 proposed;
```

| Capability | Current carrier | Proposed treatment |
| --- | --- | --- |
| Connection/disconnection cleanup | GramlotElement | Keep a small lifecycle contract; test errors and reconnection. |
| Label decoration | Decorated + WidgetLabel | Mixin installs the shared collaborator. |
| Field error presentation | FieldState + helper functions | Thin adapter; keep validation policy elsewhere. |
| Null versus empty | InputNullState | Composed state machine, not universal superclass state. |
| Typed number/date editing | NumberEditor / SymbolicDateEditor | Collaborators with explicit value/commit contracts. |
| Validation and draft policy | FormField / Validator / FormService | Shared engine; avoid duplicating it into each mixin. |
| Disabled/read-only forwarding | Existing control implementations | Candidate Lockable capability after contract comparison. |
| Commands and popup ownership | Scattered component/runtime behavior | Candidate Actionable/anchored-popup contracts after two real consumers agree. |
| Binding and Data writes | Builder / Source / Application boundary | Keep ownership explicit; do not install another binding engine per component. |
| Async cancellation | RPC, resolvers, form operations | Review common ownership contract; not yet one mixin. |
| Metadata/description | Existing catalogue; GC-040 experiment | Propose static descriptive contract and generated JSON. |
| Utilities | Pointer, date, number, formatting, expression modules | Functions where stateless; do not invent inheritance for reuse. |

<a id="gc-045-040"></a>

## 040 · GenroPy families feeding the design

This is a curated grouping of representative legacy identities, not a compatibility matrix. Every one of the 390 cards remains available in the complete inventory with its recorded category/status. Some syntactic “component” cards describe composition helpers; classification needs behavioral review before selecting a class family.

```mermaid
flowchart TB
    L["GenroPy inventory · discovery evidence"]
    L --> INPUT["Input and selection<br/>textBox · dbSelect · multiSelect · radiobutton"]
    L --> LAYOUT["Layout and composition<br/>formbuilder · framepane · grouplet · palettePane"]
    L --> GRID["Grid and collections<br/>includedview · gridView · checkboxcolumn · cell"]
    L --> STORE["Stores and providers<br/>selectionStore · virtualSelectionStore · dataRecord"]
    L --> ACTION["Actions and overlays<br/>menu · tooltip · dropDownButton · toaster"]
    L --> MEDIA["Editors and media<br/>bagEditor · codemirror · qrscanner · fileUploader"]
    L --> LOGIC["Data and remote logic<br/>dataFormula · dataController · dataRpc · remote"]
    L --> HTML["Native HTML declarations<br/>not one JS class per HTML tag"]
    INPUT -. review for .-> F["Field families and adapters"]
    LAYOUT -. review for .-> R["Recipes / layout components"]
    GRID -. review for .-> G["Grid collaborators and cell contracts"]
    STORE -. review for .-> D["Database-common / stores / resolvers"]
    ACTION -. review for .-> A["Action / popup capabilities"]
    MEDIA -. review for .-> P["Optional collections and dependencies"]
    LOGIC -. review for .-> C["Controller contracts"]
    classDef legacy fill:#fff3d8,color:#674b12,stroke:#c89b39;
    classDef proposed fill:#f0e8fa,color:#4f2e70,stroke:#9670b3,stroke-dasharray:5 4;
    class L,INPUT,LAYOUT,GRID,STORE,ACTION,MEDIA,LOGIC,HTML legacy;
    class F,R,G,D,A,P,C proposed;
```

<a id="gc-045-045"></a>

## 045 · Collections and third-party extension

Current catalogue groups are listed below. A package/collection can contain several class families; a base class can support controls in different collections. Non-catalogued JS elements and helpers remain visible in the full class/file census.

| Collection | Declared elements |
| --- | --- |

| `inputs` | `textBox`, `textBoxArea`, `checkBoxText`, `filteringSelect`, `dbSelect`, `remoteSelect`, `callbackSelect`, `comboBox`, `passwordbox`, `numberTextBox`, `dateTextBox`, `timeTextBox`, `horizontalSlider`, `verticalSlider`, `checkbox`, `dateCalendar` |
| `colorpicker` | `colorpicker` |
| `layout` | `formlet`, `labledBox`, `panel`, `box`, `borderContainer`, `tabContainer`, `tab`, `contentPane`, `stackContainer`, `stackButtons`, `groupBox` |
| `clipboard` | `copyButton` |
| `palette` | `palette` |
| `storeTree` | `storeTree`, `relationTree`, `fileSystemTree` |
| `forms` | `form` |
| `labEditors` | `codeMirror`, `gramlotIde` |
| `grid` | `grid` |
| `chart` | `chart` |

A third-party collection should declare identity/version, exported classes and
metadata, dependencies and assets. The exporter produces JSON for Python; browser
implementations remain JS. Flat Python names and global custom-element tags need
collision rules even when collection IDs are namespaced. See
[GC-040](040-js-owned-components.md) for the bounded extension experiment and gaps.

<a id="gc-045-050"></a>

## 050 · Sources, regeneration and next review

Regenerate machine evidence with `python scripts/inventory_js_taxonomy.py /path/to/gramlot-poc` using Python with `tree-sitter` and `tree-sitter-javascript`. The script parses syntax without executing JS and fails on syntax errors. Dependency versions used for this snapshot are recorded in the evidence JSON. A reviewer curates diagram relationships; a successful parse does not prove lifecycle behavior.

Evidence: PoC `js/dom/src/components/bases.js`, `collections/inputs.js`, `collections/layout.js`, `application.js`, `forms/`, `database/`, and `gramlot_inventory/README.md`, `legacy-census/coverage-manifest.md`; historical proposal `docs/development/gramlot-components-architecture-review-2026-09-11.md` and guide `docs/guides/component-controller-recipe-management.md`.

Before implementation, select the first component/controller families, define mixin ordering and member conflicts, agree composition/disposal ownership, and test the static metadata contract including inherited/mixin descriptions. Legacy-only capabilities remain candidates; core acceptance proceeds through bounded ports. No formal Live Object Tree semantics are inferred. These internal documents remain excluded from public Sphinx staging.

