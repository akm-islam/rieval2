
import * as d3 from 'd3';
import * as $ from 'jquery';
import * as misc_algo from './misc_algo'

export function CreatexpChart(selected_instances, sorted_features, lime_data, selected_year, defualt_models,clicked_circles,Set_clicked_circles) {
  var margin = { item_top_margin: 15, right: 14, bottom: 0, left: 20, circ_radius: 5,item_left_margin:25,item_right_margin:3 }
  var parent_width = $("#exp_container").width()-margin.item_left_margin
  var parent_height = $("#exp_container").height()-margin.item_top_margin*2
  var item_width = parent_width / sorted_features.length - margin.item_right_margin
  var item_height = parent_height
  var height = parent_height - margin.item_top_margin - margin.bottom;
  
  var parent_svg=d3.select("#exp_container")
  parent_svg.selectAll(".ylabels").data([[.125, "++"], [.375, "+"],[.5, "0"], [.625, "-"], [.875, "--"]]).join('text').attr('class', 'ylabels')
  .attr("y", d => d[0] * item_height).attr("x", margin.item_left_margin-5)// change x and text-anchor together
  .attr('text-anchor', 'end').attr('dominant-baseline', 'hanging')
  .text(d => d[1]).attr("font-size", 14).attr('fill', "#636363")

  parent_svg.selectAll('.title_rect').data(sorted_features).join('rect').attr('class','title_rect').attr('width',item_width+2).attr('height',margin.item_top_margin).attr('x',(d,i)=>margin.item_left_margin+item_width*i+(margin.item_right_margin*i-1)).attr('fill','#d1d1d1')
  parent_svg.selectAll(".title_text").data(sorted_features).join('text').attr('class', 'title_text').text(d=>d[0]).attr('y', 0).attr('dominant-baseline', 'hanging').attr("font-size", 12).attr('x',(d,i)=>(margin.item_left_margin+margin.item_right_margin*i)+item_width*i+item_width/2).attr('text-anchor','middle')
  parent_svg.selectAll('.item_rect').data(sorted_features).join('rect').attr('class','item_rect').attr('width',item_width).attr('height',item_height).attr('x',(d,i)=>margin.item_left_margin+item_width*i+(margin.item_right_margin*i))
  .attr('y',margin.item_top_margin).attr('fill','#d1d1d1').attr('fill-opacity', 0).attr('stroke','#b2b0b0')
  
  .attr('add_circle_rect_line', function (d,svg_index) {
    parent_svg.selectAll(".mylines"+svg_index).data([[.25], [.5],[.75]]).join('line').attr('class', 'mylines'+svg_index)
    .attr('x1',margin.item_left_margin+item_width*svg_index+(margin.item_right_margin*svg_index)).attr('x2',margin.item_left_margin+item_width*svg_index+(margin.item_right_margin*svg_index+item_width))
    .attr('y1',d=>d*(item_height+margin.item_top_margin)).attr('y2',d=>d*(item_height+margin.item_top_margin)).attr('stroke-width',1).attr("stroke", "#bababa")

    var feature_name=d[0]
    var feature_contrib_name = d[0] + "_contribution"
    var circ_data = []
    defualt_models.map(model => {
      lime_data[model].map(item => {
        if (item['1-qid'] == selected_year && selected_instances.includes(parseInt(item['two_realRank']))) { 
          item['id']=item['State'].replace(/\s/g,'')+item['1-qid']+model.replace(/\s/g,'')
          circ_data.push(item) 
        }
      })
    })
    var xScale=d3.scaleLinear().domain([d3.min(circ_data.map(item=>parseFloat(item[d[0]]))),d3.max(circ_data.map(item=>parseFloat(item[d[0]])))]).range([margin.item_left_margin+2*margin.circ_radius,item_width-2*margin.circ_radius])
    var yScale=d3.scaleLinear().domain([d3.min(circ_data.map(item=>parseFloat(item[feature_contrib_name]))),d3.max(circ_data.map(item=>parseFloat(item[feature_contrib_name])))]).range([margin.item_top_margin+margin.circ_radius,item_height-margin.circ_radius])
    d3.select(this.parentNode).selectAll(".my_circles"+svg_index).data(circ_data).join('circle').attr('class','circle2 my_circles'+svg_index)
    .attr('cx',(d,i)=>(item_width*svg_index)+margin.item_left_margin+margin.circ_radius/2+ xScale(parseFloat(d[feature_name]))).attr('cy',d=>margin.circ_radius/2+yScale(parseFloat(d[feature_contrib_name]))).attr('r',margin.circ_radius).attr('fill','grey')
    .attr('id',d=>d['id'])
    .on('click',function(d){
      var active_ids=[]
      if(clicked_circles.includes(d['id'])){
        d3.selectAll("#"+d['id']).filter(d3.matcher('path')).remove()
        active_ids=clicked_circles.filter(item=>item!=d['id'])
      }
      else{
        active_ids=[...clicked_circles,d['id']]
      }
      Set_clicked_circles([...active_ids])
    })
    })
}
