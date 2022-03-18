import React, { Component } from 'react';
import { connect } from "react-redux";
import * as $ from "jquery"
import * as d3 from 'd3';
import exp_fiscal_CordAscent from "../../../Data/data/fiscal/lime/chart1_data.csv";
import exp_school_CordAscent from "../../../Data/data/school/lime/chart1_data.csv";
import exp_house_CordAscent from "../../../Data/data/house/lime/chart1_data.csv";
import rur_histogram_data from "../../../Data/RUR/RUR_histogram_data.csv";
import * as algo1 from "../../../Algorithms/algo1";
import CreateHistogram from './CreateHistogram'
import CreateBarChart from './CreateBarChart';
import Button from '@material-ui/core/Button';
import { delay } from 'lodash';
class FeatureHistograms extends Component {
    constructor(props) {
        super(props);
        this.state = { feature_data: [] };
    }
    componentDidMount() {
        var filename; if (this.props.dataset == "fiscal") { filename = exp_fiscal_CordAscent } else if (this.props.dataset == "school") { filename = exp_school_CordAscent } else if (this.props.dataset == "house") { filename = exp_house_CordAscent } else if (this.props.dataset == "rur") { filename = rur_histogram_data }
        d3.csv(filename).then(feature_data => {
            this.setState({ feature_data: feature_data,all_instances:{} })
        })
    }
    store_instances=(feature_name,instances)=>{
        var temp={...this.state.all_instances}
        temp[feature_name]=instances
        this.setState({all_instances:temp})
    }
    shouldComponentUpdate(nextProps, nextState) {
        if(typeof(this.state.all_instances)!="undefined" && JSON.stringify(nextState.all_instances)!==JSON.stringify(this.state.all_instances)){
            return false
        }
        return true    
    }
    componentDidUpdate() {
        var self = this
        var filename;
        var selected_instances = d3.range(this.props.state_range[0], this.props.state_range[1] + 1)
        //--------------------
        var number_of_charts = 9
        var features_dict = algo1.features_with_score(this.props.dataset, this.props.default_models, selected_instances, this.props.selected_year, number_of_charts, this.props.rank_data)
        var sorted_features = Object.entries(features_dict).sort((first, second) => second[1] - first[1]).map(element => element[0])
        //--------------------
        if (this.props.dataset == "fiscal") { filename = exp_fiscal_CordAscent } else if (this.props.dataset == "school") { filename = exp_school_CordAscent } else if (this.props.dataset == "rur") { filename = rur_histogram_data }
        //--------------------------------Iterate through each features
        const margin = { top: 10, right: 5, bottom: 50, left: 5 }; // Histogram
        //const margin = { top: 10, right: 5, bottom: 40, left: 5 } // Barchart
        d3.select(".feature_histograms_container").selectAll(".feature").data(sorted_features, d => d).join("svg").attr("class", 'feature')
            //.attr("width", feature_width)
            //.attr("y", (d, feature_index) => feature_height * feature_index)
            .attr("add_histogram", function (d, feature_index) {
                var histogram_data = []
                if (!isNaN(self.state.feature_data[0][d])) {
                    self.state.feature_data.forEach(element => {
                        if (element["1-qid"] == self.props.selected_year) {
                            var temp_dict = {}
                            temp_dict["x"] = parseInt(element['two_realRank'])
                            temp_dict["y"] = parseFloat(element[d])
                            histogram_data.push(temp_dict)
                        }
                    });
                    CreateHistogram(histogram_data, d3.select(this), d, feature_index, sorted_features.length,self.store_instances)
                }
                else {
                    self.state.feature_data.forEach(element => {
                        if (element["1-qid"] == self.props.selected_year) {
                            var temp_dict = {}
                            temp_dict["x"] = parseInt(element['two_realRank'])
                            temp_dict["y"] = element[d]
                            histogram_data.push(temp_dict)
                        }})
                    CreateBarChart(histogram_data, d3.select(this), d, feature_index, sorted_features.length,self.store_instances,self.state.all_instances)
                }
            })
            .attr('id',d=>d)
            //.call(d3.brush().extent([[0, margin.top], [400, 65]]))
        //--------------------------------Iterate through each features
    }
    render() {
        return (
            this.props.original_data != null ? <div style={{display:'relative', width: 400,marginTop:-8 }}>
                <Button fullWidth style={{margin:0,position:'sticky',top:0,backgroundColor:"gray",borderRadius:0}} onClick={()=>{
                    var selected_instances=[...new Set([].concat(...Object.values(this.state.all_instances)))]
                    var filtered_instances=selected_instances.filter(item => item>=this.props.state_range[0] && item<=this.props.state_range[1])
                    this.props.handleClose() // This will close the select menu
                    if(filtered_instances.length==0){alert("No instance is available withing the selected range!")}
                    this.props.Set_histogram_data([...filtered_instances])
                }}> Update </Button>
                <div className="feature_histograms_container_div" style={{display:'relative', width: 400, height: window.innerHeight, overflow: "scroll",marginTop:-8 }}>
                <svg className="feature_histograms_container" style={{ width: "100%", padding: 10 }}> </svg>
                </div>
            </div> : null
        );
    }
}
const maptstateToprop = (state) => {
    return {
        dataset: state.dataset,
        deviate_by: state.deviate_by,
        state_range: state.state_range,
        default_models: state.default_models,
        selected_year: state.selected_year,
        sparkline_data: state.sparkline_data,
        show: state.show,
        mode: state.mode,
        original_data: state.original_data,
        rank_data: state.rank_data,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        Set_slider_max: (val) => dispatch({ type: "slider_max", value: val }),
        Set_state_range: (val) => dispatch({ type: "state_range", value: val }),
        Set_histogram_data: (val) => dispatch({ type: "histogram_data", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(FeatureHistograms);

//https://material-ui.com/api/slider/
//https://material-ui.com/components/expansion-panels/
//https://material-ui.com/api/checkbox/
//https://material-ui.com/components/radio-buttons/