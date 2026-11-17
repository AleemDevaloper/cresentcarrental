import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiFilter, FiDownload, FiRefreshCw } from 'react-icons/fi';

const ModuleRegistry = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking fetch
    setTimeout(() => {
      setModules([
        { id: 1, name: 'Human Resource Management', code: 'HRMS', version: '2.4.1', status: 'active', tenants: 12, revenue: 45000, updated: '2026-05-12' },
        { id: 2, name: 'Project Management', code: 'PMS', version: '1.8.0', status: 'active', tenants: 8, revenue: 32000, updated: '2026-06-01' },
        { id: 3, name: 'Financial Management', code: 'FMS', version: '3.0.2', status: 'beta', tenants: 3, revenue: 15000, updated: '2026-06-10' },
        { id: 4, name: 'Customer Relationship', code: 'CRM', version: '1.2.5', status: 'active', tenants: 15, revenue: 28000, updated: '2026-04-20' },
        { id: 5, name: 'Asset Management', code: 'ASSET', version: '2.1.0', status: 'disabled', tenants: 0, revenue: 0, updated: '2026-01-15' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-xl font-bold text-gray-800">Module Registry</h3>
        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search modules..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>
          <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50"><FiFilter /></button>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors">
            <FiPlus /> Install Module
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-sm font-medium">
            <tr>
              <th className="px-6 py-4">Module Name</th>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Version</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Tenants</th>
              <th className="px-6 py-4">Revenue</th>
              <th className="px-6 py-4">Last Updated</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {modules.map((module) => (
              <tr key={module.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{module.name}</td>
                <td className="px-6 py-4"><span className="px-2 py-1 bg-gray-100 rounded-lg text-xs font-bold">{module.code}</span></td>
                <td className="px-6 py-4">{module.version}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    module.status === 'active' ? 'bg-green-100 text-green-700' : 
                    module.status === 'beta' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {module.status.charAt(0).toUpperCase() + module.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">{module.tenants}</td>
                <td className="px-6 py-4">${module.revenue.toLocaleString()}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{module.updated}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg" title="Edit"><FiEdit2 /></button>
                    <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg" title="Upgrade"><FiRefreshCw /></button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete"><FiTrash2 /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-6 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
        <p>Showing 5 of 12 modules</p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
          <button className="px-3 py-1 border border-gray-200 rounded-lg bg-blue-50 text-blue-600 font-medium">1</button>
          <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">2</button>
          <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">Next</button>
        </div>
      </div>
    </div>
  );
};

export default ModuleRegistry;
