# Audio analysis

Document ID: **GC-490**.

<a id="gc-490-start"></a>
## Start here

Capture microphone samples through audioAnalyser and bind its outputs to Data. This component analyses live audio; it does not record or save an audio file.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). [Setup examples are in the appendix](465-widget-examples.md#gc-465-setup-audio).

Microphone access requires permission and a secure browser context. Waveform and spectrum are arrays stored as Bag values, not a node per sample. Bind status and error to display feedback. Stopping, pagehide and disposal release the microphone and audio context.

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)

### Sample values and lifecycle

waveform contains fftSize numeric samples; spectrum contains fftSize / 2 decibel values,
clamped to minimumDb. Each output is one array value in Data. sampleRate is measured in Hz.
fftSize must be a power of two from 256 to 8192; frameRate must be between 1 and 30. minimumDb must be finite,
at least -160 and strictly below 0.
The analyser is invisible; compose controls and charts around its bindings. Starting requests
microphone permission. Stopping releases browser resources; errors clear running and write error.
This is not an audio recorder, and no persistence is implied.

## Choose a component

- [`audioAnalyser`](#gc-490-audioanalyser): Live microphone waveform and spectrum arrays written into Data.


<a id="gc-490-005"></a>
<a id="gc-490-010"></a>
Types: T text, B Boolean, L integer, R real, X structured value; other codes are TYTX. Binding: read = Data to widget; write = widget to Data; twoWay = both. A dash means no declared default/binding. None is a declared value. Constraints include enum, qualification, target and annotations. Tables describe component contracts; ordinary Source/CSS attributes are shared.


## Shared parameter contracts

Each widget below links only the shared contracts it supports. A shared name can have different types, defaults or bindings; separate rows preserve those differences.


<a id="gc-490-490"></a>
## Audio and drawing


<a id="gc-490-475"></a>
<a id="gc-490-audioanalyser"></a>
### `audioAnalyser`

Live microphone waveform and spectrum arrays written into Data.

Collection: **audio**. Browser element: `gramlot-audio-analyser`.

[Microphone samples and lifecycle](490-audio.md#gc-490-start).


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-audioanalyser).


**Data contract.** running controls capture; waveform and spectrum write numeric arrays as individual Data values. sampleRate, status and error report the session.


**Interaction and events.** Changes to supported configuration update the analyser. Capture failure clears running and reports error.


**Composition.** Invisible leaf component; compose ordinary controls and charts around its bindings.


**Limits and lifecycle.** Requires microphone permission and a secure context. Stop, pagehide and disposal release resources. No recording or persistence.

| Specific parameter | Type | Default | Binding | Constraints |
| --- | --- | --- | --- | --- |
| `running` | B | False | twoWay | — |
| `fftSize` | L | 1024 | read | — |
| `frameRate` | N | 20 | read | — |
| `minimumDb` | N | -100 | read | — |
| `spectrum` | X or None | — | twoWay | — |
| `waveform` | X or None | — | twoWay | — |
| `sampleRate` | N | 0 | twoWay | — |
| `status` | T | 'stopped' | twoWay | — |
| `error` | T | '' | twoWay | — |

Child grammar: `''`; parent grammar: `None`. `*` permits arbitrary Source children; an empty expression permits none; `None` means no parent restriction declared.
