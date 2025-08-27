import Joi from "joi";
export const registerValidation = (data) => {
    const schema = Joi.object({
        fullName: Joi.string().min(3).max(100).required(),
        email: Joi.string().required().email().pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/),
        password: Joi.string().required().min(6),
        confirmPassword: Joi.string().required().valid(Joi.ref('password')),
    });
    return schema.validate(data);
};
export const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().required().email().pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/),
        password: Joi.string().required().min(6),
    });
    return schema.validate(data);
};
// type ProfileDate ={
//     firstName: string;
//     lastName: string;
//     password: string;
//     profilePicture: string;
// }
// export const profileValidation = (data: ProfileDate) => {
//     const schema = Joi.object<ProfileDate>({
//         firstName: Joi.string().min(3).max(100).optional(),
//         lastName: Joi.string().min(3).max(100).optional(),
//         profilePicture: Joi.string().optional(),
//     });
//     return schema.validate(data);
// };
// type PasswordDate ={
//     currentPassword: string;
//     newPassword: string;
//     confirmNewPassword: string;
// }
// export const changePasswordValidation = (data: PasswordDate) => {
//     const schema = Joi.object<PasswordDate>({
//         currentPassword: Joi.string().required().min(6),
//         newPassword: Joi.string().required().min(6),
//         confirmNewPassword: Joi.string().required().min(6).valid(Joi.ref('newPassword'))
//     });
//     return schema.validate(data);
// };
