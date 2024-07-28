import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";

app.get("/",(req,res)=>{ 
   res.status(200).send("Welcome to the Real-time Chatbot");
});


connectToDatabase().then(()=>{
  app.listen(5000,()=>{
    console.log("server is open in port 5000");
  });
}).catch((error)=>{
  console.log(error);
});