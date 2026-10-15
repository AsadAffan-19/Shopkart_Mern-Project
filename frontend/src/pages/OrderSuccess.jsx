import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { CheckCircle2, Package, ArrowRight, Home as HomeIcon } from "lucide-react";

const OrderSuccess = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);

  useEffect(() => {
    if (!order) {
      api.get(`/orders/${id}`)
        .then((res) => {
          if (res.data?.order) setOrder(res.data.order);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id, order]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-16 flex-1 w-full text-center">
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-xl space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Payment Confirmed
            </span>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight mt-3 mb-2">
              Thank You for Your Order!
            </h1>
            <p className="text-sm text-gray-500">
              Your order has been placed successfully and is being prepared for dispatch.
            </p>
          </div>

          {order && (
            <div className="bg-gray-50 rounded-2xl p-6 text-left border border-gray-100 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200/60 pb-3">
                <div>
                  <span className="text-xs text-gray-400 font-bold uppercase">Order Reference</span>
                  <p className="font-mono text-sm font-bold text-gray-900">#{order._id}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 font-bold uppercase">Total Paid</span>
                  <p className="text-base font-black text-blue-600">₹{order.totalAmount?.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <span className="text-xs text-gray-400 font-bold uppercase">Delivering to</span>
                <p className="text-sm font-semibold text-gray-800">{order.shippingAddress?.fullName}</p>
                <p className="text-xs text-gray-600">
                  {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                </p>
              </div>

              <div className="border-t border-gray-200/60 pt-3">
                <span className="text-xs text-gray-400 font-bold uppercase block mb-2">Purchased Items ({order.items?.length})</span>
                <div className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs text-gray-700">
                      <span className="font-medium line-clamp-1 max-w-[280px]">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/orders"
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              <span>View My Orders</span>
            </Link>

            <Link
              to="/home"
              className="w-full sm:w-auto px-7 py-3 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-sm transition flex items-center justify-center gap-2"
            >
              <HomeIcon className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrderSuccess;
