import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $t as faCheckCircle, Ao as faPrint, Br as faFileExport, Cn as faClock, Ct as faBuilding, Dl as require_jsx_runtime, Do as faPlus, Er as faEye, Ga as faMoneyBillWave, Gn as faCopy, Hr as faFileImport, In as faCog, Lo as faReceipt, Nt as faCalendarAlt, Pt as faCalendarCheck, Ui as faHistory, Wr as faFileInvoiceDollar, Xc as faUserShield, _c as faTrash, b as DialogBox, bl as useApp, d as useTranslation, dc as faTimesCircle, en as faCheckDouble, fr as faEdit, ft as faBookOpen, io as faPaperclip, ir as faDollarSign, jc as faUniversity, jn as faCloudUploadAlt, jt as faCalculator, ma as faLink, os as faSearch, po as faPercent, rs as faSave, ru as require_react, ti as faFilter, uc as faTimes, ut as faBook, vl as FontAwesomeIcon, xn as faClipboardCheck, xr as faExchangeAlt } from "./ai-BHgPkVLC.js";
import { c as resetPersistedData, d as FxExportDropdown, f as FxImportDropdown, l as softDeleteRecord, s as loadEntityList, u as writeEntityList } from "./mfg-B8oKSbEg.js";
//#region src/pages/systems/FX/FxTransactions.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var transactionTypes = [
	"Currency Purchase",
	"Currency Sale",
	"Foreign Payment",
	"Foreign Receipt",
	"Bank Transfer",
	"Currency Conversion",
	"Advance Payment",
	"International Invoice",
	"Vendor Payment",
	"Customer Payment"
];
var typeBadgeStyles = {
	"Currency Purchase": {
		bg: "#dbeafe",
		color: "#1d4ed8",
		icon: faDollarSign
	},
	"Currency Sale": {
		bg: "#dcfce7",
		color: "#16a34a",
		icon: faDollarSign
	},
	"Foreign Payment": {
		bg: "#ffedd5",
		color: "#c2410c",
		icon: faFileExport
	},
	"Foreign Receipt": {
		bg: "#f3e8ff",
		color: "#7e22ce",
		icon: faFileImport
	},
	"Bank Transfer": {
		bg: "#cffafe",
		color: "#0e7490",
		icon: faUniversity
	},
	"Currency Conversion": {
		bg: "#fce7f3",
		color: "#be185d",
		icon: faExchangeAlt
	},
	"Advance Payment": {
		bg: "#fef9c3",
		color: "#ca8a04",
		icon: faMoneyBillWave
	},
	"International Invoice": {
		bg: "#e0e7ff",
		color: "#4338ca",
		icon: faFileInvoiceDollar
	},
	"Vendor Payment": {
		bg: "#ccfbf1",
		color: "#0f766e",
		icon: faBuilding
	},
	"Customer Payment": {
		bg: "#fee2e2",
		color: "#b91c1c",
		icon: faBuilding
	}
};
var statusBadgeStyles = {
	Completed: {
		bg: "#dcfce7",
		color: "#16a34a",
		icon: faCheckCircle
	},
	Pending: {
		bg: "#fef9c3",
		color: "#ca8a04",
		icon: faClock
	},
	Failed: {
		bg: "#fee2e2",
		color: "#dc2626",
		icon: faTimesCircle
	},
	"In Progress": {
		bg: "#dbeafe",
		color: "#1d4ed8",
		icon: faClock
	},
	Approved: {
		bg: "#dcfce7",
		color: "#16a34a",
		icon: faCheckCircle
	},
	Rejected: {
		bg: "#fee2e2",
		color: "#dc2626",
		icon: faTimesCircle
	}
};
var advancedFeatures = [
	{
		icon: faBook,
		label: "Multi-Currency Journals",
		desc: "Maintain detailed journals for multi-currency entries.",
		color: "#3b82f6"
	},
	{
		icon: faBookOpen,
		label: "Automatic Ledger Posting",
		desc: "Auto-post FX transactions to general ledger accounts.",
		color: "#10b981"
	},
	{
		icon: faLink,
		label: "Bank Reconciliation",
		desc: "Reconcile foreign currency bank statements.",
		color: "#8b5cf6"
	},
	{
		icon: faDollarSign,
		label: "Payment Gateway Integration",
		desc: "Connect with international payment gateways.",
		color: "#f59e0b"
	},
	{
		icon: faHistory,
		label: "Audit Logs",
		desc: "Track all FX transaction changes with audit trail.",
		color: "#ef4444"
	},
	{
		icon: faClipboardCheck,
		label: "Transaction Approval",
		desc: "Multi-step approval workflow for FX transactions.",
		color: "#06b6d4"
	},
	{
		icon: faPaperclip,
		label: "Document Attachments",
		desc: "Upload and manage supporting documents.",
		color: "#f97316"
	},
	{
		icon: faUserShield,
		label: "Multi-Level Authorization",
		desc: "Configure authorization levels for large transactions.",
		color: "#ec4899"
	},
	{
		icon: faCalculator,
		label: "Exchange Gain/Loss Calculation",
		desc: "Auto-calculate realized and unrealized gains.",
		color: "#14b8a6"
	}
];
var initialFilters = {
	dateFrom: "",
	dateTo: "",
	company: "",
	branch: "",
	transactionType: "",
	status: ""
};
var emptyTransaction = {
	transactionNumber: "",
	transactionDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
	referenceNumber: "",
	company: "",
	branch: "",
	bankAccount: "",
	currency: "",
	transactionType: "",
	exchangeRate: "",
	originalAmount: "",
	convertedAmount: "",
	bankCharges: "",
	tax: "",
	description: "",
	supportingDocuments: null,
	approvalStatus: "Pending",
	createdBy: ""
};
var FxTransactions = ({ isDark }) => {
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
	const [editingTransaction, setEditingTransaction] = (0, import_react.useState)(null);
	const [filters, setFilters] = (0, import_react.useState)(initialFilters);
	const [search, setSearch] = (0, import_react.useState)("");
	const [showFilters, setShowFilters] = (0, import_react.useState)(false);
	const [formData, setFormData] = (0, import_react.useState)(emptyTransaction);
	const [deletingTx, setDeletingTx] = (0, import_react.useState)(null);
	const [viewingTx, setViewingTx] = (0, import_react.useState)(null);
	const [schedulingTx, setSchedulingTx] = (0, import_react.useState)(null);
	const [scheduleForm, setScheduleForm] = (0, import_react.useState)({
		scheduledFor: "",
		note: ""
	});
	const [printPayload, setPrintPayload] = (0, import_react.useState)(null);
	const [errors, setErrors] = (0, import_react.useState)({});
	const [transactions, setTransactions] = (0, import_react.useState)(() => loadEntityList("fx", "transaction", []));
	const [confirmAction, setConfirmAction] = (0, import_react.useState)(null);
	const [featureModal, setFeatureModal] = (0, import_react.useState)(null);
	const [auditLog, setAuditLog] = (0, import_react.useState)(() => loadEntityList("fx", "transaction_audit", []));
	const [attachingTx, setAttachingTx] = (0, import_react.useState)(null);
	const [attachingFile, setAttachingFile] = (0, import_react.useState)(null);
	import_react.useEffect(() => {
		writeEntityList("fx", "transaction", transactions);
	}, [transactions]);
	import_react.useEffect(() => {
		writeEntityList("fx", "transaction_audit", auditLog);
	}, [auditLog]);
	const logAudit = (tx, action, detail) => {
		setAuditLog((prev) => [{
			id: Date.now(),
			transactionNumber: tx?.transactionNumber || "—",
			action,
			detail,
			by: tx?.createdBy || "Admin",
			at: (/* @__PURE__ */ new Date()).toLocaleString()
		}, ...prev]);
	};
	const containerBg = isDark ? "#1a1d29" : "#F8FAFC";
	const cardBg = isDark ? "#232736" : "#ffffff";
	const textColor = isDark ? "#e2e8f0" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "#2d3248" : "#e2e8f0";
	const inputBg = isDark ? "#1e2235" : "#ffffff";
	const generateTransactionNumber = () => {
		const nextId = (transactions.length > 0 ? Math.max(...transactions.map((tx) => tx.id)) : 0) + 1;
		return `FX-${(/* @__PURE__ */ new Date()).getFullYear()}-${String(nextId).padStart(3, "0")}`;
	};
	const filteredTransactions = (0, import_react.useMemo)(() => {
		return transactions.filter((tx) => {
			const matchesSearch = !search || tx.transactionNumber.toLowerCase().includes(search.toLowerCase()) || tx.description.toLowerCase().includes(search.toLowerCase()) || tx.currency.toLowerCase().includes(search.toLowerCase()) || tx.company.toLowerCase().includes(search.toLowerCase());
			const matchesDateFrom = !filters.dateFrom || new Date(tx.transactionDate) >= new Date(filters.dateFrom);
			const matchesDateTo = !filters.dateTo || new Date(tx.transactionDate) <= new Date(filters.dateTo);
			const matchesCompany = !filters.company || tx.company === filters.company;
			const matchesBranch = !filters.branch || tx.branch === filters.branch;
			const matchesType = !filters.transactionType || tx.transactionType === filters.transactionType;
			const matchesStatus = !filters.status || tx.approvalStatus === filters.status;
			return matchesSearch && matchesDateFrom && matchesDateTo && matchesCompany && matchesBranch && matchesType && matchesStatus;
		});
	}, [
		transactions,
		filters,
		search
	]);
	const companies = (0, import_react.useMemo)(() => [...new Set(transactions.map((tx) => tx.company).filter(Boolean))], [transactions]);
	const branches = (0, import_react.useMemo)(() => [...new Set(transactions.map((tx) => tx.branch).filter(Boolean))], [transactions]);
	const handleOpenCreate = () => {
		const newNumber = generateTransactionNumber();
		setEditingTransaction(null);
		setFormData({
			...emptyTransaction,
			transactionNumber: newNumber,
			createdBy: "Admin"
		});
		setErrors({});
		setShowForm(true);
	};
	const handleOpenEdit = (tx) => {
		setEditingTransaction(tx);
		setFormData({
			transactionNumber: tx.transactionNumber,
			transactionDate: tx.transactionDate,
			referenceNumber: tx.referenceNumber || "",
			company: tx.company,
			branch: tx.branch,
			bankAccount: tx.bankAccount,
			currency: tx.currency,
			transactionType: tx.transactionType,
			exchangeRate: tx.exchangeRate,
			originalAmount: tx.originalAmount,
			convertedAmount: tx.convertedAmount,
			bankCharges: tx.bankCharges,
			tax: tx.tax,
			description: tx.description,
			supportingDocuments: null,
			approvalStatus: tx.approvalStatus,
			createdBy: tx.createdBy
		});
		setErrors({});
		setShowForm(true);
	};
	const handleCloseForm = () => {
		setShowForm(false);
		setEditingTransaction(null);
		setFormData(emptyTransaction);
		setErrors({});
	};
	const handleFormChange = (field, value) => {
		const updated = {
			...formData,
			[field]: value
		};
		if (field === "exchangeRate" || field === "originalAmount") {
			const rate = parseFloat(field === "exchangeRate" ? value : updated.exchangeRate);
			const amount = parseFloat(field === "originalAmount" ? value : updated.originalAmount);
			if (!isNaN(rate) && !isNaN(amount)) updated.convertedAmount = (rate * amount).toFixed(2);
			else updated.convertedAmount = "";
		}
		setFormData(updated);
		if (errors[field]) setErrors((prev) => ({
			...prev,
			[field]: void 0
		}));
	};
	const validateForm = () => {
		const newErrors = {};
		if (!formData.transactionDate) newErrors.transactionDate = "Transaction date is required";
		if (!formData.company) newErrors.company = "Company is required";
		if (!formData.branch) newErrors.branch = "Branch is required";
		if (!formData.bankAccount) newErrors.bankAccount = "Bank account is required";
		if (!formData.currency) newErrors.currency = "Currency is required";
		if (!formData.transactionType) newErrors.transactionType = "Transaction type is required";
		if (!formData.exchangeRate || parseFloat(formData.exchangeRate) <= 0) newErrors.exchangeRate = "Valid exchange rate is required";
		if (!formData.originalAmount || parseFloat(formData.originalAmount) <= 0) newErrors.originalAmount = "Valid amount is required";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validateForm()) return;
		if (editingTransaction) {
			setTransactions((prev) => prev.map((tx) => tx.id === editingTransaction.id ? {
				...tx,
				transactionDate: formData.transactionDate,
				referenceNumber: formData.referenceNumber,
				company: formData.company,
				branch: formData.branch,
				bankAccount: formData.bankAccount,
				currency: formData.currency,
				transactionType: formData.transactionType,
				exchangeRate: formData.exchangeRate,
				originalAmount: formData.originalAmount,
				convertedAmount: formData.convertedAmount,
				bankCharges: formData.bankCharges,
				tax: formData.tax,
				description: formData.description,
				approvalStatus: formData.approvalStatus
			} : tx));
			logAudit(editingTransaction, "Edited", "Transaction details updated");
		} else {
			const newTx = {
				id: transactions.length > 0 ? Math.max(...transactions.map((tx) => tx.id)) + 1 : 1,
				transactionNumber: formData.transactionNumber,
				transactionDate: formData.transactionDate,
				referenceNumber: formData.referenceNumber,
				company: formData.company,
				branch: formData.branch,
				bankAccount: formData.bankAccount,
				currency: formData.currency,
				transactionType: formData.transactionType,
				exchangeRate: formData.exchangeRate,
				originalAmount: formData.originalAmount,
				convertedAmount: formData.convertedAmount,
				bankCharges: formData.bankCharges,
				tax: formData.tax,
				description: formData.description,
				supportingDocuments: null,
				approvalStatus: formData.approvalStatus || "Pending",
				createdBy: formData.createdBy
			};
			setTransactions((prev) => [...prev, newTx]);
			logAudit(newTx, "Created", "New FX transaction added");
		}
		handleCloseForm();
	};
	const handleDelete = (id) => {
		setDeletingTx(transactions.find((t) => t.id === id));
	};
	const confirmDelete = () => {
		if (deletingTx) {
			const { list } = softDeleteRecord({
				system: "fx",
				entity: "transaction",
				entityLabel: "FX Transaction",
				records: transactions,
				record: deletingTx,
				idKey: "id",
				title: `${deletingTx.transactionNumber} — ${deletingTx.transactionType}`
			});
			setTransactions(list);
			logAudit(deletingTx, "Deleted", "Transaction moved to trash");
			setDeletingTx(null);
			addNotification?.(`Transaction "${deletingTx.transactionNumber}" moved to trash.`, "success");
		}
	};
	const handleFileChange = (e) => {
		setFormData((prev) => ({
			...prev,
			supportingDocuments: e.target.files[0]
		}));
	};
	const clearFilters = () => {
		setFilters(initialFilters);
		setSearch("");
	};
	const handleApprove = (tx) => {
		setConfirmAction({
			tx,
			action: "approve"
		});
	};
	const handleReject = (tx) => {
		setConfirmAction({
			tx,
			action: "reject"
		});
	};
	const confirmStatusChange = () => {
		if (!confirmAction) return;
		const { tx, action } = confirmAction;
		const newStatus = action === "approve" ? "Approved" : "Rejected";
		setTransactions((prev) => prev.map((t) => t.id === tx.id ? {
			...t,
			approvalStatus: newStatus,
			reviewedAt: (/* @__PURE__ */ new Date()).toISOString()
		} : t));
		logAudit(tx, action === "approve" ? "Approved" : "Rejected", `Status changed to ${newStatus}`);
		addNotification?.(`Transaction "${tx.transactionNumber}" ${action === "approve" ? "approved" : "rejected"}.`, action === "approve" ? "success" : "error");
		setConfirmAction(null);
	};
	const handleCopy = (tx) => {
		const newId = transactions.length > 0 ? Math.max(...transactions.map((t) => t.id)) + 1 : 1;
		const copy = {
			...tx,
			id: newId,
			transactionNumber: generateTransactionNumber(),
			transactionDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			approvalStatus: "Pending",
			createdBy: "Admin",
			scheduledFor: void 0,
			scheduleNote: void 0
		};
		setTransactions((prev) => [...prev, copy]);
		logAudit(tx, "Copied", `Duplicated as "${copy.transactionNumber}"`);
		addNotification?.(`Transaction "${tx.transactionNumber}" copied as "${copy.transactionNumber}".`, "success");
	};
	const openSchedule = (tx) => {
		setSchedulingTx(tx);
		setScheduleForm({
			scheduledFor: tx.scheduledFor || tx.transactionDate || "",
			note: tx.scheduleNote || ""
		});
	};
	const saveSchedule = () => {
		if (!schedulingTx) return;
		if (!scheduleForm.scheduledFor) {
			addNotification?.("Please select a schedule date.", "error");
			return;
		}
		setTransactions((prev) => prev.map((t) => t.id === schedulingTx.id ? {
			...t,
			scheduledFor: scheduleForm.scheduledFor,
			scheduleNote: scheduleForm.note
		} : t));
		logAudit(schedulingTx, "Scheduled", `Scheduled for ${scheduleForm.scheduledFor}`);
		addNotification?.(`Transaction "${schedulingTx.transactionNumber}" scheduled for ${scheduleForm.scheduledFor}.`, "success");
		setSchedulingTx(null);
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
	const handleImport = (rows) => {
		if (!Array.isArray(rows) || rows.length === 0) {
			addNotification?.("No importable records found in the file.", "error");
			return;
		}
		const now = /* @__PURE__ */ new Date();
		const newTransactions = rows.filter((row) => row && (row["Transaction No"] || row.transactionNumber || row["Transaction Number"])).map((row, idx) => ({
			id: now.getTime() + idx,
			transactionNumber: row["Transaction No"] || row.transactionNumber || row["Transaction Number"] || generateTransactionNumber(),
			transactionDate: row["Date"] || row.transactionDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			referenceNumber: row["Reference"] || row.referenceNumber || "",
			company: row["Company"] || row.company || "",
			branch: row["Branch"] || row.branch || "",
			bankAccount: row["Bank Account"] || row.bankAccount || "",
			currency: row["Currency"] || row.currency || "",
			transactionType: row["Type"] || row.transactionType || transactionTypes[0],
			exchangeRate: String(row["Exchange Rate"] || row.exchangeRate || 0),
			originalAmount: String(row["Original Amount"] || row.originalAmount || 0),
			convertedAmount: String(row["Converted Amount"] || row.convertedAmount || 0),
			bankCharges: String(row["Bank Charges"] || row.bankCharges || 0),
			tax: String(row["Tax"] || row.tax || 0),
			description: row["Description"] || row.description || "",
			approvalStatus: row["Status"] || row.approvalStatus || "Pending",
			createdBy: "Import"
		}));
		if (newTransactions.length === 0) {
			addNotification?.("No valid FX transaction rows found in the file.", "error");
			return;
		}
		setTransactions((prev) => [...prev, ...newTransactions]);
		addNotification?.(`Imported ${newTransactions.length} FX transaction(s).`, "success");
	};
	const handleOpenFeature = (feature) => {
		let type = "info";
		switch (feature.label) {
			case "Transaction Approval":
				type = "approval";
				break;
			case "Audit Logs":
				type = "audit";
				break;
			case "Multi-Currency Journals":
				type = "journals";
				break;
			case "Automatic Ledger Posting":
				type = "ledger";
				break;
			case "Exchange Gain/Loss Calculation":
				type = "gainloss";
				break;
			case "Document Attachments":
				type = "attachment";
				break;
			default: type = "info";
		}
		setFeatureModal({
			feature,
			type
		});
	};
	const inputStyle = {
		background: inputBg,
		color: textColor,
		border: `1px solid ${borderColor}`,
		borderRadius: "10px",
		padding: "0.5rem 0.75rem",
		fontSize: "0.85rem",
		width: "100%",
		transition: "all 0.2s"
	};
	const labelStyle = {
		color: textColor,
		fontSize: "0.85rem",
		fontWeight: 500,
		marginBottom: "0.35rem"
	};
	const selectStyle = {
		...inputStyle,
		cursor: "pointer",
		appearance: "auto"
	};
	const formGroupStyle = { marginBottom: "1rem" };
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
        .premium-card:hover { transform: translateY(-8px) scale(1.012); box-shadow: 0 32px 64px -16px rgba(0,0,0,0.18), 0 0 0 1px rgba(6,182,212,0.08); }
        .premium-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 12px; border-radius: 100px; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.02em; }
        .premium-badge .badge-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
        .premium-btn { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .premium-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
        .premium-action-btn { width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; border: none; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer; }
        .premium-action-btn:hover { transform: scale(1.15); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
        .premium-feature-card { transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer; }
        .premium-feature-card:hover { transform: translateY(-8px) scale(1.03); box-shadow: 0 24px 48px -12px rgba(0,0,0,0.15); }
        .premium-feature-card .feature-icon { transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .premium-feature-card:hover .feature-icon { transform: scale(1.2) rotate(-6deg); }
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
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${isDark ? "#334155" : "#cbd5e1"}; border-radius: 100px; }
      ` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex flex-wrap justify-content-between align-items-start mb-4 enter-anim",
				style: {
					position: "relative",
					zIndex: 110
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center gap-3 mb-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						width: "4px",
						height: "28px",
						borderRadius: "4px",
						background: "linear-gradient(180deg, #06b6d4, #0d9488)",
						flexShrink: 0
					} }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
						className: "fw-bold mb-0",
						style: {
							color: textColor,
							fontSize: "1.4rem"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faMoneyBillWave,
							className: "me-2",
							style: { color: "#06b6d4" }
						}), t("FX Transactions")]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-0 mt-1 d-flex align-items-center gap-1",
						style: {
							color: mutedColor,
							fontSize: "0.82rem"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faExchangeAlt,
							style: { fontSize: "0.7rem" }
						}), t("Manage foreign exchange transactions across all companies and branches.")]
					})] })]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex flex-wrap gap-2 mt-2 mt-lg-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-sm border-0 text-white premium-btn d-flex align-items-center gap-1",
							style: {
								background: "linear-gradient(135deg, #06b6d4, #0d9488)",
								borderRadius: "10px",
								padding: "0.45rem 1.1rem",
								fontSize: "0.82rem"
							},
							onClick: handleOpenCreate,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPlus }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("New FX Transaction") })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FxImportDropdown, {
							title: "FX Transactions",
							isDark,
							addNotification,
							onImport: handleImport,
							buttonStyle: {
								background: "linear-gradient(135deg, #10b981, #059669)",
								borderRadius: "10px",
								padding: "0.45rem 1rem",
								fontSize: "0.82rem",
								color: "#fff"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FxExportDropdown, {
							data: filteredTransactions,
							getExportData: (data) => data.map((tx) => ({
								"Transaction No": tx.transactionNumber,
								"Date": tx.transactionDate,
								"Company": tx.company,
								"Branch": tx.branch,
								"Bank Account": tx.bankAccount,
								"Currency": tx.currency,
								"Type": tx.transactionType,
								"Exchange Rate": tx.exchangeRate,
								"Original Amount": tx.originalAmount,
								"Converted Amount": tx.convertedAmount,
								"Bank Charges": tx.bankCharges,
								"Tax": tx.tax,
								"Status": tx.approvalStatus,
								"Created By": tx.createdBy
							})),
							title: "FX Transactions Report",
							filenamePrefix: "fx-transactions",
							isDark,
							addNotification,
							buttonStyle: {
								background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
								borderRadius: "10px",
								padding: "0.45rem 1rem",
								fontSize: "0.82rem",
								color: "#fff"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-sm border-0 text-white premium-btn d-flex align-items-center gap-1",
							style: {
								background: "linear-gradient(135deg, #f59e0b, #d97706)",
								borderRadius: "10px",
								padding: "0.45rem 1rem",
								fontSize: "0.82rem"
							},
							onClick: () => handlePrint({
								type: "list",
								items: filteredTransactions,
								title: "FX Transactions Report"
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPrint }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("Print") })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-4 p-3 mb-4 premium-card glass-card enter-anim",
				style: {
					background: cardBg,
					border: `1px solid ${borderColor}`,
					boxShadow: isDark ? "0 2px 12px rgba(0,0,0,0.2)" : "0 2px 12px rgba(0,0,0,0.04)"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex flex-wrap align-items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center gap-2 tx-input",
							style: {
								flex: 1,
								minWidth: "220px",
								background: inputBg,
								border: `1px solid ${borderColor}`,
								borderRadius: "10px",
								padding: "0.3rem 0.75rem",
								transition: "all 0.2s"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faSearch,
								style: {
									color: mutedColor,
									fontSize: "0.8rem"
								}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "text",
								placeholder: t("Search transactions..."),
								value: search,
								onChange: (e) => setSearch(e.target.value),
								style: {
									border: "none",
									background: "transparent",
									outline: "none",
									padding: "0.35rem 0",
									color: textColor,
									width: "100%",
									fontSize: "0.85rem"
								}
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-sm d-flex align-items-center gap-1 premium-btn",
							style: {
								background: showFilters ? "linear-gradient(135deg, #06b6d4, #0d9488)" : isDark ? "#2d3248" : "#e5e7eb",
								color: showFilters ? "#fff" : textColor,
								borderRadius: "10px",
								padding: "0.4rem 1rem",
								border: "none",
								fontSize: "0.82rem"
							},
							onClick: () => setShowFilters(!showFilters),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFilter }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t("Filters") })]
						}),
						(search || filters.dateFrom || filters.dateTo || filters.company || filters.branch || filters.transactionType || filters.status) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-sm border-0 premium-btn d-flex align-items-center gap-1",
							style: {
								color: "#ef4444",
								background: isDark ? "#2d3248" : "#f1f5f9",
								borderRadius: "10px",
								padding: "0.4rem 0.8rem",
								fontSize: "0.8rem"
							},
							onClick: clearFilters,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faTimes,
								className: "me-1"
							}), t("Clear")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							style: {
								color: mutedColor,
								fontSize: "0.82rem",
								marginLeft: "auto",
								fontWeight: 500
							},
							children: [
								filteredTransactions.length,
								" ",
								t("transactions")
							]
						})
					]
				}), showFilters && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row g-2 mt-3 tx-slide-down",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-lg-2 col-md-4 col-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								style: labelStyle,
								children: t("Date From")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: filters.dateFrom,
								onChange: (e) => setFilters((prev) => ({
									...prev,
									dateFrom: e.target.value
								})),
								className: "tx-input",
								style: inputStyle
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-lg-2 col-md-4 col-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								style: labelStyle,
								children: t("Date To")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								value: filters.dateTo,
								onChange: (e) => setFilters((prev) => ({
									...prev,
									dateTo: e.target.value
								})),
								className: "tx-input",
								style: inputStyle
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-lg-2 col-md-4 col-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								style: labelStyle,
								children: t("Company")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: filters.company,
								onChange: (e) => setFilters((prev) => ({
									...prev,
									company: e.target.value
								})),
								className: "tx-input",
								style: {
									...selectStyle,
									background: inputBg,
									color: textColor
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: t("All Companies")
								}), companies.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c,
									children: c
								}, c))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-lg-2 col-md-4 col-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								style: labelStyle,
								children: t("Branch")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: filters.branch,
								onChange: (e) => setFilters((prev) => ({
									...prev,
									branch: e.target.value
								})),
								className: "tx-input",
								style: {
									...selectStyle,
									background: inputBg,
									color: textColor
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: t("All Branches")
								}), branches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: b,
									children: b
								}, b))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-lg-2 col-md-4 col-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								style: labelStyle,
								children: t("Type")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: filters.transactionType,
								onChange: (e) => setFilters((prev) => ({
									...prev,
									transactionType: e.target.value
								})),
								className: "tx-input",
								style: {
									...selectStyle,
									background: inputBg,
									color: textColor
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: t("All Types")
								}), transactionTypes.map((tp) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: tp,
									children: tp
								}, tp))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-lg-2 col-md-4 col-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								style: labelStyle,
								children: t("Status")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: filters.status,
								onChange: (e) => setFilters((prev) => ({
									...prev,
									status: e.target.value
								})),
								className: "tx-input",
								style: {
									...selectStyle,
									background: inputBg,
									color: textColor
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: t("All Status")
								}), Object.keys(statusBadgeStyles).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s,
									children: s
								}, s))]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mc-table-wrapper rounded-4 overflow-hidden premium-card glass-card enter-anim",
				style: {
					background: cardBg,
					border: `1px solid ${borderColor}`,
					boxShadow: isDark ? "0 2px 12px rgba(0,0,0,0.2)" : "0 2px 12px rgba(0,0,0,0.04)"
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "table-responsive tx-scrollbar",
					style: {
						maxHeight: "600px",
						overflowY: "auto"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "table align-middle mb-0 mc-table",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: t("Transaction No.") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: t("Date") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: t("Company") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: t("Branch") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: t("Bank Account") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: t("Currency") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: t("Type") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-end",
								children: t("Amount")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-end",
								children: t("Rate")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-end",
								children: t("Converted")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-end",
								children: t("Charges")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: t("Status") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: t("Created By") }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-center",
								children: t("Actions")
							})
						] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filteredTransactions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							colSpan: "14",
							className: "text-center py-5",
							style: { color: mutedColor },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faSearch,
								className: "me-2"
							}), t("No transactions found")]
						}) }) : filteredTransactions.map((tx) => {
							const typeStyle = typeBadgeStyles[tx.transactionType] || {
								bg: "#f1f5f9",
								color: "#475569",
								icon: faReceipt
							};
							const statusStyle = statusBadgeStyles[tx.approvalStatus] || statusBadgeStyles.Pending;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "enter-anim",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-semibold",
										style: {
											color: "#06b6d4",
											fontSize: "0.82rem"
										},
										children: tx.transactionNumber
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										style: {
											color: textColor,
											whiteSpace: "nowrap"
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faCalendarAlt,
												className: "me-1",
												style: {
													color: mutedColor,
													fontSize: "0.7rem"
												}
											}),
											tx.transactionDate,
											tx.scheduledFor && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "badge rounded-pill ms-1",
												style: {
													background: isDark ? "#164e63" : "#cffafe",
													color: isDark ? "#67e8f9" : "#0e7490",
													fontSize: "0.6rem",
													fontWeight: 600
												},
												title: `Scheduled for ${tx.scheduledFor}${tx.scheduleNote ? ` — ${tx.scheduleNote}` : ""}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faClock,
													className: "me-1",
													style: { fontSize: "0.5rem" }
												}), tx.scheduledFor]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										style: { color: textColor },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faBuilding,
											className: "me-1",
											style: {
												color: mutedColor,
												fontSize: "0.7rem"
											}
										}), tx.company]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										style: { color: mutedColor },
										children: tx.branch
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										style: { color: textColor },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faUniversity,
											className: "me-1",
											style: {
												color: mutedColor,
												fontSize: "0.7rem"
											}
										}), tx.bankAccount]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-bold",
										style: { color: "#06b6d4" },
										children: tx.currency
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "badge rounded-pill px-2 py-1.5 fw-medium d-inline-flex align-items-center gap-1",
										style: {
											background: typeStyle.bg,
											color: typeStyle.color,
											fontSize: "0.68rem",
											padding: "0.3rem 0.65rem"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: typeStyle.icon,
											style: { fontSize: "0.6rem" }
										}), tx.transactionType]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "text-end fw-medium",
										style: {
											color: textColor,
											whiteSpace: "nowrap"
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faDollarSign,
												className: "me-1",
												style: {
													color: mutedColor,
													fontSize: "0.65rem"
												}
											}),
											parseFloat(tx.originalAmount).toLocaleString(),
											" ",
											tx.currency
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "text-end",
										style: {
											color: textColor,
											whiteSpace: "nowrap"
										},
										children: tx.exchangeRate
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "text-end fw-semibold",
										style: {
											color: "#06b6d4",
											whiteSpace: "nowrap"
										},
										children: ["PKR ", parseFloat(tx.convertedAmount).toLocaleString()]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "text-end",
										style: {
											color: "#ef4444",
											whiteSpace: "nowrap"
										},
										children: ["PKR ", parseFloat(tx.bankCharges).toLocaleString()]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "premium-badge",
										style: {
											background: statusStyle.bg,
											color: statusStyle.color
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "badge-dot",
											style: { background: statusStyle.color }
										}), tx.approvalStatus]
									}) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										style: { color: mutedColor },
										children: tx.createdBy
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "text-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex gap-1 justify-content-center",
											style: { minWidth: "260px" },
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "premium-action-btn",
													style: {
														color: "#3b82f6",
														background: isDark ? "#1e293b" : "#dbeafe"
													},
													title: "View",
													onClick: () => setViewingTx(tx),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faEye,
														style: { fontSize: "0.75rem" }
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
														tx
													}),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faPrint,
														style: { fontSize: "0.75rem" }
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "premium-action-btn",
													style: {
														color: "#10b981",
														background: isDark ? "#1e293b" : "#d1fae5"
													},
													title: "Approve",
													onClick: () => handleApprove(tx),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faCheckDouble,
														style: { fontSize: "0.75rem" }
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "premium-action-btn",
													style: {
														color: "#ef4444",
														background: isDark ? "#1e293b" : "#fee2e2"
													},
													title: "Reject",
													onClick: () => handleReject(tx),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faTimesCircle,
														style: { fontSize: "0.75rem" }
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "premium-action-btn",
													style: {
														color: "#06b6d4",
														background: isDark ? "#1e293b" : "#cffafe"
													},
													title: "Schedule",
													onClick: () => openSchedule(tx),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faCalendarCheck,
														style: { fontSize: "0.75rem" }
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "premium-action-btn",
													style: {
														color: "#8b5cf6",
														background: isDark ? "#1e293b" : "#ede9fe"
													},
													title: "Copy",
													onClick: () => handleCopy(tx),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faCopy,
														style: { fontSize: "0.75rem" }
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "premium-action-btn",
													style: {
														color: "#f59e0b",
														background: isDark ? "#1e293b" : "#fef3c7"
													},
													title: "Edit",
													onClick: () => handleOpenEdit(tx),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faEdit,
														style: { fontSize: "0.75rem" }
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "premium-action-btn",
													style: {
														color: "#ef4444",
														background: isDark ? "#1e293b" : "#fce7e7"
													},
													title: "Delete",
													onClick: () => handleDelete(tx.id),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faTrash,
														style: { fontSize: "0.75rem" }
													})
												})
											]
										})
									})
								]
							}, tx.id);
						}) })]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 enter-anim",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "section-header",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "accent-bar",
						style: { background: "linear-gradient(180deg, #06b6d4, #0d9488)" }
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
						style: { color: textColor },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faCog,
							className: "me-2",
							style: {
								color: "#8b5cf6",
								fontSize: "0.9rem"
							}
						}), t("Advanced Features")]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "row g-3",
					children: advancedFeatures.map((feature, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-4 col-lg-4 col-md-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "premium-feature-card glass-card rounded-4 p-3 d-flex align-items-start gap-3",
							style: {
								background: cardBg,
								border: `1px solid ${borderColor}`,
								height: "100%",
								boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.15)" : "0 2px 8px rgba(0,0,0,0.04)"
							},
							onClick: () => handleOpenFeature(feature),
							role: "button",
							tabIndex: 0,
							onKeyDown: (e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									handleOpenFeature(feature);
								}
							},
							title: `Open: ${feature.label}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "feature-icon d-flex align-items-center justify-content-center rounded-3 flex-shrink-0",
								style: {
									width: "44px",
									height: "44px",
									background: `${feature.color}15`,
									color: feature.color,
									fontSize: "1.1rem",
									transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: feature.icon })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								className: "fw-semibold mb-1",
								style: {
									color: textColor,
									fontSize: "0.85rem"
								},
								children: t(feature.label)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-0",
								style: {
									color: mutedColor,
									fontSize: "0.75rem",
									lineHeight: 1.4
								},
								children: feature.desc
							})] })]
						})
					}, idx))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBox, {
				show: showForm,
				onClose: handleCloseForm,
				title: editingTransaction ? t("Edit FX Transaction") : t("New FX Transaction"),
				size: "xl",
				showClose: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row g-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-4",
								style: formGroupStyle,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									style: labelStyle,
									children: t("Transaction Number")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									value: formData.transactionNumber,
									readOnly: true,
									className: "tx-input",
									style: {
										...inputStyle,
										background: isDark ? "#1a1d29" : "#f1f5f9",
										cursor: "not-allowed"
									}
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-4",
								style: formGroupStyle,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										style: labelStyle,
										children: [
											t("Transaction Date"),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-danger",
												children: "*"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										value: formData.transactionDate,
										onChange: (e) => handleFormChange("transactionDate", e.target.value),
										className: `tx-input ${errors.transactionDate ? "error" : ""}`,
										style: {
											...inputStyle,
											borderColor: errors.transactionDate ? "#ef4444" : borderColor
										}
									}),
									errors.transactionDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										style: {
											color: "#ef4444",
											fontSize: "0.7rem"
										},
										children: errors.transactionDate
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-4",
								style: formGroupStyle,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									style: labelStyle,
									children: t("Reference Number")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									placeholder: "e.g. INV-001",
									value: formData.referenceNumber,
									onChange: (e) => handleFormChange("referenceNumber", e.target.value),
									className: "tx-input",
									style: inputStyle
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								style: formGroupStyle,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										style: labelStyle,
										children: [
											t("Company"),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-danger",
												children: "*"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: formData.company,
										onChange: (e) => handleFormChange("company", e.target.value),
										className: `tx-input ${errors.company ? "error" : ""}`,
										style: {
											...selectStyle,
											borderColor: errors.company ? "#ef4444" : borderColor
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: t("Select Company")
										}), companies.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: c,
											children: c
										}, c))]
									}),
									errors.company && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										style: {
											color: "#ef4444",
											fontSize: "0.7rem"
										},
										children: errors.company
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								style: formGroupStyle,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										style: labelStyle,
										children: [
											t("Branch"),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-danger",
												children: "*"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: formData.branch,
										onChange: (e) => handleFormChange("branch", e.target.value),
										className: `tx-input ${errors.branch ? "error" : ""}`,
										style: {
											...selectStyle,
											borderColor: errors.branch ? "#ef4444" : borderColor
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: t("Select Branch")
										}), branches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: b,
											children: b
										}, b))]
									}),
									errors.branch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										style: {
											color: "#ef4444",
											fontSize: "0.7rem"
										},
										children: errors.branch
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								style: formGroupStyle,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										style: labelStyle,
										children: [
											t("Bank Account"),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-danger",
												children: "*"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: formData.bankAccount,
										onChange: (e) => handleFormChange("bankAccount", e.target.value),
										className: `tx-input ${errors.bankAccount ? "error" : ""}`,
										style: {
											...selectStyle,
											borderColor: errors.bankAccount ? "#ef4444" : borderColor
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: t("Select Bank Account")
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "HBL FCY-001",
												children: "HBL FCY-001"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "HBL FCY-002",
												children: "HBL FCY-002"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Meezan FCY-001",
												children: "Meezan FCY-001"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "ADCB FCY-001",
												children: "ADCB FCY-001"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "AlRajhi FCY-001",
												children: "AlRajhi FCY-001"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "UBL FCY-001",
												children: "UBL FCY-001"
											})
										]
									}),
									errors.bankAccount && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										style: {
											color: "#ef4444",
											fontSize: "0.7rem"
										},
										children: errors.bankAccount
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								style: formGroupStyle,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										style: labelStyle,
										children: [
											t("Currency"),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-danger",
												children: "*"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: formData.currency,
										onChange: (e) => handleFormChange("currency", e.target.value),
										className: `tx-input ${errors.currency ? "error" : ""}`,
										style: {
											...selectStyle,
											borderColor: errors.currency ? "#ef4444" : borderColor
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: t("Select Currency")
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "USD",
												children: "USD - US Dollar"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "EUR",
												children: "EUR - Euro"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "GBP",
												children: "GBP - British Pound"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "AED",
												children: "AED - UAE Dirham"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "SAR",
												children: "SAR - Saudi Riyal"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "JPY",
												children: "JPY - Japanese Yen"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "CAD",
												children: "CAD - Canadian Dollar"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "AUD",
												children: "AUD - Australian Dollar"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "PKR",
												children: "PKR - Pakistani Rupee"
											})
										]
									}),
									errors.currency && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										style: {
											color: "#ef4444",
											fontSize: "0.7rem"
										},
										children: errors.currency
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								style: formGroupStyle,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										style: labelStyle,
										children: [
											t("Transaction Type"),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-danger",
												children: "*"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: formData.transactionType,
										onChange: (e) => handleFormChange("transactionType", e.target.value),
										className: `tx-input ${errors.transactionType ? "error" : ""}`,
										style: {
											...selectStyle,
											borderColor: errors.transactionType ? "#ef4444" : borderColor
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "",
											children: t("Select Type")
										}), transactionTypes.map((tp) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: tp,
											children: tp
										}, tp))]
									}),
									errors.transactionType && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										style: {
											color: "#ef4444",
											fontSize: "0.7rem"
										},
										children: errors.transactionType
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-3",
								style: formGroupStyle,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										style: labelStyle,
										children: [
											t("Exchange Rate"),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-danger",
												children: "*"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "input-group",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "input-group-text border-0",
											style: {
												background: isDark ? "#2d3248" : "#f1f5f9",
												color: mutedColor,
												borderRadius: "10px 0 0 10px",
												fontSize: "0.8rem"
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faExchangeAlt })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											step: "0.01",
											min: "0",
											placeholder: "0.00",
											value: formData.exchangeRate,
											onChange: (e) => handleFormChange("exchangeRate", e.target.value),
											className: `tx-input ${errors.exchangeRate ? "error" : ""}`,
											style: {
												...inputStyle,
												borderRadius: "0 10px 10px 0",
												borderColor: errors.exchangeRate ? "#ef4444" : borderColor
											}
										})]
									}),
									errors.exchangeRate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										style: {
											color: "#ef4444",
											fontSize: "0.7rem"
										},
										children: errors.exchangeRate
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-3",
								style: formGroupStyle,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										style: labelStyle,
										children: [
											t("Original Amount"),
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-danger",
												children: "*"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "input-group",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "input-group-text border-0",
											style: {
												background: isDark ? "#2d3248" : "#f1f5f9",
												color: mutedColor,
												borderRadius: "10px 0 0 10px",
												fontSize: "0.8rem"
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faDollarSign })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											step: "0.01",
											min: "0",
											placeholder: "0.00",
											value: formData.originalAmount,
											onChange: (e) => handleFormChange("originalAmount", e.target.value),
											className: `tx-input ${errors.originalAmount ? "error" : ""}`,
											style: {
												...inputStyle,
												borderRadius: "0 10px 10px 0",
												borderColor: errors.originalAmount ? "#ef4444" : borderColor
											}
										})]
									}),
									errors.originalAmount && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										style: {
											color: "#ef4444",
											fontSize: "0.7rem"
										},
										children: errors.originalAmount
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-3",
								style: formGroupStyle,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										style: labelStyle,
										children: t("Converted Amount (PKR)")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "input-group",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "input-group-text border-0",
											style: {
												background: isDark ? "#2d3248" : "#f1f5f9",
												color: mutedColor,
												borderRadius: "10px 0 0 10px",
												fontSize: "0.8rem"
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faMoneyBillWave })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											value: formData.convertedAmount ? `PKR ${parseFloat(formData.convertedAmount).toLocaleString()}` : "",
											readOnly: true,
											className: "tx-input",
											style: {
												...inputStyle,
												borderRadius: "0 10px 10px 0",
												background: isDark ? "#1a1d29" : "#f1f5f9",
												cursor: "not-allowed",
												fontWeight: 600,
												color: formData.convertedAmount ? "#06b6d4" : mutedColor
											}
										})]
									}),
									formData.convertedAmount && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
										style: {
											color: "#06b6d4",
											fontSize: "0.7rem"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faCheckCircle,
											className: "me-1"
										}), t("Auto-calculated")]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-3",
								style: formGroupStyle,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									style: labelStyle,
									children: t("Bank Charges")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "input-group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "input-group-text border-0",
										style: {
											background: isDark ? "#2d3248" : "#f1f5f9",
											color: mutedColor,
											borderRadius: "10px 0 0 10px",
											fontSize: "0.8rem"
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faReceipt })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										step: "0.01",
										min: "0",
										placeholder: "0.00",
										value: formData.bankCharges,
										onChange: (e) => handleFormChange("bankCharges", e.target.value),
										className: "tx-input",
										style: {
											...inputStyle,
											borderRadius: "0 10px 10px 0"
										}
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								style: formGroupStyle,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									style: labelStyle,
									children: t("Tax")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "input-group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "input-group-text border-0",
										style: {
											background: isDark ? "#2d3248" : "#f1f5f9",
											color: mutedColor,
											borderRadius: "10px 0 0 10px",
											fontSize: "0.8rem"
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPercent })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										step: "0.01",
										min: "0",
										placeholder: "0.00",
										value: formData.tax,
										onChange: (e) => handleFormChange("tax", e.target.value),
										className: "tx-input",
										style: {
											...inputStyle,
											borderRadius: "0 10px 10px 0"
										}
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-md-6",
								style: formGroupStyle,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									style: labelStyle,
									children: t("Approval Status")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: formData.approvalStatus,
									onChange: (e) => handleFormChange("approvalStatus", e.target.value),
									className: "tx-input",
									style: selectStyle,
									children: Object.keys(statusBadgeStyles).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s,
										children: s
									}, s))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-12",
								style: formGroupStyle,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									style: labelStyle,
									children: t("Description")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									rows: "3",
									placeholder: "Enter transaction description...",
									value: formData.description,
									onChange: (e) => handleFormChange("description", e.target.value),
									className: "tx-input",
									style: {
										...inputStyle,
										resize: "vertical",
										minHeight: "80px"
									}
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-12",
								style: formGroupStyle,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										style: labelStyle,
										children: t("Supporting Documents")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center gap-3 p-3 rounded-3 premium-card glass-card",
										style: {
											border: `2px dashed ${borderColor}`,
											background: isDark ? "#1a1d29" : "#f8fafc",
											cursor: "pointer"
										},
										onClick: () => document.getElementById("fileUpload").click(),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faCloudUploadAlt,
											style: {
												color: "#06b6d4",
												fontSize: "1.5rem"
											}
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												color: textColor,
												fontSize: "0.85rem",
												fontWeight: 500
											},
											children: formData.supportingDocuments ? formData.supportingDocuments.name : t("Click to upload or drag & drop")
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											style: {
												color: mutedColor,
												fontSize: "0.7rem"
											},
											children: "PDF, JPG, PNG (max 10MB)"
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "fileUpload",
										type: "file",
										accept: ".pdf,.jpg,.jpeg,.png",
										style: { display: "none" },
										onChange: handleFileChange
									})
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex justify-content-end gap-2 mt-4 pt-3",
						style: { borderTop: `1px solid ${borderColor}` },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn border-0 premium-btn d-flex align-items-center gap-2",
							style: {
								background: isDark ? "#2d3248" : "#f1f5f9",
								color: textColor,
								borderRadius: "10px",
								padding: "0.5rem 1.5rem",
								fontSize: "0.85rem"
							},
							onClick: handleCloseForm,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTimes }), t("Cancel")]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							className: "btn border-0 text-white premium-btn d-flex align-items-center gap-2",
							style: {
								background: "linear-gradient(135deg, #06b6d4, #0d9488)",
								borderRadius: "10px",
								padding: "0.5rem 1.5rem",
								fontSize: "0.85rem"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSave }), editingTransaction ? t("Update") : t("Save")]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBox, {
				show: !!viewingTx,
				onClose: () => setViewingTx(null),
				title: `Transaction Details — ${viewingTx?.transactionNumber || ""}`,
				size: "xl",
				showClose: true,
				children: viewingTx && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row g-3",
					children: [[
						["Transaction Number", viewingTx.transactionNumber],
						["Transaction Date", viewingTx.transactionDate],
						["Reference Number", viewingTx.referenceNumber || "—"],
						["Company", viewingTx.company],
						["Branch", viewingTx.branch],
						["Bank Account", viewingTx.bankAccount],
						["Currency", viewingTx.currency],
						["Transaction Type", viewingTx.transactionType],
						["Exchange Rate", viewingTx.exchangeRate],
						["Original Amount", `${parseFloat(viewingTx.originalAmount).toLocaleString()} ${viewingTx.currency}`],
						["Converted Amount", `PKR ${parseFloat(viewingTx.convertedAmount).toLocaleString()}`],
						["Bank Charges", `PKR ${parseFloat(viewingTx.bankCharges).toLocaleString()}`],
						["Tax", `PKR ${parseFloat(viewingTx.tax).toLocaleString()}`],
						["Approval Status", viewingTx.approvalStatus],
						["Scheduled For", viewingTx.scheduledFor || "—"],
						["Created By", viewingTx.createdBy]
					].map(([label, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-md-4",
						style: formGroupStyle,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							style: labelStyle,
							children: label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								padding: "0.5rem 0.75rem",
								borderRadius: "10px",
								background: isDark ? "#1a1d29" : "#f8fafc",
								border: `1px solid ${borderColor}`,
								fontSize: "0.85rem",
								color: textColor,
								fontWeight: 500
							},
							children: value
						})]
					}, label)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-12",
						style: formGroupStyle,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							style: labelStyle,
							children: t("Description")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								padding: "0.5rem 0.75rem",
								borderRadius: "10px",
								background: isDark ? "#1a1d29" : "#f8fafc",
								border: `1px solid ${borderColor}`,
								fontSize: "0.85rem",
								color: textColor
							},
							children: viewingTx.description || "—"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex flex-wrap justify-content-end gap-2 mt-4 pt-3",
					style: { borderTop: `1px solid ${borderColor}` },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn border-0 premium-btn d-flex align-items-center gap-2",
							style: {
								background: isDark ? "#2d3248" : "#f1f5f9",
								color: textColor,
								borderRadius: "10px",
								padding: "0.45rem 1.1rem",
								fontSize: "0.82rem"
							},
							onClick: () => handlePrint({
								type: "single",
								tx: viewingTx
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPrint }), t("Print")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn border-0 text-white premium-btn d-flex align-items-center gap-2",
							style: {
								background: "linear-gradient(135deg, #10b981, #059669)",
								borderRadius: "10px",
								padding: "0.45rem 1.1rem",
								fontSize: "0.82rem"
							},
							onClick: () => {
								handleApprove(viewingTx);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCheckDouble }), t("Approve")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn border-0 text-white premium-btn d-flex align-items-center gap-2",
							style: {
								background: "linear-gradient(135deg, #ef4444, #dc2626)",
								borderRadius: "10px",
								padding: "0.45rem 1.1rem",
								fontSize: "0.82rem"
							},
							onClick: () => {
								handleReject(viewingTx);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTimesCircle }), t("Reject")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn border-0 text-white premium-btn d-flex align-items-center gap-2",
							style: {
								background: "linear-gradient(135deg, #06b6d4, #0d9488)",
								borderRadius: "10px",
								padding: "0.45rem 1.1rem",
								fontSize: "0.82rem"
							},
							onClick: () => {
								openSchedule(viewingTx);
								setViewingTx(null);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCalendarCheck }), t("Schedule")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn border-0 text-white premium-btn d-flex align-items-center gap-2",
							style: {
								background: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
								borderRadius: "10px",
								padding: "0.45rem 1.1rem",
								fontSize: "0.82rem"
							},
							onClick: () => handleCopy(viewingTx),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCopy }), t("Copy")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn border-0 text-white premium-btn d-flex align-items-center gap-2",
							style: {
								background: "linear-gradient(135deg, #f59e0b, #d97706)",
								borderRadius: "10px",
								padding: "0.45rem 1.1rem",
								fontSize: "0.82rem"
							},
							onClick: () => {
								handleOpenEdit(viewingTx);
								setViewingTx(null);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEdit }), t("Edit")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn border-0 premium-btn d-flex align-items-center gap-2",
							style: {
								background: isDark ? "#2d3248" : "#f1f5f9",
								color: textColor,
								borderRadius: "10px",
								padding: "0.45rem 1.1rem",
								fontSize: "0.82rem"
							},
							onClick: () => setViewingTx(null),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTimes }), t("Close")]
						})
					]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogBox, {
				show: !!schedulingTx,
				onClose: () => setSchedulingTx(null),
				title: `Schedule Transaction — ${schedulingTx?.transactionNumber || ""}`,
				size: "md",
				showClose: true,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: { marginBottom: "1rem" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							style: labelStyle,
							children: [
								t("Scheduled Date"),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-danger",
									children: "*"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "date",
							value: scheduleForm.scheduledFor,
							onChange: (e) => setScheduleForm((prev) => ({
								...prev,
								scheduledFor: e.target.value
							})),
							className: "tx-input",
							style: inputStyle
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: { marginBottom: "1rem" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							style: labelStyle,
							children: t("Schedule Note")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							rows: "3",
							placeholder: "Optional note for this schedule...",
							value: scheduleForm.note,
							onChange: (e) => setScheduleForm((prev) => ({
								...prev,
								note: e.target.value
							})),
							className: "tx-input",
							style: {
								...inputStyle,
								resize: "vertical"
							}
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex justify-content-end gap-2 pt-3",
						style: { borderTop: `1px solid ${borderColor}` },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn border-0 premium-btn d-flex align-items-center gap-2",
							style: {
								background: isDark ? "#2d3248" : "#f1f5f9",
								color: textColor,
								borderRadius: "10px",
								padding: "0.5rem 1.25rem",
								fontSize: "0.85rem"
							},
							onClick: () => setSchedulingTx(null),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTimes }), t("Cancel")]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn border-0 text-white premium-btn d-flex align-items-center gap-2",
							style: {
								background: "linear-gradient(135deg, #06b6d4, #0d9488)",
								borderRadius: "10px",
								padding: "0.5rem 1.25rem",
								fontSize: "0.85rem"
							},
							onClick: saveSchedule,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCalendarCheck }), t("Save Schedule")]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBox.Confirm, {
				show: !!deletingTx,
				onClose: () => setDeletingTx(null),
				onConfirm: confirmDelete,
				title: "Delete FX Transaction",
				message: `Are you sure you want to delete transaction "${deletingTx?.transactionNumber || deletingTx?.id}"? This action cannot be undone.`,
				confirmLabel: "Delete",
				variant: "danger"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBox.Confirm, {
				show: !!confirmAction,
				onClose: () => setConfirmAction(null),
				onConfirm: confirmStatusChange,
				title: confirmAction?.action === "approve" ? "Approve FX Transaction" : "Reject FX Transaction",
				message: `Are you sure you want to ${confirmAction?.action === "approve" ? "approve" : "reject"} transaction "${confirmAction?.tx?.transactionNumber || ""}"?`,
				confirmLabel: confirmAction?.action === "approve" ? "Approve" : "Reject",
				variant: confirmAction?.action === "approve" ? "success" : "danger"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBox, {
				show: !!featureModal,
				onClose: () => setFeatureModal(null),
				title: featureModal?.feature?.label || "Advanced Feature",
				size: "xl",
				showClose: true,
				children: featureModal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					featureModal.type === "approval" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: {
							color: mutedColor,
							fontSize: "0.85rem",
							marginBottom: "1rem"
						},
						children: "Review and approve pending FX transactions below. Approving updates the transaction status immediately."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "table-responsive",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "table align-middle mb-0 mc-table",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Transaction No." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Date" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Company" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Type" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-end",
									children: "Amount"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-end",
									children: "Converted"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-center",
									children: "Actions"
								})
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: transactions.filter((tx) => tx.approvalStatus === "Pending" || tx.approvalStatus === "In Progress").length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: "8",
								className: "text-center py-4",
								style: { color: mutedColor },
								children: "No transactions awaiting approval."
							}) }) : transactions.filter((tx) => tx.approvalStatus === "Pending" || tx.approvalStatus === "In Progress").map((tx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "fw-semibold",
									style: {
										color: "#06b6d4",
										fontSize: "0.82rem"
									},
									children: tx.transactionNumber
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: { color: textColor },
									children: tx.transactionDate
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: { color: textColor },
									children: tx.company
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: { color: textColor },
									children: tx.transactionType
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "text-end",
									style: { color: textColor },
									children: [
										Number(tx.originalAmount).toLocaleString(),
										" ",
										tx.currency
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "text-end fw-semibold",
									style: { color: "#06b6d4" },
									children: ["PKR ", Number(tx.convertedAmount).toLocaleString()]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "premium-badge",
									style: {
										background: "#fef9c3",
										color: "#ca8a04"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "badge-dot",
										style: { background: "#ca8a04" }
									}), tx.approvalStatus]
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "text-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex gap-2 justify-content-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "premium-action-btn",
											style: {
												color: "#10b981",
												background: isDark ? "#1e293b" : "#d1fae5"
											},
											title: "Approve",
											onClick: () => handleApprove(tx),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faCheckDouble,
												style: { fontSize: "0.75rem" }
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "premium-action-btn",
											style: {
												color: "#ef4444",
												background: isDark ? "#1e293b" : "#fee2e2"
											},
											title: "Reject",
											onClick: () => handleReject(tx),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faTimesCircle,
												style: { fontSize: "0.75rem" }
											})
										})]
									})
								})
							] }, tx.id)) })]
						})
					})] }),
					featureModal.type === "audit" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: {
							color: mutedColor,
							fontSize: "0.85rem",
							marginBottom: "1rem"
						},
						children: "Audit trail of all actions performed on FX transactions in this session."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "table-responsive",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "table align-middle mb-0 mc-table",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Timestamp" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Transaction" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Action" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Details" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "By" })
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: auditLog.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: "5",
								className: "text-center py-4",
								style: { color: mutedColor },
								children: "No audit records yet. Actions you take on transactions will appear here."
							}) }) : auditLog.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										color: mutedColor,
										whiteSpace: "nowrap"
									},
									children: entry.at
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "fw-semibold",
									style: {
										color: "#06b6d4",
										fontSize: "0.82rem"
									},
									children: entry.transactionNumber
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "premium-badge",
									style: {
										background: "#dbeafe",
										color: "#1d4ed8"
									},
									children: entry.action
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: { color: textColor },
									children: entry.detail
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: { color: mutedColor },
									children: entry.by
								})
							] }, entry.id)) })]
						})
					})] }),
					featureModal.type === "journals" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: {
							color: mutedColor,
							fontSize: "0.85rem",
							marginBottom: "1rem"
						},
						children: "Multi-currency journal summary derived from current FX transactions."
					}), (() => {
						const grouped = {};
						transactions.forEach((tx) => {
							const key = tx.currency;
							if (!grouped[key]) grouped[key] = {
								currency: key,
								count: 0,
								originalTotal: 0,
								convertedTotal: 0
							};
							grouped[key].count += 1;
							grouped[key].originalTotal += Number(tx.originalAmount) || 0;
							grouped[key].convertedTotal += Number(tx.convertedAmount) || 0;
						});
						const rows = Object.values(grouped);
						return rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-center py-4",
							style: { color: mutedColor },
							children: "No transactions to summarize."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "table align-middle mb-0 mc-table",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Currency" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-end",
									children: "Transactions"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-end",
									children: "Original Total"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-end",
									children: "Converted (PKR)"
								})
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "fw-bold",
									style: { color: "#06b6d4" },
									children: row.currency
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "text-end",
									style: { color: textColor },
									children: row.count
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "text-end",
									style: { color: textColor },
									children: row.originalTotal.toLocaleString(void 0, { maximumFractionDigits: 2 })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "text-end fw-semibold",
									style: { color: "#06b6d4" },
									children: ["PKR ", row.convertedTotal.toLocaleString(void 0, { maximumFractionDigits: 2 })]
								})
							] }, row.currency)) })]
						});
					})()] }),
					featureModal.type === "ledger" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: {
							color: mutedColor,
							fontSize: "0.85rem",
							marginBottom: "1rem"
						},
						children: "Automatic ledger posting preview for approved transactions."
					}), (() => {
						const approved = transactions.filter((tx) => tx.approvalStatus === "Approved");
						if (approved.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-center py-4",
							style: { color: mutedColor },
							children: "No approved transactions to post. Approve a transaction first."
						});
						const entries = [];
						approved.forEach((tx) => {
							entries.push({
								tx: tx.transactionNumber,
								date: tx.transactionDate,
								account: `${tx.currency} FCY Bank Account`,
								debit: `PKR ${Number(tx.convertedAmount).toLocaleString()}`,
								credit: "—"
							});
							entries.push({
								tx: tx.transactionNumber,
								date: tx.transactionDate,
								account: "Accounts Payable / Receivable",
								debit: "—",
								credit: `PKR ${Number(tx.convertedAmount).toLocaleString()}`
							});
						});
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "table align-middle mb-0 mc-table",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Transaction" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Date" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Account" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-end",
									children: "Debit"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-end",
									children: "Credit"
								})
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: entries.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "fw-semibold",
									style: {
										color: "#06b6d4",
										fontSize: "0.8rem"
									},
									children: e.tx
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: { color: textColor },
									children: e.date
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: { color: textColor },
									children: e.account
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "text-end",
									style: { color: "#10b981" },
									children: e.debit
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "text-end",
									style: { color: "#ef4444" },
									children: e.credit
								})
							] }, i)) })]
						});
					})()] }),
					featureModal.type === "gainloss" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: {
							color: mutedColor,
							fontSize: "0.85rem",
							marginBottom: "1rem"
						},
						children: "Realized / unrealized exchange gain or loss estimate for completed transactions."
					}), (() => {
						const completed = transactions.filter((tx) => tx.approvalStatus === "Completed" || tx.approvalStatus === "Approved");
						if (completed.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-center py-4",
							style: { color: mutedColor },
							children: "No completed transactions to calculate gains for."
						});
						const totalGain = completed.reduce((sum, tx) => {
							const converted = Number(tx.convertedAmount) || 0;
							const original = Number(tx.originalAmount) || 0;
							const rate = Number(tx.exchangeRate) || 0;
							return sum + (converted - (rate > 0 ? converted / rate * original : 0));
						}, 0);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-4 p-4 mb-3 d-flex align-items-center gap-3",
							style: {
								background: totalGain >= 0 ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
								border: `1px solid ${totalGain >= 0 ? "rgba(16,185,129,0.25)" : "rgba(239,68,68,0.25)"}`
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "d-flex align-items-center justify-content-center",
								style: {
									width: 52,
									height: 52,
									borderRadius: "1rem",
									background: totalGain >= 0 ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
									color: totalGain >= 0 ? "#10b981" : "#ef4444",
									fontSize: "1.3rem"
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCalculator })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									color: mutedColor,
									fontSize: "0.78rem"
								},
								children: "Net Estimated Gain / (Loss)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "fw-bold",
								style: {
									color: totalGain >= 0 ? "#10b981" : "#ef4444",
									fontSize: "1.4rem"
								},
								children: [
									totalGain >= 0 ? "+" : "−",
									"PKR ",
									Math.abs(totalGain).toLocaleString(void 0, { maximumFractionDigits: 2 })
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								color: mutedColor,
								fontSize: "0.78rem"
							},
							children: [
								"Based on ",
								completed.length,
								" completed transaction(s). This is an estimate using recorded rates; actual gain/loss depends on settlement date rates."
							]
						})] });
					})()] }),
					featureModal.type === "attachment" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							style: {
								color: mutedColor,
								fontSize: "0.85rem",
								marginBottom: "1rem"
							},
							children: "Select a transaction and upload a supporting document (PDF, JPG, PNG)."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								style: {
									...labelStyle,
									fontSize: "0.8rem"
								},
								children: "Transaction"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "tx-input",
								style: selectStyle,
								value: attachingTx?.id || "",
								onChange: (e) => setAttachingTx(transactions.find((tx) => String(tx.id) === e.target.value) || null),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "Select transaction..."
								}), transactions.map((tx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: tx.id,
									children: [
										tx.transactionNumber,
										" — ",
										tx.description || tx.transactionType
									]
								}, tx.id))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									style: {
										...labelStyle,
										fontSize: "0.8rem"
									},
									children: "Document"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center gap-3 p-3 rounded-3",
									style: {
										border: `2px dashed ${borderColor}`,
										background: isDark ? "#1a1d29" : "#f8fafc",
										cursor: "pointer"
									},
									onClick: () => document.getElementById("featureFileUpload").click(),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faCloudUploadAlt,
										style: {
											color: "#06b6d4",
											fontSize: "1.3rem"
										}
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											color: textColor,
											fontSize: "0.82rem",
											fontWeight: 500
										},
										children: attachingFile ? attachingFile.name : "Click to upload or drag & drop"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										style: {
											color: mutedColor,
											fontSize: "0.7rem"
										},
										children: "PDF, JPG, PNG (max 10MB)"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "featureFileUpload",
									type: "file",
									accept: ".pdf,.jpg,.jpeg,.png",
									style: { display: "none" },
									onChange: (e) => setAttachingFile(e.target.files[0])
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex justify-content-end gap-2 pt-3",
							style: { borderTop: `1px solid ${borderColor}` },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "btn border-0 premium-btn d-flex align-items-center gap-2",
								style: {
									background: isDark ? "#2d3248" : "#f1f5f9",
									color: textColor,
									borderRadius: "10px",
									padding: "0.45rem 1.1rem",
									fontSize: "0.82rem"
								},
								onClick: () => setFeatureModal(null),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTimes }), "Close"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "btn border-0 text-white premium-btn d-flex align-items-center gap-2",
								style: {
									background: "linear-gradient(135deg, #06b6d4, #0d9488)",
									borderRadius: "10px",
									padding: "0.45rem 1.1rem",
									fontSize: "0.82rem"
								},
								onClick: () => {
									if (!attachingTx) {
										addNotification?.("Please select a transaction.", "error");
										return;
									}
									if (!attachingFile) {
										addNotification?.("Please choose a document to upload.", "error");
										return;
									}
									setTransactions((prev) => prev.map((t) => t.id === attachingTx.id ? {
										...t,
										attachmentName: attachingFile.name
									} : t));
									logAudit(attachingTx, "Attachment Added", `Uploaded ${attachingFile.name}`);
									addNotification?.(`Document "${attachingFile.name}" attached to ${attachingTx.transactionNumber}.`, "success");
									setAttachingFile(null);
									setAttachingTx(null);
									setFeatureModal(null);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPaperclip }), "Attach Document"]
							})]
						})
					] }),
					featureModal.type === "info" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						style: {
							color: textColor,
							fontSize: "0.9rem",
							lineHeight: 1.6
						},
						children: featureModal.feature?.desc
					}), featureModal.feature?.label === "Bank Reconciliation" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center gap-3 p-3 rounded-3",
							style: {
								background: "rgba(16,185,129,0.08)",
								border: "1px solid rgba(16,185,129,0.15)"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faCheckCircle,
								style: {
									color: "#10b981",
									fontSize: "1.2rem"
								}
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "fw-semibold",
								style: {
									color: textColor,
									fontSize: "0.85rem"
								},
								children: "Reconciliation Ready"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
								style: { color: mutedColor },
								children: [
									"Your ",
									transactions.length,
									" FX transactions can be matched against foreign currency bank statements."
								]
							})] })]
						})
					})] })
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
						children: printPayload.type === "single" ? "FX Transaction Voucher" : printPayload.title || "FX Transactions Report"
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
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						style: {
							width: "100%",
							borderCollapse: "collapse"
						},
						children: [(() => {
							const t = printPayload.tx;
							return [
								["Transaction Number", t.transactionNumber],
								["Transaction Date", t.transactionDate],
								["Reference Number", t.referenceNumber || "—"],
								["Company", t.company],
								["Branch", t.branch],
								["Bank Account", t.bankAccount],
								["Currency", t.currency],
								["Transaction Type", t.transactionType],
								["Exchange Rate", t.exchangeRate],
								["Original Amount", `${Number(t.originalAmount).toLocaleString()} ${t.currency}`],
								["Converted Amount", `PKR ${Number(t.convertedAmount).toLocaleString()}`],
								["Bank Charges", `PKR ${Number(t.bankCharges).toLocaleString()}`],
								["Tax", `PKR ${Number(t.tax).toLocaleString()}`],
								["Approval Status", t.approvalStatus],
								["Scheduled For", t.scheduledFor || "—"],
								["Created By", t.createdBy]
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
						})(), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							style: {
								border: "1px solid #cbd5e1",
								padding: "6px 10px",
								background: "#f8fafc",
								fontWeight: 600,
								width: "40%"
							},
							children: "Description"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							style: {
								border: "1px solid #cbd5e1",
								padding: "6px 10px"
							},
							children: printPayload.tx.description || "—"
						})] })]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					style: {
						width: "100%",
						borderCollapse: "collapse",
						fontSize: "12px"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: [
						"Transaction No.",
						"Date",
						"Company",
						"Branch",
						"Currency",
						"Type",
						"Original",
						"Converted",
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
					}, h)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (printPayload.items || []).map((tx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							style: {
								border: "1px solid #cbd5e1",
								padding: "6px 8px"
							},
							children: tx.transactionNumber
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							style: {
								border: "1px solid #cbd5e1",
								padding: "6px 8px"
							},
							children: tx.transactionDate
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							style: {
								border: "1px solid #cbd5e1",
								padding: "6px 8px"
							},
							children: tx.company
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							style: {
								border: "1px solid #cbd5e1",
								padding: "6px 8px"
							},
							children: tx.branch
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							style: {
								border: "1px solid #cbd5e1",
								padding: "6px 8px"
							},
							children: tx.currency
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							style: {
								border: "1px solid #cbd5e1",
								padding: "6px 8px"
							},
							children: tx.transactionType
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							style: {
								border: "1px solid #cbd5e1",
								padding: "6px 8px",
								textAlign: "right"
							},
							children: Number(tx.originalAmount).toLocaleString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							style: {
								border: "1px solid #cbd5e1",
								padding: "6px 8px",
								textAlign: "right"
							},
							children: Number(tx.convertedAmount).toLocaleString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							style: {
								border: "1px solid #cbd5e1",
								padding: "6px 8px"
							},
							children: tx.approvalStatus
						})
					] }, tx.id)) })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { dangerouslySetInnerHTML: { __html: `
        .scale-up { animation: modalScaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        @keyframes modalScaleUp { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        #fx-print-area { display: none; }
        @media print {
          body * { visibility: hidden !important; }
          #fx-print-area { display: block !important; position: absolute; left: 0; top: 0; width: 100%; padding: 24px; color: #111; }
          #fx-print-area * { visibility: visible !important; }
        }
      ` } })
		]
	});
};
//#endregion
export { FxTransactions as default };
