import { Error as ErrorIcon } from '@mui/icons-material'
import { Stack, Typography } from '@mui/material'
import { Container } from '@mui/system'

import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <Container sx = {{alignItems : "center",justifyContent : "center",height : "100%"}}>
      <Stack alignItems={"center"} justifyContent={"space-evenly"} height = {"100%"}>
        <ErrorIcon sx = {{fontSize : "5rem"}}/>
        <Typography variant='h1'>404</Typography>
        <Typography variant='h1'>Not Found</Typography>
        <Link to = "/"> Navigate to Home </Link>
      </Stack>
    </Container>
  )
}

export default NotFound
