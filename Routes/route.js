const express = require("express")
const route = express.Router();
const axios = require("axios")
const Authcation = require("../authication/auth")
const bcrypt = require("bcryptjs")
const questionSchema = require("../mongoose/questionSchema")
const NewsData = require("../mongoose/dataSchema")
const schema = require("../mongoose/schema")
const Razorpay = require("razorpay")
// 1 .technology , business, entertainment , sport , india ,
route.get("/api/getQuestions" , async (req ,res )=>{
    try {
        const users = await questionSchema.find()
        res.status(200).json({ data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal error occurred" });
    }
} ) 
route.post("/api/addQuestions", async (req ,res )=>{
    try {
       
      
        const {questionType ,category ,description, question,option1,option2,option3} = req.body
        if(!questionType|| !category|| !description ||!question || !option1 || !option2 || !option3 ){
            res.status(404).json({ error: 'Please enter all required data' })
        }else{
          
            const newData = new questionSchema({
                questionType,
                category,
                description,
                question,
                option1:{data: option1.data,checked : option1.checked},
                option2 :{data: option2.data,checked : option2.checked},
                option3 :{data: option3.data,checked : option3.checked},
                
            })
            await newData.save();
            res.status(201).json({"created" : "Data created successfully"})
            console.log(newData)
        
        }
    } catch (error) {
        console.log(error)
        res.status(500).json("Failed to create data")
    }

})
route.delete("/api/deleteQuestion " , async (req ,res )=>{
    console.log(req.body.id)
    try {
        if(req.body.id){
            await questionSchema.findOneAndDelete({_id:req.body.id})
            res.status(200).json({ data: "One Question Deleted" });   
        }else{
            res.status(404).json({ error: "Data not found to delete" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal error occurred" });
      }
}) 
route.get("/" , async (req ,res )=>{
    try {
        
         
            res.status(200).json({ data: "home pages " });
          
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal error occurred" });
      }
}) 
route.put("/api/updateQuestion:id " , async (req ,res )=>{
    console.log(req.body.question , req.params.id , "from put method")
    try {
              if (!req.body.question && !req.params.id) {
                    res.status(404).json({ error: "Data not found to update" });
                  } else {
                        console.log(req.body.data.question,req.body.data.id, "database");
                        const data = await questionSchema.findOneAndUpdate(
                              { _id: req.params.id },
              { question: req.body.question }
            );
    res.status(201).json({ data: "One Question update" });
          }
        } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal error occurred" });
      }
}) 
route.get("/news", async (req ,res )=>{
//     const options = {
//         method: 'GET',
//         url: 'https://bing-news-search1.p.rapidapi.com/news',
//         params: {
//             q: 'india',
//             count: '12',
//             freshness: 'Day',
//             textFormat: 'Raw',
//             safeSearch: 'Off'
//           },
//         headers: {
//           'X-BingApis-SDK': 'true',
//           'X-RapidAPI-Key': '9843848a02msh5b2a4156d1cfad6p1b0be4jsn59264fd09150',
//           'X-RapidAPI-Host': 'bing-news-search1.p.rapidapi.com'
//         }
//       };
      
      
//       axios.request(options).then(function (response) {
//         //   console.log(response.data.news.news);
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
route.post("/payment", async (req ,res )=>{
    // console.log(req.body)
    console.log(process.env.KEY_ID , process.env.KEY_SECRET )
    try {
 var instance = new Razorpay({ key_id: process.env.KEY_ID, key_secret: process.env.KEY_SECRET })
const order = await instance.orders.create({
  amount: Number(req.body.amount ),
  currency: "INR",
})
console.log(order.id , "orderid")
res.status(201).send({order})
} catch (error) {
        console.log(error)
}
})

// route.post("/paymentverfiy", async (req ,res )=>{
//     try {
//         console.log(req.body, " payment")
//     res.status(200).send({
//         success: true,
//     })
//     } catch (error) {
//         console.log(error)
//     }
    
// })
route.post("/paymentdetails",  async (req ,res )=>{
        console.log(req.body)
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body
        const  body= razorpay_order_id + "|" + razorpay_payment_id;
        var crypto = require("crypto");
        var expectedSignature = crypto.createHmac('sha256', process.env.KEY_SECRET )
                                        .update(body.toString())
                                        .digest('hex');
        const isAuthentic = expectedSignature === razorpay_signature;
        if(isAuthentic ) {
           await paymentDetails({
            paymentid: razorpay_order_id,
            orderid: razorpay_order_id,
            signature : razorpay_signature
            })
        }else{
            res.status(400).send({"error":"eorror"})
        }
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