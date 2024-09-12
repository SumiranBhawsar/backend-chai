import { v2 as cloudinary } from "cloudinary";
import exp from "constants";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return console.log("cloud't find the path");
    // Upload the file on cloudinary
    const uploadResult = await cloudinary.uploader
      .upload(
        localFilePath,
        {
          resource_type: "auto",
        }
      )
      .catch((error) => {
        console.log("FILE upload ERROR: ",error);
      });
      // file has been upload successfully
      console.log(uploadResult.url);
      return uploadResult.url;
  } catch (error) {
      fs.unlinkSync(localFilePath); // remove the locally saved temporary file as the upload operation got failed 
      return null; 
  }
};

export { uploadOnCloudinary };
