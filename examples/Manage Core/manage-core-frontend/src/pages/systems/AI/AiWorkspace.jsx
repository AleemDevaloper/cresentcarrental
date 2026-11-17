import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useApp } from '../../../hooks/useApp';
import { useTranslation } from '../../../hooks/useTranslation';
import { useAiChat } from '../../../context/AiChatContext';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';
import { EnableDisableButton } from '../../../components/common';
import { getProviderModels, getAiUsageStats, getAiTrainingDashboard } from '../../../api/ai';
import {
  listAiTrainingModels, createAiTrainingModel, updateAiTrainingModel, deleteAiTrainingModel,
  listAiTrainingDatasets, uploadAiTrainingDataset, deleteAiTrainingDataset,
  startAiTraining, getAiTrainingStatus, stopAiTraining, listAiTrainingSessions,
  listAiTrainingAgents, createAiTrainingAgent, updateAiTrainingAgent, deleteAiTrainingAgent,
} from '../../../api/ai';
import {
  faBrain,
  faPlus,
  faSearch,
  faFolder,
  faFolderOpen,
  faComments,
  faChevronDown,
  faChevronRight,
  faThumbtack,
  faShare,
  faStar,
  faArchive,
  faTrash,
  faEdit,
  faCopy,
  faPlay,
  faDownload,
  faVolumeUp,
  faThumbsUp,
  faThumbsDown,
  faLanguage,
  faBookOpen,
  faMicrophone,
  faUpload,
  faEllipsisV,
  faCheck,
  faPaperclip,
  faTimes,
  faSliders,
  faCog,
  faTools,
  faCodeBranch,
  faLink,
  faSitemap,
  faProjectDiagram,
  faTasks,
  faFileAlt,
  faUsers,
  faChartLine,
  faBolt,
  faDatabase,
  faLock,
  faShieldAlt,
  faGlobe,
  faBuilding,
  faClock,
  faRobot,
  faListCheck,
  faFileInvoice,
  faMicrochip,
  faUndo,
  faCheckCircle,
  faChevronLeft,
  faEye,
  faUserPlus,
  faArrowRotateRight,
  faTrashAlt,
  faExclamationTriangle,
  faPlayCircle,
  faGraduationCap,
  faStopCircle,
  faSync,
  faDumbbell,
  faCubes,
  faClipboardList,
  faServer,
  faChartArea,
  faWaveSquare,
  faChartPie,
} from "@fortawesome/free-solid-svg-icons";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { motion, AnimatePresence } from "framer-motion";
import './AiWorkspace.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const AiWorkspace = () => {
  const { activeTab, setActiveTab, theme, currentUser } = useApp();
  const { t } = useTranslation();
  const isDark = theme === 'dark';
  const {
    chats, messages, archivedChats, trashedChats,
    sendingChatId, selectedModel, setSelectedModel,
    createNewChat, sendMessage,
    archiveChat, trashChat,
    restoreArchivedChat, restoreTrashedChat, permanentDeleteTrash,
    deleteArchivedChat, emptyTrash,
    folders, createFolder, renameFolder, deleteFolder, moveChatToFolder,
  } = useAiChat();

  // --- Dynamic model list from backend ---
  const [availableModels, setAvailableModels] = useState([]);

  useEffect(() => {
    getProviderModels().then(setAvailableModels).catch(() => {
      setAvailableModels([
        { id: 'openrouter/free', name: 'OpenRouter Free' },
        { id: 'google/gemma-4-26b-a4b-it:free', name: 'Gemma 4 26B' },
        { id: 'openai/gpt-oss-20b:free', name: 'GPT OSS 20B' },
        { id: 'nvidia/nemotron-3-super-120b-a12b:free', name: 'Nemotron 3 Super' },
      ]);
    });
  }, []);

  // --- Real AI Usage Data ---
  const [usageStats, setUsageStats] = useState(null);
  const [trainingDashboard, setTrainingDashboard] = useState(null);

  useEffect(() => {
    getAiUsageStats().then(res => setUsageStats(res?.stats || res)).catch(() => {});
    getAiTrainingDashboard().then(setTrainingDashboard).catch(() => {});
  }, [activeTab]);

  // --- Core State Variables ---
  const [chatSearch, setChatSearch] = useState('');
  const [activeChatId, setActiveChatId] = useState(chats.length > 0 ? chats[0].id : null);
  const [promptText, setPromptText] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [showSlash, setShowSlash] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [activeContextTab, setActiveContextTab] = useState('Project');
  const [isRecording, setIsRecording] = useState(false);

  // Folder management state
  const [activeFolderId, setActiveFolderId] = useState(null);
  const [newFolderDialog, setNewFolderDialog] = useState({ show: false });
  const [renameFolderDialog, setRenameFolderDialog] = useState({ show: false, folder: null });
  const [deleteFolderDialog, setDeleteFolderDialog] = useState({ show: false, folder: null });

  // Expandable Folders & Projects navigation lists
  const [expandedFolders, setExpandedFolders] = useState({ folders: true, projects: true, marketing: false, development: false });
  const [activeProjectContext, setActiveProjectContext] = useState('ManageCore PMS');

  // --- Claude-style Projects State ---
  const [projects, setProjects] = useState([
    { id: 1, name: 'ManageCore Website Redesign', description: 'Custom assistant context for building the marketing website and UI widgets.', instructions: 'Respond in clean Vite/React JS snippets. Avoid plain CSS, prefer Tailwind. Use active professional style.', docsCount: 5, chatsCount: 12, membersCount: 4 },
    { id: 2, name: 'HR Recruitment SOPs', description: 'Internal guidelines for building job descriptions and personnel onboarding plans.', instructions: 'Keep writing style corporate, compliant with EEOC guidelines, and friendly.', docsCount: 8, chatsCount: 4, membersCount: 2 },
    { id: 3, name: 'Q2 Finance Audit Preparation', description: 'Parsing accounting general ledgers and balance sheet reconciliation logs.', instructions: 'Always output tables for monetary details. Flag compliance anomalies in high priority block quotes.', docsCount: 14, chatsCount: 19, membersCount: 5 }
  ]);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectInst, setNewProjectInst] = useState('');

  // --- Shared Chats State ---
  const [sharedChats, setSharedChats] = useState([
    { id: 301, title: 'Sprint 5 Timeline Proposal', sharedBy: 'Tony Stark', department: 'Engineering', views: 24, likes: 8, time: '2 hours ago', comments: [{ user: 'Bruce', text: 'Looks perfect for Gantt chart scope.' }] },
    { id: 302, title: 'Bylaws & Compliance SOP', sharedBy: 'Natasha Romanoff', department: 'Legal', views: 42, likes: 15, time: '1 day ago', comments: [] },
    { id: 303, title: 'Vanguard Campaign Brief', sharedBy: 'Steve Rogers', department: 'Marketing', views: 18, likes: 5, time: '3 days ago', comments: [] }
  ]);
  const [selectedSharedChat, setSelectedSharedChat] = useState(null);
  const [sharedComment, setSharedComment] = useState('');

  // --- Automations Pipelines State ---
  const [automations, setAutomations] = useState([
    { id: 1, name: 'Daily DMS Document Vectorizer', trigger: 'Every day at 6:00 PM', action: 'Scan new PDFs, extract text, and write semantic vector indices.', status: true },
    { id: 2, name: 'Meeting Transcript Parser', trigger: 'On PMS transcript upload', action: 'Parse transcript, generate action item list, and create TMS tasks automatically.', status: true },
    { id: 3, name: 'Currency Variance Auditor', trigger: 'FX rate update trigger', action: 'Run variance checks and email warning notice if discrepancy exceeds 1.5%.', status: false }
  ]);
  const [showCreateAutomation, setShowCreateAutomation] = useState(false);
  const [newAutoName, setNewAutoName] = useState('');
  const [newAutoTrigger, setNewAutoTrigger] = useState('Daily 12:00 AM');
  const [newAutoAction, setNewAutoAction] = useState('');

  // --- AI Training Center State ---
  const [trainingSubTab, setTrainingSubTab] = useState('overview');
  const [trainingModels, setTrainingModels] = useState([]);
  const [selectedTrainingModel, setSelectedTrainingModel] = useState(null);
  const [showCreateModel, setShowCreateModel] = useState(false);
  const [newModelForm, setNewModelForm] = useState({ name: '', type: 'Classification', baseModel: 'GPT-4o', description: '', learningRate: '0.0001', epochs: '10', batchSize: '32' });
  const [trainingDatasets, setTrainingDatasets] = useState([]);
  const [showUploadDataset, setShowUploadDataset] = useState(false);
  const [trainingSessions, setTrainingSessions] = useState([]);
  const [trainingAgents, setTrainingAgents] = useState([]);
  const [showCreateAgent, setShowCreateAgent] = useState(false);
  const [newAgentForm, setNewAgentForm] = useState({ name: '', modelId: '', department: '', description: '' });

  // Fetch training data from backend
  const fetchTrainingModels = useCallback(async () => {
    try {
      const data = await listAiTrainingModels();
      setTrainingModels(data || []);
    } catch { setTrainingModels([]); }
  }, []);

  const fetchTrainingSessions = useCallback(async () => {
    try {
      const allSessions = [];
      for (const model of trainingModels) {
        const sessions = await listAiTrainingSessions(model.id);
        if (sessions) allSessions.push(...sessions);
      }
      setTrainingSessions(allSessions);
    } catch { setTrainingSessions([]); }
  }, [trainingModels]);

  const fetchTrainingAgents = useCallback(async () => {
    try {
      const data = await listAiTrainingAgents();
      setTrainingAgents(data || []);
    } catch { setTrainingAgents([]); }
  }, []);

  const fetchDatasets = useCallback(async (modelId) => {
    try {
      const data = await listAiTrainingDatasets(modelId);
      setTrainingDatasets(data || []);
    } catch { setTrainingDatasets([]); }
  }, []);

  useEffect(() => {
    if (activeTab === 'ai_training_center') {
      fetchTrainingModels();
      fetchTrainingAgents();
    }
  }, [activeTab, fetchTrainingModels, fetchTrainingAgents]);

  useEffect(() => {
    if (trainingModels.length > 0) fetchTrainingSessions();
  }, [trainingModels, fetchTrainingSessions]);

  // --- Model Toggle States ---
  const [modelEnabledStates, setModelEnabledStates] = useState({
    'GPT-4o (OpenAI)': true,
    'Claude 3.5 Sonnet (Anthropic)': true,
    'Gemini 1.5 Pro (Google)': true,
    'DeepSeek R1 (DeepSeek)': true,
    'Llama 3 70B (Meta)': false,
    'Company Custom AI (Fine-tuned)': true,
  });
  const toggleModel = (name) => {
    setModelEnabledStates(prev => ({ ...prev, [name]: !prev[name] }));
  };

  // --- Dialog States ---
  const [alertDialog, setAlertDialog] = useState({ show: false, title: '', message: '', variant: 'info' });
  const [addPromptDialog, setAddPromptDialog] = useState({ show: false });

  // --- Prompt Library ---
  const [selectedPromptCategory, setSelectedPromptCategory] = useState('Development');
  const defaultPrompts = [
    { category: 'Development', title: 'Code Refactor helper', text: 'Refactor the following React component to use custom hooks and optimize render calls...' },
    { category: 'Development', title: 'SQL Optimization query', text: 'Explain the query execution plan and recommend index configurations to speed up...' },
    { category: 'Marketing', title: 'SaaS Launch Email Sequence', text: 'Write a 4-part email sequence for onboarding trial users into paying customers...' },
    { category: 'HR', title: 'Onboarding Checklist creator', text: 'Generate a step-by-step onboarding plan for a remote employee joining as a...' },
    { category: 'Finance', title: 'Cost Center analysis template', text: 'Draft an executive financial summary explaining cost variations in department budget...' }
  ];
  const [customPrompts, setCustomPrompts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ai_custom_prompts') || '[]'); }
    catch { return []; }
  });
  useEffect(() => { localStorage.setItem('ai_custom_prompts', JSON.stringify(customPrompts)); }, [customPrompts]);
  const promptLibrary = useMemo(() => [...defaultPrompts, ...customPrompts], [customPrompts]);

  // --- AI Tools States ---
  const [activeTool, setActiveTool] = useState(null);
  const [toolInput, setToolInput] = useState('');
  const [toolOutput, setToolOutput] = useState('');
  const [toolGenerating, setToolGenerating] = useState(false);

  // --- Files Manager States ---
  const [files, setFiles] = useState([
    { name: 'pms_gantt_nodes.sql', size: '2.4 KB', type: 'SQL', date: '2 min ago' },
    { name: 'HR_Onboarding_Policy.docx', size: '45 KB', type: 'DOCX', date: '1 hour ago' },
    { name: 'Q2_Expense_Reconciliation.xlsx', size: '120 KB', type: 'XLSX', date: '1 day ago' },
    { name: 'AppRoutes.jsx', size: '4.8 KB', type: 'JSX', date: '2 days ago' }
  ]);

  // --- Memory State ---
  const [memory, setMemory] = useState({
    writingStyle: 'Professional, technical, concise, active voice.',
    codingStyle: 'React 19 functional components, TypeScript, Tailwind/Bootstrap 5, modular hooks.',
    preferredLanguage: 'English (US)',
    department: 'Software Engineering',
    projects: 'ManageCore PMS, DMS Document Intelligence',
    commonCommands: '/generate-migrations, /explain-logs, /create-task',
    favoriteTemplates: 'SQL Schema Creator, Sprint Plan Document, JD Outline'
  });

  // --- Analytics Audit Logs ---
  const auditLogs = [
    { time: '10:32 AM', user: 'Tony Stark', action: 'Prompt executed', model: 'Claude 3.5 Sonnet', tokens: '1.2k', latency: '920ms' },
    { time: '10:28 AM', user: 'Bruce Wayne', action: 'SQL Schema Generated', model: 'GPT-4o', tokens: '2.4k', latency: '1.4s' },
    { time: '09:41 AM', user: 'System (Cron)', action: 'DMS Vector Index', model: 'Gemini 1.5 Pro', tokens: '14.8k', latency: '4.8s' },
    { time: '08:15 AM', user: 'Bruce Wayne', action: 'Meeting Summary Gen', model: 'Claude 3.5 Sonnet', tokens: '890', latency: '750ms' }
  ];

  // Folder Expand Helpers
  const toggleFolder = (key) => {
    setExpandedFolders(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // New Chat Handler
  const handleNewChat = () => {
    const id = createNewChat(activeFolderId);
    setActiveChatId(id);
    if (activeTab !== 'ai_new_chat') {
      setActiveTab('ai_new_chat');
    }
  };

  // Send Prompt Handler
  const handleSendPrompt = () => {
    if (!promptText.trim()) return;
    let chatId = activeChatId;
    if (!chatId) {
      chatId = createNewChat(activeFolderId);
      setActiveChatId(chatId);
    }
    const text = promptText;
    setPromptText('');
    sendMessage(chatId, text);
  };

  // Speech Recognition Simulation
  const handleSpeech = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setPromptText(prev => prev + " Summarize the latest sprint velocity of PMS.");
        setIsRecording(false);
      }, 2500);
    }
  };

  // AI Tool execution simulator
  const handleExecuteTool = () => {
    if (!toolInput.trim()) return;
    setToolGenerating(true);
    setToolOutput('');
    setTimeout(() => {
      if (activeTool === 'SQL Generator') {
        setToolOutput(`-- Generated SQL query for: ${toolInput}\nSELECT u.name, SUM(t.time_spent) as hours\nFROM tenant_users u\nLEFT JOIN tms_tasks t ON t.assigned_user_id = u.id\nWHERE t.status = 'Completed'\nGROUP BY u.id\nORDER BY hours DESC;`);
      } else if (activeTool === 'Code Generator') {
        setToolOutput(`// Generated Component for: ${toolInput}\nimport React from 'react';\n\nexport const FeatureWidget = () => {\n  return (\n    <div className="card shadow-sm p-4 rounded-4 bg-white">\n      <h5 className="fw-bold">Dynamic Feature</h5>\n    </div>\n  );\n};`);
      } else {
        setToolOutput(`AI Summary Report:\n\n- Analyzed query: "${toolInput}"\n- Scope: Contextual parsing of ManageCore DMS database.\n- Resolution: Completed successfully. Suggested next steps: Convert to SOP.`);
      }
      setToolGenerating(false);
    }, 1500);
  };

  // Claude-Style Project Helpers
  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    const newProj = {
      id: projects.length + 1,
      name: newProjectName,
      description: newProjectDesc || 'No description provided.',
      instructions: newProjectInst || 'No special instructions.',
      docsCount: 0,
      chatsCount: 0,
      membersCount: 1
    };
    setProjects([...projects, newProj]);
    setNewProjectName('');
    setNewProjectDesc('');
    setNewProjectInst('');
    setShowCreateProject(false);
  };

  // Automation Pipeline Helpers
  const handleCreateAutomation = () => {
    if (!newAutoName.trim()) return;
    const newPipeline = {
      id: automations.length + 1,
      name: newAutoName,
      trigger: newAutoTrigger,
      action: newAutoAction || 'Audit index variances.',
      status: true
    };
    setAutomations([...automations, newPipeline]);
    setNewAutoName('');
    setNewAutoAction('');
    setShowCreateAutomation(false);
  };

  // Archive & Trash Helpers (delegated to context)
  const handleArchiveChat = (chatId) => {
    archiveChat(chatId);
    setAlertDialog({ show: true, title: 'Archived', message: 'Chat archived successfully.', variant: 'success' });
  };

  const handleRestoreArchivedChat = (chatId) => {
    restoreArchivedChat(chatId);
    setAlertDialog({ show: true, title: 'Restored', message: 'Chat restored to active workspace.', variant: 'success' });
  };

  const handleTrashChat = (chatId) => {
    trashChat(chatId);
    setAlertDialog({ show: true, title: 'Trashed', message: 'Chat moved to Trash.', variant: 'info' });
  };

  const handleRestoreTrashedChat = (chatId) => {
    restoreTrashedChat(chatId);
    setAlertDialog({ show: true, title: 'Restored', message: 'Chat restored to active workspace.', variant: 'success' });
  };

  const handlePermanentDeleteTrash = (chatId) => {
    permanentDeleteTrash(chatId);
    setAlertDialog({ show: true, title: 'Deleted', message: 'Chat deleted permanently.', variant: 'warning' });
  };

  const handleDeleteArchivedChat = (chatId) => {
    deleteArchivedChat(chatId);
  };

  const handleEmptyTrash = () => {
    emptyTrash();
    setAlertDialog({ show: true, title: 'Emptied', message: 'Trash bin emptied successfully.', variant: 'info' });
  };

  // --- AI Training Center Handlers ---
  const handleCreateModel = async () => {
    if (!newModelForm.name.trim()) return;
    try {
      const created = await createAiTrainingModel({
        name: newModelForm.name,
        type: newModelForm.type,
        base_model: newModelForm.baseModel,
        description: newModelForm.description,
        learning_rate: parseFloat(newModelForm.learningRate) || 0.0001,
        epochs: parseInt(newModelForm.epochs) || 10,
        batch_size: parseInt(newModelForm.batchSize) || 32,
      });
      setTrainingModels(prev => [...prev, created]);
      setNewModelForm({ name: '', type: 'Classification', baseModel: 'GPT-4o', description: '', learningRate: '0.0001', epochs: '10', batchSize: '32' });
      setShowCreateModel(false);
      setAlertDialog({ show: true, title: 'Model Created', message: `"${created.name}" training model created successfully.`, variant: 'success' });
    } catch (err) {
      setAlertDialog({ show: true, title: 'Error', message: `Failed to create model: ${err.message}`, variant: 'error' });
    }
  };

  const handleDeleteModel = async (modelId) => {
    if (!window.confirm('Delete this training model and all associated datasets?')) return;
    try {
      await deleteAiTrainingModel(modelId);
      setTrainingModels(prev => prev.filter(m => m.id !== modelId));
      setAlertDialog({ show: true, title: 'Deleted', message: 'Training model deleted.', variant: 'info' });
    } catch (err) {
      setAlertDialog({ show: true, title: 'Error', message: `Failed to delete: ${err.message}`, variant: 'error' });
    }
  };

  const handleStartTraining = async (modelId) => {
    const model = trainingModels.find(m => m.id === modelId);
    if (!model) return;
    try {
      await startAiTraining(modelId);
      setTrainingModels(prev => prev.map(m => m.id === modelId ? { ...m, status: 'training' } : m));
      setAlertDialog({ show: true, title: 'Training Started', message: `"${model.name}" training session initiated.`, variant: 'success' });
      // Poll for status updates
      const pollInterval = setInterval(async () => {
        try {
          const status = await getAiTrainingStatus(modelId);
          if (status) {
            setTrainingSessions(prev => prev.map(s => s.model_id === modelId ? { ...s, ...status } : s));
            if (status.progress >= 100 || status.status === 'completed' || status.status === 'failed') {
              clearInterval(pollInterval);
              setTrainingModels(prev => prev.map(m => m.id === modelId ? { ...m, status: status.status === 'completed' ? 'active' : status.status, accuracy: status.accuracy } : m));
              fetchTrainingModels();
            }
          }
        } catch { clearInterval(pollInterval); }
      }, 3000);
    } catch (err) {
      setAlertDialog({ show: true, title: 'Error', message: `Failed to start training: ${err.message}`, variant: 'error' });
    }
  };

  const handleStopTraining = async (modelId) => {
    try {
      await stopAiTraining(modelId);
      setTrainingSessions(prev => prev.map(s => s.model_id === modelId && s.status === 'running' ? { ...s, status: 'stopped' } : s));
      setTrainingModels(prev => prev.map(m => m.id === modelId ? { ...m, status: 'idle' } : m));
      setAlertDialog({ show: true, title: 'Stopped', message: 'Training session stopped.', variant: 'info' });
    } catch (err) {
      setAlertDialog({ show: true, title: 'Error', message: `Failed to stop training: ${err.message}`, variant: 'error' });
    }
  };

  const handleCreateAgent = async () => {
    if (!newAgentForm.name.trim() || !newAgentForm.modelId) return;
    try {
      const created = await createAiTrainingAgent({
        name: newAgentForm.name,
        model_id: Number(newAgentForm.modelId),
        department: newAgentForm.department || 'General',
        description: newAgentForm.description || 'Custom AI agent.',
      });
      setTrainingAgents(prev => [...prev, created]);
      setNewAgentForm({ name: '', modelId: '', department: '', description: '' });
      setShowCreateAgent(false);
      setAlertDialog({ show: true, title: 'Agent Created', message: `"${created.name}" agent created. Deploy when ready.`, variant: 'success' });
    } catch (err) {
      setAlertDialog({ show: true, title: 'Error', message: `Failed to create agent: ${err.message}`, variant: 'error' });
    }
  };

  const handleDeployAgent = async (agentId) => {
    try {
      const updated = await updateAiTrainingAgent(agentId, { status: 'deployed' });
      setTrainingAgents(prev => prev.map(a => a.id === agentId ? { ...a, status: 'deployed' } : a));
      setAlertDialog({ show: true, title: 'Deployed', message: 'AI agent is now live and available for use.', variant: 'success' });
    } catch (err) {
      setAlertDialog({ show: true, title: 'Error', message: `Failed to deploy: ${err.message}`, variant: 'error' });
    }
  };

  const handleDeleteAgent = async (agentId) => {
    if (!window.confirm('Delete this AI agent?')) return;
    try {
      await deleteAiTrainingAgent(agentId);
      setTrainingAgents(prev => prev.filter(a => a.id !== agentId));
      setAlertDialog({ show: true, title: 'Deleted', message: 'AI agent deleted.', variant: 'info' });
    } catch (err) {
      setAlertDialog({ show: true, title: 'Error', message: `Failed to delete: ${err.message}`, variant: 'error' });
    }
  };

  return (
    <div className="container-fluid py-4 min-vh-100 ai-workspace-shell">
      
      {/* ──────────────────────────────────────────────────────── */}
      {/* 1. AI WORKSPACE DASHBOARD */}
      {/* ──────────────────────────────────────────────────────── */}
      {(activeTab === 'ai_dashboard' || activeTab === 'ai_overview') && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <section className="ai-dashboard-hero mb-4">
            <div className="ai-dashboard-hero-copy">
              <div className="ai-hero-kicker"><span className="ai-status-dot" /> ManageCore intelligence command center</div>
              <h1>Turn business activity<br /><span>into your next clear move.</span></h1>
              <p>Monitor AI performance, connected workflows, and trained agents from one operational view. Your workspace is ready to help teams decide with more context.</p>
              <div className="d-flex flex-wrap gap-2">
                <button type="button" className="ai-dashboard-primary" onClick={() => setActiveTab('ai_new_chat')}><FontAwesomeIcon icon={faComments} /> Ask your data <FontAwesomeIcon icon={faChevronRight} /></button>
                <button type="button" className="ai-dashboard-secondary" onClick={() => setActiveTab('ai_analytics')}><FontAwesomeIcon icon={faChartLine} /> View analytics</button>
              </div>
            </div>
            <div className="ai-dashboard-overview">
              <div className="d-flex justify-content-between align-items-start"><div className="ai-dashboard-orbit"><FontAwesomeIcon icon={faBrain} /></div><span className="ai-online-pill">SYSTEM READY</span></div>
              <span className="ai-eyebrow text-white-50 mt-3">Workspace readiness</span>
              <strong>AI operations are online</strong>
              <div className="ai-dashboard-progress"><span style={{ width: `${usageStats?.total_requests ? Math.min(100, Math.round((usageStats.success_count / usageStats.total_requests) * 100)) : 92}%` }} /></div>
              <div className="d-flex justify-content-between mt-2"><small>Verified response rate</small><b>{usageStats?.total_requests ? `${((usageStats.success_count / usageStats.total_requests) * 100).toFixed(0)}%` : '92%'}</b></div>
              <div className="ai-dashboard-mini-stats"><div><b>{projects.length}</b><span>projects</span></div><div><b>{trainingDashboard?.deployed_agents ?? trainingAgents.filter(a => a.status === 'deployed').length}</b><span>agents live</span></div><div><b>{files.length}</b><span>files indexed</span></div></div>
            </div>
          </section>
          <div className="ai-dashboard-section-heading d-flex align-items-end justify-content-between mb-3">
            <div><span className="ai-eyebrow">Live operations</span><h5 className="mb-0 fw-bold">AI workspace pulse</h5></div>
            <span className="ai-dashboard-updated"><span className="ai-status-dot" /> Updated from connected systems</span>
          </div>
          
          {/* KPI Dashboard Cards */}
          <div className="row g-4 mb-4">
            {[
              { label: 'Total AI Requests', value: usageStats?.total_requests ?? '--', detail: `${usageStats?.today_requests ?? 0} today`, icon: faComments, color: '#4f46e5' },
              { label: 'Tokens Used (Month)', value: usageStats?.total_tokens ? (usageStats.total_tokens / 1000000).toFixed(1) + 'M' : '--', detail: `$${Number(usageStats?.total_cost ?? 0).toFixed(4)} total cost`, icon: faMicrochip, color: '#8b5cf6' },
              { label: 'Success Rate', value: usageStats?.total_requests ? ((usageStats.success_count / usageStats.total_requests) * 100).toFixed(1) + '%' : '--', detail: `${usageStats?.error_count ?? 0} errors`, icon: faBolt, color: '#10b981' },
              { label: 'Projects Using AI', value: projects.length, detail: '94% coverage', icon: faProjectDiagram, color: '#06b6d4' },
              { label: 'Files Uploaded', value: files.length, detail: 'Excel, PDF, Images', icon: faFolderOpen, color: '#ec4899' },
              { label: 'Training Models', value: trainingDashboard?.total_models ?? trainingModels.length, detail: `${trainingDashboard?.active_training_count ?? 0} training now`, icon: faBrain, color: '#f59e0b' },
              { label: 'Deployed Agents', value: trainingDashboard?.deployed_agents ?? trainingAgents.filter(a => a.status === 'deployed').length, detail: `${trainingAgents.length} total agents`, icon: faRobot, color: '#14b8a6' },
              { label: 'Today\'s Tokens', value: usageStats?.today_tokens ? (usageStats.today_tokens / 1000).toFixed(1) + 'K' : '--', detail: `$${Number(usageStats?.today_cost ?? 0).toFixed(4)} today`, icon: faMicrochip, color: '#ef4444' },
            ].map((card, idx) => (
              <div key={idx} className="col-xl-3 col-sm-6">
                <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100 transition-all hover-lift">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: `${card.color}15`, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FontAwesomeIcon icon={card.icon} />
                    </div>
                    <span className="small text-muted font-monospace">{card.detail}</span>
                  </div>
                  <h6 className="text-muted text-uppercase small mb-1" style={{ fontSize: '11px', letterSpacing: '0.05em' }}>{card.label}</h6>
                  <h3 className="fw-black mb-0 text-dark">{card.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* AI Usage Analytics Graphics */}
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                <h5 className="fw-bold mb-4">Daily AI Request & API Load</h5>
                <div style={{ height: '320px' }}>
                  <Line 
                    data={{
                      labels: (usageStats?.daily_usage || []).map(d => d.date?.slice(5) || d.date) || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                      datasets: [
                        { label: 'API Requests', data: (usageStats?.daily_usage || []).map(d => d.requests) || [], borderColor: '#4f46e5', tension: 0.4, fill: true, backgroundColor: 'rgba(79, 70, 229, 0.03)' },
                        { label: 'Tokens (K)', data: (usageStats?.daily_usage || []).map(d => Math.round((d.tokens || 0) / 1000)) || [], borderColor: '#10b981', tension: 0.4 }
                      ]
                    }} 
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100">
                <h5 className="fw-bold mb-4">Usage by Feature</h5>
                <div style={{ height: '320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {usageStats?.by_feature?.length > 0 ? (
                    <Doughnut
                      data={{
                        labels: usageStats.by_feature.map(f => f.feature || 'Unknown'),
                        datasets: [{
                          data: usageStats.by_feature.map(f => f.count),
                          backgroundColor: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444', '#14b8a6'],
                          borderWidth: 0
                        }]
                      }}
                      options={{ maintainAspectRatio: false }}
                    />
                  ) : (
                    <div className="text-center text-muted py-5">
                      <FontAwesomeIcon icon={faChartPie} size="2x" className="mb-3 opacity-25" />
                      <p className="mb-0">No usage data yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 2. CHAT INTERFACE */}
      {/* ──────────────────────────────────────────────────────── */}
      {(activeTab === 'ai_new_chat' || activeTab === 'ai_recent_chats') && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="ai-ask-data-view">
          <div className="ai-identity-strip d-flex align-items-center justify-content-between mb-3">
            <div className="d-flex align-items-center gap-3">
              <div className="ai-mark"><FontAwesomeIcon icon={faBrain} /></div>
              <div><span className="ai-eyebrow">Business intelligence</span><h6 className="mb-0 fw-bold">ManageCore AI</h6></div>
            </div>
            <div className="d-flex align-items-center gap-2"><span className="ai-status-pill"><span className="ai-status-dot" /> Live workspace</span><span className="ai-status-pill ai-status-pill-muted">Tenant isolated</span></div>
          </div>
          <section className="ai-hero mb-3">
            <div className="ai-hero-copy">
              <div className="ai-hero-kicker"><span className="ai-status-dot" /> Protected intelligence workspace</div>
              <h1>Ask questions.<br /><span>Get verified business answers.</span></h1>
              <p>Explore your connected ManageCore data with permission-aware AI. Every answer stays grounded in approved context and tenant-safe records.</p>
              <div className="d-flex flex-wrap gap-2"><span className="ai-hero-chip"><FontAwesomeIcon icon={faLock} /> Permission checked</span><span className="ai-hero-chip"><FontAwesomeIcon icon={faDatabase} /> Verified sources</span><span className="ai-hero-chip"><FontAwesomeIcon icon={faClock} /> Fresh context</span></div>
            </div>
            <div className="ai-readiness-card">
              <div className="d-flex justify-content-between align-items-start mb-3"><div className="ai-readiness-icon"><FontAwesomeIcon icon={faBrain} /></div><span className="ai-online-pill">ONLINE</span></div>
              <span className="ai-eyebrow text-white-50">Intelligence engine</span><strong>Ready for verified questions</strong>
              <div className="ai-readiness-metrics"><div><b>{projects.length}</b><span>connected projects</span></div><div><b>{files.length}</b><span>indexed files</span></div><div><b>{chats.length}</b><span>active chats</span></div><div><b>{availableModels.length || '--'}</b><span>available models</span></div></div>
              <small>Signed in as {currentUser?.name || 'workspace user'}</small>
            </div>
          </section>
          <div className="row g-3 mb-3 ai-signal-row">
            <div className="col-lg-4"><div className="ai-signal-card"><FontAwesomeIcon icon={faShieldAlt} /><div><b>Contextual verified mode</b><span>Every follow-up re-checks access, permissions, privacy and quota.</span></div></div></div>
            <div className="col-lg-4"><div className="ai-signal-card"><FontAwesomeIcon icon={faComments} /><div><b>Advisory answers</b><span>AI explains approved facts. Review important decisions in the source module.</span></div></div></div>
            <div className="col-lg-4"><div className="ai-signal-card"><FontAwesomeIcon icon={faWaveSquare} /><div><b>Request protection</b><span>{usageStats?.today_requests ?? 0} requests used in this window.</span></div></div></div>
          </div>
          <div className="row g-4">
          
          {/* Left panel: Expandable Folders & Search */}
          <div className="col-xl-3 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
              
              <button onClick={handleNewChat} className="btn w-100 rounded-pill py-2.5 mb-3 fw-bold text-white border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', fontSize: '13px' }}>
                <FontAwesomeIcon icon={faPlus} className="me-2" /> NEW CHAT
              </button>

              <div className="position-relative mb-4">
                <span className="position-absolute" style={{ left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }}>
                  <FontAwesomeIcon icon={faSearch} size="xs" />
                </span>
                <input 
                  type="text" 
                  className="form-control form-control-sm bg-light border-0 ps-5 rounded-3 text-dark" 
                  placeholder="Search chats..." 
                  value={chatSearch}
                  onChange={e => setChatSearch(e.target.value)}
                />
              </div>

              {/* Folders Section */}
              <div className="mb-4">
                <div onClick={() => toggleFolder('folders')} className="d-flex align-items-center justify-content-between cursor-pointer mb-2">
                  <span className="text-uppercase small fw-bold text-muted" style={{ fontSize: '10px', letterSpacing: '0.04em' }}>Folders</span>
                  <div className="d-flex align-items-center gap-2">
                    <FontAwesomeIcon icon={faPlus} size="xs" className="text-muted hover-text-primary" style={{ cursor: 'pointer' }}
                      onClick={(e) => { e.stopPropagation(); setNewFolderDialog({ show: true }); }} title="Add Folder" />
                    <FontAwesomeIcon icon={expandedFolders.folders ? faChevronDown : faChevronRight} size="xs" className="text-muted" />
                  </div>
                </div>
                
                {expandedFolders.folders && (
                  <div className="ps-2 space-y-1">
                    <div onClick={() => { setActiveFolderId(null); }} className={`d-flex align-items-center gap-2 py-1.5 px-2 rounded-3 cursor-pointer small ${activeFolderId === null ? 'bg-primary bg-opacity-10 text-primary fw-bold' : 'hover-bg-light text-dark'}`}>
                      <FontAwesomeIcon icon={faFolder} style={{ color: '#6c757d', fontSize: '12px' }} />
                      <span className="fw-medium">All Chats</span>
                      <span className="ms-auto text-muted" style={{ fontSize: '9px' }}>{chats.length}</span>
                    </div>
                    {folders.map((folder) => (
                      <div key={folder.id} className="d-flex align-items-center gap-2 py-1 px-2 rounded-3 hover-bg-light cursor-pointer text-dark small"
                        onClick={() => setActiveFolderId(folder.id)} style={{ background: activeFolderId === folder.id ? 'rgba(79,70,229,0.08)' : 'transparent' }}>
                        <FontAwesomeIcon icon={faFolder} style={{ color: '#ffc107', fontSize: '12px' }} />
                        <span className="fw-medium flex-grow-1">{folder.name}</span>
                        <span className="text-muted" style={{ fontSize: '9px' }}>{chats.filter(c => c.folder === folder.id).length}</span>
                        <FontAwesomeIcon icon={faEdit} size="xs" className="text-muted hover-text-primary opacity-50"
                          onClick={(e) => { e.stopPropagation(); setRenameFolderDialog({ show: true, folder }); }} title="Rename" />
                        <FontAwesomeIcon icon={faTrash} size="xs" className="text-muted hover-text-danger opacity-50"
                          onClick={(e) => { e.stopPropagation(); setDeleteFolderDialog({ show: true, folder }); }} title="Delete" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Projects Section */}
              <div className="mb-4">
                <div onClick={() => toggleFolder('projects')} className="d-flex align-items-center justify-content-between cursor-pointer mb-2">
                  <span className="text-uppercase small fw-bold text-muted" style={{ fontSize: '10px', letterSpacing: '0.04em' }}>Projects</span>
                  <FontAwesomeIcon icon={expandedFolders.projects ? faChevronDown : faChevronRight} size="xs" className="text-muted" />
                </div>

                {expandedFolders.projects && (
                  <div className="ps-2 space-y-1">
                    {projects.map((proj) => (
                      <div key={proj.id} onClick={() => { setActiveProjectId(proj.id); setActiveTab('ai_projects'); }} className="d-flex align-items-center gap-2 py-1.5 px-2 rounded-3 hover-bg-light cursor-pointer text-dark small">
                        <FontAwesomeIcon icon={faProjectDiagram} className="text-primary" style={{ fontSize: '12px' }} />
                        <span>{proj.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent / Pinned Chats list */}
              <div>
                <span className="text-uppercase small fw-bold text-muted mb-2 d-block" style={{ fontSize: '10px', letterSpacing: '0.04em' }}>Chats List</span>
                <div className="space-y-2">
                  {chats.filter(c => c.title.toLowerCase().includes(chatSearch.toLowerCase()))
                    .filter(c => activeFolderId === null || c.folder === activeFolderId)
                    .map((c) => (
                    <div 
                      key={c.id} 
                      onClick={() => setActiveChatId(c.id)}
                      className={`p-3 rounded-4 border transition-all cursor-pointer ${activeChatId === c.id ? 'border-primary bg-primary bg-opacity-25' : 'bg-transparent border-light hover-bg-light'}`}
                    >
                      <div className="d-flex align-items-center justify-content-between mb-1">
                        <span className="fw-bold small text-dark text-truncate" style={{ maxWidth: '80%' }}>{c.title}</span>
                        <div className="d-flex gap-1.5 text-muted" style={{ fontSize: '10px' }}>
                          {c.pinned && <FontAwesomeIcon icon={faThumbtack} className="text-warning" />}
                          {c.favorite && <FontAwesomeIcon icon={faStar} className="text-danger" />}
                          {c.shared && <FontAwesomeIcon icon={faShare} className="text-success" />}
                        </div>
                      </div>
                      <p className="text-muted text-truncate mb-1" style={{ fontSize: '11px' }}>{c.lastMsg}</p>
                      <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                        <div className="d-flex align-items-center gap-2">
                          <span className="text-muted" style={{ fontSize: '9px' }}>{c.time}</span>
                          <select className="form-select form-select-sm text-muted border-0 bg-transparent" style={{ fontSize: '9px', width: 'auto', padding: '0 12px 0 0', cursor: 'pointer' }}
                            value={c.folder ?? ''}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => { const val = e.target.value; moveChatToFolder(c.id, val === '' ? null : Number(val)); }}>
                            <option value="">No folder</option>
                            {folders.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                          </select>
                        </div>
                        <div className="d-flex gap-2">
                          <span onClick={(e) => { e.stopPropagation(); handleArchiveChat(c.id); }} className="hover-text-primary px-1" title="Archive"><FontAwesomeIcon icon={faArchive} style={{ fontSize: '9px' }} /></span>
                          <span onClick={(e) => { e.stopPropagation(); handleTrashChat(c.id); }} className="hover-text-danger px-1" title="Delete"><FontAwesomeIcon icon={faTrash} style={{ fontSize: '9px' }} /></span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Center panel: Conversations */}
          <div className="col-xl-6 col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 bg-white overflow-hidden d-flex flex-column" style={{ height: '700px' }}>
              
              {/* Chat Top bar */}
              <div className="p-3 border-bottom d-flex align-items-center justify-content-between bg-light bg-opacity-40">
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style={{ width: 34, height: 34 }}>
                    <FontAwesomeIcon icon={faBrain} />
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-0">{(chats.find(c => c.id === activeChatId)?.title) || 'Active Chat'}</h6>
                    <small className="text-muted" style={{ fontSize: '10px' }}>Linked Context: <span className="text-primary fw-bold">{activeProjectContext}</span></small>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2.5">
                  <select 
                    className="form-select form-select-sm border-0 bg-light rounded-pill px-3 fw-bold" 
                    style={{ width: '170px', fontSize: '11px' }}
                    value={selectedModel}
                    onChange={e => setSelectedModel(e.target.value)}
                  >
                    {availableModels.length === 0 && <option value="">Loading models...</option>}
                    {availableModels.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                  <button className="btn btn-sm btn-outline-secondary border-0 rounded-circle" onClick={() => handleArchiveChat(activeChatId)} title="Archive Chat"><FontAwesomeIcon icon={faArchive} size="sm" /></button>
                  <button className="btn btn-sm btn-outline-secondary border-0 rounded-circle" onClick={() => {
                    const activeChat = chats.find(c => c.id === activeChatId);
                    if (activeChat) {
                      setSharedChats([...sharedChats, { id: sharedChats.length + 301, title: activeChat.title, sharedBy: currentUser?.name || 'User', department: 'Development', views: 0, likes: 0, time: 'Just now', comments: [] }]);
                      alert('Shared successfully. Check the Shared Chats tab!');
                    }
                  }} title="Share Chat"><FontAwesomeIcon icon={faShare} size="sm" /></button>
                  <button className="btn btn-sm btn-outline-secondary border-0 rounded-circle" onClick={() => handleTrashChat(activeChatId)} title="Delete Chat"><FontAwesomeIcon icon={faTrash} size="sm" /></button>
                </div>
              </div>

              {/* Chat messages */}
              <div className="flex-grow-1 p-4 overflow-y-auto ai-message-area" style={{ maxHeight: '460px' }}>
                <AnimatePresence>
                  {(messages[activeChatId] || []).length > 0 ? (
                    (messages[activeChatId] || []).map((msg, idx) => (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`d-flex gap-3 mb-4 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-light border text-dark'}`} style={{ width: 34, height: 34, fontSize: '12px' }}>
                          {msg.sender === 'user' ? 'U' : 'AI'}
                        </div>
                        
                        <div className="flex-grow-1" style={{ maxWidth: '85%' }}>
                          <div className={`p-3 rounded-4 ${msg.sender === 'user' ? 'bg-primary bg-opacity-10 border border-primary border-opacity-10 text-dark-emphasis' : 'bg-light bg-opacity-40 border border-light'}`}>
                            
                            <div className="d-flex justify-content-between align-items-center mb-1.5">
                              <span className="small fw-bold text-dark">{msg.sender === 'user' ? (currentUser?.name || 'User') : (availableModels.find(m => m.id === selectedModel)?.name || selectedModel)}</span>
                              <span className="text-muted" style={{ fontSize: '9px' }}>{msg.time}</span>
                            </div>

                            <div className="small markdown-content" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                              {msg.text}
                            </div>

                            {/* Code Block if present */}
                            {msg.code && (
                              <div className="mt-3 rounded-4 overflow-hidden border bg-dark text-light font-monospace" style={{ fontSize: '12px' }}>
                                <div className="d-flex justify-content-between align-items-center bg-secondary bg-opacity-30 px-3 py-1.5 text-muted small">
                                  <span>{msg.language || 'code'}</span>
                                  <div className="d-flex gap-2">
                                    <button className="btn btn-link btn-xs text-muted p-0 border-0" onClick={() => navigator.clipboard.writeText(msg.code)}><FontAwesomeIcon icon={faCopy} className="me-1" />Copy</button>
                                    <button className="btn btn-link btn-xs text-success p-0 border-0" onClick={() => alert('Code execution initiated in backend sandbox context...')}><FontAwesomeIcon icon={faPlay} className="me-1" />Run</button>
                                  </div>
                                </div>
                                <pre className="p-3 mb-0" style={{ overflowX: 'auto' }}><code>{msg.code}</code></pre>
                              </div>
                            )}

                            {/* References & Sources */}
                            {(msg.references || msg.sources) && (
                              <div className="mt-3 pt-3 border-top d-flex flex-wrap gap-3" style={{ fontSize: '10px' }}>
                                {msg.references && (
                                  <div className="d-flex align-items-center gap-1 text-muted">
                                    <FontAwesomeIcon icon={faBookOpen} />
                                    <span>Refs: {msg.references.join(', ')}</span>
                                  </div>
                                )}
                                {msg.sources && (
                                  <div className="d-flex align-items-center gap-1 text-primary">
                                    <FontAwesomeIcon icon={faDatabase} />
                                    <span>Sources: {msg.sources.join(', ')}</span>
                                  </div>
                                )}
                              </div>
                            )}

                          </div>

                          {/* AI Response Action Items */}
                          {msg.sender === 'assistant' && (
                            <div className="d-flex flex-wrap gap-2 mt-2">
                              <button className="btn btn-xs btn-light rounded-pill border py-1 px-2.5 small" style={{ fontSize: '10px' }} onClick={() => alert('Assigned as a PMS Task successfully.')}>
                                <FontAwesomeIcon icon={faTasks} className="me-1.5 text-primary" /> Create Task
                              </button>
                              <button className="btn btn-xs btn-light rounded-pill border py-1 px-2.5 small" style={{ fontSize: '10px' }} onClick={() => alert('Draft saved as a new SOP document.')}>
                                <FontAwesomeIcon icon={faFileAlt} className="me-1.5 text-info" /> Save SOP
                              </button>
                              <button className="btn btn-xs btn-light rounded-pill border py-1 px-2.5 small" style={{ fontSize: '10px' }} onClick={() => alert('Drafting email proposal in Teams...')}>
                                <FontAwesomeIcon icon={faShare} className="me-1.5 text-success" /> Email Proposal
                              </button>
                              <div className="ms-auto d-flex gap-2 text-muted">
                                <button className="btn btn-link btn-xs text-muted p-0"><FontAwesomeIcon icon={faUndo} /></button>
                                <button className="btn btn-link btn-xs text-muted p-0"><FontAwesomeIcon icon={faVolumeUp} /></button>
                                <button className="btn btn-link btn-xs text-muted p-0"><FontAwesomeIcon icon={faThumbsUp} /></button>
                              </div>
                            </div>
                          )}

                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-5 text-muted h-100 d-flex flex-column align-items-center justify-content-center ai-empty-state">
                      <FontAwesomeIcon icon={faRobot} size="3x" className="mb-3 opacity-25 text-primary animate-pulse" />
                      <span className="ai-eyebrow text-primary">Business intelligence assistant</span>
                      <h5 className="fw-bold text-dark">What would you like to understand today?</h5>
                      <p className="small text-muted" style={{ maxWidth: '320px' }}>Choose a verified question or write your own. Follow-ups stay within the same approved topic.</p>
                      <div className="ai-suggested-prompts">{['Show this month\'s overdue receivables', 'Summarize active sprint velocity', 'Which HR policies changed recently'].map(prompt => (<button key={prompt} type="button" onClick={() => setPromptText(prompt)}>{prompt}<FontAwesomeIcon icon={faChevronRight} /></button>))}</div>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Chat Input Prompt Area */}
              <div className="p-3 border-top mt-auto bg-light bg-opacity-20">
                {/* Files attached indicator */}
                {attachments.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {attachments.map((file, idx) => (
                      <span key={idx} className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2.5 py-1 d-flex align-items-center gap-1.5" style={{ fontSize: '10px' }}>
                        <FontAwesomeIcon icon={faPaperclip} />
                        {file}
                        <FontAwesomeIcon icon={faTimes} className="cursor-pointer text-muted hover-text-danger" onClick={() => setAttachments(attachments.filter((_, i) => i !== idx))} />
                      </span>
                    ))}
                  </div>
                )}

                <div className="card shadow-sm border border-light p-2 rounded-4 bg-white">
                  <textarea 
                    className="form-control border-0 p-2 text-dark" 
                    rows={2} 
                    style={{ resize: 'none', fontSize: '13px', outline: 'none', boxShadow: 'none' }}
                    placeholder={`Ask AI anything... Use @ to mention users, # for projects, / for commands.`}
                    value={promptText}
                    onChange={e => {
                      const val = e.target.value;
                      setPromptText(val);
                      if (val.endsWith('@')) { setShowMentions(true); setShowSlash(false); }
                      else if (val.endsWith('/')) { setShowSlash(true); setShowMentions(false); }
                      else { setShowMentions(false); setShowSlash(false); }
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendPrompt();
                      }
                    }}
                  />

                  {/* Mentions & Slash overlay */}
                  {showMentions && (
                    <div className="position-absolute bg-white border shadow rounded-4 p-2" style={{ bottom: '70px', left: '15px', zIndex: 1000, width: '200px' }}>
                      <div className="p-1 text-uppercase text-muted fw-bold" style={{ fontSize: '9px' }}>Mention Users / Projects</div>
                      {['Tony Stark', 'Bruce Wayne', 'PMS System', 'FMS Invoices'].map(item => (
                        <div key={item} className="p-2 small hover-bg-light cursor-pointer rounded text-dark" onClick={() => { setPromptText(prev => prev + `${item} `); setShowMentions(false); }}>
                          {item}
                        </div>
                      ))}
                    </div>
                  )}

                  {showSlash && (
                    <div className="position-absolute bg-white border shadow rounded-4 p-2" style={{ bottom: '70px', left: '15px', zIndex: 1000, width: '220px' }}>
                      <div className="p-1 text-uppercase text-muted fw-bold" style={{ fontSize: '9px' }}>Slash Commands</div>
                      {['/generate-sop', '/create-task', '/summarize-pdf', '/cost-report'].map(cmd => (
                        <div key={cmd} className="p-2 small hover-bg-light cursor-pointer rounded text-dark" onClick={() => { setPromptText(prev => prev.slice(0, -1) + `${cmd} `); setShowSlash(false); }}>
                          {cmd}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-2">
                    <div className="d-flex gap-2">
                      <button className="btn btn-light btn-sm rounded-circle shadow-sm" style={{ width: 34, height: 34 }} onClick={() => setAttachments([...attachments, `Uploaded_Doc_${attachments.length + 1}.pdf`])} title="Attach Files"><FontAwesomeIcon icon={faPaperclip} size="sm" /></button>
                      <button className={`btn btn-sm rounded-circle shadow-sm ${isRecording ? 'btn-danger text-white' : 'btn-light'}`} style={{ width: 34, height: 34 }} onClick={handleSpeech} title="Voice Assistant"><FontAwesomeIcon icon={faMicrophone} size="sm" /></button>
                      <button className="btn btn-light btn-sm rounded-circle shadow-sm" style={{ width: 34, height: 34 }} onClick={() => alert('AI Voice chat mode initiated...')} title="Voice Chat Mode"><FontAwesomeIcon icon={faRobot} size="sm" /></button>
                    </div>

                    <button 
                      onClick={handleSendPrompt} 
                      className="btn rounded-pill px-4 text-white border-0 shadow-sm" 
                      style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', fontSize: '12px', fontWeight: 'bold' }}
                    >
                      SEND
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* Right panel: Context and Projects */}
          <div className="col-xl-3 col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 bg-white p-4 h-100 space-y-4">
              
              {/* Context Selector */}
              <div>
                <h6 className="fw-bold mb-3 text-dark">Enterprise AI Context</h6>
                <div className="d-flex flex-wrap gap-1.5 bg-light p-1 rounded-3">
                  {['Project', 'Task', 'Document', 'Team', 'HR', 'Finance'].map(tab => (
                    <button 
                      key={tab} 
                      onClick={() => setActiveContextTab(tab)}
                      className={`btn btn-xs rounded-pill px-2.5 py-1 font-bold ${activeContextTab === tab ? 'btn-primary text-white shadow-sm' : 'btn-light text-muted'}`}
                      style={{ fontSize: '10px' }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Context Render */}
              <div className="p-3 border rounded-4 bg-light bg-opacity-40">
                {activeContextTab === 'Project' && (
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="small text-uppercase text-muted fw-bold" style={{ fontSize: '9px' }}>Current Project Context</span>
                      <span className="badge bg-success bg-opacity-10 text-success px-2 py-0.5 rounded" style={{ fontSize: '9px' }}>Active</span>
                    </div>
                    <h6 className="fw-bold text-dark mb-1">{activeProjectContext}</h6>
                    <p className="text-muted x-small" style={{ fontSize: '11px' }}>Selecting a project binds all related tickets and documents to context.</p>
                    
                    <hr className="my-3 opacity-10" />
                    <div className="space-y-2" style={{ fontSize: '11px' }}>
                      <div className="d-flex justify-content-between"><span>Open Tasks:</span> <span className="fw-bold text-dark">18 Tasks</span></div>
                      <div className="d-flex justify-content-between"><span>Open Bugs:</span> <span className="fw-bold text-danger">3 Bugs</span></div>
                      <div className="d-flex justify-content-between"><span>Active Sprint:</span> <span className="fw-bold text-primary">Sprint #12</span></div>
                      <div className="d-flex justify-content-between"><span>Project Docs:</span> <span className="fw-bold text-dark">14 files</span></div>
                    </div>
                  </div>
                )}
                {activeContextTab === 'Task' && (
                  <div>
                    <span className="small text-uppercase text-muted fw-bold d-block mb-2" style={{ fontSize: '9px' }}>Selected Tasks Context</span>
                    <div className="space-y-2">
                      {['^TASK-201 Gantt State Machine', '^TASK-202 Milestones Layout', '^TASK-203 Workspace Isolation'].map(task => (
                        <div key={task} className="p-2 border rounded-3 bg-white d-flex justify-content-between align-items-center">
                          <span className="small fw-medium text-dark">{task}</span>
                          <FontAwesomeIcon icon={faCheckCircle} className="text-success" size="xs" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeContextTab === 'Document' && (
                  <div>
                    <span className="small text-uppercase text-muted fw-bold d-block mb-2" style={{ fontSize: '9px' }}>Indexed Context Documents</span>
                    <div className="space-y-1.5">
                      {['pms_gantt_nodes.sql', 'HR_Onboarding_Policy.docx', 'Q2_Expense_Reconciliation.xlsx'].map(file => (
                        <div key={file} className="d-flex align-items-center justify-content-between text-muted" style={{ fontSize: '11px' }}>
                          <span className="text-truncate" style={{ maxWidth: '85%' }}>{file}</span>
                          <FontAwesomeIcon icon={faCheck} className="text-primary" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeContextTab !== 'Project' && activeContextTab !== 'Task' && activeContextTab !== 'Document' && (
                  <div className="py-4 text-center text-muted small">
                    <FontAwesomeIcon icon={faDatabase} className="mb-2 opacity-20" size="2x" />
                    <div>Enterprise {activeContextTab} context loaded. Ready for reasoning.</div>
                  </div>
                )}
              </div>

              {/* Claude-like Projects Section */}
              <div className="pt-3 border-top">
                <h6 className="fw-bold mb-2 text-dark">AI Workspace Memory</h6>
                <p className="text-muted x-small mb-3" style={{ fontSize: '11px' }}>AI adapts to your style guidelines automatically.</p>
                <div className="space-y-2" style={{ fontSize: '11px' }}>
                  <div className="p-2 border rounded-3 bg-white">
                    <span className="text-muted d-block uppercase" style={{ fontSize: '8px', fontWeight: 'bold' }}>Writing Style</span>
                    <span className="fw-medium text-dark-emphasis">{memory.writingStyle}</span>
                  </div>
                  <div className="p-2 border rounded-3 bg-white">
                    <span className="text-muted d-block uppercase" style={{ fontSize: '8px', fontWeight: 'bold' }}>Coding Preference</span>
                    <span className="fw-medium text-dark-emphasis">{memory.codingStyle}</span>
                  </div>
                  <button className="btn btn-xs btn-outline-primary rounded-pill mt-2" onClick={() => setActiveTab('ai_settings')}>Edit AI Preferences</button>
                </div>
              </div>

            </div>
          </div>
          </div>

        </motion.div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 3. PROMPT LIBRARY */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeTab === 'ai_prompt_library' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card border-0 shadow-sm rounded-4 bg-white p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="fw-bold mb-1">Prompt Library</h5>
              <p className="text-muted small mb-0">Browse and use high-performance pre-defined templates tailored for your workflows.</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-primary rounded-pill px-3 py-1.5" onClick={() => setAddPromptDialog({ show: true })}><FontAwesomeIcon icon={faPlus} className="me-2" />Add Prompt</button>
              <button className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1.5" onClick={() => { const text = promptLibrary.map(p => `[${p.category}] ${p.title}\n${p.text}`).join('\n\n---\n\n'); navigator.clipboard.writeText(text); setAlertDialog({ show: true, title: 'Exported', message: 'Prompt library copied to clipboard.', variant: 'success' }); }}><FontAwesomeIcon icon={faDownload} className="me-2" />Export Library</button>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-3">
              <div className="d-flex flex-column gap-1 bg-light p-2 rounded-4">
                {['Development', 'Marketing', 'Sales', 'HR', 'Finance', 'Legal', 'Project Management', 'Testing', 'Documentation', 'Emails'].map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setSelectedPromptCategory(cat)}
                    className={`btn text-start rounded-3 px-3 py-2 ${selectedPromptCategory === cat ? 'bg-primary text-white shadow-sm' : 'text-dark hover-bg-light'}`}
                    style={{ fontSize: '12px', fontWeight: '500' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-lg-9">
              <div className="row g-3">
                {promptLibrary.filter(p => p.category === selectedPromptCategory).map((prompt, idx) => (
                  <div key={idx} className="col-md-6">
                    <div className="p-4 border rounded-4 bg-light bg-opacity-40 d-flex flex-column h-100 justify-content-between">
                      <div>
                        <div className="d-flex justify-content-between align-items-start mb-2.5">
                          <h6 className="fw-bold text-dark mb-0">{prompt.title}</h6>
                          <span className="badge bg-primary bg-opacity-10 text-primary" style={{ fontSize: '9px' }}>{prompt.category}</span>
                        </div>
                        <p className="text-muted small text-truncate-3" style={{ fontSize: '12px', lineHeight: '1.6' }}>{prompt.text}</p>
                      </div>

                      <div className="d-flex gap-2 pt-4 mt-auto border-top align-items-center justify-content-between">
                        <button className="btn btn-xs btn-primary rounded-pill px-3 py-1.5 font-bold" style={{ fontSize: '10px' }} onClick={() => { setPromptText(prompt.text); setActiveTab('ai_new_chat'); }}>
                          Use Prompt
                        </button>
                        <div className="d-flex gap-2">
                          <button className="btn btn-xs btn-outline-secondary border-0" onClick={() => setAlertDialog({ show: true, title: 'Favorites', message: 'Prompt added to favorites!', variant: 'success' })}><FontAwesomeIcon icon={faStar} /></button>
                          {prompt.custom && (
                            <button className="btn btn-xs btn-outline-danger border-0" onClick={() => { setCustomPrompts(prev => prev.filter(p => p.title !== prompt.title || p.text !== prompt.text)); setAlertDialog({ show: true, title: 'Deleted', message: 'Custom prompt removed from library.', variant: 'info' }); }}><FontAwesomeIcon icon={faTrash} /></button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 4. AI TOOLS */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeTab === 'ai_tools' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="card border-0 shadow-sm rounded-4 bg-white p-4 mb-3">
            <h5 className="fw-bold mb-1">AI Tools Directory</h5>
            <p className="text-muted small mb-0">Instantly execute specialized engineering and document generation pipelines.</p>
          </div>

          <div className="row g-3">
            {[
              { name: 'Code Generator', desc: 'Generate clean components, hooks, controllers or schema bindings.', icon: faCodeBranch, color: '#4f46e5' },
              { name: 'SQL Generator', desc: 'Translate specifications to optimized SQL queries and migrations.', icon: faDatabase, color: '#10b981' },
              { name: 'API Generator', desc: 'Create REST endpoints with complete validation rules.', icon: faLink, color: '#06b6d4' },
              { name: 'ER Diagram', desc: 'Generate databases relational schemas using simple specifications.', icon: faSitemap, color: '#f59e0b' },
              { name: 'Flowchart', desc: 'Create logic mapping and process flowcharts.', icon: faProjectDiagram, color: '#ec4899' },
              { name: 'Meeting Summary', desc: 'Paste raw transcripts to generate bulleted action items and milestones.', icon: faUsers, color: '#8b5cf6' },
              { name: 'Email Generator', desc: 'Draft responsive sales campaigns and internal memo notices.', icon: faShare, color: '#14b8a6' },
              { name: 'Document Writer', desc: 'Compile professional reports, SOPs or feature manuals.', icon: faFileAlt, color: '#ef4444' }
            ].map((tool, idx) => (
              <div key={idx} className="col-xl-3 col-md-6">
                <div 
                  onClick={() => { setActiveTool(tool.name); setToolInput(''); setToolOutput(''); }}
                  className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100 cursor-pointer transition-all hover-lift"
                >
                  <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: `${tool.color}15`, color: tool.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 15 }}>
                    <FontAwesomeIcon icon={tool.icon} />
                  </div>
                  <h6 className="fw-bold text-dark mb-1">{tool.name}</h6>
                  <p className="text-muted small mb-0" style={{ fontSize: '12px', lineHeight: '1.5' }}>{tool.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Modal Tool area */}
          {activeTool && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="card border-0 shadow-sm rounded-4 bg-white p-4 mt-4">
              <div className="d-flex justify-content-between align-items-center pb-3 border-bottom mb-4">
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style={{ width: 34, height: 34 }}>
                    <FontAwesomeIcon icon={faTools} />
                  </div>
                  <h5 className="fw-bold text-dark mb-0">{activeTool}</h5>
                </div>
                <button className="btn btn-link text-muted" onClick={() => setActiveTool(null)}><FontAwesomeIcon icon={faTimes} /></button>
              </div>

              <div className="row g-4">
                <div className="col-lg-6">
                  <label className="form-label small fw-bold text-muted uppercase">Inputs & Instructions</label>
                  <textarea 
                    className="form-control bg-light border-0 rounded-4 p-3 text-dark mb-3"
                    rows={6}
                    placeholder={`Describe your prompt guidelines for ${activeTool}...`}
                    value={toolInput}
                    onChange={e => setToolInput(e.target.value)}
                  />
                  <button 
                    disabled={toolGenerating}
                    onClick={handleExecuteTool} 
                    className="btn w-100 rounded-pill py-2.5 text-white border-0 shadow-sm fw-bold" 
                    style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', fontSize: '13px' }}
                  >
                    {toolGenerating ? 'Generating results...' : 'GENERATE'}
                  </button>
                </div>

                <div className="col-lg-6">
                  <label className="form-label small fw-bold text-muted uppercase">Generated Output</label>
                  <div className="p-3 border rounded-4 bg-dark text-light font-monospace" style={{ minHeight: '190px', fontSize: '12px', whiteSpace: 'pre-wrap', position: 'relative' }}>
                    {toolOutput ? (
                      <>
                        <pre className="mb-0 overflow-x-auto"><code>{toolOutput}</code></pre>
                        <button className="btn btn-sm btn-outline-light border-0 position-absolute" style={{ top: 10, right: 10 }} onClick={() => navigator.clipboard.writeText(toolOutput)} title="Copy Output">
                          <FontAwesomeIcon icon={faCopy} />
                        </button>
                      </>
                    ) : (
                      <div className="text-center py-5 text-muted">
                        <FontAwesomeIcon icon={faBrain} className="mb-2 opacity-20" size="2x" />
                        <div>Ready to generate pipeline results. Fill inputs and execute.</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 5. KNOWLEDGE BASE */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeTab === 'ai_knowledge_base' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card border-0 shadow-sm rounded-4 bg-white p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="fw-bold mb-1">Company Knowledge Base Search</h5>
              <p className="text-muted small mb-0">Search and query indexed documents, wikis, and system notes across all ManageCore modules.</p>
            </div>
            <button className="btn btn-sm btn-primary rounded-pill px-3 py-1.5" onClick={() => alert('New document indexing sequence started...')}><FontAwesomeIcon icon={faUpload} className="me-2" />Index New Source</button>
          </div>

          <div className="position-relative mb-4">
            <span className="position-absolute" style={{ left: 16, top: '50%', transform: 'translateY(-50%)', color: '#6c757d' }}>
              <FontAwesomeIcon icon={faSearch} />
            </span>
            <input 
              type="text" 
              className="form-control form-control-lg bg-light border-0 ps-5 rounded-4 text-dark" 
              placeholder="Search policies, Wiki, meeting notes, project requirements..." 
            />
          </div>

          <div className="row g-3">
            {[
              { name: 'Company Onboarding Handbook', type: 'HR Files', status: 'Indexed', size: '2.5 MB', date: '3 days ago' },
              { name: 'PMS Interactive Architecture SOP', type: 'Wiki', status: 'Indexed', size: '1.2 MB', date: '5 days ago' },
              { name: 'FMS Ledger Schema mapping rules', type: 'Technical Doc', status: 'Pending Verification', size: '420 KB', date: '1 week ago' },
              { name: 'Q1 Executive Budget Reconciliation', type: 'Finance Report', status: 'Indexed', size: '4.8 MB', date: '2 weeks ago' },
              { name: 'Team Productivity Analytics V3', type: 'Meetings Notes', status: 'Failed to index', size: '890 KB', date: '1 month ago' }
            ].map((source, idx) => (
              <div key={idx} className="col-12 p-3 border rounded-4 bg-light bg-opacity-40 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                    <FontAwesomeIcon icon={faDatabase} />
                  </div>
                  <div>
                    <h6 className="fw-bold text-dark mb-1">{source.name}</h6>
                    <span className="text-muted x-small font-monospace" style={{ fontSize: '10px' }}>{source.type} &bull; {source.size} &bull; Updated {source.date}</span>
                  </div>
                </div>
                <div>
                  <span className={`badge bg-${source.status === 'Indexed' ? 'success' : (source.status === 'Failed to index' ? 'danger' : 'warning')} bg-opacity-10 text-${source.status === 'Indexed' ? 'success' : (source.status === 'Failed to index' ? 'danger' : 'warning')} px-3 py-1.5 rounded-pill`} style={{ fontSize: '11px' }}>
                    {source.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 6. FILES MANAGER */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeTab === 'ai_files' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card border-0 shadow-sm rounded-4 bg-white p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="fw-bold mb-1">AI File Manager</h5>
              <p className="text-muted small mb-0">Manage uploaded data assets. Files can be referenced globally in prompts.</p>
            </div>
            <button className="btn btn-sm btn-primary rounded-pill px-3 py-1.5" onClick={() => alert('Upload triggers native file uploader')}><FontAwesomeIcon icon={faUpload} className="me-2" />Upload File</button>
          </div>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="small text-muted uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Filename</th>
                  <th>Type</th>
                  <th>Size</th>
                  <th>Date Uploaded</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, idx) => (
                  <tr key={idx} className="border-bottom">
                    <td className="py-3 px-4 font-bold text-dark">
                      <FontAwesomeIcon icon={faFileAlt} className="text-muted me-2" />
                      {file.name}
                    </td>
                    <td><span className="badge bg-light text-dark border px-2 py-0.5 rounded" style={{ fontSize: '10px' }}>{file.type}</span></td>
                    <td>{file.size}</td>
                    <td className="small text-muted">{file.date}</td>
                    <td className="text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        <button className="btn btn-sm btn-outline-primary rounded-pill px-2.5 py-1 font-bold" style={{ fontSize: '10px' }} onClick={() => { setAttachments([...attachments, file.name]); setActiveTab('ai_new_chat'); }}>Reuse File</button>
                        <button className="btn btn-sm btn-outline-danger border-0 rounded-circle" onClick={() => setFiles(files.filter((_, i) => i !== idx))}><FontAwesomeIcon icon={faTrash} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 7. SETTINGS & CONTROLS */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeTab === 'ai_settings' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="card border-0 shadow-sm rounded-4 bg-white p-4 mb-3">
            <h5 className="fw-bold mb-1">AI Workspace Settings</h5>
            <p className="text-muted small mb-0">Control token quotas, toggle pre-trained models, and customize AI preference files.</p>
          </div>

          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100">
                <h5 className="fw-bold mb-4">Toggle Available Models</h5>
                <div className="space-y-3">
                  {[
                    { name: 'GPT-4o (OpenAI)', active: true, desc: 'Optimized for reasoning and logical task analysis.' },
                    { name: 'Claude 3.5 Sonnet (Anthropic)', active: true, desc: 'Recommended for code generation and document analysis.' },
                    { name: 'Gemini 1.5 Pro (Google)', active: true, desc: 'Best for large context windows and multi-modal files.' },
                    { name: 'DeepSeek R1 (DeepSeek)', active: true, desc: 'High-performance mathematical reasoning.' },
                    { name: 'Llama 3 70B (Meta)', active: false, desc: 'Local deployment model, offline support.' },
                    { name: 'Company Custom AI (Fine-tuned)', active: true, desc: 'Fine-tuned on ManageCore databases and bylaws.' }
                  ].map((model, idx) => (
                    <div key={idx} className="p-3 border rounded-4 d-flex justify-content-between align-items-center">
                      <div>
                        <span className="fw-bold text-dark d-block">{model.name}</span>
                        <small className="text-muted">{model.desc}</small>
                      </div>
                      <div className="d-flex align-items-center">
                        <EnableDisableButton
                          checked={modelEnabledStates[model.name]}
                          onClick={() => toggleModel(model.name)}
                          label={model.name}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100">
                <h5 className="fw-bold mb-4">Edit Custom AI Memory Profile</h5>
                <p className="text-muted small mb-3">Updating guidelines will automatically alter context headers prepended to prompt payloads.</p>
                <div className="space-y-3">
                  <div>
                    <label className="form-label small fw-bold text-muted uppercase">Preferred Writing Style</label>
                    <input type="text" className="form-control bg-light border-0 rounded-3 text-dark" value={memory.writingStyle} onChange={e => setMemory({ ...memory, writingStyle: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label small fw-bold text-muted uppercase">Preferred Coding Conventions</label>
                    <input type="text" className="form-control bg-light border-0 rounded-3 text-dark" value={memory.codingStyle} onChange={e => setMemory({ ...memory, codingStyle: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label small fw-bold text-muted uppercase">Language / Locales</label>
                    <input type="text" className="form-control bg-light border-0 rounded-3 text-dark" value={memory.preferredLanguage} onChange={e => setMemory({ ...memory, preferredLanguage: e.target.value })} />
                  </div>
                  <div>
                    <label className="form-label small fw-bold text-muted uppercase">Default Team Department</label>
                    <input type="text" className="form-control bg-light border-0 rounded-3 text-dark" value={memory.department} onChange={e => setMemory({ ...memory, department: e.target.value })} />
                  </div>
                  <button className="btn btn-primary rounded-pill px-5 py-2 fw-bold hover-lift mt-3 shadow-sm" onClick={() => alert('AI preferences updated successfully.')}>Save Memory Configuration</button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 8. CLAUDE PROJECTS VIEW */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeTab === 'ai_projects' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="card border-0 shadow-sm rounded-4 bg-white p-4 mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-1">Claude-style AI Projects</h5>
                <p className="text-muted small mb-0">Create isolated workspaces with custom instruction sets, document attachments, and chat scopes.</p>
              </div>
              <button className="btn btn-sm btn-primary rounded-pill px-3 py-1.5" onClick={() => setShowCreateProject(true)}><FontAwesomeIcon icon={faPlus} className="me-2" />New AI Project</button>
            </div>
          </div>

          {activeProjectId === null ? (
            <div className="row g-4">
              {projects.map((proj) => (
                <div key={proj.id} className="col-lg-4 col-md-6">
                  <div className="card border-0 shadow-sm rounded-4 bg-white p-4 h-100 d-flex flex-column justify-content-between transition-all hover-lift">
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="rounded bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style={{ width: 42, height: 42 }}>
                          <FontAwesomeIcon icon={faProjectDiagram} />
                        </div>
                        <span className="badge bg-light text-muted border px-2 py-0.5 rounded" style={{ fontSize: '10px' }}>{proj.membersCount} Members</span>
                      </div>
                      <h6 className="fw-bold text-dark mb-2">{proj.name}</h6>
                      <p className="text-muted small line-clamp-3 mb-3">{proj.description}</p>
                    </div>

                    <div className="border-top pt-3 mt-4">
                      <div className="d-flex justify-content-between text-muted mb-3" style={{ fontSize: '11px' }}>
                        <span>Documents: <b>{proj.docsCount}</b></span>
                        <span>Chats: <b>{proj.chatsCount}</b></span>
                      </div>
                      <button className="btn btn-sm btn-outline-primary w-100 rounded-pill font-bold" onClick={() => setActiveProjectId(proj.id)}>Open Project Context</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Project Detail Workspace View
            (() => {
              const currentProj = projects.find(p => p.id === activeProjectId);
              return (
                <div className="space-y-4">
                  <div className="d-flex align-items-center gap-2">
                    <button className="btn btn-link text-muted p-0" onClick={() => setActiveProjectId(null)}>
                      <FontAwesomeIcon icon={faChevronLeft} className="me-1" /> Back to Projects
                    </button>
                  </div>

                  <div className="row g-4">
                    <div className="col-lg-8">
                      <div className="card border-0 shadow-sm rounded-4 bg-white p-4 space-y-4">
                        <div className="d-flex justify-content-between align-items-start border-bottom pb-3">
                          <div>
                            <h4 className="fw-bold text-dark mb-1">{currentProj?.name}</h4>
                            <p className="text-muted small mb-0">{currentProj?.description}</p>
                          </div>
                          <button className="btn btn-sm btn-primary rounded-pill px-4" onClick={() => {
                            setActiveProjectContext(currentProj?.name || 'ManageCore PMS');
                            setActiveTab('ai_new_chat');
                            handleNewChat();
                          }}><FontAwesomeIcon icon={faPlus} className="me-2" />Start Chat in Project</button>
                        </div>

                        <div>
                          <h6 className="fw-bold text-dark mb-2">Project Custom Guidelines / Instructions</h6>
                          <div className="p-3 border rounded-4 bg-light bg-opacity-40 text-dark-emphasis small" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                            {currentProj?.instructions}
                          </div>
                          <button className="btn btn-xs btn-outline-secondary rounded-pill mt-2.5" onClick={() => alert('Editing guidelines...')}><FontAwesomeIcon icon={faEdit} className="me-1.5" />Update Instructions</button>
                        </div>

                        <div>
                          <h6 className="fw-bold text-dark mb-3">Project Specific Context Documents</h6>
                          <div className="space-y-2">
                            {['Vector_Index_Website.pdf', 'Redesign_Sitemap.xlsx', 'Figma_Milestones_Manifest.json'].map((doc, idx) => (
                              <div key={idx} className="p-3 border rounded-4 bg-light bg-opacity-20 d-flex justify-content-between align-items-center">
                                <span className="small font-bold text-dark"><FontAwesomeIcon icon={faFileAlt} className="text-muted me-2" />{doc}</span>
                                <div className="d-flex gap-2">
                                  <button className="btn btn-xs btn-link text-muted border-0 p-0" title="View"><FontAwesomeIcon icon={faEye} /></button>
                                  <button className="btn btn-xs btn-link text-danger border-0 p-0" title="Delete"><FontAwesomeIcon icon={faTrash} /></button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <button className="btn btn-xs btn-outline-primary rounded-pill mt-3" onClick={() => alert('Import file sequence opened')}><FontAwesomeIcon icon={faUpload} className="me-1.5" />Upload Context Document</button>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-4">
                      <div className="card border-0 shadow-sm rounded-4 bg-white p-4 space-y-4">
                        <h6 className="fw-bold text-dark border-bottom pb-2 mb-0">Project Metadata</h6>
                        <div className="space-y-3">
                          <div className="d-flex justify-content-between align-items-center small">
                            <span className="text-muted">Total Conversations:</span>
                            <span className="fw-bold text-dark">{currentProj?.chatsCount}</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center small">
                            <span className="text-muted">Indexed Files Size:</span>
                            <span className="fw-bold text-dark">8.4 MB</span>
                          </div>
                          <div className="d-flex justify-content-between align-items-center small">
                            <span className="text-muted">Total Tokens Ingested:</span>
                            <span className="fw-bold text-dark">412,000</span>
                          </div>
                        </div>

                        <hr className="opacity-10" />

                        <div className="space-y-3">
                          <h6 className="fw-bold text-dark mb-0">Project Access Roster</h6>
                          <div className="space-y-2">
                            {['Tony Stark (Lead)', 'Bruce Wayne', 'System Automator'].map((m, idx) => (
                              <div key={idx} className="d-flex align-items-center justify-content-between small">
                                <span className="fw-medium text-dark-emphasis">{m}</span>
                                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-0.5" style={{ fontSize: '8px' }}>Active</span>
                              </div>
                            ))}
                          </div>
                          <button className="btn btn-xs btn-outline-secondary w-100 rounded-pill mt-2" onClick={() => alert('Invite member...')}><FontAwesomeIcon icon={faUserPlus} className="me-2" />Add Members</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          )}

          {/* Modal Overlay for Creating Projects */}
          {showCreateProject && (
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 1050 }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow rounded-4 p-4">
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                    <h5 className="fw-bold mb-0">Create New AI Project Context</h5>
                    <button className="btn-close" onClick={() => setShowCreateProject(false)}></button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="form-label small fw-bold text-muted">Project Name</label>
                      <input type="text" className="form-control bg-light border-0 text-dark" value={newProjectName} onChange={e => setNewProjectName(e.target.value)} placeholder="e.g. Website launch campaign" />
                    </div>
                    <div>
                      <label className="form-label small fw-bold text-muted">Short Description</label>
                      <textarea className="form-control bg-light border-0 text-dark" value={newProjectDesc} onChange={e => setNewProjectDesc(e.target.value)} placeholder="What is the scope of this project?" rows={2} />
                    </div>
                    <div>
                      <label className="form-label small fw-bold text-muted">Custom System Instructions</label>
                      <textarea className="form-control bg-light border-0 text-dark" value={newProjectInst} onChange={e => setNewProjectInst(e.target.value)} placeholder="e.g. Always output code in React, use active professional voice..." rows={3} />
                    </div>
                    <div className="d-flex gap-2 justify-content-end pt-3">
                      <button className="btn btn-light rounded-pill px-4" onClick={() => setShowCreateProject(false)}>Cancel</button>
                      <button className="btn btn-primary rounded-pill px-4 text-white border-0" onClick={handleCreateProject}>Create Project</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 9. SHARED CHATS FEED */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeTab === 'ai_shared_chats' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="card border-0 shadow-sm rounded-4 bg-white p-4 mb-3">
            <h5 className="fw-bold mb-1">Shared Collaboration Workspace</h5>
            <p className="text-muted small mb-0">Read and fork chat transcripts shared by team members across the organization.</p>
          </div>

          {selectedSharedChat === null ? (
            <div className="row g-4">
              {sharedChats.map((sc) => (
                <div key={sc.id} className="col-lg-4 col-md-6">
                  <div className="card border-0 shadow-sm rounded-4 bg-white p-4 h-100 d-flex flex-column justify-content-between transition-all hover-lift">
                    <div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <span className="badge bg-primary bg-opacity-10 text-primary" style={{ fontSize: '10px' }}>{sc.department}</span>
                        <span className="small text-muted font-monospace" style={{ fontSize: '10px' }}>{sc.time}</span>
                      </div>
                      <h6 className="fw-bold text-dark mb-2">{sc.title}</h6>
                      <span className="small text-muted">Shared by: <b>@{sc.sharedBy}</b></span>
                    </div>

                    <div className="border-top pt-3 mt-4 d-flex justify-content-between align-items-center">
                      <span className="small text-muted font-monospace" style={{ fontSize: '11px' }}>{sc.views} Views &bull; {sc.likes} Likes</span>
                      <button className="btn btn-sm btn-primary rounded-pill px-3 font-bold text-white border-0" onClick={() => setSelectedSharedChat(sc)}>View Chat</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
                  <button className="btn btn-link text-muted p-0 mb-3" onClick={() => setSelectedSharedChat(null)}>
                    <FontAwesomeIcon icon={faChevronLeft} className="me-1" /> Back to Feed
                  </button>
                  <div className="border-bottom pb-3 mb-4">
                    <h4 className="fw-bold text-dark mb-1">{selectedSharedChat.title}</h4>
                    <p className="text-muted small mb-0">Shared by <b>@{selectedSharedChat.sharedBy}</b> ({selectedSharedChat.department}) &bull; {selectedSharedChat.time}</p>
                  </div>

                  <div className="p-3 border rounded-4 bg-light bg-opacity-40 text-dark-emphasis small space-y-3 mb-4">
                    <div className="fw-bold border-bottom pb-1 text-dark uppercase" style={{ fontSize: '9px' }}>Transcript Snippet</div>
                    <p><b>User:</b> I need help drafting a detailed pipeline layout for PMS integration...</p>
                    <p><b>AI:</b> Sure, here is the recommended architecture flow...</p>
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn btn-primary rounded-pill px-4 fw-bold text-white border-0" onClick={() => {
                      createNewChat();
                      alert('Duplicated to your active Chats list!');
                    }}><FontAwesomeIcon icon={faCopy} className="me-2" />Duplicate to My Workspace</button>
                    <button className="btn btn-outline-secondary rounded-pill px-4 fw-bold" onClick={() => {
                      const updated = sharedChats.map(s => s.id === selectedSharedChat.id ? { ...s, likes: s.likes + 1 } : s);
                      setSharedChats(updated);
                      setSelectedSharedChat({ ...selectedSharedChat, likes: selectedSharedChat.likes + 1 });
                      alert('Liked chat transcript!');
                    }}><FontAwesomeIcon icon={faThumbsUp} className="me-2" />Like ({selectedSharedChat.likes})</button>
                  </div>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card border-0 shadow-sm rounded-4 bg-white p-4 space-y-4">
                  <h6 className="fw-bold text-dark border-bottom pb-2 mb-0">Team Comments</h6>
                  <div className="space-y-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {selectedSharedChat.comments.map((c, idx) => (
                      <div key={idx} className="p-2.5 rounded border bg-light bg-opacity-20 small">
                        <span className="fw-bold text-dark d-block">@{c.user}</span>
                        <span className="text-muted">{c.text}</span>
                      </div>
                    ))}
                    {selectedSharedChat.comments.length === 0 && (
                      <div className="text-center py-4 text-muted small">No comments yet. Be the first to reply.</div>
                    )}
                  </div>
                  <div className="pt-2 border-top">
                    <textarea className="form-control form-control-sm border mb-2 bg-light text-dark" rows={2} value={sharedComment} onChange={e => setSharedComment(e.target.value)} placeholder="Type a comment..." style={{ resize: 'none' }} />
                    <button className="btn btn-xs btn-primary w-100 rounded-pill font-bold text-white border-0" onClick={() => {
                      if (!sharedComment.trim()) return;
                      const updated = sharedChats.map(s => {
                        if (s.id === selectedSharedChat.id) {
                          return { ...s, comments: [...s.comments, { user: currentUser?.name || 'User', text: sharedComment }] };
                        }
                        return s;
                      });
                      setSharedChats(updated);
                      setSelectedSharedChat({ ...selectedSharedChat, comments: [...selectedSharedChat.comments, { user: currentUser?.name || 'User', text: sharedComment }] });
                      setSharedComment('');
                    }}>Post Comment</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 10. ADVANCED ANALYTICS */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeTab === 'ai_analytics' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
            <h5 className="fw-bold mb-1">AI Usage & Cost Telemetry</h5>
            <p className="text-muted small mb-0">Live charting on token cost, department distribution, response latency, and system audit logs.</p>
          </div>

          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                <h6 className="fw-bold text-dark mb-4">Estimated Dollar Spend ($) By Model</h6>
                <div style={{ height: '240px' }}>
                  <Bar
                    data={{
                      labels: ['Claude 3.5', 'GPT-4o', 'Gemini Pro', 'DeepSeek R1', 'Llama 3'],
                      datasets: [{
                        label: 'Estimated Cost ($)',
                        data: [412, 280, 195, 45, 12],
                        backgroundColor: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ec4899'],
                        borderRadius: 8
                      }]
                    }}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
                <h6 className="fw-bold text-dark mb-4">Mean Response Latency (ms)</h6>
                <div style={{ height: '240px' }}>
                  <Line
                    data={{
                      labels: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'],
                      datasets: [{
                        label: 'Average Latency',
                        data: [720, 890, 1100, 940, 810, 750, 780],
                        borderColor: '#8b5cf6',
                        tension: 0.4,
                        fill: false
                      }]
                    }}
                    options={{ responsive: true, maintainAspectRatio: false }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="card border-0 shadow-sm rounded-4 bg-white p-4 mt-4">
            <h6 className="fw-bold text-dark mb-3">AI Query Security Audit Log</h6>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="small text-muted uppercase tracking-wider">
                  <tr>
                    <th>Timestamp</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Model</th>
                    <th>Tokens</th>
                    <th>Latency</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log, idx) => (
                    <tr key={idx} className="border-bottom small">
                      <td className="py-2.5 font-monospace text-muted">{log.time}</td>
                      <td className="fw-bold text-dark">@{log.user}</td>
                      <td>{log.action}</td>
                      <td><span className="badge bg-light border text-dark">{log.model}</span></td>
                      <td className="font-monospace">{log.tokens}</td>
                      <td className="font-monospace text-success">{log.latency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 11. AUTOMATIONS WORKFLOWS */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeTab === 'ai_automations' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="card border-0 shadow-sm rounded-4 bg-white p-4 mb-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="fw-bold mb-1">Triggered Automation Pipelines</h5>
                <p className="text-muted small mb-0">Deploy event-driven AI agents executing actions based on system transitions or cron triggers.</p>
              </div>
              <button className="btn btn-sm btn-primary rounded-pill px-3 py-1.5" onClick={() => setShowCreateAutomation(true)}><FontAwesomeIcon icon={faPlus} className="me-2" />New AI Pipeline</button>
            </div>
          </div>

          <div className="row g-4">
            {automations.map((a) => (
              <div key={a.id} className="col-md-6">
                <div className="card border-0 shadow-sm p-4 rounded-4 bg-white h-100 d-flex flex-column justify-content-between transition-all hover-lift">
                  <div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center" style={{ width: 34, height: 34 }}>
                          <FontAwesomeIcon icon={faBolt} />
                        </div>
                        <h6 className="fw-bold text-dark mb-0">{a.name}</h6>
                      </div>
                      <EnableDisableButton
                        checked={a.status}
                        onClick={() => {
                          const updated = automations.map(aut => aut.id === a.id ? { ...aut, status: !aut.status } : aut);
                          setAutomations(updated);
                        }}
                        label={a.name}
                      />
                    </div>

                    <div className="p-3 border rounded-4 bg-light bg-opacity-40 space-y-2 mt-3 small">
                      <div><span className="text-muted uppercase fw-bold" style={{ fontSize: '8px' }}>Trigger Condition</span><br /><b>{a.trigger}</b></div>
                      <div className="pt-2 border-top"><span className="text-muted uppercase fw-bold" style={{ fontSize: '8px' }}>AI Pipeline Action</span><br /><span>{a.action}</span></div>
                    </div>
                  </div>

                  <div className="pt-3 border-top mt-4 d-flex justify-content-between align-items-center">
                    <span className="badge bg-light text-muted border px-2 py-0.5 rounded" style={{ fontSize: '9px' }}>Event-Triggered</span>
                    <button className="btn btn-xs btn-outline-secondary rounded-pill font-bold" onClick={() => alert('Simulating pipeline execution now...')}><FontAwesomeIcon icon={faPlayCircle} className="me-1.5 text-success" />Execute Now</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Modal overlay for creating automations */}
          {showCreateAutomation && (
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 1050 }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow rounded-4 p-4">
                  <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                    <h5 className="fw-bold mb-0">Configure New AI Pipeline</h5>
                    <button className="btn-close" onClick={() => setShowCreateAutomation(false)}></button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="form-label small fw-bold text-muted">Pipeline Name</label>
                      <input type="text" className="form-control bg-light border-0 text-dark" value={newAutoName} onChange={e => setNewAutoName(e.target.value)} placeholder="e.g. Sales Invoice Auditor" />
                    </div>
                    <div>
                      <label className="form-label small fw-bold text-muted">Trigger Condition</label>
                      <select className="form-select bg-light border-0 text-dark" value={newAutoTrigger} onChange={e => setNewAutoTrigger(e.target.value)}>
                        <option>Daily 6:00 PM</option>
                        <option>Weekly Monday 8:00 AM</option>
                        <option>On PMS Transcript Upload</option>
                        <option>On FMS Invoice Creation</option>
                        <option>On DMS New Document Index</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label small fw-bold text-muted">AI Instruction Logic</label>
                      <textarea className="form-control bg-light border-0 text-dark" value={newAutoAction} onChange={e => setNewAutoAction(e.target.value)} placeholder="Define the AI pipeline action. e.g. Audit ledger rows, extract cost nodes..." rows={3} />
                    </div>
                    <div className="d-flex gap-2 justify-content-end pt-3">
                      <button className="btn btn-light rounded-pill px-4" onClick={() => setShowCreateAutomation(false)}>Cancel</button>
                      <button className="btn btn-primary rounded-pill px-4 text-white border-0" onClick={handleCreateAutomation}>Deploy Pipeline</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 12. ARCHIVE VIEW */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeTab === 'ai_archive' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card border-0 shadow-sm rounded-4 bg-white p-4">
          <div className="border-bottom pb-3 mb-4">
            <h5 className="fw-bold mb-1">Archived Chats</h5>
            <p className="text-muted small mb-0">View or restore previously archived conversations to your active sidebar workspace.</p>
          </div>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="small text-muted uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Chat Title</th>
                  <th>Folder</th>
                  <th>Date Archived</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {archivedChats.map((c) => (
                  <tr key={c.id} className="border-bottom">
                    <td className="py-3 px-4 font-bold text-dark">
                      <FontAwesomeIcon icon={faComments} className="text-muted me-2" />
                      {c.title}
                    </td>
                    <td><span className="badge bg-light text-dark border px-2.5 py-1 rounded" style={{ fontSize: '10px' }}>{folders.find(f=>f.id===c.folder)?.name || 'None'}</span></td>
                    <td className="small text-muted">{c.dateArchived}</td>
                    <td className="text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        <button className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 font-bold" style={{ fontSize: '10px' }} onClick={() => handleRestoreArchivedChat(c.id)}><FontAwesomeIcon icon={faArrowRotateRight} className="me-1.5" />Restore</button>
                        <button className="btn btn-sm btn-outline-danger border-0 rounded-circle" onClick={() => handleDeleteArchivedChat(c.id)}><FontAwesomeIcon icon={faTrash} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {archivedChats.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-5 text-muted small">
                      <FontAwesomeIcon icon={faArchive} className="mb-2 opacity-20" size="2x" />
                      <div>No archived chats found.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 13. TRASH VIEW */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeTab === 'ai_trash' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card border-0 shadow-sm rounded-4 bg-white p-4">
          <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
            <div>
              <h5 className="fw-bold mb-1">Trash Bin</h5>
              <p className="text-muted small mb-0">Deleted chats are kept here for 30 days before being permanently wiped.</p>
            </div>
            {trashedChats.length > 0 && (
              <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={handleEmptyTrash}><FontAwesomeIcon icon={faTrashAlt} className="me-2" />Empty Trash</button>
            )}
          </div>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="small text-muted uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Chat Title</th>
                  <th>Folder</th>
                  <th>Date Deleted</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trashedChats.map((c) => (
                  <tr key={c.id} className="border-bottom">
                    <td className="py-3 px-4 font-bold text-dark">
                      <FontAwesomeIcon icon={faComments} className="text-muted me-2" />
                      {c.title}
                    </td>
                    <td><span className="badge bg-light text-dark border px-2.5 py-1 rounded" style={{ fontSize: '10px' }}>{folders.find(f=>f.id===c.folder)?.name || 'None'}</span></td>
                    <td className="small text-muted">{c.dateDeleted}</td>
                    <td className="text-end">
                      <div className="d-flex gap-2 justify-content-end">
                        <button className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1 font-bold" style={{ fontSize: '10px' }} onClick={() => handleRestoreTrashedChat(c.id)}>Restore</button>
                        <button className="btn btn-sm btn-outline-danger rounded-pill px-3 py-1 font-bold" style={{ fontSize: '10px' }} onClick={() => handlePermanentDeleteTrash(c.id)}>Delete Forever</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {trashedChats.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-5 text-muted small">
                      <FontAwesomeIcon icon={faTrash} className="mb-2 opacity-20" size="2x" />
                      <div>Trash bin is empty.</div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* ──────────────────────────────────────────────────────── */}
      {/* 14. AI TRAINING CENTER */}
      {/* ──────────────────────────────────────────────────────── */}
      {activeTab === 'ai_training_center' && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

          {/* Training Center Sub-Tab Navigation */}
          <div className="card border-0 shadow-sm rounded-4 bg-white p-3 mb-3">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
              <div className="d-flex align-items-center gap-2">
                <div className="rounded bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                  <FontAwesomeIcon icon={faGraduationCap} />
                </div>
                <div>
                  <h5 className="fw-bold text-dark mb-0">AI Training Center</h5>
                  <small className="text-muted" style={{ fontSize: '11px' }}>Train, fine-tune, and deploy custom AI models & agents for your departments.</small>
                </div>
              </div>
              <div className="d-flex flex-wrap gap-1.5 bg-light p-1 rounded-3">
                {[
                  { id: 'overview', label: 'Overview', icon: faChartArea },
                  { id: 'models', label: 'Models', icon: faCubes },
                  { id: 'datasets', label: 'Datasets', icon: faClipboardList },
                  { id: 'sessions', label: 'Training', icon: faDumbbell },
                  { id: 'agents', label: 'Agents', icon: faRobot },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setTrainingSubTab(tab.id)}
                    className={`btn btn-xs rounded-pill px-3 py-1.5 fw-bold ${trainingSubTab === tab.id ? 'btn-primary text-white shadow-sm' : 'btn-light text-muted'}`}
                    style={{ fontSize: '11px' }}
                  >
                    <FontAwesomeIcon icon={tab.icon} className="me-1.5" />{tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ─── OVERVIEW SUB-TAB ─── */}
          {trainingSubTab === 'overview' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {/* KPI Cards */}
              <div className="row g-3 mb-3">
                {[
                  { label: 'Total Models', value: trainingModels.length, icon: faCubes, color: '#4f46e5', detail: `${trainingModels.filter(m => m.status === 'active').length} active` },
                  { label: 'Training Sessions', value: trainingSessions.length, icon: faDumbbell, color: '#10b981', detail: `${trainingSessions.filter(s => s.status === 'running').length} running` },
                  { label: 'Total Datasets', value: trainingDatasets.length, icon: faClipboardList, color: '#06b6d4', detail: `${trainingDatasets.reduce((a, d) => a + d.rows, 0).toLocaleString()} rows` },
                  { label: 'Deployed Agents', value: trainingAgents.filter(a => a.status === 'deployed').length, icon: faRobot, color: '#8b5cf6', detail: `${trainingAgents.reduce((a, ag) => a + (ag.usage_count || ag.usageCount || 0), 0)} total uses` },
                  { label: 'Avg Accuracy', value: trainingModels.length > 0 ? (trainingModels.reduce((a, m) => a + m.accuracy, 0) / trainingModels.length).toFixed(1) + '%' : '0%', icon: faChartLine, color: '#f59e0b', detail: 'Across all models' },
                ].map((card, idx) => (
                  <div key={idx} className="col-xl col-md-4 col-sm-6">
                    <div className="card border-0 shadow-sm rounded-4 p-3 bg-white h-100 transition-all hover-lift">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: `${card.color}15`, color: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FontAwesomeIcon icon={card.icon} />
                        </div>
                        <span className="text-muted" style={{ fontSize: '10px' }}>{card.detail}</span>
                      </div>
                      <h6 className="text-muted text-uppercase mb-1" style={{ fontSize: '9px', letterSpacing: '0.05em' }}>{card.label}</h6>
                      <h4 className="fw-black mb-0 text-dark">{card.value}</h4>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Training Activity */}
              <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
                <h6 className="fw-bold text-dark mb-3">Recent Training Activity</h6>
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead>
                      <tr className="text-muted" style={{ fontSize: '10px', letterSpacing: '0.04em' }}>
                        <th>Model</th>
                        <th>Status</th>
                        <th>Progress</th>
                        <th>Accuracy</th>
                        <th>Loss</th>
                        <th>Started</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trainingSessions.length === 0 ? (
                        <tr><td colSpan="6" className="text-center text-muted py-4">No training sessions yet</td></tr>
                      ) : trainingSessions.slice(0, 5).map(s => {
                        const model = trainingModels.find(m => m.id === s.model_id);
                        return (
                          <tr key={s.id} className="border-bottom">
                            <td className="fw-bold text-dark">{model?.name || 'Unknown'}</td>
                            <td>
                              <span className={`badge rounded-pill px-2.5 py-1 ${s.status === 'running' ? 'bg-primary bg-opacity-10 text-primary' : s.status === 'completed' ? 'bg-success bg-opacity-10 text-success' : s.status === 'failed' ? 'bg-danger bg-opacity-10 text-danger' : 'bg-secondary bg-opacity-10 text-secondary'}`} style={{ fontSize: '10px' }}>
                                {s.status === 'running' && <FontAwesomeIcon icon={faSync} className="me-1 fa-spin" />}
                                {s.status}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div style={{ width: 80, height: 5, borderRadius: 5, background: '#e9edf5', overflow: 'hidden' }}>
                                  <div style={{ width: `${s.progress}%`, height: '100%', borderRadius: 5, background: s.status === 'failed' ? '#ef4444' : s.status === 'completed' ? '#10b981' : '#4f46e5' }} />
                                </div>
                                <span style={{ fontSize: '10px' }} className="text-muted">{s.progress}%</span>
                              </div>
                            </td>
                            <td className="font-monospace" style={{ fontSize: '11px' }}>{s.accuracy ?? '--'}%</td>
                            <td className="font-monospace" style={{ fontSize: '11px' }}>{s.loss ?? '--'}</td>
                            <td className="text-muted" style={{ fontSize: '11px' }}>{s.started_at || s.startedAt || '--'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── MODELS SUB-TAB ─── */}
          {trainingSubTab === 'models' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="fw-bold text-dark mb-0">Training Models</h6>
                <button className="btn btn-sm btn-primary rounded-pill px-3 py-1.5 fw-bold" onClick={() => setShowCreateModel(true)}>
                  <FontAwesomeIcon icon={faPlus} className="me-2" />New Model
                </button>
              </div>

              <div className="row g-3">
                {trainingModels.map(model => (
                  <div key={model.id} className="col-lg-4 col-md-6">
                    <div className="card border-0 shadow-sm rounded-4 bg-white p-4 h-100 d-flex flex-column transition-all hover-lift">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div className="rounded bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                          <FontAwesomeIcon icon={faCubes} />
                        </div>
                        <span className={`badge rounded-pill px-2.5 py-1 ${model.status === 'active' ? 'bg-success bg-opacity-10 text-success' : model.status === 'training' ? 'bg-primary bg-opacity-10 text-primary' : model.status === 'error' ? 'bg-danger bg-opacity-10 text-danger' : 'bg-secondary bg-opacity-10 text-secondary'}`} style={{ fontSize: '10px' }}>
                          {model.status === 'training' && <FontAwesomeIcon icon={faSync} className="me-1 fa-spin" />}
                          {model.status}
                        </span>
                      </div>
                      <h6 className="fw-bold text-dark mb-1">{model.name}</h6>
                      <p className="text-muted mb-2" style={{ fontSize: '11px' }}>{model.type}</p>
                      <div className="space-y-1 mb-3" style={{ fontSize: '11px' }}>
                        <div className="d-flex justify-content-between"><span className="text-muted">Base Model:</span><span className="fw-bold text-dark">{model.base_model || model.baseModel}</span></div>
                        <div className="d-flex justify-content-between"><span className="text-muted">Datasets:</span><span className="fw-bold text-dark">{trainingDatasets.filter(d => (d.model_id || d.modelId) === model.id).length}</span></div>
                        <div className="d-flex justify-content-between"><span className="text-muted">Accuracy:</span><span className="fw-bold text-success">{model.accuracy ?? 0}%</span></div>
                        <div className="d-flex justify-content-between"><span className="text-muted">Epochs:</span><span className="fw-bold text-dark">{model.epochs || '--'}</span></div>
                        <div className="d-flex justify-content-between"><span className="text-muted">Learning Rate:</span><span className="fw-bold text-dark">{model.learning_rate || '--'}</span></div>
                        <div className="d-flex justify-content-between"><span className="text-muted">Last Trained:</span><span className="text-dark">{model.last_trained || 'Never'}</span></div>
                      </div>
                      <div className="border-top pt-3 mt-auto d-flex gap-2">
                        {model.status !== 'training' ? (
                          <button className="btn btn-xs btn-primary rounded-pill px-3 fw-bold" style={{ fontSize: '10px' }} onClick={() => handleStartTraining(model.id)}>
                            <FontAwesomeIcon icon={faPlay} className="me-1" />Train
                          </button>
                        ) : (
                          <button className="btn btn-xs btn-danger rounded-pill px-3 fw-bold" style={{ fontSize: '10px' }} onClick={() => handleStopTraining(model.id)}>
                            <FontAwesomeIcon icon={faStopCircle} className="me-1" />Stop
                          </button>
                        )}
                        <button className="btn btn-xs btn-outline-secondary rounded-pill px-3" style={{ fontSize: '10px' }} onClick={() => { setSelectedTrainingModel(model); setTrainingSubTab('datasets'); }}>
                          <FontAwesomeIcon icon={faEye} className="me-1" />View
                        </button>
                        <button className="btn btn-xs btn-outline-danger border-0 rounded-circle" onClick={() => handleDeleteModel(model.id)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Create Model Modal */}
              {showCreateModel && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 1050 }}>
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow rounded-4 p-4">
                      <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                        <h5 className="fw-bold mb-0"><FontAwesomeIcon icon={faCubes} className="me-2 text-primary" />Create Training Model</h5>
                        <button className="btn-close" onClick={() => setShowCreateModel(false)}></button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="form-label small fw-bold text-muted">Model Name</label>
                          <input type="text" className="form-control bg-light border-0 text-dark" value={newModelForm.name} onChange={e => setNewModelForm({ ...newModelForm, name: e.target.value })} placeholder="e.g. Customer Intent Classifier" />
                        </div>
                        <div className="row g-3">
                          <div className="col-6">
                            <label className="form-label small fw-bold text-muted">Model Type</label>
                            <select className="form-select bg-light border-0 text-dark" value={newModelForm.type} onChange={e => setNewModelForm({ ...newModelForm, type: e.target.value })}>
                              {['Classification', 'NER / Extraction', 'Sentiment Analysis', 'Summarization', 'Code Generation', 'Text Generation', 'Translation', 'Custom'].map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                          </div>
                          <div className="col-6">
                            <label className="form-label small fw-bold text-muted">Base Model</label>
                            <select className="form-select bg-light border-0 text-dark" value={newModelForm.baseModel} onChange={e => setNewModelForm({ ...newModelForm, baseModel: e.target.value })}>
                              {['GPT-4o', 'Claude 3.5 Sonnet', 'Gemini 1.5 Pro', 'DeepSeek R1', 'Llama 3 70B', 'Custom'].map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                          </div>
                        </div>
                        <div className="row g-3">
                          <div className="col-4">
                            <label className="form-label small fw-bold text-muted">Learning Rate</label>
                            <input type="text" className="form-control bg-light border-0 text-dark" value={newModelForm.learningRate} onChange={e => setNewModelForm({ ...newModelForm, learningRate: e.target.value })} />
                          </div>
                          <div className="col-4">
                            <label className="form-label small fw-bold text-muted">Epochs</label>
                            <input type="number" className="form-control bg-light border-0 text-dark" value={newModelForm.epochs} onChange={e => setNewModelForm({ ...newModelForm, epochs: e.target.value })} />
                          </div>
                          <div className="col-4">
                            <label className="form-label small fw-bold text-muted">Batch Size</label>
                            <input type="number" className="form-control bg-light border-0 text-dark" value={newModelForm.batchSize} onChange={e => setNewModelForm({ ...newModelForm, batchSize: e.target.value })} />
                          </div>
                        </div>
                        <div className="d-flex gap-2 justify-content-end pt-3">
                          <button className="btn btn-light rounded-pill px-4" onClick={() => setShowCreateModel(false)}>Cancel</button>
                          <button className="btn btn-primary rounded-pill px-4 text-white border-0 fw-bold" onClick={handleCreateModel}>Create Model</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ─── DATASETS SUB-TAB ─── */}
          {trainingSubTab === 'datasets' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="fw-bold text-dark mb-0">
                    {selectedTrainingModel ? `Datasets for "${selectedTrainingModel.name}"` : 'All Training Datasets'}
                  </h6>
                  <small className="text-muted" style={{ fontSize: '11px' }}>Upload and manage training data in JSONL, CSV, TXT, or Parquet formats.</small>
                </div>
                <div className="d-flex gap-2">
                  {selectedTrainingModel && (
                    <button className="btn btn-sm btn-outline-secondary rounded-pill px-3" onClick={() => setSelectedTrainingModel(null)}>
                      <FontAwesomeIcon icon={faTimes} className="me-1" />Clear Filter
                    </button>
                  )}
                  <button className="btn btn-sm btn-primary rounded-pill px-3 py-1.5 fw-bold" onClick={() => setShowUploadDataset(true)}>
                    <FontAwesomeIcon icon={faUpload} className="me-2" />Upload Dataset
                  </button>
                </div>
              </div>

              <div className="card border-0 shadow-sm rounded-4 bg-white p-4">
                <div className="table-responsive">
                  <table className="table align-middle mb-0">
                    <thead>
                      <tr className="text-muted" style={{ fontSize: '10px', letterSpacing: '0.04em' }}>
                        <th>Filename</th>
                        <th>Model</th>
                        <th>Rows</th>
                        <th>Size</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Uploaded</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trainingDatasets
                        .filter(d => !selectedTrainingModel || (d.model_id || d.modelId) === selectedTrainingModel.id)
                        .map(ds => {
                          const model = trainingModels.find(m => m.id === (ds.model_id || ds.modelId));
                          return (
                            <tr key={ds.id} className="border-bottom">
                              <td className="fw-bold text-dark">
                                <FontAwesomeIcon icon={faFileAlt} className="text-muted me-2" />
                                {ds.name}
                              </td>
                              <td><span className="badge bg-light border text-dark" style={{ fontSize: '10px' }}>{model?.name || 'N/A'}</span></td>
                              <td className="font-monospace" style={{ fontSize: '11px' }}>{(ds.row_count || ds.rows || 0).toLocaleString()}</td>
                              <td style={{ fontSize: '11px' }}>{ds.file_size || ds.size || '--'}</td>
                              <td><span className="badge bg-light border text-dark" style={{ fontSize: '9px' }}>{ds.file_type || ds.type || '--'}</span></td>
                              <td>
                                <span className={`badge rounded-pill px-2 py-0.5 ${ds.status === 'ready' ? 'bg-success bg-opacity-10 text-success' : ds.status === 'uploaded' ? 'bg-info bg-opacity-10 text-info' : 'bg-warning bg-opacity-10 text-warning'}`} style={{ fontSize: '10px' }}>
                                  {ds.status === 'ready' && <FontAwesomeIcon icon={faCheck} className="me-1" />}
                                  {ds.status}
                                </span>
                              </td>
                              <td className="text-muted" style={{ fontSize: '11px' }}>{ds.uploaded_at || ds.uploadedAt || '--'}</td>
                              <td className="text-end">
                                <button className="btn btn-xs btn-outline-danger border-0 rounded-circle" onClick={() => {
                                  if (window.confirm('Delete this dataset?')) {
                                    setTrainingDatasets(prev => prev.filter(d => d.id !== ds.id));
                                  }
                                }}>
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Upload Dataset Modal */}
              {showUploadDataset && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 1050 }}>
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow rounded-4 p-4">
                      <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                        <h5 className="fw-bold mb-0"><FontAwesomeIcon icon={faUpload} className="me-2 text-primary" />Upload Training Dataset</h5>
                        <button className="btn-close" onClick={() => setShowUploadDataset(false)}></button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="form-label small fw-bold text-muted">Target Model</label>
                          <select className="form-select bg-light border-0 text-dark" value={selectedTrainingModel?.id || ''} onChange={e => {
                            const m = trainingModels.find(md => md.id === Number(e.target.value));
                            setSelectedTrainingModel(m || null);
                          }}>
                            <option value="">Select a model...</option>
                            {trainingModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="form-label small fw-bold text-muted">Dataset File</label>
                          <div className="p-5 border-2 border-dashed rounded-4 text-center bg-light bg-opacity-40">
                            <FontAwesomeIcon icon={faUpload} className="mb-2 text-muted opacity-50" size="2x" />
                            <p className="text-muted small mb-2">Drag & drop or click to upload</p>
                            <p className="text-muted" style={{ fontSize: '10px' }}>Supports: JSONL, CSV, TXT, Parquet (Max 50MB)</p>
                            <input type="file" className="form-control" accept=".jsonl,.csv,.txt,.parquet" onChange={(e) => {
                              if (e.target.files[0] && selectedTrainingModel) {
                                const file = e.target.files[0];
                                const formData = new FormData();
                                formData.append('file', file);
                                formData.append('name', file.name);
                                uploadAiTrainingDataset(selectedTrainingModel.id, formData)
                                  .then((newDs) => {
                                    setTrainingDatasets(prev => [...prev, newDs]);
                                    setShowUploadDataset(false);
                                    setAlertDialog({ show: true, title: 'Uploaded', message: `"${file.name}" uploaded and queued for processing.`, variant: 'success' });
                                  })
                                  .catch(err => {
                                    setAlertDialog({ show: true, title: 'Error', message: `Upload failed: ${err.message}`, variant: 'error' });
                                  });
                              }
                            }} />
                          </div>
                        </div>
                        <div className="d-flex gap-2 justify-content-end pt-3">
                          <button className="btn btn-light rounded-pill px-4" onClick={() => setShowUploadDataset(false)}>Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ─── TRAINING SESSIONS SUB-TAB ─── */}
          {trainingSubTab === 'sessions' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="fw-bold text-dark mb-0">Training Sessions</h6>
                <span className="text-muted small" style={{ fontSize: '11px' }}>
                  {trainingSessions.filter(s => s.status === 'running').length} active / {trainingSessions.length} total
                </span>
              </div>

              <div className="row g-3">
                {trainingSessions.map(session => {
                  const model = trainingModels.find(m => m.id === session.model_id);
                  return (
                    <div key={session.id} className="col-lg-6">
                      <div className="card border-0 shadow-sm rounded-4 bg-white p-4 h-100">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h6 className="fw-bold text-dark mb-1">{model?.name || 'Unknown Model'}</h6>
                            <span className="text-muted" style={{ fontSize: '11px' }}>Session #{session.id}</span>
                          </div>
                          <span className={`badge rounded-pill px-2.5 py-1 ${session.status === 'running' ? 'bg-primary bg-opacity-10 text-primary' : session.status === 'completed' ? 'bg-success bg-opacity-10 text-success' : session.status === 'failed' ? 'bg-danger bg-opacity-10 text-danger' : 'bg-secondary bg-opacity-10 text-secondary'}`} style={{ fontSize: '10px' }}>
                            {session.status === 'running' && <FontAwesomeIcon icon={faSync} className="me-1 fa-spin" />}
                            {session.status}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-3">
                          <div className="d-flex justify-content-between mb-1">
                            <span className="text-muted" style={{ fontSize: '10px' }}>Progress</span>
                            <span className="fw-bold" style={{ fontSize: '11px' }}>{session.progress}%</span>
                          </div>
                          <div style={{ height: 8, borderRadius: 8, background: '#e9edf5', overflow: 'hidden' }}>
                            <div style={{
                              width: `${session.progress}%`, height: '100%', borderRadius: 8,
                              background: session.status === 'failed' ? '#ef4444' : session.status === 'completed' ? '#10b981' : 'linear-gradient(90deg, #4f46e5, #7c3aed)',
                              transition: 'width 0.5s ease'
                            }} />
                          </div>
                        </div>

                        <div className="row g-2" style={{ fontSize: '11px' }}>
                          <div className="col-3">
                            <span className="text-muted d-block" style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 'bold' }}>Epoch</span>
                            <span className="fw-bold text-dark">{session.epoch}</span>
                          </div>
                          <div className="col-3">
                            <span className="text-muted d-block" style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 'bold' }}>Loss</span>
                            <span className="fw-bold text-dark">{session.loss}</span>
                          </div>
                          <div className="col-3">
                            <span className="text-muted d-block" style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 'bold' }}>Accuracy</span>
                            <span className="fw-bold text-success">{session.accuracy}%</span>
                          </div>
                          <div className="col-3">
                            <span className="text-muted d-block" style={{ fontSize: '9px', textTransform: 'uppercase', fontWeight: 'bold' }}>ETA</span>
                            <span className="fw-bold text-dark">{session.eta}</span>
                          </div>
                        </div>

                        <div className="border-top mt-3 pt-3 d-flex justify-content-between align-items-center">
                          <span className="text-muted" style={{ fontSize: '10px' }}>Started: {session.startedAt}</span>
                          {session.status === 'running' && (
                            <button className="btn btn-xs btn-outline-danger rounded-pill px-3 fw-bold" style={{ fontSize: '10px' }} onClick={() => handleStopTraining(session.model_id)}>
                              <FontAwesomeIcon icon={faStopCircle} className="me-1" />Stop
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ─── AGENTS SUB-TAB ─── */}
          {trainingSubTab === 'agents' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="fw-bold text-dark mb-0">AI Agents</h6>
                <button className="btn btn-sm btn-primary rounded-pill px-3 py-1.5 fw-bold" onClick={() => setShowCreateAgent(true)}>
                  <FontAwesomeIcon icon={faPlus} className="me-2" />New Agent
                </button>
              </div>

              <div className="row g-3">
                {trainingAgents.map(agent => {
                  const model = trainingModels.find(m => m.id === (agent.model_id || agent.modelId));
                  return (
                    <div key={agent.id} className="col-lg-4 col-md-6">
                      <div className="card border-0 shadow-sm rounded-4 bg-white p-4 h-100 d-flex flex-column transition-all hover-lift">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="rounded bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                            <FontAwesomeIcon icon={faRobot} />
                          </div>
                          <span className={`badge rounded-pill px-2.5 py-1 ${agent.status === 'deployed' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'}`} style={{ fontSize: '10px' }}>
                            {agent.status}
                          </span>
                        </div>
                        <h6 className="fw-bold text-dark mb-1">{agent.name}</h6>
                        <p className="text-muted mb-2" style={{ fontSize: '11px', lineHeight: '1.5' }}>{agent.description}</p>
                        <div className="space-y-1 mb-3" style={{ fontSize: '11px' }}>
                          <div className="d-flex justify-content-between"><span className="text-muted">Department:</span><span className="fw-bold text-dark">{agent.department}</span></div>
                          <div className="d-flex justify-content-between"><span className="text-muted">Base Model:</span><span className="fw-bold text-dark">{model?.name || 'N/A'}</span></div>
                          <div className="d-flex justify-content-between"><span className="text-muted">Usage Count:</span><span className="fw-bold text-primary">{agent.usage_count || agent.usageCount || 0}</span></div>
                          <div className="d-flex justify-content-between"><span className="text-muted">Last Used:</span><span className="text-dark">{agent.last_used || agent.lastUsed || 'Never'}</span></div>
                        </div>
                        <div className="border-top pt-3 mt-auto d-flex gap-2">
                          {agent.status === 'draft' ? (
                            <button className="btn btn-xs btn-success rounded-pill px-3 fw-bold" style={{ fontSize: '10px' }} onClick={() => handleDeployAgent(agent.id)}>
                              <FontAwesomeIcon icon={faPlay} className="me-1" />Deploy
                            </button>
                          ) : (
                            <button className="btn btn-xs btn-outline-primary rounded-pill px-3 fw-bold" style={{ fontSize: '10px' }} onClick={() => setAlertDialog({ show: true, title: 'Agent Chat', message: `Opening chat with "${agent.name}"...`, variant: 'info' })}>
                              <FontAwesomeIcon icon={faComments} className="me-1" />Chat
                            </button>
                          )}
                          <button className="btn btn-xs btn-outline-secondary rounded-pill px-3" style={{ fontSize: '10px' }}>
                            <FontAwesomeIcon icon={faEdit} className="me-1" />Edit
                          </button>
                          <button className="btn btn-xs btn-outline-danger border-0 rounded-circle" onClick={() => handleDeleteAgent(agent.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Create Agent Modal */}
              {showCreateAgent && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 1050 }}>
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow rounded-4 p-4">
                      <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                        <h5 className="fw-bold mb-0"><FontAwesomeIcon icon={faRobot} className="me-2 text-primary" />Create AI Agent</h5>
                        <button className="btn-close" onClick={() => setShowCreateAgent(false)}></button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <label className="form-label small fw-bold text-muted">Agent Name</label>
                          <input type="text" className="form-control bg-light border-0 text-dark" value={newAgentForm.name} onChange={e => setNewAgentForm({ ...newAgentForm, name: e.target.value })} placeholder="e.g. Support Ticket Router" />
                        </div>
                        <div>
                          <label className="form-label small fw-bold text-muted">Trained Model</label>
                          <select className="form-select bg-light border-0 text-dark" value={newAgentForm.modelId} onChange={e => setNewAgentForm({ ...newAgentForm, modelId: e.target.value })}>
                            <option value="">Select a trained model...</option>
                            {trainingModels.map(m => <option key={m.id} value={m.id}>{m.name} ({m.type})</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="form-label small fw-bold text-muted">Department</label>
                          <input type="text" className="form-control bg-light border-0 text-dark" value={newAgentForm.department} onChange={e => setNewAgentForm({ ...newAgentForm, department: e.target.value })} placeholder="e.g. Customer Success" />
                        </div>
                        <div>
                          <label className="form-label small fw-bold text-muted">Description</label>
                          <textarea className="form-control bg-light border-0 text-dark" rows={3} value={newAgentForm.description} onChange={e => setNewAgentForm({ ...newAgentForm, description: e.target.value })} placeholder="Describe what this agent does..." />
                        </div>
                        <div className="d-flex gap-2 justify-content-end pt-3">
                          <button className="btn btn-light rounded-pill px-4" onClick={() => setShowCreateAgent(false)}>Cancel</button>
                          <button className="btn btn-primary rounded-pill px-4 text-white border-0 fw-bold" onClick={handleCreateAgent}>Create Agent</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </motion.div>
      )}

      {/* Styles details */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hover-bg-light:hover {
          background-color: var(--bs-light) !important;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .hover-lift {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(0,0,0,0.08) !important;
        }
        .text-truncate-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .x-small {
          font-size: 11px;
        }
        .btn-xs {
          padding: 3px 8px;
          font-size: 10px;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        .hover-text-primary:hover {
          color: var(--bs-primary) !important;
        }
        .hover-text-danger:hover {
          color: var(--bs-danger) !important;
        }
`}} />
      
      {/* Folder Dialogs */}
      <DialogBox.Prompt
        show={newFolderDialog.show}
        onHide={() => setNewFolderDialog({ show: false })}
        title="Create New Folder"
        message="Enter a name for the new folder"
        inputLabel="Folder Name"
        inputPlaceholder="e.g. Development, Marketing, HR"
        confirmLabel="Create"
        cancelLabel="Cancel"
        initialValue=""
        validation={(v) => v.trim() ? null : 'Folder name is required'}
        onConfirm={(name) => { createFolder(name.trim()); setNewFolderDialog({ show: false }); }}
        size="sm"
      />
      
      <DialogBox.Prompt
        show={renameFolderDialog.show}
        onHide={() => setRenameFolderDialog({ show: false, folder: null })}
        title="Rename Folder"
        message="Enter a new name for the folder"
        inputLabel="Folder Name"
        inputPlaceholder="e.g. Development"
        confirmLabel="Rename"
        cancelLabel="Cancel"
        initialValue={renameFolderDialog.folder?.name || ''}
        validation={(v) => v.trim() ? null : 'Folder name is required'}
        onConfirm={(name) => { if (renameFolderDialog.folder) renameFolder(renameFolderDialog.folder.id, name.trim()); setRenameFolderDialog({ show: false, folder: null }); }}
        size="sm"
      />
      
      <DialogBox.Confirm
        show={deleteFolderDialog.show}
        onHide={() => setDeleteFolderDialog({ show: false, folder: null })}
        title="Delete Folder"
        message={deleteFolderDialog.folder ? `Delete folder "${deleteFolderDialog.folder.name}"? Chats in this folder will be moved to "No Folder".` : 'Delete this folder?'}
        variant="danger"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={() => { if (deleteFolderDialog.folder) deleteFolder(deleteFolderDialog.folder.id); setDeleteFolderDialog({ show: false, folder: null }); }}
        size="sm"
      />

      <DialogBox.Alert
        show={alertDialog.show}
        onHide={() => setAlertDialog({ show: false, title: '', message: '', variant: 'info' })}
        title={alertDialog.title}
        message={alertDialog.message}
        variant={alertDialog.variant}
        confirmLabel="OK"
        size="sm"
      />

      <DialogBox.Prompt
        show={addPromptDialog.show}
        onHide={() => setAddPromptDialog({ show: false })}
        title="Add Custom Prompt"
        message="Create a new prompt to add to your library."
        inputLabel="Title"
        inputPlaceholder="e.g. Code Review Checklist"
        confirmLabel="Next"
        cancelLabel="Cancel"
        initialValue=""
        validation={(v) => v.trim() ? null : 'Title is required'}
        onConfirm={(title) => {
          setAddPromptDialog({ show: false, inputValue2: '', category: 'Development' });
          setAddPromptDialog({
            show: true,
            step: 2,
            title: title.trim(),
            category: 'Development'
          });
        }}
        size="sm"
      />

      <DialogBox.Prompt
        show={addPromptDialog.show && addPromptDialog.step === 2}
        onHide={() => setAddPromptDialog({ show: false })}
        title="Add Prompt Content"
        message={`Enter the content for "${addPromptDialog.title}"`}
        inputLabel="Prompt Text"
        inputPlaceholder="Enter the prompt instructions..."
        confirmLabel="Save Prompt"
        cancelLabel="Cancel"
        multiline
        initialValue=""
        validation={(v) => v.trim() ? null : 'Prompt text is required'}
        onConfirm={(text) => {
          const newPrompt = { category: addPromptDialog.category, title: addPromptDialog.title, text: text.trim(), custom: true };
          setCustomPrompts(prev => [...prev, newPrompt]);
          setAddPromptDialog({ show: false });
          setAlertDialog({ show: true, title: 'Prompt Added', message: `"${addPromptDialog.title}" saved to your library.`, variant: 'success' });
        }}
        size="sm"
      />

    </div>
  );
};

export default AiWorkspace;
