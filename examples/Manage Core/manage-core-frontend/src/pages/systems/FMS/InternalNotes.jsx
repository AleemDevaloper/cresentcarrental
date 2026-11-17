
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faNoteSticky, faPenToSquare, faHashtag, faAt,
    faMagnifyingGlass, faBookBookmark, faClockRotateLeft,
    faPaperclip, faFaceSmile, faPaperPlane, faEllipsis
} from '@fortawesome/free-solid-svg-icons';
import { getTabData } from '../../../api/fms';

const InternalNotes = ({ isDark }) => {
    const [selectedCategory, setSelectedCategory] = useState('All Notes');

    const [notes, setNotes] = useState([]);

    useEffect(() => {
        getTabData('internal-notes').then(res => setNotes(res.data?.data || [])).catch(() => {});
    }, []);

    return (
        <div className={`p-4 p-xl-5 ${isDark ? 'dark-mode text-white' : ''}`}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                
                <div className="row g-5">
                    {/* Left: Knowledge Base Sidebar */}
                    <div className="col-lg-3">
                        <div className={`p-5 rounded-5 h-100 ${isDark ? 'bg-dark-card border-white border-opacity-5' : 'bg-white shadow-sm border'}`}>
                            <div className="d-flex align-items-center gap-3 mb-5">
                                <div className="rounded-4 bg-primary p-2 text-white">
                                    <FontAwesomeIcon icon={faBookBookmark} />
                                </div>
                                <h5 className="fw-black mb-0 uppercase ls-wide small">Knowledge Base</h5>
                            </div>

                            <div className="space-y-2">
                                {['All Notes', 'Favorites', 'Drafts', 'Shared with me', 'Archived'].map(cat => (
                                    <button 
                                        key={cat}
                                        className={`btn w-100 text-start rounded-pill px-4 py-3 x-small fw-black transition-all mb-2 ${
                                            selectedCategory === cat 
                                            ? 'btn-primary shadow-primary' 
                                            : 'btn-light border text-muted'
                                        }`}
                                        onClick={() => setSelectedCategory(cat)}
                                    >
                                        {cat.toUpperCase()}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-5 pt-5 border-top border-opacity-10">
                                <label className="x-small fw-black uppercase text-muted mb-3">Popular Tags</label>
                                <div className="d-flex flex-wrap gap-2">
                                    {['#Financial', '#Policy', '#Meeting', '#Urgent', '#Technical'].map(tag => (
                                        <span key={tag} className="badge rounded-pill bg-light border text-dark x-small fw-black px-3 cursor-pointer">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Notes Feed & Editor */}
                    <div className="col-lg-9">
                        {/* Search & Action Bar */}
                        <div className="d-flex justify-content-between align-items-center mb-5">
                            <div className="input-group input-group-sm rounded-pill border overflow-hidden shadow-sm" style={{ maxWidth: '400px' }}>
                                <span className="input-group-text bg-white border-0 ps-3">
                                    <FontAwesomeIcon icon={faMagnifyingGlass} className="text-muted" />
                                </span>
                                <input type="text" className="form-control border-0 x-small fw-bold py-3" placeholder="Search internal knowledge base..." />
                            </div>
                            <button className="btn btn-dark rounded-pill px-5 fw-black x-small shadow-sm text-white">
                                <FontAwesomeIcon icon={faPenToSquare} className="me-2" /> CREATE NEW NOTE
                            </button>
                        </div>

                        {/* Editor Placeholder */}
                        <div className={`p-5 rounded-5 mb-5 ${isDark ? 'bg-dark-card' : 'bg-light'} border-dashed border-2`}>
                            <div className="d-flex align-items-center gap-3 mb-4 opacity-50">
                                <FontAwesomeIcon icon={faPenToSquare} />
                                <h6 className="fw-black mb-0 uppercase ls-wide">Quick Note Editor</h6>
                            </div>
                            <textarea 
                                className={`form-control border-0 bg-transparent x-small fw-bold mb-4 ${isDark ? 'text-white' : ''}`}
                                placeholder="Start typing... use @ to mention teammates or # to tag topics"
                                rows="3"
                                style={{ resize: 'none' }}
                            ></textarea>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex gap-3 text-muted">
                                    <FontAwesomeIcon icon={faPaperclip} className="cursor-pointer hover-text-primary" />
                                    <FontAwesomeIcon icon={faAt} className="cursor-pointer hover-text-primary" />
                                    <FontAwesomeIcon icon={faHashtag} className="cursor-pointer hover-text-primary" />
                                    <FontAwesomeIcon icon={faFaceSmile} className="cursor-pointer hover-text-primary" />
                                </div>
                                <button className="btn btn-primary rounded-pill px-4 x-small fw-black shadow-sm">
                                    POST NOTE <FontAwesomeIcon icon={faPaperPlane} className="ms-2" />
                                </button>
                            </div>
                        </div>

                        {/* Notes Feed */}
                        <div className="space-y-4">
                            {notes.map((note, idx) => (
                                <motion.div 
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`p-5 rounded-5 mb-4 ${isDark ? 'bg-dark-card' : 'bg-white shadow-sm border'}`}
                                >
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <h5 className="fw-black mb-0">{note.title}</h5>
                                        <button className="btn btn-xs btn-light rounded-circle border">
                                            <FontAwesomeIcon icon={faEllipsis} />
                                        </button>
                                    </div>
                                    <div className="d-flex align-items-center gap-3 mb-4">
                                        <span className="x-small fw-black text-primary">{note.author}</span>
                                        <span className="text-muted opacity-25">•</span>
                                        <span className="x-small text-muted fw-bold">
                                            <FontAwesomeIcon icon={faClockRotateLeft} className="me-1" /> {note.date}
                                        </span>
                                    </div>
                                    <p className="small fw-bold opacity-75 mb-4 leading-relaxed">{note.content}</p>
                                    <div className="d-flex gap-2">
                                        {note.tags.map(tag => (
                                            <span key={tag} className="badge rounded-pill bg-primary-subtle text-primary x-small fw-black px-3">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            <style>{`
                .bg-dark-card { background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(40px); border: 1px solid rgba(255,255,255,0.08) !important; }
                .border-dashed { border-style: dashed !important; }
                .fw-black { font-weight: 900; }
                .x-small { font-size: 0.75rem; }
                .ls-wide { letter-spacing: 0.15em; }
                .uppercase { text-transform: uppercase; }
                .shadow-primary { box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4); }
                .cursor-pointer { cursor: pointer; }
                .transition-all { transition: all 0.3s ease; }
                .hover-text-primary:hover { color: #4f46e5 !important; }
                .leading-relaxed { line-height: 1.625; }
            `}</style>
        </div>
    );
};

export default InternalNotes;
