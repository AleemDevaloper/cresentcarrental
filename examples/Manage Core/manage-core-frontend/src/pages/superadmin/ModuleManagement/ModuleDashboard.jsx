import React, { useState, useEffect } from 'react';
import { 
  FiBox, FiActivity, FiCheckCircle, FiXCircle, 
  FiAlertCircle, FiTrendingUp, FiUsers, FiDollarSign 
} from 'react-icons/fi';
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, ArcElement, Tooltip, Legend, Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  ArcElement, Tooltip, Legend, Filler
);

const ModuleDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking the fetch
    setTimeout(() => {
      setStats({
        kpis: {
          total_modules: 12,
          active_modules: 9,
          disabled_modules: 1,
          licensed_modules: 45,
          beta_modules: 2,
          usage_percent: 75,
          most_used: 'HRMS',
          least_used: 'BI Analytics',
          revenue: 125400,
        },
        trends: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Module Usage',
            data: [4000, 3000, 2000, 2780, 1890, 2390],
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        distribution: {
          labels: ['HRMS', 'PMS', 'FMS', 'CRM'],
          datasets: [{
            data: [400, 300, 300, 200],
            backgroundColor: ['#4f46e5', '#10b981', '#f59e0b', '#ef4444'],
          }]
        }
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500 font-medium">Loading Intelligence Dashboard...</div>;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Modules', value: stats.kpis.total_modules, icon: <FiBox />, color: 'blue' },
          { label: 'Active Modules', value: stats.kpis.active_modules, icon: <FiCheckCircle />, color: 'green' },
          { label: 'Licensed Tenants', value: stats.kpis.licensed_modules, icon: <FiUsers />, color: 'purple' },
          { label: 'Total Revenue', value: `$${stats.kpis.revenue.toLocaleString()}`, icon: <FiDollarSign />, color: 'amber' },
          { label: 'Module Usage %', value: `${stats.kpis.usage_percent}%`, icon: <FiActivity />, color: 'indigo' },
          { label: 'Beta Modules', value: stats.kpis.beta_modules, icon: <FiAlertCircle />, color: 'orange' },
          { label: 'Most Used', value: stats.kpis.most_used, icon: <FiTrendingUp />, color: 'emerald' },
          { label: 'Disabled', value: stats.kpis.disabled_modules, icon: <FiXCircle />, color: 'rose' },
        ].map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
            <div className={`p-3 rounded-xl bg-${card.color}-50 text-${card.color}-600 text-2xl`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{card.label}</p>
              <h3 className="text-2xl font-bold text-gray-800">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Module Usage Trends</h3>
          <div className="h-80 relative">
            <Line 
              data={stats.trends} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { 
                  y: { grid: { display: false } },
                  x: { grid: { display: false } }
                }
              }} 
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Tenant Module Distribution</h3>
          <div className="h-80 relative">
            <Doughnut 
              data={stats.distribution} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
                cutout: '70%'
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDashboard;
