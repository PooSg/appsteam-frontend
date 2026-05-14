import { useEffect, useState } from "react";
import api from "../../services/api";

const STATUS_OPTIONS = ["pending", "processing", "completed", "cancelled"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await api.get("/admin/orders");
    setOrders(res.data);
  };

  const updateStatus = async (orderId, newStatus) => {
    await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
    fetchOrders();
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Order Management</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.order_id} className="bg-[#1a2235] rounded-xl p-5">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-semibold text-cyan-400">Order #{order.order_id}</p>
                <p className="text-sm text-gray-400">{order.username} · {order.email}</p>
                <p className="text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">₱{parseFloat(order.total_amount).toFixed(2)}</p>
                <p className="text-sm text-green-400">{order.payment_method}</p>
                <select
                  value={order.status || "pending"}
                  onChange={(e) => updateStatus(order.order_id, e.target.value)}
                  className="mt-1 bg-[#0f1724] text-sm border border-gray-600 rounded px-2 py-1 text-white"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                  <img
                    src={item.cover_image}
                    alt={item.title}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <span>{item.title}</span>
                  <span className="ml-auto">₱{parseFloat(item.price_at_purchase).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}