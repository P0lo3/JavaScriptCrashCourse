document.querySelectorAll(".fun").forEach(element => {

    element.setAttribute("data-offset", 0);

    element.addEventListener("click", event => {
        let offset = Number(event.target.getAttribute("data-offset"));

        if (event.shiftkey) {
            offset -=5;
        } else {
            offset += 5;
        }

        event.target.setAttribute("data-offset", offset);
        event.target.setAttribute("transform", `translate(${offset}, 0)`);
    });
    console.log(element);
});