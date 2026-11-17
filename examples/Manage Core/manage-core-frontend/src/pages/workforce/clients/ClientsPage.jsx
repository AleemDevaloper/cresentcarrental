import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../hooks/useTranslation';
import ClientKPIOverview from './ClientKPIOverview';
import ClientSearchControls from './ClientSearchControls';
import ClientGridView from './ClientGridView';
import ClientTableView from './ClientTableView';
import ClientDetailView from './ClientDetailView';
import { faPlus, faFileImport, faFileExport, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ClientsPage = () => {
    const { t } = useTranslation();
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
    const [selectedClient, setSelectedClient] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        status: 'All',
        industry: 'All',
        country: 'All'
    });

    // Mock data for initial development
    const [clients, setClients] = useState([
        {
            id: 1,
            name: 'Brian Thompson',
            company_name: 'Collins Group',
            email: 'brian@example.com',
            phone: '+1 578 209 4965',
            country: 'United Kingdom',
            status: 'Active',
            projects_completed: 2,
            projects_total: 12,
            health_score: 85,
            type: 'Enterprise',
            industry: 'Technology',
            since: '2024-01-15'
        },
        {
            id: 2,
            name: 'Sarah Jenkins',
            company_name: 'Sarah Logistics',
            email: 'sarah@logistics.com',
            phone: '+1 423 555 0199',
            country: 'USA',
            status: 'Active',
            projects_completed: 8,
            projects_total: 10,
            health_score: 95,
            type: 'VIP',
            industry: 'Logistics',
            since: '2023-11-20'
        }
    ]);

    const handleViewDetails = (client) => {
        setSelectedClient(client);
    };

    const handleBack = () => {
        setSelectedClient(null);
    };

    if (selectedClient) {
        return <ClientDetailView client={selectedClient} onBack={handleBack} />;
    }

    return (
        <div className="clients-page-container p-4" style={{ minHeight: '100vh' }}>
            {/* Header Actions */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-0">{t('clients')}</h2>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary rounded-pill px-3 d-flex align-items-center gap-2 border-0 shadow-sm bg-white">
                        <FontAwesomeIcon icon={faLayerGroup} />
                        {t('bulk_actions')}
                    </button>
                    <button className="btn btn-outline-secondary rounded-pill px-3 d-flex align-items-center gap-2 border-0 shadow-sm bg-white">
                        <FontAwesomeIcon icon={faFileExport} />
                        {t('export_clients')}
                    </button>
                    <button className="btn btn-outline-secondary rounded-pill px-3 d-flex align-items-center gap-2 border-0 shadow-sm bg-white">
                        <FontAwesomeIcon icon={faFileImport} />
                        {t('import_clients')}
                    </button>
                    <button className="btn btn-primary rounded-pill px-4 d-flex align-items-center gap-2 shadow-sm">
                        <FontAwesomeIcon icon={faPlus} />
                        {t('add_new_client')}
                    </button>
                </div>
            </div>

            {/* KPI Overview */}
            <ClientKPIOverview />

            {/* Search & Controls */}
            <ClientSearchControls 
                viewMode={viewMode} 
                setViewMode={setViewMode} 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filters={filters}
                setFilters={setFilters}
            />

            {/* Content View */}
            {viewMode === 'grid' ? (
                <ClientGridView clients={clients} onViewDetails={handleViewDetails} />
            ) : (
                <ClientTableView clients={clients} onViewDetails={handleViewDetails} />
            )}
        </div>
    );
};

export default ClientsPage;
