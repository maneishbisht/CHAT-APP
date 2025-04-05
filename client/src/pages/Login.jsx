import {React,useState} from 'react'
import { Container, Stack} from '@mui/system'
import { Avatar, Button, IconButton, Paper,TextField, Typography } from '@mui/material';
import { VisuallyHiddenInput } from '../components/styles/StyledComponents';
import { CameraAlt  as CameraAltIcon} from '@mui/icons-material';
import { useFileHandler, useInputValidation, useStrongPassword } from '6pp';
import { usernameValidator } from '../utils/validators';
import server from '../constants/config';
import axios from "axios";
import { useDispatch } from 'react-redux';
import {userExists,userNotExists} from "../redux/reducer/auth";

const Login = () => {
  const [isLogin,setIsLogin] = useState(true);
  const name = useInputValidation ("");
  const bio = useInputValidation ("");
  const username = useInputValidation ("",usernameValidator);
  const password = useStrongPassword();
  const avatar = useFileHandler("single",10);

  const dispatch = useDispatch();
  
  const handleLogin = async(e)=>{ 

  const config = {withCredentials : true,
    headers:{
    "Content-type" :"application/json",
  }
  }


  e.preventDefault(); 
  
    try{
      const {data} = await axios.post(`${server}/user/login`,{username: username.value,password : password.value },config);    
      dispatch(userExists(data.user))
    }catch(error){
      console.log(error.response.data.message)
    }
  }



  const handleSignUp = async(e)=>{
    e.preventDefault();
    console.log(1);
    
    const formData = new FormData();

    formData.append("avatar",avatar.file);
    formData.append("name",name.value);
    formData.append("bio",bio.value);
    formData.append("username",username.value);
    formData.append("password",password.value);

    const config = {
      withCredentials :true, headers: {"Content-Type": "multipart/form-data"}
    }

    try{
      const {data} = await axios.post(`${server}/user/new`,formData,config);
      console.log(2)
      dispatch(userExists(data.user));
      console.log(3)
    }catch(error){
      console.log(error)
      console.log(4)
    }
  }
  
  
  const toggleLogin = ()=>{setIsLogin((prev)=>!prev);}



  return (
    <div style = {{
      backgroundImage : "linear-gradient(rgba(200,200,200,0.5), rgba(120,110,220,0.5))",
    }}>

    <Container component = {"main"} maxWidth = "xs"sx = {{height : "100vh",display : "flex", justifyCOntent : "center", alignItems : "center"}}>
      <Paper elevation = {3} sx = {{ padding : 4, display : "flex", flexDirection : "column", alignItems : "center"}}>
        {isLogin?<>
        <Typography variant = "h5"> LOGIN </Typography>
        <form style = {
          {
            width : "100%",
            marginTop : "1rem"
          }
        }>
        <TextField required fullWidth label = "username" margin = "normal" variant = "outlined" value = {username.value} onChange={username.changeHandler}></TextField>
        {
          username.error && (
            <Typography color = "error" variant = "caption"> {username.error} </Typography>
          )
        }
        <TextField required fullWidth label = "password" type = "password" margin = "normal" variant = "outlined" value = {password.value} onChange={password.changeHandler}></TextField>
        {
          password.error && (
            <Typography color = "error" variant = "caption"> {password.error} </Typography>
          )
        }

        <Button variant = "contained" onClick = {handleLogin} type = "submit" color = "primary" sx = {{marginTop : "1rem"}} fullWidth>Login</Button>
        <Typography textAlign = {"center"} m = {"1rem"}> OR </Typography>
        <Button variant = "text" color = "primary" sx = {{marginTop : "1rem"}}  onClick = {toggleLogin} fullWidth>SIGN UP INSTEAD</Button>
        </form>
        </>    
        : (<>
          <Typography variant = "h5"> SIGN UP </Typography>
          <form style = {
            {
              width : "100%",
              marginTop : "1rem"
            }
          }>
          <Stack position = {"relative"} width = {"10rem"} margin = {"auto"}>
            <Avatar sx = {{width : "10rem", height : "10rem", objectFit : "contain"}} src = {avatar.preview}/>
            <IconButton sx={{
              position : "absolute",
              bottom : "0",
              right : "0",
              backgroundColor : "white"
            }} component = "label">
              <>
             
              <CameraAltIcon/>
              <VisuallyHiddenInput type = "file" onChange = {avatar.changeHandler}/>
              </>
            </IconButton>
          </Stack>
          <TextField required fullWidth label = "Name" margin = "normal" variant = "outlined" value = {name.value} onChange = {name.changeHandler}></TextField>
          <TextField required fullWidth label = "UserName" margin = "normal" variant = "outlined" value = {username.value} onChange={username.changeHandler}></TextField>
          <TextField required fullWidth label = "password" type = "password" margin = "normal" variant = "outlined" value = {password.value} onChange={password.changeHandler}></TextField>
          <TextField required fullWidth label = "BIO" type = "normal" margin = "normal" variant = "outlined" value = {bio.value} onChange={bio.changeHandler}></TextField>
          <Button variant = "contained"  type = "submit" onClick = {handleSignUp} color = "primary" sx = {{marginTop : "1rem"}} fullWidth>SIGN IN</Button>
          <Typography textAlign = {"center"} m = {"1rem"}> OR </Typography>
          <Button variant = "text" color = "primary" sx = {{marginTop : "1rem"}}  onClick = {toggleLogin} fullWidth>HAVE AN ACCOUNT??<br/>LOG IN!</Button>
          </form>
          </>  )}
      </Paper>
    </Container>
              </div>
  )
}

export default Login
  