import React, { Component } from 'react';
import * as d3 from 'd3';
import './YearModeComponent.scss';
import { connect } from "react-redux";
import Grid from '@material-ui/core/Grid';
import * as deviation_chart from "../DevPlot/deviation_chart"
import * as misc_algo from '../misc_algo'
import * as $ from 'jquery';
import Year1DropDown from './Year1DropDown';
import Year2DropDown from './Year2DropDown';
import YearModelSelection from "./YearAndModelSelection/YearModelSelection"
import ExpChart from './ExpChartComponent';
import Popover from '../Popover/Popover';

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
    //------------------------------
    var selected_instances = d3.range(this.props.time_mode_range[0], this.props.time_mode_range[1] + 1)
    var min = d3.min(selected_instances), max = d3.max(selected_instances);
    var d = (max - min) / 8;
    var diverginColor = d3.scaleLinear().domain([min + d * 7, min + d * 6, min + d * 5, min + d * 4, min + d * 3, min + d * 2, min]).interpolate(d3.interpolateRgb).range(['#00429d', '#4771b2', '#73a2c6', '#a5d5d8', '#ffbcaf', '#f4777f', '#cf3759', '#93003a']);

    //----------
    var under_threshold_instances = []
    var year_data = this.props.original_data.filter(item => this.props.time_mode_year1 == item['1-qid'])
    year_data.map(item => {
      var two_realRank = parseInt(item['two_realRank'])
      var predicted_rank = parseInt(item[this.props.time_mode_model])
      if (Math.abs(predicted_rank - two_realRank) > this.props.threshold) {
        under_threshold_instances.push(two_realRank)
      }
    })
    var selected_instances1 = selected_instances.filter(item => !under_threshold_instances.includes(item))
    deviation_chart.Create_deviation_chart('r1d', 'r1exp', selected_instances1, this.props.original_data, [this.props.time_mode_model], this.props.anim_config, this.props.time_mode_year1, this.props.average_m, this.props.clicked_circles, this.props.Set_clicked_circles, diverginColor, this.props.sparkline_data, this.props.Set_selected_year, this.props.dataset, this.props.threshold)
    //------------------------------
    var under_threshold_instances = []
    var year_data = this.props.original_data.filter(item => this.props.time_mode_year2 == item['1-qid'])
    year_data.map(item => {
      var two_realRank = parseInt(item['two_realRank'])
      var predicted_rank = parseInt(item[this.props.time_mode_model])
      if (Math.abs(predicted_rank - two_realRank) > this.props.threshold) {
        under_threshold_instances.push(two_realRank)
      }
    })
    var selected_instances2 = selected_instances.filter(item => !under_threshold_instances.includes(item))
    console.log(selected_instances2,'selected_instances2')
    deviation_chart.Create_deviation_chart('r2d', 'r2exp', selected_instances2, this.props.original_data, [this.props.time_mode_model], this.props.anim_config, this.props.time_mode_year2, this.props.average_m, this.props.clicked_circles, this.props.Set_clicked_circles, diverginColor, this.props.sparkline_data, this.props.Set_selected_year, this.props.dataset, this.props.threshold)
    //------------------------------
    misc_algo.handle_transparency("circle2", this.props.clicked_circles, this.props.anim_config)

  }
  render() {
    var selected_instances = d3.range(this.props.time_mode_range[0], this.props.time_mode_range[1] + 1)
    var min = d3.min(selected_instances), max = d3.max(selected_instances);
    var d = (max - min) / 8;
    var diverginColor = d3.scaleLinear().domain([min + d * 7, min + d * 6, min + d * 5, min + d * 4, min + d * 3, min + d * 2, min]).interpolate(d3.interpolateRgb).range(['#00429d', '#4771b2', '#73a2c6', '#a5d5d8', '#ffbcaf', '#f4777f', '#cf3759', '#93003a']);
    this.props.Set_selected_instances(selected_instances)
    return (
      <Grid key={this.props.mode} className="RangeChartParent" container direction="row" justifyContent="space-between" spacing={2}
        className="slope_chart_exp" style={{ width: "100%", height: '100%', backgroundColor: 'white', padding: "0px 0px", border: "0px solid #eaeaea", overflow: 'hidden' }}>
        <div className="year_and_model_selector_and_slider_container" style={{ width: '100%' }}> {/* This is used to calculate the deviation plot height */}
          <YearModelSelection></YearModelSelection>
        </div>
        {/* Group 1 */}
        <Grid className="Group1_container" xs={6} style={{ height: "100%", padding: 0, border: "2px solid #eaeaea", overflow: 'hidden' }} container item direction="column">
          <Grid className="slidergroup1" item style={{ width: "100%", height: 30, backgroundColor: "rgb(232, 232, 232,0.4)" }}><Year1DropDown></Year1DropDown></Grid>
          <Grid className="dev_plot_and_exp_container" style={{ width: '100%', height: $('.Group1_container').height() - ($('.title_p1').height() + $('.slidergroup1').height() + $('.year_and_model_selector_and_slider_container').height() + 5) }} container direction="row" justify="center" alignItems="center">
            <Grid className="deviation_plot_container_div" item style={{ width: '49%', height: $('.Group1_container').height() - ($('.slidergroup1').height() + $('.year_and_model_selector_and_slider_container').height() + 5), overflow: 'scroll', borderRight: '1px solid #dbdbdb' }}>
              <svg id="r1d" style={{ width: "100%", padding: 5 }}></svg>
            </Grid>
            {
              this.props.rank_data != null ? <Grid className="explanation_plot_container" item style={{ width: '49%', height: '100%' }}>
                <ExpChart exp_data={[["r1exp", this.props.time_mode_year1], ["r2exp", this.props.time_mode_year2]]} diverginColor={diverginColor} exp_id="r1exp" default_models={[this.props.time_mode_model]} state_range={this.props.time_mode_range} selected_year={this.props.time_mode_year1} model_name={this.props.time_mode_model}></ExpChart>
              </Grid> : null
            }
          </Grid>
        </Grid>
        {/* Group 2 */}
        <Grid className="Group2_container" xs={6} style={{ height: "100%", padding: 0, border: "2px solid #eaeaea", overflow: 'hidden' }} container direction="row">
          <Grid className="slidergroup2" style={{width: "100%", height: 30, backgroundColor: "rgb(232, 232, 232,0.4)" }}><Year2DropDown></Year2DropDown></Grid>
          <Grid className="dev_plot_and_exp_container" style={{ width: '100%', height: $('.Group2_container').height() - ($('.title_p2').height() + $('.slidergroup2').height() + $('.year_and_model_selector_and_slider_container').height() + 5) }} container direction="row" justify="center" alignItems="center">
            <Grid className="deviation_plot_container_div" item style={{ width: '49%', height: $('.Group1_container').height() - ($('.title_p2').height() + $('.slidergroup2').height() + $('.year_and_model_selector_and_slider_container').height() + 5), overflow: 'scroll', borderRight: '1px solid #dbdbdb' }}>
              <svg id="r2d" style={{ width: "100%", padding: 5 }}></svg>
            </Grid>
            {
              this.props.rank_data != null ? <Grid className="explanation_plot_container" item style={{ width: '49%', height: '100%' }}>
                <ExpChart exp_data={[["r1exp", this.props.time_mode_year1], ["r2exp", this.props.time_mode_year2]]} diverginColor={diverginColor} exp_id="r2exp" default_models={[this.props.time_mode_model]} state_range={this.props.time_mode_range} selected_year={this.props.time_mode_year2} model_name={this.props.time_mode_model}></ExpChart>
              </Grid> : null
            }
          </Grid>
        </Grid>
        <Popover diverginColor={diverginColor} default_models={[this.props.time_mode_model]}></Popover>
      </Grid>
    )
  }
}
const maptstateToprop = (state) => {
  return {
    time_mode_year1: state.time_mode_year1,
    time_mode_year2: state.time_mode_year2,
    mode: state.mode,
    time_mode_range: state.time_mode_range,
    time_mode_model: state.time_mode_model,
    default_models: state.default_models,
    original_data: state.original_data,
    dataset: state.dataset,
    sparkline_data: state.sparkline_data,
    dataset: state.dataset,
    anim_config: state.anim_config,
    average_m: state.average_m,
    rank_data: state.rank_data,
    clicked_circles: state.clicked_circles,
    threshold: state.threshold,
    histogram_data: state.histogram_data,

  }
}
const mapdispatchToprop = (dispatch) => {
  return {
    Set_selected_instances: (val) => dispatch({ type: "selected_instances", value: val }),
    Set_clicked_circles: (val) => dispatch({ type: "clicked_circles", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(SlopeChart);