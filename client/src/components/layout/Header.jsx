import { Box } from '@mui/system';
import React, {lazy, Suspense, useState } from 'react'
import { orange,bgGradient } from '../../constants/color'
import { AppBar,Backdrop,Badge,Drawer,IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import { Logout as LogoutIcon,Group as GroupIcon,Menu as MenuIcon,Search as SearchIcon,Add as AddIcon, Notifications as NotificationsIcon} from '@mui/icons-material'
import { Navigate, useParams } from 'react-router-dom';
import { sampleChats } from '../../constants/sampleData';
import { useSelector,useDispatch } from 'react-redux';
import Chatlist from '../specific/Chatlist';
import axios from "axios";
import server from '../../constants/config';
import { userNotExists } from '../../redux/reducer/auth';
import { setIsMobile, setIsNewGroups, setIsNotification, setIsSearch } from '../../redux/reducer/misc';
import { resetNotification } from '../../redux/reducer/chat';
const SearchDialog = lazy(()=>import('../specific/Search'))
const NotificationsDialog = lazy(()=>import("../specific/Notifications"))
const NewGroupDialog = lazy(()=>import("../specific/NewGroup"))

const IconBtn = ({title,icon,onClick,value})=>
  {
    return (
      <Tooltip title = {title}>
            <IconButton color = "inherit" size = "large" onClick = {onClick}>
                {value?(<Badge badgeContent = {value}><>{icon}</></Badge>):<>{icon}</>}
            </IconButton>
            </Tooltip>
    )
  }

const Header = ({onlineUsers=['1','2'],chatId,chats,handleDeleteChat}) => {


  const dispatch = useDispatch()

  const {isMobile} = useSelector((state)=>state.misc)
  const {isSearch} = useSelector((state)=>state.misc)
  const {isNewGroups} = useSelector((state)=>state.misc)
  const {isNotification} = useSelector((state)=>state.misc)
  const {notificationCount} = useSelector((state)=>state.chat)


    const [navigate, setNavigate] = useState(false);
    const params = useParams();
    const openSearchDialog = ()=>{dispatch(setIsSearch(true))}

    const openNewGroup = ()=>{
    console.log("HEY THERE")  
    dispatch(setIsNewGroups(true));
    }

    const openNotification = ()=>{
      dispatch(setIsNotification(true))
      dispatch(resetNotification())
    }
    const navigateToGroup = ()=>{setNavigate(true)}
    
    
    const logoutHandler = async()=>{
      try{
        const {data} = await axios.get(`${server}/user/logout`,{withCredentials:true});
        dispatch(userNotExists());
      }catch(error){
        console.log("Something went Wrong")
      }
    }

    
    const handleMobileOpen = ()=>{dispatch(setIsMobile(true))}
    const handleMobileClose = ()=>{dispatch(setIsMobile(false))}


    if (navigate){
      return <Navigate to ="/groups"/>
    }

  return (
  <>
  
<Box sx = {{flexGrow:1}} height = {"4rem"}>
    <AppBar postion = "static">
      <Toolbar sx={{padding : 0, bgcolor : {bgGradient}}}>

        <Typography variant = "h6" sx = {{padding : 0 , display : {xs: "none",sm : "block"}}}>
            CHATTU 
        </Typography>

        <Box sx = {{ display : {xs: "block", sm : "none"}}}>
            <IconButton color = "inherit" onClick = {handleMobileOpen}>
                <MenuIcon/>
            </IconButton>
        </Box>

        <Box sx = {{flexGrow:1}}/>

        <Box>

            <IconBtn title = {"Search"} icon = {<SearchIcon/>} onClick = {openSearchDialog}/>
            <IconBtn title = {"Group"} icon = {<GroupIcon/>} onClick = {navigateToGroup}/>
            <IconBtn title = {"NewGroup"} icon = {<AddIcon/>} onClick = {openNewGroup}/>
            <IconBtn value = {notificationCount} title = {"Notifications"} icon = {<NotificationsIcon/>} onClick = {openNotification}/>
            <IconBtn title = {"logout"} icon = {<LogoutIcon/>} onClick = {logoutHandler}/>

        </Box>
        
      </Toolbar>
    </AppBar>  
</Box>


{isSearch && (<Suspense fallback = {<Backdrop open={isSearch}/>}> <SearchDialog/> </Suspense> )}

{isNotification && (<Suspense fallback = {<Backdrop open = {isNotification}/>}> <NotificationsDialog/> </Suspense> )}
  
{isNewGroups && (<Suspense fallback = {<Backdrop open = {isNewGroups}/>}> <NewGroupDialog/> </Suspense> )}

<Drawer sx = {{display :{xs:"block", sm : "none"}}} open = {isMobile} onClose = {handleMobileClose}>
<Chatlist onlineUsers = {onlineUsers} chatId = {chatId} chats = {chats} handleDeleteChat = {handleDeleteChat}/>
</Drawer>


</>
)
}




export default Header
