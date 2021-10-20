import * as d3 from 'd3';
import * as $ from 'jquery';
import * as d3lasso from 'd3-lasso';
import { createStore } from 'redux';
import reducer from "../../../store/reducer";
const store = createStore(reducer);
const state = store.getState();
export default function getMdsData(myurl, data) {
  return fetch(myurl, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.json())
    .then(response => {
      console.log(response)
      return response;
    }).catch(error => console.error('Error: from Json Handler', error));
}
export function Create_MDS(mds_ref,circle_data,mds_id,diverginColor, Set_clicked_circles,deviation_array) {
  console.log(circle_data,"MDS_data")
  var circle_data=circle_data.sort((a,b)=>b['deviation']-a['deviation'])
  var rScale = d3.scalePow().exponent(0.2).domain(d3.extent(deviation_array)).range([state.global_config.max_circle_r, 1])
   
  //---------------------------------------------------------------------------
  // Create mds ends here
  var margin = { item_top_margin: 15, right: 14, bottom: 0, left: 20, circ_radius: 5, item_left_margin: 25, item_right_margin: 3 }
  var w = $(mds_id).width() - margin.item_left_margin
  var h = $(mds_id).height() - margin.item_top_margin * 2
  var r = 5;
  var xScale = d3.scaleLinear().domain(d3.extent(circle_data.map(item => item['x']))).range([r * 2, w - r * 2])
  var yScale = d3.scaleLinear().domain(d3.extent(circle_data.map(item => item['y']))).range([r * 2, h - r * 2])

  var svg = d3.select(mds_ref.current).style("border", "1px solid #eaeaea")
  var circles = svg.selectAll("circle")
    .data(circle_data)
    .join("circle")
    .attr("cx", d => xScale(d['x']))
    .attr("cy", d => yScale(d['y']))
    .attr("r", d=>rScale(d['deviation']))
    .attr("fill", (d) => {
      return diverginColor(d['two_realRank']).replace(")",",.7)")
  })
  .style('stroke',(d) => {
      return diverginColor(d['two_realRank'])
  })
    .attr('id', d => d['id'])
    .attr('class', 'my_circles')
  // Lasso functions
  var lasso_start = function () {
    lasso.items()
      .classed("not_possible", true)
      .classed("selected", false);
  };

  var lasso_draw = function () {
    // Style the possible dots
    lasso.possibleItems()
      .classed("not_possible", false)
      .classed("possible", true);

    // Style the not possible dot
    lasso.notPossibleItems()
      .classed("not_possible", true)
      .classed("possible", false);
  };

  var lasso_end = function () {
    var selected_ids = []
    lasso.selectedItems().each(function () {
      selected_ids.push(d3.select(this).attr("id"))
    })
    Set_clicked_circles(selected_ids)
    // Reset the color of all dots
    lasso.items()
      .classed("not_possible", false)
      .classed("possible", false);

    // Style the selected dots
    lasso.selectedItems()
      .classed("selected", true)

    // Reset the style of the not selected dots
    lasso.notSelectedItems()

  };
  var lasso = d3lasso.lasso()
    .closePathSelect(true)
    .closePathDistance(100)
    .items(circles)
    .targetArea(svg)
    .on("start", lasso_start)
    .on("draw", lasso_draw)
    .on("end", lasso_end);
  svg.call(lasso);
}


