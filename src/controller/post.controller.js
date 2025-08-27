import { BAD_REQUEST, CREATED, NOT_FOUND, OK } from "../constant/http.js";
import asyncHandler from "../middleware/asyncHandler.js";
import PostModel from "../model/post.model.js";
import UserModel from "../model/user.model.js";
import { deletePostService, likePostService } from "../service/post.service.js";
import appAssert from "../utils/appAssert.js";
import base64 from "../utils/base64.js";
import { deleteImage, uploadImage } from "../utils/cloudinary.js";
import extractPublicId from "../utils/extractPublicId.js";
export const getPostsHandler = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalPosts = await PostModel.countDocuments();
    const posts = await PostModel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "username fullName profilePicture")
        .populate({
        path: "comments",
        populate: {
            path: "user",
            select: "username fullName profilePicture"
        }
    });
    const hasMore = skip + posts.length < totalPosts;
    res.status(OK).json({
        posts,
        currentPage: page,
        nextPage: hasMore ? page + 1 : null,
        hasMore,
        totalPosts
    });
});
export const getSinglePostHandler = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const post = await PostModel.findById(postId)
        .populate("user", "username fullName profilePicture")
        .populate({
        path: "comments",
        populate: {
            path: "user",
            select: "username fullName profilePicture"
        }
    });
    appAssert(post, NOT_FOUND, "Post not found");
    res.status(OK).json({ post });
});
export const getUserPostsHandler = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { username } = req.params;
    const totalPosts = await PostModel.countDocuments();
    const user = await UserModel.findOne({ username });
    appAssert(user, NOT_FOUND, "User not found");
    const posts = await PostModel.find({ user: user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "username fullName profilePicture")
        .populate({
        path: "comments",
        populate: {
            path: "user",
            select: "username fullName profilePicture"
        }
    });
    const hasMore = skip + posts.length < totalPosts;
    res.status(OK).json({
        posts,
        currentPage: page,
        nextPage: hasMore ? page + 1 : null,
        hasMore,
        totalPosts
    });
});
export const createPostHandler = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const { content } = req.body;
    const imageFile = req.file;
    appAssert(content || imageFile, BAD_REQUEST, "Post must contain either text or image");
    const user = await UserModel.findById(userId);
    appAssert(user, NOT_FOUND, "User not found");
    let imageUrl = "";
    if (imageFile) {
        try {
            const image = base64(imageFile);
            imageUrl = await uploadImage(image);
        }
        catch (error) {
            console.log("Cloudinary upload error: ", error);
            return res.status(BAD_REQUEST).json({ error: "Failed to upload image" });
        }
    }
    const post = await PostModel.create({
        user: user._id,
        content: content || "",
        image: imageUrl,
    });
    user.posts.push(post._id);
    await user.save();
    res.status(CREATED).json({ message: "Post created successfully", post });
});
export const likePostHandler = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { postId } = req.params;
    const { isLike } = await likePostService({ userId, postId });
    res.status(OK).json({ message: isLike ? "Post unliked successfully" : "Post liked successfully" });
});
export const deletePostHandler = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { postId } = req.params;
    const { message } = await deletePostService({ userId, postId });
    res.status(OK).json({ message });
});
export const updatePostHandler = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { postId } = req.params;
    const imageFile = req.file;
    const user = await UserModel.findById(userId);
    appAssert(user, NOT_FOUND, "User not found");
    const post = await PostModel.findById(postId);
    appAssert(post, NOT_FOUND, "Post not found");
    appAssert(user._id.toString() === post.user.toString(), BAD_REQUEST, "Only the owner of the post can delete it");
    let postImage = post.image;
    // Handle profile image update
    if (imageFile) {
        const oldProfilePublicId = extractPublicId(post.image);
        if (oldProfilePublicId) {
            await deleteImage(oldProfilePublicId);
        }
        const postImage64 = base64(imageFile);
        postImage = await uploadImage(postImage64);
    }
    const newPost = await PostModel.findByIdAndUpdate(post._id, { ...req.body, image: postImage }, { new: true });
    appAssert(newPost, NOT_FOUND, "Post not found");
    res.status(OK).json({ message: "Post updated successfully", newPost });
});
