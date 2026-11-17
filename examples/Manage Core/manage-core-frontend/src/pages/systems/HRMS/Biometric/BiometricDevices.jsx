import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFingerprint,
  faPlus,
  faRotate,
  faServer,
  faTowerBroadcast,
  faTriangleExclamation,
  faCheckCircle,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import {
  createBiometricDevice,
  importBiometricPunches,
  listBiometricDevices,
  listBiometricPunchLogs,
  listSites,
  syncBiometricDevice,
} from '../../../../api/hrms';

const blankDevice = {
  name: '',
  vendor: 'ZKTeco',
  device_code: '',
  serial_number: '',
  ip_address: '',
  port: 4370,
  site_id: '',
  timezone: 'Asia/Karachi',
};

const blankPunch = {
  device_id: '',
  employee_code: '',
  punch_time: '',
  punch_type: 'auto',
};

const BiometricDevices = () => {
  const { addNotification } = useApp();
  const [devices, setDevices] = useState([]);
  const [logs, setLogs] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deviceForm, setDeviceForm] = useState(blankDevice);
  const [punchForm, setPunchForm] = useState(blankPunch);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [deviceData, logData, siteData] = await Promise.all([
        listBiometricDevices(),
        listBiometricPunchLogs(),
        listSites(),
      ]);
      setDevices(deviceData);
      setLogs(logData);
      setSites(siteData);
      setPunchForm((prev) => ({ ...prev, device_id: prev.device_id || deviceData[0]?.id || '' }));
    } catch (err) {
      addNotification(err.message || 'Failed to load biometric console', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const stats = useMemo(() => {
    const pending = logs.filter((log) => log.sync_status === 'pending').length;
    const failed = logs.filter((log) => log.sync_status === 'failed').length;
    return [
      { label: 'Devices', value: devices.length, icon: faFingerprint, color: 'primary' },
      { label: 'Punch Logs', value: logs.length, icon: faClock, color: 'info' },
      { label: 'Pending Sync', value: pending, icon: faRotate, color: 'warning' },
      { label: 'Exceptions', value: failed, icon: faTriangleExclamation, color: 'danger' },
    ];
  }, [devices, logs]);

  const handleDeviceSubmit = async (event) => {
    event.preventDefault();
    try {
      await createBiometricDevice({
        ...deviceForm,
        site_id: deviceForm.site_id || null,
        port: Number(deviceForm.port || 4370),
      });
      addNotification('Biometric device registered', 'success');
      setDeviceForm(blankDevice);
      fetchData();
    } catch (err) {
      addNotification(err.message || 'Unable to register device', 'danger');
    }
  };

  const handlePunchSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await importBiometricPunches({
        device_id: punchForm.device_id,
        punches: [{
          employee_code: punchForm.employee_code,
          punch_time: punchForm.punch_time,
          punch_type: punchForm.punch_type,
        }],
      });
      addNotification(res.message || 'Punch imported', 'success');
      setPunchForm((prev) => ({ ...blankPunch, device_id: prev.device_id }));
      fetchData();
    } catch (err) {
      addNotification(err.message || 'Unable to import punch', 'danger');
    }
  };

  const handleSync = async (deviceId) => {
    try {
      const res = await syncBiometricDevice(deviceId);
      addNotification(res.message || 'Device synced', 'success');
      fetchData();
    } catch (err) {
      addNotification(err.message || 'Unable to sync device', 'danger');
    }
  };

  const badgeClass = (status) => {
    if (status === 'synced') return 'bg-success-subtle text-success';
    if (status === 'failed') return 'bg-danger-subtle text-danger';
    return 'bg-warning-subtle text-warning';
  };

  const deviceStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-success-subtle text-success';
      case 'inactive': return 'bg-secondary-subtle text-secondary';
      case 'maintenance': return 'bg-warning-subtle text-warning';
      default: return 'bg-success-subtle text-success';
    }
  };

  return (
    <div className="p-1 animate-fade-in">
      <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap mb-4">
        <div>
          <h4 className="fw-bold mb-1">Biometric Device Console</h4>
          <p className="text-muted small mb-0">Register ZKTeco devices, receive raw punches, and sync verified logs into attendance.</p>
        </div>
        <button className="btn btn-outline-primary rounded-3" onClick={fetchData} disabled={loading}>
          <FontAwesomeIcon icon={faRotate} className="me-2" />
          Refresh
        </button>
      </div>

      <div className="row g-3 mb-4">
        {stats.map((stat) => (
          <div className="col-6 col-xl-3" key={stat.label}>
            <div className="card border-0 shadow-sm rounded-4 h-100">
              <div className="card-body p-3 d-flex align-items-center gap-3">
                <div className={`bg-${stat.color}-subtle text-${stat.color} rounded-3 p-3`}>
                  <FontAwesomeIcon icon={stat.icon} />
                </div>
                <div>
                  <p className="small text-muted fw-bold mb-0">{stat.label}</p>
                  <h4 className="fw-bold mb-0">{stat.value}</h4>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-xl-4">
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">
                <FontAwesomeIcon icon={faPlus} className="me-2 text-primary" />
                Register Device
              </h5>
              <form className="row g-3" onSubmit={handleDeviceSubmit}>
                <div className="col-12">
                  <label className="form-label small fw-bold">Device Name</label>
                  <input className="form-control rounded-3" required value={deviceForm.name} onChange={(e) => setDeviceForm({ ...deviceForm, name: e.target.value })} />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold">Device Code</label>
                  <input className="form-control rounded-3" required placeholder="ZK-LHR-01" value={deviceForm.device_code} onChange={(e) => setDeviceForm({ ...deviceForm, device_code: e.target.value })} />
                </div>
                <div className="col-md-7">
                  <label className="form-label small fw-bold">IP Address</label>
                  <input className="form-control rounded-3" placeholder="192.168.1.40" value={deviceForm.ip_address} onChange={(e) => setDeviceForm({ ...deviceForm, ip_address: e.target.value })} />
                </div>
                <div className="col-md-5">
                  <label className="form-label small fw-bold">Port</label>
                  <input type="number" className="form-control rounded-3" value={deviceForm.port} onChange={(e) => setDeviceForm({ ...deviceForm, port: e.target.value })} />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold">Site</label>
                  <select className="form-select rounded-3" value={deviceForm.site_id} onChange={(e) => setDeviceForm({ ...deviceForm, site_id: e.target.value })}>
                    <option value="">Unassigned</option>
                    {sites.map((site) => <option key={site.id} value={site.id}>{site.name}</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <button className="btn btn-primary rounded-3 w-100" type="submit" disabled={loading}>
                    Save Device
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">
                <FontAwesomeIcon icon={faTowerBroadcast} className="me-2 text-primary" />
                Import Test Punch
              </h5>
              <form className="row g-3" onSubmit={handlePunchSubmit}>
                <div className="col-12">
                  <label className="form-label small fw-bold">Device</label>
                  <select className="form-select rounded-3" required value={punchForm.device_id} onChange={(e) => setPunchForm({ ...punchForm, device_id: e.target.value })}>
                    <option value="">Select device</option>
                    {devices.map((device) => <option key={device.id} value={device.id}>{device.name}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Employee Code</label>
                  <input className="form-control rounded-3" required value={punchForm.employee_code} onChange={(e) => setPunchForm({ ...punchForm, employee_code: e.target.value })} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Punch Type</label>
                  <select className="form-select rounded-3" value={punchForm.punch_type} onChange={(e) => setPunchForm({ ...punchForm, punch_type: e.target.value })}>
                    <option value="auto">Auto</option>
                    <option value="in">In</option>
                    <option value="out">Out</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label small fw-bold">Punch Time</label>
                  <input type="datetime-local" className="form-control rounded-3" required value={punchForm.punch_time} onChange={(e) => setPunchForm({ ...punchForm, punch_time: e.target.value })} />
                </div>
                <div className="col-12">
                  <button className="btn btn-outline-primary rounded-3 w-100" type="submit" disabled={!devices.length}>
                    Import & Sync
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-xl-8">
          <div className="card border-0 shadow-sm rounded-4 mb-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">
                <FontAwesomeIcon icon={faServer} className="me-2 text-primary" />
                Device Fleet
              </h5>
              <div className="row g-3">
                {devices.map((device) => (
                  <div className="col-md-6" key={device.id}>
                    <div className="border rounded-4 p-3 h-100">
                      <div className="d-flex justify-content-between gap-3">
                        <div>
                          <h6 className="fw-bold mb-1">{device.name}</h6>
                          <p className="small text-muted mb-2">{device.vendor} • {device.device_code}</p>
                        </div>
                        <span className={`badge rounded-pill align-self-start ${deviceStatusBadgeClass(device.status)}`}>{device.status}</span>
                      </div>
                      <div className="small text-muted mb-3">
                        <div>{device.site?.name || 'No site assigned'}</div>
                        <div>{device.ip_address || 'No IP'}:{device.port}</div>
                        <div>Last sync: {device.last_sync_at ? new Date(device.last_sync_at).toLocaleString() : 'Never'}</div>
                      </div>
                      <button className="btn btn-sm btn-outline-primary rounded-3" onClick={() => handleSync(device.id)}>
                        <FontAwesomeIcon icon={faRotate} className="me-2" />
                        Sync Pending Logs
                      </button>
                    </div>
                  </div>
                ))}
                {!devices.length && (
                  <div className="col-12 text-muted small py-4 text-center">No biometric devices registered.</div>
                )}
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">Recent Punch Logs</h5>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Time</th>
                      <th>Employee</th>
                      <th>Device</th>
                      <th>Type</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id}>
                        <td className="small">{new Date(log.punch_time).toLocaleString()}</td>
                        <td>
                          <div className="fw-bold small">{log.user?.name || log.employee_code}</div>
                          <div className="text-muted x-small">{log.employee_code}</div>
                        </td>
                        <td className="small">{log.device?.name}</td>
                        <td><span className="badge bg-secondary-subtle text-secondary rounded-pill">{log.punch_type}</span></td>
                        <td>
                          <span className={`badge rounded-pill ${badgeClass(log.sync_status)}`}>
                            {log.sync_status === 'synced' && <FontAwesomeIcon icon={faCheckCircle} className="me-1" />}
                            {log.sync_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {!logs.length && (
                      <tr>
                        <td colSpan="5" className="text-center text-muted small py-4">No punch logs received yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiometricDevices;
