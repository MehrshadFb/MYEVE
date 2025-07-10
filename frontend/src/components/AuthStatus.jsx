import React from 'react';
import useAuth from '../context/useAuth';

function AuthStatus() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: '#ff6b6b',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '14px',
          zIndex: 1000,
        }}
      >
        Not Signed In
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: '#51cf66',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '14px',
        zIndex: 1000,
      }}
    >
      Signed In: {user?.username} ({user?.role})
    </div>
  );
}

export default AuthStatus;
