import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import { connectDB } from "./lib/db.js";
const app = express()
dotenv.config();
const port = process.env.PORT 

app.use("/api/auth",authRoutes)
app.listen(port,()=>{
    console.log(`server is running on ${port}`)
    connectDB()
})