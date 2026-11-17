import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Clock3, Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import api from '../services/api';
import SeoHead from '../components/SeoHead';
import brand from '../config/brandConfig';
import WhatsAppButton from '../components/WhatsAppButton';
import Button from '../components/Button';
import { Reveal, Stagger, TextReveal } from '../animation';

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const [msg, setMsg] = useState('');
  const [sentOk, setSentOk] = useState(false);

  const submit = async (data) => {
    setMsg('');
    setSentOk(false);
    try {
      await api.post('/contact', data);
      reset();
      setSentOk(true);
      setMsg('Thanks - your message has been received. Our team can now follow up.');
    } catch (error) {
      setSentOk(false);
      setMsg(error.userMessage);
    }
  };

  return (
    <>
      <SeoHead
        title="Contact Crescent Car Rental | Call, WhatsApp & Email"
        description="Contact Crescent Car Rental in Lahore — call +92 300 6277997, chat on WhatsApp or send a booking enquiry. DHA Phase 1 office, open 24/7."
        keywords="contact car rental Lahore, rent a car phone number, crescent car rental WhatsApp, DHA Lahore car rental"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'ContactPage',
          mainEntity: {
            '@type': 'Organization',
            name: brand.brandName,
            telephone: brand.phoneDisplay,
            email: brand.email,
            address: { '@type': 'PostalAddress', streetAddress: brand.address, addressCountry: 'PK' },
            openingHours: 'Mo-Su 00:00-23:59',
          },
        }}
      />
      <section className="page-hero contact-hero">
        <div className="container-xxl">
          <Reveal anim="fade"><span className="eyebrow">Contact Crescent</span></Reveal>
          <TextReveal as="h1" text="Tell us where you want to go." />
          <Reveal anim="up" delay={0.2}>
            <p>Questions, corporate needs or a specific rental request - our team is ready to help you choose the right vehicle and route. We typically respond within about 30 minutes.</p>
          </Reveal>
        </div>
      </section>

      <section className="section section-white">
        <div className="container-xxl contact-grid">
          <Reveal anim="left">
            <span className="eyebrow">Get in touch</span>
            <h2>One conversation away from the right ride.</h2>
            <p className="lead-muted">Use the form or contact us directly. Every website submission is stored for the operations team to review and manage.</p>
            <div className="contact-methods">
              <a href={brand.phoneHref}><Phone /><div><small>Call</small><strong>{brand.phoneDisplay}</strong></div></a>
              <a href={`https://wa.me/${brand.whatsappNumber}`} target="_blank" rel="noreferrer"><MessageCircle /><div><small>WhatsApp</small><strong>Chat with our team</strong></div></a>
              <a href={`mailto:${brand.email}`}><Mail /><div><small>Email</small><strong>{brand.email}</strong></div></a>
              <div><MapPin /><div><small>Office</small><strong>{brand.addressShort}</strong></div></div>
              <div><Clock3 /><div><small>Hours</small><strong>{brand.hours} — always available</strong></div></div>
            </div>
            <div style={{ marginTop: 16 }}><span className="contact-hours"><Clock3 size={14} /> Typical reply in ~30 minutes</span></div>
            <WhatsAppButton className="mt-4" label="Start a WhatsApp chat" />
          </Reveal>

          <Reveal anim="right">
            <form className="contact-form elevated-form" onSubmit={handleSubmit(submit)}>
              <div className="form-card-head">
                <span className="eyebrow">Send a request</span>
                <h3>We will route it to the right team.</h3>
              </div>
              <label><span>Name</span><input {...register('name', { required: true })} /></label>
              <label><span>Email</span><input type="email" {...register('email')} /></label>
              <label><span>Phone</span><input {...register('phone', { required: true })} /></label>
              <label>
                <span>Subject</span>
                <select {...register('subject')}>
                  <option>Car Booking</option>
                  <option>General Inquiry</option>
                  <option>Corporate Rental</option>
                  <option>Wedding Car Rental</option>
                  <option>Feedback</option>
                  <option>Support</option>
                </select>
              </label>
              <label><span>Message</span><textarea rows="6" {...register('message', { required: true })} /></label>
              {msg && <div className="form-message" role={sentOk ? 'status' : 'alert'}>{msg}</div>}
              <Button
                type="submit"
                variant="red"
                size="lg"
                loading={isSubmitting}
                success={sentOk ? 'Message Sent' : false}
                magnetic
              >
                Send Message
              </Button>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
