# ManageCore CRM — Enterprise Customer Relationship Management

> **Status:** Production CRM module integrated into ManageCore.
> **Scope:** Full-stack (Laravel 12 backend + React 19 frontend) CRM covering Leads,
> Contacts, Companies, Deals, Pipelines, Email, Follow-Ups, Sequences, Automation,
> Campaigns, Calendar, Reports, Analytics, Import/Export, Audit, Notifications,
> Custom Fields, Tags, Documents, Lead Scoring, and Duplicate Management.
>
> **Last review:** 2026-08-31
> **Coverage:** Backend models, services, controllers, jobs, migrations, REST API
> and frontend reusable component library, list pages, detail flyovers, dashboards,
> kanban, composer, automation builder are wired to live data.

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          React 19 Frontend                      │
│  (Bootstrap 5, Chart.js, Reusable UI Library, ERP Shell)       │
└──────────────────────────────┬──────────────────────────────────┘
                               │ REST (Laravel Sanctum)
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Laravel 12 API Backend                      │
│  Controllers · Services · Repositories · Policies               │
│  FormRequests · Resources · Events · Listeners · Jobs · Queues  │
└────────────────┬──────────────────────┬─────────────────────────┘
                 │                      │
                 ▼                      ▼
   ┌──────────────────────┐  ┌──────────────────────┐
   │   MySQL Tenant DB    │  │  Redis-Backed Queue  │
   │  (CRM transactional) │  │  (jobs & scheduler)  │
   └──────────────────────┘  └──────────────────────┘
                                       │
                                       ▼
                       ┌──────────────────────────────┐
                       │   Python Intelligence (API)  │
                       │ Lead scoring, sentiment,     │
                       │ dedup, recommendations       │
                       └──────────────────────────────┘
```

---

## 2. Backend Modules

### 2.1 Models (Eloquent ORM)

| Model | Table | Purpose |
|-------|-------|---------|
| `CrmLead` | `crm_leads` | Lead management with scoring |
| `CrmCustomer` | `crm_customers` | Companies/Accounts |
| `CrmContact` | `crm_contacts` | People at companies |
| `CrmDeal` | `crm_deals` | Opportunities |
| `CrmPipeline` | `crm_pipelines` | Sales pipelines |
| `CrmPipelineStage` | `crm_pipeline_stages` | Pipeline stages |
| `CrmActivity` | `crm_activities` | Tasks, calls, meetings, etc |
| `CrmTask` | `crm_tasks` | Recurring tasks |
| `CrmNote` | `crm_notes` | Rich notes |
| `CrmCampaign` | `crm_campaigns` | Marketing campaigns |
| `CrmEmailAccount` | `crm_email_accounts` | Connected email accounts |
| `CrmEmailThread` | `crm_email_threads` | Email conversations |
| `CrmEmail` | `crm_emails` | Individual email messages |
| `CrmEmailAttachment` | `crm_email_attachments` | Email files |
| `CrmEmailEvent` | `crm_email_events` | Open/click/reply tracking |
| `CrmEmailTemplate` | `crm_email_templates` | Reusable email templates |
| `CrmEmailSignature` | `crm_email_signatures` | Email signatures |
| `CrmFollowUp` | `crm_followups` | Scheduled follow-ups |
| `CrmSequence` | `crm_sequences` | Multi-step sequences |
| `CrmSequenceStep` | `crm_sequence_steps` | Sequence steps |
| `CrmSequenceEnrollment` | `crm_sequence_enrollments` | Active enrollments |
| `CrmAutomation` | `crm_automations` | Automation rules |
| `CrmAutomationTrigger` | `crm_automation_triggers` | Triggers |
| `CrmAutomationCondition` | `crm_automation_conditions` | Conditions |
| `CrmAutomationAction` | `crm_automation_actions` | Actions |
| `CrmAutomationRun` | `crm_automation_runs` | Execution logs |
| `CrmTag` | `crm_tags` | Centralized tags |
| `CrmTaggable` | `crm_taggables` | Polymorphic tag relations |
| `CrmCustomField` | `crm_custom_fields` | Admin-defined fields |
| `CrmCustomFieldValue` | `crm_custom_field_values` | Stored values |
| `CrmDocument` | `crm_documents` | File attachments |
| `CrmAuditLog` | `crm_audit_logs` | Audit trail |
| `CrmNotification` | `crm_notifications` | CRM notifications |
| `CrmImportJob` | `crm_import_jobs` | Import runs |
| `CrmImportRow` | `crm_import_rows` | Per-row results |
| `CrmExportJob` | `crm_export_jobs` | Export runs |
| `CrmDuplicateGroup` | `crm_duplicate_groups` | Duplicate clusters |
| `CrmLeadScoreRule` | `crm_lead_score_rules` | Scoring rules |

### 2.2 Service Layer

All business logic is encapsulated in services:
- `Crm\LeadService` — lead create/update/score/convert
- `Crm\DealService` — deal stage transitions, won/lost
- `Crm\PipelineService` — pipeline/stage orchestration
- `Crm\ActivityService` — activity logging and completion
- `Crm\EmailService` — email provider abstraction
- `Crm\FollowUpService` — follow-up lifecycle
- `Crm\SequenceService` — sequence enrollment & stepping
- `Crm\AutomationService` — rule evaluation & execution
- `Crm\LeadScoreService` — scoring engine
- `Crm\DuplicateService` — duplicate detection
- `Crm\ImportService` — CSV import pipeline
- `Crm\ExportService` — CSV/PDF export pipeline
- `Crm\AuditService` — audit logging
- `Crm\NotificationService` — CRM notification dispatch

### 2.3 Email Provider Abstraction

```php
interface EmailProviderInterface {
    public function connect(array $credentials): array; // returns tokens
    public function refreshToken(EmailAccount $account): string;
    public function fetchMessages(EmailAccount $account, $cursor = null): array;
    public function sendMessage(EmailAccount $account, MimeMessage $msg): array;
    public function fetchThread(EmailAccount $account, $threadId): array;
    public function registerWebhook(EmailAccount $account, $url): array;
}
```

Adapters implemented:
- `GmailProvider` (OAuth 2.0 + Gmail API)
- `MicrosoftProvider` (OAuth 2.0 + Graph API)
- `SmtpProvider` (SMTP send, IMAP fetch)
- `ImapProvider` (IMAP read/sync)

### 2.4 Lead Conversion

`CrmController::convertLead` upgrades a lead to a customer in a single
transactional call, returning the resulting customer, contact and deal IDs:

```json
POST /api/v1/crm/leads/{id}/convert
{
  "create_company": true,
  "create_contact": true,
  "create_deal":   true,
  "company_id":    12,           // optional: reuse existing company
  "contact_id":    45,           // optional: reuse existing contact
  "deal_name":     "Acme - 12 month plan",
  "deal_amount":   24000,
  "deal_pipeline_id": 3,
  "deal_expected_close_date": "2026-12-31"
}
```

Response:

```json
{
  "success": true,
  "data":    { /* lead */ },
  "conversion": {
    "lead_id":     7,
    "customer_id": 12,
    "contact_id":  45,
    "deal_id":     88
  }
}
```

Rules:

- If `create_company` is true and the lead's email or company already
  exists in `crm_customers`, that record is reused (no duplicates).
- If `create_contact` is true, the contact is matched by email and
  otherwise created with `first_name` / `last_name` derived from the
  lead name.
- If `create_deal` is true, the deal is created against the chosen or
  default pipeline, the first stage is auto-selected and the matching
  stage probability is applied.
- The lead is marked `converted` with `converted_at = now()` and a
  completed `task` activity (`subject = "Lead converted"`) is recorded
  so the activity timeline reflects the conversion immediately.

### 2.5 Queue Jobs (Redis)

- `SendEmailJob` — send a queued email
- `SyncEmailAccountJob` — full/incremental mailbox sync
- `ProcessEmailWebhookJob` — process provider webhook
- `ProcessFollowUpJob` — execute due follow-up
- `AdvanceSequenceJob` — move enrollment to next step
- `RunAutomationJob` — execute automation actions
- `ProcessImportJob` — bulk import rows
- `ProcessExportJob` — bulk export
- `DetectDuplicatesJob` — async dedup scan
- `RecalculateLeadScoreJob` — score refresh

### 2.6 Events & Listeners

| Event | Listener |
|-------|----------|
| `LeadCreated` | `TriggerAutomationsOnLeadCreated`, `NotifyAssignedUser`, `CalculateLeadScore` |
| `LeadStatusChanged` | `TriggerAutomationsOnStatusChange`, `RecalculateLeadScore` |
| `LeadConverted` | `TriggerAutomationsOnLeadConverted`, `NotifyOwner` |
| `DealStageChanged` | `TriggerAutomationsOnDealStage`, `CreateStageHistory`, `Notify` |
| `DealWon` / `DealLost` | `StopSequences`, `Notify`, `TriggerAutomations` |
| `EmailReplied` | `StopSequences`, `CreateActivity`, `TriggerAutomations` |
| `EmailBounced` | `StopSequences`, `MarkContactBounced`, `Notify` |
| `FollowUpCompleted` | `AdvanceSequence`, `TriggerAutomations` |
| `FollowUpDue` | `NotifyAssignee` |
| `SequenceStepDue` | `ExecuteSequenceStep` |

### 2.7 Permissions

Created under `crm.*` namespace and enforced server-side via Policies:

```
crm.view  crm.create  crm.edit  crm.delete  crm.export  crm.import
lead.view  lead.create  lead.edit  lead.delete  lead.assign  lead.convert
contact.view  contact.create  contact.edit  contact.delete
deal.view  deal.create  deal.edit  deal.delete  deal.move_stage  deal.mark_won  deal.mark_lost
email.view  email.send  email.delete  email.account.manage  email.template.manage
followup.view  followup.create  followup.edit  followup.complete  followup.assign
automation.view  automation.create  automation.edit  automation.execute
sequence.view  sequence.create  sequence.edit  sequence.execute
campaign.view  campaign.create  campaign.execute
report.view  report.export
settings.manage
```

---

## 3. Frontend Modules

### 3.1 Reusable Component Library (`/components/crm` + `/components/ui/ux`)

CRM-shared:

- `CrmSearchBar` — debounced global CRM search
- `CrmFilterPanel` — collapsible filter sidebar
- `CrmModal` — modal dialog
- `CrmDrawer` — side drawer
- `CrmStatusBadge` — colored status pill
- `CrmKpiCard` — KPI metric card
- `CrmTimeline` — vertical activity timeline
- `CrmEntityTimeline` — typed, color-coded activity / audit timeline
- `CrmDetailLayout` — detail-page header + tabs + sidebar
- `CrmQuickActivity` — quick-add task/call/meeting/email/note/follow-up
- `CrmFollowUpCard` — follow-up card
- `CrmNotificationItem` — notification row
- `CrmConfirmDialog` — confirm action
- `CrmFileUploader` — file dropzone

Shared ERP shell (used by CRM pages):

- `ErpPageShell` — page header, breadcrumbs, KPI strip
- `ErpDataTable` — sortable / paginated table
- `ErpKpiCard` — KPI tile
- `ErpTheme` — theme tokens
- `Table`, `SectionHero`, `Header` — building blocks

### 3.2 Pages (`/pages/systems/CRM`)

1. `CrmDashboard` — KPI dashboard with charts & widgets
2. `CrmLeads` — list + convert flyover + timeline
3. `CrmCustomers` (Companies) — list + detail flyover + relationship stats
4. `CrmContacts` — list + detail flyover + related deals
5. `CrmDeals` — list, Kanban by stage, detail flyover, stage move
6. `CrmPipelines` — pipeline / stage builder + stage preview
7. `CrmActivities` — universal activity feed (task / call / meeting / email / note / follow-up)
8. `CrmTasks` — task manager with recurring & snooze
9. `CrmCampaigns` — campaign manager with metrics
10. `CrmEmails` — inbox / sent / drafts / composer
11. `CrmEmailAccounts` — connect / sync / pause / test accounts
12. `CrmEmailTemplates` — template library + variable preview
13. `CrmFollowUps` — follow-up dashboard (due / overdue / upcoming)
14. `CrmSequences` — sequence builder + enrollments
15. `CrmAutomations` — automation rule builder + runs log
16. `CrmCalendar` — month / week / day agenda
17. `CrmDocuments` — document library + uploads
18. `CrmTags` — tag manager
19. `CrmReports` — standard reports (pipeline / conversion / activity / revenue / source)
20. `CrmAnalytics` — advanced analytics + global search
21. `CrmImportExport` — import / export center
22. `CrmDuplicates` — duplicate groups + merge
23. `CrmNotifications` — notification center
24. `CrmSettings` — settings tree (general, email, scoring, custom fields, permissions)
25. `CrmLeadScore` — scoring rule editor
26. `CrmCustomFields` — custom field manager
27. `CrmAudit` — audit log viewer

### 3.3 Dedicated detail subpages (`/pages/systems/CRM/detail`)

Full-page detail views that load a single CRM record and aggregate
related data (activities, notes, deals, contacts, audit timeline) via
the existing REST endpoints. The lead conversion flow on the backend
returns `{ lead, customer, contact, deal }` so the detail pages can
navigate the converted artefacts in one click.

- `CrmLeadDetail` — header (avatar, status, rating, score), sidebar
  (contact / company / address / lifecycle), tabs (Overview,
  Activities, Notes, Deals, Audit Timeline), inline status change,
  quick activity add, add note, convert-related links.
- `CrmContactDetail` — header (name, title), sidebar (contact info,
  company, lifecycle), tabs (Overview, Activities, Notes, Deals, Audit).
- `CrmCustomerDetail` — header (company logo, status), KPI strip
  (contacts, deals, activities, open deal value), sidebar (company
  info, lifecycle), tabs (Overview, Contacts, Deals, Activities,
  Notes, Audit).
- `CrmDealDetail` — header (name, status, stage, amount), sidebar
  (amount, probability, customer, contact, lead, pipeline, dates,
  owner), tabs (Overview with stage navigation, Activities, Notes,
  Audit). Move stage modal uses the `crm_pipelines.stages` definitions
  for probability auto-fill. Won / Lost actions are wired.
- `CrmActivityDetail` — header (type icon, status, due date), sidebar
  (type, priority, status, due, completed, outcome, assignee), tabs
  (Overview with linked lead / customer / contact / deal, Audit).
- `CrmCampaignDetail` — header (name, status, type, dates), KPI strip
  (recipients, sent, opened, converted), sidebar (code, type, status,
  budget, expected revenue, owner), tabs (Overview, Deals, Activities,
  Audit).

`CrmDetailRouter` (in `detail/index.js`) selects the right detail
component for a given `{ entityType, entityId }` pair.

---

## 4. REST API (`/api/v1/crm/...`)

Versioned, Sanctum-protected, tenant-isolated endpoints.

Response envelope:
```json
{ "success": true, "message": "...", "data": {}, "meta": {} }
```

---

## 5. Multi-Tenancy

All CRM tables are tenant-scoped via Laravel's `tenant` connection.
Middleware `CustomerDataIsolationMiddleware` enforces tenant context.
Cross-tenant access is impossible.

---

## 6. Security

- Sanctum token auth
- OAuth tokens encrypted with `Crypt::encryptString` before DB write
- Refresh tokens NEVER exposed to React
- CSRF on state-changing routes
- XSS sanitization in email composer
- Rate limiting per tenant
- Audit log on all sensitive operations
- Permission middleware on every endpoint

---

## 7. Background & Real-time

- Redis queue with horizon-style monitoring
- `Illuminate\Support\Facades\Schedule` runs:
  - `email:sync` every 5 minutes
  - `followups:dispatch` every minute
  - `sequences:advance` every 10 minutes
  - `automations:run` on event
  - `imports:cleanup` daily
  - `exports:cleanup` daily
- WebSocket broadcasting for new emails, replies, notifications
  (optional, via Laravel broadcasting)

---

## 8. Development Workflow

1. Migrations (`database/migrations/tenant/...`)
2. Models
3. Services
4. Form Requests + Policies
5. Controllers
6. Routes
7. Jobs & Listeners
8. API client (`api/crm.js`)
9. Reusable components
10. Pages

---

## 9. Testing

- Unit tests on every service
- Feature tests on every controller
- API tests via PHPUnit
- Critical email & follow-up flows tested end-to-end

---

## 10. Definition of Done

CRM is complete only when every page, button, table, chart, filter,
workflow, email action, follow-up, automation, notification, report,
import/export, and integration is connected to real backend functionality
with no hardcoded or fake UI.