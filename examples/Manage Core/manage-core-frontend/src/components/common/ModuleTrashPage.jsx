import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTrashCan, faUndo, faTrash, faSearch, faCircleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../hooks/useApp';
import DialogBox from './UI/Boxes/DialogBox';
import {
  getTrashItems,
  restoreTrashItem,
  forceDeleteTrashItem,
  purgeAllTrash,
} from '../../utils/moduleEntityStore';

const ModuleTrashPage = ({
  system,
  isDark = false,
  title = 'Trash',
  subtitle = 'Soft-deleted records can be restored or permanently purged from here.',
  accent = '#ef4444',
}) => {
  const { addNotification } = useApp();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [purgingItem, setPurgingItem] = useState(null);
  const [purgeAllConfirm, setPurgeAllConfirm] = useState(false);

  const reload = () => setItems(getTrashItems(system));

  useEffect(() => {
    reload();
  }, [system]);

  const entityTypes = useMemo(
    () => [...new Set(items.map((i) => i.entityLabel || i.entity))],
    [items],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((item) => {
      if (typeFilter !== 'all' && (item.entityLabel || item.entity) !== typeFilter) return false;
      if (!q) return true;
      return (
        String(item.title || '').toLowerCase().includes(q) ||
        String(item.entityLabel || item.entity || '').toLowerCase().includes(q) ||
        String(item.deletedBy || '').toLowerCase().includes(q)
      );
    });
  }, [items, search, typeFilter]);

  const handleRestore = (trashId, titleLabel) => {
    const restored = restoreTrashItem(system, trashId);
    if (!restored) {
      addNotification?.('Unable to restore item.', 'danger');
      return;
    }
    reload();
    addNotification?.(`"${titleLabel}" restored successfully.`, 'success');
  };

  const handleForceDelete = () => {
    if (!purgingItem) return;
    forceDeleteTrashItem(system, purgingItem.trashId);
    setPurgingItem(null);
    reload();
    addNotification?.(`"${purgingItem.title}" permanently deleted.`, 'danger');
  };

  const handlePurgeAll = () => {
    purgeAllTrash(system);
    setPurgeAllConfirm(false);
    reload();
    addNotification?.('All trash items permanently purged.', 'danger');
  };

  const cardBg = isDark ? '#1e293b' : '#ffffff';
  const textColor = isDark ? '#f1f5f9' : '#0f172a';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0';
  const inputBg = isDark ? '#0f172a' : '#fff';

  return (
    <div className="container-fluid py-4 px-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
        <div className="d-flex align-items-start gap-3">
          <div
            className="rounded-3 d-flex align-items-center justify-content-center"
            style={{ width: 48, height: 48, background: `${accent}18`, color: accent }}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </div>
          <div>
            <h4 className="fw-bold mb-1" style={{ color: textColor }}>{title}</h4>
            <p className="small mb-0" style={{ color: mutedColor }}>{subtitle}</p>
          </div>
        </div>
        {items.length > 0 && (
          <button
            className="btn btn-sm btn-danger border-0 d-flex align-items-center gap-2 px-3"
            style={{ borderRadius: 10, boxShadow: '0 4px 14px rgba(239,68,68,0.3)' }}
            onClick={() => setPurgeAllConfirm(true)}
          >
            <FontAwesomeIcon icon={faTrash} />
            Purge All Trash
          </button>
        )}
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 h-100" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
            <div className="card-body py-3">
              <div className="small text-uppercase fw-semibold" style={{ color: mutedColor, letterSpacing: '0.04em' }}>Soft-deleted</div>
              <div className="fw-bold fs-3" style={{ color: accent }}>{items.length}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 h-100" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
            <div className="card-body py-3">
              <div className="small text-uppercase fw-semibold" style={{ color: mutedColor, letterSpacing: '0.04em' }}>Visible results</div>
              <div className="fw-bold fs-3" style={{ color: textColor }}>{filtered.length}</div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 h-100" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
            <div className="card-body py-3">
              <div className="small text-uppercase fw-semibold" style={{ color: mutedColor, letterSpacing: '0.04em' }}>Entity types</div>
              <div className="fw-bold fs-3" style={{ color: textColor }}>{entityTypes.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 mb-4" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
        <div className="card-body p-3">
          <div className="row g-2 align-items-center">
            <div className="col-md-6">
              <div className="input-group input-group-sm">
                <span className="input-group-text border-end-0" style={{ background: inputBg, borderColor, color: mutedColor }}>
                  <FontAwesomeIcon icon={faSearch} />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0"
                  placeholder="Search trash..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ background: inputBg, borderColor, color: textColor }}
                />
              </div>
            </div>
            <div className="col-md-3">
              <select
                className="form-select form-select-sm"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                style={{ background: inputBg, borderColor, color: textColor }}
              >
                <option value="all">All Types</option>
                {entityTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4" style={{ background: cardBg, border: `1px solid ${borderColor}` }}>
        <div className="card-body p-0">
          {filtered.length === 0 ? (
            <div className="text-center py-5" style={{ color: mutedColor }}>
              <FontAwesomeIcon icon={faTrashCan} className="fs-1 mb-3 opacity-25" />
              <p className="mb-0 fw-semibold">Trash is empty</p>
              <p className="small mb-0 mt-1">Deleted records from this system will appear here.</p>
            </div>
          ) : (
            <div className="table-responsive mc-table-wrapper">
              <table className="table align-middle mb-0 mc-table">
                <thead>
                  <tr>
                    <th className="ps-4 py-3">Record</th>
                    <th>Type</th>
                    <th>Deleted By</th>
                    <th>Deleted At</th>
                    <th className="pe-4 text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => (
                    <tr key={item.trashId}>
                      <td className="ps-4">
                        <div className="fw-semibold" style={{ color: textColor, fontSize: '0.9rem' }}>{item.title}</div>
                        <div className="small" style={{ color: mutedColor }}>ID: {String(item.recordId)}</div>
                      </td>
                      <td>
                        <span
                          className="badge rounded-pill"
                          style={{ background: `${accent}18`, color: accent, fontWeight: 600 }}
                        >
                          {item.entityLabel || item.entity}
                        </span>
                      </td>
                      <td style={{ color: mutedColor, fontSize: '0.85rem' }}>{item.deletedBy || '—'}</td>
                      <td style={{ color: mutedColor, fontSize: '0.85rem' }}>
                        {item.deletedAt ? new Date(item.deletedAt).toLocaleString() : '—'}
                      </td>
                      <td className="pe-4 text-end">
                        <button
                          className="btn btn-sm btn-outline-success rounded-pill px-3 fw-semibold me-2"
                          onClick={() => handleRestore(item.trashId, item.title)}
                        >
                          <FontAwesomeIcon icon={faUndo} className="me-1" />
                          Restore
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-semibold"
                          onClick={() => setPurgingItem(item)}
                        >
                          <FontAwesomeIcon icon={faTrashCan} className="me-1" />
                          Delete Forever
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <DialogBox.Confirm
        show={!!purgingItem}
        onClose={() => setPurgingItem(null)}
        onConfirm={handleForceDelete}
        title="Permanently Delete"
        message={`Permanently delete "${purgingItem?.title}"? This cannot be undone.`}
        confirmLabel="Delete Forever"
        variant="danger"
      />

      <DialogBox.Confirm
        show={purgeAllConfirm}
        onClose={() => setPurgeAllConfirm(false)}
        onConfirm={handlePurgeAll}
        title="Purge All Trash"
        message="Permanently purge all soft-deleted records in this system? This cannot be undone."
        confirmLabel="Purge All"
        variant="danger"
      />

      {items.length > 0 && (
        <div className="mt-3 small d-flex align-items-center gap-2" style={{ color: mutedColor }}>
          <FontAwesomeIcon icon={faCircleExclamation} />
          Restored items return to their original module tab lists.
        </div>
      )}
    </div>
  );
};

export default ModuleTrashPage;
