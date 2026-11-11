import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();
  const { user, logout } = useAuth();

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="nav-inner">
        <button
          className="icon-button mobile-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <Link to="/" className="brand" onClick={closeMenu}>
          TRIORA<span>.</span>
        </Link>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/products" onClick={closeMenu}>Shop</NavLink>
          <NavLink to="/products?ageGroup=adult&gender=men" onClick={closeMenu}>
            Men
          </NavLink>
          <NavLink to="/products?ageGroup=adult&gender=women" onClick={closeMenu}>
            Women
          </NavLink>
          <NavLink to="/products?ageGroup=kids" onClick={closeMenu}>
            Kids
          </NavLink>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-user"><User size={17} /> {user.name}</span>
              <button className="icon-button" onClick={logout} title="Logout">
                <LogOut size={19} />
              </button>
            </>
          ) : (
            <Link to="/login" className="nav-login">Login</Link>
          )}

          <Link to="/cart" className="cart-link" aria-label="Shopping cart">
            <ShoppingBag size={21} />
            <span>{itemCount}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}