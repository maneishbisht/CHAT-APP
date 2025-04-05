import {React} from 'react'
import { Container} from '@mui/system'
import {Button, Paper,TextField, Typography } from '@mui/material';
import {useInputValidation} from '6pp';
import {useDispatch} from "react-redux";
import {adminLogin} from '../../redux/thunks/admin';

const AdminLogin = () => {

    const dispatch = useDispatch();
    
    const secretKey = useInputValidation("")

    const submitHandler = (e)=>{
        e.preventDefault();
        dispatch(adminLogin(secretKey.value.toString()))
    }    

    
  return(
    <div style = {{
        backgroundImage : "linear-gradient(rgba(200,200,200,0.5), rgba(120,110,220,0.5))",
      }}>
  
      <Container component = {"main"} maxWidth = "xs"sx = {{height : "100vh",display : "flex", justifyCOntent : "center", alignItems : "center"}}>
        <Paper elevation = {3} sx = {{ padding : 4, display : "flex", flexDirection : "column", alignItems : "center"}}>
          <>
          <Typography variant = "h5"> ADMIN LOGIN </Typography>
          <form style = {{ width : "100%", marginTop : "1rem"}} onSubmit = {submitHandler}>
                    <TextField required fullWidth label = "secretkey" type = "password" margin = "normal" variant = "outlined" value = {secretKey.value} onChange={secretKey.changeHandler}></TextField>
                    {
                      secretKey.error && (
                        <Typography color = "error" variant = "caption"> {secretKey.error} </Typography>
                       )
                    }

                    <Button variant = "contained" type = "submit" color = "primary" sx = {{marginTop : "1rem"}} fullWidth>Login</Button>
          </form>
          </>
        </Paper>
      </Container>
                </div>
  )
}

export default AdminLogin
