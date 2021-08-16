import React, { Component } from 'react';
import * as d3 from 'd3';
import { connect } from "react-redux";
import * as algo1 from "../../../Algorithms/algo1";
import * as $ from 'jquery';
import Create_MDS from "./MDS"
import CreatexpCircle from "./Create_exp_circles"

class SlopeChart extends Component {
  constructor(props) {
    super(props);
    this.line_color = null;
    this.state = { exp_h: 150, mouseX: 0, mouseY: 0 }
  }
  componentDidMount() { this.setState({ width: window.innerHeight }) }
  componentDidUpdate(prevProps, prevState) {
    var self = this
    var selected_instances = d3.range(this.props.state_range[0], this.props.state_range[1] + 1)
    if (this.props.histogram_data.length > 0) { selected_instances = this.props.histogram_data }
    //------------------------------
    var under_threshold_instances = []
    var year_data = this.props.original_data.filter(item => this.props.selected_year == item['1-qid'])
    this.props.defualt_models.map(model_name => {
      year_data.map(item => {
        var two_realRank = parseInt(item['two_realRank'])
        var predicted_rank = parseInt(item[model_name])
        if (Math.abs(predicted_rank - two_realRank) > this.props.threshold) {
          under_threshold_instances.push(two_realRank)
        }
      })
    })
    selected_instances = selected_instances.filter(item => !under_threshold_instances.includes(item))
    //------------------------------
    var min = d3.min(selected_instances), max = d3.max(selected_instances);
    var d = (max - min) / 8;
    var diverginColor = d3.scaleLinear().domain([min + d * 7, min + d * 6, min + d * 5, min + d * 4, min + d * 3, min + d * 2, min]).interpolate(d3.interpolateRgb).range(['#00429d', '#4771b2', '#73a2c6', '#a5d5d8', /*'#ffffe0',*/ '#ffbcaf', '#f4777f', '#cf3759', '#93003a']);
    var number_of_charts = 9
    var features_with_score = algo1.features_with_score(this.props.dataset, [this.props.model_name], selected_instances, this.props.selected_year, number_of_charts, this.props.rank_data)
    var sorted_features = Object.entries(features_with_score).sort((a, b) => b[1] - a[1]).slice(0, number_of_charts + 1)

    //------------------------------
    var marginTop = 30;
    var item_width = parseInt($("#all_features_container" + this.props.model_name).width())
    var item_height = parseInt($("#all_features_container" + this.props.model_name).height()) / sorted_features.length - marginTop

    var feature_containers=d3.select("#all_features_container" + this.props.model_name).selectAll(".feature_items").data(sorted_features, d => d[0])
      .join(enter =>
        enter.append("svg")
          .attr("class", "feature_items").attr('width', item_width).attr("height", item_height).style("border", "1px solid #bcbcbc")
          //.on("click", d => console.log(d[0]))
          .attr("style", "outline: thin solid #eaeaea;")
          .attr("y", (d, i) => marginTop + i * (item_height + marginTop))
        , update => update.transition().duration(2000).attr("y", (d, i) => marginTop + i * (item_height + marginTop))
        , exit => exit.remove()
      )
      feature_containers.attr("CreatexpCircle", function (d) {
        CreatexpCircle(d, d3.select(this), selected_instances, sorted_features, self.props.lime_data, 
        self.props.selected_year, [self.props.model_name], 
        self.props.clicked_circles, self.props.Set_clicked_circles,
          diverginColor, self.props.anim_config, self.props.Set_clicked_circles, self.props.Set_clicked_features, self.props.symbolTypes, item_width, item_height)
      })

    d3.select("#all_features_container" + this.props.model_name).selectAll(".title_text").data(sorted_features).join(
      enter => enter.append('text').attr("class", "title_text").attr('x', item_width / 2).text((d, i) => d[0]).attr("dominant-baseline", "hanging")
        .attr("y", (d, i) => i * (item_height + marginTop) + 7).attr('text-anchor', 'middle').attr('font-size',12)
        ,update=>update.transition().duration(2000).attr("y", (d, i) => i * (item_height + marginTop) + 7).text((d, i) => d[0])
        ,exit=>exit.remove()
        )


    //------------------------------
    Create_MDS("mds_parent", "#mds" + this.props.model_name, this.props.lime_data, this.props.model_name, this.props.selected_year, selected_instances, sorted_features, diverginColor, this.props.Set_clicked_circles)
    //------------------------------
  }
  render() {
    var item_width = parseInt($(".exp_parent").width()) / this.props.defualt_models.length
    return (
      <div className={"exp" + this.props.model_name} style={{ width: item_width, "border": "2px solid #bcbcbc", padding: "2px 10px" }}>
        <p style={{ margin: 0, padding: 0, marginLeft: "45%" }}>{this.props.model_name}</p>
        <svg id={"mds" + this.props.model_name} style={{ margin: 0, width: "100%", height: this.state.exp_h }}></svg>
        <svg id={"all_features_container" + this.props.model_name} style={{ marginTop: 5, width: "100%", height: parseInt($(".exp_parent").height()) - this.state.exp_h }}> </svg>
      </div>
    )
  }
}
const maptstateToprop = (state) => {
  return {
    state_range: state.state_range,
    selected_year: state.selected_year,
    deviate_by: state.deviate_by,
    clicked_items_in_slopechart: state.clicked_items_in_slopechart,
    tracking: state.tracking,
    defualt_models: state.defualt_models,
    original_data: state.original_data,
    time_mode_model: state.time_mode_model,
    chart_scale_type: state.chart_scale_type,
    features_with_score: state.features_with_score,
    dataset: state.dataset,
    histogram_data: state.histogram_data,
    sparkline_data: state.sparkline_data,
    dataset: state.dataset,
    anim_config: state.anim_config,
    show: state.show,
    default_model_scores: state.default_model_scores,
    average_m: state.average_m,
    average_y: state.average_y,
    lime_data: state.lime_data,
    features_with_score: state.features_with_score,
    rank_data: state.rank_data,
    clicked_circles: state.clicked_circles,
    clicked_features: state.clicked_features,
    threshold: state.threshold
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
    Set_clicked_circles: (val) => dispatch({ type: "clicked_circles", value: val }),
    Set_prev_prop: (val) => dispatch({ type: "prev_prop", value: val }),
    Set_sparkline_data: (val) => dispatch({ type: "sparkline_data", value: val }),
    Set_clicked_items_in_slopechart: (val) => dispatch({ type: "clicked_items_in_slopechart", value: val }),
    Set_replay: (val) => dispatch({ type: "replay", value: val }),
    Set_clicked_features: (val) => dispatch({ type: "clicked_features", value: val }),
    Set_selected_year: (val) => dispatch({ type: "selected_year", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(SlopeChart);