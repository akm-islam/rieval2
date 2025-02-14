/* eslint-disable no-useless-concat, eqeqeq, array-callback-return, no-redeclare */
import * as d3 from 'd3';
var CreateCatChart = (data, feature, scatterplot_data,props) => {
    var rScale = d3.scalePow().exponent(0.4).domain(d3.extent(props.deviation_array)).range([6, 1])
    var feature_contribute = feature + "_contribution"
    var margin = { top: 0, right: 30, bottom: 85, left: 50, space_for_hist: 0 }, feature_width = 520 - margin.left - margin.right, height = 270 - margin.top - margin.bottom;
    var barplot_data = {}
    data = data.filter(d => parseFloat(d[feature_contribute]) > 0)
    data.map(item => { if (barplot_data[item[feature]] > 0) { barplot_data[item[feature]] += 1 } else { barplot_data[item[feature]] = 1 } })

    var temp_y = Object.keys(barplot_data),
        temp_x = Object.values(barplot_data),
        x = d3.scaleLinear().domain([d3.min(temp_x), d3.max(temp_x)]).range([0, feature_width]).nice(); // circles will start from y position 10 and go upto height-10

    var y = d3.scaleBand().domain(temp_y).range([0, height]).padding(0.1);

    // add the x Axis
    //------------------------------------------------------------- All svgs
    var parent_svg = d3.select("#" + props.myid).attr("width", feature_width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom + margin.space_for_hist),
        svg1 = parent_svg.selectAll('.svg11').data([0]).join('svg').attr("y", margin.space_for_hist).attr("class", "svg11").selectAll(".myg").data([0]).join('g').attr("class", "myg").attr("transform","translate(" + margin.left + "," + margin.top + ")")
    var svg1 = parent_svg.selectAll('.svg11').data([0]).join('svg').attr("class", "svg11").selectAll(".myg").data([0]).join('g').attr("class", "myg").attr("transform","translate(" + margin.left + "," + margin.top + ")")   
    //------------- Add Y axis
    svg1.selectAll(".myYaxis").data([0]).join('g').attr("class", "myYaxis").attr("transform", "translate("+(feature_width+20)+",20)").call(d3.axisLeft(y).tickSize(feature_width)).selectAll("text").selectAll(".tick line").remove()        
    svg1.selectAll(".domain").remove()
    svg1.selectAll(".tick line").attr("stroke", "#EBEBEB")
    //------------------------------------------------------------------------------------------------------ Scatterplot starts here
    svg1.selectAll(".scatterplot_g").data(scatterplot_data).join('g').attr("id", d => d[0] + "scatterplot_g_id").attr("class", "scatterplot_g").attr("ax", function (d) {
        var temp_x = d[1].map(item => parseFloat(item[feature + "_contribution"])) // d[1] 
        x = d3.scaleLinear().domain([d3.min(temp_x), d3.max(temp_x)]).range([0, feature_width]).nice();
        var circle_data=d[1].sort((a,b)=>a['deviation']-b['deviation'])
        d3.select(this).selectAll('circle').data(circle_data)
            .join("circle")
            .attr("cy", (d, i) => {
                return y(d[feature])+35
            })
            .attr("cx", (d, i) => {
                return x(parseFloat(d[feature_contribute]))

            })
            
            .attr("r", d => parseFloat(d[feature_contribute]) <= 0 ? 0 : rScale(d['deviation']))
            .attr("fill", (d) => {
                return props.diverginColor(d['two_realRank']).replace(")",",.7)")
            })

            .attr('class', d => 'my_circles')
            .attr("id", d => d['id'])
            .on('click', d => {
                props.Set_clicked_circles(props.clicked_circles.includes(d['id']) ? props.clicked_circles.filter(item => item != d['id']) : [...props.clicked_circles, d['id']])
            })
    })
  //---------------------------------------------Feature Importance with Arrow
  var ft_svg_height = 25
  parent_svg.selectAll(".ft_svg").remove()
  var ft_svg = parent_svg.selectAll(".ft_svg").data([Math.random()]).join("svg").attr("x", 70).attr("y", height+10).attr("class", "ft_svg").attr("width", feature_width).attr("height", ft_svg_height)
  var markerBoxWidth = 8, markerBoxHeight = 8, refX = markerBoxWidth / 2, refY = markerBoxHeight / 2
  
  ft_svg.selectAll('defs').data([0]).join('defs').selectAll('#arrow').data([0]).join('marker').attr('id', 'arrow').attr('viewBox', [0, 0, markerBoxWidth, markerBoxHeight])
    .attr('refX', refX).attr('refY', refY).attr('markerWidth', markerBoxWidth).attr('markerHeight', markerBoxHeight).attr('orient', 'auto-start-reverse')
    .append('path').attr('id','path1').attr('d', d3.line()([[0, 0], [0, 7], [7, 3.8]])).attr('stroke', '#777777').attr("fill","#777777");
  //------------------------------------------------[[x2, y2], [x1, y1]]
  ft_svg.append('path').attr('d', d3.line()([[feature_width / 2 - 65, 15], [50, 15]])).attr('stroke', '#777777').attr('marker-end', 'url(#arrow)').attr('fill', 'none');
  ft_svg.append('path').attr('d', d3.line()([[feature_width - 50, 15], [65 + feature_width / 2, 15]])).attr('stroke', '#777777').attr('marker-start', 'url(#arrow)').attr('fill', 'none');

  ft_svg.selectAll(".myText_low").data([0]).join("text").attr("x", 30).attr("class", "myText_low").attr('dominant-baseline', "middle").attr("y", 15).text('Low').attr('text-anchor', 'middle').attr("font-size", 12).attr("fill", "#2b2828")
  ft_svg.selectAll(".myText").data([0]).join("text").attr("x", feature_width / 2).attr("class", "myText").attr('dominant-baseline', "middle").attr("y", 15).text('Attribute Importance').attr('text-anchor', 'middle').attr("font-size", 12).attr("fill", "#2b2828")
  ft_svg.selectAll(".myText_high").data([0]).join("text").attr("x", feature_width-30).attr("class", "myText_high").attr('dominant-baseline', "middle").attr("y", 15).text('High').attr('text-anchor', 'middle').attr("font-size", 12).attr("fill", "#2b2828")
  //---------------------------------------------Feature Importance with Arrow



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