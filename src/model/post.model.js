import { model, Schema } from "mongoose";
const PostSchema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    content: { type: String, trim: true },
    image: { type: String, default: "" },
    likes: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    comments: {
        type: [Schema.Types.ObjectId],
        ref: "Comment",
        default: []
    }
}, { timestamps: true });
const PostModel = model("Post", PostSchema);
export default PostModel;
