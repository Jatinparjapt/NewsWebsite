const express = require("express")
const route = express.Router();
const axios = require("axios")
const mongodb = require("mongoose")
const Authcation = require("../authication/auth")
const bcrypt = require("bcryptjs")
const NewsData = require("../mongoose/dataSchema")
const schema = require("../mongoose/schema")
require("../mongoose/connection")
let topSearch
const date = new Date()
  const timeInHours = date.getHours()
  if(timeInHours===0 ||timeInHours <=10 ){
    topSearch = "technology"
  }
  else if(timeInHours===10 || timeInHours <= 14){
    topSearch = "business"
  }
  else if(timeInHours===14 || timeInHours<=17){
    topSearch = "entertainment"
  }
  else if(timeInHours===17 || timeInHours<=22){
    topSearch = "sports"
  }
  else if(timeInHours===22 || timeInHours <= 23){
    topSearch = "india"
  }
    const getData = async ()=>{
      const options = {
        method: 'GET',
        url: 'https://api.newscatcherapi.com/v2/search',
        params: {q: `${topSearch}`, lang: 'en', sort_by: 'relevancy', page: '50'},
        headers: {
          'x-api-key': '1BlH9t_DVlQm8jsEqeKLqN_C-88KguzREBWxlS4hAqU'
        }
      };
          const response = await axios.get(options)
            const valu = response.data.value
            for (let i=0;i<valu.length;i++){
                console.log(valu[i]["id"])
            const data = new NewsData ({
                id:valu[i]["_id"],
                media : valu[i]["media"],
                title:valu[i]["title"],
                excerpt : valu[i]["excerpt"],
                summary: valu[i]["summary"],
                link : valu[i]["link"]
            })
            const date = new Date()
            const timeInHours = date.getHours()
            const timeInMinutes = date.getMinutes() 
            if(timeInHours=== 0 &&timeInMinutes === 0  ){
                 getData()
                 await data.save()
            }
             else if(timeInHours === 10 && timeInMinutes === 0  ){
              getData()  
                 await data.save()
            }
            else if(timeInHours ===14 &&timeInMinutes === 0  ){
              getData()
                 await data.save()
            }
            else if(timeInHours=== 17  &&timeInMinutes === 0 ){
              getData()
                 await data.save()
            }
            else if(timeInHours === 22 &&timeInMinutes === 0 ){
              getData()
                 await data.save()
            }
        }}
    
route.get("/news", async (req ,res )=>{
    const data = await NewsData.find({});
    res.json({data})
})
route.post("/singup", async (req ,res )=>{
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return res.status(401).json({
            error : "please fill all the fields"
        }) }
    try {
        const userExist = await schema.findOne({email:email});
        if(userExist){
            res.status(422).json({error : "User exist"})
        }
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
route.post("/hireme", Authcation , async (req, res) => {
    const {name ,email ,message} = req.body;
    if(!name || !email || !message){
        res.status(401).send({"Error" : "fill some data to send message"})
    }
    const userContect = await singup.findOne({_id :req.userId})
    if(userContect){
        const userMeassage = await userContect.addMessage(name ,email , message);
        await userContect.save();
        res.status(201).send ({response : "Data send successfully"})
    }
    else{
        res.status(404).send({Error: "no data found"})
    }
  });
route.get("/logout", (req,res)=>{
    res.clearCookie("jwtoken")
    res.send("Logout")
  }
  )
module.exports = route