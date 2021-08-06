import * as d3 from "d3";
import * as $ from "jquery";
import * as misc_algo from "./misc_algo";
import create_top_explanation_plot from "./05_00_top_explanation_plot"
export function CreatexpChart(
  parent_id, selected_instances, sorted_features, lime_data, selected_year, defualt_models, clicked_circles, Set_clicked_circles,
  diverginColor, anim_config, clicked_features, Set_clicked_features, symbolTypes) {
  var bottom_parent_width = $("#" + parent_id).width() - 5;
  var bottom_parent_height = $("#" + parent_id).height();
  //----------------------------------------------------------------------
  var top_histogram_width = 20 // This is the width
  var feature_total_width = bottom_parent_width / sorted_features.length; // This is the width each svg has to contain all features
  var feature_width = (bottom_parent_width / sorted_features.length) - top_histogram_width; // This is the width to use for the bottom explanation chart
  d3.select("#" + parent_id).selectAll(".features").data(sorted_features).join("svg").attr("class", "features")
    .attr("x", (d, i) => top_histogram_width + feature_total_width * i).attr("width", feature_width).attr("height", bottom_parent_height)
    .attr("add_lines", function (feature_data, i) {
      // font_line_gap=sparkline_width+4
      var config = { fontSize: 12, font_dy: -6, sparkline_width: 20, font_line_gap: 24, line_stroke_width: 10, animation_duration: 0, container_height: 100, my_svg_top_margin: 10, myg_top_margin: 10, left_margin: 100 };
      var y_distance = config.line_stroke_width + 2;
      d3.select(this).selectAll(".items").data(selected_instances).join("g").attr("class", "items").attr("transform", (d, i) => "translate(" + 0 + "," + (8 + i * y_distance) + ")")
        //---------------------------------------------------------------------------------------------------------------------------------------------------
        .attr("add_lines_and_circles", function (current_two_realRank, i) {
          var feature_contrib_name = feature_data[0] + "_contribution";
          d3.select(this).selectAll("line").data([current_two_realRank]).join("line")
            .attr("x1", 0).attr("x2", feature_width - 2).attr("y1", 0).attr("y2", (d) => 0).attr("stroke-width", 2).attr("stroke", "#CECECE");
          //----------------------------------------------------Add circles
          var current_item = [];
          //var circ_xscale=d3.scaleLinear().domain
          var circ_data = [];
          defualt_models.map((model_name, model_index) => {
            lime_data[model_name].map((item) => {
              if (item["1-qid"] == selected_year && selected_instances.includes(parseInt(item["two_realRank"]))) {
                item["id"] = parent_id + item["State"].replace(/ /g, "").replace(/[^a-zA-Z ]/g, "") + model_name.replace(/ /g, "").replace(/[^a-zA-Z ]/g, "");
                circ_data.push(item)
                if (current_two_realRank == parseInt(item["two_realRank"])) { current_item.push(item); }
              }
            });
          });
          // Draw circle starts here
          var xScale = d3.scaleLinear().domain([0, d3.max(circ_data.map((item) => parseFloat(item[feature_contrib_name])))]).range([5, feature_width - 7]);
          // ---------------------------------------------------------------------------------Add symbols
          var symbolGenerator = d3.symbol().size(30);
          d3.select(this).selectAll("." + "symbols").data(current_item).join("g").transition().duration(0)
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
              d3.select(this).selectAll("path").data([0]).join("path").attr("d", function () { symbolGenerator.type(d3[symbolTypes[d['model']]]); return symbolGenerator(); })
                .attr("fill", d => diverginColor(current_two_realRank));
            })
            .attr("add_parent_id", function (d) {
              d3.select(this.parentNode).classed(d['id'], true)
            });
          //-----
        });
    });
  //----------------------------------------------------------------------
  create_top_explanation_plot("top_exp", selected_instances, sorted_features, lime_data, selected_year, defualt_models, 
    clicked_circles, Set_clicked_circles, diverginColor, anim_config, clicked_features, Set_clicked_features, feature_total_width, 
    feature_width,top_histogram_width,symbolTypes)

}
































export function CreatexpCircle(
  parent_id,
  selected_instances,
  sorted_features,
  lime_data,
  selected_year,
  defualt_models,
  clicked_circles,
  Set_clicked_circles,
  diverginColor,
  anim_config,
  clicked_features,
  Set_clicked_features
) {
  var margin = {
    item_top_margin: 15,
    right: 14,
    bottom: 0,
    left: 20,
    circ_radius: 5,
    item_left_margin: 25,
    item_right_margin: 3,
  };
  var bottom_parent_width = $("#" + parent_id).width() - margin.item_left_margin;
  var bottom_parent_height = $("#" + parent_id).height() - margin.item_top_margin * 2;
  var item_width =
    bottom_parent_width / sorted_features.length - margin.item_right_margin;
  var item_height = bottom_parent_height;
  sorted_features.map((d, svg_index) => {
    var x_transformation =
      margin.item_left_margin +
      item_width * svg_index +
      margin.item_right_margin * svg_index;
    var feature_name = d[0];
    var feature_contrib_name = d[0] + "_contribution";
    defualt_models.map((model) => {
      var circ_data = [];
      lime_data[model].map((item) => {
        if (
          item["1-qid"] == selected_year &&
          selected_instances.includes(parseInt(item["two_realRank"]))
        ) {
          item["id"] =
            parent_id +
            item["State"].replace(/ /g, "").replace(/[^a-zA-Z ]/g, "") +
            model.replace(/ /g, "").replace(/[^a-zA-Z ]/g, "");
          circ_data.push(item);
        }
      });
      // Draw circle starts here
      var xScale = d3
        .scaleLinear()
        .domain([
          d3.min(circ_data.map((item) => parseFloat(item[d[0]]))),
          d3.max(circ_data.map((item) => parseFloat(item[d[0]]))),
        ])
        .range([2 * margin.circ_radius, item_width - 2 * margin.circ_radius]);
      var yScale = d3
        .scaleLinear()
        .domain([
          d3.min(
            circ_data.map((item) => parseFloat(item[feature_contrib_name]))
          ),
          d3.max(
            circ_data.map((item) => parseFloat(item[feature_contrib_name]))
          ),
        ])
        .range([
          margin.item_top_margin + margin.circ_radius,
          item_height - margin.circ_radius,
        ]);
      var mycircles = d3
        .select("#" + parent_id)
        .select("#" + d[0].replace(/[^\w\s]/gi, ""))
        .selectAll(".my_circles" + model)
        .data(circ_data, (d) => d["id"])
        .join(
          (enter) =>
            enter
              .append("circle")
              .attr("id", (d) => d["id"])
              .attr("class", "circle2 my_circles" + model)
              .attr("r", margin.circ_radius)
              .attr(
                "cy",
                (d) =>
                  margin.circ_radius / 2 +
                  yScale(parseFloat(d[feature_contrib_name]))
              )
              .attr("cx", (d, i) => xScale(parseFloat(d[feature_name])))
              .attr("fill", (d) => diverginColor(d["two_realRank"]))
              .attr(
                "cx2",
                (d, i) => x_transformation + xScale(parseFloat(d[feature_name]))
              )
              .attr("two_realRank", (d) => d["two_realRank"]),
          // Update
          (update) =>
            update
              .attr("class", "circle2 my_circles" + model)
              .transition()
              .duration(anim_config.circle_animation)
              .delay(
                anim_config.rank_animation +
                anim_config.deviation_animation +
                anim_config.feature_animation
              )
              .on("end", () =>
                misc_algo.draw_lines(clicked_circles, diverginColor)
              )
              .attr("id", (d) => d["id"])
              .attr("class", "circle2 my_circles" + model)
              .attr("r", margin.circ_radius)
              .attr(
                "cy",
                (d) =>
                  margin.circ_radius / 2 +
                  yScale(parseFloat(d[feature_contrib_name]))
              )
              .attr("cx", (d, i) => xScale(parseFloat(d[feature_name])))
              .attr("fill", (d) => diverginColor(d["two_realRank"]))
              .attr(
                "cx2",
                (d, i) => x_transformation + xScale(parseFloat(d[feature_name]))
              )
              .attr("two_realRank", (d) => d["two_realRank"]),
          (exit) => exit.remove()
        );
      mycircles
        .attr(
          "cx2",
          (d, i) => x_transformation + xScale(parseFloat(d[feature_name]))
        )
        .on("click", (d) => {
          Set_clicked_circles(
            clicked_circles.includes(d["id"])
              ? clicked_circles.filter((item) => item != d["id"])
              : [...clicked_circles, d["id"]]
          );
        });
      // Draw circle ends here
    });
  });
}
