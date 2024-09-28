const jwt = require("jsonwebtoken")
const verifyToekn = (req , res , next)=>{
    const token  = req.cookies.token;
    try{
        if(!token){
            return res.status(400).json("token not Found");
        }
        jwt.verify(token , "26020451202" , async(error , payload)=>{
            if(error) return res.status(401).json({mssg:"invalid token"})
            req.user = payload;
        next();
        }) 
    }
    catch(e){
        console.log("error")
    }   
} 
module.exports = verifyToekn