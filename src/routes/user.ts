import { PrismaClient } from '@prisma/client';
import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SCERET } from '../config';

const User = express.Router();

User.post('/', async (req, res) => {
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
    } catch (e) {
        res.status(411).json({
            msg:"error while entering data"
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
        const token = jwt.sign({userMail : data.email},JWT_SCERET);
        res.json({
            token:token
        })
        return;
    }catch(e){
        res.status(411).json({msg:'error'});
    }
})

export default User;