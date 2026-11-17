This folder contains EMS-scoped SCSS partials: _ems-layout.scss, _ems-navbar.scss, _ems-sidebar.scss, _ems-cards.scss and an entry ems.scss.

All classes are prefixed or scoped under .ems-root to avoid impacting other modules.

Guidance:
- Use .ems-root on EMS pages' top-level containers (e.g., in EmsDashboard.jsx wrap content in <div className="ems-root">).
- Keep selectors specific to EMS to avoid global cascade changes.

For AMS/FMS dashboard work, use the ERP dashboard styles in
`src/pages/systems/FMS/ERP/ErpDashboard.jsx` instead of adding global selectors. Executive
summary cards should keep their headings, descriptions, and icons white in light and dark modes.

Recent shared work also includes responsive dashboard spacing, explicit Users/Roles authentication,
MySQL tenant-database alignment, legacy role synchronization, schema-safe permission loading, and
larger role-card icons including phone, mail, and chat variants.
