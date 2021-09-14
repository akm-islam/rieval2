import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { connect } from 'react-redux';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';

export function SimpleMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{marginTop:-2}}>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>Select Mode<ArrowDropDownIcon></ArrowDropDownIcon></Button>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose} style={{marginTop:0}}>
       {anchorEl?<div style={{paddingLeft:10}}><form onSubmit={() => this.buttonclickHandler(1, "form")}>
                <FormControl component="fieldset">
                  <FormLabel component="legend"></FormLabel>
                  <RadioGroup aria-label="gender" name="gender1" onChange={(event, val) => {handleClose();props.Set_histogram_data([]);props.Set_mode(val)}}>
                    {['Model', 'Ranges', 'Time'].map((value) => {
                      return <FormControlLabel value={value} control={<Radio />} label={value} />
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
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
    Set_mode: (val) => dispatch({ type: "mode", value: val }),
    Set_histogram_data: (val) => dispatch({ type: "histogram_data", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(SimpleMenu);
