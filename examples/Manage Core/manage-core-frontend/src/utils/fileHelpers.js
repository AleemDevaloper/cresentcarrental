export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const getFileIcon = (type) => {
  const icons = {
    pdf: '📄',
    image: '🖼️',
    xlsx: '📊',
    docx: '📝',
    txt: '📄',
    default: '📄',
  };
  return icons[type] || icons.default;
};

export const isImage = (type) => type.startsWith('image');
export const isPdf = (type) => type === 'pdf';