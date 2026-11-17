import { useState } from 'react';
import { useApp } from '../context/AppContext';

export const useUpload = () => {
  const { addDocument } = useApp();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFiles = async (files) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    setProgress(0);

    const fileList = Array.from(files);
    const newDocs = fileList.map(file => ({
      name: file.name,
      type: file.name.split('.').pop().toLowerCase(),
      size: file.size,
      modified: new Date().toISOString(),
      owner: 'me',
      tags: [],
      url: URL.createObjectURL(file),
      folderId: null,
      isFavorite: false,
      isShared: false,
    }));

    // Simulate upload progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        newDocs.forEach(doc => addDocument(doc));
        setUploading(false);
        setProgress(0);
      }
    }, 200);
  };

  return {
    uploadFiles,
    uploading,
    progress,
  };
};