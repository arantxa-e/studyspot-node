import multer from "multer";

const upload = multer();
export const processFormData = upload.none();
