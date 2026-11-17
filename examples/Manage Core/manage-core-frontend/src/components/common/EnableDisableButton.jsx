
import React from 'react';

const EnableDisableButton = React.memo(({
  checked = false,
  onClick,
  label = '',
  disabled = false,
  size = 'medium',
  className = '',
  ...props
}) => {
  const sizeClasses = {
    small: 'eds-sm',
    medium: '',
    large: 'eds-lg',
  };

  const classes = [
    'enable-disable-switch',
    checked ? 'is-enabled' : 'is-disabled',
    sizeClasses[size],
    disabled && 'eds-disabled',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={checked}
      aria-label={`${checked ? 'Disable' : 'Enable'} ${label}`}
      {...props}
    >
      <span className="enable-disable-track" aria-hidden="true">
        <span className="enable-disable-thumb" />
      </span>
      <span className="enable-disable-text">{checked ? 'Enabled' : 'Disabled'}</span>
    </button>
  );
});

EnableDisableButton.displayName = 'EnableDisableButton';

export default EnableDisableButton;
