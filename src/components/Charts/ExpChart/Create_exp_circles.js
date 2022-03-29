import * as d3 from "d3";
import { createStore } from 'redux';
import reducer from "../../../store/reducer";
const store = createStore(reducer);
const state = store.getState();
export default function CreatexpCircle(d, selection, selected_instances,
    lime_data, selected_year, default_models, clicked_circles, Set_clicked_circles, diverginColor, anim_config, item_width, item_height, deviation_array, index, threshold,dataset) {
    var margin = { item_top_margin: 25, item_bottom_margin: 9, circ_radius: 5, item_left_margin: 9, item_right_margin: 9 }

    var div = d3.select("body").selectAll(".tooltip").data([0]).join('div').attr("class", "tooltip").style("opacity", 0);
    var feature_name = d[0]
    var feature_contrib_name = d[0] + "_contribution"
    var circ_data = []
    var sum_data = []
    default_models.map(model => {
        lime_data[model].map(item => {
            if (parseFloat(item[feature_contrib_name]) > 0 && item['1-qid'] == selected_year && selected_instances.includes(parseInt(item['two_realRank']))) {
                if (item['deviation'] < threshold) { sum_data.push(parseFloat(item[feature_contrib_name])) }
                item['id'] = item['State'].replace(/ /g, '').replace(/[^a-zA-Z ]/g, "") + model.replace(/ /g, '').replace(/[^a-zA-Z ]/g, "")
                circ_data.push(item)
            }
        })
    })
    // Draw circle starts here
    if (isNaN(lime_data[default_models[0]][0][feature_name])) {
        var yScale = d3.scaleBand().domain(lime_data[default_models[0]].map(item => item[feature_name])).range([margin.item_top_margin, item_height - margin.item_bottom_margin])
    }
    else {
        var yScale = d3.scaleLinear().domain([d3.min(circ_data.map(item => parseFloat(item[d[0]]))), d3.max(circ_data.map(item => parseFloat(item[d[0]])))]).range([margin.item_top_margin, item_height - margin.item_bottom_margin])
    }
    var xScale = d3.scaleLinear().domain([d3.min(circ_data.map(item => parseFloat(item[feature_contrib_name]))), d3.max(circ_data.map(item => parseFloat(item[feature_contrib_name])))]).range([margin.item_left_margin, item_width - margin.item_right_margin])
    //----------
    var my_mean = d3.mean(sum_data)
    //----------
    selection.selectAll(".my_mean_line").data([0]).join("line").attr("class", "my_mean_line").attr("x1", xScale(my_mean)).attr("x2", xScale(my_mean)).attr("y1", 18).attr("y2", item_height).attr('stroke', "rgb(96, 96, 96,0.5)").attr('stroke-width', 1)
    var rScale = d3.scalePow().exponent(0.2).domain(d3.extent(deviation_array)).range([state.global_config.max_circle_r, 1])
    var mycircles = selection.selectAll(".my_circles").data(circ_data, d => d['id']).join(
        enter => enter.append('circle')
            .attr('id', d => d['id'])
            .attr('class', d => 'my_circles')
            .attr("transform", function (d, i) {
                var x_transform = xScale(parseFloat(d[feature_contrib_name]))
                var y_transform = getRandomArbitrary(margin.item_top_margin, item_height - margin.item_bottom_margin, i)
                return "translate(" + x_transform + "," + y_transform + ")";
            })
            .attr("r", d => d['deviation'] > threshold ? 0 : rScale(d['deviation']))
        //.attr('test',(d)=>console.log(rScale(50),'rScale',d['deviation']))
        // Update
        , update => update.attr('class', d => d['id'] + ' items circle2 my_circles')
            .transition().duration(anim_config.circle_animation).delay(anim_config.rank_animation + anim_config.deviation_animation + anim_config.feature_animation)
            .attr("transform", function (d, i) {
                var x_transform = xScale(parseFloat(d[feature_contrib_name]))
                var y_transform = getRandomArbitrary(margin.item_top_margin, item_height - margin.item_bottom_margin, i)
                return "translate(" + x_transform + "," + y_transform + ")";
            })
            .attr('id', d => d['id'])
            .attr("r", d => d['deviation'] > threshold ? 0 : rScale(d['deviation']))
        , exit => exit.remove())
    mycircles.attr("myindex", index).attr('feature_name', d[0]).on('click', d => {
        Set_clicked_circles(clicked_circles.includes(d['id']) ? clicked_circles.filter(item => item != d['id']) : [...clicked_circles, d['id']])
    })
        .attr("fill", (d) => {
            return diverginColor(d['two_realRank']).replace(")", ",.7)")
        })
        .style('stroke', (d) => {
            return diverginColor(d['two_realRank'])
        })
    if (index == 0) {
        selection.selectAll(".avg_text").data(['avg']).join("text").attr("x", xScale(my_mean) + 5).attr("class", "avg_text").attr("myindex", index).attr("y", (item_height - margin.item_top_margin - margin.item_bottom_margin) / 2 + margin.item_top_margin).text('avg').attr('font-size', 12)
        .attr('dominant-baseline', "middle").attr('text-anchor', 'middle').attr('transform', d => "rotate(-90," + (xScale(my_mean) + 5) + "," + ((item_height - margin.item_top_margin - margin.item_bottom_margin) / 2 + margin.item_top_margin) + ")")
    }
    else { selection.selectAll('.avg_text').remove() }
    
    mycircles.on("mouseover", d => {
        div.transition().duration(200).style("opacity", .9);
        div.html("<p>Name: "+d['State']+"</p>"+"<p>Ground Truth: "+d['two_realRank']+"</p>Model Outcome: "+d['predicted']+"</p>").style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY + 12) + "px")
    }).on("mouseout", d => div.transition().duration(200).style("opacity", 0))

    // Draw circle ends here
    function getRandomArbitrary(min, max, seed) {
        min = min || 0;
        max = max || 1;
        var rand;
        if (typeof seed === "number") {
            seed = (seed * 9301 + 49297) % 233280;
            var rnd = seed / 233280;
            var disp = Math.abs(Math.sin(seed));
            rnd = (rnd + disp) - Math.floor((rnd + disp));
            rand = Math.floor(min + rnd * (max - min + 1));
        } else {
            rand = Math.floor(Math.random() * (max - min + 1)) + min;
        }
        return rand;
    }
}