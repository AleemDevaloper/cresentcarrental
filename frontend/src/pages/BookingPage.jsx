import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CalendarCheck, CheckCircle2, Clock3, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import SeoHead from '../components/SeoHead';
import Button from '../components/Button';
import brand from '../config/brandConfig';

export default function BookingPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [quote, setQuote] = useState(null);
  const [serverError, setServerError] = useState('');
  const [submitOk, setSubmitOk] = useState(false);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      vehicle_id: params.get('vehicle') || '',
      pickup_location: 'Lahore',
      dropoff_location: 'Lahore',
      pickup_time: '10:00',
      return_time: '10:00',
      rental_type: 'self_drive',
    },
  });

  useEffect(() => {
    api.get('/vehicles').then((response) => setVehicles(response.data.data || [])).catch(() => {});
  }, []);

  const values = watch();

  useEffect(() => {
    if (!values.vehicle_id || !values.pickup_date || !values.return_date) return undefined;
    const timeout = setTimeout(() => {
      api.post('/pricing/quote', values)
        .then((response) => setQuote(response.data.data || response.data))
        .catch(() => setQuote(null));
    }, 500);
    return () => clearTimeout(timeout);
  }, [values.vehicle_id, values.pickup_date, values.return_date, values.pickup_time, values.return_time, values.rental_type]);

  const submit = async (data) => {
    setServerError('');
    setSubmitOk(false);
    try {
      const response = await api.post('/bookings', data);
      const booking = response.data.data || response.data;
      sessionStorage.setItem(`booking_${booking.reference}`, JSON.stringify(booking));
      setSubmitOk(true);
      navigate(`/booking-confirmation/${booking.reference}`);
    } catch (error) {
      setServerError(error.userMessage);
      setSubmitOk(false);
    }
  };

  return (
    <>
      <SeoHead
        title="Book a Rental Car Online | Crescent Car Rental Lahore"
        description="Request your Crescent Car Rental booking online — choose a vehicle, dates and locations for Lahore, Islamabad or intercity travel. Clear quotes and fast follow-up."
        keywords="book rental car Lahore, rent a car online Pakistan, car booking request, monthly car rental booking"
      />
      <section className="page-hero compact booking-hero">
        <div className="container-xxl">
          <span className="eyebrow">Request a booking</span>
          <h1>Choose the details.<br />We will handle the drive.</h1>
          <p>Submit your journey details, receive a booking reference, and let the Crescent team confirm the final handover.</p>
          <div className="hero-proof-row">
            <span><CalendarCheck size={17} /> Real dates</span>
            <span><ShieldCheck size={17} /> Conflict checked</span>
            <span><Clock3 size={17} /> Fast response</span>
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container-xxl booking-page-grid">
          <form className="booking-form-card elevated-form" onSubmit={handleSubmit(submit)}>
            <div className="form-section">
              <span>01</span>
              <div><h3>Rental details</h3><p>Tell us when, where and what you want to drive.</p></div>
            </div>
            <div className="form-grid">
              <label className="full"><span>Vehicle</span><select {...register('vehicle_id', { required: 'Please select a vehicle' })}><option value="">Select a vehicle</option>{vehicles.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.name}</option>)}</select>{errors.vehicle_id && <small>{errors.vehicle_id.message}</small>}</label>
              <label><span>Pickup location</span><input {...register('pickup_location', { required: true })} /></label>
              <label><span>Drop-off location</span><input {...register('dropoff_location', { required: true })} /></label>
              <label><span>Pickup date</span><input type="date" {...register('pickup_date', { required: true })} /></label>
              <label><span>Pickup time</span><input type="time" {...register('pickup_time', { required: true })} /></label>
              <label><span>Return date</span><input type="date" {...register('return_date', { required: true })} /></label>
              <label><span>Return time</span><input type="time" {...register('return_time', { required: true })} /></label>
              <label className="full"><span>Rental type</span><select {...register('rental_type')}><option value="self_drive">Self Drive</option><option value="with_driver">With Driver</option></select></label>
            </div>

            <div className="form-section mt-5">
              <span>02</span>
              <div><h3>Your information</h3><p>We use these details to contact you about this request.</p></div>
            </div>
            <div className="form-grid">
              <label><span>Full name</span><input {...register('full_name', { required: 'Full name is required' })} /></label>
              <label><span>Phone</span><input {...register('phone', { required: 'Phone is required' })} /></label>
              <label><span>Email</span><input type="email" {...register('email')} /></label>
              <label><span>CNIC / ID</span><input {...register('cnic')} /></label>
              <label className="full"><span>Address</span><input {...register('address')} /></label>
              <label className="full"><span>Notes</span><textarea rows="4" {...register('notes')} /></label>
            </div>
            {serverError && <div className="form-error" role="alert">{serverError}</div>}
            <Button
              type="submit"
              variant="red"
              size="lg"
              fullWidth
              className="mt-4"
              loading={isSubmitting}
              success={submitOk ? 'Booking Submitted' : false}
              magnetic
            >
              Submit Booking Request
            </Button>
          </form>

          <aside className="booking-summary-card premium-summary">
            <span className="eyebrow">Live estimate</span>
            <h3>Booking summary</h3>
            {quote ? (
              <>
                <div className="summary-row"><span>Rental duration</span><strong>{quote.duration_days} day(s)</strong></div>
                <div className="summary-row"><span>Base price</span><strong>{brand.currency} {Number(quote.base_price || 0).toLocaleString()}</strong></div>
                <div className="summary-row"><span>Additional charges</span><strong>{brand.currency} {Number(quote.additional_charges || 0).toLocaleString()}</strong></div>
                <div className="summary-total"><span>Estimated total</span><strong>{brand.currency} {Number(quote.total || 0).toLocaleString()}</strong></div>
              </>
            ) : <p className="muted">Select a vehicle and your dates to see a clear price estimate.</p>}
            <div className="booking-assurance"><ShieldCheck /><div><strong>Availability protected</strong><p>We check your dates again before confirming the booking, so your car is held for you.</p></div></div>
            <div className="booking-assurance"><CheckCircle2 /><div><strong>No silent double booking</strong><p>Overlapping active rentals are blocked by the availability service.</p></div></div>
          </aside>
        </div>
      </section>
    </>
  );
}
