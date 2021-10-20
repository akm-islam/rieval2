import { width } from '@mui/system';
import * as d3 from 'd3';
import SimpleLinearRegression from 'ml-regression-simple-linear';
var CreateNumChart = (data, feature, scatterplot_data, props) => {
    var rScale = d3.scalePow().exponent(0.2).domain(d3.extent(props.deviation_array)).range([8, 1])
    var feature_contribute = feature + "_contribution"
    var scatterplot_data = scatterplot_data.map(data_arr => {
        var temp = data_arr[1].filter(item => item['deviation'] < props.threshold && parseFloat(item[feature_contribute]) > 0)
        return [data_arr[0], temp]
    })
    // set the dimensions and margins of the graph
    var margin = { top: 0, right: 30, bottom: 45, left: 50, space_for_hist: 50 },
        feature_width = 520 - margin.left - margin.right,
        height = 250 - margin.top - margin.bottom;
    
    data = data.filter(d => parseFloat(d[feature_contribute]) > 0)
    
    var data_for_x_axis = data.map(item => parseFloat(item[feature])),
        data_for_y_axis = data.map(item => parseFloat(item[feature_contribute]))
    
    var xScale = d3.scaleLinear().domain([d3.min(data_for_x_axis), d3.max(data_for_x_axis)]).range([0, feature_width]).nice(),
        yScale = d3.scaleLinear().domain([d3.min(data_for_y_axis), d3.max(data_for_y_axis)]).range([height, 0]).nice(); // circles will start from y position 10 and go upto height-10
    //-------------------------------------------------------------All svgs
    var parent_svg = d3.select("#" + props.myid).attr("width", feature_width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom + margin.space_for_hist),
        svg1 = parent_svg.selectAll('.svg11').data([0]).join('svg').attr("y", margin.space_for_hist).attr("class", "svg11").selectAll(".myg").data([0]).join('g').attr("class", "myg").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    
    //------------------------------------------------------------------------------------------------------Create the areaChart starts here
    var histogram = d3.histogram().value(d => d).domain(xScale.domain())
    //.thresholds(xScale.ticks(5))
    var bins = histogram(data_for_x_axis)
    var svg0 = parent_svg.selectAll('.svg0').data([0]).join('svg').attr("class", "svg0").selectAll(".myg0").data([0]).join('g').attr("class", "myg0").attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    svg0.selectAll(".myline").data([0]).join('line').attr("class", "myline").attr("x1", 0).attr("y1", margin.space_for_hist).attr("x2", feature_width).attr("y2", margin.space_for_hist).attr("stroke", "#EBEBEB") // // Add line on the bottom of the histogram

    var histogram = d3.histogram().value(d => d).domain(xScale.domain())
    //.thresholds(xScale.ticks(25))
    var binned_data = histogram(data_for_x_axis)
    
    var area_chart_data = []
    binned_data.map((item, i) => area_chart_data.push([item.x0, item.length]))
    var xScale = d3.scaleLinear().domain(d3.extent(area_chart_data.map(item => item[0]))).range([0, feature_width + 1])
    var yScale = d3.scaleLinear().domain([0, d3.max(area_chart_data.map(item => item[1]))]).range([margin.space_for_hist, 0])
    const areaGenerator = d3.area().curve(d3.curveMonotoneX).x(d => xScale(d[0])).y0(yScale(0)).y1(d => yScale(d[1]))

    svg0.append("path").attr('transform', 'translate(0,' + margin.top + ')')
        .attr("d", areaGenerator(area_chart_data))
        .style("fill", "gray");
    //------------------------------------------------------------------------------------------------------ Create the areaChart ends here
    var svg1 = parent_svg.selectAll('.svg11').data([0]).join('svg').attr("class", "svg11").selectAll(".myg").data([0]).join('g').attr("class", "myg").attr("transform",
        "translate(" + margin.left + "," + margin.top + ")")
    svg1.selectAll(".myline2").data([0]).join('line').attr("class", "myline2").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", height).attr("stroke", "#EBEBEB");
    svg1.selectAll(".myline3").data([0]).join('line').attr("class", "myline3").attr("x1", 0).attr("y1", height).attr("x2", feature_width).attr("y2", height).attr("stroke", "#EBEBEB");

    //------------- Add X axis
    if (d3.max(d3.max(bins)) > 1000) {
        svg1.selectAll(".myXaxis").data([0]).join('g').attr("class", "myXaxis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale).tickSize(-height * 1.3).tickValues(bins.map(item => item['x1'])).tickFormat(d3.format(".2s")))
            .select(".domain").remove()
    }
    else {
        svg1.selectAll(".myXaxis").data([0]).join('g').attr("class", "myXaxis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale).tickSize(-height * 1.3).tickValues(bins.map(item => item['x1'])))
            .select(".domain").remove()
    }
    svg1.selectAll(".tick line").attr("stroke", "#EBEBEB")

    //------------------------------------------------------------------------------------------------------ Scatterplot starts here
    svg1.selectAll(".scatterplot_g").data(scatterplot_data).join('g').attr("id", d => d[0] + "scatterplot_g_id").attr("class", "scatterplot_g").attr("ax", function (d) {
        var data_for_x_axis2 = d[1].map(item => parseFloat(item[feature]))
        var data_for_y_axis2 = d[1].map(item => parseFloat(item[feature_contribute]))

        var xScale2 = d3.scaleLinear().domain([d3.min(data_for_x_axis2), d3.max(data_for_x_axis2)]).range([0, feature_width]).nice() // This scaling is for individual model
        var yScale2 = d3.scaleLinear().domain([d3.min(data_for_y_axis2), d3.max(data_for_y_axis2)]).range([height, 0]).nice(); // This scaling is for individual model
        d3.select(this).selectAll('circle').data(d[1])
            .join("circle")
            .attr("cx", (d, i) => xScale2(d[feature]))
            .attr("cy", (d, i) => {
                if (yScale2(parseFloat(d[feature_contribute])) < 10) {
                    return 10;
                }
                else if (yScale2(parseFloat(d[feature_contribute])) > (height - 10)) {
                    return height - 10;
                }
                return yScale2(parseFloat(d[feature_contribute])) - 0

            })
            .attr("actual_Y_value", d => d[feature_contribute] + " : x value : " + d[feature])
            //.attr("r", 4)
            .attr("r", d => parseFloat(d[feature_contribute]) <= 0 ? 0 : rScale(d['deviation']))
            .attr("fill", (d) => {
                return props.diverginColor(d['two_realRank']).replace(")",",.6)")
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
    //------------------------------------------------------------------------------------------------------ Regression Line
    var xScale3 = d3.scaleLinear().domain([d3.min(data_for_x_axis), d3.max(data_for_x_axis)]).range([0, feature_width]).nice() // This scaling is only for regression line
    var yScale3 = d3.scaleLinear().domain([d3.min(data_for_y_axis), d3.max(data_for_y_axis)]).range([height, 0]).nice();
    const regression = new SimpleLinearRegression(data_for_x_axis, data_for_y_axis);
    var predicted_data = data_for_x_axis.map(item => [item, regression.predict(item)])
    predicted_data=predicted_data.filter(item=>yScale3(item[1])<height)
    var lineGenerator = d3.line().x(d => xScale3(d[0])).y(d => yScale3(d[1]))
    var pathData = lineGenerator(predicted_data)
    console.log(data_for_x_axis,"data_for_x_axis",predicted_data,pathData)
    svg1.selectAll('.regression_path').data([0]).join('path').attr('class','regression_path').attr('d', pathData).attr('stroke', 'rgb(188, 188, 188,0.5)').attr('stroke-width',3);
}
export default CreateNumChart