// Add an svg element to the page
const width = 600;
const height = 600;

let svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

let margin = { top: 20, right: 10, bottom: 20, left: 50 };

// Top Axis container
let topContainer = svg
    .append("g")
    .attr("id", "top")
    .attr("transform", `translate(0, ${margin.top})`);

// Left Axis container
let leftContainer = svg
    .append("g")
    .attr("id", "left")
    .attr("transform", `translate(${margin.left}, 0)`);

function getClass(char) {
    if (/^[a-z]$/.test(char)) {
        return "lower";
    } else if (/^[A-Z]$/.test(char)) {
        return "upper";
    } else if (/^[0-9]$/.test(char)) {
        return "number";
    } else {
        return "other";
    }
}

function update(data) {
    let xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .range([margin.left, width - margin.right])
        .nice();

    let yScale = d3.scaleBand()
        .domain(data.map(d => d.char))
        .range([margin.top, height - margin.bottom])
        .padding(0.5);

    let topAxisTicks = xScale.ticks()
        .filter(tick => Number.isInteger(tick));

    let topAxis = d3.axisTop(xScale)
        .tickValues(topAxisTicks)
        .tickFormat(d3.format("d"));

    let leftAxis = d3.axisLeft(yScale);

    topContainer
        .transition()
        .call(topAxis);

    leftContainer
        .transition()
        .call(leftAxis);

    svg
        .selectAll("rect")
        // .data(data)
        // .join("rect")
        // .attr("width", (d, i) => xScale(d.count) - xScale(0))
        // .attr("width", (d, i) => d.count * 5)
        // .attr("height", yScale.bandwidth())
        // .attr("height", 10)
        // .attr("x", xScale(0))
        // .attr("x", 20)
        // .attr("y", (d, i) => yScale(d.char))
        // .attr("class", (d, i) => getClass(d.char));
        // .attr("y", (d, i) => i * 20);
        .data(data, d => d.char)
        .join(
            enter => enter
                .append("rect")
                .attr("x", xScale(0))
                .attr("y", (d, i) => yScale(d.char))
                .attr("class", d => getClass(d.char))
                .transition()
                .attr("width", d => xScale(d.count) -  xScale(0))
                .attr("height", yScale.bandwidth()),
            update => update
                .transition()
                .attr("width", d => xScale(d.count) - xScale(0))
                .attr("height", yScale.bandwidth())
                .attr("y", (d, i) => yScale(d.char)),
            exit => exit
                .transition()
                .attr("width", 0)
                .attr("height", 0)
                .remove()
        );
}

function standardizeSpace(char) {
    if (char.trim() == "") {
        return "<space>";
    } else {
        return char;
    }
}

d3.select("textarea").on("input", e => {
    let frequencies = {};

    e.target.value.split("").forEach(char => {
        // let currentCount = frequencies[char] || 0;
        // frequencies[char] = currentCount + 1;
        let standardized = standardizeSpace(char);
        let currentCount = frequencies[standardized] || 0;
        frequencies[standardized] = currentCount + 1;
    });

    let data = Object.entries(frequencies).map(pair => {
        return { char: pair[0], count: pair[1]};
    });

    data.sort((a, b) => d3.ascending(a.char, b.char));

    console.log(data);
    update(data);
});