import mongoose, { Document, Schema } from "mongoose";
import { IUSER } from "../../users/modals/User";

export interface IMEDIA extends Document {
  orgininalName: string;
  publicId: string;
  url: string;
  resourceType: string;
  format: string;
  size: number;
  uploadedBy: IUSER;
}

const MediaSchema: Schema<IMEDIA> = new Schema(
  {
    orgininalName: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    resourceType: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const MediaModal = mongoose.model<IMEDIA>("Media", MediaSchema);

export default MediaModal;
