import { compare, genSalt, hash } from "bcrypt";
export const hashValue = async (password) => {
    const salt = await genSalt(10);
    return await hash(password, salt);
};
export const compareValue = async (password, hash) => await compare(password, hash);
