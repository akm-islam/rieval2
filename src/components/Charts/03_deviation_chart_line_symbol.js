import * as d3 from 'd3';
import * as $ from 'jquery';
export default function add_lines_and_circles(selection,data,defualt_models,config,symbolTypes,clicked_circles,Set_clicked_circles,parent_exp_id,diverginColor,circle_radius,d,anim_config,y_distance,parent_width){
  var data_for_all_years = data.filter(item => d['two_realRank'] == parseInt(item['two_realRank']))
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
  var temp_max = d3.max(temp_scale_data)
  var sclale1 = d3.scaleLinear().domain([0, temp_max]).range([config.font_line_gap, parent_width - (config.left_margin + circle_radius)])
  if (temp_max == 0) { var sclale1 = d3.scaleLinear().domain([0, temp_max]).range([config.font_line_gap, 0]) }
  // This is only for scaling ends here
  selection.selectAll("line").data([d]).join(enter => enter.append('line')
    .attr("x1", config.font_line_gap).attr("y1", (d, i) => y_distance * i).attr("y2", (d, i) => y_distance * i).attr("stroke-width", config.line_stroke_width).attr("stroke", "#cecece").attr("x2", (d2) => {
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
  defualt_models.map(model_name => {
    data_for_all_years.map(item => {
      var a = {}
      a['two_realRank'] = parseInt(item['two_realRank'])
      a['predicted_rank'] = parseInt(item[model_name])
      a["model"] = model_name
      a['year'] = item['1-qid']
      a['id'] =parent_exp_id+item['State'].replace(/ /g, '').replace(/[^a-zA-Z ]/g, "") + model_name.replace(/ /g, '').replace(/[^a-zA-Z ]/g, "")
      circ_data.push(a)
    })
  })

  var symbolGenerator = d3.symbol().size(30);
  var mysymbs=selection.selectAll("."+"symbols").data(circ_data).join("g")
  .attr('class',d=>"symbols circle2 "+d['model'].replace(/ /g, '').replace(/[^a-zA-Z ]/g, ""))
    .attr("transform", function (d2, i) {
      // make a transformation algorithm to scale modelwise
      var x_transform = 5
      if (d2["predicted_rank"] - d2['two_realRank'] == 0) { x_transform = sclale1(Math.abs(d2["predicted_rank"] - d2['two_realRank'])) + circle_radius }
      x_transform =sclale1(Math.abs(d2["predicted_rank"] - d2['two_realRank']))
      return "translate(" + x_transform + "," + 0 + ")";
    })
    .attr("Add_symbol", function (d, i) {
      d3.select(this).selectAll("path").data([0]).join("path").attr("d", function () {symbolGenerator.type(d3[symbolTypes[d['model']]]);return symbolGenerator();})
        .attr("fill", () => diverginColor(d["two_realRank"]));
    });
 //-----
 mysymbs.attr("parent_id", parent_exp_id)
    .on('click', d => Set_clicked_circles(clicked_circles.includes(d['id']) ? clicked_circles.filter(item => item != d['id']) : [...clicked_circles, d['id']]))
}