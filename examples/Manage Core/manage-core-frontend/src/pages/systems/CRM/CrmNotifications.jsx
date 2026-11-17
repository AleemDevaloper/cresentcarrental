import React, { useEffect, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  listNotifications, markAllRead, markNotificationRead, deleteNotification, getUnreadCount,
} from '../../../api/crm';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../components/ui/ux/ErpKpiCard';
import { CrmNotificationItem } from '../../../components/crm';
import {
  faBell, faCheck, faTrash, faCheckDouble,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CrmNotifications = () => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const [data, setData] = useState({ data: [], meta: { current_page: 1, last_page: 1, per_page: 25, total: 0 } });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(25);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await listNotifications({ page, per_page: perPage, unread_only: unreadOnly });
      setData(res);
      const c = await getUnreadCount();
      setUnreadCount(c.count || 0);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [page, perPage, unreadOnly]);

  const handleMarkAllRead = async () => {
    await markAllRead();
    fetch();
  };

  const handleMarkRead = async (n) => {
    if (!n.read_at) await markNotificationRead(n.id);
    fetch();
  };

  const handleDelete = async (n) => {
    await deleteNotification(n.id);
    fetch();
  };

  return (
    <ErpPageShell
      icon={faBell}
      title="Notifications"
      description="All CRM events and system alerts."
      action={
        <>
          <button className="btn btn-outline-primary btn-sm me-2" onClick={() => setUnreadOnly(!unreadOnly)}>
            {unreadOnly ? 'Show All' : 'Unread Only'}
          </button>
          <button className="btn btn-primary btn-sm" onClick={handleMarkAllRead}>
            <FontAwesomeIcon icon={faCheckDouble} className="me-2" />Mark All Read
          </button>
        </>
      }
    >
      <div className="row g-2 mb-3">
        <div className="col-md-4"><ErpKpiCard title="Total" value={data.meta.total || 0} icon={faBell} color="#6366f1" /></div>
        <div className="col-md-4"><ErpKpiCard title="Unread" value={unreadCount} icon={faBell} color="#ef4444" /></div>
        <div className="col-md-4"><ErpKpiCard title="Page" value={`${data.meta.current_page}/${data.meta.last_page}`} icon={faCheck} color="#10b981" /></div>
      </div>

      {loading && <p>Loading...</p>}
      {!loading && data.data.length === 0 && (
        <div className="text-center p-5">
          <FontAwesomeIcon icon={faBell} size="3x" style={{ opacity: 0.3 }} />
          <p className="mt-3">No notifications.</p>
        </div>
      )}
      {data.data.map(n => (
        <div key={n.id} className="d-flex gap-2">
          <div style={{ flex: 1 }}>
            <CrmNotificationItem notification={n} isDark={isDark} onClick={() => handleMarkRead(n)} />
          </div>
          <button className="btn btn-sm text-danger" onClick={() => handleDelete(n)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ))}

      {!loading && data.meta.last_page > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3 p-3">
          <small>Page {data.meta.current_page} of {data.meta.last_page}</small>
          <div className="d-flex gap-1">
            <button className="btn btn-sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>‹ Prev</button>
            <button className="btn btn-sm" disabled={page >= data.meta.last_page} onClick={() => setPage(page + 1)}>Next ›</button>
          </div>
        </div>
      )}
    </ErpPageShell>
  );
};

export default CrmNotifications;