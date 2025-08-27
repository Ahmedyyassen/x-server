import { BAD_REQUEST, CONFLICT, NOT_FOUND } from "../constant/http.js";
import UserModel from "../model/user.model.js";
import VerificationOTP from "../model/verificationOTP.js";
import appAssert from "../utils/appAssert.js";
import { verifyAccountTemplate } from "../utils/htmlTempelate.js";
import { sendEmail } from "../utils/sendEmail.js";
import { oneMinuteExpiry, generateFourDigitOTP } from "../constant/otp.js";
export const createUser = async ({ fullName, email, password, }) => {
    const existingUser = await UserModel.exists({ email });
    appAssert(!existingUser, CONFLICT, "User already exists");
    const username = `${email.split("@")[0]}_${Math.floor(Math.random() * 10000)}`;
    const user = await UserModel.create({
        fullName,
        username,
        email,
        password,
    });
    const verifyOTP = await VerificationOTP.create({
        user: user._id,
        otp: generateFourDigitOTP(),
        timestamp: new Date()
    });
    await sendEmail(user.email, "Verify Your Email", verifyAccountTemplate(verifyOTP.otp));
    return {
        message: "We send OTP code to your email please check your email address"
    };
};
export const loginUser = async ({ email, password }) => {
    const user = await UserModel.findOne({ email });
    appAssert(user, NOT_FOUND, "User not found");
    const isMatch = await user.comparePassword(password);
    appAssert(isMatch, BAD_REQUEST, "Password is incorrect");
    if (!user.isAccountVerified) {
        let verifyOTP = await VerificationOTP.findOne({ user: user._id });
        if (!verifyOTP) {
            verifyOTP = await VerificationOTP.create({
                user: user._id,
                otp: generateFourDigitOTP(),
                timestamp: new Date(),
                attempts: 0,
            });
        }
        else {
            const sendNextOTP = oneMinuteExpiry(verifyOTP.timestamp);
            appAssert(sendNextOTP, BAD_REQUEST, "You must wait 1 minute to send the next otp number");
            verifyOTP = await VerificationOTP.findOneAndUpdate({ user: user._id }, { otp: generateFourDigitOTP(), timestamp: new Date(), attempts: 0 }, { upsert: true, setDefaultsOnInsert: true, new: true });
        }
        await sendEmail(user.email, "Verify Your Email", verifyAccountTemplate(verifyOTP?.otp));
        return { otpSent: true }; // Always return consistent type
    }
    const token = user.generateToken();
    return {
        user: user.omitPassword(),
        token
    };
};
