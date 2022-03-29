import React, { Component } from 'react';
import * as d3 from 'd3';
import * as $ from 'jquery';
import '../components/Chart.css';
import exp1 from "../Data/data/fiscal/lime/chart1_data.csv";
import exp_fiscal_CordAscent from "../Data/data/fiscal/lime/chart1_data.csv";
import exp_fiscal_LambdaMART from "../Data/data/fiscal/lime/chart2_data.csv";
import exp_fiscal_LambdaRank from "../Data/data/fiscal/lime/chart3_data.csv";
import exp_fiscal_LinearReg from "../Data/data/fiscal/lime/chart4_data.csv";
import exp_fiscal_ListNet from "../Data/data/fiscal/lime/chart4_data.csv"; //dummy link
import exp_fiscal_MART from "../Data/data/fiscal/lime/chart6_data.csv";
import exp_fiscal_RandomFor from "../Data/data/fiscal/lime/chart7_data.csv";
import exp_fiscal_RankBoost from "../Data/data/fiscal/lime/chart8_data.csv";
import exp_fiscal_RankNet from "../Data/data/fiscal/lime/chart9_data.csv";
import exp_school_CordAscent from "../Data/data/school/lime/chart1_data.csv";
import exp_school_LambdaMART from "../Data/data/school/lime/chart2_data.csv";
import exp_school_LambdaRank from "../Data/data/school/lime/chart3_data.csv";
import exp_school_LinearReg from "../Data/data/school/lime/chart4_data.csv";
import exp_school_ListNet from "../Data/data/school/lime/chart4_data.csv"; //dummy link
import exp_school_MART from "../Data/data/school/lime/chart6_data.csv";
import exp_school_RandomFor from "../Data/data/school/lime/chart7_data.csv";
import exp_school_RankBoost from "../Data/data/school/lime/chart8_data.csv";
import exp_school_RankNet from "../Data/data/school/lime/chart9_data.csv";
class Chart extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state={mywidth:200,myheight:262} // This is the default height
  }
  componentDidMount(){
    //console.log(this.props.dataset)
      var mywidth=$('.chart_parent_container').width()/3
      this.setState({mywidth:mywidth})
      this.setState({myheight:this.props.height})
      //console.log(mywidth/3)
    this.CreateChart()
  }

//-------------------------------------------------------------------------------------------------------------------------------------CreateChart function
CreateChart=()=>{
  var self=this;
  const node = this.node;
  var year = self.props.year;
  var number_of_filters_start = self.props.state_range[0];
  var number_of_filters_end = self.props.state_range[1];
  var dataset = this.props.dataset;
  var formatSuffix = d3.format(".0s");
  var formatDecimal = d3.format(".2f");
  var xmin = 0;
  var xmax = 0;
  var filename;

  if(self.props.model_name == "ListNet"){

  }
  if(dataset=="fiscal"){
    if(self.props.model_name == "CordAscent"){filename = exp_fiscal_CordAscent;}
    else if(self.props.model_name == "LambdaMART"){filename = exp_fiscal_LambdaMART;}
    else if(self.props.model_name == "LambdaRank"){filename = exp_fiscal_LambdaRank;}
    else if(self.props.model_name == "LinearReg"){filename = exp_fiscal_LinearReg;}
    else if(self.props.model_name == "ListNet"){filename = exp_fiscal_ListNet;}
    else if(self.props.model_name == "MART"){filename = exp_fiscal_MART;}
    else if(self.props.model_name == "RandomFor"){filename = exp_fiscal_RandomFor;}
    else if(self.props.model_name == "RankBoost"){filename = exp_fiscal_RankBoost;}
    else if(self.props.model_name == "RankNet"){filename = exp_fiscal_RankNet;}
  }
  else if(dataset == "school"){
    if(self.props.model_name == "CordAscent"){filename = exp_school_CordAscent;}
    else if(self.props.model_name == "LambdaMART"){filename = exp_school_LambdaMART;}
    else if(self.props.model_name == "LambdaRank"){filename = exp_school_LambdaRank;}
    else if(self.props.model_name == "LinearReg"){filename = exp_school_LinearReg;}
    else if(self.props.model_name == "ListNet"){filename = exp_school_ListNet;}
    else if(self.props.model_name == "MART"){filename = exp_school_MART;}
    else if(self.props.model_name == "RandomFor"){filename = exp_school_RandomFor;}
    else if(self.props.model_name == "RankBoost"){filename = exp_school_RankBoost;}
    else if(self.props.model_name == "RankNet"){filename = exp_school_RankNet;}
  }
  //var filename = "exp_"+dataset+"_"+((self.props.model_name).toString()).replace(".","");
  //console.log(dataset);
  var exp_feature = "Noncurrent Liabilities";

  var svg = d3.select(node);
  /*if(this.props.mykey==0 ||this.props.mykey==3||this.props.mykey==6){
    var margin = {top: 20, right: 5, bottom: 85, left: 40} // top: 20, right: 40, bottom: 130, left: 40
    var width = this.state.mywidth + margin.left - margin.right
  }
  else{
    var margin = {top: 20, right: 5, bottom: 85, left: -11}
    var width = this.state.mywidth + 0 - margin.right;
  }*/
  var margin = {top: 20, right: -68, bottom: 55, left: -10.85} // top: 20, right: 40, bottom: 130, left: 40
    var width = this.state.mywidth + margin.left - margin.right

  var height = this.state.myheight - margin.top - margin.bottom;


  if(self.props.model_name == "ListNet"){
    svg.append("text")
              .text("The explanation does not exists")
              .style("font-family","'Open Sans'")
              .attr("x", 30)
              .attr("y", 120);
    return;
  }

  d3.csv(filename, function(error, data) {
    error =error;
    data = data;
    //console.log(data)
    var chartname = ((self.props.model_name).toString()).replace(".",""); //cannot afford to keep dots in chartname
    var data = data.filter(function (d) {
        if (d["1-qid"] == year) {
          return d;
        }
      });    
    var data = data.filter(function (d) {
        return (parseInt(d.two_realRank) >= number_of_filters_start && parseInt(d.two_realRank) <= number_of_filters_end)
      }); //data2 will select only those ranks which are in the filter range

    //***** Feature sorting starts *****
      var all_columns = d3.keys(data[0]);
      var feature_rank_column_names = [];
      var feature_rank_column_sum = [];
      var feature_rank_column_names_sorted = [];
      for(var i=0;i<all_columns.length;i++){
        if(all_columns[i].endsWith("_feature_rank")){
          feature_rank_column_names.push(all_columns[i]);
          var temp2 = all_columns[i];
          var sum = d3.sum(data, function(d) { return d[temp2]; });
          feature_rank_column_sum.push(sum);
        } //end of endsWith if loop
      }// end of for loop checking for feature_rank columns
      
      var feature_rank_column_sum_unsorted =  feature_rank_column_sum.slice();
      feature_rank_column_sum.sort(function(a, b){return a-b}); //ascending sort
      //console.log(feature_rank_column_sum);
      for(var i=0;i<feature_rank_column_sum.length;i++){
        var temp2 = feature_rank_column_sum_unsorted.indexOf(feature_rank_column_sum[i]);
        var temp3 =(feature_rank_column_names[temp2]).toString();
        var temp4 = temp3.replace("_feature_rank","");
        if(!feature_rank_column_names_sorted.includes(temp4)){feature_rank_column_names_sorted.push(temp4);}
        else{
          var temp2_x = feature_rank_column_sum_unsorted.indexOf(feature_rank_column_sum[i],(temp2 + 1));//checks for the next instance in case of a tie
          var temp3_x =(feature_rank_column_names[temp2_x]).toString();
          var temp4_x = temp3_x.replace("_feature_rank","");
          feature_rank_column_names_sorted.push(temp4_x);}
      }
      //console.log(feature_rank_column_names_sorted);
      //console.log(self.props.state_range);
      exp_feature=feature_rank_column_names_sorted[self.props.mykey];
//---------------------------------------------------------------------------
    
// Chart Preprocessing Starts
    var exp_feature_contribution = exp_feature+"_contribution";
    var type_of_axis = "numerical";
    if(isNaN(data[0][exp_feature])){type_of_axis = "categorical";} //checking for type of axis
    else{type_of_axis = "numerical";}
    if(type_of_axis == "numerical"){
      var x = d3.scaleLinear().rangeRound([0, width]),
            y = d3.scaleBand().rangeRound([height, 0]).padding(0.5);
    }
    else{
      var x = d3.scaleBand().rangeRound([0, width]).padding(0.5),
            y = d3.scaleBand().rangeRound([height, 0]).padding(0.5);
    }
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var xAxis = d3.axisBottom(x).ticks(5);
    var yAxis = d3.axisLeft(y).ticks(0).tickSize(0);//.tickCenterLabel(true);

    // gridlines in y axis function
    function make_y_gridlines() {
      return d3.axisLeft(y)
              .ticks(0).tickSize(0);
    }

// *****Chart Preprocessing Ends*****
    if (error) { // 1516 is the actual count
      console.log(error);
      svg.append("text")
              .text("The explanation does not exists")
              .attr("x", 130)
              .attr("y", 190);
    } 
      else {
  
      //Reclassifying the y-axis
      var ymin = d3.min(data, function (d) {
        return parseFloat(parseFloat(d[exp_feature_contribution]).toFixed(4));
      });
      var ymax = d3.max(data, function (d) {
        return parseFloat(parseFloat(d[exp_feature_contribution]).toFixed(4));
      });
      var y_greater = (Math.abs(ymin) < Math.abs(ymax)) ? ymax : ymin;
      var y_limit = 0.25 * Math.abs(y_greater);
      var original_contribution_value = parseFloat(data[exp_feature_contribution]);
      //data.feature_contribution_binned = (original_contribution_value>=0)?((original_contribution_value>=y_limit)?"A":"B"):((Math.abs(original_contribution_value)>=y_limit)?"C":"D");
      for (i = 0; i < data.length; i++) {
        var temp4 = data[i];
        var original_contribution_value = parseFloat(temp4[exp_feature_contribution]);
        data[i].feature_contribution_binned = (original_contribution_value >= 0) ? ((original_contribution_value >= y_limit) ? "++" : "+") : ((Math.abs(original_contribution_value) >= y_limit) ? "--" : "-");
        data[i].idname = data[i].State.replace(/[\.,\s+]/g, '');

      }

      // Define Extent for each Dataset
      if(type_of_axis == "numerical"){
        xmin = d3.min(data, function (d) {return parseFloat(d[exp_feature]);});
        xmax = d3.max(data, function (d) {return parseFloat(d[exp_feature]);});
        var xmin_ = 1.3 * xmin; //Adding buffers to the xmin and xmax; needs to be modified
        var xmax_ = 1.3 * xmax;
        x.domain([xmin, xmax]);
      }
      else{
        x.domain(data.map(function(d) { return d[exp_feature]; }));
      }
      y.domain(["--", "-", "+", "++"]);
      // add the Y gridlines
      svg.append("g")
              .attr("class", "grid")
              .attr("transform",()=>{
              if(self.props.mykey==0 ||self.props.mykey==3||self.props.mykey==6){
                return "translate(31,20)";
              }
              else{
                return "translate(31,20)"; //(-1,20)
              }   
            })
              .call(make_y_gridlines()
                      .tickSize(-width)
                      .tickFormat("")
              );
      // Add Axes
      // X AXIS
      //console.log(type_of_axis)
      g.append("g")
              .attr("class", "axis axis--x")
              .attr("transform",()=>{
                if(type_of_axis == "categorical"){
                  return "translate(10," + height + ")"
                }
                else{
                  return "translate(10," + height + ")"
                }
                
              })  
              .call(xAxis)
              .append("text")
              .attr("class", "exp_label")
              .attr("fill", "black")
              .attr("x", ()=>{
              if(self.props.mykey==0 ||self.props.mykey==3||self.props.mykey==6){
                return (0.71 * width) //0.4
              }
              else{return (0.71 * width);} //0.6
              })
              .attr("y", (-1 * height)-7)  //original was -6
              .style("text-anchor", "end")
              .style("font-size", "1.3em")
              .style("font-family","'Open Sans'")
              .text(exp_feature);
      g.selectAll(".tick text")
              //.call(wrap, x.bandwidth())
              .attr("transform", "translate(-22)rotate(-90)")
              .style("font-family","'Open Sans'")
              .text(function(d){if(type_of_axis == "categorical"){ return d;} else if(type_of_axis == "numerical" & !(Math.abs(xmax)<=5.5)){ return formatSuffix(d);} else if(Math.abs(xmax)<=5.5){ return formatDecimal(d);} else{ return d;}}) //If xmax less than 5.5, then considered for normal unformatted display
              .attr("y", 17)
              .attr("dx", -30);
      // Y AXIS
      g.append("g")
              .attr("class", "axis axis--y " + chartname + " exp" +self.props.mykey)
              .attr("transform", "translate(10,0)")   //translate(height,10)
              .call(yAxis)
              .append("text")
              .attr("class", "label")
              .attr("fill", "black")
              .attr("transform", "rotate(-90)")
              .attr("x", -75)
              .attr("y", -40)
              .attr("dy", "1.7em")
              .attr("text-anchor", "end")
              .style("font-size", "1.3em")
              .style("font-family","'Open Sans'")
              .text("contribution");

      var jitterWidth = 15;

      g.selectAll(".bar")
              .data(data)
              .enter().append("circle")
              .attr("class", function (d) {
                //console.log(d['two_realRank'])
                return "myid" + d['two_realRank']
                //.attr("class",(d)=>"myid"+d.values[0].rank)
              })
              //.attr("cx", function(d) { if(top_5_features.indexOf(d.feature) != -1){return (x(d.feature)+ x.bandwidth()/2 - Math.random()*jitterWidth );} else{return (x("others")+ x.bandwidth()/2 - Math.random()*jitterWidth );} })
              .attr("cx", function (d) {
                {
                  return (x(d[exp_feature]) + 12);
                }
              })
              .attr("cy", function (d) {
                var y_gap = (d[exp_feature_contribution] < 0) ? 20 : 20;
                return (y(d.feature_contribution_binned) + y_gap + y.bandwidth() / 2 - Math.random() * jitterWidth);
              })
              .attr('r', 2.5)
              .attr("fill", "black")
              .attr("stroke", "black")
              .style("opacity", "0.5")
              .attr("hover_story_dots", "hover_true")
              .attr("hover_story_dots_data", function (d) {
                return String(d.feature_contribution_binned + ",    " + d[exp_feature]);
              });

              d3.selectAll("g.axis--y." + chartname + ".exp" + self.props.mykey + " g.tick").attr("transform", function (d, i) {
                  var value_ = 70;
                  if (i == 3) {value_ = 52;}
                  else if (i == 2) {value_ = 95;}
                  else if (i == 1) {value_ = 135;}
                  else if (i == 0) {value_ = 172;};
              return "translate(0," + value_ + ")";}); //tick position re-inforcement algorithm

              d3.selectAll("svg." + chartname + "_" + self.props.mykey + "_lime_exp g.grid g.tick").style("stroke-width", function (d, i) {if (i == 1) {return "3"}});
              //d3.selectAll("svg." + chartname + "_" + self.props.mykey + "_lime_exp g.grid g.tick text").text(function (d, i) {if (i == 1) {return "0"}});
              d3.selectAll("svg." + chartname + "_" + self.props.mykey + "_lime_exp g.grid g.tick").attr("transform", function (d, i) {if (i == 0) {return "translate(12,156)";} else if(i == 1){return "translate(0,115)"} else if(i == 2){return "translate(12,74)";} else if(i==3){return "translate(0,33)";}}); //reducing starting points of certain gridlines
              d3.selectAll("svg." + chartname + "_" + self.props.mykey + "_lime_exp g.grid g.tick line").attr("x2",function (d, i) {if (i == 0) {return 227;} else if(i == 1){return 227;} else if(i == 2){return 227;} else if(i==3){return 227;}}).attr("x1",function (d, i) {if (i == 0) {return -20;} else if(i == 1){return -35;} else if(i == 2){return -20;} else if(i==3){return -35;}}); //reducing size of the reduced gridlines


    }//end of else

  
})
}

  render() {
    return (
          <div style={{height:this.state.myheight,width:this.state.mywidth,backgroundColor:'grey'}}><svg className={'explanation '+((this.props.model_name).toString()).replace(".","")+"_"+this.props.mykey+"_lime_exp"} style={{height:this.state.myheight,width:this.state.mywidth,marginLeft:0}} ref={node => this.node = node}></svg></div>
    );
  }
}
export default Chart;