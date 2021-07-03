import React, { Component } from 'react';
import './SlopeChart.css';
import * as d3 from 'd3';
import * as $ from 'jquery';
import * as slopechart1 from "../Algorithms/slopechart1";
import * as slopechart2 from "../Algorithms/slopechart2";
import * as slopechart3 from "../Algorithms/slopechart3";
class SlopeChart extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
componentDidMount(){
var self=this;
$.when($.ajax(self.task1())).then(function () {
  self.props.clicked_items_in_slopechart.map(item=>{
    self.task2(item);
  })
});  
}
task1=()=>{
  //------------------------------------------------------
  var parent_width=$('.slopechart').width();
  var mydata3={"A":[],"B":[]}
  var mydata4={"C":[],"D":[]}
  var deviate_by=this.props.deviate_by
  var selected_by_year_data=this.props.grouped_by_year_data[this.props.year] // This is the data passed a dictionay where year is the key
  var max_rank=selected_by_year_data.length
  var model_name=this.props.model_name // This is the model name on the right side
  var cmodel = this.props.cmodel // This is the selected model for color in case of sorting by predicted rank
//--------
  var start_range=this.props.state_range!=null?this.props.state_range[0]:10; // range to start
    if(start_range>0){start_range-=1} // This is to start from index 0
  if(start_range<0){start_range=0} // check if the deviation make the starting range less than the available rank
  if(start_range<deviate_by){deviate_by=start_range} // check if the deviation make the starting range less than the available rank
  start_range=start_range-deviate_by
  if(start_range<0){start_range=0;deviate_by=0}
  var deviate_check_lower=start_range+deviate_by+1
//-----
  deviate_by=this.props.deviate_by
  var end_range=this.props.state_range!=null?this.props.state_range[1]:25
  var deviate_check_upper=end_range // Upper deviation check is this
  end_range=end_range+deviate_by // changes the end range to include the deviation; next if checks when it goes beyond range
  if(end_range>max_rank){
    deviate_check_upper=end_range-deviate_by; // set the upper range by subtracting the deviation
    end_range=max_rank
  }

var line_color; //-----Line color
//---------------------------------------------------------------------------- Tracking starts here
var ref_year=this.props.ref_year
var predicted=this.props.chart_scale_type
var track_states;
var track_states_ranged_dictionary={}
if(this.props.tracking){
var track_states_year_data=this.props.grouped_by_year_data[ref_year] // when tracking is activated we use reference year for color
if(predicted!="predicted"){  
for(var i=deviate_check_lower-1;i<deviate_check_upper;i++){
  track_states_ranged_dictionary[track_states_year_data[i]["State"]]=track_states_year_data[i]["two_realRank"]
}
track_states=Object.keys(track_states_ranged_dictionary)
}
//console.log(track_states_ranged_dictionary)
//---------
if(predicted=="predicted"){
var temp_dict={}
track_states_year_data.map(element=>{
  temp_dict[element["State"]]=element[cmodel]
})
track_states_ranged_dictionary=temp_dict
var two_dim_sorted=Object.entries(temp_dict).sort(((a,b)=>a[1]-b[1]));
var track_states2=[];
for(var i=deviate_check_lower-1;i<deviate_check_upper;i++){
track_states2.push(two_dim_sorted[i][0])
track_states=track_states2
}}
//-------
if(track_states.length<20){
//console.log(track_states,"less than 20") 
  line_color = d3.scaleOrdinal().domain(track_states).range(["#1f77b4", "#aec7e8",  "#ff7f0e",  "#ffbb78",  "#2ca02c",  "#98df8a",  "#d62728",  "#ff9896",  "#9467bd",  
  "#c5b0d5",  "#8c564b",  "#c49c94",  "#e377c2",  "#f7b6d2",  "#7f7f7f",  "#c7c7c7",  "#bcbd22",  "#dbdb8d",  "#17becf",  "#9edae5"]);
} 
else{                                                                    
var min = deviate_check_lower;
var max =deviate_check_upper;
var d = (max-min)/8;
var line_color2 = d3.scaleLinear().domain([min + d*7,min + d*6,min + d*5,min + d*4,min + d*3,min + d*2,min]).interpolate(d3.interpolateRgb).range(['#00429d', '#4771b2', '#73a2c6', '#a5d5d8', /*'#ffffe0',*/ '#ffbcaf','#f4777f', '#cf3759', '#93003a']);
var Rgbdict={}
for(var key in track_states_ranged_dictionary){
  Rgbdict[key]=line_color2(track_states_ranged_dictionary[key])
}
line_color=d3.scaleOrdinal().domain(Object.keys(Rgbdict)).range(Object.values(Rgbdict))
  }
}
//------------------------------If tracking is not activated
else{
var track_states_year_data=this.props.grouped_by_year_data[this.props.year] // when tracking is not activated we use selected year for color
var track_states_ranged_dictionary={}
for(var i=deviate_check_lower-1;i<deviate_check_upper;i++){
  track_states_ranged_dictionary[track_states_year_data[i]["State"]]=track_states_year_data[i]["two_realRank"]
}
var track_states=Object.keys(track_states_ranged_dictionary)

if(predicted=="predicted"){
  var temp_dict={}
  track_states_year_data.map(element=>{
    temp_dict[element["State"]]=element[cmodel]
  })
  track_states_ranged_dictionary=temp_dict
  var two_dim_sorted=Object.entries(temp_dict).sort(((a,b)=>a[1]-b[1]));
var track_states2=[];
for(var i=deviate_check_lower-1;i<deviate_check_upper;i++){
  track_states2.push(two_dim_sorted[i][0])
  track_states=track_states2
}}

if(track_states.length<20){
//console.log(track_states,"less than 20") 
  line_color = d3.scaleOrdinal().domain(track_states).range(["#1f77b4", "#aec7e8",  "#ff7f0e",  "#ffbb78",  "#2ca02c",  "#98df8a",  "#d62728",  "#ff9896",  "#9467bd",  
  "#c5b0d5",  "#8c564b",  "#c49c94",  "#e377c2",  "#f7b6d2",  "#7f7f7f",  "#c7c7c7",  "#bcbd22",  "#dbdb8d",  "#17becf",  "#9edae5"]);
} 
else{
var min = deviate_check_lower;
var max =deviate_check_upper;
var d = (max-min)/8;
var line_color2 = d3.scaleLinear().domain([min + d*7,min + d*6,min + d*5,min + d*4,min + d*3,min + d*2,min]).interpolate(d3.interpolateRgb).range(['#00429d', '#4771b2', '#73a2c6', '#a5d5d8', /*'#ffffe0',*/ '#ffbcaf','#f4777f', '#cf3759', '#93003a']);
var Rgbdict={}
for(var key in track_states_ranged_dictionary){
  Rgbdict[key]=line_color2(track_states_ranged_dictionary[key])
}
line_color=d3.scaleOrdinal().domain(Object.keys(Rgbdict)).range(Object.values(Rgbdict))
  }  
}
//---------------------------------------------------------------------------- Tracking ends here

if(this.props.chart_scale_type=="predicted"){
for(var i=0;i<selected_by_year_data.length;i++){
  var tempA={}
  var tempB={}
  var tempC={}
  var tempD={}
    tempC["Model"]=cmodel
    tempC["name"]=selected_by_year_data[i]["State"]
    tempC["rank"]=selected_by_year_data[i]["two_realRank"]
    tempD["name"]=selected_by_year_data[i]["State"]
    tempD["rank"]=selected_by_year_data[i][cmodel]
    mydata4["C"].push(tempC)
    mydata4["D"].push(tempD)
  if(parseInt(selected_by_year_data[i][model_name])>start_range && parseInt(selected_by_year_data[i][model_name])<=end_range){
    tempA["Model"]=model_name
    tempA["name"]=selected_by_year_data[i]["State"]
    tempA["rank"]=selected_by_year_data[i]["two_realRank"]
    tempB["name"]=selected_by_year_data[i]["State"]
    tempB["rank"]=selected_by_year_data[i][model_name]
    mydata3["A"].push(tempA)
    mydata3["B"].push(tempB)  
  }

}
}
else{
for(var i=start_range;i<end_range;i++){
  var tempA={}
  var tempB={}
  tempA["Model"]=model_name
  tempA["name"]=selected_by_year_data[i]["State"]
  tempA["rank"]=selected_by_year_data[i]["two_realRank"]
  tempB["name"]=selected_by_year_data[i]["State"]
  tempB["rank"]=selected_by_year_data[i][model_name]
  mydata3["A"].push(tempA)
  mydata3["B"].push(tempB)
}
}
  if(this.props.histogram_data.length>0){ 
    //------------ Slopechart 2
    slopechart2.CreateSlopeChart2(this.node,mydata3,parent_width,start_range+1,end_range,deviate_check_lower,
      deviate_check_upper,this.props.model_name,this.props.year,this.props.appHandleChange,
      this.props.sparkline_data,this.props.original_data,this.props.histogram_data,this.textClickHandler_original,line_color) 
    //------------        
  }
  else if(this.props.chart_scale_type=="predicted"){
    //------------ Slopechart 3
    slopechart3.CreateSlopeChart1(this.node,mydata3,mydata4,parent_width,start_range+1,end_range,deviate_check_lower,
      deviate_check_upper,this.props.model_name,this.props.year,this.props.appHandleChange,
      this.props.sparkline_data,this.props.original_data,this.props.histogram_data,this.textClickHandler_original,this.props.cmodel,line_color) 
    //------------        
  }
  else{
    //------------ Slopechart 1
    slopechart1.CreateSlopeChart1(this.node,mydata3,parent_width,start_range+1,end_range,deviate_check_lower,
      deviate_check_upper,this.props.model_name,this.props.year,this.props.appHandleChange,
      this.props.sparkline_data,this.props.original_data,this.props.histogram_data,this.textClickHandler_original,line_color) 
    //------------        
  }

}
task2=(className)=>{
  //--------------
  var opacity=".4"
  var opacity2=".06"
    d3.selectAll(".mysvg").selectAll("text").attr("fill-opacity",opacity)
    d3.selectAll(".mysvg").selectAll("path").attr("fill-opacity",opacity).attr("stroke-opacity",opacity)
    d3.selectAll(".mysvg").selectAll("circle").attr("fill-opacity",opacity).attr("stroke-opacity",opacity)
    d3.selectAll(".mysvg").selectAll("line").attr("opacity",opacity)
    d3.selectAll('.exp_circles').attr("fill-opacity",opacity2).attr("stroke-opacity",opacity2)
    d3.selectAll("."+className).classed("highlighted",true)
    d3.selectAll("."+className).filter("line").classed("highlighted_line",true)
}
  textClickHandler_original=(className,state_name)=>{
    this.props.slopechart_clickHandler(className,state_name)
    }
  render() {
    if(this.props.model_name == this.props.cmodel){
      return (
      <div key={this.props.model_name} className="slopechart slopechart_cmodel" style={{width:'100%'}}>
          <div className="slope_chart_title">
            <p>True Rank</p>
            <p className="model_title">{this.props.model_name}</p>
            <p>Predicted Rank</p>
          </div>
          <div className="mysvg" ref={node => this.node = node}><svg id={this.props.model_name}></svg></div>
          
      </div>
    );
    }
    else{
      return (
      <div key={this.props.model_name} className="slopechart" style={{width:'100%'}}>
          <div className="slope_chart_title">
            <p>True Rank</p>
            <p className="model_title">{this.props.model_name}</p>
            <p>Predicted Rank</p>
          </div>
          <div className="mysvg" ref={node => this.node = node}><svg id={this.props.model_name}></svg></div>
          
      </div>
    );
    }

  }
}
export default SlopeChart;