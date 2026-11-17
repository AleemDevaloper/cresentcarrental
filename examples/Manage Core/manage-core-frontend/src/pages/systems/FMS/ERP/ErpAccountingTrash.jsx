import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch, faTrashCan, faUndo, faTrash,
  faDatabase, faCircleExclamation,
  faLayerGroup, faCheck, faFileInvoiceDollar
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from '../../../../context/AppContext';
import {
  getFmsTrash, restoreFmsTrash,
  forceDeleteFmsTrash, purgeAllFmsTrash
} from '../../../../api/enterprise';
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';
import SectionHero from '../../../../components/ui/ux/SectionHero';

const ErpAccountingTrash = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';

  // Navigation tabs for AMS - matching Approval Dashboard
  const navigationTabs = [
    { id: 'erp_approval_dashboard', label: 'Approval Dashboard', icon: faDatabase },
    { id: 'erp_approval_requests', label: 'Approval Requests', icon: faCheck },
    { id: 'erp_approval_workflows', label: 'Approval Workflows', icon: faLayerGroup },
    { id: 'erp_audit_trail', label: 'Audit Trail', icon: faDatabase },
    { id: 'erp_drafts', label: 'Drafts', icon: faUndo },
    { id: 'erp_accounting_trash', label: 'Accounting Trash', icon: faTrashCan },
    { id: 'erp_import_export', label: 'Import / Export', icon: faSearch },
    { id: 'erp_automation_center', label: 'Automation Center', icon: faLayerGroup },
  ];

  const [activeTab, setActiveTab] = useState('erp_accounting_trash');

  const [trashItems, setTrashItems] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTrash = async () => {
    setLoading(true);
    try {
      const res = await getFmsTrash();
      setTrashItems(Array.isArray(res.data) ? res.data : []);
      setStats(res.stats || null);
    } catch (err) {
      addNotification?.(err.message || 'Failed to load trash', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTrash(); }, []);

  const handleRestore = async (id, code) => {
    try {
      await restoreFmsTrash(id);
      setTrashItems(prev => prev.filter(t => t.id !== id));
      addNotification(`Entity ${code} restored back to active database.`, 'success');
    } catch (err) {
      addNotification?.(err.message || 'Restore failed', 'danger');
    }
  };

  const handlePurge = async (id, code) => {
    try {
      await forceDeleteFmsTrash(id);
      setTrashItems(prev => prev.filter(t => t.id !== id));
      addNotification(`Entity ${code} permanently purged from system memory.`, 'danger');
    } catch (err) {
      addNotification?.(err.message || 'Purge failed', 'danger');
    }
  };

  const handlePurgeAll = async () => {
    if (window.confirm("Are you absolutely sure you want to permanently purge all trash items? This database action is irreversible.")) {
      try {
        await purgeAllFmsTrash();
        setTrashItems([]);
        addNotification("All soft-deleted entities permanently purged.", "danger");
      } catch (err) {
        addNotification?.(err.message || 'Purge all failed', 'danger');
      }
    }
  };

  const filteredItems = trashItems.filter(t =>
    t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.deletedBy?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ErpPageShell
      icon={faTrashCan}
      title="Accounting Database Trash Bin"
      description="Safely manage soft-deleted transaction records, voided invoices, archived quotations, and deleted vendor catalogs prior to permanent system purging."
      action={
        <div className="d-flex gap-2 flex-wrap">
          {trashItems.length > 0 && (
            <button className="btn btn-sm btn-danger border-0 d-flex align-items-center gap-1 px-3" style={{ borderRadius: '10px', fontSize: '0.8rem', boxShadow: '0 4px 14px rgba(239,68,68,0.35)' }} onClick={handlePurgeAll}>
              <FontAwesomeIcon icon={faTrash} /> Purge All Trash
            </button>
          )}
        </div>
      }
    >
      {/* Section hero header (matches Approval Dashboard style) */}
      <div className="pt-4 mb-3 text-start animate-fade-in">
        <SectionHero
          title="Accounting Trash"
          subtitle="Manage soft-deleted accounting entities and restore or purge them as needed."
          badge="Trash — Recoverable Items"
          actions={<>
            <button className="btn btn-outline-light fw-bold px-3 py-2" style={{ borderRadius: 10, border: '1px solid rgba(0,0,0,0.06)' }} onClick={() => { /* placeholder */ }}>
              Import Trash List
            </button>
          </>}
          isDark={isDark}
        />
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* NAVIGATION TABS                                                        */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div className="mb-4 text-start">
        <div className="pill-tab-nav shadow-sm bg-white p-2 rounded-pill d-inline-flex" style={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', border: isDark ? '1px solid #374151' : '1px solid #E2E8F0', overflowX: 'auto', maxWidth: '100%' }}>
          {navigationTabs.map(tab => (
            <button 
              key={tab.id} 
              className={`pill-item ${activeTab === tab.id ? 'active' : ''}`}
              style={{
                borderRadius: '24px', padding: '8px 18px', fontWeight: '600', fontSize: '13px', border: 'none', transition: 'all 0.2s', whiteSpace: 'nowrap',
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
        <ErpKpiCard label="Soft-Deleted Records" value={loading ? '...' : trashItems.length} icon={faTrashCan} color="#ef4444" isDark={isDark} />
        <ErpKpiCard label="Recoverable Asset Value" value={loading ? '...' : (stats?.recoverable_value ?? '$0.00')} icon={faDatabase} color="#10b981" isDark={isDark} />
        <ErpKpiCard label="Auto-Purge Cycles" value="30 Days" icon={faCircleExclamation} color="#fbbf24" isDark={isDark} />
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : (
        <ErpDataTable
          title="Recycle Register Table"
          titleIcon={faTrashCan}
          columns={[
            { key: 'code', label: 'Entity ID', bold: true, render: (val) => <span className="font-monospace fw-bold text-primary">{val}</span> },
            { key: 'type', label: 'Entity Type', render: (val) => <span className="premium-badge bg-primary text-white">{val}</span> },
            { key: 'title', label: 'Item Descriptor Name', bold: true },
            { key: 'deletedBy', label: 'Deleted By' },
            { key: 'deleteDate', label: 'Deletion Date' },
            { key: 'value', label: 'Financial Value' },
            { key: 'daysRemaining', label: 'Purge Retention Time', render: (val) => <span className="font-monospace text-warning fw-bold">{val}</span> },
            { key: 'actions', label: 'Safe Actions', render: (_, row) => (
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-link p-1 text-success" title="Restore back to active ledger" onClick={() => handleRestore(row.id, row.code)}>
                  <FontAwesomeIcon icon={faUndo} className="me-1" /> Restore
                </button>
                <button className="btn btn-sm btn-link p-1 text-danger" title="Permanently delete from database" onClick={() => handlePurge(row.id, row.code)}>
                  <FontAwesomeIcon icon={faTrash} className="me-1" /> Purge
                </button>
              </div>
            )}
          ]}
          data={filteredItems}
          searchable
          searchPlaceholder="Search soft-deleted records..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          isDark={isDark}
        />
      )}
    </ErpPageShell>
  );
};

export default ErpAccountingTrash;
