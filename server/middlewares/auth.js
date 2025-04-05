import { ErrorHandler} from "./error.js";//TryCatch
import jwt from "jsonwebtoken";
import { adminSecretKey } from "../app.js";
import { User } from "../models/user.js";

const isAuthenticated = async(req,res,next)=>{

    const Token = req.cookies["token"];
    if (!Token)
        {
            return next(new ErrorHandler(404,"Please login to access this route"))
        }
    else
    {   
        const decodedData = jwt.verify(Token,process.env.JWT_SECRET)
        console.log(decodedData);
        req.user = decodedData._id;
        next();
    }
}

const adminOnly = async(req,res,next)=>{

    const Token = req.cookies["chattu-admin-token"];
    if (!Token)
        {
            return next(new ErrorHandler(404,"You need to login as Admin to access this route"))
        }   
        
    const secretKey = jwt.verify(Token,process.env.JWT_SECRET);
    
    const isMatched = secretKey===adminSecretKey;
    
    if(!isMatched){
        return next(new ErrorHandler(401,"Only admin can access this route"))
    }

    next();

}

const socketAuthenticator = async(err,socket,next)=>{
    try{
        if(err)
            {
                throw(err);
            }
        else{
            const authToken = socket.request.cookies.token;
            if(!authToken){
                throw(err)
            }
            const decodedData = jwt.verify(authToken,process.env.JWT_SECRET);
            const user =  await User.findById(decodedData._id);
            if(!user){      
                throw(err)
            }
            socket.user = user;
            next();
            }

    }catch(err){
        console.log(err)
        return next(new ErrorHandler(401,"Please login to access this route"))
    }
}

export {isAuthenticated,adminOnly,socketAuthenticator}