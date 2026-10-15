import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "./AuthContext";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get("/wishlist");
      if (res.data?.wishlist) {
        setWishlist(res.data.wishlist);
      }
    } catch (err) {
      console.error("Failed to load wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item) === productId);
  };

  const toggleWishlist = async (productId) => {
    if (!user) return { success: false, message: "Please login first" };
    try {
      if (isInWishlist(productId)) {
        await api.delete(`/wishlist/${productId}`);
        setWishlist((prev) => prev.filter((item) => (item._id || item) !== productId));
        return { success: true, added: false, message: "Removed from wishlist" };
      } else {
        await api.post(`/wishlist/${productId}`);
        await fetchWishlist();
        return { success: true, added: true, message: "Added to wishlist" };
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Wishlist update failed";
      return { success: false, message: msg };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      setWishlist((prev) => prev.filter((item) => (item._id || item) !== productId));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || "Failed to remove" };
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        fetchWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
