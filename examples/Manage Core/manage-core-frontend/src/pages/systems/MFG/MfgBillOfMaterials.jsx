import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClipboardList, faPlus, faPrint,
  faEye, faEdit, faCopy, faArchive, faSearch, faFilter,
  faChevronDown, faChevronRight, faTrash, faCheckCircle,
  faTimesCircle, faSpinner, faDollarSign, faBox, faWarehouse,
  faCube, faCubes, faLayerGroup, faExclamationTriangle,
  faCheck, faHistory, faCalendarAlt, faUpload, faDownload,
  faFilePdf, faFileExcel, faSync, faBalanceScale, faChartLine
} from "@fortawesome/free-solid-svg-icons";
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';
import { FxExportDropdown, FxImportDropdown } from '../../../components/common/FX/FxExportImportDropdowns';
import { useApp } from '../../../hooks/useApp';
import {
  listBoms,
  createBom,
  updateBom,
  deleteBom,
} from '../../../api/mfg';
import { clearCache } from '../../../api/client';

const bomCss = (isDark) => `
.glass-card {
  background: ${isDark ? 'rgba(30, 41, 59, 0.75)' : 'rgba(255, 255, 255, 0.85)'};
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)'};
  box-shadow: ${isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.6)'};
}
.premium-card {
  transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: default;
}
.premium-card:hover {
  transform: translateY(-8px) scale(1.012);
  box-shadow: ${isDark ? '0 32px 64px -12px rgba(0,0,0,0.5)' : '0 32px 64px -16px rgba(0,0,0,0.18), 0 8px 24px -8px rgba(0,0,0,0.08), 0 0 0 1px rgba(59,130,246,0.08)'};
}
.premium-table-wrapper {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'};
}
.premium-table { width: 100%; border-collapse: separate; border-spacing: 0; }
.premium-table thead { position: sticky; top: 0; z-index: 10; }
.premium-table thead tr {
  background: ${isDark ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'};
}
.premium-table thead th {
  padding: 14px 16px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.06em; color: ${isDark ? '#94a3b8' : '#64748b'};
  border-bottom: 2px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'}; white-space: nowrap;
}
.premium-table tbody tr {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 3px solid transparent;
}
.premium-table tbody tr:hover {
  border-left-color: #4f46e5 !important;
  background: ${isDark ? 'rgba(79,70,229,0.08)' : 'rgba(79,70,229,0.03)'} !important;
}
.premium-table tbody tr:nth-child(even) {
  background: ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.012)'};
}
.premium-table tbody tr:nth-child(even):hover {
  background: ${isDark ? 'rgba(79,70,229,0.12)' : 'rgba(79,70,229,0.05)'} !important;
}
.premium-table tbody td {
  padding: 12px 16px;
  border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'};
  vertical-align: middle;
}
.premium-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 12px; border-radius: 100px;
  font-size: 0.65rem; font-weight: 600; letter-spacing: 0.02em;
}
.premium-badge .badge-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
.premium-btn {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative; overflow: hidden;
}
.premium-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
.premium-action-btn {
  width: 32px; height: 32px; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  border: none; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer;
}
.premium-action-btn:hover { transform: scale(1.15); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; }
.section-header .accent-bar { width: 3px; height: 20px; border-radius: 2px; flex-shrink: 0; }
.section-header h6 { margin: 0; font-weight: 700; font-size: 0.9rem; }
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.enter-anim { animation: fadeSlideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; opacity: 0; }
.enter-anim:nth-child(1) { animation-delay: 0.03s; }
.enter-anim:nth-child(2) { animation-delay: 0.06s; }
.enter-anim:nth-child(3) { animation-delay: 0.09s; }
.enter-anim:nth-child(4) { animation-delay: 0.12s; }
.enter-anim:nth-child(5) { animation-delay: 0.15s; }
.enter-anim:nth-child(6) { animation-delay: 0.18s; }
.enter-anim:nth-child(7) { animation-delay: 0.21s; }
.enter-anim:nth-child(8) { animation-delay: 0.24s; }
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: ${isDark ? '#334155' : '#cbd5e1'}; border-radius: 100px; }
`;

const MfgBillOfMaterials = ({ isDark }) => {
  const { addNotification } = useApp();
  const [view, setView] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deletingBom, setDeletingBom] = useState(null);
  const [deletingComponent, setDeletingComponent] = useState(null);
  const [viewingBom, setViewingBom] = useState(null);
  const [printPayload, setPrintPayload] = useState(null);
  const [editingBom, setEditingBom] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;
  const [bomList, setBomList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bomForm, setBomForm] = useState(null);
  const [formComponents, setFormComponents] = useState([]);
  const d = isDark ? 'dark-mode' : '';

  const c = isDark
    ? { text: '#f1f5f9', muted: '#94a3b8', body: '#e2e8f0', card: '#1e293b', border: 'rgba(255,255,255,0.05)', rowBorder: 'rgba(255,255,255,0.03)', label: '#94a3b8', secondary: '#cbd5e1', accent: '#818cf8' }
    : { text: '#0f172a', muted: '#64748b', body: '#0f172a', card: '#fff', border: '#f1f5f9', rowBorder: '#f8fafc', label: '#475569', secondary: '#334155', accent: '#4f46e5' };

  const loadBoms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await listBoms();
      const data = res?.data;
      setBomList(Array.isArray(data) ? data : data?.data ?? []);
    } catch {
      setBomList([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBoms(); }, [loadBoms]);

  const statuses = useMemo(() => [...new Set(bomList.map(b => b.status))], [bomList]);

  const filteredBoms = bomList.filter(b => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (searchTerm && !b.no?.toLowerCase().includes(searchTerm.toLowerCase()) && !b.product?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredBoms.length / pageSize));
  const pageData = filteredBoms.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const defaultBomForm = (existing) => ({
    no: existing?.no || '',
    product: existing?.product || '',
    version: existing?.version || '1.0',
    revision: existing?.revision || '0',
    warehouse: existing?.warehouse || 'Main Warehouse',
    status: existing?.status || 'Draft',
    productionType: existing?.productionType || 'Make To Stock',
    expectedQty: existing?.expectedQty || 100,
    scrapPct: existing?.scrapPct || 3,
    laborCost: existing?.laborCost || 2500,
    machineCost: existing?.machineCost || 3800,
    overheadCost: existing?.overheadCost || 1200,
    notes: existing?.notes || '',
  });

  const startCreate = () => {
    setEditingBom(null);
    setBomForm(defaultBomForm(null));
    setFormComponents([
      { key: Date.now(), component: '', raw: '', warehouse: 'Main Warehouse', unit: 'pcs', qty: 1, scrap: 0, unitCost: 0, stock: 0 },
    ]);
    setView('create');
  };

  const startEdit = (bom) => {
    setEditingBom(bom);
    setBomForm(defaultBomForm(bom));
    setFormComponents((bom.components || []).map((comp, i) => ({ key: Date.now() + i, ...comp })));
    setView('create');
  };

  const handleSaveBom = async (submitStatus) => {
    if (!bomForm) return;
    if (!bomForm.no.trim() || !bomForm.product.trim()) {
      addNotification?.('Please fill in the BOM number and finished product.', 'error');
      return;
    }
    const totalComponentCost = formComponents.reduce((s, comp) => s + (Number(comp.unitCost) || 0) * (Number(comp.qty) || 0), 0);
    const estimated = totalComponentCost + (Number(bomForm.laborCost) || 0) + (Number(bomForm.machineCost) || 0) + (Number(bomForm.overheadCost) || 0);
    const now = new Date();
    const record = {
      no: bomForm.no,
      product: bomForm.product,
      version: bomForm.version,
      status: submitStatus || bomForm.status,
      warehouse: bomForm.warehouse,
      cost: `$${estimated.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      revision: String(bomForm.revision),
      creator: 'Admin',
      updated: now.toISOString().slice(0, 10),
      productionType: bomForm.productionType,
      expectedQty: Number(bomForm.expectedQty) || 0,
      scrapPct: Number(bomForm.scrapPct) || 0,
      laborCost: Number(bomForm.laborCost) || 0,
      machineCost: Number(bomForm.machineCost) || 0,
      overheadCost: Number(bomForm.overheadCost) || 0,
      notes: bomForm.notes || '',
      components: formComponents
        .filter(comp => comp.component)
        .map(comp => ({
          component: comp.component,
          raw: comp.raw || '',
          warehouse: comp.warehouse || 'Main Warehouse',
          unit: comp.unit || 'pcs',
          qty: Number(comp.qty) || 0,
          scrap: Number(comp.scrap) || 0,
          unitCost: Number(comp.unitCost) || 0,
          totalCost: (Number(comp.unitCost) || 0) * (Number(comp.qty) || 0),
          stock: Number(comp.stock) || 0,
        })),
    };
    try {
      if (editingBom) {
        const res = await updateBom(editingBom.id, record);
        const saved = res?.data;
        setBomList(prev => prev.map(b => (b.id === editingBom.id ? saved || record : b)));
        addNotification?.(`BOM "${record.no}" updated successfully.`, 'success');
      } else {
        const res = await createBom(record);
        const saved = res?.data;
        setBomList(prev => [saved || record, ...prev]);
        addNotification?.(`BOM "${record.no}" created successfully.`, 'success');
      }
      clearCache('/mfg/boms');
      setView('list');
      setEditingBom(null);
      setBomForm(null);
      setFormComponents([]);
    } catch (err) {
      addNotification?.(err?.message || 'Failed to save BOM.', 'error');
    }
  };

  const handleDuplicateBom = async (bom) => {
    const base = bom.no.replace(/-(\d+)$/, '');
    const nums = bomList.map(b => {
      const m = b.no?.match(/(\d+)$/);
      return m ? parseInt(m[1], 10) : 0;
    }).filter(n => !isNaN(n));
    const nextNum = (nums.length ? Math.max(...nums) : 0) + 1;
    const copy = {
      ...bom,
      no: `${base}-${String(nextNum).padStart(3, '0')}`,
      status: 'Draft',
      revision: String((parseInt(bom.revision, 10) || 0) + 1),
      updated: new Date().toISOString().slice(0, 10),
      components: (bom.components || []).map(comp => ({ ...comp })),
    };
    try {
      const res = await createBom(copy);
      const saved = res?.data;
      setBomList(prev => [saved || copy, ...prev]);
      clearCache('/mfg/boms');
      addNotification?.(`BOM duplicated as "${copy.no}".`, 'success');
    } catch (err) {
      addNotification?.(err?.message || 'Failed to duplicate BOM.', 'error');
    }
  };

  const handleArchiveBom = async (bom) => {
    try {
      const updated = { ...bom, status: 'Archived' };
      const res = await updateBom(bom.id, updated);
      const saved = res?.data;
      setBomList(prev => prev.map(b => (b.id === bom.id ? saved || updated : b)));
      clearCache('/mfg/boms');
      addNotification?.(`BOM "${bom.no}" archived.`, 'success');
    } catch (err) {
      addNotification?.(err?.message || 'Failed to archive BOM.', 'error');
    }
  };

  const handlePrint = (payload) => {
    setPrintPayload(null);
    setTimeout(() => {
      setPrintPayload(payload);
      setTimeout(() => { window.print(); }, 250);
    }, 50);
  };

  const handleConfirmDeleteBom = async () => {
    if (!deletingBom) return;
    try {
      await deleteBom(deletingBom.id);
      clearCache('/mfg/boms');
      setBomList(prev => prev.filter(b => b.id !== deletingBom.id));
      addNotification?.(`BOM "${deletingBom.no}" deleted.`, 'success');
    } catch (err) {
      addNotification?.(err?.message || 'Failed to delete BOM.', 'error');
    } finally {
      setDeletingBom(null);
    }
  };

  const handleImportBoms = (rows) => {
    rows.forEach(async (row, index) => {
      const no = row['BOM Number'] || row.no || row.BOM || `BOM-IMP-${Date.now()}-${index}`;
      const record = {
        no: String(no),
        product: row['Finished Product'] || row.product || row.Product || 'Imported Product',
        version: String(row.Version || row.version || '1.0'),
        status: row.Status || row.status || 'Draft',
        warehouse: row.Warehouse || row.warehouse || 'Main Warehouse',
        cost: row['Est. Cost'] || row.cost || row.Cost || '$0',
        revision: String(row.Rev || row.revision || '0'),
        creator: row['Created By'] || row.creator || 'Import',
        updated: row.Updated || row.updated || new Date().toISOString().slice(0, 10),
      };
      try {
        const res = await createBom(record);
        const saved = res?.data;
        if (saved) setBomList(prev => [saved, ...prev]);
      } catch {
        // silently skip
      }
    });
  };

  const getStatusBadge = (s) => {
    const map = {
      'Approved': { bg: isDark ? 'rgba(34,197,94,0.15)' : '#dcfce7', text: isDark ? '#4ade80' : '#16a34a', dot: '#22c55e' },
      'Draft': { bg: isDark ? 'rgba(100,116,139,0.15)' : '#f1f5f9', text: isDark ? '#94a3b8' : '#64748b', dot: '#94a3b8' },
      'Submitted': { bg: isDark ? 'rgba(59,130,246,0.15)' : '#dbeafe', text: isDark ? '#60a5fa' : '#2563eb', dot: '#3b82f6' },
      'Rejected': { bg: isDark ? 'rgba(239,68,68,0.15)' : '#fee2e2', text: isDark ? '#f87171' : '#dc2626', dot: '#ef4444' },
      'Archived': { bg: isDark ? 'rgba(245,158,11,0.15)' : '#fef3c7', text: isDark ? '#fbbf24' : '#d97706', dot: '#f59e0b' },
    };
    return map[s] || { bg: isDark ? 'rgba(100,116,139,0.15)' : '#f8f9fa', text: isDark ? '#94a3b8' : '#6c757d', dot: '#adb5bd' };
  };

  const updateComponent = (key, field, value) => {
    setFormComponents(prev => prev.map(comp => {
      if (comp.key !== key) return comp;
      const updated = { ...comp, [field]: value };
      if (field === 'qty' || field === 'unitCost') {
        updated.totalCost = (Number(updated.qty) || 0) * (Number(updated.unitCost) || 0);
      }
      return updated;
    }));
  };

  const addComponentLine = () => {
    setFormComponents(prev => [...prev, { key: Date.now(), component: '', raw: '', warehouse: 'Main Warehouse', unit: 'pcs', qty: 1, scrap: 0, unitCost: 0, stock: 0 }]);
  };

  const removeComponentLine = (key) => {
    setFormComponents(prev => prev.filter(comp => comp.key !== key));
  };

  const totalComponentCost = formComponents.reduce((s, comp) => s + (Number(comp.qty) || 0) * (Number(comp.unitCost) || 0), 0);

  const btnOver = (e, color) => { e.currentTarget.style.background = color; e.currentTarget.style.color = '#fff'; e.currentTarget.style.border = `1px solid ${color}`; e.currentTarget.style.transform = 'scale(1.15)'; };
  const btnOut = (e, color) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = color; e.currentTarget.style.border = `1px solid ${color}`; e.currentTarget.style.transform = 'scale(1)'; };

  const setForm = (field) => (e) => {
    setBomForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const FormField = ({ label, children, width }) => (
    <div className={width || 'col-md-4'}>
      <label className="form-label small fw-medium mb-1" style={{ color: isDark ? '#94a3b8' : '#475569', letterSpacing: '0.3px' }}>{label}</label>
      {children}
    </div>
  );

  const SectionTitle = ({ icon, children }) => (
    <div className="section-header">
      <span className="accent-bar" style={{ background: 'linear-gradient(180deg, #4f46e5, #7c3aed)' }} />
      {icon && <FontAwesomeIcon icon={icon} style={{ color: '#4f46e5', fontSize: '0.85rem' }} />}
      <h6 style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>{children}</h6>
    </div>
  );

  const sectionCard = {
    background: c.card,
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
  };

  if (view === 'create') {
    return (
      <div className={`container-fluid py-4 px-4 ${d}`}>
        <style>{bomCss(isDark)}</style>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: 4, height: 36, background: 'linear-gradient(180deg, #4f46e5, #7c3aed)', borderRadius: 2, flexShrink: 0 }} />
            <h4 className="fw-bold mb-0" style={{ color: c.text }}>{editingBom ? 'Edit' : 'Create'} Bill of Materials</h4>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-sm rounded-pill px-3 premium-btn" style={{ background: 'transparent', color: c.muted, border: `1px solid ${c.muted}` }} onClick={() => { setView('list'); setEditingBom(null); }}>
              <FontAwesomeIcon icon={faTimesCircle} className="me-1" />Cancel
            </button>
            <button className="btn btn-sm rounded-pill px-3 premium-btn fw-medium" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', border: 'none' }} onClick={() => handleSaveBom(null)}>
              <FontAwesomeIcon icon={faCheck} className="me-1" />{editingBom ? 'Update BOM' : 'Save BOM'}
            </button>
            <button className="btn btn-sm rounded-pill px-3 premium-btn fw-medium" style={{ background: 'linear-gradient(135deg, #059669, #10b981)', color: '#fff', border: 'none' }} onClick={() => handleSaveBom('Submitted')}>
              <FontAwesomeIcon icon={faCheckCircle} className="me-1" />Submit for Approval
            </button>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-xl-8">
            <div className="card rounded-4 mb-4 premium-card glass-card">
              <div className="card-body p-4">
                <SectionTitle icon={faClipboardList}>General Information</SectionTitle>
                <div className="row g-3">
                  <FormField label="BOM Number"><input type="text" className="form-control form-control-sm rounded-3" style={isDark ? { background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' } : {}} value={bomForm?.no || ''} onChange={setForm('no')} placeholder="BOM-2025-001" /></FormField>
                  <FormField label="Finished Product">
                    <input type="text" className="form-control form-control-sm rounded-3" style={isDark ? { background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' } : {}} value={bomForm?.product || ''} onChange={setForm('product')} placeholder="Enter finished product name" />
                  </FormField>
                  <FormField label="Version"><input type="text" className="form-control form-control-sm rounded-3" style={isDark ? { background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' } : {}} value={bomForm?.version || ''} onChange={setForm('version')} /></FormField>
                  <FormField label="Revision"><input type="number" className="form-control form-control-sm rounded-3" style={isDark ? { background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' } : {}} value={bomForm?.revision || 0} onChange={setForm('revision')} /></FormField>
                  <FormField label="Warehouse">
                    <select className="form-select form-select-sm rounded-3" style={isDark ? { background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' } : {}} value={bomForm?.warehouse || 'Main Warehouse'} onChange={setForm('warehouse')}>
                      <option>Main Warehouse</option>
                      <option>Assembly WH</option>
                      <option>Electrical WH</option>
                      <option>Hardware WH</option>
                    </select>
                  </FormField>
                  <FormField label="Status">
                    <select className="form-select form-select-sm rounded-3" style={isDark ? { background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' } : {}} value={bomForm?.status || 'Draft'} onChange={setForm('status')}>
                      <option>Draft</option>
                      <option>Submitted</option>
                      <option>Approved</option>
                    </select>
                  </FormField>
                  <FormField label="Production Type">
                    <select className="form-select form-select-sm rounded-3" style={isDark ? { background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' } : {}} value={bomForm?.productionType || 'Make To Stock'} onChange={setForm('productionType')}>
                      <option>Make To Stock</option>
                      <option>Make To Order</option>
                    </select>
                  </FormField>
                  <FormField label="Expected Output Qty"><input type="number" className="form-control form-control-sm rounded-3" style={isDark ? { background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' } : {}} value={bomForm?.expectedQty || ''} onChange={setForm('expectedQty')} /></FormField>
                  <FormField label="Scrap %"><input type="number" className="form-control form-control-sm rounded-3" style={isDark ? { background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' } : {}} value={bomForm?.scrapPct || ''} onChange={setForm('scrapPct')} /></FormField>
                  <FormField label="Labor Cost ($)">
                    <div className="input-group input-group-sm">
                      <span className="input-group-text rounded-start-3" style={isDark ? { background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' } : {}}>$</span>
                      <input type="number" className="form-control" style={isDark ? { background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' } : {}} value={bomForm?.laborCost || ''} onChange={setForm('laborCost')} />
                    </div>
                  </FormField>
                  <FormField label="Machine Cost ($)">
                    <div className="input-group input-group-sm">
                      <span className="input-group-text rounded-start-3" style={isDark ? { background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' } : {}}>$</span>
                      <input type="number" className="form-control" style={isDark ? { background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' } : {}} value={bomForm?.machineCost || ''} onChange={setForm('machineCost')} />
                    </div>
                  </FormField>
                  <FormField label="Overhead Cost ($)">
                    <div className="input-group input-group-sm">
                      <span className="input-group-text rounded-start-3" style={isDark ? { background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' } : {}}>$</span>
                      <input type="number" className="form-control" style={isDark ? { background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' } : {}} value={bomForm?.overheadCost || ''} onChange={setForm('overheadCost')} />
                    </div>
                  </FormField>
                  <FormField width="col-12" label="Notes">
                    <textarea className="form-control form-control-sm rounded-3" style={isDark ? { background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' } : {}} rows={3} placeholder="Enter notes, instructions, or remarks..." value={bomForm?.notes || ''} onChange={setForm('notes')} />
                  </FormField>
                </div>
              </div>
            </div>

            <div className="card rounded-4 premium-card glass-card">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <SectionTitle icon={faCubes}>Component Lines</SectionTitle>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm rounded-pill px-3 premium-btn fw-medium" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', border: 'none' }} onClick={addComponentLine}><FontAwesomeIcon icon={faPlus} className="me-1" />Add Line</button>
                  </div>
                </div>
                <div className="table-responsive">
                  <div className="premium-table-wrapper">
                    <table className="table align-middle mb-0 premium-table">
                      <thead>
                        <tr>
                          <th>Component</th>
                          <th>Raw Material</th>
                          <th>Warehouse</th>
                          <th>Unit</th>
                          <th>Qty</th>
                          <th>Scrap%</th>
                          <th>Unit Cost</th>
                          <th>Total Cost</th>
                          <th style={{ width: 40 }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {formComponents.map((comp, idx) => (
                          <tr key={comp.key} className="enter-anim" style={{ animationDelay: `${idx * 0.04}s`, borderBottom: `1px solid ${c.rowBorder}` }}>
                            <td><input type="text" className="form-control form-control-sm" style={{ minWidth: 130, background: isDark ? '#0f172a' : '#fff', border: '1px solid rgba(0,0,0,0.08)', color: c.text }} value={comp.component} onChange={e => updateComponent(comp.key, 'component', e.target.value)} placeholder="Component name" /></td>
                            <td><input type="text" className="form-control form-control-sm" style={{ minWidth: 110, background: isDark ? '#0f172a' : '#fff', border: '1px solid rgba(0,0,0,0.08)', color: c.text }} value={comp.raw} onChange={e => updateComponent(comp.key, 'raw', e.target.value)} placeholder="Raw material" /></td>
                            <td><select className="form-select form-select-sm" style={{ minWidth: 110, background: isDark ? '#0f172a' : '#fff', border: '1px solid rgba(0,0,0,0.08)', color: c.text }} value={comp.warehouse} onChange={e => updateComponent(comp.key, 'warehouse', e.target.value)}>
                              <option>Main WH</option>
                              <option>Hardware WH</option>
                              <option>Electrical WH</option>
                              <option>Assembly WH</option>
                              <option>Paint WH</option>
                              <option>Instrument WH</option>
                              <option>Main Warehouse</option>
                            </select></td>
                            <td><input type="text" className="form-control form-control-sm" style={{ width: 64, background: isDark ? '#0f172a' : '#fff', border: '1px solid rgba(0,0,0,0.08)', color: c.text }} value={comp.unit} onChange={e => updateComponent(comp.key, 'unit', e.target.value)} /></td>
                            <td><input type="number" className="form-control form-control-sm" style={{ width: 70, background: isDark ? '#0f172a' : '#fff', border: '1px solid rgba(0,0,0,0.08)', color: c.text }} value={comp.qty} onChange={e => updateComponent(comp.key, 'qty', e.target.value)} /></td>
                            <td><input type="number" className="form-control form-control-sm" style={{ width: 64, background: isDark ? '#0f172a' : '#fff', border: '1px solid rgba(0,0,0,0.08)', color: c.text }} value={comp.scrap} onChange={e => updateComponent(comp.key, 'scrap', e.target.value)} /></td>
                            <td><input type="number" className="form-control form-control-sm" style={{ width: 80, background: isDark ? '#0f172a' : '#fff', border: '1px solid rgba(0,0,0,0.08)', color: c.text }} value={comp.unitCost} onChange={e => updateComponent(comp.key, 'unitCost', e.target.value)} /></td>
                            <td className="fw-bold" style={{ fontSize: '11px', color: isDark ? '#e2e8f0' : '#0f172a' }}>${((Number(comp.qty) || 0) * (Number(comp.unitCost) || 0)).toFixed(2)}</td>
                            <td>
                              <button className="premium-action-btn" style={{ color: '#ef4444', background: 'transparent' }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.border = '1px solid #ef4444'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.border = 'none'; }}
                                onClick={() => removeComponentLine(comp.key)}>
                                <FontAwesomeIcon icon={faTrash} style={{ fontSize: '11px' }} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {formComponents.length === 0 && (
                          <tr><td colSpan={9} className="text-center py-4 text-muted">No component lines yet. Click "Add Line" to start.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-4">
            <div className="card rounded-4 mb-4 premium-card glass-card">
              <div className="card-body p-4">
                <SectionTitle icon={faDollarSign}>Cost Summary</SectionTitle>
                <div className="mb-3 p-3 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}` }}>
                  <div className="d-flex justify-content-between mb-2">
                    <small style={{ color: isDark ? '#94a3b8' : '#475569' }}>Component Cost</small>
                    <span className="fw-bold" style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>${totalComponentCost.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <small style={{ color: isDark ? '#94a3b8' : '#475569' }}>Labor Cost</small>
                    <span className="fw-bold" style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>${(Number(bomForm?.laborCost) || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <small style={{ color: isDark ? '#94a3b8' : '#475569' }}>Machine Cost</small>
                    <span className="fw-bold" style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>${(Number(bomForm?.machineCost) || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <small style={{ color: isDark ? '#94a3b8' : '#475569' }}>Overhead Cost</small>
                    <span className="fw-bold" style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>${(Number(bomForm?.overheadCost) || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  </div>
                  <hr className="my-2" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }} />
                  <div className="d-flex justify-content-between">
                    <strong style={{ color: isDark ? '#e2e8f0' : '#0f172a' }}>Estimated Total</strong>
                    <strong style={{ color: c.accent }}>${(totalComponentCost + (Number(bomForm?.laborCost) || 0) + (Number(bomForm?.machineCost) || 0) + (Number(bomForm?.overheadCost) || 0)).toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="card rounded-4 premium-card glass-card">
              <div className="card-body p-4">
                <SectionTitle icon={faLayerGroup}>Advanced Features</SectionTitle>
                <div className="d-flex flex-column gap-2">
                  {[
                    { icon: faSync, label: 'Cost Rollup', color: '#4f46e5' },
                    { icon: faBox, label: 'Material Availability', color: '#0891b2' },
                    { icon: faChartLine, label: 'Production Simulation', color: '#059669' },
                    { icon: faCalendarAlt, label: 'Effective Date Range', color: '#d97706' },
                    { icon: faUpload, label: 'Attach CAD Drawing', color: '#7c3aed' },
                    { icon: faFilePdf, label: 'Attach PDF Document', color: '#dc2626' },
                    { icon: faPrint, label: 'Print BOM', color: '#0d9488' },
                    { icon: faCopy, label: 'Copy BOM', color: '#2563eb' },
                  ].map((f, idx) => (
                    <button key={idx} className="btn btn-sm d-flex align-items-center gap-2 border-0 rounded-3 text-start premium-btn"
                      style={{ background: `${f.color}10`, color: f.color }}
                      onMouseEnter={e => { e.currentTarget.style.background = f.color; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = `${f.color}10`; e.currentTarget.style.color = f.color; }}>
                      <FontAwesomeIcon icon={f.icon} style={{ fontSize: '11px' }} />
                      <span style={{ fontSize: '11px' }}>{f.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`container-fluid py-4 px-4 ${d}`}>
      <style>{bomCss(isDark)}</style>
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4" style={{ position: 'relative', zIndex: 110 }}>
        <div className="d-flex align-items-center gap-3">
          <div style={{ width: 4, height: 36, background: 'linear-gradient(180deg, #4f46e5, #7c3aed)', borderRadius: 2, flexShrink: 0 }} />
          <div>
            <h4 className="fw-bold mb-1" style={{ color: c.text, letterSpacing: '-0.02em' }}>Bill of Materials</h4>
            <p className="small mb-0" style={{ color: c.muted }}>
              <FontAwesomeIcon icon={faClipboardList} className="me-1" style={{ fontSize: '10px' }} />
              Manage product structures, component lists, and manufacturing recipes.
            </p>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-sm rounded-pill px-3 premium-btn fw-medium" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', border: 'none' }} onClick={startCreate}>
            <FontAwesomeIcon icon={faPlus} className="me-1" />New BOM
          </button>
          <FxImportDropdown
            title="Bill of Materials"
            isDark={isDark}
            addNotification={addNotification}
            onImport={handleImportBoms}
            buttonClassName="btn btn-sm rounded-pill px-3 premium-btn"
            buttonStyle={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: '#fff', border: 'none' }}
          />
          <FxExportDropdown
            data={filteredBoms}
            getExportData={(data) => data.map((b) => ({
              'BOM Number': b.no,
              'Finished Product': b.product,
              Version: b.version,
              Status: b.status,
              Warehouse: b.warehouse,
              'Est. Cost': b.cost,
              Rev: b.revision,
              'Created By': b.creator,
              Updated: b.updated,
            }))}
            title="Bill of Materials Report"
            filenamePrefix="mfg-boms"
            moduleLabel="MFG Module"
            isDark={isDark}
            addNotification={addNotification}
            buttonClassName="btn btn-sm rounded-pill px-3 premium-btn"
            buttonStyle={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none' }}
          />
          <button className="btn btn-sm rounded-pill px-3 premium-btn" style={{ background: 'transparent', color: c.muted, border: `1px solid ${c.muted}` }}>
            <FontAwesomeIcon icon={faPrint} className="me-1" />Print
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card rounded-4 mb-4 premium-card glass-card">
        <div className="card-body p-3">
          <div className="row g-2 align-items-center">
            <div className="col-md-4">
              <div className="input-group input-group-sm">
                <span className="input-group-text border-end-0 rounded-start-3" style={{ background: isDark ? '#0f172a' : '#fff', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0', borderRight: 'none', color: c.muted }}>
                  <FontAwesomeIcon icon={faSearch} style={{ fontSize: '12px' }} />
                </span>
                <input type="text" className="form-control form-control-sm border-start-0 rounded-end-3" placeholder="Search BOM..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ background: isDark ? '#0f172a' : '#fff', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0', borderLeft: 'none', color: isDark ? '#e2e8f0' : '#0f172a' }} />
              </div>
            </div>
            <div className="col-md-2">
              <select className="form-select form-select-sm rounded-3" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ background: isDark ? '#0f172a' : '#fff', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0', color: isDark ? '#e2e8f0' : '#0f172a' }}>
                <option value="all">All Status</option>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <select className="form-select form-select-sm rounded-3" style={{ background: isDark ? '#0f172a' : '#fff', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0', color: isDark ? '#e2e8f0' : '#0f172a' }}><option>All Products</option></select>
            </div>
            <div className="col-md-2">
              <select className="form-select form-select-sm rounded-3" style={{ background: isDark ? '#0f172a' : '#fff', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0', color: isDark ? '#e2e8f0' : '#0f172a' }}><option>All Versions</option></select>
            </div>
            <div className="col-md-2">
              <select className="form-select form-select-sm rounded-3" style={{ background: isDark ? '#0f172a' : '#fff', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0', color: isDark ? '#e2e8f0' : '#0f172a' }}><option>All Warehouses</option></select>
            </div>
          </div>
        </div>
      </div>

      {/* BOM Table */}
      <div className="card rounded-4 premium-card glass-card">
        <div className="card-body p-0">
          <div className="table-responsive" style={{ maxHeight: 600, overflowY: 'auto' }}>
            <div className="premium-table-wrapper">
              {loading ? (
                <div className="text-center py-5">
                  <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '1.5rem', color: '#4f46e5' }} />
                  <div className="text-muted small mt-2">Loading BOMs...</div>
                </div>
              ) : (
                <table className="table align-middle mb-0 premium-table">
                  <thead>
                    <tr>
                      <th className="ps-4">BOM Number</th>
                      <th>Finished Product</th>
                      <th>Version</th>
                      <th>Status</th>
                      <th>Warehouse</th>
                      <th>Est. Cost</th>
                      <th>Rev</th>
                      <th>Created By</th>
                      <th>Updated</th>
                      <th className="pe-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBoms.map((bom, idx) => {
                      const st = getStatusBadge(bom.status);
                      return (
                        <tr key={bom.id || idx} className="enter-anim" style={{ animationDelay: `${idx * 0.05}s` }}>
                          <td className="ps-4">
                            <span className="fw-bold" style={{ fontSize: '12px', color: c.text }}>{bom.no}</span>
                          </td>
                          <td style={{ fontSize: '12px', color: c.secondary }}>{bom.product}</td>
                          <td>
                            <span className="premium-badge" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9', color: isDark ? '#e2e8f0' : '#475569' }}>
                              <span className="badge-dot" style={{ background: '#7c3aed' }} />
                              v{bom.version}
                            </span>
                          </td>
                          <td>
                            <span className="premium-badge" style={{ background: st.bg, color: st.text }}>
                              <span className="badge-dot" style={{ background: st.dot }} />
                              {bom.status}
                            </span>
                          </td>
                          <td>
                            <span className="premium-badge" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : '#f1f5f9', color: isDark ? '#e2e8f0' : '#475569' }}>
                              <span className="badge-dot" style={{ background: '#4f46e5' }} />
                              {bom.warehouse}
                            </span>
                          </td>
                          <td className="fw-bold" style={{ fontSize: '12px', color: c.text }}>{bom.cost}</td>
                          <td style={{ fontSize: '12px', color: c.muted }}>{bom.revision}</td>
                          <td style={{ fontSize: '11px', color: c.muted }}>{bom.creator}</td>
                          <td style={{ fontSize: '11px', color: c.muted }}>{bom.updated}</td>
                          <td className="pe-4">
                            <div className="d-flex gap-1">
                              <button className="premium-action-btn" style={{ color: c.muted, background: 'transparent' }} title="View"
                                onMouseEnter={e => btnOver(e, '#64748b')} onMouseLeave={e => btnOut(e, '#64748b')}>
                                <FontAwesomeIcon icon={faEye} style={{ fontSize: '11px' }} />
                              </button>
                              <button className="premium-action-btn" style={{ color: c.accent, background: 'transparent' }} title="Edit"
                                onClick={() => startEdit(bom)}
                                onMouseEnter={e => btnOver(e, c.accent)} onMouseLeave={e => btnOut(e, c.accent)}>
                                <FontAwesomeIcon icon={faEdit} style={{ fontSize: '11px' }} />
                              </button>
                              <button className="premium-action-btn" style={{ color: '#0891b2', background: 'transparent' }} title="Duplicate"
                                onClick={() => handleDuplicateBom(bom)}
                                onMouseEnter={e => btnOver(e, '#0891b2')} onMouseLeave={e => btnOut(e, '#0891b2')}>
                                <FontAwesomeIcon icon={faCopy} style={{ fontSize: '11px' }} />
                              </button>
                              <button className="premium-action-btn" style={{ color: '#d97706', background: 'transparent' }} title="Archive"
                                onClick={() => handleArchiveBom(bom)}
                                onMouseEnter={e => btnOver(e, '#d97706')} onMouseLeave={e => btnOut(e, '#d97706')}>
                                <FontAwesomeIcon icon={faArchive} style={{ fontSize: '11px' }} />
                              </button>
                              <button className="premium-action-btn" style={{ color: '#059669', background: 'transparent' }} title="Print"
                                onMouseEnter={e => btnOver(e, '#059669')} onMouseLeave={e => btnOut(e, '#059669')}>
                                <FontAwesomeIcon icon={faPrint} style={{ fontSize: '11px' }} />
                              </button>
                              <button className="premium-action-btn" style={{ color: '#ef4444', background: 'transparent' }} title="Delete"
                                onClick={() => setDeletingBom(bom)}
                                onMouseEnter={e => btnOver(e, '#ef4444')} onMouseLeave={e => btnOut(e, '#ef4444')}>
                                <FontAwesomeIcon icon={faTrash} style={{ fontSize: '11px' }} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {filteredBoms.length === 0 && (
                      <tr><td colSpan={10} className="text-center py-5 text-muted">No BOM records found</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete BOM Confirmation */}
      <DialogBox.Confirm
        show={!!deletingBom}
        onClose={() => setDeletingBom(null)}
        onConfirm={handleConfirmDeleteBom}
        title="Delete Bill of Materials"
        message={`Are you sure you want to delete BOM "${deletingBom?.no}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
      />

      {/* Delete Component Confirmation */}
      <DialogBox.Confirm
        show={!!deletingComponent}
        onClose={() => setDeletingComponent(null)}
        onConfirm={() => { setDeletingComponent(null); }}
        title="Remove Component"
        message={`Are you sure you want to remove component "${deletingComponent?.name}" from this BOM?`}
        confirmLabel="Remove"
        variant="danger"
      />
    </div>
  );
};

export default MfgBillOfMaterials;
