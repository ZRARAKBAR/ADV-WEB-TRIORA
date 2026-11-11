import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

const money = (value) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value || 0);

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const image =
    product.images?.[0] ||
    "https://placehold.co/600x750/f4f0e9/222?text=TRIORA";

  const price = product.discountPrice ?? product.price;
  const hasDiscount =
    product.discountPrice != null &&
    product.discountPrice < product.price;

  return (
    <article className="product-card">
      <Link to={`/product/${product._id}`} className="product-image-wrap">
        <img src={image} alt={product.name} loading="lazy" />

        {product.isFeatured && (
          <span className="product-badge">Featured</span>
        )}

        {hasDiscount && (
          <span className="discount-badge">Sale</span>
        )}
      </Link>

      <div className="product-card-info">
        <p className="product-category">{product.category}</p>

        <Link to={`/product/${product._id}`}>
          <h3>{product.name}</h3>
        </Link>

        <div className="product-price">
          <strong>{money(price)}</strong>
          {hasDiscount && (
            <del>{money(product.price)}</del>
          )}
        </div>

        <button
          className="add-small-button"
          onClick={() =>
            addToCart(
              product,
              product.sizes?.[0] || "",
              product.colors?.[0] || "",
              1
            )
          }
          disabled={product.stock <= 0}
        >
          <ShoppingBag size={16} />
          {product.stock > 0 ? "Add to bag" : "Out of stock"}
        </button>
      </div>
    </article>
  );
}