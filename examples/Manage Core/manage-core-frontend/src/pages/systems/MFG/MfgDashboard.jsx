import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useApp } from '../../../hooks/useApp';
import {
  faIndustry, faTools, faMicrochip, faBox, faCoins, faGem,
  faPercentage, faChartLine, faPlay, faPlus, faCalendarAlt,
  faBuilding, faCodeBranch, faBoxOpen, faExclamationTriangle,
  faWarehouse, faClock, faCheckCircle, faTimesCircle, faSpinner,
  faFlask, faFlag, faArrowUp, faArrowDown, faSearch,
  faFileExport, faPrint, faEye, faEdit, faTrash, faCog,
  faTachometerAlt, faRocket, faRecycle, faClipboardCheck,
  faUserCog, faUsers, faBalanceScale, faHourglassHalf,
  faLayerGroup, faSitemap, faWrench, faTruck, faChartBar,
  faChartPie, faChartArea, faBolt, faFire, faTags,
  faFileInvoiceDollar, faDollarSign, faCubes
} from "@fortawesome/free-solid-svg-icons";
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  Filler
} from 'chart.js';
import {
  getMfgDashboard,
  getMachineUtilization,
  getMaterialConsumption,
  getProductionTimeline,
  getLowStockAlerts,
} from '../../../api/mfg';

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, PointElement, LineElement,
  Filler
);

const AnimatedCounter = ({ value, duration = 800, decimals = 0, prefix = '', suffix = '' }) => {
  const [count, setCount] = React.useState(0);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const numVal = parseFloat(String(value).replace(/[^0-9.]/g, ''));
    if (isNaN(numVal)) { setCount(0); return; }
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(numVal * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [value, duration]);
  if (isNaN(parseFloat(String(value).replace(/[^0-9.]/g, '')))) return <span>{value}</span>;
  const formatted = count.toFixed(decimals);
  return <span>{prefix}{Number(formatted).toLocaleString()}{suffix}</span>;
};

const MfgDashboard = ({ isDark }) => {
  const { setActiveTab, setActiveModule } = useApp();
  const [dateFilter, setDateFilter] = useState('today');
  const [factory, setFactory] = useState('all');
  const [branch, setBranch] = useState('all');

  const [kpiData, setKpiData] = useState([
    { icon: faIndustry, value: '0', label: 'Active Production Orders', change: '0%', color: '#4f46e5', bg: '#eef2ff', trend: [0, 0, 0, 0, 0, 0, 0] },
    { icon: faTools, value: '0', label: 'Work Orders In Progress', change: '0%', color: '#0891b2', bg: '#ecfeff', trend: [0, 0, 0, 0, 0, 0, 0] },
    { icon: faMicrochip, value: '0%', label: 'Machine Utilization', change: '0%', color: '#059669', bg: '#ecfdf5', trend: [0, 0, 0, 0, 0, 0, 0] },
    { icon: faBox, value: '0', label: "Today's Production Output", change: '0%', color: '#d97706', bg: '#fff7ed', trend: [0, 0, 0, 0, 0, 0, 0] },
    { icon: faCoins, value: '$0', label: 'Raw Material Cost', change: '0%', color: '#dc2626', bg: '#fef2f2', trend: [0, 0, 0, 0, 0, 0, 0] },
    { icon: faGem, value: '$0', label: 'Finished Goods Value', change: '0%', color: '#7c3aed', bg: '#f5f3ff', trend: [0, 0, 0, 0, 0, 0, 0] },
    { icon: faPercentage, value: '0%', label: 'Manufacturing Efficiency', change: '0%', color: '#0d9488', bg: '#f0fdfa', trend: [0, 0, 0, 0, 0, 0, 0] },
    { icon: faChartLine, value: '0%', label: 'OEE Score', change: '0%', color: '#2563eb', bg: '#eff6ff', trend: [0, 0, 0, 0, 0, 0, 0] },
  ]);

  const [statusChartData, setStatusChartData] = useState({
    labels: ['Planned', 'Released', 'In Progress', 'Quality Check', 'Completed', 'Cancelled'],
    datasets: [{
      data: [0, 0, 0, 0, 0, 0],
      backgroundColor: ['#94a3b8', '#3b82f6', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444'],
      borderWidth: 0,
      hoverOffset: 8,
    }]
  });

  const [timelineData, setTimelineData] = useState([]);
  const [materialData, setMaterialData] = useState([]);
  const [topMaterials, setTopMaterials] = useState([]);
  const [machineUtilData, setMachineUtilData] = useState({
    labels: [],
    datasets: [
      { label: 'Running Hours', data: [], backgroundColor: '#10b981', borderRadius: 4 },
      { label: 'Idle Hours', data: [], backgroundColor: '#f59e0b', borderRadius: 4 },
      { label: 'Maintenance Hours', data: [], backgroundColor: '#ef4444', borderRadius: 4 },
    ]
  });
  const [costSummary, setCostSummary] = useState([
    { label: 'Material Cost', value: '$0', icon: faCoins, color: '#4f46e5' },
    { label: 'Labor Cost', value: '$0', icon: faUsers, color: '#0891b2' },
    { label: 'Machine Cost', value: '$0', icon: faMicrochip, color: '#059669' },
    { label: 'Overhead Cost', value: '$0', icon: faBalanceScale, color: '#d97706' },
    { label: 'Total Production Cost', value: '$0', icon: faFileInvoiceDollar, color: '#dc2626' },
    { label: 'Cost Per Unit', value: '$0.00', icon: faDollarSign, color: '#7c3aed' },
  ]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [dashRes, utilRes, matRes, tlRes, stockRes] = await Promise.allSettled([
          getMfgDashboard(),
          getMachineUtilization(),
          getMaterialConsumption(),
          getProductionTimeline(),
          getLowStockAlerts(),
        ]);
        if (cancelled) return;

        if (dashRes.status === 'fulfilled') {
          const d = dashRes.value?.data;
          if (d) {
            setKpiData([
              { icon: faIndustry, value: String(d.active_production_orders ?? 0), label: 'Active Production Orders', change: d.active_orders_change ?? '0%', color: '#4f46e5', bg: '#eef2ff', trend: d.active_orders_trend ?? [0, 0, 0, 0, 0, 0, 0] },
              { icon: faTools, value: String(d.work_orders_in_progress ?? 0), label: 'Work Orders In Progress', change: d.wo_progress_change ?? '0%', color: '#0891b2', bg: '#ecfeff', trend: d.wo_progress_trend ?? [0, 0, 0, 0, 0, 0, 0] },
              { icon: faMicrochip, value: `${d.machine_utilization ?? 0}%`, label: 'Machine Utilization', change: d.utilization_change ?? '0%', color: '#059669', bg: '#ecfdf5', trend: d.utilization_trend ?? [0, 0, 0, 0, 0, 0, 0] },
              { icon: faBox, value: String(d.today_output ?? 0), label: "Today's Production Output", change: d.output_change ?? '0%', color: '#d97706', bg: '#fff7ed', trend: d.output_trend ?? [0, 0, 0, 0, 0, 0, 0] },
              { icon: faCoins, value: `$${Number(d.raw_material_cost ?? 0).toLocaleString()}`, label: 'Raw Material Cost', change: d.material_cost_change ?? '0%', color: '#dc2626', bg: '#fef2f2', trend: d.material_cost_trend ?? [0, 0, 0, 0, 0, 0, 0] },
              { icon: faGem, value: `$${Number(d.finished_goods_value ?? 0).toLocaleString()}`, label: 'Finished Goods Value', change: d.fg_value_change ?? '0%', color: '#7c3aed', bg: '#f5f3ff', trend: d.fg_value_trend ?? [0, 0, 0, 0, 0, 0, 0] },
              { icon: faPercentage, value: `${d.mfg_efficiency ?? 0}%`, label: 'Manufacturing Efficiency', change: d.efficiency_change ?? '0%', color: '#0d9488', bg: '#f0fdfa', trend: d.efficiency_trend ?? [0, 0, 0, 0, 0, 0, 0] },
              { icon: faChartLine, value: `${d.oee_score ?? 0}%`, label: 'OEE Score', change: d.oee_change ?? '0%', color: '#2563eb', bg: '#eff6ff', trend: d.oee_trend ?? [0, 0, 0, 0, 0, 0, 0] },
            ]);

            if (d.status_breakdown) {
              const labels = Object.keys(d.status_breakdown);
              const values = Object.values(d.status_breakdown);
              const colors = labels.map(s => {
                const map = { 'Planned': '#94a3b8', 'Released': '#3b82f6', 'In Progress': '#f59e0b', 'Quality Check': '#8b5cf6', 'Completed': '#10b981', 'Cancelled': '#ef4444' };
                return map[s] || '#94a3b8';
              });
              setStatusChartData({
                labels,
                datasets: [{ data: values, backgroundColor: colors, borderWidth: 0, hoverOffset: 8 }],
              });
            }

            if (d.recent_orders) setRecentOrders(d.recent_orders);
            if (d.cost_summary) {
              setCostSummary([
                { label: 'Material Cost', value: `$${Number(d.cost_summary.material_cost ?? 0).toLocaleString()}`, icon: faCoins, color: '#4f46e5' },
                { label: 'Labor Cost', value: `$${Number(d.cost_summary.labor_cost ?? 0).toLocaleString()}`, icon: faUsers, color: '#0891b2' },
                { label: 'Machine Cost', value: `$${Number(d.cost_summary.machine_cost ?? 0).toLocaleString()}`, icon: faMicrochip, color: '#059669' },
                { label: 'Overhead Cost', value: `$${Number(d.cost_summary.overhead_cost ?? 0).toLocaleString()}`, icon: faBalanceScale, color: '#d97706' },
                { label: 'Total Production Cost', value: `$${Number(d.cost_summary.total_cost ?? 0).toLocaleString()}`, icon: faFileInvoiceDollar, color: '#dc2626' },
                { label: 'Cost Per Unit', value: `$${Number(d.cost_summary.cost_per_unit ?? 0).toFixed(2)}`, icon: faDollarSign, color: '#7c3aed' },
              ]);
            }
          }
        }

        if (utilRes.status === 'fulfilled') {
          const u = utilRes.value?.data;
          if (u && u.machines) {
            setMachineUtilData({
              labels: u.machines.map(m => m.name),
              datasets: [
                { label: 'Running Hours', data: u.machines.map(m => m.running_hours ?? 0), backgroundColor: '#10b981', borderRadius: 4 },
                { label: 'Idle Hours', data: u.machines.map(m => m.idle_hours ?? 0), backgroundColor: '#f59e0b', borderRadius: 4 },
                { label: 'Maintenance Hours', data: u.machines.map(m => m.maintenance_hours ?? 0), backgroundColor: '#ef4444', borderRadius: 4 },
              ],
            });
          }
        }

        if (matRes.status === 'fulfilled') {
          const m = matRes.value?.data;
          if (m) {
            if (m.summary) setMaterialData(m.summary);
            if (m.top_materials) setTopMaterials(m.top_materials);
          }
        }

        if (tlRes.status === 'fulfilled') {
          const t = tlRes.value?.data;
          if (t && Array.isArray(t)) setTimelineData(t);
          else if (t?.timeline) setTimelineData(t.timeline);
        }

        if (stockRes.status === 'fulfilled') {
          const s = stockRes.value?.data;
          if (s && Array.isArray(s)) setLowStockAlerts(s);
          else if (s?.alerts) setLowStockAlerts(s.alerts);
        }
      } catch {
        // Silently fail - dashboard shows zeros
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const d = isDark ? 'dark-mode' : '';

  const statusChartOptions = {
    cutout: '70%',
    plugins: {
      legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true, font: { size: 11 } } },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = ((ctx.parsed / total) * 100).toFixed(1);
            return `${ctx.label}: ${ctx.parsed} orders (${pct}%)`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  const machineUtilOptions = {
    responsive: true,
    plugins: { legend: { position: 'top', labels: { usePointStyle: true, font: { size: 11 } } } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }, stacked: true }
    },
    maintainAspectRatio: false
  };

  const getPriorityClass = (p) => {
    switch (p) {
      case 'High': return 'danger';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'secondary';
    }
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case 'Planned': return 'secondary';
      case 'Released': return 'info';
      case 'In Progress': return 'warning';
      case 'Quality Check': return 'purple';
      case 'Completed': return 'success';
      case 'Cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  const MiniTrend = ({ data, color }) => {
    const safeData = Array.isArray(data) && data.length > 0 ? data : [0];
    const max = Math.max(...safeData);
    const min = Math.min(...safeData);
    const h = 40;
    const w = 80;
    const points = safeData.map((v, i) => `${(i / (safeData.length - 1)) * w},${h - ((v - min) / (max - min || 1)) * h}`).join(' ');
    return (
      <svg width={w} height={h} className="mt-1" style={{ opacity: 0.7 }}>
        <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
      </svg>
    );
  };

  return (
    <div className={`container-fluid py-4 px-4 ${d}`}>
      <style>{`
/* ----- Premium Card System ----- */
.glass-card {
  background: ${isDark ? 'rgba(30, 41, 59, 0.75)' : 'rgba(255, 255, 255, 0.85)'};
  backdrop-filter: blur(24px) saturate(1.4);
  -webkit-backdrop-filter: blur(24px) saturate(1.4);
  border: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.8)'};
  box-shadow: ${isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 8px 32px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.6)'};
}
.premium-card {
  transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: default;
}
.premium-card:hover {
  transform: translateY(-8px) scale(1.012);
  box-shadow: ${isDark ? '0 32px 64px -12px rgba(0,0,0,0.5)' : '0 32px 64px -16px rgba(0,0,0,0.18), 0 8px 24px -8px rgba(0,0,0,0.08), 0 0 0 1px rgba(59,130,246,0.08)'};
}
.premium-card .kpi-icon {
  transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.premium-card:hover .kpi-icon {
  transform: scale(1.18) rotate(-6deg);
}
.premium-card .kpi-icon-ring {
  position: relative;
}
.premium-card .kpi-icon-ring::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 2px solid currentColor;
  opacity: 0.15;
  animation: kpiPulse 3s ease-in-out infinite;
}
@keyframes kpiPulse {
  0%, 100% { transform: scale(1); opacity: 0.15; }
  50% { transform: scale(1.08); opacity: 0.05; }
}

/* ----- Premium Table ----- */
.premium-table-wrapper {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'};
}
.premium-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}
.premium-table thead {
  position: sticky;
  top: 0;
  z-index: 10;
}
.premium-table thead tr {
  background: ${isDark ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'};
}
.premium-table thead th {
  padding: 14px 16px;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${isDark ? '#94a3b8' : '#64748b'};
  border-bottom: 2px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0'};
  white-space: nowrap;
  user-select: none;
}
.premium-table tbody tr {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 3px solid transparent;
  cursor: pointer;
}
.premium-table tbody tr:hover {
  border-left-color: #4f46e5;
  background: ${isDark ? 'rgba(79,70,229,0.08)' : 'rgba(79,70,229,0.03)'} !important;
  transform: scale(1.001);
}
.premium-table tbody tr:nth-child(even) {
  background: ${isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.012)'};
}
.premium-table tbody tr:nth-child(even):hover {
  background: ${isDark ? 'rgba(79,70,229,0.12)' : 'rgba(79,70,229,0.05)'} !important;
}
.premium-table tbody td {
  padding: 12px 16px;
  border-bottom: 1px solid ${isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc'};
  vertical-align: middle;
}

/* ----- Premium Progress Bar ----- */
.premium-progress {
  height: 6px;
  border-radius: 100px;
  background: ${isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0'};
  overflow: hidden;
  position: relative;
}
.premium-progress-bar {
  height: 100%;
  border-radius: 100px;
  background: linear-gradient(90deg, #4f46e5, #3b82f6, #60a5fa);
  background-size: 200% 100%;
  transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  animation: progressShimmer 2s linear infinite;
}
.premium-progress-bar.complete {
  background: linear-gradient(90deg, #059669, #10b981, #34d399);
}
@keyframes progressShimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ----- Premium Badge ----- */
.premium-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 12px;
  border-radius: 100px;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.premium-badge .badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}
.premium-badge .badge-dot.pulse {
  animation: badgePulse 2s ease-in-out infinite;
}
@keyframes badgePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

/* ----- Premium Button System ----- */
.premium-btn {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}
.premium-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}
.premium-btn:active {
  transform: translateY(0) scale(0.97);
}
.premium-btn .btn-ripple {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.2) 0%, transparent 60%);
  opacity: 0;
  transition: opacity 0.4s;
}
.premium-btn:hover .btn-ripple {
  opacity: 1;
}

/* ----- Premium Actions (circular) ----- */
.premium-action-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  cursor: pointer;
}
.premium-action-btn:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* ----- Quick Action Buttons ----- */
.premium-quick-btn {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.premium-quick-btn:hover {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 12px 32px -8px rgba(0,0,0,0.2);
}
.premium-quick-btn:active {
  transform: translateY(-1px) scale(0.98);
}

/* ----- Section Header ----- */
.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
}
.section-header .accent-bar {
  width: 3px;
  height: 20px;
  border-radius: 2px;
  flex-shrink: 0;
}
.section-header h6 {
  margin: 0;
  font-weight: 700;
  font-size: 0.9rem;
}

/* ----- Animations ----- */
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes countUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.enter-anim {
  animation: fadeSlideUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  opacity: 0;
}
.enter-anim:nth-child(1) { animation-delay: 0.03s; }
.enter-anim:nth-child(2) { animation-delay: 0.06s; }
.enter-anim:nth-child(3) { animation-delay: 0.09s; }
.enter-anim:nth-child(4) { animation-delay: 0.12s; }
.enter-anim:nth-child(5) { animation-delay: 0.15s; }
.enter-anim:nth-child(6) { animation-delay: 0.18s; }
.enter-anim:nth-child(7) { animation-delay: 0.21s; }
.enter-anim:nth-child(8) { animation-delay: 0.24s; }
.enter-anim:nth-child(9) { animation-delay: 0.27s; }
.enter-anim:nth-child(10) { animation-delay: 0.30s; }

/* ----- Live Indicator ----- */
.live-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 0 rgba(16,185,129,0.6);
  animation: livePulse 1.5s ease-in-out infinite;
}
@keyframes livePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.6); }
  50% { box-shadow: 0 0 0 6px rgba(16,185,129,0); }
}

/* ----- Scrollbar ----- */
.premium-table-wrapper::-webkit-scrollbar,
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: ${isDark ? '#334155' : '#cbd5e1'}; border-radius: 100px; }
::-webkit-scrollbar-thumb:hover { background: ${isDark ? '#475569' : '#94a3b8'}; }
`}</style>

      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-4">
        <div>
          <h4 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>
            <span style={{ width: 4, height: 24, background: 'linear-gradient(180deg,#4f46e5,#3b82f6)', borderRadius: 2, display: 'inline-block' }} />
            <FontAwesomeIcon icon={faIndustry} style={{ color: '#4f46e5' }} />
            Manufacturing / MRP Control Center
            <span className="live-dot ms-2" style={{ verticalAlign: 'middle' }} title="Live updates active" />
          </h4>
          <p className="mb-0 ms-2" style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.82rem' }}>
            <FontAwesomeIcon icon={faChartLine} className="me-1" style={{ fontSize: '0.7rem', color: '#94a3b8' }} />
            Monitor production, material availability, work order execution, finished goods output and machine monitoring.
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2 mt-2 mt-md-0">
          <select className="form-select form-select-sm" style={{ width: 'auto', borderRadius: '10px', borderColor: isDark ? '#334155' : '#e2e8f0', background: isDark ? '#1e293b' : '#fff', color: isDark ? '#e2e8f0' : '#1e293b' }} value={dateFilter} onChange={e => setDateFilter(e.target.value)}>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <select className="form-select form-select-sm" style={{ width: 'auto', borderRadius: '10px', borderColor: isDark ? '#334155' : '#e2e8f0', background: isDark ? '#1e293b' : '#fff', color: isDark ? '#e2e8f0' : '#1e293b' }} value={factory} onChange={e => setFactory(e.target.value)}>
            <option value="all">All Factories</option>
            <option value="f1">Factory 1 - Main</option>
            <option value="f2">Factory 2 - Assembly</option>
            <option value="f3">Factory 3 - Packaging</option>
          </select>
          <select className="form-select form-select-sm" style={{ width: 'auto', borderRadius: '10px', borderColor: isDark ? '#334155' : '#e2e8f0', background: isDark ? '#1e293b' : '#fff', color: isDark ? '#e2e8f0' : '#1e293b' }} value={branch} onChange={e => setBranch(e.target.value)}>
            <option value="all">All Branches</option>
            <option value="b1">Branch A</option>
            <option value="b2">Branch B</option>
          </select>
          <button className="btn btn-sm border-0 text-white" style={{ background: 'linear-gradient(135deg,#4f46e5,#3b82f6)', borderRadius: '10px', transition: 'all 0.3s' }}
            onClick={() => { setActiveModule('mfg'); setActiveTab('mfg_production_orders'); }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          ><FontAwesomeIcon icon={faPlus} className="me-1" />New Order</button>
          <button className="btn btn-sm" style={{ borderRadius: '10px', border: '1px solid ' + (isDark ? '#334155' : '#e2e8f0'), color: isDark ? '#e2e8f0' : '#1e293b', transition: 'all 0.3s' }}
            onClick={() => { setActiveModule('mfg'); setActiveTab('mfg_bill_of_materials'); }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#4f46e5'; e.currentTarget.style.color = '#4f46e5'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = isDark ? '#334155' : '#e2e8f0'; e.currentTarget.style.color = isDark ? '#e2e8f0' : '#1e293b'; }}
          ><FontAwesomeIcon icon={faClipboardCheck} className="me-1" />New BOM</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        {kpiData.map((kpi, idx) => (
          <div key={idx} className="col-xl-3 col-lg-4 col-md-6 enter-anim">
            <div className="card border-0 rounded-4 h-100 premium-card glass-card">
              <div className="card-body p-3">
                <div className="d-flex align-items-start justify-content-between mb-2">
                  <div className="kpi-icon kpi-icon-ring rounded-3 d-flex align-items-center justify-content-center" style={{ width: 46, height: 46, background: `linear-gradient(135deg,${kpi.color}20,${kpi.color}08)`, color: kpi.color, boxShadow: `0 2px 8px ${kpi.color}15` }}>
                    <FontAwesomeIcon icon={kpi.icon} style={{ fontSize: '1.1rem' }} />
                  </div>
                  <span className="badge rounded-pill" style={{ background: kpi.change.startsWith('+') ? '#dcfce7' : '#fce7e7', color: kpi.change.startsWith('+') ? '#16a34a' : '#dc2626', fontSize: '0.65rem', fontWeight: 500, padding: '3px 8px' }}>
                    <FontAwesomeIcon icon={kpi.change.startsWith('+') ? faArrowUp : faArrowDown} className="me-1" style={{ fontSize: '0.55rem' }} />
                    {kpi.change}
                  </span>
                </div>
                <h3 className="fw-bold mb-0" style={{ color: isDark ? '#f1f5f9' : '#0f172a', fontSize: '1.5rem', letterSpacing: '-0.02em' }}>
                  <AnimatedCounter value={kpi.value} duration={1000} />
                </h3>
                <small style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: '0.78rem' }}>{kpi.label}</small>
                <MiniTrend data={kpi.trend} color={kpi.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4 mb-4">
        {/* Production Status Doughnut */}
        <div className="col-xl-4 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 h-100" style={{ background: isDark ? '#1e293b' : '#fff' }}>
            <div className="card-body p-4">
              <div className="section-header">
                <span className="accent-bar" style={{ background: 'linear-gradient(180deg,#4f46e5,#3b82f6)' }} />
                <FontAwesomeIcon icon={faChartPie} style={{ color: '#4f46e5', fontSize: '0.85rem' }} />
                <h6 style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>Production Orders by Status</h6>
              </div>
              <div style={{ height: 260 }}>
                <Doughnut data={statusChartData} options={statusChartOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Production Timeline */}
        <div className="col-xl-4 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 h-100" style={{ background: isDark ? '#1e293b' : '#fff' }}>
            <div className="card-body p-4">
              <div className="section-header">
                <span className="accent-bar" style={{ background: 'linear-gradient(180deg,#4f46e5,#3b82f6)' }} />
                <FontAwesomeIcon icon={faClock} style={{ color: '#4f46e5', fontSize: '0.85rem' }} />
                <h6 style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>Production Timeline</h6>
              </div>
              <div className="timeline-container" style={{ overflowY: 'auto' }}>
                {timelineData.map((item, idx) => (
                  <div key={idx} className="d-flex align-items-start mb-3 pb-2" style={{ borderBottom: '1px solid ' + (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)') }}>
                    <div className="me-3 mt-1">
                      <div className={`rounded-circle p-1 d-flex align-items-center justify-content-center`}
                        style={{
                          width: 10, height: 10,
                          backgroundColor: item.priority === 'High' ? '#ef4444' : item.priority === 'Medium' ? '#f59e0b' : '#10b981'
                        }} />
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between">
                        <strong style={{ fontSize: '12px', color: isDark ? '#e2e8f0' : '#0f172a' }}>{item.order}</strong>
                        <span className={`badge bg-${getPriorityClass(item.priority)}-subtle text-${getPriorityClass(item.priority)} rounded-pill`} style={{ fontSize: '9px' }}>{item.priority}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: isDark ? '#94a3b8' : '#475569' }}>
                        {item.product} · {item.machine} · {item.supervisor} · {item.shift}
                      </div>
                      <div className="d-flex justify-content-between mt-1">
                        <small className="text-muted" style={{ fontSize: '10px' }}>Qty: {item.qty}</small>
                        <small className="text-muted" style={{ fontSize: '10px' }}>Due: {item.finish}</small>
                      </div>
                    </div>
                  </div>
                ))}
                {timelineData.length === 0 && (
                  <div className="text-center py-4 text-muted" style={{ fontSize: '12px' }}>No timeline data available</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Material Consumption */}
        <div className="col-xl-4 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 h-100" style={{ background: isDark ? '#1e293b' : '#fff' }}>
            <div className="card-body p-4">
              <div className="section-header">
                <span className="accent-bar" style={{ background: 'linear-gradient(180deg,#4f46e5,#3b82f6)' }} />
                <FontAwesomeIcon icon={faBoxOpen} style={{ color: '#4f46e5', fontSize: '0.85rem' }} />
                <h6 style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>Material Consumption</h6>
              </div>
              {materialData.length > 0 && (
                <div className="row g-2 mb-3">
                  {Object.entries(materialData[0]).slice(0, 5).map(([key, val]) => (
                    <div key={key} className="col-6">
                      <div className="p-2 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}>
                        <small className="text-muted text-capitalize" style={{ fontSize: '10px' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</small>
                        <div className="fw-bold" style={{ fontSize: '14px', color: isDark ? '#e2e8f0' : '#0f172a' }}>{val}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <h6 className="fw-bold mb-2 small" style={{ color: isDark ? '#cbd5e1' : '#334155' }}>Top Consumed Materials</h6>
              {topMaterials.slice(0, 3).map((m, idx) => (
                <div key={idx} className="d-flex align-items-center justify-content-between py-1" style={{ borderBottom: '1px solid ' + (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)') }}>
                  <div>
                    <small style={{ fontSize: '11px', color: isDark ? '#e2e8f0' : '#0f172a' }}>{m.name}</small>
                    <br /><small className="text-muted" style={{ fontSize: '9px' }}>{m.qty}</small>
                  </div>
                  <small className="fw-bold" style={{ fontSize: '11px', color: isDark ? '#e2e8f0' : '#0f172a' }}>{m.cost}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Machine Utilization Chart */}
        <div className="col-xl-6">
          <div className="card border-0 shadow-sm rounded-4" style={{ background: isDark ? '#1e293b' : '#fff' }}>
            <div className="card-body p-4">
              <div className="section-header">
                <span className="accent-bar" style={{ background: 'linear-gradient(180deg,#4f46e5,#3b82f6)' }} />
                <FontAwesomeIcon icon={faMicrochip} style={{ color: '#4f46e5', fontSize: '0.85rem' }} />
                <h6 style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>Machine Utilization</h6>
              </div>
              <div style={{ height: 250 }}>
                <Bar data={machineUtilData} options={machineUtilOptions} />
              </div>
            </div>
          </div>
        </div>

        {/* Manufacturing Cost Summary */}
        <div className="col-xl-6">
          <div className="card border-0 shadow-sm rounded-4" style={{ background: isDark ? '#1e293b' : '#fff' }}>
            <div className="card-body p-4">
              <div className="section-header">
                <span className="accent-bar" style={{ background: 'linear-gradient(180deg,#4f46e5,#3b82f6)' }} />
                <FontAwesomeIcon icon={faFileInvoiceDollar} style={{ color: '#4f46e5', fontSize: '0.85rem' }} />
                <h6 style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>Manufacturing Cost Summary</h6>
              </div>
              <div className="row g-2">
                {costSummary.map((c, idx) => (
                  <div key={idx} className="col-4">
                    <div className="p-2 rounded-3 text-center" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}>
                      <div className="rounded-3 d-inline-flex align-items-center justify-content-center mb-1" style={{ width: 30, height: 30, backgroundColor: `${c.color}1a`, color: c.color }}>
                        <FontAwesomeIcon icon={c.icon} style={{ fontSize: '12px' }} />
                      </div>
                      <div className="fw-bold" style={{ fontSize: '13px', color: isDark ? '#e2e8f0' : '#0f172a' }}>{c.value}</div>
                      <small className="text-muted" style={{ fontSize: '9px' }}>{c.label}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Recent Production Orders */}
        <div className="col-xl-8">
          <div className="card border-0 shadow-sm rounded-4" style={{ background: isDark ? '#1e293b' : '#fff' }}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="section-header mb-0">
                  <span className="accent-bar" style={{ background: 'linear-gradient(180deg,#4f46e5,#3b82f6)' }} />
                  <FontAwesomeIcon icon={faIndustry} style={{ color: '#4f46e5', fontSize: '0.85rem' }} />
                  <h6 style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>Recent Production Orders</h6>
                </div>
                <button className="btn btn-sm border-0" style={{ borderRadius: '8px', background: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', color: isDark ? '#e2e8f0' : '#475569', fontSize: '0.75rem', transition: 'all 0.3s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'; e.currentTarget.style.color = isDark ? '#e2e8f0' : '#475569'; }}
                ><FontAwesomeIcon icon={faEye} className="me-1" />View All</button>
              </div>
              <div className="premium-table-wrapper">
                <table className="table align-middle mb-0 premium-table" style={{ fontSize: '0.78rem' }}>
                  <thead>
                    <tr>
                      <th style={{ width: 32 }}></th>
                      <th>Order</th>
                      <th>Product</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Progress</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((o, idx) => (
                      <tr key={idx}>
                        <td style={{ textAlign: 'center' }}>
                          {o.progress === 100 || o.status === 'Completed' ? (
                            <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#10b981', fontSize: '0.85rem' }} />
                          ) : (
                            <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: '50%', border: '2px solid ' + (isDark ? '#334155' : '#e2e8f0') }} />
                          )}
                        </td>
                        <td><span className="fw-semibold" style={{ color: isDark ? '#e2e8f0' : '#0f172a', fontFamily: "'SF Mono','Fira Code',monospace", fontSize: '0.72rem' }}>{o.no}</span></td>
                        <td style={{ color: isDark ? '#cbd5e1' : '#334155' }}>{o.product}</td>
                        <td>
                          <span className="premium-badge" style={{
                            background: o.status === 'Completed' ? '#dcfce7' : o.status === 'In Progress' ? '#dbeafe' : o.status === 'Quality Check' ? '#f3e8ff' : o.status === 'Released' ? '#e0f2fe' : '#f1f5f9',
                            color: o.status === 'Completed' ? '#16a34a' : o.status === 'In Progress' ? '#2563eb' : o.status === 'Quality Check' ? '#7c3aed' : o.status === 'Released' ? '#0891b2' : '#475569',
                          }}>
                            <span className="badge-dot" style={{
                              background: o.status === 'Completed' ? '#16a34a' : o.status === 'In Progress' ? '#2563eb' : o.status === 'Quality Check' ? '#7c3aed' : o.status === 'Released' ? '#0891b2' : '#475569'
                            }} />
                            {o.status}
                          </span>
                        </td>
                        <td>
                          <span className="badge rounded-pill" style={{
                            background: o.priority === 'High' ? '#fce7e7' : o.priority === 'Medium' ? '#fef9c3' : '#dcfce7',
                            color: o.priority === 'High' ? '#dc2626' : o.priority === 'Medium' ? '#ca8a04' : '#16a34a',
                            fontSize: '0.65rem', fontWeight: 500, padding: '3px 10px',
                          }}>
                            {o.priority}
                          </span>
                        </td>
                        <td style={{ minWidth: 130 }}>
                          <div className="d-flex align-items-center gap-2">
                            <div className="premium-progress flex-grow-1">
                              <div className={`premium-progress-bar ${(o.progress === 100 || o.status === 'Completed') ? 'complete' : ''}`} style={{ width: (o.progress || 0) + '%' }} />
                            </div>
                            <small className="fw-semibold" style={{ fontSize: '0.65rem', color: isDark ? '#94a3b8' : '#475569', minWidth: 28 }}>{o.progress || 0}%</small>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button className="premium-action-btn" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b' }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.color = '#fff'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}
                              title="View"><FontAwesomeIcon icon={faEye} style={{ fontSize: '0.65rem' }} /></button>
                            <button className="premium-action-btn" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9', color: isDark ? '#94a3b8' : '#64748b' }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#3b82f6'; e.currentTarget.style.color = '#fff'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'; e.currentTarget.style.color = isDark ? '#94a3b8' : '#64748b'; }}
                              title="Edit"><FontAwesomeIcon icon={faEdit} style={{ fontSize: '0.65rem' }} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {recentOrders.length === 0 && (
                      <tr><td colSpan={7} className="text-center py-4 text-muted" style={{ fontSize: '12px' }}>No recent production orders</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock Material Alerts */}
        <div className="col-xl-4">
          <div className="card border-0 shadow-sm rounded-4" style={{ background: isDark ? '#1e293b' : '#fff' }}>
            <div className="card-body p-4">
              <div className="section-header">
                <span className="accent-bar" style={{ background: 'linear-gradient(180deg,#dc2626,#f97316)' }} />
                <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#f97316', fontSize: '0.85rem' }} />
                <h6 style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>Low Stock Material Alerts</h6>
              </div>
              {lowStockAlerts.map((m, idx) => (
                <div key={idx} className="p-2 mb-2 rounded-3" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', borderLeft: '3px solid ' + (m.critical ? '#ef4444' : '#f59e0b') }}>
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="fw-bold" style={{ fontSize: '12px', color: isDark ? '#e2e8f0' : '#0f172a' }}>{m.material}</span>
                    {m.critical && <span className="badge bg-danger-subtle text-danger rounded-pill" style={{ fontSize: '9px' }}>Critical</span>}
                  </div>
                  <div className="d-flex flex-wrap gap-2 mt-1" style={{ fontSize: '10px', color: isDark ? '#94a3b8' : '#475569' }}>
                    <span>Available: <strong style={{ color: m.available < m.minStock ? '#ef4444' : '#10b981' }}>{m.available}</strong></span>
                    <span>Min: {m.minStock}</span>
                    <span>Required: {m.required}</span>
                  </div>
                  <div style={{ fontSize: '10px', color: isDark ? '#94a3b8' : '#475569' }}>
                    Supplier: {m.supplier} · Expected: {m.delivery}
                  </div>
                </div>
              ))}
              {lowStockAlerts.length === 0 && (
                <div className="text-center py-3 text-muted" style={{ fontSize: '12px' }}>No low stock alerts</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card border-0 rounded-4 premium-card glass-card">
        <div className="card-body p-4">
          <div className="section-header">
            <span className="accent-bar" style={{ background: 'linear-gradient(180deg,#4f46e5,#3b82f6)' }} />
            <FontAwesomeIcon icon={faRocket} style={{ color: '#4f46e5', fontSize: '0.85rem' }} />
            <h6 style={{ color: isDark ? '#f1f5f9' : '#0f172a' }}>Quick Actions</h6>
          </div>
          <div className="d-flex flex-wrap gap-2">
            {[
              { icon: faPlus, label: 'Create BOM', color: '#4f46e5' },
              { icon: faIndustry, label: 'Create Production Order', color: '#0891b2' },
              { icon: faPlay, label: 'Release Work Orders', color: '#059669' },
              { icon: faBoxOpen, label: 'Material Issue', color: '#d97706' },
              { icon: faRecycle, label: 'Material Return', color: '#7c3aed' },
              { icon: faBox, label: 'Record Production', color: '#dc2626' },
              { icon: faFlask, label: 'Quality Inspection', color: '#0d9488' },
              { icon: faTimesCircle, label: 'Close Production', color: '#2563eb' },
              { icon: faFileExport, label: 'Export Report', color: '#9333ea' },
            ].map((action, idx) => (
              <button key={idx} className="btn btn-sm rounded-3 d-flex align-items-center gap-2 border-0 premium-btn premium-quick-btn" style={{ background: `linear-gradient(135deg,${action.color}15,${action.color}08)`, color: action.color, padding: '6px 14px' }}
                onMouseEnter={e => e.currentTarget.style.background = `linear-gradient(135deg,${action.color}25,${action.color}15)`}
                onMouseLeave={e => e.currentTarget.style.background = `linear-gradient(135deg,${action.color}15,${action.color}08)`}
              >
                <span className="btn-ripple" />
                <FontAwesomeIcon icon={action.icon} style={{ fontSize: '0.75rem' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MfgDashboard;
