import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import connectDb from './config/db.js';
import authRouter from './routes/authRoutes.js';

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:"https://localhost:5153",
  credentials:true
}));

app.use('/api/auth', authRouter);

app.listen(8000, () =>{
  connectDb();
  console.log(`Server started ${PORT}`);
})