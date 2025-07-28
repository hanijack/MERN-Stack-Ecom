import app from './app.js';
import dotenv from 'dotenv';
import { connectMongoDatabase } from './config/db.js';
if(process.env.NODE_ENV!=="PRODUCTION"){
    dotenv.config({path:'backend/config/config.env'})
}
import Stripe from 'stripe';
import {v2 as cloudinary} from 'cloudinary';
connectMongoDatabase();
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})
export const stripe = new Stripe(process.env.STRIPE_API_KEY);


// Handle uncaught exception errors
process.on('uncaughtException',(err)=>{
    console.log(`Error : ${err.message}`);
    console.log(`Server is shutting down due to uncaught exception errors`);
    process.exit(1);
    
})

const port =process.env.PORT || 3000;
// Removed Razorpay instance export

const server=app.listen(port,()=>{
    console.log(`Server is running on PORT ${port}`);
    
})

process.on('unhandledRejection',(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`Server is shutting down, due to unhandled promise rejection`);
    server.close(()=>{
        process.exit(1)
    })
    
})