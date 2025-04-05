import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Table from '../../components/shared/Table'
import { dashboardMessages } from '../../constants/sampleData'
import { transformImage } from '../../lib/features'
import {Avatar,Box} from '@mui/material'
import {Stack} from '@mui/system'
import { fileFormat } from '../../lib/features'
import moment from 'moment'
import renderAttachment from "../../components/shared/RenderAttachment";
import { useFetchMessagesDataQuery } from '../../redux/api/api'
import { Loaders } from '../../components/layout/Loaders'
import { useErrors } from '../../hooks/hook'
const columns = [
  {
    field : "id",
    headerName : "ID",
    headerClassName : "table-header",
    width : "200"
  },  
  {   
    field : "attachments",
    headerName : "Attachments",
    headerClassName : "table-header",
    width : "200",
    renderCell : (params)=> {
      
      const {attachment} = params.row;
      return attachment?.length>0 ? (attachment.map((i)=>{
          const url=i.url;
          const file = fileFormat(url)
          return (<Box>
            <a href = {url} download  target = "blank" style = {{ color : "black"}}>
              {renderAttachment(file,url)}
            </a>
          </Box>)
      })) : "Not attachments";
    }
  },
  {
    field : "content",
    headerName : "Content",
    headerClassName : "table-header",
    width : "400"
  },
  {
    field : "sender",
    headerName : "Send By",
    headerClassName : "table-header",
    width : "200",
    renderCell : (params)=><Stack direction = {"row"} spacing = {"1rem"} alignItems = {"center"}>
      <Avatar alt ={params.row.sender.name} src = {params.row.sender.avatar}/>
      <span>{params.row.sender.name}</span>
      </Stack>
  },
  {
    field : "chat",
    headerName : "Chat",
    headerClassName : "table-header",
    width : "220"
  },
  {
    field : "groupChat",
    headerName : "Group Chat",
    headerClassName : "table-header",
    width : "100"
  },
  {
    field : "createdAt",
    headerName : "Time",
    headerClassName : "table-header",
    width : "250"
  },

]



const MessageManagement = () => {


  const {data,isLoading,error,isError} =  useFetchMessagesDataQuery();

  const [rows,setRows] = useState();

  useErrors([{error,isError}]);

  useEffect(()=>{
   setRows(data?.messages?.map((i)=>({...i, id: i._id, sender : {
    name : i.sender.name,
    avatar : transformImage(i.sender.avatar,50)
   }, createdAt : moment (i.createdAt).format("MMM Do YYYY, h:mm:ss a ")})))
  },[data?.messages])


  return (
    isLoading?<Loaders/>:
    <AdminLayout>
      <Table heading = {"All Messages"} columns = {columns} rows = {rows} Height = {200}/>
    </AdminLayout>
  )
}

export default MessageManagement