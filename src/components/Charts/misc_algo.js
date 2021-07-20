import * as d3 from 'd3';
export function handle_transparency(class_name, clicked_circles, anim_config) {
    if (clicked_circles.length == 0) { d3.selectAll("." + class_name).attr('opacity', 1) }
    else {
        d3.selectAll(".items").attr('opacity', 0.5)
        d3.selectAll("." + class_name).attr('opacity', 0.2)
        clicked_circles.map(id => d3.selectAll("#" + id).attr('opacity', 1).attr('stroke-width',0).attr('stroke','black'))
    }
}
export function draw_lines(clicked_circles, diverginColor, anim_config) {
    d3.selectAll("#mylines").remove()
    clicked_circles.map(d => {
        var lines = []
        var two_realRank = 0
        var parent_id = d3.select("#" + d).attr('parent_id')
        var points = []
        d3.select("#" + parent_id).selectAll("#" + d).each(function (d) {
            two_realRank = d3.select(this).attr('two_realRank')
            points.push([d3.select(this).attr('cx2'), d3.select(this).attr('cy')])
        })
        lines.push([d, d3.line()(points), two_realRank])
        console.log(lines,parent_id,d3.select("#" + parent_id).selectAll("#" + d))
        d3.select("#"+parent_id).selectAll('.'+d).raise().data(lines, d => d[0]).join('path').attr("stroke", d => diverginColor(d[2])).attr("stroke-width", 2)
            .attr('id','mylines').attr('State', d => d[2]).attr('class', d).transition().duration(5000).attr('d', d => d[1]).attr("fill", "none")
    })
}