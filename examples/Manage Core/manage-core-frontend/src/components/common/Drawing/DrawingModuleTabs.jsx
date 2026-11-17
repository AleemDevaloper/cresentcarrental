import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faPalette,
  faUsers,
  faClock,
  faStar,
  faBookOpen,
  faCircle,
  faProjectDiagram,
  faCrop,
  faBrain,
  faNetworkWired,
  faSitemap,
  faWindowMaximize,
  faLayerGroup,
  faTv,
  faFolderOpen,
  faIcons,
  faImage,
  faFont,
  faIdCard,
  faFolder,
  faCalendarDays,
  faPaperclip,
  faArchive,
  faTrash,
  faBuilding
} from "@fortawesome/free-solid-svg-icons";

/**
 * Returns the exact module tabs configuration for Drawing Studio.
 * 
 * @param {Function} t - Translation function
 * @returns {Array} List of tab configurations matching user specifications.
 */
export const getDrawingModuleTabs = (t) => [
  { id: 'drawing_overview', label: 'Dashboard', icon: <FontAwesomeIcon icon={faHome} /> },
  { id: 'drawing_my_drawings', label: 'My Drawings', icon: <FontAwesomeIcon icon={faPalette} /> },
  { id: 'drawing_shared', label: 'Shared Drawings', icon: <FontAwesomeIcon icon={faUsers} /> },
  { id: 'drawing_recent', label: 'Recent', icon: <FontAwesomeIcon icon={faClock} /> },
  { id: 'drawing_favorites', label: 'Favorites', icon: <FontAwesomeIcon icon={faStar} /> },
  { id: 'drawing_templates', label: 'Templates', icon: <FontAwesomeIcon icon={faBookOpen} /> },
  
  // Categorized modes
  {
    id: 'drawing_types_group',
    label: 'Design Categories',
    icon: <FontAwesomeIcon icon={faLayerGroup} />,
    subTabs: [
      { id: 'drawing_whiteboards', label: 'Whiteboards', icon: <FontAwesomeIcon icon={faCircle} /> },
      { id: 'drawing_flowcharts', label: 'Flowcharts', icon: <FontAwesomeIcon icon={faProjectDiagram} /> },
      { id: 'drawing_wireframes', label: 'Wireframes', icon: <FontAwesomeIcon icon={faCrop} /> },
      { id: 'drawing_mind_maps', label: 'Mind Maps', icon: <FontAwesomeIcon icon={faBrain} /> },
      { id: 'drawing_network', label: 'Network Diagrams', icon: <FontAwesomeIcon icon={faNetworkWired} /> },
      { id: 'drawing_org_charts', label: 'Organization Charts', icon: <FontAwesomeIcon icon={faSitemap} /> },
      { id: 'drawing_ui_mockups', label: 'UI Mockups', icon: <FontAwesomeIcon icon={faWindowMaximize} /> },
      { id: 'drawing_canvases', label: 'Canvases', icon: <FontAwesomeIcon icon={faPalette} /> },
      { id: 'drawing_presentations', label: 'Presentations', icon: <FontAwesomeIcon icon={faTv} /> },
    ]
  },

  // Assets Group
  {
    id: 'drawing_assets_group',
    label: 'Assets Library',
    icon: <FontAwesomeIcon icon={faFolderOpen} />,
    subTabs: [
      { id: 'drawing_assets', label: 'Assets Manager', icon: <FontAwesomeIcon icon={faFolderOpen} /> },
      { id: 'drawing_icons', label: 'Icons', icon: <FontAwesomeIcon icon={faIcons} /> },
      { id: 'drawing_images', label: 'Images', icon: <FontAwesomeIcon icon={faImage} /> },
      { id: 'drawing_fonts', label: 'Fonts', icon: <FontAwesomeIcon icon={faFont} /> },
      { id: 'drawing_brand_kit', label: 'Brand Kit', icon: <FontAwesomeIcon icon={faIdCard} /> },
    ]
  },

  // Projects & Integration Group
  {
    id: 'drawing_integration_group',
    label: 'Integrations',
    icon: <FontAwesomeIcon icon={faFolder} />,
    subTabs: [
      { id: 'drawing_projects', label: 'Projects', icon: <FontAwesomeIcon icon={faFolder} /> },
      { id: 'drawing_meetings', label: 'Meeting Drawings', icon: <FontAwesomeIcon icon={faCalendarDays} /> },
      { id: 'drawing_attachments', label: 'Attachments', icon: <FontAwesomeIcon icon={faPaperclip} /> },
    ]
  },

  { id: 'drawing_archive', label: 'Archive', icon: <FontAwesomeIcon icon={faArchive} /> },
  { id: 'drawing_trash', label: 'Trash', icon: <FontAwesomeIcon icon={faTrash} /> },

  { id: 'drawing_enterprise_admin', label: 'Enterprise Admin', icon: <FontAwesomeIcon icon={faBuilding} /> },
];
export default getDrawingModuleTabs;
