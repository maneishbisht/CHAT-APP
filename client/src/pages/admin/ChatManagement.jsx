import { Avatar } from '@mui/material'
import { Stack } from '@mui/system'
import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Table from '../../components/shared/Table'
import AvatarCard from "../../components/specific/AvatarCard"
import { dashboardDataChats } from "../../constants/sampleData"
import { Loaders } from '../../components/layout/Loaders'
import { transformImage } from "../../lib/features"
import { useFetchChatsDataQuery } from '../../redux/api/api'
import { useErrors } from '../../hooks/hook'

const columns = [
  {
    field : "id",
    headerName : "ID",
    headerClassName : "table-header",
    width : "200"
  },  
  {
    field : "avatar",
    headerName : "Avatar",
    headerClassName : "table-header",
    width : "150",
    renderCell : (params)=><AvatarCard avatar = {params.row.avatar}/>
  },
  {
    field : "name",
    headerName : "Name",
    headerClassName : "table-header",
    width : "300"
  },
  {
    field : "totalMembers",
    headerName : "Total Members",
    headerClassName : "table-header",
    width : "120"
  },
  {
    field : "member ",
    headerName : "Member",
    headerClassName : "table-header",
    width : "400",
    renderCell : (params)=>(
    <AvatarCard max = {100} avatar = {params.row.member}/>
    )
  },
  {
    field : "totalMessages",
    headerName : "Total Messages",
    headerClassName : "table-header",
    width : "120"
  },
  {
    field : "creator",
    headerName : "Created By",
    headerClassName : "table-header",
    width : "250",
    renderCell : (params)=>(
      <Stack direction = "row" alignItems = "center" spacing = {"1rem"}>
        <Avatar alt = {params.row.creator.name} src = {params.row.creator.avatar}/>
        <span>{params.row.creator.name}</span>
      </Stack>
    )
  }

]

const ChatManagement = () => {
  const [rows,setRows] = useState()

  const {data,isLoading,error,isError} = useFetchChatsDataQuery();

  useErrors([{isError,error}])

  useEffect(()=>{
    setRows(data?.transformedChat?.map((i)=>({...i,id:i._id,member:i.member.map((i)=>transformImage(i.avatar,50) ),avatar : i.member.map((i)=>transformImage(i.avatar,50) )})))
  },[data?.transformedChat])

  return (
      isLoading?<Loaders/>:    
      <AdminLayout>
      <Table columns = {columns} rows = {rows} heading = {"ALL CHATS"}/>
      </AdminLayout>
  )
}

export default ChatManagement
