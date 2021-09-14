import React from 'react';
import "./YearModelSelection.scss";
import { connect } from "react-redux";
function YearModelSelection(props) {
  var handle_year_click = (year) => {
    props.Set_selected_year(year)
  }
  var handle_model_click=(model)=>{
      if (props.default_models.includes(model)) {
        props.Set_default_models(props.default_models.filter(item=>item!=model))
      }
      else {
        props.Set_default_models([...props.default_models,model])
    }
  }
  return (
    <div className="model_topbar" style={{width:"100%",marginBottom:2,display:'flex',justifyContent: "center",margin:0}}>
    <div ><h5 style={{ display: "inline-block", marginLeft: 0,marginRight:3,fontSize:16,fontWeight:600 }}>Years: </h5>{props.years_for_dropdown.map(item => <p className={props.selected_year==item ? "years_p_selected years_p" : "years_p"} onClick={() => handle_year_click(item)}>{item}</p>)}</div>
    <div style={{marginLeft:20}}><h5 style={{ display: "inline-block", marginLeft: 0,marginRight:3,fontSize:16,fontWeight:600}}>Models:</h5>{props.all_models.map(item => <p className={props.default_models.includes(item) ? "years_p_selected years_p" : "years_p"} onClick={() => handle_model_click(item)}>{item}</p>)}</div>
    </div>
  );
}
const maptstateToprop = (state) => {
  return {
    all_models:state.all_models,
    selected_year: state.selected_year,
    years_for_dropdown: state.years_for_dropdown,
    default_models: state.default_models,
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
    Set_selected_year: (val) => dispatch({ type: "selected_year", value: val }),
    Set_default_models: (val) => dispatch({ type: "default_models", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(YearModelSelection);

//https://material-ui.com/api/slider/
//https://material-ui.com/components/expansion-panels/
//https://material-ui.com/api/checkbox/
//https://material-ui.com/components/radio-buttons/