import assert from "assert";
import AppError from "./AppError.js";
const appAssert = (condition, statusCode, message) => assert(condition, new AppError(statusCode, message));
export default appAssert;
