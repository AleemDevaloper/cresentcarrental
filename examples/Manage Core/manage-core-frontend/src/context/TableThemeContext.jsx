import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

export const TABLE_THEMES = [
  {
    id: 'aurora',
    name: 'Aurora',
    accent: '#6366f1',
    tagline: 'Glassy Gradient',
    description: 'Frosted glass wrapper, indigo gradient header and rows that slide forward with a glowing left accent on hover.',
  },
  {
    id: 'cobalt',
    name: 'Cobalt',
    accent: '#2563eb',
    tagline: 'Enterprise Minimal',
    description: 'Clean solid header, letter-spaced labels, quiet separators — a focused, corporate list with blue row highlight.',
  },
  {
    id: 'emerald',
    name: 'Emerald',
    accent: '#059669',
    tagline: 'Floating Tiles',
    description: 'Every row is a floating rounded tile with its own shadow and airy gaps on a soft green tray — a premium kanban feel.',
  },
  {
    id: 'royal',
    name: 'Royal',
    accent: '#d4a017',
    tagline: 'Luxury Trim',
    description: 'Regal violet header with a thin gold underline and a gold-fade hover sweep across each row.',
  },
  {
    id: 'obsidian',
    name: 'Obsidian',
    accent: '#22d3ee',
    tagline: 'Dark Executive',
    description: 'Near-black terminal with monospace headers, a cyan inner glow and an inset cyan edge lighting rows on hover.',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    accent: '#2563eb',
    tagline: 'Spreadsheet Grid',
    description: 'A crisp accounting grid — every cell outlined, dense rows, solid blue header and a blue first-column keyline.',
  },
  {
    id: 'mist',
    name: 'Mist',
    accent: '#64748b',
    tagline: 'Ultra Minimal',
    description: 'The quiet one — no colors, no stripes, just thin dividers, tiny letter-spaced labels and a whisper of hover.',
  },
  {
    id: 'ivory',
    name: 'Ivory',
    accent: '#b45309',
    tagline: 'Warm & Soft',
    description: 'A warm cream palette with a honey header, soft tinted stripes and a caramel left-edge hover.',
  },
  {
    id: 'neon',
    name: 'Neon',
    accent: '#22d3ee',
    tagline: 'Futuristic Glow',
    description: 'A dark-only synthwave panel — magenta-to-violet header, cyan neon edging and a text glow on every hover.',
  },
  {
    id: 'dusk',
    name: 'Dusk',
    accent: '#f43f5e',
    tagline: 'Sunset Gradient',
    description: 'A rose-to-orange sunset header with generous rounded corners and warm blushing stripes.',
  },
  {
    id: 'platinum',
    name: 'Platinum',
    accent: '#64748b',
    tagline: 'Metallic Executive',
    description: 'A polished silver-gradient header, cool slate rows and rows that gently lift with a soft shadow.',
  },
  {
    id: 'midnight',
    name: 'Midnight',
    accent: '#818cf8',
    tagline: 'Deep Night Premium',
    description: 'A dark indigo night-sky panel with a royal-blue header, glowing indigo hover and a subtle inner halo.',
  },
];

export const TableThemeContext = createContext(null);

export const useTableTheme = () => {
  const ctx = useContext(TableThemeContext);
  if (!ctx) throw new Error('useTableTheme must be used within TableThemeProvider');
  return ctx;
};

export const TableThemeProvider = ({ children }) => {
  const [themeId, setThemeId] = useState(() => {
    const saved = localStorage.getItem('mc.tableTheme');
    return TABLE_THEMES.some(t => t.id === saved) ? saved : TABLE_THEMES[0].id;
  });

  useEffect(() => {
    localStorage.setItem('mc.tableTheme', themeId);
    document.body.dataset.mcTheme = themeId;
  }, [themeId]);

  const setTheme = useCallback((id) => {
    setThemeId(TABLE_THEMES.some(t => t.id === id) ? id : TABLE_THEMES[0].id);
  }, []);

  const value = useMemo(() => ({
    themeId,
    theme: TABLE_THEMES.find(t => t.id === themeId) || TABLE_THEMES[0],
    themes: TABLE_THEMES,
    setTheme,
  }), [themeId, setTheme]);

  return (
    <TableThemeContext.Provider value={value}>
      {children}
    </TableThemeContext.Provider>
  );
};
