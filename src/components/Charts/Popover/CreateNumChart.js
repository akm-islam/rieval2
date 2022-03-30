import * as d3 from 'd3';
import * as _ from "lodash";
import "./CreateNumChart.css"
var CreateNumChart = (data, feature, scatterplot_data, props) => {
  var rScale = d3.scalePow().exponent(0.2).domain(d3.extent(props.deviation_array)).range([8, 1])
  var feature_contribute = feature + "_contribution"
  var scatterplot_data = scatterplot_data.map(data_arr => {
    var temp = data_arr[1].filter(item => item['deviation'] < props.threshold && parseFloat(item[feature_contribute]) > 0)
    return [data_arr[0], temp]
  })
  // set the dimensions and margins of the graph
  var margin = { top: 0, right: 30, bottom: 70, left: 50, space_for_hist: 50 },
    feature_width = 520 - margin.left - margin.right,
    height = 250 - margin.top - margin.bottom;

  data = data.filter(d => parseFloat(d[feature_contribute]) > 0)

  var data_for_x_axis = data.map(item => parseFloat(item[feature])),
    data_for_y_axis = data.map(item => parseFloat(item[feature_contribute]))

  var xScale = d3.scaleLinear().domain([d3.min(data_for_x_axis), d3.max(data_for_x_axis)]).range([0, feature_width]).nice(),
    yScale = d3.scaleLinear().domain([d3.min(data_for_y_axis), d3.max(data_for_y_axis)]).range([height, 0]).nice(); // circles will start from y position 10 and go upto height-10
  //-------------------------------------------------------------All svgs
  var parent_svg = d3.select("#" + props.myid).attr("width", feature_width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom + margin.space_for_hist),
    svg1 = parent_svg.selectAll('.svg11').data([0]).join('svg').attr("y", margin.space_for_hist).attr("class", "svg11").selectAll(".myg").data([0]).join('g').attr("class", "myg").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  //------------------------------------------------------------------------------------------------------Create the areaChart starts here
  var histogram = d3.histogram().value(d => d).domain(xScale.domain())
  //.thresholds(xScale.ticks(5))
  var bins = histogram(data_for_x_axis)
  var svg0 = parent_svg.selectAll('.svg0').data([0]).join('svg').attr("class", "svg0").selectAll(".myg0").data([0]).join('g').attr("class", "myg0").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  svg0.selectAll(".myline").data([0]).join('line').attr("class", "myline").attr("x1", 0).attr("y1", margin.space_for_hist).attr("x2", feature_width).attr("y2", margin.space_for_hist).attr("stroke", "#EBEBEB") // // Add line on the bottom of the histogram

  var histogram = d3.histogram().value(d => d).domain(xScale.domain())
  //.thresholds(xScale.ticks(25))
  var binned_data = histogram(data_for_x_axis)

  var area_chart_data = []
  binned_data.map((item, i) => area_chart_data.push([item.x0, item.length]))
  var xScale = d3.scaleLinear().domain(d3.extent(area_chart_data.map(item => item[0]))).range([0, feature_width + 1])
  var yScale = d3.scaleLinear().domain([0, d3.max(area_chart_data.map(item => item[1]))]).range([margin.space_for_hist, 0])
  const areaGenerator = d3.area().curve(d3.curveMonotoneX).x(d => xScale(d[0])).y0(yScale(0)).y1(d => yScale(d[1]))

  svg0.selectAll(".hist_path").data([0]).join('path').attr('class', 'hist_path').attr('transform', 'translate(0,' + margin.top + ')')
    .attr("d", areaGenerator(area_chart_data))
    .style("fill", "gray");
  //------------------------------------------------------------------------------------------------------ Create the areaChart ends here

  var svg1 = parent_svg.selectAll('.svg11').data([0]).join('svg').attr("class", "svg11").selectAll(".myg").data([0]).join('g').attr("class", "myg").attr("transform",
    "translate(" + margin.left + "," + margin.top + ")")
  svg1.selectAll(".myline2").data([0]).join('line').attr("class", "myline2").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", height).attr("stroke", "#EBEBEB");
  svg1.selectAll(".myline3").data([0]).join('line').attr("class", "myline3").attr("x1", 0).attr("y1", height).attr("x2", feature_width).attr("y2", height).attr("stroke", "#EBEBEB");




  //------------------------------------------------------------------ Regression starts here
  var regression_data = []
  scatterplot_data.map(data_by_model => { data_by_model[1].map(item => { regression_data.push([parseFloat(item[feature]), parseFloat(item[feature_contribute])]) }) })
  var data = regression_data
  var width = feature_width,
    height = height;
  // setup x
  var xValue = function (d) { return d[0]; }, // data -> value
    xScale = d3.scaleLinear().range([0, width]), // value -> display
    xMap = function (d) { return xScale(xValue(d)); }; // data -> display
  // setup y
  var yValue = function (d) { return d[1]; }, // data -> value
    yScale = d3.scaleLinear().range([height - margin.bottom, 0]), // value -> display
    yMap = function (d) { return yScale(yValue(d)); }; // data -> display
  // add the graph canvas to the body of the webpage
  var svg = svg1.attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom)
  var regrLine = regressionLine().xScale(xScale).yScale(yScale).xValue(xValue).yValue(yValue);
  var minX = d3.min(data, xValue), maxX = d3.max(data, xValue);
  var minY = d3.min(data, yValue), maxY = d3.max(data, yValue);
  var diffX = (maxX - minX) * 0.05, diffY = (maxY - minY) * 0.05;
  xScale.domain([d3.min(data, xValue) - diffX, d3.max(data, xValue) + diffX]);
  yScale.domain([d3.min(data, yValue) - diffY, d3.max(data, yValue) + diffY]);
  svg.selectAll(".regr").data([data]).join("g").attr("class", "regr").call(regrLine);
  //------------------------------------------------------------------------------------------------------ Draw Circles
  //------------- Add X axis
  if (d3.max(d3.max(bins)) > 1000) {
    svg1.selectAll(".myXaxis").data([0]).join('g').attr("class", "myXaxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale).tickSize(-height * 1.3).tickValues(bins.map(item => item['x1'])).tickFormat(d3.format(".2s")))
      .select(".domain").remove()
  }
  else {
    svg1.selectAll(".myXaxis").data([0]).join('g').attr("class", "myXaxis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xScale).tickSize(-height * 1.3).tickValues(bins.map(item => item['x1'])))
      .select(".domain").remove()
  }
  svg1.selectAll(".tick line").attr("stroke", "#EBEBEB")
  svg1.selectAll(".scatterplot_g").data(scatterplot_data).join('g').attr("id", d => d[0] + "scatterplot_g_id").attr("class", "scatterplot_g").attr("ax", function (d) {
    var data_for_x_axis2 = d[1].map(item => parseFloat(item[feature]))
    var data_for_y_axis2 = d[1].map(item => parseFloat(item[feature_contribute]))

    var xScale2 = d3.scaleLinear().domain([d3.min(data_for_x_axis2), d3.max(data_for_x_axis2)]).range([8, feature_width-8]).nice() // This scaling is for individual model
    var yScale2 = d3.scaleLinear().domain([d3.min(data_for_y_axis2), d3.max(data_for_y_axis2)]).range([height, 0]).nice(); // This scaling is for individual model
    d3.select(this).selectAll('circle').data(d[1])
      .join("circle")
      .attr("cx", (d, i) => xScale2(d[feature]))
      .attr("cy", (d, i) => {
        if (yScale2(parseFloat(d[feature_contribute])) < 10) {
          return 10;
        }
        else if (yScale2(parseFloat(d[feature_contribute])) > (height - 10)) {
          return height - 10;
        }
        return yScale2(parseFloat(d[feature_contribute])) - 0

      })
      .attr("actual_Y_value", d => d[feature_contribute] + " : x value : " + d[feature])
      //.attr("r", 4)
      .attr("r", d => parseFloat(d[feature_contribute]) <= 0 ? 0 : rScale(d['deviation']))
      .attr("fill", (d) => {
        return props.diverginColor(d['two_realRank']).replace(")", ",.6)")
      })
      .style('stroke', (d) => {
        return props.diverginColor(d['two_realRank'])
      })
      .attr('class', d => 'my_circles')
      .attr("id", d => d['id'])
      .on('click', d => {
        props.Set_clicked_circles(props.clicked_circles.includes(d['id']) ? props.clicked_circles.filter(item => item != d['id']) : [...props.clicked_circles, d['id']])
      })
  })
  //--------------------------------------------------------------------------------------------------
  svg1.selectAll(".my_temp_rect").data([0]).join('rect').attr("class", "my_temp_rect").attr("width", "100%").attr("height", 100).style("fill", "white").attr("y", height)
  svg1.selectAll(".myXaxis").raise()
  svg1.select(".regr-line").attr("fix",function(){
    svg1.selectAll(".my_line").data([0]).join("line").attr("class", "my_line").attr("x1", d3.select(this).attr('x1')).attr("x2", d3.select(this).attr('x2')).attr("y1",d3.select(this).attr('y1')).attr("y2", d3.select(this).attr('y2')).attr("stroke-width", 2).attr("stroke", "#5c7eb7")
    d3.select(this).attr("opacity",0)
  })
  svg1.selectAll(".my_line").raise()
  svg1.selectAll(".scatterplot_g").raise()
  svg1.selectAll(".myText").data([0]).join("text").attr("x", feature_width/2).attr("class", "myText").attr('dominant-baseline',"middle").attr('text-anchor',"middle").attr("y",height+30).text('feature value').attr("fill","#5b5959").attr("font-size",14)
  svg1.selectAll(".myText2").data([0]).join("text").attr("class", "myText2").attr('dominant-baseline',"middle").attr('text-anchor',"middle").text('feature importance').attr("fill","#5b5959").attr("font-size",14)
  .attr('transform',d=>"rotate(-90,"+0+","+height/2+")").attr("x", 0).attr("y", margin.left+20)
  //---------------------------
  function regressionLine() {
    var xScale, yScale, xValue, yValue;
    var area = d3.area()
      .x(function (d) { return xScale(xValue(d[0])); })
      .y0(function (d) { return yScale(yValue(d[0])); })
      .y1(function (d) { return yScale(yValue(d[1])); });
    function regressionLineBehavior(selection) {
      selection.each(function (data) {
        // var regr = regression('linear', data, 3);
        var regr = calculateLinearRegression(data);
        var regressionService = new RegressionService();

        var errorPoints = regressionService.getErrorLines(data, regr.points);
        var lowerConfidencePoints = prepareConfidencePoints(errorPoints.lowerErrorPoints);
        var upperConfidencePoints = prepareConfidencePoints(errorPoints.upperErrorPoints);

        var confidencePoints = _.zip(lowerConfidencePoints, upperConfidencePoints);
        d3.select(this).selectAll(".regr-confidence").data([0]).join('path')
          .datum(confidencePoints)
          .attr("class", "regr-confidence")
          .attr("d", area);

        var xDomain = xScale.domain();
        d3.select(this).selectAll(".regr-line").data([0]).join('line')
          .attr("class", "regr-line")
          .attr("x1", xScale(xDomain[0]))
          .attr("y1", yScale((xDomain[0] * regr.slope) + regr.intercept))
          .attr("x2", xScale(xDomain[1]))
          .attr("y2", yScale((xDomain[1] * regr.slope) + regr.intercept));
      });
    }

    regressionLineBehavior.xValue = function (xValueValue) {
      xValue = xValueValue;
      return regressionLineBehavior;
    };

    regressionLineBehavior.yValue = function (yValueValue) {
      yValue = yValueValue;
      return regressionLineBehavior;
    };

    regressionLineBehavior.xScale = function (xScaleValue) {
      xScale = xScaleValue;
      return regressionLineBehavior;
    };

    regressionLineBehavior.yScale = function (yScaleValue) {
      yScale = yScaleValue;
      return regressionLineBehavior;
    };

    function calculateLinearRegression(data) {
      // Formula is taken from http://stackoverflow.com/questions/6195335/linear-regression-in-javascript
      var n = data.length;
      var sum_x = 0;
      var sum_y = 0;
      var sum_xy = 0;
      var sum_xx = 0;
      var sum_yy = 0;

      data.forEach(function (pair) {
        sum_x += xValue(pair);
        sum_y += yValue(pair);
        sum_xy += xValue(pair) * yValue(pair);
        sum_xx += xValue(pair) * xValue(pair);
        sum_yy += yValue(pair) * yValue(pair);
      });

      var slope = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
      var intercept = (sum_y - slope * sum_x) / n;
      var points = data.map(function (pair) {
        return [xValue(pair), slope * xValue(pair) + intercept];
      });

      return {
        slope: slope,
        intercept: intercept,
        points: points
      };
    };

    function prepareConfidencePoints(errorPoints) {
      var xDomain = xScale.domain();

      var uniqueErrorPoints = _.sortBy(_.uniqBy(errorPoints, xValue), xValue);
      var pointsCount = uniqueErrorPoints.length;
      var startLine = calculateLineFromPoints(uniqueErrorPoints[0], uniqueErrorPoints[1]);
      var endLine = calculateLineFromPoints(uniqueErrorPoints[pointsCount - 1], uniqueErrorPoints[pointsCount - 2]);

      uniqueErrorPoints.unshift([xDomain[0], xDomain[0] * startLine.a + startLine.b]);
      uniqueErrorPoints.push([xDomain[1], xDomain[1] * endLine.a + endLine.b]);

      return uniqueErrorPoints;
    }

    function calculateLineFromPoints(p1, p2) {
      var a = (yValue(p1) - yValue(p2)) / (xValue(p1) - xValue(p2));
      return {
        a: a,
        b: yValue(p1) - a * xValue(p1)
      };
    }

    function RegressionService() {
      function getErrorLines(inputPoints, outputPoints) {
        // Formula is take from https://www2.stat.duke.edu/courses/Spring13/sta101.001/slides/unit6lec3H.pdf
        var stdErr = Math.sqrt(_.sum(
          _.zip(inputPoints.map(yValue), outputPoints.map(yValue))
            .map(pair => Math.pow(pair[1] - pair[0], 2)))
          / (inputPoints.length - 2));
        var meanX = _.sum(inputPoints.map(xValue)) / inputPoints.length;

        var stdX = Math.sqrt(
          _.sum(inputPoints.map(function (val) {
            return Math.pow(xValue(val) - meanX, 2);
          })) / inputPoints.length);

        var errorMargin = outputPoints.map(function (val) {
          return 1.96 * stdErr * Math.sqrt(
            1 / inputPoints.length +
            Math.pow((xValue(val) - meanX), 2)
            / ((inputPoints.length - 1) * Math.pow(stdX, 2)));
        });

        return {
          lowerErrorPoints: _.zip(outputPoints, errorMargin).map(function (pair) {
            return [xValue(pair[0]), yValue(pair[0]) - pair[1]];
          }),
          upperErrorPoints: _.zip(outputPoints, errorMargin).map(function (pair) {
            return [xValue(pair[0]), yValue(pair[0]) + pair[1]];
          })
        };
      }

      return {
        getErrorLines: getErrorLines
      }
    }

    return regressionLineBehavior;
  }















}
export default CreateNumChart