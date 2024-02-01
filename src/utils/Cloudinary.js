import {v2 as cloudinary} from "cloudinary";
import fs from "fs"


          
cloudinary.config({ 
  cloud_name:"usman-choudhary" || `${process.env.CLOUDINARY_NAME}` , 
  api_key: "235542998375683" || `${process.env.CLOUDINARY_API_KEY}`, 
  api_secret: "kY2PRA04I1Ttbm-_KnhZl4i3O_0" || `${process.env.CLOUDINARY_API_SECRET }`
});

//console.log(  process.env.CLOUDINARY_NAME +" other api key " + process.env.CLOUDINARY_API_KEY +" api secret " + process.env.CLOUDINARY_API_SECRET ); 

const uploadOnCloudinary = async (localFilePath)=>{
try {
    if (!localFilePath)  return null
    // upload file on the cloudinary
    const  response = await cloudinary.uploader.upload(localFilePath,{
       resource_type:"auto" 
    })
    // file uploaded successfully on the cloudinary 
    console.log("the file has been uploaded successfully "+response.url);
    fs.unlinkSync(localFilePath)
    return response
} catch (error) {
    fs.unlinkSync(localFilePath) // this file is used to unlink the file from the local server 
//console.log(" there is an error and not file uploaded on the cloudinary ");
}

}

export {uploadOnCloudinary}