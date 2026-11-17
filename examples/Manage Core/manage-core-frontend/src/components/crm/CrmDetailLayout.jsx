import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark, faCircleInfo } from '@fortawesome/free-solid-svg-icons';

const SectionTitle = ({ title, count = null, color = '#6366f1', isDark }) => {
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  return (
    <div className="d-flex align-items-center gap-2 mb-2">
      <div style={{ width: 4, height: 18, background: color, borderRadius: 2 }} />
      <h6 style={{ color: textColor, margin: 0, fontSize: '0.85rem', fontWeight: 600 }}>
        {title}
        {count !== null && <span style={{ color: '#94a3b8', marginLeft: 6, fontWeight: 400 }}>({count})</span>}
      </h6>
    </div>
  );
};

const CrmDetailLayout = ({
  isDark = false,
  header,
  tabs = [],
  defaultTab = null,
  sidebar = null,
  footer = null,
}) => {
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#fff';

  const [activeTab, setActiveTab] = useState(defaultTab || (tabs[0]?.key ?? null));

  return (
    <div className="d-flex flex-column gap-3" style={{ fontFamily: "'Inter', sans-serif" }}>
      {header && (
        <div style={{
          background: cardBg,
          border: `1px solid ${borderColor}`,
          borderRadius: '14px',
          padding: '1.25rem',
        }}>
          {header}
        </div>
      )}

      {(tabs.length > 0 || sidebar) && (
        <div className="row g-3">
          <div className={sidebar ? 'col-lg-8' : 'col-12'}>
            {tabs.length > 0 && (
              <div style={{
                background: cardBg,
                border: `1px solid ${borderColor}`,
                borderRadius: '14px',
                overflow: 'hidden',
              }}>
                <div className="d-flex" style={{
                  borderBottom: `1px solid ${borderColor}`,
                  overflowX: 'auto',
                }}>
                  {tabs.map((t) => (
                    <button
                      key={t.key}
                      onClick={() => setActiveTab(t.key)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        borderBottom: activeTab === t.key
                          ? '2px solid #6366f1'
                          : '2px solid transparent',
                        color: activeTab === t.key
                          ? (isDark ? '#a5b4fc' : '#4f46e5')
                          : mutedColor,
                        padding: '0.85rem 1.25rem',
                        fontWeight: activeTab === t.key ? 600 : 500,
                        fontSize: '0.85rem',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                      }}
                    >
                      {t.icon && <FontAwesomeIcon icon={t.icon} className="me-2" />}
                      {t.label}
                      {typeof t.count === 'number' && (
                        <span style={{
                          marginLeft: 6,
                          background: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                          borderRadius: 10,
                          padding: '0 6px',
                          fontSize: '0.7rem',
                        }}>{t.count}</span>
                      )}
                    </button>
                  ))}
                </div>
                <div style={{ padding: '1rem 1.25rem' }}>
                  {tabs.find((t) => t.key === activeTab)?.content}
                </div>
              </div>
            )}
          </div>
          {sidebar && (
            <div className="col-lg-4">
              <div style={{
                background: cardBg,
                border: `1px solid ${borderColor}`,
                borderRadius: '14px',
                padding: '1.25rem',
              }}>
                {sidebar}
              </div>
            </div>
          )}
        </div>
      )}

      {footer}
    </div>
  );
};

export { SectionTitle };
export default CrmDetailLayout;