import {React,Suspense,lazy,useEffect} from 'react';
import {BrowserRouter,Routes, Route} from "react-router-dom";
import ProtectRoute from './components/auth/ProtectRoute';
import Home from "./pages/Home";
import {Loaders} from './components/layout/Loaders';
import axios from 'axios';
import {useDispatch,useSelector} from "react-redux";
import {userNotExists,userExists} from './redux/reducer/auth';
import server from "./constants/config";
import { SocketProvider } from './socket';
import { getAdmin } from './redux/thunks/admin';
const Login = lazy (()=>import("./pages/Login"));
const Chat = lazy (()=>import("./pages/Chat"));
const NotFound = lazy (()=>import("./pages/NotFound"));
const Group = lazy (()=>import("./pages/Groups"));
const AdminLogin = lazy(()=>import("./pages/admin/AdminLogin"));
const Dashboard = lazy(()=>import("./pages/admin/Dashboard"));
const UserManagement = lazy(()=>import("./pages/admin/UserManagement"));
const ChatManagement = lazy(()=>import("./pages/admin/ChatManagement"));
const MessageManagement = lazy(()=>import("./pages/admin/MessageManagement"));

const App = () => {


  const dispatch = useDispatch();
  const{user} = useSelector(state=>state.auth)
  const {isAdmin} = useSelector((state)=>state.auth) 
 
  useEffect(async()=>{
    await(axios.get(`${server}/user/me`,{withCredentials:true})).then(({data})=>{
    dispatch(userExists(data.user))
    }).catch((err)=>{
      console.log("couldnt update the state")
      dispatch(userNotExists())
    })

    dispatch(getAdmin())

  },[])


  return (
    //loader ?( <LayoutLoader/>):(
    <BrowserRouter>
        <Suspense fallback = {<Loaders/>}>

        <Routes>
      
            <Route path = "/login"  element = {<ProtectRoute user = {!user} redirect = "/" ><Login/></ProtectRoute>}/>
            
            <Route element = {<SocketProvider><ProtectRoute user = {user} redirect = "/login"/></SocketProvider>}>
                    <Route path = "/" element = {<Home/>}/>
                    <Route path = "/groups" element = {<Group/>}/>
                    <Route path = "/chats/:chatId" element = {<Chat/>}/>
            </Route>


            <Route element = {<ProtectRoute user = {isAdmin} redirect = "/admin"/>}>
                <Route path = "/admin/dashboard" element = {<Dashboard/>}/>
                <Route path = "/admin/users" element = {<UserManagement/>}/>
                <Route path = "/admin/chats" element = {<ChatManagement/>}/>
                <Route path = "/admin/messages" element = {<MessageManagement/>}/>
            </Route>  

              <Route path = "/admin" element = {<ProtectRoute user = {!isAdmin} redirect = "/admin/dashboard" ><AdminLogin/></ProtectRoute>}/>

              <Route path = "*" element = {<NotFound/>}/>

        </Routes>

        </Suspense>
      </BrowserRouter>
  )
//)
}

export default App
