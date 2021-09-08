import * as d3 from 'd3';
import * as $ from "jquery"
export default function CreateChart(histogram_data, svg, feature_name, feature_index, number_of_features,store_instances,all_instances) {
  //( feature_height, selected_year, handleHistogramselection, feature_data)
  var parent_width = $(".feature_histograms_container").width()
  var parent_height = $(".feature_histograms_container").height()
  var feature_width = $(".feature_histograms_container").width()
  var feature_height = 120
  const margin = { top: 10, right: 5, bottom: 40, left: 5 }
  d3.select(".feature_histograms_container").attr('height', feature_height * number_of_features + 20)
  svg.attr('y', feature_height * feature_index).attr('width', parent_width).attr('height', feature_height)
  //-----------------------------------------------------------
  var occur = {}
  histogram_data.map(item => {
    if (item.y in occur) occur[item.y] = occur[item.y] + 1
    else { occur[item.y] = 1 }
  })
  var items = Object.entries(occur).sort((first, second) => second[1] - first[1]);
  var x = items.map(element => element[1]);
  var sum_x = d3.sum(x)
  svg.selectAll('.item_svg').data(items).join("svg").attr("class", 'item_svg').attr("x", (d, i) => (d3.sum(x.slice(0, i)) / sum_x) * feature_width).attr('y',margin.top).attr('width', (d, i) => ((d[1] / sum_x) * feature_width) - .2).attr('height', feature_height - margin.bottom)
    .attr('add_rectangle', function (d) {
      d3.select(this).selectAll(".my_rect").data([0]).join('rect').attr("class", "my_rect").attr("width", "100%").attr("height", feature_height - margin.bottom).style("fill", "gray")
      .attr("check",function(){
        if(feature_name+d[0] in all_instances){ if(all_instances[feature_name+d[0]].length>0){d3.select(this).classed('feature_clicked',true) }} // if the feature and the category exists we check the length and decide that it is clicked item. In categorical items if something is clicked it can not have empty instances
      })
      .on('click', function(){
        if(!d3.select(this).classed('feature_clicked')){ // if not classed we add the class and the data
          d3.select(this).classed('feature_clicked',true)
          store_instances(feature_name+d[0],histogram_data.filter(item=>item['y']==d[0]).map(item=>item.x))
        }
        else{ // if claassed we already have it so we set it empty
          d3.select(this).classed('feature_clicked',false)
          store_instances(feature_name+d[0],[])
        }
      })
      
    
    })
    .attr('add_text', function (d) {
      //if(d3.select(this).attr("width")>9)
      d3.select(this).selectAll("text").data([0]).join("text").text(d[0]).attr('x', "50%").attr("y", '50%').attr('dominant-baseline', 'middle').style("font-size", d3.select(this).attr("width") > 11 ? 10 : d3.select(this).attr("width") - 2).style("writing-mode", "tb").style("text-anchor", "middle").style('cursor', 'pointer')
    })
  //----------------------------------------------------------- Histogram creation ends here
  svg.selectAll(".hist_title").data([0]).join("text").attr("class", "hist_title").attr("y", feature_height-10).attr("x", feature_width / 2).attr("text-anchor", "middle").attr('font-size', 14).text(feature_name).style('text-transform','capitalize')
}