import { cloudinary_folder_name } from "../constant/cloudinary.js";
const extractPublicId = (cloudinaryUrl) => {
    if (cloudinaryUrl.includes(cloudinary_folder_name)) {
        const path = cloudinaryUrl.split("/upload/")[1]; // e.g. v1754352033/Boom_Shop-images/ambzpclfrydyuhdnw9w4.png
        const parts = path.split("/");
        parts.shift(); // remove version part (e.g. v1754352033)
        const fileWithExt = parts.pop(); // ambzpclfrydyuhdnw9w4.png
        const fileName = fileWithExt?.split(".").slice(0, -1).join("."); // remove extension
        return [...parts, fileName].join("/"); // Boom_Shop-images/ambzpclfrydyuhdnw9w4
    }
    else {
        return null;
    }
};
export default extractPublicId;
