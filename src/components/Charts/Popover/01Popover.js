import React from 'react';
import Button from '@material-ui/core/Button';
import { connect } from "react-redux";
import Chart_pop from './02Charts'
import Draggable from 'react-draggable';
import Grid from "@material-ui/core/Grid"
import FilterModel from "./FilterModel"
export function SimplePopover(props) {
    console.log(props.default_models, 'popover')
    const handleClose = () => {
        props.set_pop_over(false)
        props.set_dbclicked_features([])
    };
    return (
        <div className="pop_over" style={{ position: "relative" }}>
            {props.pop_over == true ?
                <div style={{ top: "2%", left: "14%", position: "fixed", pointerEvents: "none", backgroundColor: "transparent" }}>
                    <Draggable>
                        <Grid style={{ backgroundColor: "#ffffff", boxShadow: "3px 2px 15px -7px #000000", pointerEvents: "auto" }}>
                            <Grid container style={{ borderBottom: "1px solid #e2e2e2", marginBottom: 20 }}
                                direction="row"
                                justify="space-between"
                                alignItems="center"
                            >
                                <FilterModel default_models={props.default_models}></FilterModel>
                                <Button color="secondary" id="draggable-dialog-title" onClick={handleClose}>close</Button>
                            </Grid>
                            {
                                props.mode == "Model" ? <Grid container direction="row" justify="center" alignItems="center" style={{ maxHeight: 700, overflow: "scroll", maxWidth: 1600 }}>
                                    {
                                        props.dbclicked_features.length > 0 ? props.dbclicked_features.map((item, index) => <Chart_pop
                                            index={index}
                                            popup_chart_data={[props.popup_chart_data[0], item]} default_models={props.default_models}
                                            myid={item.replace(/\s/g, '').replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')} diverginColor={props.diverginColor}
                                        ></Chart_pop>) : <Chart_pop popup_chart_data={props.popup_chart_data} default_models={props.default_models} myid="myid1" diverginColor={props.diverginColor} textClickHandler_original={props.textClickHandler_original}></Chart_pop>
                                    }
                                </Grid> : null
                            }
                            {
                                props.mode == "Ranges" ? <Grid container direction="row" justify="center" alignItems="center" style={{ maxHeight: 700, overflow: "scroll", maxWidth: 1600 }}>
                                    {
                                        props.dbclicked_features.length > 0 ? props.dbclicked_features.map((item, index) => <Chart_pop
                                            index={index}
                                            popup_chart_data={[props.popup_chart_data[0], item]} default_models={props.default_models}
                                            myid={item.replace(/\s/g, '').replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')} diverginColor={props.diverginColor}
                                        ></Chart_pop>) : <Chart_pop popup_chart_data={props.popup_chart_data} default_models={props.default_models} myid="myid1" diverginColor={props.diverginColor} textClickHandler_original={props.textClickHandler_original}></Chart_pop>
                                    }
                                </Grid> : null
                            }
                            {
                                props.mode == "Time" ? <Grid container direction="row" justify="center" alignItems="center" style={{ maxHeight: 700, overflow: "scroll", maxWidth: 1600 }}>
                                    {
                                        props.dbclicked_features.length > 0 ? props.dbclicked_features.map((item, index) => <Chart_pop
                                            index={index}
                                            popup_chart_data={[props.popup_chart_data[0], item]} default_models={props.default_models}
                                            myid={item.replace(/\s/g, '').replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')} diverginColor={props.diverginColor}
                                        ></Chart_pop>) : <Chart_pop popup_chart_data={props.popup_chart_data} default_models={props.default_models} myid="myid1" diverginColor={props.diverginColor} textClickHandler_original={props.textClickHandler_original}></Chart_pop>
                                    }
                                </Grid> : null
                            }
                        </Grid>
                    </Draggable>
                </div> : null}
        </div>
    );
}
const maptstateToprop = (state) => {
    return {
        popup_chart_data: state.popup_chart_data,
        pop_over: state.pop_over,
        dbclicked_features: state.dbclicked_features,
        mode: state.mode,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        set_pop_over: (val) => dispatch({ type: "pop_over", value: val }),
        set_dbclicked_features: (val) => dispatch({ type: "dbclicked_features", value: val }),
        set_clicked_features: (val) => dispatch({ type: "clicked_features", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(SimplePopover);
