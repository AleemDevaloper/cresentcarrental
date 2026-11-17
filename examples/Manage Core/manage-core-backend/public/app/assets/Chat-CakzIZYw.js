import { o as __toESM } from "./rolldown-runtime-Bq5D3eIA.js";
import { Bs as faStar, Dl as require_jsx_runtime, Do as faPlus, Gn as faCopy, H as faArrowRotateRight, Ho as faReply, In as faCog, Jc as faUserPlus, Ma as faMessage, Or as faFaceSmile, Pa as faMicrophone, Qi as faImage, Qt as faCheck, V as faArrowRotateLeft, _c as faTrash, _l as faXmark, bl as useApp, cc as faThumbtack, ct as faBold, da as faLayerGroup, ds as faShare, en as faCheckDouble, ga as faList, go as faPhone, ia as faItalic, io as faPaperclip, kc as faUnderline, kr as faFile, ma as faLink, mr as faEllipsisH, oo as faPen, os as faSearch, ot as faBell, rn as faChevronLeft, ro as faPaperPlane, ru as require_react, sl as faVideo, vl as FontAwesomeIcon, vo as faPhotoFilm } from "./ai-BHgPkVLC.js";
import { qr as SectionHero } from "./fms-BQz62Xux.js";
import { P as listUsers } from "./superadmin-Cn5Mt1aQ.js";
import { G as sendChatMessage, H as getChannels, U as getChatMessages, V as getChannelMessages, W as sendChannelMessage } from "./tms-BZu3d1fQ.js";
//#region src/pages/comman/Chat.jsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var statusColors = {
	online: "#22c55e",
	away: "#eab308",
	busy: "#ef4444",
	offline: "#94a3b8",
	meeting: "#8b5cf6",
	remote: "#06b6d4",
	dnd: "#dc2626"
};
var getInitials = (name) => {
	if (!name) return "?";
	const parts = name.trim().split(/\s+/);
	return parts.length > 1 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0][0].toUpperCase();
};
var Avatar = ({ name, status, size = 40, src }) => {
	const initials = getInitials(name);
	const colors = [
		"#6366f1",
		"#8b5cf6",
		"#a855f7",
		"#ec4899",
		"#f43f5e",
		"#ef4444",
		"#f97316",
		"#eab308",
		"#22c55e",
		"#14b8a6",
		"#06b6d4",
		"#3b82f6"
	];
	const bgColor = colors[(name || "").length % colors.length];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "relative",
			flexShrink: 0,
			width: size,
			height: size
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				width: "100%",
				height: "100%",
				borderRadius: "50%",
				background: src ? `url(${src}) center/cover` : bgColor,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				color: "#fff",
				fontWeight: 600,
				fontSize: size * .38,
				userSelect: "none"
			},
			children: !src && initials
		}), status && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
			position: "absolute",
			bottom: 0,
			right: 0,
			width: size * .3,
			height: size * .3,
			borderRadius: "50%",
			backgroundColor: statusColors[status] || "#94a3b8",
			border: `2px solid #fff`,
			boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
		} })]
	});
};
var TeamAvatarStack = ({ members = [] }) => {
	const display = members.slice(0, 3);
	const overflow = members.length > 3 ? members.length - 3 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			display: "flex",
			alignItems: "center",
			flexShrink: 0
		},
		children: [display.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				marginLeft: i > 0 ? -8 : 0,
				zIndex: 3 - i,
				position: "relative"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					width: 28,
					height: 28,
					borderRadius: "50%",
					background: `hsl(${(m.name || "").length * 36}, 65%, 55%)`,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					color: "#fff",
					fontSize: 10,
					fontWeight: 600,
					border: "2px solid #fff"
				},
				children: getInitials(m.name)
			})
		}, i)), overflow > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				marginLeft: -8,
				zIndex: 0
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					width: 28,
					height: 28,
					borderRadius: "50%",
					background: "#e2e8f0",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					color: "#64748b",
					fontSize: 10,
					fontWeight: 600,
					border: "2px solid #fff"
				},
				children: ["+", overflow]
			})
		})]
	});
};
var MsgStatus = ({ status }) => {
	if (status === "sent") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		style: {
			color: "#94a3b8",
			fontSize: 12
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCheck })
	});
	if (status === "delivered") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		style: {
			color: "#94a3b8",
			fontSize: 12
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCheckDouble })
	});
	if (status === "read") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		style: {
			color: "#6366f1",
			fontSize: 12
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCheckDouble })
	});
	return null;
};
var reactionEmojis = [
	"👍",
	"❤️",
	"😂",
	"😮",
	"😢",
	"🙏"
];
var pickerEmojis = [
	"😀",
	"😂",
	"🥰",
	"😎",
	"🤔",
	"😴",
	"🥳",
	"😢",
	"😡",
	"🤩",
	"👍",
	"👎",
	"👏",
	"🙌",
	"💪",
	"🔥",
	"❤️",
	"💜",
	"💛",
	"💚",
	"💙",
	"⭐",
	"✨",
	"🎉",
	"🎊",
	"🎈",
	"🎁",
	"✅",
	"❌",
	"💯",
	"🔒",
	"🔓",
	"📌",
	"📎",
	"🔗",
	"📅",
	"📊",
	"📈",
	"💡",
	"🚀",
	"🎯"
];
var mockUsers = [
	{
		id: "u1",
		name: "Jenny Wilson",
		email: "jenny@example.com",
		role: "UI Designer",
		status: "online"
	},
	{
		id: "u2",
		name: "Albert Flores",
		email: "albert@example.com",
		role: "Developer",
		status: "away"
	},
	{
		id: "u3",
		name: "Marvin McKinney",
		email: "marvin@example.com",
		role: "PM",
		status: "busy"
	},
	{
		id: "u4",
		name: "Ronald Richards",
		email: "ronald@example.com",
		role: "Designer",
		status: "online"
	},
	{
		id: "u5",
		name: "Jerome Bell",
		email: "jerome@example.com",
		role: "Frontend Dev",
		status: "meeting"
	},
	{
		id: "u6",
		name: "Kathryn Murphy",
		email: "kathryn@example.com",
		role: "Backend Dev",
		status: "online"
	},
	{
		id: "u7",
		name: "Jacob Jones",
		email: "jacob@example.com",
		role: "QA",
		status: "remote"
	},
	{
		id: "u8",
		name: "Kristin Watson",
		email: "kristin@example.com",
		role: "Designer",
		status: "dnd"
	},
	{
		id: "u9",
		name: "Floyd Miles",
		email: "floyd@example.com",
		role: "DevOps",
		status: "offline"
	},
	{
		id: "u10",
		name: "Darrell Steward",
		email: "darrell@example.com",
		role: "Marketing",
		status: "online"
	}
];
var mockTeams = [
	{
		id: "t1",
		name: "Fillow Designer Team",
		description: "We share about daily life as designer in the world",
		members: mockUsers.slice(0, 4),
		lastMessage: "Hey Jenny, don't forget to prepare prototype for next week",
		lastTime: "2m ago",
		unread: 3
	},
	{
		id: "t2",
		name: "Product Development",
		description: "Sprint planning & execution",
		members: mockUsers.slice(2, 6),
		lastMessage: "Sprint review at 3pm today",
		lastTime: "15m ago",
		unread: 0
	},
	{
		id: "t3",
		name: "Marketing Team",
		description: "Campaign strategies",
		members: mockUsers.slice(5, 8),
		lastMessage: "Q3 campaign results are in!",
		lastTime: "1h ago",
		unread: 5
	}
];
var mockRecentChats = [
	{
		id: "c1",
		user: mockUsers[0],
		lastMessage: "Sure, I'll send the mockups by EOD",
		time: "2m ago",
		unread: 2,
		status: "online",
		read: false
	},
	{
		id: "c2",
		user: mockUsers[1],
		lastMessage: "Can you review my PR?",
		time: "5m ago",
		unread: 0,
		status: "away",
		read: true
	},
	{
		id: "c3",
		user: mockUsers[2],
		lastMessage: "Meeting moved to 4pm",
		time: "12m ago",
		unread: 1,
		status: "busy",
		read: false
	},
	{
		id: "c4",
		user: mockUsers[3],
		lastMessage: "New design system components are ready",
		time: "1h ago",
		unread: 0,
		status: "online",
		read: true
	},
	{
		id: "c5",
		user: mockUsers[4],
		lastMessage: "Deploying to staging now",
		time: "2h ago",
		unread: 0,
		status: "meeting",
		read: true
	},
	{
		id: "c6",
		user: mockUsers[5],
		lastMessage: "API documentation updated",
		time: "3h ago",
		unread: 0,
		status: "online",
		read: true
	},
	{
		id: "c7",
		user: mockUsers[6],
		lastMessage: "Tests are passing ✅",
		time: "5h ago",
		unread: 0,
		status: "remote",
		read: true
	},
	{
		id: "c8",
		user: mockUsers[7],
		lastMessage: "Need feedback on the new layout",
		time: "1d ago",
		unread: 0,
		status: "dnd",
		read: true
	}
];
var CHAT_CONVO_KEY = "mc_chat_conversations_v1";
var CHAT_MSG_KEY = "mc_chat_messages_v1";
var loadJSON = (key, fallback) => {
	try {
		const raw = localStorage.getItem(key);
		return raw ? JSON.parse(raw) : fallback;
	} catch {
		return fallback;
	}
};
var saveJSON = (key, value) => {
	try {
		localStorage.setItem(key, JSON.stringify(value));
	} catch {}
};
var formatBytes = (bytes = 0) => {
	if (!bytes) return "0 B";
	const units = [
		"B",
		"KB",
		"MB",
		"GB"
	];
	const idx = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
	return `${(bytes / Math.pow(1024, idx)).toFixed(idx ? 1 : 0)} ${units[idx]}`;
};
var getUserStatus = (user) => {
	if (user?.isOnline || user?.is_online) return "online";
	if (String(user?.status || "").toLowerCase() === "active") return "remote";
	return "offline";
};
var normalizeUser = (user) => ({
	id: String(user.id),
	name: user.name || [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email || "User",
	email: user.email || "",
	role: user.role_ref?.name || user.role || user.designation || "Team Member",
	status: getUserStatus(user),
	avatar: user.avatar || ""
});
var normalizeMessage = (msg) => ({
	...msg,
	id: msg.id || `m-${Date.now()}`,
	senderId: String(msg.senderId ?? msg.sender_id ?? msg.sender?.id ?? "system"),
	text: msg.text || "",
	time: msg.time || msg.createdAt || msg.created_at || (/* @__PURE__ */ new Date()).toISOString(),
	status: msg.status || "read",
	attachments: Array.isArray(msg.attachments) ? msg.attachments : [],
	bookmarked: !!msg.bookmarked
});
var seedConversations = () => [...mockTeams.map((t) => ({
	id: t.id,
	type: "team",
	name: t.name,
	description: t.description,
	members: t.members,
	lastMessage: t.lastMessage,
	lastTime: t.lastTime,
	unread: t.unread,
	read: true
})), ...mockRecentChats.map((c) => ({
	id: c.id,
	type: "dm",
	name: c.user.name,
	user: c.user,
	members: [c.user],
	lastMessage: c.lastMessage,
	time: c.time,
	unread: c.unread,
	read: c.read,
	status: c.user.status
}))];
function Chat() {
	const { currentUser, theme, addNotification } = useApp();
	const isDark = theme === "dark";
	const colors = {
		bg: "#ffffff",
		sidebarBg: "#f8f9fc",
		sidebarBorder: "#edf2f7",
		primary: "#7c3aed",
		primaryLight: "#ede9fe",
		primaryDark: "#6d28d9",
		text: "#1e293b",
		textSecondary: "#64748b",
		textMuted: "#94a3b8",
		border: "#e2e8f0",
		borderLight: "#f1f5f9",
		hoverBg: "#f1f5f9",
		activeBg: "#ede9fe",
		chatBg: "#f8fafc",
		msgIncoming: "#f1f5f9",
		msgOutgoing: "#1e293b",
		msgOutgoingText: "#ffffff",
		inputBg: "#f1f5f9",
		white: "#ffffff",
		shadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
		shadowMd: "0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -1px rgba(0,0,0,0.04)",
		shadowLg: "0 10px 15px -3px rgba(0,0,0,0.06), 0 4px 6px -2px rgba(0,0,0,0.04)",
		success: "#22c55e",
		warning: "#eab308",
		danger: "#ef4444"
	};
	if (isDark) {
		colors.bg = "#0f172a";
		colors.sidebarBg = "#1e293b";
		colors.sidebarBorder = "rgba(255,255,255,0.06)";
		colors.text = "#f1f5f9";
		colors.textSecondary = "#94a3b8";
		colors.textMuted = "#64748b";
		colors.border = "rgba(255,255,255,0.08)";
		colors.borderLight = "rgba(255,255,255,0.04)";
		colors.hoverBg = "rgba(255,255,255,0.04)";
		colors.activeBg = "rgba(124,58,237,0.15)";
		colors.chatBg = "#0f172a";
		colors.msgIncoming = "rgba(255,255,255,0.06)";
		colors.msgOutgoing = "#7c3aed";
		colors.msgOutgoingText = "#ffffff";
		colors.inputBg = "rgba(255,255,255,0.06)";
		colors.white = "#1e293b";
		colors.shadow = "0 1px 3px rgba(0,0,0,0.2)";
		colors.shadowMd = "0 4px 6px rgba(0,0,0,0.25)";
		colors.shadowLg = "0 10px 15px rgba(0,0,0,0.3)";
	}
	const [conversations, setConversations] = (0, import_react.useState)(() => {
		const saved = loadJSON(CHAT_CONVO_KEY, null);
		return saved && Array.isArray(saved) && saved.length ? saved : seedConversations();
	});
	const [messagesStore, setMessagesStore] = (0, import_react.useState)(() => loadJSON(CHAT_MSG_KEY, {}));
	const [activeConversation, setActiveConversation] = (0, import_react.useState)("");
	const [activeTab, setActiveTab] = (0, import_react.useState)("all");
	const messages = (0, import_react.useMemo)(() => Array.isArray(messagesStore[activeConversation]) ? messagesStore[activeConversation] : [], [messagesStore, activeConversation]);
	const [chatInput, setChatInput] = (0, import_react.useState)("");
	const [showEmojiPicker, setShowEmojiPicker] = (0, import_react.useState)(false);
	const [showReactionPicker, setShowReactionPicker] = (0, import_react.useState)(null);
	const [attachments, setAttachments] = (0, import_react.useState)([]);
	const [globalSearch, setGlobalSearch] = (0, import_react.useState)("");
	const [showSidebar, setShowSidebar] = (0, import_react.useState)(true);
	const [showDetails, setShowDetails] = (0, import_react.useState)(false);
	const [channels, setChannels] = (0, import_react.useState)([]);
	const [realUsers, setRealUsers] = (0, import_react.useState)([]);
	const [callState, setCallState] = (0, import_react.useState)(null);
	const [isRecording, setIsRecording] = (0, import_react.useState)(false);
	const [searchOnlyBookmarks, setSearchOnlyBookmarks] = (0, import_react.useState)(false);
	const [showNewChatModal, setShowNewChatModal] = (0, import_react.useState)(false);
	const [newChatType, setNewChatType] = (0, import_react.useState)("direct");
	const [newChatSelectedUsers, setNewChatSelectedUsers] = (0, import_react.useState)([]);
	const [newChatName, setNewChatName] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		const loadMeta = async () => {
			try {
				const ch = await getChannels();
				setChannels(Array.isArray(ch) ? ch : []);
				if (Array.isArray(ch) && ch.length > 0 && !activeConversation) setActiveConversation(ch[0].id);
			} catch {}
		};
		loadMeta();
	}, []);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const loadUsers = async () => {
			const users = await listUsers();
			if (cancelled) return;
			const normalized = (Array.isArray(users) ? users : []).map(normalizeUser).filter((user) => String(user.id) !== String(currentUser?.id || ""));
			setRealUsers(normalized.length ? normalized : mockUsers);
		};
		loadUsers();
		return () => {
			cancelled = true;
		};
	}, [currentUser?.id]);
	(0, import_react.useEffect)(() => {
		if (!realUsers.length) return;
		setConversations((prev) => {
			const existing = new Set(prev.map((c) => c.userId || c.user?.id).filter(Boolean).map(String));
			const additions = realUsers.filter((user) => !existing.has(String(user.id))).map((user) => ({
				id: `user-${user.id}`,
				type: "dm",
				name: user.name,
				userId: user.id,
				user,
				members: [user],
				lastMessage: "Start a conversation",
				time: "",
				unread: 0,
				read: true,
				status: user.status
			}));
			return additions.length ? [...prev, ...additions] : prev;
		});
	}, [realUsers]);
	const setConversationMessages = (0, import_react.useCallback)((msgs, convId = activeConversation) => {
		setMessagesStore((prev) => ({
			...prev,
			[convId]: typeof msgs === "function" ? msgs(prev[convId] || []) : Array.isArray(msgs) ? msgs : []
		}));
	}, [activeConversation]);
	(0, import_react.useEffect)(() => {
		saveJSON(CHAT_CONVO_KEY, conversations);
	}, [conversations]);
	(0, import_react.useEffect)(() => {
		saveJSON(CHAT_MSG_KEY, messagesStore);
	}, [messagesStore]);
	(0, import_react.useEffect)(() => {
		if (!activeConversation && conversations.length > 0) setActiveConversation(conversations[0].id);
	}, [conversations, activeConversation]);
	(0, import_react.useEffect)(() => {
		const loadMessages = async () => {
			if (!activeConversation) return;
			if (Array.isArray(messagesStore[activeConversation])) return;
			const channel = channels.find((c) => c.id === activeConversation);
			try {
				let msgs = [];
				if (channel) msgs = await getChannelMessages(channel.id);
				else msgs = await getChatMessages(activeConversation);
				setConversationMessages((Array.isArray(msgs) ? msgs : []).map(normalizeMessage), activeConversation);
			} catch {}
		};
		loadMessages();
	}, [
		activeConversation,
		channels,
		messagesStore,
		setConversationMessages
	]);
	const messagesEndRef = (0, import_react.useRef)(null);
	const chatInputRef = (0, import_react.useRef)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	const importInputRef = (0, import_react.useRef)(null);
	const emojiPickerRef = (0, import_react.useRef)(null);
	const searchInputRef = (0, import_react.useRef)(null);
	const mediaRecorderRef = (0, import_react.useRef)(null);
	const recordingChunksRef = (0, import_react.useRef)([]);
	(0, import_react.useEffect)(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);
	(0, import_react.useEffect)(() => {
		const handleClickOutside = (e) => {
			if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) setShowEmojiPicker(false);
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	(0, import_react.useEffect)(() => {
		const handleKeyDown = (e) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault();
				searchInputRef.current?.focus();
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, []);
	(0, import_react.useEffect)(() => () => {
		callState?.stream?.getTracks?.().forEach((track) => track.stop());
		mediaRecorderRef.current?.stream?.getTracks?.().forEach((track) => track.stop());
	}, [callState]);
	const conversation = (0, import_react.useCallback)((id) => {
		const found = conversations.find((c) => c.id === id);
		if (found) return found;
		const channel = channels.find((c) => c.id === id);
		if (channel) return {
			type: "team",
			id: channel.id,
			name: channel.name || channel.id,
			description: channel.description || "",
			members: [],
			lastMessage: "",
			time: "",
			unread: 0,
			read: true
		};
		return null;
	}, [conversations, channels])(activeConversation);
	const isTeam = conversation?.type === "team";
	const conversationUser = conversation?.type === "dm" ? conversation.user : null;
	const handleSendMessage = async () => {
		if (!chatInput.trim() && attachments.length === 0) return;
		if (!activeConversation) return;
		const text = chatInput.trim();
		const messageAttachments = attachments.map((file) => ({
			id: `att-${Date.now()}-${file.name}`,
			name: file.name || "Attachment",
			size: file.size || 0,
			type: file.type || "application/octet-stream",
			url: file.url || (file instanceof File || file instanceof Blob ? URL.createObjectURL(file) : "")
		}));
		const newMsg = {
			id: "m" + Date.now(),
			senderId: "me",
			text,
			attachments: messageAttachments,
			time: (/* @__PURE__ */ new Date()).toISOString(),
			status: "sent"
		};
		setConversationMessages([...messages, newMsg], activeConversation);
		setChatInput("");
		setAttachments([]);
		setConversations((prev) => prev.map((c) => c.id === activeConversation ? {
			...c,
			lastMessage: text || `${messageAttachments.length} attachment${messageAttachments.length > 1 ? "s" : ""}`,
			time: "now",
			lastTime: "now",
			read: true
		} : c));
		setTimeout(() => {
			setConversationMessages((prev) => prev.map((m) => m.id === newMsg.id ? {
				...m,
				status: "delivered"
			} : m), activeConversation);
		}, 500);
		setTimeout(() => {
			setConversationMessages((prev) => prev.map((m) => m.id === newMsg.id ? {
				...m,
				status: "read"
			} : m), activeConversation);
		}, 1500);
		const sync = async () => {
			try {
				const channel = channels.find((c) => c.id === activeConversation);
				if (channel) {
					await sendChannelMessage(channel.id, text, "text", []);
					const msgs = await getChannelMessages(channel.id);
					if (Array.isArray(msgs) && msgs.length) setConversationMessages(msgs.map(normalizeMessage), channel.id);
				} else {
					await sendChatMessage(activeConversation, text || "[Attachment]", messageAttachments.length ? "file" : "text", messageAttachments);
					const msgs = await getChatMessages(activeConversation);
					if (Array.isArray(msgs) && msgs.length) setConversationMessages(msgs.map(normalizeMessage), activeConversation);
				}
			} catch {}
		};
		sync();
	};
	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};
	const handleEmojiClick = (emoji) => {
		setChatInput((prev) => prev + emoji);
		setShowEmojiPicker(false);
		chatInputRef.current?.focus();
	};
	const handleReaction = (msgId, emoji) => {
		setMessagesStore((prev) => ({
			...prev,
			[activeConversation]: (prev[activeConversation] || []).map((m) => {
				if (m.id !== msgId) return m;
				const reactions = { ...m.reactions || {} };
				reactions[emoji] = (reactions[emoji] || 0) + 1;
				return {
					...m,
					reactions
				};
			})
		}));
		setShowReactionPicker(null);
	};
	const handleCreateNewChat = () => {
		if (newChatType === "direct" && newChatSelectedUsers.length === 1) {
			const selectedUser = newChatSelectedUsers[0];
			const chatId = "dm-" + selectedUser.id + "-" + Date.now();
			const newConv = {
				id: chatId,
				type: "dm",
				name: selectedUser.name,
				user: selectedUser,
				members: [selectedUser],
				lastMessage: "",
				time: "now",
				unread: 0,
				read: true,
				status: selectedUser.status
			};
			setConversations((prev) => [newConv, ...prev]);
			setMessagesStore((prev) => ({
				...prev,
				[chatId]: []
			}));
			setActiveConversation(chatId);
			setShowNewChatModal(false);
			setNewChatSelectedUsers([]);
			setNewChatName("");
			setNewChatType("direct");
			addNotification?.(`Started direct message with ${selectedUser.name}`, "success");
		} else if (newChatType === "group" && newChatSelectedUsers.length > 0 && newChatName.trim()) {
			const groupId = "group-" + Date.now();
			const newConv = {
				id: groupId,
				type: "team",
				name: newChatName.trim(),
				description: "New group chat",
				members: newChatSelectedUsers,
				lastMessage: "Group created",
				time: "now",
				unread: 0,
				read: true
			};
			setConversations((prev) => [newConv, ...prev]);
			setMessagesStore((prev) => ({
				...prev,
				[groupId]: []
			}));
			setActiveConversation(groupId);
			setShowNewChatModal(false);
			setNewChatSelectedUsers([]);
			setNewChatName("");
			setNewChatType("direct");
			addNotification?.(`Created group chat "${newChatName.trim()}"`, "success");
		} else addNotification?.(newChatType === "direct" ? "Please select a user" : "Please enter group name and select members", "warning");
	};
	const toggleUserSelection = (user) => {
		setNewChatSelectedUsers((prev) => prev.find((u) => u.id === user.id) ? prev.filter((u) => u.id !== user.id) : [...prev, user]);
	};
	const handleFileUpload = (e) => {
		const files = Array.from(e.target.files || []);
		setAttachments((prev) => [...prev, ...files]);
		e.target.value = "";
	};
	const insertAroundSelection = (before, after = before, placeholder = "text") => {
		const input = chatInputRef.current;
		if (!input) {
			setChatInput((prev) => `${prev}${before}${placeholder}${after}`);
			return;
		}
		const start = input.selectionStart || 0;
		const end = input.selectionEnd || 0;
		const selected = chatInput.slice(start, end) || placeholder;
		setChatInput(`${chatInput.slice(0, start)}${before}${selected}${after}${chatInput.slice(end)}`);
		requestAnimationFrame(() => {
			input.focus();
			input.setSelectionRange(start + before.length, start + before.length + selected.length);
		});
	};
	const handleComposerAction = (title) => {
		if (title === "Undo") document.execCommand?.("undo");
		if (title === "Redo") document.execCommand?.("redo");
		if (title === "Bold") insertAroundSelection("**", "**", "bold text");
		if (title === "Italic") insertAroundSelection("_", "_", "italic text");
		if (title === "Underline") insertAroundSelection("<u>", "</u>", "underlined text");
		if (title === "List") insertAroundSelection("\n- ", "", "list item");
		if (title === "Link") {
			const url = window.prompt("Paste link URL");
			if (url) insertAroundSelection("[", `](${url})`, "link text");
		}
	};
	const toggleMessageBookmark = (msgId) => {
		setConversationMessages((prev) => prev.map((m) => m.id === msgId ? {
			...m,
			bookmarked: !m.bookmarked
		} : m), activeConversation);
	};
	const handleMessageAction = async (action, msg) => {
		if (action === "Reply") {
			setChatInput((prev) => `> ${msg.text || "Attachment"}\n${prev}`);
			chatInputRef.current?.focus();
		}
		if (action === "Forward") {
			setChatInput((prev) => `${prev}${prev ? "\n" : ""}${msg.text}`);
			chatInputRef.current?.focus();
		}
		if (action === "Edit") {
			if (!isOwnMessage(msg)) return addNotification?.("You can only edit your own local messages.", "warning");
			setConversationMessages((prev) => prev.filter((m) => m.id !== msg.id), activeConversation);
			setChatInput(msg.text);
			chatInputRef.current?.focus();
		}
		if (action === "Delete") setConversationMessages((prev) => prev.filter((m) => m.id !== msg.id), activeConversation);
		if (action === "Pin") toggleMessageBookmark(msg.id);
		if (action === "Copy") {
			await navigator.clipboard?.writeText(msg.text || "");
			addNotification?.("Message copied", "success");
		}
	};
	const handleCall = async (type) => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: type === "video"
			});
			setCallState({
				type,
				startedAt: (/* @__PURE__ */ new Date()).toISOString(),
				stream
			});
			addNotification?.(`${type === "video" ? "Video" : "Voice"} call started.`, "success");
		} catch (err) {
			addNotification?.(err?.message || "Could not access microphone/camera.", "warning");
		}
	};
	const endCall = () => {
		callState?.stream?.getTracks?.().forEach((track) => track.stop());
		setCallState(null);
		addNotification?.("Call ended", "info");
	};
	const toggleRecording = async () => {
		if (isRecording) {
			mediaRecorderRef.current?.stop();
			return;
		}
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			recordingChunksRef.current = [];
			const recorder = new MediaRecorder(stream);
			recorder.ondataavailable = (event) => {
				if (event.data?.size) recordingChunksRef.current.push(event.data);
			};
			recorder.onstop = () => {
				stream.getTracks().forEach((track) => track.stop());
				const blob = new Blob(recordingChunksRef.current, { type: "audio/webm" });
				const file = new File([blob], `voice-note-${Date.now()}.webm`, { type: "audio/webm" });
				setAttachments((prev) => [...prev, file]);
				setIsRecording(false);
			};
			mediaRecorderRef.current = recorder;
			recorder.start();
			setIsRecording(true);
		} catch (err) {
			addNotification?.(err?.message || "Microphone permission is required for voice recording.", "warning");
		}
	};
	const handleImportHistory = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => {
			try {
				const imported = JSON.parse(String(reader.result || "{}"));
				if (imported.conversations) setConversations(imported.conversations);
				if (imported.messages) setMessagesStore(imported.messages);
				addNotification?.("Chat history imported.", "success");
			} catch {
				addNotification?.("Import failed. Please select a valid exported chat JSON file.", "danger");
			}
		};
		reader.readAsText(file);
		e.target.value = "";
	};
	const formatMessageTime = (timeStr) => {
		if (!timeStr) return "";
		return new Date(timeStr).toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit"
		});
	};
	const isOwnMessage = (msg) => msg.senderId === "me";
	const groupedMessages = (0, import_react.useMemo)(() => {
		const groups = [];
		let currentGroup = null;
		const q = globalSearch.trim().toLowerCase();
		(messages || []).filter((msg) => {
			if (searchOnlyBookmarks && !msg.bookmarked) return false;
			if (!q) return true;
			return (msg.text || "").toLowerCase().includes(q) || (msg.attachments || []).some((file) => (file.name || "").toLowerCase().includes(q));
		}).forEach((msg) => {
			if (msg.system) {
				if (currentGroup) {
					groups.push(currentGroup);
					currentGroup = null;
				}
				groups.push({
					type: "system",
					msg
				});
				return;
			}
			const isMine = isOwnMessage(msg);
			if (!currentGroup || currentGroup.senderId !== msg.senderId || currentGroup.type === "system") {
				if (currentGroup) groups.push(currentGroup);
				currentGroup = {
					type: "message",
					senderId: msg.senderId,
					isMine,
					messages: [msg]
				};
			} else currentGroup.messages.push(msg);
		});
		if (currentGroup) groups.push(currentGroup);
		return groups;
	}, [
		messages,
		globalSearch,
		searchOnlyBookmarks
	]);
	const senderNames = (0, import_react.useMemo)(() => {
		const map = {};
		[...mockUsers, ...realUsers].forEach((u) => {
			map[String(u.id)] = u.name;
		});
		if (currentUser?.id) map[String(currentUser.id)] = currentUser.name || "You";
		map["me"] = currentUser?.name || "You";
		map["system"] = "";
		return map;
	}, [currentUser, realUsers]);
	const headerIconBtn = {
		width: 36,
		height: 36,
		borderRadius: 10,
		border: "none",
		background: "transparent",
		cursor: "pointer",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: colors.textSecondary,
		fontSize: 16,
		position: "relative",
		transition: "all 0.15s"
	};
	const notificationBadge = (color) => ({
		position: "absolute",
		top: 2,
		right: 2,
		width: 16,
		height: 16,
		borderRadius: "50%",
		background: color,
		color: "#fff",
		fontSize: 9,
		fontWeight: 700,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		lineHeight: 1
	});
	const totalUnreadCount = (0, import_react.useMemo)(() => conversations.reduce((s, c) => s + (c.unread || 0), 0), [conversations]);
	const totalUnreadConversations = (0, import_react.useMemo)(() => conversations.filter((c) => c.unread > 0).length, [conversations]);
	const renderTopHeader = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			padding: "12px 28px",
			background: colors.bg,
			borderBottom: `1px solid ${colors.border}`,
			height: 64,
			flexShrink: 0,
			gap: 24
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				alignItems: "center",
				gap: 20,
				flex: 1,
				minWidth: 0
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				style: {
					fontSize: 22,
					fontWeight: 700,
					color: colors.text,
					margin: 0,
					letterSpacing: "-0.02em",
					whiteSpace: "nowrap"
				},
				children: "Messages"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "relative",
					flex: 1,
					maxWidth: 360,
					minWidth: 180
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faSearch,
						style: {
							position: "absolute",
							left: 12,
							top: "50%",
							transform: "translateY(-50%)",
							color: colors.textMuted,
							fontSize: 13,
							pointerEvents: "none"
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: searchInputRef,
						value: globalSearch,
						onChange: (e) => setGlobalSearch(e.target.value),
						placeholder: "Search messages, files, people...",
						style: {
							width: "100%",
							padding: "8px 34px 8px 34px",
							borderRadius: 10,
							border: `1px solid ${colors.border}`,
							background: colors.inputBg,
							fontSize: 13,
							color: colors.text,
							outline: "none",
							transition: "all 0.2s",
							boxSizing: "border-box"
						},
						onFocus: (e) => {
							e.target.style.borderColor = colors.primary;
							e.target.style.boxShadow = `0 0 0 3px ${colors.primaryLight}`;
						},
						onBlur: (e) => {
							e.target.style.borderColor = colors.border;
							e.target.style.boxShadow = "none";
						}
					}),
					!globalSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
						style: {
							position: "absolute",
							right: 8,
							top: "50%",
							transform: "translateY(-50%)",
							padding: "2px 6px",
							borderRadius: 4,
							border: `1px solid ${colors.border}`,
							background: colors.bg,
							fontSize: 10,
							color: colors.textMuted,
							fontFamily: "inherit",
							fontWeight: 500,
							lineHeight: 1.4,
							pointerEvents: "none",
							userSelect: "none"
						},
						children: navigator.platform?.includes("Mac") ? "⌘K" : "Ctrl+K"
					}),
					globalSearch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setGlobalSearch(""),
						style: {
							position: "absolute",
							right: 8,
							top: "50%",
							transform: "translateY(-50%)",
							background: "none",
							border: "none",
							cursor: "pointer",
							color: colors.textMuted,
							fontSize: 12,
							padding: 4,
							display: "flex",
							transition: "color 0.15s"
						},
						onMouseEnter: (e) => {
							e.currentTarget.style.color = colors.text;
						},
						onMouseLeave: (e) => {
							e.currentTarget.style.color = colors.textMuted;
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faXmark })
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				display: "flex",
				alignItems: "center",
				gap: 6
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					style: headerIconBtn,
					onMouseEnter: (e) => {
						e.currentTarget.style.background = colors.hoverBg;
						e.currentTarget.style.color = colors.text;
					},
					onMouseLeave: (e) => {
						e.currentTarget.style.background = "transparent";
						e.currentTarget.style.color = colors.textSecondary;
					},
					title: "Notifications",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faBell }), totalUnreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: notificationBadge(colors.danger),
						children: totalUnreadCount > 9 ? "9+" : totalUnreadCount
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					style: headerIconBtn,
					onMouseEnter: (e) => {
						e.currentTarget.style.background = colors.hoverBg;
						e.currentTarget.style.color = colors.text;
					},
					onMouseLeave: (e) => {
						e.currentTarget.style.background = "transparent";
						e.currentTarget.style.color = colors.textSecondary;
					},
					title: "Unread Conversations",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faMessage }), totalUnreadConversations > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: notificationBadge(colors.primary),
						children: totalUnreadConversations
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setShowDetails((prev) => !prev),
					style: {
						...headerIconBtn,
						color: showDetails ? colors.primary : colors.textSecondary,
						background: showDetails ? colors.activeBg : "transparent"
					},
					onMouseEnter: (e) => {
						if (!showDetails) {
							e.currentTarget.style.background = colors.hoverBg;
							e.currentTarget.style.color = colors.text;
						}
					},
					onMouseLeave: (e) => {
						if (!showDetails) {
							e.currentTarget.style.background = "transparent";
							e.currentTarget.style.color = colors.textSecondary;
						}
					},
					title: "Details Panel",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCog })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
					width: 1,
					height: 28,
					background: colors.border,
					margin: "0 4px"
				} }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
					name: currentUser?.name || "User",
					status: "online",
					size: 36
				})
			]
		})]
	});
	const teams = conversations.filter((c) => c.type === "team");
	const recentChats = conversations.filter((c) => c.type !== "team");
	const availableUsers = realUsers.length ? realUsers : mockUsers;
	const filteredTeams = (0, import_react.useMemo)(() => {
		if (!globalSearch.trim()) return teams;
		const q = globalSearch.toLowerCase();
		return teams.filter((t) => t.name.toLowerCase().includes(q) || (t.description || "").toLowerCase().includes(q) || (t.lastMessage || "").toLowerCase().includes(q) || (t.members || []).some((m) => m.name.toLowerCase().includes(q)));
	}, [globalSearch, teams]);
	const filteredRecentChats = (0, import_react.useMemo)(() => {
		if (!globalSearch.trim()) return recentChats;
		const q = globalSearch.toLowerCase();
		return recentChats.filter((c) => c.name.toLowerCase().includes(q) || (c.lastMessage || "").toLowerCase().includes(q));
	}, [globalSearch, recentChats]);
	const renderLeftSidebar = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: showSidebar ? 340 : 0,
			overflow: "hidden",
			transition: "width 0.2s ease",
			borderRight: `1px solid ${colors.sidebarBorder}`,
			background: colors.sidebarBg,
			display: "flex",
			flexDirection: "column",
			flexShrink: 0
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				padding: "20px 16px 12px",
				flexShrink: 0
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					marginBottom: 14
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: 8
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						style: {
							fontSize: 18,
							fontWeight: 700,
							color: colors.text,
							margin: 0,
							letterSpacing: "-0.01em"
						},
						children: "Inbox"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: {
							background: colors.primaryLight,
							color: colors.primary,
							fontSize: 11,
							fontWeight: 600,
							padding: "2px 8px",
							borderRadius: 10
						},
						children: filteredTeams.length + filteredRecentChats.length
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setShowNewChatModal(true),
					style: {
						width: 32,
						height: 32,
						borderRadius: "50%",
						border: "none",
						background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})`,
						color: "#fff",
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						fontSize: 14,
						boxShadow: `0 2px 8px ${colors.primary}44`,
						transition: "transform 0.15s"
					},
					onMouseEnter: (e) => {
						e.currentTarget.style.transform = "scale(1.1)";
					},
					onMouseLeave: (e) => {
						e.currentTarget.style.transform = "scale(1)";
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPlus })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					display: "flex",
					gap: 4,
					background: colors.borderLight,
					borderRadius: 10,
					padding: 3
				},
				children: [
					"All",
					"Social",
					"Updates",
					"Design"
				].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setActiveTab(tab.toLowerCase()),
					style: {
						flex: 1,
						padding: "6px 10px",
						borderRadius: 8,
						border: "none",
						background: activeTab === tab.toLowerCase() ? colors.primaryLight : "transparent",
						color: activeTab === tab.toLowerCase() ? colors.primary : colors.textSecondary,
						fontSize: 12,
						fontWeight: activeTab === tab.toLowerCase() ? 600 : 500,
						cursor: "pointer",
						transition: "all 0.15s"
					},
					children: tab
				}, tab))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				flex: 1,
				overflowY: "auto",
				padding: "0 8px"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: { padding: "4px 8px 8px" },
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							fontSize: 11,
							fontWeight: 600,
							color: colors.textMuted,
							textTransform: "uppercase",
							letterSpacing: "0.08em",
							marginBottom: 6,
							padding: "0 4px"
						},
						children: "Team"
					}),
					filteredTeams.length === 0 && globalSearch.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							padding: "16px 8px",
							textAlign: "center",
							fontSize: 12,
							color: colors.textMuted
						},
						children: "No teams match your search"
					}),
					filteredTeams.map((team) => {
						const isActive = activeConversation === team.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveConversation(team.id),
							style: {
								display: "flex",
								alignItems: "center",
								gap: 12,
								width: "100%",
								padding: "10px 12px",
								borderRadius: 12,
								border: "none",
								background: isActive ? colors.activeBg : "transparent",
								borderLeft: isActive ? `3px solid ${colors.primary}` : "3px solid transparent",
								cursor: "pointer",
								textAlign: "left",
								transition: "all 0.15s",
								marginBottom: 2
							},
							onMouseEnter: (e) => {
								if (!isActive) e.currentTarget.style.background = colors.hoverBg;
							},
							onMouseLeave: (e) => {
								if (!isActive) e.currentTarget.style.background = "transparent";
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamAvatarStack, { members: team.members }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									flex: 1,
									minWidth: 0
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											fontSize: 13,
											fontWeight: isActive ? 600 : 500,
											color: colors.text
										},
										children: team.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											fontSize: 11,
											color: colors.textMuted,
											whiteSpace: "nowrap"
										},
										children: team.lastTime
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										marginTop: 2
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											fontSize: 12,
											color: colors.textSecondary,
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap",
											maxWidth: 180
										},
										children: team.lastMessage
									}), team.unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											background: colors.primary,
											color: "#fff",
											fontSize: 10,
											fontWeight: 700,
											minWidth: 18,
											height: 18,
											borderRadius: 9,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											padding: "0 5px"
										},
										children: team.unread
									})]
								})]
							})]
						}, team.id);
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					padding: "8px",
					borderTop: `1px solid ${colors.borderLight}`
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							fontSize: 11,
							fontWeight: 600,
							color: colors.textMuted,
							textTransform: "uppercase",
							letterSpacing: "0.08em",
							marginBottom: 6,
							padding: "0 4px"
						},
						children: "Recent Message"
					}),
					filteredRecentChats.length === 0 && globalSearch.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							padding: "16px 8px",
							textAlign: "center",
							fontSize: 12,
							color: colors.textMuted
						},
						children: "No conversations match your search"
					}),
					filteredRecentChats.map((chat) => {
						const isActive = activeConversation === chat.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveConversation(chat.id),
							style: {
								display: "flex",
								alignItems: "center",
								gap: 10,
								width: "100%",
								padding: "9px 12px",
								borderRadius: 12,
								border: "none",
								background: isActive ? colors.activeBg : "transparent",
								cursor: "pointer",
								textAlign: "left",
								transition: "all 0.15s",
								marginBottom: 1
							},
							onMouseEnter: (e) => {
								if (!isActive) e.currentTarget.style.background = colors.hoverBg;
							},
							onMouseLeave: (e) => {
								if (!isActive) e.currentTarget.style.background = "transparent";
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
								name: chat.user.name,
								status: chat.status,
								size: 36,
								src: chat.user.avatar
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									flex: 1,
									minWidth: 0
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between"
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											fontSize: 13,
											fontWeight: isActive ? 600 : 500,
											color: colors.text
										},
										children: chat.user.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											fontSize: 11,
											color: colors.textMuted,
											whiteSpace: "nowrap"
										},
										children: chat.time
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: {
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										marginTop: 1
									},
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												fontSize: 12,
												color: colors.textSecondary,
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
												maxWidth: 170
											},
											children: chat.lastMessage
										}),
										chat.unread > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												background: colors.primary,
												color: "#fff",
												fontSize: 10,
												fontWeight: 700,
												minWidth: 18,
												height: 18,
												borderRadius: 9,
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												padding: "0 5px"
											},
											children: chat.unread
										}),
										chat.read && chat.unread === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												color: colors.textMuted,
												fontSize: 11
											},
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faCheckDouble })
										})
									]
								})]
							})]
						}, chat.id);
					})
				]
			})]
		})]
	});
	const renderChatHeader = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			display: "flex",
			alignItems: "center",
			justifyContent: "space-between",
			padding: "14px 24px",
			borderBottom: `1px solid ${colors.border}`,
			background: colors.bg,
			flexShrink: 0,
			minHeight: 64
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					alignItems: "center",
					gap: 12
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setShowSidebar(!showSidebar),
					style: {
						...headerIconBtn,
						fontSize: 14,
						display: "none"
					},
					className: "d-md-flex",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faChevronLeft })
				}), isTeam ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamAvatarStack, { members: conversation?.members || [] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						fontWeight: 600,
						fontSize: 15,
						color: colors.text
					},
					children: conversation?.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						fontSize: 12,
						color: colors.textSecondary
					},
					children: conversation?.description
				})] })] }) : conversationUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
					name: conversationUser.name,
					status: conversationUser.status,
					size: 40
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						fontWeight: 600,
						fontSize: 15,
						color: colors.text
					},
					children: conversationUser.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						fontSize: 12,
						color: colors.textSecondary
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						style: {
							display: "inline-flex",
							alignItems: "center",
							gap: 4
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
							width: 7,
							height: 7,
							borderRadius: "50%",
							backgroundColor: statusColors[conversationUser.status] || "#94a3b8",
							display: "inline-block"
						} }), conversationUser.status?.charAt(0).toUpperCase() + conversationUser.status?.slice(1)]
					})
				})] })] }) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					alignItems: "center",
					gap: 6
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => handleCall("video"),
						style: chatActionBtn,
						title: "Video Call",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faVideo })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => handleCall("voice"),
						style: chatActionBtn,
						title: "Voice Call",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPhone })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => searchInputRef.current?.focus(),
						style: chatActionBtn,
						title: "Search Messages",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faSearch })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setSearchOnlyBookmarks((prev) => !prev),
						style: {
							...chatActionBtn,
							color: searchOnlyBookmarks ? colors.primary : colors.textSecondary,
							background: searchOnlyBookmarks ? colors.activeBg : "transparent"
						},
						title: "Bookmarks",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faStar })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						style: chatActionBtn,
						title: "More",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faEllipsisH })
					})
				]
			}),
			callState && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					position: "absolute",
					right: 24,
					top: 78,
					zIndex: 50,
					padding: "10px 12px",
					borderRadius: 12,
					background: colors.bg,
					border: `1px solid ${colors.border}`,
					boxShadow: colors.shadowLg,
					display: "flex",
					alignItems: "center",
					gap: 10
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: callState.type === "video" ? faVideo : faPhone,
						style: { color: colors.primary }
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						style: {
							fontSize: 13,
							color: colors.text,
							fontWeight: 600
						},
						children: [callState.type === "video" ? "Video" : "Voice", " call active"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: endCall,
						style: {
							border: "none",
							background: colors.danger,
							color: "#fff",
							borderRadius: 8,
							padding: "6px 10px",
							fontSize: 12,
							fontWeight: 700,
							cursor: "pointer"
						},
						children: "End"
					})
				]
			})
		]
	});
	const chatActionBtn = {
		width: 34,
		height: 34,
		borderRadius: 9,
		border: `1px solid ${colors.border}`,
		background: "transparent",
		cursor: "pointer",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		color: colors.textSecondary,
		fontSize: 14,
		transition: "all 0.15s"
	};
	const renderSystemEvent = (msg) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			display: "flex",
			alignItems: "center",
			gap: 12,
			margin: "16px 0",
			padding: "0 8px"
		},
		children: msg.text && msg.text.includes("joined") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
				flex: 1,
				height: 1,
				background: colors.border
			} }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					alignItems: "center",
					gap: 8,
					padding: "6px 14px",
					borderRadius: 8,
					background: colors.borderLight
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
						icon: faUserPlus,
						style: {
							color: colors.textMuted,
							fontSize: 11
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: {
							fontSize: 12,
							color: colors.textSecondary
						},
						children: msg.text
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: {
							fontSize: 11,
							color: colors.textMuted
						},
						children: formatMessageTime(msg.time)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
				flex: 1,
				height: 1,
				background: colors.border
			} })
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			style: {
				textAlign: "center",
				width: "100%"
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					alignItems: "center",
					gap: 12,
					marginBottom: 8
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						flex: 1,
						height: 1,
						background: colors.border
					} }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: {
							fontSize: 11,
							color: colors.textMuted,
							fontWeight: 500,
							whiteSpace: "nowrap"
						},
						children: msg.text
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						flex: 1,
						height: 1,
						background: colors.border
					} })
				]
			})
		})
	});
	const renderMessageBubble = (msg, showSender) => {
		const isMine = isOwnMessage(msg);
		const senderName = senderNames[msg.senderId] || "Unknown";
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				marginBottom: 1,
				position: "relative"
			},
			onMouseEnter: (e) => {
				const r = e.currentTarget.querySelector(".msg-actions");
				if (r) r.style.opacity = "1";
			},
			onMouseLeave: (e) => {
				const r = e.currentTarget.querySelector(".msg-actions");
				if (r) r.style.opacity = "0";
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					flexDirection: isMine ? "row-reverse" : "row",
					alignItems: "flex-end",
					gap: 8,
					padding: "0 8px"
				},
				children: [
					showSender && !isMine && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						name: senderName,
						size: 28
					}),
					!showSender && !isMine && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						width: 28,
						flexShrink: 0
					} }),
					isMine && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						width: 28,
						flexShrink: 0
					} }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							maxWidth: "65%",
							minWidth: 60
						},
						children: [
							showSender && !isMine && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									fontSize: 12,
									fontWeight: 600,
									color: colors.text,
									marginBottom: 2,
									marginLeft: 2
								},
								children: senderName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									padding: "9px 14px",
									borderRadius: isMine ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
									background: isMine ? colors.msgOutgoing : colors.msgIncoming,
									color: isMine ? colors.msgOutgoingText : colors.text,
									fontSize: 13.5,
									lineHeight: 1.5,
									position: "relative",
									boxShadow: isMine ? `0 1px 2px rgba(0,0,0,0.05)` : "none"
								},
								children: [
									msg.text,
									(msg.attachments || []).map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: file.url || "#",
										download: file.name,
										style: {
											marginTop: 8,
											padding: "8px 10px",
											borderRadius: 10,
											display: "flex",
											alignItems: "center",
											gap: 8,
											color: isMine ? "#fff" : colors.text,
											background: isMine ? "rgba(255,255,255,0.14)" : colors.bg,
											textDecoration: "none",
											border: `1px solid ${isMine ? "rgba(255,255,255,0.18)" : colors.border}`
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: (file.type || "").startsWith("audio/") ? faMicrophone : faFile }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												style: {
													flex: 1,
													minWidth: 0,
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap"
												},
												children: file.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												style: {
													fontSize: 11,
													opacity: .72
												},
												children: formatBytes(file.size)
											})
										]
									}, file.id || file.name)),
									msg.text.includes("[Image Preview]") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											marginTop: 8,
											borderRadius: 10,
											overflow: "hidden",
											background: isDark ? "rgba(255,255,255,0.05)" : "#e2e8f0",
											padding: 20,
											textAlign: "center"
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
											icon: faImage,
											style: {
												fontSize: 24,
												color: colors.textMuted,
												marginBottom: 6
											}
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											style: {
												fontSize: 12,
												color: colors.textMuted
											},
											children: "Image Preview"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										style: {
											display: "flex",
											alignItems: "center",
											justifyContent: "flex-end",
											gap: 4,
											marginTop: 4
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											style: {
												fontSize: 11,
												color: isMine ? "rgba(255,255,255,0.6)" : colors.textMuted,
												lineHeight: 1
											},
											children: formatMessageTime(msg.time)
										}), isMine && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MsgStatus, { status: msg.status })]
									})
								]
							}),
							msg.reactions && Object.keys(msg.reactions).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								style: {
									display: "flex",
									gap: 3,
									marginTop: 4,
									marginLeft: isMine ? 0 : 4,
									flexWrap: "wrap"
								},
								children: [Object.entries(msg.reactions).map(([emoji, count]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => handleReaction(msg.id, emoji),
									style: {
										padding: "2px 6px",
										borderRadius: 6,
										border: `1px solid ${colors.border}`,
										background: colors.bg,
										cursor: "pointer",
										fontSize: 12,
										display: "flex",
										alignItems: "center",
										gap: 3,
										transition: "all 0.15s"
									},
									onMouseEnter: (e) => {
										e.currentTarget.style.background = colors.hoverBg;
									},
									onMouseLeave: (e) => {
										e.currentTarget.style.background = colors.bg;
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: emoji }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											fontSize: 11,
											color: colors.textSecondary
										},
										children: count
									})]
								}, emoji)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setShowReactionPicker(showReactionPicker === msg.id ? null : msg.id),
									style: {
										padding: "2px 6px",
										borderRadius: 6,
										border: `1px solid ${colors.border}`,
										background: "transparent",
										cursor: "pointer",
										fontSize: 11,
										color: colors.textMuted,
										display: "flex",
										alignItems: "center"
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFaceSmile })
								})]
							}),
							showReactionPicker === msg.id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									display: "flex",
									gap: 3,
									marginTop: 4,
									marginLeft: isMine ? 0 : 4,
									padding: "4px 8px",
									borderRadius: 8,
									background: colors.bg,
									border: `1px solid ${colors.border}`,
									boxShadow: colors.shadowMd
								},
								children: reactionEmojis.map((emoji) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleReaction(msg.id, emoji),
									style: {
										border: "none",
										background: "transparent",
										cursor: "pointer",
										fontSize: 16,
										padding: 2,
										borderRadius: 4,
										transition: "all 0.15s"
									},
									onMouseEnter: (e) => {
										e.currentTarget.style.background = colors.hoverBg;
									},
									onMouseLeave: (e) => {
										e.currentTarget.style.background = "transparent";
									},
									children: emoji
								}, emoji))
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "msg-actions",
				style: {
					position: "absolute",
					top: 4,
					right: isMine ? "auto" : 4,
					left: isMine ? 4 : "auto",
					display: "flex",
					gap: 2,
					opacity: 0,
					transition: "opacity 0.15s",
					background: colors.bg,
					borderRadius: 8,
					padding: 2,
					border: `1px solid ${colors.border}`,
					boxShadow: colors.shadow
				},
				children: [
					{
						icon: faReply,
						title: "Reply"
					},
					{
						icon: faShare,
						title: "Forward"
					},
					{
						icon: faPen,
						title: "Edit"
					},
					{
						icon: faTrash,
						title: "Delete"
					},
					{
						icon: faThumbtack,
						title: msg.bookmarked ? "Unpin" : "Pin"
					},
					{
						icon: faCopy,
						title: "Copy"
					}
				].map((action) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					title: action.title,
					onClick: () => handleMessageAction(action.title === "Unpin" ? "Pin" : action.title, msg),
					style: {
						width: 28,
						height: 28,
						borderRadius: 6,
						border: "none",
						background: "transparent",
						cursor: "pointer",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						color: colors.textSecondary,
						fontSize: 11,
						transition: "all 0.1s"
					},
					onMouseEnter: (e) => {
						e.currentTarget.style.background = colors.hoverBg;
						e.currentTarget.style.color = colors.text;
					},
					onMouseLeave: (e) => {
						e.currentTarget.style.background = "transparent";
						e.currentTarget.style.color = colors.textSecondary;
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: action.icon })
				}, action.title))
			})]
		}, msg.id);
	};
	const renderMessageArea = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			flex: 1,
			overflowY: "auto",
			padding: "16px 8px",
			background: colors.chatBg
		},
		children: [
			groupedMessages.map((group, idx) => {
				if (group.type === "system") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: renderSystemEvent(group.msg) }, "sys-" + idx);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: group.messages.map((msg, msgIdx) => {
					return renderMessageBubble(msg, msgIdx === 0);
				}) }, "g-" + idx);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					alignItems: "center",
					gap: 10,
					padding: "12px 16px",
					margin: "8px 8px 0"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
					name: "Albert Flores",
					size: 28
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						alignItems: "center",
						gap: 6
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: {
								fontSize: 13,
								fontWeight: 600,
								color: colors.text
							},
							children: "Albert Flores"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							style: {
								fontSize: 12,
								color: colors.textSecondary
							},
							children: "typing"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							style: {
								display: "flex",
								gap: 2
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
									width: 4,
									height: 4,
									borderRadius: "50%",
									background: colors.textMuted,
									animation: "none"
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
									width: 4,
									height: 4,
									borderRadius: "50%",
									background: colors.textMuted,
									animation: "none"
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: {
									width: 4,
									height: 4,
									borderRadius: "50%",
									background: colors.textMuted,
									animation: "none"
								} })
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: messagesEndRef })
		]
	});
	const renderComposer = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			borderTop: `1px solid ${colors.border}`,
			padding: "12px 20px 16px",
			background: colors.bg,
			flexShrink: 0
		},
		children: [
			attachments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					display: "flex",
					gap: 6,
					marginBottom: 8,
					flexWrap: "wrap"
				},
				children: attachments.map((file, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					style: {
						padding: "4px 10px",
						borderRadius: 8,
						background: colors.borderLight,
						fontSize: 11,
						color: colors.textSecondary,
						display: "flex",
						alignItems: "center",
						gap: 5,
						border: `1px solid ${colors.border}`
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: faFile,
							style: { fontSize: 11 }
						}),
						file.name || "File",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setAttachments((p) => p.filter((_, j) => j !== i)),
							style: {
								background: "none",
								border: "none",
								cursor: "pointer",
								padding: 0,
								display: "flex",
								color: colors.textMuted,
								fontSize: 11
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faXmark })
						})
					]
				}, i))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					border: `1px solid ${colors.border}`,
					borderRadius: 14,
					background: colors.bg,
					overflow: "hidden",
					boxShadow: colors.shadowMd,
					transition: "border-color 0.2s, box-shadow 0.2s"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						padding: "8px 10px 0",
						display: "flex",
						alignItems: "center",
						gap: 2,
						borderBottom: `1px solid ${colors.borderLight}`
					},
					children: [
						{
							icon: faArrowRotateLeft,
							title: "Undo"
						},
						{
							icon: faArrowRotateRight,
							title: "Redo"
						},
						{ type: "divider" },
						{
							icon: faBold,
							title: "Bold"
						},
						{
							icon: faItalic,
							title: "Italic"
						},
						{
							icon: faUnderline,
							title: "Underline"
						},
						{ type: "divider" },
						{
							icon: faList,
							title: "List"
						},
						{
							icon: faLink,
							title: "Link"
						}
					].map((item, i) => item.type === "divider" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
						width: 1,
						height: 18,
						background: colors.border,
						margin: "0 4px"
					} }, "d" + i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						title: item.title,
						onClick: () => handleComposerAction(item.title),
						style: {
							width: 30,
							height: 30,
							borderRadius: 6,
							border: "none",
							background: "transparent",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: colors.textSecondary,
							fontSize: 13,
							transition: "all 0.15s"
						},
						onMouseEnter: (e) => {
							e.currentTarget.style.background = colors.hoverBg;
							e.currentTarget.style.color = colors.text;
						},
						onMouseLeave: (e) => {
							e.currentTarget.style.background = "transparent";
							e.currentTarget.style.color = colors.textSecondary;
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: item.icon })
					}, i))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						alignItems: "flex-end",
						gap: 8,
						padding: "8px 12px"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								gap: 2,
								alignItems: "center"
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setShowEmojiPicker(!showEmojiPicker),
									style: {
										width: 34,
										height: 34,
										borderRadius: 8,
										border: "none",
										background: "transparent",
										cursor: "pointer",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: colors.textSecondary,
										fontSize: 16,
										transition: "all 0.15s"
									},
									onMouseEnter: (e) => {
										e.currentTarget.style.background = colors.hoverBg;
									},
									onMouseLeave: (e) => {
										e.currentTarget.style.background = "transparent";
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faFaceSmile })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => fileInputRef.current?.click(),
									style: {
										width: 34,
										height: 34,
										borderRadius: 8,
										border: "none",
										background: "transparent",
										cursor: "pointer",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: colors.textSecondary,
										fontSize: 15,
										transition: "all 0.15s"
									},
									onMouseEnter: (e) => {
										e.currentTarget.style.background = colors.hoverBg;
									},
									onMouseLeave: (e) => {
										e.currentTarget.style.background = "transparent";
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPaperclip })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: toggleRecording,
									style: {
										width: 34,
										height: 34,
										borderRadius: 8,
										border: "none",
										background: "transparent",
										cursor: "pointer",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										color: isRecording ? colors.danger : colors.textSecondary,
										fontSize: 15,
										transition: "all 0.15s"
									},
									onMouseEnter: (e) => {
										e.currentTarget.style.background = colors.hoverBg;
									},
									onMouseLeave: (e) => {
										e.currentTarget.style.background = "transparent";
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faMicrophone })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									ref: fileInputRef,
									type: "file",
									multiple: true,
									style: { display: "none" },
									onChange: handleFileUpload
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								flex: 1,
								position: "relative"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								ref: chatInputRef,
								value: chatInput,
								onChange: (e) => setChatInput(e.target.value),
								onKeyDown: handleKeyDown,
								placeholder: "Write a message...",
								rows: 1,
								style: {
									width: "100%",
									padding: "9px 4px",
									border: "none",
									resize: "none",
									fontSize: 13.5,
									color: colors.text,
									background: "transparent",
									outline: "none",
									fontFamily: "inherit",
									lineHeight: 1.5,
									maxHeight: 120
								},
								onInput: (e) => {
									e.target.style.height = "auto";
									e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
								}
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleSendMessage,
							disabled: !chatInput.trim() && attachments.length === 0,
							style: {
								width: 38,
								height: 38,
								borderRadius: "50%",
								border: "none",
								background: chatInput.trim() || attachments.length > 0 ? `linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark})` : colors.borderLight,
								color: chatInput.trim() || attachments.length > 0 ? "#fff" : colors.textMuted,
								cursor: chatInput.trim() || attachments.length > 0 ? "pointer" : "default",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								fontSize: 15,
								flexShrink: 0,
								transition: "all 0.2s",
								boxShadow: chatInput.trim() || attachments.length > 0 ? `0 2px 8px ${colors.primary}44` : "none"
							},
							onMouseEnter: (e) => {
								if (chatInput.trim() || attachments.length > 0) e.currentTarget.style.transform = "scale(1.05)";
							},
							onMouseLeave: (e) => {
								if (chatInput.trim() || attachments.length > 0) e.currentTarget.style.transform = "scale(1)";
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPaperPlane })
						})
					]
				})]
			}),
			showEmojiPicker && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: emojiPickerRef,
				style: {
					position: "absolute",
					bottom: "100%",
					right: 24,
					background: colors.bg,
					borderRadius: 14,
					border: `1px solid ${colors.border}`,
					boxShadow: colors.shadowLg,
					padding: 12,
					zIndex: 100,
					marginBottom: 8
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					style: {
						display: "grid",
						gridTemplateColumns: "repeat(7, 1fr)",
						gap: 4
					},
					children: pickerEmojis.map((emoji) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => handleEmojiClick(emoji),
						style: {
							width: 34,
							height: 34,
							border: "none",
							background: "transparent",
							borderRadius: 8,
							cursor: "pointer",
							fontSize: 20,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							transition: "all 0.1s"
						},
						onMouseEnter: (e) => {
							e.currentTarget.style.background = colors.hoverBg;
						},
						onMouseLeave: (e) => {
							e.currentTarget.style.background = "transparent";
						},
						children: emoji
					}, emoji))
				})
			})
		]
	});
	const renderEmptyState = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			flex: 1,
			display: "flex",
			flexDirection: "column",
			alignItems: "center",
			justifyContent: "center",
			gap: 16,
			padding: 40,
			background: colors.chatBg
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					width: 80,
					height: 80,
					borderRadius: 20,
					background: colors.primaryLight,
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					color: colors.primary,
					fontSize: 32
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faMessage })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				style: {
					fontSize: 20,
					fontWeight: 600,
					color: colors.text,
					margin: 0
				},
				children: "Select a conversation"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				style: {
					fontSize: 14,
					color: colors.textSecondary,
					textAlign: "center",
					maxWidth: 300,
					margin: 0
				},
				children: "Choose a team or person from the left panel to start messaging"
			})
		]
	});
	const sharedFiles = (0, import_react.useMemo)(() => (messages || []).flatMap((msg) => (msg.attachments || []).map((file) => ({
		...file,
		messageId: msg.id
	}))), [messages]);
	const bookmarkedMessages = (0, import_react.useMemo)(() => (messages || []).filter((msg) => msg.bookmarked), [messages]);
	const voiceNotes = (0, import_react.useMemo)(() => sharedFiles.filter((file) => (file.type || "").startsWith("audio/")), [sharedFiles]);
	const renderRightDetails = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			width: showDetails ? 300 : 0,
			overflow: "hidden",
			transition: "width 0.2s ease",
			borderLeft: `1px solid ${colors.border}`,
			background: colors.bg,
			display: "flex",
			flexDirection: "column",
			flexShrink: 0
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					padding: "16px",
					borderBottom: `1px solid ${colors.border}`,
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between"
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					style: {
						fontSize: 14,
						fontWeight: 600,
						color: colors.text
					},
					children: "Details"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setShowDetails(false),
					style: {
						...headerIconBtn,
						fontSize: 14
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faXmark })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					padding: "16px",
					textAlign: "center",
					borderBottom: `1px solid ${colors.borderLight}`
				},
				children: [
					isTeam ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeamAvatarStack, { members: conversation?.members || [] }) : conversationUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
						name: conversationUser.name,
						status: conversationUser.status,
						size: 64
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							fontWeight: 600,
							fontSize: 15,
							color: colors.text,
							marginTop: 8
						},
						children: conversation?.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							fontSize: 12,
							color: colors.textSecondary,
							marginTop: 2
						},
						children: conversation?.description
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					flex: 1,
					overflowY: "auto",
					padding: "12px 16px"
				},
				children: [
					isTeam && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: { marginBottom: 16 },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								fontSize: 11,
								fontWeight: 600,
								color: colors.textMuted,
								textTransform: "uppercase",
								letterSpacing: "0.08em",
								marginBottom: 8
							},
							children: [
								"Members (",
								conversation?.members?.length || 0,
								")"
							]
						}), conversation?.members?.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: 8,
								padding: "6px 0"
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
								name: m.name,
								status: m.status,
								size: 28
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									fontSize: 13,
									fontWeight: 500,
									color: colors.text
								},
								children: m.name
							})]
						}, i))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: { marginBottom: 16 },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							style: {
								fontSize: 11,
								fontWeight: 600,
								color: colors.textMuted,
								textTransform: "uppercase",
								letterSpacing: "0.08em",
								marginBottom: 8
							},
							children: "Shared Files"
						}), (sharedFiles.length ? sharedFiles : [{
							name: "No shared files yet",
							size: 0,
							icon: faFile
						}]).map((file, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: file.url || "#",
							download: file.url ? file.name : void 0,
							style: {
								display: "flex",
								alignItems: "center",
								gap: 8,
								padding: "8px 0",
								cursor: file.url ? "pointer" : "default",
								textDecoration: "none"
							},
							onMouseEnter: (e) => {
								e.currentTarget.style.background = colors.hoverBg;
							},
							onMouseLeave: (e) => {
								e.currentTarget.style.background = "transparent";
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									width: 32,
									height: 32,
									borderRadius: 8,
									background: colors.primaryLight,
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									color: colors.primary,
									fontSize: 14
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: file.icon })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									fontSize: 13,
									fontWeight: 500,
									color: colors.text
								},
								children: file.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								style: {
									fontSize: 11,
									color: colors.textMuted
								},
								children: file.size ? formatBytes(file.size) : ""
							})] })]
						}, i))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							fontSize: 11,
							fontWeight: 600,
							color: colors.textMuted,
							textTransform: "uppercase",
							letterSpacing: "0.08em",
							marginBottom: 8
						},
						children: "Quick Links"
					}), [
						{
							label: `Pinned Messages (${bookmarkedMessages.length})`,
							icon: faThumbtack,
							action: () => {
								setSearchOnlyBookmarks(true);
								searchInputRef.current?.focus();
							}
						},
						{
							label: `Media Gallery (${sharedFiles.length})`,
							icon: faPhotoFilm,
							action: () => setShowDetails(true)
						},
						{
							label: `Voice Notes (${voiceNotes.length})`,
							icon: faMicrophone,
							action: () => setGlobalSearch("voice-note")
						}
					].map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: link.action,
						style: {
							display: "flex",
							alignItems: "center",
							gap: 8,
							padding: "8px 0",
							cursor: "pointer",
							color: colors.textSecondary,
							fontSize: 13,
							background: "transparent",
							border: "none",
							width: "100%",
							textAlign: "left"
						},
						onMouseEnter: (e) => {
							e.currentTarget.style.color = colors.primary;
						},
						onMouseLeave: (e) => {
							e.currentTarget.style.color = colors.textSecondary;
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, {
							icon: link.icon,
							style: {
								width: 16,
								fontSize: 13
							}
						}), link.label]
					}, link.label))] })
				]
			})
		]
	});
	const renderNewChatModal = () => showNewChatModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: {
			position: "fixed",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			background: "rgba(0,0,0,0.5)",
			zIndex: 1e3,
			display: "flex",
			alignItems: "center",
			justifyContent: "center"
		},
		onClick: () => setShowNewChatModal(false),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				background: colors.bg,
				borderRadius: 16,
				width: "90%",
				maxWidth: 500,
				padding: 20,
				boxShadow: colors.shadowLg,
				maxHeight: "min(580px, 82vh)",
				overflowY: "auto"
			},
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						marginBottom: 16
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						style: {
							fontSize: 22,
							fontWeight: 700,
							color: colors.text,
							margin: 0
						},
						children: "Start New Chat"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setShowNewChatModal(false),
						style: {
							background: "none",
							border: "none",
							fontSize: 24,
							cursor: "pointer",
							color: colors.textSecondary
						},
						children: "×"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: { marginBottom: 14 },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						style: {
							display: "block",
							fontSize: 13,
							fontWeight: 600,
							color: colors.text,
							marginBottom: 8,
							textTransform: "uppercase",
							letterSpacing: "0.05em"
						},
						children: "Chat Type"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							gap: 12
						},
						children: [{
							id: "direct",
							label: "Direct Message",
							icon: faMessage
						}, {
							id: "group",
							label: "Group Chat",
							icon: faLayerGroup
						}].map((type) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								setNewChatType(type.id);
								setNewChatSelectedUsers([]);
								setNewChatName("");
							},
							style: {
								flex: 1,
								padding: "12px 16px",
								borderRadius: 10,
								border: newChatType === type.id ? `2px solid ${colors.primary}` : `1px solid ${colors.border}`,
								background: newChatType === type.id ? colors.primaryLight : colors.inputBg,
								color: newChatType === type.id ? colors.primary : colors.text,
								fontWeight: 600,
								fontSize: 13,
								cursor: "pointer",
								transition: "all 0.2s",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								gap: 8
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: type.icon }),
								" ",
								type.label
							]
						}, type.id))
					})]
				}),
				newChatType === "group" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: { marginBottom: 14 },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						style: {
							display: "block",
							fontSize: 13,
							fontWeight: 600,
							color: colors.text,
							marginBottom: 8
						},
						children: "Group Name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: newChatName,
						onChange: (e) => setNewChatName(e.target.value),
						placeholder: "Enter group name",
						style: {
							width: "100%",
							padding: "10px 12px",
							borderRadius: 10,
							border: `1px solid ${colors.border}`,
							background: colors.inputBg,
							color: colors.text,
							fontSize: 13,
							outline: "none",
							boxSizing: "border-box"
						}
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: { marginBottom: 14 },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						style: {
							display: "block",
							fontSize: 13,
							fontWeight: 600,
							color: colors.text,
							marginBottom: 8
						},
						children: newChatType === "direct" ? "Select User" : "Select Members"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							maxHeight: 190,
							overflowY: "auto",
							border: `1px solid ${colors.border}`,
							borderRadius: 10,
							background: colors.inputBg,
							padding: 8
						},
						children: availableUsers.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => newChatType === "direct" ? setNewChatSelectedUsers([user]) : toggleUserSelection(user),
							style: {
								display: "flex",
								alignItems: "center",
								gap: 12,
								padding: "10px 12px",
								borderRadius: 8,
								cursor: "pointer",
								background: newChatSelectedUsers.find((u) => u.id === user.id) ? colors.activeBg : "transparent",
								transition: "all 0.2s"
							},
							onMouseEnter: (e) => {
								if (!newChatSelectedUsers.find((u) => u.id === user.id)) e.currentTarget.style.background = colors.hoverBg;
							},
							onMouseLeave: (e) => {
								if (!newChatSelectedUsers.find((u) => u.id === user.id)) e.currentTarget.style.background = "transparent";
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: !!newChatSelectedUsers.find((u) => u.id === user.id),
									onChange: () => newChatType === "direct" ? setNewChatSelectedUsers([user]) : toggleUserSelection(user),
									style: { cursor: "pointer" }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar, {
									name: user.name,
									status: user.status,
									size: 32,
									src: user.avatar
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									style: { flex: 1 },
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											fontSize: 13,
											fontWeight: 500,
											color: colors.text
										},
										children: user.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										style: {
											fontSize: 11,
											color: colors.textSecondary
										},
										children: user.role
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: {
									width: 8,
									height: 8,
									borderRadius: "50%",
									background: statusColors[user.status]
								} })
							]
						}, user.id))
					})]
				}),
				newChatSelectedUsers.length > 0 && newChatType === "group" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: { marginBottom: 14 },
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						style: {
							fontSize: 12,
							fontWeight: 600,
							color: colors.textSecondary,
							marginBottom: 8
						},
						children: [
							"Selected (",
							newChatSelectedUsers.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							display: "flex",
							flexWrap: "wrap",
							gap: 8
						},
						children: newChatSelectedUsers.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							style: {
								display: "flex",
								alignItems: "center",
								gap: 6,
								padding: "6px 10px",
								background: colors.primaryLight,
								color: colors.primary,
								borderRadius: 20,
								fontSize: 12,
								fontWeight: 500
							},
							children: [user.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => toggleUserSelection(user),
								style: {
									background: "none",
									border: "none",
									color: colors.primary,
									cursor: "pointer",
									fontSize: 14,
									marginLeft: 4
								},
								children: "×"
							})]
						}, user.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					style: {
						display: "flex",
						gap: 12
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setShowNewChatModal(false),
						style: {
							flex: 1,
							padding: "12px 16px",
							borderRadius: 10,
							border: `1px solid ${colors.border}`,
							background: "transparent",
							color: colors.text,
							fontWeight: 600,
							fontSize: 13,
							cursor: "pointer",
							transition: "all 0.2s"
						},
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleCreateNewChat,
						style: {
							flex: 1,
							padding: "12px 16px",
							borderRadius: 10,
							border: "none",
							background: colors.primary,
							color: "#fff",
							fontWeight: 600,
							fontSize: 13,
							cursor: "pointer",
							transition: "all 0.2s"
						},
						children: "Start Chat"
					})]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-5 text-start animate-fade-in",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHero, {
				title: "Team Chat",
				subtitle: "Real-time team messaging, voice, and video collaboration for your organisation.",
				badge: "Messaging",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						className: "btn btn-primary text-white fw-bold d-flex align-items-center gap-2 border-0 px-4 py-2",
						style: {
							background: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
							borderRadius: "10px",
							boxShadow: "0 4px 15px rgba(59,130,246,0.22)"
						},
						onClick: () => setShowNewChatModal(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FontAwesomeIcon, { icon: faPlus }), " New Chat"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "btn btn-outline-light fw-bold px-3 py-2",
						style: {
							borderRadius: 10,
							border: "1px solid rgba(0,0,0,0.06)"
						},
						onClick: () => importInputRef.current?.click(),
						children: "Import History"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: importInputRef,
						type: "file",
						accept: "application/json,.json",
						style: { display: "none" },
						onChange: handleImportHistory
					})
				] }),
				isDark
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			style: {
				height: "calc(100vh - 120px)",
				display: "flex",
				flexDirection: "column",
				background: colors.bg,
				color: colors.text,
				overflow: "hidden",
				fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
				borderRadius: 14,
				boxShadow: colors.shadowLg,
				border: `1px solid ${colors.border}`
			},
			children: [renderTopHeader(), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				style: {
					flex: 1,
					display: "flex",
					overflow: "hidden"
				},
				children: [
					renderLeftSidebar(),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						style: {
							flex: 1,
							display: "flex",
							flexDirection: "column",
							overflow: "hidden",
							minWidth: 0
						},
						children: activeConversation ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							renderChatHeader(),
							renderMessageArea(),
							renderComposer()
						] }) : renderEmptyState()
					}),
					renderRightDetails()
				]
			})]
		}),
		renderNewChatModal()
	] });
}
//#endregion
export { Chat as default };
