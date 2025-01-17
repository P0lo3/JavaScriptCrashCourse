let play = document.querySelector("#play");
let playing = document.querySelector("#playing");

play.addEventListener("click", () => {
    // Hide the button when clicked
    play.style = "display: none";
    playing.style = "";

    Tone.start();

    let synth = new Tone.PolySynth(Tone.Synth).toDestination();

    new Tone.Part((time, note) => {
        synth.triggerAttackRelease(note, "16n", time);
    }, [
        ["0:0:0", ["C3", "E4"]],
        ["0:0:3", "D4"],
        ["0:1:0", "C4"],
        ["0:1:2", "D4"],
        ["0:2:0", ["E3", "E4"]],
        ["0:2:2", "E4"],
        ["0:3:0", "E4"],
        ["1:0:0", ["G3", "D4"]],
        ["1:0:2", "D4"],
        ["1:1:0", "D4"],
        ["1:2:0", ["E3", "E4"]],
        ["1:2:2", "G4"],
        ["1:3:0", "G4"],
    ]).start("0:0:0");

    Tone.Transport.start();
});

