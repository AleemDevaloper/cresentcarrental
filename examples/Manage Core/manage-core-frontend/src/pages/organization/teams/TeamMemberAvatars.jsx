import React from 'react';

const TeamMemberAvatars = ({ members, totalCount }) => {
  const extra = totalCount - members.length;

  return (
    <div className="d-flex align-items-center team-avatar-stack">
      {members.map((member, index) => (
        <div
          key={member.id}
          className="team-avatar rounded-circle d-flex align-items-center justify-content-center border border-2 border-white shadow-sm transition hover-lift"
          style={{
            width: 36,
            height: 36,
            backgroundColor: member.color,
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            marginLeft: index > 0 ? -12 : 0,
            zIndex: members.length - index,
            cursor: 'pointer'
          }}
          title={member.name}
        >
          {member.initials}
        </div>
      ))}
      {extra > 0 && (
        <div
          className="team-avatar rounded-circle d-flex align-items-center justify-content-center border border-2 border-white bg-light text-muted shadow-sm small fw-bold"
          style={{ width: 36, height: 36, marginLeft: -12, zIndex: 0, fontSize: 11 }}
        >
          +{extra}
        </div>
      )}
    </div>
  );
};

export default TeamMemberAvatars;
