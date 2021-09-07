export default function createBins(data,number_of_bins){ // It doesn't incude x0 but includes x1
    var my_min=Math.min(...data)-1
    var my_max=Math.max(...data)
    var bins = [];
    var binCount = 0;
    var interval = parseInt((my_max-my_min)/number_of_bins)
    //Setup Bins
    for(var i = my_min; i < my_max; i += interval){
      bins.push({x0: i, x1: i + interval, count: 0,data:[],binNum: binCount})
      binCount++;
    }
    //Loop through data and add to bin's count
    for (var i = 0; i < data.length; i++){
      var item = data[i];
      for (var j = 0; j < bins.length; j++){
        var bin = bins[j];
        if(item > bin.x0 && item <= bin.x1){
          bin.count++;
          bin.data.push(item)
        }
      }  
    }
return bins    
}
//console.log(createBins([10, 20, 30, 40, 50],3));