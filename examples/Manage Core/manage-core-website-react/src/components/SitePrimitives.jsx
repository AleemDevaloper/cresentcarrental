import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { FiArrowRight, FiChevronDown, FiStar, FiCheck } from "react-icons/fi";

/* Scroll-reveal wrapper — adds .mc-done when in viewport.
   variant: "up" (default) | "left" | "right" | "zoom" | "blur" | "fade" */
const VARIANTS = { up: "up", left: "left", right: "right", zoom: "zoom", blur: "blur", fade: "fade" };

export function Reveal({ as: Tag = "div", delay = 0, variant = "up", className = "", children, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-mc-anim={VARIANTS[variant] || "up"}
      className={`${shown ? "mc-done" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* Cursor-following 3D tilt + glare — wraps dashboards, cards, media.
   Sets --rx/--ry rotation and --gx/--gy glare position via pointermove. */
export function Tilt({ children, className = "", max = 9, style, ...rest }) {
  const ref = useRef(null);
  const raf = useRef(0);

  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * max;
    const ry = (px - 0.5) * max;
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      el.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
    });
  }

  function onLeave() {
    cancelAnimationFrame(raf.current);
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }

  return (
    <div
      ref={ref}
      className={`mc-tilt ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}

/* Magnetic pull — element is gently attracted toward the cursor and
   springs back on leave. Sets --mx/--my translate on the wrapper. */
export function Magnetic({ children, className = "", strength = 0.32, style, ...rest }) {
  const ref = useRef(null);
  const raf = useRef(0);

  function onMove(e) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty("--mx", `${(dx * strength).toFixed(1)}px`);
      el.style.setProperty("--my", `${(dy * strength).toFixed(1)}px`);
    });
  }

  function onLeave() {
    cancelAnimationFrame(raf.current);
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", "0px");
    el.style.setProperty("--my", "0px");
  }

  return (
    <div
      ref={ref}
      className={`mc-magnetic ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}

/* Scroll-scrub wrapper — fades/scales its child based on how far the
   element has scrolled past the viewport top (Linear-style hero exit).
   Intensity 0–1 controls how strongly it reacts. */
export function Scrub({ children, className = "", intensity = 1, style, ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ticking = false;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(Math.max(r.top / vh, 0), 1.4);
      const t = 1 - p * 0.16 * intensity;
      el.style.setProperty("--scrub-op", `${Math.max(0.25, 1 - p * 0.85 * intensity).toFixed(2)}`);
      el.style.setProperty("--scrub-y", `${(p * 90 * intensity).toFixed(1)}px`);
      el.style.setProperty("--scrub-s", t.toFixed(3));
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [intensity]);

  return (
    <div ref={ref} className={`mc-scrub ${className}`} style={style} {...rest}>
      {children}
    </div>
  );
}

/* Animated counter */
export function Counter({ value, suffix = "", duration = 1600, decimals = 0 }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Number((value * eased).toFixed(decimals)));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration, decimals]);

  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

export function Stars() {
  return (
    <div className="mc-stars" aria-label="5 star rating">
      {[0, 1, 2, 3, 4].map((i) => (
        <FiStar key={i} fill="currentColor" />
      ))}
    </div>
  );
}

export function SectionHeader({ eyebrow, title, text, center = false }) {
  return (
    <div className={`mc-section-header pt-3 ${center ? "center" : ""}`}>
      {eyebrow && <div className="mc-eyebrow">{eyebrow}</div>}
      <h2>{typeof title === 'string' ? <span className="mc-underline">{title}</span> : title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

export function PageHero({ crumbs, kicker, title, lede, children }) {
  return (
    <section className="mc-page-hero">
      <div className="mc-container">
        {crumbs && (
          <nav className="mc-breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <i>/</i>
            {crumbs.map((c, i) =>
              c.to ? (
                <React.Fragment key={i}>
                  <Link to={c.to}>{c.label}</Link>
                  <i>/</i>
                </React.Fragment>
              ) : (
                <span key={i}>{c.label}</span>
              )
            )}
          </nav>
        )}
        {kicker && (
          <div className="mc-kicker" style={{ marginBottom: 22 }}>
            {kicker}
          </div>
        )}
        <h1>{typeof title === 'string' ? <span className="mc-underline">{title}</span> : title}</h1>
        {lede && <p className="mc-lede">{lede}</p>}
        {children}
      </div>
    </section>
  );
}

/* Browser-window dashboard frame — Zylvoo-style product screenshot mockup */
export function DashFrame({ image, label = "Live preview", alt = "Product interface preview", className = "", style, eager = false }) {
  return (
    <div className={`mc-dash ${className}`} style={style}>
      <div className="mc-dash-top">
        <i /><i /><i />
        <span>{label}</span>
      </div>
      <img src={image} alt={alt} loading={eager ? undefined : "lazy"} decoding="async" />
    </div>
  );
}

export function FAQItem({ q, a, open, onToggle }) {
  return (
    <div className={`mc-faq-item ${open ? "open" : ""}`}>
      <button type="button" className="mc-faq-q" onClick={onToggle} aria-expanded={open}>
        {q}
        <span className="mc-chev">
          <FiChevronDown />
        </span>
      </button>
      {open && <div className="mc-faq-a">{a}</div>}
    </div>
  );
}

export function CtaBand({ title, text, primary, secondary, primaryTo = "/contact", secondaryTo = "/services" }) {
  return (
    <section className="mc-slab mc-slab-tight">
      <div className="mc-container">
        <div className="mc-cta">
          <h2>{title}</h2>
          {text && <p>{text}</p>}
          <div className="mc-hero-actions">
            {primary && (
              <Magnetic>
                <Link className="mc-btn mc-btn-ink d-flex justify-content-center" to={primaryTo}>
                  {primary} <FiArrowRight />
                </Link>
              </Magnetic>
            )}
            {secondary && (
              <Magnetic>
                <Link className="mc-btn mc-btn-ghost d-flex justify-content-center" to={secondaryTo}>
                  {secondary}
                </Link>
              </Magnetic>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CheckList({ items }) {
  return (
    <ul className="mc-check-list">
      {items.map((item) =>
        typeof item === "string" ? (
          <li key={item}>
            <span className="mc-tick">
              <FiCheck />
            </span>
            <span>{item}</span>
          </li>
        ) : (
          <li key={item.text}>
            <span className="mc-tick">
              <FiCheck />
            </span>
            <span>
              <b>{item.title}.</b> {item.text}
            </span>
          </li>
        )
      )}
    </ul>
  );
}

export function IconBadge({ icon: Icon, size = 22 }) {
  return <Icon size={size} />;
}


/* ============================================================
   DIGITALOTTERS-INSPIRED ANIMATION COMPONENTS
   ============================================================ */

/* Marquee — infinite scroll text ticker with edge fade */
export function Marquee({ children, reverse = false, speed = "normal", pauseOnHover = true, className = "" }) {
  const dur = speed === "slow" ? "var(--marquee-duration-slow)" : "var(--marquee-duration)";
  return (
    <div className={`mc-marquee-new ${className}`}>
      <div
        className={`mc-marquee-track-new ${reverse ? "reverse" : ""}`}
        style={{ animationDuration: dur }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}

/* MarqueeItem — individual item inside Marquee */
export function MarqueeItem({ icon: Icon, children, className = "" }) {
  return (
    <span className={`mc-marquee-item-new ${className}`}>
      {Icon && <Icon size={14} />}
      {children}
    </span>
  );
}

/* ScrollReveal — CSS animation-timeline with IO fallback */
export function ScrollReveal({ variant = "up", delay = 0, className = "", children, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const animClass = shown ? "mc-done" : "";
  const variantClass = `mc-sr-${variant}`;

  return (
    <div
      ref={ref}
      className={`mc-scroll-reveal ${variantClass} ${animClass} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}

/* GradientText — animated gradient text */
export function GradientText({ children, className = "", as: Tag = "span" }) {
  return (
    <Tag className={`mc-gradient-text ${className}`}>
      {children}
    </Tag>
  );
}

/* Typewriter — typing effect with cursor */
export function Typewriter({ words = [], speed = 100, pause = 2000, className = "" }) {
  const [currentWord, setCurrentWord] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWord];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setCurrentChar((c) => c + 1);
        if (currentChar >= word.length) {
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        setCurrentChar((c) => c - 1);
        if (currentChar <= 0) {
          setIsDeleting(false);
          setCurrentWord((w) => (w + 1) % words.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [currentChar, currentWord, isDeleting, words, speed, pause]);

  const display = words[currentWord]?.slice(0, currentChar) || "";

  return (
    <span className={`mc-typing-cursor ${className}`}>
      {display}
    </span>
  );
}

/* WordCycle — rotating word carousel */
export function WordCycle({ words = [], interval = 3000, className = "" }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  return (
    <span className={`mc-word-cycle ${className}`}>
      <span
        className="mc-word-cycle-inner"
        style={{ transform: `translateY(-${index * 1.2}em)` }}
      >
        {words.map((w) => (
          <span key={w} className="mc-word-cycle-word">{w}</span>
        ))}
      </span>
    </span>
  );
}

/* MorphBlob — organic shape animation */
export function MorphBlob({ size = 200, color = "brand", className = "", style }) {
  return (
    <div
      className={`mc-blob ${color} ${className}`}
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        animation: `mc-blob-morph 12s ease-in-out infinite, mc-blob-drift 18s ease-in-out infinite`,
        ...style,
      }}
    />
  );
}

/* GlowPulse — pulsing glow effect */
export function GlowPulse({ color = "var(--brand)", size = 120, className = "", style }) {
  return (
    <div
      className={`mc-glow-pulse ${className}`}
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: "blur(40px)",
        ...style,
      }}
    />
  );
}

/* BeamSweep — diagonal beam animation */
export function BeamSweep({ className = "", style }) {
  return (
    <div className={`mc-beam ${className}`} aria-hidden="true" style={style} />
  );
}

/* ScanLine — vertical scan line */
export function ScanLine({ className = "", style }) {
  return (
    <div className={`mc-scan-line ${className}`} aria-hidden="true" style={style} />
  );
}

/* GlassCard — glassmorphism card */
export function GlassCard({ children, className = "", ...rest }) {
  return (
    <div className={`mc-glass ${className}`} {...rest}>
      {children}
    </div>
  );
}

/* WorldClock — timezone display widget */
const TIMEZONES = [
  { city: "Lahore", tz: "Asia/Karachi" },
  { city: "Al Jubail", tz: "Asia/Riyadh" },
  { city: "London", tz: "Europe/London" },
  { city: "New York", tz: "America/New_York" },
  { city: "Singapore", tz: "Asia/Singapore" },
];

export function WorldClock({ cities = TIMEZONES, className = "" }) {
  const [times, setTimes] = useState({});

  useEffect(() => {
    const update = () => {
      const now = {};
      cities.forEach(({ city, tz }) => {
        try {
          now[city] = new Intl.DateTimeFormat("en-US", {
            timeZone: tz,
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }).format(new Date());
        } catch {
          now[city] = "--:--";
        }
      });
      setTimes(now);
    };
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, [cities]);

  return (
    <div className={`mc-world-clock ${className}`}>
      {cities.map(({ city }) => {
        const hour = parseInt(times[city]) || 0;
        const isOnline = hour >= 9 && hour <= 18;
        return (
          <div key={city} className="mc-clock-city">
            <span className={`mc-clock-dot ${isOnline ? "" : "offline"}`} />
            <span>{city}</span>
            <span style={{ fontWeight: 600 }}>{times[city] || "--:--"}</span>
          </div>
        );
      })}
    </div>
  );
}

/* DotGrid — animated dot grid background */
export function DotGrid({ spacing = 24, className = "", style }) {
  return (
    <div
      className={`mc-dot-grid ${className}`}
      aria-hidden="true"
      style={{
        backgroundSize: `${spacing}px ${spacing}px`,
        ...style,
      }}
    />
  );
}

/* OrbitRing — rotating orbital ring */
export function OrbitRing({ size = 200, speed = "normal", reverse = false, className = "", style }) {
  const dur = speed === "slow" ? "36s" : "24s";
  return (
    <div
      className={`mc-orbit-ring-new ${reverse ? "reverse" : ""} ${className}`}
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        animationDuration: dur,
        ...style,
      }}
    />
  );
}

/* Sheen — hover sheen effect wrapper */
export function Sheen({ children, className = "", ...rest }) {
  return (
    <div className={`mc-sheen-wrap ${className}`} {...rest}>
      {children}
    </div>
  );
}

/* CompareSlider — before/after image comparison */
export function CompareSlider({ beforeImg, afterImg, beforeAlt = "Before", afterAlt = "After", className = "" }) {
  const containerRef = useRef(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const updatePos = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX || 0) - rect.left;
    setPos(Math.max(0, Math.min(100, (x / rect.width) * 100)));
  };

  const onDown = (e) => {
    dragging.current = true;
    updatePos(e);
  };
  const onMove = (e) => {
    if (dragging.current) updatePos(e);
  };
  const onUp = () => { dragging.current = false; };

  useEffect(() => {
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`mc-compare-slider ${className}`}
      onMouseDown={onDown}
      onTouchStart={onDown}
    >
      <img src={afterImg} alt={afterAlt} />
      <div className="mc-compare-overlay" style={{ width: `${pos}%` }}>
        <img src={beforeImg} alt={beforeAlt} style={{ width: containerRef.current?.offsetWidth || "100%" }} />
      </div>
      <div className="mc-compare-handle" style={{ left: `${pos}%` }} />
    </div>
  );
}
