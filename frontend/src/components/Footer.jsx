import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Phone, Mail, MapPin, ArrowRight, Clock3 } from 'lucide-react';
import brand from '../config/brandConfig';
import WhatsAppButton from './WhatsAppButton';
import Button from './Button';
import { Reveal } from '../animation';

const wordmarkChars = 'CRESCENT'.split('');

export default function Footer() {
  const socials = [
    ['Facebook', brand.socialLinks.facebook, Facebook],
    ['Instagram', brand.socialLinks.instagram, Instagram],
    ['YouTube', brand.socialLinks.youtube, Youtube],
  ].filter(([, href]) => href);

  return (
    <footer className="site-footer">
      <div className="container-xxl footer-cta px-4">
        <Reveal anim="left">
          <span className="eyebrow">Crescent Car Rental</span>
          <h2>Drive your next story with a fleet built for the moment.</h2>
        </Reveal>
        <Reveal anim="right">
          <Button as="link" to="/book" variant="red" size="lg" magnetic>
            Book Your Ride <ArrowRight size={18} />
          </Button>
        </Reveal>
      </div>

      <div className="container-xxl footer-glow-wrap" aria-hidden="true">
        <span className="footer-fog footer-fog--one" />
        <span className="footer-fog footer-fog--two" />
        <div className="footer-word-rail"><span /></div>
        <div className="footer-glow-word" role="img" aria-label="Crescent">
          {wordmarkChars.map((char, index) => (
            <span key={`${char}-${index}`} style={{ animationDelay: `${index * 0.16}s` }}>
              {char}
            </span>
          ))}
        </div>
      </div>

      <div className="container-xxl footer-grid pt-5">
        <div className="footer-brand">
          <img src={brand.logoDark} alt="Crescent Car Rental" width="666" height="375" loading="lazy" decoding="async" />
          <p>{brand.tagline}</p>
          <p className="muted">Premium cars for every journey — rent a car in Lahore, Islamabad and across Pakistan with transparent rates and fast booking support.</p>
        </div>
        <div>
          <h5>Quick links</h5>
          <Link to="/cars">Our Cars</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/about">About</Link>
          <Link to="/reviews">Reviews</Link>
          <Link to="/faq">FAQs</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/gallery">Gallery</Link>
        </div>
        <div>
          <h5>Services</h5>
          <Link to="/services/daily-car-rental">Daily Rental</Link>
          <Link to="/monthly-car-rental">Monthly Rental</Link>
          <Link to="/airport-transfer">Airport Transfer</Link>
          <Link to="/wedding-car-rental">Wedding Cars</Link>
          <Link to="/self-drive-car-rental">Self Drive</Link>
          <Link to="/corporate-car-rental">Corporate Rental</Link>
          <Link to="/chauffeur-service">Chauffeur Service</Link>
          <Link to="/outstation-car-rental">Outstation</Link>
        </div>
        <div>
          <h5>Contact</h5>
          <a href={brand.phoneHref}><Phone size={16} /> {brand.phoneDisplay}</a>
          <a href={`mailto:${brand.email}`}><Mail size={16} /> {brand.email}</a>
          <span><MapPin size={16} /> {brand.addressShort}</span>
          <span><Clock3 size={16} /> {brand.hours}</span>
          <WhatsAppButton className="mt-3" label="Chat on WhatsApp" />
        </div>
      </div>

      <div className="container-xxl footer-bottom px-3">
        <span>Copyright {new Date().getFullYear()} Crescent Car Rental. All rights reserved.</span>
        <div>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-and-conditions">Terms & Conditions</Link>
          <Link to="/security">Security</Link>
          <Link to="/accessibility">Accessibility</Link>
          <Link to="/sitemap">Sitemap</Link>
          <Link to="/rental-requirements">Rental Requirements</Link>
        </div>
        <div className="social-row">
          {socials.map(([label, href, Icon]) => (
            <a href={href} key={label} aria-label={label} target="_blank" rel="noreferrer"><Icon size={16} /></a>
          ))}
        </div>
      </div>
    </footer>
  );
}
