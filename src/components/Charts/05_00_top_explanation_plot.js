import * as d3 from "d3";
import * as $ from "jquery";
import CreatexpCircle from "./05_01_Create_exp_circles"
import CreatexpHistogram from "./05_02_Create_exp_histogram"
export default function create_top_explanation_plot(parent_id, selected_instances, sorted_features, lime_data, selected_year, defualt_models, 
    clicked_circles, Set_clicked_circles, diverginColor, anim_config, clicked_features, Set_clicked_features, feature_total_width, 
    feature_width,top_histogram_width) {
    var top_parent_height = $("#" + parent_id).height();
    d3.select("#" + parent_id).selectAll(".features").data(sorted_features).join("svg").attr("class", "features")
        .attr("x", (d, i) => feature_total_width * i).attr("width", feature_total_width).attr("height", top_parent_height)
        .attr("svg1_add_feature_exp",function(d){
            d3.select(this).selectAll("#svg1").data([0]).join("svg").attr('id','svg1').attr("x", top_histogram_width).attr("width", feature_width).attr("height", top_parent_height)
            .attr("add_exp_circles",function(){
                CreatexpCircle(d,d3.select(this), selected_instances, sorted_features, lime_data, selected_year, defualt_models, clicked_circles, Set_clicked_circles, diverginColor, anim_config, clicked_features, Set_clicked_features)
            })
        })
        .attr("svg2_add_feature_hist",function(d){
            d3.select(this).selectAll("#svg2").data([0]).join("g").attr('id','svg2').attr("transform","translate("+0+","+"0)" ).attr("width", top_histogram_width).attr("height", top_parent_height)
            .attr("add_exp_circles",function(){
                CreatexpHistogram(d,d3.select(this), selected_instances, sorted_features, lime_data, selected_year, defualt_models, clicked_circles, Set_clicked_circles, diverginColor, anim_config, clicked_features, Set_clicked_features,top_histogram_width)
            })
        })
}