import * as d3 from 'd3';
export function handle_transparency(class_name,active_ids){
    //console.log(active_ids)
    if(active_ids.length==0){d3.selectAll("."+class_name).attr('opacity',1)}
    else{
      d3.selectAll("."+class_name).attr('opacity',0.5)
      active_ids.map(id=>d3.selectAll("#"+id).attr('opacity',1)) 
    }
  }