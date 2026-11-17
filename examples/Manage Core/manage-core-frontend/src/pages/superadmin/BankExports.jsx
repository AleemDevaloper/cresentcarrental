import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUniversity,
  faFileExport,
  faMoneyBillWave,
  faExclamationTriangle,
  faChartLine,
  faCheckCircle,
  faPlus,
  faDownload,
  faSync,
  faTimes,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import {
  listBankExports,
  createBankExport,
  downloadBankExport,
  retryBankExport,
  getBankExportBanks,
  getBankExportStats,
} from '../../api/hrms';

const BankExports = ({ isDark }) => {
  const bg = isDark ? '#0f172a' : '#f1f5f9';
  const cardBg = isDark ? 'rgba(30,41,59,0.7)' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc';
  const primaryGradient = 'linear-gradient(135deg, #4f46e5, #7c3aed)';
  const radius = 14;

  const [exports, setExports] = useState([]);
  const [banks, setBanks] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBank, setSelectedBank] = useState('');
  const [payrollBatches, setPayrollBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [expData, banksData, statsData] = await Promise.all([
        listBankExports({ per_page: 50 }),
        getBankExportBanks(),
        getBankExportStats(),
      ]);
      const items = Array.isArray(expData) ? expData : (expData?.data || []);
      setExports(items);
      setBanks(Array.isArray(banksData) ? banksData : []);
      setAnalytics(statsData || null);
    } catch {
      setError('Failed to load bank export data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleGenerate = async () => {
    if (!selectedBank || !selectedBatch) return;
    setGenerating(true);
    try {
      await createBankExport({ bank_name: selectedBank, payroll_batch_id: selectedBatch });
      setShowModal(false);
      setSelectedBank('');
      setSelectedBatch('');
      fetchData();
    } catch (err) {
      setError(err.message || 'Failed to generate export');
    } finally {
      setGenerating(false);
    }
  };

  const handleRetry = async (id, bankName) => {
    try {
      await retryBankExport(id, { bank_name: bankName, payroll_batch_id: '' });
      fetchData();
    } catch (err) {
      setError(err.message || 'Retry failed');
    }
  };

  const statusBadge = (status) => {
    const colors = {
      completed: { bg: 'rgba(16,185,129,0.12)', text: '#10b981' },
      failed: { bg: 'rgba(239,68,68,0.12)', text: '#ef4444' },
      processing: { bg: 'rgba(245,158,11,0.12)', text: '#f59e0b' },
    };
    const c = colors[status] || { bg: mutedColor + '20', text: mutedColor };
    return <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: c.bg, color: c.text }}>{status}</span>;
  };

  const analyticsCards = analytics ? [
    { label: 'Export History', value: String(analytics.total_exports || 0), color: '#4f46e5', icon: faFileExport, pct: 75 },
    { label: 'Total Transferred', value: analytics.total_amount ? '$' + (analytics.total_amount / 1000000).toFixed(1) + 'M' : '$0', color: '#10b981', icon: faMoneyBillWave, pct: 82 },
    { label: 'Failed Exports', value: String(analytics.failed_exports || 0), color: '#ef4444', icon: faExclamationTriangle, pct: analytics.total_exports ? Math.round((analytics.failed_exports / analytics.total_exports) * 100) : 0 },
    { label: 'Processing', value: String(analytics.processing_exports || 0), color: '#f59e0b', icon: faChartLine, pct: analytics.total_exports ? Math.round((analytics.processing_exports / analytics.total_exports) * 100) : 0 },
  ] : [
    { label: 'Export History', value: '-', color: '#4f46e5', icon: faFileExport, pct: 0 },
    { label: 'Total Transferred', value: '-', color: '#10b981', icon: faMoneyBillWave, pct: 0 },
    { label: 'Failed Exports', value: '-', color: '#ef4444', icon: faExclamationTriangle, pct: 0 },
    { label: 'Processing', value: '-', color: '#f59e0b', icon: faChartLine, pct: 0 },
  ];

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 18 } },
  };

  const sectionStyle = {
    padding: 24,
    borderRadius: radius,
    background: cardBg,
    border: `1px solid ${borderColor}`,
  };

  const tableStyle = {
    width: '100%', borderCollapse: 'collapse',
    fontSize: 13, color: textColor,
  };

  const thStyle = {
    textAlign: 'left', padding: '12px 16px',
    borderBottom: `1px solid ${borderColor}`,
    color: mutedColor, fontWeight: 600, fontSize: 12, textTransform: 'uppercase',
  };

  const tdStyle = {
    padding: '12px 16px', borderBottom: `1px solid ${borderColor}`,
  };

  return (
    <div style={{ minHeight: '100vh', background: bg, padding: 32, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {error && (
        <div style={{ padding: '12px 20px', marginBottom: 20, borderRadius: radius, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>{error}</span>
          <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><FontAwesomeIcon icon={faTimes} /></button>
        </div>
      )}

      <motion.div variants={container} initial="hidden" animate="show" style={{ maxWidth: 1360, margin: '0 auto' }}>
        {/* Header */}
        <motion.div variants={item}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <div>
              <h1 style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 700, color: textColor }}>Bank Export Management</h1>
              <p style={{ margin: 0, fontSize: 14, color: mutedColor }}>Generate bank-compatible salary transfer files from finalized payroll runs</p>
            </div>
            <button onClick={() => setShowModal(true)} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: radius,
              background: primaryGradient, color: '#fff', border: 'none', fontSize: 14, fontWeight: 600,
              cursor: 'pointer', boxShadow: '0 4px 14px rgba(79,70,229,0.35)',
            }}>
              <FontAwesomeIcon icon={faPlus} />
              Generate Bank File
            </button>
          </div>
        </motion.div>

        {/* Analytics */}
        <motion.div variants={item} style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
          {analyticsCards.map((a) => (
            <div key={a.label} style={{
              padding: 20, borderRadius: radius, background: cardBg, border: `1px solid ${borderColor}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: `${a.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.color, fontSize: 16,
                }}>
                  <FontAwesomeIcon icon={a.icon} />
                </div>
                <span style={{ fontSize: 13, color: mutedColor, fontWeight: 500 }}>{a.label}</span>
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: textColor, marginBottom: 8 }}>{a.value}</div>
              <div style={{
                height: 4, borderRadius: 4, background: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
                overflow: 'hidden',
              }}>
                <div style={{ width: `${a.pct}%`, height: '100%', borderRadius: 4, background: a.color }} />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Supported Banks */}
        <motion.div variants={item} style={{ ...sectionStyle, marginBottom: 32 }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: textColor }}>Supported Banks</h2>
          {banks.length === 0 ? (
            <p style={{ fontSize: 13, color: mutedColor }}>No verified employee bank details found. Add employee bank details first.</p>
          ) : (
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {banks.map((name) => (
                <div key={name} style={{
                  flex: '1 0 150px', padding: 16, borderRadius: radius, background: inputBg,
                  border: `1px solid ${borderColor}`, textAlign: 'center',
                }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: textColor, marginBottom: 2 }}>{name}</div>
                  <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#10b981', fontSize: 16, margin: '8px 0' }} />
                  <button onClick={() => { setSelectedBank(name); setShowModal(true); }} style={{
                    width: '100%', padding: '6px 0', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', background: 'rgba(79,70,229,0.12)', color: '#4f46e5',
                  }}>
                    Select
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Export History */}
        <motion.div variants={item} style={{ ...sectionStyle, marginBottom: 32 }}>
          <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: textColor }}>Export History</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: mutedColor }}>
              <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: 24, marginBottom: 12 }} />
              <p>Loading exports...</p>
            </div>
          ) : exports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: mutedColor }}>
              <FontAwesomeIcon icon={faFileExport} style={{ fontSize: 32, marginBottom: 12, opacity: 0.4 }} />
              <p>No bank exports yet. Generate your first bank file.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Export Code</th>
                    <th style={thStyle}>Bank</th>
                    <th style={thStyle}>Payroll Run</th>
                    <th style={thStyle}>Amount</th>
                    <th style={thStyle}>Employees</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Date</th>
                    <th style={thStyle}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {exports.map((row) => (
                    <tr key={row.id}>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>{row.export_code}</td>
                      <td style={tdStyle}>{row.bank_name}</td>
                      <td style={tdStyle}>{row.payroll_run}</td>
                      <td style={{ ...tdStyle, fontWeight: 600 }}>${Number(row.total_amount || 0).toLocaleString()}</td>
                      <td style={tdStyle}>{row.employee_count}</td>
                      <td style={tdStyle}>{statusBadge(row.status)}</td>
                      <td style={tdStyle}>{row.completed_at ? new Date(row.completed_at).toLocaleDateString() : '-'}</td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {row.status === 'completed' && (
                            <button onClick={() => downloadBankExport(row.id)} style={{
                              padding: '6px 12px', borderRadius: 8, border: `1px solid ${borderColor}`,
                              background: 'transparent', color: textColor, cursor: 'pointer', fontSize: 12,
                            }} title="Download CSV">
                              <FontAwesomeIcon icon={faDownload} />
                            </button>
                          )}
                          {row.status === 'failed' && (
                            <button onClick={() => handleRetry(row.id, row.bank_name)} style={{
                              padding: '6px 12px', borderRadius: 8, border: `1px solid ${borderColor}`,
                              background: 'transparent', color: '#f59e0b', cursor: 'pointer', fontSize: 12,
                            }} title="Retry">
                              <FontAwesomeIcon icon={faSync} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(15,23,42,0.45)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: 20,
        }}>
          <div style={{
            width: 'min(480px, 100%)', background: cardBg, borderRadius: radius,
            padding: 28, border: `1px solid ${borderColor}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: textColor }}>Generate Bank File</h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: mutedColor, cursor: 'pointer', fontSize: 18 }}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: textColor, marginBottom: 6 }}>Bank</label>
              <select value={selectedBank} onChange={(e) => setSelectedBank(e.target.value)} style={{
                width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${borderColor}`,
                background: inputBg, color: textColor, fontSize: 14,
              }}>
                <option value="">Select bank...</option>
                {banks.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: textColor, marginBottom: 6 }}>Payroll Batch ID</label>
              <input type="text" value={selectedBatch} onChange={(e) => setSelectedBatch(e.target.value)} placeholder="Enter batch ID..." style={{
                width: '100%', padding: '10px 14px', borderRadius: 10, border: `1px solid ${borderColor}`,
                background: inputBg, color: textColor, fontSize: 14,
              }} />
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{
                padding: '10px 24px', borderRadius: 10, border: `1px solid ${borderColor}`,
                background: 'transparent', color: textColor, cursor: 'pointer', fontSize: 14, fontWeight: 600,
              }}>
                Cancel
              </button>
              <button onClick={handleGenerate} disabled={!selectedBank || !selectedBatch || generating} style={{
                padding: '10px 24px', borderRadius: 10, border: 'none',
                background: !selectedBank || !selectedBatch ? mutedColor + '60' : primaryGradient,
                color: '#fff', cursor: !selectedBank || !selectedBatch ? 'not-allowed' : 'pointer',
                fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                {generating ? <><FontAwesomeIcon icon={faSpinner} spin /> Generating...</> : 'Generate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankExports;
