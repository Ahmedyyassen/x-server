import mongoose from 'mongoose';
import { BAD_REQUEST } from '../constant/http.js';
const validateObjectID = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(BAD_REQUEST).json({ message: "Invalid object ID" });
    }
    next();
};
export default validateObjectID;
