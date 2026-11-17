import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../../hooks/useApp';
import { useTranslation } from '../../../hooks/useTranslation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBuilding, 
  faUsers, 
  faChartLine, 
  faPlus, 
  faFileExport, 
  faSitemap, 
  faThLarge, 
  faTable, 
  faChartPie,
  faSearch,
  faFilter,
  faRobot,
  faLightbulb,
  faNetworkWired,
  faCubes,
  faBuildingColumns,
  faTrash,
  faPen,
  faSpinner,
  faExclamationTriangle,
  faMapMarkerAlt,
  faDollarSign,
  faIdBadge,
  faUserTie,
  faToggleOn,
  faToggleOff,
  faChevronRight,
  faArrowUp,
  faArrowDown
} from "@fortawesome/free-solid-svg-icons";
import { 
  Bar, 
  Doughnut, 
  Radar 
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { listDepartments, createDepartment, updateDepartment, deleteDepartment } from '../../../api/hrms';
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DEPARTMENT_COLORS = [
  '#3b82f6', '#ec4899', '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4',
  '#6366f1', '#ef4444', '#14b8a6', '#f97316', '#84cc16', '#0ea5e9',
];

const DepartmentManagement = () => {
  const { t } = useTranslation();
  const { theme } = useApp(); const isDark = theme === 'dark';
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchFilter] = useState('');
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formHead, setFormHead] = useState('');
  const [formBudget, setFormBudget] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formStatus, setFormStatus] = useState('active');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [editName, setEditName] = useState('');
  const [editCode, setEditCode] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editHead, setEditHead] = useState('');
  const [editBudget, setEditBudget] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editStatus, setEditStatus] = useState('active');

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listDepartments();
      setDepartments(data);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetForm = () => {
    setFormName('');
    setFormCode('');
    setFormDesc('');
    setFormHead('');
    setFormBudget('');
    setFormLocation('');
    setFormStatus('active');
    setSubmitError(null);
  };

  const resetEditForm = () => {
    setEditName('');
    setEditCode('');
    setEditDesc('');
    setEditHead('');
    setEditBudget('');
    setEditLocation('');
    setEditStatus('active');
    setEditingDept(null);
    setSubmitError(null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formName.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await createDepartment({
        name: formName.trim(),
        code: formCode.trim() || null,
        description: formDesc.trim() || null,
        head_of_department: formHead.trim() || null,
        budget: formBudget ? parseFloat(formBudget) : null,
        location: formLocation.trim() || null,
        status: formStatus,
      });
      setShowCreateModal(false);
      resetForm();
      await fetchData();
    } catch (err) {
      setSubmitError(err.message || 'Failed to create department');
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setEditName(dept.name || '');
    setEditCode(dept.code || '');
    setEditDesc(dept.description || '');
    setEditHead(dept.head_of_department || '');
    setEditBudget(dept.budget != null ? String(dept.budget) : '');
    setEditLocation(dept.location || '');
    setEditStatus(dept.status || 'active');
    setSubmitError(null);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingDept || !editName.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await updateDepartment(editingDept.id, {
        name: editName.trim(),
        code: editCode.trim() || null,
        description: editDesc.trim() || null,
        head_of_department: editHead.trim() || null,
        budget: editBudget ? parseFloat(editBudget) : null,
        location: editLocation.trim() || null,
        status: editStatus,
      });
      setShowEditModal(false);
      resetEditForm();
      await fetchData();
    } catch (err) {
      setSubmitError(err.message || 'Failed to update department');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDepartment(deleteTarget.id);
      setDeleteTarget(null);
      await fetchData();
    } catch (err) {
      setSubmitError(err.message || 'Failed to delete department');
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Department Name', 'Code', 'Description', 'Head of Department', 'Budget', 'Location', 'Status', 'Designations'];
    const rows = departments.map(d => [
      d.name,
      d.code || '',
      d.description || '',
      d.head_of_department || '',
      d.budget != null ? d.budget : '',
      d.location || '',
      d.status || 'active',
      d.designations ? d.designations.length : 0,
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `departments_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const filteredDepartments = departments.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.code && d.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (d.head_of_department && d.head_of_department.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (d.location && d.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getColor = (idx) => DEPARTMENT_COLORS[idx % DEPARTMENT_COLORS.length];

  const totalDepartments = departments.length;
  const totalDesignations = departments.reduce((sum, d) => sum + (d.designations ? d.designations.length : 0), 0);
  const totalBudget = departments.reduce((sum, d) => sum + (parseFloat(d.budget) || 0), 0);
  const activeDepartments = departments.filter(d => d.status !== 'inactive').length;

  const MetricCard = ({ stat }) => (
    <div className="col-xl-3 col-md-6 mb-4">
      <div className={`card border-0 shadow-sm rounded-4 overflow-hidden h-100 hover-lift ${isDark ? 'bg-dark-card' : ''}`}>
        <div className="card-body p-4">
          <div className="d-flex align-items-center mb-3">
            <div 
              className="rounded-4 p-3 d-flex align-items-center justify-content-center me-3" 
              style={{ backgroundColor: `${stat.color}1a`, color: stat.color, width: '50px', height: '50px' }}
            >
              <FontAwesomeIcon icon={stat.icon} />
            </div>
            <div>
              <p className="text-muted small mb-0 fw-medium">{stat.label}</p>
              <h4 className="fw-bold mb-0">{stat.value}</h4>
            </div>
          </div>
          {stat.subValue && <p className="text-muted small mb-0">{stat.subValue}</p>}
        </div>
      </div>
    </div>
  );

  const DepartmentCard = ({ dept, color }) => (
    <div className="col-xl-4 col-md-6 mb-4">
      <div className={`card border-0 shadow-sm rounded-4 h-100 hover-lift overflow-hidden department-card ${isDark ? 'bg-dark-card' : ''}`}>
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div className="d-flex align-items-center">
              <div 
                className="rounded-4 d-flex align-items-center justify-content-center me-3" 
                style={{ backgroundColor: `${color}1a`, color: color, width: '56px', height: '56px', fontSize: '24px' }}
              >
                <FontAwesomeIcon icon={faBuilding} />
              </div>
              <div>
                <h5 className="fw-bold mb-0">{dept.name}</h5>
                {dept.code && <span className={`badge ${isDark ? 'bg-dark text-light' : 'bg-light text-muted'} rounded-pill mt-1`}>{dept.code}</span>}
              </div>
            </div>
            <div className="d-flex gap-1">
              <button
                className="btn btn-light btn-sm rounded-circle p-0 text-primary"
                style={{ width: '32px', height: '32px' }}
                onClick={() => openEditModal(dept)}
                title="Edit department"
              >
                <FontAwesomeIcon icon={faPen} size="xs" />
              </button>
              <button
                className="btn btn-light btn-sm rounded-circle p-0 text-danger"
                style={{ width: '32px', height: '32px' }}
                onClick={() => setDeleteTarget(dept)}
                title="Delete department"
              >
                <FontAwesomeIcon icon={faTrash} size="xs" />
              </button>
            </div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-6">
              <div className={`p-3 ${isDark ? 'bg-dark' : 'bg-light'} rounded-3`}>
                <p className="text-muted small mb-1">Designations</p>
                <p className="fw-bold mb-0">{dept.designations ? dept.designations.length : 0}</p>
              </div>
            </div>
            <div className="col-6">
              <div className={`p-3 ${isDark ? 'bg-dark' : 'bg-light'} rounded-3`}>
                <p className="text-muted small mb-1">Head</p>
                <p className="fw-bold small mb-0">{dept.head_of_department || '—'}</p>
              </div>
            </div>
            <div className="col-6">
              <div className={`p-3 ${isDark ? 'bg-dark' : 'bg-light'} rounded-3`}>
                <p className="text-muted small mb-1">Budget</p>
                <p className="fw-bold small mb-0">{dept.budget ? `$${parseFloat(dept.budget).toLocaleString()}` : '—'}</p>
              </div>
            </div>
            <div className="col-6">
              <div className={`p-3 ${isDark ? 'bg-dark' : 'bg-light'} rounded-3`}>
                <p className="text-muted small mb-1">Location</p>
                <p className="fw-bold small mb-0">{dept.location || '—'}</p>
              </div>
            </div>
          </div>

          <div className="d-flex align-items-center justify-content-between">
            <span className={`badge rounded-pill px-3 py-2 ${dept.status === 'inactive' ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'}`}>
              <FontAwesomeIcon icon={dept.status === 'inactive' ? faToggleOff : faToggleOn} className="me-1" />
              {dept.status === 'inactive' ? 'Inactive' : 'Active'}
            </span>
            <span className="text-muted small">{dept.designations ? dept.designations.length : 0} roles</span>
          </div>
        </div>
      </div>
    </div>
  );

  const AnalyticsDashboard = () => {
    const deptNames = departments.map(d => d.name);
    const deptDesignationCounts = departments.map(d => (d.designations ? d.designations.length : 0));
    const deptBudgets = departments.map(d => parseFloat(d.budget) || 0);

    const radarData = {
        labels: [
            t('productivity'), 
            t('resource_utilization'), 
            t('attendance_rate'), 
            t('task_completion_rate'), 
            t('employee_satisfaction'), 
            t('project_delivery_score')
        ],
        datasets: [
            {
                label: 'Engineering',
                data: [94, 91, 88, 95, 82, 94],
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: '#3b82f6',
                borderWidth: 2,
                pointBackgroundColor: '#3b82f6',
            },
            {
                label: 'Marketing',
                data: [82, 85, 92, 80, 88, 85],
                backgroundColor: 'rgba(236, 72, 153, 0.2)',
                borderColor: '#ec4899',
                borderWidth: 2,
                pointBackgroundColor: '#ec4899',
            },
        ],
    };

    const barData = {
        labels: deptNames.length ? deptNames : ['No Data'],
        datasets: [
            {
                label: 'Designations',
                data: deptDesignationCounts.length ? deptDesignationCounts : [0],
                backgroundColor: departments.map((_, i) => getColor(i)),
                borderRadius: 8,
            }
        ]
    };

    const budgetBarData = {
        labels: deptNames.length ? deptNames : ['No Data'],
        datasets: [
            {
                label: 'Budget ($)',
                data: deptBudgets.length ? deptBudgets : [0],
                backgroundColor: departments.map((_, i) => getColor(i)),
                borderRadius: 8,
            }
        ]
    };

    const hasBudgets = deptBudgets.some(b => b > 0);

    return (
        <div className="fade-in">
            <div className="row">
                <div className="col-xl-6 mb-4">
                    <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark-card' : ''}`}>
                        <div className={`card-header border-0 p-4 ${isDark ? 'bg-dark border-secondary' : 'bg-transparent'}`}>
                            <h6 className={`fw-bold mb-0 ${isDark ? 'text-light' : ''}`}>{t('performance_score')} Comparison</h6>
                        </div>
                        <div className="card-body p-4 d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
                            <Radar data={radarData} options={{ maintainAspectRatio: false, scales: { r: { beginAtZero: true, max: 100 } } }} />
                        </div>
                    </div>
                </div>
                <div className="col-xl-6 mb-4">
                    <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark-card' : ''}`}>
                        <div className={`card-header border-0 p-4 ${isDark ? 'bg-dark border-secondary' : 'bg-transparent'}`}>
                            <h6 className={`fw-bold mb-0 ${isDark ? 'text-light' : ''}`}>Designations per Department</h6>
                        </div>
                        <div className="card-body p-4 d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
                            <Bar data={barData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                </div>
            </div>

            {hasBudgets && (
              <div className="row">
                <div className="col-12 mb-4">
                  <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-card' : ''}`}>
                    <div className={`card-header border-0 p-4 ${isDark ? 'bg-dark border-secondary' : 'bg-transparent'}`}>
                      <h6 className={`fw-bold mb-0 ${isDark ? 'text-light' : ''}`}>Budget by Department</h6>
                    </div>
                    <div className="card-body p-4 d-flex align-items-center justify-content-center" style={{ minHeight: '300px' }}>
                      <Bar data={budgetBarData} options={{ maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="row">
                <div className="col-12">
                   <div className="card border-0 shadow-sm rounded-4 p-4 mb-4" style={{ backgroundColor: '#1e293b' }}>
                      <div className="d-flex align-items-center gap-3 mb-4">
                         <div className="bg-primary bg-opacity-20 rounded-circle p-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                            <FontAwesomeIcon icon={faRobot} className="text-primary fs-3" />
                         </div>
                         <div>
                            <h5 className="text-white fw-bold mb-1">{t('ai_workforce_insights')}</h5>
                            <p className="text-light text-opacity-75 small mb-0">Powered by ManageCore Intelligence</p>
                         </div>
                      </div>
                      <div className="row g-3">
                         <div className="col-md-4">
                            <div className="p-4 rounded-4" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                               <FontAwesomeIcon icon={faLightbulb} className="text-warning mb-3 fs-4" />
                               <h6 className="text-white fw-bold">Retention Alert</h6>
                               <p className="text-light text-opacity-50 small mb-0">High workload may lead to increased churn within 3 months.</p>
                            </div>
                         </div>
                         <div className="col-md-4">
                            <div className="p-4 rounded-4" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                               <FontAwesomeIcon icon={faChartLine} className="text-success mb-3 fs-4" />
                               <h6 className="text-white fw-bold">Optimization Success</h6>
                               <p className="text-light text-opacity-50 small mb-0">New resource allocation improved output by 22% this quarter.</p>
                            </div>
                         </div>
                         <div className="col-md-4">
                            <div className="p-4 rounded-4" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                               <FontAwesomeIcon icon={faNetworkWired} className="text-info mb-3 fs-4" />
                               <h6 className="text-white fw-bold">Cross-Dept Insight</h6>
                               <p className="text-light text-opacity-50 small mb-0">Bottleneck identified in cross-department handovers.</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
            </div>
        </div>
    );
  };

  const OrganizationChart = () => {
    return (
        <div className="fade-in py-5 text-center">
            <div className="org-node mx-auto mb-5">
                <div className="card border-0 shadow-sm rounded-4 p-4 d-inline-block" style={{ minWidth: '250px', borderTop: '4px solid #334155' }}>
                    <div className={`rounded-circle overflow-hidden mx-auto mb-3 ${isDark ? 'bg-dark' : 'bg-light'} d-flex align-items-center justify-content-center`} style={{ width: '64px', height: '64px' }}>
                        <FontAwesomeIcon icon={faUsers} className="text-secondary fs-3" />
                    </div>
                    <h6 className="fw-bold mb-1">CEO & Founder</h6>
                    <p className="text-muted small mb-0">Executive Office</p>
                </div>
                <div className="org-connector-v"></div>
            </div>

            <div className="d-flex justify-content-center gap-5 position-relative">
                <div className="org-connector-h"></div>
                
                {departments.slice(0, 5).map((dept, idx) => (
                  <div key={dept.id} className="org-branch">
                      <div className="org-connector-v-short"></div>
                      <div className="card border-0 shadow-sm rounded-4 p-4 d-inline-block" style={{ minWidth: '180px', borderTop: `4px solid ${getColor(idx)}` }}>
                          <h6 className="fw-bold mb-1">{dept.name}</h6>
                          <span className={`badge ${isDark ? 'bg-dark text-light' : 'bg-light text-muted'} rounded-pill mt-2`}>{dept.designations ? dept.designations.length : 0} Roles</span>
                      </div>
                  </div>
                ))}
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .org-node { position: relative; }
                .org-connector-v { width: 2px; height: 50px; background-color: #cbd5e1; margin: 0 auto; }
                .org-connector-v-short { width: 2px; height: 30px; background-color: #cbd5e1; margin: 0 auto; }
                .org-connector-h { 
                    position: absolute; 
                    top: 0; 
                    left: 10%; 
                    right: 10%; 
                    height: 2px; 
                    background-color: #cbd5e1; 
                }
                .org-branch { position: relative; }
            `}} />
        </div>
    );
  };

  const stats = [
    { label: t('total_departments'), value: String(totalDepartments), icon: faBuilding, color: '#3b82f6', subValue: `${activeDepartments} Active` },
    { label: 'Total Roles', value: String(totalDesignations), icon: faIdBadge, color: '#8b5cf6', subValue: `Across ${totalDepartments} depts` },
    { label: 'Avg Roles/Dept', value: totalDepartments ? String((totalDesignations / totalDepartments).toFixed(1)) : '0', icon: faCubes, color: '#f59e0b', subValue: 'Distribution' },
    { label: 'Total Budget', value: totalBudget ? `$${totalBudget.toLocaleString()}` : '—', icon: faChartLine, color: '#10b981', subValue: `${departments.filter(d => parseFloat(d.budget) > 0).length} depts with budget` },
  ];

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="fs-1 text-primary mb-3" />
          <p className="text-muted">Loading departments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <FontAwesomeIcon icon={faExclamationTriangle} className="fs-1 text-danger mb-3" />
          <p className="text-danger fw-bold mb-1">Failed to load data</p>
          <p className="text-muted small mb-3">{error}</p>
          <button className="btn btn-primary rounded-3 px-4" onClick={fetchData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`department-mgmt-page ${isDark ? 'dark-mode' : ''}`} style={{ backgroundColor: isDark ? 'transparent' : '#F8FAFC', minHeight: '100vh' }}>
      <div className="container-fluid py-4 px-lg-5">
        
        {/* Header Section */}
        <div className="row align-items-center mb-5">
            <div className="col-lg-6">
                <h2 className={`fw-bold ${isDark ? 'text-light' : 'text-dark'} mb-1`}>{t('departments')}</h2>
                <p className="text-muted mb-0">{t('dept_mgmt_desc_long')}</p>
            </div>
            <div className="col-lg-6 mt-3 mt-lg-0 text-lg-end">
                <div className="d-flex flex-wrap justify-content-lg-end gap-2">
                    <button className={`btn ${isDark ? 'btn-outline-secondary' : 'btn-white'} border shadow-sm rounded-3 px-4 fw-bold transition hover-lift`} onClick={handleExportCSV}>
                        <FontAwesomeIcon icon={faFileExport} className="me-2 text-primary" />
                        {t('export_data')}
                    </button>
                    <button
                      className="btn btn-primary shadow-sm rounded-3 px-4 fw-bold transition hover-lift"
                      onClick={() => { resetForm(); setShowCreateModal(true); }}
                    >
                        <FontAwesomeIcon icon={faPlus} className="me-2" />
                        {t('create_department')}
                    </button>
                </div>
            </div>
        </div>

        {/* KPI Overview Section */}
        <div className="row mb-2">
            {stats.map((stat, idx) => <MetricCard key={idx} stat={stat} />)}
        </div>

        {/* View Controls & Search */}
        <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-card' : ''}`}>
            <div className="card-body p-3">
                <div className="row align-items-center">
                    <div className="col-md-4 mb-3 mb-md-0">
                        <div className={`input-group ${isDark ? 'bg-dark' : 'bg-light'} rounded-3 px-2 border-0`}>
                            <span className="input-group-text bg-transparent border-0 text-muted">
                                <FontAwesomeIcon icon={faSearch} />
                            </span>
                            <input 
                                type="text" 
                                className="form-control bg-transparent border-0 small py-2" 
                                placeholder="Search by name, code, head or location..." 
                                value={searchTerm}
                                onChange={(e) => setSearchFilter(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="d-flex flex-wrap align-items-center justify-content-md-end gap-2">
                            <div className={`btn-group rounded-3 overflow-hidden ${isDark ? 'border-secondary' : 'border'}`}>
                                <button 
                                    className={`btn px-3 border-0 transition ${viewMode === 'grid' ? 'btn-primary' : (isDark ? 'btn-outline-secondary' : 'btn-white')}`}
                                    onClick={() => setViewMode('grid')}
                                    title={t('grid_view')}
                                >
                                    <FontAwesomeIcon icon={faThLarge} />
                                </button>
                                <button 
                                    className={`btn px-3 border-0 transition ${viewMode === 'card' ? 'btn-primary' : (isDark ? 'btn-outline-secondary' : 'btn-white')}`}
                                    onClick={() => setViewMode('card')}
                                    title="Card view"
                                >
                                    <FontAwesomeIcon icon={faBuilding} />
                                </button>
                                <button 
                                    className={`btn px-3 border-0 transition ${viewMode === 'table' ? 'btn-primary' : (isDark ? 'btn-outline-secondary' : 'btn-white')}`}
                                    onClick={() => setViewMode('table')}
                                    title={t('table_view')}
                                >
                                    <FontAwesomeIcon icon={faTable} />
                                </button>
                                <button 
                                    className={`btn px-3 border-0 transition ${viewMode === 'org' ? 'btn-primary' : (isDark ? 'btn-outline-secondary' : 'btn-white')}`}
                                    onClick={() => setViewMode('org')}
                                    title={t('org_chart')}
                                >
                                    <FontAwesomeIcon icon={faSitemap} />
                                </button>
                                <button 
                                    className={`btn px-3 border-0 transition ${viewMode === 'analytics' ? 'btn-primary' : (isDark ? 'btn-outline-secondary' : 'btn-white')}`}
                                    onClick={() => setViewMode('analytics')}
                                    title={t('analytics_view')}
                                >
                                    <FontAwesomeIcon icon={faChartPie} />
                                </button>
                            </div>
                            <button className={`btn ${isDark ? 'btn-outline-secondary' : 'btn-white'} border px-3 rounded-3 transition`}>
                                <FontAwesomeIcon icon={faFilter} className="me-2 text-muted" />
                                Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Content Section */}
        {viewMode === 'grid' && (
            <div className="row fade-in">
                {filteredDepartments.length === 0 ? (
                  <div className="col-12 text-center py-5 text-muted">
                    {searchTerm ? 'No departments match your search.' : 'No departments yet. Click "Create Department" to add one.'}
                  </div>
                ) : (
                  filteredDepartments.map((dept, idx) => <DepartmentCard key={dept.id} dept={dept} color={getColor(idx)} />)
                )}
            </div>
        )}

        {viewMode === 'card' && (
            <div className="row g-4 fade-in">
                {filteredDepartments.length === 0 ? (
                  <div className="col-12 text-center py-5 text-muted">
                    {searchTerm ? 'No departments match your search.' : 'No departments yet.'}
                  </div>
                ) : (
                  filteredDepartments.map((dept, idx) => (
                    <div key={dept.id} className="col-xl-4 col-md-6">
                        <div className={`card border-0 shadow-sm rounded-4 h-100 hover-lift overflow-hidden ${isDark ? 'bg-dark-card' : ''}`}>
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between mb-4">
                                    <div className="rounded-3 p-3 text-white shadow-sm" style={{ backgroundColor: getColor(idx) }}>
                                        <FontAwesomeIcon icon={faBuilding} className="fs-4" />
                                    </div>
                                    <span className={`badge rounded-pill px-3 d-flex align-items-center ${dept.status === 'inactive' ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'}`}>
                                        {dept.status === 'inactive' ? 'Inactive' : 'Active'}
                                    </span>
                                </div>
                                <h5 className="fw-bold mb-1">{dept.name}</h5>
                                {dept.code && <span className={`badge ${isDark ? 'bg-dark text-light' : 'bg-light text-muted'} rounded-pill mb-3`}>{dept.code}</span>}
                                
                                <div className="row g-3 py-3 border-top border-bottom mb-4">
                                    <div className="col-6">
                                        <p className="text-muted small mb-1">Head</p>
                                        <p className="fw-bold small mb-0">{dept.head_of_department || '—'}</p>
                                    </div>
                                    <div className="col-6">
                                        <p className="text-muted small mb-1">Budget</p>
                                        <p className="fw-bold small mb-0">{dept.budget ? `$${parseFloat(dept.budget).toLocaleString()}` : '—'}</p>
                                    </div>
                                    <div className="col-6">
                                        <p className="text-muted small mb-1">Location</p>
                                        <p className="fw-bold small mb-0">{dept.location || '—'}</p>
                                    </div>
                                    <div className="col-6">
                                        <p className="text-muted small mb-1">Designations</p>
                                        <p className="fw-bold small mb-0">{dept.designations ? dept.designations.length : 0}</p>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex gap-2">
                                      <button
                                        className="btn p-0 text-primary fw-bold small d-flex align-items-center gap-1"
                                        onClick={() => openEditModal(dept)}
                                      >
                                        <FontAwesomeIcon icon={faPen} /> Edit
                                      </button>
                                      <button
                                        className="btn p-0 text-danger fw-bold small d-flex align-items-center gap-1"
                                        onClick={() => setDeleteTarget(dept)}
                                      >
                                        <FontAwesomeIcon icon={faTrash} /> Delete
                                      </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                  ))
                )}
            </div>
        )}

        {viewMode === 'table' && (
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden fade-in">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className={`${isDark ? 'bg-dark-header' : 'bg-light'}`}>
                            <tr>
                                <th className="ps-4 py-3 border-0">{t('dept_name')}</th>
                                <th className="py-3 border-0">Code</th>
                                <th className="py-3 border-0 text-center">Designations</th>
                                <th className="py-3 border-0">Head</th>
                                <th className="py-3 border-0">Budget</th>
                                <th className="py-3 border-0">Location</th>
                                <th className="py-3 border-0 text-center">Status</th>
                                <th className="pe-4 py-3 border-0 text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDepartments.length === 0 ? (
                              <tr>
                                <td colSpan="8" className="text-center py-5 text-muted">
                                  {searchTerm ? 'No departments match your search.' : 'No departments yet.'}
                                </td>
                              </tr>
                            ) : (
                              filteredDepartments.map((dept, idx) => (
                                <tr key={dept.id}>
                                    <td className="ps-4 py-3">
                                        <div className="d-flex align-items-center">
                                            <div 
                                                className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                                                style={{ backgroundColor: `${getColor(idx)}1a`, color: getColor(idx), width: '40px', height: '40px' }}
                                            >
                                                <FontAwesomeIcon icon={faBuilding} />
                                            </div>
                                            <span className="fw-bold">{dept.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                      <span className={`badge ${isDark ? 'bg-dark text-light border-secondary' : 'bg-light text-muted border'} rounded-pill`}>{dept.code || '—'}</span>
                                    </td>
                                    <td className="py-3 text-center">{dept.designations ? dept.designations.length : 0}</td>
                                    <td className="py-3">
                                      <span className="small fw-medium text-muted">
                                        <FontAwesomeIcon icon={faUserTie} className="me-2 opacity-50" />
                                        {dept.head_of_department || '—'}
                                      </span>
                                    </td>
                                    <td className="py-3">
                                      <span className="small fw-medium text-muted">
                                        <FontAwesomeIcon icon={faDollarSign} className="me-1 opacity-50" />
                                        {dept.budget ? `$${parseFloat(dept.budget).toLocaleString()}` : '—'}
                                      </span>
                                    </td>
                                    <td className="py-3">
                                      <span className="small fw-medium text-muted">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="me-1 opacity-50" />
                                        {dept.location || '—'}
                                      </span>
                                    </td>
                                    <td className="py-3 text-center">
                                      <span className={`badge rounded-pill ${dept.status === 'inactive' ? 'bg-danger-subtle text-danger' : 'bg-success-subtle text-success'}`}>
                                        {dept.status === 'inactive' ? 'Inactive' : 'Active'}
                                      </span>
                                    </td>
                                    <td className="pe-4 py-3 text-end">
                                        <div className="d-flex gap-1 justify-content-end">
                                          <button
                                            className={`btn btn-sm rounded-circle p-0 text-primary ${isDark ? 'btn-outline-secondary' : 'btn-light'}`}
                                            style={{ width: '32px', height: '32px' }}
                                            onClick={() => openEditModal(dept)}
                                            title="Edit department"
                                          >
                                            <FontAwesomeIcon icon={faPen} size="xs" />
                                          </button>
                                          <button
                                            className={`btn btn-sm rounded-circle p-0 text-danger ${isDark ? 'btn-outline-secondary' : 'btn-light'}`}
                                            style={{ width: '32px', height: '32px' }}
                                            onClick={() => setDeleteTarget(dept)}
                                            title="Delete department"
                                          >
                                            <FontAwesomeIcon icon={faTrash} size="xs" />
                                          </button>
                                        </div>
                                    </td>
                                </tr>
                              ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {viewMode === 'org' && <OrganizationChart />}
        
        {viewMode === 'analytics' && <AnalyticsDashboard />}

        {/* Advanced Features Navigation (Footer Cards) */}
        <div className="row mt-5">
           <div className="col-12">
               <h5 className="fw-bold mb-4">Advanced Management</h5>
           </div>
           {[
               { title: t('capacity_planning'), icon: faUsers, color: '#6366f1', desc: 'Predict resource needs' },
               { title: t('workload_analysis'), icon: faChartLine, color: '#f43f5e', desc: 'Monitor task distribution' },
               { title: t('budget_forecasting'), icon: faBuildingColumns, color: '#22c55e', desc: 'Fiscal year projections' },
               { title: t('dept_benchmarking'), icon: faChartPie, color: '#0ea5e9', desc: 'Compare internal KPIs' },
           ].map((item, idx) => (
               <div key={idx} className="col-xl-3 col-md-6 mb-4">
                   <div className={`card border-0 shadow-sm rounded-4 h-100 transition hover-lift cursor-pointer p-4 ${isDark ? 'bg-dark-card' : 'bg-white'}`}>
                       <div className="d-flex align-items-center gap-3">
                           <div className="rounded-3 p-3 text-white" style={{ backgroundColor: item.color }}>
                               <FontAwesomeIcon icon={item.icon} />
                           </div>
                           <div>
                               <h6 className="fw-bold mb-1">{item.title}</h6>
                               <p className="text-muted small mb-0">{item.desc}</p>
                           </div>
                       </div>
                   </div>
               </div>
           ))}
        </div>

      </div>

      {/* Create Department Modal */}
<DialogBox 
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        title={t('create_department')}
        size="large"
      >
        <form onSubmit={handleCreate}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="x-small fw-bold text-muted text-uppercase mb-1">Department Name</label>
              <input
                type="text"
                className={`form-control rounded-3 border-0 ${isDark ? 'bg-dark text-light' : 'bg-light'} py-2`}
                placeholder="e.g. Engineering"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="x-small fw-bold text-muted text-uppercase mb-1">Department Code</label>
              <input
                type="text"
                className={`form-control rounded-3 border-0 ${isDark ? 'bg-dark text-light' : 'bg-light'} py-2`}
                placeholder="e.g. ENG"
                value={formCode}
                onChange={(e) => setFormCode(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="x-small fw-bold text-muted text-uppercase mb-1">Head of Department</label>
              <input
                type="text"
                className={`form-control rounded-3 border-0 ${isDark ? 'bg-dark text-light' : 'bg-light'} py-2`}
                placeholder="e.g. John Smith"
                value={formHead}
                onChange={(e) => setFormHead(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="x-small fw-bold text-muted text-uppercase mb-1">Budget ($)</label>
              <input
                type="number"
                className={`form-control rounded-3 border-0 ${isDark ? 'bg-dark text-light' : 'bg-light'} py-2`}
                placeholder="e.g. 500000"
                min="0"
                step="0.01"
                value={formBudget}
                onChange={(e) => setFormBudget(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="x-small fw-bold text-muted text-uppercase mb-1">Location</label>
              <input
                type="text"
                className={`form-control rounded-3 border-0 ${isDark ? 'bg-dark text-light' : 'bg-light'} py-2`}
                placeholder="e.g. New York, Floor 5"
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="x-small fw-bold text-muted text-uppercase mb-1">Status</label>
              <select
                className={`form-select rounded-3 border-0 ${isDark ? 'bg-dark text-light' : 'bg-light'} py-2`}
                value={formStatus}
                onChange={(e) => setFormStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="col-12">
              <label className="x-small fw-bold text-muted text-uppercase mb-1">Description</label>
              <textarea
                className={`form-control rounded-3 border-0 ${isDark ? 'bg-dark text-light' : 'bg-light'} py-2`}
                rows="2"
                placeholder="Optional description..."
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
              />
            </div>
            {submitError && (
              <div className="col-12">
                <div className="alert alert-danger py-2 small mb-0">{submitError}</div>
              </div>
            )}
          </div>
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              className={`btn rounded-pill px-4 py-2 border fw-semibold ${isDark ? 'btn-outline-secondary' : 'btn-light'}`}
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm"
              disabled={submitting || !formName.trim()}
            >
              {submitting ? (
                <><FontAwesomeIcon icon={faSpinner} spin className="me-2" />Creating...</>
              ) : 'Create Department'}
            </button>
          </div>
        </form>
      </DialogBox>

      {/* Edit Department Modal */}
<DialogBox 
        show={showEditModal}
        onHide={() => { setShowEditModal(false); resetEditForm(); }}
        title="Edit Department"
        size="large"
      >
        <form onSubmit={handleUpdate}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="x-small fw-bold text-muted text-uppercase mb-1">Department Name</label>
              <input
                type="text"
                className={`form-control rounded-3 border-0 ${isDark ? 'bg-dark text-light' : 'bg-light'} py-2`}
                placeholder="e.g. Engineering"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="x-small fw-bold text-muted text-uppercase mb-1">Department Code</label>
              <input
                type="text"
                className={`form-control rounded-3 border-0 ${isDark ? 'bg-dark text-light' : 'bg-light'} py-2`}
                placeholder="e.g. ENG"
                value={editCode}
                onChange={(e) => setEditCode(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="x-small fw-bold text-muted text-uppercase mb-1">Head of Department</label>
              <input
                type="text"
                className={`form-control rounded-3 border-0 ${isDark ? 'bg-dark text-light' : 'bg-light'} py-2`}
                placeholder="e.g. John Smith"
                value={editHead}
                onChange={(e) => setEditHead(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="x-small fw-bold text-muted text-uppercase mb-1">Budget ($)</label>
              <input
                type="number"
                className={`form-control rounded-3 border-0 ${isDark ? 'bg-dark text-light' : 'bg-light'} py-2`}
                placeholder="e.g. 500000"
                min="0"
                step="0.01"
                value={editBudget}
                onChange={(e) => setEditBudget(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="x-small fw-bold text-muted text-uppercase mb-1">Location</label>
              <input
                type="text"
                className={`form-control rounded-3 border-0 ${isDark ? 'bg-dark text-light' : 'bg-light'} py-2`}
                placeholder="e.g. New York, Floor 5"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="x-small fw-bold text-muted text-uppercase mb-1">Status</label>
              <select
                className={`form-select rounded-3 border-0 ${isDark ? 'bg-dark text-light' : 'bg-light'} py-2`}
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="col-12">
              <label className="x-small fw-bold text-muted text-uppercase mb-1">Description</label>
              <textarea
                className={`form-control rounded-3 border-0 ${isDark ? 'bg-dark text-light' : 'bg-light'} py-2`}
                rows="2"
                placeholder="Optional description..."
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
              />
            </div>
            {submitError && (
              <div className="col-12">
                <div className="alert alert-danger py-2 small mb-0">{submitError}</div>
              </div>
            )}
          </div>
          <div className="d-flex justify-content-end gap-2 mt-4">
            <button
              type="button"
              className={`btn rounded-pill px-4 py-2 border fw-semibold ${isDark ? 'btn-outline-secondary' : 'btn-light'}`}
              onClick={() => { setShowEditModal(false); resetEditForm(); }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm"
              disabled={submitting || !editName.trim()}
            >
              {submitting ? (
                <><FontAwesomeIcon icon={faSpinner} spin className="me-2" />Updating...</>
              ) : 'Update Department'}
            </button>
          </div>
        </form>
      </DialogBox>

      {/* Delete Confirmation Modal */}
<DialogBox 
        show={deleteTarget !== null}
        onHide={() => setDeleteTarget(null)}
        size="small"
      >
        <div className="text-center py-2">
          <div className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10" style={{ width: '72px', height: '72px' }}>
            <FontAwesomeIcon icon={faTrash} className="text-danger fs-3" />
          </div>
          <h5 className="fw-bold mb-2">Delete Department</h5>
          <p className="text-muted small mb-0 px-3">
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
          </p>
        </div>
        <div className="d-flex gap-3 mt-4">
          <button
            className={`btn rounded-pill px-4 py-2 border fw-semibold flex-grow-1 ${isDark ? 'btn-outline-secondary' : 'btn-light'}`}
            onClick={() => setDeleteTarget(null)}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger rounded-pill px-4 py-2 fw-semibold shadow-sm flex-grow-1"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? (
              <><FontAwesomeIcon icon={faSpinner} spin className="me-2" />Deleting...</>
            ) : 'Delete'}
          </button>
        </div>
      </DialogBox>

      <style dangerouslySetInnerHTML={{ __html: `
        .hover-lift { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important; }
        .btn-white { background-color: white; color: #334155; }
        .btn-white:hover { background-color: #f8fafc; }
        .fade-in { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .department-card { border: 1px solid rgba(0,0,0,0.02) !important; }
        .btn-circle { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .dark-mode .btn-white { background-color: #1e293b; color: #e2e8f0; border-color: #475569; }
        .dark-mode .btn-white:hover { background-color: #334155; }
        .dark-mode .department-card { border-color: rgba(255,255,255,0.05) !important; }
        .dark-mode .table { color: #e2e8f0; }
        .dark-mode .table-hover tbody tr:hover { color: #f1f5f9; background-color: rgba(255,255,255,0.05); }
        .dark-mode .card { background-color: #1e293b; border-color: #334155; }
        .dark-mode .card-header { border-bottom-color: #334155; }
        .dark-mode .modal-content { background-color: #1e293b; color: #e2e8f0; }
        .dark-mode .form-control { background-color: #0f172a; color: #e2e8f0; border-color: #334155; }
        .dark-mode .form-select { background-color: #0f172a; color: #e2e8f0; border-color: #334155; }
        .dark-mode .input-group-text { color: #94a3b8; }
        .dark-mode .bg-light { background-color: #0f172a !important; }
        .dark-mode .bg-body-tertiary { background-color: #0f172a !important; }
        .dark-mode .border-bottom { border-bottom-color: #334155 !important; }
        .dark-mode .border-top { border-top-color: #334155 !important; }
        .dark-mode .border-secondary { border-color: #475569 !important; }
        .dark-mode .text-muted { color: #94a3b8 !important; }
        .dark-mode .btn-outline-secondary { color: #94a3b8; border-color: #475569; }
        .dark-mode .btn-outline-secondary:hover { background-color: #334155; color: #e2e8f0; }
        .dark-mode .bg-success-subtle { background-color: rgba(16,185,129,0.15) !important; }
        .dark-mode .text-success { color: #34d399 !important; }
        .dark-mode .bg-danger-subtle { background-color: rgba(239,68,68,0.15) !important; }
        .dark-mode .text-danger { color: #f87171 !important; }
        .dark-mode .btn-light { background-color: #334155; color: #e2e8f0; border-color: #475569; }
        .dark-mode .btn-light:hover { background-color: #475569; }
        .dark-mode .alert-danger { background-color: rgba(239,68,68,0.15); color: #fca5a5; border-color: rgba(239,68,68,0.2); }
        .dark-mode .btn-group .btn-primary { background-color: #6366f1; border-color: #6366f1; }
        .dark-mode .org-connector-v, .dark-mode .org-connector-v-short, .dark-mode .org-connector-h { background-color: #475569 !important; }
        .dark-mode .progress { background-color: #334155; }
      `}} />
    </div>
  );
};

export default DepartmentManagement;
