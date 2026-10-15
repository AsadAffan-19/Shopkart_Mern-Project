import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    if (!user) {
      setCart([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get("/cart");
      if (res.data?.cart) {
        setCart(res.data.cart);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await api.post(`/cart/${productId}`, { quantity });
      if (res.data?.cart) {
        setCart(res.data.cart);
      } else {
        await fetchCart();
      }
      return { success: true, message: "Added to cart" };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add to cart";
      return { success: false, message: msg };
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const res = await api.patch(`/cart/${productId}`, { quantity });
      if (res.data?.cart) {
        setCart(res.data.cart);
      } else {
        await fetchCart();
      }
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update quantity";
      return { success: false, message: msg };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await api.delete(`/cart/${productId}`);
      if (res.data?.cart) {
        setCart(res.data.cart);
      } else {
        await fetchCart();
      }
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to remove item";
      return { success: false, message: msg };
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const cartSubtotal = cart.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * (item.quantity || 1);
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        cartCount,
        cartSubtotal,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
