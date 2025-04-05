import {Add as AddIcon, Remove as RemoveIcon} from '@mui/icons-material'
import  {ListItem, Avatar, IconButton, Typography,}  from '@mui/material'
import { Stack } from '@mui/system'
import {React,memo,useState} from 'react'
import {transformImage} from "../../lib/features";
import { bgGradient } from '../../constants/color'

const UserItem = ({user,handler, handlerIsLoading = false,isAdded=false,styling = {}}) => {

    const [added,setAdded] = useState(isAdded);

    const clickHandler = ()=>{
        handler(_id),
        setAdded((prev)=>!prev);
        
    }
    const {avatar,name,_id} = user;
    return (
    <div>
        <ListItem sx = {{ width : "100%" ,backgroundColor : `white`, borderRadius : "1rem"}}>
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} width={"100%"} {...styling}> 
                <Avatar src = {avatar?transformImage(avatar?.url):'https://www.w3schools.com/howto/img_avatar.png'}/>
                <Typography variant = "body1" sx = {{ flexGlow : 1, display : "-webkit-bod",WebkitLineClamp : 1, WebkitBoxOrient : "vertical",overflow:"hidden", textOverflow : "ellipisis"}}>{name}</Typography> 
 

                <IconButton size = "small" sx = {{bgcolor : added?"error.main":"primary.main",color : "white", "&:hover":{bgcolor: isAdded?"error.dark":"primary.dark",}}} onClick = {clickHandler} disabled = {handlerIsLoading}>
                    {
                        added?<RemoveIcon/>:<AddIcon/>
                    }
                </IconButton>
            </Stack>
        </ListItem>
    </div>
  )
}

export default memo(UserItem)
