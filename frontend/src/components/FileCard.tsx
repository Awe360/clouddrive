import { useState } from 'react';
import type { FileRecord } from '../types';

interface FileCardProps {
  file: FileRecord;
  onDownload: (id: number) => Promise<boolean>;
  onDelete: (id: number) => Promise<boolean>;
}

export default function FileCard({ file, onDownload, onDelete }: FileCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Helper to format bytes
  const formatBytes = (bytes: number, decimals = 1) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Helper to get file extension icon/emoji
  const getFileEmoji = (mime: string) => {
    if (mime.startsWith('image/')) return '🖼️';
    if (mime.startsWith('video/')) return '🎥';
    if (mime.startsWith('audio/')) return '🎵';
    if (mime.startsWith('text/')) return '📝';
    if (mime === 'application/pdf') return '📄';
    if (mime === 'application/zip' || mime.includes('compressed')) return '📦';
    if (mime.includes('word') || mime.includes('document')) return '🗂️';
    if (mime.includes('excel') || mime.includes('sheet')) return '📈';
    return '📁';
  };

  const handleDownload = async () => {
    setDownloading(true);
    await onDownload(file.id);
    setDownloading(false);
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to permanently delete "${file.filename}"?`)) {
      setDeleting(true);
      await onDelete(file.id);
      setDeleting(false);
    }
  };

  const formattedDate = new Date(file.uploaded_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="file-card glass-card">
      <div className="file-card-icon">
        {getFileEmoji(file.mime_type)}
      </div>
      <div className="file-card-details">
        <h4 className="file-name" title={file.filename}>
          {file.filename}
        </h4>
        <div className="file-meta">
          <span className="file-size">{formatBytes(file.size_bytes)}</span>
          <span className="file-divider">•</span>
          <span className="file-date">{formattedDate}</span>
        </div>
      </div>
      <div className="file-card-actions">
        <button
          onClick={handleDownload}
          disabled={downloading || deleting}
          className="btn btn-icon btn-ghost"
          title="Download File"
        >
          {downloading ? '⏳' : '📥'}
        </button>
        <button
          onClick={handleDelete}
          disabled={downloading || deleting}
          className="btn btn-icon btn-ghost btn-danger"
          title="Delete File"
        >
          {deleting ? '⏳' : '🗑️'}
        </button>
      </div>
    </div>
  );
}
