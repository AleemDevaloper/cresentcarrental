import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faProjectDiagram,
  faClipboard,
  faTasks,
  faCalendarAlt,
  faChartBar,
  faFileAlt,
  faDatabase,
  faUsers,
  faLayerGroup,
  faClock,
  faBox,
  faShieldHalved,
  faTimeline,
  faWallet,
  faGaugeHigh,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Returns the module tabs configuration for PMS (Project Management System).
 * This has been shifted from Common.jsx to make the codebase more modular and manageable.
 * 
 * @param {Function} t - Translation function
 * @returns {Array} List of tab configurations
 */
export const getPmsModuleTabs = (t) => [
  { id: 'pms_overview', label: t('overview'), icon: <FontAwesomeIcon icon={faGaugeHigh} />, accent: 'Command', desc: 'Portfolio pulse', metric: 'Live' },
  { id: 'projectentry', label: t('projects'), icon: <FontAwesomeIcon icon={faProjectDiagram} />, accent: 'Core', desc: 'Project intake', metric: 'Hub' },
  { id: 'pms_milestones', label: t('milestones'), icon: <FontAwesomeIcon icon={faTimeline} />, accent: 'Plan', desc: 'Delivery markers', metric: 'M1' },
  { id: 'pms_tasks', label: t('tasks'), icon: <FontAwesomeIcon icon={faTasks} />, accent: 'Work', desc: 'Execution queue', metric: 'Ops' },
  {
    id: 'pms_planning_analytics',
    label: t('planning_analytics'),
    icon: <FontAwesomeIcon icon={faCalendarAlt} />,
    accent: 'Insights',
    desc: 'Schedule, reporting, docs',
    metric: '3',
    subTabs: [
      { id: 'pms_calendar', label: t('calendar'), icon: <FontAwesomeIcon icon={faCalendarAlt} />, desc: 'Delivery cadence' },
      { id: 'reports', label: t('project_reports'), icon: <FontAwesomeIcon icon={faChartBar} />, desc: 'Executive summaries' },
      { id: 'pms_documentation', label: t('documentation'), icon: <FontAwesomeIcon icon={faFileAlt} />, desc: 'Controlled knowledge' },
    ]
  },
  {
    id: 'pms_financial_progress',
    label: t('cost_progress'),
    icon: <FontAwesomeIcon icon={faWallet} />,
    accent: 'Finance',
    desc: 'Budget, cost, progress',
    metric: '4',
    subTabs: [
      { id: 'pms_cost_tracking', label: t('project_cost_tracking'), icon: <FontAwesomeIcon icon={faChartBar} />, desc: 'Actuals and variance' },
      { id: 'pms_budget_tracking', label: t('project_budget_tracking'), icon: <FontAwesomeIcon icon={faDatabase} />, desc: 'Allocation control' },
      { id: 'pms_progress_tracking', label: t('progress_tracking'), icon: <FontAwesomeIcon icon={faTasks} />, desc: 'Completion velocity' },
      { id: 'pms_resource_allocation', label: t('resource_allocation'), icon: <FontAwesomeIcon icon={faUsers} />, desc: 'Capacity planning' },
    ]
  },
  {
    id: 'pms_agile_workspace',
    label: t('agile_workspace'),
    icon: <FontAwesomeIcon icon={faLayerGroup} />,
    accent: 'Agile',
    desc: 'Sprint operating room',
    metric: '4',
    subTabs: [
      { id: 'pms_sprint_management', label: t('sprint_management'), icon: <FontAwesomeIcon icon={faClock} />, desc: 'Sprint commitments' },
      { id: 'pms_agile_scrum', label: t('agile_scrum'), icon: <FontAwesomeIcon icon={faBox} />, desc: 'Ceremonies and boards' },
      { id: 'pms_backlog_management', label: t('backlog_management'), icon: <FontAwesomeIcon icon={faClipboard} />, desc: 'Prioritized demand' },
      { id: 'pms_risk_tracking', label: t('risk_tracking'), icon: <FontAwesomeIcon icon={faShieldHalved} />, desc: 'Risk response' },
    ]
  },
  {
    id: 'pms_controls',
    label: t('controls_recovery'),
    icon: <FontAwesomeIcon icon={faDatabase} />,
    accent: 'Control',
    desc: 'Backup and recovery',
    metric: 'DR',
    subTabs: [
      { id: 'pms_data_backup', label: t('data_backup'), icon: <FontAwesomeIcon icon={faDatabase} />, desc: 'Recovery point' },
    ]
  },
];
