import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../../../hooks/useApp';
import client from '../../../api/client';
import { getDocumentPreviewUrl, addDocumentAnnotation, listDocumentAnnotations, compareDocumentVersions, listDocuments, getDocument, listDocumentVersions } from '../../../api/dms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faSearchMinus, faSearchPlus, faExpand, faCompress, faDownload, faPrint, faBookmark, faHighlighter, faComment, faPen, faFilePdf, faFileWord, faFileExcel, faFilePowerpoint, faFileImage, faFileAlt, faFile, faArrowLeft, faArrowRight, faLayerGroup, faCheck, faTimes, faStar, faShare, faSearch, faSpinner, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { renderAsync } from 'docx-preview';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';

const DocxPreview = ({ blob }) => {
  const containerRef = useRef(null);
  const [err, setErr] = useState(null);
  const [rendering, setRendering] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setErr(null); setRendering(true);
        if (!containerRef.current || !blob) return;
        containerRef.current.innerHTML = '';
        await renderAsync(blob, containerRef.current, null, {
          className: 'docx',
          inWrapper: true,
          ignoreLastRenderedPageBreak: true,
          experimental: true,
        });
      } catch (e) {
        if (!cancelled) setErr(e.message || 'Failed to render Word document.');
      } finally {
        if (!cancelled) setRendering(false);
      }
    })();
    return () => { cancelled = true; };
  }, [blob]);

  return (
    <div className="w-100 h-100 overflow-auto" style={{ background: '#ffffff' }}>
      {rendering && <div className="text-center p-4"><FontAwesomeIcon icon={faSpinner} spin className="text-primary me-2" /><span className="small text-muted">Rendering document...</span></div>}
      {err && <div className="alert alert-warning small m-3">{err}</div>}
      <div ref={containerRef} />
    </div>
  );
};

const SheetPreview = ({ blob, fileName }) => {
  const [workbook, setWorkbook] = useState(null);
  const [sheets, setSheets] = useState([]);
  const [activeSheet, setActiveSheet] = useState('');
  const [err, setErr] = useState(null);
  const MAX_ROWS = 500;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setErr(null);
        if (!blob) return;
        const name = String(fileName || '').toLowerCase();
        let wb;
        if (name.endsWith('.csv') || name.endsWith('.txt')) {
          const text = await blob.text();
          wb = XLSX.read(text, { type: 'string', raw: false });
        } else {
          wb = XLSX.read(await blob.arrayBuffer(), { type: 'array' });
        }
        if (!wb.SheetNames?.length) throw new Error('No sheets found in file.');
        if (!cancelled) { setWorkbook(wb); setSheets(wb.SheetNames); setActiveSheet(wb.SheetNames[0]); }
      } catch (e) {
        if (!cancelled) setErr(e.message || 'Failed to parse spreadsheet.');
      }
    })();
    return () => { cancelled = true; };
  }, [blob, fileName]);

  if (err) return <div className="alert alert-warning small m-3">{err}</div>;
  if (!workbook) return <div className="text-center p-4"><FontAwesomeIcon icon={faSpinner} spin className="text-primary me-2" /><span className="small text-muted">Parsing spreadsheet...</span></div>;

  const ws = workbook.Sheets[activeSheet];
  const allRows = ws ? XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', raw: false }) : [];
  const rows = allRows.slice(0, MAX_ROWS);
  const colCount = rows.reduce((m, r) => Math.max(m, r.length), 0);

  return (
    <div className="w-100 h-100 d-flex flex-column" style={{ background: '#ffffff' }}>
      {sheets.length > 1 && (
        <div className="d-flex gap-1 px-2 pt-2 flex-wrap border-bottom" style={{ borderColor: '#e2e8f0' }}>
          {sheets.map(s => (
            <button key={s} onClick={() => setActiveSheet(s)}
              className={`btn btn-sm rounded-top ${activeSheet === s ? 'btn-primary' : 'btn-light border-bottom-0'}`}
              style={{ fontSize: '0.65rem', padding: '2px 10px', borderRadius: '6px 6px 0 0' }}>
              {s}
            </button>
          ))}
        </div>
      )}
      <div className="flex-grow-1 overflow-auto p-0">
        <table className="table table-sm table-bordered mb-0" style={{ fontSize: '0.68rem' }}>
          <thead>
            <tr>
              <th style={{ width: 34, background: '#f1f5f9' }}></th>
              {Array.from({ length: colCount }, (_, c) => (
                <th key={c} style={{ background: '#f1f5f9', whiteSpace: 'nowrap' }}>{XLSX.utils.encode_col(c)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r}>
                <td style={{ background: '#f8fafc', color: '#94a3b8', textAlign: 'center' }}>{r + 1}</td>
                {Array.from({ length: colCount }, (_, c) => (
                  <td key={c} style={{ whiteSpace: 'nowrap', maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis' }}>{row[c] ?? ''}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {allRows.length > MAX_ROWS && (
        <div className="small text-muted p-2 border-top" style={{ borderColor: '#e2e8f0' }}>
          Showing first {MAX_ROWS} of {allRows.length} rows.
        </div>
      )}
    </div>
  );
};

const PptxPreview = ({ blob }) => {
  const [slides, setSlides] = useState([]);
  const [err, setErr] = useState(null);
  const [rendering, setRendering] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setErr(null); setRendering(true); setSlides([]);
        if (!blob) return;
        const zip = await JSZip.loadAsync(await blob.arrayBuffer());
        const slideFiles = Object.keys(zip.files)
          .filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n))
          .sort((a, b) => parseInt(a.match(/\d+/)[0], 10) - parseInt(b.match(/\d+/)[0], 10));
        if (!slideFiles.length) throw new Error('No slides found in presentation.');
        const extracted = [];
        for (const name of slideFiles) {
          const xml = await zip.file(name).async('string');
          const texts = [...xml.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map(m => m[1].trim()).filter(Boolean);
          const imgs = (xml.match(/<p:pic>/g) || []).length;
          extracted.push({ name: parseInt(name.match(/\d+/)[0], 10), texts, images: imgs });
        }
        if (!cancelled) setSlides(extracted);
      } catch (e) {
        if (!cancelled) setErr(e.message || 'Failed to parse presentation.');
      } finally {
        if (!cancelled) setRendering(false);
      }
    })();
    return () => { cancelled = true; };
  }, [blob]);

  if (rendering) return <div className="text-center p-4"><FontAwesomeIcon icon={faSpinner} spin className="text-primary me-2" /><span className="small text-muted">Parsing presentation...</span></div>;
  if (err) return <div className="alert alert-warning small m-3">{err}</div>;

  return (
    <div className="w-100 h-100 overflow-auto p-3" style={{ background: '#f1f5f9' }}>
      {slides.map(slide => (
        <div key={slide.name} className="mx-auto mb-3 bg-white rounded-3 shadow-sm p-3" style={{ maxWidth: 560 }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="badge rounded-pill" style={{ background: '#f59e0b20', color: '#b45309', fontSize: '0.6rem' }}>Slide {slide.name}</span>
            {slide.images > 0 && <small style={{ color: '#94a3b8', fontSize: '0.6rem' }}>{slide.images} image{slide.images > 1 ? 's' : ''}</small>}
          </div>
          {slide.texts.length === 0 ? (
            <p className="text-muted small mb-0 fst-italic">Empty slide</p>
          ) : slide.texts.map((t, i) => (
            <p key={i} className={`mb-1 ${i === 0 ? 'fw-bold' : ''}`} style={{ color: i === 0 ? '#1e293b' : '#475569', fontSize: i === 0 ? '0.85rem' : '0.72rem' }}>{t}</p>
          ))}
        </div>
      ))}
    </div>
  );
};

const TextPreview = ({ blob }) => {
  const [content, setContent] = useState('');
  const [err, setErr] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setErr(null);
        if (!blob) return;
        const text = await blob.text();
        if (!cancelled) setContent(text.slice(0, 200000));
      } catch (e) {
        if (!cancelled) setErr(e.message || 'Failed to read file.');
      }
    })();
    return () => { cancelled = true; };
  }, [blob]);

  if (err) return <div className="alert alert-warning small m-3">{err}</div>;
  return (
    <pre className="w-100 h-100 overflow-auto m-0 p-3" style={{ background: '#ffffff', color: '#1e293b', fontSize: '0.72rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: "'JetBrains Mono', monospace" }}>{content}</pre>
  );
};

const DmsDocumentViewer = () => {
  const { theme, addNotification } = useApp();
  const isDark = theme === 'dark';
  const [viewMode, setViewMode] = useState('fit');
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [activeTool, setActiveTool] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDocSearch, setShowDocSearch] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewBlob, setPreviewBlob] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [annotations, setAnnotations] = useState([]);
  const [annoLoading, setAnnoLoading] = useState(false);
  const [showAnnotations, setShowAnnotations] = useState(false);
  const [showAnnoInput, setShowAnnoInput] = useState(false);
  const [annoContent, setAnnoContent] = useState('');
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [versions, setVersions] = useState([]);
  const [v1, setV1] = useState('');
  const [v2, setV2] = useState('');
  const [compareResult, setCompareResult] = useState(null);
  const [vCompLoading, setVCompLoading] = useState(false);
  const searchRef = useRef(null);
  const objectUrlRef = useRef(null);

  const supportedFormats = [
    { name: 'PDF', icon: faFilePdf, color: '#ef4444' }, { name: 'DOCX', icon: faFileWord, color: '#3b82f6' }, { name: 'XLSX', icon: faFileExcel, color: '#10b981' },
    { name: 'PPTX', icon: faFilePowerpoint, color: '#f59e0b' }, { name: 'TXT', icon: faFileAlt, color: '#64748b' }, { name: 'CSV', icon: faFileExcel, color: '#059669' },
    { name: 'Images', icon: faFileImage, color: '#ec4899' }, { name: 'Videos', icon: faFile, color: '#8b5cf6' }, { name: 'Audio', icon: faFile, color: '#6366f1' },
  ];

  const annotationTools = [
    { id: 'highlight', label: 'Highlight', icon: faHighlighter, color: '#f59e0b' },
    { id: 'comment', label: 'Comment', icon: faComment, color: '#3b82f6' },
    { id: 'draw', label: 'Draw', icon: faPen, color: '#10b981' },
    { id: 'bookmark', label: 'Bookmark', icon: faBookmark, color: '#8b5cf6' },
  ];

  const handleSearchDocuments = useCallback(async (term) => {
    try {
      const data = await listDocuments(term.trim() ? { search: term, per_page: 10 } : { per_page: 10 });
      setDocuments(data?.docs || data?.data || data || []);
      if (term.trim()) setShowDocSearch(true);
    } catch (err) { addNotification(err.message || 'Search failed', 'danger'); }
  }, [addNotification]);

  useEffect(() => {
    handleSearchDocuments('');
  }, [handleSearchDocuments]);

  const selectDocument = useCallback(async (doc) => {
    if (objectUrlRef.current) { URL.revokeObjectURL(objectUrlRef.current); objectUrlRef.current = null; }
    setSelectedDoc(doc); setShowDocSearch(false); setSearchTerm(doc.name); setAnnotations([]);
    setError(null); setLoading(true); setPreviewUrl(null); setPreviewBlob(null); setTotalPages(doc.pages || 1); setCurrentPage(1);
    try {
      const [urlData, fullDoc] = await Promise.all([getDocumentPreviewUrl(doc.id), getDocument(doc.id)]);
      const realDoc = fullDoc || doc;
      const fileType = urlData?.file_type || realDoc?.file_type || doc?.file_type || '';
      setPreviewType(fileType);
      if (fullDoc?.pages) setTotalPages(fullDoc.pages);
      setSelectedDoc(prev => ({ ...prev, ...urlData, ...realDoc, type: fileType }));
      try {
        const resp = await client.get(`/dms/documents/${doc.id}/serve`, { responseType: 'blob', skipCache: true });
        const blob = resp.blob instanceof Blob ? resp.blob : new Blob([resp.blob]);
        const objectUrl = URL.createObjectURL(blob);
        objectUrlRef.current = objectUrl;
        setPreviewBlob(blob);
        setPreviewUrl(objectUrl);
      } catch {
        setError('Unable to load file content');
      }
    } catch (err) { setError(err.message || 'Failed to load preview'); addNotification('Failed to load preview', 'danger'); }
    finally { setLoading(false); }
  }, [addNotification]);

  useEffect(() => () => { if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current); }, []);

  useEffect(() => {
    if (!selectedDoc?.id) return;
    (async () => { setAnnoLoading(true); try { setAnnotations(await listDocumentAnnotations(selectedDoc.id) || []); } catch { /* annotations are optional */ } finally { setAnnoLoading(false); } })();
  }, [selectedDoc?.id]);

  useEffect(() => {
    if (!showDocSearch) return;
    const handler = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowDocSearch(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showDocSearch]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 300));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 25));
  const toggleFullscreen = () => { setFullscreen(!fullscreen); addNotification(fullscreen ? 'Exited fullscreen' : 'Entered fullscreen', 'info'); };

  const handleToolClick = (tool) => {
    if (activeTool === tool.id) { setActiveTool(null); setShowAnnoInput(false); }
    else { setActiveTool(tool.id); setShowAnnoInput(true); setAnnoContent(''); }
  };

  const handleCreateAnnotation = async () => {
    if (!selectedDoc?.id) return addNotification('Select a document first', 'warning');
    if (!activeTool) return addNotification('Select an annotation tool', 'warning');
    if (!annoContent.trim()) return addNotification('Enter annotation content', 'warning');
    try {
      await addDocumentAnnotation(selectedDoc.id, { type: activeTool, content: annoContent.trim(), page_number: currentPage, position: { x: 0, y: 0 }, color: annotationTools.find(t => t.id === activeTool)?.color || '#f59e0b' });
      addNotification(`${activeTool} annotation added`, 'success');
      setShowAnnoInput(false); setActiveTool(null); setAnnoContent('');
      setAnnotations(await listDocumentAnnotations(selectedDoc.id) || []);
    } catch (err) { addNotification(err.message || 'Failed to add annotation', 'danger'); }
  };

  const handleDownload = async () => {
    if (!selectedDoc) return addNotification('Select a document first', 'warning');
    try {
      const response = await client.get(`/dms/documents/${selectedDoc.id}/download`, { responseType: 'blob' });
      const blob = response.data?.blob || response.data;
      const url = window.URL.createObjectURL(blob instanceof Blob ? blob : new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', selectedDoc.name || 'document');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      addNotification('Download started.', 'success');
    } catch {
      addNotification('Failed to download document.', 'danger');
    }
  };

  const handleShare = async () => {
    if (!selectedDoc) return addNotification('Select a document first', 'warning');
    try { await navigator.clipboard.writeText(`${window.location.origin}/dms/documents/${selectedDoc.id}`); addNotification('Share link copied to clipboard', 'success'); }
    catch { addNotification('Failed to copy share link', 'danger'); }
  };

  const openVersionCompare = async () => {
    if (!selectedDoc?.id) return addNotification('Select a document first', 'warning');
    setShowVersionModal(true); setV1(''); setV2(''); setCompareResult(null);
    try { setVersions(await listDocumentVersions(selectedDoc.id) || []); }
    catch { addNotification('Failed to load versions', 'danger'); setVersions([]); }
  };

  const handleCompareVersions = async () => {
    if (!v1 || !v2) return addNotification('Select two versions', 'warning');
    if (v1 === v2) return addNotification('Select two different versions', 'warning');
    setVCompLoading(true);
    try { setCompareResult(await compareDocumentVersions(selectedDoc.id, v1, v2)); addNotification('Version comparison complete', 'success'); }
    catch (err) { addNotification(err.message || 'Comparison failed', 'danger'); }
    finally { setVCompLoading(false); }
  };

  const getDocType = (t) => {
    if (!t) return 'unknown'; const l = t.toLowerCase();
    if (l.includes('pdf')) return 'pdf';
    if (l.includes('doc')) return 'word';
    if (l.includes('xls') || l.includes('csv')) return 'excel';
    if (l.includes('ppt')) return 'powerpoint';
    if (['image/jpeg','image/png','image/gif','image/webp','image/svg+xml','jpg','jpeg','png','gif','webp','svg'].some(e => l.includes(e) || l === e)) return 'image';
    if (['video/mp4','video/webm','video/ogg','mp4','webm','ogg','mov','avi'].some(e => l.includes(e) || l === e)) return 'video';
    if (['audio/mpeg','audio/wav','audio/ogg','mp3','wav','ogg','aac','flac'].some(e => l.includes(e) || l === e)) return 'audio';
    if (l.includes('text') || l === 'txt' || l.includes('json') || l.includes('xml') || l.includes('html') || l.includes('js') || l.includes('css') || l.includes('md')) return 'text';
    return 'unknown';
  };

  const fi = (t) => {
    if (!t) return faFile; const l = t.toLowerCase();
    if (l.includes('pdf')) return faFilePdf; if (l.includes('doc')) return faFileWord; if (l.includes('xls')) return faFileExcel;
    if (l.includes('ppt')) return faFilePowerpoint; if (l.includes('image') || /jpg|jpeg|png|gif|webp|svg/.test(l)) return faFileImage;
    if (l.includes('text') || l === 'txt') return faFileAlt; return faFile;
  };

  const style = (light, dark) => ({ color: isDark ? (dark || '#f1f5f9') : (light || '#1e293b') });

  const renderPreview = () => {
    if (loading) return <div className="text-center p-5"><FontAwesomeIcon icon={faSpinner} spin className="text-primary mb-3" style={{ fontSize: '3rem' }} /><h5 className="fw-bold" style={style()}>Loading preview...</h5></div>;
    if (error && !previewUrl) return <div className="text-center p-5"><FontAwesomeIcon icon={faExclamationTriangle} className="text-danger mb-3" style={{ fontSize: '3rem' }} /><h5 className="fw-bold mb-2" style={style()}>Preview Unavailable</h5><p className="text-muted small mb-3">{error}</p></div>;

    const fileName = selectedDoc?.name || 'Document';
    const docType = (() => {
      const rawType = String(previewType || selectedDoc?.type || '');
      const primary = getDocType(rawType);
      if (primary !== 'unknown') return primary;
      const ext = fileName.includes('.') ? fileName.split('.').pop() : '';
      return ext ? getDocType(ext) : 'unknown';
    })();
    const effectiveUrl = previewUrl || (selectedDoc?.id ? `/api/v1/dms/documents/${selectedDoc.id}/serve` : null);

    const renderOfficeFallback = (name, icon) => (
      <div className="text-center p-5">
        <FontAwesomeIcon icon={icon} style={{ fontSize: '4rem', color: '#94a3b8', opacity: 0.5 }} className="mb-3" />
        <h6 className="fw-bold mb-1" style={style()}>{name}</h6>
        <p className="text-muted small mb-0">This file type could not be rendered inline.</p>
        <button className="btn btn-sm btn-primary rounded-pill px-4 fw-bold mt-3" onClick={handleDownload}><FontAwesomeIcon icon={faDownload} className="me-2" />Download</button>
      </div>
    );

    if (effectiveUrl) {
      switch (docType) {
        case 'image':
          return <img src={effectiveUrl} alt={fileName} className="img-fluid" style={{ maxHeight: '100%', objectFit: viewMode === 'fit' ? 'contain' : 'cover' }} />;
        case 'pdf':
          return <embed src={effectiveUrl} type="application/pdf" className="w-100 h-100 border-0" style={{ minHeight: '450px' }} title={fileName} />;
        case 'video':
          return <video controls className="w-100" style={{ maxHeight: '450px' }}><source src={effectiveUrl} /><p className="text-muted">Your browser does not support video playback.</p></video>;
        case 'audio':
          return <div className="text-center p-5 w-100"><FontAwesomeIcon icon={faFile} className="text-primary mb-3" style={{ fontSize: '4rem', opacity: 0.5 }} /><h6 className="fw-bold mb-3" style={style()}>{fileName}</h6><audio controls className="w-75"><source src={effectiveUrl} /></audio></div>;
        case 'word':
          return previewBlob
            ? <DocxPreview blob={previewBlob} />
            : renderOfficeFallback(fileName, fi('doc'));
        case 'excel':
          return previewBlob
            ? <SheetPreview blob={previewBlob} fileName={fileName} />
            : renderOfficeFallback(fileName, fi('xls'));
        case 'powerpoint':
          return previewBlob
            ? <PptxPreview blob={previewBlob} />
            : renderOfficeFallback(fileName, fi('ppt'));
        case 'text':
          return previewBlob
            ? <TextPreview blob={previewBlob} />
            : <iframe src={effectiveUrl} title={fileName} className="w-100 h-100 border-0" style={{ minHeight: '450px', backgroundColor: '#fff' }} />;
        default:
          return <iframe src={effectiveUrl} title={fileName} className="w-100 h-100 border-0" style={{ minHeight: '450px' }} />;
      }
    }

    if (selectedDoc) {
      const placeholderPreviews = {
        pdf: { icon: faFilePdf, color: '#ef4444', bg: '#fef2f2', label: 'PDF Document' },
        word: { icon: faFileWord, color: '#3b82f6', bg: '#eff6ff', label: 'Word Document' },
        excel: { icon: faFileExcel, color: '#10b981', bg: '#ecfdf5', label: 'Spreadsheet' },
        powerpoint: { icon: faFilePowerpoint, color: '#f59e0b', bg: '#fffbeb', label: 'Presentation' },
        image: { icon: faFileImage, color: '#ec4899', bg: '#fdf2f8', label: 'Image' },
        video: { icon: faFile, color: '#8b5cf6', bg: '#f5f3ff', label: 'Video' },
        audio: { icon: faFile, color: '#6366f1', bg: '#eef2ff', label: 'Audio' },
        text: { icon: faFileAlt, color: '#64748b', bg: '#f8fafc', label: 'Text File' },
        unknown: { icon: faFile, color: '#94a3b8', bg: '#f1f5f9', label: 'Document' },
      };
      const p = placeholderPreviews[docType] || placeholderPreviews.unknown;
      return <div className="text-center p-5">
        <div className="d-inline-flex align-items-center justify-content-center p-4 rounded-4 mb-3" style={{ backgroundColor: p.bg }}>
          <FontAwesomeIcon icon={p.icon} style={{ fontSize: '4rem', color: p.color, opacity: 0.7 }} />
        </div>
        <h5 className="fw-bold mb-1" style={style()}>{fileName}</h5>
        <p className="text-muted small mb-2">{p.label} &middot; {(selectedDoc.size || '—')}</p>
        <p className="text-muted small mb-0"><FontAwesomeIcon icon={faEye} className="me-1 text-primary" />Preview URL not yet available. The document is stored and ready for access.</p>
      </div>;
    }

    return <div className="text-center p-5">
      <FontAwesomeIcon icon={faFilePdf} className="text-danger mb-3" style={{ fontSize: '4rem', opacity: 0.5 }} />
      <h5 className="fw-bold mb-2" style={style()}><FontAwesomeIcon icon={faEye} className="me-2 text-primary" />Document Preview</h5>
      <p className="text-muted small mb-3">Search and select a document to preview, annotate, and collaborate.</p>
      <div className="d-flex align-items-center justify-content-center gap-4 small text-muted mb-3">
        <span><FontAwesomeIcon icon={faSearchPlus} className="me-1" />Zoom</span>
        <span><FontAwesomeIcon icon={faHighlighter} className="me-1" />Annotate</span>
        <span><FontAwesomeIcon icon={faComment} className="me-1" />Comment</span>
        <span><FontAwesomeIcon icon={faBookmark} className="me-1" />Bookmark</span>
      </div>
      {documents.length === 0 ? (
        <p className="text-muted small mt-3 mb-0">No documents found. Upload documents in the All Documents section to get started.</p>
      ) : (
        <div className="mx-auto mt-3 text-start rounded-3 border overflow-hidden" style={{ maxWidth: '360px', maxHeight: '240px', overflowY: 'auto' }}>
          {documents.slice(0, 12).map(docItem => (
            <button key={docItem.id} className={`d-flex align-items-center gap-2 w-100 border-0 text-start px-3 py-2 small ${isDark ? 'bg-dark text-light' : 'bg-white'}`} style={{ cursor: 'pointer' }}
              onClick={() => selectDocument(docItem)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#334155' : '#f1f5f9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}>
              <FontAwesomeIcon icon={fi(docItem.file_type || docItem.type)} style={{ color: '#6366f1' }} />
              <span className="fw-medium text-truncate">{docItem.name || docItem.file_name}</span>
              <small className="text-muted ms-auto">{docItem.file_type || docItem.type || ''}</small>
            </button>
          ))}
        </div>
      )}
    </div>;
  };

  const vs = (id, setId) => (
    <select className={`form-select form-select-sm ${isDark ? 'bg-dark text-light border-secondary' : ''}`} value={id} onChange={(e) => setId(e.target.value)}>
      <option value="">Select version...</option>
      {versions.map(v => <option key={v.id} value={v.id}>v{v.version || v.id.slice(0, 8)} {v.created_at ? `(${new Date(v.created_at).toLocaleDateString()})` : ''}</option>)}
    </select>
  );

  return (
    <div className={`container-fluid py-4 fade-in ${fullscreen ? 'position-fixed top-0 start-0 w-100 h-100 z-3' : ''}`} style={{ backgroundColor: isDark ? '#0f172a' : '#f8fafc' }}>
      <div className={`card border-0 shadow-sm rounded-4 overflow-hidden ${isDark ? 'bg-dark' : ''}`}>
        <div className="p-3 d-flex flex-wrap align-items-center justify-content-between gap-2 border-bottom" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }}>
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary bg-opacity-10 p-2 rounded-3"><FontAwesomeIcon icon={faEye} className="text-primary" /></div>
            <div>
              <h5 className="fw-bold mb-0" style={style()}>Document Viewer</h5>
              <p className="small text-muted mb-0 text-truncate" style={{ maxWidth: '250px' }}>{selectedDoc ? selectedDoc.name : 'View, annotate, and collaborate on documents'}</p>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <div className="position-relative" ref={searchRef}>
              <div className="input-group input-group-sm rounded-pill border shadow-sm overflow-hidden">
                <span className="input-group-text bg-light border-0 text-muted"><FontAwesomeIcon icon={faSearch} /></span>
                <input type="text" className={`form-control form-control-sm border-0 shadow-none ${isDark ? 'bg-dark text-light' : 'bg-light'}`} placeholder="Search documents..." value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); if (e.target.value.length >= 2) handleSearchDocuments(e.target.value); }} onKeyDown={(e) => { if (e.key === 'Enter') handleSearchDocuments(searchTerm); }} />
              </div>
              {showDocSearch && documents.length > 0 && (
                <div className={`position-absolute top-100 start-0 end-0 mt-1 rounded-3 shadow-lg border overflow-hidden ${isDark ? 'bg-dark border-secondary' : 'bg-white'}`} style={{ zIndex: 1050, maxHeight: '300px', overflowY: 'auto' }}>
                  {documents.map(doc => (
                    <button key={doc.id} className={`d-flex align-items-center gap-2 w-100 border-0 text-start px-3 py-2 small ${isDark ? 'bg-dark text-light' : 'bg-white'}`} style={{ cursor: 'pointer' }}
                      onClick={() => selectDocument(doc)}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isDark ? '#334155' : '#f1f5f9'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}>
                      <FontAwesomeIcon icon={fi(doc.file_type || doc.type)} style={{ color: '#6366f1' }} />
                      <span className="fw-medium">{doc.name || doc.file_name}</span>
                      <small className="text-muted ms-auto">{doc.file_type || doc.type || ''}</small>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="btn-group rounded-pill border shadow-sm p-1 bg-light">
              <button className="btn btn-sm rounded-pill px-3 border-0 fw-bold" onClick={handleZoomOut} title="Zoom Out"><FontAwesomeIcon icon={faSearchMinus} /></button>
              <span className="btn btn-sm border-0 fw-bold text-muted px-2">{zoom}%</span>
              <button className="btn btn-sm rounded-pill px-3 border-0 fw-bold" onClick={handleZoomIn} title="Zoom In"><FontAwesomeIcon icon={faSearchPlus} /></button>
            </div>
            <div className="btn-group rounded-pill border shadow-sm bg-light d-none d-md-flex">
              {['fit', 'width', 'height'].map(m => (
                <button key={m} className={`btn btn-sm rounded-pill px-3 border-0 fw-bold ${viewMode === m ? 'btn-primary text-white' : 'text-muted'}`} onClick={() => setViewMode(m)}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
            <button className="btn btn-sm btn-light rounded-pill px-3 fw-bold border shadow-sm" onClick={toggleFullscreen} title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
              <FontAwesomeIcon icon={fullscreen ? faCompress : faExpand} />
            </button>
            <button className="btn btn-sm btn-light rounded-pill px-3 fw-bold border shadow-sm" onClick={handleDownload} disabled={!selectedDoc}>
              <FontAwesomeIcon icon={faDownload} className="me-1" />Download
            </button>
            <button className="btn btn-sm btn-light rounded-pill px-3 fw-bold border shadow-sm" onClick={() => addNotification('Print feature coming soon.', 'info')}>
              <FontAwesomeIcon icon={faPrint} />
            </button>
          </div>
        </div>

        <div className="row g-0">
          <div className="col-12 col-xl-9">
            <div className="d-flex flex-column align-items-center justify-content-center p-4" style={{ minHeight: '500px', backgroundColor: isDark ? '#1a2332' : '#f1f5f9' }}>
              <div className={`rounded-3 shadow-lg d-flex flex-column align-items-center justify-content-center ${isDark ? 'bg-dark' : 'bg-white'}`}
                style={{ width: '100%', maxWidth: '800px', height: '450px', overflow: 'hidden', transform: `scale(${zoom / 100})` }}>
                {renderPreview()}
              </div>
              <div className="d-flex align-items-center justify-content-center gap-3 mt-4">
                <button className="btn btn-sm btn-light rounded-pill px-3 border shadow-sm fw-bold" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage <= 1}>
                  <FontAwesomeIcon icon={faArrowLeft} className="me-1" />Previous
                </button>
                <span className="small fw-bold" style={style()}>
                  Page <input type="number" className={`form-control form-control-sm d-inline-block text-center mx-1 border shadow-none ${isDark ? 'bg-dark text-light border-secondary' : ''}`} style={{ width: '50px' }} value={currentPage}
                    onChange={(e) => setCurrentPage(Math.min(totalPages, Math.max(1, Number(e.target.value) || 1)))} /> of {totalPages}
                </span>
                <button className="btn btn-sm btn-light rounded-pill px-3 border shadow-sm fw-bold" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage >= totalPages}>
                  Next <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
                </button>
              </div>
            </div>
          </div>

          <div className="col-12 col-xl-3 border-start" style={{ borderColor: isDark ? '#334155' : '#e2e8f0' }}>
            <div className="p-3">
              <h6 className="fw-bold mb-3" style={style()}><FontAwesomeIcon icon={faPen} className="me-2 text-primary" />Annotation Tools</h6>
              <div className="d-flex flex-column gap-2 mb-3">
                {annotationTools.map(tool => (
                  <button key={tool.id} className={`btn d-flex align-items-center gap-3 rounded-3 border-0 fw-bold transition ${activeTool === tool.id ? 'btn-primary text-white shadow-sm' : 'btn-light text-muted'}`}
                    style={{ padding: '0.6rem 1rem' }} onClick={() => handleToolClick(tool)}>
                    <div className="p-2 rounded-2" style={{ backgroundColor: `${tool.color}20`, color: tool.color }}><FontAwesomeIcon icon={tool.icon} /></div>
                    <span className="small">{tool.label}</span>
                    {activeTool === tool.id && <FontAwesomeIcon icon={faCheck} className="ms-auto" />}
                  </button>
                ))}
              </div>

              {showAnnoInput && activeTool && (
                <div className={`p-2 rounded-3 border mb-3 ${isDark ? 'border-secondary' : ''}`} style={{ backgroundColor: isDark ? '#1a2332' : '#f8fafc' }}>
                  <div className="input-group input-group-sm">
                    <input type="text" className={`form-control form-control-sm border-0 shadow-none ${isDark ? 'bg-dark text-light' : 'bg-light'}`} placeholder={`Enter ${activeTool} content...`} value={annoContent}
                      onChange={(e) => setAnnoContent(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleCreateAnnotation(); }} />
                    <button className="btn btn-primary btn-sm" onClick={handleCreateAnnotation} disabled={!annoContent.trim()}><FontAwesomeIcon icon={faCheck} /></button>
                  </div>
                  <small className="text-muted d-block mt-1">Page {currentPage} | Click check to add</small>
                </div>
              )}

              <h6 className="fw-bold mb-3" style={style()}><FontAwesomeIcon icon={faStar} className="me-2 text-warning" />Annotations{annoLoading && <FontAwesomeIcon icon={faSpinner} spin className="ms-2 text-muted" />}</h6>
              <div className="d-flex flex-column gap-2 mb-4">
                {annotations.length === 0 && !annoLoading && <p className="text-muted small text-center mb-0">No annotations yet</p>}
                {annotations.slice(0, showAnnotations ? undefined : 3).map((anno) => (
                  <div key={anno.id} className={`p-2 rounded-3 border small ${isDark ? 'border-secondary' : ''}`} style={{ backgroundColor: isDark ? '#1a2332' : '#f8fafc' }}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <span className="fw-bold" style={{ color: isDark ? '#e2e8f0' : '#1e293b', textTransform: 'capitalize' }}>{anno.type}</span>
                        <span className="text-muted ms-2">Pg {anno.page_number}</span>
                        <p className="mb-0 small text-muted mt-1">{anno.content}</p>
                      </div>
                      <FontAwesomeIcon icon={faTimes} className="text-muted cursor-pointer flex-shrink-0" style={{ fontSize: '0.65rem' }} />
                    </div>
                  </div>
                ))}
                {annotations.length > 3 && (
                  <div className="text-center mt-2">
                    <button className="btn btn-sm btn-link text-decoration-none small fw-bold" onClick={() => setShowAnnotations(!showAnnotations)}>
                      {showAnnotations ? 'Show less' : `Show all (${annotations.length})`}
                    </button>
                  </div>
                )}
              </div>

              <h6 className="fw-bold mb-3" style={style()}><FontAwesomeIcon icon={faLayerGroup} className="me-2 text-info" />Supported Formats</h6>
              <div className="d-flex flex-wrap gap-1">
                {supportedFormats.map((fmt, idx) => (
                  <span key={idx} className="badge rounded-pill px-2 py-1 fw-bold" style={{ backgroundColor: `${fmt.color}15`, color: fmt.color, fontSize: '0.6rem' }}>
                    <FontAwesomeIcon icon={fmt.icon} className="me-1" />{fmt.name}
                  </span>
                ))}
              </div>

              <div className="mt-4 d-flex flex-column gap-2">
                <button className="btn btn-sm btn-light rounded-pill fw-bold border shadow-sm" onClick={openVersionCompare}><FontAwesomeIcon icon={faLayerGroup} className="me-2" />Version Comparison</button>
                <button className="btn btn-sm btn-light rounded-pill fw-bold border shadow-sm" onClick={toggleFullscreen}><FontAwesomeIcon icon={faExpand} className="me-2" />Fullscreen</button>
                <button className="btn btn-sm btn-light rounded-pill fw-bold border shadow-sm" onClick={handleShare}><FontAwesomeIcon icon={faShare} className="me-2" />Share</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showVersionModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={(e) => { if (e.target === e.currentTarget) setShowVersionModal(false); }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className={`modal-content border-0 shadow ${isDark ? 'bg-dark text-light' : ''}`}>
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold"><FontAwesomeIcon icon={faLayerGroup} className="me-2 text-primary" />Version Comparison</h5>
                <button className="btn btn-sm btn-light rounded-circle" onClick={() => setShowVersionModal(false)}><FontAwesomeIcon icon={faTimes} /></button>
              </div>
              <div className="modal-body">
                {versions.length === 0 ? <p className="text-muted text-center">No versions available.</p> : (
                  <>
                    <div className="row g-3 mb-3">
                      <div className="col-md-6"><label className="form-label fw-bold small">Version 1</label>{vs(v1, setV1)}</div>
                      <div className="col-md-6"><label className="form-label fw-bold small">Version 2</label>{vs(v2, setV2)}</div>
                    </div>
                    <button className="btn btn-primary rounded-pill px-4 fw-bold" onClick={handleCompareVersions} disabled={vCompLoading}>
                      {vCompLoading ? <><FontAwesomeIcon icon={faSpinner} spin className="me-2" />Comparing...</> : <><FontAwesomeIcon icon={faLayerGroup} className="me-2" />Compare</>}
                    </button>
                    {compareResult && (
                      <div className={`mt-3 p-3 rounded-3 ${isDark ? 'bg-dark border border-secondary' : 'bg-light'}`}>
                        <h6 className="fw-bold mb-2">Comparison Result</h6>
                        <pre className="small mb-0" style={{ whiteSpace: 'pre-wrap', ...style('#1e293b', '#e2e8f0') }}>
                          {typeof compareResult === 'string' ? compareResult : JSON.stringify(compareResult, null, 2)}
                        </pre>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .fade-in { animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        .transition { transition: all 0.2s ease; }
        .cursor-pointer { cursor: pointer; }
        ${isDark ? '.btn-light{background-color:#334155!important;color:#f1f5f9!important;border-color:#475569!important}.bg-light{background-color:#1e293b!important}.text-muted{color:#94a3b8!important}.form-control,.form-select{background-color:#1e293b!important;color:#f1f5f9!important;border-color:#475569!important}' : ''}
      `}</style>
    </div>
  );
};

export default DmsDocumentViewer;
