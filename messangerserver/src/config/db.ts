import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

export const connectToMongo = async () =>{
    const MONGO_URI= process.env.MONGO_URI || "localhost:27017/messanger";
    try{
        await mongoose.connect(MONGO_URI);
        console.log("Database Connected");
    }catch(error: any){
        console.log("Connection failed to mongodb", error);
    }
}