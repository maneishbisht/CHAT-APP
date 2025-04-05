import { Avatar, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react'
import {Face as FaceIcon,AlternateEmail as UserNameIcon,CalendarMonth as CalendarIcon} from '@mui/icons-material';
import moment from 'moment';
//import { transformImage } from '../../lib/features';
const Profile = ({User}) => {


  return (
    <Stack spacing = {"2rem"} alignItems = {"center"} direction = {"column"} borderRadius = {"1rem"} sx = {{margin : "1rem",padding : "1rem"}}>
      <Avatar  src = {User?.avatar.url} sx = {{ width : 200, height : 200, objectFit : "contain", marginBottom : "1rem", border : "5px solid white" }}/>
      <ProfileCard Icon = {FaceIcon} heading = {"Name"}text = {User?.name}/>
      <ProfileCard Icon = {UserNameIcon} heading = {"UserName"}text = {User?.username}/>
      <ProfileCard Icon = {CalendarIcon} text = {moment(User?.createdAt).fromNow()} heading = {"Joined"}/>
    </Stack>
  ) 
}

const ProfileCard = ({text,Icon,heading})=><Stack direction = {"row"} alignItems = {"center"} spacing = {"1rem"} color = {"white"} textAlign = {"center"}>
{Icon && <Icon/>}
        <Stack>
            <Typography variant = "body1">{text}</Typography>
            <Typography variant = "caption" color = {"grey"}>{heading}</Typography>
        </Stack>
</Stack>;

export default Profile
 