import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Eye,
  AlertCircle,
  PackageOpen
} from "lucide-react";

const Wishlist = () => {
  const { wishlist, loading, removeFromWishlist, fetchWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [removingId, setRemovingId] = useState(null);
  const [movingId, setMovingId] = useState(null);

  const handleRemove = async (productId) => {
    setRemovingId(productId);
    await removeFromWishlist(productId);
    setRemovingId(null);
  };

  const handleMoveToCart = async (product) => {
    setMovingId(product._id);
    await addToCart(product._id, 1);
    await removeFromWishlist(product._id);
    setMovingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-red-50 text-red-500">
                <Heart className="w-6 h-6 fill-red-500" />
              </span>
              <span>My Wishlist</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {wishlist.length} {wishlist.length === 1 ? "product" : "products"} saved for later
            </p>
          </div>

          <Link
            to="/products"
            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Loading State — Lab 04 Specification */}
        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
            <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-semibold text-gray-600">Loading your wishlist...</p>
          </div>
        ) : wishlist.length === 0 ? (
          /* Empty State — Lab 04 Specification */
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 fill-red-500" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto leading-relaxed">
              Save products you love and find them here later when you are ready to purchase.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition"
            >
              <span>Browse Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Saved Wishlist Items Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-3xl p-5 border border-gray-100 hover:border-gray-200 shadow-xs hover:shadow-lg transition flex flex-col justify-between group relative"
              >
                {/* Remove button */}
                <button
                  onClick={() => handleRemove(product._id)}
                  disabled={removingId === product._id}
                  className="absolute top-4 right-4 p-2 rounded-full bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Image */}
                <Link
                  to={`/products/${product._id}`}
                  className="w-full h-44 flex items-center justify-center p-3 bg-gray-50 rounded-2xl overflow-hidden mb-3 group-hover:scale-102 transition"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80";
                    }}
                  />
                </Link>

                {/* Details */}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                    {product.category}
                  </span>

                  <Link
                    to={`/products/${product._id}`}
                    className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition line-clamp-1 mt-2 block"
                  >
                    {product.name}
                  </Link>

                  <div className="flex items-baseline justify-between mt-2 mb-4">
                    <span className="text-lg font-black text-gray-900">
                      ₹{product.price?.toLocaleString()}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        product.stock > 0
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {product.stock > 0 ? `${product.stock} left` : "Out of Stock"}
                    </span>
                  </div>
                </div>

                {/* Actions: Move to Cart & View */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    disabled={movingId === product._id || product.stock <= 0}
                    className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 cursor-pointer disabled:opacity-50"
                  >
                    {movingId === product._id ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Cart</span>
                      </>
                    )}
                  </button>

                  <Link
                    to={`/products/${product._id}`}
                    className="w-full py-2 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs text-center transition flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Product</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
