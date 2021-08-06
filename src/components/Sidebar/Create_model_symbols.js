import * as d3 from "d3";
import * as $ from "jquery";
export default function CreatexpChart(defualt_models, symbolTypes) {
    var parent_width = $(".symbols_container").width();
    var symbolGenerator = d3.symbol().size(80);
    d3.select(".symbols_container").selectAll("g").data(defualt_models,d=>d).join("g")
    .attr("transform",(d,i)=>"translate(10,"+25*i+")")
    .attr("add_text",function(model_name){
        d3.select(this).selectAll('text').data([model_name]).join("text").text(model_name).attr("dominant-baseline","hanging")
    })
    .attr("Add_symbol", function (model_name) {
        d3.select(this).selectAll("path").data([0]).join("path").attr("d", function () { symbolGenerator.type(d3[symbolTypes[model_name]]); return symbolGenerator(); })
          .attr("fill", "grey").attr("transform","translate(120,10)");
      })  
}