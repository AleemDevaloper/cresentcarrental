import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBan, faServer, faWrench, faWifi,
  faClock, faHouse, faArrowRotateLeft, faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';

export const ERROR_VARIANTS = {
  '404': {
    code: '404',
    title: 'Page Not Found',
    message: "The page you're looking for doesn't exist or has been moved.",
    icon: faMagnifyingGlass,
    color: '#6366f1',
  },
  '403': {
    code: '403',
    title: 'Access Denied',
    message: "You don't have permission to view this resource.",
    icon: faBan,
    color: '#ef4444',
  },
  '500': {
    code: '500',
    title: 'Server Error',
    message: 'Something went wrong on our end. Please try again shortly.',
    icon: faServer,
    color: '#f59e0b',
  },
  '503': {
    code: '503',
    title: 'Maintenance Mode',
    message: 'The system is temporarily down for scheduled maintenance.',
    icon: faWrench,
    color: '#0ea5e9',
  },
  'offline': {
    code: 'OFFLINE',
    title: 'No Connection',
    message: "We can't reach the server. Check your internet connection.",
    icon: faWifi,
    color: '#8b5cf6',
  },
  'timeout': {
    code: 'TIMEOUT',
    title: 'Request Timed Out',
    message: 'The server took too long to respond. Please retry.',
    icon: faClock,
    color: '#ec4899',
  },
};

const ErrorScreen = ({ variant = '404', compact = false, onRetry, homePath = '/login' }) => {
  const cfg = ERROR_VARIANTS[variant] || ERROR_VARIANTS['404'];
  const Icon = cfg.icon;
  const navigate = useNavigate();

  const handleGoHome = (e) => {
    e.preventDefault();
    navigate(homePath);
  };

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center text-center"
      style={{
        minHeight: compact ? 260 : '100vh',
        background: `linear-gradient(135deg, ${cfg.color}, #6366f1)`,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        padding: compact ? 16 : 24,
      }}
    >
      <div className="position-absolute rounded-circle" style={{ width: 300, height: 300, background: 'rgba(255,255,255,0.1)', top: -50, left: -50, animation: 'errFloat 6s ease-in-out infinite' }} />
      <div className="position-absolute rounded-circle" style={{ width: 200, height: 200, background: 'rgba(255,255,255,0.1)', bottom: -50, right: -50, animation: 'errFloatReverse 8s ease-in-out infinite' }} />

      <FontAwesomeIcon icon={Icon} size={compact ? '2x' : '3x'} className="mb-3" />
      <h1 style={{ fontSize: compact ? 56 : 120, fontWeight: 800, letterSpacing: 5, animation: 'errFloatText 3s ease-in-out infinite', margin: 0 }}>{cfg.code}</h1>
      <h3 className="mb-2" style={{ fontWeight: 600 }}>{cfg.title}</h3>
      <p className="mb-4" style={{ maxWidth: 400, opacity: 0.9 }}>{cfg.message}</p>

      {!compact && (
        <div className="d-flex gap-2 flex-wrap justify-content-center">
          <a href={homePath} onClick={handleGoHome} className="btn btn-light rounded-pill px-4 fw-bold" style={{ color: '#111', textDecoration: 'none' }}>
            <FontAwesomeIcon icon={faHouse} className="me-2" />Go Home
          </a>
          {onRetry && (
            <button className="btn btn-outline-light rounded-pill px-4 fw-bold" onClick={onRetry}>
              <FontAwesomeIcon icon={faArrowRotateLeft} className="me-2" />Retry
            </button>
          )}
        </div>
      )}

      <style>{`
        @keyframes errFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(30px); } }
        @keyframes errFloatReverse { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
        @keyframes errFloatText { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      `}</style>
    </div>
  );
};

export default ErrorScreen;
