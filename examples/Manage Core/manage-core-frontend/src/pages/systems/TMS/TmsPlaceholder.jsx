import React from 'react';
import EnterpriseFeatureWorkspace from '../common/EnterpriseFeatureWorkspace';

const TmsPlaceholder = ({ title, icon, feature }) => {
  const fallback = {
    id: `tms_${String(title || 'feature').toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
    label: title || 'Task Feature',
    description: `Manage ${title || 'task feature'} records, productivity status, exports, and recovery.`,
    icon: 'tasks',
    category: 'TMS',
  };

  return <EnterpriseFeatureWorkspace system="tms" feature={feature || fallback} />;
};

export default TmsPlaceholder;
