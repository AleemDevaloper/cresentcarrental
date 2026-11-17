const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./jspdf.es.min-DsfW4CU3.js","./ai-BHgPkVLC.js","./rolldown-runtime-Bq5D3eIA.js","./dms-CGB1dD8h.js","./typeof-UpO9RiFk.js"])))=>i.map(i=>d[i]);
import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $r as faFileWord, $t as faCheckCircle, Ao as faPrint, Ar as faFileAlt, Br as faFileExport, Cn as faClock, Ct as faBuilding, Dl as require_jsx_runtime, Er as faEye, G as faArrowUp, Gn as faCopy, Ia as faMinus, In as faCog, Jt as faChartBar, M as faArrowDown, Nt as faCalendarAlt, Qt as faCheck, Ui as faHistory, Wr as faFileInvoiceDollar, Xt as faChartPie, Yt as faChartLine, _c as faTrash, b as DialogBox, bl as useApp, d as useTranslation, da as faLayerGroup, dc as faTimesCircle, et as faBalanceScale, fr as faEdit, gs as faShieldHalved, in as faChevronRight, ir as faDollarSign, jc as faUniversity, jt as faCalculator, nn as faChevronDown, os as faSearch, qr as faFilePdf, ra as faInfoCircle, rn as faChevronLeft, ro as faPaperPlane, ru as require_react, sr as faDownload, ti as faFilter, uc as faTimes, ut as faBook, vl as FontAwesomeIcon, xi as faGlobe, xn as faClipboardCheck, xr as faExchangeAlt, zr as faFileExcel } from "./ai-BHgPkVLC.js";
import { Yr as exportToExcel } from "./fms-BQz62Xux.js";
import { ft as __vitePreload } from "./dms-CGB1dD8h.js";
import { c as resetPersistedData, f as FxImportDropdown, l as softDeleteRecord, s as loadEntityList, u as writeEntityList } from "./mfg-B8oKSbEg.js";
//#region src/pages/systems/FX/FxRevaluations.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var STEP_TRANSITIONS = `
  .glass-card {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(24px) saturate(1.4);
    -webkit-backdrop-filter: blur(24px) saturate(1.4);
    border: 1px solid rgba(255,255,255,0.8);
    box-shadow: 0 8px 32px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.6);
  }
  :root.dark .glass-card {
    background: rgba(30, 41, 59, 0.75);
    border: 1px solid rgba(255,255,255,0.06);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  }
  .premium-card { transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: default; }
  .premium-card:hover { transform: translateY(-8px) scale(1.012); box-shadow: 0 32px 64px -16px rgba(0,0,0,0.18), 0 0 0 1px rgba(139,92,246,0.08); }
  .premium-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 12px; border-radius: 100px; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.02em; }
  .premium-badge .badge-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
  .premium-btn { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); position: relative; overflow: hidden; }
  .premium-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
  .premium-action-btn { width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; border: none; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer; }
  .premium-action-btn:hover { transform: scale(1.15); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
  .premium-analytic-card { transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer; }
  .premium-analytic-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 16px 40px -8px rgba(0,0,0,0.12); }
  .premium-report-card { transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer; }
  .premium-report-card:hover { transform: translateY(-6px) scale(1.03); box-shadow: 0 20px 48px -12px rgba(0,0,0,0.15); }
  .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; }
  .section-header .accent-bar { width: 3px; height: 20px; border-radius: 2px; flex-shrink: 0; }
  .section-header h6 { margin: 0; font-weight: 700; font-size: 0.9rem; }
  @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  .enter-anim { animation: fadeSlideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; opacity: 0; }
  .enter-anim:nth-child(1) { animation-delay: 0.03s; }
  .enter-anim:nth-child(2) { animation-delay: 0.06s; }
  .enter-anim:nth-child(3) { animation-delay: 0.09s; }
  .enter-anim:nth-child(4) { animation-delay: 0.12s; }
  .enter-anim:nth-child(5) { animation-delay: 0.15s; }
  .enter-anim:nth-child(6) { animation-delay: 0.18s; }
  .enter-anim:nth-child(7) { animation-delay: 0.21s; }
  .enter-anim:nth-child(8) { animation-delay: 0.24s; }
  @keyframes revPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(139,92,246,0.4); } 50% { box-shadow: 0 0 0 8px rgba(139,92,246,0); } }
  @keyframes revShimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 100px; }
  ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
  :root.dark ::-webkit-scrollbar-thumb { background: #334155; }
  :root.dark ::-webkit-scrollbar-thumb:hover { background: #475569; }

  /* Preserved step transition animations */
  @keyframes fxStepEnter { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes fxStepLeave { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(-30px); } }
  @keyframes fxFadeSlideUp { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fxBounceIn { 0% { opacity: 0; transform: scale(0.9); } 50% { transform: scale(1.02); } 100% { opacity: 1; transform: scale(1); } }
  .fx-step-enter { animation: fxStepEnter 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
  .fx-step-leave { animation: fxStepLeave 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
  .fx-fade-slide-up { animation: fxFadeSlideUp 0.5s ease forwards; opacity: 0; }
  .fx-fade-slide-up:nth-child(1) { animation-delay: 0.05s; }
  .fx-fade-slide-up:nth-child(2) { animation-delay: 0.1s; }
  .fx-fade-slide-up:nth-child(3) { animation-delay: 0.15s; }
  .fx-fade-slide-up:nth-child(4) { animation-delay: 0.2s; }
  .fx-fade-slide-up:nth-child(5) { animation-delay: 0.25s; }
  .fx-fade-slide-up:nth-child(6) { animation-delay: 0.3s; }
  .fx-modal-overlay { animation: fxFadeSlideUp 0.25s ease forwards; }
  .fx-modal-content { animation: fxBounceIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
  .rev-step-circle { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); position: relative; z-index: 2; }
  .rev-step-circle.active { animation: revPulse 1.5s ease-in-out infinite; }
  .rev-step-connector { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
  .rev-input:focus { border-color: #8b5cf6 !important; box-shadow: 0 0 0 3px rgba(139,92,246,0.15) !important; outline: none; }
  .rev-select:focus { border-color: #8b5cf6 !important; box-shadow: 0 0 0 3px rgba(139,92,246,0.15) !important; outline: none; }
  .premium-report-card:hover .rev-report-icon { transform: scale(1.15) rotate(-5deg); }
  .premium-report-card:hover .rev-report-gen { opacity: 1; transform: translateY(0); }
  .rev-report-icon { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); display: inline-block; }
  .rev-report-gen { opacity: 0.85; transition: all 0.3s ease; }
  .fx-table-container::-webkit-scrollbar { width: 6px; height: 6px; }
`;
var statusConfig = {
	Draft: {
		bg: "#f1f5f9",
		color: "#64748b",
		icon: faClock,
		dot: "#94a3b8"
	},
	Pending: {
		bg: "#fef9c3",
		color: "#ca8a04",
		icon: faClock,
		dot: "#eab308"
	},
	Approved: {
		bg: "#dcfce7",
		color: "#16a34a",
		icon: faCheckCircle,
		dot: "#22c55e"
	},
	Posted: {
		bg: "#dbeafe",
		color: "#2563eb",
		icon: faPaperPlane,
		dot: "#3b82f6"
	},
	Finalized: {
		bg: "#f3e8ff",
		color: "#9333ea",
		icon: faClipboardCheck,
		dot: "#a855f7"
	},
	Failed: {
		bg: "#fee2e2",
		color: "#dc2626",
		icon: faTimesCircle,
		dot: "#ef4444"
	}
};
var getExportData = (data) => {
	return data.map((r) => ({
		"Revaluation No": r.id,
		"Date": r.date,
		"Company": r.company,
		"Branch": r.branch,
		"Currency": r.currency,
		"Old Rate": r.oldRate,
		"New Rate": r.newRate,
		"Diff": r.diff,
		"Gain": r.gain,
		"Loss": r.loss,
		"Status": r.status,
		"Created By": r.createdBy
	}));
};
var FxRevaluations = ({ isDark }) => {
	const { t } = useTranslation();
	const { addNotification } = useApp();
	resetPersistedData("fx", [
		"currency",
		"exchange_rate",
		"transaction",
		"transaction_audit",
		"revaluation",
		"exchange_rate_last_sync"
	]);
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [editingRevaluation, setEditingRevaluation] = (0, import_react.useState)(null);
	const [deletingRevaluation, setDeletingRevaluation] = (0, import_react.useState)(null);
	const [currentStep, setCurrentStep] = (0, import_react.useState)(1);
	const [stepTransition, setStepTransition] = (0, import_react.useState)("");
	const [filters, setFilters] = (0, import_react.useState)({
		company: "all",
		branch: "all",
		status: "all",
		currency: "all"
	});
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [selectedRows, setSelectedRows] = (0, import_react.useState)([]);
	const [showFilterPanel, setShowFilterPanel] = (0, import_react.useState)(false);
	const [showExportDropdown, setShowExportDropdown] = (0, import_react.useState)(false);
	const exportDropdownRef = (0, import_react.useRef)(null);
	(0, import_react.useRef)(null);
	const [previewingRev, setPreviewingRev] = (0, import_react.useState)(null);
	const [confirmAction, setConfirmAction] = (0, import_react.useState)(null);
	const [printPayload, setPrintPayload] = (0, import_react.useState)(null);
	const [currentPage, setCurrentPage] = (0, import_react.useState)(1);
	const [pageSize] = (0, import_react.useState)(8);
	(0, import_react.useEffect)(() => {
		const handleClickOutside = (event) => {
			if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) setShowExportDropdown(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	const handleExportExcel = () => {
		exportToExcel(getExportData(filteredData), `fx-revaluations-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.xlsx`);
		if (addNotification) addNotification("Revaluations exported to Excel successfully!", "success");
	};
	const handleExportPdf = async () => {
		const { default: jsPDF } = await __vitePreload(async () => {
			const { default: jsPDF } = await import("./jspdf.es.min-DsfW4CU3.js");
			return { default: jsPDF };
		}, __vite__mapDeps([0,1,2,3,4]), import.meta.url);
		const { default: autoTable } = await __vitePreload(async () => {
			const { default: autoTable } = await import("./jspdf.plugin.autotable-DzpCqTnK.js");
			return { default: autoTable };
		}, [], import.meta.url);
		const dateStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		const doc = new jsPDF({
			orientation: "landscape",
			unit: "mm",
			format: "a4"
		});
		const primaryColor = [
			139,
			92,
			246
		];
		const textColor = [
			30,
			41,
			59
		];
		const mutedColor = [
			100,
			116,
			139
		];
		doc.setFontSize(20);
		doc.setTextColor(...primaryColor);
		doc.text("Currency Revaluations Report", 14, 18);
		doc.setFontSize(10);
		doc.setTextColor(...mutedColor);
		doc.text(`Manage Core - FX Module | Generated on ${(/* @__PURE__ */ new Date()).toLocaleString()}`, 14, 25);
		doc.text(`Total Records: ${filteredData.length}`, 14, 30);
		autoTable(doc, {
			startY: 35,
			head: [[
				"No",
				"Date",
				"Company",
				"Branch",
				"Currency",
				"Old Rate",
				"New Rate",
				"Diff",
				"Gain",
				"Loss",
				"Status",
				"Created By"
			]],
			body: filteredData.map((r) => [
				r.id,
				r.date,
				r.company,
				r.branch,
				r.currency,
				r.oldRate,
				r.newRate,
				r.diff,
				r.gain,
				r.loss,
				r.status,
				r.createdBy
			]),
			theme: "grid",
			styles: {
				fontSize: 8,
				cellPadding: 3,
				textColor,
				lineColor: [
					226,
					232,
					240
				],
				lineWidth: .3
			},
			headStyles: {
				fillColor: primaryColor,
				textColor: [
					255,
					255,
					255
				],
				fontStyle: "bold",
				fontSize: 8
			},
			alternateRowStyles: { fillColor: [
				248,
				250,
				252
			] },
			columnStyles: {
				4: { fontStyle: "bold" },
				7: {
					fontStyle: "bold",
					textColor: (data) => {
						const val = data.cell.raw;
						return val && val.startsWith("+") ? [
							22,
							163,
							74
						] : [
							220,
							38,
							38
						];
					}
				},
				8: { textColor: (data) => {
					return data.cell.raw !== "-" ? [
						22,
						163,
						74
					] : [
						100,
						116,
						139
					];
				} },
				9: { textColor: (data) => {
					return data.cell.raw !== "-" ? [
						220,
						38,
						38
					] : [
						100,
						116,
						139
					];
				} }
			},
			didDrawPage: (data) => {
				const pageCount = doc.internal.getNumberOfPages();
				doc.setFontSize(8);
				doc.setTextColor(...mutedColor);
				doc.text(`Page ${data.pageNumber} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: "center" });
			}
		});
		doc.save(`fx-revaluations-${dateStr}.pdf`);
		if (addNotification) addNotification("Revaluations exported to PDF successfully!", "success");
	};
	const handleExportDocx = () => {
		const dateStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		const rowsHtml = filteredData.map((r) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ccc;">${r.id}</td>
        <td style="padding: 8px; border: 1px solid #ccc;">${r.date}</td>
        <td style="padding: 8px; border: 1px solid #ccc;">${r.company}</td>
        <td style="padding: 8px; border: 1px solid #ccc;">${r.branch}</td>
        <td style="padding: 8px; border: 1px solid #ccc;"><b>${r.currency}</b></td>
        <td style="padding: 8px; border: 1px solid #ccc;">${r.oldRate}</td>
        <td style="padding: 8px; border: 1px solid #ccc;">${r.newRate}</td>
        <td style="padding: 8px; border: 1px solid #ccc;">${r.diff}</td>
        <td style="padding: 8px; border: 1px solid #ccc;">${r.gain}</td>
        <td style="padding: 8px; border: 1px solid #ccc;">${r.loss}</td>
        <td style="padding: 8px; border: 1px solid #ccc;">${r.status}</td>
        <td style="padding: 8px; border: 1px solid #ccc;">${r.createdBy}</td>
      </tr>
    `).join("");
		const docxHtml = `
      <html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>Currency Revaluations Report</title>
      <style>
        body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; color: #1e293b; }
        h2 { color: #8b5cf6; margin-bottom: 4px; }
        .sub { color: #64748b; font-size: 9pt; margin-bottom: 16px; }
        table { border-collapse: collapse; width: 100%; font-size: 10pt; }
        th { background-color: #8b5cf6; color: white; border: 1px solid #8b5cf6; padding: 8px; text-align: left; }
        td { border: 1px solid #ddd; padding: 8px; }
      </style>
      </head>
      <body>
        <h2>Currency Revaluations Report</h2>
        <div class="sub">Generated on ${(/* @__PURE__ */ new Date()).toLocaleString()} | Total Records: ${filteredData.length}</div>
        <table>
          <thead>
            <tr>
              <th>Revaluation No</th>
              <th>Date</th>
              <th>Company</th>
              <th>Branch</th>
              <th>Currency</th>
              <th>Old Rate</th>
              <th>New Rate</th>
              <th>Diff</th>
              <th>Gain</th>
              <th>Loss</th>
              <th>Status</th>
              <th>Created By</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </body>
      </html>
    `;
		const blob = new Blob(["﻿" + docxHtml], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `fx-revaluations-${dateStr}.docx`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		if (addNotification) addNotification("Revaluations exported to DOCX successfully!", "success");
	};
	const handleExportWord = () => {
		const dateStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		const rowsHtml = filteredData.map((r) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ccc;">${r.id}</td>
        <td style="padding: 8px; border: 1px solid #ccc;">${r.date}</td>
        <td style="padding: 8px; border: 1px solid #ccc;">${r.company}</td>
        <td style="padding: 8px; border: 1px solid #ccc;">${r.branch}</td>
        <td style="padding: 8px; border: 1px solid #ccc;"><b>${r.currency}</b></td>
        <td style="padding: 8px; border: 1px solid #ccc;">${r.oldRate}</td>
        <td style="padding: 8px; border: 1px solid #ccc;">${r.newRate}</td>
        <td style="padding: 8px; border: 1px solid #ccc;">${r.diff}</td>
        <td style="padding: 8px; border: 1px solid #ccc;">${r.gain}</td>
        <td style="padding: 8px; border: 1px solid #ccc;">${r.loss}</td>
        <td style="padding: 8px; border: 1px solid #ccc;">${r.status}</td>
        <td style="padding: 8px; border: 1px solid #ccc;">${r.createdBy}</td>
      </tr>
    `).join("");
		const wordHtml = `
      <html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>Currency Revaluations Report</title>
      <style>
        body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; color: #111; }
        h2 { color: #10b981; margin-bottom: 4px; }
        .sub { color: #555; font-size: 9pt; margin-bottom: 16px; }
        table { border-collapse: collapse; width: 100%; font-size: 10pt; }
        th { background-color: #10b981; color: white; border: 1px solid #10b981; padding: 8px; text-align: left; }
        td { border: 1px solid #ddd; padding: 8px; }
      </style>
      </head>
      <body>
        <h2>Currency Revaluations Summary</h2>
        <div class="sub">Generated on ${(/* @__PURE__ */ new Date()).toLocaleString()} | Total Records: ${filteredData.length}</div>
        <table>
          <thead>
            <tr>
              <th>Revaluation No</th>
              <th>Date</th>
              <th>Company</th>
              <th>Branch</th>
              <th>Currency</th>
              <th>Old Rate</th>
              <th>New Rate</th>
              <th>Diff</th>
              <th>Gain</th>
              <th>Loss</th>
              <th>Status</th>
              <th>Created By</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </body>
      </html>
    `;
		const blob = new Blob(["﻿" + wordHtml], { type: "application/msword" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `fx-revaluations-${dateStr}.doc`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		if (addNotification) addNotification("Revaluations exported to Word document successfully!", "success");
	};
	const containerBg = isDark ? "#1a1d29" : "#F8FAFC";
	const cardBg = isDark ? "#232736" : "#ffffff";
	const textColor = isDark ? "#e2e8f0" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "#2d3248" : "#e2e8f0";
	const accountsByCurrency = {
		USD: [
			"USD Cash Account",
			"USD Receivable Account",
			"USD Payable Account",
			"Bank USD Current Account"
		],
		EUR: [
			"EUR Cash Account",
			"EUR Receivable Account",
			"EUR Payable Account",
			"Bank EUR Current Account"
		],
		GBP: [
			"GBP Cash Account",
			"GBP Receivable Account",
			"GBP Payable Account",
			"Bank GBP Current Account"
		],
		AED: [
			"AED Cash Account",
			"AED Receivable Account",
			"AED Payable Account",
			"Bank AED Current Account"
		],
		SAR: [
			"SAR Cash Account",
			"SAR Receivable Account",
			"SAR Payable Account",
			"Bank SAR Current Account"
		],
		JPY: [
			"JPY Cash Account",
			"JPY Receivable Account",
			"JPY Payable Account",
			"Bank JPY Current Account"
		],
		CAD: [
			"CAD Cash Account",
			"CAD Receivable Account",
			"CAD Payable Account",
			"Bank CAD Current Account"
		],
		AUD: [
			"AUD Cash Account",
			"AUD Receivable Account",
			"AUD Payable Account",
			"Bank AUD Current Account"
		],
		CHF: [
			"CHF Cash Account",
			"CHF Receivable Account",
			"CHF Payable Account",
			"Bank CHF Current Account"
		],
		CNY: [
			"CNY Cash Account",
			"CNY Receivable Account",
			"CNY Payable Account",
			"Bank CNY Current Account"
		]
	};
	const initialRevaluations = [];
	const [formData, setFormData] = (0, import_react.useState)({
		company: "",
		branch: "",
		currency: "",
		selectedAccounts: [],
		currentRate: "",
		newRate: "",
		approveRevaluation: false,
		postJournalEntry: false
	});
	const [revaluations, setRevaluations] = (0, import_react.useState)(() => loadEntityList("fx", "revaluation", initialRevaluations));
	import_react.useEffect(() => {
		writeEntityList("fx", "revaluation", revaluations);
	}, [revaluations]);
	const companies = (0, import_react.useMemo)(() => [...new Set(revaluations.map((r) => r.company).filter(Boolean))], [revaluations]);
	const branches = (0, import_react.useMemo)(() => [...new Set(revaluations.map((r) => r.branch).filter(Boolean))], [revaluations]);
	const currencies = (0, import_react.useMemo)(() => [...new Set(revaluations.map((r) => r.currency).filter(Boolean))], [revaluations]);
	const filteredData = (0, import_react.useMemo)(() => {
		return revaluations.filter((r) => {
			const matchSearch = !searchQuery || r.id.toLowerCase().includes(searchQuery.toLowerCase()) || r.company.toLowerCase().includes(searchQuery.toLowerCase()) || r.currency.toLowerCase().includes(searchQuery.toLowerCase()) || r.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
			const matchCompany = filters.company === "all" || r.company === filters.company;
			const matchBranch = filters.branch === "all" || r.branch === filters.branch;
			const matchStatus = filters.status === "all" || r.status === filters.status;
			const matchCurrency = filters.currency === "all" || r.currency === filters.currency;
			return matchSearch && matchCompany && matchBranch && matchStatus && matchCurrency;
		});
	}, [
		revaluations,
		searchQuery,
		filters
	]);
	const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
	const pageData = (0, import_react.useMemo)(() => {
		const start = (currentPage - 1) * pageSize;
		return filteredData.slice(start, start + pageSize);
	}, [
		filteredData,
		currentPage,
		pageSize
	]);
	import_react.useEffect(() => {
		setCurrentPage(1);
	}, [searchQuery, filters]);
	const analyticsData = (0, import_react.useMemo)(() => {
		const totalGain = revaluations.reduce((sum, r) => {
			const v = parseFloat((r.gain || "0").replace(/[^0-9.-]/g, ""));
			return sum + (isNaN(v) ? 0 : v);
		}, 0);
		const totalLoss = revaluations.reduce((sum, r) => {
			const v = parseFloat((r.loss || "0").replace(/[^0-9.-]/g, ""));
			return sum + (isNaN(v) ? 0 : v);
		}, 0);
		const currencyCount = new Set(revaluations.map((r) => r.currency)).size;
		const pendingCount = revaluations.filter((r) => ["Draft", "Pending"].includes(r.status)).length;
		return [
			{
				icon: faGlobe,
				label: "Currency Exposure",
				value: revaluations.length ? `PKR ${totalGain.toLocaleString(void 0, { maximumFractionDigits: 0 })}` : "0",
				trend: totalGain > 0 ? `+${totalGain.toLocaleString(void 0, { maximumFractionDigits: 0 })}` : "—",
				trendDir: totalGain > 0 ? "up" : "neutral",
				color: "#3b82f6"
			},
			{
				icon: faExchangeAlt,
				label: "Revaluation Records",
				value: String(revaluations.length),
				trend: `${currencyCount} currencies`,
				trendDir: "up",
				color: "#10b981"
			},
			{
				icon: faChartLine,
				label: "Net Gain / Loss",
				value: `PKR ${(totalGain - totalLoss).toLocaleString(void 0, { maximumFractionDigits: 0 })}`,
				trend: totalGain - totalLoss >= 0 ? "+" : "-",
				trendDir: totalGain - totalLoss >= 0 ? "up" : "down",
				color: "#f59e0b"
			},
			{
				icon: faBalanceScale,
				label: "Total Gain",
				value: `PKR ${totalGain.toLocaleString(void 0, { maximumFractionDigits: 0 })}`,
				trend: "+",
				trendDir: "up",
				color: "#8b5cf6"
			},
			{
				icon: faChartPie,
				label: "Total Loss",
				value: `PKR ${totalLoss.toLocaleString(void 0, { maximumFractionDigits: 0 })}`,
				trend: "+",
				trendDir: "up",
				color: "#06b6d4"
			},
			{
				icon: faUniversity,
				label: "Pending Revaluations",
				value: String(pendingCount),
				trend: "awaiting approval",
				trendDir: "neutral",
				color: "#f97316"
			}
		];
	}, [revaluations]);
	const reports = [
		{
			icon: faFileInvoiceDollar,
			label: "Currency Revaluation Report",
			color: "#3b82f6"
		},
		{
			icon: faExchangeAlt,
			label: "Exchange Difference Report",
			color: "#10b981"
		},
		{
			icon: faChartLine,
			label: "Unrealized Gain Report",
			color: "#8b5cf6"
		},
		{
			icon: faArrowDown,
			label: "Unrealized Loss Report",
			color: "#ef4444"
		},
		{
			icon: faBook,
			label: "General Ledger Impact",
			color: "#f59e0b"
		},
		{
			icon: faShieldHalved,
			label: "Audit Report",
			color: "#06b6d4"
		}
	];
	const handleOpenForm = (revaluation = null) => {
		setEditingRevaluation(revaluation);
		setCurrentStep(1);
		setStepTransition("");
		setFormData({
			company: revaluation?.company || "",
			branch: revaluation?.branch || "",
			currency: revaluation?.currency || "",
			selectedAccounts: [],
			currentRate: revaluation?.oldRate || "",
			newRate: revaluation?.newRate || "",
			approveRevaluation: false,
			postJournalEntry: false
		});
		setShowForm(true);
	};
	const handleCloseForm = () => {
		setShowForm(false);
		setEditingRevaluation(null);
		setCurrentStep(1);
	};
	const handleStepChange = (step) => {
		setStepTransition("fx-step-leave");
		setTimeout(() => {
			setCurrentStep(step);
			setStepTransition("fx-step-enter");
		}, 150);
	};
	const handleNext = () => {
		if (currentStep < 3) handleStepChange(currentStep + 1);
	};
	const handlePrev = () => {
		if (currentStep > 1) handleStepChange(currentStep - 1);
	};
	const toggleAccount = (acc) => {
		setFormData((prev) => ({
			...prev,
			selectedAccounts: prev.selectedAccounts.includes(acc) ? prev.selectedAccounts.filter((a) => a !== acc) : [...prev.selectedAccounts, acc]
		}));
	};
	const toggleSelectAll = () => {
		const accounts = accountsByCurrency[formData.currency] || [];
		setFormData((prev) => ({
			...prev,
			selectedAccounts: prev.selectedAccounts.length === accounts.length ? [] : [...accounts]
		}));
	};
	const handleSelectRow = (id) => {
		setSelectedRows((prev) => prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]);
	};
	const handleSelectAllRows = () => {
		setSelectedRows((prev) => prev.length === filteredData.length ? [] : filteredData.map((r) => r.id));
	};
	const handlePreview = (rev = null) => {
		const target = rev || filteredData.find((r) => selectedRows.includes(r.id)) || filteredData[0] || null;
		if (target) setPreviewingRev(target);
	};
	const handleApprove = (rev) => {
		setConfirmAction({
			rev,
			action: "approve"
		});
	};
	const handleReject = (rev) => {
		setConfirmAction({
			rev,
			action: "reject"
		});
	};
	const confirmStatusChange = () => {
		if (!confirmAction) return;
		const { rev, action } = confirmAction;
		const newStatus = action === "approve" ? "Approved" : "Failed";
		setRevaluations((prev) => prev.map((r) => r.id === rev.id ? {
			...r,
			status: newStatus
		} : r));
		addNotification?.(`Revaluation "${rev.id}" ${action === "approve" ? "approved" : "rejected"}.`, action === "approve" ? "success" : "error");
		setConfirmAction(null);
	};
	const handleCopy = (rev) => {
		const now = /* @__PURE__ */ new Date();
		const newId = `${rev.id.replace(/-(\d+)$/, "") || "REV"}-${String(now.getTime()).slice(-5)}`;
		const copy = {
			...rev,
			id: newId,
			date: now.toISOString().split("T")[0],
			status: "Draft",
			createdBy: "Admin"
		};
		setRevaluations((prev) => [copy, ...prev]);
		addNotification?.(`Revaluation "${rev.id}" copied as "${newId}".`, "success");
	};
	const handleImport = (rows) => {
		if (!Array.isArray(rows) || rows.length === 0) {
			addNotification?.("No importable records found in the file.", "error");
			return;
		}
		const now = /* @__PURE__ */ new Date();
		const newRev = rows.filter((row) => row && (row["Revaluation No"] || row.id || row.revaluationNo)).map((row, idx) => {
			const oldRate = Number(row["Old Rate"] || row.oldRate || 0);
			const newRate = Number(row["New Rate"] || row.newRate || 0);
			const diff = Number((newRate - oldRate).toFixed(2));
			const gain = row["Gain"] || row.gain || "-";
			const loss = row["Loss"] || row.loss || "-";
			return {
				id: row["Revaluation No"] || row.id || `REV-IMP-${now.getTime()}-${idx}`,
				date: row["Date"] || row.date || now.toISOString().split("T")[0],
				company: row["Company"] || row.company || "Company A",
				branch: row["Branch"] || row.branch || "Head Office",
				currency: row["Currency"] || row.currency || "USD",
				oldRate: oldRate.toFixed(2),
				newRate: newRate.toFixed(2),
				diff: `${diff >= 0 ? "+" : ""}${diff.toFixed(2)}`,
				gain,
				loss,
				status: row["Status"] || row.status || "Draft",
				createdBy: "Import"
			};
		}).filter((r) => r.oldRate > 0 || r.newRate > 0);
		if (newRev.length === 0) {
			addNotification?.("No valid revaluation rows found in the file.", "error");
			return;
		}
		setRevaluations((prev) => [...newRev, ...prev]);
		addNotification?.(`Imported ${newRev.length} revaluation record(s).`, "success");
	};
	const handlePrint = (payload) => {
		setPrintPayload(null);
		setTimeout(() => {
			setPrintPayload(payload);
			setTimeout(() => {
				window.print();
			}, 250);
		}, 50);
	};
	const handleFinalize = () => {
		if (!formData.company || !formData.branch || !formData.currency) {
			addNotification?.("Please complete all configuration fields before finalizing.", "error");
			return;
		}
		const now = /* @__PURE__ */ new Date();
		const oldRate = parseFloat(formData.currentRate) || 0;
		const newRate = parseFloat(formData.newRate) || 0;
		const diff = newRate - oldRate;
		const previewRows = formData.selectedAccounts.map((acc) => {
			return (1e4 + acc.split("").reduce((s, ch) => s + ch.charCodeAt(0), 0) % 4e4) * (newRate - oldRate);
		});
		const totalGainVal = previewRows.reduce((sum, d) => sum + (d > 0 ? d : 0), 0);
		const totalLossVal = Math.abs(previewRows.reduce((sum, d) => sum + (d < 0 ? d : 0), 0));
		const gain = totalGainVal > 0 ? `PKR ${Math.round(totalGainVal).toLocaleString()}` : "-";
		const loss = totalLossVal > 0 ? `PKR ${Math.round(totalLossVal).toLocaleString()}` : "-";
		const record = {
			id: editingRevaluation?.id || `REV-2025-${String(now.getTime()).slice(-4)}`,
			date: editingRevaluation?.date || now.toISOString().split("T")[0],
			company: formData.company,
			branch: formData.branch,
			currency: formData.currency,
			oldRate: oldRate.toFixed(2),
			newRate: newRate.toFixed(2),
			diff: `${diff >= 0 ? "+" : ""}${diff.toFixed(2)}`,
			gain,
			loss,
			status: formData.approveRevaluation ? "Approved" : formData.postJournalEntry ? "Posted" : "Draft",
			createdBy: editingRevaluation?.createdBy || "Admin"
		};
		if (editingRevaluation) {
			setRevaluations((prev) => prev.map((r) => r.id === record.id ? record : r));
			addNotification?.(`Revaluation "${record.id}" updated successfully.`, "success");
		} else {
			setRevaluations((prev) => [record, ...prev]);
			addNotification?.(`Revaluation "${record.id}" created successfully.`, "success");
		}
		handleCloseForm();
	};
	const handleGenerateReport = (report) => {
		handlePrint({
			type: "list",
			items: filteredData,
			title: report.label
		});
		addNotification?.(`${report.label} generated.`, "success");
	};
	const getStatusBadge = (status) => {
		const cfg = statusConfig[status] || statusConfig.Draft;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "premium-badge",
			style: {
				background: cfg.bg,
				color: cfg.color
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "badge-dot",
					style: { background: cfg.dot }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
					icon: cfg.icon,
					style: { fontSize: "0.55rem" }
				}),
				status
			]
		});
	};
	const StepIndicator = ({ step, label, icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "d-flex align-items-center gap-2",
		style: { opacity: currentStep === step ? 1 : currentStep > step ? .7 : .4 },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `rev-step-circle ${currentStep >= step ? "active" : ""}`,
			style: {
				width: 36,
				height: 36,
				borderRadius: "50%",
				background: currentStep >= step ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : borderColor,
				color: "#fff",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				fontSize: "0.78rem",
				fontWeight: 700,
				transition: "all 0.3s ease",
				boxShadow: currentStep >= step ? "0 2px 12px rgba(139,92,246,0.3)" : "none"
			},
			children: currentStep > step ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
				icon: faCheck,
				style: { fontSize: "0.65rem" }
			}) : step
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "d-none d-md-block",
			style: {
				fontSize: "0.72rem",
				color: currentStep === step ? textColor : mutedColor,
				fontWeight: currentStep === step ? 600 : 400,
				lineHeight: 1.2
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
				icon,
				className: "me-1",
				style: { fontSize: "0.6rem" }
			}), label]
		})]
	});
	const TrendIcon = ({ dir }) => {
		if (dir === "up") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
			icon: faArrowUp,
			style: {
				color: "#16a34a",
				fontSize: "0.7rem"
			}
		});
		if (dir === "down") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
			icon: faArrowDown,
			style: {
				color: "#dc2626",
				fontSize: "0.7rem"
			}
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
			icon: faMinus,
			style: {
				color: "#94a3b8",
				fontSize: "0.7rem"
			}
		});
	};
	const renderStepContent = () => {
		const stepContentStyle = {
			padding: "1.25rem",
			background: isDark ? "#1e2232" : "#f8fafc",
			borderRadius: "12px",
			border: `1px solid ${borderColor}`,
			minHeight: "300px"
		};
		switch (currentStep) {
			case 1: return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: stepTransition,
				style: {
					...stepContentStyle,
					background: isDark ? "#1e2232" : "#ffffff",
					borderTop: "3px solid #8b5cf6"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
						style: {
							color: textColor,
							fontSize: "0.9rem",
							fontWeight: 600,
							marginBottom: "1rem"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faBuilding,
							className: "me-2",
							style: { color: "#8b5cf6" }
						}), "Select Configuration"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row g-3 mb-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									style: {
										color: mutedColor,
										fontSize: "0.8rem",
										fontWeight: 500,
										marginBottom: "0.35rem",
										display: "block"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faBuilding,
										className: "me-1"
									}), " Company"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "form-select form-select-sm rev-select",
									style: {
										borderRadius: "10px",
										borderColor,
										color: textColor,
										background: cardBg,
										fontSize: "0.8rem"
									},
									value: formData.company,
									onChange: (e) => setFormData((p) => ({
										...p,
										company: e.target.value
									})),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Select Company"
									}), companies.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c,
										children: c
									}, c))]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									style: {
										color: mutedColor,
										fontSize: "0.8rem",
										fontWeight: 500,
										marginBottom: "0.35rem",
										display: "block"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faLayerGroup,
										className: "me-1"
									}), " Branch"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "form-select form-select-sm rev-select",
									style: {
										borderRadius: "10px",
										borderColor,
										color: textColor,
										background: cardBg,
										fontSize: "0.8rem"
									},
									value: formData.branch,
									onChange: (e) => setFormData((p) => ({
										...p,
										branch: e.target.value
									})),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Select Branch"
									}), branches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: b,
										children: b
									}, b))]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									style: {
										color: mutedColor,
										fontSize: "0.8rem",
										fontWeight: 500,
										marginBottom: "0.35rem",
										display: "block"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faDollarSign,
										className: "me-1"
									}), " Currency"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "form-select form-select-sm rev-select",
									style: {
										borderRadius: "10px",
										borderColor,
										color: textColor,
										background: cardBg,
										fontSize: "0.8rem"
									},
									value: formData.currency,
									onChange: (e) => setFormData((p) => ({
										...p,
										currency: e.target.value,
										selectedAccounts: []
									})),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Select Currency"
									}), currencies.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c,
										children: c
									}, c))]
								})]
							})
						]
					}),
					formData.currency && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: { marginTop: "1rem" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex justify-content-between align-items-center mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									style: {
										color: mutedColor,
										fontSize: "0.8rem",
										fontWeight: 500
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faUniversity,
										className: "me-1"
									}), " Select Accounts"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-sm border-0",
									style: {
										fontSize: "0.7rem",
										color: "#8b5cf6",
										borderRadius: "8px",
										fontWeight: 500
									},
									onClick: toggleSelectAll,
									children: formData.selectedAccounts.length === (accountsByCurrency[formData.currency] || []).length ? "Deselect All" : "Select All"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									maxHeight: "200px",
									overflowY: "auto",
									padding: "4px 0"
								},
								children: (accountsByCurrency[formData.currency] || []).map((acc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-2 py-1 px-2",
									style: {
										borderRadius: "8px",
										cursor: "pointer",
										transition: "background 0.15s",
										background: formData.selectedAccounts.includes(acc) ? "rgba(139,92,246,0.08)" : "transparent"
									},
									onClick: () => toggleAccount(acc),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											width: 16,
											height: 16,
											borderRadius: "4px",
											border: `2px solid ${formData.selectedAccounts.includes(acc) ? "#8b5cf6" : borderColor}`,
											background: formData.selectedAccounts.includes(acc) ? "#8b5cf6" : "transparent",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											transition: "all 0.15s",
											flexShrink: 0
										},
										children: formData.selectedAccounts.includes(acc) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faCheck,
											style: {
												color: "#fff",
												fontSize: "0.45rem"
											}
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											color: textColor,
											fontSize: "0.8rem"
										},
										children: acc
									})]
								}, acc))
							}),
							formData.selectedAccounts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									marginTop: "0.5rem",
									fontSize: "0.7rem",
									color: mutedColor
								},
								children: [formData.selectedAccounts.length, " account(s) selected"]
							})
						]
					})
				]
			});
			case 2: return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: stepTransition,
				style: {
					...stepContentStyle,
					background: isDark ? "#1e2232" : "#ffffff",
					borderTop: "3px solid #8b5cf6"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
						style: {
							color: textColor,
							fontSize: "0.9rem",
							fontWeight: 600,
							marginBottom: "1rem"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faExchangeAlt,
							className: "me-2",
							style: { color: "#8b5cf6" }
						}), "Exchange Rate Adjustment"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row g-3 mb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-md-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								style: {
									color: mutedColor,
									fontSize: "0.8rem",
									fontWeight: 500,
									marginBottom: "0.35rem",
									display: "block"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faHistory,
									className: "me-1"
								}), " Current Exchange Rate"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "input-group input-group-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "input-group-text",
									style: {
										background: cardBg,
										borderColor,
										color: mutedColor,
										fontSize: "0.75rem"
									},
									children: formData.currency || "?"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									step: "0.01",
									className: "form-control rev-input",
									style: {
										borderRadius: "0 10px 10px 0",
										borderColor,
										color: textColor,
										background: cardBg,
										fontSize: "0.8rem"
									},
									value: formData.currentRate,
									onChange: (e) => setFormData((p) => ({
										...p,
										currentRate: e.target.value
									})),
									placeholder: "0.00"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-md-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								style: {
									color: mutedColor,
									fontSize: "0.8rem",
									fontWeight: 500,
									marginBottom: "0.35rem",
									display: "block"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faDollarSign,
									className: "me-1"
								}), " New Exchange Rate"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "input-group input-group-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "input-group-text",
									style: {
										background: cardBg,
										borderColor,
										color: mutedColor,
										fontSize: "0.75rem"
									},
									children: formData.currency || "?"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									step: "0.01",
									className: "form-control rev-input",
									style: {
										borderRadius: "0 10px 10px 0",
										borderColor,
										color: textColor,
										background: cardBg,
										fontSize: "0.8rem"
									},
									value: formData.newRate,
									onChange: (e) => setFormData((p) => ({
										...p,
										newRate: e.target.value
									})),
									placeholder: "0.00"
								})]
							})]
						})]
					}),
					formData.currentRate && formData.newRate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: { marginTop: "1rem" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							style: {
								color: mutedColor,
								fontSize: "0.8rem",
								fontWeight: 500,
								marginBottom: "0.5rem",
								display: "block"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faCalculator,
								className: "me-1"
							}), " Preview Changes"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "table-responsive",
							style: {
								borderRadius: "10px",
								border: `1px solid ${borderColor}`,
								overflow: "hidden"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "table mc-table align-middle mb-0",
								style: { fontSize: "0.78rem" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									style: {
										background: isDark ? "#1a1d29" : "#f1f5f9",
										color: mutedColor
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "fw-medium",
											style: { padding: "8px 12px" },
											children: "Account"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "fw-medium",
											style: { padding: "8px 12px" },
											children: "Balance"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "fw-medium",
											style: { padding: "8px 12px" },
											children: "Old Rate"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "fw-medium",
											style: { padding: "8px 12px" },
											children: "New Rate"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "fw-medium",
											style: { padding: "8px 12px" },
											children: "Old Value (PKR)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "fw-medium",
											style: { padding: "8px 12px" },
											children: "New Value (PKR)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "fw-medium",
											style: { padding: "8px 12px" },
											children: "Difference"
										})
									]
								}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: formData.selectedAccounts.map((acc, i) => {
									const balance = (1e4 + acc.split("").reduce((s, ch) => s + ch.charCodeAt(0), 0) % 4e4).toFixed(2);
									const oldVal = (parseFloat(balance) * parseFloat(formData.currentRate)).toFixed(2);
									const newVal = (parseFloat(balance) * parseFloat(formData.newRate)).toFixed(2);
									const diff = (parseFloat(newVal) - parseFloat(oldVal)).toFixed(2);
									const isGain = parseFloat(diff) >= 0;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										style: {
											borderBottom: i < formData.selectedAccounts.length - 1 ? `1px solid ${borderColor}` : "none",
											borderLeft: `3px solid ${isGain ? "#16a34a" : "#dc2626"}`
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												style: {
													padding: "8px 12px",
													color: textColor
												},
												children: acc
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												style: {
													padding: "8px 12px",
													color: mutedColor
												},
												children: [
													parseFloat(balance).toLocaleString(),
													" ",
													formData.currency
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												style: {
													padding: "8px 12px",
													color: textColor
												},
												children: formData.currentRate
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												style: {
													padding: "8px 12px",
													color: textColor
												},
												children: formData.newRate
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												style: {
													padding: "8px 12px",
													color: mutedColor
												},
												children: ["PKR ", parseFloat(oldVal).toLocaleString()]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												style: {
													padding: "8px 12px",
													color: mutedColor
												},
												children: ["PKR ", parseFloat(newVal).toLocaleString()]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												style: {
													padding: "8px 12px",
													color: isGain ? "#16a34a" : "#dc2626",
													fontWeight: 600
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "d-inline-flex align-items-center gap-1",
													children: [
														isGain ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: faArrowUp,
															style: { fontSize: "0.55rem" }
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: faArrowDown,
															style: { fontSize: "0.55rem" }
														}),
														isGain ? "+" : "",
														"PKR ",
														parseFloat(diff).toLocaleString()
													]
												})
											})
										]
									}, acc);
								}) })]
							})
						})]
					})
				]
			});
			case 3:
				const previewRows = formData.selectedAccounts.map((acc) => {
					const balance = 1e4 + acc.split("").reduce((s, ch) => s + ch.charCodeAt(0), 0) % 4e4;
					const oldVal = balance * (parseFloat(formData.currentRate) || 0);
					return balance * (parseFloat(formData.newRate) || 0) - oldVal;
				});
				const totalGain = previewRows.reduce((sum, d) => sum + (d > 0 ? d : 0), 0);
				const totalLoss = Math.abs(previewRows.reduce((sum, d) => sum + (d < 0 ? d : 0), 0));
				const netPosition = totalGain - totalLoss;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: stepTransition,
					style: {
						...stepContentStyle,
						background: isDark ? "#1e2232" : "#ffffff",
						borderTop: "3px solid #8b5cf6"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
							style: {
								color: textColor,
								fontSize: "0.9rem",
								fontWeight: 600,
								marginBottom: "1rem"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faClipboardCheck,
								className: "me-2",
								style: { color: "#8b5cf6" }
							}), "Review & Finalize"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-3 mb-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "premium-card glass-card",
										style: {
											padding: "1rem",
											borderRadius: "10px",
											background: "rgba(16,185,129,0.08)",
											border: "1px solid rgba(16,185,129,0.2)"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												color: mutedColor,
												fontSize: "0.7rem"
											},
											children: "Total Gain"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												style: {
													width: 28,
													height: 28,
													borderRadius: "8px",
													background: "linear-gradient(135deg, #16a34a, #22c55e)",
													display: "flex",
													alignItems: "center",
													justifyContent: "center"
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faArrowUp,
													style: {
														color: "#fff",
														fontSize: "0.6rem"
													}
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												style: {
													color: "#16a34a",
													fontSize: "1.2rem",
													fontWeight: 700
												},
												children: ["PKR ", totalGain.toLocaleString()]
											})]
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "premium-card glass-card",
										style: {
											padding: "1rem",
											borderRadius: "10px",
											background: "rgba(220,38,38,0.08)",
											border: "1px solid rgba(220,38,38,0.2)"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												color: mutedColor,
												fontSize: "0.7rem"
											},
											children: "Total Loss"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												style: {
													width: 28,
													height: 28,
													borderRadius: "8px",
													background: "linear-gradient(135deg, #dc2626, #ef4444)",
													display: "flex",
													alignItems: "center",
													justifyContent: "center"
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faArrowDown,
													style: {
														color: "#fff",
														fontSize: "0.6rem"
													}
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												style: {
													color: "#dc2626",
													fontSize: "1.2rem",
													fontWeight: 700
												},
												children: ["PKR ", totalLoss.toLocaleString()]
											})]
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "premium-card glass-card",
										style: {
											padding: "1rem",
											borderRadius: "10px",
											background: `rgba(${netPosition >= 0 ? "16,185,129" : "220,38,38"},0.08)`,
											border: `1px solid rgba(${netPosition >= 0 ? "16,185,129" : "220,38,38"},0.2)`
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												color: mutedColor,
												fontSize: "0.7rem"
											},
											children: "Net Position"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												style: {
													width: 28,
													height: 28,
													borderRadius: "8px",
													background: netPosition >= 0 ? "linear-gradient(135deg, #16a34a, #22c55e)" : "linear-gradient(135deg, #dc2626, #ef4444)",
													display: "flex",
													alignItems: "center",
													justifyContent: "center"
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: netPosition >= 0 ? faArrowUp : faArrowDown,
													style: {
														color: "#fff",
														fontSize: "0.6rem"
													}
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												style: {
													color: netPosition >= 0 ? "#16a34a" : "#dc2626",
													fontSize: "1.2rem",
													fontWeight: 700
												},
												children: [
													netPosition >= 0 ? "+" : "",
													"PKR ",
													netPosition.toLocaleString()
												]
											})]
										})]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								padding: "1rem",
								borderRadius: "10px",
								background: isDark ? "#1a1d29" : "#f1f5f9",
								marginBottom: "1rem"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-3 flex-wrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "0.5rem",
										cursor: "pointer"
									},
									onClick: () => setFormData((p) => ({
										...p,
										approveRevaluation: !p.approveRevaluation
									})),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											width: 18,
											height: 18,
											borderRadius: "4px",
											border: `2px solid ${formData.approveRevaluation ? "#8b5cf6" : borderColor}`,
											background: formData.approveRevaluation ? "#8b5cf6" : "transparent",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											transition: "all 0.15s",
											flexShrink: 0
										},
										children: formData.approveRevaluation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faCheck,
											style: {
												color: "#fff",
												fontSize: "0.5rem"
											}
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											color: textColor,
											fontSize: "0.82rem"
										},
										children: "Approve Revaluation"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										alignItems: "center",
										gap: "0.5rem",
										cursor: "pointer"
									},
									onClick: () => setFormData((p) => ({
										...p,
										postJournalEntry: !p.postJournalEntry
									})),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											width: 18,
											height: 18,
											borderRadius: "4px",
											border: `2px solid ${formData.postJournalEntry ? "#8b5cf6" : borderColor}`,
											background: formData.postJournalEntry ? "#8b5cf6" : "transparent",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											transition: "all 0.15s",
											flexShrink: 0
										},
										children: formData.postJournalEntry && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faCheck,
											style: {
												color: "#fff",
												fontSize: "0.5rem"
											}
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											color: textColor,
											fontSize: "0.82rem"
										},
										children: "Post Journal Entry"
									})]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								padding: "0.75rem",
								borderRadius: "10px",
								background: "rgba(139,92,246,0.06)",
								border: "1px solid rgba(139,92,246,0.15)"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faInfoCircle,
									style: {
										color: "#8b5cf6",
										fontSize: "0.8rem",
										marginTop: "2px"
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										fontSize: "0.75rem",
										color: mutedColor
									},
									children: [
										"This will create a currency revaluation entry for ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
											style: { color: textColor },
											children: [formData.selectedAccounts.length, " account(s)"]
										}),
										formData.currency ? ` in ${formData.currency}` : "",
										".",
										formData.postJournalEntry ? " A corresponding journal entry will also be posted to the general ledger." : ""
									]
								})]
							})
						})
					]
				});
			default: return null;
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			background: containerBg,
			minHeight: "100vh",
			padding: "clamp(0.75rem, 3vw, 1.5rem)",
			fontFamily: "'Inter', sans-serif"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: STEP_TRANSITIONS }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex flex-wrap justify-content-between align-items-start mb-4",
				style: {
					position: "relative",
					zIndex: 110
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center gap-3 mb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						width: 4,
						height: 32,
						borderRadius: "2px",
						background: "linear-gradient(180deg, #8b5cf6, #6d28d9)",
						flexShrink: 0
					} }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
						className: "fw-bold mb-1",
						style: {
							color: textColor,
							fontSize: "1.4rem"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faCalculator,
							className: "me-2",
							style: { color: "#8b5cf6" }
						}), "Currency Revaluations"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-0 d-flex align-items-center gap-1",
						style: {
							color: mutedColor,
							fontSize: "0.85rem"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faInfoCircle,
							style: {
								fontSize: "0.7rem",
								color: "#8b5cf6"
							}
						}), "Manage and execute currency revaluations across companies, branches, and accounts."]
					})] })]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex flex-wrap gap-2 mt-2 mt-lg-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-sm border-0 premium-btn d-flex align-items-center gap-1",
							style: {
								borderRadius: "10px",
								background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
								color: "#fff",
								fontSize: "0.78rem",
								padding: "6px 14px"
							},
							onClick: () => handleOpenForm(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCalculator }), " Run Revaluation"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-sm border-0 premium-btn",
							style: {
								borderRadius: "10px",
								background: isDark ? "#2d3248" : "#f1f5f9",
								color: textColor,
								fontSize: "0.78rem",
								padding: "6px 14px"
							},
							onClick: () => handlePreview(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faEye,
								className: "me-1"
							}), " Preview"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-sm border-0 premium-btn",
							style: {
								borderRadius: "10px",
								background: isDark ? "#2d3248" : "#f1f5f9",
								color: textColor,
								fontSize: "0.78rem",
								padding: "6px 14px"
							},
							onClick: () => {
								const target = filteredData.find((r) => selectedRows.includes(r.id)) || filteredData.find((r) => ["Draft", "Pending"].includes(r.status));
								if (target) handleApprove(target);
								else addNotification?.("No pending revaluation available to approve.", "error");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faCheckCircle,
								className: "me-1"
							}), " Approve"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-sm border-0 premium-btn d-flex align-items-center gap-1",
							style: {
								borderRadius: "10px",
								background: isDark ? "#2d3248" : "#f1f5f9",
								color: textColor,
								fontSize: "0.78rem",
								padding: "6px 14px"
							},
							onClick: () => handlePrint({
								type: "list",
								items: filteredData,
								title: "Currency Revaluations Report"
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faPrint,
								className: "me-1"
							}), " Print"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FxImportDropdown, {
							title: "Currency Revaluations",
							isDark,
							addNotification,
							onImport: handleImport,
							buttonStyle: {
								borderRadius: "10px",
								background: "linear-gradient(135deg, #3b82f6, #2563eb)",
								color: "#fff",
								fontSize: "0.78rem",
								padding: "6px 14px",
								boxShadow: "0 4px 12px rgba(59,130,246,0.2)",
								cursor: "pointer"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "position-relative d-inline-block",
							ref: exportDropdownRef,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-sm border-0 premium-btn d-flex align-items-center gap-2",
								style: {
									borderRadius: "10px",
									background: "linear-gradient(135deg, #10b981, #059669)",
									color: "#fff",
									fontSize: "0.78rem",
									padding: "6px 14px",
									boxShadow: "0 4px 12px rgba(16,185,129,0.2)",
									cursor: "pointer"
								},
								onClick: () => setShowExportDropdown((prev) => !prev),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFileExport }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Export" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faChevronDown,
										style: {
											fontSize: "0.65rem",
											transition: "transform 0.2s",
											transform: showExportDropdown ? "rotate(180deg)" : "rotate(0deg)"
										}
									})
								]
							}), showExportDropdown && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "position-absolute end-0 mt-2 shadow-lg rounded-3 py-2",
								style: {
									zIndex: 1e3,
									minWidth: "190px",
									background: cardBg,
									border: `1px solid ${borderColor}`,
									backdropFilter: "blur(16px)",
									animation: "fxBounceIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
									boxShadow: isDark ? "0 10px 30px rgba(0,0,0,0.5)" : "0 10px 30px rgba(0,0,0,0.12)"
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "px-3 py-1 mb-1 border-bottom",
										style: { borderColor: `${borderColor}` },
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											className: "fw-bold text-uppercase",
											style: {
												fontSize: "0.65rem",
												color: mutedColor,
												letterSpacing: "0.05em"
											},
											children: "Export Format"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "dropdown-item d-flex align-items-center gap-2 px-3 py-2 border-0 bg-transparent text-start w-100",
										style: {
											color: textColor,
											fontSize: "0.8rem",
											cursor: "pointer",
											transition: "background 0.15s"
										},
										onMouseEnter: (e) => e.currentTarget.style.background = isDark ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.08)",
										onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
										onClick: () => {
											handleExportPdf();
											setShowExportDropdown(false);
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-2 d-flex align-items-center justify-content-center",
											style: {
												width: 26,
												height: 26,
												background: "#fee2e2",
												color: "#ef4444"
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faFilePdf,
												style: { fontSize: "0.75rem" }
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "fw-semibold",
											style: { lineHeight: 1.2 },
											children: "PDF Document"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											style: {
												fontSize: "0.68rem",
												color: mutedColor
											},
											children: ".pdf format"
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "dropdown-item d-flex align-items-center gap-2 px-3 py-2 border-0 bg-transparent text-start w-100",
										style: {
											color: textColor,
											fontSize: "0.8rem",
											cursor: "pointer",
											transition: "background 0.15s"
										},
										onMouseEnter: (e) => e.currentTarget.style.background = isDark ? "rgba(16, 185, 129, 0.15)" : "rgba(16, 185, 129, 0.08)",
										onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
										onClick: () => {
											handleExportExcel();
											setShowExportDropdown(false);
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-2 d-flex align-items-center justify-content-center",
											style: {
												width: 26,
												height: 26,
												background: "#dcfce7",
												color: "#10b981"
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faFileExcel,
												style: { fontSize: "0.75rem" }
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "fw-semibold",
											style: { lineHeight: 1.2 },
											children: "Excel Spreadsheet"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											style: {
												fontSize: "0.68rem",
												color: mutedColor
											},
											children: ".xlsx format"
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "dropdown-item d-flex align-items-center gap-2 px-3 py-2 border-0 bg-transparent text-start w-100",
										style: {
											color: textColor,
											fontSize: "0.8rem",
											cursor: "pointer",
											transition: "background 0.15s"
										},
										onMouseEnter: (e) => e.currentTarget.style.background = isDark ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.08)",
										onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
										onClick: () => {
											handleExportDocx();
											setShowExportDropdown(false);
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-2 d-flex align-items-center justify-content-center",
											style: {
												width: 26,
												height: 26,
												background: "#dbeafe",
												color: "#3b82f6"
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faFileWord,
												style: { fontSize: "0.75rem" }
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "fw-semibold",
											style: { lineHeight: 1.2 },
											children: "DOCX Document"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											style: {
												fontSize: "0.68rem",
												color: mutedColor
											},
											children: ".docx format"
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "dropdown-item d-flex align-items-center gap-2 px-3 py-2 border-0 bg-transparent text-start w-100",
										style: {
											color: textColor,
											fontSize: "0.8rem",
											cursor: "pointer",
											transition: "background 0.15s"
										},
										onMouseEnter: (e) => e.currentTarget.style.background = isDark ? "rgba(139, 92, 246, 0.15)" : "rgba(139, 92, 246, 0.08)",
										onMouseLeave: (e) => e.currentTarget.style.background = "transparent",
										onClick: () => {
											handleExportWord();
											setShowExportDropdown(false);
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-2 d-flex align-items-center justify-content-center",
											style: {
												width: 26,
												height: 26,
												background: "#f3e8ff",
												color: "#8b5cf6"
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faFileAlt,
												style: { fontSize: "0.75rem" }
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "fw-semibold",
											style: { lineHeight: 1.2 },
											children: "Word Document"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											style: {
												fontSize: "0.68rem",
												color: mutedColor
											},
											children: ".doc format"
										})] })]
									})
								]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex flex-wrap align-items-center gap-2 mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						position: "relative",
						flex: "1 1 280px",
						maxWidth: "320px"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faSearch,
						style: {
							position: "absolute",
							left: "10px",
							top: "50%",
							transform: "translateY(-50%)",
							color: mutedColor,
							fontSize: "0.75rem",
							zIndex: 5
						}
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						className: "form-control form-control-sm rev-input",
						placeholder: "Search revaluations...",
						style: {
							paddingLeft: "28px",
							borderRadius: "10px",
							borderColor,
							color: textColor,
							background: cardBg,
							fontSize: "0.78rem"
						},
						value: searchQuery,
						onChange: (e) => setSearchQuery(e.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-sm border-0 premium-btn d-flex align-items-center gap-1",
					style: {
						borderRadius: "10px",
						background: isDark ? "#2d3248" : "#f1f5f9",
						color: textColor,
						fontSize: "0.78rem",
						padding: "6px 12px"
					},
					onClick: () => setShowFilterPanel(!showFilterPanel),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFilter }),
						" Filters ",
						Object.values(filters).filter((v) => v !== "all").length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "badge rounded-pill",
							style: {
								background: "#8b5cf6",
								color: "#fff",
								fontSize: "0.6rem"
							},
							children: Object.values(filters).filter((v) => v !== "all").length
						})
					]
				})]
			}),
			showFilterPanel && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "premium-card glass-card",
				style: {
					background: cardBg,
					borderRadius: "12px",
					border: `1px solid ${borderColor}`,
					padding: "1rem",
					marginBottom: "1rem",
					display: "flex",
					flexWrap: "wrap",
					gap: "1rem",
					alignItems: "end"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: { minWidth: "160px" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							style: {
								color: mutedColor,
								fontSize: "0.7rem",
								fontWeight: 500,
								display: "block",
								marginBottom: "4px"
							},
							children: "Company"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "form-select form-select-sm rev-select",
							style: {
								borderRadius: "8px",
								borderColor,
								color: textColor,
								background: cardBg,
								fontSize: "0.75rem"
							},
							value: filters.company,
							onChange: (e) => setFilters((p) => ({
								...p,
								company: e.target.value
							})),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All Companies"
							}), companies.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c,
								children: c
							}, c))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: { minWidth: "160px" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							style: {
								color: mutedColor,
								fontSize: "0.7rem",
								fontWeight: 500,
								display: "block",
								marginBottom: "4px"
							},
							children: "Branch"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "form-select form-select-sm rev-select",
							style: {
								borderRadius: "8px",
								borderColor,
								color: textColor,
								background: cardBg,
								fontSize: "0.75rem"
							},
							value: filters.branch,
							onChange: (e) => setFilters((p) => ({
								...p,
								branch: e.target.value
							})),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All Branches"
							}), branches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: b,
								children: b
							}, b))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: { minWidth: "140px" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							style: {
								color: mutedColor,
								fontSize: "0.7rem",
								fontWeight: 500,
								display: "block",
								marginBottom: "4px"
							},
							children: "Currency"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "form-select form-select-sm rev-select",
							style: {
								borderRadius: "8px",
								borderColor,
								color: textColor,
								background: cardBg,
								fontSize: "0.75rem"
							},
							value: filters.currency,
							onChange: (e) => setFilters((p) => ({
								...p,
								currency: e.target.value
							})),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All Currencies"
							}), currencies.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: c,
								children: c
							}, c))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: { minWidth: "140px" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							style: {
								color: mutedColor,
								fontSize: "0.7rem",
								fontWeight: 500,
								display: "block",
								marginBottom: "4px"
							},
							children: "Status"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "form-select form-select-sm rev-select",
							style: {
								borderRadius: "8px",
								borderColor,
								color: textColor,
								background: cardBg,
								fontSize: "0.75rem"
							},
							value: filters.status,
							onChange: (e) => setFilters((p) => ({
								...p,
								status: e.target.value
							})),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All Status"
							}), Object.keys(statusConfig).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: s,
								children: s
							}, s))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-sm border-0 premium-btn",
						style: {
							borderRadius: "8px",
							color: "#ef4444",
							fontSize: "0.72rem",
							padding: "6px 10px"
						},
						onClick: () => setFilters({
							company: "all",
							branch: "all",
							status: "all",
							currency: "all"
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faTimes,
							className: "me-1"
						}), " Clear"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "premium-card glass-card mc-table-wrapper",
				style: {
					background: cardBg,
					borderRadius: "16px",
					border: `1px solid ${borderColor}`,
					overflow: "hidden",
					marginBottom: "2rem"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "table-responsive fx-table-container",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "table align-middle mb-0 mc-table",
						style: { fontSize: "0.78rem" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								style: {
									padding: "14px 12px",
									width: "32px"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										width: 18,
										height: 18,
										borderRadius: "4px",
										border: `2px solid ${selectedRows.length === filteredData.length && filteredData.length > 0 ? "#8b5cf6" : borderColor}`,
										background: selectedRows.length === filteredData.length && filteredData.length > 0 ? "#8b5cf6" : "transparent",
										cursor: "pointer",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										transition: "all 0.15s"
									},
									onClick: handleSelectAllRows,
									children: selectedRows.length === filteredData.length && filteredData.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faCheck,
										style: {
											color: "#fff",
											fontSize: "0.5rem"
										}
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "fw-medium",
								children: "Revaluation No"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
								className: "fw-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faCalendarAlt,
									className: "me-1"
								}), "Date"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
								className: "fw-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faBuilding,
									className: "me-1"
								}), "Company"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "fw-medium",
								children: "Branch"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "fw-medium",
								children: "Currency"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "fw-medium",
								children: "Old Rate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "fw-medium",
								children: "New Rate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "fw-medium",
								children: "Diff"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "fw-medium",
								children: "Gain"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "fw-medium",
								children: "Loss"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "fw-medium",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "fw-medium",
								children: "Created By"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "fw-medium",
								style: { width: "120px" },
								children: "Actions"
							})
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [pageData.map((rev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "enter-anim",
							style: selectedRows.includes(rev.id) ? {
								background: "rgba(139,92,246,0.06)",
								borderLeft: "3px solid #8b5cf6"
							} : void 0,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: { padding: "12px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											width: 18,
											height: 18,
											borderRadius: "4px",
											border: `2px solid ${selectedRows.includes(rev.id) ? "#8b5cf6" : borderColor}`,
											background: selectedRows.includes(rev.id) ? "#8b5cf6" : "transparent",
											cursor: "pointer",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											transition: "all 0.15s"
										},
										onClick: () => handleSelectRow(rev.id),
										children: selectedRows.includes(rev.id) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faCheck,
											style: {
												color: "#fff",
												fontSize: "0.5rem"
											}
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "fw-medium",
									style: {
										padding: "12px",
										color: textColor
									},
									children: rev.id
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										padding: "12px",
										color: mutedColor
									},
									children: rev.date
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										padding: "12px",
										color: textColor
									},
									children: rev.company
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										padding: "12px",
										color: mutedColor
									},
									children: rev.branch
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										padding: "12px",
										color: textColor,
										fontWeight: 600
									},
									children: rev.currency
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										padding: "12px",
										color: mutedColor
									},
									children: rev.oldRate
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										padding: "12px",
										color: textColor
									},
									children: rev.newRate
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										padding: "12px",
										color: rev.diff.startsWith("+") ? "#16a34a" : "#dc2626",
										fontWeight: 600
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "d-inline-flex align-items-center gap-1",
										children: [rev.diff.startsWith("+") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faArrowUp,
											style: { fontSize: "0.5rem" }
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faArrowDown,
											style: { fontSize: "0.5rem" }
										}), rev.diff]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									style: {
										padding: "12px",
										color: rev.gain !== "-" ? "#16a34a" : mutedColor,
										fontWeight: rev.gain !== "-" ? 600 : 400
									},
									children: [rev.gain !== "-" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faArrowUp,
										className: "me-1",
										style: { fontSize: "0.5rem" }
									}), rev.gain]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									style: {
										padding: "12px",
										color: rev.loss !== "-" ? "#dc2626" : mutedColor,
										fontWeight: rev.loss !== "-" ? 600 : 400
									},
									children: [rev.loss !== "-" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faArrowDown,
										className: "me-1",
										style: { fontSize: "0.5rem" }
									}), rev.loss]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: { padding: "12px" },
									children: getStatusBadge(rev.status)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										padding: "12px",
										color: mutedColor
									},
									children: rev.createdBy
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: { padding: "12px" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-sm border-0 premium-action-btn d-flex align-items-center justify-content-center",
												style: {
													width: 30,
													height: 30,
													borderRadius: "8px",
													color: "#3b82f6",
													fontSize: "0.7rem",
													padding: 0,
													background: "rgba(59,130,246,0.1)"
												},
												title: "Preview",
												onClick: () => handlePreview(rev),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEye })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-sm border-0 premium-action-btn d-flex align-items-center justify-content-center",
												style: {
													width: 30,
													height: 30,
													borderRadius: "8px",
													color: "#8b5cf6",
													fontSize: "0.7rem",
													padding: 0,
													background: "rgba(139,92,246,0.1)"
												},
												title: "Edit",
												onClick: () => handleOpenForm(rev),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEdit })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-sm border-0 premium-action-btn d-flex align-items-center justify-content-center",
												style: {
													width: 30,
													height: 30,
													borderRadius: "8px",
													color: "#64748b",
													fontSize: "0.7rem",
													padding: 0,
													background: "rgba(100,116,139,0.1)"
												},
												title: "Copy",
												onClick: () => handleCopy(rev),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCopy })
											}),
											["Draft", "Pending"].includes(rev.status) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-sm border-0 premium-action-btn d-flex align-items-center justify-content-center",
												style: {
													width: 30,
													height: 30,
													borderRadius: "8px",
													color: "#10b981",
													fontSize: "0.7rem",
													padding: 0,
													background: "rgba(16,185,129,0.1)"
												},
												title: "Approve",
												onClick: () => handleApprove(rev),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCheckCircle })
											}),
											["Draft", "Pending"].includes(rev.status) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-sm border-0 premium-action-btn d-flex align-items-center justify-content-center",
												style: {
													width: 30,
													height: 30,
													borderRadius: "8px",
													color: "#ef4444",
													fontSize: "0.7rem",
													padding: 0,
													background: "rgba(239,68,68,0.1)"
												},
												title: "Reject",
												onClick: () => handleReject(rev),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTimesCircle })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-sm border-0 premium-action-btn d-flex align-items-center justify-content-center",
												style: {
													width: 30,
													height: 30,
													borderRadius: "8px",
													color: "#ef4444",
													fontSize: "0.7rem",
													padding: 0,
													background: "rgba(239,68,68,0.1)"
												},
												title: "Delete",
												onClick: () => setDeletingRevaluation(rev),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash })
											})
										]
									})
								})
							]
						}, rev.id)), pageData.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							colSpan: "14",
							className: "text-center py-4",
							style: {
								color: mutedColor,
								fontSize: "0.85rem"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faInfoCircle,
								className: "me-2"
							}), "No revaluations found matching your criteria."]
						}) })] })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						padding: "12px 16px",
						borderTop: `1px solid ${borderColor}`,
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						style: {
							color: mutedColor,
							fontSize: "0.75rem"
						},
						children: [
							"Showing ",
							pageData.length,
							" of ",
							filteredData.length,
							" revaluation(s)",
							selectedRows.length > 0 && ` (${selectedRows.length} selected)`
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-sm border-0 premium-btn",
								style: {
									borderRadius: "8px",
									background: isDark ? "#2d3248" : "#f1f5f9",
									color: mutedColor,
									fontSize: "0.7rem",
									padding: "4px 10px"
								},
								disabled: currentPage === 1,
								onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
								children: "Previous"
							}),
							Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-sm border-0 premium-btn",
								style: {
									borderRadius: "8px",
									background: p === currentPage ? "linear-gradient(135deg, #8b5cf6, #6d28d9)" : isDark ? "#2d3248" : "#f1f5f9",
									color: p === currentPage ? "#fff" : mutedColor,
									fontSize: "0.7rem",
									padding: "4px 10px"
								},
								onClick: () => setCurrentPage(p),
								children: p
							}, p)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-sm border-0 premium-btn",
								style: {
									borderRadius: "8px",
									background: isDark ? "#2d3248" : "#f1f5f9",
									color: mutedColor,
									fontSize: "0.7rem",
									padding: "4px 10px"
								},
								disabled: currentPage === totalPages,
								onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
								children: "Next"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "section-header mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "accent-bar",
					style: { background: "linear-gradient(180deg, #8b5cf6, #6d28d9)" }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
					style: { color: textColor },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faChartBar,
						className: "me-2",
						style: { color: "#8b5cf6" }
					}), "Analytics"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-3 mb-4",
				children: analyticsData.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-2 col-lg-4 col-md-6 fx-fade-slide-up",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "premium-analytic-card glass-card",
						style: {
							background: cardBg,
							borderRadius: "14px",
							border: `1px solid ${borderColor}`,
							padding: "1.1rem"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-2 mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										width: 36,
										height: 36,
										borderRadius: "10px",
										background: `linear-gradient(135deg, ${item.color}20, ${item.color}08)`,
										display: "flex",
										alignItems: "center",
										justifyContent: "center"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: item.icon,
										style: {
											color: item.color,
											fontSize: "0.85rem"
										}
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "badge rounded-pill d-inline-flex align-items-center gap-1",
									style: {
										background: item.trendDir === "up" ? "#dcfce7" : item.trendDir === "down" ? "#fce7e7" : "#f1f5f9",
										color: item.trendDir === "up" ? "#16a34a" : item.trendDir === "down" ? "#dc2626" : "#64748b",
										fontSize: "0.6rem",
										fontWeight: 500
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendIcon, { dir: item.trendDir }),
										" ",
										item.trend
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fw-bold",
								style: {
									color: textColor,
									fontSize: "1.15rem"
								},
								children: item.value
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									color: mutedColor,
									fontSize: "0.72rem",
									marginTop: "2px"
								},
								children: item.label
							})
						]
					})
				}, idx))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "section-header mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "accent-bar",
					style: { background: "linear-gradient(180deg, #8b5cf6, #6d28d9)" }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
					style: { color: textColor },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faFileInvoiceDollar,
						className: "me-2",
						style: { color: "#8b5cf6" }
					}), "Reports"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-3 mb-4",
				children: reports.map((report, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-2 col-lg-4 col-md-6 fx-fade-slide-up",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "premium-report-card glass-card",
						style: {
							background: cardBg,
							borderRadius: "14px",
							border: `1px solid ${borderColor}`,
							padding: "1.1rem",
							cursor: "pointer",
							textAlign: "center"
						},
						onMouseEnter: (e) => {
							e.currentTarget.style.borderColor = report.color;
							e.currentTarget.style.background = `${report.color}06`;
						},
						onMouseLeave: (e) => {
							e.currentTarget.style.borderColor = borderColor;
							e.currentTarget.style.background = cardBg;
						},
						onClick: () => handleGenerateReport(report),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rev-report-icon",
								style: {
									width: 48,
									height: 48,
									borderRadius: "12px",
									background: `linear-gradient(135deg, ${report.color}20, ${report.color}08)`,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									margin: "0 auto 10px"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: report.icon,
									style: {
										color: report.color,
										fontSize: "1.1rem"
									}
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									color: textColor,
									fontSize: "0.78rem",
									fontWeight: 600,
									lineHeight: 1.3
								},
								children: report.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rev-report-gen d-flex align-items-center justify-content-center gap-1",
								style: {
									color: report.color,
									fontSize: "0.65rem",
									marginTop: "8px"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faDownload,
									className: "me-1"
								}), " Generate"]
							})
						]
					})
				}, idx))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogBox, {
				show: showForm,
				onClose: handleCloseForm,
				title: editingRevaluation ? "Edit Revaluation" : "New Currency Revaluation",
				size: "lg",
				showClose: true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							padding: "1rem 0",
							borderBottom: `1px solid ${borderColor}`,
							display: "flex",
							alignItems: "center",
							gap: "0.75rem",
							marginBottom: "1rem"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepIndicator, {
								step: 1,
								label: "Configure",
								icon: faCog
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rev-step-connector",
								style: {
									flex: 1,
									height: 2,
									background: currentStep >= 2 ? "linear-gradient(90deg, #8b5cf6, #6d28d9)" : borderColor,
									borderRadius: 2
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepIndicator, {
								step: 2,
								label: "Exchange Rates",
								icon: faExchangeAlt
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rev-step-connector",
								style: {
									flex: 1,
									height: 2,
									background: currentStep >= 3 ? "linear-gradient(90deg, #8b5cf6, #6d28d9)" : borderColor,
									borderRadius: 2
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StepIndicator, {
								step: 3,
								label: "Review",
								icon: faClipboardCheck
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: { padding: "0.5rem 0" },
						children: renderStepContent()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
							borderTop: `1px solid ${borderColor}`,
							paddingTop: "1rem",
							marginTop: "1rem"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: currentStep > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-sm border-0 premium-btn",
							onClick: handlePrev,
							style: {
								borderRadius: "10px",
								background: isDark ? "#2d3248" : "#f1f5f9",
								color: textColor,
								fontSize: "0.78rem",
								padding: "6px 16px"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faChevronLeft,
								className: "me-1"
							}), " Previous"]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-sm border-0 premium-btn",
								onClick: handleCloseForm,
								style: {
									borderRadius: "10px",
									background: isDark ? "#2d3248" : "#f1f5f9",
									color: mutedColor,
									fontSize: "0.78rem",
									padding: "6px 16px"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faTimes,
									className: "me-1"
								}), " Cancel"]
							}), currentStep < 3 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-sm border-0 premium-btn d-flex align-items-center gap-1",
								onClick: handleNext,
								style: {
									borderRadius: "10px",
									background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
									color: "#fff",
									fontSize: "0.78rem",
									padding: "6px 16px"
								},
								children: ["Next ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faChevronRight })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-sm border-0 premium-btn d-flex align-items-center gap-1",
								style: {
									borderRadius: "10px",
									background: "linear-gradient(135deg, #10b981, #059669)",
									color: "#fff",
									fontSize: "0.78rem",
									padding: "6px 16px"
								},
								onClick: handleFinalize,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCheck }), " Finalize"]
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBox.Confirm, {
				show: !!deletingRevaluation,
				onClose: () => setDeletingRevaluation(null),
				onConfirm: () => {
					if (deletingRevaluation) {
						const { list } = softDeleteRecord({
							system: "fx",
							entity: "revaluation",
							entityLabel: "FX Revaluation",
							records: revaluations,
							record: deletingRevaluation,
							idKey: "id",
							title: `${deletingRevaluation.id || "Revaluation"}`
						});
						setRevaluations(list);
						setDeletingRevaluation(null);
						addNotification?.(`Revaluation "${deletingRevaluation.id}" moved to trash.`, "success");
					}
				},
				title: "Delete Revaluation",
				message: `Are you sure you want to delete revaluation "${deletingRevaluation?.no || deletingRevaluation?.id}"? This action cannot be undone.`,
				confirmLabel: "Delete",
				variant: "danger"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBox, {
				show: !!previewingRev,
				onClose: () => setPreviewingRev(null),
				title: `Preview Revaluation ${previewingRev?.id || ""}`,
				size: "md",
				showClose: true,
				children: previewingRev && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row g-3 mb-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										fontSize: "0.7rem",
										color: mutedColor,
										marginBottom: "2px"
									},
									children: "Company"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										fontSize: "0.9rem",
										color: textColor,
										fontWeight: 600
									},
									children: previewingRev.company
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										fontSize: "0.7rem",
										color: mutedColor,
										marginBottom: "2px"
									},
									children: "Branch"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										fontSize: "0.9rem",
										color: textColor,
										fontWeight: 600
									},
									children: previewingRev.branch
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										fontSize: "0.7rem",
										color: mutedColor,
										marginBottom: "2px"
									},
									children: "Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										fontSize: "0.9rem",
										color: textColor,
										fontWeight: 600
									},
									children: previewingRev.date
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										fontSize: "0.7rem",
										color: mutedColor,
										marginBottom: "2px"
									},
									children: "Currency"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: {
										fontSize: "0.9rem",
										color: textColor,
										fontWeight: 600
									},
									children: previewingRev.currency
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "table-responsive",
						style: {
							borderRadius: "10px",
							border: `1px solid ${borderColor}`,
							overflow: "hidden",
							marginBottom: "1rem"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
							className: "table mc-table align-middle mb-0",
							style: { fontSize: "0.8rem" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									style: { background: isDark ? "#1a1d29" : "#f8fafc" },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "fw-medium",
										style: {
											color: mutedColor,
											padding: "8px 12px"
										},
										children: "Old Rate"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										style: {
											color: textColor,
											padding: "8px 12px"
										},
										children: previewingRev.oldRate
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "fw-medium",
									style: {
										color: mutedColor,
										padding: "8px 12px"
									},
									children: "New Rate"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										color: textColor,
										padding: "8px 12px"
									},
									children: previewingRev.newRate
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									style: { background: isDark ? "#1a1d29" : "#f8fafc" },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "fw-medium",
										style: {
											color: mutedColor,
											padding: "8px 12px"
										},
										children: "Difference"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										style: {
											color: previewingRev.diff.startsWith("+") ? "#16a34a" : "#dc2626",
											fontWeight: 600,
											padding: "8px 12px"
										},
										children: previewingRev.diff
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "fw-medium",
									style: {
										color: mutedColor,
										padding: "8px 12px"
									},
									children: "Gain"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										color: "#16a34a",
										fontWeight: 600,
										padding: "8px 12px"
									},
									children: previewingRev.gain
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									style: { background: isDark ? "#1a1d29" : "#f8fafc" },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "fw-medium",
										style: {
											color: mutedColor,
											padding: "8px 12px"
										},
										children: "Loss"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										style: {
											color: "#dc2626",
											fontWeight: 600,
											padding: "8px 12px"
										},
										children: previewingRev.loss
									})]
								})
							] })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex justify-content-between align-items-center",
						children: [getStatusBadge(previewingRev.status), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							style: {
								fontSize: "0.7rem",
								color: mutedColor
							},
							children: ["Created by ", previewingRev.createdBy]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex gap-2 justify-content-end mt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-sm border-0 premium-btn",
								style: {
									borderRadius: "8px",
									background: isDark ? "#2d3248" : "#f1f5f9",
									color: mutedColor,
									fontSize: "0.75rem",
									padding: "6px 14px"
								},
								onClick: () => handlePrint({
									type: "single",
									rev: previewingRev
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faPrint,
									className: "me-1"
								}), " Print"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-sm border-0 premium-btn",
								style: {
									borderRadius: "8px",
									background: isDark ? "#2d3248" : "#f1f5f9",
									color: textColor,
									fontSize: "0.75rem",
									padding: "6px 14px"
								},
								onClick: () => {
									handleOpenForm(previewingRev);
									setPreviewingRev(null);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faEdit,
									className: "me-1"
								}), " Edit"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-sm border-0 premium-btn",
								style: {
									borderRadius: "8px",
									background: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
									color: "#fff",
									fontSize: "0.75rem",
									padding: "6px 14px"
								},
								onClick: () => setPreviewingRev(null),
								children: "Close"
							})
						]
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBox.Confirm, {
				show: !!confirmAction,
				onClose: () => setConfirmAction(null),
				onConfirm: confirmStatusChange,
				title: confirmAction?.action === "approve" ? "Approve Revaluation" : "Reject Revaluation",
				message: `Are you sure you want to ${confirmAction?.action === "approve" ? "approve" : "reject"} revaluation "${confirmAction?.rev?.id}"?`,
				confirmLabel: confirmAction?.action === "approve" ? "Approve" : "Reject",
				variant: confirmAction?.action === "approve" ? "success" : "danger"
			}),
			printPayload && (() => {
				const items = printPayload.items || (printPayload.rev ? [printPayload.rev] : []);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					id: "rev-print-area",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							style: {
								fontFamily: "Inter, sans-serif",
								color: "#1e293b",
								fontSize: "18px",
								marginBottom: "8px"
							},
							children: printPayload.title || "Currency Revaluations Report"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							style: {
								fontFamily: "Inter, sans-serif",
								color: "#64748b",
								fontSize: "11px",
								marginBottom: "16px"
							},
							children: ["Manage Core - FX Module | Generated on ", (/* @__PURE__ */ new Date()).toLocaleString()]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							style: {
								width: "100%",
								borderCollapse: "collapse",
								fontFamily: "Inter, sans-serif",
								fontSize: "11px"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
								"No",
								"Date",
								"Company",
								"Branch",
								"Currency",
								"Old Rate",
								"New Rate",
								"Diff",
								"Gain",
								"Loss",
								"Status",
								"Created By"
							].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								style: {
									border: "1px solid #cbd5e1",
									padding: "6px 8px",
									background: "#f1f5f9",
									color: "#334155",
									textAlign: "left"
								},
								children: h
							}, h)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: items.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										border: "1px solid #cbd5e1",
										padding: "6px 8px",
										color: "#334155"
									},
									children: r.id
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										border: "1px solid #cbd5e1",
										padding: "6px 8px",
										color: "#334155"
									},
									children: r.date
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										border: "1px solid #cbd5e1",
										padding: "6px 8px",
										color: "#334155"
									},
									children: r.company
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										border: "1px solid #cbd5e1",
										padding: "6px 8px",
										color: "#334155"
									},
									children: r.branch
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										border: "1px solid #cbd5e1",
										padding: "6px 8px",
										color: "#334155"
									},
									children: r.currency
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										border: "1px solid #cbd5e1",
										padding: "6px 8px",
										color: "#334155"
									},
									children: r.oldRate
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										border: "1px solid #cbd5e1",
										padding: "6px 8px",
										color: "#334155"
									},
									children: r.newRate
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										border: "1px solid #cbd5e1",
										padding: "6px 8px",
										color: r.diff.startsWith("+") ? "#16a34a" : "#dc2626"
									},
									children: r.diff
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										border: "1px solid #cbd5e1",
										padding: "6px 8px",
										color: r.gain !== "-" ? "#16a34a" : "#334155"
									},
									children: r.gain
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										border: "1px solid #cbd5e1",
										padding: "6px 8px",
										color: r.loss !== "-" ? "#dc2626" : "#334155"
									},
									children: r.loss
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										border: "1px solid #cbd5e1",
										padding: "6px 8px",
										color: "#334155"
									},
									children: r.status
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										border: "1px solid #cbd5e1",
										padding: "6px 8px",
										color: "#334155"
									},
									children: r.createdBy
								})
							] }, r.id)) })]
						})
					]
				});
			})(),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        #rev-print-area { display: none; }
        @media print {
          body * { visibility: hidden !important; }
          #rev-print-area { display: block !important; position: absolute; left: 0; top: 0; width: 100%; padding: 24px; color: #111; }
          #rev-print-area * { visibility: visible !important; }
        }
      ` })
		]
	});
};
//#endregion
export { FxRevaluations as default };
