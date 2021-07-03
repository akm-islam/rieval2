import React, { Component, PureComponent } from 'react';
import * as d3 from 'd3';
import * as $ from 'jquery';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import "./Sidebar.scss";
import { connect } from "react-redux";
import * as algo1 from "../../Algorithms/algo1";
class Legend extends Component {
  constructor(props) {
    super(props);
    this.state = { mywidth: $(".Legend_container").width(), myheight: (this.props.legend_data[this.props.legend_data.length - 1] * 26) + 160, range: null, original_data: null, checkboxValue: 'CordAscent' } // This is the default height
  }
  componentDidMount() {
    this.setState({ checkboxValue: this.props.legend_model }) // updated model
    var legend_year=this.props.legend_year;
    var data1 = this.props.grouped_by_year_data[legend_year].slice(this.props.state_range[0] - 1, this.props.state_range[1])
    this.CreateLegend(data1, legend_year)
  }
  componentDidUpdate() {
    var legend_year=this.props.legend_year
    var data1 = this.props.grouped_by_year_data[legend_year].slice(this.props.state_range[0] - 1, this.props.state_range[1])
    this.CreateLegend(data1, legend_year)
  }
  //-------------------------------------------------------------------------------------------------------------------------------------CreateChart function
  CreateLegend = (data1, legend_year) => {
    var sorted_features = algo1.sorted_features(this.props.dataset, this.props.legend_model, d3.range(this.props.state_range[0], this.props.state_range[1]), legend_year) // this is for legend
    var min = this.props.state_range[0];
    var max = this.props.state_range[1];
    var d = (max - min) / 8;
    var line_color = d3.scaleLinear().domain([min + d * 7, min + d * 6, min + d * 5, min + d * 4, min + d * 3, min + d * 2, min]).interpolate(d3.interpolateRgb).range(['#00429d', '#4771b2', '#73a2c6', '#a5d5d8', /*'#ffffe0',*/ '#ffbcaf', '#f4777f', '#cf3759', '#93003a']);
    var margin = { left: 10, right: 10, top: 40, bottom: 10 }
    var text_spacing = 25;
    var SVG = d3.select("#legend_svg")
    if (data1.length < 20) {
      var mydomain = data1.map(element => {
        return element["two_realRank"]
      });

      line_color = d3.scaleOrdinal().domain(mydomain).range(["#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a", "#d62728", "#ff9896", "#9467bd",
        "#c5b0d5", "#8c564b", "#c49c94", "#e377c2", "#f7b6d2", "#7f7f7f", "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5"]);
    }
    //---------------------------------------------------------
    var size = 12
    if (this.props.legend_show_option == "Rank") {
      SVG.selectAll(".myrects")
        .data(data1, d => d)
        .join("rect")
        //.transition().duration(5000)
        .attr("class", "myrects")
        .attr("x", margin.left)
        .attr("y", (d, i) => i * text_spacing + margin.top - (size / 1.5))
        .attr("width", size)
        .attr("height", size)
        .style("fill", function (d) { return line_color(d['two_realRank']) })
      // Add one dot in the legend for each name.
      SVG.selectAll(".mylabels")
        .data(data1, d => d["State"])
        .join("text")
        .attr("id", d => d["State"].replace(/ +/g, ""))
        .attr("class", "mylabels")
        .attr("x", margin.left + size * 1.2)
        .attr("y", (d, i) => i * text_spacing + margin.top)
        .style("fill", function (d) { return line_color(d['two_realRank']) })
        .text(function (d) {
          var tex;
          tex = d["State"].length > 25 ? d["State"].replace("University", "U").substring(0, 25) : d["State"]
          return tex + " (" + d['two_realRank'] + ")"
        })
        .attr("text-anchor", "left")
        .attr("font-size", 12)
        .style("alignment-baseline", "middle")
      // Add one dot in the legend for each name.
      SVG.selectAll(".rank_text").data(["rank"], d => d).join("text").attr("x", 0).attr("class", "rank_text")
        .attr("y", 15).text("Rank")

    }
    //---------------------------------------------------------
    else {
      SVG.selectAll(".myrects").remove()
      SVG.selectAll(".mylabels")
        .data(sorted_features)
        .join("text")
        .attr("class", "mylabels")
        .attr("x", margin.left)
        .attr("y", (d, i) => i * text_spacing + margin.top)
        .style("fill", function (d) { "grey" })
        .text(function (d, i) { return i + 1 + ") " + d })
        .attr("text-anchor", "left")
        .attr("font-size", 12)
        .style("alignment-baseline", "middle")
      SVG.selectAll(".rank_text").data(["rank"], d => d).join("text").attr("class", "rank_text").attr("x", 0).attr("y", 15).text("Features")
    }
  }
  render() {
    return (
      <div className="legend_div" style={{ height: this.state.myheight, width: this.state.mywidth, marginBottom: 5 }}>
        <div className="Show">
          <Autocomplete
            defaultValue={this.props.legend_show_option}
            id="debug"
            debug
            options={["Rank", "Feature"].map((option) => option)}
            renderInput={(params) => (
              <TextField {...params} label="Show" margin="normal" />
            )}
            onChange={(event, value) => this.props.Set_legend_show_option(value)}
          />
        </div>
        {this.props.legend_show_option != "Rank" ? <div className="model">
          <Autocomplete
            defaultValue={this.props.legend_model}
            id="debug"
            debug
            options={["CordAscent", "LambdaMART", "LambdaRank", "LinearReg", "ListNet", "MART", "RandomFor", "RankBoost", "RankNet"].map((option) => option)}
            renderInput={(params) => (
              <TextField {...params} label="Model" margin="normal" />
            )}
            onChange={(event, value) => this.props.Set_legend_model(value)}
          />
        </div> : null}
        <div>
          <div className="year">
            <Autocomplete
              defaultValue={this.props.selected_year.toString()}
              id="debug"
              debug
              options={this.props.years_for_dropdown.map((option) => option)}
              renderInput={(params) => (
                <TextField {...params} label="Year" margin="normal" fullWidth={true} />
              )}
              onChange={(event, value) => {
                this.props.Set_legend_year(parseInt(value))
              }
              }
            />
          </div>
          <svg id="legend_svg" style={{ height: this.state.myheight, width: this.state.mywidth }}></svg>
        </div>
      </div>
    );
  }
}

const maptstateToprop = (state) => {
  return {
    state_range: state.state_range,
    selected_year: state.selected_year,
    dataset: state.dataset,
    legend_show_option: state.legend_show_option,
    legend_model: state.legend_model,
    years_for_dropdown: state.years_for_dropdown,
    legend_year:state.legend_year,
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
    Set_legend_show_option: (val) => dispatch({ type: "legend_show_option", value: val }),
    Set_legend_model: (val) => dispatch({ type: "legend_model", value: val }),
    Set_legend_year: (val) => dispatch({ type: "legend_year", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(Legend);