import { model, Schema } from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt.js";
import { signToken } from "../utils/jsonwebtoken.js";
import genAvatar from "../utils/avatar.js";
const userSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: genAvatar(),
    },
    bannerImage: {
        type: String,
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    location: { type: String, default: "" },
    isAccountVerified: {
        type: Boolean,
        default: false,
    },
    followers: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: [],
    },
    following: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: [],
    },
    posts: {
        type: [Schema.Types.ObjectId],
        ref: "Post",
        default: [],
    },
}, {
    timestamps: true,
});
userSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    this.password = await hashValue(this.password);
    next();
});
userSchema.methods.hashPassword = async function (password) {
    return await hashValue(password);
};
userSchema.methods.comparePassword = async function (password) {
    return await compareValue(password, this.password);
};
userSchema.methods.omitPassword = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};
userSchema.methods.generateToken = function () {
    return signToken({ userId: this._id, username: this.username });
};
const UserModel = model("User", userSchema);
export default UserModel;
