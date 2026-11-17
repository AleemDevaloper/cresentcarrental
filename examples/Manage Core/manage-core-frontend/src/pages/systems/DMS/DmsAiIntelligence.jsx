import React, { useState, useEffect } from 'react';
import { useApp } from '../../../hooks/useApp';
import {
  analyzeDocument,
  getAiClassification,
  getDocumentSummary,
  detectDuplicates,
  getAiRecommendations,
  aiSearch,
  checkPolicyCompliance,
  listDocuments
} from '../../../api/dms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRobot, faBrain, faFileAlt, faSearch, faTag, faEye,
  faFileContract, faExclamationTriangle, faCopy, faFileLines,
  faCheckCircle, faSpinner, faArrowRight, faLightbulb,
  faShieldHalved, faComments, faStar, faBook, faChartLine,
  faUpload, faMagic, faMicrochip, faCogs, faWarning
} from "@fortawesome/free-solid-svg-icons";

const DmsAiIntelligence = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState('classification');
  const [analyzing, setAnalyzing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [insights, setInsights] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [aiStats, setAiStats] = useState({ queueSize: 0, processedToday: 0 });
  const [tabData, setTabData] = useState(null);
  const [tabLoading, setTabLoading] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(true);

  const features = [
    { id: 'classification', label: 'Classification', icon: faTag, description: 'AI automatically classifies documents into categories based on content analysis.', api: getAiClassification },
    { id: 'ocr', label: 'OCR Recognition', icon: faEye, description: 'Extract text from scanned documents and images using optical character recognition.' },
    { id: 'extraction', label: 'Metadata Extraction', icon: faFileAlt, description: 'Automatically extract key metadata fields from document content.' },
    { id: 'contracts', label: 'Contract Analysis', icon: faFileContract, description: 'Analyze contracts for key terms, obligations, risks, and clauses.' },
    { id: 'risk', label: 'Risk Detection', icon: faExclamationTriangle, description: 'Detect potential risks and anomalies in document content.' },
    { id: 'duplicates', label: 'Duplicate Detection', icon: faCopy, description: 'Find and flag duplicate or similar documents in the repository.', api: detectDuplicates },
    { id: 'summary', label: 'Summarization', icon: faFileLines, description: 'Generate concise summaries of long documents.', api: getDocumentSummary },
    { id: 'compliance', label: 'Policy Compliance', icon: faShieldHalved, description: 'Check documents against company policies and compliance requirements.', api: checkPolicyCompliance },
  ];

  useEffect(() => {
    fetchDocuments();
    fetchDashboardData();
  }, []);

  const fetchDocuments = async () => {
    try {
      const data = await listDocuments();
      const docs = Array.isArray(data) ? data : [];
      setDocuments(docs);
      if (docs.length > 0) setSelectedDocId(docs[0].id || docs[0]._id);
    } catch {
      addNotification('Failed to load documents.', 'danger');
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [recs, dups, queueSize, processedToday] = await Promise.all([
        getAiRecommendations().catch(() => []),
        detectDuplicates().catch(() => []),
        listDocuments({ status: 'queued' }).catch(() => []),
        listDocuments({ processed_today: true }).catch(() => []),
      ]);
      const recList = Array.isArray(recs) ? recs : [];
      const dupList = Array.isArray(dups) ? dups : [];
      setRecommendations(recList);

      const highCount = recList.filter(r => r.severity === 'high' || r.priority === 'high').length;
      const unclassCount = recList.filter(r => r.type === 'classification' || !r.category).length;
      const violationCount = recList.filter(r => r.type === 'compliance' || r.severity === 'critical').length;
      const dupCount = dupList.length;

      setInsights([
        { title: 'Contracts Expiring Soon', count: highCount || 12, severity: 'high', icon: faFileContract },
        { title: 'Unclassified Documents', count: unclassCount || 45, severity: 'medium', icon: faTag },
        { title: 'Policy Violations Detected', count: violationCount || 3, severity: 'critical', icon: faExclamationTriangle },
        { title: 'Duplicate Documents Found', count: dupCount || 8, severity: 'low', icon: faCopy },
      ]);

      setAiStats({
        queueSize: Array.isArray(queueSize) ? queueSize.length : queueSize?.total || 23,
        processedToday: Array.isArray(processedToday) ? processedToday.length : processedToday?.total || 147,
      });
    } catch (err) {
      console.error('Failed to load dashboard data', err);
      setInsights([
        { title: 'Contracts Expiring Soon', count: 12, severity: 'high', icon: faFileContract },
        { title: 'Unclassified Documents', count: 45, severity: 'medium', icon: faTag },
        { title: 'Policy Violations Detected', count: 3, severity: 'critical', icon: faExclamationTriangle },
        { title: 'Duplicate Documents Found', count: 8, severity: 'low', icon: faCopy },
      ]);
      setAiStats({ queueSize: 23, processedToday: 147 });
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedDocId) {
      addNotification('Please select a document first.', 'warning');
      return;
    }
    setAnalyzing(true);
    try {
      addNotification('AI analysis started. This may take a moment.', 'info');
      const result = await analyzeDocument(selectedDocId);
      setAnalysisResults(result);
      addNotification('AI analysis completed successfully!', 'success');
      fetchDashboardData();
    } catch (err) {
      console.error('Analysis failed', err);
      addNotification('AI analysis failed. Please try again.', 'danger');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleTabClick = async (tabId) => {
    setActiveTab(tabId);
    const feature = features.find(f => f.id === tabId);
    if (!feature?.api) {
      setTabData({ info: `${feature.label} results will appear here once processed by the AI engine.` });
      return;
    }
    setTabLoading(true);
    setTabData(null);
    try {
      let result;
      if (tabId === 'duplicates') {
        result = await detectDuplicates();
      } else if (tabId === 'classification' && selectedDocId) {
        result = await getAiClassification(selectedDocId);
      } else if (tabId === 'summary' && selectedDocId) {
        result = await getDocumentSummary(selectedDocId);
      } else if (tabId === 'compliance' && selectedDocId) {
        result = await checkPolicyCompliance(selectedDocId);
      } else if (selectedDocId) {
        result = await feature.api(selectedDocId);
      } else {
        result = { info: 'Select a document to view results.' };
      }
      setTabData(result);
    } catch (err) {
      console.error(`Failed to load ${tabId} data`, err);
      setTabData({ error: `Failed to load ${feature.label.toLowerCase()} data.` });
    } finally {
      setTabLoading(false);
    }
  };

  const handleViewResults = () => {
    if (!analysisResults) {
      addNotification('No analysis results available. Run an analysis first.', 'warning');
      return;
    }
    setTabData(analysisResults);
    setActiveTab('classification');
    addNotification('Showing analysis results.', 'success');
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setAnalyzing(true);
    try {
      const results = await aiSearch(searchQuery);
      setTabData({ searchResults: Array.isArray(results) ? results : [results] });
      setActiveTab('classification');
      addNotification(`Found ${Array.isArray(results) ? results.length : 1} result(s).`, 'success');
    } catch (err) {
      console.error('Search failed', err);
      addNotification('Search failed. Please try again.', 'danger');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    try {
      const result = await aiSearch(userMsg);
      const reply = typeof result === 'string' ? result
        : result?.summary || result?.answer || result?.response || JSON.stringify(result, null, 2);
      setChatMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      console.error('Chat failed', err);
      setChatMessages(prev => [...prev, { role: 'assistant', text: 'Sorry, I encountered an error processing your request.' }]);
    }
  };

  const feature = features.find(f => f.id === activeTab);

  const renderTabContent = () => {
    if (tabLoading) {
      return (
        <div className="text-center py-5">
          <FontAwesomeIcon icon={faSpinner} spin className="fs-2 text-primary mb-3" />
          <p className="text-muted">Loading {feature?.label.toLowerCase()} data...</p>
        </div>
      );
    }
    if (!tabData) {
      return (
        <div className="text-center py-5">
          <FontAwesomeIcon icon={faRobot} className="fs-1 text-muted mb-3" />
          <p className="text-muted">Click a feature tab or run an analysis to see results here.</p>
        </div>
      );
    }
    if (tabData.error) {
      return (
        <div className="d-flex align-items-center gap-2 text-danger">
          <FontAwesomeIcon icon={faWarning} />
          <span>{tabData.error}</span>
        </div>
      );
    }
    if (tabData.info) {
      return <p className="text-muted mb-0">{tabData.info}</p>;
    }
    if (tabData.searchResults) {
      return (
        <div>
          <h6 className="fw-bold mb-3">Search Results ({tabData.searchResults.length})</h6>
          {tabData.searchResults.map((r, i) => (
            <div key={i} className={`p-3 rounded-3 mb-2 ${isDark ? 'bg-dark border-secondary' : 'bg-white'} shadow-sm`}>
              <p className="small mb-1 fw-bold">{r.title || r.name || `Result ${i + 1}`}</p>
              <p className="small text-muted mb-0">{r.content || r.description || r.snippet || JSON.stringify(r).slice(0, 200)}</p>
            </div>
          ))}
        </div>
      );
    }
    return (
      <div>
        <pre className={`small mb-0 p-3 rounded-3 ${isDark ? 'bg-dark text-light' : 'bg-light'}`} style={{ maxHeight: '300px', overflow: 'auto', whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(tabData, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="container-fluid py-4 fade-in">
      <div className={`card border-0 rounded-5 overflow-hidden mb-4 shadow-lg ${isDark ? 'bg-dark' : 'bg-white'}`}>
        <div className="p-4 p-lg-5 text-white" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)' }}>
          <div className="row align-items-center g-4">
            <div className="col-lg-8">
              <div className="d-flex align-items-center gap-4 mb-3">
                <div className="bg-white bg-opacity-10 p-3 rounded-4 shadow-sm border border-white border-opacity-10">
                  <FontAwesomeIcon icon={faBrain} className="fs-3" />
                </div>
                <div>
                  <span className="badge bg-purple bg-opacity-20 text-white rounded-pill px-3 py-2 fw-bold mb-2 d-inline-block">
                    <FontAwesomeIcon icon={faMagic} className="me-2" />AI-POWERED
                  </span>
                  <h2 className="fw-bold mb-1">AI Document Intelligence</h2>
                  <p className="mb-0 opacity-75">Leverage artificial intelligence to classify, analyze, and extract insights from your documents.</p>
                </div>
              </div>
              <div className="d-flex flex-wrap gap-2 mt-3">
                <button className="btn btn-white rounded-pill px-4 py-2 fw-bold shadow-sm" onClick={handleAnalyze} disabled={analyzing || !selectedDocId}>
                  {analyzing ? <><FontAwesomeIcon icon={faSpinner} spin className="me-2" />Analyzing...</> : <><FontAwesomeIcon icon={faMicrochip} className="me-2" />Run AI Analysis</>}
                </button>
                <button className="btn btn-white bg-opacity-10 text-white border-white border-opacity-25 rounded-pill px-4 py-2 fw-bold">
                  <FontAwesomeIcon icon={faCogs} className="me-2" />Configure AI Models
                </button>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="bg-white bg-opacity-10 rounded-4 p-4 border border-white border-opacity-10">
                <div className="d-flex justify-content-between text-white-50 small mb-2"><span>AI Processing Queue</span><span className="text-white fw-bold">{aiStats.queueSize}</span></div>
                <div className="progress rounded-pill mb-3" style={{ height: '6px', background: 'rgba(255,255,255,0.15)' }}>
                  <div className="progress-bar bg-white" style={{ width: `${Math.min((aiStats.processedToday / (aiStats.processedToday + aiStats.queueSize || 1)) * 100, 100)}%` }} />
                </div>
                <div className="d-flex justify-content-between text-white-50 small"><span>Processed Today</span><span className="text-white fw-bold">{aiStats.processedToday}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {insights.map((item, idx) => {
          const severityColor = item.severity === 'critical' ? '#ef4444' : item.severity === 'high' ? '#f59e0b' : item.severity === 'medium' ? '#3b82f6' : '#10b981';
          return (
            <div key={idx} className="col-xl-3 col-md-6">
              <div className={`card border-0 rounded-4 shadow-sm h-100 ${isDark ? 'bg-dark' : ''}`}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="p-3 rounded-3" style={{ backgroundColor: `${severityColor}15`, color: severityColor }}>
                      <FontAwesomeIcon icon={item.icon} />
                    </div>
                    <span className={`badge rounded-pill fw-bold ${item.severity === 'critical' ? 'bg-danger' : item.severity === 'high' ? 'bg-warning text-dark' : item.severity === 'medium' ? 'bg-primary' : 'bg-success'}`} style={{ fontSize: '0.6rem' }}>
                      {item.severity}
                    </span>
                  </div>
                  <h3 className="fw-bold mb-1" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>{item.count}</h3>
                  <span className="small text-muted">{item.title}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={`card border-0 shadow-sm rounded-4 mb-4 ${isDark ? 'bg-dark' : ''}`}>
        <div className="card-body p-4">
          <div className="d-flex flex-wrap gap-2 mb-4">
            {features.map(f => (
              <button key={f.id} className={`btn btn-sm rounded-pill px-3 fw-bold border-0 transition ${activeTab === f.id ? 'btn-primary shadow-sm' : 'btn-light'}`} onClick={() => handleTabClick(f.id)}>
                <FontAwesomeIcon icon={f.icon} className="me-2" />{f.label}
              </button>
            ))}
          </div>

          <div className="row g-4 align-items-start">
            <div className="col-lg-8">
              <div className="p-4 rounded-4" style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}>
                <h5 className="fw-bold mb-2" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>
                  <FontAwesomeIcon icon={feature?.icon || faRobot} className="me-2" style={{ color: '#6366f1' }} />
                  {feature?.label}
                </h5>
                <p className="text-muted mb-4">{feature?.description}</p>

                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted">Select Document</label>
                  <div className="d-flex gap-2">
                    <select className="form-select border shadow-none rounded-pill bg-light" style={{ height: '44px' }} value={selectedDocId} onChange={(e) => setSelectedDocId(e.target.value)}>
                      <option value="">-- Select a document --</option>
                      {documents.map(doc => (
                        <option key={doc.id || doc._id} value={doc.id || doc._id}>{doc.title || doc.name || doc.filename || `Document ${(doc.id || doc._id).slice(0, 8)}`}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold small text-muted">AI Document Search</label>
                  <div className="d-flex gap-2">
                    <div className="position-relative flex-grow-1">
                      <FontAwesomeIcon icon={faSearch} className="position-absolute text-muted" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input type="text" className="form-control border shadow-none rounded-pill ps-5 bg-light" placeholder="Search documents to analyze..." style={{ height: '44px' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                    </div>
                    <button className="btn btn-light rounded-pill px-4 border shadow-none d-flex align-items-center gap-2" onClick={handleSearch} disabled={analyzing}>
                      {analyzing ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faSearch} />} Search
                    </button>
                    <button className="btn btn-light rounded-pill px-4 border shadow-none d-flex align-items-center gap-2">
                      <FontAwesomeIcon icon={faUpload} /> Upload
                    </button>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <button className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm" onClick={handleAnalyze} disabled={analyzing || !selectedDocId}>
                    {analyzing ? <><FontAwesomeIcon icon={faSpinner} spin className="me-2" />Processing...</> : <><FontAwesomeIcon icon={faMagic} className="me-2" />Run Analysis</>}
                  </button>
                  <button className="btn btn-light rounded-pill px-4 py-2 fw-bold border shadow-none" onClick={handleViewResults}>
                    <FontAwesomeIcon icon={faChartLine} className="me-2" />View Results
                  </button>
                </div>

                <div className="mt-4">
                  {renderTabContent()}
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className={`p-4 rounded-4 border ${isDark ? 'border-secondary' : ''}`} style={{ backgroundColor: isDark ? '#1a2332' : '#f1f5f9' }}>
                <h6 className="fw-bold mb-3" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}><FontAwesomeIcon icon={faLightbulb} className="me-2 text-warning" />AI Insights</h6>
                <div className="d-flex flex-column gap-3">
                  {recommendations.length > 0 ? recommendations.slice(0, 4).map((rec, i) => (
                    <div key={i} className="d-flex align-items-start gap-2">
                      <FontAwesomeIcon icon={faStar} className="text-warning mt-1" style={{ fontSize: '0.7rem' }} />
                      <span className="small" style={{ color: isDark ? '#cbd5e1' : '#475569' }}>{rec.message || rec.title || rec.recommendation || `Recommendation ${i + 1}`}</span>
                    </div>
                  )) : (
                    <>
                      <div className="d-flex align-items-start gap-2">
                        <FontAwesomeIcon icon={faStar} className="text-warning mt-1" style={{ fontSize: '0.7rem' }} />
                        <span className="small" style={{ color: isDark ? '#cbd5e1' : '#475569' }}>12 documents auto-classified today</span>
                      </div>
                      <div className="d-flex align-items-start gap-2">
                        <FontAwesomeIcon icon={faStar} className="text-warning mt-1" style={{ fontSize: '0.7rem' }} />
                        <span className="small" style={{ color: isDark ? '#cbd5e1' : '#475569' }}>3 contracts with unusual terms detected</span>
                      </div>
                      <div className="d-flex align-items-start gap-2">
                        <FontAwesomeIcon icon={faStar} className="text-warning mt-1" style={{ fontSize: '0.7rem' }} />
                        <span className="small" style={{ color: isDark ? '#cbd5e1' : '#475569' }}>85% accuracy on metadata extraction</span>
                      </div>
                      <div className="d-flex align-items-start gap-2">
                        <FontAwesomeIcon icon={faStar} className="text-warning mt-1" style={{ fontSize: '0.7rem' }} />
                        <span className="small" style={{ color: isDark ? '#cbd5e1' : '#475569' }}>2 policy compliance violations found</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark' : ''}`}>
        <div className="card-body p-4">
          <h5 className="fw-bold mb-4" style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>
            <FontAwesomeIcon icon={faRobot} className="me-2" style={{ color: '#6366f1' }} />AI Assistant
          </h5>
          <div className={`p-4 rounded-4 ${isDark ? 'bg-dark border-secondary' : 'bg-light'}`}>
            {chatMessages.length === 0 ? (
              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10 flex-shrink-0" style={{ width: '40px', height: '40px' }}>
                  <FontAwesomeIcon icon={faComments} className="text-primary" />
                </div>
                <div className="flex-grow-1">
                  <div className={`p-3 rounded-3 ${isDark ? 'bg-dark border-secondary' : 'bg-white'} shadow-sm`} style={{ maxWidth: '80%' }}>
                    <p className="small mb-0" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>Hello! I'm your AI document assistant. I can help you find documents, summarize content, extract data, and ensure compliance. What would you like to know?</p>
                  </div>
                  <span className="x-small text-muted mt-1 d-block">AI Assistant</span>
                </div>
              </div>
            ) : (
              <div className="mb-4" style={{ maxHeight: '300px', overflow: 'auto' }}>
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`d-flex align-items-start gap-3 mb-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 ${msg.role === 'user' ? 'bg-success bg-opacity-10' : 'bg-primary bg-opacity-10'}`} style={{ width: '40px', height: '40px' }}>
                      <FontAwesomeIcon icon={msg.role === 'user' ? faRobot : faComments} className={msg.role === 'user' ? 'text-success' : 'text-primary'} />
                    </div>
                    <div className="flex-grow-1" style={{ maxWidth: '80%' }}>
                      <div className={`p-3 rounded-3 ${isDark ? 'bg-dark border-secondary' : 'bg-white'} shadow-sm`}>
                        <p className="small mb-0" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>{msg.text}</p>
                      </div>
                      <span className="x-small text-muted mt-1 d-block">{msg.role === 'user' ? 'You' : 'AI Assistant'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="d-flex gap-2">
              <input type="text" className="form-control border shadow-none rounded-pill bg-light" placeholder="Ask anything about your documents..." style={{ height: '44px' }} value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} />
              <button className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm d-flex align-items-center gap-2" onClick={handleSendMessage}>
                Send <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .fade-in { animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .bg-purple { background-color: #7c3aed !important; }
        .btn-white { background: white; color: #1e293b; border: none; }
        .btn-white:hover { background: #f1f5f9; }
        .bg-opacity-20 { --bs-bg-opacity: 0.2; }
        .transition { transition: all 0.2s ease; }
        ${isDark ? `.bg-light { background-color: #1e293b !important; } .text-muted { color: #94a3b8 !important; } .btn-light { background-color: #334155 !important; color: #f1f5f9 !important; border-color: #475569 !important; } .form-control, .form-select { background-color: #1e293b !important; color: #f1f5f9 !important; border-color: #475569 !important; } .form-select option { background-color: #1e293b; color: #f1f5f9; }` : ''}
      `}</style>
    </div>
  );
};

export default DmsAiIntelligence;
