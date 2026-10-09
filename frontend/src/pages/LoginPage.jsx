import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function LoginPage() {
  const [email, setEmail] = useState('demo@shopkart.test');
  const [password, setPassword] = useState('shopkart');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useShop();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/account');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page container">
      {/* Visual Column */}
      <div className="auth-visual">
        <div className="auth-visual-copy">
          <p className="eyebrow light"><span />SHOPKART, CONSIDERED</p>
          <h2>
            Small rituals.<br />
            <em>Good energy.</em>
          </h2>
          <p>
            Thoughtfully chosen goods for the life you are already living.
          </p>
        </div>
      </div>

      {/* Form Column */}
      <div className="auth-panel">
        <h1>Welcome back</h1>
        <p className="auth-lede">
          Sign in to keep your saved finds, orders, and little rituals together.
        </p>

        <div className="demo-callout">
          <Sparkles size={16} />
          <span>
            <b>Demo access prefilled</b>
            <small>demo@shopkart.test · shopkart</small>
          </span>
        </div>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <span>Email address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field" style={{ marginTop: '14px' }}>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-options">
            <label>
              <input type="checkbox" defaultChecked />
              <span>Remember me</span>
            </label>
            <span className="text-link" style={{ cursor: 'pointer' }}>
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            className="button button-saffron full"
            disabled={submitting}
          >
            <span>{submitting ? "Signing in..." : "Sign in"}</span>
            <ArrowRight size={14} />
          </button>

          <p className="auth-switch" style={{ marginTop: '20px' }}>
            New to ShopKart? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
