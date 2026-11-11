
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/api";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data.product);
      } catch (err) {
        setError("Unable to load product.");
      }
    };

    fetchProduct();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!product) return <p>Loading product...</p>;

  return (
    <div className="container">
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <h2>Rs. {product.discountPrice || product.price}</h2>
    </div>
  );
}
