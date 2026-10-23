
import mongoose from "mongoose";
import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    const {
      search,
      ageGroup,
      gender,
      category,
      collection,
      featured,
      minPrice,
      maxPrice,
      page = "1",
      limit = "20",
    } = req.query;

    const filter = {};

    if (ageGroup) filter.ageGroup = ageGroup;
    if (gender) filter.gender = gender;
    if (category) filter.category = category.toLowerCase();
    if (collection) {
      filter.collections = collection.toLowerCase();
    }
    if (featured !== undefined) {
      if (!["true", "false"].includes(featured)) {
        return res.status(400).json({
          message: "featured must be true or false.",
        });
      }
      filter.isFeatured = featured === "true";
    }

    if (search?.trim()) {
      filter.$text = { $search: search.trim() };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter = {};

      if (minPrice !== undefined) {
        priceFilter.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined) {
        priceFilter.$lte = Number(maxPrice);
      }

      if (
        Object.values(priceFilter).some((value) => !Number.isFinite(value)) ||
        Object.values(priceFilter).some((value) => value < 0)
      ) {
        return res.status(400).json({
          message: "Price filters must be valid non-negative numbers.",
        });
      }

      filter.price = priceFilter;
    }

    const pageNumber = Number(page);
    const pageSize = Number(limit);

    if (
      !Number.isInteger(pageNumber) ||
      !Number.isInteger(pageSize) ||
      pageNumber < 1 ||
      pageSize < 1 ||
      pageSize > 100
    ) {
      return res.status(400).json({
        message: "Page must be positive and limit must be between 1 and 100.",
      });
    }

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize),
      Product.countDocuments(filter),
    ]);

    return res.json({
      products,
      pagination: {
        total,
        page: pageNumber,
        limit: pageSize,
        pages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Get products error:", error.message);
    return res.status(500).json({
      message: "Unable to retrieve products.",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = mongoose.isValidObjectId(id)
      ? await Product.findById(id)
      : await Product.findOne({ _id: null });

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    return res.json({ product });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to retrieve product.",
    });
  }
};

export const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    return res.status(201).json({
      message: "Product created successfully.",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    return res.json({
      message: "Product updated successfully.",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid product ID.",
      });
    }

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    return res.json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Unable to delete product.",
    });
  }
};
