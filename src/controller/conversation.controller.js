import { NOT_FOUND, OK } from "../constant/http.js";
import asyncHandler from "../middleware/asyncHandler.js";
import ConversationModel from "../model/conversation.model.js";
import MessageModel from "../model/Message.model.js";
import appAssert from "../utils/appAssert.js";
export const getConversations = asyncHandler(async (req, res) => {
    const userId = req.userId;
    const conversations = await ConversationModel.find({
        participants: userId
    })
        .populate("participants", "fullName username email profilePicture")
        .populate("messages")
        .populate({
        path: "lastMessage",
        select: "content createdAt", // select only useful fields
    })
        .sort({ updatedAt: -1 }); // latest first
    res.status(OK).json({ conversations });
});
export const deleteConversation = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const conversation = await ConversationModel.findByIdAndDelete(id);
    appAssert(conversation, NOT_FOUND, "Conversation not found");
    await MessageModel.deleteMany({ conversationId: id });
    res.status(OK).json({ message: "Conversation was deleted successfully." });
});
