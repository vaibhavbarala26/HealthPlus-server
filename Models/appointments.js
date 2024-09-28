const mongoose = require("mongoose")
const AppointmentSchema = mongoose.Schema({
    PateintName: {
        type: String,
    },
    PateintNumber: {
        type: String,
    },
    DoctorName: {
        type: String,
    },
    Time: {
        type: String,
    },
    Date: {
        type: String,
    },
    Reason:{
        Type:String,
    }                               
}) 
const AppointmentModel = mongoose.model("admin-approved-appointment", AppointmentSchema)
module.exports = AppointmentModel;