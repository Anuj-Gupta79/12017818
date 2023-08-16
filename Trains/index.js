import express from 'express';
import dotenv from 'dotenv';

const app = express();
dotenv.config();
app.use(express.json());
const port = process.env.server_port;

app.get('/', (req, res)=>{
    res.send("Server is running fine!");
})

app.listen(port, ()=>{
    console.log(`server is listening on http://localhost:${port}`);
})