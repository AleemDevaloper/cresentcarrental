export const SYSTEM_KPI_DEFINITIONS = {
  fms: {
    title: 'FMS',
    metrics: [
      { id: 'fms-cash', label: 'Cash Balance', value: '$1.24M', delta: '+8.4%', tone: 'success', icon: 'wallet' },
      { id: 'fms-revenue', label: 'Monthly Revenue', value: '$486K', delta: '+12.1%', tone: 'primary', icon: 'trending-up' },
      { id: 'fms-expenses', label: 'Expenses', value: '$214K', delta: '-3.6%', tone: 'warning', icon: 'receipt' },
      { id: 'fms-receivables', label: 'Receivables', value: '$92.5K', delta: '+4.2%', tone: 'info', icon: 'inbox' },
    ],
    summary: 'Net cash position is healthy with steady inflows from receivables.',
  },
  ams: {
    title: 'AMS',
    metrics: [
      { id: 'ams-invoices', label: 'Open Invoices', value: '128', delta: '+6', tone: 'primary', icon: 'file-invoice' },
      { id: 'ams-payables', label: 'Payables Due', value: '$58.2K', delta: '-1.4%', tone: 'warning', icon: 'money-bill' },
      { id: 'ams-cashflow', label: 'Cash Flow', value: '+$34K', delta: '+9.0%', tone: 'success', icon: 'arrow-trend-up' },
      { id: 'ams-close', label: 'Period Close', value: 'Day 12 / 30', delta: 'On Track', tone: 'info', icon: 'calendar-check' },
    ],
    summary: 'Period close running on schedule, receivables aging within target.',
  },
  hrms: {
    title: 'HRMS',
    metrics: [
      { id: 'hrms-headcount', label: 'Headcount', value: '246', delta: '+4', tone: 'primary', icon: 'users' },
      { id: 'hrms-attendance', label: 'Attendance', value: '94.2%', delta: '+0.8%', tone: 'success', icon: 'user-check' },
      { id: 'hrms-leave', label: 'On Leave', value: '12', delta: '-2', tone: 'warning', icon: 'plane-departure' },
      { id: 'hrms-openings', label: 'Open Roles', value: '9', delta: '+1', tone: 'info', icon: 'briefcase' },
    ],
    summary: 'Workforce is steady with strong attendance across departments.',
  },
  pms: {
    title: 'PMS',
    metrics: [
      { id: 'pms-projects', label: 'Active Projects', value: '14', delta: '+2', tone: 'primary', icon: 'diagram-project' },
      { id: 'pms-milestones', label: 'Milestones Due', value: '7', delta: 'This week', tone: 'warning', icon: 'flag' },
      { id: 'pms-delivery', label: 'On-Time Delivery', value: '88%', delta: '+3%', tone: 'success', icon: 'gauge-high' },
      { id: 'pms-issues', label: 'Open Issues', value: '23', delta: '-4', tone: 'danger', icon: 'triangle-exclamation' },
    ],
    summary: 'Portfolio is on track with healthy delivery and shrinking open issues.',
  },
  tms: {
    title: 'TMS',
    metrics: [
      { id: 'tms-open', label: 'Open Tasks', value: '342', delta: '+18', tone: 'primary', icon: 'list-check' },
      { id: 'tms-overdue', label: 'Overdue', value: '14', delta: '-3', tone: 'danger', icon: 'clock' },
      { id: 'tms-completed', label: 'Completed (7d)', value: '1,128', delta: '+6%', tone: 'success', icon: 'circle-check' },
      { id: 'tms-velocity', label: 'Team Velocity', value: '212 pts', delta: '+4%', tone: 'info', icon: 'gauge' },
    ],
    summary: 'Throughput steady, overdue tasks declining across teams.',
  },
  dms: {
    title: 'DMS',
    metrics: [
      { id: 'dms-files', label: 'Total Files', value: '24,816', delta: '+128', tone: 'primary', icon: 'folder' },
      { id: 'dms-pending', label: 'Pending Approvals', value: '6', delta: '-2', tone: 'warning', icon: 'hourglass-half' },
      { id: 'dms-storage', label: 'Storage Used', value: '4.2 GB', delta: 'of 10 GB', tone: 'info', icon: 'database' },
      { id: 'dms-shared', label: 'Shared Links', value: '47', delta: '+3', tone: 'success', icon: 'link' },
    ],
    summary: 'Document library healthy with active approvals and good headroom.',
  },
  crm: {
    title: 'CRM',
    metrics: [
      { id: 'crm-leads', label: 'New Leads', value: '184', delta: '+22', tone: 'primary', icon: 'user-plus' },
      { id: 'crm-deals', label: 'Open Deals', value: '63', delta: '+5', tone: 'info', icon: 'handshake' },
      { id: 'crm-won', label: 'Won (MTD)', value: '$128K', delta: '+11%', tone: 'success', icon: 'trophy' },
      { id: 'crm-lost', label: 'Lost', value: '8', delta: '-2', tone: 'danger', icon: 'circle-xmark' },
    ],
    summary: 'Pipeline expansion outpacing losses, conversion rate trending up.',
  },
  ems: {
    title: 'EMS',
    metrics: [
      { id: 'ems-students', label: 'Active Students', value: '1,842', delta: '+12', tone: 'primary', icon: 'user-graduate' },
      { id: 'ems-attendance', label: 'Attendance', value: '92%', delta: '+0.5%', tone: 'success', icon: 'user-check' },
      { id: 'ems-fees', label: 'Fees Collected', value: '$284K', delta: '+6%', tone: 'info', icon: 'sack-dollar' },
      { id: 'ems-exams', label: 'Upcoming Exams', value: '4', delta: 'This week', tone: 'warning', icon: 'file-pen' },
    ],
    summary: 'Term progressing smoothly with strong attendance and fee collection.',
  },
  mfg: {
    title: 'MFG',
    metrics: [
      { id: 'mfg-orders', label: 'Active Orders', value: '38', delta: '+3', tone: 'primary', icon: 'industry' },
      { id: 'mfg-output', label: 'Output (7d)', value: '12,480', delta: '+5%', tone: 'success', icon: 'cubes' },
      { id: 'mfg-downtime', label: 'Downtime', value: '2.1%', delta: '-0.4%', tone: 'info', icon: 'clock-rotate-left' },
      { id: 'mfg-defects', label: 'Defect Rate', value: '0.8%', delta: '-0.1%', tone: 'warning', icon: 'triangle-exclamation' },
    ],
    summary: 'Lines humming at planned capacity, quality holding within tolerance.',
  },
  fx: {
    title: 'FX',
    metrics: [
      { id: 'fx-rates', label: 'Tracked Pairs', value: '18', delta: '+2', tone: 'primary', icon: 'arrows-left-right' },
      { id: 'fx-exposure', label: 'Net Exposure', value: '$2.4M', delta: '-1.2%', tone: 'info', icon: 'scale-balanced' },
      { id: 'fx-pnl', label: 'Realized P&L', value: '+$18.2K', delta: '+4.6%', tone: 'success', icon: 'sack-dollar' },
      { id: 'fx-margin', label: 'Conversion Margin', value: '1.8%', delta: '+0.1%', tone: 'warning', icon: 'percent' },
    ],
    summary: 'Currency exposure balanced, hedging levels within policy.',
  },
  ai: {
    title: 'AI',
    metrics: [
      { id: 'ai-requests', label: 'Requests (7d)', value: '14,820', delta: '+9%', tone: 'primary', icon: 'microchip' },
      { id: 'ai-tokens', label: 'Tokens Used', value: '6.2M', delta: '+5%', tone: 'info', icon: 'bolt' },
      { id: 'ai-assistants', label: 'Active Assistants', value: '12', delta: '+1', tone: 'success', icon: 'robot' },
      { id: 'ai-cost', label: 'Cost (MTD)', value: '$284', delta: '-3%', tone: 'warning', icon: 'receipt' },
    ],
    summary: 'AI usage expanding across teams with cost under control.',
  },
  drawing: {
    title: 'Drawing',
    metrics: [
      { id: 'drw-drawings', label: 'Total Drawings', value: '3,420', delta: '+24', tone: 'primary', icon: 'pen-ruler' },
      { id: 'drw-revisions', label: 'Pending Revisions', value: '11', delta: '-2', tone: 'warning', icon: 'arrows-rotate' },
      { id: 'drw-approvals', label: 'In Approval', value: '7', delta: '+1', tone: 'info', icon: 'circle-check' },
      { id: 'drw-shared', label: 'Shared Externally', value: '24', delta: '+3', tone: 'success', icon: 'share-nodes' },
    ],
    summary: 'Revision backlog shrinking, design throughput healthy.',
  },
};

export const getSystemKpi = (moduleId) => SYSTEM_KPI_DEFINITIONS[moduleId] || null;
