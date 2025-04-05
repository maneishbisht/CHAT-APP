import { Avatar, Button, Dialog, DialogTitle, List, ListItem, Skeleton, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { React, memo } from 'react';
import { sampleNotifications } from "../../constants/sampleData";
import { setIsNotification } from '../../redux/reducer/misc';
import { useDispatch, useSelector } from 'react-redux';
import { useAcceptFriendRequestMutation, useGetNotificationQuery } from '../../redux/api/api';
import { useErrors } from '../../hooks/hook';





const Notifications = () => {

  const {isLoading,data,error,isError} = useGetNotificationQuery();

  useErrors([{error,isError}])

  const {isNotification} = useSelector((state)=>state.misc)
  const dispatch = useDispatch();

  const [acceptRequest] = useAcceptFriendRequestMutation()

  const friendRequestHandler = async({_id,accept})=>{
    dispatch(setIsNotification(false))
    try{
      const res = await acceptRequest({requestId:_id, accept})
      console.log(res);
      if(res.data?.success){
        console.log("USE SOCKET HERE")
      }
      else
      {
        console.log("SOMETHING WENT WRONG")
      }
    }catch(error){
      console.log(error);
    }
  }

  const onCloseHandler = ()=>{
    dispatch(setIsNotification(false)) 
  }


  return (
    <div>
      <Dialog open = {isNotification} onClose = {onCloseHandler}>
        <Stack p = {{xs:"1rem", sm: "2rem"}} maxWidth = {"25rem"}>
          <DialogTitle> Notification </DialogTitle>
          {isLoading?<Skeleton/>:<>
          {
            (data?.allRequests.length > 0) ?<>
            <List>
            {data.allRequests.map(({sender,_id})=>{
              return(
                <NotificationItem sender={sender} _id = {_id} handler = {friendRequestHandler} key = {_id} />
              )
            })}
            </List>
            </>:<Typography textAlign = {"center"}> No notifications </Typography>
          }
          </>}
        </Stack>
      </Dialog>
    </div>
  )
}



const NotificationItem = memo(({sender,_id,handler})=>{

const {name,avatar} = sender;

  return (
  <div>
  <ListItem>
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"} width={"100%"}>
          <Avatar src = {avatar}/>
          <Typography variant = "body1" sx = {{ flexGlow : 1, display : "-webkit-box",WebkitLineClamp : 1, WebkitBoxOrient : "vertical",overflow:"hidden", textOverflow : "ellipisis"}}>{ `${name} sent you a friend request`}</Typography>
          <Stack direction = {{xs : "column",sm : "row"}}>
          <Button onClick = {()=>{return handler({_id,accept:true})}}>ACCEPT</Button>
          <Button color = "error" onClick = {()=>{return handler({_id,accept:false})}}>REJECT</Button>
         </Stack>
      </Stack>
  </ListItem>
</div>)
})

export default Notifications
