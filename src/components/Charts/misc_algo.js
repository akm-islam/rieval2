import * as d3 from 'd3';
export function handle_transparency(class_name, clicked_circles, anim_config) {
    if (clicked_circles.length == 0) { // If there are no clicked circles make all opacity 1
        d3.selectAll(".items").attr('opacity', 1); // Groups
        d3.selectAll("." + "circle2").attr('opacity', 1) // Circles 
    }
    else {
        d3.selectAll(".items").attr('opacity', 0.5) // Groups
        d3.selectAll("." + "circle2").attr('opacity', 0.1) // Circles
        clicked_circles.map(circle_id => {
            d3.selectAll("." + circle_id).attr('opacity', 1) // Groups
            d3.selectAll("#" + circle_id).attr('opacity', 1) // Circles
        })
    }
}
export function draw_lines(clicked_circles, diverginColor, anim_config) {
    d3.selectAll("#mylines").remove()
    clicked_circles.map(d => {
        var lines = []
        var two_realRank = 0
        var parent_id = d3.select("#" + d).attr('id').substring(0,3)
        var points = []
        d3.select("#" + parent_id).selectAll("#" + d).each(function (d) {
            two_realRank = d3.select(this).attr('two_realRank')
            points.push([d3.select(this).attr('cx2'), d3.select(this).attr('cy')])
        })
        lines.push([d, d3.line()(points), two_realRank])
        d3.select("#" + parent_id).selectAll('.' + d).raise().data(lines, d => d[0]).join('path').attr("stroke", d => diverginColor(d[2])).attr("stroke-width", 2)
            .attr('id', 'mylines').attr('State', d => d[2]).attr('class', d).transition().duration(5000).attr('d', d => d[1]).attr("fill", "none")
    })
}