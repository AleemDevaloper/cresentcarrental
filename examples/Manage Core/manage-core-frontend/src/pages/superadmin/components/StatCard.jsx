import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

const StatCard = ({ title, value, label, color, icon, graph, isDark }) => {
  const colorMap = {
    primary: {
      bg: 'rgba(79, 70, 229, 0.1)',
      text: '#4f46e5',
      stroke: '#4f46e5'
    },
    success: {
      bg: 'rgba(16, 185, 129, 0.1)',
      text: '#10b981',
      stroke: '#10b981'
    },
    info: {
      bg: 'rgba(14, 165, 233, 0.1)',
      text: '#0ea5e9',
      stroke: '#0ea5e9'
    },
    warning: {
      bg: 'rgba(245, 158, 11, 0.1)',
      text: '#f59e0b',
      stroke: '#f59e0b'
    },
    danger: {
      bg: 'rgba(239, 68, 68, 0.1)',
      text: '#ef4444',
      stroke: '#ef4444'
    }
  };

  const selectedColor = colorMap[color] || colorMap.primary;

  return (
    <motion.div 
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`card border-0 shadow-sm p-4 rounded-4 ${isDark ? 'bg-dark-card border-white border-opacity-5 text-white' : 'bg-white text-dark'}`}
      style={{
        background: isDark ? 'rgba(30, 41, 59, 0.7)' : '#ffffff',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted fw-bold small text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>
          {title}
        </span>
        <div 
          className="rounded-3 d-flex align-items-center justify-content-center shadow-sm" 
          style={{ 
            width: '42px', 
            height: '42px', 
            backgroundColor: selectedColor.bg,
            color: selectedColor.text
          }}
        >
          <FontAwesomeIcon icon={icon} className="fs-5" />
        </div>
      </div>
      
      <div className="d-flex align-items-baseline gap-2">
        <h2 className="fw-black mb-1" style={{ letterSpacing: '-0.02em', fontSize: '1.75rem' }}>
          {value}
        </h2>
      </div>

      <div className="d-flex align-items-center justify-content-between mt-3">
        <div className="d-flex align-items-center gap-1">
          <span className={`small fw-bold ${label.startsWith('-') ? 'text-danger' : 'text-success'}`} style={{ fontSize: '11px' }}>
            {label}
          </span>
        </div>
        
        {/* Sparkline mini-indicator with animation */}
        <svg width="80" height="24" style={{ opacity: 0.8 }}>
          <motion.polyline
            fill="none"
            stroke={selectedColor.stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={graph.map((val, idx) => `${idx * (80 / (graph.length - 1))},${24 - (val * 1.5)}`).join(' ')}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </svg>
      </div>
    </motion.div>
  );
};

export default StatCard;
