import React from 'react';
import { connect } from "react-redux";
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormLabel from '@material-ui/core/FormLabel';
import Menu from '@material-ui/core/Menu';
import Fade from '@material-ui/core/Fade';
import * as algo1 from "../../Algorithms/algo1";
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Threshold from './Threshold';
/*
Change in year,model selection and state range selection as well 
*/
function Sort(props) {
    const [anchorEl1, setAnchorEl1] = React.useState(null);
    const [anchorEl2, setAnchorEl2] = React.useState(null);

    const [sort_by, set_sort_by] = React.useState(props.sort_by);
    const open1 = Boolean(anchorEl1);
    const open2 = Boolean(anchorEl2);

    const sortModels = (event) => {
        set_sort_by(event.target.value)
        if (event.target.value == "None") { var val = "Alphabetically" }
        else { var val = event.target.value }
        props.Set_sort_by(val)
        var temp_Models = algo1.sort(val, props.state_range, props.default_models, props.selected_year, props.grouped_by_year_data)[0];
        var default_model_scores = algo1.sort(val, props.state_range, props.default_models, props.selected_year, props.grouped_by_year_data)[1];
        props.Set_default_model_scores(default_model_scores)
        props.Set_default_models([...temp_Models])
        setAnchorEl2(null)
    };
    return (
        <div className="sort" style={{ borderRight: "1px dashed #eaeaea", paddingLeft: 5,marginLeft:"40%" }}>
            <Button aria-controls="fade-menu" aria-haspopup="true" onClick={(event)=>setAnchorEl1(event.currentTarget)}>Advance <ArrowDropDownIcon></ArrowDropDownIcon></Button>
            <Menu id="fade-menu" anchorEl={anchorEl1} keepMounted open={open1}  onClose={()=>setAnchorEl1(null)} TransitionComponent={Fade}>
            <div style={{padding:"0px 14px"}}><Threshold></Threshold></div>
                <div style={{ padding:"0px 10px"}}>
                    <Button aria-controls="fade-menu" aria-haspopup="true" onClick={(event)=>setAnchorEl2(event.currentTarget)}>Select Metrics <ArrowDropDownIcon></ArrowDropDownIcon></Button>
                    <Menu id="fade-menu" anchorEl={anchorEl2} keepMounted open={open2} onClose={()=>setAnchorEl2(null)} TransitionComponent={Fade}>
                        <div style={{padding:"0px 10px"}}>
                            <FormControl component="fieldset">
                                <FormLabel component="legend"></FormLabel>
                                <RadioGroup aria-label="gender" name="gender1" value={sort_by} onChange={sortModels}>
                                    {['Discounted Cumulative Gain', 'Average Precision', 'None'].map((value) => {
                                        return <FormControlLabel value={value} control={<Radio />} label={value} />
                                    })}
                                </RadioGroup>
                            </FormControl>
                        </div>
                    </Menu>
                </div>
            </Menu>
        </div>
    );
}
const maptstateToprop = (state) => {
    return {
        default_models: state.default_models,
        sort_by: state.sort_by,
        state_range: state.state_range,
        selected_year: state.selected_year,
        grouped_by_year_data: state.grouped_by_year_data,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        Set_sort_by: (val) => dispatch({ type: "sort_by", value: val }),
        Set_default_models: (val) => dispatch({ type: "default_models", value: val }),
        Set_default_model_scores: (val) => dispatch({ type: "default_model_scores", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(Sort);
//https://material-ui.com/components/menus/