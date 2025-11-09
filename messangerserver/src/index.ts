import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToMongo } from './config/db';


import mainRoute from './routes/mainRoute';
connectToMongo();

dotenv.config();

const app = express()
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/v1", mainRoute);

app.get("/health", (req, res) => {
    res.json({status: "OK"})
})


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})