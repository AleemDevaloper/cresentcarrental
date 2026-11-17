import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faRobot, faPaperPlane, faChevronDown, 
    faMicrophone, faTimes, faLightbulb, faSpinner,
    faCog, faUpRightAndDownLeftFromCenter, faEllipsisVertical, faRotate
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../hooks/useApp';
import { useAiChat } from '../../context/AiChatContext';
import { EnableDisableButton } from '../../components/common';

const AICopilot = ({ isDark }) => {
    const { setActiveTab } = useApp();
    const { messages, sendingChatId, createNewChat, sendMessage } = useAiChat();
    const [isOpen, setIsOpen] = useState(false);
    const [copilotChatId, setCopilotChatId] = useState(null);
    const [message, setMessage] = useState('');
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // Use the first chat from shared context, or track a dedicated copilot chat
    const copilotMessages = copilotChatId ? (messages[copilotChatId] || []) : [];
    const isSending = copilotChatId !== null && sendingChatId === copilotChatId;

    const ensureChatExists = () => {
        if (!copilotChatId) {
            const id = createNewChat();
            setCopilotChatId(id);
            return id;
        }
        return copilotChatId;
    };

    const handleOpenInWorkspace = () => {
        ensureChatExists();
        setActiveTab('ai_new_chat');
        setIsOpen(false);
    };
    const toggleOpen = () => {
        setIsOpen(!isOpen);
        if (isOpen) setSettingsOpen(false);
    };
    const [sizeEnabled, setSizeEnabled] = useState(() => {
        const saved = localStorage.getItem('ai_chat_size_enabled');
        return saved !== null ? JSON.parse(saved) : false;
    });
    const [chatWidth, setChatWidth] = useState(() => {
        return parseInt(localStorage.getItem('ai_chat_width') || '350');
    });
    const [chatHeight, setChatHeight] = useState(() => {
        return parseInt(localStorage.getItem('ai_chat_height') || '400');
    });
    const chatEndRef = useRef(null);

    useEffect(() => {
        const handleChatbotSizeChange = (event) => {
            const { enabled, width, height } = event?.detail || {};
            if (typeof enabled === 'boolean') setSizeEnabled(enabled);
            if (typeof width === 'number') setChatWidth(width);
            if (typeof height === 'number') setChatHeight(height);
        };

        window.addEventListener('ai-chatbot-size-change', handleChatbotSizeChange);
        return () => window.removeEventListener('ai-chatbot-size-change', handleChatbotSizeChange);
    }, []);

    const saveChatSize = () => {
        localStorage.setItem('ai_chat_size_enabled', JSON.stringify(sizeEnabled));
        localStorage.setItem('ai_chat_width', String(chatWidth));
        localStorage.setItem('ai_chat_height', String(chatHeight));
        setSettingsOpen(false);
    };

    const adjustWidth = (delta) => {
        setChatWidth(prev => Math.min(800, Math.max(200, prev + delta)));
    };

    const adjustHeight = (delta) => {
        setChatHeight(prev => Math.min(800, Math.max(300, prev + delta)));
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [copilotMessages]);

    const handleSend = async () => {
        if (!message.trim() || isSending) return;
        const id = ensureChatExists();
        const userMsg = message.trim();
        setMessage('');
        await sendMessage(id, userMsg);
    };

    const quickActions = [
        { label: 'Check Uptime', prompt: 'Check system uptime and current operational status' },
        { label: 'Approval Risks', prompt: 'Analyze pending approvals and identify any risks' },
        { label: 'Suggest Fix', icon: faLightbulb, prompt: 'Suggest improvements for current system performance' },
    ];

    const handleQuickAction = async (prompt) => {
        const id = ensureChatExists();
        await sendMessage(id, prompt);
    };

    const t = (light, dark) => isDark ? dark : light;

    return (
        <div className="ai-copilot-wrapper" style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999 }}>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleOpen}
                className="btn p-0 rounded-circle shadow-lg d-flex align-items-center justify-content-center"
                style={{ 
                    width: '44px', 
                    height: '44px', 
                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                    color: 'white',
                    border: 'none',
                    fontSize: '20px'
                }}
            >
                <FontAwesomeIcon icon={isOpen ? faTimes : faRobot} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className={`card shadow-3xl border-0 overflow-hidden ${t('bg-white text-dark', 'bg-dark text-white')}`}
                        style={{ 
                            position: 'absolute', 
                            bottom: '50px', 
                            right: '0', 
                            width: sizeEnabled ? chatWidth + 'px' : '350px', 
                            height: sizeEnabled ? chatHeight + 'px' : '400px', 
                            borderRadius: '24px',
                            border: t('1px solid rgba(0,0,0,0.08)', '1px solid rgba(255,255,255,0.1)')
                        }}
                    >
                        {/* Header */}
                        <div className={`p-4 d-flex align-items-center justify-content-between ${t('bg-light', 'bg-white bg-opacity-5')}`}>
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-primary p-2 rounded-3 text-white shadow-sm">
                                    <FontAwesomeIcon icon={faRobot} />
                                </div>
                                <div>
                                    <h6 className={`mb-0 fw-black ${t('text-dark', 'text-white')}`}>AI Command Copilot</h6>
                                    <small className="text-success fw-bold x-small">
                                        <span className="pulse-dot d-inline-block bg-success me-1" style={{width:6,height:6,borderRadius:'50%'}}></span>
                                        Neural Engine Active
                                    </small>
                                </div>
                            </div>
                            <div className="position-relative">
                                <button
                                    className={`btn btn-sm rounded-circle ${t('btn-light', 'btn-dark')}`}
                                    onClick={() => setMenuOpen((previous) => !previous)}
                                    title="Chat options"
                                    aria-label="Chat options"
                                    aria-expanded={menuOpen}
                                >
                                    <FontAwesomeIcon icon={faEllipsisVertical} />
                                </button>
                                {menuOpen && (
                                    <div className={`dropdown-menu show p-2 shadow-lg border-0 ${t('bg-white', 'bg-dark text-white')}`} style={{ right: 0, top: 'calc(100% + 8px)', minWidth: 190, zIndex: 4 }}>
                                        <button className="dropdown-item rounded-2 d-flex align-items-center gap-2" onClick={() => { const id = createNewChat(); setCopilotChatId(id); setMenuOpen(false); }}>
                                            <FontAwesomeIcon icon={faRotate} /> Refresh conversation
                                        </button>
                                        <button className="dropdown-item rounded-2 d-flex align-items-center gap-2" onClick={() => { handleOpenInWorkspace(); setMenuOpen(false); }}>
                                            <FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} /> Open in workspace
                                        </button>
                                        <button className="dropdown-item rounded-2 d-flex align-items-center gap-2" onClick={() => { setSettingsOpen((previous) => !previous); setMenuOpen(false); }}>
                                            <FontAwesomeIcon icon={faCog} /> Chat settings
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Settings Panel */}
                        {settingsOpen && (
                            <div className={`p-3 border-bottom ${t('bg-white', 'bg-white bg-opacity-5')}`}>
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="x-small fw-bold">Custom Size</span>
                                    <EnableDisableButton
                                        checked={sizeEnabled}
                                        onClick={() => setSizeEnabled(!sizeEnabled)}
                                        label="Custom Size"
                                    />
                                </div>
                                {sizeEnabled && (
                                    <>
                                        <div className="d-flex align-items-center justify-content-between mb-1">
                                            <span className="x-small text-muted">Width</span>
                                            <div className="d-flex align-items-center gap-2">
                                                <button className="btn btn-xs btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center" style={{width:22,height:22}} onClick={() => adjustWidth(-10)} disabled={chatWidth <= 200}>
                                                    <FontAwesomeIcon icon={faChevronDown} size="xs" />
                                                </button>
                                                <span className="x-small fw-bold" style={{minWidth:35,textAlign:'center'}}>{chatWidth}px</span>
                                                <button className="btn btn-xs btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center" style={{width:22,height:22}} onClick={() => adjustWidth(10)} disabled={chatWidth >= 800}>
                                                    <FontAwesomeIcon icon={faChevronDown} size="xs" style={{transform:'rotate(180deg)'}} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <span className="x-small text-muted">Height</span>
                                            <div className="d-flex align-items-center gap-2">
                                                <button className="btn btn-xs btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center" style={{width:22,height:22}} onClick={() => adjustHeight(-10)} disabled={chatHeight <= 300}>
                                                    <FontAwesomeIcon icon={faChevronDown} size="xs" />
                                                </button>
                                                <span className="x-small fw-bold" style={{minWidth:35,textAlign:'center'}}>{chatHeight}px</span>
                                                <button className="btn btn-xs btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center" style={{width:22,height:22}} onClick={() => adjustHeight(10)} disabled={chatHeight >= 800}>
                                                    <FontAwesomeIcon icon={faChevronDown} size="xs" style={{transform:'rotate(180deg)'}} />
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div className="mt-2 text-end">
                                    <button className="btn btn-primary btn-xs rounded-pill px-3 py-1 fw-bold" style={{fontSize:'10px'}} onClick={saveChatSize}>
                                        Save
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Messages */}
                        <div className={`p-4 d-flex flex-column gap-3 overflow-auto ${t('bg-white', 'bg-dark')}`} style={{ height: 'calc(100% - 140px)' }}>
                            {copilotMessages.length === 0 ? (
                                <div className="text-center py-4 text-muted">
                                    <FontAwesomeIcon icon={faRobot} size="2x" className="mb-2 opacity-25 text-primary" />
                                    <p className="x-small">How can I assist you today?</p>
                                </div>
                            ) : (
                                copilotMessages.map((msg, i) => (
                                    <div key={i} className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                                        <div 
                                            className={`p-3 rounded-4 shadow-sm`}
                                            style={{ 
                                                maxWidth: '85%', fontSize: '13px', lineHeight: '1.5',
                                                backgroundColor: msg.sender === 'user' 
                                                    ? '#4f46e5' 
                                                    : t('#f1f5f9', 'rgba(255,255,255,0.1)'),
                                                color: msg.sender === 'user' 
                                                    ? '#fff' 
                                                    : t('#1e293b', '#e2e8f0')
                                            }}
                                        >
                                            {msg.text || <FontAwesomeIcon icon={faSpinner} spin />}
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Bottom Bar */}
                        <div className={`p-3 mt-auto border-top ${t('bg-light border-secondary border-opacity-10', 'bg-black border-white border-opacity-10')}`}>
                            <div className="d-flex flex-wrap gap-1 mb-2">
                                {quickActions.map((action, i) => (
                                    <button
                                        key={i}
                                        className={`btn btn-xs rounded-pill x-small py-1 px-2 fw-bold ${
                                            t('btn-outline-primary', 'btn-outline-light')
                                        } ${t('', 'opacity-75')}`}
                                        onClick={() => handleQuickAction(action.prompt)}
                                        disabled={isSending}
                                    >
                                        {action.icon && <FontAwesomeIcon icon={action.icon} className="me-1" />}
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                            <div className={`d-flex align-items-center gap-1 rounded-pill p-1 border ${
                                t('bg-light border-dark border-opacity-10', 'bg-white bg-opacity-5 border-white border-opacity-10')
                            }`}>
                                <button className={`btn btn-sm btn-link rounded-circle ${t('text-muted', 'text-light')}`}>
                                    <FontAwesomeIcon icon={faMicrophone} />
                                </button>
                                <input 
                                    type="text" 
                                    className={`form-control border-0 bg-transparent shadow-none x-small ${t('text-dark', 'text-white')}`}
                                    placeholder={t('Ask anything...', 'Ask anything...')}
                                    style={{ 
                                        '--bs-placeholder-color': t('#6c757d', 'rgba(255,255,255,0.4)')
                                    }}
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                    disabled={isSending}
                                />
                                <button 
                                    className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center p-0" 
                                    style={{ width: '32px', height: '32px' }}
                                    onClick={handleSend}
                                    disabled={isSending}
                                >
                                    <FontAwesomeIcon icon={isSending ? faSpinner : faPaperPlane} className="x-small" spin={isSending} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AICopilot;
