import express from 'express';
import morgan from 'morgan';
import {config} from 'dotenv'; // to use the .env file variables and functions we have to import this 
config(); //then simply run the config() to use 
import appRouter from './routes/index.js';
import cookieParser from 'cookie-parser';
import cors from "cors";



const app=express();

//middlewares  
app.use(cors({
  origin: "http://127.0.0.1:5173",
  credentials: true,
}));
app.use(express.json());// tells this application that we will be going to use the json() format for ingoing and outgoing requests i.e. it will pass the incoming data to the json.
app.use(cookieParser(process.env.COOKIE_SECRET));// to directly set the cookies from backend to frontend

//remove it in production
app.use(morgan("dev"));
//just provide log description in terminal like what type of request was handled, what was the response, and statuscode

//for routes
app.use("/api/v1/",appRouter);
//http:localhost/api/v1/ till here we have to write complusory to do routing in diff pages then if mention anything after that is handover to the 'appRouter' to handle the further routes. 

export default app;

//start the server using "npm run dev"