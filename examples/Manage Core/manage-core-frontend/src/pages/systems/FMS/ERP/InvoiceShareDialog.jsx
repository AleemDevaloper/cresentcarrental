import React, { useState, useRef } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQrcode, faLink, faCopy, faDownload, faRotateRight,
  faBan, faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { createSalesInvoiceShare, revokeSalesInvoiceShare } from '../../../../api/fms';

const InvoiceShareDialog = ({ show, onHide, invoice, isDark, onNotify }) => {
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const [revoked, setRevoked] = useState(false);
  const qrExportRef = useRef(null);

  React.useEffect(() => {
    if (show) ensureShare();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  if (!show || !invoice) return null;

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';

  const ensureShare = async ({ regenerate = false } = {}) => {
    setLoading(true);
    setCopied(false);
    try {
      const res = await createSalesInvoiceShare(invoice.id, regenerate ? { regenerate: true } : {});
      const share = res.data?.data?.share;
      if (!share?.token) throw new Error('Failed to create share link');
      const url = `${window.location.origin}/public/invoice/${share.token}`;
      setShareUrl(url);
      setRevoked(false);
      onNotify?.(regenerate ? 'New share link generated.' : 'Share link ready.', 'success');
    } catch (err) {
      onNotify?.(err.message || 'Failed to create share link', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onNotify?.('Link copied to clipboard.', 'success');
    } catch {
      onNotify?.('Could not copy link.', 'error');
    }
  };

  const handleDownloadQr = () => {
    const canvas = qrExportRef.current?.querySelector('canvas');
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `${invoice.number || 'invoice'}-qr.png`;
    a.click();
    onNotify?.('QR code downloaded.', 'success');
  };

  const handleRevoke = async () => {
    try {
      await revokeSalesInvoiceShare(invoice.id);
      setRevoked(true);
      setShareUrl(null);
      onNotify?.('Share link revoked.', 'success');
    } catch (err) {
      onNotify?.(err.message || 'Failed to revoke link', 'error');
    }
  };

  return (
    <div className="modal-backdrop-custom" style={{ position: 'fixed', inset: 0, zIndex: 1070, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', padding: 'clamp(10px, 2vw, 24px)' }} onClick={onHide}>
      <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()} style={{ width: 'min(480px, 100%)', margin: 0 }}>
        <div className="modal-content" style={{ borderRadius: '18px', border: 'none', background: isDark ? '#1e293b' : '#ffffff', color: textColor }}>
          <div className="modal-header border-0 px-4 pt-4 pb-2">
            <div className="d-flex align-items-center gap-2">
              <div style={{ width: 36, height: 36, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? '#312e81' : '#eef2ff', color: '#6366f1' }}>
                <FontAwesomeIcon icon={faQrcode} />
              </div>
              <div>
                <h5 className="mb-0 fw-bold" style={{ fontSize: '1rem' }}>Invoice QR &amp; Share Link</h5>
                <small style={{ color: mutedColor, fontSize: '0.72rem' }}>{invoice.number} &middot; {invoice.customer}</small>
              </div>
            </div>
            <button onClick={onHide} className="btn-close" style={{ filter: isDark ? 'invert(1)' : 'none' }}></button>
          </div>

          <div className="modal-body px-4 pb-4 pt-2">
            <div className="text-center mb-3">
              <div className="d-inline-block p-3" style={{ background: '#fff', borderRadius: '14px', border: `1px solid ${borderColor}` }}>
                {shareUrl ? (
                  <QRCodeSVG value={shareUrl} size={168} fgColor="#1e293b" bgColor="#ffffff" level="M" />
                ) : (
                  <div style={{ width: 168, height: 168, display: 'flex', alignItems: 'center', justifyContent: 'center', color: mutedColor, fontSize: '0.75rem' }}>
                    {loading ? 'Generating...' : revoked ? 'Link revoked' : 'No active link'}
                  </div>
                )}
              </div>
              {shareUrl && (
                <div ref={qrExportRef} style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
                  <QRCodeCanvas value={shareUrl} size={512} fgColor="#1e293b" bgColor="#ffffff" level="M" />
                </div>
              )}
              <div style={{ color: mutedColor, fontSize: '0.68rem', marginTop: 6 }}>Scan to open this invoice online</div>
            </div>

            <label className="form-label d-flex align-items-center gap-1 mb-1" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: mutedColor }}>
              <FontAwesomeIcon icon={faLink} style={{ fontSize: '0.65rem' }} /> Public Link
            </label>
            <div className="d-flex gap-2 mb-1">
              <input
                readOnly
                value={shareUrl || (revoked ? 'Link revoked' : loading ? 'Generating...' : 'No active link')}
                onFocus={(e) => e.target.select()}
                className="form-control form-control-sm font-monospace"
                style={{ fontSize: '0.7rem', background: isDark ? '#0f172a' : '#f8fafc', borderColor, color: textColor }}
              />
              <button className="btn btn-sm flex-shrink-0 text-white border-0" disabled={!shareUrl} onClick={handleCopy}
                style={{ borderRadius: 8, background: copied ? '#10b981' : '#6366f1', fontSize: '0.72rem', minWidth: 74 }}>
                <FontAwesomeIcon icon={copied ? faCheckCircle : faCopy} className="me-1" />
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <ul className="ps-3 mb-3 mt-2" style={{ color: mutedColor, fontSize: '0.68rem' }}>
              <li>Anyone with this link can view the invoice — no login required.</li>
              <li>You can revoke access at any time.</li>
            </ul>

            <div className="d-flex gap-2 justify-content-end">
              <button className="btn btn-sm d-flex align-items-center gap-1" onClick={() => ensureShare({ regenerate: true })} disabled={loading}
                style={{ borderRadius: 8, border: `1px solid ${borderColor}`, background: 'transparent', color: textColor, fontSize: '0.72rem' }}>
                <FontAwesomeIcon icon={faRotateRight} /> Regenerate
              </button>
              <button className="btn btn-sm d-flex align-items-center gap-1" onClick={handleDownloadQr} disabled={!shareUrl}
                style={{ borderRadius: 8, border: `1px solid ${borderColor}`, background: 'transparent', color: textColor, fontSize: '0.72rem' }}>
                <FontAwesomeIcon icon={faDownload} /> QR PNG
              </button>
              <button className="btn btn-sm d-flex align-items-center gap-1" onClick={handleRevoke} disabled={!shareUrl}
                style={{ borderRadius: 8, border: '1px solid #fca5a5', background: isDark ? '#450a0a' : '#fee2e2', color: '#dc2626', fontSize: '0.72rem' }}>
                <FontAwesomeIcon icon={faBan} /> Revoke
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceShareDialog;
