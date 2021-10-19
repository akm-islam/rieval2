import React, { Component } from 'react';
import * as d3 from 'd3';
import { connect } from "react-redux";
import Grid from '@material-ui/core/Grid';
import * as deviation_chart from "../DevPlot/deviation_chart"
import * as misc_algo from '../misc_algo'
import * as $ from 'jquery';
import SliderGroup1 from './SliderGroup1';
import SliderGroup2 from './SliderGroup2';
import YearModelSelection from "./YearAndModelSelection/YearModelSelection"
import ExpChart from './02RangeExpChart';
import Popover from './03RangePopover';

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
    var selected_instances = d3.range(d3.min([this.props.range_mode_range1[0], this.props.range_mode_range2[0]]), d3.max([this.props.range_mode_range1[1], this.props.range_mode_range2[1]]) + 1)
    var min = d3.min(selected_instances), max = d3.max(selected_instances);
    var d = (max - min) / 8;
    var diverginColor = d3.scaleLinear().domain([min + d * 7, min + d * 6, min + d * 5, min + d * 4, min + d * 3, min + d * 2, min]).interpolate(d3.interpolateRgb).range(['#00429d', '#4771b2', '#73a2c6', '#a5d5d8', '#ffbcaf', '#f4777f', '#cf3759', '#93003a']);
    //------------------------------
    var selected_instances1 = d3.range(this.props.range_mode_range1[0], this.props.range_mode_range1[1] + 1)
    //-------------------- Threshold filter
    var under_threshold_instances = []
    var year_data = this.props.original_data.filter(item => this.props.selected_year == item['1-qid'])
      year_data.map(item => {
        var two_realRank = parseInt(item['two_realRank'])
        var predicted_rank = parseInt(item[this.props.range_mode_model])
        if (Math.abs(predicted_rank - two_realRank) < this.props.threshold) {
          under_threshold_instances.push(two_realRank)
        }
      })
    
    selected_instances1 = selected_instances1.filter(item => under_threshold_instances.includes(item))
    deviation_chart.Create_deviation_chart('r1d', 'r1exp', selected_instances1, this.props.original_data, [this.props.range_mode_model], this.props.anim_config, this.props.selected_year, this.props.average_m, this.props.clicked_circles, this.props.Set_clicked_circles, diverginColor, this.props.sparkline_data, this.props.Set_selected_year, this.props.dataset, this.props.threshold)
    //------------------------------
    var selected_instances2 = d3.range(this.props.range_mode_range2[0], this.props.range_mode_range2[1] + 1)
    var under_threshold_instances = []
    var year_data = this.props.original_data.filter(item => this.props.selected_year == item['1-qid'])
    year_data.map(item => {
      var two_realRank = parseInt(item['two_realRank'])
      var predicted_rank = parseInt(item[this.props.range_mode_model])
      if (Math.abs(predicted_rank - two_realRank) < this.props.threshold) {
        under_threshold_instances.push(two_realRank)
      }
    })
    selected_instances2 = selected_instances2.filter(item => under_threshold_instances.includes(item))

    deviation_chart.Create_deviation_chart('r2d', 'r2exp', selected_instances2, this.props.original_data, [this.props.range_mode_model], this.props.anim_config, this.props.selected_year, this.props.average_m, this.props.clicked_circles, this.props.Set_clicked_circles, diverginColor, this.props.sparkline_data, this.props.Set_selected_year, this.props.dataset, this.props.threshold)
    //------------------------------
    misc_algo.handle_transparency("circle2", this.props.clicked_circles, this.props.anim_config)

  }
  render() {
    //------------------------------
    var selected_instances = d3.range(d3.min([this.props.range_mode_range1[0], this.props.range_mode_range2[0]]), d3.max([this.props.range_mode_range1[1], this.props.range_mode_range2[1]]) + 1)
    var min = d3.min(selected_instances), max = d3.max(selected_instances);
    var d = (max - min) / 8;
    var diverginColor = d3.scaleLinear().domain([min + d * 7, min + d * 6, min + d * 5, min + d * 4, min + d * 3, min + d * 2, min]).interpolate(d3.interpolateRgb).range(['#00429d', '#4771b2', '#73a2c6', '#a5d5d8', '#ffbcaf', '#f4777f', '#cf3759', '#93003a']);
    this.props.Set_selected_instances(selected_instances)
    //--------------------
    var deviation_array = []

    this.props.lime_data[this.props.range_mode_model].map(item => {
      if (item['1-qid'] == this.props.selected_year && selected_instances.includes(parseInt(item['two_realRank']))) {
        deviation_array.push(item['deviation'])
      }
    })
    this.props.Set_deviation_array(deviation_array)
    //console.log('deviation_array: ', d3.extent(deviation_array))
    //--------------------
    return (
      <Grid key={this.props.mode} className="RangeChartParent" container direction="row" justifyContent="space-between"
        className="slope_chart_exp" style={{ width: "100%", height: '100%', backgroundColor: 'white', padding: "0px 0px", overflow: 'hidden' }}>
        <div className="year_and_model_selector_and_slider_container" style={{ width: "100%" }}> {/* This is used to calculate the deviation plot height */}
          <YearModelSelection></YearModelSelection>
        </div>
        {/* Group 1 */}
        <Grid className="Group1_container" style={{ height: "100%", width: "49.4%", paddingRight: 0, border: "2px solid #eaeaea", overflow: 'hidden' }} container item direction="column" justifyContent="space-between">
          <p className="title_p1" style={{ margin: 0, paddingLeft: "45%", backgroundColor: "rgb(232, 232, 232,0.4)", fontWeight: "bolder", borderBottom: "1px solid #cecece" }}>Group 1</p>
          <Grid className="slidergroup1" item style={{ backgroundColor: "rgb(232, 232, 232,0.4)" }}><SliderGroup1></SliderGroup1></Grid>
          <Grid className="dev_plot_and_exp_container" style={{ width: '100%', height: $('.Group1_container').height() - ($('.title_p1').height() + $('.slidergroup1').height() + $('.year_and_model_selector_and_slider_container').height() + 5) }} container direction="row" justify="center" alignItems="center">
            <Grid className="deviation_plot_container_div" item style={{ width: '49%', height: $('.Group1_container').height() - ($('.title_p1').height() + $('.slidergroup1').height() + $('.year_and_model_selector_and_slider_container').height() + 5), overflow: 'scroll', borderRight: '1px solid #dbdbdb' }}>
              <svg id="r1d" style={{ width: "100%", padding: 5 }}></svg>
            </Grid>
            {
              this.props.rank_data != null ? <Grid className="explanation_plot_container" item style={{ width: '49%', height: '100%' }}>
                <ExpChart diverginColor={diverginColor} exp_data={[["r1exp", this.props.range_mode_range1], ["r2exp", this.props.range_mode_range2]]} exp_id="r1exp" state_range={this.props.range_mode_range1} selected_year={this.props.selected_year} model_name={this.props.range_mode_model} default_models={[this.props.range_mode_model]}></ExpChart>
              </Grid> : null
            }
          </Grid>
        </Grid>
        {/* Group 2 */}
        <Grid className="Group2_container" style={{ height: "100%", width: "49.4%", marginLeft: '0.5%', paddingRight: 0, border: "2px solid #eaeaea", overflow: 'hidden' }} container item direction="column" justifyContent="space-between">
          <p className="title_p2" style={{ margin: 0, paddingLeft: "45%", backgroundColor: "rgb(232, 232, 232,0.4)", fontWeight: "bolder", borderBottom: "1px solid #cecece" }}>Group 2</p>
          <Grid className="slidergroup2" item style={{ backgroundColor: "rgb(232, 232, 232,0.4)" }}><SliderGroup2></SliderGroup2></Grid>
          <Grid className="dev_plot_and_exp_container" style={{ width: '100%', height: $('.Group2_container').height() - ($('.title_p2').height() + $('.slidergroup2').height() + $('.year_and_model_selector_and_slider_container').height() + 5) }} container direction="row" justify="center" alignItems="center">
            <Grid className="deviation_plot_container_div" item style={{ width: '49%', height: $('.Group1_container').height() - ($('.title_p2').height() + $('.slidergroup2').height() + $('.year_and_model_selector_and_slider_container').height() + 5), overflow: 'scroll', borderRight: '1px solid #dbdbdb' }}>
              <svg id="r2d" style={{ width: "100%", padding: 5 }}></svg>
            </Grid>
            {
              this.props.rank_data != null ? <Grid className="explanation_plot_container" item style={{ width: '49%', height: '100%' }}>
                <ExpChart diverginColor={diverginColor} exp_data={[["r1exp", this.props.range_mode_range1], ["r2exp", this.props.range_mode_range2]]} exp_id="r2exp" state_range={this.props.range_mode_range2} selected_year={this.props.selected_year} model_name={this.props.range_mode_model} default_models={[this.props.range_mode_model]}></ExpChart>
              </Grid> : null
            }
          </Grid>
        </Grid>
        <Popover diverginColor={diverginColor} default_models={[this.props.range_mode_model]}></Popover>
      </Grid>
    )
  }
}
const maptstateToprop = (state) => {
  return {
    mode: state.mode,
    range_mode_range1: state.range_mode_range1,
    range_mode_range2: state.range_mode_range2,
    range_mode_model: state.range_mode_model,
    lime_data: state.lime_data,
    selected_year: state.selected_year,
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
    Set_deviation_array: (val) => dispatch({ type: "deviation_array", value: val }),
    Set_clicked_circles: (val) => dispatch({ type: "clicked_circles", value: val }),
    Set_selected_year: (val) => dispatch({ type: "selected_year", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(SlopeChart);