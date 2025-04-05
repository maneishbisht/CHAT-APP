import { ErrorHandler } from "../middlewares/error.js";//TryCatch
import { Chat } from "../models/chat.js";
import { User } from "../models/user.js";
import { Message } from "../models/message.js";
import {cookieOption} from "../utils/features.js"
import jwt from "jsonwebtoken";
import { adminSecretKey } from "../app.js";

const allUsers = async(req,res,next)=>{
    const users = await User.find({})

    const transformedUser = await Promise.all(users.map(async({name,username,avatar,_id})=>{

        const [groups,friends] = await Promise.all([Chat.countDocuments({groupChat : true,member : _id}),Chat.countDocuments({groupChat:false,members:_id})]);

        return {name,username,avatar :avatar.url,_id,groups,friends}
    }))
    return res.status(200).json({
        status : "success",
        transformedUser,
    })
}


const allChats = async(req,res,next)=>{
    const chats = await Chat.find({}).populate("member","name avatar").populate("creator", "name avatar");

    const transformedChat = await Promise.all(chats.map(async({member,_id,groupChat,name,creator})=>{
        
        const totalMessages = await Message.countDocuments({chat:_id});

        return ({_id :_id, 
                groupChat:groupChat,
                name:name,
                avatar:member.slice(0,3).map((i)=>i.avatar.url),
                member:member.map(({_id,name,avatar})=>{
                    return ({   _id,
                                name,
                                avatar: avatar?.url
                            })
                }),
                creator:{
                        name : creator?.name||"None",
                        avatar : creator?.avatar.url||"Empty"
                        },
                totalMembers : member.length,
                totalMessages : totalMessages
                })
    }))
    
    
    return res.status(200).json({
        status : "success",
        transformedChat,
    })
}


const allMessages = async(req,res)=>{
    
    
    
    //const arr = [
    //   "677bad901ccb737538fd1314","677badddcbe16ed542fd15f6"
    //]
    //await Message.deleteMany({_id : {$in :arr}});
    
    const messages = await Message.find().lean().populate("sender","name avatar").populate("chat","groupChat");

    const transformedMessage = messages.map(({content,attachments,_id,sender,createdAt,chat})=>({
        _id:_id,
        attachment: attachments,
        content : content,
        createdAt : createdAt,
        chat:chat._id,
        groupChat:chat.groupChat,
        sender: {
                _id : sender._id,
                name : sender.name,
                avatar:sender.avatar.url
                }
}))


    return res.status(200).json({
        success : true,
        messages : transformedMessage
    })

}

const getDashBoardStats = async(req,res)=>{
    
    const [groupsCount,usersCount,messagesCount,totalChatCount] = await Promise.all([Chat.countDocuments({groupChat:true}),User.countDocuments(),Message.countDocuments(),Chat.countDocuments()])

    const today = new Date();
    const last7Days = new Date();

    last7Days.setDate(last7Days.getDate()-7);

    const last7DaysMessages = await Message.find({createdAt : {$gte : last7Days}}).select("createdAt")

    const messages = new Array(7).fill(0)

    const daysinmilliseconds = 1000*60*60*24;

    last7DaysMessages.forEach(message=>{
        const indexApprox = (today.getTime()-message.createdAt.getTime())/daysinmilliseconds;

        const index = Math.floor(indexApprox);

        messages[6-index]++;

    })

    const stats = {groupsCount,usersCount,messagesCount,totalChatCount,last7DaysMessages,messagesChart:messages}



    return res.status(200).json({
        success : true,
        stats
    })

}


const adminLogin = async(req,res,next)=>{
    
    const {secretKey} = req.body;

    const isMatched = secretKey.toString()===adminSecretKey.toString();

    if(!isMatched){
       return next(new ErrorHandler(401,"invalid Admin Key"))
    }

    const token = jwt.sign(secretKey,process.env.JWT_SECRET);
    return res.status(200).cookie("chattu-admin-token",token,{...cookieOption,maxAge :10000*60*15}).json({
        success : true,
        message: "authenticated Admin Successfully"
    })
}

const adminLogout = async(req,res,next)=>{
    res.clearCookie("chattu-admin-token")
        return res.status(200).json({
            success : true,
            message : "Logged Out and cookied cleared successfully"
        })}
    

const getAdminData = async(req,res,next)=>{
            return res.status(200).json({admin : true})
}

export {allUsers,getAdminData,adminLogout,allChats,adminLogin,getDashBoardStats,allMessages}
