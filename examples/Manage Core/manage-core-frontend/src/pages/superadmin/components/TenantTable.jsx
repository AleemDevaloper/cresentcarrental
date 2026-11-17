import React, { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faCheckCircle, faExternalLinkAlt, faSearch, faCogs, faPen, faTrash, faPalette, faLock } from "@fortawesome/free-solid-svg-icons";

const TenantTable = ({ tenants, onToggleStatus, onToggleSandbox, onEditSystems, onDelete, onEdit, onBranding, onSecurity, isDark }) => {
  const baseDomain = import.meta.env.VITE_TENANT_BASE_DOMAIN || window.location.hostname.split('.').slice(-2).join('.');
  const columns = useMemo(
    () => [
      {
        header: 'Company Name',
        accessorKey: 'name',
        cell: ({ row }) => (
          <div className="py-2">
            <span className="fw-bold d-block text-dark-emphasis">{row.original.name}</span>
            <small className="text-muted" style={{ fontSize: '11px' }}>Provisioned: {row.original.date}</small>
          </div>
        ),
      },
      {
        header: 'Subdomain',
        accessorKey: 'subdomain',
        cell: ({ row }) => (
          <div className="d-flex align-items-center gap-2">
            <code className="text-primary font-monospace bg-primary bg-opacity-10 px-2 py-1 rounded" style={{ fontSize: '12px' }}>
              {row.original.customDomain || `${row.original.subdomain}.${baseDomain}`}
            </code>
            <a href={`${window.location.protocol}//${row.original.customDomain || `${row.original.subdomain}.${baseDomain}`}/login`} target="_blank" rel="noopener noreferrer" className="text-muted hover-text-primary transition-colors">
              <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: '10px' }} />
            </a>
          </div>
        ),
      },
      {
        header: 'Systems',
        accessorKey: 'modules',
        cell: ({ row }) => (
          <div className="d-flex flex-wrap gap-1">
            {row.original.modules.map(mod => (
              <span key={mod} className="badge bg-secondary bg-opacity-10 text-secondary border-0 px-2.5 py-1 rounded fw-bold" style={{ fontSize: '10px' }}>
                {mod}
              </span>
            ))}
            <button 
              className="btn btn-sm btn-link p-0 ms-1 text-primary" 
              onClick={() => onEditSystems(row.original)}
              title="Edit Systems"
            >
              <FontAwesomeIcon icon={faCogs} style={{ fontSize: '10px' }} />
            </button>
          </div>
        ),
      },
      {
        header: 'Environment',
        accessorKey: 'sandbox',
        cell: ({ row }) => (
          <button 
            className={`btn btn-sm rounded-pill px-3 py-1 fw-bold transition-all ${row.original.sandbox ? 'btn-outline-warning' : 'btn-outline-primary'}`} 
            style={{ fontSize: '10px' }}
            onClick={() => onToggleSandbox(row.original.id)}
          >
            {row.original.sandbox ? 'Sandbox' : 'Production'}
          </button>
        ),
      },
      {
        header: 'Billing',
        accessorKey: 'plan',
        cell: ({ row }) => (
          <span className="badge text-white px-3 py-1.5 rounded-pill fw-bold" style={{ fontSize: '11px', backgroundColor: 'rgba(0, 4, 255, 0.46)'}}>
            {row.original.plan}
          </span>
        ),
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => (
          <span className={`badge bg-${row.original.status === 'Active' ? 'success' : 'danger'}-subtle text-${row.original.status === 'Active' ? 'success' : 'danger'} rounded-pill px-3 py-1.5 fw-bold`} style={{ fontSize: '11px' }}>
            {row.original.status}
          </span>
        ),
      },
      {
        header: 'Actions',
        id: 'actions',
        cell: ({ row }) => (
          <div className="d-flex gap-1">
            <button 
              className={`btn btn-sm rounded-circle ${row.original.status === 'Active' ? 'btn-outline-danger' : 'btn-outline-success'} transition-all hover-scale d-flex align-items-center justify-content-center`} 
              style={{ width: '32px', height: '32px' }}
              title={row.original.status === 'Active' ? 'Suspend' : 'Activate'}
              onClick={() => onToggleStatus(row.original.id)}
            >
              <FontAwesomeIcon icon={row.original.status === 'Active' ? faBan : faCheckCircle} />
            </button>
            <button 
              className="btn btn-sm btn-outline-primary rounded-circle transition-all hover-scale d-flex align-items-center justify-content-center" 
              style={{ width: '32px', height: '32px' }}
              title="Edit Tenant"
              onClick={() => onEdit(row.original)}
            >
              <FontAwesomeIcon icon={faPen} />
            </button>
            <button 
              className="btn btn-sm btn-outline-danger rounded-circle transition-all hover-scale d-flex align-items-center justify-content-center" 
              style={{ width: '32px', height: '32px' }}
              title="Delete Tenant"
              onClick={() => onDelete(row.original.id)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button 
              className="btn btn-sm btn-outline-warning rounded-circle transition-all hover-scale d-flex align-items-center justify-content-center" 
              style={{ width: '32px', height: '32px' }}
              title="Branding"
              onClick={() => onBranding && onBranding(row.original)}
            >
              <FontAwesomeIcon icon={faPalette} />
            </button>
            <button 
              className="btn btn-sm btn-outline-secondary rounded-circle transition-all hover-scale d-flex align-items-center justify-content-center" 
              style={{ width: '32px', height: '32px' }}
              title="Security"
              onClick={() => onSecurity && onSecurity(row.original)}
            >
              <FontAwesomeIcon icon={faLock} />
            </button>
          </div>
        ),
      },
    ],
    [baseDomain, onToggleStatus, onToggleSandbox, onEditSystems, onDelete, onEdit, onBranding, onSecurity]
  );

  const table = useReactTable({
    data: tenants,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className={`card border-0 shadow-sm rounded-4 overflow-hidden ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}
      style={{
        background: isDark ? 'rgba(30, 41, 59, 0.7)' : '#ffffff',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="card-header bg-transparent border-0 p-4 d-flex justify-content-between align-items-center">
        <h5 className="fw-bold mb-0">Active Isolated Databases</h5>
        <div className="input-group input-group-sm" style={{ width: '240px' }}>
          <span className="input-group-text bg-light border-0 px-3 rounded-start-pill">
            <FontAwesomeIcon icon={faSearch} className="text-muted" />
          </span>
          <input 
            type="text" 
            className="form-control bg-light border-0 rounded-end-pill px-0" 
            placeholder="Search tenants..." 
            style={{ fontSize: '12px' }}
          />
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id} className="border-bottom text-muted small text-uppercase" style={{ fontSize: '10px', letterSpacing: '0.08em' }}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-4 py-3 fw-black">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-bottom transition-all hover-bg-light">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3 border-0">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="card-footer bg-transparent border-0 p-4 d-flex justify-content-between align-items-center">
        <span className="text-muted small">Showing {tenants.length} enterprise clusters</span>
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-light rounded-pill px-3 disabled">Previous</button>
          <button className="btn btn-sm btn-light rounded-pill px-3 disabled">Next</button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hover-bg-light:hover {
          background-color: ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'} !important;
        }
        .text-indigo { color: #6366f1; }
        .bg-indigo { background-color: #6366f1; }
      `}} />
    </div>
  );
};

export default TenantTable;
