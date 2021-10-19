import React, { Component } from 'react';
import { connect } from "react-redux";
import * as misc_algo from '../misc_algo'
import CreateCatChart from '../Popover/CreateCatChart'
import CreateNumChart from '../Popover/CreateNumChart'
class Chart extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.setState({ a: 5 })
  }
  componentDidUpdate() {
    var merged_arr = this.props.popup_chart_data[0] // only data
    var scatterplot_data = [[this.props.popup_chart_data[1],this.props.popup_chart_data[0]]] // [feature name, data]
    //----------------------------------------------------------------------------------------------------------Call createChart
    if (merged_arr.length > 0) { // This is to avoid the error caused by the next line
      if (isNaN(merged_arr[0][this.props.popup_chart_data[1]])) {
        CreateCatChart(merged_arr, this.props.popup_chart_data[1], scatterplot_data,this.props,this.props.deviation_array)
      }
      else {
        CreateNumChart(merged_arr, this.props.popup_chart_data[1], scatterplot_data,this.props,this.props.deviation_array)
      }
    }
    else {
      CreateNumChart(merged_arr, this.props.popup_chart_data[1], scatterplot_data,this.props,this.props.deviation_array) // calling the function to set the  graph empty when all models are unselected
    }
    misc_algo.handle_transparency("circle2", this.props.clicked_circles, this.props.anim_config)
  }

  render() {
    return (
      <div key={this.props.popup_chart_data[1]} style={{ margin: 10, padding: 10, border: this.props.index == 0 ? "3px solid #e5e5e5" : "white" }}>
        <svg id={this.props.myid}> </svg>
        <p style={{ color: "#4f4c4c", marginLeft: "42%", marginTop: -25, marginBottom: 0 }}>{this.props.popup_chart_data[1]}</p>
      </div>
    );
  }
}
const maptstateToprop = (state) => {
  return {
    //popup_chart_data: state.popup_chart_data,
    pop_over_models: state.pop_over_models,
    clicked_circles: state.clicked_circles,
    threshold: state.threshold,
    anim_config:state.anim_config,
    deviation_array: state.deviation_array,
  }
}
//item['id'] = item['State'].replace(/ /g, '').replace(/[^a-zA-Z ]/g, "") + model.replace(/ /g, '').replace(/[^a-zA-Z ]/g, "")
const mapdispatchToprop = (dispatch) => {
  return {
    Set_clicked_circles: (val) => dispatch({ type: "clicked_circles", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(Chart);