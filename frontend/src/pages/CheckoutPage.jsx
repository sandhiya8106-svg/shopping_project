import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Check, ArrowRight, Truck,
  CreditCard, Smartphone, Banknote, MapPin
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function CheckoutPage() {
  const { cart, placeOrder, user } = useShop();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [address, setAddress] = useState({
    fullName: user?.fullName || 'Demo Shopper',
    phone: '555-0199',
    street: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    zip: '97477'
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');

  const items = cart.items || [];

  if (placedOrder) {
    return (
      <div className="confirmation container">
        <div className="confirmation-icon">
          <Check size={40} strokeWidth={2.5} />
        </div>
        <h1>Demo order placed</h1>
        <p className="confirmation-lede">
          Order <b>{placedOrder.orderNumber}</b> was created. This is a fictional checkout—no payment was processed.
        </p>

        <div className="confirmation-card">
          <div>
            <span>Estimated arrival</span>
            <strong>3–5 business days</strong>
          </div>
          <div>
            <span>Total paid</span>
            <strong>${(placedOrder.total || 0).toFixed(0)}</strong>
          </div>
          <div>
            <span>Payment</span>
            <strong>
              Demo · {placedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : placedOrder.paymentMethod === 'upi' ? 'UPI' : 'Card'}
            </strong>
          </div>
        </div>

        <div className="confirmation-actions">
          <Link to="/orders" className="button button-saffron">
            <span>View your orders</span>
            <ArrowRight size={14} />
          </Link>
          <Link to="/products" className="button button-outline">
            <span>Keep browsing</span>
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-page container">
        <div className="empty-state page-empty">
          <h2>Nothing to check out</h2>
          <p>Your cart is empty right now.</p>
          <Link to="/products" className="button button-saffron">
            <span>Back to shopping</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.street || !address.city || !address.zip) {
      setError('Please complete every required address field.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    setError('');
    try {
      const order = await placeOrder({
        fullName: address.fullName,
        phone: address.phone,
        street: address.street,
        city: address.city,
        state: address.state,
        zip: address.zip,
        paymentMethod
      });
      setPlacedOrder(order);
    } catch (err) {
      setError(err.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page container">
      {/* Checkout Top */}
      <div className="checkout-top">
        <div>
          <p className="eyebrow"><span />PRIVATE DEMO CHECKOUT</p>
          <h1>Let’s get this to you.</h1>
        </div>
        <div className="checkout-secure">
          <ShieldCheck size={16} />
          <span>Safe & fictional</span>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="steps">
        <div className={step >= 1 ? "active" : ""}>
          <span>1</span>
          <b>Address</b>
        </div>
        <i />
        <div className={step >= 2 ? "active" : ""}>
          <span>2</span>
          <b>Review</b>
        </div>
        <i />
        <div className={step >= 3 ? "active" : ""}>
          <span>3</span>
          <b>Payment</b>
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="checkout-layout">
        {/* Checkout Main Flow */}
        <div className="checkout-form">
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="checkout-card">
              <div className="card-heading">
                <span className="step-number">01</span>
                <div>
                  <h2>Where should we send it?</h2>
                  <p>Use any fictional details for this demo.</p>
                </div>
              </div>

              <form onSubmit={handleAddressSubmit}>
                <div className="form-grid">
                  <div className="field">
                    <span>Full name</span>
                    <input
                      type="text"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="field">
                    <span>Phone number</span>
                    <input
                      type="tel"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="field wide">
                    <span>Street address</span>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      required
                    />
                  </div>
                  <div className="field">
                    <span>City</span>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      required
                    />
                  </div>
                  <div className="field">
                    <span>State</span>
                    <input
                      type="text"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      required
                    />
                  </div>
                  <div className="field">
                    <span>ZIP / Pincode</span>
                    <input
                      type="text"
                      value={address.zip}
                      onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="button button-saffron">
                  <span>Continue to review</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Review Order */}
          {step === 2 && (
            <div className="checkout-card">
              <div className="card-heading">
                <span className="step-number">02</span>
                <div>
                  <h2>Review your order</h2>
                  <p>Make sure the good stuff looks right.</p>
                </div>
                <button
                  type="button"
                  className="text-link edit-button"
                  onClick={() => setStep(1)}
                >
                  Edit address
                </button>
              </div>

              <div className="address-preview">
                <MapPin size={16} />
                <div>
                  <b>{address.fullName}</b> · {address.phone}<br />
                  {address.street}, {address.city}, {address.state} {address.zip}
                </div>
              </div>

              <div className="checkout-items">
                {items.map((item) => (
                  <div key={item.id}>
                    <img src={item.product.image} alt={item.product.title} />
                    <span>
                      <b>{item.product.title}</b>
                      <small>Qty {item.quantity}</small>
                    </span>
                    <strong>${((item.product.price || 0) * item.quantity).toFixed(0)}</strong>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="button button-saffron"
                onClick={() => setStep(3)}
              >
                <span>Continue to payment</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Step 3: Payment Options */}
          {step === 3 && (
            <div className="checkout-card">
              <div className="card-heading">
                <span className="step-number">03</span>
                <div>
                  <h2>Choose demo payment</h2>
                  <p>No real credentials are collected or processed.</p>
                </div>
              </div>

              <div className="payment-options">
                <div
                  className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('cod')}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <div className="payment-icon">
                    <Banknote size={17} color="var(--coral)" />
                  </div>
                  <span>
                    <b>Cash on Delivery</b>
                    <small>Pay when your fictional parcel arrives</small>
                  </span>
                  <div className="payment-check">
                    <Check size={16} />
                  </div>
                </div>

                <div
                  className={`payment-option ${paymentMethod === 'upi' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('upi')}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                  />
                  <div className="payment-icon">
                    <Smartphone size={17} color="var(--coral)" />
                  </div>
                  <span>
                    <b>UPI · Demo</b>
                    <small>A simulated UPI handoff</small>
                  </span>
                  <div className="payment-check">
                    <Check size={16} />
                  </div>
                </div>

                <div
                  className={`payment-option ${paymentMethod === 'card' ? 'selected' : ''}`}
                  onClick={() => setPaymentMethod('card')}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <div className="payment-icon">
                    <CreditCard size={17} color="var(--coral)" />
                  </div>
                  <span>
                    <b>Card · Demo</b>
                    <small>A simulated card payment</small>
                  </span>
                  <div className="payment-check">
                    <Check size={16} />
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="button button-saffron full"
                disabled={submitting}
                onClick={handlePlaceOrder}
              >
                <span>{submitting ? "Placing order..." : "Place demo order"}</span>
                <ArrowRight size={14} />
              </button>
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

          <div className="secure-note">
            <ShieldCheck size={14} />
            <span>Secure demo checkout · no payment data stored</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
