const fleetImages = {
  yaris: 'assets/fleet/hero-sedan.webp',
  corolla: 'assets/fleet/luxury-sedan.webp',
  fortuner: 'assets/fleet/luxury-suv.webp',
  audi: 'assets/fleet/executive-drive.webp',
  bmw: 'assets/fleet/sports-coupe.webp',
  mercedes: 'assets/fleet/executive-sedan.webp',
  civic: 'assets/fleet/hero-red-sedan.webp',
  sportage: 'assets/fleet/luxury-suv.webp',
  hiace: 'assets/fleet/executive-suv.webp',
  alto: 'assets/fleet/sports-car.webp',
};

const featureSet = [
  'Air Conditioning',
  'Bluetooth',
  'Navigation',
  'Leather Seats',
  'Parking Sensors',
  'Reverse Camera',
  'Cruise Control',
];

function features(count = 5) {
  return featureSet.slice(0, count).map((name, index) => ({ id: index + 1, name, icon: null }));
}

function vehicle(id, name, slug, brand, model, year, category, daily, weekly, monthly, deposit, seats, doors, image, location = 'Lahore', featured = true) {
  return {
    id,
    name,
    slug,
    brand: { id, name: brand },
    model,
    year,
    category: { id, name: category, slug: category.toLowerCase() },
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    seats,
    doors,
    mileage_policy: 'Standard mileage policy',
    daily_price: daily,
    weekly_price: weekly,
    monthly_price: monthly,
    deposit,
    driver_fee: 3500,
    extra_km_fee: 75,
    late_return_fee: 2500,
    driver_available: true,
    self_drive_available: true,
    location: { id, name: location, slug: location.toLowerCase() },
    short_description: 'Premium comfort, professionally maintained and ready for your next journey.',
    description:
      'A carefully maintained Crescent rental vehicle with a comfortable cabin, modern driving features and flexible booking options. Every unit is cleaned and inspected before handover, with self-drive and chauffeur options available.',
    main_image: image,
    main_image_url: image,
    gallery: [],
    features: features(category === 'Luxury' ? 7 : 5),
    status: 'active',
    operational_status: 'Available',
    odometer: 12000 + id * 850,
    registration_expires_at: '',
    insurance_expires_at: '',
    featured,
  };
}

export const vehicles = [
  vehicle(1, 'Toyota Yaris', 'toyota-yaris', 'Toyota', 'Yaris', 2026, 'Economy', 8500, 55000, 195000, 30000, 5, 4, fleetImages.yaris),
  vehicle(2, 'Toyota Corolla', 'toyota-corolla', 'Toyota', 'Corolla', 2026, 'Sedan', 10000, 65000, 225000, 35000, 5, 4, fleetImages.corolla),
  vehicle(3, 'Toyota Fortuner', 'toyota-fortuner', 'Toyota', 'Fortuner', 2026, 'SUV', 22000, 145000, 520000, 75000, 7, 5, fleetImages.fortuner),
  vehicle(4, 'Audi A6', 'audi-a6', 'Audi', 'A6', 2025, 'Luxury', 35000, 225000, 790000, 120000, 5, 4, fleetImages.audi, 'Islamabad'),
  vehicle(5, 'BMW 5 Series', 'bmw-5-series', 'BMW', '5 Series', 2025, 'Luxury', 40000, 255000, 890000, 140000, 5, 4, fleetImages.bmw),
  vehicle(6, 'Mercedes-Benz E-Class', 'mercedes-benz-e-class', 'Mercedes-Benz', 'E-Class', 2025, 'Luxury', 45000, 285000, 990000, 150000, 5, 4, fleetImages.mercedes, 'Islamabad'),
  vehicle(7, 'Honda Civic', 'honda-civic', 'Honda', 'Civic', 2026, 'Sedan', 11000, 72000, 250000, 40000, 5, 4, fleetImages.civic),
  vehicle(8, 'Kia Sportage', 'kia-sportage', 'Kia', 'Sportage', 2026, 'SUV', 18000, 118000, 420000, 60000, 5, 5, fleetImages.sportage),
  vehicle(9, 'Toyota Hiace', 'toyota-hiace', 'Toyota', 'Hiace', 2025, 'SUV', 16000, 105000, 380000, 55000, 12, 4, fleetImages.hiace),
  vehicle(10, 'Suzuki Alto', 'suzuki-alto', 'Suzuki', 'Alto', 2026, 'Economy', 6500, 42000, 150000, 20000, 4, 4, fleetImages.alto, 'Lahore', false),
];

export const locations = [
  { id: 1, name: 'Lahore', slug: 'lahore', description: 'Premium car rental and chauffeur options across Lahore.', status: 'active', sort_order: 1 },
  { id: 2, name: 'Islamabad', slug: 'islamabad', description: 'Reliable rental mobility for Islamabad and surrounding routes.', status: 'active', sort_order: 2 },
  { id: 3, name: 'Hunza', slug: 'hunza', description: 'Travel-ready rental options for northern journeys.', status: 'active', sort_order: 3 },
  { id: 4, name: 'Skardu', slug: 'skardu', description: 'Vehicle options designed for memorable northern travel.', status: 'active', sort_order: 4 },
  { id: 5, name: 'Murree', slug: 'murree', description: 'Hill-station rental cars for family and weekend trips.', status: 'active', sort_order: 5 },
];

export const services = [
  { id: 1, title: 'Daily Car Rental', slug: 'daily-car-rental', description: 'Flexible premium mobility for city days and short journeys.', status: 'active', sort_order: 1 },
  { id: 2, title: 'Monthly Car Rental', slug: 'monthly-car-rental', description: 'Long-term convenience with transparent monthly planning.', status: 'active', sort_order: 2 },
  { id: 3, title: 'Airport Transfers', slug: 'airport-transfers', description: 'Reliable airport pickup and drop-off service.', status: 'active', sort_order: 3 },
  { id: 4, title: 'Corporate Car Rental', slug: 'corporate-car-rental', description: 'Professional fleet solutions for teams, executives and guests.', status: 'active', sort_order: 4 },
  { id: 5, title: 'Luxury Car Rental', slug: 'luxury-car-rental', description: 'Elevated vehicles for premium occasions and executive movement.', status: 'active', sort_order: 5 },
  { id: 6, title: 'Chauffeur Service', slug: 'chauffeur-service', description: 'Professional driver service where available.', status: 'active', sort_order: 6 },
  { id: 7, title: 'Wedding Car Rental', slug: 'wedding-car-rental', description: 'Elegant vehicles for barat, valima and special family occasions.', status: 'active', sort_order: 7 },
  { id: 8, title: 'Self Drive Car Rental', slug: 'self-drive-car-rental', description: 'Independent travel with flexible daily and monthly rates.', status: 'active', sort_order: 8 },
  { id: 9, title: 'Outstation Car Rental', slug: 'outstation-car-rental', description: 'Intercity journeys with self-drive or chauffeur options.', status: 'active', sort_order: 9 },
];

export const faqs = [
  { id: 1, question: 'What documents do I need to rent a car?', answer: "A valid driver's licence, CNIC or passport, and a credit/debit card or agreed cash deposit for the security hold.", category: 'Documents', status: 'active', sort_order: 1 },
  { id: 2, question: 'Is there a security deposit required?', answer: 'Yes. A refundable security deposit is required at handover and returned after the vehicle is inspected.', category: 'Payment', status: 'active', sort_order: 2 },
  { id: 3, question: 'Do you offer airport pickup and drop-off services?', answer: 'Yes. We arrange pickup and drop-off at Lahore and Islamabad airports, with self-drive and chauffeur options.', category: 'Airport', status: 'active', sort_order: 3 },
  { id: 4, question: 'What happens if I return the car late?', answer: 'Late returns are charged at an hourly rate. Contact us early so we can adjust the plan where possible.', category: 'Policy', status: 'active', sort_order: 4 },
  { id: 5, question: 'Can I extend my rental period?', answer: 'Yes, subject to availability. Share your booking reference with our team and we will confirm the new dates.', category: 'Booking', status: 'active', sort_order: 5 },
  { id: 6, question: 'Do you provide the driver?', answer: 'Yes. Professional drivers are available on request for an additional fee. Request a driver at the time of booking.', category: 'Chauffeur', status: 'active', sort_order: 6 },
  { id: 7, question: 'How do I request a booking?', answer: 'Choose a car, dates and locations, then submit your details. You will receive a unique booking reference.', category: 'Booking', status: 'active', sort_order: 7 },
  { id: 8, question: 'How is availability checked?', answer: 'We check your dates against every confirmed booking, so two customers are never promised the same car.', category: 'Availability', status: 'active', sort_order: 8 },
  { id: 9, question: 'What payment methods do you accept?', answer: 'Our team shares cash, bank transfer and card options after confirming your reservation.', category: 'Payment', status: 'active', sort_order: 9 },
  { id: 10, question: 'Can I modify my booking?', answer: 'Contact our team with your booking reference to discuss modifications. We will do our best to accommodate changes.', category: 'Booking', status: 'active', sort_order: 10 },
];

export const reviews = [
  { id: 1, customer_name: 'Ahmed Khan', location: 'Lahore', rating: 5, review: 'Excellent service! The car was in perfect condition and the staff was very helpful. Will definitely use their services again.', status: 'active', sort_order: 1 },
  { id: 2, customer_name: 'Sara Ahmed', location: 'Islamabad', rating: 4, review: 'Great experience renting from Crescent Rent a Car. The process was smooth and the car was delivered on time.', status: 'active', sort_order: 2 },
  { id: 3, customer_name: 'Usman Ali', location: 'Karachi', rating: 5, review: "I've rented multiple times from Crescent Rent a Car and they never disappoint. Highly recommended!", status: 'active', sort_order: 3 },
  { id: 4, customer_name: 'Ahsan R.', location: 'Lahore', rating: 5, review: 'Smooth process, clean vehicle and clear communication from booking to handover.', status: 'active', sort_order: 4 },
  { id: 5, customer_name: 'Mariam K.', location: 'Islamabad', rating: 5, review: 'The rental experience felt professional and straightforward, especially for a longer trip.', status: 'active', sort_order: 5 },
  { id: 6, customer_name: 'Corporate Client', location: 'Pakistan', rating: 5, review: 'Crescent makes guest movement easier with clear vehicle options and reliable follow-up.', status: 'active', sort_order: 6 },
];

export const blogPosts = [
  {
    id: 1,
    title: 'How to Choose the Right Rental Car for a Northern Pakistan Trip',
    slug: 'choose-rental-car-northern-pakistan',
    excerpt: 'From highway comfort to mountain capability — here is how to match the vehicle to your route, passengers and luggage.',
    category: { name: 'Travel Guides' },
    image: 'assets/fleet/luxury-suv.webp',
    cover_image: 'assets/fleet/luxury-suv.webp',
    content:
      '<p>Northern Pakistan rewards the right vehicle. For Hunza, Skardu and Murree routes, ground clearance, luggage capacity and engine reliability matter more than city styling.</p><h2>Match the car to the route</h2><p>An SUV such as the Toyota Fortuner is the comfortable choice for long highway days and mountain roads. Sedans remain ideal for city and motorway travel with light luggage.</p><h2>Plan around the season</h2><p>Check road conditions before departure, allow extra travel time, and confirm whether a driver is recommended for your route.</p><h2>Book early</h2><p>Popular SUVs are booked quickly during holiday periods. Share your dates early so availability can be confirmed.</p>',
    status: 'published',
    published_at: '2026-08-18T10:00:00.000Z',
    seo_title: 'How to Choose a Rental Car for Northern Pakistan | Crescent',
    seo_description: 'A practical guide to choosing an SUV or sedan for Hunza, Skardu, Murree and other northern routes.',
  },
  {
    id: 2,
    title: 'Daily, Weekly or Monthly Rental: Which Plan Fits Your Trip?',
    slug: 'daily-weekly-monthly-car-rental-guide',
    excerpt: 'Understand how rental duration changes pricing and which plan gives the best value for your plans.',
    category: { name: 'Rental Advice' },
    image: 'assets/fleet/executive-sedan.webp',
    cover_image: 'assets/fleet/executive-sedan.webp',
    content:
      '<p>The best rental plan depends on how long you need the car and how much flexibility you want during the period.</p><h2>Daily rental</h2><p>Best for short city trips, meetings and weekend plans where you need a vehicle for one to three days.</p><h2>Weekly rental</h2><p>Weekly pricing usually lowers the effective daily rate for business trips and short holidays.</p><h2>Monthly rental</h2><p>Monthly plans are designed for longer stays, corporate use and customers who need dependable mobility without ownership.</p>',
    status: 'published',
    published_at: '2026-07-29T10:00:00.000Z',
    seo_title: 'Daily vs Weekly vs Monthly Car Rental | Crescent',
    seo_description: 'Compare daily, weekly and monthly car rental plans and choose the best value for your trip.',
  },
  {
    id: 3,
    title: 'Airport Transfers in Lahore: What to Plan Before You Fly',
    slug: 'lahore-airport-transfer-planning',
    excerpt: 'Flight timing, luggage and pickup coordination — a simple checklist for a stress-free airport transfer.',
    category: { name: 'Airport Travel' },
    image: 'assets/fleet/executive-drive.webp',
    cover_image: 'assets/fleet/executive-drive.webp',
    content:
      '<p>A smooth airport transfer starts with clear timing and the right vehicle for your luggage.</p><h2>Share flight details</h2><p>Give the team your flight number, arrival time and destination so pickup can be coordinated around delays.</p><h2>Choose the right vehicle</h2><p>A sedan handles light luggage comfortably, while an SUV is better for families and larger bags.</p><h2>Plan the return leg</h2><p>Book arrival and departure together for simpler planning and a clearer estimate.</p>',
    status: 'published',
    published_at: '2026-06-14T10:00:00.000Z',
    seo_title: 'Lahore Airport Transfer Planning Checklist | Crescent',
    seo_description: 'Plan a stress-free Lahore airport pickup or drop-off with Crescent Car Rental.',
  },
];

export const homepageSections = [
  { id: 1, key: 'hero', title: 'DRIVE YOUR NEXT STORY.', subtitle: 'Premium cars for every journey.', cta_text: 'BOOK YOUR RIDE', cta_url: '/book', status: 'active', sort_order: 1 },
  { id: 2, key: 'featured_vehicles', title: 'Choose the car that fits the moment.', subtitle: 'A curated fleet for different journeys.', status: 'active', sort_order: 2 },
  { id: 3, key: 'services', title: 'Built around the way you travel.', status: 'active', sort_order: 3 },
];

export const vehicleBrands = [
  { id: 1, name: 'Toyota', slug: 'toyota', status: 'active', sort_order: 1 },
  { id: 2, name: 'Audi', slug: 'audi', status: 'active', sort_order: 2 },
  { id: 3, name: 'BMW', slug: 'bmw', status: 'active', sort_order: 3 },
  { id: 4, name: 'Mercedes-Benz', slug: 'mercedes-benz', status: 'active', sort_order: 4 },
  { id: 5, name: 'Honda', slug: 'honda', status: 'active', sort_order: 5 },
  { id: 6, name: 'Kia', slug: 'kia', status: 'active', sort_order: 6 },
  { id: 7, name: 'Suzuki', slug: 'suzuki', status: 'active', sort_order: 7 },
];

export const vehicleCategories = [
  { id: 1, name: 'Economy', slug: 'economy', description: 'Smart city drives and value-focused daily rentals.', status: 'active', sort_order: 1 },
  { id: 2, name: 'Sedan', slug: 'sedan', description: 'Comfortable business and family travel.', status: 'active', sort_order: 2 },
  { id: 3, name: 'SUV', slug: 'suv', description: 'Highway and family travel with extra space.', status: 'active', sort_order: 3 },
  { id: 4, name: 'Luxury', slug: 'luxury', description: 'Premium vehicles for special occasions.', status: 'active', sort_order: 4 },
];

export const vehicleFeatures = featureSet.map((name, index) => ({ id: index + 1, name, icon: null, status: 'active' }));

export const settings = {
  business_name: 'Crescent Car Rental',
  phone: '+92 308 7923041',
  email: 'info@crescentrentacar.com',
  whatsapp: '923087923041',
  address: 'DHA Phase 1, Block H, Commercial Area, Lahore, Pakistan',
  currency: 'PKR',
  business_hours: 'Open 24/7',
  ga4_id: '',
  gtm_id: '',
  google_ads_id: '',
  meta_pixel_id: '',
};

export const customers = [
  { id: 1, full_name: 'Sample Customer', phone: '+92 300 0000000', email: 'sample@example.com', bookings_count: 1, status: 'active' },
  { id: 2, full_name: 'Ahmed Khan', phone: '+92 321 5550001', email: 'ahmed@example.com', bookings_count: 2, status: 'active' },
  { id: 3, full_name: 'Sara Ahmed', phone: '+92 333 5550002', email: 'sara@example.com', bookings_count: 1, status: 'active' },
];

export const leads = [
  { id: 1, name: 'Ahmed Khan', phone: '+92 321 5550001', email: 'ahmed@example.com', source: 'Website', status: 'New', created_at: '2026-09-20T10:00:00.000Z' },
  { id: 2, name: 'Corporate Enquiry', phone: '+92 300 1112233', email: 'ops@example.com', source: 'Corporate page', status: 'Contacted', created_at: '2026-09-18T10:00:00.000Z' },
];

export const discounts = [
  { id: 1, name: 'Weekly Saver', code: 'WEEK10', type: 'percentage', value: 10, status: 'active' },
  { id: 2, name: 'Monthly Plan', code: 'MONTH15', type: 'percentage', value: 15, status: 'active' },
];

export const pricingRules = [
  { id: 1, name: 'Driver fee', type: 'per_day', amount: 3500, percentage: 0, status: 'active' },
  { id: 2, name: 'Extra kilometre', type: 'per_km', amount: 75, percentage: 0, status: 'active' },
  { id: 3, name: 'Late return', type: 'per_hour', amount: 2500, percentage: 0, status: 'active' },
];

export const seoMetadata = [
  { id: 1, route: '/', seo_title: 'Crescent Car Rental | Premium Car Rental Pakistan', meta_description: 'Premium cars for every journey in Lahore, Islamabad and across Pakistan.', og_image: 'assets/fleet/hero-red-sedan.webp' },
  { id: 2, route: '/cars', seo_title: 'Our Cars & Fleet | Crescent Car Rental', meta_description: 'Browse economy, sedan, SUV and luxury rental cars with transparent daily rates.', og_image: 'assets/fleet/hero-sedan.webp' },
];

export const mediaLibrary = [
  { id: 1, filename: 'hero-sedan.webp', path: 'assets/fleet/hero-sedan.webp', alt_text: 'Premium rental sedan', mime_type: 'image/jpeg' },
  { id: 2, filename: 'premium-interior.webp', path: 'assets/fleet/premium-interior.webp', alt_text: 'Premium cabin interior', mime_type: 'image/jpeg' },
  { id: 3, filename: 'sports-coupe.webp', path: 'assets/fleet/sports-coupe.webp', alt_text: 'Sports coupe rental car', mime_type: 'image/jpeg' },
];

export const adminUsers = [
  { id: 1, name: 'Crescent Administrator', email: 'admin@crescentrentacar.com', role: 'super_admin', is_active: true, created_at: '2026-01-01T00:00:00.000Z' },
  { id: 2, name: 'Operations Manager', email: 'operations@crescentrentacar.com', role: 'admin', is_active: true, created_at: '2026-02-01T00:00:00.000Z' },
];

export const notifications = [
  { id: 1, title: 'New booking request', message: 'A new booking request is waiting for review.', type: 'booking', status: 'unread' },
  { id: 2, title: 'Fleet update', message: 'Vehicle availability has been refreshed.', type: 'fleet', status: 'read' },
];

export const activityLogs = [
  { id: 1, action: 'Login', description: 'Admin logged in', user_id: 1, created_at: '2026-09-20T08:00:00.000Z' },
  { id: 2, action: 'Updated', description: 'Updated booking operations', user_id: 1, created_at: '2026-09-20T09:30:00.000Z' },
];

export const defaultCollectionData = {
  services,
  locations,
  faqs,
  reviews,
  'blog-posts': blogPosts,
  'homepage-sections': homepageSections,
  'vehicle-brands': vehicleBrands,
  'vehicle-categories': vehicleCategories,
  'vehicle-features': vehicleFeatures,
  customers,
  leads,
  discounts,
  'pricing-rules': pricingRules,
  seo: seoMetadata,
  media: mediaLibrary,
  users: adminUsers,
  notifications,
  activity: activityLogs,
};
