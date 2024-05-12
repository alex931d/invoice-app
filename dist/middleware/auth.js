"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretKey = process.env.SECRET_KEY;
function verifyToken(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!secretKey) {
        return res.status(401).json({ success: false, message: "no secretKey" });
    }
    jsonwebtoken_1.default.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res
                .clearCookie("jwt")
                .status(401)
                .json({ success: false, message: "Unauthorized" });
        }
        const decodedUser = decoded;
        req.user = decodedUser.user;
        next();
    });
}
exports.default = verifyToken;
