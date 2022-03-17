import React, { Component } from 'react';
//------------------------------------------------All datasets imports ends here
import { Row, Col } from 'reactstrap';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import * as $ from 'jquery';
import { connect } from "react-redux";
import Grid from '@material-ui/core/Grid';
import FeaturesDropdown from "./FeaturesDropdown"
import ButtonGroup from '@material-ui/core/ButtonGroup';
import SelectMode from './SelectMode'
import Threshold from './Threshold';
import SortModels from './SortModels';

class App extends Component {
  constructor(props) {
    super(props);
    // mydata is original data
    this.state = {
      random: 10,
      original_data: null, grouped_by_year_data: null, show: ["Slope charts", "Rankings", "Explanation"], view_data: 1,
      histogram_data: [], ref_year: null, features_dict: {}, features_voted: null, Legend_ready_to_vis: null, legend_model: "CordAscent",
    };
  }
  buttonclickHandler = (value, type) => {
    setTimeout(() => { this.setState({ random: Math.random() }) }, 500);
    type = "button" ? this.props.Set_view_data(value) : null
    type = "form" ? this.setState({ view_data: value }) : null
  }
  shouldComponentUpdate() {
    return true;
  }
  render() {
    return (
      <div>
        <Grid container>
          <ButtonGroup aria-label="outlined button group" style={{marginRight:150,border:'none'}}>
          <Button style={{borderRadius:0,border:'none',borderRight:'1px solid #bfbfbf'}} onClick={() => this.buttonclickHandler(1, "button")}>View Data</Button>
          <Button style={{borderRadius:0,border:'none', borderRight:'1px solid #bfbfbf'}} onClick={() => this.buttonclickHandler(0, "button")}>Load Data</Button>
          </ButtonGroup>
          <SelectMode></SelectMode>
          {this.props.mode=="Model"?<FeaturesDropdown></FeaturesDropdown>:null}
          {this.props.mode=="Model"?<SortModels></SortModels>:null}
          <Threshold></Threshold>
        </Grid>
        {this.props.view_data == false ?
          <Row className="Topbar_container">
            <div className="load">
              <form onSubmit={() => this.buttonclickHandler(1, "form")}>
                <FormControl component="fieldset">
                  <FormLabel component="legend"></FormLabel>
                  <RadioGroup aria-label="gender" name="gender1" onChange={(event, val) => this.props.handleradioChange(val)}>
                    {['Fiscal Dataset', 'School Dataset (World)','School Dataset (USA)'].map((value) => {
                      return <FormControlLabel value={value} control={<Radio />} label={value} />
                    })}
                  </RadioGroup>
                  <Button type="submit" variant="outlined" color="primary">Load</Button>
                </FormControl>
              </form>
            </div></Row>
          : null}
      </div>
    );
  }
}
const maptstateToprop = (state) => {
  return {
    view_data: state.view_data,
    mode:state.mode,
  }
}
const mapdispatchToprop = (dispatch) => {
  return {
    Set_view_data: (val) => dispatch({ type: "view_data", value: val }),
  }
}
export default connect(maptstateToprop, mapdispatchToprop)(App);