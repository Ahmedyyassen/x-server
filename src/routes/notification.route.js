import protectedRoute from "../middleware/auth.middleware.js";
import { deleteNotification, getNotifications } from "../controller/notification.controller.js";
export default (router) => {
    router.route("/notifications").get(protectedRoute, getNotifications);
    router.route("/notifications/:notificationId").delete(protectedRoute, deleteNotification);
};
