import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe, faArrowRightArrowLeft, faUniversity, faMoneyBillWave,
  faArrowUp, faArrowDown, faMinus, faDollarSign, faSync,
  faFileImport, faPlus, faExchangeAlt, faCalculator,
  faFileExport, faSearch, faEye, faCheckCircle, faTimesCircle,
  faClock, faCog, faDownload, faInfoCircle, faChartLine,
  faChartPie, faChartBar, faWallet, faLandmark, faCoins,
  faReceipt, faFileInvoiceDollar, faPercent, faBalanceScale,
  faHistory, faCalendarAlt, faBuilding, faLayerGroup,
  faUsers, faBriefcase, faListAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from '../../../hooks/useTranslation';
import { useApp } from '../../../hooks/useApp';
import { FxExportDropdown, FxImportDropdown } from '../../../components/common/FX/FxExportImportDropdowns';
import { listCurrencies, listExchangeRates, listFxTransactions, listRevaluations } from '../../../api/fx';
import { clearCache } from '../../../api/client';

const FxDashboard = ({ isDark }) => {
  const { t } = useTranslation();
  const { setActiveTab, setActiveModule, addNotification } = useApp();
  const [dateRange, setDateRange] = useState('this_month');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [rates, setRates] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [revaluations, setRevaluations] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [curRes, rateRes, txRes, revRes] = await Promise.all([
        listCurrencies().catch(() => ({ data: [] })),
        listExchangeRates().catch(() => ({ data: [] })),
        listFxTransactions().catch(() => ({ data: [] })),
        listRevaluations().catch(() => ({ data: [] })),
      ]);
      setCurrencies(curRes?.data?.data || curRes?.data || []);
      setRates(rateRes?.data?.data || rateRes?.data || []);
      setTransactions(txRes?.data?.data || txRes?.data || []);
      setRevaluations(revRes?.data?.data || revRes?.data || []);
    } catch (err) {
      console.error('Failed to fetch FX dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    clearCache('/fx');
    await fetchData();
    setRefreshing(false);
    addNotification?.('FX dashboard refreshed with the latest data.', 'success');
  };

  const handleImport = (rows) => {
    if (!Array.isArray(rows) || rows.length === 0) {
      addNotification?.('No importable records found in the file.', 'error');
      return;
    }
    addNotification?.(`Imported ${rows.length} record(s) into the FX dashboard.`, 'success');
  };

  const handleQuickAction = (label) => {
    switch (label) {
      case 'Create Currency':
        setActiveModule('fx');
        setActiveTab('fx_currencies');
        break;
      case 'Import Exchange Rates':
      case 'Manual Exchange Rate':
        setActiveModule('fx');
        setActiveTab('fx_exchange_rates');
        break;
      case 'New FX Transaction':
        setActiveModule('fx');
        setActiveTab('fx_transactions');
        break;
      case 'Run Revaluation':
        setActiveModule('fx');
        setActiveTab('fx_revaluations');
        break;
      case 'Export Report':
        addNotification?.('Report export started. Check your downloads folder.', 'success');
        break;
      default:
        break;
    }
  };

  const containerBg = isDark ? '#1a1d29' : '#F8FAFC';
  const cardBg = isDark ? '#232736' : '#ffffff';
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? '#2d3248' : '#e2e8f0';
  const inputBg = isDark ? '#1a1d29' : '#ffffff';

  const kpis = useMemo(() => {
    const activeCurrencies = currencies.filter((c) => c.status === 'Active').length;
    const today = new Date().toISOString().split('T')[0];
    const todayTx = transactions.filter((tx) => (tx.transactionDate || '').startsWith(today)).length;
    const totalGain = revaluations.reduce((s, r) => {
      const v = parseFloat((r.gain || '0').replace(/[^0-9.-]/g, ''));
      return s + (isNaN(v) ? 0 : v);
    }, 0);
    const totalLoss = revaluations.reduce((s, r) => {
      const v = parseFloat((r.loss || '0').replace(/[^0-9.-]/g, ''));
      return s + (isNaN(v) ? 0 : v);
    }, 0);
    const pendingRev = revaluations.filter((r) => ['Draft', 'Pending'].includes(r.status)).length;
    const fcyAccounts = new Set(transactions.map((tx) => tx.bankAccount).filter(Boolean)).size;
    const totalConverted = transactions.reduce((s, tx) => s + (parseFloat(tx.convertedAmount) || 0), 0);

    return [
      {
        icon: faGlobe, label: 'Active Currencies', value: String(activeCurrencies), change: activeCurrencies > 0 ? `+${activeCurrencies}` : '0', trend: activeCurrencies > 0 ? 'up' : 'neutral',
        daily: `${currencies.length} total`, monthly: activeCurrencies > 0 ? `+${activeCurrencies}` : '—', sparkline: [activeCurrencies, activeCurrencies],
        color: '#3b82f6',
      },
      {
        icon: faSync, label: 'Exchange Rates', value: String(rates.length), change: rates.length > 0 ? `+${rates.length}` : '0', trend: rates.length > 0 ? 'up' : 'neutral',
        daily: `${rates.filter((r) => r.status === 'Active').length} active`, monthly: '—', sparkline: [rates.length, rates.length],
        color: '#10b981',
      },
      {
        icon: faUniversity, label: 'Foreign Currency Accounts', value: String(fcyAccounts), change: '0', trend: fcyAccounts > 0 ? 'up' : 'neutral',
        daily: `${transactions.length} txns`, monthly: '—', sparkline: [fcyAccounts, fcyAccounts],
        color: '#8b5cf6',
      },
      {
        icon: faMoneyBillWave, label: 'FX Transactions', value: String(transactions.length), change: todayTx > 0 ? `+${todayTx}` : '0', trend: todayTx > 0 ? 'up' : 'neutral',
        daily: `${todayTx} today`, monthly: '—', sparkline: [transactions.length, transactions.length],
        color: '#f59e0b',
      },
      {
        icon: faArrowUp, label: 'Exchange Gain', value: `PKR ${totalGain.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, change: totalGain > 0 ? `+${totalGain.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '0', trend: totalGain > 0 ? 'up' : 'neutral',
        daily: '—', monthly: '—', sparkline: [totalGain, totalGain],
        color: '#10b981',
      },
      {
        icon: faArrowDown, label: 'Exchange Loss', value: `PKR ${totalLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, change: totalLoss > 0 ? `-${totalLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '0', trend: totalLoss > 0 ? 'down' : 'neutral',
        daily: '—', monthly: '—', sparkline: [totalLoss, totalLoss],
        color: '#ef4444',
      },
      {
        icon: faCalculator, label: 'Pending Revaluations', value: String(pendingRev), change: pendingRev > 0 ? `+${pendingRev}` : '0', trend: pendingRev > 0 ? 'down' : 'neutral',
        daily: `${revaluations.length} total`, monthly: '—', sparkline: [pendingRev, pendingRev],
        color: '#f97316',
      },
      {
        icon: faCoins, label: 'Total Converted Amount', value: `PKR ${totalConverted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, change: totalConverted > 0 ? `+${totalConverted.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '0', trend: totalConverted > 0 ? 'up' : 'neutral',
        daily: '—', monthly: '—', sparkline: [totalConverted, totalConverted],
        color: '#06b6d4',
      },
    ];
  }, [currencies, rates, transactions, revaluations]);

  const currencyDistribution = useMemo(() => {
    const byCurrency = {};
    transactions.forEach((tx) => {
      const c = tx.currency || 'N/A';
      byCurrency[c] = (byCurrency[c] || 0) + (parseFloat(tx.convertedAmount) || 0);
    });
    const total = Object.values(byCurrency).reduce((s, v) => s + v, 0);
    const palette = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#f97316', '#ec4899', '#14b8a6'];
    return Object.entries(byCurrency)
      .sort((a, b) => b[1] - a[1])
      .map(([currency, amount], i) => ({
        currency,
        percentage: total > 0 ? Number(((amount / total) * 100).toFixed(1)) : 0,
        amount: `PKR ${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
        color: palette[i % palette.length],
      }));
  }, [transactions]);

  const exchangeRateData = useMemo(() => {
    const sorted = [...rates]
      .filter((r) => r.status === 'Active')
      .sort((a, b) => String(a.effective || '').localeCompare(String(b.effective || '')))
      .slice(-30);
    if (sorted.length === 0) return [];
    return sorted.map((r) => {
      const mid = Number(r.mid) || (Number(r.buy) + Number(r.sell)) / 2;
      return {
        date: r.effective || r.id,
        open: Number(r.buy) || mid,
        close: mid,
        high: Number(r.sell) || mid,
        low: Number(r.buy) || mid,
        avg: mid,
      };
    });
  }, [rates]);

  const treasurySummary = useMemo(() => {
    const bankAccounts = new Set(transactions.map((tx) => tx.bankAccount).filter(Boolean)).size;
    const receivableTx = transactions.filter((tx) => ['Foreign Receipt', 'Customer Payment'].includes(tx.transactionType)).length;
    const payableTx = transactions.filter((tx) => ['Foreign Payment', 'Vendor Payment', 'Advance Payment'].includes(tx.transactionType)).length;
    return [
      { label: 'Cash Holdings by Currency', value: `${currencyDistribution.length} currencies`, icon: faCoins, color: '#3b82f6' },
      { label: 'Bank Accounts', value: `${bankAccounts} Accounts`, icon: faUniversity, color: '#10b981' },
      { label: 'Foreign Transactions', value: `${transactions.length} records`, icon: faChartLine, color: '#8b5cf6' },
      { label: 'Foreign Receivables', value: `${receivableTx} receipts`, icon: faMoneyBillWave, color: '#f59e0b' },
      { label: 'Foreign Payables', value: `${payableTx} payments`, icon: faFileInvoiceDollar, color: '#ef4444' },
      { label: 'Exchange Rates', value: `${rates.length} Rates`, icon: faFileImport, color: '#06b6d4' },
    ];
  }, [transactions, rates, currencyDistribution]);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => String(b.transactionDate || '').localeCompare(String(a.transactionDate || '')))
      .slice(0, 5)
      .map((tx) => ({
        id: tx.transactionNumber,
        date: tx.transactionDate,
        currency: tx.currency,
        account: tx.bankAccount,
        type: tx.transactionType,
        rate: tx.exchangeRate,
        amount: `${Number(tx.originalAmount || 0).toLocaleString()} ${tx.currency}`,
        converted: `PKR ${Number(tx.convertedAmount || 0).toLocaleString()}`,
        status: tx.approvalStatus,
        by: tx.createdBy,
      }));
  }, [transactions]);

  const gainLossSummary = useMemo(() => {
    const parseMoney = (v) => {
      const n = parseFloat(String(v).replace(/[^0-9.-]/g, ''));
      return isNaN(n) ? 0 : n;
    };
    const gain = revaluations.reduce((s, r) => s + Math.max(0, parseMoney(r.gain)), 0);
    const loss = revaluations.reduce((s, r) => s + Math.max(0, parseMoney(r.loss)), 0);
    const net = gain - loss;
    const trend = net > 0 ? 'up' : net < 0 ? 'down' : 'neutral';
    const base = [gain, loss, net];
    return [
      { label: 'Realized Gain', value: `PKR ${gain.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, change: gain > 0 ? `+${gain.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '—', trend: gain > 0 ? 'up' : 'neutral', color: '#10b981', sparkline: base },
      { label: 'Realized Loss', value: `PKR ${loss.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, change: loss > 0 ? `-${loss.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '—', trend: loss > 0 ? 'down' : 'neutral', color: '#ef4444', sparkline: base },
      { label: 'Net Currency Difference', value: `PKR ${net.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, change: net > 0 ? '+' : net < 0 ? '-' : '—', trend, color: '#8b5cf6', sparkline: base },
    ];
  }, [revaluations]);

  const MiniSparkline = ({ data, color }) => {
    if (!data || data.length === 0) return null;
    const safe = data.length === 1 ? [data[0], data[0]] : data;
    const max = Math.max(...safe);
    const min = Math.min(...safe);
    const range = max - min || 1;
    const width = 80;
    const height = 24;
    const points = safe.map((v, i) => `${(i / (safe.length - 1)) * width},${height - ((v - min) / range) * height}`).join(' ');
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ marginTop: '4px' }}>
        <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
      </svg>
    );
  };

  const DoughnutChart = ({ data }) => {
    if (!data || data.length === 0) {
      return (
        <div style={{ width: 160, height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: mutedColor, fontSize: '0.8rem' }}>
          No currency data yet
        </div>
      );
    }
    const total = data.reduce((s, d) => s + d.percentage, 0);
    let cumulative = 0;
    const segments = data.map((d) => {
      const start = cumulative;
      cumulative += (d.percentage / total) * 360;
      return { ...d, start, end: cumulative };
    });
    const radius = 60;
    const cx = 80;
    const cy = 80;
    const innerRadius = 35;

    const polarToCartesian = (cx, cy, r, angleDeg) => ({
      x: cx + r * Math.cos((angleDeg - 90) * (Math.PI / 180)),
      y: cy + r * Math.sin((angleDeg - 90) * (Math.PI / 180)),
    });

    const describeArc = (cx, cy, r, startAngle, endAngle) => {
      const start = polarToCartesian(cx, cy, r, startAngle);
      const end = polarToCartesian(cx, cy, r, endAngle);
      const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
      return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y} L ${cx} ${cy} Z`;
    };

    return (
      <svg width="160" height="160" viewBox="0 0 160 160">
        {segments.map((s, i) => (
          <path key={i} d={describeArc(cx, cy, radius, s.start, s.end)} fill={s.color} opacity="0.85" />
        ))}
        <circle cx={cx} cy={cy} r={innerRadius} fill={cardBg} />
      </svg>
    );
  };

  const LineChart = ({ data }) => {
    if (!data || data.length === 0) {
      return (
        <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: mutedColor, fontSize: '0.85rem' }}>
          No active exchange rates yet. Create or sync rates to see the trend here.
        </div>
      );
    }
    const values = data.map((d) => d.close);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    const w = 600;
    const h = 180;
    const pad = 25;
    const chartW = w - pad * 2;
    const chartH = h - pad * 2;
    const step = chartW / (values.length - 1);
    const points = values.map((v, i) => `${pad + i * step},${pad + chartH - ((v - min) / range) * chartH}`).join(' ');
    const avg = values.reduce((s, v) => s + v, 0) / values.length;
    const avgY = pad + chartH - ((avg - min) / range) * chartH;

    return (
      <div style={{ position: 'relative' }}>
        <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
          <line x1={pad} y1={avgY} x2={w - pad} y2={avgY} stroke={borderColor} strokeWidth="1" strokeDasharray="4 4" />
          <polyline fill="none" stroke="#3b82f6" strokeWidth="2" points={points} />
          <text x={w - pad} y={avgY - 4} textAnchor="end" fill={mutedColor} fontSize="10">Avg {avg.toFixed(2)}</text>
        </svg>
      </div>
    );
  };

  const BarChart = () => {
    const data = useMemo(() => {
      const byCompany = {};
      transactions.forEach((tx) => {
        const c = tx.company || 'N/A';
        byCompany[c] = (byCompany[c] || 0) + (parseFloat(tx.convertedAmount) || 0);
      });
      return Object.entries(byCompany)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([label, value]) => ({ label, value: Number(value.toFixed(0)) }));
    }, [transactions]);
    if (data.length === 0) {
      return (
        <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: mutedColor, fontSize: '0.85rem' }}>
          No transaction data yet. Create FX transactions to see company-wise volumes.
        </div>
      );
    }
    const max = Math.max(...data.map((d) => d.value));
    const w = 400;
    const h = 160;
    const pad = 20;
    const chartW = w - pad * 2;
    const chartH = h - pad * 2;
    const barW = chartW / data.length * 0.6;
    const gap = chartW / data.length * 0.4;

    return (
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`}>
        {data.map((d, i) => {
          const barH = (d.value / max) * chartH;
          const x = pad + i * (chartW / data.length) + gap / 2;
          const y = pad + chartH - barH;
          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={barH} rx="4" fill="#3b82f6" opacity="0.85" />
              <text x={x + barW / 2} y={pad + chartH + 12} textAnchor="middle" fill={mutedColor} fontSize="9">{d.label}</text>
            </g>
          );
        })}
      </svg>
    );
  };

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

  return (
    <div style={{ background: containerBg, minHeight: '100vh', padding: 'clamp(0.75rem, 3vw, 1.5rem)', fontFamily: "'Inter', sans-serif" }}>
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
        @keyframes kpiPulse {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.08); opacity: 0.05; }
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

        /* ----- Quick Action Items ----- */
        .premium-quick-item {
          transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
        }
        .premium-quick-item:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 16px 40px -8px rgba(0,0,0,0.15);
        }

        /* ----- Animations ----- */
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes countUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
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
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${isDark ? '#334155' : '#cbd5e1'}; border-radius: 100px; }
        ::-webkit-scrollbar-thumb:hover { background: ${isDark ? '#475569' : '#94a3b8'}; }
      `}</style>

      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-start mb-4" style={{ position: 'relative', zIndex: 110 }}>
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <div style={{
              width: '4px', height: '28px', borderRadius: '3px',
              background: 'linear-gradient(to bottom, #3b82f6, #8b5cf6, #ec4899)',
            }} />
            <span className="live-dot" />
            <h4 className="fw-bold mb-0" style={{ color: textColor, fontSize: '1.4rem' }}>
              <FontAwesomeIcon icon={faChartLine} className="me-2" style={{ color: '#3b82f6' }} />
              Multi-Currency Dashboard
            </h4>
          </div>
          <p className="mb-0 ms-1" style={{ color: mutedColor, fontSize: '0.85rem' }}>
            <FontAwesomeIcon icon={faInfoCircle} className="me-1" style={{ color: '#3b82f6', opacity: 0.7, fontSize: '0.75rem' }} />
            Monitor exchange rates, currency exposure, foreign transactions, realized/unrealized gains, and treasury performance across all companies and branches.
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2 mt-2 mt-lg-0">
          <select className="form-select form-select-sm" style={{
            width: 'auto', borderRadius: '10px', border: `1px solid ${borderColor}`,
            background: inputBg, color: textColor, fontSize: '0.8rem',
            outline: 'none', boxShadow: 'none',
          }}
            value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="this_quarter">This Quarter</option>
            <option value="this_year">This Year</option>
          </select>
          <select className="form-select form-select-sm" style={{
            width: 'auto', borderRadius: '10px', border: `1px solid ${borderColor}`,
            background: inputBg, color: textColor, fontSize: '0.8rem',
            outline: 'none', boxShadow: 'none',
          }}
            value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
            <option value="all">All Companies</option>
            <option value="company_a">Company A</option>
            <option value="company_b">Company B</option>
          </select>
          <select className="form-select form-select-sm" style={{
            width: 'auto', borderRadius: '10px', border: `1px solid ${borderColor}`,
            background: inputBg, color: textColor, fontSize: '0.8rem',
            outline: 'none', boxShadow: 'none',
          }}
            value={selectedBranch} onChange={(e) => setSelectedBranch(e.target.value)}>
            <option value="all">All Branches</option>
            <option value="head_office">Head Office</option>
            <option value="branch_01">Branch 01</option>
          </select>
          <button className="btn btn-sm text-white border-0 premium-btn" style={{
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            borderRadius: '10px', boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
            transition: 'all 0.3s', fontSize: '0.8rem',
          }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(59,130,246,0.45)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(59,130,246,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            onClick={handleRefresh}>
            <FontAwesomeIcon icon={faSync} className={`me-1 ${refreshing ? 'fa-spin' : ''}`} /> Refresh
          </button>
          <FxImportDropdown
            title="FX Dashboard Data"
            isDark={isDark}
            addNotification={addNotification}
            onImport={handleImport}
            buttonStyle={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '0.8rem',
              padding: '6px 14px',
              boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
              cursor: 'pointer',
            }}
          />
          <FxExportDropdown
            data={recentTransactions}
            title="FX Dashboard Overview Report"
            filenamePrefix="fx-dashboard"
            isDark={isDark}
            addNotification={addNotification}
            buttonStyle={{
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              borderRadius: '10px',
              color: '#fff',
              fontSize: '0.8rem',
              padding: '6px 14px',
              boxShadow: '0 2px 8px rgba(6,182,212,0.3)',
              cursor: 'pointer',
            }}
          />
          <button className="btn btn-sm text-white border-0 premium-btn" style={{
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            borderRadius: '10px', boxShadow: '0 2px 8px rgba(139,92,246,0.3)',
            transition: 'all 0.3s', fontSize: '0.8rem',
          }}
            onClick={() => { setActiveModule('fx'); setActiveTab('fx_transactions'); }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(139,92,246,0.45)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(139,92,246,0.3)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <FontAwesomeIcon icon={faPlus} className="me-1" /> New FX Transaction
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="col-xl-3 col-lg-4 col-md-6 enter-anim">
            <div className="premium-card glass-card" style={{ borderRadius: '16px', padding: '1.25rem' }}>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="kpi-icon" style={{
                  width: 44, height: 44, borderRadius: '14px',
                  background: `linear-gradient(135deg, ${kpi.color}20, ${kpi.color}08)`,
                  boxShadow: `0 4px 12px ${kpi.color}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <FontAwesomeIcon icon={kpi.icon} style={{ color: kpi.color, fontSize: '1.1rem' }} />
                </div>
                <span className="premium-badge" style={{
                  background: kpi.trend === 'up' ? (isDark ? '#064e3b' : '#dcfce7') : kpi.trend === 'down' ? (isDark ? '#7f1d1d' : '#fce7e7') : (isDark ? '#334155' : '#f1f5f9'),
                  color: kpi.trend === 'up' ? (isDark ? '#4ade80' : '#16a34a') : kpi.trend === 'down' ? (isDark ? '#f87171' : '#dc2626') : (isDark ? '#94a3b8' : '#64748b'),
                }}>
                  <span className="badge-dot" style={{
                    background: kpi.trend === 'up' ? (isDark ? '#4ade80' : '#16a34a') : kpi.trend === 'down' ? (isDark ? '#f87171' : '#dc2626') : (isDark ? '#94a3b8' : '#64748b'),
                  }} />
                  <FontAwesomeIcon icon={kpi.trend === 'up' ? faArrowUp : kpi.trend === 'down' ? faArrowDown : faMinus} className="me-1" />
                  {kpi.monthly}
                </span>
              </div>
              <div className="fw-bold mb-0" style={{ color: textColor, fontSize: '1.5rem' }}><AnimatedCounter value={kpi.value} /></div>
              <div style={{ color: mutedColor, fontSize: '0.8rem' }}>{kpi.label}</div>
              <div className="d-flex justify-content-between align-items-center mt-1">
                <small style={{ color: mutedColor, fontSize: '0.7rem' }}>{kpi.daily}</small>
                <MiniSparkline data={kpi.sparkline} color={kpi.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="row g-3 mb-4">
        {/* Currency Distribution (Doughnut) */}
        <div className="col-xl-4 col-lg-6">
          <div className="fx-chart-card glass-card" style={{ borderRadius: '16px', padding: '1.25rem', height: '100%' }}>
            <div className="section-header">
              <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #3b82f6, #8b5cf6)' }} />
              <h6 style={{ color: textColor }}>
                <FontAwesomeIcon icon={faChartPie} className="me-2" style={{ color: '#3b82f6' }} />
                Currencies by Transaction Volume
              </h6>
            </div>
            <div className="d-flex align-items-center justify-content-center flex-wrap gap-3">
              <DoughnutChart data={currencyDistribution} />
              <div style={{ minWidth: '140px', flex: '1 1 auto' }}>
                {currencyDistribution.slice(0, 6).map((c, i) => (
                  <div key={i} className="d-flex align-items-center mb-1" style={{ fontSize: '0.75rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, display: 'inline-block', marginRight: 6 }} />
                    <span style={{ color: mutedColor }}>{c.currency}</span>
                    <span className="ms-auto fw-medium" style={{ color: textColor }}>{c.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Exchange Rate Trend */}
        <div className="col-xl-8 col-lg-6">
          <div className="fx-chart-card glass-card" style={{ borderRadius: '16px', padding: '1.25rem', height: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="section-header" style={{ marginBottom: 0 }}>
                <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #3b82f6, #8b5cf6)' }} />
                <h6 style={{ color: textColor }}>
                  <FontAwesomeIcon icon={faChartLine} className="me-2" style={{ color: '#3b82f6' }} />
                  Historical Exchange Rate (USD/PKR)
                </h6>
              </div>
              <div className="d-flex gap-2">
                {['1D', '1W', '1M', '3M', '1Y'].map((p) => (
                  <button key={p} className="btn btn-sm border-0" style={{
                    borderRadius: '8px', fontSize: '0.7rem', padding: '2px 8px',
                    background: p === '1M' ? '#3b82f6' : 'transparent',
                    color: p === '1M' ? '#fff' : mutedColor,
                    transition: 'all 0.2s',
                  }}>{p}</button>
                ))}
              </div>
            </div>
            <LineChart data={exchangeRateData} />
            <div className="d-flex justify-content-center gap-4 mt-2" style={{ fontSize: '0.7rem', color: mutedColor }}>
              <span><span style={{ color: '#3b82f6', fontWeight: 600 }}>●</span> Closing Rate</span>
              <span><span style={{ color: borderColor, fontWeight: 600 }}>- - -</span> Moving Average</span>
            </div>
          </div>
        </div>
      </div>

      {/* FX Exposure Analytics */}
      <div className="row g-3 mb-4">
        <div className="col-12">
          <div className="fx-chart-card glass-card" style={{ borderRadius: '16px', padding: '1.25rem' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="section-header" style={{ marginBottom: 0 }}>
                <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #3b82f6, #8b5cf6)' }} />
                <h6 style={{ color: textColor }}>
                  <FontAwesomeIcon icon={faChartBar} className="me-2" style={{ color: '#3b82f6' }} />
                  FX Exposure Analytics
                </h6>
              </div>
              <div className="d-flex gap-2">
                {['Company Wise', 'Branch Wise', 'Currency Wise'].map((l) => (
                  <button key={l} className="btn btn-sm border-0" style={{
                    borderRadius: '8px', fontSize: '0.7rem', padding: '2px 10px',
                    background: l === 'Company Wise' ? '#3b82f6' : 'transparent',
                    color: l === 'Company Wise' ? '#fff' : mutedColor,
                    transition: 'all 0.2s',
                  }}>{l}</button>
                ))}
              </div>
            </div>
            <BarChart />
          </div>
        </div>
      </div>

      {/* Treasury Summary & Recent FX Transactions */}
      <div className="row g-3 mb-4">
        <div className="col-xl-4">
          <div className="fx-chart-card glass-card" style={{ borderRadius: '16px', padding: '1.25rem', height: '100%' }}>
            <div className="section-header">
              <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #8b5cf6, #ec4899)' }} />
              <h6 style={{ color: textColor }}>
                <FontAwesomeIcon icon={faWallet} className="me-2" style={{ color: '#8b5cf6' }} />
                Treasury Summary
              </h6>
            </div>
            {treasurySummary.map((item, i) => (
              <div key={i} className="d-flex align-items-center justify-content-between py-2" style={{
                borderBottom: i < treasurySummary.length - 1 ? `1px solid ${borderColor}` : 'none',
                transition: 'all 0.25s', borderRadius: '8px', padding: '0.5rem 0.25rem',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = `${item.color}08`; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                <div className="d-flex align-items-center gap-2">
                  <span style={{
                    width: 36, height: 36, borderRadius: '12px',
                    background: `linear-gradient(135deg, ${item.color}20, ${item.color}08)`,
                    boxShadow: `0 2px 8px ${item.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s',
                  }}>
                    <FontAwesomeIcon icon={item.icon} style={{ color: item.color, fontSize: '0.85rem' }} />
                  </span>
                  <span style={{ color: mutedColor, fontSize: '0.8rem' }}>{item.label}</span>
                </div>
                <span className="fw-medium" style={{ color: textColor, fontSize: '0.85rem' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent FX Transactions */}
        <div className="col-xl-8">
          <div className="fx-chart-card glass-card" style={{ borderRadius: '16px', padding: '1.25rem' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="section-header" style={{ marginBottom: 0 }}>
                <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #f59e0b, #f97316)' }} />
                <h6 style={{ color: textColor }}>
                  <FontAwesomeIcon icon={faListAlt} className="me-2" style={{ color: '#f59e0b' }} />
                  Recent FX Transactions
                </h6>
              </div>
              <button className="btn btn-sm border-0 premium-btn" style={{
                borderRadius: '10px',
                background: isDark ? '#334155' : '#f1f5f9',
                color: textColor, fontSize: '0.75rem',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = isDark ? '#475569' : '#e2e8f0'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = isDark ? '#334155' : '#f1f5f9'; }}
                onClick={() => { setActiveModule('fx'); setActiveTab('fx_transactions'); }}>
                <FontAwesomeIcon icon={faEye} className="me-1" /> View All
              </button>
            </div>
            <div className="mc-table-wrapper">
              <div className="table-responsive" style={{ maxHeight: '400px' }}>
                <table className="table align-middle mb-0 mc-table" style={{ fontSize: '0.78rem' }}>
                  <thead>
                    <tr>
                      {['Transaction No', 'Date', 'Currency', 'Type', 'Rate', 'Amount', 'Converted', 'Status', ''].map((h, i) => (
                        <th key={i}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={9} style={{ padding: '2rem', textAlign: 'center', color: mutedColor, fontSize: '0.85rem' }}>
                          <FontAwesomeIcon icon={faListAlt} className="me-2" style={{ opacity: 0.5 }} />
                          No FX transactions yet. Create one to see it here.
                        </td>
                      </tr>
                    ) : recentTransactions.map((tx, i) => (
                      <tr key={i}>
                        <td className="fw-medium" style={{ color: textColor, whiteSpace: 'nowrap' }}>{tx.id}</td>
                        <td style={{ color: mutedColor, whiteSpace: 'nowrap' }}>{tx.date}</td>
                        <td style={{ color: textColor, whiteSpace: 'nowrap' }}>{tx.currency}</td>
                        <td style={{ color: mutedColor, whiteSpace: 'nowrap' }}>{tx.type}</td>
                        <td className="fw-medium" style={{ color: textColor, whiteSpace: 'nowrap' }}>{tx.rate}</td>
                        <td style={{ color: mutedColor, whiteSpace: 'nowrap' }}>{tx.amount}</td>
                        <td className="fw-medium" style={{ color: '#3b82f6', whiteSpace: 'nowrap' }}>{tx.converted}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <span className="premium-badge" style={{
                            background: tx.status === 'Completed' ? (isDark ? '#064e3b' : '#dcfce7') : tx.status === 'Pending' ? (isDark ? '#713f12' : '#fef9c3') : (isDark ? '#7f1d1d' : '#fee2e2'),
                            color: tx.status === 'Completed' ? (isDark ? '#4ade80' : '#16a34a') : tx.status === 'Pending' ? (isDark ? '#facc15' : '#ca8a04') : (isDark ? '#f87171' : '#dc2626'),
                          }}>
                            <span className="badge-dot" style={{
                              background: tx.status === 'Completed' ? (isDark ? '#4ade80' : '#16a34a') : tx.status === 'Pending' ? (isDark ? '#facc15' : '#ca8a04') : (isDark ? '#f87171' : '#dc2626'),
                            }} />
                            {tx.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm border-0" style={{
                            color: mutedColor, borderRadius: '8px',
                            transition: 'all 0.2s',
                          }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#3b82f610'; e.currentTarget.style.color = '#3b82f6'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = mutedColor; }}>
                            <FontAwesomeIcon icon={faSearch} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gain/Loss Summary & Quick Actions */}
      <div className="row g-3 mb-4">
        <div className="col-xl-6">
          <div className="fx-chart-card glass-card" style={{ borderRadius: '16px', padding: '1.25rem', height: '100%' }}>
            <div className="section-header">
              <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #10b981, #06b6d4)' }} />
              <h6 style={{ color: textColor }}>
                <FontAwesomeIcon icon={faBalanceScale} className="me-2" style={{ color: '#10b981' }} />
                Exchange Gain / Loss Summary
              </h6>
            </div>
            <div className="row g-2">
              {gainLossSummary.map((item, i) => (
                <div key={i} className="col-6">
                  <div style={{
                    padding: '0.85rem', borderRadius: '14px',
                    background: `linear-gradient(135deg, ${item.color}08, ${item.color}03)`,
                    border: `1px solid ${item.color}30`,
                    borderLeft: `3px solid ${item.color}`,
                    transition: 'all 0.3s',
                    height: '100%',
                  }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <span style={{ color: mutedColor, fontSize: '0.75rem' }}>{item.label}</span>
                      <span className="premium-badge" style={{
                        background: item.trend === 'up' ? (isDark ? '#064e3b' : '#dcfce7') : (isDark ? '#7f1d1d' : '#fce7e7'),
                        color: item.trend === 'up' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#f87171' : '#dc2626'),
                      }}>
                        <span className="badge-dot" style={{
                          background: item.trend === 'up' ? (isDark ? '#4ade80' : '#16a34a') : (isDark ? '#f87171' : '#dc2626'),
                        }} />
                        <FontAwesomeIcon icon={item.trend === 'up' ? faArrowUp : faArrowDown} className="me-1" />
                        {item.change}
                      </span>
                    </div>
                    <div className="fw-bold mt-1" style={{ color: textColor, fontSize: '1.1rem' }}>{item.value}</div>
                    <MiniSparkline data={item.sparkline} color={item.color} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-xl-6">
          <div className="fx-chart-card glass-card" style={{ borderRadius: '16px', padding: '1.25rem', height: '100%' }}>
            <div className="section-header">
              <div className="accent-bar" style={{ background: 'linear-gradient(to bottom, #8b5cf6, #ec4899)' }} />
              <h6 style={{ color: textColor }}>
                <FontAwesomeIcon icon={faCog} className="me-2" style={{ color: '#8b5cf6' }} />
                Quick Actions
              </h6>
            </div>
            <div className="row g-2">
              {[
                { icon: faGlobe, label: 'Create Currency', color: '#3b82f6' },
                { icon: faFileImport, label: 'Import Exchange Rates', color: '#10b981' },
                { icon: faExchangeAlt, label: 'Manual Exchange Rate', color: '#f59e0b' },
                { icon: faMoneyBillWave, label: 'New FX Transaction', color: '#8b5cf6' },
                { icon: faCalculator, label: 'Run Revaluation', color: '#f97316' },
                { icon: faFileExport, label: 'Export Report', color: '#06b6d4' },
              ].map((action, i) => (
                <div key={i} className="col-4 col-md-4 premium-quick-item">
                  <div className="text-center p-3" style={{
                    borderRadius: '14px', border: `1px solid ${borderColor}`,
                    transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                    background: 'transparent',
                    cursor: 'pointer',
                  }}
                    onClick={() => handleQuickAction(action.label)}
                    onMouseEnter={(e) => { e.currentTarget.style.background = `${action.color}10`; e.currentTarget.style.borderColor = `${action.color}40`; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = borderColor; }}
                  >
                    <div className="quick-icon" style={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: `linear-gradient(135deg, ${action.color}20, ${action.color}08)`,
                      boxShadow: `0 4px 12px ${action.color}15`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto 8px', transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
                    }}>
                      <FontAwesomeIcon icon={action.icon} style={{ color: action.color, fontSize: '1.1rem' }} />
                    </div>
                    <div style={{ color: mutedColor, fontSize: '0.72rem', fontWeight: 500, lineHeight: 1.3 }}>{action.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FxDashboard;
