import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers, faUserCheck, faUserClock, faUserSlash, faClock, faPlaneDeparture,
  faUserPlus, faChartLine, faCalendarDay, faGift, faCakeCandles,
  faCheckCircle, faMoneyBillWave, faBriefcase, faRocket, faBullhorn,
  faBuilding, faArrowUp, faArrowDown, faEye, faChevronRight,
  faSearch, faFilter
} from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { useTranslation } from '../../../../hooks/useTranslation';
import { useApp } from '../../../../hooks/useApp';
import { getCommandCenterStats, getHeadcountTrends, getAttendanceTrends, getLeaveTrends, getDepartmentOverview } from '../../../../api/hrms';
import { KpiCard, MetricCard } from '../../../../components/common/UI/Cards';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend, Filler);

const CommandCenter = () => {
  const { t } = useTranslation();
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [stats, setStats] = useState(null);
  const [headcountTrends, setHeadcountTrends] = useState(null);
  const [attendanceTrends, setAttendanceTrends] = useState(null);
  const [leaveTrends, setLeaveTrends] = useState(null);
  const [deptOverview, setDeptOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, h, a, lt, d] = await Promise.all([
        getCommandCenterStats(),
        getHeadcountTrends(),
        getAttendanceTrends(),
        getLeaveTrends(),
        getDepartmentOverview()
      ]);
      setStats(s);
      setHeadcountTrends(h);
      setAttendanceTrends(a);
      setLeaveTrends(lt);
      setDeptOverview(d);
    } catch (err) {
      setError(err.message);
      addNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading) {
    return (
      <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-1">{t('command_center')}</h4>
            <p className="text-muted small mb-0">{t('hrms_enterprise_dashboard')}</p>
          </div>
        </div>
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status" /></div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
        <div className="text-center py-5">
          <FontAwesomeIcon icon={faChartLine} className="fs-1 text-muted mb-3" />
          <p className="text-muted">{t('failed_to_load')}</p>
          <button className="btn btn-primary rounded-3" onClick={fetchData}>{t('retry')}</button>
        </div>
      </div>
    );
  }

  const headcountChartData = headcountTrends ? {
    labels: headcountTrends.labels || [],
    datasets: [{
      label: t('total_employees'),
      data: headcountTrends.values || [],
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79,70,229,0.1)',
      fill: true, tension: 0.4,
    }]
  } : null;

  const attendanceChartData = attendanceTrends ? {
    labels: attendanceTrends.labels || [],
    datasets: [
      { label: t('present'), data: attendanceTrends.present || [], borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', fill: true, tension: 0.4 },
      { label: t('absent'), data: attendanceTrends.absent || [], borderColor: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', fill: true, tension: 0.4 },
    ]
  } : null;

  const leaveDistData = leaveTrends ? {
    labels: leaveTrends.labels || [],
    datasets: [{ data: leaveTrends.values || [], backgroundColor: ['#4f46e5', '#ef4444', '#f59e0b', '#ec4899', '#64748b'], borderWidth: 0 }]
  } : null;

  const kpis = stats ? [
    { label: t('total_employees'), value: stats.total_employees?.toLocaleString() || '0', icon: faUsers, color: '#4f46e5', trend: 'up', trendVal: stats.total_employees_trend || '' },
    { label: t('active_employees'), value: stats.active?.toLocaleString() || '0', icon: faUserCheck, color: '#10b981', trend: 'up', trendVal: stats.active_trend || '' },
    { label: t('present_today'), value: stats.present?.toLocaleString() || '0', icon: faClock, color: '#3b82f6', trend: 'up', trendVal: stats.present_rate ? `${stats.present_rate}%` : '' },
    { label: t('absent_today'), value: stats.absent?.toLocaleString() || '0', icon: faUserSlash, color: '#ef4444', trend: 'down', trendVal: stats.absent_rate ? `${stats.absent_rate}%` : '' },
    { label: t('late_today'), value: stats.late?.toLocaleString() || '0', icon: faUserClock, color: '#f59e0b', trend: 'down', trendVal: stats.late_rate ? `${stats.late_rate}%` : '' },
    { label: t('on_leave'), value: stats.on_leave?.toLocaleString() || '0', icon: faPlaneDeparture, color: '#8b5cf6', trend: 'up', trendVal: stats.on_leave_trend || '' },
    { label: t('new_hires'), value: stats.new_hires?.toLocaleString() || '0', icon: faUserPlus, color: '#ec4899', trend: 'up', trendVal: stats.new_hires_trend || '' },
  ] : [];

  return (
    <div className={`p-1 ${isDark ? 'text-white' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">{t('command_center')}</h4>
          <p className="text-muted small mb-0">{t('hrms_enterprise_dashboard')}</p>
        </div>
        <button className="btn btn-outline-secondary rounded-3 btn-sm" onClick={fetchData}>
          <FontAwesomeIcon icon={faFilter} className="me-1" /> {t('refresh')}
        </button>
      </div>

      <div className="row g-3 mb-4">
        {kpis.map((kpi, i) => (
          <div key={i} className="col-xl-3 col-lg-4 col-md-6">
            <KpiCard label={kpi.label} value={kpi.value} icon={kpi.icon} color={kpi.color} isDark={isDark} />
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{t('headcount_trends')}</h5>
              {headcountChartData ? (
                <div style={{ height: '280px' }}>
                  <Line data={headcountChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: false, grid: { display: false } }, x: { grid: { display: false } } } }} />
                </div>
              ) : (
                <div className="text-center py-4 text-muted small">{t('no_data')}</div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{t('attendance_trends')}</h5>
              {attendanceChartData ? (
                <div style={{ height: '280px' }}>
                  <Line data={attendanceChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top', labels: { usePointStyle: true, boxWidth: 8 } } }, scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } } }} />
                </div>
              ) : (
                <div className="text-center py-4 text-muted small">{t('no_data')}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-4">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{t('leave_distribution')}</h5>
              {leaveDistData ? (
                <>
                  <div className="position-relative mb-3" style={{ height: '220px' }}>
                    <Doughnut data={leaveDistData} options={{ responsive: true, maintainAspectRatio: false, cutout: '75%', plugins: { legend: { display: false } } }} />
                    <div className="position-absolute top-50 start-50 translate-middle text-center">
                      <div className="h3 fw-bold mb-0">{leaveTrends?.total || 0}</div>
                      <div className="text-muted x-small">{t('total_days')}</div>
                    </div>
                  </div>
                  {leaveDistData.labels.map((l, i) => (
                    <div key={l} className="d-flex align-items-center justify-content-between mb-1">
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle" style={{ width: 8, height: 8, backgroundColor: leaveDistData.datasets[0].backgroundColor[i] }} />
                        <span className="small text-muted">{l}</span>
                      </div>
                      <span className="small fw-bold">{leaveDistData.datasets[0].data[i]}%</span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-4 text-muted small">{t('no_data')}</div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-secondary' : ''}`}>
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">{t('department_overview')}</h5>
              {deptOverview && deptOverview.length > 0 ? (
                <div className="table-responsive">
                  <table className="table align-middle table-hover mb-0">
                    <thead><tr className="small text-muted"><th>{t('department')}</th><th>{t('head')}</th><th>{t('employees')}</th><th></th></tr></thead>
                    <tbody>
                      {deptOverview.map((d, i) => (
                        <tr key={i}>
                          <td><span className="small fw-bold">{d.name}</span></td>
                          <td><span className="small text-muted">{d.head_name || d.head || '-'}</span></td>
                          <td><span className="badge bg-light text-dark rounded-pill">{d.employee_count || d.count || 0}</span></td>
                          <td className="text-end"><FontAwesomeIcon icon={faChevronRight} className="x-small text-muted" /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4 text-muted small">{t('no_data')}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .x-small { font-size: 11px; }
        .bg-primary-subtle { background-color: #eef2ff !important; }
        .bg-success-subtle { background-color: #ecfdf5 !important; }
        .bg-warning-subtle { background-color: #fff7ed !important; }
        .bg-danger-subtle { background-color: #fef2f2 !important; }
        .bg-info-subtle { background-color: #ecfeff !important; }
        .text-purple { color: #8b5cf6 !important; }
        .text-pink { color: #ec4899 !important; }
      `}} />
    </div>
  );
};

export default CommandCenter;
