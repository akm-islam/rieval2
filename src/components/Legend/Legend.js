import React, { Component, PureComponent } from 'react';
import * as d3 from 'd3';
import * as $ from 'jquery';
import { connect } from "react-redux";
class Legend extends Component {
  constructor(props) {
    super(props);
    this.state = { } // This is the default height
  }
  componentDidMount() {this.setState({rand:10})}
  componentDidUpdate() {
    console.log('deviation_array',this.props.deviation_array,$('.legend_container').height(),$('.legend_container').width())
    var legend_container_width=$('.legend_container').width()
    var legend_container_height=$('.legend_container').height()
    var legend1_height=legend_container_height/3
    var legend1_rScale=d3.scaleLinear().domain(d3.extent(this.props.deviation_array)).range([2,5])
    var legend1_yScale=d3.scaleLinear().domain(d3.extent(this.props.deviation_array)).range([15,legend1_height-5])
    var legend1_ticks=legend1_yScale.ticks(7)
    //console.log('deviation_array',legend1_ticks)
    var legend1_svg = d3.select('#legend1').attr('width',legend_container_width).attr('height',legend_container_height/2)
    legend1_svg.selectAll('.legend1_circles').data(legend1_ticks).join('circle').attr('class','legend1_circles').attr('cx',10).attr('cy',d=>legend1_yScale(d)).attr('r',d=>legend1_rScale(d)).attr('fill','red')
    legend1_svg.selectAll('.legend1_text').data(legend1_ticks).join('text').attr('class','legend1_text').attr('x',20).attr('y',d=>legend1_yScale(d)).text(d=>d).attr('dominant-baseline','middle').attr('font-size',10)
  }
  
  render() {
    return (
      <div className="legend_container" style={{ height:'100%',width:'100%'}}>
      <svg id="legend1"> </svg>
      <svg id="legend2"> </svg>
      </div>
    );
  }
}

const maptstateToprop = (state) => {
  return {
    deviation_array:state.deviation_array,
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
    Set_legend_year: (val) => dispatch({ type: "legend_year", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(Legend);