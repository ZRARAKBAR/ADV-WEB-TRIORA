
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";

// Admin imports
import AdminGuard from "./admin/AdminGuard";
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProducts from "./admin/AdminProducts";
import AdminCategories from "./admin/AdminCategories";
import AdminOrders from "./admin/AdminOrders";

function StoreLayout() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Storefront routes */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />

        <Route
          path="*"
          element={
            <main className="section">
              <h1>Page not found</h1>
            </main>
          }
        />
      </Routes>

      <footer className="footer">
        <Link to="/">
          TRIORA<span>.</span>
        </Link>
        <p>Everyday fashion. Made for your style.</p>
        <small>
          © {new Date().getFullYear()} TRIORA. All rights reserved.
        </small>
      </footer>
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Storefront */}
      <Route path="/*" element={<StoreLayout />} />

      {/* Admin login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected admin routes */}
      <Route element={<AdminGuard />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
