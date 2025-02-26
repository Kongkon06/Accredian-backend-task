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
exports.sendReferralEmail = sendReferralEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const gmailAuth_1 = __importDefault(require("./gmailAuth"));
function sendReferralEmail(_a) {
    return __awaiter(this, arguments, void 0, function* ({ to, referralName }) {
        try {
            const accessToken = yield gmailAuth_1.default.getAccessToken();
            const transporter = nodemailer_1.default.createTransport({
                service: "gmail",
                auth: {
                    type: "OAuth2",
                    user: process.env.GMAIL_USER,
                    clientId: process.env.GMAIL_CLIENT_ID,
                    clientSecret: process.env.GMAIL_CLIENT_SECRET,
                    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
                    accessToken: accessToken.token,
                },
            });
            const mailOptions = {
                from: `"Your Company" <${process.env.GMAIL_USER}>`,
                to,
                subject: "Referral Invitation",
                text: `Hello! You have been referred by ${referralName}.`,
                html: `<p>Hello!</p><p>You have been referred by <strong>${referralName}</strong>.</p>`,
            };
            const result = yield transporter.sendMail(mailOptions);
            console.log("Referral email sent successfully:", result.messageId);
        }
        catch (error) {
            console.error("Error sending referral email:", error);
            throw new Error("Failed to send referral email");
        }
    });
}
