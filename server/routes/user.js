import express from "express";
import {login,home,newUser, getMyProfile,logout,searchUser,getAllNotifications,acceptRequest,sendFriendRequest, getMyFriends} from "../controllers/user.js"
import {singleAvatar} from "../middlewares/multer.js"
import {isAuthenticated} from "../middlewares/auth.js";
import {loginValidator,acceptRequestValidator,registerValidator,sendRequestValidator,validateHandler} from "../lib/validator.js";
const app = express.Router();

app.post("/login",loginValidator(),validateHandler,login)
app.post("/new",singleAvatar,registerValidator(),validateHandler,newUser)
app.get("/logout",logout)

//NEED AUTHENTICATION//
app.use(isAuthenticated);

app.get("/",home)
app.get("/me",getMyProfile) 
app.get("/search",searchUser)
app.put("/sendRequest",sendRequestValidator(),validateHandler,sendFriendRequest)
app.put("/acceptRequest",acceptRequestValidator(),validateHandler,acceptRequest)
app.get("/notifications",getAllNotifications)
app.get("/friends",getMyFriends)

export default app; 