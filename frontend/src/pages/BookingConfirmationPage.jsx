import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Phone, MessageCircle, CalendarCheck, Car, MapPin } from 'lucide-react';
import api from '../services/api';
import SeoHead from '../components/SeoHead';
import Button from '../components/Button';
import brand from '../config/brandConfig';

export default function BookingConfirmationPage() {
  const { reference } = useParams();
  const [b, setB] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem(`booking_${reference}`));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!b) {
      api.get(`/bookings/reference/${reference}`)
        .then((r) => setB(r.data.data || r.data))
        .catch(() => {});
    }
  }, [reference]);

  return (
    <section className="confirmation-page">
      <SeoHead
        title={`Booking ${reference} | Crescent Car Rental`}
        description={`Your booking request ${reference} has been received. Crescent Car Rental will follow up with confirmation details.`}
        noindex
      />
      <div className="confirmation-card">
        <div className="confirmation-icon">
          <CheckCircle2 />
        </div>
        <span className="eyebrow">Booking received</span>
        <h1>Your next story is in motion.</h1>
        <p>Your booking request has been recorded successfully. Our team will review your request and follow up with confirmation details, pricing and handover information.</p>

        <div className="reference-box">
          <span>Booking Reference</span>
          <strong>{reference}</strong>
        </div>

        {b && (
          <div className="confirmation-details">
            <span>
              <Car size={18} />
              <small>Vehicle</small>
              <strong>{b.vehicle?.name || b.vehicle_name || 'Selected vehicle'}</strong>
            </span>
            <span>
              <CheckCircle2 size={18} />
              <small>Status</small>
              <strong>{b.status || 'Pending'}</strong>
            </span>
            <span>
              <CalendarCheck size={18} />
              <small>Estimated total</small>
              <strong>
                {b.total_price
                  ? `PKR ${Number(b.total_price).toLocaleString()}`
                  : 'To be confirmed'}
              </strong>
            </span>
          </div>
        )}

        <div className="confirmation-next-steps">
          <h3>What happens next?</h3>
          <div className="confirmation-steps-list">
            <div>
              <span>01</span>
              <div>
                <strong>Review</strong>
                <p>Our team reviews your booking details and checks availability.</p>
              </div>
            </div>
            <div>
              <span>02</span>
              <div>
                <strong>Confirm</strong>
                <p>We will contact you with final pricing, vehicle condition and handover details.</p>
              </div>
            </div>
            <div>
              <span>03</span>
              <div>
                <strong>Drive</strong>
                <p>Pick up your vehicle and enjoy your journey with Crescent.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="confirmation-contact">
          <h3>Need immediate help?</h3>
          <div className="confirmation-contact-actions">
            <Button as="a" href={brand.phoneHref} variant="ghost" size="lg">
              <Phone size={18} /> Call {brand.phoneDisplay}
            </Button>
            <Button
              as="a"
              href={`https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(`Hello, I have a booking reference: ${reference}. I need assistance.`)}`}
              variant="whatsapp"
              size="lg"
            >
              <MessageCircle size={18} /> WhatsApp Us
            </Button>
          </div>
        </div>

        <div className="confirmation-actions">
          <Button as="link" to="/cars" variant="red" size="lg" magnetic>
            Explore More Cars <ArrowRight size={18} />
          </Button>
          <Button as="link" to="/" variant="ghost" size="lg">
            Back to Home
          </Button>
        </div>
      </div>
    </section>
  );
}
