// import { color } from "d3-color";

// import { get } from "http";

const width = 600;
const height = 400;

let svg = d3
    .select("body")
    .insert("svg", "#sidebar")
    .attr("width", width)
    .attr("height", height);

let margin = { top: 20, right: 10, bottom: 20, left: 50 };

//Bottom axis constainer
let bottomContainer = svg
    .append("g")
    .attr("id", "bottom")
    .attr("transform", `translate(0, ${height - margin.bottom})`);

// Left axis container
let leftContainer = svg
    .append("g")
    .attr("id", "left")
    .attr("transform", `translate(${margin.left}, 0)`);

let chartHeight = (height - margin.bottom) - margin.top;
let midPoint = margin.top + chartHeight / 2;

svg
    .append("text")
    .text("Stars")
    .style("font-size", "14px")
    .attr("text-anchor", "middle")
    .attr("transform", `translate(12, ${midPoint}) rotate(270)`);

function getLicense(d) {
    let license = d.license?.name;

    if (!license) {
        return "No License";
    } else {
        return license;
    }
}

let hiddenLicenses = new Set();

function update(items) {
    // Items with the hidden licenses removed
    let filtered = items.filter(d => !hiddenLicenses.has(getLicense(d)));

    let license = new Set(items.map(d => getLicense(d)));

    let colorScale = d3.scaleOrdinal()
        .domain(license)
        .range(d3.schemeCategory10);

    let xScale = d3.scaleBand()
        .domain(filtered.map(d => d.full_name))
        // .domain(items.map(d => d.full_name))
        .range([margin.left, width - margin.right])
        .padding(0.5);

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(filtered, d => d.stargazers_count)])
        // .domain([0, d3.max(items, d => d.stargazers_count)])
        .range([height - margin.bottom, margin.top])
        .nice();
    
    let bottomAxis = d3
        .axisBottom(xScale)
        .tickValues([]);

    let leftAxis = d3
        .axisLeft(yScale)
        .tickFormat(d3.format("~s"));

    bottomContainer.call(bottomAxis);
    // leftContainer.call(leftAxis);

    leftContainer
        .transition()
        .call(leftAxis);

    svg
        .selectAll("rect")
        .data(filtered, d => d.full_name)
        // .data(items, d => d.full_name)
        // .join("rect")
        .join(
            enter => enter
                .append("rect")
                .attr("x", d => xScale(d.full_name))
                .attr("y", d => yScale(d.stargazers_count))
                .attr("fill", d => colorScale(getLicense(d)))
                .attr("width", xScale.bandwidth())
                .attr("height", d => yScale(0) - yScale(d.stargazers_count))
                .style("opacity", 1),
            update => update
                .transition()
                .attr("x", d => xScale(d.full_name))
                .attr("y", d => yScale(d.stargazers_count))
                .attr("width", xScale.bandwidth())
                .attr("height", d => yScale(0) - yScale(d.stargazers_count)),
            exit => exit
                .transition()
                .style("opacity", 0)
                .remove()
        )
        // .attr("x", d => xScale(d.full_name))
        // .attr("y", d => yScale(d.stargazers_count))
        // .attr("fill", d => colorScale(getLicense(d)))
        // .attr("width", xScale.bandwidth())
        // .attr("height", d => yScale(0) - yScale(d.stargazers_count))
        .on("mouseover", (e, d) => {
            let info = d3.select("#info");
            info.select(".repo .value a").text(d.full_name).attr("href", d.html_url);
            info.select(".license .value").text(getLicense(d));
            info.select(".stars .value").text(d.stargazers_count);
        });

    d3.select("#key")
        .selectAll("p")
        .data(license)
        .join(
            enter => {
                let p = enter.append("p");

                p.append("input")
                    .attr("type", "checkbox")
                    .attr("checked", true)
                    .attr("title", "Include in chart");

                p.append("div")
                    .attr("class", "color")
                    .style("background-color", d => colorScale(d));

                p.append("span")
                    .text(d => d)
            
                return p;
            }
        );

    d3.selectAll("#key input").on("change", (e, d) => {
        if (e.target.checked) {
            hiddenLicenses.delete(d);
        } else {
            hiddenLicenses.add(d);
        }

        console.log(hiddenLicenses);
        update(items);
    });
}



function getUrl() {
    let baseUrl = "https://skilldrick-jscc.s3.us-west-2.amazonaws.com/gh-js-repos.json";

    let params = {
        q: "language:javascript stars:>10000",
        per_page: 20,
        sort: "stars"
    };

    let queryString = Object.entries(params).map(pair => {
        return `${pair[0]}=${encodeURIComponent(pair[1])}`;
    }).join("&");

    return `${baseUrl}?${queryString}`;
}

let url = getUrl();

d3.json(url).then(data => {
    console.log(data);
    update(data.items);
});

console.log(url);