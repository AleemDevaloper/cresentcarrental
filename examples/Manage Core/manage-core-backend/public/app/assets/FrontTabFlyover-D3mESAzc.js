import{o as q}from"./rolldown-runtime-BXk0DNi4.js";import{Na as W,Nu as C,X as D,Yl as G,nu as K,ql as N,zc as U}from"./ai-DR6Ec0oK.js";var i=q(C(),1),t=K(),j=(e,l,c)=>Math.min(Math.max(e,l),c),B=e=>typeof e=="number"?e:typeof e=="string"&&parseInt(e,10)||380,V=({isOpen:e,onClose:l,title:c,children:Y,width:z="390px",index:f=0,anchorRect:a=null,hoverOpen:d=!1})=>{const{isSidebarOpen:E}=G(),b=(0,i.useRef)(null),[g,I]=(0,i.useState)(e),[_,u]=(0,i.useState)(!1),[y,x]=(0,i.useState)({top:72,left:96,pointerTop:28,side:"left"}),m=(0,i.useMemo)(()=>B(z),[z]);if((0,i.useEffect)(()=>{if(e){I(!0),u(!1);const o=setTimeout(()=>u(!0),16);return()=>clearTimeout(o)}u(!1);const r=setTimeout(()=>I(!1),300);return()=>clearTimeout(r)},[e]),(0,i.useEffect)(()=>{if(!e||f>0||d)return;const r=document.body.style.overflow;return document.body.style.overflow="hidden",()=>{document.body.style.overflow=r}},[e,f,d]),(0,i.useEffect)(()=>{if(!e)return;const r=o=>{o.key==="Escape"&&l()};return window.addEventListener("keydown",r),()=>window.removeEventListener("keydown",r)},[e,l]),(0,i.useEffect)(()=>{if(!e||!d)return;const r=o=>{const p=b.current,s=document.querySelector(".sidebarcol"),v=p&&p.contains(o.target),n=s&&s.contains(o.target);!v&&!n&&l()};return document.addEventListener("click",r),()=>document.removeEventListener("click",r)},[e,d,l]),(0,i.useLayoutEffect)(()=>{if(!g)return;const r=()=>{const s=window.innerWidth,v=window.innerHeight,n=s<768?12:16,h=a?0:f*18,k=b.current?.offsetHeight||Math.round(v*.72),H=Math.max(n,v-k-n);if(s<768){x({top:n,left:n,pointerTop:24,side:"none"});return}const P=E?Math.min(Math.max(s*.1667,230),340):80,X=a?.height||42,S=a?a.top+X/2:v*.25,$=a?a.top:S-k*.2,w=j(Math.round($),n,H),L=j(Math.round(S-w),24,k-24),M=a?.right?a.right+10+h:P+18+h,A=M+m+n<=s,T=a?.left?a.left-m-10-h:n;if(A||!(T>=n)){x({top:w,left:j(Math.round(M),n,s-m-n),pointerTop:L,side:"left"});return}x({top:w,left:Math.round(T),pointerTop:L,side:"right"})};r();let o=null;const p=()=>{o||(o=requestAnimationFrame(()=>{o=null,r()}))};return window.addEventListener("resize",p),window.addEventListener("scroll",p,!0),()=>{o&&cancelAnimationFrame(o),window.removeEventListener("resize",p),window.removeEventListener("scroll",p,!0)}},[g,a,m,E,f]),!g)return null;const F={"--flyover-width":`${m}px`,"--flyover-top":`${y.top}px`,"--flyover-left":`${y.left}px`,"--pointer-top":`${y.pointerTop}px`,zIndex:1070+f*4};return(0,t.jsxs)(t.Fragment,{children:[f===0&&!d&&(0,t.jsx)("button",{type:"button",className:`front-flyover-scrim ${e?"is-open":""}`,onClick:l,"aria-label":"Close tab flyover"}),(0,t.jsxs)("section",{ref:b,className:`front-flyover-panel ${_?"is-open":"is-closing"} pointer-${y.side}`,style:F,role:"dialog","aria-modal":f===0?"true":"false","aria-label":c,children:[(0,t.jsx)("span",{className:"front-flyover-pointer","aria-hidden":"true"}),(0,t.jsxs)("header",{className:"front-flyover-header",children:[(0,t.jsxs)("div",{className:"front-flyover-title-wrap",children:[(0,t.jsx)("span",{className:"front-flyover-title-icon",children:(0,t.jsx)(N,{icon:f>0?D:W})}),(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{children:"Navigation"}),(0,t.jsx)("h6",{children:c})]})]}),(0,t.jsx)("button",{type:"button",className:"front-flyover-close",onClick:l,"aria-label":"Close flyover",children:(0,t.jsx)(N,{icon:U})})]}),(0,t.jsx)("div",{className:"front-flyover-content",children:Y},c)]}),(0,t.jsx)("style",{children:`
        .front-flyover-scrim {
          position: fixed;
          inset: 0;
          border: 0;
          background: rgba(15, 23, 42, 0.18);
          backdrop-filter: blur(2px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 260ms ease;
          z-index: 1068;
        }

        .front-flyover-scrim.is-open {
          opacity: 1;
          pointer-events: auto;
        }

        .front-flyover-panel {
          position: fixed;
          top: var(--flyover-top);
          left: var(--flyover-left);
          width: min(var(--flyover-width), calc(100vw - 24px));
          max-height: min(720px, calc(100vh - 24px));
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(148, 163, 184, 0.28);
          border-radius: 14px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.94)),
            var(--sidebar-bg, #ffffff);
          color: var(--sidebar-text, #0f172a);
          box-shadow: 0 28px 70px rgba(15, 23, 42, 0.24), 0 1px 0 rgba(255,255,255,0.7) inset;
          overflow: visible;
          transform-origin: left var(--pointer-top);
          transition:
            opacity 240ms ease,
            transform 300ms cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 220ms ease;
          will-change: transform, opacity;
        }

        .front-flyover-panel.pointer-right {
          transform-origin: right var(--pointer-top);
        }

        .front-flyover-panel.is-open {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
          animation: flyoverPanelSettle 240ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .front-flyover-panel.is-closing {
          opacity: 0;
          transform: translate3d(-24px, 8px, 0) scale(0.955);
          pointer-events: none;
        }

        .front-flyover-panel.pointer-right.is-closing {
          transform: translate3d(24px, 8px, 0) scale(0.955);
        }

        .front-flyover-pointer {
          position: absolute;
          top: var(--pointer-top);
          width: 16px;
          height: 16px;
          background: rgba(255, 255, 255, 0.96);
          border-left: 1px solid rgba(148, 163, 184, 0.28);
          border-bottom: 1px solid rgba(148, 163, 184, 0.28);
          transform: translateY(-50%) rotate(45deg);
          z-index: 0;
        }

        .front-flyover-panel.pointer-left .front-flyover-pointer {
          left: -8px;
        }

        .front-flyover-panel.pointer-right .front-flyover-pointer {
          right: -8px;
          transform: translateY(-50%) rotate(225deg);
        }

        .front-flyover-panel.pointer-none .front-flyover-pointer {
          display: none;
        }

        .front-flyover-header {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 14px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.2);
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.08), rgba(20, 184, 166, 0.08));
          border-radius: 14px 14px 0 0;
        }

        .front-flyover-panel.is-open .front-flyover-header {
          animation: flyoverHeaderIn 200ms cubic-bezier(0.16, 1, 0.3, 1) 20ms both;
        }

        .front-flyover-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .front-flyover-title-icon {
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: rgba(79, 70, 229, 0.12);
          color: #4f46e5;
          flex: 0 0 auto;
        }

        .front-flyover-title-wrap p {
          margin: 0 0 2px;
          color: #64748b;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.7px;
          text-transform: uppercase;
        }

        .front-flyover-title-wrap h6 {
          margin: 0;
          color: #0f172a;
          font-size: 14px;
          font-weight: 800;
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .front-flyover-close {
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(148, 163, 184, 0.28);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.72);
          color: #475569;
          transition: transform 160ms ease, background 160ms ease, color 160ms ease;
          flex: 0 0 auto;
        }

        .front-flyover-close:hover {
          background: #ffffff;
          color: #0f172a;
          transform: translateY(-1px);
        }

        .front-flyover-content {
          position: relative;
          z-index: 1;
          padding: 10px;
          overflow: auto;
          scrollbar-width: thin;
        }

        .front-flyover-panel.is-open .front-flyover-content {
          animation: flyoverContentIn 220ms cubic-bezier(0.16, 1, 0.3, 1) 30ms both;
        }

        .front-flyover-content .nav {
          gap: 4px;
        }

        .front-flyover-content .nav-link {
          width: 100% !important;
          margin: 0 !important;
          padding: 10px !important;
          border: 1px solid transparent !important;
          border-radius: 10px !important;
          background: transparent !important;
          color: #334155 !important;
          box-shadow: none !important;
          opacity: 1;
          transform: none;
          transition:
            background 160ms ease,
            border-color 160ms ease,
            color 160ms ease,
            transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .front-flyover-content .nav-link:hover,
        .front-flyover-content .nav-link.active {
          background: rgba(79, 70, 229, 0.08) !important;
          border-color: rgba(79, 70, 229, 0.16) !important;
          color: #0f172a !important;
          transform: translateX(4px);
        }

        .front-flyover-panel.pointer-right .front-flyover-content .nav-link:hover,
        .front-flyover-panel.pointer-right .front-flyover-content .nav-link.active {
          transform: translateX(-4px);
        }

        .front-flyover-panel.is-open .front-flyover-content .nav-link {
          animation: flyoverItemIn 240ms cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        .front-flyover-panel.is-open .front-flyover-content .nav-link:nth-child(1) { animation-delay: 20ms; }
        .front-flyover-panel.is-open .front-flyover-content .nav-link:nth-child(2) { animation-delay: 40ms; }
        .front-flyover-panel.is-open .front-flyover-content .nav-link:nth-child(3) { animation-delay: 60ms; }
        .front-flyover-panel.is-open .front-flyover-content .nav-link:nth-child(4) { animation-delay: 80ms; }
        .front-flyover-panel.is-open .front-flyover-content .nav-link:nth-child(5) { animation-delay: 100ms; }
        .front-flyover-panel.is-open .front-flyover-content .nav-link:nth-child(n + 6) { animation-delay: 110ms; }

        .front-flyover-content .nav-link.active::after {
          display: none !important;
        }

        .front-flyover-content .side-icon-wrapper {
          width: 28px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: rgba(15, 23, 42, 0.06);
          color: #4f46e5 !important;
          margin: 0 !important;
          flex: 0 0 auto;
        }

        .front-flyover-content .navlable {
          color: inherit !important;
          font-size: 13px !important;
          font-weight: 700 !important;
          white-space: normal;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dark-mode .front-flyover-panel {
          background:
            linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(2, 6, 23, 0.96)),
            var(--sidebar-dark-bg, #0f172a);
          border-color: rgba(148, 163, 184, 0.16);
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.48);
        }

        .dark-mode .front-flyover-pointer {
          background: rgba(15, 23, 42, 0.98);
          border-color: rgba(148, 163, 184, 0.16);
        }

        .dark-mode .front-flyover-header {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.16), rgba(20, 184, 166, 0.09));
          border-bottom-color: rgba(148, 163, 184, 0.14);
        }

        .dark-mode .front-flyover-title-wrap h6 {
          color: #f8fafc;
        }

        .dark-mode .front-flyover-title-wrap p {
          color: #94a3b8;
        }

        .dark-mode .front-flyover-close {
          background: rgba(15, 23, 42, 0.72);
          border-color: rgba(148, 163, 184, 0.18);
          color: #cbd5e1;
        }

        .dark-mode .front-flyover-content .nav-link {
          color: #cbd5e1 !important;
        }

        .dark-mode .front-flyover-content .nav-link:hover,
        .dark-mode .front-flyover-content .nav-link.active {
          background: rgba(99, 102, 241, 0.16) !important;
          border-color: rgba(99, 102, 241, 0.24) !important;
          color: #ffffff !important;
        }

        @keyframes flyoverPanelSettle {
          0% { opacity: 0; transform: translate3d(-18px, 4px, 0) scale(0.97); }
          70% { opacity: 1; transform: translate3d(1px, 0, 0) scale(1.001); }
          100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        }

        .front-flyover-panel.pointer-right.is-open {
          animation-name: flyoverPanelSettleRight;
        }

        @keyframes flyoverPanelSettleRight {
          0% { opacity: 0; transform: translate3d(18px, 4px, 0) scale(0.97); }
          70% { opacity: 1; transform: translate3d(-1px, 0, 0) scale(1.001); }
          100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        }

        @keyframes flyoverHeaderIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes flyoverContentIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes flyoverItemIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .front-flyover-panel.pointer-right .front-flyover-content .nav-link {
          animation-name: flyoverItemInRight;
        }

        @keyframes flyoverItemInRight {
          from { opacity: 0; transform: translateX(8px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .front-flyover-panel,
          .front-flyover-pointer,
          .front-flyover-scrim,
          .front-flyover-content .nav-link {
            animation: none !important;
            transition: none !important;
          }

          .front-flyover-panel,
          .front-flyover-content .nav-link {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }

        .dark-mode .front-flyover-content .side-icon-wrapper {
          background: rgba(255, 255, 255, 0.08);
          color: #a5b4fc !important;
        }

        @media (max-width: 767.98px) {
          .front-flyover-panel {
            top: 12px !important;
            left: 12px !important;
            width: calc(100vw - 24px) !important;
            max-height: calc(100vh - 24px);
            border-radius: 14px;
          }
        }
      `})]})};export{V as t};
