import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ArrowRight, Truck } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function OrdersPage() {
  const { orders, loadOrders, cancelOrder, buyAgain, showToast } = useShop();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders().finally(() => setLoading(false));
  }, [loadOrders]);

  const handleTrackOrder = (orderNumber) => {
    showToast(`Order ${orderNumber} is on schedule · Tracking simulated`);
  };

  const handleBuyAgain = async (orderId) => {
    await buyAgain(orderId);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="account-page container" style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
        Loading your orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="account-page container">
        <div className="empty-state page-empty">
          <div className="empty-icon">
            <Package size={28} />
          </div>
          <h2>Your orders will live here</h2>
          <p>Place a demo order and it will show up in this little archive.</p>
          <Link to="/products" className="button button-saffron">
            <span>Explore the shop</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page container">
      <div className="account-heading">
        <p className="eyebrow"><span />YOUR HISTORY</p>
        <h1>Your orders</h1>
        <p className="muted">
          A neat little archive of everything you’ve chosen.
        </p>
      </div>

      <div className="orders-list">
        {orders.map((order) => {
          const dateStr = order.createdAt
            ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'Today';

          const isCancelled = order.status === 'Cancelled';

          return (
            <div key={order.id} className="order-card">
              <div className="order-card-head">
                <div>
                  <span>Order placed</span>
                  <b>{dateStr}</b>
                </div>
                <div>
                  <span>Total</span>
                  <b>${(order.total || 0).toFixed(0)}</b>
                </div>
                <div>
                  <span>Ship to</span>
                  <b>{order.fullName}</b>
                </div>
                <div>
                  <span>Order ID</span>
                  <b>{order.orderNumber}</b>
                </div>
                <div className="order-status">
                  <span className={`status-dot ${isCancelled ? 'cancelled' : ''}`} />
                  <span>{order.status}</span>
                </div>
              </div>

              <div className="order-card-body">
                <div className="order-product-stack">
                  {order.items && order.items.map((item) => (
                    <div key={item.id} className="order-product">
                      <img src={item.productImage} alt={item.productTitle} />
                      <span>
                        <b>{item.productTitle}</b>
                        <small>Qty {item.quantity} · ${(item.price || 0).toFixed(0)} each</small>
                      </span>
                    </div>
                  ))}
                </div>

                <div className="order-actions">
                  <button
                    type="button"
                    className="button button-outline"
                    onClick={() => handleTrackOrder(order.orderNumber)}
                  >
                    <Truck size={13} />
                    <span>Track order</span>
                  </button>

                  <button
                    type="button"
                    className="button button-saffron"
                    onClick={() => handleBuyAgain(order.id)}
                  >
                    <span>Buy again</span>
                  </button>

                  {!isCancelled && (
                    <button
                      type="button"
                      className="text-link danger-link"
                      onClick={() => cancelOrder(order.id)}
                    >
                      Cancel order
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
