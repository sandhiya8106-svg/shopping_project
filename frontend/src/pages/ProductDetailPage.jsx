import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart, Truck, ShieldCheck, Check, Sparkles,
  ShoppingBag, ArrowRight
} from 'lucide-react';
import api from '../api/client';
import RatingStars from '../components/RatingStars';
import ProductCard from '../components/ProductCard';
import { useShop } from '../context/ShopContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, wishlistIds } = useShop();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    api.get(`/products/${id}`)
      .then((res) => {
        if (res.data) {
          setProduct(res.data);
          setSelectedImage(res.data.image);
          return api.get(`/products/${id}/related?category=${encodeURIComponent(res.data.category)}`);
        }
      })
      .then((res) => {
        if (res?.data) {
          setRelated(res.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center', color: 'var(--muted)' }}>
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container empty-state page-empty">
        <h2>Product not found</h2>
        <p>That product might have wandered off or is no longer available.</p>
        <Link to="/products" className="button button-dark">
          <span>Back to catalog</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  const isWishlisted = wishlistIds.includes(product.id);
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const galleryImages = [
    product.image,
    product.fallbackImage || product.image
  ].filter(Boolean);

  const handleBuyNow = async () => {
    await addToCart(product, quantity);
    navigate('/checkout');
  };

  return (
    <div className="detail-page container">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to={`/products?category=${encodeURIComponent(product.category)}`}>
          {product.category}
        </Link>
        <span>/</span>
        <span>{product.title}</span>
      </nav>

      {/* Main Detail Layout */}
      <div className="detail-layout">
        {/* Gallery */}
        <div className="gallery">
          <div className="thumb-list">
            {galleryImages.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                className={selectedImage === imgUrl ? 'active' : ''}
                onClick={() => setSelectedImage(imgUrl)}
              >
                <img src={imgUrl} alt={`${product.title} view ${idx + 1}`} />
              </button>
            ))}
          </div>

          <div className="main-product-image">
            <img src={selectedImage || product.image} alt={product.title} />
            <div className="image-note">
              <Sparkles size={12} color="var(--green)" />
              <span>Quality checked</span>
            </div>
          </div>
        </div>

        {/* Product Copy & Purchase Panel */}
        <div className="detail-copy">
          <p className="product-category">
            {product.category} · {product.brand}
          </p>
          <h1>{product.title}</h1>

          <RatingStars rating={product.rating} reviews={product.reviews} size={15} />

          <div className="detail-price">
            <strong>${product.price.toFixed(0)}</strong>
            {product.originalPrice && product.originalPrice > product.price && (
              <del>${product.originalPrice.toFixed(0)}</del>
            )}
            {discountPercent > 0 && (
              <span>{discountPercent}% off</span>
            )}
          </div>

          <p className="tax-note">
            Inclusive of all demo taxes · Free delivery available · In stock ({product.stock || 12} left)
          </p>

          <div className="detail-description">
            <p>{product.description}</p>
          </div>

          <div className="offer-box">
            <div>
              <Sparkles size={16} />
              <b>Extra 10% off</b>
            </div>
            <p>
              Use code <b>WELCOME10</b> on your first demo order.
            </p>
          </div>

          <div className="delivery-box">
            <Truck size={17} />
            <div>
              <strong>Deliver to your doorstep</strong>
              <span>Enter your address at checkout for an estimate · Usually 2–4 days</span>
            </div>
          </div>

          <div className="purchase-row">
            <div className="quantity">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                −
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="button button-cream"
              onClick={() => addToCart(product, quantity)}
            >
              <ShoppingBag size={15} />
              <span>Add to cart</span>
            </button>

            <button
              type="button"
              className="button button-saffron"
              onClick={handleBuyNow}
            >
              <span>Buy now</span>
              <ArrowRight size={14} />
            </button>

            <button
              type="button"
              className={`detail-wish ${isWishlisted ? 'is-wishlisted' : ''}`}
              onClick={() => toggleWishlist(product)}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="detail-benefits">
            <span><Check size={13} /> Free shipping</span>
            <span><Check size={13} /> 30-day easy returns</span>
            <span><Check size={13} /> Lower-impact packaging</span>
          </div>
        </div>
      </div>

      {/* Specifications & Related Items */}
      <div className="detail-lower">
        <div className="spec-card">
          <p className="eyebrow"><span />THE DETAILS</p>
          <h2>Made for the long haul</h2>
          <p>
            Designed with thoughtful materials and tested for everyday durability.
          </p>
          <div className="spec-list">
            {(product.specs && product.specs.length > 0
              ? product.specs
              : [`${product.brand} considered construction`, `${product.category} essential`, 'Packed in recyclable materials']
            ).map((spec, i) => (
              <div key={i}>
                <Check size={14} />
                <span>{spec}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="related">
          <div className="section-heading">
            <div>
              <p className="eyebrow"><span />YOU MAY ALSO LIKE</p>
              <h2>More good finds</h2>
            </div>
            <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="text-link">
              <span>View category</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="product-grid three">
            {related.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
