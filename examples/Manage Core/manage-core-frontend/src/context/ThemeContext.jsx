import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';

export const ThemeContext = createContext(null);

export const useThemeContext = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeContext must be used within ThemeProvider');
  return ctx;
};

const applyThemeMode = (mode) => {
  const safeMode = mode === 'dark' ? 'dark' : 'light';
  document.documentElement.classList.remove('light-mode', 'dark-mode');
  document.documentElement.classList.add(safeMode === 'dark' ? 'dark-mode' : 'light-mode');
  document.documentElement.setAttribute('data-bs-theme', safeMode);
  document.body?.classList.remove('light-mode', 'dark-mode');
  document.body?.classList.add(safeMode === 'dark' ? 'dark-mode' : 'light-mode');
};

const DEFAULT_SIDEBAR_THEME = {
  mode: 'simple', customColor: '#ffffff', gradientFrom: '#4f46e5', gradientTo: '#818cf8',
  semiDark: false, darkSidebarEnabled: false, darkSidebarBg: '#0F172A', darkSidebarText: '#f8fafc',
  sidebarIconColor: '#4F46E5', sidebarSemiDarkIconColor: '#ffffff', sidebarDarkIconColor: '#818cf8',
  sidebarHoverIconColor: '#ffffff', sidebarLabelColor: '#6c757d', sidebarFontSize: '14',
  sidebarLabelFontSize: '11', sidebarButtonMode: 'simple', sidebarButtonBg: '#ffffff',
  sidebarButtonAlpha: 0, sidebarButtonText: '#000000', sidebarGradientFrom: '#38bdf8',
  sidebarGradientTo: '#60a5fa', sidebarSelectedGradient: { from: '#38bdf8', to: '#60a5fa', name: 'Sky Blue Light Blue' },
  sidebarButtonHoverMode: 'gradient', sidebarButtonHoverColor: '#ffffff', sidebarButtonHoverAlpha: 0.4,
  sidebarButtonHoverText: '#ffffff', sidebarButtonHoverGradientFrom: '#38bdf8',
  sidebarButtonHoverGradientTo: '#60a5fa', sidebarSelectedHoverGradient: { from: '#38bdf8', to: '#60a5fa', name: 'Sky Blue Light Blue' },
  sidebarButtonBorderEnabled: true, sidebarButtonBorderWidth: '0.5', sidebarButtonBorderColor: '#e5e7eb',
  sidebarWidth: '260', sidebarWidthEnabled: false,
};

function getBrightness(hex) {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return 255;
  const s = hex.replace('#', '');
  const n = s.length === 3 ? s.split('').map(c => c + c).join('') : s;
  const r = parseInt(n.slice(0, 2), 16), g = parseInt(n.slice(2, 4), 16), b = parseInt(n.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

function getContrastText(hex) { return getBrightness(hex) < 150 ? '#ffffff' : '#111827'; }

function hexToRgba(hex, alpha = 1) {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return hex;
  const s = hex.replace('#', '');
  const n = s.length === 3 ? s.split('').map(c => c + c).join('') : s;
  const r = parseInt(n.slice(0, 2), 16), g = parseInt(n.slice(2, 4), 16), b = parseInt(n.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [themeStyle, setThemeStyle] = useState(() => localStorage.getItem('themeStyle') || 'simple');
  const [globalPanelStyle, setGlobalPanelStyle] = useState(() => localStorage.getItem('globalPanelStyle') || 'shadow');
  const [navbarBehavior, setNavbarBehavior] = useState(() => localStorage.getItem('navbarBehavior') || 'sticky');
  const [contentLayout, setContentLayout] = useState(() => localStorage.getItem('contentLayout') || 'wide');
  const [navbarSettings, setNavbarSettings] = useState(() => {
    const defaults = { showTime: true, showThemeToggle: true, showNotifications: true, showSystems: true, showLanguage: true };
    const saved = localStorage.getItem('navbar_visibility_settings');
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  });
  const [language, setLanguage] = useState(() => localStorage.getItem('app_language') || 'English');
  const [aiCopilotEnabled, setAiCopilotEnabled] = useState(() => {
    const saved = localStorage.getItem('ai_copilot_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [frontTabFlyoverEnabled, setFrontTabFlyoverEnabled] = useState(() => {
    const saved = localStorage.getItem('front_tab_flyover_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const initialised = useRef(false);

  useEffect(() => {
    if (initialised.current) return;
    initialised.current = true;
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const initial = saved === 'dark' || saved === 'light' ? saved : (prefersDark ? 'dark' : 'light');
    setTheme(initial);
    applyThemeMode(initial);

    try {
      const stored = localStorage.getItem('admin_sidebar_theme_settings');
      if (stored) applySidebarTheme(JSON.parse(stored));
      else applySidebarTheme(DEFAULT_SIDEBAR_THEME);
    } catch (e) { console.error('Failed to load sidebar theme:', e); }

    try {
      const stored = localStorage.getItem('admin_theme_settings');
      if (stored) {
        const { primary, secondary } = JSON.parse(stored);
        if (primary && secondary) applyPrimaryTheme(primary, secondary);
      }
    } catch (e) { console.error('Failed to load primary theme:', e); }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    applyThemeMode(theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('themeStyle', themeStyle);
    localStorage.setItem('globalPanelStyle', globalPanelStyle);
    localStorage.setItem('navbarBehavior', navbarBehavior);
    localStorage.setItem('contentLayout', contentLayout);
  }, [themeStyle, globalPanelStyle, navbarBehavior, contentLayout]);

  useEffect(() => {
    localStorage.setItem('navbar_visibility_settings', JSON.stringify(navbarSettings));
  }, [navbarSettings]);

  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('ai_copilot_enabled', JSON.stringify(aiCopilotEnabled));
  }, [aiCopilotEnabled]);

  useEffect(() => {
    localStorage.setItem('front_tab_flyover_enabled', JSON.stringify(frontTabFlyoverEnabled));
  }, [frontTabFlyoverEnabled]);

  const toggleTheme = useCallback(() => setTheme(prev => (prev === 'dark' ? 'light' : 'dark')), []);
  const settingtheme = useCallback((newTheme) => setTheme(newTheme), []);

  const applySidebarTheme = useCallback((settings) => {
    if (!settings) return;
    const root = document.documentElement;
    const {
      mode, semiDark, customColor, gradientFrom, gradientTo,
      darkSidebarEnabled, darkSidebarBg, darkSidebarText,
      sidebarButtonBg, sidebarButtonText, sidebarButtonAlpha,
      sidebarButtonHoverColor, sidebarButtonHoverAlpha, sidebarButtonHoverText,
      sidebarIconColor, sidebarSemiDarkIconColor, sidebarDarkIconColor,
      sidebarLabelColor, sidebarFontSize, sidebarLabelFontSize,
      sidebarButtonMode, sidebarGradientFrom, sidebarGradientTo,
      sidebarButtonHoverMode, sidebarButtonHoverGradientFrom, sidebarButtonHoverGradientTo,
      sidebarButtonBorderEnabled, sidebarButtonBorderWidth, sidebarButtonBorderColor,
      sidebarWidth, sidebarWidthEnabled,
    } = settings;

    const lightBg = !semiDark ? '#ffffff' : (mode === 'simple' ? customColor : `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`);
    const lightText = !semiDark ? '#111827' : (mode === 'simple' ? getContrastText(customColor) : '#ffffff');
    const lightBorder = !semiDark ? '#e5e7eb' : (mode === 'simple' ? '#d1d5db' : '#ffffff33');
    const buttonBgFinal = sidebarButtonMode === 'simple' ? hexToRgba(sidebarButtonBg, sidebarButtonAlpha) : `linear-gradient(135deg, ${hexToRgba(sidebarGradientFrom, sidebarButtonAlpha)}, ${hexToRgba(sidebarGradientTo, sidebarButtonAlpha)})`;
    const buttonHoverFinal = sidebarButtonHoverMode === 'simple' ? hexToRgba(sidebarButtonHoverColor, sidebarButtonHoverAlpha) : `linear-gradient(135deg, ${hexToRgba(sidebarButtonHoverGradientFrom, sidebarButtonHoverAlpha)}, ${hexToRgba(sidebarButtonHoverGradientTo, sidebarButtonHoverAlpha)})`;
    const darkBgFinal = darkSidebarEnabled ? darkSidebarBg : '#0F172A';
    const darkTextFinal = darkSidebarEnabled ? darkSidebarText : '#f8fafc';

    root.style.setProperty('--sidebar-bg', lightBg);
    root.style.setProperty('--sidebar-text', lightText);
    root.style.setProperty('--sidebar-border', lightBorder);
    root.style.setProperty('--sidebar-dark-bg', darkBgFinal);
    root.style.setProperty('--sidebar-dark-text', darkTextFinal);
    root.style.setProperty('--sidebar-dark-border', darkSidebarEnabled ? '#ffffff22' : '#334155');
    root.style.setProperty('--sidebar-button-bg', buttonBgFinal);
    root.style.setProperty('--sidebar-button-text', sidebarButtonText);
    root.style.setProperty('--sidebar-button-hover', buttonHoverFinal);
    root.style.setProperty('--sidebar-button-hover-text', sidebarButtonHoverText);
    root.style.setProperty('--sidebar-icon-color', sidebarIconColor);
    root.style.setProperty('--sidebar-semi-dark-icon-color', sidebarSemiDarkIconColor);
    root.style.setProperty('--sidebar-dark-icon-color', sidebarDarkIconColor);
    root.style.setProperty('--sidebar-hover-icon-color', settings.sidebarHoverIconColor || sidebarButtonHoverText);
    root.style.setProperty('--sidebar-label-color', sidebarLabelColor);
    root.style.setProperty('--sidebar-font-size', (sidebarFontSize || 14) + 'px');
    root.style.setProperty('--sidebar-label-font-size', (sidebarLabelFontSize || 11) + 'px');
    root.style.setProperty('--sidebar-button-border-width', (sidebarButtonBorderWidth || 0.5) + 'px');
    root.style.setProperty('--sidebar-button-border-color', sidebarButtonBorderEnabled ? (sidebarButtonBorderColor || 'transparent') : 'transparent');

    if (sidebarWidthEnabled) {
      root.style.setProperty('--sidebar-width', (sidebarWidth || 260) + 'px');
    } else {
      root.style.removeProperty('--sidebar-width');
    }

    if (globalPanelStyle === 'bordered') {
      root.style.setProperty('--panel-shadow', 'none');
      root.style.setProperty('--panel-shadow-hover', 'none');
      root.style.setProperty('--panel-border', '1px solid var(--border)');
    } else {
      root.style.setProperty('--panel-shadow', 'var(--shadow)');
      root.style.setProperty('--panel-shadow-hover', 'var(--shadow-lg)');
      root.style.setProperty('--panel-border', '1px solid transparent');
    }

    if (semiDark) root.setAttribute('data-sidebar-style', 'semi-dark');
    else root.removeAttribute('data-sidebar-style');
  }, [globalPanelStyle]);

  const applyPrimaryTheme = useCallback((primary, secondary) => {
    const root = document.documentElement;
    root.style.setProperty('--primary', primary);
    root.style.setProperty('--secondary', secondary);
    if (primary && primary.startsWith('#')) {
      const n = primary.replace('#', '');
      const hex = n.length === 3 ? n.split('').map(c => c + c).join('') : n;
      const r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
      root.style.setProperty('--hover', `rgba(${r}, ${g}, ${b}, 0.16)`);
    }
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('admin_sidebar_theme_settings');
      if (stored) applySidebarTheme(JSON.parse(stored));
      else applySidebarTheme(DEFAULT_SIDEBAR_THEME);
    } catch (e) { console.error('Failed to load sidebar theme:', e); }
  }, [globalPanelStyle, applySidebarTheme]);

  const value = useMemo(() => ({
    theme, setTheme, toggleTheme, settingtheme, themeStyle, setThemeStyle,
    globalPanelStyle, setGlobalPanelStyle, navbarBehavior, setNavbarBehavior,
    contentLayout, setContentLayout, navbarSettings, setNavbarSettings,
    language, setLanguage, aiCopilotEnabled, setAiCopilotEnabled,
    isSidebarOpen, setIsSidebarOpen, frontTabFlyoverEnabled, setFrontTabFlyoverEnabled,
    applySidebarTheme, DEFAULT_SIDEBAR_THEME,
  }), [
    theme, themeStyle, globalPanelStyle, navbarBehavior, contentLayout,
    navbarSettings, language, aiCopilotEnabled, isSidebarOpen, frontTabFlyoverEnabled,
    toggleTheme, settingtheme, applySidebarTheme,
  ]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
