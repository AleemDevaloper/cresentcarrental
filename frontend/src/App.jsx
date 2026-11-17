import { useEffect, lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import CustomCursor from './components/CustomCursor';
import { trackEvent } from './services/analytics';

const HomePage=lazy(()=>import('./pages/HomePage'));
const CarsPage=lazy(()=>import('./pages/CarsPage'));
const CarDetailPage=lazy(()=>import('./pages/CarDetailPage'));
const BookingPage=lazy(()=>import('./pages/BookingPage'));
const BookingConfirmationPage=lazy(()=>import('./pages/BookingConfirmationPage'));
const ContactPage=lazy(()=>import('./pages/ContactPage'));
const AdminLoginPage=lazy(()=>import('./pages/AdminLoginPage'));
const AdminDashboardPage=lazy(()=>import('./pages/AdminDashboardPage'));
const AdminBookingsPage=lazy(()=>import('./pages/AdminBookingsPage'));
const AdminVehiclesPage=lazy(()=>import('./pages/AdminVehiclesPage'));
const AdminContactsPage=lazy(()=>import('./pages/AdminContactsPage'));
const AdminCollectionManagerPage=lazy(()=>import('./pages/AdminCollectionManagerPage'));
const AdminReportsPage=lazy(()=>import('./pages/AdminReportsPage'));
const AdminAnalyticsPage=lazy(()=>import('./pages/AdminAnalyticsPage'));
const AdminSettingsPage=lazy(()=>import('./pages/AdminSettingsPage'));
const NotFoundPage=lazy(()=>import('./pages/NotFoundPage'));
const simple=()=>import('./pages/SimpleContentPages');
const AboutPage=lazy(()=>simple().then(m=>({default:m.AboutPage})));
const ServicesPage=lazy(()=>simple().then(m=>({default:m.ServicesPage})));
const ServiceDetailPage=lazy(()=>simple().then(m=>({default:m.ServiceDetailPage})));
const LocationsPage=lazy(()=>simple().then(m=>({default:m.LocationsPage})));
const LocationDetailPage=lazy(()=>simple().then(m=>({default:m.LocationDetailPage})));
const PricingPage=lazy(()=>simple().then(m=>({default:m.PricingPage})));
const FaqPage=lazy(()=>simple().then(m=>({default:m.FaqPage})));
const BlogPage=lazy(()=>simple().then(m=>({default:m.BlogPage})));
const BlogDetailPage=lazy(()=>simple().then(m=>({default:m.BlogDetailPage})));
const StaticPage=lazy(()=>simple().then(m=>({default:m.StaticPage})));
const ReviewsPage=lazy(()=>simple().then(m=>({default:m.ReviewsPage})));
const RentalRequirementsPage=lazy(()=>simple().then(m=>({default:m.RentalRequirementsPage})));
const MarketingPage=lazy(()=>import('./pages/MarketingPages'));

function AdminGuard({children}){const token=localStorage.getItem('crescent_admin_token')||sessionStorage.getItem('crescent_admin_token');return token?children:<Navigate to="/admin/login" replace/>}

function Loading(){
 return <div className="route-loading" role="status" aria-live="polite" aria-label="Loading Crescent Car Rental">
  <div className="loader-bg-grid" aria-hidden="true"/>
  <div className="loader-bg-glow" aria-hidden="true"/>
  <div className="loader-brand">
   <div className="loader-mark" aria-hidden="true">
    <span className="loader-mark-ring"/>
    <span className="loader-mark-ring loader-mark-ring--2"/>
    <strong>C</strong>
   </div>
   <div className="loader-word" aria-hidden="true">
    <strong>Crescent</strong>
    <em>Car Rental</em>
   </div>
   <div className="loader-bar-track"><div className="loader-bar-fill"/></div>
   <small>Drive your next story</small>
  </div>
 </div>;
}

export default function App(){
 const location=useLocation();

 useEffect(()=>{
  if(typeof IntersectionObserver==='undefined') return;
  const nodes=document.querySelectorAll('.reveal-left, .reveal-right, .reveal-bottom, .reveal-top, .reveal-scale, .reveal-fade');
  if(!nodes.length) return;
  const io=new IntersectionObserver((entries)=>{
   entries.forEach((e)=>{ if(e.isIntersecting){ e.target.classList.add('is-inview'); io.unobserve(e.target); } });
  },{threshold:0.15, rootMargin:'0px 0px -6% 0px'});
  nodes.forEach((n)=>io.observe(n));
  return ()=>io.disconnect();
 },[location.pathname]);

 useEffect(() => {
  const path = location.pathname + location.search;
  if (location.pathname.startsWith('/admin')) return undefined;
  trackEvent('page_view', {
   target_label: document.title,
   content_type: location.pathname.startsWith('/blog/') ? 'blog' : 'page',
  });

  const handleClick = (event) => {
   if (location.pathname.startsWith('/admin')) return;
   const target = event.target.closest?.('a,button');
   if (!target) return;
   const label = (target.getAttribute('aria-label') || target.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 255);
   if (!label) return;
   trackEvent(target.tagName.toLowerCase() === 'a' ? 'cta_click' : 'button_click', {
    target_label: label,
    target_href: target.getAttribute('href') || null,
    metadata: { path },
   });
  };
  document.addEventListener('click', handleClick, true);
  return () => document.removeEventListener('click', handleClick, true);
 }, [location.pathname, location.search]);

 return <><CustomCursor/><ScrollToTop/><ErrorBoundary><Suspense fallback={<Loading/>}><Routes>
  <Route element={<PublicLayout/>}>
   <Route path="/" element={<HomePage/>}/><Route path="/home" element={<Navigate to="/" replace/>}/>
   <Route path="/about" element={<AboutPage/>}/><Route path="/cars" element={<CarsPage/>}/><Route path="/cars/:slug" element={<CarDetailPage/>}/>
   <Route path="/services" element={<ServicesPage/>}/><Route path="/services/:slug" element={<ServiceDetailPage/>}/>
   <Route path="/locations" element={<LocationsPage/>}/><Route path="/locations/:slug" element={<LocationDetailPage/>}/>
   <Route path="/pricing" element={<PricingPage/>}/><Route path="/book" element={<BookingPage/>}/><Route path="/contact" element={<ContactPage/>}/>
   <Route path="/faq" element={<FaqPage/>}/><Route path="/blog" element={<BlogPage/>}/><Route path="/blog/:slug" element={<BlogDetailPage/>}/>
   <Route path="/reviews" element={<ReviewsPage/>}/><Route path="/rental-requirements" element={<RentalRequirementsPage/>}/>
   <Route path="/privacy-policy" element={<StaticPage type="privacy"/>}/><Route path="/privacy" element={<StaticPage type="privacy"/>}/>
   <Route path="/terms-and-conditions" element={<StaticPage type="terms"/>}/><Route path="/terms" element={<StaticPage type="terms"/>}/>
   <Route path="/security" element={<StaticPage type="security"/>}/><Route path="/accessibility" element={<StaticPage type="accessibility"/>}/><Route path="/sitemap" element={<StaticPage type="sitemap"/>}/>
   <Route path="/offers" element={<MarketingPage type="offers"/>}/><Route path="/gallery" element={<MarketingPage type="gallery"/>}/>
   <Route path="/corporate-car-rental" element={<MarketingPage type="corporate"/>}/><Route path="/monthly-car-rental" element={<MarketingPage type="monthly"/>}/>
   <Route path="/airport-transfer" element={<MarketingPage type="airport"/>}/><Route path="/chauffeur-service" element={<MarketingPage type="chauffeur"/>}/>
   <Route path="/airport-car-rental" element={<MarketingPage type="airport"/>}/>
   <Route path="/wedding-car-rental" element={<MarketingPage type="wedding"/>}/>
   <Route path="/self-drive-car-rental" element={<MarketingPage type="selfdrive"/>}/>
   <Route path="/outstation-car-rental" element={<MarketingPage type="outstation"/>}/>
   <Route path="/booking-confirmation/:reference" element={<BookingConfirmationPage/>}/>
   {['car-rental-lahore','car-rental-islamabad','fortuner-for-rent','yaris-for-rent','luxury-car-rental'].map(slug=><Route key={slug} path={`/${slug}`} element={<LocationDetailPage/>}/>)}
  </Route>
  <Route path="/admin/login" element={<AdminLoginPage/>}/>
  <Route path="/admin" element={<AdminGuard><AdminLayout/></AdminGuard>}>
   <Route index element={<AdminDashboardPage/>}/><Route path="bookings" element={<AdminBookingsPage/>}/><Route path="vehicles" element={<AdminVehiclesPage/>}/><Route path="contacts" element={<AdminContactsPage/>}/>
   <Route path="services" element={<AdminCollectionManagerPage title="Services" endpoint="services" fields={['title','slug','description','status']}/>}/>
   <Route path="locations" element={<AdminCollectionManagerPage title="Locations" endpoint="locations" fields={['name','slug','description','status']}/>}/>
   <Route path="faqs" element={<AdminCollectionManagerPage title="FAQs" endpoint="faqs" fields={['question','answer','category','status']}/>}/>
   <Route path="reviews" element={<AdminCollectionManagerPage title="Reviews" endpoint="reviews" fields={['customer_name','review','rating','status']}/>}/>
   <Route path="blog" element={<AdminCollectionManagerPage title="Blog Posts" endpoint="blog-posts" fields={['title','slug','excerpt','status']}/>}/>
   <Route path="homepage" element={<AdminCollectionManagerPage title="Homepage Sections" endpoint="homepage-sections" fields={['key','title','subtitle','status']}/>}/>
   <Route path="settings" element={<AdminSettingsPage/>}/>
   <Route path="brands" element={<AdminCollectionManagerPage title="Vehicle Brands" endpoint="vehicle-brands" fields={['name','slug','status','sort_order']}/>}/>
   <Route path="categories" element={<AdminCollectionManagerPage title="Vehicle Categories" endpoint="vehicle-categories" fields={['name','slug','description','status','sort_order']}/>}/>
   <Route path="features" element={<AdminCollectionManagerPage title="Vehicle Features" endpoint="vehicle-features" fields={['name','icon','status']}/>}/>
   <Route path="leads" element={<AdminCollectionManagerPage title="Leads" endpoint="leads" fields={['name','phone','email','source','status']}/>}/>
   <Route path="discounts" element={<AdminCollectionManagerPage title="Discounts" endpoint="discounts" fields={['name','code','type','value','status']}/>}/>
   <Route path="reports" element={<AdminReportsPage/>}/>
   <Route path="analytics" element={<AdminAnalyticsPage/>}/>
    <Route path="notifications" element={<AdminCollectionManagerPage title="Notifications" endpoint="notifications" fields={['title','message','type','status']} readOnly/>}/>
    <Route path="activity" element={<AdminCollectionManagerPage title="Activity Logs" endpoint="activity" fields={['action','description','user_id','created_at']} readOnly/>}/>
    <Route path="users" element={<AdminCollectionManagerPage title="Admin Users" endpoint="users" fields={['name','email','role','is_active']}/>}/>
    <Route path="customers" element={<AdminCollectionManagerPage title="Customers" endpoint="customers" fields={['full_name','phone','email','bookings_count']}/>}/>
    <Route path="pricing" element={<AdminCollectionManagerPage title="Pricing Rules" endpoint="pricing-rules" fields={['name','type','amount','percentage','status']}/>}/>
    <Route path="media" element={<AdminCollectionManagerPage title="Media Library" endpoint="media" fields={['filename','path','alt_text','mime_type']} readOnly/>}/>
    <Route path="seo" element={<AdminCollectionManagerPage title="SEO Metadata" endpoint="seo" fields={['route','seo_title','meta_description','og_image']}/>}/>
  </Route>
  <Route path="*" element={<NotFoundPage/>}/>
 </Routes></Suspense></ErrorBoundary></>;
}
