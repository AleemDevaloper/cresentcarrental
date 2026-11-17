import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DialogBox from '../../components/common/UI/Boxes/DialogBox';
import {
    faBuildingColumns, faPlus, faTimes, faGlobe, faEnvelope,
    faPhone, faMapMarkerAlt, faCalendarAlt, faCheckCircle,
    faUser, faLock, faEye, faEyeSlash, faToggleOn, faToggleOff,
    faUsers, faAngleDown, faAngleUp, faClock, faBan, faUserCheck,
    faTrash, faRotateLeft, faSpinner, faEdit, faKey
} from '@fortawesome/free-solid-svg-icons';
import {
    listTenants, updateTenant, deleteTenant, provisionTenant,
    listTenantUsers, createTenantUser, updateTenantUser, deleteTenantUser,
    resetTenantUserPassword
} from '../../api/tenants';

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const ALL_SYSTEMS = ['HRMS', 'FMS', 'PMS', 'DMS', 'TMS', 'CRM', 'MFG', 'FX', 'AI', 'POS', 'INV', 'AMS'];

const CompanyManagement = ({ isDark }) => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [expandedCompanyId, setExpandedCompanyId] = useState(null);
    const [companyUsers, setCompanyUsers] = useState({});
    const [usersLoading, setUsersLoading] = useState({});

    const [form, setForm] = useState({
        companyName: '', subdomain: '', email: '', phone: '',
        address: '', fiscalStartMonth: 'January'
    });
    const [adminForm, setAdminForm] = useState({
        adminName: '', adminEmail: '', adminPassword: '', confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showUserModal, setShowUserModal] = useState(false);
    const [userModalMode, setUserModalMode] = useState('create');
    const [userForm, setUserForm] = useState({ name: '', email: '', password: '', role: 'User' });
    const [userFormCompanyId, setUserFormCompanyId] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [showUserPassword, setShowUserPassword] = useState(false);

    const [showResetModal, setShowResetModal] = useState(false);
    const [resetPasswordUserId, setResetPasswordUserId] = useState(null);
    const [resetCompanyId, setResetCompanyId] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [trashDialog, setTrashDialog] = useState({ show: false, company: null });

    const bg = isDark ? '#0f172a' : '#f1f5f9';
    const cardBg = isDark ? 'rgba(30,41,59,0.7)' : '#ffffff';
    const textColor = isDark ? '#f1f5f9' : '#0f172a';
    const mutedColor = isDark ? '#94a3b8' : '#64748b';
    const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
    const inputBg = isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc';
    const primaryGradient = 'linear-gradient(135deg, #4f46e5, #7c3aed)';

    const loadCompanies = useCallback(async () => {
        try {
            setLoading(true);
            const data = await listTenants();
            setCompanies(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load companies:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { loadCompanies(); }, [loadCompanies]);

    const loadCompanyUsers = async (tenantId) => {
        setUsersLoading(prev => ({ ...prev, [tenantId]: true }));
        try {
            const users = await listTenantUsers(tenantId);
            setCompanyUsers(prev => ({ ...prev, [tenantId]: Array.isArray(users) ? users : [] }));
        } catch (err) {
            console.error('Failed to load users:', err);
            setCompanyUsers(prev => ({ ...prev, [tenantId]: [] }));
        } finally {
            setUsersLoading(prev => ({ ...prev, [tenantId]: false }));
        }
    };

    const toggleExpandCompany = (companyId) => {
        if (expandedCompanyId === companyId) {
            setExpandedCompanyId(null);
        } else {
            setExpandedCompanyId(companyId);
            if (!companyUsers[companyId]) {
                loadCompanyUsers(companyId);
            }
        }
    };

    const toggleCompanyStatus = async (company) => {
        try {
            const newStatus = company.status === 'Active' ? 'suspended' : 'active';
            await updateTenant(company.id, { status: newStatus });
            setCompanies(prev => prev.map(c => c.id === company.id ? { ...c, status: newStatus === 'active' ? 'Active' : 'Suspended' } : c));
        } catch (err) {
            console.error('Failed to toggle status:', err);
        }
    };

    const handleCreateCompany = async () => {
        if (!form.companyName || !form.subdomain) return;
        if (adminForm.adminPassword && adminForm.adminPassword !== adminForm.confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }
        setIsSubmitting(true);
        try {
            await provisionTenant({
                company_name: form.companyName,
                subdomain: form.subdomain.toLowerCase().replace(/\s+/g, ''),
                plan: 'Enterprise',
                modules: ['HRMS', 'FMS', 'PMS', 'DMS', 'TMS'],
                admin: {
                    name: adminForm.adminName || form.companyName + ' Admin',
                    email: adminForm.adminEmail || `admin@${form.subdomain}.com`,
                    password: adminForm.adminPassword || 'password123',
                },
                run_migrations: true,
            });
            await loadCompanies();
            resetModal();
        } catch (err) {
            alert(err.message || 'Failed to create company');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteCompany = async () => {
        if (!trashDialog.company) return;
        try {
            await deleteTenant(trashDialog.company.id);
            setCompanies(prev => prev.filter(c => c.id !== trashDialog.company.id));
            setTrashDialog({ show: false, company: null });
        } catch (err) {
            console.error('Failed to delete company:', err);
        }
    };

    const resetModal = () => {
        setShowModal(false);
        setForm({ companyName: '', subdomain: '', email: '', phone: '', address: '', fiscalStartMonth: 'January' });
        setAdminForm({ adminName: '', adminEmail: '', adminPassword: '', confirmPassword: '' });
        setPasswordError('');
        setShowPassword(false);
        setShowConfirm(false);
    };

    const openUserModal = (mode, companyId, user = null) => {
        setUserModalMode(mode);
        setUserFormCompanyId(companyId);
        setEditingUser(user);
        if (user) {
            setUserForm({ name: user.name, email: user.email, password: '', role: user.role || 'User' });
        } else {
            setUserForm({ name: '', email: '', password: '', role: 'User' });
        }
        setShowUserPassword(false);
        setShowUserModal(true);
    };

    const handleUserSubmit = async () => {
        if (!userForm.name || !userForm.email) return;
        if (userModalMode === 'create' && !userForm.password) return;

        try {
            if (userModalMode === 'create') {
                const created = await createTenantUser(userFormCompanyId, {
                    name: userForm.name,
                    email: userForm.email,
                    password: userForm.password,
                    role: userForm.role,
                });
                setCompanyUsers(prev => ({
                    ...prev,
                    [userFormCompanyId]: [...(prev[userFormCompanyId] || []), created]
                }));
            } else if (userModalMode === 'edit' && editingUser) {
                const updateData = { name: userForm.name, email: userForm.email, role: userForm.role };
                if (userForm.password) updateData.password = userForm.password;
                await updateTenantUser(userFormCompanyId, editingUser.id, updateData);
                setCompanyUsers(prev => ({
                    ...prev,
                    [userFormCompanyId]: (prev[userFormCompanyId] || []).map(u =>
                        u.id === editingUser.id ? { ...u, name: userForm.name, email: userForm.email, role: userForm.role } : u
                    )
                }));
            }
            setShowUserModal(false);
        } catch (err) {
            alert(err.message || 'Failed to save user');
        }
    };

    const handleDeleteUser = async (companyId, userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await deleteTenantUser(companyId, userId);
            setCompanyUsers(prev => ({
                ...prev,
                [companyId]: (prev[companyId] || []).filter(u => u.id !== userId)
            }));
        } catch (err) {
            console.error('Failed to delete user:', err);
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || newPassword.length < 6) return;
        try {
            await resetTenantUserPassword(resetCompanyId, resetPasswordUserId, newPassword);
            setShowResetModal(false);
            setNewPassword('');
            alert('Password reset successfully');
        } catch (err) {
            alert(err.message || 'Failed to reset password');
        }
    };

    const inputStyle = {
        width: '100%', padding: '9px 14px', borderRadius: 10, border: `1px solid ${borderColor}`,
        background: inputBg, fontSize: 13, color: textColor, outline: 'none',
        transition: 'border-color 0.2s, box-shadow 0.2s'
    };

    const labelStyle = {
        fontSize: 12, fontWeight: 600, color: mutedColor, marginBottom: 5, display: 'block',
        letterSpacing: '0.02em'
    };

    return (
        <div style={{ padding: '28px 32px', background: bg, minHeight: '100%', color: textColor, fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                {/* Header */}
                <div style={{
                    background: cardBg, borderRadius: 14, border: `1px solid ${borderColor}`,
                    padding: '20px 24px', marginBottom: 24, backdropFilter: 'blur(10px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: 12,
                            background: primaryGradient, color: '#fff', fontSize: 20,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 6px 14px rgba(79,70,229,0.25)'
                        }}>
                            <FontAwesomeIcon icon={faBuildingColumns} />
                        </div>
                        <div>
                            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', color: textColor, lineHeight: 1.3 }}>
                                Company Management
                            </div>
                            <div style={{ fontSize: 12, color: mutedColor, fontWeight: 500, marginTop: 1 }}>
                                Manage organizations, their software access, users, and credentials
                            </div>
                        </div>
                    </div>
                    <button onClick={() => setShowModal(true)}
                        style={{
                            padding: '10px 20px', borderRadius: 10, border: 'none',
                            background: primaryGradient, color: '#fff', fontWeight: 600, fontSize: 12,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                            letterSpacing: '0.02em', boxShadow: '0 4px 12px rgba(79,70,229,0.3)',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(79,70,229,0.35)' }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(79,70,229,0.3)' }}>
                        <FontAwesomeIcon icon={faPlus} /> ADD COMPANY
                    </button>
                </div>

                {/* Company List */}
                {loading ? (
                    <div className="text-center py-5">
                        <FontAwesomeIcon icon={faSpinner} spin className="text-primary" style={{ fontSize: 24 }} />
                        <div className="mt-2 text-muted small">Loading companies...</div>
                    </div>
                ) : companies.length === 0 ? (
                    <div style={{
                        background: cardBg, borderRadius: 14, border: `1px solid ${borderColor}`,
                        padding: '60px 24px', textAlign: 'center', backdropFilter: 'blur(10px)'
                    }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: 16,
                            background: `${'#4f46e5'}12`, color: '#4f46e5', fontSize: 24,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px'
                        }}>
                            <FontAwesomeIcon icon={faBuildingColumns} />
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: textColor, marginBottom: 4 }}>No companies registered yet</div>
                        <div style={{ fontSize: 12, color: mutedColor, marginBottom: 20 }}>Click "Add Company" to provision your first tenant.</div>
                        <button onClick={() => setShowModal(true)}
                            style={{
                                padding: '10px 22px', borderRadius: 10, border: 'none',
                                background: primaryGradient, color: '#fff', fontWeight: 600, fontSize: 12,
                                cursor: 'pointer', letterSpacing: '0.02em',
                                boxShadow: '0 4px 12px rgba(79,70,229,0.3)'
                            }}>
                            <FontAwesomeIcon icon={faPlus} className="me-2" />ADD COMPANY
                        </button>
                    </div>
                ) : (
                    <div className="row g-4">
                        {companies.map((company, i) => (
                            <div key={company.id} className="col-12">
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                    style={{
                                        background: cardBg, borderRadius: 14, border: `1px solid ${borderColor}`,
                                        padding: 24, backdropFilter: 'blur(10px)',
                                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                >
                                    {/* Main Row */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                            <div style={{
                                                width: 44, height: 44, borderRadius: 11,
                                                background: inputBg, border: `1px solid ${borderColor}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#4f46e5', fontWeight: 700, fontSize: 17
                                            }}>
                                                {(company.name || 'C').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 15, color: textColor }}>{company.name}</div>
                                                <div style={{ fontSize: 12, color: mutedColor, display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
                                                    <FontAwesomeIcon icon={faGlobe} style={{ fontSize: 10, opacity: 0.6 }} />
                                                    {company.subdomain || company.domain}
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <span style={{ fontSize: 12, fontWeight: 600, color: company.status === 'Active' ? '#16a34a' : '#ef4444' }}>
                                                    {company.status}
                                                </span>
                                                <button type="button" onClick={() => toggleCompanyStatus(company)}
                                                    style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.5rem', color: company.status === 'Active' ? '#16a34a' : '#94a3b8', padding: 0 }}>
                                                    <FontAwesomeIcon icon={company.status === 'Active' ? faToggleOn : faToggleOff} />
                                                </button>
                                            </div>

                                            <button onClick={() => toggleExpandCompany(company.id)}
                                                className="btn btn-sm btn-light border px-3 py-1.5 rounded-3 d-flex align-items-center gap-1.5"
                                                style={{ fontSize: '12px', fontWeight: 600 }}>
                                                {expandedCompanyId === company.id ? 'Hide Users' : 'View Users'}
                                                <FontAwesomeIcon icon={expandedCompanyId === company.id ? faAngleUp : faAngleDown} />
                                            </button>

                                            <button onClick={() => setTrashDialog({ show: true, company })}
                                                className="btn btn-sm btn-outline-danger border px-3 py-1.5 rounded-3"
                                                style={{ fontSize: '12px', fontWeight: 600 }}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Company Info Grid */}
                                    <div className="row g-3" style={{ marginBottom: 16 }}>
                                        <div className="col-md-3">
                                            <div style={{ background: inputBg, borderRadius: 9, padding: '10px 14px', border: `1px solid ${borderColor}` }}>
                                                <div style={{ fontSize: 10, fontWeight: 600, color: mutedColor, letterSpacing: '0.04em', marginBottom: 3 }}>PLAN</div>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: textColor }}>{company.plan || 'Enterprise'}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div style={{ background: inputBg, borderRadius: 9, padding: '10px 14px', border: `1px solid ${borderColor}` }}>
                                                <div style={{ fontSize: 10, fontWeight: 600, color: mutedColor, letterSpacing: '0.04em', marginBottom: 3 }}>DATABASE</div>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: textColor }}>{company.database || '—'}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div style={{ background: inputBg, borderRadius: 9, padding: '10px 14px', border: `1px solid ${borderColor}` }}>
                                                <div style={{ fontSize: 10, fontWeight: 600, color: mutedColor, letterSpacing: '0.04em', marginBottom: 3 }}>DOMAIN</div>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: textColor }}>{company.domain || '—'}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-3">
                                            <div style={{ background: inputBg, borderRadius: 9, padding: '10px 14px', border: `1px solid ${borderColor}` }}>
                                                <div style={{ fontSize: 10, fontWeight: 600, color: mutedColor, letterSpacing: '0.04em', marginBottom: 3 }}>CREATED</div>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: textColor }}>{company.date || '—'}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Software Access */}
                                    <div style={{ background: inputBg, borderRadius: 9, padding: '12px 14px', border: `1px solid ${borderColor}`, marginTop: 8 }}>
                                        <div style={{ fontSize: 10, fontWeight: 700, color: '#4f46e5', letterSpacing: '0.04em', marginBottom: 8, textTransform: 'uppercase' }}>
                                            <FontAwesomeIcon icon={faBuildingColumns} style={{ marginRight: 6, fontSize: 10 }} />
                                            Software Access ({(company.modules || []).length} systems)
                                        </div>
                                        <div className="d-flex flex-wrap gap-2">
                                            {(company.modules || []).map(sys => (
                                                <span key={sys} className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2 py-1" style={{ fontSize: 11, fontWeight: 600 }}>
                                                    {sys}
                                                </span>
                                            ))}
                                            {(!company.modules || company.modules.length === 0) && (
                                                <span className="text-muted small">No systems assigned</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Users Drawer */}
                                    <AnimatePresence>
                                        {expandedCompanyId === company.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25 }}
                                                style={{ overflow: 'hidden', marginTop: 16 }}
                                            >
                                                <div className="border-top pt-3" style={{ borderColor: borderColor }}>
                                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                                        <h6 className="fw-bold d-flex align-items-center gap-2 mb-0" style={{ fontSize: '13px' }}>
                                                            <FontAwesomeIcon icon={faUsers} className="text-primary" />
                                                            Users ({(companyUsers[company.id] || []).length})
                                                        </h6>
                                                        <button onClick={() => openUserModal('create', company.id)}
                                                            className="btn btn-sm btn-primary rounded-pill px-3"
                                                            style={{ fontSize: 11, fontWeight: 600 }}>
                                                            <FontAwesomeIcon icon={faPlus} className="me-1" /> Add User
                                                        </button>
                                                    </div>

                                                    {usersLoading[company.id] ? (
                                                        <div className="text-center py-3">
                                                            <FontAwesomeIcon icon={faSpinner} spin className="text-primary" />
                                                        </div>
                                                    ) : (!companyUsers[company.id] || companyUsers[company.id].length === 0) ? (
                                                        <div className="text-center py-3 text-muted small">No users found. Click "Add User" to create one.</div>
                                                    ) : (
                                                        <div className="table-responsive border rounded-3">
                                                            <table className="table table-hover align-middle mb-0 text-start small">
                                                                <thead className="bg-light">
                                                                    <tr>
                                                                        <th className="py-2.5 px-3">Name</th>
                                                                        <th>Email</th>
                                                                        <th>Role</th>
                                                                        <th>Systems</th>
                                                                        <th className="text-end px-3">Actions</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {companyUsers[company.id].map(u => (
                                                                        <tr key={u.id} style={{ borderColor: borderColor }}>
                                                                            <td className="py-2 px-3 fw-bold">{u.name}</td>
                                                                            <td>{u.email}</td>
                                                                            <td>
                                                                                <span className="badge bg-secondary bg-opacity-10 text-secondary px-2.5 py-1">
                                                                                    {u.role || 'User'}
                                                                                </span>
                                                                            </td>
                                                                            <td>
                                                                                <div className="d-flex flex-wrap gap-1">
                                                                                    {(u.systems || []).slice(0, 3).map(s => (
                                                                                        <span key={s} className="badge bg-primary bg-opacity-10 text-primary" style={{ fontSize: 9 }}>{s}</span>
                                                                                    ))}
                                                                                    {(u.systems || []).length > 3 && (
                                                                                        <span className="badge bg-light text-dark" style={{ fontSize: 9 }}>+{(u.systems || []).length - 3}</span>
                                                                                    )}
                                                                                </div>
                                                                            </td>
                                                                            <td className="text-end px-3">
                                                                                <div className="d-flex gap-1 justify-content-end">
                                                                                    <button onClick={() => openUserModal('edit', company.id, u)}
                                                                                        className="btn btn-sm btn-outline-primary px-2 py-0.5 rounded"
                                                                                        style={{ fontSize: 11 }} title="Edit">
                                                                                        <FontAwesomeIcon icon={faEdit} />
                                                                                    </button>
                                                                                    <button onClick={() => {
                                                                                        setResetPasswordUserId(u.id);
                                                                                        setResetCompanyId(company.id);
                                                                                        setNewPassword('');
                                                                                        setShowResetModal(true);
                                                                                    }}
                                                                                        className="btn btn-sm btn-outline-warning px-2 py-0.5 rounded"
                                                                                        style={{ fontSize: 11 }} title="Reset Password">
                                                                                        <FontAwesomeIcon icon={faKey} />
                                                                                    </button>
                                                                                    <button onClick={() => handleDeleteUser(company.id, u.id)}
                                                                                        className="btn btn-sm btn-outline-danger px-2 py-0.5 rounded"
                                                                                        style={{ fontSize: 11 }} title="Delete">
                                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                                    </button>
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* Add Company Modal */}
            <AnimatePresence>
                {showModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                        background: 'rgba(0,0,0,0.5)', zIndex: 1050,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
                        backdropFilter: 'blur(2px)'
                    }} onClick={e => { if (e.target === e.currentTarget) resetModal() }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            style={{
                                background: cardBg, borderRadius: 18, width: '100%', maxWidth: 560,
                                overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                                border: `1px solid ${borderColor}`
                            }}>
                            <div style={{ padding: '20px 28px', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: primaryGradient, color: '#fff', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FontAwesomeIcon icon={faBuildingColumns} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 16, fontWeight: 700, color: textColor }}>Add Company</div>
                                        <div style={{ fontSize: 11, color: mutedColor, marginTop: 1 }}>Provision a new tenant with database isolation</div>
                                    </div>
                                </div>
                                <button onClick={resetModal} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: inputBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: mutedColor }}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>

                            <div style={{ padding: '24px 28px', maxHeight: '70vh', overflowY: 'auto' }}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label style={labelStyle}>Company Name</label>
                                        <input name="companyName" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })}
                                            type="text" placeholder="e.g. Stark Industries" style={inputStyle} />
                                    </div>
                                    <div className="col-md-6">
                                        <label style={labelStyle}>Subdomain</label>
                                        <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${borderColor}`, background: inputBg, borderRadius: 10, overflow: 'hidden' }}>
                                            <input name="subdomain" value={form.subdomain} onChange={e => setForm({ ...form, subdomain: e.target.value })}
                                                type="text" placeholder="stark"
                                                style={{ flex: 1, padding: '9px 12px', border: 'none', background: 'transparent', fontSize: 13, color: textColor, outline: 'none' }} />
                                            <span style={{ padding: '9px 12px', background: isDark ? 'rgba(255,255,255,0.03)' : '#f1f5f9', borderLeft: `1px solid ${borderColor}`, fontSize: 12, color: mutedColor, fontWeight: 500 }}>
                                                .managecore.local
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div style={{ borderTop: `1px dashed ${borderColor}`, margin: '20px 0 16px' }} />
                                <h6 style={{ fontSize: 13, fontWeight: 700, color: textColor, marginBottom: 14 }}>Admin Account</h6>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label style={labelStyle}>Admin Name</label>
                                        <input value={adminForm.adminName} onChange={e => setAdminForm({ ...adminForm, adminName: e.target.value })}
                                            type="text" placeholder="John Doe" style={inputStyle} />
                                    </div>
                                    <div className="col-md-6">
                                        <label style={labelStyle}>Admin Email</label>
                                        <input value={adminForm.adminEmail} onChange={e => setAdminForm({ ...adminForm, adminEmail: e.target.value })}
                                            type="email" placeholder="admin@company.com" style={inputStyle} />
                                    </div>
                                    <div className="col-md-6">
                                        <label style={labelStyle}>Password</label>
                                        <div style={{ display: 'flex', alignItems: 'center', borderRadius: 10, border: `1px solid ${borderColor}`, background: inputBg, overflow: 'hidden' }}>
                                            <input value={adminForm.adminPassword} onChange={e => setAdminForm({ ...adminForm, adminPassword: e.target.value })}
                                                type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters"
                                                style={{ flex: 1, padding: '9px 12px', border: 'none', background: 'transparent', fontSize: 13, color: textColor, outline: 'none' }} />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                                style={{ padding: '9px 12px', border: 'none', background: 'transparent', cursor: 'pointer', color: mutedColor }}>
                                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <label style={labelStyle}>Confirm Password</label>
                                        <div style={{ display: 'flex', alignItems: 'center', borderRadius: 10, border: `1px solid ${borderColor}`, background: inputBg, overflow: 'hidden' }}>
                                            <input value={adminForm.confirmPassword} onChange={e => { setAdminForm({ ...adminForm, confirmPassword: e.target.value }); setPasswordError(e.target.value !== adminForm.adminPassword ? 'Passwords do not match' : ''); }}
                                                type={showConfirm ? 'text' : 'password'} placeholder="Confirm password"
                                                style={{ flex: 1, padding: '9px 12px', border: 'none', background: 'transparent', fontSize: 13, color: textColor, outline: 'none' }} />
                                            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                                style={{ padding: '9px 12px', border: 'none', background: 'transparent', cursor: 'pointer', color: mutedColor }}>
                                                <FontAwesomeIcon icon={showConfirm ? faEyeSlash : faEye} />
                                            </button>
                                        </div>
                                        {passwordError && <div style={{ fontSize: 11, color: '#ef4444', marginTop: 4 }}>{passwordError}</div>}
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: '16px 28px', borderTop: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'flex-end', gap: 10, background: inputBg }}>
                                <button onClick={resetModal} style={{ padding: '10px 22px', borderRadius: 10, border: `1px solid ${borderColor}`, background: cardBg, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: mutedColor }}>
                                    CANCEL
                                </button>
                                <button onClick={handleCreateCompany} disabled={isSubmitting}
                                    style={{ padding: '10px 22px', borderRadius: 10, border: 'none', background: primaryGradient, color: '#fff', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer', fontSize: 12, opacity: isSubmitting ? 0.7 : 1 }}>
                                    <FontAwesomeIcon icon={isSubmitting ? faSpinner : faCheckCircle} className="me-2" spin={isSubmitting} />
                                    {isSubmitting ? 'PROVISIONING...' : 'CREATE COMPANY'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add/Edit User Modal */}
            <AnimatePresence>
                {showUserModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                        background: 'rgba(0,0,0,0.5)', zIndex: 1050,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
                    }} onClick={e => { if (e.target === e.currentTarget) setShowUserModal(false) }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }}
                            style={{
                                background: cardBg, borderRadius: 18, width: '100%', maxWidth: 440,
                                overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                                border: `1px solid ${borderColor}`
                            }}>
                            <div style={{ padding: '20px 28px', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: primaryGradient, color: '#fff', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FontAwesomeIcon icon={userModalMode === 'create' ? faPlus : faEdit} />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 16, fontWeight: 700, color: textColor }}>{userModalMode === 'create' ? 'Add User' : 'Edit User'}</div>
                                        <div style={{ fontSize: 11, color: mutedColor, marginTop: 1 }}>{userModalMode === 'create' ? 'Create a new user account' : 'Update user details'}</div>
                                    </div>
                                </div>
                                <button onClick={() => setShowUserModal(false)} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: inputBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: mutedColor }}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>

                            <div style={{ padding: '24px 28px' }}>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <label style={labelStyle}>Full Name</label>
                                        <input value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })}
                                            type="text" placeholder="John Doe" style={inputStyle} />
                                    </div>
                                    <div className="col-12">
                                        <label style={labelStyle}>Email</label>
                                        <input value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })}
                                            type="email" placeholder="john@company.com" style={inputStyle} />
                                    </div>
                                    <div className="col-12">
                                        <label style={labelStyle}>{userModalMode === 'create' ? 'Password' : 'New Password (leave blank to keep current)'}</label>
                                        <div style={{ display: 'flex', alignItems: 'center', borderRadius: 10, border: `1px solid ${borderColor}`, background: inputBg, overflow: 'hidden' }}>
                                            <input value={userForm.password} onChange={e => setUserForm({ ...userForm, password: e.target.value })}
                                                type={showUserPassword ? 'text' : 'password'}
                                                placeholder={userModalMode === 'create' ? 'Min 6 characters' : 'Leave blank to keep current'}
                                                style={{ flex: 1, padding: '9px 12px', border: 'none', background: 'transparent', fontSize: 13, color: textColor, outline: 'none' }} />
                                            <button type="button" onClick={() => setShowUserPassword(!showUserPassword)}
                                                style={{ padding: '9px 12px', border: 'none', background: 'transparent', cursor: 'pointer', color: mutedColor }}>
                                                <FontAwesomeIcon icon={showUserPassword ? faEyeSlash : faEye} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <label style={labelStyle}>Role</label>
                                        <select value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })} style={inputStyle}>
                                            <option value="Admin">Admin</option>
                                            <option value="Manager">Manager</option>
                                            <option value="User">User</option>
                                            <option value="Viewer">Viewer</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: '16px 28px', borderTop: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'flex-end', gap: 10, background: inputBg }}>
                                <button onClick={() => setShowUserModal(false)} style={{ padding: '10px 22px', borderRadius: 10, border: `1px solid ${borderColor}`, background: cardBg, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: mutedColor }}>
                                    CANCEL
                                </button>
                                <button onClick={handleUserSubmit}
                                    style={{ padding: '10px 22px', borderRadius: 10, border: 'none', background: primaryGradient, color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 12 }}>
                                    <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                                    {userModalMode === 'create' ? 'CREATE USER' : 'SAVE CHANGES'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Reset Password Modal */}
            <AnimatePresence>
                {showResetModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                        background: 'rgba(0,0,0,0.5)', zIndex: 1050,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
                    }} onClick={e => { if (e.target === e.currentTarget) setShowResetModal(false) }}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }}
                            style={{
                                background: cardBg, borderRadius: 18, width: '100%', maxWidth: 400,
                                overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                                border: `1px solid ${borderColor}`
                            }}>
                            <div style={{ padding: '20px 28px', borderBottom: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: '#fff', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FontAwesomeIcon icon={faKey} />
                                    </div>
                                    <div style={{ fontSize: 16, fontWeight: 700, color: textColor }}>Reset Password</div>
                                </div>
                                <button onClick={() => setShowResetModal(false)} style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: inputBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: mutedColor }}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>

                            <div style={{ padding: '24px 28px' }}>
                                <label style={labelStyle}>New Password</label>
                                <div style={{ display: 'flex', alignItems: 'center', borderRadius: 10, border: `1px solid ${borderColor}`, background: inputBg, overflow: 'hidden' }}>
                                    <input value={newPassword} onChange={e => setNewPassword(e.target.value)}
                                        type={showNewPassword ? 'text' : 'password'} placeholder="Min 6 characters"
                                        style={{ flex: 1, padding: '9px 12px', border: 'none', background: 'transparent', fontSize: 13, color: textColor, outline: 'none' }} />
                                    <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                                        style={{ padding: '9px 12px', border: 'none', background: 'transparent', cursor: 'pointer', color: mutedColor }}>
                                        <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                                    </button>
                                </div>
                            </div>

                            <div style={{ padding: '16px 28px', borderTop: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'flex-end', gap: 10, background: inputBg }}>
                                <button onClick={() => setShowResetModal(false)} style={{ padding: '10px 22px', borderRadius: 10, border: `1px solid ${borderColor}`, background: cardBg, cursor: 'pointer', fontSize: 12, fontWeight: 600, color: mutedColor }}>
                                    CANCEL
                                </button>
                                <button onClick={handleResetPassword} disabled={!newPassword || newPassword.length < 6}
                                    style={{ padding: '10px 22px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: '#fff', fontWeight: 600, cursor: newPassword.length >= 6 ? 'pointer' : 'not-allowed', fontSize: 12, opacity: newPassword.length >= 6 ? 1 : 0.5 }}>
                                    <FontAwesomeIcon icon={faKey} className="me-2" />RESET PASSWORD
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <DialogBox.Confirm
                show={trashDialog.show}
                onHide={() => setTrashDialog({ show: false, company: null })}
                title="Delete Company"
                message={trashDialog.company ? `Are you sure you want to delete "${trashDialog.company.name}"? This will remove the tenant record but the database will not be dropped.` : ''}
                variant="danger"
                confirmLabel="Delete"
                cancelLabel="Cancel"
                onConfirm={handleDeleteCompany}
                size="sm"
            />
        </div>
    );
};

export default CompanyManagement;
