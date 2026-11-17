import React from 'react';
import ModuleTrashPage from '../../../components/common/ModuleTrashPage';

const MfgTrash = ({ isDark }) => (
  <ModuleTrashPage
    system="mfg"
    isDark={isDark}
    title="Manufacturing Trash"
    subtitle="Recover soft-deleted BOMs, production orders, and work orders."
    accent="#0891b2"
  />
);

export default MfgTrash;
