import React, { Component } from 'react';
import * as d3 from 'd3';
import * as $ from 'jquery';
import _, { update } from 'lodash';
import './Chart.css';
//import * as SlopeChart from "./SlopeChart";
//import * as exp_algo from "../Algorithms/exp_algo";
import * as algo1 from "../../Algorithms/algo1";
import school from "../../Data/data/school/lime/school2.json";
import fiscal from "../../Data/data/fiscal/lime/fiscal2.json";
import { connect } from "react-redux";
import { Row } from 'reactstrap';
import Replay from "./Replay"
//import {get_feature_voting} from "../Algorithms/exp_algo";

var number_of_charts;
class Chart extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    var slope_chart_anim1 = 2000
    var slope_chart_anim2 = 2000
    this.chart_anim_svg_delay = slope_chart_anim1 + slope_chart_anim2
    this.chart_anim_svg_duration = 3000
    this.chart_anim_circle_delay = slope_chart_anim1 + slope_chart_anim2 + this.chart_anim_svg_duration
    this.chart_anim_circ_duration = 2000

  }
  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }
  async componentDidMount() {
    this.setState({ a: 10 }) // This is to call the componentdidupdate
    var self = this;
    var feature_height = 260
    var exp_chart_width = $(".exp_chart").width();
    var deviate_by = this.props.deviate_by
    var start_range = this.props.state_range != null ? this.props.state_range[0] : 10; // range to start
    if (start_range > 0) { start_range -= 1 } // This is to start from index 0
    if (start_range < 0) { start_range = 0 } // check if the deviation make the starting range less than the available rank
    if (start_range < deviate_by) { deviate_by = start_range } // check if the deviation make the starting range less than the available rank
    start_range = start_range - deviate_by
    if (start_range < 0) { start_range = 0; deviate_by = 0 }
    var height_between = 20
    var number_of_elements = (this.props.state_range[1] - this.props.state_range[0]) + (2 * this.props.deviate_by);
    if (number_of_elements * height_between < 700) { height_between = 700 / number_of_elements }
    var exp_chart_height = (number_of_elements * height_between);
    //------
    number_of_charts = Math.floor(exp_chart_height / feature_height) * 3
    exp_chart_height = (number_of_elements * height_between) + 75;

    var parent_margin = { left_margin_for_first_chart: 55, right_margin_for_last_chart: 48, space_between: 5 } // left_margin_for_first_chart and right_margin_for_last_chart are used to have some space on the left and right for the contibution text and +,-; space_between is to have spaces between charts
    var total_width_for_all_features = exp_chart_width - (parent_margin.left_margin_for_first_chart + parent_margin.right_margin_for_last_chart + (2 * parent_margin.space_between)); // 2 times margin between for spaces before svg 1,2
    var width_for_each_feature = total_width_for_all_features / 3
    var sorted_features = algo1.sorted_features(this.props.dataset, this.props.model_name, d3.range(this.props.state_range[0], this.props.state_range[1]), this.props.selected_year);
    if (sorted_features.length < number_of_charts) { number_of_charts = sorted_features.length }
    if (number_of_charts < 9) { number_of_charts = 9 }
    var identifier = "svg_" + this.props.model_name2
    d3.selectAll(".exp_chart").style("height", ((number_of_charts / 3) * 260) + "px");
    var features_with_score = algo1.voted_dict4(this.props.dataset, this.props.default_models, d3.range(this.props.state_range[0], this.props.state_range[1]), this.props.selected_year, number_of_charts)

    //-----------------------------
    var number_of_contribution_text = (number_of_charts / 3) * 2 // multiplied by two because we need them on both sides
    d3.select("." + this.props.model_name2).selectAll(".myrect2").data(d3.range(number_of_contribution_text), d => d).join("rect").attr("class", "myrect2")
      .attr("x", (d, i) => d % 2 == 0 ? 0 : (total_width_for_all_features + parent_margin.left_margin_for_first_chart + (parent_margin.space_between)))
      .attr("width", (d, i) => d % 2 == 0 ? parent_margin.left_margin_for_first_chart : (parent_margin.right_margin_for_last_chart + 3))
      .attr("height", 255).attr("fill", "white")
      .attr("y", (d, i) => {
        return (260 * (Math.floor(i / 2)))
      })
    d3.select("." + this.props.model_name2).selectAll(".cont_text").data(d3.range(number_of_contribution_text), d => d).join("text").attr("class", "cont_text")
      .attr("x", (d, i) => d % 2 == 0 ? 13 : (exp_chart_width - 8))
      .attr("y", (d, i) => ((feature_height * Math.floor(d / 2)) + (feature_height / 2)))
      .style("text-anchor", "middle")
      .style("writing-mode", "tb")
      .text("Contribution")
    d3.select("." + this.props.model_name2).selectAll('.zero_text').data(d3.range(number_of_charts), d => d).join('text').attr("class", "zero_text").attr("stroke", "#DCDCDC").text((d, i) => d % 3 == 0 ? 0 : "").style("font-size", 12)
      .attr("x", (d, i) => d % 3 == 0 ? 35 : NaN)
      .attr("y", (d, i) => ((feature_height * Math.floor(d / 3)) + (feature_height / 2)) + 7)
    //-----------------------------
    d3.select("." + this.props.model_name2).attr("height", exp_chart_height + "px").select(".feature_container").selectAll(".explanation").data(sorted_features.slice(0, number_of_charts), d => d.replace(/[^\w\s]/gi, '')).join(
      enter => {
        return enter.append("svg")
          .attr("height", feature_height)
          .attr("width", width_for_each_feature)
          .attr("class", (d, i) => {
            return 'explanation ' + identifier + i
          })
          .attr("opacity", 0)
          .attr("id", d => d.replace(/[^\w\s]/gi, '') + this.props.model_name2)
          .attr("fill", (d, feature_index) => {
            
            var id_name = d.replace(/[^\w\s]/gi, '') + this.props.model_name2
            this.CreateChart("#" + id_name, feature_index, d, parent_margin, width_for_each_feature, feature_height, exp_chart_width, "enter", features_with_score)
            return "enter";
          })
          .attr("x", (d, i) => {
            if (i % 3 == 0) {
              return width_for_each_feature * (i % 3) + parent_margin.left_margin_for_first_chart // i mode 3 always returns 0,1,2
            }
            else if (i % 3 == 1) {
              return parent_margin.left_margin_for_first_chart + width_for_each_feature * (i % 3) + parent_margin.space_between // i mode 3 always returns 0,1,2
            }
            else {
              return parent_margin.left_margin_for_first_chart + width_for_each_feature * (i % 3) + parent_margin.space_between * 2 // i mode 3 always returns 0,1,2
            }
          })
          .attr("y", (d, i) => {
            return feature_height * (Math.floor(i / 3))
          }).call(enter => enter.transition().delay(self.chart_anim_svg_delay).duration(self.chart_anim_svg_durationation).attr("opacity", 1))

      },
      update => {
        return update.attr("height", feature_height)
          .attr("class", (d, feature_index) => {
            return 'explanation ' + identifier + feature_index
          })
          .attr("opacity", 1)
          .attr("id", d => d.replace(/[^\w\s]/gi, '') + this.props.model_name2)
          .attr("width", (d, i) => {
            return width_for_each_feature
          })
          .attr("fill", (d, feature_index) => {
            var id_name = d.replace(/[^\w\s]/gi, '') + this.props.model_name2
            this.CreateChart("#" + id_name, feature_index, d, parent_margin, width_for_each_feature, feature_height, exp_chart_width, "update", features_with_score)
            return "update";
          })
          .transition().delay(self.chart_anim_svg_delay).duration(self.chart_anim_svg_duration)
          .attr("x", (d, i) => {
            if (i % 3 == 0) {
              return width_for_each_feature * (i % 3) + parent_margin.left_margin_for_first_chart // i mode 3 always returns 0,1,2
            }
            else if (i % 3 == 1) {
              return parent_margin.left_margin_for_first_chart + width_for_each_feature * (i % 3) + parent_margin.space_between // i mode 3 always returns 0,1,2
            }
            else {
              return parent_margin.left_margin_for_first_chart + width_for_each_feature * (i % 3) + parent_margin.space_between * 2 // i mode 3 always returns 0,1,2
            }
          })
          .attr("y", (d, i) => {
            return feature_height * (Math.floor(i / 3))
          })
      }, // update ends here
      exit => {
        return exit.transition().duration(2000).attr("opacity", 0).remove()
      })
  }
  task2 = (idName) => {
    //--------------
    var opacity = ".4"
    var opacity2 = ".06"
    d3.selectAll(".mysvg").selectAll("text").attr("fill-opacity", opacity)
    d3.selectAll(".mysvg").selectAll("path").attr("fill-opacity", opacity).attr("stroke-opacity", opacity)
    d3.selectAll(".mysvg").selectAll("circle").attr("fill-opacity", opacity).attr("stroke-opacity", opacity)
    d3.selectAll(".mysvg").selectAll("line").attr("opacity", opacity)
    d3.selectAll('.exp_circles').attr("fill-opacity", opacity2).attr("stroke-opacity", opacity2)
    d3.selectAll("#" + idName).classed("highlighted", true)
    d3.selectAll("#" + idName).filter("line").classed("highlighted_line", true)
  }
  componentDidUpdate(prevProps, nextProps) {
    //--- This is to remove the items clicked but are out of range
    var outof_range_state = []
    this.props.grouped_by_year_data[this.props.selected_year].map(item => {
      if (item.two_realRank < (this.props.state_range[0] - parseInt(this.props.deviate_by)) || item.two_realRank > (this.props.state_range[1] + parseInt(this.props.deviate_by))) { // this will include the deviated states
        //if(item.two_realRank<this.props.state_range[0] || item.two_realRank>this.props.state_range[1]){ // this will exclude the deviated states
          var temp_State="A"+item.State
          outof_range_state.push(temp_State)
      }
    })
    var temp_clicked_items_in_slopechart=this.props.clicked_items_in_slopechart
    temp_clicked_items_in_slopechart= this.props.clicked_items_in_slopechart.filter(item=>!outof_range_state.includes(item))
    temp_clicked_items_in_slopechart.map(item => this.task2(item))
    //----
    if (temp_clicked_items_in_slopechart.length == 0) {
      d3.selectAll(".mysvg").selectAll("text").attr("fill-opacity", "1")
      d3.selectAll(".mysvg").selectAll("path").attr("fill-opacity", "1").attr("stroke-opacity", "1")
      d3.selectAll(".mysvg").selectAll("circle").attr("fill-opacity", "1")
      d3.selectAll(".mysvg").selectAll("line").attr("opacity", "1")
      d3.selectAll('.exp_circles').attr("fill-opacity", "1")
    }
    var self = this;
    var feature_height = 260
    var exp_chart_width = $(".exp_chart").width();
    var deviate_by = this.props.deviate_by
    var start_range = this.props.state_range != null ? this.props.state_range[0] : 10; // range to start
    if (start_range > 0) { start_range -= 1 } // This is to start from index 0
    if (start_range < 0) { start_range = 0 } // check if the deviation make the starting range less than the available rank
    if (start_range < deviate_by) { deviate_by = start_range } // check if the deviation make the starting range less than the available rank
    start_range = start_range - deviate_by
    if (start_range < 0) { start_range = 0; deviate_by = 0 }
    var height_between = 20
    var number_of_elements = (this.props.state_range[1] - this.props.state_range[0]) + (2 * this.props.deviate_by);
    if (number_of_elements * height_between < 700) { height_between = 700 / number_of_elements }
    var exp_chart_height = (number_of_elements * height_between);
    //------

    number_of_charts = Math.floor(exp_chart_height / feature_height) * 3
    if(number_of_charts<9){number_of_charts=9}
    exp_chart_height = (number_of_elements * height_between) + 75;
    var parent_margin = { left_margin_for_first_chart: 55, right_margin_for_last_chart: 48, space_between: 5 } // left_margin_for_first_chart and right_margin_for_last_chart are used to have some space on the left and right for the contibution text and +,-; space_between is to have spaces between charts
    var total_width_for_all_features = exp_chart_width - (parent_margin.left_margin_for_first_chart + parent_margin.right_margin_for_last_chart + (2 * parent_margin.space_between)); // 2 times margin between for spaces before svg 1,2
    var width_for_each_feature = total_width_for_all_features / 3

    var sorted_features = algo1.sorted_features(this.props.dataset, this.props.model_name, d3.range(this.props.state_range[0], this.props.state_range[1]), this.props.selected_year,number_of_charts);
    var features_with_score = algo1.voted_dict4(this.props.dataset, this.props.default_models, d3.range(this.props.state_range[0], this.props.state_range[1]), this.props.selected_year, number_of_charts)
    console.log("features_with_score",features_with_score,number_of_charts)
    if (sorted_features.length < number_of_charts) { number_of_charts = sorted_features.length }
    if (number_of_charts < 9) { number_of_charts = 9 }
    var identifier = "svg_" + this.props.model_name2
    d3.selectAll(".exp_chart").style("height", ((number_of_charts / 3) * 260) + "px");
    
    //-----------------------------
    var number_of_contribution_text = (number_of_charts / 3) * 2 // multiplied by two because we need them on both sides
    d3.select("." + this.props.model_name2).selectAll(".myrect2").data(d3.range(number_of_contribution_text), d => d).join("rect").attr("class", "myrect2")
      .attr("x", (d, i) => d % 2 == 0 ? 0 : (total_width_for_all_features + parent_margin.left_margin_for_first_chart + (parent_margin.space_between)))
      .attr("width", (d, i) => d % 2 == 0 ? parent_margin.left_margin_for_first_chart : (parent_margin.right_margin_for_last_chart + 3))
      .attr("height", 255).attr("fill", "white")
      .attr("y", (d, i) => {
        return (260 * (Math.floor(i / 2)))
      })
    d3.select("." + this.props.model_name2).selectAll(".cont_text").data(d3.range(number_of_contribution_text), d => d).join("text").attr("class", "cont_text")
      .attr("x", (d, i) => d % 2 == 0 ? 13 : (exp_chart_width - 8))
      .attr("y", (d, i) => ((feature_height * Math.floor(d / 2)) + (feature_height / 2)))
      .style("text-anchor", "middle")
      .style("writing-mode", "tb")
      .text("Contribution")
    d3.select("." + this.props.model_name2).selectAll('.zero_text').data(d3.range(number_of_charts), d => d).join('text').attr("class", "zero_text").attr("stroke", "#DCDCDC").text((d, i) => d % 3 == 0 ? 0 : "").style("font-size", 12)
      .attr("x", (d, i) => d % 3 == 0 ? 35 : NaN)
      .attr("y", (d, i) => ((feature_height * Math.floor(d / 3)) + (feature_height / 2)) + 7)
    //-----------------------------
    d3.select("." + this.props.model_name2).attr("height", exp_chart_height + "px").select(".feature_container").selectAll(".explanation").data(sorted_features.slice(0, number_of_charts), d => d.replace(/[^\w\s]/gi, '')).join(
      enter => {
        return enter.append("svg")
          .attr("height", feature_height)
          .attr("width", width_for_each_feature)
          .attr("class", (d, i) => {
            return 'explanation ' + identifier + i
          })
          .attr("opacity", 0)
          .attr("id", d => d.replace(/[^\w\s]/gi, '') + this.props.model_name2)
          .attr("fill", (d, feature_index) => {
            var id_name = d.replace(/[^\w\s]/gi, '') + this.props.model_name2
            this.CreateChart("#" + id_name, feature_index, d, parent_margin, width_for_each_feature, feature_height, exp_chart_width, "enter", features_with_score)
            return "enter";
          })
          .attr("x", (d, i) => {
            if (i % 3 == 0) {
              return width_for_each_feature * (i % 3) + parent_margin.left_margin_for_first_chart // i mode 3 always returns 0,1,2
            }
            else if (i % 3 == 1) {
              return parent_margin.left_margin_for_first_chart + width_for_each_feature * (i % 3) + parent_margin.space_between // i mode 3 always returns 0,1,2
            }
            else {
              return parent_margin.left_margin_for_first_chart + width_for_each_feature * (i % 3) + parent_margin.space_between * 2 // i mode 3 always returns 0,1,2
            }
          })
          .attr("y", (d, i) => {
            return feature_height * (Math.floor(i / 3))
          }).call(enter => enter.transition().delay(self.chart_anim_svg_delay).duration(self.chart_anim_svg_durationation).attr("opacity", 1))

      },
      update => {
        return update.attr("height", feature_height)
          .attr("class", (d, feature_index) => {
            return 'explanation ' + identifier + feature_index
          })
          .attr("opacity", 1)
          .attr("id", d => d.replace(/[^\w\s]/gi, '') + this.props.model_name2)
          .attr("width", (d, i) => {
            return width_for_each_feature
          })
          .attr("fill", (d, feature_index) => {
            var id_name = d.replace(/[^\w\s]/gi, '') + this.props.model_name2
            this.CreateChart("#" + id_name, feature_index, d, parent_margin, width_for_each_feature, feature_height, exp_chart_width, "update", features_with_score)
            return "update";
          })
          .transition().delay(self.chart_anim_svg_delay).duration(self.chart_anim_svg_duration)
          .attr("x", (d, i) => {
            if (i % 3 == 0) {
              return width_for_each_feature * (i % 3) + parent_margin.left_margin_for_first_chart // i mode 3 always returns 0,1,2
            }
            else if (i % 3 == 1) {
              return parent_margin.left_margin_for_first_chart + width_for_each_feature * (i % 3) + parent_margin.space_between // i mode 3 always returns 0,1,2
            }
            else {
              return parent_margin.left_margin_for_first_chart + width_for_each_feature * (i % 3) + parent_margin.space_between * 2 // i mode 3 always returns 0,1,2
            }
          })
          .attr("y", (d, i) => {
            return feature_height * (Math.floor(i / 3))
          })
      }, // update ends here
      exit => {
        return exit.transition().duration(2000).attr("opacity", 0).remove()
      })
  }

  //-------------------------------------------------------------------------------------------------------------------------------------CreateChart function
  CreateChart = (node, feature_index, exp_feature, parent_margin, width_for_each_feature, feature_height, exp_chart_width, status, features_with_score) => {
    var self = this;
    console.log("key",this.props.model_name)
    var year = this.props.selected_year;
    var number_of_filters_start = this.props.state_range[0];
    var number_of_filters_end = this.props.state_range[1];
    var dataset = this.props.dataset;
    var histogram_data = this.props.histogram_data;
    var models = this.props.default_models;
    var selected_range = [];
    var formatSuffix = d3.format(".0s");
    var formatDecimal = d3.format(".2f");
    var xmin = 0;
    var xmax = 0;
    var data2, filename2;
    var svg = d3.select(node);
    svg.selectAll(".myrect").data([0]).join("rect").attr("class", "myrect").attr("width", width_for_each_feature).attr("height", 255).attr("fill", "white")
    var margin_each_feature = { top: 20, right: 0, bottom: 55, left: 0 }
    var width = width_for_each_feature
    var height = feature_height - margin_each_feature.top - margin_each_feature.bottom;
    if (this.props.model_name == "ListNet" & (dataset == "fiscal" | dataset == "school")) {
      svg.append("text")
        .text("The explanation does not exists")
        .style("font-family", "'Open Sans'")
        .attr("x", 30)
        .attr("y", 120);
      return;
    }
    //var chartname = ((this.props.model_name).toString()).replace(".", ""); //cannot afford to keep dots in chartname
    if (dataset == "fiscal") { filename2 = fiscal; }
    else if (dataset == "school") { filename2 = school; }

    if (histogram_data.length > 0) { data2 = JSON.parse(filename2[this.props.model_name]).filter(element => { if ((parseInt(element['1-qid']) == parseInt(year)) && (histogram_data.includes(parseInt(element['two_realRank'])))) { return element } }); }
    else { data2 = JSON.parse(filename2[this.props.model_name]).filter(element => { if ((parseInt(element['1-qid']) == parseInt(year)) && (parseInt(element['two_realRank']) >= parseInt(number_of_filters_start) && (parseInt(element['two_realRank']) <= parseInt(number_of_filters_end)))) { return element } }); }

    selected_range = data2.map(function (d) { return parseInt(d.two_realRank) });
    selected_range.sort(function (a, b) { return a - b });
    //-------------------------------------------------------------------------------------------------Chart Preprocessing Starts
    var exp_feature_contribution = exp_feature + "_contribution";
    var type_of_axis = "numerical";
    if (isNaN(data2[0][exp_feature])) { type_of_axis = "categorical"; } //checking for type of axis //not working for "predicted"
    else { type_of_axis = "numerical"; }
    if (type_of_axis == "numerical") {
      var x = d3.scaleLinear().rangeRound([0, width]),
        y = d3.scaleBand().rangeRound([height, 0]).padding(0.5);
    }
    else {
      var x = d3.scaleBand().rangeRound([0, width]).padding(0.5),
        y = d3.scaleBand().rangeRound([height, 0]).padding(0.5);
    }
    var g1 = svg.selectAll(".g1").data([node]).join("g").attr("class", "g1").attr("transform", "translate(" + margin_each_feature.left + "," + margin_each_feature.top + ")");
    var xAxis = d3.axisBottom(x).ticks(5).tickSize(155).tickSizeOuter(0);
    var yAxis = d3.axisLeft(y).ticks(0).tickSize(0);//.tickCenterLabel(true);
    var true_rank_array = data2.map(function (d) { return parseInt(d.two_realRank) }); // Predicted rankings
    true_rank_array.sort(function (a, b) { return a - b });
    function make_y_gridlines() {
      return d3.axisLeft(y)
        .ticks(0).tickSize(0);
    }
    //-------------------------------------------------------------------------------------------------Chart Preprocessing Ends
    var ymin = d3.min(data2, function (d) {
      return parseFloat(parseFloat(d[exp_feature_contribution]).toFixed(4));
    });
    var ymax = d3.max(data2, function (d) {
      return parseFloat(parseFloat(d[exp_feature_contribution]).toFixed(4));
    });
    var y_greater = (Math.abs(ymin) < Math.abs(ymax)) ? ymax : ymin;
    var y_limit = 0.25 * Math.abs(y_greater);
    var original_contribution_value = parseFloat(data2[exp_feature_contribution]);
    for (var i = 0; i < data2.length; i++) {
      var temp4 = data2[i];
      var original_contribution_value = parseFloat(temp4[exp_feature_contribution]);
      data2[i].feature_contribution_binned = (original_contribution_value >= 0) ? ((original_contribution_value >= y_limit) ? "++ ve" : "+ ve") : ((Math.abs(original_contribution_value) >= y_limit) ? "-- ve" : "- ve");
      data2[i].feature_contribution_class = (data2[i].feature_contribution_binned == "++ ve" | data2[i].feature_contribution_binned == "+ ve") ? 1 : 0;
      data2[i].idname = String(data2[i].State).replace(/[\.,\s+]/g, '');

    }
    // Define Extent for each Dataset
    if (type_of_axis == "numerical") {
      xmin = d3.min(data2, function (d) { return parseFloat(d[exp_feature]); });
      xmax = d3.max(data2, function (d) { return parseFloat(d[exp_feature]); });
      var xmin_ = (xmin >= 0) ? (0.65 * xmin) : (1.35 * xmin); //Adding buffers to the xmin and xmax; needs to be modified
      var xmax_ = (xmax >= 0) ? (1.35 * xmax) : (0.65 * xmax);
      x.domain([xmin_, xmax_]);
    }
    else {
      x.domain(data2.map(function (d) { return d[exp_feature]; }));
    }
    y.domain(["-- ve", "- ve", "+ ve", "++ ve"]);
    //-------------------------------------------------------------------------------------------------Exp_feature Text and consensus text
    g1.selectAll(".exp_feature_text").data([0]).join("text").attr("class", "exp_feature_text")
      .attr("fill", "black")
      .attr("x", 4)
      .attr("y", -8) // 20
      .style("font-size", 14)
      .style("font-family", "'Open Sans'")
      .text(exp_feature.length > 17 ? exp_feature.substring(0, 17) : exp_feature)

    var feature_vote = features_with_score[exp_feature];
    var feature_vote_percentage = parseInt((feature_vote / (parseInt(number_of_charts) * models.length)) * 100);
    
      g1.selectAll(".consensus_text").data([0]).join("text")
      .attr("class", "consensus_text")
      .attr("fill", "black")
      .attr("x", width - 4)
      .attr("y", -8)
      .style("text-anchor", "end")
      .style("font-size", "0.75em")
      .style("font-family", "'Open Sans'")
      //.style("opacity", (feature_vote_percentage / 100)+.2)
      .text("(" + feature_vote_percentage + "%)");
    //-------------------------------------------------------------------------------------------------Y axis or ++ and --
    if (feature_index % 3 == 0) {
      var yTrans = feature_height * (Math.floor(feature_index / 3)) + (margin_each_feature.top + 18);
      d3.select("." + this.props.model_name2).selectAll(".my_yaxis_g" + feature_index).data([exp_feature]).join("g").attr("class", "my_yaxis_g my_yaxis_g" + feature_index)
        .attr("transform", "translate(" + parent_margin.left_margin_for_first_chart + "," + yTrans + ")")      // This controls the vertical position of the Axis
        .call(d3.axisLeft(y))
        .selectAll("text")
        .attr("font-weight", d => {
          if (d == "++ ve" || d == "-- ve") {
            return "bold"
          }
          else {
            return "normal"
          }
        });
    }
    else if (feature_index % 3 == 2) {
      var yTrans = feature_height * (Math.floor(feature_index / 3)) + (margin_each_feature.top + 18);
      var xTrans = exp_chart_width - (parent_margin.right_margin_for_last_chart) + 2 * parent_margin.space_between + 28
      d3.select("." + this.props.model_name2).selectAll(".my_yaxis_g" + feature_index).data([feature_index]).join("g").attr("class", "my_yaxis_g my_yaxis_g" + feature_index)
        .attr("transform", "translate(" + xTrans + "," + yTrans + ")")      // This controls the vertical position of the Axis
        .call(d3.axisLeft(y))
        .selectAll("text")
        .attr("font-weight", d => {
          if (d == "++ ve" || d == "-- ve") {
            return "bold"
          }
          else {
            return "normal"
          }
        });
    }
    d3.selectAll(".domain").remove()
    d3.selectAll(".my_yaxis_g").select("line").remove()

    //-------------------------------------------------------------------------------------------------Circles drawing starts here
    var jitterWidth = 15;
    g1.selectAll(".bar")
      .data(data2)
      .join(enter =>
        enter
          .append('circle')
          .attr("id", d => "A" + String(d['State']).replace(/ +/g, ""))
          .attr("class", function (d) {
            return "bar myid" + String(d['two_realRank']) + " exp_circles"
          })
          .on("click", function (d) {
            self.props.textClickHandler_original("A" + d["State"])
          })
          .attr("cx", function (d) {
            {
              return (x(d[exp_feature]) + 12);
            }
          })
          .attr("cy", function (d) {
            var y_gap = (d[exp_feature_contribution] < 0) ? 20 : 20;
            return (y(d.feature_contribution_binned) + y_gap + y.bandwidth() / 2 - Math.random() * jitterWidth);
          })
          .attr('r', 3.5)
          .attr("fill", (d) => this.props.color_gen(d['State']))
          .style("stroke", (d) => {
            return "black"
          })
          .attr("hover_story_dots", "hover_true")
          .attr("hover_story_dots_data", function (d) {
            return String(d.feature_contribution_binned + ",    " + d[exp_feature]);
          }), update =>
        update
          .attr("id", d => "A" + String(d['State']).replace(/ +/g, ""))
          .attr("class", function (d) {
            return "bar myid" + String(d['two_realRank']) + " exp_circles"
          })
          .on("click", function (d) {
            self.props.textClickHandler_original("A" + d["State"])
          })
          .transition().delay(self.chart_anim_circle_delay).duration(self.chart_anim_circ_duration)
          .attr("cx", function (d) {
            {
              return (x(d[exp_feature]) + 12);
            }
          })
          .attr("cy", function (d) {
            var y_gap = (d[exp_feature_contribution] < 0) ? 20 : 20;
            return (y(d.feature_contribution_binned) + y_gap + y.bandwidth() / 2 - jitterWidth);
          })
          .attr('r', 3.5)
          .attr("fill", (d) => this.props.color_gen(d['State']))
          .style("stroke", (d) => {
            return "black"
          })
          .attr("hover_story_dots", "hover_true")
          .attr("hover_story_dots_data", function (d) {
            return String(d.feature_contribution_binned + ",    " + d[exp_feature]);
          }), exit => exit.remove())
    //-------------------------------------------------------------------------------------------------X axis and the vertical lines on the gridline
    //g1.selectAll(".axis--x").remove()
    g1.selectAll(".axis--x").data([0]).join("g").attr("class", "axis--x")
      .attr("class", "axis axis--x")
      .attr("transform", () => {
        if (type_of_axis == "categorical") {
          return "translate(" + (0.036 * width) + "," + height + ")"   //0.042 original: "translate(10," + height + ")"
        }
        else {
          return "translate(" + (0.036 * width) + "," + height + ")"
        }

      })
      .call(xAxis)
    //-----x axis filtering
    g1.selectAll(".tick text")
      .attr("transform", function (d) { if (type_of_axis == "categorical") { return "translate(-15) rotate(270)" } else { return "translate(30)" } }) // translate(-22)rotate(-90) //static value
      .style("font-family", "'Open Sans'")
      .text(function (d) { if (type_of_axis == "categorical") { return d; } else if (type_of_axis == "numerical" & !(Math.abs(xmax) <= 5.5)) { return formatSuffix(d); } else if (Math.abs(xmax) <= 5.5) { return formatDecimal(d); } else { return d; } }) //If xmax less than 5.5, then considered for normal unformatted display
      .attr("y", 17) //static value
      .attr("dx", -30); //static value
    g1.selectAll("path")
      .attr("stroke", "#dcdcdc"); //making the x-axis lighter
    g1.selectAll(".tick line")
      .attr("stroke", "#dcdcdc")    //making the x-axis ticks lighter
      .attr("transform", "translate(0,-155)"); //making the x-axis ticks longer
    //------------------------------------------------------------------------------------------------- add the horizontal line on the gridline
    svg.selectAll(".g3_grid").data([0]).join("g")
      .attr("class", "g3_grid grid")
      .attr("transform", () => {
        svg.selectAll('.centered_line').data([feature_index]).join('line').attr("class", "centered_line").attr("x1", 0).attr("x2", width_for_each_feature + 5).attr("stroke-width", 3)
          .attr("y1", feature_height / 2 + 3).attr("y2", feature_height / 2 + 3).attr("stroke", "#DCDCDC")
        if (feature_index % 3 == 0) {
          return "translate(" + 0 + "," + (0.107 * height) + ")";
        }
        else if (feature_index % 3 == 1) {
          svg.selectAll('.left_line').remove()
          return "translate(" + (0) + "," + (0.107 * height) + ")";
        }
        else {
          svg.selectAll('.left_line').remove()
          return "translate(" + (0.055 * 0) + "," + (0.107 * height) + ")";
        }
      })
      .call(make_y_gridlines()
        .tickSize(-width)
        .tickFormat("")
      );

    //--------------------------------------------------------------------------------------------------------- Drawing histogram
    d3.selectAll(node + "hist").remove()
    var width_histogram = width_for_each_feature;
    var height_histogram = 30;
    var margin_histogram = { top: 20, right: (0.040 * width_for_each_feature), bottom: 55, left: (0.033 * width_for_each_feature) }
    var svg_histogram = svg.append("svg").attr("id", d => d.replace(/[^\w\s]/gi, '') + this.props.model_name2 + "hist")
      .attr("width", width_histogram + margin_histogram.left + margin_histogram.right)
      .attr("height", height_histogram + margin_histogram.top + margin_histogram.bottom)
      .style("background-color", "grey")
      .style("z-index", 2)
      .append("g")
      .attr("transform", "translate(" + margin_histogram.left + "," + margin_each_feature.top + ")");

    if (type_of_axis == "numerical") {
      var histogram_column = data2.map(function (d) { return parseFloat(d[exp_feature]) }); // taking out the required column
      var x_histogram = d3.scaleLinear()
        .domain([xmin_, xmax_])
        .range([0, width_histogram]);
    }
    else if (type_of_axis == "categorical") {
      var histogram_column = data2.map(function (d) { return d[exp_feature] });
      var x_histogram = d3.scaleBand()
        .domain(data2.map(function (d) { return d[exp_feature]; }))
        .range([0, width_histogram])
        .padding(0.5);
    };
    var histogram_column2 = data2.map(function (d) {
      return {
        feature: parseFloat(d[exp_feature]),
        feature_class: d.feature_contribution_class

      }
    });

    var g_histogram = svg_histogram.append("g")
      .attr("transform", "translate(0," + height_histogram + ")")
      .style("stroke", "#dcdcdc")
      .call(d3.axisBottom(x_histogram).ticks(5).tickSize(0.1));
    g_histogram.selectAll(".tick text")
      .attr("transform", "rotate(-90)")
      .text("");
    g_histogram.selectAll("path")
      .attr("stroke", "#dcdcdc");

    var histogram = d3.histogram()
      .value(function (d) { return d.feature; })
      .domain(x_histogram.domain())
      .thresholds((type_of_axis == "numerical") ? x_histogram.ticks(5) : 5);
    var bins_histogram = histogram(histogram_column2);
    var y_histogram = d3.scaleLinear()
      .range([height_histogram, 0])
      .domain([0, d3.max(bins_histogram, function (d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
    svg_histogram.append("g")
      .call(d3.axisLeft(y_histogram))
      .text("");

    var keys = [0, 1];

    var stackData = [];
    for (var bin in bins_histogram) {

      var pushableObject = {};
      pushableObject.x0 = bins_histogram[bin].x0;
      pushableObject.x1 = bins_histogram[bin].x1;
      bins_histogram[bin].forEach(function (d) {
        if (!pushableObject[d.feature_class]) { pushableObject[d.feature_class] = [d] }
        else pushableObject[d.feature_class].push(d);
      });
      // if any of the keys are not represented here, giving them an empty bin
      keys.forEach(function (key) {
        if (!pushableObject[key]) {
          pushableObject[key] = [];
        }
      });
      stackData.push(pushableObject);

    }; //end of bin for loop
    //console.log(stackData); // this is the actual bin

    var realStack = d3.stack()
      .keys(keys)
      .value(function (d, key) {
        return d[key].length;
      });
    var real_bins = realStack(stackData);
    var temp_x = "url(#mask-stripe" + ((self.props.model_name).toString()).replace(".", "") + "_" + self.props.mykey + ")";
    svg_histogram.selectAll("rect")
      .data(real_bins[0])
      .enter()
      .append("rect")
      .attr("x", 1)
      .attr("transform", function (d, i) { return "translate(" + x_histogram(d.data.x0) + ",0)"; })
      .attr("width", function (d, i) { return x_histogram(d.data.x1) - x_histogram(d.data.x0) - 1; })
      .attr("height", function (d, i) { if (d.data[0].length == 0 & d.data[1].length == 0) { return 0 } else { return height_histogram; } })
      //.style("border","black")
      .style("fill", "#efefef")
      //.style("mask",temp_x);
      .style("mask", "url(#mask-stripe)");   // #e41a1c was the original color; if you need light grey, you can use #dcdcdc; last color #c0c0c0, #f5f5f5

    svg_histogram.selectAll("rect.hist_class_1")
      .data(real_bins[1])
      .enter()
      .append("rect")
      .attr("class", "hist_class_1")
      .attr("x", 1)
      .attr("transform", function (d, i) { return "translate(" + x_histogram(d.data.x0) + ", 0)"; })
      .attr("width", function (d, i) { return x_histogram(d.data.x1) - x_histogram(d.data.x0) - 1; })
      .attr("height", function (d, i) { return (d.data[1].length / (d.data[0].length + d.data[1].length)) * height_histogram; })
      .style("fill", "#dedede");   // #377eb8 was the original color; if you need light grey, you can use #dcdcdc, #696969, #a9a9a9

    //--------------------------------------------------------------------------------------------------------- Histogram drawing ends
  }
  render() {
    return (
      <Row>
        <Replay class_Name={"."+this.props.model_name2} mouseX={1} mouseY={1}></Replay>
        <svg className={this.props.model_name2} style={{ width: $(".exp_chart").width() }}><g className="feature_container"></g></svg>
      </Row>
    );
  }
}
const maptstateToprop = (state) => {
  return {
    clicked_items_in_slopechart: state.clicked_items_in_slopechart,
    original_data: state.original_data,
    chart_scale_type: state.chart_scale_type,
    features_with_score: state.features_with_score,
    dataset: state.dataset,
    histogram_data: state.histogram_data,
    deviate_by: state.deviate_by,
    prev_prop:state.prev_prop,
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
    Set_default_models: (val) => dispatch({ type: "default_models", value: val }),
    Set_clicked_items_in_slopechart: (val) => dispatch({ type: "clicked_items_in_slopechart", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(Chart);