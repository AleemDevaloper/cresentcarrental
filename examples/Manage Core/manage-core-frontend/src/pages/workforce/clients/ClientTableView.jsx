import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical, faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const ClientTableView = ({ clients, onViewDetails }) => {
    const { t } = useTranslation();

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Active': return 'bg-success';
            case 'Inactive': return 'bg-warning';
            case 'Archived': return 'bg-secondary';
            default: return 'bg-primary';
        }
    };

    return (
        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                        <tr>
                            <th className="px-4 py-3 border-0 small text-uppercase text-muted fw-bold">{t('client')}</th>
                            <th className="py-3 border-0 small text-uppercase text-muted fw-bold">{t('company')}</th>
                            <th className="py-3 border-0 small text-uppercase text-muted fw-bold">{t('status')}</th>
                            <th className="py-3 border-0 small text-uppercase text-muted fw-bold">{t('industry')}</th>
                            <th className="py-3 border-0 small text-uppercase text-muted fw-bold">{t('projects')}</th>
                            <th className="py-3 border-0 small text-uppercase text-muted fw-bold text-end px-4">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client) => (
                            <tr key={client.id} className="border-bottom-0">
                                <td className="px-4 py-3 border-0">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                            <span className="fw-bold text-primary small">{client.name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <div className="fw-bold">{client.name}</div>
                                            <div className="text-muted small">{client.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 border-0">
                                    <div className="fw-semibold">{client.company_name}</div>
                                    <div className="text-muted small">{client.country}</div>
                                </td>
                                <td className="py-3 border-0">
                                    <span className={`badge ${getStatusBadge(client.status)} bg-opacity-10 text-${client.status === 'Active' ? 'success' : client.status === 'Inactive' ? 'warning' : 'secondary'} rounded-pill px-3`}>
                                        {client.status}
                                    </span>
                                </td>
                                <td className="py-3 border-0">
                                    <span className="text-muted small">{client.industry}</span>
                                </td>
                                <td className="py-3 border-0">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="progress rounded-pill flex-grow-1" style={{ height: '6px', width: '60px' }}>
                                            <div className="progress-bar bg-primary" style={{ width: `${(client.projects_completed / client.projects_total) * 100}%` }}></div>
                                        </div>
                                        <span className="small text-muted">{client.projects_completed}/{client.projects_total}</span>
                                    </div>
                                </td>
                                <td className="py-3 border-0 text-end px-4">
                                    <div className="d-flex justify-content-end gap-2">
                                        <button className="btn btn-light btn-sm rounded-circle p-2" onClick={() => onViewDetails(client)}>
                                            <FontAwesomeIcon icon={faEye} className="text-muted" />
                                        </button>
                                        <button className="btn btn-light btn-sm rounded-circle p-2">
                                            <FontAwesomeIcon icon={faEdit} className="text-muted" />
                                        </button>
                                        <div className="dropdown">
                                            <button className="btn btn-light btn-sm rounded-circle p-2" type="button" data-bs-toggle="dropdown">
                                                <FontAwesomeIcon icon={faEllipsisVertical} className="text-muted" />
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end border-0 shadow rounded-4">
                                                <li><button className="dropdown-item py-2 text-danger"><FontAwesomeIcon icon={faTrash} className="me-2 small" /> {t('delete')}</button></li>
                                            </ul>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {clients.length === 0 && (
                <div className="text-center py-5">
                    <p className="text-muted">No clients found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default ClientTableView;
