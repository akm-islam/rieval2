import React from 'react';
import "./YearModelSelection.scss";
import { connect } from "react-redux";
import Slider from './Slider'
import Grid from '@material-ui/core/Grid'
function YearModelSelection(props) {
  var handle_year_click = (year) => {
    props.Set_selected_year(year)
  }
  var handle_model_click = (model) => props.Set_time_mode_model(model)
  if(props.dataset=="rur"){var all_models=["MART","RandomFor"]}else{var all_models=props.all_models}
  return (
    <Grid container direction="row" justifyContent="center" alignItems="center" style={{width:'100%',height:76,padding:3}}>
      <Grid item xs={4} style={{marginTop:5, marginLeft: 5,verticalAlign:'baseline' }}><h5 style={{ display: "inline-block", marginRight: 5,marginTop:-4, fontSize: 20,fontWeight:600 }}>Models:</h5>{all_models.map(item => <p className={props.time_mode_model == item ? "years_p_selected years_p" : "years_p"} onClick={() => handle_model_click(item)}>{item}</p>)}</Grid>
      <Grid item xs={6} style={{marginLeft:15,overflow:'scroll'}}><Slider></Slider></Grid>
    </Grid>
  );
}
const maptstateToprop = (state) => {
  return {
    all_models: state.all_models,
    selected_year: state.selected_year,
    years_for_dropdown: state.years_for_dropdown,
    default_models: state.default_models,
    time_mode_model: state.time_mode_model,
    dataset:state.dataset
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
    Set_selected_year: (val) => dispatch({ type: "selected_year", value: val }),
    Set_time_mode_model: (val) => dispatch({ type: "time_mode_model", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(YearModelSelection);

//https://material-ui.com/api/slider/
//https://material-ui.com/components/expansion-panels/
//https://material-ui.com/api/checkbox/
//https://material-ui.com/components/radio-buttons/