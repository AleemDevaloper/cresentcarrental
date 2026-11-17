import React from 'react';
import EnterpriseFeatureWorkspace from '../common/EnterpriseFeatureWorkspace';

const FmsPlaceholder = ({ title, icon, feature }) => {
  const fallback = {
    id: `fms_${String(title || 'feature').toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
    label: title || 'Finance Feature',
    description: `Manage ${title || 'finance feature'} records, approvals, exports, and documentation.`,
    icon: 'chart',
    category: 'Finance',
  };

  return <EnterpriseFeatureWorkspace system="fms" feature={feature || fallback} />;
};

export default FmsPlaceholder;
