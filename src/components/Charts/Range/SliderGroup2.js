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
    const [range_mode_slider_value2, set_range_mode_slider_value2] = React.useState(props.range_mode_range2);
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
        <div className="rangeslider" style={{ width: "95%", marginTop: 30 }} >
            <Slider
                value={range_mode_slider_value2}
                onChange={(event, newValue) => set_range_mode_slider_value2(newValue)}
                onChangeCommitted={(event, newValue) => { props.Set_changed("range") }}
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
                <TextField classes={{ input: classes.rang_input }} id="standard-basic" label="Lower" value={range_mode_slider_value2[0]} style={{ width: 40 }}
                    onChange={event => {
                        if (isNaN(parseInt(event.target.value))) {
                            set_range_mode_slider_value2(["", range_mode_slider_value2[1]])
                        } else {
                            if (event.target.value > range_mode_slider_value2[1]) {
                                alert("Lower range can not be larger than the upper range")
                            }
                            else {
                                set_range_mode_slider_value2([event.target.value, range_mode_slider_value2[1]])
                            }
                        }
                    }
                    }
                />
                <TextField classes={{ input: classes.rang_input }} id="standard-basic" label="Upper" value={range_mode_slider_value2[1]} style={{ width: 40 }}
                    onChange={event => {
                        if (isNaN(parseInt(event.target.value))) {
                            set_range_mode_slider_value2([range_mode_slider_value2[0], ""])
                        } else {
                            if (parseInt(event.target.value) > props.slider_max) {
                                alert("Upper range can not exceed maximum")
                                set_range_mode_slider_value2([range_mode_slider_value2[0], props.slider_max])
                            }
                            else {
                                set_range_mode_slider_value2([range_mode_slider_value2[0], parseInt(event.target.value)])
                            }
                        }
                    }
                    }
                />
            */
                }
            </Grid>
            <Button className="range_button" style={{ width: $('.Sidebar').width() - 11, backgroundColor: "#ededed", height: 30, marginBottom: 5, marginLeft: 0 }}
                onClick={() => props.Set_range_mode_range2(range_mode_slider_value2)}
            >Update range</Button>

        </div>
    );
}
const maptstateToprop = (state) => {
    return {
        selected_year: state.selected_year,
        state_range: state.state_range,
        mode: state.mode, // Model mode model
        slider_max: state.slider_max,
        range_mode_model: state.range_mode_model, // Range mode model
        range_mode_range1: state.range_mode_range1,
        range_mode_range2: state.range_mode_range2,
        time_mode_model: state.time_mode_model, // Time mode model
        time_mode_range: state.time_mode_range,
        time_mode_year1: state.time_mode_year1,
        time_mode_year2: state.time_mode_year2,
        years_for_dropdown: state.years_for_dropdown,
        dataset: state.dataset,
        defualt_models: state.defualt_models,
        slider_and_feature_value: state.slider_and_feature_value,
        sort_by: state.sort_by,
        grouped_by_year_data: state.grouped_by_year_data,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        Set_range_mode_range2: (val) => dispatch({ type: "range_mode_range2", value: val }),
        Set_changed: (val) => dispatch({ type: "changed", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(Modes);