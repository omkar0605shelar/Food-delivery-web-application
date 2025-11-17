import multer from "multer";
import path from "path";

// Store files temporarily in a /uploads folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // not public/
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g., 173092949.png
  },
});

export const upload = multer({ storage });
