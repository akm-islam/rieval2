import * as d3 from 'd3';
export default function Create_sparkline(parent, config, y_distance, sparkline_data, d, diverginColor, selected_year, Set_selected_year) { // sparkline height is y_distance
    var year = selected_year
    var s_margin = { top: 0, right: 0, bottom: 0, left: 4 },
        s_width = config.sparkline_width - 2,
        s_height = y_distance - 2;
    var s_svg = parent.selectAll(".sparkline_svg").data([0]).join("svg").attr("class", "sparkline_svg").attr("x", 2).attr("y", -3)
        .attr("width", s_width + s_margin.left + s_margin.right)
        .attr("height", s_height + s_margin.top + s_margin.bottom)
    
    var data = sparkline_data[d['State'].replace(/ /g, '').replace(/[^a-zA-Z ]/g, "")]
    // Add X axis  
    var x = d3.scaleLinear().domain(d3.extent(data, function (d) { return d.year; })).range([0, s_width]);
    //-----------------------------------------------------------------------------------------------------------------------------------------Add the area
    s_svg.selectAll("path").remove()
    s_svg.append("path")
        .datum(data, d => d)
        .attr("id", "A")
        .attr("opacity", 1)
        .attr("fill", diverginColor(d['two_realRank'])) //#969696
        .attr("stroke", diverginColor(d['two_realRank']))
        .attr("stroke-width", (d) => {
            return 1.5
        })
        .attr("d", d3.area()
            .x(function (d) { return x(d.year) })
            .y0(function () {
                var y = d3.scaleLinear().domain([0, d3.max(data, function (d) { return +d.rank; })]).range([s_height, 0]);
                return y(0)
            })
            .y1(function (d) {
                var y = d3.scaleLinear().domain([0, d3.max(data, function (d) { return +d.rank; })]).range([0, s_height]);
                return y(d.rank)
            })
        )
    //------------Circles
    s_svg.selectAll('circle').raise().data(data).join('circle')
        .attr('cx', function (d, i) { return x(d.year) })
        .attr('cy', s_height - 2)
        .attr("class", "myid")
        .on("mouseover", function (d) {
            d3.select(this).style('fill', 'black')
            d3.select(this).attr('r', 3)
        })
        .style('fill', (d) => d.year != year ? 'transparent' : 'black')
        .attr('class', (d) => d.year != year ? 'transparent_class' : 'red_class')
        .attr('r', 2)
        .on('dblclick', (d, i) => {
            d3.event.preventDefault();
            Set_selected_year(d.year)
        })
        .on("mouseout", function (d) {
            d3.select(this).style('fill', 'transparent')
            d3.select(this).style('fill', d.year != year ? 'transparent' : 'black')
            d3.select(this).attr('r', 2)
        })
}