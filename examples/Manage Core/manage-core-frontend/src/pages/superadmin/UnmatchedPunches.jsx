import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
  faChartLine,
  faBan,
  faClock,
  faUsers,
  faIdCard,
  faUserSlash,
  faTrash,
  faCodeBranch,
  faQuestionCircle,
  faCheckCircle,
  faTimesCircle,
  faUserPlus,
  faXmark,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import DialogBox from '../../components/common/UI/Boxes/DialogBox';

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 15 } },
};

const reasons = [
  { name: 'Missing Employee Code', icon: faIdCard, count: 623, color: '#f59e0b' },
  { name: 'Inactive Employee', icon: faUserSlash, count: 412, color: '#ef4444' },
  { name: 'Deleted Employee', icon: faTrash, count: 178, color: '#6b7280' },
  { name: 'Wrong Device Mapping', icon: faCodeBranch, count: 534, color: '#4f46e5' },
  { name: 'Unknown Device Code', icon: faQuestionCircle, count: 100, color: '#10b981' },
];

const mockPunches = [
  { id: 'UP-001', device: 'Main Gate ZKTeco', time: '2026-06-18 08:30 AM', empCode: '—', reason: 'Missing Employee Code' },
  { id: 'UP-002', device: 'Factory Face', time: '2026-06-18 09:15 AM', empCode: 'EMP-999', reason: 'Inactive Employee' },
  { id: 'UP-003', device: 'Parking FP', time: '2026-06-18 10:00 AM', empCode: '—', reason: 'Unknown Device Code' },
  { id: 'UP-004', device: 'HR Floor eSSL', time: '2026-06-18 11:30 AM', empCode: 'EMP-555', reason: 'Wrong Device Mapping' },
  { id: 'UP-005', device: 'Main Gate ZKTeco', time: '2026-06-18 12:00 PM', empCode: '—', reason: 'Deleted Employee' },
];

const statCards = [
  { label: 'Total Unmatched', value: '1,847', color: '#f59e0b', icon: faExclamationTriangle },
  { label: 'Resolution Rate', value: '76.3%', color: '#10b981', icon: faChartLine },
  { label: 'Ignored Punches', value: '342', color: '#6b7280', icon: faBan },
  { label: 'Pending Reviews', value: '505', color: '#4f46e5', icon: faClock },
  { label: 'HR Review Queue', value: '38', color: '#ef4444', icon: faUsers },
];

const UnmatchedPunches = ({ isDark }) => {
  const [punches, setPunches] = useState(mockPunches);
  const [alert, setAlert] = useState({ show: false, title: '', message: '', variant: 'info' });
  const [assignPunch, setAssignPunch] = useState(null);
  const [assignCode, setAssignCode] = useState('');
  const [employees] = useState([
    { code: 'EMP-001', name: 'Ahmad Hassan' },
    { code: 'EMP-002', name: 'Fatima Ali' },
    { code: 'EMP-003', name: 'Usman Khan' },
    { code: 'EMP-004', name: 'Ayesha Malik' },
    { code: 'EMP-005', name: 'Bilal Ahmed' },
    { code: 'EMP-006', name: 'Sana Tariq' },
  ]);
  const [empSearch, setEmpSearch] = useState('');

  const bg = isDark ? '#0f172a' : '#f1f5f9';
  const cardBg = isDark ? 'rgba(30,41,59,0.7)' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc';
  const primaryGradient = 'linear-gradient(135deg, #4f46e5, #7c3aed)';
  const radius = 14;

  const handleResolve = (id) => {
    setPunches((prev) => prev.filter((p) => p.id !== id));
    setAlert({ show: true, title: 'Punch Resolved', message: `Punch ${id} has been marked as resolved.`, variant: 'success' });
  };

  const handleResolveAll = () => {
    setPunches([]);
    setAlert({ show: true, title: 'All Resolved', message: 'All unmatched punches have been resolved.', variant: 'success' });
  };

  const handleIgnore = (punch) => {
    setPunches((prev) => prev.filter((p) => p.id !== punch.id));
    setAlert({ show: true, title: 'Punch Ignored', message: `Punch ${punch.id} has been ignored and removed from the queue.`, variant: 'info' });
  };

  const openAssign = (punch) => {
    setAssignCode('');
    setEmpSearch('');
    setAssignPunch(punch);
  };

  const confirmAssign = () => {
    if (!assignCode) {
      setAlert({ show: true, title: 'Select Employee', message: 'Please select an employee to assign this punch.', variant: 'warning' });
      return;
    }
    const emp = employees.find(e => e.code === assignCode);
    setPunches((prev) => prev.filter((p) => p.id !== assignPunch.id));
    setAlert({ show: true, title: 'Punch Assigned', message: `Punch ${assignPunch.id} assigned to ${emp ? emp.name : assignCode}.`, variant: 'success' });
    setAssignPunch(null);
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      style={{
        minHeight: '100vh',
        backgroundColor: bg,
        padding: '28px 32px',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: textColor,
      }}
    >
      <motion.div variants={item} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: primaryGradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 20,
                color: '#fff',
                boxShadow: '0 8px 24px rgba(79,70,229,0.3)',
              }}
            >
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px' }}>
                Unmatched Punch Resolution Center
              </h1>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: mutedColor }}>
                Review and resolve biometric punches that cannot be matched to employees
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleResolveAll}
            style={{
              padding: '10px 24px',
              borderRadius: 10,
              border: 'none',
              background: primaryGradient,
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(79,70,229,0.25)',
            }}
          >
            <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: 8 }} />
            Resolve All
          </motion.button>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 28 }}>
        {statCards.map((s) => (
          <motion.div
            key={s.label}
            variants={item}
            style={{
              backgroundColor: cardBg,
              borderRadius: radius,
              padding: '18px 20px',
              border: `1px solid ${borderColor}`,
              backdropFilter: 'blur(12px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 13, color: mutedColor, fontWeight: 500 }}>{s.label}</span>
              <FontAwesomeIcon icon={s.icon} style={{ fontSize: 16, color: s.color, opacity: 0.8 }} />
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.5px' }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      <motion.div variants={item} style={{ marginBottom: 28 }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>
          Reasons Breakdown
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14 }}>
          {reasons.map((r) => (
            <motion.div
              key={r.name}
              whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
              style={{
                backgroundColor: cardBg,
                borderRadius: radius,
                padding: '18px 20px',
                border: `1px solid ${borderColor}`,
                borderLeft: `4px solid ${r.color}`,
                backdropFilter: 'blur(12px)',
                cursor: 'default',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <FontAwesomeIcon icon={r.icon} style={{ fontSize: 16, color: r.color }} />
                <span style={{ fontSize: 13, fontWeight: 500, color: mutedColor }}>{r.name}</span>
              </div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>{r.count.toLocaleString()}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={item}
        style={{
          backgroundColor: cardBg,
          borderRadius: radius,
          border: `1px solid ${borderColor}`,
          backdropFilter: 'blur(12px)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: `1px solid ${borderColor}`,
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          Unmatched Punch Queue
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ backgroundColor: inputBg }}>
                {['Punch ID', 'Device Name', 'Punch Time', 'Employee Code', 'Reason', 'Actions'].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: 'left',
                      padding: '12px 16px',
                      fontSize: 12,
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      color: mutedColor,
                      borderBottom: `1px solid ${borderColor}`,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {punches.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ delay: i * 0.03 }}
                  style={{
                    borderBottom: i < punches.length - 1 ? `1px solid ${borderColor}` : 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = inputBg)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{ padding: '14px 16px', fontWeight: 600, whiteSpace: 'nowrap' }}>{p.id}</td>
                  <td style={{ padding: '14px 16px', color: mutedColor, whiteSpace: 'nowrap' }}>{p.device}</td>
                  <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>{p.time}</td>
                  <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                    {p.empCode === '—' ? (
                      <span style={{ color: mutedColor }}>—</span>
                    ) : (
                      <span
                        style={{
                          backgroundColor: isDark ? 'rgba(79,70,229,0.15)' : '#eef2ff',
                          color: '#4f46e5',
                          padding: '2px 10px',
                          borderRadius: 6,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {p.empCode}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span
                      style={{
                        backgroundColor: isDark ? 'rgba(245,158,11,0.12)' : '#fffbeb',
                        color: '#d97706',
                        padding: '3px 10px',
                        borderRadius: 6,
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {p.reason}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Assign"
                        onClick={() => openAssign(p)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          border: `1px solid ${borderColor}`,
                          background: 'transparent',
                          color: '#4f46e5',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 13,
                        }}
                      >
                        <FontAwesomeIcon icon={faUserPlus} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Ignore"
                        onClick={() => handleIgnore(p)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          border: `1px solid ${borderColor}`,
                          background: 'transparent',
                          color: '#ef4444',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 13,
                        }}
                      >
                        <FontAwesomeIcon icon={faTimesCircle} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Resolve"
                        onClick={() => handleResolve(p.id)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 8,
                          border: `1px solid ${borderColor}`,
                          background: 'transparent',
                          color: '#10b981',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 13,
                        }}
                      >
                        <FontAwesomeIcon icon={faCheckCircle} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {punches.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: mutedColor }}>
                    <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: 28, marginBottom: 10, color: '#10b981' }} />
                    <br />
                    All unmatched punches have been resolved.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Assign Punch Modal ── */}
      <AnimatePresence>
        {assignPunch && (
          <div
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(2px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setAssignPunch(null); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{ background: cardBg, borderRadius: 18, width: '100%', maxWidth: 480, overflow: 'hidden', border: `1px solid ${borderColor}` }}
            >
              <div style={{ padding: '20px 24px', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: primaryGradient, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FontAwesomeIcon icon={faUserPlus} />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: textColor }}>Assign Punch {assignPunch.id}</div>
                </div>
                <button onClick={() => setAssignPunch(null)} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: inputBg, cursor: 'pointer', color: mutedColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>
              <div style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: 12, color: mutedColor, marginBottom: 6 }}>
                  Device: <strong style={{ color: textColor }}>{assignPunch.device}</strong> · Time: <strong style={{ color: textColor }}>{assignPunch.time}</strong> · Reason: <strong style={{ color: textColor }}>{assignPunch.reason}</strong>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 10, background: inputBg, border: `1px solid ${borderColor}`, margin: '10px 0 14px' }}>
                  <FontAwesomeIcon icon={faSearch} style={{ color: mutedColor, fontSize: 12 }} />
                  <input value={empSearch} onChange={(e) => setEmpSearch(e.target.value)} placeholder="Search employee..." style={{ background: 'transparent', border: 'none', outline: 'none', color: textColor, fontSize: 13, width: '100%' }} />
                </div>
                <div style={{ maxHeight: 220, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {employees.filter(e => e.name.toLowerCase().includes(empSearch.toLowerCase()) || e.code.toLowerCase().includes(empSearch.toLowerCase())).map((emp) => (
                    <button
                      key={emp.code}
                      onClick={() => setAssignCode(emp.code)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 14px', borderRadius: 10, border: `1px solid ${assignCode === emp.code ? '#4f46e5' : borderColor}`,
                        background: assignCode === emp.code ? 'rgba(79,70,229,0.1)' : inputBg, cursor: 'pointer', textAlign: 'left',
                      }}
                    >
                      <span style={{ fontWeight: 600, color: textColor, fontSize: 13 }}>{emp.name}</span>
                      <span style={{ fontSize: 12, color: mutedColor }}>{emp.code}</span>
                    </button>
                  ))}
                  {employees.length === 0 && <div style={{ color: mutedColor, fontSize: 13, textAlign: 'center', padding: 12 }}>No employees found.</div>}
                </div>
              </div>
              <div style={{ padding: '16px 24px', borderTop: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'flex-end', gap: 10, background: inputBg }}>
                <button onClick={() => setAssignPunch(null)} style={{ padding: '10px 22px', borderRadius: 10, border: `1px solid ${borderColor}`, background: cardBg, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: mutedColor }}>CANCEL</button>
                <button onClick={confirmAssign} style={{ padding: '10px 22px', borderRadius: 10, border: 'none', background: primaryGradient, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 12 }}>
                  <FontAwesomeIcon icon={faCheckCircle} className="me-2" />ASSIGN PUNCH
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

export default UnmatchedPunches;
