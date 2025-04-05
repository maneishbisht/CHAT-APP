import express from "express";
import {renameGroup,newGroupChat,getMyChats,deleteChat,getMyGroups,addMembers,leaveGroup,removeMembers,sendAttachments,getChatDetails,getMessages} from "../controllers/chat.js";
import {isAuthenticated} from "../middlewares/auth.js";
import {attachmentsMulter} from "../middlewares/multer.js";
import {newGroupValidator,renameGroupValidator,chatIdValidator,sendAttachmentsValidator,addMemberValidator,validateHandler} from "../lib/validator.js"
const app = express.Router();



app.use(isAuthenticated);

app.post("/new",newGroupValidator(),validateHandler,newGroupChat)
app.get("/getMyChat",getMyChats)
app.get("/getMyGroups",getMyGroups)
app.put("/addMembers",addMemberValidator(),validateHandler,addMembers)
app.delete("/removeMembers",removeMembers)
app.delete("/leaveGroup/:id",chatIdValidator(),validateHandler,leaveGroup)

//Attachments required

app.post("/message",attachmentsMulter,sendAttachmentsValidator(),validateHandler,sendAttachments)
app.get("/message/:id",chatIdValidator(),validateHandler,getMessages)



app.route("/:id").get(chatIdValidator(),validateHandler,getChatDetails).put(renameGroupValidator(),validateHandler,renameGroup).delete(chatIdValidator(),validateHandler,deleteChat)



export default app; 