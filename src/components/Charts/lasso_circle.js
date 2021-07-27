import * as d3 from 'd3';
import * as $ from 'jquery';
import * as d3lasso from 'd3-lasso';
import * as numeric from "numeric"
export default function Create_circles(parent_id, lime_data, defualt_models, selected_year, selected_instances, sorted_features, diverginColor, Set_clicked_circles) {
    // Create mds starts here
    var temp_lime_data_label = []
    var temp_lime_data_mds = []
    var limedata_all_models = []

    for (var i = 0; i < defualt_models.length; i++) { limedata_all_models = [...limedata_all_models, ...lime_data[defualt_models[i]]] }
    limedata_all_models.map(item => {
        var temp = []
        if (item['1-qid'] == selected_year && selected_instances.includes(parseInt(item['two_realRank']))) {
            temp_lime_data_label.push({ "model": item["model"], "State": item['State'], "1-qid": item['1-qid'], 'two_realRank': parseInt(item['two_realRank']) })
            sorted_features.map(feature_arr => temp.push(parseFloat(item[feature_arr[0]])))
            temp_lime_data_mds.push(temp)
        }
    })
    //----------------------------------------------------------------------
    var dist_matrix = []
    for (var i = 0; i < temp_lime_data_mds.length; i++) {
        var temp_arr = []
        for (var j = 0; j < temp_lime_data_mds.length; j++) {
            temp_arr.push(eucDistance(temp_lime_data_mds[i], temp_lime_data_mds[j]))
        }
        dist_matrix.push(temp_arr)
    }
    console.log(dist_matrix)
    var mds_data = mds_classic(dist_matrix)
    //---------------------------------------------------------------------------
    var circle_data = []
    temp_lime_data_label.map((item, index) => {
        item['x'] = mds_data[index][0]
        item['y'] = mds_data[index][1]
        item['id'] = parent_id + item['State'].replace(/\s/g, '') + item["model"].replace(/\s/g, '')
        circle_data.push(item)
    })
    // Create mds ends here
    var margin = { item_top_margin: 15, right: 14, bottom: 0, left: 20, circ_radius: 5, item_left_margin: 25, item_right_margin: 3 }
    var w = $("#mds").width() - margin.item_left_margin
    var h = $("#mds").height() - margin.item_top_margin * 2
    var r = 5;
    var xScale = d3.scaleLinear().domain(d3.extent(circle_data.map(item => item['x']))).range([r * 2, w - r * 2])
    var yScale = d3.scaleLinear().domain(d3.extent(circle_data.map(item => item['y']))).range([r * 2, h - r * 2])

    var svg = d3.select("#mds").style("border", "1px solid #bcbcbc")

    var circles = svg.selectAll("circle")
        .data(circle_data)
        .join("circle")
        .attr("cx", d => xScale(d['x']))
        .attr("cy", d => yScale(d['y']))
        .attr("r", r)
        .attr("fill", d => diverginColor(d["two_realRank"]))
        .attr('id', d => d['id'])
        .attr('class', 'circle2')
    // Lasso functions
    var lasso_start = function () {
        lasso.items()
            .attr("r", 5) // reset size
            .classed("not_possible", true)
            .classed("selected", false);
    };

    var lasso_draw = function () {
        // Style the possible dots
        lasso.possibleItems()
            .classed("not_possible", false)
            .classed("possible", true);

        // Style the not possible dot
        lasso.notPossibleItems()
            .classed("not_possible", true)
            .classed("possible", false);
    };

    var lasso_end = function () {
        var selected_ids = []
        lasso.selectedItems().each(function () {
            selected_ids.push(d3.select(this).attr("id"))
        })
        Set_clicked_circles(selected_ids)
        // Reset the color of all dots
        lasso.items()
            .classed("not_possible", false)
            .classed("possible", false);

        // Style the selected dots
        lasso.selectedItems()
            .classed("selected", true)
            .attr("r", 6);

        // Reset the style of the not selected dots
        lasso.notSelectedItems()
            .attr("r", 5);

    };
    var lasso = d3lasso.lasso()
        .closePathSelect(true)
        .closePathDistance(100)
        .items(circles)
        .targetArea(svg)
        .on("start", lasso_start)
        .on("draw", lasso_draw)
        .on("end", lasso_end);
    svg.call(lasso);
}
function mds_classic(distances, dimensions) {
    dimensions = dimensions || 2;
    // square distances
    var M = numeric.mul(-0.5, numeric.pow(distances, 2));
    // double centre the rows/columns
    function mean(A) { return numeric.div(numeric.add.apply(null, A), A.length); }
    var rowMeans = mean(M),
        colMeans = mean(numeric.transpose(M)),
        totalMean = mean(rowMeans);
    for (var i = 0; i < M.length; ++i) {
        for (var j = 0; j < M[0].length; ++j) {
            M[i][j] += totalMean - rowMeans[i] - colMeans[j];
        }
    }
    // take the SVD of the double centred matrix, and return the
    // points from it
    var ret = numeric.svd(M),
        eigenValues = numeric.sqrt(ret.S);
    return ret.U.map(function (row) {
        return numeric.mul(row, eigenValues).splice(0, dimensions);
    });

};
function eucDistance(a, b) {
    return a
        .map((x, i) => Math.abs(x - b[i]) ** 2) // square the difference
        .reduce((sum, now) => sum + now) // sum
        ** (1 / 2)
}

