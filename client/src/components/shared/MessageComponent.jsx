import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import moment from 'moment';
import {React,memo} from 'react'
import { fileFormat, transformImage } from '../../lib/features';
import renderAttachment from './RenderAttachment';
import {bgGradient} from '../../constants/color';
const MessageComponent = ({message,user}) => {
  
    const {attachment =[],content,_id,sender,chat,createdAt} = message; 
    const sameSender = sender?._id === user?._id;
    const timeAgo = moment(createdAt).fromNow()

    return (
      
    <div style = {{
    alignSelf : sameSender?"flex-end" : "flex-start",
    backgroundColor :"black",
    backgroundImage : `${bgGradient}`,
    borderRadius : "1rem",   
    padding : "0.5rem", 
    width : "fit-content",
    }}>

      {!sameSender && (<div style = {{borderRadius : "1rem", backgroundColor : "white"}}><Typography borderRadius = {"10px"} color = {"black"} fontWeight ={"600"} variant= {"caption"}  margin = {"0.5rem"}  display={"flex"}><span style = {{ padding : "0.5rem"}}> {sender.name} </span></Typography></div>)}
      {content && (<Typography borderRadius = {"10px"}><span style = {{ backgroundColor : "black", borderRadius : "1rem",color : "white",padding : "0.5rem" }}>{content}</span></Typography>)}   
      
      {
          attachment.length > 0 && attachment.map((media,index)=>{

          const url = media.url;
          const file= fileFormat(url)

          return <Box key = {index} sx = {{borderRadius : "10px", backgroundColor : "white" ,margin: "0.5rem", padding:"5 rem", display:"flex" }}>
            <a href={url} target = "blank" download style = {{color : "black"}}>
              {renderAttachment(file,url)}
            </a>
          </Box>

          })
      }

      {
        <Typography variant = "caption" color = "text.secondary"><span style = {{color : "white",padding : "0.5rem"}}>{timeAgo}</span></Typography>
      }

    </div>
  ) 
}

export default memo(MessageComponent)
