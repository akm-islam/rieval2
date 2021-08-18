import * as d3 from 'd3';
import * as $ from "jquery"
export default function CreateChart(feature, data, node, feature_height, selected_year, handleHistogramselection, feature_data) {
  var feature_width = $(".Sidebar_parent").width()
  var svg = d3.select(node),
    margin = { top: 30, right: 15, bottom: 20, left: 7 },
    width = feature_width - margin.left - margin.right,
    height = feature_height - margin.top - margin.bottom;
  if (isNaN(data[0].y)) {
    //-----------------------------------------------------------(handle the categorical features here)
    var occur = {}
    data.map(item => {
      if (item.y in occur) {
        occur[item.y] = occur[item.y] + 1
      }
      else {
        occur[item.y] = 1
      }
    })
    // Create items array
    var items = Object.keys(occur).map(function (key) {
      return [key, occur[key]];
    });

    // Sort the array based on the second element
    items.sort(function (first, second) {
      return second[1] - first[1];
    });
    //-----
    var y = items.map(element => element[0]);
    var x = items.map(element => element[1]);
    var sum_x = d3.sum(x)
    var cScale = d3.scaleSequential()
      .interpolator(d3.interpolate("#999999b3", "#999999b3"))
      .domain([0, x.length]);
    svg.selectAll(".hist_title").data([0]).join("text").attr("class", "hist_title").attr("y", 15).attr("x", width / 2).attr("text-anchor", "middle").text(feature);
    var g = svg.selectAll(".g1").data([0]).join("g").attr("class", "g1").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    var svg1 = g.selectAll(".svg1").data([0]).join('svg').attr("class", "svg1").attr('width', width).attr('height', height)
    svg1.selectAll('rect').data(x).join("rect")
      .style('fill', (d, i) => cScale(i)).attr("height", height)
      .attr('width', (d, i) => {
        return (((d / sum_x) * width) - .2)
      })
      .attr("x", (d, i) => {
        var temp_sum = d3.sum(x.slice(0, i))
        return ((temp_sum / sum_x) * width)
      })
      .attr("id", (d, i) => y[i])
      .on("click", (d, i) => {
        d3.select("#" + y[i]).classed("cat_item_clicked", () => {
          if (d3.select("#" + y[i]).classed("cat_item_clicked")) {
            return false
          }
          else {
            var statelist = cat_states(feature_data, selected_year, y[i])
            handleHistogramselection(statelist, "histogram_data")
            return true
          }
        })

      }
      )
    //---
    svg1.selectAll("text").data(y, d => d).join("text")
      .text((d, i) => {
        if (((x[i] / sum_x) * width) > 12) { return d }
        else { return "" }
      })
      .attr("x", (d, i) => {
        var temp_sum = d3.sum(x.slice(0, i))
        return ((temp_sum / sum_x) * width) + 8
      })
      .attr("y", height / 2)
      .style("font-size", 9)
      .style("writing-mode", "tb")
      .style("text-anchor", "middle")
    //-----------------------------------------------------------Barchart ends here
  }
  else {
    //----------------------------------------------------------- Handle the Numeric features here)
    var margin = { top: 10, right: 30, bottom: 30, left: 50 },
    width = feature_width - margin.left - margin.right,
    height = feature_height - margin.top - margin.bottom;

    svg.selectAll(".hist_title").data([feature], d => d).join("text").attr("class", "hist_title").attr("y", 15).attr("x", width / 2).attr("text-anchor", "middle").text(feature.replace(/_/g, ' '));
    var temp_x = data.map(item => parseFloat(item['y'])),
      //x = d3.scaleLinear().domain([d3.min(temp_x), d3.max(temp_x)]).range([0, width])
      x = d3.scaleLinear().domain([0, 1000]).range([0, width]);
    // add the x Axis
    svg.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));
    // add the y Axis
    var y = d3.scaleLinear().range([height, 0]).domain([0, 0.01]);
    // Compute kernel density estimation
    var kde = kernelDensityEstimator(kernelEpanechnikov(7), x.ticks(50))
    var density = kde(temp_x)

    // Plot the area
    svg.append("path").attr("class", "mypath").datum(density)
      .attr("fill", "#69b3a2").attr("opacity", ".8").attr("stroke", "#000").attr("stroke-width", 1).attr("stroke-linejoin", "round")
      .attr("d", d3.line()
        .curve(d3.curveBasis)
        .x(function (d) { return x(d[0]); })
        .y(function (d) { return y(d[1]); })
      );

    // Function to compute density
    function kernelDensityEstimator(kernel, X) {
      return function (V) {
        return X.map(function (x) {
          return [x, d3.mean(V, function (v) { return kernel(x - v); })];
        });
      };
    }
    function kernelEpanechnikov(k) {
      return function (v) {
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
      };
    }
    //------------------------------------------------------------------------------------------------------ Create Histogram ends here    
    //---drag starts here
    var selectionRect = {
      element: null,
      previousElement: null,
      currentY: 0,
      currentX: 0,
      originX: 0,
      originY: 0,
      setElement: function (ele) {
        this.previousElement = this.element;
        this.element = ele;
      },
      getNewAttributes: function () {
        var x = this.currentX < this.originX ? this.currentX : this.originX;
        var y = this.currentY < this.originY ? this.currentY : this.originY;
        var width = Math.abs(this.currentX - this.originX);
        var height = Math.abs(this.currentY - this.originY);
        return { x: x, y: y, width: width, height: height }; // returning the javascript object
      },
      getCurrentAttributes: function () {
        // use plus sign to convert string into number
        var x = +this.element.attr("x");
        var y = +this.element.attr("y");
        var width = +this.element.attr("width");
        var height = +this.element.attr("height");
        return { x1: x, y1: y, x2: x + width, y2: y + height }; // returning the javascript object
      },
      getCurrentAttributesAsText: function () {
        var attrs = this.getCurrentAttributes();
        return "x1: " + attrs.x1 + " x2: " + attrs.x2 + " y1: " + attrs.y1 + " y2: " + attrs.y2;
      },
      init: function (newX, newY) {
        var rectElement = svg.append("rect")
          .attr('rx', 1).attr('ry', 1).attr("x", 0).attr("y", 0)
          .attr('width', 0).attr('height', 0).classed("selection", true);
        this.setElement(rectElement);
        this.originX = newX;
        this.originY = newY;
        this.update(newX, newY);
      },
      update: function (newX, newY) {
        this.currentX = newX;
        this.currentY = newY;
        var NewAttr = this.getNewAttributes()
        this.element.attr("x", NewAttr.x).attr("y", NewAttr.y)
          .attr('width', NewAttr.width).attr('height', NewAttr.height)
      },
      focus: function () {
        this.element
          .style("stroke", "")
          .style("stroke-width", "1");
      },
      remove: function () {
        this.element.remove();
        this.element = null;
      },
      removePrevious: function () {
        if (this.previousElement) {
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
      if (finalAttributes.x1 != finalAttributes.x2) {
        var myx1 = finalAttributes.x1 - margin.left
        var myx2 = finalAttributes.x2 - margin.left
        var temp_range = [x.invert(myx1).toFixed(4), x.invert(myx2).toFixed(4)]
        var statelist = states(feature_data, temp_range, selected_year, feature)
        handleHistogramselection(statelist, "histogram_data")
      }
      if (finalAttributes.x2 - finalAttributes.x1 > 1 && finalAttributes.y2 - finalAttributes.y1 > 1) {
        // range selected
        // d3.event.sourceEvent.preventDefault();
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
    //---drag ends here
  }
  function states(original_data, range, year, feature) {
    var temp = []
    original_data.forEach(element => {
      if (element["1-qid"] == year && parseFloat(element[feature]) >= range[0] && parseFloat(element[feature]) <= range[1]) {
        temp.push(parseInt(element['two_realRank']))
      }
    });
    return temp;
  }
  function cat_states(original_data, year, country) {
    var temp = []
    original_data.forEach(element => {
      if (element["1-qid"] == year && element["country"] == country) {
        temp.push(parseInt(element['two_realRank']))
      }
    });
    return temp;
  }
  //----------------------------------------------------------- Histogram creation ends here
}

//https://www.youtube.com/watch?v=N9nHQzboCUI