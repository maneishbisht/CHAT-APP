import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import {createServer} from "http";
import {Server} from "socket.io";
import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import chatRoute from "./routes/chat.js";
import userRoute from "./routes/user.js";
import adminRoute from "./routes/admin.js";
import {corsOptions} from "./constants/config.js"
import { User } from "./models/user.js";
import { Chat } from "./models/chat.js";
import { Message } from "./models/message.js";
import {createGroupChats,createSingleChats,createMessages,createMessagesInAChat} from "./seeders/user.js";
import { connectDB } from "./utils/features.js";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT} from "./constants/events.js";
import {v4 as uuid} from "uuid";
import {v2 as cloudinary} from "cloudinary";
import { socketAuthenticator } from "./middlewares/auth.js";
import { getSockets } from "./lib/helper.js";
dotenv.config({
    path : "./.env"
});



const mongoURI = process.env.MONGO_URI;
export const adminSecretKey = process.env.ADMIN_SECRET_KEY||'asdfaaaaaaaaaaaaadsfffdddddddddd'
const port = (process.env.port||3000);

export const userSocketIds = new Map();


const app = express();


const server = createServer(app);

const io = new Server(server,{cors : corsOptions});
app.set("io",io);


app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions))



connectDB(mongoURI)

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})


app.use("/user",userRoute)// INITIALLY ERRORMIDDLEWARE ADDED SEPARATELY
app.use("/chat",chatRoute)
app.use("/admin",adminRoute)





//---------------------------------------------------CREATE AFTER FRONTEND-----------------------//
io.use((socket,next)=>{
    cookieParser()(socket.request,socket.request.res,async(err)=>await socketAuthenticator(err,socket,next))
}) 


io.on("connection",(socket)=>{

    const user = socket.user;
    
    userSocketIds.set(user._id.toString(),socket.id);

    console.log("The socket Id array is like : ",userSocketIds);

    //--------------------------------------------

    socket.on(NEW_MESSAGE,async({chatId,member,message})=>{

        console.log("CREATING THE NEW MESSAGE");

        console.log("Array containing all the sockets is : " , userSocketIds)
        
        const messageForRealTime = {
            content : message,
            _id: uuid(),
            sender : {
                _id :user._id,
                name:user.name
            },
            chat : chatId,
            createdAt : new Date().toISOString()
        }
        
        const messageForDB = {
            content : message,
            sender:user._id,
            chat:chatId,
        }
        

        const membersSocket = getSockets(member,userSocketIds)


        console.log("Chat members are ",membersSocket)

        console.log()

        try{
        await Message.create(messageForDB)
        }
        catch(error){
            console.log(error);
        }

        io.to(membersSocket).emit(NEW_MESSAGE,{chatId,message:messageForRealTime})

        socket.to(membersSocket).emit(NEW_MESSAGE_ALERT,chatId)
        
    })

    //-------------------------------------

    socket.on("disconnect",(socket)=>{
        console.log("Disconnected", socket.id);
        userSocketIds.delete(user._id.toString())
    })
    //--------------------------------------


})


app.use(errorMiddleware);

server.listen({port},()=>{
    console.log(`Hello there this is ${port}`)
}) 


export {cloudinary}