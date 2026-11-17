import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, faFileInvoice, faChartLine, faShareAlt, faBoxes, faUtensils, 
  faGraduationCap, faShoppingBag, faCode, faSearchDollar, faBullhorn, 
  faAd, faLaptopCode, faPenNib, faBrain, faRobot, faCheckCircle, 
  faArrowRight, faGlobe, faTrophy, faHandshake, faLightbulb,
  faLayerGroup, faCogs, faInfinity
} from '@fortawesome/free-solid-svg-icons';

const PRODUCTS = [
  { title: "HRMS", desc: "Automated payroll, recruitment, and employee management.", icon: faUsers, color: "#6366f1" },
  { title: "DMS", desc: "Secure cloud-based document versioning and storage.", icon: faFileInvoice, color: "#0ea5e9" },
  { title: "Financial", desc: "Advanced enterprise-grade accounting and auditing.", icon: faChartLine, color: "#10b981" },
  { title: "Social Media", desc: "Integrated multi-platform social engagement suite.", icon: faShareAlt, color: "#f43f5e" },
  { title: "Inventory", desc: "AI-driven stock management and supply chain tracking.", icon: faBoxes, color: "#f59e0b" },
  { title: "Restaurant", desc: "Full-stack POS and kitchen automation solutions.", icon: faUtensils, color: "#ef4444" },
  { title: "Education", desc: "Smart LMS for streamlined academic operations.", icon: faGraduationCap, color: "#8b5cf6" },
  { title: "Ecommerce", desc: "High-conversion multi-vendor marketplace engines.", icon: faShoppingBag, color: "#ec4899" }
];

const SERVICES = [
  { title: "Web Dev", icon: faCode, items: ["Full-stack", "PWA", "UI/UX"] },
  { title: "SEO", icon: faSearchDollar, items: ["Audit", "On-Page", "Links"] },
  { title: "Digital Marketing", icon: faBullhorn, items: ["Social", "Email", "Growth"] },
  { title: "Paid Ads", icon: faAd, items: ["Google", "Facebook", "Retargeting"] },
  { title: "Software", icon: faLaptopCode, items: ["Custom", "API", "Cloud"] },
  { title: "Content", icon: faPenNib, items: ["Copy", "Blogs", "Tech"] },
  { title: "AI/ML", icon: faBrain, items: ["NLP", "Vision", "Predictive"] },
  { title: "Automation", icon: faRobot, items: ["Bots", "RPA", "Workflows"] }
];

const STATS = [
  { val: "250+", label: "Projects Delivered", icon: faLayerGroup },
  { val: "150+", label: "Global Clients", icon: faGlobe },
  { val: "15+", label: "Industry Awards", icon: faTrophy },
  { val: "99%", label: "Client Retention", icon: faHandshake }
];

const PROCESS = [
  { step: "01", title: "Discovery", desc: "In-depth analysis of your business needs and market gaps.", icon: faSearchDollar },
  { step: "02", title: "Strategy", desc: "Crafting a custom roadmap focused on ROI and scalability.", icon: faLightbulb },
  { step: "03", title: "Execution", desc: "Agile development and precise marketing implementation.", icon: faCogs },
  { step: "04", title: "Optimization", desc: "Continuous monitoring, reporting, and performance tuning.", icon: faInfinity }
];

const ProductServices = () => {
  return (
    <div className="ps-page" style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      
      {/* Premium Hero */}
      <section className="ps-hero text-white position-relative overflow-hidden">
        <div className="ps-hero-bg"></div>
        <div className="container position-relative py-lg-5 py-2">
          <div className="row align-items-center g-5 py-3">
            <div className="col-lg-7 text-center text-lg-start">
              <div className="badge border border-primary text-primary-light px-3 py-2 rounded-pill mb-3 fw-bold animate-fade-in">
                TRANSFORMING BUSINESSES THROUGH TECH
              </div>
              <h1 className="display-2 fw-bold mb-4 animate-slide-up">
                Future-Ready <br className="d-none d-md-block" />
                <span className="text-gradient">Solutions & Growth</span>
              </h1>
              <p className="lead mb-5 opacity-75 fs-4 animate-slide-up-delay">
                We empower enterprises with high-end software products and results-driven tech services. From design to deployment to global marketing.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start animate-slide-up-delay-2">
                <button className="btn btn-primary btn-lg px-5 py-3 rounded-pill shadow-lg border-0">View Solutions</button>
                <button className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill">Start a Project</button>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-block">
              <div className="hero-visual">
                <div className="floating-blob"></div>
                
                {/* Main Glass Card */}
                <div className="floating-card glass-morphism p-4 text-white">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-success rounded-circle p-2 me-3 shadow-sm"><FontAwesomeIcon icon={faCheckCircle} /></div>
                    <div className="fw-bold">Real-time Analytics</div>
                  </div>
                  <div className="stat-bars">
                    <div className="bar mb-2"><div className="bar-fill" style={{ width: '90%' }}></div></div>
                    <div className="bar"><div className="bar-fill" style={{ width: '75%' }}></div></div>
                  </div>
                </div>

                {/* Glass Card 2 - Global Reach */}
                <div className="floating-card-2 glass-morphism p-3 text-white animate-float-delayed">
                  <div className="d-flex align-items-center">
                    <div className="bg-info rounded-3 p-2 me-3 shadow-sm"><FontAwesomeIcon icon={faGlobe} /></div>
                    <div>
                      <div className="small opacity-75">Global Presence</div>
                      <div className="fw-bold">150+ Nodes</div>
                    </div>
                  </div>
                </div>

                {/* Glass Card 3 - AI Status */}
                <div className="floating-card-3 glass-morphism p-3 text-white animate-float-reverse">
                  <div className="d-flex align-items-center">
                    <div className="bg-warning rounded-pill p-2 me-3 shadow-sm"><FontAwesomeIcon icon={faRobot} /></div>
                    <div>
                      <div className="small opacity-75">AI Processing</div>
                      <div className="fw-bold">Active Bots</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mt-5">
        {/* Stats Section */}
        <section className="stats-row row g-4 mb-5 pb-5">
          {STATS.map((s, i) => (
            <div key={i} className="col-lg-3 col-6">
              <div className="stat-card p-4 text-center rounded-4 shadow-sm bg-white h-100">
                <div className="text-primary mb-3"><FontAwesomeIcon icon={s.icon} size="2x" /></div>
                <h2 className="fw-bold mb-1">{s.val}</h2>
                <div className="text-muted small fw-semibold uppercase">{s.label}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Products Section */}
        <section className="section-padding mb-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3" style={{ color: 'var(--text-primary)' }}>Our Product Ecosystem</h2>
            <p className="text-muted mx-auto fs-5" style={{ maxWidth: '700px' }}>Comprehensive enterprise tools designed to handle every facet of your business operations.</p>
          </div>
          <div className="row g-4">
            {PRODUCTS.map((p, i) => (
              <div key={i} className="col-xl-3 col-lg-4 col-md-6">
                <div className="product-card h-100 bg-white border-0 p-4 rounded-4 transition-all">
                  <div className="icon-circle mb-4" style={{ backgroundColor: `${p.color}15`, color: p.color }}>
                    <FontAwesomeIcon icon={p.icon} size="lg" />
                  </div>
                  <h4 className="fw-bold mb-2">{p.title}</h4>
                  <p className="text-secondary small mb-4">{p.desc}</p>
                  <button className="btn btn-link p-0 text-primary text-decoration-none fw-bold">
                    Learn More <FontAwesomeIcon icon={faArrowRight} className="ms-1 small" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Services Section */}
        <section className="services-section py-5 my-5 px-lg-5 rounded-5 shadow-lg overflow-hidden position-relative" style={{ background: '#fff' }}>
          <div className="row mb-5 align-items-end">
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold mb-0">Professional Tech Services</h2>
              <div className="bg-primary mt-3" style={{ width: '60px', height: '4px' }}></div>
            </div>
            <div className="col-lg-6 mt-3 mt-lg-0">
              <p className="text-muted fs-5">We provide a full spectrum of digital services to keep your business ahead of the curve.</p>
            </div>
          </div>
          <div className="row g-4">
            {SERVICES.map((s, i) => (
              <div key={i} className="col-xl-3 col-md-6">
                <div className="service-card p-4 rounded-4 h-100 transition-all border">
                  <div className="d-flex align-items-center mb-3">
                    <div className="text-primary me-3"><FontAwesomeIcon icon={s.icon} size="lg" /></div>
                    <h5 className="fw-bold mb-0">{s.title}</h5>
                  </div>
                  <ul className="list-unstyled mb-0 ps-1">
                    {s.items.map((item, idx) => (
                      <li key={idx} className="small text-secondary mb-2">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-success me-2 x-small" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Process Section */}
        <section className="process-section py-5 mb-5">
            <div className="text-center mb-5">
                <h2 className="display-5 fw-bold mb-3">Strategic Delivery Process</h2>
                <p className="text-muted">How we take your idea from concept to a market-leading reality.</p>
            </div>
            <div className="row g-4">
                {PROCESS.map((p, i) => (
                    <div key={i} className="col-lg-3 col-md-6">
                        <div className="process-step text-center position-relative">
                            <div className="step-num">{p.step}</div>
                            <div className="icon-wrapper mb-4 text-primary bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto" style={{ width: '80px', height: '80px' }}>
                                <FontAwesomeIcon icon={p.icon} size="2x" />
                            </div>
                            <h4 className="fw-bold mb-2">{p.title}</h4>
                            <p className="text-secondary px-3">{p.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Final CTA */}
        <section className="cta-banner rounded-5 p-5 text-center text-white shadow-lg overflow-hidden position-relative mt-5">
          <div className="cta-overlay"></div>
          <div className="position-relative z-1">
            <h2 className="display-4 fw-bold mb-4">Launch Your Next Success Story</h2>
            <p className="lead mb-5 opacity-75 mx-auto" style={{ maxWidth: '800px' }}>Whether you need a custom system or a global marketing strategy, we have the expertise to deliver excellence.</p>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              <button className="btn btn-white btn-lg px-5 py-3 rounded-pill fw-bold text-primary">Get Started Now</button>
              <button className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill fw-bold">Contact Sales</button>
            </div>
          </div>
        </section>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --primary-gradient: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          --dark-gradient: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        }

        .ps-hero {
          min-height: 80vh;
          background: var(--dark-gradient);
          border-radius: 0 0 80px 80px;
          display: flex;
          align-items: center;
        }

        .ps-hero-bg {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          opacity: 0.1;
          background-image: radial-gradient(#fff 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .text-gradient {
          background: linear-gradient(to right, #818cf8, #c084fc);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .glass-morphism {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
        }

        .hero-visual {
          position: relative;
          height: 400px;
        }

        .floating-blob {
          position: absolute;
          width: 350px;
          height: 350px;
          background: var(--primary-gradient);
          filter: blur(80px);
          opacity: 0.3;
          animation: pulse 10s infinite;
        }

        .floating-card {
          position: absolute;
          top: 100px;
          right: 0;
          width: 300px;
          z-index: 2;
          animation: float 6s ease-in-out infinite;
        }

        .floating-card-2 {
          position: absolute;
          right: 200px;
          width: 300px;
          z-index: 2;
          animation: float 6s ease-in-out infinite;
        }

        .floating-card-3 {
          position: absolute;
          top: 250px;
          right: 150px;
          width: 300px;
          z-index: 2;
          animation: float 6s ease-in-out infinite;
        }

        .stat-card:hover, .product-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important;
        }

        .icon-circle {
          width: 60px;
          height: 60px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .service-card:hover {
          border-color: #4f46e5 !important;
          background: #f8fafc;
        }

        .step-num {
          font-size: 5rem;
          font-weight: 900;
          color: rgba(0,0,0,0.03);
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 0;
        }

        .cta-banner {
          background: var(--primary-gradient);
        }

        .cta-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('https://www.transparenttextures.com/patterns/cubes.png');
          opacity: 0.1;
        }

        .btn-white { background: #fff; border: 0; }
        .btn-white:hover { background: #f8fafc; }

        .transition-all { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.5; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .animate-slide-up { animation: slideUp 0.8s ease-out forwards; }
        .animate-slide-up-delay { animation: slideUp 0.8s 0.2s ease-out forwards; opacity: 0; }
        .animate-slide-up-delay-2 { animation: slideUp 0.8s 0.4s ease-out forwards; opacity: 0; }

        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Responsive Fixes */
        @media (max-width: 991px) {
          .ps-hero { border-radius: 0 0 40px 40px; text-align: center; min-height: auto; padding: 60px 0; }
          .display-2 { font-size: 3rem; }
          .stats-row { margin-top: -50px; }
          .process-step:not(:last-child)::after { display: none; }
        }

        @media (max-width: 576px) {
          .display-2 { font-size: 2.5rem; }
          .p-5 { padding: 2rem !important; }
          .cta-banner { border-radius: 30px; }
        }
      `}} />
    </div>
  );
};

export default ProductServices;
