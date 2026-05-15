import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOrders } from '../services/api'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getOrders()
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center mt-20 text-muted">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold text-primary mb-6">Order History</h1>

      {orders.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-muted mb-4">You haven't placed any orders yet.</p>
          <button onClick={() => navigate('/')} className="btn-primary w-auto px-8">Browse games</button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map(order => (
            <div key={order.order_id} className="card">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-primary font-semibold">Order #{order.order_id}</p>
                  <p className="text-muted text-xs">{new Date(order.created_at).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="text-right">
                    <p className="text-accent font-bold">₱{Number(order.total_amount).toFixed(2)}</p>
                      <span className="badge text-green-400 border-green-700 bg-green-900/30 text-xs">
                        {order.payment_method || 'gcash'}
                         </span>
                        <div className="mt-1">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${
                             order.status === 'completed'  ? 'bg-green-900/30 text-green-400 border-green-700' :
                             order.status === 'cancelled'  ? 'bg-red-900/30 text-red-400 border-red-700' :
                            order.status === 'processing' ? 'bg-yellow-900/30 text-yellow-400 border-yellow-700' :
                             'bg-gray-900/30 text-gray-400 border-gray-700'
                                             }`}>
                          {order.status || 'pending'}
                          </span>
                            </div>
                            </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="border-t border-border pt-3 flex flex-col gap-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-border rounded-lg overflow-hidden flex-shrink-0">
                        {item.cover_image && <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-primary text-sm font-medium">{item.title}</p>
                        <p className="text-muted text-xs">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-accent text-sm font-semibold">₱{Number(item.price_at_purchase).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}