import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullhorn, faCheckCircle, faTimes } from "@fortawesome/free-solid-svg-icons";
import { acknowledgeAnnouncement, listAnnouncements, markAnnouncementRead } from "../../api/announcements";
import { useApp } from "../../hooks/useApp";
import { normalizeRole } from "../../utils/roles";

const dismissedKey = (announcement) => `announcement_dismissed_${announcement.id}_${announcement.updated_at || announcement.published_at || "v1"}`;

export default function AnnouncementSurface() {
  const { currentUser, addNotification, theme } = useApp();
  const [announcements, setAnnouncements] = useState([]);
  const [activePopup, setActivePopup] = useState(null);
  const role = normalizeRole(currentUser?.role);

  useEffect(() => {
    if (!currentUser || role === "SuperAdmin") return;

    let cancelled = false;
    async function load() {
      try {
        const data = await listAnnouncements({ audience: "recipient" });
        if (cancelled) return;
        const visible = (Array.isArray(data) ? data : []).filter((item) => !localStorage.getItem(dismissedKey(item)));
        setAnnouncements(visible);
        setActivePopup(visible.find((item) => (item.placements || []).includes("Popup Modal")) || null);
      } catch (err) {
        console.error("Announcement load failed:", err);
      }
    }

    load();
    const timer = window.setInterval(load, 60000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [currentUser, role]);

  const topBanner = useMemo(() => {
    return announcements.find((item) => {
      const placements = item.placements || [];
      return placements.includes("Top Banner") || placements.includes("Dashboard Banner");
    }) || announcements[0] || null;
  }, [announcements]);

  const closeAnnouncement = async (announcement) => {
    if (announcement.dismissible) {
      localStorage.setItem(dismissedKey(announcement), "1");
      setAnnouncements((prev) => prev.filter((item) => item.id !== announcement.id));
      if (activePopup?.id === announcement.id) setActivePopup(null);
    }

    try {
      await markAnnouncementRead(announcement.id);
    } catch {
      // Keep UI responsive even if tracking fails.
    }
  };

  const acknowledge = async (announcement) => {
    try {
      await acknowledgeAnnouncement(announcement.id);
      localStorage.setItem(dismissedKey(announcement), "1");
      setAnnouncements((prev) => prev.filter((item) => item.id !== announcement.id));
      if (activePopup?.id === announcement.id) setActivePopup(null);
      addNotification?.("Announcement acknowledged", "success");
    } catch (err) {
      addNotification?.(err.message || "Unable to acknowledge announcement", "danger");
    }
  };

  if (!currentUser || role === "SuperAdmin") return null;

  return (
    <>
      {topBanner && (
        <div className="announcement-global-banner" style={{ borderLeft: `5px solid ${topBanner.severity_color || "#2563eb"}` }}>
          <div className="d-flex align-items-start gap-3">
            <div className="announcement-global-icon">
              <FontAwesomeIcon icon={faBullhorn} />
            </div>
            <div className="flex-grow-1">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                <strong>{topBanner.title}</strong>
                <span className="badge bg-primary bg-opacity-10 text-primary text-uppercase">{topBanner.priority}</span>
              </div>
              <div className="small">{topBanner.summary || topBanner.description}</div>
            </div>
            <div className="d-flex gap-2">
              {topBanner.requires_acknowledgement && (
                <button className="btn btn-sm btn-primary rounded-3" onClick={() => acknowledge(topBanner)}>
                  <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
                  Acknowledge
                </button>
              )}
              {topBanner.dismissible && (
                <button className="btn btn-sm btn-light rounded-3" onClick={() => closeAnnouncement(topBanner)} aria-label="Dismiss announcement">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {activePopup && (
        <div className="announcement-popup-backdrop">
          <div className={`announcement-popup ${theme === "dark" ? "announcement-popup-dark" : ""}`} style={{ borderTop: `5px solid ${activePopup.severity_color || "#2563eb"}` }}>
            <div className="d-flex justify-content-between gap-3 mb-3">
              <div>
                <span className="badge bg-primary bg-opacity-10 text-primary text-uppercase mb-2">{activePopup.type?.replaceAll("_", " ")}</span>
                <h4 className="fw-bold mb-1">{activePopup.title}</h4>
                <p className="text-muted mb-0">{activePopup.summary}</p>
              </div>
              {activePopup.dismissible && (
                <button className="btn btn-sm btn-light align-self-start" onClick={() => closeAnnouncement(activePopup)} aria-label="Close announcement">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              )}
            </div>
            <div className="mb-4" style={{ whiteSpace: "pre-wrap" }}>{activePopup.description}</div>
            <div className="d-flex justify-content-end gap-2">
              <button className="btn btn-outline-secondary rounded-3" onClick={() => closeAnnouncement(activePopup)}>Mark Read</button>
              {activePopup.requires_acknowledgement && (
                <button className="btn btn-primary rounded-3" onClick={() => acknowledge(activePopup)}>
                  <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
                  Acknowledge
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .announcement-global-banner {
          position: fixed;
          top: 82px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1060;
          width: min(980px, calc(100vw - 32px));
          background: #ffffff;
          color: #111827;
          border-radius: 8px;
          box-shadow: 0 14px 36px rgba(15, 23, 42, 0.18);
          padding: 14px 16px;
        }
        .announcement-global-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #eff6ff;
          color: #2563eb;
          flex-shrink: 0;
        }
        .announcement-popup-backdrop {
          position: fixed;
          inset: 0;
          z-index: 1070;
          background: rgba(15, 23, 42, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .announcement-popup {
          width: min(620px, 100%);
          background: #ffffff;
          color: #111827;
          border-radius: 8px;
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.35);
          padding: 24px;
        }
        .announcement-popup-dark {
          background: #1e293b;
          color: #f8fafc;
        }
        @media (max-width: 768px) {
          .announcement-global-banner {
            top: 72px;
          }
        }
      `}} />
    </>
  );
}
