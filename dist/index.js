"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("./routes/user"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "https://accredian-frontend-task-orpin.vercel.app"
    ],
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // Allows sending cookies if needed
}));
app.use('/api/Refer&Earn', user_1.default);
app.get('/', (req, res) => {
    res.json({
        msg: "hi there"
    });
});
app.listen(3000, () => console.log("Server is online"));
