import React, { useEffect, useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlask, faSearch, faTrash, faClock, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useApp } from "../../hooks/useApp";
import {
  listDemoRequests,
  updateDemoRequest,
  deleteDemoRequest,
} from "../../api/websiteLeads";

const statusStyles = {
  new: { bg: "#dbeafe", color: "#1e40af", label: "New" },
  in_progress: { bg: "#fef3c7", color: "#92400e", label: "In Progress" },
  handled: { bg: "#d1fae5", color: "#065f46", label: "Handled" },
  archived: { bg: "#e5e7eb", color: "#374151", label: "Archived" },
};

export default function DemoRequests() {
  const { isDark } = useApp();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, new_count: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== "all") params.status = statusFilter;
      const res = await listDemoRequests(params);
      setItems(res.data.data || []);
      setMeta(res.data.meta || { total: 0, new_count: 0 });
    } catch (err) {
      console.error("Failed to load demo requests:", err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
  };

  const handleStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateDemoRequest(id, { status });
      await load();
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this demo request?")) return;
    try {
      await deleteDemoRequest(id);
      await load();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const activeFilters = statusFilter !== "all";

  return (
    <div>
      {/* Stats Row */}
      <div className="row g-3 mb-4">
        {[
          { label: "Total Requests", value: meta.total, icon: faFlask, color: "#6366f1" },
          { label: "New (Unread)", value: meta.new_count, icon: faClock, color: "#f59e0b" },
        ].map((s) => (
          <div key={s.label} className="col-6 col-md-3">
            <div
              className={`card border-0 shadow-sm rounded-4 p-3 d-flex align-items-center gap-3 ${isDark ? "bg-dark-card" : "bg-white"}`}
            >
              <div
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                style={{ width: 42, height: 42, background: `${s.color}20` }}
              >
                <FontAwesomeIcon icon={s.icon} style={{ color: s.color }} />
              </div>
              <div className="min-w-0">
                <div className="fw-bold fs-5 lh-1" style={{ color: isDark ? "#f1f5f9" : "#1e293b" }}>
                  {s.value}
                </div>
                <div className="small text-truncate" style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
                  {s.label}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? "bg-dark-card" : "bg-white"}`}>
        <div className="p-3 p-md-4">
          {/* Search Row */}
          <form onSubmit={handleSearch} className="mb-3">
            <div className="input-group">
              <span className={`input-group-text ${isDark ? "bg-dark-input border-dark-input text-light" : "bg-light border-light"}`}>
                <FontAwesomeIcon icon={faSearch} className="opacity-50" />
              </span>
              <input
                type="text"
                className={`form-control ${isDark ? "bg-dark-input border-dark-input text-light" : "border-light"}`}
                placeholder="Search by name, email, company..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button
                  type="button"
                  className={`btn ${isDark ? "btn-outline-light" : "btn-outline-secondary"}`}
                  onClick={clearSearch}
                  title="Clear search"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              )}
              <button type="submit" className="btn btn-primary px-3 px-md-4">
                <FontAwesomeIcon icon={faSearch} className="d-md-none" />
                <span className="d-none d-md-inline">Search</span>
              </button>
            </div>
          </form>

          {/* Filter Pills Row */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="small fw-semibold me-1" style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
              Status:
            </span>
            {["all", "new", "in_progress", "handled", "archived"].map((s) => (
              <button
                key={s}
                className={`btn btn-sm rounded-pill fw-semibold ${
                  statusFilter === s
                    ? "btn-primary"
                    : isDark
                    ? "btn-outline-light"
                    : "btn-outline-secondary"
                }`}
                style={{ fontSize: 12, padding: "4px 12px" }}
                onClick={() => setStatusFilter(s)}
              >
                {s === "all" ? "All" : statusStyles[s]?.label || s}
                {s === "new" && meta.new_count > 0 && (
                  <span className="badge bg-white text-primary ms-1" style={{ fontSize: 10 }}>
                    {meta.new_count}
                  </span>
                )}
              </button>
            ))}
            {activeFilters && (
              <button
                className="btn btn-sm btn-link text-decoration-none p-0 ms-1"
                style={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}
                onClick={() => setStatusFilter("all")}
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={`card border-0 shadow-sm rounded-4 overflow-hidden mt-3 ${isDark ? "bg-dark-card" : "bg-white"}`}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className={isDark ? "bg-dark-header" : "bg-light"}>
              <tr>
                <th className="px-3 py-3 small fw-semibold">Name</th>
                <th className="px-3 py-3 small fw-semibold d-none d-sm-table-cell">Email</th>
                <th className="px-3 py-3 small fw-semibold d-none d-lg-table-cell">Company</th>
                <th className="px-3 py-3 small fw-semibold d-none d-md-table-cell">Product</th>
                <th className="px-3 py-3 small fw-semibold">Status</th>
                <th className="px-3 py-3 small fw-semibold d-none d-md-table-cell">Date</th>
                <th className="px-3 py-3 small fw-semibold text-center" style={{ width: 50 }}></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" />
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={7} className={`text-center py-5 ${isDark ? "text-light" : "text-muted"}`}>
                    <FontAwesomeIcon icon={faFlask} size="2x" className="mb-3 opacity-25 d-block mx-auto" />
                    No demo requests found.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className={isDark ? "border-dark-border" : ""}>
                    <td className="px-3 py-3">
                      <div className="fw-medium" style={{ color: isDark ? "#f1f5f9" : "#1e293b" }}>
                        {item.name}
                        {item.status === "new" && (
                          <span className="badge bg-primary ms-2" style={{ fontSize: 9 }}>NEW</span>
                        )}
                      </div>
                      <div className="d-sm-none x-small mt-1" style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
                        {item.email}
                      </div>
                    </td>
                    <td className="px-3 py-3 d-none d-sm-table-cell" style={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 13 }}>
                      {item.email}
                    </td>
                    <td className="px-3 py-3 d-none d-lg-table-cell" style={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 13 }}>
                      {item.company || "—"}
                    </td>
                    <td className="px-3 py-3 d-none d-md-table-cell" style={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: 13 }}>
                      {item.product || "—"}
                    </td>
                    <td className="px-3 py-3">
                      <select
                        className={`form-select form-select-sm rounded-pill ${isDark ? "bg-dark-input border-dark-input text-light" : ""}`}
                        value={item.status}
                        onChange={(e) => handleStatus(item.id, e.target.value)}
                        disabled={updatingId === item.id}
                        style={{ fontSize: 11, minWidth: 110, padding: "3px 8px" }}
                      >
                        {Object.entries(statusStyles).map(([k, v]) => (
                          <option key={k} value={k}>{v.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-3 d-none d-md-table-cell" style={{ fontSize: 12, color: isDark ? "#94a3b8" : "#64748b" }}>
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button
                        className="btn btn-sm btn-outline-danger rounded-circle"
                        style={{ width: 30, height: 30 }}
                        onClick={() => handleDelete(item.id)}
                        title="Delete"
                      >
                        <FontAwesomeIcon icon={faTrash} fontSize={11} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
