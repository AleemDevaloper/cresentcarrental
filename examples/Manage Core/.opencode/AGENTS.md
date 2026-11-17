# AGENTS.md

## Refactoring ERP Pages — Progress Log

### Goal
Refactor 12 ERP page files to use shared UI components (ErpPageShell, ErpKpiCard, ErpDataTable, erpCss/erpColors).

### Done
- ErpPosInvoicesReceipts.jsx — ErpPageShell wrapper, ErpDataTable for invoice listing, kept detail side panel
- ErpPurchaseReturns.jsx — ErpPageShell, ErpKpiCards, ErpDataTable with pagination/filtering, kept add modal form
- ErpQuotations.jsx — ErpPageShell, ErpKpiCards, ErpDataTable, kept DeleteConfirmDialog and inline action buttons
- ErpInventoryValuation.jsx — ErpPageShell, ErpKpiCards, ErpDataTable for costing ledger, kept sub-tab structure
- ErpProductCategories.jsx — ErpPageShell, ErpKpiCards, kept hierarchical tree table, kept add modal
- ErpPosSalesScreen.jsx — Kept custom POS layout; replaced `<style>` with `erpCss(isDark)`, removed duplicated variables
- ErpOpeningBalances.jsx — ErpPageShell, ErpKpiCards, ErpDataTable for GL/Customer tables, kept validation banner, tabs, DeleteConfirmDialog
- ErpJournalEntries.jsx — ErpPageShell, ErpDataTable for directory, kept dashboard sub-tab, detail drawer, add modal
- ErpPurchaseRequisitions.jsx — ErpPageShell, ErpKpiCards, ErpDataTable, kept budget/utilization cards, detail modal, add modal
- ErpPurchaseOrders.jsx — ErpPageShell, ErpKpiCards, ErpDataTable, kept sub-tabs (matching/logs), detail modal, add modal
- ErpProducts.jsx — ErpPageShell, ErpKpiCards, ErpDataTable for directory, kept card/kanban views, dashboard/analytics/reports tabs, slide-over detail panel, add modal

### Skipped (No refactoring needed)
- ErpPayrollHrIntegration.jsx — Uses custom design system (hero banner, pill tabs, `renderStyles()` CSS, Bootstrap tables). No duplicated variables or inline `<style>` blocks to replace. Tables use Bootstrap classes, not the premium-table pattern.

### Key Pattern
- Import: `import ErpPageShell from '../../../../components/ui/ux/ErpPageShell'` (and similar for ErpKpiCard, ErpDataTable)
- Remove: containerBg, cardBg, borderColor, inputBg
- Keep: textColor, mutedColor (unique per file)
- Replace outer `<div>` with `<ErpPageShell>` wrapper
- Replace `<style>` block — ErpPageShell already includes `erpCss(isDark)`
- Replace KPI sections with `<ErpKpiCard>` inside `<div className="row g-3 mb-4">`
- Replace tables with `<ErpDataTable>` using columns config with render functions for custom cells
- Keep all business logic, modals, drawers, event handlers, custom sub-tab content
