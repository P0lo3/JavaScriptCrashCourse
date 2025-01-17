let numbers = [3, 2, 1];

function update(data) {
    d3
        .select("svg")
        .selectAll("circle")
        .data(data, d => d) // animation shows circle added in begining previously (.data(data)) this similated a strange behaviour
        .join(
            enter => enter
                .append("circle")
                .attr("cx", (d, i) => (i + 1) * 50)
                .attr("cy", 50)
                .transition()
                .duration(500)
                .attr("r", (d, i) => d * 5),
            update => update
                .transition()
                .duration(500)
                .attr("cx", (d, i) => (i + 1) * 50),
            exit => exit
                .transition()
                .duration(500)
                .attr("r", 0)    
                .remove()
        );
        // .transition()
        // .duration(500)
        // .attr("cx", (d, i) => (i + 1) * 50)
        // .attr("cy", 50)
        // .attr("r", (d, i) => d * 5);
}

update(numbers);


function getRandomNumber() {
    return 1 + Math.random() * 4;
}

d3.select("#append").on("click", () => {
    numbers.push(getRandomNumber());
    update(numbers);
});

d3.select("#prepend").on("click", () => {
    numbers.unshift(getRandomNumber());
    update(numbers);
});

d3.select("#drop").on("click", () => {
    numbers.pop();
    update(numbers);
});