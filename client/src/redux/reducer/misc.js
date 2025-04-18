import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    isNewGroups : false,
    isAddMember : false,
    isNotification : false, 
    isMobile : false,
    isSearch : false,
    isFileMenu : false,
    isDeleteMenu : false,
    uploadingLoader : false,
    selectedDeleteChat : {
        chatId : "",
        groupChat : false
    }
}

const miscSlice = createSlice({
    name : "misc",
    initialState,
    reducers : {
        setIsNewGroups : (state,action)=>{
            state.isNewGroups = action.payload;
        }, 
        setIsAddMember : (state,action)=>{
            state.isAddMember = action.payload;
        },
        setIsNotification : (state,action)=>{
            state.isNotification = action.payload;
        },
        setIsMobile : (state,action)=>{
            state.isMobile = action.payload;
        },
        setIsSearch : (state,action)=>{
            state.isSearch = action.payload;
        },
        setIsFileMenu : (state,action)=>{
            state.isFileMenu = action.payload;
        },
        setIsDeleteMenu : (state,action)=>{
            state.isDeleteMenu = action.payload;
        },
        setUploadingLoader : (state,action)=>{
            state.uploadingLoader =action.payload;
        },
        setSelectedDeleteChat : (state,action)=>{
            state.selectedDeleteChat = action.payload;
        }
    }

})

export default miscSlice;
export const{setIsNewGroups,setIsMobile,setUploadingLoader,setIsNotification,setIsDeleteMenu,setIsFileMenu,setIsAddMember,setIsSearch,setSelectedDeleteChat} = miscSlice.actions;
