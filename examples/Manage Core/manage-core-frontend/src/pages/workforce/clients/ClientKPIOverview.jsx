import React from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faUsers, 
    faUserCheck, 
    faUserXmark, 
    faArchive,
    faArrowUp,
    faArrowDown
} from '@fortawesome/free-solid-svg-icons';

const KPICard = ({ title, value, trend, trendValue, icon, color, progress }) => {
    const { t } = useTranslation();
    return (
        <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-0 shadow-sm rounded-4 h-100 overflow-hidden position-relative">
                <div className={`position-absolute top-0 start-0 w-100 h-1 bg-${color}`} style={{ opacity: 0.1 }}></div>
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <div className={`bg-${color} bg-opacity-10 p-3 rounded-4`}>
                            <FontAwesomeIcon icon={icon} className={`text-${color} fs-4`} />
                        </div>
                        <div className="text-end">
                            <span className={`badge ${trend === 'up' ? 'bg-success' : 'bg-danger'} bg-opacity-10 text-${trend === 'up' ? 'success' : 'danger'} rounded-pill px-2 py-1`}>
                                <FontAwesomeIcon icon={trend === 'up' ? faArrowUp : faArrowDown} className="me-1 small" />
                                {trendValue}%
                            </span>
                        </div>
                    </div>
                    <div>
                        <h6 className="text-muted fw-semibold small mb-1">{title}</h6>
                        <h3 className="fw-bold mb-2">{value}</h3>
                        <div className="progress rounded-pill" style={{ height: '6px' }}>
                            <div 
                                className={`progress-bar bg-${color} rounded-pill`} 
                                role="progressbar" 
                                style={{ width: `${progress}%` }} 
                                aria-valuenow={progress} 
                                aria-valuemin="0" 
                                aria-valuemax="100"
                            ></div>
                        </div>
                        <p className="text-muted small mt-2 mb-0">
                            {trend === 'up' ? '↑' : '↓'} {trendValue}% {t('from_last_month')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ClientKPIOverview = () => {
    const { t } = useTranslation();
    
    return (
        <div className="row g-4 mb-4">
            <KPICard 
                title={t('total_clients')} 
                value="3,500" 
                trend="up" 
                trendValue="22.5" 
                icon={faUsers} 
                color="primary"
                progress={75}
            />
            <KPICard 
                title={t('active_clients')} 
                value="2,900" 
                trend="up" 
                trendValue="15.2" 
                icon={faUserCheck} 
                color="success"
                progress={82}
            />
            <KPICard 
                title={t('inactive_clients')} 
                value="450" 
                trend="down" 
                trendValue="3.8" 
                icon={faUserXmark} 
                color="warning"
                progress={15}
            />
            <KPICard 
                title={t('archived_clients')} 
                value="150" 
                trend="down" 
                trendValue="10.5" 
                icon={faArchive} 
                color="secondary"
                progress={5}
            />
        </div>
    );
};

export default ClientKPIOverview;
