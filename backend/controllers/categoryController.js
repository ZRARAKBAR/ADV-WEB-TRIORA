
import mongoose from "mongoose";
import Category from "../models/Category.js";

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const getCategories = async (req, res) => {
  try {
    const filter = {};

    for (const key of ["ageGroup", "gender"]) {
      if (req.query[key]) filter[key] = req.query[key];
    }

    const categories = await Category.find(filter).sort({ name: 1 });

    return res.json({
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error.message);
    return res.status(500).json({
      message: "Unable to retrieve categories.",
    });
  }
};

export const addCategory = async (req, res) => {
  try {
    const { name, slug, ageGroup, gender } = req.body;

    if (!name?.trim() || !ageGroup) {
      return res.status(400).json({
        message: "Category name and age group are required.",
      });
    }

    const category = await Category.create({
      name: name.trim(),
      slug: slug?.trim() ? slugify(slug) : slugify(name),
      ageGroup,
      gender: gender || "unisex",
    });

    return res.status(201).json({
      message: "Category created successfully.",
      category,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This category combination already exists.",
      });
    }

    return res.status(400).json({
      message: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid category ID.",
      });
    }

    const updates = {};
    const { name, slug, ageGroup, gender } = req.body;

    if (name !== undefined) {
      updates.name = name.trim();
      if (slug === undefined) updates.slug = slugify(name);
    }

    if (slug !== undefined) updates.slug = slugify(slug);
    if (ageGroup !== undefined) updates.ageGroup = ageGroup;
    if (gender !== undefined) updates.gender = gender;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
      });
    }

    return res.json({
      message: "Category updated successfully.",
      category,
    });
  } catch (error) {
    return res.status(error.code === 11000 ? 409 : 400).json({
      message:
        error.code === 11000
          ? "This category combination already exists."
          : error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid category ID.",
      });
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        message: "Category not found.",
      });
    }

    return res.json({
      message: "Category deleted successfully.",
      category,
    });
  } catch (error) {
    console.error("Delete category error:", error.message);
    return res.status(500).json({
      message: "Unable to delete category.",
    });
  }
};
