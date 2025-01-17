let play = document.querySelector("#play");
let playing = document.querySelector("#playing");

play.addEventListener("click", () => {
    // Hide the button when clicked
    play.style = "display: none";
    playing.style = "";

    Tone.start();

    let synth = new Tone.Synth({
        oscillator: { type: "square" },
        envelope: { attack: 0.1, decay: 0.3, sustain: 0.8, release: 0.1},
        volume: -6
    }).toDestination();

    synth.triggerAttackRelease("A3", 0.9, 0);
    synth.triggerAttackRelease("B3", 0.9, 1);
    synth.triggerAttackRelease("C#4", 0.9, 2);
    synth.triggerAttackRelease("D4", 0.9, 3);
    synth.triggerAttackRelease("E4", 0.9, 4);
    synth.triggerAttackRelease("F#4", 0.9, 5);
    synth.triggerAttackRelease("G#4", 0.9, 6);
    synth.triggerAttackRelease("A4", 0.9, 7);

});

