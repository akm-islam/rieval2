import React, { Component } from 'react';
import { connect } from "react-redux";
import * as $ from "jquery"
import * as d3 from 'd3';
import exp_fiscal_CordAscent from "../../Data/data/fiscal/lime/chart1_data.csv";
import exp_school_CordAscent from "../../Data/data/school/lime/chart1_data.csv";
import exp_house_CordAscent from "../../Data/data/house/lime/chart1_data.csv";
import * as algo1 from "../../Algorithms/algo1";
import CreateHistogramNum from './CreateHistogram'
class FeatureHistograms extends Component {
    constructor(props) {
        super(props);
        this.state = { feature_data: [] };
    }
    componentDidMount() {
        var filename; if (this.props.dataset == "fiscal") { filename = exp_fiscal_CordAscent } else if (this.props.dataset == "school") { filename = exp_school_CordAscent } else if (this.props.dataset == "house") { filename = exp_house_CordAscent }
        d3.csv(filename).then(feature_data => {
            this.setState({ feature_data: feature_data })
        })
    }
    componentDidUpdate() {
    var self = this
    var filename;
    var selected_instances = d3.range(this.props.state_range[0], this.props.state_range[1] + 1)
    //--------------------
    var number_of_charts = 9
    var features_dict = algo1.features_with_score(this.props.dataset, this.props.defualt_models, selected_instances, this.props.selected_year, number_of_charts, this.props.rank_data)
    var sorted_features = Object.entries(features_dict).sort((first, second) => second[1] - first[1]).map(element => element[0])
    //--------------------
    if (this.props.dataset == "fiscal") { filename = exp_fiscal_CordAscent } else if (this.props.dataset == "school") { filename = exp_school_CordAscent }
    //--------------------------------Iterate through each features
    d3.select(".feature_histograms_container").selectAll(".feature").data(sorted_features, d => d).join("svg").attr("class", 'feature')
    //.attr("width", feature_width)
    //.attr("y", (d, feature_index) => feature_height * feature_index)
        .attr("add_histogram",function(d,feature_index){
            var data = []
            self.state.feature_data.forEach(element => {
                if (element["1-qid"] == self.props.selected_year) {
                    var temp_dict = {}
                    temp_dict["x"] = parseInt(element['two_realRank'])
                    temp_dict["y"] = parseFloat(element[d])
                    data.push(temp_dict)
                }
            });
            if(!isNaN(self.state.feature_data[0][d])){
                CreateHistogramNum(data,d3.select(this),d,feature_index)
            }
            else{console.log("Categorical")}
        })

        //--------------------------------Iterate through each features
    }
    render() {
        return (
            this.props.original_data != null ? <div style={{ width: 400, height: window.innerHeight, overflow: "scroll" }}>
                <svg className="feature_histograms_container" style={{ width: "100%", height: "100%",padding:10 }}> </svg>
            </div> : null
        );
    }
}
const maptstateToprop = (state) => {
    return {
        dataset: state.dataset,
        deviate_by: state.deviate_by,
        state_range: state.state_range,
        defualt_models: state.defualt_models,
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
        Set_defualt_models: (val) => dispatch({ type: "defualt_models", value: val }),
        Set_sparkline_data: (val) => dispatch({ type: "sparkline_data", value: val }),
        Set_slider_max: (val) => dispatch({ type: "slider_max", value: val }),
        Set_years_for_dropdown: (val) => dispatch({ type: "years_for_dropdown", value: val }),
        Set_selected_year: (val) => dispatch({ type: "selected_year", value: val }),
        Set_ref_year: (val) => dispatch({ type: "ref_year", value: val }),
        Set_original_data: (val) => dispatch({ type: "original_data", value: val }),
        Set_state_range: (val) => dispatch({ type: "state_range", value: val }),
        Set_deviate_by: (val) => dispatch({ type: "deviate_by", value: val }),
        Set_show: (val) => dispatch({ type: "show", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(FeatureHistograms);

//https://material-ui.com/api/slider/
//https://material-ui.com/components/expansion-panels/
//https://material-ui.com/api/checkbox/
//https://material-ui.com/components/radio-buttons/