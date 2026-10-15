import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import Navbar from "../components/Navbar";
import api from "../services/api";
import {
  ShoppingBag,
  Heart,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones as SupportIcon,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Laptop,
  Smartphone,
  Watch,
  Gamepad2,
  Speaker,
  Tv,
  Check,
  User,
  Mail,
  Phone
} from "lucide-react";

const CATEGORIES = [
  { name: "Headphone", count: "32 Items", icon: Headphones, catKey: "Headphones" },
  { name: "Computers", count: "48 Items", icon: Laptop, catKey: "Electronics" },
  { name: "Smart Watch", count: "12 Items", icon: Watch, catKey: "Wearables" },
  { name: "Laptops", count: "25 Items", icon: Laptop, catKey: "Laptops" },
  { name: "Audio", count: "18 Items", icon: Speaker, catKey: "Audio" },
  { name: "Mobile", count: "54 Items", icon: Smartphone, catKey: "Mobile" },
  { name: "Gaming", count: "22 Items", icon: Gamepad2, catKey: "Gaming" }
];

const Home = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [addedNotice, setAddedNotice] = useState(null);

  // Countdown Timer for "Enhance Your Music Experience"
  const [timeLeft, setTimeLeft] = useState({
    days: 16,
    hours: 10,
    mins: 55,
    secs: 54
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await api.get("/products");
        if (res.data?.products) {
          setProducts(res.data.products.slice(0, 8));
        }
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchBestSellers();
  }, []);

  const handleAddToCart = async (product) => {
    setAddingId(product._id);
    const res = await addToCart(product._id, 1);
    setAddingId(null);
    if (res.success) {
      setAddedNotice(`Added "${product.name}" to cart!`);
      setTimeout(() => setAddedNotice(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      {/* Toast Notification */}
      {addedNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up text-sm font-semibold">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span>{addedNotice}</span>
          <Link to="/cart" className="text-blue-400 hover:underline ml-2 text-xs">
            View Cart →
          </Link>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10 flex-1 w-full">
        {/* Customer Welcome Bar — Protected Profile Requirement (Lab 02) */}
        {user && (
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xl font-black border border-white/20">
                {user.fullName ? user.fullName[0].toUpperCase() : "U"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full text-blue-100">
                    Active Customer
                  </span>
                </div>
                <h1 className="text-2xl font-black tracking-tight mt-1">
                  Welcome back, {user.fullName}!
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-xs text-blue-100 mt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" /> {user.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" /> {user.phone}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/products"
                className="px-5 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-sm shadow-md hover:bg-blue-50 transition flex items-center gap-2"
              >
                <span>Browse Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* 1. Hero Banner — Matching Theme Image */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-teal-950 via-slate-900 to-blue-950 text-white min-h-[360px] md:min-h-[420px] flex items-center shadow-2xl border border-gray-800">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/20 via-transparent to-transparent"></div>

          <div className="relative z-10 p-8 md:p-14 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold mb-4 border border-teal-500/30">
              ⚡ Flash Tech Deals 2026
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight mb-4">
              BUY THE BEST LAPTOPS AT THE BEST PRICE
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 max-w-lg">
              Explore cutting-edge high-performance laptops with next-gen OLED displays, ultrafast processors, and all-day battery life.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/products?category=Laptops"
                className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition flex items-center gap-2"
              >
                <span>Shop Laptops</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/products"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-sm border border-white/20 transition"
              >
                All Categories
              </Link>
            </div>
          </div>

          {/* Decorative Visual on the right */}
          <div className="hidden lg:block absolute right-12 bottom-4 w-96 h-80 opacity-90 pointer-events-none">
            <div className="w-full h-full relative flex items-center justify-center">
              <div className="w-72 h-48 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl shadow-2xl transform -rotate-6 border border-white/20 flex flex-col p-4 text-white">
                <div className="w-full h-32 bg-slate-950 rounded-lg mb-2 flex items-center justify-center">
                  <Laptop className="w-16 h-16 text-cyan-400" />
                </div>
                <div className="h-2 w-24 bg-cyan-400 rounded-full"></div>
              </div>
              <div className="w-72 h-48 bg-gradient-to-tr from-slate-800 to-slate-900 rounded-2xl shadow-2xl transform rotate-12 absolute -bottom-2 -right-4 border border-white/10 flex flex-col p-4 text-white">
                <div className="w-full h-32 bg-slate-950 rounded-lg mb-2 flex items-center justify-center">
                  <Laptop className="w-16 h-16 text-teal-400" />
                </div>
                <div className="h-2 w-20 bg-teal-400 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Browse by Category */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Categories
              </span>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Browse by Category
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/products")}
                className="p-2 rounded-full border border-gray-200 hover:bg-white hover:border-gray-300 transition text-gray-600"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/products")}
                className="p-2 rounded-full border border-gray-200 hover:bg-white hover:border-gray-300 transition text-gray-600"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-4">
            {CATEGORIES.map((cat, idx) => {
              const IconComp = cat.icon;
              return (
                <Link
                  key={idx}
                  to={`/products?category=${encodeURIComponent(cat.catKey)}`}
                  className="bg-white hover:bg-blue-50/50 border border-gray-100 hover:border-blue-200 rounded-2xl p-4 flex flex-col items-center text-center transition group shadow-xs hover:shadow-md cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 group-hover:bg-blue-600 text-gray-700 group-hover:text-white flex items-center justify-center transition mb-3">
                    <IconComp className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition">
                    {cat.name}
                  </h3>
                  <span className="text-xs text-gray-400 mt-0.5">{cat.count}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 3. Promotional Music Banner with Countdown — Matching Theme Image */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-100 via-sky-50 to-indigo-100 p-8 md:p-12 border border-blue-200/60 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest bg-blue-200/60 px-3 py-1 rounded-full">
              🎧 Special Offer
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mt-3 mb-2">
              Enhance Your Music Experience
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Experience sound like never before with our top-of-the-line wireless active noise cancelling headphones. Pure acoustic bliss.
            </p>

            {/* Countdown timer */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-16 py-3 rounded-2xl bg-white shadow-sm border border-blue-100 flex flex-col items-center">
                <span className="text-xl font-black text-blue-600">{timeLeft.days}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Days</span>
              </div>
              <div className="w-16 py-3 rounded-2xl bg-white shadow-sm border border-blue-100 flex flex-col items-center">
                <span className="text-xl font-black text-blue-600">{timeLeft.hours}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Hours</span>
              </div>
              <div className="w-16 py-3 rounded-2xl bg-white shadow-sm border border-blue-100 flex flex-col items-center">
                <span className="text-xl font-black text-blue-600">{timeLeft.mins}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Mins</span>
              </div>
              <div className="w-16 py-3 rounded-2xl bg-white shadow-sm border border-blue-100 flex flex-col items-center">
                <span className="text-xl font-black text-blue-600">{timeLeft.secs}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">Secs</span>
              </div>
            </div>

            <Link
              to="/products?category=Audio"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition"
            >
              <span>Check It Out</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="w-64 h-64 md:w-80 md:h-80 relative flex items-center justify-center shrink-0">
            <div className="w-56 h-56 rounded-full bg-blue-400/20 blur-2xl absolute"></div>
            <div className="w-48 h-48 rounded-full bg-white shadow-xl flex items-center justify-center relative border border-white">
              <Headphones className="w-28 h-28 text-blue-600" />
            </div>
          </div>
        </div>

        {/* 4. Explore Our Best Sellers Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Our Products
              </span>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                Explore Our Best Sellers
              </h2>
            </div>
            <Link
              to="/products"
              className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <div key={n} className="bg-white rounded-2xl p-4 border border-gray-100 animate-pulse space-y-4">
                  <div className="w-full h-44 bg-gray-200 rounded-xl"></div>
                  <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded-md w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No products available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {products.map((product) => {
                const wishlisted = isInWishlist(product._id);
                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-gray-200 shadow-xs hover:shadow-lg transition flex flex-col justify-between group relative"
                  >
                    {/* Top Badges & Wishlist Toggle */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-600 text-white">
                        HOT
                      </span>
                      <button
                        onClick={() => toggleWishlist(product._id)}
                        className={`p-2 rounded-full transition cursor-pointer ${
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

                    {/* Image */}
                    <Link
                      to={`/products/${product._id}`}
                      className="w-full h-44 flex items-center justify-center p-3 overflow-hidden rounded-xl bg-gray-50 mb-3 group-hover:scale-102 transition"
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

                    {/* Info */}
                    <div>
                      {/* Rating stars */}
                      <div className="flex items-center gap-1 mb-1">
                        <div className="flex items-center text-amber-400">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400 font-medium">
                          ({product.stock || 25})
                        </span>
                      </div>

                      <Link
                        to={`/products/${product._id}`}
                        className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition line-clamp-1 block"
                      >
                        {product.name}
                      </Link>

                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-base font-black text-gray-900">
                          ₹{product.price?.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          ₹{(product.price * 1.25).toFixed(0)}
                        </span>
                      </div>
                    </div>

                    {/* Add to Cart button */}
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={addingId === product._id}
                      className="mt-4 w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 cursor-pointer disabled:opacity-75"
                    >
                      {addingId === product._id ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add To Cart</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* 5. Value Proposition Bar — Matching Theme Image */}
        <section className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">Free Delivery</h4>
                <p className="text-xs text-gray-500">Free shipping on all orders</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">30 Day Return</h4>
                <p className="text-xs text-gray-500">Hassle-free money back guarantee</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">Secure Payment</h4>
                <p className="text-xs text-gray-500">100% encrypted & protected</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <SupportIcon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-900">24/7 Support</h4>
                <p className="text-xs text-gray-500">Dedicated assistance anytime</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-sm">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-xl font-black text-blue-600 tracking-tight">SHOPKART</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500 font-medium">
            <Link to="/home" className="hover:text-blue-600 transition">Home</Link>
            <Link to="/products" className="hover:text-blue-600 transition">Catalog</Link>
            <Link to="/wishlist" className="hover:text-blue-600 transition">Wishlist</Link>
            <Link to="/cart" className="hover:text-blue-600 transition">Cart</Link>
          </div>

          <p className="text-xs text-gray-400">
            © 2026 ShopKart. Built for Engineering Labs 01–06.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
