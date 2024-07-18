import mongoose from "mongoose";
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
import { router } from "./user.routes.js";
const app = express();

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname,'public')));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieParser());

// routes
app.post('/signup',router)

app.post('/login',router)


;(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URL}`);
        app.listen(process.env.PORT || 4002,()=>{
            console.log(`connected to server on PORT : ${process.env.PORT} `)
        })
    } catch (error) {
        console.log("Failed to connect to MongoDB", error.message);
    }
})()