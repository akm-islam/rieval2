import React, { Component } from 'react';
import * as d3 from 'd3';
import { connect } from "react-redux";
import * as algo1 from "../../../Algorithms/algo1";
import * as $ from 'jquery';
import CreatexpCircle from "./Create_exp_circles"

class SlopeChart extends Component {
  constructor(props) {
    super(props);
    this.line_color = null;
    this.state = { mds_height: 100, mouseX: 0, mouseY: 0,excluded_features:[] }
  }
  componentDidMount() { this.setState({ width: window.innerHeight }) }
  componentDidUpdate(prevProps, prevState) {
    var self = this
    var selected_instances = d3.range(this.props.state_range[0], this.props.state_range[1] + 1)
    if (this.props.histogram_data.length > 0) { selected_instances = this.props.histogram_data }
    //------------------------------
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
    //------------------------------
    var min = d3.min(selected_instances), max = d3.max(selected_instances);
    var d = (max - min) / 8;
    var diverginColor = d3.scaleLinear().domain([min + d * 7, min + d * 6, min + d * 5, min + d * 4, min + d * 3, min + d * 2, min]).interpolate(d3.interpolateRgb).range(['#00429d', '#4771b2', '#73a2c6', '#a5d5d8', /*'#ffffe0',*/ '#ffbcaf', '#f4777f', '#cf3759', '#93003a']);
    var number_of_charts = 8+self.state.excluded_features.length
    var features_with_score = algo1.features_with_score(this.props.dataset, [this.props.model_name], selected_instances, this.props.selected_year, number_of_charts, this.props.rank_data)
    var sorted_features = Object.entries(features_with_score).sort((a, b) => b[1] - a[1]).filter(item=>!this.state.excluded_features.includes(item[0])).slice(0, number_of_charts + 1)
    //------------------------------
    var marginTop = 5;
    var item_width = parseInt($("#all_features_container" + this.props.model_name).width())
    //console.log("item_width",item_width)
    var item_height = (parseInt(window.innerHeight) - (this.state.mds_height + 80)) / sorted_features.length - marginTop
    var feature_containers = d3.select("#all_features_container" + this.props.model_name).selectAll(".feature_items").data(sorted_features, d => d[0])
      .join(enter => enter.append("svg").attr("y", (d, i) => marginTop + i * (item_height + marginTop))
        , update => update.transition().duration(2000).attr("y", (d, i) => marginTop + i * (item_height + marginTop))
        , exit => exit.remove()
      )
    feature_containers.attr("class", d => "feature_items " + d[0])
    feature_containers.attr("add_text_rect", function (d) {
      d3.select(this).selectAll(".title_rect").data([0]).join('rect').attr("class", "title_rect").attr("width", "100%").attr("height", 18).attr("fill", "#e2e2e2").attr("y", 0).attr("x", 0)
    })
    feature_containers.attr("add_cross_button", function (d) {
      d3.select(this).selectAll(".cross_button").data([0]).join("text").attr("class", "fa").attr('y',7.3).attr('dominant-baseline','middle').attr('x',item_width-15).style('cursor','pointer').attr('font-size',12).attr('fill','black')
        .text("\uf410").attr('class', "fa make_cursor").on('click', () => self.setState({excluded_features:[...self.state.excluded_features,d[0]]}))

    })
    feature_containers.attr("add_circ_rect", function (d) {
      d3.select(this).selectAll(".circ_rect").data([0]).join('rect').attr("class", "circ_rect").attr("width", "100%").attr("height", item_height - 18).attr("fill", "#ededed").attr("y", 18).attr("x", 0)
     .on('click', () => {
        if (self.props.clicked_features.includes(d[0])) {
          self.props.Set_clicked_features(self.props.clicked_features.filter(item => item != d[0]))
          d3.selectAll("." + d[0]).selectAll(".border_rect").remove()
        }
        else {
          self.props.Set_clicked_features([...self.props.clicked_features, d[0]])
          d3.selectAll("." + d[0]).selectAll(".border_rect").data([0]).join('rect').attr("class", "border_rect").attr("width", "100%").attr("height", "100%").style("stroke", "black").style("fill", "none").style("stroke-width", 5)
        }
      })

    })
    feature_containers.attr("add_text", function (d) {
      d3.select(this).selectAll(".title_text").data([0]).join('text').attr("class", "title_text").attr('x', item_width / 2).text(d[0]).attr("dominant-baseline", "hanging")
        .attr("y", 2).attr('text-anchor', 'middle').attr('font-size', 12)
    })
    feature_containers.attr("CreatexpCircle", function (d) {
      CreatexpCircle(d, d3.select(this), selected_instances, self.props.lime_data, self.props.selected_year, [self.props.model_name], self.props.clicked_circles,
        self.props.Set_clicked_circles, diverginColor, self.props.anim_config, item_width, item_height)
    }).attr("height", item_height).attr('width', item_width)
    feature_containers.attr('check_clicked_features', d => {
      if (this.props.clicked_features.includes(d[0])) {
        d3.selectAll("." + d[0]).selectAll(".border_rect").data([0]).join('rect').attr("class", "border_rect").attr("width", "100%").attr("height", "100%").style("stroke", "black").style("fill", "none").style("stroke-width", 5)
      }
    })
    //------------------------------
    //Create_MDS("mds_parent", "#mds" + this.props.model_name, this.props.lime_data, this.props.model_name, this.props.selected_year, selected_instances, sorted_features, diverginColor, this.props.Set_clicked_circles)
    //------------------------------
  }
  render() {
    return (
      <div className={"exp" + this.props.model_name} style={{ width: "100%", "border": "2px solid #e2e2e2", padding: "2px 10px" }}>
        <p style={{ margin: 0, padding: 0, marginLeft: "45%" }}>{this.props.model_name}</p>
        <svg id={"all_features_container" + this.props.model_name} style={{ marginTop: 5, width: "100%", height:$('#r1d').height()-30 }}> </svg>
      </div>
    )
  }
}
const maptstateToprop = (state) => {
  return {
    state_range: state.state_range,
    selected_year: state.selected_year,
    defualt_models: state.defualt_models,
    original_data: state.original_data,
    time_mode_model: state.time_mode_model,
    chart_scale_type: state.chart_scale_type,
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
    Set_replay: (val) => dispatch({ type: "replay", value: val }),
    Set_clicked_features: (val) => dispatch({ type: "clicked_features", value: val }),
    Set_selected_year: (val) => dispatch({ type: "selected_year", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(SlopeChart);