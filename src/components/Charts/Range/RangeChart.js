import React, { Component } from 'react';
import * as d3 from 'd3';

import { connect } from "react-redux";
import Grid from '@material-ui/core/Grid';
import * as algo1 from "../../../Algorithms/algo1";
import * as deviation_chart from "../deviation_chart"
import * as misc_algo from '../misc_algo'
import * as $ from 'jquery';
import SliderGroup1 from './SliderGroup1';
import SliderGroup2 from './SliderGroup2';
import YearModelSelection from "./YearModelSelection/YearModelSelection"

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
   
  }
  render() {
    return (
      <Grid container direction="row" justifyContent="space-between" className="slope_chart_exp" style={{ backgroundColor: 'white', padding: "0px 0px", border: "1px solid #eaeaea", width: "100%", boxShadow: "-2px 1px 4px -1px white" }}>
        <YearModelSelection></YearModelSelection>
        <Grid container item direction="column" justifyContent="space-between" style={{ paddingRight: 0, border: "1px solid #a0a0a0", height: "100%", width: "49.4%" }}>
          <p style={{ margin: 0, paddingLeft: "45%", backgroundColor: "rgb(232, 232, 232,0.4)", fontWeight: "bolder", borderBottom: "1px solid #cecece" }}>Group 1</p>
          <Grid item style={{ backgroundColor: "rgb(232, 232, 232,0.4)"}}><SliderGroup1></SliderGroup1></Grid>
          <Grid item style={{ backgroundColor: "rgb(232, 232, 232,0.4)", height: ($(".slope_chart_exp").height() * 0.5 - 25), overflow: "scroll" }}><svg id="r1d" style={{ width: "100%", marginRight: "3%" }}></svg></Grid>
          <Grid item style={{ backgroundColor: "rgb(232, 232, 232,0.4)", marginTop: 5, paddingTop: 5, paddingRight: 3, height: $(".slope_chart_exp").height() * 0.3 }}><svg id="r1e" style={{ width: "100%", height: "100%" }}></svg></Grid>
        </Grid>
        <Grid container item direction="column" justifyContent="space-between" style={{ marginLeft: "1%", padding: 0, border: "1px solid #a0a0a0", height: "100%", width: "49.4%" }}>
          <p style={{ margin: 0, paddingLeft: "45%", backgroundColor: "rgb(232, 232, 232,0.4)", fontWeight: "bolder", borderBottom: "1px solid #cecece" }}>Group 2</p>
          <Grid item style={{ backgroundColor: "rgb(232, 232, 232,0.4)"}}><SliderGroup2></SliderGroup2></Grid>
          <Grid item style={{ backgroundColor: "rgb(232, 232, 232,0.4)", height: ($(".slope_chart_exp").height() * 0.5 - 25), overflow: "scroll" }}><svg id="r2d" style={{ width: "100%", marginRight: "3%" }}></svg></Grid>
          <Grid item style={{ backgroundColor: "rgb(232, 232, 232,0.4)", marginTop: 5, paddingTop: 5, paddingRight: 3, height: $(".slope_chart_exp").height() * 0.3 }}><svg id="r2e" style={{ width: "100%", height: "100%" }}></svg></Grid>
        </Grid>
      </Grid>
    )
  }
}
const maptstateToprop = (state) => {
  return {
    range_mode_range1: state.range_mode_range1,
    range_mode_range2: state.range_mode_range2,
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
    sort_by: state.sort_by,
    average_m: state.average_m,
    average_y: state.average_y,
    lime_data: state.lime_data,
    features_with_score: state.features_with_score,
    rank_data: state.rank_data,
    clicked_circles: state.clicked_circles,
    clicked_features: state.clicked_features
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