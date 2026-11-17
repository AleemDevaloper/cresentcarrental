import{o as k}from"./rolldown-runtime-BXk0DNi4.js";import{Bl as z,Ca as p,Dr as w,Fl as A,Nl as $,Pl as x,Rr as E,So as T,_u as P,cn as C,dn as g,jl as l,mo as h,mr as u}from"./ai-BhXpYICr.js";var _=k(P(),1),e=z(),M=[{id:"EMP-1041",name:"Ayesha Khan",role:"Finance Lead",initials:"AK",status:"Active",amount:"$48,920",utilization:82},{id:"EMP-1042",name:"Daniel Cruz",role:"FX Analyst",initials:"DC",status:"Pending",amount:"$12,430",utilization:46},{id:"EMP-1043",name:"Sofia Ahmed",role:"Treasury Ops",initials:"SA",status:"Review",amount:"$73,110",utilization:91},{id:"EMP-1044",name:"Marcus Reed",role:"Risk Officer",initials:"MR",status:"Active",amount:"$9,875",utilization:34}],R=(n,s)=>{const i={Active:s?{bg:"#064e3b",fg:"#4ade80",dot:"#4ade80"}:{bg:"#dcfce7",fg:"#16a34a",dot:"#16a34a"},Pending:s?{bg:"#713f12",fg:"#facc15",dot:"#facc15"}:{bg:"#fef9c3",fg:"#ca8a04",dot:"#ca8a04"},Review:s?{bg:"#1e3a5f",fg:"#60a5fa",dot:"#60a5fa"}:{bg:"#dbeafe",fg:"#1d4ed8",dot:"#1d4ed8"}};return i[n]||i.Active},F=({themeId:n})=>(0,e.jsx)("div",{"data-mc-theme":n,className:"mc-table-wrapper rounded-3 overflow-hidden",children:(0,e.jsxs)("table",{className:"table align-middle mb-0 mc-table",children:[(0,e.jsx)("thead",{children:(0,e.jsxs)("tr",{children:[(0,e.jsx)("th",{children:"Employee"}),(0,e.jsx)("th",{children:"Status"}),(0,e.jsx)("th",{className:"text-end",children:"Amount"}),(0,e.jsx)("th",{children:"Utilization"}),(0,e.jsx)("th",{className:"text-center",children:"Actions"})]})}),(0,e.jsx)("tbody",{children:M.map(s=>{const i=R(s.status,!1);return(0,e.jsxs)("tr",{children:[(0,e.jsx)("td",{children:(0,e.jsxs)("div",{className:"d-flex align-items-center gap-2",children:[(0,e.jsx)("span",{className:"mc-avatar",style:{background:`linear-gradient(135deg, ${n==="obsidian"?"#38bdf8":"#6366f1"}, ${n==="obsidian"?"#0ea5e9":"#8b5cf6"})`},children:s.initials}),(0,e.jsxs)("div",{children:[(0,e.jsx)("div",{className:"fw-semibold",style:{fontSize:"0.78rem"},children:s.name}),(0,e.jsx)("div",{style:{fontSize:"0.66rem",opacity:.65},children:s.role})]})]})}),(0,e.jsx)("td",{children:(0,e.jsxs)("span",{className:"mc-status-pill",style:{background:i.bg,color:i.fg},children:[(0,e.jsx)("span",{className:"mc-dot",style:{background:i.dot}}),s.status]})}),(0,e.jsx)("td",{className:"text-end fw-semibold",style:{fontSize:"0.78rem",fontFamily:"monospace"},children:s.amount}),(0,e.jsx)("td",{children:(0,e.jsxs)("div",{className:"d-flex align-items-center gap-2",children:[(0,e.jsx)("div",{className:"mc-progress",children:(0,e.jsx)("span",{style:{width:`${s.utilization}%`}})}),(0,e.jsxs)("span",{style:{fontSize:"0.66rem",opacity:.75},children:[s.utilization,"%"]})]})}),(0,e.jsx)("td",{className:"text-center",children:(0,e.jsxs)("div",{className:"mc-row-actions",children:[(0,e.jsx)("button",{title:"View",style:{color:"#3b82f6",background:"rgba(59,130,246,0.12)"},children:(0,e.jsx)(l,{icon:E})}),(0,e.jsx)("button",{title:"Edit",style:{color:"#f59e0b",background:"rgba(245,158,11,0.12)"},children:(0,e.jsx)(l,{icon:T})}),(0,e.jsx)("button",{title:"More",style:{color:"#64748b",background:"rgba(100,116,139,0.14)"},children:(0,e.jsx)(l,{icon:w})})]})})]},s.id)})})]})}),B=()=>{const{theme:n,addNotification:s}=$(),{themeId:i,setTheme:j}=A(),[y,b]=(0,_.useState)(null),t=n==="dark",v=t?"linear-gradient(135deg, #0f172a 0%, #111827 100%)":"linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",N=t?"rgba(30, 41, 59, 0.75)":"rgba(255, 255, 255, 0.85)",f=t?"rgba(255,255,255,0.08)":"#e2e8f0",o=t?"#f1f5f9":"#0f172a",d=t?"#94a3b8":"#64748b",S=a=>{b(a),setTimeout(()=>{j(a),b(null),s(`${x.find(m=>m.id===a)?.name||a} table theme applied across all data tables`,"success",3500,{title:"Table Theme Updated"})},300)};return(0,e.jsxs)("div",{style:{background:v,minHeight:"100vh",padding:"1.5rem",fontFamily:"'Inter', sans-serif"},children:[(0,e.jsx)("style",{children:`
        .tc-card {
          background: ${N};
          backdrop-filter: blur(24px) saturate(1.4);
          -webkit-backdrop-filter: blur(24px) saturate(1.4);
          border: 1px solid ${f};
          border-radius: 18px;
          box-shadow: ${t?"0 8px 32px rgba(0,0,0,0.3)":"0 8px 32px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.6)"};
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .tc-card:hover { transform: translateY(-6px); box-shadow: 0 24px 48px -12px rgba(0,0,0,0.18); }
        .tc-card-active {
          outline: 3px solid var(--mc-accent, #6366f1);
          outline-offset: 3px;
        }
        .tc-select-btn {
          border: none;
          border-radius: 12px;
          padding: 10px 18px;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
        }
        .tc-select-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
        .tc-swatch { width: 18px; height: 18px; border-radius: 6px; display: inline-block; }
        .tc-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 0.64rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          background: ${t?"rgba(99,102,241,0.15)":"rgba(99,102,241,0.08)"};
          color: ${t?"#a5b4fc":"#4f46e5"};
        }
        .tc-section-title { font-weight: 800; font-size: 1.05rem; margin: 0; }
        .tc-section-sub { font-size: 0.82rem; margin: 0; }
      `}),(0,e.jsxs)("div",{className:"tc-card mb-4 p-3 p-md-4 d-flex flex-column flex-md-row align-items-start align-items-md-center gap-3",children:[(0,e.jsx)("div",{className:"d-flex align-items-center justify-content-center rounded-3",style:{width:52,height:52,background:t?"rgba(99,102,241,0.15)":"rgba(99,102,241,0.1)",color:"#6366f1",fontSize:"1.2rem",flexShrink:0},children:(0,e.jsx)(l,{icon:p})}),(0,e.jsxs)("div",{className:"flex-grow-1",children:[(0,e.jsx)("h6",{className:"tc-section-title",style:{color:o},children:"Data Table Components"}),(0,e.jsx)("p",{className:"tc-section-sub mb-0",style:{color:d},children:"Select a premium table preset. The chosen design applies globally to every data table across the software."})]}),(0,e.jsxs)("span",{className:"tc-chip flex-shrink-0",children:[(0,e.jsx)(l,{icon:u,style:{fontSize:"0.6rem"}})," ",x.length," Enterprise Presets"]})]}),(0,e.jsx)("div",{className:"row g-3 mb-4",children:[{label:"Sticky gradient headers",icon:p},{label:"Smart zebra stripes",icon:g},{label:"Accent row hover",icon:h},{label:"Status pills + progress",icon:C}].map(a=>(0,e.jsx)("div",{className:"col-6 col-xl-3",children:(0,e.jsxs)("div",{className:"tc-card px-3 py-3 d-flex align-items-center gap-2 h-100",style:{borderRadius:"14px",background:t?"rgba(30,41,59,0.55)":"rgba(255,255,255,0.7)",border:`1px solid ${f}`},children:[(0,e.jsx)("span",{style:{color:"#6366f1",fontSize:"0.9rem",flexShrink:0},children:(0,e.jsx)(l,{icon:a.icon})}),(0,e.jsx)("span",{className:"small fw-semibold",style:{color:o},children:a.label})]})},a.label))}),(0,e.jsx)("div",{className:"row g-4",children:x.map(a=>{const m=i===a.id,r=y===a.id,c=m&&!r;return(0,e.jsx)("div",{className:"col-12 col-sm-6 col-xl-4",children:(0,e.jsxs)("div",{className:`tc-card p-4 h-100 ${c?"tc-card-active":""}`,style:c?{"--mc-accent":a.accent}:void 0,children:[(0,e.jsxs)("div",{className:"d-flex align-items-center justify-content-between mb-3",children:[(0,e.jsxs)("div",{className:"d-flex align-items-center gap-2",children:[(0,e.jsx)("span",{className:"tc-swatch",style:{background:`linear-gradient(135deg, ${a.accent}, ${a.accent}88)`}}),(0,e.jsx)("h6",{className:"mb-0 fw-bold",style:{color:o,fontSize:"1rem"},children:a.name})]}),c&&(0,e.jsxs)("span",{className:"tc-chip",style:{background:t?"rgba(16,185,129,0.15)":"rgba(16,185,129,0.1)",color:"#10b981"},children:[(0,e.jsx)(l,{icon:g,style:{fontSize:"0.55rem"}})," Active"]})]}),(0,e.jsx)("p",{className:"mb-3",style:{color:d,fontSize:"0.8rem",minHeight:"2.4rem"},children:a.description}),(0,e.jsx)(F,{themeId:a.id}),(0,e.jsxs)("div",{className:"mt-4 d-flex flex-wrap align-items-center justify-content-between gap-2",children:[(0,e.jsx)("span",{className:"small",style:{color:d,fontSize:"0.7rem"},children:a.tagline}),(0,e.jsxs)("button",{className:"tc-select-btn",style:{background:c?t?"#065f46":"#d1fae5":t?"rgba(99,102,241,0.85)":"#6366f1",color:c?"#059669":"#ffffff"},onClick:()=>S(a.id),disabled:r,children:[(0,e.jsx)(l,{icon:r?u:h,style:r?{animation:"tc-spin 0.6s linear infinite"}:void 0}),r?"Applying…":c?"Selected":"Select"]})]})]})},a.id)})}),(0,e.jsx)("style",{children:"@keyframes tc-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }"})]})};export{B as default};
