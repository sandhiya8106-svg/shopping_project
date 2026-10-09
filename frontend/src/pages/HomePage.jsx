import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight, Truck, ShieldCheck, Package, Headphones,
  Smartphone, Laptop, Watch, Home, Gamepad2, Sparkles, Quote
} from 'lucide-react';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import { useShop } from '../context/ShopContext';

const MOOD_CATEGORIES = [
  { name: "Mobiles", color: "#dbe8ff", detail: "Pocket-sized smart living", icon: Smartphone },
  { name: "Laptops", color: "#f6dfbd", detail: "Work, play, wherever", icon: Laptop },
  { name: "Headphones", color: "#f2c9c3", detail: "Find your frequency", icon: Headphones },
  { name: "Smartwatches", color: "#d4e5d3", detail: "Time for better habits", icon: Watch },
  { name: "Home & Kitchen", color: "#ddd5ea", detail: "Make space for good living", icon: Home },
  { name: "Gaming", color: "#d3e3e2", detail: "Level up your downtime", icon: Gamepad2 }
];

export default function HomePage() {
  const [deals, setDeals] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const { showToast } = useShop();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products/deals?limit=4')
      .then((res) => setDeals(res.data || []))
      .catch((err) => console.error(err));

    api.get('/products/bestsellers?limit=3')
      .then((res) => setBestsellers(res.data || []))
      .catch((err) => console.error(err));
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
      showToast('Thank you for joining our list!');
      setNewsletterEmail('');
    }
  };

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero container">
        <div
          className="hero-image"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1600&q=85')`
          }}
        />
        <div className="hero-copy">
          <p className="eyebrow light">
            <span />THE SHOPKART EDIT
          </p>
          <h1>
            Good things,<br />
            <em>well chosen.</em>
          </h1>
          <p>
            Find the pieces that make everyday feel a little more considered.
          </p>
          <Link to="/products" className="button button-saffron">
            <span>Shop the edit</span>
            <ArrowRight size={14} />
          </Link>
          <div className="hero-pagination">
            <span className="active" />
            <span />
            <span />
            <small>01 / 03</small>
          </div>
        </div>
        <div className="hero-caption">
          <span>•</span>
          <span>Studio objects for slower mornings</span>
        </div>
      </section>

      {/* Trust Strip */}
      <div className="container trust-strip">
        <div>
          <Truck size={22} />
          <span>
            <b>Free, fast delivery</b>
            <small>On orders over $60</small>
          </span>
        </div>
        <div>
          <ShieldCheck size={22} />
          <span>
            <b>Shop with confidence</b>
            <small>30-day easy returns</small>
          </span>
        </div>
        <div>
          <Package size={22} />
          <span>
            <b>Thoughtfully packaged</b>
            <small>Less waste, more care</small>
          </span>
        </div>
        <div>
          <Headphones size={22} />
          <span>
            <b>Here when you need us</b>
            <small>Human customer support</small>
          </span>
        </div>
      </div>

      {/* Browse by mood (Categories) */}
      <section className="container section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span />BROWSE BY MOOD</p>
            <h2>A little something for every day</h2>
          </div>
          <Link to="/products" className="text-link">
            <span>See all categories</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="category-grid">
          {MOOD_CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={cat.name}
                className="category-card"
                style={{ backgroundColor: cat.color, cursor: 'pointer' }}
                onClick={() => navigate(`/products?category=${encodeURIComponent(cat.name)}`)}
              >
                <div className="category-icon">
                  <IconComponent size={19} color="var(--ink)" />
                </div>
                <strong>{cat.name}</strong>
                <small>{cat.detail}</small>
                <span className="category-arrow">
                  <ArrowRight size={15} color="var(--ink)" />
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Limited-time offers (Deals) */}
      <section className="tinted-section section-block">
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><span />LIMITED-TIME OFFERS</p>
              <h2>The good stuff, for less</h2>
            </div>
            <Link to="/products?sort=deals" className="text-link">
              <span>View all deals</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="product-grid four">
            {deals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Customer Favorites (Best Sellers + Editorial) */}
      <section className="container section-block">
        <div className="section-heading">
          <div>
            <p className="eyebrow"><span />CUSTOMER FAVORITES</p>
            <h2>What everyone is talking about</h2>
          </div>
          <Link to="/products?sort=rating" className="text-link">
            <span>Shop best sellers</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="editorial-row">
          <div className="editorial-note">
            <span className="quote-mark">“</span>
            <p>
              Finding things that feel quiet, durable, and genuinely useful shouldn’t require digging through thousands of identical listings.
            </p>
            <span className="signature">— The ShopKart curation team</span>
            <Link to="/products?sort=rating" className="text-link">
              <span>Meet the collection</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="product-grid three">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="container newsletter">
        <div className="newsletter-copy">
          <p className="eyebrow"><span />A NOTE FROM US</p>
          <h2>
            Make room for<br />
            <em>good discoveries.</em>
          </h2>
          <p>
            A once-weekly letter with small makers, new arrivals, and studio updates. No spam, ever.
          </p>
          {newsletterSuccess ? (
            <p style={{ color: 'var(--green)', fontWeight: 600, marginTop: '16px' }}>
              ✓ You are on the list! Welcome to the ShopKart circle.
            </p>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              <input
                type="email"
                placeholder="Your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
              />
              <button type="submit" className="button button-dark">
                <span>Join the list</span>
                <ArrowRight size={14} />
              </button>
            </form>
          )}
          <small>By joining, you agree to our demo privacy policy.</small>
        </div>
      </section>
    </div>
  );
}
