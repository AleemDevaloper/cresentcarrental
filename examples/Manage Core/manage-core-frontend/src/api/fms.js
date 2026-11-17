import client from './client';

export const getFmsDashboard = () => client.get('/api/v1/fms/dashboard');

export const listCurrencies = (params = {}) => client.get('/api/v1/fms/currencies', { params });
export const getCurrency = (id) => client.get(`/api/v1/fms/currencies/${id}`);
export const createCurrency = (data) => client.post('/api/v1/fms/currencies', data);
export const updateCurrency = (id, data) => client.put(`/api/v1/fms/currencies/${id}`, data);
export const deleteCurrency = (id) => client.delete(`/api/v1/fms/currencies/${id}`);

export const listExchangeRates = (params = {}) => client.get('/api/v1/fms/exchange-rates', { params });
export const getExchangeRate = (id) => client.get(`/api/v1/fms/exchange-rates/${id}`);
export const createExchangeRate = (data) => client.post('/api/v1/fms/exchange-rates', data);
export const updateExchangeRate = (id, data) => client.put(`/api/v1/fms/exchange-rates/${id}`, data);
export const deleteExchangeRate = (id) => client.delete(`/api/v1/fms/exchange-rates/${id}`);

export const listFiscalYears = (params = {}) => client.get('/api/v1/fms/fiscal-years', { params });
export const getFiscalYear = (id) => client.get(`/api/v1/fms/fiscal-years/${id}`);
export const createFiscalYear = (data) => client.post('/api/v1/fms/fiscal-years', data);
export const updateFiscalYear = (id, data) => client.put(`/api/v1/fms/fiscal-years/${id}`, data);
export const deleteFiscalYear = (id) => client.delete(`/api/v1/fms/fiscal-years/${id}`);
export const closeFiscalYear = (id, data) => client.post(`/api/v1/fms/fiscal-years/${id}/close`, data);

export const listAccountTypes = (params = {}) => client.get('/api/v1/fms/account-types', { params });
export const getAccountType = (id) => client.get(`/api/v1/fms/account-types/${id}`);
export const createAccountType = (data) => client.post('/api/v1/fms/account-types', data);
export const updateAccountType = (id, data) => client.put(`/api/v1/fms/account-types/${id}`, data);
export const deleteAccountType = (id) => client.delete(`/api/v1/fms/account-types/${id}`);

export const listAccountGroups = (params = {}) => client.get('/api/v1/fms/account-groups', { params });
export const getAccountGroup = (id) => client.get(`/api/v1/fms/account-groups/${id}`);
export const createAccountGroup = (data) => client.post('/api/v1/fms/account-groups', data);
export const updateAccountGroup = (id, data) => client.put(`/api/v1/fms/account-groups/${id}`, data);
export const deleteAccountGroup = (id) => client.delete(`/api/v1/fms/account-groups/${id}`);

export const listChartOfAccounts = (params = {}) => client.get('/api/v1/fms/chart-of-accounts', { params });
export const getAccount = (id) => client.get(`/api/v1/fms/chart-of-accounts/${id}`);
export const createAccount = (data) => client.post('/api/v1/fms/chart-of-accounts', data);
export const updateAccount = (id, data) => client.put(`/api/v1/fms/chart-of-accounts/${id}`, data);
export const deleteAccount = (id) => client.delete(`/api/v1/fms/chart-of-accounts/${id}`);

// Chart of Accounts Import / Export / Template
export const exportChartOfAccounts = (format = 'csv', params = {}) =>
  client.get(`/api/v1/fms/chart-of-accounts-export/${format}`, { params, responseType: 'blob' });
export const importChartOfAccounts = (formData) =>
  client.post('/api/v1/fms/chart-of-accounts-import', formData);
export const downloadCoaTemplate = (format = 'csv') =>
  client.get(`/api/v1/fms/chart-of-accounts-template/${format}`, { responseType: 'blob' });
export const getCoaTemplateHeaders = () => client.get('/api/v1/fms/chart-of-accounts-template-headers');

export const listSalesDeliveries = (params = {}) => client.get('/api/v1/sales/deliveries', { params });

export const getWmsDashboard = (params = {}) => client.get('/api/v1/inventory/wms/dashboard', { params });
export const listWmsZones = (params = {}) => client.get('/api/v1/inventory/wms/zones', { params });
export const listWmsBins = (params = {}) => client.get('/api/v1/inventory/wms/bins', { params });
export const listWmsTasks = (params = {}) => client.get('/api/v1/inventory/wms/tasks', { params });
export const createWmsTask = (data) => client.post('/api/v1/inventory/wms/tasks', data);
export const updateWmsTask = (id, data) => client.put(`/api/v1/inventory/wms/tasks/${id}`, data);
export const listWmsWaves = (params = {}) => client.get('/api/v1/inventory/wms/waves', { params });

export const listPosCatalog = (params = {}) => client.get('/api/v1/pos/catalog', { params });
export const listPosTerminals = () => client.get('/api/v1/pos/terminals');
export const listPosSessions = (params = {}) => client.get('/api/v1/pos/sessions', { params });
export const openPosSession = (data) => client.post('/api/v1/pos/sessions', data);
export const listPosOrders = (params = {}) => client.get('/api/v1/pos/orders', { params });
export const checkoutPosOrder = (data) => client.post('/api/v1/pos/checkout', data);
export const searchPosReturnSales = (search) => client.get('/api/v1/pos/returns/search', { params: { search } });
export const getPosReturnableSale = (orderId) => client.get(`/api/v1/pos/orders/${orderId}/returnable`);
export const createPosReturn = (data) => client.post('/api/v1/pos/returns', data);
export const createPosRefund = (returnId, data) => client.post(`/api/v1/pos/returns/${returnId}/refund`, data);
export const listPosRegisters = () => client.get('/api/v1/pos/registers');
export const createPosRegister = (data) => client.post('/api/v1/pos/registers', data);
export const listPosCashDrawers = () => client.get('/api/v1/pos/cash-drawers');
export const createPosCashDrawer = (data) => client.post('/api/v1/pos/cash-drawers', data);
export const searchPosBarcode = (barcode) => client.get('/api/v1/pos/catalog/barcode', { params: { barcode } });
export const listPosPriceLists = () => client.get('/api/v1/pos/price-lists');
export const createPosProductPrice = (data) => client.post('/api/v1/pos/product-prices', data);
export const listPosDiscountRules = (params = {}) => client.get('/api/v1/pos/discount-rules', { params });
export const holdPosCart = (data) => client.post('/api/v1/pos/carts/hold', data);
export const listHeldPosCarts = (params = {}) => client.get('/api/v1/pos/carts/held', { params });
export const resumePosCart = (id) => client.post(`/api/v1/pos/carts/held/${id}/resume`);
export const getPosTransactionDetail = (id) => client.get(`/api/v1/pos/orders/${id}`);
export const changePosTransactionStatus = (id, status, data) => client.post(`/api/v1/pos/orders/${id}/${status}`, data);
export const getPosCashReconciliation = (params = {}) => client.get('/api/v1/pos/cash/reconciliation', { params });
export const getPosCashAlerts = () => client.get('/api/v1/pos/cash/alerts');
export const transferPosCash = (data) => client.post('/api/v1/pos/cash/transfers', data);
export const suspendPosSession = (sessionId, data) => client.post(`/api/v1/pos/sessions/${sessionId}/suspend`, data);
export const resumePosSession = (sessionId) => client.post(`/api/v1/pos/sessions/${sessionId}/resume`);
export const reconcilePosSession = (sessionId, data) => client.post(`/api/v1/pos/sessions/${sessionId}/reconciliations`, data);
export const approvePosReconciliation = (id) => client.post(`/api/v1/pos/reconciliations/${id}/approve`);
export const createPosTerminal = (data) => client.post('/api/v1/pos/terminals', data);
export const updatePosTerminal = (id, data) => client.put(`/api/v1/pos/terminals/${id}`, data);
export const sendPosHeartbeat = (id, data = {}) => client.post(`/api/v1/pos/terminals/${id}/heartbeat`, data);
export const addPosCashMovement = (sessionId, data) => client.post(`/api/v1/pos/sessions/${sessionId}/cash-movements`, data);
export const closePosSession = (sessionId, data) => client.post(`/api/v1/pos/sessions/${sessionId}/close`, data);
export const getPosSession = (sessionId) => client.get(`/api/v1/pos/sessions/${sessionId}`);
export const addPosCashCount = (sessionId, data) => client.post(`/api/v1/pos/sessions/${sessionId}/cash-counts`, data);
export const reopenPosSession = (sessionId, data) => client.post(`/api/v1/pos/sessions/${sessionId}/reopen`, data);
export const lockPosSession = (sessionId) => client.post(`/api/v1/pos/sessions/${sessionId}/lock`);
export const unlockPosSession = (sessionId) => client.post(`/api/v1/pos/sessions/${sessionId}/unlock`);

export const listOpeningBalances = (params = {}) => client.get('/api/v1/fms/opening-balances', { params });
export const getOpeningBalance = (id) => client.get(`/api/v1/fms/opening-balances/${id}`);
export const createOpeningBalance = (data) => client.post('/api/v1/fms/opening-balances', data);
export const updateOpeningBalance = (id, data) => client.put(`/api/v1/fms/opening-balances/${id}`, data);
export const deleteOpeningBalance = (id) => client.delete(`/api/v1/fms/opening-balances/${id}`);
export const postOpeningBalances = (data) => client.post('/api/v1/fms/opening-balances/post', data);

export const getAccountingSettings = () => client.get('/api/v1/fms/accounting-settings');
export const saveAccountingSettings = (data) => client.put('/api/v1/fms/accounting-settings', data);
export const getAuditLogs = (params = {}) => client.get('/api/v1/fms/accounting-settings/audit-logs', { params });

export const exportSettings = () => client.get('/api/v1/fms/accounting-settings/export', { responseType: 'blob' });

export const exportQuotations = (format) => client.get(`/api/v1/fms/quotations/export/${format}`, { responseType: 'blob' });
export const exportSalesOrders = (format) => client.get(`/api/v1/fms/sales-orders/export/${format}`, { responseType: 'blob' });
export const exportDeliveryChallans = (format) => client.get(`/api/v1/fms/delivery-challans/export/${format}`, { responseType: 'blob' });
export const exportSalesInvoices = (format) => client.get(`/api/v1/fms/sales-invoices/export/${format}`, { responseType: 'blob' });
export const exportCreditNotes = (format) => client.get(`/api/v1/fms/credit-notes/export/${format}`, { responseType: 'blob' });
export const exportSalesReturns = (format) => client.get(`/api/v1/fms/sales-returns/export/${format}`, { responseType: 'blob' });
export const importSettings = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return client.post('/api/v1/fms/accounting-settings/import', formData);
};

export const listFiscalPeriods = (fiscalYearId) => client.get(`/api/v1/fms/fiscal-years/${fiscalYearId}/periods`);
export const lockFiscalPeriod = (fiscalYearId, periodId) => client.post(`/api/v1/fms/fiscal-years/${fiscalYearId}/periods/${periodId}/lock`);
export const unlockFiscalPeriod = (fiscalYearId, periodId) => client.post(`/api/v1/fms/fiscal-years/${fiscalYearId}/periods/${periodId}/unlock`);

export const listQuotations = (params = {}) => client.get('/api/v1/fms/quotations', { params });
export const getQuotation = (id) => client.get(`/api/v1/fms/quotations/${id}`);
export const createQuotation = (data) => client.post('/api/v1/fms/quotations', data);
export const updateQuotation = (id, data) => client.put(`/api/v1/fms/quotations/${id}`, data);
export const deleteQuotation = (id) => client.delete(`/api/v1/fms/quotations/${id}`);
export const convertQuotationToSalesOrder = (id) => client.post(`/api/v1/fms/quotations/${id}/convert`);

export const listSalesOrders = (params = {}) => client.get('/api/v1/fms/sales-orders', { params });
export const getSalesOrder = (id) => client.get(`/api/v1/fms/sales-orders/${id}`);
export const createSalesOrder = (data) => client.post('/api/v1/fms/sales-orders', data);
export const updateSalesOrder = (id, data) => client.put(`/api/v1/fms/sales-orders/${id}`, data);
export const deleteSalesOrder = (id) => client.delete(`/api/v1/fms/sales-orders/${id}`);

export const listDeliveryChallans = (params = {}) => client.get('/api/v1/fms/delivery-challans', { params });
export const getDeliveryChallan = (id) => client.get(`/api/v1/fms/delivery-challans/${id}`);
export const createDeliveryChallan = (data) => client.post('/api/v1/fms/delivery-challans', data);
export const updateDeliveryChallan = (id, data) => client.put(`/api/v1/fms/delivery-challans/${id}`, data);
export const deleteDeliveryChallan = (id) => client.delete(`/api/v1/fms/delivery-challans/${id}`);

export const listSalesInvoices = (params = {}) => client.get('/api/v1/fms/sales-invoices', { params });
export const getSalesInvoice = (id) => client.get(`/api/v1/fms/sales-invoices/${id}`);
export const createSalesInvoice = (data) => client.post('/api/v1/fms/sales-invoices', data);
export const updateSalesInvoice = (id, data) => client.put(`/api/v1/fms/sales-invoices/${id}`, data);
export const deleteSalesInvoice = (id) => client.delete(`/api/v1/fms/sales-invoices/${id}`);

export const createSalesInvoiceShare = (id, data = {}) => client.post(`/api/v1/fms/sales-invoices/${id}/share`, data);
export const revokeSalesInvoiceShare = (id) => client.delete(`/api/v1/fms/sales-invoices/${id}/share`);
export const getPublicSalesInvoice = (token) =>
  client.get(`/api/v1/public/invoices/${token}`, { skipCache: true, skipAuthRedirect: true });

export const listCreditNotes = (params = {}) => client.get('/api/v1/fms/credit-notes', { params });
export const getCreditNote = (id) => client.get(`/api/v1/fms/credit-notes/${id}`);
export const createCreditNote = (data) => client.post('/api/v1/fms/credit-notes', data);
export const updateCreditNote = (id, data) => client.put(`/api/v1/fms/credit-notes/${id}`, data);
export const deleteCreditNote = (id) => client.delete(`/api/v1/fms/credit-notes/${id}`);
export const convertCreditNoteToRefund = (id) => client.post(`/api/v1/fms/credit-notes/${id}/convert-refund`);

export const listSalesReturns = (params = {}) => client.get('/api/v1/fms/sales-returns', { params });
export const getSalesReturn = (id) => client.get(`/api/v1/fms/sales-returns/${id}`);
export const createSalesReturn = (data) => client.post('/api/v1/fms/sales-returns', data);
export const updateSalesReturn = (id, data) => client.put(`/api/v1/fms/sales-returns/${id}`, data);
export const deleteSalesReturn = (id) => client.delete(`/api/v1/fms/sales-returns/${id}`);

// Generic FMS Tab Data API (used by 30+ tab components)
export const getTabData = (entity, params = {}) => client.get(`/api/v1/fms/tab-data/${entity}`, { params });
export const getTabDataItem = (entity, id) => client.get(`/api/v1/fms/tab-data/${entity}/${id}`);
export const createTabData = (entity, data) => client.post(`/api/v1/fms/tab-data/${entity}`, data);
export const updateTabData = (entity, id, data) => client.put(`/api/v1/fms/tab-data/${entity}/${id}`, data);
export const deleteTabData = (entity, id) => client.delete(`/api/v1/fms/tab-data/${entity}/${id}`);

export const listContractors = (params = {}) => client.get('/api/v1/fms/contractors', { params });
export const getContractor = (id) => client.get(`/api/v1/fms/contractors/${id}`);
export const createContractor = (data) => client.post('/api/v1/fms/contractors', data);
export const updateContractor = (id, data) => client.put(`/api/v1/fms/contractors/${id}`, data);
export const deleteContractor = (id) => client.delete(`/api/v1/fms/contractors/${id}`);

export const listExpenseClaims = (params = {}) => client.get('/api/v1/fms/expense-claims', { params });
export const getExpenseClaim = (id) => client.get(`/api/v1/fms/expense-claims/${id}`);
export const createExpenseClaim = (data) => client.post('/api/v1/fms/expense-claims', data);
export const updateExpenseClaim = (id, data) => client.put(`/api/v1/fms/expense-claims/${id}`, data);
export const deleteExpenseClaim = (id) => client.delete(`/api/v1/fms/expense-claims/${id}`);

// ---------------------------------------------------------------------------
// ERP Module — tenant-scoped master data (vendors, cost centers, assets, etc.)
// ---------------------------------------------------------------------------

// Vendors
export const listVendors = (params = {}) => client.get('/api/v1/vendors', { params });
export const getVendor = (id) => client.get(`/api/v1/vendors/${id}`);
export const createVendor = (data) => client.post('/api/v1/vendors', data);
export const updateVendor = (id, data) => client.put(`/api/v1/vendors/${id}`, data);
export const deleteVendor = (id) => client.delete(`/api/v1/vendors/${id}`);

// Vendor Payments
export const listVendorPayments = (params = {}) => client.get('/api/v1/vendor-payments', { params });
export const getVendorPayment = (id) => client.get(`/api/v1/vendor-payments/${id}`);
export const createVendorPayment = (data) => client.post('/api/v1/vendor-payments', data);
export const updateVendorPayment = (id, data) => client.put(`/api/v1/vendor-payments/${id}`, data);
export const deleteVendorPayment = (id) => client.delete(`/api/v1/vendor-payments/${id}`);

// Cost Centers
export const listCostCenters = (params = {}) => client.get('/api/v1/cost-centers', { params });
export const getCostCenter = (id) => client.get(`/api/v1/cost-centers/${id}`);
export const createCostCenter = (data) => client.post('/api/v1/cost-centers', data);
export const updateCostCenter = (id, data) => client.put(`/api/v1/cost-centers/${id}`, data);
export const deleteCostCenter = (id) => client.delete(`/api/v1/cost-centers/${id}`);

// Analytic Accounts
export const listAnalyticAccounts = (params = {}) => client.get('/api/v1/analytic-accounts', { params });
export const getAnalyticAccount = (id) => client.get(`/api/v1/analytic-accounts/${id}`);
export const createAnalyticAccount = (data) => client.post('/api/v1/analytic-accounts', data);
export const updateAnalyticAccount = (id, data) => client.put(`/api/v1/analytic-accounts/${id}`, data);
export const deleteAnalyticAccount = (id) => client.delete(`/api/v1/analytic-accounts/${id}`);

// Budget Alerts
export const listBudgetAlerts = (params = {}) => client.get('/api/v1/budget-alerts', { params });
export const getBudgetAlert = (id) => client.get(`/api/v1/budget-alerts/${id}`);
export const createBudgetAlert = (data) => client.post('/api/v1/budget-alerts', data);
export const updateBudgetAlert = (id, data) => client.put(`/api/v1/budget-alerts/${id}`, data);
export const deleteBudgetAlert = (id) => client.delete(`/api/v1/budget-alerts/${id}`);

// Asset Locations
export const listAssetLocations = (params = {}) => client.get('/api/v1/asset-locations', { params });
export const getAssetLocation = (id) => client.get(`/api/v1/asset-locations/${id}`);
export const createAssetLocation = (data) => client.post('/api/v1/asset-locations', data);
export const updateAssetLocation = (id, data) => client.put(`/api/v1/asset-locations/${id}`, data);
export const deleteAssetLocation = (id) => client.delete(`/api/v1/asset-locations/${id}`);

// Asset Depreciations
export const listAssetDepreciations = (params = {}) => client.get('/api/v1/asset-depreciations', { params });
export const getAssetDepreciation = (id) => client.get(`/api/v1/asset-depreciations/${id}`);
export const createAssetDepreciation = (data) => client.post('/api/v1/asset-depreciations', data);
export const updateAssetDepreciation = (id, data) => client.put(`/api/v1/asset-depreciations/${id}`, data);
export const deleteAssetDepreciation = (id) => client.delete(`/api/v1/asset-depreciations/${id}`);

// Asset Disposals
export const listAssetDisposals = (params = {}) => client.get('/api/v1/asset-disposals', { params });
export const getAssetDisposal = (id) => client.get(`/api/v1/asset-disposals/${id}`);
export const createAssetDisposal = (data) => client.post('/api/v1/asset-disposals', data);
export const updateAssetDisposal = (id, data) => client.put(`/api/v1/asset-disposals/${id}`, data);
export const deleteAssetDisposal = (id) => client.delete(`/api/v1/asset-disposals/${id}`);

// Products
export const listProducts = (params = {}) => client.get('/api/v1/products', { params });
export const getProductsDashboard = (params = {}) => client.get('/api/v1/products-dashboard', { params });
export const searchProducts = (q) => client.get('/api/v1/products-search', { params: { q } });
export const getProduct = (id) => client.get(`/api/v1/products/${id}`);
export const createProduct = (data) => client.post('/api/v1/products', data);
export const updateProduct = (id, data) => client.put(`/api/v1/products/${id}`, data);
export const deleteProduct = (id) => client.delete(`/api/v1/products/${id}`);
export const listInventoryStockLevels = (params = {}) => client.get('/api/v1/inventory/stock-levels', { params });
export const createInventoryMovement = (data) => client.post('/api/v1/inventory/movements', data);
export const listInventoryReservations = (params = {}) => client.get('/api/v1/inventory/reservations', { params });
export const reserveInventoryStock = (data) => client.post('/api/v1/inventory/reservations', data);
export const listBrands = (params = {}) => client.get('/api/v1/brands', { params });
export const createBrand = (data) => client.post('/api/v1/brands', data);
export const updateBrand = (id, data) => client.put(`/api/v1/brands/${id}`, data);
export const deleteBrand = (id) => client.delete(`/api/v1/brands/${id}`);
export const listProductVariants = (productId) => client.get(`/api/v1/products/${productId}/variants`);
export const createProductVariant = (productId, data) => client.post(`/api/v1/products/${productId}/variants`, data);
export const updateProductVariant = (id, data) => client.put(`/api/v1/product-variants/${id}`, data);
export const deleteProductVariant = (id) => client.delete(`/api/v1/product-variants/${id}`);
export const listWarehouseLocations = (warehouseId) => client.get(`/api/v1/warehouses/${warehouseId}/locations`);
export const createWarehouseLocation = (warehouseId, data) => client.post(`/api/v1/warehouses/${warehouseId}/locations`, data);
export const updateWarehouseLocation = (id, data) => client.put(`/api/v1/warehouse-locations/${id}`, data);
export const deleteWarehouseLocation = (id) => client.delete(`/api/v1/warehouse-locations/${id}`);
export const listStockLedger = (params = {}) => client.get('/api/v1/stock-ledger', { params });
export const createStockLedgerEntry = (data) => client.post('/api/v1/stock-ledger', data);

// Advanced inventory control
export const listInventoryBatches = (params = {}) => client.get('/api/v1/inventory/batches', { params });
export const createInventoryBatch = (data) => client.post('/api/v1/inventory/batches', data);
export const updateInventoryBatch = (id, data) => client.put(`/api/v1/inventory/batches/${id}`, data);
export const listInventorySerials = (params = {}) => client.get('/api/v1/inventory/serials', { params });
export const createInventorySerial = (data) => client.post('/api/v1/inventory/serials', data);
export const updateInventorySerial = (id, data) => client.put(`/api/v1/inventory/serials/${id}`, data);
export const listInventoryStockCounts = (params = {}) => client.get('/api/v1/inventory/stock-counts', { params });
export const createInventoryStockCount = (data) => client.post('/api/v1/inventory/stock-counts', data);
export const submitInventoryCountItem = (id, data) => client.post(`/api/v1/inventory/stock-counts/${id}/items`, data);
export const approveInventoryStockCount = (id) => client.post(`/api/v1/inventory/stock-counts/${id}/approve`);
export const reconcileInventoryStockCount = (id) => client.post(`/api/v1/inventory/stock-counts/${id}/reconcile`);
export const listInventoryReorderRules = (params = {}) => client.get('/api/v1/inventory/reorder-rules', { params });
export const createInventoryReorderRule = (data) => client.post('/api/v1/inventory/reorder-rules', data);
export const listInventoryAlerts = (params = {}) => client.get('/api/v1/inventory/alerts', { params });
export const resolveInventoryAlert = (id) => client.post(`/api/v1/inventory/alerts/${id}/resolve`);
export const getInventoryAllocation = (data) => client.post('/api/v1/inventory/allocation', data);
export const getInventoryHealth = (params = {}) => client.get('/api/v1/inventory/health', { params });

// Purchasing and purchase-to-stock flow
export const listSupplierProducts = (params = {}) => client.get('/api/v1/purchasing/supplier-products', { params });
export const createSupplierProduct = (data) => client.post('/api/v1/purchasing/supplier-products', data);
export const listPurchaseRequisitions = (params = {}) => client.get('/api/v1/purchasing/requisitions', { params });
export const createPurchaseRequisition = (data) => client.post('/api/v1/purchasing/requisitions', data);
export const listPurchaseOrders = (params = {}) => client.get('/api/v1/purchasing/purchase-orders', { params });
export const createPurchaseOrder = (data) => client.post('/api/v1/purchasing/purchase-orders', data);
export const approvePurchaseOrder = (id) => client.post(`/api/v1/purchasing/purchase-orders/${id}/approve`);
export const listGoodsReceipts = (params = {}) => client.get('/api/v1/purchasing/goods-receipts', { params });
export const createGoodsReceipt = (data) => client.post('/api/v1/purchasing/goods-receipts', data);
export const postGoodsReceipt = (id) => client.post(`/api/v1/purchasing/goods-receipts/${id}/post`);
export const listPurchaseReturns = (params = {}) => client.get('/api/v1/purchasing/returns', { params });
export const createPurchaseReturn = (data) => client.post('/api/v1/purchasing/returns', data);
export const postPurchaseReturn = (id) => client.post(`/api/v1/purchasing/returns/${id}/post`);

// Product Categories
export const listProductCategories = (params = {}) => client.get('/api/v1/product-categories', { params });
export const getProductCategory = (id) => client.get(`/api/v1/product-categories/${id}`);
export const createProductCategory = (data) => client.post('/api/v1/product-categories', data);
export const updateProductCategory = (id, data) => client.put(`/api/v1/product-categories/${id}`, data);
export const deleteProductCategory = (id) => client.delete(`/api/v1/product-categories/${id}`);

// UOMs
export const listUoms = (params = {}) => client.get('/api/v1/uoms', { params });
export const getUom = (id) => client.get(`/api/v1/uoms/${id}`);
export const createUom = (data) => client.post('/api/v1/uoms', data);
export const updateUom = (id, data) => client.put(`/api/v1/uoms/${id}`, data);
export const deleteUom = (id) => client.delete(`/api/v1/uoms/${id}`);

// Stock Transfers
export const listStockTransfers = (params = {}) => client.get('/api/v1/stock-transfers', { params });
export const getStockTransfer = (id) => client.get(`/api/v1/stock-transfers/${id}`);
export const createStockTransfer = (data) => client.post('/api/v1/stock-transfers', data);
export const updateStockTransfer = (id, data) => client.put(`/api/v1/stock-transfers/${id}`, data);
export const deleteStockTransfer = (id) => client.delete(`/api/v1/stock-transfers/${id}`);

// Journal Entries
export const listJournalEntries = (params = {}) => client.get('/api/v1/journal-entries', { params });
export const getJournalEntry = (id) => client.get(`/api/v1/journal-entries/${id}`);
export const createJournalEntry = (data) => client.post('/api/v1/journal-entries', data);
export const updateJournalEntry = (id, data) => client.put(`/api/v1/journal-entries/${id}`, data);
export const deleteJournalEntry = (id) => client.delete(`/api/v1/journal-entries/${id}`);
export const postJournalEntry = (id) => client.post(`/api/v1/journal-entries/${id}/post`);
export const reverseJournalEntry = (id) => client.post(`/api/v1/journal-entries/${id}/reverse`);
