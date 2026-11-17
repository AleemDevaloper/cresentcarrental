import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole, Mail, ArrowRight, Shield } from 'lucide-react';
import api, { STATIC_MODE } from '../services/api';
import brand from '../config/brandConfig';
import SeoHead from '../components/SeoHead';
import Button from '../components/Button';

export default function AdminLoginPage() {
  const nav = useNavigate();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const [error, setError] = useState('');

  const submit = async (d) => {
    setError('');
    try {
      const r = await api.post('/admin/login', d);
      const token = r.data.token || r.data.data?.token;
      (d.remember ? localStorage : sessionStorage).setItem('crescent_admin_token', token);
      nav('/admin');
    } catch (e) {
      if (!e.response) {
        setError('Cannot reach the server. Please make sure the backend is running on port 8000.');
      } else if (e.response.status === 422) {
        setError(e.response.data?.message || e.userMessage || 'Invalid email or password.');
      } else if (e.response.status === 429) {
        setError('Too many login attempts. Please wait a minute and try again.');
      } else if (e.response.status >= 500) {
        setError('Server error. Please check the backend configuration and try again.');
      } else {
        setError(e.userMessage || 'Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="admin-login">
      <SeoHead title="Admin Login | Crescent Car Rental" noindex />
      <div className="admin-login-panel">
        <div className="admin-login-inner">
          <img src={brand.logoDark} alt="Crescent Car Rental" className="admin-login-logo" width="666" height="375" decoding="async" fetchPriority="high" />
          <div className="admin-login-badge"><Shield size={14}/> Secure administration</div>
          <h1>Welcome back.</h1>
          <p>Sign in to manage bookings, fleet, content and operations.</p>
          <form onSubmit={handleSubmit(submit)} className="admin-login-form">
            <label>
              <span>Email address</span>
              <div className="input-icon">
                <Mail />
                <input type="email" placeholder="admin@crescentrentacar.com" {...register('email', { required: true })} />
              </div>
            </label>
            <label>
              <span>Password</span>
              <div className="input-icon">
                <LockKeyhole />
                <input type="password" placeholder="Enter your password" {...register('password', { required: true })} />
              </div>
            </label>
            <div className="admin-login-options">
              <label className="remember">
                <input type="checkbox" {...register('remember')} /> <span>Remember me</span>
              </label>
            </div>
            {STATIC_MODE && (
              <div className="admin-demo-hint">
                Demo mode: sign in with <strong>admin@crescentrentacar.com</strong> / <strong>ChangeMe123!</strong>
              </div>
            )}
            {error && <div className="form-error" role="alert">{error}</div>}
            <Button
              type="submit"
              variant="red"
              size="lg"
              fullWidth
              className="admin-login-btn"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Sign In <ArrowRight size={16} />
            </Button>
          </form>
          <p className="admin-login-footer">Contact your system administrator for password assistance.</p>
        </div>
      </div>
      <div className="admin-login-art">
        <div className="admin-login-art-inner">
          <div className="admin-login-art-grid">
            <div className="art-float-card art-float-1"><span>01</span><strong>Fleet</strong><small>Manage vehicles</small></div>
            <div className="art-float-card art-float-2"><span>02</span><strong>Bookings</strong><small>Track reservations</small></div>
            <div className="art-float-card art-float-3"><span>03</span><strong>Content</strong><small>Update pages</small></div>
          </div>
          <span>OPERATIONS</span>
          <strong>One dashboard.<br />Every journey.</strong>
          <p>Premium rental management for Lahore, Islamabad and beyond.</p>
        </div>
      </div>
    </div>
  );
}
