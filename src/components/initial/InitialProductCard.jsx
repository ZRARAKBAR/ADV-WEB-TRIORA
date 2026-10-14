
import { useState } from "react";

function InitialProductCard({ product }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="product-card">
      <div className={`product-image ${product.color || "sand"}`}>
        {product.badge && (
          <span className="product-badge">{product.badge}</span>
        )}

        {product.imageUrl && !imageFailed && (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        )}

        {imageFailed && (
          <div className="image-placeholder">
            <span>TRIORA</span>
            <small>EVERYDAY ESSENTIALS</small>
          </div>
        )}

        {!product.imageUrl && (
          <div className="image-placeholder">
            <span>TRIORA</span>
            <small>EVERYDAY ESSENTIALS</small>
          </div>
        )}
      </div>

      <div className="product-info">
        <div>
          <p className="product-category">{product.category}</p>
          <h3>{product.name}</h3>
        </div>

        <p className="product-price">
          Rs. {Number(product.price || 0).toLocaleString("en-PK")}
        </p>
      </div>

      <div className="product-bottom">
        <span>Essential collection</span>
        <a href="#contact" aria-label={`Enquire about ${product.name}`}>
          ↗
        </a>
      </div>
    </article>
  );
}

export default InitialProductCard;
