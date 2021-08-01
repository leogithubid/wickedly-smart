
function readData(file, id) {
    d3.csv(file).then((data) => graph(data, id));
}

function graph(data, id) {

const numCountries = 10;
const width = window.innerWidth - 150;
const height = window.innerHeight - 150;

// get start and end dates of the data
const dates = Object.keys(data[0])
	.map((date) => (new Date(date)).getTime())
	.filter(Boolean);
const startDate = new Date(Math.min(...dates));
const endDate = new Date(Math.max(...dates));

const lastDate = (endDate.getMonth() + 1) + "/" + 
				  endDate.getDate() + "/" + 
				 (endDate.getFullYear() + "").slice(-2);

// sort data by number of cases on last date of data
data.sort((a, b) => 
	(parseInt(a[lastDate]) < parseInt(b[lastDate]))? 1 : -1);

// update data with just top 10
data = data.slice(0, numCountries);

// create a parallel array of just the case numbers for each country
// filter out the non-case number data (state, country, lat, long)
// map from strings to a time, int pair
const casesData = data.map((d) => 
	Object.entries(d)
		.filter((e) => (new Date(e[0]).getTime()))
		.map((e) => [(new Date(e[0])).getTime(), parseInt(e[1])]));

// Find the maximum number of cases
// casesData is an array of arrays
// Flat map over each item in cases data
// Each item is an array. 
// Get the values of that array (which is the cases), and convert to integer
// flatmap flattens everything into one flat array instead of an array of arrays
// Then spread cases into Math.max to find the max cases
const cases = 
	casesData.flatMap((p) => p.map((c) => c[1]));
const maxCases = Math.max(...cases); // spread cases array into args for Math.max

// x axis is date, y axis is number of cases
const xScale = d3.scaleTime()
	.domain([startDate, endDate])
	.range([0, width]);
const yScale = d3.scaleLinear()
	.domain([0, maxCases])
	.range([height, 0]);

let svg = d3.select(id)
	.append("svg")
	.attr("width", width+50)
	.attr("height", height+50)
	.attr("transform", "translate(50, 50)");

svg.append("g")
	.attr("id", "xAxis")
	.attr("transform", `translate(0, ${height})`)
	.call(d3.axisBottom(xScale));

svg.append("g")
	.attr("id", "yAxis")
	.attr("transform", "translate(0, 0)")
	.call(d3.axisRight(yScale));

// create a set of colors to go with the data
// https://github.com/d3/d3-scale-chromatic
// for discrete colors, we can use this:
const colors = d3.scaleOrdinal(d3.schemeCategory10);

// same as the long form:
//const colors = d3.scaleOrdinal()
	//.domain([0, numCountries])
	//.range(d3.schemeCategory10);

// for use with an interpolator for continuous colors
	//d3.scaleSequential()
	//.domain([numCountries,0])
	//.interpolator(d3.interpolateRainbow);

const makeLine = d3.line()
	.x(d => xScale(d[0]))
	.y(d => yScale(d[1]));

// add lines
svg.append("g").selectAll("path").data(data).enter()
	.append("path")
		.attr("id", (d, i) => d["Country/Region"])
		.style("fill", "none")
		.attr("stroke-width", "3")
		.attr("stroke", (d, i) => colors(i))
		.attr("d", (d, i) => makeLine(casesData[i]));

// add circles and tooltips
let tooltip = d3.select("div.tooltip");

casesData.forEach(function(country, i) {
	svg.append("g").selectAll("circle").data(country).enter()
		.append("circle")
		.attr("r", 5)
		.attr("cx", (d) => xScale(d[0]))
		.attr("cy", (d) => yScale(d[1]))
		.attr("fill", colors(i))
		.on("mouseover", function() {
			console.log(data[i]["Country/Region"]);
			tooltip.html(data[i]["Country/Region"])
				.style("left", (d3.event.pageX) + "px")
				.style("top", (d3.event.pageY - 30) + "px")
				.style("visibility", "visible");
		})
		.on("mouseout", function() {
			tooltip.style("visibility", "hidden");
		});
});
	

} // graph function




