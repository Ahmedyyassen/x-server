import { model, Schema } from "mongoose";
const ConversationSchema = new Schema({
    participants: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    messages: { type: [Schema.Types.ObjectId], ref: "Message", default: [] },
    lastMessage: { type: Schema.Types.ObjectId, ref: "Message" },
}, { timestamps: true });
const ConversationModel = model("Conversation", ConversationSchema);
export default ConversationModel;
