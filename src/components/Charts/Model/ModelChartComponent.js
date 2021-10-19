import React, { Component } from 'react';
import * as d3 from 'd3';
import { connect } from "react-redux";
import * as deviation_chart from "../DevPlot/deviation_chart"
import * as misc_algo from '../misc_algo'
import * as $ from 'jquery';
import ModelSlider from './ModelSlider';
import ExpChart from './ExpChartComponent';
import './ModelSlider.scss';
import YearModelSelection from "./YearAndModelSelection/YearModelSelection"
import Grid from '@mui/material/Grid';
import Popover from '../Popover/01Popover';
class SlopeChart extends Component {
  constructor(props) {
    super(props);
    this.line_color = null;
    this.state = { height_slope_exp_chart: 700, mouseX: 0, mouseY: 0 }
  }
  componentDidMount() { this.setState({ width: window.innerHeight }) }
  shouldComponentUpdate(prevProps, prevState) { return true; }
  componentDidUpdate(prevProps, prevState) {
    var self=this
    var selected_instances = d3.range(this.props.state_range[0], this.props.state_range[1] + 1)
    if (this.props.histogram_data.length > 0) { selected_instances = this.props.histogram_data }

    //--------------------
    var min = d3.min(selected_instances), max = d3.max(selected_instances);
    var d = (max - min) / 8;
    var diverginColor = d3.scaleLinear().domain([min + d * 7, min + d * 6, min + d * 5, min + d * 4, min + d * 3, min + d * 2, min]).interpolate(d3.interpolateRgb).range(['#00429d', '#4771b2', '#73a2c6', '#a5d5d8', /*'#ffffe0',*/ '#ffbcaf', '#f4777f', '#cf3759', '#93003a']);

    //-------------------- Threshold filter
    var under_threshold_instances = []
    var year_data = this.props.original_data.filter(item => this.props.selected_year == item['1-qid'])
    this.props.default_models.map(model_name => {
      year_data.map(item => {
        var two_realRank = parseInt(item['two_realRank'])
        var predicted_rank = parseInt(item[model_name])
        if (Math.abs(predicted_rank - two_realRank) < this.props.threshold) {
          under_threshold_instances.push(two_realRank)
        }
      })
    })
    selected_instances = selected_instances.filter(item => under_threshold_instances.includes(item))
    deviation_chart.Create_deviation_chart('dev_plot_container_svg', 'exp', selected_instances, this.props.original_data, this.props.default_models, this.props.anim_config, this.props.selected_year, this.props.average_m, this.props.clicked_circles, this.props.Set_clicked_circles, diverginColor, this.props.sparkline_data, this.props.Set_selected_year, this.props.dataset, this.props.threshold)
    misc_algo.handle_transparency("circle2", this.props.clicked_circles, this.props.anim_config)
    //-------------------------Handle model mousever start here 
    d3.selectAll(".model_p").on('mouseover',function(){
      var selectedModel=d3.select(this).attr('modelName')
      if(self.props.default_models.includes(selectedModel)){
        d3.selectAll('.deviation_circles').attr('opacity',0.1)
        d3.selectAll('.'+selectedModel).attr('opacity',1)  
      }
    })
    .on('mouseout',function(){
      d3.selectAll('.deviation_circles').attr('opacity',1)
    })
  //-------------------------Handle model mousever start here
  }
  render() {
    var selected_instances = d3.range(this.props.state_range[0], this.props.state_range[1] + 1)
    if (this.props.histogram_data.length > 0) { selected_instances = this.props.histogram_data }
    //--------------------
    var min = d3.min(selected_instances), max = d3.max(selected_instances);
    var d = (max - min) / 8;
    var diverginColor = d3.scaleLinear().domain([min + d * 7, min + d * 6, min + d * 5, min + d * 4, min + d * 3, min + d * 2, min]).interpolate(d3.interpolateRgb).range(['#00429d', '#4771b2', '#73a2c6', '#a5d5d8', /*'#ffffe0',*/ '#ffbcaf', '#f4777f', '#cf3759', '#93003a']);
    this.props.Set_selected_instances(selected_instances)
    //--------------------
    var deviation_array = []
    this.props.default_models.map(model => {
      this.props.lime_data[model].map(item => {
        if (item['1-qid'] == this.props.selected_year && selected_instances.includes(parseInt(item['two_realRank']))) {
          deviation_array.push(item['deviation'])
        }
      })
    })
    this.props.Set_deviation_array(deviation_array)
    //console.log('deviation_array: ', d3.extent(deviation_array))
    //--------------------
    return (
      <Grid className="ModelChartParent" container direction="row" justify="flex-start" alignItems="center" style={{ height: '100%', width: '100%', backgroundColor: 'white', margin: 2, padding: 2, boxShadow: "-2px 1px 4px -1px white" }}> {/* This model chart's height and width is the parent*/}
        <Grid item className="left_container" style={{width:400, backgroundColor: "#fcfcfc" }}>
          {/* The deviation plot container starts below */}
          <div className="year_and_model_selector_and_slider_container"> {/* This is used to calculate the deviation plot height */}
            <YearModelSelection></YearModelSelection><ModelSlider></ModelSlider>
          </div>
          {/* The deviation plot container starts below */}
          <div class="deviation_plot_container_div" style={{ width: "100%", height: $('.ModelChartParent').height() - $('.year_and_model_selector_and_slider_container').height(), marginBottom: 0, overflow: 'scroll' }}>
            <svg id="dev_plot_container_svg" style={{ width: "100%", overflow: 'hidden' }}></svg>
          </div>
          {/* The deviation plot container ends here */}
        </Grid>
        {/* The explanation plot container starts below */}
        {this.props.rank_data != null ?
          <Grid className="right_container" item container xs direction="row" columnSpacing={1} style={{ height: '100%'}}>
              {
                this.props.default_models.map((model_name, index) => {
                  return <Grid item xs={12/this.props.default_models.length} style={{height: "100%"}}>
                    <ExpChart diverginColor={diverginColor} exp_id={"exp" + index} default_models={this.props.default_models} state_range={this.props.state_range} selected_year={this.props.selected_year} model_name={model_name}></ExpChart>
                  </Grid>
                })
              }
            
          </Grid> : null}
        {/* The explanation plot container ends here */}
        <Popover diverginColor={diverginColor} default_models={this.props.default_models}></Popover>
      </Grid>
    )
  }
}
const maptstateToprop = (state) => {
  return {
    default_models: state.default_models,
    histogram_data: state.histogram_data,
    state_range: state.state_range,
    selected_year: state.selected_year,
    lime_data: state.lime_data,
    default_models: state.default_models,
    original_data: state.original_data,
    dataset: state.dataset,
    sparkline_data: state.sparkline_data,
    dataset: state.dataset,
    anim_config: state.anim_config,
    average_m: state.average_m,
    rank_data: state.rank_data,
    clicked_circles: state.clicked_circles,
    threshold: state.threshold
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