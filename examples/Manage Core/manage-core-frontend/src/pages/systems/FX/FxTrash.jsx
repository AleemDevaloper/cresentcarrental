import React from 'react';
import ModuleTrashPage from '../../../components/common/ModuleTrashPage';

const FxTrash = ({ isDark }) => (
  <ModuleTrashPage
    system="fx"
    isDark={isDark}
    title="FX Trash"
    subtitle="Recover soft-deleted currencies, exchange rates, transactions, and revaluations."
    accent="#8b5cf6"
  />
);

export default FxTrash;
