import React, { Component, PureComponent } from 'react';
import * as d3 from 'd3';
import './Histogram.css';
import * as algo1 from "../../Algorithms/algo1";
import CreateChart from "./Histogram"
import exp_fiscal_CordAscent from "../../Data/data/fiscal/lime/chart1_data.csv";
import exp_school_CordAscent from "../../Data/data/school/lime/chart1_data.csv";
import exp_house_CordAscent from "../../Data/data/house/lime/chart1_data.csv";
import { connect } from 'react-redux'
import { Button } from '@material-ui/core';
import * as $ from "jquery"
class Chart extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = { feaures_dict: {}, features_voted: null, feature_data: null, selected_states: [] } // This is the default height
  }
  componentDidUpdate() {
    var self = this
    var selected_instances = d3.range(this.props.state_range[0], this.props.state_range[1] + 1)
    if (this.props.histogram_data.length > 0) { selected_instances = this.props.histogram_data }
    //--------------------
    var under_threshold_instances = []
    var year_data = this.props.original_data.filter(item => this.props.selected_year == item['1-qid'])
    this.props.default_models.map(model_name => {
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
    var number_of_charts = 9
    var features_dict = algo1.features_with_score(this.props.dataset, this.props.default_models, selected_instances, this.props.selected_year, number_of_charts, this.props.rank_data)
    var items = Object.keys(features_dict).map(function (key) {
      return [key, features_dict[key]];
    });
    items.sort(function (first, second) { // Sort the array based on the second element
      return second[1] - first[1];
    });
    items = items.map((element) => element[0])
    //--------
    var filename; if (this.props.dataset == "fiscal") { filename = exp_fiscal_CordAscent } else if (this.props.dataset == "school") { filename = exp_school_CordAscent }
    //--------------------------------Iterate through each features
    if (this.state.feature_data != null) {
      var feature_width = $(".Sidebar_parent").width()
      var feature_height = 100; // Feature height for individual feature
      //--------------------------------------------- Iterate trough eact item and create histograms
      items.forEach((feature, feature_index) => {
        var feature_id = "feature" + feature.replace(/[^\w\s]/gi, '')
        var temp = []
        this.state.feature_data.forEach(element => {
          if (element["1-qid"] == self.props.selected_year) {
            var temp_dict = {}
            temp_dict["x"] = parseInt(element['two_realRank'])
            temp_dict["y"] = element[feature]
            temp.push(temp_dict)
          }
        });
        d3.select("#histogram_container").attr("height", items.length * feature_height).selectAll("#" + feature_id).data([feature_id], d => d).join("svg").attr("id", feature_id).attr("width", feature_width)
          .attr("x", d => {
            //--------------------------------------------- Create chart is imported from the Histogram.js and this is the function that creates all the histograms
            CreateChart(feature, temp, "#" + feature_id, feature_height, self.props.selected_year, self.handleHistogramselection, self.state.feature_data)
            return 0;
          })
          .attr("y", (d, i) => feature_height * feature_index)
      })
    }
  }
  handleHistogramselection = (data, type) => {
    var temp = this.state.selected_states
    data.forEach(element => {
      if (!temp.includes(element)) { temp.push(element) }
    });
    this.setState({ selected_states: temp })
  }
  update_histogram_data = () => {
    d3.selectAll(".cat_item_clicked").classed("cat_item_clicked", false)
    d3.selectAll(".selection").remove()
    if (this.state.selected_states.length < 1) { alert("Empty selection!"); return }
    var filtered_states = this.state.selected_states.filter((item) => {
      if (item >= this.props.state_range[0] && item <= this.props.state_range[1]) {
        return item
      }
    })
    if (filtered_states.length < 1) { alert("Empty Selection") }
    if (this.props.slider_and_feature_value["Feature"] == 1 && this.props.slider_and_feature_value["Rank range"] == 1) { // If rank range is selected then filter states within the range
      console.log("temp", filtered_states)
      this.props.Set_histogram_data(filtered_states)
    }
    else {
      this.props.Set_histogram_data(this.state.selected_states) // else set states as selected
    }
    this.setState({ selected_states: [] })
  }
  //-----------------------------------------------------------------
  render() {
    return (
      <div>
        <div style={{position:"sticky",top:0,backgroundColor:"white"}}>
          <Button onClick={() => this.props.handleClose()} style={{ color: "red", fontWeight: "bold", marginLeft: "78%" }}>Close</Button>
          <Button className="update" style={{ marginRight: 30, padding: 0, width: "99%" }} onClick={() => {
            var self = this
            if (!this.props.slider_and_feature_value["Rank range"]) {
              if (d3.min(this.state.selected_states) < this.props.state_range[0]) {
                this.props.Set_state_range([d3.min(this.state.selected_states), this.props.state_range[1]])
              }
              if (d3.max(this.state.selected_states) > this.props.state_range[1]) {
                this.props.Set_state_range([this.props.state_range[0], d3.max(this.state.selected_states)])
              }
            }
            setTimeout(function () { self.update_histogram_data(); }, 500);
          }}
          >Update</Button>
        </div>
        <div className="histograms_container" style={{ borderBottom: "0px solid #e5e5e5" }}>
          <svg id="histogram_container" style={{ width: this.props.width }}></svg>
        </div>
      </div>
    );
  }
}
const maptstateToprop = (state) => {
  return {
    state_range: state.state_range,
    default_models: state.default_models,
    dataset: state.dataset,
    selected_year: state.selected_year,
    slider_and_feature_value: state.slider_and_feature_value,
    deviate_by: state.deviate_by,
    rank_data: state.rank_data,
    histogram_data: state.histogram_data,
    original_data: state.original_data,
    threshold: state.threshold,
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
    Set_default_models: (val) => dispatch({ type: "default_models", value: val }),
    Set_sparkline_data: (val) => dispatch({ type: "sparkline_data", value: val }),
    Set_histogram_data: (val) => dispatch({ type: "histogram_data", value: val }),
    Set_state_range: (val) => dispatch({ type: "state_range", value: val }),
    Set_clicked_items_in_slopechart: (val) => dispatch({ type: "clicked_items_in_slopechart", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(Chart);