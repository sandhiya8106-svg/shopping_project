import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Plus } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import RatingStars from './RatingStars';

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, wishlistIds } = useShop();
  const isWishlisted = wishlistIds.includes(product.id);

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            onError={(e) => {
              if (product.fallbackImage && e.target.src !== product.fallbackImage) {
                e.target.src = product.fallbackImage;
              }
            }}
          />
        </Link>
        {product.accent && (
          <span
            className="product-accent"
            style={{ backgroundColor: product.accent }}
          />
        )}
        {product.badge && (
          <span className="product-badge">{product.badge}</span>
        )}
        <button
          type="button"
          className={`wish-button ${isWishlisted ? 'is-wishlisted' : ''}`}
          onClick={() => toggleWishlist(product)}
          aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
        >
          <Heart size={15} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="product-info">
        <p className="product-category">
          {product.category} · {product.brand}
        </p>
        <Link to={`/product/${product.id}`} className="product-title">
          {product.title}
        </Link>
        <RatingStars rating={product.rating} reviews={product.reviews} size={12} small />

        <div className="price-line">
          <strong>${product.price.toFixed(0)}</strong>
          {product.originalPrice && product.originalPrice > product.price && (
            <del>${product.originalPrice.toFixed(0)}</del>
          )}
          {discountPercent > 0 && (
            <span>{discountPercent}% off</span>
          )}
        </div>

        <button
          type="button"
          className="button button-cream add-button"
          onClick={() => addToCart(product, 1)}
        >
          <span>Add to cart</span>
          <Plus size={13} />
        </button>
      </div>
    </article>
  );
}
