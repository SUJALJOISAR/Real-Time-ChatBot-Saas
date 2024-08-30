import React from 'react'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from './shared/Logo';
import { UseAuth } from '../context/AuthContext';
import NavigationLink from './shared/NavigationLink';
// import { Button } from '@mantine/core'; 


const Header = () => {
  const auth=UseAuth();
  return (
    <>
       <Box sx={{ flexGrow: 1}}>
      <AppBar sx={{bgcolor:"transparent",boxShadow:"none",position:"static"}}>
        <Toolbar sx={{display:"flex"}}>
          <Logo />
          <div>
      {/* to check if the user token exists means if it is not expire then skip the login */}
      {auth?.isLoggedIn ? (
      <>
        <NavigationLink bg="#00fffc" to="/chat" text="Go To Chat" textColor='black'/>
        <NavigationLink bg="#51538f" to="/" text="logout" textColor='white' onClick={auth.logout}/>  
      </>
      ) 
      :
      ( 
      <>
      <NavigationLink bg="#00fffc" to="/login" text="login" textColor='black'/>
      <NavigationLink bg="#51538f" to="/signup" text="Signup" textColor='white'/> 
      </> 
      )  
    }  
    </div>
        </Toolbar>
      </AppBar>
    </Box>
    </>
  )
}

export default Header
