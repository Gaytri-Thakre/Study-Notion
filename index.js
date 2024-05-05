// app creation
const express = require("express");
const app = express();
require("dotenv").config();
// port find :
const   PORT = process.env.PORT || 3000;
// middleware addition:
app.use(express.json());
// db connection
const db = require("./config/database");
db.connect();
// connect to cloud:
const cloudinary=require("./config/cloudinary");
cloudinary.cloudinaryConnect();
// api route mount krna h:
const AppRoutes = require("./routes/User");
app.use("/api/v1",AppRoutes);
// activate server
app.listen(PORT,()=>{
    console.log(`App is running ar ${PORT}`);
})

// default route:
app.get("/",(req,res)=>{
    res.send(`<h1>This is homepage</h1>`)
})
