import React, { useCallback, useEffect, useState } from 'react'
import { useApp } from '../../hooks/useApp'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHeadset, faPaperPlane, faPlus, faUser, faUsers, faSpinner,
  faUserPlus, faExclamationTriangle, faCircleCheck, faTimes,
  faBuilding, faChevronRight, faRotate
} from '@fortawesome/free-solid-svg-icons'
import {
  getSupportConversations,
  createSupportConversation,
  getSupportConversation,
  addSupportMessage,
  addParticipant,
  updateConversationStatus,
  getAvailableSupportUsers,
  getSupportStats,
} from '../../api/support'

const getDisplayName = (user) => user?.name || user?.email || 'Unknown'

const SupportPage = () => {
  const { currentUser, addNotification, theme } = useApp()
  const isDark = theme === 'dark'
  const styles = {
    container: { height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column', padding: 24, gap: 16, backgroundColor: isDark ? '#111827' : '#f8fafc', overflow: 'hidden' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 },
    iconWrap: { width: 48, height: 48, borderRadius: 14, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontSize: 20 },
    heading: { fontSize: 24, fontWeight: 700, margin: 0, color: isDark ? '#f1f5f9' : '#0f172a' },
    subtitle: { fontSize: 14, color: isDark ? '#94a3b8' : '#64748b', margin: '2px 0 0 0' },
    newBtn: { display: 'flex', alignItems: 'center', gap: 8, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 12, padding: '10px 20px', fontWeight: 600, fontSize: 14, cursor: 'pointer' },
    startBtn: { display: 'flex', alignItems: 'center', gap: 8, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 18px', fontWeight: 600, fontSize: 13, cursor: 'pointer', marginTop: 8 },
    statsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, flexShrink: 0 },
    statCard: { display: 'flex', alignItems: 'center', gap: 14, background: isDark ? '#1e293b' : '#fff', borderRadius: 16, padding: '16px 20px', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' },
    statIcon: { width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 },
    statNumber: { fontSize: 22, fontWeight: 700, color: isDark ? '#f1f5f9' : '#0f172a', lineHeight: 1.2 },
    statLabel: { fontSize: 12, color: '#94a3b8', fontWeight: 500, marginTop: 1 },
    mainGrid: { flex: 1, display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, overflow: 'hidden' },
    sidebar: { display: 'flex', flexDirection: 'column', overflow: 'hidden', background: isDark ? '#1e293b' : '#fff', borderRadius: 20, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', padding: 16 },
    searchInput: { width: '100%', padding: '10px 14px', borderRadius: 12, border: isDark ? '1px solid #475569' : '1px solid #e2e8f0', fontSize: 13, outline: 'none', boxSizing: 'border-box' },
    convList: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 },
    emptyState: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' },
    convItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 14, cursor: 'pointer', transition: 'all 0.15s' },
    convItemActive: { background: isDark ? '#1e1b4b' : '#eff6ff' },
    convAvatar: { width: 40, height: 40, borderRadius: 12, background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', flexShrink: 0 },
    convInfo: { flex: 1, overflow: 'hidden' },
    convName: { fontSize: 14, fontWeight: 600, color: isDark ? '#e2e8f0' : '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    convPreview: { fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 2 },
    chatArea: { background: isDark ? '#1e293b' : '#fff', borderRadius: 20, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'flex' },
    emptyChat: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' },
    conversationWrap: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    convHeader: { padding: '16px 24px', borderBottom: isDark ? '1px solid #334155' : '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    resolveBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: 'none', background: isDark ? '#064e3b' : '#f0fdf4', color: '#10b981', fontWeight: 600, fontSize: 12, cursor: 'pointer' },
    reopenBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: 'none', background: isDark ? '#1e3a5f' : '#eff6ff', color: '#3b82f6', fontWeight: 600, fontSize: 12, cursor: 'pointer' },
    closeBtn: { display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, border: 'none', background: isDark ? '#450a0a' : '#fef2f2', color: '#ef4444', fontWeight: 600, fontSize: 12, cursor: 'pointer' },
    addBtn: { width: 36, height: 36, borderRadius: 10, border: isDark ? '1px solid #475569' : '1px solid #e2e8f0', background: isDark ? '#334155' : '#fff', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    messagesList: { flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 12 },
    msgRowMe: { alignSelf: 'flex-end', maxWidth: '75%' },
    msgRowThem: { alignSelf: 'flex-start', maxWidth: '75%' },
    msgBubbleMe: { background: '#2563eb', color: '#fff', padding: '12px 18px', borderRadius: '20px 20px 4px 20px', fontSize: 14 },
    msgBubbleThem: { background: isDark ? '#334155' : '#f1f5f9', color: isDark ? '#f1f5f9' : '#1e293b', padding: '12px 18px', borderRadius: '20px 20px 20px 4px', fontSize: 14 },
    msgTime: { fontSize: 10, opacity: 0.6, marginTop: 4 },
    inputArea: { padding: '16px 24px', borderTop: isDark ? '1px solid #334155' : '1px solid #f1f5f9', display: 'flex', gap: 10 },
    textInput: { flex: 1, border: isDark ? '1px solid #475569' : '1px solid #e2e8f0', borderRadius: 14, padding: '10px 16px', fontSize: 14, resize: 'none', height: 44, outline: 'none', fontFamily: 'inherit' },
    sendBtn: { width: 44, height: 44, borderRadius: 14, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 },
    modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 },
    modal: { background: isDark ? '#1e293b' : '#fff', borderRadius: 20, padding: 24, width: 420, maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' },
    userRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, cursor: 'pointer' },
    userAvatar: { width: 36, height: 36, borderRadius: 10, background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 },
    cancelBtn: { padding: '10px 20px', borderRadius: 10, border: isDark ? '1px solid #475569' : '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontWeight: 600, cursor: 'pointer' },
    confirmBtn: { padding: '10px 20px', borderRadius: 10, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 },
    errorBar: { position: 'fixed', bottom: 24, right: 24, background: '#ef4444', color: '#fff', padding: '14px 24px', borderRadius: 14, display: 'flex', alignItems: 'center', zIndex: 9999, fontSize: 14, boxShadow: '0 8px 24px rgba(239,68,68,0.3)' },
  }
  const isSuperAdmin = currentUser?.role === 'SuperAdmin' || currentUser?.role === 'Admin'
  const isOnlySuperAdmin = currentUser?.role === 'SuperAdmin'

  const [conversations, setConversations] = useState([])
  const [activeConvId, setActiveConvId] = useState(null)
  const [activeConv, setActiveConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [chatInput, setChatInput] = useState('')
  const [error, setError] = useState('')
  const [showNewModal, setShowNewModal] = useState(false)
  const [availableUsers, setAvailableUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUserIds, setSelectedUserIds] = useState([])
  const [showAddParticipant, setShowAddParticipant] = useState(false)
  const [sending, setSending] = useState(false)
  const [stats, setStats] = useState(null)

  const loadStats = useCallback(async () => {
    if (!currentUser || !isSuperAdmin) return
    try {
      const data = await getSupportStats()
      setStats(data)
    } catch (_) {}
  }, [currentUser, isSuperAdmin])

  const loadConversations = useCallback(async () => {
    if (!currentUser) return
    try {
      const data = await getSupportConversations()
      setConversations(data || [])
    } catch (err) {
      setError(err.message || 'Failed to load conversations')
    }
  }, [currentUser])

  useEffect(() => {
    loadConversations()
    loadStats()
    const interval = setInterval(() => { loadConversations(); loadStats() }, 10000)
    return () => clearInterval(interval)
  }, [loadConversations, loadStats])

  const loadConversationDetail = useCallback(async (id) => {
    try {
      const conv = await getSupportConversation(id)
      setActiveConv(conv)
      setMessages(conv.messages || [])
      return conv
    } catch (err) {
      setError(err.message || 'Failed to load conversation')
      return null
    }
  }, [])

  useEffect(() => {
    if (!activeConvId) {
      setActiveConv(null)
      setMessages([])
      return
    }
    loadConversationDetail(activeConvId)
    const interval = setInterval(() => loadConversationDetail(activeConvId), 4000)
    return () => clearInterval(interval)
  }, [activeConvId, loadConversationDetail])

  const handleSendMessage = async () => {
    if (!activeConvId || !chatInput.trim()) return
    const text = chatInput.trim()
    setSending(true)
    setChatInput('')
    try {
      await addSupportMessage(activeConvId, text)
      await loadConversationDetail(activeConvId)
      await loadConversations()
    } catch (err) {
      setError(err.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const handleStatusChange = async (convId, status) => {
    try {
      await updateConversationStatus(convId, status)
      addNotification(`Conversation marked as ${status}.`, 'success')
      await loadConversationDetail(convId)
      await loadConversations()
      await loadStats()
    } catch (err) {
      setError(err.message || 'Failed to update status')
    }
  }

  const handleContactSupport = async () => {
    try {
      const users = await getAvailableSupportUsers()
      if (!users || users.length === 0) {
        setError('No support agents available. Please try again later.')
        return
      }
      const conv = await createSupportConversation({
        subject: null,
        userIds: [users[0].id],
      })
      addNotification('Connected to support.', 'success')
      await loadConversations()
      await loadStats()
      setActiveConvId(conv.id)
    } catch (err) {
      setError(err.message || 'Failed to contact support')
    }
  }

  const handleNewConversation = async () => {
    if (selectedUserIds.length === 0) {
      setError('Please select at least one user to start a conversation.')
      return
    }
    try {
      const conv = await createSupportConversation({
        subject: null,
        userIds: selectedUserIds,
      })
      addNotification('Conversation started.', 'success')
      setShowNewModal(false)
      setSelectedUserIds([])
      setSearchQuery('')
      await loadConversations()
      await loadStats()
      setActiveConvId(conv.id)
    } catch (err) {
      setError(err.message || 'Failed to create conversation')
    }
  }

  const handleAddParticipant = async (userId) => {
    if (!activeConvId) return
    try {
      await addParticipant(activeConvId, userId)
      addNotification('Participant added.', 'success')
      setShowAddParticipant(false)
      await loadConversationDetail(activeConvId)
    } catch (err) {
      setError(err.message || 'Failed to add participant')
    }
  }

  const openNewModal = async () => {
    try {
      const users = await getAvailableSupportUsers()
      setAvailableUsers(users || [])
    } catch (_) {}
    setShowNewModal(true)
  }

  const openAddParticipant = async () => {
    try {
      const users = await getAvailableSupportUsers()
      setAvailableUsers(users || [])
    } catch (_) {}
    setShowAddParticipant(true)
  }

  const otherParticipants = (conv) => {
    if (!conv?.users) return []
    return conv.users.filter(u => u.id !== currentUser?.id)
  }

  const participantNames = (conv) => {
    return otherParticipants(conv).map(getDisplayName).join(', ')
  }

  const filteredConvs = conversations.filter(c => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return participantNames(c).toLowerCase().includes(q)
  })

  const filteredUsers = availableUsers.filter(u =>
    getDisplayName(u).toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleUser = (id) => {
    setSelectedUserIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const formatTime = (iso) => {
    if (!iso) return ''
    const d = new Date(iso)
    const now = new Date()
    const diff = now - d
    if (diff < 60000) return 'just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return d.toLocaleDateString()
  }

  const statusColor = (s) => {
    switch (s) {
      case 'Open': return '#ef4444'
      case 'Resolved': return '#10b981'
      case 'Closed': return '#94a3b8'
      default: return '#94a3b8'
    }
  }

  if (!currentUser) return null

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={styles.iconWrap}>
            <FontAwesomeIcon icon={faHeadset} />
          </div>
          <div>
            <h2 style={styles.heading}>Support</h2>
            <p style={styles.subtitle}>
              {isSuperAdmin ? 'Manage support conversations' : 'Chat with support team'}
            </p>
          </div>
        </div>
        {isSuperAdmin ? (
          <button style={styles.newBtn} onClick={openNewModal}>
            <FontAwesomeIcon icon={faPlus} /> New Conversation
          </button>
        ) : (
          <button style={styles.newBtn} onClick={handleContactSupport}>
            <FontAwesomeIcon icon={faPlus} /> Contact Support
          </button>
        )}
      </div>

      {isSuperAdmin && stats && (
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: '#fef2f2', color: '#ef4444' }}>
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </div>
            <div>
              <div style={styles.statNumber}>{stats.open}</div>
              <div style={styles.statLabel}>Open</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: '#f0fdf4', color: '#10b981' }}>
              <FontAwesomeIcon icon={faCircleCheck} />
            </div>
            <div>
              <div style={styles.statNumber}>{stats.resolved}</div>
              <div style={styles.statLabel}>Resolved</div>
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: '#f8fafc', color: '#94a3b8' }}>
              <FontAwesomeIcon icon={faTimes} />
            </div>
            <div>
              <div style={styles.statNumber}>{stats.closed}</div>
              <div style={styles.statLabel}>Closed</div>
            </div>
          </div>
          {isOnlySuperAdmin && (
            <div style={styles.statCard}>
              <div style={{ ...styles.statIcon, background: '#eff6ff', color: '#3b82f6' }}>
                <FontAwesomeIcon icon={faBuilding} />
              </div>
              <div>
                <div style={styles.statNumber}>{stats.totalCompanyAdmins}</div>
                <div style={styles.statLabel}>Company Admins</div>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={styles.mainGrid}>
        <aside style={styles.sidebar}>
          {isSuperAdmin && (
            <div style={{ padding: '0 0 12px 0' }}>
              <input
                type="search"
                placeholder="Search conversations..."
                style={styles.searchInput}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          )}
          <div style={styles.convList}>
            {conversations.length === 0 && (
              <div style={styles.emptyState}>
                <FontAwesomeIcon icon={faHeadset} style={{ fontSize: 32, opacity: 0.3, marginBottom: 8 }} />
                <p style={{ margin: 0, fontSize: 14, color: '#94a3b8' }}>
                  {isSuperAdmin ? 'No conversations yet. Start one!' : 'Start a conversation with support.'}
                </p>
                {!isSuperAdmin && (
                  <button style={styles.startBtn} onClick={handleContactSupport}>
                    <FontAwesomeIcon icon={faPlus} /> Contact Support
                  </button>
                )}
              </div>
            )}
            {filteredConvs.map(conv => {
              const isActive = conv.id === activeConvId
              return (
                <div
                  key={conv.id}
                  style={isActive ? { ...styles.convItem, ...styles.convItemActive } : styles.convItem}
                  onClick={() => setActiveConvId(conv.id)}
                >
                  <div style={styles.convAvatar}>
                    <FontAwesomeIcon icon={faUsers} />
                  </div>
                  <div style={styles.convInfo}>
                    <div style={styles.convName}>
                      {participantNames(conv) || 'Support'}
                    </div>
                    <div style={styles.convPreview}>
                      {conv.latestMessage
                        ? `${conv.latestMessage.senderName}: ${conv.latestMessage.text.substring(0, 50)}${conv.latestMessage.text.length > 50 ? '...' : ''}`
                        : 'No messages yet'}
                    </div>
                  </div>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: statusColor(conv.status), flexShrink: 0
                  }} />
                </div>
              )
            })}
          </div>
        </aside>

        <main style={styles.chatArea}>
          {!activeConvId ? (
            <div style={styles.emptyChat}>
              <div style={{ fontSize: 64, opacity: 0.2, marginBottom: 16 }}>
                <FontAwesomeIcon icon={faHeadset} />
              </div>
              <h3 style={{ margin: '0 0 8px 0', color: '#94a3b8' }}>
                {isSuperAdmin ? 'Select a conversation' : 'Support Chat'}
              </h3>
              <p style={{ margin: 0, color: '#b0b8c5', fontSize: 14 }}>
                {isSuperAdmin
                  ? 'Choose a conversation from the left or start a new one.'
                  : 'Click "Contact Support" to start chatting.'}
              </p>
              {!isSuperAdmin && (
                <button style={{ ...styles.startBtn, marginTop: 16 }} onClick={handleContactSupport}>
                  <FontAwesomeIcon icon={faPlus} /> Contact Support
                </button>
              )}
            </div>
          ) : (
            <div style={styles.conversationWrap}>
              <header style={styles.convHeader}>
                <div>
                  <div style={styles.convName}>
                    {activeConv ? participantNames(activeConv) : 'Conversation'}
                  </div>
                  <div style={{ fontSize: 12, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{activeConv?.users?.length || 0} participant{(activeConv?.users?.length || 0) !== 1 ? 's' : ''}</span>
                    {activeConv?.status && (
                      <>
                        <span>•</span>
                        <span style={{
                          background: `${statusColor(activeConv.status)}18`,
                          color: statusColor(activeConv.status),
                          padding: '2px 8px', borderRadius: 6, fontWeight: 600, fontSize: 11
                        }}>
                          {activeConv.status}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {activeConv?.status !== 'Closed' && activeConv?.status !== 'Resolved' && (
                    <button style={styles.resolveBtn} onClick={() => handleStatusChange(activeConvId, 'Resolved')}>
                      <FontAwesomeIcon icon={faCircleCheck} /> Resolve
                    </button>
                  )}
                  {activeConv?.status === 'Resolved' && (
                    <button style={styles.reopenBtn} onClick={() => handleStatusChange(activeConvId, 'Open')}>
                      <FontAwesomeIcon icon={faRotate} /> Reopen
                    </button>
                  )}
                  {activeConv?.status !== 'Closed' && (
                    <button style={styles.closeBtn} onClick={() => handleStatusChange(activeConvId, 'Closed')}>
                      <FontAwesomeIcon icon={faTimes} /> Close
                    </button>
                  )}
                  {isSuperAdmin && (
                    <button style={styles.addBtn} onClick={openAddParticipant} title="Add participant">
                      <FontAwesomeIcon icon={faUserPlus} />
                    </button>
                  )}
                </div>
              </header>

              <div style={styles.messagesList}>
                {activeConv?.status === 'Closed' && (
                  <div style={{ textAlign: 'center', padding: '12px 0', marginBottom: 8 }}>
                    <span style={{
                      background: '#f1f5f9', color: '#94a3b8',
                      padding: '6px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600
                    }}>
                      This conversation is closed
                    </span>
                  </div>
                )}
                {messages.map((msg) => {
                  const isMine = msg.senderId === currentUser?.id
                  return (
                    <div key={msg.id} style={isMine ? styles.msgRowMe : styles.msgRowThem}>
                      <div style={isMine ? styles.msgBubbleMe : styles.msgBubbleThem}>
                        {(!isMine && msg.sender) && (
                          <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 2, opacity: 0.7 }}>
                            {msg.sender.name || msg.sender.email}
                          </div>
                        )}
                        <div>{msg.text}</div>
                        <div style={styles.msgTime}>{formatTime(msg.createdAt)}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {activeConv?.status !== 'Closed' && (
                <div style={styles.inputArea}>
                  <textarea
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="Type a message..."
                    style={styles.textInput}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage() } }}
                  />
                  <button
                    style={sending ? { ...styles.sendBtn, opacity: 0.6 } : styles.sendBtn}
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim() || sending}
                  >
                    {sending ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faPaperPlane} />}
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {showNewModal && (
        <div style={styles.modalOverlay} onClick={() => { setShowNewModal(false); setSelectedUserIds([]); setSearchQuery('') }}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px 0' }}>New Conversation</h3>
            <input
              type="search"
              placeholder={isSuperAdmin ? "Search users..." : "Search support agents..."}
              style={styles.searchInput}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
            />
            <div style={{ maxHeight: 300, overflowY: 'auto', margin: '12px 0' }}>
              {filteredUsers.length === 0 && (
                <p style={{ textAlign: 'center', color: '#94a3b8', padding: 24 }}>{isSuperAdmin ? 'No users found' : 'No support agents available'}</p>
              )}
              {filteredUsers.map(u => (
                <div
                  key={u.id}
                  style={{
                    ...styles.userRow,
                    background: selectedUserIds.includes(u.id) ? '#eff6ff' : 'transparent',
                  }}
                  onClick={() => toggleUser(u.id)}
                >
                  <div style={styles.userAvatar}>{getDisplayName(u)[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{getDisplayName(u)}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8' }}>{u.role || 'User'} &bull; {u.email}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedUserIds.includes(u.id)}
                    onChange={() => toggleUser(u.id)}
                  />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                style={styles.cancelBtn}
                onClick={() => { setShowNewModal(false); setSelectedUserIds([]); setSearchQuery('') }}
              >
                Cancel
              </button>
              <button
                style={styles.confirmBtn}
                onClick={handleNewConversation}
                disabled={selectedUserIds.length === 0}
              >
                <FontAwesomeIcon icon={faPaperPlane} className="me-2" /> Start
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddParticipant && (
        <div style={styles.modalOverlay} onClick={() => setShowAddParticipant(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px 0' }}>Add Participant</h3>
            <input
              type="search"
              placeholder="Search users..."
              style={{ ...styles.searchInput, marginBottom: 12 }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
            />
            <div style={{ maxHeight: 300, overflowY: 'auto', marginBottom: 12 }}>
              {availableUsers
                .filter(u => {
                  if (!searchQuery) return true
                  const q = searchQuery.toLowerCase()
                  return getDisplayName(u).toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q)
                })
                .filter(u => !activeConv?.users?.some(ex => ex.id === u.id))
                .map(u => (
                  <div key={u.id} style={styles.userRow} onClick={() => handleAddParticipant(u.id)}>
                    <div style={styles.userAvatar}>{getDisplayName(u)[0]}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14 }}>{getDisplayName(u)}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8' }}>{u.role || 'User'}</div>
                    </div>
                    <FontAwesomeIcon icon={faUserPlus} style={{ color: '#2563eb', marginLeft: 'auto' }} />
                  </div>
                ))}
              {availableUsers.filter(u => !activeConv?.users?.some(ex => ex.id === u.id)).length === 0 && (
                <p style={{ textAlign: 'center', color: '#94a3b8', padding: 24 }}>No more users to add</p>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button style={styles.cancelBtn} onClick={() => setShowAddParticipant(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div style={styles.errorBar}>
          <span>{error}</span>
          <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', marginLeft: 12 }} onClick={() => setError('')}>✕</button>
        </div>
      )}
    </div>
  )
}
export default SupportPage
