import React, { useState, useEffect, useMemo } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faTrophy,
  faBolt,
  faFire,
  faArrowUp,
  faStar,
  faBrain,
  faCheckCircle,
  faClock,
  faTasks,
  faStopwatch,
  faLayerGroup,
  faUserGroup,
  faChevronUp,
  faChevronDown,
  faCrown,
} from '@fortawesome/free-solid-svg-icons';
import { getTeamPerformance } from '../../../../api/tms';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const TmsTeamPerformanceReports = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getTeamPerformance();
      setData(result);
      if (result.teams?.length > 0 && !selectedTeamId) {
        setSelectedTeamId(result.teams[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch team performance', err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const selectedTeam = useMemo(() => {
    if (!data?.teams || !selectedTeamId) return null;
    return data.teams.find(t => t.id === selectedTeamId) || data.teams[0];
  }, [data, selectedTeamId]);

  const radarData = useMemo(() => {
    if (!data?.radar) return null;
    return {
      labels: data.radar.labels,
      datasets: [
        {
          label: 'Current Period',
          data: data.radar.current,
          backgroundColor: 'rgba(40, 40, 226, 0.2)',
          borderColor: '#2828e2',
          borderWidth: 2,
        },
        {
          label: 'Previous Period',
          data: data.radar.previous,
          backgroundColor: 'rgba(100, 116, 139, 0.2)',
          borderColor: '#64748b',
          borderWidth: 2,
        },
      ],
    };
  }, [data]);

  const radarOptions = {
    scales: {
      r: {
        angleLines: { display: false },
        suggestedMin: 20,
        suggestedMax: 100,
        ticks: { display: false },
      },
    },
    plugins: {
      legend: { position: 'bottom' },
    },
    maintainAspectRatio: false,
  };

  if (loading) {
    return (
      <div className="analytics-container p-4 d-flex align-items-center justify-content-center" style={{ minHeight: 400 }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" />
          <p className="text-muted small">Loading team performance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-container p-4 d-flex align-items-center justify-content-center" style={{ minHeight: 400 }}>
        <div className="text-center">
          <FontAwesomeIcon icon={faFire} className="text-danger fs-1 mb-3" />
          <h6 className="fw-bold">Failed to Load</h6>
          <p className="text-muted small mb-0">{error}</p>
          <button className="btn btn-primary btn-sm rounded-pill mt-3" onClick={fetchData}>Retry</button>
        </div>
      </div>
    );
  }

  const overall = data?.overall || {};
  const teams = data?.teams || [];
  const insight = data?.aiInsight || '';

  const members = selectedTeam?.members || [];

  return (
    <div className="analytics-container p-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 className="fw-bold mb-1">Team Excellence Hub</h2>
          <p className="text-muted small mb-0">Operational performance analytics and talent intelligence.</p>
        </div>
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div className="bg-white p-2 rounded-pill shadow-sm border px-3">
            <span className="text-muted small fw-bold">Productivity: </span>
            <span className="text-primary fw-bold ms-1">{overall.productivity_score || 0}%</span>
            <FontAwesomeIcon icon={faArrowUp} className="text-success ms-2 small" />
          </div>
          <select className="form-select form-select-sm rounded-pill border" style={{ width: 200 }} value={selectedTeamId || ''} onChange={e => setSelectedTeamId(Number(e.target.value))}>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-xl-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h5 className="fw-bold mb-4">Metric DNA</h5>
            {radarData ? (
              <div style={{ height: 350 }}>
                <Radar data={radarData} options={radarOptions} />
              </div>
            ) : (
              <div className="text-center text-muted small py-5">No radar data available</div>
            )}
          </div>
        </div>

        <div className="col-xl-7">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">
                {selectedTeam?.name || 'Team'} Leaderboard
              </h5>
              <span className="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2">
                <FontAwesomeIcon icon={faUserGroup} className="me-1" />{members.length} members
              </span>
            </div>
            {members.length > 0 ? (
              <div className="table-responsive" style={{ maxHeight: 350, overflowY: 'auto' }}>
                <table className="table table-borderless align-middle mb-0">
                  <thead className="sticky-top bg-white">
                    <tr className="text-muted small text-uppercase letter-spacing-1">
                      <th>#</th>
                      <th>Member</th>
                      <th>Score</th>
                      <th>Done</th>
                      <th>Hours</th>
                      <th className="text-end">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((user, i) => {
                      const rankColor = i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#cd7f32' : '#64748b';
                      const initials = user.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '??';
                      return (
                        <tr key={user.id} className="border-bottom-faint">
                          <td className="fw-bold" style={{ color: rankColor, fontSize: 13 }}>{i + 1}</td>
                          <td>
                            <div className="d-flex align-items-center gap-3 py-1">
                              <div className="avatar-circle shadow-sm" style={{ background: `hsl(${user.id * 40 % 360}, 65%, 55%)` }}>{initials}</div>
                              <div>
                                <div className="fw-bold small">{user.name}</div>
                                <div className="text-muted x-small">{user.tasks_total} tasks</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className="progress flex-grow-1" style={{ height: 6, width: 70 }}>
                                <div className="progress-bar rounded-pill" style={{ width: `${user.score}%`, background: i === 0 ? '#f59e0b' : i === 1 ? '#64748b' : i === 2 ? '#cd7f32' : '#6366f1' }} />
                              </div>
                              <span className="fw-bold small">{user.score}%</span>
                            </div>
                          </td>
                          <td className="small">
                            <span className="fw-semibold text-success">{user.tasks_done}</span>
                            <span className="text-muted">/{user.tasks_total}</span>
                          </td>
                          <td className="small fw-semibold">{user.hours_logged}h</td>
                          <td className="text-end">
                            {i === 0 && <span className="badge rounded-pill bg-warning bg-opacity-10 text-warning px-3 py-2"><FontAwesomeIcon icon={faCrown} className="me-1" />Lead</span>}
                            {i > 0 && user.score >= 70 && <span className="badge rounded-pill bg-success bg-opacity-10 text-success px-3 py-2">Optimal</span>}
                            {i > 0 && user.score < 70 && user.score >= 40 && <span className="badge rounded-pill bg-warning bg-opacity-10 text-warning px-3 py-2">Improving</span>}
                            {user.score < 40 && <span className="badge rounded-pill bg-danger bg-opacity-10 text-danger px-3 py-2">At Risk</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-muted small py-5">
                <FontAwesomeIcon icon={faUsers} className="fs-1 mb-3 opacity-25" />
                <p className="mb-0">No members found for this team</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {[
          { label: 'Total Teams', value: overall.total_teams || 0, icon: faLayerGroup, color: '#6366f1' },
          { label: 'Team Members', value: overall.total_members || 0, icon: faUsers, color: '#0ea5e9' },
          { label: 'Total Tasks', value: overall.total_tasks || 0, icon: faTasks, color: '#f59e0b' },
          { label: 'Completed', value: overall.completed_tasks || 0, icon: faCheckCircle, color: '#10b981' },
          { label: 'Total Hours', value: `${overall.total_hours || 0}h`, icon: faStopwatch, color: '#8b5cf6' },
          { label: 'Avg Completion', value: `${overall.avg_completion_rate || 0}%`, icon: faTrophy, color: '#06b6d4' },
        ].map((item, i) => (
          <div className="col-6 col-md-4 col-lg-2" key={i}>
            <div className="card border-0 shadow-sm rounded-4 p-3 text-center h-100">
              <div className="mx-auto mb-2 rounded-3 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, background: `${item.color}15`, color: item.color }}>
                <FontAwesomeIcon icon={item.icon} />
              </div>
              <div className="fw-bold fs-5">{item.value}</div>
              <div className="text-muted" style={{ fontSize: 11 }}>{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h5 className="fw-bold mb-3"><FontAwesomeIcon icon={faBrain} className="me-2 text-primary" />AI Insight</h5>
            <p className="text-muted small mb-0 lh-lg">{insight || 'No insights available yet.'}</p>
          </div>
        </div>
        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <h5 className="fw-bold mb-3"><FontAwesomeIcon icon={faLayerGroup} className="me-2 text-primary" />Team Summary</h5>
            {teams.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-borderless align-middle mb-0">
                  <thead>
                    <tr className="text-muted small text-uppercase letter-spacing-1">
                      <th>Team</th>
                      <th>Members</th>
                      <th>Tasks</th>
                      <th>Done</th>
                      <th>Completion</th>
                      <th>Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teams.map((team, i) => (
                      <tr key={team.id} className={`border-bottom-faint ${team.id === selectedTeamId ? 'table-active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setSelectedTeamId(team.id)}>
                        <td>
                          <div className="fw-bold small">{team.name}</div>
                          <div className="text-muted x-small">{team.department || '—'}</div>
                        </td>
                        <td className="small fw-semibold">{team.member_count}</td>
                        <td className="small">{team.total_tasks}</td>
                        <td className="small fw-semibold text-success">{team.done_tasks}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="progress" style={{ height: 5, width: 50 }}>
                              <div className="progress-bar rounded-pill bg-primary" style={{ width: `${team.completion_rate}%` }} />
                            </div>
                            <span className="x-small fw-bold">{team.completion_rate}%</span>
                          </div>
                        </td>
                        <td className="small fw-semibold">{team.total_hours}h</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-muted small py-4">No teams found</div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .avatar-circle {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: white; font-weight: bold; font-size: 0.75rem; flex-shrink: 0;
        }
        .border-bottom-faint { border-bottom: 1px solid rgba(0,0,0,0.03); }
        .x-small { font-size: 11px; }
        .letter-spacing-1 { letter-spacing: 1px; }
        .table > :not(caption) > * > * { border-bottom: none; }
        .table-responsive::-webkit-scrollbar { width: 4px; }
        .table-responsive::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
      `}</style>
    </div>
  );
};

export default TmsTeamPerformanceReports;