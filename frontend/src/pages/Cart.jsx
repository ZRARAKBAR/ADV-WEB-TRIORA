import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../api/api";

const money = (value) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value || 0);

export default function Cart() {
  const {
    cart,
    total,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState(user?.address || "");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user) {
      navigate("/login");
      return;
    }

    if (!cart.length) return;

    setLoading(true);

    try {
      const orderItems = cart.map((item) => ({
        product: item.product._id,
        qty: item.qty,
        size: item.size,
        color: item.color,
      }));

      const response = await api.post("/orders", {
        items: orderItems,
        shippingAddress,
        paymentMethod,
      });

      clearCart();
      setSuccess(
        `Your order was placed successfully. Order ID: ${response.data.order._id}`
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to place your order.");
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length && !success) {
    return (
      <main className="empty-cart">
        <h1>Your bag is empty</h1>
        <p>Discover something you love from TRIORA.</p>
        <Link to="/products" className="primary-button">Continue shopping</Link>
      </main>
    );
  }

  return (
    <main className="section cart-page">
      <p className="eyebrow">YOUR TRIORA BAG</p>
      <h1>Shopping cart</h1>

      {success && <p className="success-message">{success}</p>}
      {error && <p className="error-message">{error}</p>}

      {cart.length > 0 && (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <article
                className="cart-item"
                key={`${item.product._id}-${item.size}-${item.color}`}
              >
                <img
                  src={item.product.images?.[0] || "https://placehold.co/160x190"}
                  alt={item.product.name}
                />

                <div className="cart-item-info">
                  <Link to={`/product/${item.product._id}`}>
                    <h3>{item.product.name}</h3>
                  </Link>
                  <p>Size: {item.size || "Standard"}</p>
                  <p>Color: {item.color || "Standard"}</p>
                  <strong>
                    {money((item.product.discountPrice ?? item.product.price) * item.qty)}
                  </strong>

                  <div className="cart-quantity">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product._id,
                          item.size,
                          item.color,
                          item.qty - 1
                        )
                      }
                      disabled={item.qty <= 1}
                    >
                      −
                    </button>

                    <span>{item.qty}</span>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product._id,
                          item.size,
                          item.color,
                          item.qty + 1
                        )
                      }
                      disabled={item.qty >= item.product.stock}
                    >
                      +
                    </button>

                    <button
                      className="remove-button"
                      onClick={() =>
                        removeFromCart(
                          item.product._id,
                          item.size,
                          item.color
                        )
                      }
                    >
                      <Trash2 size={17} /> Remove
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <form className="checkout-card" onSubmit={placeOrder}>
            <h2>Order summary</h2>

            <div className="summary-line">
              <span>Subtotal</span>
              <strong>{money(total)}</strong>
            </div>

            <div className="summary-line">
              <span>Delivery</span>
              <span>Calculated by store</span>
            </div>

            <div className="summary-line summary-total">
              <span>Total</span>
              <strong>{money(total)}</strong>
            </div>

            <label>Shipping address</label>
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Enter your complete delivery address"
              required
            />

            <label>Payment method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="cod">Cash on Delivery</option>
              <option value="card">Card</option>
            </select>

            <button
              className="primary-button full-button"
              disabled={loading || !cart.length}
            >
              {loading ? "Placing order..." : "Place order"}
            </button>

            {!user && (
              <p className="checkout-note">
                You will be asked to log in before placing your order.
              </p>
            )}
          </form>
        </div>
      )}
    </main>
  );
}