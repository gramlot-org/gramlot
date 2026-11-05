/** Local microphone FFT acquisition; independent of charts, transport and DOM. */
export function audioAnalysisOptions({fftSize=1024, frameRate=20, minimumDb=-100}={}) {
    if(!Number.isInteger(fftSize)||fftSize<256||fftSize>8192||(fftSize&(fftSize-1)))throw new RangeError('FFT size must be a power of two from 256 to 8192');
    if(!Number.isFinite(frameRate)||frameRate<1||frameRate>30)throw new RangeError('Frame rate must be between 1 and 30');
    if(!Number.isFinite(minimumDb)||minimumDb>=0||minimumDb < -160)throw new RangeError('Minimum dB must be between -160 and 0 (exclusive)');
    return {fftSize,frameRate,minimumDb};
}

export class AudioAnalysisSession {
    #window; #frame; #state; #error; #generation=0; #context; #stream; #source; #analyser; #raf; #last=-Infinity; #ended;
    constructor(window,{frame,state,error}) { this.#window=window;this.#frame=frame;this.#state=state;this.#error=error; }
    configure(options) {
        this.options=audioAnalysisOptions(options);
        if(this.#analyser)this.#analyser.fftSize=this.options.fftSize;
    }
    async start(options) {
        this.configure(options);
        if(this.#context)return;
        const win=this.#window;
        if(!win.isSecureContext||!win.navigator.mediaDevices?.getUserMedia||!win.AudioContext)throw new Error('Microphone analysis requires HTTPS or localhost and Web Audio support');
        const generation=++this.#generation;
        const context=new win.AudioContext();this.#context=context;
        this.#state('requesting');
        try {
            await context.resume();
            if(generation!==this.#generation)return;
            const stream=await win.navigator.mediaDevices.getUserMedia({audio:true,video:false});
            if(generation!==this.#generation){for(const track of stream.getTracks())track.stop();return;}
            this.#stream=stream;
            this.#ended=()=>{void this.stop().then(()=>this.#error(new Error('Microphone capture ended')),error=>this.#error(error));};
            for(const track of stream.getTracks())track.addEventListener('ended',this.#ended);
            this.#source=context.createMediaStreamSource(stream);
            this.#analyser=context.createAnalyser();this.#analyser.fftSize=this.options.fftSize;
            this.#source.connect(this.#analyser); // Never connected to speakers, recorded or uploaded.
            this.#state('running');this.#last=-Infinity;
            const tick=timestamp=>{
                if(generation!==this.#generation)return;
                try {
                    if(timestamp-this.#last>=1000/this.options.frameRate) {
                        this.#last=timestamp;
                        const analyser=this.#analyser;
                        const waveform=new Float32Array(analyser.fftSize),spectrum=new Float32Array(analyser.frequencyBinCount);
                        analyser.getFloatTimeDomainData(waveform);analyser.getFloatFrequencyData(spectrum);
                        this.#frame({waveform,spectrum,sampleRate:context.sampleRate,minimumDb:this.options.minimumDb});
                    }
                    this.#raf=win.requestAnimationFrame(tick);
                } catch(error) { void this.stop().then(()=>this.#error(error),cleanupError=>this.#error(cleanupError)); }
            };
            this.#raf=win.requestAnimationFrame(tick);
        } catch(error) {
            if(generation!==this.#generation)return;
            await this.stop();throw error;
        }
    }
    async stop() {
        const generation=++this.#generation;
        if(this.#raf!=null)this.#window.cancelAnimationFrame(this.#raf);
        this.#raf=null;
        for(const track of this.#stream?.getTracks()??[]) {track.removeEventListener('ended',this.#ended);track.stop();}
        this.#stream=null;this.#source?.disconnect();this.#analyser?.disconnect();this.#source=this.#analyser=null;
        const context=this.#context;this.#context=null;
        if(context&&context.state!=='closed')await context.close();
        if(generation===this.#generation)this.#state('stopped');
    }
}
