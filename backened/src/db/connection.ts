import mongoose from "mongoose";

async function connectToDatabase(){
    try {
        await mongoose.connect(process.env.MONGODB_URL).then(()=>{
            console.log("DB Connection Successfull");
        });
    } catch (error) {
        console.log(error);
    }
}

async function disconnectDatabase(){
    try{
        await mongoose.disconnect().then(()=>{console.log("DB Disconnected Successfully") });
    }catch(error){
        console.log(error);
    }
}

export {connectToDatabase ,  disconnectDatabase};