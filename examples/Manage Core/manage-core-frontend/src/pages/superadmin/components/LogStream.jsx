import React from 'react';
import { motion, AnimatePresence } from "framer-motion";

const LogStream = ({ logs, isDark }) => {
  return (
    <div className={`card border-0 shadow-sm p-4 rounded-4 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white'}`}
      style={{
        background: isDark ? 'rgba(30, 41, 59, 0.7)' : '#ffffff',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h5 className="fw-bold mb-0" style={{ letterSpacing: '-0.01em' }}>Platform Operations Audit Stream</h5>
          <p className="text-muted small mb-0">Real-time monitoring of global infrastructure events.</p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="pulse-red" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></span>
          <span className="text-danger fw-black uppercase tracking-wider" style={{ fontSize: '10px' }}>Live Activity</span>
        </div>
      </div>
      
      <div className="rounded-4 p-4 bg-dark text-light font-monospace overflow-hidden shadow-inner" 
           style={{ 
             maxHeight: '300px', 
             fontSize: '12px', 
             lineHeight: '1.8', 
             border: '1px solid rgba(255,255,255,0.05)',
             backgroundColor: '#0f172a'
           }}>
        <div className="overflow-auto custom-scrollbar" style={{ maxHeight: '250px' }}>
          <AnimatePresence initial={false}>
            {logs.map((log, i) => (
              <motion.div 
                key={`${log.time}-${i}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="d-flex gap-3 mb-2 transition-all hover-bg-white hover-bg-opacity-5 rounded px-2 py-0.5 border-start border-transparent hover-border-primary"
              >
                <span className="text-muted" style={{ minWidth: '85px' }}>[{log.time}]</span>
                <span className={`fw-bold ${
                  log.type === 'error' ? 'text-danger' : 
                  (log.type === 'security' ? 'text-warning' : 
                  (log.type === 'billing' ? 'text-info' : 'text-success'))
                }`} style={{ minWidth: '80px' }}>
                  [{log.type.toUpperCase()}]
                </span>
                <span className="text-light opacity-90">{log.msg}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="mt-3 d-flex justify-content-between align-items-center">
        <span className="text-muted x-small">Showing last 15 events</span>
        <button className="btn btn-link btn-sm text-decoration-none p-0 text-primary fw-bold" style={{ fontSize: '11px' }}>
          View Full Audit Logs
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .pulse-red {
          box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          animation: pulse-red 2s infinite;
        }
        @keyframes pulse-red {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}} />
    </div>
  );
};

export default LogStream;
