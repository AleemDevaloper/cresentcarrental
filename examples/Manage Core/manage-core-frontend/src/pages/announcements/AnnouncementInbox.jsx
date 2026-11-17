import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn, faCheckCircle, faClock, faShieldHalved, faSearch, faFilter, faCalendarDays, faBell, faList, faEnvelope, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useApp } from "../../hooks/useApp";
import { acknowledgeAnnouncement, listAnnouncements, markAnnouncementRead } from "../../api/announcements";

export default function AnnouncementInbox() {
  const { addNotification, theme } = useApp();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, read, unread, critical
  const isDark = theme === "dark";

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await listAnnouncements({ audience: "recipient" });
      setAnnouncements(Array.isArray(data) ? data : []);
    } catch (err) {
      addNotification?.(err.message || "Failed to load announcements", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleRead = async (id) => {
    try {
      await markAnnouncementRead(id);
      loadAnnouncements();
      addNotification?.("Announcement marked as read", "success");
    } catch (err) {
      addNotification?.(err.message || "Unable to mark as read", "danger");
    }
  };

  const handleAcknowledge = async (id) => {
    try {
      await acknowledgeAnnouncement(id);
      loadAnnouncements();
      addNotification?.("Announcement acknowledged", "success");
    } catch (err) {
      addNotification?.(err.message || "Unable to acknowledge", "danger");
    }
  };

  // Filter announcements based on search and filter type
  const filteredAnnouncements = announcements.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === "critical") return matchesSearch && item.priority === "critical";
    if (filterType === "read") return matchesSearch && item.read;
    if (filterType === "unread") return matchesSearch && !item.read;
    return matchesSearch;
  });

  const severityColors = {
    critical: { bg: "#fee2e2", text: "#dc2626", icon: "🔴" },
    high: { bg: "#fef3c7", text: "#d97706", icon: "🟠" },
    medium: { bg: "#dbeafe", text: "#2563eb", icon: "🔵" },
    low: { bg: "#dcfce7", text: "#16a34a", icon: "🟢" },
  };

  const getPriorityStyling = (priority) => severityColors[priority] || severityColors.medium;

  const stats = {
    total: announcements.length,
    unread: announcements.filter(a => !a.read).length,
    critical: announcements.filter(a => a.priority === "critical").length,
  };

  return (
    <div style={{ padding: "24px", background: isDark ? "#0f172a" : "#f8fafc", minHeight: "100vh" }}>
      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* HERO SECTION WITH GRADIENT                                            */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div style={{
        background: isDark 
          ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)" 
          : "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
        borderRadius: "16px",
        padding: "40px",
        marginBottom: "32px",
        color: "#fff",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: "-40px", right: "-40px", opacity: 0.1, fontSize: "200px" }}>
          <FontAwesomeIcon icon={faBullhorn} />
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <FontAwesomeIcon icon={faBullhorn} style={{ fontSize: "24px" }} />
              <span style={{ fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.9 }}>Company Communications</span>
            </div>
            <div style={{
              display: "flex",
              gap: "12px",
              padding: "8px 16px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "8px",
              backdropFilter: "blur(10px)"
            }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "11px", opacity: 0.8, margin: 0 }}>UNREAD</p>
                <p style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>{stats.unread}</p>
              </div>
              <div style={{ width: "1px", background: "rgba(255,255,255,0.2)" }} />
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "11px", opacity: 0.8, margin: 0 }}>CRITICAL</p>
                <p style={{ fontSize: "18px", fontWeight: "700", margin: 0 }}>{stats.critical}</p>
              </div>
            </div>
          </div>
          <h1 style={{ fontSize: "36px", fontWeight: "900", margin: "0 0 8px 0", letterSpacing: "-0.02em" }}>Announcements</h1>
          <p style={{ fontSize: "15px", opacity: 0.95, margin: 0 }}>Important company notices, alerts, policy updates, and system messages</p>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* STATISTICS CARDS                                                       */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Total", value: stats.total, icon: faBullhorn, color: "#3b82f6", bgColor: "#eff6ff" },
          { label: "Unread", value: stats.unread, icon: faBell, color: "#f59e0b", bgColor: "#fffbeb" },
          { label: "Critical", value: stats.critical, icon: faShieldHalved, color: "#ef4444", bgColor: "#fee2e2" },
          { label: "Read", value: stats.total - stats.unread, icon: faCheckCircle, color: "#10b981", bgColor: "#ecfdf5" },
        ].map((stat, idx) => (
          <div
            key={idx}
            style={{
              background: isDark ? "#1e293b" : "#fff",
              borderRadius: "12px",
              padding: "20px",
              border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
              boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.05)",
              transition: "all 0.3s ease",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = isDark ? "0 8px 16px rgba(0,0,0,0.3)" : "0 8px 16px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = isDark ? "none" : "0 1px 3px rgba(0,0,0,0.05)";
            }}
          >
            <div style={{
              position: "absolute",
              top: "-20px",
              right: "-20px",
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: stat.bgColor,
              opacity: isDark ? 0.1 : 0.2
            }} />
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
              <div>
                <p style={{ fontSize: "12px", color: isDark ? "#94a3b8" : "#64748b", margin: "0 0 8px 0", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {stat.label}
                </p>
                <h3 style={{ fontSize: "32px", fontWeight: "900", margin: 0, color: isDark ? "#f1f5f9" : "#1e293b" }}>
                  {stat.value}
                </h3>
              </div>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                background: isDark ? stat.bgColor + "30" : stat.bgColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: stat.color,
                fontSize: "20px",
                flexShrink: 0
              }}>
                <FontAwesomeIcon icon={stat.icon} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* SEARCH AND FILTER BAR                                                  */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      <div style={{
        background: isDark ? "#1e293b" : "#fff",
        borderRadius: "12px",
        padding: "20px",
        marginBottom: "24px",
        border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        alignItems: "center"
      }}>
        <div style={{ position: "relative", flex: 1, minWidth: "250px" }}>
          <FontAwesomeIcon
            icon={faSearch}
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: isDark ? "#64748b" : "#cbd5e1",
              fontSize: "14px",
              pointerEvents: "none"
            }}
          />
          <input
            type="text"
            placeholder="Search by title, summary, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "11px 14px 11px 40px",
              borderRadius: "8px",
              border: isDark ? "1px solid #334155" : "1px solid #e2e8f0",
              background: isDark ? "#0f172a" : "#f8fafc",
              color: isDark ? "#f1f5f9" : "#1e293b",
              fontSize: "14px",
              outline: "none",
              transition: "all 0.2s",
              fontWeight: "500"
            }}
            onFocus={(e) => {
              e.target.style.border = isDark ? "1px solid #475569" : "1px solid #3b82f6";
              e.target.style.boxShadow = isDark ? "0 0 0 3px rgba(71,117,169,0.1)" : "0 0 0 3px rgba(59,130,246,0.1)";
              e.target.style.background = isDark ? "#1e293b" : "#fff";
            }}
            onBlur={(e) => {
              e.target.style.border = isDark ? "1px solid #334155" : "1px solid #e2e8f0";
              e.target.style.boxShadow = "none";
              e.target.style.background = isDark ? "#0f172a" : "#f8fafc";
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          {["all", "unread", "read", "critical"].map((filter) => {
            const filterConfig = {
              all: { label: "All", bg: "#3b82f6", icon: faList },
              unread: { label: "Unread", bg: "#f59e0b", icon: faEnvelope },
              read: { label: "Read", bg: "#10b981", icon: faCheckCircle },
              critical: { label: "Critical", bg: "#ef4444", icon: faTriangleExclamation }
            };
            const config = filterConfig[filter];
            return (
              <button
                key={filter}
                onClick={() => setFilterType(filter)}
                style={{
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: filterType === filter ? "none" : `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                  background: filterType === filter ? config.bg : (isDark ? "#0f172a" : "#f8fafc"),
                  color: filterType === filter ? "#fff" : (isDark ? "#e2e8f0" : "#64748b"),
                  fontWeight: "600",
                  fontSize: "13px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap"
                }}
              >
                <FontAwesomeIcon icon={config.icon} style={{ fontSize: "13px" }} />
                {config.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={loadAnnouncements}
          disabled={loading}
          style={{
            padding: "10px 18px",
            borderRadius: "8px",
            border: "none",
            background: "#3b82f6",
            color: "#fff",
            fontWeight: "600",
            fontSize: "13px",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            opacity: loading ? 0.7 : 1,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            whiteSpace: "nowrap"
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.background = "#1d4ed8";
              e.target.style.transform = "scale(1.02)";
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#3b82f6";
            e.target.style.transform = "scale(1)";
          }}
        >
          <span>🔄</span>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {/* ────────────────────────────────────────────────────────────────────── */}
      {/* ANNOUNCEMENTS LIST                                                     */}
      {/* ────────────────────────────────────────────────────────────────────── */}
      {loading ? (
        <div style={{
          textAlign: "center",
          padding: "60px 20px",
          color: isDark ? "#94a3b8" : "#64748b"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
          <p style={{ fontSize: "16px", fontWeight: "500" }}>Loading announcements...</p>
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div style={{
          background: isDark ? "#1e293b" : "#fff",
          borderRadius: "12px",
          padding: "60px 20px",
          textAlign: "center",
          border: isDark ? "1px solid #334155" : "1px solid #e2e8f0"
        }}>
          <div style={{ fontSize: "64px", marginBottom: "16px", opacity: 0.5 }}>📭</div>
          <h5 style={{ fontSize: "18px", fontWeight: "700", color: isDark ? "#f1f5f9" : "#1e293b", marginBottom: "8px" }}>
            {searchTerm || filterType !== "all" ? "No announcements found" : "No active announcements"}
          </h5>
          <p style={{ color: isDark ? "#64748b" : "#94a3b8", margin: 0 }}>
            {searchTerm || filterType !== "all" ? "Try adjusting your search or filters" : "You are all caught up!"}
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
          {filteredAnnouncements.map((item) => {
            const priorityStyle = getPriorityStyling(item.priority || "medium");
            const [isExpanded, setIsExpanded] = React.useState(false);
            return (
              <div
                key={item.id}
                style={{
                  background: isDark ? "#1e293b" : "#fff",
                  borderRadius: "12px",
                  padding: "20px",
                  border: `2px solid ${item.read ? (isDark ? "#334155" : "#e2e8f0") : priorityStyle.text}`,
                  boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                  borderLeft: `5px solid ${priorityStyle.text}`,
                  opacity: item.read ? 0.85 : 1,
                  position: "relative",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = isDark ? "0 12px 24px rgba(0,0,0,0.4)" : "0 12px 24px rgba(0,0,0,0.12)";
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.borderColor = priorityStyle.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = isDark ? "none" : "0 1px 3px rgba(0,0,0,0.05)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = item.read ? (isDark ? "#334155" : "#e2e8f0") : priorityStyle.text;
                }}
              >
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "10px",
                    background: priorityStyle.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: priorityStyle.text,
                    fontSize: "18px",
                    flexShrink: 0
                  }}>
                    {priorityStyle.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{
                        display: "inline-block",
                        background: priorityStyle.bg,
                        color: priorityStyle.text,
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "10px",
                        fontWeight: "700",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em"
                      }}>
                        {item.priority || "Medium"}
                      </span>
                      {item.type && (
                        <span style={{
                          fontSize: "10px",
                          fontWeight: "700",
                          color: isDark ? "#94a3b8" : "#94a3b8",
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          padding: "4px 8px",
                          background: isDark ? "#0f172a" : "#f1f5f9",
                          borderRadius: "4px"
                        }}>
                          {item.type.replace(/_/g, " ")}
                        </span>
                      )}
                    </div>
                  </div>
                  {item.read && (
                    <div style={{
                      background: "#22c55e",
                      color: "#fff",
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      flexShrink: 0
                    }}>
                      <FontAwesomeIcon icon={faCheckCircle} />
                    </div>
                  )}
                </div>

                <h4 style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: isDark ? "#f1f5f9" : "#1e293b",
                  margin: "0 0 8px 0",
                  lineHeight: "1.4"
                }}>
                  {item.title}
                </h4>
                
                <p style={{
                  fontSize: "13px",
                  color: isDark ? "#cbd5e1" : "#64748b",
                  margin: "0 0 12px 0",
                  lineHeight: "1.5"
                }}>
                  {item.summary}
                </p>

                {item.description && (
                  <p style={{
                    fontSize: "13px",
                    color: isDark ? "#9ca3af" : "#6b7280",
                    margin: "12px 0",
                    lineHeight: "1.6",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    maxHeight: isExpanded ? "none" : "60px",
                    overflow: isExpanded ? "visible" : "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: isExpanded ? "unset" : 2,
                    WebkitBoxOrient: "vertical"
                  }}>
                    {item.description}
                  </p>
                )}

                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  fontSize: "12px",
                  color: isDark ? "#94a3b8" : "#64748b",
                  marginTop: "16px",
                  paddingTop: "16px",
                  borderTop: isDark ? "1px solid #334155" : "1px solid #e2e8f0"
                }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <FontAwesomeIcon icon={faCalendarDays} />
                    {item.expires_at ? new Date(item.expires_at).toLocaleDateString() : "No expiry"}
                  </span>
                  <span style={{ marginLeft: "auto", fontWeight: "700", textTransform: "uppercase" }}>
                    {item.type?.replace(/_/g, " ") || "General"}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "8px", marginTop: "16px", flexWrap: "wrap" }}>
                  {item.description && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: `1px solid ${isDark ? "#475569" : "#cbd5e1"}`,
                        background: "transparent",
                        color: isDark ? "#e2e8f0" : "#64748b",
                        fontWeight: "600",
                        fontSize: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = isDark ? "rgba(71,117,169,0.1)" : "rgba(59,130,246,0.05)";
                        e.target.style.borderColor = isDark ? "#64748b" : "#3b82f6";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "transparent";
                        e.target.style.borderColor = isDark ? "#475569" : "#cbd5e1";
                      }}
                    >
                      {isExpanded ? "Show Less" : "Show More"}
                    </button>
                  )}
                  {!item.read && (
                    <button
                      onClick={() => handleRead(item.id)}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: `1px solid ${isDark ? "#475569" : "#cbd5e1"}`,
                        background: "transparent",
                        color: isDark ? "#e2e8f0" : "#64748b",
                        fontWeight: "600",
                        fontSize: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = isDark ? "#334155" : "#f1f5f9";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "transparent";
                      }}
                    >
                      Mark Read
                    </button>
                  )}
                  {item.requires_acknowledgement && (
                    <button
                      onClick={() => handleAcknowledge(item.id)}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        borderRadius: "6px",
                        border: "none",
                        background: "#3b82f6",
                        color: "#fff",
                        fontWeight: "600",
                        fontSize: "12px",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "#2563eb";
                        e.target.style.boxShadow = "0 4px 12px rgba(59,130,246,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "#3b82f6";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: "6px" }} />
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
