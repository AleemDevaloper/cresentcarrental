import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUndo, faRedo, faPaintBrush, faBold, faItalic, faUnderline,
  faFilter, faSort, faChartSimple, faSearchMinus, faSearchPlus,
} from '@fortawesome/free-solid-svg-icons';

const SHEETS = ['Budget', 'Revenue', 'Headcount'];
const DATA = {
  'Budget': [
    ['Project', 'Q1 Budget', 'Q1 Actual', 'Q2 Budget', 'Q2 Actual', 'Variance', 'Status'],
    ['HRMS', '$120,000', '$115,000', '$130,000', '$128,000', '$2,000', 'On Track'],
    ['PMS', '$95,000', '$92,000', '$100,000', '$97,000', '$3,000', 'On Track'],
    ['FMS', '$200,000', '$195,000', '$210,000', '$208,000', '$2,000', 'On Track'],
    ['TMS', '$45,000', '$42,000', '$50,000', '$48,000', '$2,000', 'On Track'],
    ['DMS', '$60,000', '$58,000', '$65,000', '$63,000', '$2,000', 'On Track'],
    ['CRM', '$35,000', '$32,000', '$40,000', '$38,000', '$2,000', 'At Risk'],
    ['Infrastructure', '$80,000', '$78,000', '$85,000', '$82,000', '$3,000', 'On Track'],
    ['Operations', '$55,000', '$53,000', '$58,000', '$56,000', '$2,000', 'On Track'],
    ['Total', '$690,000', '$665,000', '$738,000', '$720,000', '$18,000', 'On Track'],
  ],
  'Revenue': [
    ['Month', 'Revenue', 'Expenses', 'Profit'],
    ['Jan', '$180K', '$120K', '$60K'],
    ['Feb', '$195K', '$125K', '$70K'],
    ['Mar', '$210K', '$130K', '$80K'],
    ['Apr', '$205K', '$128K', '$77K'],
    ['May', '$220K', '$135K', '$85K'],
    ['Jun', '$240K', '$140K', '$100K'],
  ],
  'Headcount': [
    ['Department', 'Headcount', 'Avg Salary', 'Total Cost'],
    ['Engineering', 45, '$85,000', '$3,825,000'],
    ['Finance', 12, '$72,000', '$864,000'],
    ['HR', 8, '$60,000', '$480,000'],
    ['Sales', 20, '$78,000', '$1,560,000'],
  ],
};
const FORMULAS = { Budget: '=SUM(B2:B9)', Revenue: '=SUM(C2:C7)', Headcount: '=AVERAGE(B2:B5)' };

const SpreadsheetViewer = ({ zoomLevel, setZoomLevel }) => {
  const [activeSheet, setActiveSheet] = useState(0);
  const sheetData = DATA[SHEETS[activeSheet]] || [];
  const colCount = Math.max(...sheetData.map(r => r ? r.length : 0), 1);
  const cols = Array.from({ length: colCount }, (_, i) => String.fromCharCode(65 + i));
  const colWidth = Math.max(90, Math.floor(800 / colCount));
  const cellStyle = { width: colWidth, minWidth: colWidth };
  const headerStyle = { width: colWidth, minWidth: colWidth };

  return (
    <div className="tdc-viewer-content">
      <div className="tdc-sheet-toolbar">
        <div className="d-flex align-items-center gap-1"><button className="tdc-tb-btn"><FontAwesomeIcon icon={faUndo} /></button><button className="tdc-tb-btn"><FontAwesomeIcon icon={faRedo} /></button><span className="tdc-tb-divider"></span></div>
        <div className="d-flex align-items-center gap-1"><button className="tdc-tb-btn"><FontAwesomeIcon icon={faPaintBrush} /></button><button className="tdc-tb-btn"><FontAwesomeIcon icon={faBold} /></button><button className="tdc-tb-btn"><FontAwesomeIcon icon={faItalic} /></button><button className="tdc-tb-btn"><FontAwesomeIcon icon={faUnderline} /></button><span className="tdc-tb-divider"></span></div>
        <div className="d-flex align-items-center gap-1"><button className="tdc-tb-btn"><FontAwesomeIcon icon={faFilter} /></button><button className="tdc-tb-btn"><FontAwesomeIcon icon={faSort} /></button><button className="tdc-tb-btn"><FontAwesomeIcon icon={faChartSimple} /></button></div>
        <div className="ms-auto d-flex align-items-center gap-2"><span className="tdc-zoom-label">{zoomLevel}%</span><button className="tdc-tb-btn" onClick={() => setZoomLevel(p => Math.max(50, p - 10))}><FontAwesomeIcon icon={faSearchMinus} /></button><button className="tdc-tb-btn" onClick={() => setZoomLevel(p => Math.min(200, p + 10))}><FontAwesomeIcon icon={faSearchPlus} /></button></div>
      </div>
      <div className="tdc-sheet-container" style={{ zoom: `${zoomLevel}%` }}>
        <div className="tdc-sheet-bar"><span className="text-muted small me-3">Formula Bar:</span><span className="tdc-sheet-formula">{FORMULAS[SHEETS[activeSheet]]}</span></div>
        <div className="tdc-sheet-grid">
          <div className="tdc-sheet-row"><div className="tdc-sheet-corner"></div>{cols.map(c => <div key={c} className="tdc-sheet-header" style={headerStyle}>{c}</div>)}</div>
          {sheetData.map((row, ri) => (
            <div key={ri} className="tdc-sheet-row">
              <div className="tdc-sheet-header">{ri + 1}</div>
              {cols.map((c, ci) => (
                <div key={c} className={`tdc-sheet-cell ${ri === 0 ? 'tdc-sheet-cell-bold' : ''} ${ri === sheetData.length - 1 ? 'tdc-sheet-cell-total' : ''}`} style={cellStyle}>
                  {row[ci] || ''}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="tdc-sheet-tabs">{SHEETS.map((s, i) => (
        <button key={s} className={`tdc-sheet-tab ${activeSheet === i ? 'active' : ''}`} onClick={() => setActiveSheet(i)}>{s}</button>
      ))}</div>
    </div>
  );
};

export default SpreadsheetViewer;
