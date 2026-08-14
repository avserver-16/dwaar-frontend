import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, FileText } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../utils/cn';

interface FileUploadProps {
  onUpload: (file: File) => void;
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  accept = 'image/*,.pdf,.doc,.docx',
  maxSize = 5 * 1024 * 1024, // 5MB default
  className,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setError(null);

    if (selectedFile.size > maxSize) {
      setError('File size exceeds limit');
      return;
    }

    setFile(selectedFile);

    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      await onUpload(file);
      setFile(null);
      setPreview(null);
    } catch (err) {
      setError('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className={cn('w-full', className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={accept}
        className="hidden"
      />

      {!file ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-dark-700 rounded-lg p-6 text-center cursor-pointer hover:border-primary-500 transition-colors"
        >
          <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-sm text-gray-400">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Max size: {formatFileSize(maxSize)}
          </p>
        </div>
      ) : (
        <div className="border border-dark-700 rounded-lg p-4">
          <div className="flex items-start gap-3">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-16 h-16 object-cover rounded-lg"
              />
            ) : (
              <div className="w-16 h-16 bg-dark-800 rounded-lg flex items-center justify-center">
                {file.type.startsWith('image/') ? (
                  <ImageIcon className="w-8 h-8 text-gray-500" />
                ) : (
                  <FileText className="w-8 h-8 text-gray-500" />
                )}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate font-medium">
                {file.name}
              </p>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
              {error && (
                <p className="text-xs text-red-500 mt-1">{error}</p>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemove}
              disabled={isUploading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-2 mt-3">
            <Button
              variant="primary"
              size="sm"
              onClick={handleUpload}
              isLoading={isUploading}
              className="flex-1"
            >
              Upload
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRemove}
              disabled={isUploading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};