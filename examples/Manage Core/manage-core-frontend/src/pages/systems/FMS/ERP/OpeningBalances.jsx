import React, { useState, useEffect } from 'react';
import { listOpeningBalances, createOpeningBalance, updateOpeningBalance, deleteOpeningBalance } from '../../../../api/accounting';
import { listAccounts } from '../../../../api/accounting';

const OpeningBalances = ()=>{
  const [items,setItems]=useState([]);
  const [accounts,setAccounts]=useState([]);
  const [form,setForm]=useState({account_id:'',period_id:'',amount:0,currency:'PKR',note:'',is_draft:false});
  const [editing,setEditing]=useState(null);

  useEffect(()=>{ fetch(); loadAccounts(); const s=localStorage.getItem('opening_draft'); if(s) setForm(JSON.parse(s)); },[]);
  useEffect(()=>{ const t=setTimeout(()=>localStorage.setItem('opening_draft',JSON.stringify(form)),700); return ()=>clearTimeout(t); },[form]);

  async function fetch(){ try{ const res=await listOpeningBalances(); setItems(res.data||res); }catch(e){setItems([]);} }
  async function loadAccounts(){ try{ const res=await listAccounts(); setAccounts(res.data||res); }catch(e){setAccounts([]);} }
  async function save(){ try{ if(editing) await updateOpeningBalance(editing.id,form); else await createOpeningBalance(form); localStorage.removeItem('opening_draft'); setForm({account_id:'',period_id:'',amount:0,currency:'PKR',note:'',is_draft:false}); setEditing(null); fetch(); }catch(e){alert(e.message);} }
  function edit(it){ setEditing(it); setForm({account_id:it.account_id,period_id:it.period_id,amount:it.amount,currency:it.currency||'PKR',note:it.note||'',is_draft:!!it.is_draft}); }
  async function del(id){ if(!confirm('Delete?'))return; await deleteOpeningBalance(id); fetch(); }
  function exportCsv(){ const rows=items.map(i=>[i.id,i.account_id,i.period_id,Number(i.amount||0).toFixed(2),i.currency,(i.note||'').replace(/,/g,' ')].join(',')); const csv=['id,account_id,period_id,amount,currency,note',...rows].join('\n'); const b=new Blob([csv],{type:'text/csv'}); const u=URL.createObjectURL(b); const a=document.createElement('a'); a.href=u; a.download='opening_balances.csv'; a.click(); URL.revokeObjectURL(u); }

  return (<div>
    <h3>Opening Balances</h3>
    <div>
      <select value={form.account_id} onChange={e=>setForm({...form,account_id:e.target.value})}><option value="">--Account--</option>{accounts.map(a=>(<option key={a.id} value={a.id}>{a.code} - {a.name}</option>))}</select>
      <input placeholder="Period ID" value={form.period_id} onChange={e=>setForm({...form,period_id:e.target.value})} />
      <input type="number" placeholder="Amount" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} />
      <input placeholder="Currency" value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})} />
      <input placeholder="Note" value={form.note} onChange={e=>setForm({...form,note:e.target.value})} />
      <label><input type="checkbox" checked={form.is_draft} onChange={e=>setForm({...form,is_draft:e.target.checked})} /> Draft</label>
      <button onClick={save}>{editing?'Update':'Create'}</button>
      <button onClick={()=>{ const s=localStorage.getItem('opening_draft'); if(s){ setForm(JSON.parse(s)); alert('Draft loaded'); }}}>Load Draft</button>
      <button onClick={exportCsv}>Export CSV</button>
    </div>
    <table border="1" cellPadding="6"><thead><tr><th>ID</th><th>Account</th><th>Period</th><th>Amount</th><th>Currency</th><th>Actions</th></tr></thead><tbody>{items.map(it=>(<tr key={it.id}><td>{it.id}</td><td>{it.account_id}</td><td>{it.period_id}</td><td>{Number(it.amount||0).toFixed(2)}</td><td>{it.currency}</td><td><button onClick={()=>edit(it)}>Edit</button><button onClick={()=>del(it.id)}>Delete</button></td></tr>))}</tbody></table>
  </div>);
}
export default OpeningBalances;