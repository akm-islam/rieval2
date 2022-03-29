import React, { Component } from 'react';
import * as d3 from 'd3';
import { connect } from "react-redux";
import * as algo1 from "../../../Algorithms/algo1";
import * as $ from 'jquery';
import CreatexpCircle from "../ExpChart/Create_exp_circles"
import getMdsData from "../ExpChart/MDS"
import { Create_MDS } from "../ExpChart/MDS"
import "../ExpChart/MDS.css"
import * as misc_algo from '../misc_algo'
class SlopeChart extends Component {
  constructor(props) {
    super(props);
    this.line_color = null;
    this.exp = React.createRef()
    this.mds = React.createRef()
    this.state = { mds_height: 110, mouseX: 0, mouseY: 0, excluded_features: [], sorted_features: null, circle_data: null, indexed_features: null, random: true }
  }
  componentDidMount() {
    this.setState({ width: window.innerHeight })
  }
  componentDidUpdate(prevProps, prevState) {
    this.Createsvg(this.props.model_name, this.props.dragged_features, null)
    /*
    setTimeout(()=>{
      misc_algo.handle_transparency("circle2", this.props.clicked_circles, this.props.anim_config)
    },3000)
    */
  }
  Createsvg = (model_name, dragged_features, indexed_features) => {
    var self = this
    var selected_instances = d3.range(this.props.state_range[0], this.props.state_range[1] + 1)
    console.log(selected_instances, "selected_instances")
    if (this.props.histogram_data.length > 0) { selected_instances = this.props.histogram_data }
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
    //console.log(selected_instances,"selected_instances2")
    //--------------------

    //------------------------------
    var number_of_charts = 8 + self.state.excluded_features.length
    var features_with_score = algo1.features_with_score(this.props.dataset, [model_name], selected_instances, this.props.selected_year, number_of_charts, this.props.rank_data)
    if (model_name in self.props.dragged_features) { features_with_score = self.props.dragged_features[model_name] }
    var indexed_features = Object.entries(features_with_score).sort((a, b) => b[1] - a[1]).map((item, i) => item[0])
    var temp_sorted_features = indexed_features.filter(item => !this.state.excluded_features.includes(item))// Exclude crossed features 
    var sorted_features = temp_sorted_features.slice(0, number_of_charts).map((item, index) => [item, index])
    var marginTop = 5;
    var parent_height = parseInt($('.explanation_chart_parent').height()) - this.state.mds_height - parseInt($('.title_p').height())
    var item_width = parseInt($("#" + model_name).width())
    var item_height = (parent_height - 10) / sorted_features.length - marginTop // 10 is the top margin
    var feature_containers = d3.select('#' + model_name).attr('height', parent_height).selectAll(".feature_items").data(sorted_features, d => d[0])
      .join(enter => enter.append("svg").attr("y", (d, i) => marginTop + i * (item_height + marginTop))
        , update => update.transition().duration(2000).attr("y", (d, i) => marginTop + i * (item_height + marginTop))
        , exit => exit.remove()
      )
    feature_containers.attr("class", d => "feature_items " + d[0]).attr("myindex", (d, i) => i).attr('feature_name', d => d[0])
    feature_containers.attr("add_title_text_and_rect_for_title_text", function (d, index) {
      d3.select(this).selectAll(".title_rect").data([0]).join('rect').attr("class", "title_rect").attr("myindex", index).attr('feature_name', d[0]).attr("width", "100%").attr("height", 18).attr("fill", "#e2e2e2").attr("y", 0).attr("x", 0)
      d3.select(this).selectAll(".title_text").data([0]).join('text').attr("class", "title_text").attr("myindex", index).attr('feature_name', d[0]).attr('x', item_width / 2).text(d[0]).attr("dominant-baseline", "hanging")
        .attr("y", 2).attr('text-anchor', 'middle').attr('font-size', 12)
    })
    feature_containers.attr("add_cross_button", function (d, index) {
      d3.select(this).selectAll(".cross_button").data([0]).join("text").attr('y', 7.3)
        .attr('dominant-baseline', 'middle').attr("myindex", index).attr('feature_name', d[0]).raise()
        .attr('x', item_width - 15).style('cursor', 'pointer').attr('font-size', 12).attr('fill', 'black')
        .text("\uf410").attr('class', "cross_button fa make_cursor").on('click', () => {
          d3.event.preventDefault()
          self.setState({ excluded_features: [...self.state.excluded_features, d[0]] })
        })
      //---
      d3.select(this).selectAll(".expand_button").data([0]).join("text").attr('y', 7.3)
        .attr('dominant-baseline', 'middle').attr("myindex", index).attr('feature_name', d[0]).raise()
        .attr('x', item_width - 30).style('cursor', 'pointer').attr('font-size', 12).attr('fill', 'black')
        .text("\uf31e").attr('class', "expand_button fa make_cursor").on('click', () => {
          d3.event.preventDefault()
            var feature = d[0]
            var year = self.props.selected_year
            d3.event.preventDefault()
            var temp = [...self.props.dbclicked_features]
            if (!temp.includes(feature)) {
              temp.unshift(feature)
              d3.selectAll(".rect").classed("exp_chart_clicked", true)
            }
            self.props.set_dbclicked_features(temp)
            //self.props.set_dbclicked_features([feature])
            //----------------------------Data for popup chart
            var popup_chart_data = {}
            self.props.default_models.filter(item => item != "ListNet").map(model_name => {
              var data = []
              if (self.props.histogram_data.length > 0) {
                data = self.props.lime_data[model_name].filter(element => { if ((parseInt(element['1-qid']) == parseInt(year)) && (self.props.histogram_data.includes(parseInt(element['two_realRank'])))) { return element } });
              }
              else {
                data = self.props.lime_data[model_name].filter(element => parseInt(element['1-qid']) == parseInt(year) && selected_instances.includes(parseInt(element['two_realRank'])))
              }
              popup_chart_data[model_name] = data
            })
            self.props.Set_popup_chart_data([popup_chart_data, feature]) // This is to update the pop when the year or anything changes during the pop up is open
            //self.props.Set_popup_chart_data([popup_chart_data, feature])
            self.props.set_pop_over(true)
        })
      //---
    })
    feature_containers.attr("add_rect_for_circle_background_and_handle_clicks", function (d, index) {
      d3.select(this).selectAll(".circ_rect").data([0]).join('rect').attr("class", "circ_rect").attr("myindex", index).attr('feature_name', d[0]).attr("width", "100%").attr("height", item_height - 18).attr("fill", "#f2f2f2").attr("y", 18).attr("x", 0)
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
    feature_containers.attr("CreatexpCircle", function (d, index) {
      CreatexpCircle(d, d3.select(this), selected_instances, self.props.lime_data, self.props.selected_year, [model_name], self.props.clicked_circles,
        self.props.Set_clicked_circles, self.props.diverginColor, self.props.anim_config, item_width, item_height, self.props.deviation_array, index, self.props.threshold, self.props.dataset)
    }).attr("height", item_height).attr('width', item_width)
    feature_containers.attr('check_clicked_features', d => {
      if (self.props.clicked_features.includes(d[0])) {
        d3.selectAll("." + d[0]).selectAll(".border_rect").data([0]).join('rect').attr("class", "border_rect").attr("width", "100%").attr("height", "100%").style("stroke", "black").style("fill", "none").style("stroke-width", 5)
      }
    })
    feature_containers.attr('add_drag_drop', function (d, index) {
      d3.select(this).selectAll(".my_rect").data([0]).join('rect').attr("class", "my_rect").attr("myindex", index).attr('feature_name', d[0]).attr("width", item_width - 33).attr("height", 18).style("fill", "transparent").style('cursor', 'move')
        .call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended).container(this.parentNode.parentNode)) // Set the parent node based on which the distance will be calculated
      var deltaY, is_dragging;
      function dragstarted(event, d) {
        //d3.select(this).attr("width", '100%').attr("height", '100%').style('fill','rgb(249, 195, 87,0.3)')
        d3.select(this.parentNode).raise()
        deltaY = d3.select(this.parentNode).attr("y") - d3.event.y;
      }
      function dragged(event, d) {
        is_dragging = true
        d3.select(this.parentNode).raise()
        d3.select(this.parentNode).attr("y", d3.event.y + deltaY);
      }
      function dragended(event, d) {
        var origin_index = parseInt(d3.select(this).attr("myindex")); d3.select(this.parentNode).lower();
        d3.select(this.parentNode).attr("y", d3.event.y + deltaY);
        var difference = parseInt(d3.select(document.elementFromPoint(d3.event.sourceEvent.clientX, d3.event.sourceEvent.clientY)).attr("myindex")) - origin_index
        //if (isNaN(dest_index)) { alert("Please drop properly!"); dest_index = origin_index }
        var origin_feature = d3.select(this).attr("feature_name")

        var temp1 = {}
        var number_of_charts = 15 // change this number to have features when cross button clicked
        self.props.default_models.map(model_name => {
          var features_with_score = algo1.features_with_score(self.props.dataset, [model_name], selected_instances, self.props.selected_year, number_of_charts, self.props.rank_data)
          if (model_name in self.props.dragged_features) {
            features_with_score = self.props.dragged_features[model_name]
          }
          var indexed_features = Object.entries(features_with_score).sort((a, b) => b[1] - a[1]).map((item, i) => item[0])
          var origin_index = indexed_features.indexOf(origin_feature)
          var dest_index = origin_index + difference
          if (dest_index < 0) { var dest_feature = indexed_features[0] }
          else if (dest_index > number_of_charts - 1) { var dest_feature = indexed_features[number_of_charts - 1] }
          else { var dest_feature = indexed_features[dest_index] }

          features_with_score[origin_feature] = features_with_score[origin_feature] - difference
          features_with_score[dest_feature] = features_with_score[dest_feature] + difference
          temp1[model_name] = features_with_score
        })
        self.props.Set_dragged_features(temp1)
        //-------------------------------------
        d3.select(this).raise()
      }
    })
    //--------------------------------------MDS Plot
    var feature_contrib_data_for_mds = this.props.lime_data[model_name].filter(item => item['1-qid'] == this.props.selected_year && selected_instances.includes(item['two_realRank']))
    getMdsData(this.props.url, { "data": feature_contrib_data_for_mds, "weight": features_with_score }).then(data => {
      if (typeof data != 'undefined') {
        var MDS_response = JSON.parse(data.response)
        var circle_data = feature_contrib_data_for_mds.map((item, index) => {
          item['x'] = MDS_response[index][0]
          item['y'] = MDS_response[index][1]
          item['id'] = item['State'].replace(/ /g, '').replace(/[^a-zA-Z ]/g, "") + item["model"].replace(/ /g, '').replace(/[^a-zA-Z ]/g, "")
          return item
        })
        Create_MDS(this.mds, circle_data, "#mds" + model_name, self.props.diverginColor, this.props.Set_clicked_circles, this.props.deviation_array)
        misc_algo.handle_transparency("circle2", self.props.clicked_circles, self.props.anim_config)
      }
    })
  }
  //------------------------------
  render() {
    return (
      <div key={this.props.model_name} className={"explanation_chart_parent exp" + this.props.model_name} style={{ width: '100%', height: '100%', "border": this.props.mode == 'Model' ? "2px solid #e2e2e2" : 'none', padding: "2px 5px" }}>
        <p className="title_p" style={{ padding: 0, margin: 0 }}>{this.props.model_name}</p>
        <svg ref={this.mds} id={"mds" + this.props.model_name} style={{ margin: 0, width: "100%", height: this.state.mds_height }}></svg>
        <svg ref={this.exp} id={this.props.model_name} style={{ marginTop: 0, width: "100%" }}></svg>
      </div>
    )
  }
}
const maptstateToprop = (state) => {
  return {
    deviation_array: state.deviation_array,
    original_data: state.original_data,
    time_mode_model: state.time_mode_model,
    chart_scale_type: state.chart_scale_type,
    dataset: state.dataset,
    histogram_data: state.histogram_data,
    sparkline_data: state.sparkline_data,
    anim_config: state.anim_config,
    show: state.show,
    average_m: state.average_m,
    average_y: state.average_y,
    lime_data: state.lime_data,
    rank_data: state.rank_data,
    clicked_circles: state.clicked_circles,
    clicked_features: state.clicked_features,
    threshold: state.threshold,
    mode: state.mode,
    dbclicked_features: state.dbclicked_features,
    dragged_features: state.dragged_features,
    url: state.url,
    default_models: state.default_models,
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
    Set_dragged_features: (val) => dispatch({ type: "dragged_features", value: val }),
    Set_clicked_circles: (val) => dispatch({ type: "clicked_circles", value: val }),
    Set_prev_prop: (val) => dispatch({ type: "prev_prop", value: val }),
    Set_sparkline_data: (val) => dispatch({ type: "sparkline_data", value: val }),
    Set_replay: (val) => dispatch({ type: "replay", value: val }),
    Set_clicked_features: (val) => dispatch({ type: "clicked_features", value: val }),
    Set_selected_year: (val) => dispatch({ type: "selected_year", value: val }),
    set_dbclicked_features: (val) => dispatch({ type: "dbclicked_features", value: val }),
    Set_popup_chart_data: (val) => dispatch({ type: "popup_chart_data", value: val }),
    set_pop_over: (val) => dispatch({ type: "pop_over", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(SlopeChart);