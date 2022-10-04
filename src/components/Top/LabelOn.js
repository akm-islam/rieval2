import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Typography } from '@material-ui/core';
import { connect } from "react-redux";
function CheckboxLabels(props) {
  return (
    <div style={{ marginTop: 7 }}>
      <FormGroup>
        <FormControlLabel sx={{ margin: 0, padding: 0 }} control={<Checkbox size="small" sx={{
          marginTop: 0, padding: 0,
          color: "gray", '&.Mui-checked': {
            color: "gray",
          },
        }} checked={props.label_on}
          onClick={() => props.Set_label_on(!props.label_on)} />} label={<Typography style={{fontSize:14,fontFamily:"Open Sans",marginLeft:3}}>Rank Label On</Typography>} />
      </FormGroup>
    </div>

  );
}
const maptstateToprop = (state) => {
  return {
    label_on: state.label_on
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
    Set_label_on: (val) => dispatch({ type: "label_on", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(CheckboxLabels);