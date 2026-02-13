import mongoose from "moongoose";

const fileSchema = new moongoose.Schema(
  {
    filename: String,
    filepath: String,
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("File", fileSchema);