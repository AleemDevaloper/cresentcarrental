import { useEffect, useState } from 'react';
import { Car, Image, Loader2, Plus, RefreshCw, Search, Trash2 } from 'lucide-react';
import api from '../services/api';
import Button from '../components/Button';
import SmartImage from '../components/SmartImage';

const blank = {
  name: '', model: '', year: new Date().getFullYear(), daily_price: '', weekly_price: '',
  monthly_price: '', weekend_price: '', holiday_price: '', deposit: '', driver_fee: '',
  extra_km_fee: '', late_return_fee: '', transmission: 'Automatic', fuel_type: 'Petrol',
  seats: 5, doors: 4, mileage_policy: 'Standard mileage', main_image: '',
  short_description: '', description: '', status: 'active', operational_status: 'Available',
  featured: false, driver_available: true, self_drive_available: true, odometer: 0,
  registration_expires_at: '', insurance_expires_at: '',
};
const fieldLabels = { daily_price: 'Daily price', weekly_price: 'Weekly price', monthly_price: 'Monthly price', weekend_price: 'Weekend price', holiday_price: 'Holiday price', deposit: 'Security deposit', driver_fee: 'Driver fee', extra_km_fee: 'Extra KM fee', late_return_fee: 'Late return fee' };

export default function AdminVehiclesPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(null);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    api.get('/admin/vehicles', { params: { search: query || undefined, status: status || undefined } })
      .then((response) => setRows(response.data.data || []))
      .catch((requestError) => setError(requestError.userMessage || 'Fleet could not be loaded.'))
      .finally(() => setLoading(false));
  };
  useEffect(load, [status]);

  const save = async (event) => {
    event.preventDefault();
    if (!form || saving) return;
    setSaving(true);
    setError('');
    try {
      const response = form.id ? await api.put(`/admin/vehicles/${form.id}`, form) : await api.post('/admin/vehicles', form);
      const vehicle = response.data.data || response.data;
      setRows((current) => form.id ? current.map((row) => row.id === vehicle.id ? vehicle : row) : [vehicle, ...current]);
      setForm(null);
    } catch (requestError) {
      setError(requestError.userMessage || 'Vehicle could not be saved.');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (vehicle) => {
    if (!window.confirm(`Delete ${vehicle.name}? This cannot be undone.`)) return;
    try { await api.delete(`/admin/vehicles/${vehicle.id}`); load(); } catch (requestError) { setError(requestError.userMessage || 'Vehicle could not be deleted.'); }
  };
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <>
      <div className="admin-page-title"><div><span className="eyebrow">Fleet management</span><h1>Vehicles</h1><p>Create and manage the live car cards, prices, images, availability and booking options shown across the website.</p></div><div className="admin-page-actions"><Button variant="ghost" onClick={load} disabled={loading}><RefreshCw size={15} /> Refresh</Button><Button variant="red" onClick={() => setForm({ ...blank })}><Plus size={16} /> Add vehicle</Button></div></div>
      {error && <div className="admin-banner admin-banner-error" role="alert">{error}</div>}
      <div className="admin-table-panel">
        <div className="table-tools admin-filter-tools"><div className="admin-search"><Search size={16} /><input placeholder="Search vehicle name…" value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => event.key === 'Enter' && load()} /></div><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="">All statuses</option><option value="active">Active</option><option value="inactive">Inactive</option><option value="maintenance">Maintenance</option></select><Button variant="dark" onClick={load}>Search</Button></div>
        {loading ? <div className="admin-loading"><Loader2 className="admin-spin" size={28} /><p>Loading fleet…</p></div> : <div className="table-responsive"><table className="admin-table"><thead><tr><th>Vehicle</th><th>Live card</th><th>Daily</th><th>Weekly</th><th>Monthly</th><th>Operational state</th><th>Publish</th><th /></tr></thead><tbody>
          {rows.map((vehicle) => <tr key={vehicle.id}><td><div className="admin-vehicle-cell">{vehicle.main_image_url ? <SmartImage src={vehicle.main_image_url} alt="" width={80} height={54} card sizes="80px" /> : <span><Car size={16} /></span>}<strong>{vehicle.name}<small>{vehicle.year || '—'} · {vehicle.transmission || 'Automatic'}</small></strong></div></td><td>{vehicle.featured ? <span className="status status-confirmed">Featured</span> : <span className="status">Standard</span>}</td><td>PKR {Number(vehicle.daily_price || 0).toLocaleString()}</td><td>PKR {Number(vehicle.weekly_price || 0).toLocaleString()}</td><td>PKR {Number(vehicle.monthly_price || 0).toLocaleString()}</td><td><span className="status">{vehicle.operational_status || vehicle.status}</span></td><td><span className={`status status-${vehicle.status}`}>{vehicle.status}</span></td><td><button className="table-link" type="button" onClick={() => setForm({ ...blank, ...vehicle })}>Edit</button><button className="table-link danger" type="button" onClick={() => remove(vehicle)}><Trash2 size={13} /> Delete</button></td></tr>)}
          {!rows.length && <tr><td colSpan="8"><div className="admin-empty-state">No vehicles found. Add your first vehicle to publish a dynamic fleet card.</div></td></tr>}
        </tbody></table></div>}
      </div>
      {form && <div className="drawer-backdrop" onClick={() => setForm(null)}><form className="admin-drawer admin-vehicle-drawer" onSubmit={save} onClick={(event) => event.stopPropagation()}>
        <div className="drawer-head"><div><span className="eyebrow">Live fleet card editor</span><h2>{form.id ? 'Edit vehicle' : 'Add vehicle'}</h2><p>Changes are saved to the API and appear on public fleet cards.</p></div><button type="button" onClick={() => setForm(null)} aria-label="Close editor">×</button></div>
        <div className="admin-form-section"><h3>Vehicle identity</h3><div className="form-grid"><label className="full"><span>Name</span><input required value={form.name || ''} onChange={(event) => update('name', event.target.value)} /></label><label><span>Model</span><input value={form.model || ''} onChange={(event) => update('model', event.target.value)} /></label><label><span>Year</span><input type="number" value={form.year || ''} onChange={(event) => update('year', event.target.value)} /></label><label className="full"><span>Image URL / storage path</span><div className="admin-input-with-icon"><Image size={15} /><input value={form.main_image || ''} onChange={(event) => update('main_image', event.target.value)} placeholder="assets/fleet/vehicle.jpg" /></div></label><label className="full"><span>Short card description</span><textarea rows="2" value={form.short_description || ''} onChange={(event) => update('short_description', event.target.value)} /></label></div></div>
        <div className="admin-form-section"><h3>Prices and rental rules</h3><div className="form-grid">{Object.keys(fieldLabels).map((key) => <label key={key}><span>{fieldLabels[key]}</span><input type="number" min="0" step="0.01" value={form[key] ?? ''} onChange={(event) => update(key, event.target.value)} /></label>)}</div></div>
        <div className="admin-form-section"><h3>Specifications and availability</h3><div className="form-grid"><label><span>Transmission</span><select value={form.transmission || 'Automatic'} onChange={(event) => update('transmission', event.target.value)}><option>Automatic</option><option>Manual</option></select></label><label><span>Fuel</span><select value={form.fuel_type || 'Petrol'} onChange={(event) => update('fuel_type', event.target.value)}><option>Petrol</option><option>Diesel</option><option>Hybrid</option><option>Electric</option></select></label><label><span>Seats</span><input type="number" min="1" value={form.seats || 5} onChange={(event) => update('seats', event.target.value)} /></label><label><span>Doors</span><input type="number" min="1" value={form.doors || 4} onChange={(event) => update('doors', event.target.value)} /></label><label><span>Odometer</span><input type="number" min="0" value={form.odometer || 0} onChange={(event) => update('odometer', event.target.value)} /></label><label><span>Operational status</span><select value={form.operational_status || 'Available'} onChange={(event) => update('operational_status', event.target.value)}>{['Available', 'Reserved', 'On Rent', 'Returned - Inspection Pending', 'Under Maintenance', 'Blocked', 'Retired'].map((value) => <option key={value}>{value}</option>)}</select></label><label><span>Publish status</span><select value={form.status || 'active'} onChange={(event) => update('status', event.target.value)}><option value="active">Active</option><option value="inactive">Inactive</option><option value="maintenance">Maintenance</option></select></label><label className="check-label"><input type="checkbox" checked={!!form.featured} onChange={(event) => update('featured', event.target.checked)} /> Featured card</label><label className="check-label"><input type="checkbox" checked={!!form.self_drive_available} onChange={(event) => update('self_drive_available', event.target.checked)} /> Self drive</label><label className="check-label"><input type="checkbox" checked={!!form.driver_available} onChange={(event) => update('driver_available', event.target.checked)} /> With driver</label></div></div>
        <div className="admin-form-section"><h3>Expiry tracking</h3><div className="form-grid"><label><span>Registration expiry</span><input type="date" value={form.registration_expires_at || ''} onChange={(event) => update('registration_expires_at', event.target.value)} /></label><label><span>Insurance expiry</span><input type="date" value={form.insurance_expires_at || ''} onChange={(event) => update('insurance_expires_at', event.target.value)} /></label></div></div>
        <Button type="submit" variant="red" fullWidth loading={saving}>{saving ? 'Saving vehicle…' : 'Save and publish vehicle'}</Button>
      </form></div>}
    </>
  );
}
