import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faIndustry,
  faClipboardList,
  faTools,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

export const getMfgModuleTabs = (t) => [
  { id: 'mfg_overview', label: 'MRP Dashboard', icon: <FontAwesomeIcon icon={faHome} /> },
  { id: 'mfg_bill_of_materials', label: 'Bill of Materials (BOM)', icon: <FontAwesomeIcon icon={faClipboardList} /> },
  { id: 'mfg_production_orders', label: 'Production Orders', icon: <FontAwesomeIcon icon={faIndustry} /> },
  { id: 'mfg_work_orders', label: 'Work Orders', icon: <FontAwesomeIcon icon={faTools} /> },
  { id: 'mfg_trash', label: 'Trash', icon: <FontAwesomeIcon icon={faTrashCan} /> },
];
