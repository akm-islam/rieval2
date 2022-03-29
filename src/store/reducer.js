let initialState = {
   global_config:{max_circle_r:8},
   anim_config: {rank_animation:3000,deviation_animation:3000,feature_animation:3000,circle_animation:3000},
   appHandleChange: null,
   sparkline_data: null,
   sort_by: "Average Precision",
   original_data: null,
   rank_data: null,
   lime_data: null,
   grouped_by_year_data: null,
   slope_chart_ready_to_vis: null,
   default_models: ["MART","RandomFor"], // Change the pop_over_models as well
   state_range: [1, 30], // Change in handleradioChange
   deviate_by: 0,
   show: [
      "Slope charts", "Rankings", "Explanation" // change in app.js
   ],
   years_for_dropdown: [
      "2006"
   ],
   selected_year: 2011,
   slider_min: 1,
   slider_max: 50,
   view_data: 1,
   dataset: "fiscal", // change in componentDidmount in app.js too
   histogram_data: [],
   chart_scale_type: "true",
   features_with_score: null,
   ref_year: null,
   cmodel: "RandomFor",
   clicked_items_in_slopechart: [],
   tracking: false,
   dummy: null,
   features_dict: {},
   features_voted: null,
   Legend_ready_to_vis: null,
   legend_model: "RandomFor",
   legend_show_option: "Rank",
   legend_year: 2012,
   mode: "Model",
   range_mode_model: "RandomFor",
   range_mode_range1: [1, 25],
   range_mode_range2: [15, 40],
   time_mode_model: "RandomFor",
   time_mode_year1: "Null",
   time_mode_year2: "Null",
   time_mode_range: [6, 32],
   chart_scale_type: "true",
   slider_and_feature_value: { 'Rank range': 1, 'Feature': 1 },
   prev_prop: {},
   replay: false,
   changed: "year",
   popup_chart_data: null,
   pop_over: false,
   pop_over_models: ["MART","RandomFor"],
   clicked_features: [],
   drag_drop_feautre_data: {},
   dbclicked_features: [],
   default_model_scores: {},
   all_models: ["MART", "RandomFor", "LinearReg", "CordAscent", "LambdaMART", "LambdaRank", "RankBoost", "RankNet"],
   average_y: false,
   average_m: false,
   clicked_circles:[],
   threshold:10000,
   deviation_array:[], // This is for legend
   selected_instances:[], // This is for legend
   dragged_features:{},
   //url:"http://0.0.0.0:5000/test",
   url:"http://privacyprofiling.njitvis.com:5000/api/v2/rieval_mds",
}
//---InitialState ends here
const reducer = (state = initialState, action) => {
   if (action.type === "dragged_features") {
      //console.log('dragged_features',action.value)
      return { ...state, dragged_features: action.value }
   }
   if (action.type === "selected_instances") {
      return { ...state, selected_instances: action.value }
   }
   if (action.type === "deviation_array") {
      return { ...state, deviation_array: action.value }
   }
   if (action.type === "view_data") {
      return { ...state, view_data: action.value }
   }
   if (action.type === "threshold") {
      return { ...state, threshold: action.value }
   }
   if (action.type === "clicked_circles") {
      console.log(action.value)
      return { ...state, clicked_circles: action.value }
   }
   if (action.type === "average_y") {
      
      return { ...state, average_y: action.value }
   }
   if (action.type === "average_m") {
      
      return { ...state, average_m: action.value }
   }
   if (action.type === "default_model_scores") {
     
      return { ...state, default_model_scores: action.value }
   }
   if (action.type === "dbclicked_features") {
      return { ...state, dbclicked_features: action.value }
   }
   if (action.type === "drag_drop_feautre_data") {
      return { ...state, drag_drop_feautre_data: action.value }
   }
   if (action.type === "anim_config") {
      return { ...state, config: action.value }
   }
   if (action.type === "show") {
      return { ...state, show: action.value }
   }
   if (action.type === "lime_data") {
      return { ...state, lime_data: action.value }
   }
   if (action.type === "default_models") {
      return { ...state,pop_over_models:action.value, default_models: action.value }
   }
   if (action.type === "rank_data") {

      return { ...state, rank_data: action.value }
   }
   if (action.type === "original_data") {
      return { ...state, original_data: action.value }
   }
   if (action.type === "years_for_dropdown") {
      return { ...state, years_for_dropdown: action.value }
   }
   if (action.type === "appHandleChange") {
      return { ...state, appHandleChange: action.value }
   }
   if (action.type === "state_range") {
      return { ...state, dragged_features:{},state_range: action.value }
   }
   if (action.type === "selected_year") {
      return { ...state,dragged_features:{}, selected_year: action.value}
   }
   if (action.type === "tracking") {
      return { ...state, tracking: action.value }
   }
   if (action.type === "grouped_by_year_data") {
     
      return { ...state, grouped_by_year_data: action.value }
   }
   if (action.type === "sort_by") {
      return { ...state, sort_by: action.value }
   }
   if (action.type === "deviate_by") {
      return { ...state, deviate_by: action.value }
   }
   if (action.type === "mode") {
      if(action.value=='Model'){
         return { ...state,pop_over_models:state.default_models, mode: action.value }
      }
      if(action.value=='Ranges'){
         return { ...state,pop_over_models:[state.range_mode_model], mode: action.value }
      }
      else{
         return { ...state,pop_over_models:[state.time_mode_model], mode: action.value }
      }
   }
   if (action.type === "slider_max") {
      return { ...state, slider_max: action.value }
   }
   if (action.type === "range_mode_model") {
      return { ...state,pop_over_models:[action.value],range_mode_model: action.value }
   }
   //----
   if (action.type === "range_mode_range1") {
      console.log(action.value)
      return { ...state, range_mode_range1: action.value }
   }
   if (action.type === "range_mode_range2") {
      console.log(action.value)
      return { ...state, range_mode_range2: action.value }
   }
   if (action.type === "time_mode_range") {
      return { ...state, time_mode_range: action.value }
   }
   if (action.type === "time_mode_model") {
      return { ...state, pop_over_models:[action.value],time_mode_model: action.value }
   }
   if (action.type === "time_mode_year1") {
      return { ...state, time_mode_year1: action.value }
   }
   if (action.type === "time_mode_year2") {
      return { ...state, time_mode_year2: action.value }
   }
   if (action.type === "clicked_items_in_slopechart") {
      return { ...state, clicked_items_in_slopechart: action.value }
   }
   if (action.type === "features_with_score") {
      return { ...state, features_with_score: action.value }
   }
   if (action.type === "sparkline_data") {
      return { ...state, sparkline_data: action.value }
   }
   if (action.type === "legend_show_option") {
      return { ...state, legend_show_option: action.value }
   }
   if (action.type === "legend_model") {
      return { ...state, legend_model: action.value }
   }
   if (action.type === "histogram_data") {
      return { ...state,dragged_features:{}, histogram_data: action.value }
   }
   if (action.type === "dataset") {
      return { ...state, dataset: action.value }
   }
   if (action.type === "slider_and_feature_value") {
      return { ...state, slider_and_feature_value: action.value }
   }
   if (action.type === "legend_year") {
      return { ...state, legend_year: action.value }
   }
   if (action.type === "prev_prop") {
      return { ...state, prev_prop: action.value }
   }
   if (action.type === "replay") {
      return { ...state, replay: action.value }
   }
   if (action.type === "changed") {
      return { ...state, changed: action.value }
   }
   if (action.type === "popup_chart_data") {
      return { ...state, popup_chart_data: action.value }
   }
   if (action.type === "pop_over") {
      return { ...state, pop_over: action.value }
   }
   if (action.type === "pop_over_models") {
      var temp = action.value.filter(item => item != "ListNet")
      return { ...state, pop_over_models: temp }
   }
   if (action.type === "clicked_features") {
      return { ...state, clicked_features: action.value }
   }
   return state;
}
export default reducer;