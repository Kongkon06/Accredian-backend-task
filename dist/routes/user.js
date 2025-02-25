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
const user = express_1.default.Router();
user.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            msg: "error while entering data"
        });
    }
    return;
}));
user.post('/signin', (req, res) => {
    try {
        const data = req.body;
        const prisma = new client_1.PrismaClient();
        const user = prisma.user.findFirst({
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
});
