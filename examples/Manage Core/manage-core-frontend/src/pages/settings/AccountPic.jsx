import React from 'react';
import { useApp } from '../../hooks/useApp';


const AccountPic = () => {
  const { currentUser } = useApp();

  return (
    <div className="container p-0">
       <div className="card-body p-0">
              <div className="text-center">
                <div
                  className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center overflow-hidden shadow-sm"
                  style={{ width: '100%', height: '100%', aspectRatio: '1/1', fontSize: '2.5rem', border: '4px solid #fff' }}
                >
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    currentUser?.name?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </div>
               </div>
            </div>
    </div>
  );
};

export default AccountPic;