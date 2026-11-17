import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { useApp } from '../../../hooks/useApp';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faIdBadge, 
  faSitemap, 
  faChartPie, 
  faRoute, 
  faPlus, 
  faFileExport, 
  faSearch, 
  faFilter, 
  faEllipsisV,
  faChevronRight,
  faArrowTrendUp,
  faArrowTrendDown,
  faUsers,
  faLayerGroup,
  faMicrochip,
  faHeadset,
  faUserTie,
  faAward,
  faWallet,
  faGraduationCap,
  faRobot,
  faDiagramProject,
  faTable,
  faThLarge,
  faBuilding,
  faTrash,
  faPen,
  faSpinner,
  faExclamationTriangle
} from "@fortawesome/free-solid-svg-icons";
import { 
  Bar, 
  Doughnut, 
  Radar
} from "react-chartjs-2";
import { listDesignations, listDepartments, createDesignation, updateDesignation, deleteDesignation } from '../../../api/hrms';
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';

const DESIGNATION_COLORS = [
  '#3b82f6', '#ec4899', '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4',
  '#6366f1', '#ef4444', '#14b8a6', '#f97316', '#84cc16', '#0ea5e9',
];

const DesignationManagement = () => {
  const { t } = useTranslation();
  const { theme } = useApp(); const isDark = theme === 'dark';
  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form modal state (shared between create & edit)
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingDesignation, setEditingDesignation] = useState(null); // null = create mode
  const [formName, setFormName] = useState('');
  const [formDeptId, setFormDeptId] = useState('');
  const [formLevel, setFormLevel] = useState('');
  const [formSalaryBand, setFormSalaryBand] = useState('');
  const [formScore, setFormScore] = useState('');
  const [formReportsTo, setFormReportsTo] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [desigs, depts] = await Promise.all([
        listDesignations(),
        listDepartments(),
      ]);
      setDesignations(desigs);
      setDepartments(depts);
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
    setFormDeptId('');
    setFormLevel('');
    setFormSalaryBand('');
    setFormScore('');
    setFormReportsTo('');
    setFormDesc('');
    setSubmitError(null);
    setEditingDesignation(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowFormModal(true);
  };

  const openEditModal = (desig) => {
    setEditingDesignation(desig);
    setFormName(desig.name || '');
    setFormDeptId(desig.department_id || '');
    setFormLevel(desig.level || '');
    setFormSalaryBand(desig.salary_band || '');
    setFormScore(desig.performance_score != null ? String(desig.performance_score) : '');
    setFormReportsTo(desig.reports_to || '');
    setFormDesc(desig.description || '');
    setSubmitError(null);
    setShowFormModal(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim() || !formDeptId) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        name: formName.trim(),
        level: formLevel.trim() || null,
        salary_band: formSalaryBand.trim() || null,
        performance_score: formScore ? parseInt(formScore, 10) : null,
        reports_to: formReportsTo.trim() || null,
        description: formDesc.trim() || null,
      };
      if (editingDesignation) {
        await updateDesignation(editingDesignation.id, payload);
      } else {
        await createDesignation(formDeptId, payload);
      }
      setShowFormModal(false);
      resetForm();
      await fetchData();
    } catch (err) {
      setSubmitError(err.message || 'Failed to save designation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteDesignation(deleteTarget.id);
      setDeleteTarget(null);
      await fetchData();
    } catch (err) {
      setSubmitError(err.message || 'Failed to delete designation');
    } finally {
      setDeleting(false);
    }
  };

  const filteredDesignations = designations.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.department_name && d.department_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (d.level && d.level.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getColor = (idx) => DESIGNATION_COLORS[idx % DESIGNATION_COLORS.length];

  const handleExportCSV = () => {
    const headers = ['Designation Name', 'Department', 'Level', 'Salary Band', 'Performance Score', 'Reports To', 'Description'];
    const rows = designations.map(d => [
      d.name,
      d.department_name || '',
      d.level || '',
      d.salary_band || '',
      d.performance_score != null ? d.performance_score : '',
      d.reports_to || '',
      d.description || '',
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `designations_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const totalDesignations = designations.length;

  const KPISection = () => (
    <div className="row g-4 mb-4">
      <div className="col-xl-3 col-md-6">
        <div className={`card border-0 shadow-sm rounded-4 hover-lift h-100 overflow-hidden ${isDark ? 'bg-dark-card' : ''}`}>
          <div className="card-body p-4">
            <div className="d-flex align-items-center mb-3">
              <div className="rounded-3 p-3 d-flex align-items-center justify-content-center me-3" style={{ backgroundColor: '#3b82f615', color: '#3b82f6' }}>
                <FontAwesomeIcon icon={faIdBadge} className="fs-4" />
              </div>
              <div>
                <p className="text-muted small mb-0 fw-medium">{t('total_designations')}</p>
                <h3 className="fw-bold mb-0">{totalDesignations}</h3>
              </div>
            </div>
          </div>
          <div style={{ height: '4px', backgroundColor: '#3b82f6', width: '100%', position: 'absolute', bottom: 0 }}></div>
        </div>
      </div>
      <div className="col-xl-3 col-md-6">
        <div className={`card border-0 shadow-sm rounded-4 hover-lift h-100 overflow-hidden ${isDark ? 'bg-dark-card' : ''}`}>
          <div className="card-body p-4">
            <div className="d-flex align-items-center mb-3">
              <div className="rounded-3 p-3 d-flex align-items-center justify-content-center me-3" style={{ backgroundColor: '#8b5cf615', color: '#8b5cf6' }}>
                <FontAwesomeIcon icon={faBuilding} className="fs-4" />
              </div>
              <div>
                <p className="text-muted small mb-0 fw-medium">Departments</p>
                <h3 className="fw-bold mb-0">{departments.length}</h3>
              </div>
            </div>
          </div>
          <div style={{ height: '4px', backgroundColor: '#8b5cf6', width: '100%', position: 'absolute', bottom: 0 }}></div>
        </div>
      </div>
      <div className="col-xl-3 col-md-6">
        <div className={`card border-0 shadow-sm rounded-4 hover-lift h-100 overflow-hidden ${isDark ? 'bg-dark-card' : ''}`}>
          <div className="card-body p-4">
            <div className="d-flex align-items-center mb-3">
              <div className="rounded-3 p-3 d-flex align-items-center justify-content-center me-3" style={{ backgroundColor: '#10b98115', color: '#10b981' }}>
                <FontAwesomeIcon icon={faLayerGroup} className="fs-4" />
              </div>
              <div>
                <p className="text-muted small mb-0 fw-medium">Avg per Dept</p>
                <h3 className="fw-bold mb-0">{departments.length ? (totalDesignations / departments.length).toFixed(1) : '0'}</h3>
              </div>
            </div>
          </div>
          <div style={{ height: '4px', backgroundColor: '#10b981', width: '100%', position: 'absolute', bottom: 0 }}></div>
        </div>
      </div>
      <div className="col-xl-3 col-md-6">
        <div className={`card border-0 shadow-sm rounded-4 hover-lift h-100 overflow-hidden ${isDark ? 'bg-dark-card' : ''}`}>
          <div className="card-body p-4">
            <div className="d-flex align-items-center mb-3">
              <div className="rounded-3 p-3 d-flex align-items-center justify-content-center me-3" style={{ backgroundColor: '#f59e0b15', color: '#f59e0b' }}>
                <FontAwesomeIcon icon={faUsers} className="fs-4" />
              </div>
              <div>
                <p className="text-muted small mb-0 fw-medium">Active Depts</p>
                <h3 className="fw-bold mb-0">{departments.length}</h3>
              </div>
            </div>
          </div>
          <div style={{ height: '4px', backgroundColor: '#f59e0b', width: '100%', position: 'absolute', bottom: 0 }}></div>
        </div>
      </div>
    </div>
  );

  const CareerPathView = () => {
    const steps = [
        { title: 'Junior Developer', level: 'L1', icon: faGraduationCap, color: '#94a3b8' },
        { title: 'Software Engineer', level: 'L2', icon: faMicrochip, color: '#64748b' },
        { title: 'Senior Software Engineer', level: 'L3', icon: faAward, color: '#3b82f6', current: true },
        { title: 'Lead Engineer', level: 'L4', icon: faLayerGroup, color: '#8b5cf6' },
        { title: 'Engineering Manager', level: 'L5', icon: faUserTie, color: '#ec4899' },
        { title: 'Director of Engineering', level: 'L6', icon: faBuilding, color: '#ef4444' },
    ];

    return (
        <div className="fade-in py-5">
            <div className={`card border-0 shadow-sm rounded-4 p-5 ${isDark ? 'bg-dark-card' : ''}`}>
                <h5 className="fw-bold mb-5 text-center">Standard Engineering Career Progression</h5>
                <div className="career-path-container position-relative">
                    <div className="career-path-line"></div>
                    <div className="d-flex justify-content-between align-items-center position-relative z-1">
                        {steps.map((step, idx) => (
                            <div key={idx} className="career-step text-center px-2" style={{ width: `${100 / steps.length}%` }}>
                                <div 
                                    className={`career-icon-wrapper mx-auto mb-4 rounded-circle d-flex align-items-center justify-content-center shadow-sm transition ${step.current ? 'ring-active' : ''}`}
                                    style={{ 
                                        width: '64px', 
                                        height: '64px', 
                                        backgroundColor: step.current ? step.color : (isDark ? '#334155' : 'white'),
                                        color: step.current ? 'white' : step.color,
                                        border: `2px solid ${step.color}`
                                    }}
                                >
                                    <FontAwesomeIcon icon={step.icon} className="fs-4" />
                                </div>
                                <h6 className={`fw-bold mb-1 ${step.current ? 'text-primary' : ''}`}>{step.title}</h6>
                                <span className={`badge ${isDark ? 'bg-dark' : 'bg-light'} text-muted rounded-pill`}>{step.level}</span>
                                {step.current && <div className="mt-2"><span className="badge bg-primary rounded-pill small px-3">Current Target</span></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="row mt-4">
                <div className="col-md-6">
                    <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark-card' : ''}`}>
                        <h6 className="fw-bold mb-4">Competency Mapping (L3 → L4)</h6>
                        <div className="mb-4">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="small fw-medium">System Architecture</span>
                                <span className="small text-primary fw-bold">85%</span>
                            </div>
                            <div className="progress" style={{ height: '6px' }}>
                                <div className="progress-bar bg-primary" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="small fw-medium">Team Mentorship</span>
                                <span className="small text-primary fw-bold">60%</span>
                            </div>
                            <div className="progress" style={{ height: '6px' }}>
                                <div className="progress-bar bg-primary" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                        <div className="mb-0">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="small fw-medium">Strategic Vision</span>
                                <span className="small text-primary fw-bold">45%</span>
                            </div>
                            <div className="progress" style={{ height: '6px' }}>
                                <div className="progress-bar bg-primary" style={{ width: '45%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-primary text-white">
                        <div className="d-flex align-items-center gap-3 mb-4">
                             <div className={`${isDark ? 'bg-dark-card' : 'bg-white'} bg-opacity-20 rounded-circle p-3`}>
                                <FontAwesomeIcon icon={faRobot} className="fs-3" />
                             </div>
                             <div>
                                <h6 className="fw-bold mb-0">AI Career Recommendation</h6>
                                <p className="small mb-0 opacity-75">Personalized Growth Path</p>
                             </div>
                        </div>
                        <p className="small mb-4">Based on your performance in the last 3 quarters, we recommend focusing on <b>Technical Leadership</b> and <b>Cross-team Collaboration</b> to accelerate your move to L4 Lead Engineer.</p>
                        <button className={`btn ${isDark ? 'btn-outline-secondary' : 'btn-white'} btn-sm rounded-3 fw-bold px-4 py-2 border-0 shadow-sm`}>Explore Training</button>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .career-path-container { min-height: 150px; }
                .career-path-line { 
                    position: absolute; 
                    top: 32px; 
                    left: 5%; 
                    right: 5%; 
                    height: 2px; 
                    background: ${isDark ? '#334155' : '#e2e8f0'}; 
                    z-index: 0;
                }
                .career-icon-wrapper { position: relative; z-index: 1; }
                .ring-active { box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2); }
                .btn-white { background: white; color: var(--bs-primary); }
            `}} />
        </div>
    );
  };

  const AnalyticsDashboard = () => {
    const deptLabels = departments.map(d => d.name);
    const deptCounts = departments.map(d => (d.designations ? d.designations.length : 0));

    const doughnutData = {
        labels: deptLabels.length ? deptLabels : ['No Data'],
        datasets: [{
            data: deptCounts.length ? deptCounts : [1],
            backgroundColor: ['#3b82f6', '#ec4899', '#10b981', '#8b5cf6', '#f59e0b', '#06b6d4', '#6366f1', '#ef4444', '#14b8a6', '#f97316'],
            borderWidth: 0,
            hoverOffset: 15
        }]
    };

    const barData = {
        labels: deptLabels.length ? deptLabels : ['No Data'],
        datasets: [{
            label: 'Designations',
            data: deptCounts.length ? deptCounts : [0],
            backgroundColor: '#3b82f6',
            borderRadius: 8,
            barThickness: 30
        }]
    };

    const radarData = {
        labels: ['Leadership', 'Technical Skill', 'Execution', 'Culture Fit', 'Innovation', 'Collaboration'],
        datasets: [{
            label: 'Enterprise Avg',
            data: [75, 82, 88, 92, 78, 85],
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: '#3b82f6',
            borderWidth: 2,
            pointBackgroundColor: '#3b82f6',
        }]
    };

    return (
        <div className="fade-in">
            <div className="row g-4">
                <div className="col-xl-4 col-lg-6">
                    <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark-card' : ''}`}>
                        <h6 className="fw-bold mb-4">Designations by Department</h6>
                        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '300px' }}>
                             <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-lg-6">
                    <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark-card' : ''}`}>
                        <h6 className="fw-bold mb-4">Designations per Dept</h6>
                        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '300px' }}>
                             <Bar data={barData} options={{ maintainAspectRatio: false, indexAxis: 'y', plugins: { legend: { display: false } } }} />
                        </div>
                    </div>
                </div>
                <div className="col-xl-4 col-lg-12">
                    <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark-card' : ''}`}>
                        <h6 className="fw-bold mb-4">Competency Benchmark</h6>
                        <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '300px' }}>
                             <Radar data={radarData} options={{ maintainAspectRatio: false }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm rounded-4 p-4 overflow-hidden position-relative" style={{ backgroundColor: '#0f172a' }}>
                        <div className="row align-items-center position-relative z-1">
                            <div className="col-lg-8">
                                <h5 className="text-white fw-bold mb-2">Workforce Planning & Vacancy Analysis</h5>
                                <p className="text-light opacity-75 mb-4">Track your organization's designation structure across {departments.length} departments with {totalDesignations} total roles defined.</p>
                                <div className="d-flex gap-3">
                                    <button className="btn btn-primary rounded-3 px-4 py-2 fw-bold border-0">Succession Plan</button>
                                    <button className="btn btn-outline-light rounded-3 px-4 py-2 fw-bold opacity-75">Download Report</button>
                                </div>
                            </div>
                            <div className="col-lg-4 text-center d-none d-lg-block">
                                <FontAwesomeIcon icon={faDiagramProject} className="text-primary opacity-25" style={{ fontSize: '180px' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const HierarchyView = () => (
    <div className="fade-in py-5 text-center">
        <div className="org-tree mx-auto">
            <div className="node mb-5">
                <div className={`card border-0 shadow-sm rounded-4 p-3 d-inline-block shadow-active ${isDark ? 'bg-dark-card' : ''}`} style={{ minWidth: '220px', borderLeft: '4px solid #0f172a' }}>
                    <div className="d-flex align-items-center gap-2">
                        <div className={`rounded-circle ${isDark ? 'bg-dark' : 'bg-light'} p-2`}><FontAwesomeIcon icon={faUserTie} className={`${isDark ? 'text-light' : 'text-dark'}`} /></div>
                        <div className="text-start">
                            <h6 className="fw-bold mb-0">CEO</h6>
                            <p className="text-muted small mb-0">Level E1</p>
                        </div>
                    </div>
                </div>
                <div className="connector-v"></div>
            </div>

            <div className="d-flex justify-content-center gap-5 position-relative">
                <div className="connector-h" style={{ left: '25%', right: '25%' }}></div>
                
                <div className="branch">
                    <div className="connector-v-short"></div>
                    <div className={`card border-0 shadow-sm rounded-4 p-3 d-inline-block ${isDark ? 'bg-dark-card' : ''}`} style={{ minWidth: '200px', borderLeft: '4px solid #3b82f6' }}>
                        <div className="d-flex align-items-center gap-2">
                            <div className="rounded-circle bg-primary bg-opacity-10 p-2 text-primary"><FontAwesomeIcon icon={faMicrochip} /></div>
                            <div className="text-start">
                                <h6 className="fw-bold mb-0">CTO</h6>
                                <p className="text-muted small mb-0">Level E2</p>
                            </div>
                        </div>
                    </div>
                    <div className="connector-v"></div>
                    <div className={`card border-0 shadow-sm rounded-4 p-3 d-inline-block ${isDark ? 'bg-dark-card' : ''}`} style={{ minWidth: '200px', borderLeft: '4px solid #60a5fa' }}>
                        <div className="d-flex align-items-center gap-2 text-start">
                             <div>
                                <h6 className="fw-bold mb-0 small">Engineering Director</h6>
                                <p className="text-muted small mb-0">Level M3</p>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="branch">
                    <div className="connector-v-short"></div>
                    <div className={`card border-0 shadow-sm rounded-4 p-3 d-inline-block ${isDark ? 'bg-dark-card' : ''}`} style={{ minWidth: '200px', borderLeft: '4px solid #ec4899' }}>
                        <div className="d-flex align-items-center gap-2">
                            <div className="rounded-circle bg-pink bg-opacity-10 p-2 text-pink"><FontAwesomeIcon icon={faUsers} /></div>
                            <div className="text-start">
                                <h6 className="fw-bold mb-0">COO</h6>
                                <p className="text-muted small mb-0">Level E2</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
            .connector-v { width: 2px; height: 40px; background: ${isDark ? '#475569' : '#cbd5e1'}; margin: 0 auto; }
            .connector-v-short { width: 2px; height: 25px; background: ${isDark ? '#475569' : '#cbd5e1'}; margin: 0 auto; }
            .connector-h { position: absolute; top: 0; height: 2px; background: ${isDark ? '#475569' : '#cbd5e1'}; }
            .shadow-active { box-shadow: 0 10px 30px rgba(15, 23, 42, 0.1) !important; }
            .text-pink { color: #ec4899; }
            .bg-pink { background-color: #ec4899; }
        `}} />
    </div>
  );

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="fs-1 text-primary mb-3" />
          <p className="text-muted">Loading designations...</p>
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
    <div className={`designation-mgmt-page ${isDark ? 'dark-mode' : ''}`} style={{ backgroundColor: isDark ? 'transparent' : '#F8FAFC', minHeight: '100vh' }}>
      <div className="container-fluid py-4 px-lg-5">
        
        {/* Header Section */}
        <div className="row align-items-center mb-5">
            <div className="col-lg-7">
                <h2 className={`fw-bold ${isDark ? 'text-light' : 'text-dark'} mb-1`}>{t('designations')}</h2>
                <p className="text-muted mb-0">{t('designation_mgmt_desc')}</p>
            </div>
            <div className="col-lg-5 mt-3 mt-lg-0 text-lg-end">
                <div className="d-flex flex-wrap justify-content-lg-end gap-2">
                    <button className={`btn ${isDark ? 'btn-outline-secondary' : 'btn-white'} border shadow-sm rounded-3 px-4 fw-bold transition hover-lift`} onClick={handleExportCSV}>
                        <FontAwesomeIcon icon={faFileExport} className="me-2 text-primary" />
                        {t('export_data')}
                    </button>
                    <button
                      className="btn btn-primary shadow-sm rounded-3 px-4 fw-bold transition hover-lift"
                      onClick={openCreateModal}
                    >
                        <FontAwesomeIcon icon={faPlus} className="me-2" />
                        {t('create_designation')}
                    </button>
                </div>
            </div>
        </div>

        {/* KPI Section */}
        <KPISection />

        {/* Filters & View Modes */}
        <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-card' : ''}`}>
            <div className="card-body p-3">
                <div className="row align-items-center">
                    <div className="col-md-4 mb-3 mb-md-0">
                        <div className={`input-group ${isDark ? 'bg-dark' : 'bg-light'} rounded-3 px-3 border-0`}>
                            <span className="input-group-text bg-transparent border-0 text-muted ps-0">
                                <FontAwesomeIcon icon={faSearch} />
                            </span>
                            <input 
                                type="text" 
                                className="form-control bg-transparent border-0 small py-2" 
                                placeholder="Search by role, level or dept..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="d-flex flex-wrap align-items-center justify-content-md-end gap-2">
                            <div className={`btn-group rounded-3 overflow-hidden ${isDark ? 'border-secondary' : 'border'}`}>
                                <button className={`btn px-3 border-0 transition ${viewMode === 'table' ? 'btn-primary' : (isDark ? 'btn-outline-secondary' : 'btn-white')}`} onClick={() => setViewMode('table')} title={t('table_view')}><FontAwesomeIcon icon={faTable} /></button>
                                <button className={`btn px-3 border-0 transition ${viewMode === 'card' ? 'btn-primary' : (isDark ? 'btn-outline-secondary' : 'btn-white')}`} onClick={() => setViewMode('card')} title={t('grid_view')}><FontAwesomeIcon icon={faThLarge} /></button>
                                <button className={`btn px-3 border-0 transition ${viewMode === 'hierarchy' ? 'btn-primary' : (isDark ? 'btn-outline-secondary' : 'btn-white')}`} onClick={() => setViewMode('hierarchy')} title={t('hierarchy_view')}><FontAwesomeIcon icon={faSitemap} /></button>
                                <button className={`btn px-3 border-0 transition ${viewMode === 'career' ? 'btn-primary' : (isDark ? 'btn-outline-secondary' : 'btn-white')}`} onClick={() => setViewMode('career')} title={t('career_path_view')}><FontAwesomeIcon icon={faRoute} /></button>
                                <button className={`btn px-3 border-0 transition ${viewMode === 'analytics' ? 'btn-primary' : (isDark ? 'btn-outline-secondary' : 'btn-white')}`} onClick={() => setViewMode('analytics')} title={t('role_analytics')}><FontAwesomeIcon icon={faChartPie} /></button>
                            </div>
                            <button className={`btn ${isDark ? 'btn-outline-secondary' : 'btn-white'} border px-3 rounded-3 transition`}>
                                <FontAwesomeIcon icon={faFilter} className="me-2 text-muted" />
                                Advanced Filters
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Content Views */}
        {viewMode === 'table' && (
            <div className={`card border-0 shadow-sm rounded-4 overflow-hidden fade-in ${isDark ? 'bg-dark-card' : ''}`}>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0 border-0">
                        <thead className={isDark ? 'bg-dark-header' : 'bg-light'}>
                            <tr>
                                <th className="ps-4 py-3 border-0 text-muted small text-uppercase fw-bold">{t('dept_name')}</th>
                                <th className="py-3 border-0 text-muted small text-uppercase fw-bold">Department</th>
                                <th className="py-3 border-0 text-muted small text-uppercase fw-bold text-center">{t('career_level')}</th>
                                <th className="py-3 border-0 text-muted small text-uppercase fw-bold text-center">{t('employees')}</th>
                                <th className="py-3 border-0 text-muted small text-uppercase fw-bold">{t('salary_band')}</th>
                                <th className="py-3 border-0 text-muted small text-uppercase fw-bold">{t('performance_score')}</th>
                                <th className="pe-4 py-3 border-0 text-end text-muted small text-uppercase fw-bold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDesignations.length === 0 ? (
                              <tr>
                                <td colSpan="7" className="text-center py-5 text-muted">
                                  {searchTerm ? 'No designations match your search.' : 'No designations yet. Click "Create Designation" to add one.'}
                                </td>
                              </tr>
                            ) : (
                              filteredDesignations.map((d, idx) => (
                                <tr key={d.id}>
                                    <td className="ps-4 py-3">
                                        <div className="d-flex align-items-center">
                                            <div className="rounded-3 d-flex align-items-center justify-content-center me-3" style={{ backgroundColor: `${getColor(idx)}15`, color: getColor(idx), width: '36px', height: '36px' }}>
                                                <FontAwesomeIcon icon={faIdBadge} size="sm" />
                                            </div>
                                            <span className={`fw-bold ${isDark ? 'text-light' : 'text-dark'}`}>{d.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 small fw-medium text-muted">{d.department_name || '—'}</td>
                                    <td className="py-3 text-center">
                                      <span className={`badge ${isDark ? 'bg-dark' : 'bg-light'} ${isDark ? 'text-light' : 'text-dark'} rounded-pill ${isDark ? 'border-secondary' : 'border'}`}>{d.level || '—'}</span>
                                    </td>
                                    <td className="py-3 text-center"><span className="fw-bold">{d.employees_count || 0}</span></td>
                                    <td className="py-3">
                                      <span className="text-muted small fw-medium">
                                        <FontAwesomeIcon icon={faWallet} className="me-2 opacity-50" />
                                        {d.salary_band || '—'}
                                      </span>
                                    </td>
                                    <td className="py-3">
                                        <div className="d-flex align-items-center" style={{ minWidth: '120px' }}>
                                            <span className="small fw-bold me-2">{d.performance_score ?? '—'}{d.performance_score ? '%' : ''}</span>
                                            {d.performance_score != null && (
                                              <div className="progress flex-grow-1" style={{ height: '4px' }}>
                                                <div className="progress-bar" style={{ width: `${d.performance_score}%`, backgroundColor: getColor(idx) }}></div>
                                              </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="pe-4 py-3 text-end">
                                        <div className="d-flex gap-1 justify-content-end">
                                          <button
                                            className={`btn ${isDark ? 'btn-outline-secondary' : 'btn-light'} btn-sm rounded-circle p-0 text-primary`}
                                            style={{ width: '32px', height: '32px' }}
                                            onClick={() => openEditModal(d)}
                                            title="Edit designation"
                                          >
                                            <FontAwesomeIcon icon={faPen} size="xs" />
                                          </button>
                                          <button
                                            className={`btn ${isDark ? 'btn-outline-secondary' : 'btn-light'} btn-sm rounded-circle p-0 text-danger`}
                                            style={{ width: '32px', height: '32px' }}
                                            onClick={() => setDeleteTarget(d)}
                                            title="Delete designation"
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

        {viewMode === 'card' && (
            <div className="row g-4 fade-in">
                {filteredDesignations.length === 0 ? (
                  <div className="col-12 text-center py-5 text-muted">
                    {searchTerm ? 'No designations match your search.' : 'No designations yet.'}
                  </div>
                ) : (
                  filteredDesignations.map((d, idx) => (
                    <div key={d.id} className="col-xl-4 col-md-6">
                        <div className={`card border-0 shadow-sm rounded-4 h-100 hover-lift overflow-hidden ${isDark ? 'bg-dark-card' : ''}`}>
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between mb-4">
                                    <div className="rounded-3 p-3 text-white shadow-sm" style={{ backgroundColor: getColor(idx) }}>
                                        <FontAwesomeIcon icon={faIdBadge} className="fs-4" />
                                    </div>
                                    <span className="badge rounded-pill px-3 d-flex align-items-center ${isDark ? 'bg-success-subtle' : 'bg-success-subtle text-success'}">
                                        Active
                                    </span>
                                </div>
                                <h5 className="fw-bold mb-1">{d.name}</h5>
                                <p className="text-muted small mb-4">{d.department_name || '—'} {d.level ? `\u2022 Level ${d.level}` : ''}</p>
                                
                                <div className="row g-3 py-3 border-top border-bottom mb-4">
                                    <div className="col-6">
                                        <p className="text-muted small mb-1">Reports To</p>
                                        <p className="fw-bold small mb-0">{d.reports_to || '—'}</p>
                                    </div>
                                    <div className="col-6">
                                        <p className="text-muted small mb-1">Salary Band</p>
                                        <p className="fw-bold small mb-0">{d.salary_band || '—'}</p>
                                    </div>
                                </div>

                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-2">
                                        <FontAwesomeIcon icon={faUsers} className="text-muted" />
                                        <span className="fw-bold">{d.employees_count || 0} <small className="text-muted fw-normal">Employees</small></span>
                                    </div>
                                    <div className="d-flex gap-2">
                                      <button
                                        className="btn p-0 text-primary fw-bold small d-flex align-items-center gap-1"
                                        onClick={() => openEditModal(d)}
                                      >
                                        <FontAwesomeIcon icon={faPen} /> Edit
                                      </button>
                                      <button
                                        className="btn p-0 text-danger fw-bold small d-flex align-items-center gap-1"
                                        onClick={() => setDeleteTarget(d)}
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

        {viewMode === 'hierarchy' && <HierarchyView />}
        {viewMode === 'career' && <CareerPathView />}
        {viewMode === 'analytics' && <AnalyticsDashboard />}

        {/* Footer Enterprise Links */}
        <div className="row mt-5">
           <div className="col-12"><h5 className="fw-bold mb-4">Workforce Architecture Framework</h5></div>
           {[
               { title: t('job_architecture'), icon: faDiagramProject, color: '#475569', desc: 'Enterprise role structures' },
               { title: t('competency_mapping'), icon: faAward, color: '#6366f1', desc: 'Skill frameworks & assessment' },
               { title: t('salary_band_mgmt'), icon: faWallet, color: '#10b981', desc: 'Compensation equity planning' },
               { title: t('promotion_matrix'), icon: faArrowTrendUp, color: '#ec4899', desc: 'Merit-based progression rules' },
           ].map((item, idx) => (
               <div key={idx} className="col-xl-3 col-md-6 mb-4">
                   <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 transition hover-lift cursor-pointer ${isDark ? 'bg-dark-card' : 'bg-white'}`}>
                       <div className="d-flex align-items-center gap-3">
                           <div className="rounded-3 p-3 text-white shadow-sm" style={{ backgroundColor: item.color }}>
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

      {/* Create / Edit Designation Modal */}
<DialogBox 
        show={showFormModal}
        onHide={() => { setShowFormModal(false); resetForm(); }}
        title={editingDesignation ? 'Edit Designation' : t('create_designation')}
        size="large"
      >
        <form onSubmit={handleFormSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="x-small fw-bold text-muted text-uppercase mb-1">Designation Name</label>
              <input
                type="text"
                className={`form-control rounded-3 border-0 ${isDark ? 'bg-dark' : 'bg-light'} py-2`}
                placeholder="e.g. Senior Software Engineer"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="x-small fw-bold text-muted text-uppercase mb-1">Department</label>
              <select
                className={`form-select rounded-3 border-0 ${isDark ? 'bg-dark' : 'bg-light'} py-2`}
                value={formDeptId}
                onChange={(e) => setFormDeptId(e.target.value)}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="x-small fw-bold text-muted text-uppercase mb-1">Level</label>
              <select
                className={`form-select rounded-3 border-0 ${isDark ? 'bg-dark' : 'bg-light'} py-2`}
                value={formLevel}
                onChange={(e) => setFormLevel(e.target.value)}
              >
                <option value="">Select Level</option>
                {['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'E1', 'E2', 'E3', 'M1', 'M2', 'M3'].map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="x-small fw-bold text-muted text-uppercase mb-1">Salary Band</label>
              <input
                type="text"
                className={`form-control rounded-3 border-0 ${isDark ? 'bg-dark' : 'bg-light'} py-2`}
                placeholder="e.g. $85k – $120k"
                value={formSalaryBand}
                onChange={(e) => setFormSalaryBand(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="x-small fw-bold text-muted text-uppercase mb-1">Performance Score</label>
              <input
                type="number"
                className={`form-control rounded-3 border-0 ${isDark ? 'bg-dark' : 'bg-light'} py-2`}
                placeholder="0-100"
                min="0"
                max="100"
                value={formScore}
                onChange={(e) => setFormScore(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="x-small fw-bold text-muted text-uppercase mb-1">Reports To</label>
              <input
                type="text"
                className={`form-control rounded-3 border-0 ${isDark ? 'bg-dark' : 'bg-light'} py-2`}
                placeholder="e.g. Engineering Manager"
                value={formReportsTo}
                onChange={(e) => setFormReportsTo(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="x-small fw-bold text-muted text-uppercase mb-1">Employees Count</label>
              <input
                type="number"
                className={`form-control rounded-3 border-0 ${isDark ? 'bg-dark' : 'bg-light'} py-2`}
                placeholder="Auto-calculated"
                disabled
                value={0}
              />
            </div>
            <div className="col-12">
              <label className="x-small fw-bold text-muted text-uppercase mb-1">Description</label>
              <textarea
                className={`form-control rounded-3 border-0 ${isDark ? 'bg-dark' : 'bg-light'} py-2`}
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
              className={`btn ${isDark ? 'btn-outline-secondary' : 'btn-light'} rounded-pill px-4 py-2 border fw-semibold`}
              onClick={() => { setShowFormModal(false); resetForm(); }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm"
              disabled={submitting || !formName.trim() || !formDeptId}
            >
              {submitting ? (
                <><FontAwesomeIcon icon={faSpinner} spin className="me-2" />{editingDesignation ? 'Updating...' : 'Creating...'}</>
              ) : (editingDesignation ? 'Update Designation' : 'Create Designation')}
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
          <h5 className="fw-bold mb-2">Delete Designation</h5>
          <p className="text-muted small mb-0 px-3">
            Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
          </p>
        </div>
        <div className="d-flex gap-3 mt-4">
          <button
            className={`btn ${isDark ? 'btn-outline-secondary' : 'btn-light'} rounded-pill px-4 py-2 border fw-semibold flex-grow-1`}
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
        .hover-lift { transition: all 0.3s ease; }
        .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important; }
        .hover-gap { transition: gap 0.2s ease; }
        .hover-gap:hover { gap: 12px !important; }
        .btn-white { background: white; color: #334155; }
        .fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .dark-mode .card { background-color: #1e293b; border-color: #334155; }
        .dark-mode .card-header { border-bottom-color: #334155; }
        .dark-mode .table { color: #e2e8f0; }
        .dark-mode .table-hover tbody tr:hover { color: #f1f5f9; background-color: rgba(255,255,255,0.05); }
        .dark-mode .table td, .dark-mode .table th { border-color: #334155; }
        .dark-mode .form-control { background-color: #0f172a !important; color: #e2e8f0 !important; border-color: #334155; }
        .dark-mode .form-select { background-color: #0f172a !important; color: #e2e8f0 !important; border-color: #334155; }
        .dark-mode .modal-content { background-color: #1e293b; color: #e2e8f0; }
        .dark-mode .btn-light { background-color: #334155; color: #e2e8f0; border-color: #475569; }
        .dark-mode .btn-light:hover { background-color: #475569; }
        .dark-mode .btn-outline-secondary { color: #94a3b8; border-color: #475569; }
        .dark-mode .btn-outline-secondary:hover { background-color: #334155; color: #e2e8f0; }
        .dark-mode .text-muted { color: #94a3b8 !important; }
        .dark-mode .border-bottom { border-bottom-color: #334155 !important; }
        .dark-mode .border-top { border-top-color: #334155 !important; }
        .dark-mode .border-secondary { border-color: #475569 !important; }
        .dark-mode .bg-light { background-color: #0f172a !important; }
        .dark-mode .bg-dark { background-color: #0f172a !important; }
        .dark-mode .bg-success-subtle { background-color: rgba(16,185,129,0.15) !important; }
        .dark-mode .btn-white { background-color: #1e293b; color: #e2e8f0; border-color: #475569; }
        .dark-mode .btn-white:hover { background-color: #334155; }
        .dark-mode .progress { background-color: #334155; }
        .dark-mode .shadow-active { box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important; }
        .dark-mode .career-path-line { background: #334155; }
        .dark-mode .connector-v, .dark-mode .connector-v-short, .dark-mode .connector-h { background: #475569 !important; }
      `}} />
    </div>
  );
};

export default DesignationManagement;
