import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
})

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auth
export const registerUser  = (data) => api.post('/auth/register', data)
export const loginUser     = (data) => api.post('/auth/login', data)

// Games
export const getGames      = (params) => api.get('/games', { params })
export const getGame       = (id)     => api.get(`/games/${id}`)
export const createGame    = (data)   => api.post('/games', data)
export const updateGame    = (id, data) => api.put(`/games/${id}`, data)
export const deleteGame    = (id)     => api.delete(`/games/${id}`)

// Cart
export const getCart       = ()       => api.get('/cart')
export const addToCart     = (data)   => api.post('/cart', data)
export const removeFromCart = (itemId) => api.delete(`/cart/${itemId}`)

// Orders
export const checkout      = (data)   => api.post('/orders/checkout', data)
export const getOrders     = ()       => api.get('/orders')

// Profile
export const getProfile    = ()       => api.get('/users/profile')
export const updateProfile = (data)   => api.put('/users/profile', data)

export default api
