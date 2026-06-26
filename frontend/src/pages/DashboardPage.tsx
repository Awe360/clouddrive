import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import UploadZone from '../components/UploadZone';
import FileCard from '../components/FileCard';
import type { User, FileRecord, FileStats } from '../types';

interface DashboardPageProps {
  user: User | null;
  loading: boolean;
  logout: () => void;
  files: FileRecord[];
  stats: FileStats;
  filesLoading: boolean;
  uploading: boolean;
  filesError: string | null;
  uploadFile: (file: File) => Promise<boolean>;
  downloadFile: (id: number) => Promise<boolean>;
  deleteFile: (id: number) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export default function DashboardPage({
  user,
  loading,
  logout,
  files,
  stats,
  filesLoading,
  uploading,
  filesError,
  uploadFile,
  downloadFile,
  deleteFile,
  refresh
}: DashboardPageProps) {
  const [activeTab, setActiveTab] = useState('files');
  const navigate = useNavigate();

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Trigger data refresh when tab changes to dashboard files
  useEffect(() => {
    if (user && activeTab === 'files') {
      refresh();
    }
  }, [activeTab, user]);

  if (loading || (!user && loading)) {
    return (
      <div className="fullscreen-loader">
        <div className="spinner"></div>
        <p>Loading CloudDrive Dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="dashboard-layout">
      <Navbar user={user} onLogout={logout} />
      
      <div className="dashboard-body">
        <Sidebar stats={stats} activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="dashboard-content">
          {activeTab === 'files' && (
            <div className="tab-pane animate-fade-in">
              <header className="content-header">
                <div>
                  <h2 className="content-title">My Files</h2>
                  <p className="content-subtitle">
                    Manage and share your S3 bucket files ({stats.count} files total)
                  </p>
                </div>
                <button onClick={() => refresh()} className="btn btn-ghost refresh-btn" disabled={filesLoading}>
                  {filesLoading ? '🔄' : 'Refresh ↻'}
                </button>
              </header>

              {filesError && (
                <div className="alert alert-error">
                  ⚠️ Error: {filesError}
                </div>
              )}

              {/* Upload Zone */}
              <UploadZone onUpload={uploadFile} uploading={uploading} />

              {/* Files Grid */}
              <section className="files-section">
                <h3 className="section-title">All Files</h3>
                
                {filesLoading && files.length === 0 ? (
                  <div className="files-grid-skeleton">
                    <div className="skeleton-card glass-card"></div>
                    <div className="skeleton-card glass-card"></div>
                    <div className="skeleton-card glass-card"></div>
                  </div>
                ) : files.length === 0 ? (
                  <div className="empty-state glass-card">
                    <span className="empty-state-icon">📂</span>
                    <h4>No files uploaded yet</h4>
                    <p>Drag and drop a file above or click to browse files to get started.</p>
                  </div>
                ) : (
                  <div className="files-grid">
                    {files.map((file) => (
                      <FileCard
                        key={file.id}
                        file={file}
                        onDownload={downloadFile}
                        onDelete={deleteFile}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {activeTab === 'recent' && (
            <div className="tab-pane animate-fade-in">
              <h2 className="content-title">Recent Files</h2>
              <p className="content-subtitle">Files uploaded or viewed in the last 24 hours.</p>
              
              <div className="empty-state glass-card">
                <span className="empty-state-icon">🕒</span>
                <h4>No recent activities</h4>
                <p>Upload a file to see recent interactions here.</p>
              </div>
            </div>
          )}

          {activeTab === 'shared' && (
            <div className="tab-pane animate-fade-in">
              <h2 className="content-title">Shared Links</h2>
              <p className="content-subtitle">Manage public access links generated for your files.</p>
              
              <div className="empty-state glass-card">
                <span className="empty-state-icon">🔗</span>
                <h4>No shared links created</h4>
                <p>Generating a shared download link creates a temporary secure token for others.</p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="tab-pane animate-fade-in">
              <h2 className="content-title">Profile Settings</h2>
              <p className="content-subtitle">Update your profile parameters.</p>
              
              <div className="settings-card glass-card">
                <div className="settings-row">
                  <div className="settings-label">User ID</div>
                  <div className="settings-value">{user.id}</div>
                </div>
                <div className="settings-row">
                  <div className="settings-label">Full Name</div>
                  <div className="settings-value">{user.name}</div>
                </div>
                <div className="settings-row">
                  <div className="settings-label">Email Address</div>
                  <div className="settings-value">{user.email}</div>
                </div>
                <div className="settings-row">
                  <div className="settings-label">Account Created</div>
                  <div className="settings-value">
                    {new Date(user.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
