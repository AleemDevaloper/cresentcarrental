import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLightbulb,
  faArrowTrendUp,
  faUserGear,
  faCheckDouble,
  faRobot,
  faBolt,
  faArrowRight,
  faUsers,
  faGem,
  faClock,
  faChartLine,
  faShieldHalved,
  faLayerGroup,
} from '@fortawesome/free-solid-svg-icons';
import { listProductivityRecords } from '../../../../api/tms';
import { useApp } from '../../../../context/AppContext';

const TmsProductivityInsights = () => {
  const { addNotification } = useApp();
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [insights, setInsights] = useState([
    {
      id: 1,
      type: 'process',
      title: 'Bottleneck in QA Approval',
      description: 'Tasks are spending an average of 4.2 days in the "QA Review" stage, causing a 15% delay in sprint completion.',
      impact: 'High',
      score: '+18% Speed',
      action: 'Assign second reviewer to high-priority tasks.',
      owner: 'Sarah Chen',
      status: 'active',
      date: 'Today'
    },
    {
      id: 2,
      type: 'tooling',
      title: 'Redundant Documentation',
      description: 'Teams spend 6h/week on manual status reports that could be automated via the new Export Studio.',
      impact: 'Medium',
      score: '6h Saved/Week',
      action: 'Set up automated weekly exports for Dept heads.',
      owner: 'Alex Rivera',
      status: 'pending',
      date: 'Yesterday'
    },
    {
      id: 3,
      type: 'people',
      title: 'High Context Switching',
      description: 'Backend team is being interrupted by frequent small tasks, reducing focus time by 30%.',
      impact: 'Critical',
      score: '+30% Focus',
      action: 'Implement "Deep Work" hours (2 PM - 5 PM).',
      owner: 'Michael Ross',
      status: 'active',
      date: '2 days ago'
    }
  ]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await listProductivityRecords();
        setRecords(data);
      } catch (err) {
        addNotification("Failed to load live productivity records.", "danger");
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  const stats = [
    { label: 'Active Insights', value: '12', icon: faLightbulb, color: 'primary' },
    { label: 'Potential Gain', value: '+24%', icon: faArrowTrendUp, color: 'success' },
    { label: 'Actions Assigned', value: '8', icon: faUserGear, color: 'info' },
    { label: 'Resolved Impact', value: '142h', icon: faCheckDouble, color: 'warning' },
  ];

  return (
    <div className="analytics-container p-4">
      {/* Premium Professional Header */}
      <div className="productivity-premium-header mb-5">
        <div className="card border-0 shadow-lg rounded-5 overflow-hidden position-relative p-0" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #1e293b 100%)' }}>
          <div className="p-4 p-lg-5 position-relative" style={{ zIndex: 2 }}>
            <div className="row align-items-center g-4">
              <div className="col-xl-8">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <div className="badge rounded-pill bg-primary bg-opacity-20 border border-primary border-opacity-25 px-3 py-2 fw-bold text-uppercase letter-spacing-2 x-small">
                    <FontAwesomeIcon icon={faGem} className="me-2" /> Elite Analytics
                  </div>
                  <div className="badge rounded-pill bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 fw-bold text-uppercase letter-spacing-2 x-small">
                    <FontAwesomeIcon icon={faShieldHalved} className="me-2" /> Enterprise Grade
                  </div>
                </div>
                <h1 className="display-5 fw-bold text-white mb-2">Productivity <span className="text-primary">Intelligence</span> Hub</h1>
                <p className="lead text-white text-opacity-75 mb-0">Transforming operational records into strategic delivery excellence through AI-driven cognitive analysis.</p>
              </div>
              <div className="col-xl-4">
                <div className="glass-stats-panel p-4 rounded-4 backdrop-blur shadow-sm border border-white border-opacity-10">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="text-white text-opacity-50 small fw-bold text-uppercase letter-spacing-1">System Capacity</span>
                    <span className="badge rounded-pill bg-primary px-3">Active</span>
                  </div>
                  <div className="d-flex align-items-end gap-2 mb-3">
                    <h2 className="text-white fw-bold mb-0">94.2</h2>
                    <span className="text-success small fw-bold mb-1"><FontAwesomeIcon icon={faArrowTrendUp} className="me-1" /> +2.4%</span>
                  </div>
                  <div className="progress rounded-pill bg-white bg-opacity-10" style={{ height: 6 }}>
                    <div className="progress-bar bg-primary shadow-glow" style={{ width: '94%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Abstract Decorations */}
          <div className="position-absolute top-0 end-0 m-n5 p-5 bg-primary opacity-10 rounded-circle" style={{ width: 400, height: 400, filter: 'blur(80px)' }} />
          <div className="position-absolute bottom-0 start-0 m-n5 p-5 bg-info opacity-10 rounded-circle" style={{ width: 300, height: 300, filter: 'blur(60px)' }} />
          <div className="position-absolute top-50 start-50 translate-middle opacity-5" style={{ pointerEvents: 'none' }}>
            <FontAwesomeIcon icon={faRobot} style={{ fontSize: '300px' }} />
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="row g-4 mb-5">
        {stats.map((stat, i) => (
          <div className="col-xl-3 col-md-6" key={i}>
            <div className={`card border-0 rounded-5 p-1 h-100 kpi-card-premium kpi-variant-${stat.color}`}>
              <div className="card-body p-4 position-relative overflow-hidden rounded-5 bg-white">
                {/* Background Pattern */}
                <div className="position-absolute top-0 end-0 m-n3 opacity-5 pattern-circle pt-3 pe-2">
                    <FontAwesomeIcon icon={stat.icon} style={{ fontSize: '100px', opacity: 0.3 }} />
                </div>

                <div className="d-flex justify-content-between align-items-start mb-4 position-relative">
                  <div className={`kpi-icon-wrapper rounded-4 shadow-sm bg-${stat.color} bg-opacity-10 text-${stat.color}`}>
                    <FontAwesomeIcon icon={stat.icon} className="fs-4" />
                  </div>
                  <div className="kpi-sparkline d-flex gap-1 align-items-end" style={{ height: '30px' }}>
                     {[40, 70, 45, 90, 65, 80].map((h, idx) => (
                        <div key={idx} className={`bg-${stat.color} bg-opacity-25 rounded-pill`} style={{ width: '4px', height: `${h}%` }} />
                     ))}
                  </div>
                </div>

                <div className="position-relative">
                  <h3 className="display-5 fw-bold mb-1 tracking-tight">{stat.value}</h3>
                  <p className="text-muted small fw-bold text-uppercase letter-spacing-2 mb-0 opacity-75">{stat.label}</p>
                </div>

                <div className="mt-4 pt-2">
                   <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="x-small fw-bold text-muted">Target Reach</span>
                      <span className={`x-small fw-bold text-${stat.color}`}>84%</span>
                   </div>
                   <div className="progress rounded-pill bg-light" style={{ height: 6 }}>
                      <div className={`progress-bar bg-${stat.color} rounded-pill shadow-glow-${stat.color}`} style={{ width: '84%' }} />
                   </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>


      <div className="row g-4">
        {/* Main Insights Feed */}
        <div className="col-xl-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={faRobot} className="text-primary fs-5" />
                <h5 className="fw-bold mb-0">AI Actionable Insights</h5>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-light btn-sm rounded-pill px-3 border-0 fw-bold small">Recent</button>
                <button className="btn btn-light btn-sm rounded-pill px-3 border-0 fw-bold small">High Impact</button>
              </div>
            </div>

            <div className="d-grid gap-4">
              {insights.map((item) => (
                <div key={item.id} className="p-4 rounded-4 bg-light bg-opacity-50 border-start border-4 border-primary position-relative insight-card transition-base">
                   <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <h6 className="fw-bold mb-0">{item.title}</h6>
                          <span className={`badge rounded-pill bg-${item.impact === 'Critical' ? 'danger' : item.impact === 'High' ? 'warning' : 'primary'} bg-opacity-10 text-${item.impact === 'Critical' ? 'danger' : item.impact === 'High' ? 'warning' : 'primary'} x-small px-3 fw-bold`}>
                            {item.impact} Impact
                          </span>
                        </div>
                        <p className="small text-muted mb-0 pe-5">{item.description}</p>
                      </div>
                      <div className="text-primary fw-bold small whitespace-nowrap">{item.score}</div>
                   </div>

                   <div className="bg-white rounded-4 p-3 border border-primary border-opacity-10 mb-3 shadow-sm border-dashed">
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <FontAwesomeIcon icon={faArrowRight} className="text-primary small" />
                        <span className="small fw-bold">Recommended Action:</span>
                      </div>
                      <p className="small mb-0 text-dark opacity-75">{item.action}</p>
                   </div>

                   <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar-circle-sm bg-primary text-white shadow-sm">{item.owner.charAt(0)}</div>
                          <span className="x-small fw-bold text-muted">Owner: {item.owner}</span>
                        </div>
                        <span className="x-small text-muted opacity-50">• {item.date}</span>
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-primary btn-sm rounded-pill px-4 fw-bold small shadow-sm">Execute Action</button>
                        <button className="btn btn-light btn-sm rounded-pill px-4 fw-bold small border transition-base">Dismiss</button>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </div>

          {/* Productivity Records System Integration */}
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={faLayerGroup} className="text-primary fs-5" />
                <h5 className="fw-bold mb-0">Live Productivity Feed</h5>
              </div>
              <span className="badge rounded-pill bg-light text-dark px-3 py-2 border small fw-bold">
                {records.length} Operational Records
              </span>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary opacity-50" role="status"></div>
                <p className="text-muted small mt-2">Syncing with record system...</p>
              </div>
            ) : records.length === 0 ? (
              <div className="text-center py-5 rounded-4 border border-dashed bg-light bg-opacity-25">
                <FontAwesomeIcon icon={faClock} className="fs-1 text-muted opacity-25 mb-3" />
                <h6 className="fw-bold text-muted">No records found</h6>
                <p className="text-muted small mb-0">Records added via \"Add New Record\" will appear here.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle custom-analytics-table">
                  <thead>
                    <tr className="text-muted small text-uppercase letter-spacing-1">
                      <th>Project / Reference</th>
                      <th>Output Metrics</th>
                      <th>Timeline</th>
                      <th className="text-end">Efficiency</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record) => (
                      <tr key={record.id}>
                        <td>
                          <div className="d-flex align-items-center gap-3">
                            <div className={`p-2 rounded-3 bg-${record.priority === 'Critical' ? 'danger' : record.priority === 'High' ? 'warning' : 'primary'} bg-opacity-10 text-${record.priority === 'Critical' ? 'danger' : record.priority === 'High' ? 'warning' : 'primary'}`}>
                                <FontAwesomeIcon icon={faChartLine} />
                            </div>
                            <div>
                              <div className="fw-bold text-dark small">{record.title}</div>
                              <div className="x-small text-muted">{record.owner || 'Global'} • {record.status}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="progress rounded-pill bg-light mb-1" style={{ height: 6, width: 120 }}>
                            <div className="progress-bar bg-primary" style={{ width: `${record.progress}%` }} />
                          </div>
                          <span className="x-small fw-bold text-muted">{record.progress}% Output Achieved</span>
                        </td>
                        <td>
                          <div className="x-small fw-bold text-dark">{record.due_date ? new Date(record.due_date).toLocaleDateString() : 'Continuous'}</div>
                          <div className="x-small text-muted">Deadline Status</div>
                        </td>
                        <td className="text-end">
                          <span className={`badge rounded-pill bg-${record.priority === 'Critical' ? 'danger' : record.priority === 'High' ? 'warning' : 'success'} bg-opacity-10 text-${record.priority === 'Critical' ? 'danger' : record.priority === 'High' ? 'warning' : 'success'} px-3 py-2 fw-bold`}>
                            {record.priority} Impact
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel: Impact Analysis */}
        <div className="col-xl-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h6 className="fw-bold mb-4">Velocity Gains Tracking</h6>
            <div className="p-4 rounded-4 bg-success bg-opacity-50 border border-success border-opacity-75 text-center mb-4 shadow-sm position-relative overflow-hidden">
               <div className="display-6 fw-bold mb-1">+42h</div>
               <p className="small mb-0 fw-bold">Saved this month through resolved insights</p>
               <FontAwesomeIcon icon={faBolt} className="position-absolute bottom-0 start-0 m-2 opacity-25 fs-1" />
            </div>
            
            <h6 className="fw-bold small mb-3 text-muted text-uppercase letter-spacing-1">Intelligence Focus Areas</h6>
            <div className="d-grid gap-4">
               {[
                 { label: 'QA Efficiency', score: 82, color: 'primary' },
                 { label: 'Dev Focus Time', score: 64, color: 'warning' },
                 { label: 'Meeting Density', score: 45, color: 'danger' },
               ].map((area, i) => (
                 <div key={i}>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                       <span className="small fw-bold text-dark">{area.label}</span>
                       <span className="small fw-bold text-muted">{area.score}%</span>
                    </div>
                    <div className="progress rounded-pill bg-light" style={{ height: 6 }}>
                       <div className={`progress-bar bg-${area.color} shadow-sm`} style={{ width: `${area.score}%` }} />
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="card border-0 shadow-sm rounded-4 p-4 bg-dark text-white position-relative overflow-hidden">
             <div className="position-relative" style={{ zIndex: 1 }}>
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2 text-primary">
                    <FontAwesomeIcon icon={faUsers} /> Collaborative Impact
                </h6>
                <p className="x-small text-white text-opacity-75 mb-4">High-impact actions are currently being reviewed by 3 department leads for deployment.</p>
                <div className="d-flex -space-x-2 mb-4">
                    {[1, 2, 3].map(n => (
                        <div key={n} className="avatar-circle border border-dark border-3 shadow-lg" style={{ background: `hsl(${n * 100}, 70%, 60%)`, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 'bold' }}>{String.fromCharCode(64 + n)}</div>
                    ))}
                    <div className="avatar-circle border border-dark border-3 bg-secondary small shadow-lg text-primary" style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontWeight: 'bold' }}>+5</div>
                </div>
                <button className="btn btn-primary w-100 rounded-pill py-3 fw-bold shadow-glow transition-base">Open Strategy Discussion Hub</button>
             </div>
             <div className="position-absolute bottom-0 end-0 m-n4 p-5 bg-primary opacity-10 rounded-circle" style={{ width: 150, height: 150 }} />
          </div>
        </div>
      </div>

      <style>{`
        /* Premium KPI Card Styles */
        .kpi-card-premium {
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
        }
        
        .kpi-card-premium:hover {
          transform: translateY(-8px) scale(1.02);
        }

        .kpi-icon-wrapper {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .kpi-card-premium:hover .kpi-icon-wrapper {
          transform: rotate(-10deg) scale(1.1);
        }

        /* Variant Gradients & Glows */
        .kpi-variant-primary { background: linear-gradient(135deg, #2828e2 0%, #1e1e9c 100%); }
        .kpi-variant-success { background: linear-gradient(135deg, #10B981 0%, #059669 100%); }
        .kpi-variant-info { background: linear-gradient(135deg, #3B82F6 0%, #2563EB 100%); }
        .kpi-variant-warning { background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); }

        .shadow-glow-primary { box-shadow: 0 0 15px rgba(40, 40, 226, 0.5); }
        .shadow-glow-success { box-shadow: 0 0 15px rgba(16, 185, 129, 0.5); }
        .shadow-glow-info { box-shadow: 0 0 15px rgba(59, 130, 246, 0.5); }
        .shadow-glow-warning { box-shadow: 0 0 15px rgba(245, 158, 11, 0.5); }

        .kpi-card-premium:hover.kpi-variant-primary { box-shadow: 0 20px 40px rgba(40, 40, 226, 0.2); }
        .kpi-card-premium:hover.kpi-variant-success { box-shadow: 0 20px 40px rgba(16, 185, 129, 0.2); }
        .kpi-card-premium:hover.kpi-variant-info { box-shadow: 0 20px 40px rgba(59, 130, 246, 0.2); }
        .kpi-card-premium:hover.kpi-variant-warning { box-shadow: 0 20px 40px rgba(245, 158, 11, 0.2); }

        .pattern-circle {
          transition: all 0.6s ease;
          transform: rotate(0deg);
        }
        .kpi-card-premium:hover .pattern-circle {
          transform: rotate(15deg) scale(1.1);
          opacity: 0.1 !important;
        }

        .tracking-tight { letter-spacing: -1px; }

        .productivity-premium-header .rounded-5 { border-radius: 2.5rem !important; }
        .backdrop-blur { backdrop-filter: blur(20px); }
        .glass-stats-panel { background: rgba(255, 255, 255, 0.05); }
        .shadow-glow { box-shadow: 0 0 15px rgba(40, 40, 226, 0.4); }
        
        .insight-card:hover {
          transform: translateX(5px);
          background: #fff !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }
        .border-dashed { border: 2px dashed rgba(0,0,0,0.05) !important; }
        .transition-base { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-lift-up:hover { transform: translateY(-5px); }
        .border-hover-primary:hover { border: 1px solid rgba(40, 40, 226, 0.2); }
        
        .avatar-circle-sm {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.65rem;
        }
        .-space-x-2 > * + * { margin-left: -0.65rem; }
        
        .custom-analytics-table th { border: 0; padding: 15px; }
        .custom-analytics-table td { border: 0; padding: 15px; border-bottom: 1px solid rgba(0,0,0,0.02); }
        
        .x-small { font-size: 11px; }
        .letter-spacing-1 { letter-spacing: 1px; }
        .letter-spacing-2 { letter-spacing: 2px; }
      `}</style>
    </div>
  );
};

export default TmsProductivityInsights;
