
import * as d3 from 'd3';
import * as $ from 'jquery';
import * as sparkline1 from "./sparkline1";
import * as sparkline2 from "./sparkline2";
export function CreateSlopeChart1(node, grouped_by_year_data, start_range, end_range, deviate_check_lower, deviate_check_upper, 
  model_name, year, appHandleChange, sparkline_data, original_data, histogram_data, textClickHandler_original, line_color, 
  animate, actual_model_for_range_and_time_mode,config) {
  var base_height_between=18
  // we don't need the delay here because the animations are happening one after the another
  var slope_chart_anim1 = config.animation1
  var slope_chart_anim2 = config.animation2
  var number_of_elements = (end_range - start_range); // 
  var all_together = [];
  grouped_by_year_data["A"].forEach(function (d) { all_together.push(d); });
  grouped_by_year_data["B"].forEach(function (d) { all_together.push(d); });
  var nestedByName = d3.nest().key(function (d) { return d.name }).entries(all_together);
  //----------------------------------------------------------------------------------------------Height management
  var margin = { top: 10, right: 70, bottom: 10, left: 160 };
  var slopechart_col_height = $('.slopechart_container').height(),
    slopechart_col_width = $('.slopechart_col').width(),
    width = slopechart_col_width - margin.left - margin.right;
  var height_between = slopechart_col_height / number_of_elements
  if(height_between<base_height_between){height_between=base_height_between}
  var height = (number_of_elements * height_between)-10 // -10 is the bottom margin
  
  d3.selectAll(".slopechart_col").style("height",height+"px");
  d3.selectAll(".exp_chart").style("height", height + "px");

  height = height - 45 // This height is going to be used for slopechart
  var config = { yOffset: 0, width: width, height: height, labelGroupOffset: 1, labelKeyOffset: 55, radius: 3, sparkline_height: height_between }
  //----------------------------------------------------------------------------------------------Height management
  var yScale = d3.scaleLinear().range([0, height]).domain([start_range, end_range]);
  var var_to_lift_up = yScale(nestedByName[0].values[0].rank); // nestedByName[5] places the 5th element at the beginning
  var svg = d3.select("#" + model_name).attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom)
    .select("#myg").attr('transform', `translate(150,10)`)

  var borderLines = svg.selectAll(".border-lines").data([0]).join("g").attr("class", "border-lines") //--Ractangle that sets the boundary of lines  
  borderLines.selectAll(".line1").data([0]).join("line").attr("class", "line1").attr("fill", "black").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", config.height); // left line x1,x2,y1 0 and y2 is the height
  borderLines.selectAll(".line2").data([0]).join("line").attr("class", "line2").attr("fill", "black").attr("x1", width).attr("y1", 0).attr("x2", width).attr("y2", config.height); // right line starts at x1,x2 at width and goes until height
  //---------
  var slopeGroups_upd = svg.selectAll(".datapoint").data(nestedByName, d => {
    if (d !== undefined) {
      return d.key;
    }
  }).join(onEnter, onUpdate, onExit)
  //-----------------------------------------------------------------------------------------------------------------------------------------Enter function starts here
  function onEnter(selection) {

    const makeDatapoint = g => {
      //-----------------------------------------------------------------------------------------------------------------------------------------state name text starts here
      g.append("text")
        .attr("x", d => -config.labelGroupOffset)
        .attr("y", d => yScale(d.values[0].rank) - var_to_lift_up)
        .attr("dx", -config.labelKeyOffset)
        .attr("dy", 3)
        .attr("id", d => "A" + d.key.replace(/ +/g, ""))
        .attr("class", (d) => {
          return "myid" + d.values[0].rank + " state_name" + " slopechart_text"
        })
        .attr("text-anchor", "end")
        .on("mouseover", function (d) { //-------Tooltip starts		
          var div = d3.select("body").append("div")
            .attr("id", "div" + d.key.replace(/ +/g, ""))
            .attr("class", "tooltip")
            .style("opacity", 0)
          div.transition()
            .duration(200)
            .style("opacity", .97)
          div.html("<p>" + d.key + "</p>" + "<p>" + "Predicted rank: " + d.values[1].rank + "</p>")
            .style("left", ((d) => {
              var left_div_width = $('.Sidebar_parent').width()
              return left_div_width - 125 + "px"
            }))
            .style("top", (d3.event.pageY - 40) + "px");
        })
        .on("mouseout", function (d) {
          var myid = "#div" + d.key.replace(/ +/g, "")
          d3.select("body").selectAll(".tooltip").transition()
            .duration(500)
            .style("opacity", 0).remove();
        }) // Tooltip ends
        .on("click", function (d) {
          return textClickHandler_original("A" + d.key)
          /*
          if (d.values[0].rank < deviate_check_lower || d.values[0].rank > deviate_check_upper) {
            if (clicked_items_in_slopechart.includes(d.key.replace(/ +/g, ""))) { return textClickHandler_original("A"+d.key) }
          }
          else { return textClickHandler_original("A"+d.key) }
          */
        })
        .text(d => {
          var val = d.key
          if (val.length > 15) { val = val.replace("University", "U") }
          return val.length > 15 ? val.substring(0, 15) : val
        })
        .attr("fill", function (d) {
          if (d.values[0].rank < deviate_check_lower) {
            return "rgb(110, 112, 112,.5)";
          }
          else if (d.values[0].rank > deviate_check_upper) {
            return "rgb(110, 112, 112,.5)";
          }
          else {
            return line_color(d.key);
          }
        }) //state name text ends here
      //-----------------------------------------------------------------------------------------------------------------------------------------Left sparkline starts here
      g.append("svg")
        .attr('class', d => "svg1 " + model_name + d.values[1].name.replace(/ /g, '').replace(/[^\w\s]/gi, '') + 'original')
        .attr("x", d => {
          return -config.labelGroupOffset - config.labelKeyOffset + 3;
        })
        .attr("id", d => "A" + d.key.replace(/ +/g, ""))
        .attr("y", d => yScale(d.values[0].rank) - var_to_lift_up - 14)
        .append("path")
        .attr("class", "mypath")
        .attr("opacity", d => {
          var className = model_name + d.values[1].name.replace(/ /g, '').replace(/[^\w\s]/gi, '') + 'original'
          if (d.values[0].rank < deviate_check_lower || d.values[0].rank > deviate_check_upper) { var sparkline_color = "grey" } else { var sparkline_color = line_color(d.key) }
          sparkline1.sparklineGen(className, sparkline_data, d.key.replace(/ /g, '').replace(/[^\w\s]/gi, ''), d.key, year, appHandleChange, d.values[0].rank, sparkline_color, d.key.replace(/ +/g, ""))
          return 1;
        }
        )
      //-----------------------------------------------------------------------------------------------------------------------------------------Left rank text starts here
      g.append("text")
        .attr("id", d => "A" + d.key.replace(/ +/g, ""))
        .attr("class", (d) => "myid" + d.values[0].rank + " left_rank_text" + " slopechart_text")
        .attr("x", d => -config.labelGroupOffset)
        .attr("y", d => yScale(d.values[0].rank) - var_to_lift_up)
        .attr("dx", -10)
        .attr("dy", 3)
        .attr("text-anchor", "end")
        .text(d => (d.values[0].rank))
        .attr("fill", function (d) {
          if (d.values[0].rank < deviate_check_lower) {
            return "rgb(110, 112, 112,.5)";
          }
          else if (d.values[0].rank > deviate_check_upper) {
            return "rgb(110, 112, 112,.5)";
          }
          else {
            return line_color(d.key);
          }
        }); //rank text ends here
      //-----------------------------------------------------------------------------------------------------------------------------------------circle starts
      g.append("circle")
        .attr("id", d => "A" + d.key.replace(/ +/g, ""))
        .attr("r", d => {
          if (d.values[0].rank < deviate_check_lower) {
            return 0
          }
          else if (d.values[0].rank > deviate_check_upper) {
            return 0
          }
          else { return config.radius }
        })
        .attr("cy", d => yScale(d.values[0].rank) - var_to_lift_up)
        .attr("class", (d) => {
          return d.values[0].name.replace(/ /g, '').replace(/[^\w\s]/gi, '') + " myid" + d.values[0].rank + " left_circle"
        })
        .attr("fill", function (d) {
          if (d.values[0].rank < deviate_check_lower) {
            //return line_color(d);
            return "rgb(110, 112, 112,.5)";
          }
          else if (d.values[0].rank > deviate_check_upper) {
            //return line_color(d);
            return "rgb(110, 112, 112,.5)";
          }
          else {
            return line_color(d.key);
          }
        }); //circle ends
      //-----------------------------------------------------------------------------------------------------------------------------------------Slope lines starts here
      g.append("line")
        .attr("id", d => "A" + d.key.replace(/ +/g, ""))
        .attr("class", (d) => "slope-line myid" + d.values[0].rank)
        .attr("x1", 0)
        .attr("x2", config.width)
        .on("click", function (d) {
          return textClickHandler_original("A" + d.key)
          // if (d.values[0].rank < deviate_check_lower || d.values[0].rank > deviate_check_upper) { } else { return textClickHandler_original("A"+d.key) }
        })
        .attr("y1", function (d) {
          return yScale(d.values[0].rank) - var_to_lift_up;
        })
        .attr("y2", function (d) {
          return yScale(d.values[1].rank) - var_to_lift_up;
        })
        .attr("stroke", (d) => {
          if (d.values[0].rank < deviate_check_lower) {
            return "transparent";
          }
          else if (d.values[0].rank > deviate_check_upper) {
            return "transparent";
          }
          else {
            return line_color(d.key)
          }
        })



      //-----------------------------------------------------------------------------------------------------------------------------------------Right side   
      //-----------------------------------------------------------------------------------------------------------------------------------------Right circle starts here      
      g.append("circle")
        .attr("id", d => "A" + d.key.replace(/ +/g, ""))
        .attr("cy", d => yScale(d.values[1].rank) - var_to_lift_up).attr("class", (d) => {
          return d.values[0].name.replace(/ /g, '').replace(/[^\w\s]/gi, '') + " right_circle myid" + d.values[0].rank
        })
        .attr("r", d => {
          if (d.values[0].rank < deviate_check_lower) {
            return 0
          }
          else if (d.values[0].rank > deviate_check_upper) {
            return 0
          }
          else { return config.radius }
        })
        .attr("cx", config.width)
        .attr("fill", (d) => {
          if (!(d.values[0].rank < deviate_check_lower | d.values[0].rank > deviate_check_upper)) {
            return line_color(d.key);
          }
        });
      //-----------------------------------------------------------------------------------------------------------------------------------------Right text - Ranks starts here
      g.append("text")
        .attr("id", d => "A" + d.key.replace(/ +/g, ""))
        .attr("class", (d) => "slopechart_text right_rank_text myid" + d.values[0].rank)
        .attr("x", d => width + config.labelGroupOffset)
        .attr("y", d => yScale(d.values[1].rank) - var_to_lift_up)
        .attr("dx", 10)
        .attr("dy", 3)
        .attr("text-anchor", "start")
        .text(d => {
          if (d.values[0].rank < deviate_check_lower || d.values[0].rank > deviate_check_upper) {
            return "";
          }
          else {
            return d.values[1].rank
          }
        })
        .attr("fill", function (d) {
          if (d.values[0].rank < deviate_check_lower || d.values[0].rank > deviate_check_upper) {
            return "";
          }
          else {
            return line_color(d.key)
          }
        })
        .on("click", function (d) {
          return textClickHandler_original("A" + d.key)
          // if (d.values[0].rank < deviate_check_lower || d.values[0].rank > deviate_check_upper) { } else { return textClickHandler_original("A"+d.key) }
        }); //Text - Ranks ends here
      //-----------------------------------------------------------------------------------------------------------------------------------------Right sparkline starts here
      g.append("svg")
        .attr('class', d => "svg2 " + model_name.replace(".", "stupid") + d.values[1].name.replace(/ /g, '').replace(/[^\w\s]/gi, '').split('.').join(' '))
        .attr("x", d => {
          return width + config.labelGroupOffset + 25
        })
        .attr("y", d => yScale(d.values[1].rank) - var_to_lift_up - 14)
        .attr("width", d => {
          if (d.values[0].rank < deviate_check_lower || d.values[0].rank > deviate_check_upper) {
            return 0;
          }
        })
        .append("path")
        .attr("class", "mypath2")
        .attr("opacity", d => {
          if (d.values[0].rank < deviate_check_lower || d.values[0].rank > deviate_check_upper) { } else {
            var className = model_name.replace(".", "stupid") + d.values[1].name.replace(/ /g, '').replace(/[^\w\s]/gi, '').split('.').join(' ')
            sparkline2.sparklineGen(className, sparkline_data, d.key.replace(/ /g, '').replace(/[^\w\s]/gi, ''), actual_model_for_range_and_time_mode, original_data, d.key, year, appHandleChange, d.values[0].rank, line_color(d.key), d.key.replace(/ +/g, ""))
            return 1;
          }
        })
    }
    return selection
      .append("g")
      .attr("class", "datapoint")
      .attr("id", d => "A" + d.key.replace(/ +/g, ""))
      .call(makeDatapoint);
  }
  //-----------------------------------------------------------------------------------------------------------------------------------------Onupdate starts here
  function onUpdate(selection) {

    //-----------------------------------------------------------------------------------------------------------------------------------------state name text ends here
    selection.select(".state_name")
      .attr("x", -config.labelGroupOffset)
      .attr("dx", -config.labelKeyOffset)
      .attr("dy", 3)
      .attr("id", d => "A" + d.key.replace(/ +/g, ""))
      .attr("class", (d) => {
        return "slopechart_text myid" + d.values[0].rank + " state_name"
      })
      .attr("text-anchor", "end")
      .on("mouseover", function (d) { //-------Tooltip starts		
        var div = d3.select("body").append("div")
          .attr("id", "div" + d.key.replace(/ +/g, ""))
          .attr("class", "tooltip")
          .style("opacity", 0)
        div.transition()
          .duration(100)
          .style("opacity", .97)
        div.html("<p>" + d.key + "</p>" + "<p>" + "Predicted rank: " + d.values[1].rank + "</p>")
          .style("left", ((d) => {
            var left_div_width = $('.Sidebar_parent').width()
            return left_div_width - 125 + "px"
          }))
          .style("top", (d3.event.pageY - 40) + "px");
      })
      .on("mouseout", function (d) {
        var myid = "#div" + d.key.replace(/ +/g, "")
        d3.select("body").selectAll(".tooltip").transition()
          .duration(500)
          .style("opacity", 0).remove();
      }) // Tooltip ends
      .on("click", function (d) {
        return textClickHandler_original("A" + d.key)
        /*
        if (d.values[0].rank < deviate_check_lower || d.values[0].rank > deviate_check_upper) {
          if (clicked_items_in_slopechart.includes(d.key.replace(/ +/g, ""))) { return textClickHandler_original("A"+d.key) }
        }
        else { return textClickHandler_original("A"+d.key) }
        */
      })
      .text(d => {
        var val = d.key
        if (val.length > 15) { val = val.replace("University", "U") }
        return val.length > 15 ? val.substring(0, 15) : val
      })
      .attr("fill", function (d) {
        if (d.values[0].rank == 23) {

        }
        if ((d.values[0].rank < deviate_check_lower) || (d.values[0].rank > deviate_check_upper)) {
          return "rgb(110, 112, 112,.5)";
        }
        else {
          return line_color(d.key);
        }
      }).transition().duration(d => {
        if (animate == "animate") {
          return slope_chart_anim1
        }
        else {
          return 0
        }
      })
      .attr("y", d => yScale(d.values[0].rank) - var_to_lift_up)
    //state name text ends here
    //-----------------------------------------------------------------------------------------------------------------------------------------Left sparkline starts here
    selection.select(".svg1")
      .attr('class', d => "svg1 " + model_name + d.values[1].name.replace(/ /g, '').replace(/[^\w\s]/gi, '') + 'original')
      .attr("x", d => {
        var className = model_name + d.values[1].name.replace(/ /g, '').replace(/[^\w\s]/gi, '') + 'original'
        if (d.values[0].rank < deviate_check_lower || d.values[0].rank > deviate_check_upper) { var sparkline_color = "grey" } else { var sparkline_color = line_color(d.key) }
        sparkline1.sparklineGen(className, sparkline_data, d.key.replace(/ /g, '').replace(/[^\w\s]/gi, ''), d.key, year, appHandleChange, d.values[0].rank, sparkline_color, d.key.replace(/ +/g, ""))
        return -config.labelGroupOffset - config.labelKeyOffset + 3;
      })
      .transition().duration(d => {
        if (animate == "animate") {
          return slope_chart_anim1
        }
        else {
          return 0
        }
      })
      .attr("y", d => yScale(d.values[0].rank) - var_to_lift_up - 14)
      .attr("opacity", 1)
    //-----------------------------------------------------------------------------------------------------------------------------------------Left rank text starts here
    selection.select(".left_rank_text")
      .attr("id", d => "A" + d.key.replace(/ +/g, ""))
      .attr("class", (d) => "slopechart_text myid" + d.values[0].rank + " left_rank_text")
      .attr("x", d => -config.labelGroupOffset)
      .attr("dx", -10)
      .attr("dy", 3)
      .attr("text-anchor", "end")
      .text(d => (d.values[0].rank))
      .attr("fill", function (d) {
        if (d.values[0].rank < deviate_check_lower) {
          return "rgb(110, 112, 112,.5)";
        }
        else if (d.values[0].rank > deviate_check_upper) {
          return "rgb(110, 112, 112,.5)";
        }
        else {
          return line_color(d.key);
        }
      })
      .transition().duration(d => {
        if (animate == "animate") {
          return slope_chart_anim1
        }
        else {
          return 0
        }
      })
      .attr("y", d => yScale(d.values[0].rank) - var_to_lift_up); //rank text ends here

    //-----------------------------------------------------------------------------------------------------------------------------------------Left circle starts here
    selection.select(".left_circle")
      .attr("id", d => "A" + d.key.replace(/ +/g, ""))
      .attr("r", d => {
        if (d.values[0].rank < deviate_check_lower) {
          return 0
        }
        else if (d.values[0].rank > deviate_check_upper) {
          return 0
        }
        else { return config.radius }
      })
      .attr("class", (d) => {
        return d.values[0].name.replace(/ /g, '').replace(/[^\w\s]/gi, '') + " myid" + d.values[0].rank + " left_circle"
      })
      .attr("fill", function (d) {
        if (d.values[0].rank < deviate_check_lower) {
          //return line_color(d);
          return "rgb(110, 112, 112,.5)";
        }
        else if (d.values[0].rank > deviate_check_upper) {
          //return line_color(d);
          return "rgb(110, 112, 112,.5)";
        }
        else {
          return line_color(d.key);
        }
      })
      .transition().duration(d => {
        if (animate == "animate") {
          return slope_chart_anim1
        }
        else {
          return 0
        }
      })
      .attr("cy", d => yScale(d.values[0].rank) - var_to_lift_up); //left circle ends
    //----------------------------------------------------------------------------------------------------------------------------------------- Slope lines starts here

    selection.select(".slope-line")
      .attr("id", d => "A" + d.key.replace(/ +/g, ""))
      .attr("class", (d) => "slope-line myid" + d.values[0].rank)
      .attr("x1", 0)
      .attr("x2", config.width)
      .on("click", function (d) {
        return textClickHandler_original("A" + d.key)
        // if (d.values[0].rank < deviate_check_lower || d.values[0].rank > deviate_check_upper) { } else { return textClickHandler_original("A"+d.key) }
      })
      .attr("stroke", (d) => {
        if (d.values[0].rank < deviate_check_lower) {
          return "transparent";
        }
        else if (d.values[0].rank > deviate_check_upper) {
          return "transparent";
        }
        else {
          return line_color(d.key)
        }
      })
      .transition().duration(d => {
        if (animate == "animate") {
          return slope_chart_anim1
        }
        else {
          return 0
        }
      })
      .attr("y1", function (d) {
        return yScale(d.values[0].rank) - var_to_lift_up;
      })
      .transition().duration(d => { // we don't need to set delay here because this is happening one after another
        if (animate == "animate") {
          return slope_chart_anim2
        }
        else {
          return 0
        }
      })
      .attr("y2", function (d) {
        return yScale(d.values[1].rank);
      }) // Right slope lines ends here
    //-----------------------------------------------------------------------------------------------------------------------------------------Right side  
    //-----------------------------------------------------------------------------------------------------------------------------------------Right circle starts here      
    selection.select(".right_circle")
      .attr("id", d => "A" + d.key.replace(/ +/g, ""))
      .attr("class", (d) => {
        return d.values[0].name.replace(/ /g, '').replace(/[^\w\s]/gi, '') + " right_circle myid" + d.values[0].rank
      })
      .attr("r", d => {
        if (d.values[0].rank < deviate_check_lower) {
          return 0
        }
        else if (d.values[0].rank > deviate_check_upper) {
          return 0
        }
        else { return config.radius }
      })
      .attr("cx", config.width)
      .attr("cy", d => {
        return yScale(d.values[1].rank) - var_to_lift_up
      })
      .attr("fill", (d) => {
        if (!(d.values[0].rank < deviate_check_lower | d.values[0].rank > deviate_check_upper)) {
          return line_color(d.key);
        }
      });
    //-----------------------------------------------------------------------------------------------------------------------------------------Right text rank starts here
    selection.select(".right_rank_text")
      .attr("class", (d) => "slopechart_text right_rank_text myid" + d.values[0].rank)
      .attr("x", d => width + config.labelGroupOffset)
      .attr("y", d => yScale(d.values[1].rank) - var_to_lift_up)
      .attr("dx", 10)
      .attr("dy", 3)
      .attr("text-anchor", "start")
      .text(d => {
        if (d.values[0].rank < deviate_check_lower || d.values[0].rank > deviate_check_upper) {
          return "";
        }
        else {
          return d.values[1].rank
        }
      })
      .attr("fill", function (d) {
        if (d.values[0].rank < deviate_check_lower || d.values[0].rank > deviate_check_upper) {
          return "";
        }
        else {
          return line_color(d.key)
        }
      })
      .on("click", function (d) {
        return textClickHandler_original("A" + d.key)
        // if (d.values[0].rank < deviate_check_lower || d.values[0].rank > deviate_check_upper) { } else { return textClickHandler_original("A"+d.key) }
      }); //Text - Ranks ends here
    //-----------------------------------------------------------------------------------------------------------------------------------------Right sparkline starts here
    selection.select(".svg2")
      .attr('class', d => "svg2 " + model_name.replace(".", "stupid") + d.values[1].name.replace(/ /g, '').replace(/[^\w\s]/gi, '').split('.').join(' '))
      .attr("x", d => {
        var className = model_name.replace(".", "stupid") + d.values[1].name.replace(/ /g, '').replace(/[^\w\s]/gi, '').split('.').join(' ')
        sparkline2.sparklineGen(className, sparkline_data, d.key.replace(/ /g, '').replace(/[^\w\s]/gi, ''), actual_model_for_range_and_time_mode, original_data, d.key, year, appHandleChange, d.values[0].rank, line_color(d.key), d.key.replace(/ +/g, ""))
        return width + config.labelGroupOffset + 27
      })
      .attr("y", d => yScale(d.values[1].rank) - var_to_lift_up - 14)
      .attr("width", d => {
        if (d.values[0].rank < deviate_check_lower || d.values[0].rank > deviate_check_upper) {
          return 0;
        }
      })

  }

  function onExit(selection) {
    selection.remove();
  }
}
