import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import Fade from '@material-ui/core/Fade';
import { connect } from "react-redux";
import * as algo1 from "../../Algorithms/algo1";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
function FadeMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  //------------For list and chckbox
  const [checked, setChecked] = React.useState([0]);
  const [selected_states, setSelected_states] = React.useState([]);
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };
  //----------------
  const show_checkboxChanged = (event) => {
    var myfunc = props.appHandleChange
    myfunc(event.target.value, "show_checkboxChanged")
  }
  const checkboxChanged = (event) => {
    var temp_Models;
    if (props.default_models.includes(event.target.value)) {
      temp_Models = props.default_models.filter(item => {
        if (item != event.target.value)
          return item
      })
      props.Set_default_models(temp_Models)
      props.Set_pop_over_models(temp_Models)
    }
    else {
      temp_Models = props.default_models
      temp_Models.push(event.target.value)
      props.Set_default_models(temp_Models)
      props.Set_pop_over_models(temp_Models)
    }
    var myfunc = props.appHandleChange
    myfunc(event.target.value, "clicked_model")
  }
  return (
    <div style={{ borderRight: "1px dashed #eaeaea" }}>
      <Button aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
        Select Model
        <ArrowDropDownIcon></ArrowDropDownIcon>
      </Button>
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <div className="CheckboxContainer">
          <List>
            {[ "MART","RandomFor","LinearReg","CordAscent", "LambdaMART", "LambdaRank","RankBoost", "RankNet"].map((value) => {
              const labelId = `checkbox-list-label-${value}`;
              return (
                <ListItem key={value} role={undefined} onClick={handleToggle(value)}>
                  <Checkbox
                    checked={props.default_models.includes(value)}
                    edge="start"
                    tabIndex={-1}
                    value={value}
                    onChange={(event, value) => {
                      checkboxChanged(event, value)
                    }
                    }
                  />
                  <p className="list_item_label" id={labelId}>{value}</p>
                </ListItem>
              );
            })}
          </List>
        </div>
      </Menu>
    </div>
  );
}
const maptstateToprop = (state) => {
  return {
    default_models: state.default_models,
    sort_by: state.sort_by,
    state_range: state.state_range,
    selected_year: state.selected_year,
    grouped_by_year_data: state.grouped_by_year_data,
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
    Set_default_models: (val) => dispatch({ type: "default_models", value: val }),
    Set_pop_over_models: (val) => dispatch({ type: "pop_over_models", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(FadeMenu);
//https://material-ui.com/components/menus/
