import{o as M}from"./rolldown-runtime-BXk0DNi4.js";import{Bl as R,Nl as L,_u as A}from"./ai-BaxCyuHK.js";import{At as $,Ct as D,Dt as g,H as _,P as I,Q as P,St as T,Tt as U,U as Y,Wt as B,X as H,Y as V,bt as W,et as q,ft as G,ht as K,lt as O,ot as b,pt as j,rt as Z,tt as Q,ut as f,xt as i}from"./superadmin-rQiSlNaa.js";import{i as X,r as J}from"./roles-DbbTndSg.js";var a=M(A(),1),e=R(),ie=()=>{const l=B(),{addNotification:n,confirmDialog:v}=L(),[o,y]=(0,a.useState)([]),[d,w]=(0,a.useState)([]),[N,c]=(0,a.useState)(!0),[m,x]=(0,a.useState)(null),F={FiShield:(0,e.jsx)(i,{}),FiUser:(0,e.jsx)(U,{}),FiStar:(0,e.jsx)(T,{}),FiBriefcase:(0,e.jsx)(Y,{}),FiCode:(0,e.jsx)(V,{}),FiCpu:(0,e.jsx)(P,{}),FiSettings:(0,e.jsx)(W,{}),FiZap:(0,e.jsx)($,{}),FiAward:(0,e.jsx)(_,{}),FiCommand:(0,e.jsx)(H,{}),FiGlobe:(0,e.jsx)(Z,{}),FiKey:(0,e.jsx)(b,{}),FiPhone:(0,e.jsx)(j,{}),FiPhoneCall:(0,e.jsx)(j,{}),FiMail:(0,e.jsx)(O,{}),FiMessageCircle:(0,e.jsx)(f,{}),FiMessageSquare:(0,e.jsx)(f,{})},k=s=>F[{phone:"FiPhone",call:"FiPhone",mail:"FiMail",email:"FiMail",chat:"FiMessageCircle",message:"FiMessageCircle"}[String(s||"").toLowerCase()]||s]||(0,e.jsx)(i,{});(0,a.useEffect)(()=>{p();const s=()=>x(null);return document.addEventListener("click",s),()=>document.removeEventListener("click",s)},[]);const p=async()=>{c(!0);try{const[s,t]=await Promise.all([X(),I()]);y(s),w(t)}catch(s){n("Failed to load data","danger"),console.log(s)}finally{c(!1)}},r=(0,a.useMemo)(()=>{const s={};return d.forEach(t=>{const u=t.roleId?`id:${t.roleId}`:`name:${t.role}`;s[u]=(s[u]||0)+1}),s},[d]),C=s=>r[`id:${s.id}`]||r[`name:${s.name}`]||0,E=()=>{l("/admin-dashboard/roles/add")},h=s=>{l(`/admin-dashboard/roles/edit/${s}`)},S=s=>{l(`/admin-dashboard/roles/edit/${s}`)},z=async s=>{if(await v({title:"Delete Role",message:"Are you sure you want to delete this role? This action cannot be undone.",variant:"danger",confirmLabel:"Yes, Delete"}))try{await J(s),n("Role deleted successfully","success"),p()}catch(t){n(t.message,"danger")}};return N?(0,e.jsx)("div",{className:"d-flex justify-content-center align-items-center",style:{height:"300px"},children:(0,e.jsx)("div",{className:"spinner-border text-primary",role:"status",children:(0,e.jsx)("span",{className:"visually-hidden",children:"Loading..."})})}):(0,e.jsxs)("div",{className:"container-fluid py-4",children:[(0,e.jsx)("div",{className:"row",children:(0,e.jsx)("div",{className:"col-xl-12",children:(0,e.jsxs)("div",{className:"card border-0 shadow-sm",children:[(0,e.jsxs)("div",{className:"card-header bg-transparent border-0 d-flex justify-content-between align-items-center pt-4 px-4",children:[(0,e.jsxs)("div",{children:[(0,e.jsx)("h5",{className:"mb-0 fw-bold",children:"Roles List"}),(0,e.jsx)("p",{className:"text-muted small mb-0",children:"Manage system roles and their descriptions."})]}),(0,e.jsxs)("button",{className:"btn btn-primary px-4 py-2 rounded-pill d-flex align-items-center gap-2 shadow-sm",onClick:E,children:[(0,e.jsx)(K,{})," Add New Role"]})]}),(0,e.jsx)("div",{className:"card-body px-4 pb-4",children:(0,e.jsxs)("div",{className:"row g-4 mt-1",children:[o.length===0&&(0,e.jsxs)("div",{className:"col-12 text-center py-5",children:[(0,e.jsx)(i,{size:48,className:"text-light mb-3"}),(0,e.jsx)("h5",{className:"text-muted",children:"No roles defined yet"}),(0,e.jsx)("p",{className:"text-muted small",children:"Start by creating your first system role."})]}),o.map(s=>(0,e.jsx)("div",{className:"col-md-6 col-lg-4",children:(0,e.jsxs)("div",{className:"role-card p-4 border-0 rounded-4 transition h-100 position-relative overflow-hidden group shadow-sm",style:{background:"rgba(255, 255, 255, 0.8)",backdropFilter:"blur(10px)",border:"1px solid rgba(255, 255, 255, 0.3)"},children:[(0,e.jsx)("div",{className:"position-absolute top-0 start-0 w-100",style:{height:"4px",background:s.color||"#4F46E5",opacity:.8}}),!s.status&&(0,e.jsx)("div",{className:"position-absolute top-0 end-0 bg-secondary text-white px-3 py-1 small fw-bold",style:{fontSize:"10px",borderBottomLeftRadius:"12px",zIndex:1},children:"INACTIVE"}),(0,e.jsxs)("div",{className:"d-flex justify-content-between align-items-start mb-4 position-relative z-1",children:[(0,e.jsxs)("div",{className:"d-flex align-items-center gap-3",children:[(0,e.jsx)("div",{className:"role-icon-container rounded-4 shadow-sm transition-all group-hover-bounce",style:{background:`linear-gradient(135deg, ${s.color||"#4F46E5"}15, ${s.color||"#4F46E5"}25)`,color:s.color||"#4F46E5",border:`1px solid ${s.color||"#4F46E5"}30`},children:a.cloneElement(k(s.icon),{size:40,strokeWidth:2.2})}),(0,e.jsxs)("div",{children:[(0,e.jsx)("h6",{className:"mb-0 fw-bold fs-5 text-dark",children:s.name}),(0,e.jsxs)("div",{className:"d-flex align-items-center gap-2 mt-1",children:[(0,e.jsxs)("span",{className:"badge rounded-pill px-2 py-1",style:{backgroundColor:`${s.color||"#4F46E5"}15`,color:s.color||"#4F46E5",fontSize:"10px",fontWeight:"800"},children:["LEVEL ",s.level||1]}),s.status&&(0,e.jsx)("span",{className:"status-dot pulse",style:{backgroundColor:"#10b981"}})]})]})]}),(0,e.jsxs)("div",{className:"position-absolute",style:{zIndex:10,top:"1px",right:"1px"},children:[(0,e.jsx)("button",{className:"btn btn-icon btn-white hover-scale",style:{width:"20px",height:"20px",padding:"0"},onClick:t=>{t.stopPropagation(),x(m===s.id?null:s.id)},children:(0,e.jsx)(G,{size:15,className:"text-muted"})}),m===s.id&&(0,e.jsxs)("div",{className:"dropdown-menu show dropdown-menu-end border-0 shadow-lg p-2 mt-2 transition-all",style:{right:"0",borderRadius:"12px",minWidth:"140px"},children:[(0,e.jsxs)("button",{className:"dropdown-item rounded-3 d-flex align-items-center gap-2 py-2",onClick:()=>S(s.id),children:[(0,e.jsx)(Q,{size:18,className:"text-primary"}),(0,e.jsx)("span",{className:"small fw-bold",children:"View Profile"})]}),(0,e.jsxs)("button",{className:"dropdown-item rounded-3 d-flex align-items-center gap-2 py-2",onClick:()=>h(s.id),children:[(0,e.jsx)(q,{size:18,className:"text-primary"}),(0,e.jsx)("span",{className:"small fw-bold",children:"Edit Role"})]}),(0,e.jsx)("div",{className:"dropdown-divider opacity-50"}),(0,e.jsxs)("button",{className:"dropdown-item rounded-3 d-flex align-items-center gap-2 py-2 text-danger",onClick:()=>z(s.id),children:[(0,e.jsx)(D,{size:18}),(0,e.jsx)("span",{className:"small fw-bold",children:"Delete Role"})]})]})]})]}),(0,e.jsx)("p",{className:"text-muted mb-4 line-clamp-3 fs-6",style:{minHeight:"4.5em",lineHeight:"1.6"},children:s.description||"No description provided for this role."}),(0,e.jsxs)("div",{className:"mt-auto pt-3 border-top d-flex align-items-center justify-content-between position-relative z-1",children:[(0,e.jsxs)("div",{className:"d-flex align-items-center gap-3",children:[(0,e.jsx)("div",{className:"avatar-group d-flex align-items-center",children:(0,e.jsx)("div",{className:"p-2 rounded-circle bg-light d-flex align-items-center justify-content-center border border-white",style:{width:"32px",height:"32px"},children:(0,e.jsx)(g,{size:14,className:"text-muted"})})}),(0,e.jsxs)("span",{className:"fw-bold small text-dark",children:[C(s)," Members"]})]}),(0,e.jsxs)("button",{className:"btn btn-sm px-3 rounded-pill fw-bold transition-all group-hover-px",style:{backgroundColor:`${s.color||"#4F46E5"}15`,color:s.color||"#4F46E5",border:"none"},onClick:()=>h(s.id),children:["Manage ",(0,e.jsx)(b,{className:"ms-1 small"})]})]}),(0,e.jsx)("div",{className:"position-absolute bottom-0 end-0 opacity-0 group-hover-opacity-10 transition-all",style:{width:"120px",height:"120px",background:`radial-gradient(circle, ${s.color||"#4F46E5"} 0%, transparent 70%)`,transform:"translate(30%, 30%)",zIndex:0}})]})},s.id)),!o.some(s=>s.name==="Admin")&&(0,e.jsx)("div",{className:"col-md-6 col-lg-4",children:(0,e.jsxs)("div",{className:"role-card p-4 border-0 rounded-4 bg-light position-relative h-100 shadow-sm overflow-hidden group",children:[(0,e.jsx)("div",{className:"position-absolute top-0 start-0 w-100 h-1",style:{height:"4px",background:"#64748b"}}),(0,e.jsx)("div",{className:"d-flex justify-content-between align-items-start mb-4",children:(0,e.jsxs)("div",{className:"d-flex align-items-center gap-3",children:[(0,e.jsx)("div",{className:"p-3 bg-white text-secondary rounded-4 shadow-sm group-hover-bounce transition-all",children:(0,e.jsx)(i,{size:28})}),(0,e.jsxs)("div",{children:[(0,e.jsx)("h6",{className:"mb-0 fw-bold fs-5",children:"Admin"}),(0,e.jsx)("span",{className:"badge rounded-pill px-2 py-1 mt-1",style:{backgroundColor:"#f1f5f9",color:"#64748b",fontSize:"10px",fontWeight:"800"},children:"SYSTEM ROLE"})]})]})}),(0,e.jsx)("p",{className:"text-muted mb-4 fs-6",style:{lineHeight:"1.6"},children:"Full access to all modules and system settings. This role is protected and cannot be modified."}),(0,e.jsxs)("div",{className:"mt-auto pt-3 border-top d-flex align-items-center gap-2",children:[(0,e.jsx)("div",{className:"p-2 rounded-circle bg-white d-flex align-items-center justify-content-center",style:{width:"32px",height:"32px"},children:(0,e.jsx)(g,{size:14,className:"text-muted"})}),(0,e.jsxs)("span",{className:"fw-bold small",children:[r["name:Admin"]||0," Members"]})]})]})})]})})]})})}),(0,e.jsx)("style",{dangerouslySetInnerHTML:{__html:`
        .role-card {
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
        }
        .role-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12) !important;
          background: rgba(255, 255, 255, 1) !important;
        }
        .group:hover .group-hover-actions {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .group-hover-actions {
          transform: translateY(-10px);
        }
        .group:hover .group-hover-bounce {
          transform: scale(1.1) translateY(-2px);
        }
        .group:hover .group-hover-px {
          padding-left: 1.5rem !important;
          padding-right: 1.5rem !important;
        }
        .hover-scale:hover {
          transform: scale(1.1);
        }
        .btn-icon {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          background: white;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          display: inline-block;
        }
        .pulse {
          box-shadow: 0 0 0 rgba(16, 185, 129, 0.4);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        .role-icon-container {
          width: 104px;
          height: 104px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 104px;
          transition: all 0.3s ease;
        }
        .role-icon-container svg {
          width: 56px !important;
          height: 56px !important;
          stroke-width: 2.5;
        }
      `}})]})};export{ie as default};
