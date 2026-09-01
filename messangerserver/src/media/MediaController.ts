import express, { Request, Response } from "express";
import { storage } from "../middleware/mediaMiddleware";
import multer from "multer";
import { uploadFiles } from "./MediaService";

const router = express.Router();

router.post(
  "/upload",
  storage.array("medias"),
  async (req: any, res: Response) => {
    try {
      const currentUserId = req.userId;
      const files = req.files as Express.Multer.File[];
      const uploadedFiles = await uploadFiles(files, currentUserId);

      return res.status(200).json({
        message: "File Uploaded Successfully",
        data: uploadedFiles,
      });
    } catch (error: any) {
      console.log({ error });
      return res.status(500).json({
        detail: error.message || "Something went wrong",
      });
    }
  },
);
export default router;
