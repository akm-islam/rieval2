import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import FeatureHistograms from "./FeatureHistograms/FeatureHistograms"
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
    <div style={{marginTop:-2}}>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>Select Features<ArrowDropDownIcon></ArrowDropDownIcon></Button>
      <Menu id="simple-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose} style={{marginTop:0}}>
       {anchorEl?<FeatureHistograms handleClose={handleClose}></FeatureHistograms>:null}
      </Menu>
    </div>
  );
}
