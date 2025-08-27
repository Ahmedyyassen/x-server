import Joi from "joi";
export const commentSchema = (obj) => {
    const mySchema = Joi.object({
        content: Joi.string().trim().max(280).required()
    });
    return mySchema.validate(obj);
};
export const profileValidation = (obj) => {
    const mySchema = Joi.object({
        fullName: Joi.string().trim().max(280).optional(),
        bio: Joi.string().trim().max(280).optional(),
        location: Joi.string().trim().optional()
    });
    return mySchema.validate(obj);
};
export const changePasswordValidation = (obj) => {
    const mySchema = Joi.object({
        currentPassword: Joi.string().trim().min(6).max(100).required(),
        newPassword: Joi.string().trim().min(6).max(100).required(),
    });
    return mySchema.validate(obj);
};
