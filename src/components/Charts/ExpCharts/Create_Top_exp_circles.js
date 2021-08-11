import * as d3 from "d3";
export default function CreateTop_exp_Circle(Topmargin,d, temp_selection, selected_instances, sorted_features, lime_data, selected_year, defualt_models, clicked_circles, Set_clicked_circles, diverginColor, anim_config, clicked_features, Set_clicked_features,symbolTypes,histogram_space_on_left,feature_width,dev_top_h) {
    var margin =Topmargin
    var selection=temp_selection.selectAll(".Top_exp_circle_g").data([0]).join("g").attr("class","Top_exp_circle_g").attr("transform","translate("+histogram_space_on_left+","+margin.item_top_margin+")")
    var item_width = feature_width
    var item_height = dev_top_h-(margin.item_top_margin+margin.item_bottom_margin)
    var feature_name = d[0]
    var feature_contrib_name = d[0] + "_contribution"
    var symbolGenerator = d3.symbol().size(50);
    var circ_data = []
    defualt_models.map(model => {
        lime_data[model].map(item => {
            if (item['1-qid'] == selected_year && selected_instances.includes(parseInt(item['two_realRank']))) {
                item['id'] = "A"+item['State'].replace(/ /g, '').replace(/[^a-zA-Z ]/g, "") + model.replace(/ /g, '').replace(/[^a-zA-Z ]/g, "")
                circ_data.push(item)
            }
        })})
        // Draw circle starts here
        var yScale = d3.scaleLinear().domain([d3.min(circ_data.map(item => parseFloat(item[d[0]]))), d3.max(circ_data.map(item => parseFloat(item[d[0]])))])
            .range([margin.circ_radius, item_height-(margin.item_bottom_margin+margin.circ_radius)])
        var xScale = d3.scaleLinear().domain([d3.min(circ_data.map(item => parseFloat(item[feature_contrib_name]))), d3.max(circ_data.map(item => parseFloat(item[feature_contrib_name])))])
            .range([margin.item_left_margin, item_width - margin.item_right_margin])

        var mycircles = selection.selectAll(".my_circles").data(circ_data, d => d['id']).join(
            enter => enter.append('g')
                .attr('id', d => d['id'])
                .attr('class', d=>d['id']+' items circle2 my_circles')
                .attr('fill', d => diverginColor(d['two_realRank']))                
                .attr("transform", function (d, i) {
                    var x_transform = xScale(parseFloat(d[feature_contrib_name]))
                    var y_transform = yScale(parseFloat(d[feature_name]))
                    return "translate(" + x_transform + "," + y_transform + ")";
                  })
                  .attr("Add_symbol", function (d, i) {
                    d3.select(this).selectAll("path").data([0]).join("path").attr("d", function () { symbolGenerator.type(d3[symbolTypes[d["model"]]]); return symbolGenerator(); })
                      .attr("fill", diverginColor(d['two_realRank']));
                  })
            // Update
            , update => update.attr('class', d=>d['id']+' items circle2 my_circles')
                .transition().duration(anim_config.circle_animation).delay(anim_config.rank_animation + anim_config.deviation_animation + anim_config.feature_animation)
                .attr("transform", function (d, i) {
                    var x_transform = xScale(parseFloat(d[feature_contrib_name]))
                    var y_transform = yScale(parseFloat(d[feature_name]))
                    return "translate(" + x_transform + "," + y_transform + ")";
                  })
                .attr('id', d => d['id'])
                .attr("Add_symbol", function (d, i) {
                    d3.select(this).selectAll("path").data([0]).join("path").attr("d", function () { symbolGenerator.type(d3[symbolTypes[d["model"]]]); return symbolGenerator(); })
                      .attr("fill", diverginColor(d['two_realRank']));
                  })
            , exit => exit.remove())
        mycircles.on('click', d => {
            Set_clicked_circles(clicked_circles.includes(d['id']) ? clicked_circles.filter(item => item != d['id']) : [...clicked_circles, d['id']])
        }
        )
        // Draw circle ends here
    

}