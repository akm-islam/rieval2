
import * as d3 from 'd3';
import * as $ from 'jquery';
import * as sparkline2 from "../Algorithms/sparkline2";
import * as sparkline1 from "../Algorithms/sparkline1";
export function CreateSlopeChart1(node,grouped_by_year_data,parent_width,start_range,end_range,deviate_check_lower,
    deviate_check_upper,model_name,year,appHandleChange,sparkline_data,original_data,histogram_data,textClickHandler_original,
    line_color){
    var sparkline_data_key=null;
    var number_of_elements=end_range-start_range; // 
    var all_together = [];
    grouped_by_year_data["A"].forEach(function(d) {all_together.push(d);});
    grouped_by_year_data["B"].forEach(function(d) {all_together.push(d);});
    var nestedByName = d3.nest().key(function(d) { return d.name }).entries(all_together);
        var margin = {top: 10, right: 70, bottom: 10, left: 160};
        var width = parent_width - margin.left - margin.right;
        var height_between=20
        if(number_of_elements*height_between<700){height_between=700/number_of_elements}
        var	height = number_of_elements*height_between;
        var svg = d3.select("#"+model_name)
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
        var config = {yOffset: 0,width: width,height: height,labelGroupOffset: 1,labelKeyOffset: 55,radius: 3,sparkline_height:height_between} 
        var yScale = d3.scaleLinear().range([0,height]).domain([start_range, end_range]);
        var var_to_lift_up=yScale(nestedByName[0].values[0].rank); // nestedByName[5] places the 5th element at the beginning
    //--Ractangle that sets the boundary of lines  
          var borderLines = svg.append("g").attr("class", "border-lines")
          borderLines.append("line").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", config.height); // left line x1,x2,y1 0 and y2 is the height
          borderLines.append("line").attr("x1", width).attr("y1", 0).attr("x2", width).attr("y2", config.height); // right line starts at x1,x2 at width and goes until height
//------------------------------------------Slope drawing starts here
        var slopeGroups_upd= svg.selectAll("g").data(nestedByName,d=>{
          if(d!== undefined){
            return d;
          }
        })
        var slopeGroups_Enter=slopeGroups_upd.enter().append("g").attr("class", "slope-group")
        slopeGroups_Enter.merge(slopeGroups_upd).attr('transform',`translate(20,20)`)
        slopeGroups_upd.exit().remove()

        var slopeLines = slopeGroups_Enter.append("line")
        slopeLines.attr("class", "slope-line") // 49.49
        .attr("x1", 0).attr("y1", function(d){         
          return yScale(d.values[0].rank)-var_to_lift_up; 
        })
        .attr("class",(d)=>"myid"+d.values[0].rank)
          .attr("x2", config.width)
      //.merge(slopeGroups_upd.select("line")) // merge starts here (https://stackoverflow.com/questions/49707737/d3-v4-transition-on-entering-elements-using-general-update-pattern-with-merge)
      .transition().duration(5000).attr("y2", function(d) {
        return yScale(d.values[1].rank)-var_to_lift_up;
    }).on("end", function () {
      slopeLines.merge(slopeGroups_upd.select("line"))
    })
      .attr("stroke",(d)=> {
        if(d.values[0].rank<deviate_check_lower){
          return "transparent";
        }
        else if(d.values[0].rank>deviate_check_upper){
          return "transparent";
        }
        else{
          return line_color(d.key)
          //return "rgb(110, 112, 112)"
        } 
      })
      /*
      .on("click", function(d) {
        if(d.values[0].rank<deviate_check_lower || d.values[0].rank>deviate_check_upper ){}else{return textClickHandler_original("myid"+d.values[0].rank,d.key,textClickHandler_original)}		
        });
*/
        

      var newlines=svg.selectAll("line").data(nestedByName)
      console.log("anim",newlines)
//---------------------------------------------------------------------------
      var leftSlopeLabels = slopeGroups_Enter.append("g").attr("class", "slope-label-left")
        .each(function(d) {
          d.xLeftPosition = -config.labelGroupOffset;
          d.yLeftPosition = yScale(d.values[0].rank)-var_to_lift_up;
        });
    
    //------------------------------------------Left side
          var leftSlopeCircle = slopeGroups_Enter.append("circle").attr("r",d=>{
            if(d.values[0].rank<deviate_check_lower){
              return 0
            }
          else if(d.values[0].rank>deviate_check_upper){
            return 0
            }
            else{return config.radius}
          })
          .attr("cy", d => yScale(d.values[0].rank)-var_to_lift_up)
          .attr("class",(d)=>
          {
            return d.values[0].name.replace(/ /g,'').replace(/[^\w\s]/gi, '')+" myid"+d.values[0].rank+" circles_left"
          })
          .attr("fill",function(d) {
            if(d.values[0].rank<deviate_check_lower){
              //return line_color(d);
              return "rgb(110, 112, 112,.5)";
            }
            else if(d.values[0].rank>deviate_check_upper){
              //return line_color(d);
              return "rgb(110, 112, 112,.5)";
            }
            else{
                 return line_color(d.key);
              }
          });
    //----------
          var leftSlopeLabels = slopeGroups_Enter.append("g").attr("class", "slope-label-left")
              .each(function(d) {
              d.xLeftPosition = -config.labelGroupOffset;
              d.yLeftPosition = yScale(d.values[0].rank)-var_to_lift_up;
            });
    //----------
          leftSlopeLabels.append("text")
              .attr("class", "label-figure").attr("class",(d)=> "myid"+d.values[0].rank)
              .attr("x", d => d.xLeftPosition)
                    .attr("y", d => d.yLeftPosition)
            .attr("dx", -10)
            .attr("dy", 3)
            .attr("text-anchor", "end")
            .text(d => (d.values[0].rank))
            .attr("fill",function(d) {
              if(d.values[0].rank<deviate_check_lower){
                //return line_color(d.key);
                return "rgb(110, 112, 112,.5)";
              }
              else if(d.values[0].rank>deviate_check_upper){
                //return line_color(d.key);
                return "rgb(110, 112, 112,.5)";
              }
              else{
                 return line_color(d.key);
              }
            });
    //-------------------------------------------Important text   
    // Define the div for the tooltip
    var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);

    leftSlopeLabels.append("text")
            .attr("x", d => d.xLeftPosition)
                    .attr("y", d => d.yLeftPosition)
            .attr("dx", -config.labelKeyOffset)
            .attr("dy", 3)
            .attr("id","slopechart_text")
            .attr("class",(d)=>{
              sparkline_data_key=d.key
              return "myid"+d.values[0].rank
            })
            .attr("text-anchor", "end")
            .on("mouseover", function(d) { //-------Tooltip starts		
              div.transition()		
                  .duration(200)		
                  .style("opacity", .97);		
              div.html("<p>"+d.key+"</p>"+"<p>"+"Predicted rank: "+d.values[1].rank+"</p>")	
                  .style("left", ((d)=>{
                    var left_div_width=$('.Sidebar_parent').width()
                    return left_div_width-125 + "px"	
                  }))
                  .style("top", (d3.event.pageY - 40) + "px");	
              })					
          .on("mouseout", function(d) {		
              div.transition()		
                  .duration(500)		
                  .style("opacity", 0);	
          }) // Tooltip ends
            .on("click", function(d) {
              if(d.values[0].rank<deviate_check_lower || d.values[0].rank>deviate_check_upper ){}else{return textClickHandler_original("myid"+d.values[0].rank,d.key,textClickHandler_original)}		
              })					
            .text(d =>{ 
              var val=d.key
              if(val.length>15){val=val.replace("University", "U")}
              return val.length>15?val.substring(0,15)+'..':val})
            .attr("fill",function(d) {
              if(d.values[0].rank<deviate_check_lower){
                return "rgb(110, 112, 112,.5)";
              }
              else if(d.values[0].rank>deviate_check_upper){
                return "rgb(110, 112, 112,.5)";
              }
              else{
                 return line_color(d.key);
              }
            })
    //---------------------------------------------------------------------------set the dimensions and margins of the graph
    var s_margin = {top: 0, right: 0, bottom: 0, left: 0},
    s_width=config.labelKeyOffset/2 -3,
    s_height=config.sparkline_height - 2;
    // append the s_svg object to the body of the page
    var s_svg = leftSlopeLabels.append("svg")
    .attr('class',d=>model_name.replace(".", "stupid")+d.values[1].name.replace(/ /g,'').replace(/[^\w\s]/gi, '')+'original')
        .attr("x", d =>{
          var className=model_name.replace(".", "stupid")+d.values[1].name.replace(/ /g,'').replace(/[^\w\s]/gi, '')+'original'
          if(d.values[0].rank<deviate_check_lower || d.values[0].rank>deviate_check_upper){var sparkline_color="grey"}else{var sparkline_color=line_color(d.key)}
          sparkline1.sparklineGen(className,sparkline_data,d.key.replace(/ /g,'').replace(/[^\w\s]/gi, ''),d.key,year,appHandleChange,d.values[0].rank,sparkline_color)
          return d.xLeftPosition - config.labelKeyOffset +3;
        })
        .attr("y", d => d.yLeftPosition - 14)
        .append("g")
        .attr("transform",
              "translate(" + s_margin.left + "," + s_margin.top + ")");
              
    //------------------------------------------Right side      
          var rightSlopeCircle = slopeGroups_Enter.append("circle")
              .attr("r",d=>{
                if(d.values[0].rank<deviate_check_lower){
                  return 0
                }
              else if(d.values[0].rank>deviate_check_upper){
                return 0
                }
                else{return config.radius}
              })
              .attr("cx", config.width)
              .attr("cy", d => yScale(d.values[1].rank)-var_to_lift_up).attr("class",(d)=>
          {
            return d.values[0].name.replace(/ /g,'').replace(/[^\w\s]/gi, '')+" circles_right myid"+d.values[0].rank
          })
              .attr("fill",(d) =>{
                  if(!(d.values[0].rank<deviate_check_lower | d.values[0].rank>deviate_check_upper)){
                      return line_color(d.key);
                  }
              });
          
          var rightSlopeLabels = slopeGroups_Enter.append("g")
              .attr("class", "slope-label-right")
              .each(function(d) {
              d.xRightPosition = width + config.labelGroupOffset;
              d.yRightPosition = yScale(d.values[1].rank)-var_to_lift_up;
            });
          
          rightSlopeLabels.append("text")
              .attr("class", "label-figure")
                    .attr("x", d => d.xRightPosition)
                    .attr("y", d => d.yRightPosition)
            .attr("dx", 10)
            .attr("dy", 3)
            .attr("text-anchor", "start")
            .text(d => {
              if(d.values[0].rank<deviate_check_lower || d.values[0].rank>deviate_check_upper ){
                return "";
              }
              else{
                return d.values[1].rank
              }
            })
            .attr("fill",function(d){
                if(d.values[0].rank<deviate_check_lower || d.values[0].rank>deviate_check_upper ){
                return "";
              }
                else{
                    return line_color(d.key)
                }
            })
            .attr("class",(d)=>"myid"+d.values[0].rank)
            .on("click", function(d) {
              if(d.values[0].rank<deviate_check_lower || d.values[0].rank>deviate_check_upper ){}else{return textClickHandler_original("myid"+d.values[0].rank,d.key,textClickHandler_original)}		
              });
    //--      
             rightSlopeLabels.append("text")
                    .attr("x", d => d.xRightPosition)
                    .attr("y", d => d.yRightPosition)
            .attr("dx", config.labelKeyOffset)
            .attr("dy", 3)
            .attr("text-anchor", "start")
            .text(d => "");
    
    //---------------------------------------------------------------Right sparklines start here
    var s2_margin = {top: 0, right: 0, bottom: 0, left: 0},
    s2_width=config.labelKeyOffset/2 -3,
    s2_height=config.sparkline_height - 2;
    // append the s_svg object to the body of the page
    rightSlopeLabels.append("svg")
    .attr('class',d=>model_name.replace(".", "stupid")+d.values[1].name.replace(/ /g,'').replace(/[^\w\s]/gi, '').split('.').join(' '))
    .attr("x", d =>{
        var className=model_name.replace(".", "stupid")+d.values[1].name.replace(/ /g,'').replace(/[^\w\s]/gi, '').split('.').join(' ')
        sparkline2.sparklineGen(className,sparkline_data,d.key.replace(/ /g,'').replace(/[^\w\s]/gi, ''),model_name,original_data,d.key,year,appHandleChange,d.values[0].rank,line_color(d.key))
        return d.xRightPosition+27})
        .attr("y", d => d.yRightPosition -14)
        .attr("width",d=>{
          if(d.values[0].rank<deviate_check_lower || d.values[0].rank>deviate_check_upper ){
            return 0;
          }
        })
        .append("g")
        .attr("transform",
              "translate(" + s2_margin.left + "," + s2_margin.top + ")");
    }
    //-----D3 ends here 
    var textClickHandler_original=(idName,state_name,textClickHandler_original)=>{
        textClickHandler_original(idName,state_name)
    }
    // Class Adder (is is the id to find the element and class_name is the class to add)
    var classAdder = (id,class_name)=>{
      var element = document.getElementById(id);
      element.classList.add(class_name);
      }
      // Class Remover
      var classRemover = (id,class_name)=>{
        var element = document.getElementById(id);
        element.classList.remove(class_name);
        }  
    