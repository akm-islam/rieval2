import React from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { connect } from "react-redux";
import * as themes from '../../themes'
function FadeMenu(props) {
    return (
            <div className="year_drop_down_container1">
                <p style={{ margin: 0, marginTop: 3, fontSize: 16, fontWeight: 600 }}>Year 1 :</p>
                <Autocomplete style={{ width: 100 }} disableClearable
                    defaultValue={props.time_mode_year1.toString()}
                    id="debug"
                    debug
                    options={props.years_for_dropdown.map((option) => option)}
                    renderInput={(params) => (
                        <TextField {...params} margin="normal" fullWidth={true} InputProps={{ ...params.InputProps, disableUnderline: true }} />
                    )}
                    onChange={(event, value) => {
                        props.Set_time_mode_year1(value)
                    }}
                />
            </div>
        
    );
}
const maptstateToprop = (state) => {
    return {
        time_mode_year1: state.time_mode_year1,
        years_for_dropdown: state.years_for_dropdown,
    }
}
const mapdispatchToprop = (dispatch) => {
    return {
        Set_time_mode_year1: (val) => dispatch({ type: "time_mode_year1", value: val }),
    }
}
export default connect(maptstateToprop, mapdispatchToprop)(FadeMenu);