import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useShop();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setError('');
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/account');
    } catch (err) {
      setError(err.message || 'Registration failed');
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
        <h1>Join the good stuff</h1>
        <p className="auth-lede">
          Create an account to save finds, track packages, and keep everything in one calm place.
        </p>

        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="field">
            <span>Full name</span>
            <input
              type="text"
              placeholder="e.g. Jordan Miller"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="field" style={{ marginTop: '14px' }}>
            <span>Email address</span>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field" style={{ marginTop: '14px' }}>
            <span>Password</span>
            <input
              type="password"
              placeholder="At least 4 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="field" style={{ marginTop: '14px' }}>
            <span>Confirm password</span>
            <input
              type="password"
              placeholder="Re-type password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="button button-saffron full"
            style={{ marginTop: '22px' }}
            disabled={submitting}
          >
            <span>{submitting ? "Creating account..." : "Create demo account"}</span>
            <ArrowRight size={14} />
          </button>

          <p className="auth-switch" style={{ marginTop: '20px' }}>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
