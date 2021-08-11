import * as d3 from "d3";
export default function CreateHistogram(Topmargin,d, temp_selection, selected_instances, sorted_features, lime_data, selected_year, defualt_models, clicked_circles, Set_clicked_circles, diverginColor, anim_config, clicked_features, Set_clicked_features,histogram_space_on_left,feature_width,dev_top_h) {
    var margin = Topmargin
    var selection=temp_selection.selectAll(".hist_circ_axis_container").data([0]).join("g").attr("class","hist_circ_axis_container").attr("transform","translate(0,"+margin.item_top_margin+")")
    var item_width = 30
    var item_height = dev_top_h-(margin.item_top_margin+margin.item_bottom_margin)
    var axis_x_transform=feature_width+histogram_space_on_left-8
    var feature_name = d[0]
    
    defualt_models.map(model => {
        var hist_data = []
        lime_data[model].map(item => {
            if (item['1-qid'] == selected_year && selected_instances.includes(parseInt(item['two_realRank']))) {
                item[feature_name] = parseFloat(item[feature_name])
                hist_data.push(item)
            }
        })
        // Draw circle starts here
        var y = d3.scaleLinear().domain([d3.min(hist_data.map(item => parseFloat(item[feature_name]))), d3.max(hist_data.map(item => parseFloat(item[feature_name])))])
            .range([0, item_height-margin.item_bottom_margin]).nice()
        // set the parameters for the histogram
        var histogram = d3.histogram().value(d => d[feature_name]).domain(y.domain()).thresholds(y.ticks(3))
        var bins = histogram(hist_data);
        var x = d3.scaleLinear().domain([0, d3.max(bins.map(item => item.length))]).range([0, item_width])
        // append the bar rectangles to the svg element
        selection.selectAll("rect").data(bins).join("rect").attr("x", d=> histogram_space_on_left-x(d.length))
            .attr("y", d=>y(d.x0)).attr("height", function (d) { return (y(d.x1) - y(d.x0)) -0.5}).attr("width", function (d) { return x(d.length)}).style("fill", "#b2b2b2").attr("length",d=>d.length)
            .attr("add_horizontal_lines",function(d,i){
                d3.select(this.parentNode).selectAll(".myhorizontal_lines").data(bins).join('line').attr("class","myhorizontal_lines")
                .attr("y1",d=>y(d.x0)).attr("y2",d=>y(d.x0)).attr("x1",histogram_space_on_left).attr("x2",feature_width+histogram_space_on_left -2).attr('stroke-width', 0.5).attr("stroke", "#bababa")
            })
            .attr("add_vertical_line",function(d,i){
                d3.select(this.parentNode).selectAll(".my_vertical_lines").data([0]).join('line').attr("class","my_vertical_lines").attr("transform","translate("+histogram_space_on_left+",0)")
                .attr("y1",0).attr("y2",item_height-margin.item_bottom_margin).attr("x1",feature_width/2).attr("x2",feature_width/2).attr('stroke-width', 0.5).attr("stroke", "#bababa")
            })
    //-------------- Add right axis
            selection.selectAll(".axisRight").data([0]).join("g").attr("class","axisRight").attr("transform","translate("+axis_x_transform+",0)").call(d3.axisRight(y).ticks(3).tickFormat(d3.format(".1s")))
        .attr("remove",function(){d3.select(this).selectAll(".domain").remove();d3.select(this).selectAll("line").remove();d3.select(this).selectAll("text").attr("font-size",9)})
        
    })

}