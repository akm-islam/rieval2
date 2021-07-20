
import * as d3 from 'd3';
import * as $ from 'jquery';
export function CreatexpChart(parent_id, selected_instances, sorted_features, lime_data, selected_year, defualt_models, clicked_circles, Set_clicked_circles, diverginColor, anim_config, clicked_features, Set_clicked_features) {
  //var lime_data=lime_data.filter(item=>parseInt(item['1-qid'])==selected_year)
  var margin = { item_top_margin: 15, right: 14, bottom: 0, left: 20, circ_radius: 5, item_left_margin: 25, item_right_margin: 3 }
  var parent_width = $("#" + parent_id).width() - margin.item_left_margin
  var parent_height = $("#" + parent_id).height() - margin.item_top_margin * 2
  var item_width = parent_width / sorted_features.length - margin.item_right_margin
  var item_height = parent_height
  var parent_svg = d3.select("#" + parent_id)
  // Draw ++ --
  parent_svg.selectAll(".ylabels").data([[.125, "++"], [.375, "+"], [.5, "0"], [.625, "-"], [.875, "--"]]).join('text').attr('class', 'ylabels').attr("y", d => d[0] * item_height).attr("x", margin.item_left_margin - 5).attr('text-anchor', 'end').attr('dominant-baseline', 'hanging').text(d => d[1]).attr("font-size", 14).attr('fill', "#636363")
  // Add title rectangle, title text and rectangles around each feature
  var feature_g = parent_svg.selectAll('.feature_g').data(sorted_features, d => d[0]).join(
    enter => enter.append('g').attr('class', 'feature_g').attr('transform', (d, svg_index) => "translate(" + (margin.item_left_margin + item_width * svg_index + (margin.item_right_margin * svg_index)) + ",0)").attr('x_transformation', (d, svg_index) => (margin.item_left_margin + item_width * svg_index + (margin.item_right_margin * svg_index)))
      .attr("id", d => d[0].replace(/[^\w\s]/gi, ''))
      .attr('add_title_rect', function (d) { d3.select(this).selectAll('.title_rect').data([0]).join('rect').attr('class', 'title_rect').attr('width', item_width + 2).attr('x', -1).attr('height', margin.item_top_margin).attr('fill', '#d1d1d1') })
      .attr('add_title_text', function (d, svg_index) { d3.select(this).selectAll(".title_text").data([0]).join('text').attr('class', 'title_text').text(d[0]).attr('y', 0).attr('dominant-baseline', 'hanging').attr("font-size", 12).attr('x', 10).attr('text-anchor', 'start') })
      .attr('add_item_rect', function (d, svg_index) { d3.select(this).selectAll('.item_rect').data([0]).join('rect').attr('class', 'item_rect').attr('width', item_width).attr('height', item_height).attr('y', margin.item_top_margin).attr('fill', clicked_features.includes(d[0]) ? "#F8FDB8" : '#f2f2f2').attr('fill-opacity', 1).attr('stroke', '#b2b0b0') })
      .attr('svg_index', (d, svg_index) => svg_index)
      .attr('add_contrib_lines', function (d, svg_index) {
        d3.select(this).selectAll(".mylines").data([[.25], [.5], [.75]]).join('line').attr('class', 'mylines')
          .attr('x1', 0).attr('x2', item_width)
          .attr('y1', d => d * (item_height + margin.item_top_margin)).attr('y2', d => d * (item_height + margin.item_top_margin)).attr('stroke-width', 1).attr("stroke", "#bababa")
      })
    , update => {
      //parent_svg.selectAll('.feature_g').attr('opacity',0.5)
      //update.attr('opacity',1)
      return update.transition().duration(anim_config.feature_animation).delay(anim_config.rank_animation + anim_config.deviation_animation).attr('transform', (d, svg_index) => "translate(" + (margin.item_left_margin + item_width * svg_index + (margin.item_right_margin * svg_index)) + ",0)").attr('x_transformation', (d, svg_index) => (margin.item_left_margin + item_width * svg_index + (margin.item_right_margin * svg_index)))
        .attr("id", d => d[0].replace(/[^\w\s]/gi, ''))
        .attr('svg_index', (d, svg_index) => svg_index)
        .attr('add_title_rect', function (d) { d3.select(this).selectAll('.title_rect').data([0]).join('rect').attr('class', 'title_rect').attr('width', item_width + 2).attr('x', -1).attr('height', margin.item_top_margin).attr('fill', '#d1d1d1') })
        .attr('add_title_text', function (d, svg_index) { d3.select(this).selectAll(".title_text").data([0]).join('text').attr('class', 'title_text').text(d[0]).attr('y', 0).attr('dominant-baseline', 'hanging').attr("font-size", 12).attr('x', 10).attr('text-anchor', 'start') })
        .attr('add_item_rect', function (d, svg_index) { d3.select(this).selectAll('.item_rect').data([0]).join('rect').attr('class', 'item_rect').attr('width', item_width).attr('height', item_height).attr('y', margin.item_top_margin).attr('fill', clicked_features.includes(d[0]) ? "#F8FDB8" : '#f2f2f2').attr('fill-opacity', 1).attr('stroke', '#b2b0b0') })
        //Add circles and lines to divide the rectangle
        .attr('add_contrib_lines', function (d, svg_index) {
          d3.select(this).selectAll(".mylines").data([[.25], [.5], [.75]]).join('line').attr('class', 'mylines')
            .attr('x1', 0).attr('x2', item_width)
            .attr('y1', d => d * (item_height + margin.item_top_margin)).attr('y2', d => d * (item_height + margin.item_top_margin)).attr('stroke-width', 1).attr("stroke", "#bababa")
        })
    }
    , exit => exit.remove())
  //---------------------------------------------------------------------------------------------------------------------------------------------------
  feature_g.attr('add_circle', function (d, i) {
    var svg_index = parseInt(d3.select(this).attr('svg_index'))
    d3.select(this).selectAll("circle").remove()
    var x_transformation = margin.item_left_margin + item_width * svg_index + (margin.item_right_margin * svg_index)
    var feature_name = d[0]
    var feature_contrib_name = d[0] + "_contribution"
    defualt_models.map(model => {
      var circ_data = []
      lime_data[model].map(item => {
        if (item['1-qid'] == selected_year && selected_instances.includes(parseInt(item['two_realRank']))) {
          item['id'] = parent_id+item['State'].replace(/\s/g, '') + model.replace(/\s/g, '')
          item["x_transformation"] = x_transformation
          circ_data.push(item)
        }
      })
      // Draw circle starts here
      var xScale = d3.scaleLinear().domain([d3.min(circ_data.map(item => parseFloat(item[d[0]]))), d3.max(circ_data.map(item => parseFloat(item[d[0]])))])
        .range([2 * margin.circ_radius, item_width - 2 * margin.circ_radius])
      var yScale = d3.scaleLinear().domain([d3.min(circ_data.map(item => parseFloat(item[feature_contrib_name]))), d3.max(circ_data.map(item => parseFloat(item[feature_contrib_name])))]).range([margin.item_top_margin + margin.circ_radius, item_height - margin.circ_radius])
      var mycircles = d3.select(this).selectAll(".my_circles" + model).data(circ_data, d => d['id']).join(
        enter => enter.append('circle')
          .attr('id', d => d['id'])
          .attr('class', 'circle2 my_circles' + model)
          .attr('r', margin.circ_radius)
          .attr('cy', d => margin.circ_radius / 2 + yScale(parseFloat(d[feature_contrib_name])))
          .attr('cx', (d, i) => xScale(parseFloat(d[feature_name])))
          .attr('fill', d => diverginColor(d['two_realRank']))
          .attr('cx2', (d, i) => d['x_transformation'] + xScale(parseFloat(d[feature_name])))
          .attr('two_realRank', d => d['two_realRank'])
        // Update
        , update => update.attr('class', 'circle2 my_circles' + model)
          .transition().duration(anim_config.circle_animation).delay(anim_config.rank_animation + anim_config.deviation_animation + anim_config.feature_animation)
          .attr('id', d => d['id'])
          .attr('class', 'circle2 my_circles' + model)
          .attr('r', margin.circ_radius)
          .attr('cy', d => margin.circ_radius / 2 + yScale(parseFloat(d[feature_contrib_name])))
          .attr('cx', (d, i) => xScale(parseFloat(d[feature_name])))
          .attr('fill', d => diverginColor(d['two_realRank']))
          .attr('cx2', (d, i) => d['x_transformation'] + xScale(parseFloat(d[feature_name])))
          .attr('two_realRank', d => d['two_realRank'])
        , exit => exit.remove())
      mycircles.on('click', d => Set_clicked_circles(clicked_circles.includes(d['id']) ? clicked_circles.filter(item => item != d['id']) : [...clicked_circles, d['id']]))
      // Draw circle ends here
    })
  }).on('dblclick', function (d) {
    d3.event.preventDefault()
    //d3.select(this).select('.item_rect').attr('fill','#F8FDB8')
    var temp = []
    if (clicked_features.includes(d[0])) {
      temp = clicked_features.filter(item => item != d[0])
    }
    else {
      temp = [...clicked_features, d[0]]
    }
    Set_clicked_features(temp)
  })
}
