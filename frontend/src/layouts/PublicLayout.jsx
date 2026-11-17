import { Outlet, Link } from 'react-router-dom';
import { Phone, MessageCircle, CalendarDays } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SiteSidebar from '../components/SiteSidebar';
import SmoothScrollProvider from '../components/SmoothScrollProvider';
import BackToTop from '../components/BackToTop';
import WhatsAppChat from '../components/WhatsAppChat';
import Button from '../components/Button';
import brand from '../config/brandConfig';
import { trackEvent } from '../services/analytics';

export default function PublicLayout() {
 return <>
  <SmoothScrollProvider/><Navbar/><SiteSidebar/><main><Outlet/></main><Footer/><BackToTop/><WhatsAppChat/>
  <div className="mobile-sticky-cta">
   <a href={brand.phoneHref} onClick={() => trackEvent('phone_click')}><Phone size={18}/><span>Call</span></a>
   <a href={`https://wa.me/${brand.whatsappNumber}`} target="_blank" rel="noreferrer" onClick={() => trackEvent('whatsapp_click')}><MessageCircle size={18}/><span>WhatsApp</span></a>
   <Button as="link" to="/book" variant="red"><CalendarDays size={18}/><span>Book Now</span></Button>
  </div>
 </>;
}
