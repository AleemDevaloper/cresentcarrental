import { MessageCircle } from 'lucide-react';
import brand from '../config/brandConfig';
import { trackEvent } from '../services/analytics';
import Button from './Button';

export default function WhatsAppButton({ vehicle, date, location, className = '', label = 'WhatsApp' }) {
  const lines = [`Hello Crescent Car Rental, I am interested in renting${vehicle ? ` the ${vehicle}` : ' a car'}.`];
  if (date) lines.push(`Date: ${date}`);
  if (location) lines.push(`Location: ${location}`);
  const url = `https://wa.me/${brand.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
  return (
    <Button
      as="a"
      href={url}
      variant="whatsapp"
      className={className}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackEvent('whatsapp_click', { vehicle, location })}
    >
      <MessageCircle size={18} /> {label}
    </Button>
  );
}
