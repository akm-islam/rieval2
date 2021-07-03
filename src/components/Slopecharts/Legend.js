
import * as d3 from 'd3';
import * as $ from 'jquery';
export function createLegend(container,range,color) {
    var data=Object.entries(color)
    var parent_width=$("."+container).width()
    var parent_height=$("."+container).height()
    var svg=d3.select("."+container).select('svg').attr('width',parent_width).attr('height',parent_height)
    //var height=parent_height/data.length
    var rect_width = 15
    var rect_height = parent_height/data.length
    var x_shift = 5
    svg.selectAll(".leg_rect").data(data).join('rect').attr('class', "leg_rect").attr('x', 2).attr('y', (d, i) => (rect_height*i))
    .attr('width', rect_width).attr('height', rect_height).attr('fill', d => d[1])

    svg.selectAll(".leg_text").data([[10,range[0]],[parent_height/2,parseInt((range[1]+range[0])/2)],[parent_height-5,range[1]]]).join('text').attr('class', "leg_text").attr('x', x_shift + rect_width)
    .attr('y', d =>d[0])
    .text(d=>d[1]).attr('font-size', 12)

}