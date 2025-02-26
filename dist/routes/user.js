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
        const token = jsonwebtoken_1.default.sign({ userMail: data.email }, config_1.JWT_SCERET);
        res.json({
            token: token
        });
        return;
    }
    catch (e) {
        res.status(411).json({ msg: 'error' });
    }
}));
User.post('/refferal', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const prisma = new client_1.PrismaClient();
        const auth = jsonwebtoken_1.default.verify(data.token, config_1.JWT_SCERET);
        if (!auth) {
            res.status(411).json({
                msg: 'User not authenticated'
            });
        }
        const refferer = yield prisma.refer.create({
            data: {
                name: data.name,
                email: data.email
            }
        });
        res.status(200).json(refferer);
    }
    catch (e) {
        res.json({
            msg: "error while entering the refferal"
        });
    }
}));
exports.default = User;
