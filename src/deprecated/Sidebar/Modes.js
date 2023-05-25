import React from 'react';
import "./Sidebar.scss";
import * as $ from 'jquery';
import Histograms from "./HistogramContainer"
import { connect } from "react-redux";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
function Modes(props) {
    //-----------------------------------------------------------------
    return (
        <div style={{ borderTop: "1px solid #eaeaea" }}>
            <p className="title_show" style={{ marginBottom: 8 }}>Compare:</p>
            <Autocomplete className="autocomplete_mode" style={{ border: "1px solid grey", borderRadius: 0, paddingTop: 0, paddingBottom: 0, marginLeft: 5, marginRight: 30, width: $('.Sidebar').width() - 10 }}
                defaultValue={"Models"}
                id="debug"
                debug
                options={["Models", "Ranges", "Time"]}
                renderInput={(params) => (
                    <TextField {...params} label="" margin="normal" fullWidth={true} InputProps={{ ...params.InputProps, disableUnderline: true }} />
                )}
                onChange={(event, val) => {
                    var value = val.replace('s', "")
                    props.Set_mode(value)
                    props.Set_clicked_items_in_slopechart([])
                }
                }
            />
        </div>
    );
}
const maptstateToprop = (state) => {
    return {
        selected_year: state.selected_year,
        state_range: state.state_range,
        mode: state.mode, // Model mode model
        slider_max: state.slider_max,
        range_mode_model: state.range_mode_model, // Range mode model
        range_mode_range1: state.range_mode_range1,
        range_mode_range2: state.range_mode_range2,
        time_mode_model: state.time_mode_model, // Time mode model
        time_mode_range: state.time_mode_range,
        time_mode_year1: state.time_mode_year1,
        time_mode_year2: state.time_mode_year2,
        years_for_dropdown: state.years_for_dropdown,
        dataset: state.dataset,
        default_models: state.default_models,
        slider_and_feature_value: state.slider_and_feature_value,
        sort_by: state.sort_by,
        grouped_by_year_data: state.grouped_by_year_data,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        Set_slider_max: (val) => dispatch({ type: "slider_max", value: val }),
        Set_years_for_dropdown: (val) => dispatch({ type: "years_for_dropdown", value: val }),
        Set_state_range: (val) => dispatch({ type: "state_range", value: val }),
        Set_mode: (val) => dispatch({ type: "mode", value: val }),
        Set_range_mode_model: (val) => dispatch({ type: "range_mode_model", value: val }),
        Set_time_mode_model: (val) => dispatch({ type: "time_mode_model", value: val }),
        Set_range_mode_range1: (val) => dispatch({ type: "range_mode_range1", value: val }),
        Set_range_mode_range2: (val) => dispatch({ type: "range_mode_range2", value: val }),
        Set_time_mode_range: (val) => dispatch({ type: "time_mode_range", value: val }),
        Set_time_mode_year1: (val) => dispatch({ type: "time_mode_year1", value: val }),
        Set_time_mode_year2: (val) => dispatch({ type: "time_mode_year2", value: val }),
        Set_histogram_data: (val) => dispatch({ type: "histogram_data", value: val }),
        Set_slider_and_feature_value: (val) => dispatch({ type: "slider_and_feature_value", value: val }),
        Set_clicked_items_in_slopechart: (val) => dispatch({ type: "clicked_items_in_slopechart", value: val }),
        Set_changed: (val) => dispatch({ type: "changed", value: val }),
        Set_pop_over_models: (val) => dispatch({ type: "pop_over_models", value: val }),
        Set_default_models: (val) => dispatch({ type: "default_models", value: val }),
        Set_default_model_scores: (val) => dispatch({ type: "default_model_scores", value: val }),

    }
}
export default connect(maptstateToprop, mapdispatchToprop)(Modes);