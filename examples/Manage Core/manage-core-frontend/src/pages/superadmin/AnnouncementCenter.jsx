import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBullhorn,
  faCalendarCheck,
  faChartPie,
  faCircleCheck,
  faClock,
  faExclamationTriangle,
  faEye,
  faFileCirclePlus,
  faPaperPlane,
  faPenToSquare,
  faShieldHalved,
  faTrash,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Doughnut } from "react-chartjs-2";
import { useApp } from "../../hooks/useApp";
import { useAuth } from "../../context/AuthContext";
import {
  createAnnouncement,
  deleteAnnouncement,
  getAnnouncementStats,
  listAnnouncementTenants,
  listManageableAnnouncements,
  updateAnnouncement,
} from "../../api/announcements";

const typeOptions = [
  "information",
  "alert",
  "warning",
  "danger",
  "emergency",
  "critical",
  "maintenance",
  "policy",
  "hr_notice",
  "finance_notice",
  "security_notice",
  "feature_release",
  "planned_maintenance",
  "holiday_notice",
  "payroll_notice",
];

const moduleOptions = ["Dashboard", "HRMS", "PMS", "TMS", "FMS", "CRM", "DMS", "Payroll", "Attendance", "Employee Portal", "Manager Portal", "Everywhere"];
const placementOptions = ["Top Banner", "Popup Modal", "Toast Notification", "Dashboard Card", "Sidebar Widget", "Notification Center"];
const deliveryOptions = ["In-App Notification", "Dashboard Banner", "Popup", "Email", "Push Notification", "Webhook"];
const roleOptions = ["Admin", "HR", "Manager", "Employee", "Finance Manager", "Department Head"];

const defaultForm = {
  title: "",
  summary: "",
  description: "",
  type: "information",
  priority: "normal",
  severity_color: "#2563eb",
  status: "draft",
  is_platform_wide: false,
  target_tenant_ids: [],
  target_roles: [],
  module_visibility: ["Dashboard", "Notification Center"],
  placements: ["Top Banner", "Notification Center"],
  delivery_channels: ["In-App Notification"],
  tags: [],
  requires_acknowledgement: false,
  requires_read_confirmation: true,
  dismissible: true,
  scheduled_at: "",
  starts_at: "",
  expires_at: "",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
};

const statCards = [
  ["total", "Total Announcements", faBullhorn, "primary"],
  ["active", "Active Announcements", faCircleCheck, "success"],
  ["scheduled", "Scheduled", faCalendarCheck, "info"],
  ["expired", "Expired", faClock, "secondary"],
  ["emergency", "Emergency Alerts", faExclamationTriangle, "danger"],
  ["maintenance", "Maintenance Notices", faShieldHalved, "warning"],
  ["companies_covered", "Companies Covered", faUsers, "primary"],
  ["read_percentage", "Read Percentage", faEye, "success"],
];

function toggleArrayValue(values, value) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function toDateTimeLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function hydrateForm(announcement) {
  return {
    ...defaultForm,
    ...announcement,
    target_tenant_ids: (announcement.target_tenant_ids || []).map(Number),
    target_roles: announcement.target_roles || [],
    module_visibility: announcement.module_visibility || [],
    placements: announcement.placements || [],
    delivery_channels: announcement.delivery_channels || [],
    tags: announcement.tags || [],
    scheduled_at: toDateTimeLocal(announcement.scheduled_at),
    starts_at: toDateTimeLocal(announcement.starts_at),
    expires_at: toDateTimeLocal(announcement.expires_at),
  };
}

export default function AnnouncementCenter() {
  const { addNotification, theme } = useApp();
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({});
  const [tenants, setTenants] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const isDark = theme === "dark";
  const isSuperAdmin = String(currentUser?.role || "").toLowerCase() === "superadmin";

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, tenantsData, listData] = await Promise.all([
        getAnnouncementStats(),
        listAnnouncementTenants(),
        listManageableAnnouncements({ per_page: 50 }),
      ]);
      setStats(statsData || {});
      setTenants(Array.isArray(tenantsData) ? tenantsData : []);
      setAnnouncements(Array.isArray(listData?.data) ? listData.data : Array.isArray(listData) ? listData : []);
    } catch (err) {
      addNotification?.(err.message || "Failed to load announcements", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const typeDistribution = useMemo(() => {
    const distribution = stats.type_distribution || {};
    const labels = Object.keys(distribution);
    return {
      labels: labels.length ? labels : ["No data"],
      datasets: [{
        data: labels.length ? labels.map((key) => distribution[key]) : [1],
        backgroundColor: ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#7c3aed", "#64748b"],
        borderWidth: 0,
      }],
    };
  }, [stats]);

  const tenantNameMap = useMemo(() => {
    return tenants.reduce((map, tenant) => {
      map[Number(tenant.id)] = tenant.name;
      return map;
    }, {});
  }, [tenants]);

  const getTargetLabel = (announcement) => {
    if (announcement.is_platform_wide) return "Entire Platform";
    const ids = announcement.target_tenant_ids || [];
    if (ids.length === 0) return "No company selected";
    const names = ids.map((id) => tenantNameMap[Number(id)] || `Company #${id}`);
    return names.length > 2 ? `${names.slice(0, 2).join(", ")} +${names.length - 2}` : names.join(", ");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        target_tenant_ids: form.is_platform_wide ? [] : form.target_tenant_ids.map(Number),
        scheduled_at: form.scheduled_at || null,
        starts_at: form.starts_at || null,
        expires_at: form.expires_at || null,
      };

      if (editingId) {
        await updateAnnouncement(editingId, payload);
      } else {
        await createAnnouncement(payload);
      }

      addNotification?.(editingId ? "Announcement updated successfully" : "Announcement saved successfully", "success");
      setForm(defaultForm);
      setEditingId(null);
      await loadData();
    } catch (err) {
      addNotification?.(err.message || "Failed to save announcement", "danger");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (announcement) => {
    setEditingId(announcement.id);
    setForm(hydrateForm(announcement));
    requestAnimationFrame(() => {
      document.getElementById("announcement-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleReset = () => {
    setEditingId(null);
    setForm(defaultForm);
  };

  const handleDelete = async (announcement) => {
    const confirmed = window.confirm(`Delete announcement "${announcement.title}"?`);
    if (!confirmed) return;

    setDeletingId(announcement.id);
    try {
      await deleteAnnouncement(announcement.id);
      addNotification?.("Announcement deleted", "success");
      if (editingId === announcement.id) handleReset();
      await loadData();
    } catch (err) {
      addNotification?.(err.message || "Failed to delete announcement", "danger");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="announcement-center">
      <div className="d-flex flex-wrap justify-content-between gap-3 align-items-center mb-4">
        <div>
          <p className="text-uppercase fw-bold text-primary mb-1" style={{ fontSize: 12, letterSpacing: 0.6 }}>Enterprise Communication Center</p>
          <h2 className="fw-black mb-1">Announcement Management</h2>
          <p className="text-muted mb-0">Broadcast platform notices, emergency alerts, policy updates, and targeted company communications.</p>
        </div>
        <button className="btn btn-primary rounded-3 px-4 fw-bold" onClick={() => { setEditingId(null); setForm({ ...defaultForm, status: "published" }); }}>
          <FontAwesomeIcon icon={faFileCirclePlus} className="me-2" />
          New Published Alert
        </button>
      </div>

      <div className="row g-3 mb-4">
        {statCards.map(([key, label, icon, color]) => (
          <div className="col-xxl-3 col-lg-4 col-sm-6" key={key}>
            <div className={`card border-0 shadow-sm rounded-3 h-100 ${isDark ? "bg-dark-card text-white" : "bg-white"}`}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small fw-bold">{label}</div>
                  <div className={`fs-3 fw-black text-${color}`}>{loading ? "-" : `${stats[key] ?? 0}${key === "read_percentage" ? "%" : ""}`}</div>
                </div>
                <div className={`rounded-3 bg-${color} bg-opacity-10 text-${color} d-flex align-items-center justify-content-center`} style={{ width: 44, height: 44 }}>
                  <FontAwesomeIcon icon={icon} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-xl-8">
          <form id="announcement-form" onSubmit={handleSubmit} className={`card border-0 shadow-sm rounded-3 ${isDark ? "bg-dark-card text-white" : "bg-white"}`}>
            <div className="card-header bg-transparent border-0 p-4 pb-0">
              <h5 className="fw-black mb-1">
                <FontAwesomeIcon icon={editingId ? faPenToSquare : faBullhorn} className="me-2 text-primary" />
                {editingId ? "Edit Announcement" : "Create Announcement"}
              </h5>
              <p className="text-muted small mb-0">
                {editingId ? "Update announcement content, targeting, scheduling, and delivery behavior." : "Use draft for review, scheduled for future delivery, or published for immediate visibility."}
              </p>
            </div>
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-lg-8">
                  <label className="form-label fw-bold small">Announcement Title</label>
                  <input className="form-control" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div className="col-lg-4">
                  <label className="form-label fw-bold small">Status</label>
                  <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="published">Published</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold small">Short Summary</label>
                  <input className="form-control" value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })} />
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold small">Full Description</label>
                  <textarea className="form-control" rows={6} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Write details, markdown, links, or policy instructions here." />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold small">Type</label>
                  <select className="form-select" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    {typeOptions.map((type) => <option key={type} value={type}>{type.replaceAll("_", " ")}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold small">Priority</label>
                  <select className="form-select" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                    {["low", "normal", "high", "urgent", "critical"].map((priority) => <option key={priority} value={priority}>{priority}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold small">Severity Color</label>
                  <input type="color" className="form-control form-control-color w-100" value={form.severity_color} onChange={(e) => setForm({ ...form, severity_color: e.target.value })} />
                </div>
              </div>

              <hr className="my-4" />

              <div className="row g-4">
                <div className="col-lg-6">
                  <div className="form-check form-switch mb-3">
                    <input className="form-check-input" type="checkbox" checked={form.is_platform_wide} disabled={!isSuperAdmin} onChange={(e) => setForm({ ...form, is_platform_wide: e.target.checked, target_tenant_ids: [] })} />
                    <label className="form-check-label fw-bold">Entire Platform</label>
                    {!isSuperAdmin && <div className="form-text">Company admins can publish only to their current company.</div>}
                  </div>
                  <label className="form-label fw-bold small">Select Companies</label>
                  <div className="border rounded-3 p-2" style={{ maxHeight: 170, overflowY: "auto" }}>
                    {tenants.map((tenant) => (
                      <label className="d-flex align-items-center gap-2 py-2 px-2 rounded hover-row" key={tenant.id}>
                        <input type="checkbox" disabled={form.is_platform_wide} checked={form.target_tenant_ids.includes(tenant.id)} onChange={() => setForm({ ...form, target_tenant_ids: toggleArrayValue(form.target_tenant_ids, tenant.id) })} />
                        <span className="fw-semibold">{tenant.name}</span>
                        <span className="text-muted small ms-auto">{tenant.domain}</span>
                      </label>
                    ))}
                    {tenants.length === 0 && <div className="text-muted small p-2">No companies found.</div>}
                  </div>
                </div>
                <div className="col-lg-6">
                  <label className="form-label fw-bold small">Target Roles</label>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {roleOptions.map((role) => (
                      <button type="button" className={`btn btn-sm rounded-pill ${form.target_roles.includes(role) ? "btn-primary" : "btn-outline-secondary"}`} key={role} onClick={() => setForm({ ...form, target_roles: toggleArrayValue(form.target_roles, role) })}>{role}</button>
                    ))}
                  </div>
                  <div className="row g-2">
                    {[
                      ["requires_acknowledgement", "Require acknowledgement"],
                      ["requires_read_confirmation", "Track read confirmation"],
                      ["dismissible", "Dismissible"],
                    ].map(([key, label]) => (
                      <div className="col-12" key={key}>
                        <label className="form-check">
                          <input className="form-check-input" type="checkbox" checked={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} />
                          <span className="form-check-label">{label}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <hr className="my-4" />

              <div className="row g-4">
                <CheckboxGroup title="Module Visibility" options={moduleOptions} value={form.module_visibility} onChange={(next) => setForm({ ...form, module_visibility: next })} />
                <CheckboxGroup title="Placement" options={placementOptions} value={form.placements} onChange={(next) => setForm({ ...form, placements: next })} />
                <CheckboxGroup title="Delivery Channels" options={deliveryOptions} value={form.delivery_channels} onChange={(next) => setForm({ ...form, delivery_channels: next })} />
              </div>

              <div className="row g-3 mt-1">
                <div className="col-md-4">
                  <label className="form-label fw-bold small">Schedule At</label>
                  <input type="datetime-local" className="form-control" value={form.scheduled_at} onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })} />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold small">Start Date</label>
                  <input type="datetime-local" className="form-control" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} />
                </div>
                <div className="col-md-4">
                  <label className="form-label fw-bold small">Expiry Date</label>
                  <input type="datetime-local" className="form-control" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-outline-secondary rounded-3 px-4" onClick={handleReset}>{editingId ? "Cancel Edit" : "Reset"}</button>
                <button className="btn btn-primary rounded-3 px-4 fw-bold" disabled={saving}>
                  <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                  {saving ? "Saving..." : editingId ? "Update Announcement" : "Save Announcement"}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="col-xl-4">
          <div className={`card border-0 shadow-sm rounded-3 mb-4 ${isDark ? "bg-dark-card text-white" : "bg-white"}`}>
            <div className="card-body">
              <h6 className="fw-black mb-3"><FontAwesomeIcon icon={faChartPie} className="me-2 text-primary" />Type Distribution</h6>
              <div style={{ height: 220 }}><Doughnut data={typeDistribution} options={{ maintainAspectRatio: false }} /></div>
            </div>
          </div>
          <div className={`card border-0 shadow-sm rounded-3 ${isDark ? "bg-dark-card text-white" : "bg-white"}`}>
            <div className="card-body">
              <h6 className="fw-black mb-3">Recent Announcements</h6>
              <div className="d-flex flex-column gap-3">
                {announcements.slice(0, 8).map((item) => (
                  <div className="border rounded-3 p-3" key={item.id}>
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span className="rounded-circle" style={{ width: 10, height: 10, background: item.severity_color || "#2563eb" }} />
                      <span className="fw-bold">{item.title}</span>
                      <span className="badge bg-light text-dark ms-auto">{item.status}</span>
                    </div>
                    <div className="text-muted small">{item.summary || item.type}</div>
                  </div>
                ))}
                {!loading && announcements.length === 0 && <div className="text-muted small">No announcements yet.</div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`card border-0 shadow-sm rounded-3 mt-4 ${isDark ? "bg-dark-card text-white" : "bg-white"}`}>
        <div className="card-header bg-transparent border-0 p-4 pb-0">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div>
              <h5 className="fw-black mb-1">Announcement Details</h5>
              <p className="text-muted small mb-0">Review all announcements, targeting, publishing state, read tracking, and management actions.</p>
            </div>
            <button className="btn btn-outline-primary btn-sm rounded-3" onClick={loadData} disabled={loading}>Refresh</button>
          </div>
        </div>
        <div className="card-body p-4">
          <div className="table-responsive">
            <table className="table align-middle announcement-table mb-0">
              <thead>
                <tr className="text-muted small text-uppercase">
                  <th>Announcement</th>
                  <th>Type</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Target</th>
                  <th>Schedule</th>
                  <th>Read</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {announcements.map((item) => (
                  <tr key={item.id}>
                    <td style={{ minWidth: 260 }}>
                      <div className="d-flex align-items-start gap-3">
                        <span className="rounded-circle mt-1 flex-shrink-0" style={{ width: 12, height: 12, background: item.severity_color || "#2563eb" }} />
                        <div>
                          <div className="fw-bold">{item.title}</div>
                          <div className="text-muted small text-truncate" style={{ maxWidth: 360 }}>{item.summary || item.description || "No summary provided"}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="badge bg-primary bg-opacity-10 text-primary">{item.type?.replaceAll("_", " ")}</span></td>
                    <td><span className={`badge ${item.priority === "critical" || item.priority === "urgent" ? "bg-danger" : item.priority === "high" ? "bg-warning text-dark" : "bg-secondary"}`}>{item.priority}</span></td>
                    <td><span className={`badge ${item.status === "published" ? "bg-success" : item.status === "scheduled" ? "bg-info" : "bg-light text-dark border"}`}>{item.status}</span></td>
                    <td style={{ minWidth: 180 }}>
                      <div className="fw-semibold small">{getTargetLabel(item)}</div>
                      <div className="text-muted small">{(item.target_roles || []).length ? item.target_roles.join(", ") : "All roles"}</div>
                    </td>
                    <td style={{ minWidth: 190 }}>
                      <div className="small">Start: {item.starts_at ? new Date(item.starts_at).toLocaleString() : "Immediate"}</div>
                      <div className="text-muted small">Expiry: {item.expires_at ? new Date(item.expires_at).toLocaleString() : "None"}</div>
                    </td>
                    <td>
                      <div className="fw-bold">{item.read_count ?? 0}</div>
                      <div className="text-muted small">reads</div>
                    </td>
                    <td className="text-end">
                      <div className="btn-group">
                        {(!item.is_platform_wide || isSuperAdmin) && (
                          <>
                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(item)} title="Edit announcement">
                              <FontAwesomeIcon icon={faPenToSquare} />
                            </button>
                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item)} disabled={deletingId === item.id} title="Delete announcement">
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && announcements.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center text-muted py-5">No announcements created yet.</td>
                  </tr>
                )}
                {loading && announcements.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center text-muted py-5">Loading announcements...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .announcement-center .fw-black { font-weight: 900; }
        .announcement-center .hover-row:hover { background: rgba(37, 99, 235, 0.06); }
        .announcement-center .announcement-table th { border-top: 0; white-space: nowrap; }
        .announcement-center .announcement-table td { vertical-align: middle; }
        .bg-dark-card { background-color: rgba(30, 41, 59, 0.85); }
      `}} />
    </div>
  );
}

function CheckboxGroup({ title, options, value, onChange }) {
  return (
    <div className="col-lg-4">
      <label className="form-label fw-bold small">{title}</label>
      <div className="d-flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            className={`btn btn-sm rounded-pill ${value.includes(option) ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => onChange(toggleArrayValue(value, option))}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
