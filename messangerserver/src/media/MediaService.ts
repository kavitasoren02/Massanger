import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary";
import MediaModal from "./modals/Media";

export const uploadToCloudinary = async (buffer: Express.Multer.File) => {
  const result = await new Promise<UploadApiResponse | undefined>(
    (resolve, reject) => {
      const fileUpload = cloudinary.uploader.upload_stream(
        {
          folder: "Massanger",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      fileUpload.end(buffer.buffer);
    },
  );
  return {
    publicId: result?.public_id,
    url: result?.secure_url,
    resourceType: result?.resource_type,
    format: result?.format,
    size: result?.bytes,
    orgininalName: result?.original_filename,
  };
};

export const uploadFiles = async (
  files: Express.Multer.File[],
  uploadedBy: string,
) => {
  const result = Promise.all(
    files.map((file) => {
      return { ...uploadToCloudinary(file), uploadedBy: uploadedBy };
    }),
  );
  const uploadedResult = await MediaModal.insertMany(result);

  return uploadedResult;
};
