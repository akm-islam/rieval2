
import * as d3 from 'd3';
import * as $ from 'jquery';
import * as algo1 from "../../../Algorithms/algo1";
export function CreateSlopeChart1(selected_instances, original_data, defualt_models, config, selected_years, average) {
  var div = d3.select("body").append("div").attr("class", "tooltip").style("opacity", 0);
  var parent_width = $("#dev_plot_container").width()
  var data = original_data.filter(item => selected_years.includes(item['1-qid']) && selected_instances.includes(parseInt(item['two_realRank'])))

  var temp_scale_data = []
  data.map(item => { defualt_models.map(model => temp_scale_data.push(Math.abs(parseInt(item[model]) - parseInt(item['two_realRank'])))) })

  var config = { fontSize: 12, font_dy: -6, font_line_gap: 4, line_stroke_width: 10, animation_duration: 0, container_height: 100, my_svg_top_margin: 10, myg_top_margin: 10, left_margin: 100 }
  var y_distance = config.line_stroke_width + 2
  var circle_radius = config.line_stroke_width / 2

  var parent_g = d3.select("#dev_plot_container").style("background-color", "#ededed").attr('height', y_distance + data.length * y_distance)
    .selectAll(".parent_g").data([0]).join('g').attr('class', 'parent_g').attr('transform', "translate(" + 0 + ",20)")
  parent_g.selectAll(".items").data(selected_instances).join("g").attr("class", "items").attr('transform', (d, i) => "translate(" + config.left_margin + "," + i * y_distance + ")")
    .attr("add_state", function (d) {
      d3.select(this).selectAll("text").data([d]).join('text').text(original_data[d]['State']).attr('fill', '#494949').attr("dominant-baseline", "hanging").attr("font-size", config.fontSize)
        .attr("x", 0).attr('text-anchor', 'end').attr("dy", config.font_dy)
    })
    .attr("add_lines_and_circles", function (d) {
      var data_for_all_years = data.filter(item => d == parseInt(item['two_realRank']))
      var line_data = []
      defualt_models.map(model_name => {
        data_for_all_years.map(item => {
          var a = {}
          a['two_realRank'] = parseInt(item['two_realRank'])
          a['predicted_rank'] = parseInt(item[model_name])
          a["model"] = model_name
          a['year'] = item['1-qid']
          line_data.push(a)
        })
      })
      // This is only for scaling starts here
      var temp_scale_data = []
      data.map(item => { defualt_models.map(model => temp_scale_data.push(Math.abs(parseInt(item[model]) - parseInt(item['two_realRank'])))) })
      var sclale1 = d3.scaleLinear().domain([0, d3.max(temp_scale_data)]).range([config.font_line_gap, parent_width - (config.left_margin + circle_radius)])
      // This is only for scaling ends here
      d3.select(this).selectAll("line").data([d]).join('line')
        .attr("x1", config.font_line_gap).attr("y1", (d, i) => y_distance * i).attr("y2", (d, i) => y_distance * i).attr("stroke-width", config.line_stroke_width).attr("stroke", "#cecece")
        .transition().duration(config.animation_duration).attr("x2", (d2) => {
          var temp = []
          line_data.map(item => temp.push(Math.abs(item["predicted_rank"] - item["two_realRank"])))
          return sclale1(d3.max(temp))
        })
      // ------------ Circles start here
      var data_for_all_years = data.filter(item => d == parseInt(item['two_realRank']))
      var circ_data = []
      defualt_models.map(model_name => {
        data_for_all_years.map(item => {
          var a = {}
          a['two_realRank'] = parseInt(item['two_realRank'])
          a['predicted_rank'] = parseInt(item[model_name])
          a["model"] = model_name
          a['year'] = item['1-qid']
          circ_data.push(a)
        })
      })
      if (average) {
        var avg = d3.mean(circ_data.map(item => item['predicted_rank']))
        circ_data = circ_data.map(item => {
          item['predicted_rank'] = avg
          item['model'] = "Average"
          item['year'] = "Average"
          return item;
        })
      }
      d3.select(this).selectAll("circle").data(circ_data).join("circle")
        .attr("r", circle_radius).attr('fill', '#7c7b7b')
        // .transition().duration(config.animation_duration)
        .attr("cx", (d2, i) => {
          if (d2["predicted_rank"] - d2['two_realRank'] == 0) { return sclale1(Math.abs(d2["predicted_rank"] - d2['two_realRank'])) + circle_radius }
          return sclale1(Math.abs(d2["predicted_rank"] - d2['two_realRank']))
        })
        .on("mouseover", function (d2) {
          div.transition().duration(200).style("opacity", .9);
          div.html("Year : " + d2["year"] + "<br></br>" + d2["model"] + " : " + Math.abs(d2["predicted_rank"] - d2['two_realRank'])).style("left", (d3.event.pageX - 130) + "px").style("top", (d3.event.pageY - 68) + "px");
        }).on("mouseout", function (d2) {
          div.transition()
            .duration(500)
            .style("opacity", 0);
        })
    })
}

export function CreatexpChart(selected_instances,sorted_features, lime_data,selected_year,defualt_models) {
  var parent_width = $("#exp_container").width()
  var parent_height = $("#exp_container").height()
  var item_width=parent_width/sorted_features.length
  var item_height=parent_height/sorted_features.length
  d3.select("#exp_container").selectAll(".exp_items").data(sorted_features).join('svg').attr('class','exp_items').attr('width',item_width).attr('height',item_height)
  .attr('x',(d,i)=>item_width*i)
  .attr('add_circle',function(d){
    var feature_contrib_name=d[0]+"_contribution"
    console.log(defualt_models,lime_data)
    var circ_data=[]
    defualt_models.map(model=>{
      lime_data[model].map(item=>{
        if(item['1-qid']==selected_year&& selected_instances.includes(parseInt(item['two_realRank']))){circ_data.push(item)}
      })
    })
    
    //d3.select(this).selectAll('text').data([0]).join('text').text("hello").attr('y',15)
    console.log(feature_contrib_name)
  })
  //console.log(sorted_features, lime_data,selected_year,defualt_models,selected_instances)
}
