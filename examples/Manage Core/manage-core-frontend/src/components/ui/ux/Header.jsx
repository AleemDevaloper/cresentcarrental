import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Header = ({
  icon = null,
  title = '',
  description = '',
  action = null,
  badge = null,
  isDark = false,
  gradient = 'linear-gradient(135deg, #4f46e5, #7c3aed)',
  radius = 14,
}) => {
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';

  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 18 } },
  };

  return (
    <motion.div variants={item} style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      marginBottom: 32, gap: 24, flexWrap: 'wrap', width:'100%',
    }}>
      <div style={{ flex: '1 1 55%', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          {icon && (
            <div style={{
              width: 52, height: 52, borderRadius: radius, background: gradient, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, color: '#fff',
            }}>
              <FontAwesomeIcon icon={icon} />
            </div>
          )}
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: textColor, letterSpacing: '-0.3px' }}>
                {title}
              </h1>
              {badge && (
                <span style={{
                  padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                  background: 'rgba(79,70,229,0.12)', color: '#4f46e5',
                  whiteSpace: 'nowrap',
                }}>
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p style={{ margin: '6px 0 0', fontSize: 14, color: mutedColor, lineHeight: 1.6, maxWidth: 600 }}>
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
      {action && <div style={{ flexShrink: 0, whiteSpace: 'nowrap', }}>{action}</div>}
    </motion.div>
  );
};

export default Header;
