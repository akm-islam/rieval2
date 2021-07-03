import React, { Component } from 'react';
import * as d3 from 'd3';
import * as $ from 'jquery';
import * as slopechart1 from "./slopechart1";
import Chart2 from "../Exp_Chart/Chart2"
import { connect } from "react-redux";
import Grid from '@material-ui/core/Grid';
import Popover from "../Exp_Chart/Popover/Popover"
import * as Legend from '../Legend'
class SlopeChart extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  componentDidMount() {
    this.setState({ random: 0 })
  }
  componentDidUpdate(prevProps, prevState) {
    //---- Animation replay starts
    if (JSON.stringify(this.props.time_mode_range) != JSON.stringify(prevProps.time_mode_range)) {
      this.props.Set_prev_prop(prevProps)
    }
    if (this.props.time_mode_year1 !== prevProps.time_mode_year1) {
      this.props.Set_prev_prop(prevProps)
    }
    if (this.props.time_mode_year2 !== prevProps.time_mode_year2) {
      this.props.Set_prev_prop(prevProps)
    }
    //---- Animation replay ends

    if (!this.props.replay) { // if replay is false
      this.props.time_mode_range[0] != prevProps.time_mode_range[0] ? this.task1("dont_animate") : this.task1("animate")
    }
    else {
      this.task1("dont_animate")
    }
    this.props.task2()
  }
  task1 = (animate) => {
    var selected_year;
    if (this.props.model_name == "Year1") { selected_year = this.props.time_mode_year1 } else { selected_year = this.props.time_mode_year2 }
    var state_range = this.props.time_mode_range
    var mydata3 = { "A": [], "B": [] }
    var deviate_by = this.props.deviate_by
    var selected_by_year_data = this.props.grouped_by_year_data[selected_year] // This is the data passed a dictionay where year is the key
    var max_rank = selected_by_year_data.length
    var model_name = this.props.time_mode_model // This is the model name on the right side
    var cmodel = this.props.cmodel // This is the selected model for color in case of sorting by predicted rank
    //--------
    var start_range = state_range != null ? state_range[0] : 10; // range to start
    if (start_range > 0) { start_range -= 1 } // This is to start from index 0
    if (start_range < 0) { start_range = 0 } // check if the deviation make the starting range less than the available rank
    if (start_range < deviate_by) { deviate_by = start_range } // check if the deviation make the starting range less than the available rank
    start_range = start_range - deviate_by
    if (start_range < 0) { start_range = 0; deviate_by = 0 }
    var deviate_check_lower = start_range + deviate_by + 1
    //-----
    deviate_by = this.props.deviate_by
    var end_range = state_range != null ? state_range[1] : 25
    var deviate_check_upper = end_range // Upper deviation check is this
    end_range = end_range + deviate_by // changes the end range to include the deviation; next if checks when it goes beyond range
    if (end_range > max_rank) {
      deviate_check_upper = end_range - deviate_by; // set the upper range by subtracting the deviation
      end_range = max_rank
    }

    for (var i = start_range; i < end_range; i++) {
      var tempA = {}
      var tempB = {}
      tempA["Model"] = model_name
      tempA["name"] = selected_by_year_data[i]["State"]
      tempA["rank"] = selected_by_year_data[i]["two_realRank"]
      tempB["name"] = selected_by_year_data[i]["State"]
      tempB["rank"] = selected_by_year_data[i][model_name]
      mydata3["A"].push(tempA)
      mydata3["B"].push(tempB)
    }
    //------------ Slopechart 1
    slopechart1.CreateSlopeChart1(this.node, mydata3, start_range + 1, end_range, deviate_check_lower,
      deviate_check_upper, this.props.model_name, selected_year, this.props.appHandleChange,
      this.props.sparkline_data, this.props.original_data, this.props.histogram_data, this.props.textClickHandler_original,
      this.color_gen(), animate, this.props.time_mode_model, this.props.config)
    //------------        

  }
  color_gen = () => {
    var selected_year;
    if (this.props.model_name == "Year1") { selected_year = this.props.time_mode_year1 } else { selected_year = this.props.time_mode_year2 }
    //------------------------------------------------------
    var deviate_by = this.props.deviate_by
    var selected_by_year_data = this.props.grouped_by_year_data[selected_year] // This is the data passed a dictionay where year is the key
    var max_rank = selected_by_year_data.length
    //--------
    var start_range = this.props.time_mode_range != null ? this.props.time_mode_range[0] : 10; // range to start
    if (start_range > 0) { start_range -= 1 } // This is to start from index 0
    if (start_range < 0) { start_range = 0 } // check if the deviation make the starting range less than the available rank
    if (start_range < deviate_by) { deviate_by = start_range } // check if the deviation make the starting range less than the available rank
    start_range = start_range - deviate_by
    if (start_range < 0) { start_range = 0; deviate_by = 0 }
    var deviate_check_lower = start_range + deviate_by + 1
    //-----
    deviate_by = this.props.deviate_by
    var end_range = this.props.time_mode_range != null ? this.props.time_mode_range[1] : 25
    var deviate_check_upper = end_range // Upper deviation check is this
    end_range = end_range + deviate_by // changes the end range to include the deviation; next if checks when it goes beyond range
    if (end_range > max_rank) {
      deviate_check_upper = end_range - deviate_by; // set the upper range by subtracting the deviation
      end_range = max_rank
    }
    //---------------------------------------------------------------------------- Tracking starts here
    var track_states_ranged_dictionary = {}
    var track_states_year_data = this.props.grouped_by_year_data[selected_year] // when tracking is not activated we use selected year for color
    var track_states_ranged_dictionary = {}
    for (var i = deviate_check_lower - 1; i < deviate_check_upper; i++) {
      track_states_ranged_dictionary[track_states_year_data[i]["State"]] = track_states_year_data[i]["two_realRank"]
    }
    var min = deviate_check_lower;
    var max = deviate_check_upper;
    var d = (max - min) / 8;
    var line_color2 = d3.scaleLinear().domain([min + d * 7, min + d * 6, min + d * 5, min + d * 4, min + d * 3, min + d * 2, min]).interpolate(d3.interpolateRgb).range(['#00429d', '#4771b2', '#73a2c6', '#a5d5d8', /*'#ffffe0',*/ '#ffbcaf', '#f4777f', '#cf3759', '#93003a']);
    var Rgbdict = {}
    for (var key in track_states_ranged_dictionary) {
      Rgbdict[key] = line_color2(track_states_ranged_dictionary[key])
    }
    this.line_color = d3.scaleOrdinal().domain(Object.keys(Rgbdict)).range(Object.values(Rgbdict))
    Legend.createLegend("legend",[min,max],Rgbdict) 
    //---------------------------------------------------------------------------- Tracking ends here 
    return this.line_color
  }














  render() {
    return (
      this.props.show.includes("Explanation") ? <Grid container style={{ width: "49.5%", marginRight: "0.5%", marginTop: "0.5%", paddingRight: 0, border: "1px solid #eaeaea"}} className="slopechart">
        <Grid item xs="6" className="slopechart_col">
          <div className="slope_chart_title">
            <p>True Rank</p>
            <p className="model_title">{this.props.model_name == "Year1" ? "Year 1" : "Year 2"}</p>
            <p>Predicted Rank</p>
          </div>
          <div className="mysvg" ref={node => this.node = node}><svg id={this.props.model_name}><g id="myg"></g></svg></div>
        </Grid>
        <Grid item xs="6" className="exp_chart" >
          {this.props.time_mode_model != "ListNet" ? <Chart2
            textClickHandler_original={this.props.textClickHandler_original}
            color_gen={this.color_gen()}
            model_name={this.props.time_mode_model}
            model_name2={this.props.model_name}
            state_range={this.props.time_mode_range}
            selected_year={this.props.model_name == "Year1" ? this.props.time_mode_year1 : this.props.time_mode_year2}
            grouped_by_year_data={this.props.grouped_by_year_data}
            defualt_models={[this.props.time_mode_model]}
          >
          </Chart2> : <div className="not_avail"><h3>NOT AVAILABLE</h3></div>}
          {this.props.popup_chart_data != null && this.props.myindex == 0 ? <Popover defualt_models={[this.props.time_mode_model]} color_gen={this.color_gen()} textClickHandler_original={this.props.textClickHandler_original}></Popover> : null}
        </Grid>
      </Grid > :
        <Grid item className="slopechart_col" style={{ marginTop: 5, border: "1px solid #eaeaea", width: "48%", marginRight: "1%" }}>
          <div className="slope_chart_title">
            <p>True Rank</p>
            <p className="model_title">{this.props.time_mode_model} ({this.props.model_name == "Year1" ? this.props.time_mode_year1 : this.props.time_mode_year2})</p>
            <p>Predicted Rank</p>
          </div>
          <div className="mysvg" ref={node => this.node = node}><svg id={this.props.model_name}><g id="myg"></g></svg></div>
        </Grid>
    );
  }

}


const maptstateToprop = (state) => {
  return {
    selected_year: state.selected_year,
    time_mode_model: state.time_mode_model,
    time_mode_range: state.time_mode_range,
    deviate_by: state.deviate_by,
    time_mode_year1: state.time_mode_year1,
    time_mode_year2: state.time_mode_year2,
    clicked_items_in_slopechart: state.clicked_items_in_slopechart,
    replay: state.replay,
    popup_chart_data: state.popup_chart_data,
    config: state.config,
    show: state.show,
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
    Set_prev_prop: (val) => dispatch({ type: "prev_prop", value: val }),
    Set_defualt_models: (val) => dispatch({ type: "defualt_models", value: val }),
    Set_sparkline_data: (val) => dispatch({ type: "sparkline_data", value: val }),
    Set_clicked_items_in_slopechart: (val) => dispatch({ type: "clicked_items_in_slopechart", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(SlopeChart);