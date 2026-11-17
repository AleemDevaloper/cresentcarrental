import React, { useState } from 'react';
import { useApp } from '../../../hooks/useApp';
import { useTranslation } from '../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRobot, faExclamationTriangle, faCheckCircle, faClock,
  faUserGraduate, faMoneyBillWave, faChalkboardTeacher,
  faCalendarAlt, faChartLine, faMicrochip, faPaperPlane,
  faFileAlt, faTimes, faLightbulb, faBrain, faArrowUp,
  faArrowDown, faStar, faBell, faSync
} from '@fortawesome/free-solid-svg-icons';

const AI_INSIGHTS = [
  { id: 1, title: 'Students with declining attendance', desc: '12 students have missed >20% classes this month', severity: 'high', icon: faExclamationTriangle, color: '#ef4444', stat: '12', trend: 'up' },
  { id: 2, title: 'Students at academic risk', desc: '8 students with GPA below 2.0 need intervention', severity: 'high', icon: faUserGraduate, color: '#ef4444', stat: '8', trend: 'up' },
  { id: 3, title: 'High-performing students', desc: '45 students maintained GPA >3.5 this semester', severity: 'low', icon: faStar, color: '#10b981', stat: '45', trend: 'up' },
  { id: 4, title: 'Pending fee alerts', desc: 'Rs. 8.5L outstanding from 180 defaulters', severity: 'medium', icon: faMoneyBillWave, color: '#f59e0b', stat: '180', trend: 'up' },
  { id: 5, title: 'Teachers with heavy workload', desc: '5 teachers teaching >25 contact hours/week', severity: 'medium', icon: faChalkboardTeacher, color: '#f59e0b', stat: '5', trend: 'down' },
  { id: 6, title: 'Upcoming deadlines', desc: '15 assignments, 8 exams due next week', severity: 'low', icon: faCalendarAlt, color: '#6366f1', stat: '23', trend: 'up' },
  { id: 7, title: 'Predicted admission trends', desc: '18% increase projected for Fall 2026 intake', severity: 'low', icon: faChartLine, color: '#06b6d4', stat: '+18%', trend: 'up' },
  { id: 8, title: 'Resource utilization analysis', desc: 'Library and lab usage at 72% capacity', severity: 'low', icon: faMicrochip, color: '#8b5cf6', stat: '72%', trend: 'down' },
];

const SUGGESTED_QUESTIONS = [
  'Which students need academic intervention?',
  'What is the current fee collection status?',
  'Show me attendance trends this month',
  'Predict next semester enrollment',
  'List teachers with heavy workload',
];

const EmsAiAssistant = () => {
  const { theme } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I\'m your EMS AI Assistant. I can help you analyze institutional data and provide insights. What would you like to know?' },
  ]);
  const [input, setInput] = useState('');

  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: input }, { role: 'ai', text: `I've analyzed the data related to "${input}". Based on current institutional metrics, I recommend reviewing the relevant dashboard section for detailed insights.` }]);
    setInput('');
  };

  const getSeverityClass = (severity) => {
    if (severity === 'high') return 'bg-danger-subtle text-danger border-danger';
    if (severity === 'medium') return 'bg-warning-subtle text-warning border-warning';
    return 'bg-success-subtle text-success border-success';
  };

  return (
    <div className={`p-4 ${isDark ? 'text-white' : ''}`} style={{ background: isDark ? 'linear-gradient(135deg, #060816 0%, #111827 45%, #111c2f 100%)' : 'linear-gradient(135deg, #f8faff 0%, #ffffff 60%, #eef2ff 100%)', minHeight: '100vh' }}>
      <div className={`rounded-4 p-4 mb-4 border-0 shadow-sm ${isDark ? 'bg-dark border border-secondary' : 'bg-white'}`} style={{ background: isDark ? 'rgba(17,24,39,0.95)' : 'rgba(255,255,255,0.92)', border: `1px solid ${borderColor}`, boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 rounded-4" style={{ background: 'rgba(99,102,241,0.12)', color: '#6366f1' }}>
              <FontAwesomeIcon icon={faBrain} size="xl" />
            </div>
            <div>
              <h4 className="fw-bold mb-1">AI Education Assistant</h4>
              <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Intelligent insights and recommendations for your institution</p>
            </div>
          </div>
          <button className="btn btn-primary rounded-3 px-4 d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faFileAlt} /> Generate Report
          </button>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {AI_INSIGHTS.map(insight => (
          <div key={insight.id} className="col-xl-3 col-lg-4 col-md-6">
            <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ boxShadow: '0 14px 36px rgba(15, 23, 42, 0.08)' }}>
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="p-2 rounded-3" style={{ backgroundColor: `${insight.color}15` }}>
                    <FontAwesomeIcon icon={insight.icon} style={{ color: insight.color, fontSize: '16px' }} />
                  </div>
                  <span className={`badge rounded-pill x-small fw-semibold ${getSeverityClass(insight.severity)}`} style={{ fontSize: '9px' }}>
                    {insight.severity === 'high' ? 'Critical' : insight.severity === 'medium' ? 'Warning' : 'Normal'}
                  </span>
                </div>
                <div className="h4 fw-bold mb-0" style={{ color: insight.color }}>{insight.stat}</div>
                <div className="small fw-bold mb-1" style={{ color: textColor }}>{insight.title}</div>
                <div className="x-small" style={{ color: mutedColor }}>{insight.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)' }}>
            <div className="card-body p-4 d-flex flex-column" style={{ height: '450px' }}>
              <h6 className="fw-bold mb-3" style={{ color: textColor }}>
                <FontAwesomeIcon icon={faRobot} className="me-2" style={{ color: '#6366f1' }} />AI Chat
              </h6>
              <div className="flex-grow-1 overflow-auto mb-3" style={{ scrollBehavior: 'smooth' }}>
                {messages.map((msg, idx) => (
                  <div key={idx} className={`d-flex mb-3 ${msg.role === 'user' ? 'justify-content-end' : ''}`}>
                    <div className={`rounded-4 p-3 ${msg.role === 'user' ? 'bg-primary text-white' : `${isDark ? 'bg-dark-subtle' : 'bg-light'}`}`} style={{ maxWidth: '85%' }}>
                      <div className="small">{msg.text}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="d-flex gap-2">
                <input type="text" className={`form-control rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`} placeholder="Ask a question about your institution..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
                <button className="btn btn-primary rounded-3 px-4" onClick={handleSend}>
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-5">
          <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`} style={{ boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)' }}>
            <div className="card-body p-4">
              <h6 className="fw-bold mb-3" style={{ color: textColor }}><FontAwesomeIcon icon={faLightbulb} className="me-2 text-warning" />Suggested Questions</h6>
              {SUGGESTED_QUESTIONS.map((q, idx) => (
                <button key={idx} className="btn w-100 text-start p-3 mb-2 rounded-3 small" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fc', border: `1px solid ${borderColor}`, color: textColor }} onClick={() => { setInput(q); }}>
                  <FontAwesomeIcon icon={faLightbulb} className="me-2 text-warning" />{q}
                </button>
              ))}
              <hr style={{ borderColor }} />
              <button className="btn btn-outline-primary rounded-3 w-100 mt-2 d-flex align-items-center justify-content-center gap-2">
                <FontAwesomeIcon icon={faSync} /> Refresh Insights
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`.x-small { font-size: 11px; }`}</style>
    </div>
  );
};

export default EmsAiAssistant;
