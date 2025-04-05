//import { TryCatch } from "../middlewares/error.js";
import {Chat} from "../models/chat.js";
import { User } from "../models/user.js";
import {Message} from "../models/message.js";
import { ALERT,REFETCH_CHATS,NEW_MESSAGE,NEW_MESSAGE_ALERT,NEW_ATTACHMENT} from "../constants/events.js";
import {ErrorHandler} from "../middlewares/error.js";
import {deleteFilesFromCloudinary, emitEvent, uploadFilesToCloudinary } from "../utils/features.js";
import {getOtherMember} from "../lib/helper.js";
//---------------------------------
//----------------------------------------------------------------------------


const newGroupChat = async(req,res,next)=>{

    const {name,member} = req.body;
    //if (members.length<2)
    //{
    //    return next(new ErrorHandler(400,"Group chat must have at least 2 members"))
    //} 
    //else{

        
        const allMembers = [...member,req.user];
        const chat = await Chat.create({
            name,groupChat:true,creator:req.user,member:allMembers
        })
        const chatId = chat._id;
        emitEvent(req,ALERT,allMembers,{message:`Welcome to ${name} group`,chatId})
        emitEvent(req,REFETCH_CHATS,member);
        
        return res.status(201).json({   
            success:true,   
            message:"Group chat created"
        })
    //}

}

//----------------------------------------------------------------------------

const getMyChats = async(req,res,next)=>{

        const chats = await Chat.find({member:req.user}).populate("member","name avatar");
        
        const transformChats = chats.map(({_id,name,member,groupChat})=>{

        const otherMember = getOtherMember(member,req.user);
            return (
                {
                    _id,
                    groupChat,
                    avatar : groupChat?(member.slice(0,3).map(({avatar})=>avatar.url)):([otherMember.avatar.url]),
                    name:groupChat?name:otherMember.name,
                    member:member.reduce((prev,curr)=>{
                        if (curr._id.toString()!==req.user.toString()){
                            prev.push(curr._id)
                        }
                        return prev;
                    },[])
                }
            )
        })

        return res.status(200).json({
            success:true,   
            transformChats
        })
    }


//----------------------------------------------------------------------------

const getMyGroups = async(req,res,next)=>{

    const chats = await Chat.find({
        member : req.user,
        groupChat : true,
        creator : req.user,
    }).populate("member","name avatar")
       
    const groups = chats.map(({member,_id,groupChat,name})=>(
        {
            _id,
            groupChat,
            name,
            avatar: [(member.slice(0,3).map(({avatar})=>avatar.url))]
        }
    )
    
    )
        return res.status(200).json({
            success:true,
            groups  
        })

    }

//----------------------------------------------------------------------------


const addMembers = async(req,res,next)=>{
const {chatId,members} = req.body;

if (!members||members.length<1){
    return  next(new ErrorHandler(400,"Please provide members"))
}

const chat = await Chat.findById(chatId);

if (!chat) return next(new ErrorHandler(404,"Chat not found"))

if (!chat.groupChat) return next(new ErrorHandler("This is not a group Chat",404));

if (chat.creator.toString()!==req.user.toString()){
    return next(new ErrorHandler(400,"You are not allowed to add members"))
}

const allNewMembersPromise = members.map(i=>User.findById(i,"name"));
const allNewMembers = await Promise.all(allNewMembersPromise);

const uniqueMembers = allNewMembers.filter((i)=>!(chat.member.includes(i._id.toString()))).map((i)=>i._id)

if (uniqueMembers.length<1){
    return next(new ErrorHandler(400,"No new member added"))
}





if (chat.member.length+uniqueMembers.length>100){
    return next(new ErrorHandler(400,"Group members limit reached"));
}

chat.member.push(...uniqueMembers); 

await chat.save();

const allUsersName = allNewMembers.map((i)=>i.name).join("");

emitEvent(
    req,
    ALERT,
    chat.member,
    {message:`${allUsersName} added to group`,
    chatId}
)

emitEvent(req,REFETCH_CHATS,chat.member,);

return res.status(200).json({
    success : true,
    message : "Members added successfully"
});
}


//----------------------------------------------------------------------------

const removeMembers = async(req,res,next)=>{

const {userId,chatId} = req.body;
const[chat, userThatWillBeRemoved] = await Promise.all([Chat.findById(chatId),User.findById(userId,"name")])


    if (!chat) {{return next(new ErrorHandler(404,"Chat not found"))}}

    if (!chat.groupChat) {return next(new ErrorHandler(404,"This is not a group Chat"))}
    
    if (chat.creator.toString()!==req.user.toString()){return next(new ErrorHandler(400,"You are not allowed to remove members"))}
    
    if (chat.member.length<=3){return next(new ErrorHandler(400,"Group must have atleast 3 members"))}

    const allChatMembers = chat.member;    

    chat.member = chat.member.filter((member)=>member.toString()!==userId.toString())
    
    await chat.save();

    emitEvent(req,ALERT,chat.member,{message :`${userThatWillBeRemoved.name} has been removed from the group`,chatId})

    emitEvent(req,REFETCH_CHATS,allChatMembers);

    return (res.status(200).json({
        success:true,
        message : "Member removed successfully"
    }))
};

//----------------------------------------------------------------------------

const leaveGroup = async(req,res,next)=>{
    
    const chatId = req.params.id;

    const chat = await Chat.findById(chatId);
    
        if (!chat) return next(new ErrorHandler(404,"Chat not found"))
    
        if(!chat.groupChat){return next(new ErrorHandler(400,"This is not a group chat"))}
        
        const remainingMembers = chat.member.filter((member)=>member.toString()!==req.user.toString())
        
        if (chat.creator.toString()===req.user.toString())
        {

            const randomElement = Math.floor(Math.random()*remainingMembers.length);

            const newCreator = remainingMembers[randomElement];
            chat.creator = newCreator;
        }

        chat.member = remainingMembers;
        
        const user = await Promise.all([User.findById(req.user,"name"),chat.save()])


        emitEvent(req,ALERT,chat.member,{message : `User ${user.name} has left the group $`,chatId})

        return res.status(200).json({
            success:true,
            message : "You left the group"
        });


}

//---------------------------------------------------------------------------

const sendAttachments = async(req,res,next)=>{
    

   const {chatId} = req.body;
   

   const [chat,me] = await Promise.all([Chat.findById(chatId),User.findById(req.user,"name avatar")]);


   if(!chat) return next(new ErrorHandler (404,"Chat not Found"))


   const files = req.files||[];


   //if (files.length<1){
   //     return next(new ErrorHandler(400,"Please provide attachments"))
   //}

    const rawAttachments = await uploadFilesToCloudinary(files).then((data)=>data).catch((error)=>{next(new ErrorHandler(402,"Cant be uploaded successfully"))});

    const attachments = rawAttachments.map(({public_id,secure_url})=>{
        return (
            {
                public_id: public_id.toString(),
                url:secure_url.toString()
            }
        )
    })

    const messageForDB = {content : "", attachment:attachments, sender : me._id, chat : chatId}
   
    const messageForRealTime = {...messageForDB,sender : {_id:me._id,name:me.name}}
   
    const message = await Message.create(messageForDB);
 
    const users = chat.member.map((data)=>data.toString());
    const data = {
        message : messageForRealTime,
        chatId
    }

   emitEvent(req,NEW_MESSAGE,users,data)
   emitEvent(req,NEW_MESSAGE_ALERT,chat.member,{chatId})
    
    return res.status(200).json({
        success: true,  
        message : "hi there"
    })
}

//--------------------------------------------------------------------------

const getChatDetails = async(req,res,next)=>{
    console.log("INSIDE MAIN HANDLER")
    if (req.query.populate)
        {
            const chat = await Chat.findById(req.params.id).populate("member","name avatar").lean();
            
            if(!chat) return next(new ErrorHandler(400,"Chat not found"))
            
            chat.member = chat.member.map(({_id,name,avatar})=>{
                return {_id,name,avatar:avatar.url}
            })    
            
            return res.status(200).json({
                    success : true,
                    chat,
            })
            
        }
    else
    {
        const chat = await Chat.findById(req.params.id);
        if (!chat){ return next(new ErrorHandler(400,"Chat Not found"))}

        return res.status(200).json({
            success : true,
            chat
        })

    }

}

//--------------------------------------------------------------------------


const renameGroup = async(req,res,next)=>{
      
    const{name} = req.body;


    const chat = await Chat.findById(req.params.id);


    if(!chat) return next (new ErrorHandler(400,"Group Not found"))
        
      
    if(!chat.groupChat){return next(new ErrorHandler(400,"Only group names can be modified"))}
    

    if((chat.creator.toString())!==(req.user.toString()))
        {
            return next(new ErrorHandler(403,"Only admin can modify group Name"))
        }
    

    console.log("aaa")

    chat.name = name;

    console.log("sdfsd")

    const x = await chat.save();

    console.log(x)

    emitEvent(req,REFETCH_CHATS,chat.member,"group renamed")

    console.log("sdddddddd")
    
    return (res.status(200).json({
        success : true,
        message : "Group renamed successfully"
    }))

}


const deleteChat = async(req,res,next)=>{
      

    const chatId = req.params.id


    const chat = await Chat.findById(req.params.id);


    if(!chat) return next (new ErrorHandler(400,"Group Not found"))


    const member = chat.member;

    //---------------------------

    if(chat.groupChat && chat.creator.toString()!==req.user.toString()){

        return next(new ErrorHandler(403,"Only admins can delete a chat"))

    }

    //---------------------------

    if(!chat.groupChat && !chat.member.includes(req.user.toString())){
        return next(new ErrorHandler(403,"You are not allowed to delete the chat"))
    }

    //--------------------------- delete all the messages from the cloudinary and all the non-attachments message from the database
    const public_ids = [];

    const messageWithAttachments = await Message.find({
        chat : chatId,
        attachments : {$exists : true, $ne : []}
    })

    messageWithAttachments.forEach(({attachment})=>{
        attachment.forEach(({public_id})=>{
            public_ids.push(public_id);
        })
    })

    await Promise.all([
        //delete files from cloudinary
        deleteFilesFromCloudinary(public_ids),
        chat.deleteOne(),
        Message.deleteMany({chat:chatId})
    ])
    
    emitEvent(req,REFETCH_CHATS,member);

    return (res.status(200).json({
        success : true,
        message : "chat deleted successfully"
    }))

}

//------------------------

const getMessages = async(req,res,next)=>{
      

    
    const chatId = req.params.id

    const resultPerPage = 20;

    const {page = 1} = req.query;

    const skip = (page-1)*resultPerPage;


    const chat = await Chat.findById(chatId);

    if(!chat){return next(new ErrorHandler(404,"Chat Not found"))}

    if(!chat.member.includes(req.user.toString())){ return next(new ErrorHandler(403,"You are not a part of this chat"))}

    const [messages,totalMessagesCount] = await Promise.all([await Message.find({chat:chatId}).sort({createdAt:-1}).skip(skip).limit(resultPerPage).populate("sender","name").lean(), Message.countDocuments({chat:chatId})])

    const totalPages = Math.ceil(totalMessagesCount/resultPerPage)||0

    return (res.status(200).json({
        success : true,
        message : messages.reverse(),
        totalPages
    }))

}
export {newGroupChat,deleteChat,getMyChats,getChatDetails,getMyGroups,addMembers,removeMembers,leaveGroup,sendAttachments,renameGroup,getMessages};   