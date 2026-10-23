
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 180,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    brand: {
      type: String,
      default: "TRIORA",
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
      validate: {
        validator(value) {
          return value == null || value < this.price;
        },
        message: "Discount price must be lower than the regular price.",
      },
    },
    currency: {
      type: String,
      enum: ["PKR"],
      default: "PKR",
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
    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    collections: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    sizes: [{ type: String, trim: true }],
    colors: [{ type: String, trim: true }],
    images: [{ type: String, trim: true }],
    stock: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Stock must be a whole number.",
      },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", description: "text" });
productSchema.index({ slug: 1 }, { unique: true, sparse: true });
productSchema.index({ ageGroup: 1, gender: 1, category: 1, isActive: 1 });
productSchema.index({ collections: 1, isActive: 1 });

export default mongoose.model("Product", productSchema);
