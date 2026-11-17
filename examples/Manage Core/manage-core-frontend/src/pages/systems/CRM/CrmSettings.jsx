import React, { useState } from 'react';
import ErpPageShell from '../../../components/ui/ux/ErpPageShell';
import {
  faCogs, faBuilding, faEnvelope, faUsers, faPlug, faShield,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

const sections = [
  { id: 'general', label: 'General', icon: faCogs, path: '/systems/crm/settings/general' },
  { id: 'leads', label: 'Lead Settings', icon: faUsers, path: '/systems/crm/settings/leads' },
  { id: 'deals', label: 'Deal Settings', icon: faPlug, path: '/systems/crm/settings/deals' },
  { id: 'pipelines', label: 'Pipelines', icon: faBuilding, path: '/systems/crm/settings/pipelines' },
  { id: 'email', label: 'Email Settings', icon: faEnvelope, path: '/systems/crm/settings/email' },
  { id: 'permissions', label: 'Permissions', icon: faShield, path: '/systems/crm/settings/permissions' },
  { id: 'workflows', label: 'Workflows', icon: faPlug, path: '/systems/crm/settings/workflows' },
];

const CrmSettings = () => {
  return (
    <ErpPageShell
      icon={faCogs}
      title="CRM Settings"
      description="Configure CRM behavior, defaults and integrations."
    >
      <div className="row g-3">
        {sections.map(s => (
          <div key={s.id} className="col-md-4">
            <Link to={s.path} className="text-decoration-none">
              <div className="glass-card p-3" style={{ cursor: 'pointer' }}>
                <div className="d-flex align-items-center gap-3">
                  <div style={{
                    width: 42, height: 42, borderRadius: '10px',
                    background: 'rgba(99,102,241,0.1)', color: '#6366f1',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <FontAwesomeIcon icon={s.icon} />
                  </div>
                  <div>
                    <strong>{s.label}</strong>
                    <div className="small">Configure {s.label.toLowerCase()}</div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </ErpPageShell>
  );
};

export default CrmSettings;