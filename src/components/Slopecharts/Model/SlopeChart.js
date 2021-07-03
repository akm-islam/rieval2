import React, { Component } from 'react';
import * as d3 from 'd3';
import * as $ from 'jquery';
import * as slopechart1 from "./slopechart1";
import { connect } from "react-redux";
import Grid from '@material-ui/core/Grid';
import * as Legend from '../Legend'
import * as algo1 from "../../../Algorithms/algo1";
class SlopeChart extends Component {
  constructor(props) {
    super(props);
    this.line_color = null;
    this.state = { height_slope_exp_chart: 700, mouseX: 0, mouseY: 0 }
  }
  componentDidMount() {
    this.setState({ width: window.innerHeight })
  }
  shouldComponentUpdate(prevProps, prevState) {
    return true;
  }
  componentDidUpdate(prevProps, prevState) {
    var selected_instances=d3.range(this.props.state_range[0], this.props.state_range[1]+1)
    slopechart1.CreateSlopeChart1(selected_instances, this.props.original_data, this.props.defualt_models, this.props.config, this.props.selected_years, this.props.average_m)
    var number_of_charts=9
    var features_with_score=algo1.features_with_score(this.props.dataset, this.props.defualt_models, this.props.state_range, this.props.selected_year, number_of_charts, this.props.rank_data)
    var sorted_features=Object.entries(features_with_score).sort((a,b)=>a[1]-b[1])
    slopechart1.CreatexpChart(selected_instances,sorted_features,this.props.lime_data,this.props.selected_year,this.props.defualt_models)
  }
  render() {
    return (
      <Grid container className="slope_chart_exp" style={{ padding: "0px 0px", border: "1px solid #eaeaea", width: "99%", boxShadow: "-2px 1px 4px -1px white" }}>
        <svg id="dev_plot_container" style={{ width: "100%", height: "50%" }}></svg>
        <svg id="exp_container" style={{ width: "100%", height: "50%" }}></svg>
      </Grid>
    )
  }
}
const maptstateToprop = (state) => {
  return {
    state_range: state.state_range,
    selected_year: state.selected_year,
    selected_years: state.selected_years,
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
    config: state.config,
    show: state.show,
    default_model_scores: state.default_model_scores,
    sort_by: state.sort_by,
    average_m: state.average_m,
    average_y: state.average_y,
    lime_data: state.lime_data,
    features_with_score: state.features_with_score,
    rank_data: state.rank_data,
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
    Set_prev_prop: (val) => dispatch({ type: "prev_prop", value: val }),
    Set_defualt_models: (val) => dispatch({ type: "defualt_models", value: val }),
    Set_sparkline_data: (val) => dispatch({ type: "sparkline_data", value: val }),
    Set_clicked_items_in_slopechart: (val) => dispatch({ type: "clicked_items_in_slopechart", value: val }),
    Set_replay: (val) => dispatch({ type: "replay", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(SlopeChart);