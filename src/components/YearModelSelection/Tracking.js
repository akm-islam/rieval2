import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import { connect } from 'react-redux'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Fade from '@material-ui/core/Fade';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
function Tracking(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleChange = (event) => {
    if(event.target.value=="Yes"){
      props.set_tracking(true)
    }
    else if(event.target.value=="No"){
      props.set_tracking(false)
    }
    setAnchorEl(null);
  };

  return (
    <div className="tracking">
      <Button style={{ borderRadius: 0 }} aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
        Tracking
        <ArrowDropDownIcon></ArrowDropDownIcon>
      </Button>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleChange}
        TransitionComponent={Fade}
      >
        <div className="radioContainer" style={{ padding: "0px 15px" }}>
          <RadioGroup aria-label="gender" name="gender1" value={props.tracking==true?"Yes":"No"}
            onChange={(event) => handleChange(event)}>
            {["Yes","No"].map((value) => {
              return <FormControlLabel value={value} control={<Radio />} label={value} />
            })}
          </RadioGroup>
        </div>
      </Menu>
    </div>
  );
}

const maptstateToprop = (state) => {
  return {
    tracking: state.tracking,
    default_models: state.default_models,
    sort_by: state.sort_by,
    state_range: state.state_range,
    selected_year: state.selected_year,
    grouped_by_year_data: state.grouped_by_year_data,
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
    set_tracking: (val) => dispatch({ type: "tracking", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(Tracking);
//https://material-ui.com/components/menus/
