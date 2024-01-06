const express = require("express");
const dotenv = require("dotenv")
const cors = require("cors")
const PORT = process.env.PORT || 5000;
dotenv.config();
const app = express();
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
require("./mongoose/connection")

app.use(require("./Routes/route"))

app.listen(PORT , ()=>{
    console.log(`Server Started on Port No. ${PORT}`);
})
