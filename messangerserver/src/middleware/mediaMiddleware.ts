import multer from "multer";

export const storage = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 10,
        files: 10
    }
});

