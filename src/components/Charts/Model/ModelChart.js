import React, { Component } from 'react';
import * as d3 from 'd3';
import * as explanation_chart from "../explanation_chart";
import { connect } from "react-redux";
import Grid from '@material-ui/core/Grid';
import * as algo1 from "../../../Algorithms/algo1";
import * as deviation_chart from "../deviation_chart"
import * as misc_algo from '../misc_algo'
import * as $ from 'jquery';
import ModelSlider from './ModelSlider';

import ExpChart from './ExpChart';
import './ModelSlider.scss';

class SlopeChart extends Component {
  constructor(props) {
    super(props);
    this.line_color = null;
    this.state = { height_slope_exp_chart: 700, mouseX: 0, mouseY: 0 }
  }
  componentDidMount() { this.setState({ width: window.innerHeight }) }
  shouldComponentUpdate(prevProps, prevState) { return true; }
  componentDidUpdate(prevProps, prevState) {
    var selected_instances = d3.range(this.props.state_range[0], this.props.state_range[1] + 1)
    if (this.props.histogram_data.length > 0) { selected_instances = this.props.histogram_data }
    //--------------------
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
    //--------------------
    var min = d3.min(selected_instances), max = d3.max(selected_instances);

    var d = (max - min) / 8;
    var diverginColor = d3.scaleLinear().domain([min + d * 7, min + d * 6, min + d * 5, min + d * 4, min + d * 3, min + d * 2, min]).interpolate(d3.interpolateRgb).range(['#00429d', '#4771b2', '#73a2c6', '#a5d5d8', /*'#ffffe0',*/ '#ffbcaf', '#f4777f', '#cf3759', '#93003a']);
    var number_of_charts = 9
    //algo1.features_with_score(this.props.dataset, this.props.defualt_models, selected_instances, this.props.selected_year,number_of_charts,this.props.rank_data)
    var features_with_score = algo1.features_with_score(this.props.dataset, this.props.defualt_models, selected_instances, this.props.selected_year, number_of_charts, this.props.rank_data)
    var sorted_features = Object.entries(features_with_score).sort((a, b) => b[1] - a[1]).slice(0, 18)

    deviation_chart.Create_deviation_chart('dev_plot_container', 'exp', selected_instances, this.props.original_data, this.props.defualt_models, this.props.anim_config, this.props.selected_year, this.props.average_m, this.props.clicked_circles, this.props.Set_clicked_circles, diverginColor, this.props.sparkline_data, this.props.Set_selected_year, this.props.dataset, this.props.threshold)
    misc_algo.handle_transparency("circle2", this.props.clicked_circles, this.props.anim_config)
  }
  render() {
    //console.log(parseInt($(".uploader_topbar").height()),parseInt($(".years_model_container").height()),parseInt($(".Modelslider").height()))
    return (
      <div className="ModelChartParent" style={{backgroundColor: 'white', margin: 2, padding: 2, border: "2px solid grey", width: "100%", boxShadow: "-2px 1px 4px -1px white" }}>
        <div class="dev_parent" style={{display: "inline-block", minWidth: 405, width: "22%", paddingRight: 3, backgroundColor: "#fcfcfc", height: ($(".ModelChartParent").height())}}>
      
          <ModelSlider></ModelSlider>
          <svg id="dev_plot_container" style={{ width: "100%", height:window.innerHeight - 200, marginBottom: 10,overflow:'hidden' }}></svg>
          {
            // subtracting 200 because this is the space take by uploader_topbar, years_model_container and Modelslider
          }
        </div>

        <div class="exp_parent" style={{ width: "78%"}}>
      {
        this.props.defualt_models.map(model_name=>{
          return <ExpChart model_name={model_name}></ExpChart>
        })
      }
      </div>
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