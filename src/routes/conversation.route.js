import protectedRoute from "../middleware/auth.middleware.js";
import { deleteConversation, getConversations } from "../controller/conversation.controller.js";
import validateObjectID from "../middleware/validateObjectID.js";
export default (router) => {
    router.route("/conversations").get(protectedRoute, getConversations);
    router.route("/conversations/:id").delete(protectedRoute, validateObjectID, deleteConversation);
};
