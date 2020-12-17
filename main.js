// set the dimensions and margins of the graph
var margin = {top: 20, right: 40, bottom: 10, left: 20},
    width = 1400 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("data.csv", function(data) {

  // List of groups = header of the csv files
  var keys = data.columns.slice(1)

  var x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return d.month; }))
      .range([ 0, width-350]);
    svg.append("g")
      .attr("transform", "translate(0," + height*0.9 + ")")
      .call(d3.axisBottom(x).tickSize(-height*0.8).tickValues([1,2,3,4,5,6,7,8,9,10,11,12]))
      .select(".domain").remove()
    // Customization
    svg.selectAll(".tick line").attr("stroke", "#b8b8b8")
  
    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height)
        .text("Month");

  // Add Y axis
    // Add Y axis
    var y = d3.scaleLinear()
    .domain([-30000, 30000])
    .range([ height, 0 ]);

  // color palette
  var color = d3.scaleOrdinal()
    .domain(keys)
    .range(['#ff3155','#ffaf42','#ffed5e','#49f770','#2daefd'])

  //stack the data?
  var stackedData = d3.stack()
    .offset(d3.stackOffsetSilhouette)
    .keys(keys)
    (data)

  // create a tooltip
  var Tooltip = svg
    .append("text")
    .attr("x", 80)
    .attr("y", 20)
    .style("opacity", 0)
    .style("font-size", 25)

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    Tooltip.style("opacity", 1)
    d3.selectAll(".myArea").style("opacity", .2)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mousemove = function(d,i) {
    grp = keys[i]
    Tooltip.text(grp)
           .style("fill","black")
           .style("stroke","black")
  }
  var mouseleave = function(d) {
    Tooltip.style("opacity", 0)
    d3.selectAll(".myArea").style("opacity", 1).style("stroke", "none")
   }


  // Area generator
  var area = d3.area()
    .x(function(d) { return x(d.data.month); })
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); })

    // Show the areas
  svg
    .selectAll("mylayers")
    .data(stackedData)
    .enter()
    .append("path")
      .attr("class", "myArea")
      .style("fill", function(d) { return color(d.key); })
      .attr("d", area)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)

})