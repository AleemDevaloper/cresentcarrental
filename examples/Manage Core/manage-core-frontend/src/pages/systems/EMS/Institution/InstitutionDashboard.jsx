import React, { useEffect, useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSchool, faBuilding, faLayerGroup, faBookOpen,
  faDoorOpen, faUserGraduate, faChalkboardTeacher,
  faCheckCircle, faCircle, faChartPie, faUniversity,
  faArrowUp, faCubes, faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend, ArcElement, Filler
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';
import { getEmsDashboard, listInstitutions } from '../../../../api/ems';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement, Filler);

const InstitutionDashboard = () => {
  const { t } = useTranslation();
  const { theme } = useApp();
  const isDark = theme === 'dark';

  const [dashboard, setDashboard] = useState(null);
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [dashRes, instRes] = await Promise.all([
        getEmsDashboard(),
        listInstitutions()
      ]);
      setDashboard(dashRes);
      setInstitutions(Array.isArray(instRes) ? instRes : []);
    } catch (err) {
      console.error("Error loading EMS Dashboard", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const typeColors = {
    School: '#6366f1', College: '#10b981', University: '#f59e0b',
    Institute: '#ec4899', Academy: '#06b6d4', Other: '#6b7280'
  };

  const typeDistribution = {};
  institutions.forEach(inst => {
    const t = inst.type || 'Other';
    typeDistribution[t] = (typeDistribution[t] || 0) + 1;
  });

  const typeChartData = {
    labels: Object.keys(typeDistribution),
    datasets: [{
      data: Object.values(typeDistribution),
      backgroundColor: Object.keys(typeDistribution).map(k => typeColors[k] || '#6b7280'),
      borderWidth: 0,
    }]
  };

  const statusData = {
    labels: ['Active', 'Inactive'],
    datasets: [{
      data: [
        institutions.filter(i => i.status === 'active').length,
        institutions.filter(i => i.status !== 'active').length
      ],
      backgroundColor: ['#10b981', '#ef4444'],
      borderWidth: 0,
    }]
  };

  const kpis = [
    { title: 'Total Institutions', value: dashboard?.total_institutions ?? institutions.length, icon: faUniversity, color: 'primary', sub: 'All registered institutions' },
    { title: 'Active', value: dashboard?.active_institutions ?? institutions.filter(i => i.status === 'active').length, icon: faCheckCircle, color: 'success', sub: 'Currently operating' },
    { title: 'Inactive', value: dashboard?.inactive_institutions ?? institutions.filter(i => i.status !== 'active').length, icon: faCircle, color: 'secondary', sub: 'Non-operational' },
    { title: 'Campuses', value: dashboard?.total_campuses ?? 0, icon: faBuilding, color: 'info', sub: 'Across all institutions' },
    { title: 'Departments', value: dashboard?.total_departments ?? 0, icon: faLayerGroup, color: 'warning', sub: 'Academic departments' },
    { title: 'Programs', value: dashboard?.total_programs ?? 0, icon: faBookOpen, color: 'primary', sub: 'Degree programs' },
    { title: 'Buildings', value: dashboard?.total_buildings ?? 0, icon: faUniversity, color: 'success', sub: 'Campus infrastructure' },
    { title: 'Rooms', value: dashboard?.total_rooms ?? 0, icon: faDoorOpen, color: 'info', sub: 'Classrooms & labs' },
    { title: 'Students', value: dashboard?.total_students ?? 0, icon: faUserGraduate, color: 'warning', sub: 'Enrolled students' },
    { title: 'Teachers', value: dashboard?.total_teachers ?? 0, icon: faChalkboardTeacher, color: 'danger', sub: 'Faculty members' },
  ];

  if (loading) {
    return (
      <div className="p-4">
        <div className="skeleton-line w-25 mb-4" style={{ height: '30px', borderRadius: '4px' }}></div>
        <div className="row g-4">
          {[1,2,3,4,5,6,7,8,9,10].map(i => (
            <div className="col-md-4 col-xl-2" key={i}>
              <div className="card skeleton-card p-4 border-0 shadow-sm" style={{ height: '140px', borderRadius: '18px' }}>
                <div className="skeleton-line w-50 mb-3" style={{ height: '15px' }}></div>
                <div className="skeleton-line w-75 mb-2" style={{ height: '25px' }}></div>
                <div className="skeleton-line w-25" style={{ height: '10px' }}></div>
              </div>
            </div>
          ))}
        </div>
        <div className="row mt-4 g-4">
          <div className="col-lg-6">
            <div className="card skeleton-card p-4 border-0 shadow-sm" style={{ height: '350px', borderRadius: '18px' }}></div>
          </div>
          <div className="col-lg-6">
            <div className="card skeleton-card p-4 border-0 shadow-sm" style={{ height: '350px', borderRadius: '18px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-2 ${isDark ? 'text-white bg-dark' : ''}`}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1">Institution Management Dashboard</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Overview of all institutions, campuses, and academic entities</p>
        </div>
      </div>

      <div className="row g-3 mb-4">
        {kpis.map(kpi => (
          <div className="col-md-4 col-xl" key={kpi.title}>
            <div className={`card border-0 shadow-sm h-100 hover-lift transition ${isDark ? 'bg-dark border-1 border-secondary' : ''}`} style={{ borderRadius: '18px' }}>
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className={`p-3 rounded-3 bg-${kpi.color}-subtle text-${kpi.color}`}>
                    <FontAwesomeIcon icon={kpi.icon} size="lg" />
                  </div>
                </div>
                <div className={`small fw-bold text-uppercase mb-1 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>{kpi.title}</div>
                <div className="h3 fw-bold mb-1">{kpi.value}</div>
                <div className={`x-small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{kpi.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-1">Institution Types Distribution</h5>
            <p className={`small mb-4 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Breakdown by institution category</p>
            {Object.keys(typeDistribution).length === 0 ? (
              <div className="text-center py-5 text-muted">No data available</div>
            ) : (
              <div className="d-flex align-items-center justify-content-center" style={{ height: '280px' }}>
                <div className="position-relative" style={{ width: '220px', height: '220px' }}>
                  <Doughnut
                    data={typeChartData}
                    options={{
                      responsive: true, maintainAspectRatio: false, cutout: '72%',
                      plugins: { legend: { display: false }, tooltip: { enabled: true } },
                      elements: { arc: { borderRadius: 6 } }
                    }}
                  />
                  <div className="position-absolute top-50 start-50 translate-middle text-center">
                    <div className="h4 fw-bold mb-0 lh-1">{institutions.length}</div>
                    <div className={`x-small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Total</div>
                  </div>
                </div>
              </div>
            )}
            <div className="d-flex flex-wrap gap-3 mt-3 justify-content-center">
              {Object.entries(typeDistribution).map(([type, count]) => (
                <div className="d-flex align-items-center gap-2" key={type}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: typeColors[type] || '#6b7280', display: 'inline-block' }} />
                  <span className="small fw-semibold">{type}</span>
                  <span className={`x-small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>({count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
            <h5 className="fw-bold mb-1">Institution Status</h5>
            <p className={`small mb-4 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Active vs Inactive</p>
            {institutions.length === 0 ? (
              <div className="text-center py-5 text-muted">No data available</div>
            ) : (
              <div className="d-flex align-items-center justify-content-center" style={{ height: '280px' }}>
                <div className="position-relative" style={{ width: '220px', height: '220px' }}>
                  <Doughnut
                    data={statusData}
                    options={{
                      responsive: true, maintainAspectRatio: false, cutout: '72%',
                      plugins: { legend: { display: false }, tooltip: { enabled: true } },
                      elements: { arc: { borderRadius: 6 } }
                    }}
                  />
                  <div className="position-absolute top-50 start-50 translate-middle text-center">
                    <div className="h4 fw-bold mb-0 lh-1">{institutions.length}</div>
                    <div className={`x-small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Total</div>
                  </div>
                </div>
              </div>
            )}
            <div className="d-flex justify-content-center gap-4 mt-3">
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-success rounded-pill" style={{ width: '10px', height: '10px' }}>&nbsp;</span>
                <span className="small fw-semibold">Active ({institutions.filter(i => i.status === 'active').length})</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-danger rounded-pill" style={{ width: '10px', height: '10px' }}>&nbsp;</span>
                <span className="small fw-semibold">Inactive ({institutions.filter(i => i.status !== 'active').length})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`card border-0 shadow-sm rounded-4 p-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ borderRadius: '18px' }}>
        <h5 className="fw-bold mb-3">Institutions List</h5>
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                <th>Name</th>
                <th>Code</th>
                <th>Type</th>
                <th>Status</th>
                <th>Founded</th>
              </tr>
            </thead>
            <tbody>
              {institutions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">No institutions found</td>
                </tr>
              ) : (
                institutions.slice(0, 10).map(inst => (
                  <tr key={inst.id}>
                    <td className="fw-semibold">{inst.name}</td>
                    <td><code>{inst.code}</code></td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary rounded-pill">{inst.type}</span>
                    </td>
                    <td>
                      <span className={`badge rounded-pill bg-${inst.status === 'active' ? 'success' : 'secondary'}-subtle text-${inst.status === 'active' ? 'success' : 'secondary'}`}>
                        {inst.status}
                      </span>
                    </td>
                    <td className="small">{inst.founded_date || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .hover-lift:hover { transform: translateY(-3px); box-shadow: 0 8px 16px rgba(0,0,0,0.08) !important; }
        .transition { transition: all 0.2s ease-in-out; }
        .x-small { font-size: 11px; }
        .skeleton-card { background-color: ${isDark ? 'rgba(255,255,255,0.03)' : '#f3f4f6'}; }
        .skeleton-line { background-color: ${isDark ? 'rgba(255,255,255,0.06)' : '#e5e7eb'}; border-radius: 4px; animation: pulse 1.5s infinite ease-in-out; }
        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
      `}</style>
    </div>
  );
};

export default InstitutionDashboard;
