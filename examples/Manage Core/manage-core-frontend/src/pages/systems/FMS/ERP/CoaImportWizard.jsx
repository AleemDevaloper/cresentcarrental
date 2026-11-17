import React, { useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileImport, faFileCsv, faFileExcel, faDownload, faXmark,
  faCloudUpload, faCheck, faExclamationTriangle, faCheckCircle,
  faInfoCircle, faSpinner, faArrowRight, faUndo, faRedo,
} from '@fortawesome/free-solid-svg-icons';
import { coaTokens } from './coaTheme';
import { useApp } from '../../../../context/AppContext';
import { importChartOfAccounts, downloadCoaTemplate } from '../../../../api/fms';

const STEPS = [
  { key: 'upload', label: 'Upload' },
  { key: 'preview', label: 'Preview' },
  { key: 'result', label: 'Result' },
];

const ImportWizard = ({ isOpen, onClose, onSuccess, isDark }) => {
  const { addNotification } = useApp();
  const t = coaTokens(isDark);
  const fileInputRef = useRef(null);

  const [step, setStep] = useState('upload');
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const [showErrors, setShowErrors] = useState(false);

  if (!isOpen) return null;

  const reset = () => {
    setStep('upload');
    setFile(null);
    setDragOver(false);
    setImporting(false);
    setResult(null);
    setShowErrors(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const close = () => {
    if (importing) return;
    onClose?.();
    setTimeout(reset, 200);
  };

  const pickFile = (f) => {
    if (!f) return;
    const validExts = ['csv', 'xlsx', 'xls'];
    const ext = f.name.split('.').pop().toLowerCase();
    if (!validExts.includes(ext)) {
      addNotification?.({ type: 'error', message: 'Only CSV or XLSX files are accepted' });
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      addNotification?.({ type: 'error', message: 'File too large (max 10 MB)' });
      return;
    }
    setFile(f);
    setResult(null);
    setStep('preview');
  };

  const handleFileChange = (e) => pickFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    pickFile(e.dataTransfer.files?.[0]);
  };

  const runImport = async () => {
    if (!file) return;
    setImporting(true);
    setStep('result');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await importChartOfAccounts(fd);
      const data = res?.data?.data ?? res?.data ?? res;
      setResult(data);
      if (data?.success !== false) {
        const c = data?.created || 0;
        const u = data?.updated || 0;
        const s = data?.skipped || 0;
        addNotification?.({
          type: 'success',
          message: `Imported: ${c} created, ${u} updated, ${s} skipped`,
        });
        onSuccess?.(data);
      } else {
        addNotification?.({ type: 'error', message: 'Import failed. See details below.' });
      }
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Import failed';
      setResult({ success: false, errors: [{ line: 0, code: '', message: msg }] });
      addNotification?.({ type: 'error', message: msg });
    } finally {
      setImporting(false);
    }
  };

  const downloadSample = async (format) => {
    try {
      const res = await downloadCoaTemplate(format);
      const blob = res?.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `chart_of_accounts_template.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      addNotification?.({ type: 'error', message: 'Failed to download template' });
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
        aria-label="Import chart of accounts"
        style={{
          width: 'min(900px, 100%)',
          maxHeight: '92vh',
          display: 'flex', flexDirection: 'column',
          background: t.surface,
          color: t.text,
          border: `1px solid ${t.border}`,
          borderRadius: 20,
          boxShadow: t.shadow,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.1rem 1.5rem',
            borderBottom: `1px solid ${t.border}`,
            background: t.surfaceAlt,
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <div
              style={{
                width: 44, height: 44, borderRadius: 12,
                background: t.primarySoft, color: t.primary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.15rem',
              }}
            >
              <FontAwesomeIcon icon={faFileImport} />
            </div>
            <div>
              <h5 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Import Chart of Accounts</h5>
              <div style={{ color: t.textMuted, fontSize: '0.78rem' }}>
                Upload a CSV or XLSX file matching the standard template
              </div>
            </div>
          </div>
          <button
            onClick={close}
            disabled={importing}
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

        {/* Step indicator */}
        <div
          style={{
            display: 'flex', gap: 0,
            padding: '1rem 1.5rem',
            borderBottom: `1px solid ${t.border}`,
            background: t.surface,
          }}
        >
          {STEPS.map((s, i) => {
            const currentIdx = STEPS.findIndex(x => x.key === step);
            const isCurrent = s.key === step;
            const isDone = i < currentIdx || (s.key === 'result' && result?.success);
            const isError = s.key === 'result' && result && result.success === false;
            const dotBg = isError ? t.danger : isDone || isCurrent ? t.primary : (isDark ? '#1e293b' : '#e2e8f0');
            const dotFg = isError || isDone || isCurrent ? '#fff' : t.textMuted;
            return (
              <React.Fragment key={s.key}>
                <div className="d-flex align-items-center gap-2" style={{ flex: i === STEPS.length - 1 ? '0 0 auto' : '1 1 auto' }}>
                  <div
                    style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: dotBg, color: dotFg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.78rem', fontWeight: 700,
                      transition: 'all 0.2s',
                    }}
                  >
                    {isError ? <FontAwesomeIcon icon={faExclamationTriangle} /> : isDone ? <FontAwesomeIcon icon={faCheck} /> : i + 1}
                  </div>
                  <span
                    style={{
                      fontSize: '0.82rem', fontWeight: 600,
                      color: isCurrent || isDone || isError ? t.text : t.textSubtle,
                    }}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{
                    flex: '1 1 auto', height: 2, margin: '0 0.75rem',
                    background: i < currentIdx ? t.primary : (isDark ? '#1e293b' : '#e2e8f0'),
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    alignSelf: 'center',
                  }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
          {step === 'upload' && (
            <UploadStep
              t={t}
              isDark={isDark}
              fileInputRef={fileInputRef}
              dragOver={dragOver}
              setDragOver={setDragOver}
              handleFileChange={handleFileChange}
              handleDrop={handleDrop}
              file={file}
              downloadSample={downloadSample}
            />
          )}

          {step === 'preview' && file && (
            <PreviewStep
              t={t}
              file={file}
              importing={importing}
              onConfirm={runImport}
              onBack={() => setStep('upload')}
            />
          )}

          {step === 'result' && (
            <ResultStep
              t={t}
              result={result}
              importing={importing}
              showErrors={showErrors}
              setShowErrors={setShowErrors}
            />
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            gap: 12, padding: '1rem 1.5rem',
            borderTop: `1px solid ${t.border}`,
            background: t.surfaceAlt,
          }}
        >
          <div>
            {step === 'result' && result && !importing && (
              <button
                onClick={reset}
                style={{
                  background: 'transparent', border: `1px solid ${t.border}`,
                  color: t.text, padding: '0.5rem 0.9rem', borderRadius: 8,
                  fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}
              >
                <FontAwesomeIcon icon={faRedo} /> Import another file
              </button>
            )}
          </div>
          <div className="d-flex gap-2">
            <button
              onClick={close}
              disabled={importing}
              style={{
                background: 'transparent', border: `1px solid ${t.border}`,
                color: t.text, padding: '0.55rem 1.1rem', borderRadius: 8,
                fontSize: '0.85rem', fontWeight: 500, cursor: importing ? 'not-allowed' : 'pointer',
                opacity: importing ? 0.6 : 1,
              }}
            >
              {step === 'result' ? 'Close' : 'Cancel'}
            </button>
            {step === 'preview' && (
              <button
                onClick={runImport}
                disabled={importing}
                style={{
                  background: t.primary, border: 'none', color: '#fff',
                  padding: '0.55rem 1.2rem', borderRadius: 8,
                  fontSize: '0.85rem', fontWeight: 600,
                  cursor: importing ? 'not-allowed' : 'pointer',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  opacity: importing ? 0.7 : 1,
                  boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                }}
              >
                {importing ? (
                  <><FontAwesomeIcon icon={faSpinner} spin /> Importing…</>
                ) : (
                  <><FontAwesomeIcon icon={faCheck} /> Confirm import</>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const UploadStep = ({ t, isDark, fileInputRef, dragOver, setDragOver, handleFileChange, handleDrop, file, downloadSample }) => (
  <div>
    <label
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      style={{
        display: 'block',
        border: `2px dashed ${dragOver ? t.primary : t.borderStrong}`,
        borderRadius: 16,
        padding: '2.5rem 1.5rem',
        textAlign: 'center',
        background: dragOver ? t.primarySoft : t.surfaceAlt,
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <div
        style={{
          width: 64, height: 64, borderRadius: 18,
          background: t.primarySoft, color: t.primary,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.5rem', margin: '0 auto 0.85rem',
        }}
      >
        <FontAwesomeIcon icon={faCloudUpload} />
      </div>
      <div style={{ fontSize: '1rem', fontWeight: 600, color: t.text, marginBottom: 4 }}>
        Drop a CSV or XLSX file here
      </div>
      <div style={{ fontSize: '0.82rem', color: t.textMuted }}>
        or <span style={{ color: t.primary, fontWeight: 600 }}>click to browse</span> · max 10 MB
      </div>
    </label>

    <div
      style={{
        marginTop: '1.5rem',
        padding: '1rem 1.25rem',
        background: t.surfaceAlt,
        border: `1px solid ${t.border}`,
        borderRadius: 12,
      }}
    >
      <div className="d-flex align-items-start gap-2">
        <FontAwesomeIcon icon={faInfoCircle} style={{ color: t.info, marginTop: 2 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: t.text, marginBottom: 4 }}>
            Don't have a template?
          </div>
          <div style={{ fontSize: '0.78rem', color: t.textMuted, marginBottom: 12 }}>
            Download the standard template, fill in the rows, then upload. Unknown account types
            and groups are auto-created. Codes must be unique.
          </div>
          <div className="d-flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => downloadSample('csv')}
              style={{
                background: t.surface, border: `1px solid ${t.border}`,
                color: t.text, padding: '0.45rem 0.85rem', borderRadius: 8,
                fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}
            >
              <FontAwesomeIcon icon={faFileCsv} /> CSV template
            </button>
            <button
              type="button"
              onClick={() => downloadSample('xlsx')}
              style={{
                background: t.surface, border: `1px solid ${t.border}`,
                color: t.text, padding: '0.45rem 0.85rem', borderRadius: 8,
                fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}
            >
              <FontAwesomeIcon icon={faFileExcel} /> Excel template
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const PreviewStep = ({ t, file, importing, onConfirm, onBack }) => {
  const sizeKb = (file.size / 1024).toFixed(1);
  const ext = file.name.split('.').pop().toLowerCase();
  const isXlsx = ext === 'xlsx' || ext === 'xls';
  return (
    <div>
      <div
        style={{
          padding: '1.25rem',
          background: t.surfaceAlt,
          border: `1px solid ${t.border}`,
          borderRadius: 14,
          display: 'flex', alignItems: 'center', gap: 16,
        }}
      >
        <div
          style={{
            width: 56, height: 56, borderRadius: 14,
            background: isXlsx ? t.successSoft : t.infoSoft,
            color: isXlsx ? t.success : t.info,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', flexShrink: 0,
          }}
        >
          <FontAwesomeIcon icon={isXlsx ? faFileExcel : faFileCsv} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {file.name}
          </div>
          <div style={{ fontSize: '0.78rem', color: t.textMuted, marginTop: 2 }}>
            {sizeKb} KB · {isXlsx ? 'Excel workbook' : 'CSV file'}
          </div>
        </div>
        <button
          onClick={onBack}
          disabled={importing}
          style={{
            background: 'transparent', border: `1px solid ${t.border}`,
            color: t.text, padding: '0.45rem 0.85rem', borderRadius: 8,
            fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer',
          }}
        >
          Change
        </button>
      </div>

      <div
        style={{
          marginTop: '1.25rem',
          padding: '1rem 1.25rem',
          background: t.surfaceAlt,
          border: `1px solid ${t.border}`,
          borderRadius: 12,
        }}
      >
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: t.text, marginBottom: 8 }}>
          What will happen on import
        </div>
        <ul style={{ margin: 0, paddingLeft: '1.1rem', color: t.textMuted, fontSize: '0.82rem', lineHeight: 1.7 }}>
          <li>Existing accounts with matching <code style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0', padding: '1px 5px', borderRadius: 4 }}>code</code> will be updated</li>
          <li>New account types or groups are auto-created if missing</li>
          <li>Invalid rows (missing code or name) are reported as errors</li>
          <li>Accounts with a <code style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0', padding: '1px 5px', borderRadius: 4 }}>parent_code</code> are linked when the parent exists</li>
        </ul>
      </div>
    </div>
  );
};

const ResultStep = ({ t, result, importing, showErrors, setShowErrors }) => {
  if (importing) {
    return (
      <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
        <div
          style={{
            width: 72, height: 72, borderRadius: '50%',
            background: t.primarySoft, color: t.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', margin: '0 auto 1rem',
          }}
        >
          <FontAwesomeIcon icon={faSpinner} spin />
        </div>
        <h6 style={{ color: t.text, margin: 0, fontSize: '1rem' }}>Importing accounts…</h6>
        <p style={{ color: t.textMuted, fontSize: '0.82rem', margin: '0.4rem 0 0' }}>
          This may take a moment for large files.
        </p>
      </div>
    );
  }

  if (!result) return null;

  const success = result.success !== false;
  const created = result.created || 0;
  const updated = result.updated || 0;
  const skipped = result.skipped || 0;
  const errors = Array.isArray(result.errors) ? result.errors : [];
  const hasErrors = errors.length > 0;

  return (
    <div>
      <div
        style={{
          padding: '1.5rem',
          background: success ? t.successSoft : t.dangerSoft,
          border: `1px solid ${success ? t.successBorder : t.dangerBorder}`,
          borderRadius: 14,
          display: 'flex', alignItems: 'center', gap: 16,
          marginBottom: '1.25rem',
        }}
      >
        <div
          style={{
            width: 56, height: 56, borderRadius: '50%',
            background: success ? t.success : t.danger,
            color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', flexShrink: 0,
          }}
        >
          <FontAwesomeIcon icon={success ? faCheckCircle : faExclamationTriangle} />
        </div>
        <div style={{ flex: 1 }}>
          <h6 style={{ margin: 0, color: success ? t.success : t.danger, fontSize: '1rem', fontWeight: 700 }}>
            {success ? 'Import completed' : 'Import failed'}
          </h6>
          <div style={{ color: t.textMuted, fontSize: '0.82rem', marginTop: 2 }}>
            {success
              ? `Processed ${created + updated + skipped} row${created + updated + skipped === 1 ? '' : 's'}.`
              : 'Review the error report below for details.'}
          </div>
        </div>
      </div>

      {success && (
        <div className="row g-2 mb-3">
          <StatPill t={t} label="Created" value={created} color={t.success} />
          <StatPill t={t} label="Updated" value={updated} color={t.info} />
          <StatPill t={t} label="Skipped" value={skipped} color={t.warning} />
        </div>
      )}

      {hasErrors && (
        <div
          style={{
            background: t.surfaceAlt,
            border: `1px solid ${t.border}`,
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <button
            onClick={() => setShowErrors(v => !v)}
            style={{
              width: '100%',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0.85rem 1.1rem',
              background: 'transparent', border: 'none',
              color: t.text, fontSize: '0.88rem', fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <span>
              <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: t.danger, marginRight: 8 }} />
              {errors.length} error{errors.length === 1 ? '' : 's'} reported
            </span>
            <span style={{ color: t.textMuted, fontSize: '0.78rem' }}>
              {showErrors ? 'Hide' : 'Show'} details
              <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: 6, transform: showErrors ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
            </span>
          </button>
          {showErrors && (
            <div style={{ maxHeight: 280, overflow: 'auto', borderTop: `1px solid ${t.border}` }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                <thead style={{ position: 'sticky', top: 0, background: t.surface, color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <tr>
                    <th style={{ padding: '0.6rem 0.9rem', textAlign: 'left', fontWeight: 600 }}>Line</th>
                    <th style={{ padding: '0.6rem 0.9rem', textAlign: 'left', fontWeight: 600 }}>Code</th>
                    <th style={{ padding: '0.6rem 0.9rem', textAlign: 'left', fontWeight: 600 }}>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {errors.slice(0, 200).map((e, i) => (
                    <tr
                      key={i}
                      style={{
                        borderTop: `1px solid ${t.border}`,
                        background: i % 2 ? t.surface : t.surfaceAlt,
                        color: t.text,
                      }}
                    >
                      <td style={{ padding: '0.55rem 0.9rem', fontFamily: 'monospace' }}>{e.line}</td>
                      <td style={{ padding: '0.55rem 0.9rem', fontFamily: 'monospace' }}>{e.code || '—'}</td>
                      <td style={{ padding: '0.55rem 0.9rem' }}>{e.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {errors.length > 200 && (
                <div style={{ padding: '0.6rem 0.9rem', color: t.textMuted, fontSize: '0.75rem', textAlign: 'center' }}>
                  Showing first 200 of {errors.length} errors
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StatPill = ({ t, label, value, color }) => (
  <div className="col-4">
    <div
      style={{
        padding: '0.85rem 1rem',
        background: t.surfaceAlt,
        border: `1px solid ${t.border}`,
        borderRadius: 10,
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '1.4rem', fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.72rem', color: t.textMuted, textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: 4 }}>
        {label}
      </div>
    </div>
  </div>
);

export default ImportWizard;
