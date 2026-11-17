import client from "./client";

// Inventory
export async function getInventoryStats() {
    const res = await client.get("/inventory/stats");
    return res.data.data;
}

export async function listInventory(params = {}) {
    const res = await client.get("/inventory", { params });
    return res.data.data;
}

export async function createInventoryItem(data) {
    const res = await client.post("/inventory", data);
    return res.data.data;
}

// Assets
export async function getAssetStats() {
    const res = await client.get("/assets/stats");
    return res.data.data;
}

export async function listAssets(params = {}) {
    const res = await client.get("/assets", { params });
    return res.data.data;
}

export async function createAsset(data) {
    const res = await client.post("/assets", data);
    return res.data.data;
}

export async function updateAsset(id, data) {
    const res = await client.put(`/assets/${id}`, data);
    return res.data.data;
}

export async function getAsset(id) {
    const res = await client.get(`/assets/${id}`);
    return res.data.data;
}

export async function deleteAsset(id) {
    const res = await client.delete(`/assets/${id}`);
    return res.data.data;
}

export async function listAssetCategories(params = {}) {
    const res = await client.get("/asset-categories", { params });
    return res.data.data;
}

export async function createAssetCategory(data) {
    const res = await client.post("/asset-categories", data);
    return res.data.data;
}

export async function updateAssetCategory(id, data) {
    const res = await client.put(`/asset-categories/${id}`, data);
    return res.data.data;
}

export async function deleteAssetCategory(id) {
    const res = await client.delete(`/asset-categories/${id}`);
    return res.data.data;
}

// Investments
export async function getInvestmentStats() {
    const res = await client.get("/investments/stats");
    return res.data.data;
}

// Loans & EMI
export async function getLoanStats() {
    const res = await client.get("/loans/stats");
    return res.data.data;
}

// Warehouses
export async function getWarehouseStats() {
    const res = await client.get("/warehouses/stats");
    return res.data.data;
}

export async function listWarehouses(params = {}) {
    const res = await client.get("/warehouses", { params });
    return res.data.data;
}

export async function createWarehouse(data) {
    const res = await client.post("/warehouses", data);
    return res.data.data;
}

// E-Signature
export async function getSignatureStats() {
    const res = await client.get("/signatures/stats");
    return res.data.data;
}

export async function listSignatures(params = {}) {
    const res = await client.get("/signatures", { params });
    return res.data.data;
}

// System Module Statuses
export async function getSystemModules() {
    const res = await client.get("/api/v1/fms/system-modules");
    return res.data;
}

// Drafts & Trash (AMS/FMS)
export async function getFmsDrafts() {
    const res = await client.get("/api/v1/fms/drafts");
    return res.data;
}

export async function finalizeFmsDraft(id) {
    // Finalize a draft on the server. Some backends may accept GET instead of POST for this route.
    try {
        const res = await client.post(`/api/v1/fms/drafts/${id}/finalize`);
        return res.data;
    } catch (err) {
        // If POST not allowed, try GET as a fallback
        if (err && err.status === 405) {
            const res2 = await client.get(`/api/v1/fms/drafts/${id}/finalize`);
            return res2.data;
        }
        throw err;
    }
}

export async function getFmsTrash() {
    const res = await client.get("/api/v1/fms/trash");
    return res.data;
}

export async function moveToFmsTrash(data) {
    const res = await client.post("/api/v1/fms/trash/move", data);
    return res.data;
}

export async function restoreFmsTrash(id) {
    const res = await client.post(`/api/v1/fms/trash/${id}/restore`);
    return res.data;
}

export async function forceDeleteFmsTrash(id) {
    const res = await client.delete(`/api/v1/fms/trash/${id}/force`);
    return res.data;
}

export async function purgeAllFmsTrash() {
    const res = await client.delete("/api/v1/fms/trash/purge-all");
    return res.data;
}

// Reports & Backups
export async function getReportStats() {
    const res = await client.get("/reports/stats");
    return res.data.data;
}

export async function getBackupStats() {
    const res = await client.get("/backups/stats");
    return res.data.data;
}

export async function runBackup() {
    const res = await client.post("/backups/run");
    return res.data.data;
}

export function getBackupExportUrl(format) {
    return `/api/v1/backups/export/${format}`;
}

export async function exportBackup(format) {
    const ext = format === 'sql' ? 'sql' : format === 'excel' ? 'csv' : format === 'nosql' ? 'json' : 'pdf';
    const res = await client.get(`/backups/export/${format}`, { responseType: 'blob' });
    const blob = new Blob([res.data.blob], { type: res.data.headers.get('content-type') || 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `manage-core-backup-${new Date().toISOString().slice(0,10)}.${ext}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}
