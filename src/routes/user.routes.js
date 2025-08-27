import protectedRoute from "../middleware/auth.middleware.js";
import { changePassword, followUserHandler, getUserById, getUserUsername, syncUser, updateProfile } from "../controller/user.controller.js";
import optionalAuth from "../middleware/optonalAuth.js";
import upload from "../middleware/upload.middleware.js";
import validateObjectID from "../middleware/validateObjectID.js";
export default (router) => {
    router.route("/users/sync").get(optionalAuth, syncUser);
    router.route("/users/:id").get(protectedRoute, validateObjectID, getUserById);
    router.route("/users/username/:username").get(protectedRoute, getUserUsername);
    router.route("/users/follow/:id").post(protectedRoute, validateObjectID, followUserHandler);
    router.route("/users/profile").put(protectedRoute, upload.fields([
        { name: "profileImage", maxCount: 1 },
        { name: "bannerImage", maxCount: 1 }
    ]), updateProfile);
    router.route("/users/profile/password").put(protectedRoute, changePassword);
};
