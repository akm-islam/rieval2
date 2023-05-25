import React from 'react';
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import './ModelSlider.scss';
import * as $ from 'jquery'
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
    const [sliderRange, set_sliderRange] = React.useState(props.range_mode_range1);
    //-----------------------------------------------------------------
    var temp_marks = [];
    var step = (props.slider_max - 1) / (6 - 1);
    for (var i = 0; i < 6; i++) {
        temp_marks.push(1 + (step * i));
    }
    var marks = temp_marks.map(item => {
        var myitem = parseInt(item)
        return { value: myitem, label: myitem }
    })
    //console.log(props.marks)
    //-----------------------------------------------------------------
    return (
        <div className="Modelslider" 
        style={{height: 70, width: '100%',marginBottom:5,padding: 30, border: "1px solid rgb(178, 178, 178,0.5)"}}>
            <div className="lower" style={{ padding: "0px 0px", marginTop: -20 }}>
                <TextField classes={{ input: classes.rang_input }} id="standard-basic" label="Lower" value={sliderRange[0]} style={{ width: "100%" }}
                    onChange={event => {
                        if (isNaN(parseInt(event.target.value))) {
                            set_sliderRange(["", sliderRange[1]])
                        } else {
                                set_sliderRange([event.target.value, sliderRange[1]])
                        }
                    }
                    }
                />
            </div>
            <div className="slider" style={{width: "100%", margin: "0px 0px" }}>
                <Slider value={sliderRange} onChange={(event, newValue) => set_sliderRange(newValue)} onChangeCommitted={(event, newValue) => props.Set_changed("range")}
                    valueLabelDisplay="auto" aria-labelledby="range-slider" valueLabelDisplay="on" min={1} max={props.slider_max} marks={marks}
                />
            </div>
            <div className="upper" style={{ padding: "0px 0px", marginTop: -20 }}>
                <TextField classes={{ input: classes.rang_input }} id="standard-basic" label="Upper" value={sliderRange[1]} style={{ width: "100%" }}
                    onChange={event => {
                        if (isNaN(parseInt(event.target.value))) {
                            set_sliderRange([sliderRange[0], ""])
                        } else {
                            if (parseInt(event.target.value) > props.slider_max) {
                                //alert("Upper range can not exceed maximum")
                                set_sliderRange([sliderRange[0], props.slider_max])
                            }
                            else {
                                set_sliderRange([sliderRange[0], parseInt(event.target.value)])
                            }
                        }
                    }
                    }
                />
            </div>
            <div className="button" item xs="2" style={{ marginTop: -10 }}>
                <Button className="range_button" style={{ backgroundColor: "#ededed", height: 30 }}
                    onClick={() => {
                        if ( sliderRange[0] > sliderRange[1]) {
                            alert("Lower range can not be larger than the upper range")
                        }
                        else if ( sliderRange[1] < sliderRange[0]) {
                            alert("upper range can not be smaller than the lower range")
                        }
                        else{
                            props.Set_range_mode_range1(sliderRange)
                        }
                    }
                }
                >Update range</Button>
            </div>
        </div>
    );
}
const maptstateToprop = (state) => {
    return {
        slider_max: state.slider_max,
        range_mode_range1: state.range_mode_range1,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        Set_range_mode_range1: (val) => dispatch({ type: "range_mode_range1", value: val }),
        Set_changed: (val) => dispatch({ type: "changed", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(Modes);