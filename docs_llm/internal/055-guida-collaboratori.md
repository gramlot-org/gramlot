# Gramlot: architettura e guida per collaborare

> **0.2.0 contract update — 2026-09-25:** initial values use
> `dataSetter(destination_path, value=None, **attr)`, not the legacy data declaration;
> `dataFormula(result_path, formula=None, func=None, **params)` and
> `dataController(script=None, func=None, **params)` are the canonical logic signatures.
> See [GC-210](210-binding-contract.md). This is a planned contract, not delivered
> binding; historical component examples and standalone HTML exports retain their
> dated scope and do not establish 0.2.0 support.


**Edizione storica del 18 settembre 2026.** Il core attuale implementa il perimetro limitato HTML nativo e Source live; PoC, binding e ricette restano evidenza o lavoro futuro. Per lo stato corrente vedere [GC-070](070-work-status.md) e per la release [GC-110](110-native-html-readiness.md#gc-110-020).

**GC-055 · Edizione di lavoro · 18 settembre 2026**

Dalle dichiarazioni Python ai componenti JavaScript: responsabilità, composizione,
collezioni e percorso verso il core consolidato.

Guida interna in italiano richiesta dal proprietario. Le proposte sono indicate
come tali; il codice di riferimento è ancora nel PoC.

<a id="gc-055-005"></a>

## 005 · Da dove partire

Gramlot consolida il framework; il codice corrente è nel PoC. Distinguere esistente, esperimento, proposta e legacy. Costituzione autorevole; nessuna semantica LOT formale approvata.

<a id="gc-055-010"></a>

## 010 · Source, Data e DOM: tre responsabilità

Source descrive struttura e comportamento, Data Bag contiene stato, DOM è la rappresentazione. Non ogni nodo Source produce DOM. Usare binding, controller e resolver del framework.

```mermaid
flowchart TB
 P["Applicazione Python<br/>dichiara la pagina"] --> S["Source<br/>struttura e comportamento"]
 S --> R["Runtime JavaScript<br/>interpreta le dichiarazioni"]
 R <--> D["Data Bag<br/>stato applicativo"]
 R <--> V["DOM e controlli<br/>interazione nel browser"]
```

<a id="gc-055-015"></a>

## 015 · Che cosa succede quando si usa una pagina

Python costruisce Source, il runtime JS esegue. L’editing locale non riesegue automaticamente Python e non salva automaticamente nel database. Il commit segue il contratto del controllo.

```mermaid
flowchart TB
 E["L’utente modifica un controllo"] --> C["Il controllo conferma il valore<br/>secondo il proprio contratto"]
 C --> B["Il binding scrive nel Data Bag"]
 B --> R["Il runtime notifica le dipendenze"]
 R --> F["Controller e formule reagiscono"]
 F --> U["Gli elementi interessati si aggiornano"]
```

<a id="gc-055-020"></a>

## 020 · Una tassonomia per orientarsi

Famiglie: componenti, controller/logica, builder/recipe, servizi, collaboratori, dati/infrastruttura, utility e strumenti. Un tag dichiarativo non implica una classe dedicata.

```mermaid
flowchart TB
 O["Oggetto da collocare"] --> Q["Quale responsabilità possiede?"]
 Q --> F["Interfaccia<br/>Comportamento<br/>Supporto"]
```

<a id="gc-055-025"></a>

## 025 · Classi base: il nucleo visuale esistente

Basi esistenti per realm: GramlotElement e ControlElement. Espressione effettiva FieldState(Decorated(GramlotElement)); GnrInput è un alias. I gruppi del diagramma non sono nuove basi.

```mermaid
flowchart TB
 H["HTMLElement"] -->|ereditarietà| G["GramlotElement<br/>lifecycle"]
 G --> M["Decorated + FieldState<br/>mixin"]
 M --> C["ControlElement<br/>alias GnrInput"]
 C --> T["Specializzazioni<br/>testo · scelta · valori tipizzati"]
```

<a id="gc-055-030"></a>

## 030 · Specializzazioni e componenti ancora separati

Molti layout, alberi, griglie ed editor derivano direttamente da HTMLElement. Factory Base richiedono analisi dei call site. Nessuna gerarchia uniforme già realizzata.

```mermaid
flowchart TB
 H["HTMLElement"] --> T["GnrTabContainer"]
 T --> S["GnrStackContainer"]
```

```mermaid
flowchart TB
 H["HTMLElement"] --> T["GnrStoreTree"]
 T --> R["GnrRelationTree"]
 T --> F["FileSystemTree"]
```

<a id="gc-055-035"></a>

## 035 · Mixin, collaboratori e utility: come scegliere

Decorated/FieldState sono mixin; WidgetLabel/InputNullState/editor sono collaboratori; utility restano funzioni. Definire ordine, membri, conflitti, proprietari e cleanup. Validazione condivisa.

```mermaid
flowchart TB
 C["ControlElement"] --> D["Decorated<br/>mixin"]
 D --> W["WidgetLabel<br/>collaboratore"]
```

```mermaid
flowchart TB
 C["ControlElement"] --> F["FieldState<br/>presentazione dello stato"]
 F -. si coordina con .-> V["FormField + Validator<br/>validazione condivisa"]
```

```mermaid
flowchart TB
 C["ControlElement"] --> N["InputNullState<br/>collaboratore"]
 N --> V["Distingue null<br/>dal valore vuoto"]
```

<a id="gc-055-040"></a>

## 040 · Controller, servizi e operazioni asincrone

Application assembla servizi; BuilderHandler/LogicRuntime coordinano dichiarazioni. FormController/InspectorController sono specializzati. Base controller generale proposta; async richiede cancellazione e rifiuto risultati obsoleti.

```mermaid
flowchart TB
 A["Application"] --> H["BuilderHandler"]
 H --> B["Builder e LogicRuntime<br/>dichiarazioni e reattività"]
```

```mermaid
flowchart TB
 A["Application"] --> F["FormService"]
 F --> C["FormController + FormField<br/>stato e operazioni"]
```

```mermaid
flowchart TB
 A["Application"] --> S["ServerCallService<br/>ResolverService"]
 S --> X["Ownership e cancellazione"]
 X --> R["Risultati obsoleti<br/>e cleanup"]
```

<a id="gc-055-045"></a>

## 045 · Componenti scritti in JS, applicazioni scritte in Python

Esperimento JS→JSON→Python→runtime riuscito: 4 test Python, 3 Node/jsdom e 4 test esistenti. Nessun test browser reale/package install. Descrizione statica di classe/describe e composizione ereditaria ancora da definire.

```mermaid
flowchart TB
 JS["Componente JavaScript<br/>implementazione + descrizione"] --> JSON["Catalogo JSON esportato"]
 JSON --> PY["Loader Python generico<br/>metodi dichiarativi"]
 PY --> PAGE["Pagina Python<br/>compone Source"]
 PAGE --> RT["Runtime JavaScript<br/>esegue il componente originale"]
```

<a id="gc-055-050"></a>

## 050 · AST, build e CI: dove nasce il catalogo

Sourcerer usa Tree-sitter JS da Python; estrazione metadati ereditati non verificata. AST statico e describe eseguito sono alternative. Build/CI genera artefatti senza commit automatici. Pacchetti con JSON+JS; niente Node richiesto al server Python.

```mermaid
flowchart TB
 S["Sorgenti JS e descrizioni<br/>versionati in Git"] --> B["Build locale o CI"]
 B --> E["Estrazione AST oppure describe()<br/>contratto da scegliere"]
 E --> J["JSON in build/<br/>artefatto generato"]
 J --> P["Pacchetto: JSON + JS + risorse"]
 P --> U["Python legge JSON<br/>il browser carica JS"]
```

<a id="gc-055-055"></a>

## 055 · Collezioni ed estensioni di terzi

10 collezioni/38 descrizioni. Collezione distinta da ereditarietà. Terzi: identità/versione, export, dipendenze, asset, compatibilità. Conflitti Python/tag DOM espliciti. Versioni simultanee, lazy loading e cicli non testati.

```mermaid
flowchart TB
 P["Pacchetto della collezione<br/>identità e versione"] --> I["index.js<br/>esportazioni esplicite"]
 I --> C["Classi dei componenti<br/>codice e descrizioni"]
 C --> A["Build della collezione"]
 A --> D["Artefatti coerenti<br/>catalogo JSON + JS + CSS"]
 D --> S["Applicazione consumatrice<br/>selezione e verifica dei conflitti"]
```

<a id="gc-055-060"></a>

## 060 · Server e database: due scelte indipendenti

Host e database indipendenti. Core senza dipendenze host. Database common/fake/genropy/sqlalchemy; SQLite via SQLAlchemy. Presenza di classi PoC non approva dataRecord/dataSelection/protocollo capacità.

```mermaid
flowchart TB
 U["Controllo o controller"] --> H["Adapter server<br/>contratto di invocazione"]
 H --> C["Servizio dati comune"]
 C --> I["Implementazioni distinte<br/>fake · GenroPy · SQLAlchemy"]
```

<a id="gc-055-065"></a>

## 065 · Che cosa impariamo dall’inventario GenroPy

390 schede da due alberi Python legacy, non audit completo JS. Nomi uguali non provano parità. Riclassificare helper/composizioni per comportamento, evitando trasferimento automatico dei vincoli Dojo.

<a id="gc-055-070"></a>

## 070 · Come può evolvere la gerarchia

Proposta: lifecycle base, campo singolo/composto, eventuali popup/menu e controller. Lockable/Actionable candidati. Descrizione comune non richiede superclasse universale. Non creare classi vuote prima delle prove.

```mermaid
flowchart TB
 B["Base visuale con lifecycle<br/>evidenza: GramlotElement"] --> F["Base di campo<br/>proposta"]
 F --> S["Controllo singolo<br/>evidenza: ControlElement"]
 F --> C["Campo composto<br/>proposta"]
 S --> T["Specializzazioni tipizzate<br/>da consolidare"]
 C --> V["Più controlli, un valore<br/>contratto da verificare"]
```

<a id="gc-055-075"></a>

## 075 · Come lavorare insieme sul consolidamento

Port piccoli con revisione, contratto, dipendenze, test, differenze e feedback. Ownership Data/risorse, errori e lifecycle espliciti. Demo Gramlot con sorgente/Inspector. Develop→main dopo verifica; pubblicazioni separate.

<a id="gc-055-080"></a>

## 080 · Verifiche, coverage e decisioni ancora aperte

Coverage JS separata da Python, includendo file non importati; esclusi vendor/generati/helper. Node/jsdom distinto da browser. Aperte descrizioni/mixin, estrattore, packaging/versioni, basi e adapter. Primo traguardo: sequenza completa e piccola.

<a id="gc-055-085"></a>

## 085 · Fonti e perimetro del documento

Baseline 10478b57ce3f22e6445eb6b72eba343520cbebac: 113 file, 112 classi+2 mixin, 138 funzioni modulo, 38 descrizioni/10 collezioni, 390 schede legacy+6 curate. Dipendenze/dinamico/altri repo esclusi. Esperimento locale non nella baseline. HTML offline; fonti esterne richiedono rete.

<a id="gc-055-090"></a>

## 090 · Appendici consultabili

Inventari completi nelle appendici della versione estesa e nel JSON GC-045.
