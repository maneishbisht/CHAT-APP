import server from "../../constants/config"
import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios";

const adminLogin = createAsyncThunk("admin/verify",async(secretKey)=>{
  try{  const config = {
        withCredentials : true,
        headers:{"Content-type" : "application/json"}}
    const {data} = await axios.post(`${server}/admin/verify`,{secretKey},config)
    return data.success;
    }catch(error){
        return false;
    }
}
)

const getAdmin = createAsyncThunk("admin/getAdmin",async()=>{
    try{   
      const {data} = await axios.get(`${server}/admin/getAdmin`,{withCredentials : true})
      return data.admin;
        }
      catch(error){
          return false;
      }
  }
  )

const adminLogout = createAsyncThunk("admin/logout",async()=>{
    try{
        const {data} = await axios.get(`${server}/admin/logout`,{withCredentials:true})
        return data.success;
    }
    catch(error){
        console.log("Sorry couldnt log out")
    }
})

export {adminLogin,getAdmin,adminLogout};