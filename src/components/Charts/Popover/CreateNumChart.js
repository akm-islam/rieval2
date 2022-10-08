import * as d3 from 'd3';
import * as _ from "lodash";
import "./CreateNumChart.css"
var CreateNumChart = (data, feature, scatterplot_data, props) => {
  var rScale = d3.scalePow().exponent(0.2).domain(d3.extent(props.deviation_array)).range([6, 1])
  var feature_contribute = feature + "_contribution"
  var scatterplot_data = scatterplot_data.map(data_arr => {
    var temp = data_arr[1].filter(item => item['deviation'] < props.threshold && parseFloat(item[feature_contribute]) > 0)
    return [data_arr[0], temp]
  })
  // set the dimensions and margins of the graph
  var margin = { top: 0, right: 30, bottom: 70, left: 40, space_for_hist: 0 },
    feature_width = 520 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  //-------------------------------------------------------------All svgs
  var parent_svg = d3.select("#" + props.myid).attr("width", feature_width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom + margin.space_for_hist),
    svg1 = parent_svg.selectAll('.svg11').data([0]).join('svg').attr("y", margin.space_for_hist).attr("class", "svg11").selectAll(".myg").data([0]).join('g').attr("class", "myg").attr("transform", "translate(" + margin.left + "," + margin.top + ")")


  var svg1 = parent_svg.selectAll('.svg11').data([0]).join('svg').attr("class", "svg11").selectAll(".myg").data([0]).join('g').attr("class", "myg").attr("transform",
    "translate(" + margin.left + "," + margin.top + ")")
  svg1.selectAll(".myline2").data([0]).join('line').attr("class", "myline2").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", height).attr("stroke", "#EBEBEB");
  svg1.selectAll(".myline3").data([0]).join('line').attr("class", "myline3").attr("x1", 0).attr("y1", height).attr("x2", feature_width).attr("y2", height).attr("stroke", "#EBEBEB");

  //------------------------------------------------------------------------------------------------------ Draw Circles ends

  svg1.selectAll(".scatterplot_g").data(scatterplot_data).join('g').attr("id", d => d[0] + "scatterplot_g_id").attr("class", "scatterplot_g").attr("ax", function (d) {
    var data_for_x_axis = d[1].map(item => parseFloat(item[feature_contribute]))
    var data_for_y_axis = d[1].map(item => parseFloat(item[feature]))

    var xScale = d3.scaleLinear().domain(d3.extent(data_for_x_axis)).range([8, feature_width - 8]).nice() // This scaling is for individual model
    var yScale = d3.scaleLinear().domain(d3.extent(data_for_y_axis)).range([height, 4]).nice(); // This scaling is for individual model
    //------------- Y axis
    svg1.selectAll(".myYaxis").data([0]).join('g').attr("class", "myYaxis")
      .attr("transform", "translate(" + 0 + "," + margin.top + ")").call(d3.axisLeft(yScale).ticks(5).tickSize(-feature_width).tickFormat(d3.format(".2s"))).select(".domain").remove()
    svg1.selectAll(".tick line").attr("stroke", "#EBEBEB")

    d3.select(this).selectAll('circle').data(d[1])
      .join("circle")
      .attr("cx", (d, i) => xScale(d[feature_contribute]))
      .attr("cy", (d, i) => {
        if (yScale(parseFloat(d[feature])) < 10) {
          return 10;
        }
        else if (yScale(parseFloat(d[feature])) > (height - 10)) {
          return height - 10;
        }
        return yScale(parseFloat(d[feature])) - 0

      })
      .attr("actual_Y_value", d => d[feature] + " : x value : " + d[feature_contribute])
      //.attr("r", 4)
      .attr("r", d => parseFloat(d[feature_contribute]) <= 0 ? 0 : rScale(d['deviation']))
      .attr("fill", (d) => {
        return props.diverginColor(d['two_realRank']).replace(")", ",.6)")
      })

      .attr('class', d => 'my_circles')
      .attr("id", d => d['id'])
      .on('click', d => {
        props.Set_clicked_circles(props.clicked_circles.includes(d['id']) ? props.clicked_circles.filter(item => item != d['id']) : [...props.clicked_circles, d['id']])
      })
  })

  //--------------------------------------------------------------------------------------------------
  svg1.selectAll(".my_temp_rect").data([0]).join('rect').attr("class", "my_temp_rect").attr("width", "100%").attr("height", 100).style("fill", "white").attr("y", height)
  svg1.selectAll(".myXaxis").raise()

  svg1.selectAll(".my_line").raise()
  svg1.selectAll(".scatterplot_g").raise()
  svg1.selectAll(".myText").data([0]).join("text").attr("x", feature_width / 2).attr("class", "myText").attr('dominant-baseline', "middle").attr('text-anchor', "middle").attr("y", height + 25).text('feature importance').attr("fill", "#5b5959").attr("font-size", 14)
  svg1.selectAll(".myText2").data([0]).join("text").attr("class", "myText2").attr('dominant-baseline', "middle").attr('text-anchor', "middle").text('feature value').attr("fill", "#5b5959").attr("font-size", 13)
    .attr('transform', d => "rotate(-90," + 0 + "," + height / 2 + ")").attr("x", 0).attr("y", margin.left + 20)
  //---------------------------
}
export default CreateNumChart