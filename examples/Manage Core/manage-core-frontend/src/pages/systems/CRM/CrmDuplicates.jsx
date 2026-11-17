import React, { useEffect, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { listDuplicates, scanDuplicates, getDuplicateGroup, mergeDuplicates, ignoreDuplicate, markNotDuplicate } from '../../../api/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpDataTable from '../../../components/ui/ux/ErpDataTable';
import { CrmModal, CrmConfirmDialog } from '../../../components/crm';
import {
  faCopy, faSync, faTrash, faCheck, faEye, faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CrmDuplicates = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';

  const [entityType, setEntityType] = useState('lead');
  const [data, setData] = useState({ data: [], meta: { current_page: 1, last_page: 1, per_page: 25, total: 0 } });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [activeGroup, setActiveGroup] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await listDuplicates({ entity_type: entityType, page, per_page: perPage });
      setData(res);
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [entityType, page, perPage]);

  const handleScan = async () => {
    try {
      await scanDuplicates(entityType);
      addNotification?.({ type: 'success', message: 'Scan queued. Refresh in a few seconds.' });
      setTimeout(fetch, 5000);
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    }
  };

  const openGroup = async (g) => {
    try {
      const full = await getDuplicateGroup(g.id);
      setActiveGroup(full);
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed' });
    }
  };

  const handleIgnore = async (g) => {
    await ignoreDuplicate(g.id);
    addNotification?.({ type: 'success', message: 'Ignored' });
    fetch();
  };

  const handleMarkNotDup = async (g) => {
    await markNotDuplicate(g.id);
    addNotification?.({ type: 'success', message: 'Marked as not duplicate' });
    fetch();
  };

  const columns = [
    { key: 'match_field', label: 'Match Field', render: (v, r) => (
      <span><strong>{v}</strong>: <code>{r.match_value}</code></span>
    )},
    { key: 'entity_type', label: 'Type', render: (v) => <span className="badge bg-secondary">{v.split('\\').pop()}</span> },
    { key: 'member_count', label: 'Members', align: 'right' },
    { key: 'status', label: 'Status', render: (v) => (
      <span style={{
        color: v === 'open' ? '#f59e0b' : v === 'resolved' ? '#10b981' : '#94a3b8',
        fontWeight: 600,
      }}>{v}</span>
    )},
    { key: 'created_at', label: 'Detected', render: (v) => new Date(v).toLocaleString() },
    { key: 'actions', label: '', render: (_, row) => (
      <div className="d-flex gap-1 justify-content-end">
        <button className="btn btn-sm" onClick={() => openGroup(row)} title="View"><FontAwesomeIcon icon={faEye} /></button>
        <button className="btn btn-sm" onClick={() => handleIgnore(row)} title="Ignore"><FontAwesomeIcon icon={faTimes} /></button>
        <button className="btn btn-sm text-success" onClick={() => handleMarkNotDup(row)} title="Not duplicate"><FontAwesomeIcon icon={faCheck} /></button>
      </div>
    )},
  ];

  return (
    <ErpPageShell
      icon={faCopy}
      title="Duplicate Management"
      description="Detect, compare and merge duplicate records."
      action={
        <>
          <select className="form-select form-select-sm me-2" style={{ width: 'auto', display: 'inline-block' }} value={entityType} onChange={(e) => { setEntityType(e.target.value); setPage(1); }}>
            <option value="lead">Leads</option>
            <option value="contact">Contacts</option>
            <option value="customer">Companies</option>
          </select>
          <button className="btn btn-primary btn-sm" onClick={handleScan}>
            <FontAwesomeIcon icon={faSync} className="me-2" />Scan for Duplicates
          </button>
        </>
      }
    >
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

      <CrmModal isOpen={!!activeGroup} onClose={() => setActiveGroup(null)} title={`Duplicate Group #${activeGroup?.id}`} size="lg" isDark={isDark}>
        {activeGroup && (
          <div>
            <p><strong>Match Field:</strong> {activeGroup.match_field}: <code>{activeGroup.match_value}</code></p>
            <p>{activeGroup.member_count} duplicates found. Select the primary record and merge others into it.</p>
            <table className="table">
              <thead><tr><th>Record</th><th>Primary?</th></tr></thead>
              <tbody>
                {activeGroup.members.map(m => (
                  <tr key={m.id}>
                    <td>{m.record?.name || m.record?.first_name || `#${m.entity_id}`} ({m.record?.email || 'no email'})</td>
                    <td>
                      <button className="btn btn-sm btn-primary" disabled>Merge</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="small text-muted">Use the merge API to actually merge records. This UI is for review.</p>
          </div>
        )}
      </CrmModal>
    </ErpPageShell>
  );
};

export default CrmDuplicates;