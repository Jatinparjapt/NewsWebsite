const express = require("express")
const route = express.Router();
const axios = require("axios")
const Authcation = require("../authication/auth")
const bcrypt = require("bcryptjs")
const NewsData = require("../mongoose/dataSchema")
const schema = require("../mongoose/schema")

// 1 .technology , business, entertainment , sport , india ,
    
route.get("/news", async (req ,res )=>{
    // const options = {
        // method: 'GET',
        // url: 'https://bing-news-search1.p.rapidapi.com/news',
        // params: {
        //     q: 'technology',
        //     count: '12',
        //     freshness: 'Day',
        //     textFormat: 'Raw',
        //     safeSearch: 'Off'
        //   },
        // headers: {
        //   'X-BingApis-SDK': 'true',
        //   'X-RapidAPI-Key': '9843848a02msh5b2a4156d1cfad6p1b0be4jsn59264fd09150',
        //   'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com'
        // }
    //   };
      
      
//       axios.request(options).then(function (response) {
//           console.log(response.data.news.news);
//       const getData = async ()=>{
//         const valu = response.data.value
//         for (let i=0;i<valu.length;i++){
//         const data = new NewsData ({
//             image : valu[i]["image"]["thumbnail"]["contentUrl"],
//             title:valu[i]["name"],
//             source : valu[i]["_type"],
//             description: valu[i]["description"],
//             link : valu[i]["url"]
//         })
//          const add =   await data.save() 
//          console.log(add , "add to database")    
//     }}
//      getData();
// }).catch(function (error) {
// 	console.error(error);
// });
      
    const data = await NewsData.find({});
    res.status(200).json({data});
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