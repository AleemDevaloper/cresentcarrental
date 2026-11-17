import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faEllipsisVertical, 
    faArrowRight, 
    faEnvelope, 
    faPhone,
    faGlobe,
    faEdit,
    faProjectDiagram,
    faFileInvoice,
    faCalendarAlt,
    faFileContract,
    faArchive,
    faTrash
} from '@fortawesome/free-solid-svg-icons';

const ClientCard = ({ client, onViewDetails }) => {
    const { t } = useTranslation();

    const getHealthColor = (score) => {
        if (score >= 90) return 'success';
        if (score >= 75) return 'primary';
        if (score >= 50) return 'warning';
        return 'danger';
    };

    return (
        <div className="col-xl-3 col-lg-4 col-md-6 mb-4">
            <div className="card border-0 shadow-sm rounded-4 h-100 transition-hover">
                <div className="card-body p-4">
                    {/* Header: Avatar & Menu */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="position-relative">
                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '64px', height: '64px' }}>
                                <span className="fw-bold text-primary fs-4">{client.name.charAt(0)}</span>
                            </div>
                            <span className="position-absolute bottom-0 end-0 translate-middle-x p-1 bg-success border border-2 border-white rounded-circle"></span>
                        </div>
                        <div className="dropdown">
                            <button className="btn btn-link text-muted p-0 shadow-none" type="button" data-bs-toggle="dropdown">
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end border-0 shadow rounded-4">
                                <li><button className="dropdown-item py-2"><FontAwesomeIcon icon={faEdit} className="me-2 small" /> {t('edit_client')}</button></li>
                                <li><button className="dropdown-item py-2"><FontAwesomeIcon icon={faProjectDiagram} className="me-2 small" /> {t('assign_project')}</button></li>
                                <li><button className="dropdown-item py-2"><FontAwesomeIcon icon={faFileInvoice} className="me-2 small" /> {t('create_invoice')}</button></li>
                                <li><button className="dropdown-item py-2"><FontAwesomeIcon icon={faCalendarAlt} className="me-2 small" /> {t('schedule_meeting')}</button></li>
                                <li><button className="dropdown-item py-2"><FontAwesomeIcon icon={faFileContract} className="me-2 small" /> {t('view_contracts')}</button></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><button className="dropdown-item py-2 text-warning"><FontAwesomeIcon icon={faArchive} className="me-2 small" /> {t('archive_client')}</button></li>
                                <li><button className="dropdown-item py-2 text-danger"><FontAwesomeIcon icon={faTrash} className="me-2 small" /> {t('delete_client')}</button></li>
                            </ul>
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="mb-4">
                        <h5 className="fw-bold mb-1 text-truncate">{client.name}</h5>
                        <p className="text-muted small mb-0">
                            <FontAwesomeIcon icon={faGlobe} className="me-1" /> {client.country}
                        </p>
                    </div>

                    {/* Company Info Box */}
                    <div className="bg-light rounded-4 p-3 mb-4">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <span className="text-primary fw-bold small text-truncate">{client.company_name}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2 mb-2 small text-muted">
                            <FontAwesomeIcon icon={faEnvelope} className="extra-small" />
                            <span className="text-truncate">{client.email}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2 small text-muted">
                            <FontAwesomeIcon icon={faPhone} className="extra-small" />
                            <span>{client.phone}</span>
                        </div>
                    </div>

                    {/* Engagement Summary */}
                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="text-muted small fw-semibold">{t('projects')}</span>
                            <span className="fw-bold small">{client.projects_completed} / {client.projects_total}</span>
                        </div>
                        <div className="progress rounded-pill" style={{ height: '8px' }}>
                            <div 
                                className={`progress-bar bg-${getHealthColor(client.health_score)} rounded-pill`} 
                                role="progressbar" 
                                style={{ width: `${(client.projects_completed / client.projects_total) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button 
                        className="btn btn-outline-primary w-100 rounded-pill py-2 d-flex align-items-center justify-content-center gap-2 border-2 transition-all hover-bg-primary hover-text-white"
                        onClick={() => onViewDetails(client)}
                    >
                        {t('view_details')}
                        <FontAwesomeIcon icon={faArrowRight} className="small" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClientCard;
