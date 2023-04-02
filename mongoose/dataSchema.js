const mongoose = require("mongoose")
const Data = new mongoose.Schema({       
        id:{
            type :Number,
            require : true,
        },
        media:{
            type:String,
            require : true,
        },
        title:{
            type:String,
        },
        summary:{
            type:String
        },
        excerpt:{
            type:String
        },
        link:{
            type:String
        }
})
const date = new Date()
  const timeInHours = date.getHours()
  let topSearch;
   if(timeInHours<=10){
    topSearch = "Technology_News_Data"
  }
  else if(timeInHours <= 14){
    topSearch = "Business_News_Data"
  }
  else if(timeInHours<=17){
    topSearch = "Entertainment_News_Data"
  }
  else if(timeInHours<=22){
    topSearch = "Sports_News_Data"
  }
  else if(timeInHours <= 23){
    topSearch = "India_News_Data"
  }
const New_News_Data = new mongoose.model(`${topSearch}`,Data)
module.exports = New_News_Data


