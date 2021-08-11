import * as d3 from 'd3';
import * as $ from 'jquery';
import CreateHistogram from "./CreateHistogram"
import CreateTop_exp_Circle from './Create_Top_exp_circles';
export default function Create_exp_parents(selected_instances, sorted_features, lime_data, selected_year, defualt_models, clicked_circles, Set_clicked_circles, diverginColor, anim_config, clicked_features, Set_clicked_features, symbolTypes) {
  var Topmargin = { item_top_margin: 6, item_bottom_margin: 6, circ_radius: 5, item_left_margin: 6, item_right_margin: 6 }
  var feature_container_svg_width = $(".feature_container_svg").width()
  //var feature_container_svg_height=$(".feature_container_svg").height()
  var histogram_space_on_left = 30
  var histogram_axis_space_on_right = 30
  var feature_width = (feature_container_svg_width / sorted_features.length) - (histogram_space_on_left + histogram_axis_space_on_right)
  var dev_top_h = $(".dev_top").height()
  d3.select(".feature_container_svg").selectAll(".feature_svg").data(sorted_features).join("svg").attr("class", "feature_svg").attr("x", (d, feature_index) => (histogram_space_on_left + histogram_axis_space_on_right + feature_width) * feature_index).attr("width", (histogram_space_on_left + histogram_axis_space_on_right + feature_width))
    //-------------------------------------------HandleTop
    .attr("add_top_g", function (feature_data) {
      d3.select(this).selectAll(".top_g").data([0]).join("g").attr("class", "top_g")
    })
    .attr("add_histogram", function (feature_data, feature_index) {
      d3.select(this).selectAll(".histogram_g").data([0]).join("g").attr("class", "histogram_g").attr("call_create_histogram", function () {
        CreateHistogram(Topmargin,feature_data, d3.select(this), selected_instances, sorted_features, lime_data, selected_year, defualt_models, clicked_circles, Set_clicked_circles, diverginColor, anim_config, clicked_features, Set_clicked_features, histogram_space_on_left, feature_width, dev_top_h)
      })
      //.attr("transform","translate("+histogram_space_on_left+","+dev_top_h+")") // Transform the bottom g
    })
    .attr("CreateTop_exp_Circle", function (feature_data, feature_index) {
      CreateTop_exp_Circle(Topmargin,feature_data, d3.select(this), selected_instances, sorted_features, lime_data, selected_year, defualt_models, clicked_circles, Set_clicked_circles, diverginColor, anim_config, clicked_features, Set_clicked_features, symbolTypes, histogram_space_on_left, feature_width, dev_top_h)
    })
    //-------------------------------------------HandleTop
    .attr("add_bottom_g", function (feature_data, feature_index) {
      d3.select(this).selectAll(".bottom_g").data([0]).join("g").attr("class", "bottom_g")
        .attr("transform", "translate(" + histogram_space_on_left + "," + dev_top_h + ")") // Transform the bottom g
        .attr("add_lines", function () {
          
          // font_line_gap=sparkline_width+4
          var config = { fontSize: 12, font_dy: -6, sparkline_width: 20, font_line_gap: 24, line_stroke_width: 10, animation_duration: 0, container_height: 100, my_svg_top_margin: 10, myg_top_margin: 10, left_margin: 100 };
          var y_distance = config.line_stroke_width + 2;
          d3.select(this).selectAll(".items").data(selected_instances).join("g").attr("class", "items").attr("transform", (d, i) => "translate(" + 0 + "," + (8 + i * y_distance) + ")")
            //---------------------------------------------------------------------------------------------------------------------------------------------------
            .attr("add_lines_and_circles", function (current_two_realRank, i) {
              var feature_contrib_name = feature_data[0] + "_contribution";
              d3.select(this).selectAll("line").data([current_two_realRank]).join("line")
                .attr("x1", 0).attr("x2", feature_width - 2).attr("y1", 0).attr("y2", (d) => 0).attr("stroke-width", 0.7).attr("stroke", "#CECECE");
              //----------------------------------------------------Add circles
              var current_item = [];
              //var circ_xscale=d3.scaleLinear().domain
              var circ_data = [];
              defualt_models.map((model_name, model_index) => {
                lime_data[model_name].map((item) => {
                  if (item["1-qid"] == selected_year && selected_instances.includes(parseInt(item["two_realRank"]))) {
                    item["id"] = "A" + item["State"].replace(/ /g, "").replace(/[^a-zA-Z ]/g, "") + model_name.replace(/ /g, "").replace(/[^a-zA-Z ]/g, "");
                    circ_data.push(item)
                    if (current_two_realRank == parseInt(item["two_realRank"])) { current_item.push(item); }
                  }
                });
              });
              // Draw circle starts here
              var xScale = d3.scaleLinear().domain([0, d3.max(circ_data.map((item) => parseFloat(item[feature_contrib_name])))]).range([5, feature_width - 7]);
              // ---------------------------------------------------------------------------------Add symbols
              var symbolGenerator = d3.symbol().size(50);
              d3.select(this).selectAll("." + "symbols").data(current_item).join("g")//.transition().duration(0)
                .attr('class', d => "symbols circle2 " + d['model'].replace(/ /g, '').replace(/[^a-zA-Z ]/g, ""))
                .attr("transform", function (d, i) {
                  // make a transformation algorithm to scale modelwise
                  var x_transform = 5
                  if (parseFloat(d[feature_contrib_name]) > 0) {
                    x_transform = xScale(parseFloat(d[feature_contrib_name]))
                  }
                  return "translate(" + x_transform + "," + 0 + ")";
                })
                .attr("Add_symbol", function (d, i) {
                  d3.select(this.parentNode).classed(d['id'], true)
                  d3.select(this).selectAll("path").data([0]).join("path").attr("d", function () { symbolGenerator.type(d3[symbolTypes[d['model']]]); return symbolGenerator(); })
                    .attr("fill", d => diverginColor(current_two_realRank));
                })
                .on('click', d => {
                  Set_clicked_circles(clicked_circles.includes(d['id']) ? clicked_circles.filter(item => item != d['id']) : [...clicked_circles, d['id']])
                })
              //-----
            })
        });
    })
}