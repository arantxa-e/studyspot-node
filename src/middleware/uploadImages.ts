import multer from "multer";

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Invalid extension"));
    }

    return cb(null, true);
  },
});

export const imageUpload = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "photos", maxCount: 8 },
]);
