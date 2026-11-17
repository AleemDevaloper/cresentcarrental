import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding, faUsers, faUserCheck, faUserXmark, faClock,
  faChartBar, faChartLine, faArrowsSpin, faLocationDot,
  faListCheck
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { listSites, getSiteStats, listAttendance } from '../../../../api/hrms';

const SiteAttendanceDashboard = () => {
  const { t } = useTranslation();
  const { addNotification, theme } = useApp();
  const isDark = theme === 'dark';

  const [sites, setSites] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [siteAttendance, setSiteAttendance] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [siteList, siteStats, attendanceData] = await Promise.all([
        listSites(),
        getSiteStats(),
        listAttendance()
      ]);
      setSites(siteList || []);
      setStats(siteStats);
      setSiteAttendance(attendanceData || []);
      if (siteList?.length > 0 && !selectedSiteId) {
        setSelectedSiteId(siteList[0].id?.toString());
      }
    } catch {
      addNotification(t('Failed to load dashboard data'), 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const [siteList, siteStats, attendanceData] = await Promise.all([
        listSites(),
        getSiteStats(),
        listAttendance()
      ]);
      setSites(siteList || []);
      setStats(siteStats);
      setSiteAttendance(attendanceData || []);
      addNotification(t('Dashboard refreshed'), 'success');
    } catch {
      addNotification(t('Refresh failed'), 'danger');
    } finally {
      setRefreshing(false);
    }
  };

  const selectedSite = sites.find(s => s.id?.toString() === selectedSiteId);
  const total = stats?.total_employees ?? 0;
  const present = stats?.present_count ?? 0;
  const absent = stats?.absent_count ?? 0;
  const late = stats?.late_count ?? 0;
  const occupancy = total > 0 ? Math.round((present / total) * 100) : 0;

  const siteTableData = sites.map(s => {
    const att = siteAttendance.filter(a => a.site_id === s.id || a.site?.id === s.id);
    const sTotal = att.length || s.total_employees || 0;
    const sPresent = att.filter(a => a.status === 'Present').length;
    const sAbsent = att.filter(a => a.status === 'Absent').length;
    const sLate = att.filter(a => a.status === 'Late').length;
    const productivity = sTotal > 0 ? Math.round((sPresent / sTotal) * 100) : 0;
    return { ...s, sTotal, sPresent, sAbsent, sLate, productivity };
  });

  return (
    <div className={`animate-fade-in p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold mb-1"><FontAwesomeIcon icon={faBuilding} className="me-2 text-primary" />{t('Site Attendance Dashboard')}</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>{t('Real-time workforce tracking across sites')}</p>
        </div>
        <div className="d-flex gap-2">
          <select className="form-select rounded-3" value={selectedSiteId} onChange={e => setSelectedSiteId(e.target.value)}>
            {sites.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <button className="btn btn-outline-primary rounded-3" onClick={handleRefresh} disabled={refreshing}>
            <FontAwesomeIcon icon={faArrowsSpin} className={refreshing ? 'fa-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Employees', value: total, icon: faUsers, color: 'primary' },
          { label: 'Present', value: present, icon: faUserCheck, color: 'success' },
          { label: 'Absent', value: absent, icon: faUserXmark, color: 'danger' },
          { label: 'Late', value: late, icon: faClock, color: 'warning' },
        ].map((stat, i) => (
          <div key={i} className="col-6 col-md-3">
            <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
              <div className="card-body p-3 d-flex align-items-center gap-3">
                <div className={`p-3 rounded-3 bg-${stat.color}-subtle`}>
                  <FontAwesomeIcon icon={stat.icon} className={`text-${stat.color} fs-4`} />
                </div>
                <div>
                  <p className="h4 fw-bold mb-0">{stat.value}</p>
                  <p className={`x-small mb-0 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>{t(stat.label)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faChartBar} className="me-2 text-info" />{t('Site Utilization')}</h6>
              <div className="d-flex align-items-end gap-2" style={{ height: 200 }}>
                {sites.length === 0 ? (
                  <p className="text-muted small w-100 text-center">{t('No site data')}</p>
                ) : sites.slice(0, 12).map((s, i) => {
                  const util = siteAttendance.filter(a => a.site_id === s.id).length > 0
                    ? Math.round((siteAttendance.filter(a => a.site_id === s.id && a.status === 'Present').length / Math.max(siteAttendance.filter(a => a.site_id === s.id).length, 1)) * 100)
                    : 0;
                  return (
                    <div key={s.id} className="flex-grow-1 d-flex flex-column align-items-center">
                      <div className="w-100 rounded-3 bg-primary" style={{ height: `${util}%`, transition: 'height 0.5s', minHeight: 4 }} />
                      <span className="x-small mt-1 text-muted">{s.name?.substring(0, 3)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark-subtle' : ''}`}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3"><FontAwesomeIcon icon={faChartLine} className="me-2 text-success" />{t('Attendance Trend')}</h6>
              <div className="d-flex align-items-end gap-2" style={{ height: 200 }}>
                {stats?.trend && stats.trend.length > 0 ? (
                  stats.trend.map((val, i) => (
                    <div key={i} className="flex-grow-1 d-flex flex-column align-items-center">
                      <div className="w-100 rounded-3 bg-success" style={{ height: `${val}%`, transition: 'height 0.5s' }} />
                      <span className="x-small mt-1 text-muted">{i + 1}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted small w-100 text-center">{t('No trend data')}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Occupancy */}
      <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faLocationDot} className="me-2 text-danger" />{t('Real-time Site Occupancy')}</h6>
            <span className="badge bg-success rounded-pill"><FontAwesomeIcon icon={faUserCheck} className="me-1" />{occupancy}%</span>
          </div>
          <div className="progress rounded-3" style={{ height: 12 }}>
            <div className="progress-bar bg-success" style={{ width: `${occupancy}%` }} />
          </div>
          <p className={`small mt-2 mb-0 ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
            {present} / {total} {t('employees currently on site')}
          </p>
        </div>
      </div>

      {/* Workforce Table */}
      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark-subtle' : ''}`}>
        <div className={`card-header bg-transparent border-0 py-3`}>
          <h6 className="fw-bold mb-0"><FontAwesomeIcon icon={faListCheck} className="me-2 text-primary" />{t('Workforce by Site')}</h6>
        </div>
        <div className="table-responsive">
          <table className={`table align-middle mb-0 small ${isDark ? 'table-dark' : ''}`}>
            <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
              <tr>
                <th className="ps-4">{t('Site')}</th>
                <th>{t('Total')}</th>
                <th>{t('Present')}</th>
                <th>{t('Absent')}</th>
                <th>{t('Late')}</th>
                <th>{t('Productivity')}</th>
                <th className="pe-4">{t('Status')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary" /></td></tr>
              ) : siteTableData.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-4 text-muted">{t('No sites available')}</td></tr>
              ) : siteTableData.map(s => (
                <tr key={s.id}>
                  <td className="ps-4 fw-bold">{s.name}</td>
                  <td>{s.sTotal}</td>
                  <td className="text-success fw-bold">{s.sPresent}</td>
                  <td className="text-danger">{s.sAbsent}</td>
                  <td className="text-warning">{s.sLate}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="progress flex-grow-1 rounded-3" style={{ height: 6 }}>
                        <div className="progress-bar bg-success" style={{ width: `${s.productivity}%` }} />
                      </div>
                      <span className="x-small">{s.productivity}%</span>
                    </div>
                  </td>
                  <td className="pe-4">
                    <span className="badge bg-success-subtle text-success rounded-pill">{t('Active')}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SiteAttendanceDashboard;
