
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    image: {
      type: String,
      trim: true,
      default: "",
    },
    ageGroup: {
      type: String,
      enum: ["newborn", "kids", "teen", "adult", "accessories"],
      required: true,
    },
    gender: {
      type: String,
      enum: ["boys", "girls", "men", "women", "unisex"],
      default: "unisex",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

categorySchema.index(
  { slug: 1, ageGroup: 1, gender: 1 },
  { unique: true }
);

categorySchema.index({ ageGroup: 1, gender: 1, isActive: 1 });

export default mongoose.model("Category", categorySchema);
