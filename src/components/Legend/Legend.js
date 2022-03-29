import React, { Component, PureComponent } from 'react';
import * as d3 from 'd3';
import * as $ from 'jquery';
import { connect } from "react-redux";
import Grid from '@mui/material/Grid';
import './legend.scss'
class Legend extends Component {
  constructor(props) {
    super(props);
    this.state = {} // This is the default height
  }
  componentDidMount() { this.setState({ rand: 10 }) }
  componentDidUpdate() {
    var legend_container_width = $('.legend_container').width()
    var legend_container_height = $('.legend_container').height()
    //--------------------------- Legend 1
    var legend1_height = 100
    var legend1_rScale = d3.scaleLinear().domain(d3.extent(this.props.deviation_array)).range([8, 1])
    var legend1_yScale = d3.scaleLinear().domain(d3.extent(this.props.deviation_array)).range([8, legend1_height - 5])
    var legend1_ticks = legend1_yScale.ticks(4)
    legend1_ticks=legend1_ticks.filter(item=>item % 1 === 0)
    console.log(legend1_ticks,"legend1_ticks")
    var legend1_svg = d3.select('#legend1').attr('width', legend_container_width).attr('height', legend1_height)
    legend1_svg.selectAll('.legend1_circles').data(legend1_ticks).join('circle').attr('class', 'legend1_circles').attr('cx', 10).attr('cy', d => legend1_yScale(d)).attr('r', d => legend1_rScale(d)).attr('fill', 'grey')
    legend1_svg.selectAll('.legend1_text').data(legend1_ticks).join('text').attr('class', 'legend1_text').attr('x', 23).attr('y', d => legend1_yScale(d)).text(d => d).attr('dominant-baseline', 'middle').attr('font-size', 10)

    //--------------------------- Legend 2
    var min = d3.min(this.props.selected_instances), max = d3.max(this.props.selected_instances);
    var d = (max - min) / 8;
    var diverginColor = d3.scaleLinear().domain([min + d * 7, min + d * 6, min + d * 5, min + d * 4, min + d * 3, min + d * 2, min]).interpolate(d3.interpolateRgb).range(['#00429d', '#4771b2', '#73a2c6', '#a5d5d8', /*'#ffffe0',*/ '#ffbcaf', '#f4777f', '#cf3759', '#93003a']);

    var legend2_svg_height = legend_container_height / 2 - 50

    var legend2_yScale = d3.scaleLinear().domain([min, max]).range([5, legend2_svg_height - 10])
    var legend2_ticks = d3.range(min, max + 1, max / 10)
    var rect_height = legend2_svg_height / legend2_ticks.length
    var rect_width = 8
    console.log(legend1_ticks)
    var legend2_svg = d3.select('#legend2').attr('width', legend_container_width).attr('height', legend2_svg_height)
    legend2_svg.selectAll('.legend2_rects').data(legend2_ticks).join('rect').attr('class', 'legend2_rects').attr('x', 10)
    .attr('y', (d, i) => rect_height*i).attr('width', rect_width).attr('height', rect_height).attr('fill', d => diverginColor(d))
    legend2_svg.selectAll(".legend2_labels").data([min, parseInt(max / 2), max]).join("text").attr("x", 10 + rect_width + 2).attr("class", "legend2_labels").attr('dominant-baseline', "middle").attr('y', (d, i) => i == 0 ? legend2_yScale(d) + rect_height / 2 : legend2_yScale(d)).text(d => d).attr('font-size', 12)
  }

  render() {
    return (
      <Grid className="legend_container" container direction="column" justifyContent="center" alignItems="flex-start" style={{ width: "100%", height: "100%" }}>
        <Grid item style={{width:this.props.legend_width}}>
          <div item style={{ backgroundColor: 'rgb(211, 211, 211,0.5)', padding: 5, marginBottom: 5 }}>
            <p className="title" style={{ marginBottom: 10 }}> Model Deviation</p>
            <svg id="legend1"> </svg>
          </div>
        </Grid>
        <Grid item container  style={{width:this.props.legend_width,backgroundColor: 'rgb(211, 211, 211,0.5)', padding: 5 }}>
            <p className="title" style={{ marginBottom: 10 }}> Rank Range</p>
            <p style={{ margin:0,fontSize:12 }}>High</p>
            <svg id="legend2" style={{marginTop:3,marginBottom:0}}> </svg>
            <p style={{ margin:0,fontSize:12 }}>Low</p>
        </Grid>
      </Grid>
    );
  }
}
const maptstateToprop = (state) => {
  return {
    selected_instances: state.selected_instances,
    deviation_array: state.deviation_array,
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
    Set_legend_year: (val) => dispatch({ type: "legend_year", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(Legend);