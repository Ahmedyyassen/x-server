import { Schema, model } from "mongoose";
const VerificationOTPSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    otp: {
        type: Number,
        required: true
    },
    attempts: {
        type: Number,
        default: 0
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now, // ✅ function reference
        set: (value) => new Date(value),
        get: (value) => value.getTime() // ✅ returns number if you want ms
    }
});
const VerificationOTP = model("VerificationOTP", VerificationOTPSchema);
export default VerificationOTP;
