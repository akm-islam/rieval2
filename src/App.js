import React, { Component } from 'react';
//------------------------------------------------All datasets imports
import fiscal from "./Data/fiscal.csv";
import school from "./Data/school.csv";
import house from "./Data/house.csv";

import fiscal_rank from "./Data/data/fiscal/lime/fiscal_rank.csv";
import fiscal_lime from "./Data/data/fiscal/lime/fiscal_lime.csv";

import school_rank from "./Data/data/school/lime/school_rank.csv";
import school_lime from "./Data/data/school/lime/school_lime.csv";

import house_rank from "./Data/data/house/lime/house_rank.csv";
import house_lime from "./Data/data/house/lime/house_lime.csv";
//import fiscal from "./Data/data/fiscal/lime/fiscal.json";
//import house from "../Data/data/house/lime/house.json";
//------------------------------------------------All datasets imports ends here
import "./App.scss";
import * as d3 from 'd3';
import * as algo1 from "./Algorithms/algo1";
import SlopeChart from "./components/Slopecharts/Model/SlopeChart"
import RangeChart from "./components/Slopecharts/Range/RangeChart"
import YearChart from "./components/Slopecharts/Time/YearChart"
import TopBar from "./components/TopBar/TopBar"
import { Row, Col } from 'reactstrap';
import Sidebar from "./components/Sidebar/Sidebar";
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import * as $ from 'jquery';
import { connect } from "react-redux";
import Grid from '@material-ui/core/Grid';
import "./components/Slopecharts/SlopeChart.css"
import Replay from "../src/components/Slopecharts/Replay"
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
  handleradioChange = (event) => {
    this.setState({ show: ["Slope charts", "Rankings", "Explanation"] })
    this.props.Set_slider_and_feature_value({ 'Rank range': 1, 'Feature': 0 })
    this.props.Set_clicked_items_in_slopechart([])
    this.props.Set_state_range([1, 15])
    this.props.Set_histogram_data([])
    this.props.Set_mode("Model")
    this.props.Set_range_mode_range1([5, 35])
    this.props.Set_range_mode_range2([15, 35])
    this.props.Set_time_mode_range([5, 35])
    if (event.target.value == 'Fiscal Dataset') {
      this.setState({ dataset: 'fiscal' })
      this.props.Set_dataset('fiscal')
      this.dataprocessor("fiscal")
    }
    else if (event.target.value == 'House Dataset') {
      this.setState({ dataset: 'house' })
      this.props.Set_dataset('house')
      this.dataprocessor("house")
    }
    else {
      this.setState({ dataset: 'school' })
      this.props.Set_dataset('school')
      this.dataprocessor("school")
    }
  };

  task2 = () => {
    if (this.props.clicked_items_in_slopechart.length > 0) {
      d3.selectAll('circle,.datapoint').attr('opacity', this.props.config.reduced_opacity)
    }
    this.props.clicked_items_in_slopechart.map(idName => d3.selectAll('#' + idName).attr('opacity', 1))
  }

  textClickHandler_original = (state_name) => { // state_name is set as the id of each element
    var idName = state_name.replace(/ +/g, "")

    //----Whatever properties are changed due to click change back here for the original 
    d3.selectAll('#' + idName).filter(d3.matcher('line')).style('stroke-width', 1)
    //----Whatever properties are changed due to click change back here for the original

    //-----Store the clicked items
    var clicked_items_in_slopechart = [...this.props.clicked_items_in_slopechart]
    if (clicked_items_in_slopechart.includes(idName)) {
      clicked_items_in_slopechart = clicked_items_in_slopechart.filter(element => element != idName)
    }
    else { clicked_items_in_slopechart.push(idName) }
    this.props.Set_clicked_items_in_slopechart(clicked_items_in_slopechart)
    //-----Store the clicked items ends here

    if (clicked_items_in_slopechart.length > 0) {
      d3.selectAll('circle,.datapoint').attr('opacity', this.props.config.reduced_opacity)
      this.props.clicked_items_in_slopechart.map(idName => {
        d3.selectAll('#' + idName).attr('opacity', 1)
        d3.selectAll('#' + idName).filter(d3.matcher('line')).style('stroke-width', 3)
      })
    }
    else {
      d3.selectAll('circle,.datapoint').attr('opacity', 1)
    }

    //d3.selectAll('.line1,.line2').attr('opacity',1)
  }

  //--------- data processor processes data for initial render
  dataprocessor = (dataset_name) => {
    if (dataset_name == "school") { this.process_data(school, school_rank, school_lime, dataset_name) }
    if (dataset_name == "fiscal") { this.process_data(fiscal, fiscal_rank, fiscal_lime, dataset_name) }
    if (dataset_name == "house") { this.process_data(house, house_rank, house_lime, dataset_name) }
  }
  process_data = (slopechart_data_filename, rank_data_filename, lime_data_filename, dataset_name) => {
    var self = this
    //-------------
    d3.csv(slopechart_data_filename).then(original_data => {

      var grouped_by_year_data = algo1.groupby_year(original_data).years
      var sparkline_data = algo1.groupby_year(original_data).sparkline_data
      var years_for_dropdown = Object.keys(grouped_by_year_data)
      self.props.Set_sparkline_data(sparkline_data)
      self.props.Set_slider_max(grouped_by_year_data[years_for_dropdown[0]].length)
      self.setState({ years_for_dropdown: years_for_dropdown })
      self.props.Set_years_for_dropdown(years_for_dropdown)
      self.props.Set_time_mode_year1(years_for_dropdown[0])
      self.props.Set_time_mode_year2(years_for_dropdown[1])
      self.props.Set_legend_year(years_for_dropdown[0])
      self.setState({ ref_year: years_for_dropdown[0] })
      self.props.Set_grouped_by_year_data(grouped_by_year_data)
      self.setState({ grouped_by_year_data: grouped_by_year_data }, () => {
        self.appHandleChange(original_data, "original");
      })
      self.setState({ original_data: original_data })
      self.props.Set_original_data(original_data)
      if (dataset_name == 'fiscal') {
        self.props.Set_selected_year("2011")
        var all_models = ["MART", "RandomFor", "LinearReg", "CordAscent", "LambdaMART", "LambdaRank", "ListNet", "RankBoost", "RankNet"]
        var temp_Models = algo1.sort(this.props.sort_by, this.props.state_range, all_models, "2011", grouped_by_year_data)[0];
        var default_model_scores = algo1.sort(this.props.sort_by, this.props.state_range, all_models, "2011", grouped_by_year_data)[1];
      }
      else {
        self.props.Set_selected_year("2016")
        var all_models = ["MART", "RandomFor", "LinearReg", "CordAscent", "LambdaMART", "LambdaRank", "ListNet", "RankBoost", "RankNet"]
        var temp_Models = algo1.sort(this.props.sort_by, this.props.state_range, all_models, "2016", grouped_by_year_data)[0];
        var default_model_scores = algo1.sort(this.props.sort_by, this.props.state_range, all_models, "2016", grouped_by_year_data)[1];
      }
      this.props.Set_default_model_scores(default_model_scores)
      this.props.Set_defualt_models(temp_Models.slice(1, 3))
      this.props.Set_pop_over_models(temp_Models.slice(1, 3))

    })
    //-------------
    d3.csv(rank_data_filename).then(data => {
      var nested_data = {}
      d3.nest().key(function (d) { return d.model; }).entries(data).map(item => {
        nested_data[item.key] = item.values
      })
      self.props.Set_rank_data(nested_data)
    })
    //-------------
    d3.csv(lime_data_filename).then(data => {
      var nested_data = {}
      d3.nest().key(function (d) { return d.model; }).entries(data).map(item => {
        nested_data[item.key] = item.values
      })
      self.props.Set_lime_data(nested_data)
    })

  }
  //---------
  appHandleChange = (data, type) => { // get the resopnses from Sidebar
    this.setState({ features_dict: {} })
    var temp_Models = this.props.defualt_models
    var temp_show = this.state.show
    var year = this.props.selected_year
    if (type == 'year_changed') { this.props.Set_selected_year(data) } // This is called when circles on the sparklines are clicked
    if (type == 'original') { var original_data = data } else { original_data = this.props.original_data }
    //-----------------Handle show changes here
    if (type == "show_checkboxChanged") {
      if (temp_show.includes(data)) { temp_show = temp_show.filter(element => element != data) }
      else { temp_show.push(data) }
      this.setState({ show: temp_show })
    }
    temp_Models = algo1.sort(this.props.sort_by, this.props.state_range, temp_Models, this.props.selected_year, this.state.grouped_by_year_data)[0];
    this.setState({ defualt_models: temp_Models })
    //--------------------------------------------------------------------------------------------------------------All types are handled here end
    var prev_year;
    if (parseInt(year) == this.state.years_for_dropdown[0]) { prev_year = parseInt(year) } else { prev_year = parseInt(year) - 1 }

  }

  buttonclickHandler = (value, type) => {
    setTimeout(() => { this.setState({ random: Math.random() }) }, 500);
    type = "button" ? this.setState({ view_data: value }) : null
    type = "form" ? this.setState({ view_data: value }) : null
  }
  //-----------------Models are generated ends here
  componentDidMount() {
    this.dataprocessor("fiscal")
  }
  shouldComponentUpdate() {
    return true;
  }
  render() {
    return (
      <div key={this.state.random}>
        <Replay key={Math.random()}></Replay>
        <Row>
          <div style={{ width: 207 }} className="Sidebar">
            {this.props.selected_year != null ?
              <Sidebar view_data={this.state.view_data} appHandleChange={this.appHandleChange}
                dataset={this.props.dataset} sort_by={this.props.sort_by} chart_scale_type={this.props.chart_scale_type}>
              </Sidebar> : null}
          </div>
          <Col style={{ width: window.innerWidth - 200, minHeight: window.innerHeight }} className="container_header_and_components">
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
                          {['Fiscal Dataset', 'School Dataset'].map((value) => {
                            return <FormControlLabel value={value} control={<Radio />} label={value} />
                          })}
                        </RadioGroup>
                        <Button type="submit" variant="outlined" color="primary">Load</Button>
                      </FormControl>
                    </form>
                  </div></Row>
                : null}
              {this.state.view_data == true ? <Row className="Topbar_container"><TopBar key={this.props.selected_year} appHandleChange={this.appHandleChange} tracking={this.props.tracking}></TopBar></Row> : null}
            </div>
            {this.state.view_data == true ?
              <Grid container direction="row" justify="flex-start" alignItems="center" >
                <Grid container spacing={0} direction="row" justify="space-evenly" className="slopechart_container" key={this.props.defualt_models.length} style={{ height: this.props.mode == "Time" ? window.innerHeight - $('.myheader').height() - 5 : window.innerHeight - $('.uploader_topbar').height() - 5, marginLeft: 5, width: window.innerWidth - ($('.Sidebar_parent').width() + $('.legend').width() + 15) }}>
                  {this.props.mode == "Model" && this.state.grouped_by_year_data != null && this.props.original_data != null && this.props.lime_data != null ?
                    <SlopeChart task2={this.task2} textClickHandler_original={this.textClickHandler_original} appHandleChange={this.appHandleChange}
                      model_name={"RandomFor"} grouped_by_year_data={this.state.grouped_by_year_data} cmodel={this.state.cmodel} ref_year={this.state.ref_year}>
                    </SlopeChart> : null}

                  {this.props.mode == "Range" ?
                    ["Range1", "Range2"].map((model_name, i) => {
                      return this.state.grouped_by_year_data != null && this.props.original_data != null ?
                        <RangeChart task2={this.task2} textClickHandler_original={this.textClickHandler_original} myindex={i} key={model_name + "slopechart" + this.state.show[2] + this.props.mode} chart_scale_type={this.props.chart_scale_type} histogram_data={this.state.histogram_data} original_data={this.props.original_data} sparkline_data={this.props.sparkline_data}
                          appHandleChange={this.appHandleChange} deviate_by={this.props.deviate_by} model_name={model_name} grouped_by_year_data={this.state.grouped_by_year_data}
                          cmodel={this.state.cmodel} ref_year={this.state.ref_year} tracking={this.props.tracking}>
                        </RangeChart>
                        : null
                    }) : null}
                  {this.props.mode == "Time" && this.props.time_mode_year1 != "Null" && this.props.time_mode_year2 != "Null" ?
                    ["Year1", "Year2"].map((model_name, i) => {
                      return this.state.grouped_by_year_data != null && this.props.original_data != null ?
                        <YearChart task2={this.task2} textClickHandler_original={this.textClickHandler_original} myindex={i} key={model_name + "slopechart" + this.state.show[2]} chart_scale_type={this.props.chart_scale_type} histogram_data={this.state.histogram_data} original_data={this.props.original_data} sparkline_data={this.props.sparkline_data}
                          appHandleChange={this.appHandleChange} deviate_by={this.props.deviate_by} model_name={model_name} grouped_by_year_data={this.state.grouped_by_year_data}
                          cmodel={this.state.cmodel} ref_year={this.state.ref_year} tracking={this.props.tracking}>
                        </YearChart> : null
                    }) : null}
                </Grid>
                {
                  //            <div className="legend" style={{height:window.innerHeight/2,width:40}}><p>High</p><svg></svg><p>Low</p></div>

                }
              </Grid> : null}
          </Col>
        </Row>
      </div>
    );
  }
  makeArr = () => {
    var startValue = this.props.state_range[0];
    var stopValue = this.props.state_range[1];
    var arr = [];
    for (var i = startValue; i <= stopValue; i++) {
      arr.push(i);
    }
    //hi
    return arr;
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