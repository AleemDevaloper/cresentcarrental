import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from '../../hooks/useTranslation';

// Revamped Premium Dash Main Heading
// - Cleaner, compact, and premium visual hierarchy
// - Accessible heading semantics and responsive layout
// Props: main, children (title), icon, description, badge, actions, stats

function Dashmainheading({ children, main, icon, description, badge, actions = null, stats = [] }) {
  const { t } = useTranslation();

  return (
    <section className="page-heading my-2 pt-5 px-2" aria-label={t(main) || 'Section heading'}>
      <div className="page-heading__inner" style={{ animation: 'fadeInUp 240ms ease both' }}>
        <div className="page-heading__glow" aria-hidden="true" />

        <div className="page-heading__content">
          <div className="page-heading__icon-wrapper">
            {icon ? (
              <div className="page-heading__icon--badge" aria-hidden="true">
                <FontAwesomeIcon icon={icon} className="icon-inner" />
              </div>
            ) : (
              <div className="page-heading__icon--placeholder" aria-hidden="true" />
            )}
          </div>

          <div className="page-heading__text">
            <div className="page-heading__meta">
              <div className="page-heading__eyebrow" aria-hidden="true">{t(main)}</div>
              {badge && (
                <span className="page-heading__badge" aria-hidden="true">{t(badge)}</span>
              )}
            </div>

            <h1 className="page-heading__title" role="heading" aria-level={1} title={t(children)}>{t(children)}</h1>

            {description && (
              <p className="page-heading__description d-none d-md-block">{t(description)}</p>
            )}

            {stats && stats.length > 0 && (
              <div className="stats-row">
                {stats.map(s => (
                  <div key={s.id} className="stat-chip">
                    {s.icon && <FontAwesomeIcon icon={s.icon} className="stat-icon" />}
                    <div className="stat-text">
                      <div className="stat-label">{t(s.label)}</div>
                      <div className="stat-value">{s.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {actions && (
          <div className="page-heading__actions">
            {actions}
          </div>
        )}
      </div>

      <style>{`\n        .page-heading__inner {\n          position: relative;\n          overflow: hidden;\n          display: flex;\n          align-items: center;\n          justify-content: space-between;\n          gap: 16px;\n          flex-wrap: wrap;\n          padding: 16px 18px;\n          border-radius: 20px;\n          border: 1px solid var(--page-heading-border, rgba(99, 102, 241, 0.12));\n          background: var(--page-heading-bg, linear-gradient(135deg, rgba(255,255,255,0.94), rgba(248,250,252,0.92)));\n          box-shadow: var(--page-heading-shadow, 0 18px 42px rgba(15, 23, 42, 0.06));\n          backdrop-filter: blur(14px);\n          -webkit-backdrop-filter: blur(14px);\n        }\n\n        .page-heading__glow {\n          position: absolute;\n          inset: 0;\n          background: radial-gradient(circle at top left, rgba(99,102,241,0.12), transparent 42%);\n          pointer-events: none;\n        }\n\n        .page-heading__content {\n          position: relative;\n          z-index: 1;\n          display: flex;\n          align-items: center;\n          gap: 14px;\n          min-width: 0;\n          flex: 1 1 0;\n        }\n\n        .page-heading__icon-wrapper {\n          flex: 0 0 auto;\n        }\n\n        .page-heading__icon--badge {\n          width: 58px;\n          height: 58px;\n          display: inline-flex;\n          align-items: center;\n          justify-content: center;\n          border-radius: 16px;\n          background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(14,165,233,0.12));\n          border: 1px solid rgba(99,102,241,0.18);\n          box-shadow: inset 0 1px 0 rgba(255,255,255,0.65), 0 12px 24px rgba(99,102,241,0.12);\n          transition: transform 180ms ease, box-shadow 180ms ease;\n        }\n\n        .page-heading__icon--badge .icon-inner {\n          color: var(--primary, #4f46e5);\n          font-size: 1.12rem;\n        }\n\n        .page-heading__icon--placeholder {\n          width: 58px;\n          height: 58px;\n          border-radius: 16px;\n          border: 1px dashed rgba(15,23,42,0.12);\n          background: linear-gradient(135deg, rgba(255,255,255,0.7), rgba(241,245,249,0.8));\n        }\n\n        .page-heading__text {\n          min-width: 0;\n          flex: 1 1 auto;\n        }\n\n        .page-heading__meta {\n          display: flex;\n          align-items: center;\n          flex-wrap: wrap;\n          gap: 8px;\n          margin-bottom: 4px;\n        }\n\n        .page-heading__eyebrow {\n          text-transform: uppercase;\n          font-weight: 800;\n          font-size: 0.68rem;\n          letter-spacing: 0.12em;\n          color: var(--text-secondary, #64748b);\n        }\n\n        .page-heading__badge {\n          display: inline-flex;\n          align-items: center;\n          justify-content: center;\n          padding: 4px 8px;\n          font-size: 11px;\n          font-weight: 800;\n          border-radius: 999px;\n          background: rgba(99,102,241,0.1);\n          color: var(--primary, #4f46e5);\n          border: 1px solid rgba(99,102,241,0.14);\n        }\n\n        .page-heading__title {\n          margin: 2px 0 0;\n          font-size: 1.16rem;\n          line-height: 1.16;\n          font-weight: 800;\n          color: var(--text-primary, #0f172a);\n          max-width: 70ch;\n          white-space: nowrap;\n          overflow: hidden;\n          text-overflow: ellipsis;\n        }\n\n        .page-heading__description {\n          margin: 6px 0 0;\n          font-size: 0.9rem;\n          color: var(--text-secondary, #64748b);\n          max-width: 66ch;\n        }\n\n        .stats-row {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          flex-wrap: wrap;\n          margin-top: 10px;\n        }\n\n        .stat-chip {\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          padding: 7px 9px;\n          border-radius: 12px;\n          border: 1px solid rgba(15, 23, 42, 0.06);\n          background: rgba(255,255,255,0.72);\n          box-shadow: 0 8px 18px rgba(15,23,42,0.04);\n        }\n\n        .stat-icon {\n          color: var(--primary, #4f46e5);\n          font-size: 0.85rem;\n        }\n\n        .stat-label {\n          font-size: 11px;\n          color: var(--text-secondary, #64748b);\n          line-height: 1.1;\n        }\n\n        .stat-value {\n          font-size: 13px;\n          font-weight: 700;\n          color: var(--text-primary, #0f172a);\n          line-height: 1.2;\n        }\n\n        .page-heading__actions {\n          position: relative;\n          z-index: 1;\n          display: flex;\n          align-items: center;\n          gap: 8px;\n          flex-wrap: wrap;\n          margin-left: auto;\n        }\n\n        .page-heading__actions > * {\n          min-height: 38px;\n        }\n\n        .page-heading__inner:hover .page-heading__icon--badge {\n          transform: translateY(-2px) scale(1.03);\n          box-shadow: inset 0 1px 0 rgba(255,255,255,0.7), 0 14px 28px rgba(99,102,241,0.16);\n        }\n\n        .page-heading::after {\n          content: '';\n          display: block;\n          height: 1px;\n          margin-top: 12px;\n          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.12), transparent);\n        }\n\n        @media (max-width: 767.98px) {\n          .page-heading__inner {\n            padding: 14px;\n            align-items: flex-start;\n          }\n          .page-heading__content {\n            flex-direction: column;\n            align-items: flex-start;\n          }\n          .page-heading__title {\n            max-width: 100%;\n            white-space: normal;\n            display: -webkit-box;\n            -webkit-line-clamp: 2;\n            -webkit-box-orient: vertical;\n            overflow: hidden;\n          }\n          .page-heading__description {\n            display: block !important;\n            max-width: 100%;\n          }\n          .stats-row {\n            display: none;\n          }\n          .page-heading__actions {\n            width: 100%;\n            margin-left: 0;\n            justify-content: flex-start;\n          }\n        }\n\n        @keyframes fadeInUp {\n          from { opacity: 0; transform: translateY(6px); }\n          to { opacity: 1; transform: translateY(0); }\n        }\n      `}</style>
    </section>
  )
}

export default Dashmainheading;
