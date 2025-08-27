import "dotenv/config";
const getEnv = (key, defaultValue) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};
export const PORT = getEnv("PORT", "3000");
export const MONGO_URI = getEnv("MONGO_URI");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const NODE_ENV = getEnv("NODE_ENV");
export const RESET_TOKEN_SECRET = getEnv("RESET_TOKEN_SECRET");
export const CLIENT_API = getEnv("CLIENT_API");
export const CLOUDINARY_NAME = getEnv("CLOUDINARY_NAME");
export const CLOUDINARY_API_KEY = getEnv("CLOUDINARY_API_KEY");
export const CLOUDINARY_API_SECRET = getEnv("CLOUDINARY_API_SECRET");
export const APP_EMAIL_ADDRESS = getEnv("APP_EMAIL_ADDRESS");
export const APP_EMAIL_PASSWORD = getEnv("APP_EMAIL_PASSWORD");
