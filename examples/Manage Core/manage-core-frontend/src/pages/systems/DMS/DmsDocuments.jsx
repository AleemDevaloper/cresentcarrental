import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../../hooks/useApp';
import {
  listDocuments, listFolders, deleteDocument, deleteFolder,
  listDocumentVersions, createDocument, createFolder
} from '../../../api/dms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFolder, faFolderOpen, faFile, faFilePdf, faFileWord, faFileExcel,
  faFilePowerpoint, faFileImage, faFileAlt, faFileArchive,
  faSearch, faFilter, faTh, faList, faColumns, faTimeline,
  faCheckCircle, faClock, faExclamationTriangle, faCheck,
  faTimes, faPaperclip, faDownload, faEye, faEdit, faShare,
  faTrash, faEllipsisV, faPlus, faUpload, faCopy, faArchive,
  faChevronDown, faChevronRight, faSync, faTag, faUser,
  faBuilding, faCalendar, faHardDrive, faLock, faGlobe,
  faInfoCircle, faHistory, faFileSignature, faStamp,
  faFolderPlus, faFileExport, faFileImport, faBolt, faRobot,
  faCog, faSort, faSortUp, faSortDown, faXmark, faCheckDouble,
  faFileCirclePlus, faArrowUpFromBracket, faMagnifyingGlass,
  faSliders, faBookmark, faListCheck, faLink, faClipboardList, faComment, faChartBar
} from "@fortawesome/free-solid-svg-icons";
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';

const DmsDocuments = () => {
  const { addNotification } = useApp();

  const [viewMode, setViewMode] = useState('folder');
  const [documents, setDocuments] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [searchDebounce, setSearchDebounce] = useState('');
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState(new Set());
  const [filters, setFilters] = useState({ type: '', status: '', owner: '', modifiedBy: '', department: '', dateFrom: '', dateTo: '', tags: '', approvalStatus: '', signatureStatus: '', confidentiality: '', retentionPolicy: '', project: '', client: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showDetailDrawer, setShowDetailDrawer] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFileObj, setUploadFileObj] = useState(null);
  const [uploadDocName, setUploadDocName] = useState('');
  const [uploadFolder, setUploadFolder] = useState('');
  const [uploadTags, setUploadTags] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadDragOver, setUploadDragOver] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [folderDesc, setFolderDesc] = useState('');
  const [folderColor, setFolderColor] = useState('#6366f1');
  const [folderAccess, setFolderAccess] = useState('private');
  const [folderParent, setFolderParent] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [folderDeleteConfirm, setFolderDeleteConfirm] = useState(null);
  const [drawerTab, setDrawerTab] = useState('information');
  const [docVersions, setDocVersions] = useState([]);
  const [docComments, setDocComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [docApprovals, setDocApprovals] = useState([]);
  const [docSignatures, setDocSignatures] = useState([]);
  const [docShares, setDocShares] = useState([]);
  const [docAuditLogs, setDocAuditLogs] = useState([]);
  const [showImportExport, setShowImportExport] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  const [breadcrumb, setBreadcrumb] = useState([]);

  const colorOptions = [
    '#6366f1', '#ef4444', '#f59e0b', '#10b981', '#0ea5e9',
    '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#84cc16',
  ];

  const getFileIcon = (type) => {
    if (!type) return faFile;
    const t = type.toLowerCase();
    if (t.includes('pdf')) return faFilePdf;
    if (t.includes('word') || t.includes('doc')) return faFileWord;
    if (t.includes('excel') || t.includes('xls') || t.includes('csv')) return faFileExcel;
    if (t.includes('powerpoint') || t.includes('ppt')) return faFilePowerpoint;
    if (t.includes('image') || t.includes('png') || t.includes('jpg') || t.includes('jpeg') || t.includes('gif') || t.includes('svg') || t.includes('webp')) return faFileImage;
    if (t.includes('zip') || t.includes('rar') || t.includes('tar') || t.includes('gz') || t.includes('7z')) return faFileArchive;
    if (t.includes('text') || t.includes('txt') || t.includes('rtf')) return faFileAlt;
    return faFile;
  };

  const getFileColor = (type) => {
    if (!type) return '#64748b';
    const t = type.toLowerCase();
    if (t.includes('pdf')) return '#ef4444';
    if (t.includes('word') || t.includes('doc')) return '#3b82f6';
    if (t.includes('excel') || t.includes('xls')) return '#10b981';
    if (t.includes('powerpoint') || t.includes('ppt')) return '#f59e0b';
    if (t.includes('image')) return '#ec4899';
    if (t.includes('zip') || t.includes('rar')) return '#8b5cf6';
    return '#64748b';
  };

  const getStatusBadge = (status) => {
    const configs = {
      draft: { bg: '#f1f5f9', color: '#64748b', label: 'Draft' },
      pending: { bg: '#fef3c7', color: '#d97706', label: 'Pending' },
      'under review': { bg: '#dbeafe', color: '#2563eb', label: 'Under Review' },
      approved: { bg: '#d1fae5', color: '#059669', label: 'Approved' },
      rejected: { bg: '#fee2e2', color: '#dc2626', label: 'Rejected' },
      archived: { bg: '#e5e7eb', color: '#4b5563', label: 'Archived' },
      expired: { bg: '#ffedd5', color: '#ea580c', label: 'Expired' },
      completed: { bg: '#ccfbf1', color: '#0d9488', label: 'Completed' },
      signed: { bg: '#f3e8ff', color: '#7c3aed', label: 'Signed' },
    };
    const cfg = configs[status?.toLowerCase()] || { bg: '#f1f5f9', color: '#64748b', label: status || 'Unknown' };
    return <span className="badge rounded-pill fw-semibold px-3 py-2" style={{ backgroundColor: cfg.bg, color: cfg.color, fontSize: '0.75rem' }}>{cfg.label}</span>;
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateTime = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const getFileExt = (name) => {
    if (!name) return '';
    const parts = name.split('.');
    return parts.length > 1 ? parts.pop().toUpperCase() : '';
  };

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        per_page: perPage,
        sort_by: sortBy,
        sort_order: sortOrder,
        search: searchDebounce || undefined,
        ...(selectedFolder?.id ? { folder_id: selectedFolder.id } : { folder_id: 'none' }),
      };
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;
      if (filters.owner) params.owner_id = filters.owner;
      if (filters.department) params.department = filters.department;
      if (filters.dateFrom) params.date_from = filters.dateFrom;
      if (filters.dateTo) params.date_to = filters.dateTo;
      if (filters.tags) params.tags = filters.tags;
      const data = await listDocuments(params);
      const docs = Array.isArray(data) ? data : (data?.data || []);
      setDocuments(docs);
      setTotalPages(data?.pagination?.last_page || data?.last_page || data?.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch documents", err);
      addNotification("Failed to load documents.", "danger");
    } finally {
      setLoading(false);
    }
  }, [currentPage, perPage, sortBy, sortOrder, searchDebounce, selectedFolder, filters]);

  const fetchFolders = useCallback(async () => {
    try {
      const data = await listFolders();
      setFolders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch folders", err);
    }
  }, []);

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const count = Object.entries(filters).filter(([, v]) => v !== '').length;
    setActiveFilterCount(count);
  }, [filters]);

  const handleSearch = (term) => {
    setSearch(term);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ type: '', status: '', owner: '', modifiedBy: '', department: '', dateFrom: '', dateTo: '', tags: '', approvalStatus: '', signatureStatus: '', confidentiality: '', retentionPolicy: '', project: '', client: '' });
    setSearch('');
    setSearchDebounce('');
    setCurrentPage(1);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return faSort;
    return sortOrder === 'asc' ? faSortUp : faSortDown;
  };

  const handleUpload = async () => {
    if (!uploadFileObj) {
      addNotification("Please select a file to upload.", "warning");
      return;
    }
    try {
      setUploadProgress(0);
      const formData = new FormData();
      formData.append('file', uploadFileObj);
      formData.append('name', uploadDocName || uploadFileObj.name);
      const folderId = uploadFolder || selectedFolder?.id;
      if (folderId) formData.append('folder_id', folderId);
      const tagsArray = uploadTags ? uploadTags.split(',').map(t => t.trim()).filter(Boolean) : [];
      tagsArray.forEach(tag => formData.append('tags[]', tag));
      formData.append('description', uploadDesc || '');
      await createDocument(formData);
      setUploadProgress(100);
      addNotification("File uploaded successfully!", "success");
      setShowUploadModal(false);
      resetUploadForm();
      setCurrentPage(1);
      fetchDocuments();
      fetchFolders();
    } catch (err) {
      console.error("Upload failed", err);
      addNotification(err?.message || "Failed to upload file.", "danger");
    } finally {
      setUploadProgress(0);
    }
  };

  const resetUploadForm = () => {
    setUploadFileObj(null);
    setUploadDocName('');
    setUploadFolder('');
    setUploadTags('');
    setUploadDesc('');
    setUploadProgress(0);
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      addNotification("Please enter a folder name.", "warning");
      return;
    }
    try {
      await createFolder({
        name: folderName,
        description: folderDesc,
        color: folderColor,
        access_level: folderAccess,
        parent_id: folderParent ? folderParent : (selectedFolder?.id || null),
      });
      addNotification("Folder created successfully!", "success");
      setShowCreateFolderModal(false);
      setFolderName('');
      setFolderDesc('');
      setFolderColor('#6366f1');
      setFolderAccess('private');
      setFolderParent('');
      fetchFolders();
    } catch (err) {
      console.error("Failed to create folder", err);
      addNotification("Failed to create folder.", "danger");
    }
  };

  const handleDeleteDocument = async (id) => {
    try {
      await deleteDocument(id);
      setDocuments(prev => prev.filter(d => d.id !== id));
      setSelectedDocuments(prev => { const n = new Set(prev); n.delete(id); return n; });
      addNotification("Document deleted.", "success");
    } catch (err) {
      addNotification("Failed to delete document.", "danger");
    }
    setDeleteConfirm(null);
  };

  const handleDeleteFolder = async (id) => {
    try {
      await deleteFolder(id);
      setFolders(prev => prev.filter(f => f.id !== id));
      addNotification("Folder and contents deleted.", "success");
    } catch (err) {
      addNotification("Failed to delete folder.", "danger");
    }
    setFolderDeleteConfirm(null);
  };

  const handleBulkAction = async (action) => {
    const ids = Array.from(selectedDocuments);
    if (ids.length === 0) {
      addNotification("No documents selected.", "warning");
      return;
    }
    if (action === 'delete') {
      try {
        await Promise.all(ids.map(id => deleteDocument(id)));
        setDocuments(prev => prev.filter(d => !ids.includes(d.id)));
        setSelectedDocuments(new Set());
        addNotification(`${ids.length} document(s) deleted.`, "success");
      } catch (err) {
        addNotification("Failed to delete documents.", "danger");
      }
    } else if (action === 'download') {
      addNotification(`Downloading ${ids.length} document(s)...`, "info");
    } else if (action === 'archive') {
      addNotification(`Archiving ${ids.length} document(s)...`, "info");
    }
  };

  const toggleDocSelect = (id) => {
    setSelectedDocuments(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const toggleSelectAll = () => {
    if (selectedDocuments.size === documents.length) {
      setSelectedDocuments(new Set());
    } else {
      setSelectedDocuments(new Set(documents.map(d => d.id)));
    }
  };

  const navigateIntoFolder = async (folder) => {
    setSelectedFolder(folder);
    setBreadcrumb(prev => [...prev, folder]);
    setCurrentPage(1);
    try {
      const data = await listFolders();
      const childFolders = Array.isArray(data) ? data.filter(f => f.parent_id === folder.id) : [];
      setFolders(childFolders);
    } catch (err) {
      setFolders([]);
    }
  };

  const navigateBreadcrumb = (index) => {
    if (index === -1) {
      setSelectedFolder(null);
      setBreadcrumb([]);
    } else {
      const target = breadcrumb[index];
      setSelectedFolder(target);
      setBreadcrumb(prev => prev.slice(0, index + 1));
    }
    setCurrentPage(1);
  };

  const openDetailDrawer = async (doc) => {
    setSelectedDocument(doc);
    setShowDetailDrawer(true);
    setDrawerTab('information');
    try {
      const versions = await listDocumentVersions(doc.id);
      setDocVersions(Array.isArray(versions) ? versions : []);
    } catch { setDocVersions([]); }
    try {
      const { listDocumentComments } = await import('../../../api/dms');
      const comments = await listDocumentComments(doc.id);
      setDocComments(Array.isArray(comments) ? comments : []);
    } catch { setDocComments([]); }
    try {
      const { listDocumentApprovals } = await import('../../../api/dms');
      const approvals = await listDocumentApprovals(doc.id);
      setDocApprovals(Array.isArray(approvals) ? approvals : []);
    } catch { setDocApprovals([]); }
    try {
      const { listDocumentSignatures } = await import('../../../api/dms');
      const sigs = await listDocumentSignatures(doc.id);
      setDocSignatures(Array.isArray(sigs) ? sigs : []);
    } catch { setDocSignatures([]); }
    try {
      const { listDocumentShares } = await import('../../../api/dms');
      const shares = await listDocumentShares(doc.id);
      setDocShares(Array.isArray(shares) ? shares : []);
    } catch { setDocShares([]); }
    try {
      const { listDocumentAuditLogs } = await import('../../../api/dms');
      const logs = await listDocumentAuditLogs(doc.id);
      setDocAuditLogs(Array.isArray(logs) ? logs : []);
    } catch { setDocAuditLogs([]); }
  };

  const closeDetailDrawer = () => {
    setShowDetailDrawer(false);
    setSelectedDocument(null);
    setDrawerTab('information');
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const { addComment } = await import('../../../api/dms');
      const comment = await addComment(selectedDocument.id, { content: newComment });
      setDocComments(prev => [...prev, comment]);
      setNewComment('');
      addNotification("Comment added.", "success");
    } catch (err) {
      addNotification("Failed to add comment.", "danger");
    }
  };

  const handleDownloadDocument = async (doc) => {
    try {
      const { default: client } = await import('../../../api/client');
      const response = await client.get(`/dms/documents/${doc.id}/download`, { responseType: 'blob' });
      const blob = response.data?.blob || response.data;
      const url = window.URL.createObjectURL(blob instanceof Blob ? blob : new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.name || 'document');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      addNotification("Download started.", "success");
    } catch (err) {
      addNotification("Failed to download document.", "danger");
    }
  };

  const documentTypeOptions = ['PDF', 'Word', 'Excel', 'PowerPoint', 'Image', 'Archive', 'Text', 'Other'];
  const documentStatusOptions = ['Draft', 'Pending', 'Under Review', 'Approved', 'Rejected', 'Archived', 'Expired', 'Completed', 'Signed'];
  const accessLevelOptions = [
    { value: 'private', label: 'Private', icon: faLock },
    { value: 'department', label: 'Department', icon: faBuilding },
    { value: 'team', label: 'Team', icon: faUser },
    { value: 'public', label: 'Public', icon: faGlobe },
  ];

  const SortIcon = ({ column }) => <FontAwesomeIcon icon={getSortIcon(column)} className="ms-1 x-small" style={{ opacity: sortBy === column ? 1 : 0.3 }} />;

  const drawerTabs = [
    { id: 'information', label: 'Information', icon: faInfoCircle },
    { id: 'preview', label: 'Preview', icon: faEye },
    { id: 'attachments', label: 'Attachments', icon: faPaperclip },
    { id: 'linkedRecords', label: 'Linked Records', icon: faLink },
    { id: 'activity', label: 'Activity', icon: faHistory },
    { id: 'comments', label: 'Comments', icon: faComment },
    { id: 'versions', label: 'Versions', icon: faCopy },
    { id: 'approvals', label: 'Approvals', icon: faCheckCircle },
    { id: 'signatures', label: 'Signatures', icon: faFileSignature },
    { id: 'sharing', label: 'Sharing', icon: faShare },
    { id: 'permissions', label: 'Permissions', icon: faLock },
    { id: 'auditTrail', label: 'Audit Trail', icon: faClipboardList },
    { id: 'relatedDocuments', label: 'Related Docs', icon: faFolderOpen },
  ];

  return (
    <div className="container-fluid py-4 fade-in">
      <style>{`
        .dms-card { transition: all 0.25s ease; border: 1px solid rgba(0,0,0,0.04); cursor: pointer; }
        .dms-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0,0,0,0.08) !important; border-color: rgba(99,102,241,0.2); }
        .dms-folder-card { transition: all 0.25s ease; cursor: pointer; position: relative; overflow: hidden; }
        .dms-folder-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0,0,0,0.1) !important; }
        .dms-folder-card .folder-icon-wrap { width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; border-radius: 16px; font-size: 1.6rem; transition: all 0.3s; }
        .dms-folder-card:hover .folder-icon-wrap { transform: scale(1.1); }
        .dms-drawer { position: fixed; top: 0; right: 0; width: 520px; max-width: 100vw; height: 100vh; background: #fff; z-index: 1050; box-shadow: -8px 0 40px rgba(0,0,0,0.12); transform: translateX(100%); transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1); overflow-y: auto; }
        .dms-drawer.open { transform: translateX(0); }
        .dms-drawer-backdrop { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.3); z-index: 1049; opacity: 0; pointer-events: none; transition: opacity 0.3s; }
        .dms-drawer-backdrop.open { opacity: 1; pointer-events: auto; }
        .dropzone { border: 2px dashed #d1d5db; border-radius: 16px; padding: 2.5rem; text-align: center; transition: all 0.25s; cursor: pointer; background: #fafafa; }
        .dropzone.drag-over { border-color: #6366f1; background: #eef2ff; transform: scale(1.02); }
        .dropzone:hover { border-color: #a5b4fc; background: #f8faff; }
        .status-badge-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 6px; }
        .filter-chip { background: #f1f5f9; border-radius: 100px; padding: 0.35rem 0.75rem; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
        .filter-chip:hover { background: #e2e8f0; }
        .filter-chip.active { background: #eef2ff; border-color: #6366f1; color: #6366f1; }
        .color-picker-circle { width: 28px; height: 28px; border-radius: 50%; cursor: pointer; border: 3px solid transparent; transition: all 0.2s; display: inline-block; }
        .color-picker-circle:hover { transform: scale(1.15); }
        .color-picker-circle.selected { border-color: #1e293b; transform: scale(1.15); box-shadow: 0 0 0 2px #fff; }
        .doc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.25rem; }
        .folder-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.25rem; }
        .drawer-tab-btn { border: none; background: transparent; padding: 0.6rem 1rem; font-size: 0.8rem; color: #64748b; border-radius: 10px; transition: all 0.2s; white-space: nowrap; }
        .drawer-tab-btn:hover { background: #f1f5f9; color: #1e293b; }
        .drawer-tab-btn.active { background: #eef2ff; color: #6366f1; font-weight: 600; }
        .version-timeline { position: relative; padding-left: 24px; }
        .version-timeline::before { content: ''; position: absolute; left: 8px; top: 8px; bottom: 8px; width: 2px; background: #e2e8f0; }
        .version-timeline-item { position: relative; padding-bottom: 1.25rem; }
        .version-timeline-item::before { content: ''; position: absolute; left: -20px; top: 6px; width: 12px; height: 12px; border-radius: 50%; background: #6366f1; border: 3px solid #eef2ff; }
        .preview-placeholder { height: 200px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 8px; }
        .bulk-bar { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; border-top: 1px solid #e2e8f0; padding: 0.75rem 2rem; z-index: 1040; box-shadow: 0 -4px 20px rgba(0,0,0,0.08); transform: translateY(100%); transition: transform 0.3s; }
        .bulk-bar.show { transform: translateY(0); }
        .import-export-dropdown { position: absolute; top: 100%; right: 0; background: #fff; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.12); padding: 0.5rem; min-width: 180px; z-index: 1045; opacity: 0; pointer-events: none; transform: translateY(-8px); transition: all 0.2s; }
        .import-export-dropdown.show { opacity: 1; pointer-events: auto; transform: translateY(0); }
        @media (max-width: 768px) { .dms-drawer { width: 100vw; } .doc-grid { grid-template-columns: 1fr; } .folder-grid { grid-template-columns: 1fr; } }
        @media (min-width: 1400px) { .doc-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); } .folder-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); } }
      `}</style>

      <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden bg-white">
        <div className="card-body p-4">
          <div className="row align-items-center g-3">
            <div className="col-xl-3 col-lg-4">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-4">
                  <FontAwesomeIcon icon={faFile} className="text-primary fs-4" />
                </div>
                <div>
                  <h4 className="fw-bold text-dark mb-0">Documents</h4>
                  <p className="text-muted small mb-0">
                    <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-1 mt-1">
                      {documents.length + folders.length} items
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-xl-9 col-lg-8">
              <div className="d-flex flex-wrap align-items-center justify-content-lg-end gap-2">
                <div className="position-relative" style={{ minWidth: '200px' }}>
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="position-absolute text-muted" style={{ left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem' }} />
                  <input
                    type="text"
                    className="form-control border shadow-none rounded-pill ps-5 bg-light"
                    placeholder="Search documents..."
                    style={{ height: '40px', fontSize: '0.85rem' }}
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <button
                  className={`btn rounded-pill px-3 py-2 border shadow-none d-flex align-items-center gap-2 ${activeFilterCount > 0 ? 'btn-primary text-white' : 'btn-light text-muted'}`}
                  style={{ fontSize: '0.85rem' }}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FontAwesomeIcon icon={faSliders} />
                  Filters
                  {activeFilterCount > 0 && <span className="badge bg-white text-primary rounded-pill">{activeFilterCount}</span>}
                </button>
                <div className="d-flex flex-wrap gap-1 p-1 bg-light rounded-pill border shadow-sm">
                  {[
                    { id: 'folder', icon: faFolder, label: 'Folder' },
                    { id: 'grid', icon: faTh, label: 'Grid' },
                    { id: 'list', icon: faList, label: 'List' },
                    { id: 'timeline', icon: faTimeline, label: 'Timeline' },
                    { id: 'approval', icon: faCheckCircle, label: 'Approval' },
                    { id: 'analytics', icon: faChartBar, label: 'Analytics' },
                    { id: 'archive', icon: faArchive, label: 'Archive' },
                  ].map(m => (
                    <button key={m.id}
                      className={`btn btn-sm rounded-pill px-2 px-lg-3 border-0 transition ${viewMode === m.id ? 'btn-white shadow-sm fw-bold' : 'text-muted'}`}
                      onClick={() => setViewMode(m.id)}
                      title={`${m.label} View`}
                      style={{ fontSize: '0.75rem' }}
                    >
                      <FontAwesomeIcon icon={m.icon} className="d-md-none" />
                      <span className="d-none d-md-inline"><FontAwesomeIcon icon={m.icon} className="me-1" />{m.label}</span>
                    </button>
                  ))}
                </div>
                <div className="position-relative">
                  <button
                    className="btn btn-light rounded-pill px-3 py-2 border shadow-none d-flex align-items-center gap-2"
                    style={{ fontSize: '0.85rem' }}
                    onClick={() => setShowImportExport(!showImportExport)}
                  >
                    <FontAwesomeIcon icon={faFileExport} />
                    Import/Export
                    <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '0.7rem' }} />
                  </button>
                  <div className={`import-export-dropdown ${showImportExport ? 'show' : ''}`}>
                    <button className="dropdown-item rounded-3 small py-2 d-flex align-items-center gap-2" onClick={() => { setShowImportExport(false); addNotification('Import feature coming soon.', 'info'); }}>
                      <FontAwesomeIcon icon={faFileImport} className="text-primary" /> Import Documents
                    </button>
                    <button className="dropdown-item rounded-3 small py-2 d-flex align-items-center gap-2" onClick={() => { setShowImportExport(false); addNotification('Export feature coming soon.', 'info'); }}>
                      <FontAwesomeIcon icon={faFileExport} className="text-success" /> Export to CSV
                    </button>
                  </div>
                </div>
                <button className="btn btn-light rounded-pill px-3 py-2 border shadow-none d-flex align-items-center gap-2" style={{ fontSize: '0.85rem' }} onClick={() => setShowCreateFolderModal(true)}>
                  <FontAwesomeIcon icon={faFolderPlus} className="text-warning" />
                  Create Folder
                </button>
                <button className="btn btn-primary rounded-pill px-4 py-2 shadow-sm d-flex align-items-center gap-2 transition" style={{ fontSize: '0.85rem' }} onClick={() => setShowUploadModal(true)}>
                  <FontAwesomeIcon icon={faArrowUpFromBracket} />
                  Upload
                </button>
              </div>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-3 border-top">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
                <span className="small fw-bold text-muted me-1">Filters:</span>
                <select className="form-select form-select-sm border shadow-none rounded-pill px-3 bg-light" style={{ width: '125px', fontSize: '0.75rem' }} value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
                  <option value="">All Types</option>
                  {documentTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <select className="form-select form-select-sm border shadow-none rounded-pill px-3 bg-light" style={{ width: '125px', fontSize: '0.75rem' }} value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
                  <option value="">All Status</option>
                  {documentStatusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <select className="form-select form-select-sm border shadow-none rounded-pill px-3 bg-light" style={{ width: '130px', fontSize: '0.75rem' }} value={filters.department} onChange={(e) => handleFilterChange('department', e.target.value)}>
                  <option value="">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                  <option value="Operations">Operations</option>
                </select>
                <input type="text" className="form-control form-control-sm border shadow-none rounded-pill px-3 bg-light" placeholder="Created By" style={{ width: '120px', fontSize: '0.75rem' }} value={filters.owner} onChange={(e) => handleFilterChange('owner', e.target.value)} />
                <input type="text" className="form-control form-control-sm border shadow-none rounded-pill px-3 bg-light" placeholder="Modified By" style={{ width: '120px', fontSize: '0.75rem' }} value={filters.modifiedBy} onChange={(e) => handleFilterChange('modifiedBy', e.target.value)} />
                <input type="date" className="form-control form-control-sm border shadow-none rounded-pill px-3 bg-light" style={{ width: '135px', fontSize: '0.75rem' }} value={filters.dateFrom} onChange={(e) => handleFilterChange('dateFrom', e.target.value)} title="From date" />
                <input type="date" className="form-control form-control-sm border shadow-none rounded-pill px-3 bg-light" style={{ width: '135px', fontSize: '0.75rem' }} value={filters.dateTo} onChange={(e) => handleFilterChange('dateTo', e.target.value)} title="To date" />
                <input type="text" className="form-control form-control-sm border shadow-none rounded-pill px-3 bg-light" placeholder="Tags (comma sep)" style={{ width: '145px', fontSize: '0.75rem' }} value={filters.tags} onChange={(e) => handleFilterChange('tags', e.target.value)} />
              </div>
              {showAdvancedFilters && (
                <div className="d-flex flex-wrap align-items-center gap-2 mb-3 pt-2 border-top">
                  <select className="form-select form-select-sm border shadow-none rounded-pill px-3 bg-light" style={{ width: '130px', fontSize: '0.75rem' }} value={filters.approvalStatus} onChange={(e) => handleFilterChange('approvalStatus', e.target.value)}>
                    <option value="">Approval Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <select className="form-select form-select-sm border shadow-none rounded-pill px-3 bg-light" style={{ width: '130px', fontSize: '0.75rem' }} value={filters.signatureStatus} onChange={(e) => handleFilterChange('signatureStatus', e.target.value)}>
                    <option value="">Signature Status</option>
                    <option value="pending">Pending</option>
                    <option value="signed">Signed</option>
                    <option value="not_required">Not Required</option>
                  </select>
                  <select className="form-select form-select-sm border shadow-none rounded-pill px-3 bg-light" style={{ width: '140px', fontSize: '0.75rem' }} value={filters.confidentiality} onChange={(e) => handleFilterChange('confidentiality', e.target.value)}>
                    <option value="">Confidentiality</option>
                    <option value="public">Public</option>
                    <option value="internal">Internal</option>
                    <option value="confidential">Confidential</option>
                    <option value="secret">Secret</option>
                  </select>
                  <select className="form-select form-select-sm border shadow-none rounded-pill px-3 bg-light" style={{ width: '140px', fontSize: '0.75rem' }} value={filters.retentionPolicy} onChange={(e) => handleFilterChange('retentionPolicy', e.target.value)}>
                    <option value="">Retention Policy</option>
                    <option value="standard">Standard (7 yrs)</option>
                    <option value="short">Short (3 yrs)</option>
                    <option value="long">Long (15 yrs)</option>
                    <option value="permanent">Permanent</option>
                  </select>
                  <input type="text" className="form-control form-control-sm border shadow-none rounded-pill px-3 bg-light" placeholder="Project" style={{ width: '120px', fontSize: '0.75rem' }} value={filters.project} onChange={(e) => handleFilterChange('project', e.target.value)} />
                  <input type="text" className="form-control form-control-sm border shadow-none rounded-pill px-3 bg-light" placeholder="Client" style={{ width: '120px', fontSize: '0.75rem' }} value={filters.client} onChange={(e) => handleFilterChange('client', e.target.value)} />
                </div>
              )}
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-primary rounded-pill px-4 fw-semibold" onClick={() => { fetchDocuments(); addNotification('Filters applied.', 'success'); }}>
                  <FontAwesomeIcon icon={faCheck} className="me-1" /> Apply
                </button>
                <button className="btn btn-sm btn-light rounded-pill px-4 fw-semibold border" onClick={clearFilters}>
                  <FontAwesomeIcon icon={faXmark} className="me-1" /> Clear
                </button>
                <button className="btn btn-sm btn-outline-primary rounded-pill px-4 fw-semibold" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                  <FontAwesomeIcon icon={faSliders} className="me-1" /> {showAdvancedFilters ? 'Hide Advanced' : 'Advanced'}
                </button>
                <button className="btn btn-sm btn-outline-primary rounded-pill px-4 fw-semibold" onClick={() => addNotification('Filter saved (UI only).', 'info')}>
                  <FontAwesomeIcon icon={faBookmark} className="me-1" /> Save Filter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedFolder && (
        <div className="d-flex align-items-center gap-2 mb-3 px-1">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><button className="btn btn-link text-decoration-none p-0 text-muted small fw-medium" onClick={() => navigateBreadcrumb(-1)}>Documents</button></li>
              {breadcrumb.map((f, i) => (
                <li key={f.id} className={`breadcrumb-item ${i === breadcrumb.length - 1 ? 'active' : ''}`}>
                  {i === breadcrumb.length - 1 ? (
                    <span className="small fw-bold text-primary">{f.name}</span>
                  ) : (
                    <button className="btn btn-link text-decoration-none p-0 text-muted small fw-medium" onClick={() => navigateBreadcrumb(i)}>{f.name}</button>
                  )}
                </li>
              ))}
            </ol>
          </nav>
          <button className="btn btn-sm btn-light rounded-pill border ms-2 px-3" onClick={() => navigateBreadcrumb(-1)} title="Back to root">
            <FontAwesomeIcon icon={faTimes} className="me-1" /> Root
          </button>
        </div>
      )}

      {loading ? (
        <div className="d-flex justify-content-center align-items-center py-5" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted small">Loading documents...</p>
          </div>
        </div>
      ) : (
        <>
          {viewMode === 'folder' && (
            <>
              {folders.length === 0 && documents.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle bg-light" style={{ width: '96px', height: '96px' }}>
                    <FontAwesomeIcon icon={faFolder} className="text-muted fs-1" />
                  </div>
                  <h5 className="fw-bold text-dark mb-2">No documents yet</h5>
                  <p className="text-muted small mb-4">Upload your first document or create a folder to get started.</p>
                  <div className="d-flex justify-content-center gap-3">
                    <button className="btn btn-primary rounded-pill px-4 py-2 shadow-sm" onClick={() => setShowUploadModal(true)}>
                      <FontAwesomeIcon icon={faArrowUpFromBracket} className="me-2" /> Upload Document
                    </button>
                    <button className="btn btn-light rounded-pill px-4 py-2 border" onClick={() => setShowCreateFolderModal(true)}>
                      <FontAwesomeIcon icon={faFolderPlus} className="me-2" /> Create Folder
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {folders.length > 0 && (
                    <>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h6 className="fw-bold text-dark mb-0"><FontAwesomeIcon icon={faFolder} className="me-2 text-primary" />Folders</h6>
                      </div>
                      <div className="folder-grid mb-5">
                        {folders.map(folder => (
                          <div key={folder.id} className="card border-0 shadow-sm rounded-4 dms-folder-card bg-white" onClick={() => navigateIntoFolder(folder)}>
                            <div className="card-body p-4">
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="folder-icon-wrap" style={{ backgroundColor: `${folder.color || '#6366f1'}20`, color: folder.color || '#6366f1' }}>
                                  <FontAwesomeIcon icon={faFolder} />
                                </div>
                                <div className="dropdown">
                                  <button className="btn btn-light btn-sm rounded-circle border-0 shadow-none d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }} data-bs-toggle="dropdown" onClick={(e) => e.stopPropagation()}>
                                    <FontAwesomeIcon icon={faEllipsisV} className="text-muted" />
                                  </button>
                                  <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 p-1">
                                    <li><button className="dropdown-item rounded-2 small py-2 d-flex align-items-center gap-2" onClick={(e) => { e.stopPropagation(); navigateIntoFolder(folder); }}><FontAwesomeIcon icon={faFolderOpen} className="text-primary" /> Open Folder</button></li>
                                    <li><button className="dropdown-item rounded-2 small py-2 d-flex align-items-center gap-2" onClick={(e) => { e.stopPropagation(); addNotification('Share folder feature coming soon.', 'info'); }}><FontAwesomeIcon icon={faShare} className="text-info" /> Share Folder</button></li>
                                    <li><button className="dropdown-item rounded-2 small py-2 d-flex align-items-center gap-2" onClick={(e) => { e.stopPropagation(); addNotification('Manage permissions feature coming soon.', 'info'); }}><FontAwesomeIcon icon={faLock} className="text-warning" /> Manage Permissions</button></li>
                                    <li><hr className="dropdown-divider my-1" /></li>
                                    <li><button className="dropdown-item rounded-2 small py-2 d-flex align-items-center gap-2" onClick={(e) => { e.stopPropagation(); addNotification('Archive folder feature coming soon.', 'info'); }}><FontAwesomeIcon icon={faArchive} className="text-secondary" /> Archive</button></li>
                                    <li><button className="dropdown-item rounded-2 small py-2 d-flex align-items-center gap-2 text-danger" onClick={(e) => { e.stopPropagation(); setFolderDeleteConfirm(folder.id); }}><FontAwesomeIcon icon={faTrash} /> Delete</button></li>
                                  </ul>
                                </div>
                              </div>
                              <h6 className="fw-bold text-dark mb-1">{folder.name}</h6>
                              {folder.description && <p className="text-muted small mb-2 text-truncate">{folder.description}</p>}
                              <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                                <span className="badge bg-light text-muted rounded-pill px-2 py-1" style={{ fontSize: '0.7rem' }}>
                                  <FontAwesomeIcon icon={faFile} className="me-1" />{folder.documents_count || folder.document_count || 0} docs
                                </span>
                                {folder.storage_used && (
                                  <span className="badge bg-light text-muted rounded-pill px-2 py-1" style={{ fontSize: '0.7rem' }}>
                                    <FontAwesomeIcon icon={faHardDrive} className="me-1" />{formatFileSize(folder.storage_used)}
                                  </span>
                                )}
                              </div>
                              <div className="d-flex align-items-center gap-2 small text-muted mb-2" style={{ fontSize: '0.7rem' }}>
                                <span><FontAwesomeIcon icon={faUser} className="me-1" />{folder.owner?.name || folder.owner || 'Unknown'}</span>
                                {folder.department && <span><FontAwesomeIcon icon={faBuilding} className="me-1" />{folder.department}</span>}
                              </div>
                              <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light">
                                <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: '0.7rem' }}>
                                  <FontAwesomeIcon icon={faCalendar} />
                                  <span>{formatDate(folder.updated_at || folder.modified)}</span>
                                </div>
                                <span className={`badge rounded-pill px-2 py-1 fw-medium ${folder.access_level === 'public' ? 'bg-success bg-opacity-10 text-success' : folder.access_level === 'department' ? 'bg-info bg-opacity-10 text-info' : folder.access_level === 'team' ? 'bg-warning bg-opacity-10 text-warning' : 'bg-secondary bg-opacity-10 text-secondary'}`} style={{ fontSize: '0.65rem' }}>
                                  <FontAwesomeIcon icon={folder.access_level === 'public' ? faGlobe : folder.access_level === 'department' ? faBuilding : folder.access_level === 'team' ? faUser : faLock} className="me-1" />
                                  {folder.access_level ? folder.access_level.charAt(0).toUpperCase() + folder.access_level.slice(1) : 'Private'}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {documents.length > 0 && !selectedFolder && (
                    <>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h6 className="fw-bold text-dark mb-0"><FontAwesomeIcon icon={faFile} className="me-2 text-primary" />Documents</h6>
                      </div>
                      <div className="doc-grid">
                        {documents.map(doc => (
                          <div key={doc.id} className="card border-0 shadow-sm rounded-4 dms-card bg-white">
                            <div className="position-relative">
                              <div className="preview-placeholder" style={{ background: `linear-gradient(135deg, ${getFileColor(doc.file_type)}15, ${getFileColor(doc.file_type)}08)`, borderRadius: '16px 16px 0 0' }}>
                                <div className="d-flex align-items-center justify-content-center rounded-circle mb-1" style={{ width: '52px', height: '52px', background: `${getFileColor(doc.file_type)}22` }}>
                                  <FontAwesomeIcon icon={getFileIcon(doc.file_type)} style={{ color: getFileColor(doc.file_type), fontSize: '1.5rem' }} />
                                </div>
                                <span className="badge rounded-pill fw-bold px-3 py-1" style={{ background: getFileColor(doc.file_type), color: '#fff', fontSize: '0.7rem' }}>{getFileExt(doc.name || doc.file_name)}</span>
                              </div>
                              <div className="position-absolute top-0 end-0 m-2">
                                {doc.status && getStatusBadge(doc.status)}
                              </div>
                            </div>
                            <div className="card-body p-3">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h6 className="fw-bold text-dark mb-0 td-title-clickable" style={{ fontSize: '0.85rem', cursor: 'pointer' }} onClick={() => openDetailDrawer(doc)}>{doc.name || doc.file_name}</h6>
                                <div className="dropdown">
                                  <button className="btn btn-light btn-sm rounded-circle border-0 shadow-none d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px' }} data-bs-toggle="dropdown">
                                    <FontAwesomeIcon icon={faEllipsisV} className="text-muted" style={{ fontSize: '0.75rem' }} />
                                  </button>
                                  <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 p-1" style={{ minWidth: '170px' }}>
                                    <li><button className="dropdown-item rounded-2 small py-2 d-flex align-items-center gap-2" onClick={() => openDetailDrawer(doc)}><FontAwesomeIcon icon={faEye} className="text-info" /> View</button></li>
                                    <li><button className="dropdown-item rounded-2 small py-2 d-flex align-items-center gap-2" onClick={() => { openDetailDrawer(doc); addNotification('Edit via detail drawer.', 'info'); }}><FontAwesomeIcon icon={faEdit} className="text-primary" /> Edit</button></li>
                                    <li><button className="dropdown-item rounded-2 small py-2 d-flex align-items-center gap-2" onClick={() => handleDownloadDocument(doc)}><FontAwesomeIcon icon={faDownload} className="text-success" /> Download</button></li>
                                    <li><button className="dropdown-item rounded-2 small py-2 d-flex align-items-center gap-2" onClick={() => addNotification('Share feature coming soon.', 'info')}><FontAwesomeIcon icon={faShare} className="text-warning" /> Share</button></li>
                                    <li><hr className="dropdown-divider my-1" /></li>
                                    <li><button className="dropdown-item rounded-2 small py-2 d-flex align-items-center gap-2 text-danger" onClick={() => setDeleteConfirm(doc.id)}><FontAwesomeIcon icon={faTrash} /> Delete</button></li>
                                  </ul>
                                </div>
                              </div>
                              <div className="d-flex align-items-center gap-2 mb-2 small text-muted" style={{ fontSize: '0.75rem' }}>
                                <FontAwesomeIcon icon={faUser} style={{ fontSize: '0.65rem' }} />
                                <span>{doc.owner?.name || doc.owner || 'Unknown'}</span>
                              </div>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                                  <FontAwesomeIcon icon={faCalendar} className="me-1" />{formatDate(doc.updated_at || doc.modified)}
                                </span>
                                {doc.file_size && (
                                  <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                                    <FontAwesomeIcon icon={faHardDrive} className="me-1" />{formatFileSize(doc.file_size)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}

          {viewMode === 'grid' && (
            <>
              {documents.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle bg-light" style={{ width: '96px', height: '96px' }}>
                    <FontAwesomeIcon icon={faFile} className="text-muted fs-1" />
                  </div>
                  <h5 className="fw-bold text-dark mb-2">No documents found</h5>
                  <p className="text-muted small mb-4">Try adjusting your search or filters, or upload a new document.</p>
                  <button className="btn btn-primary rounded-pill px-4 py-2 shadow-sm" onClick={() => setShowUploadModal(true)}>
                    <FontAwesomeIcon icon={faArrowUpFromBracket} className="me-2" /> Upload Document
                  </button>
                </div>
              ) : (
                <div className="doc-grid">
                  {documents.map(doc => (
                    <div key={doc.id} className="card border-0 shadow-sm rounded-4 dms-card bg-white">
                      <div className="position-relative">
                        <div className="preview-placeholder" style={{ background: `linear-gradient(135deg, ${getFileColor(doc.file_type)}15, ${getFileColor(doc.file_type)}08)`, borderRadius: '16px 16px 0 0' }}>
                          <div className="d-flex align-items-center justify-content-center rounded-circle mb-1" style={{ width: '52px', height: '52px', background: `${getFileColor(doc.file_type)}22` }}>
                            <FontAwesomeIcon icon={getFileIcon(doc.file_type)} style={{ color: getFileColor(doc.file_type), fontSize: '1.5rem' }} />
                          </div>
                          <span className="badge rounded-pill fw-bold px-3 py-1" style={{ background: getFileColor(doc.file_type), color: '#fff', fontSize: '0.7rem' }}>{getFileExt(doc.name || doc.file_name)}</span>
                        </div>
                        <div className="position-absolute top-0 end-0 m-2">
                          {doc.status && getStatusBadge(doc.status)}
                        </div>
                      </div>
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="fw-bold text-dark mb-0 td-title-clickable" style={{ fontSize: '0.85rem', cursor: 'pointer' }} onClick={() => openDetailDrawer(doc)}>{doc.name || doc.file_name}</h6>
                          <div className="dropdown">
                            <button className="btn btn-light btn-sm rounded-circle border-0 shadow-none d-flex align-items-center justify-content-center" style={{ width: '28px', height: '28px' }} data-bs-toggle="dropdown">
                              <FontAwesomeIcon icon={faEllipsisV} className="text-muted" style={{ fontSize: '0.75rem' }} />
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 p-1" style={{ minWidth: '170px' }}>
                              <li><button className="dropdown-item rounded-2 small py-2 d-flex align-items-center gap-2" onClick={() => openDetailDrawer(doc)}><FontAwesomeIcon icon={faEye} className="text-info" /> View</button></li>
                              <li><button className="dropdown-item rounded-2 small py-2 d-flex align-items-center gap-2" onClick={() => { openDetailDrawer(doc); addNotification('Edit via detail drawer.', 'info'); }}><FontAwesomeIcon icon={faEdit} className="text-primary" /> Edit</button></li>
                              <li><button className="dropdown-item rounded-2 small py-2 d-flex align-items-center gap-2" onClick={() => handleDownloadDocument(doc)}><FontAwesomeIcon icon={faDownload} className="text-success" /> Download</button></li>
                              <li><button className="dropdown-item rounded-2 small py-2 d-flex align-items-center gap-2" onClick={() => addNotification('Share feature coming soon.', 'info')}><FontAwesomeIcon icon={faShare} className="text-warning" /> Share</button></li>
                              <li><hr className="dropdown-divider my-1" /></li>
                              <li><button className="dropdown-item rounded-2 small py-2 d-flex align-items-center gap-2" onClick={() => addNotification('Approve feature coming soon.', 'info')}><FontAwesomeIcon icon={faCheckCircle} className="text-success" /> Approve</button></li>
                              <li><button className="dropdown-item rounded-2 small py-2 d-flex align-items-center gap-2" onClick={() => addNotification('Reject feature coming soon.', 'info')}><FontAwesomeIcon icon={faTimes} className="text-danger" /> Reject</button></li>
                              <li><button className="dropdown-item rounded-2 small py-2 d-flex align-items-center gap-2" onClick={() => addNotification('Sign feature coming soon.', 'info')}><FontAwesomeIcon icon={faFileSignature} className="text-purple" /> Sign</button></li>
                              <li><hr className="dropdown-divider my-1" /></li>
                              <li><button className="dropdown-item rounded-2 small py-2 d-flex align-items-center gap-2 text-danger" onClick={() => setDeleteConfirm(doc.id)}><FontAwesomeIcon icon={faTrash} /> Delete</button></li>
                            </ul>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-2 mb-2 small text-muted" style={{ fontSize: '0.75rem' }}>
                          <FontAwesomeIcon icon={faUser} style={{ fontSize: '0.65rem' }} />
                          <span>{doc.owner?.name || doc.owner || 'Unknown'}</span>
                          {doc.department && (
                            <>
                              <span className="mx-1">|</span>
                              <FontAwesomeIcon icon={faBuilding} style={{ fontSize: '0.65rem' }} />
                              <span>{doc.department}</span>
                            </>
                          )}
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                            <FontAwesomeIcon icon={faCalendar} className="me-1" />{formatDate(doc.updated_at || doc.modified)}
                          </span>
                          {doc.file_size && (
                            <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                              <FontAwesomeIcon icon={faHardDrive} className="me-1" />{formatFileSize(doc.file_size)}
                            </span>
                          )}
                        </div>
                        <div className="d-flex align-items-center gap-1 flex-wrap mb-2">
                          {doc.version && <span className="badge bg-light text-muted rounded-pill px-2" style={{ fontSize: '0.65rem' }}>v{doc.version}</span>}
                          {doc.tags && Array.isArray(doc.tags) && doc.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-2" style={{ fontSize: '0.65rem' }}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {viewMode === 'list' && (
            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="px-4 py-3 border-0" style={{ width: '40px' }}>
                        <input type="checkbox" className="form-check-input shadow-none" checked={documents.length > 0 && selectedDocuments.size === documents.length} onChange={toggleSelectAll} />
                      </th>
                      <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted" style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>
                        Document Name <SortIcon column="name" />
                      </th>
                      <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted" style={{ cursor: 'pointer' }} onClick={() => handleSort('type')}>
                        Type <SortIcon column="type" />
                      </th>
                      <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted" style={{ cursor: 'pointer' }} onClick={() => handleSort('owner')}>
                        Owner <SortIcon column="owner" />
                      </th>
                      <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted">Department</th>
                      <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted" style={{ cursor: 'pointer' }} onClick={() => handleSort('created_at')}>
                        Created <SortIcon column="created_at" />
                      </th>
                      <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted" style={{ cursor: 'pointer' }} onClick={() => handleSort('updated_at')}>
                        Modified <SortIcon column="updated_at" />
                      </th>
                      <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted" style={{ cursor: 'pointer' }} onClick={() => handleSort('file_size')}>
                        Size <SortIcon column="file_size" />
                      </th>
                      <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted">Status</th>
                      <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted">Approval</th>
                      <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted">Signature</th>
                      <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted">Version</th>
                      <th className="px-4 py-3 border-0 text-end x-small fw-bold text-uppercase text-muted">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map(doc => (
                      <tr key={doc.id} className="transition">
                        <td className="px-4 py-3">
                          <input type="checkbox" className="form-check-input shadow-none" checked={selectedDocuments.has(doc.id)} onChange={() => toggleDocSelect(doc.id)} />
                        </td>
                        <td className="py-3">
                          <div className="d-flex align-items-center gap-3">
                            <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: '38px', height: '38px', background: `${getFileColor(doc.file_type)}18` }}>
                              <FontAwesomeIcon icon={getFileIcon(doc.file_type)} style={{ color: getFileColor(doc.file_type), fontSize: '1rem' }} />
                            </div>
                            <div>
                              <h6 className="fw-bold mb-0 td-title-clickable" style={{ fontSize: '0.85rem', cursor: 'pointer' }} onClick={() => openDetailDrawer(doc)}>{doc.name || doc.file_name}</h6>
                              {doc.tags && Array.isArray(doc.tags) && doc.tags.length > 0 && (
                                <div className="d-flex gap-1 mt-1">
                                  {doc.tags.slice(0, 2).map((tag, i) => (
                                    <span key={i} className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-2" style={{ fontSize: '0.6rem' }}>{tag}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3"><span className="small fw-medium text-muted">{getFileExt(doc.name || doc.file_name) || 'File'}</span></td>
                        <td className="py-3">
                          <div className="d-flex align-items-center gap-2">
                            <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold" style={{ width: '28px', height: '28px', fontSize: '0.7rem' }}>
                              {doc.owner?.name?.[0] || doc.owner?.[0] || 'U'}
                            </div>
                            <span className="small fw-medium">{doc.owner?.name || doc.owner || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="py-3"><span className="small text-muted">{doc.department || '-'}</span></td>
                        <td className="py-3"><span className="small text-muted">{formatDate(doc.created_at)}</span></td>
                        <td className="py-3"><span className="small text-muted">{formatDate(doc.updated_at)}</span></td>
                        <td className="py-3"><span className="small text-muted">{formatFileSize(doc.file_size)}</span></td>
                        <td className="py-3">{getStatusBadge(doc.status)}</td>
                        <td className="py-3">
                          {doc.approval_status ? (
                            <span className={`badge rounded-pill px-2 py-1 fw-semibold ${doc.approval_status === 'approved' ? 'bg-success bg-opacity-10 text-success' : doc.approval_status === 'rejected' ? 'bg-danger bg-opacity-10 text-danger' : doc.approval_status === 'pending' ? 'bg-warning bg-opacity-10 text-warning' : 'bg-light text-muted'}`} style={{ fontSize: '0.7rem' }}>
                              {doc.approval_status.charAt(0).toUpperCase() + doc.approval_status.slice(1)}
                            </span>
                          ) : <span className="small text-muted">-</span>}
                        </td>
                        <td className="py-3">
                          {doc.signature_status ? (
                            <span className={`badge rounded-pill px-2 py-1 fw-semibold ${doc.signature_status === 'signed' ? 'bg-purple bg-opacity-10 text-purple' : 'bg-light text-muted'}`} style={{ fontSize: '0.7rem' }}>
                              {doc.signature_status.charAt(0).toUpperCase() + doc.signature_status.slice(1)}
                            </span>
                          ) : <span className="small text-muted">-</span>}
                        </td>
                        <td className="py-3"><span className="badge bg-light text-muted rounded-pill px-2 py-1 fw-medium">{doc.version ? `v${doc.version}` : '-'}</span></td>
                        <td className="px-4 py-3 text-end">
                          <div className="dropdown">
                            <button className="btn btn-light btn-sm rounded-3 border-0 shadow-none d-flex align-items-center justify-content-center px-3" data-bs-toggle="dropdown">
                              <FontAwesomeIcon icon={faEllipsisV} className="text-muted" />
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3 p-1">
                              <li><button className="dropdown-item rounded-2 small py-2 d-flex align-items-center gap-2" onClick={() => openDetailDrawer(doc)}><FontAwesomeIcon icon={faEye} className="text-info" /> View</button></li>
                              <li><button className="dropdown-item rounded-2 small py-2 d-flex align-items-center gap-2" onClick={() => handleDownloadDocument(doc)}><FontAwesomeIcon icon={faDownload} className="text-success" /> Download</button></li>
                              <li><button className="dropdown-item rounded-2 small py-2 d-flex align-items-center gap-2" onClick={() => addNotification('Share feature coming soon.', 'info')}><FontAwesomeIcon icon={faShare} className="text-warning" /> Share</button></li>
                              <li><hr className="dropdown-divider my-1" /></li>
                              <li><button className="dropdown-item rounded-2 small py-2 d-flex align-items-center gap-2 text-danger" onClick={() => setDeleteConfirm(doc.id)}><FontAwesomeIcon icon={faTrash} /> Delete</button></li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {documents.length === 0 && (
                <div className="text-center py-5">
                  <FontAwesomeIcon icon={faFile} className="text-muted fs-2 mb-3" />
                  <p className="text-muted small">No documents match your criteria.</p>
                </div>
              )}
            </div>
          )}

          {viewMode === 'timeline' && (
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h6 className="fw-bold text-dark mb-4"><FontAwesomeIcon icon={faTimeline} className="me-2 text-primary" />Document Timeline</h6>
              {documents.length === 0 ? (
                <div className="text-center py-4">
                  <FontAwesomeIcon icon={faTimeline} className="text-muted mb-2" style={{ fontSize: '2.5rem', opacity: 0.4 }} />
                  <p className="text-muted small">No documents to display in timeline.</p>
                </div>
              ) : (
                <div className="version-timeline">
                  {documents.sort((a, b) => new Date(b.created_at || b.updated_at) - new Date(a.created_at || a.updated_at)).slice(0, 30).map(doc => (
                    <div key={doc.id} className="version-timeline-item">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="d-flex align-items-start gap-3">
                          <div className="d-flex align-items-center justify-content-center rounded-3 mt-1" style={{ width: '36px', height: '36px', background: `${getFileColor(doc.file_type)}18` }}>
                            <FontAwesomeIcon icon={getFileIcon(doc.file_type)} style={{ color: getFileColor(doc.file_type), fontSize: '0.9rem' }} />
                          </div>
                          <div>
                            <span className="small fw-semibold text-dark td-title-clickable" style={{ cursor: 'pointer' }} onClick={() => openDetailDrawer(doc)}>{doc.name || doc.file_name}</span>
                            <div className="d-flex align-items-center gap-3 mt-1">
                              <small className="text-muted"><FontAwesomeIcon icon={faUser} className="me-1" style={{ fontSize: '0.6rem' }} />{doc.owner?.name || doc.owner || 'Unknown'}</small>
                              <small className="text-muted"><FontAwesomeIcon icon={faTag} className="me-1" style={{ fontSize: '0.6rem' }} />{getFileExt(doc.name || doc.file_name)}</small>
                              {doc.status && <>{getStatusBadge(doc.status)}</>}
                            </div>
                          </div>
                        </div>
                        <small className="text-muted" style={{ fontSize: '0.65rem', whiteSpace: 'nowrap' }}>{formatDate(doc.created_at || doc.updated_at)}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {viewMode === 'approval' && (
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h6 className="fw-bold text-dark mb-4"><FontAwesomeIcon icon={faCheckCircle} className="me-2 text-success" />Documents Awaiting Approval</h6>
              {documents.filter(d => !d.approval_status || d.approval_status === 'pending').length === 0 ? (
                <div className="text-center py-4">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-muted mb-2" style={{ fontSize: '2.5rem', opacity: 0.4 }} />
                  <p className="text-muted small mb-1">All documents have been reviewed.</p>
                  <small className="text-muted">Documents pending approval will appear here.</small>
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {documents.filter(d => !d.approval_status || d.approval_status === 'pending').slice(0, 20).map(doc => (
                    <div key={doc.id} className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light">
                      <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: '40px', height: '40px', background: `${getFileColor(doc.file_type)}18` }}>
                          <FontAwesomeIcon icon={getFileIcon(doc.file_type)} style={{ color: getFileColor(doc.file_type) }} />
                        </div>
                        <div>
                          <span className="small fw-semibold text-dark td-title-clickable" style={{ cursor: 'pointer' }} onClick={() => openDetailDrawer(doc)}>{doc.name || doc.file_name}</span>
                          <div className="d-flex align-items-center gap-2 mt-1">
                            <small className="text-muted">{doc.owner?.name || doc.owner || 'Unknown'}</small>
                            {doc.department && <><span className="text-muted">|</span><small className="text-muted">{doc.department}</small></>}
                          </div>
                        </div>
                      </div>
                      <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-outline-success rounded-pill px-3 fw-semibold" style={{ fontSize: '0.75rem' }} onClick={() => addNotification('Approve feature coming soon.', 'info')}><FontAwesomeIcon icon={faCheck} className="me-1" /> Approve</button>
                        <button className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-semibold" style={{ fontSize: '0.75rem' }} onClick={() => addNotification('Reject feature coming soon.', 'info')}><FontAwesomeIcon icon={faTimes} className="me-1" /> Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {viewMode === 'analytics' && (
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h6 className="fw-bold text-dark mb-4"><FontAwesomeIcon icon={faChartBar} className="me-2 text-info" />Document Analytics</h6>
              <div className="row g-3 mb-4">
                {[
                  { label: 'Total Documents', value: documents.length, color: '#6366f1', icon: faFile },
                  { label: 'Avg File Size', value: documents.length ? formatFileSize(documents.reduce((s, d) => s + (d.file_size || 0), 0) / documents.length) : '0 B', color: '#10b981', icon: faHardDrive },
                  { label: 'Pending Approval', value: documents.filter(d => !d.approval_status || d.approval_status === 'pending').length, color: '#f59e0b', icon: faClock },
                  { label: 'Approved', value: documents.filter(d => d.approval_status === 'approved').length, color: '#10b981', icon: faCheckCircle },
                ].map((stat, i) => (
                  <div key={i} className="col-md-3 col-6">
                    <div className="p-3 rounded-3 bg-light text-center">
                      <FontAwesomeIcon icon={stat.icon} style={{ color: stat.color, fontSize: '1.2rem' }} className="mb-2" />
                      <h5 className="fw-bold mb-0 text-dark">{stat.value}</h5>
                      <small className="text-muted">{stat.label}</small>
                    </div>
                  </div>
                ))}
              </div>
              <div className="d-flex flex-wrap gap-2">
                {['pdf', 'doc', 'xls', 'ppt', 'image', 'other'].map(type => {
                  const count = documents.filter(d => {
                    const ext = getFileExt(d.name || d.file_name).toLowerCase();
                    if (type === 'other') return !['pdf', 'doc', 'xls', 'ppt'].some(t => ext.includes(t));
                    return ext.includes(type);
                  }).length;
                  const pct = documents.length ? Math.round((count / documents.length) * 100) : 0;
                  return <div key={type} className="flex-grow-1 p-2 rounded-2 text-center bg-light" style={{ minWidth: '80px' }}>
                    <small className="fw-bold text-dark d-block">{type.toUpperCase()}</small>
                    <small className="text-muted">{count} ({pct}%)</small>
                  </div>;
                })}
              </div>
            </div>
          )}

          {viewMode === 'archive' && (
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h6 className="fw-bold text-dark mb-4"><FontAwesomeIcon icon={faArchive} className="me-2 text-secondary" />Archived Documents</h6>
              {documents.filter(d => d.status === 'archived' || d.archived).length === 0 ? (
                <div className="text-center py-4">
                  <FontAwesomeIcon icon={faArchive} className="text-muted mb-2" style={{ fontSize: '2.5rem', opacity: 0.4 }} />
                  <p className="text-muted small mb-1">No archived documents.</p>
                  <small className="text-muted">Archived documents can be restored or permanently deleted.</small>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th className="px-3 py-3 border-0 x-small fw-bold text-uppercase text-muted">Document</th>
                        <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted">Archived Date</th>
                        <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted">Retention</th>
                        <th className="py-3 border-0 x-small fw-bold text-uppercase text-muted">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {documents.filter(d => d.status === 'archived' || d.archived).map(doc => (
                        <tr key={doc.id}>
                          <td className="px-3 py-3">
                            <div className="d-flex align-items-center gap-2">
                              <FontAwesomeIcon icon={getFileIcon(doc.file_type)} style={{ color: getFileColor(doc.file_type) }} />
                              <span className="small fw-semibold text-dark">{doc.name || doc.file_name}</span>
                            </div>
                          </td>
                          <td className="py-3"><small className="text-muted">{formatDate(doc.archived_at || doc.updated_at)}</small></td>
                          <td className="py-3"><span className="small text-muted">{doc.retention || 'Standard (7 yrs)'}</span></td>
                          <td className="py-3">
                            <div className="d-flex gap-2">
                              <button className="btn btn-sm btn-light rounded-pill border px-3 fw-semibold" style={{ fontSize: '0.7rem' }} onClick={() => addNotification('Restore feature coming soon.', 'info')}><FontAwesomeIcon icon={faSync} className="me-1" /> Restore</button>
                              <button className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-semibold" style={{ fontSize: '0.7rem' }} onClick={() => addNotification('Permanent delete feature coming soon.', 'info')}><FontAwesomeIcon icon={faTrash} className="me-1" /> Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {(documents.length > 0 && viewMode !== 'folder' && viewMode !== 'timeline' && viewMode !== 'approval' && viewMode !== 'analytics' && viewMode !== 'archive') && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="d-flex align-items-center gap-2">
                <span className="small text-muted">
                  Page {currentPage} of {totalPages}
                </span>
                <select className="form-select form-select-sm border shadow-none rounded-pill px-3 bg-light" style={{ width: '80px', fontSize: '0.8rem' }} value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-light rounded-pill px-3 border" disabled={currentPage <= 1} onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
                  Previous
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const start = Math.max(1, currentPage - 2);
                  const page = start + i;
                  if (page > totalPages) return null;
                  return (
                    <button key={page} className={`btn btn-sm rounded-pill px-3 ${page === currentPage ? 'btn-primary' : 'btn-light border'}`} onClick={() => setCurrentPage(page)}>
                      {page}
                    </button>
                  );
                })}
                <button className="btn btn-sm btn-light rounded-pill px-3 border" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <div className={`dms-drawer-backdrop ${showDetailDrawer ? 'open' : ''}`} onClick={closeDetailDrawer} />
      <div className={`dms-drawer ${showDetailDrawer ? 'open' : ''}`}>
        {selectedDocument && (
          <>
            <div className="d-flex align-items-center justify-content-between p-4 border-bottom sticky-top bg-white" style={{ zIndex: 2 }}>
              <div className="d-flex align-items-center gap-3">
                <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: '44px', height: '44px', background: `${getFileColor(selectedDocument.file_type)}18` }}>
                  <FontAwesomeIcon icon={getFileIcon(selectedDocument.file_type)} style={{ color: getFileColor(selectedDocument.file_type), fontSize: '1.2rem' }} />
                </div>
                <div>
                  <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.95rem' }}>{selectedDocument.name || selectedDocument.file_name}</h6>
                  <div className="d-flex align-items-center gap-2 mt-1">
                    {selectedDocument.version && <span className="badge bg-light text-muted rounded-pill px-2" style={{ fontSize: '0.65rem' }}>v{selectedDocument.version}</span>}
                    {getStatusBadge(selectedDocument.status)}
                  </div>
                </div>
              </div>
              <button className="btn btn-light btn-sm rounded-circle border-0 shadow-none d-flex align-items-center justify-content-center" style={{ width: '34px', height: '34px' }} onClick={closeDetailDrawer}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <div className="px-4 py-3 border-bottom overflow-auto" style={{ whiteSpace: 'nowrap' }}>
              <div className="d-flex gap-1">
                {drawerTabs.map(tab => (
                  <button key={tab.id} className={`drawer-tab-btn ${drawerTab === tab.id ? 'active' : ''}`} onClick={() => setDrawerTab(tab.id)}>
                    <FontAwesomeIcon icon={tab.icon} className="me-1" /> {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4">
              {drawerTab === 'information' && (
                <div>
                  <h6 className="fw-bold text-dark mb-3">Document Information</h6>
                  <div className="d-flex flex-column gap-3">
                    <div className="row g-3">
                      <div className="col-6">
                        <span className="x-small text-muted text-uppercase fw-bold">File Type</span>
                        <p className="small fw-medium mb-0 mt-1">{getFileExt(selectedDocument.name || selectedDocument.file_name) || 'Unknown'}</p>
                      </div>
                      <div className="col-6">
                        <span className="x-small text-muted text-uppercase fw-bold">Size</span>
                        <p className="small fw-medium mb-0 mt-1">{formatFileSize(selectedDocument.file_size)}</p>
                      </div>
                      <div className="col-6">
                        <span className="x-small text-muted text-uppercase fw-bold">Created</span>
                        <p className="small fw-medium mb-0 mt-1">{formatDateTime(selectedDocument.created_at)}</p>
                      </div>
                      <div className="col-6">
                        <span className="x-small text-muted text-uppercase fw-bold">Modified</span>
                        <p className="small fw-medium mb-0 mt-1">{formatDateTime(selectedDocument.updated_at)}</p>
                      </div>
                      <div className="col-6">
                        <span className="x-small text-muted text-uppercase fw-bold">Owner</span>
                        <p className="small fw-medium mb-0 mt-1 d-flex align-items-center gap-2">
                          <FontAwesomeIcon icon={faUser} className="text-muted" />
                          {selectedDocument.owner?.name || selectedDocument.owner || 'Unknown'}
                        </p>
                      </div>
                      <div className="col-6">
                        <span className="x-small text-muted text-uppercase fw-bold">Department</span>
                        <p className="small fw-medium mb-0 mt-1 d-flex align-items-center gap-2">
                          <FontAwesomeIcon icon={faBuilding} className="text-muted" />
                          {selectedDocument.department || '-'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <span className="x-small text-muted text-uppercase fw-bold">Folder Path</span>
                      <p className="small fw-medium mb-0 mt-1">
                        {selectedDocument.folder_path || selectedFolder?.name || 'Root'}
                      </p>
                    </div>
                    {selectedDocument.tags && Array.isArray(selectedDocument.tags) && selectedDocument.tags.length > 0 && (
                      <div>
                        <span className="x-small text-muted text-uppercase fw-bold">Tags</span>
                        <div className="d-flex gap-1 mt-2 flex-wrap">
                          {selectedDocument.tags.map((tag, i) => (
                            <span key={i} className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2 fw-medium">{tag}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedDocument.description && (
                      <div>
                        <span className="x-small text-muted text-uppercase fw-bold">Description</span>
                        <p className="small text-muted mb-0 mt-1">{selectedDocument.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {drawerTab === 'preview' && (
                <div>
                  <h6 className="fw-bold text-dark mb-3">Preview</h6>
                  <div className="preview-placeholder" style={{ background: `linear-gradient(135deg, ${getFileColor(selectedDocument.file_type)}15, ${getFileColor(selectedDocument.file_type)}05)`, minHeight: '260px' }}>
                    <div className="d-flex align-items-center justify-content-center rounded-circle mb-2" style={{ width: '64px', height: '64px', background: `${getFileColor(selectedDocument.file_type)}22` }}>
                      <FontAwesomeIcon icon={getFileIcon(selectedDocument.file_type)} style={{ color: getFileColor(selectedDocument.file_type), fontSize: '1.8rem' }} />
                    </div>
                    <p className="fw-bold text-dark mb-1">{selectedDocument.name || selectedDocument.file_name}</p>
                    <span className="badge rounded-pill fw-bold px-3 py-2 mb-3" style={{ background: getFileColor(selectedDocument.file_type), color: '#fff' }}>
                      {getFileExt(selectedDocument.name || selectedDocument.file_name)}
                    </span>
                    <div>
                      <button className="btn btn-primary rounded-pill px-4 py-2 shadow-sm" onClick={() => handleDownloadDocument(selectedDocument)}>
                        <FontAwesomeIcon icon={faDownload} className="me-2" /> Open in Viewer
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {drawerTab === 'activity' && (
                <div>
                  <h6 className="fw-bold text-dark mb-3">Activity Log</h6>
                  {docAuditLogs.length === 0 ? (
                    <p className="text-muted small">No activity recorded yet.</p>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {docAuditLogs.map((log, i) => (
                        <div key={log.id || i} className="d-flex align-items-start gap-3 p-3 rounded-3 bg-light">
                          <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', minWidth: '32px' }}>
                            <FontAwesomeIcon icon={faHistory} style={{ fontSize: '0.75rem' }} />
                          </div>
                          <div>
                            <p className="small fw-medium mb-0">{log.action || log.event}</p>
                            <span className="x-small text-muted">{log.user?.name || log.user} &middot; {formatDateTime(log.created_at)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {drawerTab === 'versions' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold text-dark mb-0">Versions ({docVersions.length})</h6>
                    <button className="btn btn-sm btn-primary rounded-pill px-3" onClick={() => addNotification('Upload new version feature coming soon.', 'info')}>
                      <FontAwesomeIcon icon={faUpload} className="me-1" /> New Version
                    </button>
                  </div>
                  {docVersions.length === 0 ? (
                    <p className="text-muted small">No versions available.</p>
                  ) : (
                    <div className="version-timeline">
                      {docVersions.map((ver, i) => (
                        <div key={ver.id || i} className="version-timeline-item">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <p className="small fw-medium mb-0">v{ver.version || i + 1}</p>
                              <span className="x-small text-muted">{ver.user?.name || ver.user} &middot; {formatDateTime(ver.created_at)}</span>
                              {ver.notes && <p className="x-small text-muted mb-0 mt-1">{ver.notes}</p>}
                            </div>
                            <div className="d-flex gap-1">
                              <button className="btn btn-sm btn-light rounded-3 border px-2" title="Download" onClick={() => addNotification('Download version feature coming soon.', 'info')}>
                                <FontAwesomeIcon icon={faDownload} style={{ fontSize: '0.7rem' }} />
                              </button>
                              <button className="btn btn-sm btn-light rounded-3 border px-2" title="Restore" onClick={() => addNotification('Restore version feature coming soon.', 'info')}>
                                <FontAwesomeIcon icon={faSync} style={{ fontSize: '0.7rem' }} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {drawerTab === 'approvals' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold text-dark mb-0">Approvals</h6>
                    {selectedDocument.approval_status && (
                      <span className={`badge rounded-pill px-3 py-2 fw-semibold ${selectedDocument.approval_status === 'approved' ? 'bg-success bg-opacity-10 text-success' : selectedDocument.approval_status === 'rejected' ? 'bg-danger bg-opacity-10 text-danger' : 'bg-warning bg-opacity-10 text-warning'}`}>
                        {selectedDocument.approval_status.charAt(0).toUpperCase() + selectedDocument.approval_status.slice(1)}
                      </span>
                    )}
                  </div>
                  {docApprovals.length === 0 ? (
                    <p className="text-muted small">No approval requests yet.</p>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {docApprovals.map((app, i) => (
                        <div key={app.id || i} className="p-3 rounded-3 bg-light d-flex justify-content-between align-items-center">
                          <div>
                            <p className="small fw-medium mb-0">{app.approver?.name || app.approver}</p>
                            <span className="x-small text-muted">{formatDateTime(app.created_at)}</span>
                          </div>
                          <span className={`badge rounded-pill px-3 py-1 fw-semibold ${app.status === 'approved' ? 'bg-success bg-opacity-10 text-success' : app.status === 'rejected' ? 'bg-danger bg-opacity-10 text-danger' : 'bg-warning bg-opacity-10 text-warning'}`}>
                            {app.status ? app.status.charAt(0).toUpperCase() + app.status.slice(1) : 'Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {drawerTab === 'signatures' && (
                <div>
                  <h6 className="fw-bold text-dark mb-3">Signatures</h6>
                  {docSignatures.length === 0 ? (
                    <p className="text-muted small">No signatures requested.</p>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {docSignatures.map((sig, i) => (
                        <div key={sig.id || i} className="p-3 rounded-3 bg-light d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center gap-3">
                            <div className="rounded-circle bg-purple bg-opacity-10 text-purple d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
                              <FontAwesomeIcon icon={faFileSignature} style={{ color: '#7c3aed' }} />
                            </div>
                            <div>
                              <p className="small fw-medium mb-0">{sig.signer?.name || sig.signer}</p>
                              <span className="x-small text-muted">{sig.email || ''}</span>
                            </div>
                          </div>
                          <span className={`badge rounded-pill px-3 py-1 fw-semibold ${sig.status === 'signed' ? 'bg-success bg-opacity-10 text-success' : sig.status === 'declined' ? 'bg-danger bg-opacity-10 text-danger' : 'bg-warning bg-opacity-10 text-warning'}`}>
                            {sig.status ? sig.status.charAt(0).toUpperCase() + sig.status.slice(1) : 'Pending'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {drawerTab === 'comments' && (
                <div>
                  <h6 className="fw-bold text-dark mb-3">Comments ({docComments.length})</h6>
                  <div className="d-flex flex-column gap-3 mb-4">
                    {docComments.length === 0 ? (
                      <p className="text-muted small">No comments yet.</p>
                    ) : (
                      docComments.map((comment, i) => (
                        <div key={comment.id || i} className="d-flex gap-3">
                          <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center fw-bold" style={{ width: '36px', height: '36px', minWidth: '36px', fontSize: '0.75rem' }}>
                            {comment.user?.name?.[0] || 'U'}
                          </div>
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <span className="small fw-bold">{comment.user?.name || comment.user || 'User'}</span>
                              <span className="x-small text-muted">{formatDateTime(comment.created_at)}</span>
                            </div>
                            <p className="small text-muted mb-0">{comment.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      className="form-control form-control-sm border shadow-none rounded-pill bg-light"
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    />
                    <button className="btn btn-sm btn-primary rounded-pill px-3" onClick={handleAddComment} disabled={!newComment.trim()}>
                      <FontAwesomeIcon icon={faPaperclip} />
                    </button>
                  </div>
                </div>
              )}

              {drawerTab === 'sharing' && (
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h6 className="fw-bold text-dark mb-0">Shared Links</h6>
                    <button className="btn btn-sm btn-primary rounded-pill px-3" onClick={() => addNotification('Generate share link feature coming soon.', 'info')}>
                      <FontAwesomeIcon icon={faShare} className="me-1" /> Generate Link
                    </button>
                  </div>
                  {docShares.length === 0 ? (
                    <p className="text-muted small">No shared links yet.</p>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {docShares.map((share, i) => (
                        <div key={share.id || i} className="p-3 rounded-3 bg-light d-flex justify-content-between align-items-center">
                          <div>
                            <p className="small fw-medium mb-0">{share.recipient?.name || share.recipient || 'Shared link'}</p>
                            <span className="x-small text-muted">
                              {share.permission || 'View'} &middot; Expires: {share.expires_at ? formatDate(share.expires_at) : 'Never'}
                            </span>
                          </div>
                          <button className="btn btn-sm btn-outline-danger rounded-3 px-2" onClick={() => addNotification('Revoke share feature coming soon.', 'info')}>
                            <FontAwesomeIcon icon={faTimes} style={{ fontSize: '0.7rem' }} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {drawerTab === 'permissions' && (
                <div>
                  <h6 className="fw-bold text-dark mb-3">Access Permissions</h6>
                  <div className="d-flex flex-column gap-3">
                    <div>
                      <span className="x-small text-muted text-uppercase fw-bold">Access Level</span>
                      <select className="form-select form-select-sm border shadow-none rounded-pill mt-2 bg-light" value={selectedDocument.access_level || 'private'} onChange={() => addNotification('Permission change feature coming soon.', 'info')}>
                        {accessLevelOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span className="x-small text-muted text-uppercase fw-bold">Owner</span>
                      <p className="small fw-medium mb-0 mt-1">{selectedDocument.owner?.name || selectedDocument.owner || 'Unknown'}</p>
                    </div>
                    <button className="btn btn-sm btn-outline-primary rounded-pill px-4 mt-2" onClick={() => addNotification('Manage advanced permissions feature coming soon.', 'info')}>
                      <FontAwesomeIcon icon={faCog} className="me-1" /> Advanced Permissions
                    </button>
                  </div>
                </div>
              )}

              {drawerTab === 'attachments' && (
                <div>
                  <h6 className="fw-bold text-dark mb-3"><FontAwesomeIcon icon={faPaperclip} className="me-2 text-primary" />Attachments</h6>
                  {(!selectedDocument.attachments || selectedDocument.attachments.length === 0) ? (
                    <div className="text-center py-5">
                      <FontAwesomeIcon icon={faPaperclip} className="text-muted mb-3" style={{ fontSize: '2.5rem', opacity: 0.4 }} />
                      <p className="text-muted small mb-3">No attachments for this document.</p>
                      <button className="btn btn-sm btn-primary rounded-pill px-4 fw-semibold" onClick={() => addNotification('Add attachment feature coming soon.', 'info')}>
                        <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Attachment
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {selectedDocument.attachments.map((att, i) => (
                        <div key={att.id || i} className="d-flex align-items-center gap-3 p-2 rounded-3 bg-light">
                          <FontAwesomeIcon icon={faFile} className="text-muted" />
                          <div className="flex-grow-1">
                            <p className="small fw-semibold mb-0">{att.name}</p>
                            <small className="text-muted">{att.size || '—'} | {att.created_at ? new Date(att.created_at).toLocaleDateString() : ''}</small>
                          </div>
                          <FontAwesomeIcon icon={faDownload} className="text-primary cursor-pointer" style={{ fontSize: '0.8rem' }} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {drawerTab === 'linkedRecords' && (
                <div>
                  <h6 className="fw-bold text-dark mb-3"><FontAwesomeIcon icon={faLink} className="me-2 text-primary" />Linked Records</h6>
                  <div className="d-flex flex-column gap-2 mb-3">
                    <div className="p-3 rounded-3 bg-light d-flex align-items-center gap-3">
                      <FontAwesomeIcon icon={faBuilding} className="text-info" />
                      <div className="flex-grow-1">
                        <p className="small fw-semibold mb-0">Related Project</p>
                        <small className="text-muted">{selectedDocument.project || '—'}</small>
                      </div>
                      <button className="btn btn-sm btn-light rounded-pill border fw-semibold" style={{ fontSize: '0.7rem' }} onClick={() => addNotification('Link project feature coming soon.', 'info')}>Link</button>
                    </div>
                    <div className="p-3 rounded-3 bg-light d-flex align-items-center gap-3">
                      <FontAwesomeIcon icon={faUser} className="text-success" />
                      <div className="flex-grow-1">
                        <p className="small fw-semibold mb-0">Related Client</p>
                        <small className="text-muted">{selectedDocument.client || '—'}</small>
                      </div>
                      <button className="btn btn-sm btn-light rounded-pill border fw-semibold" style={{ fontSize: '0.7rem' }} onClick={() => addNotification('Link client feature coming soon.', 'info')}>Link</button>
                    </div>
                  </div>
                  <button className="btn btn-sm btn-outline-primary rounded-pill px-4 fw-semibold w-100" onClick={() => addNotification('Manage linked records feature coming soon.', 'info')}>
                    <FontAwesomeIcon icon={faPlus} className="me-1" /> Link New Record
                  </button>
                </div>
              )}

              {drawerTab === 'auditTrail' && (
                <div>
                  <h6 className="fw-bold text-dark mb-3"><FontAwesomeIcon icon={faClipboardList} className="me-2 text-primary" />Audit Trail</h6>
                  <div className="version-timeline">
                    {(selectedDocument.audit_logs || selectedDocument.activity || []).length === 0 ? (
                      <div className="text-center py-4">
                        <FontAwesomeIcon icon={faClipboardList} className="text-muted mb-2" style={{ fontSize: '2rem', opacity: 0.4 }} />
                        <p className="text-muted small mb-0">No audit events recorded yet.</p>
                      </div>
                    ) : (
                      (selectedDocument.audit_logs || selectedDocument.activity || []).slice(0, 5).map((event, i) => (
                        <div key={event.id || i} className="version-timeline-item">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <span className="small fw-semibold text-dark text-capitalize">{event.action || event.event || event.type}</span>
                              <p className="x-small text-muted mb-0">{event.description || event.details || ''}</p>
                            </div>
                            <small className="text-muted" style={{ fontSize: '0.65rem' }}>{event.created_at ? new Date(event.created_at).toLocaleDateString() : ''}</small>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <button className="btn btn-sm btn-outline-primary rounded-pill px-4 fw-semibold w-100 mt-3" onClick={() => addNotification('Full audit log feature coming soon.', 'info')}>
                    <FontAwesomeIcon icon={faClipboardList} className="me-1" /> View Full Audit Log
                  </button>
                </div>
              )}

              {drawerTab === 'relatedDocuments' && (
                <div>
                  <h6 className="fw-bold text-dark mb-3"><FontAwesomeIcon icon={faFolderOpen} className="me-2 text-primary" />Related Documents</h6>
                  {(selectedDocument.related_docs || []).length === 0 ? (
                    <div className="text-center py-4">
                      <FontAwesomeIcon icon={faFolderOpen} className="text-muted mb-2" style={{ fontSize: '2rem', opacity: 0.4 }} />
                      <p className="text-muted small mb-0">No related documents found in this folder.</p>
                      <small className="text-muted">Documents in the same folder or with matching tags appear here.</small>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-2">
                      {selectedDocument.related_docs.map((rd, i) => (
                        <div key={rd.id || i} className="d-flex align-items-center gap-3 p-2 rounded-3 bg-light cursor-pointer" onClick={() => addNotification('Navigate to related doc coming soon.', 'info')}>
                          <FontAwesomeIcon icon={faFile} className="text-muted" />
                          <div className="flex-grow-1">
                            <p className="small fw-semibold mb-0">{rd.name || rd.file_name}</p>
                            <small className="text-muted">{rd.type || ''} &middot; {rd.updated_at ? new Date(rd.updated_at).toLocaleDateString() : ''}</small>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <DialogBox show={showUploadModal} onHide={() => { setShowUploadModal(false); resetUploadForm(); }} title="Upload Document" size="medium">
        <div
          className={`dropzone ${uploadDragOver ? 'drag-over' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setUploadDragOver(true); }}
          onDragLeave={() => setUploadDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setUploadDragOver(false); const file = e.dataTransfer.files[0]; if (file) { setUploadFileObj(file); setUploadDocName(file.name.replace(/\.[^/.]+$/, '')); } }}
          onClick={() => document.getElementById('dms-file-input')?.click()}
        >
          <input type="file" id="dms-file-input" className="d-none" onChange={(e) => { const file = e.target.files[0]; if (file) { setUploadFileObj(file); setUploadDocName(file.name.replace(/\.[^/.]+$/, '')); } }} />
          {uploadFileObj ? (
            <div>
              <FontAwesomeIcon icon={faFile} className="text-primary fs-1 mb-2" />
              <p className="fw-bold text-dark mb-1">{uploadFileObj.name}</p>
              <p className="x-small text-muted">{formatFileSize(uploadFileObj.size)}</p>
              <button className="btn btn-sm btn-light rounded-pill border mt-2" onClick={(e) => { e.stopPropagation(); setUploadFileObj(null); }}>
                <FontAwesomeIcon icon={faXmark} className="me-1" /> Remove
              </button>
            </div>
          ) : (
            <div>
              <FontAwesomeIcon icon={faArrowUpFromBracket} className="text-muted fs-1 mb-2" />
              <p className="fw-bold text-dark mb-1">Drop files here or click to browse</p>
              <p className="x-small text-muted">Supports PDF, Word, Excel, Images, and more</p>
            </div>
          )}
        </div>
        {uploadProgress > 0 && (
          <div className="mt-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="x-small fw-medium text-muted">Uploading...</span>
              <span className="x-small fw-bold text-primary">{uploadProgress}%</span>
            </div>
            <div className="progress" style={{ height: '6px', borderRadius: '10px' }}>
              <div className="progress-bar" role="progressbar" style={{ width: `${uploadProgress}%`, background: 'linear-gradient(90deg, #6366f1, #818cf8)', borderRadius: '10px' }}></div>
            </div>
          </div>
        )}
        <div className="mt-3 d-flex flex-column gap-3">
          <div>
            <label className="x-small fw-bold text-muted text-uppercase mb-1">Document Name</label>
            <input type="text" className="form-control form-control-sm border shadow-none rounded-pill bg-light" value={uploadDocName} onChange={(e) => setUploadDocName(e.target.value)} placeholder="Enter document name" />
          </div>
          <div>
            <label className="x-small fw-bold text-muted text-uppercase mb-1">Folder</label>
            <select className="form-select form-select-sm border shadow-none rounded-pill bg-light" value={uploadFolder} onChange={(e) => setUploadFolder(e.target.value)}>
              <option value="">Root</option>
              {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div>
            <label className="x-small fw-bold text-muted text-uppercase mb-1">Tags (comma separated)</label>
            <input type="text" className="form-control form-control-sm border shadow-none rounded-pill bg-light" value={uploadTags} onChange={(e) => setUploadTags(e.target.value)} placeholder="e.g. contract, signed" />
          </div>
          <div>
            <label className="x-small fw-bold text-muted text-uppercase mb-1">Description</label>
            <textarea className="form-control form-control-sm border shadow-none rounded-3 bg-light" rows={3} value={uploadDesc} onChange={(e) => setUploadDesc(e.target.value)} placeholder="Optional description" />
          </div>
        </div>
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button className="btn btn-light rounded-pill px-4 py-2 border fw-semibold" onClick={() => { setShowUploadModal(false); resetUploadForm(); }}>Cancel</button>
          <button className="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm" onClick={handleUpload} disabled={!uploadFileObj || uploadProgress > 0}>
            <FontAwesomeIcon icon={faArrowUpFromBracket} className="me-2" />{uploadProgress > 0 ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </DialogBox>

      <DialogBox show={showCreateFolderModal} onHide={() => setShowCreateFolderModal(false)} title="Create Folder" size="small">
        <div className="d-flex flex-column gap-3">
          <div>
            <label className="x-small fw-bold text-muted text-uppercase mb-1">Folder Name</label>
            <input type="text" className="form-control form-control-sm border shadow-none rounded-pill bg-light" value={folderName} onChange={(e) => setFolderName(e.target.value)} placeholder="Enter folder name" />
          </div>
          <div>
            <label className="x-small fw-bold text-muted text-uppercase mb-1">Description</label>
            <textarea className="form-control form-control-sm border shadow-none rounded-3 bg-light" rows={2} value={folderDesc} onChange={(e) => setFolderDesc(e.target.value)} placeholder="Optional" />
          </div>
          <div>
            <label className="x-small fw-bold text-muted text-uppercase mb-1">Color</label>
            <div className="d-flex gap-2 mt-1 flex-wrap">
              {colorOptions.map(c => (
                <span key={c} className={`color-picker-circle ${folderColor === c ? 'selected' : ''}`} style={{ backgroundColor: c }} onClick={() => setFolderColor(c)} />
              ))}
            </div>
          </div>
          <div>
            <label className="x-small fw-bold text-muted text-uppercase mb-1">Access Level</label>
            <select className="form-select form-select-sm border shadow-none rounded-pill bg-light" value={folderAccess} onChange={(e) => setFolderAccess(e.target.value)}>
              {accessLevelOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div>
            <label className="x-small fw-bold text-muted text-uppercase mb-1">Parent Folder (optional)</label>
            <select className="form-select form-select-sm border shadow-none rounded-pill bg-light" value={folderParent} onChange={(e) => setFolderParent(e.target.value)}>
              <option value="">None (Root)</option>
              {folders.filter(f => f.id !== selectedFolder?.id).map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
        </div>
        <div className="d-flex justify-content-end gap-2 mt-4">
          <button className="btn btn-light rounded-pill px-4 py-2 border fw-semibold" onClick={() => setShowCreateFolderModal(false)}>Cancel</button>
          <button className="btn btn-primary rounded-pill px-4 py-2 fw-semibold shadow-sm" onClick={handleCreateFolder}>
            <FontAwesomeIcon icon={faFolderPlus} className="me-2" /> Create
          </button>
        </div>
      </DialogBox>

      <DialogBox show={deleteConfirm !== null} onHide={() => setDeleteConfirm(null)} size="small">
        <div className="text-center py-2">
          <div className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10" style={{ width: '72px', height: '72px' }}>
            <FontAwesomeIcon icon={faTrash} className="text-danger fs-3" />
          </div>
          <h5 className="fw-bold mb-2">Delete Document</h5>
          <p className="text-muted small mb-0 px-3">Are you sure you want to delete this document? This action cannot be undone.</p>
        </div>
        <div className="d-flex gap-3 mt-4">
          <button className="btn btn-light rounded-pill px-4 py-2 fw-semibold flex-grow-1" onClick={() => setDeleteConfirm(null)}>
            <FontAwesomeIcon icon={faXmark} className="me-2" /> Cancel
          </button>
          <button className="btn btn-danger rounded-pill px-4 py-2 fw-semibold flex-grow-1 shadow-sm" onClick={() => handleDeleteDocument(deleteConfirm)}>
            <FontAwesomeIcon icon={faTrash} className="me-2" /> Delete
          </button>
        </div>
      </DialogBox>

      <DialogBox show={folderDeleteConfirm !== null} onHide={() => setFolderDeleteConfirm(null)} size="small">
        <div className="text-center py-2">
          <div className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle bg-danger bg-opacity-10" style={{ width: '72px', height: '72px' }}>
            <FontAwesomeIcon icon={faTrash} className="text-danger fs-3" />
          </div>
          <h5 className="fw-bold mb-2">Delete Folder</h5>
          <p className="text-muted small mb-0 px-3">Are you sure you want to delete this folder and all its contents? All documents inside will also be permanently deleted. This action cannot be undone.</p>
        </div>
        <div className="d-flex gap-3 mt-4">
          <button className="btn btn-light rounded-pill px-4 py-2 fw-semibold flex-grow-1" onClick={() => setFolderDeleteConfirm(null)}>
            <FontAwesomeIcon icon={faXmark} className="me-2" /> Cancel
          </button>
          <button className="btn btn-danger rounded-pill px-4 py-2 fw-semibold flex-grow-1 shadow-sm" onClick={() => handleDeleteFolder(folderDeleteConfirm)}>
            <FontAwesomeIcon icon={faTrash} className="me-2" /> Delete Folder
          </button>
        </div>
      </DialogBox>

      {selectedDocuments.size > 0 && (
        <div className={`bulk-bar ${selectedDocuments.size > 0 ? 'show' : ''}`}>
          <div className="d-flex align-items-center justify-content-between">
            <span className="small fw-bold text-dark">
              <FontAwesomeIcon icon={faListCheck} className="me-2 text-primary" />
              {selectedDocuments.size} document(s) selected
            </span>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-light rounded-pill px-3 border" onClick={() => setSelectedDocuments(new Set())}>
                <FontAwesomeIcon icon={faXmark} className="me-1" /> Clear
              </button>
              <button className="btn btn-sm btn-primary rounded-pill px-3" onClick={() => handleBulkAction('download')}>
                <FontAwesomeIcon icon={faDownload} className="me-1" /> Download
              </button>
              <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={() => handleBulkAction('archive')}>
                <FontAwesomeIcon icon={faArchive} className="me-1" /> Archive
              </button>
              <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => handleBulkAction('delete')}>
                <FontAwesomeIcon icon={faTrash} className="me-1" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DmsDocuments;
