const mongoose = require("mongoose");
const db = process.env.DATABASE
mongoose.connect(db , {
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{console.log("Connection to mongoDB is Success !")}).catch((error)=>{console
.log(error)})  