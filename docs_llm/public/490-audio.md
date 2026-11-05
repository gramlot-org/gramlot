# Audio analysis

Document ID: **GC-490**.

<a id="gc-490-start"></a>
## Start here

Capture microphone samples through audioAnalyser and bind its outputs to Data. This component analyses live audio; it does not record or save an audio file.

The environment Page base supplies the collections used below. [Configure them once](340-components-and-collections-guide.md#gc-340-050). [Setup examples are in the appendix](465-widget-examples.md#gc-465-setup-audio).

Microphone access requires permission and a secure browser context. Waveform and spectrum are arrays stored as Bag values, not a node per sample. Bind status and error to display feedback. Stopping, pagehide and disposal release the microphone and audio context.

[All collections](345-widget-reference.md) · [Shared labels and validation](105-components.md#gc-105-020) · [Bindings](097-data-binding.md)


<a id="gc-490-005"></a>
<a id="gc-490-010"></a>

Ordinary Source/CSS attributes remain in Writing pages and Themes and CSS.
Pages inherit environment collections; Page.gramlots adds missing ones. Buttons are built in.
Contract JSON omits only undeclared keys: no default is not the same as null. dtype: T text, B Boolean, L integer, R real, X structured value; remaining codes are TYTX. binding: read = Data to widget, write = widget to Data, twoWay = both. nullable permits None; enum restricts values; annotation preserves type/regex constraints. Parameters sharing a table row have exactly the same contract. Child grammar: * allows arbitrary Source children; empty permits none. Parent None means no declared restriction.


<a id="gc-490-490"></a>
## Audio and drawing


<a id="gc-490-480"></a>
<a id="gc-490-audioanalyser"></a>
### `audioAnalyser`

Collection: audio. Live microphone waveform and spectrum arrays written into Data.


[Implementation, test and teaching evidence](460-widget-coverage.md#gc-460-audioanalyser).


**Data contract.** running controls capture; waveform and spectrum write numeric arrays as individual Data values. sampleRate, status and error report the session.


**Interaction and events.** Changes to supported configuration update the analyser. Capture failure clears running and reports error.


**Composition.** Invisible leaf component; compose ordinary controls and charts around its bindings.


**Limits and lifecycle.** Requires microphone permission and a secure context. Stop, pagehide and disposal release resources. No recording or persistence.


| Parameters | Contract |
| --- | --- |
| `running` | `{"binding":"twoWay","default":false,"dtype":"B"}` |
| `fftSize` | `{"binding":"read","default":1024,"dtype":"L"}` |
| `frameRate` | `{"binding":"read","default":20,"dtype":"N"}` |
| `minimumDb` | `{"binding":"read","default":-100,"dtype":"N"}` |
| `spectrum, waveform` | `{"binding":"twoWay","dtype":"X","nullable":true}` |
| `sampleRate` | `{"binding":"twoWay","default":0,"dtype":"N"}` |
| `status` | `{"binding":"twoWay","default":"stopped","dtype":"T"}` |
| `error` | `{"binding":"twoWay","default":"","dtype":"T"}` |

Child grammar: `''`; parent grammar: `None`.
