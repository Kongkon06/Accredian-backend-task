"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const googleapis_1 = require("googleapis");
const readline_1 = __importDefault(require("readline"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];
const CREDENTIALS_PATH = path_1.default.join(__dirname, "../../credentials.json");
const TOKEN_PATH = path_1.default.join(__dirname, "../../token.json");
// Load credentials
const credentials = JSON.parse(fs_1.default.readFileSync(CREDENTIALS_PATH, "utf-8"));
const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
// Get a new token
function getNewToken(oAuth2Client) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
    });
    console.log("Authorize this app by visiting this URL:", authUrl);
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question("Enter the code from that page here: ", (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) {
                console.error("Error retrieving access token", err);
                return;
            }
            oAuth2Client.setCredentials(token);
            fs_1.default.writeFileSync(TOKEN_PATH, JSON.stringify(token));
            console.log("Token stored to", TOKEN_PATH);
        });
    });
}
// Run the token generation
getNewToken(oAuth2Client);
