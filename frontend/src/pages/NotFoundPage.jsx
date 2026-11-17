import { Link } from 'react-router-dom';
import { ArrowRight, Home, Search, Phone } from 'lucide-react';
import SeoHead from '../components/SeoHead';
import Button from '../components/Button';
import brand from '../config/brandConfig';
import { Reveal, Stagger, TextReveal } from '../animation';

export default function NotFoundPage() {
  return (
    <section className="not-found">
      <SeoHead
        title="Page Not Found | Crescent Car Rental"
        description="The page you're looking for doesn't exist. Browse our car rental fleet or contact us for assistance."
        noindex
      />
      <div className="not-found-content">
        <Reveal anim="zoom"><span className="not-found-code">404</span></Reveal>
        <TextReveal as="h1" text="This road ends here." />
        <Reveal anim="up" delay={0.2}>
          <p>The page you requested could not be found. It may have been moved or the link might be incorrect.</p>
        </Reveal>
        <Reveal anim="up" delay={0.3} className="not-found-actions">
          <Button as="link" to="/" variant="red" size="lg">
            <Home size={18} /> Return Home
          </Button>
          <Button as="link" to="/cars" variant="ghost" size="lg">
            <Search size={18} /> Browse Fleet
          </Button>
          <Button as="a" href={brand.phoneHref} variant="ghost" size="lg">
            <Phone size={18} /> Contact Us
          </Button>
        </Reveal>
        <div className="not-found-links">
          <h3>Popular pages</h3>
          <Stagger className="not-found-link-grid" step={0.06}>
            <Link to="/cars">
              <strong>Our Cars</strong>
              <span>Browse the complete fleet</span>
              <ArrowRight size={14} />
            </Link>
            <Link to="/book">
              <strong>Book a Car</strong>
              <span>Request your rental online</span>
              <ArrowRight size={14} />
            </Link>
            <Link to="/services">
              <strong>Services</strong>
              <span>Explore rental options</span>
              <ArrowRight size={14} />
            </Link>
            <Link to="/contact">
              <strong>Contact</strong>
              <span>Get in touch with us</span>
              <ArrowRight size={14} />
            </Link>
            <Link to="/pricing">
              <strong>Pricing</strong>
              <span>Transparent rental rates</span>
              <ArrowRight size={14} />
            </Link>
            <Link to="/faq">
              <strong>FAQ</strong>
              <span>Common questions answered</span>
              <ArrowRight size={14} />
            </Link>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
