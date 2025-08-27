import { model, Schema } from "mongoose";
const MessageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: false },
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    messageType: { type: String, enum: ["text", "file"], required: true },
    content: { type: String, required: function () { return this.messageType === "text"; } },
    fileUrl: { type: String, required: function () { return this.messageType === "file"; } },
}, { timestamps: true });
const MessageModel = model("Message", MessageSchema);
export default MessageModel;
