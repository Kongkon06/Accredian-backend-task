import express from 'express'
import User from './routes/user'
import cors from 'cors'
const app = express();

app.use(express.json());
app.use(cors({
    origin: [
      "http://localhost:5173",
      "https://accredian-frontend-task-orpin.vercel.app"
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,  // Allows sending cookies if needed
  }));
app.use('/api/Refer&Earn',User);
app.get('/',(req,res)=>{
    res.json({
        msg:"hi there"
    })
})

app.listen(3000,()=>console.log("Server is online"))