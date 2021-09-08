import React, { Component } from 'react';
import * as d3 from 'd3';
import { connect } from "react-redux";

class SlopeChart extends Component {
    constructor(props) {
        super(props);
        this.line_color = null;
        this.state = { height_slope_exp_chart: 700, mouseX: 0, mouseY: 0 }
    }
    componentDidMount() { this.setState({ width: window.innerHeight }) }
    componentDidUpdate(prevProps, prevState) {
        // Draw a circle
        var myCircle = d3.select("#dataviz_brushing")
            .append("svg")
            .append("circle")
            .attr("cx", 200)
            .attr("cy", 200)
            .attr("r", 40)
            .attr("fill", "#69a3b2")

        // Add brushing
        d3.select("#dataviz_brushing")
            .call(d3.brush()                     // Add the brush feature using the d3.brush function
                .extent([[0, 0], [400, 400]])       // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            )

    }
    render() {
        //console.log(parseInt($(".uploader_topbar").height()),parseInt($(".years_model_container").height()),parseInt($(".Modelslider").height()))
        return (
            <div style={{ width: window.innerWidth, height: window.innerHeight }}>
                <svg style={{ width: 400, height: 400 }} id="dataviz_brushing"></svg>
            </div>
        )
    }
}
const maptstateToprop = (state) => {
    return {
        state_range: state.state_range,
        selected_year: state.selected_year
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        Set_clicked_features: (val) => dispatch({ type: "clicked_features", value: val }),
        Set_selected_year: (val) => dispatch({ type: "selected_year", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(SlopeChart);