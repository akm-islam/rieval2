import React from 'react';
import "../Sliders.scss";
import * as $ from 'jquery';
import Slider from '@material-ui/core/Slider';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';

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
    const [range_mode_slider_value1, set_range_mode_slider_value1] = React.useState(props.range_mode_range1);
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
        <div className="rangeslider" style={{ width:"95%",marginTop:30 }} >
                    <Slider
                        value={range_mode_slider_value1}
                        onChange={(event, newValue) => set_range_mode_slider_value1(newValue)}
                        onChangeCommitted={(event, newValue) => props.Set_changed("range")}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        valueLabelDisplay="on"
                        min={1}
                        max={props.slider_max}
                        marks={marks}
                    />
                    <Grid style={{ marginBottom: 15 }} container
                        direction="row"
                        justify="space-around"
                        alignItems="center">
                            {
                                /*
                        <TextField classes={{ input: classes.rang_input }} id="standard-basic" label="Lower" value={range_mode_slider_value1[0]} style={{ width: 40 }}
                            onChange={event => {
                                if (isNaN(parseInt(event.target.value))) {
                                    set_range_mode_slider_value1(["", range_mode_slider_value1[1]])
                                } else {
                                    if (event.target.value > range_mode_slider_value1[1]) {
                                        alert("Lower range can not be larger than the upper range")
                                    }
                                    else {
                                        set_range_mode_slider_value1([event.target.value, range_mode_slider_value1[1]])
                                    }
                                }
                            }
                            }
                        />
                        <TextField classes={{ input: classes.rang_input }} id="standard-basic" label="Upper" value={range_mode_slider_value1[1]} style={{ width: 40 }}
                            onChange={event => {
                                if (isNaN(parseInt(event.target.value))) {
                                    set_range_mode_slider_value1([range_mode_slider_value1[0], ""])
                                } else {
                                    if (parseInt(event.target.value) > props.slider_max) {
                                        alert("Upper range can not exceed maximum")
                                        set_range_mode_slider_value1([range_mode_slider_value1[0], props.slider_max])
                                    }
                                    else {
                                        set_range_mode_slider_value1([range_mode_slider_value1[0], parseInt(event.target.value)])
                                    }
                                }
                            }
                            }
                        />

                                */
                            }
                    </Grid>
                    <Button className="range_button" style={{ width: $('.Sidebar').width() - 11, backgroundColor: "#ededed", height: 30, marginBottom: 5, marginLeft: -3 }}
                        onClick={() => props.Set_range_mode_range1(range_mode_slider_value1)}
                    >Update range</Button>
                </div>
    );
}
const maptstateToprop = (state) => {
    return {
        mode: state.mode, // Model mode model
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