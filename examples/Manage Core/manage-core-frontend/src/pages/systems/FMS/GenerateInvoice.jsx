import React from 'react';
import FmsInvoiceWorkspace from './FmsInvoiceWorkspace';

const GenerateInvoice = ({ isDark }) => (
  <FmsInvoiceWorkspace isDark={isDark} mode="generate" />
);

export default GenerateInvoice;
