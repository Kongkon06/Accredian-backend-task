"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const sendEmail_1 = require("../Email/sendEmail");
const User = express_1.default.Router();
User.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const prisma = new client_1.PrismaClient();
        const user = yield prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                ph_no: data.ph_no,
                password: data.password
            }
        });
        res.json({
            user
        });
    }
    catch (e) {
        res.status(411).json({
            msg: "error while entering data",
            error: e.message
        });
    }
    return;
}));
User.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const prisma = new client_1.PrismaClient();
        const user = yield prisma.user.findFirst({
            where: {
                email: data.email,
                password: data.password
            }
        });
        if (!user) {
            res.json({
                msg: "User not authenticated"
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userMail: data.email, referrerName: data.referrerName }, config_1.JWT_SCERET);
        res.json({
            token: token
        });
        return;
    }
    catch (e) {
        res.status(411).json({
            msg: 'error',
            error: e instanceof Error ? e.message : 'Unknown error'
        });
    }
}));
User.post('/refferal', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const prisma = new client_1.PrismaClient();
        // Verify JWT token
        const auth = jsonwebtoken_1.default.verify(data.token, config_1.JWT_SCERET);
        if (!auth) {
            res.status(401).json({ msg: 'User not authenticated' });
            return;
        }
        // Add referral to database
        const refferer = yield prisma.refer.create({
            data: {
                name: data.name,
                email: data.email,
            },
        });
        // Send confirmation email
        yield (0, sendEmail_1.sendEmail)(data.email, 'You’ve Been Referred! Get Your Exclusive Discount 🎉', `Hello ${data.name},\n\n` +
            `Great news! ${auth.referrerName} has referred you to our service.\n\n` +
            `As a special welcome, you’ll receive an exclusive discount of X% on your first purchase!\n\n` +
            `Click the link below to claim your discount and start enjoying our amazing offers:\n` +
            `👉 [YourWebsite.com/redeem]\n\n` +
            `If you have any questions, feel free to reach out.\n\n` +
            `Cheers,\nYour Company Name`);
        res.status(200).json({ msg: 'Referral added successfully', refferer });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ msg: 'Error while entering the referral' });
    }
}));
exports.default = User;
