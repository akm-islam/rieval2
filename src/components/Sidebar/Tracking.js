import React from 'react';
import { connect } from 'react-redux'
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
function Tracking(props) {
  return (
    <Grid
      container
      direction="row"
      justify="flex-start"
      alignItems="baseline"
    >
      <FormControlLabel
        labelPlacement="start"
        control={
          <Checkbox
            checked={props.tracking}
            onChange={(event) => props.set_tracking(event.target.checked)}
            name="checkedB"
            color="primary"
          />
        }
        label="Tracking"
      />
    </Grid>
  );
}

const maptstateToprop = (state) => {
  return {
    tracking: state.tracking,
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
    set_tracking: (val) => dispatch({ type: "tracking", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(Tracking);
//https://material-ui.com/components/menus/
