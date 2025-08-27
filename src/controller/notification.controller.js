import { NOT_FOUND, OK } from "../constant/http.js";
import asyncHandler from "../middleware/asyncHandler.js";
import NotificationModel from "../model/notification.model.js";
import UserModel from "../model/user.model.js";
import appAssert from "../utils/appAssert.js";
export const getNotifications = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    appAssert(user, NOT_FOUND, "User not found");
    const notifications = await NotificationModel.find({ to: user._id })
        .sort({ createdAt: -1 })
        .populate("from", "username fullName profilePicture")
        .populate("post", "content image")
        .populate("comment", "content");
    res.status(OK).json({ notifications });
});
export const deleteNotification = asyncHandler(async (req, res, next) => {
    const userId = req.userId;
    const { notificationId } = req.params;
    const user = await UserModel.findById(userId);
    appAssert(user, NOT_FOUND, "User not found");
    const notification = await NotificationModel.findOneAndDelete({
        _id: notificationId,
        to: user._id
    });
    appAssert(notification, NOT_FOUND, "Notification not found");
    res.status(OK).json({ message: "Notification has been deleted" });
});
