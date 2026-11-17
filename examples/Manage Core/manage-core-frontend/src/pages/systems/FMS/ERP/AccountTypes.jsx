import React, { useState, useEffect } from 'react';
import { listAccountTypes, createAccountType, updateAccountType, deleteAccountType } from '../../../../api/accounting';

const AccountTypes = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name:'', code:'', description:'' });
  const [editing, setEditing] = useState(null);

  useEffect(()=>{ fetch(); const saved=localStorage.getItem('acctype_draft'); if(saved) setForm(JSON.parse(saved)); },[]);
  useEffect(()=>{ const t=setTimeout(()=>localStorage.setItem('acctype_draft',JSON.stringify(form)),600); return ()=>clearTimeout(t); },[form]);

  async function fetch(){ try{ const res=await listAccountTypes(); setItems(Array.isArray(res)?res:res.data||[]); }catch(e){setItems([]);} }
  async function save(){ try{ if(editing) await updateAccountType(editing.id,form); else await createAccountType(form); localStorage.removeItem('acctype_draft'); setForm({name:'',code:'',description:''}); setEditing(null); fetch(); }catch(e){alert(e.message);} }
  function edit(it){ setEditing(it); setForm({name:it.name,code:it.code,description:it.description||''}); }
  async function del(id){ if(!confirm('Delete?')) return; await deleteAccountType(id); fetch(); }
  function exportCsv(){ const rows=items.map(i=>[i.id,i.name,i.code,(i.description||'').replace(/,/g,' ')].join(',')); const csv=['id,name,code,description',...rows].join('\n'); const b=new Blob([csv],{type:'text/csv'}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download='account_types.csv'; a.click(); URL.revokeObjectURL(u); }

  return (<div>
    <h3>Account Types</h3>
    <div>
      <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
      <input placeholder="Code" value={form.code} onChange={e=>setForm({...form,code:e.target.value})} />
      <input placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
      <button onClick={save}>{editing?'Update':'Create'}</button>
      <button onClick={()=>{ const s=localStorage.getItem('acctype_draft'); if(s){ setForm(JSON.parse(s)); alert('Draft loaded'); }}}>Load Draft</button>
      <button onClick={exportCsv}>Export CSV</button>
    </div>
    <table border="1" cellPadding="6">
      <thead><tr><th>ID</th><th>Name</th><th>Code</th><th>Description</th><th>Actions</th></tr></thead>
      <tbody>{items.map(it=>(<tr key={it.id}><td>{it.id}</td><td>{it.name}</td><td>{it.code}</td><td>{it.description}</td><td><button onClick={()=>edit(it)}>Edit</button><button onClick={()=>del(it.id)}>Delete</button></td></tr>))}</tbody>
    </table>
  </div>);
}

export default AccountTypes;