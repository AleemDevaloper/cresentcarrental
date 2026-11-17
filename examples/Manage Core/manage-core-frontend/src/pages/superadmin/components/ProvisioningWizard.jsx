import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUsers, faFileInvoiceDollar, faSlidersH, 
  faDatabase, faCogs, faToggleOn, faToggleOff, 
  faCheckCircle, faArrowRight, faArrowLeft,
  faBuilding, faGlobe, faEnvelope, faPhone, faMapMarkerAlt,
  faCalendarAlt
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";

const ProvisioningWizard = ({ 
  step, 
  setStep, 
  selectedModules, 
  setSelectedModules, 
  quotaSettings, 
  setQuotaSettings, 
  isProvisioning, 
  provisionProgress, 
  onExecute,
  isDark,
  companies,
  selectedCompanyId,
  setSelectedCompanyId,
  plans
}) => {

  const selectedCompany = companies.find(c => c.id === selectedCompanyId) || null;
  const [selectedPlanId, setSelectedPlanId] = React.useState(plans[1]?.id || 'Pro');

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0
    })
  };

  const [[currentStep, direction], setStepWithDirection] = React.useState([step, 0]);

  React.useEffect(() => {
    setStepWithDirection([step, step > currentStep ? 1 : -1]);
  }, [step]);

  return (
    <div className={`card border-0 shadow-lg p-0 rounded-4 mt-4 overflow-hidden ${isDark ? 'bg-dark-card border-white border-opacity-10' : 'bg-white'}`}
      style={{
        background: isDark ? 'rgba(30, 41, 59, 0.8)' : '#ffffff',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="card-header border-0 bg-primary bg-opacity-10 p-4 d-flex justify-content-between align-items-center">
        <div>
          <h5 className="fw-black mb-0 text-primary">Company Provisioning Wizard</h5>
          <p className="text-muted small mb-0">Assign modules and resources to an existing organization.</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-primary bg-opacity-25 text-primary px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '11px' }}>
            Step {step} of 3
          </span>
        </div>
      </div>

      <div className="card-body p-4 p-lg-5">
        {/* Progress Stepper */}
        <div className="position-relative mb-5 px-3">
          <div className="progress" style={{ height: '6px', borderRadius: '10px' }}>
            <motion.div 
              className="progress-bar bg-primary" 
              initial={{ width: 0 }}
              animate={{ width: `${((step - 1) / 2) * 100}%` }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          </div>
          <div className="position-absolute w-100 top-50 start-0 translate-middle-y d-flex justify-content-between px-3">
            {[1, 2, 3].map(s => (
              <motion.div 
                key={s} 
                className={`rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm ${step >= s ? 'bg-primary text-white' : 'bg-light border text-muted'}`} 
                style={{ width: '32px', height: '32px', fontSize: '12px', zIndex: 1 }}
                animate={{ scale: step === s ? 1.2 : 1 }}
              >
                {step > s ? <FontAwesomeIcon icon={faCheckCircle} /> : s}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="min-vh-40 overflow-hidden position-relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            >
              {isProvisioning ? (
                <div className="text-center py-5 space-y-4">
                  <div className="spinner-border text-primary" role="status" style={{ width: '4rem', height: '4rem', borderWidth: '0.3em' }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h4 className="fw-black mt-4">Provisioning Tenant Infrastructure...</h4>
                  <div className="progress mx-auto" style={{ width: '60%', height: '8px', borderRadius: '10px' }}>
                    <div className="progress-bar progress-bar-striped progress-bar-animated bg-success" style={{ width: `${provisionProgress}%` }}></div>
                  </div>
                  <p className="text-muted mt-3">Initializing database schemas, setting up storage buckets, and generating SSL certificates.</p>
                </div>
              ) : (
                <>
                  {step === 1 && (
                    <div className="space-y-4">
                      <h6 className="fw-bold text-dark-emphasis mb-4 flex align-items-center gap-2">
                        <span className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', fontSize: '12px' }}>1</span>
                        Select Organization
                      </h6>
                      <p className="text-muted small mb-4">Choose a registered organization to provision tenant infrastructure for.</p>

                      <div className="row g-4">
                        <div className="col-12">
                          <label className="form-label small fw-bold text-muted uppercase">Organization</label>
                          <select
                            className="form-select form-select-lg border-0 bg-light rounded-3"
                            value={selectedCompanyId || ''}
                            onChange={(e) => setSelectedCompanyId(e.target.value ? parseInt(e.target.value) : null)}
                          >
                            <option value="">-- Select a company --</option>
                            {companies.map(c => (
                              <option key={c.id} value={c.id}>{c.companyName}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {selectedCompany && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 p-4 rounded-4 bg-primary bg-opacity-5 border border-primary border-opacity-20"
                        >
                          <h6 className="fw-bold mb-3 flex align-items-center gap-2">
                            <FontAwesomeIcon icon={faBuilding} className="text-primary" />
                            Company Details
                          </h6>
                          <div className="row g-3">
                            <div className="col-md-4 d-flex align-items-center gap-2">
                              <FontAwesomeIcon icon={faBuilding} className="text-muted" style={{ width: '16px' }} />
                              <div>
                                <small className="text-muted d-block" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Company</small>
                                <span className="fw-bold small">{selectedCompany.companyName}</span>
                              </div>
                            </div>
                            <div className="col-md-4 d-flex align-items-center gap-2">
                              <FontAwesomeIcon icon={faGlobe} className="text-muted" style={{ width: '16px' }} />
                              <div>
                                <small className="text-muted d-block" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subdomain</small>
                                <span className="fw-bold small">{selectedCompany.subdomain || '—'}</span>
                              </div>
                            </div>
                            <div className="col-md-4 d-flex align-items-center gap-2">
                              <FontAwesomeIcon icon={faEnvelope} className="text-muted" style={{ width: '16px' }} />
                              <div>
                                <small className="text-muted d-block" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</small>
                                <span className="fw-bold small">{selectedCompany.email || '—'}</span>
                              </div>
                            </div>
                            <div className="col-md-4 d-flex align-items-center gap-2">
                              <FontAwesomeIcon icon={faPhone} className="text-muted" style={{ width: '16px' }} />
                              <div>
                                <small className="text-muted d-block" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone</small>
                                <span className="fw-bold small">{selectedCompany.phone || '—'}</span>
                              </div>
                            </div>
                            <div className="col-md-4 d-flex align-items-center gap-2">
                              <FontAwesomeIcon icon={faMapMarkerAlt} className="text-muted" style={{ width: '16px' }} />
                              <div>
                                <small className="text-muted d-block" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Address</small>
                                <span className="fw-bold small">{selectedCompany.address || '—'}</span>
                              </div>
                            </div>
                            <div className="col-md-4 d-flex align-items-center gap-2">
                              <FontAwesomeIcon icon={faCalendarAlt} className="text-muted" style={{ width: '16px' }} />
                              <div>
                                <small className="text-muted d-block" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fiscal Year Start</small>
                                <span className="fw-bold small">{selectedCompany.fiscalStartMonth || '—'}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <h6 className="fw-bold text-dark-emphasis mb-4 flex align-items-center gap-2">
                        <span className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', fontSize: '12px' }}>2</span>
                        Module Infrastructure
                      </h6>
                      <p className="text-muted small mb-4">Select the modular services to provision for this organization.</p>
                      <div className="row g-3">
                        {[
                          { id: 'HRMS', name: 'HR Management', desc: 'Payroll, Leave, Recruitment', color: 'primary', icon: faUsers },
                          { id: 'FMS', name: 'Financial Control', desc: 'Accounts, VAT, Invoicing', color: 'success', icon: faFileInvoiceDollar },
                          { id: 'PMS', name: 'Project Center', desc: 'Sprints, Risk, Budgets', color: 'info', icon: faSlidersH },
                          { id: 'DMS', name: 'Document Vault', desc: 'Secure Encryption, Storage', color: 'warning', icon: faDatabase },
                          { id: 'TMS', name: 'Task Board', desc: 'Time logs, Workspaces', color: 'danger', icon: faCogs }
                        ].map(sys => (
                          <div className="col-md-4" key={sys.id}>
                            <motion.div 
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`card p-3 border-2 transition-all h-100 ${selectedModules[sys.id] ? 'border-primary bg-primary bg-opacity-25' : 'bg-transparent border-light'}`} 
                              style={{ cursor: 'pointer' }} 
                              onClick={() => setSelectedModules({...selectedModules, [sys.id]: !selectedModules[sys.id]})}
                            >
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <div className="d-flex align-items-center gap-2">
                                  <div className={`rounded-circle p-2 bg-${sys.color} bg-opacity-10 text-${sys.color}`} style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FontAwesomeIcon icon={sys.icon} size="sm" />
                                  </div>
                                  <span className="fw-bold small">{sys.id}</span>
                                </div>
                                <FontAwesomeIcon icon={selectedModules[sys.id] ? faToggleOn : faToggleOff} className={`fs-4 ${selectedModules[sys.id] ? 'text-primary' : 'text-muted'}`} />
                              </div>
                              <p className="text-muted mb-0" style={{ fontSize: '11px' }}>{sys.desc}</p>
                            </motion.div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                      <h6 className="fw-bold text-dark-emphasis mb-4 flex align-items-center gap-2">
                        <span className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px', fontSize: '12px' }}>3</span>
                        Plans & Licensing
                      </h6>
                      <p className="text-muted small mb-4">Select a billing plan for this organization. The resource limits will be pre-configured based on the plan.</p>

                      <div className="row g-3 mb-4">
                        {plans.map(plan => (
                          <div className="col-md-4" key={plan.id}>
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`card p-4 border-2 transition-all h-100 ${selectedPlanId === plan.id ? 'border-primary bg-primary bg-opacity-25 shadow-sm' : 'bg-transparent border-light'}`}
                              style={{ cursor: 'pointer', borderRadius: '16px' }}
                              onClick={() => {
                                setSelectedPlanId(plan.id);
                                setQuotaSettings({
                                  maxUsers: plan.users || 100,
                                  maxStorage: plan.storage || 500,
                                  maxApi: plan.apiLimit || 250000
                                });
                              }}
                            >
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                  <h6 className="fw-bold mb-1">{plan.name}</h6>
                                  <span className="badge bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-pill" style={{ fontSize: '10px' }}>{plan.cycle}</span>
                                </div>
                                <div className="text-end">
                                  <span className="fw-black fs-4 text-primary">${plan.price}</span>
                                  <small className="text-muted d-block" style={{ fontSize: '10px' }}>/{plan.cycle.toLowerCase()}</small>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="d-flex justify-content-between small">
                                  <span className="text-muted">Max Users</span>
                                  <span className="fw-bold">{plan.users?.toLocaleString() || '—'}</span>
                                </div>
                                <div className="d-flex justify-content-between small">
                                  <span className="text-muted">Storage</span>
                                  <span className="fw-bold">{plan.storage || 0} GB</span>
                                </div>
                                <div className="d-flex justify-content-between small">
                                  <span className="text-muted">Daily API Limit</span>
                                  <span className="fw-bold">{(plan.apiLimit || 0).toLocaleString()}</span>
                                </div>
                                <div className="d-flex justify-content-between small">
                                  <span className="text-muted">Grace Period</span>
                                  <span className="fw-bold">{plan.gracePeriod || 0} days</span>
                                </div>
                              </div>
                              {selectedPlanId === plan.id && (
                                <div className="mt-3 pt-3 border-top border-light d-flex align-items-center gap-2 text-primary small fw-bold">
                                  <FontAwesomeIcon icon={faCheckCircle} /> Selected
                                </div>
                              )}
                            </motion.div>
                          </div>
                        ))}
                      </div>

                      <div className="row g-4 mb-4 p-4 bg-light rounded-4">
                        <h6 className="fw-bold mb-3 small text-muted uppercase tracking-wider">Fine-tune Resource Limits</h6>
                        <div className="col-md-4">
                          <label className="form-label small fw-bold text-muted uppercase">Max Users: <span className="text-primary">{quotaSettings.maxUsers}</span></label>
                          <input type="range" className="form-range custom-range" min="10" max="5000" step="10" value={quotaSettings.maxUsers} onChange={(e) => setQuotaSettings({...quotaSettings, maxUsers: parseInt(e.target.value)})} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label small fw-bold text-muted uppercase">Storage (GB): <span className="text-primary">{quotaSettings.maxStorage}</span></label>
                          <input type="range" className="form-range custom-range" min="5" max="5000" step="25" value={quotaSettings.maxStorage} onChange={(e) => setQuotaSettings({...quotaSettings, maxStorage: parseInt(e.target.value)})} />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label small fw-bold text-muted uppercase">Daily API Hits: <span className="text-primary">{quotaSettings.maxApi.toLocaleString()}</span></label>
                          <input type="range" className="form-range custom-range" min="5000" max="5000000" step="5000" value={quotaSettings.maxApi} onChange={(e) => setQuotaSettings({...quotaSettings, maxApi: parseInt(e.target.value)})} />
                        </div>
                      </div>

                      <div className="p-4 bg-warning bg-opacity-10 rounded-4 border border-warning border-opacity-20">
                        <div className="d-flex gap-3">
                          <FontAwesomeIcon icon={faBuilding} className="text-warning fs-4" />
                          <div>
                            <span className="fw-black text-warning uppercase tracking-wider d-block mb-1" style={{ fontSize: '10px' }}>Provisioning Notice</span>
                            <p className="text-muted small mb-0">This will provision a new tenant cluster for <strong>{selectedCompany?.companyName || 'the selected organization'}</strong> with the configured modules and quotas. This action is recorded in the global audit log.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {!isProvisioning && (
          <div className="mt-5 d-flex justify-content-between">
            <button 
              className={`btn btn-lg rounded-pill px-4 fw-bold transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'btn-outline-secondary'}`} 
              onClick={() => setStep(step - 1)}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
            </button>
            
            {step < 3 ? (
              <button 
                className="btn btn-lg btn-primary rounded-pill px-5 fw-bold hover-lift shadow-sm" 
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && !selectedCompanyId}
              >
                Next <FontAwesomeIcon icon={faArrowRight} className="ms-2" />
              </button>
            ) : (
              <button 
                className="btn btn-lg btn-success rounded-pill px-5 fw-black hover-lift shadow-lg" 
                onClick={onExecute}
              >
                Execute Provisioning <FontAwesomeIcon icon={faCheckCircle} className="ms-2" />
              </button>
            )}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .min-vh-40 { min-height: 320px; }
        .custom-range::-webkit-slider-thumb {
          background: #4f46e5;
          border: 3px solid #fff;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .uppercase { text-transform: uppercase; }
        .tracking-wider { letter-spacing: 0.1em; }
        .fw-black { font-weight: 900; }
      `}} />
    </div>
  );
};

export default ProvisioningWizard;
