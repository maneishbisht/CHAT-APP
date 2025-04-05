import React from 'react'
import { Stack } from '@mui/system'
import { bgGradient } from '../../constants/color';
import ChatItem from '../shared/ChatItem';
const Chatlist = ({w="100%",chats,chatId,onlineUsers=[],newMessagesAlert=[],handleDeleteChat}) => {
  return (
    <Stack width = {w} sx ={{ direction : "column", overflow  : "auto", height :"100%", backgroundImage :`${bgGradient}`, borderRadius : "1rem"}}>
      {
        chats?.map((data,index)=>
          {
            const {avatar,name,_id,groupChat,members} = data;
            const newMessageAlert = newMessagesAlert?.find((item)=>(item.chatId===_id));
            const isOnline = members?.some((member)=>onlineUsers.includes(member));
            const sameSender = (chatId===_id);
            return < ChatItem newMessageAlert = {newMessageAlert} isOnline = {isOnline} avatar = {avatar} name = {name} _id = {_id} key = {_id} groupChat = {groupChat} sameSender = {sameSender} index = {index} handleDeleteChat = {handleDeleteChat}/>
          }
        )
      }
    </Stack>
  )
}

export default Chatlist
