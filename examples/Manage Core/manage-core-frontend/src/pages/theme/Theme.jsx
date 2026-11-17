import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EnableDisableButton } from '../../components/common';

const SIMPLE_COLORS = [
  { name: 'Blue', color: '#2563eb' },
  { name: 'Red', color: '#ef4444' },
  { name: 'Yellow', color: '#f59e0b' },
  { name: 'Light Blue', color: '#38bdf8' },
  { name: '#5F60EF', color: '#5F60EF' },
];

const GRADIENT_PRESETS = [
  { name: 'Blue Purple', from: '#4f46e5', to: '#818cf8' },
  { name: 'Pink Orange', from: '#ec4899', to: '#fb7185' },
  { name: 'Cyan Mint', from: '#22d3ee', to: '#7dd3fc' },
  { name: 'Sunset', from: '#f97316', to: '#facc15' },
  { name: 'Emerald', from: '#10b981', to: '#34d399' },
];

const DEFAULT_THEME = {
  mode: 'simple',
  primary: '#4f46e5',
  secondary: '#6366f1',
  customColor: '#4f46e5',
  gradientFrom: '#4f46e5',
  gradientTo: '#818cf8',
};

function hexToRgb(hex) {
  const normalized = hex.replace('#', '');
  const value = normalized.length === 3
    ? normalized.split('').map((char) => char + char).join('')
    : normalized;

  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return { r, g, b };
}

function rgbToHex({ r, g, b }) {
  const toHex = (value) => value.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function lightenHex(hex, amount = 0.15) {
  const rgb = hexToRgb(hex);
  const lighten = (value) => Math.min(255, Math.round(value + (255 - value) * amount));
  return rgbToHex({ r: lighten(rgb.r), g: lighten(rgb.g), b: lighten(rgb.b) });
}

function hexToRgba(hex, alpha = 0.16) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function applyPrimaryTheme(primary, secondary) {
  const root = document.documentElement;
  root.style.setProperty('--primary', primary);
  root.style.setProperty('--secondary', secondary);
  root.style.setProperty('--hover', hexToRgba(primary, 0.16));
}

function loadStoredTheme() {
  try {
    const stored = localStorage.getItem('admin_theme_settings');
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function storeTheme(theme) {
  try {
    localStorage.setItem('admin_theme_settings', JSON.stringify(theme));
  } catch {
    // ignore write errors
  }
}

function Theme() {
  const { 
    themeStyle, setThemeStyle, 
    globalPanelStyle, setGlobalPanelStyle,
    navbarBehavior, setNavbarBehavior, 
    contentLayout, setContentLayout,
    addNotification 
  } = useApp();
  
  const [localStyle, setLocalStyle] = useState(themeStyle);
  const [localPanelStyle, setLocalPanelStyle] = useState(globalPanelStyle);
  const [localNavbar, setLocalNavbar] = useState(navbarBehavior);
  const [localLayout, setLocalLayout] = useState(contentLayout);
  const [chatSizeEnabled, setChatSizeEnabled] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ai_chat_size_enabled')); } catch { return false; }
  });
  const [chatWidth, setChatWidth] = useState(() => {
    try { return parseInt(localStorage.getItem('ai_chat_width')) || 350; } catch { return 350; }
  });
  const [chatHeight, setChatHeight] = useState(() => {
    try { return parseInt(localStorage.getItem('ai_chat_height')) || 400; } catch { return 400; }
  });

  const handleSave = () => {
    setThemeStyle(localStyle);
    setGlobalPanelStyle(localPanelStyle);
    setNavbarBehavior(localNavbar);
    setContentLayout(localLayout);
    addNotification('Theme settings saved successfully!', 'success');
  };

  const storedTheme = loadStoredTheme();

  const [mode, setMode] = useState(storedTheme?.mode ?? DEFAULT_THEME.mode);
  const [primary, setPrimary] = useState(storedTheme?.primary ?? DEFAULT_THEME.primary);
  const [customColor, setCustomColor] = useState(storedTheme?.customColor ?? DEFAULT_THEME.customColor);
  const [selectedGradient, setSelectedGradient] = useState(() => {
    if (storedTheme?.mode === 'gradient') {
      return {
        from: storedTheme.primary ?? DEFAULT_THEME.primary,
        to: storedTheme.secondary ?? DEFAULT_THEME.secondary,
        name: storedTheme.gradientName ?? 'Custom',
      };
    }
    return GRADIENT_PRESETS[0];
  });
  const [gradientFrom, setGradientFrom] = useState(storedTheme?.gradientFrom ?? DEFAULT_THEME.gradientFrom);
  const [gradientTo, setGradientTo] = useState(storedTheme?.gradientTo ?? DEFAULT_THEME.gradientTo);

  const secondary = useMemo(() => {
    return mode === 'simple' ? lightenHex(primary, 0.22) : gradientTo;
  }, [mode, primary, gradientTo]);

  const handleSavePalette = () => {
    const primaryColor = mode === 'simple' ? primary : gradientFrom;
    applyPrimaryTheme(primaryColor, secondary);
    storeTheme({ 
      mode, 
      primary: primaryColor, 
      secondary, 
      customColor, 
      gradientFrom, 
      gradientTo, 
      gradientName: selectedGradient.name 
    });
    addNotification('Primary palette updated successfully!', 'success');
  };

  useEffect(() => {
    const primaryColor = mode === 'simple' ? primary : gradientFrom;
    applyPrimaryTheme(primaryColor, secondary);
  }, [mode, primary, secondary, customColor, gradientFrom, gradientTo]);

  const activeSimple = useMemo(() => {
    return SIMPLE_COLORS.find((option) => option.color.toLowerCase() === primary.toLowerCase());
  }, [primary]);

  const previewBackground = useMemo(() => {
    return mode === 'gradient'
      ? `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`
      : primary;
  }, [mode, primary, gradientFrom, gradientTo]);

  const handleSimpleColorSelect = (color) => {
    setMode('simple');
    setPrimary(color);
    setCustomColor(color);
  };

  const handleCustomColorChange = (color) => {
    setMode('simple');
    setCustomColor(color);
    setPrimary(color);
  };

  const handleGradientSelect = (gradient) => {
    setMode('gradient');
    setSelectedGradient(gradient);
    setGradientFrom(gradient.from);
    setGradientTo(gradient.to);
  };

  const handleGradientFromChange = (value) => {
    setMode('gradient');
    setGradientFrom(value);
    setSelectedGradient({ ...selectedGradient, from: value, name: 'Custom' });
  };

  const handleGradientToChange = (value) => {
    setMode('gradient');
    setGradientTo(value);
    setSelectedGradient({ ...selectedGradient, to: value, name: 'Custom' });
  };

  const resetTheme = () => {
    setMode(DEFAULT_THEME.mode);
    setPrimary(DEFAULT_THEME.primary);
    setCustomColor(DEFAULT_THEME.customColor);
    setGradientFrom(DEFAULT_THEME.gradientFrom);
    setGradientTo(DEFAULT_THEME.gradientTo);
    setSelectedGradient(GRADIENT_PRESETS[0]);
    applyPrimaryTheme(DEFAULT_THEME.primary, DEFAULT_THEME.secondary);
    storeTheme(DEFAULT_THEME);
  };

  return (
    <div className="theme-settings p-4">
      <div className="row ">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h3 className="mb-3">Theme Settings</h3>

              {/* Layout & Style Section */}
              <div className="mb-5">
                <h5 className="mb-3">Visual Style</h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Theme Style</label>
                    <select className="form-select" value={localStyle} onChange={(e) => setLocalStyle(e.target.value)}>
                      <option value="simple">Simple</option>
                      <option value="glassmorphism">Glassmorphism</option>
                      <option value="view-style">View Style (Navbar Only)</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Panel & Feature Style</label>
                    <select className="form-select" value={localPanelStyle} onChange={(e) => setLocalPanelStyle(e.target.value)}>
                      <option value="shadow">Default (Shadow Effect)</option>
                      <option value="bordered">Bordered (1px Border)</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Top Navbar</label>
                    <select className="form-select" value={localNavbar} onChange={(e) => setLocalNavbar(e.target.value)}>
                      <option value="sticky">Sticky</option>
                      <option value="static">Static</option>
                      <option value="hidden">Hidden</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Content Layout</label>
                    <select className="form-select" value={localLayout} onChange={(e) => setLocalLayout(e.target.value)}>
                      <option value="wide">Wide</option>
                      <option value="compact">Compact</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <button className="btn btn-primary px-4" onClick={handleSave}>Save Changes</button>
                </div>
              </div>

              <hr />

              <h5 className="mb-3">Primary Palette</h5>

              <p className="text-muted">Choose a primary palette for your admin UI. Simple colors set the main brand color. Gradient mode blends two accent tones for buttons, cards, and headers.</p>
            ...

              <div className="d-flex gap-2 mb-4">
                <button
                  type="button"
                  className={`btn ${mode === 'simple' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setMode('simple')}
                >
                  Simple color
                </button>
                <button
                  type="button"
                  className={`btn ${mode === 'gradient' ? 'btn-primary' : 'btn-outline-secondary'}`}
                  onClick={() => setMode('gradient')}
                >
                  Gradient color
                </button>
              </div>

              {mode === 'simple' ? (
                <>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Preset primary colors</label>
                    <div className="d-flex flex-wrap gap-3">
                      {SIMPLE_COLORS.map((option) => (
                        <button
                          key={option.name}
                          type="button"
                          className={`theme-swatch-btn btn ${activeSimple?.color === option.color ? 'border-primary border-3' : 'border'} rounded-circle p-0`}
                          style={{ width: 46, height: 46, backgroundColor: option.color }}
                          onClick={() => handleSimpleColorSelect(option.color)}
                          title={option.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Custom primary color</label>
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                      <input
                        type="color"
                        className="form-control form-control-color"
                        value={customColor}
                        onChange={(e) => handleCustomColorChange(e.target.value)}
                        title="Select custom primary color"
                        style={{ width: 70, height: 50, padding: 0, border: 'none' }}
                      />
                      <input
                        type="text"
                        className="form-control w-auto"
                        value={customColor}
                        onChange={(e) => handleCustomColorChange(e.target.value)}
                        placeholder="#5F60EF"
                        style={{ maxWidth: 160 }}
                      />
                    </div>
                    <small className="text-muted">Enter any hex code or use the color picker.</small>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Gradient presets</label>
                    <div className="d-flex flex-wrap gap-3">
                      {GRADIENT_PRESETS.map((gradient) => {
                        const isActive = selectedGradient.from === gradient.from && selectedGradient.to === gradient.to;
                        return (
                          <button
                            key={gradient.name}
                            type="button"
                            className={`theme-swatch-btn btn ${isActive ? 'border-primary border-3' : 'border'} rounded-4`}
                            style={{
                              minWidth: 88,
                              minHeight: 48,
                              background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
                            }}
                            onClick={() => handleGradientSelect(gradient)}
                            title={gradient.name}
                          />
                        );
                      })}
                    </div>
                  </div>

                  <div className="row gx-3 gy-3 align-items-center">
                    <div className="col-auto">
                      <label className="form-label fw-semibold">From</label>
                      <input
                        type="color"
                        className="form-control form-control-color"
                        value={gradientFrom}
                        onChange={(e) => handleGradientFromChange(e.target.value)}
                        title="Gradient start color"
                      />
                    </div>
                    <div className="col-auto">
                      <label className="form-label fw-semibold">To</label>
                      <input
                        type="color"
                        className="form-control form-control-color"
                        value={gradientTo}
                        onChange={(e) => handleGradientToChange(e.target.value)}
                        title="Gradient end color"
                      />
                    </div>
                    <div className="col">
                      <label className="form-label fw-semibold">Custom gradient</label>
                      <div className="form-text">Custom gradient uses both values to create a dynamic primary style.</div>
                    </div>
                  </div>
                </>
              )}

              <div className="mt-4">
                <button type="button" className="btn btn-primary px-4 py-2 rounded-3 shadow-sm" onClick={handleSavePalette}>
                  Save Palette Changes
                </button>
              </div>

              <hr />

              <h5 className="mb-3">AI Chatbot Size</h5>
              <p className="text-muted">Adjust the floating AI Copilot window dimensions.</p>

              <div className="mb-3">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <label className="form-label fw-semibold mb-0">Custom Size</label>
                  <EnableDisableButton
                    checked={chatSizeEnabled}
                    onClick={() => setChatSizeEnabled(!chatSizeEnabled)}
                    label="Custom Size"
                  />
                </div>
              </div>

              <div className="row g-4 mb-3">
                <div className="col-md-6">
                  <label className="form-label">Width: <strong>{chatWidth}px</strong></label>
                  <input
                    type="range"
                    className="form-range"
                    min="200"
                    max="800"
                    step="10"
                    value={chatWidth}
                    onChange={(e) => setChatWidth(parseInt(e.target.value))}
                  />
                  <div className="d-flex justify-content-between x-small text-muted">
                    <span>200px</span>
                    <span>800px</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Height: <strong>{chatHeight}px</strong></label>
                  <input
                    type="range"
                    className="form-range"
                    min="300"
                    max="800"
                    step="10"
                    value={chatHeight}
                    onChange={(e) => setChatHeight(parseInt(e.target.value))}
                  />
                  <div className="d-flex justify-content-between x-small text-muted">
                    <span>300px</span>
                    <span>800px</span>
                  </div>
                </div>
              </div>

              <div className="mt-2 mb-3">
                <button
                  className="btn btn-primary px-4 py-2 rounded-3 shadow-sm"
                  onClick={() => {
                    localStorage.setItem('ai_chat_size_enabled', JSON.stringify(chatSizeEnabled));
                    localStorage.setItem('ai_chat_width', String(chatWidth));
                    localStorage.setItem('ai_chat_height', String(chatHeight));
                    window.dispatchEvent(new CustomEvent('ai-chatbot-size-change', {
                      detail: {
                        enabled: chatSizeEnabled,
                        width: chatWidth,
                        height: chatHeight,
                      },
                    }));
                    addNotification('AI Chatbot size settings saved!', 'success');
                  }}
                >
                  Save Chatbot Settings
                </button>
              </div>

              <div className="mt-4 pt-3 border-top">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div>
                    <h5 className="mb-1">Preview</h5>
                    <p className="text-muted mb-0">The selected theme will update all primary UI elements, buttons, headers, and accents.</p>
                  </div>
                  <button type="button" className="btn btn-outline-secondary" onClick={resetTheme}>
                    Reset to default
                  </button>
                </div>

                <div className="mt-3 rounded-4 border overflow-hidden" style={{ minHeight: 180, background: previewBackground }}>
                  <div className="p-4" style={{ background: 'rgba(255,255,255,0.9)' }}>
                    <h4 className="mb-2" style={{ color: mode === 'gradient' ? secondary : primary }}>Primary theme preview</h4>
                    <p className="mb-3 text-muted">Your admin interface will use this primary palette for controls, active states, and highlights.</p>
                    <div className="d-flex gap-2 flex-wrap">
                      <span className="badge bg-primary">Primary</span>
                      <span className="badge bg-secondary">Secondary</span>
                      <span className="badge bg-light text-dark">Light</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

         <div className="col-lg-4">
          <div className="card border-0 shadow-sm p-4 h-100">
            <div className="mb-3">
              <h5 className="mb-1">Current selection</h5>
              <p className="text-muted small mb-0">Mode: <strong>{mode === 'simple' ? 'Simple color' : 'Gradient color'}</strong></p>
            </div>
            <div className="mb-3">
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle border" style={{ width: 46, height: 46, background: primary }} />
                <div>
                  <div className="text-secondary small">Primary color</div>
                  <div className="fw-semibold">{primary.toUpperCase()}</div>
                </div>
              </div>
            </div>
            <div>
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle border" style={{ width: 46, height: 46, background: secondary }} />
                <div>
                  <div className="text-secondary small">Secondary accent</div>
                  <div className="fw-semibold">{secondary.toUpperCase()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
       
      </div>
      
    </div>
  )
  
}

export default Theme;
