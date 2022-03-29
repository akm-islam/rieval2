import React from 'react';
import Button from '@material-ui/core/Button';
import { connect } from "react-redux";
import Chart_pop from './04PopoverCharts'
import Draggable from 'react-draggable';
import Grid from '@mui/material/Grid';
import * as d3 from 'd3';
export function SimplePopover(props) {
    const handleClose = () => {
        props.set_pop_over(false)
        props.set_dbclicked_features([])
    };
     //------------------------------
     var selected_instances = d3.range(d3.min([props.range_mode_range1[0], props.range_mode_range2[0]]), d3.max([props.range_mode_range1[1], props.range_mode_range2[1]]) + 1)
     var min = d3.min(selected_instances), max = d3.max(selected_instances);
     var d = (max - min) / 8;
     var diverginColor = d3.scaleLinear().domain([min + d * 7, min + d * 6, min + d * 5, min + d * 4, min + d * 3, min + d * 2, min]).interpolate(d3.interpolateRgb).range(['#00429d', '#4771b2', '#73a2c6', '#a5d5d8', '#ffbcaf', '#f4777f', '#cf3759', '#93003a']);
     //------------------------------
     var selected_instances1 = d3.range(props.range_mode_range1[0], props.range_mode_range1[1] + 1)
     //-------------------- Threshold filter
     var under_threshold_instances = []
     var year_data = props.original_data.filter(item => props.selected_year == item['1-qid'])
       year_data.map(item => {
         var two_realRank = parseInt(item['two_realRank'])
         var predicted_rank = parseInt(item[props.range_mode_model])
         if (Math.abs(predicted_rank - two_realRank) < props.threshold) {
           under_threshold_instances.push(two_realRank)
         }
       })
     selected_instances1 = selected_instances1.filter(item => under_threshold_instances.includes(item))
     var data1 = props.lime_data[props.range_mode_model].filter(element => parseInt(element['1-qid']) == parseInt(props.selected_year) && selected_instances1.includes(parseInt(element['two_realRank'])))
     //------------------------------
     var selected_instances2 = d3.range(props.range_mode_range2[0], props.range_mode_range2[1] + 1)
     var under_threshold_instances = []
     var year_data = props.original_data.filter(item => props.selected_year == item['1-qid'])
     year_data.map(item => {
       var two_realRank = parseInt(item['two_realRank'])
       var predicted_rank = parseInt(item[props.range_mode_model])
       if (Math.abs(predicted_rank - two_realRank) < props.threshold) {
         under_threshold_instances.push(two_realRank)
       }
     })
     selected_instances2 = selected_instances2.filter(item => under_threshold_instances.includes(item))
     var data2 = props.lime_data[props.range_mode_model].filter(element => parseInt(element['1-qid']) == parseInt(props.selected_year) && selected_instances2.includes(parseInt(element['two_realRank'])))
    
    return (
        <div className="pop_over" style={{ position: "relative" }}>
            {props.pop_over == true ?
                <div style={{ top: "2%", left: "14%", position: "fixed", pointerEvents: "none", backgroundColor: "transparent" }}>
                    <Draggable>
                        <Grid style={{ backgroundColor: "#ffffff", boxShadow: "3px 2px 15px -7px #000000", pointerEvents: "auto",display:"relative",zIndex:6 }}>
                            <Grid container style={{ borderBottom: "1px solid #e2e2e2", marginBottom: 20 }} direction="row" justifyContent="flex-end" alignItems="center" >
                                <Button color="secondary" id="draggable-dialog-title" onClick={handleClose}>close</Button>
                            </Grid>
                            <Grid container direction="row" justify="center" alignItems="center" style={{ maxHeight: 700, overflow: "scroll", maxWidth: 1600 }}>
                                { 
                                    props.dbclicked_features.length > 0 ? props.dbclicked_features.map((item, index) => <Grid item container direction="row" ><Chart_pop
                                        index={index}
                                        popup_chart_data={[data1, item]} default_models={props.default_models}
                                        myid={item.replace(/\s/g, '').replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')+"range1"} diverginColor={props.diverginColor}
                                    ></Chart_pop>
                                    <Chart_pop
                                        index={index}
                                        popup_chart_data={[data2, item]} default_models={props.default_models}
                                        myid={item.replace(/\s/g, '').replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '')+"range2"} diverginColor={props.diverginColor}
                                    ></Chart_pop></Grid>
                                    ) : <Chart_pop popup_chart_data={data1} default_models={props.default_models} myid="myid1" diverginColor={props.diverginColor} textClickHandler_original={props.textClickHandler_original}></Chart_pop>
                                }
                            </Grid>
                        </Grid>
                    </Draggable>
                </div> : null}
        </div>
    );
}
const maptstateToprop = (state) => {
    return {
        range_mode_range1: state.range_mode_range1,
        range_mode_range2: state.range_mode_range2,
        range_mode_model: state.range_mode_model,    
        popup_chart_data: state.popup_chart_data,
        pop_over: state.pop_over,
        dbclicked_features: state.dbclicked_features,
        selected_year: state.selected_year,
        threshold: state.threshold,
        original_data: state.original_data,
        lime_data: state.lime_data,
        histogram_data: state.histogram_data,
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
