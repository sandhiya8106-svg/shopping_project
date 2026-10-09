import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Trash2, Bookmark, ArrowRight,
  ShieldCheck, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    saveForLater,
    moveToCart
  } = useShop();
  const navigate = useNavigate();

  const items = cart.items || [];
  const savedItems = cart.savedItems || [];
  const isEmpty = items.length === 0 && savedItems.length === 0;

  if (isEmpty) {
    return (
      <div className="cart-page container">
        <div className="empty-state page-empty">
          <div className="empty-icon">
            <ShoppingBag size={28} />
          </div>
          <h2>Your cart is feeling light</h2>
          <p>Add a few good things and they’ll show up here.</p>
          <Link to="/products" className="button button-saffron">
            <span>Start shopping</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container">
      {/* Header */}
      <div className="cart-header">
        <div>
          <p className="eyebrow"><span />YOUR EDIT</p>
          <h1>Shopping cart <span>({cart.count || 0} items)</span></h1>
        </div>
        <Link to="/products" className="text-link">
          <span>Continue shopping</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <div className="cart-layout">
        {/* Cart Items Column */}
        <div className="cart-items">
          {cart.subtotal >= 60 ? (
            <div className="cart-note">
              <CheckCircle2 size={16} />
              <span>You unlocked free delivery on this order!</span>
            </div>
          ) : (
            <div className="cart-note" style={{ background: '#fff6df', color: '#6c6040' }}>
              <span>
                Add <b>${(60 - cart.subtotal).toFixed(0)}</b> more to qualify for free delivery.
              </span>
            </div>
          )}

          {items.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-thumb">
                <Link to={`/product/${item.product.id}`}>
                  <img src={item.product.image} alt={item.product.title} />
                </Link>
              </div>

              <div className="cart-item-copy">
                <Link to={`/product/${item.product.id}`} className="product-title">
                  {item.product.title}
                </Link>
                <div className="in-stock">
                  <span />
                  <span>In stock · ships in 1–2 days</span>
                </div>

                <div className="cart-item-actions">
                  <div className="quantity">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => saveForLater(item.id)}
                  >
                    <Bookmark size={13} />
                    <span>Save for later</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={13} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>

              <div className="cart-item-price">
                <strong>${((item.product.price || 0) * item.quantity).toFixed(0)}</strong>
              </div>
            </div>
          ))}

          {/* Saved For Later */}
          {savedItems.length > 0 && (
            <div className="saved-list">
              <h3>Saved for later ({savedItems.length})</h3>
              {savedItems.map((saved) => (
                <div key={saved.id} className="saved-row">
                  <img src={saved.product.image} alt={saved.product.title} />
                  <span>{saved.product.title} — <b>${saved.product.price}</b></span>
                  <button
                    type="button"
                    className="text-link"
                    onClick={() => moveToCart(saved.id)}
                  >
                    <span>Move to cart</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <aside className="order-summary">
          <h2>Order summary</h2>
          <div className="summary-lines">
            <div>
              <span>Subtotal</span>
              <b>${(cart.subtotal || 0).toFixed(0)}</b>
            </div>
            <div>
              <span>Delivery</span>
              <b>{cart.deliveryCharges === 0 ? "Free" : `$${cart.deliveryCharges}`}</b>
            </div>
            {cart.demoSavings > 0 && (
              <div className="summary-discount">
                <span>Demo savings</span>
                <b>−${(cart.demoSavings || 0).toFixed(0)}</b>
              </div>
            )}
          </div>

          <div className="summary-total">
            <span>Total</span>
            <strong>${(cart.total || 0).toFixed(0)}</strong>
          </div>

          <button
            type="button"
            className="button button-saffron full"
            disabled={items.length === 0}
            onClick={() => navigate('/checkout')}
          >
            <span>Continue to checkout</span>
            <ArrowRight size={14} />
          </button>

          <div className="secure-note">
            <ShieldCheck size={14} />
            <span>Secure demo checkout · no payment data stored</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
