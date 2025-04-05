import {React,useState} from 'react'
import { Dialog, DialogTitle, Input, InputAdornment, List, ListItem, TextField } from '@mui/material'
import { Stack } from '@mui/system'
import{useInputValidation} from "6pp";
import {Search as SearchIcon} from '@mui/icons-material';
import UserItem from '../shared/UserItem';
import {sampleUsers,sampleFriends} from "../../constants/sampleData";
import {setIsSearch } from '../../redux/reducer/misc';
import { useDispatch, useSelector } from 'react-redux';
import { useLazySearchUserQuery, useSendFriendRequestMutation } from '../../redux/api/api';
import { useEffect } from 'react';
import { useAsyncMutation} from '../../hooks/hook';


const Search = () => {
  
  const [searchUser] =  useLazySearchUserQuery();
  const [sendFriendRequest,isLoadingSendFriendRequest,data] = useAsyncMutation(useSendFriendRequestMutation);
  const search = useInputValidation("");
  const [users,setUsers] = useState([])


  useEffect(()=>{


    const timeOutId = setTimeout(()=>{
    searchUser(search.value.toString()).then(({data})=>{
      setUsers(data.users.flatMap(({_id})=>_id))
    }).catch((error)=>{console.log(error)});
    },700)
    
    return ()=>{
      clearTimeout(timeOutId);
    }

  },[search.value])


  const {isSearch} = useSelector((state)=>state.misc);

  const dispatch = useDispatch();

  const searchCloseHandler = ()=>{
    dispatch(setIsSearch(false));
  }

  const addFriendHandler = async(_id)=>{
    sendFriendRequest("Sending Friend Request",{userId:_id});
  }


  return (
    <Dialog open = {isSearch} onClose = {searchCloseHandler}>
      <Stack p= {"2rem"} direction = {"column"} width = {"25rem"}>
        <DialogTitle textAlign = {"center"}>Find People</DialogTitle>
        <TextField label = "Search Here" value = {search.value} onChange={search.changeHandler} variant = "outlined" size = "small" InputProps = {{startAdornment : (<InputAdornment position = "start"><SearchIcon/></InputAdornment>)}}>
        </TextField>
        <List>
          {
            users.map((i)=>{
              return(
                <UserItem user = {i} key = {i._id} handler = {addFriendHandler} handlerIsLoading = {isLoadingSendFriendRequest}/>
              )
            })
          }
        </List>
      </Stack>
    </Dialog>
  )
}

export default Search
