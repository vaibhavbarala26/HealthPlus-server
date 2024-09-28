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
    Status:{
        type:String,
    },
    Reason:{
        Type:String,
    }   
})
const PateintAppointmentModel = mongoose.model("pateint-doctor-appointment", AppointmentSchema)
module.exports = PateintAppointmentModel;