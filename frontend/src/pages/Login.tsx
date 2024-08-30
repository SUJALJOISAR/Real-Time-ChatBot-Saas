import React, { useState,useEffect }  from "react";
import { Box, Typography,Button } from "@mui/material";
import CustomizedInput from "../components/shared/CustomizedInput";
import { IoIosLogIn } from "react-icons/io";
import {toast} from 'react-hot-toast';
import { UseAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState<string | "">("");
  const [password, setPassword] = useState<string | "">("");
  const auth=UseAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    // const formData = new FormData(e.currentTarget);
    // const email = formData.get("email") as string;
    // const password =formData.get("password") as string;
    try {
      toast.loading("Signing In!!",{id:"login"});
      await auth?.login(email,password);
      toast.success("Signed In Successfully!!",{id:"login"});


       // Reset form fields after successful login
       setEmail("");
       setPassword("");
    } catch (error) {
      console.log(error);
      toast.error("Invalid Credentials!!",{id:"login"});
    }
  }
  useEffect(() => {
    if (auth?.user) {
      return navigate("/chat");
    }
  }, [auth]);
  return (
    <>
      <Box width={"100%"} height={"100%"} display={"flex"} flex={1}>
        <Box
          padding={8}
          mt={8}
          display={{ md: "flex", sm: "none", xs: "none" }}
        >
          <img src="airobot.png" alt="Robot" style={{ width: "400px" }} />
        </Box>
        <Box
          display={"flex"}
          flex={{ xs: 1, md: 0.5 }}
          justifyContent={"center"}
          alignItems={"center"}
          padding={2}
          ml={{xs:"auto",md:50}}
          mt={{xs:16,md:5}}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              margin: "auto",
              padding: "30px",
              boxShadow: "10px 10px 20px #000",
              border: "none",
              borderRadius:"10px"
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography
                variant="h4"
                textAlign={"center"}
                padding={2}
                fontWeight={600}
              >
                Login
              </Typography>
              <CustomizedInput 
              type="email"
               name="email" 
               label="email"  
               value={email}// Bind value to state
               onChange={(e) => setEmail(e.target.value)}/>
              <CustomizedInput
                type="password"
                name="password"
                label="password"
                value={password}// Bind value to state
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" sx={{px:2,py:1,mt:2,width:"400px",borderRadius:2,bgcolor:"#00fffc",":hover":{
                bgcolor:"white",
                color:"black",
              }}} endIcon={<IoIosLogIn />}>login</Button>
            </Box>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default Login;
