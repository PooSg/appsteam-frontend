import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOrders } from '../services/api'

export default function Receipt() {
  const [order, setOrder] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getOrders().then(res => {
      if (res.data.length > 0) {
        setOrder(res.data[0]) // most recent order
      }
    }).catch(() => {})
  }, [])

  if (!order) return <div className="text-center mt-20 text-muted">Loading receipt...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎉</div>
          <h1 className="text-2xl font-bold text-green-400">Order Confirmed!</h1>
          <p className="text-muted text-sm mt-1">Thank you for your purchase</p>
        </div>

        {/* Order info */}
        <div className="bg-[#0f1724] rounded-xl p-4 mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-muted text-sm">Order</span>
            <span className="text-cyan-400 font-semibold">#{order.order_id}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-muted text-sm">Date</span>
            <span className="text-primary text-sm">{new Date(order.created_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-muted text-sm">Payment</span>
            <span className="text-green-400 text-sm">{order.payment_method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted text-sm">Status</span>
            <span className="text-yellow-400 text-sm">{order.status}</span>
          </div>
        </div>

        {/* Delivery address */}
        {order.delivery_name && (
          <div className="bg-[#0f1724] rounded-xl p-4 mb-4">
            <p className="text-muted text-xs mb-2">📦 Delivery Address</p>
            <p className="text-primary text-sm font-semibold">{order.delivery_name}</p>
            <p className="text-muted text-sm">{order.delivery_street}</p>
            <p className="text-muted text-sm">{order.delivery_city}</p>
            <p className="text-muted text-sm">{order.delivery_phone}</p>
          </div>
        )}

        {/* Items */}
        <div className="bg-[#0f1724] rounded-xl p-4 mb-4">
          <p className="text-muted text-xs mb-3">🎮 Items Ordered</p>
          <div className="flex flex-col gap-3">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <img src={item.cover_image} alt={item.title} className="w-10 h-10 object-cover rounded" />
                <span className="text-primary text-sm flex-1">{item.title}</span>
                <span className="text-accent text-sm font-semibold">₱{Number(item.price_at_purchase).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center border-t border-border pt-4 mb-6">
          <span className="text-primary font-semibold">Total Paid</span>
          <span className="text-accent text-xl font-bold">₱{Number(order.total_amount).toFixed(2)}</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button onClick={() => navigate('/orders')} className="flex-1 bg-[#1a2235] text-white py-2 rounded-lg border border-gray-600 hover:bg-[#243050] transition-colors text-sm">
            View Orders
          </button>
          <button onClick={() => navigate('/')} className="flex-1 btn-primary text-sm">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}