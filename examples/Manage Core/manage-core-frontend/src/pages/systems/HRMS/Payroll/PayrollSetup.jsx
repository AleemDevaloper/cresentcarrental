import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPlus, 
  faWallet, 
  faCalculator, 
  faSitemap, 
  faPercent, 
  faMoneyBillTrendUp,
  faBuildingColumns,
  faEdit,
  faTrash,
  faSave,
  faScaleBalanced
} from "@fortawesome/free-solid-svg-icons";
import { useApp } from "../../../../hooks/useApp";
import { 
  listPayrollComponents, 
  createPayrollComponent, 
  listPayrollStructures, 
  createPayrollStructure,
  listTaxSlabs,
  createTaxSlab 
} from "../../../../api/hrms";
import { EnableDisableButton } from "../../../../components/common";

const PayrollSetup = () => {
  const { addNotification, theme } = useApp();
  const [components, setComponents] = useState([]);
  const [structures, setStructures] = useState([]);
  const [taxSlabs, setTaxSlabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("components");
  const isDark = theme === "dark";
  
  const [showComponentModal, setShowComponentModal] = useState(false);
  const [showSlabModal, setShowSlabModal] = useState(false);
  
  const [compFormData, setCompFormData] = useState({
    name: "",
    type: "earning",
    is_fixed: true,
    calculation_type: "flat",
    percentage_of: "",
    value: 0,
    is_taxable: true,
    is_statutory: false
  });

  const [slabFormData, setSlabFormData] = useState({
    income_from: "",
    income_to: "",
    fixed_tax: 0,
    percentage: 0
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [compRes, structRes, slabRes] = await Promise.all([
        listPayrollComponents(),
        listPayrollStructures(),
        listTaxSlabs()
      ]);
      setComponents(compRes);
      setStructures(structRes);
      setTaxSlabs(slabRes);
    } catch (err) {
      addNotification("Failed to fetch payroll data", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleComponentSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPayrollComponent(compFormData);
      addNotification("Salary component created", "success");
      setShowComponentModal(false);
      fetchData();
    } catch (err) {
      addNotification("Error creating component", "danger");
    }
  };

  const handleSlabSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTaxSlab(slabFormData);
      addNotification("Tax slab added", "success");
      setShowSlabModal(false);
      fetchData();
    } catch (err) {
      addNotification("Error creating tax slab", "danger");
    }
  };

  return (
    <div className="p-3 p-lg-4 animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Payroll Configuration</h4>
          <p className="text-muted small mb-0">Define salary components, structures, and statutory tax rules</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={`card border-0 shadow-sm rounded-4 mb-4 overflow-hidden ${isDark ? 'bg-dark border-1 border-secondary' : ''}`}>
        <div className="card-header bg-transparent p-0 border-0">
          <div className="d-flex border-bottom overflow-auto">
            <button 
              className={`btn border-0 rounded-0 px-4 py-3 fw-bold small whitespace-nowrap ${activeTab === 'components' ? 'btn-primary bg-primary text-white' : 'text-muted'}`}
              onClick={() => setActiveTab('components')}
            >
              <FontAwesomeIcon icon={faCalculator} className="me-2" /> Salary Components
            </button>
            <button 
              className={`btn border-0 rounded-0 px-4 py-3 fw-bold small whitespace-nowrap ${activeTab === 'structures' ? 'btn-primary bg-primary text-white' : 'text-muted'}`}
              onClick={() => setActiveTab('structures')}
            >
              <FontAwesomeIcon icon={faSitemap} className="me-2" /> Salary Structures
            </button>
            <button 
              className={`btn border-0 rounded-0 px-4 py-3 fw-bold small whitespace-nowrap ${activeTab === 'tax' ? 'btn-primary bg-primary text-white' : 'text-muted'}`}
              onClick={() => setActiveTab('tax')}
            >
              <FontAwesomeIcon icon={faScaleBalanced} className="me-2" /> Tax Slabs
            </button>
          </div>
        </div>

        <div className="card-body p-4">
          {activeTab === 'components' && (
            <div className="animate-fade-in">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0 text-dark-emphasis">Earnings & Deductions</h5>
                <button className="btn btn-primary btn-sm rounded-3 px-3" onClick={() => setShowComponentModal(true)}>
                  <FontAwesomeIcon icon={faPlus} className="me-2" /> Add Component
                </button>
              </div>

              <div className="row g-3">
                {components.map(comp => (
                  <div key={comp.id} className="col-md-6 col-lg-4">
                    <div className={`card border-0 shadow-sm rounded-4 border-start border-4 ${isDark ? 'bg-secondary bg-opacity-10' : ''} ${comp.type === 'earning' ? 'border-success' : 'border-danger'}`}>
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="fw-bold mb-0">{comp.name}</h6>
                          <span className={`badge rounded-pill x-small ${comp.type === 'earning' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                            {comp.type}
                          </span>
                        </div>
                        <p className="x-small text-muted mb-3">
                          {comp.calculation_type === 'percentage' ? `${comp.value}% of ${comp.parent_component?.name || 'Basic'}` : `Flat Amount: ${comp.value}`}
                        </p>
                        <div className="d-flex gap-2">
                          <span className="badge bg-light text-muted x-small border">{comp.is_taxable ? 'Taxable' : 'Non-Taxable'}</span>
                          {comp.is_statutory && <span className="badge bg-info-subtle text-info x-small border">Statutory</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'structures' && (
            <div className="animate-fade-in">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0 text-dark-emphasis">Pay Grades & Structures</h5>
                <button className="btn btn-primary btn-sm rounded-3 px-3">
                  <FontAwesomeIcon icon={faPlus} className="me-2" /> Create Structure
                </button>
              </div>
              <div className="row g-3">
                {structures.map(struct => (
                  <div key={struct.id} className="col-md-6">
                    <div className={`card border shadow-sm rounded-4 h-100 ${isDark ? 'bg-secondary bg-opacity-10' : ''}`}>
                      <div className="card-body p-4">
                        <h6 className="fw-bold mb-2">{struct.name}</h6>
                        <p className="small text-muted mb-4">{struct.description || 'No description provided'}</p>
                        <div className="d-flex flex-wrap gap-2">
                          {struct.components?.map(c => (
                            <span key={c.id} className="badge bg-light text-primary border x-small">{c.name}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tax' && (
            <div className="animate-fade-in">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0 text-dark-emphasis">Income Tax Slabs (Yearly)</h5>
                <button className="btn btn-primary btn-sm rounded-3 px-3" onClick={() => setShowSlabModal(true)}>
                  <FontAwesomeIcon icon={faPlus} className="me-2" /> Add Slab
                </button>
              </div>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="bg-light">
                        <tr className="small text-muted text-uppercase">
                            <th>Income From</th>
                            <th>Income To</th>
                            <th>Fixed Tax</th>
                            <th>Percentage</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {taxSlabs.map(slab => (
                            <tr key={slab.id}>
                                <td className="small fw-bold">{slab.income_from.toLocaleString()}</td>
                                <td className="small fw-bold">{slab.income_to ? slab.income_to.toLocaleString() : 'Infinity'}</td>
                                <td className="small text-danger fw-bold">{slab.fixed_tax.toLocaleString()}</td>
                                <td className="small text-primary fw-bold">{slab.percentage}%</td>
                                <td><span className="badge bg-success-subtle text-success rounded-pill x-small">Active</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Component Modal */}
      {showComponentModal && (
        <div className="modal show d-block animate-fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content border-0 shadow-lg rounded-4 overflow-hidden ${isDark ? 'bg-dark text-white' : ''}`}>
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold">New Salary Component</h5>
                <button type="button" className="btn-close" onClick={() => setShowComponentModal(false)}></button>
              </div>
              <form onSubmit={handleComponentSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">Component Name</label>
                      <input type="text" className="form-control rounded-3" required value={compFormData.name} onChange={e => setCompFormData({...compFormData, name: e.target.value})} placeholder="e.g. Basic Salary, HRA" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Type</label>
                      <select className="form-select rounded-3" value={compFormData.type} onChange={e => setCompFormData({...compFormData, type: e.target.value})}>
                        <option value="earning">Earning</option>
                        <option value="deduction">Deduction</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Calculation</label>
                      <select className="form-select rounded-3" value={compFormData.calculation_type} onChange={e => setCompFormData({...compFormData, calculation_type: e.target.value})}>
                        <option value="flat">Flat Amount</option>
                        <option value="percentage">Percentage (%)</option>
                      </select>
                    </div>
                    {compFormData.calculation_type === 'percentage' && (
                        <div className="col-12">
                            <label className="small fw-bold text-muted mb-2">Percentage Of</label>
                            <select className="form-select rounded-3" value={compFormData.percentage_of} onChange={e => setCompFormData({...compFormData, percentage_of: e.target.value})}>
                                <option value="">Basic Salary</option>
                                {components.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    )}
                    <div className="col-12">
                      <label className="small fw-bold text-muted mb-2">Value ({compFormData.calculation_type === 'percentage' ? '%' : 'Amt'})</label>
                      <input type="number" className="form-control rounded-3" required value={compFormData.value} onChange={e => setCompFormData({...compFormData, value: e.target.value})} />
                    </div>
                    <div className="col-6">
                      <div className="mt-2">
                        <EnableDisableButton
                          checked={compFormData.is_taxable}
                          onClick={() => setCompFormData({...compFormData, is_taxable: !compFormData.is_taxable})}
                          label="Is Taxable"
                        />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="mt-2">
                        <EnableDisableButton
                          checked={compFormData.is_statutory}
                          onClick={() => setCompFormData({...compFormData, is_statutory: !compFormData.is_statutory})}
                          label="Is Statutory"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowComponentModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4 shadow-sm">
                    <FontAwesomeIcon icon={faSave} className="me-2" /> Save Component
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tax Slab Modal */}
      {showSlabModal && (
        <div className="modal show d-block animate-fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content border-0 shadow-lg rounded-4 overflow-hidden ${isDark ? 'bg-dark text-white' : ''}`}>
              <div className="modal-header border-0 p-4 pb-0">
                <h5 className="fw-bold">Add Yearly Tax Slab</h5>
                <button type="button" className="btn-close" onClick={() => setShowSlabModal(false)}></button>
              </div>
              <form onSubmit={handleSlabSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Income From</label>
                      <input type="number" className="form-control rounded-3" required value={slabFormData.income_from} onChange={e => setSlabFormData({...slabFormData, income_from: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Income To</label>
                      <input type="number" className="form-control rounded-3" value={slabFormData.income_to} onChange={e => setSlabFormData({...slabFormData, income_to: e.target.value})} placeholder="Leave empty for infinity" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Fixed Tax Amount</label>
                      <input type="number" className="form-control rounded-3" required value={slabFormData.fixed_tax} onChange={e => setSlabFormData({...slabFormData, fixed_tax: e.target.value})} />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Percentage (%)</label>
                      <input type="number" step="0.01" className="form-control rounded-3" required value={slabFormData.percentage} onChange={e => setSlabFormData({...slabFormData, percentage: e.target.value})} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowSlabModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4 shadow-sm">
                    <FontAwesomeIcon icon={faSave} className="me-2" /> Save Slab
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollSetup;
