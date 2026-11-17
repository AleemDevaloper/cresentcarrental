import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiShield, FiUsers, FiKey } from 'react-icons/fi';
import { listRoles } from '../../api/roles';
import { listUsers } from '../../api/users';
import { useApp } from '../../hooks/useApp';
import Common from '../../components/common/Common';
import TopNavBar from '../../components/layout/TopNavBar';

const RoleProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addNotification } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [role, setRole] = useState(null);
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([listRoles(), listUsers()])
      .then(([roles, users]) => {
        if (cancelled) return;
        const selected = roles.find((item) => String(item.id) === String(id));
        if (!selected) {
          addNotification('Role profile was not found.', 'warning');
          navigate('/admin-dashboard');
          return;
        }
        setRole(selected);
        setUserCount(users.filter((user) =>
          String(user.roleId || '') === String(selected.id) ||
          (!user.roleId && user.role === selected.name)
        ).length);
      })
      .catch((error) => {
        if (!cancelled) addNotification(error?.message || 'Failed to load role profile.', 'danger');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [addNotification, id, navigate]);

  const content = loading ? (
    <div className="d-flex flex-column align-items-center justify-content-center h-100 gap-3">
      <div className="spinner-border text-primary" role="status" />
      <span className="text-muted">Loading role profile...</span>
    </div>
  ) : role ? (
    <div className="container-fluid py-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <button className="btn btn-light rounded-pill d-flex align-items-center gap-2" onClick={() => navigate('/admin-dashboard')}>
          <FiArrowLeft /> Back to Roles
        </button>
        <button className="btn btn-primary rounded-pill d-flex align-items-center gap-2" onClick={() => navigate(`/admin-dashboard/roles/edit/${role.id}`)}>
          <FiEdit2 /> Edit Role
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="p-4 p-lg-5" style={{ borderTop: `5px solid ${role.color || '#4F46E5'}` }}>
          <div className="d-flex align-items-center gap-4 mb-4">
            <div className="role-profile-icon rounded-4 d-flex align-items-center justify-content-center" style={{ color: role.color || '#4F46E5', backgroundColor: `${role.color || '#4F46E5'}18` }}>
              <FiShield size={54} strokeWidth={2} />
            </div>
            <div>
              <div className="text-uppercase small fw-bold text-muted">Role Profile</div>
              <h1 className="mb-1 fw-bold">{role.name}</h1>
              <span className="badge rounded-pill" style={{ color: role.color || '#4F46E5', backgroundColor: `${role.color || '#4F46E5'}18` }}>Level {role.level || 1}</span>
            </div>
          </div>
          <p className="text-muted fs-5 mb-4">{role.description || 'No description provided for this role.'}</p>
          <div className="row g-3">
            <div className="col-sm-4"><div className="p-3 rounded-3 bg-light"><FiUsers className="me-2 text-primary" />{userCount} Members</div></div>
            <div className="col-sm-4"><div className="p-3 rounded-3 bg-light"><FiKey className="me-2 text-primary" />{role.permissions?.length || 0} Permissions</div></div>
            <div className="col-sm-4"><div className="p-3 rounded-3 bg-light"><span className={`status-dot me-2 ${role.status ? 'bg-success' : 'bg-secondary'}`} />{role.status ? 'Active' : 'Inactive'}</div></div>
          </div>
        </div>
      </div>
      <style>{`.role-profile-icon { width: 112px; height: 112px; flex: 0 0 112px; }`}</style>
    </div>
  ) : null;

  return (
    <div className="container-fluid vh-100 px-0 overflow-hidden">
      <div className="d-flex h-100">
        <Common isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="flex-grow-1 d-flex flex-column min-w-0" style={{ backgroundColor: 'var(--background)' }}>
          <TopNavBar
            heading="Role Profile"
            isSidebarOpen={isSidebarOpen}
            onToggleSidebar={() => setIsSidebarOpen((previous) => !previous)}
          />
          <div className="flex-grow-1 overflow-y-auto">{content}</div>
        </div>
      </div>
    </div>
  );
};

export default RoleProfile;
