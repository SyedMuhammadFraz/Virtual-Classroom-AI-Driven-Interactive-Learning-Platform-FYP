import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import userRouter from './routes/userRoutes.js';
import {connectDatabase} from "./db/db.js"


dotenv.config();
const app = express()
app.use(cors({

    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({
    limit:"20kb"
}));
app.use(express.urlencoded({
    extended: true,
    limit:"20kb"
}))
app.use(express.static("public"))
app.use(cookieParser())
connectDatabase();

app.use("/api/v1/users", userRouter);
app.listen(process.env.PORT,()=>{

    console.log(`Server is running on port ${process.env.PORT}`);
});

export { app };