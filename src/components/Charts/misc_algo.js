import * as d3 from 'd3';
import { line } from 'd3';
export function handle_transparency(class_name, clicked_circles) {
    if (clicked_circles.length == 0) { d3.selectAll("." + class_name).attr('opacity', 1) }
    else {
        d3.selectAll("." + class_name).attr('opacity', 0.5)
        clicked_circles.map(id => d3.selectAll("#" + id).attr('opacity', 1))
    }
}
export function draw_lines(clicked_circles) {
    var lines=[]
    clicked_circles.map(d=>{
    var points = []
    d3.select("#exp_container").selectAll("#" + d).each(function (d) {
        points.push([d3.select(this).attr('cx'), d3.select(this).attr('cy')])
    })
    lines.push([d,d3.line()(points)])
    console.log(lines)
})
d3.select("#exp_container").selectAll('.mypath').data(lines).join('path').attr('class','mypath').attr('d', d=>d[1]).attr("fill", "none").attr("stroke", "grey").attr("stroke-width", 2);
}