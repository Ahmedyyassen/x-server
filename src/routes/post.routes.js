import { createPostHandler, deletePostHandler, getPostsHandler, getSinglePostHandler, getUserPostsHandler, likePostHandler, updatePostHandler } from "../controller/post.controller.js";
import upload from "../middleware/upload.middleware.js";
import protectedRoute from "../middleware/auth.middleware.js";
export default (router) => {
    router.route("/posts").get(getPostsHandler)
        .post(protectedRoute, upload.single("image"), createPostHandler);
    router.route("/posts/:postId").get(getSinglePostHandler)
        .put(protectedRoute, upload.single("image"), updatePostHandler)
        .delete(protectedRoute, deletePostHandler);
    router.route("/posts/user/:username").get(getUserPostsHandler);
    router.route("/posts/:postId/like").post(protectedRoute, likePostHandler);
    //?protected route
};
