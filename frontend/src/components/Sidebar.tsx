import React from 'react';
import type { FileStats } from '../types';

interface SidebarProps {
  stats: FileStats;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ stats, activeTab, setActiveTab }: SidebarProps) {
  const FREE_TIER_LIMIT_BYTES = 5 * 1024 * 1024 * 1024; // 5 GB

  // Helper to format sizes nicely
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const percentageUsed = Math.min(
    (stats.total_bytes / FREE_TIER_LIMIT_BYTES) * 100,
    100
  );

  const menuItems = [
    { id: 'files', label: 'My Files', icon: '📁' },
    { id: 'recent', label: 'Recent', icon: '🕒' },
    { id: 'shared', label: 'Shared', icon: '🔗' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <aside className="sidebar glass-effect">
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`sidebar-link ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="storage-meter">
          <div className="storage-meter-header">
            <span>Storage Used</span>
            <span>{percentageUsed.toFixed(1)}%</span>
          </div>
          <div className="storage-progress-bg">
            <div
              className="storage-progress-fill"
              style={{ width: `${percentageUsed}%` }}
            ></div>
          </div>
          <div className="storage-meter-footer">
            {formatBytes(stats.total_bytes)} of 5.0 GB
          </div>
        </div>
      </div>
    </aside>
  );
}
