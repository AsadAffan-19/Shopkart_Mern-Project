import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import {
  ShoppingBag,
  Heart,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  ArrowLeft,
  Check,
  AlertCircle,
  Plus,
  Minus
} from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data?.product) {
          setProduct(res.data.product);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    const res = await addToCart(product._id, quantity);
    setAdding(false);
    if (res.success) {
      setToastMsg(`Added ${quantity} × "${product.name}" to cart!`);
      setTimeout(() => setToastMsg(null), 3500);
    } else {
      alert(res.message);
    }
  };

  const wishlisted = product ? isInWishlist(product._id) : false;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up text-sm font-semibold">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span>{toastMsg}</span>
          <Link to="/cart" className="text-blue-400 hover:underline ml-2 text-xs">
            Open Cart →
          </Link>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Breadcrumb / Back button */}
        <div className="mb-6">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Products</span>
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm animate-pulse grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="w-full h-96 bg-gray-200 rounded-3xl"></div>
            <div className="space-y-4 py-4">
              <div className="h-6 bg-gray-200 rounded-md w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded-lg w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded-md w-1/3"></div>
              <div className="h-24 bg-gray-200 rounded-xl w-full"></div>
              <div className="h-12 bg-gray-200 rounded-xl w-1/2"></div>
            </div>
          </div>
        ) : error || !product ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm max-w-lg mx-auto">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
            <p className="text-sm text-gray-500 mb-6">{error || "Unable to find the requested product."}</p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition"
            >
              Browse All Products
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 md:p-12 border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Left Image Section */}
            <div className="bg-gray-50 rounded-3xl p-8 flex items-center justify-center min-h-[420px] relative border border-gray-100">
              <button
                onClick={() => toggleWishlist(product._id)}
                className={`absolute top-6 right-6 p-3 rounded-full transition shadow-md cursor-pointer ${
                  wishlisted
                    ? "bg-red-50 text-red-500"
                    : "bg-white text-gray-400 hover:text-red-500 hover:bg-red-50"
                }`}
                title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-5 h-5 ${wishlisted ? "fill-red-500" : ""}`} />
              </button>

              <img
                src={product.image}
                alt={product.name}
                className="max-h-[360px] max-w-full object-contain hover:scale-105 transition duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80";
                }}
              />
            </div>

            {/* Right Product Info */}
            <div className="flex flex-col space-y-6">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  {product.category}
                </span>

                <h1 className="text-3xl font-black text-gray-900 tracking-tight mt-3 mb-2">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    {product.rating || 4.9}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    ({product.reviewsCount || 120} verified customer reviews)
                  </span>
                </div>
              </div>

              {/* Price & Stock */}
              <div className="flex items-baseline gap-4 py-4 border-y border-gray-100">
                <span className="text-3xl font-black text-gray-900">
                  ₹{product.price?.toLocaleString()}
                </span>
                <span className="text-base text-gray-400 line-through">
                  ₹{(product.price * 1.25).toFixed(0)}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                  25% OFF
                </span>
                <span
                  className={`ml-auto text-xs font-bold px-3 py-1 rounded-full ${
                    product.stock > 0
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                      : "bg-red-50 text-red-700 border border-red-100"
                  }`}
                >
                  {product.stock > 0 ? `${product.stock} Units In Stock` : "Out of Stock"}
                </span>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Overview
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quantity Selector and Add to Cart */}
              {product.stock > 0 && (
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Quantity:
                    </span>
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="px-3 py-2 text-gray-600 hover:bg-white transition disabled:opacity-30 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 py-2 text-sm font-bold text-gray-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                        disabled={quantity >= product.stock}
                        className="px-3 py-2 text-gray-600 hover:bg-white transition disabled:opacity-30 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={handleAddToCart}
                      disabled={adding}
                      className="flex-1 py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                    >
                      {adding ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => toggleWishlist(product._id)}
                      className={`px-6 py-3.5 rounded-xl border font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
                        wishlisted
                          ? "border-red-200 bg-red-50 text-red-600"
                          : "border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${wishlisted ? "fill-red-600" : ""}`} />
                      <span>{wishlisted ? "Saved" : "Save to Wishlist"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Service Badges */}
              <div className="grid grid-cols-3 gap-3 pt-6 border-t border-gray-100 text-center">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <Truck className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-[11px] font-bold text-gray-800">Free Express Delivery</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <RotateCcw className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-[11px] font-bold text-gray-800">30-Day Easy Returns</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-[11px] font-bold text-gray-800">1 Year Warranty</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductDetails;
