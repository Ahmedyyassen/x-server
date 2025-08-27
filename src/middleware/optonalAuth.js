import appAssert from "../utils/appAssert.js";
import { UNAUTHORIZED } from "../constant/http.js";
import { verifyToken } from "../utils/jsonwebtoken.js";
const optionalAuth = (req, res, next) => {

    const authHeader = req.headers["authorization"] || req.headers["Authorization"];
    const token = req.cookies.token || (authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null);

    if (!token) {
        req.userId = null;
        return next();
    }
    try {
        const decoded = verifyToken(token);
        appAssert(decoded, UNAUTHORIZED, "invalid access token");
        req.userId = decoded.userId;
        req.username = decoded.username;
    }
    catch(err) {
        req.userId = null; // invalid token → treat as guest
        req.username = null;
    }
    next();
};
export default optionalAuth;
