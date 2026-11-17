import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const CrmSearchBar = ({
  value = '',
  onChange,
  placeholder = 'Search...',
  delay = 400,
  isDark = false,
  width = '300px',
}) => {
  const [local, setLocal] = useState(value);
  const timer = React.useRef(null);

  React.useEffect(() => {
    setLocal(value);
  }, [value]);

  const handleChange = (e) => {
    const v = e.target.value;
    setLocal(v);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange?.(v), delay);
  };

  return (
    <div className="input-group input-group-sm" style={{ width }}>
      <span className="input-group-text bg-transparent" style={{
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
        color: isDark ? '#94a3b8' : '#64748b',
      }}>
        <FontAwesomeIcon icon={faSearch} />
      </span>
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={local}
        onChange={handleChange}
        style={{
          background: isDark ? 'rgba(255,255,255,0.03)' : '#fff',
          color: isDark ? '#e2e8f0' : '#1e293b',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
        }}
      />
    </div>
  );
};

export default CrmSearchBar;