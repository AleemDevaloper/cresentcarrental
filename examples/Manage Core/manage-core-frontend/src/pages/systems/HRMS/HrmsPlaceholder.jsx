import React from 'react';
import EnterpriseFeatureWorkspace from '../common/EnterpriseFeatureWorkspace';

const HrmsPlaceholder = ({ title, icon, feature }) => {
  const fallback = {
    id: `hrms_${String(title || 'feature').toLowerCase().replace(/[^a-z0-9]+/g, '_')}`,
    label: title || 'HRMS Feature',
    description: `Manage ${title || 'HRMS feature'} records, approvals, exports, and employee workflow notes.`,
    icon: 'users',
    category: 'HRMS',
  };

  return <EnterpriseFeatureWorkspace system="hrms" feature={feature || fallback} />;
};

export default HrmsPlaceholder;
