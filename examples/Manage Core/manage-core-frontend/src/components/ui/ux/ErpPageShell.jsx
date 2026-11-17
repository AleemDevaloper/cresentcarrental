import React from 'react';
import { useApp } from '../../../context/AppContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { erpCss, accentGradient, erpTheme } from './ErpTheme';
import Header from './Header';

const ErpPageShell = ({
  icon = null,
  title = '',
  description = '',
  badge = null,
  action = null,
  headerContent = null,
  children,
  maxWidth = 1600,
}) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';
  const themeVars = erpTheme(isDark);
  const containerBg = themeVars.containerBg;
  const textColor = themeVars.textColor;
  const mutedColor = themeVars.mutedColor;

  return (
    <div style={{ background: containerBg, minHeight: '100vh', padding: '1.5rem', fontFamily: "'Inter', sans-serif" }}>
      <style>{erpCss(isDark)}</style>
      <div style={{ maxWidth, margin: '0 auto' }}>
        {headerContent || (
          <div className="d-flex flex-wrap justify-content-between align-items-start mb-4">
            <Header
              icon={icon}
              title={title}
              description={description ? (
                <span>
                  <FontAwesomeIcon icon={faInfoCircle} className="me-1" style={{ color: '#6366f1', opacity: 0.7, fontSize: '0.75rem' }} />
                  {description}
                </span>
              ) : null}
              badge={badge}
              isDark={isDark}
              gradient={accentGradient}
              radius={10}
              action={action}
            />
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default ErpPageShell;
