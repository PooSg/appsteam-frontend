import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import GameDetail from './pages/GameDetail'
import Cart from './pages/Cart'
import Profile from './pages/Profile'

import AdminDashboard from './pages/admin/AdminDashboard'
import AddGame from './pages/admin/AddGame'
import EditGame from './pages/admin/EditGame'
import Wishlist from './pages/Wishlist'
import Orders from './pages/Orders'

export default function App() {
  return (
    <div className="min-h-screen bg-dark">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/"            element={<Home />} />
            <Route path="/game/:id"    element={<GameDetail />} />
            <Route path="/cart"        element={<Cart />} />
            <Route path="/profile"     element={<Profile />} />
            <Route path="/wishlist"  element={<Wishlist />} />
            <Route path="/orders" element={<Orders />} />
          </Route>

          {/* Admin protected */}
          <Route element={<AdminRoute />}>
            <Route path="/admin"           element={<AdminDashboard />} />
            <Route path="/admin/add"       element={<AddGame />} />
            <Route path="/admin/edit/:id"  element={<EditGame />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
