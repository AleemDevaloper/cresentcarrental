
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faSearch, faBolt, faKeyboard, faMicrochip, 
    faUsers, faBriefcase, faGear, faLifeRing,
    faChartLine, faShieldHalved, faBell
} from '@fortawesome/free-solid-svg-icons';

const CommandPalette = ({ isOpen, onClose }) => {
    const [search, setSearch] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);

    const commands = [
        { id: 'audit', icon: faShieldHalved, label: 'Run System Audit', category: 'System', shortcut: '⌥ A' },
        { id: 'users', icon: faUsers, label: 'Manage Personnel', category: 'HRMS', shortcut: '⌥ U' },
        { id: 'reports', icon: faChartLine, label: 'Generate KPI Report', category: 'Analytics', shortcut: '⌥ R' },
        { id: 'deploy', icon: faBolt, label: 'Trigger Automation Workflow', category: 'Automation', shortcut: '⌥ D' },
        { id: 'settings', icon: faGear, label: 'System Configuration', category: 'Admin', shortcut: '⌥ S' },
        { id: 'help', icon: faLifeRing, label: 'Open Command Center Help', category: 'Support', shortcut: '⌥ H' },
    ];

    const filteredCommands = commands.filter(cmd => 
        cmd.label.toLowerCase().includes(search.toLowerCase()) ||
        cmd.category.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onClose(!isOpen);
            }
            if (!isOpen) return;
            if (e.key === 'Escape') onClose(false);
            if (e.key === 'ArrowDown') setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
            if (e.key === 'ArrowUp') setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
            if (e.key === 'Enter') {
                console.log('Executing command:', filteredCommands[selectedIndex]);
                onClose(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, filteredCommands, selectedIndex]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="command-palette-overlay" style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '15vh', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)' }} onClick={() => onClose(false)}>
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="command-palette-container"
                        style={{ width: '100%', maxWidth: '600px', background: '#1e293b', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-4 border-bottom border-white border-opacity-10 d-flex align-items-center gap-3">
                            <FontAwesomeIcon icon={faSearch} className="text-muted fs-5" />
                            <input 
                                autoFocus
                                type="text" 
                                className="bg-transparent border-0 text-white w-100 fs-5 outline-none"
                                placeholder="Type a command or search..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                style={{ outline: 'none' }}
                            />
                            <div className="badge bg-white bg-opacity-10 text-white px-2 py-1 rounded small fw-bold">ESC</div>
                        </div>

                        <div className="command-list py-2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {filteredCommands.map((cmd, idx) => (
                                <div 
                                    key={cmd.id}
                                    className={`px-4 py-3 d-flex align-items-center justify-content-between cursor-pointer transition-all ${idx === selectedIndex ? 'bg-primary bg-opacity-25 text-white' : 'text-white-50 hover-bg-white hover-bg-opacity-5'}`}
                                    onMouseEnter={() => setSelectedIndex(idx)}
                                >
                                    <div className="d-flex align-items-center gap-3">
                                        <div className={`rounded-3 d-flex align-items-center justify-content-center ${idx === selectedIndex ? 'text-primary' : 'text-white'}`} style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.05)' }}>
                                            <FontAwesomeIcon icon={cmd.icon}/>
                                        </div>
                                        <div>
                                            <div className="fw-bold small text-white">{cmd.label}</div>
                                            <div className="x-small opacity-50 text-white">{cmd.category}</div>
                                        </div>
                                    </div>
                                    <div className="x-small fw-bold opacity-30">{cmd.shortcut}</div>
                                </div>
                            ))}
                            {filteredCommands.length === 0 && (
                                <div className="px-4 py-5 text-center text-muted">
                                    <FontAwesomeIcon icon={faMicrochip} className="fs-1 mb-3 opacity-20" />
                                    <p className="mb-0">No commands found for "{search}"</p>
                                </div>
                            )}
                        </div>

                        <div className="p-3 bg-black bg-opacity-20 border-top border-white border-opacity-10 d-flex justify-content-between align-items-center">
                            <div className="d-flex gap-3">
                                <span className="x-small text-white"><FontAwesomeIcon icon={faKeyboard} className="me-1 text-white" /> Use arrows to navigate</span>
                                <span className="x-small text-white"><FontAwesomeIcon icon={faBolt} className="me-1 text-white" /> Press enter to execute</span>
                            </div>
                            <div className="x-small text-white">Enterprise Command Center v4.2</div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;
