import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: ""
  });
  const [countryCode, setCountryCode] = useState("+91");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required";
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      errs.password = "Password is required";
    } else if (formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^\d{7,15}$/.test(formData.phone.replace(/[- ]/g, ""))) {
      errs.phone = "Please enter a valid phone number";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError("");

    try {
      const fullPhone = `${countryCode} ${formData.phone.trim()}`;
      await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: fullPhone
      });

      // Redirect to login on success with flash state
      navigate("/login", {
        state: { message: "Account created successfully! Please sign in." }
      });
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
        {/* Left Brand Panel — Matching Theme Image */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl pointer-events-none"></div>

          <div>
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center font-black shadow-md">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black tracking-tight">SHOPKART</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight leading-tight mb-4">
              Your Premium Tech Destination.
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed">
              Join thousands of tech enthusiasts getting unbeatable deals on laptops, gaming gear, smart devices, and accessories.
            </p>
          </div>

          <div className="my-8 hidden md:block">
            {/* Visual Decorative Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="w-6 h-6 text-emerald-300" />
                <span className="font-semibold text-sm">100% Genuine Tech</span>
              </div>
              <p className="text-xs text-blue-100">
                Authorized sellers, manufacturer warranty, and 30-day hassle-free returns.
              </p>
            </div>
          </div>

          <div className="text-xs text-blue-200">
            © 2026 ShopKart Inc. All rights reserved.
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="w-full md:w-7/12 p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Join Us
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Create your ShopKart customer account to get started.
              </p>
            </div>

            {serverError && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-sm animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Aarav Sharma"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition outline-hidden ${
                    errors.fullName
                      ? "border-red-300 bg-red-50/50 focus:border-red-500"
                      : "border-gray-200 bg-gray-50/50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  }`}
                />
                {errors.fullName && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.fullName}</p>
                )}
              </div>

              {/* Phone Number with Country Code */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-sm font-medium text-gray-700 outline-hidden focus:border-blue-600"
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+971">🇦🇪 +971</option>
                  </select>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className={`flex-1 px-4 py-2.5 rounded-xl border text-sm transition outline-hidden ${
                      errors.phone
                        ? "border-red-300 bg-red-50/50 focus:border-red-500"
                        : "border-gray-200 bg-gray-50/50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.phone}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm transition outline-hidden ${
                      errors.email
                        ? "border-red-300 bg-red-50/50 focus:border-red-500"
                        : "border-gray-200 bg-gray-50/50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                    }`}
                  />
                  {formData.email && !errors.email && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm transition outline-hidden ${
                    errors.password
                      ? "border-red-300 bg-red-50/50 focus:border-red-500"
                      : "border-gray-200 bg-gray-50/50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  }`}
                />
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1 font-medium">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <span className="relative px-4 bg-white text-xs text-gray-400 font-medium uppercase">
                Or continue with
              </span>
            </div>

            {/* Google Mock Button */}
            <button
              type="button"
              onClick={() => alert("Google Sign-In is for demo purposes. Please use the form above.")}
              className="w-full py-2.5 px-4 border border-gray-200 hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 flex items-center justify-center gap-3 transition cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>

            <div className="mt-6 text-center text-xs text-gray-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-blue-600 hover:text-blue-700 underline underline-offset-2"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
