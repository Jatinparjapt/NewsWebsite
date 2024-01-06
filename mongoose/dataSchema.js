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
const New_News_Data = new mongoose.model(`all_news_data`,Data)
module.exports = New_News_Data


