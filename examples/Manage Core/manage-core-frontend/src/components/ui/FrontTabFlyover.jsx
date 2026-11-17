import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faLayerGroup, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../context/AppContext';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const parseWidth = (width) => {
  if (typeof width === 'number') return width;
  if (typeof width === 'string') return parseInt(width, 10) || 380;
  return 380;
};

const FrontTabFlyover = ({
  isOpen,
  onClose,
  title,
  children,
  width = '390px',
  index = 0,
  anchorRect = null,
  hoverOpen = false,
}) => {
  const { isSidebarOpen } = useApp();
  const panelRef = useRef(null);
  const [mounted, setMounted] = useState(isOpen);
  const [animatedOpen, setAnimatedOpen] = useState(false);
  const [position, setPosition] = useState({ top: 72, left: 96, pointerTop: 28, side: 'left' });

  const panelWidth = useMemo(() => parseWidth(width), [width]);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setAnimatedOpen(false);
      const timer = setTimeout(() => setAnimatedOpen(true), 16);
      return () => clearTimeout(timer);
    }

    setAnimatedOpen(false);
    const timer = setTimeout(() => setMounted(false), 300);
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || index > 0 || hoverOpen) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, index, hoverOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !hoverOpen) return undefined;

    // Hover previews stay open until dismissed: clicking anywhere outside
    // the sidebar and the flyover closes them (no more surprise auto-close).
    const handleClickOutside = (event) => {
      const panel = panelRef.current;
      const sidebarEl = document.querySelector('.sidebarcol');
      const insidePanel = panel && panel.contains(event.target);
      const insideSidebar = sidebarEl && sidebarEl.contains(event.target);
      if (!insidePanel && !insideSidebar) onClose();
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen, hoverOpen, onClose]);

  useLayoutEffect(() => {
    if (!mounted) return undefined;

    const updatePosition = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const margin = viewportWidth < 768 ? 12 : 16;
      const stagger = anchorRect ? 0 : index * 18;
      const measuredHeight = panelRef.current?.offsetHeight || Math.round(viewportHeight * 0.72);
      const maxTop = Math.max(margin, viewportHeight - measuredHeight - margin);

      if (viewportWidth < 768) {
        setPosition({
          top: margin,
          left: margin,
          pointerTop: 24,
          side: 'none',
        });
        return;
      }

      const sidebarWidth = isSidebarOpen ? Math.min(Math.max(viewportWidth * 0.1667, 230), 340) : 80;
      const anchorHeight = anchorRect?.height || 42;
      const anchorCenterY = anchorRect ? anchorRect.top + anchorHeight / 2 : viewportHeight * 0.25;
      const desiredTop = anchorRect ? anchorRect.top : anchorCenterY - measuredHeight * 0.2;
      const top = clamp(Math.round(desiredTop), margin, maxTop);
      const pointerTop = clamp(Math.round(anchorCenterY - top), 24, measuredHeight - 24);

      const rightSideLeft = anchorRect?.right ? anchorRect.right + 10 + stagger : sidebarWidth + 18 + stagger;
      const canFitRight = rightSideLeft + panelWidth + margin <= viewportWidth;
      const leftSideLeft = anchorRect?.left ? anchorRect.left - panelWidth - 10 - stagger : margin;
      const canFitLeft = leftSideLeft >= margin;

      if (canFitRight || !canFitLeft) {
        setPosition({
          top,
          left: clamp(Math.round(rightSideLeft), margin, viewportWidth - panelWidth - margin),
          pointerTop,
          side: 'left',
        });
        return;
      }

      setPosition({
        top,
        left: Math.round(leftSideLeft),
        pointerTop,
        side: 'right',
      });
    };

    updatePosition();
    let rafId = null;
    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updatePosition();
      });
    };
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('scroll', scheduleUpdate, true);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', scheduleUpdate);
      window.removeEventListener('scroll', scheduleUpdate, true);
    };
  }, [mounted, anchorRect, panelWidth, isSidebarOpen, index]);

  if (!mounted) return null;

  const panelStyle = {
    '--flyover-width': `${panelWidth}px`,
    '--flyover-top': `${position.top}px`,
    '--flyover-left': `${position.left}px`,
    '--pointer-top': `${position.pointerTop}px`,
    zIndex: 1070 + index * 4,
  };

  return (
    <>
      {index === 0 && !hoverOpen && (
        <button
          type="button"
          className={`front-flyover-scrim ${isOpen ? 'is-open' : ''}`}
          onClick={onClose}
          aria-label="Close tab flyover"
        />
      )}

      <section
        ref={panelRef}
        className={`front-flyover-panel ${animatedOpen ? 'is-open' : 'is-closing'} pointer-${position.side}`}
        style={panelStyle}
        role="dialog"
        aria-modal={index === 0 ? 'true' : 'false'}
        aria-label={title}
      >
        <span className="front-flyover-pointer" aria-hidden="true" />

        <header className="front-flyover-header">
          <div className="front-flyover-title-wrap">
            <span className="front-flyover-title-icon">
              <FontAwesomeIcon icon={index > 0 ? faArrowLeft : faLayerGroup} />
            </span>
            <div>
              <p>Navigation</p>
              <h6>{title}</h6>
            </div>
          </div>
          <button type="button" className="front-flyover-close" onClick={onClose} aria-label="Close flyover">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </header>

        <div key={title} className="front-flyover-content">
          {children}
        </div>
      </section>

      <style>{`
        .front-flyover-scrim {
          position: fixed;
          inset: 0;
          border: 0;
          background: rgba(15, 23, 42, 0.18);
          backdrop-filter: blur(2px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 260ms ease;
          z-index: 1068;
        }

        .front-flyover-scrim.is-open {
          opacity: 1;
          pointer-events: auto;
        }

        .front-flyover-panel {
          position: fixed;
          top: var(--flyover-top);
          left: var(--flyover-left);
          width: min(var(--flyover-width), calc(100vw - 24px));
          max-height: min(720px, calc(100vh - 24px));
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(148, 163, 184, 0.28);
          border-radius: 14px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 250, 252, 0.94)),
            var(--sidebar-bg, #ffffff);
          color: var(--sidebar-text, #0f172a);
          box-shadow: 0 28px 70px rgba(15, 23, 42, 0.24), 0 1px 0 rgba(255,255,255,0.7) inset;
          overflow: visible;
          transform-origin: left var(--pointer-top);
          transition:
            opacity 240ms ease,
            transform 300ms cubic-bezier(0.16, 1, 0.3, 1),
            box-shadow 220ms ease;
          will-change: transform, opacity;
        }

        .front-flyover-panel.pointer-right {
          transform-origin: right var(--pointer-top);
        }

        .front-flyover-panel.is-open {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
          animation: flyoverPanelSettle 240ms cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .front-flyover-panel.is-closing {
          opacity: 0;
          transform: translate3d(-24px, 8px, 0) scale(0.955);
          pointer-events: none;
        }

        .front-flyover-panel.pointer-right.is-closing {
          transform: translate3d(24px, 8px, 0) scale(0.955);
        }

        .front-flyover-pointer {
          position: absolute;
          top: var(--pointer-top);
          width: 16px;
          height: 16px;
          background: rgba(255, 255, 255, 0.96);
          border-left: 1px solid rgba(148, 163, 184, 0.28);
          border-bottom: 1px solid rgba(148, 163, 184, 0.28);
          transform: translateY(-50%) rotate(45deg);
          z-index: 0;
        }

        .front-flyover-panel.pointer-left .front-flyover-pointer {
          left: -8px;
        }

        .front-flyover-panel.pointer-right .front-flyover-pointer {
          right: -8px;
          transform: translateY(-50%) rotate(225deg);
        }

        .front-flyover-panel.pointer-none .front-flyover-pointer {
          display: none;
        }

        .front-flyover-header {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 14px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.2);
          background: linear-gradient(135deg, rgba(79, 70, 229, 0.08), rgba(20, 184, 166, 0.08));
          border-radius: 14px 14px 0 0;
        }

        .front-flyover-panel.is-open .front-flyover-header {
          animation: flyoverHeaderIn 200ms cubic-bezier(0.16, 1, 0.3, 1) 20ms both;
        }

        .front-flyover-title-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }

        .front-flyover-title-icon {
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: rgba(79, 70, 229, 0.12);
          color: #4f46e5;
          flex: 0 0 auto;
        }

        .front-flyover-title-wrap p {
          margin: 0 0 2px;
          color: #64748b;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.7px;
          text-transform: uppercase;
        }

        .front-flyover-title-wrap h6 {
          margin: 0;
          color: #0f172a;
          font-size: 14px;
          font-weight: 800;
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .front-flyover-close {
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(148, 163, 184, 0.28);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.72);
          color: #475569;
          transition: transform 160ms ease, background 160ms ease, color 160ms ease;
          flex: 0 0 auto;
        }

        .front-flyover-close:hover {
          background: #ffffff;
          color: #0f172a;
          transform: translateY(-1px);
        }

        .front-flyover-content {
          position: relative;
          z-index: 1;
          padding: 10px;
          overflow: auto;
          scrollbar-width: thin;
        }

        .front-flyover-panel.is-open .front-flyover-content {
          animation: flyoverContentIn 220ms cubic-bezier(0.16, 1, 0.3, 1) 30ms both;
        }

        .front-flyover-content .nav {
          gap: 4px;
        }

        .front-flyover-content .nav-link {
          width: 100% !important;
          margin: 0 !important;
          padding: 10px !important;
          border: 1px solid transparent !important;
          border-radius: 10px !important;
          background: transparent !important;
          color: #334155 !important;
          box-shadow: none !important;
          opacity: 1;
          transform: none;
          transition:
            background 160ms ease,
            border-color 160ms ease,
            color 160ms ease,
            transform 200ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .front-flyover-content .nav-link:hover,
        .front-flyover-content .nav-link.active {
          background: rgba(79, 70, 229, 0.08) !important;
          border-color: rgba(79, 70, 229, 0.16) !important;
          color: #0f172a !important;
          transform: translateX(4px);
        }

        .front-flyover-panel.pointer-right .front-flyover-content .nav-link:hover,
        .front-flyover-panel.pointer-right .front-flyover-content .nav-link.active {
          transform: translateX(-4px);
        }

        .front-flyover-panel.is-open .front-flyover-content .nav-link {
          animation: flyoverItemIn 240ms cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        .front-flyover-panel.is-open .front-flyover-content .nav-link:nth-child(1) { animation-delay: 20ms; }
        .front-flyover-panel.is-open .front-flyover-content .nav-link:nth-child(2) { animation-delay: 40ms; }
        .front-flyover-panel.is-open .front-flyover-content .nav-link:nth-child(3) { animation-delay: 60ms; }
        .front-flyover-panel.is-open .front-flyover-content .nav-link:nth-child(4) { animation-delay: 80ms; }
        .front-flyover-panel.is-open .front-flyover-content .nav-link:nth-child(5) { animation-delay: 100ms; }
        .front-flyover-panel.is-open .front-flyover-content .nav-link:nth-child(n + 6) { animation-delay: 110ms; }

        .front-flyover-content .nav-link.active::after {
          display: none !important;
        }

        .front-flyover-content .side-icon-wrapper {
          width: 28px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: rgba(15, 23, 42, 0.06);
          color: #4f46e5 !important;
          margin: 0 !important;
          flex: 0 0 auto;
        }

        .front-flyover-content .navlable {
          color: inherit !important;
          font-size: 13px !important;
          font-weight: 700 !important;
          white-space: normal;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dark-mode .front-flyover-panel {
          background:
            linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(2, 6, 23, 0.96)),
            var(--sidebar-dark-bg, #0f172a);
          border-color: rgba(148, 163, 184, 0.16);
          box-shadow: 0 28px 70px rgba(0, 0, 0, 0.48);
        }

        .dark-mode .front-flyover-pointer {
          background: rgba(15, 23, 42, 0.98);
          border-color: rgba(148, 163, 184, 0.16);
        }

        .dark-mode .front-flyover-header {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.16), rgba(20, 184, 166, 0.09));
          border-bottom-color: rgba(148, 163, 184, 0.14);
        }

        .dark-mode .front-flyover-title-wrap h6 {
          color: #f8fafc;
        }

        .dark-mode .front-flyover-title-wrap p {
          color: #94a3b8;
        }

        .dark-mode .front-flyover-close {
          background: rgba(15, 23, 42, 0.72);
          border-color: rgba(148, 163, 184, 0.18);
          color: #cbd5e1;
        }

        .dark-mode .front-flyover-content .nav-link {
          color: #cbd5e1 !important;
        }

        .dark-mode .front-flyover-content .nav-link:hover,
        .dark-mode .front-flyover-content .nav-link.active {
          background: rgba(99, 102, 241, 0.16) !important;
          border-color: rgba(99, 102, 241, 0.24) !important;
          color: #ffffff !important;
        }

        @keyframes flyoverPanelSettle {
          0% { opacity: 0; transform: translate3d(-18px, 4px, 0) scale(0.97); }
          70% { opacity: 1; transform: translate3d(1px, 0, 0) scale(1.001); }
          100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        }

        .front-flyover-panel.pointer-right.is-open {
          animation-name: flyoverPanelSettleRight;
        }

        @keyframes flyoverPanelSettleRight {
          0% { opacity: 0; transform: translate3d(18px, 4px, 0) scale(0.97); }
          70% { opacity: 1; transform: translate3d(-1px, 0, 0) scale(1.001); }
          100% { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        }

        @keyframes flyoverHeaderIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes flyoverContentIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes flyoverItemIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .front-flyover-panel.pointer-right .front-flyover-content .nav-link {
          animation-name: flyoverItemInRight;
        }

        @keyframes flyoverItemInRight {
          from { opacity: 0; transform: translateX(8px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .front-flyover-panel,
          .front-flyover-pointer,
          .front-flyover-scrim,
          .front-flyover-content .nav-link {
            animation: none !important;
            transition: none !important;
          }

          .front-flyover-panel,
          .front-flyover-content .nav-link {
            opacity: 1 !important;
            transform: none !important;
            filter: none !important;
          }
        }

        .dark-mode .front-flyover-content .side-icon-wrapper {
          background: rgba(255, 255, 255, 0.08);
          color: #a5b4fc !important;
        }

        @media (max-width: 767.98px) {
          .front-flyover-panel {
            top: 12px !important;
            left: 12px !important;
            width: calc(100vw - 24px) !important;
            max-height: calc(100vh - 24px);
            border-radius: 14px;
          }
        }
      `}</style>
    </>
  );
};

export default FrontTabFlyover;
