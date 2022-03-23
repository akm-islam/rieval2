//------------------------------------------------------------------------------------------------- Sort Models
export function sort(type, state_range, default_models, selected_year, grouped_by_year_data) {
  console.log(type, state_range, default_models, selected_year, grouped_by_year_data,'sort')
  //------------Handle ndgc sorting
  if (type == 'Discounted Cumulative Gain') {
    var nDCG_dict = { "ndcg_term_CordAscent": 0, "ndcg_term_LambdaMART": 0, "ndcg_term_LambdaRank": 0, "ndcg_term_LinearReg": 0, "ndcg_term_ListNet": 0, "ndcg_term_MART": 0, "ndcg_term_RandomFor": 0, "ndcg_term_RankBoost": 0, "ndcg_term_RankNet": 0 }
    for (var i = state_range[0]; i < state_range[1]; i++) {
      Object.keys(nDCG_dict).forEach(key => {
          nDCG_dict[key] = nDCG_dict[key] + parseFloat(grouped_by_year_data[selected_year][i][key])
      })
    }
    //---- sort
    var items = Object.keys(nDCG_dict).map(function (key) {
      return [key.substring(10), nDCG_dict[key]];
    });
    items.sort(function (first, second) {
      return second[1] - first[1];
    });
    var temp_ndcg = []
    for (var i = 0; i < items.length; i++) {
      if (default_models.includes(items[i][0])) {
        temp_ndcg.push(items[i][0])
      }
    }
    var temp1={}
    items.map(myitem=>{temp1[myitem[0]]=myitem[1]})
    console.log(items)
    return [temp_ndcg,temp1]
  }
  //----

  //------------ Handle AP sorting
  if (type == 'Average Precision') {
    var mydict = {}
    default_models.forEach((model) => {
      var temp = 1
      for (var i = state_range[0]; i < state_range[1]; i++) {
        temp = temp + (grouped_by_year_data[selected_year][i]["two_realRank"] - grouped_by_year_data[selected_year][i][model]) ** 2
      }
      mydict[model] = ((state_range[1] - state_range[0]) + 1) / (Math.sqrt(temp))
    })
    //---- sort
    var items = Object.keys(mydict).map(function (key) {
      return [key, mydict[key]];
    });
    items.sort(function (first, second) {
      return second[1] - first[1];
    });
    var temp_ap = []
    for (var i = 0; i < items.length; i++) {
      if (default_models.includes(items[i][0])) {
        temp_ap.push(items[i][0])
      }
    }
    return [temp_ap,mydict]
  }
  //------------Handle Alphabatic sorting
  if (type == 'Alphabetically') {
    var temp=default_models.sort()
    return [temp,[0]]
  }
}
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
  //console.log(dataset, models, selected_instances, selected_year, number_of_charts, rank_data,"abc")
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
  console.log(temp_final,"temp_final")
  return temp_final;
}
export function sorted_features(dataset, model, selected_instances, selected_year,rank_data) { // Uses feature rank to rank and return features name by removing the feature_rank string
  //return Object.keys(rank_data[model][0]).filter(item=>!['1-qid','model'].includes(item)).map(item=>item.replace("_feature_rank", ""))
  if (!selected_instances.length > 0) { return [] }
  selected_instances = selected_instances.map(element => element -1)
  var tempvoted_data_with_score = {},items,data,features;
  if (model == "ListNet") { return [] }

  var filtered_rank_data = rank_data[model].filter(element => { if (parseInt(element['1-qid']) == parseInt(selected_year)) { return element } })
  data = selected_instances.map(index => filtered_rank_data[index])
  if(dataset=="rur"){
    selected_instances = selected_instances.map(element => element)
    data=filtered_rank_data.filter(item=>selected_instances.includes(parseInt(item['two_realRank'])))
  }
  features = Object.keys(data[0])
  
  var my_features_rank_col=features.filter(item=>item.includes("_feature_rank"))
  features=my_features_rank_col
  data.map(item => {
    features.forEach(feauture => {
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
  //console.log(data,selected_instances,filtered_rank_data,"items2")
  return items2;
  //-----------------------------------------------------------------
}
