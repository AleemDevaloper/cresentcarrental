import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHome,
    faClipboard,
    faTasks,
    faCalendarAlt,
    faChartBar,
    faFileAlt,
    faUsers,
    faAt,
    faFileExport,
    faPaperclip,
    faTags,
    faLayerGroup,
    faClock,
    faChartLine,
    faSitemap,
    faHistory,
    faPlus,
    faCheckCircle,
    faChartArea,
  faPlusCircle,
  faBuilding,
  faUserShield,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Returns the module tabs configuration for PMS (Project Management System).
 * This has been shifted from Common.jsx to make the codebase more modular and manageable.
 * 
 * @param {Function} t - Translation function
 * @returns {Array} List of tab configurations
 */
export const getTmsModuleTabs = (t) => [

    { id: 'tms_overview', label: t('overview'), icon: <FontAwesomeIcon icon={faHome} /> },
    { id: 'tms_add_task', label: t('add_task'), icon: <FontAwesomeIcon icon={faPlus} /> },
    { id: 'tms_milestones', label: t('milestones'), icon: <FontAwesomeIcon icon={faClipboard} /> },
    { id: 'tms_tasks', label: t('all_tasks'), icon: <FontAwesomeIcon icon={faTasks} /> },
    { id: 'tms_bulk', label: t('bulk_actions'), icon: <FontAwesomeIcon icon={faLayerGroup} /> },
    { id: 'tms_calendar', label: t('calendar_view'), icon: <FontAwesomeIcon icon={faCalendarAlt} /> },
    { id: 'tms_timeline', label: t('timeline_view'), icon: <FontAwesomeIcon icon={faChartLine} /> },
    { id: 'tms_dependencies', label: t('dependencies'), icon: <FontAwesomeIcon icon={faSitemap} /> },
    { id: 'tms_time_tracking', label: t('time_tracking'), icon: <FontAwesomeIcon icon={faClock} /> },
    { id: 'tms_tags', label: t('tags_labels'), icon: <FontAwesomeIcon icon={faTags} /> },
    { id: 'tms_attachments', label: t('attachments'), icon: <FontAwesomeIcon icon={faPaperclip} /> },
    { id: 'tms_editor', label: t('task_documentation'), icon: <FontAwesomeIcon icon={faFileAlt} /> },
    { id: 'tms_history', label: t('activity_logs'), icon: <FontAwesomeIcon icon={faHistory} /> },
    { id: 'tms_trash', label: t('trash'), icon: <FontAwesomeIcon icon={faTrashCan} /> },
    {
        id: 'tms_reporting_mgmt',
        label: t('reporting_analytics'),
        icon: <FontAwesomeIcon icon={faChartBar} />,
        subTabs: [
            { id: 'tms_productivity', label: t('productivity'), icon: <FontAwesomeIcon icon={faChartBar} /> },
            { id: 'tms_task_completion_reports', label: t('tms_task_completion_reports'), icon: <FontAwesomeIcon icon={faCheckCircle} /> },
            { id: 'tms_team_performance_reports', label: t('tms_team_performance_reports'), icon: <FontAwesomeIcon icon={faUsers} /> },
            { id: 'tms_time_usage_analytics', label: t('tms_time_usage_analytics'), icon: <FontAwesomeIcon icon={faClock} /> },
            { id: 'tms_custom_reports_builder', label: t('tms_custom_reports_builder'), icon: <FontAwesomeIcon icon={faChartBar} /> },
            { id: 'tms_export_reports', label: t('tms_export_reports'), icon: <FontAwesomeIcon icon={faFileExport} /> },
            { id: 'tms_kpi_dashboards', label: t('tms_kpi_dashboards'), icon: <FontAwesomeIcon icon={faChartLine} /> },
            { id: 'tms_attendance_productivity_insights', label: t('tms_attendance_productivity_insights'), icon: <FontAwesomeIcon icon={faUsers} /> },
            { id: 'tms_burndown_charts', label: t('tms_burndown_charts'), icon: <FontAwesomeIcon icon={faChartArea} /> },
            { id: 'tms_forecasting_analytics', label: t('tms_forecasting_analytics'), icon: <FontAwesomeIcon icon={faChartLine} /> },
            { id: 'tms_add_record', label: t('tms_add_record'), icon: <FontAwesomeIcon icon={faPlusCircle} /> },
        ]
    },
    {
        id: 'tms_collaboration_mgmt',
        label: t('collaboration_mgmt'),
        icon: <FontAwesomeIcon icon={faUsers} />,
        subTabs: [
            { id: 'tms_team_workspaces', label: t('tms_team_workspaces'), icon: <FontAwesomeIcon icon={faUsers} /> },
            { id: 'tms_team_mentions', label: t('tms_team_mentions'), icon: <FontAwesomeIcon icon={faAt} /> },
            { id: 'tms_shared_task_boards', label: t('tms_shared_task_boards'), icon: <FontAwesomeIcon icon={faTasks} /> },
            { id: 'tms_dept_task_mgmt', label: t('tms_dept_task_mgmt'), icon: <FontAwesomeIcon icon={faBuilding} /> },
            { id: 'tms_multi_user_assignment', label: t('tms_multi_user_assignment'), icon: <FontAwesomeIcon icon={faUsers} /> },
            { id: 'tms_approval_workflow', label: t('tms_approval_workflow'), icon: <FontAwesomeIcon icon={faCheckCircle} /> },
            { id: 'tms_client_collaboration', label: t('tms_client_collaboration'), icon: <FontAwesomeIcon icon={faUserShield} /> },
        ]
    },

];
