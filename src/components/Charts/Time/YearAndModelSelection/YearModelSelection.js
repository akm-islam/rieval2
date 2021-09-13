import React from 'react';
import "./YearModelSelection.scss";
import { connect } from "react-redux";
import Slider from '../Slider'
function YearModelSelection(props) {
  var handle_year_click = (year) => {
    props.Set_selected_year(year)
  }
  var handle_model_click = (model) => props.Set_range_mode_model(model)
  return (
    <div className="topbar" style={{ width: "100%", marginBottom: 2, display: 'flex', justifyContent: "center", margin: 0 }}>
      <div style={{ marginLeft: 5,width:'50%' }}><h5 style={{ display: "inline-block", marginLeft: 0, fontSize: 15 }}>Models:</h5>{props.all_models.map(item => <p className={props.range_mode_model == item ? "years_p_selected years_p" : "years_p"} onClick={() => handle_model_click(item)}>{item}</p>)}</div>
      <div style={{ width: "50%"}}><Slider></Slider></div>
    </div>
  );
}
const maptstateToprop = (state) => {
  return {
    all_models: state.all_models,
    selected_year: state.selected_year,
    years_for_dropdown: state.years_for_dropdown,
    defualt_models: state.defualt_models,
    range_mode_model: state.range_mode_model,
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
    Set_selected_year: (val) => dispatch({ type: "selected_year", value: val }),
    Set_range_mode_model: (val) => dispatch({ type: "range_mode_model", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(YearModelSelection);

//https://material-ui.com/api/slider/
//https://material-ui.com/components/expansion-panels/
//https://material-ui.com/api/checkbox/
//https://material-ui.com/components/radio-buttons/