import {
  defaultCollectionData,
  settings as defaultSettings,
  vehicles as seedVehicles,
} from '../data/staticData';

const KEYS = {
  vehicles: 'crescent_static_vehicles_v1',
  bookings: 'crescent_static_bookings_v1',
  contacts: 'crescent_static_contacts_v1',
  settings: 'crescent_static_settings_v1',
  collections: 'crescent_static_collections_v1',
  analytics: 'crescent_static_analytics_v1',
  sequence: 'crescent_static_sequence_v1',
};

const memoryStore = new Map();
const clone = (value) => JSON.parse(JSON.stringify(value));

function readStore(key, seedFactory) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    /* localStorage can be unavailable for file:// origins. */
  }
  if (memoryStore.has(key)) return clone(memoryStore.get(key));
  const seed = typeof seedFactory === 'function' ? seedFactory() : seedFactory;
  memoryStore.set(key, clone(seed));
  return clone(seed);
}

function writeStore(key, value) {
  memoryStore.set(key, clone(value));
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Keep the in-memory copy when storage is blocked. */
  }
}

function ok(config, data, status = 200) {
  return Promise.resolve({
    data,
    status,
    statusText: status === 201 ? 'Created' : 'OK',
    headers: { 'content-type': 'application/json' },
    config,
    request: {},
  });
}

function fail(config, status, message) {
  const error = new Error(message);
  error.userMessage = message;
  error.config = config;
  error.response = {
    data: { message },
    status,
    statusText: 'Error',
    headers: { 'content-type': 'application/json' },
    config,
    request: {},
  };
  return Promise.reject(error);
}

function parseBody(data) {
  if (!data) return {};
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  if (typeof FormData !== 'undefined' && data instanceof FormData) {
    return Object.fromEntries(data.entries());
  }
  return data;
}

function parsePath(config) {
  let url = String(config.url || '');
  if (config.baseURL && url.startsWith(config.baseURL)) url = url.slice(config.baseURL.length);
  const [pathname, query] = url.split('?');
  const params = { ...(config.params || {}) };
  if (query) new URLSearchParams(query).forEach((value, key) => { params[key] = value; });
  const path = `/${pathname.replace(/^\/+/, '')}`.replace(/\/+$/, '') || '/';
  return { path, params };
}

function moneyNumber(value) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function nextId(rows) {
  return rows.reduce((max, row) => Math.max(max, Number(row.id || 0)), 0) + 1;
}

function nowIso() {
  return new Date().toISOString();
}

function getVehicles() {
  return readStore(KEYS.vehicles, () => seedVehicles);
}

function saveVehicles(rows) {
  writeStore(KEYS.vehicles, rows);
}

function getCollection(endpoint) {
  const collections = readStore(KEYS.collections, () => clone(defaultCollectionData));
  if (!Array.isArray(collections[endpoint])) collections[endpoint] = clone(defaultCollectionData[endpoint] || []);
  return collections[endpoint];
}

function saveCollection(endpoint, rows) {
  const collections = readStore(KEYS.collections, () => clone(defaultCollectionData));
  collections[endpoint] = rows;
  writeStore(KEYS.collections, collections);
}

function getSettings() {
  return readStore(KEYS.settings, () => defaultSettings);
}

function nextReference(bookings) {
  const year = new Date().getFullYear();
  const pattern = new RegExp(`^CR-${year}-(\\d+)$`);
  const next = bookings.reduce((max, booking) => {
    const match = pattern.exec(booking.reference || '');
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0) + 1;
  return `CR-${year}-${String(next).padStart(6, '0')}`;
}

function addMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function seedBookings() {
  const now = new Date();
  const make = (index, vehicle, customer, status, payment, pickupOffset, returnOffset, createdOffsetDays, rentalType = 'self_drive') => {
    const pickup = new Date(now);
    pickup.setDate(pickup.getDate() + pickupOffset);
    pickup.setHours(10, 0, 0, 0);
    const dropoff = new Date(now);
    dropoff.setDate(dropoff.getDate() + returnOffset);
    dropoff.setHours(10, 0, 0, 0);
    const days = Math.max(1, Math.ceil((dropoff - pickup) / 86400000));
    const quote = quoteFor(vehicle, pickup, dropoff, rentalType);
    return {
      id: index,
      reference: `CR-${now.getFullYear()}-${String(index).padStart(6, '0')}`,
      customer,
      vehicle: { id: vehicle.id, name: vehicle.name, slug: vehicle.slug },
      pickup_location: 'Lahore',
      dropoff_location: 'Lahore',
      pickup_at: pickup.toISOString(),
      return_at: dropoff.toISOString(),
      rental_type: rentalType,
      duration_days: days,
      base_price: quote.base_price,
      additional_charges: quote.additional_charges,
      discount: 0,
      total_price: quote.total,
      deposit: quote.deposit,
      payment_status: payment,
      status,
      customer_notes: 'Website demo booking',
      admin_notes: '',
      created_at: new Date(now.getTime() - createdOffsetDays * 86400000).toISOString(),
      _timeline: [
        { id: 1, to_status: 'Pending', from_status: null, note: 'Booking Created', created_at: new Date(now.getTime() - createdOffsetDays * 86400000).toISOString(), admin: null },
      ],
    };
  };

  const seed = [
    make(1, seedVehicles[0], { id: 1, full_name: 'Sample Customer', phone: '+92 300 0000000', email: 'sample@example.com' }, 'Pending', 'Payment Pending', 3, 5, 0.1),
    make(2, seedVehicles[2], { id: 2, full_name: 'Ahmed Khan', phone: '+92 321 5550001', email: 'ahmed@example.com' }, 'Confirmed', 'Paid', 10, 12, 12),
    make(3, seedVehicles[4], { id: 3, full_name: 'Sara Ahmed', phone: '+92 333 5550002', email: 'sara@example.com' }, 'Completed', 'Paid', -5, -3, 40),
    make(4, seedVehicles[1], { id: 2, full_name: 'Ahmed Khan', phone: '+92 321 5550001', email: 'ahmed@example.com' }, 'Completed', 'Paid', -20, -17, 70),
    make(5, seedVehicles[3], { id: 4, full_name: 'Usman Ali', phone: '+92 345 5550003', email: 'usman@example.com' }, 'Confirmed', 'Partially Paid', 18, 21, 4, 'with_driver'),
    make(6, seedVehicles[6], { id: 5, full_name: 'Mariam K.', phone: '+92 300 5550004', email: 'mariam@example.com' }, 'Cancelled', 'Refunded', -30, -28, 95),
  ];

  seed[1]._timeline.push({ id: 2, to_status: 'Confirmed', from_status: 'Pending', note: 'Confirmed by operations', created_at: seed[1].created_at, admin: { name: 'Crescent Administrator' } });
  seed[2]._timeline.push({ id: 2, to_status: 'Completed', from_status: 'In Progress', note: 'Vehicle returned', created_at: seed[2].created_at, admin: { name: 'Crescent Administrator' } });
  seed[3]._timeline.push({ id: 2, to_status: 'Completed', from_status: 'In Progress', note: 'Vehicle returned', created_at: seed[3].created_at, admin: { name: 'Crescent Administrator' } });
  return seed;
}

function getBookings() {
  return readStore(KEYS.bookings, seedBookings);
}

function saveBookings(rows) {
  writeStore(KEYS.bookings, rows);
}

function seedContacts() {
  return [
    { id: 1, name: 'Ahmed Khan', email: 'ahmed@example.com', phone: '+92 321 5550001', subject: 'Car Booking', message: 'I would like to confirm a Fortuner for next weekend.', status: 'New', created_at: nowIso() },
    { id: 2, name: 'Corporate Enquiry', email: 'ops@example.com', phone: '+92 300 1112233', subject: 'Corporate Rental', message: 'Please share monthly corporate rental options for our team.', status: 'Read', created_at: nowIso() },
  ];
}

function getContacts() {
  return readStore(KEYS.contacts, seedContacts);
}

function saveContacts(rows) {
  writeStore(KEYS.contacts, rows);
}

function seedAnalytics() {
  const days = ['/', '/cars', '/book', '/pricing', '/services', '/contact'];
  const events = [];
  const now = new Date();
  let id = 1;
  for (let day = 12; day >= 0; day -= 1) {
    const dayDate = new Date(now);
    dayDate.setDate(dayDate.getDate() - day);
    days.forEach((pagePath, index) => {
      if ((day + index) % 3 !== 0) {
        events.push({
          id: id++,
          event_name: 'page_view',
          session_id: `seed-session-${day}-${index}`,
          page_path: pagePath,
          page_title: pagePath === '/' ? 'Crescent Car Rental' : pagePath,
          target_label: null,
          target_href: null,
          content_type: 'page',
          content_id: null,
          referrer: null,
          metadata: {},
          occurred_at: new Date(dayDate.getTime() + index * 3600000).toISOString(),
        });
      }
    });
  }
  [['Book Now', '/book', 22], ['View Fleet', '/cars', 16], ['WhatsApp Us', null, 11], ['Call Crescent', null, 7]].forEach(([label, href, clicks], index) => {
    for (let count = 0; count < clicks; count += 1) {
      events.push({
        id: id++,
        event_name: 'cta_click',
        session_id: `seed-cta-${index}-${count}`,
        page_path: '/',
        page_title: 'Crescent Car Rental',
        target_label: label,
        target_href: href,
        content_type: 'page',
        content_id: null,
        referrer: null,
        metadata: {},
        occurred_at: new Date(now.getTime() - count * 7200000).toISOString(),
      });
    }
  });
  return events;
}

function getAnalytics() {
  return readStore(KEYS.analytics, seedAnalytics);
}

function saveAnalytics(rows) {
  writeStore(KEYS.analytics, rows.slice(-3000));
}

function parseDateTime(date, time) {
  const value = new Date(`${date}T${time || '10:00'}:00`);
  return value;
}

function quoteFor(vehicle, pickupAt, returnAt, rentalType = 'self_drive') {
  const minutes = Math.abs(returnAt - pickupAt) / 60000;
  const days = Math.max(1, Math.ceil(minutes / 1440));
  const daily = moneyNumber(vehicle.daily_price);
  const weekly = moneyNumber(vehicle.weekly_price) || daily * 7;
  const monthly = moneyNumber(vehicle.monthly_price) || weekly * 4;
  const dp = new Array(days + 1).fill(Number.POSITIVE_INFINITY);
  dp[0] = 0;
  for (let index = 0; index <= days; index += 1) {
    if (!Number.isFinite(dp[index])) continue;
    if (index + 1 <= days) dp[index + 1] = Math.min(dp[index + 1], dp[index] + daily);
    if (index + 7 <= days) dp[index + 7] = Math.min(dp[index + 7], dp[index] + weekly);
    if (index + 30 <= days) dp[index + 30] = Math.min(dp[index + 30], dp[index] + monthly);
  }
  const base = dp[days];
  const additional = rentalType === 'with_driver' ? moneyNumber(vehicle.driver_fee) * days : 0;
  return {
    duration_days: days,
    base_price: Math.round(base),
    additional_charges: Math.round(additional),
    discount: 0,
    deposit: moneyNumber(vehicle.deposit),
    total: Math.round(base + additional),
    currency: 'PKR',
  };
}

function isActiveBooking(booking) {
  return ['Pending', 'Confirmed', 'In Progress'].includes(booking.status);
}

function isVehicleAvailable(vehicleId, pickupAt, returnAt, bookings) {
  return !bookings.some((booking) => {
    if (String(booking.vehicle?.id) !== String(vehicleId) || !isActiveBooking(booking)) return false;
    const start = new Date(booking.pickup_at);
    const end = new Date(booking.return_at);
    return pickupAt < end && returnAt > start;
  });
}

function filterVehicles(list, { category, search, pickup_location: pickupLocation }) {
  return list.filter((vehicle) => {
    const matchesCategory = !category || String(category) === 'Any Category' || String(vehicle.category?.name || '').toLowerCase() === String(category).toLowerCase() || String(vehicle.category?.slug || '') === String(category).toLowerCase();
    const matchesLocation = !pickupLocation || String(vehicle.location?.name || '').toLowerCase() === String(pickupLocation).toLowerCase();
    const query = String(search || '').toLowerCase();
    const matchesSearch = !query || `${vehicle.name} ${vehicle.model} ${vehicle.brand?.name} ${vehicle.category?.name}`.toLowerCase().includes(query);
    return matchesCategory && matchesLocation && matchesSearch && vehicle.status === 'active';
  });
}

function computeDashboard() {
  const bookings = getBookings();
  const vehicles = getVehicles();
  const contacts = getContacts();
  const leadsData = getCollection('leads');
  const totalVehicles = vehicles.length;
  const availableVehicles = vehicles.filter((vehicle) => vehicle.status === 'active' && vehicle.operational_status === 'Available').length;
  const revenue = (statuses) => bookings.filter((booking) => statuses.includes(booking.status)).reduce((sum, booking) => sum + moneyNumber(booking.total_price), 0);

  const statusGroups = {};
  bookings.forEach((booking) => {
    statusGroups[booking.status] = (statusGroups[booking.status] || 0) + 1;
  });

  const monthlyMap = new Map();
  for (let index = 11; index >= 0; index -= 1) {
    const date = addMonths(new Date(), -index);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthlyMap.set(key, {
      month: date.toLocaleString('en-US', { month: 'short' }),
      period: key,
      bookings: 0,
      revenue: 0,
    });
  }
  bookings.forEach((booking) => {
    const created = new Date(booking.created_at || nowIso());
    const key = `${created.getFullYear()}-${String(created.getMonth() + 1).padStart(2, '0')}`;
    if (monthlyMap.has(key)) {
      const row = monthlyMap.get(key);
      row.bookings += 1;
      row.revenue += moneyNumber(booking.total_price);
    }
  });

  const fleetGroups = {};
  vehicles.forEach((vehicle) => {
    const key = vehicle.status === 'active' ? 'Available' : vehicle.status;
    fleetGroups[key] = (fleetGroups[key] || 0) + 1;
  });

  return {
    stats: {
      total_bookings: bookings.length,
      pending_bookings: bookings.filter((booking) => booking.status === 'Pending').length,
      confirmed_bookings: bookings.filter((booking) => booking.status === 'Confirmed').length,
      active_rentals: bookings.filter((booking) => booking.status === 'In Progress').length,
      completed_rentals: bookings.filter((booking) => booking.status === 'Completed').length,
      total_revenue: revenue(['Confirmed', 'In Progress', 'Completed']),
      completed_revenue: revenue(['Completed']),
      available_vehicles: availableVehicles,
      total_vehicles: totalVehicles,
      fleet_utilization: totalVehicles ? Math.round(((totalVehicles - availableVehicles) / totalVehicles) * 1000) / 10 : 0,
      new_contacts: contacts.filter((contact) => contact.status === 'New').length,
      new_leads: leadsData.filter((lead) => lead.status === 'New').length,
    },
    booking_statuses: Object.entries(statusGroups).map(([status, total]) => ({ status, total })),
    monthly_performance: Array.from(monthlyMap.values()),
    fleet_statuses: Object.entries(fleetGroups).map(([status, total]) => ({ status, total })),
    recent_bookings: [...bookings].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 8),
    recent_contacts: contacts.slice(0, 5),
    recent_leads: leadsData.slice(0, 5),
  };
}

function computeAnalytics() {
  const events = getAnalytics();
  const since = Date.now() - 30 * 86400000;
  const recent = events.filter((event) => new Date(event.occurred_at || event.created_at) >= since);
  const views = recent.filter((event) => event.event_name === 'page_view');
  const clicks = recent.filter((event) => ['button_click', 'cta_click'].includes(event.event_name));
  const sessions = new Set(recent.map((event) => event.session_id).filter(Boolean));

  const group = (rows, key) => {
    const map = new Map();
    rows.forEach((row) => {
      const value = row[key] || '—';
      map.set(value, (map.get(value) || 0) + 1);
    });
    return Array.from(map.entries());
  };

  const dailyMap = new Map();
  for (let index = 29; index >= 0; index -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - index);
    dailyMap.set(date.toISOString().slice(0, 10), 0);
  }
  views.forEach((event) => {
    const day = new Date(event.occurred_at || event.created_at).toISOString().slice(0, 10);
    if (dailyMap.has(day)) dailyMap.set(day, dailyMap.get(day) + 1);
  });

  return {
    stats: {
      page_views: views.length,
      unique_sessions: sessions.size,
      cta_clicks: clicks.length,
      blog_reads: recent.filter((event) => event.event_name === 'blog_read').length,
    },
    top_pages: group(views, 'page_path').map(([page_path, viewsCount]) => ({ page_path, views: viewsCount })).sort((a, b) => b.views - a.views).slice(0, 10),
    top_actions: group(clicks, 'target_label').map(([target_label, counts]) => ({ target_label, clicks: counts })).sort((a, b) => b.clicks - a.clicks).slice(0, 10),
    daily_views: Array.from(dailyMap.entries()).map(([day, viewsCount]) => ({ day, views: viewsCount })),
  };
}

function prepareVehicle(input) {
  const vehicle = { ...input };
  vehicle.main_image_url = vehicle.main_image || vehicle.main_image_url || '';
  if (!vehicle.slug && vehicle.name) vehicle.slug = String(vehicle.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  vehicle.daily_price = moneyNumber(vehicle.daily_price);
  vehicle.weekly_price = moneyNumber(vehicle.weekly_price);
  vehicle.monthly_price = moneyNumber(vehicle.monthly_price);
  vehicle.deposit = moneyNumber(vehicle.deposit);
  vehicle.seats = Number(vehicle.seats || 5);
  vehicle.doors = Number(vehicle.doors || 4);
  return vehicle;
}

function handleCollection(config, endpoint, method, body) {
  if (method === 'GET') {
    return ok(config, { data: getCollection(endpoint) });
  }
  if (method === 'POST') {
    const rows = getCollection(endpoint);
    const row = { ...body, id: nextId(rows), created_at: nowIso(), updated_at: nowIso() };
    if (!row.slug && (row.name || row.title)) row.slug = String(row.name || row.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    rows.unshift(row);
    saveCollection(endpoint, rows);
    return ok(config, { data: row }, 201);
  }
  if (method === 'PUT' || method === 'PATCH') {
    const id = config.url.split('/').pop();
    const rows = getCollection(endpoint);
    const index = rows.findIndex((row) => String(row.id) === String(id));
    if (index < 0) return fail(config, 404, 'Record not found.');
    rows[index] = { ...rows[index], ...body, id: rows[index].id, updated_at: nowIso() };
    saveCollection(endpoint, rows);
    return ok(config, { data: rows[index] });
  }
  if (method === 'DELETE') {
    const id = config.url.split('/').pop();
    const rows = getCollection(endpoint).filter((row) => String(row.id) !== String(id));
    saveCollection(endpoint, rows);
    return ok(config, { message: 'Deleted.' });
  }
  return fail(config, 405, 'Method not allowed.');
}

const COLLECTION_ENDPOINTS = [
  'services', 'locations', 'faqs', 'reviews', 'blog-posts', 'homepage-sections',
  'vehicle-brands', 'vehicle-categories', 'vehicle-features', 'customers', 'leads',
  'discounts', 'pricing-rules', 'pricing', 'notifications', 'activity', 'users', 'media', 'seo',
];

export async function handleStaticRequest(config) {
  const method = String(config.method || 'get').toUpperCase();
  const { path, params } = parsePath(config);
  const body = parseBody(config.data);

  /* Public catalogue */
  if (path === '/homepage' && method === 'GET') {
    const fleet = getVehicles().filter((vehicle) => vehicle.status === 'active');
    return ok(config, {
      data: {
        sections: getCollection('homepage-sections'),
        featured_vehicles: fleet.filter((vehicle) => vehicle.featured).slice(0, 6),
        services: getCollection('services').filter((service) => service.status !== 'inactive').slice(0, 6),
        locations: getCollection('locations').filter((location) => location.status !== 'inactive'),
        reviews: getCollection('reviews').filter((review) => review.status !== 'inactive').slice(0, 8),
        faqs: getCollection('faqs').filter((faq) => faq.status !== 'inactive').slice(0, 8),
      },
    });
  }

  if (path === '/featured-vehicles' && method === 'GET') {
    return ok(config, { data: getVehicles().filter((vehicle) => vehicle.status === 'active' && vehicle.featured) });
  }

  if (path === '/vehicles' && method === 'GET') {
    return ok(config, { data: filterVehicles(getVehicles(), params) });
  }

  if (/^\/vehicles\/[^/]+$/.test(path) && method === 'GET') {
    const slug = path.split('/').pop();
    const vehicle = getVehicles().find((row) => row.slug === slug || String(row.id) === slug);
    return vehicle ? ok(config, { data: vehicle }) : fail(config, 404, 'Vehicle not found.');
  }

  if (path === '/availability' && method === 'POST') {
    const pickupAt = parseDateTime(body.pickup_date, body.pickup_time);
    const returnAt = parseDateTime(body.return_date, body.return_time);
    if (Number.isNaN(pickupAt.getTime()) || Number.isNaN(returnAt.getTime()) || returnAt <= pickupAt) {
      return fail(config, 422, 'Return date/time must be after pickup date/time.');
    }
    const bookings = getBookings();
    const list = filterVehicles(getVehicles(), body).filter((vehicle) => isVehicleAvailable(vehicle.id, pickupAt, returnAt, bookings));
    return ok(config, { data: list });
  }

  if (path === '/pricing/quote' && method === 'POST') {
    const vehicle = getVehicles().find((row) => String(row.id) === String(body.vehicle_id));
    if (!vehicle) return fail(config, 422, 'Please select a valid vehicle.');
    const pickupAt = parseDateTime(body.pickup_date, body.pickup_time);
    const returnAt = parseDateTime(body.return_date, body.return_time);
    if (Number.isNaN(pickupAt.getTime()) || Number.isNaN(returnAt.getTime()) || returnAt <= pickupAt) {
      return fail(config, 422, 'Return date/time must be after pickup date/time.');
    }
    return ok(config, { data: quoteFor(vehicle, pickupAt, returnAt, body.rental_type) });
  }

  if (path === '/bookings' && method === 'POST') {
    const required = ['vehicle_id', 'pickup_date', 'return_date', 'pickup_time', 'return_time', 'full_name', 'phone'];
    const missing = required.find((field) => !body[field]);
    if (missing) return fail(config, 422, 'Please complete all required booking details.');
    const vehiclesList = getVehicles();
    const vehicle = vehiclesList.find((row) => String(row.id) === String(body.vehicle_id));
    if (!vehicle) return fail(config, 422, 'This vehicle is not currently available for booking.');
    const pickupAt = parseDateTime(body.pickup_date, body.pickup_time);
    const returnAt = parseDateTime(body.return_date, body.return_time);
    if (Number.isNaN(pickupAt.getTime()) || Number.isNaN(returnAt.getTime()) || returnAt <= pickupAt) {
      return fail(config, 422, 'Return date/time must be after pickup date/time.');
    }
    const bookings = getBookings();
    if (!isVehicleAvailable(vehicle.id, pickupAt, returnAt, bookings)) {
      return fail(config, 422, 'This vehicle has another active booking during the selected period.');
    }
    if (body.rental_type === 'with_driver' && !vehicle.driver_available) return fail(config, 422, 'This vehicle is not available with a driver.');
    if (body.rental_type !== 'with_driver' && !vehicle.self_drive_available) return fail(config, 422, 'This vehicle is not available for self drive.');
    const quote = quoteFor(vehicle, pickupAt, returnAt, body.rental_type);
    const booking = {
      id: nextId(bookings),
      reference: nextReference(bookings),
      customer: {
        id: nextId(getCollection('customers')),
        full_name: body.full_name,
        phone: body.phone,
        email: body.email || null,
        cnic: body.cnic || null,
        address: body.address || null,
      },
      vehicle: { id: vehicle.id, name: vehicle.name, slug: vehicle.slug },
      pickup_location: body.pickup_location,
      dropoff_location: body.dropoff_location,
      pickup_at: pickupAt.toISOString(),
      return_at: returnAt.toISOString(),
      rental_type: body.rental_type || 'self_drive',
      duration_days: quote.duration_days,
      base_price: quote.base_price,
      additional_charges: quote.additional_charges,
      discount: 0,
      total_price: quote.total,
      deposit: quote.deposit,
      payment_status: 'Payment Pending',
      status: 'Pending',
      customer_notes: body.notes || null,
      admin_notes: '',
      created_at: nowIso(),
      _timeline: [{ id: 1, to_status: 'Pending', from_status: null, note: 'Booking Created', created_at: nowIso(), admin: null }],
    };
    bookings.unshift(booking);
    saveBookings(bookings);

    const customersList = getCollection('customers');
    const existing = customersList.find((customer) => customer.phone === body.phone);
    if (existing) {
      existing.full_name = body.full_name;
      existing.email = body.email || existing.email;
      existing.bookings_count = Number(existing.bookings_count || 0) + 1;
    } else {
      customersList.unshift({ id: nextId(customersList), full_name: body.full_name, phone: body.phone, email: body.email || null, bookings_count: 1, status: 'active', created_at: nowIso() });
    }
    saveCollection('customers', customersList);
    return ok(config, { data: booking }, 201);
  }

  if (/^\/bookings\/reference\/[^/]+$/.test(path) && method === 'GET') {
    const reference = decodeURIComponent(path.split('/').pop());
    const booking = getBookings().find((row) => row.reference === reference);
    if (!booking) return fail(config, 404, 'Booking not found.');
    return ok(config, {
      data: {
        reference: booking.reference,
        vehicle: booking.vehicle,
        pickup_location: booking.pickup_location,
        dropoff_location: booking.dropoff_location,
        pickup_at: booking.pickup_at,
        return_at: booking.return_at,
        duration_days: booking.duration_days,
        total_price: booking.total_price,
        payment_status: booking.payment_status,
        status: booking.status,
      },
    });
  }

  if (path === '/contact' && method === 'POST') {
    if (!body.name || !body.phone || !body.message) return fail(config, 422, 'Please add your name, phone and message.');
    const contacts = getContacts();
    const contact = { ...body, id: nextId(contacts), status: 'New', created_at: nowIso() };
    contacts.unshift(contact);
    saveContacts(contacts);
    return ok(config, { message: 'Your message has been received.', data: contact }, 201);
  }

  if (path === '/leads' && method === 'POST') {
    return ok(config, { message: 'Lead received.', data: { id: nextId(getCollection('leads')), ...body, status: 'New', created_at: nowIso() } }, 201);
  }

  if (path === '/settings/public' && method === 'GET') {
    return ok(config, { data: getSettings() });
  }

  if (path === '/analytics/events' && method === 'POST') {
    const events = getAnalytics();
    events.push({ ...body, id: nextId(events), occurred_at: nowIso() });
    saveAnalytics(events);
    return ok(config, { message: 'Event recorded.' }, 201);
  }

  /* Public content */
  if (['/services', '/locations', '/faqs', '/reviews', '/blog'].includes(path) && method === 'GET') {
    const endpoint = path === '/blog' ? 'blog-posts' : path.slice(1);
    let rows = getCollection(endpoint);
    if (endpoint === 'blog-posts') rows = rows.filter((post) => post.status === 'published' || post.status === 'active');
    else rows = rows.filter((row) => row.status !== 'inactive');
    return ok(config, { data: rows });
  }

  const detailMatch = /^\/(services|locations|blog)\/([^/]+)$/.exec(path);
  if (detailMatch && method === 'GET') {
    const [, type, slug] = detailMatch;
    const endpoint = type === 'blog' ? 'blog-posts' : type;
    const row = getCollection(endpoint).find((item) => item.slug === slug || String(item.id) === slug);
    return row ? ok(config, { data: row }) : fail(config, 404, `${type.slice(0, -1)} not found.`);
  }

  /* Admin authentication */
  if (path === '/admin/login' && method === 'POST') {
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    if (!email || !password) return fail(config, 422, 'Email and password are required.');
    const isSeeded = email === 'admin@crescentrentacar.com' && password === 'ChangeMe123!';
    if (!isSeeded && password.length < 6) return fail(config, 422, 'The provided credentials are incorrect.');
    return ok(config, {
      token: `static-demo-token-${Date.now()}`,
      user: { id: 1, name: isSeeded ? 'Crescent Administrator' : 'Crescent Admin', email, role: 'super_admin' },
    });
  }

  if (path === '/admin/logout' && method === 'POST') {
    return ok(config, { message: 'Logged out.' });
  }

  /* Admin dashboard & analytics */
  if (path === '/admin/dashboard' && method === 'GET') return ok(config, { data: computeDashboard() });
  if (path === '/admin/analytics' && method === 'GET') return ok(config, { data: computeAnalytics() });
  if (path === '/admin/reports' && method === 'GET') {
    const bookings = getBookings();
    return ok(config, {
      data: {
        bookings_total: bookings.length,
        completed_revenue: bookings.filter((booking) => booking.status === 'Completed').reduce((sum, booking) => sum + moneyNumber(booking.total_price), 0),
      },
    });
  }

  /* Admin bookings */
  if (path === '/admin/bookings' && method === 'GET') {
    let rows = getBookings();
    if (params.status) rows = rows.filter((booking) => booking.status === params.status);
    if (params.payment_status) rows = rows.filter((booking) => booking.payment_status === params.payment_status);
    if (params.search) {
      const query = String(params.search).toLowerCase();
      rows = rows.filter((booking) => `${booking.reference} ${booking.customer?.full_name} ${booking.customer?.phone} ${booking.vehicle?.name}`.toLowerCase().includes(query));
    }
    return ok(config, { data: rows });
  }

  const timelineMatch = /^\/admin\/bookings\/([^/]+)\/timeline$/.exec(path);
  if (timelineMatch && method === 'GET') {
    const id = timelineMatch[1];
    const booking = getBookings().find((row) => String(row.id) === String(id));
    if (!booking) return fail(config, 404, 'Booking not found.');
    return ok(config, { data: [...(booking._timeline || [])].reverse() });
  }

  const bookingMatch = /^\/admin\/bookings\/([^/]+)$/.exec(path);
  if (bookingMatch && (method === 'PATCH' || method === 'PUT')) {
    const id = bookingMatch[1];
    const bookings = getBookings();
    const index = bookings.findIndex((row) => String(row.id) === String(id));
    if (index < 0) return fail(config, 404, 'Booking not found.');
    const booking = bookings[index];
    const previousStatus = booking.status;
    ['status', 'payment_status', 'admin_notes', 'handover_at', 'actual_return_at', 'handover_odometer', 'return_odometer'].forEach((field) => {
      if (body[field] !== undefined && body[field] !== null && body[field] !== '') booking[field] = body[field];
    });
    if (body.status && body.status !== previousStatus) {
      booking._timeline = booking._timeline || [];
      booking._timeline.push({
        id: nextId(booking._timeline),
        from_status: previousStatus,
        to_status: body.status,
        note: body.note || 'Status updated by operations',
        created_at: nowIso(),
        admin: { name: 'Crescent Administrator' },
      });
    }
    bookings[index] = booking;
    saveBookings(bookings);
    return ok(config, { data: booking });
  }

  /* Admin contacts */
  if (path === '/admin/contacts' && method === 'GET') return ok(config, { data: getContacts() });

  const contactMatch = /^\/admin\/contacts\/([^/]+)$/.exec(path);
  if (contactMatch && (method === 'PATCH' || method === 'PUT')) {
    const id = contactMatch[1];
    const contacts = getContacts();
    const index = contacts.findIndex((row) => String(row.id) === String(id));
    if (index < 0) return fail(config, 404, 'Contact not found.');
    contacts[index] = { ...contacts[index], ...body, id: contacts[index].id };
    saveContacts(contacts);
    return ok(config, { data: contacts[index] });
  }
  if (contactMatch && method === 'DELETE') {
    const id = contactMatch[1];
    saveContacts(getContacts().filter((row) => String(row.id) !== String(id)));
    return ok(config, { message: 'Contact deleted.' });
  }

  /* Admin settings */
  if (path === '/admin/settings' && method === 'GET') return ok(config, { data: getSettings() });
  if (path === '/admin/settings' && method === 'PUT') {
    const settings = { ...getSettings(), ...body };
    writeStore(KEYS.settings, settings);
    return ok(config, { message: 'Settings saved.', data: settings });
  }

  /* Admin fleet */
  if (path === '/admin/vehicles' && method === 'GET') {
    let rows = getVehicles();
    if (params.status) rows = rows.filter((vehicle) => vehicle.status === params.status);
    if (params.search) {
      const query = String(params.search).toLowerCase();
      rows = rows.filter((vehicle) => `${vehicle.name} ${vehicle.model} ${vehicle.brand?.name}`.toLowerCase().includes(query));
    }
    return ok(config, { data: rows });
  }

  if (path === '/admin/vehicles' && method === 'POST') {
    const rows = getVehicles();
    const vehicle = prepareVehicle({ ...body, id: nextId(rows), created_at: nowIso(), updated_at: nowIso() });
    rows.unshift(vehicle);
    saveVehicles(rows);
    return ok(config, { data: vehicle }, 201);
  }

  const adminVehicleMatch = /^\/admin\/vehicles\/([^/]+)$/.exec(path);
  if (adminVehicleMatch && (method === 'PUT' || method === 'PATCH')) {
    const id = adminVehicleMatch[1];
    const rows = getVehicles();
    const index = rows.findIndex((row) => String(row.id) === String(id));
    if (index < 0) return fail(config, 404, 'Vehicle not found.');
    rows[index] = prepareVehicle({ ...rows[index], ...body, id: rows[index].id, updated_at: nowIso() });
    saveVehicles(rows);
    return ok(config, { data: rows[index] });
  }
  if (adminVehicleMatch && method === 'DELETE') {
    const id = adminVehicleMatch[1];
    saveVehicles(getVehicles().filter((row) => String(row.id) !== String(id)));
    return ok(config, { message: 'Deleted.' });
  }

  /* Generic admin collections */
  const collectionMatch = /^\/admin\/([a-z0-9-]+)(?:\/([^/]+))?$/.exec(path);
  if (collectionMatch) {
    const [, endpoint, id] = collectionMatch;
    if (COLLECTION_ENDPOINTS.includes(endpoint)) {
      const normalizedEndpoint = endpoint === 'pricing' ? 'pricing-rules' : endpoint;
      if (id && method === 'GET') {
        const row = getCollection(normalizedEndpoint).find((item) => String(item.id) === String(id));
        return row ? ok(config, { data: row }) : fail(config, 404, 'Record not found.');
      }
      if (id) {
        const fakeConfig = { ...config, url: `/admin/${normalizedEndpoint}/${id}` };
        return handleCollection(fakeConfig, normalizedEndpoint, method, body);
      }
      return handleCollection(config, normalizedEndpoint, method, body);
    }
  }

  return fail(config, 404, `No static handler found for ${method} ${path}.`);
}
