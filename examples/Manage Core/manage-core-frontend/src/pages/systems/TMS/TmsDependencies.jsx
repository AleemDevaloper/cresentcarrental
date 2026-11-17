import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useApp } from '../../../hooks/useApp';
import { listProjects } from '../../../api/projects';
import { listProjectTasks, listAllTasks, listAllDependencies, createTaskDependency, updateTaskDependency, deleteTaskDependency } from '../../../api/tms';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSitemap, faArrowRight, faTasks, faLink, faLayerGroup, faCircleCheck,
  faTriangleExclamation, faTrashCan, faXmark, faProjectDiagram, faList,
  faPen, faMousePointer, faDrawPolygon, faRedoAlt, faInfoCircle,
  faSearch, faFilter, faPlus, faFileExport, faFileImport, faSave,
  faUndo, faRedo, faSearchMinus, faSearchPlus, faExpand, faCompress,
    faMap, faSun, faMoon, faGripVertical, faCodeBranch, faBorderAll,
  faArrowsAlt, faClock, faFlag, faUser, faCalendarAlt, faFileAlt,
  faComment, faPaperclip, faHistory, faEye, faLock, faCheckDouble,
  faExclamationCircle, faHourglassHalf, faCheckCircle, faTimesCircle,
  faArrowUp, faArrowDown, faBars, faAngleRight, faAngleLeft, faBolt, faEdit, faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import ReactFlow, {
  Background, Controls, Handle, Position, useNodesState, useEdgesState,
  MarkerType, ConnectionLineType, MiniMap, Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import TaskDetailModal from './TaskDetailModal';
import DialogBox from '../../../components/common/UI/Boxes/DialogBox';

const depTypeConfig = {
  FS: { label: 'Finish to Start', color: '#6366f1', short: 'FS' },
  FF: { label: 'Finish to Finish', color: '#f59e0b', short: 'FF' },
  SS: { label: 'Start to Start', color: '#10b981', short: 'SS' },
  SF: { label: 'Start to Finish', color: '#ef4444', short: 'SF' },
};

const statusColors = {
  'To Do': { border: '#bfdbfe', bg: '#eff6ff', text: '#1d4ed8' },
  'In Progress': { border: '#fde68a', bg: '#fef3c7', text: '#b45309' },
  'Testing': { border: '#fbcfe8', bg: '#fdf2f8', text: '#be185d' },
  'Done': { border: '#a7f3d0', bg: '#d1fae5', text: '#065f46' },
  'Completed': { border: '#a7f3d0', bg: '#d1fae5', text: '#065f46' },
  'Blocked': { border: '#fecaca', bg: '#fef2f2', text: '#dc2626' },
  'Delayed': { border: '#fed7aa', bg: '#fff7ed', text: '#c2410c' },
  'Review': { border: '#e9d5ff', bg: '#faf5ff', text: '#7e22ce' },
};

const priorityColors = { Critical: '#ef4444', High: '#f59e0b', Medium: '#6366f1', Low: '#10b981' };

const TaskNode = ({ data, selected, darkMode }) => {
  const colors = statusColors[data.status] || { border: '#e2e8f0', bg: '#f8fafc', text: '#475569' };
  return (
    <div
      className="rounded-4 shadow-sm border-2 position-relative overflow-hidden"
      style={{
        minWidth: '200px', maxWidth: '240px',
        background: darkMode ? '#1e293b' : colors.bg,
        borderColor: selected ? '#6366f1' : colors.border,
        cursor: 'pointer', transition: 'all 0.2s ease',
        boxShadow: selected ? '0 0 0 2px #6366f1, 0 4px 12px rgba(99,102,241,0.15)' : '0 2px 8px rgba(0,0,0,0.06)',
      }}
      onClick={() => data.onClick?.(data.task)}
    >
      <Handle type="target" position={Position.Left}
        className={data.showHandles ? '' : 'opacity-0'}
        style={{ background: '#6366f1', width: 12, height: 12, border: '2px solid white' }} />
      <div className="px-3 py-2">
        <div className="d-flex align-items-center gap-1 mb-2">
          <span className="badge rounded-pill px-2 fw-bold" style={{
            fontSize: '8px', background: colors.text + '20', color: colors.text,
            textTransform: 'uppercase', letterSpacing: '0.5px'
          }}>{data.status || 'Open'}</span>
          {data.priority && (
            <span className="badge rounded-pill px-2 fw-bold" style={{
              fontSize: '8px', background: (priorityColors[data.priority] || '#6366f1') + '20',
              color: priorityColors[data.priority] || '#6366f1'
            }}>{data.priority}</span>
          )}
        </div>
        <div className="fw-bold small text-truncate mb-1" style={{ maxWidth: '190px', lineHeight: 1.3, color: darkMode ? '#e2e8f0' : '#1e293b' }}>{data.label}</div>
        <div className="d-flex align-items-center gap-2 mt-1">
          {data.assignedUser && (
            <span className="x-small text-muted text-truncate" style={{ maxWidth: '80px' }}>
              <FontAwesomeIcon icon={faUser} className="me-1" size="xs" />
              {data.assignedUser}
            </span>
          )}
          {data.dueDate && (
            <span className="x-small text-muted">
              <FontAwesomeIcon icon={faCalendarAlt} className="me-1" size="xs" />
              {data.dueDate}
            </span>
          )}
        </div>
        {data.progress !== undefined && (
          <div className="mt-2" style={{ height: '3px', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ width: `${data.progress}%`, height: '100%', background: colors.text, borderRadius: '2px', transition: 'width 0.3s ease' }} />
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right}
        className={data.showHandles ? '' : 'opacity-0'}
        style={{ background: '#6366f1', width: 12, height: 12, border: '2px solid white' }} />
    </div>
  );
};

const nodeTypeMeta = {
  task: { label: 'Task', color: '#6366f1', icon: faTasks, shape: 'rounded' },
  milestone: { label: 'Milestone', color: '#8b5cf6', icon: faFlag, shape: 'diamond' },
  approval: { label: 'Approval', color: '#0ea5e9', icon: faCheckDouble, shape: 'rounded' },
  review: { label: 'Review', color: '#ec4899', icon: faEye, shape: 'rounded' },
  epic: { label: 'Epic', color: '#7c3aed', icon: faLayerGroup, shape: 'rounded' },
  sprint: { label: 'Sprint', color: '#0891b2', icon: faBolt, shape: 'rounded' },
  story: { label: 'Story', color: '#10b981', icon: faFileAlt, shape: 'rounded' },
  bug: { label: 'Bug', color: '#ef4444', icon: faExclamationCircle, shape: 'rounded' },
  start: { label: 'Start', color: '#16a34a', icon: faArrowRight, shape: 'circle' },
  end: { label: 'End', color: '#dc2626', icon: faTimesCircle, shape: 'circle' },
  delay: { label: 'Delay', color: '#f59e0b', icon: faHourglassHalf, shape: 'rounded' },
  condition: { label: 'Condition', color: '#f97316', icon: faCodeBranch, shape: 'diamond' },
};

const CustomNode = ({ data, selected, darkMode }) => {
  const meta = nodeTypeMeta[data.nodeType] || nodeTypeMeta.task;
  const Icon = meta.icon;
  const isCircle = meta.shape === 'circle';
  const isDiamond = meta.shape === 'diamond';
  return (
    <div
      style={{
        minWidth: isCircle ? '90px' : '180px',
        maxWidth: isCircle ? '90px' : '220px',
        background: darkMode ? '#1e293b' : '#ffffff',
        border: `2px solid ${selected ? meta.color : meta.color + '66'}`,
        borderRadius: isCircle ? '50%' : isDiamond ? '12px' : '12px',
        padding: isCircle ? '0' : '12px 14px',
        height: isCircle ? '90px' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: selected ? `0 0 0 3px ${meta.color}33` : '0 2px 8px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        transform: isDiamond ? 'rotate(0deg)' : 'none',
        transition: 'all 0.2s ease',
      }}
      onClick={() => data.onClick?.(data)}
    >
      <Handle type="target" position={Position.Left} style={{ background: meta.color, width: 10, height: 10, border: '2px solid white' }} />
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: meta.color + '15', color: meta.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, marginBottom: 6,
      }}>
        <FontAwesomeIcon icon={Icon} />
      </div>
      <div className="fw-bold small text-center" style={{ lineHeight: 1.2, color: darkMode ? '#e2e8f0' : '#1e293b' }}>{data.label}</div>
      <div className="x-small text-muted text-center mt-1" style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{meta.label}</div>
      <Handle type="source" position={Position.Right} style={{ background: meta.color, width: 10, height: 10, border: '2px solid white' }} />
    </div>
  );
};

const nodeCategories = [
  {
    name: 'Common Nodes', icon: faTasks, items: [
      { type: 'task', label: 'Task', desc: 'Standard task node' },
      { type: 'milestone', label: 'Milestone', desc: 'Key milestone' },
      { type: 'approval', label: 'Approval', desc: 'Requires approval' },
      { type: 'review', label: 'Review', desc: 'Peer review step' },
    ]
  },
  {
    name: 'Project Nodes', icon: faProjectDiagram, items: [
      { type: 'epic', label: 'Epic', desc: 'Large body of work' },
      { type: 'sprint', label: 'Sprint', desc: 'Time-boxed iteration' },
      { type: 'story', label: 'Story', desc: 'User story' },
      { type: 'bug', label: 'Bug', desc: 'Defect tracking' },
    ]
  },
  {
    name: 'Workflow Nodes', icon: faCodeBranch, items: [
      { type: 'start', label: 'Start', desc: 'Workflow start' },
      { type: 'end', label: 'End', desc: 'Workflow end' },
      { type: 'delay', label: 'Delay', desc: 'Time delay' },
      { type: 'condition', label: 'Condition', desc: 'Decision branch' },
    ]
  },
];

const TaskNodeDark = (props) => <TaskNode {...props} darkMode={true} />;
const TaskNodeLight = (props) => <TaskNode {...props} darkMode={false} />;
const CustomNodeDark = (props) => <CustomNode {...props} darkMode={true} />;
const CustomNodeLight = (props) => <CustomNode {...props} darkMode={false} />;

const TmsDependencies = () => {
  const { addNotification } = useApp();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkTaskId, setLinkTaskId] = useState('');
  const [linkDependsOnId, setLinkDependsOnId] = useState('');
  const [linking, setLinking] = useState(false);
  const [linkType, setLinkType] = useState('FS');
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewMode, setViewMode] = useState('graph');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDep, setEditDep] = useState(null);
  const [editTaskId, setEditTaskId] = useState('');
  const [editDependsOnId, setEditDependsOnId] = useState('');
  const [editing, setEditing] = useState(false);
  const [editType, setEditType] = useState('FS');
  const [connectionMode, setConnectionMode] = useState(false);
  const [edgePopup, setEdgePopup] = useState(null);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const nodeTypes = React.useMemo(() => ({
    taskNode: darkMode ? TaskNodeDark : TaskNodeLight,
    ...Object.fromEntries(Object.keys(nodeTypeMeta).map(k => [k, darkMode ? CustomNodeDark : CustomNodeLight])),
  }), [darkMode]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [layoutDir, setLayoutDir] = useState('horizontal');
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [nodeDetail, setNodeDetail] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [customNodes, setCustomNodes] = useState([]);
  const [customEdges, setCustomEdges] = useState([]);
  const [addNodeType, setAddNodeType] = useState('task');
  const [showAddNodeModal, setShowAddNodeModal] = useState(false);
  const [addNodeLabel, setAddNodeLabel] = useState('');
  const [selectedNodeType, setSelectedNodeType] = useState(null);
  const [showEditNodeModal, setShowEditNodeModal] = useState(false);
  const [editNodeId, setEditNodeId] = useState(null);
  const [editNodeLabel, setEditNodeLabel] = useState('');
  const [editNodeType, setEditNodeType] = useState('task');
  const [savedGraph, setSavedGraph] = useState(false);
  const customIdRef = useRef(1);

  const storageKey = () => `tms_custom_graph_${selectedProject || 'all'}`;

  const persistGraph = useCallback((nodes, edges) => {
    try {
      localStorage.setItem(storageKey(), JSON.stringify({ nodes, edges }));
    } catch { /* ignore quota errors */ }
  }, [selectedProject]);

  // Load persisted custom nodes/edges when project changes
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey());
      if (raw) {
        const parsed = JSON.parse(raw);
        setCustomNodes(parsed.nodes || []);
        setCustomEdges(parsed.edges || []);
        return;
      }
    } catch { /* ignore */ }
    setCustomNodes([]);
    setCustomEdges([]);
  }, [selectedProject]);

  // Auto-save on change
  useEffect(() => {
    if (!selectedProject && customNodes.length === 0 && customEdges.length === 0) return;
    const t = setTimeout(() => persistGraph(customNodes, customEdges), 400);
    return () => clearTimeout(t);
  }, [customNodes, customEdges, persistGraph]);
  const reactFlowWrapper = useRef(null);
  const reactFlowInstance = useRef(null);
  const mountedRef = useRef(true);

  const handleReload = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadProjects = async () => {
      try {
        const data = await listProjects({}, { skipAuthRedirect: true });
        if (!cancelled) setProjects(data || []);
      } catch (err) {
        if (!cancelled) setError(err.message || "Could not load projects.");
      }
    };
    loadProjects();
    return () => { cancelled = true; };
  }, [refreshTrigger]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    const loadData = async () => {
      try {
        const [tasksData, depsData] = await Promise.all([
          selectedProject ? listProjectTasks(selectedProject, { skipAuthRedirect: true }) : listAllTasks(null, { skipAuthRedirect: true }),
          listAllDependencies(selectedProject, { skipAuthRedirect: true }),
        ]);
        if (cancelled) return;
        setTasks(tasksData || []);
        setDependencies(depsData || []);
      } catch (err) {
        if (cancelled) return;
        if (err.status === 401) {
          setError("Session expired. Please refresh the page.");
        } else {
          setError(err.message || "Failed to load tasks or dependencies.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadData();
    return () => { cancelled = true; };
  }, [selectedProject, refreshTrigger]);

  const handleCreateDependency = async (taskId, dependsOnTaskId) => {
    if (!taskId || !dependsOnTaskId) {
      addNotification("Please select both tasks.", "warning");
      return;
    }
    setLinking(true);
    try {
      await createTaskDependency(taskId, dependsOnTaskId, linkType, { skipAuthRedirect: true });
      addNotification("Dependency created.", "success");
      setShowLinkModal(false);
      setLinkTaskId('');
      setLinkDependsOnId('');
      setLinkType('FS');
      const depsData = await listAllDependencies(selectedProject, { skipAuthRedirect: true });
      if (mountedRef.current) setDependencies(depsData || []);
    } catch (err) {
      addNotification(err.response?.data?.message || "Failed to create dependency.", "danger");
    } finally {
      if (mountedRef.current) setLinking(false);
    }
  };

  const handleOpenEditModal = (dep) => {
    setEditDep(dep);
    setEditTaskId(String(dep.task_id));
    setEditDependsOnId(String(dep.depends_on_task_id));
    setEditType(dep.type || 'FS');
    setShowEditModal(true);
  };

  const handleUpdateDependency = async () => {
    if (!editTaskId || !editDependsOnId) {
      addNotification("Please select both tasks.", "warning");
      return;
    }
    setEditing(true);
    try {
      await updateTaskDependency(editTaskId, editDep.id, {
        depends_on_task_id: editDependsOnId,
        type: editType,
      }, { skipAuthRedirect: true });
      addNotification("Dependency updated.", "success");
      setShowEditModal(false);
      setEditDep(null);
      const depsData = await listAllDependencies(selectedProject, { skipAuthRedirect: true });
      if (mountedRef.current) setDependencies(depsData || []);
    } catch (err) {
      addNotification(err.response?.data?.message || "Failed to update dependency.", "danger");
    } finally {
      if (mountedRef.current) setEditing(false);
    }
  };

  const handleDeleteDependency = async (depId, taskId) => {
    try {
      await deleteTaskDependency(taskId, depId, { skipAuthRedirect: true });
      addNotification("Dependency removed.", "success");
      if (mountedRef.current) setDependencies(prev => prev.filter(d => d.id !== depId));
    } catch (err) {
      addNotification("Failed to remove dependency.", "danger");
    }
  };

  const handleEdgeClick = useCallback((event, edge) => {
    setEdgePopup({ x: event.clientX, y: event.clientY, edge });
  }, []);

  const handleNodeClick = useCallback((event, node) => {
    setSelectedNodeId(node.id);
    setNodeDetail(node.data.task || {});
    setShowSidePanel(true);
  }, []);

  const handleEdgeDelete = async () => {
    if (!edgePopup) return;
    const { edge } = edgePopup;
    try {
      await deleteTaskDependency(edge.data.taskId, edge.data.depId, { skipAuthRedirect: true });
      addNotification("Dependency removed.", "success");
      setEdgePopup(null);
      const depsData = await listAllDependencies(selectedProject, { skipAuthRedirect: true });
      if (mountedRef.current) setDependencies(depsData || []);
    } catch (err) {
      addNotification("Failed to remove dependency.", "danger");
    }
  };

  const handleEdgeEdit = () => {
    if (!edgePopup) return;
    const { edge } = edgePopup;
    const dep = dependencies.find(d => d.id === edge.data.depId);
    if (dep) handleOpenEditModal(dep);
    setEdgePopup(null);
  };

  const onConnect = useCallback(async (connection) => {
    if (!connection.source || !connection.target) return;
    const isCustom = (id) => String(id).startsWith('custom-');
    if (isCustom(connection.source) || isCustom(connection.target)) {
      const newEdge = {
        id: `ce-${connection.source}-${connection.target}-${Date.now()}`,
        source: connection.source,
        target: connection.target,
        animated: true,
        style: { stroke: '#6366f1', strokeWidth: 2.5 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#6366f1', width: 20, height: 20 },
        data: { local: true },
      };
      setCustomEdges(prev => [...prev, newEdge]);
      setEdges(prev => [...prev, newEdge]);
      addNotification("Custom connection added.", "success");
      return;
    }
    await handleCreateDependency(connection.target, connection.source);
  }, [selectedProject]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type || !reactFlowInstance.current) return;
    const position = reactFlowInstance.current.screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });
    const id = `custom-${Date.now()}-${customIdRef.current++}`;
    const meta = nodeTypeMeta[type] || nodeTypeMeta.task;
    const newNode = {
      id,
      type,
      position,
      data: {
        label: meta.label,
        nodeType: type,
        task: { id, title: meta.label, status: 'Open', priority: 'Medium' },
      },
    };
    setCustomNodes(prev => [...prev, newNode]);
    setNodes(prev => [...prev, newNode]);
    addNotification(`${meta.label} node added to canvas.`, "success");
  }, [addNotification]);

  const addCustomNode = useCallback((type, label) => {
    const meta = nodeTypeMeta[type] || nodeTypeMeta.task;
    const id = `custom-${Date.now()}-${customIdRef.current++}`;
    const labelText = label && label.trim() ? label.trim() : meta.label;
    const position = { x: 120 + Math.random() * 200, y: 120 + Math.random() * 200 };
    const newNode = {
      id,
      type,
      position,
      data: {
        label: labelText,
        nodeType: type,
        task: { id, title: labelText, status: 'Open', priority: 'Medium' },
      },
    };
    setCustomNodes(prev => [...prev, newNode]);
    setNodes(prev => [...prev, newNode]);
    setTimeout(() => { reactFlowInstance.current?.fitView({ padding: 0.2, duration: 400 }); }, 100);
    addNotification(`${labelText} node added to canvas.`, "success");
  }, []);

  const handleAddNodeFromModal = () => {
    addCustomNode(addNodeType, addNodeLabel);
    setShowAddNodeModal(false);
    setAddNodeLabel('');
  };

  const onNodeDragStop = useCallback((event, node) => {
    if (String(node.id).startsWith('custom-')) {
      setCustomNodes(prev => prev.map(n => n.id === node.id ? { ...n, position: node.position } : n));
    }
  }, []);

  const onNodesDelete = useCallback((deleted) => {
    const delIds = deleted.map(n => n.id);
    setCustomNodes(prev => prev.filter(n => !delIds.includes(n.id)));
    setCustomEdges(prev => prev.filter(e => !delIds.includes(e.source) && !delIds.includes(e.target)));
    setEdges(prev => prev.filter(e => !delIds.includes(e.source) && !delIds.includes(e.target)));
  }, []);

  const deleteSelectedNode = useCallback((nodeId) => {
    if (!nodeId) return;
    setCustomNodes(prev => prev.filter(n => n.id !== nodeId));
    setCustomEdges(prev => prev.filter(e => e.source !== nodeId && e.target !== nodeId));
    setEdges(prev => prev.filter(e => e.source !== nodeId && e.target !== nodeId));
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setSelectedNodeId(null);
    addNotification("Node removed.", "info");
  }, [addNotification]);

  const openEditNode = useCallback((nodeId) => {
    const node = customNodes.find(n => n.id === nodeId);
    if (!node) return;
    setEditNodeId(nodeId);
    setEditNodeLabel(node.data?.label || '');
    setEditNodeType(node.data?.nodeType || node.type || 'task');
    setShowEditNodeModal(true);
  }, [customNodes]);

  const saveEditNode = useCallback(() => {
    if (!editNodeId) return;
    const meta = nodeTypeMeta[editNodeType] || nodeTypeMeta.task;
    const labelText = editNodeLabel.trim() || meta.label;
    setCustomNodes(prev => prev.map(n => n.id === editNodeId
      ? { ...n, type: editNodeType, data: { ...n.data, label: labelText, nodeType: editNodeType } }
      : n));
    setNodes(prev => prev.map(n => n.id === editNodeId
      ? { ...n, type: editNodeType, data: { ...n.data, label: labelText, nodeType: editNodeType } }
      : n));
    setShowEditNodeModal(false);
    setEditNodeId(null);
    addNotification("Node updated.", "success");
  }, [editNodeId, editNodeType, editNodeLabel, addNotification]);

  const saveGraphNow = useCallback(() => {
    persistGraph(customNodes, customEdges);
    setSavedGraph(true);
    setTimeout(() => setSavedGraph(false), 2000);
    addNotification("Graph layout saved.", "success");
  }, [customNodes, customEdges, persistGraph, addNotification]);

  const onEdgesDelete = useCallback((deleted) => {
    const delIds = deleted.map(e => e.id);
    setCustomEdges(prev => prev.filter(e => !delIds.includes(e.id)));
  }, []);

  const taskMap = useMemo(() => {
    const map = {};
    if (Array.isArray(tasks)) {
      tasks.forEach(t => { map[t.id] = t; });
    }
    return map;
  }, [tasks]);

  const tasksWithDeps = useMemo(() => {
    return dependencies.reduce((acc, dep) => {
      const parentTask = dep.depends_on;
      const childTask = dep.task;
      if (parentTask && childTask) {
        if (!acc[parentTask.id]) acc[parentTask.id] = { task: parentTask, dependents: [] };
        acc[parentTask.id].dependents.push({ task: childTask, depId: dep.id, dep, depType: dep.type });
      }
      return acc;
    }, {});
  }, [dependencies]);

  const dependentTaskCount = useMemo(() => {
    const count = {};
    dependencies.forEach(dep => {
      if (dep.depends_on_task_id) {
        count[dep.depends_on_task_id] = (count[dep.depends_on_task_id] || 0) + 1;
      }
    });
    return count;
  }, [dependencies]);

  const bottleneckEntry = useMemo(() => {
    return Object.entries(dependentTaskCount).sort((a, b) => b[1] - a[1])[0];
  }, [dependentTaskCount]);
  const bottleneckName = bottleneckEntry && taskMap[bottleneckEntry[0]] ? taskMap[bottleneckEntry[0]].title : null;
  const bottleneckCount = bottleneckEntry ? bottleneckEntry[1] : 0;

  const kpis = useMemo(() => {
    const total = tasks.length;
    const linked = new Set();
    dependencies.forEach(d => { linked.add(d.task_id); if (d.depends_on_task_id) linked.add(d.depends_on_task_id); });
    const blocked = tasks.filter(t => t.status === 'Blocked').length;
    const completed = tasks.filter(t => t.status === 'Done' || t.status === 'Completed').length;
    const delayed = tasks.filter(t => t.status === 'Delayed').length;
    const critical = tasks.filter(t => t.priority === 'Critical').length;
    const health = total > 0 ? Math.round((completed / total) * 100) : 100;
    const longestPath = dependencies.length > 0 ? Math.max(...dependencies.map(d => 1)) : 0;
    return { total, linked: linked.size, blocked, completed, delayed, critical, health, longestPath };
  }, [tasks, dependencies]);

  const filteredTasks = useMemo(() => {
    return searchQuery || filterStatus
      ? tasks.filter(t => {
          const matchSearch = !searchQuery || t.title?.toLowerCase().includes(searchQuery.toLowerCase());
          const matchStatus = !filterStatus || t.status === filterStatus;
          return matchSearch && matchStatus;
        })
      : tasks;
  }, [tasks, searchQuery, filterStatus]);

  const { nodes: flowNodes, edges: flowEdges } = useMemo(() => {
    if (dependencies.length === 0 && tasks.length === 0) return { nodes: [], edges: [] };
    const nodeSet = new Set();
    const edgeList = [];
    dependencies.forEach(dep => {
      if (dep.depends_on && dep.task) {
        const parentId = String(dep.depends_on.id);
        const childId = String(dep.task.id);
        nodeSet.add(parentId);
        nodeSet.add(childId);
        const depType = dep.type || 'FS';
        const typeCfg = depTypeConfig[depType] || depTypeConfig.FS;
        edgeList.push({
          id: `e${parentId}-${childId}`,
          source: parentId,
          target: childId,
          animated: true,
          style: { stroke: typeCfg.color, strokeWidth: 2.5 },
          markerEnd: { type: MarkerType.ArrowClosed, color: typeCfg.color, width: 20, height: 20 },
          data: { depId: dep.id, taskId: dep.task_id, depType },
          label: depType,
          labelStyle: { fill: typeCfg.color, fontWeight: 700, fontSize: 10, fontFamily: 'Inter, sans-serif' },
          labelBgStyle: { fill: '#ffffff', fillOpacity: 0.95 },
          labelBgPadding: [8, 4],
          labelBgBorderRadius: 4,
        });
      }
    });
    if (filteredTasks.length > 0 && edgeList.length === 0) {
      filteredTasks.forEach(t => { if (t.id) nodeSet.add(String(t.id)); });
    }
    if (nodeSet.size === 0) return { nodes: [], edges: [] };
    const inDegree = {};
    const adj = {};
    nodeSet.forEach(id => { inDegree[id] = 0; adj[id] = []; });
    edgeList.forEach(e => { adj[e.source].push(e.target); inDegree[e.target]++; });
    const layers = [];
    let queue = [];
    nodeSet.forEach(id => { if (inDegree[id] === 0) queue.push(id); });
    const assigned = new Set();
    while (queue.length > 0) {
      const next = [];
      const currentLayer = [];
      queue.forEach(id => {
        currentLayer.push(id);
        assigned.add(id);
        (adj[id] || []).forEach(nb => { inDegree[nb]--; if (inDegree[nb] === 0 && !assigned.has(nb)) next.push(nb); });
      });
      if (currentLayer.length > 0) layers.push(currentLayer);
      queue = next;
    }
    const remaining = [...nodeSet].filter(id => !assigned.has(id));
    if (remaining.length > 0) layers.push(remaining);
    const NODE_WIDTH = 220, NODE_HEIGHT = 100, H_GAP = 80, V_GAP = 40;
    const nodes = [];
    if (layoutDir === 'vertical') {
      layers.forEach((layer, li) => {
        const y = li * (NODE_HEIGHT + V_GAP) + 20;
        const totalW = layer.length * (NODE_WIDTH + H_GAP) - H_GAP;
        const startX = Math.max(0, (800 - totalW) / 2);
        layer.forEach((id, ni) => {
          const task = taskMap[parseInt(id)];
          if (!task && filteredTasks.length > 0) {
            const ft = filteredTasks.find(t => String(t.id) === id);
            if (!ft) return;
          }
          const t = task || { id: parseInt(id), title: `Task ${id}`, status: 'Open', priority: 'Medium' };
          nodes.push({
            id, type: 'taskNode',
            position: { x: startX + ni * (NODE_WIDTH + H_GAP), y },
            data: {
              label: t.title, status: t.status, priority: t.priority, task: t,
              assignedUser: t.assigned_to?.name || t.assignee?.name,
              dueDate: t.due_date && typeof t.due_date === 'string' ? t.due_date.split('-').slice(1).join('/') : null,
              progress: t.progress || 0,
              onClick: (task) => { setSelectedTask(task); setShowSidePanel(true); },
              showHandles: connectionMode,
            },
          });
        });
      });
    } else {
      layers.forEach((layer, li) => {
        const x = li * (NODE_WIDTH + H_GAP) + 20;
        const totalH = layer.length * (NODE_HEIGHT + V_GAP) - V_GAP;
        const startY = Math.max(0, (500 - totalH) / 2);
        layer.forEach((id, ni) => {
          const task = taskMap[parseInt(id)];
          if (!task && filteredTasks.length > 0) {
            const ft = filteredTasks.find(t => String(t.id) === id);
            if (!ft) return;
          }
          const t = task || { id: parseInt(id), title: `Task ${id}`, status: 'Open', priority: 'Medium' };
          nodes.push({
            id, type: 'taskNode',
            position: { x, y: startY + ni * (NODE_HEIGHT + V_GAP) },
            data: {
              label: t.title, status: t.status, priority: t.priority, task: t,
              assignedUser: t.assigned_to?.name || t.assignee?.name,
              dueDate: t.due_date && typeof t.due_date === 'string' ? t.due_date.split('-').slice(1).join('/') : null,
              progress: t.progress || 0,
              onClick: (task) => { setSelectedTask(task); setShowSidePanel(true); },
              showHandles: connectionMode,
            },
          });
        });
      });
    }
    return { nodes, edges: edgeList };
  }, [dependencies, tasks, connectionMode, layoutDir, filteredTasks, taskMap]);

  const { nodes: finalNodes, edges: finalEdges } = useMemo(() => {
    const depNodes = flowNodes;
    const customMerged = customNodes.map(n => ({
      ...n,
      type: n.type || 'task',
      data: {
        ...n.data,
        nodeType: n.data?.nodeType || n.type,
        onClick: (d) => { setSelectedNodeType(d?.nodeType || n.type); setNodeDetail(d?.task || d || {}); setShowSidePanel(true); },
      },
    }));
    const mergedNodes = [...depNodes, ...customMerged];
    const mergedEdges = [...flowEdges, ...customEdges];
    return { nodes: mergedNodes, edges: mergedEdges };
  }, [flowNodes, flowEdges, customNodes, customEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(finalNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(finalEdges);

  useEffect(() => { setNodes(finalNodes); setEdges(finalEdges); }, [finalNodes, finalEdges]);

  const onInit = useCallback((instance) => {
    reactFlowInstance.current = instance;
  }, []);

  const resetLayout = useCallback(() => {
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [flowNodes, flowEdges]);

  const zoomIn = useCallback(() => {
    reactFlowInstance.current?.zoomIn();
  }, []);

  const zoomOut = useCallback(() => {
    reactFlowInstance.current?.zoomOut();
  }, []);

  const fitView = useCallback(() => {
    reactFlowInstance.current?.fitView({ padding: 0.2 });
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handleFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFSChange);
    return () => document.removeEventListener('fullscreenchange', handleFSChange);
  }, []);

  const closeModals = useCallback(() => {
    setShowLinkModal(false);
    setShowEditModal(false);
    setEditDep(null);
  }, []);

  if (error && !loading && tasks.length === 0 && dependencies.length === 0) {
    return (
      <div className="container-fluid py-4 fade-in rounded-5">
        <div className={`card border-0 shadow-lg rounded-5 overflow-hidden mb-4 ${darkMode ? 'bg-dark-card' : 'bg-white'}`}>
          <div className="card-body p-4">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-info bg-opacity-10 p-3 rounded-4">
                <FontAwesomeIcon icon={faSitemap} className="text-info fs-4" />
              </div>
              <div>
                <h4 className={`fw-bold mb-1 ${darkMode ? 'text-light' : 'text-dark'}`}>Task Dependency Designer</h4>
                <p className="text-muted small mb-0">Build visual task workflows, dependency chains, and project execution flows.</p>
              </div>
            </div>
          </div>
        </div>
        <div className={`card border-0 shadow-sm rounded-4 p-5 text-center ${darkMode ? 'bg-dark-card' : 'bg-white'}`}>
          <div className="py-5">
            <FontAwesomeIcon icon={faTriangleExclamation} size="3x" className="text-warning mb-3" />
            <h5 className={`fw-bold mb-2 ${darkMode ? 'text-light' : 'text-dark'}`}>Connection Error</h5>
            <p className="text-muted small mb-3">{error}</p>
            <button className="btn btn-primary rounded-pill px-4 fw-bold" onClick={handleReload}>
              <FontAwesomeIcon icon={faRedoAlt} className="me-2" /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`container-fluid py-4 fade-in rounded-5 ${darkMode ? 'bg-dark' : ''}`}>
      <div className="card border-0 shadow-lg rounded-5 overflow-hidden mb-4" style={{ background: darkMode ? '#1e293b' : 'white' }}>
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-4">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-indigo bg-opacity-10 p-3 rounded-4">
                <FontAwesomeIcon icon={faProjectDiagram} className="text-indigo fs-4" style={{ color: '#6366f1' }} />
              </div>
              <div>
                <h4 className={`fw-bold mb-1 ${darkMode ? 'text-light' : 'text-dark'}`}>Task Dependency Designer</h4>
                <p className="text-muted small mb-0">Build visual task workflows, dependency chains, and project execution flows.</p>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <div className="btn-group rounded-pill overflow-hidden shadow-sm">
                <button className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : darkMode ? 'btn-outline-light' : 'btn-light'} rounded-0 px-3 border-0 fw-bold`} onClick={() => setViewMode('list')}>
                  <FontAwesomeIcon icon={faList} className="me-1" /> List
                </button>
                <button className={`btn btn-sm ${viewMode === 'graph' ? 'btn-primary' : darkMode ? 'btn-outline-light' : 'btn-light'} rounded-0 px-3 border-0 fw-bold`} onClick={() => setViewMode('graph')}>
                  <FontAwesomeIcon icon={faProjectDiagram} className="me-1" /> Graph
                </button>
              </div>
              <select
                className={`form-select border shadow-none rounded-pill px-4 fw-medium ${darkMode ? 'bg-dark-input text-light border-dark-input' : 'bg-light'}`}
                style={{ width: '200px' }}
                value={selectedProject || ''}
                onChange={(e) => setSelectedProject(e.target.value)}
              >
                <option value="">All Projects</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <button className="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-bold" onClick={() => setDarkMode(!darkMode)} title="Toggle theme">
                <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading && tasks.length === 0 && (
        <div className={`card border-0 shadow-sm rounded-4 p-5 text-center ${darkMode ? 'bg-dark-card' : 'bg-white'}`}>
          <div className="py-5">
            <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }} />
            <p className="text-muted small">Loading dependencies...</p>
          </div>
        </div>
      )}

      <div className="row g-4" style={{ display: loading && tasks.length === 0 ? 'none' : '' }}>
        <div className={viewMode === 'list' ? 'col-lg-8' : 'col-12'}>
          <div className={`card border-0 shadow-sm rounded-4 overflow-hidden ${darkMode ? 'bg-dark-card' : 'bg-white'}`}>
            {viewMode === 'list' ? (
              <>
                <div className={`d-flex justify-content-between align-items-center p-4 pb-3 border-bottom ${darkMode ? 'border-dark-input' : 'border-light'}`}>
                  <h6 className={`fw-bold mb-0 ${darkMode ? 'text-light' : 'text-dark'}`}>
                    <FontAwesomeIcon icon={faList} className="me-2 text-primary" />
                    Dependency Map ({dependencies.length} link{dependencies.length !== 1 ? 's' : ''})
                  </h6>
                  <button className="btn btn-sm btn-primary rounded-pill px-3 fw-bold" onClick={() => setShowLinkModal(true)}>
                    <FontAwesomeIcon icon={faLink} className="me-2" /> Link Tasks
                  </button>
                </div>
                <div className="p-4" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {Object.keys(tasksWithDeps).length > 0 ? (
                    Object.values(tasksWithDeps).map(({ task, dependents }) => (
                      <div key={task.id} className="mb-4">
                        <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
                          <div className={`card border-2 shadow-none rounded-4 p-3 ${darkMode ? 'border-dark-input' : 'border-light'}`} style={{ minWidth: '200px', cursor: 'pointer', background: darkMode ? '#1e293b' : 'white' }} onClick={() => setSelectedTask(task)}>
                            <div className="x-small fw-bold text-primary text-uppercase mb-1">Parent Task</div>
                            <div className={`fw-bold small text-truncate ${darkMode ? 'text-light' : 'text-dark'}`}>{task.title}</div>
                            <div className="x-small text-muted">{task.status} · {task.priority}</div>
                          </div>
                          {dependents.map(depItem => (
                            <React.Fragment key={depItem.depId}>
                              <div className="flex-grow-0 px-2 text-center">
                                <FontAwesomeIcon icon={faArrowRight} className="text-muted" />
                                <div><span className="badge rounded-pill px-2 py-1 x-small fw-bold" style={{ backgroundColor: (depTypeConfig[depItem.depType] || depTypeConfig.FS).color + '20', color: (depTypeConfig[depItem.depType] || depTypeConfig.FS).color }}>{depItem.depType || 'FS'}</span></div>
                              </div>
                              <div className={`card border-2 border-primary-subtle shadow-none rounded-4 p-3 position-relative ${darkMode ? '' : ''}`} style={{ minWidth: '200px', background: darkMode ? '#1e293b' : '#f5f3ff' }}>
                                <div className="d-flex justify-content-end gap-1 mb-1">
                                  <button className="btn btn-sm text-primary p-0 border-0 bg-transparent" onClick={() => handleOpenEditModal(depItem.dep)} title="Edit dependency">
                                    <FontAwesomeIcon icon={faPen} size="xs" />
                                  </button>
                                  <button className="btn btn-sm text-danger p-0 border-0 bg-transparent" onClick={() => handleDeleteDependency(depItem.depId, depItem.task.id)} title="Remove dependency">
                                    <FontAwesomeIcon icon={faTrashCan} size="xs" />
                                  </button>
                                </div>
                                <div className="x-small fw-bold text-info text-uppercase mb-1">Dependent</div>
                                <div className={`fw-bold small text-truncate ${darkMode ? 'text-light' : 'text-dark'}`} style={{ cursor: 'pointer' }} onClick={() => setSelectedTask(depItem.task)}>{depItem.task.title}</div>
                                <div className="x-small text-muted">{depItem.task.status} · {depItem.task.priority}</div>
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-5 opacity-50">
                      <FontAwesomeIcon icon={faSitemap} size="3x" className="mb-3" />
                      <p className="fw-bold">No dependencies mapped</p>
                      <p className="small text-muted">Click "Link Tasks" to create dependency relationships.</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className={darkMode ? 'bg-dark' : ''}>
                <div className="d-flex justify-content-between align-items-center p-3 pb-2 border-bottom" style={{ borderColor: darkMode ? '#2d3748' : '#f1f5f9' }}>
                  <div className="d-flex align-items-center gap-2 overflow-hidden">
                    <button className={`btn btn-sm rounded-3 px-2 border-0 fw-bold ${showSidebar ? 'btn-primary' : darkMode ? 'btn-outline-light' : 'btn-light'}`}
                      onClick={() => setShowSidebar(!showSidebar)} title="Toggle palette">
                      <FontAwesomeIcon icon={faBars} />
                    </button>
                    <div className="position-relative" style={{ width: '200px' }}>
                      <FontAwesomeIcon icon={faSearch} className="position-absolute text-muted" style={{ left: 10, top: 7, fontSize: 11 }} />
                      <input type="text" className={`form-control form-control-sm border-0 rounded-pill ps-5 shadow-none ${darkMode ? 'bg-dark-input text-light' : 'bg-light'}`}
                        placeholder="Search nodes..." value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} style={{ fontSize: 12 }} />
                    </div>
                    <button className={`btn btn-sm rounded-pill px-3 fw-bold ${connectionMode ? 'btn-success' : 'btn-outline-primary'}`}
                      onClick={() => setConnectionMode(!connectionMode)} style={{ fontSize: 11 }}>
                      <FontAwesomeIcon icon={connectionMode ? faMousePointer : faDrawPolygon} className="me-1" />
                      {connectionMode ? 'Connect' : 'Draw'}
                    </button>
                    <button className="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-bold" onClick={resetLayout} title="Auto Arrange" style={{ fontSize: 11 }}>
                      <FontAwesomeIcon icon={faRedoAlt} className="me-1" /> Arrange
                    </button>
                    <button className="btn btn-sm btn-outline-secondary rounded-pill px-3 fw-bold" onClick={handleReload} title="Reload Data" style={{ fontSize: 11 }}>
                      <FontAwesomeIcon icon={faRedo} className="me-1" /> Reload
                    </button>
                    <div className="btn-group btn-group-sm">
                      <button className={`btn btn-sm ${layoutDir === 'horizontal' ? 'btn-primary' : darkMode ? 'btn-outline-light' : 'btn-light'} rounded-start-pill px-2 fw-bold`}
                        onClick={() => setLayoutDir('horizontal')} title="Horizontal layout" style={{ fontSize: 11 }}>
                        <FontAwesomeIcon icon={faArrowRight} />
                      </button>
                      <button className={`btn btn-sm ${layoutDir === 'vertical' ? 'btn-primary' : darkMode ? 'btn-outline-light' : 'btn-light'} rounded-end-pill px-2 fw-bold`}
                        onClick={() => setLayoutDir('vertical')} title="Vertical layout" style={{ fontSize: 11 }}>
                        <FontAwesomeIcon icon={faArrowDown} />
                      </button>
                    </div>
                    <button className="btn btn-sm btn-outline-secondary rounded-pill px-2 fw-bold" onClick={zoomOut} title="Zoom out" style={{ fontSize: 11 }}>
                      <FontAwesomeIcon icon={faSearchMinus} />
                    </button>
                    <button className="btn btn-sm btn-outline-secondary rounded-pill px-2 fw-bold" onClick={zoomIn} title="Zoom in" style={{ fontSize: 11 }}>
                      <FontAwesomeIcon icon={faSearchPlus} />
                    </button>
                    <button className="btn btn-sm btn-outline-secondary rounded-pill px-2 fw-bold" onClick={fitView} title="Fit screen" style={{ fontSize: 11 }}>
                      <FontAwesomeIcon icon={faExpand} />
                    </button>
                    <button className={`btn btn-sm rounded-pill px-2 fw-bold ${showMiniMap ? 'btn-outline-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setShowMiniMap(!showMiniMap)} title="Toggle minimap" style={{ fontSize: 11 }}>
                      <FontAwesomeIcon icon={faMap} />
                    </button>
                    <button className={`btn btn-sm rounded-pill px-2 fw-bold ${showGrid ? 'btn-outline-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setShowGrid(!showGrid)} title="Toggle grid" style={{ fontSize: 11 }}>
                      <FontAwesomeIcon icon={faBorderAll} />
                    </button>
                    <button className="btn btn-sm btn-outline-secondary rounded-pill px-2 fw-bold" onClick={toggleFullscreen} title="Fullscreen" style={{ fontSize: 11 }}>
                      <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
                    </button>
                    <div className="btn-group btn-group-sm" role="group" title="Add custom node">
                      <button className="btn btn-sm btn-outline-success rounded-start-pill px-3 fw-bold" onClick={() => setShowAddNodeModal(true)} style={{ fontSize: 11 }}>
                        <FontAwesomeIcon icon={faPlus} className="me-1" /> Add Node
                      </button>
                      <select
                        className="form-select form-select-sm border-0 bg-success bg-opacity-10 text-success fw-bold rounded-end-pill shadow-none"
                        style={{ width: '110px', fontSize: 11 }}
                        value={addNodeType}
                        onChange={(e) => setAddNodeType(e.target.value)}
                      >
                        {Object.entries(nodeTypeMeta).map(([key, cfg]) => (
                          <option key={key} value={key}>{cfg.label}</option>
                        ))}
                      </select>
                    </div>
                    <button className="btn btn-sm btn-primary rounded-pill px-3 fw-bold" onClick={() => setShowLinkModal(true)} style={{ fontSize: 11 }}>
                      <FontAwesomeIcon icon={faPlus} className="me-1" /> Link
                    </button>
                    <button className="btn btn-sm btn-warning rounded-pill px-3 fw-bold" onClick={saveGraphNow} title="Save graph (custom nodes & connections)" style={{ fontSize: 11, color: '#1f2937' }}>
                      <FontAwesomeIcon icon={faSave} className="me-1" /> {savedGraph ? 'Saved!' : 'Save Graph'}
                    </button>
                  </div>
                  <div className="d-flex align-items-center gap-2 d-none d-xl-flex">
                    <span className="x-small text-muted fw-medium">{nodes.length} tasks</span>
                    <span className="text-muted">|</span>
                    <span className="x-small text-muted fw-medium">{edges.length} links</span>
                  </div>
                </div>

                <div className="d-flex" style={{ height: 'calc(100vh - 320px)', minHeight: '500px' }}>
                  {showSidebar && (
                    <div className="border-end overflow-hidden d-flex flex-column flex-shrink-0" style={{ width: '220px', background: darkMode ? '#1a202c' : '#f8fafc' }}>
                      <div className="p-3 border-bottom" style={{ borderColor: darkMode ? '#2d3748' : '#e2e8f0' }}>
                        <div className="position-relative">
                          <FontAwesomeIcon icon={faSearch} className="position-absolute text-muted" style={{ left: 10, top: 8, fontSize: 11 }} />
                          <input type="text" className={`form-control form-control-sm border-0 rounded-pill ps-5 shadow-none ${darkMode ? 'bg-dark-input text-light' : 'bg-white'}`}
                            placeholder="Search nodes..." style={{ fontSize: 11 }} />
                        </div>
                      </div>
                      <div className="overflow-auto flex-grow-1 p-2">
                        {nodeCategories.map((cat) => (
                          <div key={cat.name} className="mb-3">
                            <div className="d-flex align-items-center gap-2 px-2 py-1">
                              <FontAwesomeIcon icon={cat.icon} className="text-muted" size="xs" />
                              <span className="x-small fw-bold text-muted text-uppercase" style={{ letterSpacing: '0.5px' }}>{cat.name}</span>
                            </div>
                            {cat.items.map((item) => (
                              <div key={item.type}
                                className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 mb-1 draggable-node"
                                draggable
                                onDragStart={(e) => {
                                  e.dataTransfer.setData('application/reactflow', item.type);
                                  e.dataTransfer.effectAllowed = 'move';
                                }}
                                style={{ cursor: 'grab', background: darkMode ? '#2d3748' : 'white', border: '1px solid', borderColor: darkMode ? '#4a5568' : '#e2e8f0', transition: 'all 0.15s' }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.boxShadow = '0 0 0 1px #6366f1'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = darkMode ? '#4a5568' : '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}>
                                <FontAwesomeIcon icon={faGripVertical} className="text-muted" size="xs" />
                                <div className="flex-grow-1">
                                  <div className="x-small fw-bold" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>{item.label}</div>
                                  <div className="x-small text-muted" style={{ fontSize: '9px' }}>{item.desc}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex-grow-1 position-relative" ref={reactFlowWrapper}>
                    <ReactFlow
                      nodes={nodes}
                      edges={edges}
                      onNodesChange={onNodesChange}
                      onEdgesChange={onEdgesChange}
                      onNodeClick={handleNodeClick}
                      onEdgeClick={handleEdgeClick}
                      onConnect={onConnect}
                      onInit={onInit}
                      onDragOver={onDragOver}
                      onDrop={onDrop}
                      onNodesDelete={onNodesDelete}
                      onNodeDragStop={onNodeDragStop}
                      onEdgesDelete={onEdgesDelete}
                      deleteKeyCode={['Backspace', 'Delete']}
                      nodeTypes={nodeTypes}
                      fitView
                      minZoom={0.1}
                      maxZoom={3}
                      connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2.5 }}
                      connectionLineType={ConnectionLineType.SmoothStep}
                      defaultEdgeOptions={{ animated: true }}
                    >
                      {showGrid && <Background color={darkMode ? '#334155' : '#e2e8f0'} gap={24} size={1} />}
                      {showMiniMap && (
                        <MiniMap
                          nodeStrokeColor="#6366f1"
                          nodeColor={darkMode ? '#334155' : '#e0e7ff'}
                          nodeBorderRadius={8}
                          maskColor={darkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}
                          style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                      )}
                      <Controls showInteractive={false} style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
                      <Panel position="top-center">
                        {selectedNodeId && String(selectedNodeId).startsWith('custom-') && (
                          <div className="d-flex align-items-center gap-2 shadow-sm rounded-pill px-3 py-2 border" style={{ zIndex: 10, background: darkMode ? '#1e293b' : 'white', borderColor: darkMode ? '#334155' : '#e2e8f0' }}>
                            <FontAwesomeIcon icon={faPen} className="text-primary" size="xs" />
                            <span className="x-small fw-bold" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>Custom Node</span>
                            <div className="border-start mx-1" style={{ height: 16 }} />
                            <button className={`btn btn-sm rounded-pill px-2 py-0 border-0 fw-bold x-small ${darkMode ? 'btn-outline-light' : 'btn-light'}`} onClick={() => openEditNode(selectedNodeId)}>
                              <FontAwesomeIcon icon={faEdit} className="me-1" />Edit
                            </button>
                            <button className={`btn btn-sm rounded-pill px-2 py-0 border-0 fw-bold x-small text-danger ${darkMode ? 'btn-outline-danger' : 'btn-light'}`} onClick={() => deleteSelectedNode(selectedNodeId)}>
                              <FontAwesomeIcon icon={faTrashCan} className="me-1" />Delete
                            </button>
                          </div>
                        )}
                      </Panel>
                    </ReactFlow>
                    <div className="position-absolute bottom-0 start-50 translate-middle-x mb-3 d-flex align-items-center gap-2 shadow-sm rounded-pill px-3 py-2 border" style={{ zIndex: 10, background: darkMode ? '#1e293b' : 'white', borderColor: darkMode ? '#334155' : '#e2e8f0' }}>
                      <button className={`btn btn-sm rounded-circle p-1 lh-1 border-0 ${darkMode ? 'btn-outline-light' : 'btn-light'}`} onClick={zoomOut} title="Zoom out">
                        <FontAwesomeIcon icon={faSearchMinus} size="xs" />
                      </button>
                      <span className="x-small fw-bold text-muted px-1">{nodes.length} tasks / {edges.length} links</span>
                      <button className={`btn btn-sm rounded-circle p-1 lh-1 border-0 ${darkMode ? 'btn-outline-light' : 'btn-light'}`} onClick={zoomIn} title="Zoom in">
                        <FontAwesomeIcon icon={faSearchPlus} size="xs" />
                      </button>
                      <div className="border-start mx-1" style={{ height: 16 }} />
                      <button className={`btn btn-sm rounded-pill px-2 py-0 border-0 fw-bold x-small ${darkMode ? 'btn-outline-light' : 'btn-light'}`} onClick={fitView} title="Fit view">Fit</button>
                    </div>
                    {connectionMode && (
                      <div className="position-absolute top-0 start-0 p-3" style={{ zIndex: 10 }}>
                        <div className="shadow-sm rounded-4 p-2 px-3 border d-flex align-items-center gap-2" style={{ background: darkMode ? '#1e293b' : 'white', borderColor: darkMode ? '#334155' : '#e2e8f0' }}>
                          <FontAwesomeIcon icon={faInfoCircle} className="text-success" size="sm" />
                          <span className="x-small fw-bold text-success">Drag from parent's right handle to child's left handle</span>
                        </div>
                      </div>
                    )}
                    {edgePopup && (
                      <div
                        className="position-fixed shadow-lg rounded-4 p-3 border"
                        style={{ zIndex: 1060, left: Math.min(edgePopup.x, window.innerWidth - 250), top: Math.max(window.innerHeight * 0.4, 100), background: darkMode ? '#1e293b' : 'white', borderColor: darkMode ? '#334155' : '#e2e8f0' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="x-small text-muted fw-bold mb-2 text-uppercase d-flex align-items-center gap-2">
                          Edge Actions
                          {edgePopup?.edge?.data?.depType && (
                            <span className="badge rounded-pill px-2 py-1 fw-bold" style={{ backgroundColor: (depTypeConfig[edgePopup.edge.data.depType] || depTypeConfig.FS).color + '20', color: (depTypeConfig[edgePopup.edge.data.depType] || depTypeConfig.FS).color, fontSize: '9px' }}>
                              {edgePopup.edge.data.depType}
                            </span>
                          )}
                        </div>
                        <div className="d-flex flex-column gap-2">
                          <button className="btn btn-sm btn-outline-primary rounded-pill px-3 text-start" onClick={handleEdgeEdit}>
                            <FontAwesomeIcon icon={faPen} className="me-2" /> Edit Dependency
                          </button>
                          <button className="btn btn-sm btn-outline-danger rounded-pill px-3 text-start" onClick={handleEdgeDelete}>
                            <FontAwesomeIcon icon={faTrashCan} className="me-2" /> Delete Dependency
                          </button>
                          <button className="btn btn-sm btn-outline-secondary rounded-pill px-3 text-start" onClick={() => setEdgePopup(null)}>
                            <FontAwesomeIcon icon={faXmark} className="me-2" /> Cancel
                          </button>
                        </div>
                      </div>
                    )}
                    {edgePopup && (
                      <div className="modal-backdrop fade show" onClick={() => setEdgePopup(null)} style={{ background: 'transparent' }} />
                    )}
                  </div>
                  {showSidePanel && selectedNodeId && nodeDetail && (
                    <div className="border-start overflow-auto flex-shrink-0" style={{
                      width: '360px', background: darkMode ? '#1a202c' : '#f8fafc',
                      borderColor: darkMode ? '#2d3748' : '#e2e8f0'
                    }}>
                      <div className="d-flex justify-content-between align-items-center p-3 border-bottom sticky-top bg-white" style={{ borderColor: darkMode ? '#2d3748' : '#e2e8f0', background: darkMode ? '#1a202c' : 'white' }}>
                        <h6 className="fw-bold mb-0" style={{ color: darkMode ? '#e2e8f0' : '#1e293b', fontSize: 13 }}>Task Details</h6>
                        <button className="btn btn-sm btn-light rounded-circle border-0" onClick={() => { setShowSidePanel(false); setSelectedNodeId(null); }}>
                          <FontAwesomeIcon icon={faXmark} />
                        </button>
                      </div>
                      <div className="p-3">
                        <div className="mb-3">
                          <label className="x-small fw-bold text-muted text-uppercase mb-1">Task Name</label>
                          <div className="fw-bold" style={{ fontSize: 14, color: darkMode ? '#e2e8f0' : '#1e293b' }}>{nodeDetail.title || 'Untitled'}</div>
                        </div>
                        <div className="row g-2 mb-3">
                          <div className="col-6">
                            <label className="x-small fw-bold text-muted text-uppercase mb-1">Status</label>
                            <div><span className="badge rounded-pill fw-bold px-3 py-2" style={{
                              fontSize: 10,
                              background: (statusColors[nodeDetail.status] || statusColors['To Do']).text + '20',
                              color: (statusColors[nodeDetail.status] || statusColors['To Do']).text
                            }}>{nodeDetail.status || 'Open'}</span></div>
                          </div>
                          <div className="col-6">
                            <label className="x-small fw-bold text-muted text-uppercase mb-1">Priority</label>
                            <div><span className="badge rounded-pill fw-bold px-3 py-2" style={{
                              fontSize: 10,
                              background: (priorityColors[nodeDetail.priority] || '#6366f1') + '20',
                              color: priorityColors[nodeDetail.priority] || '#6366f1'
                            }}>{nodeDetail.priority || 'Medium'}</span></div>
                          </div>
                        </div>
                        {nodeDetail.description && (
                          <div className="mb-3">
                            <label className="x-small fw-bold text-muted text-uppercase mb-1">Description</label>
                            <p className="small mb-0" style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>{nodeDetail.description}</p>
                          </div>
                        )}
                        <div className="mb-3">
                          <label className="x-small fw-bold text-muted text-uppercase mb-1">Task Details</label>
                          <div className="d-flex flex-column gap-2">
                            {nodeDetail.assigned_to?.name && (
                              <div className="d-flex align-items-center gap-2">
                                <FontAwesomeIcon icon={faUser} className="text-muted" size="xs" style={{ width: 14 }} />
                                <span className="x-small" style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>{nodeDetail.assigned_to.name}</span>
                              </div>
                            )}
                            {nodeDetail.due_date && (
                              <div className="d-flex align-items-center gap-2">
                                <FontAwesomeIcon icon={faCalendarAlt} className="text-muted" size="xs" style={{ width: 14 }} />
                                <span className="x-small" style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>{nodeDetail.due_date}</span>
                              </div>
                            )}
                            <div className="d-flex align-items-center gap-2">
                              <FontAwesomeIcon icon={faCodeBranch} className="text-muted" size="xs" style={{ width: 14 }} />
                              <span className="x-small" style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>ID: {nodeDetail.id}</span>
                            </div>
                          </div>
                        </div>
                        {nodeDetail.progress !== undefined && (
                          <div className="mb-3">
                            <label className="x-small fw-bold text-muted text-uppercase mb-1">Progress</label>
                            <div className="d-flex align-items-center gap-2">
                              <div className="flex-grow-1" style={{ height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ width: `${nodeDetail.progress}%`, height: '100%', background: nodeDetail.progress === 100 ? '#10b981' : '#6366f1', borderRadius: 3 }} />
                              </div>
                              <span className="x-small fw-bold" style={{ color: darkMode ? '#e2e8f0' : '#1e293b' }}>{nodeDetail.progress}%</span>
                            </div>
                          </div>
                        )}
                        <div className="border-top pt-3 mt-3" style={{ borderColor: darkMode ? '#2d3748' : '#e2e8f0' }}>
                          <label className="x-small fw-bold text-muted text-uppercase mb-2">Dependencies</label>
                          {dependencies.filter(d => d.task_id === nodeDetail.id || d.depends_on_task_id === nodeDetail.id).length > 0 ? (
                            dependencies.filter(d => d.task_id === nodeDetail.id || d.depends_on_task_id === nodeDetail.id).map(d => {
                              const isParent = d.depends_on_task_id === nodeDetail.id;
                              const relatedTask = isParent ? d.task : d.depends_on;
                              return (
                                <div key={d.id} className="d-flex align-items-center gap-2 p-2 rounded-3 mb-1" style={{ background: darkMode ? '#2d3748' : 'white', border: '1px solid', borderColor: darkMode ? '#4a5568' : '#e2e8f0' }}>
                                  <FontAwesomeIcon icon={isParent ? faArrowRight : faArrowLeft} className="text-muted" size="xs" />
                                  <span className="x-small flex-grow-1 text-truncate" style={{ color: darkMode ? '#cbd5e1' : '#475569' }}>
                                    {relatedTask?.title || 'Unknown'}
                                  </span>
                                  <span className="badge rounded-pill fw-bold" style={{ fontSize: '8px', backgroundColor: (depTypeConfig[d.type] || depTypeConfig.FS).color + '20', color: (depTypeConfig[d.type] || depTypeConfig.FS).color }}>{d.type || 'FS'}</span>
                                </div>
                              );
                            })
                          ) : (
                            <p className="x-small text-muted mb-0">No dependencies for this task.</p>
                          )}
                        </div>
                        <div className="mt-3">
                          <button className="btn btn-sm btn-primary rounded-pill w-100 fw-bold" onClick={() => setSelectedTask(nodeDetail)}>
                            <FontAwesomeIcon icon={faEye} className="me-2" /> View Full Details
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-3 py-2 border-top d-flex justify-content-between align-items-center" style={{ borderColor: darkMode ? '#2d3748' : '#f1f5f9', background: darkMode ? '#1a202c' : '#f8fafc' }}>
                  <div className="d-flex align-items-center gap-3">
                    <span className="x-small text-muted">
                      <FontAwesomeIcon icon={faTasks} className="me-1" size="xs" />
                      Total: {kpis.total}
                    </span>
                    <span className="x-small text-success">
                      <FontAwesomeIcon icon={faCheckCircle} className="me-1" size="xs" />
                      Done: {kpis.completed}
                    </span>
                    <span className="x-small text-danger">
                      <FontAwesomeIcon icon={faExclamationCircle} className="me-1" size="xs" />
                      Blocked: {kpis.blocked}
                    </span>
                    <span className="x-small text-warning">
                      <FontAwesomeIcon icon={faHourglassHalf} className="me-1" size="xs" />
                      Delayed: {kpis.delayed}
                    </span>
                    <span className="x-small text-info">
                      <FontAwesomeIcon icon={faLink} className="me-1" size="xs" />
                      Linked: {kpis.linked}
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span className="x-small text-muted">
                      Health:
                      <span className={`fw-bold ms-1 ${kpis.health >= 70 ? 'text-success' : kpis.health >= 40 ? 'text-warning' : 'text-danger'}`}>
                        {kpis.health}%
                      </span>
                    </span>
                    <span className="x-small text-muted d-none d-md-inline">
                      <FontAwesomeIcon icon={faArrowsAlt} className="me-1" size="xs" />
                      Layout: {layoutDir === 'horizontal' ? 'LR' : 'TB'}
                    </span>
                    <span className="x-small text-muted d-none d-md-inline">
                      <FontAwesomeIcon icon={faLock} className="me-1" size="xs" />
                      {connectionMode ? 'Draw mode' : 'View mode'}
                    </span>
                    <select className="form-select form-select-sm border-0 bg-transparent shadow-none fw-bold x-small"
                      style={{ width: 'auto', color: darkMode ? '#cbd5e1' : '#64748b' }}
                      value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                      <option value="">All status</option>
                      {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {viewMode === 'list' && (
          <div className="col-lg-4">
            <div className={`card border-0 shadow-sm rounded-4 p-4 mb-4 ${darkMode ? 'bg-dark-card' : 'bg-white'}`}>
              <h6 className={`fw-bold mb-4 d-flex align-items-center gap-2 ${darkMode ? 'text-light' : 'text-dark'}`}>
                <FontAwesomeIcon icon={faLayerGroup} className="text-primary" />
                Critical Path Insights
              </h6>
              {bottleneckName ? (
                <div className="alert bg-warning bg-opacity-10 border-0 rounded-4 p-3 mb-4">
                  <div className="d-flex gap-3">
                    <FontAwesomeIcon icon={faTriangleExclamation} className="text-warning mt-1" />
                    <div>
                      <div className={`fw-bold small ${darkMode ? 'text-light' : 'text-dark'}`}>Potential Bottleneck</div>
                      <div className="x-small text-muted">"{bottleneckName}" has {bottleneckCount} dependent task{bottleneckCount > 1 ? 's' : ''}.</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="alert bg-success bg-opacity-10 border-0 rounded-4 p-3 mb-4">
                  <div className="d-flex gap-3">
                    <FontAwesomeIcon icon={faCircleCheck} className="text-success mt-1" />
                    <div>
                      <div className={`fw-bold small ${darkMode ? 'text-light' : 'text-dark'}`}>No Bottlenecks</div>
                      <div className="x-small text-muted">Dependencies are well distributed.</div>
                    </div>
                  </div>
                </div>
              )}
              <div className={`p-3 rounded-4 mb-3 ${darkMode ? 'bg-dark-input' : 'bg-light'}`}>
                <div className={`fw-bold small mb-2 ${darkMode ? 'text-light' : 'text-dark'}`}>Workflow KPIs</div>
                <div className="d-flex flex-wrap gap-2">
                  <div className={`flex-grow-1 p-2 rounded-3 border text-center ${darkMode ? 'bg-dark-card' : 'bg-white'}`} style={{ minWidth: '70px' }}>
                    <div className="fw-bold fs-6 text-primary">{kpis.total}</div>
                    <div className="x-small text-muted">Tasks</div>
                  </div>
                  <div className={`flex-grow-1 p-2 rounded-3 border text-center ${darkMode ? 'bg-dark-card' : 'bg-white'}`} style={{ minWidth: '70px' }}>
                    <div className="fw-bold fs-6 text-success">{kpis.linked}</div>
                    <div className="x-small text-muted">Linked</div>
                  </div>
                  <div className={`flex-grow-1 p-2 rounded-3 border text-center ${darkMode ? 'bg-dark-card' : 'bg-white'}`} style={{ minWidth: '70px' }}>
                    <div className="fw-bold fs-6 text-danger">{kpis.blocked}</div>
                    <div className="x-small text-muted">Blocked</div>
                  </div>
                  <div className={`flex-grow-1 p-2 rounded-3 border text-center ${darkMode ? 'bg-dark-card' : 'bg-white'}`} style={{ minWidth: '70px' }}>
                    <div className="fw-bold fs-6 text-warning">{kpis.health}%</div>
                    <div className="x-small text-muted">Health</div>
                  </div>
                </div>
              </div>
              <div className={`insight-item d-flex align-items-center justify-content-between p-3 rounded-4 ${darkMode ? 'bg-dark-input' : 'bg-light'}`}>
                <div className="d-flex align-items-center gap-3">
                  <div className={`p-2 rounded-3 shadow-sm text-success ${darkMode ? 'bg-dark-card' : 'bg-white'}`}><FontAwesomeIcon icon={faCircleCheck} /></div>
                  <div className={`fw-bold small ${darkMode ? 'text-light' : 'text-dark'}`}>Loop Detection</div>
                </div>
                <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2 x-small fw-bold">CLEAR</span>
              </div>
            </div>
            <div className={`card border-0 shadow-sm rounded-4 p-4 ${darkMode ? 'bg-dark-card' : 'bg-white'}`}>
              <h6 className={`fw-bold mb-3 ${darkMode ? 'text-light' : 'text-dark'}`}>Recent Dependencies</h6>
              {dependencies.length === 0 && <div className="x-small text-muted text-center py-3">No dependencies yet.</div>}
              {dependencies.slice(0, 5).map(dep => (
                <div key={dep.id} className={`d-flex align-items-center justify-content-between mb-2 p-2 rounded-3 ${darkMode ? 'bg-dark-input' : 'bg-light'}`}>
                  <div className="x-small text-truncate" style={{ maxWidth: '140px' }}>
                    <span className="fw-bold">{dep.depends_on?.title || 'Unknown'}</span>
                    <FontAwesomeIcon icon={faArrowRight} className="mx-1 text-muted" size="xs" />
                    <span>{dep.task?.title || 'Unknown'}</span>
                    <span className="badge rounded-pill px-2 py-1 ms-1 fw-bold" style={{ backgroundColor: (depTypeConfig[dep.type] || depTypeConfig.FS).color + '20', color: (depTypeConfig[dep.type] || depTypeConfig.FS).color, fontSize: '9px' }}>{dep.type || 'FS'}</span>
                  </div>
                  <div className="d-flex gap-1">
                    <button className="btn btn-sm text-primary p-0 border-0 bg-transparent" onClick={() => handleOpenEditModal(dep)} title="Edit dependency">
                      <FontAwesomeIcon icon={faPen} size="xs" />
                    </button>
                    <button className="btn btn-sm text-danger p-0 border-0 bg-transparent" onClick={() => handleDeleteDependency(dep.id, dep.task_id)} title="Remove dependency">
                      <FontAwesomeIcon icon={faTrashCan} size="xs" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <DialogBox
        show={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        title="Link Tasks"
        size="md"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <button className="btn btn-light rounded-pill px-4" onClick={() => setShowLinkModal(false)}>Cancel</button>
            <button className="btn btn-primary rounded-pill px-4 fw-bold" onClick={() => handleCreateDependency(linkTaskId, linkDependsOnId)} disabled={linking || !linkTaskId || !linkDependsOnId}>
              {linking ? 'Linking...' : 'Create Link'}
            </button>
          </div>
        }
      >
        <div className="mb-3">
          <label className="form-label small fw-bold">Task (depends on)</label>
          <select className="form-select" value={linkTaskId} onChange={(e) => setLinkTaskId(e.target.value)}>
            <option value="">Select a task...</option>
            {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>
        <div className="text-center mb-2">
          <FontAwesomeIcon icon={faArrowRight} className="text-muted" />
          <span className="mx-2 x-small text-muted fw-bold">DEPENDS ON</span>
          <FontAwesomeIcon icon={faArrowRight} className="text-muted" />
        </div>
        <div className="mb-3">
          <label className="form-label small fw-bold">Parent Task (blocker)</label>
          <select className="form-select" value={linkDependsOnId} onChange={(e) => setLinkDependsOnId(e.target.value)}>
            <option value="">Select a task...</option>
            {tasks.filter(t => t.id !== parseInt(linkTaskId)).map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label small fw-bold">Dependency Type</label>
          <select className="form-select" value={linkType} onChange={(e) => setLinkType(e.target.value)}>
            {Object.entries(depTypeConfig).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
          <div className="d-flex gap-2 mt-2">
            {Object.entries(depTypeConfig).map(([key, cfg]) => (
              <span key={key} className="badge rounded-pill fw-bold" style={{ backgroundColor: cfg.color + '20', color: cfg.color, fontSize: '9px' }}>{key}</span>
            ))}
          </div>
        </div>
      </DialogBox>

      <DialogBox
        show={showEditModal && !!editDep}
        onClose={() => { setShowEditModal(false); setEditDep(null); }}
        title="Edit Dependency"
        size="md"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <button className="btn btn-light rounded-pill px-4" onClick={() => { setShowEditModal(false); setEditDep(null); }}>Cancel</button>
            <button className="btn btn-primary rounded-pill px-4 fw-bold" onClick={handleUpdateDependency} disabled={editing || !editTaskId || !editDependsOnId}>
              {editing ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        }
      >
        <div className="mb-3">
          <label className="form-label small fw-bold">Task (depends on)</label>
          <select className="form-select" value={editTaskId} onChange={(e) => setEditTaskId(e.target.value)}>
            <option value="">Select a task...</option>
            {tasks.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>
        <div className="text-center mb-2">
          <FontAwesomeIcon icon={faArrowRight} className="text-muted" />
          <span className="mx-2 x-small text-muted fw-bold">DEPENDS ON</span>
          <FontAwesomeIcon icon={faArrowRight} className="text-muted" />
        </div>
        <div className="mb-3">
          <label className="form-label small fw-bold">Parent Task (blocker)</label>
          <select className="form-select" value={editDependsOnId} onChange={(e) => setEditDependsOnId(e.target.value)}>
            <option value="">Select a task...</option>
            {tasks.filter(t => t.id !== parseInt(editTaskId)).map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label small fw-bold">Dependency Type</label>
          <select className="form-select" value={editType} onChange={(e) => setEditType(e.target.value)}>
            {Object.entries(depTypeConfig).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
        </div>
      </DialogBox>

      {/* Add Custom Node Modal */}
      <DialogBox
        show={showAddNodeModal}
        onClose={() => { setShowAddNodeModal(false); setAddNodeLabel(''); }}
        title="Add Custom Node"
        size="md"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <button className="btn btn-light rounded-pill px-4" onClick={() => { setShowAddNodeModal(false); setAddNodeLabel(''); }}>Cancel</button>
            <button className="btn btn-success rounded-pill px-4 fw-bold" onClick={handleAddNodeFromModal}>
              <FontAwesomeIcon icon={faPlus} className="me-1" />Add Node
            </button>
          </div>
        }
      >
        <div className="mb-3">
          <label className="form-label small fw-bold">Node Type</label>
          <select className="form-select" value={addNodeType} onChange={(e) => setAddNodeType(e.target.value)}>
            {Object.entries(nodeTypeMeta).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="form-label small fw-bold">Label</label>
          <input type="text" className="form-control" placeholder="e.g. Design Review" value={addNodeLabel}
            onChange={(e) => setAddNodeLabel(e.target.value)} />
          <div className="x-small text-muted mt-1">Leave blank to use the default type name.</div>
        </div>
      </DialogBox>

      {/* Edit Custom Node Modal */}
      <DialogBox
        show={showEditNodeModal}
        onClose={() => { setShowEditNodeModal(false); setEditNodeId(null); }}
        title="Edit Custom Node"
        size="md"
        footer={
          <div className="d-flex justify-content-end gap-2 w-100">
            <button className="btn btn-light rounded-pill px-4" onClick={() => { setShowEditNodeModal(false); setEditNodeId(null); }}>Cancel</button>
            <button className="btn btn-primary rounded-pill px-4 fw-bold" onClick={saveEditNode}>
              <FontAwesomeIcon icon={faSave} className="me-1" />Save Changes
            </button>
          </div>
        }
      >
        <div className="mb-3">
          <label className="form-label small fw-bold">Node Type</label>
          <select className="form-select" value={editNodeType} onChange={(e) => setEditNodeType(e.target.value)}>
            {Object.entries(nodeTypeMeta).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="form-label small fw-bold">Label</label>
          <input type="text" className="form-control" placeholder="Node label" value={editNodeLabel}
            onChange={(e) => setEditNodeLabel(e.target.value)} />
        </div>
      </DialogBox>

      <TaskDetailModal task={selectedTask} show={!!selectedTask} onClose={() => setSelectedTask(null)} />

      <style>{`
        .rounded-5 { border-radius: 2.5rem !important; }
        .x-small { font-size: 10px; }
        .draggable-node:hover { transform: translateX(2px); }
        .draggable-node:active { cursor: grabbing; }
        .text-indigo { color: #6366f1; }
        .bg-indigo { background: #6366f1; }
        .react-flow__node { pointer-events: all !important; }
        .react-flow__node:hover { z-index: 100 !important; }
      `}</style>
    </div>
  );
};

export default TmsDependencies;
