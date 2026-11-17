import React, { useEffect, useState } from 'react';
import { getInventoryHealth } from '../../../api/fms';

const InventoryOverview = () => {
  const [state, setState] = useState({ loading: true, error: '', data: null });

  useEffect(() => {
    let mounted = true;
    getInventoryHealth()
      .then((response) => mounted && setState({ loading: false, error: '', data: response?.data?.data || response?.data || null }))
      .catch((error) => mounted && setState({
        loading: false,
        error: error?.message || error?.data?.message || 'Unable to load inventory health.',
        data: null,
      }));
    return () => { mounted = false; };
  }, []);

  if (state.loading) return <div className="card border-0 shadow-sm p-4">Loading inventory health...</div>;
  if (state.error) return <div className="alert alert-danger">{state.error}</div>;

  const data = state.data || {};
  const cards = [
    ['Total Units', data.total_units, 'primary'],
    ['Inventory Value', data.total_value, 'info'],
    ['Healthy Stock', data.healthy, 'success'],
    ['Low Stock', data.low_stock, 'warning'],
    ['Out of Stock', data.out_of_stock, 'danger'],
    ['Expiring Soon', data.expiring_soon, 'warning'],
    ['Expired', data.expired, 'danger'],
    ['Overstock', data.overstock, 'secondary'],
  ];

  return (
    <section className="container-fluid px-0">
      <div className="row g-3">
        {cards.map(([label, value, tone]) => (
          <div className="col-12 col-sm-6 col-xl-3" key={label}>
            <div className={`card border-start border-4 border-${tone} shadow-sm h-100`}>
              <div className="card-body">
                <div className="text-muted small">{label}</div>
                <div className="fs-4 fw-bold mt-2">{value ?? 'Data unavailable'}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body">
          <h5 className="mb-2">Inventory Control Center</h5>
          <p className="text-muted mb-0">Live stock health from warehouse balances, reservations, reorder rules, and expiry records.</p>
        </div>
      </div>
    </section>
  );
};

export default InventoryOverview;
