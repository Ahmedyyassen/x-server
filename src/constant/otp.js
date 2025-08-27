export const generateFourDigitOTP = () => {
    return Math.floor(1000 + Math.random() * 9000);
};
export const oneMinuteExpiry = (otpTime) => {
    const otpTimestamp = typeof otpTime === "number" ? otpTime : otpTime.getTime();
    const diffMinutes = (Date.now() - otpTimestamp) / 1000 / 60;
    return diffMinutes > 1;
};
export const threeMinuteExpiry = (otpTime) => {
    const otpTimestamp = typeof otpTime === "number" ? otpTime : otpTime.getTime();
    const diffMinutes = (Date.now() - otpTimestamp) / 1000 / 60;
    return diffMinutes >= 3; // ✅ true means expired
};
