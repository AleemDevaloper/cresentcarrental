# ManageCore Frontend

ERP/CRM dashboard application powering the ManageCore platform with React, Vite, and a modular component-based UI for HR, finance, security, and systems administration workflows.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19.2 |
| Build tool | Vite 8 |
| Routing | react-router-dom 7.13 |
| Styling | SCSS/Sass + Bootstrap 5.3.8 |
| Icons | Font Awesome 7 + react-icons 5.6 |
| Tables | @tanstack/react-table 8 |
| Charts | Chart.js 4.5 + react-chartjs-2 |
| Animation | framer-motion 12 |
| Flow diagrams | reactflow 11 |
| Markdown | react-markdown 10 |
| Excel export | exceljs + xlsx |
| Word export | docx + docx-preview |
| QR codes | qrcode.react 4 |
| Testing | Playwright |
| Linting | ESLint 10 |

## Quick start

```bash
cd manage-core-frontend
npm install
npm run dev        # http://localhost:8061 (proxied to backend on 8080)
npm run build      # outputs to ../manage-core-backend/public/app/
npm run lint
```

## Project structure

```
src/
├── components/
│   ├── common/          # Shared UI components
│   │   ├── AI/          # AI module components
│   │   ├── AMS/         # Accounting Management System
│   │   ├── CRM/         # CRM module tabs & components
│   │   ├── DMS/         # Document Management
│   │   ├── HRMS/        # Human Resource Management
│   │   ├── INV/         # Inventory Management
│   │   ├── POS/         # Point of Sale
│   │   ├── FMS/         # Financial Management
│   │   └── UI/          # Generic UI components
│   ├── crm/             # CRM-specific UI components
│   ├── dashboard/       # Dashboard widgets
│   ├── layout/          # App shell (Sidebar, Topbar, AuthenticatedLayout)
│   └── ui/ux/           # Design system (ErpTheme, DataTable, KpiCard)
├── pages/
│   ├── systems/         # Module pages (AI, CRM, FMS, HRMS, POS, etc.)
│   ├── CommandCenter/   # Command center widgets
│   ├── dashboards/      # Role-based dashboards
│   ├── auth/            # Login
│   ├── settings/        # App settings
│   └── superadmin/      # Super admin pages
├── api/                 # API client modules
├── context/             # Global state providers
├── styles/              # SCSS + CSS design system
│   ├── main.scss        # Entry SCSS file
│   ├── _theme.scss      # Theme tokens
│   ├── _global.scss     # Global styles (2,700+ lines)
│   └── mobile-responsive.scss
└── public/              # Static assets
```

## Module architecture

The app is organized around independent enterprise modules:

| Module | Purpose |
|--------|---------|
| **CRM** | Customer relationship management, leads, deals, pipelines |
| **HRMS** | Human resource management, attendance, leave, payroll |
| **FMS** | Financial management, invoicing, accounting, reports |
| **INV** | Inventory management, stock, warehouses, batches |
| **POS** | Point of sale, terminals, sessions, receipts |
| **AMS** | Asset management, fixed assets, depreciation |
| **PMS** | Project management, tasks, milestones |
| **TMS** | Task management, workflows |
| **DMS** | Document management, file storage |
| **MFG** | Manufacturing, work orders |
| **FX** | Foreign exchange, currency management |
| **EMS** | Education management |
| **AI** | AI workspace, copilots, automations |

## Key architecture decisions

### INV and POS boundaries
INV and POS are independent application areas. INV owns inventory and warehouse behavior; POS owns its sellable catalog, checkout, payments, registers, cash, returns, and receipts. Optional synchronization uses integration events and must never become a runtime dependency.

### ERP design system
All module pages use the shared ERP design system (`ErpTheme.js`) for consistent theming across light/dark modes. The theme engine provides:
- Color tokens (primary, success, danger, warning, info, purple)
- Component style generators (cards, tables, badges, inputs, buttons)
- Dynamic light/dark theme objects

### Module content routing
`ModuleContentRenderer.jsx` dispatches to module pages based on route parameters. Each module registers its pages in `pageRegistry.js` and features in `featureRegistry.js`.

## Recent changes

- Website CSS (`manage-core-website-react/src/styles/site.css`) updated: orbit node spacing, capabilities section ring alignment, case studies card styling, CTA button shape changes to match Digitalotters reference.

## Build output

Production build outputs to `../manage-core-backend/public/app/` for Laravel serving.
