
import { createSlice } from "@reduxjs/toolkit";
import {adminLogin,adminLogout,getAdmin} from "../thunks/admin";

const initialState = {
    user : null,
    isAdmin : false,
    loader : true, 
                    }

const authSlice = createSlice({
name :"auth",
initialState,
reducers : {
    userExists:(state,action)=>{
        state.user = action.payload,
        state.loader = false;},

    userNotExists : (state)=>{
        state.user = null;
        state.loader = false;}
            },
extraReducers : (builder)=>{
builder.addCase(adminLogin.fulfilled,(state,action)=>{
        if(action.payload){state.isAdmin = true;}
        else{state.isAdmin = false}
        }).addCase(adminLogin.rejected,(state,action)=>{
        state.isAdmin = false
        }).addCase(getAdmin.fulfilled,(state,action)=>{
        if(action.payload){state.isAdmin = true}
        else{state.isAdmin = false}
        }).addCase(getAdmin.rejected,(state,action)=>{
            state.isAdmin = false;
        }).addCase(adminLogout.fulfilled,(state,action)=>{
        if(action.payload){state.isAdmin = false;}
        })
}
})

export default authSlice;
export const {userExists,userNotExists,extraReducers} = authSlice.actions;