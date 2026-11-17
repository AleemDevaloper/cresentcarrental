import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faCheckCircle,
  faExclamationTriangle,
  faCopy,
  faChartLine,
  faRedo,
  faWrench,
  faFilter,
  faCalendarAlt,
  faSearch,
  faXmark,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import DialogBox from '../../components/common/UI/Boxes/DialogBox';

const RawPunches = ({ isDark }) => {
  const bg = isDark ? '#0f172a' : '#f1f5f9';
  const cardBg = isDark ? 'rgba(30,41,59,0.7)' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc';
  const primaryGradient = 'linear-gradient(135deg, #4f46e5, #7c3aed)';
  const radius = 14;

  const [punches, setPunches] = useState([
    { id: 'P-1001', empCode: 'EMP-001', empName: 'Ahmad Hassan', device: 'Main Gate ZKTeco', time: '2026-06-18 08:55 AM', status: 'Matched' },
    { id: 'P-1002', empCode: 'EMP-002', empName: 'Fatima Ali', device: 'HR Floor eSSL', time: '2026-06-18 09:01 AM', status: 'Matched' },
    { id: 'P-1003', empCode: 'EMP-003', empName: 'Usman Khan', device: 'Factory Face', time: '2026-06-18 08:30 AM', status: 'Unmatched' },
    { id: 'P-1004', empCode: 'EMP-004', empName: 'Ayesha Malik', device: 'Parking FP', time: '2026-06-18 09:15 AM', status: 'Duplicate' },
    { id: 'P-1005', empCode: '—', empName: '—', device: 'Main Gate ZKTeco', time: '2026-06-18 10:00 AM', status: 'Failed' },
    { id: 'P-1006', empCode: 'EMP-001', empName: 'Ahmad Hassan', device: 'HR Floor eSSL', time: '2026-06-18 12:30 PM', status: 'Matched' },
  ]);

  const [searchEmp, setSearchEmp] = useState('');
  const [searchDevice, setSearchDevice] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [alert, setAlert] = useState({ show: false, title: '', message: '', variant: 'info' });
  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState('');
  const [busyPunch, setBusyPunch] = useState(null);
  const [correctPunch, setCorrectPunch] = useState(null);

  const statusBadge = (status) => {
    const map = {
      Matched: { bg: 'rgba(16,185,129,0.15)', color: '#10b981' },
      Unmatched: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
      Duplicate: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
      Failed: { bg: 'rgba(239,68,68,0.10)', color: '#ef4444' },
    };
    const s = map[status] || { bg: 'rgba(148,163,184,0.15)', color: mutedColor };
    return (
      <span style={{ display:'inline-block', padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:600, background:s.bg, color:s.color }}>
        {status}
      </span>
    );
  };

  const matched = punches.filter(p => p.status === 'Matched').length;
  const unmatched = punches.filter(p => p.status === 'Unmatched').length;
  const duplicate = punches.filter(p => p.status === 'Duplicate').length;
  const failed = punches.filter(p => p.status === 'Failed').length;
  const processingRate = punches.length ? ((matched / punches.length) * 100).toFixed(1) : '0.0';

  const stats = useMemo(() => [
    { label: 'Imported Punches', value: String(punches.length), color: '#4f46e5', icon: faBolt },
    { label: 'Matched Punches', value: String(matched), color: '#10b981', icon: faCheckCircle },
    { label: 'Unmatched Punches', value: String(unmatched), color: '#f59e0b', icon: faExclamationTriangle },
    { label: 'Duplicate Punches', value: String(duplicate + failed), color: '#ef4444', icon: faCopy },
    { label: 'Processing Rate', value: `${processingRate}%`, color: '#6366f1', icon: faChartLine },
  ], [punches, matched, unmatched, duplicate, failed, processingRate]);

  const filtered = punches.filter(p => {
    const empOk = p.empName.toLowerCase().includes(searchEmp.toLowerCase()) || p.empCode.toLowerCase().includes(searchEmp.toLowerCase());
    const devOk = p.device.toLowerCase().includes(searchDevice.toLowerCase());
    const statusOk = statusFilter === 'All' || p.status === statusFilter;
    return empOk && devOk && statusOk;
  });

  const handleImport = () => {
    const lines = importText.trim().split('\n').filter(Boolean);
    let added = 0;
    const newRows = lines.map(line => {
      const cols = line.split(',').map(c => c.trim());
      const [empCode, empName, device, time] = cols;
      if (!device) return null;
      added++;
      const isMatched = !!empCode && empCode !== '—' && !!empName;
      return {
        id: 'P-' + (1000 + Date.now() + Math.floor(Math.random() * 1000)),
        empCode: empCode || '—',
        empName: empName || '—',
        device,
        time: time || new Date().toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short', year: 'numeric' }),
        status: isMatched ? 'Matched' : 'Unmatched',
      };
    }).filter(Boolean);
    if (newRows.length === 0) {
      setAlert({ show: true, title: 'No Data', message: 'Paste at least one row: EmployeeCode, EmployeeName, Device, Time', variant: 'warning' });
      return;
    }
    setPunches(prev => [...newRows, ...prev]);
    setAlert({ show: true, title: 'Punches Imported', message: `${added} punch(es) imported and processed.`, variant: 'success' });
    setImportOpen(false); setImportText('');
  };

  const reprocess = (punch) => {
    setBusyPunch(punch.id);
    setTimeout(() => {
      setBusyPunch(null);
      setPunches(prev => prev.map(p => p.id === punch.id ? { ...p, status: 'Matched' } : p));
      setAlert({ show: true, title: 'Reprocessed', message: `Punch ${punch.id} reprocessed and matched.`, variant: 'success' });
    }, 1600);
  };

  const applyCorrection = (punch) => {
    setPunches(prev => prev.map(p => p.id === punch.id ? { ...p, status: 'Matched' } : p));
    setCorrectPunch(null);
    setAlert({ show: true, title: 'Punch Corrected', message: `Punch ${punch.id} corrected and matched.`, variant: 'success' });
  };

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  };

  const inputStyle = {
    width: '100%', padding: '9px 14px', borderRadius: 10, border: `1px solid ${borderColor}`,
    background: inputBg, fontSize: 13, color: textColor, outline: 'none',
  };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: mutedColor, marginBottom: 5, display: 'block' };

  return (
    <motion.div
      style={{ minHeight:'100vh', background:bg, padding:'28px 32px', color:textColor, fontFamily:"'Inter',-apple-system,BlinkMacSystemFont,sans-serif" }}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28, flexWrap:'wrap', gap:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ width:48, height:48, borderRadius:14, background:primaryGradient, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, color:'#fff' }}>
            <FontAwesomeIcon icon={faBolt} />
          </div>
          <div>
            <h1 style={{ margin:0, fontSize:22, fontWeight:700, letterSpacing:'-0.3px' }}>Raw Punch Processing Engine</h1>
            <p style={{ margin:'3px 0 0 0', fontSize:13, color:mutedColor }}>Biometric punch synchronization, verification and processing platform</p>
          </div>
        </div>
        <button onClick={() => setImportOpen(true)} style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'10px 24px', border:'none', borderRadius:radius, background:primaryGradient, color:'#fff', fontSize:14, fontWeight:600, cursor:'pointer', boxShadow:'0 4px 14px rgba(79,70,229,0.35)' }}>
          <FontAwesomeIcon icon={faBolt} />
          Import Punches
        </button>
      </motion.div>

      <motion.div variants={itemVariants} style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:16, marginBottom:24 }}>
        {stats.map((s, i) => (
          <div key={i} style={{ background:cardBg, borderRadius:radius, border:`1px solid ${borderColor}`, padding:'18px 20px', backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontSize:12, fontWeight:500, color:mutedColor, textTransform:'uppercase', letterSpacing:'0.5px' }}>{s.label}</span>
              <div style={{ width:36, height:36, borderRadius:10, background:`${s.color}15`, display:'flex', alignItems:'center', justifyContent:'center', color:s.color, fontSize:14 }}>
                <FontAwesomeIcon icon={s.icon} />
              </div>
            </div>
            <div style={{ fontSize:26, fontWeight:700, letterSpacing:'-0.5px' }}>{s.value}</div>
          </div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap', marginBottom:18 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 14px', borderRadius:10, background:inputBg, border:`1px solid ${borderColor}`, cursor:'pointer' }}>
          <FontAwesomeIcon icon={faCalendarAlt} style={{ color:mutedColor, fontSize:12 }} />
          <span style={{ fontSize:13, color:mutedColor }}>Today</span>
          <FontAwesomeIcon icon={faFilter} style={{ color:mutedColor, fontSize:10, marginLeft:4 }} />
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 14px', borderRadius:10, background:inputBg, border:`1px solid ${borderColor}`, cursor:'pointer', flex:1, maxWidth:220 }}>
          <FontAwesomeIcon icon={faSearch} style={{ color:mutedColor, fontSize:12 }} />
          <input value={searchEmp} onChange={(e) => setSearchEmp(e.target.value)} placeholder="Search Employee" style={{ background:'transparent', border:'none', outline:'none', color:textColor, fontSize:13, width:'100%' }} />
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 14px', borderRadius:10, background:inputBg, border:`1px solid ${borderColor}`, cursor:'pointer', flex:1, maxWidth:220 }}>
          <FontAwesomeIcon icon={faSearch} style={{ color:mutedColor, fontSize:12 }} />
          <input value={searchDevice} onChange={(e) => setSearchDevice(e.target.value)} placeholder="Search Device" style={{ background:'transparent', border:'none', outline:'none', color:textColor, fontSize:13, width:'100%' }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding:'8px 14px', borderRadius:10, background:inputBg, border:`1px solid ${borderColor}`, color:textColor, fontSize:13, outline:'none', cursor:'pointer' }}>
          <option>All</option>
          <option>Matched</option>
          <option>Unmatched</option>
          <option>Duplicate</option>
          <option>Failed</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants} style={{ background:cardBg, borderRadius:radius, border:`1px solid ${borderColor}`, backdropFilter:'blur(12px)', WebkitBackdropFilter:'blur(12px)', overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ borderBottom:`1px solid ${borderColor}` }}>
                {['Punch ID','Employee Code','Employee Name','Device','Punch Time','Status','Actions'].map((h) => (
                  <th key={h} style={{ padding:'14px 16px', textAlign:'left', fontWeight:600, color:mutedColor, fontSize:11, textTransform:'uppercase', letterSpacing:'0.6px', whiteSpace:'nowrap', background:isDark?'rgba(15,23,42,0.3)':'rgba(241,245,249,0.5)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} style={{ borderBottom:`1px solid ${borderColor}`, transition:'background 0.15s' }} onMouseEnter={(e) => e.currentTarget.style.background = inputBg} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding:'12px 16px', fontWeight:600, whiteSpace:'nowrap' }}>{p.id}</td>
                  <td style={{ padding:'12px 16px', color:mutedColor, whiteSpace:'nowrap' }}>{p.empCode}</td>
                  <td style={{ padding:'12px 16px', whiteSpace:'nowrap' }}>{p.empName}</td>
                  <td style={{ padding:'12px 16px', color:mutedColor, whiteSpace:'nowrap' }}>{p.device}</td>
                  <td style={{ padding:'12px 16px', whiteSpace:'nowrap' }}>{p.time}</td>
                  <td style={{ padding:'12px 16px' }}>{statusBadge(p.status)}</td>
                  <td style={{ padding:'12px 16px', whiteSpace:'nowrap' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <button disabled={busyPunch === p.id} onClick={() => reprocess(p)} style={{ width:30, height:30, borderRadius:8, border:`1px solid ${borderColor}`, background: busyPunch === p.id ? primaryGradient : 'transparent', color: busyPunch === p.id ? '#fff' : mutedColor, cursor: busyPunch === p.id ? 'default' : 'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:12, opacity: busyPunch === p.id ? 0.7 : 1 }} title="Reprocess">
                        <FontAwesomeIcon icon={faRedo} spin={busyPunch === p.id} />
                      </button>
                      <button onClick={() => setCorrectPunch(p)} style={{ width:30, height:30, borderRadius:8, border:`1px solid ${borderColor}`, background:'transparent', color:mutedColor, cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:12 }} title="Correct">
                        <FontAwesomeIcon icon={faWrench} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 40, textAlign: 'center', color: mutedColor }}>No punches match the current filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Import Punches Modal ── */}
      <AnimatePresence>
        {importOpen && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1050, display:'flex', alignItems:'center', justifyContent:'center', padding:20, backdropFilter:'blur(2px)' }} onClick={(e) => { if (e.target === e.currentTarget) setImportOpen(false); }}>
            <motion.div initial={{ opacity:0, scale:0.94, y:10 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.94, y:10 }} transition={{ type:'spring', damping:25, stiffness:300 }} style={{ background:cardBg, borderRadius:18, width:'100%', maxWidth:560, overflow:'hidden', border:`1px solid ${borderColor}` }}>
              <div style={{ padding:'20px 24px', borderBottom:`1px solid ${borderColor}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:primaryGradient, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}><FontAwesomeIcon icon={faUpload} /></div>
                  <div style={{ fontSize:16, fontWeight:700, color:textColor }}>Import Punches</div>
                </div>
                <button onClick={() => setImportOpen(false)} style={{ width:32, height:32, borderRadius:8, border:'none', background:inputBg, cursor:'pointer', color:mutedColor, display:'flex', alignItems:'center', justifyContent:'center' }}><FontAwesomeIcon icon={faXmark} /></button>
              </div>
              <div style={{ padding:'24px' }}>
                <label style={labelStyle}>Paste punch logs (one per line: EmployeeCode, EmployeeName, Device, Time)</label>
                <textarea value={importText} onChange={(e) => setImportText(e.target.value)} rows={8} placeholder={'EMP-001, Ahmad Hassan, Main Gate ZKTeco, 2026-06-18 08:55 AM\nEMP-002, Fatima Ali, HR Floor eSSL, 2026-06-18 09:01 AM'} style={{ width:'100%', padding:'10px 14px', borderRadius:10, border:`1px solid ${borderColor}`, background:inputBg, color:textColor, fontSize:13, outline:'none', fontFamily:'monospace', resize:'vertical' }} />
                <div style={{ fontSize:12, color:mutedColor, marginTop:8 }}>Rows with a valid Employee Code + Name are auto-matched; others import as Unmatched.</div>
              </div>
              <div style={{ padding:'16px 24px', borderTop:`1px solid ${borderColor}`, display:'flex', justifyContent:'flex-end', gap:10, background:inputBg }}>
                <button onClick={() => setImportOpen(false)} style={{ padding:'10px 22px', borderRadius:10, border:`1px solid ${borderColor}`, background:cardBg, cursor:'pointer', fontSize:12, fontWeight:600, color:mutedColor }}>CANCEL</button>
                <button onClick={handleImport} style={{ padding:'10px 22px', borderRadius:10, border:'none', background:primaryGradient, color:'#fff', fontWeight:600, cursor:'pointer', fontSize:12 }}><FontAwesomeIcon icon={faUpload} className="me-2" />IMPORT PUNCHES</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Correct Punch Modal ── */}
      <AnimatePresence>
        {correctPunch && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', zIndex:1050, display:'flex', alignItems:'center', justifyContent:'center', padding:20, backdropFilter:'blur(2px)' }} onClick={(e) => { if (e.target === e.currentTarget) setCorrectPunch(null); }}>
            <motion.div initial={{ opacity:0, scale:0.94, y:10 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.94, y:10 }} transition={{ type:'spring', damping:25, stiffness:300 }} style={{ background:cardBg, borderRadius:18, width:'100%', maxWidth:480, overflow:'hidden', border:`1px solid ${borderColor}` }}>
              <div style={{ padding:'20px 24px', borderBottom:`1px solid ${borderColor}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:primaryGradient, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}><FontAwesomeIcon icon={faWrench} /></div>
                  <div style={{ fontSize:16, fontWeight:700, color:textColor }}>Correct Punch {correctPunch.id}</div>
                </div>
                <button onClick={() => setCorrectPunch(null)} style={{ width:32, height:32, borderRadius:8, border:'none', background:inputBg, cursor:'pointer', color:mutedColor, display:'flex', alignItems:'center', justifyContent:'center' }}><FontAwesomeIcon icon={faXmark} /></button>
              </div>
              <div style={{ padding:'24px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <div><label style={labelStyle}>Employee Code</label><input defaultValue={correctPunch.empCode === '—' ? '' : correctPunch.empCode} placeholder="EMP-001" style={inputStyle} /></div>
                <div><label style={labelStyle}>Employee Name</label><input defaultValue={correctPunch.empName === '—' ? '' : correctPunch.empName} placeholder="Ahmad Hassan" style={inputStyle} /></div>
                <div style={{ gridColumn:'1 / -1' }}><label style={labelStyle}>Device</label><input defaultValue={correctPunch.device} placeholder="Main Gate ZKTeco" style={inputStyle} /></div>
              </div>
              <div style={{ padding:'16px 24px', borderTop:`1px solid ${borderColor}`, display:'flex', justifyContent:'flex-end', gap:10, background:inputBg }}>
                <button onClick={() => setCorrectPunch(null)} style={{ padding:'10px 22px', borderRadius:10, border:`1px solid ${borderColor}`, background:cardBg, cursor:'pointer', fontSize:12, fontWeight:600, color:mutedColor }}>CANCEL</button>
                <button onClick={() => applyCorrection(correctPunch)} style={{ padding:'10px 22px', borderRadius:10, border:'none', background:primaryGradient, color:'#fff', fontWeight:600, cursor:'pointer', fontSize:12 }}><FontAwesomeIcon icon={faCheckCircle} className="me-2" />APPLY CORRECTION</button>
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

export default RawPunches;
