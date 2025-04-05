    import { compare } from "bcrypt";
    import {User} from "../models/user.js"
    import {Chat} from "../models/chat.js"
    import {Request} from "../models/Request.js"
    import {cookieOption, sendToken, uploadSingleCloudinary,uploadFilesToCloudinary} from "../utils/features.js"
    import { ErrorHandler} from "../middlewares/error.js";//TryCatch
    import {NEW_REQUEST} from "../constants/events.js";
    import { emitEvent } from "../utils/features.js";
    import {getOtherMember} from "../lib/helper.js";
    import { REFETCH_CHATS } from "../constants/events.js";


const login = async(req,res,next)=>{
    
        if(!(req.cookies.token))
            {
                const{username,password} = req.body;
                const user = await User.findOne({username}).select("+password");
                if (user)
                    {
                        const isMatch = await compare(password,user.password)
                        
                        if(isMatch)
                            { 
                                sendToken(res,user,200,`Credentials matched. Welcom back ${user.username}`)
                                next();
                            }
                            else
                            {
                                return next(new ErrorHandler(404,"Invalid Credentials"))
                            }
                    }
                    else 
                    {
                        return next(new ErrorHandler(404,"Invalid Credentials"))
                    }
            }
    };



const getMyProfile = async(req,res,next)=>{
    const user = await User.findById(req.user).select("-password");
    
    if (!user){
        return next(new ErrorHandler(404,"User not found"))
    }

    res.status(200).json({
        success:true,
        user : user
    })
}




const home = (req,res,next)=>{  
    res.send("Hello World");
    next();
}
    
const logout = (req,res,next)=>{  
    console.log("Logging out")
    //*res.cookie('token', '', { expires: new Date(0)});
    res.clearCookie("token")
    res.status(200).json({ message: 'Cookie cleared successfully' });
}


const searchUser = async(req,res,next)=>{

   const {name} = req.query;


   const myChats = await Chat.find({groupChat:false,member:req.user})

   const allUsersFromMyChats = myChats.flatMap((chat)=>chat.member)


   console.log("Hi there these are all my friends",allUsersFromMyChats);

   const query = {
    _id: {$nin: allUsersFromMyChats}
    };

// Conditionally add the name filter if it's defined and not an empty string

    if (name && name.trim() !== '') {
        console.log("HI THERE")
    query.name = { $regex: name.toString(), $options: "i" }; // Case-insensitive regex search
    }
   
   const allUsersExceptMeAndFriends = await User.find(query)

    console.log("And these are not my friends",allUsersExceptMeAndFriends.length);

   const users = allUsersExceptMeAndFriends.map((_id,name,avatar)=>({_id,name,avatar:avatar.url}))


   res.status(200).json({ success : true, users });
   
}


const newUser = async(req,res,next)=>{
try{

    const {name,username,password} = req.body;
    
    if(!req.file){
        console.log(5)
        return (next(new ErrorHandler(401,"Please upload an avatar")))
    }
    
    const file = req.file;
    
    const result = await uploadFilesToCloudinary([file])
        
    const avatar = {
        public_id : result[0].public_id,
        url : result[0].secure_url
    }
    
    const user = await User.create({name,username,password,avatar})
    sendToken(res,user,201,"User Created Successfully")
}catch(error){
    next(new ErrorHandler(error.statusCode || 500, error.message || "Internal server error"))
}
    
}

const sendFriendRequest = async(req,res,next)=>{  
    const {userId} = req.body;
    const request = await Request.findOne({
        $or : [
            {sender:req.user, receiver:userId},
            {sender:userId, receiver:req.user}
        ]
    })  
        if (request){
            return next(new ErrorHandler(400,"Request already Sent"))
        }
        await Request.create({
            sender:req.user,
            receiver : userId
        })

    emitEvent(req,NEW_REQUEST,[userId],"")
    res.status(200).json({ message: 'Friend Request Sent' });
}

const acceptRequest = async(req,res,next)=>{  
    const {requestId,accept} = req.body;
    const request = await Request.findById(requestId).populate("sender","name").populate("receiver","name");
    
        if (!request){
            return next(new ErrorHandler(400,"Request not found"))
        }
       if(request.receiver._id.toString()!== req.user.toString())
        {
            return next(new ErrorHandler(401,"You are Unauthorized to accept this request"));
        }
        if(request.sender._id.toString()==req.user.toString())
        {
            return next(new ErrorHandler(401,"Added"))
        }

    if (!accept){
        console.log("BEFORE REJECTION")
        await request.deleteOne();
        return res.status(200).json({success : true, message: 'Friend Request rejected' });
    }

    console.log("AFTER REJECTION")

    const members = [request.sender._id, request.receiver._id]

    await Promise.all([Chat.create({member:members,name : `${request.sender.name}--${request.receiver.name}`}),request.deleteOne()])

    emitEvent(req,REFETCH_CHATS,members);

    return res.status(200).json({
        success:true,
        message:"friend request accepted",
        senderId : request.sender._id
    })
}

const getAllNotifications = async(req,res,next)=>{  
   
    const requests = await Request.find({receiver:req.user}).populate("sender","name avatar")

    const allRequests = requests.map(({_id,sender})=>({
        _id,
        sender : {
            _id : sender._id,
            name : sender.name,
            avatar : sender.avatar.url,
        }
    }))
    return res.status(200).json({
        success:true,
        allRequests
    })
}

const getMyFriends = async(req,res,next)=>{
    const chatId = req.query.chatId;
    const chats  = await Chat.find({member:req.user,groupChat:false}).populate("member","name avatar")
    const friends = chats.map(({member})=>{
        const otherUser = getOtherMember(member,req.user)
        return {
            _id : otherUser._id,
            name : otherUser.name,
            avatar : otherUser.avatar.url
        }
    })

    if(chatId)
    {
        const chat = await Chat.findById(chatId)
        const availableFriends = friends.filter((friend)=>(!chat.member.includes(friend._id)))
        return res.status(200).json({
            success : true,
            message: "This is with ChatID",
            friends : availableFriends,
        })
    }
    else
    {
        return res.status(200).json({
            success:true,
            friends,
        })
    }
}


//const getMyFriends = async (req, res, next) => {

//    const chatId = req.query.chatId 
//
//    const chats = await Chat.find({ member: req.user, groupChat: false }).populate("member", "name avatar");
//
//
//    console.log(chats)
//
//    const friends = chats.map(({ member }) => {
//        
//        const otherUser  = getOtherMember(member, req.user);
//        if (otherUser){
//            return {
//                _id: otherUser._id,
//                name: otherUser.name,
//                avatar: otherUser.avatar.url,
//            };
//        }
//        return null; // Handle case where there is no other user
//    }).filter(friend => friend !== null); // Filter out null values
//
//    if (chatId) {
//        const chat = await Chat.findById(chatId);
//        const availableFriends = friends.filter((friend) => !chat.member.includes(friend._id));
//        return res.status(200).json({
//            success: true,
//            message: "This is with ChatID",
//            friends: availableFriends,
//        });
//    } else {
//        return res.status(200).json({
//            success: true,
//            friends,
//        });
//    }
//};


export {login,home,newUser,getMyFriends,getAllNotifications,sendFriendRequest,getMyProfile,logout,searchUser,acceptRequest}