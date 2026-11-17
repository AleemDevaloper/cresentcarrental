# HRMS Implementation Plan — Manage Core

**Objective:** Build a world-class enterprise HRMS comparable to Workday / SAP SuccessFactors.

## Core Modules

### 1. Workforce & Employee Management
- **Enhancement:** Emergency Contacts, Bank Details, Document Management (expiry alerts)
- **Hierarchy:** Manager → Employee reporting chain for approvals
- **Import/Export:** CSV/Excel bulk employee operations

### 2. Payroll Engine (Advanced)
- **Salary Structures:** Multi-component (Earnings, Deductions, Statutory)
- **Automated Deductions:** Attendance-based (LWP), Loan EMIs, Tax slabs
- **Compliance:** EOBI, Social Security, Provident Fund
- **Process:** Run Payroll → Approval → Lock → Finalize → Payslip

### 3. Performance & Talent Management (LMS)
- **Performance:** Goals, KPIs, OKRs, Periodic Reviews, Ratings
- **LMS:** Course management, Training assignments, Skill tracking

### 4. Lifecycle & Exit Management
- **Onboarding:** Checklist-based joining flow, Asset allocation
- **Exit:** Resignation → Notice tracking → Clearance (IT, Admin, Finance) → Final Settlement

### 5. Attendance & Biometric
- **Biometric:** ZKTeco integration (raw punch logs, device sync)
- **Overtime:** Auto-detection from shifts + manual requests
- **Geofencing:** Site-wise reporting

### 6. Expense & Reimbursement
- **Claims:** Travel, Fuel, Medical
- **Workflow:** Receipt upload → Manager Approval → Finance → Payroll Integration

## Implementation Phases

### Phase 1: Backend Foundation
- [x] Create `HrmsGoal`, `HrmsReview`, `HrmsKpi` models
- [x] Create `HrmsCourse`, `HrmsCertification` models
- [x] Define `Expense` model with categories
- [x] Create `OnboardingChecklist` model
- [x] Create `BiometricDevice`, `BiometricPunchLog` models

### Phase 2: API Development
- [x] PerformanceController: CRUD for goals and reviews
- [x] ExpenseController: Claims and approvals
- [x] Enhanced PayrollController: Complex calculations, statutory rules
- [x] OnboardingController: Checklists and status
- [x] DashboardController: Aggregated HR/Manager stats

### Phase 3: Frontend Development
- [x] HR Dashboard: Replace mock data in HrmsOverview.jsx
- [x] Payroll Setup: Salary Structure builder and assignment UI
- [x] Performance Portal: Goals and reviews pages
- [x] Expense Portal: Submit/approve claims UI
- [x] Recruitment Polish: Job posting and candidate management UI

### Phase 4: Integration & Testing
- [ ] Integrate Expenses and Loans with Payroll
- [ ] Test approval workflows for all modules
- [ ] Mobile responsiveness audit and PWA optimizations

## Progress

### Completed: Phase 1–3
- ✅ **Automated Onboarding & Lifecycle:** Departmental checklists, progress tracking, onboarding kit
- ✅ **Enterprise Exit Management:** Resignation workflow, 5-stage clearance, real-time status
- ✅ **Unified HRMS Dashboard:** Real-time new hire / resignation counters, goal progress

### Current Focus: Phase 4
- 🔄 Expense Claims: Multi-category with receipt upload
- 🔄 Overtime: Auto-detection + manual requests
- 🔄 Financial Integration: Auto-posting to Payroll

## Verification & Testing
- Unit tests for Payroll calculations
- Integration tests for Approval workflows (Manager → HR → Finance)
- UI/UX validation for Admin, Manager, Employee portals
