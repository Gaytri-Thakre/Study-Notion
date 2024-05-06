// app creation
const express = require("express");
const fileUpload = require("express-fileupload")
const app = express();
require("dotenv").config();
// db connection
const db = require("./config/database");
db.connect();
// cookie parser
const cookieParser = require("cookie-parser");
// cors
const cors=require("cors")
// connect to cloud:
const cloudinary=require("./config/cloudinary");
cloudinary.cloudinaryConnect();
// port find :
const   PORT = process.env.PORT || 3000;
// middleware addition:
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin:"http://localhost:3000",
        credentials:true
    })
)
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)

// api route mount krna h:
const AppRoutes = require("./routes/User");
app.use("/api/v1",AppRoutes);
// activate server
app.listen(PORT,()=>{
    console.log(`App is running ar ${PORT}`);
})

// default route:
app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"Your server is up and running..."
    })
})

app.listen(PORT,()=>{
    console.log(`App is running at ${PORT}`)
})
