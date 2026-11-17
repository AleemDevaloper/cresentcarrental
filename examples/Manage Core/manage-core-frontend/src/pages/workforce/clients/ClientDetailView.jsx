import React, { useState } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faArrowLeft, 
    faBuilding, 
    faEnvelope, 
    faPhone, 
    faGlobe, 
    faCalendarAlt,
    faChartPie,
    faProjectDiagram,
    faFileInvoice,
    faFileAlt,
    faComments,
    faFileContract,
    faUsers,
    faClock,
    faStickyNote,
    faLifeRing
} from '@fortawesome/free-solid-svg-icons';

const ClientDetailView = ({ client, onBack }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('overview');

    const tabs = [
        { id: 'overview', label: t('overview'), icon: faChartPie },
        { id: 'projects', label: t('projects'), icon: faProjectDiagram },
        { id: 'invoices', label: t('invoices'), icon: faFileInvoice },
        { id: 'documents', label: t('documents'), icon: faFileAlt },
        { id: 'meetings', label: t('meetings'), icon: faCalendarAlt },
        { id: 'contracts', label: t('contracts'), icon: faFileContract },
        { id: 'contacts', label: t('contacts'), icon: faUsers },
        { id: 'timeline', label: t('timeline'), icon: faClock },
        { id: 'notes', label: t('notes'), icon: faStickyNote },
        { id: 'support', label: t('support'), icon: faLifeRing },
    ];

    return (
        <div className="client-detail-view p-4" style={{ backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
            {/* Header */}
            <div className="mb-4">
                <button className="btn btn-link text-decoration-none text-muted p-0 mb-3" onClick={onBack}>
                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                    {t('back_to_clients')}
                </button>
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-4">
                        <div className="bg-white rounded-circle shadow-sm d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                            <span className="fw-bold text-primary display-6">{client.name.charAt(0)}</span>
                        </div>
                        <div>
                            <h2 className="fw-bold mb-1">{client.name}</h2>
                            <div className="d-flex gap-3 text-muted small">
                                <span><FontAwesomeIcon icon={faBuilding} className="me-1" /> {client.company_name}</span>
                                <span><FontAwesomeIcon icon={faGlobe} className="me-1" /> {client.country}</span>
                                <span><FontAwesomeIcon icon={faCalendarAlt} className="me-1" /> {t('client_since')}: {client.since}</span>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <button className="btn btn-outline-secondary rounded-pill px-4 bg-white border-0 shadow-sm">{t('edit')}</button>
                        <button className="btn btn-primary rounded-pill px-4 shadow-sm">{t('contact_client')}</button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="row g-4">
                {/* Sidebar Info */}
                <div className="col-lg-3">
                    <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
                        <h6 className="fw-bold mb-3">{t('contact_details')}</h6>
                        <div className="mb-3">
                            <label className="text-muted small d-block mb-1">{t('email')}</label>
                            <div className="d-flex align-items-center gap-2">
                                <FontAwesomeIcon icon={faEnvelope} className="text-muted extra-small" />
                                <span className="small fw-semibold">{client.email}</span>
                            </div>
                        </div>
                        <div className="mb-3">
                            <label className="text-muted small d-block mb-1">{t('phone')}</label>
                            <div className="d-flex align-items-center gap-2">
                                <FontAwesomeIcon icon={faPhone} className="text-muted extra-small" />
                                <span className="small fw-semibold">{client.phone}</span>
                            </div>
                        </div>
                        <hr />
                        <h6 className="fw-bold mb-3">{t('client_segmentation')}</h6>
                        <div className="mb-2">
                            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3">{client.type}</span>
                        </div>
                        <div className="mb-2">
                            <span className="badge bg-info bg-opacity-10 text-info rounded-pill px-3">{client.industry}</span>
                        </div>
                        <hr />
                        <h6 className="fw-bold mb-3">{t('health_score')}</h6>
                        <div className="d-flex align-items-center gap-3">
                            <div className={`display-6 fw-bold text-${client.health_score >= 80 ? 'success' : 'warning'}`}>{client.health_score}</div>
                            <div>
                                <div className="fw-bold small">{t('excellent')}</div>
                                <div className="text-muted extra-small">Based on 12 metrics</div>
                            </div>
                        </div>
                    </div>

                    <div className="card border-0 shadow-sm rounded-4 p-4">
                        <h6 className="fw-bold mb-3">{t('account_manager')}</h6>
                        <div className="d-flex align-items-center gap-3">
                            <div className="bg-light rounded-circle" style={{ width: '40px', height: '40px' }}></div>
                            <div>
                                <div className="fw-bold small">Alex Johnson</div>
                                <div className="text-muted extra-small">Senior Account Executive</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Tabs */}
                <div className="col-lg-9">
                    <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden">
                        <div className="card-header bg-white border-0 p-0">
                            <div className="nav nav-tabs border-0 px-4 pt-3 flex-nowrap overflow-auto hide-scrollbar">
                                {tabs.map(tab => (
                                    <button 
                                        key={tab.id}
                                        className={`nav-link border-0 pb-3 px-3 small fw-bold transition-all position-relative ${activeTab === tab.id ? 'text-primary active-tab-indicator' : 'text-muted'}`}
                                        onClick={() => setActiveTab(tab.id)}
                                        style={{ whiteSpace: 'nowrap' }}
                                    >
                                        <FontAwesomeIcon icon={tab.icon} className="me-2" />
                                        {tab.label}
                                        {activeTab === tab.id && (
                                            <div className="position-absolute bottom-0 start-0 w-100 bg-primary" style={{ height: '3px' }}></div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="card-body p-4">
                            {activeTab === 'overview' && (
                                <div className="row g-4">
                                    <div className="col-md-4">
                                        <div className="p-4 rounded-4 bg-light text-center">
                                            <h6 className="text-muted small mb-2">{t('revenue_generated')}</h6>
                                            <h4 className="fw-bold mb-0">$45,200.00</h4>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="p-4 rounded-4 bg-light text-center">
                                            <h6 className="text-muted small mb-2">{t('pending_invoices')}</h6>
                                            <h4 className="fw-bold mb-0 text-warning">03</h4>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="p-4 rounded-4 bg-light text-center">
                                            <h6 className="text-muted small mb-2">{t('active_contracts')}</h6>
                                            <h4 className="fw-bold mb-0 text-success">02</h4>
                                        </div>
                                    </div>
                                    <div className="col-12 mt-4">
                                        <h5 className="fw-bold mb-4">{t('client_activity')}</h5>
                                        <div className="activity-timeline position-relative ps-4 border-start py-2 ms-2">
                                            <div className="activity-item mb-4 position-relative">
                                                <div className="position-absolute start-0 translate-middle-x bg-primary rounded-circle border border-4 border-white shadow-sm" style={{ width: '16px', height: '16px', left: '-16px' }}></div>
                                                <div className="small text-muted mb-1">2 hours ago</div>
                                                <div className="fw-bold small">Meeting Scheduled</div>
                                                <div className="text-muted extra-small">Quarterly Business Review with Brain Thompson</div>
                                            </div>
                                            <div className="activity-item mb-4 position-relative">
                                                <div className="position-absolute start-0 translate-middle-x bg-success rounded-circle border border-4 border-white shadow-sm" style={{ width: '16px', height: '16px', left: '-16px' }}></div>
                                                <div className="small text-muted mb-1">Yesterday</div>
                                                <div className="fw-bold small">Invoice Paid</div>
                                                <div className="text-muted extra-small">Invoice #INV-2024-001 has been settled</div>
                                            </div>
                                            <div className="activity-item position-relative">
                                                <div className="position-absolute start-0 translate-middle-x bg-info rounded-circle border border-4 border-white shadow-sm" style={{ width: '16px', height: '16px', left: '-16px' }}></div>
                                                <div className="small text-muted mb-1">3 days ago</div>
                                                <div className="fw-bold small">Contract Signed</div>
                                                <div className="text-muted extra-small">Service Level Agreement renewed for 2024</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab !== 'overview' && (
                                <div className="text-center py-5">
                                    <FontAwesomeIcon icon={faStickyNote} className="display-4 text-light mb-3" />
                                    <h5 className="text-muted">{t('content_coming_soon')}</h5>
                                    <p className="text-muted small">We are working on bringing {activeTab} data to this view.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDetailView;
