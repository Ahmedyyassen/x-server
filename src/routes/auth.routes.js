import { checkForgetPasswordOTP, forgetPasswordCtrl, loginHandler, logOutHandler, registerHandler, resetPasswordCtrl, verifyUserAccoutCtrl } from "../controller/auth.controller.js";
import protectedRoute from "../middleware/auth.middleware.js";
export default (router) => {
    router.route('/auth/register').post(registerHandler);
    router.route('/auth/login').post(loginHandler);
    router.route("/auth/logout").post(protectedRoute, logOutHandler);
    router.route('/auth/verifyAccount').post(verifyUserAccoutCtrl);
    router.route('/auth/forgetPassword').post(forgetPasswordCtrl);
    router.route('/auth/check-forgetpassword-otp').post(checkForgetPasswordOTP);
    router.route('/auth/resetpassword').post(resetPasswordCtrl);
};
