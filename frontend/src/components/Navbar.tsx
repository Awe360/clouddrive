import React from 'react';
import type { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  // Extract initials for avatar placeholder
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="navbar glass-effect">
      <div className="navbar-brand">
        <span className="navbar-logo">☁️</span>
        <span className="navbar-title gradient-text">CloudDrive</span>
      </div>

      {user && (
        <div className="navbar-actions">
          <div className="user-profile">
            <div className="user-avatar" title={user.name}>
              {getInitials(user.name)}
            </div>
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
            </div>
          </div>
          <button onClick={onLogout} className="btn btn-ghost logout-btn">
            Logout ↗
          </button>
        </div>
      )}
    </header>
  );
}
