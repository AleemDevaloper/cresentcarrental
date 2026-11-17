import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faTimesCircle,
  faClock,
  faExclamationTriangle,
  faBan,
  faHourglassHalf,
  faPaperPlane,
  faArchive,
  faTrash,
  faShieldAlt,
  faWrench,
  faLock,
  faUnlock,
  faEye,
  faPowerOff,
  faSync,
  faFlag,
} from '@fortawesome/free-solid-svg-icons';

/**
 * Centralized status configuration mapping every backend status value
 * to its display label, color class, and icon.
 *
 * Handles BOTH lowercase and Title Case variants for backwards compatibility.
 * Backend statuses are lowercase/snake_case; some legacy pages use Title Case.
 */
const STATUS_CONFIG = {
  // === Active / Enabled states ===
  active: { label: 'Active', color: 'success', icon: faCheckCircle },
  Active: { label: 'Active', color: 'success', icon: faCheckCircle },
  enabled: { label: 'Enabled', color: 'success', icon: faCheckCircle },
  online: { label: 'Online', color: 'success', icon: faCheckCircle },
  Online: { label: 'Online', color: 'success', icon: faCheckCircle },

  // === Pending / In Progress states ===
  pending: { label: 'Pending', color: 'warning', icon: faClock },
  Pending: { label: 'Pending', color: 'warning', icon: faClock },
  'in_progress': { label: 'In Progress', color: 'info', icon: faSync },
  'In Progress': { label: 'In Progress', color: 'info', icon: faSync },
  'not_started': { label: 'Not Started', color: 'secondary', icon: faClock },
  draft: { label: 'Draft', color: 'secondary', icon: faEye },
  Draft: { label: 'Draft', color: 'secondary', icon: faEye },
  queued: { label: 'Queued', color: 'secondary', icon: faClock },

  // === Approved / Completed states ===
  approved: { label: 'Approved', color: 'success', icon: faCheckCircle },
  Approved: { label: 'Approved', color: 'success', icon: faCheckCircle },
  completed: { label: 'Completed', color: 'success', icon: faCheckCircle },
  Completed: { label: 'Completed', color: 'success', icon: faCheckCircle },
  published: { label: 'Published', color: 'success', icon: faPaperPlane },
  Published: { label: 'Published', color: 'success', icon: faPaperPlane },
  signed: { label: 'Signed', color: 'success', icon: faCheckCircle },
  verified: { label: 'Verified', color: 'success', icon: faShieldAlt },
  finalized: { label: 'Finalized', color: 'success', icon: faCheckCircle },
  acknowledged: { label: 'Acknowledged', color: 'success', icon: faCheckCircle },
  submitted: { label: 'Submitted', color: 'info', icon: faPaperPlane },
  processed: { label: 'Processed', color: 'success', icon: faCheckCircle },
  dispatched: { label: 'Dispatched', color: 'info', icon: faPaperPlane },
  received: { label: 'Received', color: 'success', icon: faCheckCircle },

  // === Rejected / Failed states ===
  rejected: { label: 'Rejected', color: 'danger', icon: faTimesCircle },
  Rejected: { label: 'Rejected', color: 'danger', icon: faTimesCircle },
  failed: { label: 'Failed', color: 'danger', icon: faTimesCircle },
  Failed: { label: 'Failed', color: 'danger', icon: faTimesCircle },
  declined: { label: 'Declined', color: 'danger', icon: faTimesCircle },
  cancelled: { label: 'Cancelled', color: 'danger', icon: faBan },
  Cancelled: { label: 'Cancelled', color: 'danger', icon: faBan },
  revoked: { label: 'Revoked', color: 'danger', icon: faBan },

  // === In Review / Escalated states ===
  'in_review': { label: 'In Review', color: 'warning', icon: faEye },
  'Under Review': { label: 'In Review', color: 'warning', icon: faEye },
  escalated: { label: 'Escalated', color: 'purple', icon: faExclamationTriangle },
  Escalated: { label: 'Escalated', color: 'purple', icon: faExclamationTriangle },
  'sent_back': { label: 'Sent Back', color: 'warning', icon: faExclamationTriangle },

  // === Inactive / Disabled states ===
  inactive: { label: 'Inactive', color: 'secondary', icon: faPowerOff },
  Inactive: { label: 'Inactive', color: 'secondary', icon: faPowerOff },
  disabled: { label: 'Disabled', color: 'secondary', icon: faPowerOff },
  Disabled: { label: 'Disabled', color: 'secondary', icon: faPowerOff },
  offline: { label: 'Offline', color: 'secondary', icon: faPowerOff },
  Offline: { label: 'Offline', color: 'secondary', icon: faPowerOff },
  idle: { label: 'Idle', color: 'secondary', icon: faClock },

  // === Suspended / Expired states ===
  suspended: { label: 'Suspended', color: 'danger', icon: faBan },
  expired: { label: 'Expired', color: 'danger', icon: faClock },
  Archived: { label: 'Archived', color: 'secondary', icon: faArchive },
  archived: { label: 'Archived', color: 'secondary', icon: faArchive },

  // === Physical / Maintenance states ===
  maintenance: { label: 'Maintenance', color: 'warning', icon: faWrench },
  stolen: { label: 'Stolen', color: 'danger', icon: faExclamationTriangle },
  lost: { label: 'Lost', color: 'danger', icon: faExclamationTriangle },
  retired: { label: 'Retired', color: 'secondary', icon: faArchive },

  // === Trial / Beta states ===
  trial: { label: 'Trial', color: 'info', icon: faFlag },
  beta: { label: 'Beta', color: 'info', icon: faFlag },

  // === Attendance specific ===
  Present: { label: 'Present', color: 'success', icon: faCheckCircle },
  Absent: { label: 'Absent', color: 'danger', icon: faTimesCircle },
  Late: { label: 'Late', color: 'warning', icon: faClock },
  'Half Day': { label: 'Half Day', color: 'info', icon: faClock },
  Holiday: { label: 'Holiday', color: 'primary', icon: faFlag },
  'Not Started': { label: 'Not Started', color: 'secondary', icon: faClock },

  // === Win / Lose (sales pipeline) ===
  Win: { label: 'Won', color: 'success', icon: faCheckCircle },
  Lose: { label: 'Lost', color: 'danger', icon: faTimesCircle },

  // === Onboarding states ===
  onboarding: { label: 'Onboarding', color: 'info', icon: faSync },
  Onboarding: { label: 'Onboarding', color: 'info', icon: faSync },

  // === Overdue / At Risk ===
  overdue: { label: 'Overdue', color: 'danger', icon: faExclamationTriangle },
  'at_risk': { label: 'At Risk', color: 'danger', icon: faExclamationTriangle },
  'At Risk': { label: 'At Risk', color: 'danger', icon: faExclamationTriangle },
  'on_hold': { label: 'On Hold', color: 'secondary', icon: faClock },
  'On Hold': { label: 'On Hold', color: 'secondary', icon: faClock },
};

/**
 * Get the status configuration for a given status value.
 * Handles case-insensitive matching and returns a default if not found.
 */
export const getStatusConfig = (status) => {
  if (!status) return { label: 'Unknown', color: 'secondary', icon: faClock };
  return STATUS_CONFIG[status] || STATUS_CONFIG[status.toLowerCase()] || {
    label: status,
    color: 'secondary',
    icon: faClock,
  };
};

/**
 * Get the Bootstrap color class for a status value.
 */
export const getStatusColor = (status) => getStatusConfig(status).color;

/**
 * Get the display label for a status value.
 */
export const getStatusLabel = (status) => getStatusConfig(status).label;

/**
 * StatusDot — a small colored dot indicating status.
 */
export const StatusDot = ({ status, size = 8, pulse = false }) => {
  const config = getStatusConfig(status);
  const colorMap = {
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    primary: '#6366f1',
    secondary: '#94a3b8',
    purple: '#8b5cf6',
  };
  return (
    <span
      className={`d-inline-block rounded-circle ${pulse ? 'animate-pulse-glow' : ''}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: colorMap[config.color] || colorMap.secondary,
      }}
    />
  );
};

export default STATUS_CONFIG;
