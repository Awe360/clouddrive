import { useState, useEffect } from 'react';
import client from '../api/client';
import type { FileRecord, FileStats } from '../types';

export function useFiles(isAuthenticated: boolean) {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [stats, setStats] = useState<FileStats>({ count: 0, total_bytes: 0 });
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all files metadata
  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.get<{ files: FileRecord[] }>('/files');
      setFiles(response.data.files);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load files.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch file storage stats
  const fetchStats = async () => {
    try {
      const response = await client.get<FileStats>('/files/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch file stats:', err);
    }
  };

  // Refresh data helper
  const refresh = async () => {
    if (isAuthenticated) {
      await Promise.all([fetchFiles(), fetchStats()]);
    }
  };

  // Run on authenticated mount
  useEffect(() => {
    if (isAuthenticated) {
      refresh();
    } else {
      setFiles([]);
      setStats({ count: 0, total_bytes: 0 });
    }
  }, [isAuthenticated]);

  /**
   * Upload file to backend
   */
  const uploadFile = async (file: File): Promise<boolean> => {
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      await client.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      await refresh();
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'File upload failed. Ensure it is under 50MB and supported.');
      return false;
    } finally {
      setUploading(false);
    }
  };

  /**
   * Download a file by requesting a presigned URL and opening it
   */
  const downloadFile = async (id: number): Promise<boolean> => {
    try {
      const response = await client.get<{ url: string }>([`/files`, id, `download`].join('/'));
      const downloadUrl = response.data.url;
      // Open the signed S3 link in a new window or trigger download
      window.open(downloadUrl, '_blank');
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to download file.');
      return false;
    }
  };

  /**
   * Delete a file
   */
  const deleteFile = async (id: number): Promise<boolean> => {
    try {
      await client.delete([`/files`, id].join('/'));
      await refresh();
      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete file.');
      return false;
    }
  };

  return {
    files,
    stats,
    loading,
    uploading,
    error,
    fetchFiles,
    fetchStats,
    uploadFile,
    downloadFile,
    deleteFile,
    refresh
  };
}
