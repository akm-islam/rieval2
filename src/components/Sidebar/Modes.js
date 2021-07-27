import React from 'react';
import "./Sidebar.scss";
import * as $ from 'jquery';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import Slider from '@material-ui/core/Slider';
import Histograms from "./Histograms"
import { makeStyles } from '@material-ui/core/styles';
import { connect } from "react-redux";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import Grid from '@material-ui/core/Grid';
import Tracking from "./Tracking"
import * as algo1 from "../../Algorithms/algo1"

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
    const [sliderRange, set_sliderRange] = React.useState(props.state_range);
    const [range_mode_slider_value1, set_range_mode_slider_value1] = React.useState(props.range_mode_range1);
    const [range_mode_slider_value2, set_range_mode_slider_value2] = React.useState(props.range_mode_range2);
    const [time_mode_slider_value, set_time_mode_slider_value] = React.useState(props.time_mode_range);
    const [dummy, set_dummy] = React.useState(0);

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
        <div style={{ borderTop: "1px solid #eaeaea" }}>
            <p className="title_show" style={{ marginBottom: 8 }}>Compare:</p>
            <Autocomplete className="autocomplete_mode" style={{ border: "1px solid grey", borderRadius: 0, paddingTop: 0, paddingBottom: 0, marginLeft: 5, marginRight: 30, width: $('.Sidebar').width() - 10 }}
                defaultValue={"Models"}
                id="debug"
                debug
                options={["Models", "Ranges", "Time"]}
                renderInput={(params) => (
                    <TextField {...params} label="" margin="normal" fullWidth={true} InputProps={{ ...params.InputProps, disableUnderline: true }} />
                )}
                onChange={(event, val) => {
                    var value = val.replace('s', "")
                    props.Set_mode(value)
                    props.Set_clicked_items_in_slopechart([])
                }
                }
            />
            {props.mode == "Model" ? <div style={{ marginTop: 10, paddingLeft: 5, width: $('.Sidebar').width() }}>
                <p style={{ marginLeft: 0, marginBottom: -5, marginTop: 15, marginRight: 12, paddingLeft: 5, backgroundColor: "#f7f7f7", fontSize: 16 }}>{props.dataset == "fiscal" ? "Select states" : "Select " + props.dataset + "s"}</p>
                <div key={props.slider_and_feature_value} className="slider_feature_container">
                    <List className={classes.listroot}>
                        {['Rank range', 'Feature'].map((value) => {
                            const labelId = `checkbox-list-label-${value}`;
                            return (
                                <div className="listItem"><ListItem key={value} role={undefined} >
                                    <Checkbox
                                        checked={props.slider_and_feature_value[value]}
                                        edge="start"
                                        tabIndex={-1}
                                        value={value}
                                        onChange={(event) => {
                                            var temp_val = props.slider_and_feature_value
                                            if (props.slider_and_feature_value[event.target.value]) { temp_val[event.target.value] = 0 }
                                            else { temp_val[event.target.value] = 1 }
                                            set_dummy(JSON.stringify(temp_val)) // This is to change the state so that the component is updated
                                            //console.log("dummy",dummy)
                                            props.Set_slider_and_feature_value(temp_val)
                                        }}
                                    />
                                    <p className="list_item_label" id={labelId}>{value}</p>
                                </ListItem>
                                </div>
                            );
                        })}
                    </List>
                </div>
                {props.slider_and_feature_value["Rank range"] == 1 ?
                    <div className="rangeslider" style={{ width: $('.Sidebar').width() - 12 }} >
                        <Slider
                            value={sliderRange}
                            onChange={(event, newValue) => set_sliderRange(newValue)}
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
                            <TextField classes={{ input: classes.rang_input }} id="standard-basic" label="Lower" value={sliderRange[0]} style={{ width: 40 }}
                                onChange={event => {
                                    if (isNaN(parseInt(event.target.value))) {
                                        set_sliderRange(["", sliderRange[1]])
                                    } else {
                                        if (event.target.value > sliderRange[1]) {
                                            alert("Lower range can not be larger than the upper range")
                                        }
                                        else {
                                            set_sliderRange([event.target.value, sliderRange[1]])
                                        }
                                    }
                                }
                                }
                            />
                            <TextField classes={{ input: classes.rang_input }} id="standard-basic" label="Upper" value={sliderRange[1]} style={{ width: 40 }}
                                onChange={event => {
                                    if (isNaN(parseInt(event.target.value))) {
                                        set_sliderRange([sliderRange[0], ""])
                                    } else {
                                        if (parseInt(event.target.value) > props.slider_max) {
                                            alert("Upper range can not exceed maximum")
                                            set_sliderRange([sliderRange[0], props.slider_max])
                                        }
                                        else {
                                            set_sliderRange([sliderRange[0], parseInt(event.target.value)])
                                        }
                                    }
                                }
                                }
                            />
                        </Grid>
                        <Tracking></Tracking>
                        <Button className="range_button" style={{ width: $('.Sidebar').width() - 11, backgroundColor: "#ededed", height: 30, marginBottom: 5, marginLeft: -3 }}
                            onClick={() =>{
                                props.Set_state_range(sliderRange)
                            }}
                        >Update range</Button>
                    </div> : null}
                {props.slider_and_feature_value["Feature"] == 1 ?
                    <div>
                        <div>
                            <Histograms
                                year={props.selected_year.toString()} state_range={props.state_range}
                                Sidebar_width={$('.Sidebar').width()} appHandleChange={props.appHandleChange}>
                            </Histograms>
                        </div>
                    </div> : null
                }
            </div> : null}
            {props.mode == "Range" ? <div style={{ marginTop: 10, paddingLeft: 5, width: $('.Sidebar').width() }}>
                <div className="range_model">

                    <p style={{ marginLeft: 0, marginBottom: -5, marginTop: 15, marginRight: 12, paddingLeft: 5, backgroundColor: "#f7f7f7", fontSize: 16 }}>{props.dataset == "fiscal" ? "Select states" : "Select " + props.dataset + "s"}</p>
                </div>
                <div className="rangeslider" style={{ width: $('.Sidebar').width() - 12 }} >
                    <Typography classes={{ root: classes.tRoot }}>
                        Group 1
                        </Typography>
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
                    </Grid>
                    <Button className="range_button" style={{ width: $('.Sidebar').width() - 11, backgroundColor: "#ededed", height: 30, marginBottom: 5, marginLeft: -3 }}
                        onClick={() => props.Set_range_mode_range1(range_mode_slider_value1)}
                    >Update range</Button>
                </div>
                <div className="rangeslider" style={{ width: $('.Sidebar').width() - 12 }} >
                    <Typography classes={{ root: classes.tRoot }}>
                        Group 2
                        </Typography>
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
                </div>
                <Grid style={{ marginBottom: 15 }} container
                    direction="row"
                    justify="space-around"
                    alignItems="center">
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
                </Grid>
                <Button className="range_button" style={{ width: $('.Sidebar').width() - 11, backgroundColor: "#ededed", height: 30, marginBottom: 5, marginLeft: 0 }}
                    onClick={() => props.Set_range_mode_range2(range_mode_slider_value2)}
                >Update range</Button>

            </div> : null}
            {props.mode == "Time" ?
                <div style={{ marginTop: 10, paddingLeft: 5, marginBottom: 10, width: $('.Sidebar').width() }}>
                    <div className="model">
                        <p style={{ marginLeft: 0, marginBottom: -5, marginTop: 15, marginRight: 12, paddingLeft: 5, backgroundColor: "#f7f7f7", fontSize: 16 }}>{props.dataset == "fiscal" ? "Select states" : "Select " + props.dataset + "s"}</p>
                        <div className="rangeslider" style={{ width: $('.Sidebar').width() - 12 }} >
                            <Slider
                                value={time_mode_slider_value}
                                onChange={(event, newValue) => set_time_mode_slider_value(newValue)}
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
                                <TextField classes={{ input: classes.rang_input }} id="standard-basic" label="Lower" value={time_mode_slider_value[0]} style={{ width: 40 }}
                                    onChange={event => {
                                        if (isNaN(parseInt(event.target.value))) {
                                            set_time_mode_slider_value(["", time_mode_slider_value[1]])
                                        } else {
                                            if (event.target.value > time_mode_slider_value[1]) {
                                                alert("Lower range can not be larger than the upper range")
                                            }
                                            else {
                                                set_time_mode_slider_value([event.target.value, time_mode_slider_value[1]])
                                            }
                                        }
                                    }
                                    }
                                />
                                <TextField classes={{ input: classes.rang_input }} id="standard-basic" label="Upper" value={time_mode_slider_value[1]} style={{ width: 40 }}
                                    onChange={event => {
                                        if (isNaN(parseInt(event.target.value))) {
                                            set_time_mode_slider_value([time_mode_slider_value[0], ""])
                                        } else {
                                            if (parseInt(event.target.value) > props.slider_max) {
                                                alert("Upper range can not exceed maximum")
                                                set_time_mode_slider_value([time_mode_slider_value[0], props.slider_max])
                                            }
                                            else {
                                                set_time_mode_slider_value([time_mode_slider_value[0], parseInt(event.target.value)])
                                            }
                                        }
                                    }
                                    }
                                />
                            </Grid>
                            <Button className="range_button" style={{ width: $('.Sidebar').width() - 11, backgroundColor: "#ededed", height: 30, marginBottom: 5, marginLeft: -3 }}
                                onClick={() => props.Set_time_mode_range(time_mode_slider_value)}
                            >Update range</Button>
                        </div>
                        <div className="year">
                            <Autocomplete className={{ root: classes.MuiAutocompleteroot }}
                                defaultValue={props.time_mode_year1.toString()}
                                id="debug"
                                debug
                                options={props.years_for_dropdown.map((option) => option)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Year 1" margin="normal" fullWidth={true} InputProps={{ ...params.InputProps, disableUnderline: true }} />
                                )}
                                onChange={(event, value) => {
                                    props.Set_time_mode_year1(value)
                                    props.Set_changed("year")
                                }}
                            />
                        </div>
                        <div className="year">
                            <Autocomplete className={{ root: classes.MuiAutocompleteroot }}
                                defaultValue={props.time_mode_year2.toString()}
                                id="debug"
                                debug
                                options={props.years_for_dropdown.map((option) => option)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Year 2" margin="normal" fullWidth={true} InputProps={{ ...params.InputProps, disableUnderline: true }} />
                                )}
                                onChange={(event, value) => {
                                    props.Set_time_mode_year2(value)
                                    props.Set_changed("year")
                                }}
                            />
                        </div>
                    </div></div> : null}
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
        Set_slider_max: (val) => dispatch({ type: "slider_max", value: val }),
        Set_years_for_dropdown: (val) => dispatch({ type: "years_for_dropdown", value: val }),
        Set_state_range: (val) => dispatch({ type: "state_range", value: val }),
        Set_mode: (val) => dispatch({ type: "mode", value: val }),
        Set_range_mode_model: (val) => dispatch({ type: "range_mode_model", value: val }),
        Set_time_mode_model: (val) => dispatch({ type: "time_mode_model", value: val }),
        Set_range_mode_range1: (val) => dispatch({ type: "range_mode_range1", value: val }),
        Set_range_mode_range2: (val) => dispatch({ type: "range_mode_range2", value: val }),
        Set_time_mode_range: (val) => dispatch({ type: "time_mode_range", value: val }),
        Set_time_mode_year1: (val) => dispatch({ type: "time_mode_year1", value: val }),
        Set_time_mode_year2: (val) => dispatch({ type: "time_mode_year2", value: val }),
        Set_histogram_data: (val) => dispatch({ type: "histogram_data", value: val }),
        Set_slider_and_feature_value: (val) => dispatch({ type: "slider_and_feature_value", value: val }),
        Set_clicked_items_in_slopechart: (val) => dispatch({ type: "clicked_items_in_slopechart", value: val }),
        Set_changed: (val) => dispatch({ type: "changed", value: val }),
        Set_pop_over_models: (val) => dispatch({ type: "pop_over_models", value: val }),
        Set_defualt_models: (val) => dispatch({ type: "defualt_models", value: val }),
        Set_default_model_scores: (val) => dispatch({ type: "default_model_scores", value: val }),

    }
}
export default connect(maptstateToprop, mapdispatchToprop)(Modes);