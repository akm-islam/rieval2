import React from 'react';
import "./YearModelSelection.scss";
import { connect } from "react-redux";
import * as d3 from 'd3';
import * as algo1 from "../../../../Algorithms/algo1";
function YearModelSelection(props) {
  var handle_year_click = (year) => {
    props.Set_selected_year(year)
    sortModels(year)
  }
  var handle_model_click = (model) => {
    if (props.default_models.includes(model)) {
      props.Set_default_models(props.default_models.filter(item => item != model))
    }
    else {
      var temp_Models = algo1.sort(props.sort_by, props.state_range, [...props.default_models, model], props.selected_year, props.grouped_by_year_data)[0];
      var default_model_scores = algo1.sort(props.sort_by, props.state_range, [...props.default_models, model], props.selected_year, props.grouped_by_year_data)[1];
      props.Set_default_model_scores(default_model_scores)
      props.Set_default_models([...temp_Models])
    }
  }
  const sortModels = (selected_year) => {
    var temp_Models = algo1.sort(props.sort_by, props.state_range, props.default_models, selected_year, props.grouped_by_year_data)[0];
    var default_model_scores = algo1.sort(props.sort_by, props.state_range, props.default_models, selected_year, props.grouped_by_year_data)[1];
    props.Set_default_model_scores(default_model_scores)
    props.Set_default_models([...temp_Models])
    console.log(temp_Models, default_model_scores, 'temp_model')
  };
  console.log(props.dataset,"dataset")
  if(props.dataset=="rur"){var all_models=["MART","RandomFor"]}else{var all_models=props.all_models}
  return (
    <div className="model_topbar" style={{ width: "100%", marginBottom: 2, display: 'flex', justifyContent: "center", margin: 0 }}>
      <div ><h5 style={{ display: "inline-block", marginLeft: 0, marginRight: 3, fontSize: 16, fontWeight: 600 }}>Years: </h5>{props.years_for_dropdown.map(item => <p className={props.selected_year == item ? "years_p_selected years_p" : "years_p"} onClick={() => handle_year_click(item)}>{item}</p>)}</div>
      <div style={{ marginLeft: 20 }}><h5 style={{ display: "inline-block", marginLeft: 0, marginRight: 3, fontSize: 16, fontWeight: 600 }}>Models:</h5>{all_models.map(item => <p modelName={item} className={props.default_models.includes(item) ? "years_p_selected years_p model_p" : "years_p model_p"} onClick={() => handle_model_click(item)}>{item}</p>)}</div>
    </div>
  );
}
const maptstateToprop = (state) => {
  return {
    state_range: state.state_range,
    all_models: state.all_models,
    selected_year: state.selected_year,
    years_for_dropdown: state.years_for_dropdown,
    default_models: state.default_models,
    sort_by: state.sort_by,
    grouped_by_year_data: state.grouped_by_year_data,
    dataset:state.dataset
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
    Set_selected_year: (val) => dispatch({ type: "selected_year", value: val }),
    Set_default_models: (val) => dispatch({ type: "default_models", value: val }),
    Set_default_model_scores: (val) => dispatch({ type: "default_model_scores", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(YearModelSelection);

//https://material-ui.com/api/slider/
//https://material-ui.com/components/expansion-panels/
//https://material-ui.com/api/checkbox/
//https://material-ui.com/components/radio-buttons/