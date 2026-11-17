import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Ac as faUndo, Dl as require_jsx_runtime, Ds as faSliders, Ec as faTv, Er as faEye, F as faArrowPointer, Fc as faUpload, Mn as faCode, Qa as faNetworkWired, Un as faCompress, X as faArrowsUpDownLeftRight, _c as faTrash, ac as faTextHeight, ba as faLock, cs as faSearchMinus, ei as faFillDrip, hl as faWindowMaximize, io as faPaperclip, it as faBars, jo as faProjectDiagram, ls as faSearchPlus, mt as faBorderAll, no as faPalette, on as faCircle, os as faSearch, qn as faCrop, qo as faRobot, ro as faPaperPlane, ru as require_react, sr as faDownload, uo as faPencilAlt, vc as faTrashAlt, vl as FontAwesomeIcon, wo as faPlay, xa as faLockOpen, yr as faEraser, zo as faRedo } from "./ai-BHgPkVLC.js";
//#region src/pages/systems/Drawing/DrawingWorkspace.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var defaultObjects = [
	{
		id: "obj1",
		type: "rectangle",
		name: "Header Container",
		x: 200,
		y: 100,
		w: 600,
		h: 80,
		fill: "#1e293b",
		stroke: "#334155",
		strokeWidth: 2,
		radius: 8,
		opacity: 100,
		fontColor: "#ffffff",
		text: "ManageCore Admin Dashboard Header",
		layerName: "Header Panel",
		locked: false,
		hidden: false
	},
	{
		id: "obj2",
		type: "circle",
		name: "User Profile Avatar",
		x: 740,
		y: 120,
		w: 40,
		h: 40,
		fill: "#3b82f6",
		stroke: "#2563eb",
		strokeWidth: 2,
		radius: 20,
		opacity: 100,
		fontColor: "#ffffff",
		text: "U",
		layerName: "Avatar Icon",
		locked: false,
		hidden: false
	},
	{
		id: "obj3",
		type: "sticky",
		name: "Task Note",
		x: 200,
		y: 220,
		w: 180,
		h: 180,
		fill: "#fef08a",
		stroke: "#facc15",
		strokeWidth: 1,
		radius: 4,
		opacity: 100,
		fontColor: "#1e293b",
		text: "TODO: Connect AWS RDS database instance to backup controller.",
		layerName: "Dev Note",
		assignee: "Tony Stark",
		priority: "High",
		locked: false,
		hidden: false
	},
	{
		id: "obj4",
		type: "cloud",
		name: "AWS Cloud Network",
		x: 450,
		y: 220,
		w: 200,
		h: 120,
		fill: "#eff6ff",
		stroke: "#3b82f6",
		strokeWidth: 2,
		radius: 12,
		opacity: 100,
		fontColor: "#1e3a8a",
		text: "Amazon Web Services",
		layerName: "AWS VPC Cloud",
		locked: false,
		hidden: false
	},
	{
		id: "obj5",
		type: "connector",
		name: "Line Connection",
		x: 380,
		y: 310,
		x2: 450,
		y2: 280,
		stroke: "#3b82f6",
		strokeWidth: 3,
		arrowEnd: true,
		layerName: "Network Route",
		locked: false,
		hidden: false
	}
];
var defaultComments = [{
	id: "c1",
	objectId: "obj3",
	author: "Steve Rogers",
	text: "This task needs to be finished before the sprint freeze on Friday.",
	time: "10:14 AM"
}, {
	id: "c2",
	objectId: "obj4",
	author: "Natasha Romanoff",
	text: "Is this VPC configured across multiple availability zones?",
	time: "11:05 AM"
}];
var defaultHistory = [{
	id: "h1",
	action: "Created canvas",
	user: "System",
	time: "11:28 AM"
}, {
	id: "h2",
	action: "Added AWS Cloud Network shape",
	user: "Tony Stark",
	time: "11:30 AM"
}];
var DrawingWorkspace = () => {
	const [activeWorkspaceMode, setActiveWorkspaceMode] = (0, import_react.useState)("drawing");
	const [zoom, setZoom] = (0, import_react.useState)(100);
	const [rotation, setRotation] = (0, import_react.useState)(0);
	const [panX, setPanX] = (0, import_react.useState)(0);
	const [panY, setPanY] = (0, import_react.useState)(0);
	const [isPanning, setIsPanning] = (0, import_react.useState)(false);
	const [startPan, setStartPan] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const [gridType, setGridType] = (0, import_react.useState)("dots");
	const [snapToGrid, setSnapToGrid] = (0, import_react.useState)(true);
	const [activeTool, setActiveTool] = (0, import_react.useState)("select");
	const [canvasObjects, setCanvasObjects] = (0, import_react.useState)(() => {
		const stored = localStorage.getItem("drawing_objects");
		return stored ? JSON.parse(stored) : defaultObjects;
	});
	const [comments, setComments] = (0, import_react.useState)(() => {
		const stored = localStorage.getItem("drawing_comments");
		return stored ? JSON.parse(stored) : defaultComments;
	});
	const [historyTimeline, setHistoryTimeline] = (0, import_react.useState)(defaultHistory);
	const [saveStatus, setSaveStatus] = (0, import_react.useState)("Saved");
	const [selectedIds, setSelectedIds] = (0, import_react.useState)([]);
	const selectedObjects = (0, import_react.useMemo)(() => {
		return canvasObjects.filter((obj) => selectedIds.includes(obj.id));
	}, [canvasObjects, selectedIds]);
	const primarySelected = selectedObjects[0] || null;
	const [freehandPaths, setFreehandPaths] = (0, import_react.useState)([]);
	const [currentPath, setCurrentPath] = (0, import_react.useState)(null);
	const [pencilColor, setPencilColor] = (0, import_react.useState)("#3b82f6");
	const [pencilWidth, setPencilWidth] = (0, import_react.useState)(3);
	const [undoStack, setUndoStack] = (0, import_react.useState)([]);
	const [redoStack, setRedoStack] = (0, import_react.useState)([]);
	const [draggingObjectId, setDraggingObjectId] = (0, import_react.useState)(null);
	const [dragOffset, setDragOffset] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const [isErasing, setIsErasing] = (0, import_react.useState)(false);
	const [drawingShapeId, setDrawingShapeId] = (0, import_react.useState)(null);
	const [drawingStartPos, setDrawingStartPos] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const [drawingConnector, setDrawingConnector] = (0, import_react.useState)(null);
	const [smartGuides, setSmartGuides] = (0, import_react.useState)(null);
	const [aiInput, setAiInput] = (0, import_react.useState)("");
	const [aiChats, setAiChats] = (0, import_react.useState)([{
		sender: "AI Assistant",
		text: "Hello! I am your Enterprise Design Copilot. I can generate database schemas, AWS networks, or Tailwind CSS code based on your requirements.",
		code: null
	}]);
	const [aiStreaming, setAiStreaming] = (0, import_react.useState)(false);
	const [brandColors, setBrandColors] = (0, import_react.useState)([
		"#1e293b",
		"#3b82f6",
		"#10b981",
		"#f59e0b",
		"#ef4444",
		"#8b5cf6"
	]);
	const [sidebarOpen, setSidebarOpen] = (0, import_react.useState)(true);
	const [inspectorOpen, setInspectorOpen] = (0, import_react.useState)(true);
	const [activeColor, setActiveColor] = (0, import_react.useState)("#3b82f6");
	const canvasRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		localStorage.setItem("drawing_objects", JSON.stringify(canvasObjects));
		localStorage.setItem("drawing_comments", JSON.stringify(comments));
	}, [canvasObjects, comments]);
	const pushUndoState = () => {
		setUndoStack((prev) => {
			return [...prev.length > 40 ? prev.slice(prev.length - 40) : prev, {
				objects: JSON.parse(JSON.stringify(canvasObjects)),
				paths: JSON.parse(JSON.stringify(freehandPaths))
			}];
		});
		setRedoStack([]);
	};
	const handleUndo = () => {
		if (undoStack.length === 0) {
			addToast("Nothing to undo", "info");
			return;
		}
		const previous = undoStack[undoStack.length - 1];
		setRedoStack((prev) => [...prev, {
			objects: JSON.parse(JSON.stringify(canvasObjects)),
			paths: JSON.parse(JSON.stringify(freehandPaths))
		}]);
		setCanvasObjects(previous.objects);
		setFreehandPaths(previous.paths);
		setUndoStack((prev) => prev.slice(0, -1));
		addHistory("Undid last action");
		addToast("Action undone.", "info");
	};
	const handleRedo = () => {
		if (redoStack.length === 0) {
			addToast("Nothing to redo", "info");
			return;
		}
		const next = redoStack[redoStack.length - 1];
		setUndoStack((prev) => [...prev, {
			objects: JSON.parse(JSON.stringify(canvasObjects)),
			paths: JSON.parse(JSON.stringify(freehandPaths))
		}]);
		setCanvasObjects(next.objects);
		setFreehandPaths(next.paths);
		setRedoStack((prev) => prev.slice(0, -1));
		addHistory("Redid action");
		addToast("Action redone.", "info");
	};
	const triggerAutoSave = () => {
		setSaveStatus("Saving...");
		setTimeout(() => {
			setSaveStatus("Saved");
		}, 1200);
	};
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if (e.key === "Delete" || e.key === "Backspace") {
				if (selectedIds.length > 0) {
					pushUndoState();
					setCanvasObjects((prev) => prev.filter((o) => !selectedIds.includes(o.id)));
					setSelectedIds([]);
					addHistory("Deleted selected objects");
					triggerAutoSave();
				}
			}
			if (e.ctrlKey && e.key === "d") {
				e.preventDefault();
				if (selectedIds.length > 0) {
					pushUndoState();
					const duplicated = selectedObjects.map((obj) => ({
						...obj,
						id: "obj_dup_" + Date.now() + Math.random(),
						x: obj.x + 30,
						y: obj.y + 30,
						name: `${obj.name} (Copy)`
					}));
					setCanvasObjects((prev) => [...prev, ...duplicated]);
					addHistory("Duplicated objects");
					triggerAutoSave();
				}
			}
			if (e.ctrlKey && e.key === "z") {
				e.preventDefault();
				handleUndo();
			}
			if (e.ctrlKey && e.key === "y") {
				e.preventDefault();
				handleRedo();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		selectedIds,
		canvasObjects,
		undoStack,
		redoStack
	]);
	const addHistory = (action) => {
		const newH = {
			id: "h_" + Date.now(),
			action,
			user: "Company Admin",
			time: (/* @__PURE__ */ new Date()).toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit"
			})
		};
		setHistoryTimeline((prev) => [newH, ...prev]);
	};
	const handleCanvasMouseDown = (e) => {
		pushUndoState();
		if (activeTool === "select") {
			const rect = canvasRef.current.getBoundingClientRect();
			const clickX = (e.clientX - rect.left - panX) / (zoom / 100);
			const clickY = (e.clientY - rect.top - panY) / (zoom / 100);
			const clicked = [...canvasObjects].reverse().find((obj) => {
				if (obj.hidden) return false;
				return clickX >= obj.x && clickX <= obj.x + obj.w && clickY >= obj.y && clickY <= obj.y + obj.h;
			});
			if (clicked) {
				if (clicked.locked) return;
				if (e.shiftKey || e.ctrlKey) setSelectedIds((prev) => prev.includes(clicked.id) ? prev.filter((id) => id !== clicked.id) : [...prev, clicked.id]);
				else setSelectedIds([clicked.id]);
				setDraggingObjectId(clicked.id);
				setDragOffset({
					x: clickX - clicked.x,
					y: clickY - clicked.y
				});
			} else setSelectedIds([]);
		} else if (activeTool === "pencil") {
			const rect = canvasRef.current.getBoundingClientRect();
			const ptX = (e.clientX - rect.left - panX) / (zoom / 100);
			const ptY = (e.clientY - rect.top - panY) / (zoom / 100);
			setCurrentPath({
				id: "path_" + Date.now(),
				points: [{
					x: ptX,
					y: ptY
				}],
				color: pencilColor,
				width: pencilWidth
			});
		} else if (activeTool === "hand") {
			setIsPanning(true);
			setStartPan({
				x: e.clientX - panX,
				y: e.clientY - panY
			});
		} else if (activeTool === "eraser") {
			setIsErasing(true);
			const rect = canvasRef.current.getBoundingClientRect();
			const clickX = (e.clientX - rect.left - panX) / (zoom / 100);
			const clickY = (e.clientY - rect.top - panY) / (zoom / 100);
			setCanvasObjects((prev) => prev.filter((obj) => {
				return !(clickX >= obj.x && clickX <= obj.x + obj.w && clickY >= obj.y && clickY <= obj.y + obj.h);
			}));
			setFreehandPaths((prev) => prev.filter((path) => {
				return !path.points.some((p) => Math.hypot(p.x - clickX, p.y - clickY) < 20);
			}));
		} else if (activeTool === "rectangle" || activeTool === "circle") {
			const rect = canvasRef.current.getBoundingClientRect();
			const clickX = (e.clientX - rect.left - panX) / (zoom / 100);
			const clickY = (e.clientY - rect.top - panY) / (zoom / 100);
			const shapeId = "obj_" + Date.now();
			const newShape = {
				id: shapeId,
				type: activeTool,
				name: `User Drawn ${activeTool}`,
				x: clickX,
				y: clickY,
				w: 10,
				h: 10,
				fill: "#3b82f61c",
				stroke: "#3b82f6",
				strokeWidth: 2,
				radius: activeTool === "circle" ? 5 : 8,
				opacity: 100,
				fontColor: "#1e293b",
				text: "",
				layerName: `Drawn ${activeTool}`,
				locked: false,
				hidden: false
			};
			setCanvasObjects((prev) => [...prev, newShape]);
			setDrawingShapeId(shapeId);
			setDrawingStartPos({
				x: clickX,
				y: clickY
			});
			setSelectedIds([shapeId]);
		} else if (activeTool === "text") {
			const rect = canvasRef.current.getBoundingClientRect();
			const clickX = (e.clientX - rect.left - panX) / (zoom / 100);
			const clickY = (e.clientY - rect.top - panY) / (zoom / 100);
			const textVal = prompt("Enter text for canvas:", "Double click to edit");
			if (textVal !== null) {
				const shapeId = "obj_" + Date.now();
				const newShape = {
					id: shapeId,
					type: "rectangle",
					name: "Text Block",
					x: clickX,
					y: clickY,
					w: 180,
					h: 60,
					fill: "transparent",
					stroke: "transparent",
					strokeWidth: 0,
					radius: 0,
					opacity: 100,
					fontColor: "#1e293b",
					text: textVal,
					layerName: "Text Box",
					locked: false,
					hidden: false
				};
				setCanvasObjects((prev) => [...prev, newShape]);
				setSelectedIds([shapeId]);
				addHistory("Created text label");
				triggerAutoSave();
			}
		} else if (activeTool === "connector") {
			const rect = canvasRef.current.getBoundingClientRect();
			const clickX = (e.clientX - rect.left - panX) / (zoom / 100);
			const clickY = (e.clientY - rect.top - panY) / (zoom / 100);
			setDrawingStartPos({
				x: clickX,
				y: clickY
			});
			setDrawingConnector({
				id: "conn_temp",
				x: clickX,
				y: clickY,
				x2: clickX,
				y2: clickY,
				stroke: "#3b82f6",
				strokeWidth: 2
			});
		}
	};
	const handleCanvasMouseMove = (e) => {
		if (draggingObjectId && activeTool === "select") {
			const rect = canvasRef.current.getBoundingClientRect();
			const mouseX = (e.clientX - rect.left - panX) / (zoom / 100);
			const mouseY = (e.clientY - rect.top - panY) / (zoom / 100);
			let targetX = mouseX - dragOffset.x;
			let targetY = mouseY - dragOffset.y;
			if (snapToGrid) {
				targetX = Math.round(targetX / 20) * 20;
				targetY = Math.round(targetY / 20) * 20;
			}
			let guideLine = null;
			canvasObjects.forEach((other) => {
				if (other.id === draggingObjectId) return;
				if (Math.abs(targetX - other.x) < 8) {
					targetX = other.x;
					guideLine = {
						type: "vertical",
						val: targetX
					};
				}
				if (Math.abs(targetY - other.y) < 8) {
					targetY = other.y;
					guideLine = {
						type: "horizontal",
						val: targetY
					};
				}
			});
			setSmartGuides(guideLine);
			setCanvasObjects((prev) => prev.map((obj) => {
				if (obj.id === draggingObjectId) return {
					...obj,
					x: targetX,
					y: targetY
				};
				return obj;
			}));
		} else if (currentPath && activeTool === "pencil") {
			const rect = canvasRef.current.getBoundingClientRect();
			const ptX = (e.clientX - rect.left - panX) / (zoom / 100);
			const ptY = (e.clientY - rect.top - panY) / (zoom / 100);
			setCurrentPath((prev) => ({
				...prev,
				points: [...prev.points, {
					x: ptX,
					y: ptY
				}]
			}));
		} else if (drawingShapeId && (activeTool === "rectangle" || activeTool === "circle")) {
			const rect = canvasRef.current.getBoundingClientRect();
			const mouseX = (e.clientX - rect.left - panX) / (zoom / 100);
			const mouseY = (e.clientY - rect.top - panY) / (zoom / 100);
			const width = mouseX - drawingStartPos.x;
			const height = mouseY - drawingStartPos.y;
			setCanvasObjects((prev) => prev.map((o) => {
				if (o.id === drawingShapeId) return {
					...o,
					w: Math.max(10, Math.abs(width)),
					h: Math.max(10, Math.abs(height)),
					x: width < 0 ? mouseX : drawingStartPos.x,
					y: height < 0 ? mouseY : drawingStartPos.y,
					radius: o.type === "circle" ? Math.max(5, Math.abs(width) / 2) : o.radius
				};
				return o;
			}));
		} else if (drawingConnector && activeTool === "connector") {
			const rect = canvasRef.current.getBoundingClientRect();
			const mouseX = (e.clientX - rect.left - panX) / (zoom / 100);
			const mouseY = (e.clientY - rect.top - panY) / (zoom / 100);
			setDrawingConnector((prev) => ({
				...prev,
				x2: mouseX,
				y2: mouseY
			}));
		} else if (isPanning && activeTool === "hand") {
			setPanX(e.clientX - startPan.x);
			setPanY(e.clientY - startPan.y);
		} else if (isErasing && activeTool === "eraser") {
			const rect = canvasRef.current.getBoundingClientRect();
			const mouseX = (e.clientX - rect.left - panX) / (zoom / 100);
			const mouseY = (e.clientY - rect.top - panY) / (zoom / 100);
			setCanvasObjects((prev) => prev.filter((obj) => {
				return !(mouseX >= obj.x && mouseX <= obj.x + obj.w && mouseY >= obj.y && mouseY <= obj.y + obj.h);
			}));
			setFreehandPaths((prev) => prev.filter((path) => {
				return !path.points.some((p) => Math.hypot(p.x - mouseX, p.y - mouseY) < 20);
			}));
		}
	};
	const handleCanvasMouseUp = () => {
		if (draggingObjectId) {
			setDraggingObjectId(null);
			setSmartGuides(null);
			addHistory(`Moved object`);
			triggerAutoSave();
		}
		if (currentPath) {
			setFreehandPaths((prev) => [...prev, currentPath]);
			setCurrentPath(null);
			addHistory("Drew freehand stroke");
			triggerAutoSave();
		}
		if (isPanning) setIsPanning(false);
		if (isErasing) {
			setIsErasing(false);
			addHistory("Erased canvas paths");
			triggerAutoSave();
		}
		if (drawingShapeId) {
			setDrawingShapeId(null);
			addHistory("Drew new vector shape");
			triggerAutoSave();
		}
		if (drawingConnector) {
			const newConn = {
				id: "conn_" + Date.now(),
				type: "connector",
				name: "Line Connection",
				x: drawingStartPos.x,
				y: drawingStartPos.y,
				x2: drawingConnector.x2,
				y2: drawingConnector.y2,
				stroke: "#3b82f6",
				strokeWidth: 3,
				arrowEnd: true,
				layerName: "User Connector",
				locked: false,
				hidden: false
			};
			setCanvasObjects((prev) => [...prev, newConn]);
			setDrawingConnector(null);
			addHistory("Connected nodes with line");
			triggerAutoSave();
		}
	};
	const createShapeFromLibrary = (type, title = "New Shape") => {
		pushUndoState();
		const activeCol = activeColor || brandColors[0];
		const newObj = {
			id: "obj_" + Date.now(),
			type,
			name: title,
			x: 350 - panX,
			y: 200 - panY,
			w: type === "circle" ? 100 : type === "sticky" ? 180 : 160,
			h: type === "circle" ? 100 : type === "sticky" ? 180 : 100,
			fill: type === "sticky" ? "#fef08a" : `${activeCol}22`,
			stroke: activeCol,
			strokeWidth: 2,
			radius: type === "circle" ? 50 : 8,
			opacity: 100,
			fontColor: "#1e293b",
			text: title,
			layerName: title,
			locked: false,
			hidden: false
		};
		setCanvasObjects((prev) => [...prev, newObj]);
		setSelectedIds([newObj.id]);
		addHistory(`Added ${title} from library`);
		triggerAutoSave();
	};
	const executeAiCommand = () => {
		if (!aiInput.trim()) return;
		pushUndoState();
		const query = aiInput.trim();
		setAiChats((prev) => [...prev, {
			sender: "User",
			text: query
		}]);
		setAiInput("");
		setAiStreaming(true);
		setTimeout(() => {
			if (query.toLowerCase().includes("crm") || query.toLowerCase().includes("dashboard")) {
				const genObjects = [
					{
						id: "ai_gen_1",
						type: "rectangle",
						name: "CRM Container",
						x: 250,
						y: 150,
						w: 500,
						h: 300,
						fill: "#f8fafc",
						stroke: "#cbd5e1",
						strokeWidth: 1,
						radius: 12,
						opacity: 100,
						fontColor: "#1e293b",
						text: "CRM Overview Widget Grid",
						layerName: "AI CRM Card"
					},
					{
						id: "ai_gen_2",
						type: "circle",
						name: "Sales Pie Chart",
						x: 300,
						y: 220,
						w: 120,
						h: 120,
						fill: "#e0f2fe",
						stroke: "#0284c7",
						strokeWidth: 2,
						radius: 60,
						opacity: 100,
						fontColor: "#0369a1",
						text: "78% Win",
						layerName: "AI Pie Graphic"
					},
					{
						id: "ai_gen_3",
						type: "rectangle",
						name: "KPI Metric",
						x: 450,
						y: 220,
						w: 250,
						h: 120,
						fill: "#ecfdf5",
						stroke: "#10b981",
						strokeWidth: 1,
						radius: 8,
						opacity: 100,
						fontColor: "#065f46",
						text: "Pipeline Revenue:\n$1,248,500 (+15%)",
						layerName: "AI Rev Text"
					}
				];
				setCanvasObjects((prev) => [...prev, ...genObjects]);
				setAiChats((prev) => [...prev, {
					sender: "AI Assistant",
					text: "I have generated an editable CRM dashboard layout wireframe with mock sales charts and metrics on the canvas.",
					code: `<div className="p-6 bg-slate-50 border border-slate-200 rounded-xl">\n  <h3 className="font-bold text-slate-800">CRM Overview Widget</h3>\n  <div className="mt-4 flex gap-4">\n    <div className="w-32 h-32 rounded-full border-2 border-sky-500 bg-sky-50 d-flex items-center justify-center">78% Win</div>\n    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">Pipeline Rev: $1.2M</div>\n  </div>\n</div>`
				}]);
			} else if (query.toLowerCase().includes("aws") || query.toLowerCase().includes("architecture")) {
				const genObjects = [
					{
						id: "ai_gen_4",
						type: "cloud",
						name: "AWS VPC Cloud",
						x: 250,
						y: 150,
						w: 450,
						h: 280,
						fill: "#faf5ff",
						stroke: "#8b5cf6",
						strokeWidth: 2,
						radius: 12,
						opacity: 100,
						fontColor: "#5b21b6",
						text: "AWS Production Cloud Network VPC",
						layerName: "AI AWS Cloud"
					},
					{
						id: "ai_gen_5",
						type: "rectangle",
						name: "EC2 Server",
						x: 300,
						y: 220,
						w: 120,
						h: 80,
						fill: "#fff7ed",
						stroke: "#ea580c",
						strokeWidth: 1,
						radius: 6,
						opacity: 100,
						fontColor: "#9a3412",
						text: "EC2 Web Instance",
						layerName: "AI EC2 Instance"
					},
					{
						id: "ai_gen_6",
						type: "rectangle",
						name: "RDS DB Instance",
						x: 500,
						y: 220,
						w: 120,
						h: 80,
						fill: "#eff6ff",
						stroke: "#3b82f6",
						strokeWidth: 1,
						radius: 6,
						opacity: 100,
						fontColor: "#1e3a8a",
						text: "RDS Postgres DB",
						layerName: "AI RDS Instance"
					}
				];
				setCanvasObjects((prev) => [...prev, ...genObjects]);
				setAiChats((prev) => [...prev, {
					sender: "AI Assistant",
					text: "Generated a standard AWS VPC Network Cloud layout carrying an EC2 application node and an RDS database node.",
					code: null
				}]);
			} else setAiChats((prev) => [...prev, {
				sender: "AI Assistant",
				text: `Generated standard process map shapes based on: "${query}"`,
				code: null
			}]);
			setAiStreaming(false);
			addHistory("AI Design Generation");
			triggerAutoSave();
		}, 2e3);
	};
	const generatedCodeInspector = (0, import_react.useMemo)(() => {
		if (selectedObjects.length === 0) return "Select elements on canvas to inspect code.";
		return selectedObjects.map((obj) => {
			if (obj.type === "rectangle") return `<div className="w-[${obj.w}px] h-[${obj.h}px] bg-[${obj.fill}] border border-[${obj.stroke}] rounded-[${obj.radius}px] opacity-${obj.opacity}">\n  ${obj.text}\n</div>`;
			if (obj.type === "circle") return `<div className="w-[${obj.w}px] h-[${obj.h}px] bg-[${obj.fill}] border border-[${obj.stroke}] rounded-full opacity-${obj.opacity}">\n  ${obj.text}\n</div>`;
			if (obj.type === "sticky") return `<div className="p-4 w-[${obj.w}px] h-[${obj.h}px] bg-[${obj.fill}] shadow-md border-t-4 border-[${obj.stroke}]">\n  <h5 className="font-bold">Assignee: ${obj.assignee || "None"}</h5>\n  <p>${obj.text}</p>\n</div>`;
			return `/* SVG vector layer: ${obj.name} */`;
		}).join("\n\n");
	}, [selectedObjects]);
	const handleExport = (format) => {
		const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(canvasObjects, null, 2));
		const dlAnchorElem = document.createElement("a");
		dlAnchorElem.setAttribute("href", dataStr);
		dlAnchorElem.setAttribute("download", `ManageCore_DesignWorkspace.${format}`);
		dlAnchorElem.click();
		addHistory(`Exported drawings as ${format}`);
	};
	const handleClearBoard = () => {
		pushUndoState();
		if (window.confirm("Are you sure you want to clear the entire drawing board? This will remove all elements, sticky notes, and lines.")) {
			setCanvasObjects([]);
			setFreehandPaths([]);
			setSelectedIds([]);
			addHistory("Cleared the drawing board");
			triggerAutoSave();
			addToast("Drawing board cleared successfully.", "success");
		}
	};
	const getCanvasCursor = () => {
		if (activeTool === "hand") return isPanning ? "grabbing" : "grab";
		if (activeTool === "pencil") return "crosshair";
		if (activeTool === "rectangle" || activeTool === "circle") return "crosshair";
		if (activeTool === "connector") return "cell";
		if (activeTool === "eraser") return "not-allowed";
		if (activeTool === "text") return "text";
		if (activeTool === "comment") return "help";
		return "default";
	};
	const [toasts, setToasts] = (0, import_react.useState)([]);
	const addToast = (msg, type = "success") => {
		const id = Date.now();
		setToasts((prev) => [...prev, {
			id,
			msg,
			type
		}]);
		setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id !== id));
		}, 3e3);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-fluid px-0 d-flex flex-column",
		style: {
			height: "calc(100vh - 170px)",
			minHeight: 0,
			overflowY: "auto",
			overflowX: "hidden"
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "position-fixed top-0 end-0 p-3",
				style: { zIndex: 1050 },
				children: toasts.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "toast show align-items-center text-white bg-success border-0 mb-2",
					role: "alert",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "toast-body small fw-medium",
							children: t.msg
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn-close btn-close-white me-2 m-auto",
							onClick: () => setToasts(toasts.filter((x) => x.id !== t.id))
						})]
					})
				}, t.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card border-0 shadow-sm rounded-4 p-3 mb-3 bg-white",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "d-flex justify-content-between align-items-center flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "d-flex gap-1.5 bg-light p-1 rounded-pill",
						children: [
							{
								id: "drawing",
								label: "Drawing Mode",
								icon: faPalette
							},
							{
								id: "whiteboard",
								label: "Whiteboard",
								icon: faCircle
							},
							{
								id: "flowchart",
								label: "Flowcharts",
								icon: faProjectDiagram
							},
							{
								id: "wireframe",
								label: "Wireframes",
								icon: faCrop
							},
							{
								id: "ui_ux",
								label: "UI/UX Mode",
								icon: faWindowMaximize
							},
							{
								id: "presentation",
								label: "Presentation",
								icon: faTv
							}
						].map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							className: `btn btn-xs rounded-pill px-3 py-1.5 transition-all text-nowrap ${activeWorkspaceMode === mode.id ? "btn-primary shadow-sm" : "btn-light border-0 text-dark"}`,
							onClick: () => {
								setActiveWorkspaceMode(mode.id);
								addHistory(`Switched to ${mode.label}`);
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: mode.icon,
									className: "me-1.5"
								}),
								" ",
								mode.label
							]
						}, mode.id))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "d-flex align-items-center gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-xs btn-light border",
								onClick: () => setSidebarOpen((prev) => !prev),
								title: sidebarOpen ? "Hide shape library" : "Show shape library",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faBars,
									className: "text-dark"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "btn btn-xs btn-light border",
								onClick: () => setInspectorOpen((prev) => !prev),
								title: inspectorOpen ? "Hide inspector panel" : "Show inspector panel",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faSliders,
									className: "text-dark"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex align-items-center gap-1 border-end pe-3 me-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-xs btn-light border",
									onClick: handleUndo,
									disabled: undoStack.length === 0,
									title: "Undo (Ctrl+Z)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faUndo,
										className: "text-dark"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "btn btn-xs btn-light border",
									onClick: handleRedo,
									disabled: redoStack.length === 0,
									title: "Redo (Ctrl+Y)",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
										icon: faRedo,
										className: "text-dark"
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "small text-muted font-monospace bg-light px-2.5 py-1 rounded border",
								children: ["Status: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-success fw-bold",
									children: saveStatus
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-xs btn-outline-secondary text-dark",
								onClick: () => handleExport("json"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faDownload,
									className: "me-1.5"
								}), " Export"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "btn btn-xs btn-outline-secondary text-dark",
								onClick: () => addToast("JSON drawing uploaded successfully."),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
									icon: faUpload,
									className: "me-1.5"
								}), " Import"]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "row g-3 flex-grow-1",
				style: { minHeight: 0 },
				children: [
					sidebarOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-2 col-lg-3 d-flex",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "card border-0 shadow-sm rounded-4 p-3 bg-white w-100 space-y-4",
							style: { minHeight: 0 },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "x-small fw-bold text-muted mb-1.5",
									children: "Search Components"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "position-relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "position-absolute text-muted",
										style: {
											left: 10,
											top: "50%",
											transform: "translateY(-50%)"
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faSearch,
											size: "xs"
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										className: "form-control form-control-sm border ps-4.5 rounded-pill",
										placeholder: "Search shapes..."
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "x-small fw-black text-uppercase text-muted tracking-wider",
										children: "Basic Vectors"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-2",
										style: {
											display: "grid",
											gridTemplateColumns: "repeat(2, 1fr)",
											gap: "8px"
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												className: "btn btn-sm btn-light border text-start py-2.5 rounded-3 d-flex flex-column align-items-center",
												onClick: () => createShapeFromLibrary("rectangle", "Rectangle Shape"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "border border-dark w-8 h-6 mb-1.5",
													style: {
														width: "32px",
														height: "24px"
													}
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "x-small text-dark-emphasis",
													style: { fontSize: "10px" },
													children: "Rectangle"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												className: "btn btn-sm btn-light border text-start py-2.5 rounded-3 d-flex flex-column align-items-center",
												onClick: () => createShapeFromLibrary("circle", "Circle Shape"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "border border-dark rounded-circle mb-1.5",
													style: {
														width: "24px",
														height: "24px"
													}
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "x-small text-dark-emphasis",
													style: { fontSize: "10px" },
													children: "Circle"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												className: "btn btn-sm btn-light border text-start py-2.5 rounded-3 d-flex flex-column align-items-center",
												onClick: () => createShapeFromLibrary("triangle", "Triangle Shape"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "border-bottom border-dark mb-1.5",
													style: {
														width: 0,
														height: 0,
														borderLeft: "12px solid transparent",
														borderRight: "12px solid transparent",
														borderBottom: "24px solid #334155"
													}
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "x-small text-dark-emphasis",
													style: { fontSize: "10px" },
													children: "Triangle"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												className: "btn btn-sm btn-light border text-start py-2.5 rounded-3 d-flex flex-column align-items-center",
												onClick: () => createShapeFromLibrary("sticky", "Sticky Note"),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "bg-warning bg-opacity-30 border border-warning w-8 h-8 mb-1.5",
													style: {
														width: "24px",
														height: "24px"
													}
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "x-small text-dark-emphasis",
													style: { fontSize: "10px" },
													children: "Sticky Note"
												})]
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "x-small fw-black text-uppercase text-muted tracking-wider",
										children: "Flowcharts & Diagrams"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-1.5",
										children: [
											{
												label: "Start / End Node",
												icon: faPlay,
												type: "circle"
											},
											{
												label: "Process Step",
												icon: faSliders,
												type: "rectangle"
											},
											{
												label: "Decision Node",
												icon: faSliders,
												type: "triangle"
											},
											{
												label: "Database Node",
												icon: faBorderAll,
												type: "cylinder"
											},
											{
												label: "AWS VPC Cloud",
												icon: faNetworkWired,
												type: "cloud"
											}
										].map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "btn btn-xs btn-light w-100 text-start border d-flex align-items-center gap-2 py-2",
											onClick: () => createShapeFromLibrary(item.type, item.label),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: item.icon,
												className: "text-muted"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												style: { fontSize: "11px" },
												children: item.label
											})]
										}, idx))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "x-small fw-black text-uppercase text-muted tracking-wider",
										children: "UI Wireframes"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-1.5",
										children: [
											{
												label: "Dashboard Widget",
												type: "rectangle"
											},
											{
												label: "Primary Button",
												type: "rectangle"
											},
											{
												label: "Form Input Box",
												type: "rectangle"
											},
											{
												label: "Navigation Bar",
												type: "rectangle"
											}
										].map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: "btn btn-xs btn-light w-100 text-start border py-2",
											onClick: () => createShapeFromLibrary(item.type, item.label),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												style: { fontSize: "11px" },
												children: item.label
											})
										}, idx))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 border-top pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "x-small fw-black text-uppercase text-muted tracking-wider",
										children: "Brand Palette Colors"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "d-flex gap-1.5 flex-wrap",
										children: brandColors.map((color) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-circle cursor-pointer",
											style: {
												width: "22px",
												height: "22px",
												backgroundColor: color,
												border: activeColor === color ? "2px solid #fff" : "1px solid rgba(255,255,255,0.4)",
												boxShadow: activeColor === color ? "0 0 0 2px #0f172a, 0 0 0 4px " + color : "none",
												cursor: "pointer"
											},
											onClick: () => {
												setActiveColor(color);
												if (primarySelected) {
													setCanvasObjects(canvasObjects.map((o) => o.id === primarySelected.id ? {
														...o,
														fill: color + "22",
														stroke: color
													} : o));
													triggerAutoSave();
												}
											},
											title: color
										}, color))
									})]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "col d-flex flex-column flex-grow-1",
						style: { minHeight: 0 },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "d-flex justify-content-between align-items-center mb-2 px-3 py-2 bg-dark rounded-4 shadow-sm text-white flex-wrap gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "d-flex align-items-center gap-1.5",
										children: [
											{
												id: "select",
												icon: faArrowPointer,
												title: "Select Tool"
											},
											{
												id: "hand",
												icon: faArrowsUpDownLeftRight,
												title: "Hand Pan Tool"
											},
											{
												id: "pencil",
												icon: faPencilAlt,
												title: "Pencil Tool"
											},
											{
												id: "rectangle",
												icon: faCrop,
												title: "Draw Rectangle"
											},
											{
												id: "circle",
												icon: faCircle,
												title: "Draw Circle"
											},
											{
												id: "connector",
												icon: faProjectDiagram,
												title: "Smart Connector"
											},
											{
												id: "fill",
												icon: faFillDrip,
												title: "Fill Paint Bucket"
											},
											{
												id: "text",
												icon: faTextHeight,
												title: "Text Editor"
											},
											{
												id: "eraser",
												icon: faEraser,
												title: "Eraser"
											},
											{
												id: "comment",
												icon: faPaperclip,
												title: "Pin Comment"
											}
										].map((tool) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											className: `btn btn-xs rounded-3 px-2.5 py-1.5 ${activeTool === tool.id ? "btn-primary" : "btn-dark text-white-50 hover-text-white"}`,
											onClick: () => setActiveTool(tool.id),
											title: tool.title,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: tool.icon })
										}, tool.id))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "x-small text-white-50",
												style: { fontSize: "10px" },
												children: "Canvas Pattern:"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												className: "form-select form-select-sm bg-secondary border-0 text-white py-0.5",
												style: {
													fontSize: "11px",
													width: "100px"
												},
												value: gridType,
												onChange: (e) => setGridType(e.target.value),
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "dots",
														children: "Dot Grid"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "lines",
														children: "Line Grid"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "blueprint",
														children: "Blueprint Grid"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "none",
														children: "Transparent"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "form-check form-check-inline mb-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													className: "form-check-input",
													type: "checkbox",
													id: "snapCheck",
													checked: snapToGrid,
													onChange: (e) => setSnapToGrid(e.target.checked)
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "form-check-label x-small text-white-50",
													style: { fontSize: "10px" },
													htmlFor: "snapCheck",
													children: "Snap"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex align-items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-xs btn-secondary",
												onClick: () => setZoom(Math.max(25, zoom - 25)),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearchMinus })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "x-small font-monospace",
												style: {
													minWidth: "40px",
													textAlign: "center",
													fontSize: "11px"
												},
												children: [zoom, "%"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-xs btn-secondary",
												onClick: () => setZoom(Math.min(500, zoom + 25)),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearchPlus })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-xs btn-secondary",
												onClick: () => {
													setZoom(100);
													setPanX(0);
													setPanY(0);
												},
												title: "Fit Screen",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCompress })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-xs btn-outline-danger ms-1.5",
												onClick: handleClearBoard,
												title: "Clear Board",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faTrash })
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border rounded-4 shadow-inner position-relative overflow-hidden bg-slate-900",
								style: {
									cursor: getCanvasCursor(),
									height: "60vh",
									minHeight: "420px",
									backgroundColor: gridType === "blueprint" ? "#0b132b" : "#0f172a",
									backgroundImage: gridType === "dots" ? "radial-gradient(#334155 1.5px, transparent 1.5px)" : gridType === "lines" ? "linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)" : gridType === "blueprint" ? "linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px)" : "none",
									backgroundSize: gridType === "dots" ? "20px 20px" : "40px 40px"
								},
								ref: canvasRef,
								onMouseDown: handleCanvasMouseDown,
								onMouseMove: handleCanvasMouseMove,
								onMouseUp: handleCanvasMouseUp,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "position-absolute top-0 start-0 w-100 bg-dark bg-opacity-20 text-white-50 px-2 d-flex justify-content-between pointer-events-none",
										style: {
											fontSize: "9px",
											height: "18px",
											zIndex: 5,
											borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "0px" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "200px" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "400px" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "600px" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "800px" })
										]
									}),
									smartGuides && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "position-absolute border-danger",
										style: {
											zIndex: 4,
											borderStyle: "dashed",
											...smartGuides.type === "vertical" ? {
												left: `${smartGuides.val * (zoom / 100) + panX}px`,
												top: 0,
												width: "1px",
												height: "100%",
												borderLeftWidth: "1.5px"
											} : {
												top: `${smartGuides.val * (zoom / 100) + panY}px`,
												left: 0,
												height: "1px",
												width: "100%",
												borderTopWidth: "1.5px"
											}
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
										className: "w-100 h-100 position-absolute top-0 start-0 pointer-events-none",
										style: {
											transform: `translate(${panX}px, ${panY}px) scale(${zoom / 100})`,
											transformOrigin: "top left"
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("marker", {
												id: "arrow",
												viewBox: "0 0 10 10",
												refX: "6",
												refY: "5",
												markerWidth: "6",
												markerHeight: "6",
												orient: "auto-start-reverse",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
													d: "M 0 0 L 10 5 L 0 10 z",
													fill: "#3b82f6"
												})
											}) }),
											canvasObjects.filter((obj) => obj.type === "connector").map((conn) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
												x1: conn.x,
												y1: conn.y,
												x2: conn.x2,
												y2: conn.y2,
												stroke: conn.stroke || "#3b82f6",
												strokeWidth: conn.strokeWidth || 3,
												markerEnd: conn.arrowEnd ? "url(#arrow)" : "none"
											}, conn.id)),
											drawingConnector && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
												x1: drawingConnector.x,
												y1: drawingConnector.y,
												x2: drawingConnector.x2,
												y2: drawingConnector.y2,
												stroke: drawingConnector.stroke,
												strokeWidth: drawingConnector.strokeWidth,
												strokeDasharray: "4 4",
												markerEnd: "url(#arrow)"
											}),
											freehandPaths.map((path) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
												d: `M ${path.points.map((p) => `${p.x} ${p.y}`).join(" L ")}`,
												fill: "none",
												stroke: path.color,
												strokeWidth: path.width,
												strokeLinecap: "round",
												strokeLinejoin: "round"
											}, path.id)),
											currentPath && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
												d: `M ${currentPath.points.map((p) => `${p.x} ${p.y}`).join(" L ")}`,
												fill: "none",
												stroke: currentPath.color,
												strokeWidth: currentPath.width,
												strokeLinecap: "round",
												strokeLinejoin: "round"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "w-100 h-100 position-absolute top-0 start-0",
										style: {
											transform: `translate(${panX}px, ${panY}px) scale(${zoom / 100})`,
											transformOrigin: "top left",
											pointerEvents: "none"
										},
										children: [canvasObjects.map((obj) => {
											if (obj.hidden || obj.type === "connector") return null;
											const isSelected = selectedIds.includes(obj.id);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: `position-absolute rounded transition-shadow ${isSelected ? "border border-2 border-primary shadow-lg" : ""}`,
												style: {
													left: `${obj.x}px`,
													top: `${obj.y}px`,
													width: `${obj.w}px`,
													height: `${obj.h}px`,
													backgroundColor: obj.fill,
													border: `${obj.strokeWidth}px solid ${obj.stroke}`,
													borderRadius: obj.type === "circle" ? "50%" : `${obj.radius || 0}px`,
													opacity: (obj.opacity || 100) / 100,
													color: obj.fontColor || "#1e293b",
													pointerEvents: "auto",
													cursor: isSelected ? "move" : "pointer"
												},
												onClick: (e) => {
													e.stopPropagation();
													if (activeTool === "select") if (e.shiftKey) setSelectedIds((prev) => prev.includes(obj.id) ? prev.filter((x) => x !== obj.id) : [...prev, obj.id]);
													else setSelectedIds([obj.id]);
												},
												onDoubleClick: (e) => {
													e.stopPropagation();
													if (obj.locked) return;
													const newVal = prompt("Edit text contents:", obj.text);
													if (newVal !== null) {
														setCanvasObjects(canvasObjects.map((o) => o.id === obj.id ? {
															...o,
															text: newVal
														} : o));
														addHistory("Updated shape text");
														triggerAutoSave();
														addToast("Text content updated successfully.");
													}
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "w-100 h-100 d-flex flex-column align-items-center justify-content-center p-3 text-center small fw-semibold overflow-hidden",
													style: { whiteSpace: "pre-line" },
													children: [obj.text, obj.type === "sticky" && obj.assignee && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "badge bg-dark bg-opacity-20 text-dark-emphasis mt-2",
														style: { fontSize: "10px" },
														children: ["Assignee: ", obj.assignee]
													})]
												}), obj.locked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "position-absolute top-1 end-1 badge bg-secondary",
													style: { fontSize: "8px" },
													children: "Locked"
												})]
											}, obj.id);
										}), activeTool === "pencil" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "position-absolute bottom-3 start-3 card border-0 shadow rounded-4 p-2 bg-dark text-white d-flex align-items-center gap-2 flex-row",
											style: {
												zIndex: 10,
												bottom: "15px",
												left: "15px"
											},
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "x-small text-white-50 ms-1",
													style: { fontSize: "10px" },
													children: "Pencil:"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "color",
													className: "form-control form-control-color border-0 p-0",
													style: {
														width: "22px",
														height: "22px",
														minWidth: "22px",
														cursor: "pointer"
													},
													value: pencilColor,
													onChange: (e) => setPencilColor(e.target.value),
													title: "Stroke Color"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													className: "form-select form-select-sm bg-secondary border-0 text-white py-0.5 px-1.5",
													style: {
														fontSize: "10px",
														width: "65px"
													},
													value: pencilWidth,
													onChange: (e) => setPencilWidth(parseInt(e.target.value)),
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "2",
															children: "2px Weight"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "4",
															children: "4px Weight"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "6",
															children: "6px Weight"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
															value: "8",
															children: "8px Weight"
														})
													]
												})
											]
										})]
									})
								]
							}),
							activeWorkspaceMode === "whiteboard" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "card border-0 shadow-sm rounded-4 p-3 bg-white mt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "x-small fw-bold text-muted d-block mb-2",
									children: "Sticky Task Kanban Workspace Columns"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "row g-2",
									children: [
										"Backlog",
										"To Do",
										"In Progress",
										"Review",
										"Completed"
									].map((col) => {
										const columnTasks = canvasObjects.filter((o) => o.type === "sticky" && (o.status || "To Do") === col);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "col",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bg-light p-2.5 rounded-3 h-100",
												style: { minHeight: "120px" },
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex justify-content-between align-items-center mb-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "x-small fw-bold text-dark",
														children: col
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "badge bg-secondary rounded-pill",
														style: { fontSize: "9px" },
														children: columnTasks.length
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "space-y-1.5",
													children: columnTasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "p-2 bg-white rounded border shadow-sm small text-dark",
														style: { borderLeft: "3px solid #facc15" },
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "fw-semibold text-truncate",
															children: t.text
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "text-muted x-small mt-1 d-flex justify-content-between",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t.assignee }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
																className: "text-danger",
																children: t.priority
															})]
														})]
													}, t.id))
												})]
											})
										}, col);
									})
								})]
							})
						]
					}),
					inspectorOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-xl-3 col-lg-3 d-flex",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "w-100 space-y-3",
							style: { paddingRight: "2px" },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "card border-0 shadow-sm rounded-4 mb-3 p-3 bg-white",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
										className: "fw-bold text-dark border-bottom pb-2 mb-3",
										children: "Object Inspector"
									}), primarySelected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "row g-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "col-6",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
															className: "x-small text-muted mb-1",
															children: "Position X"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "number",
															className: "form-control form-control-sm font-monospace",
															value: primarySelected.x,
															onChange: (e) => {
																setCanvasObjects(canvasObjects.map((o) => o.id === primarySelected.id ? {
																	...o,
																	x: parseInt(e.target.value) || 0
																} : o));
															}
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "col-6",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
															className: "x-small text-muted mb-1",
															children: "Position Y"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "number",
															className: "form-control form-control-sm font-monospace",
															value: primarySelected.y,
															onChange: (e) => {
																setCanvasObjects(canvasObjects.map((o) => o.id === primarySelected.id ? {
																	...o,
																	y: parseInt(e.target.value) || 0
																} : o));
															}
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "col-6 mt-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
															className: "x-small text-muted mb-1",
															children: "Width"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "number",
															className: "form-control form-control-sm font-monospace",
															value: primarySelected.w,
															onChange: (e) => {
																setCanvasObjects(canvasObjects.map((o) => o.id === primarySelected.id ? {
																	...o,
																	w: parseInt(e.target.value) || 0
																} : o));
															}
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "col-6 mt-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
															className: "x-small text-muted mb-1",
															children: "Height"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															type: "number",
															className: "form-control form-control-sm font-monospace",
															value: primarySelected.h,
															onChange: (e) => {
																setCanvasObjects(canvasObjects.map((o) => o.id === primarySelected.id ? {
																	...o,
																	h: parseInt(e.target.value) || 0
																} : o));
															}
														})]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "x-small text-muted mb-1",
													children: "Fill Paint Color"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "d-flex gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "color",
														className: "form-control form-control-color border-0 p-0",
														style: {
															width: "40px",
															height: "30px"
														},
														value: primarySelected.fill.startsWith("#") ? primarySelected.fill.substring(0, 7) : "#3b82f6",
														onChange: (e) => {
															setCanvasObjects(canvasObjects.map((o) => o.id === primarySelected.id ? {
																...o,
																fill: e.target.value
															} : o));
														}
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "text",
														className: "form-control form-control-sm font-monospace text-uppercase",
														value: primarySelected.fill,
														onChange: (e) => {
															setCanvasObjects(canvasObjects.map((o) => o.id === primarySelected.id ? {
																...o,
																fill: e.target.value
															} : o));
														}
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "x-small text-muted mb-1",
													children: "Label Text"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
													className: "form-control form-control-sm small",
													rows: 2,
													value: primarySelected.text,
													onChange: (e) => {
														setCanvasObjects(canvasObjects.map((o) => o.id === primarySelected.id ? {
															...o,
															text: e.target.value
														} : o));
													}
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex gap-2 mt-3 pt-2 border-top",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													className: "btn btn-xs btn-outline-secondary w-100",
													onClick: () => {
														setCanvasObjects(canvasObjects.map((o) => o.id === primarySelected.id ? {
															...o,
															locked: !o.locked
														} : o));
														triggerAutoSave();
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: primarySelected.locked ? faLock : faLockOpen,
														className: "me-1"
													}), primarySelected.locked ? "Unlock" : "Lock"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													className: "btn btn-xs btn-outline-danger w-100",
													onClick: () => {
														setCanvasObjects(canvasObjects.filter((o) => o.id !== primarySelected.id));
														setSelectedIds([]);
														addHistory("Deleted object");
														triggerAutoSave();
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: faTrashAlt,
														className: "me-1"
													}), "Delete"]
												})]
											})
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-center py-4 text-muted x-small",
										children: "Select a canvas shape to view vector properties."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "card border-0 shadow-sm rounded-4 p-3 mb-3 bg-white",
									style: {
										maxHeight: "200px",
										overflowY: "auto"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "d-flex justify-content-between align-items-center border-bottom pb-2 mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h6", {
											className: "fw-bold text-dark mb-0",
											children: "Layers Panel"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "badge bg-secondary rounded-pill",
											style: { fontSize: "9px" },
											children: canvasObjects.length
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-1",
										children: canvasObjects.map((obj) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `d-flex align-items-center justify-content-between p-1 rounded hover-bg-light cursor-pointer ${selectedIds.includes(obj.id) ? "bg-primary bg-opacity-10 text-primary" : "small text-dark"}`,
											onClick: () => setSelectedIds([obj.id]),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "d-flex align-items-center gap-1.5 min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
													icon: obj.type === "circle" ? faCircle : obj.type === "cloud" ? faNetworkWired : faCrop,
													size: "xs",
													className: "opacity-60"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "x-small text-truncate",
													style: { fontSize: "11px" },
													children: obj.layerName || obj.name
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "d-flex gap-1.5",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													className: "btn btn-link btn-xs p-0 text-muted",
													onClick: (e) => {
														e.stopPropagation();
														setCanvasObjects(canvasObjects.map((o) => o.id === obj.id ? {
															...o,
															hidden: !o.hidden
														} : o));
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
														icon: obj.hidden ? faTrash : faEye,
														style: { fontSize: "9px" }
													})
												})
											})]
										}, obj.id))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "card border-0 shadow-sm rounded-4 p-3 bg-white",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
											className: "fw-bold text-dark border-bottom pb-2 mb-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faRobot,
												className: "text-primary me-1.5"
											}), " AI Design Assistant"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bg-light p-2.5 rounded-3 mb-2",
											style: {
												maxHeight: "180px",
												overflowY: "auto"
											},
											children: [aiChats.map((msg, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mb-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "x-small fw-bold text-dark-emphasis mb-0.5",
														children: [msg.sender, ":"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "x-small text-muted-foreground",
														style: {
															fontSize: "11px",
															lineHeight: "1.5"
														},
														children: msg.text
													}),
													msg.code && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
														className: "p-1.5 bg-dark text-success rounded font-monospace mt-1.5 x-small overflow-x-auto",
														style: { fontSize: "9px" },
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: msg.code })
													})
												]
											}, idx)), aiStreaming && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "x-small text-primary animate-pulse",
												children: "Generating design layout..."
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "input-group input-group-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												className: "form-control form-control-sm border",
												placeholder: "Ask AI to build a dashboard...",
												value: aiInput,
												onChange: (e) => setAiInput(e.target.value),
												onKeyDown: (e) => e.key === "Enter" && executeAiCommand()
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												className: "btn btn-sm btn-primary",
												onClick: executeAiCommand,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPaperPlane })
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "card border-0 shadow-sm rounded-4 p-3 bg-white",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h6", {
											className: "fw-bold text-dark border-bottom pb-2 mb-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
												icon: faCode,
												className: "text-primary me-1.5"
											}), " Code Handoff"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "x-small text-muted d-block mb-1.5",
											children: "React Tailwind JSX:"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
											className: "p-2 bg-dark text-success rounded font-monospace mb-0 overflow-x-auto",
											style: {
												maxHeight: "120px",
												fontSize: "10px"
											},
											children: generatedCodeInspector
										})
									]
								})
							]
						})
					})
				]
			})
		]
	});
};
//#endregion
export { DrawingWorkspace as default };
