import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faCircleCheck,
  faMinus,
  faPlus,
  faChartLine,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { getSystemKpi } from '../../data/systemKpiRegistry';
import { useSystemNavigation } from '../../hooks/useSystemNavigation';

const MetricCard = ({ metric, isDark, loading }) => {
  const tone = metric.tone || 'primary';
  return (
    <div
      className={`p-3 rounded-4 h-100 ${isDark ? 'bg-white bg-opacity-5' : 'bg-light-subtle'}`}
      style={{ border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.05)' }}
    >
      <div className="d-flex justify-content-between align-items-center mb-1">
        <small className={`text-${tone} fw-bold text-uppercase`} style={{ fontSize: '0.7rem', letterSpacing: '0.05em' }}>{metric.label}</small>
        <span className={`badge bg-${tone}-subtle text-${tone} rounded-pill fw-bold`} style={{ fontSize: '0.65rem' }}>{metric.delta}</span>
      </div>
      <div className={`h4 fw-black mb-0 d-flex align-items-center gap-2 ${isDark ? 'text-white' : 'text-dark'}`}>
        {loading ? <FontAwesomeIcon icon={faSpinner} spin className="text-muted" /> : metric.value}
      </div>
    </div>
  );
};

const SystemWidgetCard = ({ widget, isDark, onOpen, onRemove, data, loading }) => {
  const kpi = getSystemKpi(widget.module);
  const color = widget.color || 'primary';
  const metrics = (data && data.metrics && data.metrics.length ? data.metrics : kpi?.metrics) || [];
  const summary = (data && data.summary) || kpi?.summary;

  return (
    <div className="col-xl-6" data-testid={`dashboard-widget-${widget.id}`}>
      <div
        className={`card border-0 shadow-sm rounded-4 h-100 overflow-hidden ${isDark ? 'bg-dark-card' : 'bg-white'}`}
        style={{ border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.05)' }}
      >
        <div className="card-body p-4 d-flex flex-column">
          <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
            <div className="d-flex align-items-center gap-3">
              <span className={`p-3 rounded-4 bg-${color} bg-opacity-10 text-${color}`}>
                <FontAwesomeIcon icon={widget.icon} size="lg" />
              </span>
              <div>
                <h6 className={`fw-black mb-0 ${isDark ? 'text-white' : 'text-dark'}`}>{widget.label}</h6>
                <small className="text-muted fw-bold">{kpi?.title || widget.module.toUpperCase()} &middot; {widget.description}</small>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              {onRemove && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary rounded-pill fw-bold d-flex align-items-center gap-1"
                  onClick={() => onRemove(widget.id)}
                  aria-label={`Remove ${widget.label}`}
                >
                  <FontAwesomeIcon icon={faMinus} className="small" />
                  <span className="d-none d-md-inline">Remove</span>
                </button>
              )}
              <button
                type="button"
                className={`btn btn-sm btn-${color} rounded-pill fw-bold d-flex align-items-center gap-2`}
                onClick={() => onOpen(widget.tab)}
              >
                <span>Open</span>
                <FontAwesomeIcon icon={faArrowRight} className="small" />
              </button>
            </div>
          </div>

          {metrics.length > 0 ? (
            <>
              <div className="row g-2 mb-3">
                {metrics.map((metric) => (
                  <div className="col-sm-6 col-lg-3" key={metric.id}>
                    <MetricCard metric={metric} isDark={isDark} loading={loading} />
                  </div>
                ))}
              </div>
              {summary && (
                <div className={`mt-auto d-flex align-items-center gap-2 small fw-bold ${isDark ? 'text-white-50' : 'text-muted'}`}>
                  <FontAwesomeIcon icon={faCircleCheck} className={`text-${color}`} />
                  <span>{summary}</span>
                </div>
              )}
            </>
          ) : (
            <p className="text-muted small mb-0">{widget.description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const AddSystemCard = ({ onAdd, isDark }) => (
  <div className="col-xl-6">
    <button
      type="button"
      onClick={onAdd}
      className={`card border-0 shadow-sm rounded-4 h-100 w-100 text-start ${isDark ? 'bg-dark-card' : 'bg-white'}`}
      style={{
        border: isDark ? '1px dashed rgba(255,255,255,0.18)' : '1px dashed rgba(79,70,229,0.4)',
        background: isDark ? 'transparent' : 'rgba(238,242,255,0.5)',
      }}
    >
      <div className="card-body p-4 d-flex align-items-center justify-content-center text-center" style={{ minHeight: '220px' }}>
        <div>
          <div className={`rounded-circle d-inline-flex align-items-center justify-content-center mb-3 bg-primary bg-opacity-10 text-primary`} style={{ width: 64, height: 64 }}>
            <FontAwesomeIcon icon={faPlus} size="lg" />
          </div>
          <h6 className={`fw-bold mb-1 ${isDark ? 'text-white' : 'text-dark'}`}>Add a system dashboard</h6>
          <p className="text-muted small mb-0">Toggle FMS, AMS, HRMS, PMS, TMS, DMS, CRM and more to surface them here.</p>
        </div>
      </div>
    </button>
  </div>
);

const DashboardModuleWidgets = ({ widgets, availableWidgets, isDark, onAdd, onRemove, metricsData, metricsLoading }) => {
  const { openSystem } = useSystemNavigation();
  const hasAvailable = Array.isArray(availableWidgets) && availableWidgets.some(w => !widgets.find(v => v.id === w.id));

  const handleOpen = (widget) => {
    openSystem(widget.module, widget.tab);
  };

  return (
    <section className="mb-5" aria-label="Module dashboard widgets">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h4 className={`fw-black mb-1 d-flex align-items-center gap-2 ${isDark ? 'text-white' : 'text-dark'}`}>
            <FontAwesomeIcon icon={faChartLine} className="text-primary" />
            System dashboards
          </h4>
          <p className="text-muted small mb-0">
            {widgets.length === 0
              ? 'No system dashboards added yet. Use “Customize widgets” to add FMS, AMS, HRMS, PMS, and more.'
              : `${widgets.length} system${widgets.length === 1 ? '' : 's'} enabled. Add or remove cards anytime.`}
          </p>
        </div>
      </div>
      {widgets.length === 0 ? (
        <AddSystemCard onAdd={onAdd} isDark={isDark} />
      ) : (
        <div className="row g-4">
          {widgets.map(widget => (
            <SystemWidgetCard
              key={widget.id}
              widget={widget}
              isDark={isDark}
              onOpen={() => handleOpen(widget)}
              onRemove={onRemove}
              data={metricsData?.[widget.id]}
              loading={metricsLoading?.[widget.id]}
            />
          ))}
          {hasAvailable && onAdd && <AddSystemCard onAdd={onAdd} isDark={isDark} />}
        </div>
      )}
    </section>
  );
};

export default DashboardModuleWidgets;
