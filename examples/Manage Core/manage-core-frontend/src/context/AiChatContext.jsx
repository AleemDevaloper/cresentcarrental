import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { OpenRouter } from '@openrouter/sdk';
import { getApiBaseUrl, getAuthToken } from '../api/client';

const SYSTEM_PROMPT = 'You are an AI assistant for Manage Core ERP. Provide concise, accurate, and actionable responses.';
const MAX_HISTORY_TOKENS = 4000;
const OPENROUTER_MODELS = [
    import.meta.env.VITE_OPENROUTER_MODEL || 'openrouter/free',
    'google/gemma-4-26b-a4b-it:free',
    'openai/gpt-oss-20b:free',
    'nvidia/nemotron-3-super-120b-a12b:free',
].filter(Boolean);

const openrouter = new OpenRouter({
    apiKey: import.meta.env.VITE_OPENROUTER_KEY,
    httpReferer: window.location.origin,
    appTitle: 'Manage Core ERP',
});

const STORAGE_KEYS = {
    CHATS: 'ai_chats',
    MESSAGES: 'ai_messages',
    ARCHIVED: 'ai_archived_chats',
    TRASHED: 'ai_trashed_chats',
    FOLDERS: 'ai_folders',
};

const DEFAULT_FOLDERS = [
    { id: 1, name: 'Personal' },
    { id: 2, name: 'Development' },
    { id: 3, name: 'Marketing' },
    { id: 4, name: 'HR' },
    { id: 5, name: 'Finance' },
];

const AiChatContext = createContext(null);

export const useAiChat = () => {
    const ctx = useContext(AiChatContext);
    if (!ctx) throw new Error('useAiChat must be used within AiChatProvider');
    return ctx;
};

const getNextId = (chats, archived, trashed) =>
    chats.length + archived.length + trashed.length + 1;

const getNow = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export const AiChatProvider = ({ children }) => {
    const [chats, setChats] = useState([]);
    const [messages, setMessages] = useState({});
    const [archivedChats, setArchivedChats] = useState([]);
    const [trashedChats, setTrashedChats] = useState([]);
    const [sendingChatId, setSendingChatId] = useState(null);
    const [selectedModel, setSelectedModel] = useState('openrouter/free');
    const [folders, setFolders] = useState([]);
    const loaded = useRef(false);
    const messagesRef = useRef(messages);
    useEffect(() => { messagesRef.current = messages; }, [messages]);

    const loadJSON = useCallback((key, fallback) => {
        try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
        catch { return fallback; }
    }, []);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const savedChats = localStorage.getItem(STORAGE_KEYS.CHATS);
            const savedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
            const savedArchived = localStorage.getItem(STORAGE_KEYS.ARCHIVED);
            const savedTrashed = localStorage.getItem(STORAGE_KEYS.TRASHED);
            if (savedChats) setChats(JSON.parse(savedChats));
            if (savedMessages) setMessages(JSON.parse(savedMessages));
            if (savedArchived) setArchivedChats(JSON.parse(savedArchived));
            if (savedTrashed) setTrashedChats(JSON.parse(savedTrashed));
            setFolders(loadJSON(STORAGE_KEYS.FOLDERS, DEFAULT_FOLDERS));
        } catch (e) {
            console.warn('Failed to load AI chat state:', e);
        }
        loaded.current = true;
    }, [loadJSON]);

    // Persist to localStorage on changes (only after initial load)
    useEffect(() => {
        if (!loaded.current) return;
        try {
            localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
            localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
            localStorage.setItem(STORAGE_KEYS.ARCHIVED, JSON.stringify(archivedChats));
            localStorage.setItem(STORAGE_KEYS.TRASHED, JSON.stringify(trashedChats));
            localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
        } catch (e) {
            console.warn('Failed to persist AI chat state:', e);
        }
    }, [chats, messages, archivedChats, trashedChats, folders]);

    const createNewChat = useCallback((folderId = null) => {
        const id = getNextId(chats, archivedChats, trashedChats);
        const newChat = {
            id,
            title: `New Chat ${id}`,
            lastMsg: 'Draft conversation started...',
            time: 'Just now',
            pinned: false,
            shared: false,
            favorite: false,
            folder: folderId,
        };
        setChats(prev => [newChat, ...prev]);
        setMessages(prev => ({ ...prev, [id]: [] }));
        return id;
    }, [chats, archivedChats, trashedChats]);

    const updateChatTitle = useCallback((chatId, firstMsg) => {
        setChats(prev => prev.map(c =>
            c.id === chatId
                ? { ...c, title: firstMsg.length > 40 ? firstMsg.slice(0, 40) + '...' : firstMsg, lastMsg: firstMsg.slice(0, 60) }
                : c
        ));
    }, []);

    const truncateHistory = useCallback((history) => {
        let totalLen = 0;
        const truncated = [];
        for (let i = history.length - 1; i >= 0; i--) {
            const msgLen = history[i].content.length;
            if (totalLen + msgLen > MAX_HISTORY_TOKENS) break;
            totalLen += msgLen;
            truncated.unshift(history[i]);
        }
        return truncated;
    }, []);

    const updateLastMessageText = useCallback((chatId, text) => {
        setMessages(prev => {
            const msgs = prev[chatId] || [];
            const updated = [...msgs];
            if (updated.length > 0) {
                updated[updated.length - 1] = { ...updated[updated.length - 1], text };
            }
            return { ...prev, [chatId]: updated };
        });
    }, []);

    // Stream through the backend proxy (SSE) so tokens appear as they're generated.
    const streamViaBackend = useCallback(async (message, history, onDelta) => {
        const url = `${getApiBaseUrl()}/api/v1/ai/chat`;
        const token = getAuthToken();
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
                stream: true,
                message,
                history,
                model: selectedModel || undefined,
            }),
        });

        if (!res.ok) {
            const err = new Error(`AI stream failed (${res.status})`);
            err.status = res.status;
            try {
                const body = await res.json();
                if (body?.message) err.message = body.message;
            } catch { /* ignore parse error */ }
            throw err;
        }
        if (!res.body) throw new Error('AI stream returned no body');

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let full = '';
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            let idx;
            while ((idx = buffer.indexOf('\n')) !== -1) {
                const line = buffer.slice(0, idx).replace(/\r$/, '');
                buffer = buffer.slice(idx + 1);
                if (!line.startsWith('data:')) continue;
                const data = line.slice(5).trim();
                if (!data || data === '[DONE]') continue;
                try {
                    const evt = JSON.parse(data);
                    const delta = evt?.choices?.[0]?.delta?.content;
                    if (delta) {
                        full += delta;
                        onDelta(full);
                    }
                } catch { /* ignore malformed event */ }
            }
        }
        if (!full.trim()) throw new Error('AI stream returned no content');
        return full;
    }, [selectedModel]);

    // Fallback: stream directly from OpenRouter in the browser.
    const streamViaDirect = useCallback(async (message, history, onDelta) => {
        const apiKey = import.meta.env.VITE_OPENROUTER_KEY;
        if (!apiKey) throw new Error('No VITE_OPENROUTER_KEY configured and backend stream unavailable.');

        const apiMessages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history,
            { role: 'user', content: message },
        ];

        let lastError;
        for (const model of OPENROUTER_MODELS) {
            try {
                let full = '';
                const stream = await openrouter.chat.send({
                    chatRequest: { model, stream: true, messages: apiMessages },
                }, { timeoutMs: 120000 });

                for await (const chunk of stream) {
                    const content = chunk.choices?.[0]?.delta?.content;
                    if (content) {
                        full += content;
                        onDelta(full);
                    }
                }

                if (!full.trim()) throw new Error('Model returned an empty response');
                return full;
            } catch (error) {
                lastError = error;
                console.warn(`OpenRouter model failed (${model}):`, error);
            }
        }
        throw lastError || new Error('All AI models failed to respond');
    }, []);

    const sendMessage = useCallback(async (chatId, text) => {
        if (!text.trim() || sendingChatId === chatId) return;
        setSendingChatId(chatId);

        const currentMsgs = (messagesRef.current[chatId] || []).filter(m => m.text !== undefined);
        const isFirst = currentMsgs.length === 0;
        if (isFirst) updateChatTitle(chatId, text.trim());

        const userMsg = { sender: 'user', text: text.trim(), time: getNow() };
        const assistantPlaceholder = { sender: 'assistant', text: '', time: getNow() };

        setMessages(prev => ({
            ...prev,
            [chatId]: [...(prev[chatId] || []), userMsg, assistantPlaceholder]
        }));

        const history = truncateHistory(currentMsgs.map(m => ({ role: m.sender === 'user' ? 'user' : 'assistant', content: m.text })));
        const onDelta = (partial) => updateLastMessageText(chatId, partial);

        try {
            try {
                await streamViaBackend(text.trim(), history, onDelta);
            } catch (proxyError) {
                // Respect organization quota enforcement from the backend rather than bypassing it.
                if (proxyError?.status === 429) throw proxyError;
                console.warn('Backend streaming failed, falling back to direct OpenRouter:', proxyError);
                await streamViaDirect(text.trim(), history, onDelta);
            }
        } catch (error) {
            const status = error?.status || error?.response?.status;
            let errMsg = error?.message || 'AI request failed.';
            if (status === 429) {
                errMsg = error?.data?.message || error?.response?.data?.message || 'Your organization\'s AI usage quota has been exceeded. Please contact your administrator.';
            }
            const userFacing = status === 429
                ? `⚠️ ${errMsg}`
                : 'I\'m having trouble reaching the AI service right now. Please wait a moment and try again. If the issue persists, try starting a new conversation.';
            updateLastMessageText(chatId, userFacing);
        } finally {
            setSendingChatId(null);
        }
    }, [sendingChatId, selectedModel, updateChatTitle, truncateHistory, streamViaBackend, streamViaDirect, updateLastMessageText]);

    const archiveChat = useCallback((chatId) => {
        setChats(prev => {
            const chat = prev.find(c => c.id === chatId);
            if (!chat) return prev;
            setArchivedChats(a => [...a, { id: chat.id, title: chat.title, folder: chat.folder, dateArchived: 'Just now' }]);
            return prev.filter(c => c.id !== chatId);
        });
    }, []);

    const trashChat = useCallback((chatId) => {
        setChats(prev => {
            const chat = prev.find(c => c.id === chatId);
            if (!chat) return prev;
            setTrashedChats(t => [...t, { id: chat.id, title: chat.title, folder: chat.folder, dateDeleted: 'Just now' }]);
            return prev.filter(c => c.id !== chatId);
        });
    }, []);

    const restoreArchivedChat = useCallback((chatId) => {
        setArchivedChats(prev => {
            const chat = prev.find(c => c.id === chatId);
            if (!chat) return prev;
            setChats(c => [...c, { id: chat.id, title: chat.title, lastMsg: 'Restored from archive', time: 'Just now', folder: chat.folder, pinned: false, shared: false, favorite: false }]);
            return prev.filter(c => c.id !== chatId);
        });
    }, []);

    const restoreTrashedChat = useCallback((chatId) => {
        setTrashedChats(prev => {
            const chat = prev.find(c => c.id === chatId);
            if (!chat) return prev;
            setChats(c => [...c, { id: chat.id, title: chat.title, lastMsg: 'Restored from trash', time: 'Just now', folder: chat.folder, pinned: false, shared: false, favorite: false }]);
            return prev.filter(c => c.id !== chatId);
        });
    }, []);

    const permanentDeleteTrash = useCallback((chatId) => {
        setTrashedChats(prev => prev.filter(c => c.id !== chatId));
    }, []);

    const deleteArchivedChat = useCallback((chatId) => {
        setArchivedChats(prev => prev.filter(c => c.id !== chatId));
    }, []);

    const emptyTrash = useCallback(() => {
        setTrashedChats([]);
    }, []);

    // --- Folder CRUD ---
    const createFolder = useCallback((name) => {
        const maxId = folders.reduce((m, f) => Math.max(m, f.id), 0);
        const newFolder = { id: maxId + 1, name: name.trim() };
        setFolders(prev => [...prev, newFolder]);
        return newFolder.id;
    }, [folders]);

    const renameFolder = useCallback((folderId, name) => {
        setFolders(prev => prev.map(f => f.id === folderId ? { ...f, name: name.trim() } : f));
    }, []);

    const deleteFolder = useCallback((folderId) => {
        setFolders(prev => prev.filter(f => f.id !== folderId));
        setChats(prev => prev.map(c => c.folder === folderId ? { ...c, folder: null } : c));
    }, []);

    const moveChatToFolder = useCallback((chatId, folderId) => {
        setChats(prev => prev.map(c => c.id === chatId ? { ...c, folder: folderId } : c));
    }, []);

    return (
        <AiChatContext.Provider value={{
            chats, messages, archivedChats, trashedChats,
            sendingChatId, selectedModel, setSelectedModel,
            createNewChat, sendMessage,
            archiveChat, trashChat,
            restoreArchivedChat, restoreTrashedChat, permanentDeleteTrash,
            deleteArchivedChat, emptyTrash,
            folders, createFolder, renameFolder, deleteFolder, moveChatToFolder,
        }}>
            {children}
        </AiChatContext.Provider>
    );
};

export default AiChatContext;
