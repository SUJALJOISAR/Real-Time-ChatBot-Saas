import express from 'express';
import morgan from 'morgan';
import {config} from 'dotenv';
import appRouter from './routes/index.js';
import cookieParser from 'cookie-parser';
config();


const app=express();

//middlewares
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

//remove it in production
app.use(morgan("dev"));
//just provide log such as which route was searched, which command was passed like that in terminal

//for routes
app.use("/api/v1/",appRouter);

export default app;