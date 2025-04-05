import { Skeleton } from '@mui/material'
import { Stack } from '@mui/system'
import React from 'react'
import {Grid} from '@mui/system';

const Loaders = () => {
  return (
    <>
    <Grid container height = {"calc(100vh-4rem"}>
        <Grid item sm = {4} md = {3} sx = {{display : {xs:"none", sm : "block"}}} height = {"100%"} width = {"30%"}bgcolor = "primary.main"><Skeleton variant = "rectangular" height = {"100vh"}/></Grid>
        <Grid item xs = {12} sm = {8} md = {5} lg = {6} height = {"100%"} width = {"40%"}bgcolor = "primary.main">
            <Stack spacing = {"10rem"}>    
            {
            Array.from({length:10}).map((_,index)=>(<Skeleton key = {index} variant = "rectangular" height = {"10vh"}/>))
            }
            </Stack>
        </Grid>
        <Grid item md = {4} lg = {3} height = {"100%"} width = {"30%"}  sx = {{display : {xs : "none", sm : "block"}, padding : "2rem", bgcolor : "rgba(0,0,0,0.1)"}}bgcolor = "primary.main"><Skeleton variant = "rectangular" height= {"100vh"}/></Grid>
    </Grid>
    </>
  )
}

const TypingLoader = ()=>{
return <div>"Loading..."</div>
}

export {TypingLoader,Loaders}
