import { NODE_ENV } from "../constant/env.js";
import { ONE_DAY } from "./date.js";
const cookieOption = {
    expires: ONE_DAY(),
    httpOnly: true,
    secure: NODE_ENV === 'production',
    sameSite: 'lax',
    path: "/",
};
export const AuthCookie = (res, token) => {
    return res.cookie("token", token, cookieOption);
};
export const ClearCookies = (res) => {
    return res.clearCookie("token", cookieOption);
};
