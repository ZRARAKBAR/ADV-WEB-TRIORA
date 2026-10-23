
import mongoose from "mongoose";
import Review from "../models/Review.js";
import Product from "../models/Product.js";

const getUserId = (req) =>
  req.user?._id || req.user?.id || req.user?.userId;

export const addReview = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { product, rating, comment } = req.body;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    if (!mongoose.isValidObjectId(product)) {
      return res.status(400).json({
        message: "A valid product ID is required.",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        message: "Rating must be a whole number from 1 to 5.",
      });
    }

    const productExists = await Product.exists({ _id: product });

    if (!productExists) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    const review = await Review.create({
      product,
      user: userId,
      rating: numericRating,
      comment: comment?.trim() || "",
    });

    await review.populate("user", "name");

    return res.status(201).json({
      message: "Review submitted successfully.",
      review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already reviewed this product.",
      });
    }

    console.error("Add review error:", error.message);
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        message: "Invalid product ID.",
      });
    }

    const productExists = await Product.exists({ _id: productId });

    if (!productExists) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    const reviews = await Review.find({ product: productId })
      .populate("user", "name")
      .sort({ createdAt: -1 });

    const averageRating = reviews.length
      ? Number(
          (
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length
          ).toFixed(1)
        )
      : 0;

    return res.json({
      product: productId,
      count: reviews.length,
      averageRating,
      reviews,
    });
  } catch (error) {
    console.error("Get product reviews error:", error.message);
    return res.status(500).json({
      message: "Unable to retrieve reviews.",
    });
  }
};
