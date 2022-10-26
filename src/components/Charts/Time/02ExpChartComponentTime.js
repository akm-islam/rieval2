import React, { Component } from 'react';
import * as d3 from 'd3';
import { connect } from "react-redux";
import * as algo1 from "../../../Algorithms/algo1";
import * as $ from 'jquery';
import CreatexpCircle from "../ExpChart/Create_exp_circles"
import "../ExpChart/MDS.css"
class SlopeChart extends Component {
  constructor(props) {
    super(props);
    this.mds = React.createRef()
    this.state = { mds_height: 10, mouseX: 0, mouseY: 0, excluded_features: [], sorted_features: null, circle_data: null, indexed_features: null, random: true }
  }
  componentDidMount() {
    this.setState({ width: window.innerHeight })
  }
  componentDidUpdate(prevProps, prevState) {
    this.Createsvg(this.props.model_name,this.props.exp_id,this.props.state_range,this.props.selected_year)
  }
  Createsvg = (model_name,exp_id,state_range,selected_year) => {
    var self = this
    var selected_instances = d3.range(state_range[0], state_range[1] + 1)
    if (this.props.histogram_data.length > 0) { selected_instances = this.props.histogram_data }
    //-------------------- Threshold filter
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

    //------------------------------
    var number_of_charts = 8 + self.state.excluded_features.length
   
    var indexed_features = algo1.getSortedFeatures(this.props.lime_data[model_name],selected_instances, this.props.selected_year)
    var temp_sorted_features = indexed_features.filter(item => !this.state.excluded_features.includes(item))// Exclude crossed features 
    var sorted_features = temp_sorted_features.slice(0, number_of_charts).map((item, index) => [item, index])
    
    var marginTop = 5,marginBottom = 10
    var parent_height = parseInt($('.explanation_chart_parent').height()) - this.state.mds_height - parseInt($('.title_p').height())
    var item_width = parseInt($("#" + this.props.exp_id).width())
    var item_height = (parent_height - 10) / sorted_features.length - marginTop // 10 is the top margin
    var feature_containers = d3.select('#' + this.props.exp_id).attr('height', parent_height).selectAll(".feature_items").data(sorted_features, d => d[0])
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
      d3.select(this).selectAll(".cross_button").data([0]).join("text").attr('y', 7.3).attr('dominant-baseline', 'middle').attr("myindex", index).attr('feature_name', d[0]).raise()
        .attr('x', item_width - 15).style('cursor', 'pointer').attr('font-size', 14).attr('fill', 'black')
        .text("\uf410").attr('class', "cross_button fa make_cursor").on('click', () => {
          //alert("clicked!")
          d3.event.preventDefault()
          self.setState({ excluded_features: [...self.state.excluded_features, d[0]] })
        })
        //---
        d3.select(this).selectAll(".expand_button").data([0]).join("text").attr('y', 7.3)
        .attr('dominant-baseline', 'middle').attr("myindex", index).attr('feature_name', d[0]).raise()
        .attr('x', item_width - 35).style('cursor', 'pointer').attr('font-size', 12).attr('fill', 'black')
        .text("\uf31e").attr('class', "expand_button fa make_cursor").on('click', () => {
          var feature = d[0]
          var year = selected_year
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
      var title_rect_height=16
      CreatexpCircle(d, d3.select(this), selected_instances, self.props.lime_data, selected_year, [model_name], self.props.clicked_circles,
        self.props.Set_clicked_circles, self.props.diverginColor, self.props.anim_config, item_width, item_height-(marginTop+marginBottom), self.props.deviation_array, index,self.props.threshold,self.props.dataset,title_rect_height,'label_on',sorted_features)
    })
    .attr("height", function (d) {
      if (d[1] == sorted_features.length - 1) {
        var ft_svg_height = 25
        var svg = d3.select(this.parentNode).selectAll(".ft_svg").data([0]).join("svg").attr("x", 0).attr("y", parent_height - ft_svg_height).attr("class", "ft_svg").attr("width", item_width).attr("height", ft_svg_height)
        var markerBoxWidth = 8, markerBoxHeight = 8, refX = markerBoxWidth / 2, refY = markerBoxHeight / 2
        svg.append('defs').append('marker').attr('id', 'arrow').attr('viewBox', [0, 0, markerBoxWidth, markerBoxHeight])
          .attr('refX', refX).attr('refY', refY).attr('markerWidth', markerBoxWidth).attr('markerHeight', markerBoxHeight).attr('orient', 'auto-start-reverse')
          .append('path').attr('d', d3.line()([[0, 0], [0, 7], [7, 3.8]])).attr('stroke', '#777777').attr("fill","#777777");
        //------------------------------------------------[[x2, y2], [x1, y1]]
        svg.append('path').attr('d', d3.line()([[item_width / 2 - 65, 15], [50, 15]])).attr('stroke', '#777777').attr('marker-end', 'url(#arrow)').attr('fill', 'none');
        svg.append('path').attr('d', d3.line()([[item_width - 50, 15], [65 + item_width / 2, 15]])).attr('stroke', '#777777').attr('marker-start', 'url(#arrow)').attr('fill', 'none');

        svg.selectAll(".myText_low").data([0]).join("text").attr("x", 30).attr("class", "myText_low").attr('dominant-baseline', "middle").attr("y", 15).text('Low').attr('text-anchor', 'middle').attr("font-size", 12).attr("fill", "#2b2828")
        svg.selectAll(".myText").data([0]).join("text").attr("x", item_width / 2).attr("class", "myText").attr('dominant-baseline', "middle").attr("y", 15).text('attribute Importance').attr('text-anchor', 'middle').attr("font-size", 12).attr("fill", "#2b2828")
        svg.selectAll(".myText_high").data([0]).join("text").attr("x", item_width-30).attr("class", "myText_high").attr('dominant-baseline', "middle").attr("y", 15).text('High').attr('text-anchor', 'middle').attr("font-size", 12).attr("fill", "#2b2828")
        return item_height - marginBottom - marginTop
      }
      return item_height - marginBottom - marginTop
    })
    .attr('width', item_width)
    feature_containers.attr('check_clicked_features', d => {
      if (self.props.clicked_features.includes(d[0])) {
        d3.selectAll("." + d[0]).selectAll(".border_rect").data([0]).join('rect').attr("class", "border_rect").attr("width", "100%").attr("height", "100%").style("stroke", "black").style("fill", "none").style("stroke-width", 5)
      }
    })
  }
  //------------------------------
  render() {
    return (
      <div className={"explanation_chart_parent exp" + this.props.model_name} style={{ width: '100%', height: '100%', "border": this.props.mode == 'Model' ? "2px solid #e2e2e2" : 'none', padding: "2px 5px" }}>
        <p className="title_p" style={{ padding: 0, margin: 0 }}>{this.props.model_name}</p>
        <svg id={this.props.exp_id} style={{ marginTop: this.state.mds_height, width: "100%" }}></svg>
        <marker id="arrow" markerUnits="strokeWidth" markerWidth="12" markerHeight="12" viewBox="0 0 12 12" refX="6" refY="6" orient="auto">
          <path d="M2,2 L10,6 L2,10 L6,6 L2,2" style={{ fill: "black" }}></path>
        </marker>
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
    Set_deviation_array: (val) => dispatch({ type: "deviation_array", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(SlopeChart);