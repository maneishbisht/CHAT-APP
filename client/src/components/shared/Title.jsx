import React from 'react'
import { Helmet } from 'react-helmet-async';
const Title = ({title = "CHAT" ,description = "This is the chat app Home page"}) => {
  return (
  <Helmet>
    <title> {title} </title>
    <meta name = {description} content = {description}/>
  </Helmet>
  )
}

export default Title
