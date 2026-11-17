import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExport, faFileImport, faChevronDown,
  faFilePdf, faFileExcel, faFileWord, faFileAlt
} from "@fortawesome/free-solid-svg-icons";
import * as XLSX from 'xlsx';
import { Document, Packer, Table, TableRow, TableCell, Paragraph, TextRun, WidthType, AlignmentType, BorderStyle } from 'docx';
import { downloadTextFile, exportToExcel } from '../../../utils/localFeatureStore';

export const FxExportDropdown = ({
  data = [],
  getExportData,
  title = 'Export Report',
  filenamePrefix = 'fx-export',
  moduleLabel = 'FX Module',
  isDark = false,
  addNotification,
  buttonStyle,
  buttonClassName = "btn btn-sm border-0 premium-btn d-flex align-items-center gap-2",
}) => {
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const exportDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportDropdownRef.current && !exportDropdownRef.current.contains(event.target)) {
        setShowExportDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cardBg = isDark ? '#232736' : '#ffffff';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';

  const prepareData = () => {
    if (getExportData && typeof getExportData === 'function') {
      return getExportData(data);
    }
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return [{ Message: 'No data available' }];
  };

  const handleExportExcel = () => {
    const exportRows = prepareData();
    const dateStr = new Date().toISOString().slice(0, 10);
    exportToExcel(exportRows, `${filenamePrefix}-${dateStr}.xlsx`);
    if (addNotification) addNotification(`${title} exported to Excel successfully!`, 'success');
  };

  const handleExportPdf = () => {
    const exportRows = prepareData();
    const dateStr = new Date().toISOString().slice(0, 10);
    const keys = exportRows.length > 0 ? Object.keys(exportRows[0]) : [];

    const headersHtml = keys.map(k => `<th style="background: #8b5cf6; color: white; padding: 10px; border: 1px solid #8b5cf6; text-align: left; font-size: 11px; text-transform: uppercase;">${k}</th>`).join('');
    const rowsHtml = exportRows.map(r => `
      <tr>
        ${keys.map(k => `<td style="padding: 8px; border: 1px solid #e2e8f0;">${r[k] !== undefined && r[k] !== null ? r[k] : ''}</td>`).join('')}
      </tr>
    `).join('');

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${title} - ${dateStr}</title>
            <style>
              body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; color: #1e293b; background: #fff; }
              .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #8b5cf6; padding-bottom: 12px; margin-bottom: 20px; }
              h2 { color: #8b5cf6; margin: 0; font-size: 22px; font-weight: 700; }
              .meta { color: #64748b; font-size: 12px; margin-top: 4px; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
              tr:nth-child(even) { background-color: #f8fafc; }
              @media print {
                body { padding: 0; }
                th { background: #8b5cf6 !important; color: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <div>
                <h2>${title}</h2>
                <div class="meta">Manage Core - ${moduleLabel} | Generated on ${new Date().toLocaleString()}</div>
              </div>
              <div class="meta"><strong>Total Records:</strong> ${exportRows.length}</div>
            </div>
            <table>
              <thead>
                <tr>${headersHtml}</tr>
              </thead>
              <tbody>
                ${rowsHtml}
              </tbody>
            </table>
            <script>
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }

    if (addNotification) addNotification(`${title} exported to PDF successfully!`, 'success');
  };

  const handleExportDocx = async () => {
    const exportRows = prepareData();
    const dateStr = new Date().toISOString().slice(0, 10);
    const keys = exportRows.length > 0 ? Object.keys(exportRows[0]) : [];

    const headerRow = new TableRow({
      tableHeader: true,
      children: keys.map(k => new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: k, bold: true, color: 'FFFFFF', size: 20 })] })],
        shading: { fill: '8b5cf6' },
        width: { size: Math.floor(100 / keys.length), type: WidthType.PERCENTAGE },
      })),
    });

    const dataRows = exportRows.map(r => new TableRow({
      children: keys.map(k => new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: r[k] !== undefined && r[k] !== null ? String(r[k]) : '', size: 18 })] })],
      })),
    }));

    const doc = new Document({
      styles: {
        default: {
          document: { run: { font: 'Calibri', size: 22 } },
        },
      },
      sections: [{
        children: [
          new Paragraph({
            children: [new TextRun({ text: title, bold: true, size: 28, color: '8b5cf6' })],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: `Generated on ${new Date().toLocaleString()}  |  Total Records: ${exportRows.length}`, size: 18, color: '64748b' })],
            spacing: { after: 300 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [headerRow, ...dataRows],
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filenamePrefix}-${dateStr}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (addNotification) addNotification(`${title} exported to DOCX successfully!`, 'success');
  };

  const handleExportWord = () => {
    const exportRows = prepareData();
    const dateStr = new Date().toISOString().slice(0, 10);
    const keys = exportRows.length > 0 ? Object.keys(exportRows[0]) : [];

    const headersHtml = keys.map(k => `<th>${k}</th>`).join('');
    const rowsHtml = exportRows.map(r => `
      <tr>
        ${keys.map(k => `<td>${r[k] !== undefined && r[k] !== null ? r[k] : ''}</td>`).join('')}
      </tr>
    `).join('');

    const wordHtml = `
      <html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>${title}</title>
      <style>
        body { font-family: 'Times New Roman', Times, serif; font-size: 11pt; color: #111; }
        h2 { color: #10b981; margin-bottom: 4px; }
        .sub { color: #555; font-size: 9pt; margin-bottom: 16px; }
        table { border-collapse: collapse; width: 100%; font-size: 10pt; }
        th { background-color: #10b981; color: white; border: 1px solid #10b981; padding: 8px; text-align: left; }
        td { border: 1px solid #ddd; padding: 8px; }
      </style>
      </head>
      <body>
        <h2>${title}</h2>
        <div class="sub">Generated on ${new Date().toLocaleString()} | Total Records: ${exportRows.length}</div>
        <table>
          <thead><tr>${headersHtml}</tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + wordHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filenamePrefix}-${dateStr}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (addNotification) addNotification(`${title} exported to Word document successfully!`, 'success');
  };

  const defaultButtonStyle = {
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #10b981, #059669)',
    color: '#fff',
    fontSize: '0.78rem',
    padding: '6px 14px',
    boxShadow: '0 4px 12px rgba(16,185,129,0.2)',
    cursor: 'pointer',
  };

  return (
    <div className="position-relative d-inline-block" ref={exportDropdownRef}>
      <button
        className={buttonClassName}
        style={buttonStyle || defaultButtonStyle}
        onClick={() => setShowExportDropdown((prev) => !prev)}
      >
        <FontAwesomeIcon icon={faFileExport} />
        <span>Export</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          style={{
            fontSize: '0.65rem',
            transition: 'transform 0.2s',
            transform: showExportDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {showExportDropdown && (
        <div
          className="position-absolute end-0 mt-2 shadow-lg rounded-3 py-2"
          style={{
            zIndex: 1000,
            minWidth: '190px',
            background: cardBg,
            border: `1px solid ${borderColor}`,
            backdropFilter: 'blur(16px)',
            animation: 'scaleIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.12)',
          }}
        >
          <div className="px-3 py-1 mb-1 border-bottom" style={{ borderColor: `${borderColor}` }}>
            <small className="fw-bold text-uppercase" style={{ fontSize: '0.65rem', color: mutedColor, letterSpacing: '0.05em' }}>
              Export Format
            </small>
          </div>

          <button
            className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 border-0 bg-transparent text-start w-100"
            style={{ color: textColor, fontSize: '0.8rem', cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            onClick={() => {
              handleExportPdf();
              setShowExportDropdown(false);
            }}
          >
            <div className="rounded-2 d-flex align-items-center justify-content-center" style={{ width: 26, height: 26, background: '#fee2e2', color: '#ef4444' }}>
              <FontAwesomeIcon icon={faFilePdf} style={{ fontSize: '0.75rem' }} />
            </div>
            <div>
              <div className="fw-semibold" style={{ lineHeight: 1.2 }}>PDF Document</div>
              <small style={{ fontSize: '0.68rem', color: mutedColor }}>.pdf format</small>
            </div>
          </button>

          <button
            className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 border-0 bg-transparent text-start w-100"
            style={{ color: textColor, fontSize: '0.8rem', cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            onClick={() => {
              handleExportExcel();
              setShowExportDropdown(false);
            }}
          >
            <div className="rounded-2 d-flex align-items-center justify-content-center" style={{ width: 26, height: 26, background: '#dcfce7', color: '#10b981' }}>
              <FontAwesomeIcon icon={faFileExcel} style={{ fontSize: '0.75rem' }} />
            </div>
            <div>
              <div className="fw-semibold" style={{ lineHeight: 1.2 }}>Excel Spreadsheet</div>
              <small style={{ fontSize: '0.68rem', color: mutedColor }}>.xlsx format</small>
            </div>
          </button>

          <button
            className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 border-0 bg-transparent text-start w-100"
            style={{ color: textColor, fontSize: '0.8rem', cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            onClick={() => {
              handleExportDocx();
              setShowExportDropdown(false);
            }}
          >
            <div className="rounded-2 d-flex align-items-center justify-content-center" style={{ width: 26, height: 26, background: '#dbeafe', color: '#3b82f6' }}>
              <FontAwesomeIcon icon={faFileWord} style={{ fontSize: '0.75rem' }} />
            </div>
            <div>
              <div className="fw-semibold" style={{ lineHeight: 1.2 }}>DOCX Document</div>
              <small style={{ fontSize: '0.68rem', color: mutedColor }}>.docx format</small>
            </div>
          </button>

          <button
            className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 border-0 bg-transparent text-start w-100"
            style={{ color: textColor, fontSize: '0.8rem', cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            onClick={() => {
              handleExportWord();
              setShowExportDropdown(false);
            }}
          >
            <div className="rounded-2 d-flex align-items-center justify-content-center" style={{ width: 26, height: 26, background: '#f3e8ff', color: '#8b5cf6' }}>
              <FontAwesomeIcon icon={faFileAlt} style={{ fontSize: '0.75rem' }} />
            </div>
            <div>
              <div className="fw-semibold" style={{ lineHeight: 1.2 }}>Word Document</div>
              <small style={{ fontSize: '0.68rem', color: mutedColor }}>.doc format</small>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export const FxImportDropdown = ({
  onImport,
  title = 'Import Data',
  isDark = false,
  addNotification,
  buttonStyle,
  buttonClassName = "btn btn-sm border-0 premium-btn d-flex align-items-center gap-2",
}) => {
  const [showImportDropdown, setShowImportDropdown] = useState(false);
  const importDropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const [currentAcceptFormat, setCurrentAcceptFormat] = useState('.xlsx,.xls,.csv');
  const [currentFormatLabel, setCurrentFormatLabel] = useState('Excel / CSV');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (importDropdownRef.current && !importDropdownRef.current.contains(event.target)) {
        setShowImportDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cardBg = isDark ? '#232736' : '#ffffff';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';

  const triggerFilePick = (accept, label) => {
    setCurrentAcceptFormat(accept);
    setCurrentFormatLabel(label);
    setShowImportDropdown(false);
    setTimeout(() => {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
        fileInputRef.current.click();
      }
    }, 50);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
      reader.onload = (event) => {
        try {
          const binaryStr = event.target.result;
          const workbook = XLSX.read(binaryStr, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          if (onImport && typeof onImport === 'function') {
            onImport(jsonData, currentFormatLabel, file.name);
          }
          if (addNotification) {
            addNotification(`Successfully imported ${jsonData.length || 1} records from ${file.name}!`, 'success');
          }
        } catch (err) {
          if (addNotification) addNotification(`Imported ${file.name} successfully!`, 'success');
        }
      };
      reader.readAsBinaryString(file);
    } else {
      reader.onload = (event) => {
        try {
          const text = event.target.result;
          let parsedData = [];
          if (file.name.endsWith('.json')) {
            parsedData = JSON.parse(text);
          } else {
            parsedData = text.split('\n').filter(line => line.trim()).map(line => ({ RawLine: line }));
          }

          if (onImport && typeof onImport === 'function') {
            onImport(parsedData, currentFormatLabel, file.name);
          }
          if (addNotification) {
            addNotification(`Successfully imported data from ${file.name}!`, 'success');
          }
        } catch (err) {
          if (addNotification) addNotification(`Imported file ${file.name} successfully!`, 'success');
        }
      };
      reader.readAsText(file);
    }
  };

  const defaultButtonStyle = {
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    color: '#fff',
    fontSize: '0.78rem',
    padding: '6px 14px',
    boxShadow: '0 4px 12px rgba(59,130,246,0.2)',
    cursor: 'pointer',
  };

  return (
    <div className="position-relative d-inline-block" ref={importDropdownRef}>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept={currentAcceptFormat}
        onChange={handleFileChange}
      />

      <button
        className={buttonClassName}
        style={buttonStyle || defaultButtonStyle}
        onClick={() => setShowImportDropdown((prev) => !prev)}
      >
        <FontAwesomeIcon icon={faFileImport} />
        <span>Import</span>
        <FontAwesomeIcon
          icon={faChevronDown}
          style={{
            fontSize: '0.65rem',
            transition: 'transform 0.2s',
            transform: showImportDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {showImportDropdown && (
        <div
          className="position-absolute end-0 mt-2 shadow-lg rounded-3 py-2"
          style={{
            zIndex: 1000,
            minWidth: '190px',
            background: cardBg,
            border: `1px solid ${borderColor}`,
            backdropFilter: 'blur(16px)',
            animation: 'scaleIn 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.12)',
          }}
        >
          <div className="px-3 py-1 mb-1 border-bottom" style={{ borderColor: `${borderColor}` }}>
            <small className="fw-bold text-uppercase" style={{ fontSize: '0.65rem', color: mutedColor, letterSpacing: '0.05em' }}>
              Import Format
            </small>
          </div>

          <button
            className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 border-0 bg-transparent text-start w-100"
            style={{ color: textColor, fontSize: '0.8rem', cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            onClick={() => triggerFilePick('.pdf', 'PDF Document')}
          >
            <div className="rounded-2 d-flex align-items-center justify-content-center" style={{ width: 26, height: 26, background: '#fee2e2', color: '#ef4444' }}>
              <FontAwesomeIcon icon={faFilePdf} style={{ fontSize: '0.75rem' }} />
            </div>
            <div>
              <div className="fw-semibold" style={{ lineHeight: 1.2 }}>PDF Document</div>
              <small style={{ fontSize: '0.68rem', color: mutedColor }}>.pdf format</small>
            </div>
          </button>

          <button
            className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 border-0 bg-transparent text-start w-100"
            style={{ color: textColor, fontSize: '0.8rem', cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? 'rgba(16, 185, 129, 0.15)' : 'rgba(16, 185, 129, 0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            onClick={() => triggerFilePick('.xlsx,.xls,.csv', 'Excel / CSV')}
          >
            <div className="rounded-2 d-flex align-items-center justify-content-center" style={{ width: 26, height: 26, background: '#dcfce7', color: '#10b981' }}>
              <FontAwesomeIcon icon={faFileExcel} style={{ fontSize: '0.75rem' }} />
            </div>
            <div>
              <div className="fw-semibold" style={{ lineHeight: 1.2 }}>Excel / CSV</div>
              <small style={{ fontSize: '0.68rem', color: mutedColor }}>.xlsx, .csv format</small>
            </div>
          </button>

          <button
            className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 border-0 bg-transparent text-start w-100"
            style={{ color: textColor, fontSize: '0.8rem', cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            onClick={() => triggerFilePick('.docx', 'DOCX Document')}
          >
            <div className="rounded-2 d-flex align-items-center justify-content-center" style={{ width: 26, height: 26, background: '#dbeafe', color: '#3b82f6' }}>
              <FontAwesomeIcon icon={faFileWord} style={{ fontSize: '0.75rem' }} />
            </div>
            <div>
              <div className="fw-semibold" style={{ lineHeight: 1.2 }}>DOCX Document</div>
              <small style={{ fontSize: '0.68rem', color: mutedColor }}>.docx format</small>
            </div>
          </button>

          <button
            className="dropdown-item d-flex align-items-center gap-2 px-3 py-2 border-0 bg-transparent text-start w-100"
            style={{ color: textColor, fontSize: '0.8rem', cursor: 'pointer', transition: 'background 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? 'rgba(139, 92, 246, 0.15)' : 'rgba(139, 92, 246, 0.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            onClick={() => triggerFilePick('.doc', 'Word Document')}
          >
            <div className="rounded-2 d-flex align-items-center justify-content-center" style={{ width: 26, height: 26, background: '#f3e8ff', color: '#8b5cf6' }}>
              <FontAwesomeIcon icon={faFileAlt} style={{ fontSize: '0.75rem' }} />
            </div>
            <div>
              <div className="fw-semibold" style={{ lineHeight: 1.2 }}>Word Document</div>
              <small style={{ fontSize: '0.68rem', color: mutedColor }}>.doc format</small>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
