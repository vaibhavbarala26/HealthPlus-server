require('dotenv').config();
const express = require("express");
const connectiona = require("./connection"); // MongoDB connection
const Doctor = require("./Models/doctor");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const appRouter = require("./router/Patient");
const cors = require("cors")
const AppointmentAouter = require("./router/Appointment");
const adminRouter = require("./router/admin");
const app = express();


// Middleware
app.use(express.json()); // For parsing JSON bodies
app.use(cors({
    credentials:true,
    origin:"http://localhost:5173"
    }))

app.use(cookieParser()); // Corrected invocation of cookie-parser
app.use(bodyParser.urlencoded({ extended: true })); // For parsing URL-encoded bodies
app.use("/user", appRouter); // Use your appRouter for user-related routes
app.use("/admin" , AppointmentAouter)
app.use("/admin" , adminRouter)

// Connect to MongoDB
connectiona()
    .then(() => {
        console.log("Connected to MongoDB");

        // Route to add multiple doctors
        app.post('/doctors', async (req, res) => {
            try {
                const doctors = req.body; // Expecting JSON data in the body of the request
                console.log(doctors);

                // Insert multiple records into MongoDB
                await Doctor.insertMany(doctors);

                res.status(201).json({ message: 'Doctors saved successfully!' });
            } catch (error) {
                console.error('Error saving doctors:', error);
                res.status(500).json({ message: 'An error occurred while saving doctors.' });
            }
        });
        app.get("/doctors" , async(req , res)=>{
            try{
                const doctors = await Doctor.find();
                res.status(200).json({doctors})
            }
            catch(e){
                console.log("error")
            }
        })

        // Start the server
        app.listen(1042, () => {
            console.log("Listening on PORT 1042");
        });
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1); // Exit the application if the connection fails
    });
