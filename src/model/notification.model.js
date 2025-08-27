import { model, Schema } from "mongoose";
const NotificationSchema = new Schema({
    from: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    to: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    type: { type: String, required: true, enum: ["follow", "like", "comment"] },
    post: { type: Schema.Types.ObjectId, default: null, ref: "Post" },
    comment: { type: Schema.Types.ObjectId, default: null, ref: "Comment" },
}, { timestamps: true });
const NotificationModel = model("Notification", NotificationSchema);
export default NotificationModel;
