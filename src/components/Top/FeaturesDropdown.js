import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import Sidebar from "../FeatureHistograms/FeatureHistograms"
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

export default function SimpleMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div style={{marginLeft:50}}>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>Select Features</Button>
      <ArrowDropDownIcon onClick={handleClick}></ArrowDropDownIcon>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose} style={{marginTop:20}}>
       {anchorEl?<Sidebar handleClose={handleClose}></Sidebar>:null}
      </Menu>
    </div>
  );
}
