import { Router } from "express";
import { asyncHandler } from "../async.js";
import multer from "multer";

const router = Router();
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    console.log(file)
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });
router.post(
  "/upload",
  upload.single("file"),
  asyncHandler((req, res) => {
    console.log(req.file)
    res.json({ message: "File uploaded successfully" });
  }),
);

export default router;
