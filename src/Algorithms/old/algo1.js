import * as d3 from 'd3';
import sport from "../Data/data/sport/lime/sport.json";
import school from "../Data/data/school/lime/school.json";
import fiscal from "../Data/data/fiscal/lime/fiscal.json";
import { range } from 'd3';

export function groupby_year(original_data){
  var years={}
  var sparkline_data={}
  original_data.forEach(element => {
    years[element['1-qid']]=[]
    sparkline_data[element['State'].replace(/ /g,'').replace(/[^\w\s]/gi, '')]=[]
  }); 

  original_data.forEach(element => {
    var temp_dict={year:parseInt(element['1-qid']),rank:parseInt(element['two_realRank'])}
    sparkline_data[element['State'].replace(/ /g,'').replace(/[^\w\s]/gi, '')].push(temp_dict)
    years[element['1-qid']].push(element)
  });
  return {years:years,sparkline_data:sparkline_data};
  }

  //data,this.state.state_range,this.state.default_models,this.state.selected_year,this.state.grouped_by_year_data
  export function sort(type,state_range,default_models,selected_year,grouped_by_year_data){
  //------------Handle ndgc sorting
    if(type=='Discounted Cumulative Gain'){
    var nDCG_dict={"ndcg_term_Cord.Ascent":0,"ndcg_term_LambdaMART":0,"ndcg_term_LambdaRank":0,"ndcg_term_LinearReg.":0,"ndcg_term_ListNet":0,"ndcg_term_MART":0,"ndcg_term_RandomFor":0,"ndcg_term_RankBoost":0,"ndcg_term_RankNet":0}
    for(var i=state_range[0];i<state_range[1];i++){
      Object.keys(nDCG_dict).forEach(key=>{
        nDCG_dict[key]=nDCG_dict[key]+parseFloat(grouped_by_year_data[selected_year][i][key])
      })  
    }


    //---- sort
    var items = Object.keys(nDCG_dict).map(function(key) {
      return [key.substring(10), nDCG_dict[key]];
    });
    items.sort(function(first, second) {
      return second[1] - first[1];
    });
    var temp_ndcg=[]
    for(var i=0;i<items.length;i++){
      if(default_models.includes(items[i][0])){
        temp_ndcg.push(items[i][0])
    }
    }
    return temp_ndcg
  }
//----

//------------Handle AP sorting
  if(type=='Average Precision'){
    var mydict={}

    default_models.forEach((model)=>{
      var temp=0
      for(var i=state_range[0];i<state_range[1];i++){
        temp=temp+(grouped_by_year_data[selected_year][i]["two_realRank"]-grouped_by_year_data[selected_year][i][model])**2
      }
      mydict[model]=((state_range[1]-state_range[0])+1)/(Math.sqrt(temp))  
    })
        //---- sort
        var items = Object.keys(mydict).map(function(key) {
          return [key, mydict[key]];
        });
        items.sort(function(first, second) {
          return second[1] - first[1];
        });
        var temp_ap=[]
        for(var i=0;i<items.length;i++){
          if(default_models.includes(items[i][0])){
            temp_ap.push(items[i][0])
        }
        }
    return temp_ap
  }
//------------Handle Alphabatic sorting
  if(type=='Alphabetically'){
    return default_models.sort()
  }
}
export function voted_dict(dataset,model,state_range,selected_year){
  if(!state_range.length>0){return []}
  state_range=state_range.map(element=>element-1)
  var tempvoted_data={};
  var items;
  var data;
  var feautures;
  if(dataset=="fiscal"){
    if(model=="ListNet"){return []}
    var data2=JSON.parse(fiscal[model]).filter(element=>{if(parseInt(element['1-qid'])==parseInt(selected_year)){return element}})
    data=state_range.map(index=>data2[index])
    feautures=Object.keys(data[0])
  }
  else if(dataset=="school"){
    if(model=="ListNet"){return []}
    var data2=JSON.parse(school[model]).filter(element=>{if(parseInt(element['1-qid'])==parseInt(selected_year)){return element}})
    data=state_range.map(index=>data2[index])    
    feautures=Object.keys(data[0])
  }
  else if(dataset=="sport"){
    var data2=JSON.parse(sport[model]).filter(element=>{if(parseInt(element['1-qid'])==parseInt(selected_year)){return element}})
    data=state_range.map(index=>data2[index])  
    feautures=Object.keys(data[0])
  }
  data.map(item=>{
    feautures.forEach(feauture=>{      
      if(tempvoted_data[feauture]>=0 ||tempvoted_data[feauture]<0){
        tempvoted_data[feauture]=tempvoted_data[feauture]+(parseFloat(item[feauture]))
      }
      else{tempvoted_data[feauture]=parseFloat(item[feauture])}
    })
  })
//-----------------------------------------------------------------
  // Create items array
  items = Object.keys(tempvoted_data).map(function(key) {
    return [key, tempvoted_data[key]];
  });
  // Sort the array based on the second element
  items.sort(function(first, second) {
    return first[1]-second[1];
  });
  var items2 = items.map((element)=>element[0].replace("_feature_rank",""))
  items2=items2.filter(item=>item!="1-qid")
  return items2;
//-----------------------------------------------------------------
}

export function voted_dict2(dataset,models,state_range,selected_year){
var temp1={}
var temp_final={}
  models.map(model => {
        var temp2={}
        var v=9;
        var top_nine=voted_dict(dataset,model,state_range,selected_year)
        for(var i=0;i<9;i++){
          temp2[top_nine[i]]=v;
          v=v-1
        }         
  temp1[model]=temp2
      });

  for(var key in temp1){
    for(var key2 in temp1[key]){
      if(temp_final[key2]>0){

        temp_final[key2]=temp_final[key2]+temp1[key][key2]
      }
      else{
        temp_final[key2]=temp1[key][key2]
      }
    }
  }
  return temp_final;
}

export function voted_dict3(dataset,models,state_range,selected_year,exp_plot_size){
var temp1={}
var temp_final={}
  models.map(model => {
        var temp2={}
        var v=exp_plot_size;
        var top_nine=voted_dict(dataset,model,state_range,selected_year)
        for(var i=0;i<exp_plot_size;i++){
          temp2[top_nine[i]]=v;
          v=v-1
        }
  temp1[model]=temp2
      });

  for(var key in temp1){
    for(var key2 in temp1[key]){
      if(temp_final[key2]>0){
        temp_final[key2]=temp_final[key2]+temp1[key][key2]
      }
      else{
        temp_final[key2]=temp1[key][key2]
      }
    }
  }
  return temp_final;
}