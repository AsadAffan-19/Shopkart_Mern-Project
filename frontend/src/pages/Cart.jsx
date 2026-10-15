import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

const Cart = () => {
  const { cart, loading, updateQuantity, removeFromCart, cartSubtotal, cartCount } = useCart();
  const navigate = useNavigate();

  const [updatingId, setUpdatingId] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState(null);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === "SHOPKART10") {
      setDiscountPercent(10);
      setPromoMessage({ success: true, text: "Promo code SHOPKART10 applied! (10% off)" });
    } else if (promoCode.trim().toUpperCase() === "SAVE20") {
      setDiscountPercent(20);
      setPromoMessage({ success: true, text: "Promo code SAVE20 applied! (20% off)" });
    } else {
      setDiscountPercent(0);
      setPromoMessage({ success: false, text: "Invalid promo code. Try 'SHOPKART10'." });
    }
  };

  const handleQtyChange = async (productId, newQty, stock) => {
    if (newQty < 1 || newQty > stock) return;
    setUpdatingId(productId);
    await updateQuantity(productId, newQty);
    setUpdatingId(null);
  };

  const handleRemove = async (productId) => {
    setUpdatingId(productId);
    await removeFromCart(productId);
    setUpdatingId(null);
  };

  const shippingCost = cartSubtotal > 1000 || cartSubtotal === 0 ? 0 : 99;
  const discountAmount = Math.round((cartSubtotal * discountPercent) / 100);
  const totalAmount = Math.max(0, cartSubtotal + shippingCost - discountAmount);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
                <ShoppingBag className="w-6 h-6" />
              </span>
              <span>Shopping Cart</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              You have {cartCount} {cartCount === 1 ? "item" : "items"} in your cart
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

        {loading && cart.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-semibold text-gray-600">Loading your cart...</p>
          </div>
        ) : cart.length === 0 ? (
          /* Empty Cart State — Lab 05 Specification */
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto leading-relaxed">
              Explore our best-selling tech catalog and add your favourite gadgets to get started.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Cart Content Layout — Matching Theme Image 4 */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
              <div className="p-6 border-b border-gray-100 hidden sm:grid grid-cols-12 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <span className="col-span-6">Product</span>
                <span className="col-span-3 text-center">Quantity</span>
                <span className="col-span-3 text-right">Subtotal</span>
              </div>

              <div className="divide-y divide-gray-100">
                {cart.map((item) => {
                  const product = item.product;
                  if (!product) return null;
                  const itemSubtotal = product.price * item.quantity;
                  const isUpdating = updatingId === product._id;

                  return (
                    <div
                      key={product._id}
                      className="p-6 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center"
                    >
                      {/* Product Preview */}
                      <div className="col-span-6 flex items-center gap-4 w-full">
                        <Link
                          to={`/products/${product._id}`}
                          className="w-20 h-20 rounded-2xl bg-gray-50 p-2 flex items-center justify-center shrink-0 border border-gray-100"
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
                        <div>
                          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                            {product.category}
                          </span>
                          <Link
                            to={`/products/${product._id}`}
                            className="font-bold text-sm text-gray-900 hover:text-blue-600 transition block line-clamp-1"
                          >
                            {product.name}
                          </Link>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Unit Price: ₹{product.price?.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Quantity Counter */}
                      <div className="col-span-3 flex items-center justify-center gap-2 w-full sm:w-auto">
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                          <button
                            onClick={() =>
                              handleQtyChange(product._id, item.quantity - 1, product.stock)
                            }
                            disabled={isUpdating || item.quantity <= 1}
                            className="p-2 text-gray-600 hover:bg-white transition disabled:opacity-30 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <span className="px-3.5 py-1 text-sm font-bold text-gray-900 min-w-8 text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              handleQtyChange(product._id, item.quantity + 1, product.stock)
                            }
                            disabled={isUpdating || item.quantity >= product.stock}
                            className="p-2 text-gray-600 hover:bg-white transition disabled:opacity-30 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal and Remove */}
                      <div className="col-span-3 flex items-center justify-between sm:justify-end gap-4 w-full">
                        <span className="text-base font-black text-gray-900">
                          ₹{itemSubtotal?.toLocaleString()}
                        </span>

                        <button
                          onClick={() => handleRemove(product._id)}
                          disabled={isUpdating}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Order Summary Card — Matching Theme Image 4 */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-6">
              <h2 className="text-xl font-black text-gray-900 tracking-tight pb-4 border-b border-gray-100">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">
                    ₹{cartSubtotal?.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-bold text-emerald-600">
                    {shippingCost === 0 ? "FREE" : `₹${shippingCost}`}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-medium">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-₹{discountAmount?.toLocaleString()}</span>
                  </div>
                )}

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="pt-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Promo code (e.g. SHOPKART10)"
                        className="w-full pl-9 pr-3 py-2 text-xs uppercase bg-gray-50 border border-gray-200 rounded-xl outline-hidden focus:border-blue-600 focus:bg-white font-medium"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoMessage && (
                    <p
                      className={`text-xs mt-1.5 font-medium ${
                        promoMessage.success ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {promoMessage.text}
                    </p>
                  )}
                </form>

                <div className="border-t border-gray-100 pt-3 flex items-baseline justify-between text-gray-900">
                  <span className="text-base font-black">Total</span>
                  <span className="text-2xl font-black text-blue-600">
                    ₹{totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                onClick={() => navigate("/checkout")}
                className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="p-3.5 bg-gray-50 rounded-2xl flex items-center gap-3 text-xs text-gray-500">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Safe and encrypted checkout guaranteed with Razorpay.</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
