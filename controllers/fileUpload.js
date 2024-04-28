const File = require('../models/file');
const cloudinary = require('cloudinary').v2

//localFileUpload --> handler function
exports.localFileUpload = async (req, res)=>{

    try{
        //fetch file
        const file = await req.files.file;
        console.log("File aagayi hai-> ", file);

        //create path where file needs to be stored on server
        //Date.now() shows current time in milliseconds
        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;
        console.log("Path-> ", path);

        //add path to move function
        file.mv(path, (err)=>{
            console.log(err);
        });

        //create a successful response
        res.json({
            success: true,
            message: "Local File uploaded successfully",
        });
    }
    catch(error){
        console.log('Not able to upload the file on server.')
        console.log(error)
    }
}

function isFileTypeSupported(type, supportedTypes){
    return supportedTypes.includes(type);
}

async function uploadFileToCloudinary(file, folder, quality){
    const options = {folder};
    console.log("temp file path ", file.tempFilePath);

    if(quality){
        options.quality = quality;
    }

    options.resource_type = "auto";
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

//image upload ka handler
exports.imageUpload = async (req, res) => {

    try{
        //data fetch
        const {name, tags, email} = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile
        console.log(file)

        //validation
        const supportedTypes = ["jpeg", "jpg", "png", "pdf"];
        const fileType = file.name.split(".")[1].toLowerCase();

        if(!isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success: false,
                message: "File format not supported."
            });
        }

        //file format supported hai
        const response = await uploadFileToCloudinary(file, "CodeHelp");
        console.log(response)

        //db mei entry save krni hai
        const fileData = await File.create({
            name: req.body.name,
            tags: req.body.tags,
            email: req.body.email,
            imageUrl: response.secure_url
        })

        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: "Image Successfully Uploaded."
        })

    }
    catch(error){
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Something went wrong."
        })
    }
}


//video upload ka handler
exports.videoUpload = async (req, res) => {

    try{
        //data fetch
        const {name, tags, email} = req.body;
        console.log(name, tags, email);

        const file = req.files.videoFile;
        console.log(file);

        //validation
        const supportedTypes = ["mp4", "mov"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("File Type is: ", fileType);

        //TODO: add a upper limit of 5MB for video
        if(!isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success: false,
                message: "File format not supported."
            })
        }

        //File format supported hai
        console.log('Uploading to CodeHelp');
        const response = await uploadFileToCloudinary(file, "CodeHelp");
        console.log(response);

        //db mei entry save krni hai
        const fileData = await File.create({
            name: req.body.name,
            tags: req.body.tags,
            email: req.body.email,
            imageUrl: response.secure_url,
        })

        res.json({
            success: true,
            videoUrl: response.secure_url,
            message: "Video Successfully Uploaded."
        })
    }
    catch(error){
        console.log(error);
        res.status(400).json({
            success: false,
            message: "Something Went Wrong."
        })
    }
}


//imageSizeReducer
exports.imageSizeReducer = async (req, res) => {

    try{
        //data fetch
        const {name, tags, email} = req.body;
        console.log(name, tags, email)

        const file = req.files.imageFile;
        console.log(file);

        //validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log(fileType);

        if(!isFileTypeSupported(fileType, supportedTypes)){
            return res.json({
                success: false,
                message: "File format not supported"
            })
        }

        //file format supported hai
        console.log('Uploading to CodeHelp');

        //TODO: compress by using--> height attribute
        const response = await uploadFileToCloudinary(file, "CodeHelp", 90);
        console.log(response);

        //db mei entry save krni hai
        const fileData = await File.create({
            name: req.body.name,
            tags: req.body.tags,
            email: req.body.email,
            imageUrl: response.secure_url,
        })

        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: "Image Successfully Uploaded."
        })
    }
    catch(error){
        console.log(error);
        res.json({
            success: false,
            message: "Something Went Wrong."
        })
    }
}