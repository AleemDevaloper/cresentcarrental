import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGauge,
  faPlus,
  faComments,
  faProjectDiagram,
  faBookOpen,
  faDatabase,
  faTools,
  faFolderOpen,
  faUsers,
  faChartBar,
  faBolt,
  faCog,
  faArchive,
  faTrash,
  faGraduationCap,
} from "@fortawesome/free-solid-svg-icons";

/**
 * Returns the module tabs configuration for AI Workspace.
 * 
 * @param {Function} t - Translation function
 * @returns {Array} List of tab configurations
 */
export const getAiModuleTabs = (t) => [
  { id: 'ai_dashboard', label: t('dashboard') || 'Dashboard', icon: <FontAwesomeIcon icon={faGauge} /> },
  { id: 'ai_new_chat', label: t('new_chat') || 'New Chat', icon: <FontAwesomeIcon icon={faPlus} /> },
  { id: 'ai_recent_chats', label: t('recent_chats') || 'Recent Chats', icon: <FontAwesomeIcon icon={faComments} /> },
  { id: 'ai_projects', label: t('projects') || 'Projects', icon: <FontAwesomeIcon icon={faProjectDiagram} /> },
  { id: 'ai_prompt_library', label: t('prompt_library') || 'Prompt Library', icon: <FontAwesomeIcon icon={faBookOpen} /> },
  { id: 'ai_knowledge_base', label: t('knowledge_base') || 'Knowledge Base', icon: <FontAwesomeIcon icon={faDatabase} /> },
  { id: 'ai_tools', label: t('ai_tools') || 'AI Tools', icon: <FontAwesomeIcon icon={faTools} /> },
  { id: 'ai_files', label: t('files') || 'Files', icon: <FontAwesomeIcon icon={faFolderOpen} /> },
  { id: 'ai_shared_chats', label: t('shared_chats') || 'Shared Chats', icon: <FontAwesomeIcon icon={faUsers} /> },
  { id: 'ai_analytics', label: t('analytics') || 'Analytics', icon: <FontAwesomeIcon icon={faChartBar} /> },
  { id: 'ai_automations', label: t('automations') || 'Automations', icon: <FontAwesomeIcon icon={faBolt} /> },
  { id: 'ai_training_center', label: t('training_center') || 'AI Training', icon: <FontAwesomeIcon icon={faGraduationCap} /> },
  { id: 'ai_settings', label: t('ai_settings') || 'AI Settings', icon: <FontAwesomeIcon icon={faCog} /> },
  { id: 'ai_archive', label: t('archive') || 'Archive', icon: <FontAwesomeIcon icon={faArchive} /> },
  { id: 'ai_trash', label: t('trash') || 'Trash', icon: <FontAwesomeIcon icon={faTrash} /> },
];
