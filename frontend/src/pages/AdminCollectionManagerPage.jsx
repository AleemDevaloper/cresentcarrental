import { useEffect, useState } from 'react';
import { Plus, RefreshCw, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../services/api';
import Button from '../components/Button';

export default function AdminCollectionManagerPage({
  title,
  endpoint,
  description = 'Manage dynamic website content.',
  fields = ['title', 'description', 'status'],
  readOnly = false,
}) {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    api.get(`/admin/${endpoint}`)
      .then((r) => {
        let data = r.data?.data ?? r.data ?? [];
        if (!Array.isArray(data)) data = [];
        setRows(data);
      })
      .catch((e) => {
        setRows([]);
        setError(e.response?.data?.message || 'Failed to load records. Check the backend API.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const save = async (e) => {
    e.preventDefault();
    if (saving || !editing) return;
    setSaving(true);
    setError('');
    try {
      const id = editing.id;
      await (id
        ? api.put(`/admin/${endpoint}/${id}`, editing)
        : api.post(`/admin/${endpoint}`, editing));
      setEditing(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm('Delete this record?')) return;
    try {
      await api.delete(`/admin/${endpoint}/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete record.');
    }
  };

  const textField = (f) =>
    fields.indexOf(f) >= 0 && ['description', 'answer', 'content', 'message', 'notes', 'seo_description', 'meta_description'].includes(f);

  return (
    <>
      <div className="admin-page-title">
        <div>
          <span className="eyebrow">Content management</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {!readOnly && (
            <Button variant="red" onClick={() => setEditing({ status: 'active' })}>
              <Plus size={16} /> Add New
            </Button>
          )}
          <Button variant="ghost" onClick={load} disabled={loading}>
            <RefreshCw size={16} style={{ transform: loading ? 'rotate(360deg)' : 'none', transition: 'transform .5s' }} /> Refresh
          </Button>
        </div>
      </div>

      {error && (
        <div className="admin-banner admin-banner-error" role="alert" style={{ marginBottom: 18 }}>
          <AlertTriangle size={17} /> {error}
        </div>
      )}

      <div className="admin-table-panel">
        {loading ? (
          <div className="admin-loading" style={{ padding: 48, textAlign: 'center', color: '#888' }}>
            <Loader2 size={28} style={{ animation: 'spin 1s linear infinite', marginBottom: 10 }} />
            <p style={{ margin: 0 }}>Loading {title.toLowerCase()}…</p>
          </div>
        ) : rows.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#999' }}>
            <p style={{ margin: 0, fontSize: 15 }}>No records found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  {fields.slice(0, 3).map((f) => (
                    <th key={f}>{f.replaceAll('_', ' ')}</th>
                  ))}
                  <th>Updated</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td style={{ color: '#999', fontSize: 12 }}>{r.id}</td>
                    {fields.slice(0, 3).map((f) => (
                      <td key={f}>
                        <strong>{String(r[f] ?? '—').slice(0, 80)}</strong>
                        {textField(f) && String(r[f] ?? '').length > 80 && (
                          <small>{String(r[f]).slice(80, 160)}…</small>
                        )}
                      </td>
                    ))}
                    <td style={{ fontSize: 12, color: '#999' }}>{r.updated_at ? new Date(r.updated_at).toLocaleDateString() : '—'}</td>
                    <td>
                      {!readOnly && (
                        <>
                          <button className="table-link" type="button" onClick={() => setEditing({ ...r })}>Edit</button>
                          <button className="table-link danger" type="button" onClick={() => del(r.id)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <div className="drawer-backdrop" onClick={() => setEditing(null)}>
          <form className="admin-drawer" onSubmit={save} onClick={(e) => e.stopPropagation()}>
            <div className="drawer-head">
              <div>
                <span className="eyebrow">{editing.id ? 'Edit' : 'Add'} record</span>
                <h2>{title}</h2>
              </div>
              <button type="button" aria-label="Close" onClick={() => setEditing(null)}>×</button>
            </div>
            {fields.map((f) => (
              <label className="admin-field" key={f}>
                <span>{f.replaceAll('_', ' ')}</span>
                {textField(f) ? (
                  <textarea
                    rows={5}
                    value={editing[f] || ''}
                    onChange={(e) => setEditing({ ...editing, [f]: e.target.value })}
                  />
                ) : (
                  <input
                    value={editing[f] ?? ''}
                    onChange={(e) => setEditing({ ...editing, [f]: e.target.value })}
                  />
                )}
              </label>
            ))}
            {error && <div className="form-message form-message-error" role="alert">{error}</div>}
            <Button type="submit" variant="red" fullWidth className="mt-4" loading={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
