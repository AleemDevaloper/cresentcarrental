import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SectionHero = ({
  title = '',
  subtitle = '',
  badge = '',
  actions = null,
  accentGradient = 'linear-gradient(135deg, #1E293B 0%, #0F172A 50%, #2563EB 100%)',
  icon = null,
  isDark = false,
}) => {
  return (
    <>
      <style>{`
        .section-hero {
          background: ${accentGradient};
          color: #ffffff;
          border-radius: 18px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(30, 41, 59, 0.12);
        }
        .section-hero::before {
          content: '';
          position: absolute;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%);
          top: -40px;
          right: -40px;
          pointer-events: none;
        }
        .section-hero .hero-badge { border: 1px solid rgba(255,255,255,0.28); }
      `}</style>

      <div className="section-hero p-4 p-lg-5 shadow text-start">
        <div className="row align-items-center">
          <div className="col-lg-8">
            {badge && (
              <span className="badge bg-white bg-opacity-25 text-light px-3 py-2 mb-3 fw-bold tracking-wider rounded-pill hero-badge">
                {badge}
              </span>
            )}
            <h1 className="fw-extrabold tracking-tight mb-2 display-6">{title}</h1>
            {subtitle && (
              <p className="text-light text-opacity-80 fs-6 mb-4" style={{ maxWidth: '680px' }}>{subtitle}</p>
            )}
            <div className="d-flex flex-wrap gap-2">
              {actions}
            </div>
          </div>
          <div className="col-lg-4 text-lg-end d-none d-lg-block">
            {icon && <div style={{ fontSize: 72, opacity: 0.13 }}><FontAwesomeIcon icon={icon} /></div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionHero;
