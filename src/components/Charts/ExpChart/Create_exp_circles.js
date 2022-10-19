import * as d3 from "d3";
import { createStore } from 'redux';
import reducer from "../../../store/reducer";
const store = createStore(reducer);
const state = store.getState();
export default function CreatexpCircle(d, selection, selected_instances,
    lime_data, selected_year, default_models, clicked_circles, Set_clicked_circles, diverginColor, anim_config, item_width, item_height,
    deviation_array, index, threshold, dataset, title_rect_height, label_on,sorted_features) {
    var margin = { item_top_margin: 35, item_bottom_margin: 20, circ_radius: 5, item_left_margin: 7, item_right_margin: 7 }
    var div = d3.select("body").selectAll(".tooltip").data([0]).join('div').attr("class", "tooltip").style("opacity", 0);

    var feature_contrib_name = d[0] + "_contribution"
    //-----------------Get Global range for scaling

    var global_items = []
    var biggest=0,b_feature="",b_item=""
    sorted_features.map(feature => {
        lime_data[default_models[0]].map(item => {
            if (selected_instances.includes(parseInt(item['two_realRank']))) {
                global_items.push(parseFloat(item[feature[0] + "_contribution"]))
                if(parseFloat(item[feature[0] + "_contribution"])>biggest){
                    biggest=parseFloat(item[feature[0] + "_contribution"])
                    b_feature=feature
                    b_item=item['two_realRank']
                }
            }
        })
    })
    var global_range=d3.extent(global_items)
    console.log(default_models,"default_models",biggest,b_feature,b_item)
    //-----------------Get Global range for scaling
    var circ_data = []
    var sum_data = []
    default_models.map(model => {
        lime_data[model].map(item => {
            // The following line filters out all negative 
            if (item['1-qid'] == selected_year && selected_instances.includes(parseInt(item['two_realRank']))) {
                if (item['deviation'] < threshold) { sum_data.push(parseFloat(item[feature_contrib_name])) }
                item['id'] = item['State'].replace(/ /g, '').replace(/[^a-zA-Z ]/g, "")
                circ_data.push(item)
            }
        })
    })
    console.log(circ_data,"circ_data")
    // Draw circle starts here
    var xScale = d3.scaleLinear().domain(global_range).range([margin.item_left_margin, item_width - margin.item_right_margin])
    //----------
    var my_mean = d3.mean(sum_data)
    //----------
    selection.selectAll(".my_mean_line").data([0]).join("line").attr("class", "my_mean_line").attr("x1", xScale(my_mean)).attr("x2", xScale(my_mean)).attr("y1", title_rect_height + 3).attr("y2", item_height).attr('stroke', "rgb(96, 96, 96,0.5)").attr('stroke-width', 1)
    var rScale = d3.scalePow().exponent(0.2).domain(d3.extent(deviation_array)).range([state.global_config.max_circle_r, state.global_config.min_circle_r])
    var mycircles = selection.selectAll(".my_circles").data(circ_data, d => d['id']).join(
        enter => enter.append('circle')
            .attr('id', d => d['id'])
            .attr('class', d => 'my_circles exp_circles')
            .attr("transform", function (d, i) {
                var x_transform = xScale(parseFloat(d[feature_contrib_name]))
                var y_transform = getRandomArbitrary(margin.item_top_margin, item_height - margin.item_bottom_margin, i)
                if (label_on && clicked_circles.includes(d['id'])) {
                    selection.selectAll(".label" + d['id']).data([0]).join("text").attr("x", x_transform - 3).attr("class", "label" + d['id']).attr('dominant-baseline', "middle").attr("y", y_transform + 13).text(d["two_realRank"]).attr("opacity", 0.7).attr("font-size", 10)
                }
                else {
                    selection.selectAll(".label" + d['id']).remove()
                }
                return "translate(" + x_transform + "," + y_transform + ")";
            })
            .attr("r", d => d['deviation'] > threshold ? 0 : rScale(d['deviation']))
        // Update
        , update => update.attr('class', d => d['id'] + ' items exp_circles my_circles')
            .transition().duration(anim_config.circle_animation).delay(anim_config.rank_animation + anim_config.deviation_animation + anim_config.feature_animation)
            .attr("transform", function (d, i) {
                var x_transform = xScale(parseFloat(d[feature_contrib_name]))
                var y_transform = getRandomArbitrary(margin.item_top_margin, item_height - margin.item_bottom_margin, i)
                if (label_on && clicked_circles.includes(d['id'])) {
                    selection.selectAll(".label" + d['id']).data([0]).join("text").attr("x", x_transform - 3).attr("class", "label" + d['id']).attr('dominant-baseline', "middle").attr("y", y_transform + 13).text(d["two_realRank"]).attr("opacity", 0.7).attr("font-size", 10)
                }
                else {
                    selection.selectAll(".label" + d['id']).remove()
                }
                return "translate(" + x_transform + "," + y_transform + ")";
            })
            .attr('id', d => d['id'])
            .attr("r", d => d['deviation'] > threshold ? 0 : rScale(d['deviation']))
        , exit => exit.remove())

    mycircles.attr("myindex", index).attr('feature_name', d[0])
        .attr("fill", d => diverginColor(d['two_realRank']).replace(")", ",.7)")).attr("stroke", (d) => {
            if (clicked_circles.includes(d['id'])) {
                return "rgb(227, 26, 28,0.75)"
            }
        })
        .attr("handle_opacity", function (d) {
            if (clicked_circles.length == 0) { d3.selectAll(".my_circles").attr("opacity", 1) }
            if (clicked_circles.includes(d['id'])) {
                d3.select(this).attr("opacity", 1)
            }
            else {
                d3.select(this).attr("opacity", 0.3)
            }
        })
        .on('click', function (d) {
            //d3.selectAll("#"+d['id']).style("stroke-width",10).attr("stroke","rgb(227, 26, 28,0.75)").raise().transition().duration(3000).style("stroke-width",2.5)
            Set_clicked_circles(clicked_circles.includes(d['id']) ? clicked_circles.filter(item => item != d['id']) : [...clicked_circles, d['id']])
        })

        .style("stroke-width", function (d) {
            if (clicked_circles.includes(d['id'])) {
                d3.select(this).raise()
                return 2.5
            }
        })

    if (index == 0) {
        selection.selectAll(".avg_text").data(['avg']).join("text").attr("x", xScale(my_mean) + 5).attr("class", "avg_text").attr("myindex", index).attr("y", (item_height - margin.item_top_margin - margin.item_bottom_margin) / 2 + margin.item_top_margin).text('avg').attr('font-size', 12)
            .attr('dominant-baseline', "middle").attr('text-anchor', 'middle').attr('transform', d => "rotate(-90," + (xScale(my_mean) + 5) + "," + ((item_height - margin.item_top_margin - margin.item_bottom_margin) / 2 + margin.item_top_margin) + ")")
    }
    else { selection.selectAll('.avg_text').remove() }

    mycircles.on("mouseover", d => {
        div.transition().duration(200).style("opacity", .9);
        div.html("<p>Name: " + d['State'] + "</p>" + "<p>Ground Truth: " + d['two_realRank'] + "</p>Model Outcome: " + d['predicted'] + "</p>").style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY + 12) + "px")
    }).on("mouseout", d => div.transition().duration(200).style("opacity", 0))
    .attr("global_range",global_range)
    .attr("scaled_value",d=>d[feature_contrib_name]+"-----"+xScale(parseFloat(d[feature_contrib_name])))

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