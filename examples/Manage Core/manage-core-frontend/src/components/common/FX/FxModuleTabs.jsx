import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome, faGlobe, faArrowRightArrowLeft, faMoneyBillWave, faCalculator, faTrashCan,
} from "@fortawesome/free-solid-svg-icons";

export const getFxModuleTabs = (t) => [
  { id: 'fx_overview', label: 'FX Dashboard', icon: <FontAwesomeIcon icon={faHome} /> },
  { id: 'fx_currencies', label: 'Currencies', icon: <FontAwesomeIcon icon={faGlobe} /> },
  { id: 'fx_exchange_rates', label: 'Exchange Rates', icon: <FontAwesomeIcon icon={faArrowRightArrowLeft} /> },
  { id: 'fx_transactions', label: 'FX Transactions', icon: <FontAwesomeIcon icon={faMoneyBillWave} /> },
  { id: 'fx_revaluations', label: 'Revaluations', icon: <FontAwesomeIcon icon={faCalculator} /> },
  { id: 'fx_trash', label: 'Trash', icon: <FontAwesomeIcon icon={faTrashCan} /> },
];
