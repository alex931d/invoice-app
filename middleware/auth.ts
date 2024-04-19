import { Request, Response, NextFunction } from "express";
import { IUser, User } from "../models/schema";
import jwt, { VerifyErrors, VerifyOptions } from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY;

function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  if (!secretKey) {
    return res.status(401).json({ success: false, message: "no secretKey" });
  }
  jwt.verify(token, secretKey, (err: VerifyErrors | null, decoded: unknown) => {
    if (err) {
      return res
        .clearCookie("jwt")
        .status(401)
        .json({ success: false, message: "Unauthorized" });
    }

    const decodedUser = decoded as { user: IUser };
    req.user = decodedUser.user;
    next();
  });
}

export default verifyToken;
