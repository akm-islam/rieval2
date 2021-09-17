import React, { Component } from 'react';
import * as d3 from 'd3';
import * as $ from 'jquery';
import './Chart.css';
import * as algo1 from "../../../Algorithms/algo1";
import { connect } from "react-redux";
class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = { "sorted_features_dragged": null }
  }
  componentDidMount() {
    this.setState({ "sorted_features": null })
  }
  componentDidUpdate() {
    var self = this
    var animation3 = this.props.config.animation3
    var delay3 = this.props.config.animation1 + this.props.config.animation2
    //------------------------------------------------------------------------------------------------------------------------------ Dynamic feature calcuation starts here
    var margin = {
      top: 0, right: 20, bottom: 0, space_for_contribution_text: 40, space_for_feature_title: 0, right2: 5,
      bottom2: 0, left2: 18, vertical_space_between_features: 4, horizontal_space_between_features: 4
    }
    // Subtract margin.space_for_contribution_text from the parent width and use the rest for dynamic width calculation
    var parent_width = $('#' + "root_container" + this.props.model_name2.replace(/\s/g, '').replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')).width() - (margin.space_for_contribution_text * 2),
      parent_height = $('#' + "root_container" + this.props.model_name2.replace(/\s/g, '').replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')).height()
    var feature_width_temp = 70, feature_height_temp = 150; // Use them as the base to estimate the actual feature width and height. Change here to accomodate more features
    var horizontal_capacity = Math.floor(parent_width / feature_width_temp)
    var vertical_capacity = Math.floor(parent_height / feature_height_temp)

    var feature_width = (parent_width / horizontal_capacity),
      feature_height = (parent_height / vertical_capacity) - margin.top - margin.bottom

    var total_capacity = horizontal_capacity * vertical_capacity
    var number_of_features = total_capacity
    //------------------
    var sorted_features = algo1.sorted_features(this.props.dataset, this.props.model_name, d3.range(this.props.state_range[0], this.props.state_range[1]), this.props.selected_year, this.props.rank_data)
    if (Object.keys(this.props.drag_drop_feautre_data).length > 0) {
      Object.keys(this.props.drag_drop_feautre_data).map(feature_name => {
        var diff = this.props.drag_drop_feautre_data[feature_name]
        var origin_ind = sorted_features.indexOf(feature_name)
        sorted_features = sorted_features.filter(item => item != feature_name)
        var dest_index = origin_ind + diff
        sorted_features.splice(dest_index, 0, feature_name)
      })
    }
    //------------------
    if (sorted_features.length < total_capacity) {
      vertical_capacity = Math.ceil(sorted_features.length / horizontal_capacity)
      number_of_features = sorted_features.length
    }
    var top_features = sorted_features.slice(0, number_of_features).map(item => [item.replace(/\s/g, '').replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''), item])

    //------------------------------------------------------------------------------------------------------------------------------Dynamic feature calcuation ends here  


    //----------------------------------------------------------------------- Select the container identified by the model name. This container is under the root container and will contain all the features
    var feature_container = d3.selectAll("#feature_container" + this.props.model_name2.replace(/\s/g, '').replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''))
      .attr("width", parent_width).attr("height", parent_height).attr('x', margin.space_for_contribution_text) // subtract the contribution text space and then

    //----------------------------------------------------------------------- Select all svgs to append individual features and set their x and y value
    feature_container.selectAll('.svg1').data(top_features, d => d[0])
      .join(
        enter => enter.append("svg").attr('class', d => d[0] + " svg1")
          .attr("x", (d, i) => (i % horizontal_capacity) * feature_width) // subtract horizontal_space_between_features and vertical_space_between_features from each features but keep the x and y values as feature width and height to make space
          .attr('y', (d, i) => parseInt(i / horizontal_capacity) * feature_height)
          .attr("myindex", (d, i) => i)
        ,
        update => update.transition().duration(animation3).delay(delay3).attr('class', d => d[0] + " svg1")
          .attr("x", (d, i) => (i % horizontal_capacity) * feature_width) // subtract horizontal_space_between_features and vertical_space_between_features from each features but keep the x and y values as feature width and height to make space. change x position of each feature container to move right
          .attr('y', (d, i) => parseInt(i / horizontal_capacity) * feature_height)
          .attr("myindex", (d, i) => i)
      )
      .attr("feature_name", d => d[1])
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))
    //--------------------------------------------------------------------------
    var deltaX, deltaY, is_dragging;
    function dragstarted(d) {
      deltaX = d3.select(this).attr("x") - d3.event.x;
      deltaY = d3.select(this).attr("y") - d3.event.y;
    }
    function dragged(d) {
      is_dragging = true
      d3.select(this).raise();
      d3.select(this).attr("x", d3.event.x + deltaX).attr("y", d3.event.y + deltaY);
    }
    function dragended(d, e) {
      if (is_dragging) {
        var origin_index = parseInt(d3.select(this).attr("myindex")); d3.select(this).lower(); d3.select(this).select('rect').classed("exp_chart_clicked", true);
        var dest_index = parseInt(d3.select(document.elementFromPoint(d3.event.sourceEvent.clientX, d3.event.sourceEvent.clientY)).attr("myindex")), feature_name = d3.select(this).attr("feature_name"); d3.select(this).raise();
        self.props.set_config({ ...self.props.config, animation1: 0, animation2: 0 }) // Change config

        //-------------------------------------------------------------------------------------------------------------Set drag_drop_feautre_data starts here
        var diff = dest_index - origin_index
        if (isNaN(dest_index)) {
          alert("Please drop again")
        }
        else {
          var temp = { ...self.props.drag_drop_feautre_data }
          if (feature_name in self.props.drag_drop_feautre_data) {
            diff = diff + self.props.drag_drop_feautre_data[feature_name]
          }
          temp[feature_name] = diff
          self.props.set_drag_drop_feautre_data(temp)
        }
        //-------------------------------------------------------------------------------------------------------------Set drag_drop_feautre_data ends here
        self.props.set_config({ ...self.props.config, animation1: 4000, animation2: 2000 }) // Change config back
        if (!self.props.clicked_features.includes(feature_name)) { self.props.set_clicked_features([...self.props.clicked_features, feature_name]) } // Set clicked features for highlight
      }
      else { // This is to handle only the click
        if (self.props.clicked_features.includes(feature_name)) { self.props.set_clicked_features(self.props.clicked_features.filter(item => item != feature_name)) }
        else {
          if (feature_name != undefined) { self.props.set_clicked_features([...self.props.clicked_features, feature_name]) }
        }
      }
    }

    //--------------------------------------------------------------------------
    // use the following to aviod transition issue during on('click)
    feature_container.selectAll('.svg1').data(top_features, d => d[0]).join("svg").attr('class', d => "feat" + d[0] + " svg1")
      .attr("a", (d, i) => { // subtract horizontal_space_between_features and vertical_space_between_features from each features but keep the x and y values as feature width and height to make space
        this.CreateChart("feat" + d[0], d[1], feature_width - margin.horizontal_space_between_features, feature_height - margin.vertical_space_between_features, margin, self, i) // call the createChart and pass the d[0] as the className to combine the modelname with it to access each feature container. subtract 5 from the width to make space on the right of each feature
        return i
      })

    //----------------------------------------------------------------------- Contribution text containers starts here
    d3.select('#' + "root_container" + this.props.model_name2.replace(/\s/g, '').replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ''))
      .selectAll('.contribution_container').data(d3.range(vertical_capacity).concat(d3.range(vertical_capacity))).join('svg').attr('class', "contribution_container").attr('width', margin.space_for_contribution_text)
      .attr('height', feature_height - margin.vertical_space_between_features)
      .attr('y', (d, i) => {
        return (feature_height * Math.floor(i / 2))
      })
      .attr('add_rect', function () {
        d3.select(this).selectAll('rect').data([0]).join('rect').attr('width', margin.space_for_contribution_text).attr('height', feature_height - margin.space_for_feature_title).attr('fill', '#ededed')
      })
      .attr('x', (d, i) => i % 2 == 0 ? 0 : margin.space_for_contribution_text + parent_width - margin.horizontal_space_between_features)
      .attr("add_text", function (d, i) { //Contribution text starts here
        d3.select(this).selectAll("text").data([[8, '++ ve'], [2.6, "+ ve"], [1.977, '0'], [1.6, "- ve"], [1.15, "-- ve"]]).join('text')
          .attr("x", i % 2 == 0 ? margin.space_for_contribution_text - 5 : 5)
          .attr("y", (d, i) => (feature_height / d[0]) + 1)
          .text(d => d[1])
          .attr("font-size", 13)
          .attr('text-anchor', i % 2 == 0 ? 'end' : 'start')
      })
      .attr('add_horizontal_lines', function () { //horizontal lines starts here
        d3.select(this).selectAll("line").data([3.9, 1.31]).join('line')
          .attr("x1", 4)
          .attr("x2", margin.space_for_contribution_text)
          .attr("y1", d => (feature_height / d) - 2)
          .attr("y2", d => (feature_height / d) - 2)
          .style("stroke", "#a5a5a5")
      })

      .attr('add_0horizontal_line', function (d, i) { //horizontal lines starts here
        d3.select(this).selectAll(".line0").data([0]).join('line').attr('class', "line0")
          .attr("x1", i % 2 == 0 ? 4 : 15)
          .attr("x2", i % 2 == 0 ? margin.space_for_contribution_text - 15 : margin.space_for_contribution_text)
          .attr("y1", d => (feature_height / 2) - 2)
          .attr("y2", d => (feature_height / 2) - 2)
          .style("stroke", "#a5a5a5")
      })

  }

  //-------------------------------------------------------------------------------------------------------------------------------------CreateChart function
  CreateChart = (feature_className, feature, width, feature_height, margin, self, myindex) => {
    //console.log(myindex)
    var animation4 = this.props.config.animation4
    var delay4 = this.props.config.animation1 + this.props.config.animation2 + this.props.config.animation3
    /*
    svg1 is for to contain the feature tittle and svg2. svg2 contains the dots
    */
    var width = width - margin.left2 - margin.right2, // width for individual features 
      height = feature_height - margin.space_for_feature_title - margin.bottom2; // height for individual features
    var year = self.props.selected_year;
    var number_of_filters_start = self.props.state_range[0];
    var number_of_filters_end = self.props.state_range[1];
    var histogram_data = self.props.histogram_data;
    var selected_range = [];
    var data = null
    // Data for the chart
    if (histogram_data.length > 0) { data = self.props.lime_data[self.props.model_name].filter(element => { if ((parseInt(element['1-qid']) == parseInt(year)) && (histogram_data.includes(parseInt(element['two_realRank'])))) { return element } }); }
    else { data = self.props.lime_data[self.props.model_name].filter(element => { if ((parseInt(element['1-qid']) == parseInt(year)) && (parseInt(element['two_realRank']) >= parseInt(number_of_filters_start) && (parseInt(element['two_realRank']) <= parseInt(number_of_filters_end)))) { return element } }); }

    selected_range = data.map(function (d) { return parseInt(d.two_realRank) });
    selected_range.sort(function (a, b) { return a - b });
    //----------------------------------------------------------------------------------------------------------------------------------SVG1 for svg2
    var svg1 = d3.select("#feature_container" + self.props.model_name2.replace(/\s/g, '').replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')).select("." + feature_className) // select the model and then select the feature container from that
      .attr("width", width + margin.left2 + margin.right2).attr("height", height + margin.space_for_feature_title + margin.bottom2).attr('class', 'svg1')

    svg1.selectAll('rect').data([0]).join('rect').attr("width", width + margin.left2 + margin.right2).attr("height", height + margin.bottom2).attr("y", margin.space_for_feature_title)
      .attr('fill', '#f7f7f7')
      .attr('class', d => {
        //if (self.props.clicked_features.includes(feature) || self.props.dbclicked_features.includes(feature)) {
        if (self.props.clicked_features.includes(feature)) {
          return "exp_chart_clicked rect" + feature_className
        }
        else {
          return "rect" + feature_className
        }
      })
      .attr("myindex", myindex)
      .on('click', function (event, d) {
        if (event.defaultPrevented) return;
        var temp = [...self.props.clicked_features]
        if (d3.selectAll(".rect" + feature_className).classed("exp_chart_clicked") == true) {
          temp = self.props.clicked_features.filter(item => item != feature)
          d3.selectAll(".rect" + feature_className).classed("exp_chart_clicked", false)
        }
        else {
          temp.push(feature)
          d3.selectAll(".rect" + feature_className).classed("exp_chart_clicked", true)
        }
        self.props.set_clicked_features(temp)
      })
      .on('dblclick', (d) => {
        d3.event.preventDefault()
        var temp = [...self.props.dbclicked_features]
          if (!temp.includes(feature)) {
            temp.unshift(feature)
            d3.selectAll(".rect" + feature_className).classed("exp_chart_clicked", true)
        }
        self.props.set_dbclicked_features(temp)
        //----------------------------Data for popup chart
        var popup_chart_data = {}
        self.props.default_models.filter(item=>item!="ListNet").map(model_name => {
          //if(model_name=="ListNet"){return}
          if (histogram_data.length > 0) {
            data = self.props.lime_data[model_name].filter(element => { if ((parseInt(element['1-qid']) == parseInt(year)) && (histogram_data.includes(parseInt(element['two_realRank'])))) { return element } });
          }
          else { data = self.props.lime_data[model_name].filter(element => { if ((parseInt(element['1-qid']) == parseInt(year)) && (parseInt(element['two_realRank']) >= parseInt(number_of_filters_start) && (parseInt(element['two_realRank']) <= parseInt(number_of_filters_end)))) { return element } }); }
          popup_chart_data[model_name] = data
        })
        //self.props.Set_popup_chart_data([popup_chart_data,feature]) // This is to update the pop when the year or anything changes during the pop up is open
        self.props.Set_popup_chart_data([popup_chart_data, feature])
        self.props.set_pop_over(true)
      })
    //---------------------------------------------------------------------------------------------------------------------------------- SVG2 for title and circles
    var svg2 = svg1.selectAll('.svg2').data([0]).join('svg').attr('class', 'svg2').attr("width", width + margin.left2 + margin.right2).attr("height", height + margin.space_for_feature_title + margin.bottom2)
      .attr('x', margin.left2).attr('y', margin.space_for_feature_title)
    svg1.selectAll("text").data([feature]).join('text').attr('class', "features").attr('x', 10).attr('y', height / 2).text(d => d).attr("font-size", 12).style("text-anchor", "middle")
      .style("writing-mode", "tb")

    svg2.selectAll("line").data([4, 2, 1.3]).join('line')
      .attr("x1", 2)
      .attr("x2", width)
      .attr("y1", d => height / d)
      .attr("y2", d => height / d)
      .style("stroke", "#a5a5a5")

    //----------------------------------------------------------------------------------------------------------------------------------Create scatterplot
    var temp_x = data.map(item => parseFloat(item[feature]))
    var x = d3.scaleLinear().domain([d3.min(temp_x), d3.max(temp_x)]).range([0, width]).nice();
    var temp_y = data.map(item => parseFloat(item[feature + "_contribution"])) // d[1]
    var y = d3.scaleLinear().domain([d3.min(temp_y), d3.max(temp_y)]).range([height, 0]).nice(); // circles will start from y position 10 and go upto height-10

    if (data.length > 0) { // This is to avoid erro caused by the next line
      if (isNaN(data[0][feature])) {
        var temp_x = data.map(item => item[feature])
        var x = d3.scaleOrdinal().domain(temp_x).range([0, width]); // overwrites the previous variable when condition is true
      }
    }

    var circs = svg2.selectAll("circle").data(data, d => d[feature + "_contribution"])
    circs.join(
      enter => enter.append("circle")
        .attr("cx", (d, i) => {
          if (x(d[feature]) < 10) {
            return 10;
          }
          return x(d[feature])
        })
        .attr("cy", (d, i) => {
          if (y(parseFloat(d[feature + "_contribution"])) < 10) {
            return 10;
          }
          else if (y(parseFloat(d[feature + "_contribution"])) > (height - 10)) {
            return height - 10;
          }
          return y(parseFloat(d[feature + "_contribution"])) - 0
        })
        .attr("actual_Y_valu", d => d[feature + "_contribution"])
        .attr("r", 4)
        .attr('opacity', d => {
          if ((self.props.clicked_items_in_slopechart.length > 0 && self.props.clicked_items_in_slopechart.includes("A" + String(d['State']).replace(/ +/g, ""))) || self.props.clicked_items_in_slopechart.length == 0) {
            return 1
          }
          else {
            return self.props.config.reduced_opacity
          }
        })
        .attr("fill", (d) => self.props.color_gen(d['State']))
        .attr("id", d => "A" + String(d['State']).replace(/ +/g, ""))
        .attr("class", d => "bar myid" + String(d['two_realRank']) + " exp_circles")
        .attr("myindex", myindex)
        .on("click", d => self.props.textClickHandler_original("A" + d["State"]))
      ,
      update =>
      {
        console.log(update)
        return update
          .attr("cx", (d, i) => {
            if (x(d[feature]) < 10) {
              return 10;
            }
            return x(d[feature]) - 5
          })
          .attr('opacity', d => {
            if ((self.props.clicked_items_in_slopechart.length > 0 && self.props.clicked_items_in_slopechart.includes("A" + String(d['State']).replace(/ +/g, ""))) || self.props.clicked_items_in_slopechart.length == 0) {
              return 1
            }
            else {
              return self.props.config.reduced_opacity
            }
          })
          .on("click", function (d) {
            self.props.textClickHandler_original("A" + d["State"])
          })
          .transition()
          .duration(animation4)
          .delay(delay4)
          .attr("cy", (d, i) => {
            if (y(parseFloat(d[feature + "_contribution"])) < 10) {
              return 10;
            }
            else if (y(parseFloat(d[feature + "_contribution"])) > (height - 10)) {
              return height - 10;
            }
            return y(parseFloat(d[feature + "_contribution"])) - 0
          })
          .attr("actual_Y_valu", d => d[feature + "_contribution"])
          .attr("r", 4)
          .attr("fill", (d) => self.props.color_gen(d['State']))
          .attr("id", d => "A" + String(d['State']).replace(/ +/g, ""))
          .attr("myindex", myindex)
          .attr("class", function (d) {
            return "bar myid" + String(d['two_realRank']) + " exp_circles"
          })
        }
    );
    // Define the div for the tooltip
    var div = d3.select("body").append("div")
      .attr("class", "tooltip2")
      .style("opacity", 0);
    d3.selectAll('.exp_circles')
      .on("mouseover", function (d) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        //div.html("<p>" + d['State'] + "</p>" + "<p>" + "Rank: " + d['two_realRank'] + "</p>")
        div.html(d['State'])
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function (d) {
        d3.selectAll('.tooltip2').transition()
          .duration(500)
          .style("opacity", 0);
      })
  }

  render() {
    return (
      <svg id={"root_container" + this.props.model_name2.replace(/\s/g, '').replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')} style={{ width: "100%", height: "100%" }}>
        <svg id={"feature_container" + this.props.model_name2.replace(/\s/g, '').replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')}> </svg>
      </svg>
    );
  }
}
const maptstateToprop = (state) => {
  return {
    clicked_items_in_slopechart: state.clicked_items_in_slopechart,
    original_data: state.original_data,
    chart_scale_type: state.chart_scale_type,
    features_with_score: state.features_with_score,
    dataset: state.dataset,
    histogram_data: state.histogram_data,
    deviate_by: state.deviate_by,
    prev_prop: state.prev_prop,
    clicked_features: state.clicked_features,
    config: state.config,
    rank_data: state.rank_data,
    lime_data: state.lime_data,
    default_models: state.default_models,
    drag_drop_feautre_data: state.drag_drop_feautre_data,
    dbclicked_features: state.dbclicked_features,
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
    Set_default_models: (val) => dispatch({ type: "default_models", value: val }),
    Set_clicked_items_in_slopechart: (val) => dispatch({ type: "clicked_items_in_slopechart", value: val }),
    Set_popup_chart_data: (val) => dispatch({ type: "popup_chart_data", value: val }),
    set_pop_over: (val) => dispatch({ type: "pop_over", value: val }),
    set_clicked_features: (val) => dispatch({ type: "clicked_features", value: val }),
    set_config: (val) => dispatch({ type: "config", value: val }),
    set_drag_drop_feautre_data: (val) => dispatch({ type: "drag_drop_feautre_data", value: val }),
    set_dbclicked_features: (val) => dispatch({ type: "dbclicked_features", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(Chart);

//https://stackoverflow.com/questions/51304266/how-to-get-target-element-in-drag-n-drop-d3-v4