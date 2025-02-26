import express from 'express'
import User from './routes/user'
import cors from 'cors'
const app = express();

app.use(express.json());
app.use(cors())
app.use('/api/Refer&Earn',User);
app.get('/',(req,res)=>{
    res.json({
        msg:"hi there"
    })
})

app.listen(3000,()=>console.log("Server is online"))