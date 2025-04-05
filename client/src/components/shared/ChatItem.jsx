import {React,memo} from 'react';
import { Link } from '../styles/StyledComponents';
import { Box, Stack } from '@mui/system';
import { Typography } from '@mui/material';
import {bgGradient} from '../../constants/color';
import AvatarCard from '../specific/AvatarCard';
const ChatItem = ({avatar=[],name,_id,groupChat=false,sameSender,isOnline,newMessageAlert,index=0,handleDeleteChat}) => {;
  
  return (
    <Link style = {{backgroundImage : `${bgGradient}`,borderRadius : "1rem"}}to = {`/chats/${_id}`} onContextMenu = {(e)=>handleDeleteChat(e,_id,groupChat)}>
        <div style = {{display : "flex",alignItems : "center", borderRadius : "1rem", padding : "2rem", gap : "1rem",backgroundColor : sameSender?"black":"unset", color : sameSender?"white":"unset",position : "relative"}}>
            <AvatarCard avatar = {avatar}/> 
              <Stack> 
                <Typography>{name}</Typography>
                {newMessageAlert?(<Typography>{newMessageAlert.count} new Message</Typography>):<></>}
                
              </Stack>
            {isOnline && <Box sx = {{width : "10px",height : "10px",borderRadius : "50%", backgroundImage : sameSender?`${bgGradient}`:"black", position : "absolute", top : "50%", right : "1rem", transform : "translative(-50%)"}}/>}
          </div>
    </Link>
  )
}

export default memo(ChatItem)
