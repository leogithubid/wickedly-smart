//function to read data
function readData(file,id){
    //console.log("Reading data");
    //https://www.tutorialsteacher.com/d3js/loading-data-from-file-in-d3js#d3.csv
    //Q-is the word data fixed?No
    //missing concepts - Promise and Arrow function
    //d3.csv is a function to read csv from d3 library - it reads the data
    //one by one, to the promise function another function is there
    //graph data 
    d3.csv(file,processData)
    .then((rows)=>graph(rows,id))
    .catch((error)=>console.log("Error",error.message));
}
    //processData
    function processData(row){
    //processes only one row at a time
    //    return row;
    //we will now return only year and average temperature from J-D
/*     let averageTemperature = {
        year : row.Year,
        temperature : row["J-D"]
    };
    return averageTemperature; */
    //convert this into float type
    // add OR statement and pass 0, to handle missing values '*'
    let averageTemperature = {
        year : parseFloat(row.Year) || 0,
        temperature : parseFloat(row["J-D"]) || 0
    }
    return averageTemperature;
    }
    //to understand map function
    let globalData;
    function graph_wicked(data, id) {
        let colors = ["#023858", "#045a8d", "#0570b0", "#3690c0", "#74a9cf", "#a6bddb", "#d0d1e6", "#ece7f2", "#fff7fb", "#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"];
        let stripeWidth = 4;
        let stripeHeight = 300;
        let avgData = data.map((d) => d.temperature);
        let linearScaleForData =
                d3.scaleLinear()
                    .domain([d3.min(avgData), d3.max(avgData)])
                    .range([0, colors.length-1]);
        let svg = d3.select(id).append("svg")
                .attr("width", data.length * stripeWidth)
                .attr("height", stripeHeight);
        let stripes = svg.selectAll("rect")
                .data(data).enter()
                    .append("rect")
                    .attr("width", stripeWidth)
                    .attr("height", stripeHeight)
                    .attr("x", (d, i) => i * stripeWidth)
                    .attr("y", 0)
                    .style("fill", (d, i) => colors[Math.round(linearScaleForData(d.temperature))])
                    .on("mouseover", (d) => console.log(d));
    }
     //graph function
function graph(rows,id){
        globalData = rows;
    //map function
//try out this code in console
//d3.min(globalData);
//globalData.map((d)=>d.temperature);
//let temperatures = globalData.map((d)=>d.temperature);
//d3.min(temperatures);   
    //from bluest to the reddest
    let colors = ['#08306b','#08519c','#2171b5','#4292c6','#6baed6','#9ecae1',
                  '#c6dbef','#deebf7','#f7fbff',
                  '#fff5eb','#fee6ce','#fdd0a2','#fdae6b','#fd8d3c','#f16913','#d94801','#a63603','#7f2704'
                  ];
    //create an array of tempartures using map
    let temperatures = rows.map((d)=>d.temperature);
    //create a scale function with domain and range 
    //to pick the colour based on the temperature
    let linearScaleForData = d3.scaleLinear()
                             .domain([d3.min(temperatures),d3.max(temperatures)])
                             .range([0,colors.length-1]);                             
    //    console.log(id,rows);
    //adding svg elements
    //let land = d3.select(id);
    //let svg = land.append("svg");
    //changing height and width of svg element
    let svgHeight = 300;
    let svgWidth = 4 ;
    console.log(rows.length);
    //svg.attr("height",svgHeight);
    //svg.attr("width",svgWidth * rows.length);
    //method chaining
    let svg = d3.select(id)
              .append("svg")
              .attr("height",svgHeight)
              .attr("width",svgWidth*rows.length);
    //creating stripes using rectangles inside svg
    let stripes = svg.selectAll("rect")//select empty rectangles
                     .data(rows) //tell browser that data is coming from rows
                     .enter() //enter values to the rectangles
                     .append("rect") //append the rectangles
                     .attr("width",svgWidth) //set width
                     .attr("height",300) //set height
/*                      .attr("x",function(d,i){ //adding x position for each rectangles
                         return i * svgWidth;
                     }) */
                     .attr("x",(d,i)=> i*svgWidth )
                     .attr("y",0)//adding y
                     .style("fill",(d,i)=>colors[Math.round(linearScaleForData(d.temperature))])
                     .on("mouseover", (d,i) => console.log(i.year));
                     //adding colours
                     //.style("fill",(d,i)=>console.log(Math.round(linearScaleForData(d.temperature))));//adding colours
                    
                    } 
