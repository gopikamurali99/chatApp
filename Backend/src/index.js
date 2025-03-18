import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import messageRoute from "./routes/message.route.js"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
const app = express()
dotenv.config();
const port = process.env.PORT 
app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoute)
app.listen(port,()=>{
    console.log(`server is running on ${port}`)
    connectDB()
})