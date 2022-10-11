import * as d3 from 'd3';
export function handle_transparency(class_name, clicked_circles, anim_config) {    
    d3.selectAll(".my_circles").attr("stroke", "none")
    if (clicked_circles.length != 0) { // If there are no clicked circles make all opacity 1
        d3.selectAll(".items").attr('opacity', 0.3) // Groups
        d3.selectAll(".exp_circles").attr('opacity', 0.3) // Circles
        d3.selectAll(".mds_circles").attr('opacity', 0.3) // Circles
        d3.selectAll(".my_circles").attr('opacity', 0.3)
        clicked_circles.map(circle_id => {
            d3.selectAll("." + circle_id).attr('opacity', 1) // Groups
            d3.selectAll("#" + circle_id).attr('opacity', 1) // Circles
            //d3.selectAll("#" + circle_id).attr("stroke", "rgb(227, 26, 28,0.75)").raise()
            d3.selectAll("#" + circle_id).attr("stroke", "rgb(227, 26, 28,0.75)").raise().style("stroke-width",2.5)
        })
    }
    else {
        d3.selectAll(".my_circles").attr("stroke", "none")
        d3.selectAll("." + "my_circles").attr('opacity', 1) // Circles 
        d3.selectAll(".items").attr('opacity', 1); // Groups
    }

}