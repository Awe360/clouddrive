import React, { useState, useRef } from 'react';

interface UploadZoneProps {
  onUpload: (file: File) => Promise<boolean>;
  uploading: boolean;
}

export default function UploadZone({ onUpload, uploading }: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    setError(null);
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError('File is too large. Maximum size is 50MB.');
      return;
    }
    const success = await onUpload(file);
    if (!success) {
      setError('Failed to upload file. Mime-type unsupported or server error.');
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
      // Reset input value so same file can be uploaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="upload-container">
      <div
        className={`upload-zone glass-card ${isDragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="file-input-hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />
        
        <div className="upload-content">
          <div className="upload-icon">
            {uploading ? '🔄' : '📤'}
          </div>
          {uploading ? (
            <p className="upload-text">Uploading to S3 storage bucket...</p>
          ) : (
            <>
              <p className="upload-text">
                Drag & drop files here, or <span className="click-highlight">browse</span>
              </p>
              <p className="upload-subtext">Supports images, documents, and archives up to 50MB</p>
            </>
          )}
        </div>
      </div>
      
      {error && (
        <div className="upload-error">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
}
