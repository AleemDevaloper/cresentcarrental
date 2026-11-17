import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import TaskDocumentCenter from './TaskDocumentCenter';

const TmsEditor = () => {
  return (
    <div className="container-fluid py-4 fade-in">
      <div className="card border-0 shadow-lg rounded-5 overflow-hidden bg-white mb-4">
        <div className="card-header p-0 border-0">
          <div className="p-4 p-lg-5 text-white" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)' }}>
            <div className="d-flex align-items-center gap-4">
              <div className="bg-white bg-opacity-10 p-3 rounded-4 shadow-sm">
                <FontAwesomeIcon icon={faLayerGroup} className="fs-3" />
              </div>
              <div>
                <h3 className="fw-bold mb-1">Document Center</h3>
                <p className="mb-0 opacity-75">Browse, preview, version, and manage all task documents in one place.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          <TaskDocumentCenter />
        </div>
      </div>
    </div>
  );
};

export default TmsEditor;
