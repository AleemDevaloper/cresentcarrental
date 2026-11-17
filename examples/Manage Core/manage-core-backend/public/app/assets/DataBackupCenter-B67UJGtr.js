import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Dl as require_jsx_runtime, Rr as faFileCsv, Zn as faDatabase, gs as faShieldHalved, jn as faCloudUploadAlt, qr as faFilePdf, ru as require_react, sn as faCircleCheck, sr as faDownload, us as faServer, vl as FontAwesomeIcon, xc as faTriangleExclamation } from "./ai-BHgPkVLC.js";
import { Jr as downloadTextFile, Qr as toCsv, Xr as readFeatureRecords, Zr as recordsToSql } from "./fms-BQz62Xux.js";
import { D as updateStorageSettings, E as getStorageSettings, P as listUsers } from "./superadmin-Cn5Mt1aQ.js";
import { T as getAllFeatures } from "./pms-CfRqXdhw.js";
//#region src/pages/admin/DataBackupCenter.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var backupSystems = [
	{
		key: "users",
		label: "Users",
		records: null
	},
	{
		key: "hrms",
		label: "HRMS",
		records: null
	},
	{
		key: "fms",
		label: "FMS",
		records: null
	},
	{
		key: "pms",
		label: "PMS",
		records: null
	},
	{
		key: "tms",
		label: "TMS",
		records: null
	}
];
function collectSystemRecords(system) {
	return getAllFeatures().filter((feature) => feature.system === system).flatMap((feature) => readFeatureRecords(system, feature.id).map((record) => ({
		system,
		feature: feature.label,
		featureId: feature.id,
		...record
	})));
}
var DataBackupCenter = () => {
	const [userRecords, setUserRecords] = (0, import_react.useState)([]);
	const [storagePath, setStoragePath] = (0, import_react.useState)("");
	const [storageMeta, setStorageMeta] = (0, import_react.useState)({
		storagePath: "",
		storageStatus: "",
		storageStatusMessage: "",
		defaultStoragePath: ""
	});
	const [storageLoading, setStorageLoading] = (0, import_react.useState)(true);
	const [storageSaving, setStorageSaving] = (0, import_react.useState)(false);
	const [storageError, setStorageError] = (0, import_react.useState)("");
	const [storageSuccess, setStorageSuccess] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let mounted = true;
		const loadStorage = async () => {
			try {
				const data = await getStorageSettings();
				if (!mounted) return;
				setStorageMeta(data);
				setStoragePath(data.storagePath || "");
			} catch (error) {
				if (!mounted) return;
				setStorageError(error.message || "Failed to load storage settings.");
			} finally {
				if (mounted) setStorageLoading(false);
			}
		};
		loadStorage();
		return () => {
			mounted = false;
		};
	}, []);
	const handleStorageUpdate = async (e) => {
		e.preventDefault();
		if (!storagePath.trim()) {
			setStorageError("Storage path is required.");
			return;
		}
		setStorageSaving(true);
		setStorageError("");
		setStorageSuccess("");
		try {
			const data = await updateStorageSettings(storagePath.trim());
			setStorageMeta(data);
			setStoragePath(data.storagePath || "");
			setStorageSuccess("Storage configuration updated successfully.");
			setTimeout(() => setStorageSuccess(""), 3e3);
		} catch (error) {
			setStorageError(error.message || "Update failed.");
		} finally {
			setStorageSaving(false);
		}
	};
	(0, import_react.useEffect)(() => {
		const fetchUsers = async () => {
			try {
				setUserRecords((await listUsers()).map((u, index) => ({
					"User No": index + 1,
					"Employee ID": u.empId || "N/A",
					"Name": u.name,
					"Email": u.email,
					"Role": u.role,
					"Status": u.status,
					"Joining Date": u.joiningDate || "N/A",
					"System": "Users"
				})));
			} catch (error) {
				console.error("Failed to fetch users for backup:", error);
			}
		};
		fetchUsers();
	}, []);
	const summaries = (0, import_react.useMemo)(() => backupSystems.map((item) => {
		let records = item.records;
		if (item.key === "users") records = userRecords;
		else if (records === null) records = collectSystemRecords(item.key);
		return {
			...item,
			records,
			count: records.length
		};
	}), [userRecords]);
	const allRecords = summaries.flatMap((item) => item.records.map((record) => ({
		backupSystem: item.label,
		...record
	})));
	const exportSystem = (systemKey, format) => {
		const summary = summaries.find((item) => item.key === systemKey);
		if (!summary) return;
		if (format === "json") downloadTextFile(`${systemKey}-backup.json`, JSON.stringify(summary.records, null, 2), "application/json;charset=utf-8");
		if (format === "csv") downloadTextFile(`${systemKey}-backup.csv`, toCsv(summary.records), "text/csv;charset=utf-8");
		if (format === "sql") downloadTextFile(`${systemKey}-backup.sql`, recordsToSql(`${systemKey}_backup`, summary.records), "application/sql;charset=utf-8");
		if (format === "nosql") downloadTextFile(`${systemKey}-nosql-export.json`, JSON.stringify({
			collection: systemKey,
			documents: summary.records
		}, null, 2), "application/json;charset=utf-8");
	};
	const exportAll = (format) => {
		if (format === "json") downloadTextFile("manage-core-full-backup.json", JSON.stringify(allRecords, null, 2), "application/json;charset=utf-8");
		if (format === "csv") downloadTextFile("manage-core-full-backup.csv", toCsv(allRecords), "text/csv;charset=utf-8");
		if (format === "sql") downloadTextFile("manage-core-full-backup.sql", recordsToSql("manage_core_backup", allRecords), "application/sql;charset=utf-8");
		if (format === "nosql") downloadTextFile("manage-core-nosql-export.json", JSON.stringify({
			database: "manage_core",
			collections: summaries
		}, null, 2), "application/json;charset=utf-8");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "backup-center px-3 px-lg-4 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "backup-hero rounded-5 p-4 p-lg-5 mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "row align-items-center g-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col-lg-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "badge bg-white text-primary rounded-pill px-3 py-2 mb-3 fw-bold",
								children: "ADMIN BACKUP CONTROL"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-white fw-bold mb-2",
								children: "Data Backup Center"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-white-50 mb-0",
								children: "Export Users, HRMS, FMS, PMS, TMS, and future system records in CSV, Excel-friendly CSV, PDF print, SQL, and NoSQL JSON formats."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-lg-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "backup-glass rounded-4 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-3 mb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "backup-icon",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faShieldHalved })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
									className: "text-white fw-bold mb-0",
									children: allRecords.length
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-white-50 small mb-0",
									children: "Frontend records available"
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-light btn-sm rounded-pill",
										onClick: () => exportAll("csv"),
										children: "CSV All"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-light btn-sm rounded-pill",
										onClick: () => exportAll("json"),
										children: "JSON All"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-light btn-sm rounded-pill",
										onClick: () => exportAll("sql"),
										children: "SQL All"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "btn btn-light btn-sm rounded-pill",
										onClick: () => window.print(),
										children: "PDF Print"
									})
								]
							})]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 rounded-4 mb-4 storage-config-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-body p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "d-flex align-items-center gap-3 mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-2 rounded-3",
								style: { background: "rgba(79, 70, 229, 0.1)" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faCloudUploadAlt,
									className: "text-primary"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
								className: "fw-bold mb-1",
								children: "System Storage"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted small mb-0",
								children: "Manage file paths and server storage configuration"
							})] })]
						}),
						storageSuccess && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "alert alert-success border-0 rounded-4 py-2 small d-flex align-items-center gap-2 mb-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCircleCheck }),
								" ",
								storageSuccess
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "alert bg-light border-0 rounded-4 p-3 mb-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faTriangleExclamation,
										size: "sm"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "small text-muted mb-0",
									children: "Changing the storage path affects all future file uploads. Ensure the new path exists and is writable by the server."
								}) })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleStorageUpdate,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "d-flex justify-content-between align-items-center mb-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "fw-bold small text-dark mb-0",
												children: "Absolute Storage Path"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `badge ${storageMeta.storageStatus === "Ready" ? "bg-success" : "bg-warning"} rounded-pill`,
												children: storageMeta.storageStatus === "Ready" ? "Ready" : storageMeta.storageStatus || "Checking"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "input-group",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "input-group-text bg-light border-0",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: faCloudUploadAlt,
													className: "text-muted"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												className: "form-control border-0 bg-light",
												placeholder: storageMeta.defaultStoragePath || "C:\\ManageCore\\Projects",
												value: storagePath,
												onChange: (e) => setStoragePath(e.target.value),
												required: true,
												style: { fontWeight: 600 }
											})]
										}),
										storageError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-danger small mt-1 fw-bold",
											children: storageError
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-muted small mt-2",
											children: ["Current active: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
												className: "bg-light px-2 py-1 rounded",
												children: storageMeta.storagePath || "System default"
											})]
										})
									]
								}),
								storageMeta.storageStatusMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2 rounded-3 bg-light border-start border-4 border-primary mb-3 small",
									children: storageMeta.storageStatusMessage
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "submit",
									className: "btn btn-primary rounded-4 px-4 py-2 fw-bold",
									disabled: storageLoading || storageSaving,
									children: storageSaving ? "Configuring..." : "Update System Path"
								})
							]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "row g-4 mb-4",
				children: summaries.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "col-xl-3 col-md-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "card border-0 rounded-4 h-100 backup-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card-body p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex align-items-center justify-content-between mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "backup-card-icon",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: item.key === "users" ? faServer : faDatabase })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "badge bg-primary-subtle text-primary rounded-pill",
										children: [item.count, " Records"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
									className: "fw-bold mb-1",
									children: item.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-muted small mb-3",
									children: [
										"Export ",
										item.label,
										" frontend records and registers."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "d-flex flex-wrap gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "btn btn-outline-primary btn-sm rounded-pill",
											onClick: () => exportSystem(item.key, "csv"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faFileCsv,
												className: "me-1"
											}), "CSV"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "btn btn-outline-primary btn-sm rounded-pill",
											onClick: () => exportSystem(item.key, "json"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faDownload,
												className: "me-1"
											}), "JSON"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn btn-outline-primary btn-sm rounded-pill",
											onClick: () => exportSystem(item.key, "sql"),
											children: "SQL"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "btn btn-outline-secondary btn-sm rounded-pill",
											onClick: () => window.print(),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faFilePdf,
												className: "me-1"
											}), "PDF"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn btn-outline-success btn-sm rounded-pill",
											onClick: () => exportSystem(item.key, "nosql"),
											children: "NoSQL"
										})
									]
								})
							]
						})
					})
				}, item.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 rounded-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "card-body p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
							className: "fw-bold mb-3",
							children: "Backup Matrix"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "table-responsive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "table align-middle",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "System" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Records" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Excel Export" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "CSV Export" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "PDF Export" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "SQL Export" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "NoSQL Export" })
								] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: summaries.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "fw-bold",
										children: item.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: item.count }),
									[
										"Excel-friendly CSV",
										"CSV",
										"Print/PDF",
										"SQL",
										"NoSQL JSON"
									].map((label) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "badge bg-success-subtle text-success rounded-pill",
										children: "Ready"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-muted x-small",
										children: label
									})] }, label))
								] }, item.key)) })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "alert alert-warning border-0 rounded-4 mb-0",
							children: "This backup center exports frontend/browser records from this uploaded React project. Server database backup requires backend API/database access, which is not present in the uploaded ZIP."
						})
					]
				})
			})
		]
	});
};
//#endregion
export { DataBackupCenter as default };
