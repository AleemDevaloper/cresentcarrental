import { useEffect, useState } from 'react';
import { getWmsDashboard } from '../../../api/fms';

const cards = [
  ['warehouses', 'WMS Warehouses'],
  ['receiving_today', 'Receiving Today'],
  ['pending_putaway', 'Pending Putaway'],
  ['pending_picks', 'Pending Picks'],
  ['active_waves', 'Active Waves'],
  ['pending_packing', 'Pending Packing'],
  ['pending_dispatch', 'Pending Dispatch'],
  ['open_exceptions', 'Open Exceptions'],
];

const WmsDashboard = () => {
  const [state, setState] = useState({ loading: true, data: null, error: '' });

  useEffect(() => {
    let mounted = true;
    getWmsDashboard()
      .then((response) => mounted && setState({ loading: false, data: response.data?.data || {}, error: '' }))
      .catch((error) => mounted && setState({ loading: false, data: null, error: error.response?.data?.message || 'Unable to load WMS dashboard.' }));
    return () => { mounted = false; };
  }, []);

  if (state.loading) return <div className="card border-0 shadow-sm p-4">Loading warehouse operations...</div>;
  if (state.error) return <div className="alert alert-danger">{state.error}</div>;

  return (
    <div className="container-fluid px-0">
      <div className="row g-3 mb-4">
        {cards.map(([key, label]) => (
          <div className="col-6 col-xl-3" key={key}>
            <div className="card border-0 shadow-sm h-100 p-3">
              <div className="text-muted small">{label}</div>
              <div className="fs-3 fw-bold mt-2">{state.data[key] ?? 0}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent fw-semibold">Warehouse Activity (last 7 days)</div>
        <div className="card-body">
          {!state.data.activity?.length ? <div className="text-muted">No warehouse activity recorded.</div> : (
            <div className="row g-3">
              {state.data.activity.map((item) => (
                <div className="col-6 col-md-3" key={item.type}>
                  <div className="border rounded p-3">
                    <div className="text-muted text-capitalize">{item.type}</div>
                    <div className="fw-bold fs-5">{item.total}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WmsDashboard;
