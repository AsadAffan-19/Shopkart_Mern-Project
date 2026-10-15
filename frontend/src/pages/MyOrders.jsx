import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { Package, ArrowRight, Clock, CheckCircle2, ShoppingBag } from "lucide-react";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders")
      .then((res) => {
        if (res.data?.orders) setOrders(res.data.orders);
      })
      .catch((err) => console.error("Failed to load orders:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-blue-50 text-blue-600">
                <Package className="w-6 h-6" />
              </span>
              <span>My Orders</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Track and review all your past ShopKart electronics purchases
            </p>
          </div>

          <Link
            to="/products"
            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
          >
            <span>Shop More</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-semibold text-gray-600">Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">No orders placed yet</h2>
            <p className="text-sm text-gray-500 mb-8 max-w-xs mx-auto">
              Once you checkout and complete payment, your orders will appear here.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition"
            >
              <span>Start Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xs space-y-6"
              >
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100 text-sm">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                      Order ID
                    </span>
                    <span className="font-mono font-bold text-gray-900">#{order._id}</span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                      Date Placed
                    </span>
                    <span className="font-medium text-gray-700">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                      Total
                    </span>
                    <span className="font-black text-blue-600 text-base">
                      ₹{order.totalAmount?.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                      Status
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{order.status || "CONFIRMED"}</span>
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-gray-100">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 object-contain bg-gray-50 rounded-xl p-1.5 border border-gray-100 shrink-0"
                          />
                        )}
                        <div>
                          <p className="font-bold text-sm text-gray-900 line-clamp-1">{item.name}</p>
                          <p className="text-xs text-gray-500">
                            ₹{item.price?.toLocaleString()} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-black text-sm text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Shipping Details */}
                <div className="bg-gray-50 rounded-2xl p-4 text-xs text-gray-600 flex flex-col sm:flex-row justify-between gap-2 border border-gray-100">
                  <div>
                    <span className="font-bold text-gray-800">Delivered To: </span>
                    <span>
                      {order.shippingAddress?.fullName}, {order.shippingAddress?.addressLine1},{" "}
                      {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
                      {order.shippingAddress?.pincode}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-gray-800">Phone: </span>
                    <span>{order.shippingAddress?.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyOrders;
