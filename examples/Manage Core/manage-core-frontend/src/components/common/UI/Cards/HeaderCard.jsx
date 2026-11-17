import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const HeaderCard = ({
  title,
  description,
  icon,
  gradient = 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
  isDark = false,
  className = '',
  children,
}) => {
  return (
    <div
      className={`card border-0 shadow-lg rounded-5 overflow-hidden mb-4 ${isDark ? 'bg-dark' : 'bg-white'} ${className}`}
    >
      <div className="p-4 p-lg-5 text-white" style={{ background: gradient }}>
        <div className="d-flex align-items-center gap-4">
          {icon && (
            <div className="bg-white bg-opacity-10 p-3 rounded-4 shadow-sm">
              <FontAwesomeIcon icon={icon} className="fs-3" />
            </div>
          )}
          <div>
            <h3 className="fw-bold mb-1">{title}</h3>
            {description && <p className="mb-0 opacity-75">{description}</p>}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default HeaderCard;
