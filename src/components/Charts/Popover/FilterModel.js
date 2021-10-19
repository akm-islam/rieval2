import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import Fade from '@material-ui/core/Fade';
import { connect } from "react-redux";
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
  const checkboxChanged = (event) => {
    let temp_Models=[...props.pop_over_models].filter(item=>item!="ListNet")
    if (temp_Models.includes(event.target.value)) {
      temp_Models = props.pop_over_models.filter(item => item != event.target.value)
      props.Set_pop_over_models(temp_Models)
    }
    else {
      temp_Models.push(event.target.value)
      props.Set_pop_over_models(temp_Models)
    }
  }
  return (
    <div>
      <Button aria-controls="fade-menu" aria-haspopup="true" onClick={handleClick}>
        Filter Models
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
            {props.default_models.map((value) => {
              const labelId = `checkbox-list-label-${value}`;
              return (
                <ListItem key={value} role={undefined} onClick={handleToggle(value)}>
                  <Checkbox
                    checked={props.pop_over_models.includes(value)}
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
    pop_over_models:state.pop_over_models
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
    Set_pop_over_models: (val) => dispatch({ type: "pop_over_models", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(FadeMenu);
//https://material-ui.com/components/menus/
