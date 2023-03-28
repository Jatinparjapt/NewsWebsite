const { error } = require("console");
const jwt = require("jsonwebtoken")
const cookie =require("cookie-parser")
const User = require("../mongoose/schema")
const Authcation = async (req ,res , next)=>{
    try {
        // console.log(req)
        const token = req.cookies.jwtoken;
        console.log(token)
        const verfiy = jwt.verify(token ,process.env.SCREAT_KEY);
        const rootUser = await User.findOne({_id : verfiy._id, "tokens.token":token});
        if(!rootUser){
            throw new Error("User Not found")
        }
        req.token = token;
        req.rootUser = rootUser
        req.userId = rootUser._id
        next()
    } catch (error) {
        res.status(404).json({"Unauthorized" :"No Token Provided"})
        console.log(error)
    }
}
module.exports = Authcation;
