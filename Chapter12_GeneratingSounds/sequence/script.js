let play = document.querySelector("#play");
let playing = document.querySelector("#playing");

play.addEventListener("click", () => {
    // Hide the button when clicked
    play.style = "display: none";
    playing.style = "";

    Tone.start();

    let synth = new Tone.Synth().toDestination();

    new Tone.Sequence((time, note) => {
        synth.triggerAttackRelease(note, "16n", time);
    }, ["C4", null, "B3", "C4", "G3", "A3", null, "B3"], "8n")
    .start("0:0:0")
    .stop("4:0:0");

    Tone.Transport.start();
});

