import client from './client';

// Re-export all FMS/ERP API functions used by AMS
export {
  listFiscalYears, getFiscalYear, createFiscalYear, updateFiscalYear, deleteFiscalYear,
  listFiscalPeriods, lockFiscalPeriod, unlockFiscalPeriod,
  listAccountTypes, createAccountType, updateAccountType, deleteAccountType,
  listAccountGroups, createAccountGroup, updateAccountGroup, deleteAccountGroup,
  listChartOfAccounts, getAccount, createAccount, updateAccount, deleteAccount,
  listOpeningBalances, createOpeningBalance, updateOpeningBalance, deleteOpeningBalance, postOpeningBalances,
  getAccountingSettings, saveAccountingSettings, getAuditLogs,
  listQuotations, createQuotation, updateQuotation, deleteQuotation, convertQuotationToSalesOrder,
  listSalesOrders, createSalesOrder, updateSalesOrder, deleteSalesOrder,
  listDeliveryChallans, createDeliveryChallan, updateDeliveryChallan, deleteDeliveryChallan,
  listSalesInvoices, createSalesInvoice, updateSalesInvoice, deleteSalesInvoice,
  listCreditNotes, createCreditNote, updateCreditNote, deleteCreditNote, convertCreditNoteToRefund,
  listSalesReturns, createSalesReturn, updateSalesReturn, deleteSalesReturn,
  listVendors, createVendor, updateVendor, deleteVendor,
  listVendorPayments, createVendorPayment, updateVendorPayment, deleteVendorPayment,
  listCostCenters, createCostCenter, updateCostCenter, deleteCostCenter,
  listAnalyticAccounts, createAnalyticAccount, updateAnalyticAccount, deleteAnalyticAccount,
  listBudgetAlerts, createBudgetAlert, updateBudgetAlert, deleteBudgetAlert,
  listAssetLocations, createAssetLocation, updateAssetLocation, deleteAssetLocation,
  listAssetDepreciations, createAssetDepreciation, updateAssetDepreciation, deleteAssetDepreciation,
  listAssetDisposals, createAssetDisposal, updateAssetDisposal, deleteAssetDisposal,
  listProducts, createProduct, updateProduct, deleteProduct,
  listProductCategories, createProductCategory, updateProductCategory, deleteProductCategory,
  listUoms, createUom, updateUom, deleteUom,
  listStockTransfers, createStockTransfer, updateStockTransfer, deleteStockTransfer,
  getTabData, getTabDataItem,
} from './fms';

export {
  listFiscalYears as listAccountingFiscalYears,
  createFiscalYear as createAccountingFiscalYear,
  updateFiscalYear as updateAccountingFiscalYear,
  deleteFiscalYear as deleteAccountingFiscalYear,
  listAccountTypes as listAccountingAccountTypes,
  createAccountType as createAccountingAccountType,
  listAccountGroups as listAccountingAccountGroups,
  createAccountGroup as createAccountingAccountGroup,
  listAccounts, createAccount as createAccountingAccount,
  listOpeningBalances as listAccountingOpeningBalances,
} from './accounting';

export {
  getAssetStats, listAssets, createAsset, updateAsset, deleteAsset,
  listAssetCategories, createAssetCategory, updateAssetCategory, deleteAssetCategory,
} from './enterprise';

// AMS-specific API endpoints

// Dashboard
export const getAmsDashboard = () => client.get('/api/v1/fms/dashboard');

// Warehouses (via ERP routes)
export const listWarehouses = (params = {}) => client.get('/api/v1/warehouses', { params });
export const getWarehouse = (id) => client.get(`/api/v1/warehouses/${id}`);
export const createWarehouse = (data) => client.post('/api/v1/warehouses', data);
export const updateWarehouse = (id, data) => client.put(`/api/v1/warehouses/${id}`, data);
export const deleteWarehouse = (id) => client.delete(`/api/v1/warehouses/${id}`);

// Stock Movements (via inventory routes)
export const listStockMovements = (params = {}) => client.get('/api/v1/inventory', { params });
export const createStockMovement = (data) => client.post('/api/v1/inventory', data);

// Warehouses Stats
export const getWarehouseStats = () => client.get('/api/v1/warehouses/stats');

// Payments & Transactions (for Banking)
export const listPayments = (params = {}) => client.get('/api/v1/payments/transactions', { params });
export const getPaymentMetrics = () => client.get('/api/v1/payments/metrics');
export const getPaymentRevenue = (params = {}) => client.get('/api/v1/payments/revenue', { params });
export const getPaymentSplit = () => client.get('/api/v1/payments/split');

// Investments
export const listInvestments = (params = {}) => client.get('/api/v1/investments', { params });
export const getInvestmentStats = () => client.get('/api/v1/investments/stats');

// Loans
export const listLoans = (params = {}) => client.get('/api/v1/loans', { params });
export const getLoanStats = () => client.get('/api/v1/loans/stats');

// ============================================================================
// CSV Import / Export APIs
// ============================================================================

// Generic Import/Export (Common routes)
export const importData = (file, entity) => {
  const formData = new FormData();
  formData.append('file', file);
  if (entity) formData.append('entity', entity);
  return client.post('/api/v1/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const exportData = (entity, format = 'csv', params = {}) =>
  client.post('/api/v1/export', { entity, format, ...params }, { responseType: 'blob' });

// HRMS CSV Import (full lifecycle)
export const listCsvImports = (params = {}) => client.get('/api/v1/hrms/csv-imports', { params });
export const previewCsvImport = (file, type) => {
  const formData = new FormData();
  formData.append('file', file);
  if (type) formData.append('type', type);
  return client.post('/api/v1/hrms/csv-imports/preview', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const executeCsvImport = (data) => client.post('/api/v1/hrms/csv-imports/import', data);
export const getCsvImportMapping = (type) => client.get(`/api/v1/hrms/csv-imports/mapping`, { params: { type } });
export const validateCsvImport = (data) => client.post('/api/v1/hrms/csv-imports/validate', data);
export const rollbackCsvImport = (id) => client.post(`/api/v1/hrms/csv-imports/rollback`, { id });
export const getCsvImportTemplate = (type) =>
  client.get(`/api/v1/hrms/csv-imports/template/${type}`, { responseType: 'blob' });
export const getCsvImportLogs = (params = {}) => client.get('/api/v1/hrms/csv-imports/logs', { params });

// FMS Export endpoints
export const exportFmsData = (entity, format = 'csv') =>
  client.get(`/api/v1/fms/${entity}/export/${format}`, { responseType: 'blob' });

// Bank Export
export const listBankExports = (params = {}) => client.get('/api/v1/bank-exports', { params });
export const createBankExport = (data) => client.post('/api/v1/bank-exports', data);
export const getBankExportStats = () => client.get('/api/v1/bank-exports/stats');
export const downloadBankExport = (id) =>
  client.get(`/api/v1/bank-exports/${id}/download`, { responseType: 'blob' });
export const retryBankExport = (id) => client.post(`/api/v1/bank-exports/${id}/retry`);
