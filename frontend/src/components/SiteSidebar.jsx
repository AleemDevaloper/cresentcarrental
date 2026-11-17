import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Facebook,
  Instagram,
  LayoutGrid,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import brand from '../config/brandConfig';
import { trackEvent } from '../services/analytics';

const primaryLinks = [
  ['/', 'Home'],
  ['/cars', 'Fleet'],
  ['/services', 'Services'],
  ['/locations', 'Locations'],
  ['/offers', 'Offers'],
  ['/gallery', 'Gallery'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

const secondaryLinks = [
  ['/pricing', 'Pricing'],
  ['/reviews', 'Reviews'],
  ['/faq', 'FAQs'],
  ['/blog', 'Journal'],
  ['/rental-requirements', 'Rental requirements'],
  ['/corporate-car-rental', 'Corporate rentals'],
  ['/monthly-car-rental', 'Monthly plans'],
  ['/airport-transfer', 'Airport transfers'],
];

export default function SiteSidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const openSidebar = () => setOpen(true);
    window.addEventListener('crescent:open-sidebar', openSidebar);
    return () => window.removeEventListener('crescent:open-sidebar', openSidebar);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        className={`sidebar-trigger ${open ? 'is-hidden' : ''}`}
        onClick={() => setOpen(true)}
        aria-label="Open site navigation"
        aria-expanded={open}
        aria-controls="site-sidebar"
      >
        <span className="sidebar-trigger-icon"><LayoutGrid size={17} /></span>
        <span className="sidebar-trigger-label">Explore</span>
        <span className="sidebar-trigger-pulse" aria-hidden="true" />
      </button>

      <div id="site-sidebar" className={`site-sidebar ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <button type="button" className="sidebar-backdrop" onClick={close} tabIndex={open ? 0 : -1} aria-label="Close navigation" />
        <aside className="sidebar-panel" role="dialog" aria-modal="true" aria-label="Crescent site navigation">
          <div className="sidebar-grid" aria-hidden="true" />
          <div className="sidebar-glow" aria-hidden="true" />
          <div className="sidebar-scan" aria-hidden="true" />

          <header className="sidebar-head">
            <Link to="/" className="sidebar-brand" onClick={close} aria-label="Crescent Car Rental home">
              <img src={brand.logoLight} alt="Crescent Car Rental" width="666" height="375" loading="lazy" decoding="async" />
            </Link>
            <button type="button" className="sidebar-close" onClick={close} aria-label="Close navigation">
              <X size={19} />
            </button>
          </header>

          <div className="sidebar-status">
            <span className="sidebar-status-dot" aria-hidden="true" />
            <span>Concierge online</span>
            <em>Lahore · 24/7</em>
          </div>

          <div className="sidebar-scroll">
            <span className="sidebar-kicker"><Sparkles size={12} /> Navigation deck</span>
            <nav className="sidebar-primary" aria-label="Main navigation">
              {primaryLinks.map(([to, label], index) => (
                <NavLink key={to} to={to} onClick={close} className={({ isActive }) => (isActive ? 'active' : '')}>
                  <span className="sidebar-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="sidebar-link-label">{label}</span>
                  <ArrowUpRight size={15} />
                </NavLink>
              ))}
            </nav>

            <span className="sidebar-kicker sidebar-kicker--sub">More from Crescent</span>
            <nav className="sidebar-secondary" aria-label="Secondary navigation">
              {secondaryLinks.map(([to, label]) => (
                <NavLink key={to} to={to} onClick={close}>
                  <span>{label}</span>
                  <ArrowUpRight size={13} />
                </NavLink>
              ))}
            </nav>

            <div className="sidebar-actions">
              <Link to="/book" className="sidebar-action sidebar-action--primary" onClick={() => { trackEvent('cta_click', { target_label: 'Sidebar book now', target_href: '/book' }); close(); }}>
                <CalendarDays size={18} />
                <span><strong>Book your ride</strong><small>Pick a car and dates in under a minute.</small></span>
                <ArrowUpRight size={16} />
              </Link>
              <a href={brand.phoneHref} className="sidebar-action" onClick={() => trackEvent('phone_click', { target_label: 'Sidebar call' })}>
                <Phone size={18} />
                <span><strong>Call the concierge</strong><small>{brand.phoneDisplay}</small></span>
                <ArrowUpRight size={16} />
              </a>
              <a href={`https://wa.me/${brand.whatsappNumber}`} target="_blank" rel="noreferrer" className="sidebar-action" onClick={() => trackEvent('whatsapp_click', { target_label: 'Sidebar WhatsApp' })}>
                <MessageCircle size={18} />
                <span><strong>Chat on WhatsApp</strong><small>Fast answers, real people.</small></span>
                <ArrowUpRight size={16} />
              </a>
            </div>

            <div className="sidebar-assurance">
              <ShieldCheck size={16} />
              <p><strong>Clear pricing. Verified cars.</strong> Every reservation is checked against live availability and confirmed by our team.</p>
            </div>
          </div>

          <footer className="sidebar-foot">
            <div className="sidebar-foot-row">
              <span><MapPin size={13} /> {brand.addressShort}</span>
              <span><Clock3 size={13} /> {brand.hours}</span>
            </div>
            <div className="sidebar-socials">
              {brand.socialLinks.facebook && (
                <a href={brand.socialLinks.facebook} target="_blank" rel="noreferrer" aria-label="Crescent on Facebook"><Facebook size={15} /></a>
              )}
              {brand.socialLinks.instagram && (
                <a href={brand.socialLinks.instagram} target="_blank" rel="noreferrer" aria-label="Crescent on Instagram"><Instagram size={15} /></a>
              )}
              <span>Crescent Mobility Network</span>
            </div>
          </footer>
        </aside>
      </div>
    </>
  );
}
