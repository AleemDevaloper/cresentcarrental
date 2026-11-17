import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../../../context/AppContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine, faWallet, faBuildingColumns, faFileInvoiceDollar,
  faArrowTrendUp, faArrowTrendDown, faFilter, faDownload,
  faBrain, faTriangleExclamation, faRobot, faShieldHalved,
  faCheckCircle, faBuilding, faCoins, faRotateRight,
  faChevronRight, faChevronDown, faBell, faListCheck,
  faCircleUp, faCircleDown, faUserCheck, faLightbulb,
  faCalendarDays, faScaleBalanced, faSearch, faInfoCircle,
  faFileAlt, faPrint, faUndo, faFolderOpen, faFileSignature,
  faExchangeAlt, faPercent, faArrowUp, faArrowDown, faEllipsisV,
  faSliders, faPlus
} from "@fortawesome/free-solid-svg-icons";
import { erpCss, erpColors } from '../../../../components/ui/ux/ErpTheme';
import { getAmsDashboard, getPaymentMetrics, listSalesInvoices, listSalesOrders } from '../../../../api/ams';

const ErpDashboard = () => {
  const { theme, setActiveTab } = useApp();
  const isDark = theme === 'dark';

  const [fromDate, setFromDate] = useState('2026-06-01');
  const [toDate, setToDate] = useState('2026-06-30');
  const [dateRange, setDateRange] = useState('this_month');
  const [chartPeriod, setChartPeriod] = useState('Monthly');
  const [cashFlowPeriod, setCashFlowPeriod] = useState('Monthly');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';
  const containerBg = isDark ? '#1a1d29' : '#F8FAFC';
  const colors = erpColors;

  // 1. Executive summary cards data
  const execSummaryCards = [
    { title: 'Summary Report', badge: 'Executive Pack', desc: 'Shows complete accounting health and financial overview.', buttonText: 'Open Executive Summary', icon: faChartLine, bg: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', tab: 'erp_executive_summary' },
    { title: 'Close Checks', badge: 'Control Center', desc: 'Review pending accounting tasks before financial closing.', buttonText: 'Open Control Center', icon: faShieldHalved, bg: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', tab: 'erp_control_center' },
    { title: 'Quality Checks', badge: 'Phase 1 QA', desc: 'Review journal validation, tax validation, and reconciliation.', buttonText: 'Open Quality Checks', icon: faCheckCircle, bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', tab: 'erp_quality_assurance' },
    { title: 'All Reports', badge: 'Report Center', desc: 'Access complete ledger, aging, tax, and statement reports.', buttonText: 'Open Reports', icon: faFolderOpen, bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', tab: 'erp_report_center' }
  ];

  // 2. Financial KPI Cards
  const kpiCards = [
    { label: 'Accounts Receivable', value: '$1,920,450', trend: '+12.4%', isUp: true, desc: 'Outstanding customer invoices', icon: faFileInvoiceDollar, color: colors.warning, badge: 'Due' },
    { label: 'Bank Balance', value: '$5,820,400', trend: '-2.1%', isUp: false, desc: 'Current bank balance', icon: faBuildingColumns, color: colors.primary, badge: 'Reconciled' },
    { label: 'Cash Balance', value: '$2,450,120', trend: '+8.3%', isUp: true, desc: 'Cash available', icon: faWallet, color: colors.success, badge: 'Liquid' },
    { label: 'Today\'s Sales', value: '$340,250', trend: '+15.2%', isUp: true, desc: 'Today\'s posted invoices', icon: faChartLine, color: colors.info, badge: 'Posted' },
    { label: 'Today\'s Receipts', value: '$198,400', trend: '+9.1%', isUp: true, desc: 'Today\'s customer collections', icon: faCoins, color: colors.purple, badge: 'Collected' },
    { label: 'Today\'s Payments', value: '$120,350', trend: '-4.3%', isUp: false, desc: 'Today\'s vendor payments', icon: faWallet, color: colors.danger, badge: 'Cleared' },
    { label: 'Tax Payable', value: '$425,800', trend: '+5.6%', isUp: true, desc: 'Current payable taxes', icon: faScaleBalanced, color: colors.danger, badge: 'Due 15th' }
  ];

  // SVG Sparkline Component
  const MiniSparkline = ({ data = [10, 15, 12, 18, 16, 22, 20, 25, 23, 28], color = '#6366f1' }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 100;
    const height = 28;
    const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(' ');
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <polyline fill="none" stroke={color} strokeWidth="1.8" points={points} />
      </svg>
    );
  };

  // Real top customers from backend
  const liveTopCustomers = useMemo(() => {
    if (dashboardData?.top_customers?.length > 0) {
      return dashboardData.top_customers.map((c, idx) => ({
        name: c.name,
        revenue: c.revenue ? `$${Number(c.revenue).toLocaleString()}` : '$0',
        outstanding: c.outstanding ? `$${Number(c.outstanding).toLocaleString()}` : '$0',
        invoices: c.invoice_count || 0,
        avgTime: c.avg_payment_days ? `${c.avg_payment_days} days` : '—',
        collection: c.collection_rate || 0,
        color: [colors.primary, colors.success, colors.warning, colors.info][idx % 4],
      }));
    }
    return [];
  }, [dashboardData]);

  // Top Customers Ranking
  const topCustomers = useMemo(() => {
    if (liveTopCustomers.length > 0) return liveTopCustomers;
    return [];
  }, [liveTopCustomers]);

  // Top Vendors Ranking
  const topVendors = useMemo(() => {
    if (dashboardData?.top_vendors?.length > 0) {
      return dashboardData.top_vendors.map((v, idx) => ({
        name: v.name,
        purchase: v.purchase ? `$${Number(v.purchase).toLocaleString()}` : '$0',
        outstanding: v.outstanding ? `$${Number(v.outstanding).toLocaleString()}` : '$0',
        avgDays: v.avg_days ? `${v.avg_days} days` : '—',
        frequency: v.frequency || 'Monthly',
        rating: v.rating || '—',
      }));
    }
    return [];
  }, [dashboardData]);

  // Bank & Cash accounts list
  const bankAccounts = useMemo(() => {
    if (dashboardData?.bank_accounts?.length > 0) {
      return dashboardData.bank_accounts.map(b => ({
        bankName: b.bank_name,
        accountNo: b.account_no,
        currency: b.currency,
        available: b.available,
        current: b.current,
        updated: b.updated,
      }));
    }
    return [];
  }, [dashboardData]);

  // Overdue Invoices List
  const overdueInvoices = useMemo(() => {
    if (dashboardData?.overdue_invoices?.length > 0) {
      return dashboardData.overdue_invoices;
    }
    return [];
  }, [dashboardData]);

  // Overdue Vendor Bills List
  const overdueBills = [
    { id: 'BILL-2026-112', vendor: 'Core Energy', due: '2026-06-20', amount: '$60,000', days: 12, priority: 'High' },
    { id: 'BILL-2026-105', vendor: 'Digital Infra', due: '2026-06-28', amount: '$15,000', days: 4, priority: 'Medium' }
  ];

  // Recent Transactions Table Data
  const recentTransactions = [
    { no: 'TXN-9024', date: '2026-07-02', voucher: 'JV-2026-101', type: 'Journal Entry', partner: 'Accrued Payroll', desc: 'Monthly Salary Posting Period 4', amount: '$310,000.00', method: 'Direct Bank', status: 'Posted', ref: 'Ref: Payroll-Jun', author: 'Auditor Dept', branch: 'HQ Dublin' },
    { no: 'TXN-9025', date: '2026-07-02', voucher: 'INV-2026-904', type: 'Sales Invoice', partner: 'Acme Corporates', desc: 'Enterprise SaaS Annual Fee', amount: '$45,200.00', method: 'Wire Transfer', status: 'Posted', ref: 'PO-9910-AC', author: 'Sales Clerk', branch: 'NY Office' },
    { no: 'TXN-9026', date: '2026-07-01', voucher: 'PAY-2026-450', type: 'Vendor Payment', partner: 'Core Energy Supplies', desc: 'Electricity Facility Re-bill', amount: '$18,240.00', method: 'ACH Transfer', status: 'Posted', ref: 'Utility-Dublin-4', author: 'Accounts Payable', branch: 'Dublin Warehouse' },
    { no: 'TXN-9027', date: '2026-07-01', voucher: 'CRN-2026-112', type: 'Credit Note', partner: 'Apex Tech Solutions', desc: 'Discount adjustments tier level 3', amount: '$4,500.00', method: 'Credit Balance', status: 'Posted', ref: 'Dispute-8812', author: 'CFO Office', branch: 'HQ Dublin' }
  ];

  // Foundation Status Items (driven by real data)
  const foundationStatus = useMemo(() => {
    const d = dashboardData;
    if (!d) return [];
    return [
      { name: 'Accounting Settings', status: 'Configured' },
      { name: 'Fiscal Year', status: d.open_fiscal_years > 0 ? 'Configured' : 'Pending' },
      { name: 'Chart of Accounts', status: d.total_accounts > 0 ? 'Configured' : 'Pending' },
      { name: 'Account Groups', status: d.total_accounts > 0 ? 'Configured' : 'Pending' },
      { name: 'Opening Balances', status: (d.total_receivable > 0 || d.total_payable > 0) ? 'Configured' : 'Pending' },
      { name: 'Journal Engine', status: 'Configured' },
      { name: 'Tax Configuration', status: 'Configured' },
      { name: 'Cost Centers', status: 'Configured' },
      { name: 'Profit Centers', status: 'Pending' },
      { name: 'Currencies', status: 'Configured' },
      { name: 'Branches', status: 'Configured' },
      { name: 'Financial Calendar', status: d.open_periods > 0 ? 'Configured' : 'Pending' },
      { name: 'Audit Configuration', status: d.audit_health > 50 ? 'Configured' : 'Not Configured' }
    ];
  }, [dashboardData]);

  // Posting Controls Details (driven by real data)
  const postingControls = useMemo(() => {
    const d = dashboardData;
    return [
      { label: 'Total Accounts', value: d ? `${d.total_accounts || 0}` : '—' },
      { label: 'Active Accounts', value: d ? `${d.active_accounts || 0}` : '—' },
      { label: 'Open Fiscal Years', value: d ? `${d.open_fiscal_years || 0}` : '—' },
      { label: 'Open Periods', value: d ? `${d.open_periods || 0}` : '—' },
      { label: 'Total Receivable', value: d?.total_receivable ? `$${Number(d.total_receivable).toLocaleString()}` : '$0.00' },
      { label: 'Total Payable', value: d?.total_payable ? `$${Number(d.total_payable).toLocaleString()}` : '$0.00' },
      { label: 'Pending Approvals', value: d ? `${d.pending_approvals || 0}` : '—' },
      { label: 'Audit Health', value: d?.audit_health ? `${d.audit_health}%` : '—' },
      { label: 'Today Receipts', value: d?.today_receipts ? `$${Number(d.today_receipts).toLocaleString()}` : '$0.00' },
      { label: 'Today Payments', value: d?.today_payments ? `$${Number(d.today_payments).toLocaleString()}` : '$0.00' },
      { label: 'Last Updated', value: d?.last_updated ? new Date(d.last_updated).toLocaleString() : '—' }
    ];
  }, [dashboardData]);

  // Fetch dashboard data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [dashRes, metricsRes, invoicesRes, ordersRes] = await Promise.allSettled([
          getAmsDashboard(),
          getPaymentMetrics(),
          listSalesInvoices({ limit: 4, sort: '-created_at' }),
          listSalesOrders({ limit: 4, sort: '-created_at' }),
        ]);

        if (dashRes.status === 'fulfilled' && dashRes.value?.data?.data) {
          setDashboardData(dashRes.value.data.data);
        }
        if (metricsRes.status === 'fulfilled' && metricsRes.value?.data?.data) {
          setMetrics(metricsRes.value.data.data);
        }
        if (invoicesRes.status === 'fulfilled' && invoicesRes.value?.data?.data) {
          setRecentInvoices(Array.isArray(invoicesRes.value.data.data) ? invoicesRes.value.data.data : []);
        }
        if (ordersRes.status === 'fulfilled' && ordersRes.value?.data?.data) {
          setRecentOrders(Array.isArray(ordersRes.value.data.data) ? ordersRes.value.data.data : []);
        }
      } catch (err) {
        console.warn('Dashboard API fallback:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Real KPIs from backend data
  const liveKpiCards = useMemo(() => {
    const d = dashboardData;
    const m = metrics;
    return [
      { label: 'Accounts Receivable', value: d?.total_receivable ? `$${Number(d.total_receivable).toLocaleString()}` : (m?.receivable ? `$${Number(m.receivable).toLocaleString()}` : '$0'), trend: m?.receivable_trend || 'Live', isUp: true, desc: 'Outstanding customer invoices', icon: faFileInvoiceDollar, color: colors.warning, badge: 'Due' },
      { label: 'Bank Balance', value: m?.bankBalance ? `$${Number(m.bankBalance).toLocaleString()}` : '$0', trend: m?.bankTrend || 'Live', isUp: true, desc: 'Current bank balance', icon: faBuildingColumns, color: colors.primary, badge: 'Reconciled' },
      { label: 'Cash Balance', value: m?.cashBalance ? `$${Number(m.cashBalance).toLocaleString()}` : '$0', trend: m?.cashTrend || 'Live', isUp: true, desc: 'Cash available', icon: faWallet, color: colors.success, badge: 'Liquid' },
      { label: "Today's Sales", value: d?.today_sales ? `$${Number(d.today_sales).toLocaleString()}` : (m?.todaySales ? `$${Number(m.todaySales).toLocaleString()}` : '$0'), trend: m?.salesTrend || 'Live', isUp: true, desc: "Today's posted invoices", icon: faChartLine, color: colors.info, badge: 'Posted' },
      { label: "Today's Receipts", value: d?.today_receipts ? `$${Number(d.today_receipts).toLocaleString()}` : '$0', trend: 'Live', isUp: true, desc: "Today's customer collections", icon: faCoins, color: colors.purple, badge: 'Collected' },
      { label: "Today's Payments", value: d?.today_payments ? `$${Number(d.today_payments).toLocaleString()}` : '$0', trend: 'Live', isUp: false, desc: "Today's vendor payments", icon: faWallet, color: colors.danger, badge: 'Cleared' },
      { label: 'Tax Payable', value: m?.taxPayable ? `$${Number(m.taxPayable).toLocaleString()}` : '$0', trend: m?.taxTrend || 'Live', isUp: false, desc: 'Current payable taxes', icon: faScaleBalanced, color: colors.danger, badge: 'Due 15th' }
    ];
  }, [dashboardData, metrics]);

  const liveTransactions = useMemo(() => {
    if (recentInvoices.length > 0) {
      return recentInvoices.map(inv => ({
        voucher: inv.invoice_number || inv.number || `INV-${inv.id}`,
        date: inv.invoice_date || inv.created_at?.split('T')[0] || '-',
        type: 'Sales Invoice',
        partner: inv.customer_name || inv.customer?.name || '-',
        desc: inv.notes || inv.description || 'Invoice',
        amount: inv.total ? `$${Number(inv.total).toLocaleString()}` : inv.amount || '-',
        method: inv.payment_method || 'Pending',
        status: inv.status || 'Draft',
      }));
    }
    if (dashboardData?.recent_receipts) {
      return dashboardData.recent_receipts.map(r => ({
        voucher: r.number || `RCP-${r.id}`,
        date: r.date || '-',
        type: 'Customer Receipt',
        partner: r.customer_name || '-',
        desc: 'Customer collection',
        amount: r.amount ? `$${Number(r.amount).toLocaleString()}` : '-',
        method: r.method || 'Bank',
        status: r.status || 'Posted',
      }));
    }
    return [];
  }, [recentInvoices, dashboardData]);

  return (
    <div className="container-fluid py-4 fade-in" style={{ color: textColor }}>
      <style>{`
        ${erpCss(isDark)}
        .form-control:focus, .form-select:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }
        .erp-hero {
          position: relative;
          overflow: hidden;
          background: ${isDark ? 'linear-gradient(135deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.8) 100%)' : 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)'};
          border: 1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(99,102,241,0.12)'};
          border-radius: 24px;
          box-shadow: ${isDark ? '0 10px 30px -10px rgba(0,0,0,0.5)' : '0 10px 30px -10px rgba(99,102,241,0.15)'};
          backdrop-filter: blur(20px);
        }
        .erp-hero::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);
        }
        .erp-orb-1 {
          position: absolute; right: -10%; top: -20%;
          width: 300px; height: 300px; border-radius: 50%;
          background: ${isDark ? 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)'};
          z-index: 1; pointer-events: none;
        }
        .erp-orb-2 {
          position: absolute; left: -5%; bottom: -30%;
          width: 250px; height: 250px; border-radius: 50%;
          background: ${isDark ? 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)'};
          z-index: 1; pointer-events: none;
        }
        .erp-badge {
          background: ${isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)'};
          color: ${isDark ? '#cbd5e1' : '#4f46e5'};
          border: 1px solid ${isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.15)'};
          letter-spacing: 0.05em; text-transform: uppercase;
          font-weight: 700; font-size: 11px;
          padding: 6px 14px; border-radius: 30px;
        }
        .live-dot-pulse {
          position: relative;
          display: inline-flex;
          height: 8px; width: 8px; border-radius: 50%;
          background-color: #10b981;
        }
        .live-dot-pulse::after {
          content: '';
          position: absolute; top: 0; left: 0;
          width: 100%; height: 100%; border-radius: 50%;
          background-color: #10b981;
          animation: pulse-ring 1.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.6); opacity: 1; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        .tracking-tight { letter-spacing: -0.03em; }
        .erp-title-gradient {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 40%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .erp-title-gradient-light {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 40%, #db2777 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .erp-mesh-bg {
          position: absolute; inset: 0;
          background-image: 
            radial-gradient(circle at 15% 25%, ${isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.05)'} 0%, transparent 50%),
            radial-gradient(circle at 85% 15%, ${isDark ? 'rgba(168,85,247,0.06)' : 'rgba(168,85,247,0.04)'} 0%, transparent 50%),
            radial-gradient(circle at 50% 80%, ${isDark ? 'rgba(236,72,153,0.05)' : 'rgba(236,72,153,0.03)'} 0%, transparent 50%),
            radial-gradient(circle at 90% 70%, ${isDark ? 'rgba(16,185,129,0.04)' : 'rgba(16,185,129,0.02)'} 0%, transparent 50%);
          z-index: 1; pointer-events: none;
        }
        .erp-float-orb {
          position: absolute; border-radius: 50%;
          animation: erp-float 6s ease-in-out infinite;
          pointer-events: none;
        }
        .erp-float-orb:nth-child(2) { animation-delay: -2s; }
        .erp-float-orb:nth-child(3) { animation-delay: -4s; }
        @keyframes erp-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.05); }
        }
        @keyframes erp-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .erp-shimmer-text {
          background: linear-gradient(90deg, ${isDark ? '#94a3b8 0%, #e2e8f0 50%, #94a3b8 100%' : '#64748b 0%, #0f172a 50%, #64748b 100%'});
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: erp-shimmer 4s linear infinite;
        }
        .erp-glow-card {
          transition: all 0.3s ease;
        }
        .erp-glow-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px ${isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.15)'};
        }
        .erp-executive-card,
        .erp-executive-card h5,
        .erp-executive-card p,
        .erp-executive-card .erp-executive-icon {
          color: #fff !important;
        }
      `}</style>
      
      {/* Premium Enterprise Header */}
      <div className="erp-hero p-4 p-lg-5 mb-4">
        <div className="erp-mesh-bg"></div>
        <div className="erp-float-orb" style={{ width: '80px', height: '80px', top: '10%', right: '15%', background: isDark ? 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }}></div>
        <div className="erp-float-orb" style={{ width: '120px', height: '120px', bottom: '5%', left: '8%', background: isDark ? 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)' }}></div>
        <div className="erp-float-orb" style={{ width: '60px', height: '60px', top: '40%', left: '30%', background: isDark ? 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)' }}></div>
        <div className="erp-orb-1"></div>
        <div className="erp-orb-2"></div>
        <div className="position-absolute" style={{ top: '-30%', left: '50%', width: '500px', height: '500px', borderRadius: '50%', background: isDark ? 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(168,85,247,0.04) 0%, transparent 70%)', transform: 'translateX(-50%)', pointerEvents: 'none' }}></div>
        <div className="position-relative row align-items-center" style={{ zIndex: 3 }}>
          <div className="col-lg-12 mb-3">
            <div className="d-flex flex-wrap align-items-center gap-3">
              <span className="erp-badge d-flex align-items-center gap-2">
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }}></span>
                Accounting / ERP
              </span>
              <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill" style={{ background: isDark ? 'rgba(16,185,129,0.1)' : 'rgba(16,185,129,0.06)', border: `1px solid ${isDark ? 'rgba(16,185,129,0.2)' : 'rgba(16,185,129,0.15)'}` }}>
                <span className="live-dot-pulse"></span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#10b981' }}>Ledger Core: Live</span>
              </div>
              <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill erp-glow-card" style={{ background: isDark ? 'rgba(251,191,36,0.1)' : 'rgba(251,191,36,0.06)', border: `1px solid ${isDark ? 'rgba(251,191,36,0.2)' : 'rgba(251,191,36,0.15)'}`, cursor: 'default' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#f59e0b' }}>FY 2026 • Q2</span>
              </div>
              <div className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill erp-glow-card" style={{ background: isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.06)', border: `1px solid ${isDark ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.15)'}`, cursor: 'default' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#6366f1' }}>USD • GAAP</span>
              </div>
            </div>
          </div>
          <div className="col-lg-7 col-xl-8">
            <div className="d-flex align-items-center gap-3 mb-2">
              <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: '56px', height: '56px', background: isDark ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.15))' : 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.08))', boxShadow: isDark ? '0 0 20px rgba(99,102,241,0.15)' : '0 0 20px rgba(99,102,241,0.1)' }}>
                <FontAwesomeIcon icon={faBuildingColumns} className="fs-2" style={{ color: '#6366f1' }} />
              </div>
              <div>
                <h1 className={`fw-extrabold tracking-tight mb-0 display-5 ${isDark ? 'erp-title-gradient' : 'erp-title-gradient-light'}`} style={{ lineHeight: 1.15 }}>
                  Accounting Dashboard
                </h1>
                <p className="erp-shimmer-text fs-6 mb-0 fw-light" style={{ fontSize: '0.95rem !important' }}>
                  Professional finance command center
                </p>
              </div>
            </div>
            <div className="d-flex flex-wrap gap-3 mt-3">
              {[
                { label: 'Total Revenue', value: dashboardData?.total_receivable ? `$${Number(dashboardData.total_receivable).toLocaleString()}` : 'Live', color: '#10b981' },
                { label: 'Net Profit', value: metrics?.netProfit ? `$${Number(metrics.netProfit).toLocaleString()}` : 'Live', color: '#6366f1' },
                { label: 'Active Accounts', value: dashboardData?.active_accounts ? Number(dashboardData.active_accounts).toLocaleString() : 'Live', color: '#f59e0b' },
              ].map((stat, idx) => (
                <div key={idx} className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 erp-glow-card" style={{ background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}` }}>
                  <span style={{ width: 3, height: 24, borderRadius: 3, backgroundColor: stat.color }}></span>
                  <div>
                    <div className="small" style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '10px', lineHeight: 1.2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</div>
                    <div className="fw-bold" style={{ color: isDark ? '#f1f5f9' : '#0f172a', fontSize: '13px', lineHeight: 1.3 }}>{stat.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-5 col-xl-4 mt-3 mt-lg-0">
            <div className="d-flex flex-column align-items-lg-end gap-2">
              {/* Premium Action Buttons - Vertical Cards */}
              <div className="d-flex flex-column gap-2 w-100" style={{
                background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.4)',
                borderRadius: 16,
                padding: 8,
              }}>
                {[
                  { id: 'erp_executive_summary', label: 'Executive Summary', icon: faChartLine, grad: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)', primary: true },
                  { id: 'erp_control_center', label: 'Control Center', icon: faSliders, accent: '#6366f1', primary: false },
                  { id: 'erp_quality_assurance', label: 'Quality Checks', icon: faShieldHalved, accent: '#10b981', primary: false },
                  { id: 'erp_create_sales_invoice', label: 'New Sales Invoice', icon: faPlus, grad: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', primary: true },
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setActiveTab(btn.id)}
                    className="btn border-0 d-flex align-items-center justify-content-between w-100"
                    style={{
                      padding: '10px 14px',
                      borderRadius: 12,
                      background: btn.primary ? btn.grad : (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)'),
                      border: btn.primary ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                      color: btn.primary ? '#fff' : (isDark ? '#f1f5f9' : '#0f172a'),
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      if (btn.primary) {
                        e.currentTarget.style.transform = 'translateY(-1px)';
                        e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.15)';
                      } else {
                        e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.85)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (btn.primary) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      } else {
                        e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.6)';
                      }
                    }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span className="d-flex align-items-center justify-content-center rounded-2" style={{
                        width: 28, height: 28,
                        background: btn.primary ? 'rgba(255,255,255,0.15)' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'),
                        fontSize: '0.7rem',
                        color: btn.primary ? '#fff' : btn.accent,
                      }}>
                        <FontAwesomeIcon icon={btn.icon} />
                      </span>
                      {btn.label}
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '0.65rem', opacity: 0.4 }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Date Filter & Control strip */}
      <div className="glass-card mb-4 p-3" style={{ borderRadius: '12px' }}>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
          <div className="d-flex flex-wrap align-items-center gap-2">
            <div className="d-flex align-items-center gap-1">
              <span className="small text-muted">From:</span>
              <input type="date" className="form-control form-control-sm" style={{ width: '150px' }} value={fromDate} onChange={e => setFromDate(e.target.value)} />
            </div>
            <div className="d-flex align-items-center gap-1">
              <span className="small text-muted">To:</span>
              <input type="date" className="form-control form-control-sm" style={{ width: '150px' }} value={toDate} onChange={e => setToDate(e.target.value)} />
            </div>
            <button className="btn btn-sm btn-light border shadow-sm d-flex align-items-center gap-1">
              <FontAwesomeIcon icon={faRotateRight} /> Refresh
            </button>
          </div>

          <div className="d-flex flex-wrap gap-1">
            {['Today', 'This Week', 'This Month', 'This Quarter', 'Current Fiscal Year', 'Previous Month'].map((f) => (
              <button key={f} className={`btn btn-sm border-0 py-1 px-2 rounded-3 ${dateRange === f.toLowerCase().replace(' ', '_') ? 'btn-secondary text-white' : 'btn-light text-muted'}`} style={{ fontSize: '11px' }} onClick={() => setDateRange(f.toLowerCase().replace(' ', '_'))}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Executive Summary Cards Pack */}
      <div className="row g-3 mb-4">
        {execSummaryCards.map((card, idx) => (
          <div key={idx} className="col-xl-3 col-md-6 col-sm-12 enter-anim">
            <div className="premium-card glass-card card border-0 text-white erp-executive-card h-100 p-3" style={{ background: card.bg, borderRadius: '12px' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="badge bg-white bg-opacity-25 text-white" style={{ fontSize: '10px' }}>{card.badge}</span>
                <FontAwesomeIcon icon={card.icon} className="opacity-75 fs-5 erp-executive-icon" />
              </div>
              <h5 className="fw-bold mb-1">{card.title}</h5>
              <p className="small opacity-90 mb-3" style={{ fontSize: '12px', minHeight: '36px' }}>{card.desc}</p>
              <button className="btn btn-sm btn-white w-100 bg-white text-dark fw-bold mt-auto" style={{ border: '0', borderRadius: '8px' }} onClick={() => setActiveTab(card.tab)}>
                {card.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Financial KPI Cards Row */}
      <div className="row g-3 mb-4">
        {liveKpiCards.map((card, idx) => (
          <div key={idx} className="col-xl-3 col-md-6 col-sm-12 enter-anim">
            <div className="premium-card glass-card card border-0 h-100 p-3" style={{ borderRadius: '12px' }}>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small fw-semibold" style={{ color: mutedColor }}>{card.label}</span>
                <span className="badge bg-light text-dark border rounded-pill px-2" style={{ fontSize: '9px' }}>{card.badge}</span>
              </div>
              <h3 className="fw-bold mb-1" style={{ color: textColor }}>{card.value}</h3>
              <div className="d-flex align-items-center justify-content-between mt-2">
                <span className={`small fw-semibold d-inline-flex align-items-center gap-1 ${card.isUp ? 'text-success' : 'text-danger'}`}>
                  <FontAwesomeIcon icon={card.isUp ? faArrowTrendUp : faArrowTrendDown} />
                  {card.trend}
                </span>
                <MiniSparkline color={card.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts & Side Panels */}
      <div className="row g-4 mb-4">
        {/* Revenue vs Expense Chart */}
        <div className="col-lg-8">
          <div className="glass-card p-4 h-100" style={{ borderRadius: '12px' }}>
            <div className="section-header">
              <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #6366f1, #8b5cf6)' }} />
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>Revenue vs Expense</h5>
              <span className="small text-muted ms-2">Comparison details for operating lines</span>
            </div>
              <div className="d-flex align-items-center gap-2">
                {['Monthly', 'Quarterly', 'Yearly'].map((p) => (
                  <button key={p} className={`btn btn-sm btn-light py-1 px-2 border-0 ${chartPeriod === p ? 'bg-secondary text-white' : ''}`} style={{ fontSize: '11px' }} onClick={() => setChartPeriod(p)}>
                    {p}
                  </button>
                ))}
              </div>
            <div className="py-2" style={{ height: '220px' }}>
              {/* Custom SVG Column Chart */}
              <svg width="100%" height="220" viewBox="0 0 500 200" style={{ overflow: 'visible' }}>
                {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
                  const y = 20 + 150 * p;
                  return (
                    <line key={idx} x1="40" y1={y} x2="480" y2={y} stroke={borderColor} strokeWidth="0.5" strokeDasharray="3 3" />
                  );
                })}
                {/* 6 Monthly Columns for Rev & Exp */}
                {[
                  { m: 'Jan', rev: 140, exp: 90 },
                  { m: 'Feb', rev: 160, exp: 100 },
                  { m: 'Mar', rev: 175, exp: 110 },
                  { m: 'Apr', rev: 155, exp: 115 },
                  { m: 'May', rev: 185, exp: 120 },
                  { m: 'Jun', rev: 195, exp: 130 }
                ].map((item, idx) => {
                  const x = 50 + idx * 72;
                  const revH = item.rev * 0.7;
                  const expH = item.exp * 0.7;
                  return (
                    <g key={idx}>
                      {/* Revenue Column */}
                      <rect x={x} y={170 - revH} width="16" height={revH} rx="2" fill={colors.primary} />
                      {/* Expense Column */}
                      <rect x={x + 18} y={170 - expH} width="16" height={expH} rx="2" fill={colors.danger} />
                      <text x={x + 17} y="185" textAnchor="middle" fill={mutedColor} fontSize="9">{item.m}</text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        </div>

        {/* Profit Snapshot Side Panel */}
        <div className="col-lg-4">
          <div className="glass-card p-4 h-100" style={{ borderRadius: '12px' }}>
            <div className="section-header">
              <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #10b981, #06b6d4)' }} />
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>Profit Snapshot</h5>
            </div>
            <div className="d-flex flex-column gap-3">
              {[
                { label: 'Gross Profit', value: '$4,362,450', percent: '34.9%', color: colors.success },
                { label: 'Net Profit', value: '$3,102,300', percent: '24.8%', color: colors.info },
                { label: 'Operating Profit', value: '$3,820,150', percent: '30.6%', color: colors.primary },
                { label: 'Profit Margin', value: '24.8%', percent: '+3.1% YoY', color: colors.warning }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-3 border" style={{ borderColor: borderColor, backgroundColor: containerBg }}>
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="small text-muted">{item.label}</span>
                    <span className="badge bg-light text-dark border" style={{ fontSize: '10px' }}>{item.percent}</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <h4 className="fw-bold mb-0" style={{ color: item.color }}>{item.value}</h4>
                    <MiniSparkline color={item.color} data={[12, 15, 14, 18, 17, 21, 20]} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cash Flow Summary & Expense Breakdown */}
      <div className="row g-4 mb-4">
        {/* Cash Flow Summary Area Chart */}
        <div className="col-lg-8">
          <div className="glass-card p-4 h-100" style={{ borderRadius: '12px' }}>
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <div className="section-header" style={{ marginBottom: 0 }}>
                <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #10b981, #059669)' }} />
                <h5 className="fw-bold mb-0" style={{ color: textColor }}>Cash Flow Summary</h5>
                <span className="small text-muted ms-2">Operating cash position, inflows vs outflows</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                {['Daily', 'Weekly', 'Monthly'].map((p) => (
                  <button key={p} className={`btn btn-sm btn-light py-1 px-2 border-0 ${cashFlowPeriod === p ? 'bg-secondary text-white' : ''}`} style={{ fontSize: '11px' }} onClick={() => setCashFlowPeriod(p)}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="py-2" style={{ height: '220px' }}>
              <svg width="100%" height="220" viewBox="0 0 500 200" style={{ overflow: 'visible' }}>
                <path d="M 40 150 Q 120 100, 200 120 T 360 80 T 480 90 L 480 170 L 40 170 Z" fill={colors.success + '20'} />
                <path d="M 40 150 Q 120 100, 200 120 T 360 80 T 480 90" fill="none" stroke={colors.success} strokeWidth="2.5" />
                <line x1="40" y1="170" x2="480" y2="170" stroke={borderColor} strokeWidth="1" />
                {/* Highlights */}
                <circle cx="360" cy="80" r="4" fill={colors.success} />
                <text x="360" y="70" textAnchor="middle" fill={textColor} fontSize="10" fontWeight="bold">+$436,000</text>
              </svg>
            </div>
          </div>
        </div>

        {/* Expense Breakdown Horizontal Bars */}
        <div className="col-lg-4">
          <div className="glass-card p-4 h-100" style={{ borderRadius: '12px' }}>
            <div className="section-header">
              <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #f59e0b, #f97316)' }} />
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>Expense Breakdown</h5>
            </div>
            <div className="d-flex flex-column gap-3">
              {[
                { name: 'Payroll', val: '45%', amt: '$365,000', color: colors.primary },
                { name: 'Rent', val: '15%', amt: '$120,000', color: colors.danger },
                { name: 'Utilities', val: '12%', amt: '$98,000', color: colors.warning },
                { name: 'Marketing', val: '10%', amt: '$81,000', color: colors.info },
                { name: 'Office Expense', val: '8%', amt: '$64,000', color: colors.success },
                { name: 'IT Infrastructure', val: '6%', amt: '$48,000', color: colors.purple }
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="d-flex justify-content-between small mb-1">
                    <span className="fw-medium">{item.name}</span>
                    <span className="text-muted">{item.amt} ({item.val})</span>
                  </div>
                  <div className="progress" style={{ height: 6, backgroundColor: isDark ? '#374151' : '#F3F4F6' }}>
                    <div className="progress-bar rounded" style={{ width: item.val, backgroundColor: item.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Receivable vs Payable Aging Buckets */}
      <div className="row g-4 mb-4">
        {/* Receivable Aging */}
        <div className="col-lg-6">
          <div className="glass-card p-4 h-100" style={{ borderRadius: '12px' }}>
            <div className="section-header">
              <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #10b981, #059669)' }} />
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>Accounts Receivable Aging</h5>
            </div>
            <div className="d-flex align-items-center gap-3">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke={colors.success} strokeWidth="10" strokeDasharray="314" strokeDashoffset="80" />
                <circle cx="60" cy="60" r="50" fill="none" stroke={colors.warning} strokeWidth="10" strokeDasharray="314" strokeDashoffset="240" />
                <circle cx="60" cy="60" r="50" fill="none" stroke={colors.danger} strokeWidth="10" strokeDasharray="314" strokeDashoffset="290" />
              </svg>
              <div className="w-100 d-flex flex-column gap-2 small">
                {[
                  { label: 'Current', val: '$1,200,000 (62.5%)', color: colors.success },
                  { label: '1-30 Days', val: '$350,000 (18.2%)', color: colors.warning },
                  { label: '31-60 Days', val: '$220,000 (11.4%)', color: colors.info },
                  { label: '61-90 Days', val: '$110,000 (5.7%)', color: colors.danger },
                  { label: '91-120 Days', val: '$30,000 (1.5%)', color: colors.purple },
                  { label: '120+ Days', val: '$10,450 (0.7%)', color: '#111827' }
                ].map((item, idx) => (
                  <div key={idx} className="d-flex align-items-center justify-content-between">
                    <span className="d-flex align-items-center gap-1">
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color }}></span>
                      {item.label}
                    </span>
                    <span className="fw-semibold">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Payable Aging */}
        <div className="col-lg-6">
          <div className="glass-card p-4 h-100" style={{ borderRadius: '12px' }}>
            <div className="section-header">
              <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #6366f1, #8b5cf6)' }} />
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>Accounts Payable Aging</h5>
            </div>
            <div className="d-flex align-items-center gap-3">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke={colors.primary} strokeWidth="10" strokeDasharray="314" strokeDashoffset="120" />
                <circle cx="60" cy="60" r="50" fill="none" stroke={colors.danger} strokeWidth="10" strokeDasharray="314" strokeDashoffset="260" />
              </svg>
              <div className="w-100 d-flex flex-column gap-2 small">
                {[
                  { label: 'Current', val: '$580,000 (59.1%)', color: colors.primary },
                  { label: '1-30 Days', val: '$240,000 (24.4%)', color: colors.warning },
                  { label: '31-60 Days', val: '$90,000 (9.1%)', color: colors.danger },
                  { label: '61-90 Days', val: '$45,000 (4.5%)', color: colors.info },
                  { label: '91-120 Days', val: '$20,000 (2.0%)', color: colors.purple },
                  { label: '120+ Days', val: '$5,600 (0.9%)', color: '#111827' }
                ].map((item, idx) => (
                  <div key={idx} className="d-flex align-items-center justify-content-between">
                    <span className="d-flex align-items-center gap-1">
                      <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: item.color }}></span>
                      {item.label}
                    </span>
                    <span className="fw-semibold">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posted Transactions & Posting Controls */}
      <div className="row g-4 mb-4">
        {/* Table list */}
        <div className="col-xl-8">
          <div className="glass-card p-4 h-100" style={{ borderRadius: '12px' }}>
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
              <div className="section-header" style={{ marginBottom: 0 }}>
                <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #6366f1, #8b5cf6)' }} />
                <h5 className="fw-bold mb-0" style={{ color: textColor }}>Recent Posted Transactions</h5>
              </div>
              <div className="d-flex align-items-center gap-2">
                <input type="text" className="form-control form-control-sm" placeholder="Search Voucher..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '180px' }} />
                <button className="btn btn-sm btn-light border shadow-sm">Advanced Search</button>
              </div>
            </div>
            <div className="premium-table-wrapper">
              <table className="premium-table" style={{ color: textColor }}>
                <thead>
                  <tr style={{ color: mutedColor }}>
                    <th>Voucher No</th>
                    <th>Date</th>
                    <th>Type</th>
                    <th>Partner</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {liveTransactions.map((tx, idx) => (
                    <tr key={idx}>
                      <td className="fw-bold" style={{ color: '#6366f1' }}>{tx.voucher}</td>
                      <td>{tx.date}</td>
                      <td><span className="badge bg-light text-dark border">{tx.type}</span></td>
                      <td>{tx.partner}</td>
                      <td className="text-truncate" style={{ maxWidth: '120px' }}>{tx.desc}</td>
                      <td className="fw-bold">{tx.amount}</td>
                      <td>{tx.method}</td>
                      <td><span className="badge bg-success text-white rounded-pill">{tx.status}</span></td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-light p-1 border-0" title="View"><FontAwesomeIcon icon={faSearch} fontSize="9" /></button>
                          <button className="btn btn-sm btn-light p-1 border-0" title="Print"><FontAwesomeIcon icon={faPrint} fontSize="9" /></button>
                          <button className="btn btn-sm btn-light p-1 border-0 text-danger" title="Reverse"><FontAwesomeIcon icon={faUndo} fontSize="9" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Controls checklist / Warning System */}
        <div className="col-xl-4">
          <div className="glass-card p-4 h-100" style={{ borderRadius: '12px' }}>
            <div className="section-header">
              <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #f43f5e, #ef4444)' }} />
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>Pending Accounting Controls</h5>
            </div>
            <div className="d-flex flex-column gap-3">
              {[
                { name: 'Pending Journal Approval', count: '4 Drafts', status: 'Warning', risk: 'Medium', color: colors.warning },
                { name: 'Pending Payment Approval', count: '2 Pending', status: 'Normal', risk: 'Low', color: colors.primary },
                { name: 'Pending Tax Filing', count: 'Due Q2 Filing', status: 'Critical', risk: 'High', color: colors.danger },
                { name: 'Pending Reconciliation', count: '5 Accounts', status: 'Reconciliation', risk: 'Medium', color: colors.warning },
                { name: 'Pending Closing tasks', count: 'P4 Period Lock', status: 'Pending', risk: 'High', color: colors.danger }
              ].map((item, idx) => (
                <div key={idx} className="p-3 border rounded-3" style={{ borderColor: borderColor, backgroundColor: containerBg }}>
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="fw-semibold small">{item.name}</span>
                    <span className="badge text-white" style={{ backgroundColor: item.color, fontSize: '9px' }}>{item.risk} Risk</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="small text-muted">{item.count}</span>
                    <button className="btn btn-sm btn-light border py-0 px-2 small" style={{ fontSize: '10px' }}>Approve</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Overdue Items list, top customers and top vendors */}
      <div className="row g-4 mb-4">
        {/* Overdue sales invoices */}
        <div className="col-xl-4 col-md-6 col-sm-12">
          <div className="glass-card p-4 h-100" style={{ borderRadius: '12px' }}>
            <div className="section-header">
              <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #f43f5e, #ef4444)' }} />
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>Overdue Sales Invoices</h5>
            </div>
            <div className="d-flex flex-column gap-3">
              {overdueInvoices.length === 0 ? (
                <div className="text-center py-3" style={{ color: mutedColor, fontSize: '0.8rem' }}>No overdue invoices</div>
              ) : overdueInvoices.map((inv, idx) => (
                <div key={idx} className="d-flex align-items-center justify-content-between p-2 border-bottom" style={{ borderColor: borderColor }}>
                  <div>
                    <div className="fw-bold small">{inv.id}</div>
                    <div className="small text-muted">{inv.customer} • Due {inv.due}</div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold" style={{ color: inv.severity === 'red' ? colors.danger : (inv.severity === 'orange' ? colors.warning : colors.primary) }}>{inv.amount}</div>
                    <span className="badge bg-light text-dark" style={{ fontSize: '9px' }}>{inv.days} Days Overdue</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Overdue Vendor Bills */}
        <div className="col-xl-4 col-md-6 col-sm-12">
          <div className="glass-card p-4 h-100" style={{ borderRadius: '12px' }}>
            <div className="section-header">
              <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #f59e0b, #f97316)' }} />
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>Overdue Vendor Bills</h5>
            </div>
            <div className="d-flex flex-column gap-3">
              {overdueBills.length === 0 ? (
                <div className="text-center py-3" style={{ color: mutedColor, fontSize: '0.8rem' }}>No overdue bills</div>
              ) : overdueBills.map((bill, idx) => (
                <div key={idx} className="d-flex align-items-center justify-content-between p-2 border-bottom" style={{ borderColor: borderColor }}>
                  <div>
                    <div className="fw-bold small">{bill.id}</div>
                    <div className="small text-muted">{bill.vendor} • Due {bill.due}</div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold text-danger">{bill.amount}</div>
                    <span className="badge bg-danger-subtle text-danger" style={{ fontSize: '9px' }}>Priority: {bill.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bank & Cash accounts summary */}
        <div className="col-xl-4 col-md-12 col-sm-12">
          <div className="glass-card p-4 h-100" style={{ borderRadius: '12px' }}>
            <div className="section-header">
              <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #6366f1, #8b5cf6)' }} />
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>Bank & Cash Accounts</h5>
            </div>
            <div className="d-flex flex-column gap-3">
              {bankAccounts.length === 0 ? (
                <div className="text-center py-3" style={{ color: mutedColor, fontSize: '0.8rem' }}>No bank accounts configured</div>
              ) : bankAccounts.map((acc, idx) => (
                <div key={idx} className="p-3 border rounded-3" style={{ borderColor: borderColor, backgroundColor: containerBg }}>
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <span className="fw-bold small">{acc.bankName}</span>
                    <span className="small text-muted">{acc.accountNo}</span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mt-2">
                    <div>
                      <div className="small text-muted">Available Balance:</div>
                      <h5 className="fw-bold mb-0 text-primary">{acc.available}</h5>
                    </div>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-light border py-1 px-2" style={{ fontSize: '10px' }}>Reconcile</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Customers, Top Vendors & Foundation Readiness */}
      <div className="row g-4 mb-4">
        {/* Top Customers */}
        <div className="col-lg-6">
          <div className="glass-card p-4 h-100" style={{ borderRadius: '12px' }}>
            <div className="section-header">
              <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #6366f1, #8b5cf6)' }} />
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>Top Customers (by Revenue)</h5>
            </div>
            <div className="d-flex flex-column gap-3">
              {topCustomers.length === 0 ? (
                <div className="text-center py-3" style={{ color: mutedColor, fontSize: '0.8rem' }}>No customer data available</div>
              ) : topCustomers.map((cust, idx) => (
                <div key={idx} className="p-3 border rounded-3" style={{ borderColor: borderColor }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fw-bold small">{cust.name}</span>
                    <span className="fw-bold text-success">{cust.revenue}</span>
                  </div>
                  <div className="progress mb-2" style={{ height: 6, backgroundColor: isDark ? '#374151' : '#F3F4F6' }}>
                    <div className="progress-bar rounded" style={{ width: `${cust.collection}%`, backgroundColor: cust.color }}></div>
                  </div>
                  <div className="d-flex justify-content-between small text-muted">
                    <span>Outstanding: {cust.outstanding}</span>
                    <span>Avg Pay time: {cust.avgTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Vendors */}
        <div className="col-lg-6">
          <div className="glass-card p-4 h-100" style={{ borderRadius: '12px' }}>
            <div className="section-header">
              <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #10b981, #059669)' }} />
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>Top Vendors</h5>
            </div>
            <div className="d-flex flex-column gap-3">
              {topVendors.length === 0 ? (
                <div className="text-center py-3" style={{ color: mutedColor, fontSize: '0.8rem' }}>No vendor data available</div>
              ) : topVendors.map((ven, idx) => (
                <div key={idx} className="p-3 border rounded-3" style={{ borderColor: borderColor }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="fw-bold small">{ven.name}</span>
                    <span className="fw-bold">{ven.purchase}</span>
                  </div>
                  <div className="d-flex justify-content-between small text-muted">
                    <span>Outstanding Bills: {ven.outstanding}</span>
                    <span>Avg Payment: {ven.avgDays}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Accounting foundation & Posting controls panels */}
      <div className="row g-4 mb-4">
        {/* Foundation status */}
        <div className="col-lg-6">
          <div className="glass-card p-4 h-100" style={{ borderRadius: '12px' }}>
            <div className="section-header">
              <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #10b981, #06b6d4)' }} />
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>Accounting Foundation Status</h5>
            </div>
            <div className="row g-2">
              {foundationStatus.map((item, idx) => (
                <div key={idx} className="col-md-6">
                  <div className="p-2 border rounded-3 d-flex align-items-center justify-content-between small" style={{ borderColor: borderColor, backgroundColor: containerBg }}>
                    <span>{item.name}</span>
                    <span className={`badge ${item.status === 'Configured' ? 'bg-success-subtle text-success border border-success' : 'bg-warning-subtle text-warning border border-warning'}`} style={{ fontSize: '9px' }}>{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Posting controls settings dashboard */}
        <div className="col-lg-6">
          <div className="glass-card p-4 h-100" style={{ borderRadius: '12px' }}>
            <div className="section-header">
              <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #8b5cf6, #6366f1)' }} />
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>Posting Controls Panel</h5>
            </div>
            <div className="row g-2">
              {postingControls.map((item, idx) => (
                <div key={idx} className="col-md-6">
                  <div className="p-2 border rounded-3 d-flex flex-column small" style={{ borderColor: borderColor, backgroundColor: containerBg }}>
                    <span className="text-muted" style={{ fontSize: '10px' }}>{item.label}</span>
                    <span className="fw-bold" style={{ color: item.highlight === 'success' ? colors.success : textColor }}>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Financial Analytics Metrics */}
      <div className="glass-card p-4 mb-4" style={{ borderRadius: '12px' }}>
        <div className="section-header">
          <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #6366f1, #8b5cf6)' }} />
          <h5 className="fw-bold mb-0" style={{ color: textColor }}>Financial Analytics Metrics</h5>
        </div>
        <div className="row g-3">
          {[
            { name: 'Cash Conversion Cycle', val: '42.5 days', status: 'Optimal' },
            { name: 'Accounts Receivable Turnover', val: '11.2x', status: 'Fast' },
            { name: 'Accounts Payable Turnover', val: '8.4x', status: 'On-time' },
            { name: 'Working Capital', val: '$7,720,200', status: 'Consistent' },
            { name: 'Current Ratio', val: '2.87', status: 'Optimal' },
            { name: 'Quick Ratio', val: '2.10', status: 'Safe' },
            { name: 'EBITDA', val: '$4,820,000', status: 'Strong' },
            { name: 'Financial Health Score', val: '94/100', status: 'Excellent', color: colors.success }
          ].map((item, idx) => (
            <div key={idx} className="col-xl-3 col-md-6 col-sm-12">
              <div className="p-3 border rounded-3 text-center" style={{ borderColor: borderColor, backgroundColor: containerBg }}>
                <div className="small text-muted">{item.name}</div>
                <h4 className="fw-bold my-1" style={{ color: item.color || textColor }}>{item.val}</h4>
                <span className="badge bg-light text-dark border px-2 py-1" style={{ fontSize: '9px' }}>{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights & System Notifications */}
      <div className="row g-4">
        {/* AI generated insights list */}
        <div className="col-lg-6">
          <div className="glass-card p-4 h-100" style={{ borderRadius: '12px' }}>
            <div className="section-header">
              <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #8b5cf6, #ec4899)' }} />
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>
                <FontAwesomeIcon icon={faBrain} className="me-2" style={{ color: '#8b5cf6' }} />
                AI Generated Financial Insights
              </h5>
            </div>
            <div className="d-flex flex-column gap-3">
              {[
                { txt: 'Revenue increased by 12.4% compared to trailing quarter, driven by annual subscription upgrades.', color: colors.success },
                { txt: 'Operating expenses increased by 8.2% in utilities & server re-billing lines.', color: colors.warning },
                { txt: 'Receivables overdue exceed safety threshold parameters for Acme Corporates ($340k overdue).', color: colors.danger },
                { txt: 'Estimated tax collections liabilities deposit of $42,500 due in 4 calendar days.', color: colors.warning }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-3 border-start border-4 small" style={{ borderColor: item.color, backgroundColor: containerBg, borderLeftStyle: 'solid' }}>
                  {item.txt}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications & Audits center */}
        <div className="col-lg-6">
          <div className="glass-card p-4 h-100" style={{ borderRadius: '12px' }}>
            <div className="section-header">
              <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #06b6d4, #3b82f6)' }} />
              <h5 className="fw-bold mb-0" style={{ color: textColor }}>
                <FontAwesomeIcon icon={faBell} className="me-2" style={{ color: '#06b6d4' }} />
                System Alerts & Audits Queue
              </h5>
            </div>
            <div className="d-flex flex-column gap-3">
              {[
                { title: 'Silicon Valley Bank Variance', time: '10 mins ago', desc: 'SVB Reconciliation contains a $2,400 unexplained ledger discrepancy for Period 3.', type: 'Reconciliation' },
                { title: 'CFO Level 2 Approval Request', time: '1 hour ago', desc: 'JV-2026-101 requires manual posting approval validation.', type: 'Approval' },
                { title: 'Tax Compliance Checklist', time: '2 hours ago', desc: 'Period 3 Withholding Tax reports are ready for filing.', type: 'Audit' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 border rounded-3 small" style={{ borderColor: borderColor, backgroundColor: containerBg }}>
                  <div className="d-flex justify-content-between mb-1">
                    <span className="fw-bold">{item.title}</span>
                    <span className="text-muted" style={{ fontSize: '10px' }}>{item.time}</span>
                  </div>
                  <p className="mb-0 text-muted">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErpDashboard;
