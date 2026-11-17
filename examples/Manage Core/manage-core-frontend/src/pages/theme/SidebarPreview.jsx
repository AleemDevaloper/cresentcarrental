import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome, faUsers, faCog, faChartBar, faSignOutAlt,
  faLayerGroup, faPalette, faChevronDown
} from '@fortawesome/free-solid-svg-icons';

const SidebarPreview = ({ 
  mode, 
  customColor, 
  gradientFrom, 
  gradientTo, 
  semiDark, 
  darkSidebarEnabled, 
  darkSidebarBg, 
  darkSidebarText,
  sidebarButtonBg,
  sidebarButtonText,
  sidebarButtonHover,
  sidebarButtonHoverText,
  sidebarIconColor,
  sidebarSemiDarkIconColor,
  sidebarDarkIconColor,
  sidebarHoverIconColor,
  sidebarLabelColor,
  sidebarFontSize,
  sidebarLabelFontSize,
  sidebarButtonBorderEnabled,
  sidebarButtonBorderWidth,
  sidebarButtonBorderColor,
  sidebarWidth,
  sidebarWidthEnabled,
  isDarkMode = false
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  
  const previewWidth = sidebarWidthEnabled ? `${sidebarWidth / 1.5}px` : '100%';
  
  const bg = isDarkMode 
    ? (darkSidebarEnabled ? darkSidebarBg : '#0F172A')
    : (semiDark ? (mode === 'simple' ? customColor : `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`) : '#ffffff');

  const textColor = isDarkMode
    ? (darkSidebarEnabled ? darkSidebarText : '#f8fafc')
    : (semiDark 
        ? (mode === 'simple' ? getContrastText(customColor) : getGradientContrastText(gradientFrom, gradientTo))
        : '#111827');

  const normalIconColor = isDarkMode
    ? (sidebarDarkIconColor || '#818cf8')
    : (semiDark ? (sidebarSemiDarkIconColor || '#ffffff') : (sidebarIconColor || '#4F46E5'));

  const currentIconColor = isHovered ? (sidebarHoverIconColor || sidebarButtonHoverText) : normalIconColor;

  const iconStyle = {
    color: currentIconColor,
    width: '18px',
    fontSize: `${sidebarFontSize}px` || '14px',
    transition: 'color 0.2s ease'
  };

  const borderWidth = sidebarButtonBorderEnabled ? sidebarButtonBorderWidth : 0;

  const buttonStyle = {
    background: isHovered ? sidebarButtonHover : sidebarButtonBg,
    color: isHovered ? sidebarButtonHoverText : sidebarButtonText,
    border: sidebarButtonBorderEnabled ? `${borderWidth}px solid ${sidebarButtonBorderColor}` : 'none',
    borderRadius: '8px',
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    textAlign: 'left',
    marginBottom: '8px',
    fontSize: `${sidebarFontSize}px` || '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  };

  const navItemStyle = {
    color: textColor,
    padding: '8px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    textAlign: 'left',
    marginBottom: '8px',
    fontSize: `${sidebarFontSize}px` || '14px',
    opacity: 0.8
  };

  const labelStyle = {
    color: sidebarLabelColor || textColor,
    fontSize: `${sidebarLabelFontSize || 11}px`,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    marginBottom: '8px',
    display: 'block',
    letterSpacing: '1px',
    opacity: sidebarLabelColor ? 1 : 0.5
  };

  function getBrightness(hex) {
    if (!hex || typeof hex !== 'string') return 255;
    const sanitized = hex.replace('#', '');
    const r = parseInt(sanitized.slice(0, 2), 16);
    const g = parseInt(sanitized.slice(2, 4), 16);
    const b = parseInt(sanitized.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000;
  }

  function getContrastText(hex) {
    return getBrightness(hex) < 150 ? '#ffffff' : '#111827';
  }

  function getGradientContrastText(from, to) {
    const brightness = (getBrightness(from) + getBrightness(to)) / 2;
    return brightness < 150 ? '#ffffff' : '#111827';
  }

  return (
    <div className="sidebar-preview-container rounded-4 shadow-sm overflow-hidden" style={{ border: '1px solid #e5e7eb', height: '100%', width: previewWidth, transition: 'width 0.3s ease' }}>
      <div className="p-2 border-bottom bg-white d-flex align-items-center gap-2">
        <div className="d-flex gap-1">
          <div className="rounded-circle" style={{ width: 8, height: 8, background: '#ff5f56' }}></div>
          <div className="rounded-circle" style={{ width: 8, height: 8, background: '#ffbd2e' }}></div>
          <div className="rounded-circle" style={{ width: 8, height: 8, background: '#27c93f' }}></div>
        </div>
        <small className="text-muted fw-medium">{isDarkMode ? 'Dark' : 'Light'}</small>
      </div>
      
      <div 
        className="p-3 d-flex flex-column" 
        style={{ 
          background: bg, 
          color: textColor, 
          height: '400px',
          transition: 'all 0.3s ease'
        }}
      >
        <div className="d-flex align-items-center gap-2 mb-4">
          <div className="rounded bg-primary d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
            <FontAwesomeIcon icon={faLayerGroup} className="text-white small" />
          </div>
          {(!sidebarWidthEnabled || sidebarWidth > 150) && <span className="fw-bold fs-5 text-truncate">ManageCore</span>}
        </div>

        <div className="mb-4">
          <small style={labelStyle}>Core</small>
          <div style={navItemStyle}>
            <FontAwesomeIcon icon={faHome} style={iconStyle} />
            {(!sidebarWidthEnabled || sidebarWidth > 150) && <span className="text-truncate">Dashboard</span>}
          </div>
          <div 
            style={buttonStyle}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <FontAwesomeIcon icon={faUsers} style={{ ...iconStyle, fontSize: iconStyle.fontSize }} />
            {(!sidebarWidthEnabled || sidebarWidth > 150) && <span className="text-truncate">Team</span>}
          </div>
        </div>

        <div className="mb-4">
          <small style={labelStyle}>Settings</small>
          <div style={navItemStyle}>
            <FontAwesomeIcon icon={faPalette} style={iconStyle} />
            {(!sidebarWidthEnabled || sidebarWidth > 150) && <span className="text-truncate">Theme</span>}
          </div>
        </div>

        <div className="mt-auto">
          <div style={{ ...navItemStyle, color: '#ef4444' }}>
            <FontAwesomeIcon icon={faSignOutAlt} style={{ fontSize: iconStyle.fontSize }} />
            {(!sidebarWidthEnabled || sidebarWidth > 150) && <span className="text-truncate">Logout</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarPreview;
