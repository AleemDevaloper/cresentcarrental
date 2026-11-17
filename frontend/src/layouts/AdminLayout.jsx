import { Outlet, useLocation } from 'react-router-dom';
import { Bell, Menu } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import SeoHead from '../components/SeoHead';

export default function AdminLayout() {
  const location = useLocation();
  const section = location.pathname === '/admin' ? 'Overview' : location.pathname.split('/')[2]?.replaceAll('-', ' ') || 'Operations';

  return (
    <div className="admin-shell">
      <SeoHead title="Admin | Crescent Car Rental" noindex />
      <AdminSidebar />
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-brand">
            <button className="admin-topbar-menu" type="button" onClick={() => window.dispatchEvent(new Event('crescent:toggle-admin-sidebar'))} aria-label="Open admin navigation">
              <Menu size={19} />
            </button>
            <div>
              <span className="eyebrow">Crescent Operations</span>
              <strong>Car Rental Management</strong>
            </div>
          </div>
          <div className="admin-topbar-actions">
            <span className="admin-breadcrumb-label">Workspace / <strong>{section}</strong></span>
            <button className="admin-topbar-icon" type="button" aria-label="Notifications"><Bell size={17} /></button>
            <div className="admin-avatar" title="Crescent administrator">CR</div>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
