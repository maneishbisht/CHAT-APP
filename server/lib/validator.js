import {body,validationResult,check,param} from "express-validator";
import { ErrorHandler } from "../middlewares/error.js";

const validateHandler = (req,res,next) => {
    console.log("handler start next")
    const err = validationResult(req).array().map((item)=>item.msg).join(",");
    if (!err) {
        next();
    } else {
        next(new ErrorHandler(400,err))
    }
}


const newGroupValidator = (req,res,next) => {
    return(
        [
        body("name","Please enter name").notEmpty(),
        body("member").notEmpty().withMessage("Please enter members").isArray({min:2,max:100}).withMessage("Members must be between 2-100 only")
        ])
}   

const addMemberValidator = (req,res,next) => {
    return(
        [
        body("chatId","Please enter chat ID").notEmpty(),
        body("members").notEmpty().withMessage("Please enter members").isArray({min:1,max:100}).withMessage("Members must be between 2-100 only")
        ])
}  

const sendAttachmentsValidator = (req,res,next) => {
    
    return(
        [
        body("chatId","Please enter chatId").notEmpty(),
        body("files").custom((value, { req }) => {
            if (!req.files || req.files.length < 1) {
                throw new Error("Please upload attachments");
            }
            if (req.files.length > 5) {
                throw new Error("You can upload a maximum of 5 files");
            }
            return true; // If validation passes
        })
        ])
}


const registerValidator = (req,res,next) => {
    console.log(2)
    return(
        [
        body("name","Please enter name").notEmpty(),
        body("username","Please enter userName").notEmpty(),
        body("password","Please enter password").notEmpty()
        ])
}


const chatIdValidator = (req,res,next) => {
    return [
        check('id', 'Please enter a valid chat ID').notEmpty().withMessage('Chat ID cannot be empty')
    ];
};

//const searchUserValidator = (req,res,next) => {
//    return([query("name","Please enter a name to search").notEmpty()])
//}

const renameGroupValidator = (req,res,next) => {
    return([param("id","Please enter chat ID").notEmpty(),
        body("name","please provide a name").notEmpty()
    ])
}


const loginValidator = (req,res,next) => {
    return(
        [
        body("username","Please enter userName").notEmpty(),
        body("password","Please enter password").notEmpty()
        ])

}


const sendRequestValidator = (req,res,next)=>{
    return ([body("userId","Please enter user ID").notEmpty()])
}

const acceptRequestValidator = (req,res,next)=>{
    return ([body("requestId","Request Id not found").notEmpty(),
        body("accept").notEmpty().withMessage("Please add Accept as T or F").isBoolean().withMessage("Accept must be T or F")
    ])
}

const adminLoginValidator = (req,res,next)=>{
   return[body("secretKey","Please enter a secret key").notEmpty()]
}


export {adminLoginValidator,renameGroupValidator,acceptRequestValidator,registerValidator,chatIdValidator,addMemberValidator,sendAttachmentsValidator,newGroupValidator,sendRequestValidator,loginValidator,validateHandler};