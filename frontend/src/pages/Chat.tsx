import { Avatar, Box, Typography,Button,IconButton } from '@mui/material'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { UseAuth } from '../context/AuthContext'
import red from "@mui/material/colors/red";
import ChatItem from '../components/chat/ChatItem';
import { IoMdSend } from "react-icons/io";
import { useRef } from 'react';
import { deleteUserChats, getUserChats, sendChatRequest } from '../helpers/api-communication';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// const chatMessages = [
//   { role: "assistant", content: "Hello! How can I assist you today?" },
//   { role: "user", content: "Can you help me with my project?" },
//   { role: "assistant", content: "Of course! What specifically do you need help with?" },
//   { role: "user", content: "I need some guidance on implementing authentication in my app." },
//   { role: "assistant", content: "Sure! Are you using JWT for authentication?" },
//   { role: "user", content: "Yes, I am using JWT for token-based authentication." },
//   { role: "assistant", content: "Great! You can start by setting up a middleware to verify the token in your server." },
//   { role: "user", content: "Thank you! I’ll try that." },
//   { role: "assistant", content: "You're welcome! Let me know if you need further assistance." },
// ];

type Message = {
  role: "user" | "assistant";
  content:string;
}


const Chat = () => {
  const navigate=useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth=UseAuth();

  const [chatMessages,setChatMessages] = useState<Message[]>([]);


  const handleSubmit = async ()=>{
    const content=inputRef.current?.value as string;
    if(inputRef && inputRef.current){
      inputRef.current.value="";
    }
    const newMessage:Message= {role:"user",content};
    setChatMessages((prev)=>[...prev,newMessage]);

    //to send the axios request to /chat/new route to get reply from AI 
    const chatData = await sendChatRequest(content);
    setChatMessages([...chatData.chats]);

  }

  useLayoutEffect(()=>{
     if(auth?.isLoggedIn && auth?.user){
      toast.loading("Loading Chats",{id:"loadchats"});
      getUserChats().then((data)=>{
        setChatMessages([...data.chats]);
        toast.success("Successfully loaded chats",{id:"loadchats"});
      }).catch((err)=>{
        console.log(err);
        toast.error("Loading Failed",{id:"loadchats"});
      })
     }
  },[auth]); //it runs before the UI is rendered

  useEffect(()=>{
    if(!auth?.user){
      return navigate("/login");
    }
  },[auth]);

  const handleDeleteChats = async()=>{
    try {
      toast.loading("Deleting Chats",{id:"deletechats"});
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Deleted Chat Successfully",{id:"deletechats"});
    } catch (error) {
      console.log(error);
      toast.error("Deleting chats failed",{id:"loadchats"});
    }
  }

  return (
    <div>
      <Box sx={{
        display:"flex",
        flex:1,
        width:"100%",
        height:"100%",
        mt:3,
        gap:3,
      }}
      >
         <Box
        sx={{
          display: { md: "flex", xs: "none", sm: "none" },
          flex: 0.2,
          flexDirection: "column",
        }}
      >
          <Box sx={{
            display:"flex",
            width:"100%",
            height:"60vh",
            bgcolor:"rgb(17,29,39)",
            borderRadius:5,
            flexDirection:"column",
            mx:3,
          }}>
             <Avatar
            sx={{
              mx: "auto",
              my: 2,
              bgcolor: "white",
              color: "black",
              fontWeight: 700,
            }}
          >
            {auth?.user?.name[0]}
            {auth?.user?.name.includes(" ") && auth?.user?.name.split(" ")[1][0]} {/* Conditionally render the second initial if there's a space */}
          </Avatar>
          <Typography sx={{ mx: "auto", fontFamily: "work sans" }}>
            You are talking to a ChatBOT
          </Typography>
          <Typography sx={{ mx: "auto", fontFamily: "work sans", my: 4, p: 3 }}>
            You can ask some questions related to Knowledge, Business, Advices,
            Education, etc. But avoid sharing personal information
          </Typography>
          <Button
            onClick={handleDeleteChats}
            sx={{
              width: "200px",
              my: "auto",
              color: "white",
              fontWeight: "700",
              borderRadius: 3,
              mx: "auto",
              bgcolor: red[300],
              ":hover": {
                bgcolor: red.A400,
              },
            }}
          >
            Clear Conversation
          </Button>
          </Box>
        </Box>
        <Box
        sx={{
          display: "flex",
          flex: { md: 0.8, xs: 1, sm: 1 },
          flexDirection: "column",
          px: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: "40px",
            color: "white",
            mb: 2,
            mx: "auto",
            fontWeight: "600",
          }}
        >
          Model - GPT 3.5 Turbo
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: "60vh",
            borderRadius: 3,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            overflow: "scroll",
            overflowX: "hidden",
            overflowY: "auto",
            scrollBehavior: "smooth",
          }}
        >
            {chatMessages.map((chat,index)=>(
              //@ts-ignore => to ignore the type checking error
              <ChatItem content={chat.content} role={chat.role} index={index}/>
            ))}
          </Box>
          <div
          style={{
            width: "100%",
            borderRadius: 8,
            backgroundColor: "rgb(17,27,39)",
            display: "flex",
            margin: "auto",
          }}
        >
          {" "}
          <input
            ref={inputRef}
            type="text"
            style={{
              width: "100%",
              backgroundColor: "transparent",
              padding: "30px",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "20px",
            }}
          />
          <IconButton onClick={handleSubmit}  sx={{ color: "white", mx: 1 }}>
            <IoMdSend />
          </IconButton>
        </div>
        </Box>
      </Box>
    </div>
  )
}

export default Chat
