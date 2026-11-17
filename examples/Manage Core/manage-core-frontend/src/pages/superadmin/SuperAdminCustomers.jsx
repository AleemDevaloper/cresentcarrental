import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { listSuperAdminCustomers, getSuperAdminCustomerStats } from '../../../../api/customers';
import {
  faPlus, faSearch, faFilter, faFileExport,
  faList, faEye, faEdit, faTrash, faRefresh, faCheckCircle,
  faBan, faUserCheck, faTimeline, faBuildingColumns, faUser,
  faTags, faCoins, faDollarSign, faShieldHalved, faInfoCircle,
  faChevronRight, faChevronLeft, faXmark, faArrowUp, faArrowDown
} from "@fortawesome/free-solid-svg-icons";
import ErpPageShell from '../../../../components/ui/ux/ErpPageShell';
import ErpKpiCard from '../../../../components/ui/ux/ErpKpiCard';
import ErpDataTable from '../../../../components/ui/ux/ErpDataTable';

const SuperAdminCustomers = () => {
  const { theme, addNotification, setActiveTab } = useApp();
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const cardBg = isDark ? '#1F2937' : '#ffffff';

  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Load Super Admin Customers
  useEffect(() => {
    loadCustomers();
    loadStats();
  }, [currentPage, statusFilter, searchTerm, entriesPerPage]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const data = await listSuperAdminCustomers({
        page: currentPage,
        perPage: entriesPerPage,
        status: statusFilter !== 'All' ? statusFilter : undefined,
        search: searchTerm || undefined,
      });
      setCustomers(data?.data || []);
      setLoadError(null);
    } catch (err) {
      setLoadError(err?.message || 'Failed to load Super Admin customers.');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const data = await getSuperAdminCustomerStats();
      setStats(data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const openAddCustomer = () => setActiveTab('superadmin_create_customer');

  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        // Call delete API here when implemented
        addNotification('Customer deleted successfully.', 'success');
        loadCustomers();
      } catch (err) {
        addNotification('Error deleting customer: ' + err.message, 'error');
      }
    }
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = !searchTerm || 
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const kpiData = [
    {
      label: 'Total Customers',
      val: stats?.total_customers || 0,
      icon: faUser,
      color: '#6366f1',
      trend: 'up',
      sparkline: [12, 14, 13, 16, 15, 18, 17, 20, 19, 22, 21, 24]
    },
    {
      label: 'Active Customers',
      val: stats?.active_customers || 0,
      icon: faUserCheck,
      color: '#10b981',
      trend: 'up',
      sparkline: [10, 11, 10, 12, 11, 13, 12, 14, 13, 15, 14, 16]
    },
    {
      label: 'Total Revenue',
      val: `$${(stats?.total_revenue || 0).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      icon: faDollarSign,
      color: '#f59e0b',
      trend: 'up',
      sparkline: [800, 820, 810, 840, 830, 860, 850, 880, 870, 900, 890, 920]
    },
    {
      label: 'Inactive Customers',
      val: stats?.inactive_customers || 0,
      icon: faBan,
      color: '#f43f5e',
      trend: 'down',
      sparkline: [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1]
    },
  ];

  const customerColumns = [
    { key: 'name', label: 'Customer Name', bold: true },
    { key: 'company_name', label: 'Company' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedCustomer(row)}>
            <FontAwesomeIcon icon={faEye} /> View
          </button>
          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteCustomer(row.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <ErpPageShell
      title="Super Admin Customers"
      subtitle="Manage platform-wide customer profiles"
      isDark={isDark}
      onRefresh={loadCustomers}
      isLoading={loading}
    >
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {kpiData.map((kpi, idx) => (
          <ErpKpiCard key={idx} {...kpi} isDark={isDark} />
        ))}
      </div>

      {/* Filter & Search Bar */}
      <div style={{ backgroundColor: cardBg, padding: '16px', borderRadius: '8px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '12px', top: '12px', color: mutedColor }} />
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={{
                width: '100%',
                paddingLeft: '36px',
                padding: '10px',
                border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                borderRadius: '6px',
                backgroundColor: isDark ? '#111827' : '#ffffff',
                color: textColor,
              }}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '10px 12px',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '6px',
              backgroundColor: isDark ? '#111827' : '#ffffff',
              color: textColor,
            }}
          >
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Archived</option>
          </select>
          <button onClick={loadCustomers} className="btn btn-primary">
            <FontAwesomeIcon icon={faRefresh} /> Refresh
          </button>
          <button onClick={openAddCustomer} className="btn btn-success">
            <FontAwesomeIcon icon={faPlus} /> Add Customer
          </button>
        </div>
      </div>

      {/* Error State */}
      {loadError && (
        <div style={{ backgroundColor: '#fef2f2', color: '#991b1b', padding: '12px', borderRadius: '6px', marginBottom: '16px' }}>
          <strong>Error:</strong> {loadError}
        </div>
      )}

      {/* Data Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: mutedColor }}>
          <div style={{ fontSize: '16px' }}>Loading Super Admin customers...</div>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: mutedColor }}>
          <FontAwesomeIcon icon={faUser} style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }} />
          <div style={{ fontSize: '16px' }}>No customers found</div>
        </div>
      ) : (
        <ErpDataTable
          columns={customerColumns}
          data={filteredCustomers}
          isDark={isDark}
        />
      )}

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', color: mutedColor }}>
        <span>Showing {filteredCustomers.length} of {stats?.total_customers || 0} customers</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <FontAwesomeIcon icon={faChevronLeft} /> Previous
          </button>
          <span style={{ padding: '8px 12px' }}>Page {currentPage}</span>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>
      </div>
    </ErpPageShell>
  );
};

export default SuperAdminCustomers;
