import {React,Suspense,useCallback,useEffect,useRef,useState} from 'react'
import { sampleChats } from '../../constants/sampleData';
import Title from '../shared/Title';
import Header from './Header';
import { Grid } from '@mui/system';
import {Loaders} from './Loaders';
import Chatlist from '../specific/Chatlist';
import { Navigate, useParams } from 'react-router-dom';
import Profile from '../specific/Profile';
import { bgGradient } from '../../constants/color';
import { useMyChatsQuery } from '../../redux/api/api';
import { Skeleton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setIsMobile,setIsDeleteMenu, setSelectedDeleteChat } from '../../redux/reducer/misc';
import { useErrors, useSocketEvents } from '../../hooks/hook';
import { getSocket } from '../../socket';
import { ALERT, NEW_MESSAGE, NEW_MESSAGE_ALERT, NEW_REQUEST, REFETCH_CHATS } from '../../constants/events';
import { incrementNotification, setNewMessagesAlert } from '../../redux/reducer/chat';
import { getOrSaveFromStorage } from '../../lib/features';
import DeleteChatMenu from '../dialogs/DeleteChatMenu';




const AppLayout = (WrappedComponent) => {  
  
  return (props)=>{


    const deleteMenuRef = useRef(null);
    const [shouldNavigate,setShouldNavigate] = useState(false)
    const params = useParams();
    const chatId = params.chatId;
    const {user} = useSelector((state)=>state.auth)
    const {newMessagesAlert} = useSelector((state)=>state.chat)
    const {isLoading,data,isError,error,refetch} = useMyChatsQuery("")
    
    const dispatch = useDispatch();
        
    
    const handleDeleteChat = (e,_id,groupChat) => {
      e.preventDefault();
      deleteMenuRef.current = e.currentTarget;
      dispatch(setIsDeleteMenu(true))
      dispatch(setSelectedDeleteChat({chatId:_id,groupChat}))
      
    }
    
    const newMessageAlertHandler = useCallback((data)=>{
      const id = data;
      if(id!==chatId)
        dispatch(setNewMessagesAlert(data))
      
    },[]);
    
    const newRequestHandler = useCallback(()=>{
      dispatch(incrementNotification())
    },[]);
    
    const refetchListener = useCallback(()=>{
      refetch();
      setShouldNavigate(true);
    },[refetch,Navigate]);
    
    const alertListener = useCallback(({message,chatId})=>{
      
      const messageForAlert = {
        content:message,
        _id : uuid(),
        sender : {
          _id : 'asdfasdfasdasdfas',
          name : "Admin"
        },
        chat: chatId,
        createdAt : new Date().toISOString(),
      }
      
      setMessages((prev)=>[...prev,messageForAlert])
      
    },[chatId])
    
    
    const eventHandler = {
      [NEW_MESSAGE_ALERT] : newMessageAlertHandler,
      [NEW_REQUEST] : newRequestHandler,
      [REFETCH_CHATS] : refetchListener,
      [ALERT] : alertListener
    }
    
    const socket = getSocket();  
    
    useSocketEvents(socket,eventHandler)
    
    
    
    
    // Custom Hook using UseEffect
    
    useErrors([{isError,error}])
    
    useEffect(()=>{
      const myItem = localStorage.getItem(NEW_MESSAGE_ALERT);
      if(!myItem){getOrSaveFromStorage({key : NEW_MESSAGE_ALERT,value :{chatId : null,count : 0}})}
      getOrSaveFromStorage({key : NEW_MESSAGE_ALERT,value :newMessagesAlert})
      
    },[newMessagesAlert])
    
    
    



    return (<>
                <Title/>

                {shouldNavigate && <Navigate to="/" />}
                <Header onlineUsers = {['1','2']} chatId = {chatId} chats = {data?.transformChats} handleDeleteChat = {handleDeleteChat}/>

                <DeleteChatMenu deleteMenuAnchor = {deleteMenuRef}/>  

                <Suspense fallback = {<Loaders/>}>
                <Grid container height = {"calc(100vh)"}>  
                    <Grid item sm = {4} md = {3}  height = {"100%"} width = {"30%"} borderRadius={"1rem"} sx = {{backgroundImage : {bgGradient} , display : {xs:"none", sm : "block"}}} padding = {"0.5rem"}>
                      {isLoading?(<Skeleton/>):(<Chatlist onlineUsers = {['1','2']} newMessagesAlert = {newMessagesAlert} chatId = {chatId} chats = {data?.transformChats} handleDeleteChat = {handleDeleteChat}/>)}
                    </Grid>
                    <Grid item xs = {12} sm = {8} md = {5} lg = {6} height = {"100%"} width = {"40%"} padding = {"0.5rem"}><WrappedComponent {...props} chatId = {chatId} user = {user}/></Grid>
                    <Grid item md = {4} lg = {3} height = {"100%"} width = {"30%"} sx = {{ display : {xs : "none", sm : "block"},bgcolor : "rgba(0,0,0,0.85)" ,padding:"0.5rem"}}  borderRadius={"1rem"}> <Profile User = {user}/> </Grid>
                </Grid>
                </Suspense>
                </>)
    }
  }

  export default AppLayout
  //const AppLayout = (WrappedComponent) => {
    //    
    //    return (
      //        ()=>{
  //            
  //            const handleDeleteChat = (e,_id,groupChat)=>{
    //            e.preventDefault();
    //            console.log("Deleted chat",_id,groupChat);
    //            }
    //            const params = useParams();
    //            const chatId = params.chatId;
    //            
    //            return (
      //                <>
      //                <Title/>
      //                <Header/>
      //
      //                <Suspense fallback = {<Loaders/>}>
      //
      //                <Grid container height = {"calc(100vh)  "}>
      //                    
      //                    <Grid item sm = {4} md = {3} sx = {{display : {xs:"none", sm : "block"}}} height = {"100%"} width = {"30%"}bgcolor = "primary.main">{<Chatlist onlineUsers = {['1','2']} chatId = {chatId} chats = {sampleChats} handleDeleteChat = {handleDeleteChat}/>}</Grid>
      //                    <Grid item xs = {12} sm = {8} md = {5} lg = {6} height = {"100%"} width = {"40%"}bgcolor = "primary.main"><WrappedComponent/></Grid>
      //                    <Grid item md = {4} lg = {3} height = {"100%"} width = {"30%"}  sx = {{ display : {xs : "none", sm : "block"}, padding : "2rem", bgcolor : "rgba(0,0,0,0.85)" }}bgcolor = "primary.main"> <Profile/> </Grid>
      //                
      //                </Grid>
      //
      //                </Suspense>
      //
      //                </>
      //              )
      //        }
      //
      //        
      //    )
      //  
      //}