import "./rolldown-runtime-Bq5D3eIA.js";
import { Dl as require_jsx_runtime, bl as useApp, d as useTranslation, ru as require_react } from "./ai-BHgPkVLC.js";
import { M as Common, O as TopNavBar, T as ModuleContentRenderer } from "./superadmin-Cn5Mt1aQ.js";
import { t as FrontTabFlyover } from "./FrontTabFlyover-BVfJzOXR.js";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var ManagerDashboard = () => {
	const { currentUser, activeModule, themeStyle, navbarBehavior, contentLayout, isSidebarOpen, setIsSidebarOpen, frontFlyoverStack, popFrontFlyover } = useApp();
	const { t } = useTranslation();
	const navbarClass = navbarBehavior === "hidden" ? "d-none" : "";
	const containerClass = contentLayout === "compact" ? "container" : "container-fluid";
	const themeClass = themeStyle === "glassmorphism" ? "glass-theme" : "";
	const getHeading = () => {
		const role = currentUser?.role || "Manager";
		if (activeModule === "pms") return `${t("project_mgmt")} ${t("workspace")}`;
		if (activeModule === "hrms") return `${t("human_resource")} ${t("workspace")}`;
		if (activeModule === "fms") return `${t("finance_mgmt")} ${t("workspace")}`;
		if (activeModule === "tms") return `${t("task_management")} ${t("workspace")}`;
		return `${role} ${t("dashboard")}`;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `container-fluid vh-100 px-0 overflow-hidden ${themeClass}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "d-flex h-100",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Common, {
				isSidebarOpen,
				setIsSidebarOpen
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-grow-1 d-flex flex-column min-w-0",
				style: { backgroundColor: "var(--background)" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: navbarClass,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopNavBar, {
						heading: getHeading(),
						isSidebarOpen,
						onToggleSidebar: () => setIsSidebarOpen((prev) => !prev)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `dashboard-content-shell fade-in p-3 p-lg-4 flex-grow-1 overflow-y-auto ${containerClass}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleContentRenderer, {})
				})]
			})]
		}), frontFlyoverStack?.map((f, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FrontTabFlyover, {
			isOpen: true,
			onClose: popFrontFlyover,
			title: f.title,
			index: idx,
			anchorRect: f.anchorRect,
			width: f.width,
			hoverOpen: !!f.hover,
			children: f.content
		}, `front-flyover-${idx}`))]
	});
};
//#endregion
export { ManagerDashboard as default };
