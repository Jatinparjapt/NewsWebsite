const mongoose = require("mongoose")
const Data = new mongoose.Schema({
    
       
        id:{
            type :Number,
            require : true,
        },
        image:{
            type:String,
            require : true,
        },
        title:{
            type:String,
        },
        body:{
            type:String
        },
        description:{
            type:String
        },
        url:{
            type:String
        }
})
const New_News_Data = new mongoose.model("Business_News_Data",Data)
module.exports = New_News_Data
