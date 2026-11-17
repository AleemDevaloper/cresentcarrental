import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileExport, faFileCsv, faFileExcel, faXmark, faSpinner, faDownload,
  faCheck, faListUl, faFilter,
} from '@fortawesome/free-solid-svg-icons';
import { coaTokens } from './coaTheme';
import { useApp } from '../../../../context/AppContext';
import { exportChartOfAccounts } from '../../../../api/fms';

const ExportDialog = ({ isOpen, onClose, isDark, searchTerm = '' }) => {
  const { addNotification } = useApp();
  const t = coaTokens(isDark);
  const [format, setFormat] = useState('csv');
  const [scope, setScope] = useState('all');
  const [exporting, setExporting] = useState(false);

  if (!isOpen) return null;

  const close = () => {
    if (exporting) return;
    onClose?.();
  };

  const download = (data, filename, mime) => {
    const blob = data instanceof Blob ? data : new Blob([data], { type: mime });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const runExport = async () => {
    setExporting(true);
    try {
      const params = {};
      if (scope === 'filtered' && searchTerm) params.q = searchTerm;
      const res = await exportChartOfAccounts(format, params);
      const blob = res?.data;
      const ext = format === 'xlsx' ? 'xlsx' : 'csv';
      const mime = format === 'xlsx'
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'text/csv;charset=utf-8;';
      const stamp = new Date().toISOString().slice(0, 10);
      download(blob, `chart_of_accounts_${stamp}.${ext}`, mime);
      addNotification?.({ type: 'success', message: `Exported as ${format.toUpperCase()}` });
      close();
    } catch (e) {
      addNotification?.({ type: 'error', message: e?.response?.data?.message || 'Export failed' });
    } finally {
      setExporting(false);
    }
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1080,
        background: isDark ? 'rgba(2,6,23,0.7)' : 'rgba(15,23,42,0.45)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        style={{
          width: 'min(520px, 100%)',
          background: t.surface, color: t.text,
          border: `1px solid ${t.border}`,
          borderRadius: 18,
          boxShadow: t.shadow,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.1rem 1.25rem',
            borderBottom: `1px solid ${t.border}`,
            background: t.surfaceAlt,
          }}
        >
          <div className="d-flex align-items-center gap-2">
            <div
              style={{
                width: 40, height: 40, borderRadius: 10,
                background: t.primarySoft, color: t.primary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.05rem',
              }}
            >
              <FontAwesomeIcon icon={faFileExport} />
            </div>
            <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Export Chart of Accounts</h5>
          </div>
          <button
            onClick={close}
            disabled={exporting}
            aria-label="Close"
            style={{
              background: 'transparent', border: 'none',
              color: t.textMuted, fontSize: '1.1rem',
              padding: 8, borderRadius: 8, cursor: 'pointer',
            }}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            Format
          </div>
          <div className="row g-2 mb-3">
            <FormatCard
              t={t}
              active={format === 'csv'}
              onClick={() => setFormat('csv')}
              icon={faFileCsv}
              title="CSV"
              subtitle="Universal, lightweight"
            />
            <FormatCard
              t={t}
              active={format === 'xlsx'}
              onClick={() => setFormat('xlsx')}
              icon={faFileExcel}
              title="Excel"
              subtitle="Best for editing"
            />
          </div>

          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            Scope
          </div>
          <div className="d-flex flex-column gap-2">
            <ScopeOption
              t={t}
              active={scope === 'all'}
              onClick={() => setScope('all')}
              icon={faListUl}
              title="All accounts"
              subtitle="Export the complete chart of accounts"
            />
            <ScopeOption
              t={t}
              active={scope === 'filtered'}
              onClick={() => setScope('filtered')}
              icon={faFilter}
              title="Current search results"
              subtitle={searchTerm ? `Only rows matching "${searchTerm}"` : 'Type a search term to filter'}
              disabled={!searchTerm}
            />
          </div>
        </div>

        <div
          style={{
            display: 'flex', justifyContent: 'flex-end', gap: 8,
            padding: '0.9rem 1.25rem',
            borderTop: `1px solid ${t.border}`,
            background: t.surfaceAlt,
          }}
        >
          <button
            onClick={close}
            disabled={exporting}
            style={{
              background: 'transparent', border: `1px solid ${t.border}`,
              color: t.text, padding: '0.5rem 1rem', borderRadius: 8,
              fontSize: '0.85rem', fontWeight: 500,
              cursor: exporting ? 'not-allowed' : 'pointer',
              opacity: exporting ? 0.6 : 1,
            }}
          >
            Cancel
          </button>
          <button
            onClick={runExport}
            disabled={exporting}
            style={{
              background: t.primary, border: 'none', color: '#fff',
              padding: '0.5rem 1.1rem', borderRadius: 8,
              fontSize: '0.85rem', fontWeight: 600,
              cursor: exporting ? 'not-allowed' : 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              opacity: exporting ? 0.7 : 1,
              boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
            }}
          >
            {exporting ? (
              <><FontAwesomeIcon icon={faSpinner} spin /> Exporting…</>
            ) : (
              <><FontAwesomeIcon icon={faDownload} /> Download {format.toUpperCase()}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const FormatCard = ({ t, active, onClick, icon, title, subtitle }) => (
  <div className="col-6">
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        padding: '0.9rem 1rem',
        background: active ? t.primarySoft : t.surfaceAlt,
        border: `1.5px solid ${active ? t.primary : t.border}`,
        borderRadius: 12,
        color: active ? t.primary : t.text,
        cursor: 'pointer',
        textAlign: 'left',
        display: 'flex', alignItems: 'center', gap: 12,
        transition: 'all 0.15s',
      }}
    >
      <div
        style={{
          width: 38, height: 38, borderRadius: 10,
          background: active ? t.primary : (t.text === '#e2e8f0' ? 'rgba(255,255,255,0.06)' : '#fff'),
          color: active ? '#fff' : t.textMuted,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem',
        }}
      >
        <FontAwesomeIcon icon={icon} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: t.text }}>{title}</div>
        <div style={{ fontSize: '0.72rem', color: t.textMuted }}>{subtitle}</div>
      </div>
      {active && (
        <div style={{ color: t.primary }}>
          <FontAwesomeIcon icon={faCheck} />
        </div>
      )}
    </button>
  </div>
);

const ScopeOption = ({ t, active, onClick, icon, title, subtitle, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: '0.75rem 1rem',
      background: active ? t.primarySoft : t.surfaceAlt,
      border: `1.5px solid ${active ? t.primary : t.border}`,
      borderRadius: 12,
      color: t.text,
      cursor: disabled ? 'not-allowed' : 'pointer',
      textAlign: 'left',
      display: 'flex', alignItems: 'center', gap: 12,
      opacity: disabled ? 0.55 : 1,
      transition: 'all 0.15s',
    }}
  >
    <div
      style={{
        width: 32, height: 32, borderRadius: 8,
        background: active ? t.primary : t.surface,
        color: active ? '#fff' : t.textMuted,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.85rem',
        border: `1px solid ${active ? t.primary : t.border}`,
      }}
    >
      <FontAwesomeIcon icon={icon} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: t.text }}>{title}</div>
      <div style={{ fontSize: '0.74rem', color: t.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {subtitle}
      </div>
    </div>
    <div
      style={{
        width: 18, height: 18, borderRadius: '50%',
        border: `2px solid ${active ? t.primary : t.borderStrong}`,
        background: active ? t.primary : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {active && <FontAwesomeIcon icon={faCheck} style={{ color: '#fff', fontSize: '0.55rem' }} />}
    </div>
  </button>
);

export default ExportDialog;
