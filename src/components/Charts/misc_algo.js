import * as d3 from 'd3';
export function handle_transparency(class_name, clicked_circles, anim_config) {
    if (clicked_circles.length != 0) { // If there are no clicked circles make all opacity 1
        d3.selectAll(".items").attr('opacity', 0.6) // Groups
        d3.selectAll("." + "my_circles").attr('opacity', 0.3) // Circles
        clicked_circles.map(circle_id => {
            d3.selectAll("." + circle_id).attr('opacity', 1) // Groups
            d3.selectAll("#" + circle_id).attr('opacity', 1) // Circles
        })
    }
    else {
        d3.selectAll(".items").attr('opacity', 1); // Groups
        d3.selectAll("." + "my_circles").attr('opacity', 1) // Circles 
    }
}