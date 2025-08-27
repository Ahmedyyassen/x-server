import appAssert from "../utils/appAssert.js";
import { UNAUTHORIZED } from "../constant/http.js";
import { verifyToken } from "../utils/jsonwebtoken.js";
const protectedRoute = (req, res, next) => {
    const token = req.cookies.token || req.headers["authorization"]?.split(" ")[1] || req.headers["Authorization"]?.split(" ")[1];
    appAssert(token, UNAUTHORIZED, "not authorized");
    const decoded = verifyToken(token);
    appAssert(decoded, UNAUTHORIZED, "invalid access token");
    req.userId = decoded.userId;
    req.username = decoded.username;
    next();
};
export default protectedRoute;
