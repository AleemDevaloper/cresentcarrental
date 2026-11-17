import React, { useState, useEffect } from 'react';
import { 
    FiShield, FiUsers, FiSettings, FiLock, FiAlertTriangle, 
    FiTrendingUp, FiPieChart, FiBarChart2, FiActivity, FiFilter,
    FiRefreshCw, FiChevronRight, FiClock, FiCheckCircle, FiInfo,
    FiDownload, FiTrash2
} from 'react-icons/fi';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend, 
    ArcElement, 
    PointElement, 
    LineElement, 
    RadialLinearScale,
    Filler
} from 'chart.js';
import { Bar, Doughnut, Radar, Line } from 'react-chartjs-2';
import { useTranslation } from '../../hooks/useTranslation';
import client, { clearCache } from '../../api/client';

ChartJS.register(
    CategoryScale, 
    LinearScale, 
    BarElement, 
    PointElement,
    LineElement,
    RadialLinearScale,
    ArcElement,
    Filler,
    Title, 
    Tooltip, 
    Legend
);

const RoleDashboard = ({ isDark = false, colors: propColors = null, addNotification = null }) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [purging, setPurging] = useState(false);
    const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    
    // States for live API data
    const [metrics, setMetrics] = useState([
        { label: 'Total Roles', value: 0, change: 'Fetching...', icon: <FiShield />, color: '#4f46e5', bg: 'rgba(79, 70, 229, 0.1)' },
        { label: 'Users Assigned', value: 0, change: 'Fetching...', icon: <FiUsers />, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
        { label: 'Custom Roles', value: 0, change: 'Fetching...', icon: <FiSettings />, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
        { label: 'Permission Groups', value: 0, change: 'Fetching...', icon: <FiLock />, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
        { label: 'High Access Roles', value: 0, change: 'Fetching...', icon: <FiAlertTriangle />, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
    ]);

    const colors = propColors || {
        indigo: '#4f46e5', indigoLight: '#818cf8', indigoBg: 'rgba(79,70,229,0.12)',
        emerald: '#10b981', emeraldLight: '#34d399',
        amber: '#f59e0b', amberLight: '#fbbf24',
        rose: '#ef4444', roseLight: '#f87171',
        purple: '#8b5cf6', purpleLight: '#a78bfa',
        cyan: '#06b6d4', cyanLight: '#22d3ee',
        pink: '#ec4899', pinkLight: '#f472b6',
        slate: '#64748b', slateLight: '#94a3b8',
    };

    const cardStyle = {
        borderRadius: '16px',
        background: isDark ? '#1e2235' : '#ffffff',
        border: isDark ? '1px solid #2d3248' : '1px solid #e2e8f0',
        color: isDark ? '#f1f5f9' : '#1e293b',
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 6px -1px rgba(0,0,0,0.05)',
        transition: 'all 0.3s ease'
    };

    const [usersPerRoleData, setUsersPerRoleData] = useState({
        labels: [],
        datasets: [{
            label: 'Users',
            data: [],
            backgroundColor: [],
            borderRadius: 6,
            borderSkipped: false,
        }]
    });

    const [roleDistributionData, setRoleDistributionData] = useState({
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [colors.indigo, colors.emerald, colors.amber, colors.rose, colors.purple],
            borderWidth: 0,
            hoverOffset: 12,
        }]
    });

    const [usersPerRoleSummary, setUsersPerRoleSummary] = useState([
        { label: 'Total Users', value: 0, color: colors.indigo },
        { label: 'Avg / Role', value: 0, color: colors.emerald },
        { label: 'Largest', value: '-', color: colors.cyan },
    ]);

    const [permissionCoverageData, setPermissionCoverageData] = useState({
        labels: ['Projects', 'Tasks', 'Documents', 'Finance', 'HR', 'Reports', 'Settings'],
        datasets: [{
            label: 'Project Manager Role',
            data: [90, 85, 80, 40, 30, 75, 20],
            backgroundColor: 'rgba(79, 70, 229, 0.2)',
            borderColor: '#4f46e5',
            pointBackgroundColor: '#4f46e5',
        }]
    });

    const [moduleUsageData, setModuleUsageData] = useState({
        labels: ['PMS', 'HRMS', 'DMS', 'FMS', 'CRM'],
        datasets: [{
            label: 'Full Access',
            data: [12, 8, 10, 5, 15],
            backgroundColor: '#4f46e5',
        }, {
            label: 'Read Only',
            data: [20, 15, 12, 8, 10],
            backgroundColor: '#a5b4fc',
        }]
    });

    const [heatmapData, setHeatmapData] = useState([]);
    const [inactiveRoles, setInactiveRoles] = useState([]);

    const showToast = (message, type = 'success') => {
        if (addNotification) {
            addNotification(message, type);
        } else {
            setToast({ show: true, message, type });
            setTimeout(() => setToast({ show: false, message: '', type: '' }), 4000);
        }
    };

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const res = await client.get('/roles/dashboard-stats');
            const d = res.data;
            
            // Update Metrics State
            setMetrics([
                { label: 'Total Roles', value: d.metrics.total_roles, change: 'Active in system', icon: <FiShield />, color: colors.indigo, bg: `${colors.indigo}18` },
                { label: 'Users Assigned', value: d.metrics.users_assigned, change: 'Across all groups', icon: <FiUsers />, color: colors.emerald, bg: `${colors.emerald}18` },
                { label: 'Custom Roles', value: d.metrics.custom_roles, change: 'Custom definitions', icon: <FiSettings />, color: colors.amber, bg: `${colors.amber}18` },
                { label: 'Permission Groups', value: d.metrics.permission_groups, change: 'Access variables', icon: <FiLock />, color: colors.purple, bg: `${colors.purple}18` },
                { label: 'High Access Roles', value: d.metrics.high_access_roles, change: 'Super/Admin profiles', icon: <FiAlertTriangle />, color: colors.rose, bg: `${colors.rose}18` },
            ]);

            // Update Users per Role Horizontal Bar Chart
            setUsersPerRoleData({
                labels: d.users_per_role.labels,
                datasets: [{
                    label: 'Users',
                    data: d.users_per_role.data,
                    backgroundColor: d.users_per_role.colors,
                    borderRadius: 6,
                    borderSkipped: false,
                }]
            });

            // Calculate largest role
            let maxVal = -1;
            let largestRole = '-';
            d.users_per_role.labels.forEach((label, idx) => {
                const val = d.users_per_role.data[idx];
                if (val > maxVal) {
                    maxVal = val;
                    largestRole = `${label} (${val})`;
                }
            });

            setUsersPerRoleSummary([
                { label: 'Total Users', value: d.users_per_role.total_users, color: colors.indigo },
                { label: 'Avg / Role', value: d.users_per_role.avg_per_role, color: colors.emerald },
                { label: 'Largest', value: largestRole, color: colors.cyan },
            ]);

            // Update Distribution Doughnut Chart
            setRoleDistributionData({
                labels: Object.keys(d.role_distribution),
                datasets: [{
                    data: Object.values(d.role_distribution),
                    backgroundColor: [colors.indigo, colors.emerald, colors.amber, colors.rose, colors.purple],
                    borderWidth: 0,
                    hoverOffset: 12,
                }]
            });

            // Heatmap & Inactive Roles
            setHeatmapData(d.heatmap);
            setInactiveRoles(d.inactive_roles);

        } catch (err) {
            console.error("Failed to load roles dashboard statistics", err);
            showToast("Failed to load live roles dashboard stats.", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handlePurgeUnused = async () => {
        setPurging(true);
        try {
            const res = await client.post('/roles/purge-unused');
            clearCache('/roles');
            showToast(res.data?.message || 'Purged unused roles successfully.');
            fetchDashboardData();
        } catch (err) {
            console.error("Purging failed:", err);
            showToast(err.response?.data?.message || "Purge request failed.", "error");
        } finally {
            setPurging(false);
        }
    };

    const handleExport = (format) => {
        setExportDropdownOpen(false);
        const dataToExport = {
            timestamp: new Date().toISOString(),
            metrics: metrics.reduce((acc, curr) => ({ ...acc, [curr.label]: curr.value }), {}),
            distribution: roleDistributionData.labels.reduce((acc, curr, idx) => ({ ...acc, [curr]: roleDistributionData.datasets[0].data[idx] + '%' }), {}),
            inactive: inactiveRoles
        };

        if (format === 'json') {
            const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `role_dashboard_export_${Date.now()}.json`;
            a.click();
            showToast("JSON Config report downloaded.");
        } else if (format === 'csv') {
            let csv = 'Metric,Value\n';
            metrics.forEach(m => { csv += `"${m.label}","${m.value}"\n`; });
            csv += '\nRole Distribution,Percentage\n';
            roleDistributionData.labels.forEach((label, idx) => {
                csv += `"${label}","${roleDistributionData.datasets[0].data[idx]}%"\n`;
            });
            csv += '\nInactive Roles,Assigned Users,Status\n';
            inactiveRoles.forEach(r => {
                csv += `"${r.name}","${r.users}","${r.status}"\n`;
            });

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `role_dashboard_report_${Date.now()}.csv`;
            a.click();
            showToast("Excel-compatible CSV downloaded.");
        } else if (format === 'print') {
            window.print();
        }
    };

    const getHeatmapColor = (value) => {
        if (value >= 100) return colors.indigo;
        if (value >= 70) return colors.indigoLight;
        if (value >= 40) return isDark ? '#312e81' : '#c7d2fe';
        if (value > 0) return isDark ? '#1e1b4b' : '#e0e7ff';
        return isDark ? '#0f172a' : '#f8fafc';
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                labels: {
                    color: isDark ? '#94a3b8' : '#64748b',
                    font: { size: 10, family: 'Inter' }
                }
            },
            tooltip: {
                backgroundColor: isDark ? '#0f172a' : 'rgba(15,23,42,0.9)',
                titleColor: isDark ? '#f1f5f9' : '#fff',
                bodyColor: isDark ? '#f1f5f9' : '#fff',
                cornerRadius: 8,
                padding: 10
            }
        },
        scales: {
            x: {
                grid: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' },
                ticks: { color: isDark ? '#94a3b8' : '#64748b', font: { size: 9 } }
            },
            y: {
                grid: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' },
                ticks: { color: isDark ? '#94a3b8' : '#64748b', font: { size: 9 } }
            }
        }
    };

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: '300px' }}>
                <div className="spinner-border text-primary mb-3" role="status">
                    <span className="visually-hidden">Loading dashboard...</span>
                </div>
                <div className="text-muted small">Loading live system configuration & statistics...</div>
            </div>
        );
    }

    return (
        <div className="role-dashboard-container p-1">
            {/* Custom Local Notification Toast */}
            {toast.show && (
                <div className={`alert alert-${toast.type === 'error' ? 'danger' : 'success'} fade show position-fixed top-0 end-0 m-3 shadow`} style={{ zIndex: 9999, borderRadius: '12px' }} role="alert">
                    <FiInfo className="me-2" /> {toast.message}
                </div>
            )}

            {/* Header / Filter Toolbar */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                <div>
                    <h5 className="fw-bold mb-0" style={{ color: isDark ? '#f8fafc' : '#0f172a' }}>Role Management Studio</h5>
                    <p className="text-muted extra-small mb-0">Monitor permission nodes, module density, access control levels, and role metrics.</p>
                </div>
                <div className="d-flex gap-2 position-relative">
                    <button 
                        onClick={fetchDashboardData}
                        className="btn btn-sm btn-outline-secondary rounded-pill px-3 extra-small d-flex align-items-center gap-1"
                        style={{ borderColor: isDark ? '#334155' : '#cbd5e1', color: isDark ? '#cbd5e1' : '#475569' }}
                    >
                        <FiRefreshCw className="me-1" /> Refresh
                    </button>
                    <button 
                        onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                        className="btn btn-sm btn-primary rounded-pill px-3 extra-small d-flex align-items-center gap-1"
                    >
                        <FiDownload className="me-1" /> Export Report
                    </button>
                    {exportDropdownOpen && (
                        <div className={`dropdown-menu show position-absolute end-0 mt-5 p-2 shadow-lg border-0`} style={{ background: isDark ? '#1e2235' : '#ffffff', zIndex: 1000, borderRadius: '12px' }}>
                            <button className="dropdown-item extra-small d-flex align-items-center gap-2" style={{ color: isDark ? '#cbd5e1' : '#334155' }} onClick={() => handleExport('csv')}><FiPieChart /> Excel (CSV)</button>
                            <button className="dropdown-item extra-small d-flex align-items-center gap-2" style={{ color: isDark ? '#cbd5e1' : '#334155' }} onClick={() => handleExport('json')}><FiSettings /> JSON Config</button>
                            <button className="dropdown-item extra-small d-flex align-items-center gap-2" style={{ color: isDark ? '#cbd5e1' : '#334155' }} onClick={() => handleExport('print')}><FiActivity /> Print report</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Key Metrics */}
            <div className="row g-3 mb-4">
                {metrics.map((m, idx) => (
                    <div key={idx} className="col-md">
                        <div className="card h-100 border-0" style={cardStyle}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, backgroundColor: m.bg, color: m.color }}>
                                        {m.icon}
                                    </div>
                                    <span className="extra-small fw-bold text-success">{m.change}</span>
                                </div>
                                <h3 className="fw-bold mb-0">{m.value}</h3>
                                <div className="text-muted extra-small fw-medium">{m.label}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Row 2: Users & Distribution */}
            <div className="row g-4 mb-4">
                <div className="col-lg-7">
                    <div className="card h-100 border-0" style={cardStyle}>
                        <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="fw-bold mb-1" style={{ color: isDark ? '#f8fafc' : '#0f172a' }}>Users Per Role</h6>
                                <div className="extra-small text-muted">Distribution of user assignments across system roles</div>
                            </div>
                        </div>
                        <div className="card-body px-4 pt-2 pb-4">
                            <div className="row g-2 mb-3">
                                {usersPerRoleSummary.map((s, i) => (
                                    <div key={i} className="col-4">
                                        <div className="p-2 rounded-3 text-center" style={{ background: `${s.color}0d` }}>
                                            <div className="fw-bold fs-5" style={{ color: s.color, lineHeight: 1.2 }}>{s.value}</div>
                                            <div className="extra-small text-muted" style={{ lineHeight: 1.2 }}>{s.label}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Bar 
                                data={usersPerRoleData} 
                                options={{ 
                                    indexAxis: 'y',
                                    responsive: true,
                                    maintainAspectRatio: true,
                                    plugins: { 
                                        legend: { display: false },
                                        tooltip: {
                                            backgroundColor: isDark ? '#0f172a' : 'rgba(15,23,42,0.9)',
                                            titleFont: { size: 11, weight: '600' },
                                            bodyFont: { size: 12 },
                                            padding: { x: 10, y: 8 },
                                            cornerRadius: 8,
                                            callbacks: {
                                                label: (ctx) => `${ctx.raw} users`
                                            }
                                        }
                                    },
                                    scales: { 
                                        x: { 
                                            grid: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' },
                                            ticks: { color: isDark ? '#94a3b8' : '#64748b', font: { size: 10 } }
                                        }, 
                                        y: { 
                                            grid: { display: false },
                                            ticks: { color: isDark ? '#94a3b8' : '#64748b', font: { size: 10, weight: '600' } }
                                        } 
                                    },
                                    animation: { duration: 800, easing: 'easeOutQuart' }
                                }} 
                            />
                        </div>
                    </div>
                </div>
                <div className="col-lg-5">
                    <div className="card h-100 border-0" style={cardStyle}>
                        <div className="card-header bg-transparent border-0 pt-4 px-4">
                            <h6 className="fw-bold mb-1" style={{ color: isDark ? '#f8fafc' : '#0f172a' }}>Role Distribution</h6>
                            <div className="extra-small text-muted">Percentage split across role categories</div>
                        </div>
                        <div className="card-body px-4 pt-2 pb-4 d-flex flex-column align-items-center">
                            <div style={{ position: 'relative', width: 200, height: 200 }}>
                                <Doughnut 
                                    data={roleDistributionData} 
                                    options={{ 
                                        cutout: '78%',
                                        plugins: { 
                                            legend: { display: false },
                                            tooltip: {
                                                backgroundColor: isDark ? '#0f172a' : 'rgba(15,23,42,0.9)',
                                                titleFont: { size: 11, weight: '600' },
                                                bodyFont: { size: 12 },
                                                padding: { x: 10, y: 8 },
                                                cornerRadius: 8,
                                                callbacks: {
                                                    label: (ctx) => `${ctx.label}: ${ctx.raw}%`
                                                }
                                            }
                                        },
                                        animation: { animateRotate: true, duration: 1000, easing: 'easeOutQuart' }
                                    }} 
                                />
                                <div style={{
                                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                                    textAlign: 'center', pointerEvents: 'none'
                                }}>
                                    <div className="fw-bold fs-3" style={{ color: colors.indigo, lineHeight: 1 }}>100%</div>
                                    <div className="extra-small text-muted" style={{ lineHeight: 1.2 }}>Coverage</div>
                                </div>
                            </div>
                            <div className="d-flex flex-wrap gap-3 mt-3 justify-content-center">
                                {roleDistributionData.labels.map((label, i) => {
                                    const bgColors = [colors.indigo, colors.emerald, colors.amber, colors.rose, colors.purple];
                                    const dataVals = roleDistributionData.datasets[0].data;
                                    return (
                                        <div key={i} className="d-flex align-items-center gap-2">
                                            <div style={{ width: 10, height: 10, borderRadius: 3, background: bgColors[i] }}></div>
                                            <div>
                                                <div className="extra-small fw-bold" style={{ lineHeight: 1.1 }}>{label}</div>
                                                <div className="extra-small text-muted" style={{ lineHeight: 1.1 }}>{dataVals[i]}%</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 3: Security & Heatmap */}
            <div className="row g-4 mb-4">
                <div className="col-lg-4">
                    <div className="card h-100 border-0" style={cardStyle}>
                        <div className="card-header bg-transparent border-0 pt-4 px-4">
                            <h6 className="fw-bold mb-0" style={{ color: isDark ? '#f8fafc' : '#0f172a' }}>Permission Coverage</h6>
                        </div>
                        <div className="card-body p-4">
                            <Radar 
                                data={permissionCoverageData} 
                                options={{
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        r: {
                                            grid: { color: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' },
                                            angleLines: { color: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' },
                                            ticks: { display: false }
                                        }
                                    }
                                }} 
                            />
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card h-100 border-0" style={cardStyle}>
                        <div className="card-header bg-transparent border-0 pt-4 px-4">
                            <h6 className="fw-bold mb-0" style={{ color: isDark ? '#f8fafc' : '#0f172a' }}>Module Access Density</h6>
                        </div>
                        <div className="card-body p-4">
                            <Bar 
                                data={moduleUsageData} 
                                options={{ 
                                    scales: { 
                                        x: { stacked: true, grid: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' } }, 
                                        y: { stacked: true, grid: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' } } 
                                    },
                                    plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, color: isDark ? '#e2e8f0' : '#475569' } } }
                                }} 
                            />
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card h-100 border-0" style={cardStyle}>
                        <div className="card-header bg-transparent border-0 pt-4 px-4">
                            <h6 className="fw-bold mb-0" style={{ color: isDark ? '#f8fafc' : '#0f172a' }}>Access Risk Heatmap</h6>
                        </div>
                        <div className="card-body p-4">
                            <div className="table-responsive">
                                <table className="table table-borderless table-sm align-middle">
                                    <thead>
                                        <tr className="extra-small text-muted text-center" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                                            <th className="text-start">Role</th>
                                            <th>PMS</th>
                                            <th>HRMS</th>
                                            <th>DMS</th>
                                            <th>FMS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {heatmapData.map((row, idx) => (
                                            <tr key={idx} className="text-center">
                                                <td className="text-start small fw-bold" style={{ color: isDark ? '#cbd5e1' : '#334155' }}>{row.role}</td>
                                                {[row.pms, row.hrms, row.dms, row.fms].map((val, i) => (
                                                    <td key={i}>
                                                        <div 
                                                            className="rounded-2" 
                                                            style={{ 
                                                                width: '100%', 
                                                                height: '30px', 
                                                                backgroundColor: getHeatmapColor(val),
                                                                opacity: val > 0 ? 1 : 0.25,
                                                                cursor: 'pointer'
                                                            }}
                                                            title={`${row.role}: ${val}% control score`}
                                                        ></div>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-3 d-flex gap-3 justify-content-center flex-wrap">
                                <div className="d-flex align-items-center gap-1"><div style={{width:10, height:10, background:colors.indigo}} className="rounded-1"></div> <span className="extra-small">Full (100%)</span></div>
                                <div className="d-flex align-items-center gap-1"><div style={{width:10, height:10, background:colors.indigoLight}} className="rounded-1"></div> <span className="extra-small">High (70%)</span></div>
                                <div className="d-flex align-items-center gap-1"><div style={{width:10, height:10, background:isDark ? '#312e81' : '#c7d2fe'}} className="rounded-1"></div> <span className="extra-small">Limited</span></div>
                                <div className="d-flex align-items-center gap-1"><div style={{width:10, height:10, background:isDark ? '#0f172a' : '#f8fafc'}} className="rounded-1"></div> <span className="extra-small">None</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 4: Activity & Inactive Roles */}
            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card border-0 h-100" style={cardStyle}>
                        <div className="card-header bg-transparent border-0 pt-4 px-4">
                            <h6 className="fw-bold mb-0" style={{ color: isDark ? '#f8fafc' : '#0f172a' }}>Role Activity Trends</h6>
                        </div>
                        <div className="card-body p-4">
                            <Line 
                                data={{
                                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                                    datasets: [{
                                        label: 'Actions Performed',
                                        data: [1200, 1900, 1500, 2100, 2400, 2800],
                                        borderColor: colors.indigo,
                                        tension: 0.4,
                                        fill: true,
                                        backgroundColor: `${colors.indigo}15`,
                                    }]
                                }} 
                                options={{ 
                                    plugins: { legend: { display: false } },
                                    scales: { 
                                        x: { grid: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }, ticks: { color: isDark ? '#94a3b8' : '#64748b' } },
                                        y: { beginAtZero: true, grid: { color: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }, ticks: { color: isDark ? '#94a3b8' : '#64748b' } }
                                    }
                                }} 
                            />
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="card border-0 h-100" style={cardStyle}>
                        <div className="card-header bg-transparent border-0 pt-4 px-4 d-flex justify-content-between align-items-center">
                            <h6 className="fw-bold mb-0" style={{ color: isDark ? '#f8fafc' : '#0f172a' }}>Inactive Roles Analysis</h6>
                            <button 
                                onClick={handlePurgeUnused}
                                disabled={purging}
                                className="btn btn-outline-danger btn-xs px-2 py-1 extra-small rounded-pill d-flex align-items-center gap-1"
                            >
                                {purging ? 'Purging...' : <><FiTrash2 /> Clean Stale</>}
                            </button>
                        </div>
                        <div className="card-body p-4">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0" style={{ background: 'transparent' }}>
                                    <thead>
                                        <tr className="extra-small text-muted" style={{ color: isDark ? '#cbd5e1' : '#64748b' }}>
                                            <th>Role Name</th>
                                            <th>Users</th>
                                            <th>Last Action</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inactiveRoles.map((r, i) => (
                                            <tr key={i} style={{ borderBottom: isDark ? '1px solid #334155' : '1px solid #e2e8f0' }}>
                                                <td className="small fw-bold" style={{ color: isDark ? '#cbd5e1' : '#334155' }}>{r.name}</td>
                                                <td className="small" style={{ color: isDark ? '#cbd5e1' : '#334155' }}>{r.users}</td>
                                                <td className="extra-small text-muted">{r.last}</td>
                                                <td>
                                                    <span className={`badge extra-small ${isDark ? 'bg-secondary text-light' : 'bg-light text-muted'}`}>
                                                        {r.status}
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
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                .extra-small { font-size: 10px; }
                .btn-xs { padding: 2px 6px; font-size: 10px; }
            `}} />
        </div>
    );
};

export default RoleDashboard;
