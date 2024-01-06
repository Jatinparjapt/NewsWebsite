const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Singup = new mongoose.Schema({
    name:{
        type : String,
        require : true,
        minlength : 2
    },
    email: {
        type : String,
        require: true
    },
    password: {
        type: String,
        require: true,
        minlength : 5
    },
    date : {
        type : Date,
        default : Date.now
    },
    messages: [
        {
            name:{
                type : String,
                require : true,
                minlength : 2
            },
            email: {
                type : String,
                require: true
            },
            message : {
                type : String,
                require : true
            }

        }
    ],
    paymentDetails : [
        {
            paymentid:{
                type : String,
                require : true
            },
            orderid:{
                type : String,
                require : true
            },
            signature :{
                type : String,
                require : true
                }
        }
    ],
    fulladdress :[{
        name : {
            type:String,
            required : true,
        },
        email:{
            type : String ,
            required:true,
        },
        number:{
            type:String,
            required: true
        },
        city:{
            type:String,
            required: true
        },
        state:{
            type:String,
            required: true
        },
        address:{
            type:String,
            required: true
        }
    }],
    tokens:[{
        token:{
            type:String,
            require:true,

        }
    }]

})
Singup.pre("save" ,async function (next){
   if( this.isModified("password")){
    this.password = await bcrypt.hash(this.password, 12);
   }
   next();
})
Singup.methods.generateAuthToken = async function (){
    // frist arrugment is unique value an secon is scret key 
    const tokenJwt = jwt.sign({_id:this._id},process.env.SCREAT_KEY);
    this.tokens = this.tokens.concat({token:tokenJwt})
    // console.log(this)
    await this.save();
    return tokenJwt;
}
// Singup.methods.addMessage = async function(name , email , message){
//     try {
//         this.messages = this.messages.concat({name ,email , message})
//         await this.save();
//     } catch (error) {
//         console.log(error)
//     }
   
// }
// Singup.methods.addAddress = async function (name ,email ,number ,city , state , address){
//     try {
//         this.fulladdress = this.fulladdress.concat({name ,email , number ,city , state ,address})
//         await this.save();
//     } catch (error) {
//         console.log(error)
//     }
// }
const New_Account = new mongoose.model("account_Data_MyWeb",Singup)
module.exports = New_Account