/**
 * Parse CSV text into an array of objects using header row as keys.
 * @param {string} csvText - Raw CSV string
 * @returns {{ headers: string[], rows: object[], rawRows: string[][] }}
 */
export function parseCSV(csvText) {
  if (!csvText || typeof csvText !== 'string') return { headers: [], rows: [], rawRows: [] };

  const lines = csvText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  if (lines.length === 0) return { headers: [], rows: [], rawRows: [] };

  const headers = parseCSVLine(lines[0]);
  const rawRows = [];
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    rawRows.push(values);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] ?? '';
    });
    rows.push(obj);
  }

  return { headers, rows, rawRows };
}

/**
 * Parse a single CSV line, handling quoted fields.
 */
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Convert array of objects to CSV string.
 * @param {object[]} data
 * @param {string[]} headers - Optional column order
 * @returns {string}
 */
export function toCSV(data, headers = null) {
  if (!data || data.length === 0) return '';

  const cols = headers || Object.keys(data[0]);
  const escape = (val) => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const lines = [
    cols.map(escape).join(','),
    ...data.map(row => cols.map(c => escape(row[c])).join(',')),
  ];

  return lines.join('\n');
}

/**
 * Trigger a browser download of text content as a file.
 * @param {string} content
 * @param {string} filename
 * @param {string} mimeType
 */
export function downloadFile(content, filename, mimeType = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Trigger download from a Blob (e.g. API response).
 * @param {Blob} blob
 * @param {string} filename
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Read a file as text.
 * @param {File} file
 * @returns {Promise<string>}
 */
export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

/**
 * Generate a CSV template string for a given entity type.
 * @param {string} entityType
 * @returns {{ headers: string[], sampleRows: string[][] }}
 */
export const ENTITY_TEMPLATES = {
  coa: {
    headers: ['account_code', 'account_name', 'account_type', 'account_group', 'currency', 'description', 'is_active'],
    sampleRows: [
      ['1000', 'Cash in Hand', 'Asset', 'Current Assets', 'USD', 'Primary cash account', 'true'],
      ['1010', 'Bank Account - Main', 'Asset', 'Current Assets', 'USD', 'Main operating bank account', 'true'],
      ['4000', 'Sales Revenue', 'Revenue', 'Operating Revenue', 'USD', 'Primary sales income', 'true'],
    ],
  },
  cust: {
    headers: ['customer_name', 'email', 'phone', 'address', 'city', 'country', 'tax_id', 'credit_limit', 'payment_terms'],
    sampleRows: [
      ['Acme Corp', 'billing@acme.com', '+1-555-0100', '123 Business Ave', 'New York', 'US', 'TAX-12345', '50000', '30 Days'],
    ],
  },
  vend: {
    headers: ['vendor_name', 'email', 'phone', 'address', 'city', 'country', 'tax_id', 'payment_terms', 'bank_account'],
    sampleRows: [
      ['Core Energy Supplies', 'ap@coreenergy.com', '+1-555-0200', '456 Industrial Blvd', 'Dublin', 'IE', 'VAT-67890', '15 Days', 'IE29AIBK93115212345678'],
    ],
  },
  prod: {
    headers: ['product_name', 'sku', 'category', 'uom', 'cost_price', 'sale_price', 'tax_rate', 'stock_qty', 'reorder_level'],
    sampleRows: [
      ['Enterprise License', 'SKU-ENT-001', 'Software', 'Unit', '500.00', '1200.00', '20', '999', '50'],
    ],
  },
  uom: {
    headers: ['uom_name', 'abbreviation', 'base_uom', 'conversion_factor', 'description'],
    sampleRows: [
      ['Box', 'BOX', 'Unit', '12', '1 box = 12 units'],
      ['Pallet', 'PLT', 'Box', '20', '1 pallet = 20 boxes'],
    ],
  },
  wh: {
    headers: ['warehouse_name', 'code', 'address', 'city', 'country', 'manager', 'capacity', 'status'],
    sampleRows: [
      ['Dublin Main Warehouse', 'WH-DUB-01', '789 Logistics Park', 'Dublin', 'IE', 'John Smith', '50000', 'Active'],
    ],
  },
  bank: {
    headers: ['transaction_date', 'description', 'reference', 'debit', 'credit', 'balance', 'bank_reference'],
    sampleRows: [
      ['2026-07-01', 'Invoice Payment - INV-2026-904', 'REF-001', '', '45200.00', '1250000.00', 'BNK-TXN-8821'],
      ['2026-07-02', 'Utility Payment', 'REF-002', '18240.00', '', '1231760.00', 'BNK-TXN-8822'],
    ],
  },
  jv: {
    headers: ['entry_date', 'reference', 'account_code', 'description', 'debit', 'credit', 'currency'],
    sampleRows: [
      ['2026-07-01', 'JV-2026-001', '1000', 'Cash receipt from sales', '10000.00', '', 'USD'],
      ['2026-07-01', 'JV-2026-001', '4000', 'Sales revenue recognized', '', '10000.00', 'USD'],
    ],
  },
  exp: {
    headers: ['employee_name', 'expense_date', 'category', 'description', 'amount', 'currency', 'receipt_ref', 'status'],
    sampleRows: [
      ['Jane Doe', '2026-07-01', 'Travel', 'Client meeting taxi fare', '85.00', 'USD', 'RCP-001', 'Pending'],
    ],
  },
  adv: {
    headers: ['employee_name', 'request_date', 'amount', 'currency', 'purpose', 'repayment_months', 'monthly_installment', 'status'],
    sampleRows: [
      ['Mike Ross', '2026-07-01', '2000.00', 'USD', 'Travel advance for client visit', '6', '333.33', 'Approved'],
    ],
  },
};

export function generateTemplateCSV(entityType) {
  const tpl = ENTITY_TEMPLATES[entityType];
  if (!tpl) return '';
  const lines = [
    tpl.headers.join(','),
    ...tpl.sampleRows.map(row => row.map(v => v.includes(',') ? `"${v}"` : v).join(',')),
  ];
  return lines.join('\n');
}
