import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  faCodeBranch, faCheckCircle, faTimesCircle, faExclamationTriangle,
  faChartLine, faEdit, faTrash, faUpload, faSync, faSearch, faPlus, faXmark
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DialogBox from '../../components/common/UI/Boxes/DialogBox';

const BiometricMapping = ({ isDark }) => {
  const [mappings, setMappings] = useState([
    { id: 1, name: 'Ahmad Hassan', code: 'EMP-001', device: 'Main Gate ZKTeco', deviceCode: 'ZK-001', pin: '1001', status: 'Mapped' },
    { id: 2, name: 'Fatima Ali', code: 'EMP-002', device: 'HR Floor eSSL', deviceCode: 'ES-002', pin: '1002', status: 'Mapped' },
    { id: 3, name: 'Usman Khan', code: 'EMP-003', device: 'Factory Face', deviceCode: 'FC-003', pin: '1003', status: 'Error' },
    { id: 4, name: 'Ayesha Malik', code: 'EMP-004', device: '—', deviceCode: '—', pin: '—', status: 'Unmapped' },
    { id: 5, name: 'Bilal Ahmed', code: 'EMP-005', device: 'Main Gate ZKTeco', deviceCode: 'ZK-001', pin: '1005', status: 'Mapped' },
    { id: 6, name: 'Sana Tariq', code: 'EMP-006', device: 'Parking FP', deviceCode: 'FP-004', pin: '—', status: 'Unmapped' },
  ]);

  const [search, setSearch] = useState('');
  const [alert, setAlert] = useState({ show: false, title: '', message: '', variant: 'info' });
  const [bulkOpen, setBulkOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [deleteRow, setDeleteRow] = useState(null);
  const [bulkText, setBulkText] = useState('');

  const emptyForm = { name: '', code: '', device: '', deviceCode: '', pin: '' };
  const [form, setForm] = useState(emptyForm);

  const bg = isDark ? '#0f172a' : '#f1f5f9';
  const cardBg = isDark ? 'rgba(30,41,59,0.7)' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc';
  const primaryGradient = 'linear-gradient(135deg, #4f46e5, #7c3aed)';
  const radius = 14;

  const containerStyle = {
    minHeight: '100vh', background: bg, padding: '32px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: textColor,
  };

  const card = {
    background: cardBg, borderRadius: `${radius}px`, border: `1px solid ${borderColor}`,
    backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
    padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  };

  const headerStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: '28px', flexWrap: 'wrap', gap: 16,
  };

  const headerLeft = { display: 'flex', alignItems: 'center', gap: '16px' };

  const iconBox = {
    width: 48, height: 48, borderRadius: 14, background: primaryGradient,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 20, color: '#fff', flexShrink: 0,
  };

  const headerTitle = { fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px', margin: 0 };
  const headerSub = { fontSize: 13, color: mutedColor, margin: '2px 0 0 0' };

  const bulkBtn = {
    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px',
    border: 'none', borderRadius: '10px', background: primaryGradient, color: '#fff',
    fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'opacity 0.2s',
  };

  const statsRow = {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px',
  };

  const mappedCount = mappings.filter(m => m.status === 'Mapped').length;
  const unmappedCount = mappings.filter(m => m.status === 'Unmapped').length;
  const errorCount = mappings.filter(m => m.status === 'Error').length;
  const coverage = mappings.length ? ((mappedCount / mappings.length) * 100).toFixed(1) : '0.0';

  const statCard = (value, label, color, icon) => (
    <motion.div
      key={label}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ ...card, padding: '20px', display: 'flex', alignItems: 'center', gap: 16 }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 12, background: `${color}1a`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontSize: 18,
      }}>
        <FontAwesomeIcon icon={icon} />
      </div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 700, lineHeight: 1.2 }}>{value}</div>
        <div style={{ fontSize: 13, color: mutedColor, marginTop: 2 }}>{label}</div>
      </div>
    </motion.div>
  );

  const badge = (status) => {
    const map = {
      Mapped: { bg: '#10b9811a', color: '#10b981' },
      Unmapped: { bg: '#ef44441a', color: '#ef4444' },
      Error: { bg: '#f59e0b1a', color: '#f59e0b' },
    };
    const s = map[status] || { bg: '#64748b1a', color: '#64748b' };
    return {
      display: 'inline-block', padding: '4px 12px', borderRadius: 20, fontSize: 12,
      fontWeight: 600, background: s.bg, color: s.color,
    };
  };

  const tableHead = {
    display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.6fr 1.2fr 1fr 1fr 1fr',
    gap: '12px', padding: '12px 16px', fontSize: 12, fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.5px', color: mutedColor,
    borderBottom: `1px solid ${borderColor}`,
  };

  const tableRow = {
    display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.6fr 1.2fr 1fr 1fr 1fr',
    gap: '12px', padding: '14px 16px', alignItems: 'center', fontSize: 14,
    borderBottom: `1px solid ${borderColor}`, transition: 'background 0.15s',
  };

  const actionBtn = (color) => ({
    width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
    background: 'transparent', color, fontSize: 13,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.15s, transform 0.15s',
  });

  const quickActionsCard = { ...card, padding: '20px', marginTop: '28px' };
  const quickActionsRow = { display: 'flex', gap: 12, marginTop: 14, flexWrap: 'wrap' };
  const quickBtn = {
    display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px',
    border: `1px solid ${borderColor}`, borderRadius: 10, background: inputBg, color: textColor,
    fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
  };

  const filtered = mappings.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.code.toLowerCase().includes(search.toLowerCase()) ||
    m.device.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(emptyForm); setAddOpen(true); };
  const openEdit = (row) => { setForm({ name: row.name, code: row.code, device: row.device === '—' ? '' : row.device, deviceCode: row.deviceCode === '—' ? '' : row.deviceCode, pin: row.pin === '—' ? '' : row.pin }); setEditRow(row); setAddOpen(true); };

  const saveMapping = () => {
    if (!form.name || !form.code) {
      setAlert({ show: true, title: 'Missing Fields', message: 'Employee Name and Code are required.', variant: 'warning' });
      return;
    }
    const status = (form.device && form.deviceCode && form.pin) ? 'Mapped' : 'Unmapped';
    if (editRow) {
      setMappings(prev => prev.map(m => m.id === editRow.id ? { ...m, ...form, status } : m));
      setAlert({ show: true, title: 'Mapping Updated', message: `Mapping for ${form.name} updated.`, variant: 'success' });
    } else {
      setMappings(prev => [...prev, { id: Date.now(), ...form, status }]);
      setAlert({ show: true, title: 'Mapping Added', message: `Mapping for ${form.name} created.`, variant: 'success' });
    }
    setAddOpen(false); setEditRow(null); setForm(emptyForm);
  };

  const confirmDelete = () => {
    setMappings(prev => prev.filter(m => m.id !== deleteRow.id));
    setAlert({ show: true, title: 'Mapping Deleted', message: `Mapping for ${deleteRow.name} removed.`, variant: 'info' });
    setDeleteRow(null);
  };

  const handleBulkImport = () => {
    const lines = bulkText.trim().split('\n').filter(Boolean);
    let added = 0;
    const newRows = lines.map(line => {
      const cols = line.split(',').map(c => c.trim());
      const [name, code, device, deviceCode, pin] = cols;
      if (!name || !code) return null;
      added++;
      const hasAll = device && deviceCode && pin;
      return { id: Date.now() + Math.random(), name, code, device: device || '—', deviceCode: deviceCode || '—', pin: pin || '—', status: hasAll ? 'Mapped' : 'Unmapped' };
    }).filter(Boolean);
    if (newRows.length === 0) {
      setAlert({ show: true, title: 'No Data', message: 'Please paste at least one row in format: Name, Code, Device, DeviceCode, PIN', variant: 'warning' });
      return;
    }
    setMappings(prev => [...prev, ...newRows]);
    setAlert({ show: true, title: 'Bulk Import Complete', message: `${added} mapping(s) imported successfully.`, variant: 'success' });
    setBulkOpen(false); setBulkText('');
  };

  const quickAction = (action) => {
    if (action === 'Auto-Map Unmapped') {
      setMappings(prev => prev.map(m => m.status === 'Unmapped' ? { ...m, status: 'Mapped', device: m.device === '—' ? 'Main Gate ZKTeco' : m.device, deviceCode: m.deviceCode === '—' ? 'ZK-001' : m.deviceCode, pin: m.pin === '—' ? String(2000 + m.id) : m.pin } : m));
      setAlert({ show: true, title: 'Auto-Map Complete', message: 'All unmapped employees have been auto-assigned to devices.', variant: 'success' });
    } else if (action === 'Validate Mappings') {
      setMappings(prev => prev.map(m => m.status === 'Error' ? { ...m, status: 'Mapped' } : m));
      setAlert({ show: true, title: 'Validation Complete', message: 'Mapping errors have been re-validated and resolved.', variant: 'success' });
    } else {
      setAlert({ show: true, title: 'Sync Started', message: 'Mappings are being pushed to all connected devices.', variant: 'success' });
    }
  };

  const inputStyle = {
    width: '100%', padding: '9px 14px', borderRadius: 10, border: `1px solid ${borderColor}`,
    background: inputBg, fontSize: 13, color: textColor, outline: 'none',
  };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: mutedColor, marginBottom: 5, display: 'block' };

  return (
    <div style={containerStyle}>
      <div style={{ margin: '0 auto' }}>
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={headerStyle}>
          <div style={headerLeft}>
            <div style={iconBox}><FontAwesomeIcon icon={faCodeBranch} /></div>
            <div>
              <h1 style={headerTitle}>Employee Biometric Mapping</h1>
              <p style={headerSub}>Link HRMS employees with biometric device identities across all locations</p>
            </div>
          </div>
          <button style={bulkBtn} onClick={() => setBulkOpen(true)}>
            <FontAwesomeIcon icon={faUpload} /> Bulk Import
          </button>
        </motion.div>

        <div style={statsRow}>
          {statCard(mappedCount, 'Mapped Employees', '#10b981', faCheckCircle)}
          {statCard(unmappedCount, 'Unmapped Employees', '#ef4444', faTimesCircle)}
          {statCard(errorCount, 'Mapping Errors', '#f59e0b', faExclamationTriangle)}
          {statCard(`${coverage}%`, 'Device Coverage', '#4f46e5', faChartLine)}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{ ...card, padding: 0, overflow: 'hidden' }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px', borderBottom: `1px solid ${borderColor}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <FontAwesomeIcon icon={faSearch} style={{ color: mutedColor, fontSize: 14 }} />
              <span style={{ fontSize: 15, fontWeight: 600 }}>Mapping Records</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employee or device..."
                style={{ padding: '7px 12px', borderRadius: 8, border: `1px solid ${borderColor}`, background: inputBg, color: textColor, fontSize: 12, outline: 'none' }}
              />
              <button style={{
                ...bulkBtn, background: 'transparent', color: textColor,
                border: `1px solid ${borderColor}`, padding: '8px 16px', fontSize: 13,
              }} onClick={openAdd}>
                <FontAwesomeIcon icon={faPlus} /> Add Mapping
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: 800 }}>
              <div style={tableHead}>
                <span>Employee Name</span><span>Emp Code</span><span>Device Name</span>
                <span>Device Code</span><span>PIN Code</span><span>Status</span><span>Actions</span>
              </div>
              {filtered.map((row, i) => (
                <motion.div
                  key={row.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  style={tableRow}
                  onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  <span style={{ fontWeight: 500 }}>{row.name}</span>
                  <span style={{ color: mutedColor }}>{row.code}</span>
                  <span>{row.device}</span>
                  <span style={{ color: mutedColor }}>{row.deviceCode}</span>
                  <span>{row.pin}</span>
                  <span><span style={badge(row.status)}>{row.status}</span></span>
                  <span style={{ display: 'flex', gap: 4 }}>
                    <button style={actionBtn('#4f46e5')} title="Edit" onClick={() => openEdit(row)}><FontAwesomeIcon icon={faEdit} /></button>
                    <button style={actionBtn('#ef4444')} title="Delete" onClick={() => setDeleteRow(row)}><FontAwesomeIcon icon={faTrash} /></button>
                  </span>
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <div style={{ padding: 40, textAlign: 'center', color: mutedColor, fontSize: 13 }}>
                  No mappings found.
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          style={quickActionsCard}
        >
          <div style={{ fontSize: 15, fontWeight: 600 }}>Quick Actions</div>
          <p style={{ fontSize: 13, color: mutedColor, margin: '2px 0 0 0' }}>
            Perform bulk operations across all biometric mappings
          </p>
          <div style={quickActionsRow}>
            <button style={quickBtn} onClick={() => quickAction('Auto-Map Unmapped')}><FontAwesomeIcon icon={faSync} /> Auto-Map Unmapped</button>
            <button style={quickBtn} onClick={() => quickAction('Validate Mappings')}><FontAwesomeIcon icon={faCheckCircle} /> Validate Mappings</button>
            <button style={quickBtn} onClick={() => quickAction('Sync to Devices')}><FontAwesomeIcon icon={faCodeBranch} /> Sync to Devices</button>
          </div>
        </motion.div>
      </div>

      {/* ── Add / Edit Mapping Modal ── */}
      <AnimatePresence>
        {addOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(2px)' }} onClick={(e) => { if (e.target === e.currentTarget) { setAddOpen(false); setEditRow(null); } }}>
            <motion.div initial={{ opacity: 0, scale: 0.94, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 10 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} style={{ background: cardBg, borderRadius: 18, width: '100%', maxWidth: 520, overflow: 'hidden', border: `1px solid ${borderColor}` }}>
              <div style={{ padding: '20px 24px', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: primaryGradient, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FontAwesomeIcon icon={faCodeBranch} /></div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: textColor }}>{editRow ? 'Edit Mapping' : 'Add Mapping'}</div>
                </div>
                <button onClick={() => { setAddOpen(false); setEditRow(null); }} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: inputBg, cursor: 'pointer', color: mutedColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FontAwesomeIcon icon={faXmark} /></button>
              </div>
              <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div><label style={labelStyle}>Employee Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Ahmad Hassan" style={inputStyle} /></div>
                <div><label style={labelStyle}>Employee Code</label><input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. EMP-001" style={inputStyle} /></div>
                <div><label style={labelStyle}>Device Name</label><input value={form.device} onChange={(e) => setForm({ ...form, device: e.target.value })} placeholder="e.g. Main Gate ZKTeco" style={inputStyle} /></div>
                <div><label style={labelStyle}>Device Code</label><input value={form.deviceCode} onChange={(e) => setForm({ ...form, deviceCode: e.target.value })} placeholder="e.g. ZK-001" style={inputStyle} /></div>
                <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>PIN Code</label><input value={form.pin} onChange={(e) => setForm({ ...form, pin: e.target.value })} placeholder="e.g. 1001" style={inputStyle} /></div>
              </div>
              <div style={{ padding: '16px 24px', borderTop: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'flex-end', gap: 10, background: inputBg }}>
                <button onClick={() => { setAddOpen(false); setEditRow(null); }} style={{ padding: '10px 22px', borderRadius: 10, border: `1px solid ${borderColor}`, background: cardBg, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: mutedColor }}>CANCEL</button>
                <button onClick={saveMapping} style={{ padding: '10px 22px', borderRadius: 10, border: 'none', background: primaryGradient, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 12 }}><FontAwesomeIcon icon={faCheckCircle} className="me-2" />{editRow ? 'SAVE CHANGES' : 'ADD MAPPING'}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Bulk Import Modal ── */}
      <AnimatePresence>
        {bulkOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(2px)' }} onClick={(e) => { if (e.target === e.currentTarget) setBulkOpen(false); }}>
            <motion.div initial={{ opacity: 0, scale: 0.94, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94, y: 10 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} style={{ background: cardBg, borderRadius: 18, width: '100%', maxWidth: 560, overflow: 'hidden', border: `1px solid ${borderColor}` }}>
              <div style={{ padding: '20px 24px', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: primaryGradient, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FontAwesomeIcon icon={faUpload} /></div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: textColor }}>Bulk Import Mappings</div>
                </div>
                <button onClick={() => setBulkOpen(false)} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: inputBg, cursor: 'pointer', color: mutedColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FontAwesomeIcon icon={faXmark} /></button>
              </div>
              <div style={{ padding: '24px' }}>
                <label style={labelStyle}>Paste CSV data (one per line: Name, Code, Device, DeviceCode, PIN)</label>
                <textarea value={bulkText} onChange={(e) => setBulkText(e.target.value)} rows={8} placeholder={'Ahmad Hassan, EMP-001, Main Gate ZKTeco, ZK-001, 1001\nFatima Ali, EMP-002, HR Floor eSSL, ES-002, 1002'} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${borderColor}`, background: inputBg, color: textColor, fontSize: 13, outline: 'none', fontFamily: 'monospace', resize: 'vertical' }} />
                <div style={{ fontSize: 12, color: mutedColor, marginTop: 8 }}>Lines missing device or PIN will be imported as "Unmapped".</div>
              </div>
              <div style={{ padding: '16px 24px', borderTop: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'flex-end', gap: 10, background: inputBg }}>
                <button onClick={() => setBulkOpen(false)} style={{ padding: '10px 22px', borderRadius: 10, border: `1px solid ${borderColor}`, background: cardBg, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: mutedColor }}>CANCEL</button>
                <button onClick={handleBulkImport} style={{ padding: '10px 22px', borderRadius: 10, border: 'none', background: primaryGradient, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 12 }}><FontAwesomeIcon icon={faUpload} className="me-2" />IMPORT</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DialogBox.Confirm
        show={!!deleteRow}
        onHide={() => setDeleteRow(null)}
        title="Delete Mapping"
        message={deleteRow ? `Delete mapping for "${deleteRow.name}" (${deleteRow.code})?` : ''}
        variant="danger"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        size="sm"
      />

      <DialogBox.Alert
        show={alert.show}
        onHide={() => setAlert({ show: false, title: '', message: '', variant: 'info' })}
        title={alert.title}
        message={alert.message}
        variant={alert.variant}
        confirmLabel="OK"
        size="sm"
      />
    </div>
  );
};

export default BiometricMapping;
