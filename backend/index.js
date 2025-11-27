import express from 'express';
import "dotenv/config";
import cors from 'cors';
import checkout from './routes/checkout.js';


const app =express();
const Port = process.env.PORT || 8000;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Express server!');
});

app.use("/",checkout)

app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
})



