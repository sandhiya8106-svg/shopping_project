import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search, ShoppingBag, MapPin, User as UserIcon,
  Package, Menu, X, Sparkles, Heart
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import SearchAutocomplete from './SearchAutocomplete';

const NAV_LINKS = [
  { label: "Deals", href: "/products?sort=deals" },
  { label: "Mobiles", href: "/products?category=Mobiles" },
  { label: "Laptops", href: "/products?category=Laptops" },
  { label: "Electronics", href: "/products?category=Electronics" },
  { label: "Fashion", href: "/products?category=Fashion" },
  { label: "Books", href: "/products?category=Books" },
  { label: "Gaming", href: "/products?category=Gaming" }
];

export default function Header() {
  const { user, cart, logout, wishlistIds } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  // Close autocomplete on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowAutocomplete(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sync search input with URL search param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) setSearchTerm(q);
  }, [location.search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowAutocomplete(false);
    if (searchTerm.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const handleSelectSuggestion = (term) => {
    setSearchTerm(term);
    navigate(`/products?q=${encodeURIComponent(term)}`);
  };

  return (
    <header className="site-header">
      {/* Topline Banner */}
      <div className="topline">
        <div className="container top-line-inner">
          <span>Free delivery on orders over $60</span>
          <div className="topline-right">
            <span>Private demo store</span>
            <span className="dot">•</span>
            <span>Help center</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="header-main">
        <div className="container header-inner">
          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to="/" className="brand">
            <span className="brand-mark">S</span>
            <span>Shop<span>Kart</span></span>
          </Link>

          <div className="location-chip">
            <MapPin size={16} />
            <span>
              <small>Deliver to</small>
              United States
            </span>
          </div>

          <form
            ref={searchRef}
            className="search-bar search-bar-enhanced"
            onSubmit={handleSearchSubmit}
          >
            <input
              type="text"
              placeholder="Search laptops, mobiles, headphones..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowAutocomplete(true);
              }}
              onFocus={() => setShowAutocomplete(true)}
              autoComplete="off"
            />
            <button type="submit" aria-label="Search">
              <Search size={18} />
            </button>

            {showAutocomplete && (
              <SearchAutocomplete
                query={searchTerm}
                onSelect={handleSelectSuggestion}
                onClose={() => setShowAutocomplete(false)}
              />
            )}
          </form>

          <div className="header-actions">
            <Link to={user ? "/account" : "/login"} className="header-action account-action">
              <UserIcon size={17} />
              <span>
                <small>{user ? `Hello, ${user.fullName.split(' ')[0]}` : "Hello, sign in"}</small>
                Account
              </span>
            </Link>

            <Link to="/orders" className="header-action orders-action">
              <Package size={17} />
              <span>
                <small>Track</small>
                Orders
              </span>
            </Link>

            <Link to="/cart" className="cart-action" aria-label="Shopping Cart">
              <div className="cart-icon">
                <ShoppingBag size={20} />
                <b>{cart.count || 0}</b>
              </div>
              <span>Cart</span>
            </Link>

            {user && (
              <button type="button" onClick={logout} className="sign-out">
                Sign out
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <nav className="nav-row">
        <div className="container nav-inner">
          <Link to="/products" className="all-menu">
            <Menu size={15} />
            <span>All categories</span>
          </Link>

          {NAV_LINKS.map((link) => (
            <Link key={link.label} to={link.href}>
              {link.label}
            </Link>
          ))}

          <div className="nav-spacer" />

          <div className="nav-note">
            <Sparkles size={13} color="var(--saffron)" />
            <span>Curated for the everyday</span>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Accordion */}
      {mobileMenuOpen && (
        <div className="mobile-nav">
          <div className="container">
            <Link to="/products" onClick={() => setMobileMenuOpen(false)}>
              All Products
            </Link>
            <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}>
              Wishlist ({wishlistIds.length})
            </Link>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/account" onClick={() => setMobileMenuOpen(false)}>
              My Account
            </Link>
            <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>
              My Orders
            </Link>
            {user ? (
              <button
                type="button"
                className="sign-out"
                style={{ textAlign: 'left', padding: '11px 5px', display: 'block' }}
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
              >
                Sign out ({user.email})
              </button>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
