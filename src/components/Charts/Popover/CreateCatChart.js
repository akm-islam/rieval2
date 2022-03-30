import * as d3 from 'd3';
var CreateCatChart = (data, feature, scatterplot_data,props) => {
    var rScale = d3.scalePow().exponent(0.2).domain(d3.extent(props.deviation_array)).range([8, 1])
    var feature_contribute = feature + "_contribution"
    var margin = { top: 0, right: 30, bottom: 85, left: 50, space_for_hist: 50 }, width = 520 - margin.left - margin.right, height = 270 - margin.top - margin.bottom;
    var barplot_data = {}
    data = data.filter(d => parseFloat(d[feature_contribute]) > 0)
    data.map(item => { if (barplot_data[item[feature]] > 0) { barplot_data[item[feature]] += 1 } else { barplot_data[item[feature]] = 1 } })

    var temp_x = Object.keys(barplot_data),
        temp_y = Object.values(barplot_data),
        y = d3.scaleLinear().domain([d3.min(temp_y), d3.max(temp_y)]).range([height, 0]).nice(); // circles will start from y position 10 and go upto height-10

    var x = d3.scaleBand().domain(temp_x).range([0, width]).padding(0.1);
    // add the x Axis
    //------------------------------------------------------------- All svgs
    var parent_svg = d3.select("#" + props.myid).attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom + margin.space_for_hist),
        svg1 = parent_svg.selectAll('.svg11').data([0]).join('svg').attr("y", margin.space_for_hist).attr("class", "svg11").selectAll(".myg").data([0]).join('g').attr("class", "myg").attr("transform",
            "translate(" + margin.left + "," + margin.top + ")")

    //------------------------------------------------------------------------------------------------------ Create Histogram starts here
    var hist_height = margin.space_for_hist
    y = d3.scaleLinear().domain([0, d3.max(temp_y)]).range([hist_height, 0]).nice();
    var svg0 = parent_svg.selectAll('.svg0').data([0]).join('svg').attr("class", "svg0").selectAll(".myg0").data([0]).join('g').attr("class", "myg0").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    // Add line on the bottom of the histogram
    svg0.selectAll(".myline").data([0]).join('line').attr("class", "myline").attr("x1", 0).attr("y1", margin.space_for_hist).attr("x2", width).attr("y2", margin.space_for_hist).attr("stroke", "#EBEBEB");
    svg0.selectAll("rect").data(Object.entries(barplot_data)).join('rect')
        .attr("x", d => x(d[0]))
        .attr("fill", "#b7b7b7")
        .attr("width", x.bandwidth())
        .attr("y", d => y(d[1]))
        .attr("height", d => hist_height - y(d[1]));
    //------------------------------------------------------------------------------------------------------ Create Histogram ends here

    var svg1 = parent_svg.selectAll('.svg11').data([0]).join('svg').attr("class", "svg11").selectAll(".myg").data([0]).join('g').attr("class", "myg").attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")
    svg1.selectAll(".myline2").data([0]).join('line').attr("class", "myline2").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", height).attr("stroke", "#EBEBEB");
    svg1.selectAll(".myline3").data([0]).join('line').attr("class", "myline3").attr("x1", 0).attr("y1", height).attr("x2", width).attr("y2", height).attr("stroke", "#EBEBEB");


    //------------- Add Y axis
    var y2 = d3.scaleOrdinal().domain([".", "0", ".."]).range([height / 4, height / 2, (3 * height) / 4]); // circles will start from y position 10 and go upto height-10
    svg1.selectAll(".myYaxis").data([0]).join('g').attr("class", "myYaxis").call(d3.axisLeft(y2).tickSize(-width * 1.0).ticks(1).tickValues(["0"]).tickFormat(d => d))
        .select(".domain").remove()
    svg1.selectAll(".myYaxis").selectAll('text').remove()
    d3.selectAll('.svg11').selectAll('.myYtext').data([["++ ve", height * .25], ["+ ve", height * .75]]).join("text").attr("class", "myYtext")
        .attr("x", 45).attr("y", (d, i) => d[1] + 4).text(d => d[0]).attr('font-size', 14).attr("text-anchor", "end")

    //------------- Add X axis
    svg1.selectAll(".myXaxis").data([0]).join('g').attr("class", "myXaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickSize(-height * 1.3)).selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "0em")
        .attr("transform", "rotate(-90)")
        .selectAll(".tick line").remove()
    svg1.selectAll(".domain").remove()
    svg1.selectAll(".tick line").attr("stroke", "#EBEBEB")
    //------------------------------------------------------------------------------------------------------ Create Histogram ends here
    //------------------------------------------------------------------------------------------------------ Scatterplot starts here
    svg1.selectAll(".scatterplot_g").data(scatterplot_data).join('g').attr("id", d => d[0] + "scatterplot_g_id").attr("class", "scatterplot_g").attr("ax", function (d) {
        var temp_y = d[1].map(item => parseFloat(item[feature + "_contribution"])) // d[1] 
        y = d3.scaleLinear().domain([d3.min(temp_y), d3.max(temp_y)]).range([height, 0]).nice();
        var circle_data=d[1].sort((a,b)=>a['deviation']-b['deviation'])
        d3.select(this).selectAll('circle').data(circle_data)
            .join("circle")
            .attr("cx", (d, i) => {
                return x(d[feature]) + x.bandwidth() / 2
            })
            .attr("cy", (d, i) => {
                if (y(parseFloat(d[feature_contribute])) < 10) {
                    return 10;
                }
                else if (y(parseFloat(d[feature_contribute])) > (height - 10)) {
                    return height - 10;
                }
                return y(parseFloat(d[feature_contribute])) - 0

            })
            .attr("actual_Y_value", d => d[feature_contribute])
            .attr("r", d => parseFloat(d[feature_contribute]) <= 0 ? 0 : rScale(d['deviation']))
            .attr("fill", (d) => {
                return props.diverginColor(d['two_realRank']).replace(")",",.7)")
            })
            .style('stroke',(d) => {
                return props.diverginColor(d['two_realRank'])
            })
            .attr('class', d => 'my_circles')
            .attr("id", d => d['id'])
            .on('click', d => {
                props.Set_clicked_circles(props.clicked_circles.includes(d['id']) ? props.clicked_circles.filter(item => item != d['id']) : [...props.clicked_circles, d['id']])
            })
    })

    // Define the div for the tooltip
    var div = d3.select("body").append("div")
        .attr("class", "tooltip2")
        .style("opacity", 0);
    d3.selectAll('.exp_circles')
        .on("mouseover", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", .9);
            div.html("<p>" + d['State'] + "</p>" + "<p>" + "Model: " + d3.select(this).attr('dataset_name') + "</p>")
                //div.html(d['State'])
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d) {
            d3.selectAll('.tooltip2').transition()
                .duration(500)
                .style("opacity", 0);
        })

    //------------------------------------------------------------------------------------------------------ Scatterplot ends here
}
export default CreateCatChart