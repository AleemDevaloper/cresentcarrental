import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFile, faFileWord, faFileExcel, faFilePowerpoint, faFilePdf, faFileImage, faFileVideo, faFileCode,
  faFileArchive, faFileAlt, faImage, faArchive, faSearch, faUpload, faDownload,
  faShare, faLink, faTimes, faChevronLeft, faChevronRight, faGridHorizontal, faList, faTable, faEllipsisVertical, faHistory, faCheckCircle,
  faClock, faUsers, faLock, faStar, faPrint,
  faExpand, faRotateRight, faSearchPlus, faSearchMinus, faPlay, faPause, faVolumeUp,
  faComment, faPaperPlane, faClone,
  faCircle, faEye, faPlus,
  faInfoCircle,
  faAnglesLeft, faAnglesRight, faCloudArrowUp, faChevronUp, faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import SpreadsheetViewer from './viewers/SpreadsheetViewer';
import PresentationViewer from './viewers/PresentationViewer';
import TextViewer from './viewers/TextViewer';
import WordViewer from './viewers/WordViewer';
import { EnableDisableButton } from '../../../components/common';

const FILE_ICONS = {
  doc: faFileWord, docx: faFileWord, rtf: faFileAlt, odt: faFileAlt,
  xls: faFileExcel, xlsx: faFileExcel, csv: faFileExcel, ods: faFileExcel,
  ppt: faFilePowerpoint, pptx: faFilePowerpoint, odp: faFilePowerpoint,
  pdf: faFilePdf,
  png: faFileImage, jpg: faFileImage, jpeg: faFileImage, webp: faFileImage, svg: faFileImage, gif: faFileImage,
  mp4: faFileVideo, mov: faFileVideo, avi: faFileVideo, webm: faFileVideo,
  txt: faFileAlt, log: faFileAlt, json: faFileCode, xml: faFileCode, yaml: faFileCode,
  php: faFileCode, js: faFileCode, ts: faFileCode, html: faFileCode, css: faFileCode, py: faFileCode, java: faFileCode, sql: faFileCode,
  zip: faFileArchive, rar: faFileArchive, '7z': faFileArchive,
  dwg: faFileImage, dxf: faFileImage, psd: faFileImage, ai: faFileImage, fig: faFileImage,
};

const FILE_COLORS = {
  doc: '#2b579a', docx: '#2b579a', rtf: '#6b6b6b', odt: '#1e6f3f',
  xls: '#217346', xlsx: '#217346', csv: '#207245', ods: '#1e6f3f',
  ppt: '#d24726', pptx: '#d24726', odp: '#1e6f3f',
  pdf: '#ef4444',
  png: '#0ea5e9', jpg: '#0ea5e9', jpeg: '#0ea5e9', webp: '#0ea5e9', svg: '#f59e0b',
  mp4: '#8b5cf6', mov: '#8b5cf6', avi: '#8b5cf6', webm: '#8b5cf6',
  txt: '#64748b', log: '#64748b', json: '#f59e0b', xml: '#f59e0b', yaml: '#06b6d4',
  php: '#6366f1', js: '#f7df1e', ts: '#3178c6', html: '#e44d26', css: '#1572b6', py: '#3776ab', java: '#ed8b00', sql: '#00758f',
  zip: '#f59e0b', rar: '#f59e0b', '7z': '#f59e0b',
  dwg: '#e44d26', dxf: '#e44d26',
};

const FILE_CATEGORIES = {
  'Word': ['doc', 'docx', 'rtf', 'odt'],
  'Spreadsheet': ['xls', 'xlsx', 'csv', 'ods'],
  'Presentation': ['ppt', 'pptx', 'odp'],
  'PDF': ['pdf'],
  'Image': ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'],
  'Video': ['mp4', 'mov', 'avi', 'webm'],
  'Text': ['txt', 'log'],
  'Code': ['php', 'js', 'ts', 'html', 'css', 'py', 'java', 'sql', 'json', 'xml', 'yaml'],
  'Archive': ['zip', 'rar', '7z'],
  'Design': ['dwg', 'dxf', 'psd', 'ai', 'fig'],
};

const getExt = (name) => (name || '').split('.').pop().toLowerCase();
const getIcon = (name) => FILE_ICONS[getExt(name)] || faFile;
const getColor = (name) => FILE_COLORS[getExt(name)] || '#64748b';
const getCategory = (name) => {
  const ext = getExt(name);
  for (const [cat, exts] of Object.entries(FILE_CATEGORIES)) {
    if (exts.includes(ext)) return cat;
  }
  return 'Other';
};
const formatSize = (bytes) => {
  if (!bytes) return '--';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
};
const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '--';

const MOCK_DOCS = [
  { id: 1, name: 'Project_Requirements_v2.2.docx', size: 245000, created: '2026-06-20', modified: '2026-06-22', version: '2.2', status: 'Approved', uploadedBy: 'Sarah Chen', category: 'Word', task: 'TASK-42', starred: true, locked: false, comments: 5, approvals: ['Team Lead', 'Manager'] },
  { id: 2, name: 'Financial_Report_Q2_2026.xlsx', size: 1890000, created: '2026-06-19', modified: '2026-06-23', version: '1.1', status: 'Under Review', uploadedBy: 'James Wilson', category: 'Spreadsheet', task: 'TASK-18', starred: false, locked: false, comments: 3, approvals: ['Manager'] },
  { id: 3, name: 'Architecture_Diagram_v3.pdf', size: 4520000, created: '2026-06-18', modified: '2026-06-21', version: '3.0', status: 'Approved', uploadedBy: 'Maria Garcia', category: 'PDF', task: 'TASK-7', starred: true, locked: true, comments: 8, approvals: ['Team Lead', 'Manager', 'Director'] },
  { id: 4, name: 'Sprint_Review_Presentation.pptx', size: 3200000, created: '2026-06-17', modified: '2026-06-20', version: '1.0', status: 'Draft', uploadedBy: 'Robert Kim', category: 'Presentation', task: 'TASK-55', starred: false, locked: false, comments: 1, approvals: [] },
  { id: 5, name: 'API_Documentation.html', size: 180000, created: '2026-06-16', modified: '2026-06-19', version: '2.0', status: 'Approved', uploadedBy: 'Emily Davis', category: 'Code', task: 'TASK-33', starred: false, locked: false, comments: 2, approvals: ['Team Lead'] },
  { id: 6, name: 'Team_Photo_Q1.jpg', size: 2800000, created: '2026-06-15', modified: '2026-06-15', version: '1.0', status: 'Archived', uploadedBy: 'David Thompson', category: 'Image', task: 'TASK-12', starred: false, locked: false, comments: 0, approvals: [] },
  { id: 7, name: 'Demo_Video_Sprint_24.mp4', size: 45000000, created: '2026-06-14', modified: '2026-06-18', version: '1.0', status: 'Approved', uploadedBy: 'Sarah Chen', category: 'Video', task: 'TASK-42', starred: true, locked: false, comments: 12, approvals: ['Manager'] },
  { id: 8, name: 'Server_Config_Backup.zip', size: 12000000, created: '2026-06-13', modified: '2026-06-14', version: '1.0', status: 'Draft', uploadedBy: 'James Wilson', category: 'Archive', task: 'TASK-8', starred: false, locked: false, comments: 0, approvals: [] },
  { id: 9, name: 'Requirements_Spec_v1.odt', size: 320000, created: '2026-06-12', modified: '2026-06-17', version: '1.3', status: 'Under Review', uploadedBy: 'Maria Garcia', category: 'Word', task: 'TASK-7', starred: false, locked: true, comments: 6, approvals: ['Team Lead'] },
  { id: 10, name: 'Budget_Forecast_2026.xlsx', size: 560000, created: '2026-06-11', modified: '2026-06-16', version: '1.0', status: 'Rejected', uploadedBy: 'Robert Kim', category: 'Spreadsheet', task: 'TASK-18', starred: false, locked: false, comments: 4, approvals: ['Manager', 'Director'] },
  { id: 11, name: 'Wireframe_Mockups.fig', size: 8900000, created: '2026-06-10', modified: '2026-06-13', version: '1.0', status: 'Approved', uploadedBy: 'Emily Davis', category: 'Design', task: 'TASK-55', starred: false, locked: false, comments: 7, approvals: ['Team Lead'] },
  { id: 12, name: 'Migration_Script_v2.sql', size: 45000, created: '2026-06-09', modified: '2026-06-12', version: '2.0', status: 'Approved', uploadedBy: 'David Thompson', category: 'Code', task: 'TASK-8', starred: false, locked: false, comments: 1, approvals: [] },
];

const VERSIONS = [
  { id: 1, docId: 1, version: '2.2', date: '2026-06-22', size: 245000, uploadedBy: 'Sarah Chen', notes: 'Added executive summary section', approved: true },
  { id: 2, docId: 1, version: '2.1', date: '2026-06-20', size: 240000, uploadedBy: 'James Wilson', notes: 'Updated technical requirements', approved: true },
  { id: 3, docId: 1, version: '2.0', date: '2026-06-15', size: 235000, uploadedBy: 'Sarah Chen', notes: 'Major revision after client feedback', approved: true },
  { id: 4, docId: 1, version: '1.0', date: '2026-06-01', size: 220000, uploadedBy: 'Maria Garcia', notes: 'Initial draft', approved: true },
];

const APPROVALS = [
  { id: 1, docId: 1, level: 'Team Lead', approver: 'James Wilson', date: '2026-06-21', status: 'Approved', comment: 'Looks good' },
  { id: 2, docId: 1, level: 'Manager', approver: 'Sarah Chen', date: '2026-06-22', status: 'Approved', comment: 'Approved with minor notes' },
  { id: 3, docId: 3, level: 'Team Lead', approver: 'James Wilson', date: '2026-06-20', status: 'Approved', comment: 'Great work' },
  { id: 4, docId: 3, level: 'Manager', approver: 'Sarah Chen', date: '2026-06-21', status: 'Approved', comment: 'Ready for director review' },
  { id: 5, docId: 3, level: 'Director', approver: 'Emily Davis', date: '2026-06-21', status: 'Approved', comment: 'Final approval granted' },
];

const comments = [
  { id: 1, docId: 1, user: 'Sarah Chen', text: 'Please review section 3.2 for accuracy', date: '2026-06-21' },
  { id: 2, docId: 1, user: 'James Wilson', text: 'Section 3.2 updated with latest figures', date: '2026-06-22' },
  { id: 3, docId: 1, user: 'Maria Garcia', text: 'Approved. Ready for submission.', date: '2026-06-22' },
  { id: 4, docId: 3, user: 'Robert Kim', text: 'Architecture diagram needs updated network topology', date: '2026-06-19' },
  { id: 5, docId: 3, user: 'Emily Davis', text: 'Network topology updated in v3. Please re-review.', date: '2026-06-21' },
];

const TaskDocumentCenter = () => {
  const [viewMode, setViewMode] = useState('dashboard');
  const [libraryView, setLibraryView] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [activeDocTab, setActiveDocTab] = useState('preview');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage] = useState(1);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [shareWithTeam, setShareWithTeam] = useState(false);

  const docs = useMemo(() => {
    let result = [...MOCK_DOCS];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d => d.name.toLowerCase().includes(q) || d.uploadedBy.toLowerCase().includes(q) || d.task?.toLowerCase().includes(q));
    }
    if (categoryFilter !== 'All') result = result.filter(d => d.category === categoryFilter);
    if (statusFilter !== 'All') result = result.filter(d => d.status === statusFilter);
    return result;
  }, [searchQuery, categoryFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: MOCK_DOCS.length,
    recent: MOCK_DOCS.filter(d => d.created > '2026-06-17').length,
    pendingApprovals: MOCK_DOCS.filter(d => d.status === 'Under Review').length,
    versioned: MOCK_DOCS.filter(d => parseFloat(d.version) > 1).length,
    storage: MOCK_DOCS.reduce((s, d) => s + (d.size || 0), 0),
    shared: Math.floor(MOCK_DOCS.length * 0.6),
    locked: MOCK_DOCS.filter(d => d.locked).length,
  }), []);

  const categories = useMemo(() => ['All', ...new Set(MOCK_DOCS.map(d => d.category))], []);
  const statuses = useMemo(() => ['All', ...new Set(MOCK_DOCS.map(d => d.status))], []);

  const kpiData = [
    { label: 'Total Documents', value: stats.total, icon: faFile, color: '#6366f1', trend: '+12%', trendUp: true },
    { label: 'Recent Uploads', value: stats.recent, icon: faCloudArrowUp, color: '#0ea5e9', trend: '+5', trendUp: true },
    { label: 'Pending Approvals', value: stats.pendingApprovals, icon: faClock, color: '#f59e0b', trend: '-2', trendUp: false },
    { label: 'Versioned Files', value: stats.versioned, icon: faClone, color: '#8b5cf6', trend: '+8%', trendUp: true },
    { label: 'Storage Used', value: formatSize(stats.storage), icon: faArchive, color: '#10b981', trend: '+1.2 GB', trendUp: true },
    { label: 'Shared Files', value: stats.shared, icon: faUsers, color: '#06b6d4', trend: '+3', trendUp: true },
    { label: 'Locked', value: stats.locked, icon: faLock, color: '#ef4444', trend: '0', trendUp: true },
    { label: 'Starred', value: MOCK_DOCS.filter(d => d.starred).length, icon: faStar, color: '#f59e0b', trend: '+1', trendUp: true },
  ];

  const renderKPIs = () => (
    <div className="row g-3 mb-4">
      {kpiData.map((kpi, i) => (
        <div key={i} className="col-6 col-md-4 col-lg-3">
          <div className={`tdc-kpi-card ${kpi.trendUp ? '' : 'trend-down'}`}>
            <div className="tdc-kpi-top">
              <div className="tdc-kpi-icon" style={{ background: `linear-gradient(135deg, ${kpi.color}18, ${kpi.color}08)`, color: kpi.color, boxShadow: `0 4px 12px ${kpi.color}20` }}>
                <FontAwesomeIcon icon={kpi.icon} />
              </div>
              <div className="tdc-kpi-trend">
                <FontAwesomeIcon icon={kpi.trendUp ? faChevronUp : faChevronDown} className="tdc-trend-arrow" />
                <span>{kpi.trend}</span>
              </div>
            </div>
            <div className="tdc-kpi-info">
              <span className="tdc-kpi-value">{kpi.value}</span>
              <span className="tdc-kpi-label">{kpi.label}</span>
            </div>
            <div className="tdc-kpi-bar" style={{ background: `linear-gradient(90deg, ${kpi.color} 0%, ${kpi.color}44 100%)` }} />
          </div>
        </div>
      ))}
    </div>
  );

  const renderDashboard = () => (
    <div className="fade-in">
      {renderKPIs()}
      <div className="row g-3">
        <div className="col-12 col-lg-8">
          <div className="tdc-card"><div className="tdc-card-header"><h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faFile} className="me-2 text-primary" />Recent Documents</h6><button className="tdc-btn-sm" onClick={() => setViewMode('library')}>View All</button></div>
            <div className="tdc-card-body p-0">{MOCK_DOCS.slice(0, 5).map(doc => (
              <div key={doc.id} className="tdc-doc-row" onClick={() => { setSelectedDoc(doc); setViewMode('viewer'); }}>
                <div className="tdc-doc-icon" style={{ color: getColor(doc.name) }}><FontAwesomeIcon icon={getIcon(doc.name)} /></div>
                <div className="tdc-doc-info flex-grow-1 min-w-0"><span className="tdc-doc-name text-truncate d-block">{doc.name}</span><span className="tdc-doc-meta">{doc.uploadedBy} · {formatSize(doc.size)} · v{doc.version}</span></div>
                <span className={`tdc-status-badge tdc-status-${doc.status?.toLowerCase().replace(/\s+/g, '-')}`}>{doc.status}</span>
              </div>
            ))}</div>
          </div>
        </div>
        <div className="col-12 col-lg-4 d-flex flex-column gap-3">
          <div className="tdc-card"><div className="tdc-card-header"><h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faHistory} className="me-2 text-success" />Recent Activity</h6></div>
            <div className="tdc-card-body p-0">{[...MOCK_DOCS].sort((a, b) => new Date(b.modified) - new Date(a.modified)).slice(0, 6).map((doc, i) => (
              <div key={i} className="tdc-activity-row"><div className="tdc-activity-dot" style={{ background: getColor(doc.name) }}></div><div className="flex-grow-1 min-w-0"><span className="d-block text-truncate small fw-semibold">{doc.name}</span><span className="text-muted" style={{ fontSize: 10 }}>{doc.uploadedBy} · {formatDate(doc.modified)}</span></div></div>
            ))}</div>
          </div>
          <div className="tdc-card"><div className="tdc-card-header"><h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faCheckCircle} className="me-2 text-warning" />Approval Queue</h6></div>
            <div className="tdc-card-body p-0">{MOCK_DOCS.filter(d => d.status === 'Under Review').map((doc, i) => (
              <div key={i} className="tdc-activity-row"><div className="tdc-activity-dot" style={{ background: '#f59e0b' }}></div><div className="flex-grow-1 min-w-0"><span className="d-block text-truncate small fw-semibold">{doc.name}</span><span className="text-muted" style={{ fontSize: 10 }}>{doc.approvals?.join(' → ') || 'Awaiting review'}</span></div></div>
            ))}</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLibrary = () => (
    <div className="fade-in">
      <div className="d-flex align-items-center justify-content-between mb-3 gap-3 flex-wrap">
        <div className="d-flex align-items-center gap-2">
          <button className={`tdc-view-btn ${libraryView === 'grid' ? 'active' : ''}`} onClick={() => setLibraryView('grid')}><FontAwesomeIcon icon={faGridHorizontal} /></button>
          <button className={`tdc-view-btn ${libraryView === 'list' ? 'active' : ''}`} onClick={() => setLibraryView('list')}><FontAwesomeIcon icon={faList} /></button>
          <button className={`tdc-view-btn ${libraryView === 'table' ? 'active' : ''}`} onClick={() => setLibraryView('table')}><FontAwesomeIcon icon={faTable} /></button>
        </div>
        <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ maxWidth: 400 }}>
          <div className="tdc-search-wrap"><FontAwesomeIcon icon={faSearch} className="tdc-search-icon" /><input type="text" className="tdc-search-input" placeholder="Search documents..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /></div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <select className="tdc-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>{categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Types' : c}</option>)}</select>
          <select className="tdc-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>{statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}</select>
          <button className="tdc-btn-primary" onClick={() => setShowUploadModal(true)}><FontAwesomeIcon icon={faUpload} className="me-1" />Upload</button>
          <button className="tdc-btn-back" onClick={() => setViewMode('dashboard')}>Back</button>
        </div>
      </div>

      {libraryView === 'grid' && (
        <div className="row g-3">{docs.map(doc => (
          <div key={doc.id} className="col-6 col-md-4 col-lg-3">
            <div className="tdc-grid-card" onClick={() => { setSelectedDoc(doc); setViewMode('viewer'); }}>
              <div className="tdc-grid-icon" style={{ color: getColor(doc.name) }}><FontAwesomeIcon icon={getIcon(doc.name)} size="3x" /></div>
              <div className="tdc-grid-ext">{getExt(doc.name).toUpperCase()}</div>
              <span className="tdc-grid-name text-truncate d-block">{doc.name}</span>
              <span className="tdc-grid-meta">{formatSize(doc.size)}</span>
              {doc.starred && <FontAwesomeIcon icon={faStar} className="tdc-grid-star" />}
              {doc.locked && <FontAwesomeIcon icon={faLock} className="tdc-grid-lock" />}
            </div>
          </div>
        ))}</div>
      )}

      {libraryView === 'list' && (
        <div className="d-flex flex-column gap-2">{docs.map(doc => (
          <div key={doc.id} className="tdc-list-row" onClick={() => { setSelectedDoc(doc); setViewMode('viewer'); }}>
            <div className="tdc-list-icon" style={{ color: getColor(doc.name) }}><FontAwesomeIcon icon={getIcon(doc.name)} /></div>
            <div className="flex-grow-1 min-w-0"><span className="tdc-list-name text-truncate d-block">{doc.name}</span><span className="tdc-list-meta">{doc.uploadedBy} · v{doc.version} · {formatDate(doc.modified)}</span></div>
            <span className={`tdc-status-badge tdc-status-${doc.status?.toLowerCase().replace(/\s+/g, '-')} me-2`}>{doc.status}</span>
            <span className="tdc-list-size me-2">{formatSize(doc.size)}</span>
            {doc.starred && <FontAwesomeIcon icon={faStar} className="text-warning me-2" />}
            {doc.locked && <FontAwesomeIcon icon={faLock} className="text-danger me-2" />}
          </div>
        ))}</div>
      )}

      {libraryView === 'table' && (
        <div className="tdc-table-wrap"><table className="tdc-table"><thead><tr><th><FontAwesomeIcon icon={faFile} className="me-1" />Name</th><th>Type</th><th>Version</th><th>Status</th><th>Uploaded By</th><th>Modified</th><th>Size</th><th></th></tr></thead>
          <tbody>{docs.map(doc => (
            <tr key={doc.id} onClick={() => { setSelectedDoc(doc); setViewMode('viewer'); }} style={{ cursor: 'pointer' }}>
              <td><FontAwesomeIcon icon={getIcon(doc.name)} style={{ color: getColor(doc.name), marginRight: 8 }} /><span className="fw-semibold">{doc.name}</span></td>
              <td>{doc.category}</td><td>v{doc.version}</td>
              <td><span className={`tdc-status-badge tdc-status-${doc.status?.toLowerCase().replace(/\s+/g, '-')}`}>{doc.status}</span></td>
              <td>{doc.uploadedBy}</td><td className="text-muted small">{formatDate(doc.modified)}</td><td>{formatSize(doc.size)}</td>
              <td onClick={e => e.stopPropagation()}><button className="tdc-icon-btn"><FontAwesomeIcon icon={faEllipsisVertical} /></button></td>
            </tr>
          ))}</tbody></table></div>
      )}
    </div>
  );

  const renderPdfViewer = () => (
    <div className="tdc-viewer-content">
      <div className="tdc-pdf-toolbar">
        <div className="d-flex align-items-center gap-2">
          <button className="tdc-tb-btn"><FontAwesomeIcon icon={faSearchMinus} /></button>
          <span className="tdc-zoom-label">{zoomLevel}%</span>
          <button className="tdc-tb-btn"><FontAwesomeIcon icon={faSearchPlus} /></button>
          <span className="tdc-tb-divider"></span>
          <span className="tdc-page-nav">{currentPage} / 12</span>
          <span className="tdc-tb-divider"></span>
          <button className="tdc-tb-btn"><FontAwesomeIcon icon={faAnglesLeft} /></button>
          <button className="tdc-tb-btn"><FontAwesomeIcon icon={faChevronLeft} /></button>
          <button className="tdc-tb-btn"><FontAwesomeIcon icon={faChevronRight} /></button>
          <button className="tdc-tb-btn"><FontAwesomeIcon icon={faAnglesRight} /></button>
        </div>
        <div className="ms-auto d-flex align-items-center gap-1">
          <button className="tdc-tb-btn"><FontAwesomeIcon icon={faRotateRight} /></button>
          <button className="tdc-tb-btn"><FontAwesomeIcon icon={faExpand} /></button>
          <button className="tdc-tb-btn"><FontAwesomeIcon icon={faSearch} /></button>
          <button className="tdc-tb-btn"><FontAwesomeIcon icon={faPrint} /></button>
          <button className="tdc-tb-btn"><FontAwesomeIcon icon={faDownload} /></button>
        </div>
      </div>
      <div className="tdc-pdf-canvas" style={{ zoom: `${zoomLevel}%` }}>
        <div className="tdc-pdf-page">
          <div className="d-flex justify-content-between align-items-center mb-3"><h2 className="fw-bold mb-0">System Architecture Document</h2><span className="tdc-status-badge tdc-status-approved">Approved</span></div>
          <p className="text-muted small mb-4">Version 3.0 · Published June 21, 2026 · 12 pages</p>
          <div className="tdc-pdf-section"><h4>1. System Overview</h4><p>The Manage-Core platform employs a microservices-based architecture with a React.js frontend communicating with a Laravel API backend through RESTful endpoints...</p></div>
          <div className="tdc-pdf-section"><h4>2. Technology Stack</h4><p>Frontend: React 18, Bootstrap 5, Chart.js, Framer Motion. Backend: Laravel 10, PHP 8.2, MySQL 8.0. Infrastructure: Nginx, Redis, Supervisor.</p></div>
          <div className="tdc-pdf-section"><h4>3. Network Topology</h4><p>The system is deployed across three tiers: Web servers (Nginx + React), Application servers (Laravel PHP-FPM), and Database servers (MySQL with read replicas).</p></div>
          <div className="tdc-pdf-section"><h4>4. Security Architecture</h4><p>Authentication: Laravel Sanctum with token-based sessions. Authorization: Role-based access control (RBAC) with granular permissions. Data encryption at rest and in transit.</p></div>
        </div>
      </div>
    </div>
  );

  const renderImageViewer = () => (
    <div className="tdc-viewer-content">
      <div className="tdc-img-toolbar">
        <button className="tdc-tb-btn"><FontAwesomeIcon icon={faSearchMinus} /></button><span className="tdc-zoom-label">{zoomLevel}%</span><button className="tdc-tb-btn"><FontAwesomeIcon icon={faSearchPlus} /></button>
        <span className="tdc-tb-divider"></span>
        <button className="tdc-tb-btn"><FontAwesomeIcon icon={faRotateRight} /></button>
        <button className="tdc-tb-btn"><FontAwesomeIcon icon={faExpand} /></button>
        <span className="tdc-tb-divider"></span>
        <button className="tdc-tb-btn"><FontAwesomeIcon icon={faDownload} /></button>
        <button className="tdc-tb-btn"><FontAwesomeIcon icon={faPrint} /></button>
        <div className="ms-auto d-flex align-items-center gap-2">
          <span className="text-muted small">1920 × 1080 · PNG</span>
        </div>
      </div>
      <div className="tdc-img-canvas" style={{ zoom: `${zoomLevel}%` }}>
        <div className="tdc-img-placeholder">
          <FontAwesomeIcon icon={faImage} className="tdc-img-icon" />
          <span className="tdc-img-label">{selectedDoc?.name || 'Image Preview'}</span>
          <div className="tdc-img-dims">1920 × 1080 pixels · 2.8 MB</div>
        </div>
      </div>
    </div>
  );

  const renderVideoViewer = () => (
    <div className="tdc-viewer-content">
      <div className="tdc-video-container">
        <div className="tdc-video-player" onClick={() => setVideoPlaying(!videoPlaying)}>
          {!videoPlaying && <div className="tdc-video-overlay"><div className="tdc-video-play-btn"><FontAwesomeIcon icon={faPlay} /></div><span className="tdc-video-name">{selectedDoc?.name}</span></div>}
          {videoPlaying && <div className="tdc-video-progress"><div className="tdc-video-bar"><div className="tdc-video-fill" style={{ width: '35%' }}></div></div><span className="tdc-video-time">03:24 / 09:42</span></div>}
        </div>
        <div className="tdc-video-controls">
          <button className="tdc-vid-btn" onClick={() => setVideoPlaying(!videoPlaying)}><FontAwesomeIcon icon={videoPlaying ? faPause : faPlay} /></button>
          <button className="tdc-vid-btn"><FontAwesomeIcon icon={faVolumeUp} /></button>
          <div className="tdc-vid-progress"><div className="tdc-vid-track"><div className="tdc-vid-thumb" style={{ width: '35%' }}></div></div></div>
          <span className="text-muted small">03:24 / 09:42</span>
          <button className="tdc-vid-btn"><FontAwesomeIcon icon={faExpand} /></button>
        </div>
      </div>
    </div>
  );



  const renderDocViewer = () => {
    if (!selectedDoc) return null;
    const cat = getCategory(selectedDoc.name);
    const viewerTabs = [
      { id: 'preview', label: 'Preview', icon: faEye },
      { id: 'comments', label: `Comments (${comments.filter(c => c.docId === selectedDoc.id).length})`, icon: faComment },
      { id: 'versions', label: 'Versions', icon: faHistory },
      { id: 'approvals', label: 'Approvals', icon: faCheckCircle },
      { id: 'details', label: 'Details', icon: faInfoCircle },
    ];
    return (
      <div className="tdc-doc-viewer-panel">
        <div className="tdc-viewer-header">
          <div className="d-flex align-items-center gap-3 min-w-0">
            <FontAwesomeIcon icon={getIcon(selectedDoc.name)} style={{ color: getColor(selectedDoc.name), fontSize: 24 }} />
            <div className="min-w-0"><h6 className="fw-bold mb-0 text-truncate">{selectedDoc.name}</h6><span className="text-muted small">{selectedDoc.category} · v{selectedDoc.version} · {formatSize(selectedDoc.size)} · {formatDate(selectedDoc.modified)}</span></div>
          </div>
          <div className="d-flex align-items-center gap-2 flex-shrink-0">
            <span className={`tdc-status-badge tdc-status-${selectedDoc.status?.toLowerCase().replace(/\s+/g, '-')}`}>{selectedDoc.status}</span>
            <button className="tdc-btn-sm" onClick={() => setShowShareModal(true)}><FontAwesomeIcon icon={faShare} /></button>
            <button className="tdc-btn-sm"><FontAwesomeIcon icon={faDownload} /></button>
            <button className="tdc-btn-sm"><FontAwesomeIcon icon={faLink} /></button>
            <button className="tdc-btn-sm text-danger" onClick={() => { setSelectedDoc(null); setViewMode('library'); }}><FontAwesomeIcon icon={faTimes} /></button>
          </div>
        </div>
        <div className="tdc-viewer-tabs">
          {viewerTabs.map(tab => (
            <button key={tab.id} className={`tdc-viewer-tab ${activeDocTab === tab.id ? 'active' : ''}`} onClick={() => setActiveDocTab(tab.id)}>
              <FontAwesomeIcon icon={tab.icon} className="me-1" />{tab.label}
            </button>
          ))}
        </div>
        {activeDocTab === 'preview' && (
          <>
            {cat === 'Word' && <WordViewer zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />}
            {cat === 'Spreadsheet' && <SpreadsheetViewer zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />}
            {cat === 'Presentation' && <PresentationViewer zoomLevel={zoomLevel} setZoomLevel={setZoomLevel} />}
            {cat === 'PDF' && renderPdfViewer()}
            {(cat === 'Image' || cat === 'Design') && renderImageViewer()}
            {cat === 'Video' && renderVideoViewer()}
            {cat === 'Archive' && (
              <div className="tdc-viewer-content"><div className="text-center py-5"><FontAwesomeIcon icon={faArchive} style={{ fontSize: 48, color: '#f59e0b', opacity: 0.5 }} className="mb-3" /><p className="text-muted">Archive file preview not available. Download to extract contents.</p><button className="tdc-btn-primary"><FontAwesomeIcon icon={faDownload} className="me-1" />Download Archive</button></div></div>
            )}
            {cat === 'Text' && <TextViewer />}
            {cat === 'Code' && <TextViewer />}
            {cat === 'Other' && (
              <div className="tdc-viewer-content"><div className="text-center py-5"><FontAwesomeIcon icon={faFile} style={{ fontSize: 48, opacity: 0.5 }} className="mb-3 text-muted" /><p className="text-muted">Preview not available for this file type.</p></div></div>
            )}
          </>
        )}
        {activeDocTab === 'comments' && (
          <div className="tdc-viewer-content p-3">
            <div className="d-flex flex-column gap-3 mb-3" style={{ maxHeight: 400, overflow: 'auto' }}>
              {comments.filter(c => c.docId === selectedDoc.id).map(c => (
                <div key={c.id} className="tdc-comment-item"><div className="tdc-comment-avatar" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>{c.user[0]}</div><div><span className="fw-bold small">{c.user}</span><span className="text-muted ms-2" style={{ fontSize: 10 }}>{c.date}</span><p className="mb-0 small mt-1">{c.text}</p></div></div>
              ))}
            </div>
            <div className="tdc-comment-input"><div className="tdc-comment-avatar-sm" style={{ background: '#6366f1' }}>A</div><input type="text" className="tdc-comm-inp" placeholder="Add a comment..." value={newComment} onChange={e => setNewComment(e.target.value)} /><button className="tdc-send-comment"><FontAwesomeIcon icon={faPaperPlane} /></button></div>
          </div>
        )}
        {activeDocTab === 'versions' && (
          <div className="tdc-viewer-content p-3">
            <div className="d-flex justify-content-between align-items-center mb-3"><h6 className="fw-bold mb-0">Version History</h6><button className="tdc-btn-sm"><FontAwesomeIcon icon={faPlus} /> New Version</button></div>
            <div className="tdc-timeline">{VERSIONS.filter(v => v.docId === selectedDoc.id).map(v => (
              <div key={v.id} className="tdc-timeline-item"><div className="tdc-timeline-dot bg-primary"></div><div className="tdc-timeline-content"><div className="d-flex justify-content-between"><span className="fw-bold">v{v.version}</span><span className="text-muted small">{formatDate(v.date)}</span></div><span className="d-block small">{v.uploadedBy} · {v.notes}</span><span className={`tdc-status-badge tdc-status-approved small`}>Approved</span></div></div>
            ))}</div>
          </div>
        )}
        {activeDocTab === 'approvals' && (
          <div className="tdc-viewer-content p-3">
            <div className="d-flex justify-content-between align-items-center mb-3"><h6 className="fw-bold mb-0">Approval Workflow</h6><button className="tdc-btn-primary btn-sm"><FontAwesomeIcon icon={faPlus} className="me-1" />Request Approval</button></div>
            <div className="tdc-approval-flow">{['Team Lead', 'Manager', 'Project Manager', 'Director', 'Admin'].map((level, i) => {
              const approval = APPROVALS.find(a => a.docId === selectedDoc.id && a.level === level);
              const isActive = APPROVALS.filter(a => a.docId === selectedDoc.id).length > i;
              return (
                <div key={level} className="tdc-approval-step"><div className="tdc-approval-node"><div className={`tdc-approval-circle ${approval?.status === 'Approved' ? 'approved' : isActive ? 'pending' : 'inactive'}`}>
                  {approval?.status === 'Approved' ? <FontAwesomeIcon icon={faCheckCircle} /> : isActive ? <FontAwesomeIcon icon={faClock} /> : <FontAwesomeIcon icon={faCircle} />}
                </div><span className="tdc-approval-level">{level}</span></div>
                  {approval && <div className="tdc-approval-detail"><span className="fw-semibold small">{approval.approver}</span><p className="mb-0 text-muted" style={{ fontSize: 10 }}>{approval.comment} · {formatDate(approval.date)}</p></div>}
                  {!approval && isActive && <div className="tdc-approval-detail"><span className="text-muted small">Awaiting approval</span></div>}
                {i < 4 && <div className="tdc-approval-line"></div>}
              </div>
            );})}</div>
          </div>
        )}
        {activeDocTab === 'details' && (
          <div className="tdc-viewer-content p-3">
            <div className="row g-3"><div className="col-6"><div className="tdc-detail-item"><span className="tdc-detail-label">File Name</span><span className="tdc-detail-value">{selectedDoc.name}</span></div></div>
              <div className="col-6"><div className="tdc-detail-item"><span className="tdc-detail-label">File Type</span><span className="tdc-detail-value">{selectedDoc.category}</span></div></div>
              <div className="col-6"><div className="tdc-detail-item"><span className="tdc-detail-label">Size</span><span className="tdc-detail-value">{formatSize(selectedDoc.size)}</span></div></div>
              <div className="col-6"><div className="tdc-detail-item"><span className="tdc-detail-label">Version</span><span className="tdc-detail-value">v{selectedDoc.version}</span></div></div>
              <div className="col-6"><div className="tdc-detail-item"><span className="tdc-detail-label">Created</span><span className="tdc-detail-value">{formatDate(selectedDoc.created)}</span></div></div>
              <div className="col-6"><div className="tdc-detail-item"><span className="tdc-detail-label">Modified</span><span className="tdc-detail-value">{formatDate(selectedDoc.modified)}</span></div></div>
              <div className="col-6"><div className="tdc-detail-item"><span className="tdc-detail-label">Uploaded By</span><span className="tdc-detail-value">{selectedDoc.uploadedBy}</span></div></div>
              <div className="col-6"><div className="tdc-detail-item"><span className="tdc-detail-label">Status</span><span className={`tdc-status-badge tdc-status-${selectedDoc.status?.toLowerCase().replace(/\s+/g, '-')}`}>{selectedDoc.status}</span></div></div>
              <div className="col-6"><div className="tdc-detail-item"><span className="tdc-detail-label">Linked Task</span><span className="tdc-detail-value">{selectedDoc.task}</span></div></div>
              <div className="col-6"><div className="tdc-detail-item"><span className="tdc-detail-label">Extension</span><span className="tdc-detail-value">.{getExt(selectedDoc.name).toUpperCase()}</span></div></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderUploadModal = () => (
    <div className="tdc-modal-overlay" onClick={() => setShowUploadModal(false)}>
      <div className="tdc-modal" onClick={e => e.stopPropagation()}>
        <div className="tdc-modal-header"><h6 className="fw-bold mb-0">Upload Documents</h6><button className="tdc-btn-sm" onClick={() => setShowUploadModal(false)}><FontAwesomeIcon icon={faTimes} /></button></div>
        <div className="tdc-modal-body">
          <div className="tdc-dropzone"><FontAwesomeIcon icon={faCloudArrowUp} className="tdc-drop-icon" /><h6 className="fw-bold">Drop files here or click to browse</h6><p className="text-muted small mb-0">Supports DOC, DOCX, XLS, XLSX, PDF, PPT, PPTX, images, video, and more</p></div>
          <div className="mt-3"><label className="tdc-form-label">Task Link</label><select className="tdc-select w-100"><option>Link to current task</option><option>Link to specific project</option><option>No task link</option></select></div>
          <div className="mt-2"><label className="tdc-form-label">Category</label><select className="tdc-select w-100"><option>Auto-detect</option><option>Documentation</option><option>Financial</option><option>Technical</option><option>Design</option></select></div>
        </div>
        <div className="tdc-modal-footer"><button className="tdc-btn-back" onClick={() => setShowUploadModal(false)}>Cancel</button><button className="tdc-btn-primary"><FontAwesomeIcon icon={faUpload} className="me-1" />Upload Files</button></div>
      </div>
    </div>
  );

  const renderShareModal = () => (
    <div className="tdc-modal-overlay" onClick={() => setShowShareModal(false)}>
      <div className="tdc-modal tdc-modal-sm" onClick={e => e.stopPropagation()}>
        <div className="tdc-modal-header"><h6 className="fw-bold mb-0">Share Document</h6><button className="tdc-btn-sm" onClick={() => setShowShareModal(false)}><FontAwesomeIcon icon={faTimes} /></button></div>
        <div className="tdc-modal-body">
          <div className="mb-3"><label className="tdc-form-label">Share with</label><div className="tdc-search-wrap"><FontAwesomeIcon icon={faSearch} className="tdc-search-icon" /><input type="text" className="tdc-search-input" placeholder="Search users, teams, departments..." /></div></div>
          <div className="mb-3"><label className="tdc-form-label">Permission Level</label><select className="tdc-select w-100"><option>Can View</option><option>Can Comment</option><option>Can Edit</option><option>Full Access</option></select></div>
          <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded-3"><span className="small fw-semibold">Share with entire team</span><EnableDisableButton checked={shareWithTeam} onClick={() => setShareWithTeam(!shareWithTeam)} label="Share with entire team" size="small" /></div>
        </div>
        <div className="tdc-modal-footer"><button className="tdc-btn-back" onClick={() => setShowShareModal(false)}>Cancel</button><button className="tdc-btn-primary"><FontAwesomeIcon icon={faShare} className="me-1" />Share</button></div>
      </div>
    </div>
  );

  return (
    <div className="tdc-container">
      {viewMode === 'dashboard' && renderDashboard()}
      {viewMode === 'library' && renderLibrary()}
      {viewMode === 'viewer' && renderDocViewer()}
      {showUploadModal && renderUploadModal()}
      {showShareModal && renderShareModal()}

      <style>{`
        .tdc-container { height: 100%; display: flex; flex-direction: column; }
        .tdc-kpi-card { background: #fff; border: 1px solid #f1f5f9; border-radius: 16px; padding: 18px 20px 14px; position: relative; overflow: hidden; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; gap: 10px; }
        .tdc-kpi-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.06); transform: translateY(-2px); border-color: #e2e8f0; }
        .tdc-kpi-card.trend-down { opacity: 0.92; }
        .tdc-kpi-top { display: flex; align-items: flex-start; justify-content: space-between; }
        .tdc-kpi-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; transition: transform 0.2s; }
        .tdc-kpi-card:hover .tdc-kpi-icon { transform: scale(1.05); }
        .tdc-kpi-trend { display: flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 700; color: #10b981; padding: 4px 8px; border-radius: 20px; background: #f0fdf4; }
        .tdc-kpi-card.trend-down .tdc-kpi-trend { color: #ef4444; background: #fef2f2; }
        .tdc-trend-arrow { font-size: 9px; }
        .tdc-kpi-info { display: flex; flex-direction: column; gap: 1px; }
        .tdc-kpi-value { font-size: 24px; font-weight: 800; color: #0f172a; line-height: 1.2; letter-spacing: -0.02em; }
        .tdc-kpi-label { font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.03em; }
        .tdc-kpi-bar { height: 3px; border-radius: 3px; margin-top: 2px; opacity: 0.5; }

        .tdc-card { background: #fff; border: 1px solid #f1f5f9; border-radius: 12px; overflow: hidden; }
        .tdc-card-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-bottom: 1px solid #f1f5f9; }
        .tdc-card-body { padding: 8px; }
        .tdc-doc-row { display: flex; align-items: center; gap: 10px; padding: 8px 12px; cursor: pointer; border-radius: 8px; transition: background 0.15s; }
        .tdc-doc-row:hover { background: #f8fafc; }
        .tdc-doc-icon { font-size: 18px; width: 32px; text-align: center; flex-shrink: 0; }
        .tdc-doc-name { font-size: 12px; font-weight: 600; color: #0f172a; }
        .tdc-doc-meta { font-size: 10px; color: #94a3b8; }
        .tdc-activity-row { display: flex; align-items: center; gap: 10px; padding: 8px 12px; }
        .tdc-activity-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .tdc-btn-sm { border: 1px solid #e2e8f0; background: #fff; padding: 5px 10px; border-radius: 8px; font-size: 11px; font-weight: 600; color: #64748b; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 4px; }
        .tdc-btn-sm:hover { border-color: #6366f1; color: #6366f1; }
        .tdc-btn-primary { border: none; background: #6366f1; color: #fff; padding: 6px 14px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 4px; }
        .tdc-btn-primary:hover { background: #4f46e5; }
        .tdc-btn-back { border: 1px solid #e2e8f0; background: #fff; padding: 6px 14px; border-radius: 8px; font-size: 11px; font-weight: 600; color: #64748b; cursor: pointer; }
        .tdc-btn-back:hover { border-color: #94a3b8; }
        .tdc-view-btn { width: 32px; height: 32px; border: 1px solid #e2e8f0; background: #fff; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #94a3b8; cursor: pointer; transition: all 0.15s; }
        .tdc-view-btn.active { background: #eef2ff; color: #6366f1; border-color: #6366f1; }
        .tdc-view-btn:hover { border-color: #6366f1; color: #6366f1; }
        .tdc-search-wrap { position: relative; width: 100%; }
        .tdc-search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 12px; }
        .tdc-search-input { width: 100%; padding: 6px 10px 6px 30px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 12px; outline: none; background: #fff; }
        .tdc-search-input:focus { border-color: #6366f1; }
        .tdc-select { padding: 5px 10px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 11px; font-weight: 600; color: #64748b; background: #fff; outline: none; cursor: pointer; }
        .tdc-select:focus { border-color: #6366f1; }
        .tdc-status-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 6px; display: inline-flex; align-items: center; gap: 4px; }
        .tdc-status-approved { background: #f0fdf4; color: #10b981; }
        .tdc-status-under-review { background: #fffbeb; color: #f59e0b; }
        .tdc-status-draft { background: #f1f5f9; color: #64748b; }
        .tdc-status-rejected { background: #fef2f2; color: #ef4444; }
        .tdc-status-archived { background: #f8fafc; color: #94a3b8; }
        .tdc-grid-card { background: #fff; border: 1px solid #f1f5f9; border-radius: 12px; padding: 16px 12px; text-align: center; cursor: pointer; position: relative; transition: all 0.2s; }
        .tdc-grid-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); transform: translateY(-2px); border-color: #e2e8f0; }
        .tdc-grid-icon { font-size: 36px; margin-bottom: 8px; }
        .tdc-grid-ext { position: absolute; top: 8px; right: 8px; font-size: 8px; font-weight: 800; color: #fff; background: rgba(0,0,0,0.4); padding: 2px 5px; border-radius: 4px; }
        .tdc-grid-name { font-size: 11px; font-weight: 600; color: #0f172a; }
        .tdc-grid-meta { font-size: 10px; color: #94a3b8; }
        .tdc-grid-star { position: absolute; top: 8px; left: 8px; color: #f59e0b; font-size: 10px; }
        .tdc-grid-lock { position: absolute; top: 8px; left: 8px; color: #ef4444; font-size: 10px; }
        .tdc-list-row { display: flex; align-items: center; gap: 10px; padding: 8px 12px; background: #fff; border: 1px solid #f1f5f9; border-radius: 8px; cursor: pointer; transition: all 0.15s; }
        .tdc-list-row:hover { background: #f8fafc; border-color: #e2e8f0; }
        .tdc-list-icon { font-size: 16px; width: 28px; text-align: center; flex-shrink: 0; }
        .tdc-list-name { font-size: 12px; font-weight: 600; color: #0f172a; }
        .tdc-list-meta { font-size: 10px; color: #94a3b8; }
        .tdc-list-size { font-size: 10px; color: #94a3b8; flex-shrink: 0; }
        .tdc-table-wrap { border: 1px solid #f1f5f9; border-radius: 12px; overflow: hidden; }
        .tdc-table { width: 100%; border-collapse: collapse; font-size: 12px; }
        .tdc-table th { text-align: left; padding: 10px 12px; background: #f8fafc; color: #64748b; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.03em; border-bottom: 1px solid #f1f5f9; }
        .tdc-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; color: #0f172a; }
        .tdc-table tr:hover td { background: #f8fafc; }
        .tdc-icon-btn { border: none; background: transparent; color: #94a3b8; cursor: pointer; padding: 4px 8px; border-radius: 6px; }
        .tdc-icon-btn:hover { background: #f1f5f9; color: #0f172a; }
        .tdc-doc-viewer-panel { display: flex; flex-direction: column; flex: 1; min-height: 0; }
        .tdc-viewer-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; border-bottom: 1px solid #f1f5f9; gap: 12px; flex-shrink: 0; }
        .tdc-viewer-tabs { display: flex; gap: 0; border-bottom: 1px solid #f1f5f9; padding: 0 16px; flex-shrink: 0; }
        .tdc-viewer-tab { padding: 8px 14px; border: none; background: transparent; font-size: 11px; font-weight: 600; color: #94a3b8; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.15s; }
        .tdc-viewer-tab:hover { color: #0f172a; }
        .tdc-viewer-tab.active { color: #6366f1; border-bottom-color: #6366f1; }
        .tdc-viewer-content { flex: 1; overflow: auto; min-height: 0; }
        .tdc-word-toolbar, .tdc-sheet-toolbar, .tdc-pdf-toolbar, .tdc-img-toolbar, .tdc-text-toolbar, .tdc-slide-toolbar { display: flex; align-items: center; gap: 2px; padding: 6px 12px; border-bottom: 1px solid #e2e8f0; background: #fafbfc; flex-shrink: 0; flex-wrap: wrap; }
        .tdc-tb-btn { width: 28px; height: 28px; border: none; background: transparent; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #64748b; cursor: pointer; font-size: 11px; }
        .tdc-tb-btn:hover { background: #f1f5f9; color: #0f172a; }
        .tdc-tb-btn.active { background: #eef2ff; color: #6366f1; }
        .tdc-tb-divider { width: 1px; height: 20px; background: #e2e8f0; margin: 0 4px; }
        .tdc-zoom-label { font-size: 11px; font-weight: 600; color: #64748b; min-width: 35px; text-align: center; }
        .tdc-word-canvas { padding: 24px; background: #f1f5f9; display: flex; justify-content: center; min-height: 400px; }
        .tdc-word-page { background: #fff; width: 700px; max-width: 100%; padding: 40px 48px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); border-radius: 2px; }
        .tdc-word-header { display: flex; justify-content: space-between; margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1px solid #e2e8f0; }
        .tdc-word-title { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
        .tdc-word-meta { font-size: 11px; color: #64748b; margin-bottom: 16px; }
        .tdc-word-divider { height: 1px; background: #e2e8f0; margin: 16px 0; }
        .tdc-slide-toolbar { border-bottom: 1px solid #334155 !important; background: #1e293b !important; }
        .tdc-slide-toolbar .tdc-tb-btn { color: #94a3b8; }
        .tdc-slide-toolbar .tdc-tb-btn:hover { color: #f1f5f9; background: rgba(255,255,255,0.1); }
        .tdc-slide-canvas { flex: 1; display: flex; align-items: center; justify-content: center; padding: 32px; min-height: 400px; transition: background 0.3s; }
        .tdc-slide-page { width: 780px; max-width: 100%; text-align: center; position: relative; padding: 60px 48px; }
        .tdc-slide-number { position: absolute; top: 16px; right: 16px; font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.5); }
        .tdc-slide-title { font-size: 36px; font-weight: 800; margin-bottom: 8px; line-height: 1.2; }
        .tdc-slide-subtitle { font-size: 14px; opacity: 0.7; margin-bottom: 24px; }
        .tdc-slide-navbar { display: flex; align-items: center; justify-content: center; gap: 4px; padding: 8px 16px; background: #1e293b; border-top: 1px solid #334155; flex-shrink: 0; }
        .tdc-slide-navbar .tdc-tb-btn { color: #94a3b8; }
        .tdc-slide-navbar .tdc-tb-btn:hover { color: #f1f5f9; background: rgba(255,255,255,0.1); }
        .tdc-slide-dot { width: 8px; height: 8px; border-radius: 50%; background: #475569; cursor: pointer; transition: all 0.2s; }
        .tdc-slide-dot.active { background: #6366f1; width: 24px; border-radius: 4px; }
        .tdc-word-page h2 { font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 16px; margin-bottom: 8px; }
        .tdc-word-page h3 { font-size: 14px; font-weight: 700; color: #0f172a; margin-top: 12px; margin-bottom: 6px; }
        .tdc-word-page p { font-size: 12px; color: #334155; line-height: 1.7; margin-bottom: 8px; }
        .tdc-sheet-container { flex: 1; overflow: auto; }
        .tdc-sheet-bar { padding: 4px 12px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 11px; display: flex; align-items: center; }
        .tdc-sheet-formula { font-family: 'Consolas', 'Courier New', monospace; color: #0f172a; font-size: 12px; }
        .tdc-sheet-grid { display: flex; flex-direction: column; }
        .tdc-sheet-row { display: flex; }
        .tdc-sheet-corner { width: 40px; min-width: 40px; height: 28px; background: #f1f5f9; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; }
        .tdc-sheet-header { width: 100px; min-width: 100px; height: 28px; background: #f1f5f9; display: flex; align-items: center; padding: 0 8px; font-size: 10px; font-weight: 700; color: #64748b; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; }
        .tdc-sheet-cell { width: 100px; min-width: 100px; height: 28px; display: flex; align-items: center; padding: 0 8px; font-size: 11px; color: #0f172a; border-right: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9; }
        .tdc-sheet-cell-bold { font-weight: 700; background: #f8fafc; }
        .tdc-sheet-cell-total { font-weight: 800; background: #fffbeb; color: #f59e0b; }
        .tdc-sheet-tabs { display: flex; gap: 0; border-top: 1px solid #e2e8f0; background: #f8fafc; padding: 0 8px; flex-shrink: 0; }
        .tdc-sheet-tab { padding: 6px 16px; border: none; background: transparent; font-size: 11px; font-weight: 600; color: #64748b; cursor: pointer; border-top: 2px solid transparent; }
        .tdc-sheet-tab.active { color: #6366f1; border-top-color: #6366f1; background: #fff; }
        .tdc-pdf-canvas { padding: 24px; background: #f1f5f9; display: flex; justify-content: center; min-height: 400px; }
        .tdc-pdf-page { background: #fff; width: 650px; max-width: 100%; padding: 32px 40px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
        .tdc-pdf-section { margin-bottom: 16px; }
        .tdc-pdf-section h4 { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
        .tdc-pdf-section p { font-size: 11px; color: #475569; line-height: 1.6; }
        .tdc-img-canvas { flex: 1; display: flex; align-items: center; justify-content: center; padding: 24px; background: #1e1e2e; min-height: 300px; }
        .tdc-img-placeholder { text-align: center; color: #fff; }
        .tdc-img-icon { font-size: 64px; opacity: 0.3; margin-bottom: 16px; display: block; }
        .tdc-img-label { font-size: 16px; font-weight: 600; display: block; }
        .tdc-img-dims { font-size: 11px; color: rgba(255,255,255,0.5); margin-top: 4px; }
        .tdc-video-container { flex: 1; display: flex; flex-direction: column; min-height: 300px; }
        .tdc-video-player { flex: 1; background: #0f0f0f; display: flex; align-items: center; justify-content: center; position: relative; cursor: pointer; }
        .tdc-video-overlay { text-align: center; }
        .tdc-video-play-btn { width: 64px; height: 64px; border-radius: 50%; background: rgba(99,102,241,0.9); display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; color: #fff; font-size: 24px; padding-left: 4px; }
        .tdc-video-name { display: block; color: rgba(255,255,255,0.7); font-size: 13px; font-weight: 600; }
        .tdc-video-progress { position: absolute; bottom: 0; left: 0; right: 0; padding: 8px 16px; background: linear-gradient(transparent, rgba(0,0,0,0.7)); display: flex; align-items: center; gap: 12px; }
        .tdc-video-bar { flex: 1; height: 4px; background: rgba(255,255,255,0.2); border-radius: 4px; overflow: hidden; }
        .tdc-video-fill { height: 100%; background: #6366f1; border-radius: 4px; }
        .tdc-video-time { color: rgba(255,255,255,0.7); font-size: 11px; font-weight: 600; }
        .tdc-video-controls { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: #1a1a2e; }
        .tdc-vid-btn { width: 32px; height: 32px; border: none; background: transparent; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #e2e8f0; cursor: pointer; }
        .tdc-vid-btn:hover { background: rgba(255,255,255,0.1); }
        .tdc-vid-progress { flex: 1; }
        .tdc-vid-track { height: 4px; background: rgba(255,255,255,0.15); border-radius: 4px; overflow: hidden; }
        .tdc-vid-thumb { height: 100%; background: #6366f1; border-radius: 4px; }
        .tdc-code-viewer { background: #1e293b; color: #e2e8f0; padding: 20px; font-size: 12px; line-height: 1.6; overflow: auto; margin: 0; border-radius: 0; }
        .tdc-comment-item { display: flex; gap: 10px; padding: 8px; border-radius: 8px; background: #f8fafc; }
        .tdc-comment-avatar { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 10px; font-weight: 700; flex-shrink: 0; }
        .tdc-comment-input { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 10px; }
        .tdc-comment-avatar-sm { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 10px; font-weight: 700; flex-shrink: 0; }
        .tdc-comm-inp { flex: 1; border: none; outline: none; font-size: 12px; padding: 4px 0; }
        .tdc-send-comment { border: none; background: #6366f1; color: #fff; width: 28px; height: 28px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 11px; }
        .tdc-timeline { position: relative; padding-left: 20px; }
        .tdc-timeline::before { content: ''; position: absolute; left: 6px; top: 8px; bottom: 8px; width: 2px; background: #f1f5f9; }
        .tdc-timeline-item { position: relative; margin-bottom: 16px; }
        .tdc-timeline-dot { position: absolute; left: -16px; top: 4px; width: 10px; height: 10px; border-radius: 50%; border: 2px solid #fff; z-index: 1; }
        .tdc-timeline-content { padding: 8px 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9; }
        .tdc-approval-flow { display: flex; flex-direction: column; gap: 0; position: relative; }
        .tdc-approval-step { display: flex; align-items: flex-start; gap: 12px; position: relative; padding: 0 0 16px 0; }
        .tdc-approval-node { display: flex; flex-direction: column; align-items: center; min-width: 80px; }
        .tdc-approval-circle { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; margin-bottom: 4px; }
        .tdc-approval-circle.approved { background: #f0fdf4; color: #10b981; }
        .tdc-approval-circle.pending { background: #fffbeb; color: #f59e0b; }
        .tdc-approval-circle.inactive { background: #f1f5f9; color: #cbd5e1; }
        .tdc-approval-level { font-size: 9px; font-weight: 700; color: #64748b; text-transform: uppercase; }
        .tdc-approval-detail { flex: 1; padding: 6px 10px; background: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9; }
        .tdc-approval-line { position: absolute; left: 40px; top: 32px; bottom: 0; width: 2px; background: #f1f5f9; }
        .tdc-detail-item { display: flex; flex-direction: column; padding: 10px 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #f1f5f9; }
        .tdc-detail-label { font-size: 9px; text-transform: uppercase; color: #94a3b8; font-weight: 700; letter-spacing: 0.02em; }
        .tdc-detail-value { font-size: 13px; font-weight: 700; color: #0f172a; }
        .tdc-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15,23,42,0.5); z-index: 1060; display: flex; align-items: center; justify-content: center; }
        .tdc-modal { background: #fff; border-radius: 16px; width: 540px; max-width: 90vw; max-height: 80vh; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
        .tdc-modal-sm { width: 420px; }
        .tdc-modal-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #f1f5f9; }
        .tdc-modal-body { padding: 20px; overflow-y: auto; max-height: 50vh; }
        .tdc-modal-footer { display: flex; justify-content: flex-end; gap: 8px; padding: 12px 20px; border-top: 1px solid #f1f5f9; }
        .tdc-dropzone { border: 2px dashed #e2e8f0; border-radius: 12px; padding: 32px; text-align: center; cursor: pointer; transition: all 0.2s; }
        .tdc-dropzone:hover { border-color: #6366f1; background: #fafbff; }
        .tdc-drop-icon { font-size: 36px; color: #6366f1; opacity: 0.6; margin-bottom: 12px; }
        .tdc-form-label { display: block; font-size: 11px; font-weight: 700; color: #64748b; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.02em; }
        .tdc-page-nav { font-size: 11px; font-weight: 600; color: #64748b; }
        .fade-in { animation: tdcFadeIn 0.2s ease; }
        @keyframes tdcFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default TaskDocumentCenter;
