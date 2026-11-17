import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUsers,
  faUserPlus,
  faHandshake,
  faAddressBook,
  faCalendarCheck,
  faBullhorn,
  faChartBar,
  faTasks,
  faCogs,
  faEnvelope,
  faFileAlt,
  faClock,
  faStream,
  faBolt,
  faTags,
  faCalendar,
  faHistory,
  faFileExport,
  faBullseye,
  faCopy,
  faBell,
  faListAlt,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";

export const getCrmModuleTabs = (t) => [
  { id: 'crm_overview', label: t('overview') || 'Dashboard', icon: <FontAwesomeIcon icon={faHome} /> },
  {
    id: 'crm_relationship_group',
    label: t('collaboration_mgmt') || 'Relationship',
    icon: <FontAwesomeIcon icon={faHandshake} />,
    subTabs: [
      { id: 'crm_customers', label: 'Companies', icon: <FontAwesomeIcon icon={faUsers} /> },
      { id: 'crm_leads', label: 'Leads', icon: <FontAwesomeIcon icon={faUserPlus} /> },
      { id: 'crm_contacts', label: 'Contacts', icon: <FontAwesomeIcon icon={faAddressBook} /> },
      { id: 'crm_deals', label: 'Deals Pipeline', icon: <FontAwesomeIcon icon={faHandshake} /> },
      { id: 'crm_pipelines', label: 'Pipelines', icon: <FontAwesomeIcon icon={faStream} /> },
      { id: 'crm_duplicates', label: 'Duplicates', icon: <FontAwesomeIcon icon={faCopy} /> },
    ]
  },
  {
    id: 'crm_engagement_group',
    label: 'Engagement',
    icon: <FontAwesomeIcon icon={faCalendarCheck} />,
    subTabs: [
      { id: 'crm_activities', label: 'Activities', icon: <FontAwesomeIcon icon={faCalendarCheck} /> },
      { id: 'crm_tasks', label: 'Tasks', icon: <FontAwesomeIcon icon={faTasks} /> },
      { id: 'crm_followups', label: 'Follow-Ups', icon: <FontAwesomeIcon icon={faClock} /> },
      { id: 'crm_calendar', label: 'Calendar', icon: <FontAwesomeIcon icon={faCalendar} /> },
      { id: 'crm_notifications', label: 'Notifications', icon: <FontAwesomeIcon icon={faBell} /> },
    ]
  },
  {
    id: 'crm_communication_group',
    label: 'Communication',
    icon: <FontAwesomeIcon icon={faEnvelope} />,
    subTabs: [
      { id: 'crm_emails', label: 'Email Inbox', icon: <FontAwesomeIcon icon={faEnvelope} /> },
      { id: 'crm_email_accounts', label: 'Email Accounts', icon: <FontAwesomeIcon icon={faEnvelope} /> },
      { id: 'crm_email_templates', label: 'Templates', icon: <FontAwesomeIcon icon={faFileAlt} /> },
      { id: 'crm_sequences', label: 'Sequences', icon: <FontAwesomeIcon icon={faStream} /> },
    ]
  },
  {
    id: 'crm_automation_group',
    label: 'Automation',
    icon: <FontAwesomeIcon icon={faBolt} />,
    subTabs: [
      { id: 'crm_automations', label: 'Workflows', icon: <FontAwesomeIcon icon={faBolt} /> },
      { id: 'crm_campaigns', label: 'Campaigns', icon: <FontAwesomeIcon icon={faBullhorn} /> },
      { id: 'crm_lead_score', label: 'Lead Scoring', icon: <FontAwesomeIcon icon={faBullseye} /> },
    ]
  },
  {
    id: 'crm_data_group',
    label: 'Data',
    icon: <FontAwesomeIcon icon={faFileExport} />,
    subTabs: [
      { id: 'crm_imports', label: 'Import/Export', icon: <FontAwesomeIcon icon={faFileExport} /> },
      { id: 'crm_documents', label: 'Documents', icon: <FontAwesomeIcon icon={faFileAlt} /> },
      { id: 'crm_tags', label: 'Tags', icon: <FontAwesomeIcon icon={faTags} /> },
      { id: 'crm_custom_fields', label: 'Custom Fields', icon: <FontAwesomeIcon icon={faListAlt} /> },
    ]
  },
  {
    id: 'crm_intelligence_group',
    label: 'Intelligence',
    icon: <FontAwesomeIcon icon={faChartBar} />,
    subTabs: [
      { id: 'crm_analytics', label: 'Analytics', icon: <FontAwesomeIcon icon={faChartLine} /> },
      { id: 'crm_reports', label: 'Reports', icon: <FontAwesomeIcon icon={faChartBar} /> },
      { id: 'crm_audit', label: 'Audit Log', icon: <FontAwesomeIcon icon={faHistory} /> },
    ]
  },
  {
    id: 'crm_settings',
    label: 'Settings',
    icon: <FontAwesomeIcon icon={faCogs} />,
  },
];