import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("triora_cart")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("triora_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, size = "", color = "", qty = 1) => {
    setCart((current) => {
      const existing = current.find(
        (item) =>
          item.product._id === product._id &&
          item.size === size &&
          item.color === color
      );

      if (existing) {
        return current.map((item) =>
          item === existing
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }

      return [...current, { product, size, color, qty }];
    });
  };

  const removeFromCart = (productId, size, color) => {
    setCart((current) =>
      current.filter(
        (item) =>
          !(
            item.product._id === productId &&
            item.size === size &&
            item.color === color
          )
      )
    );
  };

  const updateQuantity = (productId, size, color, qty) => {
    if (qty < 1) return;

    setCart((current) =>
      current.map((item) =>
        item.product._id === productId &&
        item.size === size &&
        item.color === color
          ? { ...item, qty }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => {
    const price = item.product.discountPrice ?? item.product.price;
    return sum + price * item.qty;
  }, 0);

  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        itemCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}