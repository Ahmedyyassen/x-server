import { INTERNAL_SERVER_ERROR } from "../constant/http.js";
import AppError from "../utils/AppError.js";
const errorHandler = (err, req, res, next) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message });
    }
    console.error(err.stack);
    return res.status(INTERNAL_SERVER_ERROR).send("Internal server error");
};
export default errorHandler;
