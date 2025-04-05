import React, { useState, useEffect} from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Table from '../../components/shared/Table'
import {dashboardDataUsers} from "../../constants/sampleData"
import { Avatar } from '@mui/material'
import {Loaders} from "../../components/layout/Loaders"
import {transformImage} from "../../lib/features"
import { useFetchUserDataQuery } from '../../redux/api/api'
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
    renderCell : (params)=>(<Avatar alt ={params.row.name} src = {transformImage(params.row.avatar)}/>)
  },
  {
    field : "name",
    headerName : "Name",
    headerClassName : "table-header",
    width : "200"
  },
  {
    field : "username",
    headerName : "Username",
    headerClassName : "table-header",
    width : "200"
  },
  {
    field : "friends",
    headerName : "Friends",
    headerClassName : "table-header",
    width : "200"
  },
  {
    field : "groups",
    headerName : "Groups",
    headerClassName : "table-header",
    width : "200"
  }

]

const UserManagement = () => {

  const [rows,setRows] = useState()
  
  
  const {data,isLoading,error,isError} = useFetchUserDataQuery();

  useErrors([{error,isError}])

  useEffect(()=>{
    setRows(data?.transformedUser?.map((i)=>({...i,id : i._id, avatar : transformImage(i.avatar,50)})))
  },[data?.transformedUser])


  return (
    isLoading?<Loaders/>:<AdminLayout>
      <Table columns = {columns} rows = {rows} heading = {"ALL USERS"}/>
    </AdminLayout>
  )
}

export default UserManagement
