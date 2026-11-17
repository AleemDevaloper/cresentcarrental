import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import {
  ArrowRight, CheckCircle2, MapPin, Plane, Building2, CalendarDays,
  Crown, UserRoundCheck, ShieldCheck, Clock3, Phone, Star, FileCheck2,
  BadgeCheck, WalletCards, Users, Quote, Mail, CarFront, Sparkles, Camera
} from 'lucide-react';
import api from '../services/api';
import SeoHead from '../components/SeoHead';
import SectionHeading from '../components/SectionHeading';
import Button from '../components/Button';
import SmartImage from '../components/SmartImage';
import brand from '../config/brandConfig';
import { Reveal, Stagger, Counter, TextReveal, ImageReveal } from '../animation';
import { trackEvent } from '../services/analytics';

const money = (v) => `${brand.currency} ${Number(v || 0).toLocaleString()}`;

const serviceDefaults = [
  ['Daily Car Rental', 'Flexible rentals for everyday mobility across Lahore, Islamabad and Pakistan.', CalendarDays, 'daily-car-rental'],
  ['Monthly Car Rental', 'Long-term convenience with predictable rental planning and transparent pricing.', CalendarDays, 'monthly-car-rental'],
  ['Airport Transfers', 'Reliable airport pickups and drop-offs coordinated with your flight schedule.', Plane, 'airport-transfers'],
  ['Corporate Car Rental', 'Professional mobility for teams, clients and executives with dedicated support.', Building2, 'corporate-car-rental'],
  ['Luxury Car Rental', 'Premium vehicles for elevated journeys, business travel and special occasions.', Crown, 'luxury-car-rental'],
  ['Chauffeur Service', 'Comfortable travel with a professional driver for business, events and city tours.', UserRoundCheck, 'chauffeur-service'],
  ['Wedding Car Rental', 'Elegant vehicles for barat, valima and special family occasions.', Sparkles, 'wedding-car-rental'],
  ['Self Drive Car Rental', 'Independent travel with well-maintained vehicles and flexible rental periods.', CarFront, 'self-drive-car-rental'],
];

const defaultFaqs = [
  { question: 'What documents do I need to rent a car?', answer: 'To rent a car you need a valid driver\'s licence, your CNIC or passport, and a credit/debit card (or agreed cash deposit) for the security hold.' },
  { question: 'Is there a security deposit required?', answer: 'Yes. A refundable security deposit is required at handover and is returned after the vehicle is inspected and returned in the same condition.' },
  { question: 'Do you offer airport pickup and drop-off services?', answer: 'Yes. We arrange pickup and drop-off at Lahore International Airport and Islamabad Airport, with self-drive and chauffeur options available.' },
  { question: 'What happens if I return the car late?', answer: 'Late returns are charged at an hourly rate. If you know you will be late, contact us as soon as possible so we can adjust the plan.' },
  { question: 'Can I extend my rental period?', answer: 'Yes. Extensions are subject to availability — share your booking reference with our team and we will confirm the new dates.' },
  { question: 'Do you provide the driver?', answer: 'Yes. Professional drivers are available on request for an additional fee. Please request a driver at the time of booking.' },
  { question: 'How do I request a booking?', answer: 'Choose a car, dates and locations, then submit your details. You will receive a unique booking reference that you can use for future communication.' },
  { question: 'Can I book with a driver?', answer: 'Where enabled for the vehicle, select the with-driver option during booking. Our professional drivers ensure a comfortable journey.' },
  { question: 'How is availability checked?', answer: 'We check your dates against every confirmed booking, so two customers are never promised the same car.' },
  { question: 'What payment methods do you accept?', answer: 'Payment details are confirmed during booking follow-up. Our team shares cash, bank transfer and card options after confirming your reservation.' },
  { question: 'Can I modify my booking?', answer: 'Contact our team with your booking reference to discuss modifications. We will do our best to accommodate your changes.' },
];

const fallbackReviews = [
  { customer_name: 'Ahmed Khan', location: 'Lahore', rating: 5, review: 'Excellent service! The car was in perfect condition and the staff was very helpful. Will definitely use their services again.' },
  { customer_name: 'Sara Ahmed', location: 'Islamabad', rating: 4, review: 'Great experience renting from Crescent Rent a Car. The process was smooth and the car was delivered on time.' },
  { customer_name: 'Usman Ali', location: 'Karachi', rating: 5, review: 'I\'ve rented multiple times from Crescent Rent a Car and they never disappoint. Highly recommended!' },
  { customer_name: 'Ahsan R.', location: 'Lahore', rating: 5, review: 'Smooth process, clean vehicle and clear communication from booking to handover.' },
  { customer_name: 'Mariam K.', location: 'Islamabad', rating: 5, review: 'The rental experience felt professional and straightforward, especially for a longer trip.' },
  { customer_name: 'Corporate Client', location: 'Pakistan', rating: 5, review: 'Crescent makes guest movement easier with clear vehicle options and reliable follow-up.' },
];

const serviceKnowledge = {
  'airport-transfers': {
    image: 'assets/fleet/executive-drive.webp',
    intro: 'Airport travel involves fixed flight timings, luggage and limited time. Crescent plans your airport transfer in advance so the right vehicle is waiting when you land — or gets you to the terminal with time to spare.',
    benefits: [
      ['Lahore Airport pickup', 'Arriving in Lahore? Arrange a pickup to your hotel, residence, office or any city destination.'],
      ['Scheduled drop-off', 'Reach Lahore or Islamabad airport on time with a pre-booked vehicle from home, hotel or office.'],
      ['Flight-aware timing', 'Share your flight number and timing so our team can coordinate pickup windows.'],
      ['With-driver option', 'Travel without managing the drive — professional chauffeurs available where enabled.'],
      ['Sedan or SUV choice', 'Match the vehicle to luggage, passengers and budget before you fly.'],
      ['Round trips', 'Book arrival and departure together for simpler planning and clearer pricing.'],
    ],
    steps: [
      ['01', 'Send your details', 'Share flight, date, passenger count and vehicle preference.'],
      ['02', 'Confirm availability', 'Our team responds with vehicle options and a clear estimate.'],
      ['03', 'Confirm your booking', 'Lock the plan and receive your booking reference.'],
      ['04', 'Travel comfortably', 'Meet your driver or collect your vehicle and continue your journey.'],
    ],
    faqs: [
      { question: 'Do you provide Lahore Airport transfer?', answer: 'Yes — Crescent provides airport pickup and drop-off at Lahore International Airport, with self-drive and chauffeur options.' },
      { question: 'Can I book a round-trip airport transfer?', answer: 'Yes. Request both arrival and departure legs in one booking and we will plan the vehicle around your flight times.' },
    ],
  },
  'chauffeur-service': {
    image: 'assets/fleet/executive-sedan.webp',
    intro: 'Our chauffeur service provides experienced, courteous drivers for business meetings, airport transfers, city tours and occasions where you want to travel without managing the drive yourself.',
    benefits: [
      ['Professional drivers', 'Experienced drivers who know local routes and traffic patterns.'],
      ['Punctual pickups', 'Planned arrival windows for meetings, flights and events.'],
      ['Hourly, daily or weekly', 'Flexible hire periods to match your schedule.'],
      ['Corporate accounts', 'Centralised booking support for teams and guest movement.'],
      ['Comfort first', 'Relax in the back seat while your driver handles the road.'],
      ['Transparent driver fees', 'Driver fees are shown before you book, so you know the full cost before you travel.'],
    ],
    steps: [
      ['01', 'Choose vehicle', 'Select the car and confirm chauffeur availability.'],
      ['02', 'Share itinerary', 'Give routes, stops and timing for the day or trip.'],
      ['03', 'Confirm', 'Approve the estimate and receive your reference.'],
      ['04', 'Be chauffeured', 'Your driver arrives for a smooth point-to-point journey.'],
    ],
    faqs: [
      { question: 'Do you provide the driver with every rental?', answer: 'Drivers are available on request for an additional fee. Request a chauffeur at booking time and we will confirm availability.' },
      { question: 'Can chauffeur service be booked hourly?', answer: 'Yes — hourly, daily and weekly chauffeur options are available depending on the vehicle and route.' },
    ],
  },
  'wedding-car-rental': {
    image: 'assets/fleet/luxury-sedan.webp',
    intro: 'Make the barat, valima or walima feel even more special with an elegant wedding car. Crescent offers decorated luxury sedans and SUVs with optional chauffeur support for the couple and family movement.',
    benefits: [
      ['Elegant fleet', 'Luxury sedans and SUVs suited to wedding photography and grand entrances.'],
      ['Chauffeur option', 'Travel stress-free while our driver handles the route and timing.'],
      ['Flexible packages', 'Half-day, full-day and multi-day plans for multiple events.'],
      ['Family movement', 'Coordinate guest pick-up and drop-off alongside the main car.'],
      ['On-time planning', 'We plan routes around barat, valima and photo-session timing.'],
      ['Clear pricing', 'Confirm the package before the event — no surprises on the day.'],
    ],
    steps: [
      ['01', 'Tell us the date', 'Share event dates, venues and vehicle preference.'],
      ['02', 'Pick the car', 'Choose from luxury sedans or SUVs in the fleet.'],
      ['03', 'Confirm package', 'Approve timing, decoration notes and pricing.'],
      ['04', 'Celebrate', 'Enjoy the day with reliable, polished transport.'],
    ],
    faqs: [
      { question: 'Can the wedding car be decorated?', answer: 'Basic decoration coordination can be discussed at booking. Share your theme and we will confirm what is possible for your date.' },
      { question: 'Can I rent the wedding car for multiple events?', answer: 'Yes — multi-day packages covering barat, valima and related events can be arranged.' },
    ],
  },
  'self-drive-car-rental': {
    image: 'assets/fleet/sports-coupe.webp',
    intro: 'Prefer the wheel? Self-drive rental gives you full independence for city errands, business trips and weekend routes — with a well-maintained vehicle and transparent daily, weekly or monthly rates.',
    benefits: [
      ['Full independence', 'Your schedule, your route — no waiting on a driver.'],
      ['Daily to monthly', 'Flexible rental periods from a single day to long-term use.'],
      ['Well-maintained fleet', 'Vehicles prepared for comfort, cleanliness and reliability.'],
      ['Free delivery in Lahore', 'Delivery and pickup within Lahore city limits on eligible bookings.'],
      ['Clear mileage policy', 'Mileage terms are shown on each vehicle before you book.'],
      ['Fast follow-up', 'Submit details online and receive a booking reference quickly.'],
    ],
    steps: [
      ['01', 'Browse fleet', 'Compare sedans, SUVs and luxury cars by price and specs.'],
      ['02', 'Check dates', 'Pick pickup/return so availability can be confirmed.'],
      ['03', 'Verify & book', 'Keep licence, CNIC and deposit ready; submit your request.'],
      ['04', 'Drive', 'Collect your vehicle and enjoy the road.'],
    ],
    faqs: [
      { question: 'What is the minimum rental period for self-drive?', answer: 'Most vehicles can be rented for a single day, with better value on weekly and monthly rates.' },
      { question: 'Is there a mileage limit on self-drive rentals?', answer: 'Mileage policy varies by vehicle and is shown on the vehicle page and confirmed at booking.' },
    ],
  },
  'outstation-car-rental': {
    image: 'assets/fleet/luxury-suv.webp',
    intro: 'Travelling beyond Lahore — to Islamabad, Murree, Hunza, Skardu or another intercity route? Outstation rental covers one-way and round-trip journeys with self-drive or chauffeur options.',
    benefits: [
      ['Intercity routes', 'Lahore to Islamabad, northern destinations and custom intercity plans.'],
      ['One-way or round trip', 'Flexible planning for drop-only or return journeys.'],
      ['SUVs for hills', 'Fortuner-class SUVs suited to highway and mountain travel.'],
      ['Chauffeur option', 'Let an experienced driver handle long-distance routes.'],
      ['Planned pricing', 'Outstation rates confirmed before departure — no hidden charges.'],
      ['Trip support', 'Follow-up support for timing changes and return planning.'],
    ],
    steps: [
      ['01', 'Share route', 'Tell us origin, destination, dates and passengers.'],
      ['02', 'Get a quote', 'Receive outstation pricing for your vehicle choice.'],
      ['03', 'Confirm', 'Approve the plan and get your booking reference.'],
      ['04', 'Hit the road', 'Pick up your car or meet your driver and travel.'],
    ],
    faqs: [
      { question: 'Are outstation rates different from city rates?', answer: 'Yes — outstation journeys are priced differently from local Lahore rental and are confirmed before booking.' },
      { question: 'Can I take the car to Hunza or Skardu?', answer: 'Yes, subject to vehicle suitability and route planning. Share your itinerary so we can recommend the right SUV or sedan.' },
    ],
  },
  'monthly-car-rental': {
    image: 'assets/fleet/executive-suv.webp',
    intro: 'Monthly rental is a practical alternative to ownership for professionals, families and businesses who need dependable access to a vehicle — with predictable pricing and flexible categories.',
    benefits: [
      ['Predictable monthly rates', 'Know your rental cost upfront with per-vehicle monthly pricing.'],
      ['No ownership hassle', 'Skip insurance, maintenance and resale headaches.'],
      ['Flexible categories', 'Economy, sedan, SUV or luxury based on budget and need.'],
      ['Dedicated support', 'One contact for renewals, swaps and service questions.'],
      ['Corporate plans', 'Longer-term mobility for teams and employee travel.'],
      ['Transparent terms', 'No hidden fees — terms confirmed before the month starts.'],
    ],
    steps: [
      ['01', 'Choose category', 'Select the vehicle class that fits your month.'],
      ['02', 'Confirm duration', 'Share start date and intended rental length.'],
      ['03', 'Approve pricing', 'Review the monthly rate and terms.'],
      ['04', 'Drive all month', 'Enjoy dependable mobility with support on call.'],
    ],
    faqs: [
      { question: 'Can I switch vehicles during a monthly rental?', answer: 'Swaps are subject to availability — contact our team with your booking reference to discuss options.' },
      { question: 'Is maintenance included in monthly rental?', answer: 'Yes — scheduled maintenance for rental vehicles is handled by Crescent during your rental period.' },
    ],
  },
  'corporate-car-rental': {
    image: 'assets/fleet/executive-drive.webp',
    intro: 'Crescent provides corporate clients with streamlined rental — from one-time guest transport to recurring employee mobility — through centralised booking, vehicle comparison and clear pricing.',
    benefits: [
      ['Central requests', 'Receive one booking reference and keep every detail in one place.'],
      ['Guest & executive travel', 'Professional vehicles for visiting clients and leadership.'],
      ['Fleet visibility', 'Compare categories and pricing before confirming.'],
      ['Recurring mobility', 'Support for staff movement and ongoing transport needs.'],
      ['Invoice-friendly', 'Organised records for finance and administration.'],
      ['Dedicated follow-up', 'A single point of contact for corporate accounts.'],
    ],
    steps: [
      ['01', 'Brief us', 'Share company needs, routes and frequency.'],
      ['02', 'Approve vehicles', 'Select fleet options and commercial terms.'],
      ['03', 'Book centrally', 'Raise requests with reference tracking.'],
      ['04', 'Move teams', 'Executives, guests and staff travel smoothly.'],
    ],
    faqs: [
      { question: 'Do you offer corporate accounts?', answer: 'Yes — corporate accounts get centralised booking, dedicated follow-up and organised records for recurring travel.' },
      { question: 'Can you handle airport guest transfers for our company?', answer: 'Yes — corporate airport transfers with chauffeur options are a core part of our service.' },
    ],
  },
  'daily-car-rental': {
    image: 'assets/fleet/hero-sedan.webp',
    intro: 'Daily rental covers city errands, meetings, weekend plans and short trips with transparent per-day rates and a fleet that spans economy sedans to luxury vehicles.',
    benefits: [
      ['Flexible daily rates', 'Browse economy, sedan and luxury options with clear daily pricing.'],
      ['Free delivery in Lahore', 'Eligible bookings include delivery and pickup within city limits.'],
      ['No hidden charges', 'Rates confirmed before booking — what you see is what you plan for.'],
      ['24/7 support', 'Help when you need it during the rental period.'],
      ['Well-kept vehicles', 'Maintained for comfort, cleanliness and dependable travel.'],
      ['Insurance options', 'Coverage details shared during booking follow-up.'],
    ],
    steps: [
      ['01', 'Pick a car', 'Filter the fleet by category, seats and price.'],
      ['02', 'Set dates', 'Choose pickup and return for availability checks.'],
      ['03', 'Request', 'Send your details and receive a clear price estimate.'],
      ['04', 'Drive', 'Collect the car and enjoy your day.'],
    ],
    faqs: [
      { question: 'What is included in the daily rate?', answer: 'The daily rate covers the vehicle for the rental period. Driver, fuel, tolls and extras are confirmed separately during booking follow-up.' },
      { question: 'Can I extend a daily rental?', answer: 'Yes, subject to availability. Contact us with your booking reference before the return time.' },
    ],
  },
  'luxury-car-rental': {
    image: 'assets/fleet/sports-car.webp',
    intro: 'Executive sedans and premium vehicles for elevated occasions — business arrivals, weddings, guest hospitality and moments that deserve a sharper first impression.',
    benefits: [
      ['Premium fleet', 'Audi, BMW, Mercedes-Benz and luxury SUV options.'],
      ['Occasion-ready', 'Weddings, VIP guests, executive arrivals and special events.'],
      ['Chauffeur option', 'Arrive driven — professional chauffeurs available.'],
      ['Immaculate presentation', 'Vehicles prepared for photos, clients and ceremonies.'],
      ['Transparent luxury pricing', 'Daily, weekly and monthly rates shown per vehicle.'],
      ['Priority follow-up', 'Fast response for time-sensitive luxury bookings.'],
    ],
    steps: [
      ['01', 'Browse luxury', 'Explore premium sedans and SUVs in the fleet.'],
      ['02', 'Share occasion', 'Tell us date, route and chauffeur preference.'],
      ['03', 'Confirm', 'Approve availability, pricing and handover details.'],
      ['04', 'Arrive in style', 'Enjoy an elevated rental experience.'],
    ],
    faqs: [
      { question: 'Is a driver available with luxury rentals?', answer: 'Yes — chauffeur-driven luxury rentals are available on request for most premium vehicles.' },
      { question: 'Can I rent a luxury car for a wedding?', answer: 'Absolutely. See our wedding car rental service or request a specific model through booking.' },
    ],
  },
};

/* ============================== ABOUT ============================== */
export function AboutPage() {
  return (
    <>
      <SeoHead
        title="About Crescent Car Rental | Rent a Car Company in Lahore"
        description="Founded in 2018, Crescent Car Rental has grown from 5 cars to a 50+ vehicle fleet in Lahore. Learn about our mission, vision and commitment to transparent car rental in Pakistan."
        keywords="about crescent car rental, car rental company Lahore, rent a car Pakistan, premium car rental Lahore"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About Crescent Car Rental',
          description: 'Crescent Car Rental is a premium car rental company in Pakistan founded in 2018.',
          mainEntity: {
            '@type': 'CarRental',
            name: brand.brandName,
            url: brand.website,
            foundingDate: String(brand.foundedYear),
            address: { '@type': 'PostalAddress', streetAddress: brand.address, addressCountry: 'PK' },
          },
        }}
      />
      <section className="page-hero">
        <div className="container-xxl">
          <Reveal anim="fade"><span className="eyebrow">About Crescent</span></Reveal>
          <TextReveal as="h1" text="Built for the road. Designed around you." />
          <Reveal anim="up" delay={0.25}>
            <p>From a five-car start in 2018 to a trusted Lahore fleet — Crescent brings premium presentation together with a simpler, more transparent rental journey.</p>
          </Reveal>
        </div>
      </section>

      <section className="section section-white">
        <div className="container-xxl editorial-grid">
          <Reveal anim="left">
            <span className="eyebrow">Our story</span>
            <h2>From five cars to a fleet Lahore relies on.</h2>
          </Reveal>
          <Reveal anim="right">
            <p className="lead-muted">
              Crescent Rent a Car was founded in 2018 with a vision to raise the standard of car rental in Pakistan. What started as a small fleet of just five cars has grown into one of the leading car rental services in Lahore, with a diverse fleet of over 50 vehicles.
            </p>
            <p>
              Our journey has been driven by a passion for exceptional service and a commitment to customer satisfaction. Every customer has unique needs — business travel, family trips, airport transfers or special occasions — and we meet those needs with personalised, flexible solutions.
            </p>
            <p>
              Today, Crescent is known for reliable cars, fair prices and friendly service. We continue to expand our service areas and improve every part of the rental experience, so customers always know what to expect.
            </p>
          </Reveal>
        </div>

        <div className="container-xxl stats-band" style={{ marginTop: 56 }}>
          <div className="stats-band-grid">
            <Reveal anim="up" className="stat-cell"><Counter to={brand.foundedYear} /><small>Founded</small></Reveal>
            <Reveal anim="up" delay={0.1} className="stat-cell"><Counter to={50} suffix="+" /><small>Vehicles in fleet</small></Reveal>
            <Reveal anim="up" delay={0.2} className="stat-cell"><Counter to={4} suffix="+" /><small>Regions served</small></Reveal>
            <Reveal anim="up" delay={0.3} className="stat-cell"><Counter to={24} suffix="/7" /><small>Support hours</small></Reveal>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container-xxl">
          <SectionHeading eyebrow="Mission & vision" title="Driving towards excellence and customer satisfaction." />
          <div className="mission-grid">
            <Reveal anim="left" className="mission-card">
              <span className="eyebrow">Our mission</span>
              <h3>High-quality rental that exceeds expectations.</h3>
              <p>We aim to make car rental accessible, affordable and hassle-free for everyone — whether for business or leisure.</p>
              <ul>
                <li>Exceptional, responsive customer service</li>
                <li>A diverse, well-maintained fleet</li>
                <li>Competitive, transparent pricing</li>
                <li>Convenience and flexibility in every rental</li>
              </ul>
            </Reveal>
            <Reveal anim="right" delay={0.12} className="mission-card is-dark">
              <span className="eyebrow">Our vision</span>
              <h3>Become Pakistan's most trusted rental name.</h3>
              <p>Known for reliability, quality and a customer-centric approach — setting new standards as we expand across the country.</p>
              <ul>
                <li>First choice for car rental in Pakistan</li>
                <li>Continuous innovation in booking experience</li>
                <li>Presence across major cities</li>
                <li>Long-term relationships with every customer</li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section-white">
        <div className="container-xxl editorial-grid">
          <Reveal anim="left">
            <span className="eyebrow">Why choose us</span>
            <h2>Six reasons customers come back.</h2>
          </Reveal>
          <Stagger className="benefit-list" step={0.08}>
            {[
              [Users, 'Experienced team', 'Professionals dedicated to providing you with the best service at every step.'],
              [CarFront, 'Diverse fleet', 'Economy, sedans, SUVs and luxury vehicles to suit your specific needs.'],
              [BadgeCheck, 'Quality service', 'Committed to high-quality service that exceeds expectations.'],
              [Clock3, '24/7 availability', 'Our services are available round the clock to accommodate your schedule.'],
              [ShieldCheck, 'Safety first', 'All vehicles undergo regular maintenance to ensure your safety.'],
              [WalletCards, 'Competitive pricing', 'Strong market rates without compromising on quality.'],
            ].map(([Icon, t, d]) => (
              <div key={t}>
                <Icon />
                <span><strong>{t}</strong><small>{d}</small></span>
              </div>
            ))}
          </Stagger>
        </div>
        <div className="container-xxl" style={{ marginTop: 40 }}>
          <Reveal anim="up"><Button as="link" to="/book" variant="red" magnetic>Book Your Ride <ArrowRight size={16} /></Button></Reveal>
        </div>
      </section>
    </>
  );
}

/* ============================== SERVICES ============================== */
export function ServicesPage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get('/services').then((r) => setItems(r.data.data || [])).catch(() => {});
  }, []);
  const rows = items.length
    ? items
    : serviceDefaults.map(([title, description], i) => ({
        id: i,
        title,
        description,
        slug: serviceDefaults[i][3],
      }));

  return (
    <>
      <SeoHead
        title="Car Rental Services in Lahore | Crescent Car Rental"
        description="Explore Crescent Car Rental services: daily rental, monthly plans, airport transfers, wedding cars, self-drive, corporate travel, luxury vehicles and chauffeur service across Pakistan."
        keywords="car rental services Lahore, daily car rental, monthly rental, airport transfer, wedding car rental, corporate car rental, chauffeur service Pakistan"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Crescent Car Rental Services',
          itemListElement: rows.map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: s.title,
            description: s.description,
          })),
        }}
      />
      <section className="page-hero">
        <div className="container-xxl">
          <Reveal anim="fade"><span className="eyebrow">Rental services</span></Reveal>
          <TextReveal as="h1" text="Flexible options. One premium standard." />
          <Reveal anim="up" delay={0.2}>
            <p>From daily city drives to monthly rentals, weddings and airport transfers — Crescent offers a service for every travel need in Lahore, Islamabad and beyond.</p>
          </Reveal>
        </div>
      </section>
      <section className="section section-white">
        <div className="container-xxl service-list-page">
          <Stagger className="service-list-stagger" step={0.07}>
            {rows.map((s, i) => {
              const Icon = (serviceDefaults[i] || serviceDefaults[0])[2];
              return (
                <Link to={`/services/${s.slug}`} key={s.id || s.title}>
                  <span>0{i + 1}</span>
                  <Icon />
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.description}</p>
                  </div>
                  <ArrowRight />
                </Link>
              );
            })}
          </Stagger>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container-xxl">
          <SectionHeading eyebrow="Why Crescent" title="Service built around your journey." align="center" />
          <Stagger className="steps-grid" step={0.1}>
            {[
              ['01', 'Choose', 'Select the service that matches your travel needs.', ShieldCheck],
              ['02', 'Book', 'Submit your request online or contact our team.', CalendarDays],
              ['03', 'Drive', 'Pick up your vehicle and enjoy the journey.', Crown],
            ].map(([n, t, d, Icon]) => (
              <div className="step-card" key={n}>
                <div className="step-top"><span>{n}</span><Icon /></div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}

/* ============================== SERVICE DETAIL ============================== */
export function ServiceDetailPage() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  useEffect(() => {
    api.get(`/services/${slug}`).then((r) => setItem(r.data.data || r.data)).catch(() => {});
  }, [slug]);

  const known = serviceKnowledge[slug] || null;
  const title = item?.title || slug.replaceAll('-', ' ').replace(/\b\w/g, (x) => x.toUpperCase());
  const description = item?.description || known?.intro || `Learn about ${title} offered by Crescent Car Rental in Lahore and across Pakistan.`;
  const benefits = known?.benefits || [
    ['Flexible rental periods', 'Daily, weekly or monthly options matched to your plans.'],
    ['Transparent pricing', 'Clear rates confirmed before you book — no hidden charges.'],
    ['Well-maintained vehicles', 'Fleet prepared for comfort, cleanliness and reliability.'],
    ['Fast response', 'Booking requests followed up quickly by the Crescent team.'],
    ['Free delivery in Lahore', 'Delivery and pickup within Lahore city limits on eligible bookings.'],
    ['Support when you need it', 'Help before, during and after your rental period.'],
  ];
  const steps = known?.steps || [
    ['01', 'Choose', 'Select the service and vehicle that fit your trip.'],
    ['02', 'Request', 'Share dates, route and contact details online.'],
    ['03', 'Confirm', 'Approve availability, pricing and handover details.'],
    ['04', 'Enjoy', 'Drive with confidence on your journey.'],
  ];
  const faqs = known?.faqs || defaultFaqs.slice(0, 3);
  const related = serviceDefaults.filter(([, , , s]) => s !== slug).slice(0, 6);
  const image = known?.image || 'assets/fleet/hero-sedan.webp';

  return (
    <>
      <SeoHead
        title={`${title} in Lahore | Crescent Car Rental`}
        description={description}
        keywords={`${title.toLowerCase()} Lahore, ${title.toLowerCase()} Pakistan, Crescent car rental ${title.toLowerCase()}`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: title,
          description,
          provider: { '@type': 'CarRental', name: brand.brandName, url: brand.website },
          areaServed: { '@type': 'Country', name: 'Pakistan' },
        }}
      />
      <section className="page-hero">
        <div className="container-xxl service-detail-hero-grid">
          <div>
            <Reveal anim="fade"><span className="eyebrow">Crescent service</span></Reveal>
            <TextReveal as="h1" text={title} className="hero-foggy" data-text={title} />
            <Reveal anim="up" delay={0.2}>
              <p>{description}</p>
              <div className="hero-actions" style={{ marginTop: 22 }}>
                <Button as="link" to="/book" variant="red" size="lg" magnetic>Book This Service <ArrowRight size={17} /></Button>
                <Button as="a" href={brand.phoneHref} variant="ghost" size="lg"><Phone size={16} /> {brand.phoneDisplay}</Button>
              </div>
            </Reveal>
          </div>
          <Reveal anim="right" className="service-detail-visual img-zoom">
            <SmartImage src={image} alt={`${title} — Crescent Car Rental`} eager card={false} sizes="(max-width: 900px) 100vw, 50vw" />
          </Reveal>
        </div>
      </section>

      <section className="section section-white">
        <div className="container-xxl editorial-grid">
          <Reveal anim="left">
            <span className="eyebrow">Overview</span>
            <h2>How {title} works.</h2>
          </Reveal>
          <Reveal anim="right">
            <p className="lead-muted">{known?.intro || description}</p>
            <p>Every booking includes a clear price, a confirmed vehicle and a direct contact at Crescent. We check your dates, prepare the car and share the handover details before you set off. If your plans change, call us and we will do our best to help.</p>
          </Reveal>
        </div>
        <div className="container-xxl" style={{ marginTop: 48 }}>
          <Stagger className="benefit-cards" step={0.09}>
            {benefits.map(([t, d], i) => (
              <article className="benefit-card" key={t} style={{ '--card-i': i }}>
                <div className="benefit-card-glow" aria-hidden="true" />
                <div className="benefit-card-shine" aria-hidden="true" />
                <div className="benefit-card-top">
                  <span className="icon-glow benefit-card-icon"><CheckCircle2 size={24} /></span>
                  <span className="benefit-card-index">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3>{t}</h3>
                <p>{d}</p>
                <span className="benefit-card-bar" aria-hidden="true" />
              </article>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container-xxl">
          <SectionHeading light eyebrow="How it works" title={`Four steps to ${title.toLowerCase()}.`} />
          <Stagger className="steps-grid" step={0.1}>
            {steps.map(([n, t, d]) => (
              <div className="step-card" key={n}>
                <div className="step-top"><span>{n}</span><ArrowRight /></div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container-xxl">
          <SectionHeading eyebrow="Questions" title={`FAQs about ${title.toLowerCase()}.`} align="center" />
          <Reveal anim="up" className="service-faq faq-list">
            {faqs.map((f, i) => (
              <details key={i}>
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section section-white">
        <div className="container-xxl">
          <SectionHeading eyebrow="Explore more" title="Related rental services." />
          <Stagger className="related-services" step={0.06}>
            {related.map(([, t, , s]) => (
              <Link to={`/services/${s}`} key={s}>{t}<ArrowRight size={16} /></Link>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="cta-band">
        <div className="container-xxl cta-band-inner">
          <Reveal anim="left">
            <span className="eyebrow">Ready when you are</span>
            <h2>Request {title.toLowerCase()} in minutes.</h2>
          </Reveal>
          <Reveal anim="right">
            <Button as="link" to="/book" variant="light" size="lg" magnetic>Book Now <ArrowRight size={18} /></Button>
            <a href={brand.phoneHref} className="cta-phone">or call {brand.phoneDisplay}</a>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ============================== LOCATIONS ============================== */
export function LocationsPage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get('/locations').then((r) => setItems(r.data.data || [])).catch(() => {});
  }, []);
  const rows = items.length
    ? items
    : ['Lahore', 'Islamabad', 'Hunza', 'Skardu'].map((name, i) => ({
        id: i,
        name,
        slug: name.toLowerCase(),
        description: 'Crescent rental service and vehicle availability for your journey.',
      }));

  return (
    <>
      <SeoHead
        title="Car Rental Locations | Lahore, Islamabad & Pakistan"
        description="Crescent Car Rental operates in Lahore, Islamabad, Hunza, Skardu and across Pakistan. Find rent-a-car services in your city with daily, weekly and monthly options."
        keywords="car rental Lahore, car rental Islamabad, car rental Pakistan, Hunza car rental, Skardu car rental"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: 'Crescent Car Rental Locations',
          itemListElement: rows.map((x, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: x.name,
            description: x.description,
          })),
        }}
      />
      <section className="page-hero">
        <div className="container-xxl">
          <Reveal anim="fade"><span className="eyebrow">Where we operate</span></Reveal>
          <TextReveal as="h1" text="Your journey, across more places." />
          <Reveal anim="up" delay={0.2}>
            <p>Crescent Car Rental provides services in Lahore, Islamabad and popular travel destinations across Pakistan.</p>
          </Reveal>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container-xxl">
          <Stagger className="location-grid" step={0.1}>
            {rows.map((x) => (
              <Link to={`/locations/${x.slug}`} key={x.id}>
                <MapPin />
                <h3>{x.name}</h3>
                <p>{x.description}</p>
                <span>Explore location <ArrowRight size={16} /></span>
              </Link>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}

const cityCopy = {
  lahore: {
    areas: ['DHA', 'Gulberg', 'Johar Town', 'Model Town', 'Lahore Cantt', 'Bahria Town', 'Wapda Town', 'Lahore Airport'],
    text: 'Crescent is based in Lahore with free delivery and pickup within city limits on eligible bookings. Whether you need a car for Gulberg meetings, a DHA family dinner, Johar Town errands or a run to Lahore International Airport, our fleet of economy sedans, SUVs and luxury vehicles is ready with transparent daily, weekly and monthly rates.',
  },
  islamabad: {
    areas: ['F-6', 'F-7', 'F-8', 'Blue Area', 'Bahria Enclave', 'DHA Islamabad', 'Islamabad Airport', 'GT Road'],
    text: 'Crescent provides comfortable rental vehicles across Islamabad for business travel, embassy visits, hotel transfers and intercity trips. Choose self-drive or chauffeur-supported options with clear pricing confirmed before you book.',
  },
};

export function LocationDetailPage() {
  const { slug } = useParams();
  const location = useLocation();
  const raw = slug || location.pathname.replace(/^\//, '');
  const title = raw.replaceAll('-', ' ').replace(/\b\w/g, (x) => x.toUpperCase());

  const isFortuner = raw === 'fortuner-for-rent';
  const isYaris = raw === 'yaris-for-rent';
  const isLuxury = raw === 'luxury-car-rental';
  const isCityBrand = raw.startsWith('car-rental-') || ['lahore', 'islamabad', 'hunza', 'skardu'].includes(raw);

  let h1 = `Car Rental ${title}`;
  let lead = `Explore Crescent vehicle options and request your rental for ${title}. Browse sedans, SUVs and luxury vehicles available for daily, weekly and monthly rental.`;
  let body = `Crescent Car Rental brings premium vehicle access to ${title} with a range of economy, sedan, SUV and luxury options. Whether you need a car for business, leisure or a special occasion, our fleet is maintained for comfort and reliability. Browse available vehicles, check pricing and submit your booking request online — our team will follow up with availability, confirmation and handover details.`;
  let eyebrow = 'Crescent location';
  let areas = null;

  if (isFortuner) {
    h1 = 'Toyota Fortuner for Rent';
    eyebrow = 'SUV rental';
    lead = 'Rent a Toyota Fortuner in Lahore for family trips, highway travel, corporate movement and northern routes — with self-drive and chauffeur options.';
    body = 'The Toyota Fortuner is a premium SUV built for luxury, power and versatility — ideal for long road trips, family journeys and light off-roading. Crescent keeps Fortuner-class SUVs ready with transparent daily, weekly and monthly rates, real availability checks and optional professional drivers. Whether you are heading to Islamabad, Murree or the northern areas, request a Fortuner rental and receive a clear estimate before you confirm.';
  } else if (isYaris) {
    h1 = 'Toyota Yaris for Rent';
    eyebrow = 'Economy rental';
    lead = 'Rent a Toyota Yaris in Lahore for city driving, daily commutes and value-focused trips with transparent per-day rates.';
    body = 'The Toyota Yaris is one of the most requested rental cars in Lahore — efficient, comfortable and easy to drive in city traffic. Crescent offers Yaris rentals for daily, weekly and monthly periods with free delivery in Lahore on eligible bookings, standard mileage policy and fast booking follow-up. Compare the Yaris with other sedans in our fleet and request your dates online.';
  } else if (isLuxury) {
    h1 = 'Luxury Car Rental';
    eyebrow = 'Premium fleet';
    lead = 'Executive sedans and premium vehicles for weddings, business arrivals, VIP guests and special occasions across Pakistan.';
    body = 'Crescent luxury car rental includes Audi, BMW, Mercedes-Benz and premium SUV options prepared for moments that need a sharper impression. Choose self-drive or chauffeur-driven packages with daily, weekly and monthly pricing confirmed before booking. Perfect for weddings, corporate hospitality and executive travel in Lahore and Islamabad.';
  } else if (isCityBrand || raw === 'lahore' || raw === 'islamabad') {
    const cityKey = raw.includes('islamabad') ? 'islamabad' : 'lahore';
    const city = cityKey === 'islamabad' ? 'Islamabad' : 'Lahore';
    h1 = `Rent a Car in ${city}`;
    eyebrow = `${city} car rental`;
    lead = `Premium car rental in ${city} with daily, weekly and monthly rates, airport transfers, chauffeur service and a verified fleet.`;
    body = cityCopy[cityKey].text;
    areas = cityCopy[cityKey].areas;
  }

  return (
    <>
      <SeoHead
        title={`${h1} | Crescent Car Rental`}
        description={`${lead} Book online with Crescent Car Rental — transparent rates and fast confirmation.`}
        keywords={`rent a car ${title.toLowerCase()}, car rental ${title.toLowerCase()}, ${title.toLowerCase()} car rental service`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: `Crescent Car Rental ${title}`,
          description: lead,
          address: { '@type': 'PostalAddress', streetAddress: brand.address, addressCountry: 'PK' },
          telephone: brand.phoneDisplay,
          areaServed: title,
          openingHours: 'Mo-Su 00:00-23:59',
        }}
      />
      <section className="page-hero">
        <div className="container-xxl">
          <Reveal anim="fade"><span className="eyebrow">{eyebrow}</span></Reveal>
          <TextReveal as="h1" text={h1} />
          <Reveal anim="up" delay={0.2}>
            <p>{lead}</p>
            <div className="hero-proof-row">
              <span><ShieldCheck size={17} /> Verified fleet</span>
              <span><Clock3 size={17} /> Fast response</span>
              <span><MapPin size={17} /> {title} service</span>
            </div>
            <div className="hero-actions" style={{ marginTop: 22 }}>
              <Button as="link" to={`/cars?search=${encodeURIComponent(isFortuner ? 'Fortuner' : isYaris ? 'Yaris' : isLuxury ? 'Luxury' : title)}`} variant="red" size="lg" magnetic>Browse Fleet <ArrowRight size={17} /></Button>
              <Button as="link" to="/book" variant="ghost" size="lg">Request Booking</Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section-white">
        <div className="container-xxl editorial-grid">
          <Reveal anim="left">
            <span className="eyebrow">About {title}</span>
            <h2>{isFortuner || isYaris || isLuxury ? `${h1} with Crescent.` : `Premium car rental in ${title}.`}</h2>
          </Reveal>
          <Reveal anim="right">
            <p className="lead-muted">{body}</p>
            <div className="marketing-cta-row">
              <Button as="link" to="/book" variant="red" magnetic>Book Now <ArrowRight size={16} /></Button>
              <Button as="a" href={brand.phoneHref} variant="ghost"><Phone size={16} /> {brand.phoneDisplay}</Button>
            </div>
          </Reveal>
        </div>

        {areas && (
          <div className="container-xxl" style={{ marginTop: 48 }}>
            <SectionHeading eyebrow="Areas we cover" title={`Serving every major ${title} neighbourhood.`} />
            <Stagger className="brand-grid" step={0.05}>
              {areas.map((a) => (
                <Link to={`/cars?pickup_location=${encodeURIComponent(title.split(' ').pop())}`} key={a}>{a}<ArrowRight size={15} /></Link>
              ))}
            </Stagger>
          </div>
        )}
      </section>

      <section className="section section-soft">
        <div className="container-xxl">
          <SectionHeading eyebrow="Next step" title="Find the right car for this trip." align="center" />
          <Stagger className="steps-grid" step={0.1}>
            {[
              ['01', 'Browse', 'Compare vehicles, specs and daily rates.', CarFront],
              ['02', 'Check dates', 'Confirm availability with pickup and return dates.', CalendarDays],
              ['03', 'Book', 'Submit your request and receive a reference.', FileCheck2],
            ].map(([n, t, d, Icon]) => (
              <div className="step-card" key={n}>
                <div className="step-top"><span>{n}</span><Icon /></div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}

/* ============================== PRICING ============================== */
export function PricingPage() {
  const [vehicles, setVehicles] = useState([]);
  useEffect(() => {
    api.get('/vehicles').then((r) => {
      const list = r.data.data?.vehicles || r.data.data || r.data.vehicles || [];
      setVehicles(Array.isArray(list) ? list.slice(0, 8) : []);
    }).catch(() => {});
  }, []);

  const fallbackRates = [
    ['Toyota Yaris', 'Economy Sedan', 8500, 55000, 195000],
    ['Toyota Corolla', 'Executive Sedan', 10000, 65000, 225000],
    ['Toyota Fortuner', 'Premium SUV', 22000, 145000, 520000],
    ['Audi A6', 'Luxury Sedan', 35000, 210000, 790000],
    ['BMW 5 Series', 'Luxury Sedan', 40000, 255000, 890000],
    ['Mercedes-Benz E-Class', 'Luxury Sedan', 45000, 285000, 990000],
  ];
  const rateRows = vehicles.length
    ? vehicles.map((v) => [v.name, v.category?.name || v.category || 'Rental', v.daily_price, v.weekly_price, v.monthly_price])
    : fallbackRates;

  return (
    <>
      <SeoHead
        title="Car Rental Prices & Rates in Lahore | Crescent Car Rental"
        description="Transparent car rental pricing in Pakistan — daily, weekly and monthly rates for economy, sedan, SUV and luxury vehicles. No hidden charges."
        keywords="car rental pricing Lahore, daily car rental rate, monthly car rental cost, rent a car prices Pakistan"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Crescent Car Rental Pricing',
          description: 'Transparent daily, weekly and monthly car rental pricing in Pakistan.',
        }}
      />
      <section className="page-hero">
        <div className="container-xxl">
          <Reveal anim="fade"><span className="eyebrow">Transparent pricing</span></Reveal>
          <TextReveal as="h1" text="Flexible by duration. Clear by design." />
          <Reveal anim="up" delay={0.2}>
            <p>Daily, weekly and monthly rates are shown for each vehicle, along with the deposit and any driver fee. The price you review before booking is the price we confirm with you.</p>
          </Reveal>
        </div>
      </section>

      <section className="section section-white">
        <div className="container-xxl pricing-explainer">
          {[
            ['01', 'Daily', 'Ideal for short journeys and flexible city use. Browse economy, sedan and luxury options with transparent daily rates.'],
            ['07', 'Weekly', 'Weekly pricing offers better value for extended plans — perfect for business trips and short-term travel.'],
            ['30', 'Monthly', 'Designed for longer-term mobility with predictable pricing and flexible category selection.'],
          ].map(([n, t, d], i) => (
            <Reveal anim="up" delay={i * 0.1} key={t}>
              <span>{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section section-soft">
        <div className="container-xxl">
          <SectionHeading
            eyebrow="Estimated rates"
            title="Cars for rent in Lahore — per day rates."
            text="Estimated local Lahore rates for popular vehicles. Final pricing depends on dates, availability, route and rental requirements."
          />
          <Reveal anim="up" className="rate-table-wrap">
            <table className="rate-table">
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Category</th>
                  <th>Daily rate</th>
                  <th>Weekly rate</th>
                  <th>Monthly rate</th>
                </tr>
              </thead>
              <tbody>
                {rateRows.map(([name, cat, d, w, m]) => (
                  <tr key={name}>
                    <td><strong>{name}</strong></td>
                    <td>{cat}</td>
                    <td>{d ? money(d) : '—'}</td>
                    <td>{w ? money(w) : '—'}</td>
                    <td>{m ? money(m) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>
          <p className="rate-note">
            Rates shown are for local Lahore use; out-of-city travel is charged accordingly. Vehicles not listed are also available — contact us for a custom quote. Prices may vary by date, season and availability. Confirm the final rate before booking.
          </p>
        </div>
      </section>

      <section className="section section-white">
        <div className="container-xxl editorial-grid">
          <Reveal anim="left">
            <span className="eyebrow">How pricing works</span>
            <h2>Clear rates, no surprises.</h2>
          </Reveal>
          <Reveal anim="right">
            <p className="lead-muted">Pricing is calculated from vehicle category, rental duration and selected options such as driver service. Daily rates appear on each vehicle page; weekly and monthly rates add value for extended rentals.</p>
            <p>Send us your dates and route, and we will confirm a clear price for your rental. Weekly and monthly bookings offer better value, and every quote includes the deposit and any driver fee before you commit.</p>
            <Button as="link" to="/book" variant="red" className="mt-3" magnetic>Get a Quote <ArrowRight size={16} /></Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ============================== FAQ ============================== */
export function FaqPage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get('/faqs').then((r) => setItems(r.data.data || [])).catch(() => {});
  }, []);
  const rows = items.length ? items : defaultFaqs;

  return (
    <>
      <SeoHead
        title="Frequently Asked Questions | Crescent Car Rental"
        description="Answers to common questions about Crescent Car Rental — documents, deposits, airport transfers, drivers, payment methods, late returns and booking changes."
        keywords="car rental FAQ Lahore, rent a car questions, rental policy, security deposit, airport transfer FAQ"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: rows.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }}
      />
      <section className="page-hero compact">
        <div className="container-xxl">
          <Reveal anim="fade"><span className="eyebrow">Help centre</span></Reveal>
          <TextReveal as="h1" text="Frequently asked questions." />
          <Reveal anim="up" delay={0.2}>
            <p>Find answers about booking, availability, pricing, documents and our rental process.</p>
          </Reveal>
        </div>
      </section>
      <section className="section section-white">
        <div className="container-xl faq-list">
          <Stagger step={0.05} anim="up">
            {rows.map((f, i) => (
              <details key={f.id || i}>
                <summary>{f.question}</summary>
                <p>{f.answer}</p>
              </details>
            ))}
          </Stagger>
        </div>
      </section>
      <section className="cta-band">
        <div className="container-xxl cta-band-inner">
          <Reveal anim="left">
            <span className="eyebrow">Still have questions?</span>
            <h2>Get in touch with our team.</h2>
          </Reveal>
          <Reveal anim="right">
            <Button as="link" to="/contact" variant="red" size="lg" magnetic>Contact Us <ArrowRight size={18} /></Button>
            <a href={brand.phoneHref} className="cta-phone">or call {brand.phoneDisplay}</a>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ============================== BLOG ============================== */
export function BlogPage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get('/blog').then((r) => setItems(r.data.data || [])).catch(() => {});
  }, []);
  return (
    <>
      <SeoHead
        title="Blog & Travel Guides | Crescent Car Rental"
        description="Read articles, rental guides and travel tips from Crescent Car Rental — advice for car rental, Lahore travel and fleet updates."
        keywords="car rental blog, travel tips, rental guides, car rental advice Pakistan"
      />
      <section className="page-hero">
        <div className="container-xxl">
          <Reveal anim="fade"><span className="eyebrow">Crescent journal</span></Reveal>
          <TextReveal as="h1" text="Road notes, guides and stories." />
          <Reveal anim="up" delay={0.2}>
            <p>Insights on car rental, travel tips and updates from the Crescent team.</p>
          </Reveal>
        </div>
      </section>
      <section className="section section-white">
        <div className="container-xxl">
          <Stagger className="blog-grid" step={0.09}>
            {items.length
              ? items.map((p) => (
                  <Link key={p.id} to={`/blog/${p.slug}`}>
                    <div
                      className="blog-thumb"
                      style={p.image || p.cover_image ? { backgroundImage: `url(${p.image || p.cover_image})` } : undefined}
                    />
                    <span>{p.category?.name || 'Crescent Journal'}</span>
                    <h3>{p.title}</h3>
                    <p>{p.excerpt}</p>
                    {p.published_at && (
                      <div className="blog-meta">
                        <Clock3 size={13} />
                        {new Date(p.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    )}
                  </Link>
                ))
              : <div className="status-panel">Published stories will appear here from the admin CMS. Check back soon for car rental tips and travel guides.</div>}
          </Stagger>
        </div>
      </section>
    </>
  );
}

export function BlogDetailPage() {
  const { slug } = useParams();
  const [p, setP] = useState(null);
  useEffect(() => {
    api.get(`/blog/${slug}`).then((r) => setP(r.data.data || r.data)).catch(() => {});
  }, [slug]);
  useEffect(() => {
    if (p) trackEvent('blog_read', { content_type: 'blog', content_id: slug, target_label: p.title });
  }, [p, slug]);
  if (!p) return <div className="section container-xl status-panel">Loading story...</div>;
  return (
    <>
      <SeoHead
        title={p.seo_title || `${p.title} | Crescent Car Rental`}
        description={p.seo_description || p.excerpt}
        keywords={p.seo_keywords || 'car rental blog, travel guide'}
        type="article"
        image={p.image || p.cover_image}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: p.title,
          description: p.excerpt,
          datePublished: p.published_at || undefined,
          author: { '@type': 'Organization', name: brand.brandName },
          publisher: { '@type': 'Organization', name: brand.brandName, logo: { '@type': 'ImageObject', url: `${brand.website}/${brand.logoDark}` } },
        }}
      />
      <article className="article-page container-xl">
        <Reveal anim="fade"><span className="eyebrow">Crescent journal</span></Reveal>
        <TextReveal as="h1" text={p.title} />
        <p className="article-lead">{p.excerpt}</p>
        {(p.image || p.cover_image) && (
          <ImageReveal className="article-cover img-zoom" style={{ margin: '28px 0', height: 380 }}>
            <SmartImage src={p.image || p.cover_image} alt={p.title} eager card={false} sizes="(max-width: 900px) 100vw, 760px" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </ImageReveal>
        )}
        <div className="article-content" dangerouslySetInnerHTML={{ __html: p.content }} />
      </article>
    </>
  );
}

/* ============================== REVIEWS ============================== */
export function ReviewsPage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get('/reviews').then((r) => setItems(r.data.data || [])).catch(() => {});
  }, []);
  const rows = items.length ? items : fallbackReviews;

  return (
    <>
      <SeoHead
        title="Customer Reviews & Testimonials | Crescent Car Rental"
        description="Read what customers say about Crescent Car Rental — verified reviews from Lahore, Islamabad and across Pakistan on vehicles, service and booking."
        keywords="crescent car rental reviews, car rental testimonials Lahore, rent a car reviews Pakistan"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Crescent Car Rental Reviews',
          description: 'Customer reviews and testimonials for Crescent Car Rental.',
        }}
      />
      <section className="page-hero compact">
        <div className="container-xxl">
          <Reveal anim="fade"><span className="eyebrow">Customer stories</span></Reveal>
          <TextReveal as="h1" text="Every review is a story we're proud of." />
          <Reveal anim="up" delay={0.2}>
            <p>Real feedback from customers who trusted Crescent for city drives, airport runs, weddings and long journeys.</p>
          </Reveal>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container-xxl">
          <Stagger className="reviews-grid" step={0.1}>
            {rows.map((r, i) => (
              <article className="review-card" key={r.id || i}>
                <Quote size={26} style={{ color: 'var(--red)', opacity: 0.7 }} />
                <blockquote>{r.review}</blockquote>
                <div className="review-stars" aria-label={`${r.rating || 5} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={15} style={{ opacity: s < (r.rating || 5) ? 1 : 0.25 }} />
                  ))}
                </div>
                <div className="review-author">
                  <span className="review-avatar">{(r.customer_name || 'C').split(' ').map((x) => x[0]).slice(0, 2).join('')}</span>
                  <div>
                    <strong>{r.customer_name}</strong>
                    <small>{r.location || 'Crescent customer'}</small>
                  </div>
                </div>
              </article>
            ))}
          </Stagger>
        </div>
      </section>
      <section className="cta-band">
        <div className="container-xxl cta-band-inner">
          <Reveal anim="left">
            <span className="eyebrow">Join them</span>
            <h2>Ready to book your first Crescent ride?</h2>
          </Reveal>
          <Reveal anim="right">
            <Button as="link" to="/book" variant="light" size="lg" magnetic>Book Your Ride <ArrowRight size={18} /></Button>
            <a href={brand.phoneHref} className="cta-phone">or call {brand.phoneDisplay}</a>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ============================== RENTAL REQUIREMENTS ============================== */
export function RentalRequirementsPage() {
  const cards = [
    [FileCheck2, 'Documents you need', 'Bring these to handover:', [
      'Valid driving licence',
      'CNIC or passport',
      'Credit/debit card or agreed cash deposit',
    ]],
    [WalletCards, 'Security deposit', 'A refundable deposit is taken at handover:', [
      'Held against the rental',
      'Released after vehicle inspection',
      'Amount depends on vehicle category',
    ]],
    [Users, 'Driver eligibility', 'Standard requirements for the primary driver:', [
      'Minimum age as confirmed at booking',
      'Licence valid for the rental period',
      'Named driver on the agreement',
    ]],
    [ShieldCheck, 'Insurance & protection', 'Coverage details shared during follow-up:', [
      'Comprehensive options available',
      'Excess explained before booking',
      '24/7 roadside support on eligible plans',
    ]],
    [Clock3, 'Pickup & return', 'Plan a smooth handover:', [
      'Free delivery in Lahore on eligible bookings',
      'Return inspected for condition & fuel',
      'Late returns charged hourly — call ahead',
    ]],
    [BadgeCheck, 'Extensions & changes', 'Need to adjust the plan?', [
      'Extensions subject to availability',
      'Modify with your booking reference',
      'Outstation priced separately',
    ]],
  ];

  return (
    <>
      <SeoHead
        title="Rental Requirements & Documents | Crescent Car Rental"
        description="What you need to rent a car in Lahore — required documents, security deposit, driver age, insurance options, pickup and return rules with Crescent Car Rental."
        keywords="car rental requirements, documents to rent a car Lahore, car rental deposit, driving licence rental Pakistan"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Crescent Rental Requirements',
          description: 'Documents, deposits and policies for renting a car with Crescent.',
        }}
      />
      <section className="page-hero compact">
        <div className="container-xxl">
          <Reveal anim="fade"><span className="eyebrow">Before you book</span></Reveal>
          <TextReveal as="h1" text="Rental requirements, made simple." />
          <Reveal anim="up" delay={0.2}>
            <p>Everything you need for a smooth handover — documents, deposit, insurance and return rules in one place.</p>
          </Reveal>
        </div>
      </section>
      <section className="section section-soft">
        <div className="container-xxl">
          <Stagger className="req-grid" step={0.09}>
            {cards.map(([Icon, t, sub, list]) => (
              <div className="req-card" key={t}>
                <span className="icon-glow"><Icon size={24} /></span>
                <h3>{t}</h3>
                <p>{sub}</p>
                <ul>{list.map((li) => <li key={li}>{li}</li>)}</ul>
              </div>
            ))}
          </Stagger>
        </div>
      </section>
      <section className="section section-white">
        <div className="container-xxl editorial-grid">
          <Reveal anim="left">
            <span className="eyebrow">Ready?</span>
            <h2>Have your documents handy and book in minutes.</h2>
          </Reveal>
          <Reveal anim="right">
            <p className="lead-muted">Most bookings take under five minutes online. Choose your vehicle and dates, send the request, and our team will confirm availability, pricing and handover details — usually with a fast follow-up.</p>
            <div className="marketing-cta-row">
              <Button as="link" to="/book" variant="red" magnetic>Start Booking <ArrowRight size={16} /></Button>
              <Button as="link" to="/faq" variant="ghost">Read FAQs</Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ============================== LEGAL ============================== */
export function StaticPage({ type }) {
  const isPrivacy = type === 'privacy';
  const isSecurity = type === 'security';
  const isAccessibility = type === 'accessibility';
  const isSitemap = type === 'sitemap';
  const pageTitle = isPrivacy ? 'Privacy Policy' : isSecurity ? 'Security' : isAccessibility ? 'Accessibility' : isSitemap ? 'Sitemap' : 'Terms & Conditions';
  return (
    <>
      <SeoHead
        title={`${pageTitle} | Crescent Car Rental`}
        description={
          isPrivacy
            ? 'How Crescent Car Rental collects, uses and protects the personal information you share through our website and booking service.'
            : isSecurity
              ? 'How we protect the Crescent Car Rental website, booking service and the information you share with us.'
              : isAccessibility
                ? 'Crescent Car Rental accessibility commitment and support information.'
                : isSitemap
                  ? 'Browse the main Crescent Car Rental website pages.'
                  : 'Terms and conditions governing Crescent Car Rental services, booking requests, rental agreements, payments and cancellations.'
        }
      />
      <article className="article-page container-xl">
        <Reveal anim="fade"><span className="eyebrow">Legal</span></Reveal>
        <TextReveal as="h1" text={pageTitle} />

        {isPrivacy ? (
          <>
            <p className="article-lead">This policy explains how Crescent Car Rental collects, uses and protects information you submit through our website, booking forms and contact channels.</p>
            <h2>Information we collect</h2>
            <p>We may collect your name, email, phone number, rental dates, vehicle preferences, pickup locations and any notes you share through booking, contact or inquiry forms. Technical data such as IP address and browser type may be logged for security and analytics.</p>
            <h2>How we use your information</h2>
            <p>Information is used to process bookings, communicate with you about availability and pricing, deliver rental services, maintain records, prevent fraud and improve our website and services. We do not sell personal data.</p>
            <h2>Sharing & retention</h2>
            <p>Data is shared only with service providers necessary to deliver your rental (for example payment or mapping partners) or where required by law. We retain records for as long as needed for operational, legal and accounting purposes.</p>
            <h2>Cookies & analytics</h2>
            <p>Our site may use cookies and analytics tools to understand traffic and improve experience. You can restrict cookies through your browser settings, though some features may be affected.</p>
            <h2>Your rights</h2>
            <p>You may request access to, correction of, or deletion of your personal data, subject to legal retention requirements. Contact us using the details below.</p>
            <h2>Contact</h2>
            <p>Questions about this policy or your data: <a href={`mailto:${brand.email}`}>{brand.email}</a> or <a href={brand.phoneHref}>{brand.phoneDisplay}</a>.</p>
            <p className="muted" style={{ fontSize: 13, marginTop: 28 }}>Last updated: September 2026. This template should be reviewed by an authorised legal or management representative before publication.</p>
          </>
        ) : isSecurity ? (
          <>
            <p className="article-lead">Crescent protects booking, contact and operational information through layered application, infrastructure and access controls.</p>
            <h2>Account and access security</h2>
            <p>Administrative access is protected by authenticated API tokens, rate-limited login endpoints, role-aware administration and controlled session storage. Admin credentials should never be shared.</p>
            <h2>Data protection</h2>
            <p>Customer information is limited to operational needs, validated at the API boundary and retained according to legal and business requirements. Sensitive production credentials must be supplied through environment configuration.</p>
            <h2>Responsible disclosure</h2>
            <p>If you identify a security issue, contact <a href={`mailto:${brand.email}`}>{brand.email}</a> with the affected page, steps to reproduce and any supporting evidence. Do not access, modify or expose other users' data.</p>
          </>
        ) : isAccessibility ? (
          <>
            <p className="article-lead">Crescent aims to make car rental information, booking forms and contact options usable across devices and assistive technologies.</p>
            <h2>Our approach</h2>
            <p>We work toward clear hierarchy, keyboard-friendly controls, readable contrast, visible focus states, descriptive labels and reduced-motion support.</p>
            <h2>Need assistance?</h2>
            <p>If a page or form creates a barrier, contact <a href={`mailto:${brand.email}`}>{brand.email}</a> or call <a href={brand.phoneHref}>{brand.phoneDisplay}</a> and our team will help.</p>
          </>
        ) : isSitemap ? (
          <>
            <p className="article-lead">Explore Crescent Car Rental's main customer, service and information pages.</p>
            <h2>Customer pages</h2>
            <p><a href="/">Home</a> · <a href="/cars">Cars</a> · <a href="/book">Book</a> · <a href="/pricing">Pricing</a> · <a href="/contact">Contact</a> · <a href="/services">Services</a> · <a href="/locations">Locations</a> · <a href="/reviews">Reviews</a> · <a href="/faq">FAQ</a> · <a href="/blog">Blog</a></p>
            <h2>Policies and support</h2>
            <p><a href="/privacy-policy">Privacy Policy</a> · <a href="/terms-and-conditions">Terms & Conditions</a> · <a href="/security">Security</a> · <a href="/accessibility">Accessibility</a> · <a href="/rental-requirements">Rental Requirements</a></p>
          </>
        ) : (
          <>
            <p className="article-lead">These terms govern your use of the Crescent Car Rental website and any rental services requested through it. By submitting a booking request you agree to these terms.</p>
            <h2>Bookings & confirmation</h2>
            <p>Website submissions are booking requests, not confirmed reservations. A booking becomes confirmed only after our team verifies availability and pricing and issues a booking reference. Vehicle images and specifications are indicative and may vary by unit.</p>
            <h2>Pricing & payment</h2>
            <p>Rates are shown in PKR and may change by date, season and availability. Final pricing — including driver fees, out-of-city charges, tolls and extras — is confirmed before your rental begins. A security deposit may be required at handover.</p>
            <h2>Cancellation & refunds</h2>
            <p>Cancellation and refund eligibility depends on notice period and rental type, confirmed at booking. Please contact us with your booking reference as early as possible. Refunds, where applicable, are processed to the original payment method.</p>
            <h2>Rental use & responsibilities</h2>
            <p>The vehicle must be driven by the named licence holder, used legally, and returned on time with agreed fuel and condition standards. Late returns, traffic violations, tolls and damage outside agreed coverage may incur charges. Off-road or unauthorised use is prohibited.</p>
            <h2>Insurance & liability</h2>
            <p>Insurance options and excess amounts are explained during booking follow-up. Coverage applies only as stated in your rental agreement.</p>
            <h2>Website content</h2>
            <p>All site content, branding and imagery belong to Crescent Car Rental or its licensors and may not be reproduced without permission.</p>
            <h2>Contact</h2>
            <p>Questions about these terms: <a href={`mailto:${brand.email}`}>{brand.email}</a> or <a href={brand.phoneHref}>{brand.phoneDisplay}</a>.</p>
            <p className="muted" style={{ fontSize: 13, marginTop: 28 }}>Last updated: September 2026. This template should be reviewed by an authorised legal or management representative before publication.</p>
          </>
        )}
      </article>
    </>
  );
}
