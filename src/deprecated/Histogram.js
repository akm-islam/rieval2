import React, { Component,PureComponent } from 'react';
import * as d3 from 'd3';
import * as $ from 'jquery';
import './Histogram.css';
import * as histAlgo from "../../Algorithms/histAlgo";
import exp_fiscal_CordAscent from "../../Data/data/fiscal/lime/chart1_data.csv";
import exp_school_CordAscent from "../../Data/data/school/lime/chart1_data.csv";
import exp_sport_CordAscent from "../../Data/data/sport/lime/chart1_data.csv";

class Barchart extends Component {
constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state={mywidth:100,myheight:120,range:null,original_data:null} // This is the default height
  }
componentDidMount(){
    this.setState({mywidth:this.props.width})
    var filename;
    if(this.props.dataset=="fiscal"){filename=exp_fiscal_CordAscent}
    else if(this.props.dataset=="school"){filename=exp_school_CordAscent}
    else if(this.props.dataset=="sport"){filename=exp_sport_CordAscent}
    this.dataprocessor(filename,this.props.feature)
  }
  dataprocessor=(filename,feature)=>{
    var self=this
    d3.csv(filename).then(function (data) {
      myDataIsReady(data)
    });
 function myDataIsReady(original_data) {
    var temp=[]
    original_data.forEach(element => {
      if(element["1-qid"]==self.props.year){
        var temp_dict={}
        temp_dict["x"]=parseInt(element['two_realRank'])
        temp_dict["y"]=element[feature]
        temp.push(temp_dict)
      }
    });
    self.CreateChart(temp)
    self.setState({original_data:original_data})
 }
 }
//-------------------------------------------------------------------------------------------------------------------------------------CreateChart function
CreateChart=(data)=>{
var n_ticks=4;
var self=this;
const node = this.node;
var svg = d3.select(node),
  margin = {top: 30, right: 5, bottom: 20, left: 5},
  width = this.props.width - margin.left - margin.right,
  height = this.state.myheight - margin.top - margin.bottom;
if(isNaN(data[0].y)){
//-----------------------------------------------------------Barchart starts here (handle the categorical features here)
var occur={}
data.map(item=>{
  if(item.y in occur){
    occur[item.y]=occur[item.y]+1
  }
  else{
    occur[item.y]=1
  }
})
//----------------------------------
var x = Object.keys(occur);
var y = Object.values(occur);
//console.log(x,y)
var yScale=d3.scaleLinear().domain([0,d3.max(y)]).range([0,height])
var xScale=d3.scaleBand().domain(y).range([0,width])
var xAxisScale=d3.scalePoint().domain(x).range([0,width])
svg.append("text").attr("class","hist_title").attr("y", 15).attr("x", width/ 2).attr("text-anchor", "middle").text(this.props.feature);
var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    g.append('svg').attr('width',width).attr('height',height).selectAll('rect').data(y).enter().append('rect').style('fill','#999999b3').attr('width',15).attr("height",d=> yScale(d)).attr('x',(d,i)=>xScale(d)).attr("y",d=>height-yScale(d))
    g.append("g").attr("class", "axis axis--x").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(xAxisScale)).selectAll("text").style("text-anchor", "start").attr("dx", "0em").attr("dy", "0em").attr("transform", "rotate(90)");
//-----------------------------------------------------------Barchart ends here
//console.log(Object.keys(data),Object.values(data))
}
else{
//-----------------------------------------------------------
var xmap= data.map(function(d,i){ return d.x; }) 
var map = data.map(function(d,i){ return parseFloat(d.y); })
var formatCount = d3.format(",.0f");
svg.append("text").attr("class","hist_title").attr("y", 15).attr("x", width/ 2).attr("text-anchor", "middle").text(self.props.feature.replace(/_/g,' '));
//var mybins=histAlgo.binmaker(data,4)
var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var x = d3.scaleLinear().rangeRound([0, width]).domain([d3.min(map),d3.max(map)]);
var bins = d3.histogram().domain(x.domain()).thresholds(x.ticks(n_ticks))
(map);
var y = d3.scaleLinear().domain([0, d3.max(bins, function(d) { return d.length; })]).range([height, 0]);
var bar = g.selectAll(".bar").data(bins).enter().append("g").attr("class", "bar")
  .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });
bar.append("rect").attr("x", 0)
.attr("width",(d,i)=> {
  if(i==0){return x(x.ticks(n_ticks)[i])}
  if(i==x.ticks(n_ticks).length){return x(x.domain()[1])-x(x.ticks(n_ticks)[i-1])}
  else{return x(x.ticks(n_ticks)[i])-x(x.ticks(n_ticks)[i-1])}
})
.attr("height", function(d) { return height - y(d.length); });

bar.append("text").attr("dy", ".75em").attr("y", -10).attr("x",(d,i)=> {
  if(i==(bins.length-1)){ return (x(x.domain()[1])-x(x.ticks(n_ticks)[i-1]))/2}
  return x(bins[0].x1)/ 2
})
  .attr("text-anchor", "middle").text(function(d) { return formatCount(d.length); });
  if(x.domain()[1]>99 && x.domain()[1]<1e6){
  g.append("g").attr("class", "axis axis--x")
  .attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).ticks(n_ticks).tickFormat(d3.formatPrefix(".1", 1e6)));  
}
else if(x.domain()[1]>1e6){
g.append("g").attr("class", "axis axis--x")
.attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).ticks(n_ticks).tickFormat(d3.formatPrefix(".1", 1e9)));  
}
else{
  g.append("g").attr("class", "axis axis--x")
  .attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x).ticks(n_ticks));
  }
}
//----------------------------------------------------------- Histogram creation ends here

var selectionRect = {
element			: null,
previousElement : null,
currentY		: 0,
currentX		: 0,
originX			: 0,
originY			: 0,
setElement: function(ele) {
  this.previousElement = this.element;
  this.element = ele;
},
getNewAttributes: function() {
  var x = this.currentX<this.originX?this.currentX:this.originX;
  var y = this.currentY<this.originY?this.currentY:this.originY;
  var width = Math.abs(this.currentX - this.originX);
  var height = Math.abs(this.currentY - this.originY);
  return {x:x,y:y,width: width,height:height}; // returning the javascript object
},
getCurrentAttributes: function() {
  // use plus sign to convert string into number
  var x = +this.element.attr("x");
  var y = +this.element.attr("y");
  var width = +this.element.attr("width");
  var height = +this.element.attr("height");
  return {x1:x,y1:y,x2:x + width,y2:y + height}; // returning the javascript object
},
getCurrentAttributesAsText: function() {
  var attrs = this.getCurrentAttributes();
  return "x1: " + attrs.x1 + " x2: " + attrs.x2 + " y1: " + attrs.y1 + " y2: " + attrs.y2;
},
init: function(newX, newY) {
  var rectElement = svg.append("rect")
  .attr('rx',1).attr('ry',1).attr("x",0).attr("y",0)
  .attr('width',0).attr('height',0).classed("selection", true);    
  this.setElement(rectElement);
  this.originX = newX;
  this.originY = newY;
  this.update(newX, newY);
},
update: function(newX, newY) {
  this.currentX = newX;
  this.currentY = newY;
  var NewAttr=this.getNewAttributes()
  this.element.attr("x",NewAttr.x).attr("y",NewAttr.y)
  .attr('width',NewAttr.width).attr('height',NewAttr.height)
},
focus: function() {
  this.element
	  .style("stroke", "")
	  .style("stroke-width", "1");
},
remove: function() {
  this.element.remove();
  this.element = null;
},
removePrevious: function() {
  if(this.previousElement) {
	  this.previousElement.remove();
  }
}
};

//-----------------
function dragStart() {
var p = d3.mouse(this);
selectionRect.init(p[0], p[1]);
selectionRect.removePrevious();
}
function dragMove() {
var p = d3.mouse(this);
selectionRect.update(p[0], p[1]);
}
function dragEnd() {
var finalAttributes = selectionRect.getCurrentAttributes();
if(finalAttributes.x1!=finalAttributes.x2){
  var myx1=finalAttributes.x1-margin.left
  var myx2=finalAttributes.x2-margin.left
  var temp_range=[x.invert(myx1).toFixed(4),x.invert(myx2).toFixed(4)]

  var statelist=histAlgo.states(self.state.original_data,temp_range,self.props.year,self.props.feature)
  self.props.handleHistogramselection(statelist,"histogram_data")
  //self.props.appHandleChange(statelist,"histogram_data")
}
if(finalAttributes.x2 - finalAttributes.x1 > 1 && finalAttributes.y2 - finalAttributes.y1 > 1){
  // range selected
  d3.event.sourceEvent.preventDefault();
  selectionRect.focus();
} else {
  selectionRect.remove();
}
}
var dragBehavior = d3.drag()
.on("start", dragStart)    
.on("drag", dragMove)
.on("end", dragEnd);
svg.call(dragBehavior);
}
render() {
    return (
        <div className="histogram_div" style={{height:this.state.myheight,width:this.state.mywidth,marginBottom:5}}>
            <svg className="histogram" style={{height:this.state.myheight,width:this.state.mywidth}} ref={node => this.node = node}></svg>
        </div>
    );
  }
}
export default Barchart;

//https://www.youtube.com/watch?v=N9nHQzboCUI