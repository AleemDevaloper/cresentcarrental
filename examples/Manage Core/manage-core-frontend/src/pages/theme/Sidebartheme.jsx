import React, { useEffect, useMemo, useState } from 'react';
import SidebarPreview from './SidebarPreview';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPalette, faMousePointer, faSync, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../context/AppContext';
import { EnableDisableButton } from '../../components/common';

const SIMPLE_COLORS = [
  { name: 'Blue', color: '#2563eb' },
  { name: 'Red', color: '#ef4444' },
  { name: 'Yellow', color: '#f59e0b' },
  { name: 'Light Blue', color: '#38bdf8' },
  { name: 'Indigo', color: '#5F60EF' },
];

const GRADIENT_PRESETS = [
  { name: 'Blue Purple', from: '#4f46e5', to: '#818cf8' },
  { name: 'Pink Orange', from: '#ec4899', to: '#fb7185' },
  { name: 'Cyan Mint', from: '#22d3ee', to: '#7dd3fc' },
  { name: 'Sunset', from: '#f97316', to: '#facc15' },
  { name: 'Emerald', from: '#10b981', to: '#34d399' },
];

const DEFAULT_SIDEBAR_THEME = {
  mode: 'simple',
  customColor: '#01001f',
  gradientFrom: '#4e46e500',
  gradientTo: '#818df800',
  semiDark: false,
  darkSidebarEnabled: false,
  darkSidebarBg: '#0F172A',
  darkSidebarText: '#f8fafc',
  sidebarIconColor: '#4F46E5',
  sidebarSemiDarkIconColor: '#ffffff',
  sidebarDarkIconColor: '#818cf8',
  sidebarHoverIconColor: '#ffffff',
  sidebarLabelColor: '#6c757d',
  sidebarFontSize: '14',
  sidebarLabelFontSize: '11',
  sidebarButtonMode: 'simple',
  sidebarButtonBg: '#ffffff',
  sidebarButtonAlpha: 0,
  sidebarButtonText: '#000000',
  sidebarButtonGradientFrom: '#38bdf8',
  sidebarButtonGradientTo: '#60a5fa',
  sidebarSelectedGradient: GRADIENT_PRESETS[0],
  sidebarButtonHoverMode: 'gradient',
  sidebarButtonHoverColor: '#0044ff',
  sidebarButtonHoverAlpha: 0.4,
  sidebarButtonHoverText: '#ffffff',
  sidebarButtonHoverGradientFrom: '#38bdf8',
  sidebarButtonHoverGradientTo: '#60a5fa',
  sidebarSelectedHoverGradient: GRADIENT_PRESETS[0],
  sidebarButtonBorderEnabled: true,
  sidebarButtonBorderWidth: '0.5',
  sidebarButtonBorderColor: '#e5e7eb',
  sidebarWidth: '260',
  sidebarWidthEnabled: false,
};

function hexToRgb(hex) {
  const sanitized = hex.replace('#', '');
  const normalized = sanitized.length === 3
    ? sanitized.split('').map((char) => char + char).join('')
    : sanitized;
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }) {
  const toHex = (value) => value.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function lightenHex(hex, amount = 0.2) {
  const rgb = hexToRgb(hex);
  const lighten = (value) => Math.min(255, Math.round(value + (255 - value) * amount));
  return rgbToHex({ r: lighten(rgb.r), g: lighten(rgb.g), b: lighten(rgb.b) });
}

function getBrightness(hex) {
  const { r, g, b } = hexToRgb(hex);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

function getContrastText(hex) {
  return getBrightness(hex) < 150 ? '#ffffff' : '#111827';
}

function getGradientContrastText(from, to) {
  const brightness = (getBrightness(from) + getBrightness(to)) / 2;
  return brightness < 150 ? '#ffffff' : '#111827';
}

function applySidebarTheme(lightBg, lightText, lightBorder, darkBg, darkText, darkBorder, buttonBg, buttonText, buttonHover, buttonHoverText, iconColor, semiDarkIconColor, darkIconColor, hoverIconColor, labelColor, fontSize, labelFontSize, semiDark, sidebarWidth, sidebarWidthEnabled) {
  const root = document.documentElement;
  root.style.setProperty('--sidebar-bg', lightBg);
  root.style.setProperty('--sidebar-text', lightText);
  root.style.setProperty('--sidebar-border', lightBorder);
  root.style.setProperty('--sidebar-dark-bg', darkBg);
  root.style.setProperty('--sidebar-dark-text', darkText);
  root.style.setProperty('--sidebar-dark-border', darkBorder);
  root.style.setProperty('--sidebar-button-bg', buttonBg);
  root.style.setProperty('--sidebar-button-text', buttonText);
  root.style.setProperty('--sidebar-button-hover', buttonHover);
  root.style.setProperty('--sidebar-button-hover-text', buttonHoverText);
  root.style.setProperty('--sidebar-icon-color', iconColor);
  root.style.setProperty('--sidebar-semi-dark-icon-color', semiDarkIconColor);
  root.style.setProperty('--sidebar-dark-icon-color', darkIconColor);
  root.style.setProperty('--sidebar-hover-icon-color', hoverIconColor);
  root.style.setProperty('--sidebar-label-color', labelColor);
  root.style.setProperty('--sidebar-font-size', fontSize + 'px');
  root.style.setProperty('--sidebar-label-font-size', labelFontSize + 'px');
  
  if (sidebarWidthEnabled) {
    root.style.setProperty('--sidebar-width', sidebarWidth + 'px');
  } else {
    root.style.removeProperty('--sidebar-width');
  }

  if (semiDark) {
    root.setAttribute('data-sidebar-style', 'semi-dark');
  } else {
    root.removeAttribute('data-sidebar-style');
  }
}

function loadStoredSidebarTheme() {
  try {
    const stored = localStorage.getItem('admin_sidebar_theme_settings');
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function storeSidebarTheme(theme) {
  try {
    localStorage.setItem('admin_sidebar_theme_settings', JSON.stringify(theme));
  } catch {
    // ignore
  }
}

function hexToRgba(hex, alpha = 1) {
  const sanitized = hex.replace('#', '');
  const normalized = sanitized.length === 3
    ? sanitized.split('').map((char) => char + char).join('')
    : sanitized;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function Sidebartheme({ initialTab = 'sidebar' }) {
  const { addNotification, frontTabFlyoverEnabled, setFrontTabFlyoverEnabled } = useApp();
  const stored = loadStoredSidebarTheme();
  const [activeThemeTab, setActiveThemeTab] = useState(initialTab);

  useEffect(() => {
    setActiveThemeTab(initialTab);
  }, [initialTab]);

  const [mode, setMode] = useState(stored?.mode ?? DEFAULT_SIDEBAR_THEME.mode);
  const [customColor, setCustomColor] = useState(stored?.customColor ?? DEFAULT_SIDEBAR_THEME.customColor);
  const [selectedGradient, setSelectedGradient] = useState(stored?.selectedGradient ?? GRADIENT_PRESETS[0]);
  const [gradientFrom, setGradientFrom] = useState(stored?.gradientFrom ?? DEFAULT_SIDEBAR_THEME.gradientFrom);
  const [gradientTo, setGradientTo] = useState(stored?.gradientTo ?? DEFAULT_SIDEBAR_THEME.gradientTo);
  const [semiDark, setSemiDark] = useState(stored?.semiDark ?? DEFAULT_SIDEBAR_THEME.semiDark);
  const [darkSidebarEnabled, setDarkSidebarEnabled] = useState(stored?.darkSidebarEnabled ?? DEFAULT_SIDEBAR_THEME.darkSidebarEnabled);
  const [darkSidebarBg, setDarkSidebarBg] = useState(stored?.darkSidebarBg ?? DEFAULT_SIDEBAR_THEME.darkSidebarBg);
  const [darkSidebarText, setDarkSidebarText] = useState(stored?.darkSidebarText ?? DEFAULT_SIDEBAR_THEME.darkSidebarText);
  const [sidebarIconColor, setSidebarIconColor] = useState(stored?.sidebarIconColor ?? DEFAULT_SIDEBAR_THEME.sidebarIconColor);
  const [sidebarSemiDarkIconColor, setSidebarSemiDarkIconColor] = useState(stored?.sidebarSemiDarkIconColor ?? DEFAULT_SIDEBAR_THEME.sidebarSemiDarkIconColor);
  const [sidebarDarkIconColor, setSidebarDarkIconColor] = useState(stored?.sidebarDarkIconColor ?? DEFAULT_SIDEBAR_THEME.sidebarDarkIconColor);
  const [sidebarHoverIconColor, setSidebarHoverIconColor] = useState(stored?.sidebarHoverIconColor ?? DEFAULT_SIDEBAR_THEME.sidebarHoverIconColor);
  const [sidebarLabelColor, setSidebarLabelColor] = useState(stored?.sidebarLabelColor ?? DEFAULT_SIDEBAR_THEME.sidebarLabelColor);
  const [sidebarFontSize, setSidebarFontSize] = useState(stored?.sidebarFontSize ?? DEFAULT_SIDEBAR_THEME.sidebarFontSize);
  const [sidebarLabelFontSize, setSidebarLabelFontSize] = useState(stored?.sidebarLabelFontSize ?? DEFAULT_SIDEBAR_THEME.sidebarLabelFontSize);
  const [sidebarButtonMode, setSidebarButtonMode] = useState(stored?.sidebarButtonMode ?? DEFAULT_SIDEBAR_THEME.sidebarButtonMode);
  const [sidebarButtonBg, setSidebarButtonBg] = useState(stored?.sidebarButtonBg ?? DEFAULT_SIDEBAR_THEME.sidebarButtonBg);
  const [sidebarButtonAlpha, setSidebarButtonAlpha] = useState(stored?.sidebarButtonAlpha ?? DEFAULT_SIDEBAR_THEME.sidebarButtonAlpha);
  const [sidebarButtonText, setSidebarButtonText] = useState(stored?.sidebarButtonText ?? DEFAULT_SIDEBAR_THEME.sidebarButtonText);
  const [sidebarSelectedGradient, setSidebarSelectedGradient] = useState(stored?.sidebarSelectedGradient ?? DEFAULT_SIDEBAR_THEME.sidebarSelectedGradient);
  const [sidebarGradientFrom, setSidebarGradientFrom] = useState(stored?.sidebarGradientFrom ?? DEFAULT_SIDEBAR_THEME.sidebarButtonGradientFrom);
  const [sidebarGradientTo, setSidebarGradientTo] = useState(stored?.sidebarGradientTo ?? DEFAULT_SIDEBAR_THEME.sidebarButtonGradientTo);
  const [sidebarButtonHoverMode, setSidebarButtonHoverMode] = useState(stored?.sidebarButtonHoverMode ?? DEFAULT_SIDEBAR_THEME.sidebarButtonHoverMode);
  const [sidebarButtonHoverColor, setSidebarButtonHoverColor] = useState(stored?.sidebarButtonHoverColor ?? DEFAULT_SIDEBAR_THEME.sidebarButtonHoverColor);
  const [sidebarButtonHoverAlpha, setSidebarButtonHoverAlpha] = useState(stored?.sidebarButtonHoverAlpha ?? DEFAULT_SIDEBAR_THEME.sidebarButtonHoverAlpha);
  const [sidebarButtonHoverText, setSidebarButtonHoverText] = useState(stored?.sidebarButtonHoverText ?? DEFAULT_SIDEBAR_THEME.sidebarButtonHoverText);
  const [sidebarSelectedHoverGradient, setSidebarSelectedHoverGradient] = useState(stored?.sidebarSelectedHoverGradient ?? DEFAULT_SIDEBAR_THEME.sidebarSelectedHoverGradient);
  const [sidebarButtonHoverGradientFrom, setSidebarButtonHoverGradientFrom] = useState(stored?.sidebarButtonHoverGradientFrom ?? DEFAULT_SIDEBAR_THEME.sidebarButtonHoverGradientFrom);
  const [sidebarButtonHoverGradientTo, setSidebarButtonHoverGradientTo] = useState(stored?.sidebarButtonHoverGradientTo ?? DEFAULT_SIDEBAR_THEME.sidebarButtonHoverGradientTo);

  const [sidebarButtonBorderEnabled, setSidebarButtonBorderEnabled] = useState(stored?.sidebarButtonBorderEnabled ?? DEFAULT_SIDEBAR_THEME.sidebarButtonBorderEnabled);
  const [sidebarButtonBorderWidth, setSidebarButtonBorderWidth] = useState(stored?.sidebarButtonBorderWidth ?? DEFAULT_SIDEBAR_THEME.sidebarButtonBorderWidth);
  const [sidebarButtonBorderColor, setSidebarButtonBorderColor] = useState(stored?.sidebarButtonBorderColor ?? DEFAULT_SIDEBAR_THEME.sidebarButtonBorderColor);

  const [sidebarWidth, setSidebarWidth] = useState(stored?.sidebarWidth ?? DEFAULT_SIDEBAR_THEME.sidebarWidth);
  const [sidebarWidthEnabled, setSidebarWidthEnabled] = useState(stored?.sidebarWidthEnabled ?? DEFAULT_SIDEBAR_THEME.sidebarWidthEnabled);

  const lightSidebarBg = useMemo(() => {
    if (!semiDark) return '#ffffff';
    return mode === 'simple'
      ? customColor
      : `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`;
  }, [semiDark, mode, customColor, gradientFrom, gradientTo]);

  const lightSidebarText = useMemo(() => {
    if (!semiDark) return '#111827';
    return mode === 'simple'
      ? getContrastText(customColor)
      : getGradientContrastText(gradientFrom, gradientTo);
  }, [semiDark, mode, customColor, gradientFrom, gradientTo]);

  const lightSidebarBorder = useMemo(() => {
    if (!semiDark) return '#e5e7eb';
    return mode === 'simple' ? lightenHex(customColor, 0.4) : '#d1d5db';
  }, [semiDark, mode, customColor]);

  const darkSidebarBgFinal = darkSidebarEnabled ? darkSidebarBg : DEFAULT_SIDEBAR_THEME.darkSidebarBg;
  const darkSidebarTextFinal = darkSidebarEnabled ? darkSidebarText : DEFAULT_SIDEBAR_THEME.darkSidebarText;
  const darkSidebarBorderFinal = darkSidebarEnabled ? lightenHex(darkSidebarBg, 0.3) : '#334155';

  const sidebarButtonBackground = useMemo(() => {
    if (sidebarButtonMode === 'simple') {
      return hexToRgba(sidebarButtonBg, sidebarButtonAlpha);
    }
    return `linear-gradient(135deg, ${sidebarGradientFrom}, ${sidebarGradientTo})`;
  }, [sidebarButtonMode, sidebarButtonBg, sidebarButtonAlpha, sidebarGradientFrom, sidebarGradientTo]);

  const sidebarButtonHover = useMemo(() => {
    if (sidebarButtonHoverMode === 'simple') {
      return hexToRgba(sidebarButtonHoverColor, sidebarButtonHoverAlpha);
    }
    return `linear-gradient(135deg, ${hexToRgba(sidebarButtonHoverGradientFrom, sidebarButtonHoverAlpha)}, ${hexToRgba(sidebarButtonHoverGradientTo, sidebarButtonHoverAlpha)})`;
  }, [sidebarButtonHoverMode, sidebarButtonHoverColor, sidebarButtonHoverAlpha, sidebarButtonHoverGradientFrom, sidebarButtonHoverGradientTo]);

  const handleSaveChanges = () => {
    applySidebarTheme(
      lightSidebarBg,
      lightSidebarText,
      lightSidebarBorder,
      darkSidebarBgFinal,
      darkSidebarTextFinal,
      darkSidebarBorderFinal,
      sidebarButtonBackground,
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
      semiDark,
      sidebarWidth,
      sidebarWidthEnabled,
    );
    storeSidebarTheme({
      mode,
      customColor,
      selectedGradient,
      gradientFrom,
      gradientTo,
      semiDark,
      darkSidebarEnabled,
      darkSidebarBg,
      darkSidebarText,
      sidebarIconColor,
      sidebarSemiDarkIconColor,
      sidebarDarkIconColor,
      sidebarHoverIconColor,
      sidebarLabelColor,
      sidebarFontSize,
      sidebarLabelFontSize,
      sidebarButtonMode,
      sidebarButtonBg,
      sidebarButtonAlpha,
      sidebarButtonText,
      sidebarSelectedGradient,
      sidebarGradientFrom,
      sidebarGradientTo,
      sidebarButtonHoverMode,
      sidebarButtonHoverColor,
      sidebarButtonHoverAlpha,
      sidebarButtonHoverText,
      sidebarSelectedHoverGradient,
      sidebarButtonHoverGradientFrom,
      sidebarButtonHoverGradientTo,
      sidebarButtonBorderEnabled,
      sidebarButtonBorderWidth,
      sidebarButtonBorderColor,
      sidebarWidth,
      sidebarWidthEnabled,
    });
    addNotification('Sidebar theme settings saved successfully!', 'success', 3000, { title: 'Theme Saved' });
  };

  useEffect(() => {
    applySidebarTheme(
      lightSidebarBg,
      lightSidebarText,
      lightSidebarBorder,
      darkSidebarBgFinal,
      darkSidebarTextFinal,
      darkSidebarBorderFinal,
      sidebarButtonBackground,
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
      semiDark,
      sidebarWidth,
      sidebarWidthEnabled,
    );
    // Apply border properties directly for live preview
    const root = document.documentElement;
    root.style.setProperty('--sidebar-button-border-width', sidebarButtonBorderWidth + 'px');
    root.style.setProperty('--sidebar-button-border-color', sidebarButtonBorderEnabled ? sidebarButtonBorderColor : 'transparent');
  }, [
    lightSidebarBg,
    lightSidebarText,
    lightSidebarBorder,
    darkSidebarBgFinal,
    darkSidebarTextFinal,
    darkSidebarBorderFinal,
    sidebarButtonBackground,
    sidebarButtonText,
    sidebarButtonHover,
    sidebarButtonHoverText,
    sidebarIconColor,
    sidebarSemiDarkIconColor,
    sidebarDarkIconColor,
    sidebarLabelColor,
    sidebarFontSize,
    sidebarLabelFontSize,
    semiDark,
    sidebarButtonBorderEnabled,
    sidebarButtonBorderWidth,
    sidebarButtonBorderColor,
    sidebarWidth,
    sidebarWidthEnabled,
  ]);

  const resetSidebarTheme = () => {
    setMode(DEFAULT_SIDEBAR_THEME.mode);
    setCustomColor(DEFAULT_SIDEBAR_THEME.customColor);
    setSelectedGradient(GRADIENT_PRESETS[0]);
    setGradientFrom(DEFAULT_SIDEBAR_THEME.gradientFrom);
    setGradientTo(DEFAULT_SIDEBAR_THEME.gradientTo);
    setSemiDark(DEFAULT_SIDEBAR_THEME.semiDark);
    setDarkSidebarEnabled(DEFAULT_SIDEBAR_THEME.darkSidebarEnabled);
    setDarkSidebarBg(DEFAULT_SIDEBAR_THEME.darkSidebarBg);
    setDarkSidebarText(DEFAULT_SIDEBAR_THEME.darkSidebarText);
    setSidebarIconColor(DEFAULT_SIDEBAR_THEME.sidebarIconColor);
    setSidebarSemiDarkIconColor(DEFAULT_SIDEBAR_THEME.sidebarSemiDarkIconColor);
    setSidebarDarkIconColor(DEFAULT_SIDEBAR_THEME.sidebarDarkIconColor);
    setSidebarLabelColor(DEFAULT_SIDEBAR_THEME.sidebarLabelColor);
    setSidebarFontSize(DEFAULT_SIDEBAR_THEME.sidebarFontSize);
    setSidebarLabelFontSize(DEFAULT_SIDEBAR_THEME.sidebarLabelFontSize);
    setSidebarButtonMode(DEFAULT_SIDEBAR_THEME.sidebarButtonMode);
    setSidebarButtonBg(DEFAULT_SIDEBAR_THEME.sidebarButtonBg);
    setSidebarButtonAlpha(DEFAULT_SIDEBAR_THEME.sidebarButtonAlpha);
    setSidebarButtonText(DEFAULT_SIDEBAR_THEME.sidebarButtonText);
    setSidebarSelectedGradient(DEFAULT_SIDEBAR_THEME.sidebarSelectedGradient);
    setSidebarGradientFrom(DEFAULT_SIDEBAR_THEME.sidebarButtonGradientFrom);
    setSidebarGradientTo(DEFAULT_SIDEBAR_THEME.sidebarButtonGradientTo);
    setSidebarButtonHoverMode(DEFAULT_SIDEBAR_THEME.sidebarButtonHoverMode);
    setSidebarButtonHoverColor(DEFAULT_SIDEBAR_THEME.sidebarButtonHoverColor);
    setSidebarButtonHoverAlpha(DEFAULT_SIDEBAR_THEME.sidebarButtonHoverAlpha);
    setSidebarButtonHoverText(DEFAULT_SIDEBAR_THEME.sidebarButtonHoverText);
    setSidebarSelectedHoverGradient(DEFAULT_SIDEBAR_THEME.sidebarSelectedHoverGradient);
    setSidebarButtonHoverGradientFrom(DEFAULT_SIDEBAR_THEME.sidebarButtonHoverGradientFrom);
    setSidebarButtonHoverGradientTo(DEFAULT_SIDEBAR_THEME.sidebarButtonHoverGradientTo);
    setSidebarButtonBorderEnabled(DEFAULT_SIDEBAR_THEME.sidebarButtonBorderEnabled);
    setSidebarButtonBorderWidth(DEFAULT_SIDEBAR_THEME.sidebarButtonBorderWidth);
    setSidebarButtonBorderColor(DEFAULT_SIDEBAR_THEME.sidebarButtonBorderColor);
    setSidebarWidth(DEFAULT_SIDEBAR_THEME.sidebarWidth);
    setSidebarWidthEnabled(DEFAULT_SIDEBAR_THEME.sidebarWidthEnabled);
  };


  return (
    <div className="theme-settings p-lg-4 p-3 bg-light min-vh-100">
      <div className="container-fluid">
        <div className="row mb-4 align-items-center">
          <div className="col">
            <h2 className="fw-bold text-dark mb-1">Sidebar Customization</h2>
            <p className="text-muted">Personalize the appearance of your admin sidebar and navigation components.</p>
          </div>
          <div className="col-auto">
            <button type="button" className="btn btn-white border shadow-sm px-4 d-flex align-items-center gap-2" onClick={resetSidebarTheme}>
              <FontAwesomeIcon icon={faSync} className="small" />
              <span>Reset to Default</span>
            </button>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-xl-8">
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-header bg-white border-0 pt-4 px-4">
                <ul className="nav nav-pills custom-settings-tabs p-1 bg-light rounded-3">
                  <li className="nav-item flex-fill">
                    <button 
                      className={`nav-link w-100 rounded-3 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 ${activeThemeTab === 'sidebar' ? 'active shadow-sm' : 'text-secondary'}`}
                      onClick={() => setActiveThemeTab('sidebar')}
                    >
                      <FontAwesomeIcon icon={faPalette} />
                      Sidebar Layout
                    </button>
                  </li>
                  <li className="nav-item flex-fill">
                    <button 
                      className={`nav-link w-100 rounded-3 py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 ${activeThemeTab === 'buttons' ? 'active shadow-sm' : 'text-secondary'}`}
                      onClick={() => setActiveThemeTab('buttons')}
                    >
                      <FontAwesomeIcon icon={faMousePointer} />
                      Button Styling
                    </button>
                  </li>
                </ul>
              </div>

              <div className="card-body p-4">
                {activeThemeTab === 'sidebar' ? (
                  <div className="sidebar-settings-content fade-in">
                    <section className="mb-5">
                      <label className="form-label fw-bold h6 mb-3">Color Mode</label>
                      <div className="d-flex gap-3">
                        <button
                          type="button"
                          className={`btn flex-fill py-3 border-2 ${mode === 'simple' ? 'btn-primary border-primary' : 'btn-outline-secondary'}`}
                          onClick={() => setMode('simple')}
                        >
                          <span className="fw-bold">Solid Color</span>
                          <small className="d-block opacity-75">Clean & minimal</small>
                        </button>
                        <button
                          type="button"
                          className={`btn flex-fill py-3 border-2 ${mode === 'gradient' ? 'btn-primary border-primary' : 'btn-outline-secondary'}`}
                          onClick={() => setMode('gradient')}
                        >
                          <span className="fw-bold">Gradient</span>
                          <small className="d-block opacity-75">Modern & dynamic</small>
                        </button>
                      </div>
                    </section>

                    {mode === 'simple' ? (
                      <section className="mb-5 animate-slide-up">
                        <label className="form-label fw-bold h6 mb-3">Sidebar Presets</label>
                        <div className="d-flex flex-wrap gap-3">
                          {SIMPLE_COLORS.map((option) => (
                            <button
                              key={option.name}
                              type="button"
                              className={`color-preset-btn ${customColor.toLowerCase() === option.color.toLowerCase() ? 'active scale-up' : ''}`}
                              style={{ backgroundColor: option.color }}
                              onClick={() => { setMode('simple'); setCustomColor(option.color); }}
                              title={option.name}
                            >
                              {customColor.toLowerCase() === option.color.toLowerCase() && (
                                <FontAwesomeIcon icon={faCheckCircle} className="text-white shadow-sm" />
                              )}
                            </button>
                          ))}
                        </div>
                        
                        <div className="mt-4">
                          <label className="form-label text-muted small fw-bold text-uppercase">Custom Color</label>
                          <div className="d-flex align-items-center gap-3">
                            <div className="color-picker-wrapper shadow-sm rounded-circle overflow-hidden border">
                              <input
                                type="color"
                                value={customColor}
                                onChange={(e) => { setMode('simple'); setCustomColor(e.target.value); }}
                              />
                            </div>
                            <input
                              type="text"
                              className="form-control border-2 w-auto fw-mono px-3"
                              value={customColor}
                              onChange={(e) => { setMode('simple'); setCustomColor(e.target.value); }}
                              style={{ maxWidth: 140 }}
                            />
                          </div>
                        </div>
                      </section>
                    ) : (
                      <section className="mb-5 animate-slide-up">
                        <label className="form-label fw-bold h6 mb-3">Gradient Presets</label>
                        <div className="d-flex flex-wrap gap-3">
                          {GRADIENT_PRESETS.map((gradient) => {
                            const isActive = selectedGradient.from === gradient.from && selectedGradient.to === gradient.to;
                            return (
                              <button
                                key={gradient.name}
                                type="button"
                                className={`gradient-preset-btn border-0 shadow-sm ${isActive ? 'active ring-primary' : ''}`}
                                style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
                                onClick={() => {
                                  setMode('gradient');
                                  setSelectedGradient(gradient);
                                  setGradientFrom(gradient.from);
                                  setGradientTo(gradient.to);
                                }}
                                title={gradient.name}
                              >
                                {isActive && <FontAwesomeIcon icon={faCheckCircle} className="text-white" />}
                              </button>
                            );
                          })}
                        </div>

                        <div className="row g-4 mt-2">
                          <div className="col-sm-6">
                            <label className="form-label text-muted small fw-bold text-uppercase">Start Color</label>
                            <div className="d-flex align-items-center gap-3">
                              <div className="color-picker-wrapper shadow-sm rounded-circle border">
                                <input type="color" value={gradientFrom} onChange={(e) => {
                                  setMode('gradient');
                                  setGradientFrom(e.target.value);
                                  setSelectedGradient({ ...selectedGradient, from: e.target.value, name: 'Custom' });
                                }} />
                              </div>
                              <input type="text" className="form-control border-2 fw-mono" value={gradientFrom} readOnly />
                            </div>
                          </div>
                          <div className="col-sm-6">
                            <label className="form-label text-muted small fw-bold text-uppercase">End Color</label>
                            <div className="d-flex align-items-center gap-3">
                              <div className="color-picker-wrapper shadow-sm rounded-circle border">
                                <input type="color" value={gradientTo} onChange={(e) => {
                                  setMode('gradient');
                                  setGradientTo(e.target.value);
                                  setSelectedGradient({ ...selectedGradient, to: e.target.value, name: 'Custom' });
                                }} />
                              </div>
                              <input type="text" className="form-control border-2 fw-mono" value={gradientTo} readOnly />
                            </div>
                          </div>
                        </div>
                      </section>
                    )}

                    <section className="p-4 rounded-4 border bg-light shadow-sm">
                      <div className="mb-3">
                        <EnableDisableButton
                          checked={semiDark}
                          onClick={() => {
                            const new_val = !semiDark;
                            setSemiDark(new_val);
                            if (new_val) {
                              setSidebarButtonText('#ffffff');
                            }
                          }}
                          label="Semi-Dark Sidebar (Light Mode)"
                        />
                      </div>
                      <p className="text-muted small mb-4">When enabled, the sidebar uses your selected custom color even in light mode. When disabled, it remains pure white.</p>

                      <hr className="my-4 opacity-10" />

                      <div className="mb-3">
                        <EnableDisableButton
                          checked={darkSidebarEnabled}
                          onClick={() => setDarkSidebarEnabled(!darkSidebarEnabled)}
                          label="Custom Dark Mode Sidebar"
                        />
                      </div>
                      <div className="row g-4 animate-fade-in" style={{ display: darkSidebarEnabled ? 'flex' : 'none' }}>
                        <div className="col-sm-6">
                          <label className="form-label text-muted small fw-bold text-uppercase">Dark Background</label>
                          <div className="d-flex align-items-center gap-3">
                            <div className="color-picker-wrapper border rounded-circle shadow-sm">
                              <input type="color" value={darkSidebarBg} onChange={(e) => setDarkSidebarBg(e.target.value)} />
                            </div>
                            <input type="text" className="form-control border-2 fw-mono" value={darkSidebarBg} readOnly />
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <label className="form-label text-muted small fw-bold text-uppercase">Dark Mode Text</label>
                          <div className="d-flex align-items-center gap-3">
                            <div className="color-picker-wrapper border rounded-circle shadow-sm">
                              <input type="color" value={darkSidebarText} onChange={(e) => setDarkSidebarText(e.target.value)} />
                            </div>
                            <input type="text" className="form-control border-2 fw-mono" value={darkSidebarText} readOnly />
                          </div>
                        </div>
                      </div>

                      <hr className="my-4 opacity-10" />

                      <div className="mb-4">
                        <label className="form-label fw-bold h6 mb-3">Label & Text Settings</label>
                        <div className="row g-4">
                          <div className="col-sm-6">
                            <label className="form-label text-muted small fw-bold text-uppercase">Heading Label Color</label>
                            <div className="d-flex align-items-center gap-3">
                              <div className="color-picker-wrapper shadow-sm rounded-circle border">
                                <input type="color" value={sidebarLabelColor} onChange={(e) => setSidebarLabelColor(e.target.value)} />
                              </div>
                              <input type="text" className="form-control border-2 w-auto fw-mono px-3" value={sidebarLabelColor} onChange={(e) => setSidebarLabelColor(e.target.value)} style={{ maxWidth: 140 }} />
                            </div>
                          </div>
                          <div className="col-sm-6">
                            <div className="mb-3">
                              <label className="form-label text-muted small fw-bold text-uppercase">Tabs Font Size ({sidebarFontSize}px)</label>
                              <div className="d-flex align-items-center gap-2">
                                  <input 
                                    type="range" 
                                    className="form-range flex-grow-1" 
                                    min="8" max="24" step="1" 
                                    value={sidebarFontSize} 
                                    onChange={(e) => setSidebarFontSize(e.target.value)} 
                                  />
                                  <span className="badge bg-light text-dark border fw-mono">{sidebarFontSize}px</span>
                              </div>
                            </div>
                            <div>
                              <label className="form-label text-muted small fw-bold text-uppercase">Labels Font Size ({sidebarLabelFontSize}px)</label>
                              <div className="d-flex align-items-center gap-2">
                                  <input 
                                    type="range" 
                                    className="form-range flex-grow-1" 
                                    min="8" max="20" step="1" 
                                    value={sidebarLabelFontSize} 
                                    onChange={(e) => setSidebarLabelFontSize(e.target.value)} 
                                  />
                                  <span className="badge bg-light text-dark border fw-mono">{sidebarLabelFontSize}px</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <hr className="my-4 opacity-10" />

                      <div className="mb-4">
                        <label className="form-label fw-bold h6 mb-3">Sidebar Dimension Controls</label>
                        <div className="p-4 rounded-4 border bg-light shadow-sm mb-4">
                          <div className="mb-4">
                            <EnableDisableButton
                              checked={sidebarWidthEnabled}
                              onClick={() => setSidebarWidthEnabled(!sidebarWidthEnabled)}
                              label="Enable Custom Sidebar Width"
                            />
                          </div>

                          <div className="animate-fade-in" style={{ display: sidebarWidthEnabled ? 'block' : 'none' }}>
                             <label className="form-label text-muted small fw-bold text-uppercase">Adjust Width ({sidebarWidth}px)</label>
                             <div className="d-flex align-items-center gap-3">
                                <input 
                                  type="range" 
                                  className="form-range flex-grow-1" 
                                  min="200" max="400" step="5" 
                                  value={sidebarWidth} 
                                  onChange={(e) => setSidebarWidth(e.target.value)} 
                                />
                                <span className="badge bg-primary text-white border-0 fw-mono px-3 py-2">{sidebarWidth}px</span>
                             </div>
                             <p className="text-muted x-small mt-2 mb-0">Recommended: 240px - 300px for optimal visibility.</p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="form-label fw-bold h6 mb-3">Icon Color Settings</label>
                        <div className="row g-4">
                          <div className="col-sm-4">
                            <label className="form-label text-muted small fw-bold text-uppercase">Light Mode Icons</label>
                            <div className="d-flex align-items-center gap-2">
                              <div className="color-picker-wrapper shadow-sm rounded-circle border">
                                <input type="color" value={sidebarIconColor} onChange={(e) => setSidebarIconColor(e.target.value)} />
                              </div>
                              <input type="text" className="form-control border-2 fw-mono px-2 small" value={sidebarIconColor} onChange={(e) => setSidebarIconColor(e.target.value)} />
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <label className="form-label text-muted small fw-bold text-uppercase">Semi-Dark Icons</label>
                            <div className="d-flex align-items-center gap-2">
                              <div className="color-picker-wrapper shadow-sm rounded-circle border">
                                <input type="color" value={sidebarSemiDarkIconColor} onChange={(e) => setSidebarSemiDarkIconColor(e.target.value)} />
                              </div>
                              <input type="text" className="form-control border-2 fw-mono px-2 small" value={sidebarSemiDarkIconColor} onChange={(e) => setSidebarSemiDarkIconColor(e.target.value)} />
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <label className="form-label text-muted small fw-bold text-uppercase">Dark Mode Icons</label>
                            <div className="d-flex align-items-center gap-2">
                              <div className="color-picker-wrapper shadow-sm rounded-circle border">
                                <input type="color" value={sidebarDarkIconColor} onChange={(e) => setSidebarDarkIconColor(e.target.value)} />
                              </div>
                              <input type="text" className="form-control border-2 fw-mono px-2 small" value={sidebarDarkIconColor} onChange={(e) => setSidebarDarkIconColor(e.target.value)} />
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <label className="form-label text-muted small fw-bold text-uppercase">Hover Icons</label>
                            <div className="d-flex align-items-center gap-2">
                              <div className="color-picker-wrapper shadow-sm rounded-circle border">
                                <input type="color" value={sidebarHoverIconColor} onChange={(e) => setSidebarHoverIconColor(e.target.value)} />
                              </div>
                              <input type="text" className="form-control border-2 fw-mono px-2 small" value={sidebarHoverIconColor} onChange={(e) => setSidebarHoverIconColor(e.target.value)} />
                            </div>
                          </div>
                        </div>
                        <p className="text-muted small mt-3">Customize how icons appear in different sidebar background styles and on hover.</p>
                      </div>

                      <div className="mb-3">
                        <EnableDisableButton
                          checked={frontTabFlyoverEnabled}
                          onClick={() => setFrontTabFlyoverEnabled(!frontTabFlyoverEnabled)}
                          label="Enable Front Tab Flyover"
                        />
                      </div>
                      <p className="text-muted small mb-3">When enabled, clicking a system group will open a front overlay showing its sub-tabs instead of expanding the sidebar list.</p>

                      <div className="mt-5 pt-3 border-top">
                        <button type="button" className="btn btn-primary w-100 py-3 rounded-4 shadow-sm fw-bold" onClick={handleSaveChanges}>
                          Save Sidebar Layout Changes
                        </button>
                      </div>
                    </section>
                  </div>
                ) : (
                  <div className="button-settings-content fade-in">
                    <section className="mb-5">
                      <label className="form-label fw-bold h6 mb-3">Active State Style</label>
                      <div className="d-flex gap-3">
                        <button
                          type="button"
                          className={`btn flex-fill py-3 border-2 ${sidebarButtonMode === 'simple' ? 'btn-primary border-primary' : 'btn-outline-secondary'}`}
                          onClick={() => setSidebarButtonMode('simple')}
                        >
                          <span className="fw-bold">Solid Background</span>
                        </button>
                        <button
                          type="button"
                          className={`btn flex-fill py-3 border-2 ${sidebarButtonMode === 'gradient' ? 'btn-primary border-primary' : 'btn-outline-secondary'}`}
                          onClick={() => setSidebarButtonMode('gradient')}
                        >
                          <span className="fw-bold">Gradient Background</span>
                        </button>
                      </div>
                    </section>

                    {sidebarButtonMode === 'simple' ? (
                      <section className="mb-5 animate-slide-up">
                        <div className="row g-4">
                          <div className="col-sm-6">
                            <label className="form-label text-muted small fw-bold text-uppercase">Button Background</label>
                            <div className="d-flex align-items-center gap-3">
                              <div className="color-picker-wrapper border rounded-circle shadow-sm">
                                <input type="color" value={sidebarButtonBg} onChange={(e) => setSidebarButtonBg(e.target.value)} />
                              </div>
                              <input type="text" className="form-control border-2 fw-mono" value={sidebarButtonBg} onChange={(e) => setSidebarButtonBg(e.target.value)} />
                            </div>
                            <div className="mt-3">
                              <label className="form-label text-muted x-small fw-bold">Transparency (Alpha)</label>
                              <div className="d-flex align-items-center gap-2">
                                <input 
                                  type="range" 
                                  className="form-range flex-grow-1" 
                                  min="0" max="1" step="0.05" 
                                  value={sidebarButtonAlpha} 
                                  onChange={(e) => setSidebarButtonAlpha(parseFloat(e.target.value))} 
                                />
                                <span className="badge bg-light text-dark border fw-mono">{Math.round(sidebarButtonAlpha * 100)}%</span>
                              </div>
                            </div>
                          </div>
                          <div className="col-sm-6">
                            <label className="form-label text-muted small fw-bold text-uppercase">Button Text</label>
                            <div className="d-flex align-items-center gap-3">
                              <div className="color-picker-wrapper border rounded-circle shadow-sm">
                                <input type="color" value={sidebarButtonText} onChange={(e) => setSidebarButtonText(e.target.value)} />
                              </div>
                              <input type="text" className="form-control border-2 fw-mono" value={sidebarButtonText} onChange={(e) => setSidebarButtonText(e.target.value)} />
                            </div>
                          </div>
                        </div>
                      </section>
                    ) : (
                      <section className="mb-5 animate-slide-up">
                        <label className="form-label text-muted small fw-bold text-uppercase mb-3">Gradient Presets</label>
                        <div className="d-flex flex-wrap gap-3 mb-4">
                          {GRADIENT_PRESETS.map((gradient) => {
                            const isActive = sidebarSelectedGradient.from === gradient.from && sidebarSelectedGradient.to === gradient.to;
                            return (
                              <button
                                key={gradient.name}
                                type="button"
                                className={`gradient-preset-btn border-0 shadow-sm ${isActive ? 'active ring-primary' : ''}`}
                                style={{ background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})` }}
                                onClick={() => {
                                  setSidebarButtonMode('gradient');
                                  setSidebarSelectedGradient(gradient);
                                  setSidebarGradientFrom(gradient.from);
                                  setSidebarGradientTo(gradient.to);
                                }}
                              >
                                {isActive && <FontAwesomeIcon icon={faCheckCircle} className="text-white" />}
                              </button>
                            );
                          })}
                        </div>
                        <div className="row g-4">
                          <div className="col-sm-6">
                            <label className="form-label text-muted small fw-bold text-uppercase">Start Color</label>
                            <input type="color" className="form-control form-control-color w-100 shadow-sm rounded-3" value={sidebarGradientFrom} onChange={(e) => setSidebarGradientFrom(e.target.value)} />
                          </div>
                          <div className="col-sm-6">
                            <label className="form-label text-muted small fw-bold text-uppercase">End Color</label>
                            <input type="color" className="form-control form-control-color w-100 shadow-sm rounded-3" value={sidebarGradientTo} onChange={(e) => setSidebarGradientTo(e.target.value)} />
                          </div>
                        </div>
                      </section>
                    )}

                    <hr className="my-5" />

                    <section className="mb-4">
                      <label className="form-label fw-bold h6 mb-3">Hover State Style</label>
                      <div className="d-flex gap-3 mb-4">
                        <button
                          type="button"
                          className={`btn flex-fill py-3 border-2 ${sidebarButtonHoverMode === 'simple' ? 'btn-primary border-primary' : 'btn-outline-secondary'}`}
                          onClick={() => setSidebarButtonHoverMode('simple')}
                        >
                          <span className="fw-bold">Simple Hover</span>
                        </button>
                        <button
                          type="button"
                          className={`btn flex-fill py-3 border-2 ${sidebarButtonHoverMode === 'gradient' ? 'btn-primary border-primary' : 'btn-outline-secondary'}`}
                          onClick={() => setSidebarButtonHoverMode('gradient')}
                        >
                          <span className="fw-bold">Gradient Hover</span>
                        </button>
                      </div>

                      <div className="row g-4">
                        <div className="col-sm-6">
                          <label className="form-label text-muted small fw-bold text-uppercase">Hover {sidebarButtonHoverMode === 'gradient' ? 'Start' : ''} Color</label>
                          <div className="d-flex align-items-center gap-3">
                            <div className="color-picker-wrapper border rounded-circle shadow-sm">
                              <input 
                                type="color" 
                                value={sidebarButtonHoverMode === 'simple' ? sidebarButtonHoverColor : sidebarButtonHoverGradientFrom} 
                                onChange={(e) => sidebarButtonHoverMode === 'simple' ? setSidebarButtonHoverColor(e.target.value) : setSidebarButtonHoverGradientFrom(e.target.value)} 
                              />
                            </div>
                            <input 
                              type="text" 
                              className="form-control border-2 fw-mono" 
                              value={sidebarButtonHoverMode === 'simple' ? sidebarButtonHoverColor : sidebarButtonHoverGradientFrom} 
                              onChange={(e) => sidebarButtonHoverMode === 'simple' ? setSidebarButtonHoverColor(e.target.value) : setSidebarButtonHoverGradientFrom(e.target.value)} 
                            />
                          </div>
                          
                          <div className="mt-3">
                            <label className="form-label text-muted x-small fw-bold">Hover Transparency (Alpha)</label>
                            <div className="d-flex align-items-center gap-2">
                              <input 
                                type="range" 
                                className="form-range flex-grow-1" 
                                min="0" max="1" step="0.05" 
                                value={sidebarButtonHoverAlpha} 
                                onChange={(e) => setSidebarButtonHoverAlpha(parseFloat(e.target.value))} 
                              />
                              <span className="badge bg-light text-dark border fw-mono">{Math.round(sidebarButtonHoverAlpha * 100)}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-sm-6">
                          {sidebarButtonHoverMode === 'simple' ? (
                            <>
                              <label className="form-label text-muted small fw-bold text-uppercase">Hover Text</label>
                              <div className="d-flex align-items-center gap-3">
                                <div className="color-picker-wrapper border rounded-circle shadow-sm">
                                  <input type="color" value={sidebarButtonHoverText} onChange={(e) => setSidebarButtonHoverText(e.target.value)} />
                                </div>
                                <input type="text" className="form-control border-2 fw-mono" value={sidebarButtonHoverText} onChange={(e) => setSidebarButtonHoverText(e.target.value)} />
                              </div>
                            </>
                          ) : (
                            <>
                              <label className="form-label text-muted small fw-bold text-uppercase">Hover End Color</label>
                              <div className="d-flex align-items-center gap-3 mb-3">
                                <div className="color-picker-wrapper border rounded-circle shadow-sm">
                                  <input type="color" value={sidebarButtonHoverGradientTo} onChange={(e) => setSidebarButtonHoverGradientTo(e.target.value)} />
                                </div>
                                <input type="text" className="form-control border-2 fw-mono" value={sidebarButtonHoverGradientTo} onChange={(e) => setSidebarButtonHoverGradientTo(e.target.value)} />
                              </div>
                              <label className="form-label text-muted small fw-bold text-uppercase">Hover Text</label>
                              <div className="d-flex align-items-center gap-3">
                                <div className="color-picker-wrapper border rounded-circle shadow-sm">
                                  <input type="color" value={sidebarButtonHoverText} onChange={(e) => setSidebarButtonHoverText(e.target.value)} />
                                </div>
                                <input type="text" className="form-control border-2 fw-mono" value={sidebarButtonHoverText} onChange={(e) => setSidebarButtonHoverText(e.target.value)} />
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <hr className="my-5" />

                      <section className="mb-4">
                        <label className="form-label fw-bold h6 mb-3">Button Border Settings</label>
                        <div className="p-4 rounded-4 border bg-light shadow-sm mb-4">
                          <div className="mb-4">
                            <EnableDisableButton
                              checked={sidebarButtonBorderEnabled}
                              onClick={() => setSidebarButtonBorderEnabled(!sidebarButtonBorderEnabled)}
                              label="Enable Button Borders"
                            />
                          </div>

                          <div className="row g-4 animate-fade-in" style={{ display: sidebarButtonBorderEnabled ? 'flex' : 'none' }}>
                            <div className="col-sm-6">
                              <label className="form-label text-muted small fw-bold text-uppercase">Border Width ({sidebarButtonBorderWidth}px)</label>
                              <div className="d-flex align-items-center gap-2">
                                <input 
                                  type="range" 
                                  className="form-range flex-grow-1" 
                                  min="0.5" max="5" step="0.5" 
                                  value={sidebarButtonBorderWidth} 
                                  onChange={(e) => setSidebarButtonBorderWidth(e.target.value)} 
                                />
                                <span className="badge bg-light text-dark border fw-mono">{sidebarButtonBorderWidth}px</span>
                              </div>
                            </div>
                            <div className="col-sm-6">
                              <label className="form-label text-muted small fw-bold text-uppercase">Border Color</label>
                              <div className="d-flex align-items-center gap-3">
                                <div className="color-picker-wrapper border rounded-circle shadow-sm">
                                  <input type="color" value={sidebarButtonBorderColor} onChange={(e) => setSidebarButtonBorderColor(e.target.value)} />
                                </div>
                                <input type="text" className="form-control border-2 fw-mono" value={sidebarButtonBorderColor} onChange={(e) => setSidebarButtonBorderColor(e.target.value)} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </section>

                      <div className="mt-5 pt-3 border-top">
                        <button type="button" className="btn btn-primary w-100 py-3 rounded-4 shadow-sm fw-bold" onClick={handleSaveChanges}>
                          Save Button Styling Changes
                        </button>
                      </div>
                      </section>
                      </div>
                      )}
                      </div>
                      </div>
                      </div>

                      <div className="col-xl-4">
                      <div className="sticky-top" style={{ top: '1.5rem', zIndex: 1 }}>
                      <div className="mb-4">
                      <SidebarPreview 
                      mode={mode}
                      customColor={customColor}
                      gradientFrom={gradientFrom}
                      gradientTo={gradientTo}
                      semiDark={semiDark}
                      darkSidebarEnabled={darkSidebarEnabled}
                      darkSidebarBg={darkSidebarBg}
                      darkSidebarText={darkSidebarText}
                      sidebarButtonMode={sidebarButtonMode}
                      sidebarButtonBg={sidebarButtonBackground}
                      sidebarButtonText={sidebarButtonText}
                      sidebarButtonHover={sidebarButtonHover}
                      sidebarButtonHoverText={sidebarButtonHoverText}
                      sidebarIconColor={sidebarIconColor}
                      sidebarSemiDarkIconColor={sidebarSemiDarkIconColor}
                      sidebarDarkIconColor={sidebarDarkIconColor}
                      sidebarHoverIconColor={sidebarHoverIconColor}
                      sidebarLabelColor={sidebarLabelColor}
                      sidebarFontSize={sidebarFontSize}
                      sidebarLabelFontSize={sidebarLabelFontSize}
                      sidebarButtonBorderEnabled={sidebarButtonBorderEnabled}
                      sidebarButtonBorderWidth={sidebarButtonBorderWidth}
                      sidebarButtonBorderColor={sidebarButtonBorderColor}
                      // sidebarWidth={sidebarWidth}
                      // sidebarWidthEnabled={sidebarWidthEnabled}
                      isDarkMode={false}
                      />
                      </div>
                      <div className="mb-4">
                      <SidebarPreview 
                      mode={mode}
                      customColor={customColor}
                      gradientFrom={gradientFrom}
                      gradientTo={gradientTo}
                      semiDark={semiDark}
                      darkSidebarEnabled={darkSidebarEnabled}
                      darkSidebarBg={darkSidebarBg}
                      darkSidebarText={darkSidebarText}
                      sidebarButtonMode={sidebarButtonMode}
                      sidebarButtonBg={sidebarButtonBackground}
                      sidebarButtonText={sidebarButtonText}
                      sidebarButtonHover={sidebarButtonHover}
                      sidebarButtonHoverText={sidebarButtonHoverText}
                      sidebarIconColor={sidebarIconColor}
                      sidebarSemiDarkIconColor={sidebarSemiDarkIconColor}
                      sidebarDarkIconColor={sidebarDarkIconColor}
                      sidebarHoverIconColor={sidebarHoverIconColor}
                      sidebarLabelColor={sidebarLabelColor}
                      sidebarFontSize={sidebarFontSize}
                      sidebarLabelFontSize={sidebarLabelFontSize}
                      sidebarButtonBorderEnabled={sidebarButtonBorderEnabled}
                      sidebarButtonBorderWidth={sidebarButtonBorderWidth}
                      sidebarButtonBorderColor={sidebarButtonBorderColor}
                      // sidebarWidth={sidebarWidth}
                      // sidebarWidthEnabled={sidebarWidthEnabled}
                      isDarkMode={true}
                      />
                      </div>
                      </div>
                      </div>        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-settings-tabs .nav-link.active {
          background-color: #fff;
          color: var(--bs-primary);
        }
        .color-preset-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
        }
        .color-preset-btn:hover { transform: scale(1.15); }
        .color-preset-btn.active { border-color: #000; transform: scale(1.15); }
        
        .gradient-preset-btn {
          width: 56px;
          height: 32px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
        }
        .gradient-preset-btn:hover { transform: translateY(-2px); }
        .gradient-preset-btn.active { ring: 2.5px solid #0d6efd; transform: translateY(-2px); }
        
        .color-picker-wrapper {
          width: 38px;
          height: 38px;
          position: relative;
        }
        .color-picker-wrapper input {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          cursor: pointer;
          border: none;
        }
        
        .fw-mono { font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; }
        .animate-slide-up { animation: slideUp 0.4s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .scale-up { transform: scale(1.1); }
      `}} />
      
    </div>
  );
}

export default Sidebartheme;
