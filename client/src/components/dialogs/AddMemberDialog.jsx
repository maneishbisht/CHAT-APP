import { Button, Dialog, DialogTitle, Skeleton, Typography } from '@mui/material'
import { Stack } from '@mui/system'
import UserItem from "../shared/UserItem";
import {React,useState} from 'react';
import { useAsyncMutation, useErrors } from '../../hooks/hook';
import { useAddGroupMemberMutation, useAvailableFriendsQuery } from '../../redux/api/api';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAddMember } from '../../redux/reducer/misc';
const AddMemberDialog = ({handleClose,chatId}) => {
const dispatch = useDispatch();

const [addMembers,isLoadingAddMember] = useAsyncMutation(useAddGroupMemberMutation)
const {isAddMember}=useSelector((state)=>state.misc);
const {isLoading,data,isError,Error} = useAvailableFriendsQuery(chatId)

useErrors([{isError,Error}])

const [selectedMembers,setSelectedMembers] = useState([])

const selectMemberHandler = (id)=>{

    //const myMembers = selectedMembers.includes(id)?(selectedMembers.filter((i)=>i!==id)
    setSelectedMembers((prev)=>(prev.includes(id)?(prev.filter((i)=>i!==id)):[...prev,id]));
}


const closeHandler = ()=>{
    setSelectedMembers([])
    dispatch(setIsAddMember(false))
    handleClose();
}
 

const addMemberSubmitHandler = ()=>{
    addMembers("Adding Members...",{members : selectedMembers,chatId})
    closeHandler()
}


  return (
    <Dialog open={isAddMember} onClose = {handleClose}>
        <Stack p = {"2rem"} width = {"20rem"} spacing = {"2rem"}>
            <DialogTitle>Add Member</DialogTitle>
            <Stack spacing = {"1rem"}>
                {
                   isLoading?<Skeleton/>:(data?.friends?.length>0? (data?.friends?.map((i)=>{
                        return (
                            <UserItem key = {i._id} user = {i} handler = {()=>{selectMemberHandler(i._id)}} isAdded = {selectedMembers.includes(i._id)}/>
                        )
                    })):(<Typography textAlign = {"center"}>No Friends Exist</Typography>))
                }
            </Stack>
                <Stack direction = {"row"} alignItems = {"center"} justifyContent={"space-evenly"}>
                <Button color = "error" onClick = {closeHandler}> Cancel </Button>
                <Button variant = "contained" disabled = {isLoadingAddMember} onClick = {addMemberSubmitHandler}>Submit Changes</Button>
                </Stack>
            
        </Stack>
    </Dialog>
  )
}

export default AddMemberDialog
