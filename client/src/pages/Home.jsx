import React from 'react'
import AppLayout from '../components/layout/AppLayout';
import { Typography,Box} from '@mui/material';
const Home = () => {
  return (
    <Box bgcolor = {"grayColor"} sx = {{borderRadius : "1rem"}} height = {"100%"}>
    <Typography p={"2rem"} variant = "h5" textAlign = {"center"}>Select a Friend to Chat to</Typography>
    </Box>
  )
}

const myHome = AppLayout(Home);
export default myHome;
