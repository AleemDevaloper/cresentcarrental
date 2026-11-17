import { useForm } from 'react-hook-form';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

const defaultLocations = ['Lahore', 'Islamabad', 'Hunza', 'Skardu'];
const categories = ['Any Category', 'Economy', 'Sedan', 'SUV', 'Luxury'];

export default function BookingSearchWidget({ locations = [], compact = false }) {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const options = locations.length ? locations.map(x => x.name) : defaultLocations;
  const submit = (data) => {
    const params = new URLSearchParams(Object.entries(data).filter(([,v]) => v));
    navigate(`/cars?${params.toString()}`);
  };
  return <form className={`booking-widget ${compact ? 'is-compact' : ''}`} onSubmit={handleSubmit(submit)}>
    <div className="booking-widget-title"><span>Find your next drive</span><small>Live availability & pricing</small></div>
    <label><span>Pickup Location</span><select {...register('pickup_location')} defaultValue="Lahore">{options.map(x=><option key={x}>{x}</option>)}</select></label>
    <label><span>Drop-off Location</span><select {...register('dropoff_location')} defaultValue="Lahore">{options.map(x=><option key={x}>{x}</option>)}</select></label>
    <label><span>Pickup Date</span><input type="date" {...register('pickup_date')} /></label>
    <label><span>Pickup Time</span><input type="time" {...register('pickup_time')} defaultValue="10:00" /></label>
    <label><span>Return Date</span><input type="date" {...register('return_date')} /></label>
    <label><span>Return Time</span><input type="time" {...register('return_time')} defaultValue="10:00" /></label>
    <label><span>Vehicle Category</span><select {...register('category')}>{categories.map(x=><option key={x} value={x==='Any Category'?'':x}>{x}</option>)}</select></label>
    <Button type="submit" variant="red" className="booking-search" magnetic>
      <Search size={18}/> Search Cars
    </Button>
  </form>;
}
