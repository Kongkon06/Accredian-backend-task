import { PrismaClient } from '@prisma/client';
import express from 'express';
import jwt,{ JwtPayload} from 'jsonwebtoken';
import { JWT_SCERET } from '../config';
import { sendEmail } from '../Email/sendEmail';

const User = express.Router();
interface CustomJwtPayload extends JwtPayload {
    userMail: string;
    referrerName: string;
  }
  
User.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        const prisma = new PrismaClient()
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                ph_no: data.ph_no,
                password: data.password
            }
        })
        res.json({
            user
        })
    } catch (e:any) {
        res.status(411).json({
            msg:"error while entering data",
            error:e.message
        })
    }
    return;
})

User.post('/signin',async (req, res) => {
    try{
        const data = req.body;
        const prisma = new PrismaClient();
        const user =await prisma.user.findFirst({
            where:{
                email:data.email,
                password:data.password
            }
        })
        if(!user){
            res.json({
                msg:"User not authenticated"
            })
            return;
        }
        const token = jwt.sign({ userMail: data.email, referrerName: data.referrerName }, JWT_SCERET);
        res.json({
            token:token
        })
        return;
    }catch (e) {
      res.status(411).json({ 
          msg: 'error', 
          error: e instanceof Error ? e.message : 'Unknown error' 
      });
  }  
})

User.post('/refferal', async (req, res) => {
    try {
      const data = req.body;
        const prisma =new PrismaClient();
      // Verify JWT token
      const auth = jwt.verify(data.token, JWT_SCERET) as CustomJwtPayload;
      if (!auth) {
        res.status(401).json({ msg: 'User not authenticated' });
        return
      }
  
      // Add referral to database
      const refferer = await prisma.refer.create({
        data: {
          name: data.name,
          email: data.email,
        },
      });
  
      // Send confirmation email
      await sendEmail(
        data.email,
        'You’ve Been Referred! Get Your Exclusive Discount 🎉',
        `Hello ${data.name},\n\n` +
        `Great news! ${auth.referrerName} has referred you to our service.\n\n` +
        `As a special welcome, you’ll receive an exclusive discount of X% on your first purchase!\n\n` +
        `Click the link below to claim your discount and start enjoying our amazing offers:\n` +
        `👉 [YourWebsite.com/redeem]\n\n` +
        `If you have any questions, feel free to reach out.\n\n` +
        `Cheers,\nYour Company Name`
    );
    
  
      res.status(200).json({ msg: 'Referral added successfully', refferer });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ msg: 'Error while entering the referral' });
    }
  });

  export default User