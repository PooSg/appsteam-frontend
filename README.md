# Appsteam — Frontend

React + Vite + Tailwind CSS frontend for the Appsteam digital game store.

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and set your backend URL
cp .env.example .env

# 3. Start dev server
npm run dev
```

The app runs at `http://localhost:5173`

## Pages

| Route | Page | Access |
|-------|------|--------|
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/` | Home / Browse | Customer |
| `/game/:id` | Game detail | Customer |
| `/cart` | Cart & checkout | Customer |
| `/profile` | Edit profile | Customer |
| `/admin` | Admin dashboard | Admin only |
| `/admin/add` | Add game | Admin only |
| `/admin/edit/:id` | Edit game | Admin only |

## Project structure

```
src/
├── components/       Navbar, GameCard, ProtectedRoute, AdminRoute
├── context/          AuthContext (global user state + JWT)
├── pages/            Customer pages
│   └── admin/        Admin pages
├── services/         api.js (all Axios calls)
├── App.jsx           Route definitions
└── main.jsx          App entry point
```

## Build for production

```bash
npm run build
```

Deploy the `dist/` folder to Vercel.
