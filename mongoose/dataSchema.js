const mongoose = require("mongoose")
const Data = new mongoose.Schema({       
        id:{
            type :String,
            require : true,
        },
        image:{
            type:String,
            require : true,
        },
        title:{
            type:String,
            require : true,
        },
        description:{
            type:String,
            require : true,
        },
        source:{
            type:String,
            require : true,
        },
        link:{
            type:String,
            require : true,
        }
})
// const date = new Date()
//   const timeInHours = date.getHours()
//   let topSearch;
  //  if(timeInHours<=10){
  //   topSearch = "Technology_News_Data"
  // }
  // else if(timeInHours <= 14){
  //   topSearch = "Business_News_Data"
  // }
  // else if(timeInHours<=17){
  //   topSearch = "Entertainment_News_Data"
  // }
  // else if(timeInHours<=22){
  //   topSearch = "Sports_News_Data"
  // }
  // else if(timeInHours <= 23){
  //   topSearch = "India_News_Data"
  // }
const New_News_Data = new mongoose.model(`all_news_data`,Data)
module.exports = New_News_Data


