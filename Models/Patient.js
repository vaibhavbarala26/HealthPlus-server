const mongoose = require("mongoose")
const userSchema = mongoose.Schema({
    name:{
        type:String,
    },
    phone:{
        type:String,
    },
    email:{
        type:String,
    }
})
const UserModel = mongoose.model("patient" , userSchema)
module.exports = UserModel;