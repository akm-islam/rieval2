export function groupby_year(original_data) {
  var years = {}
  var sparkline_data = {}
  original_data.forEach(element => {
    years[element['1-qid']] = []
    sparkline_data[element['State'].replace(/ /g, '').replace(/[^\w\s]/gi, '')] = []
  });

  original_data.forEach(element => {
    var temp_dict = { year: parseInt(element['1-qid']), rank: parseInt(element['two_realRank']) }
    sparkline_data[element['State'].replace(/ /g, '').replace(/[^\w\s]/gi, '')].push(temp_dict)
    years[element['1-qid']].push(element)
  });
  return { years: years, sparkline_data: sparkline_data };
}
export function features_with_score(dataset, models, selected_instances, selected_year, number_of_charts, rank_data) {
  var temp1 = {}
  var temp_final = {}
  models.map(model => {
    var temp2 = {}
    var v = number_of_charts;
    var top_nine = sorted_features(dataset, model, selected_instances, selected_year,rank_data)
    if (top_nine.length < number_of_charts) { v = top_nine.length;; number_of_charts = top_nine.length } // This is because number of charts is calculated based on space but there are cases when we don't have that many features
    for (var i = 0; i < number_of_charts; i++) {
      temp2[top_nine[i]] = v;
      v = v - 1
    }
    temp1[model] = temp2
  });

  for (var key in temp1) {
    for (var key2 in temp1[key]) {
      if (temp_final[key2] > 0) {

        temp_final[key2] = temp_final[key2] + temp1[key][key2]
      }
      else {
        temp_final[key2] = temp1[key][key2]
      }
    }
  }
  return temp_final;
}


export function sorted_features(dataset, model, selected_instances, selected_year,rank_data) { // Uses feature rank to rank and return features name by removing the feature_rank string
 //return Object.keys(rank_data[model][0]).filter(item=>!['1-qid','model'].includes(item)).map(item=>item.replace("_feature_rank", ""))
  if (!selected_instances.length > 0) { return [] }
  selected_instances = selected_instances.map(element => element - 1)
  var tempvoted_data_with_score = {},items,data,feautures;

  if (model == "ListNet") { return [] }
  //console.log('algo1',selected_year)
  console.log('algo1',selected_year,rank_data[model][0])
  var data2 = rank_data[model].filter(element => { if (parseInt(element['1-qid']) == parseInt(selected_year)) { return element } })
  data = selected_instances.map(index => data2[index])
  feautures = Object.keys(data[0])
  data.map(item => {
    feautures.forEach(feauture => {
      if (tempvoted_data_with_score[feauture] >= 0 || tempvoted_data_with_score[feauture] < 0) {
        tempvoted_data_with_score[feauture] = tempvoted_data_with_score[feauture] + (parseFloat(item[feauture]))
      }
      else { tempvoted_data_with_score[feauture] = parseFloat(item[feauture]) }
    })
  })
  //-----------------------------------------------------------------
  // Create items array
  items = Object.keys(tempvoted_data_with_score).map(function (key) {
    return [key, tempvoted_data_with_score[key]];
  });
  // Sort the array based on the second element
  items.sort(function (first, second) {
    return first[1] - second[1];
  });
  var items2 = items.map((element) => element[0].replace("_feature_rank", ""))
  items2 = items2.filter(item => item != "1-qid" && item!="model")
  return items2;
  //-----------------------------------------------------------------
}
