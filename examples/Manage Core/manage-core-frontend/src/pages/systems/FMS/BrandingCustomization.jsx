
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBrush, faPalette, faFont, faImage, faTableCellsLarge,
    faEnvelope, faFileLines, faChartBar, faCheckCircle,
    faSun, faMoon, faCloud, faSliders, faEye, faCode,
    faSitemap, faBuilding, faUserGear, faLaptopCode,
    faLayerGroup, faCircleNodes, faShieldHeart
} from '@fortawesome/free-solid-svg-icons';
import { getTabData } from '../../../api/fms';
import { EnableDisableButton } from '../../../components/common';

const BrandingCustomization = ({ isDark }) => {
    const [themeMode, setThemeMode] = useState('corporate');

    const [glassmorphism, setGlassmorphism] = useState(true);
    const [rounderCorners, setRounderCorners] = useState(true);
    const [compactMode, setCompactMode] = useState(false);

    const [themes, setThemes] = useState([]);
    useEffect(() => { getTabData('branding').then(res => setThemes(res.data?.data || [])).catch(() => {}); }, []);

    const [customizationMetrics, setCustomizationMetrics] = useState([]);
    useEffect(() => { getTabData('branding').then(res => setCustomizationMetrics(res.data?.data || [])).catch(() => {}); }, []);

    return (
        <div className={`p-0 ${isDark ? 'text-white' : 'text-dark'}`} style={{ minHeight: '100vh' }}>
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
                <div>
                    <h2 className="fw-bold mb-1">Branding Customization Center</h2>
                    <p className="text-muted mb-0">Configure visual identity, themes, and company-specific design preferences.</p>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-primary rounded-pill px-4 shadow-sm">
                        <FontAwesomeIcon icon={faEye} className="me-2" />
                        Live Preview
                    </button>
                    <button className="btn btn-outline-secondary rounded-pill px-3 shadow-sm">
                        <FontAwesomeIcon icon={faCode} className="me-2" />
                        Export CSS
                    </button>
                </div>
            </div>

            <div className="row g-4">
                {/* Left Column: Configuration */}
                <div className="col-xl-8">
                    {/* Theme Selector */}
                    <div className={`card border-0 rounded-4 shadow-sm p-4 mb-4 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <h5 className="fw-bold mb-4">Master Theme Configuration</h5>
                        <div className="row g-3">
                            {themes.map(t => (
                                <div key={t.id} className="col-md-3">
                                    <div 
                                        onClick={() => setThemeMode(t.id)}
                                        className={`p-4 rounded-4 border text-center cursor-pointer transition ${themeMode === t.id ? 'border-primary bg-primary bg-opacity-10 ring-2 ring-primary ring-opacity-10' : 'bg-light'}`}
                                    >
                                        <div className="mb-3 rounded-circle p-3 mx-auto shadow-sm" style={{ background: t.color, width: 50, height: 50 }}>
                                            <FontAwesomeIcon icon={t.icon} className={t.id === 'light' ? 'text-warning' : 'text-white'} />
                                        </div>
                                        <div className="fw-bold small">{t.name}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Branding Modules */}
                    <div className="row g-4 mb-4">
                        <div className="col-md-6">
                            <div className={`card border-0 rounded-4 shadow-sm p-4 h-100 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                    <FontAwesomeIcon icon={faPalette} className="text-primary" />
                                    Color Palette
                                </h6>
                                <div className="d-grid gap-3 text-dark">
                                    <div>
                                        <label className="form-label small text-muted text-uppercase fw-bold">Brand Primary</label>
                                        <div className="d-flex gap-2">
                                            <input type="color" className="form-control form-control-color rounded-circle border-0" value="#4f46e5" />
                                            <input type="text" className="form-control rounded-pill bg-light border-0" value="#4f46e5" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="form-label small text-muted text-uppercase fw-bold">Brand Secondary</label>
                                        <div className="d-flex gap-2">
                                            <input type="color" className="form-control form-control-color rounded-circle border-0" value="#10b981" />
                                            <input type="text" className="form-control rounded-pill bg-light border-0" value="#10b981" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className={`card border-0 rounded-4 shadow-sm p-4 h-100 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2">
                                    <FontAwesomeIcon icon={faFont} className="text-primary" />
                                    Typography Settings
                                </h6>
                                <div className="d-grid gap-3 text-dark">
                                    <div>
                                        <label className="form-label small text-muted text-uppercase fw-bold">System Font Family</label>
                                        <select className="form-select rounded-pill bg-light border-0">
                                            <option>Inter (Modern Sans)</option>
                                            <option>Roboto (Standard)</option>
                                            <option>Poppins (Geometric)</option>
                                            <option>Public Sans (Corporate)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="form-label small text-muted text-uppercase fw-bold">Base Font Size</label>
                                        <input type="range" className="form-range" min="12" max="18" step="1" />
                                        <div className="d-flex justify-content-between small text-muted"><span>12px</span><span>16px</span><span>18px</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* UI Components Customizer */}
                    <div className={`card border-0 rounded-4 shadow-sm p-4 ${isDark ? 'bg-dark' : 'bg-white'}`}>
                        <h6 className="fw-bold mb-4 d-flex align-items-center gap-2">
                            <FontAwesomeIcon icon={faSliders} className="text-primary" />
                            Interface Personalization
                        </h6>
                        <div className="row g-4 text-dark">
                            <div className="col-md-4 text-dark">
                                <div className="p-3 rounded-4 bg-light border text-dark">
                                    <EnableDisableButton checked={glassmorphism} onClick={() => setGlassmorphism(!glassmorphism)} label="Glassmorphism" size="small" />
                                    <div className="x-small text-muted ms-2 mt-1">Enable blurred background effects.</div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-3 rounded-4 bg-light border">
                                    <EnableDisableButton checked={rounderCorners} onClick={() => setRounderCorners(!rounderCorners)} label="Rounder Corners" size="small" />
                                    <div className="x-small text-muted ms-2 mt-1">Global border-radius adjustment.</div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-3 rounded-4 bg-light border">
                                    <EnableDisableButton checked={compactMode} onClick={() => setCompactMode(!compactMode)} label="Compact Mode" size="small" />
                                    <div className="x-small text-muted ms-2 mt-1">Reduce spacing for data density.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Preview & Status */}
                <div className="col-xl-4 text-dark">
                    {/* Stats Card */}
                    <div className={`card border-0 rounded-4 shadow-sm p-4 mb-4 ${isDark ? 'bg-dark border-secondary text-white' : 'bg-white text-dark'}`}>
                        <h5 className="fw-bold mb-4">Branding Insights</h5>
                        <div className="d-grid gap-3">
                            {customizationMetrics.map((m, i) => (
                                <div key={i} className="p-3 rounded-4 border bg-light bg-opacity-50">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="rounded-circle p-2 bg-white shadow-sm" style={{ color: m.color }}>
                                            <FontAwesomeIcon icon={m.icon} />
                                        </div>
                                        <div>
                                            <div className="fw-bold h5 mb-0">{m.value}</div>
                                            <div className="x-small text-muted text-uppercase fw-bold" style={{ letterSpacing: '0.5px' }}>{m.label}</div>
                                        </div>
                                    </div>
                                    <div className="mt-2 x-small text-success fw-bold">{m.sub}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Department Level Branding */}
                    <div className={`card border-0 rounded-4 shadow-sm p-4 mb-4 bg-primary text-white`}>
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <div className="rounded-circle bg-white bg-opacity-20 p-3">
                                <FontAwesomeIcon icon={faSitemap} size="xl" />
                            </div>
                            <div>
                                <h6 className="fw-bold mb-0">Multi-Theme Control</h6>
                                <p className="x-small mb-0 opacity-75">Assign themes to departments</p>
                            </div>
                        </div>
                        <div className="small mb-4 opacity-90">Assign custom visual identities for specific business units or regional offices.</div>
                        <button className="btn btn-white w-100 rounded-pill fw-bold">Manage Dept Themes</button>
                    </div>

                    {/* Consistency Check */}
                    <div className="p-4 rounded-4 border border-dashed text-center">
                        <div className="mb-2">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-success" size="2xl" />
                        </div>
                        <h6 className="fw-bold">Visual Integrity Verified</h6>
                        <p className="x-small text-muted mb-0">Theme compliant with corporate identity guidelines V2.4.</p>
                    </div>
                </div>
            </div>

            <style>{`
                .cursor-pointer { cursor: pointer; }
                .transition { transition: all 0.3s ease; }
                .x-small { font-size: 11px; }
                .border-dashed { border-style: dashed !important; border-width: 2px !important; }
            `}</style>
        </div>
    );
};

export default BrandingCustomization;
