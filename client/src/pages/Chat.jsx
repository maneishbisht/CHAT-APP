import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import { IconButton, Skeleton, Stack } from '@mui/material';
import { React, useCallback, useEffect,useRef,useState} from 'react';
import { Navigate} from 'react-router-dom';
import { getSocket } from '../socket';
import FileMenu from '../components/dialogs/FileMenu';
import AppLayout from '../components/layout/AppLayout';
import MessageComponent from '../components/shared/MessageComponent';
import { InputBox } from '../components/styles/StyledComponents';
import { bgGradient } from '../constants/color';
import { SampleMessage } from '../constants/sampleData';
import { NEW_MESSAGE_ALERT,NEW_MESSAGE,ALERT, REFETCH_CHATS} from '../constants/events';
import { useChatDetailsQuery, useGetMessagesQuery } from '../redux/api/api';
import { useErrors, useSocketEvents } from '../hooks/hook';
import { useInfiniteScrollTop} from '6pp';
import { useDispatch } from 'react-redux';
import { removeNewMessagesAlert } from '../redux/reducer/chat';
import { setIsFileMenu } from '../redux/reducer/misc';
const Chat = ({chatId,user}) => {


  


  const [shouldNavigate,setShouldNavigate] = useState(false)
  const dispatch = useDispatch();
  const socket = getSocket();


  const [message,setMessage] = useState("");
  const [messages,setMessages] = useState([]);
  const [page,setPage] = useState(1); 

  const containerRef = useRef(null);
  const fileMenuRef = useRef(null);
  
  const chatDetails = useChatDetailsQuery({chatId,skip:!chatId})

  useEffect(()=>{
    if(chatDetails?.isError){setShouldNavigate(true)}
  },[chatDetails.isError])


  const oldMessagesChunk = useGetMessagesQuery({chatId,page})// initially the OldMessagesChunk only contains the fist n messages(n=message per page);

  const {data:oldMessages,setData:setOldMessages} = useInfiniteScrollTop(containerRef,oldMessagesChunk?.data?.totalPages,page,setPage,oldMessagesChunk.data?.message)
  //The infininteScrollTop fetches the previous n messages as soon as the scroll reaches top and appends the result obtained inside the oldMessagesd Array
  //The oldMessages will contain more and more messages as we scroll to the top

  const errors = [{isError : chatDetails?.isError, error:chatDetails?.error},{isError : oldMessagesChunk?.isError, error:oldMessagesChunk?.error}]
  const member = chatDetails?.data?.chat?.member;

  const handleFileOpen = (e)=>{
    dispatch(setIsFileMenu(true));
  }

  const closeFileMenuHandler = ()=>{
    dispatch(setIsFileMenu(false));
  }


  const submitHandler = (e)=>{

    e.preventDefault();

    if(!message.trim()){return};
    socket.emit(NEW_MESSAGE,{chatId,member,message})
    setMessage("");

  }



  const newMessagesListener = useCallback((data)=>{
    const x = data.chatId;
    if(x!==chatId){return};
    setMessages((prev)=>[...prev,data.message])
  },[chatId])



  const alertListener = useCallback(({message,chatId})=>{
    
    const messageForAlert = {
      content : message,
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

  
  useErrors(errors)
  
  const eventHandlers = {
    [NEW_MESSAGE]: newMessagesListener,
    [ALERT] : alertListener,
  };

  useSocketEvents(socket,eventHandlers)

  const allMessages = [...oldMessages,...messages]
// since oldMessages contain all the previous messages upto which the user has scrolled, the all Messages will contain all these messages + new message received

  useEffect(()=>{
    
    dispatch(removeNewMessagesAlert(chatId));

    return ()=>{setMessages([]);
    setMessage(""); 
    setOldMessages([]);
    setPage(1);}
  },[chatId])


 const messageOnChange = (e)=>{

  setMessage(e.target.value)
} 

//const allMessages = [...oldMessagesChunk?.data?.messages,...message]

  return (
    <>  
      {shouldNavigate && <Navigate to="/" />}
      {(chatDetails.isLoading)?(<Skeleton/>):(<>

        <Stack ref = {containerRef} boxSizing = {"border-box"} padding = {"2rem"}spacing = {"1rem"} bgcolor = {bgGradient} height = {"90%"} borderRadius = {"1rem"}sx = {{overflowX : "hidden",overflowY : "auto"}}>
        {
          allMessages.map( (i)=>{
            return (
              <MessageComponent message = {i} key = {i._id} user = {user}/>
            )
          })
        }
        </Stack>
        
        <form style = {{ height : "10%"}} onSubmit={submitHandler}>
          <Stack direction = {"row"} height = {"100%"} padding = {"1rem"} alignItems={"center"} position={"relative"}>
        
            <IconButton onClick = {handleFileOpen} ref = {fileMenuRef} sx = {{ rotate : "-30deg",backgroundColor : "black", color : "white",padding : "0.5rem", marginLeft : "1rem", "&:hover":{
              rotate : "90deg", backgroundColor : "black"
            }}}>
              <AttachFileIcon/>
            </IconButton>

            <InputBox placeholder = {"Type your message here"} value = {message} onChange = {messageOnChange} sx = {{ borderRadius : "5%"}}/>
            <IconButton type = "submit">
              <SendIcon/>
            </IconButton> 

          </Stack>
        </form>
        <FileMenu anchor = {fileMenuRef.current} handler = {closeFileMenuHandler} chatId = {chatId} />
      </>)}
    </>
  )
}

const myChat = AppLayout(Chat);
export default myChat; 