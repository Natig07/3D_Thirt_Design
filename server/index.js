import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";

import geminiRoutes from './routes/gemini.routes.js';

dotenv.config();

const app = express();
const allowedOrigins = [
  "https://3-d-thirt-design-duqh.vercel.app", 
  "http://localhost:5173" 
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true 
}));

app.use(express.json({limit: "50mb"}))

app.use('/api/v1/gemini', geminiRoutes);

app.get('/', (req, res)=>{
    res.status(200).json({message: "Hello from DALL.E"})
})

app.listen(8080, ()=>console.log('Server has started on port 8080'));