
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../hooks/useApp';
import { useTranslation } from '../../hooks/useTranslation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUsers,
    faShieldHalved,
    faUserTag,
    faCubes,
    faDatabase,
    faServer,
    faLock,
    faArrowRight,
    faPlus,
    faCheckCircle,
    faExclamationCircle,
    faSync,
    faMicrochip,
    faLayerGroup,
    faBolt,
    faScaleBalanced,
    faClock,
    faHistory,
    faUserShield
} from "@fortawesome/free-solid-svg-icons";
import CommandPalette from '../CommandCenter/CommandPalette';
import OrgNavigator from '../CommandCenter/OrgNavigator';
import WorkspaceLauncher from '../CommandCenter/WorkspaceLauncher';
import AutomationControl from '../CommandCenter/AutomationControl';
import UnifiedWorkQueue from '../CommandCenter/UnifiedWorkQueue';
import ExecutiveBriefing from '../CommandCenter/ExecutiveBriefing';
import EmergencyOps from '../CommandCenter/EmergencyOps';
import { listUsers } from '../../api/users';
import { listRoles } from '../../api/roles';
import { useDashboardWidgets } from '../../hooks/useDashboardWidgets';
import { useSystemMetrics } from '../../hooks/useSystemMetrics';
import DashboardWidgetManager from '../../components/dashboard/DashboardWidgetManager';
import DashboardModuleWidgets from '../../components/dashboard/DashboardModuleWidgets';

const StatCard = ({ title, value, subValue, icon, color, progress }) => (
    <div className="card border-0 shadow-sm h-100 overflow-hidden" style={{ borderRadius: '16px' }}>
        <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className={`rounded-circle bg-${color}-subtle d-flex align-items-center justify-content-center`} style={{ width: '48px', height: '48px' }}>
                    <FontAwesomeIcon icon={icon} className={`text-${color} fs-5`} />
                </div>
                <div className="dropdown">
                    <button className="btn btn-link text-muted p-0"><FontAwesomeIcon icon={faSync} className="small" /></button>
                </div>
            </div>
            <h2 className="fw-bold mb-1">{value}</h2>
            <p className="text-muted small fw-semibold mb-3">{title}</p>

            {progress !== undefined && (
                <div className="mt-2">
                    <div className="d-flex justify-content-between mb-1">
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>{subValue}</small>
                        <small className="fw-bold text-dark" style={{ fontSize: '0.7rem' }}>{progress}%</small>
                    </div>
                    <div className="progress" style={{ height: '6px', borderRadius: '10px' }}>
                        <div className={`progress-bar bg-${color}`} style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            )}
        </div>
    </div>
);

const ShortcutButton = ({ label, icon, color, onClick, description, t }) => (
    <div
        className="card border-0 shadow-sm transition-all hover-lift-lg cursor-pointer h-100 overflow-hidden group"
        style={{
            borderRadius: '24px',
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.05)',
            position: 'relative'
        }}
        onClick={onClick}
    >
        <div className="position-absolute top-0 start-0 w-100 h-100 opacity-0 group-hover-shine transition-all pointer-events-none z-0"
            style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)',
                width: '200%',
                transform: 'translateX(-100%) skewX(-15deg)',
            }}></div>

        <div className="card-body p-4 d-flex flex-column align-items-center text-center position-relative z-1">
            <div
                className={`position-absolute top-0 end-0 p-3 opacity-10 transition-all group-hover-scale-rotate z-n1`}
                style={{ fontSize: '5.5rem', transform: 'translate(25%, -25%) rotate(-10deg)', filter: 'blur(3px)' }}
            >
                <FontAwesomeIcon icon={icon} className={`text-${color}`} />
            </div>

            <div
                className={`rounded-circle d-flex align-items-center justify-content-center mb-4 shadow-sm transition-all group-hover-bounce`}
                style={{
                    width: '72px',
                    height: '72px',
                    background: `linear-gradient(135deg, var(--bs-${color}), rgba(var(--bs-${color}-rgb), 0.7))`,
                    boxShadow: `0 8px 20px -5px rgba(var(--bs-${color}-rgb), 0.4)`
                }}
            >
                <FontAwesomeIcon icon={icon} className={`text-white fs-3`} />
            </div>

            <h6 className="fw-bold mb-2 text-dark">{label}</h6>
            <p className="text-muted small mb-4 px-2" style={{ fontSize: '0.85rem', lineHeight: '1.5', opacity: 0.8 }}>
                {description}
            </p>

            <div className={`mt-auto btn btn-sm btn-${color} rounded-pill px-4 py-2 fw-bold shadow-sm transition-all group-hover-width d-flex align-items-center gap-2`}>
                <span style={{ color: 'white' }}>{t('Explore')}</span>
                <FontAwesomeIcon icon={faArrowRight} className="small transition-all group-hover-translate-x text-white" />
            </div>
        </div>
        <div className={`position-absolute bottom-0 start-0 w-100 transition-all opacity-0 group-hover-opacity-100 bg-${color}`}
            style={{ height: '5px', boxShadow: `0 -5px 15px rgba(var(--bs-${color}-rgb), 0.3)` }}></div>
    </div>
);

const AdminOverview = () => {
    const { setActiveTab, currentUser, themeStyle, theme } = useApp();
    const { t } = useTranslation();
    const [userCount, setUserCount] = useState(0);
    const [roleCount, setRoleCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const { widgets, allWidgets, visibleWidgets, visibleWidgetIds, toggleWidget, resetWidgets, isSaving } = useDashboardWidgets(currentUser);
    const widgetManagerRef = useRef(null);
    const { data: metricsData, loading: metricsLoading } = useSystemMetrics(visibleWidgets);

    const isDark = theme === 'dark';
    const themeClass = themeStyle === 'glassmorphism' ? 'glass-dashboard-content' : '';

    useEffect(() => {
        async function fetchData() {
            try {
                const [users, roles] = await Promise.all([listUsers(), listRoles()]);
                setUserCount(users.length);
                setRoleCount(roles.length);
            } catch (err) {
                console.error("Error fetching admin stats", err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const systems = [
        { name: `PMS (${t('project_mgmt')})`, status: 'Active', load: 45 },
        { name: `HRMS (${t('human_resource')})`, status: 'Active', load: 28 },
        { name: `FMS (${t('finance_mgmt')})`, status: 'Active', load: 12 },
        { name: `TMS (${t('task_management')})`, status: 'Active', load: 62 },
        { name: `DMS (${t('document_management')})`, status: 'Active', load: 34 },
        { name: `CRM (${t('customer_relationship')})`, status: 'In Building', load: 0 },
    ];


    return (
        <>
            <div className={`container-fluid px-4 py-4 ${themeClass} ${isDark ? 'dark-mode' : ''}`}>
                <CommandPalette isOpen={isCommandPaletteOpen} onClose={setIsCommandPaletteOpen} />

                {/* 🚀 PREMIUM BRANDED HEADER */}
                <div className={`card border-0 rounded-5 mb-5 overflow-hidden shadow-2xl position-relative ${isDark ? 'bg-dark-card border-white border-opacity-10' : 'bg-white'}`} style={{ border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)' }}>
                    <div className="position-absolute top-0 start-0 w-100 h-100 z-0 overflow-hidden">
                        <div className="position-absolute top-0 end-0 opacity-20 blur-4xl animated-blob" style={{ width: '800px', height: '800px', borderRadius: '50%', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', transform: 'translate(30%, -30%)' }}></div>
                        <div className="position-absolute bottom-0 start-0 opacity-15 blur-4xl animated-blob animation-delay-2000" style={{ width: '600px', height: '600px', borderRadius: '50%', background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', transform: 'translate(-20%, 20%)' }}></div>
                    </div>

                    <div className="card-body p-0 position-relative z-1">
                        <div className="row g-0">
                            <div className="col-xl-8">
                                <div className="p-5 p-lg-5 h-100 d-flex flex-column justify-content-center">
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center shadow-lg hover-scale transition-all" style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
                                            <FontAwesomeIcon icon={faLayerGroup} className="text-white fs-4" />
                                        </div>
                                        <div>
                                            <div className={`badge ${isDark ? 'bg-white bg-opacity-10 text-white' : 'bg-primary bg-opacity-10 text-primary'} rounded-pill px-3 py-2 fw-black small text-uppercase letter-spacing-wider border ${isDark ? 'border-white border-opacity-10' : 'border-primary border-opacity-10'} backdrop-blur-md`}>
                                                {t('enterprise_command_center')} v4.2
                                            </div>
                                            <div className={`x-small ${isDark ? 'text-white-50' : 'text-muted'} mt-1 fw-bold opacity-75`}>
                                                <FontAwesomeIcon icon={faShieldHalved} className="me-1" /> {t('authorized_admin_node')}
                                            </div>
                                        </div>
                                    </div>

                                    <h1 className={`display-3 fw-black mb-3 ls-tight ${isDark ? 'text-white' : 'text-dark'}`} style={{ letterSpacing: '-0.04em' }}>
                                        {t('welcome_back')}, <span className="text-gradient-primary">{currentUser?.name || t('admin')}</span>
                                    </h1>
                                    <p className={`lead ${isDark ? 'text-white-50' : 'text-muted'} mb-5 opacity-80 pe-xl-5 fw-medium`}>
                                        {t('admin_dashboard_desc')}
                                    </p>

                                    <div className="d-flex flex-wrap gap-4">
                                        <button className="btn btn-primary rounded-pill px-5 py-3 fw-black shadow-2xl border-0 hover-lift-lg transition-all d-flex align-items-center gap-3" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)' }}>
                                            <FontAwesomeIcon icon={faBolt} className="animate-pulse" />
                                            <span>Execute System Audit</span>
                                        </button>
                                        <button className={`btn rounded-pill px-5 py-3 fw-bold transition-all shadow-xl backdrop-blur-md border ${isDark ? 'bg-white bg-opacity-5 text-white border-white border-opacity-10 hover-bg-opacity-10' : 'bg-white text-dark border-dark border-opacity-10 hover-bg-light'}`}>
                                            <FontAwesomeIcon icon={faUsers} className={`me-2 ${isDark ? 'text-white' : 'text-primary'}`} />
                                            {t('user_directory')}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-4 d-none d-xl-block">
                                <div className="p-4 p-xl-5 h-100 bg-gradient-dark-blue d-flex align-items-center justify-content-center rounded-5">
                                    <div className="p-4 p-xl-5 rounded-5 backdrop-blur-xl border border-white border-opacity-10 shadow-3xl text-white w-100 transition hover-lift position-relative overflow-hidden " style={{ background: 'rgba(15, 23, 42, 0.75)' }}>
                                        <div className="position-absolute top-0 end-0 p-4 opacity-5">
                                            <FontAwesomeIcon icon={faMicrochip} style={{ fontSize: '10rem', opacity: 0.3 }} />
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center mb-5 position-relative z-2">
                                            <h5 className="fw-black mb-0">{t('system_health')}</h5>
                                            <div className="d-flex align-items-center gap-2 bg-success bg-opacity-25 border border-success text-success px-3 py-1 rounded-pill small fw-bold">
                                                <div className="pulse-dot bg-success bg-opacity-10"></div> STABLE
                                            </div>
                                        </div>
                                        <div className="space-y-6 position-relative z-2">
                                            <div className="mb-4">
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="small fw-bold text-white-50">{t('cpu_utilization')}</span>
                                                    <span className="small fw-black text-info">12.4%</span>
                                                </div>
                                                <div className="progress rounded-pill shadow-inner overflow-visible" style={{ height: '8px', background: 'rgba(255,255,255,0.08)' }}>
                                                    <div className="progress-bar progress-bar-striped progress-bar-animated bg-info" style={{ width: '12.4%' }}></div>
                                                </div>
                                            </div>
                                            <div className="row g-3 mb-4">
                                                <div className="col-6">
                                                    <div className="p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-50">
                                                        <div className="text-white-50 x-small fw-bold mb-1">LATENCY</div>
                                                        <div className="h4 mb-0 fw-black">24ms</div>
                                                    </div>
                                                </div>
                                                <div className="col-6">
                                                    <div className="p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-50">
                                                        <div className="text-white-50 x-small fw-bold mb-1">UPTIME</div>
                                                        <div className="h4 mb-0 fw-black">99.9%</div>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="btn btn-outline-light btn-sm rounded-pill w-100 fw-bold border-opacity-25 hover-bg-white hover-text-dark py-2">{t('infrastructure_logs')}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex flex-column gap-5">
                    {/* 🎯 Enterprise Workspace Launcher */}
                    <div className="mb-2">
                        <div className="d-flex align-items-end justify-content-between mb-4 pb-2 border-bottom border-primary border-opacity-10">
                            <div>
                                <h5 className={`fw-black mb-1 d-flex align-items-center gap-3 ${isDark ? 'text-white' : 'text-dark'}`}>
                                    <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary shadow-sm">
                                        <FontAwesomeIcon icon={faLayerGroup} className="small" />
                                    </div>
                                    Enterprise Workspace Launcher
                                </h5>
                                <p className={`x-small mb-0 fw-bold opacity-50 ${isDark ? 'text-white' : 'text-muted'}`}>
                                    ORCHESTRATE SYSTEM MODULES & SUBSYSTEMS
                                </p>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <div className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 fw-bold small border border-primary border-opacity-10 backdrop-blur-md">
                                    <FontAwesomeIcon icon={faBolt} className="me-2 x-small animate-pulse" />
                                    CTRL + K for Quick Search
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end px-4 pb-4">
                            <DashboardWidgetManager
                                ref={widgetManagerRef}
                                widgets={widgets}
                                allWidgets={allWidgets}
                                visibleWidgetIds={visibleWidgetIds}
                                toggleWidget={toggleWidget}
                                resetWidgets={resetWidgets}
                                isSaving={isSaving}
                            />
                        </div>
                        <WorkspaceLauncher isDark={isDark} />
                    </div>

                    <DashboardModuleWidgets
                        widgets={visibleWidgets}
                        availableWidgets={widgets}
                        isDark={isDark}
                        onAdd={() => widgetManagerRef.current?.open()}
                        onRemove={(id) => toggleWidget(id)}
                        metricsData={metricsData}
                        metricsLoading={metricsLoading}
                    />

                    {/* 📊 Executive Command Briefing & Unified Work Queue */}
                    <div className="row g-4">
                        <div className="col-xl-6">
                            <ExecutiveBriefing isDark={isDark} />
                        </div>
                        <div className="col-xl-6">
                            <UnifiedWorkQueue isDark={isDark} />
                        </div>
                    </div>

                    {/* Primary Analytics Grid */}
                    <div className="row g-4">
                        <div className="col-xl-3 col-md-6">
                            <StatCard
                                title={t('total_users')}
                                value={loading ? '...' : userCount}
                                subValue={t('user_limit')}
                                icon={faUsers}
                                color="primary"
                                progress={Math.min((userCount / 1000) * 100, 100).toFixed(1)}
                                t={t}
                            />
                        </div>
                        <div className="col-xl-3 col-md-6">
                            <StatCard
                                title={t('active_roles')}
                                value={loading ? '...' : roleCount}
                                subValue={t('system_defined_roles')}
                                icon={faUserTag}
                                color="success"
                                progress={75}
                                t={t}
                            />
                        </div>
                        <div className="col-xl-3 col-md-6">
                            <StatCard
                                title={t('data_storage')}
                                value="4.2 GB"
                                subValue={t('storage_limit')}
                                icon={faDatabase}
                                color="info"
                                progress={42}
                                t={t}
                            />
                        </div>
                        <div className="col-xl-3 col-md-6">
                            <StatCard
                                title={t('server_uptime')}
                                value="99.9%"
                                subValue={t('status_optimal')}
                                icon={faServer}
                                color="warning"
                                progress={99.9}
                                t={t}
                            />
                        </div>
                    </div>

                    <div className="row g-4">
                        {/* 🌐 Organization Mapping & Automation Control */}
                        <div className="col-xl-8">
                            <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-10' : 'bg-white'}`} style={{ borderRadius: '24px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)' }}>
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <h4 className={`fw-black mb-0 ${isDark ? 'text-white' : 'text-dark'}`}>Organization Navigator</h4>
                                        <span className="badge bg-info bg-opacity-10 text-info rounded-pill px-3 py-1 fw-bold small">Real-time Mapping</span>
                                    </div>
                                    <OrgNavigator />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-4">
                            <AutomationControl isDark={isDark} />
                        </div>
                    </div>

                    {/* New Sections: Unified Work Queue & Activity Stream */}
                    <div className="row g-4 mb-2">
                        {/* Unified Work Queue */}
                        <div className="col-xl-8">
                            <div className={`card border-0 shadow-sm h-100 ${isDark ? 'bg-dark-card border-white border-opacity-10' : 'bg-white'}`} style={{ borderRadius: '24px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)' }}>
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <h4 className={`fw-black mb-0 ${isDark ? 'text-white' : 'text-dark'}`}>Unified Work Queue</h4>
                                        <button className="btn btn-sm rounded-pill px-3 py-1 fw-bold shadow-sm" style={{ backgroundColor: isDark ? 'rgba(79, 70, 229, 0.15)' : '#eef2ff', color: '#4f46e5', border: 'none', fontSize: '0.85rem' }}>view_all</button>
                                    </div>

                                    <div className="table-responsive">
                                        <table className="table table-borderless align-middle mb-0">
                                            <thead>
                                                <tr>
                                                    <th className="text-muted fw-bold x-small text-uppercase ps-0" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>System</th>
                                                    <th className="text-muted fw-bold x-small text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Task Details</th>
                                                    <th className="text-muted fw-bold x-small text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Priority</th>
                                                    <th className="text-muted fw-bold x-small text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Timeline</th>
                                                    <th className="text-muted fw-bold x-small text-uppercase text-end pe-0" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[
                                                    {
                                                        system: 'HRMS',
                                                        title: 'John Doe - Annual Leave',
                                                        subTitle: 'Leave Approval',
                                                        priority: 'High',
                                                        priorityStyle: { backgroundColor: isDark ? 'rgba(217, 119, 6, 0.15)' : '#fffbeb', color: '#d97706' },
                                                        timeline: '2h ago'
                                                    },
                                                    {
                                                        system: 'PMS',
                                                        title: 'Project X - Phase 1 Completion',
                                                        subTitle: 'Milestone Update',
                                                        priority: 'Medium',
                                                        priorityStyle: { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.15)' : '#eff6ff', color: '#2563eb' },
                                                        timeline: '5h ago'
                                                    },
                                                    {
                                                        system: 'FMS',
                                                        title: 'Travel Reimbursement - #4421',
                                                        subTitle: 'Expense Claim',
                                                        priority: 'Low',
                                                        priorityStyle: { backgroundColor: isDark ? 'rgba(8, 145, 178, 0.15)' : '#ecfeff', color: '#0891b2' },
                                                        timeline: '1d ago'
                                                    },
                                                    {
                                                        system: 'TMS',
                                                        title: 'Complete Security Audit',
                                                        subTitle: 'Task Overdue',
                                                        priority: 'Critical',
                                                        priorityStyle: { backgroundColor: isDark ? 'rgba(220, 38, 38, 0.15)' : '#fef2f2', color: '#dc2626' },
                                                        timeline: 'Overdue',
                                                        timelineColor: '#dc2626'
                                                    }
                                                ].map((item, index) => (
                                                    <tr key={index} className="border-bottom border-light" style={{ borderBottomColor: isDark ? 'rgba(255,255,255,0.05)' : '#f8f9fa' }}>
                                                        <td className="ps-0 py-3">
                                                            <span className={`badge rounded-pill px-3 py-2 fw-bold border ${isDark ? 'bg-white bg-opacity-5 text-white-50 border-white border-opacity-10' : 'bg-white text-dark border-secondary border-opacity-20'}`} style={{ fontSize: '0.75rem' }}>
                                                                {item.system}
                                                            </span>
                                                        </td>
                                                        <td className="py-3">
                                                            <div className={`fw-bold ${isDark ? 'text-white' : 'text-dark'}`} style={{ fontSize: '0.95rem' }}>{item.title}</div>
                                                            <div className="text-muted small" style={{ fontSize: '0.8rem' }}>{item.subTitle}</div>
                                                        </td>
                                                        <td className="py-3">
                                                            <span className="badge px-3 py-2 rounded-pill fw-bold" style={{ ...item.priorityStyle, fontSize: '0.75rem' }}>
                                                                {item.priority}
                                                            </span>
                                                        </td>
                                                        <td className="py-3">
                                                            <div className="d-flex align-items-center gap-2 text-muted fw-semibold" style={{ fontSize: '0.85rem', color: item.timelineColor }}>
                                                                <FontAwesomeIcon icon={faClock} style={{ opacity: 0.7 }} />
                                                                <span>{item.timeline}</span>
                                                            </div>
                                                        </td>
                                                        <td className="text-end pe-0 py-3">
                                                            <button className="btn btn-link p-0 text-primary hover-scale transition-all">
                                                                <FontAwesomeIcon icon={faArrowRight} className="fs-5" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Activity Stream */}
                        <div className="col-xl-4">
                            <div className={`card border-0 shadow-sm h-100 ${isDark ? 'bg-dark-card border-white border-opacity-10' : 'bg-white'}`} style={{ borderRadius: '24px', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)' }}>
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <div className={`p-2 rounded-3 ${isDark ? 'bg-white bg-opacity-10 text-white' : 'bg-light text-dark'}`}>
                                            <FontAwesomeIcon icon={faHistory} className="fs-5" />
                                        </div>
                                        <h4 className={`fw-black mb-0 ${isDark ? 'text-white' : 'text-dark'}`}>Activity Stream</h4>
                                    </div>

                                    <div className="ps-2">
                                        {[
                                            {
                                                user: 'Admin',
                                                action: 'Modified Role',
                                                target: 'Manager',
                                                time: '10m ago',
                                                color: '#3b82f6'
                                            },
                                            {
                                                user: 'System',
                                                action: 'Backup Completed',
                                                target: 'Cloud Node 1',
                                                time: '45m ago',
                                                color: '#10b981'
                                            },
                                            {
                                                user: 'HR',
                                                action: 'Onboarded User',
                                                target: 'Jane Smith',
                                                time: '1h ago',
                                                color: '#06b6d4'
                                            },
                                            {
                                                user: 'Admin',
                                                action: 'Security Policy Update',
                                                target: 'Firewall',
                                                time: '2h ago',
                                                color: '#ef4444'
                                            },
                                            {
                                                user: 'System',
                                                action: 'Scheduled Maintenance',
                                                target: 'DB Cluster',
                                                time: '4h ago',
                                                color: '#f59e0b'
                                            }
                                        ].map((item, index, arr) => (
                                            <div key={index} className="d-flex position-relative pb-4">
                                                {index < arr.length - 1 && (
                                                    <div className="position-absolute" style={{
                                                        left: '5px',
                                                        top: '16px',
                                                        bottom: '-16px',
                                                        width: '2px',
                                                        backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0'
                                                    }}></div>
                                                )}
                                                <div className="rounded-circle me-3 mt-1 flex-shrink-0" style={{
                                                    width: '12px',
                                                    height: '12px',
                                                    backgroundColor: item.color,
                                                    zIndex: 1,
                                                    boxShadow: `0 0 8px ${item.color}80`
                                                }}></div>
                                                <div>
                                                    <div className="small" style={{ fontSize: '0.85rem' }}>
                                                        <span className={`fw-bold ${isDark ? 'text-white' : 'text-dark'}`}>{item.user} </span>
                                                        <span className="text-muted">{item.action}</span>
                                                    </div>
                                                    <div className="fw-bold my-1" style={{ color: isDark ? '#60a5fa' : '#2563eb', fontSize: '0.9rem' }}>{item.target}</div>
                                                    <div className="text-muted x-small" style={{ fontSize: '0.75rem' }}>{item.time}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row g-4">
                        {/* Active Systems Analytics */}
                        <div className="col-xl-8">
                            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                                <div className="card-header bg-transparent border-0 p-4 pb-0 d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="fw-bold mb-1">{t('core_systems_health')}</h5>
                                        <p className="text-muted small mb-0">{t('real_time_status_desc')}</p>
                                    </div>
                                    <button className="btn btn-light-primary btn-sm rounded-pill px-3 fw-bold">{t('system_logs')}</button>
                                </div>
                                <div className="card-body p-4">
                                    <div className="row g-3">
                                        {systems.map((system, i) => (
                                            <div key={i} className="col-md-6">
                                                <div className="p-3 border rounded-4 bg-light-subtle">
                                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                                        <span className="fw-bold small">{system.name}</span>
                                                        <span className={`badge bg-${system.status === 'Active' ? 'success' : 'warning'}-subtle text-${system.status === 'Active' ? 'success' : 'warning'} rounded-pill`} style={{ fontSize: '0.65rem' }}>
                                                            {system.status === 'Active' ? t('active') : system.status}
                                                        </span>
                                                    </div>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="flex-grow-1">
                                                            <div className="progress" style={{ height: '4px' }}>
                                                                <div className="progress-bar bg-primary" style={{ width: `${system.load}%` }}></div>
                                                            </div>
                                                        </div>
                                                        <small className="text-muted fw-bold" style={{ fontSize: '0.7rem' }}>{system.load}%</small>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-4 p-4 rounded-4 bg-dark text-white d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="rounded-circle bg-success d-flex align-items-center justify-content-center shadow-lg" style={{ width: '40px', height: '40px', animation: 'pulse 2s infinite' }}>
                                                <FontAwesomeIcon icon={faMicrochip} />
                                            </div>
                                            <div>
                                                <h6 className="mb-0 fw-bold">{t('main_processing_unit')}</h6>
                                                <small className="text-white-50">Node v18.x | Latency: 24ms</small>
                                            </div>
                                        </div>
                                        <div className="text-end">
                                            <div className="fw-bold">{t('stable_caps')}</div>
                                            <small className="text-success small">{t('security_patch')} v2.4</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Resource Allocation */}
                        <div className="col-xl-4">
                            <div className="card border-0 shadow-sm h-100 bg-primary text-white overflow-hidden" style={{ borderRadius: '16px' }}>
                                <div className="card-body p-4 position-relative" style={{ zIndex: 1 }}>
                                    <h5 className="fw-bold mb-4">{t('security_overview')}</h5>
                                    <div className="mb-4">
                                        <div className="d-flex align-items-center gap-3 mb-3 p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10">
                                            <FontAwesomeIcon icon={faLock} className="fs-5" />
                                            <div>
                                                <h6 className="mb-0 small fw-bold">{t('ssl_certificate')}</h6>
                                                <small className="text-white-50">{t('valid_days')}</small>
                                            </div>
                                            <FontAwesomeIcon icon={faCheckCircle} className="ms-auto text-success" />
                                        </div>
                                        <div className="d-flex align-items-center gap-3 mb-3 p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10">
                                            <FontAwesomeIcon icon={faShieldHalved} className="fs-5" />
                                            <div>
                                                <h6 className="mb-0 small fw-bold">{t('brute_force_protection')}</h6>
                                                <small className="text-white-50">{t('enabled_monitoring')}</small>
                                            </div>
                                            <FontAwesomeIcon icon={faCheckCircle} className="ms-auto text-success" />
                                        </div>
                                        <div className="d-flex align-items-center gap-3 p-3 rounded-4 bg-white bg-opacity-10 border border-white border-opacity-10">
                                            <FontAwesomeIcon icon={faExclamationCircle} className="fs-5" />
                                            <div>
                                                <h6 className="mb-0 small fw-bold">{t('failed_login_attempts')}</h6>
                                                <small className="text-white-50">12 {t('attempts_today')}</small>
                                            </div>
                                            <span className="ms-auto badge bg-warning text-dark px-2">{t('review')}</span>
                                        </div>
                                    </div>
                                    <button className="btn btn-white w-100 rounded-pill fw-bold text-primary py-2 mt-2">{t('security_settings')}</button>
                                </div>
                                <FontAwesomeIcon
                                    icon={faShieldHalved}
                                    className="position-absolute"
                                    style={{ fontSize: '12rem', right: '-2rem', bottom: '-2rem', opacity: 0.05, zIndex: 0 }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Quick Access Grid */}
                    <div className="mb-2">
                        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                            <FontAwesomeIcon icon={faCubes} className="text-primary small" />
                            {t('quick_access_modules')}
                        </h5>
                        <div className="row g-4">
                            <div className="col-lg-3 col-md-6">
                                <ShortcutButton
                                    label={t('permissions')}
                                    description={t('dashboard_permissions_desc')}
                                    icon={faShieldHalved}
                                    color="danger"
                                    onClick={() => setActiveTab('permissions')}
                                    t={t}
                                />
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <ShortcutButton
                                    label={t('roles_mgmt')}
                                    description={t('dashboard_roles_mgmt_desc')}
                                    icon={faUserTag}
                                    color="success"
                                    onClick={() => setActiveTab('roles')}
                                    t={t}
                                />
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <ShortcutButton
                                    label={t('user_directory')}
                                    description={t('dashboard_user_directory_desc')}
                                    icon={faUsers}
                                    color="primary"
                                    onClick={() => setActiveTab('users')}
                                    t={t}
                                />
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <ShortcutButton
                                    label={t('data_backup')}
                                    description={t('dashboard_data_backup_desc')}
                                    icon={faDatabase}
                                    color="info"
                                    onClick={() => setActiveTab('data-backup')}
                                    t={t}
                                />
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <ShortcutButton
                                    label={t('data_limits')}
                                    description={t('dashboard_data_limits_desc')}
                                    icon={faShieldHalved}
                                    color="warning"
                                    onClick={() => setActiveTab('data-limits')}
                                    t={t}
                                />
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <ShortcutButton
                                    label={t('user_limits')}
                                    description={t('dashboard_user_limits_desc')}
                                    icon={faUserShield}
                                    color="primary"
                                    onClick={() => setActiveTab('user-limits')}
                                    t={t}
                                />
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <ShortcutButton
                                    label={t('theme_editor')}
                                    description={t('dashboard_theme_editor_desc')}
                                    icon={faPlus}
                                    color="warning"
                                    onClick={() => setActiveTab('theme')}
                                    t={t}
                                />
                            </div>
                            <div className="col-lg-3 col-md-6">
                                <ShortcutButton
                                    label={t('navbar_config')}
                                    description={t('dashboard_navbar_config_desc')}
                                    icon={faCubes}
                                    color="secondary"
                                    onClick={() => setActiveTab('topnavbar-settings')}
                                    t={t}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 🛡️ Mission Control - Emergency & Compliance */}
                    <div className="row g-4 mb-5">
                        <div className="col-xl-6">
                            <EmergencyOps isDark={isDark} />
                        </div>
                        <div className="col-xl-6">
                            <div className={`p-4 rounded-5 shadow-2xl h-100 ${isDark ? 'bg-dark-card border-info border-opacity-20' : 'bg-white border-info border-opacity-10'}`} style={{ border: '1px solid' }}>
                                <div className="d-flex align-items-center justify-content-between mb-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-2 rounded-3 bg-info bg-opacity-10 text-info">
                                            <FontAwesomeIcon icon={faScaleBalanced} />
                                        </div>
                                        <div>
                                            <h6 className={`fw-black mb-0 ${isDark ? 'text-white' : 'text-dark'}`}>Compliance Center</h6>
                                            <small className="text-muted fw-bold x-small">Regulatory & Governance Overview</small>
                                        </div>
                                    </div>
                                    <button className="btn btn-xs btn-light-info rounded-pill fw-black px-3">Run Audit</button>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { label: 'GDPR Compliance', status: 'Compliant', progress: 100, color: 'success' },
                                        { label: 'SOC2 Type II', status: 'In Review', progress: 85, color: 'info' },
                                        { label: 'ISO 27001', status: 'Expiring Soon', progress: 92, color: 'warning' },
                                    ].map(item => (
                                        <div key={item.label}>
                                            <div className="d-flex justify-content-between mb-1">
                                                <span className="small fw-bold text-muted">{item.label}</span>
                                                <span className={`x-small fw-black text-${item.color}`}>{item.status}</span>
                                            </div>
                                            <div className="progress" style={{ height: '6px' }}>
                                                <div className={`progress-bar bg-${item.color}`} style={{ width: `${item.progress}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <style>{`
        .bg-primary-subtle { background-color: rgba(var(--bs-primary-rgb), 0.1); }
        .bg-success-subtle { background-color: rgba(var(--bs-success-rgb), 0.1); }
        .bg-info-subtle { background-color: rgba(var(--bs-info-rgb), 0.1); }
        .bg-warning-subtle { background-color: rgba(var(--bs-warning-rgb), 0.1); }
        .bg-danger-subtle { background-color: rgba(var(--bs-danger-rgb), 0.1); }
        .btn-light-primary { background-color: rgba(var(--bs-primary-rgb), 0.05); color: var(--bs-primary); border: none; }
        .btn-light-primary:hover { background-color: rgba(var(--bs-primary-rgb), 0.1); color: var(--bs-primary); }
        .btn-white { background-color: white; border: none; }
        .btn-white:hover { background-color: #f8f9fa; }
        .cursor-pointer { cursor: pointer; }
        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .hover-lift:hover { transform: translateY(-5px); box-shadow: 0 1rem 3rem rgba(0,0,0,0.1) !important; }
        .hover-lift-lg:hover { transform: translateY(-10px); box-shadow: 0 1.5rem 4rem rgba(31, 38, 135, 0.15) !important; }
        
        .group:hover .group-hover-scale-rotate { transform: translate(15%, -15%) scale(1.15) rotate(5deg) !important; opacity: 0.25 !important; }
        .group:hover .group-hover-bounce { transform: translateY(-10px); }
        .group:hover .group-hover-width { padding-left: 2rem !important; padding-right: 2rem !important; box-shadow: 0 8px 20px rgba(0,0,0,0.1) !important; }
        .group:hover .group-hover-translate-x { transform: translateX(5px); }
        .group:hover .group-hover-shine { opacity: 0.4 !important; transform: translateX(100%) skewX(-15deg) !important; transition: transform 0.7s ease-in-out !important; }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(25, 135, 84, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(25, 135, 84, 0); }
          100% { box-shadow: 0 0 0 0 rgba(25, 135, 84, 0); }
        }

        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animated-blob { animation: blob 7s infinite alternate; }
        .animation-delay-2000 { animation-delay: 2s; }
        .blur-4xl { filter: blur(100px); }
        .ls-tight { letter-spacing: -0.02em; }
        .shadow-2xl { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); }
        .bg-gradient-dark-blue { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); }
        .pulse-dot { width: 12px; height: 12px; border-radius: 50%; animation: pulse-green 2s infinite; }
        @keyframes pulse-green { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); } }

        .z-n1 { z-index: -1; }
        .group-hover-shine { transition: transform 0s; }
      `}</style>
            </div>
        </>
    );
};

export default AdminOverview;
