import * as d3 from 'd3';
import * as $ from 'jquery';
import Create_sparkline from "./02_Sparkline"
import add_lines_and_circles from "./03_deviation_chart_line_symbol"

export function Create_deviation_chart(parent_id,parent_exp_id, selected_instances, original_data, defualt_models, anim_config, selected_year, average, clicked_circles, Set_clicked_circles, diverginColor,sparkline_data,Set_selected_year,dataset,symbolTypes) {
  var parent_width = $("#" + parent_id).width() - 5
  var data = original_data.filter(item => selected_year==item['1-qid'] && selected_instances.includes(parseInt(item['two_realRank'])))
  var temp_scale_data = []
  data.map(item => { defualt_models.map(model => temp_scale_data.push(Math.abs(parseInt(item[model]) - parseInt(item['two_realRank'])))) })
  // font_line_gap=sparkline_width+4
  var config = { fontSize: 12, font_dy: -6, sparkline_width:20,font_line_gap: 24, line_stroke_width: 10, animation_duration: 0, container_height: 100, my_svg_top_margin: 10, myg_top_margin: 10, left_margin: 100 }
  var y_distance = config.line_stroke_width + 2
  var circle_radius = config.line_stroke_width / 2
  var parent_g = d3.select("#" + parent_id).attr('height', y_distance + data.length * y_distance)
    .selectAll(".parent_g").data([0]).join('g').attr('class', 'parent_g').attr('transform', "translate(" + 0 + ",8)")

//-------------------------------------------------- g for each row
  var items_g = parent_g.selectAll(".items").data(data, d => d['State']).join(enter => enter.append("g").attr("class", "items")
    .attr('transform', (d, i) => "translate(" + config.left_margin + "," + i * y_distance + ")")
    , update => update.transition().duration(anim_config.rank_animation).attr('transform', (d, i) => "translate(" + config.left_margin + "," + i * y_distance + ")")
    , exit => exit.remove()
  )

//-------------------------------------------------- Add state
  items_g.attr("add_state", function (d) {
    d3.select(this).selectAll("text").data([d]).join('text').text(d['State'] + " " + d['two_realRank']).attr('fill', d => diverginColor(d['two_realRank'])).attr("dominant-baseline", "hanging").attr("font-size", config.fontSize)
      .attr("x", 0).attr('text-anchor', 'end').attr("dy", config.font_dy)
  })

//-------------------------------------------------- Add sparkline
  items_g.attr("add_sparkline", function (d) {
    // sparkline height is y_distance
    if(dataset!='house'){Create_sparkline(d3.select(this),config,y_distance,sparkline_data,d,diverginColor,selected_year,Set_selected_year)}
  })
//-------------------------------------------------- Add lines_and_circles
items_g.attr("add_lines_and_circles", function (d) {
  add_lines_and_circles(d3.select(this),data,defualt_models,config,symbolTypes,clicked_circles,Set_clicked_circles,parent_exp_id,diverginColor,circle_radius,d,anim_config,y_distance,parent_width)
})
/*
.on("click", function() {
  d3.select(this).classed("visible", d3.select(this).classed("visible") ? false : true);
});
*/
}