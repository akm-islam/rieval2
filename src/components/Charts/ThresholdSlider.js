import React from 'react';
import "./Sliders.scss";
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import Typography from '@material-ui/core/Typography';
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
            <Slider value={threshold} onChange={(event, newValue) => set_threshold(newValue)} onChangeCommitted={(event, newValue) => props.Set_threshold(newValue)}
                valueLabelDisplay="auto" min={min} max={max} aria-labelledby="input-slider" marks={marks}
            />
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