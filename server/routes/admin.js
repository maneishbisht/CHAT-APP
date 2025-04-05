import express from "express";
import { adminLoginValidator,validateHandler } from "../lib/validator.js";
import {allUsers,allChats,getAdminData,adminLogout,adminLogin,allMessages, getDashBoardStats} from "../controllers/admin.js";
import { adminOnly } from "../middlewares/auth.js";
const app = express();


app.post("/verify",adminLoginValidator(),validateHandler,adminLogin);
app.get("/logout",adminLogout);

// Admin only routes now : //

app.use(adminOnly)
app.get("/getAdmin", getAdminData);

app.get("/users",allUsers);
app.get("/chats",allChats);
app.get("/messages",allMessages);
app.get("/stats",getDashBoardStats);
export default app;