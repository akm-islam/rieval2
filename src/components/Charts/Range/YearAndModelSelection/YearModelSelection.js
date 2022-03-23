import React from 'react';
import "./YearModelSelection.scss";
import { connect } from "react-redux";
function YearModelSelection(props) {
  var handle_year_click = (year) => {
    props.Set_selected_year(year)
  }
  var handle_model_click=(model)=>props.Set_range_mode_model(model)
  if(props.dataset=="rur"){var all_models=["MART","RandomFor"]}else{var all_models=props.all_models}
  return (
    <div className="range_topbar" style={{width:"100%",marginBottom:2,display:'flex',justifyContent: "center",margin:0}}>
    <div ><h5 style={{ display: "inline-block", marginLeft: 0,marginRight:3,fontSize:16,fontWeight:600 }}>Years: </h5>{props.years_for_dropdown.map(item => <p className={props.selected_year==item ? "years_p_selected years_p" : "years_p"} onClick={() => handle_year_click(item)}>{item}</p>)}</div>
    <div style={{marginLeft:20}}><h5 style={{ display: "inline-block", marginLeft: 0,marginRight:3,fontSize:16,fontWeight:600}}>Models:</h5>{all_models.map(item => <p className={props.range_mode_model==item ? "years_p_selected years_p" : "years_p"} onClick={() => handle_model_click(item)}>{item}</p>)}</div>
    </div>
  );
}
const maptstateToprop = (state) => {
  return {
    all_models:state.all_models,
    selected_year: state.selected_year,
    years_for_dropdown: state.years_for_dropdown,
    default_models: state.default_models,
    range_mode_model:state.range_mode_model,
    dataset:state.dataset,
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