import { Avatar, Button, Dialog, DialogTitle, List, ListItem, Skeleton, TextField, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { React, memo, useState } from 'react';
import { sampleUsers } from '../../constants/sampleData';
import UserItem from '../shared/UserItem';
import { useInputValidation } from '6pp';
import { useAsyncMutation } from '../../hooks/hook';
import { useSelector,useDispatch } from 'react-redux';
import { setIsNewGroups } from '../../redux/reducer/misc';
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../redux/api/api';
import { useErrors } from '../../hooks/hook';


const NewGroup = () => {


  const {isError,isLoading,error,data} = useAvailableFriendsQuery();

  const [newGroup,isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  console.log(data);

  const errors = [{isError,error}]
  
  useErrors(errors)
  


  const {isNewGroups} = useSelector((state)=>state.misc);
  const dispatch = useDispatch();

  const dialogCloseHandler = ()=>{
    dispatch(setIsNewGroups(false))
  }

  const submitHandler = ()=>{
    if(!groupName.value)
      {
        console.log("Group Name is required")
      }
    if(selectedMembers.length<2)
      {
        console.log("At least 3 members must be selected")
      }
      
    newGroup("Creating new group..",{name:groupName.value,member:selectedMembers})

    dialogCloseHandler();
  }




  const closeHandler = ()=>{
    console.log("Closed");
    dialogCloseHandler();
  } 



  const groupName = useInputValidation("");

  const [selectedMembers,setSelectedMembers] = useState([])
  
  const selectMemberHandler = (id)=>{
   setSelectedMembers((prev)=>(prev.includes(id)?(prev.filter((i)=>i!==id)):[...prev,id]));
  }



  console.log(selectedMembers)  
  return (
    <div>
      <Dialog open = {isNewGroups} onClose = {dialogCloseHandler}>
        <Stack p = {{xs:"1rem", sm: "2rem"}} width = {"25rem"} spacing  = {"2rem"}>
          <DialogTitle textAlign={"center"} variant='h4'> NEW GROUP </DialogTitle>
          <TextField label = "Group Name" value ={groupName.value} onChange={groupName.changeHandler}/>
          <Typography>Members</Typography>
         
         <Stack>
          {isLoading?(<Skeleton/>):
            data?.friends?.map((i)=>{
              return(
                <UserItem user = {i} key= {i._id} handler = {selectMemberHandler} isAdded = {selectedMembers.includes(i._id)}/>
              )
            })  
          }        
         </Stack>

          <Stack justifyContent={"space-around"} direction = {"row"}>
            <Button variant = "contained" color = "error" onClick = {closeHandler}> Cancel </Button>
            <Button variant = "contained" size = "large" onClick = {submitHandler} disabled = {isLoadingNewGroup}> Create </Button>
          </Stack>

        </Stack>
      </Dialog>
    </div>
  )
}

export default NewGroup
