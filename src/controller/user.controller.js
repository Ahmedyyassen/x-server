import { BAD_REQUEST, NOT_FOUND, OK } from "../constant/http.js";
import { changePasswordValidation, profileValidation } from "../lib/joi.js";
import asyncHandler from "../middleware/asyncHandler.js";
import UserModel from "../model/user.model.js";
import { followUserService } from "../service/user.service.js";
import appAssert from "../utils/appAssert.js";
import base64 from "../utils/base64.js";
import { deleteImage, uploadImage } from "../utils/cloudinary.js";
import extractPublicId from "../utils/extractPublicId.js";
export const syncUser = asyncHandler(async (req, res) => {
    if (!req.userId) {
        // Not logged in → return null instead of 401
        return res.status(OK).json({ user: null });
    }
    const user = await UserModel.findById(req.userId).select("fullName username profilePicture");
    appAssert(user, NOT_FOUND, "User not found");
    res.status(OK).json({ user });
});
export const getUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await UserModel.findById(userId).select("-password");
    appAssert(user, NOT_FOUND, "User not found");
    res.status(OK).json({ user });
});
export const getUserUsername = asyncHandler(async (req, res) => {
    const username = req.params.username;
    const user = await UserModel.findOne({ username }).select("-password");
    appAssert(user, NOT_FOUND, "User not found");
    res.status(OK).json({ user });
});
export const followUserHandler = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const { id } = req.params;
    const { message } = await followUserService({ userId, targetUserId: id });
    res.status(OK).json({ message });
});
export const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const files = req.files; // 👈 Cast here
    const profileFile = files?.profileImage?.[0];
    const bannerFile = files?.bannerImage?.[0];
    const { error } = profileValidation(req.body);
    appAssert(!error, BAD_REQUEST, error?.details[0].message);
    const user = await UserModel.findById(userId).select("-password");
    appAssert(user, NOT_FOUND, "User not found");
    let profilePicture = user.profilePicture;
    let bannerImage = user.bannerImage;
    // Handle profile image update
    if (profileFile) {
        const oldProfilePublicId = extractPublicId(user.profilePicture);
        if (oldProfilePublicId) {
            await deleteImage(oldProfilePublicId);
        }
        const profile64 = base64(profileFile);
        profilePicture = await uploadImage(profile64);
    }
    // Handle banner image update
    if (bannerFile) {
        const oldBannerPublicId = extractPublicId(user.bannerImage);
        if (oldBannerPublicId) {
            await deleteImage(oldBannerPublicId);
        }
        const banner64 = base64(bannerFile);
        bannerImage = await uploadImage(banner64);
    }
    // Update user
    const newUser = await UserModel.findByIdAndUpdate(userId, { ...req.body, profilePicture, bannerImage }, { new: true });
    appAssert(newUser, NOT_FOUND, "User not found");
    res.status(OK).json({ newUser, message: "User updated successfully" });
});
export const changePassword = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const { error } = changePasswordValidation(req.body);
    const { currentPassword, newPassword } = req.body;
    appAssert(!error, BAD_REQUEST, error?.details[0].message);
    const user = await UserModel.findById(userId);
    appAssert(user, NOT_FOUND, "User not found");
    const isMatched = await user.comparePassword(currentPassword);
    appAssert(isMatched, BAD_REQUEST, "current password is incorrect");
    const hashedPassword = await user.hashPassword(newPassword);
    const newUser = await UserModel.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
    appAssert(newUser, NOT_FOUND, "User not found");
    res.status(OK).json({ newUser });
});
export const getFriendsHandler = asyncHandler(async (req, res) => {
    const userId = req.userId;
    // 1️⃣ Get the current user
    const user = await UserModel.findById(userId).select("followers following");
    appAssert(user, NOT_FOUND, "User not found");
    // 2️⃣ Find intersection between followers and following
    const friends = await UserModel.find({
        $and: [
            { _id: { $in: user.following } },
            { _id: { $in: user.followers } }
        ]
    }).select("fullName username email profilePicture");
    res.status(OK).json({ friends });
});
