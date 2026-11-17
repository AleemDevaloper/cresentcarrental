import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes } from '@fortawesome/free-solid-svg-icons';

const CrmFileUploader = ({
  onUpload,
  accept = '*/*',
  maxSize = 51200,
  multiple = false,
  isDark = false,
  label = 'Upload files',
}) => {
  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [dragging, setDragging] = useState(false);

  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : '#cbd5e1';

  const handleFiles = (newFiles) => {
    const arr = Array.from(newFiles).filter(f => f.size <= maxSize * 1024);
    setFiles(prev => multiple ? [...prev, ...arr] : arr.slice(0, 1));
    onUpload?.(multiple ? arr : arr[0]);
  };

  const remove = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        style={{
          border: `2px dashed ${dragging ? '#6366f1' : borderColor}`,
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center',
          background: dragging ? (isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.05)') : 'transparent',
          cursor: 'pointer',
          color: mutedColor,
          transition: 'all 0.2s',
        }}
      >
        <FontAwesomeIcon icon={faUpload} size="2x" style={{ color: '#6366f1', marginBottom: 8 }} />
        <div style={{ color: textColor, fontWeight: 500 }}>{label}</div>
        <div className="small">Drag and drop or click to browse</div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          style={{ display: 'none' }}
        />
      </div>
      {files.length > 0 && (
        <div className="mt-2">
          {files.map((f, i) => (
            <div key={i} className="d-flex align-items-center gap-2 p-2" style={{
              background: isDark ? 'rgba(255,255,255,0.05)' : '#f8fafc',
              borderRadius: '8px',
              marginBottom: '4px',
              color: textColor,
              fontSize: '0.8rem',
            }}>
              <FontAwesomeIcon icon={faUpload} style={{ color: '#6366f1' }} />
              <span style={{ flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{f.name}</span>
              <span style={{ color: mutedColor }}>{(f.size / 1024).toFixed(1)} KB</span>
              <button className="btn btn-sm border-0" onClick={() => remove(i)} style={{ color: '#ef4444' }}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CrmFileUploader;