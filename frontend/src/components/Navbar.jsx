import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Phone, X, ChevronDown, LayoutGrid } from 'lucide-react';
import brand from '../config/brandConfig';
import Button from './Button';
import { trackEvent } from '../services/analytics';

const links = [
  ['/', 'Home'],
  ['/cars', 'Cars'],
  ['/services', 'Services'],
  ['/offers', 'Offers'],
  ['/locations', 'Locations'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

const moreLinks = [
  ['/pricing', 'Pricing'],
  ['/reviews', 'Reviews'],
  ['/faq', 'FAQs'],
  ['/rental-requirements', 'Rental Requirements'],
  ['/blog', 'Blog'],
  ['/gallery', 'Gallery'],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) setMoreOpen(false);
  }, [open]);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container-xxl nav-shell">
        <Link to="/" className="brand-link" aria-label="Crescent Car Rental home">
          <img src={brand.logoDark} alt="Crescent Car Rental" width="666" height="375" decoding="async" fetchPriority="high" />
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {label}
            </NavLink>
          ))}
          <div className={`nav-more ${moreOpen ? 'is-open' : ''}`}>
            <button type="button" className="nav-more-toggle" onClick={() => setMoreOpen(!moreOpen)} aria-expanded={moreOpen}>
              More <ChevronDown size={14} />
            </button>
            {moreOpen && (
              <div className="nav-more-menu">
                {moreLinks.map(([to, label]) => (
                  <NavLink key={to} to={to} onClick={() => setMoreOpen(false)}>
                    {label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </nav>
        <div className="nav-actions">
          <button type="button" className="nav-explore" onClick={() => window.dispatchEvent(new Event('crescent:open-sidebar'))} aria-label="Open explore menu">
            <LayoutGrid size={16} />
            <span>Explore</span>
          </button>
          <a className="nav-phone" href={brand.phoneHref} onClick={() => trackEvent('phone_click')}>
            <Phone size={17} />
            <span>{brand.phoneDisplay}</span>
          </a>
          <Button as="link" to="/book" variant="red" size="sm" magnetic>
            Book Now
          </Button>
          <button className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-menu">
          <button
            type="button"
            className="mobile-menu-explore"
            onClick={() => {
              setOpen(false);
              window.dispatchEvent(new Event('crescent:open-sidebar'));
            }}
          >
            <LayoutGrid size={16} /> Open explore deck
          </button>
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)}>
              {label}
            </NavLink>
          ))}
          <div className="mobile-menu-divider">More</div>
          {moreLinks.map(([to, label]) => (
            <NavLink key={to} to={to} onClick={() => setOpen(false)} className="mobile-menu-secondary">
              {label}
            </NavLink>
          ))}
          <Button as="link" to="/book" variant="red" onClick={() => setOpen(false)}>
            Book Your Ride
          </Button>
        </div>
      )}
    </header>
  );
}
