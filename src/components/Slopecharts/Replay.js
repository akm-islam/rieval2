import React,{useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { connect } from "react-redux";
import { Button } from '@material-ui/core';
import * as $ from 'jquery';
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
function SimpleModal(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [mouseX, setmouseX] = React.useState(0);
  const [mouseY, setmouseY] = React.useState(0);
  
  useEffect(() => {
    $(".slopechart_container").on("contextmen",(e)=>{
      e.preventDefault()
      setOpen(true)
      setmouseX(e.pageX)
      setmouseY(e.pageY)
      if(typeof(props.Set_replay)!="undefined"){
        props.Set_replay(true)
      }
    })
  })
  const handleClose = () => {
    setOpen(false);
    props.Set_replay(false)
  };
  const handleReplay = () => {
    setOpen(false);
    setTimeout(() => { props.Set_replay(false) }, 24000);
    //---------------------------------------------------------- Model mode start here
    if (props.changed == "range") {
      if ('state_range' in props.prev_prop) {
        props.Set_state_range(props.prev_prop.state_range)
        setTimeout(() => { props.Set_state_range(props.state_range) }, 12000);
      }
    }
    else {
      if ('selected_year' in props.prev_prop) {
        props.Set_selected_year(props.prev_prop.selected_year)
        setTimeout(() => { props.Set_selected_year(props.selected_year) }, 12000);
      }
    }
    //---------------------------------------------------------- Model mode ends here
    
    //---------------------------------------------------------- Range mode starts here
    if (props.changed == "range") {
      if ('range_mode_range1' in props.prev_prop) {
        props.Set_range_mode_range1(props.prev_prop.range_mode_range1)
        setTimeout(() => { props.Set_range_mode_range1(props.range_mode_range1) }, 12000);
      }
      if ('range_mode_range2' in props.prev_prop) {
        props.Set_range_mode_range2(props.prev_prop.range_mode_range2)
        setTimeout(() => { props.Set_range_mode_range2(props.range_mode_range2) }, 12000);
      }
    }
    else {
      if ('selected_year' in props.prev_prop) {
        props.Set_selected_year(props.prev_prop.selected_year)
        setTimeout(() => { props.Set_selected_year(props.selected_year) }, 12000);
      }
    }
    //---------------------------------------------------------- Range mode ends here
  
    //---------------------------------------------------------- Time mode starts here
      if (props.changed == "range") {
        if ('time_mode_range' in props.prev_prop) {
          props.Set_time_mode_range(props.prev_prop.time_mode_range)
          setTimeout(() => { props.Set_time_mode_range(props.time_mode_range) }, 12000);
        }
      }
      else {
        if ('time_mode_year1' in props.prev_prop) {
          props.Set_time_mode_year1(props.prev_prop.time_mode_year1)
          setTimeout(() => { props.Set_time_mode_year1(props.time_mode_year1) }, 12000);
        }
        if ('time_mode_year2' in props.prev_prop) {
          props.Set_time_mode_year2(props.prev_prop.time_mode_year2)
          setTimeout(() => { props.Set_time_mode_year2(props.time_mode_year2) }, 12000);
        }
      }
      //---------------------------------------------------------- Time mode ends here
  }
  const body = (
    <div style={{ left: mouseX, top: mouseY }} className={classes.paper}>
      <h2 id="simple-modal-title" style={{ marginBottom: 15 }}>Animation Replay</h2>
      <Button onClick={handleReplay} variant="outlined" color="primary">Replay</Button>
      <Button onClick={handleClose} variant="outlined" color="primary" style={{ marginLeft: 12 }}>Cancel</Button>
      <SimpleModal />
    </div>
  );

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
    </div>
  );
}
const maptstateToprop = (state) => {
  return {
    replay: state.replay,
    prev_prop: state.prev_prop,
    state_range: state.state_range,
    changed: state.changed,
    selected_year: state.selected_year,
    
    range_mode_range1: state.range_mode_range1,
    range_mode_range2: state.range_mode_range2,
    
    time_mode_range: state.time_mode_range,
    time_mode_year1: state.time_mode_year1,
    time_mode_year2: state.time_mode_year2,
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
    Set_replay: (val) => dispatch({ type: "replay", value: val }),
    Set_state_range: (val) => dispatch({ type: "state_range", value: val }),
    Set_selected_year: (val) => dispatch({ type: "selected_year", value: val }),

    Set_range_mode_range1: (val) => dispatch({ type: "range_mode_range1", value: val }),
    Set_range_mode_range2: (val) => dispatch({ type: "range_mode_range2", value: val }),

    Set_time_mode_range: (val) => dispatch({ type: "time_mode_range", value: val }),
    Set_time_mode_year1: (val) => dispatch({ type: "time_mode_year1", value: val }),
    Set_time_mode_year2: (val) => dispatch({ type: "time_mode_year2", value: val }),
    
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(SimpleModal);

