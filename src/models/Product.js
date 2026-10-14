
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

const PRODUCTS = "products";

function validateProduct(data) {
  if (!data.name?.trim()) {
    throw new Error("Product name is required.");
  }

  if (!data.category?.trim()) {
    throw new Error("Product category is required.");
  }

  const price = Number(data.price);
  const stock = Number(data.stock);

  if (!Number.isFinite(price) || price < 0) {
    throw new Error("Price must be a valid non-negative number.");
  }

  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error("Stock must be a non-negative integer.");
  }

  return {
    name: data.name.trim(),
    category: data.category.trim(),
    price,
    stock,
    imageUrl: data.imageUrl?.trim() || "",
    brand: data.brand?.trim() || "",
    description: data.description?.trim() || "",
  };
}

export async function createProduct(data) {
  const product = validateProduct(data);

  const docRef = await addDoc(collection(db, PRODUCTS), {
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return { id: docRef.id, ...product };
}

export async function getProducts() {
  const productsQuery = query(
    collection(db, PRODUCTS),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(productsQuery);

  return snapshot.docs.map((item) => ({
    id: item.id,
    ...item.data(),
  }));
}

export async function getProductById(id) {
  const snapshot = await getDoc(doc(db, PRODUCTS, id));

  if (!snapshot.exists()) {
    return null;
  }

  return { id: snapshot.id, ...snapshot.data() };
}

export async function updateProduct(id, changes) {
  const allowedFields = [
    "name",
    "category",
    "price",
    "stock",
    "imageUrl",
    "brand",
    "description",
  ];

  const safeChanges = Object.fromEntries(
    Object.entries(changes).filter(([key]) =>
      allowedFields.includes(key)
    )
  );

  const current = await getProductById(id);

  if (!current) {
    throw new Error("Product not found.");
  }

  const updated = validateProduct({
    ...current,
    ...safeChanges,
  });

  await updateDoc(doc(db, PRODUCTS, id), {
    ...updated,
    updatedAt: serverTimestamp(),
  });

  return { id, ...updated };
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, PRODUCTS, id));
}
