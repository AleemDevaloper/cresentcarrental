import React, { useState } from "react";
import { Reveal, PageHero } from "@/components/SitePrimitives";

export default function PrivacyChoices() {
  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem("mc-cookie-prefs");
      return saved ? JSON.parse(saved) : { essential: true, analytics: false, marketing: false };
    } catch {
      return { essential: true, analytics: false, marketing: false };
    }
  });

  const save = () => {
    localStorage.setItem("mc-cookie-prefs", JSON.stringify({ ...prefs, saved: true }));
  };

  const toggle = (key) => {
    if (key === "essential") return;
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  };

  return (
    <>
      <PageHero
        crumbs={[{ label: "Privacy Choices", to: "/privacy-choices" }]}
        title={<>Your privacy <span className="mc-grad-text">choices</span></>}
        lede="Manage your cookie preferences and data sharing settings."
      />

      <section className="mc-slab">
        <div className="mc-container" style={{ maxWidth: 600 }}>
          <Reveal>
            <div className="mc-card" style={{ padding: 40 }}>
              <h2 style={{ fontSize: 22, marginBottom: 20 }}>Cookie Preferences</h2>

              {[
                { key: "essential", label: "Essential Cookies", desc: "Required for the website to function. Cannot be disabled.", required: true },
                { key: "analytics", label: "Analytics Cookies", desc: "Help us understand how visitors interact with our website." },
                { key: "marketing", label: "Marketing Cookies", desc: "Used to deliver relevant advertisements and track campaign performance." },
              ].map((item) => (
                <div
                  key={item.key}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 0",
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                    <div style={{ color: "var(--muted)", fontSize: 13 }}>{item.desc}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggle(item.key)}
                    disabled={item.required}
                    style={{
                      width: 48,
                      height: 26,
                      borderRadius: 13,
                      border: "none",
                      background: prefs[item.key] ? "var(--brand)" : "var(--line-strong)",
                      cursor: item.required ? "not-allowed" : "pointer",
                      position: "relative",
                      transition: "background 0.2s",
                      opacity: item.required ? 0.6 : 1,
                    }}
                    aria-label={`Toggle ${item.label}`}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: 3,
                        left: prefs[item.key] ? 25 : 3,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: "#fff",
                        transition: "left 0.2s",
                      }}
                    />
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="mc-btn mc-btn-primary mc-btn-pill"
                style={{ marginTop: 24, width: "100%" }}
                onClick={save}
              >
                Save Preferences
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
