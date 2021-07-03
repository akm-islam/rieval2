import * as d3 from 'd3';
import * as $ from 'jquery';
//--------
export function sparklineGen(className, sparkline_data, key, model_name, original_data, state, year, appHandleChange, className2, sparkline_color, path_id) {
  var temp_data = []
  original_data.forEach(element => {
    if (element['State'] == state && element[model_name]) {
      temp_data.push({ year: parseInt(element['1-qid']), rank: parseInt(element[model_name]) })
    }
  });
  var config = { labelKeyOffset: 55, radius: 3, sparkline_height: 20 }
  var s_margin = { top: 0, right: 0, bottom: 0, left: 5 },
    s_width = config.labelKeyOffset / 2,
    s_height = config.sparkline_height - 2;
  var s_svg = d3.selectAll("."+className)
  //var s_svg = d3.selectAll("."+className).data([className],d=>d).join("svg").attr("class",className)
    .attr("width", s_width + s_margin.left + s_margin.right)
    .attr("height", s_height + s_margin.top + s_margin.bottom)
  var data = temp_data
  // Add X axis  
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function (d) { return d.year; }))
    .range([0, s_width]);
  //---Add the area
  s_svg.select("path")
    .datum(data, d => d)
    .attr("id", "A"+path_id)
    .attr("fill", sparkline_color) //#969696
    .attr("stroke", sparkline_color)
    .attr("stroke-width", (d) => {
      return 1.5
    })
    .attr("d", d3.area()
      .x(function (d) { return x(d.year) })
      .y0(function () {
        var y = d3.scaleLinear().domain([0, d3.max(data, function (d) { return +d.rank; })]).range([s_height, 0]);
        return y(0)
      })
      .y1(function (d) {
        var y = d3.scaleLinear().domain([0, d3.max(data, function (d) { return +d.rank; })]).range([0, s_height]);
        return y(d.rank)
      })
    )

  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  //------------Circles
  s_svg.selectAll('circle').data(data).enter().append('circle')
    .attr('cx', function (d, i) { return x(d.year) })
    .attr('cy', s_height - 2)
    .attr("class", "myid" + className2)
    .on("mouseover", function (d) {
      d3.select(this).style('fill', 'black')
      d3.select(this).attr('r', 2)
    })
    .on("mouseout", function (d) {
      d3.select(this).style('fill', 'transparent')
      var divid="#div"+className
      d3.selectAll(divid).remove()
    })
    .style('fill', (d) => d.year != year ? 'transparent' : 'black')
    .attr('class', (d) => d.year != year ? 'transparent_class' : 'red_class')
    .attr('r', 2)
    .on('dblclick', (d, i) => {
      d3.event.preventDefault();
      appHandleChange(d.year, "year_changed")
    })
    .on('click', (d) => {
      d3.select("body").append("div")
        .attr("id", "div"+className)
        .attr("class", "tooltip")
        .style("opacity", 0)
        .html("<p>" + "Year: " + d.year + "</p>" + "<p>" + "Rank: " + d.rank + "</p>")
        .style("left", ((d) => {
          var left_div_width = $('.Sidebar_parent').width()
          return left_div_width - 125 + "px"
        }))
        .style("top", (d3.event.pageY - 40) + "px")
        .transition()
        .duration(200)
        .style("opacity", .97);
    })
}