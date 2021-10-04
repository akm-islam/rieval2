import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import outerTheme from './theme'
import { connect } from "react-redux";
import Button from '@material-ui/core/Button';
import { useState } from 'react';
const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));
function Inputs(props) {
    const [threshold,set_threshold]=useState(props.threshold)
    const classes = useStyles();
    return (
        <ThemeProvider theme={outerTheme}>
            <form className={classes.root} noValidate autoComplete="off">
                <span>Deviation threshold:</span>
                <Input style={{width:30}} defaultValue={threshold} inputProps={{ 'aria-label': 'description' }} 
                onChange={(event=>set_threshold(event.target.value))}
                />
                <Button style={{height:20,color:"black",fontSize:16,backgroundColor:'#f2f2f2'}} variant='string'
                onClick={()=>props.Set_threshold(threshold)}
                >Update</Button>
            </form>
        </ThemeProvider>

    );
}
const maptstateToprop = (state) => {
    return {
        threshold:state.threshold
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        Set_threshold: (val) => dispatch({ type: "threshold", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(Inputs);
/*
import React from 'react';
import "./Sliders.scss";
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import Typography from '@material-ui/core/Typography';
import TextField from '@material/TextField';
const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    tRoot: {
        marginBottom: 35,
    },
    rang_input: {
        marginLeft: 10,
    },
}));
function Modes(props) {
    const classes = useStyles();
    // states
    const [threshold, set_threshold] = React.useState(props.threshold);
    //-----------------------------------------------------------------
    var temp_marks = [];
    var min=0
    var max=20
    var number_marks=10
    var step = (max - 1) / (number_marks - 1);
    for (var i = 0; i < number_marks; i++) {
        temp_marks.push(1 + (step * i));
    }
    var marks = temp_marks.map(item => {
        var myitem = parseInt(item)
        return { value: myitem, label: myitem }
    })
    //console.log(props.marks)
    //-----------------------------------------------------------------
    return (
        <div className="rangeslider2" style={{ marginLeft: 60,marginTop:-28, width: "100%", paddingTop: 0 }} >
            <Typography>
                Threshold
            </Typography>

        </div>
    );
}
const maptstateToprop = (state) => {
    return {
        threshold:state.threshold
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        Set_threshold: (val) => dispatch({ type: "threshold", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(Modes);
*/