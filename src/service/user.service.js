import { startSession } from "mongoose";
import { BAD_REQUEST, NOT_FOUND } from "../constant/http.js";
import UserModel from "../model/user.model.js";
import appAssert from "../utils/appAssert.js";
import NotificationModel from "../model/notification.model.js";
import ConversationModel from "../model/conversation.model.js";
export const followUserService = async ({ userId, targetUserId }) => {
    const targetUser = await UserModel.findById(targetUserId);
    appAssert(targetUser, NOT_FOUND, "This Friend is not found");
    const user = await UserModel.findById(userId);
    appAssert(user, NOT_FOUND, "User not found");
    appAssert(user._id.toString() !== targetUser._id.toString(), BAD_REQUEST, "You can't follow yourself");
    // i have already follow him
    const isFollow = user.following.some((id) => id.toString() === targetUser._id.toString());
    const session = await startSession();
    session.startTransaction();
    try {
        if (isFollow) {
            await UserModel.findByIdAndUpdate(user._id, {
                $pull: { following: targetUser._id },
            }, { session });
            await UserModel.findByIdAndUpdate(targetUser._id, {
                $pull: { followers: user._id },
            }, { session });
        }
        else {
            await UserModel.findByIdAndUpdate(user._id, {
                $push: { following: targetUser._id },
            }, { session });
            await UserModel.findByIdAndUpdate(targetUser._id, {
                $push: { followers: user._id },
            }, { session });
            // ! add conversation when i follow any one
            let conversation = await ConversationModel.findOne({
                participants: { $all: [user._id, targetUser._id] }
            });
            conversation?.$session(session);
            if (!conversation) {
                conversation = new ConversationModel({
                    participants: [user._id, targetUser._id]
                });
                conversation.$session(session);
                await conversation.save();
            }
            //! **********************************************
        }
        const notification = new NotificationModel({
            from: user._id,
            to: targetUser._id,
            type: "follow",
        });
        notification.$session(session);
        await notification.save();
        await session.commitTransaction();
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        await session.endSession();
    }
    return {
        message: isFollow ? "Unfollowed successfully" : "Followed successfully",
    };
};
