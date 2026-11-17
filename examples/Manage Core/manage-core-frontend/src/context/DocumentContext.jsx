import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { documents as initialDocuments } from '../data/documents';
import { folders as initialFolders } from '../data/folders';

export const DocumentContext = createContext(null);

export const useDocumentContext = () => {
  const ctx = useContext(DocumentContext);
  if (!ctx) throw new Error('useDocumentContext must be used within DocumentProvider');
  return ctx;
};

export const DocumentProvider = ({ children }) => {
  const [documents, setDocuments] = useState(initialDocuments);
  const [folders, setFolders] = useState(initialFolders);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentCategory, setCurrentCategory] = useState('my');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedDocument, setSelectedDocument] = useState(null);

  const addDocument = useCallback((doc) => setDocuments(prev => [...prev, { ...doc, id: Date.now() }]), []);
  const updateDocument = useCallback((id, updates) => setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, ...updates } : doc)), []);
  const deleteDocument = useCallback((id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    setSelectedDocument(prev => prev?.id === id ? null : prev);
  }, []);
  const moveToTrash = useCallback((id) => {
    setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, isTrash: true } : doc));
    setSelectedDocument(prev => prev?.id === id ? null : prev);
  }, []);
  const restoreDocument = useCallback((id) => setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, isTrash: false } : doc)), []);
  const toggleFavorite = useCallback((id) => setDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, isFavorite: !doc.isFavorite } : doc)), []);
  const addFolder = useCallback((folder) => setFolders(prev => [...prev, { ...folder, id: Date.now(), created: new Date().toISOString(), modified: new Date().toISOString() }]), []);
  const updateFolder = useCallback((id, updates) => setFolders(prev => prev.map(f => f.id === id ? { ...f, ...updates, modified: new Date().toISOString() } : f)), []);
  const deleteFolder = useCallback((id) => {
    setDocuments(prev => prev.map(doc => doc.folderId === id ? { ...doc, folderId: null } : doc));
    setFolders(prev => prev.filter(f => f.id !== id));
  }, []);
  const moveDocumentToFolder = useCallback((documentId, folderId) => updateDocument(documentId, { folderId }), [updateDocument]);
  const getFoldersForParent = useCallback((parentId) => folders.filter(f => f.parentId === parentId), [folders]);

  const value = useMemo(() => ({
    documents, folders, currentFolder, setCurrentFolder,
    currentCategory, setCurrentCategory, searchQuery, setSearchQuery,
    filterType, setFilterType, viewMode, setViewMode,
    selectedDocument, setSelectedDocument,
    addDocument, updateDocument, deleteDocument, moveToTrash,
    restoreDocument, toggleFavorite, addFolder, updateFolder,
    deleteFolder, moveDocumentToFolder, getFoldersForParent,
  }), [
    documents, folders, currentFolder, currentCategory, searchQuery,
    filterType, viewMode, selectedDocument,
    addDocument, updateDocument, deleteDocument, moveToTrash,
    restoreDocument, toggleFavorite, addFolder, updateFolder,
    deleteFolder, moveDocumentToFolder, getFoldersForParent,
  ]);

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};
