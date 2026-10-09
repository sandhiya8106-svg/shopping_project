import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <Link to="/" className="brand">
            <span className="brand-mark">S</span>
            <span>Shop<span>Kart</span></span>
          </Link>
          <p>
            Good things, well chosen.<br />
            A private demo marketplace built with React, Spring Boot, and MySQL.
          </p>
        </div>

        <div>
          <h4>Shop</h4>
          <Link to="/products">All products</Link>
          <Link to="/products?category=Electronics">Electronics & audio</Link>
          <Link to="/products?category=Home%20%26%20Kitchen">Home & kitchen</Link>
          <Link to="/products?category=Mobiles">Mobiles</Link>
          <Link to="/products?category=Fashion">Fashion</Link>
          <Link to="/products?category=Books">Books</Link>
        </div>

        <div>
          <h4>About</h4>
          <Link to="/products">Our approach</Link>
          <Link to="/products">Journal</Link>
          <Link to="/products">Careers</Link>
          <Link to="/products">Contact</Link>
        </div>

        <div>
          <h4>Need help?</h4>
          <Link to="/products">Delivery & returns</Link>
          <Link to="/products">FAQs</Link>
          <Link to="/products">Demo privacy</Link>
          <Link to="/products">Accessibility</Link>
        </div>
      </div>

      <div className="container footer-bottom">
        <span>© 2026 ShopKart studio · Made for learning · Not a real store</span>
        <span>United States 🇺🇸</span>
      </div>
    </footer>
  );
}
