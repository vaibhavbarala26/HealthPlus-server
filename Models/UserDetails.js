const mongoose = require("mongoose")
const DetailsModelSchema = mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String
    },
    phone:{
        type:String,
    },
    DOB:{
        type:String,
    },
    Gender:{
        type:String,
    },
    Address:{
        type:String,
    },
    Job:{
        type:String,
    },
    emergency:{
        type:String,
    },
    Plan:{
        type:String,
    },
    Allergies:{
        type:String
    },
    CurrentMedic:{
        type:String,
    },
    FamilyMedHis:{
        type:String,
    },
    PastMedHis:{
        type:String,
    },
    BirthCertificate:{
        type:String,
    },
    ID:{
        type:String,
    },
    file:{
        type:String,
    }
})
const DetailsModel = mongoose.model("details" , DetailsModelSchema)
module.exports = DetailsModel;