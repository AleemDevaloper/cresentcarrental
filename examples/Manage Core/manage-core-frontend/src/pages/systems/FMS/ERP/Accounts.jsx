import React, { useState, useEffect } from 'react';
import { listAccounts, createAccount, updateAccount, deleteAccount, listAccountGroups, listAccountTypes } from '../../../../api/accounting';

const Accounts = ()=>{
  const [items,setItems]=useState([]);
  const [groups,setGroups]=useState([]);
  const [types,setTypes]=useState([]);
  const [form,setForm]=useState({account_group_id:'',account_type_id:'',parent_id:'',code:'',name:'',opening_balance:0,is_draft:false});
  const [editing,setEditing]=useState(null);

  useEffect(()=>{ fetch(); loadRefs(); const s=localStorage.getItem('accounts_draft'); if(s) setForm(JSON.parse(s)); },[]);
  useEffect(()=>{ const t=setTimeout(()=>localStorage.setItem('accounts_draft',JSON.stringify(form)),800); return ()=>clearTimeout(t); },[form]);
  async function fetch(){ try{ const res=await listAccounts(); setItems(res.data||res); }catch(e){setItems([]);} }
  async function loadRefs(){ try{ const rg=await listAccountGroups(); setGroups(rg.data||rg||[]); const rt=await listAccountTypes(); setTypes(rt.data||rt||[]);}catch(e){setGroups([]);setTypes([]);} }
  async function save(){ try{ if(editing) await updateAccount(editing.id,form); else await createAccount(form); localStorage.removeItem('accounts_draft'); setForm({account_group_id:'',account_type_id:'',parent_id:'',code:'',name:'',opening_balance:0,is_draft:false}); setEditing(null); fetch(); }catch(e){alert(e.message);} }
  function edit(it){ setEditing(it); setForm({account_group_id:it.account_group_id||'',account_type_id:it.account_type_id||'',parent_id:it.parent_id||'',code:it.code||'',name:it.name||'',opening_balance:it.opening_balance||0,is_draft:!!it.is_draft}); }
  async function del(id){ if(!confirm('Delete?'))return; await deleteAccount(id); fetch(); }
  function exportCsv(){ const rows=items.map(i=>[i.id,i.code,i.name,i.account_group_id||'',i.account_type_id||'',Number(i.opening_balance||0).toFixed(2)].join(',')); const csv=['id,code,name,group,type,opening_balance',...rows].join('\n'); const b=new Blob([csv],{type:'text/csv'}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download='accounts.csv'; a.click(); URL.revokeObjectURL(u); }

  return (<div>
    <h3>Chart of Accounts</h3>
    <div>
      <select value={form.account_type_id} onChange={e=>setForm({...form,account_type_id:e.target.value})}><option value="">--Type--</option>{types.map(t=>(<option key={t.id} value={t.id}>{t.name}</option>))}</select>
      <select value={form.account_group_id} onChange={e=>setForm({...form,account_group_id:e.target.value})}><option value="">--Group--</option>{groups.map(g=>(<option key={g.id} value={g.id}>{g.name}</option>))}</select>
      <input placeholder="Code" value={form.code} onChange={e=>setForm({...form,code:e.target.value})} />
      <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
      <input type="number" placeholder="Opening Balance" value={form.opening_balance} onChange={e=>setForm({...form,opening_balance:e.target.value})} />
      <label><input type="checkbox" checked={form.is_draft} onChange={e=>setForm({...form,is_draft:e.target.checked})} /> Draft</label>
      <button onClick={save}>{editing?'Update':'Create'}</button>
      <button onClick={()=>{ const s=localStorage.getItem('accounts_draft'); if(s){ setForm(JSON.parse(s)); alert('Draft loaded'); }}}>Load Draft</button>
      <button onClick={exportCsv}>Export CSV</button>
    </div>
    <table border="1" cellPadding="6"><thead><tr><th>ID</th><th>Code</th><th>Name</th><th>Group</th><th>Type</th><th>Opening</th><th>Actions</th></tr></thead><tbody>{items.map(it=>(<tr key={it.id}><td>{it.id}</td><td>{it.code}</td><td>{it.name}</td><td>{it.account_group_id}</td><td>{it.account_type_id}</td><td>{Number(it.opening_balance||0).toFixed(2)}</td><td><button onClick={()=>edit(it)}>Edit</button><button onClick={()=>del(it.id)}>Delete</button></td></tr>))}</tbody></table>
  </div>);
}
export default Accounts;