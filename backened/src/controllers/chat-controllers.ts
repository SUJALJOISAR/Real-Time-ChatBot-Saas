import { NextFunction, Request, Response } from "express";
import UserModel from "../models/UserModel.js";
import { configureOpenAI } from "../config/openai-config.js";
// import { ChatCompletionMessageParam } from "openai/resources/index.mjs";

// Define the type manually
interface ChatCompletionRequestMessage {
    role: 'user' | 'assistant';
    content: string;
  }

export const generateChatCompletion = async(req:Request,res:Response,next:NextFunction)=>{
    const {message} = req.body;
    const user= await UserModel.findById(res.locals.jwtData.id);//fetch the user using "token"
    if(!user){
        return res.status(401).json({msg:"User not registered or Token Malfunctioned"});
    }
  // Grab chats of user
    const chats: ChatCompletionRequestMessage[] = user.chats.map(({ role, content }) => {
    if (role === "user" || role === "assistant") {
      return { role, content };
    }
    throw new Error(`Invalid role: ${role}`);
  });
  chats.push({ role: "user", content: message }); // Pushing the latest message to the chats
  user.chats.push({ role: "user", content: message }); // Updating the user's chat history
    
  try {
    // Instantiate the OpenAI client
    const openai = configureOpenAI();

    // Send all chats with the new one to OpenAI API
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: chats,
    });
   // Get the latest response
   const assistantMessage = chatCompletion.choices[0].message;

   // Save the assistant's response to the user's chat history
   if (assistantMessage.role === "assistant" && assistantMessage.content) {
     user.chats.push({ role: "assistant", content: assistantMessage.content });
   }

   await user.save();

   // Return the assistant's response to the client
   return res.json({ message: assistantMessage.content });
 

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error generating chat completion" });
  }
}

export const sendChatToUser = async (req:Request,res:Response,next:NextFunction)=>{
  try {
    //user token check
    const user=await UserModel.findById(res.locals.jwtData.id);
    if(!user){
      return res.status(401).json({msg:"User not registered or Token Malfunctioned"});
    }
    if(user._id.toString() !== res.locals.jwtData.id){
      return res.status(401).json({msg:"permissions didn't match"});
    }
    return res.status(200).json({message:"OK",chats:user.chats});
  } catch (error) {
    console.log(error);
    return res.status(400).json({message:"ERROR",cause:error.message});
  }
};

export const deleteChats = async (req:Request,res:Response,next:NextFunction)=>{
  try {
    //user token check
    const user=await UserModel.findById(res.locals.jwtData.id);
    if(!user){
      return res.status(401).json({msg:"User not registered or Token Malfunctioned"});
    }
    if(user._id.toString() !== res.locals.jwtData.id){
      return res.status(401).json({msg:"permissions didn't match"});
    }
    //@ts-ignore to ignore the type error
    user.chats=[];
    await user.save();
    return res.status(200).json({message:"OK"});
  } catch (error) {
    console.log(error);
    return res.status(400).json({message:"ERROR",cause:error.message});
  }
};