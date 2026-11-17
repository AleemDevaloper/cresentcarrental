import React, { useEffect, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { listAudit, getEntityTimeline } from '../../../api/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpDataTable from '../../../components/ui/ux/ErpDataTable';
import { CrmSearchBar, CrmModal } from '../../../components/crm';
import {
  faHistory, faSearch, faUser, faClock, faCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ACTION_COLORS = {
  created: '#10b981',
  updated: '#0ea5e9',
  deleted: '#ef4444',
  imported: '#8b5cf6',
  exported: '#6366f1',
  merged: '#f59e0b',
  converted: '#10b981',
  completed: '#10b981',
  assigned: '#0ea5e9',
  won: '#10b981',
  lost: '#ef4444',
};

const CrmAudit = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const [data, setData] = useState({ data: [], meta: { current_page: 1, last_page: 1, per_page: 50, total: 0 } });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [module, setModule] = useState('');
  const [action, setAction] = useState('');
  const [active, setActive] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const params = { page, per_page: perPage };
      if (module) params.module = module;
      if (action) params.action = action;
      const res = await listAudit(params);
      setData(res);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page, perPage, module, action]);

  const columns = [
    { key: 'user_name', label: 'User', render: (v, r) => v || (r.user?.name) || 'System' },
    { key: 'action', label: 'Action', render: (v) => (
      <span style={{
        padding: '2px 8px',
        borderRadius: 100,
        background: (ACTION_COLORS[v] || '#94a3b8') + '22',
        color: ACTION_COLORS[v] || '#94a3b8',
        fontSize: '0.7rem',
        fontWeight: 600,
        textTransform: 'capitalize',
      }}>{v}</span>
    )},
    { key: 'module', label: 'Module' },
    { key: 'entity_label', label: 'Entity', render: (v, r) => v || `${r.entity_type} #${r.entity_id}` },
    { key: 'description', label: 'Description', render: (v) => v ? (v.length > 100 ? v.substring(0, 100) + '...' : v) : '—' },
    { key: 'ip_address', label: 'IP', render: (v) => v || '—' },
    { key: 'created_at', label: 'When', render: (v) => new Date(v).toLocaleString() },
    { key: 'actions', label: '', render: (_, row) => (
      <button className="btn btn-sm" onClick={() => setActive(row)}>View</button>
    )},
  ];

  return (
    <ErpPageShell
      icon={faHistory}
      title="Audit Log"
      description="Complete history of all changes made by users."
    >
      <div className="d-flex flex-wrap gap-2 mb-3">
        <select className="form-select form-select-sm" style={{ width: 'auto' }} value={module} onChange={(e) => setModule(e.target.value)}>
          <option value="">All Modules</option>
          {['lead', 'deal', 'contact', 'customer', 'email', 'followup', 'sequence', 'automation', 'document', 'campaign'].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select className="form-select form-select-sm" style={{ width: 'auto' }} value={action} onChange={(e) => setAction(e.target.value)}>
          <option value="">All Actions</option>
          {['created', 'updated', 'deleted', 'imported', 'exported', 'merged', 'converted', 'completed', 'assigned', 'won', 'lost'].map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <ErpDataTable
        columns={columns}
        data={data.data}
        loading={loading}
        currentPage={data.meta.current_page}
        totalPages={data.meta.last_page}
        entriesPerPage={perPage}
        totalEntries={data.meta.total}
        onPageChange={setPage}
        onEntriesPerPageChange={(v) => { setPerPage(v); setPage(1); }}
        isDark={isDark}
      />

      <CrmModal isOpen={!!active} onClose={() => setActive(null)} title="Audit Details" size="lg" isDark={isDark}>
        {active && (
          <div>
            <div className="mb-3">
              <strong>Action:</strong> {active.action}<br/>
              <strong>Module:</strong> {active.module}<br/>
              <strong>Entity:</strong> {active.entity_type} #{active.entity_id}<br/>
              <strong>User:</strong> {active.user_name} ({active.user_id})<br/>
              <strong>IP:</strong> {active.ip_address}<br/>
              <strong>User Agent:</strong> {active.user_agent?.substring(0, 100)}<br/>
              <strong>When:</strong> {new Date(active.created_at).toLocaleString()}
            </div>
            {active.description && (
              <>
                <h6>Description</h6>
                <p>{active.description}</p>
              </>
            )}
            {active.old_values && (
              <>
                <h6>Old Values</h6>
                <pre style={{ background: isDark ? '#0f172a' : '#f1f5f9', padding: '0.75rem', borderRadius: '8px' }}>
                  {JSON.stringify(active.old_values, null, 2)}
                </pre>
              </>
            )}
            {active.new_values && (
              <>
                <h6>New Values</h6>
                <pre style={{ background: isDark ? '#0f172a' : '#f1f5f9', padding: '0.75rem', borderRadius: '8px' }}>
                  {JSON.stringify(active.new_values, null, 2)}
                </pre>
              </>
            )}
          </div>
        )}
      </CrmModal>
    </ErpPageShell>
  );
};

export default CrmAudit;