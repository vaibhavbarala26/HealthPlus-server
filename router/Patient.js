const router = require("express");
const UserModel = require("../Models/Patient");
const appRouter = router();
const otpGenerator = require('otp-generator');
const twilio = require('twilio');
const jwt = require("jsonwebtoken")
const PateintAppointmentModel = require("../Models/Pateint-Dcotor-Appointment");
const verifyToekn = require("../Verify/verifyToken");
const DetailsModel = require("../Models/UserDetails");
const multer = require("multer")
const path = require("path")
const storage = multer.diskStorage({
    destination:(req , file , cd)=>{
        cd(null , "uploads/");
    },
    filename:(req , file , cd)=>{
        cd(null , Date.now()+path.extname(file.originalname));
    }
});
const upload = multer({
    storage:storage,
    fileFilter:(req , file , cd)=>{
        if(file.mimetype === "application/pdf"){
            cd(null , true);
        }
        else{
            cd(new Error("only PDF") , false);
        }
    }
});

// Load Twilio credentials from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID ;
const authToken = process.env.TWILIO_AUTH_TOKEN 
const client = twilio(accountSid, authToken);
/* */
appRouter.post("/otp", async (req, res) => {
    try {
        const { name, phone } = req.body;

        // Clear any existing OTP cookie before generating a new one
        res.clearCookie('otp');

        // Generate new OTP
        const otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });



        // Save the new OTP in an HTTP-only cookie (expires in 5 minutes)
        res.cookie('otp', otp, { httpOnly: true, maxAge: 5 * 60 * 1000 });

        // Respond with success
        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
appRouter.post("/register", async (req, res) => {
    const { name, phone, email, otp } = req.body;
    const isFound = await UserModel.findOne({ phone: phone });
    if (isFound) {
        return res.status(401).json("user already exists");
    }
    const opts = req.cookies;
    console.log(opts.otp);
    if (opts.otp && opts.otp === otp) {
        res.clearCookie("token",  { path: "/", domain: "localhost", httpOnly: true})
        const newUser = await UserModel.create({ name, phone, email })
        const expires = new Date()
        expires.setDate(expires.getDate() + 7);
        const payload = {newUser};
    const token = jwt.sign({payload} , "26020451202");
        res.cookie("token", token ,{ path: "/", domain: "localhost", httpOnly: true});
        return res.status(200).json({mssg:"user Successfully created"})
    }
    else {
        return res.status(404).json("invalid otp")
    }
})
appRouter.post("/appoint-user", verifyToekn, async (req, res) => {
    const { PateintName, DoctorName, PateintNumber, Time, Date } = req.body;
    const Status = "Pending";
    const NewREques = await PateintAppointmentModel.create({ PateintName, PateintNumber, DoctorName, Time, Date, Status });
    res.status(200).json({ msg: "Appointment Request Successfull", NewREques });
})
appRouter.post("/user-details", upload.single("pdfFile"), verifyToekn, async(req, res) => {
    try {
        // Check if a file has been uploaded
        console.log(req.body)
        if (req.file) {
            console.log("File uploaded successfully:", req.file);

            // Create user details entry along with file information
            const detail = await DetailsModel.create({
                ...req.body, // Assuming other form fields are part of req.body
                file: req.file.path // Saving the file path in the database
            });
          
            res.status(200).json({ message: "Details and file uploaded successfully", detail });
        } else {
            console.log("No file uploaded");
            res.status(400).json({ message: "No file uploaded" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = appRouter;
/**/