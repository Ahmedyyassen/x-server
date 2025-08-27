import { NOT_FOUND } from "../constant/http.js";
const notFoundHandler = (req, res, next) => {
    res.status(NOT_FOUND).json({
        message: `Route ${req.originalUrl} not found`,
    });
};
export default notFoundHandler;
