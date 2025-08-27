import multer from "multer";
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    if (file?.mimetype?.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(new Error("Only image files are allowed")); //✅ Reject with error only
    }
};
const upload = multer({
    storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});
export default upload;
