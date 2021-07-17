import * as d3 from 'd3';
import { line } from 'd3';
export function handle_transparency(class_name, clicked_circles,anim_config) {
    if (clicked_circles.length == 0) { d3.selectAll("." + class_name).attr('opacity', 1) }
    else {
        d3.selectAll("." + class_name).attr('opacity', 0.5)
        clicked_circles.map(id => d3.selectAll("#" + id).attr('opacity', 1))
    }
}
export function draw_lines(clicked_circles,diverginColor,anim_config) {
    var lines=[]
    var two_realRank=0
    clicked_circles.map(d=>{
    var points = []
    d3.select("#exp_container").selectAll("#" + d).each(function (d) {
        two_realRank=d3.select(this).attr('two_realRank')
        points.push([d3.select(this).attr('cx2'), d3.select(this).attr('cy')])
    })
    lines.push([d,d3.line()(points),two_realRank])
})
d3.select("#exp_container").selectAll('.mypath').raise().data(lines).join('path').attr("stroke", d=>diverginColor(d[2])).attr("stroke-width", 2)
.attr('State',d=>d[2]).attr('class','mypath').transition().duration(5000).attr('d', d=>d[1]).attr("fill", "none")

}