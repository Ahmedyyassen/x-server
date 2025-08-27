import { createComment, deleteComment, getComments } from "../controller/comment.controller.js";
import protectedRoute from "../middleware/auth.middleware.js";
export default (router) => {
    router.route("/comments/post/:postId")
        .get(getComments)
        .post(protectedRoute, createComment);
    router.route("/comments/:commentId").delete(protectedRoute, deleteComment);
};
