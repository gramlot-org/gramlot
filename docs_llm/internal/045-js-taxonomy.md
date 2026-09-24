# JavaScript taxonomy, inheritance and composition

Document ID: **GC-045**. Status: **inventory/proposal, not an approved hierarchy**.

[Full view](../../docs/internal/045-js-taxonomy.md). [Complete census](050-js-taxonomy-census.md). [Full class tree](diagrams/045-all-classes.mmd).

<a id="gc-045-005"></a>

## 005 · Scope and reading key

PoC 10478b57ce3f22e6445eb6b72eba343520cbebac: 113 parsed JS/mjs files; 112 class constructs + 2 functional mixins; 138 module function declarations (arrow helpers excluded); 38 catalogue entries/10 collections. Legacy: 390 cards (341 component, 20 controller, 17 internal, 11 component/helper, 1 recipe/registration) and 6 curated cards. External dependencies/dynamic classes/other repos not scanned. Legacy 437 declarations/310 registrations and 40 name matches are discovery evidence, not compatibility. Green=PoC, purple=proposal, amber=legacy; class inheritance, mixin application and collaborator use differ.

<a id="gc-045-010"></a>

## 010 · Whole-system taxonomy

Group by responsibilities; collections and capabilities are orthogonal to inheritance. A descriptive contract need not force a universal superclass.

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

GnrInput aliases ControlElement. Exact expression: FieldState(Decorated(GramlotElement)); realm-specific Element defaults to HTMLElement. GroupBox applies Decorated. Factory GnrDbSelect/GnrCheckBoxText retain Base until call-site resolution; catalogue names do not imply distinct classes.

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

<a id="gc-045-020"></a>

## 020 · Components not yet on the common lifecycle base

Listed classes directly extend HTMLElement. Shared future bases are proposals. Anonymous editor labels describe registered classes. Grid helpers are collaborators, not mixins.

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

Assembly/use edges, not inheritance. LogicRuntime handles Source declarations; no generic GramlotController hierarchy exists. FormController and InspectorController are specialized.

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

Observed inheritance only. Bag/BagNode/BagResolver external; platform Error/HTMLElement external. Keep form, collection and database stores distinct. PoC database code does not approve dataRecord/dataSelection/general capabilities.

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

Candidate families and mixins remain proposals. Preserve existing Decorated/FieldState, compose WidgetLabel/InputNullState/editors, centralize FormField/Validator. Lockable/Actionable/popup and async ownership need review. Bindings stay runtime-owned; utilities remain functions. Static-description AST export is untested: GC-040 used JS execution.

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

<a id="gc-045-040"></a>

## 040 · GenroPy families feeding the design

Curated representative legacy families; full census preserves all 390 categories/statuses. Syntax-level components can be recipes/helpers. No parity or port commitment.

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

Ten current collections: inputs, colorpicker, layout, clipboard, palette, storeTree, forms, labEditors, grid, chart. Full view/evidence lists 38 entries. Third parties need identity/version, selected exports, metadata/assets/dependencies and name/tag collision rules. Collections do not determine superclass. GC-040 records tested subset.

<a id="gc-045-050"></a>

## 050 · Sources, regeneration and next review

Regenerate evidence with inventory_js_taxonomy.py and Tree-sitter JS; tool versions in JSON. Syntax errors fail; runtime behavior not tested by parsing. Source evidence and historical proposals in full view. Settle first families, mixin conflicts/order, cleanup ownership and inherited descriptions before bounded ports. No LOT semantics inferred; excluded from public site.

