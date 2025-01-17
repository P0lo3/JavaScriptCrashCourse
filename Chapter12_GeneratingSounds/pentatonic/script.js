let play = document.querySelector("#play");
let playing = document.querySelector("#playing");

play.addEventListener("click", () => {
    // Hide the button when clicked
    play.style = "display: none";
    playing.style = "";

    Tone.start();

    let synth = new Tone.PolySynth(
        Tone.Synth,
        {
            oscillator: { type: "triangle" },
            volume: -9
        }
    ).toDestination();

    let notes = ["C4", "D4", "E4", "G4", "A4", "C5"];

    new Tone.Loop(time => {
        for (let i =0; i< 3; i++) {
            if (Math.random() < 0.5) {
                let  note = notes[Math.floor(Math.random() * notes.length)];
                synth.triggerAttackRelease(note, "32n", time);
            }
        }
    }, "8n").start("0:0:0").stop("8:0:0");

    Tone.Transport.start();
});

