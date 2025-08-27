import { model, Schema } from "mongoose";
const CommentSchema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    post: { type: Schema.Types.ObjectId, required: true, ref: "Post" },
    content: { type: String, maxlength: 280, trim: true },
    likes: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: []
    }
}, { timestamps: true });
const CommentModel = model("Comment", CommentSchema);
export default CommentModel;
