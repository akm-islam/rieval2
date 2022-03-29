import * as d3 from 'd3';
import * as $ from 'jquery';
import textures from 'textures';
import Create_sparkline from "./Sparkline"

export function Create_deviation_chart(parent_id,parent_exp_id, selected_instances, original_data, default_models, anim_config, selected_year, average, clicked_circles, Set_clicked_circles, diverginColor,sparkline_data,Set_selected_year,dataset,threshold) {
  var div = d3.select("body").selectAll('.tooltip').data([0]).join("div").attr("class", "tooltip").style("opacity", 0);
  var parent_width = $("#" + parent_id).width() - 5
  var parent_height = $("." + 'deviation_plot_container_div').height() // deviation_plot_container_div is the div that contains the deviation plot for all modes
  var data = original_data.filter(item => selected_year==item['1-qid'] && selected_instances.includes(parseInt(item['two_realRank'])))
  var temp_scale_data = []
  data.map(item => { default_models.map(model => temp_scale_data.push(Math.abs(parseInt(item[model]) - parseInt(item['two_realRank'])))) })
  // font_line_gap=sparkline_width+4
  var config = { space_for_state_name: 120,fontSize: 12, font_dy: -6, sparkline_width:20,font_line_gap: 24, line_stroke_width: 10, animation_duration: 0, container_height: 100, my_svg_top_margin: 10, myg_top_margin: 10 }
  var y_distance = parent_height/selected_instances.length
  if(y_distance<15){var y_distance=15}
  d3.select("#" + parent_id).attr("height",y_distance*selected_instances)

  var circle_radius = config.line_stroke_width / 2
  var t = textures.lines().size(5).strokeWidth(2).stroke("#cccccc").background("gray");
  var svg=d3.select("#" + parent_id).attr('height', y_distance + data.length * y_distance).call(t)
  var parent_g = svg.selectAll(".parent_g").data([0]).join('g').attr('class', 'parent_g').attr('transform', "translate(" + 0 + ",13)")
  var items_g = parent_g.selectAll(".items").data(data, d => d['State']).join(enter => enter.append("g").attr("class", "items")
    .attr('transform', (d, i) => "translate(" + config.space_for_state_name + "," + i * y_distance + ")")
    , update => update.transition().duration(anim_config.rank_animation).attr('transform', (d, i) => "translate(" + config.space_for_state_name + "," + i * y_distance + ")")
    , exit => exit.remove()
  )
  items_g.attr("add_state", function (d) {
    d3.select(this).selectAll("text").data([d]).join('text')
    .text(dd=>{
      var max_textsize=15
      var val = d['State']
          if (val.length > max_textsize) { val = val.replace("University", "U") }
          if(val.length > max_textsize){val = val.substring(0, max_textsize)+".."}
          return val + " " + d['two_realRank'] 
    })
    .attr('fill', d => diverginColor(d['two_realRank'])).attr("dominant-baseline", "hanging").attr("font-size", config.fontSize)
      .attr("x", 0).attr('text-anchor', 'end').attr("dy", config.font_dy)
  }).attr("add_sparkline", function (d) {
    // sparkline height is y_distance
    if(dataset!='house'){Create_sparkline(d3.select(this),config,config.line_stroke_width,sparkline_data,d,diverginColor,selected_year,Set_selected_year)}
  })
    .attr("add_lines_and_circles", function (d) {
      var data_for_all_years = data.filter(item => d['two_realRank'] == parseInt(item['two_realRank']))
      var line_data = []
      default_models.map(model_name => {
        data_for_all_years.map(item => {
          var a = {}
          var two_realRank = parseInt(item['two_realRank'])
          var predicted_rank = parseInt(item[model_name])
          a['two_realRank'] = two_realRank
          a['predicted_rank'] = predicted_rank
          a["model"] = model_name
          a['year'] = item['1-qid']
          if (Math.abs(predicted_rank - two_realRank) < threshold) {
            line_data.push(a)
          }
        })
      })
      // This is only for scaling starts here
      var temp_scale_data = []
      data.map(item => { default_models.map(model => temp_scale_data.push(Math.abs(parseInt(item[model]) - parseInt(item['two_realRank'])))) })
      var temp_max = d3.max(temp_scale_data)
      var sclale1 = d3.scaleLinear().domain([0, temp_max]).range([config.font_line_gap, parent_width - (config.space_for_state_name + circle_radius)])
      if (temp_max == 0) { var sclale1 = d3.scaleLinear().domain([0, temp_max]).range([config.font_line_gap, 0]) }
      // This is only for scaling ends here
      d3.select(this).selectAll("line").data([d]).join(enter => enter.append('line')
        .attr("x1", config.font_line_gap).attr("y1", (d, i) => y_distance * i).attr("y2", (d, i) => y_distance * i).attr("stroke-width", config.line_stroke_width).attr("stroke", t.url()).attr("x2", (d2) => {
          var temp = []
          line_data.map(item => temp.push(Math.abs(item["predicted_rank"] - item["two_realRank"])))
          return sclale1(d3.max(temp))
        })
        // Update
        , update => update.transition().duration(anim_config.deviation_animation).delay(anim_config.rank_animation).attr("x2", (d2) => {
          var temp = []
          line_data.map(item => temp.push(Math.abs(item["predicted_rank"] - item["two_realRank"])))
          return sclale1(d3.max(temp))
        }))
      // ------------ Circles start here
      var data_for_all_years = data.filter(item => d['two_realRank'] == parseInt(item['two_realRank']))
      var circ_data = []
      default_models.map(model_name => {
        data_for_all_years.map(item => {
          var a = {}
          var two_realRank = parseInt(item['two_realRank'])
          var predicted_rank = parseInt(item[model_name])
          a['two_realRank'] = two_realRank
          a['predicted_rank'] = predicted_rank
          a["model"] = model_name
          a['year'] = item['1-qid']
          a['id'] =item['State'].replace(/ /g, '').replace(/[^a-zA-Z ]/g, "") + model_name.replace(/ /g, '').replace(/[^a-zA-Z ]/g, "")
          a['className']="deviation_circles "+model_name.replace(/ /g, '').replace(/[^a-zA-Z ]/g, "")
          if (Math.abs(predicted_rank - two_realRank) < threshold) {
            circ_data.push(a)            
          }
        })
      })
      var my_circs = d3.select(this).selectAll(".my_circles").data(circ_data, d => d['id']).join(
        enter => enter.append("circle").attr('id', d => d['id']).attr("cx", (d2, i) => {
          d3.select(this).classed(d2['id'], true)
          if (d2["predicted_rank"] - d2['two_realRank'] == 0) { return sclale1(Math.abs(d2["predicted_rank"] - d2['two_realRank'])) + circle_radius }
          return sclale1(Math.abs(d2["predicted_rank"] - d2['two_realRank']))
        })
        // Update
        , update => update.transition().duration(anim_config.deviation_animation).delay(anim_config.rank_animation).attr("cx", (d2, i) => {
          d3.select(this).classed(d2['id'], true)
          if (d2["predicted_rank"] - d2['two_realRank'] == 0) { return sclale1(Math.abs(d2["predicted_rank"] - d2['two_realRank'])) + circle_radius }
          return sclale1(Math.abs(d2["predicted_rank"] - d2['two_realRank']))
        })
      )
      my_circs.attr("r",circle_radius).attr('class', d=>'my_circles '+d['className'])
      .attr('fill', d => diverginColor(d['two_realRank'])).attr("parent_id", parent_exp_id)
        .on('click', d => Set_clicked_circles(clicked_circles.includes(d['id']) ? clicked_circles.filter(item => item != d['id']) : [...clicked_circles, d['id']]))
        .on("mouseover", function (d2) {
          div.transition().duration(200).style("opacity", .9);
          div.html("Year : " + d2["year"] + "<br></br>" + "Model: " + d2["model"] + "<br></br>" + "Deviation: " + Math.abs(d2["predicted_rank"] - d2['two_realRank']))
          .style("left", (d3.event.pageX - 140) + "px").style("top", (d3.event.pageY - 98) + "px");
        }).on("mouseout", function (d2) {
          //d3.select(this).classed(d2['id'],true)
          div.transition()
            .duration(500)
            .style("opacity", 0);
        })

    })

}