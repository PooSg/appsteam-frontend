import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-nav border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">

        {/* Logo */}
        <Link to="/" className="text-accent font-bold text-lg tracking-widest">
          APPSTEAM
        </Link>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/"      className="text-sm text-muted hover:text-primary transition-colors">Store</Link>
          {isAdmin && (
            <Link to="/admin" className="text-sm text-muted hover:text-primary transition-colors">Admin</Link>
          )}
        </div>

        {/* Right side */}
        {user ? (
          <div className="flex items-center gap-3">
            <Link to="/wishlist" className="bg-border text-accent text-xs px-3 py-1.5 rounded-lg hover:bg-subtle transition-colors">
               Wishlist
              </Link>
              <Link to="/cart" className="bg-border text-accent text-xs px-3 py-1.5 rounded-lg hover:bg-subtle transition-colors">
              Cart
              </Link>
            <Link to="/profile" className="w-8 h-8 rounded-full bg-border flex items-center justify-center text-xs text-accent font-semibold hover:bg-subtle transition-colors">
              {user.username?.charAt(0).toUpperCase()}
            </Link>
            <Link to="/orders" className="bg-border text-accent text-xs px-3 py-1.5 rounded-lg hover:bg-subtle transition-colors">
                         Orders
                    </Link>
            <button
              onClick={handleLogout}
              className="text-xs text-muted hover:text-red-400 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login"    className="text-sm text-muted hover:text-primary transition-colors">Log in</Link>
            <Link to="/register" className="btn-primary py-1.5 px-4 text-sm w-auto">Sign up</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
