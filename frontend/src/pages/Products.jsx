import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import {
  Search,
  Filter,
  Heart,
  ShoppingBag,
  Star,
  SlidersHorizontal,
  X,
  Check,
  AlertCircle,
  PackageOpen
} from "lucide-react";

const CATEGORIES = [
  "Electronics",
  "Audio",
  "Headphones",
  "Gaming",
  "Laptops",
  "Mobile",
  "Wearables"
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const selectedCategory = searchParams.get("category") || "";
  const searchTerm = searchParams.get("search") || "";
  const [searchInput, setSearchInput] = useState(searchTerm);
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "latest");
  const [maxPrice, setMaxPrice] = useState(70000);
  const [minRating, setMinRating] = useState(0);

  const [addingId, setAddingId] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedCategory && selectedCategory !== "all") params.append("category", selectedCategory);
      if (sortBy) params.append("sort", sortBy);
      if (maxPrice < 70000) params.append("maxPrice", maxPrice);

      const res = await api.get(`/products?${params.toString()}`);
      if (res.data?.products) {
        let items = res.data.products;
        if (minRating > 0) {
          items = items.filter((p) => (p.rating || 0) >= minRating);
        }
        setProducts(items);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong while loading products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, selectedCategory, sortBy, maxPrice, minRating]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set("search", searchInput.trim());
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  };

  const handleCategoryChange = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (selectedCategory === cat) {
      newParams.delete("category");
    } else {
      newParams.set("category", cat);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setSearchInput("");
    setMaxPrice(70000);
    setMinRating(0);
    setSortBy("latest");
  };

  const handleAddToCart = async (product) => {
    setAddingId(product._id);
    const res = await addToCart(product._id, 1);
    setAddingId(null);
    if (res.success) {
      setToastMsg(`Added "${product.name}" to cart!`);
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up text-sm font-semibold">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span>{toastMsg}</span>
          <Link to="/cart" className="text-blue-400 hover:underline ml-2 text-xs">
            View Cart →
          </Link>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Top Controls Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {selectedCategory ? `${selectedCategory}` : "All Products"}
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Showing {products.length} products available for immediate dispatch
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown — Bonus Challenge from Lab 03 */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm">
              <span className="text-xs font-semibold text-gray-400 uppercase hidden sm:inline">
                Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="font-semibold text-gray-800 bg-transparent outline-hidden cursor-pointer text-sm"
              >
                <option value="latest">Latest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-8 items-start">
          {/* Left Sidebar Filters — Matching Theme Image 3 */}
          <aside
            className={`w-64 shrink-0 bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-6 ${
              mobileFilterOpen ? "block fixed inset-y-0 left-0 z-50 overflow-y-auto" : "hidden lg:block"
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-gray-900 text-sm">Filters</h3>
              </div>
              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Search Filter input */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Search
              </label>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Keyword..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-blue-600 focus:bg-white"
                />
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </form>
            </div>

            {/* Categories Checklist */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                Categories
              </label>
              <div className="space-y-2">
                {CATEGORIES.map((cat) => {
                  const isChecked = selectedCategory.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryChange(cat)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                        isChecked
                          ? "bg-blue-50 text-blue-700 font-bold"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className={`w-4 h-4 rounded-md border flex items-center justify-center transition ${
                            isChecked
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </span>
                        <span>{cat}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Max Price
                </label>
                <span className="text-xs font-bold text-blue-600">
                  ₹{maxPrice.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="70000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                <span>₹500</span>
                <span>₹70,000</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="pt-4 border-t border-gray-100">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Customer Rating
              </label>
              <div className="space-y-1.5">
                {[4, 3, 2].map((stars) => (
                  <button
                    key={stars}
                    onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                      minRating === stars ? "bg-amber-50 text-amber-900 font-bold" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center text-amber-400">
                      {[...Array(stars)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                    <span>{stars} Stars & Above</span>
                  </button>
                ))}
              </div>
            </div>

            {mobileFilterOpen && (
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold"
              >
                Apply & Close
              </button>
            )}
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1">
            {/* Loading State — Lab 03 Acceptance Criteria */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div
                    key={n}
                    className="bg-white rounded-3xl p-5 border border-gray-100 animate-pulse space-y-4"
                  >
                    <div className="w-full h-48 bg-gray-200 rounded-2xl"></div>
                    <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded-md w-1/2"></div>
                    <div className="h-10 bg-gray-200 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              /* Error State — Lab 03 Acceptance Criteria */
              <div className="bg-white rounded-3xl p-12 text-center border border-red-100 shadow-sm">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Unable to load products
                </h3>
                <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            ) : products.length === 0 ? (
              /* Empty State — Lab 03 Acceptance Criteria */
              <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
                  <PackageOpen className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                  We couldn't find any products matching your current filters. Try relaxing your search or price filter.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              /* Product Listing Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  const wishlisted = isInWishlist(product._id);
                  return (
                    <div
                      key={product._id}
                      className="bg-white rounded-3xl p-5 border border-gray-100 hover:border-gray-200 shadow-xs hover:shadow-xl transition flex flex-col justify-between group relative"
                    >
                      {/* Badge and Wishlist Icon */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
                          {product.category}
                        </span>
                        <button
                          onClick={() => toggleWishlist(product._id)}
                          className={`p-2.5 rounded-full transition cursor-pointer ${
                            wishlisted
                              ? "bg-red-50 text-red-500"
                              : "bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50"
                          }`}
                          title={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <Heart
                            className={`w-4 h-4 ${wishlisted ? "fill-red-500" : ""}`}
                          />
                        </button>
                      </div>

                      {/* Product Image Link */}
                      <Link
                        to={`/products/${product._id}`}
                        className="w-full h-48 flex items-center justify-center p-4 bg-gray-50 rounded-2xl overflow-hidden mb-4 group-hover:scale-102 transition"
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
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <div className="flex items-center text-amber-400">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400 font-medium">
                            ({product.reviewsCount || 48})
                          </span>
                        </div>

                        <Link
                          to={`/products/${product._id}`}
                          className="font-bold text-gray-900 group-hover:text-blue-600 transition line-clamp-1 text-base block"
                        >
                          {product.name}
                        </Link>

                        <p className="text-xs text-gray-500 line-clamp-2 mt-1 mb-3">
                          {product.description}
                        </p>

                        <div className="flex items-baseline justify-between mb-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-xl font-black text-gray-900">
                              ₹{product.price?.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              ₹{(product.price * 1.2).toFixed(0)}
                            </span>
                          </div>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                              product.stock > 0
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                          </span>
                        </div>
                      </div>

                      {/* Actions: View Details and Add to Cart */}
                      <div className="grid grid-cols-2 gap-2 mt-auto">
                        <Link
                          to={`/products/${product._id}`}
                          className="py-2.5 px-3 rounded-xl border border-gray-200 hover:border-gray-300 bg-white text-gray-700 font-bold text-xs text-center transition"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={addingId === product._id || product.stock <= 0}
                          className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {addingId === product._id ? (
                            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Products;
