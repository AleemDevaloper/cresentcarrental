import { Link } from 'react-router-dom';
import { Fuel, Gauge, Users, Settings2, ArrowUpRight } from 'lucide-react';
import brand from '../config/brandConfig';
import Button from './Button';
import SmartImage from './SmartImage';

function money(value) { return `${brand.currency} ${Number(value || 0).toLocaleString()}`; }

const fallbackImages = [
  'assets/fleet/hero-sedan.webp',
  'assets/fleet/luxury-sedan.webp',
  'assets/fleet/luxury-suv.webp',
  'assets/fleet/sports-coupe.webp',
  'assets/fleet/luxury-suv.webp',
  'assets/fleet/executive-sedan.webp',
  'assets/fleet/sports-car.webp',
  'assets/fleet/executive-drive.webp',
];

function fallbackFor(vehicle) {
  const key = String(vehicle.slug || vehicle.name || vehicle.id || 'crescent');
  const index = [...key].reduce((sum, char) => sum + char.charCodeAt(0), 0) % fallbackImages.length;
  return fallbackImages[index];
}

export default function VehicleCard({ vehicle }) {
  const image = vehicle.main_image_url || vehicle.main_image || fallbackFor(vehicle);
  return <article className="vehicle-card">
    <div className="vehicle-card-media">
      <SmartImage src={image} alt={vehicle.name || 'Rental vehicle'} width={640} height={404} sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 360px" />
      {vehicle.featured && <span className="vehicle-badge">Featured</span>}
    </div>
    <div className="vehicle-card-body">
      <div className="vehicle-card-title"><div><span>{vehicle.category?.name || vehicle.category || 'Premium'}</span><h3>{vehicle.name}</h3></div><div className="vehicle-price"><strong>{money(vehicle.daily_price)}</strong><small>/ day</small></div></div>
      <div className="vehicle-specs">
        <span><Users size={15}/>{vehicle.seats || 5} Seats</span>
        <span><Settings2 size={15}/>{vehicle.transmission || 'Automatic'}</span>
        <span><Fuel size={15}/>{vehicle.fuel_type || 'Petrol'}</span>
        <span><Gauge size={15}/>{vehicle.mileage_policy || 'Standard'}</span>
      </div>
      <div className="vehicle-card-actions">
        <Link className="text-link" to={`/cars/${vehicle.slug || vehicle.id}`}>View details <ArrowUpRight size={16}/></Link>
        <Button as="link" to={`/book?vehicle=${vehicle.id}`} variant="outline-dark" size="sm">
          Book this car
        </Button>
      </div>
    </div>
  </article>;
}
