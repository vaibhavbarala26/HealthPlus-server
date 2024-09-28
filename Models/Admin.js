const mongoose = require("mongoose")
const AdminSchema = mongoose.Schema({
    name:{
        type:String,
    },
    phone:{
        type:String,
    },
    pincode:{
        type:String,
    }
})
const AdminModel = mongoose.model("patient" , AdminSchema)
module.exports = AdminModel;