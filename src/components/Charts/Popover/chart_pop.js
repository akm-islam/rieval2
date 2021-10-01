import React, { Component } from 'react';
import * as d3 from 'd3';
import { connect } from "react-redux";
import * as misc_algo from '../misc_algo'

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = { "a": 10 }
    this.myid = React.createRef()
  }
  componentDidMount() {
    this.setState({ a: 5 })
  }
  componentDidUpdate() {
    var temp_dict = {}
    this.props.default_models.filter(item => item != "ListNet").map(model => {
      temp_dict[model] = this.props.popup_chart_data[0][model].filter(item=>item['deviation']<this.props.threshold).map(item=>{
        console.log(item['deviation'],'deviation')
        item['id'] = item['State'].replace(/ /g, '').replace(/[^a-zA-Z ]/g, "") + model.replace(/ /g, '').replace(/[^a-zA-Z ]/g, "")
        return item
      })
    })
    var merged_arr = [].concat.apply([], Object.values(temp_dict))
    var scatterplot_data = Object.entries(this.props.popup_chart_data[0]).filter(item => this.props.pop_over_models.includes(item[0]))
    scatterplot_data=scatterplot_data.map(data_arr=>{
      var temp=data_arr[1].filter(item=>item['deviation']<this.props.threshold)
      return [data_arr[0],temp]
    })
    console.log(scatterplot_data,"scatterplot_data")
    //console.log(this.props.popup_chart_data[0],this.props.pop_over_models)
    //----------------------------------------------------------------------------------------------------------Call createChart
    if (merged_arr.length > 0) { // This is to avoid the error caused by the next line
      if (isNaN(merged_arr[0][this.props.popup_chart_data[1]])) {
        this.CreateChart_cat(merged_arr, this.props.popup_chart_data[1], scatterplot_data)
      }
      else {
        //this.CreateChart_cat(merged_arr, this.props.popup_chart_data[1], scatterplot_data)
        this.CreateChart(merged_arr, this.props.popup_chart_data[1], scatterplot_data)
      }
    }
    else {
      this.CreateChart(merged_arr, this.props.popup_chart_data[1], scatterplot_data) // calling the function to set the  graph empty when all models are unselected
    }
    //----------------------------------------------------------------------------------------------------------Set and unset Opacity
    if (this.props.clicked_items_in_slopechart.length > 0) {
      d3.selectAll('circle,.datapoint').attr('opacity', this.props.config.reduced_opacity)
    }
    this.props.clicked_items_in_slopechart.map(idName => d3.selectAll('#' + idName).attr('opacity', 1))
    //----------------------------------------------------------------------------------------------------------
    misc_algo.handle_transparency("circle2", this.props.clicked_circles, this.props.anim_config)
  }
  CreateChart = (data, feature, scatterplot_data) => {
    var self = this,
      feature_contribute = feature + "_contribution"
    // set the dimensions and margins of the graph
    var margin = { top: 0, right: 30, bottom: 45, left: 50, space_for_hist: 50 },
      width = 520 - margin.left - margin.right,
      height = 250 - margin.top - margin.bottom;
    data = data.filter(d => parseFloat(d[feature_contribute]) > 0)
    var temp_x = data.map(item => parseFloat(item[feature])),
      temp_y = data.map(item => parseFloat(item[feature_contribute]))
    var x = d3.scaleLinear().domain([d3.min(temp_x), d3.max(temp_x)]).range([0, width]).nice(),
      y = d3.scaleLinear().domain([d3.min(temp_y), d3.max(temp_y)]).range([height, 0]).nice(); // circles will start from y position 10 and go upto height-10

    //-------------------------------------------------------------All svgs
    var parent_svg = d3.select("#" + self.props.myid).attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom + margin.space_for_hist),
      svg1 = parent_svg.selectAll('.svg11').data([0]).join('svg').attr("y", margin.space_for_hist).attr("class", "svg11").selectAll(".myg").data([0]).join('g').attr("class", "myg").attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")

    //------------------------------------------------------------------------------------------------------ Create Histogram starts here
    var hist_height = margin.space_for_hist,
      histogram = d3.histogram()
        .value(d => d)   // I need to give the vector of value
        .domain(x.domain())  // then the domain of the graphic
    //.thresholds(x.ticks(5)); // then the numbers of bins
    var bins = histogram(temp_x),
      y_hist = d3.scaleLinear()
        .range([hist_height, 0]);

    y_hist.domain([0, d3.max(bins, function (d) { return d.length; })]);   // d3.hist has to be called before the Y axis obviously
    var svg0 = parent_svg.selectAll('.svg0').data([0]).join('svg').attr("class", "svg0").selectAll(".myg0").data([0]).join('g').attr("class", "myg0").attr("transform",
      "translate(" + margin.left + "," + margin.top + ")")
    // Add line on the bottom of the histogram
    svg0.selectAll(".myline").data([0]).join('line').attr("class", "myline").attr("x1", 0).attr("y1", margin.space_for_hist).attr("x2", width).attr("y2", margin.space_for_hist).attr("stroke", "#EBEBEB");
    svg0.selectAll("rect").data(bins).join('rect')
      .attr("x", 1)
      .attr("fill", "#b7b7b7")
      .attr("transform", function (d) {
        if (d.x0 == d.x1) { return "translate(" + 0 + "," + y_hist(d.length) + ")" }
        return "translate(" + x(d.x0) + "," + y_hist(d.length) + ")";
      })
      .attr("width", function (d) {
        if (d.x0 == d.x1) { return width }
        return x(d.x1) - x(d.x0) - 0.2;
      })
      .attr("height", function (d) { return hist_height - y_hist(d.length); });
    //------------------------------------------------------------------------------------------------------ Create Histogram ends here

    var svg1 = parent_svg.selectAll('.svg11').data([0]).join('svg').attr("class", "svg11").selectAll(".myg").data([0]).join('g').attr("class", "myg").attr("transform",
      "translate(" + margin.left + "," + margin.top + ")")
    svg1.selectAll(".myline2").data([0]).join('line').attr("class", "myline2").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", height).attr("stroke", "#EBEBEB");
    //svg1.selectAll(".myline3").data([0]).join('line').attr("class","myline3").attr("x1", 0).attr("y1", height).attr("x2", width).attr("y2", height).attr("stroke", "#EBEBEB");

    //------------- Add Y axis
    var y2 = d3.scaleOrdinal().domain([".", "0", ".."]).range([height / 4, height / 2, (3 * height) / 4]); // circles will start from y position 10 and go upto height-10
    svg1.selectAll(".myYaxis").data([0]).join('g').attr("class", "myYaxis")
      .call(d3.axisLeft(y2).tickSize(-width * 1.0).ticks(1).tickValues(["0"]).tickFormat(d => d))
      .select(".domain").remove()
    svg1.selectAll(".myYaxis").selectAll('text').remove()

    d3.selectAll('.svg11').selectAll('.myYtext').data([["++ ve", height * .25], ["+ ve", height * .75]]).join("text").attr("class", "myYtext")
      .attr("x", 45).attr("y", (d, i) => d[1] + 4).text(d => d[0]).attr('font-size', 14).attr("text-anchor", "end")

    //------------- Add X axis
    if (d3.max(d3.max(bins)) > 1000) {
      svg1.selectAll(".myXaxis").data([0]).join('g').attr("class", "myXaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(-height * 1.3).tickValues(bins.map(item => item['x1'])).tickFormat(d3.format(".2s")))
        .select(".domain").remove()
    }
    else {
      svg1.selectAll(".myXaxis").data([0]).join('g').attr("class", "myXaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(-height * 1.3).tickValues(bins.map(item => item['x1'])))
        .select(".domain").remove()
    }
    svg1.selectAll(".tick line").attr("stroke", "#EBEBEB")

    //------------------------------------------------------------------------------------------------------ Scatterplot starts here
    svg1.selectAll(".scatterplot_g").data(scatterplot_data).join('g').attr("id", d => d[0] + "scatterplot_g_id").attr("class", "scatterplot_g").attr("ax", function (d) {
      temp_x = d[1].map(item => parseFloat(item[feature]))
      temp_y = d[1].map(item => parseFloat(item[feature_contribute]))

      x = d3.scaleLinear().domain([d3.min(temp_x), d3.max(temp_x)]).range([0, width]).nice()
      y = d3.scaleLinear().domain([d3.min(temp_y), d3.max(temp_y)]).range([height, 0]).nice();

      d3.select(this).selectAll('circle').data(d[1])
        .join("circle")
        .attr("cx", (d, i) => {
          if (x(parseFloat(d[feature])) < 10) {
            return 10;
          }
          else if (x(parseFloat(d[feature])) > width - 10) {
            return width - 10;
          }
          return x(d[feature]) + 2
        })
        .attr("cy", (d, i) => {
          if (y(parseFloat(d[feature_contribute])) < 10) {
            return 10;
          }
          else if (y(parseFloat(d[feature_contribute])) > (height - 10)) {
            return height - 10;
          }
          return y(parseFloat(d[feature_contribute])) - 0

        })
        .attr("actual_Y_value", d => d[feature_contribute])
        //.attr("r", 4)
        .attr("r", d => parseFloat(d[feature_contribute]) <= 0 ? 0 : 4)
        .attr("fill", (d) => self.props.diverginColor(d['two_realRank']))
        .attr('class', d => 'my_circles')
        .attr("id", d => d['id'])
        .on('click', d => {
          self.props.Set_clicked_circles(self.props.clicked_circles.includes(d['id']) ? self.props.clicked_circles.filter(item => item != d['id']) : [...self.props.clicked_circles, d['id']])
      })
    })

    // Define the div for the tooltip
    var div = d3.select("body").append("div")
      .attr("class", "tooltip2")
      .style("opacity", 0);
    d3.selectAll('.exp_circles')
      .on("mouseover", function (d) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html("<p>" + d['State'] + "</p>" + "<p>" + "Model: " + d3.select(this).attr('dataset_name') + "</p>")
          //div.html(d['State'])
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function (d) {
        d3.selectAll('.tooltip2').transition()
          .duration(500)
          .style("opacity", 0);
      })

    //------------------------------------------------------------------------------------------------------ Scatterplot ends here

  }
  CreateChart_cat = (data, feature, scatterplot_data) => {
    var self = this,
      feature_contribute = feature + "_contribution"
    var margin = { top: 0, right: 30, bottom: 75, left: 50, space_for_hist: 50 }, width = 520 - margin.left - margin.right, height = 270 - margin.top - margin.bottom;
    var barplot_data = {}
    data = data.filter(d => parseFloat(d[feature_contribute]) > 0)
    data.map(item => { if (barplot_data[item[feature]] > 0) { barplot_data[item[feature]] += 1 } else { barplot_data[item[feature]] = 1 } })

    var temp_x = Object.keys(barplot_data),
      temp_y = Object.values(barplot_data),
      y = d3.scaleLinear().domain([d3.min(temp_y), d3.max(temp_y)]).range([height, 0]).nice(); // circles will start from y position 10 and go upto height-10

    var x = d3.scaleBand().domain(temp_x).range([0, width]).padding(0.1);
    // add the x Axis
    //-------------------------------------------------------------All svgs
    var parent_svg = d3.select("#" + self.props.myid).attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom + margin.space_for_hist),
      svg1 = parent_svg.selectAll('.svg11').data([0]).join('svg').attr("y", margin.space_for_hist).attr("class", "svg11").selectAll(".myg").data([0]).join('g').attr("class", "myg").attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")

    //------------------------------------------------------------------------------------------------------ Create Histogram starts here
    var hist_height = margin.space_for_hist
    y = d3.scaleLinear().domain([0, d3.max(temp_y)]).range([hist_height, 0]).nice();
    var svg0 = parent_svg.selectAll('.svg0').data([0]).join('svg').attr("class", "svg0").selectAll(".myg0").data([0]).join('g').attr("class", "myg0")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    // Add line on the bottom of the histogram
    svg0.selectAll(".myline").data([0]).join('line').attr("class", "myline").attr("x1", 0).attr("y1", margin.space_for_hist).attr("x2", width).attr("y2", margin.space_for_hist).attr("stroke", "#EBEBEB");
    svg0.selectAll("rect").data(Object.entries(barplot_data)).join('rect')
      .attr("x", d => x(d[0]))
      .attr("fill", "#b7b7b7")
      .attr("width", x.bandwidth())
      .attr("y", d => y(d[1]))
      .attr("height", d => hist_height - y(d[1]));
    //------------------------------------------------------------------------------------------------------ Create Histogram ends here

    var svg1 = parent_svg.selectAll('.svg11').data([0]).join('svg').attr("class", "svg11").selectAll(".myg").data([0]).join('g').attr("class", "myg").attr("transform",
      "translate(" + margin.left + "," + margin.top + ")")
    svg1.selectAll(".myline2").data([0]).join('line').attr("class", "myline2").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", height).attr("stroke", "#EBEBEB");
    svg1.selectAll(".myline3").data([0]).join('line').attr("class", "myline3").attr("x1", 0).attr("y1", height).attr("x2", width).attr("y2", height).attr("stroke", "#EBEBEB");


    //------------- Add Y axis
    var y2 = d3.scaleOrdinal().domain([".", "0", ".."]).range([height / 4, height / 2, (3 * height) / 4]); // circles will start from y position 10 and go upto height-10
    svg1.selectAll(".myYaxis").data([0]).join('g').attr("class", "myYaxis").call(d3.axisLeft(y2).tickSize(-width * 1.0).ticks(1).tickValues(["0"]).tickFormat(d => d))
      .select(".domain").remove()
    svg1.selectAll(".myYaxis").selectAll('text').remove()
    d3.selectAll('.svg11').selectAll('.myYtext').data([["++ ve", height * .25], ["+ ve", height * .75]]).join("text").attr("class", "myYtext")
      .attr("x", 45).attr("y", (d, i) => d[1] + 4).text(d => d[0]).attr('font-size', 14).attr("text-anchor", "end")

    //------------- Add X axis
    svg1.selectAll(".myXaxis").data([0]).join('g').attr("class", "myXaxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickSize(-height * 1.3)).selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "0em")
      .attr("transform", "rotate(-90)")
      .selectAll(".tick line").remove()
    svg1.selectAll(".domain").remove()
    svg1.selectAll(".tick line").attr("stroke", "#EBEBEB")
    //------------------------------------------------------------------------------------------------------ Create Histogram ends here
    //------------------------------------------------------------------------------------------------------ Scatterplot starts here
    svg1.selectAll(".scatterplot_g").data(scatterplot_data).join('g').attr("id", d => d[0] + "scatterplot_g_id").attr("class", "scatterplot_g").attr("ax", function (d) {
      var temp_y = d[1].map(item => parseFloat(item[feature + "_contribution"])) // d[1] 
      y = d3.scaleLinear().domain([d3.min(temp_y), d3.max(temp_y)]).range([height, 0]).nice();

      d3.select(this).selectAll('circle').data(d[1])
        .join("circle")
        .attr("cx", (d, i) => {
          return x(d[feature]) + x.bandwidth() / 2
        })
        .attr("cy", (d, i) => {
          if (y(parseFloat(d[feature_contribute])) < 10) {
            return 10;
          }
          else if (y(parseFloat(d[feature_contribute])) > (height - 10)) {
            return height - 10;
          }
          return y(parseFloat(d[feature_contribute])) - 0

        })
        .attr("actual_Y_value", d => d[feature_contribute])
        //.attr("r", 4)
        .attr("r", d => parseFloat(d[feature_contribute]) <= 0 ? 0 : 4)
        .attr("fill", (d) => self.props.diverginColor(d['two_realRank']))
        .attr('class', d => 'my_circles')
        .attr("id", d => d['id'])
        .on('click', d => {
          self.props.Set_clicked_circles(self.props.clicked_circles.includes(d['id']) ? self.props.clicked_circles.filter(item => item != d['id']) : [...self.props.clicked_circles, d['id']])
      })
    })

    // Define the div for the tooltip
    var div = d3.select("body").append("div")
      .attr("class", "tooltip2")
      .style("opacity", 0);
    d3.selectAll('.exp_circles')
      .on("mouseover", function (d) {
        div.transition()
          .duration(200)
          .style("opacity", .9);
        div.html("<p>" + d['State'] + "</p>" + "<p>" + "Model: " + d3.select(this).attr('dataset_name') + "</p>")
          //div.html(d['State'])
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function (d) {
        d3.selectAll('.tooltip2').transition()
          .duration(500)
          .style("opacity", 0);
      })

    //------------------------------------------------------------------------------------------------------ Scatterplot ends here
  }

  render() {
    return (
      <div key={this.props.popup_chart_data[1]} style={{ margin: 10, padding: 10, border: this.props.index == 0 ? "3px solid #e5e5e5" : "white" }}>
        <svg ref={this.myid} id={this.props.myid}> </svg>
        <p style={{ color: "#4f4c4c", marginLeft: "42%", marginTop: -25, marginBottom: 0 }}>{this.props.popup_chart_data[1]}</p>
      </div>
    );
  }
}
const maptstateToprop = (state) => {
  return {
    //popup_chart_data: state.popup_chart_data,
    pop_over_models: state.pop_over_models,
    clicked_items_in_slopechart: state.clicked_items_in_slopechart,
    config: state.config,
    mode: state.mode,
    range_mode_model: state.range_mode_model,
    time_mode_model: state.time_mode_model,
    clicked_circles: state.clicked_circles,
    threshold: state.threshold,
    anim_config:state.anim_config,
  }
}
//item['id'] = item['State'].replace(/ /g, '').replace(/[^a-zA-Z ]/g, "") + model.replace(/ /g, '').replace(/[^a-zA-Z ]/g, "")
const mapdispatchToprop = (dispatch) => {
  return {
    Set_clicked_items_in_slopechart: (val) => dispatch({ type: "clicked_items_in_slopechart", value: val }),
    Set_clicked_circles: (val) => dispatch({ type: "clicked_circles", value: val }),
    
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(Chart);