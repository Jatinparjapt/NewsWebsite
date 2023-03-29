const express = require("express");
const dotenv = require("dotenv")
const cors = require("cors")
dotenv.config();
const app = express();
app.use(cors())
app.use(express.json())
require("./mongoose/connection")
app.use(require("./Routes/route"))
const PORT = process.env.PORT || 5000;

app.listen(PORT , "127.0.0.1", ()=>{
    console.log(`Server Started on Port No. ${PORT}`);
})
