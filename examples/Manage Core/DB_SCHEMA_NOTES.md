# Database Schema Notes — Manage Core

## Engine
MySQL

## Architecture
Multi-Tenant (Database per Tenant)

## Core Tables

| Table | Purpose |
|-------|---------|
| users | User accounts & employee base |
| roles | Role definitions |
| permissions | Permission definitions |
| departments | Organizational departments |
| designations | Job designations |
| employees | Extended employee profiles |
| employee_documents | Employee document storage |
| employee_assets | Asset assignments |
| attendance | Daily attendance records |
| attendance_logs | Raw punch logs |
| leave_requests | Leave applications |
| leave_balances | Leave accrual tracking |
| payrolls | Payroll runs |
| salary_components | Salary structure definitions |
| loans | Employee loans |
| loan_installments | Loan repayment tracking |
| expenses | Expense claims |
| projects | Project records |
| tasks | Task records |
| milestones | Project milestones |
| notifications | System notifications |
| audit_logs | Audit trail |

## Mandatory Columns

| Column | Purpose |
|--------|---------|
| `id` | Primary key |
| `tenant_id` | Tenant isolation |
| `created_by` | Creator reference |
| `updated_by` | Last updater |
| `created_at` | Creation timestamp |
| `updated_at` | Update timestamp |
| `deleted_at` | Soft delete support |

## Required Indexes

| Column | Reason |
|--------|--------|
| `tenant_id` | Multi-tenant queries |
| `employee_code` | Employee lookups |
| `email` | Authentication |
| `project_id` | Project queries |
| `task_id` | Task queries |
| `attendance_date` | Date-range queries |
| `leave_date` | Leave calendar queries |
| `payroll_month` | Payroll period queries |
| `loan_status` | Loan workflow queries |
| `expense_status` | Expense workflow queries |

## Audit Requirements

Track the following events:
- Create
- Update
- Delete
- Approval
- Rejection
- Login
- Logout
- Export
- Import
