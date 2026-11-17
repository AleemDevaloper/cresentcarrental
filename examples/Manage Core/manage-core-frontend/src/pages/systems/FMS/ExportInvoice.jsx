import React from 'react';
import FmsInvoiceWorkspace from './FmsInvoiceWorkspace';

const ExportInvoice = ({ isDark }) => (
  <FmsInvoiceWorkspace isDark={isDark} mode="export" />
);

export default ExportInvoice;
