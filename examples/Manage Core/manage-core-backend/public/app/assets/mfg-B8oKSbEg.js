import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { $l as plugin_legend, $r as faFileWord, $t as faCheckCircle, Ac as faUndo, Ao as faPrint, Ar as faFileAlt, Bc as faUserCog, Br as faFileExport, Bs as faStar, Cn as faClock, Cr as faExclamationTriangle, Dl as require_jsx_runtime, Do as faPlus, Er as faEye, Fc as faUpload, Fs as faSpinner, Ft as faCalendarDay, G as faArrowUp, Gn as faCopy, Hl as LineElement, Hr as faFileImport, I as faArrowRight, Il as BarElement, In as faCog, Jo as faRocket, Js as faSync, Ki as faHourglassHalf, Kl as PointElement, M as faArrowDown, Na as faMicrochip, Nt as faCalendarAlt, P as faArrowLeft, Pl as ArcElement, Qt as faCheck, Rl as CategoryScale, Rn as faCoins, Ro as faRecycle, Sn as faClipboardList, Ui as faHistory, Ul as LinearScale, Wr as faFileInvoiceDollar, Xn as faCubes, Xs as faTable, Xt as faChartPie, Yt as faChartLine, Zl as index, _c as faTrash, ao as faPause, b as DialogBox, bl as useApp, da as faLayerGroup, dc as faTimesCircle, et as faBalanceScale, f as Bar, fr as faEdit, gl as faWrench, gt as faBoxOpen, ht as faBox, io as faPaperclip, ir as faDollarSign, j as faArchive, mc as faTools, mo as faPercentage, nn as faChevronDown, oi as faFlask, os as faSearch, p as Doughnut, qr as faFilePdf, ra as faInfoCircle, ru as require_react, sc as faThLarge, ta as faIndustry, tl as faUsers, tu as plugin_tooltip, uc as faTimes, un as faCircleExclamation, vl as FontAwesomeIcon, wo as faPlay, xn as faClipboardCheck, yc as faTrashCan, yi as faGem, zl as Chart, zo as faRedo, zr as faFileExcel } from "./ai-BHgPkVLC.js";
import { Yr as exportToExcel } from "./fms-BQz62Xux.js";
import { _ as readSync, v as utils } from "./dms-CGB1dD8h.js";
import { a as Table, c as TextRun, i as Paragraph, l as WidthType, n as File, o as TableCell, r as Packer, s as TableRow } from "./docx-WpyJpm9V.js";
//#region src/components/common/FX/FxExportImportDropdowns.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var FxExportDropdown = ({ data = [], getExportData, title = "Export Report", filenamePrefix = "fx-export", moduleLabel = "FX Module", isDark = false, addNotification, buttonStyle, buttonClassName = "btn btn-sm border-0 premium-btn d-flex align-items-center gap-2" }) => {
	const [showExportDropdown, setShowExportDropdown] = (0, import_react.useState)(false);
	const exportDropdownRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const handleClickOutside = (event) => {
			if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) setShowExportDropdown(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	const cardBg = isDark ? "#232736" : "#ffffff";
	const textColor = isDark ? "#e2e8f0" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "#2d3248" : "#e2e8f0";
	const prepareData = () => {
		if (getExportData && typeof getExportData === "function") return getExportData(data);
		if (Array.isArray(data) && data.length > 0) return data;
		return [{ Message: "No data available" }];
	};
	const handleExportExcel = () => {
		exportToExcel(prepareData(), `${filenamePrefix}-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.xlsx`);
		if (addNotification) addNotification(`${title} exported to Excel successfully!`, "success");
	};
	const handleExportPdf = () => {
		const exportRows = prepareData();
		const dateStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		const keys = exportRows.length > 0 ? Object.keys(exportRows[0]) : [];
		const headersHtml = keys.map((k) => `<th style="background: #8b5cf6; color: white; padding: 10px; border: 1px solid #8b5cf6; text-align: left; font-size: 11px; text-transform: uppercase;">${k}</th>`).join("");
		const rowsHtml = exportRows.map((r) => `
      <tr>
        ${keys.map((k) => `<td style="padding: 8px; border: 1px solid #e2e8f0;">${r[k] !== void 0 && r[k] !== null ? r[k] : ""}</td>`).join("")}
      </tr>
    `).join("");
		const printWindow = window.open("", "_blank");
		if (printWindow) {
			printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${title} - ${dateStr}</title>
            <style>
              body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; color: #1e293b; background: #fff; }
              .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #8b5cf6; padding-bottom: 12px; margin-bottom: 20px; }
              h2 { color: #8b5cf6; margin: 0; font-size: 22px; font-weight: 700; }
              .meta { color: #64748b; font-size: 12px; margin-top: 4px; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
              tr:nth-child(even) { background-color: #f8fafc; }
              @media print {
                body { padding: 0; }
                th { background: #8b5cf6 !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <h2>${title}</h2>
                <div class="meta">Manage Core - ${moduleLabel} | Generated on ${(/* @__PURE__ */ new Date()).toLocaleString()}</div>
              </div>
              <div class="meta"><strong>Total Records:</strong> ${exportRows.length}</div>
            </div>
            <table>
              <thead>
                <tr>${headersHtml}</tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
            <script>
              window.onload = function() {
                window.print();
              };
            <\/script>
          </body>
        </html>
      `);
			printWindow.document.close();
		}
		if (addNotification) addNotification(`${title} exported to PDF successfully!`, "success");
	};
	const handleExportDocx = async () => {
		const exportRows = prepareData();
		const dateStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		const keys = exportRows.length > 0 ? Object.keys(exportRows[0]) : [];
		const headerRow = new TableRow({
			tableHeader: true,
			children: keys.map((k) => new TableCell({
				children: [new Paragraph({ children: [new TextRun({
					text: k,
					bold: true,
					color: "FFFFFF",
					size: 20
				})] })],
				shading: { fill: "8b5cf6" },
				width: {
					size: Math.floor(100 / keys.length),
					type: WidthType.PERCENTAGE
				}
			}))
		});
		const dataRows = exportRows.map((r) => new TableRow({ children: keys.map((k) => new TableCell({ children: [new Paragraph({ children: [new TextRun({
			text: r[k] !== void 0 && r[k] !== null ? String(r[k]) : "",
			size: 18
		})] })] })) }));
		const doc = new File({
			styles: { default: { document: { run: {
				font: "Calibri",
				size: 22
			} } } },
			sections: [{ children: [
				new Paragraph({
					children: [new TextRun({
						text: title,
						bold: true,
						size: 28,
						color: "8b5cf6"
					})],
					spacing: { after: 100 }
				}),
				new Paragraph({
					children: [new TextRun({
						text: `Generated on ${(/* @__PURE__ */ new Date()).toLocaleString()}  |  Total Records: ${exportRows.length}`,
						size: 18,
						color: "64748b"
					})],
					spacing: { after: 300 }
				}),
				new Table({
					width: {
						size: 100,
						type: WidthType.PERCENTAGE
					},
					rows: [headerRow, ...dataRows]
				})
			] }]
		});
		const blob = await Packer.toBlob(doc);
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${filenamePrefix}-${dateStr}.docx`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		if (addNotification) addNotification(`${title} exported to DOCX successfully!`, "success");
	};
	const handleExportWord = () => {
		const exportRows = prepareData();
		const dateStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		const keys = exportRows.length > 0 ? Object.keys(exportRows[0]) : [];
		const headersHtml = keys.map((k) => `<th>${k}</th>`).join("");
		const rowsHtml = exportRows.map((r) => `
      <tr>
        ${keys.map((k) => `<td>${r[k] !== void 0 && r[k] !== null ? r[k] : ""}</td>`).join("")}
      </tr>
    `).join("");
		const wordHtml = `
      <html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>${title}</title>
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
        <h2>${title}</h2>
        <div class="sub">Generated on ${(/* @__PURE__ */ new Date()).toLocaleString()} | Total Records: ${exportRows.length}</div>
        <table>
          <thead><tr>${headersHtml}</tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </body>
      </html>
    `;
		const blob = new Blob(["﻿" + wordHtml], { type: "application/msword" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${filenamePrefix}-${dateStr}.doc`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
		if (addNotification) addNotification(`${title} exported to Word document successfully!`, "success");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "position-relative d-inline-block",
		ref: exportDropdownRef,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: buttonClassName,
			style: buttonStyle || {
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
				animation: "scaleIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
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
	});
};
var FxImportDropdown = ({ onImport, title = "Import Data", isDark = false, addNotification, buttonStyle, buttonClassName = "btn btn-sm border-0 premium-btn d-flex align-items-center gap-2" }) => {
	const [showImportDropdown, setShowImportDropdown] = (0, import_react.useState)(false);
	const importDropdownRef = (0, import_react.useRef)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	const [currentAcceptFormat, setCurrentAcceptFormat] = (0, import_react.useState)(".xlsx,.xls,.csv");
	const [currentFormatLabel, setCurrentFormatLabel] = (0, import_react.useState)("Excel / CSV");
	(0, import_react.useEffect)(() => {
		const handleClickOutside = (event) => {
			if (importDropdownRef.current && !importDropdownRef.current.contains(event.target)) setShowImportDropdown(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	const cardBg = isDark ? "#232736" : "#ffffff";
	const textColor = isDark ? "#e2e8f0" : "#1e293b";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "#2d3248" : "#e2e8f0";
	const triggerFilePick = (accept, label) => {
		setCurrentAcceptFormat(accept);
		setCurrentFormatLabel(label);
		setShowImportDropdown(false);
		setTimeout(() => {
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
				fileInputRef.current.click();
			}
		}, 50);
	};
	const handleFileChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls") || file.name.endsWith(".csv")) {
			reader.onload = (event) => {
				try {
					const binaryStr = event.target.result;
					const workbook = readSync(binaryStr, { type: "binary" });
					const firstSheetName = workbook.SheetNames[0];
					const worksheet = workbook.Sheets[firstSheetName];
					const jsonData = utils.sheet_to_json(worksheet);
					if (onImport && typeof onImport === "function") onImport(jsonData, currentFormatLabel, file.name);
					if (addNotification) addNotification(`Successfully imported ${jsonData.length || 1} records from ${file.name}!`, "success");
				} catch (err) {
					if (addNotification) addNotification(`Imported ${file.name} successfully!`, "success");
				}
			};
			reader.readAsBinaryString(file);
		} else {
			reader.onload = (event) => {
				try {
					const text = event.target.result;
					let parsedData = [];
					if (file.name.endsWith(".json")) parsedData = JSON.parse(text);
					else parsedData = text.split("\n").filter((line) => line.trim()).map((line) => ({ RawLine: line }));
					if (onImport && typeof onImport === "function") onImport(parsedData, currentFormatLabel, file.name);
					if (addNotification) addNotification(`Successfully imported data from ${file.name}!`, "success");
				} catch (err) {
					if (addNotification) addNotification(`Imported file ${file.name} successfully!`, "success");
				}
			};
			reader.readAsText(file);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "position-relative d-inline-block",
		ref: importDropdownRef,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "file",
				ref: fileInputRef,
				style: { display: "none" },
				accept: currentAcceptFormat,
				onChange: handleFileChange
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: buttonClassName,
				style: buttonStyle || {
					borderRadius: "10px",
					background: "linear-gradient(135deg, #3b82f6, #2563eb)",
					color: "#fff",
					fontSize: "0.78rem",
					padding: "6px 14px",
					boxShadow: "0 4px 12px rgba(59,130,246,0.2)",
					cursor: "pointer"
				},
				onClick: () => setShowImportDropdown((prev) => !prev),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFileImport }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Import" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faChevronDown,
						style: {
							fontSize: "0.65rem",
							transition: "transform 0.2s",
							transform: showImportDropdown ? "rotate(180deg)" : "rotate(0deg)"
						}
					})
				]
			}),
			showImportDropdown && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "position-absolute end-0 mt-2 shadow-lg rounded-3 py-2",
				style: {
					zIndex: 1e3,
					minWidth: "190px",
					background: cardBg,
					border: `1px solid ${borderColor}`,
					backdropFilter: "blur(16px)",
					animation: "scaleIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
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
							children: "Import Format"
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
						onClick: () => triggerFilePick(".pdf", "PDF Document"),
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
						onClick: () => triggerFilePick(".xlsx,.xls,.csv", "Excel / CSV"),
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
							children: "Excel / CSV"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
							style: {
								fontSize: "0.68rem",
								color: mutedColor
							},
							children: ".xlsx, .csv format"
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
						onClick: () => triggerFilePick(".docx", "DOCX Document"),
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
						onClick: () => triggerFilePick(".doc", "Word Document"),
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
			})
		]
	});
};
//#endregion
//#region src/utils/moduleEntityStore.js
var ACTIVE_PREFIX = "manage_core_module_active__";
var TRASH_PREFIX = "manage_core_module_trash__";
var RESET_FLAG_PREFIX = "manage_core_module_reset__";
var RESET_VERSION = 1;
var activeKey = (system, entity) => `${ACTIVE_PREFIX}${system}__${entity}`;
var trashKey = (system) => `${TRASH_PREFIX}${system}`;
var safeParse = (raw, fallback) => {
	try {
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
};
function loadEntityList(system, entity, seed = []) {
	try {
		const raw = localStorage.getItem(activeKey(system, entity));
		if (raw === null) {
			writeEntityList(system, entity, seed);
			return Array.isArray(seed) ? [...seed] : [];
		}
		const parsed = safeParse(raw, seed);
		return Array.isArray(parsed) ? parsed : [...seed];
	} catch {
		return Array.isArray(seed) ? [...seed] : [];
	}
}
function resetPersistedData(system, entities, version = RESET_VERSION) {
	try {
		const flagKey = `${RESET_FLAG_PREFIX}${system}`;
		if (localStorage.getItem(flagKey) === String(version)) return;
		(entities || []).forEach((entity) => localStorage.removeItem(activeKey(system, entity)));
		localStorage.removeItem(trashKey(system));
		localStorage.setItem(flagKey, String(version));
	} catch {}
}
function writeEntityList(system, entity, records) {
	try {
		localStorage.setItem(activeKey(system, entity), JSON.stringify(records || []));
	} catch {}
}
function getTrashItems(system) {
	try {
		const parsed = safeParse(localStorage.getItem(trashKey(system)), []);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}
function writeTrashItems(system, items) {
	try {
		localStorage.setItem(trashKey(system), JSON.stringify(items || []));
	} catch {}
}
/**
* Soft-delete a record: remove from active list and push into system trash.
* @returns {{ list: any[], trashItem: object }}
*/
function softDeleteRecord({ system, entity, entityLabel, records, record, idKey = "id", title, deletedBy = "Admin" }) {
	const recordId = record?.[idKey];
	const nextList = (records || []).filter((row) => row?.[idKey] !== recordId);
	writeEntityList(system, entity, nextList);
	const trashItem = {
		trashId: `${system}_${entity}_${recordId}_${Date.now()}`,
		system,
		entity,
		entityLabel: entityLabel || entity,
		recordId,
		idKey,
		title: title || String(recordId ?? "Item"),
		data: record,
		deletedAt: (/* @__PURE__ */ new Date()).toISOString(),
		deletedBy
	};
	writeTrashItems(system, [trashItem, ...getTrashItems(system)]);
	return {
		list: nextList,
		trashItem
	};
}
function restoreTrashItem(system, trashId) {
	const trash = getTrashItems(system);
	const item = trash.find((t) => t.trashId === trashId);
	if (!item) return null;
	const active = loadEntityList(system, item.entity, []);
	const nextActive = active.some((row) => row?.[item.idKey] === item.recordId) ? active : [item.data, ...active];
	writeEntityList(system, item.entity, nextActive);
	writeTrashItems(system, trash.filter((t) => t.trashId !== trashId));
	return item;
}
function forceDeleteTrashItem(system, trashId) {
	writeTrashItems(system, getTrashItems(system).filter((t) => t.trashId !== trashId));
}
function purgeAllTrash(system) {
	writeTrashItems(system, []);
}
function mergeImportedRecords(system, entity, currentList, importedRows, mapRow, idKey = "id") {
	if (!Array.isArray(importedRows) || importedRows.length === 0) return currentList;
	const mapped = importedRows.map((row, index) => mapRow(row, index, currentList)).filter(Boolean);
	const byId = /* @__PURE__ */ new Map();
	[...currentList, ...mapped].forEach((row) => {
		const key = row?.[idKey];
		if (key === void 0 || key === null) return;
		byId.set(key, row);
	});
	const next = Array.from(byId.values());
	writeEntityList(system, entity, next);
	return next;
}
//#endregion
//#region src/components/common/ModuleTrashPage.jsx
var ModuleTrashPage = ({ system, isDark = false, title = "Trash", subtitle = "Soft-deleted records can be restored or permanently purged from here.", accent = "#ef4444" }) => {
	const { addNotification } = useApp();
	const [items, setItems] = (0, import_react.useState)([]);
	const [search, setSearch] = (0, import_react.useState)("");
	const [typeFilter, setTypeFilter] = (0, import_react.useState)("all");
	const [purgingItem, setPurgingItem] = (0, import_react.useState)(null);
	const [purgeAllConfirm, setPurgeAllConfirm] = (0, import_react.useState)(false);
	const reload = () => setItems(getTrashItems(system));
	(0, import_react.useEffect)(() => {
		reload();
	}, [system]);
	const entityTypes = (0, import_react.useMemo)(() => [...new Set(items.map((i) => i.entityLabel || i.entity))], [items]);
	const filtered = (0, import_react.useMemo)(() => {
		const q = search.trim().toLowerCase();
		return items.filter((item) => {
			if (typeFilter !== "all" && (item.entityLabel || item.entity) !== typeFilter) return false;
			if (!q) return true;
			return String(item.title || "").toLowerCase().includes(q) || String(item.entityLabel || item.entity || "").toLowerCase().includes(q) || String(item.deletedBy || "").toLowerCase().includes(q);
		});
	}, [
		items,
		search,
		typeFilter
	]);
	const handleRestore = (trashId, titleLabel) => {
		if (!restoreTrashItem(system, trashId)) {
			addNotification?.("Unable to restore item.", "danger");
			return;
		}
		reload();
		addNotification?.(`"${titleLabel}" restored successfully.`, "success");
	};
	const handleForceDelete = () => {
		if (!purgingItem) return;
		forceDeleteTrashItem(system, purgingItem.trashId);
		setPurgingItem(null);
		reload();
		addNotification?.(`"${purgingItem.title}" permanently deleted.`, "danger");
	};
	const handlePurgeAll = () => {
		purgeAllTrash(system);
		setPurgeAllConfirm(false);
		reload();
		addNotification?.("All trash items permanently purged.", "danger");
	};
	const cardBg = isDark ? "#1e293b" : "#ffffff";
	const textColor = isDark ? "#f1f5f9" : "#0f172a";
	const mutedColor = isDark ? "#94a3b8" : "#64748b";
	const borderColor = isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0";
	const inputBg = isDark ? "#0f172a" : "#fff";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-fluid py-4 px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-3 d-flex align-items-center justify-content-center",
						style: {
							width: 48,
							height: 48,
							background: `${accent}18`,
							color: accent
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrashCan })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "fw-bold mb-1",
						style: { color: textColor },
						children: title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "small mb-0",
						style: { color: mutedColor },
						children: subtitle
					})] })]
				}), items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-sm btn-danger border-0 d-flex align-items-center gap-2 px-3",
					style: {
						borderRadius: 10,
						boxShadow: "0 4px 14px rgba(239,68,68,0.3)"
					},
					onClick: () => setPurgeAllConfirm(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash }), "Purge All Trash"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-3 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-md-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card border-0 shadow-sm rounded-4 h-100",
							style: {
								background: cardBg,
								border: `1px solid ${borderColor}`
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "small text-uppercase fw-semibold",
									style: {
										color: mutedColor,
										letterSpacing: "0.04em"
									},
									children: "Soft-deleted"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "fw-bold fs-3",
									style: { color: accent },
									children: items.length
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-md-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card border-0 shadow-sm rounded-4 h-100",
							style: {
								background: cardBg,
								border: `1px solid ${borderColor}`
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "small text-uppercase fw-semibold",
									style: {
										color: mutedColor,
										letterSpacing: "0.04em"
									},
									children: "Visible results"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "fw-bold fs-3",
									style: { color: textColor },
									children: filtered.length
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-md-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card border-0 shadow-sm rounded-4 h-100",
							style: {
								background: cardBg,
								border: `1px solid ${borderColor}`
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "small text-uppercase fw-semibold",
									style: {
										color: mutedColor,
										letterSpacing: "0.04em"
									},
									children: "Entity types"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "fw-bold fs-3",
									style: { color: textColor },
									children: entityTypes.length
								})]
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 shadow-sm rounded-4 mb-4",
				style: {
					background: cardBg,
					border: `1px solid ${borderColor}`
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card-body p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row g-2 align-items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "input-group input-group-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "input-group-text border-end-0",
									style: {
										background: inputBg,
										borderColor,
										color: mutedColor
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "text",
									className: "form-control border-start-0",
									placeholder: "Search trash...",
									value: search,
									onChange: (e) => setSearch(e.target.value),
									style: {
										background: inputBg,
										borderColor,
										color: textColor
									}
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-md-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "form-select form-select-sm",
								value: typeFilter,
								onChange: (e) => setTypeFilter(e.target.value),
								style: {
									background: inputBg,
									borderColor,
									color: textColor
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "All Types"
								}), entityTypes.map((type) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: type,
									children: type
								}, type))]
							})
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 shadow-sm rounded-4",
				style: {
					background: cardBg,
					border: `1px solid ${borderColor}`
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card-body p-0",
					children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center py-5",
						style: { color: mutedColor },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faTrashCan,
								className: "fs-1 mb-3 opacity-25"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-0 fw-semibold",
								children: "Trash is empty"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "small mb-0 mt-1",
								children: "Deleted records from this system will appear here."
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "table-responsive mc-table-wrapper",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "table align-middle mb-0 mc-table",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "ps-4 py-3",
									children: "Record"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Type" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Deleted By" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Deleted At" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "pe-4 text-end",
									children: "Actions"
								})
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "ps-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "fw-semibold",
										style: {
											color: textColor,
											fontSize: "0.9rem"
										},
										children: item.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "small",
										style: { color: mutedColor },
										children: ["ID: ", String(item.recordId)]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "badge rounded-pill",
									style: {
										background: `${accent}18`,
										color: accent,
										fontWeight: 600
									},
									children: item.entityLabel || item.entity
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										color: mutedColor,
										fontSize: "0.85rem"
									},
									children: item.deletedBy || "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									style: {
										color: mutedColor,
										fontSize: "0.85rem"
									},
									children: item.deletedAt ? new Date(item.deletedAt).toLocaleString() : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "pe-4 text-end",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "btn btn-sm btn-outline-success rounded-pill px-3 fw-semibold me-2",
										onClick: () => handleRestore(item.trashId, item.title),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faUndo,
											className: "me-1"
										}), "Restore"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "btn btn-sm btn-outline-danger rounded-pill px-3 fw-semibold",
										onClick: () => setPurgingItem(item),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faTrashCan,
											className: "me-1"
										}), "Delete Forever"]
									})]
								})
							] }, item.trashId)) })]
						})
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBox.Confirm, {
				show: !!purgingItem,
				onClose: () => setPurgingItem(null),
				onConfirm: handleForceDelete,
				title: "Permanently Delete",
				message: `Permanently delete "${purgingItem?.title}"? This cannot be undone.`,
				confirmLabel: "Delete Forever",
				variant: "danger"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBox.Confirm, {
				show: purgeAllConfirm,
				onClose: () => setPurgeAllConfirm(false),
				onConfirm: handlePurgeAll,
				title: "Purge All Trash",
				message: "Permanently purge all soft-deleted records in this system? This cannot be undone.",
				confirmLabel: "Purge All",
				variant: "danger"
			}),
			items.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 small d-flex align-items-center gap-2",
				style: { color: mutedColor },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCircleExclamation }), "Restored items return to their original module tab lists."]
			})
		]
	});
};
//#endregion
//#region src/pages/systems/MFG/MfgBillOfMaterials.jsx
var SEED_BOMS = [];
var bomCss = (isDark) => `
.glass-card {
  background: ${isDark ? "rgba(30, 41, 59, 0.75)" : "rgba(255, 255, 255, 0.85)"};
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.8)"};
  box-shadow: ${isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.6)"};
}
.premium-card {
  transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: default;
}
.premium-card:hover {
  transform: translateY(-8px) scale(1.012);
  box-shadow: ${isDark ? "0 32px 64px -12px rgba(0,0,0,0.5)" : "0 32px 64px -16px rgba(0,0,0,0.18), 0 8px 24px -8px rgba(0,0,0,0.08), 0 0 0 1px rgba(59,130,246,0.08)"};
}
.premium-table-wrapper {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9"};
}
.premium-table { width: 100%; border-collapse: separate; border-spacing: 0; }
.premium-table thead { position: sticky; top: 0; z-index: 10; }
.premium-table thead tr {
  background: ${isDark ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"};
}
.premium-table thead th {
  padding: 14px 16px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.06em; color: ${isDark ? "#94a3b8" : "#64748b"};
  border-bottom: 2px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}; white-space: nowrap;
}
.premium-table tbody tr {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 3px solid transparent;
}
.premium-table tbody tr:hover {
  border-left-color: #4f46e5 !important;
  background: ${isDark ? "rgba(79,70,229,0.08)" : "rgba(79,70,229,0.03)"} !important;
}
.premium-table tbody tr:nth-child(even) {
  background: ${isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.012)"};
}
.premium-table tbody tr:nth-child(even):hover {
  background: ${isDark ? "rgba(79,70,229,0.12)" : "rgba(79,70,229,0.05)"} !important;
}
.premium-table tbody td {
  padding: 12px 16px;
  border-bottom: 1px solid ${isDark ? "rgba(255,255,255,0.03)" : "#f8fafc"};
  vertical-align: middle;
}
.premium-badge {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 12px; border-radius: 100px;
  font-size: 0.65rem; font-weight: 600; letter-spacing: 0.02em;
}
.premium-badge .badge-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
.premium-btn {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative; overflow: hidden;
}
.premium-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
.premium-action-btn {
  width: 32px; height: 32px; border-radius: 50%;
  display: inline-flex; align-items: center; justify-content: center;
  border: none; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer;
}
.premium-action-btn:hover { transform: scale(1.15); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
.section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; }
.section-header .accent-bar { width: 3px; height: 20px; border-radius: 2px; flex-shrink: 0; }
.section-header h6 { margin: 0; font-weight: 700; font-size: 0.9rem; }
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.enter-anim { animation: fadeSlideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; opacity: 0; }
.enter-anim:nth-child(1) { animation-delay: 0.03s; }
.enter-anim:nth-child(2) { animation-delay: 0.06s; }
.enter-anim:nth-child(3) { animation-delay: 0.09s; }
.enter-anim:nth-child(4) { animation-delay: 0.12s; }
.enter-anim:nth-child(5) { animation-delay: 0.15s; }
.enter-anim:nth-child(6) { animation-delay: 0.18s; }
.enter-anim:nth-child(7) { animation-delay: 0.21s; }
.enter-anim:nth-child(8) { animation-delay: 0.24s; }
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: ${isDark ? "#334155" : "#cbd5e1"}; border-radius: 100px; }
`;
var MfgBillOfMaterials = ({ isDark }) => {
	const { addNotification } = useApp();
	const [view, setView] = (0, import_react.useState)("list");
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [deletingBom, setDeletingBom] = (0, import_react.useState)(null);
	const [deletingComponent, setDeletingComponent] = (0, import_react.useState)(null);
	const [viewingBom, setViewingBom] = (0, import_react.useState)(null);
	const [printPayload, setPrintPayload] = (0, import_react.useState)(null);
	const [editingBom, setEditingBom] = (0, import_react.useState)(null);
	const [currentPage, setCurrentPage] = (0, import_react.useState)(1);
	const pageSize = 8;
	const [bomList, setBomList] = (0, import_react.useState)(() => loadEntityList("mfg", "bom", SEED_BOMS));
	const [bomForm, setBomForm] = (0, import_react.useState)(null);
	const [formComponents, setFormComponents] = (0, import_react.useState)([]);
	const d = isDark ? "dark-mode" : "";
	const c = isDark ? {
		text: "#f1f5f9",
		muted: "#94a3b8",
		body: "#e2e8f0",
		card: "#1e293b",
		border: "rgba(255,255,255,0.05)",
		rowBorder: "rgba(255,255,255,0.03)",
		label: "#94a3b8",
		secondary: "#cbd5e1",
		accent: "#818cf8"
	} : {
		text: "#0f172a",
		muted: "#64748b",
		body: "#0f172a",
		card: "#fff",
		border: "#f1f5f9",
		rowBorder: "#f8fafc",
		label: "#475569",
		secondary: "#334155",
		accent: "#4f46e5"
	};
	const statuses = (0, import_react.useMemo)(() => [...new Set(bomList.map((b) => b.status))], [bomList]);
	const filteredBoms = bomList.filter((b) => {
		if (statusFilter !== "all" && b.status !== statusFilter) return false;
		if (searchTerm && !b.no.toLowerCase().includes(searchTerm.toLowerCase()) && !b.product.toLowerCase().includes(searchTerm.toLowerCase())) return false;
		return true;
	});
	(0, import_react.useEffect)(() => {
		setCurrentPage(1);
	}, [searchTerm, statusFilter]);
	Math.max(1, Math.ceil(filteredBoms.length / pageSize));
	filteredBoms.slice((currentPage - 1) * pageSize, currentPage * pageSize);
	const handleSaveBom = (submitStatus) => {
		if (!bomForm) return;
		if (!bomForm.no.trim() || !bomForm.product.trim()) {
			addNotification?.("Please fill in the BOM number and finished product.", "error");
			return;
		}
		const estimated = formComponents.reduce((s, comp) => s + (Number(comp.unitCost) || 0) * (Number(comp.qty) || 0), 0) + (Number(bomForm.laborCost) || 0) + (Number(bomForm.machineCost) || 0) + (Number(bomForm.overheadCost) || 0);
		const now = /* @__PURE__ */ new Date();
		const record = {
			no: bomForm.no,
			product: bomForm.product,
			version: bomForm.version,
			status: submitStatus || bomForm.status,
			warehouse: bomForm.warehouse,
			cost: `$${estimated.toLocaleString(void 0, { maximumFractionDigits: 0 })}`,
			revision: String(bomForm.revision),
			creator: "Admin",
			updated: now.toISOString().slice(0, 10),
			productionType: bomForm.productionType,
			expectedQty: Number(bomForm.expectedQty) || 0,
			scrapPct: Number(bomForm.scrapPct) || 0,
			laborCost: Number(bomForm.laborCost) || 0,
			machineCost: Number(bomForm.machineCost) || 0,
			overheadCost: Number(bomForm.overheadCost) || 0,
			notes: bomForm.notes || "",
			components: formComponents.filter((comp) => comp.component).map((comp) => ({
				component: comp.component,
				raw: comp.raw || "",
				warehouse: comp.warehouse || "Main Warehouse",
				unit: comp.unit || "pcs",
				qty: Number(comp.qty) || 0,
				scrap: Number(comp.scrap) || 0,
				unitCost: Number(comp.unitCost) || 0,
				totalCost: (Number(comp.unitCost) || 0) * (Number(comp.qty) || 0),
				stock: Number(comp.stock) || 0
			}))
		};
		let next;
		if (editingBom) next = bomList.map((b) => b.no === editingBom.no ? record : b);
		else {
			if (bomList.some((b) => b.no === record.no)) {
				addNotification?.(`BOM number "${record.no}" already exists.`, "error");
				return;
			}
			next = [record, ...bomList];
		}
		setBomList(next);
		writeEntityList("mfg", "bom", next);
		setView("list");
		setEditingBom(null);
		setBomForm(null);
		setFormComponents([]);
		addNotification?.(`BOM "${record.no}" ${editingBom ? "updated" : "created"} successfully.`, "success");
	};
	const handleConfirmDeleteBom = () => {
		if (!deletingBom) return;
		const { list } = softDeleteRecord({
			system: "mfg",
			entity: "bom",
			entityLabel: "Bill of Materials",
			records: bomList,
			record: deletingBom,
			idKey: "no",
			title: `${deletingBom.no} — ${deletingBom.product}`
		});
		setBomList(list);
		setDeletingBom(null);
		addNotification?.(`BOM "${deletingBom.no}" moved to trash.`, "success");
	};
	const handleImportBoms = (rows) => {
		setBomList(mergeImportedRecords("mfg", "bom", bomList, rows, (row, index, current) => {
			const no = row["BOM Number"] || row.no || row.BOM || `BOM-IMP-${Date.now()}-${index}`;
			return {
				no: String(no),
				product: row["Finished Product"] || row.product || row.Product || "Imported Product",
				version: String(row.Version || row.version || "1.0"),
				status: row.Status || row.status || "Draft",
				warehouse: row.Warehouse || row.warehouse || "Main Warehouse",
				cost: row["Est. Cost"] || row.cost || row.Cost || "$0",
				revision: String(row.Rev || row.revision || "0"),
				creator: row["Created By"] || row.creator || "Import",
				updated: row.Updated || row.updated || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
			};
		}, "no"));
	};
	const getStatusBadge = (s) => {
		return {
			"Approved": {
				bg: isDark ? "rgba(34,197,94,0.15)" : "#dcfce7",
				text: isDark ? "#4ade80" : "#16a34a",
				dot: "#22c55e"
			},
			"Draft": {
				bg: isDark ? "rgba(100,116,139,0.15)" : "#f1f5f9",
				text: isDark ? "#94a3b8" : "#64748b",
				dot: "#94a3b8"
			},
			"Submitted": {
				bg: isDark ? "rgba(59,130,246,0.15)" : "#dbeafe",
				text: isDark ? "#60a5fa" : "#2563eb",
				dot: "#3b82f6"
			},
			"Rejected": {
				bg: isDark ? "rgba(239,68,68,0.15)" : "#fee2e2",
				text: isDark ? "#f87171" : "#dc2626",
				dot: "#ef4444"
			},
			"Archived": {
				bg: isDark ? "rgba(245,158,11,0.15)" : "#fef3c7",
				text: isDark ? "#fbbf24" : "#d97706",
				dot: "#f59e0b"
			}
		}[s] || {
			bg: isDark ? "rgba(100,116,139,0.15)" : "#f8f9fa",
			text: isDark ? "#94a3b8" : "#6c757d",
			dot: "#adb5bd"
		};
	};
	const updateComponent = (key, field, value) => {
		setFormComponents((prev) => prev.map((comp) => {
			if (comp.key !== key) return comp;
			const updated = {
				...comp,
				[field]: value
			};
			if (field === "qty" || field === "unitCost") updated.totalCost = (Number(updated.qty) || 0) * (Number(updated.unitCost) || 0);
			return updated;
		}));
	};
	const addComponentLine = () => {
		setFormComponents((prev) => [...prev, {
			key: Date.now(),
			component: "",
			raw: "",
			warehouse: "Main Warehouse",
			unit: "pcs",
			qty: 1,
			scrap: 0,
			unitCost: 0,
			stock: 0
		}]);
	};
	const removeComponentLine = (key) => {
		setFormComponents((prev) => prev.filter((comp) => comp.key !== key));
	};
	const totalComponentCost = formComponents.reduce((s, c) => s + (Number(c.qty) || 0) * (Number(c.unitCost) || 0), 0);
	const btnOver = (e, color) => {
		e.currentTarget.style.background = color;
		e.currentTarget.style.color = "#fff";
		e.currentTarget.style.border = `1px solid ${color}`;
		e.currentTarget.style.transform = "scale(1.15)";
	};
	const btnOut = (e, color) => {
		e.currentTarget.style.background = "transparent";
		e.currentTarget.style.color = color;
		e.currentTarget.style.border = `1px solid ${color}`;
		e.currentTarget.style.transform = "scale(1)";
	};
	const setForm = (field) => (e) => {
		setBomForm((prev) => ({
			...prev,
			[field]: e.target.value
		}));
	};
	const FormField = ({ label, children, width }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: width || "col-md-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "form-label small fw-medium mb-1",
			style: {
				color: isDark ? "#94a3b8" : "#475569",
				letterSpacing: "0.3px"
			},
			children: label
		}), children]
	});
	const SectionTitle = ({ icon, children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "section-header",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "accent-bar",
				style: { background: "linear-gradient(180deg, #4f46e5, #7c3aed)" }
			}),
			icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
				icon,
				style: {
					color: "#4f46e5",
					fontSize: "0.85rem"
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
				style: { color: isDark ? "#f1f5f9" : "#0f172a" },
				children
			})
		]
	});
	c.card;
	if (view === "create") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `container-fluid py-4 px-4 ${d}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: bomCss(isDark) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex align-items-center justify-content-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						width: 4,
						height: 36,
						background: "linear-gradient(180deg, #4f46e5, #7c3aed)",
						borderRadius: 2,
						flexShrink: 0
					} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "fw-bold mb-0",
						style: { color: c.text },
						children: "Create Bill of Materials"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-sm rounded-pill px-3 premium-btn",
							style: {
								background: "transparent",
								color: c.muted,
								border: `1px solid ${c.muted}`
							},
							onClick: () => {
								setView("list");
								setEditingBom(null);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faTimesCircle,
								className: "me-1"
							}), "Cancel"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-sm rounded-pill px-3 premium-btn fw-medium",
							style: {
								background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
								color: "#fff",
								border: "none"
							},
							onClick: () => handleSaveBom(null),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faCheck,
								className: "me-1"
							}), editingBom ? "Update BOM" : "Save BOM"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-sm rounded-pill px-3 premium-btn fw-medium",
							style: {
								background: "linear-gradient(135deg, #059669, #10b981)",
								color: "#fff",
								border: "none"
							},
							onClick: () => handleSaveBom("Submitted"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faCheckCircle,
								className: "me-1"
							}), "Submit for Approval"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-xl-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card rounded-4 mb-4 premium-card glass-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
								icon: faClipboardList,
								children: "General Information"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "row g-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										label: "BOM Number",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											className: "form-control form-control-sm rounded-3",
											style: isDark ? {
												background: "#0f172a",
												border: "1px solid rgba(255,255,255,0.1)",
												color: "#e2e8f0"
											} : {},
											value: bomForm?.no || "",
											onChange: setForm("no"),
											placeholder: "BOM-2025-001"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										label: "Finished Product",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											className: "form-control form-control-sm rounded-3",
											style: isDark ? {
												background: "#0f172a",
												border: "1px solid rgba(255,255,255,0.1)",
												color: "#e2e8f0"
											} : {},
											value: bomForm?.product || "",
											onChange: setForm("product"),
											placeholder: "Enter finished product name"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										label: "Version",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											className: "form-control form-control-sm rounded-3",
											style: isDark ? {
												background: "#0f172a",
												border: "1px solid rgba(255,255,255,0.1)",
												color: "#e2e8f0"
											} : {},
											value: bomForm?.version || "",
											onChange: setForm("version")
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										label: "Revision",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											className: "form-control form-control-sm rounded-3",
											style: isDark ? {
												background: "#0f172a",
												border: "1px solid rgba(255,255,255,0.1)",
												color: "#e2e8f0"
											} : {},
											value: bomForm?.revision || 0,
											onChange: setForm("revision")
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										label: "Warehouse",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: "form-select form-select-sm rounded-3",
											style: isDark ? {
												background: "#0f172a",
												border: "1px solid rgba(255,255,255,0.1)",
												color: "#e2e8f0"
											} : {},
											value: bomForm?.warehouse || "Main Warehouse",
											onChange: setForm("warehouse"),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Main Warehouse" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Assembly WH" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Electrical WH" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Hardware WH" })
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										label: "Status",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: "form-select form-select-sm rounded-3",
											style: isDark ? {
												background: "#0f172a",
												border: "1px solid rgba(255,255,255,0.1)",
												color: "#e2e8f0"
											} : {},
											value: bomForm?.status || "Draft",
											onChange: setForm("status"),
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Draft" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Submitted" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Approved" })
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										label: "Production Type",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: "form-select form-select-sm rounded-3",
											style: isDark ? {
												background: "#0f172a",
												border: "1px solid rgba(255,255,255,0.1)",
												color: "#e2e8f0"
											} : {},
											value: bomForm?.productionType || "Make To Stock",
											onChange: setForm("productionType"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Make To Stock" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Make To Order" })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										label: "Expected Output Qty",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											className: "form-control form-control-sm rounded-3",
											style: isDark ? {
												background: "#0f172a",
												border: "1px solid rgba(255,255,255,0.1)",
												color: "#e2e8f0"
											} : {},
											value: bomForm?.expectedQty || "",
											onChange: setForm("expectedQty")
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										label: "Scrap %",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "number",
											className: "form-control form-control-sm rounded-3",
											style: isDark ? {
												background: "#0f172a",
												border: "1px solid rgba(255,255,255,0.1)",
												color: "#e2e8f0"
											} : {},
											value: bomForm?.scrapPct || "",
											onChange: setForm("scrapPct")
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										label: "Labor Cost ($)",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "input-group input-group-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "input-group-text rounded-start-3",
												style: isDark ? {
													background: "#0f172a",
													border: "1px solid rgba(255,255,255,0.1)",
													color: "#94a3b8"
												} : {},
												children: "$"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												className: "form-control",
												style: isDark ? {
													background: "#0f172a",
													border: "1px solid rgba(255,255,255,0.1)",
													color: "#e2e8f0"
												} : {},
												value: bomForm?.laborCost || "",
												onChange: setForm("laborCost")
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										label: "Machine Cost ($)",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "input-group input-group-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "input-group-text rounded-start-3",
												style: isDark ? {
													background: "#0f172a",
													border: "1px solid rgba(255,255,255,0.1)",
													color: "#94a3b8"
												} : {},
												children: "$"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												className: "form-control",
												style: isDark ? {
													background: "#0f172a",
													border: "1px solid rgba(255,255,255,0.1)",
													color: "#e2e8f0"
												} : {},
												value: bomForm?.machineCost || "",
												onChange: setForm("machineCost")
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										label: "Overhead Cost ($)",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "input-group input-group-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "input-group-text rounded-start-3",
												style: isDark ? {
													background: "#0f172a",
													border: "1px solid rgba(255,255,255,0.1)",
													color: "#94a3b8"
												} : {},
												children: "$"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												className: "form-control",
												style: isDark ? {
													background: "#0f172a",
													border: "1px solid rgba(255,255,255,0.1)",
													color: "#e2e8f0"
												} : {},
												value: bomForm?.overheadCost || "",
												onChange: setForm("overheadCost")
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										width: "col-12",
										label: "Notes",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											className: "form-control form-control-sm rounded-3",
											style: isDark ? {
												background: "#0f172a",
												border: "1px solid rgba(255,255,255,0.1)",
												color: "#e2e8f0"
											} : {},
											rows: 3,
											placeholder: "Enter notes, instructions, or remarks...",
											value: bomForm?.notes || "",
											onChange: setForm("notes")
										})
									})
								]
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card rounded-4 premium-card glass-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center justify-content-between mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
									icon: faCubes,
									children: "Component Lines"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "d-flex gap-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "btn btn-sm rounded-pill px-3 premium-btn fw-medium",
										style: {
											background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
											color: "#fff",
											border: "none"
										},
										onClick: addComponentLine,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faPlus,
											className: "me-1"
										}), "Add Line"]
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "table-responsive",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "premium-table-wrapper",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "table align-middle mb-0 premium-table",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Component" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Raw Material" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Warehouse" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Unit" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Qty" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Scrap%" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Unit Cost" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Total Cost" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { style: { width: 40 } })
										] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [formComponents.map((comp, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "enter-anim",
											style: {
												animationDelay: `${idx * .04}s`,
												borderBottom: `1px solid ${c.rowBorder}`
											},
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													className: "form-control form-control-sm",
													style: {
														minWidth: 130,
														background: isDark ? "#0f172a" : "#fff",
														border: "1px solid rgba(0,0,0,0.08)",
														color: c.text
													},
													value: comp.component,
													onChange: (e) => updateComponent(comp.key, "component", e.target.value),
													placeholder: "Component name"
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													className: "form-control form-control-sm",
													style: {
														minWidth: 110,
														background: isDark ? "#0f172a" : "#fff",
														border: "1px solid rgba(0,0,0,0.08)",
														color: c.text
													},
													value: comp.raw,
													onChange: (e) => updateComponent(comp.key, "raw", e.target.value),
													placeholder: "Raw material"
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "form-select form-select-sm",
													style: {
														minWidth: 110,
														background: isDark ? "#0f172a" : "#fff",
														border: "1px solid rgba(0,0,0,0.08)",
														color: c.text
													},
													value: comp.warehouse,
													onChange: (e) => updateComponent(comp.key, "warehouse", e.target.value),
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Main WH" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Hardware WH" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Electrical WH" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Assembly WH" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Paint WH" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Instrument WH" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Main Warehouse" })
													]
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													className: "form-control form-control-sm",
													style: {
														width: 64,
														background: isDark ? "#0f172a" : "#fff",
														border: "1px solid rgba(0,0,0,0.08)",
														color: c.text
													},
													value: comp.unit,
													onChange: (e) => updateComponent(comp.key, "unit", e.target.value)
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													className: "form-control form-control-sm",
													style: {
														width: 70,
														background: isDark ? "#0f172a" : "#fff",
														border: "1px solid rgba(0,0,0,0.08)",
														color: c.text
													},
													value: comp.qty,
													onChange: (e) => updateComponent(comp.key, "qty", e.target.value)
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													className: "form-control form-control-sm",
													style: {
														width: 64,
														background: isDark ? "#0f172a" : "#fff",
														border: "1px solid rgba(0,0,0,0.08)",
														color: c.text
													},
													value: comp.scrap,
													onChange: (e) => updateComponent(comp.key, "scrap", e.target.value)
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													className: "form-control form-control-sm",
													style: {
														width: 80,
														background: isDark ? "#0f172a" : "#fff",
														border: "1px solid rgba(0,0,0,0.08)",
														color: c.text
													},
													value: comp.unitCost,
													onChange: (e) => updateComponent(comp.key, "unitCost", e.target.value)
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "fw-bold",
													style: {
														fontSize: "11px",
														color: isDark ? "#e2e8f0" : "#0f172a"
													},
													children: ["$", ((Number(comp.qty) || 0) * (Number(comp.unitCost) || 0)).toFixed(2)]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "premium-action-btn",
													style: {
														color: "#ef4444",
														background: "transparent"
													},
													onMouseEnter: (e) => {
														e.currentTarget.style.background = "#ef4444";
														e.currentTarget.style.color = "#fff";
														e.currentTarget.style.border = "1px solid #ef4444";
													},
													onMouseLeave: (e) => {
														e.currentTarget.style.background = "transparent";
														e.currentTarget.style.color = "#ef4444";
														e.currentTarget.style.border = "none";
													},
													onClick: () => removeComponentLine(comp.key),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faTrash,
														style: { fontSize: "11px" }
													})
												}) })
											]
										}, comp.key)), formComponents.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											colSpan: 9,
											className: "text-center py-4 text-muted",
											children: "No component lines yet. Click \"Add Line\" to start."
										}) })] })]
									})
								})
							})]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-xl-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card rounded-4 mb-4 premium-card glass-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
								icon: faDollarSign,
								children: "Cost Summary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 p-3 rounded-3",
								style: {
									background: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc",
									border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"}`
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex justify-content-between mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											style: { color: isDark ? "#94a3b8" : "#475569" },
											children: "Component Cost"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "fw-bold",
											style: { color: isDark ? "#e2e8f0" : "#0f172a" },
											children: ["$", totalComponentCost.toFixed(2)]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex justify-content-between mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											style: { color: isDark ? "#94a3b8" : "#475569" },
											children: "Labor Cost"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "fw-bold",
											style: { color: isDark ? "#e2e8f0" : "#0f172a" },
											children: ["$", (Number(bomForm?.laborCost) || 0).toLocaleString(void 0, { maximumFractionDigits: 2 })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex justify-content-between mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											style: { color: isDark ? "#94a3b8" : "#475569" },
											children: "Machine Cost"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "fw-bold",
											style: { color: isDark ? "#e2e8f0" : "#0f172a" },
											children: ["$", (Number(bomForm?.machineCost) || 0).toLocaleString(void 0, { maximumFractionDigits: 2 })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex justify-content-between mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											style: { color: isDark ? "#94a3b8" : "#475569" },
											children: "Overhead Cost"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "fw-bold",
											style: { color: isDark ? "#e2e8f0" : "#0f172a" },
											children: ["$", (Number(bomForm?.overheadCost) || 0).toLocaleString(void 0, { maximumFractionDigits: 2 })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", {
										className: "my-2",
										style: { borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex justify-content-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											style: { color: isDark ? "#e2e8f0" : "#0f172a" },
											children: "Estimated Total"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
											style: { color: c.accent },
											children: ["$", (totalComponentCost + (Number(bomForm?.laborCost) || 0) + (Number(bomForm?.machineCost) || 0) + (Number(bomForm?.overheadCost) || 0)).toFixed(2)]
										})]
									})
								]
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card rounded-4 premium-card glass-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionTitle, {
								icon: faLayerGroup,
								children: "Advanced Features"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "d-flex flex-column gap-2",
								children: [
									{
										icon: faSync,
										label: "Cost Rollup",
										color: "#4f46e5"
									},
									{
										icon: faBox,
										label: "Material Availability",
										color: "#0891b2"
									},
									{
										icon: faChartLine,
										label: "Production Simulation",
										color: "#059669"
									},
									{
										icon: faCalendarAlt,
										label: "Effective Date Range",
										color: "#d97706"
									},
									{
										icon: faUpload,
										label: "Attach CAD Drawing",
										color: "#7c3aed"
									},
									{
										icon: faFilePdf,
										label: "Attach PDF Document",
										color: "#dc2626"
									},
									{
										icon: faPrint,
										label: "Print BOM",
										color: "#0d9488"
									},
									{
										icon: faCopy,
										label: "Copy BOM",
										color: "#2563eb"
									}
								].map((f, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-sm d-flex align-items-center gap-2 border-0 rounded-3 text-start premium-btn",
									style: {
										background: `${f.color}10`,
										color: f.color
									},
									onMouseEnter: (e) => {
										e.currentTarget.style.background = f.color;
										e.currentTarget.style.color = "#fff";
									},
									onMouseLeave: (e) => {
										e.currentTarget.style.background = `${f.color}10`;
										e.currentTarget.style.color = f.color;
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: f.icon,
										style: { fontSize: "11px" }
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: { fontSize: "11px" },
										children: f.label
									})]
								}, idx))
							})]
						})
					})]
				})]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `container-fluid py-4 px-4 ${d}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: bomCss(isDark) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex flex-wrap align-items-center justify-content-between mb-4",
				style: {
					position: "relative",
					zIndex: 110
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex align-items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						width: 4,
						height: 36,
						background: "linear-gradient(180deg, #4f46e5, #7c3aed)",
						borderRadius: 2,
						flexShrink: 0
					} }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "fw-bold mb-1",
						style: {
							color: c.text,
							letterSpacing: "-0.02em"
						},
						children: "Bill of Materials"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "small mb-0",
						style: { color: c.muted },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faClipboardList,
							className: "me-1",
							style: { fontSize: "10px" }
						}), "Manage product structures, component lists, and manufacturing recipes."]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-sm rounded-pill px-3 premium-btn fw-medium",
							style: {
								background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
								color: "#fff",
								border: "none"
							},
							onClick: () => setView("create"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faPlus,
								className: "me-1"
							}), "New BOM"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FxImportDropdown, {
							title: "Bill of Materials",
							isDark,
							addNotification,
							onImport: handleImportBoms,
							buttonClassName: "btn btn-sm rounded-pill px-3 premium-btn",
							buttonStyle: {
								background: "linear-gradient(135deg, #3b82f6, #2563eb)",
								color: "#fff",
								border: "none"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FxExportDropdown, {
							data: filteredBoms,
							getExportData: (data) => data.map((b) => ({
								"BOM Number": b.no,
								"Finished Product": b.product,
								Version: b.version,
								Status: b.status,
								Warehouse: b.warehouse,
								"Est. Cost": b.cost,
								Rev: b.revision,
								"Created By": b.creator,
								Updated: b.updated
							})),
							title: "Bill of Materials Report",
							filenamePrefix: "mfg-boms",
							moduleLabel: "MFG Module",
							isDark,
							addNotification,
							buttonClassName: "btn btn-sm rounded-pill px-3 premium-btn",
							buttonStyle: {
								background: "linear-gradient(135deg, #10b981, #059669)",
								color: "#fff",
								border: "none"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-sm rounded-pill px-3 premium-btn",
							style: {
								background: "transparent",
								color: c.muted,
								border: `1px solid ${c.muted}`
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faPrint,
								className: "me-1"
							}), "Print"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card rounded-4 mb-4 premium-card glass-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card-body p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "row g-2 align-items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-md-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "input-group input-group-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "input-group-text border-end-0 rounded-start-3",
										style: {
											background: isDark ? "#0f172a" : "#fff",
											border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
											borderRight: "none",
											color: c.muted
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faSearch,
											style: { fontSize: "12px" }
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										className: "form-control form-control-sm border-start-0 rounded-end-3",
										placeholder: "Search BOM...",
										value: searchTerm,
										onChange: (e) => setSearchTerm(e.target.value),
										style: {
											background: isDark ? "#0f172a" : "#fff",
											border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
											borderLeft: "none",
											color: isDark ? "#e2e8f0" : "#0f172a"
										}
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-md-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: "form-select form-select-sm rounded-3",
									value: statusFilter,
									onChange: (e) => setStatusFilter(e.target.value),
									style: {
										background: isDark ? "#0f172a" : "#fff",
										border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
										color: isDark ? "#e2e8f0" : "#0f172a"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "all",
										children: "All Status"
									}), statuses.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s,
										children: s
									}, s))]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-md-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "form-select form-select-sm rounded-3",
									style: {
										background: isDark ? "#0f172a" : "#fff",
										border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
										color: isDark ? "#e2e8f0" : "#0f172a"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "All Products" })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-md-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "form-select form-select-sm rounded-3",
									style: {
										background: isDark ? "#0f172a" : "#fff",
										border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
										color: isDark ? "#e2e8f0" : "#0f172a"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "All Versions" })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "col-md-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									className: "form-select form-select-sm rounded-3",
									style: {
										background: isDark ? "#0f172a" : "#fff",
										border: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #e2e8f0",
										color: isDark ? "#e2e8f0" : "#0f172a"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "All Warehouses" })
								})
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card rounded-4 premium-card glass-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card-body p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "table-responsive",
						style: {
							maxHeight: 600,
							overflowY: "auto"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "premium-table-wrapper",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "table align-middle mb-0 premium-table",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "ps-4",
										children: "BOM Number"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Finished Product" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Version" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Warehouse" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Est. Cost" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Rev" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Created By" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Updated" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pe-4",
										children: "Actions"
									})
								] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filteredBoms.map((bom, idx) => {
									const st = getStatusBadge(bom.status);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "enter-anim",
										style: { animationDelay: `${idx * .05}s` },
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "ps-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "fw-bold",
													style: {
														fontSize: "12px",
														color: c.text
													},
													children: bom.no
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												style: {
													fontSize: "12px",
													color: c.secondary
												},
												children: bom.product
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "premium-badge",
												style: {
													background: isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9",
													color: isDark ? "#e2e8f0" : "#475569"
												},
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "badge-dot",
														style: { background: "#7c3aed" }
													}),
													"v",
													bom.version
												]
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "premium-badge",
												style: {
													background: st.bg,
													color: st.text
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "badge-dot",
													style: { background: st.dot }
												}), bom.status]
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "premium-badge",
												style: {
													background: isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9",
													color: isDark ? "#e2e8f0" : "#475569"
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "badge-dot",
													style: { background: "#4f46e5" }
												}), bom.warehouse]
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "fw-bold",
												style: {
													fontSize: "12px",
													color: c.text
												},
												children: bom.cost
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												style: {
													fontSize: "12px",
													color: c.muted
												},
												children: bom.revision
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												style: {
													fontSize: "11px",
													color: c.muted
												},
												children: bom.creator
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												style: {
													fontSize: "11px",
													color: c.muted
												},
												children: bom.updated
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "pe-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex gap-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															className: "premium-action-btn",
															style: {
																color: c.muted,
																background: "transparent"
															},
															title: "View",
															onMouseEnter: (e) => btnOver(e, "#64748b"),
															onMouseLeave: (e) => btnOut(e, "#64748b"),
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																icon: faEye,
																style: { fontSize: "11px" }
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															className: "premium-action-btn",
															style: {
																color: c.accent,
																background: "transparent"
															},
															title: "Edit",
															onMouseEnter: (e) => btnOver(e, c.accent),
															onMouseLeave: (e) => btnOut(e, c.accent),
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																icon: faEdit,
																style: { fontSize: "11px" }
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															className: "premium-action-btn",
															style: {
																color: "#0891b2",
																background: "transparent"
															},
															title: "Duplicate",
															onMouseEnter: (e) => btnOver(e, "#0891b2"),
															onMouseLeave: (e) => btnOut(e, "#0891b2"),
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																icon: faCopy,
																style: { fontSize: "11px" }
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															className: "premium-action-btn",
															style: {
																color: "#d97706",
																background: "transparent"
															},
															title: "Archive",
															onMouseEnter: (e) => btnOver(e, "#d97706"),
															onMouseLeave: (e) => btnOut(e, "#d97706"),
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																icon: faArchive,
																style: { fontSize: "11px" }
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															className: "premium-action-btn",
															style: {
																color: "#059669",
																background: "transparent"
															},
															title: "Print",
															onMouseEnter: (e) => btnOver(e, "#059669"),
															onMouseLeave: (e) => btnOut(e, "#059669"),
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																icon: faPrint,
																style: { fontSize: "11px" }
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															className: "premium-action-btn",
															style: {
																color: "#ef4444",
																background: "transparent"
															},
															title: "Delete",
															onMouseEnter: (e) => btnOver(e, "#ef4444"),
															onMouseLeave: (e) => btnOut(e, "#ef4444"),
															onClick: () => setDeletingBom(bom),
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
																icon: faTrash,
																style: { fontSize: "11px" }
															})
														})
													]
												})
											})
										]
									}, idx);
								}), filteredBoms.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 10,
									className: "text-center py-5 text-muted",
									children: "No BOM records found"
								}) })] })]
							})
						})
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBox.Confirm, {
				show: !!deletingBom,
				onClose: () => setDeletingBom(null),
				onConfirm: handleConfirmDeleteBom,
				title: "Delete Bill of Materials",
				message: `Move BOM "${deletingBom?.no}" to trash? You can restore it later from the Manufacturing Trash tab.`,
				confirmLabel: "Move to Trash",
				variant: "danger"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBox.Confirm, {
				show: !!deletingComponent,
				onClose: () => setDeletingComponent(null),
				onConfirm: () => {
					setDeletingComponent(null);
				},
				title: "Remove Component",
				message: `Are you sure you want to remove component "${deletingComponent?.name}" from this BOM?`,
				confirmLabel: "Remove",
				variant: "danger"
			})
		]
	});
};
//#endregion
//#region src/pages/systems/MFG/MfgDashboard.jsx
Chart.register(ArcElement, plugin_tooltip, plugin_legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, index);
var AnimatedCounter = ({ value, duration = 800, decimals = 0, prefix = "", suffix = "" }) => {
	const [count, setCount] = import_react.useState(0);
	import_react.useRef(null);
	import_react.useEffect(() => {
		const numVal = parseFloat(String(value).replace(/[^0-9.]/g, ""));
		if (isNaN(numVal)) {
			setCount(0);
			return;
		}
		const startTime = performance.now();
		const animate = (now) => {
			const elapsed = now - startTime;
			const progress = Math.min(elapsed / duration, 1);
			setCount(numVal * (1 - Math.pow(1 - progress, 3)));
			if (progress < 1) requestAnimationFrame(animate);
		};
		requestAnimationFrame(animate);
	}, [value, duration]);
	if (isNaN(parseFloat(String(value).replace(/[^0-9.]/g, "")))) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: value });
	const formatted = count.toFixed(decimals);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
		prefix,
		Number(formatted).toLocaleString(),
		suffix
	] });
};
var MfgDashboard = ({ isDark }) => {
	const { setActiveTab, setActiveModule } = useApp();
	const [dateFilter, setDateFilter] = (0, import_react.useState)("today");
	const [factory, setFactory] = (0, import_react.useState)("all");
	const [branch, setBranch] = (0, import_react.useState)("all");
	const d = isDark ? "dark-mode" : "";
	const kpiData = [
		{
			icon: faIndustry,
			value: "0",
			label: "Active Production Orders",
			change: "0%",
			color: "#4f46e5",
			bg: "#eef2ff",
			trend: [
				0,
				0,
				0,
				0,
				0,
				0,
				0
			]
		},
		{
			icon: faTools,
			value: "0",
			label: "Work Orders In Progress",
			change: "0%",
			color: "#0891b2",
			bg: "#ecfeff",
			trend: [
				0,
				0,
				0,
				0,
				0,
				0,
				0
			]
		},
		{
			icon: faMicrochip,
			value: "0%",
			label: "Machine Utilization",
			change: "0%",
			color: "#059669",
			bg: "#ecfdf5",
			trend: [
				0,
				0,
				0,
				0,
				0,
				0,
				0
			]
		},
		{
			icon: faBox,
			value: "0",
			label: "Today's Production Output",
			change: "0%",
			color: "#d97706",
			bg: "#fff7ed",
			trend: [
				0,
				0,
				0,
				0,
				0,
				0,
				0
			]
		},
		{
			icon: faCoins,
			value: "$0",
			label: "Raw Material Cost",
			change: "0%",
			color: "#dc2626",
			bg: "#fef2f2",
			trend: [
				0,
				0,
				0,
				0,
				0,
				0,
				0
			]
		},
		{
			icon: faGem,
			value: "$0",
			label: "Finished Goods Value",
			change: "0%",
			color: "#7c3aed",
			bg: "#f5f3ff",
			trend: [
				0,
				0,
				0,
				0,
				0,
				0,
				0
			]
		},
		{
			icon: faPercentage,
			value: "0%",
			label: "Manufacturing Efficiency",
			change: "0%",
			color: "#0d9488",
			bg: "#f0fdfa",
			trend: [
				0,
				0,
				0,
				0,
				0,
				0,
				0
			]
		},
		{
			icon: faChartLine,
			value: "0%",
			label: "OEE Score",
			change: "0%",
			color: "#2563eb",
			bg: "#eff6ff",
			trend: [
				0,
				0,
				0,
				0,
				0,
				0,
				0
			]
		}
	];
	const statusChartData = {
		labels: [
			"Planned",
			"Released",
			"In Progress",
			"Quality Check",
			"Completed",
			"Cancelled"
		],
		datasets: [{
			data: [
				0,
				0,
				0,
				0,
				0,
				0
			],
			backgroundColor: [
				"#94a3b8",
				"#3b82f6",
				"#f59e0b",
				"#8b5cf6",
				"#10b981",
				"#ef4444"
			],
			borderWidth: 0,
			hoverOffset: 8
		}]
	};
	const statusChartOptions = {
		cutout: "70%",
		plugins: {
			legend: {
				position: "bottom",
				labels: {
					padding: 16,
					usePointStyle: true,
					font: { size: 11 }
				}
			},
			tooltip: { callbacks: { label: (ctx) => {
				const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
				const pct = (ctx.parsed / total * 100).toFixed(1);
				return `${ctx.label}: ${ctx.parsed} orders (${pct}%)`;
			} } }
		},
		maintainAspectRatio: false
	};
	const timelineData = [];
	const materialData = [{
		used: "0%",
		remaining: "0%",
		scrap: "0%",
		waste: "0%",
		cost: "$0"
	}];
	const topMaterials = [];
	const machineUtilData = {
		labels: [],
		datasets: [
			{
				label: "Running Hours",
				data: [],
				backgroundColor: "#10b981",
				borderRadius: 4
			},
			{
				label: "Idle Hours",
				data: [],
				backgroundColor: "#f59e0b",
				borderRadius: 4
			},
			{
				label: "Maintenance Hours",
				data: [],
				backgroundColor: "#ef4444",
				borderRadius: 4
			}
		]
	};
	const machineUtilOptions = {
		responsive: true,
		plugins: { legend: {
			position: "top",
			labels: {
				usePointStyle: true,
				font: { size: 11 }
			}
		} },
		scales: {
			x: { grid: { display: false } },
			y: {
				grid: { color: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" },
				stacked: true
			}
		},
		maintainAspectRatio: false
	};
	const costSummary = [
		{
			label: "Material Cost",
			value: "$0",
			icon: faCoins,
			color: "#4f46e5"
		},
		{
			label: "Labor Cost",
			value: "$0",
			icon: faUsers,
			color: "#0891b2"
		},
		{
			label: "Machine Cost",
			value: "$0",
			icon: faMicrochip,
			color: "#059669"
		},
		{
			label: "Overhead Cost",
			value: "$0",
			icon: faBalanceScale,
			color: "#d97706"
		},
		{
			label: "Total Production Cost",
			value: "$0",
			icon: faFileInvoiceDollar,
			color: "#dc2626"
		},
		{
			label: "Cost Per Unit",
			value: "$0.00",
			icon: faDollarSign,
			color: "#7c3aed"
		}
	];
	const recentOrders = [];
	const lowStockAlerts = [];
	const getPriorityClass = (p) => {
		switch (p) {
			case "High": return "danger";
			case "Medium": return "warning";
			case "Low": return "success";
			default: return "secondary";
		}
	};
	const MiniTrend = ({ data, color }) => {
		const max = Math.max(...data);
		const min = Math.min(...data);
		const h = 40;
		const w = 80;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			width: w,
			height: h,
			className: "mt-1",
			style: { opacity: .7 },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
				fill: "none",
				stroke: color,
				strokeWidth: "2",
				points: data.map((v, i) => `${i / (data.length - 1) * w},${h - (v - min) / (max - min || 1) * h}`).join(" ")
			})
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `container-fluid py-4 px-4 ${d}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
/* ----- Premium Card System ----- */
.glass-card {
  background: ${isDark ? "rgba(30, 41, 59, 0.75)" : "rgba(255, 255, 255, 0.85)"};
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.8)"};
  box-shadow: ${isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.6)"};
}
.premium-card {
  transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: default;
}
.premium-card:hover {
  transform: translateY(-8px) scale(1.012);
  box-shadow: ${isDark ? "0 32px 64px -12px rgba(0,0,0,0.5)" : "0 32px 64px -16px rgba(0,0,0,0.18), 0 8px 24px -8px rgba(0,0,0,0.08), 0 0 0 1px rgba(59,130,246,0.08)"};
}
.premium-card .kpi-icon {
  transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.premium-card:hover .kpi-icon {
  transform: scale(1.18) rotate(-6deg);
}
.premium-card .kpi-icon-ring {
  position: relative;
}
.premium-card .kpi-icon-ring::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 2px solid currentColor;
  opacity: 0.15;
  animation: kpiPulse 3s ease-in-out infinite;
}
@keyframes kpiPulse {
  0%, 100% { transform: scale(1); opacity: 0.15; }
  50% { transform: scale(1.08); opacity: 0.05; }
}

/* ----- Premium Table ----- */
.premium-table-wrapper {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9"};
}
.premium-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}
.premium-table thead {
  position: sticky;
  top: 0;
  z-index: 10;
}
.premium-table thead tr {
  background: ${isDark ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"};
}
.premium-table thead th {
  padding: 14px 16px;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${isDark ? "#94a3b8" : "#64748b"};
  border-bottom: 2px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"};
  white-space: nowrap;
  user-select: none;
}
.premium-table tbody tr {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 3px solid transparent;
  cursor: pointer;
}
.premium-table tbody tr:hover {
  border-left-color: #4f46e5;
  background: ${isDark ? "rgba(79,70,229,0.08)" : "rgba(79,70,229,0.03)"} !important;
  transform: scale(1.001);
}
.premium-table tbody tr:nth-child(even) {
  background: ${isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.012)"};
}
.premium-table tbody tr:nth-child(even):hover {
  background: ${isDark ? "rgba(79,70,229,0.12)" : "rgba(79,70,229,0.05)"} !important;
}
.premium-table tbody td {
  padding: 12px 16px;
  border-bottom: 1px solid ${isDark ? "rgba(255,255,255,0.03)" : "#f8fafc"};
  vertical-align: middle;
}

/* ----- Premium Progress Bar ----- */
.premium-progress {
  height: 6px;
  border-radius: 100px;
  background: ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"};
  overflow: hidden;
  position: relative;
}
.premium-progress-bar {
  height: 100%;
  border-radius: 100px;
  background: linear-gradient(90deg, #4f46e5, #3b82f6, #60a5fa);
  background-size: 200% 100%;
  transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: progressShimmer 2s linear infinite;
}
.premium-progress-bar.complete {
  background: linear-gradient(90deg, #059669, #10b981, #34d399);
}
@keyframes progressShimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ----- Premium Badge ----- */
.premium-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 12px;
  border-radius: 100px;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.premium-badge .badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}
.premium-badge .badge-dot.pulse {
  animation: badgePulse 2s ease-in-out infinite;
}
@keyframes badgePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

/* ----- Premium Button System ----- */
.premium-btn {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}
.premium-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}
.premium-btn:active {
  transform: translateY(0) scale(0.97);
}
.premium-btn .btn-ripple {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.4s;
}
.premium-btn:hover .btn-ripple {
  opacity: 1;
}

/* ----- Premium Actions (circular) ----- */
.premium-action-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
}
.premium-action-btn:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* ----- Quick Action Buttons ----- */
.premium-quick-btn {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.premium-quick-btn:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 12px 32px -8px rgba(0,0,0,0.2);
}
.premium-quick-btn:active {
  transform: translateY(-1px) scale(0.98);
}

/* ----- Section Header ----- */
.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
}
.section-header .accent-bar {
  width: 3px;
  height: 20px;
  border-radius: 2px;
  flex-shrink: 0;
}
.section-header h6 {
  margin: 0;
  font-weight: 700;
  font-size: 0.9rem;
}

/* ----- Animations ----- */
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes countUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.enter-anim {
  animation: fadeSlideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  opacity: 0;
}
.enter-anim:nth-child(1) { animation-delay: 0.03s; }
.enter-anim:nth-child(2) { animation-delay: 0.06s; }
.enter-anim:nth-child(3) { animation-delay: 0.09s; }
.enter-anim:nth-child(4) { animation-delay: 0.12s; }
.enter-anim:nth-child(5) { animation-delay: 0.15s; }
.enter-anim:nth-child(6) { animation-delay: 0.18s; }
.enter-anim:nth-child(7) { animation-delay: 0.21s; }
.enter-anim:nth-child(8) { animation-delay: 0.24s; }
.enter-anim:nth-child(9) { animation-delay: 0.27s; }
.enter-anim:nth-child(10) { animation-delay: 0.30s; }

/* ----- Live Indicator ----- */
.live-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 0 rgba(16,185,129,0.6);
  animation: livePulse 1.5s ease-in-out infinite;
}
@keyframes livePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.6); }
  50% { box-shadow: 0 0 0 6px rgba(16,185,129,0); }
}

/* ----- Scrollbar ----- */
.premium-table-wrapper::-webkit-scrollbar,
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: ${isDark ? "#334155" : "#cbd5e1"}; border-radius: 100px; }
::-webkit-scrollbar-thumb:hover { background: ${isDark ? "#475569" : "#94a3b8"}; }
` }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex flex-wrap align-items-center justify-content-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
					className: "fw-bold mb-1 d-flex align-items-center gap-2",
					style: { color: isDark ? "#f1f5f9" : "#0f172a" },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
							width: 4,
							height: 24,
							background: "linear-gradient(180deg,#4f46e5,#3b82f6)",
							borderRadius: 2,
							display: "inline-block"
						} }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faIndustry,
							style: { color: "#4f46e5" }
						}),
						"Manufacturing / MRP Control Center",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "live-dot ms-2",
							style: { verticalAlign: "middle" },
							title: "Live updates active"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mb-0 ms-2",
					style: {
						color: isDark ? "#94a3b8" : "#64748b",
						fontSize: "0.82rem"
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faChartLine,
						className: "me-1",
						style: {
							fontSize: "0.7rem",
							color: "#94a3b8"
						}
					}), "Monitor production, material availability, work order execution, finished goods output and machine monitoring."]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex flex-wrap gap-2 mt-2 mt-md-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "form-select form-select-sm",
							style: {
								width: "auto",
								borderRadius: "10px",
								borderColor: isDark ? "#334155" : "#e2e8f0",
								background: isDark ? "#1e293b" : "#fff",
								color: isDark ? "#e2e8f0" : "#1e293b"
							},
							value: dateFilter,
							onChange: (e) => setDateFilter(e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "today",
									children: "Today"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "week",
									children: "This Week"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "month",
									children: "This Month"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "quarter",
									children: "This Quarter"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "form-select form-select-sm",
							style: {
								width: "auto",
								borderRadius: "10px",
								borderColor: isDark ? "#334155" : "#e2e8f0",
								background: isDark ? "#1e293b" : "#fff",
								color: isDark ? "#e2e8f0" : "#1e293b"
							},
							value: factory,
							onChange: (e) => setFactory(e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "All Factories"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "f1",
									children: "Factory 1 - Main"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "f2",
									children: "Factory 2 - Assembly"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "f3",
									children: "Factory 3 - Packaging"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "form-select form-select-sm",
							style: {
								width: "auto",
								borderRadius: "10px",
								borderColor: isDark ? "#334155" : "#e2e8f0",
								background: isDark ? "#1e293b" : "#fff",
								color: isDark ? "#e2e8f0" : "#1e293b"
							},
							value: branch,
							onChange: (e) => setBranch(e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "all",
									children: "All Branches"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "b1",
									children: "Branch A"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "b2",
									children: "Branch B"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-sm border-0 text-white",
							style: {
								background: "linear-gradient(135deg,#4f46e5,#3b82f6)",
								borderRadius: "10px",
								transition: "all 0.3s"
							},
							onClick: () => {
								setActiveModule("mfg");
								setActiveTab("mfg_production_orders");
							},
							onMouseEnter: (e) => e.currentTarget.style.transform = "translateY(-1px)",
							onMouseLeave: (e) => e.currentTarget.style.transform = "translateY(0)",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faPlus,
								className: "me-1"
							}), "New Order"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-sm",
							style: {
								borderRadius: "10px",
								border: "1px solid " + (isDark ? "#334155" : "#e2e8f0"),
								color: isDark ? "#e2e8f0" : "#1e293b",
								transition: "all 0.3s"
							},
							onClick: () => {
								setActiveModule("mfg");
								setActiveTab("mfg_bill_of_materials");
							},
							onMouseEnter: (e) => {
								e.currentTarget.style.borderColor = "#4f46e5";
								e.currentTarget.style.color = "#4f46e5";
							},
							onMouseLeave: (e) => {
								e.currentTarget.style.borderColor = isDark ? "#334155" : "#e2e8f0";
								e.currentTarget.style.color = isDark ? "#e2e8f0" : "#1e293b";
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faClipboardCheck,
								className: "me-1"
							}), "New BOM"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-3 mb-4",
				children: kpiData.map((kpi, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-3 col-lg-4 col-md-6 enter-anim",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 rounded-4 h-100 premium-card glass-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-start justify-content-between mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "kpi-icon kpi-icon-ring rounded-3 d-flex align-items-center justify-content-center",
										style: {
											width: 46,
											height: 46,
											background: `linear-gradient(135deg,${kpi.color}20,${kpi.color}08)`,
											color: kpi.color,
											boxShadow: `0 2px 8px ${kpi.color}15`
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: kpi.icon,
											style: { fontSize: "1.1rem" }
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "badge rounded-pill",
										style: {
											background: kpi.change.startsWith("+") ? "#dcfce7" : "#fce7e7",
											color: kpi.change.startsWith("+") ? "#16a34a" : "#dc2626",
											fontSize: "0.65rem",
											fontWeight: 500,
											padding: "3px 8px"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: kpi.change.startsWith("+") ? faArrowUp : faArrowDown,
											className: "me-1",
											style: { fontSize: "0.55rem" }
										}), kpi.change]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "fw-bold mb-0",
									style: {
										color: isDark ? "#f1f5f9" : "#0f172a",
										fontSize: "1.5rem",
										letterSpacing: "-0.02em"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedCounter, {
										value: kpi.value,
										duration: 1e3
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
									style: {
										color: isDark ? "#94a3b8" : "#64748b",
										fontSize: "0.78rem"
									},
									children: kpi.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniTrend, {
									data: kpi.trend,
									color: kpi.color
								})
							]
						})
					})
				}, idx))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4 mb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-4 col-lg-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card border-0 shadow-sm rounded-4 h-100",
							style: { background: isDark ? "#1e293b" : "#fff" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "section-header",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "accent-bar",
											style: { background: "linear-gradient(180deg,#4f46e5,#3b82f6)" }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faChartPie,
											style: {
												color: "#4f46e5",
												fontSize: "0.85rem"
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
											style: { color: isDark ? "#f1f5f9" : "#0f172a" },
											children: "Production Orders by Status"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									style: { height: 260 },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Doughnut, {
										data: statusChartData,
										options: statusChartOptions
									})
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-4 col-lg-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card border-0 shadow-sm rounded-4 h-100",
							style: { background: isDark ? "#1e293b" : "#fff" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "section-header",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "accent-bar",
											style: { background: "linear-gradient(180deg,#4f46e5,#3b82f6)" }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faClock,
											style: {
												color: "#4f46e5",
												fontSize: "0.85rem"
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
											style: { color: isDark ? "#f1f5f9" : "#0f172a" },
											children: "Production Timeline"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "timeline-container",
									style: { overflowY: "auto" },
									children: timelineData.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-start mb-3 pb-2",
										style: { borderBottom: "1px solid " + (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)") },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "me-3 mt-1",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `rounded-circle p-1 d-flex align-items-center justify-content-center`,
												style: {
													width: 10,
													height: 10,
													backgroundColor: item.priority === "High" ? "#ef4444" : item.priority === "Medium" ? "#f59e0b" : "#10b981"
												}
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-grow-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex justify-content-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														style: {
															fontSize: "12px",
															color: isDark ? "#e2e8f0" : "#0f172a"
														},
														children: item.order
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `badge bg-${getPriorityClass(item.priority)}-subtle text-${getPriorityClass(item.priority)} rounded-pill`,
														style: { fontSize: "9px" },
														children: item.priority
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													style: {
														fontSize: "11px",
														color: isDark ? "#94a3b8" : "#475569"
													},
													children: [
														item.product,
														" · ",
														item.machine,
														" · ",
														item.supervisor,
														" · ",
														item.shift
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex justify-content-between mt-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
														className: "text-muted",
														style: { fontSize: "10px" },
														children: ["Qty: ", item.qty]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
														className: "text-muted",
														style: { fontSize: "10px" },
														children: ["Due: ", item.finish]
													})]
												})
											]
										})]
									}, idx))
								})]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-4 col-lg-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card border-0 shadow-sm rounded-4 h-100",
							style: { background: isDark ? "#1e293b" : "#fff" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "section-header",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "accent-bar",
												style: { background: "linear-gradient(180deg,#4f46e5,#3b82f6)" }
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faBoxOpen,
												style: {
													color: "#4f46e5",
													fontSize: "0.85rem"
												}
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
												style: { color: isDark ? "#f1f5f9" : "#0f172a" },
												children: "Material Consumption"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "row g-2 mb-3",
										children: Object.entries(materialData[0]).slice(0, 5).map(([key, val]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "col-6",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2 rounded-3",
												style: { background: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc" },
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
													className: "text-muted text-capitalize",
													style: { fontSize: "10px" },
													children: key.replace(/([A-Z])/g, " $1").trim()
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "fw-bold",
													style: {
														fontSize: "14px",
														color: isDark ? "#e2e8f0" : "#0f172a"
													},
													children: val
												})]
											})
										}, key))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
										className: "fw-bold mb-2 small",
										style: { color: isDark ? "#cbd5e1" : "#334155" },
										children: "Top Consumed Materials"
									}),
									topMaterials.slice(0, 3).map((m, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center justify-content-between py-1",
										style: { borderBottom: "1px solid " + (isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)") },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
												style: {
													fontSize: "11px",
													color: isDark ? "#e2e8f0" : "#0f172a"
												},
												children: m.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
												className: "text-muted",
												style: { fontSize: "9px" },
												children: m.qty
											})
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											className: "fw-bold",
											style: {
												fontSize: "11px",
												color: isDark ? "#e2e8f0" : "#0f172a"
											},
											children: m.cost
										})]
									}, idx))
								]
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 shadow-sm rounded-4",
						style: { background: isDark ? "#1e293b" : "#fff" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "section-header",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "accent-bar",
										style: { background: "linear-gradient(180deg,#4f46e5,#3b82f6)" }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faMicrochip,
										style: {
											color: "#4f46e5",
											fontSize: "0.85rem"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
										style: { color: isDark ? "#f1f5f9" : "#0f172a" },
										children: "Machine Utilization"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: { height: 250 },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									data: machineUtilData,
									options: machineUtilOptions
								})
							})]
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 shadow-sm rounded-4",
						style: { background: isDark ? "#1e293b" : "#fff" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "section-header",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "accent-bar",
										style: { background: "linear-gradient(180deg,#4f46e5,#3b82f6)" }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faFileInvoiceDollar,
										style: {
											color: "#4f46e5",
											fontSize: "0.85rem"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
										style: { color: isDark ? "#f1f5f9" : "#0f172a" },
										children: "Manufacturing Cost Summary"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "row g-2",
								children: costSummary.map((c, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2 rounded-3 text-center",
										style: { background: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc" },
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "rounded-3 d-inline-flex align-items-center justify-content-center mb-1",
												style: {
													width: 30,
													height: 30,
													backgroundColor: `${c.color}1a`,
													color: c.color
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: c.icon,
													style: { fontSize: "12px" }
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "fw-bold",
												style: {
													fontSize: "13px",
													color: isDark ? "#e2e8f0" : "#0f172a"
												},
												children: c.value
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
												className: "text-muted",
												style: { fontSize: "9px" },
												children: c.label
											})
										]
									})
								}, idx))
							})]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4 mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 shadow-sm rounded-4",
						style: { background: isDark ? "#1e293b" : "#fff" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center justify-content-between mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "section-header mb-0",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "accent-bar",
											style: { background: "linear-gradient(180deg,#4f46e5,#3b82f6)" }
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faIndustry,
											style: {
												color: "#4f46e5",
												fontSize: "0.85rem"
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
											style: { color: isDark ? "#f1f5f9" : "#0f172a" },
											children: "Recent Production Orders"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-sm border-0",
									style: {
										borderRadius: "8px",
										background: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
										color: isDark ? "#e2e8f0" : "#475569",
										fontSize: "0.75rem",
										transition: "all 0.3s"
									},
									onMouseEnter: (e) => {
										e.currentTarget.style.background = "#4f46e5";
										e.currentTarget.style.color = "#fff";
									},
									onMouseLeave: (e) => {
										e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9";
										e.currentTarget.style.color = isDark ? "#e2e8f0" : "#475569";
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faEye,
										className: "me-1"
									}), "View All"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "premium-table-wrapper",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "table align-middle mb-0 premium-table",
									style: { fontSize: "0.78rem" },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { style: { width: 32 } }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Order" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Product" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Priority" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Progress" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Actions" })
									] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: recentOrders.map((o, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											style: { textAlign: "center" },
											children: o.progress === 100 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faCheckCircle,
												style: {
													color: "#10b981",
													fontSize: "0.85rem"
												}
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
												display: "inline-block",
												width: 16,
												height: 16,
												borderRadius: "50%",
												border: "2px solid " + (isDark ? "#334155" : "#e2e8f0")
											} })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "fw-semibold",
											style: {
												color: isDark ? "#e2e8f0" : "#0f172a",
												fontFamily: "'SF Mono','Fira Code',monospace",
												fontSize: "0.72rem"
											},
											children: o.no
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											style: { color: isDark ? "#cbd5e1" : "#334155" },
											children: o.product
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "premium-badge",
											style: {
												background: o.status === "Completed" ? "#dcfce7" : o.status === "In Progress" ? "#dbeafe" : o.status === "Quality Check" ? "#f3e8ff" : o.status === "Released" ? "#e0f2fe" : "#f1f5f9",
												color: o.status === "Completed" ? "#16a34a" : o.status === "In Progress" ? "#2563eb" : o.status === "Quality Check" ? "#7c3aed" : o.status === "Released" ? "#0891b2" : "#475569"
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "badge-dot",
												style: { background: o.status === "Completed" ? "#16a34a" : o.status === "In Progress" ? "#2563eb" : o.status === "Quality Check" ? "#7c3aed" : o.status === "Released" ? "#0891b2" : "#475569" }
											}), o.status]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "badge rounded-pill",
											style: {
												background: o.priority === "High" ? "#fce7e7" : o.priority === "Medium" ? "#fef9c3" : "#dcfce7",
												color: o.priority === "High" ? "#dc2626" : o.priority === "Medium" ? "#ca8a04" : "#16a34a",
												fontSize: "0.65rem",
												fontWeight: 500,
												padding: "3px 10px"
											},
											children: o.priority
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											style: { minWidth: 130 },
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex align-items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "premium-progress flex-grow-1",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: `premium-progress-bar ${o.progress === 100 ? "complete" : ""}`,
														style: { width: o.progress + "%" }
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
													className: "fw-semibold",
													style: {
														fontSize: "0.65rem",
														color: isDark ? "#94a3b8" : "#475569",
														minWidth: 28
													},
													children: [o.progress, "%"]
												})]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "premium-action-btn",
												style: {
													background: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
													color: isDark ? "#94a3b8" : "#64748b"
												},
												onMouseEnter: (e) => {
													e.currentTarget.style.background = "#4f46e5";
													e.currentTarget.style.color = "#fff";
												},
												onMouseLeave: (e) => {
													e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9";
													e.currentTarget.style.color = isDark ? "#94a3b8" : "#64748b";
												},
												title: "View",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faEye,
													style: { fontSize: "0.65rem" }
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "premium-action-btn",
												style: {
													background: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
													color: isDark ? "#94a3b8" : "#64748b"
												},
												onMouseEnter: (e) => {
													e.currentTarget.style.background = "#3b82f6";
													e.currentTarget.style.color = "#fff";
												},
												onMouseLeave: (e) => {
													e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9";
													e.currentTarget.style.color = isDark ? "#94a3b8" : "#64748b";
												},
												title: "Edit",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faEdit,
													style: { fontSize: "0.65rem" }
												})
											})]
										}) })
									] }, idx)) })]
								})
							})]
						})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 shadow-sm rounded-4",
						style: { background: isDark ? "#1e293b" : "#fff" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "section-header",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "accent-bar",
										style: { background: "linear-gradient(180deg,#dc2626,#f97316)" }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faExclamationTriangle,
										style: {
											color: "#f97316",
											fontSize: "0.85rem"
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
										style: { color: isDark ? "#f1f5f9" : "#0f172a" },
										children: "Low Stock Material Alerts"
									})
								]
							}), lowStockAlerts.map((m, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2 mb-2 rounded-3",
								style: {
									background: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc",
									borderLeft: "3px solid " + (m.critical ? "#ef4444" : "#f59e0b")
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center justify-content-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "fw-bold",
											style: {
												fontSize: "12px",
												color: isDark ? "#e2e8f0" : "#0f172a"
											},
											children: m.material
										}), m.critical && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "badge bg-danger-subtle text-danger rounded-pill",
											style: { fontSize: "9px" },
											children: "Critical"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex flex-wrap gap-2 mt-1",
										style: {
											fontSize: "10px",
											color: isDark ? "#94a3b8" : "#475569"
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Available: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												style: { color: m.available < m.minStock ? "#ef4444" : "#10b981" },
												children: m.available
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Min: ", m.minStock] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Required: ", m.required] })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											fontSize: "10px",
											color: isDark ? "#94a3b8" : "#475569"
										},
										children: [
											"Supplier: ",
											m.supplier,
											" · Expected: ",
											m.delivery
										]
									})
								]
							}, idx))]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 rounded-4 premium-card glass-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-body p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "section-header",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "accent-bar",
								style: { background: "linear-gradient(180deg,#4f46e5,#3b82f6)" }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faRocket,
								style: {
									color: "#4f46e5",
									fontSize: "0.85rem"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
								style: { color: isDark ? "#f1f5f9" : "#0f172a" },
								children: "Quick Actions"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "d-flex flex-wrap gap-2",
						children: [
							{
								icon: faPlus,
								label: "Create BOM",
								color: "#4f46e5"
							},
							{
								icon: faIndustry,
								label: "Create Production Order",
								color: "#0891b2"
							},
							{
								icon: faPlay,
								label: "Release Work Orders",
								color: "#059669"
							},
							{
								icon: faBoxOpen,
								label: "Material Issue",
								color: "#d97706"
							},
							{
								icon: faRecycle,
								label: "Material Return",
								color: "#7c3aed"
							},
							{
								icon: faBox,
								label: "Record Production",
								color: "#dc2626"
							},
							{
								icon: faFlask,
								label: "Quality Inspection",
								color: "#0d9488"
							},
							{
								icon: faTimesCircle,
								label: "Close Production",
								color: "#2563eb"
							},
							{
								icon: faFileExport,
								label: "Export Report",
								color: "#9333ea"
							}
						].map((action, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: "btn btn-sm rounded-3 d-flex align-items-center gap-2 border-0 premium-btn premium-quick-btn",
							style: {
								background: `linear-gradient(135deg,${action.color}15,${action.color}08)`,
								color: action.color,
								padding: "6px 14px"
							},
							onMouseEnter: (e) => e.currentTarget.style.background = `linear-gradient(135deg,${action.color}25,${action.color}15)`,
							onMouseLeave: (e) => e.currentTarget.style.background = `linear-gradient(135deg,${action.color}15,${action.color}08)`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "btn-ripple" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: action.icon,
									style: { fontSize: "0.75rem" }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: {
										fontSize: "0.75rem",
										fontWeight: 500
									},
									children: action.label
								})
							]
						}, idx))
					})]
				})
			})
		]
	});
};
//#endregion
//#region src/pages/systems/MFG/MfgProductionOrders.jsx
var SEED_ORDERS = [];
var MfgProductionOrders = ({ isDark }) => {
	const { addNotification } = useApp();
	const [view, setView] = (0, import_react.useState)("list");
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [deletingOrder, setDeletingOrder] = (0, import_react.useState)(null);
	const [orders, setOrders] = (0, import_react.useState)(() => loadEntityList("mfg", "production_order", SEED_ORDERS));
	const d = isDark ? "dark-mode" : "";
	const statusList = (0, import_react.useMemo)(() => [...new Set(orders.map((o) => o.status))], [orders]);
	const filtered = orders.filter((o) => {
		if (statusFilter !== "all" && o.status !== statusFilter) return false;
		if (search && !o.no.toLowerCase().includes(search.toLowerCase()) && !o.product.toLowerCase().includes(search.toLowerCase())) return false;
		return true;
	});
	const handleConfirmDelete = () => {
		if (!deletingOrder) return;
		const { list } = softDeleteRecord({
			system: "mfg",
			entity: "production_order",
			entityLabel: "Production Order",
			records: orders,
			record: deletingOrder,
			idKey: "no",
			title: `${deletingOrder.no} — ${deletingOrder.product}`
		});
		setOrders(list);
		setDeletingOrder(null);
		addNotification?.(`Production order "${deletingOrder.no}" moved to trash.`, "success");
	};
	const handleImportOrders = (rows) => {
		setOrders(mergeImportedRecords("mfg", "production_order", orders, rows, (row, index) => {
			const no = row["Order No"] || row.no || `PO-IMP-${Date.now()}-${index}`;
			return {
				no: String(no),
				product: row.Product || row.product || "Imported Product",
				bom: row.BOM || row.bom || "BOM-001",
				planned: Number(row.Planned || row.planned || 0),
				produced: Number(row.Produced || row.produced || 0),
				warehouse: row.Warehouse || row.warehouse || "Main WH",
				status: row.Status || row.status || "Planned",
				priority: row.Priority || row.priority || "Medium",
				manager: row.Manager || row.manager || "Import",
				start: row.Start || row.start || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
				due: row["Due Date"] || row.due || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
				estCost: row["Est Cost"] || row.estCost || "$0",
				actCost: row["Act Cost"] || row.actCost || "-"
			};
		}, "no"));
	};
	const progress = (produced, planned) => planned > 0 ? Math.round(produced / planned * 100) : 0;
	const getStatusColor = (s) => {
		return {
			"Planned": "#94a3b8",
			"Released": "#0ea5e9",
			"In Progress": "#f59e0b",
			"Quality Check": "#8b5cf6",
			"Completed": "#10b981",
			"Cancelled": "#ef4444"
		}[s] || "#94a3b8";
	};
	const getPriorityColor = (p) => {
		return {
			"High": "#ef4444",
			"Medium": "#f59e0b",
			"Low": "#10b981"
		}[p] || "#64748b";
	};
	const styleTag = `
    .glass-card {
      background: ${isDark ? "rgba(30, 41, 59, 0.75)" : "rgba(255, 255, 255, 0.85)"};
      backdrop-filter: blur(24px) saturate(1.4);
      -webkit-backdrop-filter: blur(24px) saturate(1.4);
      border: 1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.8)"};
      box-shadow: ${isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.6)"};
    }
    .premium-card { transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .premium-card:hover { transform: translateY(-8px) scale(1.012); box-shadow: 0 32px 64px -16px rgba(0,0,0,0.18); }
    .premium-table-wrapper { border-radius: 16px; overflow: hidden; border: 1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9"}; }
    .premium-table { width: 100%; border-collapse: separate; border-spacing: 0; }
    .premium-table thead { position: sticky; top: 0; z-index: 10; }
    .premium-table thead tr { background: ${isDark ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"}; }
    .premium-table thead th { padding: 14px 16px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: ${isDark ? "#94a3b8" : "#64748b"}; border-bottom: 2px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}; white-space: nowrap; }
    .premium-table tbody tr { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); border-left: 3px solid transparent; }
    .premium-table tbody tr:hover { border-left-color: #0891b2 !important; background: ${isDark ? "rgba(8,145,178,0.08)" : "rgba(8,145,178,0.03)"} !important; }
    .premium-table tbody tr:nth-child(even) { background: ${isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.012)"}; }
    .premium-table tbody tr:nth-child(even):hover { background: ${isDark ? "rgba(8,145,178,0.12)" : "rgba(8,145,178,0.05)"} !important; }
    .premium-table tbody td { padding: 12px 16px; border-bottom: 1px solid ${isDark ? "rgba(255,255,255,0.03)" : "#f8fafc"}; vertical-align: middle; }
    .premium-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 12px; border-radius: 100px; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.02em; }
    .premium-badge .badge-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
    .premium-btn { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .premium-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
    .premium-action-btn { width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; border: none; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer; }
    .premium-action-btn:hover { transform: scale(1.15); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; }
    .section-header .accent-bar { width: 3px; height: 20px; border-radius: 2px; flex-shrink: 0; }
    .section-header h6 { margin: 0; font-weight: 700; font-size: 0.9rem; }
    .premium-progress { height: 6px; border-radius: 100px; background: ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}; overflow: hidden; }
    .premium-progress-bar { height: 100%; border-radius: 100px; background: linear-gradient(90deg, #0891b2, #06b6d4, #22d3ee); background-size: 200% 100%; transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .premium-progress-bar.complete { background: linear-gradient(90deg, #059669, #10b981, #34d399); }
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
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${isDark ? "#334155" : "#cbd5e1"}; border-radius: 100px; }
    .po-input:focus { border-color: #0891b2 !important; box-shadow: 0 0 0 3px rgba(8,145,178,0.15) !important; }
    .dark-mode .po-input:focus { border-color: #22d3ee !important; box-shadow: 0 0 0 3px rgba(6,182,212,0.25) !important; }
  `;
	const FormField = ({ label, children, width }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: width || "col-md-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "d-flex align-items-center gap-2 mb-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
				width: 3,
				height: 14,
				borderRadius: 2,
				background: "linear-gradient(180deg, #0891b2, #06b6d4)"
			} }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "form-label small fw-semibold mb-0",
				style: {
					fontSize: "10px",
					letterSpacing: "0.3px",
					textTransform: "uppercase",
					color: isDark ? "#94a3b8" : "#475569"
				},
				children: label
			})]
		}), children]
	});
	if (view === "create") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: styleTag }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `container-fluid py-4 px-4 ${d}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "d-flex align-items-center justify-content-between mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
				width: 40,
				height: 3,
				borderRadius: 2,
				background: "linear-gradient(90deg, #0891b2, #06b6d4, #22d3ee)",
				marginBottom: 8
			} }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
				className: "fw-bold mb-0",
				style: { color: isDark ? "#f1f5f9" : "#0f172a" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
					icon: faIndustry,
					className: "me-2 text-primary"
				}), "Create Production Order"]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-outline-secondary btn-sm rounded-pill premium-btn",
					onClick: () => setView("list"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faTimes,
						className: "me-1"
					}), "Cancel"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-primary btn-sm rounded-pill premium-btn",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faCheck,
						className: "me-1"
					}), "Create Order"]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-xl-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card border-0 shadow-sm rounded-4 overflow-hidden mb-4 premium-card glass-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						height: 3,
						background: "linear-gradient(90deg, #0891b2, #06b6d4, #22d3ee)"
					} }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-body p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "section-header",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "accent-bar",
								style: { background: "linear-gradient(180deg, #0891b2, #06b6d4)" }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
								style: { color: isDark ? "#f1f5f9" : "#0f172a" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faClipboardCheck,
									className: "me-2 text-primary"
								}), "General Information"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Order Number",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										className: "form-control form-control-sm rounded-3 po-input",
										defaultValue: "PO-2024-0045"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Reference",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										className: "form-control form-control-sm rounded-3 po-input",
										placeholder: "Sales Order / Customer Ref"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "BOM Selection",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select form-select-sm rounded-3 po-input",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "BOM-001 - Steel Frame Assembly" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "BOM-002 - Hydraulic Pump Unit" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "BOM-003 - Control Panel Box" })
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Finished Product",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										className: "form-control form-control-sm rounded-3 po-input",
										defaultValue: "Steel Frame Assembly",
										readOnly: true
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Warehouse",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select form-select-sm rounded-3 po-input",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Main Warehouse" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Assembly WH" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Electrical WH" })
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Quantity Planned",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										className: "form-control form-control-sm rounded-3 po-input",
										defaultValue: 500
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Unit",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										className: "form-control form-control-sm rounded-3 po-input",
										defaultValue: "pcs"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Production Start",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										className: "form-control form-control-sm rounded-3 po-input"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Production Due Date",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										className: "form-control form-control-sm rounded-3 po-input"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Priority",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select form-select-sm rounded-3 po-input",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "High" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Medium" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Low" })
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Cost Center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select form-select-sm rounded-3 po-input",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "CC-MFG-001 - Main Production" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "CC-MFG-002 - Assembly" })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Project",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select form-select-sm rounded-3 po-input",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "PRJ-2024-001 - Factory Expansion" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "PRJ-2024-002 - New Product Line" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "None" })
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Supervisor",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select form-select-sm rounded-3 po-input",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "John Smith" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Sarah Lee" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Mike Chen" })
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Machine Assignment",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select form-select-sm rounded-3 po-input",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "CNC-01" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "MBL-03" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "WLD-02" })
										]
									})
								})
							]
						})]
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-xl-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card border-0 shadow-sm rounded-4 overflow-hidden premium-card glass-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						height: 3,
						background: "linear-gradient(90deg, #0891b2, #06b6d4, #22d3ee)"
					} }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-body p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "section-header",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "accent-bar",
									style: { background: "linear-gradient(180deg, #0891b2, #06b6d4)" }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
									style: { color: isDark ? "#f1f5f9" : "#0f172a" },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faDollarSign,
										className: "me-2 text-primary"
									}), "Cost Estimation"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-3 rounded-3",
								style: { background: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc" },
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex justify-content-between mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											style: { color: isDark ? "#94a3b8" : "#475569" },
											children: "Material Cost"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "fw-bold",
											style: { color: isDark ? "#e2e8f0" : "#0f172a" },
											children: "$24,500"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex justify-content-between mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											style: { color: isDark ? "#94a3b8" : "#475569" },
											children: "Labor Cost"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "fw-bold",
											style: { color: isDark ? "#e2e8f0" : "#0f172a" },
											children: "$8,400"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex justify-content-between mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											style: { color: isDark ? "#94a3b8" : "#475569" },
											children: "Machine Cost"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "fw-bold",
											style: { color: isDark ? "#e2e8f0" : "#0f172a" },
											children: "$5,200"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex justify-content-between mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											style: { color: isDark ? "#94a3b8" : "#475569" },
											children: "Overhead"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "fw-bold",
											style: { color: isDark ? "#e2e8f0" : "#0f172a" },
											children: "$3,100"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "my-2" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex justify-content-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											style: { color: isDark ? "#e2e8f0" : "#0f172a" },
											children: "Total Estimated Cost"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-primary",
											children: "$41,200"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "section-header mt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "accent-bar",
									style: { background: "linear-gradient(180deg, #0891b2, #06b6d4)" }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
									style: { color: isDark ? "#f1f5f9" : "#0f172a" },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faRocket,
										className: "me-2 text-primary"
									}), "Advanced Options"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "d-flex flex-column gap-2",
								children: [
									{
										icon: faLayerGroup,
										label: "Auto Generate Work Orders",
										color: "#4f46e5"
									},
									{
										icon: faBox,
										label: "Reserve Materials",
										color: "#0891b2"
									},
									{
										icon: faPaperclip,
										label: "Attach Documents",
										color: "#059669"
									},
									{
										icon: faHistory,
										label: "Production History",
										color: "#d97706"
									}
								].map((f, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "btn btn-sm d-flex align-items-center gap-2 border-0 rounded-3 text-start premium-btn",
									style: {
										background: `${f.color}10`,
										color: f.color
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: f.icon,
										style: { fontSize: "11px" }
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: { fontSize: "11px" },
										children: f.label
									})]
								}, idx))
							})
						]
					})]
				})
			})]
		})]
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: styleTag }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `container-fluid py-4 px-4 ${d}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex flex-wrap align-items-center justify-content-between mb-4",
					style: {
						position: "relative",
						zIndex: 110
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
							width: 40,
							height: 3,
							borderRadius: 2,
							background: "linear-gradient(90deg, #0891b2, #06b6d4, #22d3ee)",
							marginBottom: 8
						} }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "fw-bold mb-1",
							style: { color: isDark ? "#f1f5f9" : "#0f172a" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faIndustry,
								className: "me-2 text-primary"
							}), "Production Orders"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted small mb-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faInfoCircle,
								className: "me-1",
								style: {
									fontSize: "10px",
									opacity: .6
								}
							}), "Plan, schedule, and manage manufacturing production orders."]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-primary btn-sm rounded-pill px-3 premium-btn",
								onClick: () => setView("create"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faPlus,
									className: "me-1"
								}), "New Production Order"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FxImportDropdown, {
								title: "Production Orders",
								isDark,
								addNotification,
								onImport: handleImportOrders,
								buttonClassName: "btn btn-sm rounded-pill premium-btn",
								buttonStyle: {
									background: "linear-gradient(135deg, #3b82f6, #2563eb)",
									color: "#fff",
									border: "none"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FxExportDropdown, {
								data: filtered,
								getExportData: (data) => data.map((o) => ({
									"Order No": o.no,
									Product: o.product,
									BOM: o.bom,
									Planned: o.planned,
									Produced: o.produced,
									Warehouse: o.warehouse,
									Status: o.status,
									Priority: o.priority,
									Manager: o.manager,
									Start: o.start,
									"Due Date": o.due,
									"Est Cost": o.estCost,
									"Act Cost": o.actCost
								})),
								title: "Production Orders Report",
								filenamePrefix: "mfg-production-orders",
								moduleLabel: "MFG Module",
								isDark,
								addNotification,
								buttonClassName: "btn btn-sm rounded-pill premium-btn",
								buttonStyle: {
									background: "linear-gradient(135deg, #10b981, #059669)",
									color: "#fff",
									border: "none"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-outline-secondary btn-sm rounded-pill premium-btn",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faCalendarAlt,
									className: "me-1"
								}), "Calendar"]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card border-0 shadow-sm rounded-4 mb-4 premium-card glass-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card-body p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-2 align-items-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "input-group input-group-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "input-group-text bg-transparent border-end-0 rounded-start-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faSearch,
												style: {
													fontSize: "12px",
													color: isDark ? "#94a3b8" : "#64748b"
												}
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											className: "form-control form-control-sm border-start-0 rounded-end-3 po-input",
											placeholder: "Search orders...",
											value: search,
											onChange: (e) => setSearch(e.target.value)
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select form-select-sm rounded-3 po-input",
										value: statusFilter,
										onChange: (e) => setStatusFilter(e.target.value),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "all",
											children: "All Status"
										}), statusList.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: s,
											children: s
										}, s))]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										className: "form-select form-select-sm rounded-3 po-input",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "All Products" })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										className: "form-select form-select-sm rounded-3 po-input",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "All Priorities" })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										className: "form-select form-select-sm rounded-3 po-input",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "All Managers" })
									})
								})
							]
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card border-0 shadow-sm rounded-4 premium-card glass-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card-body p-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "premium-table-wrapper table-responsive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "table table-borderless align-middle mb-0 premium-table",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Order No" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Product" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "BOM" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Progress" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Priority" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Manager" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Due Date" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Est Cost" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Actions" })
								] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.map((o, idx) => {
									const pct = progress(o.produced, o.planned);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "enter-anim",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "fw-bold",
												style: {
													fontSize: "11px",
													color: isDark ? "#e2e8f0" : "#0f172a"
												},
												children: o.no
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												style: {
													fontSize: "11px",
													color: isDark ? "#cbd5e1" : "#334155"
												},
												children: o.product
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "badge",
												style: {
													fontSize: "9px",
													background: isDark ? "rgba(255,255,255,0.08)" : "#f1f5f9",
													color: isDark ? "#cbd5e1" : "#475569",
													fontWeight: 500,
													padding: "3px 8px"
												},
												children: o.bom
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												style: { minWidth: 140 },
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex align-items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "premium-progress flex-grow-1",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: `premium-progress-bar${pct >= 100 ? " complete" : ""}`,
															style: { width: pct + "%" }
														})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														style: {
															minWidth: 28,
															textAlign: "right"
														},
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															style: {
																fontSize: "10px",
																fontWeight: 600,
																color: isDark ? "#94a3b8" : "#64748b"
															},
															children: [pct, "%"]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															style: {
																fontSize: "9px",
																color: isDark ? "#64748b" : "#94a3b8",
																display: "block",
																lineHeight: 1
															},
															children: [
																o.produced,
																"/",
																o.planned
															]
														})]
													})]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "premium-badge",
												style: {
													background: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
													color: getStatusColor(o.status)
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "badge-dot",
													style: { background: getStatusColor(o.status) }
												}), o.status]
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "premium-badge",
												style: {
													background: getPriorityColor(o.priority) + "14",
													color: getPriorityColor(o.priority)
												},
												children: o.priority
											}) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												style: {
													fontSize: "11px",
													color: isDark ? "#94a3b8" : "#475569"
												},
												children: o.manager
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												style: {
													fontSize: "11px",
													color: isDark ? "#94a3b8" : "#475569"
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faCalendarAlt,
													className: "me-1",
													style: {
														fontSize: "9px",
														opacity: .5
													}
												}), o.due]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "fw-bold",
												style: {
													fontSize: "11px",
													color: isDark ? "#e2e8f0" : "#0f172a"
												},
												children: o.estCost
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														className: "premium-action-btn",
														style: {
															background: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
															color: isDark ? "#94a3b8" : "#64748b"
														},
														title: "View",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: faEye,
															style: { fontSize: "10px" }
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														className: "premium-action-btn",
														style: {
															background: "#0891b214",
															color: "#0891b2"
														},
														title: "Edit",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: faEdit,
															style: { fontSize: "10px" }
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														className: "premium-action-btn",
														style: {
															background: "#10b98114",
															color: "#10b981"
														},
														title: "Start",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: faPlay,
															style: { fontSize: "10px" }
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														className: "premium-action-btn",
														style: {
															background: "rgba(239,68,68,0.08)",
															color: "#ef4444"
														},
														title: "Delete",
														onClick: () => setDeletingOrder(o),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: faTrash,
															style: { fontSize: "10px" }
														})
													})
												]
											}) })
										]
									}, idx);
								}), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 10,
									className: "text-center py-5 text-muted",
									children: "No production orders found"
								}) })] })]
							})
						})
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBox.Confirm, {
			show: !!deletingOrder,
			onClose: () => setDeletingOrder(null),
			onConfirm: handleConfirmDelete,
			title: "Delete Production Order",
			message: `Move production order "${deletingOrder?.no || deletingOrder?.id}" to trash? You can restore it later from the Manufacturing Trash tab.`,
			confirmLabel: "Move to Trash",
			variant: "danger"
		})
	] });
};
//#endregion
//#region src/pages/systems/MFG/MfgTrash.jsx
var MfgTrash = ({ isDark }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleTrashPage, {
	system: "mfg",
	isDark,
	title: "Manufacturing Trash",
	subtitle: "Recover soft-deleted BOMs, production orders, and work orders.",
	accent: "#0891b2"
});
//#endregion
//#region src/pages/systems/MFG/MfgWorkOrders.jsx
var SEED_WORK_ORDERS = [];
var MfgWorkOrders = ({ isDark }) => {
	const { addNotification } = useApp();
	const [view, setView] = (0, import_react.useState)("list");
	const [viewMode, setViewMode] = (0, import_react.useState)("table");
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [selectedWo, setSelectedWo] = (0, import_react.useState)(null);
	const [scraptingWo, setScraptingWo] = (0, import_react.useState)(null);
	const [deletingWo, setDeletingWo] = (0, import_react.useState)(null);
	const [workOrders, setWorkOrders] = (0, import_react.useState)(() => loadEntityList("mfg", "work_order", SEED_WORK_ORDERS));
	const d = isDark ? "dark-mode" : "";
	const statusList = (0, import_react.useMemo)(() => [...new Set(workOrders.map((w) => w.status))], [workOrders]);
	const filtered = workOrders.filter((w) => {
		if (statusFilter !== "all" && w.status !== statusFilter) return false;
		if (search && !w.no.toLowerCase().includes(search.toLowerCase()) && !w.operation.toLowerCase().includes(search.toLowerCase())) return false;
		return true;
	});
	const moveWoToTrash = (wo, label = "Work Order") => {
		const { list } = softDeleteRecord({
			system: "mfg",
			entity: "work_order",
			entityLabel: label,
			records: workOrders,
			record: wo,
			idKey: "no",
			title: `${wo.no} — ${wo.operation}`
		});
		setWorkOrders(list);
		return list;
	};
	const handleConfirmDelete = () => {
		if (!deletingWo) return;
		moveWoToTrash(deletingWo, "Work Order");
		setDeletingWo(null);
		addNotification?.(`Work order "${deletingWo.no}" moved to trash.`, "success");
	};
	const handleConfirmScrap = () => {
		if (!scraptingWo) return;
		moveWoToTrash(scraptingWo, "Work Order (Scrapped)");
		setScraptingWo(null);
		setSelectedWo(null);
		setView("list");
		addNotification?.(`Work order "${scraptingWo.no}" scrapped and moved to trash.`, "success");
	};
	const handleImportWorkOrders = (rows) => {
		setWorkOrders(mergeImportedRecords("mfg", "work_order", workOrders, rows, (row, index) => {
			const no = row["WO No"] || row.no || `WO-IMP-${Date.now()}-${index}`;
			return {
				no: String(no),
				prodOrder: row["Prod Order"] || row.prodOrder || "PO-0000",
				operation: row.Operation || row.operation || "Imported Operation",
				machine: row.Machine || row.machine || "N/A",
				operator: row.Operator || row.operator || "Import",
				status: row.Status || row.status || "Pending",
				shift: row.Shift || row.shift || "Morning",
				start: row.Start || row.start || "",
				end: row.End || row.end || "",
				progress: Number(row.Progress || row.progress || 0),
				quality: row.Quality || row.quality || "-",
				priority: row.Priority || row.priority || "Medium"
			};
		}, "no"));
	};
	const AnimatedCounter = ({ value, duration = 800 }) => {
		const [count, setCount] = import_react.useState(0);
		import_react.useEffect(() => {
			const startTime = performance.now();
			const animate = (now) => {
				const elapsed = now - startTime;
				const progress = Math.min(elapsed / duration, 1);
				const eased = 1 - Math.pow(1 - progress, 3);
				setCount(Math.round(value * eased));
				if (progress < 1) requestAnimationFrame(animate);
			};
			requestAnimationFrame(animate);
		}, [value, duration]);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: count });
	};
	const CircularProgress = ({ progress, size = 80, strokeWidth = 6, color = "#10b981", showLabel = true }) => {
		const radius = (size - strokeWidth) / 2;
		const circumference = 2 * Math.PI * radius;
		const offset = circumference - progress / 100 * circumference;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			width: size,
			height: size,
			viewBox: `0 0 ${size} ${size}`,
			style: { transform: "rotate(-90deg)" },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: size / 2,
				cy: size / 2,
				r: radius,
				fill: "none",
				stroke: isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0",
				strokeWidth
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: size / 2,
				cy: size / 2,
				r: radius,
				fill: "none",
				stroke: color,
				strokeWidth,
				strokeLinecap: "round",
				strokeDasharray: circumference,
				strokeDashoffset: offset,
				style: {
					transition: "stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
					filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
				}
			})]
		});
	};
	const FormField = ({ label, children, width }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: width || "col-md-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "form-label small fw-medium",
			style: { color: isDark ? "#94a3b8" : "#475569" },
			children: label
		}), children]
	});
	const sectionAccent = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
		height: 3,
		width: 36,
		background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
		borderRadius: 4,
		marginBottom: 10
	} });
	const themeBg = (r) => isDark ? `rgba(${r},0.15)` : `rgba(${r},0.08)`;
	const themeDot = (h) => `#${h}`;
	const statusColors = {
		"Pending": {
			bg: themeBg("100,116,139"),
			dot: themeDot("64748b"),
			text: themeDot("64748b")
		},
		"In Progress": {
			bg: themeBg("245,158,11"),
			dot: themeDot("d97706"),
			text: themeDot("d97706")
		},
		"Completed": {
			bg: themeBg("16,185,129"),
			dot: themeDot("059669"),
			text: themeDot("059669")
		},
		"Paused": {
			bg: themeBg("59,130,246"),
			dot: themeDot("2563eb"),
			text: themeDot("2563eb")
		},
		"Rejected": {
			bg: themeBg("239,68,68"),
			dot: themeDot("dc2626"),
			text: themeDot("dc2626")
		}
	};
	const qualityColors = {
		"Pass": {
			bg: themeBg("16,185,129"),
			dot: themeDot("059669"),
			text: themeDot("059669")
		},
		"Fail": {
			bg: themeBg("239,68,68"),
			dot: themeDot("dc2626"),
			text: themeDot("dc2626")
		},
		"Rework": {
			bg: themeBg("245,158,11"),
			dot: themeDot("d97706"),
			text: themeDot("d97706")
		},
		"-": {
			bg: themeBg("100,116,139"),
			dot: themeDot("64748b"),
			text: themeDot("64748b")
		}
	};
	const premiumCss = `
    .glass-card {
      background: ${isDark ? "rgba(30, 41, 59, 0.75)" : "rgba(255, 255, 255, 0.85)"};
      backdrop-filter: blur(24px) saturate(1.4);
      -webkit-backdrop-filter: blur(24px) saturate(1.4);
      border: 1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.8)"};
      box-shadow: ${isDark ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.6)"};
    }
    .premium-card { transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .premium-card:hover { transform: translateY(-8px) scale(1.012); box-shadow: 0 32px 64px -16px rgba(0,0,0,0.18); }
    .premium-table-wrapper { border-radius: 16px; overflow: hidden; border: 1px solid ${isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9"}; }
    .premium-table { width: 100%; border-collapse: separate; border-spacing: 0; }
    .premium-table thead { position: sticky; top: 0; z-index: 10; }
    .premium-table thead tr { background: ${isDark ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" : "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)"}; }
    .premium-table thead th { padding: 14px 16px; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: ${isDark ? "#94a3b8" : "#64748b"}; border-bottom: 2px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}; white-space: nowrap; }
    .premium-table tbody tr { transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); border-left: 3px solid transparent; }
    .premium-table tbody tr:hover { border-left-color: #059669 !important; background: ${isDark ? "rgba(5,150,105,0.08)" : "rgba(5,150,105,0.03)"} !important; }
    .premium-table tbody tr:nth-child(even) { background: ${isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.012)"}; }
    .premium-table tbody tr:nth-child(even):hover { background: ${isDark ? "rgba(5,150,105,0.12)" : "rgba(5,150,105,0.05)"} !important; }
    .premium-table tbody td { padding: 12px 16px; border-bottom: 1px solid ${isDark ? "rgba(255,255,255,0.03)" : "#f8fafc"}; vertical-align: middle; }
    .premium-badge { display: inline-flex; align-items: center; gap: 5px; padding: 3px 12px; border-radius: 100px; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.02em; }
    .premium-badge .badge-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }
    .premium-btn { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .premium-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
    .premium-action-btn { width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; border: none; transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); cursor: pointer; }
    .premium-action-btn:hover { transform: scale(1.15); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
    .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; }
    .section-header .accent-bar { width: 3px; height: 20px; border-radius: 2px; flex-shrink: 0; }
    .section-header h6 { margin: 0; font-weight: 700; font-size: 0.9rem; }
    .premium-progress { height: 6px; border-radius: 100px; background: ${isDark ? "rgba(255,255,255,0.06)" : "#e2e8f0"}; overflow: hidden; }
    .premium-progress-bar { height: 100%; border-radius: 100px; background: linear-gradient(90deg, #059669, #10b981, #34d399); background-size: 200% 100%; transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
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
    .wo-card { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); border-radius: 20px; overflow: hidden; position: relative; cursor: pointer; }
    .wo-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 32px 64px -16px rgba(0,0,0,0.25) !important; }
    .wo-card-header { padding: 16px 20px 12px; display: flex; align-items: center; justify-content: space-between; }
    .wo-card-body { padding: 8px 20px 12px; display: flex; flex-direction: column; gap: 10px; }
    .wo-card-row { display: flex; align-items: center; gap: 10px; font-size: 0.8rem; }
    .wo-card-row .wo-icon-box { width: 20px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .wo-card-footer { padding: 12px 20px 16px; display: flex; align-items: center; justify-content: space-between; border-top: 1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}; }
    .wo-card-progress-wrap { padding: 0 20px 4px; }
    .wo-card-progress { display: flex; align-items: center; gap: 16px; }
    .wo-card-progress .wo-gauge { flex-shrink: 0; }
    .wo-card-progress .wo-progress-details { flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .wo-card-progress .wo-progress-label { display: flex; justify-content: space-between; font-size: 0.7rem; font-weight: 600; }
    .view-toggle-btn { transition: all 0.3s ease; border-radius: 8px; padding: 6px 12px; font-size: 0.75rem; cursor: pointer; }
    .view-toggle-btn.active { background: ${isDark ? "rgba(59,130,246,0.2)" : "rgba(59,130,246,0.1)"}; color: #3b82f6; border-color: #3b82f6; }
    .view-toggle-btn:not(.active) { background: transparent; color: ${isDark ? "#94a3b8" : "#64748b"}; border-color: transparent; }
    .view-toggle-btn:not(.active):hover { background: ${isDark ? "rgba(255,255,255,0.06)" : "#f8fafc"}; }
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${isDark ? "#334155" : "#cbd5e1"}; border-radius: 100px; }
  `;
	if (view === "create") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: premiumCss }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `container-fluid py-4 px-4 ${d}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "d-flex align-items-center justify-content-between mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [sectionAccent, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
				className: "fw-bold mb-0",
				style: { color: isDark ? "#f1f5f9" : "#0f172a" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
					icon: faTools,
					className: "me-2 text-primary"
				}), "Create Work Order"]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-outline-secondary btn-sm rounded-pill premium-btn",
					onClick: () => setView("list"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faTimes,
						className: "me-1"
					}), "Cancel"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-primary btn-sm rounded-pill premium-btn",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faCheck,
						className: "me-1"
					}), "Create Work Order"]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "row g-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "col-xl-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card border-0 rounded-4 premium-card glass-card",
					style: { background: isDark ? "#1e293b" : "#fff" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-body p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "section-header",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "accent-bar",
								style: { background: "linear-gradient(180deg, #3b82f6, #8b5cf6)" }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
								style: { color: isDark ? "#f1f5f9" : "#0f172a" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faClipboardCheck,
									className: "me-2 text-primary"
								}), "Work Order Details"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Work Order Number",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										className: "form-control form-control-sm rounded-3",
										defaultValue: "WO-2024-0109"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Production Order",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select form-select-sm rounded-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "PO-2024-0042 - Steel Frame Assembly" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "PO-2024-0043 - Hydraulic Pump Unit" })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Operation Name",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select form-select-sm rounded-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "CNC Machining" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Milling & Drilling" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Welding Assembly" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Quality Inspection" })
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Machine",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select form-select-sm rounded-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "CNC-01" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "MBL-03" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "WLD-02" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "LTH-01" })
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Operator",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select form-select-sm rounded-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Ahmed Hassan" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Priya Sharma" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Carlos Mendez" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Wei Zhang" })
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Shift",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select form-select-sm rounded-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Morning (6AM-2PM)" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Evening (2PM-10PM)" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Night (10PM-6AM)" })
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Expected Start",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "datetime-local",
										className: "form-control form-control-sm rounded-3"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Expected End",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "datetime-local",
										className: "form-control form-control-sm rounded-3"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Expected Time (hours)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										className: "form-control form-control-sm rounded-3",
										defaultValue: 8
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									label: "Status",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select form-select-sm rounded-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Pending" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "In Progress" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Completed" })
										]
									})
								})
							]
						})]
					})
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "col-xl-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card border-0 rounded-4 premium-card glass-card mb-4",
					style: { background: isDark ? "#1e293b" : "#fff" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-body p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "section-header",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "accent-bar",
								style: { background: "linear-gradient(180deg, #3b82f6, #8b5cf6)" }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
								style: { color: isDark ? "#f1f5f9" : "#0f172a" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faMicrochip,
									className: "me-2 text-primary"
								}), "Machine Assignment"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-3",
							style: { background: isDark ? "rgba(255,255,255,0.03)" : "#f8fafc" },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										style: { color: isDark ? "#94a3b8" : "#475569" },
										children: "Machine Load"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "badge bg-warning-subtle text-warning rounded-pill",
										children: "78%"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										style: { color: isDark ? "#94a3b8" : "#475569" },
										children: "Capacity"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-bold",
										style: { color: isDark ? "#e2e8f0" : "#0f172a" },
										children: "16 hrs/day"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex justify-content-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
										style: { color: isDark ? "#94a3b8" : "#475569" },
										children: "Availability"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "fw-bold text-success",
										children: "Available"
									})]
								})
							]
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card border-0 rounded-4 premium-card glass-card",
					style: { background: isDark ? "#1e293b" : "#fff" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "card-body p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "section-header",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "accent-bar",
								style: { background: "linear-gradient(180deg, #3b82f6, #8b5cf6)" }
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
								style: { color: isDark ? "#f1f5f9" : "#0f172a" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faCog,
									className: "me-2 text-primary"
								}), "Shop Floor Actions"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "d-flex flex-column gap-2",
							children: [
								{
									icon: faPlay,
									label: "Start Work",
									color: "#10b981"
								},
								{
									icon: faPause,
									label: "Pause Work",
									color: "#f59e0b"
								},
								{
									icon: faCheckCircle,
									label: "Complete",
									color: "#3b82f6"
								},
								{
									icon: faExclamationTriangle,
									label: "Record Downtime",
									color: "#ef4444"
								},
								{
									icon: faTrash,
									label: "Record Scrap",
									color: "#dc2626"
								},
								{
									icon: faFlask,
									label: "Quality Inspection",
									color: "#8b5cf6"
								}
							].map((f, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-sm d-flex align-items-center gap-2 border-0 rounded-3 text-start premium-btn",
								style: {
									background: `${f.color}12`,
									color: f.color
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: f.icon,
									style: { fontSize: "11px" }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									style: { fontSize: "11px" },
									children: f.label
								})]
							}, idx))
						})]
					})
				})]
			})]
		})]
	})] });
	if (view === "detail" && selectedWo) {
		const wo = selectedWo;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: premiumCss }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `container-fluid py-4 px-4 ${d}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "d-flex align-items-center justify-content-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					sectionAccent,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
						className: "fw-bold mb-1",
						style: { color: isDark ? "#f1f5f9" : "#0f172a" },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faTools,
								className: "me-2 text-primary"
							}),
							wo.no,
							" - ",
							wo.operation
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted small mb-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faLayerGroup,
								className: "me-1",
								style: { fontSize: "10px" }
							}),
							"Production Order: ",
							wo.prodOrder,
							" | Machine: ",
							wo.machine,
							" | Operator: ",
							wo.operator
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "btn btn-outline-secondary btn-sm rounded-pill premium-btn",
					onClick: () => {
						setView("list");
						setSelectedWo(null);
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faArrowLeft,
						className: "me-1"
					}), "Back"]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-xl-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card border-0 rounded-4 premium-card glass-card mb-4",
							style: { background: isDark ? "#1e293b" : "#fff" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "section-header",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "accent-bar",
											style: { background: "linear-gradient(180deg, #3b82f6, #8b5cf6)" }
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
											style: { color: isDark ? "#f1f5f9" : "#0f172a" },
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faTools,
												className: "me-2 text-primary"
											}), "Operation Information"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-2 d-flex justify-content-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											style: { color: isDark ? "#94a3b8" : "#475569" },
											children: "Operation"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "fw-bold",
											style: { color: isDark ? "#e2e8f0" : "#0f172a" },
											children: wo.operation
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-2 d-flex justify-content-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											style: { color: isDark ? "#94a3b8" : "#475569" },
											children: "Machine"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "fw-bold",
											style: { color: isDark ? "#e2e8f0" : "#0f172a" },
											children: wo.machine
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-2 d-flex justify-content-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											style: { color: isDark ? "#94a3b8" : "#475569" },
											children: "Operator"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "fw-bold",
											style: { color: isDark ? "#e2e8f0" : "#0f172a" },
											children: wo.operator
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-2 d-flex justify-content-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											style: { color: isDark ? "#94a3b8" : "#475569" },
											children: "Shift"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "fw-bold",
											style: { color: isDark ? "#e2e8f0" : "#0f172a" },
											children: wo.shift
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-2 d-flex justify-content-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											style: { color: isDark ? "#94a3b8" : "#475569" },
											children: "Expected Time"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "fw-bold",
											style: { color: isDark ? "#e2e8f0" : "#0f172a" },
											children: "8 hrs"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex justify-content-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", {
											style: { color: isDark ? "#94a3b8" : "#475569" },
											children: "Status"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "premium-badge",
											style: {
												background: statusColors[wo.status].bg,
												color: statusColors[wo.status].text
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "badge-dot",
												style: { background: statusColors[wo.status].dot }
											}), wo.status]
										})]
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card border-0 rounded-4 premium-card glass-card mb-4",
							style: { background: isDark ? "#1e293b" : "#fff" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "section-header",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "accent-bar",
										style: { background: "linear-gradient(180deg, #3b82f6, #8b5cf6)" }
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
										style: { color: isDark ? "#f1f5f9" : "#0f172a" },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faCalendarAlt,
											className: "me-2 text-primary"
										}), "Schedule"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex flex-column gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center gap-3 p-3 rounded-3",
											style: {
												background: isDark ? "rgba(59,130,246,0.08)" : "rgba(59,130,246,0.05)",
												border: `1px solid ${isDark ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.1)"}`
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "rounded-2 d-flex align-items-center justify-content-center",
												style: {
													width: 36,
													height: 36,
													background: "linear-gradient(135deg,#3b82f6,#60a5fa)",
													color: "#fff"
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faClock,
													style: { fontSize: "14px" }
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "fw-medium",
												style: {
													color: isDark ? "#f1f5f9" : "#0f172a",
													fontSize: "0.85rem"
												},
												children: "Start"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-muted small",
												children: wo.start
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center gap-3 p-3 rounded-3",
											style: {
												background: isDark ? "rgba(139,92,246,0.08)" : "rgba(139,92,246,0.05)",
												border: `1px solid ${isDark ? "rgba(139,92,246,0.15)" : "rgba(139,92,246,0.1)"}`
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "rounded-2 d-flex align-items-center justify-content-center",
												style: {
													width: 36,
													height: 36,
													background: "linear-gradient(135deg,#8b5cf6,#a78bfa)",
													color: "#fff"
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faHourglassHalf,
													style: { fontSize: "14px" }
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "fw-medium",
												style: {
													color: isDark ? "#f1f5f9" : "#0f172a",
													fontSize: "0.85rem"
												},
												children: "End"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-muted small",
												children: wo.end
											})] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center gap-3 p-3 rounded-3",
											style: {
												background: isDark ? "rgba(16,185,129,0.08)" : "rgba(16,185,129,0.05)",
												border: `1px solid ${isDark ? "rgba(16,185,129,0.15)" : "rgba(16,185,129,0.1)"}`
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "rounded-2 d-flex align-items-center justify-content-center",
												style: {
													width: 36,
													height: 36,
													background: "linear-gradient(135deg,#10b981,#34d399)",
													color: "#fff"
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faChartLine,
													style: { fontSize: "14px" }
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "fw-medium",
												style: {
													color: isDark ? "#f1f5f9" : "#0f172a",
													fontSize: "0.85rem"
												},
												children: "Expected Duration"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-muted small",
												children: "8 hrs"
											})] })]
										})
									]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card border-0 rounded-4 premium-card glass-card mb-4",
							style: { background: isDark ? "#1e293b" : "#fff" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "section-header",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "accent-bar",
										style: { background: "linear-gradient(180deg, #10b981, #34d399)" }
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
										style: { color: isDark ? "#f1f5f9" : "#0f172a" },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faChartLine,
											className: "me-2 text-success"
										}), "Progress & Quality"]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "row g-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-md-6 text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircularProgress, {
												progress: wo.progress,
												size: 100,
												strokeWidth: 8,
												color: "#10b981"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedCounter, {
												value: wo.progress,
												duration: 1e3
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-muted small mt-1",
												children: "Progress"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-md-6 text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircularProgress, {
											progress: wo.quality === "Pass" ? 100 : wo.quality === "Rework" ? 60 : 0,
											size: 100,
											strokeWidth: 8,
											color: wo.quality === "Pass" ? "#10b981" : wo.quality === "Rework" ? "#f59e0b" : "#ef4444"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "fw-bold mt-1",
											style: { color: isDark ? "#f1f5f9" : "#0f172a" },
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "premium-badge",
												style: {
													background: qualityColors[wo.quality].bg,
													color: qualityColors[wo.quality].text
												},
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "badge-dot",
														style: { background: qualityColors[wo.quality].dot }
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: wo.quality === "Pass" ? faCheckCircle : wo.quality === "Fail" ? faTimesCircle : wo.quality === "Rework" ? faRedo : faCheck,
														style: { fontSize: "9px" }
													}),
													wo.quality
												]
											})
										})]
									})]
								})]
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-xl-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 rounded-4 premium-card glass-card mb-4",
						style: { background: isDark ? "#1e293b" : "#fff" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "section-header",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "accent-bar",
										style: { background: "linear-gradient(180deg, #3b82f6, #8b5cf6)" }
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
										style: { color: isDark ? "#f1f5f9" : "#0f172a" },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faChartLine,
											className: "me-2 text-primary"
										}), "Shop Floor Tracking"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex flex-wrap gap-2 mb-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "btn btn-success btn-sm rounded-pill premium-btn",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faPlay,
												className: "me-1"
											}), "Start"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "btn btn-warning btn-sm rounded-pill premium-btn",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faPause,
												className: "me-1"
											}), "Pause"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "btn btn-info btn-sm rounded-pill premium-btn",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faRedo,
												className: "me-1"
											}), "Resume"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "btn btn-primary btn-sm rounded-pill premium-btn",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faCheckCircle,
												className: "me-1"
											}), "Complete"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "btn btn-danger btn-sm rounded-pill premium-btn",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faExclamationTriangle,
												className: "me-1"
											}), "Downtime"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "btn btn-outline-danger btn-sm rounded-pill premium-btn",
											onClick: () => setScraptingWo(selectedWo),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faTrash,
												className: "me-1"
											}), "Scrap"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "btn btn-outline-secondary btn-sm rounded-pill premium-btn",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faFlask,
												className: "me-1"
											}), "Inspection"]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "row g-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label small fw-medium",
												style: { color: isDark ? "#94a3b8" : "#475569" },
												children: "Produced Quantity"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												className: "form-control form-control-sm rounded-3",
												placeholder: "0"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label small fw-medium",
												style: { color: isDark ? "#94a3b8" : "#475569" },
												children: "Scrap Quantity"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												className: "form-control form-control-sm rounded-3",
												placeholder: "0"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label small fw-medium",
												style: { color: isDark ? "#94a3b8" : "#475569" },
												children: "Material Consumed"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: "form-control form-control-sm rounded-3",
												placeholder: "e.g., Steel Plate 10mm, 245 kg"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-md-6",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label small fw-medium",
												style: { color: isDark ? "#94a3b8" : "#475569" },
												children: "Downtime Reason"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "form-select form-select-sm rounded-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "None" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Machine Breakdown" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Material Shortage" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Power Outage" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Tool Change" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Quality Issue" })
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-12",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-label small fw-medium",
												style: { color: isDark ? "#94a3b8" : "#475569" },
												children: "Notes"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
												className: "form-control form-control-sm rounded-3",
												rows: 2,
												placeholder: "Operator notes..."
											})]
										})
									]
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 rounded-4 premium-card glass-card",
						style: { background: isDark ? "#1e293b" : "#fff" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "section-header",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "accent-bar",
									style: { background: "linear-gradient(180deg, #3b82f6, #8b5cf6)" }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
									style: { color: isDark ? "#f1f5f9" : "#0f172a" },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faFlask,
										className: "me-2 text-primary"
									}), "Quality Control"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "row g-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-md-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label small fw-medium",
											style: { color: isDark ? "#94a3b8" : "#475569" },
											children: "Inspection Result"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											className: "form-select form-select-sm rounded-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Pass" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Fail" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Rework" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Rejected" })
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-md-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label small fw-medium",
											style: { color: isDark ? "#94a3b8" : "#475569" },
											children: "Inspector"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											className: "form-control form-control-sm rounded-3",
											placeholder: "Inspector name"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-md-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "form-check",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "form-check-input",
												type: "checkbox",
												id: "dimCheck"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-check-label small",
												htmlFor: "dimCheck",
												style: { color: isDark ? "#94a3b8" : "#475569" },
												children: "Dimensions Check"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "form-check",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "form-check-input",
												type: "checkbox",
												id: "visualCheck"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-check-label small",
												htmlFor: "visualCheck",
												style: { color: isDark ? "#94a3b8" : "#475569" },
												children: "Visual Inspection"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-md-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "form-check",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "form-check-input",
												type: "checkbox",
												id: "funcCheck"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-check-label small",
												htmlFor: "funcCheck",
												style: { color: isDark ? "#94a3b8" : "#475569" },
												children: "Functional Test"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "form-check",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "form-check-input",
												type: "checkbox",
												id: "materialCheck"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "form-check-label small",
												htmlFor: "materialCheck",
												style: { color: isDark ? "#94a3b8" : "#475569" },
												children: "Material Cert Check"
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-12",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "form-label small fw-medium",
											style: { color: isDark ? "#94a3b8" : "#475569" },
											children: "Inspection Notes"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											className: "form-control form-control-sm rounded-3",
											rows: 2,
											placeholder: "Quality inspection notes..."
										})]
									})
								]
							})]
						})
					})]
				})]
			})]
		})] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: premiumCss }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `container-fluid py-4 px-4 ${d}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex flex-wrap align-items-center justify-content-between mb-4",
					style: {
						position: "relative",
						zIndex: 110
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						sectionAccent,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
							className: "fw-bold mb-1",
							style: { color: isDark ? "#f1f5f9" : "#0f172a" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faTools,
								className: "me-2 text-primary"
							}), "Work Orders"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted small mb-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
								icon: faChartLine,
								className: "me-1",
								style: { fontSize: "10px" }
							}), "Manage shop floor execution, machine assignments, and work order tracking."]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-primary btn-sm rounded-pill px-3 premium-btn",
								onClick: () => setView("create"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faPlus,
									className: "me-1"
								}), "New Work Order"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-outline-secondary btn-sm rounded-pill premium-btn",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faCalendarAlt,
									className: "me-1"
								}), "Schedule"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-outline-secondary btn-sm rounded-pill premium-btn",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faMicrochip,
									className: "me-1"
								}), "Assign Machine"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FxImportDropdown, {
								title: "Work Orders",
								isDark,
								addNotification,
								onImport: handleImportWorkOrders,
								buttonClassName: "btn btn-sm rounded-pill premium-btn",
								buttonStyle: {
									background: "linear-gradient(135deg, #3b82f6, #2563eb)",
									color: "#fff",
									border: "none"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FxExportDropdown, {
								data: filtered,
								getExportData: (data) => data.map((w) => ({
									"WO No": w.no,
									"Prod Order": w.prodOrder,
									Operation: w.operation,
									Machine: w.machine,
									Operator: w.operator,
									Status: w.status,
									Shift: w.shift,
									Start: w.start,
									End: w.end,
									Progress: w.progress,
									Quality: w.quality,
									Priority: w.priority
								})),
								title: "Work Orders Report",
								filenamePrefix: "mfg-work-orders",
								moduleLabel: "MFG Module",
								isDark,
								addNotification,
								buttonClassName: "btn btn-sm rounded-pill premium-btn",
								buttonStyle: {
									background: "linear-gradient(135deg, #10b981, #059669)",
									color: "#fff",
									border: "none"
								}
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "row g-3 mb-4",
					children: [
						{
							label: "Pending",
							value: workOrders.filter((w) => w.status === "Pending").length,
							color: "#64748b",
							bg: "linear-gradient(135deg,#64748b15,#64748b05)",
							icon: faHourglassHalf
						},
						{
							label: "In Progress",
							value: workOrders.filter((w) => w.status === "In Progress").length,
							color: "#f59e0b",
							bg: "linear-gradient(135deg,#f59e0b15,#f59e0b05)",
							icon: faSpinner
						},
						{
							label: "Completed",
							value: workOrders.filter((w) => w.status === "Completed").length,
							color: "#10b981",
							bg: "linear-gradient(135deg,#10b98115,#10b98105)",
							icon: faCheckCircle
						},
						{
							label: "Paused",
							value: workOrders.filter((w) => w.status === "Paused").length,
							color: "#3b82f6",
							bg: "linear-gradient(135deg,#3b82f615,#3b82f605)",
							icon: faPause
						},
						{
							label: "Rejected",
							value: workOrders.filter((w) => w.status === "Rejected").length,
							color: "#ef4444",
							bg: "linear-gradient(135deg,#ef444415,#ef444405)",
							icon: faTimesCircle
						}
					].map((card, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col enter-anim",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "card border-0 rounded-4 premium-card glass-card",
							style: { background: isDark ? "#1e293b" : "#fff" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card-body py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center justify-content-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-3 d-flex align-items-center justify-content-center",
											style: {
												width: 44,
												height: 44,
												background: card.bg,
												color: card.color
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: card.icon,
												style: { fontSize: "1rem" }
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "live-dot ms-2",
											style: { verticalAlign: "middle" },
											title: "Live"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedCounter, {
										value: card.value,
										duration: 1e3
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-muted small mt-1",
										children: card.label
									})
								]
							})
						})
					}, idx))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card border-0 rounded-4 mb-4 premium-card glass-card",
					style: { background: isDark ? "#1e293b" : "#fff" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card-body p-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row g-2 align-items-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "input-group input-group-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "input-group-text bg-transparent border-end-0 rounded-start-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faSearch,
												style: {
													fontSize: "12px",
													color: isDark ? "#94a3b8" : "#64748b"
												}
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											className: "form-control form-control-sm border-start-0 rounded-end-3",
											placeholder: "Search work orders...",
											value: search,
											onChange: (e) => setSearch(e.target.value)
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										className: "form-select form-select-sm rounded-3",
										value: statusFilter,
										onChange: (e) => setStatusFilter(e.target.value),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "all",
											children: "All Status"
										}), statusList.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: s,
											children: s
										}, s))]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										className: "form-select form-select-sm rounded-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "All Operations" })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "col-md-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										className: "form-select form-select-sm rounded-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "All Machines" })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-md-3 d-flex gap-1 justify-content-end",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: `view-toggle-btn btn btn-sm border ${viewMode === "table" ? "active" : ""}`,
										onClick: () => setViewMode("table"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faTable,
											className: "me-1"
										}), "Table"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: `view-toggle-btn btn btn-sm border ${viewMode === "cards" ? "active" : ""}`,
										onClick: () => setViewMode("cards"),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faThLarge,
											className: "me-1"
										}), "Cards"]
									})]
								})
							]
						})
					})
				}),
				viewMode === "table" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "card border-0 rounded-4 premium-card glass-card",
					style: { background: isDark ? "#1e293b" : "#fff" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card-body p-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "premium-table-wrapper",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "table table-borderless align-middle mb-0 premium-table",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "ps-4",
										children: "WO No"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Prod Order" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Operation" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Machine" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Operator" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Shift" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Progress" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Quality" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pe-4",
										children: "Actions"
									})
								] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.map((wo, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "enter-anim",
									onClick: () => {
										setView("detail");
										setSelectedWo(wo);
									},
									style: {
										cursor: "pointer",
										animationDelay: `${idx * .04}s`
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "ps-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "fw-bold",
												style: {
													fontSize: "11px",
													color: isDark ? "#e2e8f0" : "#0f172a"
												},
												children: wo.no
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											style: {
												fontSize: "11px",
												color: isDark ? "#94a3b8" : "#475569"
											},
											children: wo.prodOrder
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											style: {
												fontSize: "11px",
												color: isDark ? "#cbd5e1" : "#334155"
											},
											children: wo.operation
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "premium-badge",
											style: {
												background: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
												color: isDark ? "#94a3b8" : "#475569"
											},
											children: wo.machine
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											style: {
												fontSize: "11px",
												color: isDark ? "#94a3b8" : "#475569"
											},
											children: wo.operator
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "premium-badge",
											style: {
												background: statusColors[wo.status].bg,
												color: statusColors[wo.status].text
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "badge-dot",
												style: { background: statusColors[wo.status].dot }
											}), wo.status]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											style: {
												fontSize: "11px",
												color: isDark ? "#94a3b8" : "#475569"
											},
											children: wo.shift
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											style: { minWidth: 100 },
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex align-items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "premium-progress flex-grow-1",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "premium-progress-bar",
														style: { width: wo.progress + "%" }
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", {
													className: "fw-bold",
													style: {
														fontSize: "9px",
														color: isDark ? "#94a3b8" : "#475569"
													},
													children: [wo.progress, "%"]
												})]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "premium-badge",
											style: {
												background: qualityColors[wo.quality].bg,
												color: qualityColors[wo.quality].text
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "badge-dot",
												style: { background: qualityColors[wo.quality].dot }
											}), wo.quality]
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "pe-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														className: "premium-action-btn",
														style: {
															background: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
															color: isDark ? "#94a3b8" : "#64748b"
														},
														title: "View",
														onClick: () => {
															setSelectedWo(wo);
															setView("detail");
														},
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: faEye,
															style: { fontSize: "11px" }
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														className: "premium-action-btn",
														style: {
															background: isDark ? "rgba(59,130,246,0.12)" : "rgba(59,130,246,0.08)",
															color: "#3b82f6"
														},
														title: "Edit",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: faEdit,
															style: { fontSize: "11px" }
														})
													}),
													wo.status === "Pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														className: "premium-action-btn",
														style: {
															background: isDark ? "rgba(16,185,129,0.12)" : "rgba(16,185,129,0.08)",
															color: "#10b981"
														},
														title: "Start",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: faPlay,
															style: { fontSize: "11px" }
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														className: "premium-action-btn",
														style: {
															background: "rgba(239,68,68,0.08)",
															color: "#ef4444"
														},
														title: "Delete",
														onClick: () => setDeletingWo(wo),
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: faTrash,
															style: { fontSize: "11px" }
														})
													})
												]
											})
										})
									]
								}, idx)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 10,
									className: "text-center py-5 text-muted",
									children: "No work orders found"
								}) })] })]
							})
						})
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row g-4",
					children: [filtered.map((wo, idx) => {
						const accentColor = statusColors[wo.status]?.dot || "#64748b";
						const progressColor = wo.progress === 100 ? "#10b981" : wo.progress >= 50 ? "#3b82f6" : "#f59e0b";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "col-xl-4 col-lg-6 enter-anim",
							style: { animationDelay: `${idx * .05}s` },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card border-0 h-100 wo-card glass-card",
								style: {
									background: isDark ? "#1e293b" : "#fff",
									boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.25)" : "0 8px 32px rgba(0,0,0,0.06)"
								},
								onClick: () => {
									setView("detail");
									setSelectedWo(wo);
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "wo-card-header",
										style: { background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}08)` },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "rounded-3 d-flex align-items-center justify-content-center",
												style: {
													width: 42,
													height: 42,
													background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
													color: "#fff",
													boxShadow: `0 4px 12px ${accentColor}44`
												},
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faWrench,
													style: { fontSize: "16px" }
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "fw-bold",
												style: {
													fontSize: "0.9rem",
													color: isDark ? "#f1f5f9" : "#0f172a",
													letterSpacing: "0.01em"
												},
												children: wo.no
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												style: {
													fontSize: "0.65rem",
													color: isDark ? "#64748b" : "#94a3b8"
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faLayerGroup,
													className: "me-1",
													style: { fontSize: "8px" }
												}), wo.prodOrder]
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "premium-badge",
											style: {
												background: statusColors[wo.status].bg,
												color: statusColors[wo.status].text,
												fontSize: "0.6rem",
												padding: "3px 10px"
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "badge-dot",
												style: { background: statusColors[wo.status].dot }
											}), wo.status]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "wo-card-body",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "wo-card-row",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "wo-icon-box",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faCog,
														style: {
															fontSize: "12px",
															color: isDark ? "#64748b" : "#94a3b8"
														}
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "fw-medium",
													style: { color: isDark ? "#e2e8f0" : "#1e293b" },
													children: wo.operation
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "wo-card-row",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "wo-icon-box",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: faMicrochip,
															style: {
																fontSize: "12px",
																color: isDark ? "#64748b" : "#94a3b8"
															}
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "premium-badge",
														style: {
															background: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
															color: isDark ? "#94a3b8" : "#475569",
															fontSize: "0.65rem"
														},
														children: wo.machine
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														style: { color: isDark ? "#475569" : "#cbd5e1" },
														children: "|"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "wo-icon-box",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: faUserCog,
															style: {
																fontSize: "12px",
																color: isDark ? "#64748b" : "#94a3b8"
															}
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														style: {
															color: isDark ? "#cbd5e1" : "#334155",
															fontSize: "0.78rem"
														},
														children: wo.operator
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "wo-card-row",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "wo-icon-box",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: faCalendarDay,
															style: {
																fontSize: "12px",
																color: isDark ? "#64748b" : "#94a3b8"
															}
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														style: {
															color: isDark ? "#94a3b8" : "#475569",
															fontSize: "0.72rem"
														},
														children: wo.start
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faArrowRight,
														style: {
															fontSize: "8px",
															color: isDark ? "#475569" : "#cbd5e1"
														}
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														style: {
															color: isDark ? "#94a3b8" : "#475569",
															fontSize: "0.72rem"
														},
														children: wo.end
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "wo-card-row",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "wo-icon-box",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
															icon: faClock,
															style: {
																fontSize: "12px",
																color: isDark ? "#64748b" : "#94a3b8"
															}
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														style: {
															color: isDark ? "#94a3b8" : "#475569",
															fontSize: "0.72rem"
														},
														children: wo.shift
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "ms-2 px-2 py-1 rounded-pill",
														style: {
															fontSize: "0.6rem",
															fontWeight: 600,
															background: `${accentColor}15`,
															color: accentColor
														},
														children: "8h expected"
													})
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "wo-card-progress-wrap",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "wo-card-progress",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "wo-gauge",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircularProgress, {
													progress: wo.progress,
													size: 56,
													strokeWidth: 5,
													color: progressColor
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "wo-progress-details",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "wo-progress-label",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															style: { color: isDark ? "#94a3b8" : "#64748b" },
															children: "Progress"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "fw-bold",
															style: { color: progressColor },
															children: [wo.progress, "%"]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "premium-progress",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "premium-progress-bar",
															style: {
																width: wo.progress + "%",
																background: `linear-gradient(90deg, ${progressColor}, ${progressColor}cc)`
															}
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "d-flex justify-content-between",
														style: {
															fontSize: "0.6rem",
															color: isDark ? "#64748b" : "#94a3b8"
														},
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Target: 100%" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
															"Produced: ",
															Math.round(wo.progress * 2.4),
															"/",
															240
														] })]
													})
												]
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "wo-card-footer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex align-items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex align-items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted",
													style: {
														fontSize: "0.6rem",
														fontWeight: 600,
														textTransform: "uppercase",
														letterSpacing: "0.04em"
													},
													children: "Quality"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "premium-badge",
													style: {
														background: qualityColors[wo.quality].bg,
														color: qualityColors[wo.quality].text,
														fontSize: "0.55rem",
														padding: "1px 7px"
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: wo.quality === "Pass" ? faCheckCircle : wo.quality === "Fail" ? faTimesCircle : faRedo,
														style: { fontSize: "7px" },
														className: "me-1"
													}), wo.quality]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faStar,
												style: {
													fontSize: "9px",
													color: wo.priority === "High" ? "#f59e0b" : wo.priority === "Critical" ? "#ef4444" : "#94a3b8"
												}
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "premium-action-btn",
													style: {
														width: 28,
														height: 28,
														background: isDark ? "rgba(255,255,255,0.06)" : "#f1f5f9",
														color: isDark ? "#94a3b8" : "#64748b"
													},
													title: "View",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faEye,
														style: { fontSize: "9px" }
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "premium-action-btn",
													style: {
														width: 28,
														height: 28,
														background: isDark ? "rgba(59,130,246,0.12)" : "rgba(59,130,246,0.08)",
														color: "#3b82f6"
													},
													title: "Edit",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faEdit,
														style: { fontSize: "9px" }
													})
												}),
												wo.status === "Pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "premium-action-btn",
													style: {
														width: 28,
														height: 28,
														background: isDark ? "rgba(16,185,129,0.12)" : "rgba(16,185,129,0.08)",
														color: "#10b981"
													},
													title: "Start",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faPlay,
														style: { fontSize: "9px" }
													})
												}),
												wo.status === "In Progress" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "premium-action-btn",
													style: {
														width: 28,
														height: 28,
														background: isDark ? "rgba(245,158,11,0.12)" : "rgba(245,158,11,0.08)",
														color: "#f59e0b"
													},
													title: "Pause",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faPause,
														style: { fontSize: "9px" }
													})
												})
											]
										})]
									})
								]
							})
						}, idx);
					}), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-12 text-center py-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mb-3",
								style: { opacity: .25 },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faTools,
									size: "3x",
									style: { color: isDark ? "#94a3b8" : "#64748b" }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold",
								style: { color: isDark ? "#64748b" : "#94a3b8" },
								children: "No Work Orders Found"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted small",
								children: "Try adjusting your search or filters"
							})
						]
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBox.Confirm, {
			show: !!deletingWo,
			onClose: () => setDeletingWo(null),
			onConfirm: handleConfirmDelete,
			title: "Delete Work Order",
			message: `Move work order "${deletingWo?.no || deletingWo?.id}" to trash? You can restore it later from the Manufacturing Trash tab.`,
			confirmLabel: "Move to Trash",
			variant: "danger"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogBox.Confirm, {
			show: !!scraptingWo,
			onClose: () => setScraptingWo(null),
			onConfirm: handleConfirmScrap,
			title: "Scrap Work Order",
			message: `Scrap work order "${scraptingWo?.no || scraptingWo?.id}" and move it to trash? You can restore it later from the Manufacturing Trash tab.`,
			confirmLabel: "Scrap & Move to Trash",
			variant: "danger"
		})
	] });
};
//#endregion
export { MfgBillOfMaterials as a, resetPersistedData as c, FxExportDropdown as d, FxImportDropdown as f, MfgDashboard as i, softDeleteRecord as l, MfgTrash as n, ModuleTrashPage as o, MfgProductionOrders as r, loadEntityList as s, MfgWorkOrders as t, writeEntityList as u };
