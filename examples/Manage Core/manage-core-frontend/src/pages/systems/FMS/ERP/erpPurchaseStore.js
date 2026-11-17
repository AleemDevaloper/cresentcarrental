// Client-side LocalStorage ERP Data Layer for Purchase & Procurement Modules
const STORAGE_KEYS = {
  PRS: 'erp_purchase_requisitions',
  RFQS: 'erp_purchase_rfqs',
  POS: 'erp_purchase_orders',
  GRNS: 'erp_purchase_grns',
  BILLS: 'erp_purchase_vendor_bills',
  RETURNS: 'erp_purchase_returns',
  LOGS: 'erp_purchase_audit_logs',
  COMMENTS: 'erp_purchase_comments',
  NOTIFICATIONS: 'erp_purchase_notifications'
};

// Initial Mock Data
const INITIAL_PRS = [
  {
    id: 1,
    code: 'PRQ-2026-001',
    date: '2026-07-01',
    department: 'Research & Development',
    costCenter: 'CC-RND-101',
    project: 'Project Alpha Tech',
    requiredDate: '2026-07-15',
    priority: 'High',
    vendorSuggestion: 'Oscorp Tech',
    itemCategory: 'Raw Materials',
    warehouse: 'Main WH-A',
    currency: 'USD',
    taxProfile: 'VAT 5%',
    deliveryLocation: 'New York R&D Facility',
    requestedBy: 'Bruce Banner',
    items: [
      { id: 101, product: 'Titanium Alloys', description: 'Aircraft grade raw titanium bars', qty: 10, unit: 'Bars', estCost: 1000, preferredVendor: 'Oscorp Tech', expectedDelivery: '2026-07-15' },
      { id: 102, product: 'Carbon Fiber Rolls', description: 'High tensile strength carbon fiber', qty: 5, unit: 'Rolls', estCost: 400, preferredVendor: 'Oscorp Tech', expectedDelivery: '2026-07-15' }
    ],
    budgetAmount: 12000,
    budgetLimit: 15000,
    status: 'Approved',
    approvalHistory: [
      { step: 'Employee Request', user: 'Bruce Banner', date: '2026-07-01 09:00', notes: 'Urgent materials for next prototype phase.' },
      { step: 'Manager Approval', user: 'Tony Stark', date: '2026-07-01 10:15', notes: 'Approved. Budget fits current allocation.' },
      { step: 'Final Approval', user: 'System Admin', date: '2026-07-01 11:30', notes: 'Final sign-off completed.' }
    ],
    attachments: ['boq_specs_v1.xlsx', 'tech_specs_titanium.pdf'],
    comments: [],
    timeline: [
      { date: '2026-07-01 09:00', text: 'Requisition PRQ-2026-001 created by Bruce Banner (Draft)' },
      { date: '2026-07-01 10:15', text: 'Approved by Manager Tony Stark' },
      { date: '2026-07-01 11:30', text: 'Final sign-off by Finance & Procurement. Status set to Approved.' }
    ]
  },
  {
    id: 2,
    code: 'PRQ-2026-002',
    date: '2026-07-02',
    department: 'HQ Administration',
    costCenter: 'CC-HQ-202',
    project: 'Office Modernization',
    requiredDate: '2026-07-20',
    priority: 'Medium',
    vendorSuggestion: 'Stark Ind.',
    itemCategory: 'IT Hardware',
    warehouse: 'Sector 4 Vault',
    currency: 'USD',
    taxProfile: 'Exempt',
    deliveryLocation: 'HQ Annex B',
    requestedBy: 'Pepper Potts',
    items: [
      { id: 103, product: 'Enterprise Server Racks', description: '42U Server Rack Cabinets', qty: 15, unit: 'Units', estCost: 3000, preferredVendor: 'Stark Ind.', expectedDelivery: '2026-07-20' }
    ],
    budgetAmount: 45000,
    budgetLimit: 50000,
    status: 'Pending',
    approvalHistory: [
      { step: 'Employee Request', user: 'Pepper Potts', date: '2026-07-02 08:30', notes: 'Server infrastructure upgrade.' }
    ],
    attachments: ['rack_specs_draft.pdf'],
    comments: [],
    timeline: [
      { date: '2026-07-02 08:30', text: 'Requisition PRQ-2026-002 created by Pepper Potts' }
    ]
  },
  {
    id: 3,
    code: 'PRQ-2026-003',
    date: '2026-07-03',
    department: 'Facility Operations',
    costCenter: 'CC-OPS-303',
    project: 'HQ Facility Upgrade',
    requiredDate: '2026-07-30',
    priority: 'Low',
    vendorSuggestion: 'Rand Enterprises',
    itemCategory: 'Office Supplies',
    warehouse: 'Aux Depot 4',
    currency: 'USD',
    taxProfile: 'VAT 5%',
    deliveryLocation: 'Main Office Supply Room',
    requestedBy: 'Happy Hogan',
    items: [
      { id: 104, product: 'Ergonomic Task Chairs', description: 'Mesh high-back desk chairs', qty: 10, unit: 'Units', estCost: 150, preferredVendor: 'Rand Enterprises', expectedDelivery: '2026-07-30' }
    ],
    budgetAmount: 1500,
    budgetLimit: 2000,
    status: 'Draft',
    approvalHistory: [],
    attachments: [],
    comments: [],
    timeline: [
      { date: '2026-07-03 10:00', text: 'Requisition PRQ-2026-003 saved as Draft by Happy Hogan' }
    ]
  }
];

const INITIAL_RFQS = [
  {
    id: 1,
    code: 'RFQ-2026-001',
    date: '2026-07-01',
    refPr: 'PRQ-2026-001',
    department: 'Research & Development',
    buyer: 'Procurement Officer Steve',
    dueDate: '2026-07-10',
    deliveryTerms: 'FOB Origin',
    paymentTerms: 'NET 30',
    currency: 'USD',
    taxMethod: 'Exclusive',
    vendors: ['Oscorp Tech', 'Stark Ind.', 'Hammer Industries'],
    items: [
      { product: 'Titanium Alloys', description: 'Aircraft grade raw titanium bars', qty: 10, unit: 'Bars' }
    ],
    status: 'Sent',
    bids: [
      { vendor: 'Oscorp Tech', price: 9500, deliveryTime: '5 Days', warranty: '1 Year', paymentTerms: 'NET 30', compliance: '100% Compliant', rank: 1 },
      { vendor: 'Stark Ind.', price: 11000, deliveryTime: '3 Days', warranty: '3 Years', paymentTerms: 'NET 15', compliance: '100% Compliant', rank: 2 },
      { vendor: 'Hammer Industries', price: 8000, deliveryTime: '15 Days', warranty: '6 Months', paymentTerms: 'NET 45', compliance: 'Partial Compliance (Grade B Material)', rank: 3 }
    ],
    negotiationNotes: 'Awaiting final supplier response regarding volume discounts.',
    version: 'v1.0',
    timeline: [
      { date: '2026-07-01 12:00', text: 'RFQ-2026-001 initialized and dispatched to vendor portals.' }
    ]
  },
  {
    id: 2,
    code: 'RFQ-2026-002',
    date: '2026-07-02',
    refPr: 'None',
    department: 'HQ Administration',
    buyer: 'Procurement Manager Maria',
    dueDate: '2026-07-12',
    deliveryTerms: 'DDP Destination',
    paymentTerms: 'NET 15',
    currency: 'USD',
    taxMethod: 'Inclusive',
    vendors: ['Stark Ind.', 'Rand Enterprises'],
    items: [
      { product: 'Enterprise Server Racks', description: '42U Server Rack Cabinets', qty: 15, unit: 'Units' }
    ],
    status: 'Vendor Responded',
    bids: [
      { vendor: 'Stark Ind.', price: 42000, deliveryTime: '4 Days', warranty: '5 Years', paymentTerms: 'NET 15', compliance: '100% Compliant', rank: 1 },
      { vendor: 'Rand Enterprises', price: 47000, deliveryTime: '10 Days', warranty: '2 Years', paymentTerms: 'NET 30', compliance: '100% Compliant', rank: 2 }
    ],
    negotiationNotes: 'Stark Ind. is offering 5% additional discount if awarded this week.',
    version: 'v1.1',
    timeline: [
      { date: '2026-07-02 14:00', text: 'RFQ-2026-002 issued to Stark Ind. & Rand Enterprises.' },
      { date: '2026-07-03 09:30', text: 'Stark Ind. posted a bid response.' }
    ]
  }
];

const INITIAL_POS = [
  {
    id: 1,
    code: 'PO-2026-001',
    date: '2026-07-01',
    vendor: 'Oscorp Tech',
    warehouse: 'Main WH-A',
    project: 'Project Alpha Tech',
    department: 'Research & Development',
    currency: 'USD',
    taxProfile: 'VAT 5%',
    deliveryAddress: 'New York R&D Facility',
    expectedDelivery: '2026-07-15',
    paymentTerms: 'NET 30',
    shippingMethod: 'Sea Freight',
    items: [
      { product: 'Titanium Alloys', description: 'Aircraft grade raw titanium bars', qty: 10, unitPrice: 1000, discount: 500, taxPercent: 5, subtotal: 9975 }
    ],
    totalAmount: 9975,
    status: 'Partially Received',
    grnMatched: 'GRN-2026-001',
    billMatched: 'Pending',
    version: 'v1.2',
    backOrders: 2,
    approvalStep: 'Posted',
    comments: [
      { id: 1, user: 'Tony Stark', text: 'Negotiated bulk shipping rate with Oscorp.', date: '2026-07-01 10:00' }
    ],
    timeline: [
      { date: '2026-07-01 10:00', text: 'PO-2026-001 Draft Created' },
      { date: '2026-07-01 11:30', text: 'Approved and Dispatched to Vendor Oscorp Tech' }
    ]
  },
  {
    id: 2,
    code: 'PO-2026-002',
    date: '2026-07-02',
    vendor: 'Stark Ind.',
    warehouse: 'Main WH-A',
    project: 'Mark 85 Reactor Core',
    department: 'Defense Labs',
    currency: 'USD',
    taxProfile: 'Exempt',
    deliveryAddress: '10880 Wilshire Blvd, LA',
    expectedDelivery: '2026-07-10',
    paymentTerms: 'NET 15',
    shippingMethod: 'Air Cargo Express',
    items: [
      { product: 'Enterprise Server Racks', description: '42U Server Rack Cabinets', qty: 15, unitPrice: 3000, discount: 0, taxPercent: 0, subtotal: 45000 }
    ],
    totalAmount: 45000,
    status: 'Completed',
    grnMatched: 'GRN-2026-002',
    billMatched: 'BIL-2026-002',
    version: 'v1.0',
    backOrders: 0,
    approvalStep: 'Posted',
    comments: [],
    timeline: [
      { date: '2026-07-02 09:00', text: 'PO-2026-002 approved automatically via Stark Core integration.' }
    ]
  }
];

const INITIAL_GRNS = [
  {
    id: 1,
    code: 'GRN-2026-001',
    date: '2026-07-01',
    vendor: 'Oscorp Tech',
    poRef: 'PO-2026-001',
    receivedBy: 'Peter Parker',
    status: 'Partially Received',
    warehouse: 'Main WH-A',
    vehicle: 'State-Carrier NY-3920',
    items: [
      { product: 'Titanium Alloys', expectedQty: 10, receivedQty: 8, rejectedQty: 0, acceptedQty: 8, batchNo: 'BAT-OSC-42', expiryDate: '2029-12-31', binLocation: 'BIN-102-A' }
    ],
    qualityStatus: 'Pass',
    inspectionNotes: 'No physical damage observed. 2 units backordered by vendor.',
    workflowStep: 'Posted',
    attachments: ['packing_slip_osc902.pdf'],
    timeline: [
      { date: '2026-07-01 14:00', text: 'GRN Intake registered by Peter Parker. 8 units received.' }
    ]
  },
  {
    id: 2,
    code: 'GRN-2026-002',
    date: '2026-07-02',
    vendor: 'Stark Ind.',
    poRef: 'PO-2026-002',
    receivedBy: 'Happy Hogan',
    status: 'Completed',
    warehouse: 'Main WH-A',
    vehicle: 'Stark Cargo Jet v4',
    items: [
      { product: 'Enterprise Server Racks', expectedQty: 15, receivedQty: 15, rejectedQty: 0, acceptedQty: 15, batchNo: 'BAT-STK-99', expiryDate: '2030-01-01', binLocation: 'BIN-909-S' }
    ],
    qualityStatus: 'Pass',
    inspectionNotes: 'All 15 server racks arrived in pristine condition. QC Check complete.',
    workflowStep: 'Posted',
    attachments: ['stk_delivery_invoice.pdf'],
    timeline: [
      { date: '2026-07-02 11:00', text: 'GRN Logged. Fully received.' }
    ]
  }
];

const INITIAL_BILLS = [
  {
    id: 1,
    code: 'BIL-2026-001',
    date: '2026-07-02',
    vendor: 'Stark Ind.',
    poRef: 'PO-2026-002',
    grnRef: 'GRN-2026-002',
    due: '2026-08-15',
    invoiceNo: 'INV-STK-442',
    currency: 'USD',
    taxMethod: 'Exclusive',
    expenseAccount: '5020 - Computer Hardware Expenses',
    items: [
      { product: 'Enterprise Server Racks', qty: 15, unitCost: 3000, discount: 0, taxPercent: 0, subtotal: 45000 }
    ],
    amount: 45000,
    taxAmount: 0,
    netAmount: 45000,
    status: 'Paid',
    poMatch: 'Passed',
    grnMatch: 'Passed',
    invoiceMatch: 'Passed',
    mismatchDetected: false,
    duplicateDetected: false,
    ocrConfidence: '99%',
    workflowStep: 'Posted',
    history: 'Created by Accounts Officer (2026-07-02), Approved by CFO (2026-07-02), Paid via Chase API (2026-07-02)',
    timeline: [
      { date: '2026-07-02 13:00', text: 'Vendor bill BIL-2026-001 logged.' }
    ]
  }
];

const INITIAL_RETURNS = [
  {
    id: 1,
    code: 'PRT-2026-001',
    date: '2026-07-02',
    vendor: 'Oscorp Tech',
    grnRef: 'GRN-2026-001',
    poRef: 'PO-2026-001',
    refundAmount: 2000,
    status: 'Completed',
    returnedQty: 2,
    reason: 'Incorrect steel grade specification',
    notes: 'Vendor accepted return, credit memo received.',
    timeline: [
      { date: '2026-07-02 16:00', text: 'Purchase Return ticket initiated.' },
      { date: '2026-07-03 10:00', text: 'Credit memo confirmed and finalized.' }
    ]
  }
];

const INITIAL_LOGS = [
  { id: 1, timestamp: '2026-07-03 11:00', user: 'System Admin', action: 'System Initialization', module: 'Procurement', reference: 'System', details: 'Initialized standard ERP database tables.' }
];

// Helper functions for storage management
const load = (key, initialData) => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initialData));
    return initialData;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return initialData;
  }
};

const save = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getPRs = () => load(STORAGE_KEYS.PRS, INITIAL_PRS);
export const savePRs = (prs) => save(STORAGE_KEYS.PRS, prs);

export const getRFQs = () => load(STORAGE_KEYS.RFQS, INITIAL_RFQS);
export const saveRFQs = (rfqs) => save(STORAGE_KEYS.RFQS, rfqs);

export const getPOs = () => load(STORAGE_KEYS.POS, INITIAL_POS);
export const savePOs = (pos) => save(STORAGE_KEYS.POS, pos);

export const getGRNs = () => load(STORAGE_KEYS.GRNS, INITIAL_GRNS);
export const saveGRNs = (grns) => save(STORAGE_KEYS.GRNS, grns);

export const getBills = () => load(STORAGE_KEYS.BILLS, INITIAL_BILLS);
export const saveBills = (bills) => save(STORAGE_KEYS.BILLS, bills);

export const getReturns = () => load(STORAGE_KEYS.RETURNS, INITIAL_RETURNS);
export const saveReturns = (returns) => save(STORAGE_KEYS.RETURNS, returns);

export const getAuditLogs = () => load(STORAGE_KEYS.LOGS, INITIAL_LOGS);
export const addAuditLog = (action, module, reference, details, user = 'System Admin') => {
  const logs = getAuditLogs();
  const newLog = {
    id: Date.now(),
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    user,
    action,
    module,
    reference,
    details
  };
  save(STORAGE_KEYS.LOGS, [newLog, ...logs]);
};
