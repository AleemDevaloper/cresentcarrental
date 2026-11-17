<?php

use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\AccountGroupController;
use App\Http\Controllers\Api\AccountTypeController;
use App\Http\Controllers\Api\FiscalYearController;
use App\Http\Controllers\Api\FmsController;
use App\Http\Controllers\Api\FmsCoreController;
use App\Http\Controllers\Api\FxController;
use App\Http\Controllers\Api\OpeningBalanceController;
use App\Http\Controllers\Api\PeriodController;
use Illuminate\Support\Facades\Route;

Route::get('/fms/dashboard', [FmsController::class, 'dashboard']);

Route::get('/fms/currencies', [FmsCoreController::class, 'listCurrencies']);
Route::get('/fms/currencies/{id}', [FmsCoreController::class, 'getCurrency']);
Route::post('/fms/currencies', [FmsCoreController::class, 'createCurrency']);
Route::put('/fms/currencies/{id}', [FmsCoreController::class, 'updateCurrency']);
Route::delete('/fms/currencies/{id}', [FmsCoreController::class, 'deleteCurrency']);

Route::get('/fms/exchange-rates', [FmsCoreController::class, 'listExchangeRates']);
Route::get('/fms/exchange-rates/{id}', [FmsCoreController::class, 'getExchangeRate']);
Route::post('/fms/exchange-rates', [FmsCoreController::class, 'createExchangeRate']);
Route::put('/fms/exchange-rates/{id}', [FmsCoreController::class, 'updateExchangeRate']);
Route::delete('/fms/exchange-rates/{id}', [FmsCoreController::class, 'deleteExchangeRate']);

Route::get('/fms/fiscal-years', [FmsCoreController::class, 'listFiscalYears']);
Route::get('/fms/fiscal-years/{id}', [FmsCoreController::class, 'getFiscalYear']);
Route::post('/fms/fiscal-years', [FmsCoreController::class, 'createFiscalYear']);
Route::put('/fms/fiscal-years/{id}', [FmsCoreController::class, 'updateFiscalYear']);
Route::delete('/fms/fiscal-years/{id}', [FmsCoreController::class, 'deleteFiscalYear']);
Route::post('/fms/fiscal-years/{id}/close', [FmsCoreController::class, 'closeFiscalYear']);

Route::get('/fms/fiscal-years/{fiscalYearId}/periods', [FmsCoreController::class, 'listFiscalPeriods']);
Route::post('/fms/fiscal-years/{fiscalYearId}/periods/{periodId}/lock', [FmsCoreController::class, 'lockFiscalPeriod']);
Route::post('/fms/fiscal-years/{fiscalYearId}/periods/{periodId}/unlock', [FmsCoreController::class, 'unlockFiscalPeriod']);

Route::get('/fms/account-types', [FmsCoreController::class, 'listAccountTypes']);
Route::get('/fms/account-types/{id}', [FmsCoreController::class, 'getAccountType']);
Route::post('/fms/account-types', [FmsCoreController::class, 'createAccountType']);
Route::put('/fms/account-types/{id}', [FmsCoreController::class, 'updateAccountType']);
Route::delete('/fms/account-types/{id}', [FmsCoreController::class, 'deleteAccountType']);

Route::get('/fms/account-groups', [FmsCoreController::class, 'listAccountGroups']);
Route::get('/fms/account-groups/{id}', [FmsCoreController::class, 'getAccountGroup']);
Route::post('/fms/account-groups', [FmsCoreController::class, 'createAccountGroup']);
Route::put('/fms/account-groups/{id}', [FmsCoreController::class, 'updateAccountGroup']);
Route::delete('/fms/account-groups/{id}', [FmsCoreController::class, 'deleteAccountGroup']);

Route::get('/fms/chart-of-accounts', [FmsCoreController::class, 'listChartOfAccounts']);
Route::get('/fms/chart-of-accounts/{id}', [FmsCoreController::class, 'getChartOfAccount']);
Route::post('/fms/chart-of-accounts', [FmsCoreController::class, 'createChartOfAccount']);
Route::put('/fms/chart-of-accounts/{id}', [FmsCoreController::class, 'updateChartOfAccount']);
Route::delete('/fms/chart-of-accounts/{id}', [FmsCoreController::class, 'deleteChartOfAccount']);

// Chart of Accounts — Import / Export / Template
Route::get('/fms/chart-of-accounts-export/{format}', [FmsCoreController::class, 'exportChartOfAccounts']);
Route::post('/fms/chart-of-accounts-import', [FmsCoreController::class, 'importChartOfAccounts']);
Route::get('/fms/chart-of-accounts-template/{format}', [FmsCoreController::class, 'downloadCoaTemplate']);
Route::get('/fms/chart-of-accounts-template-headers', [FmsCoreController::class, 'coaTemplateHeaders']);

Route::get('/fms/opening-balances', [FmsController::class, 'listOpeningBalances']);
Route::get('/fms/opening-balances/{id}', [FmsController::class, 'getOpeningBalance']);
Route::post('/fms/opening-balances', [FmsController::class, 'createOpeningBalance']);
Route::put('/fms/opening-balances/{id}', [FmsController::class, 'updateOpeningBalance']);
Route::delete('/fms/opening-balances/{id}', [FmsController::class, 'deleteOpeningBalance']);
Route::post('/fms/opening-balances/post', [FmsController::class, 'postOpeningBalances']);

Route::get('/fms/accounting-settings', [FmsController::class, 'getAccountingSettings']);
Route::put('/fms/accounting-settings', [FmsController::class, 'saveAccountingSettings']);
Route::get('/fms/accounting-settings/audit-logs', [FmsController::class, 'getAuditLogs']);
Route::get('/fms/accounting-settings/export', [FmsController::class, 'exportSettings']);
Route::post('/fms/accounting-settings/import', [FmsController::class, 'importSettings']);

Route::get('/fms/quotations', [FmsController::class, 'listQuotations']);
Route::get('/fms/quotations/{id}', [FmsController::class, 'getQuotation']);
Route::post('/fms/quotations', [FmsController::class, 'createQuotation']);
Route::put('/fms/quotations/{id}', [FmsController::class, 'updateQuotation']);
Route::delete('/fms/quotations/{id}', [FmsController::class, 'deleteQuotation']);
Route::post('/fms/quotations/{id}/convert', [FmsController::class, 'convertQuotationToSalesOrder']);

Route::get('/fms/sales-orders', [FmsController::class, 'listSalesOrders']);
Route::get('/fms/sales-orders/{id}', [FmsController::class, 'getSalesOrder']);
Route::post('/fms/sales-orders', [FmsController::class, 'createSalesOrder']);
Route::put('/fms/sales-orders/{id}', [FmsController::class, 'updateSalesOrder']);
Route::delete('/fms/sales-orders/{id}', [FmsController::class, 'deleteSalesOrder']);

Route::get('/fms/delivery-challans', [FmsController::class, 'listDeliveryChallans']);
Route::get('/fms/delivery-challans/{id}', [FmsController::class, 'getDeliveryChallan']);
Route::post('/fms/delivery-challans', [FmsController::class, 'createDeliveryChallan']);
Route::put('/fms/delivery-challans/{id}', [FmsController::class, 'updateDeliveryChallan']);
Route::delete('/fms/delivery-challans/{id}', [FmsController::class, 'deleteDeliveryChallan']);

Route::get('/fms/sales-invoices', [FmsController::class, 'listSalesInvoices']);
Route::get('/fms/sales-invoices/{id}', [FmsController::class, 'getSalesInvoice']);
Route::post('/fms/sales-invoices', [FmsController::class, 'createSalesInvoice']);
Route::put('/fms/sales-invoices/{id}', [FmsController::class, 'updateSalesInvoice']);
Route::delete('/fms/sales-invoices/{id}', [FmsController::class, 'deleteSalesInvoice']);

Route::post('/fms/sales-invoices/{id}/share', [FmsController::class, 'createSalesInvoiceShare']);
Route::delete('/fms/sales-invoices/{id}/share', [FmsController::class, 'revokeSalesInvoiceShare']);

Route::get('/fms/credit-notes', [FmsController::class, 'listCreditNotes']);
Route::get('/fms/credit-notes/{id}', [FmsController::class, 'getCreditNote']);
Route::post('/fms/credit-notes', [FmsController::class, 'createCreditNote']);
Route::put('/fms/credit-notes/{id}', [FmsController::class, 'updateCreditNote']);
Route::delete('/fms/credit-notes/{id}', [FmsController::class, 'deleteCreditNote']);
Route::post('/fms/credit-notes/{id}/convert-refund', [FmsController::class, 'convertCreditNoteToRefund']);

Route::get('/fms/sales-returns', [FmsController::class, 'listSalesReturns']);
Route::get('/fms/sales-returns/{id}', [FmsController::class, 'getSalesReturn']);
Route::post('/fms/sales-returns', [FmsController::class, 'createSalesReturn']);
Route::put('/fms/sales-returns/{id}', [FmsController::class, 'updateSalesReturn']);
Route::delete('/fms/sales-returns/{id}', [FmsController::class, 'deleteSalesReturn']);

Route::get('/fms/quotations/export/{format}', [FmsController::class, 'exportQuotations']);
Route::get('/fms/sales-orders/export/{format}', [FmsController::class, 'exportSalesOrders']);
Route::get('/fms/delivery-challans/export/{format}', [FmsController::class, 'exportDeliveryChallans']);
Route::get('/fms/sales-invoices/export/{format}', [FmsController::class, 'exportSalesInvoices']);
Route::get('/fms/credit-notes/export/{format}', [FmsController::class, 'exportCreditNotes']);
Route::get('/fms/sales-returns/export/{format}', [FmsController::class, 'exportSalesReturns']);

Route::get('/fms/contractors', [FmsController::class, 'listContractors']);
Route::get('/fms/contractors/{id}', [FmsController::class, 'getContractor']);
Route::post('/fms/contractors', [FmsController::class, 'createContractor']);
Route::put('/fms/contractors/{id}', [FmsController::class, 'updateContractor']);
Route::delete('/fms/contractors/{id}', [FmsController::class, 'deleteContractor']);

Route::get('/fms/expense-claims', [FmsController::class, 'listExpenseClaims']);
Route::get('/fms/expense-claims/{id}', [FmsController::class, 'getExpenseClaim']);
Route::post('/fms/expense-claims', [FmsController::class, 'createExpenseClaim']);
Route::put('/fms/expense-claims/{id}', [FmsController::class, 'updateExpenseClaim']);
Route::delete('/fms/expense-claims/{id}', [FmsController::class, 'deleteExpenseClaim']);

Route::get('/fms/tab-data/{entity}', [FmsController::class, 'listTabData']);
Route::get('/fms/tab-data/{entity}/{id}', [FmsController::class, 'getTabDataItem']);
Route::post('/fms/tab-data/{entity}', [FmsController::class, 'createTabData']);
Route::put('/fms/tab-data/{entity}/{id}', [FmsController::class, 'updateTabData']);
Route::delete('/fms/tab-data/{entity}/{id}', [FmsController::class, 'deleteTabData']);

Route::get('/fms/system-modules', [FmsController::class, 'systemModules']);
Route::get('/fms/drafts', [FmsController::class, 'getDrafts']);
Route::get('/fms/trash', [FmsController::class, 'getTrash']);
Route::post('/fms/trash/move', [FmsController::class, 'moveToTrash']);
Route::post('/fms/trash/{id}/restore', [FmsController::class, 'restoreTrash']);
Route::delete('/fms/trash/{id}/force', [FmsController::class, 'forceDeleteTrash']);
Route::delete('/fms/trash/purge-all', [FmsController::class, 'purgeAllTrash']);

Route::get('/fx/dashboard', [FxController::class, 'dashboard']);
Route::get('/fx/currencies', [FxController::class, 'listCurrencies']);
Route::get('/fx/currencies/{id}', [FxController::class, 'getCurrency']);
Route::post('/fx/currencies', [FxController::class, 'createCurrency']);
Route::put('/fx/currencies/{id}', [FxController::class, 'updateCurrency']);
Route::delete('/fx/currencies/{id}', [FxController::class, 'deleteCurrency']);
Route::get('/fx/exchange-rates', [FxController::class, 'listExchangeRates']);
Route::get('/fx/exchange-rates/{id}', [FxController::class, 'getExchangeRate']);
Route::post('/fx/exchange-rates', [FxController::class, 'createExchangeRate']);
Route::put('/fx/exchange-rates/{id}', [FxController::class, 'updateExchangeRate']);
Route::delete('/fx/exchange-rates/{id}', [FxController::class, 'deleteExchangeRate']);
Route::post('/fx/exchange-rates/sync', [FxController::class, 'syncExchangeRates']);
Route::get('/fx/transactions', [FxController::class, 'listFxTransactions']);
Route::get('/fx/transactions/{id}', [FxController::class, 'getFxTransaction']);
Route::post('/fx/transactions', [FxController::class, 'createFxTransaction']);
Route::put('/fx/transactions/{id}', [FxController::class, 'updateFxTransaction']);
Route::delete('/fx/transactions/{id}', [FxController::class, 'deleteFxTransaction']);
Route::get('/fx/revaluations', [FxController::class, 'listRevaluations']);
Route::get('/fx/revaluations/{id}', [FxController::class, 'getRevaluation']);
Route::post('/fx/revaluations', [FxController::class, 'createRevaluation']);
Route::put('/fx/revaluations/{id}/approve', [FxController::class, 'approveRevaluation']);
Route::delete('/fx/revaluations/{id}', [FxController::class, 'deleteRevaluation']);
Route::get('/fx/exposure', [FxController::class, 'exposureAnalytics']);
Route::get('/fx/gain-loss', [FxController::class, 'gainLossSummary']);
Route::get('/fx/treasury', [FxController::class, 'treasurySummary']);

Route::apiResource('fiscal-years', FiscalYearController::class);
Route::apiResource('periods', PeriodController::class);
Route::apiResource('account-types', AccountTypeController::class);
Route::apiResource('account-groups', AccountGroupController::class);
Route::apiResource('accounts', AccountController::class);
Route::apiResource('opening-balances', OpeningBalanceController::class);
