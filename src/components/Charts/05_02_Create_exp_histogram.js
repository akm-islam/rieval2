import * as d3 from "d3";
export default function CreatexpHistogram(d, selection, selected_instances, sorted_features, lime_data, selected_year, defualt_models, clicked_circles, Set_clicked_circles, diverginColor, anim_config, clicked_features, Set_clicked_features,top_histogram_width) {
    var margin = { item_top_margin: 6, item_bottom_margin: 6, circ_radius: 5, item_left_margin: 6, item_right_margin: 6 }
    var item_width = d3.select("#svg2").attr("width")
    var item_height = d3.select("#svg2").attr("height")
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
            .range([0, item_height])
        // set the parameters for the histogram
        var histogram = d3.histogram()
            .value(d => d[feature_name])   // I need to give the vector of value
            .domain(y.domain())  // then the domain of the graphic
            .thresholds(y.ticks(3)); // then the numbers of bins
        // And apply this function to data to get the bins
        var bins = histogram(hist_data);
        var x = d3.scaleLinear().domain([0, d3.max(bins.map(item => item.length))])
        .range([0, item_width])

        //console.log(d[0],bins, hist_data)
        // append the bar rectangles to the svg element
        selection.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", d=> top_histogram_width-x(d.length))
            .attr("y", d=>y(d.x0))
            .attr("height", function (d) { return (y(d.x1) - y(d.x0)) -0.5})
            .attr("width", function (d) { return x(d.length)})
            .style("fill", "#b2b2b2")
            .attr("length",d=>d.length)

    })

}