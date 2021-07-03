import * as d3 from 'd3';
import * as $ from 'jquery';
import * as histAlgo from "../Algorithms/histAlgo";

export function get_feature_voting(dataset, year) {
var model_name = "CordAscent";
var array1 = histAlgo.featureGen2(dataset,model_name,year,5,35);
return array1;
}
