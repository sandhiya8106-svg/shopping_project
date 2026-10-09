import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

export default function WishlistPage() {
  const { wishlist } = useShop();

  return (
    <div className="wishlist-page container">
      <div className="account-heading">
        <p className="eyebrow"><span />YOUR SHOPKART</p>
        <h1>Your wishlist</h1>
        <p className="muted">
          A place for the maybes, the someday soon, and the definitely.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-state page-empty">
          <div className="empty-icon">
            <Heart size={28} />
          </div>
          <h2>Nothing saved yet</h2>
          <p>Tap the heart on anything that catches your eye.</p>
          <Link to="/products" className="button button-saffron">
            <span>Find something good</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : (
        <div className="product-grid four">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
