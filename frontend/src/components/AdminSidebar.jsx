import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarCheck, Car, Users, MessageSquare, MapPin,
  BadgeDollarSign, PanelsTopLeft, FileText, Image, Star, CircleHelp,
  Search, Bell, BarChart3, Settings, UserCog, History, LogOut, Activity,
  ChevronDown, Menu, X, ChevronLeft, Tags, Layers, Ticket, Megaphone
} from 'lucide-react';
import api from '../services/api';
import brand from '../config/brandConfig';

const sections = [
  {
    label: 'Overview',
    items: [
      ['/admin', 'Dashboard', LayoutDashboard],
    ],
  },
  {
    label: 'Operations',
    items: [
      ['/admin/bookings', 'Bookings', CalendarCheck],
      ['/admin/vehicles', 'Fleet', Car],
      ['/admin/customers', 'Customers', Users],
      ['/admin/contacts', 'Contacts', MessageSquare],
      ['/admin/leads', 'Leads', Megaphone],
    ],
  },
  {
    label: 'Content',
    items: [
      ['/admin/services', 'Services', PanelsTopLeft],
      ['/admin/locations', 'Locations', MapPin],
      ['/admin/homepage', 'Homepage Content', PanelsTopLeft],
      ['/admin/blog', 'Blog', FileText],
      ['/admin/media', 'Media Library', Image],
    ],
  },
  {
    label: 'Fleet Management',
    items: [
      ['/admin/brands', 'Brands', Tags],
      ['/admin/categories', 'Categories', Layers],
      ['/admin/features', 'Features', Star],
      ['/admin/discounts', 'Discounts', Ticket],
    ],
  },
  {
    label: 'Growth',
    items: [
      ['/admin/reviews', 'Reviews', Star],
      ['/admin/faqs', 'FAQ', CircleHelp],
      ['/admin/pricing', 'Pricing', BadgeDollarSign],
      ['/admin/seo', 'SEO', Search],
    ],
  },
  {
    label: 'System',
    items: [
      ['/admin/notifications', 'Notifications', Bell],
      ['/admin/reports', 'Reports', BarChart3],
      ['/admin/analytics', 'Website Analytics', Activity],
      ['/admin/users', 'Admin Users', UserCog],
      ['/admin/activity', 'Activity Logs', History],
      ['/admin/settings', 'Settings', Settings],
    ],
  },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState(() => {
    const map = {};
    sections.forEach((s) => { map[s.label] = true; });
    return map;
  });

  useEffect(() => {
    const toggle = () => setMobileOpen((open) => !open);
    window.addEventListener('crescent:toggle-admin-sidebar', toggle);
    return () => window.removeEventListener('crescent:toggle-admin-sidebar', toggle);
  }, []);

  const toggleSection = (label) => {
    setExpandedSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const logout = async () => {
    try { await api.post('/admin/logout'); } catch {}
    localStorage.removeItem('crescent_admin_token');
    sessionStorage.removeItem('crescent_admin_token');
    navigate('/admin/login');
  };

  const sidebarContent = (
    <>
      <div className={`admin-brand ${collapsed ? 'is-collapsed' : ''}`}>
        <img src={brand.logoDark} alt="Crescent" width="666" height="375" decoding="async" />
        {!collapsed && <span>Management</span>}
      </div>

      <nav className="admin-nav">
        {sections.map((section) => (
          <div key={section.label} className="admin-nav-section">
            {!collapsed && (
              <button
                className="admin-nav-section-toggle"
                onClick={() => toggleSection(section.label)}
                aria-expanded={expandedSections[section.label]}
              >
                <span>{section.label}</span>
                <ChevronDown
                  size={14}
                  className={expandedSections[section.label] ? 'rotated' : ''}
                />
              </button>
            )}
            {expandedSections[section.label] && (
              <div className="admin-nav-items">
                {section.items.map(([to, label, Icon]) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/admin'}
                    className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                    title={collapsed ? label : undefined}
                    onClick={() => setMobileOpen(false)}
                  >
                    <Icon size={18} />
                    {!collapsed && <span>{label}</span>}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        {!collapsed && (
          <button className="admin-nav-link" onClick={logout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        )}
        {collapsed && (
          <button className="admin-nav-link admin-nav-link--icon" onClick={logout} title="Logout">
            <LogOut size={18} />
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      <button
        className="admin-mobile-toggle"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle sidebar"
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {mobileOpen && (
        <div className="admin-sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`admin-sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-mobile-open' : ''}`}>
        {sidebarContent}
        <button
          className="admin-sidebar-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft size={16} className={collapsed ? 'rotated' : ''} />
        </button>
      </aside>
    </>
  );
}
