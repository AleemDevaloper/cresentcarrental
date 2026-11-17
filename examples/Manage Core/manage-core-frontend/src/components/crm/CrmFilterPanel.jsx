import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';

const CrmFilterPanel = ({
  filters = [],
  onChange,
  onReset,
  isDark = false,
  isCollapsed = false,
  onToggle,
}) => {
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0';
  const bg = isDark ? 'rgba(255,255,255,0.03)' : '#fff';

  const handleFieldChange = (key, value) => {
    const next = { ...(filters || []).reduce((acc, f) => ({ ...acc, [f.key]: f.value }), {}) };
    next[key] = value;
    onChange?.(next);
  };

  if (isCollapsed) {
    return (
      <button
        className="btn btn-sm border-0"
        style={{ background: bg, color: textColor, borderRadius: '8px', border: `1px solid ${borderColor}` }}
        onClick={onToggle}
      >
        <FontAwesomeIcon icon={faFilter} className="me-1" /> Filters
      </button>
    );
  }

  return (
    <div style={{
      background: bg,
      border: `1px solid ${borderColor}`,
      borderRadius: '12px',
      padding: '1rem',
      minWidth: '240px',
    }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0" style={{ color: textColor, fontSize: '0.85rem', fontWeight: 600 }}>
          <FontAwesomeIcon icon={faFilter} className="me-2" />Filters
        </h6>
        <div>
          <button
            className="btn btn-sm border-0 me-1"
            style={{ color: mutedColor, fontSize: '0.75rem' }}
            onClick={onReset}
            title="Reset"
          >
            Reset
          </button>
          <button
            className="btn btn-sm border-0"
            style={{ color: mutedColor }}
            onClick={onToggle}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
      <div className="d-flex flex-column gap-2">
        {filters.map((f) => (
          <div key={f.key}>
            <label className="form-label small mb-1" style={{ color: mutedColor }}>
              {f.label}
            </label>
            {f.type === 'select' ? (
              <select
                className="form-select form-select-sm"
                style={{ background: bg, color: textColor, borderColor }}
                value={f.value ?? ''}
                onChange={(e) => handleFieldChange(f.key, e.target.value)}
              >
                <option value="">All</option>
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            ) : f.type === 'date' ? (
              <input
                type="date"
                className="form-control form-control-sm"
                style={{ background: bg, color: textColor, borderColor }}
                value={f.value ?? ''}
                onChange={(e) => handleFieldChange(f.key, e.target.value)}
              />
            ) : (
              <input
                type="text"
                className="form-control form-control-sm"
                style={{ background: bg, color: textColor, borderColor }}
                placeholder={f.placeholder || ''}
                value={f.value ?? ''}
                onChange={(e) => handleFieldChange(f.key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrmFilterPanel;