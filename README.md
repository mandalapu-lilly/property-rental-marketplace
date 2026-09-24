# Property Rental Marketplace 🏡

A full-stack, enterprise-grade Property & Rental Marketplace application built with **React.js, Vite, Tailwind CSS, Node.js, Express.js, and MongoDB Atlas**.

---

## 🌟 Key Features

### 1. Interactive Property Maps
- **Leaflet & OpenStreetMap** integration (100% open-source, no paid API keys required).
- Interactive property pins with popups showing title, location, price, and direct detail links.
- Dynamic **List View / Map View** toggle on property browse pages.
- Embedded map on property details with GPS coordinate validation (-90° to 90° latitude, -180° to 180° longitude).

### 2. Wishlist & Favorites
- Authenticated tenants can save/bookmark properties to their personalized wishlist.
- Real-time heart toggle with instant database synchronization.
- Duplicate favorites prevention via MongoDB compound unique index.

### 3. Booking & Reservation Engine
- Multi-night property reservation with date picker, guest count selection, and live price estimation.
- **Server-Side Security**: Total price is computed strictly on the backend based on property rate and duration.
- **Date Overlap Prevention**: Rejects overlapping bookings for the same property.
- Booking status lifecycle: `pending` ➔ `confirmed` / `rejected` ➔ `cancelled` ➔ `completed`.

### 4. Ratings & Guest Reviews
- 1 to 5 star rating system with aggregate calculations (`averageRating` and `totalReviews`).
- **Stay-Verification**: Guests can review properties where they have a confirmed or completed stay.
- Review moderation for administrators and inline editing/deletion for authors.

### 5. Multi-Role Dashboards
- **Tenant Dashboard**: View active bookings, cancel reservations, manage wishlist, and submit reviews.
- **Host Dashboard**: Property inventory, reservation approval/rejection, occupancy metrics, and estimated rental revenue.
- **Admin Dashboard**: System metrics, user role management, listing moderation, and reviews oversight.

### 6. Search, Filter & Sort
- Real-time backend search across city/locality, property type, price ranges, and bedroom configurations.
- Multi-criteria sorting: `Newest`, `Price: Low to High`, `Price: High to Low`, and `Highest Rated`.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS, React Router v7, Axios, Lucide Icons |
| **Mapping** | Leaflet, React-Leaflet, OpenStreetMap Tiles |
| **Backend** | Node.js, Express.js (ES Modules) |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Security & Auth** | JSON Web Tokens (JWT), bcryptjs, Role-Based Access Control (RBAC) |

---

## 📁 Folder Structure

```
property-rental-marketplace/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection handler
│   ├── controllers/
│   │   ├── adminController.js    # Admin analytics & user/property management
│   │   ├── authController.js     # User registration, login, profile & password change
│   │   ├── bookingController.js  # Booking creation, overlap check & status flow
│   │   ├── favoriteController.js # Wishlist management
│   │   ├── hostController.js     # Host metrics & revenue calculations
│   │   ├── propertyController.js # Property CRUD, filtering & search
│   │   └── reviewController.js   # Review submission, rating hooks & moderation
│   ├── middleware/
│   │   └── authMiddleware.js     # JWT token verification & role authorization
│   ├── models/
│   │   ├── Booking.js            # Booking schema & indexes
│   │   ├── Favorite.js           # Favorite schema with compound unique index
│   │   ├── Property.js           # Property schema with coordinates & amenities
│   │   ├── Review.js             # Review schema with auto-aggregating rating hook
│   │   └── User.js               # User authentication & role schema
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── favoriteRoutes.js
│   │   ├── hostRoutes.js
│   │   ├── propertyRoutes.js
│   │   └── reviewRoutes.js
│   ├── .env.example              # Environment variables template
│   ├── package.json
│   └── server.js                 # Express application entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Responsive navigation with role links
│   │   │   ├── PropertyMap.jsx   # Reusable Leaflet OpenStreetMap component
│   │   │   └── ProtectedRoute.jsx# Role-guarded route wrapper
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global user state & JWT management
│   │   ├── pages/
│   │   │   ├── AddProperty.jsx   # Property listing creation
│   │   │   ├── AdminDashboard.jsx# Admin operations console
│   │   │   ├── Booking.jsx       # Booking checkout flow
│   │   │   ├── Dashboard.jsx     # User portal
│   │   │   ├── EditProperty.jsx  # Property editor
│   │   │   ├── Favorites.jsx     # Wishlist page
│   │   │   ├── Home.jsx          # Hero, categories & featured listings
│   │   │   ├── HostBookings.jsx  # Host reservation requests
│   │   │   ├── HostDashboard.jsx # Host analytics hub
│   │   │   ├── Login.jsx         # User login
│   │   │   ├── MyBookings.jsx    # Tenant bookings & review trigger
│   │   │   ├── MyProperties.jsx  # Host listing manager
│   │   │   ├── Profile.jsx       # User profile & password reset
│   │   │   ├── Properties.jsx    # Browse catalog with Map & List views
│   │   │   ├── PropertyDetails.jsx# Listing detail, gallery, map & reviews
│   │   │   └── Register.jsx      # User account signup
│   │   ├── services/
│   │   │   └── api.js            # Axios client with JWT interceptor
│   │   ├── App.jsx               # React Router routes
│   │   ├── main.jsx              # App root
│   │   └── index.css             # Tailwind CSS & Leaflet map styling
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB Atlas cluster URI

### 1. Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_jwt_secret_key
   ```
4. Start the backend server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   *The backend will run on `http://localhost:5000`.*

---

### 2. Frontend Configuration
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   *The frontend will run on `http://localhost:5173`.*

---

---

## 🌐 Production Deployment Guide

### Option 1: Render Full-Stack (One-Click Blueprint)
1. Push this repository to GitHub.
2. Sign in to [Render](https://render.com/) and click **New +** ➔ **Blueprint**.
3. Select your `property-rental-marketplace` repository. Render will automatically read `render.yaml`.
4. Configure environment variables in the Render dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A long random secret string
   - `FRONTEND_URL`: Your frontend Render domain (e.g. `https://property-rental-frontend.onrender.com`)
   - `VITE_API_BASE_URL`: Your backend Render domain (e.g. `https://property-rental-backend.onrender.com`)

---

### Option 2: Vercel (Frontend) + Render / Railway (Backend)

#### Step 1: Deploy Backend (Render or Railway)
1. In Render, create a **New Web Service** pointing to the repository.
2. Set Root Directory: `backend`
3. Set Build Command: `npm install`
4. Set Start Command: `npm start`
5. Add Environment Variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `FRONTEND_URL` (your Vercel app domain)
   - `PORT=5000`

#### Step 2: Deploy Frontend (Vercel)
1. In Vercel, click **Add New Project** and import `property-rental-marketplace`.
2. Set Root Directory: `frontend`
3. Set Framework Preset: **Vite**
4. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-backend-api.onrender.com`
5. Click **Deploy**. SPA routes will be seamlessly handled via `frontend/vercel.json`.

---

## 🔒 Security & Authorization

- **No Secrets in Source Code**: Database URIs and JWT secrets reside exclusively in backend environment variables.
- **Role Isolation**:
  - `user`: Browse, search, favorite, book properties, manage personal bookings, review stayed listings.
  - `host`: All `user` capabilities + create/edit/delete properties, manage incoming bookings, host dashboard metrics.
  - `admin`: Full system control + user management, platform-wide analytics, property and review moderation.
- **Tamper-Proof Pricing**: Frontend client prices are ignored; server computes charges using database pricing.
- **Password Protection**: Passwords hashed with `bcryptjs` salt rounds; passwords never exposed in JSON responses.

---

## 📄 License
This project is licensed under the ISC License.
