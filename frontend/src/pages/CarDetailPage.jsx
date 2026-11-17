import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, Fuel, Luggage, Settings2, Users, DoorOpen, ArrowRight, Gauge } from 'lucide-react';
import api from '../services/api';
import SeoHead from '../components/SeoHead';
import WhatsAppButton from '../components/WhatsAppButton';
import Button from '../components/Button';
import SectionHeading from '../components/SectionHeading';
import VehicleCard from '../components/VehicleCard';
import SmartImage from '../components/SmartImage';
import brand from '../config/brandConfig';
import { Reveal, TextReveal, ImageReveal } from '../animation';

const money = (v) => `${brand.currency} ${Number(v || 0).toLocaleString()}`;

export default function CarDetailPage() {
  const { slug } = useParams();
  const [v, setV] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    setV(null);
    setError('');
    api.get(`/vehicles/${slug}`).then((r) => setV(r.data.data || r.data)).catch((e) => setError(e.userMessage));
    api.get('/vehicles').then((r) => {
      const list = r.data.data?.vehicles || r.data.data || r.data.vehicles || [];
      setSimilar((Array.isArray(list) ? list : []).slice(0, 4));
    }).catch(() => {});
  }, [slug]);

  if (error) return <div className="section container-xxl status-panel error">{error}</div>;
  if (!v) {
    return (
      <div className="section container-xxl">
        <div className="status-panel">Loading vehicle…</div>
        <div className="vehicle-grid" aria-hidden="true">
          <div className="skeleton" style={{ height: 380 }} />
          <div className="skeleton" style={{ height: 380 }} />
        </div>
      </div>
    );
  }

  const specs = [
    [Users, `${v.seats || 5} seats`],
    [DoorOpen, `${v.doors || 4} doors`],
    [Settings2, v.transmission || 'Automatic'],
    [Fuel, v.fuel_type || 'Petrol'],
    [Luggage, v.luggage || '2–3 bags'],
    [Gauge, v.mileage_policy || 'Standard mileage'],
  ];
  const features = v.features?.length ? v.features : ['Air Conditioning', 'Power Steering', 'ABS', 'Airbags', 'Bluetooth Audio'];
  const similarList = similar.filter((x) => x.slug !== slug && x.id !== v.id).slice(0, 4);

  return (
    <>
      <SeoHead
        title={`${v.name} Rental in Lahore | ${money(v.daily_price)}/day | Crescent`}
        description={`${v.name} for rent in Lahore with Crescent Car Rental — ${money(v.daily_price)} per day. ${v.short_description || 'Book this vehicle with transparent pricing and fast confirmation.'}`}
        keywords={`${v.name.toLowerCase()} rent, ${v.name.toLowerCase()} rental Lahore, ${v.name.toLowerCase()} price per day`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: v.name,
          description: v.short_description || v.description,
          brand: { '@type': 'Brand', name: v.brand?.name || brand.brandName },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'PKR',
            price: v.daily_price || 0,
            availability: 'https://schema.org/InStock',
            url: `${brand.website}/#/cars/${slug}`,
          },
        }}
      />
      <section className="vehicle-detail-hero">
        <div className="container-xxl vehicle-detail-grid">
          <Reveal anim="left">
            <div className="vehicle-detail-image img-zoom">
              <SmartImage src={v.main_image_url} fallback="assets/vehicle-placeholder.svg" alt={`${v.name} rental — Crescent Car Rental`} eager card={false} sizes="(max-width: 900px) 100vw, 55vw" />
            </div>
          </Reveal>
          <div className="vehicle-detail-copy">
            <Reveal anim="fade"><span className="eyebrow">{v.category?.name || v.category || 'Premium Vehicle'}</span></Reveal>
            <TextReveal as="h1" text={v.name} />
            <Reveal anim="up" delay={0.18}>
              <p>{v.short_description || 'A polished rental choice for comfort, confidence and your next journey.'}</p>
              <div className="detail-price"><strong>{money(v.daily_price)}</strong><span>/ day</span></div>
              <div className="detail-specs">
                {specs.map(([Icon, t]) => <span key={t}><Icon size={19} />{t}</span>)}
              </div>
              <div className="detail-actions">
                <Button as="link" to={`/book?vehicle=${v.id}`} variant="red" size="lg" magnetic>
                  Book This Car <ArrowRight size={18} />
                </Button>
                <WhatsAppButton vehicle={v.name} label="Ask About This Car" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container-xxl detail-content-grid">
          <Reveal anim="up">
            <span className="eyebrow">Vehicle overview</span>
            <h2>Designed for the journey ahead.</h2>
            <p>{v.description || 'A comfortable, well-maintained car with clear pricing, flexible rental terms and a team ready to help before and during your trip.'}</p>
            <div className="feature-list">
              {features.map((f) => {
                const name = typeof f === 'string' ? f : f.name || f.title;
                return <span key={name}><Check size={16} /> {name}</span>;
              })}
            </div>
          </Reveal>
          <Reveal anim="right" className="pricing-panel">
            <h3>Rates & inclusions</h3>
            <div className="pricing-row"><span>Daily rate</span><strong>{money(v.daily_price)}</strong></div>
            {v.weekly_price ? <div className="pricing-row"><span>Weekly rate</span><strong>{money(v.weekly_price)}</strong></div> : null}
            {v.monthly_price ? <div className="pricing-row"><span>Monthly rate</span><strong>{money(v.monthly_price)}</strong></div> : null}
            {v.deposit ? <div className="pricing-row"><span>Security deposit</span><strong>{money(v.deposit)}</strong></div> : null}
            <div className="pricing-row"><span>Mileage policy</span><strong>{v.mileage_policy || 'Standard'}</strong></div>
            <p className="pricing-note">Rates are for local Lahore use; out-of-city travel is charged separately. Final price is confirmed for your dates, route and options before booking.</p>
            <Link to="/pricing" className="text-link" style={{ marginTop: 14 }}>View full pricing guide <ArrowRight size={14} /></Link>
          </Reveal>
        </div>
      </section>

      {similarList.length > 0 && (
        <section className="section section-soft">
          <div className="container-xxl">
            <SectionHeading eyebrow="You may also like" title="Similar vehicles in the fleet." />
            <div className="vehicle-grid">
              {similarList.map((s) => <VehicleCard key={s.id} vehicle={s} />)}
            </div>
          </div>
        </section>
      )}

      <section className="cta-band">
        <div className="container-xxl cta-band-inner">
          <div>
            <span className="eyebrow">Ready?</span>
            <h2>Rent the {v.name} today.</h2>
          </div>
          <div>
            <Button as="link" to={`/book?vehicle=${v.id}`} variant="light" size="lg" magnetic>
              Book This Car <ArrowRight size={18} />
            </Button>
            <a href={brand.phoneHref} className="cta-phone">or call {brand.phoneDisplay}</a>
          </div>
        </div>
      </section>
    </>
  );
}
