import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faExpand, faLayerGroup, faXmark } from '@fortawesome/free-solid-svg-icons';
import ErrorScreen, { ERROR_VARIANTS } from '../error/ErrorScreen';

const DESCRIPTIONS = {
  '404': 'Shown when a route/resource cannot be found.',
  '403': 'Shown when the user lacks permission for a resource.',
  '500': 'Shown on unhandled server errors.',
  '503': 'Shown during scheduled maintenance windows.',
  'offline': 'Shown when the browser loses connectivity.',
  'timeout': 'Shown when a request exceeds the timeout.',
};

export default function ErrorPagesGallery({ isDark }) {
  const [preview, setPreview] = useState(null);
  const variants = Object.keys(ERROR_VARIANTS);

  useEffect(() => {
    if (preview) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [preview]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && preview) setPreview(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [preview]);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
        <div>
          <h4 className="fw-bold mb-1" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
            <FontAwesomeIcon icon={faLayerGroup} className="me-2" style={{ color: '#6366f1' }} />
            System Error Pages
          </h4>
          <div className="text-muted" style={{ fontSize: 13 }}>
            Preview every error screen served across the platform. Click a card to view it full size.
          </div>
        </div>
      </div>

      <div className="row g-4">
        {variants.map((key) => {
          const cfg = ERROR_VARIANTS[key];
          return (
            <div className="col-md-6 col-xl-4" key={key}>
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100" style={{ background: isDark ? 'rgba(30,41,59,0.7)' : '#fff' }}>
                <div className="position-relative" style={{ height: 220, overflow: 'hidden', transform: 'scale(0.85)', transformOrigin: 'top center' }}>
                  <div style={{ height: '100%', pointerEvents: 'none' }}>
                    <ErrorScreen variant={key} compact />
                  </div>
                  <div className="position-absolute top-0 end-0 m-2">
                    <span className="badge rounded-pill px-2 py-1 fw-bold" style={{ background: cfg.color, color: '#fff', fontSize: 10 }}>{cfg.code}</span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <h6 className="fw-bold mb-0" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{cfg.title}</h6>
                    <FontAwesomeIcon icon={faTriangleExclamation} style={{ color: cfg.color }} />
                  </div>
                  <p className="x-small text-muted mb-3">{DESCRIPTIONS[key] || cfg.message}</p>
                  <button className="btn btn-sm rounded-pill w-100 fw-bold border-0"
                    style={{ background: cfg.color, color: '#fff' }}
                    onClick={() => setPreview(key)}>
                    <FontAwesomeIcon icon={faExpand} className="me-1" />View Full Screen
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full-Screen Error Preview Overlay */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <ErrorScreen variant={preview} />
            <button
              onClick={() => setPreview(null)}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 10000,
                width: 44,
                height: 44,
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(8px)',
                color: '#fff',
                fontSize: 18,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                transition: 'transform 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
              title="Close preview (Esc)"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
