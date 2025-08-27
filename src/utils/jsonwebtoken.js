import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constant/env.js";
const signTokenOptions = {
    expiresIn: "1d",
    secret: JWT_SECRET,
    audience: ['user']
};
const veridyTokenOptions = {
    audience: ['user'],
    secret: JWT_SECRET,
};
export const signToken = (payload) => {
    const { secret, ...options } = signTokenOptions || {};
    return jwt.sign(payload, secret, options);
};
export const verifyToken = (token) => {
    const { secret, ...options } = veridyTokenOptions || {};
    return jwt.verify(token, secret, options);
};
