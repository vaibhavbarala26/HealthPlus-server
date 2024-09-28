const mongoose = require("mongoose")
const url = "mongodb+srv://22je1042:bXFctOw8bLgyLv7P@cluster0.pywyv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const connectiona = async()=>{
    try{
        await mongoose.connect(url)
        .then(()=>{
            console.log("connection");
        })
    }
    catch(E){
        console.log("error");
    }
}
module.exports = connectiona
//vaibhavbarala 8pasxZC1lEdA051ox//