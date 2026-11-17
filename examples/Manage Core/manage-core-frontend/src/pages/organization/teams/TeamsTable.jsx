import React, { useMemo } from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsisVertical,
  faEye,
  faPen,
  faUserPlus,
  faFileExport,
  faTrash,
  faArrowUp,
  faArrowDown,
  faMinus,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';

const PerformanceBadge = ({ value, trend }) => {
  let bgColor = 'bg-success';
  if (value < 50) bgColor = 'bg-danger';
  else if (value < 80) bgColor = 'bg-warning';

  const trendIcon = trend === 'up' ? faArrowUp : trend === 'down' ? faArrowDown : faMinus;

  return (
    <div className={`badge ${bgColor} text-white px-2 py-1 d-inline-flex align-items-center gap-1`} style={{ borderRadius: 6, fontSize: '12px' }}>
      <FontAwesomeIcon icon={trendIcon} style={{ fontSize: '10px' }} />
      {value}%
    </div>
  );
};

const StatusBadge = ({ status }) => {
  let colorClass = 'text-success bg-success-subtle';
  if (status === 'Inactive') colorClass = 'text-danger bg-danger-subtle';
  if (status === 'Onboarding' || status === 'Pending') colorClass = 'text-warning bg-warning-subtle';

  return (
    <span className={`badge ${colorClass} px-3 py-2 rounded-pill fw-bold`} style={{ fontSize: '11px' }}>
      {status}
    </span>
  );
};

const TeamLeadCell = ({ name }) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  return (
    <div className="d-flex align-items-center gap-2">
      <div 
        className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
        style={{ width: 32, height: 32, backgroundColor: '#64748b', fontSize: '12px' }}
      >
        {initials}
      </div>
      <span className="fw-medium text-dark" style={{ fontSize: '15px' }}>{name}</span>
    </div>
  );
};

const TeamsTable = ({ teams, onAction, loading }) => {
  const columns = useMemo(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            className="form-check-input ms-2"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="form-check-input ms-2"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      {
        accessorKey: 'name',
        header: 'Team Name',
        cell: (info) => {
          const name = info.getValue();
          const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
          return (
            <div className="d-flex align-items-center gap-3">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm"
                style={{ 
                  width: 42, 
                  height: 42, 
                  backgroundColor: 'rgba(99, 102, 241, 0.1)', 
                  color: '#6366f1',
                  fontSize: '14px'
                }}
              >
                {initials}
              </div>
              <span className="fw-bold text-dark">{name}</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'manager',
        header: 'Team Lead',
        cell: (info) => <TeamLeadCell name={info.getValue()} />,
      },
      {
        accessorKey: 'members',
        header: 'Members',
        cell: (info) => {
          const members = info.getValue() || [];
          const totalCount = info.row.original.memberCount;
          const displayMembers = members.slice(0, 3);
          const extra = totalCount - displayMembers.length;

          return (
            <div className="d-flex align-items-center team-avatar-stack">
              {displayMembers.map((m, i) => (
                <div
                  key={m.id}
                  className="rounded-circle border border-2 border-white shadow-sm d-flex align-items-center justify-content-center fw-bold text-white transition"
                  style={{
                    width: 32,
                    height: 32,
                    backgroundColor: m.color,
                    marginLeft: i > 0 ? -12 : 0,
                    fontSize: '10px',
                    zIndex: 10 - i,
                    cursor: 'pointer'
                  }}
                  title={m.name}
                >
                  {m.initials}
                </div>
              ))}
              {extra > 0 && (
                <div
                  className="rounded-circle border border-2 border-white shadow-sm d-flex align-items-center justify-content-center fw-bold text-dark bg-light transition"
                  style={{
                    width: 32,
                    height: 32,
                    marginLeft: -12,
                    fontSize: '10px',
                    zIndex: 0
                  }}
                >
                  +{extra}
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'productivityPercent',
        header: 'Performance',
        cell: (info) => <PerformanceBadge value={info.getValue()} trend={info.row.original.trend} />,
      },
      {
        accessorKey: 'efficiency',
        header: 'Efficiency',
        cell: (info) => (
          <div className="d-flex align-items-center gap-2">
            <div className="progress flex-grow-1" style={{ height: '6px', minWidth: '60px', borderRadius: '3px' }}>
              <div 
                className={`progress-bar ${info.getValue() > 80 ? 'bg-success' : info.getValue() > 50 ? 'bg-warning' : 'bg-danger'}`}
                role="progressbar" 
                style={{ width: `${info.getValue()}%` }} 
              />
            </div>
            <span className="small fw-bold text-muted">{info.getValue()}%</span>
          </div>
        ),
      },
      {
        accessorKey: 'totalWorked',
        header: 'Worked Hours',
        cell: (info) => (
          <div className="fw-semibold text-dark text-end pe-4">{info.getValue()}h</div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => <StatusBadge status={info.getValue()} />,
      },
      {
        id: 'actions',
        header: '',
        cell: (info) => (
          <div className="dropdown text-end pe-2">
            <button
              className="btn btn-link text-muted p-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow border-0 rounded-3">
              <li><button className="dropdown-item py-2" onClick={() => onAction('view', info.row.original)}><FontAwesomeIcon icon={faEye} className="me-2 text-primary opacity-75" /> View Team</button></li>
              <li><button className="dropdown-item py-2" onClick={() => onAction('edit', info.row.original)}><FontAwesomeIcon icon={faPen} className="me-2 text-info opacity-75" /> Edit Team</button></li>
              <li><button className="dropdown-item py-2" onClick={() => onAction('assign', info.row.original)}><FontAwesomeIcon icon={faUserPlus} className="me-2 text-success opacity-75" /> Assign Members</button></li>
              <li><button className="dropdown-item py-2" onClick={() => onAction('export', info.row.original)}><FontAwesomeIcon icon={faFileExport} className="me-2 text-secondary opacity-75" /> Export</button></li>
              <li><hr className="dropdown-divider" /></li>
              <li><button className="dropdown-item py-2 text-danger" onClick={() => onAction('delete', info.row.original)}><FontAwesomeIcon icon={faTrash} className="me-2 opacity-75" /> Delete</button></li>
            </ul>
          </div>
        ),
      },
    ],
    [onAction]
  );

  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: teams,
    columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="card border-0 shadow-sm p-5 text-center" style={{ borderRadius: 16 }}>
        <div className="spinner-border text-primary mx-auto mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted mb-0">Loading teams data...</p>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm overflow-hidden mb-4" style={{ borderRadius: 16 }}>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="bg-light">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="border-0 text-uppercase text-muted x-small fw-bold py-3 px-4"
                    style={{ letterSpacing: '0.5px' }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="transition" style={{ height: 80, cursor: 'pointer' }}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="border-bottom-0 px-4 py-3" style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <style>{`
        .table-hover tbody tr:hover {
          background-color: #f8fafc !important;
        }
        .team-avatar-stack .rounded-circle:hover {
          transform: translateY(-2px);
          z-index: 20 !important;
        }
      `}</style>
    </div>
  );
};

export default TeamsTable;
