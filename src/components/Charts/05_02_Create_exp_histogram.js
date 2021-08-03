import * as d3 from "d3";
export default function CreatexpHistogram(d, selection, selected_instances, sorted_features, lime_data, selected_year, defualt_models, clicked_circles, Set_clicked_circles, diverginColor, anim_config, clicked_features, Set_clicked_features) {
    var margin = { item_top_margin: 6, item_bottom_margin: 6, circ_radius: 5, item_left_margin: 6, item_right_margin: 6 }
    var item_width = d3.select("#svg2").attr("width")
    var item_height = d3.select("#svg2").attr("height")
    var feature_name = d[0]
    var feature_contrib_name = d[0] + "_contribution"

    defualt_models.map(model => {
        var circ_data = []
        lime_data[model].map(item => {
            if (item['1-qid'] == selected_year && selected_instances.includes(parseInt(item['two_realRank']))) {
                item['id'] = item['State'].replace(/ /g, '').replace(/[^a-zA-Z ]/g, "") + model.replace(/ /g, '').replace(/[^a-zA-Z ]/g, "")
                circ_data.push(item)
            }
        })
        // Draw circle starts here
        /*
        var yScale = d3.scaleLinear().domain([d3.min(circ_data.map(item => parseFloat(item[d[0]]))), d3.max(circ_data.map(item => parseFloat(item[d[0]])))])
            .range([margin.item_top_margin, item_height - margin.item_bottom_margin])
        var xScale = d3.scaleLinear().domain([d3.min(circ_data.map(item => parseFloat(item[feature_contrib_name]))), d3.max(circ_data.map(item => parseFloat(item[feature_contrib_name])))])
            .range([margin.item_left_margin, item_width - margin.item_right_margin])
*/
        var margin = { top: 20, right: 30, bottom: 40, left: 90 },
            width = item_width - margin.left - margin.right,
            height = item_height - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg=selection.append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Parse the Data
        d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv", function (data) {
        
            // Add X axis
            var x = d3.scaleLinear()
                .domain([0, 13000])
                .range([0, width]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x))
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

            // Y axis
            var y = d3.scaleBand()
                .range([0, height])
                .domain(data.map(function (d) { return d.Country; }))
                .padding(.1);
          

            //Bars
            svg.selectAll("myRect")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", x(0))
                .attr("y", function (d) { return y(d.Country); })
                .attr("width", function (d) { return x(d.Value); })
                .attr("height", y.bandwidth())
                .attr("fill", "#69b3a2")


            // .attr("x", function(d) { return x(d.Country); })
            // .attr("y", function(d) { return y(d.Value); })
            // .attr("width", x.bandwidth())
            // .attr("height", function(d) { return height - y(d.Value); })
            // .attr("fill", "#69b3a2")

        })



    })

}