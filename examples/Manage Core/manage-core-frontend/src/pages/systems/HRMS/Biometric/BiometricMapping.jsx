import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCodeBranch, faCheckCircle, faTimesCircle, faSearch,
  faPlus, faFingerprint, faUsers, faLink, faUnlink
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { listBiometricDevices, listBiometricMappings, updateEmployeeMapping } from '../../../../api/hrms';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const BiometricMapping = () => {
  const { addNotification } = useApp();
  const [employees, setEmployees] = useState([]);
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedDevice, setSelectedDevice] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ user_id: '', biometric_device_id: '', pin: '' });
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const bg = isDark ? '#0f172a' : '#f1f5f9';
  const cardBg = isDark ? 'rgba(30,41,59,0.7)' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc';
  const primaryGradient = 'linear-gradient(135deg, #4f46e5, #7c3aed)';
  const radius = 14;

  const cardStyle = {
    background: cardBg, borderRadius: `${radius}px`, border: `1px solid ${borderColor}`,
    backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
    padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  };

  const statCard = (s) => (
    <motion.div key={s.label} variants={itemVariants}
      style={{ ...cardStyle, padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}1a`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, fontSize: 18 }}>
        <FontAwesomeIcon icon={s.icon} />
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2 }}>{s.value}</div>
        <div style={{ fontSize: 13, color: mutedColor, marginTop: 2 }}>{s.label}</div>
      </div>
    </motion.div>
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mappingData, devData] = await Promise.all([
        listBiometricMappings(),
        listBiometricDevices(),
      ]);
      const employeesList = Array.isArray(mappingData) ? mappingData : (mappingData?.data || []);
      setEmployees(employeesList);
      if (mappingData?.stats) setMappingStats(mappingData.stats);
      setDevices(Array.isArray(devData) ? devData : []);
    } catch (err) {
      addNotification(err.message || 'Failed to load data', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const [mappingStats, setMappingStats] = useState(null);

  const stats = useMemo(() => {
    if (mappingStats) {
      return [
        { label: 'Total Employees', value: mappingStats.total, icon: faUsers, color: '#4f46e5' },
        { label: 'Mapped', value: mappingStats.mapped, icon: faCheckCircle, color: '#10b981' },
        { label: 'Unmapped', value: mappingStats.unmapped, icon: faTimesCircle, color: '#ef4444' },
        { label: 'Devices', value: devices.length, icon: faFingerprint, color: '#f59e0b' },
      ];
    }
    const mapped = employees.filter(e => e.biometric_device_id || e.biometric_pin).length;
    const unmapped = employees.filter(e => !e.biometric_device_id && !e.biometric_pin).length;
    return [
      { label: 'Total Employees', value: employees.length, icon: faUsers, color: '#4f46e5' },
      { label: 'Mapped', value: mapped, icon: faCheckCircle, color: '#10b981' },
      { label: 'Unmapped', value: unmapped, icon: faTimesCircle, color: '#ef4444' },
      { label: 'Devices', value: devices.length, icon: faFingerprint, color: '#f59e0b' },
    ];
  }, [employees, devices, mappingStats]);

  const filteredEmployees = useMemo(() => {
    let list = employees;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(e =>
        (e.name || '').toLowerCase().includes(q) ||
        (e.emp_id || '').toLowerCase().includes(q) ||
        (e.email || '').toLowerCase().includes(q)
      );
    }
    if (selectedDevice !== 'all') {
      if (selectedDevice === 'unmapped') list = list.filter(e => !e.biometric_device_id);
      else list = list.filter(e => e.biometric_device_id === parseInt(selectedDevice));
    }
    return list;
  }, [employees, search, selectedDevice]);

  const badge = (status) => {
    const map = {
      Mapped: { bg: '#10b9811a', color: '#10b981' },
      Unmapped: { bg: '#ef44441a', color: '#ef4444' },
    };
    const s = map[status] || { bg: '#64748b1a', color: '#64748b' };
    return <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 12,
      fontWeight: 600, background: s.bg, color: s.color }}>{status}</span>;
  };

  const handleUnmap = async (userId) => {
    try {
      await updateEmployeeMapping(userId, { biometric_device_id: null, pin: null });
      addNotification('Mapping removed', 'success');
      fetchData();
    } catch (err) {
      addNotification(err.message || 'Failed to remove mapping', 'danger');
    }
  };

  const handleMap = async () => {
    try {
      await updateEmployeeMapping(formData.user_id, formData);
      addNotification('Employee mapped successfully', 'success');
      setShowModal(false);
      setFormData({ user_id: '', biometric_device_id: '', pin: '' });
      fetchData();
    } catch (err) {
      addNotification(err.message || 'Failed to map employee', 'danger');
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show"
      style={{ minHeight: '100vh', background: bg, padding: '28px 32px',
        fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif", color: textColor }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <motion.div variants={itemVariants}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: primaryGradient,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fff' }}>
              <FontAwesomeIcon icon={faCodeBranch} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px' }}>
                Employee Biometric Mapping
              </h1>
              <p style={{ margin: '3px 0 0 0', fontSize: 13, color: mutedColor }}>
                Link HRMS employees with biometric device identities across all locations
              </p>
            </div>
          </div>
          <button onClick={() => setShowModal(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px',
              border: 'none', borderRadius: 10, background: primaryGradient, color: '#fff',
              fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            <FontAwesomeIcon icon={faPlus} /> Add Mapping
          </button>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {stats.map(statCard)}
        </div>

        <motion.div variants={itemVariants}
          style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
            borderRadius: 10, background: inputBg, border: `1px solid ${borderColor}`, flex: 1, maxWidth: 280 }}>
            <FontAwesomeIcon icon={faSearch} style={{ color: mutedColor, fontSize: 13 }} />
            <input placeholder="Search employee..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', outline: 'none', color: textColor, fontSize: 13, width: '100%' }} />
          </div>
          <select value={selectedDevice} onChange={e => setSelectedDevice(e.target.value)}
            style={{ padding: '8px 14px', borderRadius: 10, background: inputBg,
              border: `1px solid ${borderColor}`, color: textColor, fontSize: 13, outline: 'none' }}>
            <option value="all">All Devices</option>
            <option value="unmapped">Unmapped</option>
            {devices.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        </motion.div>

        <motion.div variants={itemVariants} style={{ ...cardStyle, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${borderColor}` }}>
                  {['Employee', 'Code', 'Device', 'PIN', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600,
                      color: mutedColor, fontSize: 11, textTransform: 'uppercase',
                      letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(emp => (
                  <tr key={emp.id} style={{ borderBottom: `1px solid ${borderColor}`, transition: 'background 0.15s' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 500, whiteSpace: 'nowrap' }}>
                      {emp.name || emp.first_name + ' ' + (emp.last_name || '')}
                    </td>
                    <td style={{ padding: '12px 16px', color: mutedColor, whiteSpace: 'nowrap' }}>
                      {emp.emp_id || emp.employee_code || '—'}
                    </td>
                    <td style={{ padding: '12px 16px', color: mutedColor, whiteSpace: 'nowrap' }}>
                      {emp.biometric_device_name || '—'}
                    </td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      {emp.biometric_pin || '—'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {badge(emp.biometric_device_id ? 'Mapped' : 'Unmapped')}
                    </td>
                    <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                      {emp.biometric_device_id ? (
                        <button onClick={() => handleUnmap(emp.id)}
                          style={{ width: 30, height: 30, borderRadius: 8, border: 'none',
                            background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: 12 }}
                          title="Unmap">
                          <FontAwesomeIcon icon={faUnlink} />
                        </button>
                      ) : (
                        <button onClick={() => { setFormData({ user_id: emp.id, biometric_device_id: '', pin: '' }); setShowModal(true); }}
                          style={{ width: 30, height: 30, borderRadius: 8, border: 'none',
                            background: 'transparent', color: '#4f46e5', cursor: 'pointer', fontSize: 12 }}
                          title="Map">
                          <FontAwesomeIcon icon={faLink} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: mutedColor }}>
                      No employees match your search
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ ...cardStyle, width: 420, padding: '28px' }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 18, fontWeight: 700 }}>
              {formData.user_id ? 'Edit Mapping' : 'New Mapping'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: mutedColor, marginBottom: 4, display: 'block' }}>Employee</label>
                <select value={formData.user_id} onChange={e => setFormData(p => ({ ...p, user_id: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: inputBg,
                    border: `1px solid ${borderColor}`, color: textColor, fontSize: 13, outline: 'none' }}>
                  <option value="">Select employee</option>
                  {employees.filter(e => !e.biometric_device_id || e.id === parseInt(formData.user_id)).map(e => (
                    <option key={e.id} value={e.id}>{e.name || e.first_name} ({e.emp_id || '—'})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: mutedColor, marginBottom: 4, display: 'block' }}>Device</label>
                <select value={formData.biometric_device_id} onChange={e => setFormData(p => ({ ...p, biometric_device_id: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: inputBg,
                    border: `1px solid ${borderColor}`, color: textColor, fontSize: 13, outline: 'none' }}>
                  <option value="">Select device</option>
                  {devices.map(d => (
                    <option key={d.id} value={d.id}>{d.name} ({d.device_code})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: mutedColor, marginBottom: 4, display: 'block' }}>Device PIN</label>
                <input value={formData.pin} onChange={e => setFormData(p => ({ ...p, pin: e.target.value }))} placeholder="e.g. 1001"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 10, background: inputBg,
                    border: `1px solid ${borderColor}`, color: textColor, fontSize: 13, outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button onClick={handleMap}
                  style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none',
                    background: primaryGradient, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                  Save Mapping
                </button>
                <button onClick={() => setShowModal(false)}
                  style={{ padding: '10px 20px', borderRadius: 10, border: `1px solid ${borderColor}`,
                    background: 'transparent', color: textColor, fontSize: 14, cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default BiometricMapping;
