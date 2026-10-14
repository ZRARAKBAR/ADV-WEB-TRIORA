
export function createReview({
  id = "",
  productId = "",
  customerName = "",
  rating = 5,
  comment = "",
}) {
  return {
    id,
    productId,
    customerName,
    rating: Math.min(5, Math.max(1, Number(rating) || 1)),
    comment,
  };
}
