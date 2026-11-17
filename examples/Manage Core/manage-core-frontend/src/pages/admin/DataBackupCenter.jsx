import React, { useMemo, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDatabase, faDownload, faFileCsv, faFilePdf, faServer, faShieldHalved, faCloudUploadAlt, faTriangleExclamation, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { getAllFeatures } from '../../data/featureRegistry';
import { downloadTextFile, readFeatureRecords, recordsToSql, toCsv } from '../../utils/localFeatureStore';
import { listUsers } from '../../api/users';
import { getStorageSettings, updateStorageSettings } from '../../api/settings';

const backupSystems = [
  { key: 'users', label: 'Users', records: null },
  { key: 'hrms', label: 'HRMS', records: null },
  { key: 'fms', label: 'FMS', records: null },
  { key: 'pms', label: 'PMS', records: null },
  { key: 'tms', label: 'TMS', records: null },
];

function collectSystemRecords(system) {
  return getAllFeatures()
    .filter((feature) => feature.system === system)
    .flatMap((feature) => readFeatureRecords(system, feature.id).map((record) => ({ system, feature: feature.label, featureId: feature.id, ...record })));
}

const DataBackupCenter = () => {
  const [userRecords, setUserRecords] = useState([]);
  const [storagePath, setStoragePath] = useState('');
  const [storageMeta, setStorageMeta] = useState({
    storagePath: '',
    storageStatus: '',
    storageStatusMessage: '',
    defaultStoragePath: '',
  });
  const [storageLoading, setStorageLoading] = useState(true);
  const [storageSaving, setStorageSaving] = useState(false);
  const [storageError, setStorageError] = useState('');
  const [storageSuccess, setStorageSuccess] = useState('');

  useEffect(() => {
    let mounted = true;
    const loadStorage = async () => {
      try {
        const data = await getStorageSettings();
        if (!mounted) return;
        setStorageMeta(data);
        setStoragePath(data.storagePath || '');
      } catch (error) {
        if (!mounted) return;
        setStorageError(error.message || 'Failed to load storage settings.');
      } finally {
        if (mounted) setStorageLoading(false);
      }
    };
    loadStorage();
    return () => { mounted = false; };
  }, []);

  const handleStorageUpdate = async (e) => {
    e.preventDefault();
    if (!storagePath.trim()) {
      setStorageError('Storage path is required.');
      return;
    }
    setStorageSaving(true);
    setStorageError('');
    setStorageSuccess('');
    try {
      const data = await updateStorageSettings(storagePath.trim());
      setStorageMeta(data);
      setStoragePath(data.storagePath || '');
      setStorageSuccess('Storage configuration updated successfully.');
      setTimeout(() => setStorageSuccess(''), 3000);
    } catch (error) {
      setStorageError(error.message || 'Update failed.');
    } finally {
      setStorageSaving(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await listUsers();
        const mappedUsers = users.map((u, index) => ({
          'User No': index + 1,
          'Employee ID': u.empId || 'N/A',
          'Name': u.name,
          'Email': u.email,
          'Role': u.role,
          'Status': u.status,
          'Joining Date': u.joiningDate || 'N/A',
          'System': 'Users'
        }));
        setUserRecords(mappedUsers);
      } catch (error) {
        console.error("Failed to fetch users for backup:", error);
      }
    };
    fetchUsers();
  }, []);

  const summaries = useMemo(() => backupSystems.map((item) => {
    let records = item.records;
    if (item.key === 'users') {
      records = userRecords;
    } else if (records === null) {
      records = collectSystemRecords(item.key);
    }
    return { ...item, records, count: records.length };
  }), [userRecords]);

  const allRecords = summaries.flatMap((item) => item.records.map((record) => ({ backupSystem: item.label, ...record })));

  const exportSystem = (systemKey, format) => {
    const summary = summaries.find((item) => item.key === systemKey);
    if (!summary) return;
    if (format === 'json') downloadTextFile(`${systemKey}-backup.json`, JSON.stringify(summary.records, null, 2), 'application/json;charset=utf-8');
    if (format === 'csv') downloadTextFile(`${systemKey}-backup.csv`, toCsv(summary.records), 'text/csv;charset=utf-8');
    if (format === 'sql') downloadTextFile(`${systemKey}-backup.sql`, recordsToSql(`${systemKey}_backup`, summary.records), 'application/sql;charset=utf-8');
    if (format === 'nosql') downloadTextFile(`${systemKey}-nosql-export.json`, JSON.stringify({ collection: systemKey, documents: summary.records }, null, 2), 'application/json;charset=utf-8');
  };

  const exportAll = (format) => {
    if (format === 'json') downloadTextFile('manage-core-full-backup.json', JSON.stringify(allRecords, null, 2), 'application/json;charset=utf-8');
    if (format === 'csv') downloadTextFile('manage-core-full-backup.csv', toCsv(allRecords), 'text/csv;charset=utf-8');
    if (format === 'sql') downloadTextFile('manage-core-full-backup.sql', recordsToSql('manage_core_backup', allRecords), 'application/sql;charset=utf-8');
    if (format === 'nosql') downloadTextFile('manage-core-nosql-export.json', JSON.stringify({ database: 'manage_core', collections: summaries }, null, 2), 'application/json;charset=utf-8');
  };

  return (
    <div className="backup-center px-3 px-lg-4 py-4">
      <div className="backup-hero rounded-5 p-4 p-lg-5 mb-4">
        <div className="row align-items-center g-4">
          <div className="col-lg-8">
            <span className="badge bg-white text-primary rounded-pill px-3 py-2 mb-3 fw-bold">ADMIN BACKUP CONTROL</span>
            <h2 className="text-white fw-bold mb-2">Data Backup Center</h2>
            <p className="text-white-50 mb-0">Export Users, HRMS, FMS, PMS, TMS, and future system records in CSV, Excel-friendly CSV, PDF print, SQL, and NoSQL JSON formats.</p>
          </div>
          <div className="col-lg-4">
            <div className="backup-glass rounded-4 p-4">
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="backup-icon"><FontAwesomeIcon icon={faShieldHalved} /></div>
                <div>
                  <h5 className="text-white fw-bold mb-0">{allRecords.length}</h5>
                  <p className="text-white-50 small mb-0">Frontend records available</p>
                </div>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <button className="btn btn-light btn-sm rounded-pill" onClick={() => exportAll('csv')}>CSV All</button>
                <button className="btn btn-light btn-sm rounded-pill" onClick={() => exportAll('json')}>JSON All</button>
                <button className="btn btn-light btn-sm rounded-pill" onClick={() => exportAll('sql')}>SQL All</button>
                <button className="btn btn-light btn-sm rounded-pill" onClick={() => window.print()}>PDF Print</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 rounded-4 mb-4 storage-config-card">
        <div className="card-body p-4">
          <div className="d-flex align-items-center gap-3 mb-3">
            <div className="p-2 rounded-3" style={{ background: 'rgba(79, 70, 229, 0.1)' }}>
              <FontAwesomeIcon icon={faCloudUploadAlt} className="text-primary" />
            </div>
            <div>
              <h5 className="fw-bold mb-1">System Storage</h5>
              <p className="text-muted small mb-0">Manage file paths and server storage configuration</p>
            </div>
          </div>

          {storageSuccess && (
            <div className="alert alert-success border-0 rounded-4 py-2 small d-flex align-items-center gap-2 mb-3">
              <FontAwesomeIcon icon={faCircleCheck} /> {storageSuccess}
            </div>
          )}

          <div className="alert bg-light border-0 rounded-4 p-3 mb-3">
            <div className="d-flex gap-2">
              <div className="text-primary"><FontAwesomeIcon icon={faTriangleExclamation} size="sm" /></div>
              <div>
                <p className="small text-muted mb-0">Changing the storage path affects all future file uploads. Ensure the new path exists and is writable by the server.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleStorageUpdate}>
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="fw-bold small text-dark mb-0">Absolute Storage Path</label>
                <span className={`badge ${storageMeta.storageStatus === 'Ready' ? 'bg-success' : 'bg-warning'} rounded-pill`}>
                  {storageMeta.storageStatus === 'Ready' ? 'Ready' : (storageMeta.storageStatus || 'Checking')}
                </span>
              </div>
              <div className="input-group">
                <span className="input-group-text bg-light border-0"><FontAwesomeIcon icon={faCloudUploadAlt} className="text-muted" /></span>
                <input
                  className="form-control border-0 bg-light"
                  placeholder={storageMeta.defaultStoragePath || "C:\\ManageCore\\Projects"}
                  value={storagePath}
                  onChange={(e) => setStoragePath(e.target.value)}
                  required
                  style={{ fontWeight: 600 }}
                />
              </div>
              {storageError && <div className="text-danger small mt-1 fw-bold">{storageError}</div>}
              <div className="text-muted small mt-2">
                Current active: <code className="bg-light px-2 py-1 rounded">{storageMeta.storagePath || 'System default'}</code>
              </div>
            </div>

            {storageMeta.storageStatusMessage && (
              <div className="p-2 rounded-3 bg-light border-start border-4 border-primary mb-3 small">
                {storageMeta.storageStatusMessage}
              </div>
            )}

            <button type="submit" className="btn btn-primary rounded-4 px-4 py-2 fw-bold" disabled={storageLoading || storageSaving}>
              {storageSaving ? 'Configuring...' : 'Update System Path'}
            </button>
          </form>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {summaries.map((item) => (
          <div className="col-xl-3 col-md-6" key={item.key}>
            <div className="card border-0 rounded-4 h-100 backup-card">
              <div className="card-body p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="backup-card-icon"><FontAwesomeIcon icon={item.key === 'users' ? faServer : faDatabase} /></div>
                  <span className="badge bg-primary-subtle text-primary rounded-pill">{item.count} Records</span>
                </div>
                <h5 className="fw-bold mb-1">{item.label}</h5>
                <p className="text-muted small mb-3">Export {item.label} frontend records and registers.</p>
                <div className="d-flex flex-wrap gap-2">
                  <button className="btn btn-outline-primary btn-sm rounded-pill" onClick={() => exportSystem(item.key, 'csv')}><FontAwesomeIcon icon={faFileCsv} className="me-1" />CSV</button>
                  <button className="btn btn-outline-primary btn-sm rounded-pill" onClick={() => exportSystem(item.key, 'json')}><FontAwesomeIcon icon={faDownload} className="me-1" />JSON</button>
                  <button className="btn btn-outline-primary btn-sm rounded-pill" onClick={() => exportSystem(item.key, 'sql')}>SQL</button>
                  <button className="btn btn-outline-secondary btn-sm rounded-pill" onClick={() => window.print()}><FontAwesomeIcon icon={faFilePdf} className="me-1" />PDF</button>
                  <button className="btn btn-outline-success btn-sm rounded-pill" onClick={() => exportSystem(item.key, 'nosql')}>NoSQL</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 rounded-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">Backup Matrix</h5>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>System</th>
                  <th>Records</th>
                  <th>Excel Export</th>
                  <th>CSV Export</th>
                  <th>PDF Export</th>
                  <th>SQL Export</th>
                  <th>NoSQL Export</th>
                </tr>
              </thead>
              <tbody>
                {summaries.map((item) => (
                  <tr key={item.key}>
                    <td className="fw-bold">{item.label}</td>
                    <td>{item.count}</td>
                    {['Excel-friendly CSV', 'CSV', 'Print/PDF', 'SQL', 'NoSQL JSON'].map((label) => (
                      <td key={label}><span className="badge bg-success-subtle text-success rounded-pill">Ready</span><div className="text-muted x-small">{label}</div></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="alert alert-warning border-0 rounded-4 mb-0">
            This backup center exports frontend/browser records from this uploaded React project. Server database backup requires backend API/database access, which is not present in the uploaded ZIP.
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataBackupCenter;
