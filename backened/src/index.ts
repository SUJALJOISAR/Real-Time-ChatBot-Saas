import app from "./app.js";
import { connectToDatabase } from "./db/connection.js";

app.get("/",(req,res)=>{ 
   res.status(200).send("Welcome to the Real-time Chatbot");
});

//connections and listeneres
const PORT= process.env.PORT || 5000;

connectToDatabase().then(()=>{
  app.listen(PORT,()=>{
    console.log("server is open in port 5000");
  });
}).catch((error)=>{
  console.log(error);
});