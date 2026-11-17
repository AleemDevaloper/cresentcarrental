import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DialogBox from '../../components/common/UI/Boxes/DialogBox';
import {
    faBuildingColumns, faTrash, faRotateLeft, faTimes,
    faGlobe, faUsers, faClock, faTriangleExclamation
} from '@fortawesome/free-solid-svg-icons';

const CompanyTrash = ({ isDark, companies, setCompanies }) => {
    const [restoreDialog, setRestoreDialog] = useState({ show: false, company: null });
    const [deleteDialog, setDeleteDialog] = useState({ show: false, company: null });
    const [emptyDialog, setEmptyDialog] = useState({ show: false });

    const bg = isDark ? '#0f172a' : '#f1f5f9';
    const cardBg = isDark ? 'rgba(30,41,59,0.7)' : '#ffffff';
    const textColor = isDark ? '#f1f5f9' : '#0f172a';
    const mutedColor = isDark ? '#94a3b8' : '#64748b';
    const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
    const inputBg = isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc';
    const primaryGradient = 'linear-gradient(135deg, #4f46e5, #7c3aed)';

    const trashedCompanies = companies.filter(c => c.deletedAt);

    const confirmRestore = () => {
        if (!restoreDialog.company) return;
        setCompanies(prev => prev.map(c =>
            c.id === restoreDialog.company.id
                ? { ...c, deletedAt: null }
                : c
        ));
        setRestoreDialog({ show: false, company: null });
    };

    const confirmPermanentDelete = () => {
        if (!deleteDialog.company) return;
        setCompanies(prev => prev.filter(c => c.id !== deleteDialog.company.id));
        setDeleteDialog({ show: false, company: null });
    };

    const confirmEmptyTrash = () => {
        setCompanies(prev => prev.filter(c => !c.deletedAt));
        setEmptyDialog({ show: false });
    };

    const formatDate = (iso) => {
        if (!iso) return '—';
        try { return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }); }
        catch { return '—'; }
    };

    return (
        <div style={{ padding: '28px 32px', background: bg, minHeight: '100%', color: textColor, fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                {/* ───── Header ───── */}
                <div style={{
                    background: cardBg, borderRadius: 14, border: `1px solid ${borderColor}`,
                    padding: '20px 24px', marginBottom: 24,
                    backdropFilter: 'blur(10px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: 12,
                            background: 'linear-gradient(135deg, #ef4444, #f97316)', color: '#fff', fontSize: 20,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 6px 14px rgba(239,68,68,0.25)'
                        }}>
                            <FontAwesomeIcon icon={faTrash} />
                        </div>
                        <div>
                            <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em', color: textColor, lineHeight: 1.3 }}>
                                Company Trash
                            </div>
                            <div style={{ fontSize: 12, color: mutedColor, fontWeight: 500, marginTop: 1 }}>
                                Restore or permanently delete companies that were moved to trash
                            </div>
                        </div>
                    </div>
                    {trashedCompanies.length > 0 && (
                        <button onClick={() => setEmptyDialog({ show: true })}
                            className="btn btn-sm btn-outline-danger rounded-pill px-3 py-1.5 d-flex align-items-center gap-1.5"
                            style={{ fontSize: '12px', fontWeight: 600 }}>
                            <FontAwesomeIcon icon={faTrash} /> Empty Trash
                        </button>
                    )}
                </div>

                {/* ───── Trashed List ───── */}
                {trashedCompanies.length === 0 ? (
                    <div style={{
                        background: cardBg, borderRadius: 14, border: `1px solid ${borderColor}`,
                        padding: '60px 24px', textAlign: 'center', backdropFilter: 'blur(10px)'
                    }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: 16,
                            background: '#ef444412', color: '#ef4444', fontSize: 24,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px'
                        }}>
                            <FontAwesomeIcon icon={faTrash} />
                        </div>
                        <div style={{ fontSize: 16, fontWeight: 600, color: textColor, marginBottom: 4 }}>Trash is empty</div>
                        <div style={{ fontSize: 12, color: mutedColor, marginBottom: 20 }}>Companies you move to trash will appear here for recovery.</div>
                    </div>
                ) : (
                    <div className="row g-4">
                        {trashedCompanies.map((company, i) => (
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
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                            <div style={{
                                                width: 44, height: 44, borderRadius: 11,
                                                background: inputBg, border: `1px solid ${borderColor}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#ef4444', fontWeight: 700, fontSize: 17
                                            }}>
                                                {company.companyName.charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, fontSize: 15, color: textColor, display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    {company.companyName}
                                                    <span className="badge bg-danger bg-opacity-10 text-danger px-2 py-1" style={{ fontSize: '10px', fontWeight: 600 }}>
                                                        <FontAwesomeIcon icon={faTriangleExclamation} className="me-1" />Trashed
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: 12, color: mutedColor, display: 'flex', alignItems: 'center', gap: 5, marginTop: 1 }}>
                                                    <FontAwesomeIcon icon={faGlobe} style={{ fontSize: 10, opacity: 0.6 }} />
                                                    {company.subdomain}.managecore.local
                                                </div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '11px', color: mutedColor }}>Moved to Trash</div>
                                                <div style={{ fontSize: '13px', fontWeight: 700, color: textColor }}>
                                                    <FontAwesomeIcon icon={faClock} style={{ marginRight: 6, color: '#ef4444' }} />
                                                    {formatDate(company.deletedAt)}
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => setRestoreDialog({ show: true, company })}
                                                className="btn btn-sm btn-outline-success border px-3 py-1.5 rounded-3 d-flex align-items-center gap-1.5"
                                                style={{ fontSize: '12px', fontWeight: 600 }}
                                            >
                                                <FontAwesomeIcon icon={faRotateLeft} /> Restore
                                            </button>

                                            <button
                                                onClick={() => setDeleteDialog({ show: true, company })}
                                                className="btn btn-sm btn-outline-danger border px-3 py-1.5 rounded-3 d-flex align-items-center gap-1.5"
                                                style={{ fontSize: '12px', fontWeight: 600 }}
                                            >
                                                <FontAwesomeIcon icon={faTimes} /> Delete Permanently
                                            </button>
                                        </div>
                                    </div>

                                    <div className="row g-3 mt-2">
                                        <div className="col-md-4">
                                            <div style={{ background: inputBg, borderRadius: 9, padding: '10px 14px', border: `1px solid ${borderColor}` }}>
                                                <div style={{ fontSize: 10, fontWeight: 600, color: mutedColor, letterSpacing: '0.04em', marginBottom: 3 }}>EMAIL</div>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: textColor }}>{company.email || '—'}</div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div style={{ background: inputBg, borderRadius: 9, padding: '10px 14px', border: `1px solid ${borderColor}` }}>
                                                <div style={{ fontSize: 10, fontWeight: 600, color: mutedColor, letterSpacing: '0.04em', marginBottom: 3 }}>USERS</div>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: textColor }}>
                                                    <FontAwesomeIcon icon={faUsers} style={{ marginRight: 6, color: '#ef4444' }} />
                                                    {company.users?.length || 0} Users
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div style={{ background: inputBg, borderRadius: 9, padding: '10px 14px', border: `1px solid ${borderColor}` }}>
                                                <div style={{ fontSize: 10, fontWeight: 600, color: mutedColor, letterSpacing: '0.04em', marginBottom: 3 }}>STATUS</div>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: textColor }}>{company.status}</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>

            <DialogBox.Confirm
                show={restoreDialog.show}
                onHide={() => setRestoreDialog({ show: false, company: null })}
                title="Restore Company"
                message={restoreDialog.company ? `Restore "${restoreDialog.company.companyName}" back to active companies?` : 'Restore this company?'}
                variant="success"
                confirmLabel="Restore"
                cancelLabel="Cancel"
                onConfirm={confirmRestore}
                size="sm"
            />

            <DialogBox.Confirm
                show={deleteDialog.show}
                onHide={() => setDeleteDialog({ show: false, company: null })}
                title="Delete Permanently"
                message={deleteDialog.company ? `This will permanently delete "${deleteDialog.company.companyName}" and all its data. This action cannot be undone.` : 'This will permanently delete this company. This action cannot be undone.'}
                variant="danger"
                confirmLabel="Delete Permanently"
                cancelLabel="Cancel"
                onConfirm={confirmPermanentDelete}
                size="sm"
            />

            <DialogBox.Confirm
                show={emptyDialog.show}
                onHide={() => setEmptyDialog({ show: false })}
                title="Empty Trash"
                message="This will permanently delete ALL companies in the trash. This action cannot be undone."
                variant="danger"
                confirmLabel="Empty Trash"
                cancelLabel="Cancel"
                onConfirm={confirmEmptyTrash}
                size="sm"
            />
        </div>
    );
};

export default CompanyTrash;
