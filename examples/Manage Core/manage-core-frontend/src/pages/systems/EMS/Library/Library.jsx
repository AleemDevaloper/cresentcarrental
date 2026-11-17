import React, { useState, useEffect } from 'react';
import { useApp } from '../../../../hooks/useApp';
import { useTranslation } from '../../../../hooks/useTranslation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBook, faPlus, faSearch, faEdit, faTrash, faEye,
  faExclamationTriangle, faCheckCircle, faClock, faBookmark,
  faUsers, faMoneyBillWave, faArrowLeft, faUndo,
  faUserGraduate, faTimes
} from '@fortawesome/free-solid-svg-icons';

const CATEGORIES = ['Science', 'Literature', 'Technology', 'History', 'Arts', 'Mathematics', 'Philosophy'];
const STATUSES = ['Available', 'Issued', 'Reserved', 'Lost', 'Damaged'];

const initialForm = {
  title: '', author: '', isbn: '', publisher: '', category: '',
  copies: 1, shelfLocation: '', description: '',
};

const Library = () => {
  const { addNotification, theme } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ category: '', status: '' });
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [activeTab, setActiveTab] = useState('books');
  const [showIssueReturn, setShowIssueReturn] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showFine, setShowFine] = useState(false);
  const [issueData, setIssueData] = useState({ member: '', book: '', dueDate: '' });
  const [members, setMembers] = useState([]);
  const [fineData, setFineData] = useState({});

  const textColor = isDark ? '#f1f5f9' : '#1e293b';
  const mutedColor = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)';

  useEffect(() => {
    fetchData();
    fetchMembers();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 400));
      setData([
        { id: 1, title: 'Introduction to AI', author: 'John McCarthy', isbn: '978-0-13-604259-4', category: 'Technology', copies: 10, available: 6, status: 'Available' },
        { id: 2, title: 'Calculus Made Easy', author: 'Silvanus Thompson', isbn: '978-0-312-70980-7', category: 'Mathematics', copies: 8, available: 3, status: 'Available' },
        { id: 3, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '978-0-7432-7356-5', category: 'Literature', copies: 12, available: 8, status: 'Available' },
        { id: 4, title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0-13-235088-4', category: 'Technology', copies: 6, available: 1, status: 'Available' },
        { id: 5, title: 'Atomic Habits', author: 'James Clear', isbn: '978-0-7352-1129-2', category: 'Philosophy', copies: 15, available: 10, status: 'Available' },
        { id: 6, title: 'A Brief History of Time', author: 'Stephen Hawking', isbn: '978-0-553-38016-3', category: 'Science', copies: 5, available: 2, status: 'Available' },
        { id: 7, title: 'The Art of War', author: 'Sun Tzu', isbn: '978-1-59030-225-5', category: 'History', copies: 7, available: 5, status: 'Available' },
      ]);
    } catch (err) {
      setError(err.message || 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      await new Promise(r => setTimeout(r, 200));
      setMembers([
        { id: 1, name: 'Ali Ahmed', email: 'ali@example.com', phone: '+92 300 1234567', booksIssued: 2, fines: 150 },
        { id: 2, name: 'Sara Khan', email: 'sara@example.com', phone: '+92 300 7654321', booksIssued: 1, fines: 0 },
        { id: 3, name: 'Usman Ali', email: 'usman@example.com', phone: '+92 300 1112233', booksIssued: 3, fines: 500 },
      ]);
    } catch (err) {
      console.error('Failed to load members', err);
    }
  };

  const openAddForm = () => {
    setEditItem(null);
    setFormData(initialForm);
    setShowModal(true);
  };

  const openEditForm = (item) => {
    setEditItem(item);
    setFormData({
      title: item.title || '', author: item.author || '', isbn: item.isbn || '',
      publisher: item.publisher || '', category: item.category || '',
      copies: item.copies || 1, shelfLocation: item.shelfLocation || '',
      description: item.description || '',
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.isbn) {
      addNotification?.('Please fill all required fields', 'warning');
      return;
    }
    try {
      await new Promise(r => setTimeout(r, 300));
      addNotification?.(editItem ? 'Book updated successfully' : 'Book added successfully', 'success');
      setShowModal(false);
      setEditItem(null);
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Error saving book', 'danger');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await new Promise(r => setTimeout(r, 200));
      addNotification?.('Book deleted', 'success');
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Delete failed', 'danger');
    }
  };

  const handleIssue = async () => {
    if (!issueData.member || !issueData.book || !issueData.dueDate) {
      addNotification?.('Please fill all fields', 'warning');
      return;
    }
    try {
      await new Promise(r => setTimeout(r, 200));
      addNotification?.('Book issued successfully', 'success');
      setShowIssueReturn(false);
      setIssueData({ member: '', book: '', dueDate: '' });
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Failed to issue book', 'danger');
    }
  };

  const handleReturn = async (bookId) => {
    try {
      await new Promise(r => setTimeout(r, 200));
      addNotification?.('Book returned successfully', 'success');
      fetchData();
    } catch (err) {
      addNotification?.(err.message || 'Failed to return book', 'danger');
    }
  };

  const handleCollectFine = async (memberId) => {
    try {
      await new Promise(r => setTimeout(r, 200));
      addNotification?.('Fine collected successfully', 'success');
      setFineData({});
      fetchMembers();
    } catch (err) {
      addNotification?.(err.message || 'Failed to collect fine', 'danger');
    }
  };

  const getStatusBadge = (status, available) => {
    if (status === 'Lost') return <span className="badge bg-danger-subtle text-danger rounded-pill">Lost</span>;
    if (available === 0) return <span className="badge bg-warning-subtle text-warning rounded-pill">All Issued</span>;
    return <span className="badge bg-success-subtle text-success rounded-pill">Available</span>;
  };

  if (showFine) {
    return (
      <div className={`container-fluid py-4 ${isDark ? 'text-white' : ''}`}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <button className="btn btn-sm btn-outline-secondary rounded-3" onClick={() => setShowFine(false)}>
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Back
          </button>
          <h5 className="fw-bold mb-0" style={{ color: textColor }}>Fine Collection</h5>
        </div>
        <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                  <th className="ps-4">Member</th>
                  <th>Email</th>
                  <th>Books Issued</th>
                  <th>Fine Amount</th>
                  <th className="pe-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-2">
                        <FontAwesomeIcon icon={faUserGraduate} className="text-primary opacity-50" />
                        <span className="fw-semibold small">{m.name}</span>
                      </div>
                    </td>
                    <td className="small">{m.email}</td>
                    <td className="small">{m.booksIssued}</td>
                    <td>
                      <span className={`fw-bold small ${m.fines > 0 ? 'text-danger' : 'text-success'}`}>
                        Rs. {m.fines}
                      </span>
                    </td>
                    <td className="pe-4 text-end">
                      <button className="btn btn-sm btn-warning rounded-3" onClick={() => handleCollectFine(m.id)} disabled={m.fines === 0}>
                        <FontAwesomeIcon icon={faMoneyBillWave} className="me-1" /> Collect Fine
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (showMembers) {
    return (
      <div className={`container-fluid py-4 ${isDark ? 'text-white' : ''}`}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-sm btn-outline-secondary rounded-3" onClick={() => setShowMembers(false)}>
              <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Back
            </button>
            <h5 className="fw-bold mb-0" style={{ color: textColor }}>Library Members</h5>
          </div>
          <button className="btn btn-primary rounded-3"><FontAwesomeIcon icon={faPlus} className="me-2" />Add Member</button>
        </div>
        <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
                <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                  <th className="ps-4">Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Books Issued</th>
                  <th>Fines</th>
                  <th className="pe-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map(m => (
                  <tr key={m.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center gap-2">
                        <FontAwesomeIcon icon={faUserGraduate} className="text-primary opacity-50" />
                        <span className="fw-semibold small">{m.name}</span>
                      </div>
                    </td>
                    <td className="small">{m.email}</td>
                    <td className="small">{m.phone}</td>
                    <td className="small">{m.booksIssued}</td>
                    <td><span className={`fw-bold small ${m.fines > 0 ? 'text-danger' : 'text-success'}`}>Rs. {m.fines}</span></td>
                    <td className="pe-4 text-end">
                      <button className="btn btn-sm btn-light border rounded-3 me-1"><FontAwesomeIcon icon={faEdit} /></button>
                      <button className="btn btn-sm btn-danger rounded-3"><FontAwesomeIcon icon={faTrash} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (showIssueReturn) {
    return (
      <div className={`container-fluid py-4 ${isDark ? 'text-white' : ''}`}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <button className="btn btn-sm btn-outline-secondary rounded-3" onClick={() => setShowIssueReturn(false)}>
            <FontAwesomeIcon icon={faArrowLeft} className="me-1" /> Back
          </button>
          <h5 className="fw-bold mb-0" style={{ color: textColor }}>Issue / Return Book</h5>
        </div>
        <div className="row g-4">
          <div className="col-md-6">
            <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3" style={{ color: textColor }}>Issue Book</h6>
                <div className="mb-3">
                  <label className="small fw-bold text-muted mb-2">Member</label>
                  <select className="form-select rounded-3" value={issueData.member}
                    onChange={e => setIssueData({...issueData, member: e.target.value})}>
                    <option value="">Select Member</option>
                    {members.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="small fw-bold text-muted mb-2">Book</label>
                  <select className="form-select rounded-3" value={issueData.book}
                    onChange={e => setIssueData({...issueData, book: e.target.value})}>
                    <option value="">Select Book</option>
                    {data.filter(b => b.available > 0).map(b => <option key={b.id} value={b.title}>{b.title} ({b.available} available)</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="small fw-bold text-muted mb-2">Due Date</label>
                  <input type="date" className="form-control rounded-3" value={issueData.dueDate}
                    onChange={e => setIssueData({...issueData, dueDate: e.target.value})} />
                </div>
                <button className="btn btn-primary rounded-3 w-100" onClick={handleIssue}>
                  <FontAwesomeIcon icon={faBookmark} className="me-2" /> Issue Book
                </button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className={`card border-0 shadow-sm rounded-4 h-100 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3" style={{ color: textColor }}>Return Book</h6>
                <div className="mb-3">
                  <label className="small fw-bold text-muted mb-2">Search Issued Books</label>
                  <input type="text" className="form-control rounded-3" placeholder="Search by title or member..." />
                </div>
                {data.filter(b => b.available < b.copies).slice(0, 3).map(b => (
                  <div key={b.id} className="d-flex align-items-center justify-content-between p-3 mb-2 rounded-3"
                    style={{ background: isDark ? 'rgba(255,255,255,0.03)' : '#f8f9fc', border: `1px solid ${borderColor}` }}>
                    <div>
                      <div className="small fw-bold" style={{ color: textColor }}>{b.title}</div>
                      <div className="x-small text-muted">Issued: {b.copies - b.available} copies</div>
                    </div>
                    <button className="btn btn-sm btn-success rounded-3" onClick={() => handleReturn(b.id)}>
                      <FontAwesomeIcon icon={faUndo} className="me-1" /> Return
                    </button>
                  </div>
                ))}
                {data.filter(b => b.available < b.copies).length === 0 && (
                  <div className="text-center text-muted py-3 small">No books currently issued</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 ${isDark ? 'bg-dark text-light' : ''}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Library</h4>
          <p className={`small mb-0 ${isDark ? 'text-light opacity-75' : 'text-muted'}`}>Manage books, members, and circulation</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-success rounded-3" onClick={() => { setShowIssueReturn(true); setActiveTab('issues'); }}>
            <FontAwesomeIcon icon={faBookmark} className="me-2" />Issue/Return
          </button>
          <button className="btn btn-primary rounded-3" onClick={openAddForm}>
            <FontAwesomeIcon icon={faPlus} className="me-2" />Add Book
          </button>
        </div>
      </div>

      <ul className="nav nav-pills mb-4 gap-2">
        {[
          { key: 'books', label: 'Books', icon: faBook },
          { key: 'members', label: 'Members', icon: faUsers },
          { key: 'issues', label: 'Issue/Return', icon: faBookmark },
          { key: 'fines', label: 'Fines', icon: faMoneyBillWave },
        ].map(tab => (
          <li className="nav-item" key={tab.key}>
            <button className={`nav-link rounded-3 d-flex align-items-center gap-2 ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab.key);
                if (tab.key === 'members') setShowMembers(true);
                if (tab.key === 'issues') setShowIssueReturn(true);
                if (tab.key === 'fines') setShowFine(true);
              }}>
              <FontAwesomeIcon icon={tab.icon} /> {tab.label}
            </button>
          </li>
        ))}
      </ul>

      <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="position-relative">
              <span className="position-absolute top-50 translate-middle-y ms-3 text-muted" style={{ zIndex: 5 }}>
                <FontAwesomeIcon icon={faSearch} />
              </span>
              <input type="text" className={`form-control rounded-3 ps-5 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
                placeholder="Search by title, author, ISBN..." value={search}
                onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="col-md-3">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})}>
              <option value="">All Categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-md-2">
            <select className={`form-select rounded-3 ${isDark ? 'bg-dark border-secondary text-light' : ''}`}
              value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
              <option value="">All Status</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-md-3">
            <button className="btn btn-outline-secondary rounded-3 w-100" onClick={() => { setSearch(''); setFilters({ category: '', status: '' }); }}>
              Reset
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 rounded-3 mb-4">
          <FontAwesomeIcon icon={faExclamationTriangle} /><span>{error}</span>
          <button className="btn-close ms-auto" onClick={() => setError(null)} />
        </div>
      )}

      <div className={`card border-0 shadow-sm rounded-4 ${isDark ? 'bg-dark border-1 border-secondary' : 'bg-white'}`}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className={`${isDark ? 'bg-dark-subtle' : 'bg-light'}`}>
              <tr className={`small text-uppercase ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>
                <th className="ps-4">Book Title</th>
                <th>Author</th>
                <th>ISBN</th>
                <th>Category</th>
                <th>Copies</th>
                <th>Available</th>
                <th>Status</th>
                <th className="pe-4 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="text-center py-5"><div className="spinner-border text-primary" /></td></tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <FontAwesomeIcon icon={faBook} className="fs-1 text-muted opacity-50 mb-3" />
                    <h6 className="fw-bold">No books found</h6>
                    <p className={`small ${isDark ? 'text-light opacity-50' : 'text-muted'}`}>Add a new book to get started</p>
                  </td>
                </tr>
              ) : data.map(item => (
                <tr key={item.id}>
                  <td className="ps-4">
                    <div className="d-flex align-items-center gap-2">
                      <FontAwesomeIcon icon={faBook} className="text-primary opacity-50" />
                      <span className="fw-semibold small">{item.title}</span>
                    </div>
                  </td>
                  <td className="small">{item.author}</td>
                  <td><code className="small">{item.isbn}</code></td>
                  <td><span className="badge bg-light text-dark rounded-pill">{item.category}</span></td>
                  <td className="small fw-bold">{item.copies}</td>
                  <td>
                    <span className={`fw-bold small ${item.available === 0 ? 'text-danger' : 'text-success'}`}>{item.available}</span>
                    <div className="progress rounded-pill" style={{ height: '4px', width: '50px' }}>
                      <div className="progress-bar" style={{ width: `${(item.available / (item.copies || 1)) * 100}%`, background: item.available === 0 ? '#ef4444' : '#10b981' }}></div>
                    </div>
                  </td>
                  <td>{getStatusBadge(item.status, item.available)}</td>
                  <td className="pe-4 text-end">
                    <button className="btn btn-sm btn-light border rounded-3 me-1" onClick={() => { setShowIssueReturn(true); }}>
                      <FontAwesomeIcon icon={faBookmark} />
                    </button>
                    <button className="btn btn-sm btn-light border rounded-3 me-1" onClick={() => openEditForm(item)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="btn btn-sm btn-danger rounded-3" onClick={() => handleDelete(item.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 py-3">
                <h5 className="fw-bold">{editItem ? 'Edit Book' : 'Add Book'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="small fw-bold text-muted mb-2">Title <span className="text-danger">*</span></label>
                      <input type="text" className="form-control rounded-3" required value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Book title" />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">ISBN <span className="text-danger">*</span></label>
                      <input type="text" className="form-control rounded-3" required value={formData.isbn}
                        onChange={e => setFormData({...formData, isbn: e.target.value})} placeholder="ISBN" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Author <span className="text-danger">*</span></label>
                      <input type="text" className="form-control rounded-3" required value={formData.author}
                        onChange={e => setFormData({...formData, author: e.target.value})} placeholder="Author name" />
                    </div>
                    <div className="col-md-6">
                      <label className="small fw-bold text-muted mb-2">Publisher</label>
                      <input type="text" className="form-control rounded-3" value={formData.publisher}
                        onChange={e => setFormData({...formData, publisher: e.target.value})} placeholder="Publisher" />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Category</label>
                      <select className="form-select rounded-3" value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}>
                        <option value="">Select Category</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Copies</label>
                      <input type="number" className="form-control rounded-3" value={formData.copies}
                        onChange={e => setFormData({...formData, copies: Number(e.target.value)})} min="1" />
                    </div>
                    <div className="col-md-4">
                      <label className="small fw-bold text-muted mb-2">Shelf Location</label>
                      <input type="text" className="form-control rounded-3" value={formData.shelfLocation}
                        onChange={e => setFormData({...formData, shelfLocation: e.target.value})} placeholder="e.g. A-12" />
                    </div>
                    <div className="col-md-12">
                      <label className="small fw-bold text-muted mb-2">Description</label>
                      <textarea className="form-control rounded-3" rows="3" value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Book description" />
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 p-4 pt-0">
                  <button type="button" className="btn btn-light rounded-3 px-4" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary rounded-3 px-4">
                    <FontAwesomeIcon icon={faBook} className="me-2" />{editItem ? 'Update Book' : 'Add Book'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`.x-small { font-size: 11px; }`}</style>
    </div>
  );
};

export default Library;
