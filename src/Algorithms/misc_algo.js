import * as d3 from 'd3';
export function handle_transparency(class_name, clicked_circles, anim_config) {
    
    d3.selectAll(".items .my_circles").attr("stroke", "none")
    d3.selectAll(".items .my_circles").attr('opacity', 1)
    if (clicked_circles.length != 0) {
        d3.selectAll(".items").attr('opacity', 0.5)
        clicked_circles.map(circle_id => {
            d3.selectAll("." + circle_id).attr('opacity', 1)
            d3.selectAll("#" + circle_id).attr("stroke", "rgb(227, 26, 28,0.75)").raise().style("stroke-width",2.5)
        })
    }
    else {
        d3.selectAll(".items").attr('opacity', 1); // Groups
        d3.selectAll(".my_circles").attr('opacity', 1) // Circles 
        d3.selectAll(".items .my_circles").attr("stroke", "none")
        .style("stroke-width",0)
    }
    
}