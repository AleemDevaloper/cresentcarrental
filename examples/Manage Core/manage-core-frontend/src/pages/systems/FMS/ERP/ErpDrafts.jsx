import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch, faFilePen, faEye, faCheck, faTrashCan,
  faFileInvoiceDollar, faClipboardList, faFileSignature,
  faCalendarDays, faUser, faLayerGroup, faCircleExclamation,
  faDatabase
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import { getFmsDrafts, moveToFmsTrash, finalizeFmsDraft } from '../../../../api/enterprise';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import SectionHero from '../../../../components/ui/ux/SectionHero';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';

const TYPE_ICONS = {
  'Fiscal Year': faCalendarDays,
  'Quotation': faFileInvoiceDollar,
  'Sales Order': faClipboardList,
  'Sales Invoice': faFileSignature,
  'Credit Note': faFilePen,
};

const ErpDrafts = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';

  // Navigation tabs for AMS - matching Approval Dashboard
  const navigationTabs = [
    { id: 'erp_approval_dashboard', label: 'Approval Dashboard', icon: faFileInvoiceDollar },
    { id: 'erp_approval_requests', label: 'Approval Requests', icon: faCheck },
    { id: 'erp_approval_workflows', label: 'Approval Workflows', icon: faLayerGroup },
    { id: 'erp_audit_trail', label: 'Audit Trail', icon: faDatabase },
    { id: 'erp_drafts', label: 'Drafts', icon: faFilePen },
    { id: 'erp_accounting_trash', label: 'Accounting Trash', icon: faTrashCan },
    { id: 'erp_import_export', label: 'Import / Export', icon: faSearch },
    { id: 'erp_automation_center', label: 'Automation Center', icon: faLayerGroup },
  ];

  const [activeTab, setActiveTab] = useState('erp_drafts');

  const [drafts, setDrafts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDrafts = async () => {
    setLoading(true);
    try {
      const res = await getFmsDrafts();
      setDrafts(Array.isArray(res.data) ? res.data : []);
      setStats(res.stats || null);
    } catch (err) {
      addNotification?.(err.message || 'Failed to load drafts', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDrafts(); }, []);

  const handleDelete = async (item) => {
    try {
      await moveToFmsTrash({
        type: item.type,
        code: item.code,
        title: item.title,
        value: item.value,
      });
      setDrafts(prev => prev.filter(d => d.id !== item.id));
      addNotification(`${item.code} moved to trash`, 'success');
    } catch (err) {
      addNotification?.(err.message || 'Failed to move to trash', 'danger');
    }
  };

  // Preview / Finalize handlers
  const [previewItem, setPreviewItem] = useState(null);
  const [finalizing, setFinalizing] = useState(false);

  const openPreview = (item) => {
    setPreviewItem(item);
  };

  const closePreview = () => {
    setPreviewItem(null);
  };

  const handleFinalize = async (item) => {
    setFinalizing(true);
    try {
      // use new API endpoint to finalize draft
      const res = await finalizeFmsDraft(item.id);
      // remove from local list on success
      setDrafts(prev => prev.filter(d => d.id !== item.id));
      addNotification(`${item.code} finalized and posted to ledger`, 'success');
      closePreview();
    } catch (err) {
      addNotification?.(err.message || 'Finalize failed', 'danger');
    } finally {
      setFinalizing(false);
    }
  };

  const filteredItems = drafts.filter(d =>
    String(d.title ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(d.code ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(d.type ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(d.createdBy ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [finalizeCandidate, setFinalizeCandidate] = useState(null);
  const [showFinalizeConfirm, setShowFinalizeConfirm] = useState(false);

  const confirmFinalize = (item) => {
    setFinalizeCandidate(item);
    setShowFinalizeConfirm(true);
  };

  const cancelFinalize = () => {
    setFinalizeCandidate(null);
    setShowFinalizeConfirm(false);
  };

  const confirmFinalizeNow = async () => {
    if (!finalizeCandidate) return;
    await handleFinalize(finalizeCandidate);
    setFinalizeCandidate(null);
    setShowFinalizeConfirm(false);
  };

  // Custom row renderer for improved UI/UX
  const renderRow = (row, i, helpers) => {
    const { isDark, textColor, mutedColor } = helpers;
    return (
      <tr key={row.id || i}>
        <td style={{ fontWeight: 700, color: '#f59e0b' }} className="text-nowrap">{row.code}</td>
        <td>
          <span className="premium-badge bg-warning text-dark" style={{ padding: '6px 10px', borderRadius: 12, fontWeight: 700, fontSize: '0.75rem' }}>
            <FontAwesomeIcon icon={TYPE_ICONS[row.type] || faFilePen} className="me-1" /> {row.type}
          </span>
        </td>
        <td style={{ fontWeight: 700 }}>{row.title}</td>
        <td className="text-muted text-nowrap" style={{ color: mutedColor }}>{row.createdBy}</td>
        <td className="text-nowrap" style={{ color: mutedColor }}>{row.createdDate}</td>
        <td style={{ fontWeight: 600 }}>{row.value ?? '-'}</td>
        <td>
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-sm btn-outline-primary"
              title="Preview draft"
              onClick={() => openPreview(row)}
              style={{ borderRadius: 8, padding: '6px 8px' }}
            >
              <FontAwesomeIcon icon={faEye} />
            </button>

            <button
              className="btn btn-sm btn-success"
              title="Finalize draft"
              onClick={() => confirmFinalize(row)}
              style={{ borderRadius: 8, padding: '6px 8px' }}
            >
              <FontAwesomeIcon icon={faCheck} />
            </button>

            <button
              className="btn btn-sm btn-outline-danger"
              title="Move to trash"
              onClick={() => handleDelete(row)}
              style={{ borderRadius: 8, padding: '6px 8px' }}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <ErpPageShell
      icon={faFilePen}
      title="Draft Documents"
      description="Review and manage all draft accounting documents before they are finalized and posted to the general ledger."
      action={null}
    >
      {/* Section hero header (matches Approval Dashboard style) */}
      <div className="mb-3 pt-4 text-start animate-fade-in">
        <SectionHero
          title="Draft Documents"
          subtitle="Review and manage all draft accounting documents before they are finalized and posted to the general ledger."
          badge="Drafts — Review Queue"
          actions={<>
            <button className="btn btn-primary text-white fw-bold d-flex align-items-center gap-2 border-0 px-4 py-2" style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', borderRadius: '10px', boxShadow: '0 4px 15px rgba(59,130,246,0.22)' }} onClick={() => { openPreview({ code: 'DRAFT-NEW', title: 'New Draft' }); }}>
              <FontAwesomeIcon icon={faFilePen} /> New Draft
            </button>
          </>}
          isDark={isDark}
        />
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* NAVIGATION TABS                                                        */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="mb-4 text-start">
        <div className="pill-tab-nav shadow-sm bg-white p-2 rounded-pill d-inline-flex" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', border: isDark ? '1px solid #374151' : '1px solid #E2E8F0' }}>
          {navigationTabs.map(tab => (
            <button 
              key={tab.id} 
              className={`pill-item ${activeTab === tab.id ? 'active' : ''}`}
              style={{
                borderRadius: '24px', padding: '8px 18px', fontWeight: '600', fontSize: '13px', border: 'none', transition: 'all 0.2s',
                color: activeTab === tab.id ? '#fff' : (isDark ? '#cbd5e1' : '#4b5563'),
                background: activeTab === tab.id ? 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' : 'transparent',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(37,99,235,0.2)' : 'none'
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              <FontAwesomeIcon icon={tab.icon} className="me-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="row g-2 mb-4">
        <ErpKpiCard label="Total Drafts" value={stats?.total_drafts ?? drafts.length} icon={faFilePen} color="#f59e0b" isDark={isDark} />
        <ErpKpiCard label="Total Draft Value" value={stats?.total_value ?? '$0.00'} icon={faFileInvoiceDollar} color="#3b82f6" isDark={isDark} />
        <ErpKpiCard label="Entity Types" value={Object.keys(stats?.by_type ?? {}).length || '-'} icon={faLayerGroup} color="#8b5cf6" isDark={isDark} />
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <>
          <ErpDataTable
            title="Draft Items Register"
            titleIcon={faFilePen}
            columns={[
              { key: 'code', label: 'Document ID' },
              { key: 'type', label: 'Entity Type' },
              { key: 'title', label: 'Description' },
              { key: 'createdBy', label: 'Created By' },
              { key: 'createdDate', label: 'Created Date' },
              { key: 'value', label: 'Financial Value' },
              { key: 'actions', label: 'Actions' }
            ]}
            data={filteredItems}
            renderRow={renderRow}
            searchable
            searchPlaceholder="Search draft documents..."
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            isDark={isDark}
          />

          {/* Preview modal */}
          {previewItem && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050 }} onClick={closePreview}>
              <div className="card" style={{ width: '820px', maxHeight: '80vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h5 className="card-title mb-0">Preview: {previewItem.code}</h5>
                    <div>
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={closePreview}>Close</button>
                      <button className="btn btn-sm btn-success" onClick={() => confirmFinalize(previewItem)} disabled={finalizing}>
                        {finalizing ? 'Finalizing...' : 'Finalize'}
                      </button>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.9rem', color: isDark ? '#cbd5e1' : '#374151' }}>
                    <p><strong>Type:</strong> {previewItem.type}</p>
                    <p><strong>Title:</strong> {previewItem.title}</p>
                    <p><strong>Created By:</strong> {previewItem.createdBy} &nbsp; <strong>Date:</strong> {previewItem.createdDate}</p>
                    <hr />
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: isDark ? '#0f1724' : '#f8fafc', padding: 12, borderRadius: 6 }}>
                      {JSON.stringify(previewItem.payload || previewItem, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Finalize confirmation dialog */}
          {showFinalizeConfirm && finalizeCandidate && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1060 }} onClick={cancelFinalize}>
              <div className="card" style={{ width: '480px' }} onClick={e => e.stopPropagation()}>
                <div className="card-body">
                  <h5 className="card-title">Confirm Finalize</h5>
                  <p>Are you sure you want to finalize <strong>{finalizeCandidate.code}</strong>? This will post it to the ledger.</p>
                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-sm btn-secondary" onClick={cancelFinalize}>Cancel</button>
                    <button className="btn btn-sm btn-success" onClick={confirmFinalizeNow} disabled={finalizing}>{finalizing ? 'Finalizing...' : 'Yes, finalize'}</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </ErpPageShell>
  );
};

export default ErpDrafts;
