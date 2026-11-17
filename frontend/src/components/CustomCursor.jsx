import { useEffect, useState, useRef } from 'react';
import { prefersReducedMotion } from '../config/experienceConfig';

const INTERACTIVE =
  'a, button, .btn, .text-link, [role="button"], input, textarea, select, label, summary, .back-to-top, .mobile-menu, .menu-toggle';

const FINE_POINTER = '(min-width: 900px) and (hover: hover) and (pointer: fine)';

function isCursorEnabled() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  if (prefersReducedMotion()) return false;
  return window.matchMedia(FINE_POINTER).matches;
}

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [textMode, setTextMode] = useState(false);
  const ringRef = useRef(null);
  const dotRef = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const raf = useRef(0);

  useEffect(() => {
    setEnabled(isCursorEnabled());
    const mq = window.matchMedia(FINE_POINTER);
    const onChange = () => setEnabled(isCursorEnabled());
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;

    document.documentElement.classList.add('has-custom-cursor');

    const onMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      setVisible(true);

      const el = e.target instanceof Element ? e.target : null;
      if (!el) return;
      const interactive = Boolean(el.closest(INTERACTIVE));
      const isText =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el instanceof HTMLElement && el.isContentEditable) ||
        (el.closest('input, textarea, [contenteditable="true"]') != null);
      setHovering(interactive);
      setTextMode(isText && !interactive);
    };

    const onLeave = () => setVisible(false);
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    const tick = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.18;
      pos.current.y += (target.current.y - pos.current.y) * 0.18;
      const { x, y } = pos.current;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      cancelAnimationFrame(raf.current);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  const state = [visible && 'is-visible', pressed && 'is-pressed', hovering && 'is-hover', textMode && 'is-text']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`cursor-root ${state}`} aria-hidden="true">
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
