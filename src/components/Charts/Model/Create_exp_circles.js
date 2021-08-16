import * as d3 from "d3";
export default function CreatexpCircle(d, selection, selected_instances, sorted_features, 
    lime_data, selected_year, defualt_models, clicked_circles, Set_clicked_circles, diverginColor, anim_config,
    clicked_features, Set_clicked_features, symbolTypes, item_width, item_height) {
    var margin = { item_top_margin: 20, item_bottom_margin: 6, circ_radius: 5, item_left_margin: 6, item_right_margin: 6 }
    var feature_name = d[0]
    var feature_contrib_name = d[0] + "_contribution"

    var circ_data = []
    var sum_data = []
    defualt_models.map(model => {
        lime_data[model].map(item => {
            if (item['1-qid'] == selected_year && selected_instances.includes(parseInt(item['two_realRank']))) {
                sum_data.push(parseFloat(item[feature_contrib_name]))
                item['id'] = item['State'].replace(/ /g, '').replace(/[^a-zA-Z ]/g, "") + model.replace(/ /g, '').replace(/[^a-zA-Z ]/g, "")
                circ_data.push(item)
            }
        })
    })
    // Draw circle starts here
    var yScale = d3.scaleLinear().domain([d3.min(circ_data.map(item => parseFloat(item[d[0]]))), d3.max(circ_data.map(item => parseFloat(item[d[0]])))])
        .range([margin.item_top_margin, item_height - margin.item_bottom_margin])
    var xScale = d3.scaleLinear().domain([d3.min(circ_data.map(item => parseFloat(item[feature_contrib_name]))), d3.max(circ_data.map(item => parseFloat(item[feature_contrib_name])))])
        .range([margin.item_left_margin, item_width - margin.item_right_margin])

    //----------
    var my_mean = d3.mean(sum_data)
    //----------
    selection.selectAll(".myline").data([0]).join("line").attr("class","myline").attr("x1",xScale(my_mean)).attr("x2",xScale(my_mean)).attr("y1",0).attr("y2",item_height).attr('stroke',"#d6d6d6").attr('stroke-width',1)

    var mycircles = selection.selectAll(".my_circles").data(circ_data, d => d['id']).join(
        enter => enter.append('circle')
            .attr('id', d => d['id'])
            .attr('class', d => 'my_circles')
            .attr('fill', d => diverginColor(d['two_realRank']))
            .attr("transform", function (d, i) {
                var x_transform = xScale(parseFloat(d[feature_contrib_name]))
                var y_transform = yScale(parseFloat(d[feature_name]))
                return "translate(" + x_transform + "," + y_transform + ")";
            })
            .attr("r", 5)
        // Update
        , update => update.attr('class', d => d['id'] + ' items circle2 my_circles')
            .transition().duration(anim_config.circle_animation).delay(anim_config.rank_animation + anim_config.deviation_animation + anim_config.feature_animation)
            .attr("transform", function (d, i) {
                var x_transform = xScale(parseFloat(d[feature_contrib_name]))
                var y_transform = yScale(parseFloat(d[feature_name]))
                return "translate(" + x_transform + "," + y_transform + ")";
            })
            .attr('id', d => d['id'])
        , exit => exit.remove())
    mycircles.on('click', d=>{
        console.log(d['id'],clicked_circles)
        Set_clicked_circles(clicked_circles.includes(d['id']) ? clicked_circles.filter(item => item != d['id']) : [...clicked_circles, d['id']])
    }
    )
    // Draw circle ends here


}