import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUsers,
  faCheckCircle,
  faArchive,
  faRobot,
  faBrain,
  faComments,
  faFileSignature,
  faEye,
  faFolderOpen,
  faFileAlt,
  faChartBar,
  faChartLine,
  faDatabase,
  faShieldHalved,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Returns the module tabs configuration for HRMS (Human Resource Management System).
 * This has been shifted from Common.jsx to make the codebase more modular and manageable.
 * 
 * @param {Function} t - Translation function
 * @returns {Array} List of tab configurations
 */
export const getDmsModuleTabs = (t) => [
      { id: 'dms_overview', label: t('overview'), icon: <FontAwesomeIcon icon={faHome} /> },
      {
        id: 'dms_repo_mgmt',
        label: t('document_management'),
        icon: <FontAwesomeIcon icon={faFolderOpen} />,
        subTabs: [
          { id: 'dms_documents', label: t('all_documents'), icon: <FontAwesomeIcon icon={faFolderOpen} /> },
          { id: 'dms_document_viewer', label: t('document_viewer'), icon: <FontAwesomeIcon icon={faEye} /> },
          { id: 'dms_templates', label: t('document_templates'), icon: <FontAwesomeIcon icon={faFileAlt} /> },
          { id: 'dms_archival', label: t('archive_center'), icon: <FontAwesomeIcon icon={faArchive} /> },
        ]
      },
      {
        id: 'dms_analytics_mgmt',
        label: t('analytics'),
        icon: <FontAwesomeIcon icon={faChartBar} />,
        subTabs: [
          { id: 'dms_analytics', label: t('analytics_dashboard'), icon: <FontAwesomeIcon icon={faChartLine} /> },
          { id: 'dms_storage_analytics', label: t('storage_analytics'), icon: <FontAwesomeIcon icon={faDatabase} /> },
        ]
      },
      {
        id: 'dms_ai_mgmt',
        label: t('ai_intelligence'),
        icon: <FontAwesomeIcon icon={faRobot} />,
        subTabs: [
          { id: 'dms_ai_intelligence', label: t('ai_document_intelligence'), icon: <FontAwesomeIcon icon={faBrain} /> },
        ]
      },
      {
        id: 'dms_collab_mgmt',
        label: t('collaboration'),
        icon: <FontAwesomeIcon icon={faUsers} />,
        subTabs: [
          { id: 'dms_collaboration', label: t('collaboration_center'), icon: <FontAwesomeIcon icon={faComments} /> },
          { id: 'dms_approval_workflow', label: t('approval_workflow'), icon: <FontAwesomeIcon icon={faCheckCircle} /> },
          { id: 'dms_signature_center', label: t('signature_center'), icon: <FontAwesomeIcon icon={faFileSignature} /> },
        ]
      },
      {
        id: 'dms_security_mgmt',
        label: t('security_compliance'),
        icon: <FontAwesomeIcon icon={faShieldHalved} />,
        subTabs: [
          { id: 'dms_security_center', label: t('security_center'), icon: <FontAwesomeIcon icon={faShieldHalved} /> },
          { id: 'dms_audit_logs', label: t('audit_logs'), icon: <FontAwesomeIcon icon={faHistory} /> },
        ]
      },
    
];

  
