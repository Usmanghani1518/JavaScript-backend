import {v2 as cloudinary} from "cloudinary";
import fs from "fs"


          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath)=>{
try {
    if (!localFilePath)  return null
    // upload file on the cloudinary
    const  response = await cloudinary.uploader.upload(localFilePath,{
       resource_type:"auto" 
    })
    // file uploaded successfully on the cloudinary 
    console.log("the file has been uploaded successfully "+response.url);
    return response
} catch (error) {
    fs.unlinkSync(localFilePath) // this file is used to unlink the file from the local server 

}

}

export {uploadOnCloudinary}