import { AudioFile as AudioFileIcon,UploadFile as UploadFileIcon,VideoFile as VideoFileIcon ,Image as ImageIcon } from '@mui/icons-material';
import { ListItemText, Menu, MenuItem,MenuList,Tooltip} from '@mui/material';
import {React,useRef} from 'react';
import { useSelector,useDispatch} from 'react-redux';
import { useSendAttachmentsMutation } from '../../redux/api/api';
import { setUploadingLoader } from '../../redux/reducer/misc';
//



const FileMenu = ({anchor,handler,chatId}) => {
  
  const dispatch = useDispatch();

  const [sendAttachments] = useSendAttachmentsMutation()

  const fileChangeHandler = async(e,key)=>{  

    const files = Array.from(e.target.files);

    if(files.length<=0){return;}
    if(files.length>5){console.log("MAXIMUM 5 files can be send at a time")}

    dispatch(setUploadingLoader(true));
    handler();

    try{

      const myForm = new FormData();
      
      myForm.append("chatId", chatId);

      files.forEach((file)=>myForm.append("files",file))

      console.log(myForm)
        
      const res = await sendAttachments(myForm);

    if(res.data)
    {
      console.log("Sent Successfully")
    }

    }catch(error){
      console.log("AN ERROR OCCURED")
    }
    finally
    {
      dispatch(setUploadingLoader(false));
    }

  }
  
  const {isFileMenu} = useSelector((state)=>state.misc)

  const imageRef = useRef(null)
  const videoRef = useRef(null)
  const audioRef = useRef(null) 
  const fileRef = useRef(null)

  const selectRef = (ref)=>{
  ref.current?.click();
  }


  return (
    <div style = {{width : "10rem"}}>
      <Menu  anchorEl = {anchor} open = {isFileMenu} onClose = {handler}>
      
      <MenuList>
        
          <MenuItem onClick = {()=>{selectRef(imageRef)}}>
            <Tooltip title = "Image">
              <ImageIcon/>
            </Tooltip>
            <ListItemText style = {{marginLeft : "0.5rem"}}>Image</ListItemText>
            <input ref = {imageRef} type = "file" multiple style = {{display : "none"}} onChange = {(e)=>{fileChangeHandler(e,"Images")}} accept = "image/png,image/jpeg,image/gif"/>
          </MenuItem>
      
          <MenuItem onClick = {()=>{selectRef(audioRef)}}>
            <Tooltip title = "Audio">
              <AudioFileIcon/>
            </Tooltip>
            <ListItemText style = {{marginLeft : "0.5rem"}}>Audio</ListItemText>
            <input type = "file" ref = {audioRef} multiple style = {{display : "none"}} onChange = {(e)=>{fileChangeHandler(e,"Audios")}} accept = "audio/mpeg,audio/wav"/>
          </MenuItem>
   
          <MenuItem onClick = {()=>{selectRef(videoRef)}}>
            <Tooltip title = "Video">
              <VideoFileIcon/>
            </Tooltip>
            <ListItemText style = {{marginLeft : "0.5rem"}}>Video</ListItemText>
            <input type = "file" ref = {videoRef} multiple style = {{display : "none"}} onChange = {(e)=>{fileChangeHandler(e,"Videos")}} accept = "video/mp4,video/webm,video/ogg"/>
          </MenuItem>

          <MenuItem onClick = {()=>{selectRef(fileRef)}}>
            <Tooltip title = "Files">
              <UploadFileIcon/>
            </Tooltip>
            <ListItemText style = {{marginLeft : "0.5rem"}}>Files</ListItemText>
            <input type = "file" ref = {fileRef} multiple style = {{display : "none"}} onChange = {(e)=>{fileChangeHandler(e,"Files")}} accept = "*"/>
          </MenuItem>

      </MenuList>

    </Menu>
    </div>
  )
}

export default FileMenu
