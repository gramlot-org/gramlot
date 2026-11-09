# Audio analysis

Document ID: **GC-490**.

The audio collection listens to the microphone and writes what it hears into Data,
many times per second. This page answers **how do I get live sound levels from the
microphone, to draw a waveform or a spectrum?** The parameters are in the
[widget reference](345-widget-reference.md).

<a id="gc-490-start"></a>

## Listening to the microphone

```python
def main(self, root):
    pane = root.div(datapath="audio")
    pane.checkbox(value="^.running", lbl="Microphone")
    pane.audioAnalyser(running="^.running", waveform="^.waveform",
                       spectrum="^.spectrum", sampleRate="^.sampleRate",
                       status="^.status", error="^.error")
    pane.div("^.status")
```

Ticking the box asks the browser for the microphone; once the user allows it,
`audio.waveform` and `audio.spectrum` change continuously. Draw them with a chart or
your own component. The page base of your environment already enables this
collection; if it does not,
[enable it once](340-components-and-collections-guide.md#gc-340-050).

<a id="gc-490-005"></a>
<a id="gc-490-010"></a>
<a id="gc-490-490"></a>
<a id="gc-490-480"></a>
<a id="gc-490-audioanalyser"></a>

## What the analyser writes

[audioAnalyser](345-widget-reference.md#gc-345-audioanalyser) is the only component
of the collection. It is invisible: it has no screen of its own, only bindings.

- **`running`** starts and stops listening. The analyser sets it back to false when
  something goes wrong or the page is left.
- **`waveform`** is a list of `fftSize` numbers, the shape of the sound.
- **`spectrum`** is a list of `fftSize / 2` decibel values, one per frequency band,
  never below `minimumDb`.
- **`sampleRate`** is the microphone's rate in Hz.
- **`status`** is `stopped`, `requesting`, `running` or `error`; **`error`** holds
  the message of the last failure.

Each list is a single value in Data, not one node per sample.

## Tuning

```python
root.audioAnalyser(running="^audio.running", spectrum="^audio.spectrum",
                   fftSize=2048, frameRate="^audio.rate", minimumDb="^audio.floor")
```

`fftSize` is a power of two from 256 to 8192 (default 1024): larger gives finer
frequency bands. `frameRate` is how many times per second the lists are written,
from 1 to 30 (default 20). `minimumDb` is the floor of the spectrum, from -160 up to,
but not including, 0 (default -100).

The microphone works only on HTTPS or localhost, and only after the user allows it.
Stopping, leaving the page or removing the analyser releases the microphone. The
sound is never recorded, played or sent anywhere.
