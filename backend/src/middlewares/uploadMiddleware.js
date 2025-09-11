import multer from "multer";

const storage = multer.memoryStorage(); // lưu file tạm trong RAM

const upload = multer({ storage });

export default upload;
