const express = require("express")
const route = express.Router();
const axios = require("axios")
const bcrypt = require("bcryptjs")
const NewsData = require("../mongoose/dataSchema")
const schema = require("../mongoose/schema")
require("../mongoose/connection")
route.get("/", async (req ,res )=>{
    res.send("home page ")
    // const data = await NewsData.find({});
    // res.json({data})
    // async function getData(){
    //     const options = {
    //         method: 'GET',
    //         url: 'https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/search/NewsSearchAPI',
    //         params: {
    //           q: 'business',
    //           pageNumber: '1',
    //           pageSize: '50',
    //           autoCorrect: 'true',
    //           fromPublishedDate: 'null',
    //           toPublishedDate: 'null'
    //         },
    //         headers: {
    //           'X-RapidAPI-Key': '89408d746emsh8b8da6d3c6323e3p1f4addjsn7ec08c5a56c7',
    //           'X-RapidAPI-Host': 'contextualwebsearch-websearch-v1.p.rapidapi.com'
    //         }
    //       };
    //       axios.request(options).then(function (response) {
    //         const valu = response.data.value
    //         // console.log(valu.id)
    //         for (let i=0;i<valu.length;i++){
    //             console.log(valu[i]["id"])
    //         const data = new NewsData ({
    //             id:valu[i]["id"],
    //             image : valu[i]["image"]["url"],
    //             title:valu[i]["title"],
    //             body : valu[i]["body"],
    //             description: valu[i]["description"],
    //             url : valu[i]["url"]
    //         })
    //         data.save().then(()=>{console
    //         .log("dataSaved")}).catch((error)=>{console.log(error)})
    //     }
    //         // for (let i=0; i<value.length;i++){
    //         //     console.log(value.id)
    //         // }
    //       }).catch(function (error) {
    //         console.error(error);
    //       });
    // }
//     getData()
//     res.send("data is here")
})
route.post("/singup", async (req ,res )=>{
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return res.json({
            error : "please fill all the fields"
        })
    }
    try {
        const userExist = await schema.findOne({email:email});
        if(userExist){
            res.status(422).json({error : "User exist"})
        }
        // console.log("User exist",userExist)
        // window.alert("Already Exist");
        // window.location.href = "/login"
        const user = new schema({name ,email , password})
        const userR = await user.save();
        if(userR){
          return res.status(201).json({Message : "User Created Successfully"})
        }
    } catch (err) {
        console.log(err)
    }
})
route.post("/sigin" , async (req,res)=>{
    try{
    const {email, password} = req.body;
    if(!email || !password){
        return res.send({
            error : "please fill all the fields"
        })
    }
    const userExist = await schema.findOne({email:email});
    const token = await userExist.generateAuthToken();
    res.cookie("jwtoken", token ,{
        expires : new Date (Date.now() + 1000000000),
        httpOnly: true
    })
    //after some time we will save token in cookies throug ui
    if(userExist){
        const match =  await bcrypt.compare(password , userExist.password  ) 
    if(match){
        return res.status(200).send({
            message : "Successfully Login"
        })
    }else{
        res.status(402).send("Invaild detail PASS")

    }}else{
        res.status(404).send("Invaild details")
    }
}catch(err){
 console.log(err)
}
})
route.get("/logout", (req,res)=>{
    res.clearCookie("jwtoken")
    res.send("Logout")
  }
  )
module.exports = route