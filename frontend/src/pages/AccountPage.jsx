import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, Heart, MapPin, CreditCard,
  Settings, HelpCircle, ChevronRight, LogOut, Check
} from 'lucide-react';
import { useShop } from '../context/ShopContext';
import api from '../api/client';

export default function AccountPage() {
  const { user, logout, showToast } = useShop();
  const [showAddresses, setShowAddresses] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [loadingAddr, setLoadingAddr] = useState(false);

  const handleDemoInfo = (feature) => {
    showToast(`${feature} is simulated for this demo store.`);
  };

  const handleToggleAddresses = async () => {
    const nextState = !showAddresses;
    setShowAddresses(nextState);
    if (nextState) {
      setLoadingAddr(true);
      try {
        const res = await api.get('/user/addresses');
        if (res.data) setAddresses(res.data);
      } catch (err) {
        showToast('Could not load saved addresses');
      } finally {
        setLoadingAddr(false);
      }
    }
  };

  const initial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'S';

  return (
    <div className="account-page container">
      <div className="account-heading">
        <p className="eyebrow"><span />YOUR SHOPKART</p>
        <h1>{user?.fullName || 'Shopper'}</h1>
        <p className="muted">
          Your saved finds, orders, and details — all in one calm place.
        </p>
      </div>

      <div className="account-grid">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="avatar">{initial}</div>
          <h2>{user?.fullName || 'Demo Shopper'}</h2>
          <p>{user?.email || 'demo@shopkart.test'}</p>

          <button
            type="button"
            className="button button-dark full"
            onClick={logout}
          >
            <LogOut size={14} />
            <span>Sign out</span>
          </button>
        </div>

        {/* Dashboard Quick Links */}
        <div>
          <div className="dashboard-links">
            <Link to="/orders" className="dashboard-link">
              <div className="dashboard-icon">
                <Package size={18} />
              </div>
              <span>
                <strong>Your orders</strong>
                <small>Track, review, or buy again</small>
              </span>
              <ChevronRight size={16} />
            </Link>

            <Link to="/wishlist" className="dashboard-link">
              <div className="dashboard-icon">
                <Heart size={18} />
              </div>
              <span>
                <strong>Your wishlist</strong>
                <small>The things you’re not ready to forget</small>
              </span>
              <ChevronRight size={16} />
            </Link>

            <button
              type="button"
              className="dashboard-link"
              onClick={handleToggleAddresses}
            >
              <div className="dashboard-icon">
                <MapPin size={18} />
              </div>
              <span>
                <strong>Saved addresses</strong>
                <small>{showAddresses ? 'Hide saved addresses' : 'View delivery details'}</small>
              </span>
              <ChevronRight size={16} />
            </button>

          <button
            type="button"
            className="dashboard-link"
            onClick={() => handleDemoInfo('Payment methods')}
          >
            <div className="dashboard-icon">
              <CreditCard size={18} />
            </div>
            <span>
              <strong>Payment methods</strong>
              <small>Fictional options only</small>
            </span>
            <ChevronRight size={16} />
          </button>

          <button
            type="button"
            className="dashboard-link"
            onClick={() => handleDemoInfo('Account settings')}
          >
            <div className="dashboard-icon">
              <Settings size={18} />
            </div>
            <span>
              <strong>Account settings</strong>
              <small>Preferences and notifications</small>
            </span>
            <ChevronRight size={16} />
          </button>

          <button
            type="button"
            className="dashboard-link"
            onClick={() => handleDemoInfo('Help & support')}
          >
            <div className="dashboard-icon">
              <HelpCircle size={18} />
            </div>
            <span>
              <strong>Help & support</strong>
              <small>Answers from the ShopKart team</small>
            </span>
            <ChevronRight size={16} />
          </button>
        </div>

        {showAddresses && (
            <div style={{ marginTop: '24px', background: 'var(--paper)', padding: '24px', borderRadius: '7px', border: '1px solid var(--line)' }}>
              <h3 style={{ margin: '0 0 16px', fontSize: '18px', fontFamily: 'Fraunces, serif' }}>Saved delivery addresses</h3>
              {loadingAddr ? (
                <p className="muted">Loading addresses...</p>
              ) : addresses.length === 0 ? (
                <p className="muted">No saved addresses yet. Addresses are automatically saved when you place demo orders.</p>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {addresses.map((addr) => (
                    <div key={addr.id} style={{ padding: '14px', background: 'var(--oat)', borderRadius: '6px', fontSize: '12px', lineHeight: '1.5' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '13px' }}>{addr.fullName}</strong>
                        {addr.isDefault && <span style={{ color: 'var(--green)', fontSize: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}><Check size={12} /> Default</span>}
                      </div>
                      <p style={{ margin: '2px 0', color: 'var(--muted)' }}>{addr.phone}</p>
                      <p style={{ margin: '2px 0' }}>{addr.street}, {addr.city}, {addr.state} {addr.zip}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
