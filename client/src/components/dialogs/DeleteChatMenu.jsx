import { Menu, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import {React,useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setIsDeleteMenu } from '../../redux/reducer/misc'
import { Delete, ExitToApp } from '@mui/icons-material'
import {useNavigate } from 'react-router-dom'
import { useAsyncMutation } from '../../hooks/hook'
import { useDeleteChatMutation, useLeaveGroupMutation } from '../../redux/api/api'

const DeleteChatMenu = ({deleteMenuAnchor}) => {

    const navigate = useNavigate();
    const dispatch = useDispatch()

    const [deleteChat,_,deleteChatData] =useAsyncMutation(useDeleteChatMutation)
    const [leaveGroup,__,leaveGroupData] = useAsyncMutation(useLeaveGroupMutation)

    const {isDeleteMenu,selectedDeleteChat} = useSelector((state)=>state.misc)
    const isGroup = selectedDeleteChat.groupChat;


    useEffect(()=>{
        if(deleteChatData){
            navigate("/")
        }
    },[deleteChatData,leaveGroupData])

    const closeHandler  = ()=>{
        dispatch(setIsDeleteMenu(false))
        deleteMenuAnchor.current = null;
    }

    const leaveGroupHandler = ()=>{
        closeHandler();
        leaveGroup("leaving group...",selectedDeleteChat.chatId)
    
    }

    const deleteChatHandler= ()=>{
        closeHandler();
        deleteChat("Deleting Chat...",selectedDeleteChat.chatId)
    }


    
    return (
    <Menu open = {isDeleteMenu} onClose = {closeHandler} anchorEl = {deleteMenuAnchor.current} anchorOrigin = {{vertical:"bottom",horizontal :"right"}} transformOrigin = {{vertical : "center",horizontal : "left"}}>
        <Stack sx = {{width : "10rem",padding : "0.5rem",cursor : "pointer"}} direction = {"row"} alignItems = {"center"} spacing = {"0.5rem"} onClick={isGroup?leaveGroupHandler:deleteChatHandler}>
        {selectedDeleteChat.groupChat?(<><ExitToApp/><Typography>Leave Group</Typography></>):(<><Delete/><Typography>Delete Chat</Typography></>)}
        </Stack>
    </Menu>
  ) 
}

export default DeleteChatMenu
