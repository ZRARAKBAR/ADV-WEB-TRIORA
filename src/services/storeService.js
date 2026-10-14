import { demoProducts, demoCategories } from "../data/demoData";

export async function loadProducts() {
  return {
    data: demoProducts,
    source: "demo",
    message: "Showing demo products."
  };
}

export async function loadCategories() {
  return {
    data: demoCategories,
    source: "demo",
    message: "Showing demo categories."
  };
}
 