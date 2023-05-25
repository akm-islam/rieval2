import React from 'react';
import * as d3 from 'd3';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { connect } from 'react-redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';

import fiscal_ice from "../../Data/data/fiscal/ice/fiscal_ice_may25.csv";
import fiscal_lime from "../../Data/data/fiscal/lime/fiscal_lime_may25.csv";

import school_lime from "../../Data/data/school/lime/school_lime_may25.csv";
import school_ice from "../../Data/data/school/ice/school_ice_may25.csv";

export function SelectExpMethod(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const process_data_mini = (dataset,val, Set_lime_data) => {
    var lime_data_filename = "";
    if(dataset==="fiscal"){
      lime_data_filename = (val === "lime")?fiscal_lime:fiscal_ice;
    }
    if(dataset==="school"){
      lime_data_filename = (val === "lime")?school_lime:school_ice;
    }
    d3.csv(lime_data_filename).then(temp_data => {
      var temp_data2 = temp_data.map(d=>{
        var d1 = {};
        for(var key of Object.keys(d)){
          d1[key] = (d[key] === "")?"0":d[key]
        }
        return d1;
      })
      var data=temp_data2.map(item=>{
        item['predicted']=parseInt(item['predicted'])
        item['two_realRank']=parseInt(item['two_realRank'])
        item['deviation']=Math.abs(item['predicted']-item['two_realRank'])
        return item
      })
      
    var nested_data = {}
    d3.nest().key(function (d) { return d.model; }).entries(data).map(item => {
      nested_data[item.key] = item.values
    })
    Set_lime_data(nested_data)
  })
  }; //ending process_data_mini


  return (
    <div style={{marginTop:-2}}>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>Select Explanation Method<ArrowDropDownIcon></ArrowDropDownIcon></Button>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose} style={{marginTop:0}}>
       {anchorEl?<div style={{paddingLeft:10}}><form onSubmit={() => this.buttonclickHandler(1, "form")}>
                <FormControl component="fieldset">
                  <FormLabel component="legend"></FormLabel>
                  <RadioGroup aria-label="gender" name="gender1" onChange={(event, val) => {
                    handleClose();
                    process_data_mini(props.dataset, val, props.Set_lime_data);
                    if(val === "ice"){props.Set_default_models(props.default_models.filter(item => item != "RandomFor"))}
                    //if(val === "lime"){props.Set_default_models(props.default_models.filter(item => item != "SVM"))}
                    console.log(val);
                    props.Set_exp_method(val)
                    }}>
                    {['LIME', 'ICE'].map((value) => {
                      return <FormControlLabel value={value.toLowerCase()} control={<Radio />} label={value} checked={props.exp_method === value.toLowerCase()} />
                    })}
                  </RadioGroup>
                </FormControl>
              </form></div>:null}
      </Menu>
    </div>
  );
}
const maptstateToprop = (state) => {
  return {
    state_range: state.state_range,
    dataset: state.dataset,
    exp_method: state.exp_method,
    default_models: state.default_models,
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
    Set_exp_method: (val) => dispatch({ type: "exp_method", value: val }),
    Set_histogram_data: (val) => dispatch({ type: "histogram_data", value: val }),
    Set_default_models: (val) => dispatch({ type: "default_models", value: val }),
    Set_lime_data: (val) => dispatch({ type: "lime_data", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(SelectExpMethod);
