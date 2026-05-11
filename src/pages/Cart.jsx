import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCart, removeFromCart, checkout } from '../services/api'

const PAYMENT_METHODS = ['credit_card', 'gcash', 'paypal']
const LABELS = { credit_card: 'Credit Card', gcash: 'GCash', paypal: 'PayPal' }

export default function Cart() {
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)
  const [method, setMethod]   = useState('credit_card')
  const [paying, setPaying]   = useState(false)
  const navigate = useNavigate()

  useEffect(() => { fetchCart() }, [])

  async function fetchCart() {
    try {
      const res = await getCart()
      setItems(res.data)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  async function handleRemove(itemId) {
    try {
      await removeFromCart(itemId)
      setItems(items.filter(i => i.cart_item_id !== itemId))
    } catch { alert('Could not remove item') }
  }

  async function handleCheckout() {
    if (items.length === 0) return
    setPaying(true)
    try {
      await checkout({ payment_method: method })
      alert('Order placed successfully!')
      navigate('/')
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed')
    } finally {
      setPaying(false)
    }
  }

  const total = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0)

  if (loading) return <div className="text-center mt-20 text-muted">Loading cart...</div>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-primary">
          Your cart <span className="text-muted font-normal text-base">({items.length} item{items.length !== 1 ? 's' : ''})</span>
        </h1>
        <button onClick={() => navigate('/')} className="text-sm text-muted hover:text-primary transition-colors">
          ← Back to store
        </button>
      </div>

      {items.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-muted mb-4">Your cart is empty.</p>
          <button onClick={() => navigate('/')} className="btn-primary w-auto px-8">Browse games</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="md:col-span-2 flex flex-col gap-3">
            {items.map(item => (
              <div key={item.cart_item_id} className="card flex items-center gap-4">
                <div className="w-14 h-10 bg-border rounded-lg flex-shrink-0 overflow-hidden">
                  {item.cover_image
                    ? <img src={item.cover_image} alt={item.title} className="w-full h-full object-cover" />
                    : null
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-primary font-semibold text-sm truncate">{item.title}</p>
                  <p className="text-muted text-xs">{item.genre || 'Game'}</p>
                </div>
                <p className="text-accent font-bold text-sm whitespace-nowrap">
                  ₱{(Number(item.price) * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => handleRemove(item.cart_item_id)}
                  className="text-muted hover:text-red-400 text-lg leading-none transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="card flex flex-col gap-3">
            <h2 className="text-primary font-semibold text-sm">Order summary</h2>

            <div className="flex justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="text-primary">₱{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Discount</span>
              <span className="text-green-400">−₱0.00</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-semibold">
              <span className="text-primary">Total</span>
              <span className="text-accent text-lg">₱{total.toFixed(2)}</span>
            </div>

            {/* Payment method */}
            <p className="text-xs text-muted mt-1">Payment method</p>
            <div className="flex flex-col gap-2">
              {PAYMENT_METHODS.map(m => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors
                    ${method === m
                      ? 'border-accent text-accent bg-border/50'
                      : 'border-border text-muted hover:border-subtle'
                    }`}
                >
                  <span className={`w-3 h-3 rounded-full border-2 flex-shrink-0
                    ${method === m ? 'border-accent bg-accent' : 'border-muted'}`}
                  />
                  {LABELS[m]}
                </button>
              ))}
            </div>

            <button onClick={handleCheckout} disabled={paying} className="btn-primary mt-2">
              {paying ? 'Processing...' : 'Proceed to checkout'}
            </button>
            <p className="text-center text-xs text-muted">Secure · Encrypted · Instant</p>
          </div>
        </div>
      )}
    </div>
  )
}
