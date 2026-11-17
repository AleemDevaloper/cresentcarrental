import React, { useState, useEffect } from 'react';
import { listAccountGroups, createAccountGroup, updateAccountGroup, deleteAccountGroup, listAccountTypes } from '../../../../api/accounting';

const AccountGroups = ()=>{
  const [items,setItems]=useState([]);
  const [types,setTypes]=useState([]);
  const [form,setForm]=useState({account_type_id:'',name:'',code:'',description:''});
  const [editing,setEditing]=useState(null);

  useEffect(()=>{ fetch(); loadTypes(); const s=localStorage.getItem('acctgrp_draft'); if(s) setForm(JSON.parse(s)); },[]);
  useEffect(()=>{ const t=setTimeout(()=>localStorage.setItem('acctgrp_draft',JSON.stringify(form)),700); return ()=>clearTimeout(t); },[form]);

  async function fetch(){ try{ const res=await listAccountGroups(); setItems(Array.isArray(res)?res:res.data||[]); }catch(e){setItems([]);} }
  async function loadTypes(){ try{ const res=await listAccountTypes(); setTypes(Array.isArray(res)?res:res.data||[]); }catch(e){setTypes([]);} }
  async function save(){ try{ if(editing) await updateAccountGroup(editing.id,form); else await createAccountGroup(form); localStorage.removeItem('acctgrp_draft'); setForm({account_type_id:'',name:'',code:'',description:''}); setEditing(null); fetch(); }catch(e){alert(e.message);} }
  function edit(it){ setEditing(it); setForm({account_type_id:it.account_type_id||'',name:it.name,code:it.code,description:it.description||''}); }
  async function del(id){ if(!confirm('Delete?'))return; await deleteAccountGroup(id); fetch(); }
  function exportCsv(){ const rows=items.map(i=>[i.id,i.account_type_id||'',i.name,i.code,(i.description||'').replace(/,/g,' ')].join(',')); const csv=['id,account_type_id,name,code,description',...rows].join('\n'); const b=new Blob([csv],{type:'text/csv'}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download='account_groups.csv'; a.click(); URL.revokeObjectURL(u); }

  return (<div>
    <h3>Account Groups</h3>
    <div>
      <select value={form.account_type_id} onChange={e=>setForm({...form,account_type_id:e.target.value})}>
        <option value="">--Type--</option>
        {types.map(t=>(<option key={t.id} value={t.id}>{t.name}</option>))}
      </select>
      <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
      <input placeholder="Code" value={form.code} onChange={e=>setForm({...form,code:e.target.value})} />
      <input placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />
      <button onClick={save}>{editing?'Update':'Create'}</button>
      <button onClick={()=>{ const s=localStorage.getItem('acctgrp_draft'); if(s){ setForm(JSON.parse(s)); alert('Draft loaded'); }}}>Load Draft</button>
      <button onClick={exportCsv}>Export CSV</button>
    </div>
    <table border="1" cellPadding="6"><thead><tr><th>ID</th><th>Type</th><th>Name</th><th>Code</th><th>Actions</th></tr></thead><tbody>{items.map(it=>(<tr key={it.id}><td>{it.id}</td><td>{it.account_type_id}</td><td>{it.name}</td><td>{it.code}</td><td><button onClick={()=>edit(it)}>Edit</button><button onClick={()=>del(it.id)}>Delete</button></td></tr>))}</tbody></table>
  </div>);
}
export default AccountGroups;