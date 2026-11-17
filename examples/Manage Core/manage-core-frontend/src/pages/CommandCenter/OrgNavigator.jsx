import React, { useState, useEffect, useCallback } from 'react';
import ReactFlow, { 
    addEdge, 
    Background, 
    Controls, 
    useNodesState, 
    useEdgesState,
    Handle,
    Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faShield, faUser, faStar, faBriefcase, faCode, faMicrochip, 
    faSitemap, faAward, faGlobe, faKey, faBuilding, faUsers, faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useApp } from '../../hooks/useApp';
import { listRoles } from '../../api/roles';

const CustomNode = ({ data }) => {
    const { theme } = useApp();
    const isDark = theme === 'dark';

    // Determine custom color styles for Hex strings vs CSS class colors
    const colorStyle = data.color.startsWith('#')
        ? { backgroundColor: `${data.color}15`, color: data.color, border: `1px solid ${data.color}30` }
        : {};
    const colorClass = data.color.startsWith('#')
        ? ''
        : `bg-${data.color} bg-opacity-10 text-${data.color}`;

    return (
        <div className={`p-3 rounded-4 shadow-lg border ${isDark ? 'bg-dark-card border-white border-opacity-10 text-white' : 'bg-white border-gray-200'}`} style={{ minWidth: '170px' }}>
            <Handle 
                type="target" 
                position={Position.Top} 
                style={{ background: data.color.startsWith('#') ? data.color : '#6366f1', border: 'none', width: '8px', height: '8px' }} 
            />
            <div className="d-flex align-items-center gap-3">
                <div 
                    className={`p-2 rounded-3 d-flex align-items-center justify-content-center ${colorClass}`} 
                    style={{ ...colorStyle, width: '36px', height: '36px' }}
                >
                    <FontAwesomeIcon icon={data.icon} />
                </div>
                <div className="overflow-hidden">
                    <div className="fw-black x-small text-uppercase opacity-50" style={{ fontSize: '9px', letterSpacing: '0.5px' }}>{data.type}</div>
                    <div className="fw-bold small text-truncate" style={{ maxWidth: '105px' }} title={data.label}>{data.label}</div>
                </div>
            </div>
            <Handle 
                type="source" 
                position={Position.Bottom} 
                style={{ background: data.color.startsWith('#') ? data.color : '#6366f1', border: 'none', width: '8px', height: '8px' }} 
            />
        </div>
    );
};

const nodeTypes = { custom: CustomNode };

const iconMap = {
    FiShield: faShield,
    FiUser: faUser,
    FiStar: faStar,
    FiBriefcase: faBriefcase,
    FiCode: faCode,
    FiCpu: faMicrochip,
    FiSettings: faSitemap,
    FiZap: faAward,
    FiAward: faAward,
    FiCommand: faSitemap,
    FiGlobe: faGlobe,
    FiKey: faKey,
    faBuilding: faBuilding,
    faUsers: faUsers
};

const defaultRoles = [
    { id: 'role-2', name: 'Administrator', level: 1, color: '#10b981', icon: 'FiSettings' },
    { id: 'role-3', name: 'Department Head', level: 2, color: '#f59e0b', icon: 'FiBriefcase' },
    { id: 'role-4', name: 'Senior Engineer', level: 3, color: '#06b6d4', icon: 'FiCode' },
    { id: 'role-5', name: 'Support Agent', level: 4, color: '#ec4899', icon: 'FiUser' }
];

const OrgNavigator = () => {
    const { theme } = useApp();
    const isDark = theme === 'dark';
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [loading, setLoading] = useState(true);

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    useEffect(() => {
        let isMounted = true;

        const loadRolesData = async () => {
            setLoading(true);
            try {
                const rolesData = await listRoles();
                if (!isMounted) return;

                // Filter active roles and exclude SuperAdmin
                const activeRoles = (rolesData && rolesData.length > 0)
                    ? rolesData.filter(r => r.status && !['superadmin', 'super admin', 'super_admin', 'root super admin'].includes(String(r.name || '').trim().toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ')))
                    : defaultRoles;

                const finalRoles = activeRoles.length > 0 ? activeRoles : defaultRoles;

                // Group roles by level
                const rolesByLevel = {};
                finalRoles.forEach(role => {
                    const level = role.level || 1;
                    if (!rolesByLevel[level]) {
                        rolesByLevel[level] = [];
                    }
                    rolesByLevel[level].push(role);
                });

                // Get sorted levels
                const sortedLevels = Object.keys(rolesByLevel)
                    .map(Number)
                    .sort((a, b) => a - b);

                // Build nodes and edges
                const flowNodes = [];
                const flowEdges = [];

                sortedLevels.forEach((level, levelIdx) => {
                    const rolesAtLevel = rolesByLevel[level];
                    const count = rolesAtLevel.length;
                    const yPos = levelIdx * 135 + 40; // 135px vertical separation

                    rolesAtLevel.forEach((role, idx) => {
                        const spacing = 220;
                        const startX = 250 - ((count - 1) * spacing) / 2;
                        const xPos = startX + idx * spacing;

                        flowNodes.push({
                            id: String(role.id),
                            type: 'custom',
                            position: { x: xPos, y: yPos },
                            data: {
                                label: role.name,
                                type: `Level ${level}`,
                                icon: iconMap[role.icon] || faShield,
                                color: role.color || '#4f46e5'
                            }
                        });
                    });

                    // Build edges from all nodes in current level to all nodes in next level
                    if (levelIdx < sortedLevels.length - 1) {
                        const nextLevel = sortedLevels[levelIdx + 1];
                        const currentRoles = rolesByLevel[level];
                        const nextRoles = rolesByLevel[nextLevel];

                        currentRoles.forEach(currRole => {
                            nextRoles.forEach(nextRole => {
                                flowEdges.push({
                                    id: `e-${currRole.id}-${nextRole.id}`,
                                    source: String(currRole.id),
                                    target: String(nextRole.id),
                                    animated: true,
                                    style: { stroke: currRole.color || '#4f46e5', strokeWidth: 1.5, opacity: 0.6 }
                                });
                            });
                        });
                    }
                });

                setNodes(flowNodes);
                setEdges(flowEdges);
            } catch (err) {
                console.error("Failed to load roles hierarchy in OrgNavigator:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadRolesData();
        return () => {
            isMounted = false;
        };
    }, [setNodes, setEdges]);

    return (
        <div style={{ height: '450px', width: '100%', background: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)', borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
            {loading ? (
                <div className="position-absolute top-50 start-50 translate-middle text-center">
                    <FontAwesomeIcon icon={faSpinner} spin size="2xl" className="text-primary mb-2" />
                    <div className="small text-muted">Building Roles Hierarchy Chart...</div>
                </div>
            ) : (
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                    minZoom={0.5}
                    maxZoom={1.5}
                >
                    <Background color={isDark ? '#333' : '#ccc'} gap={20} />
                    <Controls />
                </ReactFlow>
            )}
        </div>
    );
};

export default OrgNavigator;
