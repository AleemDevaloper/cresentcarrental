import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faEye, 
  faEyeSlash, 
  faLock, 
  faRightToBracket, 
  faEnvelope,
  faProjectDiagram,
  faUsers,
  faTasks,
  faFileAlt,
  faCalculator,
  faShieldAlt,
  faCircleCheck,
  faChartLine,
  faBolt,
  faKey,
  faTriangleExclamation,
  faCircleInfo,
  faArrowRightLong
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from "../../hooks/useApp";
import logo from "../../assets/images/logo1.png";
import NotificationBox from "../../components/common/NotificationBox";
import { getHomeRouteForRole } from "../../utils/roles";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const { login, addNotification, notifications, removeNotification } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const btnRef = useRef(null);
  const liveRef = useRef(null);

  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.getModifierState) setCapsLockOn(e.getModifierState("CapsLock"));
    };
    window.addEventListener("keyup", onKey);
    return () => window.removeEventListener("keyup", onKey);
  }, []);

  const validateEmail = (value) => {
    const v = (value || "").trim();
    if (!v) return "Please enter your corporate email address.";
    if (!EMAIL_RE.test(v)) return "That email address doesn't look right. Check for typos.";
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailErr = validateEmail(email);
    if (emailErr) {
      setFieldError(emailErr);
      setError("");
      return;
    }
    if (!password) {
      setError("Please enter your corporate credentials.");
      setFieldError("");
      return;
    }
    setSubmitting(true);
    if (liveRef?.current) liveRef.current.textContent = 'Authenticating...';
    setError("");
    setFieldError("");

    try {
      if (rememberMe) localStorage.setItem("rememberedEmail", email);
      else localStorage.removeItem("rememberedEmail");

      const user = await login({ email: email.trim(), password });
      if (liveRef?.current) liveRef.current.textContent = 'Authentication successful';
      navigate(getHomeRouteForRole(user?.role));
    } catch (err) {
      setError(err?.message || "Authentication failed. Please check your credentials.");
      if (liveRef?.current) liveRef.current.textContent = 'Authentication failed';
    } finally {
      setSubmitting(false);
      setTimeout(() => { if (liveRef?.current) liveRef.current.textContent = ''; }, 2000);
    }
  };

  const handleDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setFieldError("");
    setError("");
    setShowPassword(false);
    addNotification(`Demo credentials loaded for ${demoEmail}.`, "info", 3500, { title: "Demo Access" });
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    const err = validateEmail(forgotEmail);
    if (err) {
      addNotification(err, "warning", 4000, { title: "Forgot Password" });
      return;
    }
    setForgotSent(true);
    addNotification(
      `If an account exists for ${forgotEmail.trim()}, a reset link has been dispatched.`,
      "success",
      5000,
      { title: "Request Received" }
    );
  };

  const modules = [
    { name: "PMS", icon: faProjectDiagram, desc: "Project Management", accent: "#818cf8", tint: "rgba(129,140,248,0.16)" },
    { name: "HRMS", icon: faUsers, desc: "Human Resources", accent: "#34d399", tint: "rgba(52,211,153,0.16)" },
    { name: "TaskMS", icon: faTasks, desc: "Task & Workflow", accent: "#38bdf8", tint: "rgba(56,189,248,0.16)" },
    { name: "DMS", icon: faFileAlt, desc: "Document Management", accent: "#fbbf24", tint: "rgba(251,191,36,0.16)" },
    { name: "AMS", icon: faCalculator, desc: "Accounting & Payroll", accent: "#f472b6", tint: "rgba(244,114,182,0.16)" },
    { name: "Security", icon: faShieldAlt, desc: "System Governance", accent: "#a78bfa", tint: "rgba(167,139,250,0.16)" },
  ];

  return (
    <main className="login-page">
      <div className="login-particle login-particle--1" aria-hidden="true" />
      <div className="login-particle login-particle--2" aria-hidden="true" />
      <div className="login-particle login-particle--3" aria-hidden="true" />
      <div className="login-particle login-particle--4" aria-hidden="true" />

      <NotificationBox notifications={notifications} onClose={removeNotification} />

      <section className="enterprise-container">
        <div className="enterprise-container-inner">
        <aside className="system-modules-sidebar login-command-side">
          <header className="hub-header">
            <div className="enterprise-badge">ENTERPRISE COMMAND SUITE</div>
            <h1>Manage Core <span>Control Center</span></h1>
            <p>Secure access to the operational layer that connects projects, workforce, finance, documents, automation, and audit readiness.</p>
          </header>

          <div className="module-grid">
            {modules.map((mod, idx) => (
              <div
                key={idx}
                className="module-item"
                style={{ "--item-index": idx, "--accent": mod.accent, "--accent-tint": mod.tint }}
              >
                <div className="module-icon-wrapper">
                  <div className="module-icon" style={{ background: mod.tint, color: mod.accent }}>
                    <FontAwesomeIcon icon={mod.icon} />
                  </div>
                </div>
                <div className="module-content">
                  <div className="module-name">{mod.name}</div>
                  <div className="module-desc">{mod.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="login-system-pulse">
            <div className="pulse-track">
              <span className="pulse-segment is-active" />
              <span className="pulse-segment is-active" />
              <span className="pulse-segment is-active" />
              <span className="pulse-segment is-active" />
              <span className="pulse-segment" />
            </div>
            <span className="pulse-label">All systems operational</span>
          </div>

          <div className="login-insight-panel">
            <div>
              <strong>99.9%</strong>
              <span>Uptime SLA</span>
            </div>
            <div>
              <strong>ISO</strong>
              <span>Ready controls</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Audit visibility</span>
            </div>
          </div>

          <div className="login-compliance-note">
              <FontAwesomeIcon icon={faCircleCheck} style={{ fontSize: '0.6rem', color: '#22c55e' }} />
              <span>SOC 2 Type II Certified</span>
              <span>&bull;</span>
              <span>v5.2.0</span>
          </div>
        </aside>

        <div className="auth-form-section login-auth-panel">
          <header className="auth-header">
            <div className="logo-wrapper">
              <img src={logo} alt="Enterprise Logo" />
              <div className="company-name">MANAGE <span>CORE</span></div>
            </div>
            <div className="auth-kicker">Protected Workspace</div>
            <h2>Welcome back</h2>
            <p>Sign in to continue to your assigned enterprise command center.</p>
          </header>

          <form onSubmit={handleSubmit} noValidate>
            <div className={`corporate-input ${fieldError ? "has-error" : ""}`}>
              <label htmlFor="email">Corporate Email</label>
              <div className="input-group-custom">
                <FontAwesomeIcon icon={faEnvelope} className="icon" />
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (fieldError) setFieldError(""); }}
                  onBlur={(e) => { if (e.target.value && validateEmail(e.target.value)) setFieldError(validateEmail(e.target.value)); }}
                  placeholder="name@organization.com"
                  autoComplete="email"
                  required
                  aria-required="true"
                  aria-invalid={!!fieldError}
                  aria-describedby={fieldError ? "email-error" : undefined}
                />
              </div>
              {fieldError && (
                <div className="field-error" id="email-error" role="alert">
                  <FontAwesomeIcon icon={faTriangleExclamation} /> {fieldError}
                </div>
              )}
            </div>

            <div className="corporate-input">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label htmlFor="password">Secure Password</label>
                <button
                  type="button"
                  className="forgot-link"
                  onClick={() => { setForgotOpen(true); setForgotEmail(email); setForgotSent(false); }}
                  tabIndex="0"
                >
                  Forgot password?
                </button>
              </div>
              <div className="input-group-custom">
                <FontAwesomeIcon icon={faLock} className="icon" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                  autoComplete="current-password"
                  required
                  aria-required="true"
                />
                <button
                  type="button"
                  className="toggle-visibility"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex="-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {capsLockOn && (
                <div className="caps-hint">
                  <FontAwesomeIcon icon={faCircleInfo} /> Caps Lock is on. Passwords are case-sensitive.
                </div>
              )}
            </div>

            <div className="form-options d-flex justify-content-start align-items-center mb-3 ms-4">
              <div className="form-check custom-check">
                <input
                  className="form-check-input shadow-none"
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="rememberMe">
                  Remember my workstation
                </label>
              </div>
            </div>

            {error && (
              <div className="alert-enterprise" role="alert">
                <span className="alert-icon">&#9888;&#65039;</span>
                <span className="alert-message">{error}</span>
              </div>
            )}

            <button
              ref={btnRef}
              type="submit"
              className="btn-enterprise btn-authenticate"
              disabled={submitting}
              aria-live="polite"
              aria-busy={submitting}
              onClick={(e) => {
                // create ripple effect
                const btn = btnRef.current;
                if (btn && !submitting) {
                  const rect = btn.getBoundingClientRect();
                  const span = document.createElement('span');
                  span.className = 'btn-ripple';
                  span.style.left = (e.clientX - rect.left) + 'px';
                  span.style.top = (e.clientY - rect.top) + 'px';
                  btn.appendChild(span);
                  setTimeout(() => { span.remove(); }, 700);
                }
              }}
            >
              {submitting ? (
                              <div className="auth-loading" role="status" aria-live="polite">
                                <svg className="loader-ring" width="36" height="36" viewBox="0 0 50 50" aria-hidden="true">
                                  <circle className="ring-bg" cx="25" cy="25" r="20" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="4" />
                                  <circle className="ring" cx="25" cy="25" r="20" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" />
                                </svg>
                                <div className="loader-text">
                                  <span>Verifying</span>
                                  <span className="ellipsis" aria-hidden="true"><b>.</b><b>.</b><b>.</b></span>
                                </div>
                              </div>
                            ) : (
                              <>
                                <span className="btn-label">Authenticate Session</span>
                                <FontAwesomeIcon icon={faRightToBracket} size="sm" className="btn-icon" />
                              </>
                            )}
            </button>
            <div ref={liveRef} className="visually-hidden" aria-live="polite" aria-atomic="true" />
          </form>

          <div className="auth-demo" aria-label="Demo access">
            <span className="auth-demo-label"><FontAwesomeIcon icon={faKey} /> Quick demo access</span>
            <div className="auth-demo-chips">
              <button type="button" className="auth-demo-chip" onClick={() => handleDemo("admin@managecore.test", "password123")}>
                Admin
              </button>
            </div>
          </div>

          

          <footer className="auth-footer">
            <div className="support-link">
              Need assistance? <a href="#">Contact IT Support</a>
            </div>
            <div className="copyright">
              &copy; 2026 Manage Core Enterprise Management System 
              <br />All rights reserved by Techshinners.
            </div>
          </footer>
        </div>

        {forgotOpen && (
          <div
            className="forgot-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="forgot-title"
            onClick={(e) => { if (e.target === e.currentTarget) setForgotOpen(false); }}
          >
            <div className="forgot-modal">
              <button
                type="button"
                className="forgot-close"
                aria-label="Close"
                onClick={() => setForgotOpen(false)}
              >
                <FontAwesomeIcon icon={faArrowRightLong} />
              </button>
              <div className="forgot-icon">
                <FontAwesomeIcon icon={faKey} />
              </div>
              <h3 id="forgot-title">Reset your password</h3>
              {forgotSent ? (
                <p className="forgot-success">
                  If an account exists for <strong>{forgotEmail.trim()}</strong>, reset instructions have been sent to that inbox. Please check your email and follow the link to continue.
                </p>
              ) : (
                <>
                  <p className="forgot-copy">
                    Enter the corporate email linked to your account and we\u2019ll send you a secure recovery link.
                  </p>
                  <div className="corporate-input">
                    <label htmlFor="forgot-email">Corporate Email</label>
                    <div className="input-group-custom">
                      <FontAwesomeIcon icon={faEnvelope} className="icon" />
                      <input
                        id="forgot-email"
                        type="email"
                        className="form-control"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="name@organization.com"
                        autoComplete="email"
                        autoFocus
                      />
                    </div>
                  </div>
                  <button type="button" className="btn-enterprise" onClick={handleForgotSubmit}>
                    <span>Send Reset Link</span>
                    <FontAwesomeIcon icon={faArrowRightLong} />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
        </div>{/* end enterprise-container-inner */}
      </section>
    </main>
  );
};

export default Login;
