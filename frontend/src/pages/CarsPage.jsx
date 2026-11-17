import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CalendarCheck, ShieldCheck, SlidersHorizontal, WalletCards } from 'lucide-react';
import api from '../services/api';
import VehicleCard from '../components/VehicleCard';
import BookingSearchWidget from '../components/BookingSearchWidget';
import SeoHead from '../components/SeoHead';
import SectionHeading from '../components/SectionHeading';
import brand from '../config/brandConfig';
import { Reveal, Stagger, TextReveal } from '../animation';
import { absoluteAssetUrl } from '../utils/assetUrl';

export default function CarsPage() {
  const [params] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    const hasDates = params.get('pickup_date') && params.get('return_date');
    const query = Object.fromEntries(params);
    const request = hasDates ? api.post('/availability', query) : api.get('/vehicles', { params: query });

    request
      .then((response) => setVehicles(response.data.data?.vehicles || response.data.data || response.data.vehicles || []))
      .catch((err) => setError(err.userMessage))
      .finally(() => setLoading(false));
  }, [params.toString()]);

  return (
    <>
      <SeoHead
        title="Our Cars & Fleet | Rent a Car in Lahore | Crescent"
        description="Browse the Crescent Car Rental fleet — economy sedans, SUVs and luxury vehicles with transparent daily rates. Search by dates for live availability in Lahore and Islamabad."
        keywords="rent a car Lahore, car fleet Pakistan, SUV rental Lahore, luxury car rental, sedan rental prices"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Crescent Car Rental Fleet',
          itemListElement: vehicles.slice(0, 12).map((v, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: v.name,
            url: `${brand.website}/#/cars/${v.slug || v.id}`,
          })),
        }}
      />
      <section
        className="page-hero fleet-hero"
        style={{ '--fleet-hero-image': `url("${absoluteAssetUrl('assets/fleet/hero-red-sedan.webp')}")` }}
      >
        <div className="container-xxl">
          <Reveal anim="fade"><span className="eyebrow">The fleet</span></Reveal>
          <TextReveal as="h1" text="Find the right car for your next story." />
          <Reveal anim="up" delay={0.2}>
            <p>Search Crescent vehicles by route, date and category. When dates are supplied, availability is checked against confirmed bookings before results are shown.</p>
            <div className="hero-proof-row">
              <span><ShieldCheck size={17} /> Verified fleet</span>
              <span><CalendarCheck size={17} /> Availability-aware</span>
              <span><WalletCards size={17} /> PKR pricing</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="search-strip">
        <div className="container-xxl">
          <BookingSearchWidget compact />
        </div>
      </section>

      <section className="section section-white">
        <div className="container-xxl">
          <Reveal anim="up" className="fleet-intro-panel">
            <div>
              <span className="eyebrow">Selection logic</span>
              <h2>Premium options, filtered around your plan.</h2>
            </div>
            <p>Add your pickup and return details to see which cars are free on your dates. Every listing shows clear pricing, real specifications and the latest availability.</p>
          </Reveal>

          <div className="split-heading">
            <SectionHeading eyebrow="Available selection" title="Explore our vehicles" />
            <div className="filter-note"><SlidersHorizontal size={17} />{vehicles.length} vehicles</div>
          </div>

          {loading && (
            <div className="vehicle-grid" aria-hidden="true">
              {[0, 1, 2, 3].map((i) => <div className="skeleton skeleton-card" key={i} />)}
            </div>
          )}
          {loading && <div className="status-panel">Loading the fleet...</div>}
          {error && <div className="status-panel error">{error}</div>}
          {!loading && !error && !vehicles.length && (
            <div className="status-panel empty-state">
              <strong>No matching vehicles yet.</strong>
              <span>Try different dates, locations or vehicle category.</span>
            </div>
          )}
          {!loading && !error && vehicles.length > 0 && (
            <Stagger className="vehicle-grid" step={0.07}>
              {vehicles.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}
            </Stagger>
          )}
        </div>
      </section>
    </>
  );
}
