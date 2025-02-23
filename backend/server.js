import express from 'express'
import dotenv from 'dotenv' 
import cors from 'cors'
import mongoose from 'mongoose'

import authRouter from './routes/authRouter.js'
import studentRouter from './routes/studentRouter.js'
import examinerRouter from './routes/examinerRouter.js'
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();



import {v2 as cloudinary} from 'cloudinary';


dotenv.config({ path: './.env' });
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

dotenv.config();
app.use(express.json()); 
app.use(cookieParser());
const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true,               // Allow cookies/credentials to be sent
};

// Apply CORS middleware
app.use(cors(corsOptions));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
}).then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Sample Routr

app.use('/api/auth',authRouter);
app.use('/api/examiner',examinerRouter);
// app.get("/api/student/questions-status",()=>{
//   console.log("Hello")
// })
app.use('/api/student',studentRouter);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
