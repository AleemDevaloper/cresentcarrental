import React, { useState, useEffect } from 'react';
import client from '../../../../api/client';
import { listFiscalYears, createFiscalYear, updateFiscalYear, deleteFiscalYear } from '../../../../api/accounting';

const FiscalYears = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', start_date: '', end_date: '', is_draft: false });
  const [editing, setEditing] = useState(null);

  useEffect(() => { fetchList(); const saved = localStorage.getItem('fy_draft'); if (saved) setForm(JSON.parse(saved)); }, []);

  useEffect(() => { const t = setTimeout(() => localStorage.setItem('fy_draft', JSON.stringify(form)), 800); return () => clearTimeout(t); }, [form]);

  async function fetchList() {
    setLoading(true);
    try { const res = await listFiscalYears({ per_page: 100 }); setItems(res.data || res); } catch (e) { setItems([]); } finally { setLoading(false); }
  }

  async function handleSave() {
    try {
      if (editing) {
        await updateFiscalYear(editing.id, form);
      } else {
        await createFiscalYear(form);
      }
      localStorage.removeItem('fy_draft');
      setForm({ name:'', start_date:'', end_date:'', is_draft:false });
      setEditing(null);
      fetchList();
    } catch (err) { alert(err.message || 'Save failed'); }
  }

  async function handleEdit(it){ setEditing(it); setForm({ name: it.name, start_date: it.start_date?.slice(0,10) || '', end_date: it.end_date?.slice(0,10) || '', is_draft: !!it.is_draft }); }
  async function handleDelete(id){ if (!confirm('Delete fiscal year?')) return; await deleteFiscalYear(id); fetchList(); }
  function exportCsv(){ const rows = items.map(i=>[i.id,i.name,i.start_date,i.end_date,i.status].join(',')); const csv = ['id,name,start_date,end_date,status',...rows].join('\n'); const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='fiscal_years.csv'; a.click(); URL.revokeObjectURL(url); }

  return (
    <div>
      <h3>Fiscal Years</h3>
      <div style={{marginBottom:12}}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
        <input type="date" value={form.start_date} onChange={e=>setForm({...form,start_date:e.target.value})} />
        <input type="date" value={form.end_date} onChange={e=>setForm({...form,end_date:e.target.value})} />
        <label><input type="checkbox" checked={form.is_draft} onChange={e=>setForm({...form,is_draft:e.target.checked})} /> Draft</label>
        <button onClick={handleSave}>{editing? 'Update':'Create'}</button>
        {editing && <button onClick={() => { setEditing(null); setForm({ name:'', start_date:'', end_date:'', is_draft:false }); }}>Cancel</button>}
        <button onClick={()=>{ const saved = localStorage.getItem('fy_draft'); if (saved) { setForm(JSON.parse(saved)); alert('Draft loaded'); }}}>Load Draft</button>
        <button onClick={exportCsv}>Export CSV</button>
      </div>

      {loading? <div>Loading...</div> : (
        <table border="1" cellPadding="6">
          <thead><tr><th>ID</th><th>Name</th><th>Start</th><th>End</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {items.map(i=> (
              <tr key={i.id}>
                <td>{i.id}</td>
                <td>{i.name}</td>
                <td>{i.start_date}</td>
                <td>{i.end_date}</td>
                <td>{i.status}</td>
                <td>
                  <button onClick={()=>handleEdit(i)}>Edit</button>
                  <button onClick={()=>handleDelete(i.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default FiscalYears;