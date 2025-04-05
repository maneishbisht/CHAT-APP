import { Avatar, AvatarGroup } from '@mui/material';
import {Box,Stack}from '@mui/system';
import React from 'react';
import {transformImage} from "../../lib/features";


//Todo transform

//const AvatarCard = ({avatar=[],max=4}) => {
//  return (
//    <Stack direction = {"row"} spacing = {"0.5 rem"}>
//      <AvatarGroup max = {max} sx = {{position : "relative"}}>
//        <Box width = {"5rem"} height = {"3rem"} >
//            {
//            avatar?.map((i,index)=>(
//            <Avatar key = {Math.random()*100} src={i?transformImage(i):'https://www.w3schools.com/howto/img_avatar.png'} alt = {`Avatar ${index}`} sx = {{ width : "3rem",height : "3rem", position : "absolute",left :"1rem"}}/>
//            ))
//            }
//        </Box>
//      </AvatarGroup>
//    </Stack>
//  )
//} 

const AvatarCard = ({ avatar = [], max = 4 }) => {
  return (
    <Stack direction={"row"} spacing={"0.5 rem"}>
      <AvatarGroup max={max} sx={{ position: "relative" }}>
        <Box width={"5rem"} height={"3rem"}>
          {
            avatar?.map((i, index) => (
              <Avatar 
                key={Math.random() * 100} 
                src={typeof i === 'string' && i ? transformImage(i) : 'https://www.w3schools.com/howto/img_avatar.png'} 
                alt={`Avatar ${index}`} 
                sx={{ width: "3rem", height: "3rem", position: "absolute", left: "1rem" }} 
              />
            ))
          }
        </Box>
      </AvatarGroup>
    </Stack>
  )
}

export default AvatarCard
