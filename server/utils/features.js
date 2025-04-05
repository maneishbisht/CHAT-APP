import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {cloudinary, userSocketIds} from "../app.js";
import {v4 as uuid} from "uuid";
//import { TryCatch } from "../middlewares/error.js";
import { getBase64, getSockets } from "../lib/helper.js";

const cookieOption = {maxAge : 15*24*60*60*1000,sameSite:"none",httpOnly : true,secure:true}

const connectDB = async(uri) => {
    try {
        const data = await mongoose.connect(uri, { name: "chattu", serverSelectionTimeoutMS: 10000 });
        console.log(`connected to db : ${data.connection.host}`);
    } catch (err) {
        console.error("Database connection error:", err);
        throw err; // Throw the error to be handled in app.js
    }
}


const sendToken = (res,user,code,message)=>{

const secretKey = process.env.JWT_SECRET;
const token = jwt.sign({_id :user._id},secretKey);
const decodedData =jwt.verify(token,secretKey);
return res.status(code).cookie("token",token,cookieOption).json({success : true,user,message})
}   



const emitEvent = (req,event,users,data)=>{

 const io = req.app.get("io");
 
 const usersSocket = getSockets(users,userSocketIds);
 
 io.to(usersSocket).emit(event,data);
}



const deleteFilesFromCloudinary = (public_ids)=>{
    console.log("FILE DELETED FROM CLOUDINARY")
}


const uploadSingleCloudinary = async(file)=>{
    const uploadPromises = await cloudinary.uploader.upload(getBase64(file),{resource_type:"auto",public_id : uuid()},(error,result)=>{
        if(error) return error;
        return result
    }).then((data)=>{
        return data;
    }).catch((error)=>{
        throw error;
    })


    return uploadPromises
}


const uploadFilesToCloudinary = async(files=[])=>{

    console.log(files);

    if (!Array.isArray(files)) {
        throw new Error("Expected 'files' to be an array");
    }

    const uploadPromises = files.map((file)=>{

        return new Promise((resolve,reject)=>{

             const uploadStream = cloudinary.uploader.upload(getBase64(file),{resource_type : "auto",public_id : uuid()},(error,result)=>{
                if(error)return reject(error);
                resolve(result);
            });

        });
    })

    try{

        //console.log(uploadPromises);

        const results = await Promise.all(uploadPromises);
        const formattedResults = results.map((result)=>{

                return {
                public_id : result.public_id,
                secure_url : result.secure_url}  
        })
       
        return formattedResults;
    }catch(err){
        throw new Error("Error uploading files to cloudinary")
    }
}

export {connectDB,uploadSingleCloudinary,sendToken,cookieOption,emitEvent,deleteFilesFromCloudinary,uploadFilesToCloudinary};
