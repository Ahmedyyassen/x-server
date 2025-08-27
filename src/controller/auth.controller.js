import { RESET_TOKEN_SECRET } from "../constant/env.js";
import { BAD_REQUEST, CREATED, NOT_FOUND, OK } from "../constant/http.js";
import { generateFourDigitOTP, oneMinuteExpiry, threeMinuteExpiry } from "../constant/otp.js";
import asyncHandler from "../middleware/asyncHandler.js";
import UserModel from "../model/user.model.js";
import VerificationOTP from "../model/verificationOTP.js";
import { createUser, loginUser } from "../service/auth.service.js";
import appAssert from "../utils/appAssert.js";
import { AuthCookie, ClearCookies } from "../utils/cookies.js";
import { resetPasswordTemplate, welcomeTemplate } from "../utils/htmlTempelate.js";
import { sendEmail } from "../utils/sendEmail.js";
import { loginValidation, registerValidation } from "../utils/validateUser.js";
import jwt from "jsonwebtoken";
export const registerHandler = asyncHandler(async (req, res) => {
    const { error } = registerValidation(req.body);
    appAssert(!error, BAD_REQUEST, error?.details[0].message);
    const { message } = await createUser(req.body);
    await sendEmail(req.body.email, "Welcome to X", welcomeTemplate(req.body.fullName));
    res.status(CREATED).json({ message });
});
export const loginHandler = asyncHandler(async (req, res) => {
    const { error } = loginValidation(req.body);
    appAssert(!error, BAD_REQUEST, error?.details[0].message);
    const result = await loginUser(req.body);
    if ("otpSent" in result && result.otpSent) {
        return res.status(OK).json({
            message: "We sent an OTP code to your email. Please check your inbox."
        });
    }
    const { user, token } = result;
    AuthCookie(res, token).status(OK).json({ token, message: "User Login successfully", user });
});
export const logOutHandler = asyncHandler(async (req, res, next) => {
    req.userId = null;
    req.username = null;
    ClearCookies(res).status(OK).json({ message: "User Logout successfully" });
});
export const verifyUserAccoutCtrl = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    const user = await UserModel.findOne({ email });
    appAssert(user, NOT_FOUND, "User not found");
    const otpDoc = await VerificationOTP.findOne({ user: user._id });
    appAssert(otpDoc, NOT_FOUND, "OTP not found");
    // Too many attempts
    appAssert(otpDoc.attempts < 5, BAD_REQUEST, "Too many failed attempts");
    // Expired
    const isExpired = threeMinuteExpiry(otpDoc.timestamp);
    appAssert(!isExpired, BAD_REQUEST, "OTP code has been expired");
    // Wrong OTP        
    if (otpDoc.otp.toString() !== otp) {
        otpDoc.attempts += 1;
        await otpDoc.save();
        appAssert(false, BAD_REQUEST, "Invalid OTP");
    }
    user.isAccountVerified = true;
    await user.save();
    await VerificationOTP.findOneAndDelete({ user: user._id });
    res.status(OK).json({ message: "Your Account verified successfully" });
});
export const forgetPasswordCtrl = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    appAssert(user, NOT_FOUND, "User not found");
    let otpDoc = await VerificationOTP.findOne({ user: user._id });
    if (!otpDoc) {
        otpDoc = await VerificationOTP.create({
            user: user._id,
            otp: generateFourDigitOTP(),
            timestamp: new Date(),
            attempts: 0
        });
    }
    else {
        const sendNextOTP = oneMinuteExpiry(otpDoc.timestamp);
        appAssert(sendNextOTP, BAD_REQUEST, "Please wait 1 minute before requesting a new OTP");
        otpDoc.otp = generateFourDigitOTP();
        otpDoc.timestamp = new Date();
        otpDoc.attempts = 0;
        await otpDoc.save();
    }
    await sendEmail(user.email, "Reset Your Password", resetPasswordTemplate(otpDoc?.otp));
    res.status(OK).json({ message: "We send OTP code to your email please check your email address" });
});
export const checkForgetPasswordOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    const user = await UserModel.findOne({ email });
    appAssert(user, NOT_FOUND, "User not found");
    const otpDoc = await VerificationOTP.findOne({ user: user._id });
    appAssert(otpDoc, BAD_REQUEST, "Invalid OTP not found");
    // Too many attempts
    appAssert(otpDoc.attempts < 5, BAD_REQUEST, "Too many failed attempts");
    // Expired
    const isExpired = threeMinuteExpiry(otpDoc.timestamp);
    appAssert(!isExpired, BAD_REQUEST, "OTP code has been expired");
    // Wrong OTP
    if (otpDoc.otp.toString() !== otp) {
        otpDoc.attempts += 1;
        await otpDoc.save();
        appAssert(false, BAD_REQUEST, "Invalid OTP");
    }
    // OTP correct → delete & generate temporary reset token
    await VerificationOTP.deleteOne({ _id: otpDoc._id });
    const token = jwt.sign({ id: user._id }, RESET_TOKEN_SECRET, { expiresIn: "10m" });
    res.status(OK).json({ message: "OTP has verified successfully", token });
});
export const resetPasswordCtrl = asyncHandler(async (req, res, next) => {
    const { token, password } = req.body;
    const { id } = jwt.verify(token, RESET_TOKEN_SECRET);
    const user = await UserModel.findById(id);
    appAssert(user, NOT_FOUND, "User not found");
    const newPassword = await user.hashPassword(password);
    await UserModel.findByIdAndUpdate(user._id, { password: newPassword }, { new: true });
    res.status(OK).json({ message: "Your password has been changed successfully." });
});
