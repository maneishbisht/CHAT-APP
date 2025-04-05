import {React,Suspense,lazy,memo,useEffect,useState} from 'react';
import {Grid,IconButton,SwipeableDrawer as Drawer,Tooltip, Typography, TextField, Button,Backdrop, CircularProgress} from "@mui/material";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Add as AddIcon , Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace as KeyboardBackspaceIcon,Menu as MenuIcon} from "@mui/icons-material";
import { Box, Stack} from '@mui/system';
import {Link} from "../components/styles/StyledComponents"
import AvatarCard from "../components/specific/AvatarCard"
import {sampleChats, sampleUsers} from "../constants/sampleData"
import UserItem from '../components/shared/UserItem';
import { bgGradient } from '../constants/color';
import { useChatDetailsQuery, useRenameGroupMutation,useGetMyGroupsQuery, useRemoveGroupMemberMutation, useAddGroupMemberMutation, useDeleteChatMutation } from '../redux/api/api';
import { useAsyncMutation, useErrors } from '../hooks/hook';
import {Loaders} from "../components/layout/Loaders";
import { useDispatch, useSelector } from 'react-redux';
import { setIsAddMember } from '../redux/reducer/misc';
const ConfirmDeleteDialog = lazy(()=>import("../components/dialogs/ConfirmDeleteDialog"))
const AddMemberDialog = lazy(()=>import("../components/dialogs/AddMemberDialog"))

 
//*GroupList component used 

const GroupsList = ({width = "100%",myGroups= [] ,chatId=""})=>(
  <Stack w = {width} direction = {"column"} sx = {{margin : "1rem"}}>
    {
      myGroups.length>0?(
        myGroups.map((group)=>{ 
          return (
            <GroupListItem key = {group._id} group = {group} chatId = {chatId}/>
          ) 
        })):(
          <Typography textAlign = {"center"} padding = "1rem"> NO GROUPS YET!</Typography>
        )
      }
  </Stack>
)


//*GroupItem component used 

const GroupListItem =memo(({group,chatId})=>{

      const {name,avatar,_id}= group;
      
      return ( 
        <Link  style={{backgroundImage : `${bgGradient}`, padding : "2rem" , borderRadius : "1rem"}} to = {`?group=${_id}`} onClick = {(e)=>{if(chatId ===_id){e.preventDefault()}}}>

        <Stack direction = {"row"} spacing = {"1rem"} alignItems = {"center"}>
          {
            avatar && <AvatarCard avatar = {avatar}/>
          }
          <Typography>{name}</Typography>
        </Stack>

      </Link>)
    })
  

  //--------------------------------------------------------------------------------------------------------------------------------




  //*Main component exported
  
  
  const Group = () => {
    
    const {isAddMember} = useSelector((state)=>state.misc)
    
    const dispatch = useDispatch();
    

    //*State variables and instances of Hooks


    const chatId = useSearchParams()[0].get("group")
    
    const myGroups = useGetMyGroupsQuery("");
   
    const groupDetails = useChatDetailsQuery({chatId,populate:true},{skip:!chatId})
    

    const navigate = useNavigate()
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const [updateGroup,isLoadingGroupName] = useAsyncMutation(useRenameGroupMutation)

    const [groupName,setGroupName] = useState("")
    
    const [isEdit,setIsEdit] = useState(false)
    
    const [groupNameUpdatedValue,setGroupNameUpdatedValue] = useState()

    const [member,setMember] = useState([])

    const [confirmDeleteDialog,setConfirmDeleteDialog] = useState(false)

    const [removeMember,isLoadingRemoveMember] = useAsyncMutation(useRemoveGroupMemberMutation)
    const [deleteGroup,isLoadingDeleteGroup] = useAsyncMutation(useDeleteChatMutation)


    useEffect(()=>{
      if (chatId)
      {
      setGroupName(`Group Name ${chatId}`)
      setGroupNameUpdatedValue (`Group Name ${chatId}`)}
      setIsEdit(false)

      return ()=>{
        setGroupName("")
        setIsEdit(false)
        setGroupNameUpdatedValue("")
      }
  },[chatId,isMobileMenuOpen])

  //*Event Handlers 

  const errors = [{
    isError:myGroups.isError,
    error:myGroups.error
  },
{
  isError:groupDetails.isError,
  error:groupDetails.error
}
]

  useErrors(errors)

  useEffect(()=>{
  if(groupDetails?.data)
    {
      setGroupName(groupDetails.data.chat.name);
      setGroupNameUpdatedValue(groupDetails.data.chat.name);
      setMember(groupDetails.data.chat.member);
    }
  },[groupDetails.data])


  const removeMemberHandler = (userId)=>{
    removeMember("Removing Member",{chatId,userId})
  }

  const navigateBack = ()=>{
    navigate("/")
  }


  const handleMobile = ()=>{
      setIsMobileMenuOpen((prev)=>!prev);
    }


  const handleMobileClose = ()=>{
      setIsMobileMenuOpen(false);
    }


    const updateGroupName = ()=>{
      setIsEdit(false);
      setGroupName(groupNameUpdatedValue)
      updateGroup("Updating Group Name",{chatId,name:groupNameUpdatedValue})
    }

    const openconfirmDeleteHandler = ()=>{
      console.log("openconfirmDeleteHandler")
      setConfirmDeleteDialog(true)
    }


    const closeConfirmDeleteHandler = ()=>{
      console.log("closeConfirmDeleteHandler")
      setConfirmDeleteDialog(false)
    }
  
    const closeAddMemberHandler = ()=>{
      dispatch(setIsAddMember(false))
    }
    
    const openAddMemberHandler = ()=>{ 
      dispatch(setIsAddMember(true));
    }


    const deleteHandler = ()=>
    {
      deleteGroup("Deleting Group...",chatId)
      setConfirmDeleteDialog(false)
    }
    



//* INNER COMPONENTS--------------------------------------------------------------------------------------------------------------------------

  const IconBtns = (
  <>
  <Box sx = {{display : {xs : "block",sm:"none", position : "absolute",right : "1rem", top : "1rem"}}}>
    <Tooltip title = "Menu">
    <IconButton onClick = {handleMobile}>
    <MenuIcon sx = {{color : "white"}}/>
      </IconButton>
    </Tooltip>
  </Box>



  <Tooltip title = "back">
    <IconButton sx = {{position : "absolute",top : "2rem",left : "2rem", bgcolor : "black",color : "white",":hover": {bgcolor : "grey"}}} onClick = {navigateBack}>
      <KeyboardBackspaceIcon/>
    </IconButton>
  </Tooltip>


  </>);

//---------------------------------------------------------------

const GroupName =(
      <Stack width = {"100%"} direction = {"row"} alignItems = {"center"} justifyContent={"center"} spacing={"1rem"} padding = {"3rem"} sx = {{backgroundImage : `${bgGradient}`, borderRadius : "1rem", marginBottom : "1rem"}} >
              { 
                isEdit?(
                <>
                <TextField value = {groupNameUpdatedValue} sx = {{backgroundcolor : "white"}} placeholder = {"Search here"} onChange = {(e)=>{setGroupNameUpdatedValue(e.target.value)}}/>
                <IconButton  sx = {{color :"white"}} onClick = {updateGroupName} disabled = {isLoadingGroupName}>  
                  <DoneIcon/>
                </IconButton>
                </>):(<>        
              <Typography color = {"white"} variant = "h4">{groupName}</Typography>
              <IconButton  sx = {{color :"white"}} onClick = {()=>setIsEdit(true)} disabled = {isLoadingGroupName}>
                  <EditIcon/>
                </IconButton>
                
                </>)
              }
</Stack>
)
  

//------------------------------------------------------------------
const ButtonGroup = (
  <>
    <Stack drection = {{sm : "row", xs : "column-reverse"}} spacing = {"1rem"} p = {{ xs : "0" ,sm : "1rem", md : "1rem 4rem"}}>
      <Button size = "large" sx = {{backgroundImage :`${bgGradient}`, backgroundColor : "white" ,color : "black"}} variant = "contained" startIcon = {<DeleteIcon/>} onClick = {openconfirmDeleteHandler}>Delete Group</Button>
      <Button size = "large" sx = {{backgroundImage :`${bgGradient}`, backgroundColor : "white",  color : "black"}} variant = "outlined" startIcon = {<AddIcon/>} onClick = {openAddMemberHandler}> Add Member</Button>
    </Stack>
  </>
)


//-------------------------------------------------------------------
  //**Main returned jsx component 






  return myGroups.isLoading?(<Loaders/>):(

    <Grid container height = {"100vh"}>
    <Grid item sx = {{display : {xs : "none", sm : "block"}}} sm = {4} backgroundImage={{bgGradient}}> <GroupsList myGroups = {myGroups?.data?.groups}/> </Grid>
    <Grid item xs = {12} sm = {8} sx = {{ backgroundColor : "black", borderRadius : "1rem", display : "flex", flexDirection : "column", alignItems : "center",position : "relative" , padding : "1rem 3rem"}}>
       <>
          {IconBtns}
          {groupName && (
            <>
            {GroupName}
            <Stack  width = {"100%"} sx = {{backgroundImage  : `${bgGradient}`}}  padding = {"1rem"} borderRadius  = {"1rem"}>

            <Typography margin = {"1rem"} alignSelf = {"center"} variant ={"h6"} color='white' padding = {"0.5rem 0.5rem"}>Members</Typography>
            <Stack maxWidth = {"45rem"} width = {"100%"} boxSizing = {"border-box"} padding = {{ sm : "1rem",xs : "0", md : "1rem 4rem" }} spacing = {"0.5rem"} height = {"50vh"} overflow = {"auto"}> 
            
            {isLoadingRemoveMember?<CircularProgress/>:(member.map((i)=>{
                return (
                  <UserItem key = {i._id} user = {i} isAdded = {true} styling = {{boxShadow : "0 0 0.5rem rgba (0,0,0,0.2)",padding : "1rem 2rem", borderRadius : "1rem" ,bgcolor : {bgGradient}}} handler = {removeMemberHandler}/>
                )
              }))
            }

            </Stack>
            </Stack>



            {ButtonGroup}
            </>
            )
            }
       </>
      </Grid>

      { 
        isAddMember && <Suspense fallback = {<Backdrop open= {isAddMember} onClose = {isAddMember}/>}><AddMemberDialog open = {isAddMember} chatId = {chatId} handleClose = {closeAddMemberHandler}/></Suspense>
      }

      {
        confirmDeleteDialog && <><Suspense fallback = {<Backdrop open = {confirmDeleteDialog} onClose = {confirmDeleteDialog} />}><ConfirmDeleteDialog open = {confirmDeleteDialog} handleClose = {closeConfirmDeleteHandler} deleteHandler = {deleteHandler}/></Suspense></>
      }
      <Drawer sx = {{display :{xs:"block", sm : "none"}}} open = {isMobileMenuOpen} onClose = {handleMobile}>
      <GroupsList myGroups={myGroups?.data?.groups} width = {"50vw"}/>
      </Drawer>
    </Grid>

  )
}


export default Group;