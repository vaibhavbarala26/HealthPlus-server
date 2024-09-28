const express = require("express");
const AppointmentModel = require("../Models/appointments");
const PateintAppointmentModel = require("../Models/Pateint-Dcotor-Appointment");
const twilio = require('twilio');
const verifyadmin = require("../Verify/verifyAdmin");
const AppointmentRouter = express.Router();

// Load Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID ;
const authToken = process.env.TWILIO_AUTH_TOKEN ;
const client = twilio(accountSid, authToken);

// Helper function to send SMS via Twilio
const sendSMS = async (message, to) => {
    try {
        await client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER , // Use env variable for production
            to
        });
    } catch (error) {
        console.error("Error sending SMS:", error);
    }
};
AppointmentRouter.get("/get-appointment" , async(req , res)=>{
    const allAppointments = await PateintAppointmentModel.find();
    return res.status(200).json(allAppointments)
})
// PUT: Confirm an appointment
AppointmentRouter.put("/appoint", verifyadmin,  async (req, res) => {
    const { PateintName, DoctorName, PateintNumber, Time, Date } = req.body;
console.log(PateintName , PateintNumber);

    try {
        // Check if there's already a pending appointment
        const existingAppointment = await PateintAppointmentModel.findOne({ PateintName,PateintNumber, DoctorName, Time, Date });
        
        if (existingAppointment && existingAppointment.Status === "Pending") {
            // Check the number of appointments for the doctor on the specified date
            const dayAppointments = await AppointmentModel.find({ DoctorName, Date });

            // Reject if there are already 3 or more appointments for that day
            if (dayAppointments.length >= 3) {
                return res.status(401).json({ msg: `Already have 3 appointments on ${Date}` });
            }

            // Check if there is a time clash
            const timeClash = await AppointmentModel.findOne({ DoctorName, Time, Date });
            if (timeClash) {
                return res.status(400).json({ msg: "Time Clashing" });
            }

            // Update the status to "Success" and save
            existingAppointment.Status = "Success";
            await existingAppointment.save();

            // Send confirmation SMS
            await sendSMS(`Hi ${PateintName}, Your appointment with ${DoctorName} is confirmed at ${Time} on ${Date}`, PateintNumber);

            // Optionally create a new appointment record
            await AppointmentModel.create({ PateintName, DoctorName, Time, Date });

            return res.status(200).json({ msg: "Appointment confirmed and updated", appointment: existingAppointment });
        } else {
            return res.status(400).json({ msg: "Appointment is not in a pending state or does not exist" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Something went wrong", error });
    }
});

// PUT: Cancel an appointment
AppointmentRouter.put("/cancel", verifyadmin, async (req, res) => {
    const { PateintName, DoctorName, PateintNumber, Time, Date , Reason } = req.body;
console.log(PateintName , PateintNumber);

    try {
        // Find the appointment to cancel
        const appointmentToCancel = await PateintAppointmentModel.findOne({PateintName , PateintNumber, DoctorName, Time, Date ,  });
        console.log(appointmentToCancel)
        if (appointmentToCancel && appointmentToCancel.Status === "Pending") {
            // Update the status to "Canceled"
            appointmentToCancel.Status = "Cancelled";
            await appointmentToCancel.save();

            // Send cancellation SMS
            await sendSMS(`Hi ${PateintName}, Your appointment with ${DoctorName} is canceled due to a ${Reason}`, PateintNumber);

            return res.status(200).json({ msg: "Appointment canceled and updated", appointment: appointmentToCancel });
        } else {
            return res.status(400).json({ msg: "Appointment is not pending or does not exist" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Something went wrong", error });
    }
});

module.exports = AppointmentRouter;
