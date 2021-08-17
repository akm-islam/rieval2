import React, { Component } from 'react';
//------------------------------------------------All datasets imports ends here
import { Row, Col } from 'reactstrap';

import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import * as $ from 'jquery';
import { connect } from "react-redux";
import Grid from '@material-ui/core/Grid';

class App extends Component {
  constructor(props) {
    super(props);
    // mydata is original data
    this.state = {
      random: 10,
      original_data: null, grouped_by_year_data: null, show: ["Slope charts", "Rankings", "Explanation"], view_data: 1,
      histogram_data: [], ref_year: null, features_dict: {}, features_voted: null, Legend_ready_to_vis: null, legend_model: "CordAscent",
    };
  }
  buttonclickHandler = (value, type) => {
    setTimeout(() => { this.setState({ random: Math.random() }) }, 500);
    type = "button" ? this.setState({ view_data: value }) : null
    type = "form" ? this.setState({ view_data: value }) : null
  }
  shouldComponentUpdate() {
    return true;
  }
  render() {
    return (
      <div className="uploader_topbar">
        <Grid container spacing={0} className="myheader" style={{ left: $('.Sidebar').width() }}>
          <Grid item style={{ borderRight: "1px dashed #eaeaea", width: 100 }}><Button onClick={() => this.buttonclickHandler(1, "button")}>View Data</Button></Grid>
          <Grid item style={{ borderRight: "1px dashed #eaeaea", width: 120 }}><Button onClick={() => this.buttonclickHandler(0, "button")}>Load Data</Button></Grid>
        </Grid>
        {this.state.view_data == false ?
          <Row className="Topbar_container">
            <div className="load">
              <form onSubmit={() => this.buttonclickHandler(1, "form")}>
                <FormControl component="fieldset">
                  <FormLabel component="legend"></FormLabel>
                  <RadioGroup aria-label="gender" name="gender1" onChange={this.handleradioChange}>
                    {['Fiscal Dataset', 'School Dataset', 'House Dataset'].map((value) => {
                      return <FormControlLabel value={value} control={<Radio />} label={value} />
                    })}
                  </RadioGroup>
                  <Button type="submit" variant="outlined" color="primary">Load</Button>
                </FormControl>
              </form>
            </div></Row>
          : null}
      </div>
    );
  }
}
const maptstateToprop = (state) => {
  return {
    tracking: state.tracking,
    state_range: state.state_range,
    deviate_by: state.deviate_by,
    defualt_models: state.defualt_models,
    sparkline_data: state.sparkline_data,
    selected_year: state.selected_year,
    mode: state.mode,
    range_mode_model: state.range_mode_model,
    original_data: state.original_data,
    time_mode_model: state.time_mode_model,
    chart_scale_type: state.chart_scale_type,
    dataset: state.dataset,
    histogram_data: state.histogram_data,
    sort_by: state.sort_by,
    time_mode_year1: state.time_mode_year1,
    time_mode_year2: state.time_mode_year2,
    popup_chart_data: state.popup_chart_data,
    clicked_items_in_slopechart: state.clicked_items_in_slopechart,
    config: state.config,
    lime_data: state.lime_data,
    rank_data: state.rank_data,
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
    Set_dataset: (val) => dispatch({ type: "dataset", value: val }),
    Set_defualt_models: (val) => dispatch({ type: "defualt_models", value: val }),
    Set_sparkline_data: (val) => dispatch({ type: "sparkline_data", value: val }),
    Set_slider_max: (val) => dispatch({ type: "slider_max", value: val }),
    Set_years_for_dropdown: (val) => dispatch({ type: "years_for_dropdown", value: val }),
    Set_selected_year: (val) => dispatch({ type: "selected_year", value: parseInt(val) }),
    Set_ref_year: (val) => dispatch({ type: "ref_year", value: val }),
    Set_original_data: (val) => dispatch({ type: "original_data", value: val }),
    Set_grouped_by_year_data: (val) => dispatch({ type: "grouped_by_year_data", value: val }),
    Set_slider_and_feature_value: (val) => dispatch({ type: "slider_and_feature_value", value: val }),
    Set_clicked_items_in_slopechart: (val) => dispatch({ type: "clicked_items_in_slopechart", value: val }),
    Set_histogram_data: (val) => dispatch({ type: "histogram_data", value: val }),
    Set_state_range: (val) => dispatch({ type: "state_range", value: val }),
    Set_legend_year: (val) => dispatch({ type: "legend_year", value: val }),

    Set_mode: (val) => dispatch({ type: "mode", value: val }),
    Set_range_mode_range1: (val) => dispatch({ type: "range_mode_range1", value: val }),
    Set_range_mode_range2: (val) => dispatch({ type: "range_mode_range2", value: val }),
    Set_time_mode_range: (val) => dispatch({ type: "time_mode_range", value: val }),
    Set_time_mode_year1: (val) => dispatch({ type: "time_mode_year1", value: val }),
    Set_time_mode_year2: (val) => dispatch({ type: "time_mode_year2", value: val }),

    Set_rank_data: (val) => dispatch({ type: "rank_data", value: val }),
    Set_lime_data: (val) => dispatch({ type: "lime_data", value: val }),
    Set_pop_over_models: (val) => dispatch({ type: "pop_over_models", value: val }),
    Set_default_model_scores: (val) => dispatch({ type: "default_model_scores", value: val }),

  }
}
export default connect(maptstateToprop, mapdispatchToprop)(App);