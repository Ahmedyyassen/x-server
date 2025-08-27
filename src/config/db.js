import { connect } from "mongoose";
import { MONGO_URI } from "../constant/env.js";
const connectDB = async () => {
    try {
        const conn = await connect(MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.log(`Error during connection to MongoDB: ${error.message}`);
        process.exit(1);
    }
};
export default connectDB;
