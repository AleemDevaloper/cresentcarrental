import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  faIdCard,
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
  faUserCheck,
  faSync,
  faUpload,
  faEdit,
  faTrash,
  faPlus,
  faServer,
  faWifi,
  faUsd,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DialogBox from '../../components/common/UI/Boxes/DialogBox';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 14 } },
};

const cardHover = { y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.18)' };

const BiometricDevices = ({ isDark }) => {
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: 'Main Gate ZKTeco',
      code: 'ZK-001',
      serial: 'SN-2026-A001',
      ip: '192.168.1.100',
      mode: 'TCP/IP',
      status: 'Online',
      site: 'Head Office',
      statusColor: '#10b981',
    },
    {
      id: 2,
      name: 'HR Floor eSSL',
      code: 'ES-002',
      serial: 'SN-2026-B002',
      ip: '192.168.1.101',
      mode: 'TCP/IP',
      status: 'Online',
      site: 'Head Office',
      statusColor: '#10b981',
    },
    {
      id: 3,
      name: 'Factory Face Device',
      code: 'FC-003',
      serial: 'SN-2026-C003',
      ip: '192.168.2.50',
      mode: 'USB',
      status: 'Offline',
      site: 'Factory Site',
      statusColor: '#ef4444',
    },
    {
      id: 4,
      name: 'Parking Fingerprint',
      code: 'FP-004',
      serial: 'SN-2026-D004',
      ip: '192.168.1.102',
      mode: 'TCP/IP',
      status: 'Error',
      site: 'Head Office',
      statusColor: '#f59e0b',
    },
  ]);

  const [executing, setExecuting] = useState(null);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [editDevice, setEditDevice] = useState(null);
  const [deleteDevice, setDeleteDevice] = useState(null);
  const [alert, setAlert] = useState({ show: false, title: '', message: '', variant: 'info' });
  const [busyDevice, setBusyDevice] = useState(null);

  const bg = isDark ? '#0f172a' : '#f1f5f9';
  const cardBg = isDark ? 'rgba(30,41,59,0.7)' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc';
  const primaryGradient = 'linear-gradient(135deg, #4f46e5, #7c3aed)';
  const radius = 14;

  const emptyForm = { name: '', code: '', serial: '', ip: '', mode: 'TCP/IP', status: 'Online', site: '' };
  const [form, setForm] = useState(emptyForm);

  const analyticsData = [
    { label: 'Connected Devices', value: String(devices.filter(d => d.status === 'Online').length), color: '#10b981', icon: faCheckCircle, progress: Math.min(100, devices.filter(d => d.status === 'Online').length * 25) },
    { label: 'Offline Devices', value: String(devices.filter(d => d.status === 'Offline').length), color: '#ef4444', icon: faTimesCircle, progress: 10 },
    { label: 'Failed Syncs', value: String(devices.filter(d => d.status === 'Error').length), color: '#f59e0b', icon: faExclamationTriangle, progress: 23 },
    { label: 'Total Devices', value: String(devices.length), color: '#4f46e5', icon: faUserCheck, progress: 92 },
  ];

  const commandActions = [
    {
      title: 'Remote Sync',
      icon: faSync,
      desc: 'Trigger an on-demand sync across all connected biometric devices to refresh attendance logs in real time.',
    },
    {
      title: 'Employee Push',
      icon: faUpload,
      desc: 'Push updated employee credentials, access levels, and biometric templates to selected devices.',
    },
    {
      title: 'Device Retirement',
      icon: faTrash,
      desc: 'Securely decommission and wipe device configurations, removing it from the central management console.',
    },
  ];

  const handleExecute = (index, title) => {
    setExecuting(index);
    setTimeout(() => {
      setExecuting(null);
      if (title === 'Device Retirement') {
        setAlert({ show: true, title: 'Command Queued', message: 'Device retirement command has been queued for all decommissioned units.', variant: 'success' });
      } else if (title === 'Employee Push') {
        setAlert({ show: true, title: 'Push Complete', message: 'Employee templates pushed to all online devices.', variant: 'success' });
      } else {
        setAlert({ show: true, title: 'Sync Complete', message: 'All connected devices have been synchronized successfully.', variant: 'success' });
      }
    }, 2000);
  };

  const handleDeviceAction = (device, action) => {
    if (action === 'Sync') {
      setBusyDevice(device.id);
      setTimeout(() => {
        setBusyDevice(null);
        setAlert({ show: true, title: 'Sync Complete', message: `Device "${device.name}" has been synchronized.`, variant: 'success' });
      }, 1800);
    } else if (action === 'Push Employees') {
      setAlert({ show: true, title: 'Employees Pushed', message: `Employee credentials pushed to "${device.name}".`, variant: 'success' });
    } else if (action === 'Edit') {
      setForm({
        name: device.name, code: device.code, serial: device.serial,
        ip: device.ip, mode: device.mode, status: device.status, site: device.site,
      });
      setEditDevice(device);
      setRegisterOpen(true);
    }
  };

  const openRegister = () => {
    setForm(emptyForm);
    setRegisterOpen(true);
  };

  const saveDevice = () => {
    if (!form.name || !form.code) {
      setAlert({ show: true, title: 'Missing Fields', message: 'Device name and code are required.', variant: 'warning' });
      return;
    }
    if (editDevice) {
      setDevices(prev => prev.map(d => d.id === editDevice.id
        ? { ...d, ...form, statusColor: form.status === 'Online' ? '#10b981' : form.status === 'Offline' ? '#ef4444' : '#f59e0b' }
        : d));
      setAlert({ show: true, title: 'Device Updated', message: `Device "${form.name}" has been updated.`, variant: 'success' });
    } else {
      const newId = Date.now();
      setDevices(prev => [...prev, {
        id: newId, ...form,
        statusColor: form.status === 'Online' ? '#10b981' : form.status === 'Offline' ? '#ef4444' : '#f59e0b',
      }]);
      setAlert({ show: true, title: 'Device Registered', message: `Device "${form.name}" (${form.code}) registered successfully.`, variant: 'success' });
    }
    setRegisterOpen(false);
    setEditDevice(null);
    setForm(emptyForm);
  };

  const confirmDelete = () => {
    setDevices(prev => prev.filter(d => d.id !== deleteDevice.id));
    setAlert({ show: true, title: 'Device Removed', message: `Device "${deleteDevice.name}" has been removed.`, variant: 'info' });
    setDeleteDevice(null);
  };

  const inputStyle = {
    width: '100%', padding: '9px 14px', borderRadius: 10, border: `1px solid ${borderColor}`,
    background: inputBg, fontSize: 13, color: textColor, outline: 'none',
  };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: mutedColor, marginBottom: 5, display: 'block' };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{
        padding: '30px 34px',
        minHeight: '100vh',
        background: bg,
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* ── Header ── */}
      <motion.div
        variants={itemVariants}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 32,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: primaryGradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              color: '#fff',
              boxShadow: '0 8px 24px rgba(79,70,229,0.35)',
            }}
          >
            <FontAwesomeIcon icon={faIdCard} />
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: '-0.3px',
                color: textColor,
              }}
            >
              Enterprise Biometric Device Management
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 14, color: mutedColor }}>
              Centrally manage attendance hardware, ZKTeco, eSSL, face &amp; fingerprint devices
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.96 }}
          onClick={openRegister}
          style={{
            padding: '11px 26px',
            border: 'none',
            borderRadius: radius,
            background: primaryGradient,
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 6px 20px rgba(79,70,229,0.3)',
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
          Register Device
        </motion.button>
      </motion.div>

      {/* ── Analytics Row ── */}
      <motion.div
        variants={itemVariants}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 18,
          marginBottom: 32,
        }}
      >
        {analyticsData.map((stat, i) => (
          <motion.div
            key={stat.label}
            whileHover={cardHover}
            style={{
              background: cardBg,
              borderRadius: radius,
              padding: '20px 22px',
              border: `1px solid ${borderColor}`,
              backdropFilter: isDark ? 'blur(12px)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: `${stat.color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 17,
                  color: stat.color,
                }}
              >
                <FontAwesomeIcon icon={stat.icon} />
              </div>
              <span style={{ fontSize: 13, color: mutedColor }}>{stat.label}</span>
            </div>
            <span
              style={{
                fontSize: 30,
                fontWeight: 700,
                color: textColor,
                lineHeight: 1,
                letterSpacing: '-0.5px',
              }}
            >
              {stat.value}
            </span>
            <div
              style={{
                width: '100%',
                height: 4,
                borderRadius: 4,
                background: borderColor,
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stat.progress}%` }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  borderRadius: 4,
                  background: stat.color,
                }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Device Cards ── */}
      <motion.div
        variants={itemVariants}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 20,
          marginBottom: 32,
        }}
      >
        {devices.map((device, i) => (
          <motion.div
            key={device.id}
            whileHover={cardHover}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            style={{
              background: cardBg,
              borderRadius: radius,
              padding: '24px 24px 20px',
              border: `1px solid ${borderColor}`,
              backdropFilter: isDark ? 'blur(12px)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
            }}
          >
            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: primaryGradient,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 15,
                      color: '#fff',
                    }}
                  >
                    <FontAwesomeIcon icon={faServer} />
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: textColor }}>{device.name}</div>
                    <div style={{ fontSize: 12, color: mutedColor }}>{device.code}</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    padding: '3px 12px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    background: `${device.statusColor}20`,
                    color: device.statusColor,
                    border: `1px solid ${device.statusColor}40`,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {device.status}
                </span>
                <button
                  onClick={() => setDeleteDevice(device)}
                  title="Remove"
                  style={{
                    width: 30, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: '#ef444415', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} style={{ fontSize: 12 }} />
                </button>
              </div>
            </div>

            {/* Details grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px 16px',
                fontSize: 13,
              }}
            >
              <div>
                <span style={{ color: mutedColor }}>Serial</span>
                <div style={{ color: textColor, fontWeight: 500, marginTop: 1 }}>{device.serial}</div>
              </div>
              <div>
                <span style={{ color: mutedColor }}>IP Address</span>
                <div style={{ color: textColor, fontWeight: 500, marginTop: 1 }}>{device.ip}</div>
              </div>
              <div>
                <span style={{ color: mutedColor }}>Connection</span>
                <div
                  style={{
                    color: textColor,
                    fontWeight: 500,
                    marginTop: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <FontAwesomeIcon
                    icon={device.mode === 'USB' ? faUsd : faWifi}
                    style={{ fontSize: 11, color: mutedColor }}
                  />
                  {device.mode}
                </div>
              </div>
              <div>
                <span style={{ color: mutedColor }}>Site</span>
                <div style={{ color: textColor, fontWeight: 500, marginTop: 1 }}>{device.site}</div>
              </div>
            </div>

            {/* Quick actions */}
            <div
              style={{
                display: 'flex',
                gap: 8,
                marginTop: 6,
                paddingTop: 14,
                borderTop: `1px solid ${borderColor}`,
              }}
            >
              {[
                { icon: faSync, label: busyDevice === device.id ? 'Syncing...' : 'Sync', color: '#4f46e5' },
                { icon: faUpload, label: 'Push Employees', color: '#10b981' },
                { icon: faEdit, label: 'Edit', color: '#f59e0b' },
              ].map((action) => (
                <motion.button
                  key={action.label}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={busyDevice === device.id}
                  onClick={() => handleDeviceAction(device, action.label.replace('Syncing...', 'Sync').replace('...', ''))}
                  style={{
                    flex: 1,
                    padding: '7px 0',
                    border: `1px solid ${action.color}30`,
                    borderRadius: 8,
                    background: `${action.color}0d`,
                    color: action.color,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: busyDevice === device.id ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    transition: 'background 0.2s',
                    opacity: busyDevice === device.id ? 0.6 : 1,
                  }}
                >
                  <FontAwesomeIcon icon={action.icon} style={{ fontSize: 11 }} />
                  {action.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Command Queue Section ── */}
      <motion.div variants={itemVariants}>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: textColor,
            margin: '0 0 16px',
            letterSpacing: '-0.2px',
          }}
        >
          Command Queue
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 18,
          }}
        >
          {commandActions.map((cmd, i) => (
            <motion.div
              key={cmd.title}
              whileHover={cardHover}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 + i * 0.08 }}
              style={{
                background: cardBg,
                borderRadius: radius,
                padding: '20px 22px',
                border: `1px solid ${borderColor}`,
                backdropFilter: isDark ? 'blur(12px)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: primaryGradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 15,
                    color: '#fff',
                  }}
                >
                  <FontAwesomeIcon icon={cmd.icon} />
                </div>
                <span style={{ fontSize: 15, fontWeight: 600, color: textColor }}>{cmd.title}</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: mutedColor, lineHeight: 1.5 }}>
                {cmd.desc}
              </p>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleExecute(i, cmd.title)}
                disabled={executing === i}
                style={{
                  padding: '9px 0',
                  border: 'none',
                  borderRadius: 10,
                  background: executing === i ? '#10b981' : primaryGradient,
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: executing === i ? 'default' : 'pointer',
                  marginTop: 4,
                  transition: 'background 0.3s',
                  boxShadow:
                    executing === i
                      ? '0 4px 14px rgba(16,185,129,0.3)'
                      : '0 4px 14px rgba(79,70,229,0.25)',
                }}
              >
                {executing === i ? 'Executing...' : 'Execute'}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Register / Edit Device Modal ── */}
      <AnimatePresence>
        {registerOpen && (
          <div
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1050,
              display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(2px)',
            }}
            onClick={(e) => { if (e.target === e.currentTarget) { setRegisterOpen(false); setEditDevice(null); } }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{ background: cardBg, borderRadius: 18, width: '100%', maxWidth: 540, overflow: 'hidden', border: `1px solid ${borderColor}` }}
            >
              <div style={{ padding: '20px 24px', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: primaryGradient, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FontAwesomeIcon icon={faServer} />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: textColor }}>{editDevice ? 'Edit Device' : 'Register Device'}</div>
                </div>
                <button onClick={() => { setRegisterOpen(false); setEditDevice(null); }} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: inputBg, cursor: 'pointer', color: mutedColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>

              <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={labelStyle}>Device Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Main Gate ZKTeco" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Device Code</label>
                  <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. ZK-001" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Serial Number</label>
                  <input value={form.serial} onChange={(e) => setForm({ ...form, serial: e.target.value })} placeholder="SN-2026-A001" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>IP Address</label>
                  <input value={form.ip} onChange={(e) => setForm({ ...form, ip: e.target.value })} placeholder="192.168.1.100" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Connection Mode</label>
                  <select value={form.mode} onChange={(e) => setForm({ ...form, mode: e.target.value })} style={inputStyle}>
                    <option>TCP/IP</option>
                    <option>USB</option>
                    <option>RS485</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} style={inputStyle}>
                    <option>Online</option>
                    <option>Offline</option>
                    <option>Error</option>
                  </select>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Site / Location</label>
                  <input value={form.site} onChange={(e) => setForm({ ...form, site: e.target.value })} placeholder="e.g. Head Office" style={inputStyle} />
                </div>
              </div>

              <div style={{ padding: '16px 24px', borderTop: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'flex-end', gap: 10, background: inputBg }}>
                <button onClick={() => { setRegisterOpen(false); setEditDevice(null); }} style={{ padding: '10px 22px', borderRadius: 10, border: `1px solid ${borderColor}`, background: cardBg, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: mutedColor }}>
                  CANCEL
                </button>
                <button onClick={saveDevice} style={{ padding: '10px 22px', borderRadius: 10, border: 'none', background: primaryGradient, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 12 }}>
                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" />{editDevice ? 'SAVE CHANGES' : 'REGISTER DEVICE'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DialogBox.Confirm
        show={!!deleteDevice}
        onHide={() => setDeleteDevice(null)}
        title="Remove Device"
        message={deleteDevice ? `Remove device "${deleteDevice.name}" (${deleteDevice.code}) from the management console?` : ''}
        variant="danger"
        confirmLabel="Remove"
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
    </motion.div>
  );
};

export default BiometricDevices;
