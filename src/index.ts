import express from 'express'
import User from './routes/user'
const app = express();

app.use(express.json());
app.use('/api/Refer&Earn',User);
app.get('/',(req,res)=>{
    res.json({
        msg:"hi there"
    })
})