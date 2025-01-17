let play = document.querySelector("#play");
let playing = document.querySelector("#playing");

play.addEventListener("click", () => {
    // Hide the button when clicked
    play.style = "display: none";
    playing.style = "";

    Tone.start();

    // Converts a string to an array of notes or null.
    // Dots in the string become nulls in the array and are silent.
    function mkSequence(pattern) {
        return pattern.split("").map(value => {
            if (value == ".") {
                return null;
            } else {
                return value;
            }
        });
    }

    let drumPattern = {
        kick: "x...x...",
        snare: "..x...x.",
        hiHat: "xxxxxxxx",
    };

    let reverb = new Tone.Reverb({
        decay:1,
        wet:0.3
    }).toDestination();

    let hiHatFilter = new Tone.Filter(15000, "bandpass").connect(reverb);

    let hiHat = new Tone.NoiseSynth({
        envelope: {
            attack: 0.001, decay: 0.1, sustain: 0, release: 0
        },
        volume: -6
    }).connect(hiHatFilter);

    new Tone.Sequence(time => {
        hiHat.triggerAttackRelease("16n", time);
    }, mkSequence(drumPattern.hiHat), "8n")
    .start("0:0:0")
    .stop("4:0:0");

    // new Tone.Loop(time => {
    //     hiHat.triggerAttackRelease("16n", time);
    // }, "8n").start("0:0:0").stop("4:0:0");

    class Snare {
        constructor() {
            this.noiseFilter = new Tone.Filter(5000, "bandpass").connect(reverb);
            this.NoiseSynth = new Tone.NoiseSynth({
                envelope: {
                    attack: 0.001, decay: 0.1, sustain: 0, release:0
                },
                volume: -12
            }).connect(this.noiseFilter);
            this.synth = new Tone.Synth({
                envelope: {
                    attack: 0.0001, decay:0.1, sustain:0, release:0
                },
                oscillator: { type: "sine" },
                volumne: -12
            }).connect(reverb);
        }
        
        triggerAttackRelease(duration, when) {
            this.NoiseSynth.triggerAttackRelease(duration, when);
            this.synth.triggerAttackRelease("G3", duration, when);
        }
    }

    let snare = new Snare();

    new Tone.Sequence(time => {
        snare.triggerAttackRelease("16n", time);
    }, mkSequence(drumPattern.snare), "8n")
    .start("0:0:0")
    .stop("4:0:0");

    // new Tone.Loop(time => {
    //     snare.triggerAttackRelease("16n", time);
    // }, "2n")
    // .start("0:1:0")
    // .stop("4:0:0");

    let kick = new Tone.MembraneSynth({
        pitchDecay: 0.02,
        octaves: 6,
        volume: -9
    }).connect(reverb);

    new Tone.Sequence( time => {
        kick.triggerAttackRelease(50, "16n", time);
    }, mkSequence(drumPattern.kick), "8n")
    .start("0:0:0")
    .stop("4:0:0");

    // new Tone.Loop(time => {
    //     kick.triggerAttackRelease(50, "16n", time);
    // }, "2n")
    // .start("0:0:0")
    // .stop("4:0:0");

    // Samples from freesound.org:
    // https://freesound.org/people/MTG/sounds/357432/
    // https://freesound.org/people/MTG/sounds/357336/
    // https://freesound.org/people/MTG/sounds/357546/
    const sampler = new Tone.Sampler({
        urls: {
            "C5": "trumpet-c5.mp3",
            "D5": "trumpet-d5.mp3",
            "F5": "trumpet-f5.mp3"
        },
        baseUrl: "https://skilldrick-jscc.s3.us-west-2.amazonaws.com/",
        attack: 0,
        release: 1,
        volume: -24,
        onload: () => {
            sampler.triggerAttackRelease(["C5", "E5", "G5"], "1n", 0);
        }
    }).connect(reverb);

    Tone.Transport.start();
});

