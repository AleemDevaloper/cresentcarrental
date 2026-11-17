import { forwardRef, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { prefersReducedMotion } from '../config/experienceConfig';

const MAGNETIC_MAX = 4; // px — very small, never jumps

function canUseMagnetic() {
  if (typeof window === 'undefined' || prefersReducedMotion()) return false;
  if (!window.matchMedia) return false;
  return window.matchMedia('(min-width: 900px) and (hover: hover) and (pointer: fine)').matches;
}

/**
 * Premium button — composes existing .btn classes + interaction system.
 *
 * variant: red | ghost | outline-light | outline-dark | light | dark | whatsapp
 * size:    sm | md | lg
 * as:      button | a | link (react-router)
 * loading: spinner + disabled (preserves width via min content)
 * magnetic: desktop-only micro-follow for primary CTAs
 */
const Button = forwardRef(function Button(
  {
    variant = 'red',
    size = 'md',
    type = 'button',
    as = 'button',
    to,
    href,
    loading = false,
    success = false,
    disabled = false,
    fullWidth = false,
    magnetic = false,
    className = '',
    children,
    onClick,
    ...rest
  },
  ref,
) {
  const innerRef = useRef(null);
  const setRefs = (node) => {
    innerRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  };

  const magneticOn = magnetic && canUseMagnetic();

  useEffect(() => {
    const el = innerRef.current;
    if (!magneticOn || !el) return undefined;

    let frame = 0;
    let active = false;

    const clear = () => {
      active = false;
      el.classList.remove('is-magnetic-active');
      el.style.setProperty('--mag-x', '0px');
      el.style.setProperty('--mag-y', '0px');
    };

    const onMove = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      const rect = el.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      const x = Math.max(-MAGNETIC_MAX, Math.min(MAGNETIC_MAX, nx * MAGNETIC_MAX * 2));
      const y = Math.max(-MAGNETIC_MAX, Math.min(MAGNETIC_MAX, ny * MAGNETIC_MAX * 2));
      if (!active) {
        active = true;
        el.classList.add('is-magnetic-active');
      }
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty('--mag-x', `${x.toFixed(2)}px`);
        el.style.setProperty('--mag-y', `${y.toFixed(2)}px`);
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(frame);
      clear();
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('pointercancel', onLeave);
    el.addEventListener('blur', onLeave);

    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('pointercancel', onLeave);
      el.removeEventListener('blur', onLeave);
      clear();
    };
  }, [magneticOn]);

  const classes = [
    'btn',
    variant !== 'md' ? `btn-${variant}` : '',
    size === 'lg' ? 'btn-lg' : size === 'sm' ? 'btn-sm' : '',
    fullWidth ? 'w-100' : '',
    loading ? 'is-loading' : '',
    success ? 'is-success' : '',
    className,
  ].filter(Boolean).join(' ');

  const isDisabled = disabled || loading;
  const content = loading ? (
    <>
      <span className="btn-spinner" aria-hidden="true" />
      <span>Processing…</span>
    </>
  ) : success ? (
    <>
      <span aria-hidden="true">✓</span>
      <span>{typeof success === 'string' ? success : 'Done'}</span>
    </>
  ) : (
    children
  );

  const shared = {
    ref: setRefs,
    className: classes,
    'aria-busy': loading || undefined,
    'aria-disabled': isDisabled || undefined,
    'data-magnetic': magneticOn ? 'true' : undefined,
    onClick: (event) => {
      if (isDisabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      onClick?.(event);
    },
    ...rest,
  };

  if (as === 'link' && to) {
    if (isDisabled) {
      return (
        <span {...shared} role="link" aria-disabled="true">
          {content}
        </span>
      );
    }
    return <Link to={to} {...shared}>{content}</Link>;
  }

  if (as === 'a') {
    return (
      <a
        href={href}
        {...shared}
        {...(isDisabled ? { 'aria-disabled': 'true', tabIndex: -1 } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button type={type} disabled={isDisabled} {...shared}>
      {content}
    </button>
  );
});

export default Button;
