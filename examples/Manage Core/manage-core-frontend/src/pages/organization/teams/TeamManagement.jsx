import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faCloudArrowUp,
  faDownload,
  faLayerGroup,
  faUsers,
  faPeopleGroup,
  faChartLine,
  faClock,
  faCheckCircle,
  faSearch,
  faThLarge,
  faList,
  faCalendarAlt,
  faPieChart,
  faUserTie,
  faArrowUp,
  faArrowDown,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { useApp } from '../../../hooks/useApp';
import { AppBarChart } from '../../../components/common/UI/Charts';

ChartJS.register(ArcElement, Tooltip, Legend);
import { SAMPLE_TEAMS, DEPARTMENTS, MANAGERS, TEAM_STATUSES } from './teamsData';
import TeamCardEnhanced from './TeamCardEnhanced';
import TeamDetailDrawer from './TeamDetailDrawer';
import TeamsTable from './TeamsTable';
import TeamsPagination from './TeamsPagination';

const TeamManagement = () => {
  const { addNotification } = useApp();
  const [viewMode, setViewMode] = useState('grid'); // grid, list, kanban, analytics
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Summary Data (Hardcoded based on specs)
  const kpis = [
    { label: 'Total Teams', value: '28', icon: faPeopleGroup, color: 'primary' },
    { label: 'Total Members', value: '342', icon: faUsers, color: 'info' },
    { label: 'Active Teams', value: '25', icon: faCheckCircle, color: 'success' },
    { label: 'Productivity', value: '89%', icon: faChartLine, color: 'warning' },
    { label: 'Active Projects', value: '67', icon: faLayerGroup, color: 'danger' },
    { label: 'Hours Worked', value: '5,420h', icon: faClock, color: 'dark' },
  ];

  const filteredTeams = useMemo(() => {
     let result = SAMPLE_TEAMS.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.department.toLowerCase().includes(searchQuery.toLowerCase())
     );
     // Sorting logic...
     return result;
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredTeams.length / pageSize);
  const paginatedTeams = filteredTeams.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenDrawer = (team) => {
    setSelectedTeam(team);
    setIsDrawerOpen(true);
  };

  const handleAction = (action, team) => {
    addNotification(`${action} action for ${team.name}`, 'info');
  };

  return (
    <div className="p-1 fade-in">
       <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">Teams</h3>
            <p className="text-muted small mb-0">Manage organizational teams, members, workloads, productivity, and performance.</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-primary fw-bold px-3" style={{ height: 42, borderRadius: 10 }}>
              <FontAwesomeIcon icon={faPlus} className="me-2" /> Create Team
            </button>
            <button className="btn btn-outline-secondary fw-bold px-3" style={{ height: 42, borderRadius: 10 }}>
               <FontAwesomeIcon icon={faCloudArrowUp} className="me-2" /> Import
            </button>
            <button className="btn btn-outline-secondary fw-bold px-3" style={{ height: 42, borderRadius: 10 }}>
               <FontAwesomeIcon icon={faDownload} className="me-2" /> Export
            </button>
             <button className="btn btn-light fw-bold px-3 border" style={{ height: 42, borderRadius: 10 }}>
               Bulk Actions
            </button>
          </div>
       </div>

       {/* KPIs */}
       <div className="row g-3 mb-4">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="col-lg-2 col-md-4 col-6">
               <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 15 }}>
                  <div className="card-body p-3">
                     <div className={`text-${kpi.color} mb-2`}>
                        <FontAwesomeIcon icon={kpi.icon} />
                     </div>
                     <div className="fw-bold text-dark fs-5">{kpi.value}</div>
                     <div className="text-muted" style={{ fontSize: 11 }}>{kpi.label}</div>
                  </div>
               </div>
            </div>
          ))}
       </div>

       {/* Toolbar */}
       <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 15 }}>
          <div className="card-body py-2 px-3">
             <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                <div className="d-flex align-items-center gap-3 flex-grow-1" style={{ maxWidth: 400 }}>
                   <div className="input-group input-group-sm border rounded-pill px-2 bg-light">
                      <span className="input-group-text bg-transparent border-0 text-muted"><FontAwesomeIcon icon={faSearch} /></span>
                      <input 
                        type="text" 
                        className="form-control bg-transparent border-0 shadow-none" 
                        placeholder="Search teams..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                   </div>
                   <button className="btn btn-light btn-sm rounded-pill border px-3">Filters</button>
                </div>
                
                <div className="d-flex align-items-center gap-2">
                   <div className="btn-group btn-group-sm bg-light p-1 rounded-pill" role="group">
                      <button 
                        className={`btn rounded-pill px-3 border-0 ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-muted'}`}
                        onClick={() => setViewMode('grid')}
                      >
                        <FontAwesomeIcon icon={faThLarge} className="me-1" /> Grid
                      </button>
                      <button 
                        className={`btn rounded-pill px-3 border-0 ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-muted'}`}
                        onClick={() => setViewMode('list')}
                      >
                        <FontAwesomeIcon icon={faList} className="me-1" /> List
                      </button>
                      <button 
                        className={`btn rounded-pill px-3 border-0 ${viewMode === 'kanban' ? 'bg-white shadow-sm text-primary' : 'text-muted'}`}
                        onClick={() => setViewMode('kanban')}
                      >
                        <FontAwesomeIcon icon={faCalendarAlt} className="me-1" /> Kanban
                      </button>
                      <button 
                        className={`btn rounded-pill px-3 border-0 ${viewMode === 'analytics' ? 'bg-white shadow-sm text-primary' : 'text-muted'}`}
                        onClick={() => setViewMode('analytics')}
                      >
                        <FontAwesomeIcon icon={faPieChart} className="me-1" /> Analytics
                      </button>
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* Main Content */}
       {viewMode === 'grid' && (
          <div className="row g-3">
             {paginatedTeams.map(team => (
               <TeamCardEnhanced 
                 key={team.id} 
                 team={team} 
                 onAction={handleAction} 
                 onOpenDrawer={handleOpenDrawer}
               />
             ))}
          </div>
       )}

       {viewMode === 'list' && (
          <TeamsTable teams={paginatedTeams} onAction={handleAction} />
       )}

        {viewMode === 'kanban' && (
           <div className="overflow-auto pb-2" style={{ maxHeight: 'calc(100vh - 420px)' }}>
             <div className="d-flex gap-3" style={{ minWidth: 900 }}>
               {['Active', 'Busy', 'At Risk', 'On Hold', 'Onboarding', 'Inactive'].map(status => {
                 const teamsInStatus = SAMPLE_TEAMS.filter(t => t.status === status);
                 const statusColor = {
                   Active: '#10b981',
                   Busy: '#f59e0b',
                   'At Risk': '#ef4444',
                   'On Hold': '#6b7280',
                   Onboarding: '#6366f1',
                   Inactive: '#94a3b8',
                 }[status] || '#94a3b8';
                 return (
                   <div key={status} className="card border-0 shadow-sm flex-shrink-0" style={{ width: 300, borderRadius: 16, maxHeight: 'calc(100vh - 440px)' }}>
                     <div className="card-header bg-transparent border-0 px-3 pt-3 pb-0 d-flex align-items-center justify-content-between">
                       <div className="d-flex align-items-center gap-2">
                         <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: statusColor }} />
                         <span className="fw-bold text-dark small">{status}</span>
                         <span className="badge bg-light text-muted rounded-pill">{teamsInStatus.length}</span>
                       </div>
                     </div>
                     <div className="card-body px-3 pt-2 overflow-auto" style={{ maxHeight: 'calc(100vh - 500px)' }}>
                       {teamsInStatus.length === 0 && (
                         <div className="text-center py-4">
                           <p className="text-muted small mb-0">No teams</p>
                         </div>
                       )}
                       {teamsInStatus.map(team => (
                         <div
                           key={team.id}
                           className="card border mb-2 transition hover-lift"
                           style={{ borderRadius: 12, borderColor: '#f1f5f9', cursor: 'pointer' }}
                           onClick={() => handleOpenDrawer(team)}
                         >
                           <div className="card-body p-3">
                             <div className="d-flex justify-content-between align-items-start mb-2">
                               <h6 className="fw-bold text-dark mb-0" style={{ fontSize: 13 }}>{team.name}</h6>
                               <span className="badge bg-light text-muted x-small rounded-pill">{team.department}</span>
                             </div>
                             <div className="d-flex align-items-center gap-2 mb-2">
                               <FontAwesomeIcon icon={faUserTie} className="text-muted" style={{ fontSize: 10 }} />
                               <span className="text-muted x-small">{team.manager}</span>
                               <span className="text-muted x-small ms-auto">{team.memberCount} members</span>
                             </div>
                             <div className="d-flex align-items-center gap-2 mb-1">
                               <span className="text-muted x-small">Productivity</span>
                               <span className="fw-bold x-small ms-auto">{team.productivityPercent}%</span>
                             </div>
                             <div className="progress mb-2" style={{ height: 4, borderRadius: 2 }}>
                               <div className="progress-bar" style={{ width: `${team.productivityPercent}%`, backgroundColor: statusColor }} />
                             </div>
                             <div className="d-flex align-items-center justify-content-between">
                               <span className="x-small text-muted">{team.completedTasks} tasks done</span>
                               <span className={`x-small fw-bold ${team.trend === 'up' ? 'text-success' : team.trend === 'down' ? 'text-danger' : 'text-muted'}`}>
                                 <FontAwesomeIcon icon={team.trend === 'up' ? faArrowUp : team.trend === 'down' ? faArrowDown : faMinus} style={{ fontSize: 10 }} />
                                 {' '}{team.efficiency}%
                               </span>
                             </div>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>
                 );
               })}
             </div>
           </div>
        )}

        {viewMode === 'analytics' && (
           <div>
             <div className="row g-3 mb-4">
               {[
                 { label: 'Avg Productivity', value: `${Math.round(SAMPLE_TEAMS.reduce((s, t) => s + t.productivityPercent, 0) / SAMPLE_TEAMS.length)}%`, icon: faChartLine, color: 'primary' },
                 { label: 'High Performing', value: SAMPLE_TEAMS.filter(t => t.productivityPercent >= 80).length.toString(), icon: faCheckCircle, color: 'success' },
                 { label: 'Needs Improvement', value: SAMPLE_TEAMS.filter(t => t.productivityPercent < 60).length.toString(), icon: faArrowDown, color: 'danger' },
                 { label: 'Total Capacity', value: `${Math.round(SAMPLE_TEAMS.reduce((s, t) => s + (t.capacity || 0), 0) / SAMPLE_TEAMS.length)}%`, icon: faUsers, color: 'info' },
               ].map((kpi, idx) => (
                 <div key={idx} className="col-lg-3 col-md-6">
                   <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 15 }}>
                     <div className="card-body p-3">
                       <div className={`text-${kpi.color} mb-2`}><FontAwesomeIcon icon={kpi.icon} /></div>
                       <div className="fw-bold text-dark fs-4">{kpi.value}</div>
                       <div className="text-muted" style={{ fontSize: 11 }}>{kpi.label}</div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>

             <div className="row g-3 mb-4">
               <div className="col-lg-8">
                 <AppBarChart
                   title="Productivity by Team"
                   labels={SAMPLE_TEAMS.map(t => t.name)}
                   datasets={[{
                     label: 'Productivity %',
                     data: SAMPLE_TEAMS.map(t => t.productivityPercent),
                     backgroundColor: SAMPLE_TEAMS.map(t =>
                       t.productivityPercent >= 80 ? '#10b981' :
                       t.productivityPercent >= 60 ? '#f59e0b' : '#ef4444'
                     ),
                   }]}
                   height={300}
                   options={{
                     scales: {
                       y: { beginAtZero: true, max: 100, ticks: { callback: (v) => `${v}%` } },
                       x: { ticks: { font: { size: 10 } } }
                     }
                   }}
                 />
               </div>
                <div className="col-lg-4">
                  <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 15 }}>
                    <div className="card-body p-4 d-flex flex-column" style={{ minHeight: 420 }}>
                      <h6 className="fw-bold text-dark mb-3">
                        <FontAwesomeIcon icon={faPieChart} className="text-primary me-2" />Status Distribution
                      </h6>
                      <div className="flex-grow-1 d-flex flex-column justify-content-center">
                        <div className="position-relative mx-auto" style={{ width: 220, height: 220 }}>
                          <Doughnut
                            data={{
                              labels: ['Active', 'Busy', 'At Risk', 'On Hold', 'Onboarding'],
                              datasets: [{
                                data: ['Active', 'Busy', 'At Risk', 'On Hold', 'Onboarding'].map(s =>
                                  SAMPLE_TEAMS.filter(t => t.status === s).length
                                ),
                                backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#6b7280', '#6366f1'],
                                borderWidth: 0,
                                hoverOffset: 12,
                              }]
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: true,
                              cutout: '78%',
                              animation: { animateRotate: true, duration: 1000 },
                              plugins: {
                                legend: { display: false },
                                tooltip: {
                                  backgroundColor: '#fff',
                                  titleColor: '#1e293b',
                                  bodyColor: '#64748b',
                                  borderColor: '#f1f5f9',
                                  borderWidth: 1,
                                  padding: 12,
                                  callbacks: {
                                    label: (ctx) => {
                                      const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                      const pct = total > 0 ? Math.round((ctx.raw / total) * 100) : 0;
                                      return ` ${ctx.label}: ${ctx.raw} team${ctx.raw !== 1 ? 's' : ''} (${pct}%)`;
                                    }
                                  }
                                }
                              }
                            }}
                          />
                          <div className="position-absolute top-50 start-50 translate-middle text-center">
                            <div className="fw-bold text-dark" style={{ fontSize: 28, lineHeight: 1.1 }}>
                              {SAMPLE_TEAMS.length}
                            </div>
                            <div className="text-muted" style={{ fontSize: 11 }}>Total Teams</div>
                          </div>
                        </div>
                        <div className="mt-3 d-flex flex-column gap-2 px-2">
                          {[
                            { label: 'Active', color: '#10b981', key: 'Active' },
                            { label: 'Busy', color: '#f59e0b', key: 'Busy' },
                            { label: 'At Risk', color: '#ef4444', key: 'At Risk' },
                            { label: 'On Hold', color: '#6b7280', key: 'On Hold' },
                            { label: 'Onboarding', color: '#6366f1', key: 'Onboarding' },
                          ].map(({ label, color, key }) => {
                            const count = SAMPLE_TEAMS.filter(t => t.status === key).length;
                            const pct = Math.round((count / SAMPLE_TEAMS.length) * 100);
                            return (
                              <div key={key} className="d-flex align-items-center gap-2">
                                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />
                                <span className="x-small text-muted" style={{ minWidth: 56 }}>{label}</span>
                                <div className="progress flex-grow-1" style={{ height: 6, borderRadius: 3, backgroundColor: '#f1f5f9' }}>
                                  <div className="progress-bar rounded-pill" style={{ width: `${pct}%`, backgroundColor: color, transition: 'width 1s ease' }} />
                                </div>
                                <span className="x-small fw-bold text-dark" style={{ minWidth: 32, textAlign: 'right' }}>{count}</span>
                                <span className="x-small text-muted" style={{ minWidth: 36, textAlign: 'right' }}>{pct}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
             </div>

             <div className="row g-3 mb-4">
               <div className="col-lg-6">
                 <AppBarChart
                   title="Department Breakdown"
                   labels={[...new Set(SAMPLE_TEAMS.map(t => t.department))]}
                   datasets={[{
                     label: 'Teams',
                     data: [...new Set(SAMPLE_TEAMS.map(t => t.department))].map(d =>
                       SAMPLE_TEAMS.filter(t => t.department === d).length
                     ),
                     backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#0ea5e9', '#ef4444', '#8b5cf6'],
                   }]}
                   height={250}
                   options={{
                     scales: {
                       y: { beginAtZero: true, ticks: { stepSize: 1 } },
                     }
                   }}
                 />
               </div>
               <div className="col-lg-6">
                 <AppBarChart
                   title="Efficiency Overview"
                   labels={SAMPLE_TEAMS.map(t => t.name)}
                   datasets={[{
                     label: 'Efficiency %',
                     data: SAMPLE_TEAMS.map(t => t.efficiency),
                     backgroundColor: SAMPLE_TEAMS.map(t =>
                       t.efficiency >= 80 ? '#10b981' :
                       t.efficiency >= 50 ? '#f59e0b' : '#ef4444'
                     ),
                   }]}
                   height={250}
                   options={{
                     scales: {
                       y: { beginAtZero: true, max: 100, ticks: { callback: (v) => `${v}%` } },
                       x: { ticks: { font: { size: 10 } } }
                     }
                   }}
                 />
               </div>
             </div>

             <div className="card border-0 shadow-sm" style={{ borderRadius: 15 }}>
               <div className="card-body p-4">
                 <h6 className="fw-bold text-dark mb-3"><FontAwesomeIcon icon={faUsers} className="text-primary me-2" />Team Performance Summary</h6>
                 <div className="table-responsive">
                   <table className="table table-hover align-middle mb-0">
                     <thead className="bg-light">
                       <tr>
                         <th className="border-0 text-uppercase text-muted x-small fw-bold py-3 px-3">Team</th>
                         <th className="border-0 text-uppercase text-muted x-small fw-bold py-3 px-3">Productivity</th>
                         <th className="border-0 text-uppercase text-muted x-small fw-bold py-3 px-3">Efficiency</th>
                         <th className="border-0 text-uppercase text-muted x-small fw-bold py-3 px-3">Tasks</th>
                         <th className="border-0 text-uppercase text-muted x-small fw-bold py-3 px-3">Attendance</th>
                         <th className="border-0 text-uppercase text-muted x-small fw-bold py-3 px-3">Trend</th>
                       </tr>
                     </thead>
                     <tbody>
                       {SAMPLE_TEAMS.map(team => (
                         <tr key={team.id} className="transition" style={{ cursor: 'pointer' }} onClick={() => handleOpenDrawer(team)}>
                           <td className="px-3 py-3">
                             <div className="fw-bold text-dark small">{team.name}</div>
                             <div className="text-muted x-small">{team.department}</div>
                           </td>
                           <td className="px-3 py-3">
                             <span className={`badge ${team.productivityPercent >= 80 ? 'bg-success' : team.productivityPercent >= 60 ? 'bg-warning' : 'bg-danger'} text-white px-2 py-1 rounded-pill`}>
                               {team.productivityPercent}%
                             </span>
                           </td>
                           <td className="px-3 py-3">
                             <div className="d-flex align-items-center gap-2" style={{ minWidth: 100 }}>
                               <div className="progress flex-grow-1" style={{ height: 6, borderRadius: 3 }}>
                                 <div className={`progress-bar ${team.efficiency >= 80 ? 'bg-success' : team.efficiency >= 50 ? 'bg-warning' : 'bg-danger'}`}
                                   style={{ width: `${team.efficiency}%` }} />
                               </div>
                               <span className="x-small fw-bold text-muted">{team.efficiency}%</span>
                             </div>
                           </td>
                           <td className="px-3 py-3">
                             <span className="x-small text-muted">{team.completedTasks}/{team.openTasks + team.completedTasks}</span>
                           </td>
                           <td className="px-3 py-3">
                             <span className="fw-bold small">{team.attendance}%</span>
                           </td>
                           <td className="px-3 py-3">
                             <span className={`x-small fw-bold ${team.trend === 'up' ? 'text-success' : team.trend === 'down' ? 'text-danger' : 'text-muted'}`}>
                               <FontAwesomeIcon icon={team.trend === 'up' ? faArrowUp : team.trend === 'down' ? faArrowDown : faMinus} className="me-1" />
                               {team.trend === 'up' ? 'Rising' : team.trend === 'down' ? 'Declining' : 'Stable'}
                             </span>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>
             </div>
           </div>
        )}

       <TeamsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          totalItems={filteredTeams.length}
       />

       <TeamDetailDrawer 
         isOpen={isDrawerOpen} 
         onClose={() => setIsDrawerOpen(false)} 
         team={selectedTeam} 
       />
    </div>
  );
};

export default TeamManagement;
