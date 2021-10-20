import React, { Component } from 'react';
import * as d3 from 'd3';
import './YearModeComponent.scss';
import { connect } from "react-redux";
import * as deviation_chart from "../DevPlot/deviation_chart"
import * as misc_algo from '../misc_algo'
import * as $ from 'jquery';
import Year1DropDown from './Year1DropDown';
import Year2DropDown from './Year2DropDown';
import YearModelSelection from "./YearAndModelSelection/YearModelSelection"
import ExpChart from './02ExpChartComponent';
import Popover from './03TimePopover';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

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
      if (Math.abs(predicted_rank - two_realRank) < this.props.threshold) {
        under_threshold_instances.push(two_realRank)
      }
    })
    var selected_instances1 = selected_instances.filter(item => under_threshold_instances.includes(item))
    deviation_chart.Create_deviation_chart('r1d', 'r1exp', selected_instances1, this.props.original_data, [this.props.time_mode_model], this.props.anim_config, this.props.time_mode_year1, this.props.average_m, this.props.clicked_circles, this.props.Set_clicked_circles, diverginColor, this.props.sparkline_data, this.props.Set_time_mode_year1, this.props.dataset, this.props.threshold)
    //------------------------------
    var under_threshold_instances = []
    var year_data = this.props.original_data.filter(item => this.props.time_mode_year2 == item['1-qid'])
    year_data.map(item => {
      var two_realRank = parseInt(item['two_realRank'])
      var predicted_rank = parseInt(item[this.props.time_mode_model])
      if (Math.abs(predicted_rank - two_realRank) < this.props.threshold) {
        under_threshold_instances.push(two_realRank)
      }
    })
    var selected_instances2 = selected_instances.filter(item => under_threshold_instances.includes(item))
    
    deviation_chart.Create_deviation_chart('r2d', 'r2exp', selected_instances2, this.props.original_data, [this.props.time_mode_model], this.props.anim_config, this.props.time_mode_year2, this.props.average_m, this.props.clicked_circles, this.props.Set_clicked_circles, diverginColor, this.props.sparkline_data, this.props.Set_time_mode_year2, this.props.dataset, this.props.threshold)
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
      <Box className="box_root" sx={{ width: '100%',height:'100%', padding: 0.5 }}>
        <Grid container justifyContent="space-between">
          <Grid item xs={12}>
            <div className="year_and_model_selector_and_slider_container" style={{ width: '100%' }}><YearModelSelection></YearModelSelection></div>
          </Grid>
          {/* Group 1 */}
          <Grid item xs={5.9} className="Group1_container" style={{ borderTop: '2px solid #eaeaea',borderLeft: '2px solid #eaeaea',borderRight: '2px solid #eaeaea'}}>
            <Grid container>
              <Grid item xs={12} style={{padding:0}}>
                <div className="slidergroup1" style={{ width: '100%', height: 30 }}><Year1DropDown></Year1DropDown></div>
              </Grid>
              <Grid className="dev_plot_and_exp_container" item xs={6}>
                <div className="deviation_plot_container_div" style={{ width: '100%', height:$('.box_root').height() - ($('.year_and_model_selector_and_slider_container').height() + $('.slidergroup1').height()),overflow: 'scroll' }}><svg id="r1d" style={{ width: "100%"}}></svg></div>
              </Grid>
              <Grid item xs={6}>
                {
                  this.props.rank_data != null ? <div className="explanation_plot_container" style={{ width: '100%', height: '100%', }}>
                    <ExpChart exp_data={[["r1exp", this.props.time_mode_year1], ["r2exp", this.props.time_mode_year2]]} diverginColor={diverginColor} exp_id="r1exp" default_models={[this.props.time_mode_model]} state_range={this.props.time_mode_range} selected_year={this.props.time_mode_year1} model_name={this.props.time_mode_model}></ExpChart>
                  </div> : null
                }
              </Grid>
            </Grid>
          </Grid>
          {/* Group 2 */}
          <Grid item xs={5.9} style={{ borderTop: '2px solid #eaeaea',borderLeft: '2px solid #eaeaea',borderRight: '2px solid #eaeaea' }}>
            <Grid container>
              <Grid item xs={12} style={{padding:0}}>
                <div className="slidergroup2" style={{ width: '100%', height: 30 }}><Year2DropDown></Year2DropDown></div>
              </Grid>
              <Grid item xs={6}>
                <div className="deviation_plot_container_div" style={{ width: '100%', height:$('.box_root').height() - ($('.year_and_model_selector_and_slider_container').height() + $('.slidergroup2').height()),overflow: 'scroll' }}><svg id="r2d" style={{ width: "100%" }}></svg></div>
              </Grid>
              <Grid item xs={6}>
                  {
                    this.props.rank_data != null ? <div className="explanation_plot_container" style={{ width: '100%', height: 500, }}>
                      <ExpChart exp_data={[["r1exp", this.props.time_mode_year1], ["r2exp", this.props.time_mode_year2]]} diverginColor={diverginColor} exp_id="r2exp" default_models={[this.props.time_mode_model]} state_range={this.props.time_mode_range} selected_year={this.props.time_mode_year2} model_name={this.props.time_mode_model}></ExpChart>
                    </div> : null
                  }
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Popover diverginColor={diverginColor} default_models={[this.props.time_mode_model]}></Popover>
      </Box>
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
    Set_time_mode_year1:(val) => dispatch({ type: "time_mode_year1", value: val }),
    Set_time_mode_year2:(val) => dispatch({ type: "time_mode_year2", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(SlopeChart);