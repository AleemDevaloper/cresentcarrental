import React, { useEffect, useRef, useState } from "react";
import "@/styles/preloader.css";

const logo = "/images/logo1.png";

const WORDS = [
  { p: "Secure", s: "Design" },
  { p: "Trusted", s: "Engineering" },
  { p: "Scalable", s: "Automation" },
  { p: "Measurable", s: "Intelligence" },
  { p: "Reliable", s: "Delivery" },
  { p: "Ownable", s: "Growth" },
];

const STAGES = [
  { at: 0, label: "Booting core" },
  { at: 20, label: "Loading design system" },
  { at: 40, label: "Wiring data layer" },
  { at: 60, label: "Assembling interfaces" },
  { at: 80, label: "Securing your session" },
  { at: 100, label: "Ready" },
];

const WORDMARK = Array.from("MANAGE CORE");

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export default function Preloader({ minMs = 1700, fullscreen = true, onDone }) {
  const [state, setState] = useState("ready");
  const [pct, setPct] = useState(0);
  const [wi, setWi] = useState(0);
  const raf = useRef(null);
  const start = useRef(null);
  const exitTimer = useRef(null);

  const stage = STAGES.reduce(
    (acc, s) => (pct >= s.at ? s.label : acc),
    STAGES[0].label
  );

  useEffect(() => {
    const wordTimer = setInterval(() => {
      setWi((prev) => (prev + 1) % WORDS.length);
    }, 1500);
    return () => clearInterval(wordTimer);
  }, []);

  useEffect(() => {
    if (state !== "exit" || !onDone) return undefined;
    exitTimer.current = setTimeout(onDone, 760);
    return () => clearTimeout(exitTimer.current);
  }, [state, onDone]);

  useEffect(() => {
    start.current = Date.now();
    let last = 0;
    let timer = null;    const step = () => {
      const el = Date.now() - start.current;
      const t = Math.min(el / 1300, 1);
      const eased = easeOutCubic(t);
      const next = Math.round(eased * 100);
      if (next !== last) {
        last = next;
        setPct(next);
        if (next >= 100) {
          const wait = Math.max(minMs - el, 120);
          timer = setTimeout(() => setState("exit"), wait);
          return;
        }
      }
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf.current);
      clearTimeout(timer);
    };
  }, [minMs]);

  return (
    <div
      className={`mc-pre ${fullscreen ? "mc-pre-full" : "mc-pre-inline"} ${state === "exit" ? "mc-pre-exit" : ""}`}
      role="status"
      aria-label="Loading Manage Core"
    >
      <div className="mc-pre-veil mc-pre-veil-l" aria-hidden="true" />
      <div className="mc-pre-veil mc-pre-veil-r" aria-hidden="true" />
      <i className="mc-pre-orb mc-pre-orb-a" aria-hidden="true" />
      <i className="mc-pre-orb mc-pre-orb-b" aria-hidden="true" />
      <i className="mc-pre-orb mc-pre-orb-c" aria-hidden="true" />
      <i className="mc-pre-grid" aria-hidden="true" />

      <div className="mc-pre-inner">
        <div className="mc-pre-mark">
          <img src={logo} alt="Manage Core monogram" />
          <span className="mc-pre-ring" aria-hidden="true" />
          <i className="mc-pre-sat mc-pre-sat-1" aria-hidden="true" />
          <i className="mc-pre-sat mc-pre-sat-2" aria-hidden="true" />
          <i className="mc-pre-sat mc-pre-sat-3" aria-hidden="true" />
        </div>

        <h2 className="mc-pre-word" aria-hidden="true">
          {WORDMARK.map((ch, i) => (
            <span key={i} style={{ animationDelay: `${120 + i * 42}ms` }}>
              {ch === " " ? "\u00A0" : ch}
            </span>
          ))}
        </h2>

        <div className="mc-pre-scribe" aria-live="polite">
          <span>{WORDS[wi].p}</span>
          <b>{WORDS[wi].s}</b>
          <i className="mc-pre-caret" aria-hidden="true" />
        </div>

        <div className="mc-pre-foot">
          <span className="mc-pre-pct">{String(pct).padStart(3, "0")}</span>
          <span className="mc-pre-stage" aria-hidden="true">{stage}</span>
          <span className="mc-pre-track" aria-hidden="true">
            <i style={{ width: `${100 - pct}%` }} />
          </span>
        </div>
      </div>
    </div>
  );
}