import { Close as CloseIcon,ExitToApp as ExitToAppIcon,ManageAccounts as ManageAccountsIcon, Dashboard as DashboardIcon, Groups as GroupsIcon, Menu as MenuIcon, Message as MessageIcon } from "@mui/icons-material"
import { Drawer, Grid, IconButton, Stack, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useState } from 'react'
import {useLocation,Link as LinkComponent, Navigate, useNavigate} from 'react-router-dom'
import { bgGradient, grayColor } from '../../constants/color'
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../redux/thunks/admin"

const Sidebar = ({w = "100%"})=>{

    const dispatch = useDispatch();


    const Link = styled(LinkComponent)`
    text-decoratin : none;
    border-radius : 2rem;
    padding : 1rem 2rem;
    color : black;
    &:hover {color : rgba(0,0,0,0.54);}`

    const location = useLocation()

    const logoutHandler = ()=>{
      dispatch(adminLogout());
    }


    const adminTabs = [
      {
          name : "Dashboard",
          path : "/admin/dashboard",
          icon : <DashboardIcon/>
      },   
      {
          name : "User",
          path : "/admin/users",
          icon : <ManageAccountsIcon/>
      },   
      {
          name : "Chat",
          path : "/admin/chats",
          icon : <GroupsIcon/>
      },   
      {
          name : "Message",
          path : "/admin/messages",
          icon : <MessageIcon/>
      },]

    return(
            <Stack width = {w} direction = {"column"} p = {"3rem"} spacing = {"3rem"} >

              <Typography variant = {"h5"} textTransform={"uppercase"}>CHATTU APP</Typography>
              <Stack spacing = {"1rem"}>

                {
                  adminTabs.map((tab)=>{
                    return(
                  <Link key = {tab.path} to = {tab.path} sx = {location.pathname ===tab.path && { bgcolor : "black", color : "white", ":hover":{color : "white"}}}>
                      <Stack direction = {"row"} alignitem = {"center"} spacing = {"1rem"}>
                        {tab.icon}
                      </Stack>
                      <Typography>{tab.name}</Typography>
                  </Link>)

                  })
                }

                    <Link onClick = {logoutHandler}>
                      <Stack direction = {"row"} alignitem = {"center"} spacing = {"1rem"}>
                        <ExitToAppIcon/>
                      </Stack>
                      <Typography fontSize = {"1.2rem"}> LOGOUT </Typography>
                    </Link>

              </Stack>
            </Stack>   
    
          )
}

const AdminLayout = ({children}) => {

  const {isAdmin} = useSelector((state)=>state.auth);

  const navigate = useNavigate();

  if(!isAdmin){
      navigate("/admin");
   }

  const [isMobile,setIsMobile] = useState(false)


  const handleMobile = ()=>{
    setIsMobile((prev)=>!prev);
  }


  const handleClose = ()=>{setIsMobile(false)}




  return (
    <Grid container minHeight = {"100vh"}>

        <Box sx = {{display : {xs : "block", md : "none"},position : "fixed", right : "1rem", top : "1rem"}}>
          <IconButton onClick = {handleMobile}>
            
            {
              isMobile? <CloseIcon/>:<MenuIcon/>
            }

          </IconButton>
        </Box>

        <Grid item md = {4} lg = {3} sx  = {{display : {xs : "none", sm : "block"}}}>
            <Sidebar/>
        </Grid>
        <Grid item xs = {12} md = {8} lg = {9} sx  = {{backgroundImage : `${bgGradient}`,display : {xs : "block"}}} >
            {children}
        </Grid>
    
      <Drawer open = {isMobile} onClose = {handleClose}>
            <Sidebar w = {"50vw"}/>
      </Drawer>


    </Grid>
  )
}

export default AdminLayout