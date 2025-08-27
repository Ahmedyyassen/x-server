import { BAD_REQUEST, CREATED, OK } from "../constant/http.js";
import { commentSchema } from "../lib/joi.js";
import asyncHandler from "../middleware/asyncHandler.js";
import CommentModel from "../model/comment.model.js";
import { createCommentService, deleteCommentService } from "../service/comment.service.js";
import appAssert from "../utils/appAssert.js";
export const getComments = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const comments = await CommentModel.find({ post: postId })
        .sort({ createdAt: -1 })
        .populate("user", "username fullName profilePicture");
    res.status(OK).json({ comments });
});
export const createComment = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const { postId } = req.params;
    const { content } = req.body;
    const { error } = commentSchema(req.body);
    appAssert(!error, BAD_REQUEST, error?.details[0].message);
    const { comment } = await createCommentService({ userId, postId, content });
    res.status(CREATED).json({ comment });
});
export const deleteComment = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const { commentId } = req.params;
    const { message } = await deleteCommentService({ userId, commentId });
    res.status(OK).json({ message });
});
