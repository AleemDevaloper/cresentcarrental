import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faBookOpen,
  faBrain,
  faCheckCircle,
  faCircleNodes,
  faCloudArrowUp,
  faCode,
  faDatabase,
  faFileAlt,
  faFileImport,
  faFilter,
  faFolderTree,
  faGaugeHigh,
  faLayerGroup,
  faMagnifyingGlass,
  faMicrochip,
  faPenToSquare,
  faPlay,
  faRobot,
  faShieldHalved,
  faSitemap,
  faTags,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';

const categories = [
  'Company Information',
  'Organization Structure',
  'ERP Documentation',
  'HRMS Documentation',
  'PMS Documentation',
  'TMS Documentation',
  'FMS Documentation',
  'CRM Documentation',
  'DMS Documentation',
  'Inventory Documentation',
  'Procurement Documentation',
  'Payroll Documentation',
  'API Documentation',
  'Database Documentation',
  'Business Rules',
  'Approval Policies',
  'Company Policies',
  'Standard Operating Procedures',
  'Training Manuals',
  'FAQs',
  'Release Notes',
  'Developer Guides',
  'Technical Architecture',
  'Security Policies',
  'Compliance Documents',
  'Customer Support Articles',
  'Video Tutorials',
];

const knowledgeRecords = [
  { title: 'ManageCore Platform Operating Model', category: 'Company Information', module: 'Core ERP', owner: 'Root Super Admin', tokens: '18.4K', status: 'Indexed', updated: '2026-06-29', coverage: 98 },
  { title: 'FMS Invoice Approval and Payment Rules', category: 'FMS Documentation', module: 'FMS', owner: 'Finance Ops', tokens: '12.1K', status: 'Training', updated: '2026-06-28', coverage: 86 },
  { title: 'HRMS Attendance Exception SOP', category: 'Standard Operating Procedures', module: 'HRMS', owner: 'HR Admin', tokens: '7.8K', status: 'Indexed', updated: '2026-06-27', coverage: 94 },
  { title: 'Developer API Authentication Guide', category: 'API Documentation', module: 'Platform', owner: 'Engineering', tokens: '21.7K', status: 'Pending Update', updated: '2026-06-26', coverage: 72 },
  { title: 'Tenant Provisioning Architecture', category: 'Technical Architecture', module: 'Superadmin', owner: 'Platform Team', tokens: '15.3K', status: 'Failed Index', updated: '2026-06-25', coverage: 41 },
];

const moduleKnowledge = [
  { module: 'HRMS', docs: 184, confidence: 94, focus: 'Employees, attendance, payroll, leaves, performance' },
  { module: 'PMS', docs: 126, confidence: 91, focus: 'Projects, milestones, budgets, risk, resources' },
  { module: 'TMS', docs: 142, confidence: 89, focus: 'Tasks, workspaces, reports, productivity flows' },
  { module: 'FMS', docs: 168, confidence: 92, focus: 'Invoices, payments, tax, treasury, reimbursements' },
  { module: 'DMS', docs: 98, confidence: 87, focus: 'Documents, signatures, retention, audit trails' },
  { module: 'CRM', docs: 54, confidence: 76, focus: 'Customers, leads, support articles, account flows' },
];

const imports = [
  { label: 'PDF', value: 84 },
  { label: 'DOCX', value: 39 },
  { label: 'Markdown', value: 61 },
  { label: 'Excel/CSV', value: 28 },
  { label: 'JSON/XML', value: 17 },
];

const statusBadge = (status) => {
  if (status === 'Indexed') return 'bg-success';
  if (status === 'Training') return 'bg-primary';
  if (status === 'Pending Update') return 'bg-warning text-dark';
  if (status === 'Failed Index') return 'bg-danger';
  return 'bg-secondary';
};

const AIKnowledgeCenter = ({ isDark }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [trainingMode, setTrainingMode] = useState('Guided');
  const [draft, setDraft] = useState({
    title: '',
    category: 'ERP Documentation',
    module: 'Core ERP',
    priority: 'High',
    visibility: 'Super Admin Only',
    content: '',
  });

  const filteredRecords = useMemo(() => knowledgeRecords.filter((record) => {
    const matchesCategory = activeCategory === 'All' || record.category === activeCategory;
    const haystack = `${record.title} ${record.category} ${record.module} ${record.owner}`.toLowerCase();
    return matchesCategory && haystack.includes(searchTerm.toLowerCase());
  }), [activeCategory, searchTerm]);

  const kpis = [
    { label: 'Knowledge Documents', value: '1,284', delta: '+74 this month', icon: faBookOpen, color: '#2563eb' },
    { label: 'Training Sources', value: '312', delta: '18 connectors', icon: faCircleNodes, color: '#7c3aed' },
    { label: 'Knowledge Categories', value: '27', delta: 'Enterprise taxonomy', icon: faTags, color: '#0f766e' },
    { label: 'AI Responses Generated', value: '48.2K', delta: '+21%', icon: faRobot, color: '#0891b2' },
    { label: 'Knowledge Tokens', value: '9.8M', delta: 'Indexed context', icon: faMicrochip, color: '#4f46e5' },
    { label: 'Indexed Documents', value: '1,147', delta: '89.3%', icon: faDatabase, color: '#16a34a' },
    { label: 'Last Training Date', value: 'Jun 29', delta: 'Today', icon: faPlay, color: '#ea580c' },
    { label: 'Training Status', value: 'Active', delta: 'Queue healthy', icon: faCheckCircle, color: '#059669' },
    { label: 'AI Accuracy Score', value: '94.6%', delta: '+3.2%', icon: faGaugeHigh, color: '#2563eb' },
    { label: 'Knowledge Coverage', value: '88%', delta: '12 modules', icon: faLayerGroup, color: '#9333ea' },
    { label: 'Pending Updates', value: '31', delta: 'Needs review', icon: faPenToSquare, color: '#d97706' },
    { label: 'Failed Indexes', value: '7', delta: '-4 today', icon: faTriangleExclamation, color: '#dc2626' },
  ];

  const cardClass = `card border-0 shadow-sm ai-kc-card ${isDark ? 'bg-dark text-white border-white border-opacity-10' : 'bg-white'}`;

  return (
    <div className={`ai-knowledge-center ${isDark ? 'text-white' : 'text-dark'}`}>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
        <div>
          <div className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2 mb-2">
            <FontAwesomeIcon icon={faBrain} className="me-2" />
            Enterprise AI Knowledge Center
          </div>
          <h2 className="fw-black mb-1">Train ManageCore AI With Business Knowledge</h2>
          <p className="text-muted mb-0">Configure company rules, SOPs, module docs, APIs, policies, and project intelligence for the platform AI assistant.</p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-light rounded-pill px-3 fw-bold">
            <FontAwesomeIcon icon={faFileImport} className="me-2" />
            Import Sources
          </button>
          <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">
            <FontAwesomeIcon icon={faPlay} className="me-2" />
            Start Training
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="col-xxl-2 col-xl-3 col-md-4 col-sm-6">
            <div className={cardClass}>
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <span className="ai-kc-icon" style={{ background: `${kpi.color}16`, color: kpi.color }}>
                    <FontAwesomeIcon icon={kpi.icon} />
                  </span>
                  <span className="x-small text-muted fw-bold">{kpi.delta}</span>
                </div>
                <div className="fw-black fs-5 lh-sm">{kpi.value}</div>
                <div className="x-small text-muted text-uppercase fw-bold mt-1">{kpi.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-xl-8">
          <div className={`${cardClass} mb-4`}>
            <div className="card-body p-4">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
                <div>
                  <h5 className="fw-black mb-1">Knowledge Repository</h5>
                  <p className="text-muted small mb-0">Centralized knowledge, policy, documentation, and SOP index.</p>
                </div>
                <button className="btn btn-outline-primary btn-sm rounded-pill px-3 fw-bold">
                  <FontAwesomeIcon icon={faFilter} className="me-2" />
                  Advanced Filters
                </button>
              </div>

              <div className="input-group input-group-sm mb-3">
                <span className="input-group-text border-0 bg-light"><FontAwesomeIcon icon={faMagnifyingGlass} /></span>
                <input className="form-control border-0 bg-light" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search knowledge title, category, module, owner" />
              </div>

              <div className="d-flex gap-2 overflow-auto pb-2 mb-3">
                {['All', ...categories.slice(0, 12)].map((category) => (
                  <button key={category} className={`btn btn-sm rounded-pill text-nowrap px-3 fw-bold ${activeCategory === category ? 'btn-primary' : 'btn-light text-muted'}`} onClick={() => setActiveCategory(category)}>
                    {category}
                  </button>
                ))}
              </div>

              <div className="table-responsive">
                <table className={`table table-hover align-middle mb-0 ${isDark ? 'table-dark' : ''}`}>
                  <thead className="small text-uppercase">
                    <tr>
                      <th>Knowledge Title</th>
                      <th>Category</th>
                      <th>Module</th>
                      <th>Tokens</th>
                      <th>Status</th>
                      <th>Coverage</th>
                      <th className="text-end">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record) => (
                      <tr key={record.title}>
                        <td>
                          <div className="fw-bold">{record.title}</div>
                          <div className="x-small text-muted">{record.owner}</div>
                        </td>
                        <td>{record.category}</td>
                        <td><span className="badge bg-primary bg-opacity-10 text-primary">{record.module}</span></td>
                        <td>{record.tokens}</td>
                        <td><span className={`badge rounded-pill ${statusBadge(record.status)}`}>{record.status}</span></td>
                        <td style={{ minWidth: 130 }}>
                          <div className="progress" style={{ height: 6 }}>
                            <div className="progress-bar bg-primary" style={{ width: `${record.coverage}%` }} />
                          </div>
                          <div className="x-small text-muted mt-1">{record.coverage}%</div>
                        </td>
                        <td className="text-end">{record.updated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className={cardClass}>
            <div className="card-body p-4">
              <h5 className="fw-black mb-3">Manual Knowledge Entry</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label x-small text-muted fw-bold text-uppercase">Title</label>
                  <input className="form-control border-0 bg-light" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} placeholder="Knowledge title" />
                </div>
                <div className="col-md-3">
                  <label className="form-label x-small text-muted fw-bold text-uppercase">Category</label>
                  <select className="form-select border-0 bg-light" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>
                    {categories.map((category) => <option key={category}>{category}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label x-small text-muted fw-bold text-uppercase">Module</label>
                  <select className="form-select border-0 bg-light" value={draft.module} onChange={(e) => setDraft({ ...draft, module: e.target.value })}>
                    {['Core ERP', 'Superadmin', 'HRMS', 'PMS', 'TMS', 'FMS', 'CRM', 'DMS', 'Inventory', 'Procurement', 'Payroll'].map((module) => <option key={module}>{module}</option>)}
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label x-small text-muted fw-bold text-uppercase">Priority</label>
                  <select className="form-select border-0 bg-light" value={draft.priority} onChange={(e) => setDraft({ ...draft, priority: e.target.value })}>
                    <option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <label className="form-label x-small text-muted fw-bold text-uppercase">Visibility</label>
                  <select className="form-select border-0 bg-light" value={draft.visibility} onChange={(e) => setDraft({ ...draft, visibility: e.target.value })}>
                    <option>Super Admin Only</option><option>Admin Roles</option><option>All Modules</option><option>Support Agents</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label x-small text-muted fw-bold text-uppercase">Tags and Keywords</label>
                  <input className="form-control border-0 bg-light" placeholder="approval, invoice, policy, api" />
                </div>
                <div className="col-12">
                  <label className="form-label x-small text-muted fw-bold text-uppercase">Knowledge Content</label>
                  <textarea className="form-control border-0 bg-light" rows="7" value={draft.content} onChange={(e) => setDraft({ ...draft, content: e.target.value })} placeholder="Write Markdown, SOPs, business rules, API notes, code blocks, tables, or instructions for the AI assistant." />
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {['Markdown', 'HTML', 'Code Blocks', 'Tables', 'Images', 'Videos', 'Flowcharts', 'Attachments'].map((item) => <span key={item} className="badge bg-light text-muted border">{item}</span>)}
                  </div>
                </div>
              </div>
              <div className="text-end mt-4">
                <button className="btn btn-primary rounded-pill px-4 fw-bold">Save and Queue for Indexing</button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-4">
          <motion.div className={`${cardClass} mb-4`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <div className="card-body p-4">
              <h5 className="fw-black mb-3">Document Import</h5>
              <div className="ai-dropzone mb-3">
                <FontAwesomeIcon icon={faCloudArrowUp} className="fs-2 text-primary mb-2" />
                <div className="fw-bold">Bulk upload or folder import</div>
                <div className="small text-muted">PDF, DOCX, TXT, CSV, Excel, PowerPoint, Markdown, HTML, JSON, XML, ZIP</div>
              </div>
              <div className="row g-2">
                {imports.map((item) => (
                  <div key={item.label} className="col-6">
                    <div className="p-3 rounded-3 bg-light">
                      <div className="fw-black">{item.value}</div>
                      <div className="x-small text-muted fw-bold">{item.label}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="d-grid gap-2 mt-3">
                {['Auto Categorization', 'OCR Support', 'Document Parsing', 'Version Detection'].map((item) => (
                  <div key={item} className="d-flex align-items-center gap-2 small">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className={`${cardClass} mb-4`}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5 className="fw-black mb-0">Project Training</h5>
                <select className="form-select form-select-sm w-auto border-0 bg-light" value={trainingMode} onChange={(e) => setTrainingMode(e.target.value)}>
                  <option>Guided</option><option>Strict</option><option>Exploratory</option>
                </select>
              </div>
              {[
                { label: 'Architecture', icon: faSitemap },
                { label: 'Folder Structure', icon: faFolderTree },
                { label: 'Coding Standards', icon: faCode },
                { label: 'Database Tables', icon: faDatabase },
                { label: 'Roles and Permissions', icon: faShieldHalved },
                { label: 'Business Logic', icon: faBrain },
              ].map((item) => (
                <div key={item.label} className="d-flex align-items-center justify-content-between py-2 border-bottom border-opacity-10">
                  <div className="d-flex align-items-center gap-2">
                    <FontAwesomeIcon icon={item.icon} className="text-primary" />
                    <span className="fw-bold small">{item.label}</span>
                  </div>
                  <span className="badge bg-success bg-opacity-10 text-success">Ready</span>
                </div>
              ))}
              <button className="btn btn-outline-primary rounded-pill w-100 mt-3 fw-bold">
                Train Project Context <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
              </button>
            </div>
          </div>

          <div className={cardClass}>
            <div className="card-body p-4">
              <h5 className="fw-black mb-3">Module Knowledge</h5>
              <div className="d-grid gap-3">
                {moduleKnowledge.map((module) => (
                  <div key={module.module} className="p-3 rounded-3 bg-light">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-black">{module.module}</span>
                      <span className="small fw-bold text-primary">{module.confidence}%</span>
                    </div>
                    <div className="x-small text-muted mb-2">{module.focus}</div>
                    <div className="d-flex align-items-center gap-2">
                      <div className="progress flex-grow-1" style={{ height: 6 }}>
                        <div className="progress-bar bg-primary" style={{ width: `${module.confidence}%` }} />
                      </div>
                      <span className="x-small text-muted">{module.docs} docs</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ai-knowledge-center .x-small { font-size: 11px; }
        .ai-kc-card { border-radius: 8px; }
        .ai-kc-icon {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .ai-dropzone {
          border: 1px dashed rgba(79, 70, 229, 0.35);
          border-radius: 8px;
          background: rgba(79, 70, 229, 0.06);
          min-height: 150px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default AIKnowledgeCenter;
