import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Ao as faPrint, Cn as faClock, Dl as require_jsx_runtime, Do as faPlus, Er as faEye, Gn as faCopy, In as faCog, Js as faSync, L as faArrowRightArrowLeft, Nt as faCalendarAlt, Tt as faBuildingColumns, Ui as faHistory, Yt as faChartLine, _c as faTrash, b as DialogBox, bl as useApp, d as useTranslation, dc as faTimesCircle, fr as faEdit, jc as faUniversity, jn as faCloudUploadAlt, os as faSearch, ot as faBell, ra as faInfoCircle, rs as faSave, ru as require_react, sr as faDownload, ti as faFilter, uc as faTimes, us as faServer, vl as FontAwesomeIcon, xr as faExchangeAlt } from "./ai-BHgPkVLC.js";
import { c as resetPersistedData, d as FxExportDropdown, f as FxImportDropdown, l as softDeleteRecord, s as loadEntityList, u as writeEntityList } from "./mfg-B8oKSbEg.js";
//#region src/pages/systems/FX/FxExchangeRates.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var initialRates = [];
var featureCards = [
	{
		icon: faCloudUploadAlt,
		title: "Automatic Daily Updates",
		desc: "Schedule automatic rate updates from global providers daily.",
		color: "#3b82f6"
	},
	{
		icon: faHistory,
		title: "Historical Rates",
		desc: "Access and analyze historical exchange rate data.",
		color: "#10b981"
	},
	{
		icon: faCalendarAlt,
		title: "Future Rates",
		desc: "Set and manage forward/future exchange rates.",
		color: "#8b5cf6"
	},
	{
		icon: faDownload,
		title: "Bulk Import",
		desc: "Import multiple exchange rates from CSV or Excel.",
		color: "#f59e0b"
	},
	{
		icon: faServer,
		title: "API Synchronization",
		desc: "Synchronize rates with external banking APIs.",
		color: "#ef4444"
	},
	{
		icon: faChartLine,
		title: "Rate Comparison",
		desc: "Compare rates across multiple providers side-by-side.",
		color: "#06b6d4"
	},
	{
		icon: faBuildingColumns,
		title: "Rate Approval Workflow",
		desc: "Multi-level approval for rate changes.",
		color: "#f97316"
	},
	{
		icon: faExchangeAlt,
		title: "Exchange Rate History",
		desc: "Track all rate changes with audit trail.",
		color: "#ec4899"
	},
	{
		icon: faCog,
		title: "Version Control",
		desc: "Maintain version history of all exchange rates.",
		color: "#14b8a6"
	},
	{
		icon: faClock,
		title: "Scheduled Updates",
		desc: "Define schedules for periodic rate updates.",
		color: "#6366f1"
	},
	{
		icon: faBell,
		title: "Exchange Alerts",
		desc: "Receive alerts on rate fluctuations.",
		color: "#e11d48"
	}
];
var sourceBadgeStyle = (source) => {
	return {
		"Central Bank": {
			bg: "#dbeafe",
			color: "#1d4ed8"
		},
		"Bank API": {
			bg: "#d1fae5",
			color: "#047857"
		},
		"Manual": {
			bg: "#fef3c7",
			color: "#b45309"
		}
	}[source] || {
		bg: "#f1f5f9",
		color: "#64748b"
	};
};
var sourceIconMap = {
	"Central Bank": faBuildingColumns,
	"Bank API": faUniversity,
	"Manual": faCog
};
var statusBadgeStyle = (status) => {
	if (status === "Active") return {
		bg: "#d1fae5",
		color: "#047857"
	};
	return {
		bg: "#fee2e2",
		color: "#b91c1c"
	};
};
var FxExchangeRates = ({ isDark }) => {
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
	const containerBg = isDark ? "#1a1d29" : "#F8FAFC";
	const cardBg = isDark ? "#232736" : "#ffffff";
	const textColor = isDark ? "#e2e8f0" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "#2d3248" : "#e2e8f0";
	const inputBg = isDark ? "#1a1d29" : "#ffffff";
	const [exchangeRates, setExchangeRates] = (0, import_react.useState)(() => loadEntityList("fx", "exchange_rate", initialRates));
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [editingRate, setEditingRate] = (0, import_react.useState)(null);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [baseFilter, setBaseFilter] = (0, import_react.useState)("all");
	const [sourceFilter, setSourceFilter] = (0, import_react.useState)("all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [showFilters, setShowFilters] = (0, import_react.useState)(false);
	const [viewingRate, setViewingRate] = (0, import_react.useState)(null);
	const [deletingRate, setDeletingRate] = (0, import_react.useState)(null);
	const [printPayload, setPrintPayload] = (0, import_react.useState)(null);
	const [errors, setErrors] = (0, import_react.useState)({});
	const [currentPage, setCurrentPage] = (0, import_react.useState)(1);
	const [pageSize] = (0, import_react.useState)(8);
	const [confirmAction, setConfirmAction] = (0, import_react.useState)(null);
	const [featureModal, setFeatureModal] = (0, import_react.useState)(null);
	const [syncing, setSyncing] = (0, import_react.useState)(false);
	const [lastSyncedAt, setLastSyncedAt] = (0, import_react.useState)(() => loadEntityList("fx", "exchange_rate_last_sync", null));
	import_react.useEffect(() => {
		writeEntityList("fx", "exchange_rate", exchangeRates);
	}, [exchangeRates]);
	import_react.useEffect(() => {
		writeEntityList("fx", "exchange_rate_last_sync", lastSyncedAt);
	}, [lastSyncedAt]);
	const [formData, setFormData] = (0, import_react.useState)({
		baseCurrency: "",
		targetCurrency: "",
		spotRate: "",
		forwardRate: "",
		historicalRate: "",
		effectiveDate: "",
		validUntil: "",
		rateProvider: "Central Bank",
		status: "Active"
	});
	const openAddForm = () => {
		setEditingRate(null);
		setFormData({
			baseCurrency: "",
			targetCurrency: "",
			spotRate: "",
			forwardRate: "",
			historicalRate: "",
			effectiveDate: "",
			validUntil: "",
			rateProvider: "Central Bank",
			status: "Active"
		});
		setErrors({});
		setShowForm(true);
	};
	const openEditForm = (rate) => {
		setEditingRate(rate);
		setFormData({
			baseCurrency: rate.base,
			targetCurrency: rate.target,
			spotRate: String(rate.buy),
			forwardRate: String(rate.sell),
			historicalRate: String(rate.mid),
			effectiveDate: rate.effective,
			validUntil: rate.expiry,
			rateProvider: rate.source,
			status: rate.status
		});
		setErrors({});
		setShowForm(true);
	};
	const closeForm = () => {
		setShowForm(false);
		setEditingRate(null);
		setErrors({});
	};
	const validateForm = () => {
		const errs = {};
		if (!formData.baseCurrency) errs.baseCurrency = "Base currency is required";
		if (!formData.targetCurrency) errs.targetCurrency = "Target currency is required";
		if (formData.baseCurrency && formData.targetCurrency && formData.baseCurrency === formData.targetCurrency) errs.targetCurrency = "Target currency must differ from base currency";
		if (!formData.spotRate || isNaN(Number(formData.spotRate)) || Number(formData.spotRate) <= 0) errs.spotRate = "Valid spot rate is required";
		if (!formData.forwardRate || isNaN(Number(formData.forwardRate)) || Number(formData.forwardRate) <= 0) errs.forwardRate = "Valid forward rate is required";
		if (!formData.historicalRate || isNaN(Number(formData.historicalRate)) || Number(formData.historicalRate) <= 0) errs.historicalRate = "Valid historical rate is required";
		if (!formData.effectiveDate) errs.effectiveDate = "Effective date is required";
		if (!formData.validUntil) errs.validUntil = "Valid until date is required";
		if (formData.effectiveDate && formData.validUntil && new Date(formData.validUntil) <= new Date(formData.effectiveDate)) errs.validUntil = "Expiry must be after effective date";
		setErrors(errs);
		return Object.keys(errs).length === 0;
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validateForm()) return;
		const buy = parseFloat(formData.spotRate);
		const sell = parseFloat(formData.forwardRate);
		const mid = (buy + sell) / 2;
		if (editingRate) setExchangeRates((prev) => prev.map((r) => r.id === editingRate.id ? {
			...r,
			base: formData.baseCurrency,
			target: formData.targetCurrency,
			buy,
			sell,
			mid: parseFloat(mid.toFixed(2)),
			effective: formData.effectiveDate,
			expiry: formData.validUntil,
			source: formData.rateProvider,
			status: formData.status
		} : r));
		else {
			const newId = `RATE-${String(exchangeRates.length + 1).padStart(3, "0")}`;
			setExchangeRates((prev) => [{
				id: newId,
				base: formData.baseCurrency,
				target: formData.targetCurrency,
				buy,
				sell,
				mid: parseFloat(mid.toFixed(2)),
				effective: formData.effectiveDate,
				expiry: formData.validUntil,
				source: formData.rateProvider,
				status: formData.status,
				createdBy: "Admin"
			}, ...prev]);
		}
		closeForm();
	};
	const handleDelete = (id) => {
		setDeletingRate(exchangeRates.find((r) => r.id === id));
	};
	const handleCopyRate = (rate) => {
		const newId = `RATE-${String(exchangeRates.length + 1).padStart(3, "0")}`;
		const copy = {
			...rate,
			id: newId,
			status: "Inactive",
			createdBy: "Admin"
		};
		setExchangeRates((prev) => [copy, ...prev]);
		addNotification?.(`Exchange rate "${rate.base}/${rate.target}" copied as "${newId}".`, "success");
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
	const handleApproveRate = (rate) => {
		setConfirmAction({
			rate,
			action: rate.status === "Active" ? "deactivate" : "activate"
		});
	};
	const confirmStatusChange = () => {
		if (!confirmAction) return;
		const { rate, action } = confirmAction;
		const newStatus = action === "activate" ? "Active" : "Inactive";
		setExchangeRates((prev) => prev.map((r) => r.id === rate.id ? {
			...r,
			status: newStatus
		} : r));
		addNotification?.(`Exchange rate "${rate.id}" ${action === "activate" ? "activated" : "deactivated"}.`, action === "activate" ? "success" : "error");
		setConfirmAction(null);
	};
	const handleSyncRates = () => {
		if (syncing) return;
		setSyncing(true);
		setTimeout(() => {
			const now = /* @__PURE__ */ new Date();
			setExchangeRates((prev) => prev.map((r) => ({
				...r,
				buy: Number((r.buy * (.997 + Math.random() * .006)).toFixed(2)),
				sell: Number((r.sell * (.997 + Math.random() * .006)).toFixed(2)),
				mid: Number(((r.buy + r.sell) / 2).toFixed(2)),
				source: r.source === "Manual" ? "Bank API" : r.source,
				effective: now.toISOString().split("T")[0],
				status: "Active"
			})));
			setLastSyncedAt(now.toISOString());
			setSyncing(false);
			addNotification?.("Exchange rates synchronized with provider. Latest rates applied.", "success");
		}, 1200);
	};
	const handleImport = (rows) => {
		if (!Array.isArray(rows) || rows.length === 0) {
			addNotification?.("No importable records found in the file.", "error");
			return;
		}
		const now = /* @__PURE__ */ new Date();
		const newRates = rows.filter((row) => row && (row["Base Currency"] || row.base || row.baseCurrency)).map((row, idx) => {
			const base = row["Base Currency"] || row.base || row.baseCurrency;
			const target = row["Target Currency"] || row.target || row.targetCurrency || "PKR";
			const buy = Number(row["Buy Rate"] || row.buy || row.spotRate || 0);
			const sell = Number(row["Sell Rate"] || row.sell || row.forwardRate || 0);
			const mid = Number(row["Mid Rate"] || row.mid || 0) || (buy + sell) / 2;
			return {
				id: row["Rate ID"] || row.id || `RATE-${now.getTime()}-${idx}`,
				base,
				target,
				buy,
				sell,
				mid: Number(mid.toFixed(2)),
				effective: row["Effective Date"] || row.effective || now.toISOString().split("T")[0],
				expiry: row["Expiry Date"] || row.expiry || "",
				source: row["Source"] || row.source || "Manual",
				status: row["Status"] || row.status || "Active",
				createdBy: "Import"
			};
		}).filter((r) => r.buy > 0 || r.sell > 0);
		if (newRates.length === 0) {
			addNotification?.("No valid exchange rate rows found in the file.", "error");
			return;
		}
		setExchangeRates((prev) => [...prev, ...newRates]);
		addNotification?.(`Imported ${newRates.length} exchange rate(s).`, "success");
	};
	const handleOpenFeature = (feature) => {
		let type = "info";
		switch (feature.title) {
			case "Historical Rates":
				type = "history";
				break;
			case "Bulk Import":
				type = "import";
				break;
			case "Rate Comparison":
				type = "compare";
				break;
			case "Rate Approval Workflow":
				type = "approval";
				break;
			case "Exchange Rate History":
				type = "history";
				break;
			case "Scheduled Updates":
				type = "schedule";
				break;
			case "Exchange Alerts":
				type = "alerts";
				break;
			default: type = "info";
		}
		setFeatureModal({
			feature,
			type
		});
	};
	const confirmDelete = () => {
		if (deletingRate) {
			const { list } = softDeleteRecord({
				system: "fx",
				entity: "exchange_rate",
				entityLabel: "Exchange Rate",
				records: exchangeRates,
				record: deletingRate,
				idKey: "id",
				title: `${deletingRate.id} — ${deletingRate.base}/${deletingRate.target}`
			});
			setExchangeRates(list);
			setDeletingRate(null);
			addNotification?.(`Exchange rate "${deletingRate.id}" moved to trash.`, "success");
		}
	};
	const handleFormChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value
		}));
		if (errors[field]) setErrors((prev) => ({
			...prev,
			[field]: void 0
		}));
	};
	const filteredRates = (0, import_react.useMemo)(() => {
		return exchangeRates.filter((r) => {
			const matchesSearch = !searchQuery || r.id.toLowerCase().includes(searchQuery.toLowerCase()) || r.base.toLowerCase().includes(searchQuery.toLowerCase()) || r.target.toLowerCase().includes(searchQuery.toLowerCase()) || r.source.toLowerCase().includes(searchQuery.toLowerCase()) || r.createdBy.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesBase = baseFilter === "all" || r.base === baseFilter;
			const matchesSource = sourceFilter === "all" || r.source === sourceFilter;
			const matchesStatus = statusFilter === "all" || r.status === statusFilter;
			return matchesSearch && matchesBase && matchesSource && matchesStatus;
		});
	}, [
		exchangeRates,
		searchQuery,
		baseFilter,
		sourceFilter,
		statusFilter
	]);
	const totalPages = Math.ceil(filteredRates.length / pageSize);
	const paginatedRates = filteredRates.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	const currencyOptions = (0, import_react.useMemo)(() => {
		return loadEntityList("fx", "currency", []).filter((c) => c?.code);
	}, [exchangeRates]);
	const baseCurrencyOptions = (0, import_react.useMemo)(() => currencyOptions.filter((c) => c.code !== formData.targetCurrency), [currencyOptions, formData.targetCurrency]);
	const targetCurrencyOptions = (0, import_react.useMemo)(() => currencyOptions.filter((c) => c.code !== formData.baseCurrency), [currencyOptions, formData.baseCurrency]);
	const uniqueBases = (0, import_react.useMemo)(() => [...new Set(exchangeRates.map((r) => r.base))].sort(), [exchangeRates]);
	const cardStyle = {
		background: cardBg,
		borderRadius: "16px",
		border: `1px solid ${borderColor}`,
		padding: "1.25rem",
		transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			background: containerBg,
			minHeight: "100vh",
			padding: "clamp(0.75rem, 3vw, 1.5rem)",
			fontFamily: "'Inter', sans-serif"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .glass-card {
          background: ${isDark ? "rgba(30, 41, 59, 0.75)" : "rgba(255, 255, 255, 0.85)"};
          backdrop-filter: blur(24px) saturate(1.4);
          -webkit-backdrop-filter: blur(24px) saturate(1.4);
          border: 1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.8)"};
          box-shadow: ${isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.6)"};
        }
        .premium-card { transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: default; }
        .premium-card:hover { transform: translateY(-8px) scale(1.012); box-shadow: 0 32px 64px -16px rgba(0,0,0,0.18), 0 0 0 1px rgba(245,158,11,0.08); }
        .premium-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 12px; border-radius: 100px; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.02em; }
        .premium-badge .badge-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
        .premium-btn { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .premium-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
        .premium-action-btn { width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; border: none; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer; }
        .premium-action-btn:hover { transform: scale(1.15); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; }
        .section-header .accent-bar { width: 3px; height: 20px; border-radius: 2px; flex-shrink: 0; }
        .section-header h6 { margin: 0; font-weight: 700; font-size: 0.9rem; }
        .rate-feature-card { transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer; }
        .rate-feature-card:hover { transform: translateY(-8px) scale(1.03); box-shadow: 0 24px 48px -12px rgba(0,0,0,0.15); }
        .rate-feature-card .rate-feature-icon { transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .rate-feature-card:hover .rate-feature-icon { transform: scale(1.2) rotate(-6deg); }
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
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .fx-modal-backdrop { animation: fadeIn 0.2s ease; }
        .fx-modal-content { animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .fx-badge-pulse { animation: pulse 2s ease infinite; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${isDark ? "#334155" : "#cbd5e1"}; border-radius: 100px; }
      ` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex flex-wrap justify-content-between align-items-start mb-4",
				style: {
					position: "relative",
					zIndex: 110
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
					className: "fw-bold mb-1 d-flex align-items-center gap-2",
					style: {
						color: textColor,
						fontSize: "1.4rem"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
							width: 4,
							height: 24,
							background: "linear-gradient(180deg,#f59e0b,#d97706)",
							borderRadius: 2,
							display: "inline-block"
						} }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faArrowRightArrowLeft,
							style: { color: "#f59e0b" }
						}),
						"Exchange Rates"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-0 ms-2",
					style: {
						color: mutedColor,
						fontSize: "0.82rem"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faInfoCircle,
						className: "me-1",
						style: {
							fontSize: "0.7rem",
							color: mutedColor
						}
					}), "Manage and monitor foreign exchange rates across all supported currency pairs. Configure buy, sell, and mid rates with provider source tracking."]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex flex-wrap gap-2 mt-2 mt-lg-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-sm text-white border-0 premium-btn",
							style: {
								background: "linear-gradient(135deg,#f59e0b,#d97706)",
								borderRadius: "10px",
								padding: "0.45rem 1rem"
							},
							onClick: openAddForm,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faPlus,
								className: "me-1"
							}), " Add Exchange Rate"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FxImportDropdown, {
							title: "Exchange Rates",
							isDark,
							addNotification,
							onImport: handleImport,
							buttonStyle: {
								background: "#10b981",
								color: "#fff",
								borderRadius: "10px",
								padding: "0.45rem 1rem"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FxExportDropdown, {
							data: filteredRates,
							getExportData: (data) => data.map((r) => ({
								"Rate ID": r.id,
								"Base Currency": r.base,
								"Target Currency": r.target,
								"Buy Rate": r.buy,
								"Sell Rate": r.sell,
								"Mid Rate": r.mid,
								"Effective Date": r.effective,
								"Expiry Date": r.expiry,
								"Source": r.source,
								"Status": r.status,
								"Created By": r.createdBy
							})),
							title: "Exchange Rates Report",
							filenamePrefix: "fx-exchange-rates",
							isDark,
							addNotification,
							buttonStyle: {
								background: "#8b5cf6",
								color: "#fff",
								borderRadius: "10px",
								padding: "0.45rem 1rem"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-sm border-0 premium-btn",
							style: {
								background: "linear-gradient(135deg,#06b6d4,#0891b2)",
								color: "#fff",
								borderRadius: "10px",
								padding: "0.45rem 1rem"
							},
							onClick: handleSyncRates,
							disabled: syncing,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faSync,
									className: `me-1 ${syncing ? "fa-spin" : ""}`
								}),
								syncing ? "Synchronizing..." : "Synchronize",
								lastSyncedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "badge rounded-pill ms-1",
									style: {
										background: "rgba(255,255,255,0.25)",
										color: "#fff",
										fontSize: "0.6rem"
									},
									children: new Date(lastSyncedAt).toLocaleTimeString()
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-sm border-0 premium-btn",
							style: {
								background: "linear-gradient(135deg,#64748b,#475569)",
								color: "#fff",
								borderRadius: "10px",
								padding: "0.45rem 1rem"
							},
							onClick: () => handlePrint({
								type: "list",
								items: filteredRates,
								title: "Exchange Rates Report"
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faPrint,
								className: "me-1"
							}), " Print"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex flex-wrap align-items-center gap-2 mb-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "position-relative",
						style: {
							flex: "1 1 280px",
							maxWidth: "360px"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faSearch,
							style: {
								position: "absolute",
								left: "12px",
								top: "50%",
								transform: "translateY(-50%)",
								color: mutedColor,
								fontSize: "0.85rem",
								zIndex: 2
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							className: "form-control form-control-sm fx-search-input",
							placeholder: "Search by ID, currency, source...",
							value: searchQuery,
							onChange: (e) => {
								setSearchQuery(e.target.value);
								setCurrentPage(1);
							},
							style: {
								paddingLeft: "2rem",
								borderRadius: "10px",
								border: `1px solid ${borderColor}`,
								background: inputBg,
								color: textColor,
								fontSize: "0.82rem"
							}
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-sm border-0 d-flex align-items-center gap-1",
						style: {
							borderRadius: "10px",
							background: showFilters ? `${isDark ? "#3b82f630" : "#3b82f610"}` : "transparent",
							color: showFilters ? "#3b82f6" : mutedColor,
							border: `1px solid ${showFilters ? "#3b82f6" : borderColor}`,
							fontSize: "0.8rem"
						},
						onClick: () => setShowFilters((p) => !p),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFilter }),
							" Filters",
							(baseFilter !== "all" || sourceFilter !== "all" || statusFilter !== "all") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge rounded-pill",
								style: {
									background: "#3b82f6",
									color: "#fff",
									fontSize: "0.6rem"
								},
								children: [
									baseFilter,
									sourceFilter,
									statusFilter
								].filter((f) => f !== "all").length
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						style: {
							color: mutedColor,
							fontSize: "0.8rem"
						},
						children: [
							filteredRates.length,
							" rate",
							filteredRates.length !== 1 ? "s" : "",
							" found"
						]
					})
				]
			}),
			showFilters && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex flex-wrap gap-3 p-3 mb-3",
				style: {
					background: cardBg,
					borderRadius: "14px",
					border: `1px solid ${borderColor}`,
					animation: "scaleIn 0.2s ease"
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						style: {
							color: mutedColor,
							fontSize: "0.7rem",
							fontWeight: 600,
							display: "block",
							marginBottom: "4px"
						},
						children: "Base Currency"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "form-select form-select-sm fx-select-clean",
						value: baseFilter,
						onChange: (e) => {
							setBaseFilter(e.target.value);
							setCurrentPage(1);
						},
						style: {
							borderRadius: "8px",
							border: `1px solid ${borderColor}`,
							background: inputBg,
							color: textColor,
							fontSize: "0.8rem",
							minWidth: "130px"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "All Currencies"
						}), uniqueBases.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: c,
							children: c
						}, c))]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						style: {
							color: mutedColor,
							fontSize: "0.7rem",
							fontWeight: 600,
							display: "block",
							marginBottom: "4px"
						},
						children: "Source"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "form-select form-select-sm fx-select-clean",
						value: sourceFilter,
						onChange: (e) => {
							setSourceFilter(e.target.value);
							setCurrentPage(1);
						},
						style: {
							borderRadius: "8px",
							border: `1px solid ${borderColor}`,
							background: inputBg,
							color: textColor,
							fontSize: "0.8rem",
							minWidth: "130px"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All Sources"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Central Bank",
								children: "Central Bank"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Bank API",
								children: "Bank API"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Manual",
								children: "Manual"
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						style: {
							color: mutedColor,
							fontSize: "0.7rem",
							fontWeight: 600,
							display: "block",
							marginBottom: "4px"
						},
						children: "Status"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						className: "form-select form-select-sm fx-select-clean",
						value: statusFilter,
						onChange: (e) => {
							setStatusFilter(e.target.value);
							setCurrentPage(1);
						},
						style: {
							borderRadius: "8px",
							border: `1px solid ${borderColor}`,
							background: inputBg,
							color: textColor,
							fontSize: "0.8rem",
							minWidth: "130px"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All Statuses"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Active",
								children: "Active"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "Inactive",
								children: "Inactive"
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "d-flex align-items-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "btn btn-sm border-0",
							style: {
								borderRadius: "8px",
								background: "#ef444410",
								color: "#ef4444",
								fontSize: "0.75rem"
							},
							onClick: () => {
								setBaseFilter("all");
								setSourceFilter("all");
								setStatusFilter("all");
								setCurrentPage(1);
							},
							children: "Clear Filters"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "premium-card glass-card mc-table-wrapper",
				style: {
					...cardStyle,
					padding: 0,
					overflow: "hidden",
					marginBottom: "1.5rem"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "table-responsive",
					style: {
						maxHeight: "520px",
						overflowY: "auto",
						scrollBehavior: "smooth"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "table align-middle mb-0 mc-table",
						style: { fontSize: "0.78rem" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3",
								children: "Rate ID"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-3",
								children: "Base"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-3",
								children: "Target"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-3 text-end",
								children: "Buy Rate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-3 text-end",
								children: "Sell Rate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-3 text-end",
								children: "Mid Rate"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-3",
								children: "Effective"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-3",
								children: "Expiry"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-3",
								children: "Source"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-3",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-3",
								children: "Created By"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 text-center",
								children: "Actions"
							})
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: paginatedRates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							colSpan: 12,
							className: "text-center py-5",
							style: { color: mutedColor },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faInfoCircle,
								className: "me-2"
							}), "No exchange rates found matching your criteria."]
						}) }) : paginatedRates.map((rate, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "enter-anim",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-medium",
										style: {
											color: "#f59e0b",
											fontSize: "0.75rem",
											fontFamily: "'SF Mono','Fira Code',monospace"
										},
										children: rate.id
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-bold",
										style: { color: textColor },
										children: rate.base
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-bold",
										style: { color: textColor },
										children: rate.target
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2 text-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											color: "#10b981",
											fontWeight: 600,
											fontFamily: "'JetBrains Mono', monospace"
										},
										children: rate.buy.toFixed(2)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2 text-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											color: "#ef4444",
											fontWeight: 600,
											fontFamily: "'JetBrains Mono', monospace"
										},
										children: rate.sell.toFixed(2)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2 text-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											color: textColor,
											fontWeight: 600,
											fontFamily: "'JetBrains Mono', monospace"
										},
										children: rate.mid.toFixed(2)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-2 py-2",
									style: {
										color: mutedColor,
										fontSize: "0.72rem",
										whiteSpace: "nowrap"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faCalendarAlt,
										className: "me-1",
										style: { fontSize: "0.65rem" }
									}), rate.effective]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-2 py-2",
									style: {
										color: mutedColor,
										fontSize: "0.72rem",
										whiteSpace: "nowrap"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faCalendarAlt,
										className: "me-1",
										style: { fontSize: "0.65rem" }
									}), rate.expiry]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "badge rounded-pill d-inline-flex align-items-center gap-1",
										style: {
											background: sourceBadgeStyle(rate.source).bg,
											color: sourceBadgeStyle(rate.source).color,
											fontSize: "0.65rem",
											fontWeight: 500,
											padding: "0.25em 0.6em"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: sourceIconMap[rate.source],
											style: { fontSize: "0.6rem" }
										}), rate.source]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "premium-badge",
										style: {
											background: statusBadgeStyle(rate.status).bg,
											color: statusBadgeStyle(rate.status).color
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "badge-dot",
											style: { background: rate.status === "Active" ? "#10b981" : "#ef4444" }
										}), rate.status]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									style: {
										color: mutedColor,
										fontSize: "0.72rem"
									},
									children: rate.createdBy
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex justify-content-center gap-1",
										style: { minWidth: "220px" },
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "premium-action-btn",
												style: {
													color: "#3b82f6",
													background: isDark ? "#1e293b" : "#dbeafe"
												},
												title: "View",
												onClick: () => setViewingRate(rate),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faEye,
													style: { fontSize: "0.7rem" }
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "premium-action-btn",
												style: {
													color: "#64748b",
													background: isDark ? "#1e293b" : "#e2e8f0"
												},
												title: "Print",
												onClick: () => handlePrint({
													type: "single",
													rate
												}),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faPrint,
													style: { fontSize: "0.7rem" }
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "premium-action-btn",
												style: {
													color: "#8b5cf6",
													background: isDark ? "#1e293b" : "#ede9fe"
												},
												title: "Copy",
												onClick: () => handleCopyRate(rate),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faCopy,
													style: { fontSize: "0.7rem" }
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "premium-action-btn",
												style: {
													color: rate.status === "Active" ? "#ef4444" : "#10b981",
													background: isDark ? "#1e293b" : rate.status === "Active" ? "#fee2e2" : "#d1fae5"
												},
												title: rate.status === "Active" ? "Deactivate" : "Activate",
												onClick: () => handleApproveRate(rate),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: rate.status === "Active" ? faTimesCircle : faCheckCircle,
													style: { fontSize: "0.7rem" }
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "premium-action-btn",
												style: {
													color: "#f59e0b",
													background: isDark ? "#1e293b" : "#fef3c7"
												},
												title: "Edit",
												onClick: () => openEditForm(rate),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faEdit,
													style: { fontSize: "0.7rem" }
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "premium-action-btn",
												style: {
													color: "#ef4444",
													background: isDark ? "#1e293b" : "#fce7e7"
												},
												title: "Delete",
												onClick: () => handleDelete(rate.id),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faTrash,
													style: { fontSize: "0.7rem" }
												})
											})
										]
									})
								})
							]
						}, rate.id)) })]
					})
				}), totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex justify-content-between align-items-center px-3 py-2",
					style: {
						borderTop: `1px solid ${borderColor}`,
						background: cardBg
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						style: {
							color: mutedColor,
							fontSize: "0.75rem"
						},
						children: [
							"Showing ",
							(currentPage - 1) * pageSize + 1,
							"–",
							Math.min(currentPage * pageSize, filteredRates.length),
							" of ",
							filteredRates.length
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-sm border-0 fx-pagination-btn",
								disabled: currentPage === 1,
								onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
								style: {
									borderRadius: "8px",
									color: mutedColor,
									fontSize: "0.75rem",
									padding: "0.25rem 0.6rem"
								},
								children: "Prev"
							}),
							Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1).map((p, idx, arr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [idx > 0 && arr[idx - 1] !== p - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								style: {
									color: mutedColor,
									padding: "0 0.25rem",
									alignSelf: "center"
								},
								children: "..."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-sm border-0 fx-pagination-btn",
								onClick: () => setCurrentPage(p),
								style: {
									borderRadius: "8px",
									fontSize: "0.75rem",
									padding: "0.25rem 0.6rem",
									background: p === currentPage ? "#3b82f6" : "transparent",
									color: p === currentPage ? "#fff" : mutedColor
								},
								children: p
							})] }, p)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-sm border-0 fx-pagination-btn",
								disabled: currentPage === totalPages,
								onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
								style: {
									borderRadius: "8px",
									color: mutedColor,
									fontSize: "0.75rem",
									padding: "0.25rem 0.6rem"
								},
								children: "Next"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBox, {
				show: !!viewingRate,
				onClose: () => setViewingRate(null),
				title: `Rate Details — ${viewingRate?.id || ""}`,
				size: "md",
				showClose: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "row g-3",
					children: viewingRate && [
						{
							label: "Base Currency",
							value: viewingRate.base
						},
						{
							label: "Target Currency",
							value: viewingRate.target
						},
						{
							label: "Buy Rate",
							value: viewingRate.buy.toFixed(2)
						},
						{
							label: "Sell Rate",
							value: viewingRate.sell.toFixed(2)
						},
						{
							label: "Mid Rate",
							value: viewingRate.mid.toFixed(2)
						},
						{
							label: "Effective Date",
							value: viewingRate.effective
						},
						{
							label: "Expiry Date",
							value: viewingRate.expiry
						},
						{
							label: "Rate Provider",
							value: viewingRate.source
						},
						{
							label: "Status",
							value: viewingRate.status
						},
						{
							label: "Created By",
							value: viewingRate.createdBy
						}
					].map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								fontSize: "0.7rem",
								color: mutedColor,
								fontWeight: 600,
								marginBottom: "2px"
							},
							children: field.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								fontSize: "0.85rem",
								color: textColor,
								fontWeight: 500
							},
							children: field.value
						})]
					}, field.label))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBox, {
				show: showForm,
				onClose: closeForm,
				title: editingRate ? "Edit Exchange Rate" : "Add Exchange Rate",
				size: "lg",
				showClose: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row g-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "form-label fw-medium",
										style: {
											color: textColor,
											fontSize: "0.8rem"
										},
										children: ["Base Currency ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: { color: "#ef4444" },
											children: "*"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select form-select-sm fx-form-input",
										value: formData.baseCurrency,
										onChange: (e) => handleFormChange("baseCurrency", e.target.value),
										style: {
											borderRadius: "10px",
											border: `1px solid ${errors.baseCurrency ? "#ef4444" : borderColor}`,
											background: inputBg,
											color: textColor,
											fontSize: "0.82rem"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "Select base currency"
										}), baseCurrencyOptions.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: c.code,
											children: [
												c.code,
												" — ",
												c.name
											]
										}, c.code))]
									}),
									errors.baseCurrency && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										style: {
											color: "#ef4444",
											fontSize: "0.7rem"
										},
										children: errors.baseCurrency
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "form-label fw-medium",
										style: {
											color: textColor,
											fontSize: "0.8rem"
										},
										children: ["Target Currency ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: { color: "#ef4444" },
											children: "*"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select form-select-sm fx-form-input",
										value: formData.targetCurrency,
										onChange: (e) => handleFormChange("targetCurrency", e.target.value),
										style: {
											borderRadius: "10px",
											border: `1px solid ${errors.targetCurrency ? "#ef4444" : borderColor}`,
											background: inputBg,
											color: textColor,
											fontSize: "0.82rem"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: "Select target currency"
										}), targetCurrencyOptions.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: c.code,
											children: [
												c.code,
												" — ",
												c.name
											]
										}, c.code))]
									}),
									errors.targetCurrency && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										style: {
											color: "#ef4444",
											fontSize: "0.7rem"
										},
										children: errors.targetCurrency
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "form-label fw-medium",
										style: {
											color: textColor,
											fontSize: "0.8rem"
										},
										children: ["Spot Rate (Buy) ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: { color: "#ef4444" },
											children: "*"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "input-group input-group-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "input-group-text",
											style: {
												borderRadius: "10px 0 0 10px",
												border: `1px solid ${borderColor}`,
												background: inputBg,
												color: mutedColor,
												fontSize: "0.78rem"
											},
											children: formData.targetCurrency || "??"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											step: "0.01",
											className: "form-control fx-form-input",
											value: formData.spotRate,
											onChange: (e) => handleFormChange("spotRate", e.target.value),
											placeholder: "e.g. 287.50",
											style: {
												borderRadius: "0 10px 10px 0",
												border: `1px solid ${errors.spotRate ? "#ef4444" : borderColor}`,
												background: inputBg,
												color: textColor,
												fontSize: "0.82rem"
											}
										})]
									}),
									errors.spotRate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										style: {
											color: "#ef4444",
											fontSize: "0.7rem"
										},
										children: errors.spotRate
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "form-label fw-medium",
										style: {
											color: textColor,
											fontSize: "0.8rem"
										},
										children: ["Forward Rate (Sell) ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: { color: "#ef4444" },
											children: "*"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "input-group input-group-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "input-group-text",
											style: {
												borderRadius: "10px 0 0 10px",
												border: `1px solid ${borderColor}`,
												background: inputBg,
												color: mutedColor,
												fontSize: "0.78rem"
											},
											children: formData.targetCurrency || "??"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											step: "0.01",
											className: "form-control fx-form-input",
											value: formData.forwardRate,
											onChange: (e) => handleFormChange("forwardRate", e.target.value),
											placeholder: "e.g. 289.75",
											style: {
												borderRadius: "0 10px 10px 0",
												border: `1px solid ${errors.forwardRate ? "#ef4444" : borderColor}`,
												background: inputBg,
												color: textColor,
												fontSize: "0.82rem"
											}
										})]
									}),
									errors.forwardRate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										style: {
											color: "#ef4444",
											fontSize: "0.7rem"
										},
										children: errors.forwardRate
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "form-label fw-medium",
										style: {
											color: textColor,
											fontSize: "0.8rem"
										},
										children: ["Historical Rate (Mid) ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: { color: "#ef4444" },
											children: "*"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "input-group input-group-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "input-group-text",
											style: {
												borderRadius: "10px 0 0 10px",
												border: `1px solid ${borderColor}`,
												background: inputBg,
												color: mutedColor,
												fontSize: "0.78rem"
											},
											children: formData.targetCurrency || "??"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											step: "0.01",
											className: "form-control fx-form-input",
											value: formData.historicalRate,
											onChange: (e) => handleFormChange("historicalRate", e.target.value),
											placeholder: "e.g. 288.63",
											style: {
												borderRadius: "0 10px 10px 0",
												border: `1px solid ${errors.historicalRate ? "#ef4444" : borderColor}`,
												background: inputBg,
												color: textColor,
												fontSize: "0.82rem"
											}
										})]
									}),
									errors.historicalRate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										style: {
											color: "#ef4444",
											fontSize: "0.7rem"
										},
										children: errors.historicalRate
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "form-label fw-medium",
										style: {
											color: textColor,
											fontSize: "0.8rem"
										},
										children: ["Effective Date ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: { color: "#ef4444" },
											children: "*"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										className: "form-control form-control-sm fx-form-input",
										value: formData.effectiveDate,
										onChange: (e) => handleFormChange("effectiveDate", e.target.value),
										style: {
											borderRadius: "10px",
											border: `1px solid ${errors.effectiveDate ? "#ef4444" : borderColor}`,
											background: inputBg,
											color: textColor,
											fontSize: "0.82rem"
										}
									}),
									errors.effectiveDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										style: {
											color: "#ef4444",
											fontSize: "0.7rem"
										},
										children: errors.effectiveDate
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "form-label fw-medium",
										style: {
											color: textColor,
											fontSize: "0.8rem"
										},
										children: ["Valid Until (Expiry) ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: { color: "#ef4444" },
											children: "*"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										className: "form-control form-control-sm fx-form-input",
										value: formData.validUntil,
										onChange: (e) => handleFormChange("validUntil", e.target.value),
										style: {
											borderRadius: "10px",
											border: `1px solid ${errors.validUntil ? "#ef4444" : borderColor}`,
											background: inputBg,
											color: textColor,
											fontSize: "0.82rem"
										}
									}),
									errors.validUntil && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										style: {
											color: "#ef4444",
											fontSize: "0.7rem"
										},
										children: errors.validUntil
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "form-label fw-medium",
									style: {
										color: textColor,
										fontSize: "0.8rem"
									},
									children: "Rate Provider"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "form-select form-select-sm fx-form-input",
									value: formData.rateProvider,
									onChange: (e) => handleFormChange("rateProvider", e.target.value),
									style: {
										borderRadius: "10px",
										border: `1px solid ${borderColor}`,
										background: inputBg,
										color: textColor,
										fontSize: "0.82rem"
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Central Bank",
											children: "Central Bank"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Commercial Bank",
											children: "Commercial Bank"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Manual",
											children: "Manual"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "form-label fw-medium",
									style: {
										color: textColor,
										fontSize: "0.8rem"
									},
									children: "Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-3 p-2",
									style: {
										borderRadius: "10px",
										border: `1px solid ${borderColor}`,
										background: inputBg
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												color: mutedColor,
												fontSize: "0.78rem"
											},
											children: "Inactive"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											onClick: () => handleFormChange("status", formData.status === "Active" ? "Inactive" : "Active"),
											style: {
												width: "44px",
												height: "24px",
												borderRadius: "12px",
												background: formData.status === "Active" ? "#10b981" : "#cbd5e1",
												cursor: "pointer",
												position: "relative",
												transition: "background 0.2s",
												flexShrink: 0
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
												width: "20px",
												height: "20px",
												borderRadius: "50%",
												background: "#fff",
												position: "absolute",
												top: "2px",
												left: formData.status === "Active" ? "22px" : "2px",
												transition: "left 0.2s",
												boxShadow: "0 1px 3px rgba(0,0,0,0.2)"
											} })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												color: textColor,
												fontSize: "0.78rem"
											},
											children: "Active"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "badge rounded-pill ms-auto",
											style: {
												background: formData.status === "Active" ? "#d1fae5" : "#fee2e2",
												color: formData.status === "Active" ? "#047857" : "#b91c1c",
												fontSize: "0.65rem"
											},
											children: formData.status
										})
									]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex justify-content-end gap-2 mt-4 pt-3",
						style: { borderTop: `1px solid ${borderColor}` },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn btn-sm border-0",
							style: {
								borderRadius: "10px",
								color: mutedColor,
								background: isDark ? "#2d3248" : "#f1f5f9",
								padding: "0.45rem 1.2rem",
								fontSize: "0.8rem"
							},
							onClick: closeForm,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faTimes,
								className: "me-1"
							}), " Cancel"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							className: "btn btn-sm text-white border-0 fx-btn-hover",
							style: {
								background: "#3b82f6",
								borderRadius: "10px",
								padding: "0.45rem 1.5rem",
								fontSize: "0.8rem"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faSave,
								className: "me-1"
							}), editingRate ? "Update Rate" : "Save Rate"]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "section-header",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "accent-bar",
							style: { background: "linear-gradient(180deg,#8b5cf6,#a78bfa)" }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faCog,
							style: {
								color: "#8b5cf6",
								fontSize: "0.9rem"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
							style: { color: textColor },
							children: "Exchange Rate Features"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "row g-3",
					children: featureCards.map((feature, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-3 col-lg-4 col-md-6 col-sm-6 fx-fade-in",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rate-feature-card premium-card glass-card",
							style: cardStyle,
							onClick: () => handleOpenFeature(feature),
							role: "button",
							tabIndex: 0,
							onKeyDown: (e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									handleOpenFeature(feature);
								}
							},
							title: `Open: ${feature.title}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rate-feature-icon",
									style: {
										width: 44,
										height: 44,
										borderRadius: "14px",
										background: `${feature.color}15`,
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										marginBottom: "0.75rem"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: feature.icon,
										style: {
											color: feature.color,
											fontSize: "1.1rem"
										}
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
									className: "fw-bold mb-1",
									style: {
										color: textColor,
										fontSize: "0.85rem"
									},
									children: feature.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-0",
									style: {
										color: mutedColor,
										fontSize: "0.75rem",
										lineHeight: 1.4
									},
									children: feature.desc
								})
							]
						})
					}, idx))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBox.Confirm, {
				show: !!deletingRate,
				onClose: () => setDeletingRate(null),
				onConfirm: confirmDelete,
				title: "Delete Exchange Rate",
				message: `Are you sure you want to delete the exchange rate for ${deletingRate?.base}/${deletingRate?.target}? This action cannot be undone.`,
				confirmLabel: "Delete",
				variant: "danger"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBox.Confirm, {
				show: !!confirmAction,
				onClose: () => setConfirmAction(null),
				onConfirm: confirmStatusChange,
				title: confirmAction?.action === "activate" ? "Activate Exchange Rate" : "Deactivate Exchange Rate",
				message: `Are you sure you want to ${confirmAction?.action === "activate" ? "activate" : "deactivate"} exchange rate "${confirmAction?.rate?.id || ""}" (${confirmAction?.rate?.base || ""}/${confirmAction?.rate?.target || ""})?`,
				confirmLabel: confirmAction?.action === "activate" ? "Activate" : "Deactivate",
				variant: confirmAction?.action === "activate" ? "success" : "warning"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBox, {
				show: !!featureModal,
				onClose: () => setFeatureModal(null),
				title: featureModal?.feature?.title || "Feature",
				size: "xl",
				showClose: true,
				children: featureModal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					featureModal.type === "approval" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: {
							color: mutedColor,
							fontSize: "0.85rem",
							marginBottom: "1rem"
						},
						children: "Rate approval workflow — approve or deactivate pending rate changes."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "table-responsive",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "table align-middle mb-0 mc-table",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Rate ID" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Pair" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-end",
									children: "Buy"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-end",
									children: "Sell"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Source" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-center",
									children: "Actions"
								})
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: exchangeRates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: "7",
								className: "text-center py-4",
								style: { color: mutedColor },
								children: "No exchange rates available."
							}) }) : exchangeRates.map((rate) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "fw-semibold",
									style: {
										color: "#f59e0b",
										fontSize: "0.8rem"
									},
									children: rate.id
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									style: { color: textColor },
									children: [
										rate.base,
										"/",
										rate.target
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "text-end",
									style: { color: "#10b981" },
									children: rate.buy.toFixed(2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "text-end",
									style: { color: "#ef4444" },
									children: rate.sell.toFixed(2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: { color: mutedColor },
									children: rate.source
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "premium-badge",
									style: {
										background: statusBadgeStyle(rate.status).bg,
										color: statusBadgeStyle(rate.status).color
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "badge-dot",
										style: { background: rate.status === "Active" ? "#10b981" : "#ef4444" }
									}), rate.status]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "d-flex gap-2 justify-content-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "premium-action-btn",
											style: {
												color: rate.status === "Active" ? "#ef4444" : "#10b981",
												background: isDark ? "#1e293b" : rate.status === "Active" ? "#fee2e2" : "#d1fae5"
											},
											title: rate.status === "Active" ? "Deactivate" : "Activate",
											onClick: () => handleApproveRate(rate),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: rate.status === "Active" ? faTimesCircle : faCheckCircle,
												style: { fontSize: "0.7rem" }
											})
										})
									})
								})
							] }, rate.id)) })]
						})
					})] }),
					featureModal.type === "history" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: {
							color: mutedColor,
							fontSize: "0.85rem",
							marginBottom: "1rem"
						},
						children: "Historical rate records across all effective dates. Newer entries supersede older ones."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "table-responsive",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "table align-middle mb-0 mc-table",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Rate ID" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Pair" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-end",
									children: "Buy"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-end",
									children: "Sell"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-end",
									children: "Mid"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Effective" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Expiry" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Source" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" })
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: [...exchangeRates].sort((a, b) => (b.effective || "").localeCompare(a.effective || "")).map((rate) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "fw-semibold",
									style: {
										color: "#f59e0b",
										fontSize: "0.8rem"
									},
									children: rate.id
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									style: { color: textColor },
									children: [
										rate.base,
										"/",
										rate.target
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "text-end",
									style: { color: "#10b981" },
									children: rate.buy.toFixed(2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "text-end",
									style: { color: "#ef4444" },
									children: rate.sell.toFixed(2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "text-end",
									style: { color: textColor },
									children: rate.mid.toFixed(2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: { color: mutedColor },
									children: rate.effective
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: { color: mutedColor },
									children: rate.expiry
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: { color: mutedColor },
									children: rate.source
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "premium-badge",
									style: {
										background: statusBadgeStyle(rate.status).bg,
										color: statusBadgeStyle(rate.status).color
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "badge-dot",
										style: { background: rate.status === "Active" ? "#10b981" : "#ef4444" }
									}), rate.status]
								}) })
							] }, rate.id)) })]
						})
					})] }),
					featureModal.type === "compare" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: {
							color: mutedColor,
							fontSize: "0.85rem",
							marginBottom: "1rem"
						},
						children: "Side-by-side rate comparison across active currency pairs."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "table-responsive",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "table align-middle mb-0 mc-table",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Pair" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-end",
									children: "Buy"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-end",
									children: "Sell"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-end",
									children: "Mid"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-end",
									children: "Spread"
								})
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: exchangeRates.filter((r) => r.status === "Active").map((rate) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "fw-bold",
									style: { color: textColor },
									children: [
										rate.base,
										"/",
										rate.target
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "text-end",
									style: { color: "#10b981" },
									children: rate.buy.toFixed(2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "text-end",
									style: { color: "#ef4444" },
									children: rate.sell.toFixed(2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "text-end",
									style: { color: textColor },
									children: rate.mid.toFixed(2)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "text-end fw-semibold",
									style: { color: "#8b5cf6" },
									children: Number((rate.sell - rate.buy).toFixed(2))
								})
							] }, rate.id)) })]
						})
					})] }),
					featureModal.type === "schedule" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: {
							color: mutedColor,
							fontSize: "0.85rem",
							marginBottom: "1rem"
						},
						children: "Configure automatic rate update schedules."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row g-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-4 p-3 d-flex align-items-center gap-3",
								style: {
									border: "1px solid #6366f1",
									background: "rgba(99,102,241,0.08)"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "d-flex align-items-center justify-content-center rounded-3",
									style: {
										width: 44,
										height: 44,
										background: "rgba(99,102,241,0.15)",
										color: "#6366f1"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faClock })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "fw-semibold",
									style: {
										color: textColor,
										fontSize: "0.85rem"
									},
									children: "Daily Provider Sync"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
									style: { color: mutedColor },
									children: "Rates refresh automatically every business day at 09:00."
								})] })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-4 p-3 d-flex align-items-center gap-3",
								style: {
									border: "1px solid rgba(59,130,246,0.4)",
									background: "rgba(59,130,246,0.08)"
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "d-flex align-items-center justify-content-center rounded-3",
									style: {
										width: 44,
										height: 44,
										background: "rgba(59,130,246,0.15)",
										color: "#3b82f6"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCalendarAlt })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "fw-semibold",
									style: {
										color: textColor,
										fontSize: "0.85rem"
									},
									children: "Weekly Rate Review"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
									style: { color: mutedColor },
									children: "A treasury review runs every Monday with change alerts."
								})] })]
							})
						})]
					})] }),
					featureModal.type === "alerts" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: {
							color: mutedColor,
							fontSize: "0.85rem",
							marginBottom: "1rem"
						},
						children: "Rate fluctuation alerts monitor active pairs and notify on significant moves."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex align-items-center gap-3 p-3 rounded-3",
						style: {
							background: "rgba(225,29,72,0.08)",
							border: "1px solid rgba(225,29,72,0.2)"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faBell,
							style: {
								color: "#e11d48",
								fontSize: "1.3rem"
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "fw-semibold",
							style: {
								color: textColor,
								fontSize: "0.85rem"
							},
							children: "Alert Rule Active"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
							style: { color: mutedColor },
							children: "You will be notified when any active rate moves more than 1.0% intraday."
						})] })]
					})] }),
					featureModal.type === "import" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: {
							color: mutedColor,
							fontSize: "0.85rem",
							marginBottom: "1rem"
						},
						children: "Use the Import button in the toolbar to bulk-import rates from Excel/CSV. Imported rows are validated and appended to the current list."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex align-items-center gap-3 p-3 rounded-3",
						style: {
							background: "rgba(16,185,129,0.08)",
							border: "1px solid rgba(16,185,129,0.2)"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faDownload,
							style: {
								color: "#10b981",
								fontSize: "1.3rem"
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "fw-semibold",
							style: {
								color: textColor,
								fontSize: "0.85rem"
							},
							children: "Bulk Import Ready"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
							style: { color: mutedColor },
							children: "Columns: Rate ID, Base Currency, Target Currency, Buy Rate, Sell Rate, Effective Date, Source, Status."
						})] })]
					})] }),
					featureModal.type === "info" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: {
							color: textColor,
							fontSize: "0.9rem",
							lineHeight: 1.6
						},
						children: featureModal.feature?.desc
					}) })
				] })
			}),
			printPayload && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: "fx-print-area",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						textAlign: "center",
						marginBottom: "1.2rem"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						style: {
							margin: 0,
							fontSize: "18px"
						},
						children: printPayload.type === "single" ? "Exchange Rate Details" : printPayload.title || "Exchange Rates Report"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							fontSize: "11px",
							color: "#666",
							marginTop: "4px"
						},
						children: ["Generated: ", (/* @__PURE__ */ new Date()).toLocaleString()]
					})]
				}), printPayload.type === "single" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						fontFamily: "'Inter', sans-serif",
						fontSize: "13px"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
						style: {
							width: "100%",
							borderCollapse: "collapse"
						},
						children: (() => {
							const r = printPayload.rate;
							return [
								["Rate ID", r.id],
								["Base Currency", r.base],
								["Target Currency", r.target],
								["Buy Rate", r.buy.toFixed(2)],
								["Sell Rate", r.sell.toFixed(2)],
								["Mid Rate", r.mid.toFixed(2)],
								["Effective Date", r.effective],
								["Expiry Date", r.expiry],
								["Rate Provider", r.source],
								["Status", r.status],
								["Created By", r.createdBy]
							].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								style: {
									border: "1px solid #cbd5e1",
									padding: "6px 10px",
									background: "#f8fafc",
									fontWeight: 600,
									width: "40%"
								},
								children: k
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								style: {
									border: "1px solid #cbd5e1",
									padding: "6px 10px"
								},
								children: v
							})] }, k));
						})()
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					style: {
						width: "100%",
						borderCollapse: "collapse",
						fontSize: "12px"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
						"Rate ID",
						"Base",
						"Target",
						"Buy",
						"Sell",
						"Mid",
						"Effective",
						"Expiry",
						"Source",
						"Status"
					].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						style: {
							border: "1px solid #cbd5e1",
							padding: "6px 8px",
							background: "#f1f5f9",
							textAlign: "left",
							fontSize: "11px"
						},
						children: h
					}, h)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (printPayload.items || []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							style: {
								border: "1px solid #cbd5e1",
								padding: "6px 8px",
								fontWeight: 600
							},
							children: r.id
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							style: {
								border: "1px solid #cbd5e1",
								padding: "6px 8px"
							},
							children: r.base
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							style: {
								border: "1px solid #cbd5e1",
								padding: "6px 8px"
							},
							children: r.target
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							style: {
								border: "1px solid #cbd5e1",
								padding: "6px 8px",
								textAlign: "right"
							},
							children: r.buy.toFixed(2)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							style: {
								border: "1px solid #cbd5e1",
								padding: "6px 8px",
								textAlign: "right"
							},
							children: r.sell.toFixed(2)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							style: {
								border: "1px solid #cbd5e1",
								padding: "6px 8px",
								textAlign: "right"
							},
							children: r.mid.toFixed(2)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							style: {
								border: "1px solid #cbd5e1",
								padding: "6px 8px"
							},
							children: r.effective
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							style: {
								border: "1px solid #cbd5e1",
								padding: "6px 8px"
							},
							children: r.expiry
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							style: {
								border: "1px solid #cbd5e1",
								padding: "6px 8px"
							},
							children: r.source
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							style: {
								border: "1px solid #cbd5e1",
								padding: "6px 8px"
							},
							children: r.status
						})
					] }, r.id)) })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        #fx-print-area { display: none; }
        @media print {
          body * { visibility: hidden !important; }
          #fx-print-area { display: block !important; position: absolute; left: 0; top: 0; width: 100%; padding: 24px; color: #111; }
          #fx-print-area * { visibility: visible !important; }
        }
      ` })
		]
	});
};
//#endregion
export { FxExchangeRates as default };
