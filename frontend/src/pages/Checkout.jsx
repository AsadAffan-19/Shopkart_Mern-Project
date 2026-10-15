import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import {
  CreditCard,
  ShieldCheck,
  Truck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock
} from "lucide-react";

const Checkout = () => {
  const { cart, cartSubtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required";
    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-]{8,16}$/.test(formData.phone)) {
      errs.phone = "Enter a valid phone number";
    }
    if (!formData.addressLine1.trim()) errs.addressLine1 = "Street address is required";
    if (!formData.city.trim()) errs.city = "City is required";
    if (!formData.state.trim()) errs.state = "State is required";
    if (!formData.pincode.trim()) {
      errs.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
      errs.pincode = "Pincode must contain exactly 6 digits";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    setErrorMsg("");
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (cart.length === 0) {
      setErrorMsg("Your cart is empty. Add products before checkout.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      // Step 1: Create Order & Razorpay order on server
      const res = await api.post("/orders/create-payment-order", {
        shippingAddress: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          addressLine1: formData.addressLine1.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim()
        }
      });

      const { order, razorpayOrder, key } = res.data;

      // Try loading official Razorpay Checkout SDK
      const scriptLoaded = await loadRazorpayScript();

      if (scriptLoaded && window.Razorpay && !razorpayOrder.id.startsWith("order_sim_")) {
        const options = {
          key,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "SHOPKART",
          description: `Order #${order._id.slice(-6)} Payment`,
          order_id: razorpayOrder.id,
          handler: async (response) => {
            try {
              const verifyRes = await api.post("/orders/verify-payment", {
                orderId: order._id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              clearCart();
              navigate(`/order-success/${order._id}`, { state: { order: verifyRes.data.order } });
            } catch (verErr) {
              setErrorMsg(verErr.response?.data?.message || "Payment verification failed.");
              setLoading(false);
            }
          },
          prefill: {
            name: formData.fullName,
            email: user?.email,
            contact: formData.phone
          },
          theme: {
            color: "#2563EB"
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (response) => {
          setErrorMsg(`Payment failed: ${response.error.description}`);
          setLoading(false);
        });
        rzp.open();
      } else {
        // Test Mode Simulation fallback (when offline or using simulated order)
        const verifyRes = await api.post("/orders/verify-payment", {
          orderId: order._id,
          razorpay_order_id: razorpayOrder.id,
          razorpay_payment_id: `pay_test_${Date.now()}`,
          razorpay_signature: "simulated_success_signature"
        });

        clearCart();
        navigate(`/order-success/${order._id}`, { state: { order: verifyRes.data.order } });
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Checkout failed. Please check stock or details.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Navbar />
        <div className="max-w-md mx-auto my-auto p-8 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-600 font-bold mb-4">Your cart is empty.</p>
          <Link
            to="/products"
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm inline-block"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-8">
          Checkout & Shipping
        </h1>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-sm animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Shipping Address (Lab 06 Specification) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xs space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <Truck className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                Shipping Address
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Recipient Name"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition outline-hidden ${
                    errors.fullName ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-blue-600"
                  }`}
                />
                {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition outline-hidden ${
                    errors.phone ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-blue-600"
                  }`}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Address Line *
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  placeholder="House/Flat No, Street, Landmark"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition outline-hidden ${
                    errors.addressLine1 ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-blue-600"
                  }`}
                />
                {errors.addressLine1 && <p className="text-xs text-red-500 mt-1">{errors.addressLine1}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition outline-hidden ${
                    errors.city ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-blue-600"
                  }`}
                />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition outline-hidden ${
                    errors.state ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-blue-600"
                  }`}
                />
                {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Pincode (6 Digits) *
                </label>
                <input
                  type="text"
                  name="pincode"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="560001"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition outline-hidden ${
                    errors.pincode ? "border-red-400 bg-red-50/30" : "border-gray-200 focus:border-blue-600"
                  }`}
                />
                {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
              </div>
            </div>
          </div>

          {/* Right Order Review & Razorpay Trigger */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xs space-y-6">
            <h2 className="text-xl font-black text-gray-900 tracking-tight pb-4 border-b border-gray-100">
              Order Review
            </h2>

            <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.product?._id} className="py-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product?.image}
                      alt={item.product?.name}
                      className="w-12 h-12 object-contain bg-gray-50 rounded-lg p-1 border border-gray-100"
                    />
                    <div>
                      <p className="font-bold text-gray-900 line-clamp-1">{item.product?.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">
                    ₹{(item.product?.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{cartSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
              <div className="flex justify-between text-gray-900 pt-2 border-t border-gray-100 font-black text-lg">
                <span>Total Payable</span>
                <span className="text-blue-600">₹{cartSubtotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay with Razorpay (₹{cartSubtotal.toLocaleString()})</span>
                </>
              )}
            </button>

            <div className="p-3 bg-blue-50/60 rounded-xl flex items-center gap-2.5 text-xs text-blue-900">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <span>Razorpay Test Mode enabled. Instant verification and secure checkout.</span>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Checkout;
