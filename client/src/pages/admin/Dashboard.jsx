import {React,useEffect} from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { Container, Stack } from '@mui/system'
import { Paper, Typography,Box } from '@mui/material'
import { AdminPanelSettings as AdminPanelSettingsIcon, Person as PersonIcon,Group as GroupIcon, Notifications as NotificationsIcon, Message as MessageIcon} from '@mui/icons-material'
import moment from 'moment'
import {SearchField,CurveButton} from '../../components/styles/StyledComponents'
import { DoughnutChart, LineChart } from '../../components/specific/Charts'
import {useFetchDataQuery} from "../../redux/api/api";
import server from "../../constants/config"
import {Loaders} from "../../components/layout/Loaders"
import {useErrors} from "../../hooks/hook"

const dashboard = () => {
 
  

  const {data,isLoading,error,isError} = useFetchDataQuery(`${server}/admin/stats`,"stats");
  
  const {stats} = data||{};
  useErrors([{isError:error,error:error}])

  const Appbar = <Paper elevation = {3} sx = {{padding : "2rem", margin : "2rem 0", borderRadius : "1rem"}}>
      <Stack direction = {"row"} spacing = {"1rem"}>
        <AdminPanelSettingsIcon sx = {{fontSize : "3rem"}}/>
        <SearchField placeholder = "Search"/>
        <CurveButton>Search</CurveButton>
        <Box flexGrow = {1}/>
        <Typography display ={{xs : "none",lg : "block"}} color = {"rgba(0,0,0,0.7)"} textAlign={"center"}>{moment().format("MMMM Do YYYY, h:mm:ss a")}</Typography>
        <NotificationsIcon/>
      </Stack>
              </Paper>

    const Widget = ({title,value,Icon})=>{
    return isLoading?<Loaders/>:(
          <Paper sx = {{padding : "2rem", margin : "2rem 0", borderRadius : "1rem", width : "20rem"}}>
            <Stack alignItems={"center"} spacing = {"1rem"}>
                  <Typography sx = {{color : "rgba(0,0,0,0.7)", borderRadius : "50%", border : "5px solid rgba(0,0,0,0.9)", width : "5rem", height : "5rem", display :"flex", justifyContent : "center", alignItems : "center"}}>{value}</Typography>
                  <Stack direction = {"row"} spacing = {"1rem"} alignItems={"center"}>
                  {Icon}
                  <Typography sx = {{color : "rgba(0,0,0,0.7)", borderRadius : "50%", border : "5px solid rgba (0,0,0,0.9)" ,width : "5rem", display : "flex", justifyContent : "center", alignItems : "center"}}>{title}</Typography>
                  </Stack>
            </Stack>
          </Paper>
          )
      }

const Widgets = <Stack direction = {{xs : "column",sm : "row"}} spacing = {"2rem"} justifyContent={"space-between"} alignItems={"center"} margin = {"2rem 0"}>
    <Widget title = {"Users"} value = {stats?.usersCount||0} Icon = {<PersonIcon/>}/>
    <Widget title = {"Chats"} value = {stats?.totalChatCount||0} Icon = {<GroupIcon/>}/>
    <Widget title = {"Messages"} value = {stats?.messagesCount||0} Icon = {<MessageIcon/>}/>
  </Stack>



return (

<AdminLayout>

    <Container component = {"main"}>

          {Appbar}

          <Stack direction = {{xs : "column" , lg : "row"}} spacing  = {"2rem"} overflow = "auto">
            
            <Paper elevation = {3} sx = {{padding : "2rem 3.5rem", borderRadius : "1rem", width : "100%", maxWidth : "45rem"}}>
              <Typography variant = "h4" margin = {"2rem 0"}> Last Messages </Typography> 
                <LineChart value = {stats?.messagesChart||[]}/>
            </Paper>


            <Paper elevation = {3} sx = {{padding : "1rem", borderRadius : "1rem",display : "flex", justifyContent : "center",alignItems : "center", width : {xs : "100%", sm : "50%"}, position : "relative", width : "100%", maxWidth : "25rem"}}>
              <DoughnutChart value={[(stats?.totalChatCount-(stats?.groupsCount||0))||0,stats?.groupsCount||0]} labels = {["Single Chats", "Group Chats"]}/>
              <Stack position = {"absolute"} direction = {"row"} justifyContent={"center"} alignItems={"center"} spacing = {"0.5rem"} width = {"100%"} height = {"100%"}>
                <GroupIcon/>
                <Typography> vs </Typography>
                <PersonIcon/>
              </Stack>
            </Paper>

          </Stack>

          {Widgets}


    </Container>

</AdminLayout>
  )
}

export default dashboard
 