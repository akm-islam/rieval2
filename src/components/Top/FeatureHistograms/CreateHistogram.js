import * as d3 from "d3"
import * as $ from "jquery"
import * as _ from "lodash";
import createBins from './CreateBin'
export default function CreateHistogram(data, svg, feature_name, feature_index, number_of_features) {
  const margin = { top: 10, right: 5, bottom: 50, left: 5 };
  var parent_width = $(".feature_histograms_container").width()
  var parent_height = $(".feature_histograms_container").height()
  var feature_height = 120
  var feature_width = parent_width
  d3.select(".feature_histograms_container").attr('height', feature_height * number_of_features + 20)
  svg.attr('y', feature_height * feature_index).attr('width', parent_width).attr('height', feature_height)
  var item_data = data.map(item => item['y'])
  var area_chart_height = feature_height - margin.top - margin.bottom;
  var area_chart_width = feature_width - margin.left - margin.right
  const y = d3.scaleLinear().domain(d3.extent(item_data)).range([margin.top, area_chart_height])

  var myticks = y.ticks(25)
  var binned_data = d3.histogram().value(d => d).domain(y.domain()).thresholds(myticks)(item_data)
  //--------- Create the areaChart
  var data = []
  binned_data.map((item, i) => data.push([item.x1, item.length]))
  var xScale = d3.scaleLinear().domain(d3.extent(data.map(item => item[0]))).range([margin.left, feature_width - margin.right]) // 20 is the baseline
  var yScale = d3.scaleLinear().domain([0, d3.max(data.map(item => item[1]))]).range([area_chart_height, 0])
  const areaGenerator = d3.area().curve(d3.curveMonotoneX).x(d => xScale(d[0])).y0(yScale(0)).y1(d => yScale(d[1]))

  svg.append("path").attr('transform', 'translate(0,' + margin.top + ')')
    .attr("d", areaGenerator(data))
    .style("fill", "gray");
  //svg.selectAll(".graph_lines").data(ticks).join('line').attr("class", "graph_lines").attr("x1", 0).attr("x2", baseline).attr("y1",d=>y(d)).attr("y2", d=>y(d)).attr("stroke-width", 0.1).attr("stroke", "black").raise()
  svg.selectAll(".xAxis_g").data([0]).join('g').attr('class', 'xAxis_g').attr("transform", "translate(0," + (feature_height - margin.bottom) + ")")
    .call(d3.axisBottom(xScale).ticks(5).tickFormat(d3.format(".2s")));
  svg.selectAll('.domain').attr('stroke', '#dddddd')
  svg.selectAll(".title").data([0]).join('text').attr('x', feature_width / 2).attr('y', feature_height - 28).attr('dominant-baseline', 'hanging').attr('text-anchor', 'middle').text(feature_name).attr('font-size', 14).style('text-transform','capitalize')
}
//https://stackoverflow.com/questions/54236051/how-to-draw-a-vertical-area-chart