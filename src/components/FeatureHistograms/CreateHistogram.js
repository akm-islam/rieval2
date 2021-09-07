import * as d3 from "d3"
import * as $ from "jquery"
import * as _ from "lodash";
import createBins from './CreateBin'
export default function CreateHistogramNum(data, svg, feature_name,feature_index) {
  var parent_width = $(".feature_histograms_container").width()
  var parent_height = $(".feature_histograms_container").height()
  var number_of_items_without_scroll=9
  var feature_height=parent_height/number_of_items_without_scroll
  svg.attr('y',feature_height*feature_index).attr('width',parent_width)
  var item_data=data.map(item=>item['y'])
  var binned_data=createBins(item_data, 3)
  const margin = { top: 30, right: 10, bottom: 40, left: 100 }; //margin.left should be 40
  var height = feature_height - margin.top - margin.bottom;

  const y = d3.scaleLinear().domain(d3.extent(item_data)).range([margin.top, height])
  // set the parameters for the histogram
  var myticks = binned_data.map(item=>item["x1"])
  var ticks = myticks
  svg.append("text").attr('x',"45%").attr('dominant-baseline','hanging').text(feature_name)

  //--------- Create the areaChart
  var data = []
//var binned_data=createBins(item_data, 6)
  binned_data.map((item, i) => data.push([i, item['count']]))
  var xScale = d3.scaleLinear().domain([0, d3.max(data.map(item=>item[0]))]).range([0, parent_height]) // 20 is the baseline
  var yScale = d3.scaleLinear().domain(d3.extent(data.map(item => item[1]))).range([0, height])
  const areaGenerator = d3.area()
    .y0(feature_height)
    .y1(d => yScale(d[1]))
    .x(d => xScale(d[0])) // This is the x values
    .curve(d3.curveMonotoneY)
  svg.append("path").attr('transform', 'translate(0,' + margin.top + ')')
    .attr("d", areaGenerator(data))
    .style("fill", "#F78787");
    //svg.selectAll(".graph_lines").data(ticks).join('line').attr("class", "graph_lines").attr("x1", 0).attr("x2", baseline).attr("y1",d=>y(d)).attr("y2", d=>y(d)).attr("stroke-width", 0.1).attr("stroke", "black").raise()
  }

export function CreateHistogramCat(data, svg, item, parent_width, item_height, line_data, feature_index) {
  console.log("Categorical")
}

//https://stackoverflow.com/questions/54236051/how-to-draw-a-vertical-area-chart