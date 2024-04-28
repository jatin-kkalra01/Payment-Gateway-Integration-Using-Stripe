//app create krni hai
const express = require('express');
const app = express();

//port find krna hai
require("dotenv").config();
const PORT = process.env.PORT || 3000;  

//middleware add krne hai
app.use(express.json());
const fileUpload = require('express-fileupload')
app.use(fileUpload({
    useTempFiles: true,
}))

//db se connect krna hai
const db = require('./configs/database');
db.connect();

//cloud se connect krna hai
const cloudinary = require('./configs/cloudinary');
cloudinary.cloudinaryConnect();

//api route mount krna hai
const upload = require('./routes/FileUpload');
app.use('/api/v1/upload', upload);

//activate server
app.listen(PORT, ()=>{
    console.log(`App is running at ${PORT}`);
})