import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUndo, faRedo, faFile, faImage, faChartSimple, faPlay,
  faSearchMinus, faSearchPlus, faChevronLeft, faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const SLIDES = [
  { title: 'Sprint 24: Retrospective', subtitle: 'Key achievements, challenges, and action items', bg: '#1e293b', fg: '#fff' },
  { title: 'Completed Stories', subtitle: '12 of 16 stories delivered this sprint', bg: '#f0fdf4', fg: '#0f172a' },
  { title: 'Blockers & Risks', subtitle: '1 critical issue identified', bg: '#fef2f2', fg: '#0f172a' },
];

const PresentationViewer = ({ zoomLevel, setZoomLevel }) => {
  const [slideIdx, setSlideIdx] = useState(0);
  const slide = SLIDES[slideIdx];

  return (
    <div className="tdc-viewer-content">
      <div className="tdc-slide-toolbar">
        <div className="d-flex align-items-center gap-1"><button className="tdc-tb-btn"><FontAwesomeIcon icon={faUndo} /></button><button className="tdc-tb-btn"><FontAwesomeIcon icon={faRedo} /></button><span className="tdc-tb-divider"></span></div>
        <div className="d-flex align-items-center gap-1"><button className="tdc-tb-btn"><FontAwesomeIcon icon={faFile} /></button><button className="tdc-tb-btn"><FontAwesomeIcon icon={faImage} /></button><button className="tdc-tb-btn"><FontAwesomeIcon icon={faChartSimple} /></button><button className="tdc-tb-btn"><FontAwesomeIcon icon={faPlay} /></button><span className="tdc-tb-divider"></span></div>
        <div className="d-flex align-items-center gap-2 ms-auto">
          <span className="tdc-zoom-label">{zoomLevel}%</span>
            <button className="tdc-tb-btn" onClick={() => setZoomLevel(p => Math.max(50, p - 10))}><FontAwesomeIcon icon={faSearchMinus} /></button>
          <button className="tdc-tb-btn" onClick={() => setZoomLevel(p => Math.min(200, p + 10))}><FontAwesomeIcon icon={faSearchPlus} /></button>
        </div>
      </div>
      <div className="tdc-slide-canvas" style={{ zoom: `${zoomLevel}%`, background: slide.bg }}>
        <div className="tdc-slide-page">
          <span className="tdc-slide-number">{slideIdx + 1} / {SLIDES.length}</span>
          <h1 className="tdc-slide-title" style={{ color: slide.fg }}>{slide.title}</h1>
          <p className="tdc-slide-subtitle" style={{ color: slide.fg }}>{slide.subtitle}</p>
          {slideIdx === 0 && (
            <div className="row g-3 mt-3" style={{ maxWidth: 500, margin: '0 auto' }}>
              <div className="col-4"><div className="p-3 rounded-3 text-center" style={{ background: 'rgba(255,255,255,0.15)' }}><div className="fs-2 fw-bold" style={{ color: slide.fg }}>12</div><div className="small" style={{ color: slide.fg }}>Completed</div></div></div>
              <div className="col-4"><div className="p-3 rounded-3 text-center" style={{ background: 'rgba(255,255,255,0.15)' }}><div className="fs-2 fw-bold" style={{ color: slide.fg }}>3</div><div className="small" style={{ color: slide.fg }}>In Progress</div></div></div>
              <div className="col-4"><div className="p-3 rounded-3 text-center" style={{ background: 'rgba(255,255,255,0.15)' }}><div className="fs-2 fw-bold" style={{ color: slide.fg }}>1</div><div className="small" style={{ color: slide.fg }}>Blocked</div></div></div>
            </div>
          )}
        </div>
      </div>
      <div className="tdc-slide-navbar">
        <button className="tdc-tb-btn" onClick={() => setSlideIdx(Math.max(0, slideIdx - 1))}><FontAwesomeIcon icon={faChevronLeft} /></button>
        <div className="d-flex gap-1 mx-2">{SLIDES.map((_, i) => (
          <div key={i} className={`tdc-slide-dot ${i === slideIdx ? 'active' : ''}`} onClick={() => setSlideIdx(i)} />
        ))}</div>
        <button className="tdc-tb-btn" onClick={() => setSlideIdx(Math.min(SLIDES.length - 1, slideIdx + 1))}><FontAwesomeIcon icon={faChevronRight} /></button>
      </div>
    </div>
  );
};

export default PresentationViewer;
